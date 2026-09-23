import { KESSLER_INPUTS as K, MODEL_FIGURES } from "@/data/offers";
import type { FigureId } from "@/data/offers";
import { LEVER_BY_ID, POOL, POSITION_LABEL, computeBoard } from "@/data/leverData";
import type { GId, Levers } from "@/data/leverData";
import { parseAmount } from "@/lib/parseAmount";

/**
 * The "automatic calculator" under a calculation question: the formula split into small labelled
 * parts. The learner types each part (a value read from the tables or the board); the result is
 * computed live and can be copied into the answer field. On "Check", every part is compared with the
 * value it should hold, and a wrong part names the exact row and part of the row to read — never the
 * value itself. Expected values come from the same constants as the tables and the model answers.
 */
export type CalcPart = {
  id: string;
  /** Short label shown above the input, e.g. "Day rate (€ per day)". */
  label: string;
  expected: number;
  /** Absolute tolerance; 0 for a value read straight off a table. */
  tolerance?: number;
  /** Where to read it, shown when the part is flagged: the row and which part of it, never the value. */
  clue: string;
};

export type CalcBuilder = {
  parts: CalcPart[];
  /** The result from the part values (all present). */
  compute: (v: Record<string, number>) => number;
  /** The formula with the learner's values in place, for display. */
  show: (v: Record<string, string>) => string;
};

const TERM_CLUE = "Offer sheet · Term / notice: the term in years, not the notice period in months.";

export const FIGURE_BUILDERS: Record<FigureId, CalcBuilder> = {
  F1: {
    parts: [
      { id: "fee", label: "Offer B annual fee (€ per year)", expected: K.FEE_B, clue: "Offer sheet · Annual fee, in the Offer B column." },
      { id: "cap", label: "Fee-line cap (€ per year)", expected: K.CAP, clue: "Cost lines · Fee-line cap (IT services): the yearly amount." },
    ],
    compute: (v) => v.fee - v.cap,
    show: (v) => `${v.fee} − ${v.cap}`,
  },
  F2: {
    parts: [
      { id: "days", label: "Onboarding person-days", expected: K.ONBOARD_DAYS, clue: "Cost lines · Offer A onboarding: the number of person-days." },
      { id: "rate", label: "Day rate (€ per day)", expected: K.ONBOARD_DAY_RATE, clue: "Cost lines · Offer A onboarding: the amount per day." },
    ],
    compute: (v) => v.days * v.rate,
    show: (v) => `${v.days} × ${v.rate}`,
  },
  F3: {
    parts: [
      { id: "years", label: "Term (years)", expected: K.TERM, clue: TERM_CLUE },
      { id: "fee", label: "Offer A annual fee (€ per year)", expected: K.FEE_A, clue: "Offer sheet · Annual fee, in the Offer A column." },
      { id: "obDays", label: "Onboarding person-days", expected: K.ONBOARD_DAYS, clue: "Cost lines · Offer A onboarding: the number of person-days." },
      { id: "obRate", label: "Onboarding day rate (€ per day)", expected: K.ONBOARD_DAY_RATE, clue: "Cost lines · Offer A onboarding: the amount per day." },
      { id: "revDays", label: "Review working days", expected: K.DOC_REVIEW_DAYS, clue: "Cost lines · Offer A documentation gap review: the number of working days." },
      { id: "revHours", label: "Review hours per day", expected: K.DOC_REVIEW_HOURS_PER_DAY, clue: "Cost lines · Offer A documentation gap review: the hours per day." },
      {
        id: "intRate",
        label: "Internal rate (€ per hour)",
        expected: K.RATE_INTERNAL,
        clue: "Cost lines · Kessler internal IT cost rate (per hour). The review is Kessler's own staff time, not NordByte's day rate.",
      },
      { id: "incHours", label: "Incident hours per year", expected: K.INCIDENT_HOURS, clue: "Cost lines · Expected incident-response workload: the hours per year." },
      { id: "tmRate", label: "T&M rate (€ per hour)", expected: K.TM_RATE_A, clue: "Offer sheet · Incident response, in the Offer A column: the amount per hour." },
    ],
    compute: (v) => v.years * v.fee + v.obDays * v.obRate + v.revDays * v.revHours * v.intRate + v.incHours * v.tmRate * v.years,
    show: (v) => `${v.years} × ${v.fee} + ${v.obDays} × ${v.obRate} + ${v.revDays} × ${v.revHours} × ${v.intRate} + ${v.incHours} × ${v.tmRate} × ${v.years}`,
  },
  F4: {
    parts: [
      { id: "totalA", label: "Offer A three-year total (€)", expected: MODEL_FIGURES.F3, tolerance: 50, clue: "Your F3 result: Offer A's three-year cash total." },
      { id: "years", label: "Term (years)", expected: K.TERM, clue: TERM_CLUE },
      { id: "fee", label: "Offer B annual fee (€ per year)", expected: K.FEE_B, clue: "Offer sheet · Annual fee, in the Offer B column." },
      {
        id: "extra",
        label: "Offer B hours above the included (per year)",
        expected: Math.max(0, K.INCIDENT_HOURS - K.INCIDENT_INCLUDED_B),
        clue: "Compare Cost lines · Expected incident-response workload (hours per year) with Offer sheet · Incident response, Offer B column (hours included). Only the hours above the included ones count.",
      },
      { id: "rateB", label: "Offer B rate above included (€ per hour)", expected: 140, clue: "Offer sheet · Incident response, in the Offer B column: the amount per hour after the included hours." },
    ],
    compute: (v) => v.totalA - (v.years * v.fee + v.extra * v.rateB * v.years),
    show: (v) => `${v.totalA} − (${v.years} × ${v.fee} + ${v.extra} × ${v.rateB} × ${v.years})`,
  },
  F5: {
    parts: [
      { id: "aroA", label: "ARO with Offer A (per year)", expected: K.ARO_A, tolerance: 1e-9, clue: "Risk table · ARO with Offer A." },
      { id: "aroB", label: "ARO with Offer B (per year)", expected: K.ARO_B, tolerance: 1e-9, clue: "Risk table · ARO with Offer B." },
      { id: "sle", label: "Single-loss expectancy (€)", expected: K.SLE, clue: "Risk table · Single-loss expectancy." },
      { id: "years", label: "Term (years)", expected: K.TERM, clue: TERM_CLUE },
    ],
    compute: (v) => (v.aroA - v.aroB) * v.sle * v.years,
    show: (v) => `(${v.aroA} − ${v.aroB}) × ${v.sle} × ${v.years}`,
  },
};

