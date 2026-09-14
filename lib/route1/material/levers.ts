/**
 * S2 — Levers of energy-efficient network technology, and how the industry
 * measures them (ETSI ES 203 228 / ITU-T L.1331).
 */

import type { MaterialSection } from "@/lib/materialSection";
import type { MicroCheckBlock } from "@/lib/microCheck";
import type { MaterialSectionId } from "../sections";

// ---------------------------------------------------------------------------
// SVG #3 — The Lever Map
// ---------------------------------------------------------------------------

export type NetworkLever = {
  id: string;
  n: number;
  label: string;
  /** Two short lines for the node label. */
  lines: [string, string];
  /** 0 = immediate, 1 = structural. */
  time: number;
  /** 0 = operational setting, 1 = architecture or governance decision. */
  control: number;
  mechanism: string;
  precondition: string;
  failure: string;
  /** Signal Board zones this lever typically shows up in. */
  zones: string[];
};

export const NETWORK_LEVERS: NetworkLever[] = [
  {
    id: "load",
    n: 1,
    label: "Load-adaptive operation",
    lines: ["Load-adaptive", "operation"],
    time: 0.16,
    control: 0.18,
    mechanism:
      "Carrier and cell shutdown at low load, deep sleep states, and 'zero bit, zero watt' for radio units: consumption follows traffic down instead of holding its baseline.",
    precondition: "Traffic visibility per site and per hour, and a control plane that is allowed to act on it.",
    failure: "Sleep disabled across the whole network because one critical service lacked a latency exception.",
    zones: ["Network Operations", "Energy Demand"],
  },
  {
    id: "protocol",
    n: 2,
    label: "Protocol and data discipline",
    lines: ["Protocol and", "data discipline"],
    time: 0.2,
    control: 0.44,
    mechanism:
      "Event-driven transmission instead of polling, smaller payloads, lower telemetry frequency, no duplicate streams: fewer bits sent for the same decision.",
    precondition: "An owner who knows which data feeds which decision.",
    failure: "Nobody owns it, so the defaults stay — the cheapest lever, left undone.",
    zones: ["Data Volume", "IoT Devices"],
  },
  {
    id: "control",
    n: 3,
    label: "Intelligent control and automation",
    lines: ["Intelligent", "control"],
    time: 0.46,
    control: 0.26,
    mechanism: "Traffic-aware orchestration switches capacity with demand across sites, automatically.",
    precondition: "Reliable telemetry, and enough trust in automated action to let it switch things off.",
    failure: "The control system's own energy use and operating complexity are never counted.",
    zones: ["Network Operations", "Energy Demand"],
  },
  {
    id: "redundancy",
    n: 4,
    label: "Redundancy and continuous operation",
    lines: ["Redundancy", "class"],
    time: 0.42,
    control: 0.8,
    mechanism: "Match N+1 and always-on designs to the availability class a service actually needs.",
    precondition: "A documented availability requirement for each service.",
    failure: "Framed as 'turn off redundancy' and rejected, instead of 'what availability class does this service need?'",
    zones: ["Network Operations", "Management Logic"],
  },
  {
    id: "hardware",
    n: 5,
    label: "Modern hardware and higher efficiency per bit",
    lines: ["Modern", "hardware"],
    time: 0.68,
    control: 0.52,
    mechanism: "Newer silicon, better power conversion and higher-density optics carry more traffic per unit of energy.",
    precondition: "Alignment with the capital cycle, and an honest count of the replacement's embodied emissions.",
    failure: "Replacing early and forgetting that the new equipment's manufacturing footprint has to be repaid first.",
    zones: ["Energy Demand", "Life Cycle"],
  },
  {
    id: "architecture",
    n: 6,
    label: "Architecture: where traffic is processed",
    lines: ["Where traffic", "is processed"],
    time: 0.9,
    control: 0.68,
    mechanism:
      "Centralisation or edge processing, trading transport energy against processing energy across the device, gateway, network, platform and application tiers.",
    precondition: "Both sides counted — the transport saved and the processing added.",
    failure: "Processing moved to the edge for latency, with nobody counting the new edge nodes and their data.",
    zones: ["Data Volume", "Management Logic"],
  },
  {
    id: "sunset",
    n: 7,
    label: "Consolidation and legacy sunset",
    lines: ["Legacy", "sunset"],
    time: 0.8,
    control: 0.9,
    mechanism: "Retire generations and parallel layers instead of stacking new ones on top, removing a whole baseline at once.",
    precondition: "A customer-migration plan and a review of coverage and contractual obligations.",
    failure: "New layer added, old layer never removed — a net increase.",
    zones: ["Network Operations", "Management Logic"],
  },
];

export const LEVER_MAP_AXES = {
  x: { label: "Time to effect", low: "Immediate", high: "Structural" },
  y: { label: "Control required", low: "Operational setting", high: "Architecture / governance decision" },
};

// ---------------------------------------------------------------------------
// The section
// ---------------------------------------------------------------------------

