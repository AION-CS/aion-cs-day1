/**
 * Route 2 — Application. All learner-facing copy and pure data for Day 7
 * live here so components stay presentational. Case used throughout:
 * Meridian Data Systems GmbH (fictional).
 */

import type { IconKey } from "@/lib/routes";

export const LEARNER_NAME_KEY = "learner:name";

export type OptionId = "A" | "B" | "C";
export const OPTION_IDS: OptionId[] = ["A", "B", "C"];

// ---------------------------------------------------------------------------
// Store key map — every key this route writes to the shared progress store.
// ---------------------------------------------------------------------------
export const R2 = {
  name: LEARNER_NAME_KEY,
  criterion: (criterionId: string, option: OptionId) => `r2:crit:${criterionId}:${option}`,
  decisionPick: "r2:decision:pick",
  decisionJustify: "r2:decision:justify",
  followUp: (i: number) => `r2:decision:followup:${i}`,
  risk: (i: number) => `r2:decision:risk:${i}`,
} as const;

// ---------------------------------------------------------------------------
// Case brief — Meridian Data Systems GmbH
// ---------------------------------------------------------------------------
export const CASE_BRIEF = {
  company: "Meridian Data Systems GmbH",
  setup:
    "Management can fund only one central line of measures right now. As the infrastructure sustainability lead, you've been asked to run the trade-off analysis yourself and bring back a prioritized, defensible recommendation — not a gut-feeling ranking.",
  constraints: [
    "Budget is limited.",
    "The board expects visible progress, for both internal and external communication.",
    "The data situation on actual load and consumption structure has gaps.",
    "Security of supply and operational stability have high priority.",
    "IT does not want to support purely symbolic measures.",
  ],
} as const;

export const OPTIONS: { id: OptionId; label: string; short: string; detail: string }[] = [
  {
    id: "A",
    label: "Extended Green Electricity Supply Contract",
    short: "PPA / GoO expansion",
    detail:
      "Expand long-term Power Purchase Agreements and Guarantee-of-Origin certificate volume, so a larger share of purchased electricity carries a verified renewable designation.",
  },
  {
    id: "B",
    label: "Technical PUE Improvement Investment",
    short: "Cooling & power-delivery retrofit",
    detail:
      "Capital investment in cooling and power-delivery upgrades — aisle containment, control tuning, a higher-efficiency UPS — to physically lower the facility's PUE.",
  },
  {
    id: "C",
    label: "Extended Management Model",
    short: "Multi-metric transparency & governance",
    detail:
      "Build an internal system of multiple metrics, granular load transparency, and differentiated sustainability assessment across zones and services.",
  },
];

// ---------------------------------------------------------------------------
// Materi — 4 blocks
// ---------------------------------------------------------------------------
export type MaterialSectionId = "forces" | "criteria" | "financing" | "governance";

