"use client";

import clsx from "clsx";
import { useAnimatedValues } from "@/lib/useAnimatedValues";

/**
 * Inline-SVG radar chart. Built here rather than pulled from a chart library
 * because the stack is deliberately dependency-light (CLAUDE.md #9).
 *
 * Three series tones:
 *  - "ghost": dashed, no fill — a prediction or a comparison profile.
 *  - "real": solid with a translucent accent fill — the profile that matters.
 *  - "option": one of several peers (Day 13's A / B / C). Each carries its own
 *    colour, dash pattern and marker shape, so the chart never relies on colour
 *    alone to tell them apart.
 *
 * With `animate`, vertices ease to new values (requestAnimationFrame, reduced-
 * motion safe) — SVG `points` cannot be CSS-transitioned reliably.
 */

export type RadarAxis = {
  key: string;
  /** Short label rendered around the chart — one word wherever possible. */
  label: string;
  /** Full name, used for the accessible description. */
  full?: string;
};

export type SeriesStyle = {
  color: "accent" | "ink" | "warn";
  /** SVG dash array, e.g. "7 4". Omit for a solid line. */
  dash?: string;
  marker: "circle" | "square" | "triangle";
};

export type RadarSeries = {
  id: string;
  label: string;
  /** Axis key → value. Missing or 0 is treated as "not set" and collapses to the centre. */
  values: Record<string, number>;
  tone: "real" | "ghost" | "option";
  style?: SeriesStyle;
};

const VIEW_W = 440;
const VIEW_H = 360;
const CX = 220;
const CY = 172;
const R = 110;
const LABEL_R = 134;

const STROKE: Record<SeriesStyle["color"], string> = {
  accent: "stroke-accent",
  ink: "stroke-ink",
  warn: "stroke-warn",
};
const FILL: Record<SeriesStyle["color"], string> = {
  accent: "fill-accent",
  ink: "fill-ink",
  warn: "fill-warn",
};

/** Axis i sits at 12 o'clock + i steps clockwise. */
function angleFor(i: number, count: number) {
  return -Math.PI / 2 + (i * 2 * Math.PI) / count;
}

/**
 * Rounded to 2dp: `Math.cos`/`Math.sin` can differ in the last bit or two
 * between the server's and the browser's JS engine, and an unrounded result
 * fed straight into an SVG coordinate becomes a hydration mismatch the moment
 * it's printed to 15+ significant digits. 2dp is sub-pixel at this viewBox
 * size and collapses that difference before it becomes a string.
 */
const round2 = (v: number) => Math.round(v * 100) / 100;

function pointAt(i: number, count: number, radius: number) {
  const a = angleFor(i, count);
  return [round2(CX + radius * Math.cos(a)), round2(CY + radius * Math.sin(a))] as const;
}

function Marker({ x, y, shape, className }: { x: number; y: number; shape: SeriesStyle["marker"]; className: string }) {
  if (shape === "square") return <rect x={x - 3.6} y={y - 3.6} width={7.2} height={7.2} className={className} />;
  if (shape === "triangle")
    return <path d={`M${x},${y - 4.6} L${x + 4.2},${y + 3.2} L${x - 4.2},${y + 3.2} Z`} className={className} />;
  return <circle cx={x} cy={y} r={3.6} className={className} />;
}

