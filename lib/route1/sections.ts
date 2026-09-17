/**
 * Route 1's material sections: one continuous block of four, S1–S4, all of it
 * taught before Task 1 begins (~60 minutes — see lib/route1/material.ts for
 * why this day restores Day 11's fuller material budget instead of Day 13's
 * inverted, lighter one: Task 1 here draws on six distinct diagnostic areas
 * plus two extra tagging dimensions, which needs the full teaching block).
 *
 * The ids, labels and anchor ids live above the content so the mini-nav, the
 * MaterialRefs chips on the task, and the material itself can never disagree
 * about what a section is called.
 */

export type MaterialSectionId = "businessCase" | "threeLens" | "behaviourChange" | "regulation";

export const SECTION_ORDER: MaterialSectionId[] = [
  "businessCase",
  "threeLens",
  "behaviourChange",
  "regulation",
];

/** DOM anchor a MaterialRefs chip or the mini-nav scrolls to. */
export function materialAnchorId(id: MaterialSectionId): string {
  return `r1-material-${id}`;
}

export const MATERIAL_LABELS: Record<MaterialSectionId, string> = {
  businessCase: "S1 · The Green IT business case",
  threeLens: "S2 · ROI is not only a financial number",
  behaviourChange: "S3 · Why technical solutions fail without behavioural change",
  regulation: "S4 · Regulation as a management framework",
};

/** Short label for the sticky mini-nav dots. */
export const MATERIAL_NAV: Record<MaterialSectionId, { code: string; label: string }> = {
  businessCase: { code: "S1", label: "The Green IT business case" },
  threeLens: { code: "S2", label: "ROI is not only a financial number" },
  behaviourChange: { code: "S3", label: "Technical solutions fail without behavioural change" },
  regulation: { code: "S4", label: "Regulation as a management framework" },
};

/** Chips for a task step: which material sections it draws on. */
export function materialRefs(ids: MaterialSectionId[]) {
  return ids.map((id) => ({ anchorId: materialAnchorId(id), label: MATERIAL_LABELS[id] }));
}