export type MaterialSection = {
  id: MaterialSectionId;
  n: 1 | 2 | 3 | 4;
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
    id: "forces",
    n: 1,
    icon: "target",
    kicker: "1 · The core tension",
    title: "The Trade-off Radar: Four Forces in Tension",
    definition:
      "Any data centre sustainability decision sits inside a four-way tension. Sustainability is the actual reduction in emissions or footprint — not just the claim of it. Cost splits into capex (on-site generation, efficiency retrofits) and opex (PPA premiums, certificate purchases). Security of supply is diversification across energy sources and exposure to a single supplier or contract. Availability is the data centre's core operational promise — uptime — which any physical retrofit or operating-model change puts briefly at risk while it's being implemented.",
    insight:
      "These forces trade against each other constantly. A long-term PPA can improve cost predictability and sustainability credentials, but reduces flexibility and can worsen security-of-supply diversification if it locks the company to a single generator or region. An efficiency retrofit lowers PUE and cost over time, but the implementation window itself is an availability risk if not carefully sequenced. A broad governance and transparency programme improves long-term credibility and decision quality, but delivers the least visible short-term progress for board communication — this is the exact tension the case in Task 2 is built on.",
    takeaway:
      "Professionals learn to see all four forces simultaneously, not to optimise one in isolation. Every option in Task 2 does well on some of these and badly on others — there is no option that wins on all four at once.",
    callout: {
      label: "This is the exact tension Task 2 is built on",
      text: "Meridian's board wants visible progress. Its data has gaps. Its supply and stability priorities are high. No single measure satisfies all of that — which is precisely what makes this a prioritisation decision rather than an obvious choice.",
    },
  },
  {
    id: "criteria",
    n: 2,
    icon: "layers",
    kicker: "2 · The evaluation framework",
    title: "A Seven-Criteria Prioritisation Framework for Infrastructure Decisions",
    definition:
      "This framework is a synthesis of two established management tools, adapted for sustainability infrastructure decisions. The Impact–Effort Matrix — a standard portfolio-prioritisation tool used broadly in operations and product management — contributes the logic of comparing expected benefit against implementation cost and complexity. McKinsey's Three Horizons model (from The Alchemy of Growth, McKinsey & Company, 1999) contributes the discipline of separating short-term visible wins (Horizon 1) from structural, longer-horizon capability building (Horizon 3).",
    insight:
      "That Horizon 1 / Horizon 3 split is directly relevant here: a board wanting \"visible progress\" is asking for Horizon 1, while the structurally correct measure may take longer to show results and reads as Horizon 3. A credible recommendation names which horizon each option actually belongs to, instead of quietly presenting a Horizon 3 measure as if it were a quick win, or dismissing a Horizon 3 measure for not looking impressive fast enough.",
    takeaway:
      "Seven criteria, applied consistently across every option, turn a gut-feeling ranking into a defensible one. Click through the wheel below — you'll use these exact seven definitions in Task 2.",
    callout: {
      label: "Why exactly these seven",
      text: "Each criterion answers a question the other six can't: strategic leverage asks what this unlocks later; credibility asks whether it survives being questioned. A measure can score well on one and poorly on another — that's the point.",
    },
  },
  {
    id: "financing",
    n: 3,
    icon: "certificate",
    kicker: "3 · Real-world grounding",
    title: "Real-World Financing & Reporting Context",
    definition:
      "This isn't abstract theory. Large hyperscale operators such as Google and Microsoft have scaled corporate renewable Power Purchase Agreements into multi-gigawatt global portfolios since roughly the early 2010s, making PPAs the dominant mechanism for large-scale renewable procurement in the sector. Data centre and colocation operators such as Equinix have also used green bonds — debt instruments earmarked for environmentally beneficial projects — to fund efficiency retrofits and renewable infrastructure. In the real world, \"Option A\" and \"Option B\" style choices are often blended rather than picked in isolation.",
    insight:
      "There's also a formal reporting obligation now. Under Article 12 and Annex VII of the recast EU Energy Efficiency Directive (EU) 2023/1791, and its implementing Delegated Regulation (EU) 2024/1364 (adopted 14 March 2024), any EU data centre with an installed IT power demand of at least 500 kW must report a defined set of sustainability and energy KPIs annually to the European Database on Data Centres. The first report covered calendar year 2023 and was due 15 September 2024; from 2025 onward, the deadline is 15 May each year, covering the previous calendar year. Data is published in aggregated form at EU and country level — individual company data isn't made public where it constitutes a trade secret.",
    takeaway:
      "A widely-held misconception is worth correcting here: the EU Energy Efficiency Directive itself does not mandate a specific PUE threshold across the EU — it mandates reporting and transparency. It's national law, such as Germany's EnEfG (covered in Route 1), that sets binding PUE thresholds. Conflating \"the EU forces a PUE of X\" with \"the EU forces you to disclose your PUE\" is exactly the kind of imprecision a credible sustainability professional must avoid.",
    callout: {
      label: "Directly relevant to Credibility",
      text: "Disclosure ≠ performance mandate. Getting this distinction wrong in front of a board, an auditor, or a journalist is a credibility failure — which is exactly what the seventh criterion in this route is built to catch.",
    },
  },
  {
    id: "governance",
    n: 4,
    icon: "gavel",
    kicker: "4 · Who actually decides",
    title: "Governance Flow: Who Actually Approves What",
    definition:
      "In a mid-to-large organisation, this class of decision runs through a realistic chain: the Board or Executive Committee gives strategic sign-off and sets the budget ceiling. The CIO/CTO or Head of Infrastructure owns the trade-off analysis and makes the technical-strategic recommendation. IT Operations gives feasibility and operational-risk input, with an effective veto on availability grounds. Finance signs off on economic viability, especially for multi-year commitments like a PPA. The decision then goes back to the Board for final approval, with a reporting loop back down once implemented — linking directly to the disclosure obligations above.",
    insight:
      "The quality of a recommendation is judged not only on its content but on whether it anticipates each stakeholder's objection before they raise it: has Finance's viability question already been answered? Has IT Operations' availability concern already been addressed? A recommendation that survives this chain on the first pass is a stronger recommendation than one that merely sounds good in isolation.",
    takeaway:
      "Keep this chain in mind while you build your Task 2 recommendation — your justification should read as something that has already thought about what Finance and IT Operations would push back on.",
    callout: {
      label: "Anticipate the objection before it's raised",
      text: "\"We haven't checked with IT Operations yet\" is not a defensible position to bring to a board. The strongest recommendations are pre-negotiated in the analysis itself.",
    },
  },
];

