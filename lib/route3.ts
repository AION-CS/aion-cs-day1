/**
 * Route 3 — Management Decision. All learner-facing copy and pure data live
 * here so components stay presentational. Two cases in one progressive
 * flow: SkyBridge Solutions GmbH (diagnostic, Stages 1-4) bridges into
 * Helix Digital Platforms (executive proposal, Stage 6).
 */

import type { IconKey } from "@/lib/routes";

export const LEARNER_NAME_KEY = "learner:name";

// ---------------------------------------------------------------------------
// Store key map
// ---------------------------------------------------------------------------
export const R3 = {
  name: LEARNER_NAME_KEY,
  s2: { node: (itemId: string) => `r3:s2:node:${itemId}` },
  s3: {
    selected: (leverId: string) => `r3:s3:sel:${leverId}`,
    reason: (leverId: string) => `r3:s3:reason:${leverId}`,
  },
  s4: {
    horizon: (leverId: string) => `r3:s4:horizon:${leverId}`,
    firstMove: "r3:s4:firstmove",
    firstMoveJustify: "r3:s4:firstmove:justify",
  },
  s5: { gutcheck: (i: number) => `r3:s5:gutcheck:${i}` },
  s6: {
    strategicRelevance: "r3:s6:relevance",
    guidingDecision: (i: number) => `r3:s6:guiding:${i}`,
    prioritizationLogic: "r3:s6:logic",
    tradeoff: (i: number) => `r3:s6:tradeoff:${i}`,
    firstMeasure: "r3:s6:firstmeasure",
    firstMeasureJustify: "r3:s6:firstmeasure:justify",
    role: (roleId: string) => `r3:s6:role:${roleId}`,
    decideNow: "r3:s6:decidenow",
    waitingMeans: "r3:s6:waitingmeans",
  },
} as const;

// ---------------------------------------------------------------------------
// Case brief — SkyBridge Solutions GmbH (diagnostic)
// ---------------------------------------------------------------------------
export const SKYBRIDGE = {
  company: "SkyBridge Solutions GmbH",
  setup:
    "SkyBridge Solutions GmbH is a growing service company with 1,000 employees. Over the past two years, numerous applications and data holdings have been moved to various cloud environments. Management regards the cloud as a central lever for modernisation, flexibility and sustainability. At the same time, cloud costs are rising significantly, resource use is only partly transparent, and the number of unused or oversized workloads is growing.",
  role: "Your role: strategic infrastructure advisor. Diagnose the situation before recommending anything.",
} as const;

// ---------------------------------------------------------------------------
// Stage 2 — Decision Architecture Model (reusable, functional component)
// ---------------------------------------------------------------------------
export type NodeId = "usage-demand" | "governance" | "architecture" | "economics" | "sustainability-impact";

export type DecisionNode = { id: NodeId; label: string; folds: string };

export const DECISION_NODES: DecisionNode[] = [
  { id: "usage-demand", label: "Usage & Demand", folds: "folds in energy demand" },
  { id: "governance", label: "Governance", folds: "folds in controllability" },
  { id: "architecture", label: "Architecture", folds: "on-prem/cloud structure, parallel systems" },
  { id: "economics", label: "Economics", folds: "folds in cost" },
  { id: "sustainability-impact", label: "Sustainability Impact", folds: "the realistic environmental outcome" },
];

export type EvidenceItem = { id: string; text: string; correctNode: NodeId; clue: string };

