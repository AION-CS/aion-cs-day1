"use client";

import { useProgress, useHydrated } from "@/lib/store";
import type { MissingItem } from "@/components/ui/MissingList";
import {
  CRITERIA,
  MEASURE_LINES,
  OWNERSHIP_NODES,
  R2,
  RANK_SCORE,
  type CriterionId,
  type MeasureLineId,
  type OwnershipNodeId,
  type OwnershipRole,
  type ReversibilityAnswer,
} from "@/lib/route2";

/** DOM ids the missing-item list scrolls to and flashes. */
export const domId = {
  name: "r2-name",
  task: "task",

  part1: "r2-p1",
  criterion: (id: CriterionId) => `r2-p1-criterion-${id}`,
  priority: "r2-p1-priority",
  priorityJustify: "r2-p1-justify",

  part2: "r2-p2",
  relevance: "r2-p2-relevance",
  firstMove: "r2-p2-firstmove",
  ownership: "r2-p2-ownership",
  decide: "r2-p2-decide",

  export: "r2-export",
};

export type RankSlot = "1" | "2" | "3";
const isSlot = (v: string | undefined): v is RankSlot => v === "1" || v === "2" || v === "3";

export type CriterionState = {
  criterion: (typeof CRITERIA)[number];
  slotOf: Record<MeasureLineId, RankSlot | null>;
  lineInSlot: Record<RankSlot, MeasureLineId | null>;
  complete: boolean;
  topPick: MeasureLineId | null;
  checks: number;
};

/**
 * Joins the shared progress store to Route 2's content: one task, two parts,
 * one `missing` list, one definition of done (CLAUDE.md §12). Part 1's
 * per-criterion check never names a "correct" ranking — there isn't one —
 * only a clue about what the current top pick may be under-weighting.
 */
export function useRoute2() {
  const hydrated = useHydrated();
  const notes = useProgress((s) => s.notes);
  const choices = useProgress((s) => s.choices);

  const name = notes[R2.name] ?? "";

  // -- Part 1 -----------------------------------------------------------------
  const criteria: CriterionState[] = CRITERIA.map((criterion) => {
    const slotOf = Object.fromEntries(
      MEASURE_LINES.map((m) => [m.id, isSlot(choices[R2.rank(criterion.id, m.id)]) ? (choices[R2.rank(criterion.id, m.id)] as RankSlot) : null]),
    ) as Record<MeasureLineId, RankSlot | null>;

    const lineInSlot = { "1": null, "2": null, "3": null } as Record<RankSlot, MeasureLineId | null>;
    for (const m of MEASURE_LINES) {
      const slot = slotOf[m.id];
      if (slot && !lineInSlot[slot]) lineInSlot[slot] = m.id;
    }

    const complete = MEASURE_LINES.every((m) => slotOf[m.id] !== null);
    const topPick = lineInSlot["1"];
    const checks = Number(notes[R2.rankChecks(criterion.id)] ?? "0") || 0;

    return { criterion, slotOf, lineInSlot, complete, topPick, checks };
  });

  const criterionById2 = (id: CriterionId) => criteria.find((c) => c.criterion.id === id)!;
  const allCriteriaComplete = criteria.every((c) => c.complete);
  const rankedCriteriaCount = criteria.filter((c) => c.complete).length;

  const lineTotal = (lineId: MeasureLineId): number =>
    criteria.reduce((sum, c) => {
      const slot = c.slotOf[lineId];
      return sum + (slot ? RANK_SCORE[slot] : 0);
    }, 0);

  const rawPriority = choices[R2.priority];
  const priority: MeasureLineId | null =
    rawPriority === "a" || rawPriority === "b" || rawPriority === "c" ? rawPriority : null;
  const priorityJustify = (notes[R2.priorityJustify] ?? "").trim();

  const partOneComplete = allCriteriaComplete && !!priority && !!priorityJustify;

  // -- Part 2 -------------------------------------------------------------------
  const relevance = (notes[R2.relevance] ?? "").trim();
  const firstMove = (notes[R2.firstMove] ?? "").trim();

  const ownershipRole = (id: OwnershipNodeId): OwnershipRole | null => {
    const v = choices[R2.ownership(id)];
    return v === "owns" || v === "consulted" ? v : null;
  };
  const ownsCount = OWNERSHIP_NODES.filter((n) => ownershipRole(n.id) === "owns").length;
  const touchedCount = OWNERSHIP_NODES.filter((n) => ownershipRole(n.id) !== null).length;

  const decideName = (notes[R2.decideName] ?? "").trim();
  const rawReversible = choices[R2.decideReversible];
  const decideReversible: ReversibilityAnswer | null = rawReversible === "yes" || rawReversible === "no" ? rawReversible : null;
  const rawMoreData = choices[R2.decideMoreData];
  const decideMoreData: ReversibilityAnswer | null = rawMoreData === "yes" || rawMoreData === "no" ? rawMoreData : null;

  const partTwoComplete = !!relevance && !!firstMove && ownsCount >= 1 && !!decideName && !!decideReversible && !!decideMoreData;

  // -- Missing list ---------------------------------------------------------
  const missing: MissingItem[] = [];
  if (!name.trim()) missing.push({ id: domId.name, label: "Your name — needed to label the export" });

  for (const c of criteria) {
    if (!c.complete) {
      const rankedCount = MEASURE_LINES.filter((m) => c.slotOf[m.id] !== null).length;
      missing.push({ id: domId.criterion(c.criterion.id), label: `Part 1: ${c.criterion.label} — ${rankedCount} of 3 measure-lines ranked` });
    }
  }
  if (allCriteriaComplete && !priority) missing.push({ id: domId.priority, label: "Part 1: choose your priority — A, B or C" });
  if (priority && !priorityJustify) missing.push({ id: domId.priorityJustify, label: "Part 1: justification for your chosen priority" });

  if (!relevance) missing.push({ id: domId.relevance, label: "Part 2: why this is relevant now" });
  if (!firstMove) missing.push({ id: domId.firstMove, label: "Part 2: first move" });
  if (ownsCount < 1) missing.push({ id: domId.ownership, label: "Part 2: Ownership — at least one function must be marked Owns" });
  if (!decideName) missing.push({ id: domId.decide, label: "Part 2: name the one decision to make now" });
  if (decideName && (!decideReversible || !decideMoreData)) {
    missing.push({ id: domId.decide, label: "Part 2: answer both reversibility-test questions for your decision" });
  }

  return {
    hydrated,
    name,

    criteria,
    criterionById: criterionById2,
    allCriteriaComplete,
    rankedCriteriaCount,
    lineTotal,
    priority,
    priorityJustify,
    partOneComplete,

    relevance,
    firstMove,
    ownershipRole,
    ownsCount,
    touchedCount,
    decideName,
    decideReversible,
    decideMoreData,
    partTwoComplete,

    missing,
    allComplete: missing.length === 0,
  };
}

export type Route2State = ReturnType<typeof useRoute2>;
