/**
 * S5 — Technological potential versus real system impact.
 */

import type { MaterialSection } from "@/lib/materialSection";
import type { MaterialSectionId } from "../sections";

// ---------------------------------------------------------------------------
// SVG #9 — The Efficiency Leak (illustrative model)
// ---------------------------------------------------------------------------

export type Leak = { id: string; label: string; text: string; initial: number };

/** Each leak takes its share of what the previous one left, so the four compound. */
export const LEAKS: Leak[] = [
  { id: "rebound", label: "Rebound", text: "Cheaper use becomes more use.", initial: 30 },
  { id: "stacking", label: "Layer stacking", text: "The new layer is added; the old one is never retired.", initial: 20 },
  {
    id: "displacement",
    label: "Scope displacement",
    text: "Impact moves to another budget — the cloud platform, a supplier's Scope 3.",
    initial: 15,
  },
  {
    id: "complexity",
    label: "Complexity overhead",
    text: "More systems, monitoring, maintenance and spare capacity.",
    initial: 10,
  },
];

export const LEAK_LABELS = {
  promised: "Promised efficiency gain",
  realised: "Realised system gain",
  disclaimer: "Illustrative model, not measured data.",
  how: "Each leak takes its share of what the previous leak left over, so modest leaks compound.",
};

/** Remaining gain after each leak, starting from 100. */
export function leakCascade(shares: number[]): number[] {
  const remaining = [100];
  for (const s of shares) remaining.push(remaining[remaining.length - 1] * (1 - Math.max(0, Math.min(100, s)) / 100));
  return remaining;
}

// ---------------------------------------------------------------------------
// The section
// ---------------------------------------------------------------------------

export const S5_SYSTEM: MaterialSection<MaterialSectionId> = {
  id: "system",
  code: "S5",
  n: 5,
  icon: "link",
  kicker: "S5 · From technology to trade-offs",
  title: "Technological potential vs. real system impact",
  standfirst:
    "A component can be demonstrably more efficient while the system it joins consumes more. Four mechanisms decide which way it goes.",
  minutes: 18,
  definition:
    "The gap between component efficiency and system outcome is where most sustainability cases for connected infrastructure fail. A component can be demonstrably more efficient while the system it joins consumes more. Four mechanisms consume the promised gain: rebound, layer stacking, scope displacement and complexity overhead.",
  insight:
    "Each mechanism moves the gain somewhere a component-level measurement does not look. Rebound turns cheaper use into more use. Layer stacking adds the new generation without retiring the old. Scope displacement moves impact into another budget — from the device to the cloud, or into a supplier's Scope 3. Complexity overhead adds systems, monitoring, maintenance and spare capacity that someone has to run. None of the four shows up in a vendor's efficiency figure.",
  takeaway:
    "State the boundary and the counterfactual before any claim: compared to what, measured over which perimeter, over what period? That managerial habit has a technical precedent — ETSI ES 203 228 makes the boundary part of the assessment report. And hold enabling claims to one rule: an enabling claim without a measurement plan is a marketing claim.",
  body: [
    {
      heading: "Four mechanisms that consume the promised gain",
      paragraphs: [
        "Rebound: efficiency per unit lowers the effective cost of use, and use grows (S4). Layer stacking: the new technology is added, the old one is never retired, and the baselines of both are paid (S1). Scope displacement: impact does not disappear, it moves — from the device to the cloud platform that stores its data, or out of the organisation into a supplier's Scope 3, where climate reporting under CSRD and ESRS E1 eventually finds it again. Complexity overhead: every additional system brings monitoring, maintenance, spare capacity and integration work, each with its own energy and operating cost.",
        "The Efficiency Leak shows how quickly the four compound. Each takes a share of what the previous one left, so modest leaks in all four can consume most of a promised gain — without any single component failing to perform as specified.",
      ],
    },
    {
      heading: "The boundary and the counterfactual",
      paragraphs: [
        "Every system claim needs three coordinates: compared to what (the counterfactual), measured over which perimeter (the boundary), and over what period. Without them, the same programme can be presented as a success and as a failure with equal honesty — the network became more efficient per bit, and the organisation's total consumption rose.",
        "ETSI ES 203 228 is the technical precedent for the habit. It does not let an operator report a network efficiency figure without declaring the boundary of the partial network it measured and the method used to extrapolate. The managerial version is simply to refuse any claim — a vendor's, a department's or your own — that has not done the same.",
      ],
    },
    {
      heading: "Enabling effects: legitimate, and the hardest to defend",
      paragraphs: [
        "Enabling effects — savings caused elsewhere, such as heating energy saved by occupancy sensors — are the legitimate core of most IoT and 5G business cases. They are also the hardest part to defend, because their counterfactual is hypothetical: what would have happened without the sensors cannot be observed, only estimated. That is why an enabling claim without a measurement plan is a marketing claim.",
        "At sector level, ITU-T L.1470 sets out a greenhouse-gas emission reduction trajectory for the ICT sector consistent with the Paris Agreement. It is the reason relative efficiency is not the finish line: connected infrastructure has to fit an absolute trajectory, not merely improve on its own past.",
      ],
    },
  ],
  reasoning: [
    "In Part 2, rank Sustainability impact only after you have stated a perimeter and a comparison. An option can rank first over this year's network perimeter and second over a multi-year perimeter that includes devices — both defend; a ranking without a perimeter does not.",
    "An option that relies on expected enabling savings or on per-bit efficiency has not yet shown sustainability impact. Ask which of the four leaks it leaves open.",
    "Your Part 2 justification should name the boundary and the counterfactual in one sentence: compared to what, over which perimeter, over what period.",
  ],
  callout: {
    label: "The rule for enabling claims",
    text: "An enabling claim without a measurement plan is a marketing claim.",
  },
  references: [
    {
      label: "ETSI ES 203 228 V1.3.1 (2020-10)",
      detail: "Boundary declaration and partial-network extrapolation — the technical precedent for stating a perimeter.",
    },
    {
      label: "ITU-T L.1470",
      detail: "Greenhouse-gas emission trajectories for the ICT sector compatible with the Paris Agreement.",
      url: "https://www.itu.int/rec/T-REC-L.1470",
    },
    {
      label: "CSRD / ESRS E1 (covered earlier in the programme)",
      detail: "Climate reporting including energy consumption and Scope 1, 2 and 3 — where displaced impact reappears.",
    },
    {
      label: "Rebound effect / Jevons paradox",
      detail: "Efficiency gains per unit lower the effective cost of use, which can increase total consumption.",
    },
  ],
};
