/**
 * The task — "Management proposal for Verdeon Digital Governance Group",
 * ~20 minutes, Level 3. Five quick, decisive stages (tone deliberately
 * senior/strategic, not junior-analyst): frame it, three guiding decisions,
 * build sequence, trade-off allocation, governance & the call now. One
 * export at the end.
 */

import type { AnswerKeyBlock } from "@/lib/answerKey";
import type { IconKey } from "@/lib/routes";
import type { MaterialSectionId } from "./sections";

export type ClueTier = { soft: string; sharp: string };

// ---------------------------------------------------------------------------
// The four role lenses (D4) — shared by Stage A (frame) and Stage E (match)
// ---------------------------------------------------------------------------

export type RoleId = "cio" | "sustainability" | "controlling" | "consultant";

export type Role = { id: RoleId; name: string; short: string; icon: IconKey; mandate: string };

export const ROLES: Role[] = [
  { id: "cio", name: "CIO / Head of IT Governance", short: "CIO", icon: "compass", mandate: "Steering capability — can this actually run the organisation's decisions?" },
  { id: "sustainability", name: "Head of Sustainability", short: "Sustainability", icon: "recycleLoop", mandate: "Credibility — will this hold up to scrutiny?" },
  { id: "controlling", name: "Controlling Lead", short: "Controlling", icon: "coins", mandate: "Cost and risk control." },
  { id: "consultant", name: "External Consultant", short: "Consultant", icon: "certificate", mandate: "Structural robustness, independent of any one person's judgement." },
];

export const roleById = (id: RoleId): Role => ROLES.find((r) => r.id === id)!;

// ---------------------------------------------------------------------------
// Stage A — Frame it
// ---------------------------------------------------------------------------

export const ROLE_LENS_FIELD = {
  label: "Pick a role lens",
  instruction: "This colours the framing and hints in later stages — it never locks content. You can view the whole task through any of the four.",
  material: ["rolePriorities"] as MaterialSectionId[],
};

export type Reason = { id: string; text: string };

export const RELEVANCE_REASONS: Reason[] = [
  { id: "reporting", text: "External reporting requirements (CSRD/ESRS, the EU Energy Efficiency Directive) are rising and will demand credible figures regardless of internal readiness." },
  { id: "budget", text: "Budget is limited, so whichever KPIs get funded first must be the ones that actually change a decision — not just the easiest to produce." },
  { id: "credibility", text: "IT already runs real Green IT measures with no way to prove their effect — a credibility problem with management." },
  { id: "alignment", text: "IT, sustainability, controlling and management all want different things from the same data, and without one system they will keep pulling in different directions." },
];

export const RELEVANCE_PICK_COUNT = 2;

export const RELEVANCE_JUSTIFICATION_FIELD = {
  label: "One-line justification",
  instruction: "One sentence — what changes if this is ignored?",
  placeholder: "e.g. Without a coordinated system, Verdeon keeps producing numbers that satisfy no one's actual decision.",
} as const;

// ---------------------------------------------------------------------------
// Stage B — Three guiding decisions
// ---------------------------------------------------------------------------

export type GuidingDecision = { id: string; text: string };

export const GUIDING_DECISIONS: GuidingDecision[] = [
  { id: "g1", text: "Fund a full carbon monitoring build now, including Scope 3." },
  { id: "g2", text: "Mandate one KPI owner per metric, no exceptions." },
  { id: "g3", text: "Delay external reporting until the underlying data is clean." },
  { id: "g4", text: "Cap the KPI set at 5–7 management metrics." },
  { id: "g5", text: "Outsource the carbon baseline to a consultant." },
  { id: "g6", text: "Stand up a recurring management review before adding any new metric." },
  { id: "g7", text: "Freeze all new Green IT initiatives until the metric system is built." },
  { id: "g8", text: "Let each department define its own metrics for now, and harmonise later." },
];