export const S2_LEVERS: MaterialSection<MaterialSectionId> = {
  id: "levers",
  code: "S2",
  n: 2,
  icon: "gauge",
  kicker: "S2 · What actually moves consumption — and how it is measured",
  title: "Levers of energy-efficient network technology",
  standfirst:
    "Seven levers, each with a mechanism, a precondition and a failure mode — and one standard that says an efficiency figure without a boundary is not comparable.",
  minutes: 16,
  definition:
    "Energy-efficient network technology is not one measure but a set of levers, each with a mechanism, a precondition that has to be true before it works, and a typical failure mode. The levers differ along two axes: how fast they take effect, and how much control they require. Some are operational settings that change consumption this year; others are architecture or governance decisions that change what the network looks like several years from now. The Lever Map places all seven on those two axes.",
  insight:
    "Most lever failures are not technical. Sleep modes get disabled across a network because one critical service had no latency exception; a new generation is added and the old one never removed; hardware is replaced early and its embodied emissions are forgotten. And every lever only 'works' inside a boundary someone has declared — which is why the measurement standard belongs in the same section as the levers themselves.",
  takeaway:
    "When you propose a lever, state three things: its mechanism, the precondition you have checked, and the failure mode you have guarded against. When anyone reports an efficiency result — a vendor, an operator, your own team — ask for the boundary before you look at the number. If you cannot state the boundary, the metric is not comparable.",
  body: [
    {
      heading: "Settings that can change consumption this year",
      paragraphs: [
        "Load-adaptive operation makes consumption follow demand: carrier and cell shutdown at low load, deep sleep states, and what the GSMA calls 'zero bit, zero watt' — modern 5G radio units can enter deep sleep when no traffic is present, bringing their consumption close to (not to) zero. It needs traffic visibility and a control plane willing to act on it, and it fails when sleep is disabled everywhere because one critical service lacked a latency exception.",
        "Protocol and data discipline avoids unnecessary transmission: event-driven reporting instead of polling, smaller payloads, lower telemetry frequency, no duplicate data streams. It is the lever with the lowest capital cost and the weakest ownership — no budget line visibly shrinks when a sensor stops reporting data nobody reads, so the defaults usually stay.",
        "Intelligent control and automation extends load-adaptive operation across sites with traffic-aware orchestration. Stated honestly, the control system consumes energy itself and adds complexity that someone has to operate; it is a lever, not a free lunch.",
      ],
    },
    {
      heading: "Decisions that change the network itself",
      paragraphs: [
        "Consolidation and legacy sunset retires generations and parallel layers instead of stacking new ones on top. Its precondition is a migration plan and a review of coverage obligations; its failure mode is the most common one in the sector — the new layer is added, the old layer is never removed, and the result is a net increase.",
        "Modern hardware delivers higher efficiency per bit through newer silicon, better power conversion and higher-density optics, but it depends on the capital cycle. Replacing early is not automatically greener: manufacturing the replacement carries embodied emissions, which the operational saving has to repay before anything is gained.",
        "Architecture decides where traffic is processed. Centralising processing costs transport energy; processing at the edge costs devices and edge nodes. ISO/IEC 30141:2018, the IoT Reference Architecture, gives the vocabulary for the split — device, gateway, network, platform and application tiers — so both sides can be counted. Redundancy and continuous operation, finally, are resilience decisions with an energy price: N+1 and always-on designs are legitimate, and the right question is not 'turn off redundancy' but 'what availability class does this service actually require?'",
      ],
    },
    {
      heading: "Measuring it: ETSI ES 203 228 and ITU-T L.1331",
      paragraphs: [
        "The industry-standard anchor is ETSI ES 203 228, Environmental Engineering; Assessment of mobile network energy efficiency (V1.3.1, 2020-10). It was developed with 3GPP SA5 and RAN3 and with input from the GSMA, and it is aligned with ITU-T L.1331. It defines metrics and measurement methods for the radio access part of a mobile network — base stations, backhaul, radio controllers and site infrastructure. End-user terminals are explicitly out of scope.",
        "Its metrics are ratios: useful output — data volume delivered, or coverage area served — per unit of energy consumed. That is precisely why efficiency can improve while total consumption rises. A ratio can get better every year while the absolute number it is computed from keeps growing.",
        "Measuring an entire national network is not economically viable, so the standard measures partial networks and defines an extrapolation method to estimate the efficiency of the whole; the required output is a formal assessment report. Boundaries may be topological, geographic (a city, a country) or demographic (urban or rural) — so the same physical network yields different efficiency figures under different boundaries. At equipment level, ETSI ES 202 706 is the counterpart: power consumption measurement for radio base stations.",
      ],
    },
  ],
  reasoning: [
    "The Lever Map's two axes are the two tags you give every routed signal in Part 1. Time to effect: a short-term measure shows within the current operating year, a structural one changes how future decisions are made. Control required: an operational setting points to technology use; an architecture or governance decision points to exactly that.",
    "Data that is collected but never used is a protocol-and-data-discipline problem: a setting, cheap to change, owned by nobody — and that lack of an owner is why it stays undone.",
    "A measure that adds capacity without switching anything off is not efficiency, and early replacement is not automatically greener. When an action adds a layer or new hardware, ask what it retires and what its manufacture costs.",
  ],
  callout: {
    label: "The boundary rule",
    text: "An efficiency figure is a ratio inside a boundary. If you cannot state the boundary, the number is not comparable — not with another operator, not with last year, not with a vendor's claim.",
  },
  references: [
    {
      label: "ETSI ES 203 228 V1.3.1 (2020-10) — Assessment of mobile network energy efficiency",
      detail:
        "Radio access network scope (base stations, backhaul, radio controllers, site infrastructure; terminals excluded); partial-network measurement with extrapolation; formal assessment report. Developed with 3GPP SA5/RAN3 and GSMA input.",
    },
    {
      label: "ITU-T L.1331",
      detail: "Mobile network energy-efficiency assessment, aligned with ETSI ES 203 228.",
      url: "https://www.itu.int/rec/T-REC-L.1331",
    },
    {
      label: "ETSI ES 202 706",
      detail: "Power consumption measurement for radio base stations — the equipment-level counterpart.",
    },
    {
      label: "ISO/IEC 30141:2018 — Internet of Things Reference Architecture",
      detail: "Architectural vocabulary for device, gateway, network, platform and application tiers.",
    },
    {
      label: "GSMA — 'zero bit, zero watt'",
      detail: "Modern 5G radio units can enter deep sleep states when no traffic is present, bringing consumption close to zero.",
    },
  ],
};

