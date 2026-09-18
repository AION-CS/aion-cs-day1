/**
 * Route 2's material: two lean sections only, each existing solely because a
 * Task field needs it directly (this route's brief is "simple, not long, but
 * interactive" — no section survives here that the task doesn't use, and the
 * reverse: nothing the task needs is missing from these two sections).
 */

export type MaterialSectionId = "criteria" | "ownership";

export const SECTION_ORDER: MaterialSectionId[] = ["criteria", "ownership"];

export function materialAnchorId(id: MaterialSectionId): string {
  return `r2-material-${id}`;
}

export const MATERIAL_LABELS: Record<MaterialSectionId, string> = {
  criteria: "S1 · The four prioritisation criteria",
  ownership: "S2 · Deciding & assigning ownership with incomplete data",
};

export const MATERIAL_NAV: Record<MaterialSectionId, { code: string; label: string }> = {
  criteria: { code: "S1", label: "The four prioritisation criteria" },
  ownership: { code: "S2", label: "Deciding & assigning ownership with incomplete data" },
};

export function materialRefs(ids: MaterialSectionId[]) {
  return ids.map((id) => ({ anchorId: materialAnchorId(id), label: MATERIAL_LABELS[id] }));
}
