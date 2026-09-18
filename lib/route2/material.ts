/**
 * Route 2 material — two lean sections, S1–S2, ~45–50 minutes combined.
 * Text is kept deliberately short throughout: the interactive component next
 * to each section carries the understanding, the prose only frames it.
 */

import type { MaterialSection } from "@/lib/materialSection";
import type { MaterialSectionId } from "./sections";

export const S1_CRITERIA: MaterialSection<MaterialSectionId> = {
  id: "criteria",
  code: "S1",
  n: 1,
  icon: "target",
  kicker: "S1 · What decides which measure-line gets funded first",
  title: "The four prioritisation criteria",
  standfirst: "When budget only allows one measure-line to be funded first, four criteria decide which one.",
  definition:
    "Feasibility — can this realistically be started now with the budget, skills, and data the organisation already has? Economic effect — what is the direct, quantifiable cost-vs-saving case? Behavioural effectiveness — how much real, sustained behaviour change will this actually produce, not its theoretical ceiling? Regulatory relevance — how directly does this close an actual, named compliance or evidence gap?",
  insight: "No single measure-line wins on all four — that tension is exactly what Task Part 1 asks you to work through.",
  takeaway: "Score every option on all four criteria before choosing — a measure that wins on one criterion and is never checked against the other three is a preference, not a prioritisation.",
  body: [],
  reasoning: [
    "A high score on one criterion doesn't settle the ranking on its own — an option that wins on Economic effect but scores lowest on Feasibility can still lose to a slower, cheaper option the organisation can actually start now.",
    "Score Behavioural effectiveness on realistic, sustained adoption — not on what the measure could achieve if everyone complied perfectly. The gap between a measure's ceiling and its realised effect is the same gap that undermines a purely technical fix.",
    "Regulatory relevance means the measure closes a specific, named requirement — general talk of \"being compliant\" scores lower than a measure that visibly answers one actual gap.",
  ],
  callout: {
    label: "Practice",
    text: "Try changing one value on the radar below and see how the shape shifts before you build your real one in the task.",
  },
  references: [],
  minutes: 22,
};

export const S2_OWNERSHIP: MaterialSection<MaterialSectionId> = {
  id: "ownership",
  code: "S2",
  n: 2,
  icon: "network",
  kicker: "S2 · From priority to proposal",
  title: "Deciding & assigning ownership with incomplete data",
  standfirst: "Turning a priority into a proposal means answering two practical questions.",
  definition:
    "Who typically owns a decision like this? Six functions are usually in the room for a Green IT prioritisation decision: IT, Finance, Compliance, HR, Purchasing, Management. What can be decided now, even with incomplete data? Two questions settle this: is the decision reversible or cheap to undo, and would more data actually change its direction?",
  insight: "Naming who owns and who is only consulted is what makes a proposal actionable rather than a wish list. If a decision is reversible and more data wouldn't change it, it can be decided now.",
  takeaway: "A proposal with no named owner is a wish list. A decision held back for \"more data\" that wouldn't actually change is a decision avoided, not a decision made carefully.",
  body: [],
  reasoning: [
    "\"Owns\" means the function is accountable for the outcome; \"consulted\" means the function has a stake but isn't the one accountable. A proposal with nobody marked as owner is not yet actionable, regardless of how many people are consulted.",
    "If a decision is reversible or cheap to undo, and more data genuinely wouldn't change which direction it goes, decide now — waiting only spends time for no benefit.",
    "If a decision is expensive or hard to reverse and more data would change its direction, get that evidence first — a small pilot is a way to get it cheaply when full reversibility isn't available.",
  ],
  callout: {
    label: "Practice",
    text: "Click a node below to see that function's stake, then try the reversibility toggles to see how the two questions decide the outcome.",
  },
  references: [],
  minutes: 23,
};

export const MATERIAL: MaterialSection<MaterialSectionId>[] = [S1_CRITERIA, S2_OWNERSHIP];

export const materialById = (id: MaterialSectionId) => MATERIAL.find((m) => m.id === id)!;

export const MATERIAL_MINUTES = MATERIAL.reduce((sum, s) => sum + s.minutes, 0);
