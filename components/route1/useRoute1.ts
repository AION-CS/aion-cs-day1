"use client";

import { useProgress, useHydrated } from "@/lib/store";
import type { MissingItem } from "@/components/ui/MissingList";
import {
  CATEGORIES,
  DIMENSIONS,
  HOTSPOTS,
  OPTIONS,
  R1,
  optionById,
  type CategoryId,
  type DimensionKey,
  type FixType,
  type Hotspot,
  type MeasureOption,
  type OptionId,
} from "@/lib/route1";

/**
 * DOM ids the missing-item list scrolls to and flashes. One map for the whole
 * route: stage 2's ids were `r2-*` while deciding was its own route, and they
 * are `r1-*` now for the same reason the store keys are (see lib/route1).
 */
export const domId = {
  name: "r1-name",

  // -- Stage 1 --------------------------------------------------------------
  trace: "r1-trace",
  /**
   * The still-unsorted card in the trace panel. A hotspot's workup card only
   * exists once it has been sorted, so a "sort this one" missing item has to
   * point here — pointing at the workup id would be a dead click.
   */
  unsorted: (id: string) => `r1-unsorted-${id}`,
  hotspot: (id: string) => `r1-hotspot-${id}`,
  lever: (id: string) => `r1-hotspot-${id}-lever`,
  justification: (id: string) => `r1-hotspot-${id}-why`,
  fixType: (id: string) => `r1-hotspot-${id}-fix`,
  reflection: "r1-reflection",

  // -- Stage 2 --------------------------------------------------------------
  bridge: "r1-bridge",
  option: (id: OptionId) => `r1-option-${id}`,
  situational: (id: OptionId) => `r1-option-${id}-situational`,
  predict: (id: OptionId) => `r1-option-${id}-predict`,
  reveal: (id: OptionId) => `r1-option-${id}-reveal`,
  commit: "r1-commit",
  pick: "r1-commit-pick",
  rationale: "r1-commit-rationale",
  feasibility: "r1-commit-feasibility",
  followUp: (n: 1 | 2) => `r1-commit-followup-${n}`,
  risk: (n: 1 | 2) => `r1-commit-risk-${n}`,

  export: "r1-export",
};

export type Placements = Record<string, CategoryId | null>;

export type Finding = {
  hotspot: Hotspot;
  category: CategoryId | null;
  leverId: string | null;
  leverText: string | null;
  justification: string;
  fixType: FixType | null;
  /** All four answers present — a finished row in Part 1 of the report. */
  complete: boolean;
};

export type OptionState = {
  option: MeasureOption;
  /** Which of the four situational answers was given, if any. */
  situational: string | null;
  /** Dimension key → predicted 1–5. Absent means not set. */
  prediction: Partial<Record<DimensionKey, number>>;
  predictedCount: number;
  predictionComplete: boolean;
  /** Dimensions with no prediction yet — named in the missing list. */
  missingDimensions: string[];
  revealed: boolean;
};

/**
 * Joins the shared progress store to Route 1's content — both stages, one hook.
 *
 * There is deliberately no second hook for the decision half: one route has one
 * `missing` list and one definition of "done" (CLAUDE.md #12), because one
 * export button at the bottom of the page has to be able to point at any gap
 * anywhere above it. `missingStage1` / `missingStage2` are exposed separately
 * only so each stage can show its own progress count.
 */
