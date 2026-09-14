/**
 * S1 — Why network infrastructure is a sustainability factor.
 *
 * Every figure in this file comes from the Day 12 fact bank and carries its
 * source label where it is rendered. Diagram profiles are illustrative and are
 * labelled as such.
 */

import type { MaterialSection } from "@/lib/materialSection";
import type { MicroCheckBlock } from "@/lib/microCheck";
import type { MaterialSectionId } from "../sections";

// ---------------------------------------------------------------------------
// SVG #1 — The Utilisation Gap (illustrative 24-hour profile)
// ---------------------------------------------------------------------------

/** Traffic as % of link capacity, one value per hour boundary 00:00 → 24:00. Illustrative. */
export const GAP_TRAFFIC = [
  8, 6, 5, 4, 5, 9, 18, 34, 55, 68, 74, 78, 80, 79, 77, 74, 70, 62, 50, 40, 30, 22, 15, 10, 8,
];

/** Power draw as % of full-load power over the same hours. Nearly flat by design. Illustrative. */
export const GAP_POWER = [
  72, 71, 71, 71, 71, 72, 73, 75, 78, 80, 81, 82, 82, 82, 82, 81, 80, 79, 77, 76, 75, 74, 73, 72, 72,
];

export const GAP_LABELS = {
  disclaimer: "Illustrative profile — not measured data",
  gap: "Energy consumed without useful load",
  traffic: "Traffic load (% of capacity)",
  power: "Power draw (% of full-load power)",
};

/** The legacy-generation bars. Fact bank: UK mobile operator, reported via GSMA. */
export const LEGACY_OVERLAP = {
  title: "Legacy generation overlap",
  subject: "3G layer of a UK mobile operator",
  source: "Reported via GSMA",
  bars: [
    { id: "energy", label: "Share of mobile network energy", value: 33, display: "≈ one third" },
    { id: "voice", label: "Share of voice traffic", value: 7, display: "≈ 7%" },
    { id: "data", label: "Share of data traffic", value: 0.6, display: "≈ 0.6%" },
  ],
};

// ---------------------------------------------------------------------------
// SVG #2 — Where network energy actually sits
// ---------------------------------------------------------------------------

export type LayerScaling = "follows" | "partial" | "fixed";

export const NETWORK_LAYERS: { id: string; label: string; scaling: LayerScaling; text: string }[] = [
  {
    id: "devices",
    label: "End devices",
    scaling: "follows",
    text: "Phones, sensors and terminals. Their radios sleep between transmissions, so their draw largely follows use — but the device count sets a floor, and their energy sits in other budgets.",
  },
  {
    id: "access",
    label: "Access",
    scaling: "partial",
    text: "Radio units, base stations, access switches and Wi-Fi. A large baseline whenever switched on; it follows traffic down only where sleep states and carrier shutdown are enabled.",
  },
  {
    id: "aggregation",
    label: "Aggregation",
    scaling: "fixed",
    text: "Collects traffic from many access sites. Dimensioned for the busiest hour and powered continuously, so its draw barely moves with traffic.",
  },
  {
    id: "core",
    label: "Core / transport",
    scaling: "fixed",
    text: "Carries everything between sites and on to data centres. Core routing and optical transport run at near-constant power, whatever the hour.",
  },
  {
    id: "site",
    label: "Site infrastructure",
    scaling: "fixed",
    text: "Power conversion, cooling and redundancy. It runs whenever the equipment runs, adds conversion losses on top, and is usually booked to facilities rather than to IT.",
  },
];

export const SCALING_LEGEND: Record<LayerScaling, string> = {
  follows: "Largely follows load",
  partial: "Follows load only where sleep states are enabled",
  fixed: "Largely load-independent",
};

// ---------------------------------------------------------------------------
// The section
// ---------------------------------------------------------------------------

