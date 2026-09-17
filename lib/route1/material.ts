/**
 * Route 1 material — four sections, S1–S4, all taught before Task 1 begins.
 *
 * Module 10's Task 1 asks a participant to sort seven case indications across
 * six areas, three root-cause types and two timeframe types — eighteen
 * distinct judgment calls in total. Every one of those calls has to trace
 * back to a rule stated here (CLAUDE.md §11): S1+S2 ground "Economic
 * viability"; S3 grounds "User behaviour", "Leadership", "Communication" and
 * the three root-cause types; S4 grounds "Compliance/Regulation",
 * "Management" and the short-term/structural split. Read section 3 of the
 * build prompt's gap-check before touching this file — every term Task 1
 * uses must resolve to a sentence below, not just to the task's own
 * instructions.
 */

import type { MaterialSection } from "@/lib/materialSection";
import type { MaterialSectionId } from "./sections";

export const S1_BUSINESS_CASE: MaterialSection<MaterialSectionId> = {
  id: "businessCase",
  code: "S1",
  n: 1,
  icon: "coins",
  kicker: "S1 · Why economic assessment decides whether measures survive",
  title: "The Green IT business case",
  standfirst:
    "Green IT measures rarely fail because they are technically wrong. They fail because they are economically unproven at the point a budget decision has to be made.",
  definition:
    "A measure's economic viability is whether the numbers — investment cost, operating cost, and quantified benefit — justify it once they are actually compared. \"This reduces our footprint\" is necessary but not sufficient in front of a CFO or a budget committee: it has to become a business case with defensible numbers, or it stays a good intention.",
  insight:
    "Toggle the cost and benefit chips below and watch the scale move, then try the ROI calculator underneath it. There is no submission here — the point is to feel the mechanics before Task 1 asks you to reason about a business case qualitatively, without a calculator in front of you.",
  takeaway:
    "Before judging any proposal, ask which cost types and which benefit types it actually named. A case built on one cost type against one benefit type is incomplete, not just weak.",
  body: [
    {
      heading: "Three time horizons, routinely blurred together",
      paragraphs: [
        "Short-term costs are the money that has to be spent now: efficient hardware, facility retrofits, consulting fees, licence changes.",
        "Long-term savings are the money that comes back over the asset's life: lower electricity bills, lower disposal fees, fewer replacement cycles.",
        "Strategic benefit is value that doesn't show up as a line item in the short run at all: risk reduction, improved compliance posture, reputational capital, employer branding, resilience against future regulation or energy-price shocks.",
        "A measure that only \"sounds sustainable\" but cannot be located on this three-part map loses every budget conversation to a measure that can — even a less ambitious one.",
      ],
    },
    {
      heading: "The full cost and benefit lists",
      paragraphs: [
        "Cost types a business case has to account for: investment costs (new hardware or software, infrastructure upgrades, certifications), operating costs (energy, maintenance, licensing, support contracts), conversion or migration costs (data migration, integration work, temporary parallel operation), training effort, and monitoring and management costs (dashboards, KPI tracking, audit and reporting overhead).",
        "Benefit types, most of which are systematically under-counted in weak business cases: energy savings, lower operating costs, longer service life (deferred replacement capex, better residual value), lower disposal costs, risk reduction (avoided fines, avoided supply or energy-price shocks), reputational gains (ESG ratings, tender eligibility, employer branding), and better compliance capability (reduced audit friction, faster reporting cycles).",
      ],
    },
  ],
  reasoning: [
    "A proposal that only cites \"sustainability benefit\" without naming an investment cost, an operating cost and a quantified saving has not established economic viability yet — treat \"no ROI case\" as a data gap, not a leadership or communication problem, even when a manager or Finance is the one raising it.",
    "List the specific cost types (investment, operating, conversion, training, monitoring) and benefit types (energy, operating, service life, disposal, risk, reputation, compliance capability) actually named or missing before judging whether a business case holds up — a case that compares one cost type against one benefit type is incomplete, not just weak.",
  ],
  callout: {
    label: "Industry note",
    text: "Total Cost of Ownership (TCO) methodology is the standard way finance functions force exactly this multi-cost-type, multi-benefit-type comparison — a Green IT proposal built on a TCO basis is structurally harder to reject on \"you didn't count everything\" grounds than one built on a single up-front price.",
  },
  references: [
    {
      label: "Total Cost of Ownership (TCO) methodology",
      detail: "The standard finance framework behind the investment/operating/conversion/training/monitoring cost breakdown above.",
    },
    {
      label: "GHG Protocol — Corporate Standard",
      detail: "The accounting basis most energy- and disposal-saving figures in a Green IT business case ultimately trace back to.",
    },
  ],
  minutes: 15,
};

