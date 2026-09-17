/**
 * Route 1 material — four sections, S1–S4, all taught before the task begins.
 *
 * Day 13 is a single-route day (Module 9, Day 1 of 1) and deliberately spends
 * less time in material than Day 11 or Day 12 (~30 minutes here vs. ~60) —
 * see lib/route1/sections.ts for why. Depth per section is not cut to make
 * that budget: each section is written so its "reasoning" rules alone are
 * enough to answer every triage, escalation and deep-dive judgment the task
 * asks for (CLAUDE.md §11) — S1+S2 ground the triage step, S3 grounds the
 * escalation step, and S3+S4 ground the deep dive.
 */

import type { MaterialSection } from "@/lib/materialSection";
import type { MaterialSectionId } from "./sections";

export const S1_LEVER: MaterialSection<MaterialSectionId> = {
  id: "lever",
  code: "S1",
  n: 1,
  icon: "link",
  kicker: "S1 · The lever, not the guarantee",
  title: "Digitalisation as a sustainability lever",
  standfirst:
    "Digitalisation is not automatically sustainable — it is a lever that can move either way, and which way it moves depends on what it actually removes.",
  definition:
    "Digitalisation replaces paper, manual coordination or manual measurement with digital systems. As a lever it works by removing a real cost — material, travel, error-correction, idle time. It does not work simply by existing.",
  insight:
    "Five mechanisms carry that reduction — transparency, efficiency, monitoring & management, automation, data-based optimisation — each shown below with a live example. Each can also just add a digital layer on top of an unchanged physical one: cost without reduction.",
  takeaway:
    "Before crediting an initiative as a win, name what it actually removed. Nothing removed means new capability, not sustainability.",
  body: [
    {
      heading: "Why 'digital' and 'sustainable' are not synonyms",
      paragraphs: [
        "A dashboard nobody reviews still consumes storage for a transparency benefit never realised. Digitalisation is a lever with two ends — check which one an initiative actually pulled.",
      ],
    },
  ],
  reasoning: [
    "A signal counts as a Positive Signal only if it names a concrete reduction — a specific trip, form, redundant measurement, physical archive or idle resource that stopped happening. A claim that something is now 'more efficient' or 'more visible' without naming what disappeared is not enough on its own.",
    "New digital capability is not automatically positive. If a signal only describes something new appearing — a dashboard, a platform, a new kind of analysis — check whether it replaced or removed anything before tagging it Positive; if nothing did, treat the appearance itself as the finding.",
  ],
  callout: {
    label: "Industry note",
    text: "The EU's Green Deal Digital Strategy names digitalisation as a Green Deal enabler on the explicit condition that its own footprint is measured and managed — the strategy does not assume the win, and neither should a reading of any single initiative.",
  },
  references: [
    {
      label: "European Commission — Shaping Europe's Digital Future / Green Deal Digital Strategy",
      detail: "Digitalisation named as a sustainability enabler, conditional on its own footprint being measured.",
    },
    {
      label: "GHG Protocol — ICT Sector Guidance",
      detail: "Accounting boundary for digital infrastructure emissions across an organisation's value chain.",
    },
    {
      label: "IEA, Energy and AI (2025)",
      detail: "≈415 TWh global data-centre electricity demand, ≈1.5% of global electricity use — the scale a lever this size is working against.",
    },
  ],
  minutes: 7,
};