export const S1_INFRASTRUCTURE: MaterialSection<MaterialSectionId> = {
  id: "infrastructure",
  code: "S1",
  n: 1,
  icon: "network",
  kicker: "S1 · The infrastructure behind the balance",
  title: "Why network infrastructure is a sustainability factor",
  standfirst:
    "Networks are dimensioned for peak but powered for uptime — so a link at a tenth of its capacity does not draw a tenth of its power.",
  minutes: 16,
  definition:
    "Network infrastructure is the connective tissue of digital value creation: the access layer that reaches devices and users, the aggregation layer that collects their traffic, and the core and transport network that carries it between sites and on to data centres. Underneath all three sits the site infrastructure — power conversion, cooling and redundancy — which is rarely counted as 'network' at all. Treated as a sustainability factor, a network is capacity that has to be provisioned, powered, maintained, replaced and disposed of, whether or not anyone is using it.",
  insight:
    "The central mechanism is that networks are dimensioned for peak but powered for uptime. A server estate can scale down when demand falls; a large share of network equipment draws a substantial baseline whenever it is switched on, whatever the traffic. The consequence is counter-intuitive and expensive: at 10% utilisation, a link does not consume 10% of its full-load power. Most of what it draws in the quiet hours is energy consumed without useful load.",
  takeaway:
    "Before judging any network measure, ask where its consumption sits relative to its load. Measures that reduce the baseline — deactivation at low load, retiring a layer nobody needs — change the bill; measures that only add capacity change nothing about it. Then ask who owns the network's electricity bill. In most organisations that person does not sit in any sustainability review.",
  body: [
    {
      heading: "Why network energy is systematically underestimated",
      paragraphs: [
        "Network energy is under-represented in corporate reporting for three structural reasons. It is distributed across hundreds of sites — exchanges, street cabinets, towers, plant rooms — rather than concentrated in one building anyone tours. It sits in operational cost lines, often inside facilities or telecoms contracts, rather than in the IT budget where sustainability reviews tend to look. And much of it is consumed by equipment that is never idle in the accounting sense: a link is 'in service' at 03:00 exactly as it is at noon.",
        "The Utilisation Gap makes the result visible. Traffic follows the working day; power draw barely moves. The shaded area between the two curves is not a defect in any single device. It is what a network designed for availability costs when demand is low — and it recurs every night, every weekend, at every site.",
      ],
    },
    {
      heading: "A generation that outlives its usefulness",
      paragraphs: [
        "The clearest illustration comes from a UK mobile operator, reported via the GSMA: its 3G network consumed about one third of the operator's total mobile network energy while carrying only around 0.6% of its data traffic and around 7% of its voice traffic.",
        "That does not prove the 3G equipment was badly engineered. It proves that a technology generation can survive long past its usefulness, because decommissioning is not a technical decision. Customers still on the old layer must be migrated, contractual commitments and coverage guarantees honoured, and someone has to own the decision to switch it off. Until that governance decision is taken, the old layer keeps its full baseline — and every new generation is stacked on top of it.",
      ],
    },
    {
      heading: "The second half of the same digital footprint",
      paragraphs: [
        "The IEA estimates that data centres and data transmission networks each account for roughly 1–1.5% of global electricity use. The comparison matters for managers: networks are the second half of the same digital footprint, yet in most organisations they receive a fraction of the management attention that data-centre efficiency does.",
        "Networks are not standing still. The GSMA's Mobile Net Zero report (2025, the fifth annual edition) found that mobile operators' operational emissions fell 8% between 2019 and 2023 while connections grew by around 9% and data traffic quadrupled. The 2026 edition, analysing more than 110 operators that represent around 85% of global connections, reports emissions down 5% in 2024 and 13% between 2019 and 2024, while connections rose around 10% and data traffic more than quadrupled.",
      ],
    },
    {
      heading: "Relative decoupling is not absolute reduction",
      paragraphs: [
        "Read those figures honestly. Relative decoupling — emissions falling while traffic multiplies — is real and measurable. Absolute reduction at the required pace is not yet happening: to stay on a path to net zero by 2050, the GSMA's 2025 report puts the necessary fall at around 7.5% per year to 2030, more than twice the rate achieved so far. Efficiency is working; it is not yet working fast enough to outrun growth.",
        "Take one question back into your own organisation: who owns the electricity bill of the network — and does that person sit in any sustainability review?",
      ],
    },
  ],
  reasoning: [
    "In Part 1 you route six SmartLink signals to the zone where each effect first becomes real. Energy Demand is where almost every effect is eventually reported — the bill — so first ask which operating decision, device, data stream or process produces the consumption.",
    "A signal about equipment that stays switched on regardless of load is about how the network is run. Baseline power is an operating decision long before it is an energy line.",
    "For the root cause, run the equipment test. If modern, load-adaptive equipment would remove the problem, it is technology use. If the problem survives any purchase — a legacy layer nobody has decided to retire — it is a missing governance or architecture decision.",
  ],
  callout: {
    label: "The mechanism in one line",
    text: "Dimensioned for peak, powered for uptime. The quiet hours at every site are paid for at close to the full baseline.",
  },
  references: [
    {
      label: "IEA — Data Centres and Data Transmission Networks",
      detail: "Data centres and data transmission networks each account for roughly 1–1.5% of global electricity use.",
      url: "https://www.iea.org/energy-system/buildings/data-centres-and-data-transmission-networks",
    },
    {
      label: "UK mobile operator 3G energy, reported via GSMA",
      detail: "3G layer ≈ one third of mobile network energy while carrying ≈0.6% of data and ≈7% of voice traffic.",
    },
    {
      label: "GSMA — Mobile Net Zero, 5th annual report (2025)",
      detail:
        "Operational emissions −8% (2019–2023) while connections grew ≈9% and data traffic quadrupled; ≈7.5% a year needed to 2030, more than twice the rate achieved.",
    },
    {
      label: "GSMA — Mobile Net Zero 2026",
      detail:
        "110+ operators, ≈85% of global connections: −5% in 2024 and −13% over 2019–2024, while connections rose ≈10% and traffic more than quadrupled.",
    },
  ],
};

