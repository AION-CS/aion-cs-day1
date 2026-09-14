"use client";

import { useState } from "react";
import { LEAKS, LEAK_LABELS, leakCascade } from "@/lib/route1";
import { Overlay } from "./Overlay";

/**
 * SVG #9 — The Efficiency Leak. A promised gain enters on the left as a band;
 * four leaks peel away from it in sequence — rebound, layer stacking, scope
 * displacement, complexity overhead — and what reaches the right is the
 * realised system gain. Four sliders set the leaks; everything recomputes live.
 */

const VW = 900;
const VH = 410;
const TOP = 56;
const K = 1.5;
const XS = [40, 230, 400, 570, 740, 860];
const OUT_Y = 338;

export function EfficiencyLeak() {
  const [shares, setShares] = useState<number[]>(LEAKS.map((l) => l.initial));
  const remaining = leakCascade(shares);
  const realised = remaining[remaining.length - 1];

  const setShare = (i: number, v: number) => setShares((s) => s.map((x, j) => (j === i ? v : x)));

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-micro font-semibold uppercase tracking-wide text-ash">The Efficiency Leak</p>
        <p className="rounded-full border border-warn/40 bg-warn/5 px-2.5 py-0.5 text-micro font-semibold text-warn">
          {LEAK_LABELS.disclaimer}
        </p>
      </div>

      <div className="relative">
        <svg
          viewBox={`0 0 ${VW} ${VH}`}
          preserveAspectRatio="xMidYMid meet"
          role="img"
          aria-label={`A promised efficiency gain of 100 loses shares to rebound, layer stacking, scope displacement and complexity overhead, leaving a realised system gain of ${Math.round(realised)}.`}
          className="h-auto w-full"
        >
          <title>The Efficiency Leak</title>

          {/* Main band, one segment per stretch between leaks */}
          {remaining.map((r, i) => (
            <rect
              key={`seg-${i}`}
              x={XS[i]}
              y={TOP}
              width={XS[i + 1] - XS[i] + (i < remaining.length - 1 ? 1 : 0)}
              height={Math.max(r * K, 1)}
              className={i === remaining.length - 1 ? "fill-accent/70" : "fill-accent/30"}
              style={{ transition: "height 300ms ease-out" }}
            />
          ))}

          {/* Leaks peel off the bottom of the band */}
          {LEAKS.map((leak, i) => {
            const x = XS[i + 1];
            const t = Math.max(0, (remaining[i] - remaining[i + 1]) * K);
            if (t < 0.5) return null;
            const y0 = TOP + remaining[i + 1] * K;
            const y1 = y0 + t;
            const cx = x + 34;
            const path = `M${x - 36} ${y0} C${x + 10} ${y0} ${cx + t / 2} ${OUT_Y - 70} ${cx + t / 2} ${OUT_Y} L${cx - t / 2} ${OUT_Y} C${cx - t / 2} ${OUT_Y - 60} ${x - 6} ${y1} ${x - 36} ${y1} Z`;
            return <path key={leak.id} d={path} className="fill-warn/35 stroke-warn/60" strokeWidth={1} />;
          })}

          <line x1={XS[0]} y1={TOP - 8} x2={XS[XS.length - 1]} y2={TOP - 8} className="stroke-line" strokeWidth={1} />
        </svg>

        <Overlay x={XS[0]} y={TOP - 14} vw={VW} vh={VH} align="start" valign="bottom" className="text-micro font-semibold text-ink">
          {LEAK_LABELS.promised} · 100
        </Overlay>
        <Overlay
          x={XS[XS.length - 1]}
          y={TOP - 14}
          vw={VW}
          vh={VH}
          align="end"
          valign="bottom"
          className="text-micro font-semibold text-accent"
        >
          {LEAK_LABELS.realised} · {Math.round(realised)}
        </Overlay>
        {LEAKS.map((leak, i) => (
          <Overlay
            key={leak.id}
            x={XS[i + 1] + 34}
            y={OUT_Y + 10}
            vw={VW}
            vh={VH}
            valign="top"
            className="whitespace-normal text-center text-micro leading-tight text-ink"
          >
            <span className="block w-[4.5rem] sm:w-[6.5rem]">
              <span className="font-semibold">{leak.label}</span>
              <span className="block text-warn">−{Math.round(remaining[i] - remaining[i + 1])}</span>
            </span>
          </Overlay>
        ))}
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        {LEAKS.map((leak, i) => (
          <div key={leak.id} className="rounded-xl border border-line bg-canvas p-3">
            <div className="flex items-baseline justify-between gap-2">
              <label htmlFor={`leak-${leak.id}`} className="text-caption font-semibold text-ink">
                {leak.label}
              </label>
              <span className="text-micro font-semibold tabular-nums text-accent">{shares[i]}% of what is left</span>
            </div>
            <p className="mt-0.5 text-micro text-ash">{leak.text}</p>
            <input
              id={`leak-${leak.id}`}
              type="range"
              min={0}
              max={100}
              step={5}
              value={shares[i]}
              onChange={(e) => setShare(i, Number(e.target.value))}
              aria-valuetext={`${shares[i]}% of the remaining gain`}
              className="range-accent mt-2 w-full"
            />
          </div>
        ))}
      </div>

      <p aria-live="polite" className="rounded-lg border border-accent/35 bg-accentSoft px-3 py-2 text-caption font-semibold text-ink">
        Realised system gain: {Math.round(realised)} of the promised 100. {LEAK_LABELS.how}
      </p>
    </div>
  );
}
