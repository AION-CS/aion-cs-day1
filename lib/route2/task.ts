/**
 * The task — one task, two parts, ~20 minutes combined (Part 1 ≈10 min,
 * Part 2 ≈10 min). Part 1: score three measure-lines against the four S1
 * criteria and choose one. Part 2: turn that choice into a short proposal
 * using the S2 ownership and reversibility logic. Neither part gates the
 * other (CLAUDE.md §6) — Part 2 reads Part 1's chosen priority as context,
 * but stays reachable before Part 1 is finished.
 */

import type { AnswerKeyBlock } from "@/lib/answerKey";

// ---------------------------------------------------------------------------
// Part 1 — the three measure-lines and the four criteria
// ---------------------------------------------------------------------------

export type MeasureLineId = "a" | "b" | "c";

export type MeasureLine = { id: MeasureLineId; letter: string; name: string; description: string };

export const MEASURE_LINES: MeasureLine[] = [
  {
    id: "a",
    letter: "A",
    name: "Economic Viability & ROI Framework",
    description: "Build a robust framework for calculating and proving ROI on Green IT measures.",
  },
  {
    id: "b",
    letter: "B",
    name: "Behaviour-Oriented Programme",
    description: "Launch rules, communication, and leadership support to drive real adoption of existing measures.",
  },
  {
    id: "c",
    letter: "C",
    name: "Compliance & Evidence Framework",
    description: "Build the documentation and reporting infrastructure for regulatory transparency requirements.",
  },
];

export const measureLineById = (id: MeasureLineId): MeasureLine => MEASURE_LINES.find((m) => m.id === id)!;

export type CriterionId = "feasibility" | "economic" | "behavioural" | "regulatory";

export type CriterionClueSet = Record<MeasureLineId, string>;

export type Criterion = {
  id: CriterionId;
  label: string;
  definition: string;
  /** Forces a real A/B/C comparison — never a restatement of the definition. */
  scenarioPrompt: string;
  /** Keyed by whichever measure-line the participant ranked 1st on this criterion. */
  clueByTopPick: CriterionClueSet;
};

export const CRITERIA: Criterion[] = [
  {
    id: "feasibility",
    label: "Feasibility",
    definition: "Can this realistically be started now with the budget, skills, and data the organisation already has?",
    scenarioPrompt: "Given a limited budget and only partial data, which of the three can realistically start now with what the organisation already has?",
    clueByTopPick: {
      a: "Ranking the ROI framework top on feasibility? Building it well usually needs the cleanest data of the three — check whether that data actually exists yet, not just whether the budget line does.",
      b: "Ranking the behaviour-oriented programme top on feasibility? It needs less capital but more sustained management attention — check whether that attention is actually available, not just the budget line.",
      c: "Ranking the compliance framework top on feasibility? Documentation infrastructure sounds procedural, but it often needs input from Legal and Purchasing that isn't in your own team's control — check who else has to move first.",
    },
  },
  {
    id: "economic",
    label: "Economic effect",
    definition: "What is the direct, quantifiable cost-vs-saving case?",
    scenarioPrompt: "If the board asks for a defensible cost-versus-saving number within this quarter, which of the three actually has one ready to build?",
    clueByTopPick: {
      a: "The ROI framework's own economic case is partly circular — it proves other measures' savings, but its own payback depends on those other measures actually launching. Check whether you're crediting it with savings it can only unlock, not produce.",
      b: "The behaviour-oriented programme's economic effect is real but indirect — it multiplies the savings of measures already in place. Check whether you're counting a multiplier as if it were a standalone saving.",
      c: "Compliance and evidence infrastructure has real economic value, mostly in avoided cost — fines, audit rework. Check whether your economic case argues that avoided cost explicitly, rather than just implying the framework is \"important\".",
    },
  },
  {
    id: "behavioural",
    label: "Behavioural effectiveness",
    definition: "How much real, sustained behaviour change will this actually produce — not its theoretical ceiling?",
    scenarioPrompt: "Assume all three eventually get funded — which one, funded alone and first, changes what people actually do day to day the most, not just what they're told to do?",
    clueByTopPick: {
      a: "An ROI framework changes how proposals get written, not how people use devices or print. Check whether you're crediting it with behaviour change it can only justify indirectly, not cause.",
      b: "The behaviour-oriented programme is the obvious top pick here — the real question is adoption, not intention. Check whether your score reflects likely sustained adoption, or the programme's theoretical ceiling if everyone complied perfectly.",
      c: "Compliance infrastructure can indirectly shape behaviour — people follow what gets audited — but that's a second-order effect. Check whether you're crediting it with behaviour change that actually depends on a separate enforcement effort.",
    },
  },
  {
    id: "regulatory",
    label: "Regulatory relevance",
    definition: "How directly does this close an actual, named compliance or evidence gap?",
    scenarioPrompt: "An external audit request lands next month — which of the three most directly closes a gap an auditor would actually flag?",
    clueByTopPick: {
      a: "An ROI framework doesn't close a compliance gap by itself — it makes future spending decisions defensible. Check whether you're crediting it with a regulatory relevance that actually belongs to a specific named requirement.",
      b: "A behaviour programme changes what people do, but check whether it produces the documented evidence an auditor would actually ask for — doing the right thing and being able to prove it are different things.",
      c: "The compliance framework is the obvious top pick here. Check whether you're crediting it for closing a specific, named requirement (CSRD, WEEE, EnEfG) — or just for \"being about compliance\" in general, which scores lower than a named gap actually closed.",
    },
  },
];

