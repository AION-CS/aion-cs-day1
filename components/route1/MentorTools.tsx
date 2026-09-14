"use client";

import { useState } from "react";
import { useProgress } from "@/lib/store";
import { MentorFillButton } from "@/components/ui/MentorFillButton";
import { AnswerKeyButton } from "@/components/ui/AnswerKeyButton";
import { COMMIT, CRITERIA, R1, R1_KEY_PREFIXES, SAMPLE_RANKS, SIGNALS } from "@/lib/route1";
import { serialiseSlots } from "./ranking";

/**
 * The route's mentor bar (§13): one demo auto-fill for both parts, the answer
 * keys, and a "Reset to empty" that clears every r1 key in one click behind a
 * confirm. All three sit behind the shared passcode — deliberately visually
 * minor, a convenience gate against accidental clicks, not a security
 * boundary.
 *
 * The fill writes plausible practitioner work, not the key: routing includes
 * one defensible-but-debatable placement (S4 → Management Logic, per its
 * sample data), the ranking never puts one option first on everything, and
 * the chosen option is B. `R1.mentorSample` is set true and stamps every
 * export made while it is active; "Reset to empty" clears it too.
 */
export function MentorTools() {
  const setNote = useProgress((s) => s.setNote);
  const choose = useProgress((s) => s.choose);
  const markSeen = useProgress((s) => s.markSeen);
  const toggleCheck = useProgress((s) => s.toggleCheck);
  const resetPrefixes = useProgress((s) => s.resetPrefixes);
  const [confirmReset, setConfirmReset] = useState(false);

  const fill = () => {
    setNote(R1.name, "Muchson");
    toggleCheck(R1.mentorSample, true);

    // -- Part 1: all six signals, plausible but not uniform ------------------
    for (const s of SIGNALS) {
      const demo = s.sample;
      choose(R1.reading(s.id), demo.reading);
      if (demo.bothWhy) setNote(R1.bothWhy(s.id), demo.bothWhy);
      choose(R1.zone(s.id), demo.zone);
      markSeen(R1.routed, s.id);
      setNote(R1.approach(s.id), demo.approach);
      choose(R1.rootCause(s.id), demo.rootCause);
      choose(R1.horizon(s.id), demo.horizon);
    }

    // -- Part 2: a complete ranking that never puts one option first everywhere
    for (const c of CRITERIA) {
      choose(R1.rank(c.id), serialiseSlots(SAMPLE_RANKS[c.id]));
    }
    choose(R1.chosen, "B");
    setNote(R1.justification, COMMIT.justification.sample);
    setNote(R1.followUp(1), COMMIT.followUp.samples[0]);
    setNote(R1.followUp(2), COMMIT.followUp.samples[1]);
    setNote(R1.risk(1), COMMIT.risks.samples[0]);
    setNote(R1.risk(2), COMMIT.risks.samples[1]);
  };

  const reset = () => {
    resetPrefixes(R1_KEY_PREFIXES);
    setConfirmReset(false);
  };

  return (
    <div className="flex flex-wrap items-center justify-end gap-2 print:hidden">
      <MentorFillButton onFill={fill} />
      <AnswerKeyButton />
      {!confirmReset ? (
        <button
          type="button"
          onClick={() => setConfirmReset(true)}
          className="rounded-full border border-dashed border-line px-3 py-1 text-micro font-semibold text-ash transition-colors duration-150 hover:border-ash hover:text-ink"
        >
          Reset to empty
        </button>
      ) : (
        <span className="flex items-center gap-2 rounded-full border border-danger/40 bg-danger/5 px-2 py-1">
          <span className="text-micro text-danger">Clear every answer on this route?</span>
          <button type="button" onClick={reset} className="text-micro font-semibold text-danger underline underline-offset-2">
            Yes, clear it
          </button>
          <button type="button" onClick={() => setConfirmReset(false)} className="text-micro text-ash hover:text-ink">
            Cancel
          </button>
        </span>
      )}
    </div>
  );
}
