"use client";

import { useState } from "react";
import clsx from "clsx";
import { DIMENSIONS, HEAT_STRIP_LEGEND, type DimensionId } from "@/lib/route2";
import { Overlay } from "@/components/route1/diagrams/Overlay";

/**
 * SVG #3 — the six-dimension heat strip. One horizontal segment per
 * dimension, intensity mapped to its illustrative exposure rating, each
 * clickable to jump to (and flash) the corresponding analysis paragraph.
 */

const VW = 900;
const VH = 140;
const X0 = 20;
const X1 = 880;
const TOP = 20;
const H = 60;

export function HeatStrip({ onJump }: { onJump: (id: DimensionId) => void }) {
  const [hover, setHover] = useState<DimensionId | null>(null);
  const w = (X1 - X0) / DIMENSIONS.length;
  const active = DIMENSIONS.find((d) => d.id === hover) ?? null;

  return (
    <div className="space-y-2">
      <p className="text-micro font-semibold uppercase tracking-wide text-ash">Six-dimension heat strip</p>
      <div className="relative">
        <svg
          viewBox={`0 0 ${VW} ${VH}`}
          preserveAspectRatio="xMidYMid meet"
          role="img"
          aria-label="Six dimensions of exposure, from network energy efficiency to governance, each clickable to jump to its analysis."
          className="h-auto w-full"
        >
          <title>Six-dimension heat strip</title>
          {DIMENSIONS.map((d, i) => {
            const x = X0 + i * w;
            const opacity = 0.18 + (d.exposure / 100) * 0.62;
            return (
              <g
                key={d.id}
                role="button"
                tabIndex={0}
                aria-label={`${d.label}, illustrative exposure ${d.exposure} of 100`}
                className="cursor-pointer outline-none"
                onClick={() => onJump(d.id)}
                onMouseEnter={() => setHover(d.id)}
                onMouseLeave={() => setHover(null)}
                onFocus={() => setHover(d.id)}
                onBlur={() => setHover(null)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    onJump(d.id);
                  }
                }}
              >
                <rect
                  x={x + 3}
                  y={TOP}
                  width={w - 6}
                  height={H}
                  rx={8}
                  className={clsx("stroke-danger", hover === d.id ? "stroke-2" : "stroke-1")}
                  fill="currentColor"
                  style={{ color: "#B23B3B", opacity }}
                />
              </g>
            );
          })}
        </svg>
        {DIMENSIONS.map((d, i) => {
          const x = X0 + i * w + w / 2;
          return (
            <span key={d.id}>
              <Overlay x={x} y={TOP + H / 2} vw={VW} vh={VH} className="text-caption font-bold text-ink">
                {d.n}
              </Overlay>
              <Overlay x={x} y={TOP + H + 10} vw={VW} vh={VH} valign="top" className="hidden whitespace-normal text-center text-micro leading-tight text-ink sm:block">
                <span className="block w-[6.5rem]">{d.label}</span>
              </Overlay>
            </span>
          );
        })}
      </div>
      <div aria-live="polite" className="rounded-xl border border-line bg-canvas p-3">
        {active ? (
          <p key={active.id} className="reveal-in text-caption text-ink">
            <span className="font-semibold">{active.label} — </span>
            {active.decisionItPointsTo}
          </p>
        ) : (
          <p className="text-caption text-ash">Hover, focus or tap a segment for the decision it points to, or click it to jump to the full analysis.</p>
        )}
      </div>
      <p className="text-micro text-ash">{HEAT_STRIP_LEGEND}</p>
    </div>
  );
}

/** The full six-dimension breakdown, each card anchored for the heat strip's click-to-jump. */
export function DimensionCards() {
  return (
    <ol className="space-y-3">
      {DIMENSIONS.map((d) => (
        <li key={d.id} id={`r2-dimension-${d.id}`} className="scroll-mt-24 rounded-2xl border border-line bg-paper p-4">
          <p className="text-caption font-semibold text-ink">
            {d.n}. {d.label}
          </p>
          <dl className="mt-2 space-y-2">
            <div>
              <dt className="text-micro font-semibold uppercase tracking-wide text-ash">What we see</dt>
              <dd className="text-caption text-ink">{d.whatWeSee}</dd>
            </div>
            <div>
              <dt className="text-micro font-semibold uppercase tracking-wide text-ash">What it costs</dt>
              <dd className="text-caption text-ink">{d.whatItCosts}</dd>
            </div>
            <div>
              <dt className="text-micro font-semibold uppercase tracking-wide text-accent">What decision it points to</dt>
              <dd className="text-caption font-semibold text-ink">{d.decisionItPointsTo}</dd>
            </div>
          </dl>
        </li>
      ))}
    </ol>
  );
}
