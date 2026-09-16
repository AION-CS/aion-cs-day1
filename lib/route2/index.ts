/**
 * Route 2 — the Synervia Board Memo. Curriculum level 3, Module 9.
 *
 * Same shape as Route 1 (CLAUDE.md #12): the case once, the whole material
 * block, then the task, then one export. Route 1's engagement was an
 * analyst's; this one is a CIO/transformation advisor's, and the question has
 * moved from "which signals matter" to "which line of measures the
 * organisation funds, under trade-offs, incomplete information, and who is
 * allowed to decide".
 */

export * from "./sections";
export * from "./material";
export * from "./task";

export const LEARNER_NAME_KEY = "learner:name";

// ---------------------------------------------------------------------------
// Store key map — everything this route writes.
// ---------------------------------------------------------------------------
export const R2 = {
  name: LEARNER_NAME_KEY,

  // -- Exercise 1: prioritise & defend ---------------------------------------
  prioritiseLane: "r2:prioritise:lane",
  rating: (dimKey: string) => `r2:prioritise:rating:${dimKey}`,
  ratingNote: (dimKey: string) => `r2:prioritise:note:${dimKey}`,
  justification: "r2:prioritise:justify",
  followUp: "r2:prioritise:followup",
  risk: (n: 1 | 2) => `r2:prioritise:risk:${n}`,

  // -- Exercise 2: rank the guiding decisions --------------------------------
  ranking: "r2:ranking",
  rankWhy: "r2:rank:why",
  rankCheck: "r2:rank:check",

  // -- Exercise 3: the trade-off map ------------------------------------------
  q1: (measureId: string) => `r2:q1:${measureId}`,
  q2: (measureId: string) => `r2:q2:${measureId}`,
  bet: (measureId: string) => `r2:bet:${measureId}`,
  retries: (measureId: string) => `r2:retry:${measureId}`,
  openMeasure: "r2:open",

  // -- Exercise 4: RACI --------------------------------------------------------
  raci: (rowId: string, roleId: string) => `r2:raci:${rowId}:${roleId}`,

  // -- Exercise 5: the decision that cannot wait ------------------------------
  decideNow: (key: string) => `r2:now:${key}`,
} as const;

export const R2_KEY_PREFIXES = [
  "r2:prioritise:",
  "r2:ranking",
  "r2:rank:",
  "r2:q1:",
  "r2:q2:",
  "r2:bet:",
  "r2:retry:",
  "r2:open",
  "r2:raci:",
  "r2:now:",
];

export const PAGE_INTRO = {
  tag: "ROUTE 2 — MANAGEMENT DECISION",
  title: "The Synervia Board Memo",
  body: "Route 1 diagnosed seven signals from one company's digitalisation programme. This route is the level above: which line of measures the organisation funds, under trade-offs and incomplete information, and who is allowed to decide. Read how EcoFlow Administration GmbH solved exactly this — a complete worked example, including the option it deliberately did not take — then lead at Synervia Process Group, a company that appears nowhere else in this course.",
} as const;

/** Stated once, above the task. */
export const SYNERVIA = {
  company: "Synervia Process Group",
  role: "Head of digital strategy / CIO / transformation advisor",
  heading: "The mandate",
  brief:
    "Synervia Process Group is under high transformation pressure across several business areas, with departments, IT, sustainability, finance and management holding differing interests in how fast and how far digitalisation should go. Transparency on the indirect environmental impacts of past initiatives is incomplete. Budget is restricted even as leadership wants visible modernisation successes to report. There is a standing risk that digitalisation gets sold internally as an automatic sustainability win. Requirements for manageability, traceability and governance are growing faster than the organisation's capacity to meet them.",
  conditions: [
    "High transformation pressure across several business areas at once.",
    "Differing interests between departments, IT, sustainability, finance and management.",
    "Incomplete transparency on the indirect environmental impacts of past initiatives.",
    "Budget restrictions alongside a desire for visible modernisation successes.",
    "A standing risk that digitalisation is sold internally as an automatic sustainability win.",
    "Growing requirements for manageability, traceability and governance.",
  ],
  mandate: "Produce a decision-ready board memo.",
} as const;

export const NAME_FIELD = {
  label: "Your name",
  instruction: "Use the same name on every export this week — it is how your submissions are matched.",
  placeholder: "e.g. Jane Muller",
} as const;

export const TASK = {
  id: "task",
  tag: "THE TASK",
  title: "Synervia Board Memo",
  minutes: 90,
  framing:
    "Five exercises, in the order a memo is actually built: what to fund and why, what else should be decided, what it costs to decide it, who owns it afterwards, and what cannot wait for the next round of data. None gates another. The memo assembles on the right as you work.",
} as const;

export const EXPORT = {
  filenameLevels: [3],
  filenameTask: 1,
  schemaVersion: "day13.route2.v1",
  docHeading: "Synervia Board Memo",
  buttonLabel: "Export the Board Memo",
} as const;
