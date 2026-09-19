/**
 * Route 2's material: four micro-cards, D1–D4, all read before Task 3
 * (CLAUDE.md §12: material first, no material between task parts — Task 3
 * has no parts to split anyway, it is one continuous builder).
 */

export type MaterialSectionId = "architecture" | "assessmentLogic" | "governance" | "horizons";

export const SECTION_ORDER: MaterialSectionId[] = ["architecture", "assessmentLogic", "governance", "horizons"];

/** DOM anchor a MaterialRefs chip or the mini-nav scrolls to. */
export function materialAnchorId(id: MaterialSectionId): string {
  return `r2-card-${id}`;
}

export const MATERIAL_LABELS: Record<MaterialSectionId, string> = {
  architecture: "D1 · From projects to a decision architecture",
  assessmentLogic: "D2 · Assessment logic",
  governance: "D3 · Governance & investment logic",
  horizons: "D4 · Time horizons",
};

export const MATERIAL_NAV: Record<MaterialSectionId, { code: string; label: string }> = {
  architecture: { code: "D1", label: "From projects to a decision architecture" },
  assessmentLogic: { code: "D2", label: "Assessment logic" },
  governance: { code: "D3", label: "Governance & investment logic" },
  horizons: { code: "D4", label: "Time horizons" },
};

/** Chips for a task step: which material cards it draws on. */
export function materialRefs(ids: MaterialSectionId[]) {
  return ids.map((id) => ({ anchorId: materialAnchorId(id), label: MATERIAL_LABELS[id] }));
}
