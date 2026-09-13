/**
 * Route 2's material sections: four, A–D, all taught before the task.
 *
 * Same shape as Route 1 (CLAUDE.md #12 / CURRICULUM-GUIDE.md §2): ids, labels
 * and anchors live above the content so the mini-nav, the MaterialRefs chips
 * on every task step, and the material itself can never disagree.
 */

export type MaterialSectionId = "board" | "raci" | "uncertainty" | "worked";

export const SECTION_ORDER: MaterialSectionId[] = ["board", "raci", "uncertainty", "worked"];

export function materialAnchorId(id: MaterialSectionId): string {
  return `r2-material-${id}`;
}

export const MATERIAL_LABELS: Record<MaterialSectionId, string> = {
  board: "A · Why this reaches a board",
  raci: "B · RACI in full",
  uncertainty: "C · Deciding under uncertainty",
  worked: "D · The MetricFlow example",
};

export const MATERIAL_NAV: Record<MaterialSectionId, { code: string; label: string }> = {
  board: { code: "A", label: "Why this reaches a board at all" },
  raci: { code: "B", label: "Decision architecture: RACI in full" },
  uncertainty: { code: "C", label: "Holding a decision together under incomplete information" },
  worked: { code: "D", label: "Worked example: MetricFlow Digital Systems GmbH" },
};

export function materialRefs(ids: MaterialSectionId[]) {
  return ids.map((id) => ({ anchorId: materialAnchorId(id), label: MATERIAL_LABELS[id] }));
}
