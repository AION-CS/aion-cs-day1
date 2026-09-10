/**
 * Route 1 — Knowledge. All learner-facing copy and pure data live here so
 * components stay presentational. Case used throughout Task 1: Flexora
 * Digital Services (fictional).
 */

import type { IconKey } from "@/lib/routes";

export const LEARNER_NAME_KEY = "learner:name";

// ---------------------------------------------------------------------------
// Store key map — every key this route writes to the shared progress store.
// ---------------------------------------------------------------------------
export const R1 = {
  name: LEARNER_NAME_KEY,
  stage2: {
    verdict: (itemId: string) => `r1:s2:verdict:${itemId}`,
  },
  stage3: {
    dimension: (itemId: string) => `r1:s3:dim:${itemId}`,
  },
  stage4: {
    statement: (id: string) => `r1:s4:stmt:${id}`,
  },
  stage5: {
    side: (itemId: string) => `r1:s5:side:${itemId}`,
  },
} as const;

// ---------------------------------------------------------------------------
// Material — 5 blocks, each pairing prose with a custom SVG/visual.
// ---------------------------------------------------------------------------
export type MaterialSectionId = "fundamentals" | "scale" | "tension" | "challenges" | "inefficiency";

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
    id: "fundamentals",
    n: 1,
    icon: "layers",
    kicker: "1 · What cloud actually offers",
    title: "Cloud Fundamentals & Core Benefits",
    definition:
      "Cloud computing means renting standardised compute, storage, and networking capacity from a provider's shared infrastructure over the internet, instead of buying and running your own physical servers. In a corporate context, this typically shows up as six concrete benefits: scalability and elastic use of resources (capacity grows or shrinks with real demand), flexibility (a broad catalogue of services can be combined without new procurement), faster provisioning (a new server or database is available in minutes, not weeks), lower own-infrastructure effort (no data centre space, cooling, or hardware refresh cycles to manage yourself), standardisation (consistent, repeatable configurations across environments), and high availability (workloads run across multiple physical locations, with provider-managed failover).",
    insight:
      "These benefits are not marketing claims — they follow directly from the underlying model. A shared resource pool, exposed through self-service APIs, is what makes elasticity and fast provisioning possible: you are drawing from capacity the provider has already built for thousands of customers, not waiting for your own hardware order to arrive. Standardisation and high availability follow from the same shared-infrastructure logic: the provider maintains one hardened, replicated environment instead of every customer maintaining their own.",
    takeaway:
      "Each of these six benefits is real, but each has a boundary condition worth remembering before Task 1: elasticity only helps if actual demand is variable; lower own-infrastructure effort does not mean lower total cost; and standardisation benefits the provider's operating model as much as it benefits you. Keep that pairing — real benefit, real boundary — in mind as you read the next four blocks.",
    callout: {
      label: "Why this matters for the case ahead",
      text: "Flexora's management is expecting exactly these six benefits from its cloud expansion — more speed, less operating burden. Whether the evidence actually supports that expectation is what Task 1 asks you to test.",
    },
  },
  {
    id: "scale",
    n: 2,
    icon: "factory",
    kicker: "2 · Economies of scale",
    title: "Why Cloud Can Be Efficient",
    definition:
      "Hyperscale providers can run data centres at a level of efficiency that is very difficult for an individual company to reach on its own. Three mechanisms explain most of the gap: utilisation (thousands of customers' workloads are pooled onto shared hardware, so servers run closer to full capacity instead of sitting mostly idle), automation (software-defined provisioning, patching, and cooling control replace manual operations at a scale no single enterprise IT team can justify building), and professional data-centre operations (purpose-built facilities with custom cooling, power delivery, and 24/7 specialist operations teams).",
    insight:
      "The clearest evidence of this gap is PUE (Power Usage Effectiveness — the ratio of total facility energy to IT equipment energy; a lower number means less energy lost to cooling, power delivery, and other overhead). The Uptime Institute's 2026 Global Data Center Survey put the industry-wide annual average PUE at 1.52 (1.36 once larger facilities are weighted proportionally), while leading hyperscale operators report PUEs as low as 1.08, typically in the 1.1–1.2 range for their newest facilities. The average enterprise-operated facility, by contrast, still runs at roughly 2.1 — effectively losing over half of the power it draws to non-IT overhead.",
    takeaway:
      "This is the strongest technical and economic argument for moving workloads to the cloud: a well-run hyperscale facility can deliver the same computing work using meaningfully less energy per unit of IT load than most companies' own data centres. That argument is about efficiency per unit of work, though — not about what happens to total energy demand once migration makes computing cheaper and easier to consume. That distinction is exactly where the next block picks up.",
    callout: {
      label: "Source and currency of these figures",
      text: "Figures above are from the Uptime Institute's 2026 Global Data Center Survey. PUE benchmarks shift year to year as facilities are built and retired — always check the current-year survey before quoting a number in a real report.",
    },
  },
  {
    id: "tension",
    n: 3,
    icon: "target",
    kicker: "3 · The tension this route is built around",
    title: "The Core Tension — Economies of Scale vs Energy Demand",
    definition:
      "Migrating to the cloud does not automatically make an organisation more sustainable, even though the underlying infrastructure is more efficient. The reason is a rebound effect: as computing becomes cheaper, faster to provision, and easier to consume (exactly the benefits described in Block 1), organisations tend to consume more of it — more environments, more data retained, more experiments spun up and left running. A rising efficiency curve and a rising total-demand curve can move in the same direction at the same time.",
    insight:
      "This mirrors a pattern economists have observed since the 19th century (Jevons' paradox): making a resource more efficient to use often increases total consumption of it, rather than reducing it, because the lower cost per unit removes a natural brake on demand. In a corporate cloud context, this shows up very concretely — a lower friction to spin up a new cloud resource (Block 1's \"faster provisioning\") is also a lower friction to leave that resource running unused (a direct link to Block 5's \"sources of inefficiency\").",
    takeaway:
      "The practical consequence: whether a specific cloud migration is genuinely more sustainable depends less on which provider you choose, and more on whether the organisation actively manages the demand side — governance over what gets provisioned, and discipline about decommissioning what is no longer needed. A provider's efficiency is a ceiling on how sustainable your cloud use can be; it is not a guarantee.",
    callout: {
      label: "You'll see this again",
      text: "The diagram below reappears, smaller, at the start of Task 1 — Flexora's own numbers are a live example of efficiency and total demand moving in opposite directions from what management expects.",
    },
  },
  {
    id: "challenges",
    n: 4,
    icon: "shield",
    kicker: "4 · What commonly goes wrong",
    title: "Typical Challenges of Cloud Use",
    definition:
      "Beyond the sustainability question, six challenges recur across organisations adopting cloud at scale: vendor dependency and lock-in (proprietary services make switching providers costly), lack of transparency (usage and cost data is often scattered across teams and dashboards), cost control — FinOps (spend is usage-based and can grow silently without active management), data sovereignty (data may be legally required to stay within a jurisdiction, e.g. under GDPR), governance gaps (no consistent policy for who can provision what), and security & compliance risk (shared responsibility models mean the customer, not just the provider, must correctly configure security controls).",
    insight:
      "These six are not independent — they compound. A governance gap (no policy on who can order cloud services) is very often the root cause behind both a transparency problem (nobody has full visibility) and a cost-control problem (spend accumulates unnoticed across many small, individually-approved purchases). Vendor lock-in and data sovereignty are more structural: they are consequences of specific technical and legal choices made early in an adoption, and are expensive to reverse later.",
    takeaway:
      "Every one of these six challenges maps onto one of the six dimensions in the wheel at the end of this material — that mapping is the framework you will actually use in Task 1, not just a list to memorise.",
    callout: {
      label: "Not a reason to avoid cloud",
      text: "None of these six challenges argue against cloud adoption itself — they argue for adopting it deliberately, with governance and monitoring built in from the start rather than added after problems appear.",
    },
  },
  {
    id: "inefficiency",
    n: 5,
    icon: "recycleLoop",
    kicker: "5 · Where the waste actually comes from",
    title: "Sources of Inefficiency",
    definition:
      "Even on efficient hyperscale infrastructure, an organisation's own cloud usage can be highly wasteful. Five patterns account for most of it: over-provisioning (requesting more capacity than a workload needs, \"just in case\"), unmanaged self-service usage (any team can spin up resources with no review), unnecessary data retention (storing data indefinitely with no lifecycle or deletion policy), zombie or idle workloads (resources left running after the project that needed them has ended), and poor architecture decisions (an application designed without cost or efficiency in mind, e.g. always-on compute for a workload that runs once a day).",
    insight:
      "Each of these is a demand-side problem, not a supply-side one — none of it is fixed by choosing a more efficient hyperscale provider, because the underlying resource is being consumed unnecessarily in the first place. This is the direct, practical face of Block 3's rebound effect: the same low friction that makes cloud fast and convenient (Block 1) is what allows over-provisioning and zombie workloads to accumulate unnoticed.",
    takeaway:
      "This is also the most actionable list in this material: unlike the provider's own PUE or hardware roadmap, every one of these five sources of waste is within the customer organisation's own control, starting with visibility into what is actually running.",
    callout: {
      label: "Before you move on",
      text: "The wheel below is a summary of everything in this material as one working framework. Study it — you will use it directly, as an interactive tool, in Stage 3 of Task 1.",
    },
  },
];

