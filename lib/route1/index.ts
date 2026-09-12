/**
 * Route 1 — the AppNexa engagement. One case, one arc, one deliverable.
 *
 * From Day 11 on a day ships two routes instead of three (CLAUDE.md #12,
 * CURRICULUM-GUIDE.md §2): this route carries curriculum levels 1 and 2 as a
 * single continuous engagement — the learner diagnoses AppNexa's running
 * system (stage 1, ./diagnosis.ts) and then decides what the company funds
 * with the one quarter of capacity it has (stage 2, ./decision.ts). Level 3 is
 * Route 2.
 *
 * Everything that would otherwise be said twice lives here and only here: the
 * company, the role, the learner's name field, the bridge between the stages,
 * and the export contract. The two half-modules carry material and mechanics
 * only.
 */

import type { MaterialSection } from "./sections";
import { FOUNDATION_MATERIAL } from "./diagnosis";
import { DECISION_MATERIAL } from "./decision";

export * from "./sections";
export * from "./diagnosis";
export * from "./decision";

export const LEARNER_NAME_KEY = "learner:name";

// ---------------------------------------------------------------------------
// Store key map — every key this route writes, both stages, one prefix.
//
// The decision keys used to be `r2:*` when deciding was its own route. They are
// `r1:*` now because they belong to the same route as the diagnosis keys; a
// route whose store keys disagree about which route they are in is a merge that
// was never finished.
// ---------------------------------------------------------------------------
export const R1 = {
  name: LEARNER_NAME_KEY,

  // -- Stage 1: diagnosis ---------------------------------------------------
  /** markSeen bucket for hotspot pins the learner has opened on the trace. */
  inspected: "r1:inspected",
  /**
   * markSeen bucket recording the order hotspots were first sorted into a bin.
   * markSeen appends unique ids in insertion order and persists, so the report
   * can list findings "in the order completed" without a second source of truth
   * for ordering.
   */
  order: "r1:order",
  category: (hotspotId: string) => `r1:cat:${hotspotId}`,
  lever: (hotspotId: string) => `r1:lever:${hotspotId}`,
  justification: (hotspotId: string) => `r1:why:${hotspotId}`,
  fixType: (hotspotId: string) => `r1:fix:${hotspotId}`,
  reflection: "r1:reflection",

  // -- Stage 2: decision ----------------------------------------------------
  /** Which of the four answers the learner gave to an option's situational question. */
  situational: (optionId: string) => `r1:sit:${optionId}`,
  /** One key per predicted dimension. Stored as a stringified 1–5. */
  predict: (optionId: string, dimKey: string) => `r1:pred:${optionId}:${dimKey}`,
  /** markSeen bucket: options whose real profile has been revealed at least once. */
  revealed: "r1:revealed",
  pick: "r1:pick",
  rationale: "r1:rationale",
  feasibility: "r1:feasibility",
  followUp: (n: 1 | 2) => `r1:followup:${n}`,
  risk: (n: 1 | 2) => `r1:risk:${n}`,
} as const;

/** Prefixes resetSection() must sweep to clear every compound key this route writes. */
export const R1_KEY_PREFIXES = [
  "r1:cat:",
  "r1:lever:",
  "r1:why:",
  "r1:fix:",
  "r1:reflection",
  "r1:sit:",
  "r1:pred:",
  "r1:pick",
  "r1:rationale",
  "r1:feasibility",
  "r1:followup:",
  "r1:risk:",
];

/**
 * The route's material as the learner meets it: one run, A through J. Stage 1
 * teaches A–F and stage 2 teaches G–J, and the page renders each half directly
 * above the stage that uses it (CURRICULUM-GUIDE.md §3) rather than front-
 * loading all ten sections.
 */
export const MATERIAL: MaterialSection[] = [...FOUNDATION_MATERIAL, ...DECISION_MATERIAL];

export const PAGE_INTRO = {
  tag: "ROUTE 1 — DIAGNOSE & DECIDE",
  title: "The AppNexa Engagement",
  body: "You are joining AppNexa Solutions as a Software Sustainability Analyst, for one engagement that runs the way the real thing does. First you learn to see where a system you did not build wastes energy, and go find it on AppNexa's live trace. Then, with your own diagnosis in hand and exactly one quarter of capacity to spend, you decide what the company actually funds — and defend that call against the two options you turned down. One report leaves with you at the end, carrying both halves.",
} as const;

/** Stated once, at the top of the route, and never re-introduced mid-page. */
export const ENGAGEMENT = {
  company: "AppNexa Solutions",
  role: "Software Sustainability Analyst",
  heading: "The engagement",
  brief:
    "AppNexa Solutions builds and runs internal and external digital applications for business customers. The platform is functionally stable and users are not complaining. Infrastructure cost has risen steadily for two years, and no systematic efficiency review has ever been carried out. You are the first person to look at the running system with efficiency as the question.",
  deliverable:
    "You leave with one document: an Engagement Report whose first part is what you found, and whose second part is what you recommend AppNexa do about it.",
} as const;

export const NAME_FIELD = {
  label: "Your name",
  instruction:
    'Used to label the exported report — it becomes e.g. "1-jane-day11-l1l2task1". One field for the whole route; both parts of the report carry it.',
  placeholder: "e.g. Jane Muller",
} as const;

/**
 * The bridge between the two stages.
 *
 * This is the piece that makes the route one thing rather than two: stage 2 has
 * to read as *caused by* stage 1, not merely printed after it. The component
 * rendering this also feeds the learner their own counts back, and it carries
 * the one genuinely load-bearing line from the standalone recap the merge
 * deleted — which of the six categories each option actually attacks.
 */
export const BRIDGE = {
  id: "r1-bridge",
  kicker: "Two weeks later",
  heading: "Your diagnosis is on the table. Now they ask what to do about it.",
  body: "Management has read your findings and believes them — that argument is over. What they will not do is act on all six this quarter. Development capacity is already committed, product management has not withdrawn its speed target, and nobody at AppNexa can yet say with data which application is the most expensive to run.",
  turn:
    'So the question changes shape. It stops being "what is wrong with this system" and becomes "what do we spend one quarter of limited capacity on, and how do we defend that choice to the people who sign it off". Three lines of measures are on the table, and exactly one of them gets funded.',
  carry:
    "Option B fixes instances inside the first five categories you have just been sorting into. Options A and C are, in different ways, both attempts to fix the sixth — the management logic that let the other five happen in the first place.",
  handoff: "Sections G–J below give you the way to compare them. Then you spend the quarter.",
  /** Rendered with the learner's own numbers, so the bridge is about their work. */
  tally: (structural: number, quick: number, complete: number) =>
    complete === 0
      ? "Your report is still empty — this reads better once you have filed a finding or two above."
      : `You filed ${complete} finding${complete === 1 ? "" : "s"}: ${structural} needing a structural standard, ${quick} fixable as a one-off patch.`,
} as const;

/**
 * One export for the whole route (CLAUDE.md #12). The document carries a part
 * per stage and the JSON keeps those parts as separate blocks, so both levels
 * stay separately gradable out of a single file. `filenameLevels` is what makes
 * the filename say which objectives the file covers: `1-jane-day11-l1l2task1`.
 */
export const EXPORT = {
  filenameLevels: [1, 2],
  filenameTask: 1,
  docHeading: "AppNexa Engagement Report",
  buttonLabel: "Export the Engagement Report",
  partOne: "Part 1 — Diagnosis",
  partTwo: "Part 2 — Decision",
} as const;
