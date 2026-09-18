/**
 * Route 2 — Levels 2 and 3 merged into one continuous route, one task in two
 * parts (CLAUDE.md §12/§13 pattern, "Format 2"). Route 1 taught participants
 * to diagnose; this route teaches the next two moves — prioritise under
 * limited budget, then propose under incomplete data — each grounded in
 * exactly one lean material section.
 */

import type { MaterialSectionId } from "./sections";

export * from "./sections";
export * from "./material";
export * from "./task";

export const LEARNER_NAME_KEY = "learner:name";

// ---------------------------------------------------------------------------
// Store key map — everything this route writes.
// ---------------------------------------------------------------------------
export const R2 = {
  name: LEARNER_NAME_KEY,

  // -- Part 1: prioritise -----------------------------------------------------
  /** "1" | "2" | "3" | "" (unranked) per criterion × measure-line. */
  rank: (criterionId: string, lineId: string) => `r2:p1:rank:${criterionId}:${lineId}`,
  /** Stringified count of "Check my thinking" presses on this criterion. */
  rankChecks: (criterionId: string) => `r2:p1:checks:${criterionId}`,
  priority: "r2:p1:priority",
  priorityJustify: "r2:p1:justify",

  // -- Part 2: propose ----------------------------------------------------------
  relevance: "r2:p2:relevance",
  firstMove: "r2:p2:firstmove",
  /** "owns" | "consulted" | "" per ownership node. */
  ownership: (nodeId: string) => `r2:p2:own:${nodeId}`,
  decideName: "r2:p2:decide:name",
  decideReversible: "r2:p2:decide:reversible",
  decideMoreData: "r2:p2:decide:moredata",
} as const;

/** Prefixes resetSection() must sweep to clear every compound key this route writes. */
export const R2_KEY_PREFIXES = ["r2:p1:", "r2:p2:"];

export const PAGE_INTRO = {
  tag: "ROUTE 2 — MANAGEMENT DECISION",
  title: "From Diagnosis to a Funded Proposal",
  body: "Route 1 diagnosed why Mercury Office Systems' Green IT measures were stalling. This route makes the next two moves: given limited budget, which line of measures gets funded first — and once you've chosen, how do you turn that choice into a short, decision-ready proposal under data that is still incomplete? Two lean sections teach exactly what the task needs, then one task in two parts: Prioritise, then Propose.",
} as const;

/** Stated once, above the task. */
export const ENGAGEMENT = {
  company: "Valora Digital Operations",
  role: "IT-governance lead",
  heading: "The mandate",
  brief:
    "As IT-governance lead of Valora Digital Operations, you have budget for exactly one line of Green IT measures to fund first. The data to prove any option's exact impact is incomplete, and the choice has to be defensible to a board that will ask why the others waited.",
  mandate: "Score, choose, then turn your choice into a proposal management can act on.",
  deliverable: "You leave with one document: a Valora Digital Operations Priority Proposal — your scored choice from Part 1 and your proposal from Part 2.",
} as const;

export const NAME_FIELD = {
  label: "Your name",
  instruction: "Use the same name on every export this week — it is how your submissions are matched.",
  placeholder: "e.g. Jane Muller",
} as const;

/** One export for the whole route, both parts, following the established one-route-one-export convention (see README for why this departs from the brief's two-export suggestion). */
export const EXPORT = {
  filenameLevels: [2, 3],
  filenameTask: 1,
  docHeading: "Valora Digital Operations Priority Proposal",
  buttonLabel: "Export as PDF",
} as const;

export const BRIEF_REFS: MaterialSectionId[] = ["criteria", "ownership"];
