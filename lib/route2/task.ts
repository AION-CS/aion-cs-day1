/**
 * Route 2's task — the Synervia Board Memo, five exercises, ~90 minutes.
 *
 * Prioritise a line of measures and defend it under incomplete information ·
 * rank the guiding decisions · place five digitalisation initiatives on a
 * trade-off map by answering two diagnostics each · assign a RACI for the
 * assessment standard · name the decision that cannot wait. One exercise
 * more than Day 11's Route 2, because this module's curriculum genuinely
 * supplies two distinct source tasks — none gates another.
 */

import type { AnswerKeyBlock } from "@/lib/answerKey";
import type { MaterialSectionId } from "./sections";
import type { RatingLevel } from "./material";

// ---------------------------------------------------------------------------
// Exercise 1 — prioritise & defend
// ---------------------------------------------------------------------------

export type LaneId = "accelerate" | "assess" | "consolidate";

export type AssessmentDimension = {
  key: string;
  label: string;
  question: string;
};

export const ASSESSMENT_DIMENSIONS: AssessmentDimension[] = [
  { key: "strategicLeverage", label: "Strategic leverage", question: "Does this change what happens next time a digitalisation initiative is proposed, or only this one?" },
  { key: "sustainabilityImpact", label: "Sustainability impact", question: "What is the actual environmental effect, direct and indirect?" },
  { key: "innovationEffect", label: "Innovation effect", question: "Does it preserve or constrain Synervia's ability to keep building new digital capability?" },
  { key: "feasibility", label: "Feasibility", question: "Can this actually be delivered under the current budget and organisational capacity?" },
  { key: "controllability", label: "Controllability", question: "Does it increase or decrease what management can see and steer afterwards?" },
  { key: "risk", label: "Risk", question: "What is the risk of this being oversold, under-delivered, or reversed?" },
  { key: "longTermEffect", label: "Long-term effect", question: "Does the effect persist after the person who championed it moves on?" },
];

export const RATING_LEVELS: { id: RatingLevel; label: string }[] = [
  { id: "low", label: "Low" },
  { id: "mid", label: "Mid" },
  { id: "high", label: "High" },
];

export const PRIORITISE_EXERCISE = {
  id: "ex-prioritise",
  n: 1,
  minutes: 25,
  title: "Prioritise & defend",
  intro:
    "Choose one line of measures for Synervia to fund this year — Accelerate, Assess & Govern, or Consolidate. Work through the seven-criteria assessment for your choice, then defend it, including against an incomplete information situation.",
  material: ["prioritise"] as MaterialSectionId[],
  laneHeading: "Choose one line of measures",
  gridHeading: "Assessment grid",
  gridInstruction:
    "Rate each criterion Low / Mid / High — click to cycle — and write the one-line argument that justifies the rating. The rating alone is not the answer; the argument is what a mentor grades.",
  justify: {
    label: "Defend this choice",
    instruction:
      "Two or three sentences, written so it survives an incomplete information situation — state what you don't yet know and why you're proceeding anyway.",
    placeholder:
      "e.g. Even without a full baseline of current data volumes, Assess & Govern is the only lane that makes every later Accelerate or Consolidate decision defensible, which is worth more than waiting for a number we don't strictly need to start…",
  },
  followUp: {
    label: "The most important follow-up decisions this choice creates",
    instruction: "One or two sentences — what has to be decided next, as a direct consequence of this choice.",
    placeholder: "e.g. Who owns writing the first version of the assessment criteria, and by which board meeting…",
  },
  risks: {
    label: "Two risks if a line of measures is chosen that is attractive short-term but structurally weak",
    instruction: "One line each — name the specific way it would fail, not a generic caution.",
    placeholders: [
      "e.g. Consolidation ships a visible saving while the assessment gap reopens within a year, once the next wave of initiatives starts…",
      "e.g. Acceleration gets reported as a sustainability win before anyone has checked its net environmental effect…",
    ],
  },
} as const;