export const S2_THREE_LENS: MaterialSection<MaterialSectionId> = {
  id: "threeLens",
  code: "S2",
  n: 2,
  icon: "layers",
  kicker: "S2 · One lens is not enough",
  title: "ROI is not only a financial number",
  standfirst:
    "Treating ROI as a purely financial calculation works for fast, easily-metered payback. It systematically undervalues the measures — most behaviour-change and regulatory-readiness work — whose payoff is strategic or risk-related instead.",
  definition:
    "Three lenses apply to the same measure, not just one: the financial lens (hard euro savings against hard euro cost — what the Section 1 calculator produces), the strategic lens (tender eligibility, ESG rating exposure, employer branding — real economic value that never appears on a monthly P&L), and the risk lens (a fine avoided, a reputational incident avoided, a compliance failure avoided — a negative that never becomes a transaction but is real value all the same).",
  insight:
    "Toggle the three lenses on the example measures below. Watch the ranking of measures change depending on which lens or lenses are active — that instability is exactly why a single-lens argument is fragile.",
  takeaway:
    "A measure that scores low financially but high strategically and on risk can be the right first move even though it \"loses\" a narrow ROI comparison. A measure that scores well financially but poorly on risk can be a bad decision dressed up as a good one.",
  body: [
    {
      heading: "Why Finance asks first, but shouldn't decide alone",
      paragraphs: [
        "The financial lens is what Finance will ask for first, and a business case should always produce it where it can. But senior decision-makers are expected to hold all three lenses at once, not default to whichever one is easiest to calculate — a measure that only wins on the lens that's easiest to compute is not automatically the right one to fund first.",
        "Compliance-readiness and behaviour-change measures typically score strongest on the strategic and risk lenses precisely because their payoff is avoided cost and avoided exposure, not a metered saving. A missing ROI number is a financial-lens gap; a missing case for tender eligibility, ESG exposure, or avoided fines is a strategic- or risk-lens gap — naming which lens is missing is more useful than saying \"the business case is weak.\"",
      ],
    },
  ],
  reasoning: [
    "Before ruling a measure \"not viable\", check whether its case was ever made on the strategic or risk lens, not only the financial one — a measure that fails a narrow financial ROI test can still be the right first move if it scores well on compliance-readiness or reputational risk.",
    "A missing ROI number is a financial-lens (economic viability) gap; a missing case for tender eligibility, ESG exposure or avoided fines is still an economic-viability gap, just argued on a different lens — it does not become a Compliance/Regulation finding just because a regulation happens to be the reason the risk exists.",
  ],
  callout: {
    label: "Industry note",
    text: "Public and increasingly enterprise procurement now embeds sustainability criteria — energy-efficiency ratings, ecolabels such as TCO Certified or the EU Ecolabel — as tender conditions, not preferences. A company that cannot evidence its standards can be excluded from a bid outright: a textbook case of strategic-lens value with no line on a P&L.",
  },
  references: [
    {
      label: "EU Public Procurement Directive (2014/24/EU)",
      detail: "Legal basis for embedding environmental and social criteria, including ecolabels, in public tender conditions.",
    },
    {
      label: "ISO 14001 — Environmental Management Systems",
      detail: "The certification base most ESG-rating and tender-eligibility strategic-lens claims are built on.",
    },
  ],
  minutes: 15,
};

