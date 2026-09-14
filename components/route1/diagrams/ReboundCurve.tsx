"use client";

import { useId, useMemo, useState } from "react";
import clsx from "clsx";
import { REBOUND_MODEL, reboundSeries, reboundTurn, reboundVerdict } from "@/lib/route1";
import { Overlay, svgId } from "./Overlay";

/**
 * SVG #6 — The Rebound Curve. Energy per bit falls with diminishing returns,
 * traffic grows at the rate the learner sets, and the total — their product —
 * is recomputed live. A verdict line names the period in which efficiency is
 * outpaced. Keyboard-operable (native range input), verdict announced through
 * aria-live, and labelled as an illustrative teaching model throughout.
 */

const VW = 640;
const VH = 330;
const X0 = 60;
const X1 = 612;
const Y_TOP = 16;
const Y_BOTTOM = 290;
const Y_MAX = 300;

const px = (t: number) => X0 + (t / REBOUND_MODEL.periods) * (X1 - X0);
const py = (v: number) => Y_BOTTOM - (Math.min(v, Y_MAX * 1.2) / Y_MAX) * (Y_BOTTOM - Y_TOP);

const SERIES = [
  { key: "perBit", label: "Energy per bit", stroke: "stroke-accent", dash: "8 5", width: 2.4 },
  { key: "traffic", label: "Traffic volume", stroke: "stroke-warn", dash: "2 5", width: 2.6 },
  { key: "total", label: "Total energy", stroke: "stroke-ink", dash: undefined, width: 3.2 },
] as const;

