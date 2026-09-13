"use client";

import { useProgress, useHydrated } from "@/lib/store";
import type { MissingItem } from "@/components/ui/MissingList";
import {
  DIMENSIONS,
  MEASURES,
  R1,
  SIGNALS,
  areaById,
  measureById,
  type AreaId,
  type DimensionKey,
  type Horizon,
  type Measure,
  type MeasureId,
  type RootCause,
  type Signal,
} from "@/lib/route1";

/** DOM ids the missing-item list scrolls to and flashes. */
export const domId = {
  name: "r1-name",

  // Part 1
  partOne: "part-1",
  signal: (id: string) => `r1-signal-${id}`,
  area: (id: string) => `r1-signal-${id}-area`,
  rootCause: (id: string) => `r1-signal-${id}-root`,
  horizon: (id: string) => `r1-signal-${id}-horizon`,
  approach: (id: string) => `r1-signal-${id}-approach`,

  handover: "r1-handover",

  // Part 2
  partTwo: "part-2",
  measure: (id: MeasureId) => `r1-measure-${id}`,
  situational: (id: MeasureId) => `r1-measure-${id}-situational`,
  predict: (id: MeasureId) => `r1-measure-${id}-predict`,
  reveal: (id: MeasureId) => `r1-measure-${id}-reveal`,
  commit: "r1-commit",
  pick: "r1-commit-pick",
  rationale: "r1-commit-rationale",
  feasibility: "r1-commit-feasibility",
  followUp: (n: 1 | 2) => `r1-commit-followup-${n}`,
  risk: (n: 1 | 2) => `r1-commit-risk-${n}`,

  export: "r1-export",
};

export type Finding = {
  signal: Signal;
  area: AreaId | null;
  rootCause: RootCause | null;
  horizon: Horizon | null;
  approach: string;
  checkAttempts: number;
  clueUsed: boolean;
  /** All four answers present — a finished line in Part 1 of the report. */
  complete: boolean;
};

export type MeasureState = {
  measure: Measure;
  situational: string | null;
  situationalCorrect: boolean;
  prediction: Partial<Record<DimensionKey, number>>;
  predictedCount: number;
  predictionComplete: boolean;
  missingDimensions: string[];
  revealed: boolean;
};

/**
 * Joins the shared progress store to Route 1's content — both parts, one hook.
 *
 * One route has one `missing` list and one definition of done (CLAUDE.md #12),
 * because one export button at the bottom has to be able to point at any gap
 * anywhere above it. Entries that live inside a collapsed signal card or a
 * hidden measure tab carry a `before` callback that opens the right container
 * first, so a missing item can never be a dead click.
 */
