/**
 * S4 — 5G: efficiency promise and system-level risk.
 */

import type { MaterialSection } from "@/lib/materialSection";
import type { MicroCheckBlock } from "@/lib/microCheck";
import type { MaterialSectionId } from "../sections";

// ---------------------------------------------------------------------------
// SVG #6 — The Rebound Curve (illustrative model)
// ---------------------------------------------------------------------------

/**
 * Energy per bit falls towards a floor with diminishing returns; traffic grows
 * by a constant rate per period; total energy is their product. Everything is
 * an index with period 0 = 100. The numbers carry no operator data — the model
 * exists to show where the total turns.
 */
export const REBOUND_MODEL = {
  periods: 10,
  /** Energy per bit approaches 30% of its starting value… */
  floor: 0.3,
  /** …closing a quarter of the remaining gap each period. */
  decay: 0.75,
  min: 0,
  max: 30,
  step: 1,
  defaultGrowth: 10,
  presets: [
    { id: "conservative", label: "Conservative", growth: 3 },
    { id: "observed", label: "Observed pattern", growth: 10 },
    { id: "aggressive", label: "Aggressive expansion", growth: 25 },
  ],
  disclaimer: "Illustrative model for teaching the rebound mechanism — not operator data.",
  observedNote:
    "'Observed pattern' reproduces the shape GSMA reports — total falling while traffic multiplies, then flattening — not its numbers.",
};

export type ReboundSeries = { perBit: number[]; traffic: number[]; total: number[] };

export function reboundSeries(growthPct: number): ReboundSeries {
  const { periods, floor, decay } = REBOUND_MODEL;
  const perBit: number[] = [];
  const traffic: number[] = [];
  const total: number[] = [];
  for (let t = 0; t <= periods; t++) {
    const e = floor + (1 - floor) * Math.pow(decay, t);
    const v = Math.pow(1 + growthPct / 100, t);
    perBit.push(e * 100);
    traffic.push(v * 100);
    total.push(e * v * 100);
  }
  return { perBit, traffic, total };
}

/** The first period in which total energy rises again, or null if it never does within the horizon. */
export function reboundTurn(total: number[]): number | null {
  for (let t = 1; t < total.length; t++) if (total[t] > total[t - 1] + 1e-9) return t;
  return null;
}

export function reboundVerdict(total: number[]): string {
  const turn = reboundTurn(total);
  return turn === null
    ? `At this growth rate, efficiency gains are not outpaced within ${REBOUND_MODEL.periods} periods — total energy keeps falling.`
    : `At this growth rate, efficiency gains are outpaced from period ${turn} onward.`;
}

// ---------------------------------------------------------------------------
// SVG #7 — The Use-Case Qualifier
// ---------------------------------------------------------------------------

export type QualifierOutcome = "justified" | "sufficient" | "unevidenced";

export const QUALIFIER = {
  requirements: [
    {
      id: "throughput",
      label: "Throughput",
      question: "Does the use case need throughput that existing connectivity cannot deliver?",
    },
    {
      id: "latency",
      label: "Latency",
      question: "Does it need low, deterministic latency that existing connectivity cannot deliver?",
    },
    {
      id: "density",
      label: "Density",
      question: "Does it need a device density that existing connectivity cannot support?",
    },
    {
      id: "mobility",
      label: "Mobility",
      question: "Does it need connectivity on the move that existing connectivity cannot provide?",
    },
  ],
  evidence: {
    label: "Evidenced?",
    question: "Is that need evidenced — measured, or written into a specification — rather than assumed?",
  },
  outcomes: {
    justified: {
      label: "5G justified",
      text: "An evidenced requirement that existing connectivity cannot meet. Now ask which layer gets retired, and who owns the measured benefit.",
    },
    sufficient: {
      label: "Existing connectivity sufficient",
      text: "None of the four requirements is beyond what the current network delivers. Speed and flexibility on their own are not a requirement.",
    },
    unevidenced: {
      label: "Requirement not yet evidenced",
      text: "A plausible requirement, but assumed rather than shown. Measure or specify it before anything is deployed.",
    },
  } satisfies Record<QualifierOutcome, { label: string; text: string }>,
};

