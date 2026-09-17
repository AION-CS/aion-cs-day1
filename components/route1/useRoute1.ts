"use client";

import { useProgress, useHydrated } from "@/lib/store";
import type { MissingItem } from "@/components/ui/MissingList";
import {
  AREAS,
  EVIDENCE,
  GENERIC_FALLBACK_CLUE,
  R1,
  type AreaId,
  type ClueTier,
  type Evidence,
  type RootCause,
  type Timeframe,
} from "@/lib/route1";

/** DOM ids the missing-item list scrolls to and flashes. */
export const domId = {
  name: "r1-name",

  task: "task",
  board: "r1-board",
  chip: (id: string) => `r1-chip-${id}`,
  chipApproach: (id: string) => `r1-chip-${id}-approach`,
  chipRoot: (id: string) => `r1-chip-${id}-root`,
  chipTime: (id: string) => `r1-chip-${id}-time`,

  export: "r1-export",
};

export type ChipState = {
  evidence: Evidence;
  area: AreaId | null;
  approach: string;
  rootCause: RootCause | null;
  timeframe: Timeframe | null;
  checkCount: number;
  complete: boolean;
};

/** A check never names the correct area — only whether the current placement holds, and if not, a tiered clue. */
export type CheckResult = { holds: true } | { holds: false; clue: string; tier: "soft" | "sharp" };

export function checkChipPlacement(evidence: Evidence, area: AreaId, checkCountAfter: number): CheckResult {
  if (area === evidence.correctArea) return { holds: true };
  const tier: "soft" | "sharp" = checkCountAfter >= 2 ? "sharp" : "soft";
  const specific: ClueTier | undefined = evidence.wrongClues[area];
  const clue = (specific ?? GENERIC_FALLBACK_CLUE)[tier];
  return { holds: false, clue, tier };
}

/**
 * Joins the shared progress store to Route 1 Task 1's evidence board, one
 * hook. One route has one `missing` list and one definition of done
 * (CLAUDE.md §12). The area check is per-chip and never names the correct
 * area — only whether the current placement holds (CLAUDE.md §4).
 */
export function useRoute1() {
  const hydrated = useHydrated();
  const notes = useProgress((s) => s.notes);
  const choices = useProgress((s) => s.choices);

  const name = notes[R1.name] ?? "";

  const chips: ChipState[] = EVIDENCE.map((evidence) => {
    const rawArea = choices[R1.area(evidence.id)];
    const area = rawArea && AREAS.some((a) => a.id === rawArea) ? (rawArea as AreaId) : null;
    const approach = (notes[R1.approach(evidence.id)] ?? "").trim();
    const rawRoot = choices[R1.rootCause(evidence.id)];
    const rootCause: RootCause | null =
      rawRoot === "dataGap" || rawRoot === "behaviouralPattern" || rawRoot === "managementDeficit"
        ? (rawRoot as RootCause)
        : null;
    const rawTime = choices[R1.timeframe(evidence.id)];
    const timeframe: Timeframe | null =
      rawTime === "shortTerm" || rawTime === "structural" ? (rawTime as Timeframe) : null;
    const checkCount = Number(notes[R1.checkCount(evidence.id)] ?? "0") || 0;

    return {
      evidence,
      area,
      approach,
      rootCause,
      timeframe,
      checkCount,
      complete: !!area && approach.length > 0 && !!rootCause && !!timeframe,
    };
  });

  const chipById = (id: string) => chips.find((c) => c.evidence.id === id)!;
  const byArea = (id: AreaId) => chips.filter((c) => c.area === id);
  const placedCount = chips.filter((c) => c.area).length;
  const completeCount = chips.filter((c) => c.complete).length;

  // -- Missing list ---------------------------------------------------------
  // Standard #1: one entry per concretely-missing thing, named, in page order.
  const missing: MissingItem[] = [];
  if (!name.trim()) missing.push({ id: domId.name, label: "Your name — needed to label the export" });

  for (const c of chips) {
    const who = `"${c.evidence.short}"`;
    if (!c.area) {
      missing.push({ id: domId.chip(c.evidence.id), label: `${who} — not yet classified into an area` });
      continue;
    }
    if (!c.approach) missing.push({ id: domId.chipApproach(c.evidence.id), label: `${who} — needs an improvement approach` });
    if (!c.rootCause) missing.push({ id: domId.chipRoot(c.evidence.id), label: `${who} — needs a root-cause tag` });
    if (!c.timeframe) missing.push({ id: domId.chipTime(c.evidence.id), label: `${who} — needs a short-term/structural tag` });
  }

  return {
    hydrated,
    name,

    chips,
    chipById,
    byArea,
    placedCount,
    completeCount,
    totalChips: EVIDENCE.length,

    missing,
    allComplete: missing.length === 0,
  };
}

export type Route1State = ReturnType<typeof useRoute1>;
