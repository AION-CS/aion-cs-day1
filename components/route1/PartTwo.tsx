"use client";

import clsx from "clsx";
import { useProgress } from "@/lib/store";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { MaterialRefs } from "@/components/ui/MaterialRefs";
import { CONSTRAINTS, MEASURES, PART_TWO, R1, materialRefs, type MeasureId } from "@/lib/route1";
import { MeasurePanel } from "./MeasurePanel";
import { CommitPanel } from "./CommitPanel";
import { useRoute1, domId } from "./useRoute1";

/**
 * Part 2 — Decide (level 2). The constraint set once, the three measures as
 * tabs, then the commit panel.
 *
 * The active tab lives in the store rather than in component state so a
 * missing-item click can open the right measure before scrolling to a field
 * inside it (see useRoute1) — and so a learner who reloads mid-comparison
 * comes back where they were.
 */
export function PartTwo() {
  const r1 = useRoute1();
  const choose = useProgress((s) => s.choose);
  const active = r1.measureStateById(r1.activeMeasure);

  return (
    <section id={domId.partTwo} className="scroll-mt-24 space-y-6">
      <SectionHeading
        kicker={`${PART_TWO.tag} · about ${PART_TWO.minutes} minutes`}
        title={PART_TWO.title}
        intro={PART_TWO.framing}
      />

      <MaterialRefs refs={materialRefs(["tradeoff", "architecture", "coupling"])} lead="This part draws on" />

      {/* The constraint set — stated once */}
      <div className="rounded-2xl border border-line bg-mist p-5">
        <p className="text-micro font-semibold uppercase tracking-wide text-ash">
          What constrains this decision
        </p>
        <ul className="mt-2 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {CONSTRAINTS.map((c) => (
            <li key={c.n} className="rounded-xl border border-line bg-paper p-3">
              <div className="flex items-start gap-2">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-ink text-micro font-bold tabular-nums text-paper">
                  {c.n}
                </span>
                <div>
                  <p className="text-caption font-semibold text-ink">{c.label}</p>
                  <p className="mt-0.5 text-micro text-ash">{c.text}</p>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* Measure tabs */}
      <div>
        <div
          role="tablist"
          aria-label="The three measures"
          className="flex flex-wrap gap-2 border-b border-line pb-3"
        >
          {MEASURES.map((m) => {
            const state = r1.measureStateById(m.id);
            const on = r1.activeMeasure === m.id;
            return (
              <button
                key={m.id}
                role="tab"
                aria-selected={on}
                type="button"
                onClick={() => choose(R1.tab, m.id as MeasureId)}
                className={clsx(
                  "flex items-center gap-2 rounded-xl border px-3.5 py-2 text-left transition-colors duration-150",
                  on ? "border-accent bg-accentSoft" : "border-line bg-paper hover:border-ash",
                )}
              >
                <span
                  className={clsx(
                    "flex h-6 w-6 items-center justify-center rounded-lg text-micro font-bold",
                    on ? "bg-accent text-paper" : "bg-mist text-ash",
                  )}
                >
                  {m.id}
                </span>
                <span className="min-w-0">
                  <span className={clsx("block text-caption font-semibold", on ? "text-accent" : "text-ink")}>
                    {m.shortName}
                  </span>
                  <span className="block text-micro text-ash">
                    {state.revealed ? "profile revealed" : state.predictionComplete ? "ready to reveal" : "not yet compared"}
                  </span>
                </span>
              </button>
            );
          })}
        </div>

        <div className="pt-6">
          <MeasurePanel key={active.measure.id} state={active} />
        </div>
      </div>

      <CommitPanel />
    </section>
  );
}
