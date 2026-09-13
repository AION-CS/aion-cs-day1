/**
 * Route 2's task — the NexLayer Board Memo, four exercises, ~20 minutes.
 *
 * Rank the guiding decisions · place five measures on a trade-off map by
 * answering two diagnostics each · assign a RACI for the standard · name the
 * decision that cannot wait.
 */

import type { AnswerKeyBlock } from "@/lib/answerKey";
import type { MaterialSectionId } from "./sections";

// ---------------------------------------------------------------------------
// Exercise 1 — rank the guiding decisions
// ---------------------------------------------------------------------------

export type GuidingDecision = {
  id: string;
  n: number;
  label: string;
  detail: string;
};

export const GUIDING_DECISIONS: GuidingDecision[] = [
  {
    id: "g1",
    n: 1,
    label: "Mandate a binding efficiency-monitoring standard",
    detail:
      "Which indicators every product must expose, in which form, reviewed on which cadence.",
  },
  {
    id: "g2",
    n: 2,
    label: "Establish an architecture review gate",
    detail: "For changes above a defined size, with the authority to require rework.",
  },
  {
    id: "g3",
    n: 3,
    label: "Publish binding architectural principles",
    detail: "Resource-friendly development rules that teams must design against.",
  },
  {
    id: "g4",
    n: 4,
    label: "Define scaling policy thresholds and a named owner",
    detail: "For autoscaling and capacity configuration across all products.",
  },
  {
    id: "g5",
    n: 5,
    label: "Fund a consolidation programme for redundant data flows",
    detail: "Aimed at the historically grown flows that duplicate work across services.",
  },
  {
    id: "g6",
    n: 6,
    label: "Tie a share of product-team objectives to efficiency indicators",
    detail: "Not only to feature delivery — a change to what teams are assessed on.",
  },
  {
    id: "g7",
    n: 7,
    label: "Institute a quarterly management review",
    detail: "In which monitoring data feeds architecture and portfolio decisions.",
  },
];

export const decisionById = (id: string) => GUIDING_DECISIONS.find((d) => d.id === id)!;

export const RANK_SLOTS = 3;

