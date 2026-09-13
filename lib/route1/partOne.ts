/**
 * Part 1 — Diagnose. Level 1, ~15 minutes.
 *
 * Six observed signals from DataWeave's platform. For each one the learner
 * assigns an area, tags the root cause and the horizon, and writes the first
 * concrete step. The area is checkable; the two tags and the free text are not
 * graded live, only keyed for the mentor.
 */

import type { AnswerKeyBlock } from "@/lib/answerKey";
import type { IconKey } from "@/lib/routes";
import type { MaterialSectionId } from "./sections";

// ---------------------------------------------------------------------------
// Areas
// ---------------------------------------------------------------------------

export type AreaId =
  | "monitoring"
  | "scaling"
  | "dataflows"
  | "principles"
  | "management"
  | "priorities";

export type Area = {
  id: AreaId;
  name: string;
  icon: IconKey;
  /** One line under the name — what belongs here, not what the answer is. */
  note: string;
};

export const AREAS: Area[] = [
  {
    id: "monitoring",
    name: "Monitoring",
    icon: "gauge",
    note: "Whether the system can be seen and its behaviour attributed to a cause.",
  },
  {
    id: "scaling",
    name: "Scaling",
    icon: "cycle",
    note: "The rule that decides how much capacity exists, and who owns it.",
  },
  {
    id: "dataflows",
    name: "Data Flows",
    icon: "network",
    note: "How often a record moves, is transformed, and is stored again.",
  },
  {
    id: "principles",
    name: "Architectural Principles",
    icon: "blueprint",
    note: "What teams are required to design against when they decide.",
  },
  {
    id: "management",
    name: "Management Logic",
    icon: "layers",
    note: "Whether evidence is reviewed on a cadence and turned into decisions.",
  },
  {
    id: "priorities",
    name: "Team Priorities",
    icon: "target",
    note: "What teams are measured and rewarded for delivering.",
  },
];

export const areaById = (id: AreaId): Area => AREAS.find((a) => a.id === id)!;

// ---------------------------------------------------------------------------
// Tags
// ---------------------------------------------------------------------------

export type RootCause = "measurement" | "architecture";
export type Horizon = "short" | "structural";

export const ROOT_CAUSES: { id: RootCause; label: string; hint: string }[] = [
  {
    id: "measurement",
    label: "Measurement Gap",
    hint: "We cannot see it, attribute it, or nobody reads what we do see.",
  },
  {
    id: "architecture",
    label: "Architecture Decision",
    hint: "We can see it perfectly well, and it should not exist in this shape.",
  },
];

export const HORIZONS: { id: Horizon; label: string; hint: string }[] = [
  {
    id: "short",
    label: "Short-term visible",
    hint: "A team can show a result inside a quarter without changing what others are required to do.",
  },
  {
    id: "structural",
    label: "Structural",
    hint: "It needs a rule, an owner or a contract that outlives the change itself.",
  },
];

export const ROOT_CAUSE_FIELD = {
  label: "Root cause",
  instruction:
    "Ask whether the problem is that we cannot see it, or that it should not exist in this shape.",
};

export const HORIZON_FIELD = {
  label: "Horizon",
  instruction:
    "Ask what has to stay true after the fix. If it needs a rule or an owner to survive, it is structural.",
};

export const APPROACH_FIELD = {
  label: "Improvement approach",
  instruction:
    "One sentence: the first concrete step you would take. Name the action and its owner, not the outcome.",
  placeholder: "e.g. Architecture guild adds request attribution to the trace pipeline for the top five endpoints.",
};

export const AREA_FIELD = {
  label: "Which area does this belong to?",
  instruction:
    "Sort by the defect the signal actually reports, not by the cause you suspect behind it.",
};

// ---------------------------------------------------------------------------
// The six signals
// ---------------------------------------------------------------------------

export type Signal = {
  id: string;
  n: number;
  /** Short handle used in the missing list and the report. */
  title: string;
  /** Where in the platform this was observed. */
  source: string;
  /** The signal as the learner reads it. */
  text: string;
  area: AreaId;
  rootCause: RootCause;
  horizon: Horizon;
  /** Directional only — never names the area or the reason. */
  clue: string;
  /** Which material sections this signal draws on. */
  material: MaterialSectionId[];
  /** Demo answer for the mentor auto-fill. */
  sampleApproach: string;
  answerKey: AnswerKeyBlock;
};

