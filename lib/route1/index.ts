/**
 * Route 1 — Clarity Digital Services, Level 1 (diagnose) and Level 2
 * (prioritise). Two short material-then-task pairs, each with its own
 * export (see task1.ts / task2.ts for why this route reverts to the
 * pre-§12, two-export shape rather than CLAUDE.md §12's merged single
 * export). Everything that would otherwise be said twice — the company,
 * the learner's name field, the case brief — lives here and only here.
 */

import type { MaterialSectionId } from "./sections";

export * from "./sections";
export * from "./material";
export * from "./task1";
export * from "./task2";

export const LEARNER_NAME_KEY = "learner:name";

// ---------------------------------------------------------------------------
// Store key map — every key this route writes.
// ---------------------------------------------------------------------------
export const R1 = {
  name: LEARNER_NAME_KEY,

  // -- Task 1 ------------------------------------------------------------
  /** Stage A — the primary area a signal card is placed in. */
  area: (signalId: string) => `r1:t1:area:${signalId}`,
  /** Stage A — an optional second area tag. */
  areaSecondary: (signalId: string) => `r1:t1:area2:${signalId}`,
  /** Stringified count of "Check" runs on one signal card. */
  checkCount: (signalId: string) => `r1:t1:check:${signalId}`,
  /** The one required improvement-approach note, per area. */
  approach: (areaId: string) => `r1:t1:approach:${areaId}`,

  /** Stage B — the qualifying yes/no answer per candidate metric. */
  effectiveness: (metricId: string) => `r1:t1:eff:${metricId}`,
  checkCountB: (metricId: string) => `r1:t1:checkb:${metricId}`,

  /** Stage C — the short-term/structural lane per item. */
  horizon: (itemId: string) => `r1:t1:horizon:${itemId}`,
  checkCountC: (itemId: string) => `r1:t1:checkc:${itemId}`,

  // -- Task 2 --------------------------------------------------------------
  /** Phase 1 — one Low/Medium/High level per (option, criterion) pair. */
  score: (optionId: string, criterionId: string) => `r1:t2:score:${optionId}:${criterionId}`,
  /** Phase 2 — the single priority pick (option id). */
  priority: "r1:t2:priority",
  justification: "r1:t2:justification",
  followUp: (index: number) => `r1:t2:followup:${index}`,
  risk: (index: number) => `r1:t2:risk:${index}`,
  /** Stringified count of "Check my reasoning" runs on the priority decision. */
  checkCount2: "r1:t2:check",
} as const;

/** Prefixes resetSection() must sweep to clear every compound key this route writes. */
export const R1_KEY_PREFIXES = ["r1:t1:", "r1:t2:"];

export const PAGE_INTRO = {
  tag: "ROUTE 1 — KPIS, OPTIMISATION & MONITORING",
  title: "Capturing & Visualising Sustainability Targets",
  body: "Module 12. Many organisations measure a great deal and manage very little: a figure can be accurate, even impressive, and still change nothing because it was never wired to a target, an owner and a decision. Two short pairs of material and task below give you that vocabulary and then put it to work — first diagnosing why Clarity Digital Services' metrics don't yet steer anything, then prioritising which single line of measures to build first, under real budget and data constraints.",
} as const;

/** Stated once, above both pairs, and never re-introduced mid-page. */
export const ENGAGEMENT = {
  company: "Clarity Digital Services",
  role: "Metrics & reporting analyst",
  heading: "The engagement",
  brief:
    "Clarity Digital Services has already introduced several Green IT measures — more efficient device procurement, longer usage cycles, first data-centre optimisations, and rules for resource use. Management now wants a dashboard and a reporting system that make progress visible.",
  mandate:
    "Today, only scattered individual figures exist, with no clear management logic. Task 1: diagnose why the data isn't yet steering anything, and sketch a first improvement per area. Task 2: step up a level — with only one line of measures fundable first, prioritise and defend a choice under incomplete data.",
  deliverable:
    "You leave with two short documents: the Clarity Digital Services Metrics Diagnosis (Task 1) and the Priority Line Decision (Task 2).",
} as const;

export const NAME_FIELD = {
  label: "Your name",
  instruction: "Use the same name on every export this week — it is how your submissions are matched.",
  placeholder: "e.g. Jane Muller",
} as const;

/** Material chips shown on the case brief. */
export const BRIEF_REFS: MaterialSectionId[] = ["dataVsManagement", "sixAreas"];
