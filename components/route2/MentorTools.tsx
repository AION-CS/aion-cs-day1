"use client";

import { useProgress } from "@/lib/store";
import { MentorFillButton } from "@/components/ui/MentorFillButton";
import { AnswerKeyButton } from "@/components/ui/AnswerKeyButton";
import { DECIDE_NOW_FIELDS, MAP_EXERCISE, MAP_MEASURES, R2, RANK_EXERCISE, RACI_ROWS, TASK_RACI_ROLES } from "@/lib/route2";

/**
 * Route 2's mentor bar: one demo fill for all four exercises, plus the answer
 * keys — both behind the shared passcode, both deliberately minor. The fill
 * writes a defensible (not the only defensible) memo through the same store
 * actions a learner triggers.
 */

/** One defensible grid — the answer key explains why others defend too. */
const DEMO_RACI: Record<string, Record<string, string>> = {
  r1: { cto: "A", arch: "R", product: "C", eng: "I", ops: "C" },
  r2: { cto: "C", arch: "A", product: "C", eng: "R", ops: "C" },
  r3: { cto: "I", arch: "A", product: "C", eng: "R", ops: "I" },
  r4: { cto: "A", arch: "C", product: "C", eng: "R", ops: "I" },
};

export function MentorTools() {
  const setNote = useProgress((s) => s.setNote);
  const choose = useProgress((s) => s.choose);

  const fill = () => {
    setNote(R2.name, "Muchson");

    // Exercise 1
    setNote(R2.ranking, "g1|g7|g3");
    setNote(R2.rankWhy, RANK_EXERCISE.justify.sample);
    choose(R2.rankCheck, "required");

    // Exercise 2 — the expected diagnostics, so every quadrant renders correctly
    for (const m of MAP_MEASURES) {
      choose(R2.q1(m.id), m.momentumHigh ? "yes" : "no");
      choose(R2.q2(m.id), m.structuralHigh ? "yes" : "no");
      const bet = MAP_EXERCISE.betSamples[m.id];
      if (bet) setNote(R2.bet(m.id), bet);
    }

    // Exercise 3
    for (const row of RACI_ROWS) {
      for (const role of TASK_RACI_ROLES) choose(R2.raci(row.id, role.id), DEMO_RACI[row.id]?.[role.id] ?? "");
    }

    // Exercise 4
    for (const f of DECIDE_NOW_FIELDS) setNote(R2.decideNow(f.key), f.sample);
  };

  return (
    <div className="flex flex-wrap items-center justify-end gap-2 print:hidden">
      <MentorFillButton onFill={fill} />
      <AnswerKeyButton />
    </div>
  );
}
