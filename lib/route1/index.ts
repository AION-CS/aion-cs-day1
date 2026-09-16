/**
 * Route 1 — the ProcessNova engagement. One case, one arc, one deliverable.
 *
 * Day 13 ships one route only (see routes.ts and sections.ts for why): it
 * covers curriculum levels 1 and 2 in a single triage-escalate-deep-dive task,
 * not a two-part diagnose-then-decide engagement. The shape is still
 * material-first — all four sections are taught before any interaction — then
 * one task on a single continuous scroll, then one export.
 *
 * Everything that would otherwise be said twice lives here and only here: the
 * company, the role, the learner's name field, and the export contract.
 */

import type { MaterialSectionId } from "./sections";

export * from "./sections";
export * from "./material";
export * from "./partOne";

export const LEARNER_NAME_KEY = "learner:name";

// ---------------------------------------------------------------------------
// Store key map — every key this route writes.
// ---------------------------------------------------------------------------
export const R1 = {
  name: LEARNER_NAME_KEY,

  // -- Step 1: triage (all seven) --------------------------------------------
  triageTag: (signalId: string) => `r1:triage:tag:${signalId}`,
  /** Index into the signal's `segments` array of the phrase the learner tapped. */
  triageEvidence: (signalId: string) => `r1:triage:ev:${signalId}`,
  /** Stringified count of "Check my triage" presses — exported for grading. */
  triageChecks: "r1:triage:checks",
  /** The triage signature (every row's tag+evidence) as of the last check, to detect a stale result. */
  triageLastSig: "r1:triage:lastsig",
  /** How many rows held as of the last check. */
  triageLastOk: "r1:triage:lastok",
  /** toggleCheck: the clue (every decisive phrase marked) has been opened. */
  triageClue: "r1:triage:clue",
  /** toggleCheck: "Show the reasoning" was used, after two genuine checks. */
  triageReveal: "r1:triage:reveal",
  /** How many checks had been made when the reasoning was revealed — exported for grading. */
  triageRevealAt: "r1:triage:revealat",

  // -- Step 2: escalate -------------------------------------------------------
  /** The two escalated signal ids, joined with "|" — the store holds no arrays. */
  escalate: "r1:escalate",
  escalateWhy: "r1:escalate:why",

  // -- Step 3: deep dive (the two escalated signals only) ---------------------
  area: (signalId: string) => `r1:area:${signalId}`,
  effect: (signalId: string) => `r1:effect:${signalId}`,
  approach: (signalId: string) => `r1:approach:${signalId}`,
  /** Stringified count of Check presses on one deep-dive signal — exported for grading. */
  analysisChecks: (signalId: string) => `r1:an:checks:${signalId}`,
  /** The area:effect signature as of that signal's last check, to detect staleness. */
  analysisLastSig: (signalId: string) => `r1:an:lastsig:${signalId}`,
  /** markSeen bucket: signals whose deep-dive clue was opened at least once. */
  clues: "r1:clues",
  /** toggleCheck per signal: "Show the reasoning" was used, after two genuine checks. */
  analysisReveal: (signalId: string) => `r1:an:reveal:${signalId}`,
} as const;

/** Prefixes resetSection() must sweep to clear every compound key this route writes. */
export const R1_KEY_PREFIXES = [
  "r1:triage:",
  "r1:escalate",
  "r1:area:",
  "r1:effect:",
  "r1:approach:",
  "r1:an:",
  "r1:clues",
];

export const PAGE_INTRO = {
  tag: "ROUTE 1 — DIAGNOSE & DECIDE",
  title: "The ProcessNova Engagement",
  body: "Module 9, day one. Digitalisation is a lever, not a guarantee: the four sections below are the whole teaching block — the five mechanisms that make it a genuine sustainability lever, the line between what a system itself consumes and what changes around it, why an efficiency gain doesn't automatically stay banked, and the six-area framework that sorts a finding before it can be acted on. Then you work one engagement at ProcessNova Services: seven signals to triage, two to take further.",
} as const;

/** Stated once, above the material, and never re-introduced mid-page. */
export const ENGAGEMENT = {
  company: "ProcessNova Services",
  role: "Digital sustainability analyst",
  heading: "The engagement",
  brief:
    "ProcessNova Services has digitalised most of its paper-based processes over the past two years. New dashboards, data platforms and monitoring solutions have been introduced across procurement, operations and engineering; process lead times have shortened; and storage, data-analysis and infrastructure needs are rising steadily. Departments keep requesting new digital analyses and functions. No systematic environmental assessment of any of this exists.",
  mandate: "You have been brought in to sort what has actually happened — and to say where a closer look pays off.",
  deliverable:
    "You leave with one document: a Signal Triage & Deep-Dive Report covering all seven signals and the full workup on the two you escalated.",
} as const;

export const NAME_FIELD = {
  label: "Your name",
  instruction: "Use the same name on every export this week — it is how your submissions are matched.",
  placeholder: "e.g. Jane Muller",
} as const;

/**
 * One export for the whole route. Levels 1 and 2 are both covered by this
 * single task, so — unlike a two-part route — the JSON keeps one continuous
 * `task` block rather than a `partOne` / `partTwo` split; `triage`,
 * `escalation` and `analysis` inside it are what keep the three steps
 * separately gradable.
 */
export const EXPORT = {
  filenameLevels: [1, 2],
  filenameTask: 1,
  schemaVersion: "day13.route1.v1",
  docHeading: "ProcessNova Signal Triage & Deep-Dive Report",
  buttonLabel: "Export the Signal Triage & Deep-Dive Report",
} as const;

/** Material chips shown on the case brief. */
export const BRIEF_REFS: MaterialSectionId[] = ["lever", "impact"];
