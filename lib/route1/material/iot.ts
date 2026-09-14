/**
 * S3 — IoT sustainability across the lifecycle.
 */

import type { MaterialSection } from "@/lib/materialSection";
import type { MicroCheckBlock } from "@/lib/microCheck";
import type { MaterialSectionId } from "../sections";

// ---------------------------------------------------------------------------
// SVG #5 — The IoT Lifecycle Wheel
// ---------------------------------------------------------------------------

export type LifecyclePhase = {
  id: string;
  n: number;
  label: string;
  /** What drives the impact in this phase. */
  driver: string;
  /** Who typically takes the decision that fixes it. */
  owner: string;
  /** The criterion that should have been applied earlier — usually at procurement. */
  criterion: string;
  regulation?: string;
  /** Relative segment thickness. Illustrative emphasis only — not an LCA result. */
  weight: { standard: number; battery: number };
};

export const LIFECYCLE_PHASES: LifecyclePhase[] = [
  {
    id: "manufacture",
    n: 1,
    label: "Manufacture",
    driver:
      "Embodied impact of semiconductors, sensor elements, circuit boards, housings and rare materials — for low-power devices frequently larger than everything they will consume in operation.",
    owner: "Procurement, with the product or facilities owner who specifies the device.",
    criterion: "Is a device needed at this density at all, and which device class does the job with the least material?",
    regulation: "ESPR (EU) 2024/1781 — durability, reparability, recyclability and the Digital Product Passport.",
    weight: { standard: 1, battery: 1.85 },
  },
  {
    id: "deploy",
    n: 2,
    label: "Deploy",
    driver: "Site work, gateways and the additional network infrastructure that the device count implies.",
    owner: "Project lead, with facilities and network engineering.",
    criterion: "What gateways, edge nodes and network capacity does this device count bring with it?",
    weight: { standard: 1, battery: 0.8 },
  },
  {
    id: "power",
    n: 3,
    label: "Power",
    driver:
      "Mains, Power over Ethernet or battery. A battery turns an energy question into a maintenance and waste question at fleet scale.",
    owner: "Solution architect.",
    criterion:
      "Can the device run on mains or PoE where cabling exists — and if not, is the battery replaceable, with a stated service interval?",
    weight: { standard: 1, battery: 1.15 },
  },
  {
    id: "connect",
    n: 4,
    label: "Connect",
    driver:
      "The protocol — low-power wide-area network, cellular or Wi-Fi — sets the energy per message and, for battery devices, the device lifetime.",
    owner: "Network architect.",
    criterion: "Which protocol fits the message size and frequency this use case actually needs?",
    weight: { standard: 1, battery: 0.9 },
  },
  {
    id: "data",
    n: 5,
    label: "Generate data",
    driver:
      "Every sensor is a permanent data producer. The storage, transport and processing downstream are an IoT consequence that sits in a different budget.",
    owner: "The data owner of the use case — too often nobody.",
    criterion: "Which decision does this data feed, and how often does that decision need it?",
    weight: { standard: 1, battery: 0.75 },
  },
  {
    id: "maintain",
    n: 6,
    label: "Maintain",
    driver:
      "Firmware and security support, battery replacement and field-service visits. A device without a defined support period is forced into early replacement.",
    owner: "IT operations and information security.",
    criterion: "Which support period does the supplier commit to, and who replaces what, how often?",
    regulation: "ETSI EN 303 645 baseline security and the support-period logic of the EU Cyber Resilience Act.",
    weight: { standard: 1, battery: 1.85 },
  },
  {
    id: "retire",
    n: 7,
    label: "Retire",
    driver: "Replacement and disposal: electronic waste, spent batteries and the material that can or cannot be recovered.",
    owner: "Facilities and procurement, with the producer under extended responsibility.",
    criterion: "What is the take-back and recycling route — agreed before purchase, not at end of life?",
    regulation: "WEEE Directive 2012/19/EU; the ESPR Digital Product Passport.",
    weight: { standard: 1, battery: 1.7 },
  },
];

export const WHEEL_LABELS = {
  toggle: "Show where impact concentrates for a battery-powered sensor fleet",
  legend:
    "Segment thickness in the battery-fleet view is illustrative of where impact concentrates — not a quantified LCA result.",
  prompt: "Tap a phase to see its impact driver, its decision owner, the criterion that should have been applied earlier, and the regulation that applies.",
};

// ---------------------------------------------------------------------------
// The section
// ---------------------------------------------------------------------------

