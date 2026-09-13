"use client";

import { useProgress } from "@/lib/store";
import { AnswerKey } from "@/components/ui/AnswerKey";
import { RaciGrid } from "@/components/ui/RaciGrid";
import { CAPACITY_ROWS, R2, RACI_EXERCISE, RACI_ROWS, TASK_RACI_ROLES } from "@/lib/route2";
import { ExerciseHeader } from "./ExerciseHeader";
import { useRoute2, domId } from "./useRoute2";

/**
 * Exercise 3 — the RACI for NexLayer's efficiency and architecture standard.
 *
 * The same grid component the material taught with, now persisted. It reports
 * structure only — more than one A, no A, no R — plus the authority question
 * when an Accountable cannot bind capacity. It never names the right role.
 */
export function RaciExercise() {
  const r2 = useRoute2();
  const choose = useProgress((s) => s.choose);

  const reset = () => {
    for (const row of RACI_ROWS) {
      for (const role of TASK_RACI_ROLES) choose(R2.raci(row.id, role.id), "");
    }
  };

  return (
    <section id={domId.raci} className="scroll-mt-24 space-y-4 rounded-2xl border border-line bg-paper p-5">
      <ExerciseHeader
        n={RACI_EXERCISE.n}
        title={RACI_EXERCISE.title}
        minutes={RACI_EXERCISE.minutes}
        intro={RACI_EXERCISE.intro}
        material={RACI_EXERCISE.material}
      />

      <RaciGrid
        idPrefix="r2-raci"
        rows={RACI_ROWS}
        roles={TASK_RACI_ROLES}
        capacityRows={CAPACITY_ROWS}
        showCapacity={false}
        value={r2.raciValue}
        onCycle={(rowId, roleId, next) => choose(R2.raci(rowId, roleId), next)}
        onReset={reset}
        labels={RACI_EXERCISE.violations}
      />

      <AnswerKey block={RACI_EXERCISE.answerKey} />
    </section>
  );
}
