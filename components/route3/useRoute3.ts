"use client";

import { useMemo } from "react";
import { useProgress, useHydrated } from "@/lib/store";
import {
  R3,
  SKYBRIDGE_EVIDENCE,
  LEVERS,
  LEVERS_REQUIRED_COUNT,
  HORIZONS,
  PROPOSAL_ROLES,
  TRADEOFF_COUNT,
  GUIDING_DECISION_COUNT,
  type NodeId,
  type HorizonId,
} from "@/lib/route3";

export type MissingItem = { id: string; label: string };

export function useRoute3() {
  const hydrated = useHydrated();
  const choices = useProgress((s) => s.choices);
  const notes = useProgress((s) => s.notes);

  const name = hydrated ? notes[R3.name] ?? "" : "";
  const nameComplete = name.trim().length > 0;

  // --- Stage 2 — map evidence to Decision Architecture nodes -----------------
  const stage2Node = useMemo(() => {
    const map: Record<string, NodeId | undefined> = {};
    if (!hydrated) return map;
    for (const it of SKYBRIDGE_EVIDENCE) {
      const v = choices[R3.s2.node(it.id)];
      if (v) map[it.id] = v as NodeId;
    }
    return map;
  }, [hydrated, choices]);
  const stage2DoneCount = Object.keys(stage2Node).length;
  const stage2Complete = stage2DoneCount >= SKYBRIDGE_EVIDENCE.length;

  // --- Stage 3 — pick exactly 4 levers + reason -------------------------------
  const stage3Selected = useMemo(
    () => (hydrated ? LEVERS.filter((l) => choices[R3.s3.selected(l.id)] === "yes").map((l) => l.id) : []),
    [hydrated, choices],
  );
  const stage3Reason = useMemo(() => {
    const map: Record<string, string> = {};
    if (!hydrated) return map;
    for (const l of LEVERS) map[l.id] = notes[R3.s3.reason(l.id)] ?? "";
    return map;
  }, [hydrated, notes]);
  const stage3CountOk = stage3Selected.length === LEVERS_REQUIRED_COUNT;
  const stage3MissingReasons = stage3Selected.filter((id) => !stage3Reason[id]?.trim());
  const stage3Complete = stage3CountOk && stage3MissingReasons.length === 0;

  // --- Stage 4 — sequence the 4 selected levers, mark one as first move ------
  const stage4Levers = useMemo(() => LEVERS.filter((l) => stage3Selected.includes(l.id)), [stage3Selected]);
  const stage4Horizon = useMemo(() => {
    const map: Record<string, HorizonId | undefined> = {};
    if (!hydrated) return map;
    for (const l of stage4Levers) {
      const v = choices[R3.s4.horizon(l.id)];
      if (v) map[l.id] = v as HorizonId;
    }
    return map;
  }, [hydrated, choices, stage4Levers]);
  const stage4DoneCount = Object.keys(stage4Horizon).length;
  const firstMove = hydrated ? choices[R3.s4.firstMove] ?? "" : "";
  const firstMoveJustify = hydrated ? notes[R3.s4.firstMoveJustify] ?? "" : "";
  const stage4SequencingComplete = stage4Levers.length > 0 && stage4DoneCount >= stage4Levers.length;
  const stage4FirstMoveComplete = !!firstMove && firstMoveJustify.trim().length > 0;
  const stage4Complete = stage4SequencingComplete && stage4FirstMoveComplete;

  // --- Stage 5 — optional gut-check, never required ---------------------------

  // --- Stage 6 — Helix executive proposal -------------------------------------
  const strategicRelevance = hydrated ? notes[R3.s6.strategicRelevance] ?? "" : "";
  const guidingDecisions = useMemo(
    () => Array.from({ length: GUIDING_DECISION_COUNT }, (_, i) => (hydrated ? notes[R3.s6.guidingDecision(i)] ?? "" : "")),
    [hydrated, notes],
  );
  const prioritizationLogic = hydrated ? notes[R3.s6.prioritizationLogic] ?? "" : "";
  const tradeoffs = useMemo(
    () => Array.from({ length: TRADEOFF_COUNT }, (_, i) => (hydrated ? notes[R3.s6.tradeoff(i)] ?? "" : "")),
    [hydrated, notes],
  );
  const firstMeasure = hydrated ? notes[R3.s6.firstMeasure] ?? "" : "";
  const firstMeasureJustify = hydrated ? notes[R3.s6.firstMeasureJustify] ?? "" : "";
  const roleFields = useMemo(() => {
    const map: Record<string, { approves: string; reviews: string }> = {};
    for (const r of PROPOSAL_ROLES) {
      map[r.id] = {
        approves: hydrated ? notes[R3.s6.role(r.id, "approves")] ?? "" : "",
        reviews: hydrated ? notes[R3.s6.role(r.id, "reviews")] ?? "" : "",
      };
    }
    return map;
  }, [hydrated, notes]);
  const decideNow = hydrated ? notes[R3.s6.decideNow] ?? "" : "";
  const waitingMeans = hydrated ? notes[R3.s6.waitingMeans] ?? "" : "";

  const stage6Complete =
    strategicRelevance.trim().length > 0 &&
    guidingDecisions.every((d) => d.trim().length > 0) &&
    prioritizationLogic.trim().length > 0 &&
    tradeoffs.every((t) => t.trim().length > 0) &&
    firstMeasure.trim().length > 0 &&
    firstMeasureJustify.trim().length > 0 &&
    PROPOSAL_ROLES.every((r) => roleFields[r.id]?.approves.trim() && roleFields[r.id]?.reviews.trim()) &&
    decideNow.trim().length > 0 &&
    waitingMeans.trim().length > 0;

  const allComplete = nameComplete && stage2Complete && stage3Complete && stage4Complete && stage6Complete;

  const missing = useMemo<MissingItem[]>(() => {
    const items: MissingItem[] = [];
    if (!nameComplete) items.push({ id: "r3-name", label: "Add your name so the export can be labelled correctly" });
    if (!stage2Complete) items.push({ id: "r3-stage2", label: `Stage 2: ${SKYBRIDGE_EVIDENCE.length - stage2DoneCount} of ${SKYBRIDGE_EVIDENCE.length} evidence cards not yet mapped` });
    if (!stage3CountOk) items.push({ id: "r3-stage3", label: `Stage 3: you've selected ${stage3Selected.length} of the required ${LEVERS_REQUIRED_COUNT} levers` });
    else if (stage3MissingReasons.length > 0) {
      for (const id of stage3MissingReasons) {
        const lever = LEVERS.find((l) => l.id === id);
        items.push({ id: `r3-stage3-${id}`, label: `Stage 3: add a reason for "${lever?.text ?? id}"` });
      }
    }
    if (stage3Complete && !stage4SequencingComplete) {
      items.push({ id: "r3-stage4", label: `Stage 4: ${stage4Levers.length - stage4DoneCount} of ${stage4Levers.length} levers not yet placed on the roadmap` });
    }
    if (stage3Complete && !stage4FirstMoveComplete) {
      items.push({ id: "r3-stage4-firstmove", label: "Stage 4: mark one lever as the first move and justify it" });
    }
    if (!strategicRelevance.trim()) items.push({ id: "r3-stage6-relevance", label: "Stage 6: complete the strategic relevance statement" });
    guidingDecisions.forEach((d, i) => {
      if (!d.trim()) items.push({ id: `r3-stage6-guiding-${i}`, label: `Stage 6: add guiding decision #${i + 1}` });
    });
    if (!prioritizationLogic.trim()) items.push({ id: "r3-stage6-logic", label: "Stage 6: complete the prioritization logic statement" });
    tradeoffs.forEach((t, i) => {
      if (!t.trim()) items.push({ id: `r3-stage6-tradeoff-${i}`, label: `Stage 6: name trade-off #${i + 1}` });
    });
    if (!firstMeasure.trim() || !firstMeasureJustify.trim()) items.push({ id: "r3-stage6-firstmeasure", label: "Stage 6: name and justify the first prioritized line of measures" });
    for (const r of PROPOSAL_ROLES) {
      if (!roleFields[r.id]?.approves.trim() || !roleFields[r.id]?.reviews.trim()) {
        items.push({ id: "r3-stage6-roles", label: `Stage 6: complete the approval/review row for ${r.label}` });
      }
    }
    if (!decideNow.trim() || !waitingMeans.trim()) items.push({ id: "r3-stage6-decidenow", label: "Stage 6: complete the decide-now-despite-incomplete-data statement" });
    return items;
  }, [
    nameComplete, stage2Complete, stage2DoneCount, stage3CountOk, stage3Selected.length, stage3MissingReasons,
    stage3Complete, stage4SequencingComplete, stage4Levers.length, stage4DoneCount, stage4FirstMoveComplete,
    strategicRelevance, guidingDecisions, prioritizationLogic, tradeoffs, firstMeasure, firstMeasureJustify, roleFields,
    decideNow, waitingMeans,
  ]);

  return {
    hydrated,
    name,
    nameComplete,
    stage2Node,
    stage2DoneCount,
    stage2Complete,
    stage3Selected,
    stage3Reason,
    stage3CountOk,
    stage3Complete,
    stage4Levers,
    stage4Horizon,
    stage4DoneCount,
    firstMove,
    firstMoveJustify,
    stage4SequencingComplete,
    stage4FirstMoveComplete,
    stage4Complete,
    strategicRelevance,
    guidingDecisions,
    prioritizationLogic,
    tradeoffs,
    firstMeasure,
    firstMeasureJustify,
    roleFields,
    decideNow,
    waitingMeans,
    stage6Complete,
    allComplete,
    missing,
  };
}
