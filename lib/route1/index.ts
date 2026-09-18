/**
 * Route 1 — the FutureGrid Technologies engagement, Level 1 only.
 *
 * Day 15 ships Route 1's Level 1 first: five micro-cards of material, then one
 * diagnosis task, then one export. Level 2 (prioritisation) is a separate,
 * later prompt and is not scaffolded here — but the page is shaped to grow it
 * onto the same scroll, below the task and above the export bar (CLAUDE.md §12).
 *
 * Everything that would otherwise be said twice lives here and only here: the
 * company, the role, the learner's name field, and the export contract.
 */

import type { MaterialSectionId } from "./sections";

export * from "./sections";
export * from "./material";
export * from "./task1";

export const LEARNER_NAME_KEY = "learner:name";

// ---------------------------------------------------------------------------
// Store key map — every key this route writes.
// ---------------------------------------------------------------------------
export const R1 = {
  name: LEARNER_NAME_KEY,

  /** Q1 — the load answer for one initiative. */
  load: (initiativeId: string) => `r1:t1:load:${initiativeId}`,
  /** Q2 — the structure answer for one initiative. */
  structure: (initiativeId: string) => `r1:t1:structure:${initiativeId}`,
  lens: (initiativeId: string) => `r1:t1:lens:${initiativeId}`,
  rationale: (initiativeId: string) => `r1:t1:why:${initiativeId}`,
  /** Stringified count of "Check my reasoning" runs covering this initiative — exported for grading. */
  checkCount: (initiativeId: string) => `r1:t1:check:${initiativeId}`,
  /** The closing free-text question. */
  closing: "r1:t1:closing",
  /** Which of the seven lens chips in C4 have been opened — drives a soft nudge only. */
  lensesSeen: "r1:c4:lenses",
} as const;

/** Prefixes resetSection() must sweep to clear every compound key this route writes. */
export const R1_KEY_PREFIXES = ["r1:t1:", "r1:c4:"];

export const PAGE_INTRO = {
  tag: "ROUTE 1 — ASSESS & DECIDE",
  title: "Innovations for the Sustainable IT of Tomorrow",
  body: "Module 11, Level 1. New technology is not automatically sustainable technology: AI can cut energy and add compute at the same time, a circular model can be the right direction and still be hard to run, and an initiative can be genuinely exciting while reducing nothing at all. Five short cards below give you the vocabulary and the decision rules. Then you use them on FutureGrid Technologies' six planned initiatives — telling a sustainability opportunity from something that is only technologically attractive.",
} as const;

/** Stated once, above the task, and never re-introduced mid-page. */
export const ENGAGEMENT = {
  company: "FutureGrid Technologies",
  role: "Innovation assessment analyst",
  heading: "The engagement",
  brief:
    "FutureGrid Technologies is planning six innovation initiatives at once — AI, data services, procurement, hardware and a new customer offering. Management is enthusiastic about all of them, and no integrated way of judging them exists yet.",
  mandate:
    "You have been brought in to assess, not to approve: to say which initiatives are genuine sustainability opportunities, which are sustainability risks, and which are mixed and need conditions attached.",
  deliverable:
    "You leave with one document: a FutureGrid Technologies Innovation Diagnosis, giving every initiative a verdict, the lens that explains it, and a one-line rationale naming both the benefit and the burden.",
} as const;

export const NAME_FIELD = {
  label: "Your name",
  instruction: "Use the same name on every export this week — it is how your submissions are matched.",
  placeholder: "e.g. Jane Muller",
} as const;

/**
 * One export for the whole route so far: a print-ready HTML report sent
 * straight to the browser's print dialog — "Save as PDF" is the export
 * (lib/downloadFile.ts `printHtmlDocument`). Filename: `1-{name}-day15-l1task1`.
 */
export const EXPORT = {
  filenameLevels: [1],
  filenameTask: 1,
  docHeading: "FutureGrid Technologies Innovation Diagnosis",
  buttonLabel: "Export as PDF",
} as const;

/** Material chips shown on the case brief. */
export const BRIEF_REFS: MaterialSectionId[] = ["lenses", "viability"];
