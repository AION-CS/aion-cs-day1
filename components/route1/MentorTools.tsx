"use client";

import { useProgress } from "@/lib/store";
import { MentorFillButton } from "@/components/ui/MentorFillButton";
import { AnswerKeyButton } from "@/components/ui/AnswerKeyButton";
import { EVIDENCE, R1 } from "@/lib/route1";

/**
 * The route's mentor bar: one demo auto-fill plus the answer keys, both
 * behind the shared passcode (CLAUDE.md §7). Deliberately visually minor —
 * a convenience gate against accidental clicks, not a security boundary.
 *
 * One fill, everything: classify all seven evidence chips into their
 * expected area with a plausible root-cause tag, timeframe tag and
 * improvement approach, so a mentor can preview the full export without
 * manually doing the task. It calls the store's raw actions for every
 * persisted field the route writes.
 */
export function MentorTools() {
  const setNote = useProgress((s) => s.setNote);
  const choose = useProgress((s) => s.choose);

  const fill = () => {
    setNote(R1.name, "Muchson");

    for (const ev of EVIDENCE) {
      choose(R1.area(ev.id), ev.correctArea);
      choose(R1.rootCause(ev.id), ev.correctRootCause);
      choose(R1.timeframe(ev.id), ev.correctTimeframe);
      setNote(R1.approach(ev.id), ev.sampleApproach);
    }
  };

  return (
    <div className="flex flex-wrap items-center justify-end gap-2 print:hidden">
      <MentorFillButton onFill={fill} />
      <AnswerKeyButton />
    </div>
  );
}