export const RANK_EXERCISE = {
  id: "ex-rank",
  n: 1,
  minutes: 6,
  title: "Rank the guiding decisions",
  intro:
    "Seven candidates. Select the three you would put in front of NexLayer's board, in order, then justify your first. Click a candidate to add it, click a ranked item to remove it, and use the arrows to reorder — nothing is auto-sorted for you.",
  material: ["board", "worked"] as MaterialSectionId[],
  justify: {
    label: "Why this one first?",
    instruction:
      "Two or three sentences. Say what it changes about what teams are required to do — not what it improves.",
    placeholder: "e.g. It is the only one of the three that makes information comparable across products, which…",
    sample:
      "Without a binding monitoring standard, every product reports something different and no comparison is possible, so the review in my #2 would have nothing to review and the principles in my #3 would have no evidence behind them. It is also the cheapest of the three in momentum terms: it adds an obligation to expose indicators rather than taking capacity out of a committed roadmap. It changes what teams must produce, which is what makes it a guiding decision rather than a measure.",
  },
  check: {
    label: "Test my ranking",
    /** Never grades the order — asks one diagnostic about the learner's own #1. */
    question:
      "Does your first decision change what teams are required to do, or does it improve one system once?",
    options: [
      { id: "required", text: "It changes what teams are required to do" },
      { id: "once", text: "It improves one system once" },
    ],
    feedbackRequired:
      "Then it is a guiding decision by the definition in section A. Check the same question against your #2 and #3 — a top three where only one entry passes is really a top one.",
    feedbackOnce:
      "Then by section A's definition it is a measure rather than a guiding decision. That may still be the right thing to fund, but it is not what a board is being asked to decide here.",
    clue: "A guiding decision needs someone's approval before a team may act on it. If a single team could execute your #1 in a sprint without asking anyone, it belongs on the measure list, not the decision list.",
  },
  answerKey: {
    prompt: "Exercise 1 — ranking the guiding decisions",
    items: [
      {
        option: "1 — Binding efficiency-monitoring standard (strong top three)",
        verdict: "pick",
        why: "Creates comparable information across products. Nothing else in the list works without it: a review has nothing to review, principles have no evidence, objectives have no measure.",
      },
      {
        option: "7 — Quarterly management review (strong top three)",
        verdict: "pick",
        why: "Creates the loop where the information is acted on. This is the ISO 50001 point: the mechanism is the review, not the metric. Without it, the standard produces a dashboard.",
      },
      {
        option: "3 — Binding architectural principles (strong top three)",
        verdict: "pick",
        why: "Gives teams something binding to design against, and gives any future gate something to test against. It is the difference between a review with a standard and a review with an opinion.",
      },
      {
        option: "2 — Architecture review gate",
        verdict: "avoid",
        why: "Strong, but it fails without 3: a gate with nothing to test against becomes taste, and taste does not survive a disagreement with a product deadline. Defensible in a top three only if 3 is also in it.",
      },
      {
        option: "4 — Scaling policy thresholds and owner",
        verdict: "avoid",
        why: "A measure dressed as a decision. Valuable, narrow, and executable by one team under an existing owner — it does not change what anyone else is required to do.",
      },
      {
        option: "5 — Consolidation programme for redundant data flows",
        verdict: "avoid",
        why: "The clearest measure in the list: a funded programme against a specific estate. It changes the system once and changes no rule that produced it.",
      },
      {
        option: "6 — Efficiency objectives in product-team goals",
        verdict: "avoid",
        why: "Powerful and the most politically expensive item here — it changes what teams are assessed on. Defensible as a #1 only if the learner names who absorbs the delivery cost that follows.",
      },
    ],
    teachingNote:
      "There is no single correct order. Assess a top three on whether all of transparency, bindingness and the review loop are represented — not on whether it matches 1/7/3. A learner who picks 6 first and explains who pays for the lost delivery has produced a stronger answer than one who picks 1 first and cannot say what it obliges anyone to do.",
  } as AnswerKeyBlock,
};

// ---------------------------------------------------------------------------
// Exercise 2 — the trade-off map
// ---------------------------------------------------------------------------

export type QuadrantId = "quick" | "bet" | "noise" | "symbolism";

export type Quadrant = {
  id: QuadrantId;
  label: string;
  /** Position in the 2×2. */
  momentumCost: "low" | "high";
  structuralImpact: "low" | "high";
  note: string;
};

export const QUADRANTS: Quadrant[] = [
  {
    id: "quick",
    label: "Quick wins",
    momentumCost: "low",
    structuralImpact: "high",
    note: "Nothing has to be re-planned, and the effect outlives the sponsor. Fund these first and stop treating them as too small to decide.",
  },
  {
    id: "bet",
    label: "Strategic bets",
    momentumCost: "high",
    structuralImpact: "high",
    note: "Real capacity has to be taken from committed work, and the effect persists. These are the board's actual decisions.",
  },
  {
    id: "noise",
    label: "Low-value noise",
    momentumCost: "low",
    structuralImpact: "low",
    note: "Cheap and forgettable. Not worthless — a real saving with no durability — but never a board decision.",
  },
  {
    id: "symbolism",
    label: "Expensive symbolism",
    momentumCost: "high",
    structuralImpact: "low",
    note: "Costly to deliver and gone once its sponsor moves on. The quadrant to recognise before you are in it.",
  },
];

export const quadrantFor = (momentumHigh: boolean, structuralHigh: boolean): QuadrantId =>
  structuralHigh ? (momentumHigh ? "bet" : "quick") : momentumHigh ? "symbolism" : "noise";

export const quadrantById = (id: QuadrantId) => QUADRANTS.find((q) => q.id === id)!;

export type MapMeasure = {
  id: string;
  label: string;
  detail: string;
  /** Ground truth for the two diagnostics. */
  momentumHigh: boolean;
  structuralHigh: boolean;
  q1Clue: string;
  q2Clue: string;
  /** Whether the learner must justify it as a strategic bet. */
  quadrant: QuadrantId;
  answerKey: AnswerKeyBlock;
};

