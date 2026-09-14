"use client";

import { useProgress } from "@/lib/store";
import { MaterialRefs } from "@/components/ui/MaterialRefs";
import { QUARTERS, R2, ROLES, SECTION_2, materialRefs } from "@/lib/route2";
import { domId, type Route2State } from "./useRoute2";

/** Section 2 — three guiding decisions, each with an owner and a quarter. */
export function GuidingDecisionsSection({ r2 }: { r2: Route2State }) {
  const setNote = useProgress((s) => s.setNote);
  const choose = useProgress((s) => s.choose);

  return (
    <section id={domId.guiding} className="scroll-mt-24 space-y-4 rounded-2xl border border-line bg-paper p-5">
      <div>
        <p className="text-micro font-semibold uppercase tracking-wide text-accent">Section {SECTION_2.n}</p>
        <h3 className="mt-1 text-h3 text-ink">{SECTION_2.title}</h3>
        <p className="mt-1 text-caption text-ash">{SECTION_2.helper}</p>
        <MaterialRefs refs={materialRefs(["roadmap"])} />
      </div>

      <div className="space-y-4">
        {([1, 2, 3] as const).map((n) => {
          const g = r2.guidingDecisions[n - 1];
          return (
            <div key={n} className="rounded-xl border border-line bg-canvas p-3">
              <label htmlFor={`r2-guiding-${n}`} className="block text-caption font-semibold text-ink">
                Guiding decision {n}
              </label>
              <input
                id={domId.guidingText(n)}
                type="text"
                value={g.text}
                onChange={(e) => setNote(R2.guidingText(n), e.target.value)}
                placeholder={SECTION_2.placeholder(n)}
                className="mt-2 w-full scroll-mt-24 rounded-xl border border-line bg-paper px-3 py-2.5 text-caption text-ink"
              />
              <div className="mt-2 grid grid-cols-2 gap-2">
                <div id={domId.guidingOwner(n)} className="scroll-mt-24">
                  <label htmlFor={`r2-guiding-${n}-owner`} className="block text-micro font-semibold uppercase tracking-wide text-ash">
                    Owner
                  </label>
                  <select
                    id={`r2-guiding-${n}-owner`}
                    value={g.owner ?? ""}
                    onChange={(e) => choose(R2.guidingOwner(n), e.target.value)}
                    className="mt-1 w-full rounded-lg border border-line bg-paper px-2 py-1.5 text-caption text-ink"
                  >
                    <option value="">— choose —</option>
                    {ROLES.map((r) => (
                      <option key={r.id} value={r.id}>
                        {r.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div id={domId.guidingQuarter(n)} className="scroll-mt-24">
                  <label htmlFor={`r2-guiding-${n}-quarter`} className="block text-micro font-semibold uppercase tracking-wide text-ash">
                    Quarter
                  </label>
                  <select
                    id={`r2-guiding-${n}-quarter`}
                    value={g.quarter ?? ""}
                    onChange={(e) => choose(R2.guidingQuarter(n), e.target.value)}
                    className="mt-1 w-full rounded-lg border border-line bg-paper px-2 py-1.5 text-caption text-ink"
                  >
                    <option value="">— choose —</option>
                    {QUARTERS.map((q) => (
                      <option key={q} value={q}>
                        {q}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
