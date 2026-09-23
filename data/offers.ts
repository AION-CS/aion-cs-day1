/**
 * Task 2's three printed tables and the cost-layer model behind the Cost
 * explorer. Every value below is a *Case assumption*, printed on screen.
 * The five figures F1–F5 are derived from these constants, so the tables, the
 * TcoStack and the answer key can never disagree.
 */

export type OfferRow = { label: string; a: string; b: string };

export const OFFER_SHEET: OfferRow[] = [
  { label: "Annual fee", a: "€44,000", b: "€50,000" },
  { label: "Term / notice", a: "3 years / 6 months", b: "3 years / 6 months" },
  { label: "Monitoring", a: "Business hours (8×5)", b: "24×7" },
  { label: "Incident response", a: "Time & material at €165/h", b: "40 h/year included, then €140/h" },
  { label: "ISO/IEC 27001 certificate", a: "Not certified", b: "Certified" },
  { label: "Advisory / data-platform roadmap", a: "Not included", b: "Not included" },
];

export const COST_LINES: { label: string; value: string }[] = [
  { label: "Kessler internal IT cost rate", value: "€85 per hour" },
  {
    label: "Offer A onboarding (NordByte environment discovery, charged separately)",
    value: "10 person-days at €1,100 per day",
  },
  { label: "Offer A documentation gap review (Kessler IT lead time)", value: "3 working days at 8 h/day" },
  { label: "Expected incident-response workload (both offers)", value: "30 h per year" },
  { label: "Fee-line cap (IT services)", value: "€48,000 per year" },
];

export const RISK_TABLE: { label: string; value: string }[] = [
  {
    label: "Single-loss expectancy, ransomware stopping production IT (3 days downtime + recovery)",
    value: "€420,000",
  },
  { label: "ARO with Offer A (8×5 monitoring, response on request)", value: "0.05 per year" },
  { label: "ARO with Offer B (24×7 monitoring, response included)", value: "0.03 per year" },
];

// --- constants the maths runs on -------------------------------------------
const TERM = 3;
const FEE_A = 44_000;
const FEE_B = 50_000;
const CAP = 48_000;
const RATE_INTERNAL = 85;
const ONBOARD_DAYS = 10;
const ONBOARD_DAY_RATE = 1_100;
const DOC_REVIEW_HOURS = 3 * 8;
const INCIDENT_HOURS = 30;
const TM_RATE_A = 165;
const SLE = 420_000;
const ARO_A = 0.05;
const ARO_B = 0.03;
const CARE_PER_YEAR = 4 * 12 * 100; // 4 quarterly reviews × 12 h × €100/h

/** The raw inputs, for the mentor's worked answers (lib/mentorGuide.ts), so they compute from the same constants. */
export const KESSLER_INPUTS = {
  TERM,
  FEE_A,
  FEE_B,
  CAP,
  RATE_INTERNAL,
  ONBOARD_DAYS,
  ONBOARD_DAY_RATE,
  DOC_REVIEW_DAYS: 3,
  DOC_REVIEW_HOURS_PER_DAY: 8,
  INCIDENT_HOURS,
  INCIDENT_INCLUDED_B: 40,
  TM_RATE_A,
  SLE,
  ARO_A,
  ARO_B,
} as const;

export const CAP_PER_YEAR = CAP;
export const CAP_TERM = CAP * TERM;
export const CARE_ADDON_PER_YEAR = CARE_PER_YEAR;

const onboarding = ONBOARD_DAYS * ONBOARD_DAY_RATE;
const docReview = DOC_REVIEW_HOURS * RATE_INTERNAL;
const incidentA = INCIDENT_HOURS * TM_RATE_A * TERM;
const aleA = ARO_A * SLE * TERM;
const aleB = ARO_B * SLE * TERM;
// Offer B: 30 h is inside the 40 h/year included, so no incident cost.

export type FigureId = "F1" | "F2" | "F3" | "F4" | "F5";
export const FIGURE_IDS: FigureId[] = ["F1", "F2", "F3", "F4", "F5"];

