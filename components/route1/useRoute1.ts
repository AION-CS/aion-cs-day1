"use client";

import { useProgress, useHydrated } from "@/lib/store";
import type { MissingItem } from "@/components/ui/MissingList";
import {
  AREAS,
  CRITERIA,
  FOLLOWUP_FIELDS,
  GENERIC_FALLBACK_CLUE,
  HORIZON_ITEMS,
  LEVEL_VALUE,
  OPTION_LINES,
  QUALIFYING_QUESTION,
  R1,
  RISK_FIELDS,
  SIGNALS,
  STAGE_B_METRICS,
  checkPriority,
  optionById,
  resolveEffectiveness,
  type AreaId,
  type Check2Result,
  type CriterionId,
  type EffectivenessAnswer,
  type EffectivenessVerdict,
  type Horizon,
  type Level,
  type OptionId,
  type Signal,
} from "@/lib/route1";

/** DOM ids the missing-item list scrolls to and flashes. */
export const domId = {
  name: "r1-name",

  task1: "task1",
  board: "r1-board",
  signal: (id: string) => `r1-signal-${id}`,
  approach: (areaId: string) => `r1-approach-${areaId}`,
  stageB: "r1-stage-b",
  metric: (id: string) => `r1-metric-${id}`,
  stageC: "r1-stage-c",
  horizonItem: (id: string) => `r1-horizon-${id}`,
  export1: "r1-export1",

  task2: "task2",
  optionCard: (id: string) => `r1-l2-option-${id}`,
  optionScore: (optionId: string, criterionId: string) => `r1-l2-score-${optionId}-${criterionId}`,
  priority: "r1-l2-priority",
  justification: "r1-l2-justification",
  followUp: (i: number) => `r1-l2-followup-${i}`,
  risks: "r1-l2-risks",
  export2: "r1-export2",
};

const isAreaId = (v: string | undefined): v is AreaId => !!v && AREAS.some((a) => a.id === v);
const isEffAnswer = (v: string | undefined): v is EffectivenessAnswer => v === "yes" || v === "no";
const isHorizon = (v: string | undefined): v is Horizon => v === "shortTerm" || v === "structural";
const isLevel = (v: string | undefined): v is Level => v === "low" || v === "medium" || v === "high";
const isOptionId = (v: string | undefined): v is OptionId => v === "a" || v === "b" || v === "c";

// ---------------------------------------------------------------------------
// Stage A — signal placement
// ---------------------------------------------------------------------------

export type SignalState = {
  signal: Signal;
  area: AreaId | null;
  secondaryArea: AreaId | null;
  checkCount: number;
  placed: boolean;
};

/** Never says which area is correct — one verdict for the card's primary placement. */
export type CheckResult = { holds: true } | { holds: false; clue: string; tier: "soft" | "sharp" };

export function checkSignalPlacement(state: SignalState, checkCountAfter: number): CheckResult {
  if (!state.area) return { holds: true };
  const tier: "soft" | "sharp" = checkCountAfter >= 2 ? "sharp" : "soft";
  if (state.area === state.signal.primaryArea) return { holds: true };
  const clue = (state.signal.clue ?? GENERIC_FALLBACK_CLUE)[tier];
  return { holds: false, clue, tier };
}

// ---------------------------------------------------------------------------
// Stage B — informative vs management-effective
// ---------------------------------------------------------------------------

export type MetricState = {
  id: string;
  n: number;
  text: string;
  answer: EffectivenessAnswer | null;
  verdict: EffectivenessVerdict | null;
  checkCount: number;
  expected: EffectivenessAnswer;
  clue: { soft: string; sharp: string };
};

export function checkMetric(state: MetricState, checkCountAfter: number): CheckResult {
  if (!state.answer) return { holds: true };
  if (state.answer === state.expected) return { holds: true };
  const tier: "soft" | "sharp" = checkCountAfter >= 2 ? "sharp" : "soft";
  return { holds: false, clue: state.clue[tier], tier };
}

// ---------------------------------------------------------------------------
// Stage C — short-term vs structural
// ---------------------------------------------------------------------------

export type HorizonState = {
  id: string;
  n: number;
  text: string;
  lane: Horizon | null;
  checkCount: number;
  expected: Horizon;
  clue: { soft: string; sharp: string };
};

