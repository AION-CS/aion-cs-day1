/**
 * Route 2's material sections: six, A–F, all taught before the task
 * (CLAUDE.md #12). Two more blocks follow the six — the rubric preview and the
 * reflection journal — but neither is a task's reasoning basis (nobody's memo
 * cites "the rubric"), so they render after this list rather than inside it,
 * the same way Route 1 renders its glossary and its hand-off framing outside
 * SECTION_ORDER.
 */

export type MaterialSectionId = "management" | "map" | "dimensions" | "levers" | "measure" | "roadmap";

export const SECTION_ORDER: MaterialSectionId[] = ["management", "map", "dimensions", "levers", "measure", "roadmap"];

export function materialAnchorId(id: MaterialSectionId): string {
  return `r2-material-${id}`;
}

export const MATERIAL_LABELS: Record<MaterialSectionId, string> = {
  management: "A · A management question, not a technology one",
  map: "B · The NetSphere infrastructure map",
  dimensions: "C · The six-dimension analysis",
  levers: "D · The four biggest levers",
  measure: "E · The prioritised first measure",
  roadmap: "F · Short / medium / structural roadmap",
};

export const MATERIAL_NAV: Record<MaterialSectionId, { code: string; label: string }> = {
  management: { code: "A", label: "Why this is a management question" },
  map: { code: "B", label: "The NetSphere infrastructure map" },
  dimensions: { code: "C", label: "The six-dimension analysis" },
  levers: { code: "D", label: "The four biggest levers" },
  measure: { code: "E", label: "The prioritised first measure, and why" },
  roadmap: { code: "F", label: "Short / medium / structural roadmap" },
};

/** Extra mini-nav stops after the six taught sections — not part of MaterialRefs. */
export const TRAILING_NAV = [
  { id: "rubric", code: "G", label: "How senior work gets judged", anchorId: "r2-rubric" },
  { id: "reflection", code: "H", label: "Reflection journal", anchorId: "r2-reflection" },
];

export function materialRefs(ids: MaterialSectionId[]) {
  return ids.map((id) => ({ anchorId: materialAnchorId(id), label: MATERIAL_LABELS[id] }));
}