export const MAP_QUESTIONS = {
  q1: {
    key: "q1",
    label: "Momentum cost",
    question:
      "To do this, do teams have to stop or re-plan work they have already committed to this quarter?",
    yes: "Yes — committed work has to move",
    no: "No — it fits alongside committed work",
    instruction: "Momentum cost is about the roadmap, not about effort in hours.",
  },
  q2: {
    key: "q2",
    label: "Structural impact",
    question:
      "If the sponsor of this measure left tomorrow, would its effect persist without anyone repeating the effort?",
    yes: "Yes — the effect persists on its own",
    no: "No — it decays or has to be redone",
    instruction: "Structural impact is about durability, not about size.",
  },
} as const;

export const MAP_MEASURES: MapMeasure[] = [
  {
    id: "m1",
    label: "M1 — Establish an efficiency indicator baseline",
    detail: "Across all products, so that figures are comparable between them.",
    momentumHigh: false,
    structuralHigh: true,
    quadrant: "quick",
    q1Clue: "Exposing an indicator is additive. Ask whether anything already committed has to come out of the plan to make room for it.",
    q2Clue: "Once every product reports the same figure, what would have to happen for that to stop being true?",
    answerKey: {
      prompt: "M1 — Efficiency indicator baseline",
      items: [
        {
          option: "Momentum cost: No (expected)",
          verdict: "pick",
          why: "Instrumentation is additive. It adds an obligation to expose numbers; it does not require a committed feature to be dropped.",
        },
        {
          option: "Structural impact: Yes (expected)",
          verdict: "pick",
          why: "A baseline that every product reports against outlives whoever asked for it, and every later decision is measured against it.",
        },
        {
          option: "Common wrong reading: high momentum cost",
          verdict: "avoid",
          why: "Confuses effort with momentum. It is real work, but it does not compete with the roadmap for the same slot — which is exactly what makes it the cheapest structural move available.",
        },
      ],
      teachingNote:
        "This is the quadrant participants most often misplace, because 'quick win' sounds trivial and this is the most valuable item on the map. Quick win here means low momentum cost and high durability — the best trade available, not the smallest.",
    },
  },
  {
    id: "m2",
    label: "M2 — Introduce an architecture review gate",
    detail: "For large changes, with the authority to require rework.",
    momentumHigh: true,
    structuralHigh: true,
    quadrant: "bet",
    q1Clue: "A gate can send work back. Ask what happens to a team's quarter the first time it does.",
    q2Clue: "A gate that keeps operating after its sponsor leaves needs something a successor can point at. Does this have that?",
    answerKey: {
      prompt: "M2 — Architecture review gate",
      items: [
        {
          option: "Momentum cost: Yes (expected)",
          verdict: "pick",
          why: "A gate with real authority will send committed work back. That cost lands inside a quarter someone has already planned.",
        },
        {
          option: "Structural impact: Yes (expected)",
          verdict: "pick",
          why: "Once a gate is part of how changes ship, it persists as process rather than as someone's initiative — provided principles exist for it to test against.",
        },
        {
          option: "Common wrong reading: low momentum cost",
          verdict: "avoid",
          why: "Assumes the gate will mostly approve. A gate that never requires rework has no momentum cost and no structural impact either — it is a meeting.",
        },
      ],
    },
  },
  {
    id: "m3",
    label: "M3 — Optimise the three most conspicuous services now",
    detail: "A real, attributable saving inside the quarter.",
    momentumHigh: false,
    structuralHigh: false,
    quadrant: "noise",
    q1Clue: "This is self-contained work on three services. Ask whether anyone outside those teams has to re-plan anything.",
    q2Clue: "Ask what happens to the fourth-most conspicuous service next quarter.",
    answerKey: {
      prompt: "M3 — Optimise three services",
      items: [
        {
          option: "Momentum cost: No (expected)",
          verdict: "pick",
          why: "Self-contained, inside teams that already own those services, with no cross-team dependency. It is the easiest thing on this map to start.",
        },
        {
          option: "Structural impact: No (expected)",
          verdict: "pick",
          why: "Nothing about the conventions that produced the waste changes, so the fourth-most expensive service is already being written the same way.",
        },
        {
          option: "Common wrong reading: high structural impact",
          verdict: "avoid",
          why: "Mistakes the size of the saving for its durability. The saving is real; it simply does not reproduce itself.",
        },
      ],
      teachingNote:
        "M3 is not worthless and must not be taught as a trap. It is a real saving with no durability — precisely the 'short-term visible but structurally weak' option the curriculum warns about. The professional error is choosing it and reporting it as though the problem were solved.",
    },
  },
  {
    id: "m4",
    label: "M4 — Consolidate the redundant customer-data flows",
    detail: "One owner, one canonical path, consumers on change events.",
    momentumHigh: true,
    structuralHigh: true,
    quadrant: "bet",
    q1Clue: "Count the teams whose services touch that record, then ask whose quarter absorbs the migration.",
    q2Clue: "Once there is one owner and one path, what would have to happen for three copies to reappear?",
    answerKey: {
      prompt: "M4 — Data-flow consolidation",
      items: [
        {
          option: "Momentum cost: Yes (expected)",
          verdict: "pick",
          why: "It touches record ownership, three services' contracts and a migration, across teams that each have a committed quarter.",
        },
        {
          option: "Structural impact: Yes (expected)",
          verdict: "pick",
          why: "A canonical path with one owner is a shape the estate keeps. Re-duplicating it would require someone to deliberately undo the ownership decision.",
        },
        {
          option: "Common wrong reading: low structural impact",
          verdict: "avoid",
          why: "Reads it as 'just a refactor'. It is a refactor that changes who owns a record, which is an architecture decision with a durable effect.",
        },
      ],
    },
  },
  {
    id: "m5",
    label: "M5 — Add efficiency objectives to product-team goals",
    detail: "A defined share of team objectives tied to efficiency indicators.",
    momentumHigh: true,
    structuralHigh: true,
    quadrant: "bet",
    q1Clue: "Objectives are zero-sum inside a quarter. Ask what comes out of the plan to make room for the new one.",
    q2Clue: "Ask what a new team lead inherits: a preference, or an objective they are assessed on.",
    answerKey: {
      prompt: "M5 — Efficiency objectives in team goals",
      items: [
        {
          option: "Momentum cost: Yes (expected)",
          verdict: "pick",
          why: "Objectives compete for the same quarter. Adding one without removing anything is how an objective becomes decorative.",
        },
        {
          option: "Structural impact: Yes (expected)",
          verdict: "pick",
          why: "What a team is assessed on outlives the person who introduced it, and it changes every prioritisation conversation rather than one of them.",
        },
        {
          option: "Common wrong reading: low momentum cost",
          verdict: "avoid",
          why: "Assumes an objective can be added for free. If nothing is taken out, the objective is either ignored or delivered at the cost of something nobody agreed to drop.",
        },
      ],
      teachingNote:
        "Three measures land in Strategic bets on purpose. The required one-line justification per bet is what stops the exercise collapsing into sorting — a board cannot fund three bets in one year, and saying which one and why is the actual level-3 skill.",
    },
  },
];