// ---------------------------------------------------------------------------
// The 7 criteria
// ---------------------------------------------------------------------------
export type CriterionId =
  | "strategic-leverage"
  | "sustainability-impact"
  | "informative-value"
  | "economic-viability"
  | "feasibility"
  | "risk"
  | "credibility";

export type Criterion = { id: CriterionId; n: number; label: string; definition: string };

export const CRITERIA: Criterion[] = [
  {
    id: "strategic-leverage",
    n: 1,
    label: "Strategic Leverage",
    definition: "How much this measure unlocks or enables future decisions and options, rather than closing them down.",
  },
  {
    id: "sustainability-impact",
    n: 2,
    label: "Sustainability Impact",
    definition: "The realistic, evidence-based magnitude of environmental benefit — not the magnitude that's easiest to communicate.",
  },
  {
    id: "informative-value",
    n: 3,
    label: "Informative Value",
    definition: "How much the measure improves the organisation's ability to actually know its own performance — its contribution to data and transparency.",
  },
  {
    id: "economic-viability",
    n: 4,
    label: "Economic Viability",
    definition: "Cost relative to benefit, evaluated under the stated budget constraint.",
  },
  {
    id: "feasibility",
    n: 5,
    label: "Feasibility",
    definition: "Realistic implementability given current organisational, technical, and data maturity.",
  },
  {
    id: "risk",
    n: 6,
    label: "Risk",
    definition: "The probability and severity of the measure failing, backfiring, or being reversed.",
  },
  {
    id: "credibility",
    n: 7,
    label: "Credibility",
    definition: "How well the measure would hold up under external scrutiny — auditors, journalists, regulators — versus how it merely sounds in a press release.",
  },
];

// ---------------------------------------------------------------------------
// Criterion statements — 7 criteria × 3 options × 3 statements, hand-written
// ---------------------------------------------------------------------------
export type Statement = { id: string; score: 1 | 2 | 3; text: string };
export type CriterionOptionData = { statements: Statement[]; clue: string };

const s = (criterionId: string, option: OptionId, score: 1 | 2 | 3, text: string): Statement => ({
  id: `${criterionId}-${option}-${score}`,
  score,
  text,
});

