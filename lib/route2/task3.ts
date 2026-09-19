/**
 * Task 3 — "Develop a management proposal", ~20 minutes, Level 3, at
 * NovaCircular Technologies. A two-stage builder: Stage 1 connects six
 * building blocks into a decision architecture (never a plain list — the
 * connections are what prove it routes as one framework, D1); Stage 2 is the
 * guided seven-element proposal, assembling as a live document beside it.
 *
 * "Check my proposal" never reveals the model recommendation — it only tests
 * fixed, factual coverage (does element 3 name all four D2 criteria; is the
 * first-measure pick the structurally weak kind the material warns about; do
 * the horizon classifications actually span more than one band) and returns a
 * clue for whichever gap is found (CLAUDE.md §4).
 */

import type { AnswerKeyBlock } from "@/lib/answerKey";
import type { IconKey } from "@/lib/routes";
import type { MaterialSectionId } from "./sections";

// ---------------------------------------------------------------------------
// Stage 1 — the six canvas blocks
// ---------------------------------------------------------------------------

export type BlockId = "aiUse" | "portfolio" | "circular" | "investment" | "governance" | "review";

export type Block = { id: BlockId; label: string; icon: IconKey; note: string; pos: { x: number; y: number } };

export const BLOCKS: Block[] = [
  { id: "aiUse", label: "AI use", icon: "chip", note: "Where AI is applied, and what it costs to run.", pos: { x: 90, y: 40 } },
  { id: "portfolio", label: "Innovation portfolio", icon: "layers", note: "The full set of candidate initiatives, compared, not judged alone.", pos: { x: 270, y: 40 } },
  { id: "circular", label: "Circular economy", icon: "recycleLoop", note: "Take-back, refurbishment, reuse — what stays in the loop.", pos: { x: 40, y: 160 } },
  { id: "investment", label: "Investment logic", icon: "coins", note: "Cost, payback, follow-on burden under uncertainty.", pos: { x: 320, y: 160 } },
  { id: "governance", label: "Governance", icon: "gavel", note: "Who proposes, who signs off, how it's revisited.", pos: { x: 130, y: 250 } },
  { id: "review", label: "Management review", icon: "clipboard", note: "The standing forum a decision is anchored in.", pos: { x: 250, y: 250 } },
];

export const blockById = (id: BlockId): Block => BLOCKS.find((b) => b.id === id)!;

/** Canonical, order-independent key for a connection between two blocks. */
export function connectionKey(a: BlockId, b: BlockId): string {
  return [a, b].sort().join(":");
}

// ---------------------------------------------------------------------------
// Stage 2 — the first-measure selector (never reveals a model answer)
// ---------------------------------------------------------------------------

export type FirstMeasureId = "framework" | "ai" | "circular";

export const FIRST_MEASURE_OPTIONS: { id: FirstMeasureId; label: string }[] = [
  { id: "framework", label: "Build the assessment framework first" },
  { id: "ai", label: "Scale AI first" },
  { id: "circular", label: "Launch the circular programme first" },
];

export const FIRST_MEASURE_CLUE: Record<Exclude<FirstMeasureId, "framework">, string> = {
  ai: "A visible initiative before an assessment logic — how will you tell a good AI use case from an expensive one?",
  circular: "A visible circular programme before criteria exist — which devices enter the loop first, and who decided that?",
};

export const FIRST_MEASURE_FIELD = {
  label: "First-measure selector",
  instruction: "Choose the first move NovaCircular actually makes. This decision is element 5 of the proposal.",
} as const;

// ---------------------------------------------------------------------------
// Stage 2 — the seven proposal elements
// ---------------------------------------------------------------------------

export const ELEMENT_1 = {
  n: 1,
  label: "1. Strategic relevance",
  instruction: "Why sustainable IT innovation, AI, and the circular economy matter for this company specifically — not a generic industry statement.",
  placeholder: "e.g. NovaCircular's growth plan depends on…",
  material: ["architecture"] as MaterialSectionId[],
};

export const GUIDING_DECISION_FIELDS = [
  { id: 0, label: "Guiding decision 1", instruction: "A decision management must take in the next 12 months." },
  { id: 1, label: "Guiding decision 2", instruction: "A second, distinct decision in the same window." },
  { id: 2, label: "Guiding decision 3", instruction: "A third, distinct decision in the same window." },
] as const;
export const GUIDING_DECISIONS_LABEL = "2. Three guiding decisions for the next 12 months";

export const ELEMENT_3 = {
  n: 3,
  label: "3. Decision logic",
  instruction: "By which criteria do future initiatives get assessed and prioritised? Name all four from D2 — benefit, resource/load, strategic viability, controllability.",
  placeholder: "e.g. Every initiative is scored on measured benefit, resource and load effect, whether it can run at scale, and…",
  material: ["assessmentLogic"] as MaterialSectionId[],
};