// ---------------------------------------------------------------------------
// The section
// ---------------------------------------------------------------------------

export const S4_FIVEG: MaterialSection<MaterialSectionId> = {
  id: "fiveg",
  code: "S4",
  n: 4,
  icon: "antenna",
  kicker: "S4 · The efficiency promise and the system-level risk",
  title: "5G: efficiency promise and system-level risk",
  standfirst:
    "Up to around 90% less energy per bit is a design target for one factor of a product. Total energy is energy per bit multiplied by bits.",
  minutes: 13,
  definition:
    "5G offers five things that matter for operations: higher throughput, low latency, support for high device density, network slicing, and deterministic behaviour for latency-critical industrial use cases. Its efficiency claim is precise and narrow. The specification targets up to around 90% less energy per bit transferred than earlier generations — a per-bit design target, not a measured outcome, and not a statement about total network consumption.",
  insight:
    "The rebound mechanism is the conceptual core of the whole day. Efficiency per unit improves; the effective cost of each unit of use falls; use cases that were uneconomic become viable; volume grows faster than efficiency improves; and total consumption rises although every component is more efficient. It is called the rebound effect, or the Jevons paradox. The GSMA's figures show the mechanism with the brakes partly on: operational emissions down 8% between 2019 and 2023 and 13% between 2019 and 2024 while traffic quadrupled — relative decoupling achieved, while the pace the sector needs, around 7.5% a year to 2030, is more than twice the rate achieved so far.",
  takeaway:
    "Put four questions to any 5G use case before its sustainability case is accepted. What does it need that existing connectivity cannot deliver — throughput, latency, density or mobility? Is that need real, or assumed? Which layer gets retired when this one is built? And what is the measured benefit, and who owns the measurement?",
  body: [
    {
      heading: "What 5G offers that operations actually use",
      paragraphs: [
        "Higher throughput moves large data volumes — machine-vision images from an inspection station, for example. Low latency lets control loops close over radio, which is what automated guided vehicles on a shop floor need. High device-density support lets a dense sensor fleet share a cell. Network slicing reserves logically separate capacity for one service, such as a campus network for a mobile maintenance workforce. Deterministic behaviour gives latency-critical industrial processes a predictable, bounded response instead of best effort.",
      ],
    },
    {
      heading: "The efficiency claim, stated precisely",
      paragraphs: [
        "A target of up to around 90% less energy per bit says what one bit should cost. It says nothing about how many bits there will be, and it is a design target rather than a measured result. Total energy is energy per bit multiplied by bits — and the second factor is exactly what new capability invites to grow.",
      ],
    },
    {
      heading: "The rebound mechanism, step by step",
      paragraphs: [
        "One: efficiency per unit improves. Two: the effective cost per unit of use falls. Three: new use cases become viable that were previously uneconomic. Four: volume grows faster than efficiency improves. Five: total consumption rises, despite every individual component being more efficient. The Rebound Curve lets you set the traffic growth rate and watch the period in which the total turns.",
        "The GSMA evidence describes the middle ground. Emissions have fallen while traffic quadrupled, so efficiency has outpaced growth so far — but not fast enough to reach the required absolute reduction. That is what 'relative decoupling achieved, absolute pace insufficient' means in practice.",
      ],
    },
    {
      heading: "New layers run alongside old ones",
      paragraphs: [
        "New frequency layers frequently run alongside existing ones, and densification adds sites. The sustainability outcome of a 5G programme therefore depends less on the efficiency of the new equipment than on whether an older layer is retired — which, as S1 showed with the 3G example, is a governance decision rather than a technical one.",
      ],
    },
  ],
  reasoning: [
    "Read a 5G signal whose stated reason is speed or flexibility as a sustainability risk, unless the requirement is evidenced and a layer is retired. 'Both' holds only if your justification names those two conditions.",
    "A 5G signal belongs where its requirement should be tested — the use of 5G itself — not where its energy is eventually reported. By the time rebound shows in the energy figures, the layers are built.",
    "In Part 2, an option that relies on per-bit efficiency to carry its sustainability case has not yet made one: per bit is not total, and a design target is not a measured result.",
  ],
  callout: {
    label: "Per bit is not total",
    text: "Total energy = energy per bit × bits. A business case that quotes only the first factor has not yet said anything about the result.",
  },
  references: [
    {
      label: "5G specification target — energy per bit",
      detail:
        "Up to ≈90% less energy per bit transferred than previous generations: a per-bit design target, not a measured total-consumption outcome.",
    },
    {
      label: "GSMA — Mobile Net Zero, 5th annual report (2025)",
      detail: "Operational emissions −8% (2019–2023) while data traffic quadrupled; ≈7.5% a year needed to 2030.",
    },
    {
      label: "GSMA — Mobile Net Zero 2026",
      detail: "Operational emissions −13% (2019–2024) while data traffic more than quadrupled.",
    },
    {
      label: "GSMA — 'zero bit, zero watt'",
      detail: "Deep sleep states for 5G radio units when no traffic is present.",
    },
    {
      label: "Rebound effect / Jevons paradox",
      detail: "Efficiency gains per unit lower the effective cost of use, which can increase total consumption.",
    },
  ],
};