export const SKYBRIDGE_EVIDENCE: EvidenceItem[] = [
  {
    id: "sb-independent",
    text: "Several departments use cloud services independently without uniform standards.",
    correctNode: "governance",
    clue: "\"No uniform standards\" — is that about how much is being used, or about who's setting the rules?",
  },
  {
    id: "sb-partial-dismantle",
    text: "The internal infrastructure has been dismantled only in part.",
    correctNode: "architecture",
    clue: "A half-dismantled infrastructure — is that a demand pattern, or a statement about how the system is structured?",
  },
  {
    id: "sb-parallel",
    text: "Parallel structures exist between on-premises and cloud.",
    correctNode: "architecture",
    clue: "Running two infrastructures side by side — which of the five components is directly about how the system is built?",
  },
  {
    id: "sb-storage-growth",
    text: "Storage and data volumes are growing strongly.",
    correctNode: "usage-demand",
    clue: "Growing storage and data volumes — which component tracks how much is actually being consumed?",
  },
  {
    id: "sb-no-visibility",
    text: "There is no clear view of energy-intensive workloads and their actual use.",
    correctNode: "usage-demand",
    clue: "\"Actual use\" of energy-intensive workloads is literally what this component is built to track.",
  },
  {
    id: "sb-mandate",
    text: "Management expects a recommendation on how cloud use can be developed further in an economical, manageable, and sustainable way.",
    correctNode: "economics",
    clue: "Three words are packed into this one — \"economical,\" \"manageable,\" \"sustainable.\" Which of the five components does the first of those three map onto?",
  },
];

// ---------------------------------------------------------------------------
// Stage 3 — 8 candidate levers, pick exactly 4
// ---------------------------------------------------------------------------
export type HorizonId = "short" | "medium" | "structural";

export const HORIZONS: { id: HorizonId; label: string }[] = [
  { id: "short", label: "Short-Term" },
  { id: "medium", label: "Medium-Term" },
  { id: "structural", label: "Structural" },
];

export type Lever = {
  id: string;
  text: string;
  isModelPick: boolean;
  pickClue: string;
  typicalHorizon: HorizonId;
  horizonClue: string;
};

export const LEVERS: Lever[] = [
  {
    id: "lever-dashboard",
    text: "Build a usage and cost transparency dashboard across all workloads.",
    isModelPick: true,
    pickClue: "Re-read the case — is there currently any clear view of usage at all? What has to exist before anything else can be prioritised well?",
    typicalHorizon: "short",
    horizonClue: "Building a dashboard mostly needs data that already exists and some tooling — is that a multi-year rebuild, or achievable soon?",
  },
  {
    id: "lever-accelerate-migration",
    text: "Accelerate the remaining on-premises-to-cloud migration.",
    isModelPick: false,
    pickClue: "Re-read Route 2's Block 4 — does accelerating scale help before governance exists underneath it, or does it risk compounding the same problem?",
    typicalHorizon: "structural",
    horizonClue: "Accelerating a full migration is a large, multi-quarter commitment — where does that sit on the horizon scale?",
  },
  {
    id: "lever-decommission",
    text: "Clean up parallel on-premises/cloud structures and decommission redundant systems.",
    isModelPick: true,
    pickClue: "The case explicitly names parallel structures as a symptom — which lever addresses that root architecture issue directly?",
    typicalHorizon: "structural",
    horizonClue: "Decommissioning entire parallel infrastructures usually spans many quarters — a short win, or a structural undertaking?",
  },
  {
    id: "lever-standards",
    text: "Introduce mandatory sizing and provisioning standards for all departments.",
    isModelPick: true,
    pickClue: "Departments currently order independently with no uniform standards — which lever closes that specific gap?",
    typicalHorizon: "medium",
    horizonClue: "Rolling out new mandatory standards across departments needs buy-in and change management — faster than a structural rebuild, slower than flipping on a dashboard.",
  },
  {
    id: "lever-vendor-discount",
    text: "Negotiate a bulk discount with the primary cloud vendor.",
    isModelPick: false,
    pickClue: "A discount lowers the price per unit — does it fix the underlying visibility or standards problem the case describes?",
    typicalHorizon: "short",
    horizonClue: "Negotiating a discount is usually a fast, one-time commercial action.",
  },
  {
    id: "lever-monitoring",
    text: "Establish energy/workload monitoring for high-intensity systems.",
    isModelPick: true,
    pickClue: "The case explicitly says there's no clear view of energy-intensive workloads — which lever closes that specific gap?",
    typicalHorizon: "short",
    horizonClue: "Instrumenting monitoring on already-identified high-intensity systems is usually one of the faster no-regret moves.",
  },
  {
    id: "lever-marketing",
    text: "Launch an internal sustainability marketing campaign.",
    isModelPick: false,
    pickClue: "Re-read Route 1's Block 3 and Route 2's Block 5 — does communicating a success change the underlying numbers?",
    typicalHorizon: "short",
    horizonClue: "A campaign can be launched quickly — but is \"fast\" the same as \"structurally sound\"?",
  },
  {
    id: "lever-budget-cap",
    text: "Set a fixed cloud budget cap per department.",
    isModelPick: false,
    pickClue: "A cap limits spend, but without visibility into what's actually driving it — does it fix the cause, or just its symptom?",
    typicalHorizon: "medium",
    horizonClue: "Setting and enforcing a budget cap across departments takes some rollout time, but isn't a multi-year structural change.",
  },
];