// ---------------------------------------------------------------------------
// Micro-check 2
// ---------------------------------------------------------------------------

export const MICRO_2: MicroCheckBlock = {
  id: "mc2",
  title: "Check your understanding · S2",
  questions: [
    {
      id: "mc2-q1",
      prompt:
        "Two operators each publish an energy-efficiency figure for their mobile network. What must you know before comparing them?",
      options: [
        {
          id: "a",
          text: "The measurement boundary each one used — topological, geographic or demographic — and what counted as useful output.",
          correct: true,
          feedback:
            "Correct. ES 203 228 allows different boundaries, and the same physical network yields different figures under each. If you cannot state the boundary, the metric is not comparable.",
        },
        {
          id: "b",
          text: "Which vendor supplied the base stations.",
          feedback: "Not quite. That matters for the equipment, not for whether two network-level ratios can be compared.",
        },
        {
          id: "c",
          text: "Whether end-user terminals were included.",
          feedback:
            "Close, but under ES 203 228 terminals are out of scope by definition, so a compliant figure excludes them in both cases. The open question is which part of the radio access network was measured, where, and serving whom.",
        },
        {
          id: "d",
          text: "Nothing — an efficiency ratio is comparable by definition.",
          feedback:
            "A ratio is only comparable when its numerator, denominator and perimeter match. That is why the standard makes the boundary part of the assessment report.",
        },
      ],
    },
    {
      id: "mc2-q2",
      prompt: "Why is replacing network hardware early not automatically the greener choice?",
      options: [
        {
          id: "a",
          text: "Because manufacturing the replacement carries embodied emissions that the operational saving has to repay first.",
          correct: true,
          feedback:
            "Correct. The saving per bit is real, but it starts from a debt: the replacement's manufacturing footprint. Aligning replacement with the capital cycle is part of the lever, not a detail.",
        },
        {
          id: "b",
          text: "Because new hardware is less efficient per bit than old hardware.",
          feedback: "Not quite. Newer hardware is usually more efficient per bit — that is the lever's mechanism.",
        },
        {
          id: "c",
          text: "Because old hardware has no operational emissions.",
          feedback: "Not quite. Old hardware keeps drawing power — often a large baseline. The question is the balance between the two.",
        },
        {
          id: "d",
          text: "Because the WEEE Directive does not allow network equipment to be recycled.",
          feedback:
            "Not quite. WEEE sets collection, treatment and producer-responsibility obligations for e-waste; it does not prohibit replacement or recycling.",
        },
      ],
    },
    {
      id: "mc2-q3",
      prompt: "Which lever typically has the lowest capital cost but the weakest ownership?",
      options: [
        {
          id: "a",
          text: "Consolidation and legacy sunset.",
          feedback:
            "Not quite. Sunset has a clear owner in network strategy, and it needs migration budget — neither cheap nor unowned.",
        },
        {
          id: "b",
          text: "Modern hardware and higher efficiency per bit.",
          feedback: "Not quite. Hardware refresh is the most capital-intensive lever on the map.",
        },
        {
          id: "c",
          text: "Protocol and data discipline — polling, payload size, telemetry frequency, duplicate streams.",
          correct: true,
          feedback:
            "Correct. It is mostly settings, so it costs little — and because no budget line visibly shrinks, nobody owns it.",
        },
        {
          id: "d",
          text: "Redundancy and continuous operation.",
          feedback:
            "Not quite. Redundancy has owners — whoever answers for a service's availability — and changing it needs an explicit availability decision.",
        },
      ],
    },
  ],
};
