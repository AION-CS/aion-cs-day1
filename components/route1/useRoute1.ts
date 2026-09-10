"use client";

import { useMemo } from "react";
import { useProgress, useHydrated } from "@/lib/store";
import {
  R1,
  EVIDENCE_ITEMS,
  STATEMENT_PROMPTS,
  STAGE5_CLASSIFICATION,
  type DimensionId,
  type Verdict2,
  type Side5,
} from "@/lib/route1";

export type MissingItem = { id: string; label: string };

export function useRoute1() {
  const hydrated = useHydrated();
  const choices = useProgress((s) => s.choices);
  const notes = useProgress((s) => s.notes);

  const name = hydrated ? notes[R1.name] ?? "" : "";
  const nameComplete = name.trim().length > 0;

  // --- Stage 2 — Sort: Benefit vs Risk ---------------------------------------
  const stage2Verdict = useMemo(() => {
    const map: Record<string, Verdict2 | undefined> = {};
    if (!hydrated) return map;
    for (const it of EVIDENCE_ITEMS) {
      const v = choices[R1.stage2.verdict(it.id)];
      if (v === "benefit" || v === "risk") map[it.id] = v;
    }
    return map;
  }, [hydrated, choices]);
  const stage2DoneCount = Object.keys(stage2Verdict).length;
  const stage2Complete = stage2DoneCount >= EVIDENCE_ITEMS.length;

  // --- Stage 3 — Classify into the 6-Dimension Wheel -------------------------
  const stage3Dimension = useMemo(() => {
    const map: Record<string, DimensionId | undefined> = {};
    if (!hydrated) return map;
    for (const it of EVIDENCE_ITEMS) {
      const v = choices[R1.stage3.dimension(it.id)];
      if (v) map[it.id] = v as DimensionId;
    }
    return map;
  }, [hydrated, choices]);
  const stage3DoneCount = Object.keys(stage3Dimension).length;
  const stage3Complete = stage3DoneCount >= EVIDENCE_ITEMS.length;

  // --- Stage 4 — 2 sustainability statements ---------------------------------
  const stage4Statement = useMemo(() => {
    const map: Record<string, string> = {};
    if (!hydrated) return map;
    for (const p of STATEMENT_PROMPTS) {
      map[p.id] = notes[R1.stage4.statement(p.id)] ?? "";
    }
    return map;
  }, [hydrated, notes]);
  const stage4MissingIds = STATEMENT_PROMPTS.filter((p) => !stage4Statement[p.id]?.trim()).map((p) => p.id);
  const stage4Complete = stage4MissingIds.length === 0;

  // --- Technical vs Governance tag, working set = Stage 2's "risk" cards --
  const stage5Items = useMemo(
    () => EVIDENCE_ITEMS.filter((it) => stage2Verdict[it.id] === "risk"),
    [stage2Verdict],
  );
  const stage5Side = useMemo(() => {
    const map: Record<string, Side5 | undefined> = {};
    if (!hydrated) return map;
    for (const it of stage5Items) {
      const v = choices[R1.stage5.side(it.id)];
      if (v === "technical" || v === "governance") map[it.id] = v;
    }
    return map;
  }, [hydrated, choices, stage5Items]);
  const stage5DoneCount = Object.keys(stage5Side).length;
  const stage5Complete = stage5Items.length > 0 && stage5DoneCount >= stage5Items.length;

  const allComplete = nameComplete && stage2Complete && stage3Complete && stage4Complete && stage5Complete;

  const missing = useMemo<MissingItem[]>(() => {
    const items: MissingItem[] = [];
    if (!nameComplete) items.push({ id: "r1-name", label: "Add your name so the export can be labelled correctly" });
    if (!stage2Complete) {
      items.push({
        id: "r1-stage2",
        label: `Stage 1: ${EVIDENCE_ITEMS.length - stage2DoneCount} of ${EVIDENCE_ITEMS.length} evidence cards not yet sorted into Benefit/Risk`,
      });
    }
    if (!stage3Complete) {
      items.push({
        id: "r1-stage3",
        label: `Stage 2: ${EVIDENCE_ITEMS.length - stage3DoneCount} of ${EVIDENCE_ITEMS.length} cards not yet placed on the wheel`,
      });
    }
    for (const id of stage4MissingIds) {
      const prompt = STATEMENT_PROMPTS.find((p) => p.id === id);
      items.push({
        id: `r1-stage4-${id}`,
        label: `Stage 3: complete the sentence starting "${prompt?.starter ?? id}"`,
      });
    }
    if (!stage5Complete) {
      items.push({
        id: "r1-stage2",
        label:
          stage5Items.length === 0
            ? "Stage 1: tag at least one card as Risk, then classify it Technical or Governance"
            : `Stage 1: ${stage5Items.length - stage5DoneCount} of ${stage5Items.length} Risk cards not yet tagged Technical/Governance`,
      });
    }
    return items;
  }, [
    nameComplete,
    stage2Complete,
    stage2DoneCount,
    stage3Complete,
    stage3DoneCount,
    stage4MissingIds,
    stage5Complete,
    stage5Items.length,
    stage5DoneCount,
  ]);

  return {
    hydrated,
    name,
    nameComplete,
    stage2Verdict,
    stage2DoneCount,
    stage2Complete,
    stage3Dimension,
    stage3DoneCount,
    stage3Complete,
    stage4Statement,
    stage4MissingIds,
    stage4Complete,
    stage5Items,
    stage5Side,
    stage5DoneCount,
    stage5Complete,
    allComplete,
    missing,
  };
}

export { STAGE5_CLASSIFICATION };
