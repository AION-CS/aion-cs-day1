"use client";

import { useProgress } from "@/lib/store";
import { MentorFillButton } from "@/components/ui/MentorFillButton";
import { AnswerKeyButton } from "@/components/ui/AnswerKeyButton";
import { DIMENSIONS, OPTIONS, R2, TASK2 } from "@/lib/route2";

/**
 * Route 2's mentor bar. The demo fill deliberately writes predictions that are
 * *offset* from ground truth rather than equal to it — the point of the reveal
 * is the ghost-versus-real gap, and a fill that matched perfectly would leave a
 * mentor demonstrating a feature that renders as a single polygon.
 */
export function MentorTools() {
  const setNote = useProgress((s) => s.setNote);
  const choose = useProgress((s) => s.choose);
  const markSeen = useProgress((s) => s.markSeen);

  const fill = () => {
    setNote(R2.name, "Muchson");

    // A plausible-but-wrong prediction per option, offset in a different
    // direction each time so every axis of the overlay is exercised.
    const offsets: Record<string, number> = { A: 1, B: -1, C: 2 };

    for (const o of OPTIONS) {
      choose(R2.situational(o.id), o.situational.options[1].id);
      const shift = offsets[o.id] ?? 1;
      DIMENSIONS.forEach((d, i) => {
        // Alternate the direction so the ghost polygon crosses the real one.
        const delta = i % 2 === 0 ? shift : -shift;
        const guess = Math.max(1, Math.min(5, o.profile[d.key] + delta));
        choose(R2.predict(o.id, d.key), String(guess));
      });
      markSeen(R2.revealed, o.id);
    }

    const c = TASK2.commit;
    choose(R2.pick, "C");
    setNote(R2.rationale, c.rationale.sample);
    setNote(R2.feasibility, c.feasibility.sample);
    setNote(R2.followUp(1), c.followUp.samples[0]);
    setNote(R2.followUp(2), c.followUp.samples[1]);
    setNote(R2.risk(1), c.risk.samples[0]);
    setNote(R2.risk(2), c.risk.samples[1]);
  };

  return (
    <div className="flex flex-wrap items-center justify-end gap-2 print:hidden">
      <MentorFillButton onFill={fill} />
      <AnswerKeyButton />
    </div>
  );
}
