"use client";

import { useProgress, useHydrated } from "@/lib/store";
import type { MissingItem } from "@/components/ui/MissingList";
import {
  APPROACH_FIELD,
  COMMIT,
  CRITERIA,
  OPTION_IDS,
  R1,
  SIGNALS,
  ZONES,
  analyseJustification,
  isOptionId,
  isZoneId,
  signalExcerpt,
  type CriterionId,
  type Horizon,
  type OptionId,
  type Rank,
  type Reading,
  type RootCause,
  type Signal,
  type ZoneId,
} from "@/lib/route1";
import { parseSlots, type Slots } from "./ranking";

/** DOM ids the missing list, the clues and the reference chips scroll to. */
export const domId = {
  name: "r1-name",

  // Part 1
  partOne: "part-1",
  board: "r1-board",
  routingCheck: "r1-routing-check",
  signal: (id: string) => `r1-signal-${id}`,
  /** The Step B wrapper — present whether the questions are open or folded into the routed summary. */
  stepB: (id: string) => `r1-signal-${id}-stepb`,
  reading: (id: string) => `r1-signal-${id}-reading`,
  bothWhy: (id: string) => `r1-signal-${id}-bothwhy`,
  zone: (id: string) => `r1-signal-${id}-zone`,
  /** Placeholder shown where Step D will open once the signal is routed. */
  stepD: (id: string) => `r1-signal-${id}-stepd`,
  approach: (id: string) => `r1-signal-${id}-approach`,
  rootCause: (id: string) => `r1-signal-${id}-root`,
  horizon: (id: string) => `r1-signal-${id}-horizon`,

  handover: "r1-handover",

  // Part 2
  partTwo: "part-2",
  matrix: "r1-matrix",
  criterion: (id: CriterionId) => `r1-rank-${id}`,
  chosen: "r1-chosen",
  justification: "r1-justification",
  followUp: (n: 1 | 2) => `r1-followup-${n}`,
  risks: "r1-risks",
  risk: (n: 1 | 2) => `r1-risk-${n}`,
  reasoningCheck: "r1-reasoning-check",

  export: "r1-export",
};

export type SignalState = {
  signal: Signal;
  reading: Reading | null;
  bothWhy: string;
  zone: ZoneId | null;
  /** Both diagnostic questions answered — the card has left the intake. */
  routed: boolean;
  approach: string;
  approachLength: number;
  rootCause: RootCause | null;
  horizon: Horizon | null;
  complete: boolean;
};

export type RiskTarget = { option: OptionId; mode: "notChosen" | "chosen" };

const NO_STRINGS: Record<string, string> = {};
const NO_BOOLS: Record<string, boolean> = {};

const asReading = (v?: string): Reading | null => (v === "potential" || v === "risk" || v === "both" ? v : null);
const asRoot = (v?: string): RootCause | null => (v === "technology" || v === "governance" ? v : null);
const asHorizon = (v?: string): Horizon | null => (v === "short" || v === "structural" ? v : null);

/**
 * Joins the shared progress store to Route 1's content — both parts, one hook.
 *
 * Until the store has hydrated it reads as empty, so the first client render
 * matches the statically exported HTML. One route has one `missing` list and
 * one definition of done (CLAUDE.md #12); entries pointing into a collapsed
 * signal card carry a `before` that opens it first.
 */