export const S3_IOT: MaterialSection<MaterialSectionId> = {
  id: "iot",
  code: "S3",
  n: 3,
  icon: "sensor",
  kicker: "S3 · Many small things",
  title: "IoT sustainability across the lifecycle",
  standfirst:
    "Per device the impact is trivial. Per fleet it is device count × lifetime × replacement rate × data generated — and most of it is decided before the first sensor is switched on.",
  minutes: 15,
  definition:
    "IoT sustainability differs structurally from data centres and networks: its impact comes from many small things rather than a few large ones. Per device, the impact is trivial. At fleet level it is a function of four multipliers — device count × lifetime × replacement rate × data generated — and each of them is fixed by decisions taken long before the first device is installed.",
  insight:
    "For small, numerous, short-lived devices, manufacturing impact can dominate the lifetime footprint. That is the most counter-intuitive point of this section: a low-power sensor that draws almost nothing in operation may carry more embodied emissions — from its semiconductors, sensor elements, circuit board, housing and rare materials — than it will ever cause through electricity. A fleet's footprint is therefore decided mostly at procurement, and only a small part of it can be recovered by running the fleet efficiently.",
  takeaway:
    "Apply device criteria at procurement, not in operation: the evidenced saving, the power supply, the connectivity and data needs, the support period and the end-of-life route. And treat IoT's sustainability case as what it almost always is — an enabling case, where the savings happen somewhere else. An enabling case has to be measured, or it is unproven.",
  body: [
    {
      heading: "Seven phases, seven impact profiles, seven owners",
      paragraphs: [
        "The Lifecycle Wheel breaks a device's life into seven phases, each with its own impact driver and its own decision owner. Manufacturing carries the embodied impact — for low-power devices frequently more than their whole operational consumption. Deployment and commissioning add site work, gateways and the additional network infrastructure the device count implies.",
        "The power supply is where fleets diverge most. Mains power and Power over Ethernet tie a device to cabling; batteries free it from cabling and convert an energy problem into a maintenance and waste problem. A battery that lasts five years sounds generous for one device. Across 4,000 sensors it is a permanent field-service programme — on illustrative arithmetic, around 800 replacements a year, roughly three every working day, each one a site visit and a spent battery.",
        "Connectivity is chosen once and paid for continuously: the protocol — a low-power wide-area network, cellular or Wi-Fi — sets the energy per message and, for battery devices, the lifetime. Data generation follows. Every sensor is a permanent data producer, and the storage, transport and processing energy downstream is an IoT consequence booked in a different budget.",
        "Maintenance, firmware and security support decide how long a device may stay in service. A device without a defined support period becomes a security liability that forces early replacement — which makes ETSI EN 303 645, the baseline for consumer IoT cybersecurity, and the support-period logic of the EU Cyber Resilience Act sustainability questions as much as security ones. Replacement and disposal close the loop: the WEEE Directive (2012/19/EU) sets collection, treatment and producer-responsibility obligations, and the Ecodesign for Sustainable Products Regulation (EU) 2024/1781 extends ecodesign to durability, reparability and recyclability and introduces the Digital Product Passport, with product-specific requirements phased in by delegated acts.",
      ],
    },
    {
      heading: "The opportunity is an enabling effect — so it must be measured",
      paragraphs: [
        "The opportunities are real: condition monitoring and predictive maintenance, leak and loss detection, occupancy-driven heating and cooling, resource optimisation in production. Almost all of them share one structure. The device fleet adds a footprint, and the saving happens somewhere else. That is an enabling effect, and an enabling case stands or falls on measurement: a baseline before, a measured result after, and someone who owns the comparison.",
        "The risks are just as structural: device density, short life cycles, data growth, security exposure, the shadow infrastructure of gateways, edge nodes and extra network load that nobody budgeted, and the complexity cost operations carries for every additional device type.",
      ],
    },
    {
      heading: "The moment to decide is procurement",
      paragraphs: [
        "The governance consequence is blunt: a device selection decision is a 7–10 year operating commitment (an illustrative planning horizon, not a measured figure). Once devices are installed, most of the wheel is already determined — the embodied impact is spent, the power supply is fixed, and the support period is whatever the supplier offered. The criteria that matter have to be applied before the purchase order, not discovered in operation.",
      ],
    },
  ],
  reasoning: [
    "IoT signals rarely belong where their energy is reported. Ask which lifecycle phase the signal commits SmartLink to: a device count first becomes real in the device fleet itself; a battery decision becomes real as replacement and waste over the device's life; data nobody uses becomes real as volume.",
    "Read an IoT signal as a potential only if its saving elsewhere would be measured. A rollout sold on savings but planned without a baseline or an owner goes either way — that is 'Both — depends on how it is governed', and the justification should name the deciding condition.",
    "Apply the equipment test to device decisions: a better device or a longer-life battery postpones a replacement programme, it does not remove it. When the problem is how many devices, which power supply or which support period, the root cause is a missing decision and the horizon is structural.",
  ],
  callout: {
    label: "Where the footprint is decided",
    text: "For small, numerous, short-lived devices the footprint is largely spent before the device is switched on. Criteria applied at procurement do more than any efficiency programme applied in operation.",
  },
  references: [
    {
      label: "ETSI EN 303 645 — Cyber security for consumer Internet of Things: baseline requirements",
      detail: "An unsupported device becomes a security liability that forces early replacement.",
    },
    {
      label: "EU Cyber Resilience Act",
      detail: "Security obligations for products with digital elements, including a defined support period; obligations phase in after adoption.",
    },
    {
      label: "WEEE Directive 2012/19/EU",
      detail: "E-waste collection, treatment and producer responsibility.",
      url: "https://eur-lex.europa.eu/eli/dir/2012/19/oj",
    },
    {
      label: "Ecodesign for Sustainable Products Regulation (EU) 2024/1781",
      detail: "Durability, reparability, recyclability and the Digital Product Passport; requirements phased in by delegated acts.",
      url: "https://eur-lex.europa.eu/eli/reg/2024/1781/oj",
    },
    {
      label: "ISO/IEC 30141:2018 — IoT Reference Architecture",
      detail: "Device, gateway, network, platform and application tiers.",
    },
    {
      label: "Embodied versus operational emissions",
      detail: "For small, numerous, short-lived devices, manufacturing impact can dominate the lifetime footprint.",
    },
  ],
};

