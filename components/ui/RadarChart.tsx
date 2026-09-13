"use client";

import clsx from "clsx";

/**
 * Inline-SVG radar chart. Built here rather than pulled from a chart library
 * because the stack is deliberately dependency-light (CLAUDE.md #9) and because
 * the one thing this has to do well — overlay a learner's *prediction* on the
 * *real* profile so the gap is visible without anyone being told they were
 * wrong — is not what a generic chart component is shaped for.
 *
 * A "ghost" series draws dashed with no fill; a "real" series draws solid with
 * a translucent accent fill. Draw the ghost first and it sits underneath.
 */

export type RadarAxis = {
  key: string;
  /** Short label rendered around the chart — one word wherever possible. */
  label: string;
  /** Full name, used for the accessible description. */
  full?: string;
};

export type RadarSeries = {
  id: string;
  label: string;
  /** Axis key → value. Missing or 0 is treated as "not set" and collapses to the centre. */
  values: Record<string, number>;
  tone: "real" | "ghost";
};

const VIEW_W = 440;
const VIEW_H = 360;
const CX = 220;
const CY = 172;
const R = 110;
const LABEL_R = 134;

/** Axis i sits at 12 o'clock + i steps clockwise. */
function angleFor(i: number, count: number) {
  return -Math.PI / 2 + (i * 2 * Math.PI) / count;
}

function pointAt(i: number, count: number, radius: number) {
  const a = angleFor(i, count);
  return [CX + radius * Math.cos(a), CY + radius * Math.sin(a)] as const;
}

function polygonFor(axes: RadarAxis[], values: Record<string, number>, max: number) {
  return axes
    .map((ax, i) => {
      const v = Math.max(0, Math.min(max, values[ax.key] ?? 0));
      const [x, y] = pointAt(i, axes.length, (v / max) * R);
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(" ");
}

export function RadarChart({
  axes,
  series,
  max = 5,
  ringCount,
  showGrid = true,
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
  className?: string;
  title: string;
}) {
  const ringN = ringCount ?? max;
  const rings = Array.from({ length: ringN }, (_, i) => (i + 1) / ringN);

  return (
    <svg
      viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
      role="img"
      aria-label={title}
      className={clsx("h-auto w-full", className)}
    >
      <title>{title}</title>

      {/* Grid rings */}
      {showGrid && rings.map((f, ri) => (
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
      {showGrid && axes.map((ax, i) => {
        const [x, y] = pointAt(i, axes.length, R);
        return <line key={ax.key} x1={CX} y1={CY} x2={x} y2={y} className="stroke-line" strokeWidth={1} />;
      })}

      {/* Series — ghost first so the real profile reads on top */}
      {[...series].sort((a) => (a.tone === "ghost" ? -1 : 1)).map((s) => {
        const ghost = s.tone === "ghost";
        return (
          <g key={s.id}>
            <polygon
              points={polygonFor(axes, s.values, max)}
              className={ghost ? "fill-none stroke-ash" : "fill-accent/15 stroke-accent"}
              strokeWidth={ghost ? 1.8 : 2.4}
              strokeDasharray={ghost ? "6 5" : undefined}
              strokeLinejoin="round"
            />
            {axes.map((ax, i) => {
              const v = s.values[ax.key] ?? 0;
              if (v <= 0) return null;
              const [x, y] = pointAt(i, axes.length, (v / max) * R);
              return (
                <circle
                  key={ax.key}
                  cx={x}
                  cy={y}
                  r={ghost ? 2.6 : 3.4}
                  className={ghost ? "fill-ash" : "fill-accent"}
                />
              );
            })}
          </g>
        );
      })}

      {/* Axis labels */}
      {showGrid && axes.map((ax, i) => {
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
