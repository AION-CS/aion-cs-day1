"use client";

import clsx from "clsx";
import { useProgress } from "@/lib/store";
import { ALLOCATION_TOTAL, ALLOCATOR_INSTRUCTION, FACTORS, R2 } from "@/lib/route2";
import { useRoute2, domId } from "./useRoute2";

/**
 * Stage D — allocate 100 points across the five D3 factors. Unlike
 * `components/ui/Slider.tsx`, 0 is a real, deliberate value here (not "not
 * set") — so this uses a plain range input rather than that component's
 * unset-below-min convention.
 */
export function StageAllocate() {
  const r2 = useRoute2();
  const setNote = useProgress((s) => s.setNote);

  const remaining = ALLOCATION_TOTAL - r2.allocationTotal;
  const evenSplit = () => {
    const base = Math.floor(ALLOCATION_TOTAL / FACTORS.length);
    const extra = ALLOCATION_TOTAL - base * FACTORS.length;
    FACTORS.forEach((f, i) => setNote(R2.allocation(f.id), String(base + (i < extra ? 1 : 0))));
  };

  return (
    <div id={domId.allocator} className="scroll-mt-24 space-y-4">
      <p className="max-w-prose text-caption text-ash">{ALLOCATOR_INSTRUCTION}</p>

      <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-line bg-canvas px-3 py-2">
        <p className={clsx("text-caption font-semibold", r2.allocationTotal === ALLOCATION_TOTAL ? "text-accent" : "text-ink")}>
          Total: {r2.allocationTotal} / {ALLOCATION_TOTAL}
          {r2.allocationTotal !== ALLOCATION_TOTAL && (
            <span className="ml-1.5 font-normal text-ash">
              ({remaining > 0 ? `${remaining} left to allocate` : `${-remaining} over — reduce something`})
            </span>
          )}
        </p>
        <button type="button" onClick={evenSplit} className="text-micro font-semibold text-accent underline decoration-dotted underline-offset-2 hover:text-accentHi">
          Reset to even split
        </button>
      </div>

      <div className="space-y-3">
        {FACTORS.map((f) => {
          const value = r2.allocation[f.id];
          return (
            <div key={f.id} className="rounded-xl border border-line bg-paper p-3">
              <div className="flex flex-wrap items-baseline justify-between gap-x-3">
                <label htmlFor={`r2-allocate-${f.id}`} className="text-caption font-semibold text-ink">
                  {f.name}
                </label>
                <span className="text-micro font-semibold tabular-nums text-accent">{value}</span>
              </div>
              <p className="mt-0.5 text-micro text-ash">{f.definition}</p>
              <input
                id={`r2-allocate-${f.id}`}
                type="range"
                min={0}
                max={ALLOCATION_TOTAL}
                step={5}
                value={value}
                onChange={(e) => setNote(R2.allocation(f.id), e.target.value)}
                className="range-accent mt-2 w-full"
              />
            </div>
          );
        })}
      </div>

      {r2.allocationTotal === ALLOCATION_TOTAL && (
        <div className="reveal-in rounded-xl border border-accent/30 bg-accentSoft p-3">
          <p className="text-micro font-semibold uppercase tracking-wide text-accent">Resulting priority order</p>
          <ol className="mt-1 list-decimal space-y-0.5 pl-5">
            {r2.allocationRanked.map((f) => (
              <li key={f.id} className="text-caption text-ink">
                {f.name} — <span className="font-semibold">{r2.allocation[f.id]}</span>
              </li>
            ))}
          </ol>
        </div>
      )}
    </div>
  );
}
