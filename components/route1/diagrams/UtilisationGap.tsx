"use client";

import { useId, useState } from "react";
import clsx from "clsx";
import { useInView } from "@/lib/useInView";
import { GAP_LABELS, GAP_POWER, GAP_TRAFFIC, LEGACY_OVERLAP } from "@/lib/route1";
import { Overlay, svgId } from "./Overlay";

/**
 * SVG #1 — The Utilisation Gap. Left: an illustrative 24-hour day on one link,
 * traffic as stepped bars and power draw as a nearly flat line, with the area
 * between them shaded as energy consumed without useful load (revealed on
 * scroll). Right: the fact-bank 3G overlap — a third of the energy for a sliver
 * of the traffic. Hover, tap or arrow keys move the hour readout.
 */

const VW = 600;
const VH = 340;
const X0 = 64;
const X1 = 580;
const Y_TOP = 24;
const Y_BOTTOM = 296;

const hx = (h: number) => X0 + (h / 24) * (X1 - X0);
const vy = (v: number) => Y_BOTTOM - (v / 100) * (Y_BOTTOM - Y_TOP);
const hh = (h: number) => `${String(h).padStart(2, "0")}:00`;

export function UtilisationGap() {
  const { ref, seen } = useInView<HTMLDivElement>(0.3);
  const [hour, setHour] = useState<number | null>(null);
  const rid = useId();
  const hatch = svgId(rid, "gap-hatch");

  const powerLine = GAP_POWER.map((v, h) => `${hx(h).toFixed(1)},${vy(v).toFixed(1)}`).join(" ");

  // Gap polygon: along the power line left → right, back along the top of the traffic steps.
  const back: string[] = [];
  for (let h = 23; h >= 0; h--) {
    back.push(`${hx(h + 1).toFixed(1)},${vy(GAP_TRAFFIC[h]).toFixed(1)}`, `${hx(h).toFixed(1)},${vy(GAP_TRAFFIC[h]).toFixed(1)}`);
  }
  const gapPolygon = `${powerLine} ${back.join(" ")}`;

  const active = hour ?? null;

  return (
    <div ref={ref} className="space-y-4">
      <div className="grid gap-5 md:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
        {/* Left panel */}
        <figure className="min-w-0">
          <figcaption className="text-micro font-semibold uppercase tracking-wide text-ash">
            One link across 24 hours
          </figcaption>
          <div
            className="relative mt-2 rounded-lg outline-none focus-visible:ring-2 focus-visible:ring-accent"
            tabIndex={0}
            aria-label="Hour readout. Use the left and right arrow keys to move through the day."
            onKeyDown={(e) => {
              if (e.key === "ArrowRight") {
                e.preventDefault();
                setHour((h) => Math.min(23, (h ?? -1) + 1));
              } else if (e.key === "ArrowLeft") {
                e.preventDefault();
                setHour((h) => Math.max(0, (h ?? 24) - 1));
              }
            }}
            onMouseLeave={() => setHour(null)}
          >
            <svg
              viewBox={`0 0 ${VW} ${VH}`}
              preserveAspectRatio="xMidYMid meet"
              role="img"
              aria-label="Traffic load rises and falls over the day while power draw stays nearly flat; the gap between them is energy consumed without useful load."
              className="h-auto w-full"
            >
              <title>The Utilisation Gap</title>
              <defs>
                <pattern id={hatch} width="8" height="8" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
                  <rect width="8" height="8" className="fill-warn/10" />
                  <line x1="0" y1="0" x2="0" y2="8" className="stroke-warn/60" strokeWidth="2.2" />
                </pattern>
              </defs>

              {/* Grid */}
              {[0, 50, 100].map((v) => (
                <line key={v} x1={X0} y1={vy(v)} x2={X1} y2={vy(v)} className="stroke-line" strokeWidth={1} />
              ))}
              {[0, 6, 12, 18, 24].map((h) => (
                <line key={h} x1={hx(h)} y1={Y_BOTTOM} x2={hx(h)} y2={Y_BOTTOM + 6} className="stroke-line" strokeWidth={1.2} />
              ))}

              {/* Traffic as stepped bars */}
              {GAP_TRAFFIC.slice(0, 24).map((v, h) => (
                <rect
                  key={h}
                  x={hx(h) + 0.6}
                  y={vy(v)}
                  width={hx(h + 1) - hx(h) - 1.2}
                  height={Y_BOTTOM - vy(v)}
                  className={active === h ? "fill-accent/50" : "fill-accent/25"}
                />
              ))}

              {/* The gap, revealed on scroll */}
              <polygon points={gapPolygon} fill={`url(#${hatch})`} className={clsx("gap-reveal", seen && "is-in")} />

              {/* Power draw */}
              <polyline points={powerLine} className="fill-none stroke-ink" strokeWidth={2.8} strokeLinejoin="round" />

              {/* Hour guide */}
              {active !== null && (
                <line
                  x1={hx(active + 0.5)}
                  y1={Y_TOP}
                  x2={hx(active + 0.5)}
                  y2={Y_BOTTOM}
                  className="stroke-ink/40"
                  strokeWidth={1.2}
                  strokeDasharray="4 4"
                />
              )}

              {/* Hit areas — one per hour, hover or tap */}
              {GAP_TRAFFIC.slice(0, 24).map((_, h) => (
                <rect
                  key={`hit-${h}`}
                  x={hx(h)}
                  y={Y_TOP}
                  width={hx(h + 1) - hx(h)}
                  height={Y_BOTTOM - Y_TOP}
                  fill="transparent"
                  onMouseEnter={() => setHour(h)}
                  onClick={() => setHour(h)}
                />
              ))}
            </svg>

            {[0, 50, 100].map((v) => (
              <Overlay key={v} x={X0 - 8} y={vy(v)} vw={VW} vh={VH} align="end" className="text-micro text-ash">
                {v}%
              </Overlay>
            ))}
            {[0, 6, 12, 18, 24].map((h) => (
              <Overlay key={h} x={hx(h)} y={Y_BOTTOM + 10} vw={VW} vh={VH} valign="top" className="text-micro text-ash">
                {hh(h)}
              </Overlay>
            ))}
            <Overlay
              x={hx(3.6)}
              y={vy(42)}
              vw={VW}
              vh={VH}
              className={clsx(
                "hidden rounded bg-paper/90 px-1.5 py-0.5 text-micro font-semibold text-warn transition-opacity duration-500 md:block",
                seen ? "opacity-100" : "opacity-0",
              )}
            >
              {GAP_LABELS.gap}
            </Overlay>

            {active !== null && (
              <Overlay
                x={Math.min(Math.max(hx(active + 0.5), 150), 490)}
                y={vy(GAP_POWER[active]) - 14}
                vw={VW}
                vh={VH}
                valign="bottom"
                className="rounded-lg border border-line bg-paper px-2 py-1 text-micro text-ink shadow-md"
              >
                <span className="font-semibold">{hh(active)}</span> · traffic {GAP_TRAFFIC[active]}% · power{" "}
                {GAP_POWER[active]}%
              </Overlay>
            )}
          </div>
        </figure>

        {/* Right panel */}
        <figure className="min-w-0">
          <figcaption className="text-micro font-semibold uppercase tracking-wide text-ash">
            {LEGACY_OVERLAP.title}
          </figcaption>
          <LegacyBars />
        </figure>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-micro text-ash">
        <span className="inline-flex items-center gap-2">
          <span className="h-3 w-4 rounded-sm bg-accent/30" aria-hidden="true" /> {GAP_LABELS.traffic}
        </span>
        <span className="inline-flex items-center gap-2">
          <span className="h-[3px] w-5 rounded bg-ink" aria-hidden="true" /> {GAP_LABELS.power}
        </span>
        <span className="inline-flex items-center gap-2">
          <svg width="18" height="12" aria-hidden="true">
            <defs>
              <pattern id={`${hatch}-key`} width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
                <line x1="0" y1="0" x2="0" y2="6" className="stroke-warn/70" strokeWidth="2" />
              </pattern>
            </defs>
            <rect width="18" height="12" rx="2" fill={`url(#${hatch}-key)`} className="stroke-warn/50" />
          </svg>
          {GAP_LABELS.gap}
        </span>
      </div>

      <p className="text-micro text-ash">
        Left: <span className="font-semibold text-ink">{GAP_LABELS.disclaimer}</span> — the shape, not the values, is the
        point. Hover, tap, or focus the chart and use the arrow keys to read an hour. Right: {LEGACY_OVERLAP.subject},{" "}
        <span className="font-semibold text-ink">{LEGACY_OVERLAP.source.toLowerCase()}</span>.
      </p>
    </div>
  );
}

