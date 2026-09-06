"use client";

import { useMemo } from "react";
import { useProgress, useHydrated } from "@/lib/store";
import {
  R2,
  CRITERIA,
  CRITERION_DATA,
  OPTION_IDS,
  FOLLOWUP_COUNT,
  RISK_COUNT,
  type OptionId,
  type CriterionId,
} from "@/lib/route2";

export type MissingItem = { id: string; label: string };

export function useRoute2() {
  const hydrated = useHydrated();
  const choices = useProgress((s) => s.choices);
  const notes = useProgress((s) => s.notes);

  const name = hydrated ? notes[R2.name] ?? "" : "";

  // --- Criterion picks: criterionId -> option -> statementId ---------------
  const picks = useMemo(() => {
    const map: Record<string, Partial<Record<OptionId, string>>> = {};
    if (!hydrated) return map;
    for (const c of CRITERIA) {
      const forC: Partial<Record<OptionId, string>> = {};
      for (const opt of OPTION_IDS) {
        const v = choices[R2.criterion(c.id, opt)];
        if (v) forC[opt] = v;
      }
      map[c.id] = forC;
    }
    return map;
  }, [hydrated, choices]);

  const scoreOf = (criterionId: CriterionId, option: OptionId): number => {
    const pickedId = picks[criterionId]?.[option];
    if (!pickedId) return 0;
    const stmt = CRITERION_DATA[criterionId][option].statements.find((st) => st.id === pickedId);
    return stmt?.score ?? 0;
  };

  const criterionDoneCount = (criterionId: CriterionId) =>
    OPTION_IDS.filter((opt) => !!picks[criterionId]?.[opt]).length;

  const criteriaComplete = CRITERIA.every((c) => criterionDoneCount(c.id) === OPTION_IDS.length);
  const criteriaDoneCount = CRITERIA.reduce((sum, c) => sum + criterionDoneCount(c.id), 0);
  const criteriaTotal = CRITERIA.length * OPTION_IDS.length;

  // --- Decision --------------------------------------------------------------
  const decisionPick = hydrated ? (choices[R2.decisionPick] as OptionId | undefined) ?? "" : "";
  const decisionJustify = hydrated ? notes[R2.decisionJustify] ?? "" : "";

  const followUps = useMemo(() => {
    const arr: string[] = [];
    for (let i = 0; i < FOLLOWUP_COUNT; i++) arr.push(hydrated ? notes[R2.followUp(i)] ?? "" : "");
    return arr;
  }, [hydrated, notes]);

  const risks = useMemo(() => {
    const arr: string[] = [];
    for (let i = 0; i < RISK_COUNT; i++) arr.push(hydrated ? notes[R2.risk(i)] ?? "" : "");
    return arr;
  }, [hydrated, notes]);

  const decisionPickComplete = !!decisionPick;
  const decisionJustifyComplete = decisionJustify.trim().length > 0;
  const followUpsComplete = followUps.every((f) => f.trim().length > 0);
  const risksComplete = risks.every((r) => r.trim().length > 0);
  const decisionComplete = decisionPickComplete && decisionJustifyComplete && followUpsComplete && risksComplete;

  const nameComplete = name.trim().length > 0;
  const allComplete = nameComplete && criteriaComplete && decisionComplete;

  const missing = useMemo<MissingItem[]>(() => {
    const items: MissingItem[] = [];
    if (!nameComplete) items.push({ id: "r2-name", label: "Add your name so the export can be labelled correctly" });

    for (const c of CRITERIA) {
      for (const opt of OPTION_IDS) {
        if (!picks[c.id]?.[opt]) {
          items.push({
            id: `r2-crit-${c.id}`,
            label: `Criterion ${c.n} (${c.label}): Option ${opt} not yet answered`,
          });
        }
      }
    }

    if (!decisionPickComplete) items.push({ id: "r2-decision-pick", label: "Decision: choose a recommended option (A, B, or C)" });
    if (!decisionJustifyComplete) items.push({ id: "r2-decision-justify", label: "Decision: add your justification for the recommendation" });
    followUps.forEach((f, i) => {
      if (!f.trim()) items.push({ id: `r2-decision-followup-${i}`, label: `Decision: add follow-up decision #${i + 1}` });
    });
    risks.forEach((r, i) => {
      if (!r.trim()) items.push({ id: `r2-decision-risk-${i}`, label: `Decision: name risk #${i + 1} of the easy-but-shallow alternative` });
    });

    return items;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [nameComplete, picks, decisionPickComplete, decisionJustifyComplete, followUps, risks]);

  return {
    hydrated,
    name,
    nameComplete,
    picks,
    scoreOf,
    criterionDoneCount,
    criteriaComplete,
    criteriaDoneCount,
    criteriaTotal,
    decisionPick,
    decisionJustify,
    followUps,
    risks,
    decisionPickComplete,
    decisionJustifyComplete,
    followUpsComplete,
    risksComplete,
    decisionComplete,
    allComplete,
    missing,
  };
}