export const PRIORITISE_ANSWER_KEY: AnswerKeyBlock = {
  prompt: "Exercise 1 — prioritise & defend",
  items: [
    {
      option: "Assess & Govern (strongest default)",
      verdict: "pick",
      why: "Scores High on strategic leverage and controllability precisely because it is the only lane that makes the other two accountable rather than a substitute for either. The strongest written defence names what governance capacity is assumed to already exist or be funded alongside it.",
    },
    {
      option: "Consolidate (defensible with the right follow-up)",
      verdict: "pick",
      why: "A real, attributable saving. Defensible as a #1 only if the justification explicitly names what stops the duplication reappearing — otherwise it is the 'attractive short-term, structurally weak' trap the material warns about, in its purest form.",
    },
    {
      option: "Accelerate (weakest default, but not indefensible)",
      verdict: "avoid",
      why: "Highest feasibility and fastest visible progress, and the highest risk of being oversold as an automatic sustainability win. Defensible only if the justification names a specific, funded assessment step that accompanies the rollout rather than following it eventually.",
    },
    {
      option: "A grid with uniformly High ratings on every criterion",
      verdict: "avoid",
      why: "No real lane scores High on everything — feasibility and strategic leverage trade against each other by construction. A grid with no Low or Mid ratings anywhere has not actually engaged with the trade-off.",
    },
  ],
  teachingNote:
    "There is no single correct lane. Assess the written argument, not the chosen lane: does it name the specific mechanism that keeps the choice's leverage real rather than absorbed elsewhere (the same rebound logic from Route 1, now at management scale), and does the justification actually engage with what is not yet known rather than asserting confidence it hasn't earned? A defended Consolidate beats an undefended Assess & Govern.",
};

// ---------------------------------------------------------------------------
// Exercise 2 — rank the guiding decisions
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
    label: "Mandate a binding digital-sustainability assessment framework",
    detail: "Which criteria every new initiative must pass, reviewed by whom, before it can be funded.",
  },
  {
    id: "g2",
    n: 2,
    label: "Establish an environmental review gate for new digital projects",
    detail: "For any initiative above a defined scope, with the authority to require changes or refuse funding.",
  },
  {
    id: "g3",
    n: 3,
    label: "Set a data-growth ceiling per department",
    detail: "A cap on stored data volume growth, forcing an explicit trade-off conversation once exceeded.",
  },
  {
    id: "g4",
    n: 4,
    label: "Publish binding principles for responsible digital process design",
    detail: "Rules every new system must design against — deduplication, retention limits, shared infrastructure.",
  },
  {
    id: "g5",
    n: 5,
    label: "Fund a consolidation programme for redundant dashboards and platforms",
    detail: "Aimed at the departments that have each built their own tools against the same data.",
  },
  {
    id: "g6",
    n: 6,
    label: "Tie a share of department objectives to passing the assessment framework",
    detail: "Not only to visible modernisation delivered — a change to what departments are measured on.",
  },
  {
    id: "g7",
    n: 7,
    label: "Institute a quarterly digital-sustainability review with the management board",
    detail: "Where assessment findings and data-growth trends feed funding and governance decisions.",
  },
];

export const decisionById = (id: string) => GUIDING_DECISIONS.find((d) => d.id === id)!;

export const RANK_SLOTS = 3;

