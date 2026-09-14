/**
 * B — The NetSphere Infrastructure Map (§7.2). Six hotspots, verbatim from
 * the curriculum's initial position, each opening a fixed four-field panel.
 */

import type { MaterialSection } from "@/lib/materialSection";
import type { MaterialSectionId } from "../sections";
import type { DimensionId } from "./dimensions";

export type HotspotId = "h1" | "h2" | "h3" | "h4" | "h5" | "h6";

export type Hotspot = {
  id: HotspotId;
  n: number;
  zone: "production" | "logistics" | "building" | "spine" | "data";
  /** Verbatim from the curriculum. */
  text: string;
  observable: string;
  fiveYearImplication: string;
  dimension: DimensionId;
  concept: { term: string; definition: string };
};

export const HOTSPOTS: Hotspot[] = [
  {
    id: "h1",
    n: 1,
    zone: "spine",
    text: "The existing network infrastructure is partly inefficient and not geared towards flexible load management.",
    observable: "Several links and access points draw close to their full-load power at every hour, including the quiet overnight period across all three zones.",
    fiveYearImplication:
      "The baseline keeps growing as production and logistics add connected equipment on top of it, and every year of non-retirement makes the eventual modernisation programme larger and more disruptive to schedule.",
    dimension: "network",
    concept: {
      term: "Baseline power",
      definition: "What a link or device draws whenever it is switched on, whatever the load — the reason a lightly used link still costs most of its full-load price.",
    },
  },
  {
    id: "h2",
    n: 2,
    zone: "production",
    text: "The introduction of many new IoT devices with different energy and maintenance profiles is planned.",
    observable: "Production and building management have separately specified sensor types, none against a shared set of power-supply, data or support-period criteria.",
    fiveYearImplication:
      "A mixed fleet with no common maintenance model becomes several parallel field-service programmes, and the devices bought earliest reach end-of-support first, forcing replacement decisions under time pressure rather than by plan.",
    dimension: "iot",
    concept: {
      term: "Embodied emissions",
      definition: "Emissions from manufacturing a device before it is ever switched on. For small, low-power devices they frequently exceed everything the device will consume in operation.",
    },
  },
  {
    id: "h3",
    n: 3,
    zone: "logistics",
    text: "5G is to be introduced for several use cases whose benefit is still of varying clarity.",
    observable: "Logistics has named four candidate 5G applications; only one has a stated latency or density requirement that existing connectivity cannot already meet.",
    fiveYearImplication:
      "If all four proceed, NetSphere carries four sets of 5G infrastructure and the associated site costs for one use case that needed it — and per-bit efficiency gains on the radio equipment will not offset that, because the equipment itself was not the source of the extra consumption.",
    dimension: "fiveg",
    concept: {
      term: "Rebound effect",
      definition: "Efficiency per unit lowers the cost of use, so use grows — and total consumption can rise even though every individual component is more efficient. Also called the Jevons paradox.",
    },
  },
  {
    id: "h4",
    n: 4,
    zone: "data",
    text: "Data streams and analysis logics are not yet cleanly prioritised.",
    observable: "Telemetry from the new sensors and radios feeds a shared analytics layer with no documented owner for most of the individual streams.",
    fiveYearImplication:
      "Storage, transport and processing cost for unused streams accumulates in the analytics platform's budget, a different line from whichever department requested the sensor that produced the data — so the true cost of the original decision is never seen where it was made.",
    dimension: "data",
    concept: {
      term: "Scope displacement",
      definition: "Impact does not disappear when a technology decision is approved — it moves to a different budget, often a different team's, which is why it stops being visible to whoever made the original call.",
    },
  },
  {
    id: "h5",
    n: 5,
    zone: "building",
    text: "Binding criteria for device selection, lifecycle management and sustainability assessment are missing.",
    observable: "No procurement request for network, IoT or 5G equipment currently requires an energy, lifecycle or evidenced-benefit answer before approval.",
    fiveYearImplication:
      "Every one of the other five hotspots keeps recurring, because nothing at the point of purchase asks the question that would have prevented it — the absence compounds rather than resolves itself.",
    dimension: "governance",
    concept: {
      term: "Approval gate",
      definition: "The point in a decision process that can actually refuse a proposal. Criteria without a gate are a recommendation; a gate without criteria is an opinion with a stamp.",
    },
  },
  {
    id: "h6",
    n: 6,
    zone: "spine",
    text: "Management requires a recommendation on how innovation and sustainability can be brought together without letting complexity and costs get out of control.",
    observable: "Every department can name an innovation benefit for its own proposal; none has been asked to name what it adds to the estate's total operating and monitoring load.",
    fiveYearImplication:
      "Without a place where the combined complexity is counted, NetSphere accumulates systems, monitoring surfaces and skills requirements one locally justified decision at a time, and no single approval will ever look, on its own, like the moment complexity got out of control.",
    dimension: "complexity",
    concept: {
      term: "Enabling effect",
      definition: "A saving a technology causes somewhere else — the legitimate core of most innovation cases, and the hardest part to defend, because it is only real if it is measured against a stated comparison.",
    },
  },
];