export function useRoute1() {
  const hydrated = useHydrated();
  const rawNotes = useProgress((s) => s.notes);
  const rawChoices = useProgress((s) => s.choices);
  const rawChecks = useProgress((s) => s.checks);
  const choose = useProgress((s) => s.choose);

  const notes = hydrated ? rawNotes : NO_STRINGS;
  const choices = hydrated ? rawChoices : NO_STRINGS;
  const checks = hydrated ? rawChecks : NO_BOOLS;

  const name = notes[R1.name] ?? "";

  // -- Part 1 ---------------------------------------------------------------
  const signals: SignalState[] = SIGNALS.map((signal) => {
    const reading = asReading(choices[R1.reading(signal.id)]);
    const zoneRaw = choices[R1.zone(signal.id)];
    const zone = isZoneId(zoneRaw) ? zoneRaw : null;
    const bothWhy = notes[R1.bothWhy(signal.id)] ?? "";
    const approach = notes[R1.approach(signal.id)] ?? "";
    const approachLength = approach.trim().length;
    const rootCause = asRoot(choices[R1.rootCause(signal.id)]);
    const horizon = asHorizon(choices[R1.horizon(signal.id)]);
    const routed = !!reading && !!zone;
    const complete =
      routed &&
      approachLength >= APPROACH_FIELD.min &&
      !!rootCause &&
      !!horizon &&
      (reading !== "both" || bothWhy.trim().length > 0);
    return { signal, reading, bothWhy, zone, routed, approach, approachLength, rootCause, horizon, complete };
  });

  const routedSignals = signals.filter((s) => s.routed);
  const zoneCounts = Object.fromEntries(
    ZONES.map((z) => [z.id, routedSignals.filter((s) => s.zone === z.id).length]),
  ) as Record<ZoneId, number>;
  const countRouted = (pred: (s: SignalState) => boolean) => routedSignals.filter(pred).length;

  const tally = {
    total: SIGNALS.length,
    routed: routedSignals.length,
    complete: signals.filter((s) => s.complete).length,
    zonesUsed: ZONES.filter((z) => zoneCounts[z.id] > 0).length,
    technology: countRouted((s) => s.rootCause === "technology"),
    governance: countRouted((s) => s.rootCause === "governance"),
    short: countRouted((s) => s.horizon === "short"),
    structural: countRouted((s) => s.horizon === "structural"),
    potential: countRouted((s) => s.reading === "potential"),
    risk: countRouted((s) => s.reading === "risk"),
    both: countRouted((s) => s.reading === "both"),
  };

  // -- Part 2 ---------------------------------------------------------------
  const slots = Object.fromEntries(CRITERIA.map((c) => [c.id, parseSlots(choices[R1.rank(c.id)])])) as Record<
    CriterionId,
    Slots
  >;
  const ranks = Object.fromEntries(
    CRITERIA.map((c) => [
      c.id,
      Object.fromEntries(
        OPTION_IDS.map((o) => {
          const i = slots[c.id].indexOf(o);
          return [o, i >= 0 ? ((i + 1) as Rank) : null];
        }),
      ),
    ]),
  ) as Record<CriterionId, Record<OptionId, Rank | null>>;

  const placedIn = (c: CriterionId) => slots[c].filter(Boolean).length;
  const rankedRows = CRITERIA.filter((c) => placedIn(c.id) === 3).length;
  const rankSums = Object.fromEntries(
    OPTION_IDS.map((o) => [o, CRITERIA.reduce((sum, c) => sum + (ranks[c.id][o] ?? 0), 0)]),
  ) as Record<OptionId, number>;
  const rankedFor = Object.fromEntries(
    OPTION_IDS.map((o) => [o, CRITERIA.filter((c) => ranks[c.id][o] !== null).length]),
  ) as Record<OptionId, number>;
  const firstPlaces = Object.fromEntries(
    OPTION_IDS.map((o) => [o, CRITERIA.filter((c) => ranks[c.id][o] === 1).length]),
  ) as Record<OptionId, number>;

  const chosenRaw = choices[R1.chosen];
  const chosen: OptionId | null = isOptionId(chosenRaw) ? chosenRaw : null;
  const justification = notes[R1.justification] ?? "";
  const justificationLength = justification.trim().length;
  const justificationSignals = analyseJustification(justification);
  const followUps: [string, string] = [notes[R1.followUp(1)] ?? "", notes[R1.followUp(2)] ?? ""];
  const risks: [string, string] = [notes[R1.risk(1)] ?? "", notes[R1.risk(2)] ?? ""];

  // The short-term-attractive option: lowest combined rank on Innovation + Feasibility.
  let riskTarget: RiskTarget | null = null;
  if (placedIn("innovation") === 3 && placedIn("feasibility") === 3) {
    const score = (o: OptionId) => (ranks.innovation[o] ?? 3) + (ranks.feasibility[o] ?? 3);
    const best = [...OPTION_IDS].sort(
      (a, b) => score(a) - score(b) || (ranks.innovation[a] ?? 3) - (ranks.innovation[b] ?? 3) || a.localeCompare(b),
    )[0];
    riskTarget = { option: best, mode: chosen === best ? "chosen" : "notChosen" };
  }

  // -- Missing list (standard #1: one entry per concrete gap, in page order) --
  const openSignal = (id: string) => () => choose(R1.openSignal, id);
  const missingPartOne: MissingItem[] = [];

  for (const s of signals) {
    const who = `Signal ${s.signal.n} — "${signalExcerpt(s.signal)}"`;
    const before = openSignal(s.signal.id);
    if (!s.reading) {
      missingPartOne.push({ id: domId.reading(s.signal.id), label: `${who}: potential/risk reading not selected`, before });
    }
    if (s.reading === "both" && !s.bothWhy.trim()) {
      missingPartOne.push({
        id: domId.bothWhy(s.signal.id),
        label: `${who}: "Both" was selected but no one-line justification given`,
        before,
      });
    }
    if (!s.zone) {
      missingPartOne.push({ id: domId.zone(s.signal.id), label: `${who}: area not selected, card still in Intake`, before });
    }
    const stepTarget = (field: string) => (s.routed ? field : domId.stepD(s.signal.id));
    if (s.approachLength < APPROACH_FIELD.min) {
      missingPartOne.push({
        id: stepTarget(domId.approach(s.signal.id)),
        label: `${who}: improvement approach is ${s.approachLength} characters, needs at least ${APPROACH_FIELD.min}`,
        before,
      });
    }
    if (!s.rootCause) {
      missingPartOne.push({ id: stepTarget(domId.rootCause(s.signal.id)), label: `${who}: root cause not tagged`, before });
    }
    if (!s.horizon) {
      missingPartOne.push({ id: stepTarget(domId.horizon(s.signal.id)), label: `${who}: time horizon not tagged`, before });
    }
  }

  const missingPartTwo: MissingItem[] = [];
  for (const c of CRITERIA) {
    const n = placedIn(c.id);
    if (n < 3) {
      missingPartTwo.push({
        id: domId.criterion(c.id),
        label: `Criterion "${c.name}": ranking incomplete (${n} of 3 options placed)`,
      });
    }
  }
  if (!chosen) missingPartTwo.push({ id: domId.chosen, label: "Prioritised option not selected" });
  if (justificationLength < COMMIT.justification.min) {
    missingPartTwo.push({
      id: domId.justification,
      label: `Justification is ${justificationLength} characters, needs at least ${COMMIT.justification.min}`,
    });
  }
  ([1, 2] as const).forEach((n) => {
    if (!followUps[n - 1].trim()) missingPartTwo.push({ id: domId.followUp(n), label: `Follow-up decision ${n} is empty` });
  });
  ([1, 2] as const).forEach((n) => {
    if (!risks[n - 1].trim()) {
      missingPartTwo.push({
        id: domId.risk(n),
        label: riskTarget
          ? `Risk ${n} for Option ${riskTarget.option} is empty`
          : `Risk ${n} is empty — rank Innovation benefit and Feasibility first so the option can be identified`,
      });
    }
  });

  const missing: MissingItem[] = [
    ...(name.trim() ? [] : [{ id: domId.name, label: "Participant name not entered — export filename will be incomplete" }]),
    ...missingPartOne,
    ...missingPartTwo,
  ];

  return {
    hydrated,
    name,
    mentorSample: !!checks[R1.mentorSample],

    // Part 1
    signals,
    signalState: (id: string) => signals.find((s) => s.signal.id === id)!,
    zoneCounts,
    tally,
    openSignalId: choices[R1.openSignal] || null,

    // Part 2
    slots,
    ranks,
    placedIn,
    rankedRows,
    rankSums,
    rankedFor,
    firstPlaces,
    chosen,
    justification,
    justificationLength,
    justificationSignals,
    followUps,
    risks,
    riskTarget,

    // Route-wide
    missingPartOne,
    missingPartTwo,
    missing,
    allComplete: missing.length === 0,
  };
}

export type Route1State = ReturnType<typeof useRoute1>;
