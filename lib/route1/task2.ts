/**
 * Task 2 — "Which line of measures should be prioritised first?" ~15
 * minutes, Level 2. Continues the same Clarity Digital Services engagement:
 * the seven criteria below are answered decision-first (clicking a
 * criterion shows the justification options directly — the option label
 * *is* the justification, never a blind Low/Medium/High slider,
 * CURRICULUM-GUIDE.md §5) and draw a live radar per option. The priority
 * pick is never graded right/wrong in the UI — the check only ever tests
 * whether the standard objection to *whichever* line was picked has been
 * pre-empted in the justification (CLAUDE.md §4).
 */

import type { AnswerKeyBlock } from "@/lib/answerKey";
import type { IconKey } from "@/lib/routes";
import type { MaterialSectionId } from "./sections";
import type { ClueTier } from "./task1";

// ---------------------------------------------------------------------------
// The seven assessment criteria (Task 2's scoring vocabulary)
// ---------------------------------------------------------------------------

export type CriterionId =
  | "leverage"
  | "steeringEffect"
  | "feasibility"
  | "informativeValue"
  | "longTerm"
  | "risk"
  | "connectability";

export type Level = "low" | "medium" | "high";
export const LEVEL_VALUE: Record<Level, number> = { low: 1, medium: 2, high: 3 };
export const LEVEL_LABEL: Record<Level, string> = { low: "Low", medium: "Medium", high: "High" };

export type Criterion = {
  id: CriterionId;
  short: string;
  name: string;
  definition: string;
  /** Six of seven read "bigger is stronger"; Risk alone reads in reverse. */
  direction: "higherStronger" | "higherRiskier";
  question: {
    label: string;
    instruction: string;
    options: { level: Level; label: string }[];
  };
  /** Keywords a justification counts as "referencing" this criterion (case-insensitive substring). */
  keywords: string[];
};

export const CRITERIA: Criterion[] = [
  {
    id: "leverage",
    short: "Leverage",
    name: "Strategic leverage",
    definition: "How much this shifts the whole metric system, not just one number.",
    direction: "higherStronger",
    question: {
      label: "Does this change one metric, or how metrics are managed across the board?",
      instruction: "Judge structural reach, not the size of the budget behind it.",
      options: [
        { level: "low", label: "Changes one number" },
        { level: "medium", label: "Changes several related numbers" },
        { level: "high", label: "Reshapes how metrics are managed org-wide" },
      ],
    },
    keywords: ["leverage", "strategic"],
  },
  {
    id: "steeringEffect",
    short: "Steering",
    name: "Steering effect",
    definition: "Whether this actually changes what gets decided, not just what gets displayed.",
    direction: "higherStronger",
    question: {
      label: "Does this change a decision, or mostly change what's on a screen?",
      instruction: "Ask what a manager would concretely do differently because of it.",
      options: [
        { level: "low", label: "Mostly visible, rarely acted on" },
        { level: "medium", label: "Sometimes changes a decision" },
        { level: "high", label: "Regularly changes what gets decided" },
      ],
    },
    keywords: ["steer", "decision", "act on"],
  },
  {
    id: "feasibility",
    short: "Feasib.",
    name: "Feasibility",
    definition: "Whether it can be delivered now, with today's data and people.",
    direction: "higherStronger",
    question: {
      label: "Can this be delivered now, with today's data and people?",
      instruction: "Judge current capacity, not capacity Clarity hopes to have later.",
      options: [
        { level: "low", label: "Needs data or capability we don't have yet" },
        { level: "medium", label: "Deliverable with some stretch" },
        { level: "high", label: "Deliverable now, with what we already have" },
      ],
    },
    keywords: ["feasib", "deliver"],
  },
  {
    id: "informativeValue",
    short: "Informat.",
    name: "Informative value",
    definition: "Whether it tells you something that changes a decision, or just something that's true (M6).",
    direction: "higherStronger",
    question: {
      label: "Does this tell you something that changes a decision, or just something accurate?",
      instruction: "An accurate number can still be uninformative — judge decision relevance, not precision.",
      options: [
        { level: "low", label: "Accurate, but rarely changes a call" },
        { level: "medium", label: "Sometimes shifts a call" },
        { level: "high", label: "Regularly shifts a call" },
      ],
    },
    keywords: ["informative", "insight", "decision"],
  },
  {
    id: "longTerm",
    short: "Long-term",
    name: "Long-term effect",
    definition: "Whether the benefit lasts, or decays once attention moves elsewhere.",
    direction: "higherStronger",
    question: {
      label: "Does the benefit last, or fade once attention moves on?",
      instruction: "Picture this line eighteen months after launch, without anyone chasing it.",
      options: [
        { level: "low", label: "Likely fades without active push" },
        { level: "medium", label: "Holds if actively maintained" },
        { level: "high", label: "Self-sustaining once running" },
      ],
    },
    keywords: ["long-term", "long term", "durab", "lasting", "decay", "fade"],
  },
  {
    id: "risk",
    short: "Risk",
    name: "Risk",
    definition: "What could concretely go wrong, and how exposed Clarity is if it does.",
    direction: "higherRiskier",
    question: {
      label: "How much could concretely go wrong, and how exposed would Clarity be?",
      instruction: "Unlike the other six, a High score here is a caution sign, not a strength.",
      options: [
        { level: "low", label: "Little exposure — failure modes are minor or contained" },
        { level: "medium", label: "Some exposure — manageable with normal oversight" },
        { level: "high", label: "Significant exposure — failure would be costly or hard to reverse" },
      ],
    },
    keywords: ["risk"],
  },
  {
    id: "connectability",
    short: "Connect.",
    name: "Connectability",
    definition: "Whether it connects cleanly into management decision-making — reviews, budget, accountability.",
    direction: "higherStronger",
    question: {
      label: "Does this plug into an existing review, budget or accountability cycle — or sit outside all of them?",
      instruction: "Ask whether the line has somewhere to report into, not just something to produce.",
      options: [
        { level: "low", label: "No natural review or owner to report into yet" },
        { level: "medium", label: "Could connect, with some extra work" },
        { level: "high", label: "Slots directly into an existing or planned review" },
      ],
    },
    keywords: ["connect", "governance", "review", "accountab"],
  },
];

