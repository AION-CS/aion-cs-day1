"use client";

import { useProgress, useHydrated } from "@/lib/store";
import type { MissingItem } from "@/components/ui/MissingList";
import { validate, type RaciCell, type RowViolation } from "@/components/ui/RaciGrid";
import {
  CAPACITY_ROWS,
  DECIDE_NOW_FIELDS,
  GUIDING_DECISIONS,
  MAP_MEASURES,
  R2,
  RACI_EXERCISE,
  RACI_ROWS,
  RANK_SLOTS,
  TASK_RACI_ROLES,
  decisionById,
  quadrantFor,
  type MapMeasure,
  type QuadrantId,
} from "@/lib/route2";

/** DOM ids the missing-item list scrolls to and flashes. */
export const domId = {
  name: "r2-name",
  task: "task",

  rank: "r2-rank",
  rankSlots: "r2-rank-slots",
  rankWhy: "r2-rank-why",
  rankCheck: "r2-rank-check",

  map: "r2-map",
  mapMeasure: (id: string) => `r2-map-${id}`,
  q1: (id: string) => `r2-map-${id}-q1`,
  q2: (id: string) => `r2-map-${id}-q2`,
  bet: (id: string) => `r2-map-${id}-bet`,

  raci: "r2-raci",
  /** Matches RaciGrid's `${idPrefix}-row-${row.id}` with idPrefix "r2-raci". */
  raciRow: (rowId: string) => `r2-raci-row-${rowId}`,

  decide: "r2-decide",
  decideField: (key: string) => `r2-decide-${key}`,

  export: "r2-export",
};

export type Answer = "yes" | "no";

export type MapMeasureState = {
  measure: MapMeasure;
  q1: Answer | null;
  q2: Answer | null;
  q1Correct: boolean | null;
  q2Correct: boolean | null;
  /** Derived from the two answers — never chosen directly. */
  placed: QuadrantId | null;
  /** Position among the measures sharing this quadrant, for layout. */
  slotIndex: number;
  slotCount: number;
  retries: number;
  bet: string;
};

const asAnswer = (v: string | undefined): Answer | null => (v === "yes" || v === "no" ? v : null);

/**
 * Joins the shared progress store to Route 2's content: four exercises, one
 * derived `missing` list, one definition of done.
 *
 * Nothing here is graded live. The map position is a consequence of two
 * answers (CURRICULUM-GUIDE §5), the RACI check reports structure only, and the
 * ranking test asks about the learner's own first choice rather than scoring
 * the order.
 */