export const S2_IMPACT: MaterialSection<MaterialSectionId> = {
  id: "impact",
  code: "S2",
  n: 2,
  icon: "layers",
  kicker: "S2 · What the system does vs. what changes around it",
  title: "Direct vs. indirect environmental impact",
  standfirst:
    "If it happens because the digital system itself runs, it's direct. If it happens because people or processes change around it, it's indirect.",
  definition:
    "Direct impact is the system's own resource draw — energy, hardware, compute, storage, network. Indirect impact is what changes around it — behaviour, data growth, new services, faster processes.",
  insight:
    "Most initiatives produce both. A finding marked only direct or only indirect usually means the other half was never asked about — tap each example below to practise the split.",
  takeaway:
    "One test: did this happen because the system itself is running, or because a person or process changed around it? The first is direct; the second is indirect.",
  body: [
    {
      heading: "Why the boundary matters for accountability",
      paragraphs: [
        "Direct impact is fixed with a technical lever — better hardware, a smaller footprint. Indirect impact is fixed with a process lever — a habit, a policy. A finding sorted into the wrong half gets escalated to the wrong owner.",
      ],
    },
  ],
  reasoning: [
    "Apply the test literally: does the effect exist because the system is running right now (direct), or because a process or a person's behaviour changed as a result of the system existing (indirect)? Most signals clearly fit one side once the test is applied to the actual mechanism described, not to the department involved.",
    "A rising resource figure — more storage, more compute, more requests — is not automatically direct just because the number looks technical. If the rise is driven by people generating or requesting more because it is now easy to, that is an indirect effect.",
  ],
  callout: {
    label: "Industry note",
    text: "GHG Protocol Scope 2 covers a company's own direct energy purchase for its digital infrastructure; Scope 3 covers what its digital products and services cause downstream. The direct/indirect split in this section maps onto that same accounting boundary.",
  },
  references: [
    {
      label: "GHG Protocol — Scope 2 and Scope 3 Standards",
      detail: "Direct operational energy vs. value-chain and downstream consequences.",
    },
    {
      label: "EU Energy Efficiency Directive (EU/2023/1791)",
      detail: "Data-centre energy reporting obligations — a direct-impact measurement requirement.",
    },
    {
      label: "IEA, Energy and AI (2025)",
      detail: "Distinguishes data-centre direct demand from AI- and digitalisation-driven indirect demand growth across the wider economy.",
    },
  ],
  minutes: 7,
};

export const S3_REBOUND: MaterialSection<MaterialSectionId> = {
  id: "rebound",
  code: "S3",
  n: 3,
  icon: "cycle",
  kicker: "S3 · Why an efficiency gain doesn't automatically stick",
  title: "The rebound effect and trade-offs",
  standfirst:
    "An efficiency gain is not automatically banked as savings — it is usually spent, in part or in full, unless something actively stops that from happening.",
  definition:
    "The rebound effect: an efficiency gain gets partly or fully spent through increased use, instead of banked as a saving — named after economist William Stanley Jevons, who observed cheaper coal use raise total coal consumption in the 19th century.",
  insight:
    "Four gains — convenience, speed, automation, transparency — tend to raise resource use even while solving a real problem. The fifth, resource use itself, is where the bill lands unless someone deliberately caps it. Step through the stages below to watch it happen.",
  takeaway:
    "An efficiency claim is incomplete until it says what stops the freed-up capacity being used elsewhere.",
  body: [
    {
      heading: "A ratio claim vs. an absolute claim",
      paragraphs: [
        "'We made it more efficient' and 'we reduced total resource use' are different claims — the first about a ratio, the second about an absolute. Rebound is the gap that can open between them.",
      ],
    },
  ],
  reasoning: [
    "An improvement approach that only claims an efficiency gain, without naming what stops the freed-up capacity from being used elsewhere, is incomplete. Either name the rebound risk directly and how it's managed, or state concretely why it doesn't apply in this case.",
    "Escalating a signal for a deeper look is itself a trade-off judgment: time spent on one signal is time not spent on another. Argue from leverage — what's expensive, structural, or explains other findings — not from which signal happens to be quickest to write up.",
  ],
  callout: {
    label: "Industry note",
    text: "ISO/IEC 21031:2024 (Software Carbon Intensity) requires a stated functional unit precisely because rebound makes a raw efficiency ratio misleading on its own — without a fixed unit of work, a system reported as 'more efficient' can still show rising total impact as usage grows into the freed-up capacity.",
  },
  references: [
    {
      label: "W. S. Jevons, The Coal Question (1865)",
      detail: "The original observed rebound — the Jevons paradox — named once as background.",
    },
    {
      label: "ISO/IEC 21031:2024 — Software Carbon Intensity",
      detail: "Functional-unit requirement that keeps an efficiency ratio comparable across rebound conditions.",
    },
    {
      label: "Green Software Foundation — SCI principles",
      detail: "Treats efficiency without demand management as an incomplete measure of impact.",
    },
  ],
  minutes: 8,
};

