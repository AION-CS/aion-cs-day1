"use client";

import { useId, useState } from "react";
import clsx from "clsx";
import { useAnimatedValues } from "@/lib/useAnimatedValues";
import { LIFECYCLE_PHASES, WHEEL_LABELS } from "@/lib/route1";
import { Overlay, svgId } from "./Overlay";

/**
 * SVG #5 — The IoT Lifecycle Wheel. Seven phases as ring segments, each
 * selectable; the centre names the phase and the panel beside it carries the
 * impact driver, the decision owner, the criterion that should have been
 * applied earlier, and the regulation. The battery-fleet toggle re-weights the
 * segment thickness to show where impact concentrates — illustrative, and
 * labelled as such. Reused as the "Reference: IoT Lifecycle Wheel" slide-over.
 */

const VW = 520;
const VH = 520;
const CX = 260;
const CY = 260;
const R0 = 112;
const BASE = 58;
const GAP = 0.035;

function sector(r0: number, r1: number, a0: number, a1: number) {
  const p = (r: number, a: number) => `${(CX + r * Math.cos(a)).toFixed(1)} ${(CY + r * Math.sin(a)).toFixed(1)}`;
  const large = a1 - a0 > Math.PI ? 1 : 0;
  return `M${p(r1, a0)} A${r1} ${r1} 0 ${large} 1 ${p(r1, a1)} L${p(r0, a1)} A${r0} ${r0} 0 ${large} 0 ${p(r0, a0)} Z`;
}

export function LifecycleWheel({ compact = false }: { compact?: boolean }) {
  const [selected, setSelected] = useState(LIFECYCLE_PHASES[0].id);
  const [battery, setBattery] = useState(false);
  const rid = svgId(useId(), "wheel");

  const targets = LIFECYCLE_PHASES.map((p) => (battery ? p.weight.battery : p.weight.standard));
  const weights = useAnimatedValues(targets, 500);
  const active = LIFECYCLE_PHASES.find((p) => p.id === selected) ?? LIFECYCLE_PHASES[0];

  const step = (2 * Math.PI) / LIFECYCLE_PHASES.length;
  const angle = (i: number) => -Math.PI / 2 + i * step;

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-micro font-semibold uppercase tracking-wide text-ash">The IoT Lifecycle Wheel</p>
        <button
          type="button"
          onClick={() => setBattery((v) => !v)}
          aria-pressed={battery}
          className={clsx(
            "rounded-full border px-3 py-1 text-micro font-semibold transition-colors duration-150",
            battery ? "border-ink bg-ink text-paper" : "border-line bg-paper text-ash hover:border-ink hover:text-ink",
          )}
        >
          {battery ? "✓ " : ""}
          {WHEEL_LABELS.toggle}
        </button>
      </div>

      <div className={clsx("grid items-start gap-4", !compact && "lg:grid-cols-[minmax(0,1fr)_280px]")}>
        <div className="relative mx-auto w-full max-w-[460px]">
          <svg
            viewBox={`0 0 ${VW} ${VH}`}
            preserveAspectRatio="xMidYMid meet"
            role="img"
            aria-label={`Seven lifecycle phases of an IoT device.${battery ? " Battery-fleet view: manufacture, maintain and retire are emphasised." : ""}`}
            className="h-auto w-full"
          >
            <title>IoT Lifecycle Wheel</title>
            <defs>
              <pattern id={rid} width="7" height="7" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
                <line x1="0" y1="0" x2="0" y2="7" className="stroke-paper/50" strokeWidth="2" />
              </pattern>
            </defs>
            <circle cx={CX} cy={CY} r={R0 - 8} className="fill-canvas stroke-line" strokeWidth={1.5} />
            {LIFECYCLE_PHASES.map((p, i) => {
              const a0 = angle(i) + GAP;
              const a1 = angle(i + 1) - GAP;
              const r1 = R0 + BASE * weights[i];
              const on = p.id === selected;
              const emphasised = battery && p.weight.battery >= 1.5;
              return (
                <g
                  key={p.id}
                  role="button"
                  tabIndex={0}
                  aria-pressed={on}
                  aria-label={`Phase ${p.n}: ${p.label}`}
                  className="cursor-pointer outline-none"
                  onClick={() => setSelected(p.id)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      setSelected(p.id);
                    }
                  }}
                >
                  <path
                    d={sector(R0, r1, a0, a1)}
                    className={clsx(
                      on ? "fill-accent stroke-accentHi" : emphasised ? "fill-ink/75 stroke-ink" : "fill-accentSoft stroke-accent/40",
                    )}
                    strokeWidth={on ? 2.5 : 1.2}
                  />
                  {emphasised && <path d={sector(R0, r1, a0, a1)} fill={`url(#${rid})`} className="pointer-events-none" />}
                </g>
              );
            })}
          </svg>

          {LIFECYCLE_PHASES.map((p, i) => {
            const mid = angle(i + 0.5);
            const r1 = R0 + BASE * weights[i];
            const rn = (R0 + r1) / 2;
            const rl = r1 + 16;
            const cos = Math.cos(mid);
            const on = p.id === selected;
            const emphasised = battery && p.weight.battery >= 1.5;
            return (
              <span key={p.id}>
                <Overlay
                  x={CX + rn * cos}
                  y={CY + rn * Math.sin(mid)}
                  vw={VW}
                  vh={VH}
                  className={clsx("text-caption font-bold", on || emphasised ? "text-paper" : "text-accent")}
                >
                  {p.n}
                </Overlay>
                <Overlay
                  x={CX + rl * cos}
                  y={CY + rl * Math.sin(mid)}
                  vw={VW}
                  vh={VH}
                  align={cos > 0.25 ? "start" : cos < -0.25 ? "end" : "center"}
                  className={clsx("hidden text-micro sm:block", on ? "font-semibold text-accent" : "text-ink")}
                >
                  {p.label}
                </Overlay>
              </span>
            );
          })}

          <Overlay x={CX} y={CY} vw={VW} vh={VH} className="whitespace-normal text-center">
            <span key={active.id} className="reveal-in block w-[7.5rem] sm:w-[9rem]">
              <span className="block text-micro uppercase tracking-wide text-ash">
                Phase {active.n} of {LIFECYCLE_PHASES.length}
              </span>
              <span className="block text-caption font-semibold text-ink sm:text-body">{active.label}</span>
            </span>
          </Overlay>
        </div>

        <aside aria-live="polite" className="rounded-xl border border-accent/35 bg-accentSoft p-4">
          <div key={active.id} className="reveal-in space-y-2">
            <p className="text-caption font-semibold text-ink">
              {active.n}. {active.label}
            </p>
            <p className="text-caption text-ink">
              <span className="font-semibold">Impact driver. </span>
              {active.driver}
            </p>
            <p className="text-caption text-ash">
              <span className="font-semibold text-ink">Decision owner. </span>
              {active.owner}
            </p>
            <p className="text-caption text-ash">
              <span className="font-semibold text-ink">Criterion to apply earlier. </span>
              {active.criterion}
            </p>
            {active.regulation && (
              <p className="text-caption text-ash">
                <span className="font-semibold text-ink">Regulation. </span>
                {active.regulation}
              </p>
            )}
          </div>
        </aside>
      </div>

      <p className="text-micro text-ash">
        {WHEEL_LABELS.prompt}{" "}
        {battery && <span className="font-semibold text-ink">{WHEEL_LABELS.legend}</span>}
        {!battery && <span>In the battery-fleet view, the emphasised phases are drawn thicker and hatched.</span>}
      </p>
    </div>
  );
}
