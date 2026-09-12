"use client";

import { useProgress } from "@/lib/store";
import { MentorFillButton } from "@/components/ui/MentorFillButton";
import { AnswerKeyButton } from "@/components/ui/AnswerKeyButton";
import { QUADRANT_CARDS, RACI_LETTERS, RACI_ROLES, R2, TASK2 } from "@/lib/route2";

/**
 * Route 2's mentor bar. The demo fill ranks A, D, E — a defensible sample
 * rather than "the" answer, since the ranking is deliberately not graded —
 * places all five quadrant cards on their reference squares, and assigns a
 * valid one-Accountable RACI so the export pipeline can be QA'd end to end.
 */
export function MentorTools() {
  const setNote = useProgress((s) => s.setNote);
  const choose = useProgress((s) => s.choose);
  const markSeen = useProgress((s) => s.markSeen);
  const toggleCheck = useProgress((s) => s.toggleCheck);
  const resetSection = useProgress((s) => s.resetSection);

  const fill = () => {
    setNote(R2.name, "Muchson");

    // Step 1 — a defensible top three, in order.
    resetSection(R2.ranking);
    for (const id of ["A", "D", "E"]) markSeen(R2.ranking, id);
    setNote(R2.rankRationale, TASK2.rank.rationale.sample);

    // Step 2 — every card on its reference square.
    for (const c of QUADRANT_CARDS) choose(R2.quadrant(c.id), c.correct);

    // Step 3 — a valid RACI: exactly one Accountable, nothing left empty.
    for (const role of RACI_ROLES) {
      for (const letter of RACI_LETTERS) toggleCheck(R2.raci(role.id, letter.id), false);
    }
    toggleCheck(R2.raci("cto", "A"), true);
    toggleCheck(R2.raci("guild", "R"), true);
    toggleCheck(R2.raci("leads", "R"), true);
    toggleCheck(R2.raci("vpeng", "C"), true);
    toggleCheck(R2.raci("pm", "C"), true);
    toggleCheck(R2.raci("auditor", "I"), true);

    // Step 4.
    setNote(R2.decideNow, TASK2.decideNow.now.sample);
    setNote(R2.decideWhy, TASK2.decideNow.why.sample);
  };

  return (
    <div className="flex flex-wrap items-center justify-end gap-2 print:hidden">
      <MentorFillButton onFill={fill} />
      <AnswerKeyButton />
    </div>
  );
}
