"use client";

import { create } from "zustand";

/** cardId → the slot it sits in, or null for "not placed". */
export type PlacementMap = Record<string, string | null>;

const HISTORY_LIMIT = 30;

export type PlacementHistoryState = {
  past: PlacementMap[];
  future: PlacementMap[];
  /** Call right before applying a change, with the full snapshot as it was *before* the change. */
  recordChange: (before: PlacementMap) => void;
  /** Returns the snapshot to restore, or null if there's nothing to undo. */
  undo: (current: PlacementMap) => PlacementMap | null;
  redo: (current: PlacementMap) => PlacementMap | null;
};

/**
 * Undo/redo for any place-a-card-in-a-slot exercise (CLAUDE.md #5).
 *
 * A factory rather than a single shared store, because each exercise needs its
 * own history: one store instance shared between Route 1's category bins and
 * Route 3's quadrant map would let an undo on one page restore a snapshot
 * belonging to the other after a client-side navigation.
 *
 * Ephemeral by design — it holds only the history stacks. The *current*
 * placement always lives in the persisted progress store, so there is never a
 * second copy that can fall out of sync with what survives a reload.
 */
export function createPlacementHistory() {
  return create<PlacementHistoryState>()((set, get) => ({
    past: [],
    future: [],

    recordChange: (before) =>
      set((s) => ({ past: [...s.past, before].slice(-HISTORY_LIMIT), future: [] })),

    undo: (current) => {
      const { past, future } = get();
      if (past.length === 0) return null;
      const prev = past[past.length - 1];
      set({ past: past.slice(0, -1), future: [current, ...future].slice(0, HISTORY_LIMIT) });
      return prev;
    },

    redo: (current) => {
      const { past, future } = get();
      if (future.length === 0) return null;
      const next = future[0];
      set({ past: [...past, current].slice(-HISTORY_LIMIT), future: future.slice(1) });
      return next;
    },
  }));
}