export const RANK_EXERCISE = {
  id: "ex-rank",
  n: 2,
  minutes: 15,
  title: "Rank the guiding decisions",
  intro:
    "Seven candidates. Select the three you would put in front of Synervia's board, in order, then justify your first. Click a candidate to add it, click a ranked item to remove it, and use the arrows to reorder — nothing is auto-sorted for you.",
  material: ["uncertainty"] as MaterialSectionId[],
  justify: {
    label: "Why this one first?",
    instruction: "Two or three sentences. Say what it changes about what departments are required to do — not what it improves.",
    placeholder: "e.g. Without a binding assessment framework, every department reports something different and no comparison is possible, so the review in my #2 would have nothing to review…",
    sample:
      "Without a binding assessment framework, every department's digitalisation initiative is judged by a different, informal standard, so the review gate in my #2 would have nothing consistent to enforce and the quarterly review in my #3 would have no comparable data to review. It is also the cheapest of the three in momentum terms: it adds an obligation to submit initiatives for assessment rather than taking capacity out of a committed transformation roadmap. It changes what departments must do before they launch, which is what makes it a guiding decision rather than a measure.",
  },
  check: {
    label: "Test my ranking",
    question: "Does your first decision change what departments are required to do, or does it improve one system once?",
    options: [
      { id: "required", text: "It changes what departments are required to do" },
      { id: "once", text: "It improves one system once" },
    ],
    feedbackRequired:
      "Then it is a guiding decision by the definition in section A. Check the same question against your #2 and #3 — a top three where only one entry passes is really a top one.",
    feedbackOnce:
      "Then by section A's definition it is a measure rather than a guiding decision. That may still be the right thing to fund, but it is not what a board is being asked to decide here.",
    clue: "A guiding decision needs someone's approval before a department may act on it. If a single department could execute your #1 in a quarter without asking anyone, it belongs on the measure list, not the decision list.",
  },
  answerKey: {
    prompt: "Exercise 2 — ranking the guiding decisions",
    items: [
      {
        option: "1 — Binding assessment framework (strong top three)",
        verdict: "pick",
        why: "Creates comparable criteria across departments. Nothing else in the list works without it: a review gate has nothing consistent to enforce, principles have no test, objectives have no measure to tie to.",
      },
      {
        option: "7 — Quarterly digital-sustainability review (strong top three)",
        verdict: "pick",
        why: "Creates the loop where the information is acted on. This is the ISO 50001 point: the mechanism is the review, not the criteria document. Without it, the framework produces a checklist.",
      },
      {
        option: "4 — Binding principles for responsible design (strong top three)",
        verdict: "pick",
        why: "Gives departments something binding to design against, and gives any future gate something to test against. It is the difference between a review with a standard and a review with an opinion.",
      },
      {
        option: "2 — Environmental review gate",
        verdict: "avoid",
        why: "Strong, but it fails without 4 and 1: a gate with nothing to test against becomes taste, and taste does not survive a disagreement with a launch date. Defensible in a top three only if 1 or 4 is also in it.",
      },
      {
        option: "3 — Data-growth ceiling per department",
        verdict: "avoid",
        why: "A measure dressed as a decision. Valuable and narrow — executable by one department against its own number, not a change to what any other department is required to do.",
      },
      {
        option: "5 — Consolidation programme for redundant dashboards",
        verdict: "avoid",
        why: "The clearest measure in the list: a funded programme against a specific estate. It changes the system once and changes no rule that produced it.",
      },
      {
        option: "6 — Assessment framework in department objectives",
        verdict: "avoid",
        why: "Powerful and the most politically expensive item here — it changes what departments are assessed on. Defensible as a #1 only if the learner names who absorbs the delivery cost that follows.",
      },
    ],
    teachingNote:
      "There is no single correct order. Assess a top three on whether comparability, bindingness and the review loop are all represented — not on whether it matches 1/7/4. A learner who picks 6 first and explains who pays for the lost delivery has produced a stronger answer than one who picks 1 first and cannot say what it obliges anyone to do.",
  } as AnswerKeyBlock,
};

// ---------------------------------------------------------------------------
// Exercise 3 — the trade-off map
// ---------------------------------------------------------------------------

export type QuadrantId = "quick" | "bet" | "noise" | "symbolism";

export type Quadrant = {
  id: QuadrantId;
  label: string;
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
    note: "Costly to deliver and gone once its sponsor moves on. The quadrant to recognise before you are in it — the classic shape of digitalisation oversold as progress.",
  },
];

export const quadrantFor = (momentumHigh: boolean, structuralHigh: boolean): QuadrantId =>
  structuralHigh ? (momentumHigh ? "bet" : "quick") : momentumHigh ? "symbolism" : "noise";

export const quadrantById = (id: QuadrantId) => QUADRANTS.find((q) => q.id === id)!;