function SeriesShape({
  axes,
  series,
  max,
  animate,
}: {
  axes: RadarAxis[];
  series: RadarSeries;
  max: number;
  animate: boolean;
}) {
  const targets = axes.map((ax) => Math.max(0, Math.min(max, series.values[ax.key] ?? 0)));
  const eased = useAnimatedValues(targets, 450);
  const values = animate ? eased : targets;

  const points = values
    .map((v, i) => {
      const [x, y] = pointAt(i, axes.length, (v / max) * R);
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(" ");

  if (series.tone === "option") {
    const style = series.style ?? { color: "accent", marker: "circle" };
    return (
      <g>
        <polygon
          points={points}
          className={clsx(FILL[style.color], STROKE[style.color])}
          fillOpacity={0.07}
          strokeWidth={2.2}
          strokeDasharray={style.dash}
          strokeLinejoin="round"
        />
        {values.map((v, i) => {
          if (targets[i] <= 0) return null;
          const [x, y] = pointAt(i, axes.length, (v / max) * R);
          return <Marker key={axes[i].key} x={x} y={y} shape={style.marker} className={FILL[style.color]} />;
        })}
      </g>
    );
  }

  const ghost = series.tone === "ghost";
  return (
    <g>
      <polygon
        points={points}
        className={ghost ? "fill-none stroke-ash" : "fill-accent/15 stroke-accent"}
        strokeWidth={ghost ? 1.8 : 2.4}
        strokeDasharray={ghost ? "6 5" : undefined}
        strokeLinejoin="round"
      />
      {values.map((v, i) => {
        if (targets[i] <= 0) return null;
        const [x, y] = pointAt(i, axes.length, (v / max) * R);
        return (
          <circle
            key={axes[i].key}
            cx={x}
            cy={y}
            r={ghost ? 2.6 : 3.4}
            className={ghost ? "fill-ash" : "fill-accent"}
          />
        );
      })}
    </g>
  );
}

export function RadarChart({
  axes,
  series,
  max = 5,
  ringCount,
  showGrid = true,
  animate = false,
  className,
  title,
}: {
  axes: RadarAxis[];
  series: RadarSeries[];
  max?: number;
  /** Grid rings to draw. Defaults to one per scale step, which is too dense above ~5. */
  ringCount?: number;
  /**
   * Draw rings, spokes, axis labels and the scale hint. Set false for a chart
   * stacked on top of another one as a fade-in overlay, so the grid is not
   * drawn twice.
   */
  showGrid?: boolean;
  /** Ease vertices to new values instead of jumping. */
  animate?: boolean;
  className?: string;
  title: string;
}) {
  const ringN = ringCount ?? max;
  const rings = Array.from({ length: ringN }, (_, i) => (i + 1) / ringN);
  const ordered = [...series].sort((a, b) => (a.tone === "ghost" ? -1 : 0) - (b.tone === "ghost" ? -1 : 0));

  return (
    <svg
      viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
      preserveAspectRatio="xMidYMid meet"
      role="img"
      aria-label={title}
      className={clsx("h-auto w-full", className)}
    >
      <title>{title}</title>

      {/* Grid rings */}
      {showGrid &&
        rings.map((f, ri) => (
          <polygon
            key={ri}
            points={axes
              .map((_, i) => {
                const [x, y] = pointAt(i, axes.length, R * f);
                return `${x.toFixed(1)},${y.toFixed(1)}`;
              })
              .join(" ")}
            className={ri === rings.length - 1 ? "fill-none stroke-line" : "fill-none stroke-line/60"}
            strokeWidth={1}
          />
        ))}

      {/* Spokes */}
      {showGrid &&
        axes.map((ax, i) => {
          const [x, y] = pointAt(i, axes.length, R);
          return <line key={ax.key} x1={CX} y1={CY} x2={x} y2={y} className="stroke-line" strokeWidth={1} />;
        })}

      {/* Series — ghosts first so solid profiles read on top */}
      {ordered.map((s) => (
        <SeriesShape key={s.id} axes={axes} series={s} max={max} animate={animate} />
      ))}

      {/* Axis labels */}
      {showGrid &&
        axes.map((ax, i) => {
          const [x, y] = pointAt(i, axes.length, LABEL_R);
          const cos = Math.cos(angleFor(i, axes.length));
          const anchor = cos > 0.15 ? "start" : cos < -0.15 ? "end" : "middle";
          return (
            <text
              key={ax.key}
              x={x}
              y={y + 4}
              textAnchor={anchor}
              className="fill-ash"
              style={{ fontSize: 12, fontWeight: 600 }}
            >
              {ax.label}
            </text>
          );
        })}

      {/* Scale hint on the vertical spoke */}
      {showGrid && (
        <>
          <text x={CX + 5} y={CY - R + 4} className="fill-ash" style={{ fontSize: 11 }}>
            {max}
          </text>
          <text x={CX + 5} y={CY - 3} className="fill-ash" style={{ fontSize: 11 }}>
            0
          </text>
        </>
      )}
    </svg>
  );
}

/** Shared legend for a predicted-vs-real pair. */
export function RadarLegend({ ghostLabel, realLabel }: { ghostLabel: string; realLabel: string }) {
  return (
    <div className="flex flex-wrap items-center gap-4">
      <span className="inline-flex items-center gap-2 text-micro text-ash">
        <svg width="26" height="8" aria-hidden="true">
          <line x1="0" y1="4" x2="26" y2="4" className="stroke-ash" strokeWidth="1.8" strokeDasharray="6 5" />
        </svg>
        {ghostLabel}
      </span>
      <span className="inline-flex items-center gap-2 text-micro text-ink">
        <svg width="26" height="8" aria-hidden="true">
          <line x1="0" y1="4" x2="26" y2="4" className="stroke-accent" strokeWidth="2.4" />
        </svg>
        {realLabel}
      </span>
    </div>
  );
}

/** A legend swatch for an "option" series: its colour, dash and marker together. */
export function SeriesSwatch({ style }: { style: SeriesStyle }) {
  return (
    <svg width="34" height="12" aria-hidden="true" className="shrink-0">
      <line x1="1" y1="6" x2="33" y2="6" className={STROKE[style.color]} strokeWidth="2.2" strokeDasharray={style.dash} />
      <Marker x={17} y={6} shape={style.marker} className={FILL[style.color]} />
    </svg>
  );
}
