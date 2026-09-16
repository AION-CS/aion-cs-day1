/**
 * Route 2's material sections: four, A–D, all taught before the task, plus a
 * fifth read-only anchor for the EcoFlow worked example — rendered after D,
 * before the task, but not counted among the "four sections" the mini-nav
 * shows (it is a worked example to read, not graded material).
 *
 * Same shape as Route 1 (CLAUDE.md #12 / CURRICULUM-GUIDE.md §2): ids, labels
 * and anchors live above the content so the mini-nav, the MaterialRefs chips
 * on every exercise, and the material itself can never disagree.
 */

export type MaterialSectionId = "board" | "prioritise" | "governance" | "uncertainty" | "worked";

export const SECTION_ORDER: MaterialSectionId[] = ["board", "prioritise", "governance", "uncertainty"];

export function materialAnchorId(id: MaterialSectionId): string {
  return `r2-material-${id}`;
}

export const MATERIAL_LABELS: Record<MaterialSectionId, string> = {
  board: "A · Why this reaches a board",
  prioritise: "B · Prioritising under trade-offs",
  governance: "C · Decision architecture: RACI",
  uncertainty: "D · Deciding under uncertainty",
  worked: "EcoFlow worked example",
};

export const MATERIAL_NAV: Record<MaterialSectionId, { code: string; label: string }> = {
  board: { code: "A", label: "Why this reaches a board at all" },
  prioritise: { code: "B", label: "Prioritising digitalisation measures under trade-offs" },
  governance: { code: "C", label: "Decision architecture: RACI and governance" },
  uncertainty: { code: "D", label: "Holding a decision together under incomplete information" },
  worked: { code: "—", label: "Worked example: EcoFlow Administration GmbH" },
};

export function materialRefs(ids: MaterialSectionId[]) {
  return ids.map((id) => ({ anchorId: materialAnchorId(id), label: MATERIAL_LABELS[id] }));
}