// ---------------------------------------------------------------------------
// The 6-Dimension Wheel — used as a materials summary and, functionally, as
// the Stage 3 drag target in Task 1.
// ---------------------------------------------------------------------------
export type DimensionId = "scalability" | "cost" | "controllability" | "sustainability" | "governance" | "dependencies";

export type Dimension = {
  id: DimensionId;
  label: string;
  question: string;
};

export const DIMENSIONS: Dimension[] = [
  { id: "scalability", label: "Scalability", question: "Can capacity grow or shrink with real demand, without a slow procurement cycle?" },
  { id: "cost", label: "Cost", question: "Is total spend predictable, and does it track the value actually delivered?" },
  { id: "controllability", label: "Controllability", question: "Does the organisation have visibility and control over what is running, and who ordered it?" },
  { id: "sustainability", label: "Sustainability", question: "Is the environmental claim backed by real data — not just a certificate or a good PUE?" },
  { id: "governance", label: "Governance", question: "Are there clear policies, ownership, and approval paths for how cloud is used?" },
  { id: "dependencies", label: "Dependencies", question: "How hard would it be to leave this provider, or negotiate on equal terms?" },
];

// ---------------------------------------------------------------------------
// Case brief — Flexora Digital Services (Task 1)
// ---------------------------------------------------------------------------
export const CASE_BRIEF = {
  company: "Flexora Digital Services",
  setup:
    "Flexora Digital Services is growing strongly, has so far operated a mix of local infrastructure and individual cloud services, and plans to move further applications to the cloud. Management expects this to bring more speed and a lower operating burden. At the same time, there is uncertainty about cost development, controllability, and sustainability impact.",
  role:
    "Your role: cloud strategy analyst. Work through the evidence systematically — the same way a professional would before recommending a course of action to management.",
} as const;