/**
 * Where a figure's inputs are printed: a row of one of the three Block 2.1
 * tables (index into OFFER_SHEET / COST_LINES / RISK_TABLE; `col` picks the
 * offer column of the offer sheet), or another figure the learner already
 * entered. It says where to look, never which operation to apply.
 */
export type FigureSource =
  | { table: "offer"; index: number; col: "a" | "b" }
  | { table: "cost" | "risk"; index: number }
  | { figure: FigureId };

export type Figure = {
  id: FigureId;
  short: string;
  question: string;
  unit: string;
  answer: number;
  tolerance: number;
  clue: string;
  /** Material section ids the question draws on. */
  material: string[];
  /** The printed rows this figure is built from, shown under the field as "Numbers you need". */
  sources: FigureSource[];
  /** The formula in words, no numbers, revealed on demand under the field ("Show the formula"). */
  formula: string;
};

const totalA = TERM * FEE_A + onboarding + docReview + incidentA;
const totalB = TERM * FEE_B;

export const FIGURES: Figure[] = [
  {
    id: "F1",
    short: "Offer B, annual fee over the cap",
    question: "By how much does Offer B's annual fee exceed the fee-line cap? (€ per year)",
    unit: "€ per year",
    answer: FEE_B - CAP,
    tolerance: 0,
    clue: "Which two numbers sit on the same budget line, and are they per year or per term?",
    material: ["B4"],
    formula: "Offer B's annual fee − the fee-line cap. Both are per year, so no × years.",
    sources: [{ table: "offer", index: 0, col: "b" }, { table: "cost", index: 4 }],
  },
  {
    id: "F2",
    short: "Offer A, onboarding cost",
    question: "What does Offer A's onboarding cost? (€)",
    unit: "€",
    answer: onboarding,
    tolerance: 0,
    clue: "Which unit does the rate use, and which unit is the quantity in?",
    material: ["B4"],
    formula: "Number of person-days × the day rate. The rate is per day, so no hours step.",
    sources: [{ table: "cost", index: 1 }],
  },
  {
    id: "F3",
    short: "Offer A, three-year cash total",
    question:
      "Three-year cash total for Offer A: fees + onboarding + documentation review (internal cost) + expected incident hours at T&M. (€)",
    unit: "€ per term",
    answer: totalA,
    tolerance: 50,
    clue: "Which lines are per year and which are one-off — and did the internal hours go through hours before euros?",
    material: ["B4"],
    formula: "(Annual fee × years) + onboarding (person-days × day rate) + documentation review (days × hours per day × internal hourly rate) + incident hours (hours per year × T&M hourly rate × years). One-off lines are counted once.",
    sources: [
      { table: "offer", index: 0, col: "a" },
      { table: "offer", index: 1, col: "a" },
      { table: "cost", index: 1 },
      { table: "cost", index: 2 },
      { table: "cost", index: 0 },
      { table: "cost", index: 3 },
      { table: "offer", index: 3, col: "a" },
    ],
  },
  {
    id: "F4",
    short: "Offer A minus Offer B, three-year cash",
    question:
      "How much more does Offer A cost than Offer B over three years in cash? Offer B: fees only, since 30 h is within the 40 h included. (€, positive number)",
    unit: "€ per term",
    answer: totalA - totalB,
    tolerance: 50,
    clue: "Are both totals built from the same cash layers, over the same term?",
    material: ["B4"],
    formula: "Offer A's three-year total (your F3) − Offer B's three-year total. Offer B's total = annual fee × years + incident hours above the hours included (here none).",
    sources: [
      { figure: "F3" },
      { table: "offer", index: 0, col: "b" },
      { table: "offer", index: 1, col: "b" },
      { table: "offer", index: 3, col: "b" },
    ],
  },
  {
    id: "F5",
    short: "Offer B, expected-loss reduction vs A",
    question:
      "Over three years, by how much does Offer B reduce expected loss (ALE) compared with Offer A? (€)",
    unit: "€ per term",
    answer: aleA - aleB,
    tolerance: 50,
    clue: "Is the formula's rate per year or per term, and which single-loss figure does it multiply?",
    material: ["B4"],
    formula: "(ARO with Offer A − ARO with Offer B) × SLE × years. The same as (ALE of A − ALE of B) × years.",
    sources: [{ table: "risk", index: 0 }, { table: "risk", index: 1 }, { table: "risk", index: 2 }, { table: "offer", index: 1, col: "a" }],
  },
];