export const LEVERS_REQUIRED_COUNT = 4;
export const LEVER_REASON_MIN_WORDS = 10;

// ---------------------------------------------------------------------------
// Stage 5 — bridge (narrative + optional gut-check, not required to proceed)
// ---------------------------------------------------------------------------
export const GUTCHECK_PROMPTS: { id: string; question: string }[] = [
  { id: "attractive-but-weak", question: "Which decision would be attractive in the short term, but too weak strategically?" },
  { id: "quick-solution", question: "Where might the cloud be seen as a quick solution without properly assessing the long-term effects?" },
];

// ---------------------------------------------------------------------------
// Stage 6 — Helix Digital Platforms (executive proposal)
// ---------------------------------------------------------------------------
export const HELIX = {
  company: "Helix Digital Platforms",
  conditions: [
    "A strongly growing cloud share alongside existing on-premises structures.",
    "Differing interests of departments, IT, finance, and management.",
    "A strong desire for flexibility and rapid provisioning.",
    "Incomplete transparency on workloads, storage, energy demand, and total costs.",
    "Budget restrictions and the expectation of visible progress.",
    "The risk that the cloud is overstated as an automatically sustainable solution.",
  ],
} as const;

export const PROPOSAL_ROLES: { id: string; label: string }[] = [
  { id: "board", label: "Board / Executive Committee" },
  { id: "cio", label: "CIO / Strategy Advisor" },
  { id: "ops", label: "IT Operations & Finance" },
];

export const TRADEOFF_COUNT = 1;
export const GUIDING_DECISION_COUNT = 2;

// ---------------------------------------------------------------------------
// Material — 5 blocks (C1-C5)
// ---------------------------------------------------------------------------
export type MaterialSectionId = "shift" | "architecture-model" | "iceberg" | "horizons" | "proposal-structure";

export type MaterialSection = {
  id: MaterialSectionId;
  n: 1 | 2 | 3 | 4 | 5;
  icon: IconKey;
  kicker: string;
  title: string;
  definition: string;
  insight: string;
  takeaway: string;
  callout: { label: string; text: string };
};