export function checkHorizon(state: HorizonState, checkCountAfter: number): CheckResult {
  if (!state.lane) return { holds: true };
  if (state.lane === state.expected) return { holds: true };
  const tier: "soft" | "sharp" = checkCountAfter >= 2 ? "sharp" : "soft";
  return { holds: false, clue: state.clue[tier], tier };
}

// ---------------------------------------------------------------------------
// Task 2 — assessment + decision
// ---------------------------------------------------------------------------

export type OptionAssessment = {
  optionId: OptionId;
  scores: Record<CriterionId, Level | null>;
  scoredCount: number;
  fullyScored: boolean;
  radarValues: Record<string, number>;
};

/**
 * Joins the shared progress store to Route 1's whole route — Task 1
 * (Diagnose, three stages) and Task 2 (Decide) — with two independent
 * `missing`/`complete` pairs, one per task's own export (task1.ts's file
 * header explains why this route uses two exports rather than one).
 */
export function useRoute1() {
  const hydrated = useHydrated();
  const notes = useProgress((s) => s.notes);
  const choices = useProgress((s) => s.choices);

  const name = notes[R1.name] ?? "";

  // -- Task 1, Stage A ---------------------------------------------------
  const signalStates: SignalState[] = SIGNALS.map((signal) => {
    const rawArea = choices[R1.area(signal.id)];
    const area = isAreaId(rawArea) ? rawArea : null;
    const rawSecondary = choices[R1.areaSecondary(signal.id)];
    const secondaryArea = isAreaId(rawSecondary) ? rawSecondary : null;
    const checkCount = Number(notes[R1.checkCount(signal.id)] ?? "0") || 0;
    return { signal, area, secondaryArea, checkCount, placed: !!area };
  });
  const signalById = (id: string) => signalStates.find((s) => s.signal.id === id)!;
  const byArea = (areaId: AreaId) => signalStates.filter((s) => s.area === areaId);
  const unplacedSignals = signalStates.filter((s) => !s.placed);
  const placedCount = signalStates.filter((s) => s.placed).length;

  const approachByArea: Record<string, string> = {};
  for (const a of AREAS) approachByArea[a.id] = (notes[R1.approach(a.id)] ?? "").trim();
  const areasWithApproach = AREAS.filter((a) => approachByArea[a.id].length > 0).length;

  // -- Task 1, Stage B -----------------------------------------------------
  const metricStates: MetricState[] = STAGE_B_METRICS.map((m) => {
    const raw = choices[R1.effectiveness(m.id)];
    const answer = isEffAnswer(raw) ? raw : null;
    const checkCount = Number(notes[R1.checkCountB(m.id)] ?? "0") || 0;
    return {
      id: m.id,
      n: m.n,
      text: m.text,
      answer,
      verdict: answer ? resolveEffectiveness(answer) : null,
      checkCount,
      expected: m.expected,
      clue: m.clue,
    };
  });
  const metricById = (id: string) => metricStates.find((m) => m.id === id)!;
  const metricsAnswered = metricStates.filter((m) => m.answer).length;
  const effectiveCount = metricStates.filter((m) => m.verdict === "effective").length;
  const informativeCount = metricStates.filter((m) => m.verdict === "informative").length;

  // -- Task 1, Stage C -------------------------------------------------------
  const horizonStates: HorizonState[] = HORIZON_ITEMS.map((h) => {
    const raw = choices[R1.horizon(h.id)];
    const lane = isHorizon(raw) ? raw : null;
    const checkCount = Number(notes[R1.checkCountC(h.id)] ?? "0") || 0;
    return { id: h.id, n: h.n, text: h.text, lane, checkCount, expected: h.expected, clue: h.clue };
  });
  const horizonById = (id: string) => horizonStates.find((h) => h.id === id)!;
  const byLane = (lane: Horizon) => horizonStates.filter((h) => h.lane === lane);
  const horizonPlacedCount = horizonStates.filter((h) => h.lane).length;

  const task1Missing: MissingItem[] = [];
  if (!name.trim()) task1Missing.push({ id: domId.name, label: "Your name — needed to label the export" });
  for (const s of signalStates) {
    if (!s.placed) {
      task1Missing.push({ id: domId.signal(s.signal.id), label: `Signal ${s.signal.n} — not placed into an area yet` });
    }
  }
  for (const a of AREAS) {
    if (!approachByArea[a.id]) {
      task1Missing.push({ id: domId.approach(a.id), label: `${a.name} — no first improvement approach written yet` });
    }
  }
  for (const m of metricStates) {
    if (!m.answer) {
      task1Missing.push({ id: domId.metric(m.id), label: `Stage B, metric ${m.n} — qualifying question not answered yet` });
    }
  }
  for (const h of horizonStates) {
    if (!h.lane) {
      task1Missing.push({ id: domId.horizonItem(h.id), label: `Stage C, item ${h.n} — not sorted yet` });
    }
  }
  const task1Complete = task1Missing.length === 0;

  // -- Task 2 ----------------------------------------------------------------
  const options: OptionAssessment[] = OPTION_LINES.map((opt) => {
    const scores = {} as Record<CriterionId, Level | null>;
    const radarValues: Record<string, number> = {};
    for (const c of CRITERIA) {
      const raw = choices[R1.score(opt.id, c.id)];
      const level = isLevel(raw) ? raw : null;
      scores[c.id] = level;
      radarValues[c.id] = level ? LEVEL_VALUE[level] : 0;
    }
    const scoredCount = CRITERIA.filter((c) => scores[c.id]).length;
    return { optionId: opt.id, scores, scoredCount, fullyScored: scoredCount === CRITERIA.length, radarValues };
  });
  const optionAssessment = (id: OptionId) => options.find((o) => o.optionId === id)!;
  const allOptionsScored = options.every((o) => o.fullyScored);

  const rawPriority = choices[R1.priority];
  const priority = isOptionId(rawPriority) ? rawPriority : null;
  const justification = (notes[R1.justification] ?? "").trim();
  const followUps = FOLLOWUP_FIELDS.map((f) => (notes[R1.followUp(f.id)] ?? "").trim());
  const risks = RISK_FIELDS.map((r) => (notes[R1.risk(r.id)] ?? "").trim());
  const risksFilledCount = risks.filter((r) => r.length > 0).length;
  const checkCount2 = Number(notes[R1.checkCount2] ?? "0") || 0;

  const lastCheck2: Check2Result | null = priority ? checkPriority(priority, justification, checkCount2) : null;

  const task2Missing: MissingItem[] = [];
  if (!name.trim()) task2Missing.push({ id: domId.name, label: "Your name — needed to label the export" });
  for (const opt of options) {
    const letter = optionById(opt.optionId).letter;
    for (const c of CRITERIA) {
      if (!opt.scores[c.id]) {
        task2Missing.push({ id: domId.optionScore(opt.optionId, c.id), label: `Line ${letter} — "${c.name}" criterion not rated yet` });
      }
    }
  }
  if (!priority) task2Missing.push({ id: domId.priority, label: "Priority pick — choose which line to prioritise first" });
  if (!justification) task2Missing.push({ id: domId.justification, label: "Justification — empty" });
  followUps.forEach((f, i) => {
    if (!f) task2Missing.push({ id: domId.followUp(i), label: `${FOLLOWUP_FIELDS[i].label} — not written yet` });
  });
  if (risksFilledCount < RISK_FIELDS.length) {
    task2Missing.push({ id: domId.risks, label: `Only ${risksFilledCount} of ${RISK_FIELDS.length} risks written` });
  }
  const task2Complete = task2Missing.length === 0;

  return {
    hydrated,
    name,

    // Task 1
    signalStates,
    signalById,
    byArea,
    unplacedSignals,
    placedCount,
    totalSignals: SIGNALS.length,
    approachByArea,
    areasWithApproach,
    metricStates,
    metricById,
    metricsAnswered,
    effectiveCount,
    informativeCount,
    horizonStates,
    horizonById,
    byLane,
    horizonPlacedCount,
    task1Missing,
    task1Complete,

    // Task 2
    options,
    optionAssessment,
    allOptionsScored,
    priority,
    justification,
    followUps,
    risks,
    risksFilledCount,
    checkCount2,
    lastCheck2,
    task2Missing,
    task2Complete,
  };
}

export type Route1State = ReturnType<typeof useRoute1>;
export { QUALIFYING_QUESTION };