export const criterionById = (id: CriterionId): Criterion => CRITERIA.find((c) => c.id === id)!;

// ---------------------------------------------------------------------------
// The three candidate lines of measures
// ---------------------------------------------------------------------------

export type OptionId = "a" | "b" | "c";

export type OptionLine = {
  id: OptionId;
  letter: string;
  icon: IconKey;
  title: string;
  description: string;
  radarStyle: { color: "accent" | "ink" | "warn"; dash?: string; marker: "circle" | "square" | "triangle" };
};

export const OPTION_LINES: OptionLine[] = [
  {
    id: "a",
    letter: "A",
    icon: "gauge",
    title: "Green IT KPI & dashboard system",
    description: "A KPI and dashboard system for management and departments, built on the six-area framework from M3.",
    radarStyle: { color: "accent", marker: "circle" },
  },
  {
    id: "b",
    letter: "B",
    icon: "factory",
    title: "IT-specific carbon monitoring",
    description: "A carbon monitoring build with a pragmatic baseline, an emissions logic, and allocation of the relevant Scope 1/2/3 sources.",
    radarStyle: { color: "ink", dash: "7 4", marker: "square" },
  },
  {
    id: "c",
    letter: "C",
    icon: "cycle",
    title: "Review & improvement process",
    description: "A review and improvement process that uses existing data systematically for continuous optimisation (M5's PDCA loop, put into practice).",
    radarStyle: { color: "warn", dash: "2 3", marker: "triangle" },
  },
];

export const optionById = (id: OptionId): OptionLine => OPTION_LINES.find((o) => o.id === id)!;

// ---------------------------------------------------------------------------
// Task framing
// ---------------------------------------------------------------------------

export const TASK2_FRAMING = {
  tag: "TASK 2 · DECIDE",
  title: "Which line of measures should be prioritised first?",
  minutes: 15,
  lead:
    "Budget is limited. Management wants visible, credible progress. Data is partly incomplete. Departments want simple, not over-complex reports. IT wants to avoid a metric system that is barely usable operationally.",
  instruction: "You can push only one central line of measures first. Assess, choose, and defend your choice — even with incomplete information.",
} as const;

export const CONTEXT_CHIPS_T2: string[] = [
  "Limited budget",
  "Management wants visible, credible progress",
  "Data partly incomplete",
  "Departments want simple reports",
  "IT wants operational usability",
];

export const PHASE1_INSTRUCTION =
  "Answer all seven questions for each line. The levels you pick are what draw that line's radar below — nothing is set blind.";

export const PHASE2_INTRO = {
  heading: "Commit and justify",
  body: "Pick one line as first priority, then defend it — even though the data situation stays incomplete.",
} as const;

