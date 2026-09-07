/**
 * Route 2 — Application. All learner-facing copy and pure data for Day 8
 * live here so components stay presentational. Case used throughout:
 * Flexora Digital Services — the same company from Route 1, now facing the
 * next decision: which single line of action to fund first.
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
  pick: "r2:s3:pick",
  justify: "r2:s3:justify",
  followUp: (i: number) => `r2:s4:followup:${i}`,
  risk: (i: number) => `r2:s5:risk:${i}`,
  reflection: (i: number) => `r2:s6:reflect:${i}`,
} as const;

// ---------------------------------------------------------------------------
// Case brief — Flexora's next decision
// ---------------------------------------------------------------------------
export const CASE_BRIEF = {
  company: "Flexora Digital Services",
  setup:
    "Following its cloud expansion, Flexora's leadership can fund only one central line of action right now. As the infrastructure sustainability lead, you've been asked to run the prioritisation yourself and bring back a defensible recommendation — not a gut-feeling ranking.",
  constraints: [
    "The budget is limited.",
    "Management expects rapid, visible progress.",
    "The data situation on energy demand and overall impact is incomplete.",
    "Departments want high flexibility and little central control.",
    "IT wants to avoid future dependencies and cost explosions.",
  ],
} as const;

export const OPTIONS: { id: OptionId; label: string; short: string; detail: string }[] = [
  {
    id: "A",
    label: "Accelerated Migration",
    short: "Move faster, dismantle local infrastructure sooner",
    detail: "Accelerated migration of further applications to the cloud, in order to dismantle local infrastructure more quickly.",
  },
  {
    id: "B",
    label: "Binding Cloud Governance",
    short: "Transparency on usage, cost, workloads, responsibilities",
    detail: "Building binding cloud governance with transparency on usage, cost, workloads, and responsibilities.",
  },
  {
    id: "C",
    label: "Technical Optimisation",
    short: "Reduce idle time, storage growth, inefficient use",
    detail: "Technical optimisation of existing cloud workloads to reduce idle time, storage growth, and inefficient resource use.",
  },
];

// ---------------------------------------------------------------------------
// Material — 5 blocks
// ---------------------------------------------------------------------------
export type MaterialSectionId = "finops" | "sevendim" | "uncertainty" | "multiplier" | "shorttermism";

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
    id: "finops",
    n: 1,
    icon: "coins",
    kicker: "1 · The industry's own framework",
    title: "Cloud Financial & Governance Frameworks",
    definition:
      "The FinOps Foundation (part of the Linux Foundation) defines the industry-standard FinOps Framework as a continuous cycle of three phases: Inform (give every team visibility into what they're actually spending and running — allocation, benchmarking, budgeting), Optimize (act on that visibility — rightsizing, commitment discounts, eliminating waste), and Operate (embed the first two into ongoing governance — policies, automation, continuous improvement — so the cycle repeats rather than happening once).",
    insight:
      "Task 2's three options map directly onto this cycle, and onto each other's prerequisites: Option B (governance) is almost entirely Inform work — you cannot optimise or operate what you cannot see. Option C (technical optimisation) is Optimize work — it depends on Inform having already surfaced where the waste is. Option A (accelerated migration) sits outside the cycle's discipline entirely if pursued alone — it changes scale without first passing through Inform or Optimize, which is exactly why it can increase cost and risk rather than reduce them.",
    takeaway:
      "This is not three equally-ranked options — it's one maturity sequence with a shortcut being proposed. A credible recommendation names where in the FinOps cycle each option actually sits, not just how attractive it looks on its own.",
    callout: {
      label: "Verify before you quote it",
      text: "The FinOps Foundation updates its framework and member survey data regularly — if you cite a specific adoption statistic or maturity benchmark from them in a real report, check the current-year State of FinOps report rather than reusing a remembered figure.",
    },
  },
  {
    id: "sevendim",
    n: 2,
    icon: "target",
    kicker: "2 · The scoring framework",
    title: "The 7-Dimension Assessment Model",
    definition:
      "Seven dimensions, applied consistently to every option, turn a gut-feeling ranking into a defensible one: Strategic Leverage (how much this unlocks or enables future decisions, rather than closing them down), Sustainability Impact (the realistic, evidence-based environmental benefit — not the easiest one to communicate), Economic Viability (cost relative to benefit, under the stated budget constraint), Feasibility (realistic implementability given current organisational and technical maturity), Transparency Gain (how much the measure improves visibility into usage, cost, and workloads), Risk (the probability and severity of the measure failing or backfiring), and Long-Term Effect (whether the benefit compounds over time or fades once attention moves elsewhere).",
    insight:
      "Plotted on a radar chart, each option produces a distinct shape rather than a single score — one option can dominate on Feasibility and Economic Viability while trailing badly on Long-Term Effect, and that shape is more informative than any average. You'll build exactly this chart, live, in Stage 2 of Task 2: the same seven axes below, with your own answers.",
    takeaway:
      "No option wins on all seven axes at once — that is expected, not a flaw in the framework. The recommendation in Stage 3 is about which shape best fits the situation's actual constraints, not which option has the most axes lit up.",
    callout: {
      label: "This is the tool, not a demonstration",
      text: "The chart below is an empty shell on purpose. In Stage 2 it fills in with real data from your own seven questions — same component, same seven axes, live.",
    },
  },
  {
    id: "uncertainty",
    n: 3,
    icon: "layers",
    kicker: "3 · Deciding without full data",
    title: "Deciding Under Uncertainty",
    definition:
      "A classic strategy framework sorts actions by how they behave across an uncertain future: no-regret moves (worth taking in essentially every plausible scenario, because their cost is low and their downside is minimal), options (small, reversible steps that don't commit fully but keep valuable choices open for later, once more is known), and big bets (large, largely irreversible commitments made on a specific bet about how the future will unfold).",
    insight:
      "This is precisely the tool for justifying a decision when the data situation is incomplete — which Flexora's constraints explicitly describe. A no-regret move needs very little justification beyond \"this helps regardless of what happens next.\" A big bet needs the opposite: an explicit, stated reason for believing this particular future is the one to commit to, made in full view of the risk of being wrong.",
    takeaway:
      "Naming which tier an option sits in is itself part of a credible justification. Saying \"I'm treating this as a no-regret move because X\" or \"I recognise this is a big bet, and here's why I'm making it anyway\" is stronger than presenting every choice as equally certain.",
    callout: {
      label: "Direct use in Task 2",
      text: "Stage 3 asks you to justify your final pick while explicitly naming what information is still missing. This framework is exactly how you do that without pretending to more certainty than you have.",
    },
  },
  {
    id: "multiplier",
    n: 4,
    icon: "gavel",
    kicker: "4 · The argument this route is built on",
    title: "Why Governance Multiplies Everything Else",
    definition:
      "Governance is not a fourth option that competes with migration and optimisation for the same budget line — it is the layer that determines how effectively the other two actually work. Without visibility into usage, cost, and workloads, a migration can silently increase total spend and energy demand (Route 1, Block 3's rebound effect in practice), and a technical optimisation can only ever catch the waste someone happened to notice.",
    insight:
      "This is why governance behaves as a multiplier rather than an additive contribution: a migration paired with governance is worth more than a migration alone, and a migration without it can even net negative once uncontrolled growth is counted. The same relationship holds for optimisation — one-off cleanup versus cleanup backed by ongoing visibility that catches the next round of waste before it accumulates.",
    takeaway:
      "This is the strongest argument for prioritising governance first, even though it's the least visible option in the short term (a tension Block 5 comes back to directly): it is the layer that makes the economies-of-scale efficiency argument from Route 1 actually realisable in practice, rather than theoretical.",
    callout: {
      label: "Not an argument against A or C",
      text: "This doesn't mean migration and optimisation are wrong — it means their realistic value depends heavily on whether governance exists underneath them. Keep that dependency in mind heading into Stage 2's scoring.",
    },
  },
  {
    id: "shorttermism",
    n: 5,
    icon: "recycleLoop",
    kicker: "5 · Why the fast option often isn't the safe one",
    title: "The Trap of the Short-Term Win",
    definition:
      "An option that looks fast and impressive in the short term is often structurally fragile, because its visible progress isn't backed by the underlying capability needed to sustain it. Two recurring real-world patterns illustrate this directly: cloud cost overrun (spend growing well past forecast once usage scales without governance — a widely reported pattern across FinOps industry surveys) and vendor lock-in (a fast, deep commitment to one provider's proprietary services that becomes very costly to reverse once discovered).",
    insight:
      "Both patterns share the same shape: fast initial progress, followed by a sharper correction once the hidden cost or risk surfaces — usually later, and usually more expensive to fix than it would have been to prevent. A governance-first path shows less visible progress early, but each subsequent step is built on real visibility, so its trajectory doesn't require a later correction.",
    takeaway:
      "A board asking for \"visible progress\" is not wrong to want it — but a credible recommendation distinguishes between visible progress that is durable and visible progress that is a preview of a correction still to come.",
    callout: {
      label: "You'll see this diagram again",
      text: "The branching timeline below reappears next to Stage 5 of Task 2, where you'll name two concrete risks of picking the fast-but-shallow path.",
    },
  },
];

// ---------------------------------------------------------------------------
// The 7 criteria
// ---------------------------------------------------------------------------
export type CriterionId =
  | "strategic-leverage"
  | "sustainability-impact"
  | "economic-viability"
  | "feasibility"
  | "transparency-gain"
  | "risk"
  | "long-term-effect";

export type Criterion = { id: CriterionId; n: number; label: string; definition: string };

export const CRITERIA: Criterion[] = [
  { id: "strategic-leverage", n: 1, label: "Strategic Leverage", definition: "How much this measure unlocks or enables future decisions, rather than closing them down." },
  { id: "sustainability-impact", n: 2, label: "Sustainability Impact", definition: "The realistic, evidence-based magnitude of environmental benefit — not the magnitude that's easiest to communicate." },
  { id: "economic-viability", n: 3, label: "Economic Viability", definition: "Cost relative to benefit, evaluated under the stated budget constraint." },
  { id: "feasibility", n: 4, label: "Feasibility", definition: "Realistic implementability given current organisational, technical, and data maturity." },
  { id: "transparency-gain", n: 5, label: "Transparency Gain", definition: "How much the measure improves visibility into usage, cost, workloads, and responsibilities." },
  { id: "risk", n: 6, label: "Risk", definition: "The probability and severity of the measure failing, backfiring, or being reversed." },
  { id: "long-term-effect", n: 7, label: "Long-Term Effect", definition: "Whether the measure's benefit compounds over time, or fades once attention moves elsewhere." },
];

// ---------------------------------------------------------------------------
// Criterion statements — 7 criteria x 3 options x 3 statements, hand-written
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
        s("strategic-leverage", "A", 1, "Dismantling local infrastructure faster removes a fallback option — once it's gone, Flexora has little room to slow down or reverse course if the migration doesn't go as planned."),
        s("strategic-leverage", "A", 2, "Moves more workloads onto cloud infrastructure, but by itself does nothing to change how future cloud decisions get made or who controls them."),
        s("strategic-leverage", "A", 3, "Frees internal effort that would otherwise go to running dual infrastructure, giving the organisation more room to fund whichever measure the evidence justifies next."),
      ],
      clue: "Re-read the constraint about IT wanting to avoid future dependencies — what happens to Flexora's options once local infrastructure is gone?",
    },
    B: {
      statements: [
        s("strategic-leverage", "B", 1, "Written policy alone changes nothing if nobody has the mandate or tooling to actually enforce it once departments push back."),
        s("strategic-leverage", "B", 2, "Establishes clearer rules for how cloud is used, which future decisions can reference, without yet changing what gets decided."),
        s("strategic-leverage", "B", 3, "Becomes the framework every future cloud decision — migration pace, spend, architecture — has to run through, making it the highest-leverage option of the three."),
      ],
      clue: "Which of the three options changes how future decisions get made, rather than just what gets decided once?",
    },
    C: {
      statements: [
        s("strategic-leverage", "C", 1, "A one-off clean-up of idle workloads and storage fixes today's waste but creates no lasting capability to catch the next one."),
        s("strategic-leverage", "C", 2, "Improves the technical baseline Flexora operates from, which later decisions can build on, without changing how those decisions get made."),
        s("strategic-leverage", "C", 3, "Establishes a repeatable discipline for finding and removing waste, which compounds in value every future quarter it's applied."),
      ],
      clue: "If this clean-up happens once, what stops the same waste from reappearing next quarter?",
    },
  },
  "sustainability-impact": {
    A: {
      statements: [
        s("sustainability-impact", "A", 1, "Migrating more workloads increases total cloud energy demand — without governance to manage that growth, the efficiency gain from cloud providers can be outpaced by it."),
        s("sustainability-impact", "A", 2, "A faster migration does move workloads onto typically more efficient infrastructure, though the benefit depends entirely on how much new demand the move itself generates."),
        s("sustainability-impact", "A", 3, "If paired with disciplined decommissioning of the local infrastructure it replaces, migration can produce a real net efficiency gain rather than just adding a second footprint on top of the first."),
      ],
      clue: "Re-read Route 1's Block 3 — does moving more workloads to the cloud guarantee a lower total footprint, or does it depend on what happens to demand?",
    },
    B: {
      statements: [
        s("sustainability-impact", "B", 1, "A governance policy, on its own, reduces nothing directly — it doesn't turn off a single idle server."),
        s("sustainability-impact", "B", 2, "By making usage visible, governance creates the conditions for sustainability improvements to actually be found and acted on, even though it doesn't act by itself."),
        s("sustainability-impact", "B", 3, "Sustained oversight of usage and workloads is what prevents the exact rebound effect that could otherwise cancel out efficiency gained elsewhere — the largest realistic long-run impact of the three."),
      ],
      clue: "Can a governance policy reduce energy use directly, on day one, without anyone acting on the transparency it creates?",
    },
    C: {
      statements: [
        s("sustainability-impact", "C", 1, "A narrow clean-up targeting only the most visible idle workloads leaves most of the underlying waste untouched."),
        s("sustainability-impact", "C", 2, "Directly reduces over-provisioning and idle resource use — real, measurable savings, though limited to what's already been identified."),
        s("sustainability-impact", "C", 3, "Combined with ongoing monitoring, technical optimisation can cut total resource consumption substantially, attacking named sources of inefficiency directly rather than working around them."),
      ],
      clue: "Which option directly attacks a named source of waste, rather than working around it?",
    },
  },
  "economic-viability": {
    A: {
      statements: [
        s("economic-viability", "A", 1, "Accelerating migration while dismantling local infrastructure means running both in parallel during the transition — a real cost spike exactly when the budget is limited."),
        s("economic-viability", "A", 2, "Migration costs are largely usage-based and can be phased, but a faster pace still front-loads more spend into the limited-budget period."),
        s("economic-viability", "A", 3, "Retiring local infrastructure sooner also retires its ongoing maintenance cost sooner, partially offsetting the migration spend within the same budget cycle."),
      ],
      clue: "What does running local infrastructure and an accelerated migration at the same time do to a budget that's already limited?",
    },
    B: {
      statements: [
        s("economic-viability", "B", 1, "Building binding governance needs new tooling, policy work, and cross-team time — a real cost even though it touches no hardware."),
        s("economic-viability", "B", 2, "Mostly a process and tooling investment rather than infrastructure spend, so it fits a limited budget more easily than a migration or hardware change."),
        s("economic-viability", "B", 3, "Once in place, governance prevents the kind of uncontrolled departmental spend the case already describes — a direct, ongoing cost saving on top of a low setup cost."),
      ],
      clue: "Which of the three options needs the least new infrastructure spend to get started?",
    },
    C: {
      statements: [
        s("economic-viability", "C", 1, "Technical optimisation work still needs engineering time to find and safely remove waste — not free, even without new procurement."),
        s("economic-viability", "C", 2, "Mostly delivers savings from resources already being paid for, so it can pay for itself faster than an option needing new spend."),
        s("economic-viability", "C", 3, "Removing idle and over-provisioned resources reduces the cloud bill directly and immediately — the most budget-friendly option of the three under a tight constraint."),
      ],
      clue: "Which option reduces an existing cost directly, rather than adding a new one?",
    },
  },
  feasibility: {
    A: {
      statements: [
        s("feasibility", "A", 1, "Requires coordinating migration schedules, application compatibility checks, and a cutover plan across every team still running local infrastructure."),
        s("feasibility", "A", 2, "Some applications are already partly on cloud, so accelerating is scaling an existing effort rather than starting a new one."),
        s("feasibility", "A", 3, "Can be executed through the existing migration pipeline and vendor relationship, with minimal new process to design."),
      ],
      clue: "Is accelerating an already-started migration the same kind of effort as starting one from zero?",
    },
    B: {
      statements: [
        s("feasibility", "B", 1, "Requires agreement across departments that currently order cloud services independently and have little incentive to accept new central control."),
        s("feasibility", "B", 2, "Can start with a lightweight policy and a basic usage dashboard, expanding scope once departments see the value."),
        s("feasibility", "B", 3, "Can be piloted with a single policy area — cost visibility, for instance — first, building buy-in before wider rollout."),
      ],
      clue: "Re-read the constraint on departments wanting flexibility and little central control — what does that mean for rolling out governance all at once versus gradually?",
    },
    C: {
      statements: [
        s("feasibility", "C", 1, "Requires detailed workload-level data that, per the case, isn't fully available yet — some optimisation work would have to start with an audit."),
        s("feasibility", "C", 2, "Can begin with the workloads Flexora already has visibility into, expanding as data improves."),
        s("feasibility", "C", 3, "Can be piloted on a small, well-understood set of workloads within weeks, since it changes configuration and usage patterns, not organisational structure."),
      ],
      clue: "Does optimisation need perfect data everywhere before it can start anywhere?",
    },
  },
  "transparency-gain": {
    A: {
      statements: [
        s("transparency-gain", "A", 1, "Migrating more workloads adds more cloud infrastructure to track, without adding any new visibility into how it's used."),
        s("transparency-gain", "A", 2, "Cloud-native monitoring tools that come with migrated workloads add some visibility Flexora didn't have on-premises."),
        s("transparency-gain", "A", 3, "A full migration, done with a monitoring plan, could give Flexora more consistent, centralised visibility than the mixed on-prem/cloud setup it replaces."),
      ],
      clue: "Does moving a workload to the cloud automatically mean someone is watching what it costs or how it's used?",
    },
    B: {
      statements: [
        s("transparency-gain", "B", 1, "A policy document alone doesn't generate any data — it only says what should be tracked."),
        s("transparency-gain", "B", 2, "Introduces some reporting requirements, giving partial visibility into spend and usage across departments."),
        s("transparency-gain", "B", 3, "Directly closes the transparency gap the case names — usage, cost, workloads, and responsibilities all in one place — the largest transparency gain of the three by design."),
      ],
      clue: "Which option is explicitly built to close the exact transparency gap the case describes?",
    },
    C: {
      statements: [
        s("transparency-gain", "C", 1, "Optimisation work generates findings about specific workloads, but doesn't necessarily produce an ongoing reporting structure."),
        s("transparency-gain", "C", 2, "Requires building some monitoring to find waste in the first place, which adds real but narrow visibility."),
        s("transparency-gain", "C", 3, "Sustained optimisation work naturally produces detailed, ongoing usage data as a by-product, feeding directly into whatever governance model comes next."),
      ],
      clue: "Does finding and fixing inefficiency require building visibility into usage first?",
    },
  },
  risk: {
    A: {
      statements: [
        s("risk", "A", 1, "Accelerating migration while under budget and data-transparency pressure raises the chance of moving workloads before their cost and dependency implications are understood."),
        s("risk", "A", 2, "Migration risk is manageable with careful sequencing, though the faster pace leaves less time to catch problems before they compound."),
        s("risk", "A", 3, "A phased, well-tested migration plan keeps risk contained even at an accelerated pace, since each step can be validated before the next."),
      ],
      clue: "Re-read the constraint about incomplete data — what does moving faster do to the chance of a mistake going unnoticed until it's expensive?",
    },
    B: {
      statements: [
        s("risk", "B", 1, "A governance rollout risks being ignored or worked around if departments see it as central control being imposed on them."),
        s("risk", "B", 2, "Rollout risk is mostly organisational — adoption and pushback — rather than technical, and is adjustable if the policy needs revising."),
        s("risk", "B", 3, "Touches no live workloads directly, carrying no technical or availability risk, and is fully reversible if a specific rule doesn't work."),
      ],
      clue: "Which option touches zero live workloads, and what does that mean for the kind of risk it carries?",
    },
    C: {
      statements: [
        s("risk", "C", 1, "Removing resources believed to be idle carries a real risk of breaking something still quietly in use, especially with incomplete usage data."),
        s("risk", "C", 2, "Careful, staged removal with monitoring reduces the chance of an incident, though some risk of misjudging a workload's real usage remains."),
        s("risk", "C", 3, "Piloting on a small, well-understood set of workloads first keeps this risk contained and reversible before wider rollout."),
      ],
      clue: "Re-read the constraint about incomplete data — what's the risk of removing a resource that looks idle but isn't?",
    },
  },
  "long-term-effect": {
    A: {
      statements: [
        s("long-term-effect", "A", 1, "An accelerated migration is a one-time shift — once complete, it says nothing about whether future cloud growth will be managed any better than today's."),
        s("long-term-effect", "A", 2, "Leaves Flexora fully cloud-based, which simplifies some things structurally, but without governance the same uncontrolled-growth pattern can simply continue in the new environment."),
        s("long-term-effect", "A", 3, "Combined with the other two measures later, a completed migration is a stable foundation — but taken alone, it does not structurally prevent the problems the case describes from recurring."),
      ],
      clue: "Once the migration is done, does the case's underlying problem — uncontrolled, ad hoc cloud use — actually go away?",
    },
    B: {
      statements: [
        s("long-term-effect", "B", 1, "A governance policy that isn't actively maintained can quietly stop being followed within a year, the same way many internal policies fade."),
        s("long-term-effect", "B", 2, "Provides a lasting structure for decisions, as long as someone keeps enforcing and updating it as the organisation changes."),
        s("long-term-effect", "B", 3, "Structurally changes how every future cloud decision gets made, making it the only option of the three whose effect compounds rather than fades over time."),
      ],
      clue: "Which option changes the organisation's decision-making structure permanently, rather than fixing a specific problem once?",
    },
    C: {
      statements: [
        s("long-term-effect", "C", 1, "Optimisation savings tend to erode over time as new workloads are added the same ad hoc way the old ones were."),
        s("long-term-effect", "C", 2, "Produces a cleaner baseline that lasts until the next round of uncontrolled growth catches up with it."),
        s("long-term-effect", "C", 3, "If paired with ongoing monitoring, optimisation gains can be sustained rather than eroded — but without that pairing, the effect is temporary by nature."),
      ],
      clue: "Without governance to prevent new waste, how long does a one-time clean-up's benefit actually last?",
    },
  },
};

// ---------------------------------------------------------------------------
// Stage 6 — Reflection (distinct, journal-style; still feeds the report)
// ---------------------------------------------------------------------------
export type ReflectionPrompt = { id: string; question: string };

export const REFLECTION_PROMPTS: ReflectionPrompt[] = [
  { id: "quick-solution", question: "Where might the cloud be seen in my organisation as a quick solution without properly assessing the long-term effects?" },
  { id: "unnecessary-consumption", question: "Which cloud use probably generates unnecessary resource or energy consumption in our organisation?" },
  { id: "attractive-but-weak", question: "Which decision would be attractive in the short term, but too weak strategically?" },
  { id: "prioritise-differently", question: "What would a head of department, architect, manager, or consultant have to prioritise differently than a purely operationally minded implementer?" },
];

// ---------------------------------------------------------------------------
// Task 2 — copy
// ---------------------------------------------------------------------------
export const FOLLOWUP_COUNT = 2;
export const RISK_COUNT = 2;
export const JUSTIFY_MIN_WORDS = 40;

export const TASK2 = {
  kicker: "Task 2",
  heading: "The Prioritization Decision",
  intro:
    "Work through the seven stages below — nothing is locked. Score the seven dimensions, watch the radar take shape, then make and defend a call under real uncertainty.",
  orderBanner: "Suggested order: Stage 1 → 7. You can work in any order — the report at the end fills in as you go.",
  stage1: { heading: "Stage 1 — The Situation", instructions: "Read the three options and five general conditions. Click each card to expand it." },
  stage2: {
    heading: "Stage 2 — Assess the 7 Dimensions",
    instructions: "For each dimension, pick the one statement under each option that best matches Flexora's situation. Use Show Clue if you're unsure — it points at the reasoning, not the answer. The radar on the right builds live as you answer.",
  },
  stage3: {
    heading: "Stage 3 — Make the Call",
    instructions: "Based on the radar you've just built, choose one option as your final priority and justify it in writing.",
    pickLabel: "Final recommendation",
    pickCaption: "Select the option you'd actually recommend to Flexora's leadership.",
    justifyLabel: "Justification",
    justifyCaption: `Justify your choice — explicitly note what information is still missing and why you're deciding anyway. Aim for at least ${JUSTIFY_MIN_WORDS} words.`,
  },
  stage4: {
    heading: "Stage 4 — Follow-Up Decisions",
    instructions: "What are the most important follow-up decisions that result from this prioritisation?",
  },
  stage5: {
    heading: "Stage 5 — Two Risks of the Wrong Shortcut",
    instructions: "Describe two risks if a line of measures is chosen that is attractive in the short term but structurally weak — even if it isn't the option you recommended.",
  },
  stage6: {
    heading: "Stage 6 — Reflection",
    instructions: "Four questions to answer honestly and personally — these feed the report too, but there's no right answer to check here.",
  },
  stage7: {
    heading: "Stage 7 — Live Report",
    instructions: "A read-only recap of everything above, and the structured memo it produces — ready to export once every stage is complete.",
  },
  export: {
    filenameLevel: 2,
    filenameTask: 1,
    taskLabel: "Prioritization Decision Memo",
    docHeading: "Prioritization Decision Memo",
  },
} as const;