export type MapMeasure = {
  id: string;
  label: string;
  detail: string;
  momentumHigh: boolean;
  structuralHigh: boolean;
  q1Clue: string;
  q2Clue: string;
  quadrant: QuadrantId;
  answerKey: AnswerKeyBlock;
};

export const MAP_QUESTIONS = {
  q1: {
    key: "q1",
    label: "Momentum cost",
    question: "To do this, do departments have to stop or re-plan digitalisation work they have already committed to this quarter?",
    yes: "Yes — committed work has to move",
    no: "No — it fits alongside committed work",
    instruction: "Momentum cost is about the roadmap, not about effort in hours.",
  },
  q2: {
    key: "q2",
    label: "Structural impact",
    question: "If the sponsor of this initiative left tomorrow, would its effect persist without anyone repeating the effort?",
    yes: "Yes — the effect persists on its own",
    no: "No — it decays or has to be redone",
    instruction: "Structural impact is about durability, not about size.",
  },
} as const;

export const MAP_MEASURES: MapMeasure[] = [
  {
    id: "m1",
    label: "M1 — New predictive-analytics platform for demand forecasting",
    detail: "A visible, department-sponsored modernisation project.",
    momentumHigh: true,
    structuralHigh: false,
    quadrant: "symbolism",
    q1Clue: "A new platform is a launch. Ask what has to be re-planned to deliver it this quarter.",
    q2Clue: "Ask what happens to the platform's governance the day its sponsoring department head moves to a different role.",
    answerKey: {
      prompt: "M1 — Predictive-analytics platform",
      items: [
        { option: "Momentum cost: Yes (expected)", verdict: "pick", why: "A new platform is a real launch — it consumes committed delivery capacity inside a quarter someone has already planned." },
        { option: "Structural impact: No (expected)", verdict: "pick", why: "Without an assessment framework governing it, the platform's environmental footprint and its continued use are entirely dependent on whoever sponsored it staying interested." },
        { option: "Common wrong reading: high structural impact", verdict: "avoid", why: "Mistakes visibility for durability. A platform that looks strategic is not structurally strong unless something outlives its sponsor — governance, not the platform itself." },
      ],
      teachingNote: "The clearest example of expensive symbolism in this set — the quadrant most often skipped in a rushed reading of the map. Worth pointing at directly: this is what digitalisation oversold as progress looks like once it is actually assessed.",
    },
  },
  {
    id: "m2",
    label: "M2 — IoT monitoring rollout across facilities",
    detail: "Sensors and connectivity across all sites, with a governance plan attached from the start.",
    momentumHigh: true,
    structuralHigh: true,
    quadrant: "bet",
    q1Clue: "A facility-wide rollout touches procurement, IT and site operations at once. Ask what each of them has to stop doing to deliver it.",
    q2Clue: "Ask what happens to the sensor network and its data policy after the rollout team disbands.",
    answerKey: {
      prompt: "M2 — IoT monitoring rollout",
      items: [
        { option: "Momentum cost: Yes (expected)", verdict: "pick", why: "Cross-department delivery at facility scale draws real capacity from committed work in procurement, IT and site operations simultaneously." },
        { option: "Structural impact: Yes (expected)", verdict: "pick", why: "Once live and governed, the sensor network keeps reporting on its own — the data and the decisions it feeds persist without the rollout team." },
        { option: "Common wrong reading: low momentum cost", verdict: "avoid", why: "Treats installation as the whole cost. The real cost is the cross-department coordination, not the hardware." },
      ],
    },
  },
  {
    id: "m3",
    label: "M3 — Workflow automation suite for finance and procurement",
    detail: "Self-contained within two departments that already own the processes involved.",
    momentumHigh: false,
    structuralHigh: true,
    quadrant: "quick",
    q1Clue: "This sits inside two departments that already own the processes. Ask whether anyone outside them has to re-plan anything.",
    q2Clue: "Once the manual steps are automated, what would have to happen for them to come back?",
    answerKey: {
      prompt: "M3 — Workflow automation suite",
      items: [
        { option: "Momentum cost: No (expected)", verdict: "pick", why: "Self-contained within finance and procurement's own processes, with no cross-department dependency to re-plan." },
        { option: "Structural impact: Yes (expected)", verdict: "pick", why: "Removed manual steps do not silently return — the automation persists as the new default way the work is done." },
        { option: "Common wrong reading: low structural impact", verdict: "avoid", why: "Confuses 'narrow scope' with 'small effect'. The scope is narrow; the effect within it is durable." },
      ],
      teachingNote: "The quadrant participants most often misplace, because 'quick win' sounds trivial and this is the best trade available on the map: low cost to Synervia's roadmap, durable effect.",
    },
  },
  {
    id: "m4",
    label: "M4 — Customer data platform consolidating all customer touchpoints",
    detail: "One shared record, replacing separate systems in sales, support and marketing.",
    momentumHigh: true,
    structuralHigh: true,
    quadrant: "bet",
    q1Clue: "Count the departments whose systems feed the same customer record today, then ask whose quarter absorbs the migration.",
    q2Clue: "Once there is one shared record with one owner, what would have to happen for three separate systems to reappear?",
    answerKey: {
      prompt: "M4 — Customer data platform",
      items: [
        { option: "Momentum cost: Yes (expected)", verdict: "pick", why: "Touches record ownership and system contracts across sales, support and marketing, each with a committed quarter of their own." },
        { option: "Structural impact: Yes (expected)", verdict: "pick", why: "A single shared record with one owner is a shape the organisation keeps — re-duplicating it would require someone to deliberately undo the ownership decision." },
        { option: "Common wrong reading: low structural impact", verdict: "avoid", why: "Reads it as 'just a data migration'. It is a migration that changes who owns a record, which is a governance decision with a durable effect." },
      ],
    },
  },
  {
    id: "m5",
    label: "M5 — Consolidation project retiring three redundant reporting tools",
    detail: "Three low-use tools reporting overlapping figures to different departments.",
    momentumHigh: false,
    structuralHigh: false,
    quadrant: "noise",
    q1Clue: "These three tools are already low-use. Ask whether anyone outside their own small user group has to re-plan anything to retire them.",
    q2Clue: "Ask what happens the first time a new department wants its own overlapping report next year.",
    answerKey: {
      prompt: "M5 — Retiring three redundant reporting tools",
      items: [
        { option: "Momentum cost: No (expected)", verdict: "pick", why: "Low-use tools with a small user group each — retiring them touches almost no committed roadmap." },
        { option: "Structural impact: No (expected)", verdict: "pick", why: "Nothing about the conditions that produced three overlapping tools changes, so a fourth one is already just as likely next year." },
        { option: "Common wrong reading: high structural impact", verdict: "avoid", why: "Mistakes 'consolidation' as a category for durable impact in every instance. This specific instance is cheap and forgettable, not because consolidation is unimportant, but because nothing here governs future duplication." },
      ],
      teachingNote: "Not worthless — a real saving with no durability, exactly the 'short-term visible but structurally weak' pattern the curriculum warns about. The professional error is choosing only this and reporting the problem as solved.",
    },
  },
];