export const PRIORITY_FIELD = {
  label: "Which line do you prioritise first?",
  instruction: "One pick. The three radars above are your evidence — use them.",
} as const;

export const JUSTIFICATION_FIELD = {
  label: "Justification",
  instruction: "Defend your pick despite incomplete data — reference at least two of the seven criteria.",
  placeholder: "e.g. Scores High on Steering effect and Connectability even though Feasibility is only Medium, because…",
} as const;

export const FOLLOWUP_FIELDS = [
  { id: 0, label: "First follow-up decision", instruction: "What must be decided next because of this choice — the very next call, not a whole roadmap." },
  { id: 1, label: "Second follow-up decision", instruction: "A second decision this choice now forces — e.g. who owns it, or what gets measured first." },
] as const;

export const RISK_FIELDS = [
  { id: 0, label: "Risk 1 — if this looked good but was structurally weak" },
  { id: 1, label: "Risk 2 — if this looked good but was structurally weak" },
] as const;
export const RISK_INSTRUCTION =
  "Name a concrete risk if your pick turns out attractive-but-weak (M7) — a shiny result with no review logic behind it, not a vague \"it might not work.\"";

export const CHECK2_LABELS = {
  check: "Check my reasoning",
  recheck: "Check again",
  holds: "This holds up — the standard objection to this pick is pre-empted.",
  needsCriteria: "Not yet checkable — the justification doesn't reference two of the seven criteria yet.",
  wrongTier1: "Not quite defensible yet — here is a first clue.",
  wrongTier2: "Still open — a sharper clue, since you've checked this before.",
} as const;

// ---------------------------------------------------------------------------
// The clue engine — never names the "right" line, only the standard
// objection to whichever line was picked, and whether it has been pre-empted.
// ---------------------------------------------------------------------------

const CRITERIA_REFERENCE_CLUE: ClueTier = {
  soft: "Name at least two of the seven criteria that this pick wins or loses on — not just that you like it.",
  sharp: "Point at your own radar. Which two axes are actually doing the work in this argument? Name them by their criterion names.",
};

/** Keywords in the justification that count as pre-empting each pick's standard objection. */
const OBJECTION_KEYWORDS: Record<OptionId, string[]> = {
  a: ["review", "cadence", "govern", "owner", "act on", "act-on"],
  b: ["visible", "quick", "early", "boundary", "scope", "baseline"],
  c: ["visible", "dashboard", "communicate", "show", "signal", "management"],
};

const OBJECTION_CLUE: Record<OptionId, ClueTier> = {
  a: {
    soft: "A dashboard is only as strong as the review process behind it (M7). What in your justification names what happens after someone looks at it?",
    sharp: "Re-read M7: a shiny dashboard with no review logic is transparency theatre, not steering. What in your justification names a review cadence or an owner acting on the numbers?",
  },
  b: {
    soft: "Carbon monitoring done properly takes time to build. How do you answer management's demand for something visible soon?",
    sharp: "M6's trade-off is the test here: chasing full Scope 1/2/3 accuracy before anything ships trades away Steering effect and Connectability. What in your justification names an early, visible output — a pragmatic baseline, not a perfect one?",
  },
  c: {
    soft: "A review process is powerful but quiet — it produces no single dramatic artefact. How do you answer management's request for visible, credible progress?",
    sharp: "M7's trap runs both ways: an invisible process can be dismissed as \"nothing happened\", even when it is the strongest structural choice. What in your justification names something management can actually see — e.g. a published review cadence or a first target-vs-actual output?",
  },
};

export function criteriaReferenced(justification: string): CriterionId[] {
  const lower = justification.toLowerCase();
  return CRITERIA.filter((c) => c.keywords.some((k) => lower.includes(k))).map((c) => c.id);
}

export type Check2Result =
  | { holds: true }
  | { holds: false; reason: "criteria" | "objection"; clue: string; tier: "soft" | "sharp" };

/**
 * The check never reveals which line is "right" — it only tests two generic,
 * pick-agnostic requirements: does the justification cite real evidence
 * (≥2 criteria), and has the standard objection to *this* pick been
 * addressed. Both requirements exist for all three picks equally.
 */
