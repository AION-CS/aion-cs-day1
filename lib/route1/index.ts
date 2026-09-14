/**
 * Route 1 — the SmartLink Operations engagement. One case, one arc, one
 * deliverable.
 *
 * Day 12 ships two routes (CLAUDE.md #12, CURRICULUM-GUIDE.md §2): this one
 * carries curriculum levels 1 and 2, Route 2 carries level 3. The shape is
 * material-first — all seven sections are taught before any interaction — then
 * one task with two internal parts on a single continuous scroll (Part 1, the
 * Signal Board; Part 2, the Decision Scorecard), then one export.
 *
 * Everything that would otherwise be said twice lives here and only here: the
 * company, the learner's name field, the suggested-sequence banner, the
 * handover between the parts, and the export contract.
 *
 * Nothing in lib/route1 may import a "use client" module: the route page is a
 * server component and reads PAGE_INTRO from here.
 */

import type { MaterialSectionId } from "./sections";

export * from "./sections";
export * from "./material";
export * from "./partOne";
export * from "./partTwo";

export const LEARNER_NAME_KEY = "learner:name";

// ---------------------------------------------------------------------------
// Store key map — every key this route writes, both parts, one prefix.
// ---------------------------------------------------------------------------
export const R1 = {
  name: LEARNER_NAME_KEY,

  // -- Part 1: the Signal Board ---------------------------------------------
  /** "potential" | "risk" | "both" */
  reading: (signalId: string) => `r1:reading:${signalId}`,
  /** The one-line justification required when the reading is "both". */
  bothWhy: (signalId: string) => `r1:bothwhy:${signalId}`,
  /** The zone the signal is routed to. */
  zone: (signalId: string) => `r1:zone:${signalId}`,
  approach: (signalId: string) => `r1:approach:${signalId}`,
  /** "technology" | "governance" */
  rootCause: (signalId: string) => `r1:root:${signalId}`,
  /** "short" | "structural" */
  horizon: (signalId: string) => `r1:horizon:${signalId}`,
  /**
   * Which signal card is expanded. Persisted rather than component-local so a
   * missing-item click can open the right card before scrolling to a field
   * inside it — a missing entry that lands on a collapsed panel is a dead
   * click, which CLAUDE.md #2 does not allow.
   */
  openSignal: "r1:open",
  /** markSeen bucket: the order signals were first routed. */
  routed: "r1:routed",
  /** JSON log of "Check my routing" presses: [{ at, clues }]. Exported for grading. */
  checkLog: "r1:checklog",

  // -- Part 2: the Decision Scorecard ---------------------------------------
  /** One key per criterion, holding the three rank slots as "B|A|C" ("" = empty slot). */
  rank: (criterionId: string) => `r1:rank:${criterionId}`,
  chosen: "r1:chosen",
  justification: "r1:justification",
  followUp: (n: 1 | 2) => `r1:followup:${n}`,
  risk: (n: 1 | 2) => `r1:risk:${n}`,
  /** JSON log of "Check my reasoning" presses. */
  reasonLog: "r1:reasonlog",

  // -- Material --------------------------------------------------------------
  /** A micro-check answer. Not graded, never part of the missing list. */
  micro: (questionId: string) => `r1:micro:${questionId}`,

  // -- Route chrome ----------------------------------------------------------
  bannerDismissed: "r1:banner",
  /** True from a mentor demo fill until "Reset to empty" — stamps every export. */
  mentorSample: "r1:mentor",
} as const;

/** Everything "Reset to empty" clears: every r1 key, plus the shared name field. */
export const R1_KEY_PREFIXES = ["r1:", LEARNER_NAME_KEY];

export const PAGE_INTRO = {
  tag: "ROUTE 1 — DIAGNOSE & DECIDE",
  title: "The SmartLink Operations Engagement",
  body: "Module 8. Connectivity is usually presented as progress. This route teaches you to read it the way a network architect or a sustainability lead does — as capacity that has to be provisioned, powered, maintained, replaced and disposed of, whether or not anyone is using it. The seven sections below are the whole teaching block. Then you work one engagement at SmartLink Operations: six signals to diagnose on the Signal Board, and one line of measures to rank, choose and defend.",
} as const;