export const GUIDING_PICK_COUNT = 3;

export const GUIDING_JUSTIFICATION_FIELD = {
  label: "Justification",
  instruction: "Why this, for the next 12 months specifically.",
  placeholder: "e.g. This buys credibility fast without committing the full carbon-monitoring budget before governance exists.",
} as const;

// ---------------------------------------------------------------------------
// Stage C — Build sequence + first move
// ---------------------------------------------------------------------------

export type LayerId = "shortTerm" | "mediumTerm" | "structural";

export type Layer = { id: LayerId; name: string; description: string };

export const LAYERS: Layer[] = [
  { id: "shortTerm", name: "Short-term", description: "Pick core KPIs, define a pragmatic carbon baseline, assign owners." },
  { id: "mediumTerm", name: "Medium-term", description: "A proper dashboard, review cycles, richer emissions data." },
  { id: "structural", name: "Structural", description: "KPIs and carbon monitoring embedded permanently in governance and management reviews." },
];

export const layerById = (id: LayerId): Layer => LAYERS.find((l) => l.id === id)!;

/** Staffing/funding order: 1 = do first. The canonical, defensible order per D2. */
export const CANONICAL_ORDER: Record<LayerId, number> = { shortTerm: 1, mediumTerm: 2, structural: 3 };

export const SEQUENCE_POSITIONS = [1, 2, 3] as const;
export type SequencePosition = (typeof SEQUENCE_POSITIONS)[number];

export const SEQUENCE_CLUE: ClueTier = {
  soft: "Re-read D2's staging pattern — what does a later stage depend on that only an earlier one produces?",
  sharp: "Structural anchoring governs something. Medium-term build-out needs data to build on. If either sits ahead of Short-term in your order, it has nothing yet to work with.",
};

export const FIRST_MOVE_FIELD = {
  label: "Concrete first move for the short-term stage",
  instruction: "One specific action, not a restatement of the stage description.",
  placeholder: "e.g. Publish a five-KPI starter set with a named owner for each, within four weeks.",
  material: ["layeredModel"] as MaterialSectionId[],
} as const;

export const SEQUENCE_INSTRUCTION =
  "Drag the three stages into the order you'd actually staff and fund them — position 1 first. Check-on-request gives a clue if your order contradicts D2's staging logic, never the order itself.";

// ---------------------------------------------------------------------------
// Stage D — Trade-off allocation
// ---------------------------------------------------------------------------

export type FactorId = "accuracy" | "effort" | "comparability" | "externalCommunication" | "operationalUsability";

export type Factor = { id: FactorId; name: string; short: string; definition: string };

export const FACTORS: Factor[] = [
  { id: "accuracy", name: "Accuracy", short: "Accuracy", definition: "How closely the figure reflects reality." },
  { id: "effort", name: "Effort", short: "Effort", definition: "How much work it takes to produce and maintain — lower is better here, but the allocation is about priority given to keeping effort low." },
  { id: "comparability", name: "Comparability", short: "Comparable", definition: "Whether the figure can be compared across sites, teams or time." },
  { id: "externalCommunication", name: "External communication", short: "External", definition: "Whether the figure survives external disclosure and audit." },
  { id: "operationalUsability", name: "Operational usability", short: "Usability", definition: "Whether operations can actually act on it day to day." },
];

export const factorById = (id: FactorId): Factor => FACTORS.find((f) => f.id === id)!;

export const ALLOCATION_TOTAL = 100;

export const ALLOCATOR_INSTRUCTION =
  "Allocate 100 points across the five factors from D3 — real trade-offs, not five maximums. The live memo shows the resulting priority order.";

// ---------------------------------------------------------------------------
// Stage E — Governance & the call now
// ---------------------------------------------------------------------------

export type ResponsibilityId = "kpiOwnership" | "dataCollection" | "reviewReadjustment" | "externalSignOff";