export function useRoute1() {
  const hydrated = useHydrated();
  const notes = useProgress((s) => s.notes);
  const choices = useProgress((s) => s.choices);
  const seen = useProgress((s) => s.seen);

  const name = notes[R1.name] ?? "";

  // -------------------------------------------------------------------------
  // Stage 1 — the diagnosis
  // -------------------------------------------------------------------------
  const reflection = notes[R1.reflection] ?? "";
  const inspected = seen[R1.inspected] ?? [];
  const placementOrder = seen[R1.order] ?? [];

  const placements: Placements = {};
  for (const h of HOTSPOTS) {
    const raw = choices[R1.category(h.id)];
    placements[h.id] = raw ? (raw as CategoryId) : null;
  }

  const findingFor = (h: Hotspot): Finding => {
    const category = placements[h.id];
    const leverId = choices[R1.lever(h.id)] || null;
    const justification = (notes[R1.justification(h.id)] ?? "").trim();
    const rawFix = choices[R1.fixType(h.id)];
    const fixType = rawFix === "quick" || rawFix === "structural" ? (rawFix as FixType) : null;
    return {
      hotspot: h,
      category,
      leverId,
      leverText: leverId ? (h.levers.find((l) => l.id === leverId)?.text ?? null) : null,
      justification,
      fixType,
      complete: !!category && !!leverId && justification.length > 0 && !!fixType,
    };
  };

  const findings = HOTSPOTS.map(findingFor);
  const byHotspotId = (id: string) => findings.find((f) => f.hotspot.id === id)!;

  /**
   * Report rows, in the order the learner sorted them — not in hotspot order.
   * Anything sorted but not yet in the order bucket (e.g. state restored from
   * an older session) falls back to hotspot order at the end.
   */
  const reportRows = [
    ...placementOrder.filter((id) => placements[id]).map(byHotspotId),
    ...findings.filter((f) => f.category && !placementOrder.includes(f.hotspot.id)),
  ];

  const placedCount = findings.filter((f) => f.category).length;
  const completeCount = findings.filter((f) => f.complete).length;
  const completeHotspotIds = findings.filter((f) => f.complete).map((f) => f.hotspot.id);
  const structuralCount = findings.filter((f) => f.complete && f.fixType === "structural").length;
  const quickCount = findings.filter((f) => f.complete && f.fixType === "quick").length;

  // -------------------------------------------------------------------------
  // Stage 2 — the decision
  // -------------------------------------------------------------------------
  const revealedIds = seen[R1.revealed] ?? [];

  const optionStates: OptionState[] = OPTIONS.map((option) => {
    const prediction: Partial<Record<DimensionKey, number>> = {};
    const missingDimensions: string[] = [];
    for (const d of DIMENSIONS) {
      const raw = choices[R1.predict(option.id, d.key)];
      const v = raw ? Number(raw) : 0;
      if (v >= 1) prediction[d.key] = v;
      else missingDimensions.push(d.name);
    }
    const predictedCount = DIMENSIONS.length - missingDimensions.length;
    return {
      option,
      situational: choices[R1.situational(option.id)] || null,
      prediction,
      predictedCount,
      predictionComplete: missingDimensions.length === 0,
      missingDimensions,
      revealed: revealedIds.includes(option.id),
    };
  });

  const byId = (id: OptionId) => optionStates.find((s) => s.option.id === id)!;

  const rawPick = choices[R1.pick];
  const pick: OptionId | null =
    rawPick === "A" || rawPick === "B" || rawPick === "C" ? (rawPick as OptionId) : null;

  const rationale = (notes[R1.rationale] ?? "").trim();
  const feasibility = (notes[R1.feasibility] ?? "").trim();
  const followUp: [string, string] = [
    (notes[R1.followUp(1)] ?? "").trim(),
    (notes[R1.followUp(2)] ?? "").trim(),
  ];
  const risks: [string, string] = [
    (notes[R1.risk(1)] ?? "").trim(),
    (notes[R1.risk(2)] ?? "").trim(),
  ];

  /** The commit step opens once all three real profiles have been seen at least once. */
  const allRevealed = optionStates.every((s) => s.revealed);
  const revealedCount = optionStates.filter((s) => s.revealed).length;

  // -------------------------------------------------------------------------
  // Standard #1: one entry per concretely-missing thing, named — never a step
  // number, never "complete all fields". Ordered so the list reads top-to-
  // bottom in the same order the page does, stage 1 before stage 2.
  // -------------------------------------------------------------------------
  const missingStage1: MissingItem[] = [];
  for (const f of findings) {
    const h = f.hotspot;
    const who = `Hotspot ${h.n} — ${h.title}`;
    if (!f.category) {
      missingStage1.push({ id: domId.unsorted(h.id), label: `Sort ${who} into a category` });
      continue; // the rest of the workup only exists once it's been sorted
    }
    if (!f.leverId)
      missingStage1.push({ id: domId.lever(h.id), label: `Choose an improvement lever for ${who}` });
    if (!f.justification)
      missingStage1.push({ id: domId.justification(h.id), label: `Justification for ${who}` });
    if (!f.fixType)
      missingStage1.push({
        id: domId.fixType(h.id),
        label: `Mark ${who} as Quick Fix or Structural Fix`,
      });
  }
  if (!reflection.trim()) {
    missingStage1.push({
      id: domId.reflection,
      label: "Root-cause reflection — your closing position on the diagnosis",
    });
  }

  const missingStage2: MissingItem[] = [];
  for (const s of optionStates) {
    const who = `Option ${s.option.id} — ${s.option.shortName}`;
    if (!s.situational) {
      missingStage2.push({
        id: domId.situational(s.option.id),
        label: `Situational question for ${who}`,
      });
    }
    if (!s.predictionComplete) {
      const n = s.missingDimensions.length;
      missingStage2.push({
        id: domId.predict(s.option.id),
        label: `Prediction sliders for ${who} — ${n} dimension${n === 1 ? "" : "s"} not set (${s.missingDimensions.join(", ")})`,
      });
    }
    if (!s.revealed) {
      missingStage2.push({
        id: domId.reveal(s.option.id),
        label: `Reveal the real profile for ${who}`,
      });
    }
  }
  if (!pick) {
    missingStage2.push({
      id: domId.pick,
      label: "Your recommendation — pick one option to commit to",
    });
  }
  if (!rationale)
    missingStage2.push({ id: domId.rationale, label: "Strategic rationale for your recommendation" });
  if (!feasibility)
    missingStage2.push({
      id: domId.feasibility,
      label: "Feasibility argument for your recommendation",
    });
  if (!followUp[0])
    missingStage2.push({ id: domId.followUp(1), label: "First follow-up decision this choice forces" });
  if (!followUp[1])
    missingStage2.push({ id: domId.followUp(2), label: "Second follow-up decision this choice forces" });
  if (!risks[0]) missingStage2.push({ id: domId.risk(1), label: "First risk of the road not taken" });
  if (!risks[1]) missingStage2.push({ id: domId.risk(2), label: "Second risk of the road not taken" });

  const missing: MissingItem[] = [
    ...(name.trim() ? [] : [{ id: domId.name, label: "Your name — needed to label the export" }]),
    ...missingStage1,
    ...missingStage2,
  ];

  return {
    hydrated,
    name,

    // stage 1
    reflection,
    inspected,
    placements,
    findings,
    reportRows,
    placedCount,
    completeCount,
    completeHotspotIds,
    structuralCount,
    quickCount,
    totalHotspots: HOTSPOTS.length,
    totalCategories: CATEGORIES.length,

    // stage 2
    optionStates,
    byId,
    pick,
    pickedOption: pick ? optionById(pick) : null,
    rationale,
    feasibility,
    followUp,
    risks,
    allRevealed,
    revealedCount,
    totalOptions: OPTIONS.length,

    // route-wide
    missingStage1,
    missingStage2,
    missing,
    stage1Complete: missingStage1.length === 0,
    stage2Complete: missingStage2.length === 0,
    allComplete: missing.length === 0,
  };
}

export type Route1State = ReturnType<typeof useRoute1>;
