/**
 * Route 1's material sections: one continuous block of five, S1–S5, all of it
 * taught before the task begins.
 *
 * The ids, labels and anchor ids live above the content so the mini-nav, the
 * MaterialRefs chips on both task parts, and the material itself can never
 * disagree about what a section is called.
 */

export type MaterialSectionId =
  | "monitoring"
  | "load"
  | "architecture"
  | "tradeoff"
  | "coupling";

export const SECTION_ORDER: MaterialSectionId[] = [
  "monitoring",
  "load",
  "architecture",
  "tradeoff",
  "coupling",
];

/** DOM anchor a MaterialRefs chip or the mini-nav scrolls to. */
export function materialAnchorId(id: MaterialSectionId): string {
  return `r1-material-${id}`;
}

export const MATERIAL_LABELS: Record<MaterialSectionId, string> = {
  monitoring: "S1 · The efficiency lens",
  load: "S2 · The four load bands",
  architecture: "S3 · Architecture levers",
  tradeoff: "S4 · The five-way trade-off",
  coupling: "S5 · Coupling the two",
};

/** Short label for the sticky mini-nav dots. */
export const MATERIAL_NAV: Record<MaterialSectionId, { code: string; label: string }> = {
  monitoring: { code: "S1", label: "Monitoring with an efficiency lens" },
  load: { code: "S2", label: "Not all load is a problem" },
  architecture: { code: "S3", label: "Sustainable architecture and its four levers" },
  tradeoff: { code: "S4", label: "The five-way trade-off" },
  coupling: { code: "S5", label: "Deciding monitoring and architecture together" },
};

/** Chips for a task step: which material sections it draws on. */
export function materialRefs(ids: MaterialSectionId[]) {
  return ids.map((id) => ({ anchorId: materialAnchorId(id), label: MATERIAL_LABELS[id] }));
}