// ---------------------------------------------------------------------------
// Micro-check 3
// ---------------------------------------------------------------------------

export const MICRO_3: MicroCheckBlock = {
  id: "mc3",
  title: "Check your understanding · S3",
  questions: [
    {
      id: "mc3-q1",
      prompt: "For a small, low-power sensor, which statement is most likely to hold?",
      options: [
        {
          id: "a",
          text: "Its operational electricity dominates its lifetime footprint.",
          feedback:
            "Not quite. That is the pattern for equipment that runs hard and continuously, such as network gear. For low-power devices it is often reversed.",
        },
        {
          id: "b",
          text: "Its manufacturing footprint can exceed everything it consumes in operation over its whole life.",
          correct: true,
          feedback:
            "Correct. Embodied emissions from semiconductors, boards, housings and materials can dominate — which is why the criteria that matter are applied at procurement.",
        },
        {
          id: "c",
          text: "It has no meaningful footprint, because it draws so little power.",
          feedback:
            "Per device, nearly true. Per fleet, the impact is device count × lifetime × replacement rate × data generated — and none of those is small.",
        },
        {
          id: "d",
          text: "Its footprint is determined only by its connectivity protocol.",
          feedback:
            "Not quite. The protocol shapes energy per message and battery life; it does not change the embodied share.",
        },
      ],
    },
    {
      id: "mc3-q2",
      prompt: "Why is a missing firmware support period a sustainability issue, and not only a security issue?",
      options: [
        {
          id: "a",
          text: "Because firmware updates consume a lot of energy.",
          feedback: "Not quite. The energy of an update is not the mechanism.",
        },
        {
          id: "b",
          text: "Because an unsupported device becomes a security liability that forces early replacement — more manufacturing and more e-waste.",
          correct: true,
          feedback:
            "Correct. That is the support-period logic behind ETSI EN 303 645 and the Cyber Resilience Act: when support ends, the device's safe life ends with it, whatever its hardware condition.",
        },
        {
          id: "c",
          text: "Because the WEEE Directive bans devices that no longer receive updates.",
          feedback:
            "Not quite. WEEE governs collection, treatment and producer responsibility for e-waste; it says nothing about firmware.",
        },
        {
          id: "d",
          text: "It is not — support periods only matter for security.",
          feedback:
            "Not quite. A shortened service life multiplies the replacement rate, one of the four fleet multipliers.",
        },
      ],
    },
  ],
};
