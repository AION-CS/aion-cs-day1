/**
 * Route 2 — the Level 3 management-decision route: the NetSphere worked
 * example, then the Vertex Board Memo Builder.
 *
 * Same shape as Route 1 (CLAUDE.md #12): one material block (A–F, plus the
 * rubric and reflection framing), one task, one export. Self-contained per
 * §13 — nothing here silently depends on Route 1.
 */

import type { MaterialSectionId } from "./sections";

export * from "./sections";
export * from "./material";
export * from "./task";

export const LEARNER_NAME_KEY = "learner:name";

// ---------------------------------------------------------------------------
// Store key map
// ---------------------------------------------------------------------------
export const R2 = {
  name: LEARNER_NAME_KEY,

  // -- Material --------------------------------------------------------------
  hotspotRead: (id: string) => `r2:hotspot:${id}`,
  openHotspot: "r2:openhotspot",
  leverOpen: (id: string) => `r2:lever:${id}`,
  reflection: (id: string) => `r2:reflect:${id}`,
  reflectionInclude: "r2:reflect:include",
  micro: (questionId: string) => `r2:micro:${questionId}`,

  // -- Task section 1: strategic relevance -----------------------------------
  relevance: (id: string) => `r2:relevance:${id}`,
  relevanceRationale: "r2:relevance:rationale",

  // -- Task section 2: guiding decisions --------------------------------------
  guidingText: (n: 1 | 2 | 3) => `r2:guiding:${n}:text`,
  guidingOwner: (n: 1 | 2 | 3) => `r2:guiding:${n}:owner`,
  guidingQuarter: (n: 1 | 2 | 3) => `r2:guiding:${n}:quarter`,

  // -- Task section 3: decision logic ------------------------------------------
  /** Rank slots for the top 3 of 7 criteria, joined "leverage|risk|controllability". */
  criteriaRank: "r2:criteria:rank",
  boundary: "r2:boundary",

  // -- Task section 4: trade-offs -----------------------------------------------
  /** Every link, JSON-encoded: [{a,b,note}]. */
  tradeOffs: "r2:tradeoffs",
  /** Which factor node is the pending first click of a new link. Session-shaped but kept in notes for simplicity; cleared on selection. */
  pendingLink: "r2:tradeoffs:pending",

  // -- Task section 5: first measure ---------------------------------------------
  firstMeasure: "r2:measure",
  justification: "r2:justification",
  committedBudget: "r2:budget",

  // -- Task section 6: governance -------------------------------------------------
  raci: (responsibilityId: string, roleId: string) => `r2:raci:${responsibilityId}:${roleId}`,
  reviewMechanism: "r2:review",

  // -- Task section 7: decision now -----------------------------------------------
  decisionNow: "r2:decisionnow",
  confidence: "r2:confidence",
  changeMyMind: "r2:changemymind",

  // -- Self-assessment + check log -------------------------------------------------
  selfAssess: (id: string) => `r2:selfassess:${id}`,
  checkLog: "r2:checklog",

  // -- Route chrome -----------------------------------------------------------------
  bannerDismissed: "r2:banner",
  mentorSample: "r2:mentor",
  previewOpenMobile: "r2:previewmobile",
} as const;

/** Everything "Reset to empty" clears: every r2 key, plus the shared name field. */
export const R2_KEY_PREFIXES = ["r2:", LEARNER_NAME_KEY];

export const PAGE_INTRO = {
  tag: "ROUTE 2 — MANAGEMENT DECISION",
  title: "Governing Connected Infrastructure",
  body: "Level 3 for Module 8. Route 1 built the technical vocabulary; this route is where it becomes a board decision. Walk NetSphere Industrial Systems GmbH's full reasoning chain — six management dimensions, four levers, one prioritised measure, fully justified — then build your own decision-ready proposal for a different company, under different conditions, in a live memo that assembles as you write it.",
} as const;

export const BANNER = {
  label: "Suggested sequence",
  text: "Level 3 material → Level 3 task. Route 1 covers the technical foundations, but this route is self-contained — every concept used here is explained here. Nothing is locked.",
} as const;

export const NAME_FIELD = {
  label: "Your name",
  instruction: "Use the same name on every export this week — it is how your submissions are matched.",
  placeholder: "e.g. Jane Muller",
} as const;

/** Material chips shown on the Vertex brief. */
export const BRIEF_REFS: MaterialSectionId[] = ["management", "measure"];
