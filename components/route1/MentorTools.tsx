"use client";

import { useProgress } from "@/lib/store";
import { R1, LEARNER_NAME_KEY, ZONES, FINDINGS } from "@/lib/route1";
import { MentorFillButton } from "@/components/ui/MentorFillButton";
import { AnswerKeyButton } from "@/components/ui/AnswerKeyButton";

/** The two findings the answer key recommends as first moves, with model directions and justifications. */
const DEMO_FIRST_MOVES: Record<string, { direction: string; justification: string }> = {
  "f-repairdefault": {
    direction: "policy",
    justification:
      "An undocumented replace-first default is what sends healthy devices out early, so written repair, upgrade and retire criteria owned by the IT service lead change every future device decision rather than this year's batch.",
  },
  "f-peripherals": {
    direction: "process",
    justification:
      "Unlogged stock is why onboarding keeps buying duplicates, so a simple inventory plus a check-stock-first step in the issuing process stops new spend immediately and proves the wider programme works.",
  },
};

/** Mentor-only: fills every field on Route 1's Task 1 with model-quality demo answers, and unlocks the answer keys. */
export function MentorTools() {
  const markSeen = useProgress((s) => s.markSeen);
  const choose = useProgress((s) => s.choose);
  const toggleCheck = useProgress((s) => s.toggleCheck);
  const setNote = useProgress((s) => s.setNote);

  const fillDemoAnswers = () => {
    setNote(LEARNER_NAME_KEY, "Muchson");

    ZONES.forEach((z) => markSeen(R1.zones, z.id));

    FINDINGS.forEach((f) => {
      choose(R1.stage1.category(f.id), f.correctCategory);
      choose(R1.stage2.driver(f.id), f.correctDriver);
      choose(R1.stage2.horizon(f.id), f.correctHorizon);
      // clear any earlier selection so the demo always lands on exactly two picks
      toggleCheck(R1.stage3.priority(f.id), false);
    });

    Object.entries(DEMO_FIRST_MOVES).forEach(([findingId, move]) => {
      toggleCheck(R1.stage3.priority(findingId), true);
      choose(R1.stage3.direction(findingId), move.direction);
      setNote(R1.stage3.justification(findingId), move.justification);
    });
  };

  return (
    <div className="mb-6 flex flex-wrap items-center justify-end gap-3">
      <AnswerKeyButton />
      <MentorFillButton onFill={fillDemoAnswers} />
    </div>
  );
}