export const hotspotById = (id: HotspotId) => HOTSPOTS.find((h) => h.id === id)!;

export const MAP_LABELS = {
  progress: (n: number) => `${n} / ${HOTSPOTS.length} examined`,
  prompt: "Tap a hotspot to open its panel — what is observable, what it implies over five years, which dimension it belongs to, and the concept behind it.",
};

// ---------------------------------------------------------------------------
// The section
// ---------------------------------------------------------------------------

export const B_MAP: MaterialSection<MaterialSectionId> = {
  id: "map",
  code: "B",
  n: 2,
  icon: "network",
  kicker: "B · One facility, six findings",
  title: "The NetSphere infrastructure map",
  standfirst:
    "NetSphere Industrial Systems GmbH is expanding across production, logistics and building management. Six hotspots, one company, no obviously wrong decision anywhere.",
  minutes: 12,
  definition:
    "NetSphere Industrial Systems GmbH is expanding its digital infrastructure across production, logistics and building management: a more modern network design, a large number of new IoT sensors, and 5G for mobile and latency-critical applications. Management expects efficiency, transparency and innovation advantage. Nobody has yet quantified the additional infrastructure cost, the rising data volumes, the device lifecycles or the long-term operating load.",
  insight:
    "Six facts sit on the map below, one per zone of the facility. Read individually, each is a locally reasonable decision a department can defend on its own terms. Read together, against the five control levers from section A, they describe an estate where every lever is either missing or unused — which is the actual finding this section exists to produce, not any one hotspot by itself.",
  takeaway:
    "Work every hotspot before moving to the six-dimension analysis in section C — it names, for each fact, what it costs over five years and which dimension it belongs to, and the reasoning there assumes you have already read the observable fact here in its own words.",
  body: [
    {
      heading: "How to read the map",
      paragraphs: [
        "Each hotspot opens a fixed four-field panel: what is observable, what it implies over five years, which of the six dimensions in section C it belongs to, and the concept term behind it — defined inline, so nothing on this route depends on having taken Route 1 first.",
        "Examine hotspots in any order. A small ring above the map tracks how many of the six you have opened; it is a progress indicator, not a gate, and section C is fully readable before you have opened any of them.",
      ],
    },
  ],
  reasoning: [
    "Section C's six-dimension analysis is organised by exactly these six hotspots — read the observable fact for each one here before you read its dimension analysis there.",
    "Notice that five-year implications, not this year's cost, are what make each hotspot serious. When you write Vertex's task, ask the same question of every fact you are given: what does this cost in five years, not what does it cost to fix today.",
  ],
  callout: {
    label: "The pattern across all six",
    text: "No single hotspot is a crisis. Together, they describe an estate making expansion decisions with none of section A's five control levers engaged.",
  },
  references: [
    {
      label: "Curriculum case — NetSphere Industrial Systems GmbH",
      detail: "Fictional case constructed for Module 8; the six hotspots are the curriculum's stated initial position, verbatim.",
    },
  ],
};
