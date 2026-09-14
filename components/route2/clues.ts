import { RESPONSIBILITIES, SECTION_3, SECTION_5, SECTION_6 } from "@/lib/route2";
import type { Route2State } from "./useRoute2";
import { domId } from "./useRoute2";

/**
 * "Check my memo" (§8.4) — on demand, clue-only, at most four clues ordered by
 * severity. None of the seven rules ever names the answer; §6's NetSphere
 * pattern-match rule is the one this whole task is built to catch.
 */

export type Clue = { id: string; text: string; target: string };
export type CheckResult = { status: "tooEarly" | "clean" | "clues"; message?: string; clues: Clue[] };

const NETSPHERE_MARKERS = /\b(uneven|five sites|modernis|committed budget|already committed|pilot fleet|support period|evidenced|latency requirement)\b/i;
const BLANKET_5G_STOP = /\b(all|every)\b[^.]{0,40}\b5g\b[^.]{0,20}\b(stop|halt|cancel|pause|deprioriti[sz]e|scrap)\b|\b(stop|halt|cancel|pause|deprioriti[sz]e|scrap)\b[^.]{0,40}\ball\b[^.]{0,20}\b5g\b/i;
const REVIEW_LANGUAGE = /\b(review|revisit|re-?assess\w*|checkpoint|milestone|by (the )?(end of )?q[1-4]|by (january|february|march|april|may|june|july|august|september|october|november|december))\b/i;
const FALSIFIER_LANGUAGE = /\bif\b[^.]{0,200}\b(shows?|falls?|rises?|exceeds?|below|above|does not|doesn't|fails?)\b|\bunless\b|\bwe (will )?(revise|stop|reverse|reconsider)\b/i;

export function memoClues(r2: Route2State): CheckResult {
  const touched = r2.firstMeasure || r2.justification.trim().length > 0 || r2.criteriaOrder.length > 0;
  if (!touched) return { status: "tooEarly", message: "Choose a first measure and write your justification before checking — the check reads your own memo, not a blank one.", clues: [] };

  const clues: Clue[] = [];

  // 1 — NetSphere pattern-match.
  if (r2.firstMeasure === "E" && r2.justification.trim() && !NETSPHERE_MARKERS.test(r2.justification)) {
    clues.push({
      id: "netsphere-match",
      text: "Your recommendation is defensible, but your justification could have been written before you read Vertex's conditions. Which of the five Vertex-specific facts changes how this measure must be implemented?",
      target: domId.justification,
    });
  }

  // 2 — Ignored work in flight.
  if (r2.committedBudgetAnswer.trim().length > 0 && r2.committedBudgetAnswer.trim().length < 40) {
    clues.push({
      id: "budget-ignored",
      text: "Two departments have already spent. A proposal that does not say what happens to that work will not survive the first meeting.",
      target: domId.committedBudget,
    });
  }

  // 3 — 5G reflex.
  if (r2.firstMeasure === "C" && BLANKET_5G_STOP.test(r2.justification)) {
    clues.push({
      id: "5g-reflex",
      text: "One use case has an evidenced latency requirement. Check whether your wording deprioritises it too.",
      target: domId.justification,
    });
  }

  // 4 — No boundary. The curriculum's own wording assumes "sustainability impact"
  // was ranked; say that only when it actually was, so the clue never misstates
  // the learner's own ranking back to them.
  if (r2.criteriaOrder.length > 0 && r2.boundary.trim().length < SECTION_3.boundary.min) {
    const rankedSustainability = r2.criteriaOrder.includes("sustainability");
    clues.push({
      id: "no-boundary",
      text: rankedSustainability
        ? "You ranked sustainability impact without declaring a perimeter. Section A explains why that number is then not comparable."
        : "You have not declared an assessment boundary. Section A explains why any sustainability figure is not comparable without one.",
      target: domId.boundary,
    });
  }

  // 5 — No falsification.
  if (r2.justification.trim().length >= 60 && !FALSIFIER_LANGUAGE.test(r2.justification)) {
    clues.push({
      id: "no-falsifier",
      text: "Your argument states a position but not the condition under which you would abandon it.",
      target: domId.justification,
    });
  }

  // 6 — Governance decoration.
  const raciComplete = RESPONSIBILITIES.every((r) => r2.raciTouched(r.id));
  if (raciComplete && r2.reviewMechanism.trim().length > 0 && r2.reviewMechanism.trim().length < SECTION_6.review.min) {
    clues.push({
      id: "decoration",
      text: "Criteria that no meeting ever tests are decorative.",
      target: domId.reviewMechanism,
    });
  }

  // 7 — Accountability collision.
  const collision = r2.raciViolations.find((v) => v.kind === "manyA");
  if (collision) {
    const resp = RESPONSIBILITIES.find((r) => r.id === collision.rowId);
    clues.push({
      id: "raci-collision",
      text: `Two roles are accountable for ${resp ? resp.label.toLowerCase() : "this responsibility"}. In practice that means nobody is.`,
      target: domId.raciRow(collision.rowId),
    });
  }

  // Weak justification (below section 5's minimum) — a general fallback, kept last.
  if (r2.justification.trim().length > 0 && r2.justification.trim().length < SECTION_5.justification.min) {
    clues.push({
      id: "short-justification",
      text: `Your justification is under the ${SECTION_5.justification.min}-character guide length — check it states the assumption, the falsifier and the review point, not only the recommendation.`,
      target: domId.justification,
    });
  }

  if (clues.length === 0) return { status: "clean", clues: [] };
  return { status: "clues", clues: clues.slice(0, 4) };
}

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
  JSON.stringify([...parseLog(raw), { at: new Date().toISOString(), status: result.status, clues: result.clues.map((c) => c.text) }].slice(-20));

/** A fingerprint of everything the check reads, to flag a stale result. */
export const memoSignature = (r2: Route2State) =>
  [r2.firstMeasure, r2.justification, r2.committedBudgetAnswer, r2.criteriaOrder.join(""), r2.boundary, r2.reviewMechanism, JSON.stringify(r2.raciViolations)].join("#");
