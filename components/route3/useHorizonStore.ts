"use client";

import { create } from "zustand";
import type { HorizonId } from "@/lib/route3";

export type HorizonPlacements = Record<string, HorizonId | null>;
const HISTORY_LIMIT = 30;

type HorizonState = {
  past: HorizonPlacements[];
  future: HorizonPlacements[];
  recordChange: (before: HorizonPlacements) => void;
  undo: (current: HorizonPlacements) => HorizonPlacements | null;
  redo: (current: HorizonPlacements) => HorizonPlacements | null;
};

/** Ephemeral undo/redo history for Stage 4's drag mechanic — same pattern as Route 1/2. */
export const useHorizonStore = create<HorizonState>()((set, get) => ({
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