export const CRITERION_DATA: Record<CriterionId, Record<OptionId, CriterionOptionData>> = {
  "strategic-leverage": {
    A: {
      statements: [
        s("strategic-leverage", "A", 1, "Signs the company into a single generator or region for the contract term, which narrows which sourcing options are realistically still open afterwards."),
        s("strategic-leverage", "A", 2, "Strengthens the renewable-supply position on paper, but by itself changes little about what the company can decide about its own infrastructure next."),
        s("strategic-leverage", "A", 3, "Frees internal budget and attention that a technical programme would have consumed, making it easier to fund a further measure later from the same sustainability mandate."),
      ],
      clue: "Re-read the constraint about security of supply — what happens to Meridian's future options once it's committed to one supplier for 10-20 years?",
    },
    B: {
      statements: [
        s("strategic-leverage", "B", 1, "A one-off retrofit fixes today's inefficiency but creates no new organisational capability — the next inefficiency will be found the same ad hoc way this one was."),
        s("strategic-leverage", "B", 2, "Improves the technical baseline the company operates from, which future decisions can build on, without changing how those decisions actually get made."),
        s("strategic-leverage", "B", 3, "A verified PUE improvement becomes a credible reference point that anchors every future efficiency or reporting conversation, including with regulators."),
      ],
      clue: "If this retrofit is a one-off, what happens to the next inefficiency nobody's watching for?",
    },
    C: {
      statements: [
        s("strategic-leverage", "C", 1, "Produces internal reports and dashboards, but without a mandate to act on them, the underlying decisions don't actually change."),
        s("strategic-leverage", "C", 2, "Gives the organisation a repeatable way to compare options like A and B against each other next time, instead of relying on one-off analysis."),
        s("strategic-leverage", "C", 3, "Becomes the backbone every future energy, efficiency, or reporting decision routes through — the highest-leverage of the three, because it changes how decisions get made, not just what was decided this once."),
      ],
      clue: "Which of the three options changes how future decisions like this one get made, not just what gets decided this time?",
    },
  },
  "sustainability-impact": {
    A: {
      statements: [
        s("sustainability-impact", "A", 1, "Certificates and contracts create a reporting entitlement to call the electricity \"renewable,\" without necessarily changing the carbon intensity of what's actually drawn from the grid at any given hour."),
        s("sustainability-impact", "A", 2, "A physical PPA delivering into the buyer's own grid region adds real new renewable generation to the system the company draws from, beyond a paper claim."),
        s("sustainability-impact", "A", 3, "At the scale Meridian could realistically contract, the measure meaningfully shifts the marginal generation mix in its supply region — an outcome few single data centre operators can credibly claim."),
      ],
      clue: "Does a certificate change the carbon intensity of the electrons Meridian actually draws, or just the paperwork describing them?",
    },
    B: {
      statements: [
        s("sustainability-impact", "B", 1, "A retrofit targeting only the most visible cooling units improves PUE on paper but leaves the facility's actual total energy draw close to where it started, since most load doesn't change."),
        s("sustainability-impact", "B", 2, "A well-sequenced retrofit — containment, controls, a higher-efficiency UPS — produces a real, measurable drop in facility overhead energy, not just a ratio improvement."),
        s("sustainability-impact", "B", 3, "Combined with utilisation and load-consolidation work, the retrofit could cut absolute facility energy substantially, not just the PUE ratio."),
      ],
      clue: "A retrofit changes PUE — does it necessarily change total facility energy if the IT load itself hasn't changed?",
    },
    C: {
      statements: [
        s("sustainability-impact", "C", 1, "A transparency system, on its own, consumes effort to build and doesn't reduce a single kilowatt-hour directly."),
        s("sustainability-impact", "C", 2, "By revealing which zones are actually inefficient, it points budget at the interventions with the largest realistic environmental benefit, rather than the most visible one."),
        s("sustainability-impact", "C", 3, "It removes guesswork from every sustainability decision going forward, compounding into the largest cumulative impact of the three options over multiple cycles."),
      ],
      clue: "Can a transparency system reduce a single kilowatt-hour on its own, on day one?",
    },
  },
  "informative-value": {
    A: {
      statements: [
        s("informative-value", "A", 1, "A signed supply contract adds a line to the energy procurement file; it says nothing new about how or where Meridian actually consumes energy."),
        s("informative-value", "A", 2, "GoO tracking introduces some visibility into the renewable share of the electricity mix, though not into how that electricity is used internally."),
        s("informative-value", "A", 3, "Expanded contract reporting requirements bring detailed hourly consumption-matching data that Meridian didn't have to track before."),
      ],
      clue: "Does signing a supply contract tell Meridian anything new about where its own energy actually goes?",
    },
    B: {
      statements: [
        s("informative-value", "B", 1, "Retrofit vendors typically report before/after PUE at the facility level only, adding little detail about which zones or workloads actually changed."),
        s("informative-value", "B", 2, "Modern retrofit equipment usually ships with its own sub-metering, adding real granularity for the systems it touches."),
        s("informative-value", "B", 3, "The retrofit is instrumented as a full monitoring upgrade across the facility, closing the exact data gaps the constraints describe."),
      ],
      clue: "Retrofit vendors report facility-level PUE — does that close the load and consumption gaps the case describes?",
    },
    C: {
      statements: [
        s("informative-value", "C", 1, "Adds dashboards without new source data, so the numbers only restate what disparate teams already knew separately."),
        s("informative-value", "C", 2, "Establishes new load- and zone-level monitoring that closes a meaningful share of the current data gaps."),
        s("informative-value", "C", 3, "Directly closes the load and consumption data gap the case explicitly names, and produces exactly the multi-metric, differentiated view every other decision in this exercise depends on."),
      ],
      clue: "Which option is explicitly designed to close the data gap the constraints call out?",
    },
  },
  "economic-viability": {
    A: {
      statements: [
        s("economic-viability", "A", 1, "Long-term PPA pricing is typically structured as a hedge, but signing now under a limited budget still means committing multi-year fixed costs before this year's uncertainty resolves."),
        s("economic-viability", "A", 2, "Premium over grid price is moderate and spread across the contract term, which is manageable within a constrained annual budget."),
        s("economic-viability", "A", 3, "A well-structured virtual PPA can even net a financial benefit if wholesale prices move favourably, on top of the sustainability credential."),
      ],
      clue: "How does a multi-year fixed commitment interact with a budget the case describes as limited, this year specifically?",
    },
    B: {
      statements: [
        s("economic-viability", "B", 1, "Cooling and power-delivery retrofits carry meaningful upfront capital cost that competes directly with a budget this exercise describes as limited."),
        s("economic-viability", "B", 2, "Retrofit payback typically arrives within a few years from energy savings, but requires the capital outlay to clear the limited budget constraint first."),
        s("economic-viability", "B", 3, "Targeted retrofits — containment, controls tuning — can be phased to fit within a limited budget while still returning most of the technical benefit."),
      ],
      clue: "Cooling and power-delivery retrofits mean capital equipment — how does that interact with a limited budget compared to a data or process investment?",
    },
    C: {
      statements: [
        s("economic-viability", "C", 1, "A management and transparency system needs new tooling, data-governance work, and staff time — a real cost even without new hardware."),
        s("economic-viability", "C", 2, "Mostly a data and process investment rather than capital equipment, so it fits a limited budget more easily than a physical retrofit."),
        s("economic-viability", "C", 3, "Can be built incrementally on existing monitoring infrastructure at low marginal cost, freeing budget for whichever technical measure the data later justifies."),
      ],
      clue: "Which of the three options needs the least new hardware to get started?",
    },
  },
  feasibility: {
    A: {
      statements: [
        s("feasibility", "A", 1, "Requires legal negotiation with an external generator or supplier, a due-diligence cycle, and sign-off across procurement and finance before anything changes."),
        s("feasibility", "A", 2, "Meridian already has some renewable contracts in place, so extending them is a scaling exercise rather than a new capability to build."),
        s("feasibility", "A", 3, "Can be executed largely through the existing procurement relationship with minimal new internal process."),
      ],
      clue: "Meridian already holds some renewable contracts — is extending an existing relationship the same kind of effort as building a new one?",
    },
    B: {
      statements: [
        s("feasibility", "B", 1, "Requires physical works inside a live facility — exactly the kind of change IT Operations is wary of, given the priority on operational stability."),
        s("feasibility", "B", 2, "Can be phased zone-by-zone to limit exposure, but still requires scheduling live-facility work around uptime commitments."),
        s("feasibility", "B", 3, "Can be piloted on a single non-critical zone first, keeping the rest of the facility untouched while results are validated."),
      ],
      clue: "Re-read the constraint on operational stability — what does live-facility retrofit work risk during implementation?",
    },
    C: {
      statements: [
        s("feasibility", "C", 1, "Requires new tooling, cross-team data agreements, and six-plus months before it produces any usable output."),
        s("feasibility", "C", 2, "Needs coordination across IT and facilities to agree on what to measure, but can reuse data Meridian already collects in parts of the facility."),
        s("feasibility", "C", 3, "Can be piloted with existing data and a small cross-functional taskforce within one quarter, since it changes process and reporting, not physical infrastructure."),
      ],
      clue: "Does this option require new physical infrastructure, or mostly agreement on what to measure?",
    },
  },
  risk: {
    A: {
      statements: [
        s("risk", "A", 1, "A 10-20 year commitment to a single supplier concentrates exposure — if that supplier underperforms or the market shifts, Meridian is locked in regardless."),
        s("risk", "A", 2, "Renewable pricing volatility is partly hedged by the contract structure, but Meridian still carries exposure if broader energy prices move sharply."),
        s("risk", "A", 3, "Financially hedged virtual PPA structures largely insulate Meridian from downstream price risk, leaving mainly reputational exposure if the underlying project underdelivers."),
      ],
      clue: "If the supplier underperforms or the market shifts, what's Meridian's exposure on a 10-20 year single-supplier contract?",
    },
    B: {
      statements: [
        s("risk", "B", 1, "Retrofit work inside a live facility risks an availability incident during implementation — precisely the outcome the operational-stability priority is meant to prevent."),
        s("risk", "B", 2, "A carefully phased rollout limits blast radius, but some implementation-window risk to availability remains unavoidable."),
        s("risk", "B", 3, "Piloting on a single non-critical zone before wider rollout keeps any implementation risk contained and reversible."),
      ],
      clue: "Re-read the constraint on operational stability — what's the failure mode of retrofit work inside a live facility?",
    },
    C: {
      statements: [
        s("risk", "C", 1, "A new metrics system can surface uncomfortable numbers publicly before anyone has agreed how to explain them, creating a communications risk of its own."),
        s("risk", "C", 2, "Rollout risk is mostly organisational — adoption, data-quality disputes — rather than operational, and is reversible if the model needs revising."),
        s("risk", "C", 3, "Touches no physical infrastructure and carries no availability exposure, making it the lowest operational-risk option of the three by construction."),
      ],
      clue: "Which option touches zero physical infrastructure, and what does that mean for availability risk?",
    },
  },
  credibility: {
    A: {
      statements: [
        s("credibility", "A", 1, "GoO-only claims without matched hourly consumption data are a well-documented target for auditor and journalist scrutiny over \"paper renewables.\""),
        s("credibility", "A", 2, "A named, verifiable long-term PPA is harder to dismiss than certificates alone, though scrutiny of the underlying delivery structure is increasingly common."),
        s("credibility", "A", 3, "A physical PPA delivering into Meridian's own grid region is about as defensible a renewable claim as a single company can make, matching the mechanism hyperscalers use at scale."),
      ],
      clue: "Re-read the constraint about IT's stance on symbolic measures — how does that affect a claim built mainly on certificates rather than matched delivery data?",
    },
    B: {
      statements: [
        s("credibility", "B", 1, "A single self-reported PUE figure, without independent verification, is exactly the kind of unaudited number regulators and journalists increasingly question."),
        s("credibility", "B", 2, "A physically verifiable before/after PUE change is more defensible than a contractual claim, though it's still only one metric among several a sophisticated reviewer would ask about."),
        s("credibility", "B", 3, "Independently measured, physically verified efficiency gains are among the hardest sustainability claims to challenge, since the underlying hardware change is directly inspectable."),
      ],
      clue: "Which is harder for an outside reviewer to dismiss: a self-reported ratio, or a physically inspectable hardware change?",
    },
    C: {
      statements: [
        s("credibility", "C", 1, "A new internal reporting model with no external validation yet is, at this stage, still an unverified claim about how rigorous Meridian's numbers are."),
        s("credibility", "C", 2, "A differentiated, multi-metric model is structurally more credible than PUE-only reporting, even before any external audit."),
        s("credibility", "C", 3, "Directly answers the \"credibility versus how it merely sounds\" test this criterion is built on — it's the only option that changes what Meridian can actually stand behind under scrutiny, not just what it can say."),
      ],
      clue: "Which option is the only one that changes what Meridian can actually demonstrate under scrutiny, not just what it can say in a press release?",
    },
  },
};

