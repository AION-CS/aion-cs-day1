"use client";

import { useProgress, useHydrated } from "@/lib/store";
import type { MissingItem } from "@/components/ui/MissingList";
import {
  CATEGORIES,
  HOTSPOTS,
  R1,
  type CategoryId,
  type FixType,
  type Hotspot,
} from "@/lib/route1";

/** DOM ids the missing-item list scrolls to and flashes. */
export const domId = {
  name: "r1-name",
  trace: "r1-trace",
  /**
   * The still-unsorted card in the trace panel. A hotspot's workup card only
   * exists once it has been sorted, so a "sort this one" missing item has to
   * point here — pointing at the workup id would be a dead click.
   */
  unsorted: (id: string) => `r1-unsorted-${id}`,
  hotspot: (id: string) => `r1-hotspot-${id}`,
  lever: (id: string) => `r1-hotspot-${id}-lever`,
  justification: (id: string) => `r1-hotspot-${id}-why`,
  fixType: (id: string) => `r1-hotspot-${id}-fix`,
  reflection: "r1-reflection",
  export: "r1-export",
};

export type Placements = Record<string, CategoryId | null>;

export type Finding = {
  hotspot: Hotspot;
  category: CategoryId | null;
  leverId: string | null;
  leverText: string | null;
  justification: string;
  fixType: FixType | null;
  /** All four answers present — a finished row in the Diagnosis Report. */
  complete: boolean;
};

/**
 * Joins the shared progress store to Route 1's content. Components read this
 * and stay presentational; nothing else derives "what's missing".
 */
export function useRoute1() {
  const hydrated = useHydrated();
  const notes = useProgress((s) => s.notes);
  const choices = useProgress((s) => s.choices);
  const seen = useProgress((s) => s.seen);

  const name = notes[R1.name] ?? "";
  const reflection = notes[R1.reflection] ?? "";
  const inspected = seen[R1.inspected] ?? [];
  const placementOrder = seen[R1.order] ?? [];

  const placements: Placements = {};
  for (const h of HOTSPOTS) {
    const raw = choices[R1.category(h.id)];
    placements[h.id] = raw ? (raw as CategoryId) : null;
  }

  const findingFor = (h: Hotspot): Finding => {
    const category = placements[h.id];
    const leverId = choices[R1.lever(h.id)] || null;
    const justification = (notes[R1.justification(h.id)] ?? "").trim();
    const rawFix = choices[R1.fixType(h.id)];
    const fixType = rawFix === "quick" || rawFix === "structural" ? (rawFix as FixType) : null;
    return {
      hotspot: h,
      category,
      leverId,
      leverText: leverId ? (h.levers.find((l) => l.id === leverId)?.text ?? null) : null,
      justification,
      fixType,
      complete: !!category && !!leverId && justification.length > 0 && !!fixType,
    };
  };

  const findings = HOTSPOTS.map(findingFor);
  const byId = (id: string) => findings.find((f) => f.hotspot.id === id)!;

  /**
   * Report rows, in the order the learner sorted them — not in hotspot order.
   * Anything sorted but not yet in the order bucket (e.g. state restored from
   * an older session) falls back to hotspot order at the end.
   */
  const reportRows = [
    ...placementOrder.filter((id) => placements[id]).map(byId),
    ...findings.filter((f) => f.category && !placementOrder.includes(f.hotspot.id)),
  ];

  const placedCount = findings.filter((f) => f.category).length;
  const completeCount = findings.filter((f) => f.complete).length;
  const completeHotspotIds = findings.filter((f) => f.complete).map((f) => f.hotspot.id);
  const structuralCount = findings.filter((f) => f.complete && f.fixType === "structural").length;
  const quickCount = findings.filter((f) => f.complete && f.fixType === "quick").length;

  /**
   * Standard #1: one entry per concretely-missing thing, named. Never a step
   * number, never "complete all fields". Ordered so the list reads top-to-
   * bottom in the same order the page does.
   */
  const missing: MissingItem[] = [];
  if (!name.trim()) {
    missing.push({ id: domId.name, label: "Your name — needed to label the export" });
  }
  for (const f of findings) {
    const h = f.hotspot;
    const who = `Hotspot ${h.n} — ${h.title}`;
    if (!f.category) {
      missing.push({ id: domId.unsorted(h.id), label: `Sort ${who} into a category` });
      continue; // the rest of the workup only exists once it's been sorted
    }
    if (!f.leverId) missing.push({ id: domId.lever(h.id), label: `Choose an improvement lever for ${who}` });
    if (!f.justification) missing.push({ id: domId.justification(h.id), label: `Justification for ${who}` });
    if (!f.fixType) missing.push({ id: domId.fixType(h.id), label: `Mark ${who} as Quick Fix or Structural Fix` });
  }
  if (!reflection.trim()) {
    missing.push({ id: domId.reflection, label: "Root-cause reflection — your closing position" });
  }

  return {
    hydrated,
    name,
    reflection,
    inspected,
    placements,
    findings,
    reportRows,
    placedCount,
    completeCount,
    completeHotspotIds,
    structuralCount,
    quickCount,
    totalHotspots: HOTSPOTS.length,
    totalCategories: CATEGORIES.length,
    missing,
    allComplete: missing.length === 0,
  };
}

export type Route1State = ReturnType<typeof useRoute1>;
