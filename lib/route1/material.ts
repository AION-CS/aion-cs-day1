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
    "Digitalisation is the shift from analogue, physical or manual ways of working — paper documents, in-person coordination, manual measurement — to digital systems, data and software. As a sustainability lever, it works by reducing something that used to cost material, travel, error-correction or idle time. It does not work simply by existing.",
  insight:
    "Five mechanisms carry that reduction: transparency (you can now see what you couldn't before), efficiency (a task takes fewer resources to complete), monitoring and management (a system steers itself instead of running on assumption), automation (a manual step disappears entirely), and data-based optimisation (a decision improves because it now has real evidence behind it). Each is a genuine, well-documented channel for reduced impact — and each can just as easily add a new digital layer on top of an unchanged physical one, which produces cost without reduction.",
  takeaway:
    "Before crediting a digitalisation initiative as a sustainability win, name the specific thing it removed — a trip, a form, a redundant measurement, an idle asset. If nothing concrete disappeared, the initiative added capability, which is a different claim.",
  body: [
    {
      heading: "Why 'digital' and 'sustainable' are not synonyms",
      paragraphs: [
        "A dashboard that reports data nobody acts on still consumes storage and compute, for a transparency benefit that is never actually realised. A monitoring platform that nobody reviews on a cadence produces the same problem in a different area. Digitalisation is a lever with two ends; assessing any one initiative means checking which end actually got pulled, not assuming the sustainable end is the default.",
        "This is also why the same five mechanisms recur across very different initiatives — an automated approval workflow and a real-time equipment monitor both claim 'automation', but only one of them necessarily removes a physical cost that used to exist.",
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
    "Direct impact is the resource draw of the digital system itself: the energy its servers and devices use, the hardware it requires, the compute it runs, the storage it fills, the network capacity it occupies. Indirect impact is what changes in the world because the system exists: behaviour that shifts, data that grows because it's now easy to collect, new services built on top of it, processes that speed up and therefore run more often.",
  insight:
    "The two are not competing categories — most digital initiatives produce both. A new dashboard has a direct footprint (the compute and storage it uses) and, if it changes what people decide or how often they check something, an indirect one too. Treating a finding as only direct or only indirect usually means the indirect half was never asked about.",
  takeaway:
    "Apply one test: did this happen because the system itself was running, or because a person or a process changed what they do as a result of the system existing? The first is direct; the second is indirect.",
  body: [
    {
      heading: "Why the boundary matters for accountability",
      paragraphs: [
        "Direct impact is owned by whoever runs the infrastructure — IT, a cloud vendor, a facilities team — and is fixed with a technical lever: better hardware, more efficient storage, a smaller footprint per workload. Indirect impact is owned by whoever changed their behaviour — a department that now runs a report daily instead of monthly because it's easy to, a team that keeps every version of a file because storage now feels free to them — and is fixed with a process or policy lever instead.",
        "A finding sorted into the wrong half gets escalated to the wrong owner and fixed with the wrong lever, which is why the test has to be applied to what the signal actually describes, not to which team happens to be mentioned in it.",
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
    "The rebound effect is the tendency for an efficiency gain to be partly or fully offset by increased use of the now-cheaper resource, rather than banked as a net saving. It takes its name from the 19th-century economist William Stanley Jevons, who first observed it for coal: steam-engine efficiency lowered the effective cost of using coal, and total coal consumption rose rather than fell — the Jevons paradox.",
  insight:
    "A digital process that becomes ten times cheaper to run does not automatically produce a tenth of the resource use — it often produces something close to the same use, because the lower cost removes the reason anyone had to ration it. Five effects recur wherever this happens, and four of them pull in the same direction: gains in convenience, speed, automation and transparency each tend to increase resource use even as they solve a real problem, unless the fifth — resource use itself — is actively managed rather than left to absorb the difference.",
  takeaway:
    "An efficiency claim is incomplete until it says what stops the freed-up capacity from being used elsewhere. If nothing stops it, expect rebound — partial or full — and treat the trade-off as something to manage, not something to assume away.",
  body: [
    {
      heading: "The five-way trade-off",
      paragraphs: [
        "A faster report gets run more often. An automated task runs on a fixed schedule instead of on someone's judgement about whether it's needed. A transparent dashboard invites more queries than the one report it replaced. None of convenience, speed, automation or transparency are wrong to pursue — each solves a real problem. But each one has to be paid for somewhere, and the fifth item in the trade-off, resource use, is usually where the bill lands unless someone deliberately caps it.",
        "This is also why 'we made it more efficient' and 'we reduced total resource use' are different claims. The first is a statement about a ratio; the second is a statement about an absolute, and rebound is exactly the gap that can open up between them.",
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
    "The six-area framework sorts any digitalisation finding into exactly one of six areas: Process Efficiency (how work moves through the organisation), Data Use (how much data is collected, duplicated and kept), Infrastructure (the hardware, compute, storage and network a system runs on), User Behaviour (what people do differently because a system exists), Complexity (how many systems, integrations and exceptions have accumulated), and Management (whether any of the above is reviewed, owned and acted on).",
  insight:
    "A finding sorted into the wrong area gets escalated to the wrong owner and fixed with the wrong lever — a data-growth problem handed to Infrastructure gets more storage bought, not less data generated. Management is not a seventh technical category alongside the other five; it is the question of whether anyone is deciding across them at all. A finding belongs there when what's missing is a review cadence, an owner or a rule — not a specific technical or behavioural fix.",
  takeaway:
    "Sort each finding by the defect it actually describes, not by the department you'd expect to own the fix or the cause you suspect sits behind it.",
  body: [
    {
      heading: "Why Management is not just another area",
      paragraphs: [
        "A finding that belongs in Process Efficiency, Data Use, Infrastructure, User Behaviour or Complexity describes something specific enough to fix directly — a step to remove, a dataset to archive, a server to right-size, a habit to change, an integration to retire. A finding that belongs in Management describes an absence instead — no review cadence, no named owner, no rule — which is exactly why findings in the other five areas keep recurring even after one instance of each has been fixed.",
        "A finding can look technical on the surface and still belong in Management: 'infrastructure spend keeps rising and nobody reviews the trend' is not an infrastructure defect, it is a missing review loop wearing infrastructure's clothing.",
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
