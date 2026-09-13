/**
 * Route 1 — the DataWeave engagement. One case, one arc, one deliverable.
 *
 * Day 11 ships two routes (CLAUDE.md #12, CURRICULUM-GUIDE.md §2): this one
 * carries curriculum levels 1 and 2, Route 2 carries level 3. The shape is
 * material-first — all five sections are taught before any interaction, then
 * one task with two internal parts on a single continuous scroll, then one
 * export.
 *
 * Everything that would otherwise be said twice lives here and only here: the
 * company, the role, the learner's name field, the handover between the parts,
 * and the export contract.
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

  // -- Part 1: diagnose -----------------------------------------------------
  area: (signalId: string) => `r1:area:${signalId}`,
  rootCause: (signalId: string) => `r1:root:${signalId}`,
  horizon: (signalId: string) => `r1:horizon:${signalId}`,
  approach: (signalId: string) => `r1:approach:${signalId}`,
  /** Stringified count of Check presses on a signal — exported for grading. */
  checks: (signalId: string) => `r1:checks:${signalId}`,
  /** markSeen bucket: signals whose clue was opened at least once. */
  clues: "r1:clues",
  /** markSeen bucket: the order signals were first given an area. */
  processed: "r1:processed",

  /**
   * Which signal card is expanded. Persisted rather than component-local so a
   * missing-item click can open the right card before scrolling to a field
   * inside it — a missing entry that lands on a collapsed panel is a dead
   * click, which CLAUDE.md #2 does not allow.
   */
  openSignal: "r1:open",

  // -- Part 2: decide -------------------------------------------------------
  situational: (measureId: string) => `r1:sit:${measureId}`,
  /** One key per predicted dimension. Stored as a stringified 1–10; 0 = not set. */
  predict: (measureId: string, dimKey: string) => `r1:pred:${measureId}:${dimKey}`,
  /** markSeen bucket: measures whose real profile has been revealed. */
  revealed: "r1:revealed",
  pick: "r1:pick",
  rationale: "r1:rationale",
  feasibility: "r1:feasibility",
  followUp: (n: 1 | 2) => `r1:followup:${n}`,
  risk: (n: 1 | 2) => `r1:risk:${n}`,
  /** Which measure tab is open — persisted for the same reason as openSignal. */
  tab: "r1:tab",
} as const;

/** Prefixes resetSection() must sweep to clear every compound key this route writes. */
export const R1_KEY_PREFIXES = [
  "r1:area:",
  "r1:root:",
  "r1:horizon:",
  "r1:approach:",
  "r1:checks:",
  "r1:sit:",
  "r1:pred:",
  "r1:pick",
  "r1:rationale",
  "r1:feasibility",
  "r1:followup:",
  "r1:risk:",
  "r1:open",
  "r1:tab",
];

export const PAGE_INTRO = {
  tag: "ROUTE 1 — DIAGNOSE & DECIDE",
  title: "The DataWeave Engagement",
  body: "Module 7, day two. Yesterday the question was how software consumes energy; today it is how you would ever know, and what you would change once you did. The five sections below are the whole teaching block — monitoring read with an efficiency lens, the four bands a load curve divides into, the architecture levers that actually move consumption, the five-way trade-off every decision sits inside, and why the two halves have to be decided together. Then you work one engagement at DataWeave Applications: six signals to diagnose, and one quarter of capacity to spend.",
} as const;

/** Stated once, above the material, and never re-introduced mid-page. */
export const ENGAGEMENT = {
  company: "DataWeave Applications",
  role: "Efficiency and architecture reviewer",
  heading: "The engagement",
  brief:
    "DataWeave Applications operates several digital platforms with a growing number of users. The systems have been extended over time and are, from the user's point of view, largely stable. At the same time infrastructure costs and complexity are rising steadily. The company has performance monitoring in place, but almost no structured analysis of the efficiency of its software architecture or the sustainability impact of individual components.",
  mandate: "You have been brought in to find out why — and then to say what should be funded.",
  deliverable:
    "You leave with one document: an Engagement Report whose first part is what you found, and whose second part is what you recommend DataWeave fund this quarter.",
} as const;

export const NAME_FIELD = {
  label: "Your name",
  instruction: "Use the same name on every export this week — it is how your submissions are matched.",
  placeholder: "e.g. Jane Muller",
} as const;

/**
 * The handover between the two parts. Inline, small, and built from the
 * learner's own answers — Part 2 has to read as caused by Part 1, not merely
 * printed after it (CLAUDE.md #12). It is never a gate: Part 2 is reachable
 * whether or not the six signals are finished.
 */
export const HANDOVER = {
  id: "r1-handover",
  kicker: "Handover",
  heading: "You now know what is wrong.",
  body: "Leadership does not fund diagnoses — it funds measures. The next question is not what is broken, it is what to spend the quarter on.",
  tally: (measurement: number, architecture: number, short: number, structural: number, total: number) =>
    total === 0
      ? "No findings filed yet — the split below fills in as you work through the six signals."
      : `You filed ${total} finding${total === 1 ? "" : "s"}: ${measurement} measurement gap${measurement === 1 ? "" : "s"}, ${architecture} architecture decision${architecture === 1 ? "" : "s"} — ${short} fixable in the short term, ${structural} needing structural anchoring.`,
  cta: "Continue to Part 2",
} as const;

/**
 * One export for the whole route. The document carries a part per stage and
 * the JSON keeps `partOne` / `partTwo` as separate top-level blocks, so a
 * grader can score the two levels independently out of a single file.
 */
export const EXPORT = {
  filenameLevels: [1, 2],
  filenameTask: 1,
  schemaVersion: "day11.route1.v1",
  docHeading: "DataWeave Engagement Report",
  buttonLabel: "Export the Engagement Report",
  partOne: "Part 1 — Diagnosis",
  partTwo: "Part 2 — Decision",
} as const;

/** Material chips shown on the case brief. */
export const BRIEF_REFS: MaterialSectionId[] = ["monitoring", "coupling"];
