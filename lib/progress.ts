import { MATERIALS } from "@/data/materialIndex";
import { RECORDS } from "@/data/kesslerDossier";
import { FIGURES } from "@/data/offers";
import { KESSLER_ROLES } from "@/data/motives";
import type { Persisted } from "@/store/useStore";

export type TaskBlockId = "b11" | "b12" | "b23" | "b24" | "b25" | "b26";

/** Which task blocks are complete — complete means filled in, never correct. */
export function taskBlocks(p: Persisted): Record<TaskBlockId, boolean> {
  return {
    b11: RECORDS.every((r) => p.l1.placements[r.id] !== null),
    b12: p.l1.verdict.filedAt !== null,
    b23: FIGURES.every((f) => p.l2.fillins[f.id].trim() !== ""),
    b24: KESSLER_ROLES.every((r) => p.l2.motives[r.key] !== null),
    b25: p.l2.recommendation !== null && p.l2.justification.trim() !== "" && p.l2.limits.trim().length >= 30,
    b26: p.l2.q6Submitted && p.l2.q6.trim() !== "",
  };
}

/** Dossier progress: cards marked read + task blocks completed. */
export function dossierProgress(p: Persisted): { done: number; total: number } {
  const cards = MATERIALS.filter((m) => p.ui.sectionsRead[m.id]).length;
  const blocks = Object.values(taskBlocks(p)).filter(Boolean).length;
  return { done: cards + blocks, total: MATERIALS.length + 6 };
}