export function checkPriority(pick: OptionId, justification: string, checkCountAfter: number): Check2Result {
  const tier: "soft" | "sharp" = checkCountAfter >= 2 ? "sharp" : "soft";
  const referenced = criteriaReferenced(justification);
  if (referenced.length < 2) {
    return { holds: false, reason: "criteria", clue: CRITERIA_REFERENCE_CLUE[tier], tier };
  }
  const lower = justification.toLowerCase();
  const addressed = OBJECTION_KEYWORDS[pick].some((k) => lower.includes(k));
  if (!addressed) {
    return { holds: false, reason: "objection", clue: OBJECTION_CLUE[pick][tier], tier };
  }
  return { holds: true };
}

// ---------------------------------------------------------------------------
// Mentor sample + answer key
// ---------------------------------------------------------------------------

/** A defensible sample profile per option, used by mentor auto-fill. */
export const SAMPLE_SCORES: Record<OptionId, Record<CriterionId, Level>> = {
  a: { leverage: "medium", steeringEffect: "medium", feasibility: "high", informativeValue: "medium", longTerm: "low", risk: "medium", connectability: "medium" },
  b: { leverage: "medium", steeringEffect: "low", feasibility: "low", informativeValue: "high", longTerm: "medium", risk: "high", connectability: "low" },
  c: { leverage: "high", steeringEffect: "high", feasibility: "high", informativeValue: "medium", longTerm: "high", risk: "low", connectability: "high" },
};

export const SAMPLE_PRIORITY: OptionId = "c";
export const SAMPLE_JUSTIFICATION =
  "Line C scores High on Steering effect and Connectability, and Low on Risk, because it plugs a review cadence directly into decisions Clarity is already making — every metric the six areas surface starts steering something as soon as the review exists, without waiting for a perfect KPI set or a full carbon baseline. To answer the \"nothing visible\" objection: the first output is a published target-vs-actual review, in front of management, within one quarter — a concrete, visible signal, not a silent process.";
export const SAMPLE_FOLLOWUPS: string[] = [
  "Name who owns and chairs the recurring review, and on what cadence.",
  "Decide which three existing figures (from Task 1's six areas) the first review cycle runs against.",
];
export const SAMPLE_RISKS: string[] = [
  "Symbolic politics if the review meets but never changes a decision: minutes get produced, nothing gets adjusted, and it reads as governance theatre rather than steering.",
  "Misinvestment if Line B is scaled before Line C's review exists to use it: a full carbon baseline gets built and then sits unreviewed, the exact 'accurate but unmanaged' failure M1 opens on.",
];

export const ANSWER_KEY_L2: AnswerKeyBlock = {
  prompt: "Task 2 — Which line of measures should be prioritised first?",
  items: [
    {
      option: "C — Review & improvement process (recommended default)",
      verdict: "pick",
      why: "Highest Steering effect and Connectability, lowest Risk: it makes existing data start steering immediately, and every later KPI or carbon-monitoring build inherits a working review loop instead of needing to invent one — the textbook-defensible pick when the exercise is genuinely open.",
    },
    {
      option: "A — Green IT KPI & dashboard system",
      verdict: "avoid",
      why: "High Feasibility makes it the most immediately buildable-looking pick, but without a review process behind it (Line C), it risks exactly M7's trap: a dashboard nobody is accountable for acting on.",
    },
    {
      option: "B — IT-specific carbon monitoring",
      verdict: "avoid",
      why: "Genuinely high Informative value, but Low Feasibility and Low Connectability — a full baseline and allocation build is slow and easy to leave ungoverned once built, unless a review process already exists to use it.",
    },
  ],
  teachingNote:
    "This is a genuinely open exercise, not a disguised single-answer one — the material explicitly withholds a model priority. A learner who picks A or B defensibly (naming the 'no review logic' or 'slow and ungoverned' risk up front, per the clue engine) should be graded on the quality of the defence, not marked down for disagreeing with C. Use this key to answer a participant who pushes back: C is the safer, faster-to-value, lower-risk pick; A is the most visible near-term win if management needs something to point at; B is the strongest long-term credibility story if the review process is added quickly alongside it.",
};

/** Material this task draws on, for MaterialRefs chips. */
export const TASK2_MATERIAL_REFS: MaterialSectionId[] = ["pdcaLoop", "tradeoffTriangle", "threeLines"];

/** One export for Task 2 only. Filename: `1-{name}-day16-l2task2` (see `exportFilenameExplicit`). */
export const EXPORT2 = {
  taskSlug: "l2task2",
  docHeading: "Clarity Digital Services — Priority Line Decision",
  buttonLabel: "Export Task 2 as PDF",
} as const;