export const mapMeasureById = (id: string) => MAP_MEASURES.find((m) => m.id === id)!;

export const MAP_EXERCISE = {
  id: "ex-map",
  n: 3,
  minutes: 20,
  title: "The trade-off map",
  intro:
    "Five digitalisation initiatives, two diagnostic questions each. Answer both and the initiative moves to its quadrant — you never drag it there directly, because the position is a consequence of the two answers, not a judgement of its own.",
  material: ["prioritise", "uncertainty"] as MaterialSectionId[],
  wrongText: "That answer does not hold up for this initiative. Read it again, then change the answer.",
  clueLabel: "Need a clue?",
  betField: {
    label: "If you can fund only one strategic bet this year, why this one — or why not this one?",
    instruction: "One line. Compare it against the other bets on the map, not against doing nothing.",
    placeholder: "e.g. Fund this one first because it is the only bet that makes the other one cheaper to govern…",
  },
  betSamples: {
    m2: "Fund this one alongside the assessment framework, not before it: an IoT rollout without governance in place is how expensive symbolism happens at facility scale.",
    m4: "Fund this one first: it consolidates the most customer-facing duplication on the map and gives the assessment framework its clearest first test case.",
  } as Record<string, string>,
} as const;

// ---------------------------------------------------------------------------
// Exercise 4 — the RACI
// ---------------------------------------------------------------------------