export function useRoute1() {
  const hydrated = useHydrated();
  const notes = useProgress((s) => s.notes);
  const choices = useProgress((s) => s.choices);
  const seen = useProgress((s) => s.seen);
  const choose = useProgress((s) => s.choose);

  const name = notes[R1.name] ?? "";

  // -- Part 1 ---------------------------------------------------------------
  const cluesUsed = seen[R1.clues] ?? [];
  const processedOrder = seen[R1.processed] ?? [];

  const findings: Finding[] = SIGNALS.map((signal) => {
    const rawArea = choices[R1.area(signal.id)];
    const rawRoot = choices[R1.rootCause(signal.id)];
    const rawHorizon = choices[R1.horizon(signal.id)];
    const approach = (notes[R1.approach(signal.id)] ?? "").trim();
    const area = rawArea ? (rawArea as AreaId) : null;
    const rootCause =
      rawRoot === "measurement" || rawRoot === "architecture" ? (rawRoot as RootCause) : null;
    const horizon = rawHorizon === "short" || rawHorizon === "structural" ? (rawHorizon as Horizon) : null;
    return {
      signal,
      area,
      rootCause,
      horizon,
      approach,
      checkAttempts: Number(notes[R1.checks(signal.id)] ?? "0") || 0,
      clueUsed: cluesUsed.includes(signal.id),
      complete: !!area && !!rootCause && !!horizon && approach.length > 0,
    };
  });

  const findingById = (id: string) => findings.find((f) => f.signal.id === id)!;

  /** Report lines in the order the learner first assigned an area to them. */
  const reportRows = [
    ...processedOrder.filter((id) => findings.find((f) => f.signal.id === id)?.area).map(findingById),
    ...findings.filter((f) => f.area && !processedOrder.includes(f.signal.id)),
  ];

  const assignedCount = findings.filter((f) => f.area).length;
  const completeCount = findings.filter((f) => f.complete).length;
  const areaCorrectCount = findings.filter((f) => f.area === f.signal.area).length;
  const measurementCount = findings.filter((f) => f.complete && f.rootCause === "measurement").length;
  const architectureCount = findings.filter((f) => f.complete && f.rootCause === "architecture").length;
  const shortCount = findings.filter((f) => f.complete && f.horizon === "short").length;
  const structuralCount = findings.filter((f) => f.complete && f.horizon === "structural").length;

  // -- Part 2 ---------------------------------------------------------------
  const revealedIds = seen[R1.revealed] ?? [];
  const rawTab = choices[R1.tab];
  const activeMeasure: MeasureId =
    rawTab === "A" || rawTab === "B" || rawTab === "C" ? (rawTab as MeasureId) : "A";

  const measureStates: MeasureState[] = MEASURES.map((measure) => {
    const prediction: Partial<Record<DimensionKey, number>> = {};
    const missingDimensions: string[] = [];
    for (const d of DIMENSIONS) {
      const raw = choices[R1.predict(measure.id, d.key)];
      const v = raw ? Number(raw) : 0;
      if (v >= 1) prediction[d.key] = v;
      else missingDimensions.push(d.name);
    }
    const situational = choices[R1.situational(measure.id)] || null;
    return {
      measure,
      situational,
      situationalCorrect: !!measure.situational.options.find((o) => o.id === situational)?.correct,
      prediction,
      predictedCount: DIMENSIONS.length - missingDimensions.length,
      predictionComplete: missingDimensions.length === 0,
      missingDimensions,
      revealed: revealedIds.includes(measure.id),
    };
  });

  const measureStateById = (id: MeasureId) => measureStates.find((m) => m.measure.id === id)!;
  const revealedCount = measureStates.filter((m) => m.revealed).length;
  const allRevealed = revealedCount === MEASURES.length;

  const rawPick = choices[R1.pick];
  const pick: MeasureId | null =
    rawPick === "A" || rawPick === "B" || rawPick === "C" ? (rawPick as MeasureId) : null;

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

  // -- Missing list ---------------------------------------------------------
  // Standard #1: one entry per concretely-missing thing, named, in page order.
  const openSignal = (id: string) => () => choose(R1.openSignal, id);
  const openTab = (id: MeasureId) => () => choose(R1.tab, id);

  const missingPartOne: MissingItem[] = [];
  for (const f of findings) {
    const who = `Signal ${f.signal.n} — ${f.signal.title}`;
    if (!f.area) {
      missingPartOne.push({
        id: domId.area(f.signal.id),
        label: `Area for ${who}`,
        before: openSignal(f.signal.id),
      });
    }
    if (!f.rootCause) {
      missingPartOne.push({
        id: domId.rootCause(f.signal.id),
        label: `Root-cause tag for ${who}`,
        before: openSignal(f.signal.id),
      });
    }
    if (!f.horizon) {
      missingPartOne.push({
        id: domId.horizon(f.signal.id),
        label: `Horizon tag for ${who}`,
        before: openSignal(f.signal.id),
      });
    }
    if (!f.approach) {
      missingPartOne.push({
        id: domId.approach(f.signal.id),
        label: `Improvement approach for ${who}`,
        before: openSignal(f.signal.id),
      });
    }
  }

  const missingPartTwo: MissingItem[] = [];
  for (const m of measureStates) {
    const who = `Measure ${m.measure.id} — ${m.measure.shortName}`;
    if (!m.situational) {
      missingPartTwo.push({
        id: domId.situational(m.measure.id),
        label: `Situational question for ${who}`,
        before: openTab(m.measure.id),
      });
    }
    if (!m.predictionComplete) {
      const n = m.missingDimensions.length;
      missingPartTwo.push({
        id: domId.predict(m.measure.id),
        label: `Prediction for ${who} — ${n} dimension${n === 1 ? "" : "s"} not set (${m.missingDimensions.join(", ")})`,
        before: openTab(m.measure.id),
      });
    }
    if (!m.revealed) {
      missingPartTwo.push({
        id: domId.reveal(m.measure.id),
        label: `Reveal the real profile for ${who}`,
        before: openTab(m.measure.id),
      });
    }
  }
  if (!pick) {
    missingPartTwo.push({ id: domId.pick, label: "Your recommendation — pick one measure to commit to" });
  }
  if (!rationale) {
    missingPartTwo.push({ id: domId.rationale, label: "Strategic rationale for your recommendation" });
  }
  if (!feasibility) {
    missingPartTwo.push({ id: domId.feasibility, label: "Feasibility argument for your recommendation" });
  }
  if (!followUp[0]) {
    missingPartTwo.push({ id: domId.followUp(1), label: "First follow-up decision this choice forces" });
  }
  if (!followUp[1]) {
    missingPartTwo.push({ id: domId.followUp(2), label: "Second follow-up decision this choice forces" });
  }
  if (!risks[0]) missingPartTwo.push({ id: domId.risk(1), label: "First risk of the road not taken" });
  if (!risks[1]) missingPartTwo.push({ id: domId.risk(2), label: "Second risk of the road not taken" });

  const missing: MissingItem[] = [
    ...(name.trim() ? [] : [{ id: domId.name, label: "Your name — needed to label the export" }]),
    ...missingPartOne,
    ...missingPartTwo,
  ];

  return {
    hydrated,
    name,

    // Part 1
    findings,
    reportRows,
    assignedCount,
    completeCount,
    areaCorrectCount,
    measurementCount,
    architectureCount,
    shortCount,
    structuralCount,
    totalSignals: SIGNALS.length,
    openSignalId: choices[R1.openSignal] || null,

    // Part 2
    measureStates,
    measureStateById,
    activeMeasure,
    revealedCount,
    allRevealed,
    totalMeasures: MEASURES.length,
    pick,
    pickedMeasure: pick ? measureById(pick) : null,
    rationale,
    feasibility,
    followUp,
    risks,

    // route-wide
    missingPartOne,
    missingPartTwo,
    missing,
    partOneComplete: missingPartOne.length === 0,
    partTwoComplete: missingPartTwo.length === 0,
    allComplete: missing.length === 0,

    // helpers components need
    areaName: (id: AreaId | null) => (id ? areaById(id).name : "— not assigned"),
  };
}

export type Route1State = ReturnType<typeof useRoute1>;