export const MATERIAL: MaterialSection[] = [
  {
    id: "shift",
    n: 1,
    icon: "shield",
    kicker: "1 · The shift this route makes",
    title: "From Analyst to Decision-Maker",
    definition:
      "Route 1 taught the concepts. Route 2 scored and prioritised a single line of action. Route 3 is a different kind of work: cloud use is no longer a technical or outsourcing question, but a management decision that touches architecture, cost, energy demand, controllability, dependencies, resilience, and sustainability all at once.",
    insight:
      "MIT Sloan's Center for Information Systems Research (CISR) has published research since the early 2010s arguing that digital and cloud governance decisions are increasingly board-level and executive-committee matters, not delegated IT decisions — because the trade-offs (cost, risk, speed, control) now carry enough weight to shape overall company strategy, not just system architecture.",
    takeaway:
      "Every question in this route should be answered the way a management team actually decides things: under a budget constraint, under incomplete data, and with an eye on who is accountable if it goes wrong — not just what is technically correct.",
    callout: {
      label: "Verify before you cite it",
      text: "MIT CISR and Gartner publish updated governance research regularly — if you reference a specific study or statistic from them in a real proposal, check their current publication rather than reusing a remembered claim.",
    },
  },
  {
    id: "architecture-model",
    n: 2,
    icon: "layers",
    kicker: "2 · The model this whole route runs on",
    title: "The Decision Architecture Model",
    definition:
      "Five components feed one Management Decision: Usage & Demand (what's actually running and how much — this folds in Route 1's energy demand), Governance (policy, standards, oversight — this folds in Route 1's controllability), Architecture (how the system is structurally built — on-premises, cloud, or both), Economics (cost relative to benefit — this folds in Route 2's cost dimension), and Sustainability Impact (the realistic environmental outcome, as distinct from the sustainability claim).",
    insight:
      "This is a deliberate simplification that unifies terms from across the whole course into one consistent model, so every stage of this route can refer back to the same five components instead of juggling route-specific vocabulary. It is not a new set of concepts — it's the same ideas from Routes 1 and 2, organised for management-level decision-making.",
    takeaway:
      "You'll use this exact model, interactively, in Stage 2 — mapping SkyBridge's own evidence onto these five components before recommending anything.",
    callout: {
      label: "This is the anchor for the whole route",
      text: "Every later stage refers back to these five components. If a stage asks you to name a trade-off or a lever, it's implicitly asking which of these five it touches.",
    },
  },
  {
    id: "iceberg",
    n: 3,
    icon: "target",
    kicker: "3 · Root cause vs. surface symptom",
    title: "Levers vs. Symptoms",
    definition:
      "A symptom is what's visible above the waterline — rising cost, growing storage, a slow application. A lever is what's below it — a governance gap, an architectural debt, a missing monitoring capability. Simple root-cause logic: fixing a symptom directly (e.g. cutting a budget line) rarely fixes what's producing it; a lever addresses the underlying cause the symptom keeps coming back from.",
    insight:
      "A recommendation aimed only at symptoms needs to be repeated every cycle, because nothing about the underlying cause changed. A recommendation aimed at a lever changes what produces the symptom, so the same problem doesn't need solving again next quarter.",
    takeaway:
      "In Stage 3, you'll be offered several candidate actions — some are levers, some are symptom-level distractors dressed up as solutions. Telling them apart is the actual skill being tested.",
    callout: {
      label: "A test you can apply anywhere",
      text: "Ask of any proposed action: \"if we do only this, does the underlying cause still exist next quarter?\" If yes, it's a symptom fix, not a lever.",
    },
  },
  {
    id: "horizons",
    n: 4,
    icon: "coins",
    kicker: "4 · Sequencing matters as much as choice",
    title: "Horizons of Action: Short / Medium / Structural",
    definition:
      "Classify any action by how long it realistically takes to deliver: Short-Term (weeks, using data and capability that already exist), Medium-Term (a quarter or two, needing coordination or buy-in across teams), or Structural (multiple quarters to years, a fundamental change to architecture or operating model).",
    insight:
      "Choosing the right first move is a strategic decision on its own, independent of which lever is objectively \"biggest\": a well-chosen Short-Term move builds credibility and often produces the data a later Structural move needs to be justified — while starting with an ambitious Structural commitment before any visibility exists repeats the exact mistake Route 2's Block 5 warned about.",
    takeaway:
      "You'll build a real roadmap in Stage 4 — placing your chosen levers onto these three horizons, and naming exactly one as the first move.",
    callout: {
      label: "First move ≠ biggest move",
      text: "The first move on a credible roadmap is usually the one that de-risks or informs the moves after it — not the one with the largest headline impact.",
    },
  },
  {
    id: "proposal-structure",
    n: 5,
    icon: "gavel",
    kicker: "5 · What a board actually needs",
    title: "Building a Decision-Ready Proposal",
    definition:
      "A credible executive proposal has a specific shape: (1) strategic relevance — why this matters now, (2) guiding decisions for the next planning cycle, (3) the decision logic used to prioritise, (4) the central trade-offs being consciously accepted, (5) the first prioritised line of measures with justification, (6) roles, responsibilities, and review mechanisms, and (7) the decision that must be made now despite incomplete information.",
    insight:
      "Each of these seven elements answers an objection before it's raised: (1) answers \"why should we spend time on this,\" (6) answers \"who do we hold accountable,\" (7) answers \"why not just wait for better data.\" A proposal missing any of the seven leaves that objection for someone in the room to raise live.",
    takeaway:
      "This is the exact scaffold you'll fill in for Helix Digital Platforms in Stage 6 — not a new framework, but the assembly of everything from Routes 1-3 into one board-ready document.",
    callout: {
      label: "Direct use in Task 3",
      text: "Stage 6 gives you a sentence-starter for each of these seven elements. Treat this block as the answer key for what each one is actually asking.",
    },
  },
];