export const criterionById = (id: CriterionId): Criterion => CRITERIA.find((c) => c.id === id)!;

export const RANK_SCORE: Record<"1" | "2" | "3", number> = { "1": 3, "2": 2, "3": 1 };

export const PART_ONE = {
  n: 1,
  tag: "PART 1 — PRIORITISE",
  title: "Score three measure-lines, choose one",
  minutes: 10,
  intro: "Rank A, B and C on each of the four criteria below. Once all four are ranked, your radar and total score build automatically — then commit to one priority.",
  material: ["criteria"] as const,
  slotLabels: { "1": "1st", "2": "2nd", "3": "3rd" } as Record<"1" | "2" | "3", string>,
  checkLabel: "Check my thinking",
  recheckLabel: "Check again",
  incomplete: "Rank all three measure-lines on this criterion before checking.",
  commitHeading: "Your chosen priority",
  commitInstruction: "This doesn't have to be your top-scoring line overall — but say why if it isn't.",
  justifyField: {
    label: "Why this one?",
    instruction: "Name one criterion where your choice wasn't the top scorer, and explain why you're prioritising it anyway.",
    placeholder: "e.g. B wasn't the top scorer on Economic effect, but the behaviour gap is what's actually blocking every other measure right now…",
  },
};

export const PART_ONE_ANSWER_KEY: AnswerKeyBlock = {
  prompt: "Part 1 — what a defensible priority choice looks like",
  items: [
    {
      option: "A — Economic Viability & ROI Framework",
      verdict: "pick",
      why: "Strong pick if the organisation's actual blocker (per Route 1's diagnosis) is a data gap — Finance repeatedly asking for numbers nobody can produce.",
    },
    {
      option: "B — Behaviour-Oriented Programme",
      verdict: "pick",
      why: "Strong pick if the actual blocker is inconsistent enforcement or unexplained rules — a technically sound measure with no adoption behind it.",
    },
    {
      option: "C — Compliance & Evidence Framework",
      verdict: "pick",
      why: "Strong pick if the actual blocker is audit-readiness — documentation that would not survive an external evidence request.",
    },
  ],
  teachingNote: "There is no single correct choice. The assessment criterion is whether the justification names a specific criterion it didn't win on and argues the trade-off explicitly, rather than picking the line with the highest total score and calling that the answer — the whole point of Part 1 is that no line wins on all four.",
};

// ---------------------------------------------------------------------------
// Part 2 — ownership and the reversibility test
// ---------------------------------------------------------------------------

export type OwnershipNodeId = "it" | "finance" | "compliance" | "hr" | "purchasing" | "management";

export type OwnershipNode = { id: OwnershipNodeId; label: string; stake: string };

export const OWNERSHIP_NODES: OwnershipNode[] = [
  { id: "it", label: "IT", stake: "Owns the technical build and day-to-day operation of whatever gets funded." },
  { id: "finance", label: "Finance", stake: "Wants a defensible cost/benefit number before signing off." },
  { id: "compliance", label: "Compliance", stake: "Needs the evidence trail to actually satisfy an external requirement, not just look thorough." },
  { id: "hr", label: "HR", stake: "Owns how a new rule or programme actually reaches and is enforced with employees." },
  { id: "purchasing", label: "Purchasing", stake: "Controls which vendors and contracts a measure can actually run through." },
  { id: "management", label: "Management", stake: "Sets the priority, the timeline, and who is accountable if it stalls." },
];

export const ownershipNodeById = (id: OwnershipNodeId): OwnershipNode => OWNERSHIP_NODES.find((n) => n.id === id)!;

export type OwnershipRole = "owns" | "consulted";

/** Click-to-cycle order used by the Ownership Map in select mode: unselected → owns → consulted → unselected. */
export function nextOwnershipRole(current: OwnershipRole | null): OwnershipRole | null {
  if (current === null) return "owns";
  if (current === "owns") return "consulted";
  return null;
}

export type ReversibilityAnswer = "yes" | "no";