export type Responsibility = { id: ResponsibilityId; name: string; expected: RoleId; clue: ClueTier };

export const RESPONSIBILITIES: Responsibility[] = [
  {
    id: "kpiOwnership",
    name: "KPI ownership",
    expected: "cio",
    clue: {
      soft: "Which role's mandate (D4) is about being able to steer the organisation's decisions with these numbers?",
      sharp: "Owning a KPI system end-to-end is a steering-capability responsibility. Match it to the role whose mandate is exactly that.",
    },
  },
  {
    id: "dataCollection",
    name: "Data collection",
    expected: "controlling",
    clue: {
      soft: "Which role already runs the organisation's data and cost-discipline processes day to day?",
      sharp: "Consistent data collection is an operational, cost-and-risk discipline — that is Controlling's mandate, not a steering or credibility one.",
    },
  },
  {
    id: "reviewReadjustment",
    name: "Review & readjustment",
    expected: "cio",
    clue: {
      soft: "Review and readjustment changes what gets steered next. Which role's mandate is steering capability?",
      sharp: "A recurring review that readjusts targets is a steering mechanism (D1, D2) — the CIO's mandate, alongside KPI ownership.",
    },
  },
  {
    id: "externalSignOff",
    name: "External reporting sign-off",
    expected: "sustainability",
    clue: {
      soft: "Sign-off on what goes external is about whether the figures hold up to outside scrutiny. Whose mandate is that, by name?",
      sharp: "\"Will this hold up to scrutiny\" is the Head of Sustainability's mandate verbatim (D4) — external sign-off belongs there.",
    },
  },
];

export const responsibilityById = (id: ResponsibilityId): Responsibility => RESPONSIBILITIES.find((r) => r.id === id)!;

export const GOVERNANCE_INSTRUCTION =
  "Drag each responsibility onto the role that should hold it. Not every role needs one — some bring independent challenge rather than day-to-day ownership (D4).";

export const NOW_DECISION_FIELD = {
  label: "The one decision you'd take now, despite incomplete data",
  instruction: "Name it specifically — not \"build a metric system\", but the one call that can't wait.",
  placeholder: "e.g. Approve the five-KPI starter set this month, before the carbon baseline is finished.",
} as const;

export const RISK_OF_WAITING_FIELD = {
  label: "One risk of waiting for perfect data instead",
  instruction: "Name what concretely gets worse the longer Verdeon waits.",
  placeholder: "e.g. External reporting deadlines arrive with still no credible figure to report.",
} as const;

// ---------------------------------------------------------------------------
// Task framing
// ---------------------------------------------------------------------------

export const TASK_FRAMING = {
  tag: "THE TASK",
  title: "Management proposal for Verdeon Digital Governance Group",
  minutes: 20,
  lead:
    "You are advising Verdeon Digital Governance Group as head of IT governance/CIO, sustainability, or controlling. Green IT measures already exist, but there's no consistent KPI system, no practicable carbon logic, no effective review process, and no clear ownership.",
  instruction:
    "IT, sustainability, controlling, finance, and management all want different things; the data is incomplete and uneven; budget is limited but management wants visible, credible progress; external reporting requirements are rising; and there's a real risk the system becomes too complex to run. Recommend a decision-ready management proposal — not a list of metrics, but a decision architecture — despite the incomplete picture.",
} as const;

export const CONTEXT_CHIPS: string[] = [
  "No consistent KPI system",
  "No practicable carbon logic",
  "No effective review process",
  "No clear ownership",
  "Rising external reporting requirements",
  "Real risk of over-complexity",
];

export const CHECK_LABELS = {
  check: "Check",
  recheck: "Check again",
  holds: "This holds up.",
  wrongTier1: "Not quite — here is a first clue.",
  wrongTier2: "Still not quite — a sharper clue, since you've checked this before.",
} as const;

// ---------------------------------------------------------------------------
// Mentor sample + answer key
// ---------------------------------------------------------------------------