// ---------------------------------------------------------------------------
// Evidence cards — shared across Stages 2 and 3.
// ---------------------------------------------------------------------------
export type Verdict2 = "benefit" | "risk";

export type EvidenceItem = {
  id: string;
  text: string;
  correctVerdict: Verdict2;
  verdictClue: string;
  correctDimension: DimensionId;
  dimensionClue: string;
};

export const EVIDENCE_ITEMS: EvidenceItem[] = [
  {
    id: "ev-departments",
    text: "Several departments order cloud services independently.",
    correctVerdict: "risk",
    verdictClue: "If nobody has a full picture of what's being ordered, is that closer to a benefit of moving fast, or a risk of losing oversight?",
    correctDimension: "controllability",
    dimensionClue: "Which dimension is directly about whether the organisation can see and control what is running and who ordered it?",
  },
  {
    id: "ev-governance",
    text: "There is no uniform cloud governance.",
    correctVerdict: "risk",
    verdictClue: "\"No uniform policy\" — is that ever a strength, or is it always at least a gap waiting to cause a problem?",
    correctDimension: "governance",
    dimensionClue: "This one names the dimension almost directly in the word itself.",
  },
  {
    id: "ev-internal-ops",
    text: "Internal server operations are partly inefficient, but easy to control.",
    correctVerdict: "benefit",
    verdictClue: "Read this as a reason FOR the cloud move, not a warning about it — what does \"partly inefficient\" internal infrastructure suggest cloud could improve?",
    correctDimension: "cost",
    dimensionClue: "Inefficient operations usually show up on which line of a budget?",
  },
  {
    id: "ev-costs-rising",
    text: "Cloud costs are rising faster than expected.",
    correctVerdict: "risk",
    verdictClue: "\"Faster than expected\" is a phrase about a plan going wrong, not right — which side does that put it on?",
    correctDimension: "cost",
    dimensionClue: "This one is direct: which dimension is literally about spend?",
  },
  {
    id: "ev-data-growth",
    text: "Data volumes and storage requirements are continuously increasing.",
    correctVerdict: "benefit",
    verdictClue: "Re-read Block 1 — which cloud benefit exists specifically to absorb continuously growing demand without a slow procurement cycle?",
    correctDimension: "scalability",
    dimensionClue: "Continuously growing demand is the exact scenario one dimension is designed to answer for.",
  },
  {
    id: "ev-sustainability-pr",
    text: "Management would also like to communicate the cloud as a sustainability success.",
    correctVerdict: "risk",
    verdictClue: "Wanting to communicate something as a success is not the same as having the evidence for it — re-read Block 3 on the difference between efficiency and total demand.",
    correctDimension: "sustainability",
    dimensionClue: "Which dimension asks whether a claim like this is actually backed by data?",
  },
];

