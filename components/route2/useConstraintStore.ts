"use client";

import { create } from "zustand";
import type { MeasureId } from "@/lib/route2";

export type ConstraintPlacements = Record<string, MeasureId | null>;

const HISTORY_LIMIT = 30;

type HistoryState = {
  past: ConstraintPlacements[];
  future: ConstraintPlacements[];
  recordChange: (before: ConstraintPlacements) => void;
  undo: (current: ConstraintPlacements) => ConstraintPlacements | null;
  redo: (current: ConstraintPlacements) => ConstraintPlacements | null;
};

/** Ephemeral undo/redo history only — the placements themselves live in the persisted progress store. */
export const useConstraintStore = create<HistoryState>()((set, get) => ({
  past: [],
  future: [],

  recordChange: (before) => set((s) => ({ past: [...s.past, before].slice(-HISTORY_LIMIT), future: [] })),

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