export const mapMeasureById = (id: string) => MAP_MEASURES.find((m) => m.id === id)!;

export const MAP_EXERCISE = {
  id: "ex-map",
  n: 2,
  minutes: 6,
  title: "The trade-off map",
  intro:
    "Five measures, two diagnostic questions each. Answer both and the measure moves to its quadrant — you never drag it there directly, because the position is a consequence of the two answers, not a judgement of its own.",
  material: ["board", "uncertainty"] as MaterialSectionId[],
  wrongText: "That answer does not hold up for this measure. Read it again, then change the answer.",
  clueLabel: "Need a clue?",
  betField: {
    label: "If you can fund only one strategic bet this year, why this one — or why not this one?",
    instruction: "One line. Compare it against the other bets on the map, not against doing nothing.",
    placeholder: "e.g. Fund this one first because it is the only bet that makes the other two cheaper…",
  },
  betSamples: {
    m2: "Not this one first: a gate without published principles becomes a matter of taste, so M2 should follow the principles rather than lead them.",
    m4: "Not this one first: it is the largest single saving on the map and it consumes the cross-team capacity that any other bet would also need.",
    m5: "Fund this one: it is the only bet that changes what teams are assessed on, which is what makes the other two survivable when a deadline is at risk.",
  } as Record<string, string>,
};

