/**
 * Route 2 — the NexLayer board memo. Curriculum level 3.
 *
 * Same shape as Route 1 (CLAUDE.md #12): the case once, the whole material
 * block, then the task, then one export. Route 1's engagement was an analyst's;
 * this one is a CTO advisor's, and the question has changed from "which measure
 * is best" to "which structure makes good measures the default, and who is
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

  /** Ranked decision ids, ordered, joined with "|" — the store holds no arrays of order. */
  ranking: "r2:ranking",
  rankWhy: "r2:rank:why",
  /** The diagnostic answer from "Test my ranking". */
  rankCheck: "r2:rank:check",

  /** Trade-off map: the two diagnostics per measure, and the strategic-bet line. */
  q1: (measureId: string) => `r2:q1:${measureId}`,
  q2: (measureId: string) => `r2:q2:${measureId}`,
  bet: (measureId: string) => `r2:bet:${measureId}`,
  /** Stringified count of wrong diagnostic answers on a measure — exported for grading. */
  retries: (measureId: string) => `r2:retry:${measureId}`,
  /** Which measure's diagnostics are open. */
  openMeasure: "r2:open",

  /** RACI: one key per cell, holding "" | R | A | C | I. */
  raci: (rowId: string, roleId: string) => `r2:raci:${rowId}:${roleId}`,

  /** The four decision-now fields. */
  decideNow: (key: string) => `r2:now:${key}`,
} as const;

export const R2_KEY_PREFIXES = [
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
  title: "Leading the Standard",
  body: "Route 1 diagnosed a platform and chose what to fund with one quarter. This route is the level above: who decides, what becomes binding, and how a recommendation survives a board that does not yet have the data it would like. Read how MetricFlow Digital Systems solved exactly this — a complete worked example, including the option it deliberately did not take — then lead at NexLayer Digital Platforms, a company that appears nowhere else in this course.",
} as const;

/** Stated once, above the task. */
export const NEXLAYER = {
  company: "NexLayer Digital Platforms",
  role: "Head of software and architecture strategy / CTO advisor",
  heading: "The mandate",
  brief:
    "NexLayer Digital Platforms develops and operates several digital products with a growing user base, rising technical complexity and increasing cost pressure in operations. Consistent efficiency transparency and binding architectural principles for sustainable system development are missing. Decisions are taken predominantly driven by function and deadlines.",
  conditions: [
    "High delivery and innovation pressure in development and product management.",
    "Differing interests across product, development, architecture, operations and management.",
    "Monitoring data exists, but is prepared in a way that is of limited relevance for management.",
    "Larger architectural changes are resource-intensive and politically sensitive.",
    "Budget and time restrictions limit far-reaching rebuilds.",
    "A standing risk that efficiency questions are treated as a technical specialist topic without management relevance.",
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
  title: "NexLayer Board Memo",
  minutes: 20,
  framing:
    "Four exercises, in the order a memo is actually built: what should be decided, what it costs to decide it, who owns it afterwards, and what cannot wait for the next round of data. The memo assembles on the right as you work.",
} as const;

export const EXPORT = {
  filenameLevels: [3],
  filenameTask: 1,
  schemaVersion: "day11.route2.v1",
  docHeading: "NexLayer Board Memo",
  buttonLabel: "Export the Board Memo",
} as const;
