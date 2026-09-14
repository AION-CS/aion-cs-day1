import { isOptionId, type OptionId, type Rank } from "@/lib/route1";

/** Slot 1, 2, 3 for one criterion — the option holding each rank, or null. */
export type Slots = [OptionId | null, OptionId | null, OptionId | null];

/** Stored as "B|A|C", with an empty segment for an empty slot ("B||C"). */
export function parseSlots(raw: string | undefined): Slots {
  const parts = (raw ?? "").split("|");
  const out: Slots = [null, null, null];
  const seen = new Set<OptionId>();
  for (let i = 0; i < 3; i++) {
    const v = parts[i];
    if (isOptionId(v) && !seen.has(v)) {
      out[i] = v;
      seen.add(v);
    }
  }
  return out;
}

export const serialiseSlots = (slots: Slots) => slots.map((s) => s ?? "").join("|");

/**
 * Gives `option` the rank `rank` (or removes it, for null). No ties: whoever
 * held that rank swaps into the option's previous slot — or, if the option was
 * not ranked yet, into the one slot that is still free.
 */
export function assignRank(slots: Slots, option: OptionId, rank: Rank | null): Slots {
  const next: Slots = [...slots];
  const from = next.indexOf(option);
  if (rank === null) {
    if (from >= 0) next[from] = null;
    return next;
  }
  const to = rank - 1;
  if (from === to) return next;
  const occupant = next[to];
  if (from >= 0) next[from] = null;
  next[to] = option;
  if (occupant && occupant !== option) {
    if (from >= 0) next[from] = occupant;
    else {
      const free = next.findIndex((s) => s === null);
      if (free >= 0) next[free] = occupant;
    }
  }
  return next;
}