// ---------------------------------------------------------------------------
// Exercise 3 — the RACI
// ---------------------------------------------------------------------------

export const RACI_ROWS = [
  { id: "r1", label: "Approving the binding efficiency-monitoring standard" },
  { id: "r2", label: "Defining and maintaining the architectural principles" },
  { id: "r3", label: "Enforcing the architecture review gate on individual changes" },
  { id: "r4", label: "Allocating team capacity for structural improvement work" },
];

export const TASK_RACI_ROLES = [
  { id: "cto", name: "CTO / Management", short: "CTO", canBindCapacity: true },
  { id: "arch", name: "Architecture Board", short: "Arch", canBindCapacity: false },
  { id: "product", name: "Product Management", short: "Product", canBindCapacity: true },
  { id: "eng", name: "Engineering Teams", short: "Eng", canBindCapacity: false },
  { id: "ops", name: "Operations", short: "Ops", canBindCapacity: false },
];

/** Rows where the A must be able to bind capacity for the assignment to hold. */
export const CAPACITY_ROWS = ["r4"];

export const RACI_EXERCISE = {
  id: "ex-raci",
  n: 3,
  minutes: 5,
  title: "Ownership of the efficiency and architecture standard",
  intro:
    "Click a cell to cycle it through R, A, C, I and back to blank. The grid checks structure only — exactly one Accountable per row, at least one Responsible — and asks a question when an Accountable cannot bind capacity. It never tells you who should hold which letter.",
  material: ["raci"] as MaterialSectionId[],
  violations: {
    manyA: "More than one Accountable in this row. Two Accountables have no escalation path between them.",
    noA: "No Accountable in this row. A decision with no owner is one nobody will report as unmade.",
    noR: "No Responsible in this row. Someone has to do the work.",
    authority:
      "Can this role change a team's roadmap? If not, who approves this in practice?",
  },
  answerKey: {
    prompt: "Exercise 3 — RACI for the standard",
    items: [
      {
        option: "Row 1 — Approving the monitoring standard: A = CTO / Management",
        verdict: "pick",
        why: "Approval of something binding across products belongs to the role that can require every product to comply. Architecture Board is R here, Product and Ops are C, Engineering is I.",
      },
      {
        option: "Row 2 — Defining the architecture principles: A = Architecture Board",
        verdict: "pick",
        why: "Sound, with CTO as C. The principles are a technical artefact and the board owns their content; keep R separate from A where possible so the author is not the sole approver.",
      },
      {
        option: "Row 3 — Enforcing the gate on individual changes: A = Architecture Board",
        verdict: "pick",
        why: "Enforcement on a single change is a technical judgement the board can make, provided row 1 and row 2 gave it something binding to enforce. Engineering is R, Product is C.",
      },
      {
        option: "Row 4 — Allocating capacity: A = Architecture Board",
        verdict: "avoid",
        why: "The classic failure. Capacity allocation is a budget decision; an architecture board that cannot move a roadmap holds accountability without authority, which produces an agreed standard nobody has time to implement.",
      },
      {
        option: "Row 4 — Allocating capacity: A = CTO / Management (with Product as C)",
        verdict: "pick",
        why: "The only assignment that survives contact with a delivery quarter. Product Management is genuinely Consulted here and in some organisations is jointly Accountable with the CTO — but never Accountable alone, or efficiency work loses every prioritisation round.",
      },
    ],
    teachingNote:
      "More than one grid defends. What does not defend is an A that cannot bind capacity for its row, an A held by a committee, or a row with no R. If a participant gives Product Management the A on row 1, ask what happens when a product's delivery date and the standard conflict.",
  } as AnswerKeyBlock,
};

