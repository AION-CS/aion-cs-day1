"use client";

import { useState } from "react";
import clsx from "clsx";
import { useProgress } from "@/lib/store";
import { ALLOCATION_TOTAL, ALLOCATOR_INSTRUCTION, FACTORS, R2, RISK_WHEN_LOW, describeAllocationChange, readAllocation, materialRefs, type FactorId } from "@/lib/route2";
import { MaterialRefs } from "@/components/ui/MaterialRefs";
import { WhatChanged, WhyResult } from "@/components/ui/DiagramKit";
import { useRoute2, domId } from "./useRoute2";

/**
 * Stage D — allocate 100 points across the five D3 factors. Unlike
 * `components/ui/Slider.tsx`, 0 is a real, deliberate value here (not "not
 * set") — so this uses a plain range input rather than that component's
 * unset-below-min convention. Every sentence under the sliders is derived from
 * the points: who leads and by how much, which pairs now pull against each
 * other, what is underweighted and what that puts at risk, and what the last
 * move changed.
 */
export function StageAllocate() {
  const r2 = useRoute2();
  const setNote = useProgress((s) => s.setNote);
  const [change, setChange] = useState<string | null>(null);

  const remaining = ALLOCATION_TOTAL - r2.allocationTotal;
  const evenPoints = (): Record<FactorId, number> => {
    const base = Math.floor(ALLOCATION_TOTAL / FACTORS.length);
    const extra = ALLOCATION_TOTAL - base * FACTORS.length;
    return Object.fromEntries(FACTORS.map((f, i) => [f.id, base + (i < extra ? 1 : 0)])) as Record<FactorId, number>;
  };
  const even = evenPoints();
  const reading = readAllocation(r2.allocation);
  const nameOf = (id: FactorId) => FACTORS.find((f) => f.id === id)!.name;

  const update = (id: FactorId, value: number) => {
    const prev = r2.allocation;
    const next = { ...prev, [id]: value };
    setNote(R2.allocation(id), String(value));
    const total = FACTORS.reduce((sum, f) => sum + next[f.id], 0);
    setChange(`${describeAllocationChange(prev, next)} Total is now ${total} of ${ALLOCATION_TOTAL}${total === ALLOCATION_TOTAL ? "." : total < ALLOCATION_TOTAL ? ` — ${ALLOCATION_TOTAL - total} still to allocate.` : ` — ${total - ALLOCATION_TOTAL} over, reduce something.`}`);
  };

  const reset = () => {
    const prev = r2.allocation;
    FACTORS.forEach((f) => setNote(R2.allocation(f.id), String(even[f.id])));
    setChange(`Reset to an even split: ${describeAllocationChange(prev, even)}`);
  };

  const whyParts = [
    reading.tensions.length > 0 ? `Tension: ${reading.tensions.map((t) => t.text).join(" ")}` : "No two heavily-weighted factors pull against each other here.",
    reading.underweighted.length > 0
      ? `Underweighted: ${reading.underweighted.map((id) => `${nameOf(id)} (the risk: ${RISK_WHEN_LOW[id]})`).join("; ")}.`
      : "Nothing is deliberately underweighted — name at least two factors you chose to give little.",
  ];

  return (
    <div id={domId.allocator} className="scroll-mt-24 space-y-4">
      <p className="max-w-prose text-caption text-ash">{ALLOCATOR_INSTRUCTION}</p>
      <MaterialRefs refs={materialRefs(["tradeoffPentagon"])} />

      <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-line bg-canvas px-3 py-2">
        <p className={clsx("text-caption font-semibold tabular-nums", r2.allocationTotal === ALLOCATION_TOTAL ? "text-accent" : "text-ink")}>
          {FACTORS.map((f) => r2.allocation[f.id]).join(" + ")} = {r2.allocationTotal} / {ALLOCATION_TOTAL}
          {r2.allocationTotal !== ALLOCATION_TOTAL && (
            <span className="ml-1.5 font-normal text-ash">
              ({remaining > 0 ? `${remaining} left to allocate` : `${-remaining} over — reduce something`})
            </span>
          )}
        </p>
        <button type="button" onClick={reset} className="text-micro font-semibold text-accent underline decoration-dotted underline-offset-2 hover:text-accentHi">
          Reset to even split
        </button>
      </div>

      <div className="space-y-3">
        {FACTORS.map((f) => {
          const value = r2.allocation[f.id];
          const delta = value - even[f.id];
          return (
            <div key={f.id} className="rounded-xl border border-line bg-paper p-3">
              <div className="flex flex-wrap items-baseline justify-between gap-x-3">
                <label htmlFor={`r2-allocate-${f.id}`} className="text-caption font-semibold text-ink">
                  {f.name}
                </label>
                <span className="text-micro font-semibold tabular-nums text-ink">
                  {value}
                  {delta !== 0 && <span className="ml-1.5 font-normal text-ash">({delta > 0 ? "+" : "−"}{Math.abs(delta)} from an even split)</span>}
                </span>
              </div>
              <p className="mt-0.5 text-micro text-ash">{f.definition}</p>
              <input
                id={`r2-allocate-${f.id}`}
                type="range"
                min={0}
                max={ALLOCATION_TOTAL}
                step={5}
                value={value}
                onChange={(e) => update(f.id, Number(e.target.value))}
                className="range-accent mt-2 w-full"
              />
            </div>
          );
        })}
      </div>

      {r2.allocationTotal > 0 && <WhyResult headline={reading.why} why={whyParts.join(" ")} tone={reading.tensions.length > 0 || reading.underweighted.length === 0 ? "warn" : "accent"} />}

      {r2.allocationTotal === ALLOCATION_TOTAL && (
        <div className="reveal-in rounded-xl border border-line bg-canvas p-3">
          <p className="text-micro font-semibold uppercase tracking-wide text-ash">Resulting priority order</p>
          <ol className="mt-1 list-decimal space-y-0.5 pl-5">
            {r2.allocationRanked.map((f) => (
              <li key={f.id} className="text-caption text-ink">
                {f.name} — <span className="font-semibold">{r2.allocation[f.id]}</span>
              </li>
            ))}
          </ol>
        </div>
      )}

      <WhatChanged text={change} />
    </div>
  );
}