const BW = 300;
const BH = 340;
const B_BOTTOM = 280;
const B_TOP = 40;

function LegacyBars() {
  const scale = (v: number) => ((B_BOTTOM - B_TOP) * v) / 100;
  const xs = [52, 132, 212];

  return (
    <div className="relative mt-2">
      <svg
        viewBox={`0 0 ${BW} ${BH}`}
        preserveAspectRatio="xMidYMid meet"
        role="img"
        aria-label="A UK operator's 3G layer: about one third of mobile network energy, about 7% of voice traffic and about 0.6% of data traffic (reported via GSMA)."
        className="h-auto w-full"
      >
        <title>Legacy generation overlap</title>
        <line x1={24} y1={B_BOTTOM} x2={BW - 24} y2={B_BOTTOM} className="stroke-line" strokeWidth={1.5} />
        {LEGACY_OVERLAP.bars.map((b, i) => {
          const hgt = Math.max(2.5, scale(b.value));
          return (
            <g key={b.id}>
              <rect
                x={xs[i]}
                y={B_TOP}
                width={40}
                height={B_BOTTOM - B_TOP}
                rx={4}
                className="fill-none stroke-line"
                strokeDasharray="4 4"
              />
              <rect
                x={xs[i]}
                y={B_BOTTOM - hgt}
                width={40}
                height={hgt}
                rx={3}
                className={b.id === "energy" ? "fill-ink" : "fill-accent"}
              />
            </g>
          );
        })}
      </svg>
      {LEGACY_OVERLAP.bars.map((b, i) => (
        <Overlay
          key={`v-${b.id}`}
          x={xs[i] + 20}
          y={B_BOTTOM - Math.max(2.5, scale(b.value)) - 8}
          vw={BW}
          vh={BH}
          valign="bottom"
          className="text-caption font-semibold text-ink"
        >
          {b.display}
        </Overlay>
      ))}
      {LEGACY_OVERLAP.bars.map((b, i) => (
        <Overlay
          key={`l-${b.id}`}
          x={xs[i] + 20}
          y={B_BOTTOM + 10}
          vw={BW}
          vh={BH}
          valign="top"
          className="whitespace-normal text-center text-micro text-ash"
        >
          <span className="block w-[4.8rem]">{b.label.replace("Share of ", "")}</span>
        </Overlay>
      ))}
      <Overlay x={24} y={B_TOP - 14} vw={BW} vh={BH} align="start" valign="bottom" className="text-micro text-ash">
        100% of each
      </Overlay>
    </div>
  );
}
