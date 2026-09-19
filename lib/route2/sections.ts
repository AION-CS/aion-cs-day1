/**
 * Route 2's material — four short cards, D1–D4, read once before the whole
 * task (a single continuous task, unlike Route 1's two pairs — this route
 * is standalone, Level 3 only).
 */

export type MaterialSectionId = "leadershipInstrument" | "layeredModel" | "tradeoffPentagon" | "rolePriorities";

export const MATERIAL_ORDER: MaterialSectionId[] = [
  "leadershipInstrument",
  "layeredModel",
  "tradeoffPentagon",
  "rolePriorities",
];

export function materialAnchorId(id: MaterialSectionId): string {
  return `r2-card-${id}`;
}

export const MATERIAL_LABELS: Record<MaterialSectionId, string> = {
  leadershipInstrument: "D1 · Leadership instrument, not documentation",
  layeredModel: "D2 · Building a model in layers",
  tradeoffPentagon: "D3 · The senior five-factor trade-off",
  rolePriorities: "D4 · Different roles prioritise differently",
};

export const MATERIAL_NAV: Record<MaterialSectionId, { code: string; label: string }> = {
  leadershipInstrument: { code: "D1", label: "Leadership instrument, not documentation" },
  layeredModel: { code: "D2", label: "Building a model in layers" },
  tradeoffPentagon: { code: "D3", label: "The senior five-factor trade-off" },
  rolePriorities: { code: "D4", label: "Different roles prioritise differently" },
};

export function materialRefs(ids: MaterialSectionId[]) {
  return ids.map((id) => ({ anchorId: materialAnchorId(id), label: MATERIAL_LABELS[id] }));
}