export const S3_BEHAVIOUR_CHANGE: MaterialSection<MaterialSectionId> = {
  id: "behaviourChange",
  code: "S3",
  n: 3,
  icon: "person",
  kicker: "S3 · The gap between rated and realised savings",
  title: "Why technical solutions fail without behavioural change",
  standfirst:
    "Green IT technology can be procured, installed and configured correctly and still fail to deliver its projected impact — because realised saving depends on how people actually use the system, not on its theoretical capability.",
  definition:
    "User behaviour is what people actually do day to day — independent of what a system or policy technically allows. Typical fields where the gap between theoretical and realised savings shows up: device and shutdown behaviour, printing behaviour, data and storage habits, acceptance of longer device lifecycles, and how a written policy is actually handled once it exists.",
  insight:
    "Drag the adoption-rate slider (or click one of the three preset scenarios) and watch realised savings pull away from theoretical savings. A technically excellent measure with no behavioural design behind it is an incomplete measure — its projected savings are not credible until adoption is accounted for.",
  takeaway:
    "Behavioural change needs the same rigour as the business case: clear rules, a stated why, visible leadership, low friction, and a place to live once the announcement is over.",
  body: [
    {
      heading: "Success factors for behavioural change",
      paragraphs: [
        "Clear rules — ambiguous guidance (\"try to save energy where reasonable\") produces no measurable change; specific, checkable rules do.",
        "Communication — the why has to be stated, not assumed; people who understand the reason for a rule comply more consistently than people who are only told the rule itself.",
        "Leadership — managers who visibly follow the same rules (the role-model effect) get far higher team compliance than managers who exempt themselves. Leadership is distinct from a general management gap: it is specifically about whether the people already responsible for a rule are visibly living up to it themselves.",
        "Ease of use — if the sustainable option takes more effort than the default, adoption stays low regardless of how well the rule was communicated; removing friction (auto-shutdown scheduling, one-click duplex printing) consistently outperforms asking people to remember the harder option.",
        "Incentive systems and the role-model effect — even small, visible recognition measurably increases sustained compliance versus a rule with no feedback loop at all, and behaviour demonstrated by peers and leaders spreads faster than behaviour only described in a policy document.",
        "Embedding in processes — a rule that lives only in a policy PDF decays; a rule built into onboarding, procurement workflows or default device configuration persists.",
      ],
    },
    {
      heading: "A sixth field: Management itself",
      paragraphs: [
        "A measure can have a sound business case, a well-designed behaviour-change plan, and full compliance grounding, and still stall because nobody set a timeline, named an owner, or told two inconsistent managers that they were being inconsistent. That absence is a Management gap, not a Leadership one: Leadership is role-modelling a standard that already exists; Management is whether the standard, priority, timeline or enforcement exists — and is actually being held to — in the first place.",
      ],
    },
    {
      heading: "Three root causes behind most stalled measures",
      paragraphs: [
        "A data gap: the numbers, evidence or documentation needed to decide or to prove something don't exist yet — fixed by measurement or documentation.",
        "A behavioural pattern: people are predictably doing something that undermines the measure — fixed by one or more of the success factors above.",
        "A management deficit: a decision, priority, timeline, resource or enforcement that should have been made, wasn't — fixed by someone with the authority to decide, resource or enforce actually doing so.",
        "Distinguishing between the three matters because each has a different fix — treating a management deficit as if it were a communication problem, for example, produces a clearer memo about a decision that still never gets made.",
      ],
    },
  ],
  reasoning: [
    "An indication is a User Behaviour finding only when it describes what people are actually doing — using devices, printing, storing data, resisting a longer refresh cycle — not when it describes an absent rule, a missing explanation, or inconsistent enforcement, which point to Management, Communication or Leadership instead.",
    "Leadership and Management are not the same pillar. Leadership is whether the people already responsible for a rule are visibly following and enforcing it themselves. Management is whether anyone decided, prioritised, timetabled, resourced, or is holding people to a consistent standard in the first place. An indication about managers enforcing a rule inconsistently, with nobody having flagged that inconsistency, is a Management gap even though managers are the ones failing to enforce.",
    "Distinguish the three root causes by what would actually fix the gap: a data gap needs measurement, quantification or documentation that doesn't exist yet; a behavioural pattern needs one of the success factors — clear rules, communication, leadership, ease of use, incentives, embedding in process; a management deficit needs someone with authority to decide, prioritise, resource or enforce something that currently has no owner.",
  ],
  callout: {
    label: "Industry note",
    text: "BJ Fogg's Behavior Model (Stanford) and the UK Carbon Trust's guidance on employee energy engagement both converge on the same point used above: motivation alone rarely changes behaviour at scale — reducing friction and stating a clear, specific prompt does far more of the work.",
  },
  references: [
    {
      label: "BJ Fogg, Behavior Model (Stanford Behavior Design Lab)",
      detail: "Motivation, ability and prompt as the three conditions behind sustained behaviour change — the basis for \"ease of use\" above.",
    },
    {
      label: "Carbon Trust — employee engagement guidance",
      detail: "Practitioner guidance on why written energy policies fail without stated reasons and visible leadership example.",
    },
  ],
  minutes: 15,
};