export function useRoute2() {
  const hydrated = useHydrated();
  const notes = useProgress((s) => s.notes);
  const choices = useProgress((s) => s.choices);
  const choose = useProgress((s) => s.choose);

  const name = notes[R2.name] ?? "";

  // -- Exercise 1 — ranking -------------------------------------------------
  const ranking = (notes[R2.ranking] ?? "")
    .split("|")
    .filter((id) => GUIDING_DECISIONS.some((d) => d.id === id))
    .slice(0, RANK_SLOTS);
  const rankWhy = (notes[R2.rankWhy] ?? "").trim();
  const rankCheck = choices[R2.rankCheck] || null;

  // -- Exercise 2 — the trade-off map ---------------------------------------
  const base = MAP_MEASURES.map((measure) => {
    const q1 = asAnswer(choices[R2.q1(measure.id)]);
    const q2 = asAnswer(choices[R2.q2(measure.id)]);
    return {
      measure,
      q1,
      q2,
      q1Correct: q1 === null ? null : (q1 === "yes") === measure.momentumHigh,
      q2Correct: q2 === null ? null : (q2 === "yes") === measure.structuralHigh,
      placed: q1 && q2 ? quadrantFor(q1 === "yes", q2 === "yes") : null,
      retries: Number(notes[R2.retries(measure.id)] ?? "0") || 0,
      bet: (notes[R2.bet(measure.id)] ?? "").trim(),
    };
  });

  const mapStates: MapMeasureState[] = base.map((s) => {
    const sharing = base.filter((o) => o.placed !== null && o.placed === s.placed);
    return {
      ...s,
      slotIndex: s.placed ? sharing.findIndex((o) => o.measure.id === s.measure.id) : 0,
      slotCount: s.placed ? sharing.length : 0,
    };
  });

  const placedCount = mapStates.filter((s) => s.placed).length;
  const openMeasureId = choices[R2.openMeasure] || null;

  // -- Exercise 3 — RACI ----------------------------------------------------
  const raciValue = (rowId: string, roleId: string): RaciCell => {
    const v = choices[R2.raci(rowId, roleId)];
    return v === "R" || v === "A" || v === "C" || v === "I" ? v : "";
  };
  const raciViolations: RowViolation[] = validate(
    RACI_ROWS,
    TASK_RACI_ROLES,
    raciValue,
    CAPACITY_ROWS,
    RACI_EXERCISE.violations,
  );
  const raciTouched = (rowId: string) =>
    TASK_RACI_ROLES.some((role) => raciValue(rowId, role.id) !== "");
  const accountableFor = (rowId: string) =>
    TASK_RACI_ROLES.filter((role) => raciValue(rowId, role.id) === "A");
  const raciStructuralIssues = raciViolations.filter((v) => v.kind !== "authority");
  const raciAuthorityWarnings = raciViolations.filter((v) => v.kind === "authority");

  // -- Exercise 4 — the decision that cannot wait ---------------------------
  const decideNow = Object.fromEntries(
    DECIDE_NOW_FIELDS.map((f) => [f.key, (notes[R2.decideNow(f.key)] ?? "").trim()]),
  ) as Record<string, string>;

  // -- Missing list — one entry per concretely missing thing, in page order --
  const openMeasure = (id: string) => () => choose(R2.openMeasure, id);
  const missing: MissingItem[] = [];

  if (!name.trim()) {
    missing.push({ id: domId.name, label: "Your name — needed to label the export" });
  }

  if (ranking.length < RANK_SLOTS) {
    missing.push({
      id: domId.rankSlots,
      label: `Guiding decisions — ${ranking.length} of ${RANK_SLOTS} positions filled`,
    });
  }
  if (!rankWhy) {
    missing.push({
      id: domId.rankWhy,
      label: ranking[0]
        ? `Justification for your #1 — ${decisionById(ranking[0]).label}`
        : "Justification for your #1 guiding decision",
    });
  }

  for (const s of mapStates) {
    const short = s.measure.label.split(" — ")[0];
    if (!s.q1) {
      missing.push({
        id: domId.q1(s.measure.id),
        label: `Momentum-cost question for ${s.measure.label}`,
        before: openMeasure(s.measure.id),
      });
    }
    if (!s.q2) {
      missing.push({
        id: domId.q2(s.measure.id),
        label: `Structural-impact question for ${s.measure.label}`,
        before: openMeasure(s.measure.id),
      });
    }
    if (s.placed === "bet" && !s.bet) {
      missing.push({
        id: domId.bet(s.measure.id),
        label: `Strategic-bet line for ${short} — why this one, or why not`,
        before: openMeasure(s.measure.id),
      });
    }
  }

  for (const row of RACI_ROWS) {
    if (!raciTouched(row.id)) {
      missing.push({ id: domId.raciRow(row.id), label: `RACI — ${row.label}: not assigned yet` });
      continue;
    }
    for (const v of raciStructuralIssues.filter((x) => x.rowId === row.id)) {
      const what =
        v.kind === "manyA"
          ? "more than one Accountable"
          : v.kind === "noA"
            ? "no Accountable"
            : "no Responsible";
      missing.push({ id: domId.raciRow(row.id), label: `RACI — ${row.label}: ${what}` });
    }
  }

  for (const f of DECIDE_NOW_FIELDS) {
    if (!decideNow[f.key]) {
      missing.push({ id: domId.decideField(f.key), label: `Decision now — ${f.label.toLowerCase()}` });
    }
  }

  return {
    hydrated,
    name,

    ranking,
    rankWhy,
    rankCheck,

    mapStates,
    placedCount,
    openMeasureId,

    raciValue,
    raciViolations,
    raciStructuralIssues,
    raciAuthorityWarnings,
    raciTouched,
    accountableFor,

    decideNow,

    missing,
    allComplete: missing.length === 0,
  };
}

export type Route2State = ReturnType<typeof useRoute2>;
