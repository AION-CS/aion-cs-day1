/**
 * Route 1 — the Mercury Office Systems engagement, Level 1 only.
 *
 * Day 14 ships Route 1's Level 1 material and Task 1 first (CLAUDE.md §12's
 * Part Two — prioritisation across the six areas — is a separate, later
 * prompt, and Route 2 / Level 3 hasn't been written at all yet). The shape
 * stays material-first: all four sections taught before any interaction,
 * then one task, then one export — ready to grow a Part Two onto the same
 * page once that prompt lands.
 *
 * Everything that would otherwise be said twice lives here and only here:
 * the company, the role, the learner's name field, and the export contract.
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

  area: (evidenceId: string) => `r1:t1:area:${evidenceId}`,
  approach: (evidenceId: string) => `r1:t1:approach:${evidenceId}`,
  rootCause: (evidenceId: string) => `r1:t1:root:${evidenceId}`,
  timeframe: (evidenceId: string) => `r1:t1:time:${evidenceId}`,
  /** Stringified count of "Check my classification" presses on this chip — exported for grading. */
  checkCount: (evidenceId: string) => `r1:t1:check:${evidenceId}`,
} as const;

/** Prefixes resetSection() must sweep to clear every compound key this route writes. */
export const R1_KEY_PREFIXES = ["r1:t1:"];

export const PAGE_INTRO = {
  tag: "ROUTE 1 — DIAGNOSE & DECIDE",
  title: "Implementing Sustainability Economically and in Line with Regulation",
  body: "Module 10, Level 1. Green IT measures rarely fail on technical grounds — they fail when the economic case is never proven, when only one ROI lens is applied, when the technology is treated as a finished measure with no behavioural design behind it, or when regulation is treated as paperwork imposed on IT rather than a management framework. The four sections below teach the vocabulary for one exercise: reading why Mercury Office Systems' sensible Green IT measures are stalling, and classifying that diagnosis across six areas.",
} as const;

/** Stated once, above the material, and never re-introduced mid-page. */
export const ENGAGEMENT = {
  company: "Mercury Office Systems",
  role: "Green IT implementation analyst",
  heading: "The engagement",
  brief:
    "Mercury Office Systems has identified several sensible Green IT measures — longer device service life, energy-saving usage rules, reduced unnecessary printing, new procurement requirements — but implementation keeps stalling despite broad agreement that the measures make sense.",
  mandate: "You have been brought in to read why implementation is stalling, and to classify what's actually blocking each measure before anyone proposes a fix.",
  deliverable:
    "You leave with one document: a Mercury Office Systems Diagnosis Report, classifying every indication of stalled implementation by area, root cause and timeframe, each with a first improvement approach.",
} as const;

export const NAME_FIELD = {
  label: "Your name",
  instruction: "Use the same name on every export this week — it is how your submissions are matched.",
  placeholder: "e.g. Jane Muller",
} as const;

/**
 * One export for the whole route so far: a print-ready HTML report sent
 * straight to the browser's print dialog — "Save as PDF" is the export
 * (lib/downloadFile.ts `printHtmlDocument`).
 */
export const EXPORT = {
  filenameLevels: [1],
  filenameTask: 1,
  docHeading: "Mercury Office Systems Diagnosis Report",
  buttonLabel: "Export as PDF",
} as const;

/** Material chips shown on the case brief. */
export const BRIEF_REFS: MaterialSectionId[] = ["businessCase", "behaviourChange"];
