"use client";

import { useProgress } from "@/lib/store";
import { MentorFillButton } from "@/components/ui/MentorFillButton";
import { AnswerKeyButton } from "@/components/ui/AnswerKeyButton";
import { DIMENSIONS, HOTSPOTS, OPTIONS, R1, STAGE1, STAGE2 } from "@/lib/route1";

/**
 * The route's mentor bar: one demo auto-fill for the whole engagement plus the
 * answer keys, both behind the shared passcode. Deliberately visually minor and
 * out of the way — a convenience gate against accidental clicks, not a security
 * boundary.
 *
 * One fill, both stages (CLAUDE.md #12): a mentor demonstrating a merged route
 * should not have to hunt for a second button halfway down the page to see the
 * export work. It calls the store's raw actions for every persisted field the
 * route writes, so it exercises the same code path a learner does.
 */
export function MentorTools() {
  const setNote = useProgress((s) => s.setNote);
  const choose = useProgress((s) => s.choose);
  const markSeen = useProgress((s) => s.markSeen);

  const fill = () => {
    setNote(R1.name, "Muchson");

    // -- Stage 1: the diagnosis, filled with the correct answers -------------
    for (const h of HOTSPOTS) {
      markSeen(R1.inspected, h.id);
      markSeen(R1.order, h.id);
      choose(R1.category(h.id), h.correctCategory);
      choose(R1.lever(h.id), h.correctLever);
      choose(R1.fixType(h.id), h.correctFixType);
      setNote(R1.justification(h.id), h.sampleJustification);
    }
    setNote(R1.reflection, STAGE1.reflection.sample);

    // -- Stage 2: the decision ----------------------------------------------
    // The predictions are deliberately *offset* from ground truth rather than
    // equal to it — the point of the reveal is the ghost-versus-real gap, and a
    // fill that matched perfectly would leave a mentor demonstrating a feature
    // that renders as a single polygon.
    const offsets: Record<string, number> = { A: 1, B: -1, C: 2 };

    for (const o of OPTIONS) {
      choose(R1.situational(o.id), o.situational.options[1].id);
      const shift = offsets[o.id] ?? 1;
      DIMENSIONS.forEach((d, i) => {
        // Alternate the direction so the ghost polygon crosses the real one.
        const delta = i % 2 === 0 ? shift : -shift;
        const guess = Math.max(1, Math.min(5, o.profile[d.key] + delta));
        choose(R1.predict(o.id, d.key), String(guess));
      });
      markSeen(R1.revealed, o.id);
    }

    const c = STAGE2.commit;
    choose(R1.pick, "C");
    setNote(R1.rationale, c.rationale.sample);
    setNote(R1.feasibility, c.feasibility.sample);
    setNote(R1.followUp(1), c.followUp.samples[0]);
    setNote(R1.followUp(2), c.followUp.samples[1]);
    setNote(R1.risk(1), c.risk.samples[0]);
    setNote(R1.risk(2), c.risk.samples[1]);
  };

  return (
    <div className="flex flex-wrap items-center justify-end gap-2 print:hidden">
      <MentorFillButton onFill={fill} />
      <AnswerKeyButton />
    </div>
  );
}