export const ELEMENT_4 = {
  n: 4,
  label: "4. Central trade-offs",
  instruction: "Between innovation speed, resource requirements, market potential, viability, circularity, and manageability.",
  placeholder: "e.g. Moving fast on AI trades against resource load; visible circularity trades against near-term margin…",
  material: ["assessmentLogic", "horizons"] as MaterialSectionId[],
};

export const ELEMENT_5_WHY = {
  n: 5,
  label: "5. Why this first",
  instruction: "Justify the first-measure pick above — this is element 5 in full: the line of measures plus why.",
  placeholder: "e.g. Framework first because…",
  material: ["architecture", "governance"] as MaterialSectionId[],
};

export const ELEMENT_6 = {
  n: 6,
  label: "6. Roles, responsibilities, approval, review",
  instruction: "Cover all four governance-loop stages from D3 — propose, assess, approve/park, review — not only \"who approves.\"",
  placeholder: "e.g. Any team can propose; the framework owner assesses against the four criteria; the steering committee…",
  material: ["governance"] as MaterialSectionId[],
};

export const ELEMENT_7 = {
  n: 7,
  label: "7. The decision to take now",
  instruction: "Despite incomplete information — name the one decision that cannot wait for full data.",
  placeholder: "e.g. Regardless of which line scales first, NovaCircular decides now to…",
  material: ["governance", "horizons"] as MaterialSectionId[],
};

// ---------------------------------------------------------------------------
// Stage 2 — the horizon classifier (reinforces D4)
// ---------------------------------------------------------------------------

export type Horizon = "short" | "medium" | "structural";
export const HORIZONS: { id: Horizon; label: string }[] = [
  { id: "short", label: "Short-term" },
  { id: "medium", label: "Medium-term" },
  { id: "structural", label: "Structural" },
];

export type CandidateMeasure = { id: string; text: string };

export const CANDIDATE_MEASURES: CandidateMeasure[] = [
  { id: "m1", text: "Define the four assessment criteria and publish them" },
  { id: "m2", text: "Run a pilot of the AI load-optimisation use case under the new criteria" },
  { id: "m3", text: "Launch the first device take-back and refurbishment loop" },
  { id: "m4", text: "Make the assessment framework a standing agenda item in every portfolio review" },
  { id: "m5", text: "Publish a first prioritisation of the three initiatives already in flight" },
  { id: "m6", text: "Give the framework a formal review cadence inside management reviews" },
];

// ---------------------------------------------------------------------------
// Task framing
// ---------------------------------------------------------------------------

export const TASK3_FRAMING = {
  tag: "THE TASK",
  title: "Develop a management proposal",
  minutes: 20,
  lead: "NovaCircular Technologies wants to use AI in a targeted way, strengthen circular principles in IT, and stop future topics from being prioritised by attractiveness alone. An integrated decision logic is missing.",
  instruction:
    "Do not hand management a list of nice ideas — hand them a decision architecture, including the one decision that must be made now despite incomplete information.",
  gradingLens: "Grading lens: a robust decision architecture, not a collection of ideas.",
} as const;

export const CANVAS_INSTRUCTION =
  "Connect the six blocks so every one routes through the framework, not stands alone (D1). Drag from one block to another to connect them, or tap one block then tap a second to link them — tap a connected pair again to remove it.";

export const CHECK3_LABELS = {
  check: "Check my proposal",
  recheck: "Check again",
  holds: "Reads as an architecture, not a list of ideas.",
  wrongTier1: "Not quite there yet — here is a first clue.",
  wrongTier2: "Still open — a sharper clue, since you've checked this before.",
} as const;

// ---------------------------------------------------------------------------
// The clue engine
// ---------------------------------------------------------------------------

export type ClueTier = { soft: string; sharp: string };

const CRITERIA_KEYWORDS: { id: string; label: string; keywords: string[] }[] = [
  { id: "benefit", label: "benefit", keywords: ["benefit"] },
  { id: "resource", label: "resource/load", keywords: ["resource", "load", "compute"] },
  { id: "viability", label: "strategic viability", keywords: ["viab", "strategic", "scale"] },
  { id: "controllability", label: "controllability", keywords: ["controllab", "govern", "steer"] },
];

export function missingCriterion(decisionLogicText: string): string | null {
  const lower = decisionLogicText.toLowerCase();
  const missing = CRITERIA_KEYWORDS.find((c) => !c.keywords.some((k) => lower.includes(k)));
  return missing ? missing.label : null;
}

export type Check3Result =
  | { holds: true }
  | { holds: false; area: "logic" | "firstMeasure" | "horizon"; clue: string; tier: "soft" | "sharp" };