// ---------------------------------------------------------------------------
// Micro-check 1
// ---------------------------------------------------------------------------

export const MICRO_1: MicroCheckBlock = {
  id: "mc1",
  title: "Check your understanding · S1",
  questions: [
    {
      id: "mc1-q1",
      prompt: "A link runs at 15% average utilisation. What can you conclude about its power draw?",
      options: [
        {
          id: "a",
          text: "It draws roughly 15% of its full-load power.",
          feedback:
            "Not quite. That would hold only if power scaled with traffic. Most network equipment draws a substantial baseline whenever it is switched on, so a lightly used link costs far more than its share of traffic.",
        },
        {
          id: "b",
          text: "Considerably more than 15% of its full-load power, because much of the draw is baseline that does not follow traffic.",
          correct: true,
          feedback:
            "Correct. Networks are dimensioned for peak and powered for uptime. At low utilisation the baseline dominates — exactly the area the Utilisation Gap shades.",
        },
        {
          id: "c",
          text: "Nothing at all — utilisation and power draw are unrelated.",
          feedback:
            "Too strong. Some consumption does follow load, and load-adaptive features can make more of it do so. The relationship is weak, not absent.",
        },
        {
          id: "d",
          text: "That it is efficient, because it keeps headroom for peaks.",
          feedback:
            "Headroom is a resilience choice, not an efficiency property. Unused headroom still draws baseline power; whether that price is worth paying depends on the availability the service actually needs.",
        },
      ],
    },
    {
      id: "mc1-q2",
      prompt: "Why is retiring a legacy network generation usually not primarily a technical decision?",
      options: [
        {
          id: "a",
          text: "Because old equipment cannot physically be switched off.",
          feedback: "Not quite. It can be switched off. What keeps it on is everything attached to it.",
        },
        {
          id: "b",
          text: "Because customers must be migrated, contracts and coverage obligations honoured, and someone must own the decision.",
          correct: true,
          feedback:
            "Correct. The UK operator's 3G layer used about a third of the network's energy for a sliver of its traffic (GSMA). It survived because retirement needed migration, contractual and coverage decisions — not because nobody could see the numbers.",
        },
        {
          id: "c",
          text: "Because newer generations use more energy than older ones.",
          feedback:
            "Not quite. The issue is not the new layer's efficiency; it is the old layer staying switched on alongside it.",
        },
        {
          id: "d",
          text: "Because the energy saving is too small to matter.",
          feedback:
            "The 3G example shows the opposite: about a third of network energy for well under one percent of data traffic. The saving is large; the decision is hard.",
        },
      ],
    },
  ],
};
