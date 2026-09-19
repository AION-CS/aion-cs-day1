import { MATERIALS } from "@/data/materialIndex";
import { RECORDS } from "@/data/kesslerDossier";
import { MAP_ROWS } from "@/data/mapping";
import { FIGURES } from "@/data/offers";
import { KESSLER_ROLES } from "@/data/motives";
import { l3Blocks } from "@/lib/l3";
import type { Persisted } from "@/store/useStore";

export type TaskBlockId = "b11" | "b1m" | "b12" | "b23" | "b24" | "b25" | "b26" | "b31" | "b32" | "b33" | "b34" | "b35" | "b36";

/** Which task blocks are complete — complete means filled in, never correct. */
export function taskBlocks(p: Persisted): Record<TaskBlockId, boolean> {
  return {
    b11: RECORDS.every((r) => p.l1.placements[r.id] !== null),
    b1m: MAP_ROWS.every((r) => {
      const a = p.l1.mapping.rows[r.id];
      return a.bucket !== null && (a.bucket === "not_recorded" || a.cite !== "");
    }) && p.l1.mapping.sentence.trim().length >= 30,
    b12: p.l1.verdict.filedAt !== null,
    b23: FIGURES.every((f) => p.l2.fillins[f.id].trim() !== ""),
    b24: KESSLER_ROLES.every((r) => p.l2.motives[r.key] !== null),
    b25: p.l2.recommendation !== null && p.l2.justification.trim() !== "" && p.l2.limits.trim().length >= 30,
    b26: p.l2.q6Submitted && p.l2.q6.trim() !== "",
    ...l3Blocks(p),
  };
}

const BLOCKS_OF: Record<1 | 2 | 3, TaskBlockId[]> = {
  1: ["b11", "b1m", "b12"],
  2: ["b23", "b24", "b25", "b26"],
  3: ["b31", "b32", "b33", "b34", "b35", "b36"],
};

/** Dossier progress for one route: its cards marked read + its task blocks completed. */
export function dossierProgress(p: Persisted, route: 1 | 2 | 3): { done: number; total: number } {
  const block = route === 1 ? "A" : route === 2 ? "B" : "C";
  const cards = MATERIALS.filter((m) => m.block === block);
  const read = cards.filter((m) => p.ui.sectionsRead[m.id]).length;
  const tb = taskBlocks(p);
  const done = BLOCKS_OF[route].filter((b) => tb[b]).length;
  return { done: read + done, total: cards.length + BLOCKS_OF[route].length };
}