export function ReboundCurve() {
  const [growth, setGrowth] = useState<number>(REBOUND_MODEL.defaultGrowth);
  const clip = svgId(useId(), "rebound-clip");

  const data = useMemo(() => reboundSeries(growth), [growth]);
  const turn = reboundTurn(data.total);
  const verdict = reboundVerdict(data.total);
  const last = REBOUND_MODEL.periods;

  const line = (values: number[]) => values.map((v, t) => `${px(t).toFixed(1)},${py(v).toFixed(1)}`).join(" ");

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-micro font-semibold uppercase tracking-wide text-ash">The Rebound Curve</p>
        <p className="rounded-full border border-warn/40 bg-warn/5 px-2.5 py-0.5 text-micro font-semibold text-warn">
          {REBOUND_MODEL.disclaimer}
        </p>
      </div>

      <div className="relative">
        <svg
          viewBox={`0 0 ${VW} ${VH}`}
          preserveAspectRatio="xMidYMid meet"
          role="img"
          aria-label={`Energy per bit falls, traffic grows by ${growth}% per period, and total energy is their product. ${verdict}`}
          className="h-auto w-full"
        >
          <title>The Rebound Curve</title>
          <defs>
            <clipPath id={clip}>
              <rect x={X0} y={Y_TOP} width={X1 - X0} height={Y_BOTTOM - Y_TOP} />
            </clipPath>
          </defs>

          {[0, 100, 200, 300].map((v) => (
            <line
              key={v}
              x1={X0}
              y1={py(v)}
              x2={X1}
              y2={py(v)}
              className={v === 100 ? "stroke-ash/50" : "stroke-line"}
              strokeWidth={v === 100 ? 1.4 : 1}
              strokeDasharray={v === 100 ? "5 4" : undefined}
            />
          ))}

          {turn !== null && (
            <line x1={px(turn)} y1={Y_TOP} x2={px(turn)} y2={Y_BOTTOM} className="stroke-danger/60" strokeWidth={1.5} strokeDasharray="4 4" />
          )}

          <g clipPath={`url(#${clip})`}>
            {SERIES.map((s) => (
              <polyline
                key={s.key}
                points={line(data[s.key])}
                className={clsx("fill-none", s.stroke)}
                strokeWidth={s.width}
                strokeDasharray={s.dash}
                strokeLinejoin="round"
                strokeLinecap="round"
              />
            ))}
            {data.total.map((v, t) => (
              <circle key={t} cx={px(t)} cy={py(v)} r={t === turn ? 5.5 : 3} className={t === turn ? "fill-danger" : "fill-ink"} />
            ))}
          </g>
        </svg>

        {[0, 100, 200, 300].map((v) => (
          <Overlay key={v} x={X0 - 8} y={py(v)} vw={VW} vh={VH} align="end" className="text-micro text-ash">
            {v}
          </Overlay>
        ))}
        {Array.from({ length: last + 1 }, (_, t) => t)
          .filter((t) => t % 2 === 0)
          .map((t) => (
            <Overlay key={t} x={px(t)} y={Y_BOTTOM + 8} vw={VW} vh={VH} valign="top" className="text-micro text-ash">
              {t}
            </Overlay>
          ))}
        <Overlay x={X1} y={py(100) - 4} vw={VW} vh={VH} align="end" valign="bottom" className="hidden text-micro text-ash sm:block">
          start level = 100
        </Overlay>
        {data.traffic[last] > Y_MAX && (
          <Overlay x={X1 - 6} y={Y_TOP + 6} vw={VW} vh={VH} align="end" valign="top" className="rounded bg-paper/90 px-1 text-micro font-semibold text-warn">
            traffic ↑ off scale
          </Overlay>
        )}
        {turn !== null && (
          <Overlay x={px(turn) + 6} y={Y_TOP + 4} vw={VW} vh={VH} align="start" valign="top" className="rounded bg-paper/90 px-1 text-micro font-semibold text-danger">
            total turns
          </Overlay>
        )}
      </div>

      <div className="flex flex-wrap items-center justify-between gap-2 text-micro text-ash">
        <div className="flex flex-wrap gap-x-4 gap-y-1">
          {SERIES.map((s) => (
            <span key={s.key} className="inline-flex items-center gap-1.5">
              <svg width="28" height="8" aria-hidden="true">
                <line x1="0" y1="4" x2="28" y2="4" className={s.stroke} strokeWidth={s.width} strokeDasharray={s.dash} />
              </svg>
              {s.label}
            </span>
          ))}
        </div>
        <span>Index, period 0 = 100 · periods are neutral time steps</span>
      </div>

      {/* Controls */}
      <div className="rounded-xl border border-line bg-canvas p-4">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <label htmlFor="rebound-growth" className="text-caption font-semibold text-ink">
            Traffic growth rate
          </label>
          <span className="text-caption font-semibold tabular-nums text-accent">{growth}% per period</span>
        </div>
        <p className="mt-0.5 text-micro text-ash">
          How fast use grows once each unit of use gets cheaper. Drag, or focus and use the arrow keys.
        </p>
        <input
          id="rebound-growth"
          type="range"
          min={REBOUND_MODEL.min}
          max={REBOUND_MODEL.max}
          step={REBOUND_MODEL.step}
          value={growth}
          onChange={(e) => setGrowth(Number(e.target.value))}
          aria-valuetext={`${growth}% per period`}
          className="range-accent mt-2 w-full"
        />
        <div className="mt-2 flex flex-wrap gap-2">
          {REBOUND_MODEL.presets.map((p) => (
            <button
              key={p.id}
              type="button"
              onClick={() => setGrowth(p.growth)}
              aria-pressed={growth === p.growth}
              className={clsx(
                "rounded-full border px-3 py-1 text-micro font-semibold transition-colors duration-150",
                growth === p.growth ? "border-accent bg-accent text-paper" : "border-line bg-paper text-ash hover:border-accent hover:text-accent",
              )}
            >
              {p.label} · {p.growth}%
            </button>
          ))}
        </div>

        <p aria-live="polite" className="mt-3 rounded-lg border border-line bg-paper px-3 py-2 text-caption font-semibold text-ink">
          {verdict}
        </p>
        <p className="mt-2 text-micro text-ash">
          Period {last}: energy per bit {Math.round(data.perBit[last])} · traffic {Math.round(data.traffic[last])} · total{" "}
          {Math.round(data.total[last])}. {REBOUND_MODEL.observedNote}
        </p>
      </div>
    </div>
  );
}