// ---------------------------------------------------------------------------
// Exercise 4 — the decision that cannot wait
// ---------------------------------------------------------------------------

export const DECIDE_NOW_FIELDS = [
  {
    key: "decision",
    label: "The decision to take now",
    instruction: "One decision, stated so that someone could act on it on Monday. Name what becomes binding.",
    placeholder: "e.g. From 1 October every product exposes the four agreed efficiency indicators; the CTO approves the list…",
    sample:
      "From the start of next quarter, every NexLayer product exposes the four agreed efficiency indicators in the shared format, and the CTO signs the standard that makes it binding rather than recommended.",
  },
  {
    key: "assumption",
    label: "The assumption it rests on",
    instruction: "What must be true for this to be the right call?",
    placeholder: "e.g. That the teams can expose these indicators without re-planning committed work…",
    sample:
      "That exposing the indicators is additive work teams can absorb without dropping committed features — roughly two to three days per product, not a sprint.",
  },
  {
    key: "signal",
    label: "The signal that would prove it wrong",
    instruction: "What would you watch, and by when, to know the assumption failed?",
    placeholder: "e.g. If fewer than two products have reported by the end of month two…",
    sample:
      "If fewer than three of the five products are reporting all four indicators by the end of month two, the assumption that this is absorbable was wrong, and the decision needs funded capacity rather than an obligation.",
  },
  {
    key: "cost",
    label: "The cost of waiting one more quarter",
    instruction:
      "Be specific: what is consumed, what is decided by default, what gets harder.",
    placeholder: "e.g. Three more months of infrastructure spend nobody can attribute, plus…",
    sample:
      "Three more months of infrastructure growth nobody can attribute to a workload; every service shipped in that quarter is built under unchanged conventions, so the eventual consolidation is larger; and the architecture review we would fund next quarter would still be selecting its targets by anecdote.",
  },
] as const;

export const DECIDE_NOW_EXERCISE = {
  id: "ex-decide",
  n: 4,
  minutes: 3,
  title: "The decision that cannot wait",
  intro:
    "One decision, stated as a decision. The three fields after it are what make it defensible in front of people who will challenge it.",
  material: ["uncertainty"] as MaterialSectionId[],
  answerKey: {
    prompt: "Exercise 4 — the decision that cannot wait",
    items: [
      {
        option: "The decision — binding, not aspirational",
        verdict: "pick",
        why: "Strong: \"From 1 October every product exposes the four agreed indicators; the CTO signs the standard.\" Weak: \"We should improve our monitoring.\" The test is whether someone could act on it on Monday without a further meeting.",
      },
      {
        option: "The assumption — falsifiable",
        verdict: "pick",
        why: "Strong: \"Teams can expose these indicators in two to three days without dropping committed work.\" Weak: \"Teams will support this.\" The test is whether you could be shown to be wrong.",
      },
      {
        option: "The falsifier — observable, with a date",
        verdict: "pick",
        why: "Strong: \"Fewer than three of five products reporting by end of month two.\" Weak: \"If it does not seem to be working.\" The test is whether two people would agree on the reading.",
      },
      {
        option: "The cost of waiting — concrete",
        verdict: "pick",
        why: "Strong: \"Three months of unattributable infrastructure growth, plus every service shipped in that quarter built under unchanged conventions.\" Weak: \"We lose time.\" The test is whether a CFO could recognise the quantity.",
      },
    ],
    teachingNote:
      "Assess the four fields as a set rather than individually. A binding decision with an unfalsifiable assumption is a preference with a date on it; a good falsifier attached to an aspiration is a measurement of nothing. The set is what makes the memo survive a challenge.",
  } as AnswerKeyBlock,
};
