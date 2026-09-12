"use client";

import { useMemo } from "react";
import { useRoute2 } from "./useRoute2";
import {
  CASE_BRIEF,
  CRITERIA,
  MEASURES,
  EVIDENCE_CARDS,
  CONSTRAINTS,
  RISKS,
  STANCES,
  CONFIDENCE_OPTIONS,
  RELEVANCE_OPTIONS,
  SENSITIVITY,
  SHOCK,
} from "@/lib/route2";

export type MemoData = {
  name: string;
  date: string;
  caseReference: string;
  confidenceIndex: { verified: number; partial: number; assumed: number };
  evidence: { n: number; finding: string; confidence: string | null; relevance: string | null }[];
  stance: string | null;
  weights: { criterion: string; weight: number; why: string | null }[];
  matrix: { measure: string; scores: { criterion: string; score: number | null }[]; total: number }[];
  ranking: { position: number; measure: string }[];
  derivedRanking: string;
  sensitivity: { result: string | null; note: string };
  constraints: { text: string; measure: string | null; mitigation: string }[];
  shock: { answer: string | null; note: string };
  justification: string;
  risks: { label: string; note: string }[];
  uncertainty: string;
};

const label = <T extends { id: string; label: string }>(list: T[], id?: string) =>
  list.find((x) => x.id === id)?.label ?? null;

export function useMemoData(): MemoData {
  const r2 = useRoute2();

  return useMemo(() => {
    const evidence = EVIDENCE_CARDS.map((c) => ({
      n: c.n,
      finding: c.finding,
      confidence: label(CONFIDENCE_OPTIONS, r2.confidence[c.id]),
      relevance: label(RELEVANCE_OPTIONS, r2.relevance[c.id]),
    }));

    const weights = CRITERIA.map((c) => ({
      criterion: c.label,
      weight: r2.weights[c.id] ?? 0,
      why: c.whyOptions.find((o) => o.id === r2.weightWhy[c.id])?.label ?? null,
    }));

    const matrix = MEASURES.map((m) => ({
      measure: `${m.id} · ${m.short}`,
      scores: CRITERIA.map((c) => ({
        criterion: c.label,
        score: r2.score[`${m.id}:${c.id}`] ?? null,
      })),
      total: r2.totals[m.id],
    }));

    const ranking = MEASURES.map((m) => ({ position: r2.rank[m.id] ?? 0, measure: `${m.id} · ${m.short}` }))
      .filter((r) => r.position > 0)
      .sort((a, b) => a.position - b.position);

    const constraints = CONSTRAINTS.map((c) => {
      const m = r2.constraintPlacement[c.id];
      return {
        text: c.text,
        measure: m ? `${m} · ${MEASURES.find((x) => x.id === m)?.short ?? ""}` : null,
        mitigation: r2.mitigation[c.id] ?? "",
      };
    });

    const risks = RISKS.filter((r) => r2.pickedRisks.includes(r.id)).map((r) => ({
      label: r.label,
      note: r2.riskNote[r.id] ?? "",
    }));

    return {
      name: r2.name || "Learner",
      date: new Date().toLocaleDateString("en-GB", { year: "numeric", month: "long", day: "numeric" }),
      caseReference: CASE_BRIEF.company,
      confidenceIndex: r2.confidenceIndex,
      evidence,
      stance: label(STANCES, r2.stance),
      weights,
      matrix,
      ranking,
      derivedRanking: r2.derivedRanking.join(" → "),
      sensitivity: {
        result: SENSITIVITY.options.find((o) => o.id === r2.sensitivity)?.label ?? null,
        note: r2.sensitivityNote,
      },
      constraints,
      shock: {
        answer: SHOCK.options.find((o) => o.id === r2.shock)?.label ?? null,
        note: r2.shockNote,
      },
      justification: r2.justification,
      risks,
      uncertainty: r2.uncertainty,
    };
  }, [r2]);
}
