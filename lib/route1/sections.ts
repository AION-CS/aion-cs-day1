/**
 * Route 1's material sections: one continuous block of four, S1–S4, all of it
 * taught before the task begins. Day 13 deliberately inverts Day 11's
 * material-to-task ratio (~30 min material vs. ~20 min task, not ~60 vs. ~30)
 * — the curriculum's Task 1 for Module 9 is a single-part triage-and-deep-dive
 * exercise, not a two-part diagnose-then-decide engagement, so it needs less
 * teaching in front of it, not less depth within each section.
 *
 * The ids, labels and anchor ids live above the content so the mini-nav, the
 * MaterialRefs chips on the task's three steps, and the material itself can
 * never disagree about what a section is called.
 */

export type MaterialSectionId = "lever" | "impact" | "rebound" | "framework";

export const SECTION_ORDER: MaterialSectionId[] = ["lever", "impact", "rebound", "framework"];

/** DOM anchor a MaterialRefs chip or the mini-nav scrolls to. */
export function materialAnchorId(id: MaterialSectionId): string {
  return `r1-material-${id}`;
}

export const MATERIAL_LABELS: Record<MaterialSectionId, string> = {
  lever: "S1 · Digitalisation as a sustainability lever",
  impact: "S2 · Direct vs. indirect environmental impact",
  rebound: "S3 · The rebound effect and trade-offs",
  framework: "S4 · The six-area diagnostic framework",
};

/** Short label for the sticky mini-nav dots. */
export const MATERIAL_NAV: Record<MaterialSectionId, { code: string; label: string }> = {
  lever: { code: "S1", label: "Digitalisation as a sustainability lever" },
  impact: { code: "S2", label: "Direct vs. indirect environmental impact" },
  rebound: { code: "S3", label: "The rebound effect and trade-offs" },
  framework: { code: "S4", label: "The six-area diagnostic framework" },
};

/** Chips for a task step: which material sections it draws on. */
export function materialRefs(ids: MaterialSectionId[]) {
  return ids.map((id) => ({ anchorId: materialAnchorId(id), label: MATERIAL_LABELS[id] }));
}
