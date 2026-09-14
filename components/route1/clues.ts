import {
  CRITERIA,
  OPTION_IDS,
  PART_ONE,
  REASONING_CHECK,
  zoneById,
  type OptionId,
} from "@/lib/route1";
import type { Route1State, SignalState } from "./useRoute1";
import { domId } from "./useRoute1";

/**
 * The two on-demand checks, as pure functions of the learner's own state.
 *
 * Neither ever names a correct answer (CLAUDE.md #4). "Check my routing" flags
 * patterns across the board — technology-domain overload, cross-cutting zones
 * left empty, one-sided readings, a single root cause everywhere — plus
 * internal contradictions, and gives a directional clue for a card outside its
 * defensible zones. "Check my reasoning" compares the learner's justification
 * with the learner's own ranking. At most three clues, most useful first.
 */

export type Clue = {
  id: string;
  text: string;
  /** DOM id "Take me there" scrolls to. */
  target: string;
  /** Opens this signal card first, when the target lives inside it. */
  signalId?: string;
};

export type CheckResult = { status: "tooEarly" | "clean" | "clues"; message?: string; clues: Clue[] };

/** One press of a check, kept (last 20) in the store as JSON and exported for grading. */
export type CheckLogEntry = { at: string; status: CheckResult["status"]; clues: string[] };

export function parseLog(raw: string | undefined): CheckLogEntry[] {
  try {
    const value: unknown = JSON.parse(raw ?? "[]");
    return Array.isArray(value) ? (value as CheckLogEntry[]) : [];
  } catch {
    return [];
  }
}

export const appendLog = (raw: string | undefined, result: CheckResult) =>
  JSON.stringify(
    [...parseLog(raw), { at: new Date().toISOString(), status: result.status, clues: result.clues.map((c) => c.text) }].slice(-20),
  );

const WORDS = ["No", "One", "Two", "Three", "Four", "Five", "Six", "Seven"];
const word = (n: number) => WORDS[n] ?? String(n);

