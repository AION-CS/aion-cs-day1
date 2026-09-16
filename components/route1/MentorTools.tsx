"use client";

import { useProgress } from "@/lib/store";
import { MentorFillButton } from "@/components/ui/MentorFillButton";
import { AnswerKeyButton } from "@/components/ui/AnswerKeyButton";
import { ESCALATE, R1, SIGNALS } from "@/lib/route1";

/**
 * The route's mentor bar: one demo auto-fill for the whole engagement plus
 * the answer keys, both behind the shared passcode. Deliberately visually
 * minor and out of the way — a convenience gate against accidental clicks,
 * not a security boundary.
 *
 * One fill, everything (CLAUDE.md #12): triage all seven with the correct
 * tag and its decisive phrase, escalate the two the mentor key recommends
 * most strongly, then run the deep dive on those two. It calls the store's
 * raw actions for every persisted field the route writes, so it exercises
 * exactly the code path a learner does.
 */
export function MentorTools() {
  const setNote = useProgress((s) => s.setNote);
  const choose = useProgress((s) => s.choose);

  const fill = () => {
    setNote(R1.name, "Muchson");

    // -- Step 1: triage all seven with the correct tag and its decisive phrase --
    for (const s of SIGNALS) {
      choose(R1.triageTag(s.id), s.sentiment);
      const decisiveIndex = s.segments.findIndex((seg) => typeof seg !== "string" && seg.decisive);
      choose(R1.triageEvidence(s.id), String(decisiveIndex));
    }

    // -- Step 2: escalate the two the mentor key recommends most strongly ----
    const escalate = ["s5", "s6"].slice(0, ESCALATE.limit);
    setNote(R1.escalate, escalate.join("|"));
    setNote(
      R1.escalateWhy,
      "Signal 5 explains why fixes elsewhere keep failing to simplify things, and Signal 6 is the missing review loop that would have caught it — together they argue from structural leverage rather than from what's easiest to fix.",
    );

    // -- Step 3: the deep dive on those two -----------------------------------
    for (const id of escalate) {
      const s = SIGNALS.find((sig) => sig.id === id)!;
      choose(R1.area(id), s.area);
      choose(R1.effect(id), s.effect);
      setNote(R1.approach(id), s.sampleApproach);
    }
  };

  return (
    <div className="flex flex-wrap items-center justify-end gap-2 print:hidden">
      <MentorFillButton onFill={fill} />
      <AnswerKeyButton />
    </div>
  );
}
