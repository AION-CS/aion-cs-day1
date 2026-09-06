"use client";

import { useMemo } from "react";
import { useRoute2 } from "./useRoute2";
import { CASE_BRIEF, CRITERIA, OPTIONS } from "@/lib/route2";

export type DecisionMemoData = {
  name: string;
  date: string;
  caseReference: string;
  scoreTable: { criterion: string; scores: Record<string, number> }[];
  recommendation: string;
  justification: string;
  followUps: string[];
  risks: string[];
};

/** Joins Route 2's state to the case content to assemble the live Decision Memo. */
export function useDecisionMemoData(): DecisionMemoData {
  const r2 = useRoute2();

  return useMemo(() => {
    const scoreTable = CRITERIA.map((c) => ({
      criterion: c.label,
      scores: Object.fromEntries(OPTIONS.map((o) => [o.id, r2.scoreOf(c.id, o.id)])),
    }));

    const recommended = OPTIONS.find((o) => o.id === r2.decisionPick);

    return {
      name: r2.name || "Learner",
      date: new Date().toLocaleDateString("en-GB", { year: "numeric", month: "long", day: "numeric" }),
      caseReference: CASE_BRIEF.company,
      scoreTable,
      recommendation: recommended ? `Option ${recommended.id} — ${recommended.label}` : "",
      justification: r2.decisionJustify,
      followUps: r2.followUps.filter((f) => f.trim().length > 0),
      risks: r2.risks.filter((rk) => rk.trim().length > 0),
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [r2]);
}
