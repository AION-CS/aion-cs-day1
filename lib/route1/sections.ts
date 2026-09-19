/**
 * Route 1's material, in two short blocks read immediately before the task
 * that uses them — not one continuous block (CLAUDE.md §12 is written for a
 * merged single-export route; this route deliberately reverts to the
 * pre-§12, two-pair shape because the build brief calls for two separate
 * exports, one per task). Material 1 (M1–M4) teaches only what Task 1's
 * diagnosis needs; Material 2 (M5–M7) teaches only what Task 2's
 * prioritisation needs. Continuous numbering across both blocks mirrors the
 * C1–C9 convention from prior days — the codes still read as one sequence,
 * they are just split across two pages of the same scroll.
 */

export type MaterialSectionId =
  | "dataVsManagement"
  | "metricLayers"
  | "sixAreas"
  | "effectiveVsStructural"
  | "pdcaLoop"
  | "tradeoffTriangle"
  | "threeLines";

export const MATERIAL1_ORDER: MaterialSectionId[] = [
  "dataVsManagement",
  "metricLayers",
  "sixAreas",
  "effectiveVsStructural",
];

export const MATERIAL2_ORDER: MaterialSectionId[] = ["pdcaLoop", "tradeoffTriangle", "threeLines"];

/** DOM anchor a MaterialRefs chip or the mini-nav scrolls to. */
export function materialAnchorId(id: MaterialSectionId): string {
  return `r1-card-${id}`;
}

export const MATERIAL_LABELS: Record<MaterialSectionId, string> = {
  dataVsManagement: "M1 · Data collected ≠ managed",
  metricLayers: "M2 · The three metric layers",
  sixAreas: "M3 · The six areas",
  effectiveVsStructural: "M4 · Effective vs merely informative",
  pdcaLoop: "M5 · Continuous optimisation (PDCA)",
  tradeoffTriangle: "M6 · Measurability, value, control",
  threeLines: "M7 · The three candidate lines",
};

/** Short label for the sticky mini-nav dots. */
export const MATERIAL_NAV: Record<MaterialSectionId, { code: string; label: string }> = {
  dataVsManagement: { code: "M1", label: "Data collected ≠ managed" },
  metricLayers: { code: "M2", label: "The three metric layers" },
  sixAreas: { code: "M3", label: "The six areas" },
  effectiveVsStructural: { code: "M4", label: "Effective vs informative" },
  pdcaLoop: { code: "M5", label: "Continuous optimisation" },
  tradeoffTriangle: { code: "M6", label: "Measurability, value, control" },
  threeLines: { code: "M7", label: "The three candidate lines" },
};

/** Chips for a task step: which material cards it draws on. */
export function materialRefs(ids: MaterialSectionId[]) {
  return ids.map((id) => ({ anchorId: materialAnchorId(id), label: MATERIAL_LABELS[id] }));
}