// ---------------------------------------------------------------------------
// Stage 4 — two sentence-starter statements.
// ---------------------------------------------------------------------------
export type StatementPrompt = {
  id: string;
  starter: string;
  helper: string;
};

export const STATEMENT_PROMPTS: StatementPrompt[] = [
  {
    id: "genuinely-sustainable",
    starter: "Cloud use is genuinely sustainable when",
    helper: "Think back to Block 3 — what has to be true about both efficiency AND total demand.",
  },
  {
    id: "fails-sustainable",
    starter: "A cloud migration fails to be sustainable if",
    helper: "Consider which of Block 5's sources of inefficiency would undo an efficient provider's advantage.",
  },
];

export const STATEMENT_MIN_WORDS = 10;

// ---------------------------------------------------------------------------
// Technical vs. Management/Governance split of Stage 2's "risk" items — an
// inline tag shown right on each Risk-zone card in Stage 2 (not a separate
// stage). The working set is derived live from the learner's own Stage 2
// verdicts (see useRoute1) — the classification below is reference data for
// every evidence item that CAN appear here, used to drive clues and the
// report, not to gate which items show up.
// ---------------------------------------------------------------------------
export type Side5 = "technical" | "governance";

export const STAGE5_CLASSIFICATION: Record<string, { correctSide: Side5; clue: string }> = {
  "ev-departments": {
    correctSide: "technical",
    clue: "Is there a centralised, self-service provisioning tool with guardrails in place — or is that capability simply missing?",
  },
  "ev-governance": {
    correctSide: "governance",
    clue: "A missing policy is a decision no one has made yet — whose job is it to make it?",
  },
  "ev-costs-rising": {
    correctSide: "technical",
    clue: "Re-read Block 5 — rising costs very often trace back to a specific, fixable technical pattern on that list.",
  },
  "ev-sustainability-pr": {
    correctSide: "governance",
    clue: "Deciding what to tell the outside world about sustainability — is that produced by engineers, or approved by leadership?",
  },
};

// ---------------------------------------------------------------------------
// Task 1 — copy
// ---------------------------------------------------------------------------
export const TASK1 = {
  kicker: "Task 1",
  heading: "Flexora Cloud Decision Audit",
  intro:
    "Flexora Digital Services is a fictional company, built to let you apply everything from the material above. Work through the five stages below — nothing is locked, and each one feeds the live Decision Brief on the right, which is what you'll actually export.",
  orderBanner: "Suggested order: Stage 1 → 5. You can work in any order — the report on the right fills in as you go, whichever stage you start with.",
  stage1: {
    heading: "Stage 1 — Case Briefing",
    instructions: "Read the dossier and click each evidence card to expand it. These six cards are what you'll classify in Stages 2 and 3.",
  },
  stage2: {
    heading: "Stage 2 — Sort: Benefit vs Risk",
    instructions:
      "Drag each of the six evidence cards into Benefit or Risk / Challenge — or tap a card, then tap a bucket. Use the clue if you're unsure; undo/redo freely. Every card you land on Risk also asks one more thing right there: is it an Individual Technical Problem or a Management / Governance Problem?",
  },
  stage3: {
    heading: "Stage 3 — Classify into the 6-Dimension Wheel",
    instructions:
      "Now drag the same six cards onto the wheel — one segment each, whichever dimension the evidence is most dominantly about. A card can only touch one segment: pick the strongest fit.",
  },
  stage4: {
    heading: "Stage 4 — Write 2 Sustainability Statements",
    instructions: "Complete each sentence in your own words, grounded in the material and in Flexora's situation.",
  },
  stage5: {
    heading: "Stage 5 — Live Report",
    instructions: "A read-only recap of everything above, and the structured brief it produces — ready to export once every stage is complete.",
  },
  export: {
    docHeading: "Cloud Decision Audit Brief",
    filenameLevel: 1,
    filenameTask: 1,
  },
} as const;
