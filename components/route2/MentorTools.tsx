"use client";

import { useProgress } from "@/lib/store";
import { MentorFillButton } from "@/components/ui/MentorFillButton";
import { AnswerKeyButton } from "@/components/ui/AnswerKeyButton";
import { CRITERIA, MEASURE_LINES, R2, type CriterionId, type MeasureLineId } from "@/lib/route2";

const DEMO_RANKING: Record<CriterionId, Record<MeasureLineId, "1" | "2" | "3">> = {
  feasibility: { b: "1", a: "2", c: "3" },
  economic: { a: "1", c: "2", b: "3" },
  behavioural: { b: "1", c: "2", a: "3" },
  regulatory: { c: "1", a: "2", b: "3" },
};

/**
 * The route's mentor bar: one demo auto-fill for both parts plus the answer
 * keys, behind the shared passcode (CLAUDE.md §7).
 */
export function MentorTools() {
  const setNote = useProgress((s) => s.setNote);
  const choose = useProgress((s) => s.choose);

  const fill = () => {
    setNote(R2.name, "Muchson");

    for (const criterion of CRITERIA) {
      for (const m of MEASURE_LINES) choose(R2.rank(criterion.id, m.id), DEMO_RANKING[criterion.id][m.id]);
    }

    choose(R2.priority, "b");
    setNote(
      R2.priorityJustify,
      "B wasn't the top scorer on Economic effect, but the actual blocker at Mercury Office Systems was inconsistent adoption, not a missing number — fixing behaviour first makes every other measure's numbers more credible.",
    );

    setNote(
      R2.relevance,
      "Budget is limited to one line this quarter, and the audit window in eight weeks makes the compliance gap visible either way — starting with behaviour fixes the root cause management already flagged.",
    );
    setNote(R2.firstMove, "HR and two department heads agree one shared enforcement standard within two weeks, modelled first by those two managers.");

    choose(R2.ownership("management"), "owns");
    choose(R2.ownership("hr"), "consulted");
    choose(R2.ownership("finance"), "consulted");
    choose(R2.ownership("compliance"), "consulted");
    choose(R2.ownership("it"), "consulted");

    setNote(R2.decideName, "Commit to funding the behaviour-oriented programme now, before the ROI framework is fully built.");
    choose(R2.decideReversible, "yes");
    choose(R2.decideMoreData, "no");
  };

  return (
    <div className="flex flex-wrap items-center justify-end gap-2 print:hidden">
      <MentorFillButton onFill={fill} />
      <AnswerKeyButton />
    </div>
  );
}
