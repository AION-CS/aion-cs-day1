/**
 * S7 — Decision-making under incomplete information, with a read-only worked
 * example on a fictional company that has nothing to do with SmartLink, so the
 * learner gets the form of a justification without the Part 2 answer.
 */

import type { MaterialSection } from "@/lib/materialSection";
import type { MicroCheckBlock } from "@/lib/microCheck";
import type { MaterialSectionId } from "../sections";

export const BANDS = [
  {
    id: "short",
    label: "Short-term",
    tag: "Reversible now",
    text: "Cheap to undo, and often correct under every plausible scenario — the no-regret moves. Take them today.",
    examples: ["Make consumption transparent", "Define the decision criteria", "Declare measurement boundaries"],
  },
  {
    id: "medium",
    label: "Medium-term",
    tag: "Staged",
    text: "Real resources, committed in stages. Each stage ends at a review point where the next one is confirmed or stopped.",
    examples: ["Pilot before rollout", "Stage investment by site", "Review point per stage"],
  },
  {
    id: "structural",
    label: "Structural",
    tag: "Hard to reverse",
    text: "A fleet, a layer, an architecture. Decide only once the assumption behind it has a falsification condition and a review point.",
    examples: ["Device fleets", "Network layers", "Architecture choices"],
  },
];

export const TEMPLATE_PARTS = [
  { label: "Recommendation", text: "We recommend X." },
  { label: "Assumption", text: "This assumes Y." },
  { label: "Falsification condition + review point", text: "If [specific indicator] shows Z by [review point], we revise." },
  { label: "Reversibility", text: "The cost of being wrong is bounded because [reversibility mechanism]." },
];

export const WORKED_EXAMPLE = {
  kicker: "Worked example · read-only",
  company: "Harbour Logistics, a fictional warehouse operator",
  title: "A building-management sensor pilot",
  situation:
    "Harbour Logistics is deciding whether to install occupancy sensors to steer heating in its warehouses. The supplier promises lower heating demand; nobody has measured how often the halls are actually empty during heated hours.",
  paragraphs: [
    "We recommend a two-warehouse pilot rather than a rollout across all six sites. This assumes that heating currently runs in large parts of the halls while nobody is working there, so that occupancy-driven control can reduce heating demand without affecting operations. If the metered heating demand of the two pilot halls has not fallen below the same halls' weather-adjusted baseline from last winter by the end of the first heating season, we revise: the pilot stops and the remaining sites are not equipped.",
    "The cost of being wrong is bounded because the sensors are leased for one season and run on mains power from the existing lighting circuits, so there is no battery programme and no fleet to replace if the pilot ends. The recommendation disappoints the facilities manager, who wanted all six sites done in one project. That is acceptable, because a six-site rollout would commit the whole fleet before the saving has been shown even once.",
  ],
  annotations: [
    { label: "Assumption", text: "Heating runs while halls are empty." },
    { label: "Falsification condition", text: "Metered heating demand has not fallen below the weather-adjusted baseline." },
    { label: "Review point", text: "The end of the first heating season." },
    { label: "Reversibility", text: "Leased, mains-powered sensors for one season." },
    { label: "Whose expectation it disappoints", text: "The facilities manager's six-site project." },
  ],
};

