"use client";

import { useProgress, useHydrated } from "@/lib/store";
import type { MissingItem } from "@/components/ui/MissingList";
import { createPlacementHistory } from "@/lib/usePlacementHistory";
import {
  GUIDING_DECISIONS,
  QUADRANT_CARDS,
  RACI_LETTERS,
  RACI_ROLES,
  RANK_SLOTS,
  R2,
  quadrantCardById,
  type QuadrantId,
  type RaciLetter,
} from "@/lib/route2";

/**
 * Route 2's own undo/redo history for the quadrant map — a separate instance of
 * the shared factory, so an undo here can never restore a snapshot from Route
 * 1's category bins after a client-side navigation.
 */
export const useQuadrantHistory = createPlacementHistory();

/** DOM ids the missing-item list scrolls to and flashes. */
export const domId = {
  name: "r2-name",
  rank: "r2-rank",
  rankRationale: "r2-rank-why",
  quadrant: "r2-quadrant",
  quadrantCell: (cellId: string) => `r2-quadrant-${cellId}`,
  raci: "r2-raci",
  raciLetter: (letter: RaciLetter) => `r2-raci-${letter}`,
  decideNow: "r2-decide-now",
  decideWhy: "r2-decide-why",
  export: "r2-export",
};

export type QuadrantPlacements = Record<string, QuadrantId | null>;

export function useRoute2() {
  const hydrated = useHydrated();
  const notes = useProgress((s) => s.notes);
  const choices = useProgress((s) => s.choices);
  const checks = useProgress((s) => s.checks);
  const seen = useProgress((s) => s.seen);

  const name = notes[R2.name] ?? "";

  // --- Step 1: ranking -----------------------------------------------------
  const ranking = (seen[R2.ranking] ?? []).slice(0, RANK_SLOTS);
  const rankedDecisions = ranking
    .map((id) => GUIDING_DECISIONS.find((d) => d.id === id))
    .filter((d): d is (typeof GUIDING_DECISIONS)[number] => !!d);
  const rankRationale = (notes[R2.rankRationale] ?? "").trim();

  // --- Step 2: quadrant map ------------------------------------------------
  const placements: QuadrantPlacements = {};
  for (const c of QUADRANT_CARDS) {
    const raw = choices[R2.quadrant(c.id)];
    placements[c.id] = raw ? (raw as QuadrantId) : null;
  }
  const placedCards = QUADRANT_CARDS.filter((c) => placements[c.id]);
  const unplacedCards = QUADRANT_CARDS.filter((c) => !placements[c.id]);

  // --- Step 3: RACI --------------------------------------------------------
  const raci: Record<RaciLetter, string[]> = { R: [], A: [], C: [], I: [] };
  for (const letter of RACI_LETTERS) {
    for (const role of RACI_ROLES) {
      if (checks[R2.raci(role.id, letter.id)]) raci[letter.id].push(role.id);
    }
  }
  const accountableCount = raci.A.length;
  /** The one structural rule the check enforces — never which role should hold which letter. */
  const accountableValid = accountableCount === 1;
  const raciTouched = RACI_LETTERS.some((l) => raci[l.id].length > 0);
  const emptyLetters = RACI_LETTERS.filter((l) => raci[l.id].length === 0);

  // --- Step 4: decide now --------------------------------------------------
  const decideNow = (notes[R2.decideNow] ?? "").trim();
  const decideWhy = (notes[R2.decideWhy] ?? "").trim();

  /** Standard #1: one named entry per concretely-missing thing. */
  const missing: MissingItem[] = [];
  if (!name.trim()) {
    missing.push({ id: domId.name, label: "Your name — needed to label the export" });
  }
  if (rankedDecisions.length < RANK_SLOTS) {
    const n = RANK_SLOTS - rankedDecisions.length;
    missing.push({
      id: domId.rank,
      label: `Rank your top ${RANK_SLOTS} guiding decisions — ${n} slot${n === 1 ? "" : "s"} still empty`,
    });
  }
  if (!rankRationale) {
    missing.push({ id: domId.rankRationale, label: "Rationale for your #1-ranked decision" });
  }
  for (const c of unplacedCards) {
    missing.push({
      id: domId.quadrant,
      label: `Place "${c.short}" on the trade-off map`,
    });
  }
  for (const l of emptyLetters) {
    missing.push({
      id: domId.raciLetter(l.id),
      label: `RACI assignment for ${l.name} — no role assigned`,
    });
  }
  if (raciTouched && !accountableValid && !emptyLetters.some((l) => l.id === "A")) {
    missing.push({
      id: domId.raciLetter("A"),
      label: `Accountable must sit with exactly one role — ${accountableCount} are marked`,
    });
  }
  if (!decideNow) {
    missing.push({ id: domId.decideNow, label: "The decision you must make now, despite incomplete data" });
  }
  if (!decideWhy) {
    missing.push({ id: domId.decideWhy, label: "Why waiting for better data would cost more" });
  }

  return {
    hydrated,
    name,
    ranking,
    rankedDecisions,
    rankRationale,
    placements,
    placedCards,
    unplacedCards,
    totalCards: QUADRANT_CARDS.length,
    raci,
    accountableCount,
    accountableValid,
    raciTouched,
    decideNow,
    decideWhy,
    quadrantCardById,
    missing,
    allComplete: missing.length === 0,
  };
}

export type Route2State = ReturnType<typeof useRoute2>;