// ---------------------------------------------------------------------------
// Task 2 — copy
// ---------------------------------------------------------------------------
export const FOLLOWUP_COUNT = 2;
export const RISK_COUNT = 2;

export const TASK2 = {
  kicker: "Task 2",
  heading: "Prioritisation Decision Simulator",
  subtext:
    "Score all three options against the seven criteria from the materi. Do not just declare a gut-feeling ranking — reason through each criterion first. The radar chart reveals itself as you go.",
  orderBanner: "Suggested order: score all 7 criteria, then decide. You can work in any order — nothing here is locked.",
  criteriaHeading: "Score the three options",
  criteriaInstructions:
    "For each criterion, click the one statement under each option that best matches Meridian's situation. Use Show Clue if you're unsure — it points at the reasoning, not the answer.",
  radarHeading: "Live comparison",
  radarIntro: "Builds as you answer each criterion below. Distinguish the three options by line style, not colour alone.",
  decision: {
    heading: "Decision",
    pickLabel: "Final recommendation",
    pickCaption: "Select the option you'd actually recommend to Meridian's board.",
    justifyLabel: "Justification",
    justifyCaption:
      "You will not have perfect data. State your reasoning anyway — this is what a real prioritisation decision requires. Aim for at least ~40 words.",
    followUpLabel: "Follow-up decisions",
    followUpCaption: "What must be decided next, once this measure is approved?",
    riskLabel: "Risks of the easy-but-shallow alternative",
    riskCaption:
      "Name two risks of picking a measure that is easy to communicate short-term but structurally weak — even if it isn't the option you recommended.",
  },
  export: {
    filenameLevel: 2,
    filenameTask: 1,
    taskLabel: "Prioritisation Decision Memo",
    docHeading: "Prioritisation Decision Memo",
  },
} as const;