export const SAMPLE_ROLE: RoleId = "cio";
export const SAMPLE_REASONS: string[] = ["budget", "alignment"];
export const SAMPLE_RELEVANCE_JUSTIFICATION =
  "Without one coordinated system, every euro spent on metrics satisfies one stakeholder's view and irritates the other three — the framework has to come before any single KPI does.";

export const SAMPLE_GUIDING: string[] = ["g4", "g6", "g2"];
export const SAMPLE_GUIDING_JUSTIFICATIONS: Record<string, string> = {
  g4: "A capped set of 5–7 metrics is buildable within the current budget and stays legible to every department, rather than sprawling into a system nobody reads.",
  g6: "A recurring review before new metrics is what stops this repeating Route 1's diagnosis — data with no decision attached to it.",
  g2: "One owner per metric is the cheapest structural fix available and prevents the 'no one owns the CO2 figure' failure from recurring at Verdeon.",
};

export const SAMPLE_SEQUENCE: Record<LayerId, SequencePosition> = { shortTerm: 1, mediumTerm: 2, structural: 3 };
export const SAMPLE_FIRST_MOVE = "Publish a five-KPI starter set with a named owner for each, within four weeks, before any dashboard tooling is commissioned.";

export const SAMPLE_ALLOCATION: Record<FactorId, number> = {
  accuracy: 15,
  effort: 15,
  comparability: 25,
  externalCommunication: 20,
  operationalUsability: 25,
};

export const SAMPLE_RESPONSIBILITY_ROLE: Record<ResponsibilityId, RoleId> = {
  kpiOwnership: "cio",
  dataCollection: "controlling",
  reviewReadjustment: "cio",
  externalSignOff: "sustainability",
};
export const SAMPLE_NOW_DECISION =
  "Approve the five-KPI starter set and name its owners this month, before the carbon baseline is finished.";
export const SAMPLE_RISK_OF_WAITING =
  "External reporting deadlines (CSRD/ESRS) arrive with still no credible figure to report, forcing a rushed, low-quality disclosure instead of a governed one.";

export const ANSWER_KEY: AnswerKeyBlock = {
  prompt: "The Verdeon management proposal — overall shape",
  items: [
    {
      option: "Cap the KPI set (g4) + recurring review before new metrics (g6) + one owner per metric (g2) — the recommended combination",
      verdict: "pick",
      why: "Together these three build exactly D2's short-term footing — a lean, owned, reviewed starter set — without committing the full carbon-monitoring or dashboard budget before governance exists to use it.",
    },
    {
      option: "Fund a full carbon monitoring build now, including Scope 3 (g1)",
      verdict: "avoid",
      why: "A full Scope 1/2/3 build is exactly D2's 'structural before short-term footing' trap — expensive, slow, and easy to leave ungoverned once built, same risk Route 1's Line B carries.",
    },
    {
      option: "Freeze all new Green IT initiatives until the metric system is built (g7)",
      verdict: "avoid",
      why: "This is the 'wait for perfect data' failure from D1/D2 at governance scale — it removes visible progress entirely rather than staging it, and management explicitly wants visible, credible progress now.",
    },
  ],
  teachingNote:
    "The build sequence (Short-term → Medium-term → Structural) is the one place this task has a single defensible answer, because it follows directly from D2's dependency logic. Everything else — the role lens, which two reasons, which three guiding decisions, the five-factor allocation — is a genuinely open strategic judgement, and a defensible case for a different combination (e.g. g1 instead of g2, argued from the Head of Sustainability's credibility mandate) should be graded on its own reasoning, not marked down for disagreeing with this key.",
};

/** Material this task draws on, for MaterialRefs chips. */
export const TASK_MATERIAL_REFS: MaterialSectionId[] = ["leadershipInstrument", "layeredModel", "tradeoffPentagon", "rolePriorities"];
