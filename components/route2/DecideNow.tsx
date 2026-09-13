"use client";

import { useProgress } from "@/lib/store";
import { AnswerKey } from "@/components/ui/AnswerKey";
import { DECIDE_NOW_EXERCISE, DECIDE_NOW_FIELDS, R2 } from "@/lib/route2";
import { ExerciseHeader } from "./ExerciseHeader";
import { useRoute2, domId } from "./useRoute2";

/**
 * Exercise 4 — the decision that cannot wait: the decision, the assumption, the
 * falsifier, and the cost of one more quarter. Free text, so no live check; the
 * mentor key carries the assessment criteria and worked strong/weak examples.
 */
export function DecideNow() {
  const r2 = useRoute2();
  const notes = useProgress((s) => s.notes);
  const setNote = useProgress((s) => s.setNote);

  return (
    <section id={domId.decide} className="scroll-mt-24 space-y-4 rounded-2xl border border-line bg-paper p-5">
      <ExerciseHeader
        n={DECIDE_NOW_EXERCISE.n}
        title={DECIDE_NOW_EXERCISE.title}
        minutes={DECIDE_NOW_EXERCISE.minutes}
        intro={DECIDE_NOW_EXERCISE.intro}
        material={DECIDE_NOW_EXERCISE.material}
      />

      <div className="space-y-4">
        {DECIDE_NOW_FIELDS.map((f, i) => (
          <div key={f.key} id={domId.decideField(f.key)} className="scroll-mt-24">
            <label htmlFor={`r2-decide-${f.key}-field`} className="block text-caption font-semibold text-ink">
              <span className="text-ash">{i + 1} · </span>
              {f.label}
            </label>
            <p className="mt-0.5 text-micro text-ash">{f.instruction}</p>
            <textarea
              id={`r2-decide-${f.key}-field`}
              rows={i === 0 ? 3 : 2}
              value={r2.hydrated ? (notes[R2.decideNow(f.key)] ?? "") : ""}
              onChange={(e) => setNote(R2.decideNow(f.key), e.target.value)}
              placeholder={f.placeholder}
              className="mt-2 w-full rounded-xl border border-line bg-paper px-3 py-2.5 text-caption text-ink"
            />
          </div>
        ))}
      </div>

      <AnswerKey block={DECIDE_NOW_EXERCISE.answerKey} />
    </section>
  );
}