// ---------------------------------------------------------------------------
// Micro-check 4
// ---------------------------------------------------------------------------

export const MICRO_4: MicroCheckBlock = {
  id: "mc4",
  title: "Check your understanding · S4",
  questions: [
    {
      id: "mc4-q1",
      prompt:
        "A vendor states that its 5G equipment uses up to 90% less energy per bit than the previous generation. What does that claim establish?",
      options: [
        {
          id: "a",
          text: "That the network's total consumption will fall by up to 90%.",
          feedback: "Not quite. Total energy is energy per bit × bits, and the claim covers only the first factor.",
        },
        {
          id: "b",
          text: "A per-bit design target — nothing about how much energy the network will consume in total.",
          correct: true,
          feedback:
            "Correct. It is a target for one bit, not a measurement of the network. Whether total consumption falls depends on how many bits the new capability invites.",
        },
        {
          id: "c",
          text: "A measured result across operators.",
          feedback: "Not quite. It is a design target from the specification, not a measured outcome.",
        },
        {
          id: "d",
          text: "That older layers can now be switched off.",
          feedback: "Not quite. Retiring a layer is a governance and migration decision; per-bit efficiency does not take it.",
        },
      ],
    },
    {
      id: "mc4-q2",
      prompt:
        "A plant replaces Wi-Fi with a 5G campus network that is more efficient per bit. Because video inspection is now cheap to run, every line gets high-resolution cameras streaming continuously, and plant network energy rises. Which step of the rebound mechanism explains the rise?",
      options: [
        {
          id: "a",
          text: "The efficiency gain was never real.",
          feedback: "Not quite. The per-bit gain can be entirely real and the total still rise.",
        },
        {
          id: "b",
          text: "New use cases became viable, and volume grew faster than efficiency improved.",
          correct: true,
          feedback:
            "Correct — steps three and four. Cheaper bits made continuous video worth running, and the volume outran the per-bit saving.",
        },
        {
          id: "c",
          text: "The old Wi-Fi was retired.",
          feedback: "Not quite. Retiring the old layer removes a baseline; it works against the rise, not towards it.",
        },
        {
          id: "d",
          text: "The cameras had to be manufactured.",
          feedback: "That is embodied impact — a different mechanism from rebound.",
        },
      ],
    },
    {
      id: "mc4-q3",
      prompt: "Which fact would most change a 5G business case that rests on sustainability?",
      options: [
        {
          id: "a",
          text: "The brand of the radio units.",
          feedback: "Not quite. That changes the equipment, not the system outcome.",
        },
        {
          id: "b",
          text: "That 5G supports network slicing.",
          feedback: "A real capability, but it says nothing about the sustainability outcome.",
        },
        {
          id: "c",
          text: "Whether the existing layer it runs alongside will actually be retired, and who owns that decision.",
          correct: true,
          feedback:
            "Correct. New layers frequently run alongside old ones; whether the old one is retired decides the outcome more than the new equipment's efficiency.",
        },
        {
          id: "d",
          text: "The per-bit efficiency target in the specification.",
          feedback: "Already assumed by every 5G case — and it settles nothing about the total.",
        },
      ],
    },
  ],
};
