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

export type Role = {
  id: RoleId;
  name: string;
  short: string;
  icon: IconKey;
  mandate: string;
  /** What the role does, in one sentence. */
  means: string;
  /** When to hand it a responsibility. */
  useWhen: string;
  /** The question this role brings to any figure. */
  asks: string;
  watchOut: string;
};

export const ROLES: Role[] = [
  {
    id: "cio",
    name: "CIO / Head of IT Governance",
    short: "CIO",
    icon: "compass",
    mandate: "Steering capability — can this actually run the organisation's decisions?",
    means: "Owns the system that turns figures into decisions: KPI definitions, the review process and the tooling.",
    useWhen: "The responsibility is about steering — who defines and answers for a KPI, and who acts on a review.",
    asks: "Will a manager be able to act on this next month?",
    watchOut: "Can over-build tooling and under-invest in credibility.",
  },
  {
    id: "sustainability",
    name: "Head of Sustainability",
    short: "Sustainability",
    icon: "recycleLoop",
    mandate: "Credibility — will this hold up to scrutiny?",
    means: "Answers for what the organisation says externally about its footprint and targets.",
    useWhen: "The responsibility is about external disclosure or assurance — what may be published or claimed.",
    asks: "Would this stand up to an auditor or a critical reader?",
    watchOut: "Can push for reporting depth that operations cannot sustain.",
  },
  {
    id: "controlling",
    name: "Controlling Lead",
    short: "Controlling",
    icon: "coins",
    mandate: "Cost and risk control — the routine processes that collect, reconcile and release figures.",
    means: "Runs the routine processes that collect, reconcile and release figures, and watches cost and risk.",
    useWhen: "The responsibility is routine and process-based — collecting, reconciling and releasing figures to schedule.",
    asks: "Is this reliable, repeatable and affordable to run every month?",
    watchOut: "Can favour what is cheap to collect over what is informative.",
  },
  {
    id: "consultant",
    name: "External Consultant",
    short: "Consultant",
    icon: "certificate",
    mandate: "Structural robustness, independent of any one person's judgement.",
    means: "Brings independent challenge: tests whether the design would still work if the people changed.",
    useWhen: "The responsibility is about challenge or design review, not day-to-day ownership.",
    asks: "Would this still hold if the current owner left?",
    watchOut: "Has no day-to-day ownership — do not hand them a routine.",
  },
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

export type GuidingDecision = {
  id: string;
  text: string;
  /** What it involves. */
  means: string;
  /** When it fits. */
  useWhen: string;
  /** What it leaves open or costs. */
  watchOut: string;
};

export const GUIDING_DECISIONS: GuidingDecision[] = [
  {
    id: "g1",
    text: "Fund a full carbon monitoring build now, including Scope 3.",
    means: "Commission the baseline, the emissions logic and the allocation of Scope 1/2/3 sources as one funded project.",
    useWhen: "There is budget, named owners for the source data, and a review that will use the result.",
    watchOut: "Slow to show a result, and easy to leave unreviewed once built.",
  },
  {
    id: "g2",
    text: "Mandate one KPI owner per metric, no exceptions.",
    means: "Every management metric gets one named person who answers for it.",
    useWhen: "Figures exist but nobody answers for them.",
    watchOut: "A rigid “no exceptions” rule can stall metrics that genuinely span teams — allow a named lead.",
  },
  {
    id: "g3",
    text: "Delay external reporting until the underlying data is clean.",
    means: "Hold back external disclosure until data quality has been fixed.",
    useWhen: "Publishing now would state figures the organisation knows are unreliable.",
    watchOut: "Reporting deadlines do not move; delay can cost more credibility than an honest, flagged first report.",
  },
  {
    id: "g4",
    text: "Cap the KPI set at 5–7 management metrics.",
    means: "Limit the metrics leadership steers by to a small, defined set; the rest are monitored, not managed.",
    useWhen: "Too many figures compete for attention and none gets reviewed.",
    watchOut: "The cap only helps if the chosen few are the ones tied to decisions.",
  },
  {
    id: "g5",
    text: "Outsource the carbon baseline to a consultant.",
    means: "An external party builds the first emissions baseline.",
    useWhen: "Internal skills or time for the method are missing and a credible start is needed quickly.",
    watchOut: "The know-how leaves with the consultant unless someone inside owns the method afterwards.",
  },
  {
    id: "g6",
    text: "Stand up a recurring management review before adding any new metric.",
    means: "Fix a review cadence with a chair, working on the figures that already exist, before building anything new.",
    useWhen: "Data exists but does not steer anything.",
    watchOut: "Without a visible early output, the review can be dismissed as a meeting.",
  },
  {
    id: "g7",
    text: "Freeze all new Green IT initiatives until the metric system is built.",
    means: "Stop starting new measures until the system can track them.",
    useWhen: "Measures are multiplying faster than they can be governed.",
    watchOut: "It stops visible progress and can cost momentum and goodwill.",
  },
  {
    id: "g8",
    text: "Let each department define its own metrics for now, and harmonise later.",
    means: "Departments keep their own definitions; a common set follows later.",
    useWhen: "Speed matters and departments already have workable metrics.",
    watchOut: "Figures stay incomparable, and harmonising later means redoing history.",
  },
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

export type Layer = {
  id: LayerId;
  name: string;
  description: string;
  /** What this layer must be able to build on. */
  needs: string;
  /** What it leaves behind for the next layer. */
  gives: string;
  /** Layers that must come earlier for this one to have footing. */
  dependsOn: LayerId[];
};

export const LAYERS: Layer[] = [
  {
    id: "shortTerm",
    name: "Short-term",
    description: "Pick core KPIs, define a pragmatic carbon baseline, assign owners.",
    needs: "Nothing built yet — only a decision to start.",
    gives: "A core KPI list, a pragmatic baseline and named owners.",
    dependsOn: [],
  },
  {
    id: "mediumTerm",
    name: "Medium-term",
    description: "A proper dashboard, review cycles, richer emissions data.",
    needs: "The KPI list and the baseline from the short-term stage.",
    gives: "A working dashboard, review cycles and richer emissions data.",
    dependsOn: ["shortTerm"],
  },
  {
    id: "structural",
    name: "Structural",
    description: "KPIs and carbon monitoring embedded permanently in governance and management reviews.",
    needs: "Owners, a baseline, and working dashboards and review cycles to embed.",
    gives: "KPIs and carbon monitoring anchored in governance and management reviews.",
    dependsOn: ["shortTerm", "mediumTerm"],
  },
];

/** Why a layer depends on an earlier one — shown when the order breaks it. */
export const DEPENDENCY_NOTE: Record<LayerId, Partial<Record<LayerId, string>>> = {
  shortTerm: {},
  mediumTerm: { shortTerm: "A dashboard built before the KPI list and baseline exist has nothing agreed to show." },
  structural: {
    shortTerm: "Without owners and a baseline, a management review has nothing to compare against.",
    mediumTerm: "Governance embeds what already runs; with no dashboard or review cycle yet, there is nothing to govern.",
  },
};

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
  { id: "effort", name: "Effort", short: "Effort", definition: "How much work it takes to produce and keep up. Giving effort priority means keeping that work low." },
  { id: "comparability", name: "Comparability", short: "Comparable", definition: "Whether the figure can be compared across sites, teams or time." },
  { id: "externalCommunication", name: "External communication", short: "External", definition: "Whether the figure survives external disclosure and audit." },
  { id: "operationalUsability", name: "Operational usability", short: "Usability", definition: "Whether operations can actually act on it day to day." },
];

export const factorById = (id: FactorId): Factor => FACTORS.find((f) => f.id === id)!;

export const ALLOCATION_TOTAL = 100;

/** Pairs that pull against each other (D3). A tension is live when both are given real weight. */
export const TENSIONS: { a: FactorId; b: FactorId; text: string }[] = [
  { a: "accuracy", b: "effort", text: "A more precise figure takes more work to produce and keep up — high accuracy and low effort do not sit together." },
  { a: "externalCommunication", b: "operationalUsability", text: "A figure built to survive an audit is not always the one operations can act on." },
  { a: "comparability", b: "operationalUsability", text: "One definition for every site helps comparison but may not fit how each site works." },
  { a: "externalCommunication", b: "effort", text: "Audit-ready evidence needs documentation, and that is ongoing work." },
];

/** What is put at risk when a factor is given little weight. */
export const RISK_WHEN_LOW: Record<FactorId, string> = {
  accuracy: "figures may be too rough to trust",
  effort: "the system may become too heavy to run",
  comparability: "sites' figures may not line up",
  externalCommunication: "disclosure may not survive an audit",
  operationalUsability: "operations may not act on the figures",
};

/** A factor counts as "given real weight" from this many points, and as "underweighted" at or below the low mark. */
export const HIGH_WEIGHT = 25;
export const LOW_WEIGHT = 15;

export type AllocationReading = {
  total: number;
  leaders: FactorId[];
  margin: number;
  why: string;
  tensions: { text: string; a: FactorId; b: FactorId }[];
  underweighted: FactorId[];
};

/** Derives every sentence the allocator and the D3 practice pentagon show from the points alone. */
export function readAllocation(points: Record<FactorId, number>): AllocationReading {
  const ids = FACTORS.map((f) => f.id);
  const total = ids.reduce((sum, id) => sum + points[id], 0);
  const sorted = [...ids].sort((x, y) => points[y] - points[x]);
  const top = points[sorted[0]];
  const leaders = sorted.filter((id) => points[id] === top);
  const second = sorted.find((id) => points[id] < top);
  const margin = second ? top - points[second] : 0;
  const nameOf = (id: FactorId) => FACTORS.find((f) => f.id === id)!.name;
  const why =
    top === 0
      ? "No points allocated yet."
      : leaders.length > 1
        ? `${leaders.map(nameOf).join(" and ")} are tied at ${top} points — this allocation cannot say which of them wins a real conflict. Moving even 5 points would.`
        : `${nameOf(leaders[0])} leads with ${top} points, ${margin} ahead of ${nameOf(second!)}${margin < 10 ? " — a narrow lead, so a real conflict could go either way" : " — a clear priority"}.`;
  const tensions = TENSIONS.filter((t) => points[t.a] >= HIGH_WEIGHT && points[t.b] >= HIGH_WEIGHT);
  const underweighted = sorted.filter((id) => points[id] <= LOW_WEIGHT).reverse();
  return { total, leaders, margin, why, tensions, underweighted };
}

export const ALLOCATOR_INSTRUCTION =
  "Allocate 100 points across the five factors from D3 — real trade-offs, not five maximums. Below the sliders, a live reading names the leader, the tensions you have created and what you left underweighted.";

// ---------------------------------------------------------------------------
// Stage E — Governance & the call now
// ---------------------------------------------------------------------------

export type ResponsibilityId = "kpiOwnership" | "dataCollection" | "reviewReadjustment" | "externalSignOff";

export type Responsibility = {
  id: ResponsibilityId;
  name: string;
  expected: RoleId;
  clue: ClueTier;
  /** What holding this responsibility involves. */
  means: string;
  /** One consequence sentence per role — what the assignment adds up to, never a verdict. */
  consequence: Record<RoleId, string>;
};

export const RESPONSIBILITIES: Responsibility[] = [
  {
    id: "kpiOwnership",
    name: "KPI ownership",
    expected: "cio",
    means: "Being the named person who defines a KPI, answers for its target and acts when it moves.",
    consequence: {
      cio: "The KPI sits with the role whose job is steering: it gets a target and a review, and someone is asked when it slips.",
      sustainability: "The KPI is defined for credibility rather than steering — defensible in a report, but harder to act on day to day.",
      controlling: "The KPI is defined around what is cheap and reliable to collect — steady numbers, but the decision link may be weak.",
      consultant: "Nobody inside is accountable, and the design depends on one outside person staying involved.",
    },
    clue: {
      soft: "Which role's mandate (D4) is about being able to steer the organisation's decisions with these numbers?",
      sharp: "Owning a KPI system end-to-end is a steering-capability responsibility. Match it to the role whose mandate is exactly that.",
    },
  },
  {
    id: "dataCollection",
    name: "Data collection",
    expected: "controlling",
    means: "Running the routine that captures, reconciles and releases the figures on schedule.",
    consequence: {
      cio: "The steering owner also runs the collection routine — a heavy load, and nobody independent checks the data.",
      sustainability: "Collection follows what would look good in disclosure, and can drift from what operations can sustain.",
      controlling: "Collection sits with the function that runs data and cost-discipline processes — repeatable, auditable and cheap to maintain.",
      consultant: "Routine collection depends on an outside party — costly, and it stops when the engagement does.",
    },
    clue: {
      soft: "Which role's mandate (D4) is about running the routine processes that collect and reconcile figures?",
      sharp: "Consistent data collection is an operational, cost-and-risk discipline — that is Controlling's mandate, not a steering or credibility one.",
    },
  },
  {
    id: "reviewReadjustment",
    name: "Review & readjustment",
    expected: "cio",
    means: "Chairing the recurring review that compares figures with targets and changes what is measured or done next.",
    consequence: {
      cio: "The review sits with the steering role: it is where a miss turns into an adjustment.",
      sustainability: "The review concentrates on how credible the figures are; adjusting operations may lack a decision-maker.",
      controlling: "The review turns into cost and variance control, and the sustainability question can drop out.",
      consultant: "The review depends on an outsider's calendar, and nobody with authority adjusts anything.",
    },
    clue: {
      soft: "Review and readjustment changes what gets steered next. Which role's mandate is steering capability?",
      sharp: "A recurring review that readjusts targets is a steering mechanism (D1, D2) — the CIO's mandate, alongside KPI ownership.",
    },
  },
  {
    id: "externalSignOff",
    name: "External reporting sign-off",
    expected: "sustainability",
    means: "Approving what leaves the organisation: the figures, claims and targets that are published or given to auditors.",
    consequence: {
      cio: "The steering owner also approves what is published — no independent check sits between the numbers and the claim.",
      sustainability: "Sign-off sits with the role whose mandate is whether it holds up to scrutiny.",
      controlling: "Sign-off is on cost and risk grounds: figures are checked for consistency, but not for how the claim reads.",
      consultant: "An outsider signs off claims for an organisation they do not run — authority and liability are unclear.",
    },
    clue: {
      soft: "Sign-off on what goes external is about whether the figures hold up to outside scrutiny. Whose mandate is that, by name?",
      sharp: "“Will this hold up to scrutiny” is the Head of Sustainability's mandate verbatim (D4) — external sign-off belongs there.",
    },
  },
];

export const responsibilityById = (id: ResponsibilityId): Responsibility => RESPONSIBILITIES.find((r) => r.id === id)!;

export const GOVERNANCE_INSTRUCTION =
  "Drag each responsibility onto the role that should hold it. Not every role needs one — some bring independent challenge rather than day-to-day ownership (D4). Under each placement, a consequence line says what that assignment adds up to.";

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
  instruction:
    "Five stages on one scroll: frame it, pick three guiding decisions, sequence the build, allocate priority across the five factors, then assign governance and make the call you would make now.",
} as const;

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
  g6: "A recurring review before new metrics is what stops the classic failure of data with no decision attached to it.",
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
      why: "A full Scope 1/2/3 build is exactly D2's 'structural before short-term footing' trap — expensive, slow, and easy to leave ungoverned once built, the same risk any stand-alone monitoring build carries.",
    },
    {
      option: "Freeze all new Green IT initiatives until the metric system is built (g7)",
      verdict: "avoid",
      why: "This is the 'wait for perfect data' failure from D1/D2 at governance scale — it removes visible progress entirely rather than staging it, and management explicitly wants visible, credible progress now.",
    },
  ],
  teachingNote:
    "Check rules: the sequence check judges only the dependency order (Short-term → Medium-term → Structural, from D2). The responsibility checks compare each placement with the role whose D4 mandate it serves — KPI ownership and review & readjustment → CIO, data collection → Controlling, external sign-off → Head of Sustainability — and a role holding nothing is not an error. The allocation and the guiding decisions have no check, only a live reading. The build sequence (Short-term → Medium-term → Structural) is the one place this task has a single defensible answer, because it follows directly from D2's dependency logic. Everything else — the role lens, which two reasons, which three guiding decisions, the five-factor allocation — is a genuinely open strategic judgement, and a defensible case for a different combination (e.g. g1 instead of g2, argued from the Head of Sustainability's credibility mandate) should be graded on its own reasoning, not marked down for disagreeing with this key.",
};