export const S4_FRAMEWORK: MaterialSection<MaterialSectionId> = {
  id: "framework",
  code: "S4",
  n: 4,
  icon: "target",
  kicker: "S4 · Sorting before acting",
  title: "The six-area diagnostic framework",
  standfirst:
    "Digitalisation effects need to be sorted by area before they can be acted on — and management's role is to prioritise across areas, not just react to individual findings.",
  definition:
    "Six areas sort any finding: Process Efficiency, Data Use, Infrastructure, User Behaviour, Complexity — and Management, whether any of the other five gets reviewed, owned and acted on. Tap a tile below for each one's example.",
  insight:
    "A finding in the wrong area gets the wrong owner and the wrong fix — a data-growth problem handed to Infrastructure just gets more storage bought. Management isn't a seventh technical area; it's whether anyone decides across the other five at all.",
  takeaway:
    "Sort by the defect a finding actually describes, not the department you'd expect to own the fix.",
  body: [
    {
      heading: "Why Management is not just another area",
      paragraphs: [
        "A finding that names a missing review, owner or rule belongs in Management — even next to a technical-looking symptom. 'Infrastructure spend keeps rising and nobody reviews it' is a missing review loop, not an infrastructure defect.",
      ],
    },
  ],
  reasoning: [
    "Sort by the effect the signal actually reports, not by the department you'd expect to own the fix — a rising storage bill caused by nobody archiving old records is Data Use, not Infrastructure, even though Infrastructure pays the invoice.",
    "If a finding describes an absence of review, ownership or a rule rather than a specific technical or behavioural defect, it belongs in Management even when it appears alongside a technical symptom.",
    "Complexity and Process Efficiency are the pair most often confused: Process Efficiency is about how one workflow moves; Complexity is about how many systems, integrations or exceptions a workflow has to pass through to get there. A signal naming a count of systems or integrations points to Complexity; a signal naming steps, delay or rework in one workflow points to Process Efficiency.",
  ],
  callout: {
    label: "Industry note",
    text: "iSAQB's CPSA Module GREEN treats 'who reviews the evidence and turns it into a decision' as a distinct competence area from the technical sustainability levers themselves — this section's Management area maps directly onto that distinction.",
  },
  references: [
    {
      label: "iSAQB CPSA Module GREEN",
      detail: "Distinguishes technical sustainability levers from the management and governance layer that decides on them.",
    },
    {
      label: "ISO/IEC 25010",
      detail: "Software quality characteristics (maintainability, efficiency, compatibility) behind the framework's technical areas.",
    },
    {
      label: "COBIT / IT governance ownership conventions",
      detail: "Accountability structures behind the Management area's review-cadence-and-owner test.",
    },
  ],
  minutes: 8,
};

export const MATERIAL: MaterialSection<MaterialSectionId>[] = [
  S1_LEVER,
  S2_IMPACT,
  S3_REBOUND,
  S4_FRAMEWORK,
];

export const materialById = (id: MaterialSectionId) => MATERIAL.find((m) => m.id === id)!;

/** Facilitator minutes across the whole block — ~30, the deliberately inverted Day 11 ratio (see sections.ts). */
export const MATERIAL_MINUTES = MATERIAL.reduce((sum, s) => sum + s.minutes, 0);