export const RACI_ROWS = [
  { id: "r1", label: "Approving the binding digital-sustainability assessment framework" },
  { id: "r2", label: "Defining assessment criteria and the data-growth ceiling" },
  { id: "r3", label: "Enforcing the environmental review gate on an individual project" },
  { id: "r4", label: "Allocating budget for assessment and governance capacity" },
];

export const TASK_RACI_ROLES = [
  { id: "board", name: "Management Board", short: "Board", canBindCapacity: true },
  { id: "sustainability", name: "Sustainability Lead", short: "Sust.", canBindCapacity: false },
  { id: "it", name: "IT", short: "IT", canBindCapacity: false },
  { id: "finance", name: "Finance", short: "Finance", canBindCapacity: true },
  { id: "deptHeads", name: "Department Heads", short: "Dept.", canBindCapacity: false },
  { id: "transformation", name: "Transformation Office", short: "Transf.", canBindCapacity: false },
];

/** Rows where the A must be able to bind capacity for the assignment to hold. */
export const CAPACITY_ROWS = ["r4"];

export const RACI_EXERCISE = {
  id: "ex-raci",
  n: 4,
  minutes: 15,
  title: "Ownership of the digital-sustainability standard",
  intro:
    "Click a cell to cycle it through R, A, C, I and back to blank. The grid checks structure only — exactly one Accountable per row, at least one Responsible — and asks a question when an Accountable cannot bind capacity. It never tells you who should hold which letter.",
  material: ["governance"] as MaterialSectionId[],
  violations: {
    manyA: "More than one Accountable in this row. Two Accountables have no escalation path between them.",
    noA: "No Accountable in this row. A decision with no owner is one nobody will report as unmade.",
    noR: "No Responsible in this row. Someone has to do the work.",
    authority: "Can this role change a department's budget or roadmap? If not, who approves this in practice?",
  },
  answerKey: {
    prompt: "Exercise 4 — RACI for the assessment standard",
    items: [
      {
        option: "Row 1 — Approving the assessment framework: A = Management Board",
        verdict: "pick",
        why: "Approval of something binding across departments belongs to the role that can require every department to comply. Sustainability Lead is R here, Finance and IT are C, Department Heads are I.",
      },
      {
        option: "Row 2 — Defining assessment criteria and the growth ceiling: A = Sustainability Lead",
        verdict: "pick",
        why: "Sound, with the Board as C. The criteria are a technical and policy artefact and the sustainability function owns their content; keep R separate from A where possible so the author is not the sole approver.",
      },
      {
        option: "Row 3 — Enforcing the gate on an individual project: A = Sustainability Lead",
        verdict: "pick",
        why: "Enforcement on a single project is a judgement the sustainability function can make, provided rows 1 and 2 gave it something binding to enforce. IT and Department Heads are R, Finance is C.",
      },
      {
        option: "Row 4 — Allocating budget: A = Sustainability Lead",
        verdict: "avoid",
        why: "The classic failure. Budget allocation is a finance decision; a sustainability lead who cannot move a budget line holds accountability without authority, which produces an agreed framework nobody has funded capacity to run.",
      },
      {
        option: "Row 4 — Allocating budget: A = Finance (with the Board as C)",
        verdict: "pick",
        why: "The only assignment that survives contact with a budget cycle. The Management Board is genuinely Consulted here and in some organisations is jointly Accountable with Finance — but never Accountable alone if it cannot itself execute the transfer.",
      },
    ],
    teachingNote:
      "More than one grid defends. What does not defend is an A that cannot bind capacity for its row, an A held by a committee, or a row with no R. If a participant gives Department Heads the A on row 1, ask what happens when a department's launch date and the framework conflict.",
  } as AnswerKeyBlock,
};