/** Builders for the Task 3 readings that involve arithmetic; G2 and G3 are single readings and have none. */
export function gBuilders(levers: Levers): Partial<Record<GId, CalcBuilder>> {
  const b = computeBoard(levers);
  const pos = (id: "l1" | "l2" | "l3") => POSITION_LABEL[levers[id]];
  const costClue = (id: "l1" | "l2" | "l3") =>
    `Allocation board · ${LEVER_BY_ID[id].name}: the cost printed beside the position you set (${pos(id)}).`;
  return {
    G1: {
      parts: [
        { id: "l1", label: "L1 cost at its position (€)", expected: LEVER_BY_ID.l1.cost[levers.l1], clue: costClue("l1") },
        { id: "l2", label: "L2 cost at its position (€)", expected: LEVER_BY_ID.l2.cost[levers.l2], clue: costClue("l2") },
        { id: "l3", label: "L3 cost at its position (€)", expected: LEVER_BY_ID.l3.cost[levers.l3], clue: costClue("l3") },
      ],
      compute: (v) => v.l1 + v.l2 + v.l3,
      show: (v) => `${v.l1} + ${v.l2} + ${v.l3}`,
    },
    G4: {
      parts: [
        {
          id: "raw",
          label: "L3 output at its position",
          expected: LEVER_BY_ID.l3.produces[levers.l3],
          clue: `Allocation board · L3 · Framework-agreement push: the accounts printed beside the position you set (${pos("l3")}).`,
        },
        {
          id: "div",
          label: "Divide by (1 or 2)",
          expected: b.sequenceHit ? 2 : 1,
          clue: "How the board counts: L3 is halved only when L1 is None. Look at L1's position: 2 if it is None, otherwise 1.",
        },
      ],
      compute: (v) => Math.floor(v.raw / v.div),
      show: (v) => `⌊${v.raw} ÷ ${v.div}⌋`,
    },
    G5: {
      parts: [
        { id: "sq", label: "Status Quo conversions (your G4)", expected: b.conversions.statusQuo, clue: "Your G4: the Status Quo conversions after any halving for L1." },
      ],
      compute: (v) => Math.floor(v.sq / 2),
      show: (v) => `⌊${v.sq} ÷ 2⌋`,
    },
    G6: {
      parts: [
        { id: "pool", label: "One-off accounts in the pool", expected: POOL, clue: "How the board counts, or the Uncovered pool meter: the number of one-off accounts in the whole pool." },
        { id: "rev", label: "Reviewed accounts (your G3)", expected: b.reviews, clue: `Allocation board · L2 · Value-realization reviews: the accounts printed beside the position you set (${pos("l2")}).` },
      ],
      compute: (v) => v.pool - v.rev,
      show: (v) => `${v.pool} − ${v.rev}`,
    },
  };
}

export const partKey = (figure: string, part: string) => `${figure}.${part}`;

/** Parses every part of a builder; null for a part that is empty or unreadable. */
export function partValues(b: CalcBuilder, figure: string, parts: Record<string, string>): Record<string, number | null> {
  return Object.fromEntries(
    b.parts.map((p) => {
      const raw = (parts[partKey(figure, p.id)] ?? "").trim();
      return [p.id, raw ? parseAmount(raw) : null];
    }),
  );
}

/** The live result, or null while a part is missing. */
export function builderResult(b: CalcBuilder, figure: string, parts: Record<string, string>): number | null {
  const v = partValues(b, figure, parts);
  if (Object.values(v).some((x) => x === null)) return null;
  const r = b.compute(v as Record<string, number>);
  return Number.isFinite(r) ? Math.round(r * 1e6) / 1e6 : null;
}

/** Part keys ("F3.intRate") whose entered value differs from what the row holds. Empty parts are not flagged. */
export function wrongParts(b: CalcBuilder, figure: string, parts: Record<string, string>): string[] {
  const v = partValues(b, figure, parts);
  return b.parts
    .filter((p) => {
      const x = v[p.id];
      return x !== null && Math.abs(x - p.expected) > (p.tolerance ?? 1e-9);
    })
    .map((p) => partKey(figure, p.id));
}

/** True when every part is filled and none is wrong. */
export function allPartsRight(b: CalcBuilder, figure: string, parts: Record<string, string>): boolean {
  const v = partValues(b, figure, parts);
  return Object.values(v).every((x) => x !== null) && wrongParts(b, figure, parts).length === 0;
}

/** The model part values, as strings, for the mentor fill. */
export function modelParts(builders: Partial<Record<string, CalcBuilder>>): Record<string, string> {
  const out: Record<string, string> = {};
  for (const [fid, b] of Object.entries(builders)) if (b) for (const p of b.parts) out[partKey(fid, p.id)] = String(p.expected);
  return out;
}
