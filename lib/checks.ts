import { RECORDS, RECORD_BY_ID } from "@/data/kesslerDossier";
import type { RecordId } from "@/data/kesslerDossier";
import { FIGURES, FIGURE_BY_ID, PRINTED_NUMBERS } from "@/data/offers";
import type { FigureId } from "@/data/offers";
import { extractAmounts, parseAmount } from "@/lib/parseAmount";
import type { L1State, L2State } from "@/store/useStore";

/** Records placed in a bin other than their true one. Unplaced records are "missing", not flagged. */
export function misplacedRecords(l1: L1State): RecordId[] {
  return RECORDS.filter((r) => {
    const p = l1.placements[r.id];
    return p !== null && p !== r.trueBin;
  }).map((r) => r.id);
}

/** A verdict citation must be an observation the participant filed in the category they named. */
export function citeHolds(l1: L1State, id: RecordId | ""): boolean {
  if (!id || !l1.verdict.category) return false;
  const rec = RECORD_BY_ID[id];
  return rec.observed && l1.placements[id] === l1.verdict.category;
}

/** Everything one "Check my sort" press flags: records ("E4") and citations ("V2", "V3"). */
export function flagsForSort(l1: L1State): string[] {
  const flags: string[] = [...misplacedRecords(l1)];
  const { cite1, cite2, category } = l1.verdict;
  if (category) {
    if (cite1 && !citeHolds(l1, cite1)) flags.push("V2");
    if (cite2 && cite2 !== cite1 && !citeHolds(l1, cite2)) flags.push("V3");
  }
  return flags;
}

export function figureIn(l2: L2State, id: FigureId): number | null {
  return parseAmount(l2.fillins[id]);
}

/** Filled figures that sit outside tolerance. Empty fields are "missing", not flagged. */
export function flagsForFigures(l2: L2State): FigureId[] {
  return FIGURES.filter((f) => {
    const v = figureIn(l2, f.id);
    return v !== null && Math.abs(v - f.answer) > f.tolerance;
  }).map((f) => f.id);
}

export type CitedFigure = { value: number; from: string };

const isCandidate = (n: number) => n >= 100 || (n > 0 && n < 1);
const same = (a: number, b: number) => Math.abs(a - b) < (Math.abs(b) >= 100 ? 0.5 : 1e-9);

/**
 * Numbers in the justification that match a value printed in the Task 2 tables
 * or one of the participant's own F1–F5 entries. Small integers (years, hours)
 * are ignored so "three years" does not count as citing a figure.
 */
export function citedFigures(text: string, l2: L2State): CitedFigure[] {
  const mine: { value: number; from: string }[] = [];
  for (const f of FIGURES) {
    const v = figureIn(l2, f.id);
    if (v !== null) mine.push({ value: v, from: `your ${f.id}` });
  }
  const seen = new Set<number>();
  const out: CitedFigure[] = [];
  for (const n of extractAmounts(text)) {
    if (!isCandidate(n) || seen.has(n)) continue;
    const own = mine.find((m) => same(m.value, n));
    const printed = PRINTED_NUMBERS.some((p) => same(p, n));
    if (own || printed) {
      seen.add(n);
      out.push({ value: n, from: own ? own.from : "a Task 2 table" });
    }
  }
  return out;
}

export const figureLabel = (id: FigureId) => `${id} (${FIGURE_BY_ID[id].short})`;
