/**
 * A — Why this is a management question, not a technology question (§7.1).
 */

import type { MaterialSection } from "@/lib/materialSection";
import type { MaterialSectionId } from "../sections";

// ---------------------------------------------------------------------------
// SVG #1 — Ratio vs Absolute (illustrative, linked to one slider)
// ---------------------------------------------------------------------------

export const RATIO_MODEL = {
  periods: 10,
  floor: 0.3,
  decay: 0.75,
  min: 0,
  max: 30,
  step: 1,
  defaultGrowth: 10,
  disclaimer: "Illustrative model — not operator data.",
};

export type RatioSeries = { perBit: number[]; total: number[] };

export function ratioSeries(growthPct: number): RatioSeries {
  const { periods, floor, decay } = RATIO_MODEL;
  const perBit: number[] = [];
  const total: number[] = [];
  for (let t = 0; t <= periods; t++) {
    const e = floor + (1 - floor) * Math.pow(decay, t);
    const v = Math.pow(1 + growthPct / 100, t);
    perBit.push(e * 100);
    total.push(e * v * 100);
  }
  return { perBit, total };
}

export function ratioVerdict(perBit: number[], total: number[]): string {
  const periods = perBit.length - 1;
  const perBitChange = Math.round(((perBit[periods] - perBit[0]) / perBit[0]) * 100);
  const totalChange = Math.round(((total[periods] - total[0]) / total[0]) * 100);
  return `Efficiency improved by ${Math.abs(perBitChange)}% — total consumption ${totalChange >= 0 ? "rose" : "fell"} by ${Math.abs(totalChange)}%.`;
}

// ---------------------------------------------------------------------------
// The four leaks (shared vocabulary with Route 1 S5 — repeated here in full
// for self-containment, §13: no silent dependency on Route 1)
// ---------------------------------------------------------------------------

export type ManagementLeak = { id: string; label: string; mechanism: string; example: string };

export const MANAGEMENT_LEAKS: ManagementLeak[] = [
  {
    id: "rebound",
    label: "Rebound",
    mechanism: "Efficiency per unit lowers the cost of use, so use grows — also called the Jevons paradox.",
    example: "A more efficient 5G radio unit makes continuous video inspection cheap enough that every line installs it.",
  },
  {
    id: "stacking",
    label: "Layer stacking",
    mechanism: "The new technology generation is added; the old one is never retired.",
    example: "A UK operator's 3G layer, per GSMA, still drew about a third of mobile network energy for under 1% of data traffic.",
  },
  {
    id: "displacement",
    label: "Scope displacement",
    mechanism: "Impact does not disappear — it moves to another budget.",
    example: "A device's data moves from its own power draw into a cloud platform's storage and processing bill.",
  },
  {
    id: "complexity",
    label: "Complexity overhead",
    mechanism: "Every added system brings monitoring, spares, skills and failure modes.",
    example: "A fleet of IoT gateways added to support one use case, each now needing its own patching and monitoring.",
  },
];

// ---------------------------------------------------------------------------
// The five levers of management control
// ---------------------------------------------------------------------------

export type ControlLever = { id: string; label: string; controls: string };

export const CONTROL_LEVERS: ControlLever[] = [
  { id: "criteria", label: "The criteria", controls: "What counts as an acceptable connectivity decision before it is approved." },
  { id: "gate", label: "The approval gate", controls: "Whether a decision can actually be refused, and by whom." },
  { id: "boundary", label: "The boundary definition", controls: "What perimeter and comparison an efficiency claim is measured against." },
  { id: "retirement", label: "The retirement obligation", controls: "Whether an old layer or device generation is required to be switched off." },
  { id: "owner", label: "The measurement owner", controls: "Who is named to report whether a decision's promised effect actually occurred." },
];

// ---------------------------------------------------------------------------
// The section
// ---------------------------------------------------------------------------

