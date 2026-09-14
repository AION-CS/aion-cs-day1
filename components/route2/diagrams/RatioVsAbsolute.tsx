"use client";

import { useMemo, useState } from "react";
import clsx from "clsx";
import { RATIO_MODEL, ratioSeries, ratioVerdict } from "@/lib/route2";
import { Overlay } from "@/components/route1/diagrams/Overlay";

/**
 * SVG #1 — Ratio vs Absolute. Two synchronised mini-charts sharing one
 * traffic-growth slider: energy per bit falling on the left, total energy on
 * the right. A live verdict line states both changes in one sentence.
 */

const VW = 860;
const VH = 300;
const CW = 360;
const GAP = 60;
const LX = 40;
const RX = LX + CW + GAP;
const TOP = 20;
const BOTTOM = 250;
const Y_MAX = 130;

const px = (x0: number, t: number) => x0 + (t / RATIO_MODEL.periods) * CW;
const py = (v: number) => BOTTOM - (Math.min(v, Y_MAX) / Y_MAX) * (BOTTOM - TOP);

function MiniChart({ x0, values, stroke, title }: { x0: number; values: number[]; stroke: string; title: string }) {
  const points = values.map((v, t) => `${px(x0, t).toFixed(1)},${py(v).toFixed(1)}`).join(" ");
  return (
    <g>
      <rect x={x0} y={TOP} width={CW} height={BOTTOM - TOP} rx={10} className="fill-canvas stroke-line" strokeWidth={1.5} />
      {[0, 50, 100].map((v) => (
        <line key={v} x1={x0} y1={py(v)} x2={x0 + CW} y2={py(v)} className="stroke-line/70" strokeWidth={1} />
      ))}
      <polyline points={points} className={clsx("fill-none", stroke)} strokeWidth={3} strokeLinejoin="round" strokeLinecap="round" />
      <text x={x0 + 10} y={TOP + 20} className="fill-ink" style={{ fontSize: 13, fontWeight: 700 }}>
        {title}
      </text>
    </g>
  );
}

export function RatioVsAbsolute() {
  const [growth, setGrowth] = useState(RATIO_MODEL.defaultGrowth);
  const { perBit, total } = useMemo(() => ratioSeries(growth), [growth]);
  const verdict = ratioVerdict(perBit, total);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-micro font-semibold uppercase tracking-wide text-ash">Ratio vs Absolute</p>
        <p className="rounded-full border border-warn/40 bg-warn/5 px-2.5 py-0.5 text-micro font-semibold text-warn">
          {RATIO_MODEL.disclaimer}
        </p>
      </div>

      <div className="relative">
        <svg
          viewBox={`0 0 ${VW} ${VH}`}
          preserveAspectRatio="xMidYMid meet"
          role="img"
          aria-label={`Energy per bit falls with efficiency; total energy tracks it against ${growth}% traffic growth per period. ${verdict}`}
          className="h-auto w-full"
        >
          <title>Ratio vs Absolute</title>
          <MiniChart x0={LX} values={perBit} stroke="stroke-accent" title="Energy per bit (falling)" />
          <MiniChart x0={RX} values={total} stroke="stroke-ink" title="Total energy" />
        </svg>
        <Overlay x={LX + 10} y={BOTTOM + 4} vw={VW} vh={VH} valign="top" className="text-micro text-ash">
          index, period 0 = 100
        </Overlay>
        <Overlay x={RX + 10} y={BOTTOM + 4} vw={VW} vh={VH} valign="top" className="text-micro text-ash">
          index, period 0 = 100
        </Overlay>
      </div>

      <div className="rounded-xl border border-line bg-canvas p-4">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <label htmlFor="ratio-growth" className="text-caption font-semibold text-ink">
            Traffic growth rate
          </label>
          <span className="text-caption font-semibold tabular-nums text-accent">{growth}% per period</span>
        </div>
        <input
          id="ratio-growth"
          type="range"
          min={RATIO_MODEL.min}
          max={RATIO_MODEL.max}
          step={RATIO_MODEL.step}
          value={growth}
          onChange={(e) => setGrowth(Number(e.target.value))}
          aria-valuetext={`${growth}% per period`}
          className="range-accent mt-2 w-full"
        />
        <p aria-live="polite" className="mt-3 rounded-lg border border-line bg-paper px-3 py-2 text-caption font-semibold text-ink">
          {verdict}
        </p>
      </div>
    </div>
  );
}
