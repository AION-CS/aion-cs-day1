"use client";

import clsx from "clsx";
import { useProgress } from "@/lib/store";
import { AnswerKey } from "@/components/ui/AnswerKey";
import { MaterialRefs } from "@/components/ui/MaterialRefs";
import { FIRST_MEASURE_ANSWER_KEY, FIRST_MEASURE_OPTIONS, JUSTIFICATION_TEMPLATE, R2, SECTION_5, materialRefs } from "@/lib/route2";
import { domId, type Route2State } from "./useRoute2";

/** Section 5 — the first measure: one of five options, a justification, and the committed-budget pressure test. */
export function FirstMeasureSection({ r2 }: { r2: Route2State }) {
  const choose = useProgress((s) => s.choose);
  const setNote = useProgress((s) => s.setNote);

  return (
    <section id={domId.measure} className="scroll-mt-24 space-y-4 rounded-2xl border border-line bg-paper p-5">
      <div>
        <p className="text-micro font-semibold uppercase tracking-wide text-accent">Section {SECTION_5.n}</p>
        <h3 className="mt-1 text-h3 text-ink">{SECTION_5.title}</h3>
        <MaterialRefs refs={materialRefs(["measure", "levers"])} />
      </div>

      <div id={domId.firstMeasure} className="scroll-mt-24 space-y-2">
        {FIRST_MEASURE_OPTIONS.map((o) => {
          const on = r2.firstMeasure === o.id;
          return (
            <button
              key={o.id}
              type="button"
              onClick={() => choose(R2.firstMeasure, o.id)}
              aria-pressed={on}
              className={clsx(
                "flex w-full items-start gap-3 rounded-xl border p-3 text-left transition-colors duration-150",
                on ? "border-accent bg-accentSoft" : "border-line bg-canvas hover:border-ash",
              )}
            >
              <span className={clsx("flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-caption font-bold", on ? "bg-accent text-paper" : "bg-mist text-ash")}>{o.id}</span>
              <span className={clsx("text-caption", on ? "font-semibold text-ink" : "text-ink")}>{o.text}</span>
            </button>
          );
        })}
      </div>

      <div id={domId.justification} className="scroll-mt-24">
        <label htmlFor="r2-justification-field" className="block text-caption font-semibold text-ink">
          {SECTION_5.justification.label}
        </label>
        <details className="mt-1 rounded-lg border border-line bg-canvas px-3 py-2">
          <summary className="cursor-pointer text-micro font-semibold text-accent">Show the reusable justification pattern</summary>
          <p className="mt-1 text-caption italic text-ink">{JUSTIFICATION_TEMPLATE}</p>
        </details>
        <textarea
          id="r2-justification-field"
          rows={6}
          value={r2.justification}
          onChange={(e) => setNote(R2.justification, e.target.value)}
          placeholder={SECTION_5.justification.placeholder}
          className="mt-2 w-full rounded-xl border border-line bg-paper px-3 py-2.5 text-caption text-ink"
        />
        <p className={clsx("mt-1 text-micro tabular-nums", r2.justification.trim().length >= SECTION_5.justification.min ? "text-accent" : "text-ash")}>
          {r2.justification.trim().length} / {SECTION_5.justification.min} characters minimum
        </p>
      </div>

      <div id={domId.committedBudget} className="scroll-mt-24 rounded-xl border border-warn/30 bg-warn/5 p-3">
        <label htmlFor="r2-budget-field" className="block text-caption font-semibold text-ink">
          {SECTION_5.budgetQuestion.label}
        </label>
        <input
          id="r2-budget-field"
          type="text"
          value={r2.committedBudgetAnswer}
          onChange={(e) => setNote(R2.committedBudget, e.target.value)}
          placeholder={SECTION_5.budgetQuestion.placeholder}
          className="mt-2 w-full rounded-xl border border-line bg-paper px-3 py-2.5 text-caption text-ink"
        />
      </div>

      <AnswerKey block={FIRST_MEASURE_ANSWER_KEY} />
    </section>
  );
}