// ---------------------------------------------------------------------------
// Task 3 — copy
// ---------------------------------------------------------------------------
export const TASK3 = {
  kicker: "Task 3",
  heading: "SkyBridge Diagnostic → Helix Executive Proposal",
  intro:
    "A capstone task in two parts: first diagnose SkyBridge Solutions, then step into the advisor role for Helix Digital Platforms. Work through the seven stages below — nothing is locked.",
  orderBanner: "Suggested order: Stage 1 → 7. You can work in any order — the report at the end fills in as you go.",
  stage1: { heading: "Stage 1 — SkyBridge Briefing", instructions: "Read the case and click each of the six evidence cards to expand it." },
  stage2: {
    heading: "Stage 2 — Map to the Decision Architecture",
    instructions: "Drag each evidence card onto the one Decision Architecture component it fits best. Use the clue if you're unsure; undo/redo freely.",
  },
  stage3: {
    heading: "Stage 3 — Find the 4 Levers",
    instructions: `Select exactly ${LEVERS_REQUIRED_COUNT} of the candidate actions below — the ones you judge as real root-cause levers, not symptom-level fixes — and justify each briefly.`,
  },
  stage4: {
    heading: "Stage 4 — Recommend & Sequence",
    instructions: "Drag your four chosen levers onto Short-Term, Medium-Term, or Structural. Then mark exactly one as your first move and justify why it goes first.",
  },
  stage5: {
    heading: "Stage 5 — Bridge to Helix",
    instructions: "You've just diagnosed SkyBridge. Now you'll advise Helix Digital Platforms — a company facing the same tensions, at a higher and more strategic level.",
    gutcheckIntro: "Optional gut-check — not required to continue:",
  },
  stage6: {
    heading: "Stage 6 — Build the Executive Proposal",
    instructions: "Seven sections, the same structure from Block 5 of the material. Complete each one for Helix.",
    s1Starter: "Sustainable cloud use matters strategically for Helix because",
    s3Starter: "Future cloud measures should be assessed and prioritized by",
    s7DecideStarter: "Even without complete data, Helix must decide now to",
    s7WaitStarter: "because waiting would mean",
  },
  stage7: {
    heading: "Stage 7 — Live Report & Export",
    instructions: "A read-only recap of everything above, and the management proposal it produces — ready to export once every stage is complete.",
  },
  export: {
    filenameLevel: 3,
    filenameTask: 1,
    taskLabel: "Management Proposal",
    docHeading: "Management Proposal — Helix Digital Platforms",
  },
} as const;