export const SIGNALS: Signal[] = [
  {
    id: "s1",
    n: 1,
    title: "Peaks visible, causes untraceable",
    source: "Platform dashboards · weekly load report",
    text: "Load peaks are clearly visible in the dashboards, but their causes can only be traced in part — the team can see that Tuesday 14:00 is expensive, not why.",
    area: "monitoring",
    rootCause: "measurement",
    horizon: "short",
    clue: "Nothing here says the system is doing the wrong thing. It says the team cannot follow the trail.",
    material: ["monitoring", "load"],
    sampleApproach:
      "Platform team adds request attribution and per-workload tagging to the existing trace pipeline for the five most expensive endpoints.",
    answerKey: {
      prompt: "Signal 1 — Peaks visible, causes untraceable",
      items: [
        {
          option: "Monitoring (expected)",
          verdict: "pick",
          why: "The dashboards already report that Tuesday 14:00 is expensive. Nothing in the signal claims the load is wrong — it says the trail from effect back to cause is broken. A broken trail is a transparency defect, which is what the Monitoring area owns.",
        },
        {
          option: "Data Flows (strongest wrong answer)",
          verdict: "avoid",
          why: "Tempting, because unattributed peaks often do turn out to be a data-flow problem. But that is a hypothesis about the cause; this signal only reports that the hypothesis cannot currently be tested. Sorting by suspected cause rather than by observed defect is the most common error in this exercise.",
        },
        {
          option: "Root cause: Measurement Gap (expected)",
          verdict: "pick",
          why: "Nothing here describes a structure that should not exist — it describes an inability to see. Attribution, trace context and per-workload aggregation are instrumentation questions, not architecture ones.",
        },
        {
          option: "Horizon: Short-term visible (expected)",
          verdict: "pick",
          why: "Attribution is additive work on a pipeline that already exists. The team can show a result inside the quarter without changing what any other team is required to do.",
        },
      ],
      teachingNote:
        "Load band: unknown — and that is precisely the finding. Until the peaks are attributable, DataWeave cannot tell whether this is necessary load or poorly designed load, so any optimisation funded now is a guess. This signal is the strongest single argument for funding transparency before rework, and it is worth pointing at again during Part 2.",
    },
  },
  {
    id: "s2",
    n: 2,
    title: "Scaling rule nobody has revisited",
    source: "Three services · autoscaling configuration",
    text: "Three services scale up aggressively although their actual use is irregular and very low for most of the day. The scaling rule was set during a launch two years ago and never revisited.",
    area: "scaling",
    rootCause: "architecture",
    horizon: "structural",
    clue: "The demand is real. What is questionable is the rule that decides how much capacity exists to meet it.",
    material: ["monitoring", "architecture"],
    sampleApproach:
      "Operations lead rewrites the three policies onto request-rate triggers with a justified minimum, and takes ownership of a six-monthly policy review.",
    answerKey: {
      prompt: "Signal 2 — Scaling rule nobody has revisited",
      items: [
        {
          option: "Scaling (expected)",
          verdict: "pick",
          why: "The demand is genuine and irregular; what is in question is the rule that decides how much capacity exists to meet it. The signal names the rule, its origin and the fact that it has never been revisited — that is the Scaling area exactly.",
        },
        {
          option: "Monitoring (strongest wrong answer)",
          verdict: "avoid",
          why: "Arguable, because nobody noticed for two years. But the signal states the facts are already visible: the aggressive scaling and the low use are both known. What is missing is not sight, it is ownership of the rule.",
        },
        {
          option: "Root cause: Architecture Decision (expected)",
          verdict: "pick",
          why: "A scaling policy is an architecture decision expressed in configuration. It was taken deliberately, for a launch, under conditions that no longer hold — the defect is that nothing required it to be re-examined.",
        },
        {
          option: "Horizon: Structural (expected)",
          verdict: "pick",
          why: "Rewriting three rules is a day's work. Keeping them right needs a policy, a named threshold owner and a review date — without those the same drift returns after the next launch, which is what makes this structural rather than short-term.",
        },
      ],
      teachingNote:
        "Load band: permanently inefficient. Capacity that exists regardless of demand is baseline consumption that never drops, so every dashboard renders it as normal. If a participant argues Short-term visible because the config change is quick, accept the observation and push back on the durability question: what stops it drifting again?",
    },
  },
  {
    id: "s3",
    n: 3,
    title: "Redundant customer-record fetch",
    source: "Customer platform · three services in sequence",
    text: "Data flows have grown historically. The same customer record is fetched, transformed and re-persisted by three services in sequence before it reaches the platform that needs it.",
    area: "dataflows",
    rootCause: "architecture",
    horizon: "structural",
    clue: "Follow one record through the system and count how many times the same work is done.",
    material: ["architecture", "load"],
    sampleApproach:
      "Architecture guild names one owning service for the customer record and moves the two downstream consumers onto change events in the next two increments.",
    answerKey: {
      prompt: "Signal 3 — Redundant customer-record fetch",
      items: [
        {
          option: "Data Flows (expected)",
          verdict: "pick",
          why: "One record should have one canonical path and one owner. Here it has three hops, each re-fetching, re-transforming and re-persisting the same data — the textbook efficient-data-flows failure from S3.",
        },
        {
          option: "Architectural Principles (strongest wrong answer)",
          verdict: "avoid",
          why: "Defensible, and the absence of principles is genuinely why this happened. But Signal 4 already carries that absence explicitly. This signal names one specific flow, and sorting it into Principles loses the concrete finding an architecture review could act on next quarter.",
        },
        {
          option: "Root cause: Architecture Decision (expected)",
          verdict: "pick",
          why: "Every hop was locally reasonable when it was added. The defect is the shape of the whole, which is visible and indefensible once you follow one record end to end.",
        },
        {
          option: "Horizon: Structural (expected)",
          verdict: "pick",
          why: "Consolidating a grown data flow touches record ownership, three services' contracts and almost certainly a migration. It cannot be done and held without an owner for the canonical path.",
        },
      ],
      teachingNote:
        "Load band: poorly designed. The work is necessary — the record genuinely has to reach that platform — but the shape triples I/O, storage and coupling. Useful to contrast with Signal 2: both are Architecture Decisions, but one is a rule, the other is a structure.",
    },
  },
  {
    id: "s4",
    n: 4,
    title: "No binding principles for resource-friendly work",
    source: "Engineering organisation · design practice across teams",
    text: "There are no binding principles telling teams what a resource-friendly implementation looks like. Each team decides on its own, and each decision is defensible in isolation.",
    area: "principles",
    rootCause: "architecture",
    horizon: "structural",
    clue: "The problem is not any single implementation. It is that there is nothing for them to be consistent with.",
    material: ["architecture", "coupling"],
    sampleApproach:
      "Architecture board publishes five binding design rules with review criteria, and applies them to new services from the next increment onward.",
    answerKey: {
      prompt: "Signal 4 — No binding principles",
      items: [
        {
          option: "Architectural Principles (expected)",
          verdict: "pick",
          why: "The signal describes the absence of a shared design constraint, not a defect in any one implementation. Every decision being defensible in isolation is the diagnostic phrase: locally rational, collectively incoherent.",
        },
        {
          option: "Team Priorities (strongest wrong answer)",
          verdict: "avoid",
          why: "Close, and the two interact. But the signal says teams decide in isolation, not that they are aimed at the wrong goal. Priorities decide what a team works on; principles decide what 'done well' means once they do.",
        },
        {
          option: "Root cause: Architecture Decision (expected)",
          verdict: "pick",
          why: "The absence of a binding principle is itself an architecture decision — the organisation has decided by default that consistency is optional. Nothing is unmeasurable here; there is simply nothing to measure against.",
        },
        {
          option: "Horizon: Structural (expected)",
          verdict: "pick",
          why: "Principles only bind if they are owned, reviewed and applied at a gate. Publishing a document with no owner reproduces exactly the state the signal describes.",
        },
      ],
      teachingNote:
        "Load band: this one produces poorly designed and permanently inefficient load across the estate rather than being an instance of either. It is the multiplier signal — it explains why findings like Signals 2 and 3 keep reappearing in new services, and it is the reason Part 2's Option B scores so high on long-term effect.",
    },
  },
  {
    id: "s5",
    n: 5,
    title: "Monitoring data read only after failure",
    source: "Engineering management · review practice",
    text: "Monitoring data is pulled up when something breaks. No one reviews it on a cadence to steer improvement, and no meeting has it as a standing agenda item.",
    area: "management",
    rootCause: "measurement",
    horizon: "short",
    clue: "The data exists. Ask who looks at it, when, and to decide what.",
    material: ["monitoring", "coupling"],
    sampleApproach:
      "Engineering director adds a monthly efficiency review with three standing indicators and names an owner who brings one decision proposal each time.",
    answerKey: {
      prompt: "Signal 5 — Monitoring data read only after failure",
      items: [
        {
          option: "Management Logic (expected)",
          verdict: "pick",
          why: "The data exists and is adequate. What is missing is the loop that turns it into a decision — cadence, owner, agenda. That is management logic, and it is the ISO 50001 point from S5: the mechanism is the review loop, not the metric.",
        },
        {
          option: "Monitoring (strongest wrong answer)",
          verdict: "avoid",
          why: "The most common misplacement in this exercise. Signal 1 is about whether the data can answer the question; Signal 5 is about whether anyone ever asks it. Sorting both into Monitoring erases the difference between an instrument and a management routine — and they need different fixes and different owners.",
        },
        {
          option: "Root cause: Measurement Gap (expected)",
          verdict: "pick",
          why: "Measurement nobody reads is, for decision purposes, measurement that does not exist. The gap sits at the point of consumption rather than collection — but it is still a gap in seeing, not a structure that should not exist.",
        },
        {
          option: "Horizon: Short-term visible (expected)",
          verdict: "pick",
          why: "A standing agenda item, a named owner and a cadence can be established this quarter without a line of code changing. This is the cheapest high-leverage move in the whole set.",
        },
      ],
      teachingNote:
        "If a participant argues Structural here, they have a real point — a review that depends on one enthusiastic director is not durable. Accept it as defensible and draw the distinction: the *first* result is visible in weeks, which is what the Short-term visible tag records; durability is what Part 2's Option A-plus-review coupling is meant to buy.",
    },
  },
  {
    id: "s6",
    n: 6,
    title: "Teams measured only on shipped features",
    source: "Product and development organisation · objectives",
    text: "Product and development teams are measured on shipped features. Efficiency work has no route into the backlog and no one who can prioritise it.",
    area: "priorities",
    rootCause: "measurement",
    horizon: "structural",
    clue: "Ask what the teams are rewarded for, not what they are capable of.",
    material: ["architecture", "tradeoff", "coupling"],
    sampleApproach:
      "Head of product adds one efficiency objective per product team for the next two quarters, with capacity ring-fenced in planning rather than left to spare time.",
    answerKey: {
      prompt: "Signal 6 — Teams measured only on shipped features",
      items: [
        {
          option: "Team Priorities (expected)",
          verdict: "pick",
          why: "Permanently inefficient load in organisational form. The teams are capable; nothing in their objectives, their backlog route or their approval path makes efficiency work possible to start, let alone finish.",
        },
        {
          option: "Management Logic (strongest wrong answer)",
          verdict: "avoid",
          why: "Very close — both are organisational. Management Logic is about whether anyone reviews the evidence; Team Priorities is about what teams are rewarded for. Signal 5 is the missing meeting; Signal 6 is the missing incentive. A cadence without an incentive produces a review everyone attends and nobody acts on, which is why they are separate findings.",
        },
        {
          option: "Root cause: Measurement Gap (expected)",
          verdict: "pick",
          why: "The teams are not making bad architecture calls — they are making no efficiency calls at all, because nothing measures them on it. What is unmeasured is unprioritised. The gap is in what the organisation measures about its own work, which is still a measurement gap.",
        },
        {
          option: "Horizon: Structural (expected)",
          verdict: "pick",
          why: "A single sprint of goodwill does not change what a team is assessed on. Only an objective, a capacity allocation or an approval route changes it, and each of those outlives the person who introduced it.",
        },
      ],
      teachingNote:
        "This is the signal where participants most often argue Architecture Decision, on the grounds that 'the organisation is the architecture'. It is a good argument and worth letting run for a minute — then draw it back to the operational test: could this be fixed by changing something in a system? No. Could it be fixed by changing what is measured and rewarded? Yes. That is the boundary the tag records.",
    },
  },
];

export const signalById = (id: string): Signal => SIGNALS.find((s) => s.id === id)!;

// ---------------------------------------------------------------------------
// Framing
// ---------------------------------------------------------------------------

export const PART_ONE = {
  id: "part-1",
  tag: "PART 1 · DIAGNOSE",
  title: "Six signals from DataWeave's platform",
  minutes: 15,
  framing:
    "These six signals were collected during a two-week review of DataWeave's platforms — from dashboards, configuration, the code base and conversations with the teams. Work through them in any order. For each one: assign the area it belongs to, tag whether the root cause is a measurement gap or an architecture decision, tag the horizon, and write the first concrete step you would take. Your Engagement Report assembles on the right as you go, and every completed signal stays editable.",
  checkLabel: "Check the area",
  recheckLabel: "Check again",
  wrongText: "That area does not hold up for this signal. Look at what the signal actually reports, then try another.",
  rightText: "That area holds. Carry on with the tags and the first step.",
  clueLabel: "Need a clue?",
};
