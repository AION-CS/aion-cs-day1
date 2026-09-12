"use client";

import { create } from "zustand";
import type { CategoryId } from "@/lib/route1";

export type SortPlacements = Record<string, CategoryId | null>;

const HISTORY_LIMIT = 30;

type SortHistoryState = {
  past: SortPlacements[];
  future: SortPlacements[];
  /** Call right before applying a change, with the full snapshot as it was *before* the change. */
  recordChange: (before: SortPlacements) => void;
  /** Returns the snapshot to restore, or null if there's nothing to undo. */
  undo: (current: SortPlacements) => SortPlacements | null;
  redo: (current: SortPlacements) => SortPlacements | null;
};

/**
 * Ephemeral (not persisted) — holds only the undo/redo history stacks as
 * snapshots of the full placement map. The *current* placement is never
 * duplicated here: it always lives in the persisted progress store, so there is
 * no second copy that can fall out of sync with what survives a reload.
 */
export const useFindingSortStore = create<SortHistoryState>()((set, get) => ({
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
