"use client";

import { useMemo } from "react";
import { useRoute1 } from "./useRoute1";
import { CASE_BRIEF, EVIDENCE_ITEMS, DIMENSIONS, STATEMENT_PROMPTS } from "@/lib/route1";

export type DecisionReportData = {
  name: string;
  date: string;
  caseReference: string;
  benefits: string[];
  risks: string[];
  byDimension: { dimension: string; items: string[] }[];
  statements: { starter: string; answer: string }[];
  techGovSplit: { technical: string[]; governance: string[] };
};

/** Joins Route 1's state to the case content to assemble the live "Cloud Decision Audit Brief." */
export function useDecisionReportData(): DecisionReportData {
  const r1 = useRoute1();

  return useMemo(() => {
    const benefits = EVIDENCE_ITEMS.filter((it) => r1.stage2Verdict[it.id] === "benefit").map((it) => it.text);
    const risks = EVIDENCE_ITEMS.filter((it) => r1.stage2Verdict[it.id] === "risk").map((it) => it.text);

    const byDimension = DIMENSIONS.map((d) => ({
      dimension: d.label,
      items: EVIDENCE_ITEMS.filter((it) => r1.stage3Dimension[it.id] === d.id).map((it) => it.text),
    })).filter((g) => g.items.length > 0);

    const statements = STATEMENT_PROMPTS.map((p) => ({
      starter: p.starter,
      answer: r1.stage4Statement[p.id] ?? "",
    }));

    const techGovSplit = {
      technical: r1.stage5Items.filter((it) => r1.stage5Side[it.id] === "technical").map((it) => it.text),
      governance: r1.stage5Items.filter((it) => r1.stage5Side[it.id] === "governance").map((it) => it.text),
    };

    return {
      name: r1.name || "Learner",
      date: new Date().toLocaleDateString("en-GB", { year: "numeric", month: "long", day: "numeric" }),
      caseReference: CASE_BRIEF.company,
      benefits,
      risks,
      byDimension,
      statements,
      techGovSplit,
    };
  }, [r1]);
}
