"use client";

import { useMemo } from "react";
import { useRoute1 } from "./useRoute1";
import {
  CASE_BRIEF,
  CATEGORIES,
  DIRECTIONS,
  DRIVER_OPTIONS,
  HORIZON_OPTIONS,
  FINDINGS,
  ZONES,
} from "@/lib/route1";

export type ReportFinding = {
  letter: string;
  zone: string;
  text: string;
  short: string;
  category: string | null;
  driver: string | null;
  horizon: string | null;
};

export type WorkplaceReportData = {
  name: string;
  date: string;
  caseReference: string;
  findings: ReportFinding[];
  byCategory: { category: string; items: string[] }[];
  driverSplit: { structural: string[]; individual: string[] };
  horizonSplit: { shortTerm: string[]; structuralChange: string[] };
  actions: { letter: string; short: string; category: string | null; direction: string | null; justification: string }[];
  closingLine: string;
};

const labelOf = <T extends { id: string; label: string }>(list: T[], id?: string) =>
  list.find((x) => x.id === id)?.label ?? null;

/** Joins Route 1's state to the case content to assemble the live Green Workplace Diagnostic. */
export function useWorkplaceReportData(): WorkplaceReportData {
  const r1 = useRoute1();

  return useMemo(() => {
    const findings: ReportFinding[] = r1.loggedFindings.map((f) => ({
      letter: ZONES.find((z) => z.id === f.zoneId)?.letter ?? "?",
      zone: ZONES.find((z) => z.id === f.zoneId)?.label ?? "",
      text: f.text,
      short: f.short,
      category: labelOf(CATEGORIES, r1.category[f.id]),
      driver: labelOf(DRIVER_OPTIONS, r1.driver[f.id]),
      horizon: labelOf(HORIZON_OPTIONS, r1.horizon[f.id]),
    }));

    const byCategory = CATEGORIES.map((c) => ({
      category: c.label,
      items: r1.loggedFindings.filter((f) => r1.category[f.id] === c.id).map((f) => f.text),
    })).filter((g) => g.items.length > 0);

    const driverSplit = {
      structural: r1.loggedFindings.filter((f) => r1.driver[f.id] === "structural").map((f) => f.short),
      individual: r1.loggedFindings.filter((f) => r1.driver[f.id] === "individual").map((f) => f.short),
    };

    const horizonSplit = {
      shortTerm: r1.loggedFindings.filter((f) => r1.horizon[f.id] === "shortTerm").map((f) => f.short),
      structuralChange: r1.loggedFindings.filter((f) => r1.horizon[f.id] === "structuralChange").map((f) => f.short),
    };

    const actions = FINDINGS.filter((f) => r1.priorities.includes(f.id)).map((f) => ({
      letter: ZONES.find((z) => z.id === f.zoneId)?.letter ?? "?",
      short: f.short,
      category: labelOf(CATEGORIES, r1.category[f.id]),
      direction: labelOf(DIRECTIONS, r1.direction[f.id]),
      justification: r1.justification[f.id] ?? "",
    }));

    const diagnosed = driverSplit.structural.length + driverSplit.individual.length;
    const quickIndividual = r1.loggedFindings.filter(
      (f) => r1.driver[f.id] === "individual" && r1.horizon[f.id] === "shortTerm",
    ).length;

    let closingLine: string;
    if (diagnosed === 0) {
      closingLine = "No findings have been diagnosed yet, so no pattern can be stated.";
    } else {
      const s = driverSplit.structural.length;
      const i = driverSplit.individual.length;
      const lead =
        s > i
          ? `Of ${diagnosed} diagnosed findings, ${s} trace primarily to management or structural gaps and ${i} to individual behaviour. The dominant lever at ${CASE_BRIEF.company} is governance — leasing terms, documented repair criteria and support defaults — not employee goodwill.`
          : i > s
            ? `Of ${diagnosed} diagnosed findings, ${i} read as individual behaviour against ${s} structural. That is an unusual pattern for a workplace audit: before recommending awareness work, check whether each behaviour finding has an unowned decision behind it.`
            : `Of ${diagnosed} diagnosed findings, the split between structural (${s}) and individual (${i}) is even. Sequence the structural items first: behaviour change rarely holds while the defaults that contradict it are still in force.`;
      const tail =
        quickIndividual === 0 && diagnosed >= 3
          ? " Notably, nothing in this walkthrough is both individual and resolvable short-term — there is no quick behavioural win available here."
          : "";
      closingLine = lead + tail;
    }

    return {
      name: r1.name || "Learner",
      date: new Date().toLocaleDateString("en-GB", { year: "numeric", month: "long", day: "numeric" }),
      caseReference: CASE_BRIEF.company,
      findings,
      byCategory,
      driverSplit,
      horizonSplit,
      actions,
      closingLine,
    };
  }, [r1]);
}
