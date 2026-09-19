import { MAP_ROWS } from "@/data/mapping";
import type { MapRowId } from "@/data/mapping";
import { quadOf } from "@/data/loyalty";
import type { Attitude, Behaviour, Q } from "@/data/loyalty";
import type { L1State, MappingState } from "@/store/useStore";

/**
 * Where the participant's own readings put Kessler on the loyalty quadrant.
 * The position falls out of two rows (M2 attitude, M3 retention) — it is never
 * picked directly. A row that is "Not recorded" (or unset) leaves its axis open.
 */
export function loyaltyMarker(m: MappingState): { att: Attitude; beh: Behaviour; quad: Q | null } {
  const a = m.rows.M2.bucket;
  const b = m.rows.M3.bucket;
  const att: Attitude = a === "positive" ? "strong" : a === "weak" || a === "absent" ? "weak" : null;
  const beh: Behaviour = b === "positive" ? "high" : b === "weak" || b === "absent" ? "low" : null;
  return { att, beh, quad: att && beh ? quadOf(att, beh) : null };
}

/**
 * Rows the last "Check my reading" flags: a bucket that differs from what the
 * file shows, or a record cited that does not measure the thing. An empty row,
 * and a missing citation, are "missing", not flagged.
 */
export function flagsForMapping(l1: L1State): string[] {
  const out: string[] = [];
  for (const row of MAP_ROWS) {
    const a = l1.mapping.rows[row.id];
    if (a.bucket === null) continue;
    if (a.bucket !== row.expected) {
      out.push(row.id);
      continue;
    }
    if (row.expected !== "not_recorded" && a.cite !== "" && !row.citeOk.includes(a.cite)) out.push(row.id);
  }
  return out;
}

/** Which clue a flagged row shows: the bucket clue, or the citation clue once the bucket holds. */
export function clueFor(l1: L1State, id: MapRowId): string {
  const row = MAP_ROWS.find((r) => r.id === id)!;
  return l1.mapping.rows[id].bucket !== row.expected ? row.clue : row.citeClue || row.clue;
}
