/**
 * F — Short / medium / structural roadmap (§7.6). Verbatim curriculum
 * measures, each with an owner and an evidence test.
 */

import type { MaterialSection } from "@/lib/materialSection";
import type { MaterialSectionId } from "../sections";

export type RoadmapItem = { text: string; owner: string; evidence: string };
export type RoadmapBand = { id: "short" | "medium" | "structural"; label: string; items: RoadmapItem[] };

export const ROADMAP: RoadmapBand[] = [
  {
    id: "short",
    label: "Short-term",
    items: [
      {
        text: "Transparency on existing network inefficiencies and planned IoT/5G use cases.",
        owner: "Network and infrastructure lead",
        evidence: "A published baseline report covering all three zones, dated and boundary-declared.",
      },
      {
        text: "Define criteria for benefit, energy demand and lifecycle.",
        owner: "Architecture and governance lead",
        evidence: "A written criteria document that a procurement request can be checked against.",
      },
      {
        text: "First prioritisation of critical deployment scenarios.",
        owner: "Management board",
        evidence: "A ranked list of pending proposals, with the criteria applied to each.",
      },
    ],
  },
  {
    id: "medium",
    label: "Medium-term",
    items: [
      {
        text: "Modernise inefficient network parts.",
        owner: "Network and infrastructure lead",
        evidence: "Metered baseline power at the modernised sites, against last year's figure.",
      },
      {
        text: "Pilot selected IoT and 5G applications under clear assessment criteria.",
        owner: "Department heads, jointly with the architecture lead",
        evidence: "A pilot report scored against the criteria document, before any rollout decision.",
      },
      {
        text: "Reduce unnecessary data collection and improve data management.",
        owner: "Data platform owner",
        evidence: "Named consumer coverage: the share of active streams with a documented decision they feed.",
      },
    ],
  },
  {
    id: "structural",
    label: "Structural",
    items: [
      {
        text: "Anchor lifecycle, energy and architecture principles in infrastructure decisions and management reviews.",
        owner: "Management board",
        evidence: "The principles appear as a standing agenda item with a review cadence, not a one-off approval.",
      },
      {
        text: "Build a permanent management model for connected technologies and their sustainability impact.",
        owner: "CIO / CTO",
        evidence: "A named, resourced function still operating after the individuals who set it up have moved on.",
      },
    ],
  },
];

export const ROADMAP_RULE = "A measure without an owner and an evidence test is an intention.";

// ---------------------------------------------------------------------------
// The section
// ---------------------------------------------------------------------------

export const F_ROADMAP: MaterialSection<MaterialSectionId> = {
  id: "roadmap",
  code: "F",
  n: 6,
  icon: "cycle",
  kicker: "F · What happens after the first measure",
  title: "Short / medium / structural roadmap",
  standfirst: "A measure without an owner and an evidence test is an intention — not a plan.",
  minutes: 10,
  definition:
    "NetSphere's roadmap sequences its measures across three horizons: short-term transparency and criteria work, medium-term modernisation and piloting under the new criteria, and structural anchoring of principles in ongoing governance. Every item carries an owner and an evidence test.",
  insight:
    "The short-term band is deliberately not 'quick wins' in the sense of being unimportant — transparency and criteria-setting are the preconditions the framework in section E depends on, and they are scheduled first because everything after them is more expensive to get right without them, not because they are easy.",
  takeaway:
    "When you build Vertex's own roadmap in the task's guiding-decisions section, apply the same rule stated here: a measure without a named owner and a stated evidence test is an intention, and an intention is not what a board memo is for.",
  body: [
    {
      heading: "Why the bands are ordered this way",
      paragraphs: [
        "Structural items depend on medium-term items having produced evidence to anchor; medium-term items depend on short-term criteria existing to pilot against. The sequence is not a scheduling convenience — reversing it (piloting before criteria exist, or anchoring principles before any evidence has been produced) reproduces exactly the ad hoc pattern the framework was meant to end.",
      ],
    },
  ],
  reasoning: [
    "Vertex's task asks for three guiding decisions for the next 12 months, each with an owner and a quarter. Use this roadmap's owner-plus-evidence discipline directly.",
    "A 'guiding decision' constrains later decisions (section A's guiding-decisions logic); check that each of your three actually does that, rather than describing a single action.",
  ],
  callout: {
    label: "The rule",
    text: ROADMAP_RULE,
  },
  references: [
    {
      label: "ISO 50001 — energy management systems",
      detail: "The management-system loop this sequencing follows: policy → objective → measurement → review → correction.",
    },
  ],
};
