"use client";

import { useProgress } from "@/lib/store";
import { MentorFillButton } from "@/components/ui/MentorFillButton";
import { AnswerKeyButton } from "@/components/ui/AnswerKeyButton";
import { INITIATIVES, LENSES, R1 } from "@/lib/route1";

/**
 * The route's mentor bar: one demo auto-fill plus the answer keys, both behind
 * the shared passcode (CLAUDE.md §7). Deliberately visually minor — a
 * convenience gate against accidental clicks, not a security boundary.
 *
 * One fill, everything: both diagnostic answers for all six initiatives, the
 * lens, a model rationale, the closing answer, and the seven C4 lens chips
 * marked as opened — so a mentor can demo the finished export in one click.
 * The sample is the answer key: it fills each initiative's expected answers
 * from lib/route1/task1.ts rather than from a second copy that could drift.
 */
export function MentorTools() {
  const setNote = useProgress((s) => s.setNote);
  const choose = useProgress((s) => s.choose);
  const markSeen = useProgress((s) => s.markSeen);

  const fill = () => {
    setNote(R1.name, "Muchson");

    for (const initiative of INITIATIVES) {
      choose(R1.load(initiative.id), initiative.expectedLoad);
      choose(R1.structure(initiative.id), initiative.expectedStructure);
      choose(R1.lens(initiative.id), initiative.acceptedLenses[0]);
      setNote(R1.rationale(initiative.id), initiative.sampleRationale);
    }

    setNote(
      R1.closing,
      "Initiative 4 (device refresh on the classic market cycle) and initiative 6 (the “AI everywhere” pilot). Both are easy to sell — one is familiar and simple to budget, the other looks innovative — but neither reduces anything measurably: the refresh cycle discards serviceable hardware and pulls in fresh embodied footprint, and the pilot adds continuous compute with no benefit target anywhere behind it.",
    );

    for (const lens of LENSES) markSeen(R1.lensesSeen, lens.id);
  };

  return (
    <div className="flex flex-wrap items-center justify-end gap-2 print:hidden">
      <MentorFillButton onFill={fill} />
      <AnswerKeyButton />
    </div>
  );
}
