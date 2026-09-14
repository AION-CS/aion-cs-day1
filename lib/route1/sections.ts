/**
 * Route 1's material sections: one continuous block of seven, S1–S7, all of it
 * taught before the task begins (CLAUDE.md #12).
 *
 * S1–S4 carry the level-1 teaching — networks as a sustainability factor, the
 * levers and the measurement standard, IoT across the lifecycle, 5G and the
 * rebound mechanism. S5–S7 carry the level-2 teaching — potential versus
 * system impact, the 7-criteria lens, deciding under incomplete information.
 * The learner never sees that boundary; the registry and the export do.
 *
 * The ids, labels and anchor ids live above the content so the mini-nav, the
 * MaterialRefs chips on both task parts and the material itself can never
 * disagree about what a section is called.
 */

export type MaterialSectionId =
  | "infrastructure"
  | "levers"
  | "iot"
  | "fiveg"
  | "system"
  | "lens"
  | "uncertainty";

export const SECTION_ORDER: MaterialSectionId[] = [
  "infrastructure",
  "levers",
  "iot",
  "fiveg",
  "system",
  "lens",
  "uncertainty",
];

/** DOM anchor a MaterialRefs chip or the mini-nav scrolls to. */
export function materialAnchorId(id: MaterialSectionId): string {
  return `r1-material-${id}`;
}

export const MATERIAL_LABELS: Record<MaterialSectionId, string> = {
  infrastructure: "S1 · Networks as a sustainability factor",
  levers: "S2 · Levers and measurement",
  iot: "S3 · IoT across the lifecycle",
  fiveg: "S4 · 5G and the rebound effect",
  system: "S5 · Potential vs system impact",
  lens: "S6 · The 7-criteria lens",
  uncertainty: "S7 · Deciding without complete data",
};

/** Short label for the sticky mini-nav dots. */
export const MATERIAL_NAV: Record<MaterialSectionId, { code: string; label: string }> = {
  infrastructure: { code: "S1", label: "Why network infrastructure is a sustainability factor" },
  levers: { code: "S2", label: "Levers of energy-efficient network technology" },
  iot: { code: "S3", label: "IoT sustainability across the lifecycle" },
  fiveg: { code: "S4", label: "5G: efficiency promise and system-level risk" },
  system: { code: "S5", label: "Technological potential vs real system impact" },
  lens: { code: "S6", label: "The 7-criteria decision lens" },
  uncertainty: { code: "S7", label: "Deciding under incomplete information" },
};

/** Chips for a task step: which material sections it draws on. */
export function materialRefs(ids: MaterialSectionId[]) {
  return ids.map((id) => ({ anchorId: materialAnchorId(id), label: MATERIAL_LABELS[id] }));
}