/** Suggested order — a dismissible note, never a lock (CLAUDE.md #6). */
export const BANNER = {
  label: "Suggested sequence",
  text: "Material (S1–S7) → Part 1, the Signal Board → Part 2, the Decision Scorecard. You may move freely between sections at any time; nothing is locked.",
} as const;

/** Stated once, above the material, and never re-introduced mid-page. */
export const ENGAGEMENT = {
  company: "SmartLink Operations",
  role: "Network and IoT sustainability reviewer",
  heading: "The engagement",
  brief: [
    "SmartLink Operations is modernising its network infrastructure, rolling out connected sensors across production and building management, and expanding mobile 5G applications. Management associates this programme with efficiency, innovation and modernisation. IT and operations are less certain: nobody has assessed the energy demand, the added device density, the data volumes or the long-term operating load.",
    "Six signals from the current plan are on the table. None of them is obviously wrong. Each of them carries a sustainability consequence that is not yet visible in the business case.",
  ],
  mandate:
    "Your job: diagnose each signal, route it to the part of the system it actually affects, and state what you would do about it — then decide which single line of measures SmartLink should prioritise.",
  deliverable:
    "You leave with one document: Part 1 is the Sustainability Signal Report, Part 2 is the Prioritisation Decision Memo.",
} as const;

export const NAME_FIELD = {
  label: "Your name",
  instruction: "Use the same name on every export this week — it is how your submissions are matched.",
  placeholder: "e.g. Jane Muller",
} as const;

/**
 * The handover between the two parts. Inline, small, and built from the
 * learner's own routing — Part 2 has to read as caused by Part 1, not merely
 * printed after it (CLAUDE.md #12). It is never a gate.
 */
export const HANDOVER = {
  id: "r1-handover",
  kicker: "Handover",
  heading: "You can see the system. Now decide what to fund.",
  body: "A board of signals is not a decision. SmartLink can prioritise one line of measures, and the signals you routed are the evidence each option has to answer to.",
  tally: (p: {
    routed: number;
    total: number;
    zonesUsed: number;
    governance: number;
    technology: number;
    short: number;
    structural: number;
  }) =>
    p.routed === 0
      ? "No signals routed yet — the split below fills in as you work the board."
      : `You routed ${p.routed} of ${p.total} signal${p.total === 1 ? "" : "s"} across ${p.zonesUsed} of 7 zones: ${p.governance} tagged as a missing governance or architecture decision, ${p.technology} as technology use — ${p.short} visible short-term, ${p.structural} structurally effective.`,
  carry:
    "Carry one rule across: a technology that is more efficient per unit is not a decision about total consumption. Someone still has to decide what gets connected, measured and retired.",
  cta: "Continue to Part 2",
} as const;

/**
 * One export for the whole route. The document carries a part per level and
 * the JSON keeps `partOne` / `partTwo` as separate top-level blocks, so a
 * grader can score the two levels independently out of a single file.
 */
export const EXPORT = {
  filenameLevels: [1, 2],
  filenameTask: 1,
  schemaVersion: "day12.route1.v1",
  docHeading: "SmartLink Signal Report & Decision Memo",
  buttonLabel: "Export the Signal Report & Decision Memo",
  anywayLabel: "Export anyway (incomplete)",
  partOne: "Part 1 — Sustainability Signal Report",
  partTwo: "Part 2 — Prioritisation Decision Memo",
  incompleteStamp: "STATUS: INCOMPLETE DRAFT",
  mentorStamp: "MENTOR SAMPLE — not participant work",
} as const;

/** Material chips shown on the case brief. */
export const BRIEF_REFS: MaterialSectionId[] = ["infrastructure", "iot", "fiveg"];