/** Material this task draws on, for MaterialRefs chips. */
export const TASK_MATERIAL_REFS: MaterialSectionId[] = ["leadershipInstrument", "layeredModel", "tradeoffPentagon", "rolePriorities"];

/** The question each factor makes a manager ask — used to describe a shift in thinking. */
export const FACTOR_QUESTION: Record<FactorId, string> = {
  accuracy: "how close to reality is it?",
  effort: "how cheap is it to keep up?",
  comparability: "does it line up across sites and years?",
  externalCommunication: "will it survive an audit?",
  operationalUsability: "can operations act on it?",
};

/** A written account of what moved between two allocations, and the shift in the question being asked. */
export function describeAllocationChange(prev: Record<FactorId, number>, next: Record<FactorId, number>): string {
  const moves = FACTORS.map((f) => ({ f, d: next[f.id] - prev[f.id] }))
    .filter((m) => m.d !== 0)
    .sort((a, b) => Math.abs(b.d) - Math.abs(a.d));
  if (moves.length === 0) return "Nothing moved.";
  const list = moves.map((m) => `${m.f.name} ${prev[m.f.id]} → ${next[m.f.id]} (${m.d > 0 ? "+" : "−"}${Math.abs(m.d)})`).join(", ");
  const before = readAllocation(prev);
  const after = readAllocation(next);
  const lead = (r: AllocationReading) => (r.leaders.length === 1 ? r.leaders[0] : null);
  const b = lead(before);
  const a = lead(after);
  const shift =
    a && a !== b
      ? ` The leading question changes to “${FACTOR_QUESTION[a]}”${b ? `, away from “${FACTOR_QUESTION[b]}”` : ""}.`
      : a
        ? ` The leading question stays “${FACTOR_QUESTION[a]}”.`
        : " No single factor leads now.";
  return `${list}.${shift}`;
}