export function routingClues(signals: SignalState[]): CheckResult {
  const routed = signals.filter((s) => s.routed);
  if (routed.length < 2) return { status: "tooEarly", message: PART_ONE.checkTooEarly, clues: [] };

  const clues: Clue[] = [];
  const byId = (id: string) => signals.find((s) => s.signal.id === id);

  // 1 — Technology-domain overload, anchored on the signal that describes a process.
  const technology = routed.filter((s) => s.zone && zoneById(s.zone).family === "technology");
  const s6 = byId("s6");
  const overload =
    !!s6?.routed && !!s6.zone && zoneById(s6.zone).family === "technology" && technology.length >= Math.max(2, routed.length - 1);
  if (overload) {
    clues.push({
      id: "overload",
      text: `${word(technology.length)} of ${word(routed.length).toLowerCase()} routed signals are filed under technology domains — re-read what Signal 6 actually describes: the absence of a process.`,
      target: domId.stepB("s6"),
      signalId: "s6",
    });
  }

  // 2 — A card outside every defensible zone gets its directional clue.
  for (const s of routed) {
    if (!s.zone || s.signal.acceptableZones.includes(s.zone)) continue;
    if (overload && s.signal.id === "s6") continue;
    const sharing = routed.filter((o) => o.zone === s.zone).length;
    const zoneName = zoneById(s.zone).name;
    const lead =
      sharing >= 2
        ? `${word(sharing)} signals are filed under ${zoneName}.`
        : `Signal ${s.signal.n} is filed under ${zoneName}.`;
    clues.push({ id: `misroute-${s.signal.id}`, text: `${lead} ${s.signal.clue}`, target: domId.stepB(s.signal.id), signalId: s.signal.id });
  }

  // 3 — Internal contradiction: a governance gap that resolves inside the year.
  for (const s of routed) {
    if (s.rootCause === "governance" && s.horizon === "short") {
      clues.push({
        id: `contradiction-${s.signal.id}`,
        text: `Signal ${s.signal.n} is tagged Missing governance + Visible short-term. Governance gaps rarely resolve inside one operating year — is the short-term effect you are picturing actually the symptom or the cause?`,
        target: domId.horizon(s.signal.id),
        signalId: s.signal.id,
      });
    }
  }

  // 4 — One root cause everywhere.
  const tagged = routed.filter((s) => s.rootCause);
  if (tagged.length >= 4 && tagged.every((s) => s.rootCause === tagged[0].rootCause)) {
    const allGovernance = tagged[0].rootCause === "governance";
    clues.push({
      id: "same-root",
      text: allGovernance
        ? "Every tagged signal carries the same root cause. Run the equipment test on Signal 1: would modern, load-adaptive equipment remove the problem, or only postpone it?"
        : "Every tagged signal carries the same root cause. Run the equipment test on Signal 6: which equipment purchase would create an assessment process?",
      target: domId.rootCause(allGovernance ? "s1" : "s6"),
      signalId: allGovernance ? "s1" : "s6",
    });
  }

  // 5 — One-sided readings.
  if (routed.length >= 4) {
    if (routed.every((s) => s.reading === "risk")) {
      clues.push({
        id: "all-risk",
        text: "Every signal you have read is a risk. Sensor rollouts are usually sold on their potential — re-read Signal 2 and ask what would decide whether it saves energy elsewhere.",
        target: domId.stepB("s2"),
        signalId: "s2",
      });
    } else if (routed.every((s) => s.reading === "potential")) {
      clues.push({
        id: "all-potential",
        text: "Every signal you have read is a potential. Re-read Signal 6: can the absence of an assessment save anything by itself?",
        target: domId.stepB("s6"),
        signalId: "s6",
      });
    }
  }

  // 6 — Both cross-cutting zones still empty.
  if (routed.length >= 4 && !routed.some((s) => s.zone && zoneById(s.zone).family === "crosscutting")) {
    clues.push({
      id: "crosscutting-empty",
      text: "Both cross-cutting zones are still empty. Check whether any signal describes a commitment over time or a missing process, rather than a component.",
      target: domId.board,
    });
  }

  // 7 — One horizon everywhere.
  const horizons = routed.filter((s) => s.horizon);
  if (horizons.length >= 4 && horizons.every((s) => s.horizon === horizons[0].horizon)) {
    clues.push({
      id: "same-horizon",
      text: "Every tagged signal has the same time horizon. Ask of each one: does the effect show within this operating year, or does it change how future decisions are made?",
      target: domId.horizon(horizons[0].signal.id),
      signalId: horizons[0].signal.id,
    });
  }

  if (clues.length === 0) return { status: "clean", message: PART_ONE.checkClean, clues: [] };
  return { status: "clues", clues: clues.slice(0, 3) };
}

/** A fingerprint of everything the routing check reads, to tell when its result has gone stale. */
export const routingSignature = (signals: SignalState[]) =>
  signals.map((s) => [s.reading, s.zone, s.rootCause, s.horizon].join(":")).join("|");

export function reasoningClues(r1: Route1State): CheckResult {
  if (!r1.chosen) return { status: "tooEarly", message: REASONING_CHECK.noChoice, clues: [] };
  const chosen: OptionId = r1.chosen;
  const clues: Clue[] = [];

  const flat = OPTION_IDS.find((o) => CRITERIA.every((c) => r1.ranks[c.id][o] === 1));
  if (flat) clues.push({ id: "flat", text: REASONING_CHECK.flat(flat), target: domId.criterion("risk") });

  const mismatch = CRITERIA.find((c) => r1.ranks[c.id][chosen] === 3 && c.keywords.test(r1.justification));
  if (mismatch) clues.push({ id: "mismatch", text: REASONING_CHECK.mismatch(mismatch.argues), target: domId.criterion(mismatch.id) });

  const s = r1.justificationSignals;
  if (!s.boundary) clues.push({ id: "boundary", text: REASONING_CHECK.noBoundary, target: domId.justification });
  if (!s.reviewPoint) clues.push({ id: "review", text: REASONING_CHECK.noReview, target: domId.justification });
  if (!s.falsifier) clues.push({ id: "falsifier", text: REASONING_CHECK.noFalsifier, target: domId.justification });

  if (clues.length === 0) return { status: "clean", message: REASONING_CHECK.clean, clues: [] };
  return { status: "clues", clues: clues.slice(0, 3) };
}

export const reasoningSignature = (r1: Route1State) =>
  [CRITERIA.map((c) => r1.slots[c.id].join("")).join("|"), r1.chosen, r1.justification].join("#");