export const S7_UNCERTAINTY: MaterialSection<MaterialSectionId> = {
  id: "uncertainty",
  code: "S7",
  n: 7,
  icon: "shield",
  kicker: "S7 · Deciding before the data is complete",
  title: "Decision-making under incomplete information",
  standfirst:
    "Waiting for complete data is a decision too. Decide what is reversible now, stage what is not, and say in advance what would prove you wrong.",
  minutes: 20,
  definition:
    "Deciding under incomplete information means accepting that the data will not be complete in time, and structuring the decision so that being wrong is survivable. The practical discipline is to separate what is reversible now from what must be staged, across three bands: short-term moves that can be taken today, medium-term steps committed with review points, and structural commitments decided only with an explicit falsification condition.",
  insight:
    "Waiting for complete data is itself a decision, and it has a cost: the inefficient status quo keeps running while the analysis continues. Some moves are correct under every plausible scenario — making consumption transparent, defining decision criteria, declaring measurement boundaries. These no-regret moves can be taken today, and they also make every later, larger decision cheaper to get right.",
  takeaway:
    "Justify under uncertainty in one paragraph: the recommendation, the assumption it rests on, what would falsify that assumption and by when, and why the cost of being wrong is bounded. A justification without a falsification condition cannot be tested; a justification without a review point never will be.",
  body: [
    {
      heading: "Three bands: now, staged, structural",
      paragraphs: [
        "Short-term moves are reversible and cheap to undo; many of them are no-regret moves. Medium-term steps commit real resources but can be staged — each stage ends at a review point where the next stage is confirmed or stopped. Structural commitments — a device fleet, a network layer, an architecture — are hard to reverse, and should be decided only once the assumption behind them has a stated falsification condition and a review point.",
        "The bands let a manager act today without betting the organisation on a forecast. The no-regret moves go first, the staged steps buy information, and the structural commitments wait for it.",
      ],
    },
    {
      heading: "Stakeholder reality",
      paragraphs: [
        "Real decisions sit between conflicting expectations. Management wants visible innovation. Departments want new applications quickly. IT and operations fear complexity and long-term follow-up cost. Finance wants a bounded number. No recommendation satisfies all four, so a defensible one names whose expectation it disappoints — and why that is acceptable.",
      ],
    },
    {
      heading: "A justification you can reuse",
      paragraphs: [
        "One paragraph, four sentences: We recommend X. This assumes Y. If [specific indicator] shows Z by [review point], we revise. The cost of being wrong is bounded because [reversibility mechanism].",
        "The third sentence carries two of the three things a reviewer looks for. The indicator and what it must show are the falsification condition — the result that would prove the assumption wrong. The date is the review point — when the organisation will actually look. Leave out either, and the recommendation can no longer be tested, only defended. The worked example below applies the pattern to a decision unrelated to SmartLink.",
      ],
    },
  ],
  reasoning: [
    "Your Part 2 justification needs an assumption, a falsification condition (which indicator, showing what) and a review point (by when). The soft checker under the field looks for all three and never blocks you.",
    "A follow-up decision has an owner and a date. 'Monitor the situation' names neither, so it is not a decision.",
    "When you name the risks of the short-term-attractive option, name concrete consequences — a layer that stays on, a fleet that needs replacing, a saving that is never measured — not general worries.",
  ],
  callout: {
    label: "The template",
    text: "We recommend X. This assumes Y. If [specific indicator] shows Z by [review point], we revise. The cost of being wrong is bounded because [reversibility mechanism].",
  },
  references: [
    {
      label: "GSMA — Mobile Net Zero, 5th annual report (2025)",
      detail: "≈7.5% a year needed to 2030, more than twice the rate achieved — the cost of delay expressed as a required pace.",
    },
    {
      label: "ITU-T L.1470",
      detail: "An absolute, time-bound reduction trajectory for the ICT sector: why waiting for complete data is not neutral.",
      url: "https://www.itu.int/rec/T-REC-L.1470",
    },
    {
      label: "ETSI ES 203 228 V1.3.1 (2020-10)",
      detail: "Declaring a measurement boundary before a figure is reported — a no-regret move with a standard behind it.",
    },
  ],
};

export const MICRO_5: MicroCheckBlock = {
  id: "mc5",
  title: "Check your understanding · S5–S7",
  questions: [
    {
      id: "mc5-q1",
      prompt: "Which of these is a no-regret move?",
      options: [
        {
          id: "a",
          text: "Replacing all network equipment this year.",
          feedback: "Not quite. A large capital commitment is right in some scenarios and wrong in others — the opposite of no-regret.",
        },
        {
          id: "b",
          text: "Pausing every connectivity project until complete data exists.",
          feedback: "Not quite. Waiting is itself a decision with a cost: the status quo keeps running while you wait.",
        },
        {
          id: "c",
          text: "Publishing how energy will be measured, and over which boundary, before the next investment is approved.",
          correct: true,
          feedback:
            "Correct. Transparency and boundary-setting are right under every plausible scenario, and they make every later decision cheaper to get right.",
        },
        {
          id: "d",
          text: "Rolling out 5G campus networks at every site.",
          feedback: "Not quite. That is a structural commitment whose value depends entirely on the scenario.",
        },
      ],
    },
    {
      id: "mc5-q2",
      prompt:
        "\"We recommend the pilot. This assumes occupancy data will cut heating demand. We review after the first heating season, and the pilot can be stopped because the sensors are leased.\" What is missing?",
      options: [
        {
          id: "a",
          text: "A stated assumption.",
          feedback: "It has one: occupancy data will cut heating demand.",
        },
        {
          id: "b",
          text: "A review point.",
          feedback: "It has one: after the first heating season.",
        },
        {
          id: "c",
          text: "A reversibility mechanism.",
          feedback: "It has one: the sensors are leased, so the pilot can be stopped.",
        },
        {
          id: "d",
          text: "A falsification condition — which indicator, showing what, would make us revise.",
          correct: true,
          feedback:
            "Correct. It says when it will look, but not what result would prove the assumption wrong — so the review has nothing to test.",
        },
      ],
    },
    {
      id: "mc5-q3",
      prompt:
        "Operations objects: \"If the traffic forecast is wrong by a factor of two, we will have bought capacity nobody uses.\" Which criterion does this objection belong to?",
      options: [
        {
          id: "a",
          text: "Feasibility",
          feedback: "Not quite. Feasibility asks whether the option can be executed with current budget, skills and capacity.",
        },
        {
          id: "b",
          text: "Risk",
          correct: true,
          feedback: "Correct. It is exposure if an assumption proves wrong — the Risk diagnostic question almost word for word.",
        },
        {
          id: "c",
          text: "Controllability",
          feedback:
            "Close, but controllability asks whether you would know it failed and could stop it. The objection is about the exposure itself.",
        },
        {
          id: "d",
          text: "Long-term effect",
          feedback: "Not quite. Long-term effect asks whether the benefit persists after the project ends.",
        },
      ],
    },
  ],
};