export function checkProposal(args: {
  decisionLogicText: string;
  firstMeasure: FirstMeasureId | null;
  horizons: Record<string, Horizon | null>;
  checkCountAfter: number;
}): Check3Result {
  const tier: "soft" | "sharp" = args.checkCountAfter >= 2 ? "sharp" : "soft";

  const missing = missingCriterion(args.decisionLogicText);
  if (missing) {
    return {
      holds: false,
      area: "logic",
      tier,
      clue:
        tier === "soft"
          ? `Your logic (element 3) doesn't mention ${missing} — re-read the assessment funnel (D2).`
          : `D2 names four criteria for a reason: any initiative that skips one of them is exactly the "assessed on enthusiasm" pattern D1 warns about. Add ${missing} explicitly.`,
    };
  }

  if (args.firstMeasure && args.firstMeasure !== "framework") {
    return { holds: false, area: "firstMeasure", tier, clue: FIRST_MEASURE_CLUE[args.firstMeasure] };
  }

  const classified = Object.values(args.horizons).filter((h): h is Horizon => !!h);
  if (classified.length === CANDIDATE_MEASURES.length) {
    const distinctBands = new Set(classified);
    if (distinctBands.size === 1) {
      const only = classified[0];
      const clue =
        only === "short"
          ? "Every measure is short-term — where is the structural anchor in governance?"
          : only === "medium"
            ? "Every measure sits at the pilot stage — where is the first decision that could ship today, and where is the anchor that makes it last?"
            : "Every measure is structural — where is the first concrete, deliverable action D4 calls short-term?";
      return { holds: false, area: "horizon", tier, clue };
    }
  }

  return { holds: true };
}

// ---------------------------------------------------------------------------
// Mentor sample + answer key
// ---------------------------------------------------------------------------

export const SAMPLE_CONNECTIONS: [BlockId, BlockId][] = [
  ["governance", "portfolio"],
  ["portfolio", "aiUse"],
  ["portfolio", "circular"],
  ["investment", "portfolio"],
  ["review", "governance"],
  ["governance", "investment"],
];

export const SAMPLE_ELEMENT_1 =
  "NovaCircular's growth plan depends on being trusted with sustainability claims by both customers and regulators — AI and circularity are the two levers with the most reach, and the biggest downside if either is oversold.";
export const SAMPLE_GUIDING_DECISIONS = [
  "Approve the four-criteria assessment framework and name its owner.",
  "Decide which of the in-flight AI and circular initiatives get evaluated first under it.",
  "Set the first portfolio review date the framework will report into.",
];
export const SAMPLE_ELEMENT_3 =
  "Every initiative is scored on measured benefit, its resource and load effect, whether it is strategically viable at full scale, and how controllable it is once running — no initiative advances on novelty or enthusiasm alone.";
export const SAMPLE_ELEMENT_4 =
  "Innovation speed trades against resource requirements (faster AI rollout means less time to size its compute load); visible circularity trades against near-term market potential (a slower, better-governed programme is a weaker press release); and viability trades against manageability (the most ambitious option is rarely the one we can steer).";
export const SAMPLE_FIRST_MEASURE: FirstMeasureId = "framework";
export const SAMPLE_ELEMENT_5_WHY =
  "Framework first: every later AI or circular decision becomes cheaper to evaluate once the criteria exist, and it is the one move that is genuinely correct regardless of which individual initiative eventually wins funding.";
export const SAMPLE_ELEMENT_6 =
  "Any team may propose. The framework owner assesses against the four D2 criteria. A steering committee approves or parks each proposal against portfolio capacity. Every approved initiative reports into the quarterly management review, where it is renewed, adjusted, or closed.";
export const SAMPLE_ELEMENT_7 =
  "Regardless of which line scales first, NovaCircular decides now to fund the assessment framework and name its owner — everything else can wait one quarter for real data; this cannot, because every quarter without it is another initiative evaluated on enthusiasm.";

export const SAMPLE_HORIZONS: Record<string, Horizon> = {
  m1: "short",
  m5: "short",
  m2: "medium",
  m3: "medium",
  m4: "structural",
  m6: "structural",
};

export const ANSWER_KEY_L3: AnswerKeyBlock = {
  prompt: "Task 3 — First-measure selector",
  items: [
    {
      option: "Build the assessment framework first (expected)",
      verdict: "pick",
      why: "This is CircularMind's own lesson in the material: every AI or circular decision made before criteria exist has to be re-litigated once they do. Framework first is cheaper in total, not just safer.",
    },
    {
      option: "Scale AI first",
      verdict: "avoid",
      why: "Fast and visible, but repeats CircularMind's AI pilot mistake — no criteria yet to say which use case is worth its compute, which is exactly what let the compute bill outgrow the saving.",
    },
    {
      option: "Launch the circular programme first",
      verdict: "avoid",
      why: "Genuinely strong sustainability story, but without criteria there is no basis for which devices enter the loop first — visible, not yet steerable, the same gap CircularMind's take-back trial had.",
    },
  ],
  teachingNote:
    "Unlike Route 1's Task 2 (deliberately open), this exercise does have a taught, defensible answer — the worked example exists specifically to teach it. A participant who argues for AI or circular first under real urgency (e.g. a board demanding a visible win this quarter) has a legitimate practical point; the answer is that they should say so explicitly as a stated trade-off in element 4, not pretend the sequencing risk doesn't exist.",
};

export const TASK3_MATERIAL_REFS: MaterialSectionId[] = ["architecture", "assessmentLogic", "governance", "horizons"];