export type ReversibilityOutcomeId = "decideNow" | "pilot" | "moreEvidence" | "decideNowDespite";

export type ReversibilityOutcome = { id: ReversibilityOutcomeId; label: string; detail: string };

export const REVERSIBILITY_OUTCOMES: ReversibilityOutcome[] = [
  { id: "decideNow", label: "Decide now", detail: "Cheap to undo, and more data wouldn't change the direction anyway." },
  { id: "pilot", label: "Small pilot, then decide", detail: "Cheap to undo, but more data would matter — get it cheaply first." },
  { id: "moreEvidence", label: "Get more evidence first", detail: "Expensive to undo, and more data would change the direction." },
  { id: "decideNowDespite", label: "Decide now despite the size of the commitment", detail: "Expensive to undo, but more data wouldn't change the direction — waiting only delays." },
];

export function reversibilityOutcome(
  reversible: ReversibilityAnswer | null,
  moreData: ReversibilityAnswer | null,
): ReversibilityOutcome | null {
  if (!reversible || !moreData) return null;
  if (reversible === "yes" && moreData === "no") return REVERSIBILITY_OUTCOMES[0];
  if (reversible === "yes" && moreData === "yes") return REVERSIBILITY_OUTCOMES[1];
  if (reversible === "no" && moreData === "yes") return REVERSIBILITY_OUTCOMES[2];
  return REVERSIBILITY_OUTCOMES[3];
}

export const PART_TWO = {
  n: 2,
  tag: "PART 2 — PROPOSE",
  title: "Turn your priority into a proposal",
  minutes: 10,
  intro: "As IT-governance lead of Valora Digital Operations, turn your Part 1 priority into a short proposal management can act on.",
  material: ["ownership"] as const,
  relevance: {
    label: "Why this is relevant now",
    instruction: "Tie this to the general conditions: limited budget, incomplete data, and rising external requirements.",
    placeholder: "e.g. Finance has already flagged this gap twice this quarter, and the next audit window is in eight weeks…",
  },
  firstMove: {
    label: "First move",
    instruction: "Name the single concrete first step to start this, not a list of eventual outcomes.",
    placeholder: "e.g. Finance and the initiative owner co-build one ROI template this month, before any new proposal is accepted.",
  },
  ownership: {
    label: "Ownership",
    instruction: "Click a node to cycle it: unselected → Owns → Consulted → unselected. At least one function must own this.",
  },
  decideNow: {
    label: "One decision to make now despite incomplete data",
    instruction: "Use the reversibility test: name one decision, then state whether it's reversible and whether more data would change it.",
    nameLabel: "The decision",
    namePlaceholder: "e.g. Commit to the ROI template format now, even though we don't have a full year of savings data yet.",
    reversibleLabel: "Reversible / cheap to undo?",
    moreDataLabel: "Would more data change the direction?",
  },
};

export const PART_TWO_ANSWER_KEY: AnswerKeyBlock = {
  prompt: "Part 2 — what makes a proposal actionable rather than a wish list",
  items: [
    {
      option: "Ownership with no function marked \"Owns\"",
      verdict: "avoid",
      why: "A proposal that only lists people to consult has no one accountable for the outcome — it reads as a wish list, not a decision-ready proposal.",
    },
    {
      option: "Ownership with exactly one function marked \"Owns\", others \"Consulted\" as relevant",
      verdict: "pick",
      why: "One accountable owner plus named consultees is the actionable shape — diffuse accountability across several \"Owns\" is a common failure mode this route deliberately does not reward.",
    },
    {
      option: "\"Decide now\" chosen when the decision is expensive to reverse and more data would change it",
      verdict: "avoid",
      why: "This is exactly the \"get more evidence first\" case — deciding now here is a decision avoided in disguise, not a decision made carefully.",
    },
    {
      option: "\"Get more evidence first\" or \"Decide now\" matched correctly to the reversibility and data answers",
      verdict: "pick",
      why: "The reversibility test has a mechanical right answer once the two questions are answered honestly — the skill is answering them honestly, not picking a flattering outcome.",
    },
  ],
  teachingNote: "The first move and relevance fields are argument-graded like Route 1's improvement approach — there's no single right sentence, only a generic one versus a specific one. The ownership and reversibility fields, by contrast, do have a mechanically correct shape once the inputs are honest, which is why they're the two to check most carefully in a review.",
};

// ---------------------------------------------------------------------------
// Framing — rendered once, above both parts
// ---------------------------------------------------------------------------

export const TASK_FRAMING = {
  tag: "THE TASK",
  minutes: 20,
  lead: "A company can only prioritise one line of measures first. Budget is limited and the data to prove exact impact is incomplete.",
  instruction: "Part 1: score three measure-lines against four criteria and choose one. Part 2: turn your choice into a short proposal.",
} as const;
