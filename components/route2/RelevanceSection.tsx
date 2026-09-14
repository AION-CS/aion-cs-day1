"use client";

import clsx from "clsx";
import { useProgress } from "@/lib/store";
import { MaterialRefs } from "@/components/ui/MaterialRefs";
import { R2, RELEVANCE_DRIVERS, RELEVANCE_REQUIRED, SECTION_1, materialRefs } from "@/lib/route2";
import { domId, type Route2State } from "./useRoute2";

/** Section 1 — strategic relevance: exactly 3 of 7 drivers, then a rationale. */
export function RelevanceSection({ r2 }: { r2: Route2State }) {
  const toggleCheck = useProgress((s) => s.toggleCheck);
  const setNote = useProgress((s) => s.setNote);

  const toggle = (id: string) => {
    const on = r2.relevanceSelected.includes(id as never);
    if (!on && r2.relevanceSelected.length >= RELEVANCE_REQUIRED) return;
    toggleCheck(R2.relevance(id), !on);
  };

  return (
    <section id={domId.relevance} className="scroll-mt-24 space-y-4 rounded-2xl border border-line bg-paper p-5">
      <div>
        <p className="text-micro font-semibold uppercase tracking-wide text-accent">Section {SECTION_1.n}</p>
        <h3 className="mt-1 text-h3 text-ink">{SECTION_1.title}</h3>
        <p className="mt-1 text-caption text-ash">{SECTION_1.instruction}</p>
        <MaterialRefs refs={materialRefs(["management", "dimensions"])} />
      </div>

      <div id={domId.relevanceDriver} className="scroll-mt-24">
        <p className="text-micro text-ash">{SECTION_1.helper}</p>
        <div className="mt-2 grid gap-2 sm:grid-cols-2">
          {RELEVANCE_DRIVERS.map((d) => {
            const on = r2.relevanceSelected.includes(d.id);
            const disabled = !on && r2.relevanceSelected.length >= RELEVANCE_REQUIRED;
            return (
              <button
                key={d.id}
                type="button"
                onClick={() => toggle(d.id)}
                aria-pressed={on}
                className={clsx(
                  "rounded-xl border p-2.5 text-left text-caption transition-colors duration-150",
                  on ? "border-accent bg-accentSoft font-semibold text-accent" : disabled ? "cursor-not-allowed border-line bg-canvas text-ash/60" : "border-line bg-canvas text-ink hover:border-ash",
                )}
              >
                {d.label}
              </button>
            );
          })}
        </div>
        <p className={clsx("mt-1.5 text-micro tabular-nums", r2.relevanceSelected.length === RELEVANCE_REQUIRED ? "text-accent" : "text-ash")}>
          {r2.relevanceSelected.length} of {RELEVANCE_REQUIRED} selected
        </p>
      </div>

      <div id={domId.relevanceRationale} className="scroll-mt-24">
        <label htmlFor="r2-relevance-rationale" className="block text-caption font-semibold text-ink">
          {SECTION_1.rationale.label}
        </label>
        <textarea
          id="r2-relevance-rationale"
          rows={3}
          value={r2.relevanceRationale}
          onChange={(e) => setNote(R2.relevanceRationale, e.target.value)}
          placeholder={SECTION_1.rationale.placeholder}
          className="mt-2 w-full rounded-xl border border-line bg-paper px-3 py-2.5 text-caption text-ink"
        />
        <p className={clsx("mt-1 text-micro tabular-nums", r2.relevanceRationale.trim().length >= SECTION_1.rationale.min ? "text-accent" : "text-ash")}>
          {r2.relevanceRationale.trim().length} / {SECTION_1.rationale.min} characters minimum
        </p>
      </div>
    </section>
  );
}
