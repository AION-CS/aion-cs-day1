/**
 * Route 1's material: five micro-cards, C1–C5, all of it read before Task 1.
 *
 * Day 15 deliberately runs a lighter material budget than Day 14's four
 * 15-minute sections — "read less, do more" (10–12 minutes of reading, then a
 * 15-minute task). The teaching is not thinner, it is denser: each card is
 * 3–5 sentences plus one live diagram, and everything Task 1 asks for is
 * introduced in one of the five.
 *
 * The ids, labels and anchor ids live above the content so the mini-nav, the
 * MaterialRefs chips on the task, and the material itself can never disagree
 * about what a card is called.
 */

export type MaterialSectionId = "novelty" | "aiLoad" | "circular" | "lenses" | "viability";

export const SECTION_ORDER: MaterialSectionId[] = [
  "novelty",
  "aiLoad",
  "circular",
  "lenses",
  "viability",
];

/** DOM anchor a MaterialRefs chip or the mini-nav scrolls to. */
export function materialAnchorId(id: MaterialSectionId): string {
  return `r1-card-${id}`;
}

export const MATERIAL_LABELS: Record<MaterialSectionId, string> = {
  novelty: "C1 · Novelty is not innovation",
  aiLoad: "C2 · AI: promise and burden",
  circular: "C3 · Circular vs linear IT",
  lenses: "C4 · The 7 assessment lenses",
  viability: "C5 · Attractive vs viable",
};

/** Short label for the sticky mini-nav dots. */
export const MATERIAL_NAV: Record<MaterialSectionId, { code: string; label: string }> = {
  novelty: { code: "C1", label: "Novelty is not innovation" },
  aiLoad: { code: "C2", label: "AI: promise and burden" },
  circular: { code: "C3", label: "Circular vs linear IT" },
  lenses: { code: "C4", label: "The 7 assessment lenses" },
  viability: { code: "C5", label: "Attractive vs viable" },
};

/** Chips for a task step: which material cards it draws on. */
export function materialRefs(ids: MaterialSectionId[]) {
  return ids.map((id) => ({ anchorId: materialAnchorId(id), label: MATERIAL_LABELS[id] }));
}