// ---------------------------------------------------------------------------
// Exercise 5 — the decision that cannot wait
// ---------------------------------------------------------------------------

export const DECIDE_NOW_FIELDS = [
  {
    key: "decision",
    label: "The decision to take now",
    instruction: "One decision, stated so that someone could act on it on Monday. Name what becomes binding.",
    placeholder: "e.g. From the next quarter every new digital initiative above a defined scope must pass the assessment framework before funding is released…",
    sample:
      "From the start of next quarter, every new Synervia digital initiative above a defined scope must pass the assessment framework before funding is released, and the Management Board signs the criteria that make it binding rather than recommended.",
  },
  {
    key: "assumption",
    label: "The assumption it rests on",
    instruction: "What must be true for this to be the right call?",
    placeholder: "e.g. That departments can submit initiatives for assessment without materially delaying committed launches…",
    sample: "That submitting an initiative for assessment adds roughly one to two weeks of lead time, not a quarter — additive work departments can absorb without dropping a committed launch.",
  },
  {
    key: "signal",
    label: "The signal that would prove it wrong",
    instruction: "What would you watch, and by when, to know the assumption failed?",
    placeholder: "e.g. If assessment lead time exceeds three weeks for more than half of submitted initiatives by month two…",
    sample: "If assessment lead time exceeds three weeks for more than half of submitted initiatives by the end of month two, the assumption that this is absorbable was wrong, and the framework needs dedicated assessment capacity rather than an obligation layered onto existing roles.",
  },
  {
    key: "cost",
    label: "The cost of waiting one more quarter",
    instruction: "Be specific: what is consumed, what is decided by default, what gets harder.",
    placeholder: "e.g. Three more months of unassessed digitalisation launching under the current conventions, plus…",
    sample:
      "Three more months of digitalisation initiatives launching under no shared assessment logic; every initiative shipped in that quarter is built and reported as progress without anyone checking its net effect, so the eventual framework has a larger, messier backlog to retroactively judge; and the risk that one of this quarter's launches gets publicly framed as a sustainability win before it has been assessed at all.",
  },
] as const;

export const DECIDE_NOW_EXERCISE = {
  id: "ex-decide",
  n: 5,
  minutes: 15,
  title: "The decision that cannot wait",
  intro: "One decision, stated as a decision. The three fields after it are what make it defensible in front of people who will challenge it.",
  material: ["uncertainty", "worked"] as MaterialSectionId[],
  answerKey: {
    prompt: "Exercise 5 — the decision that cannot wait",
    items: [
      {
        option: "The decision — binding, not aspirational",
        verdict: "pick",
        why: "Strong: \"From next quarter every initiative above scope X must pass the assessment framework before funding.\" Weak: \"We should assess our digitalisation more.\" The test is whether someone could act on it on Monday without a further meeting.",
      },
      {
        option: "The assumption — falsifiable",
        verdict: "pick",
        why: "Strong: \"Departments can absorb one to two weeks of assessment lead time without dropping committed launches.\" Weak: \"Departments will support this.\" The test is whether you could be shown to be wrong.",
      },
      {
        option: "The falsifier — observable, with a date",
        verdict: "pick",
        why: "Strong: \"Lead time exceeds three weeks for over half of submissions by end of month two.\" Weak: \"If it does not seem to be working.\" The test is whether two people would agree on the reading.",
      },
      {
        option: "The cost of waiting — concrete",
        verdict: "pick",
        why: "Strong: \"Three months of unassessed launches, plus the risk one gets publicly reported as a sustainability win before assessment.\" Weak: \"We lose time.\" The test is whether a board member could recognise the quantity and the reputational exposure.",
      },
    ],
    teachingNote:
      "Assess the four fields as a set rather than individually. A binding decision with an unfalsifiable assumption is a preference with a date on it; a good falsifier attached to an aspiration is a measurement of nothing. The set is what makes the memo survive a challenge.",
  } as AnswerKeyBlock,
};
