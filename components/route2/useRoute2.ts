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
  REFLECTION_PROMPTS,
  type OptionId,
  type CriterionId,
} from "@/lib/route2";

export type MissingItem = { id: string; label: string };

export function useRoute2() {
  const hydrated = useHydrated();
  const choices = useProgress((s) => s.choices);
  const notes = useProgress((s) => s.notes);

  const name = hydrated ? notes[R2.name] ?? "" : "";
  const nameComplete = name.trim().length > 0;

  // --- Stage 2 — criterion picks: criterionId -> option -> statementId ------
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

  const criterionDoneCount = (criterionId: CriterionId) => OPTION_IDS.filter((opt) => !!picks[criterionId]?.[opt]).length;

  const stage2Complete = CRITERIA.every((c) => criterionDoneCount(c.id) === OPTION_IDS.length);
  const stage2DoneCount = CRITERIA.reduce((sum, c) => sum + criterionDoneCount(c.id), 0);
  const stage2Total = CRITERIA.length * OPTION_IDS.length;

  // --- Stage 3 — Make the Call ------------------------------------------------
  const pick = hydrated ? (choices[R2.pick] as OptionId | undefined) ?? "" : "";
  const justify = hydrated ? notes[R2.justify] ?? "" : "";
  const pickComplete = !!pick;
  const justifyComplete = justify.trim().length > 0;
  const stage3Complete = pickComplete && justifyComplete;

  // --- Stage 3 (cont.) — Follow-up decisions ----------------------------------
  const followUps = useMemo(() => {
    const arr: string[] = [];
    for (let i = 0; i < FOLLOWUP_COUNT; i++) arr.push(hydrated ? notes[R2.followUp(i)] ?? "" : "");
    return arr;
  }, [hydrated, notes]);
  const stage4Complete = followUps.every((f) => f.trim().length > 0);

  // --- Stage 4 — Two risks -----------------------------------------------------
  const risks = useMemo(() => {
    const arr: string[] = [];
    for (let i = 0; i < RISK_COUNT; i++) arr.push(hydrated ? notes[R2.risk(i)] ?? "" : "");
    return arr;
  }, [hydrated, notes]);
  const stage5Complete = risks.every((r) => r.trim().length > 0);

  // --- Stage 5 — Reflection ----------------------------------------------------
  const reflections = useMemo(() => {
    const arr: string[] = [];
    for (let i = 0; i < REFLECTION_PROMPTS.length; i++) arr.push(hydrated ? notes[R2.reflection(i)] ?? "" : "");
    return arr;
  }, [hydrated, notes]);
  const stage6Complete = reflections.every((r) => r.trim().length > 0);

  const allComplete = nameComplete && stage2Complete && stage3Complete && stage4Complete && stage5Complete && stage6Complete;

  const missing = useMemo<MissingItem[]>(() => {
    const items: MissingItem[] = [];
    if (!nameComplete) items.push({ id: "r2-name", label: "Add your name so the export can be labelled correctly" });

    if (!stage2Complete) {
      items.push({
        id: "r2-stage2",
        label: `Stage 1: ${stage2Total - stage2DoneCount} of ${stage2Total} dimension × option answers not yet given`,
      });
    }
    if (!pickComplete) items.push({ id: "r2-stage3-pick", label: "Stage 2: choose a recommended option (A, B, or C)" });
    if (!justifyComplete) items.push({ id: "r2-stage3-justify", label: "Stage 2: add your justification for the recommendation" });

    followUps.forEach((f, i) => {
      if (!f.trim()) items.push({ id: `r2-stage4-${i}`, label: `Stage 2: add follow-up decision #${i + 1}` });
    });
    risks.forEach((r, i) => {
      if (!r.trim()) items.push({ id: `r2-stage5-${i}`, label: `Stage 2: name risk #${i + 1} of the easy-but-shallow alternative` });
    });
    REFLECTION_PROMPTS.forEach((p, i) => {
      if (!reflections[i]?.trim()) items.push({ id: `r2-stage6-${i}`, label: `Stage 3: answer "${p.question}"` });
    });

    return items;
  }, [nameComplete, stage2Complete, stage2Total, stage2DoneCount, pickComplete, justifyComplete, followUps, risks, reflections]);

  return {
    hydrated,
    name,
    nameComplete,
    picks,
    scoreOf,
    criterionDoneCount,
    stage2Complete,
    stage2DoneCount,
    stage2Total,
    pick,
    justify,
    pickComplete,
    justifyComplete,
    stage3Complete,
    followUps,
    stage4Complete,
    risks,
    stage5Complete,
    reflections,
    stage6Complete,
    allComplete,
    missing,
  };
}