export const FIGURE_BY_ID = Object.fromEntries(FIGURES.map((f) => [f.id, f])) as Record<FigureId, Figure>;

/** Numbers printed in the Task 2 tables — the pool "Figures cited" matches against. */
export const PRINTED_NUMBERS: number[] = [
  FEE_A,
  FEE_B,
  CAP,
  CAP_TERM,
  RATE_INTERNAL,
  ONBOARD_DAY_RATE,
  TM_RATE_A,
  140,
  SLE,
  ARO_A,
  ARO_B,
  CARE_PER_YEAR,
];

// --- Cost explorer (TcoStack) ---------------------------------------------

export type TcoLayer = {
  id: string;
  label: string;
  cash: boolean;
  alwaysOn?: boolean;
  /** One value per bar, over the whole term. */
  values: number[];
  hint?: string;
};

export type TcoData = {
  bars: { id: string; label: string }[];
  layers: TcoLayer[];
  /** A marker on the fee layer, drawn per bar. */
  cap?: { label: string; value: number };
  max: number;
  termLabel: string;
};

export function kesslerTco(careOn: boolean): TcoData {
  const layers: TcoLayer[] = [
    { id: "fees", label: "Fees", cash: true, alwaysOn: true, values: [TERM * FEE_A, TERM * FEE_B] },
    {
      id: "onboarding",
      label: "Onboarding + documentation review (A only)",
      cash: true,
      values: [onboarding + docReview, 0],
    },
    { id: "incident", label: "Expected incident hours", cash: true, values: [incidentA, 0] },
  ];
  if (careOn) {
    layers.push({
      id: "care",
      label: "Care after go-live (B add-on)",
      cash: true,
      alwaysOn: true,
      values: [0, CARE_PER_YEAR * TERM],
    });
  }
  layers.push({
    id: "ale",
    label: "Expected loss (ALE, non-cash)",
    cash: false,
    values: [aleA, aleB],
  });
  return {
    bars: [
      { id: "A", label: "Offer A · NordByte IT" },
      { id: "B", label: "Offer B · TechSolutions" },
    ],
    layers,
    cap: { label: "Fee-line cap, 3 × €48,000", value: CAP_TERM },
    max: 240_000,
    termLabel: "Three-year term",
  };
}

export const ALPENWERK_TCO: TcoData = {
  bars: [
    { id: "X", label: "Offer X" },
    { id: "Y", label: "Offer Y" },
  ],
  layers: [
    { id: "fees", label: "Fees", cash: true, alwaysOn: true, values: [90_000, 96_000] },
    { id: "onboarding", label: "Onboarding (X only)", cash: true, values: [6_000, 0] },
    { id: "internal", label: "Internal effort (X only): 20 h × €80", cash: true, values: [1_600, 0] },
  ],
  max: 110_000,
  termLabel: "Contract term",
};

/** Sum of the cash layers that are on, per bar. */
export function cashTotals(data: TcoData, on: Record<string, boolean>): number[] {
  return data.bars.map((_, i) =>
    data.layers.reduce((s, l) => s + (l.cash && (l.alwaysOn || on[l.id]) ? l.values[i] : 0), 0),
  );
}

export const MODEL_FIGURES: Record<FigureId, number> = {
  F1: FEE_B - CAP,
  F2: onboarding,
  F3: totalA,
  F4: totalA - totalB,
  F5: aleA - aleB,
};