export const S4_REGULATION: MaterialSection<MaterialSectionId> = {
  id: "regulation",
  code: "S4",
  n: 4,
  icon: "gavel",
  kicker: "S4 · From compliance burden to design framework",
  title: "Regulation as a management framework",
  standfirst:
    "Regulatory requirements around IT sustainability have moved from a narrow, specialist compliance topic to a mainstream driver of IT decision-making — and treating them purely as \"extra effort imposed on us\" misses what they can also do.",
  definition:
    "Four regulatory domains bear directly on Green IT decisions: transparency and reporting obligations, procurement requirements, disposal and circularity requirements, and energy efficiency obligations. Compliance/Regulation as a diagnostic area covers gaps in meeting one of these requirements itself — not who inside the company is or isn't willing to own responding to it, which is a Leadership or Management gap even when a regulation is the topic.",
  insight:
    "Click each node on the map below. Every domain gets a reactive framing and a strategic framing side by side — the same evidence trail can be treated as a burden or as reusable proof, and which framing an organisation picks is itself a management choice, not something the regulation forces.",
  takeaway:
    "Organisations that treat these requirements reactively pay a permanent tax in rushed, expensive, error-prone compliance work. Organisations that build the evidence trail into how measures are planned from day one turn a compliance cost into a repeatable capability.",
  body: [
    {
      heading: "The four domains",
      paragraphs: [
        "Transparency and reporting: the EU's Corporate Sustainability Reporting Directive (CSRD) and its European Sustainability Reporting Standards (notably ESRS E1 on climate) increasingly require companies to report energy consumption, emissions and the measures taken to reduce them — including IT's contribution under GHG Protocol Scope 2 and Scope 3 accounting.",
        "Procurement: public-sector and increasingly enterprise procurement embeds sustainability criteria — energy-efficiency ratings, ecolabels such as TCO Certified or the EU Ecolabel, circularity commitments — as tender conditions, not preferences.",
        "Disposal and circularity: the EU's WEEE Directive (2012/19/EU) sets binding collection and recycling obligations for electronic waste; the Ecodesign for Sustainable Products Regulation (ESPR) extends this toward repairability, durability and a \"digital product passport\" for traceability.",
        "Energy efficiency obligations: national instruments such as Germany's Energy Efficiency Act (EnEfG) — covered in depth in Day 7 — impose direct obligations on larger organisations to run energy or environmental management systems and report on them, applying directly to IT infrastructure decisions.",
      ],
    },
    {
      heading: "Short-term fix vs. structural fix",
      paragraphs: [
        "A short-term fix resolves the one instance in front of you: this proposal gets its ROI numbers, this manager gets a reminder, this audit request gets answered under pressure. A structural fix changes the standard process itself, so the same gap does not recur under the next proposal, the next manager, or the next audit.",
        "A recurring or systemic-sounding gap should be tagged structural even when a quick patch is also technically possible — patching the instance without changing the standard just moves the same failure to next quarter.",
      ],
    },
  ],
  reasoning: [
    "An indication is Compliance/Regulation only when the gap is about meeting the external requirement itself — audit-readiness, a reporting obligation, procurement or ecolabel criteria, disposal documentation. If the gap is really about who inside the company owns or prioritises responding to that requirement, classify it as Leadership or Management instead, even though a regulation is mentioned.",
    "Tag an indication structural when fixing it changes a standard, process or documentation trail going forward; tag it short-term when the fix is a one-off action that resolves the instance in front of you without necessarily preventing a repeat.",
  ],
  callout: {
    label: "Industry note",
    text: "A single disposal-documentation process built to satisfy the WEEE Directive can double as the evidence base for a CSRD circularity disclosure and for a tender's ecolabel requirement — one process, reused for three separate external asks. That reuse is only available to organisations that built the process as a structural capability rather than answering each ask separately, reactively, as it arrived.",
  },
  references: [
    {
      label: "Corporate Sustainability Reporting Directive (CSRD) & ESRS E1",
      detail: "EU reporting obligations for energy, emissions and the measures taken to reduce them, including IT's contribution.",
    },
    {
      label: "WEEE Directive (2012/19/EU) & Ecodesign for Sustainable Products Regulation (ESPR)",
      detail: "Binding EU disposal, recycling, repairability and traceability obligations for electronic equipment.",
    },
    {
      label: "Germany — Energy Efficiency Act (EnEfG)",
      detail: "National energy/environmental management and reporting obligations for larger organisations; covered in depth in Day 7.",
    },
  ],
  minutes: 15,
};

export const MATERIAL: MaterialSection<MaterialSectionId>[] = [
  S1_BUSINESS_CASE,
  S2_THREE_LENS,
  S3_BEHAVIOUR_CHANGE,
  S4_REGULATION,
];

export const materialById = (id: MaterialSectionId) => MATERIAL.find((m) => m.id === id)!;

/** Facilitator minutes across the whole block — 60, per the build spec's time budget. */
export const MATERIAL_MINUTES = MATERIAL.reduce((sum, s) => sum + s.minutes, 0);