export const A_MANAGEMENT: MaterialSection<MaterialSectionId> = {
  id: "management",
  code: "A",
  n: 1,
  icon: "gavel",
  kicker: "A · Where the decision actually lives",
  title: "Why this is a management question, not a technology question",
  standfirst: "Efficiency is a ratio. Consumption is an absolute. A board that confuses the two has approved nothing.",
  minutes: 16,
  definition:
    "ETSI ES 203 228 and ITU-T L.1331 measure network energy efficiency as useful output per unit of energy, over a boundary the assessor declares. That is a ratio. Total consumption is an absolute. A ratio can improve every year while the absolute number it is computed from keeps growing — which is exactly why a manager who accepts an efficiency figure without asking for its boundary has accepted nothing verifiable at all.",
  insight:
    "The evidence pattern is now well documented at sector level. GSMA's Mobile Net Zero reporting shows mobile operational emissions falling 8% between 2019 and 2023 and 13% between 2019 and 2024, while data traffic quadrupled over the same periods. Relative decoupling — emissions falling while traffic multiplies — is real. The pace required to reach net zero by 2050, around 7.5% a year to 2030, is not yet being met; the achieved rate is less than half of it. Teach this distinction explicitly, because it is the single most useful concept a manager takes from this route: relative decoupling is not the same claim as absolute reduction, and a slide that reports the first as though it were the second is not lying, but it is not answering the question either.",
  takeaway:
    "Management does not control the physics of a radio unit or a battery chemistry. It controls five things: the criteria a connectivity decision must meet before approval, the approval gate that can actually refuse a decision, the boundary a claimed efficiency figure is measured against, the retirement obligation that removes an old layer when a new one arrives, and the named owner who reports whether a measured effect occurred. Frame the rest of this route around these five levers — everything a manager can actually do lives inside them.",
  body: [
    {
      heading: "Why technology decisions become irreversible quietly",
      paragraphs: [
        "None of the three biggest connectivity commitments announce their own irreversibility. A device selection is a 7–10 year operating commitment the moment the purchase order is signed — the embodied emissions are spent, the power supply is fixed, and the support period is whatever the supplier offered, none of it visible on the invoice. A network layer that is not explicitly retired becomes permanent by default, because nobody's job description includes deciding to switch off something that still works. And a data stream, once started, is almost never stopped, because stopping it requires someone to notice it is not being used and then to accept responsibility for whatever depends on it, however unlikely that dependency actually is.",
        "The moment of maximum leverage over all three is before approval. After the purchase order, the meeting, or the first commit, the decision has already been made in every sense that matters operationally — what remains is managing its consequences.",
      ],
    },
    {
      heading: "The four things that consume a promised efficiency gain",
      paragraphs: [
        "Rebound: efficiency per unit lowers the cost of use, and use grows to absorb the saving — the mechanism behind 5G's per-bit efficiency target coexisting with rising total network energy. Layer stacking: a new generation is added and the old one is never switched off, which is precisely the UK 3G pattern GSMA reports — about a third of mobile network energy for well under 1% of data traffic, because retiring it needed a migration and coverage decision nobody had made.",
        "Scope displacement: impact does not vanish, it relocates — a device's own power draw is trivial, but the cloud platform storing and processing its data absorbs the consequence in a different budget, reported by a different team, if it is reported at all. Complexity overhead: every additional system — a gateway, an edge node, a management console — brings its own monitoring, spare parts, required skills and failure modes, none of which appears in the business case that approved the original device.",
      ],
    },
    {
      heading: "What a manager actually has authority over",
      paragraphs: [
        "None of the four leaks above is stopped by better engineering alone. Each is stopped by one of the five levers: criteria that name what an acceptable decision looks like before anyone is tempted to approve an exception; a gate that can say no and make it hold; a declared boundary that makes an efficiency claim checkable; a retirement obligation that forces the old layer's removal rather than leaving it to nobody's initiative; and a named measurement owner, because an effect nobody is accountable for reporting is an effect nobody will ever have to explain the absence of.",
        "This is the frame for the rest of the route. Every block that follows — the infrastructure map, the six-dimension analysis, the four levers, the prioritised measure — is an application of these same five control points to one company's specific situation.",
      ],
    },
  ],
  reasoning: [
    "When you read NetSphere's infrastructure map in section B, sort each hotspot by which of the five control levers is missing, not by which piece of technology it names.",
    "In the Vertex task, ranking 'sustainability impact' without stating a boundary is exactly the error this section warns against — the ranking is not comparable to anything until the perimeter is named.",
    "A recommendation that only addresses one lever (say, criteria) while leaving the approval gate toothless will not hold — check your own first measure against all five before you commit to it.",
  ],
  callout: {
    label: "The distinction to keep making",
    text: "\"More efficient\" is a claim about a ratio. \"Uses less\" is a claim about an absolute. They are not the same claim, and a business case should never be allowed to drift from one to the other mid-sentence.",
  },
  references: [
    {
      label: "ETSI ES 203 228 V1.3.1 (2020-10) / ITU-T L.1331",
      detail: "Energy efficiency as useful output per unit of energy over a declared boundary — a ratio, not an absolute.",
    },
    {
      label: "GSMA — Mobile Net Zero (2025) and Mobile Net Zero 2026",
      detail: "Operational emissions −8% (2019–2023) and −13% (2019–2024) while traffic quadrupled; ≈7.5%/yr needed to 2030.",
    },
    {
      label: "5G specification target — energy per bit",
      detail: "Up to ≈90% less energy per bit than earlier generations: a per-bit design target, not a total-consumption outcome.",
    },
    {
      label: "Rebound effect / Jevons paradox; embodied vs operational emissions; enabling effect",
      detail: "The three concepts behind the four leaks and the device-commitment argument above.",
    },
  ],
};
