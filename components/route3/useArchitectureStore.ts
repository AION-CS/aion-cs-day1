"use client";

import { create } from "zustand";
import type { NodeId } from "@/lib/route3";

export type ArchitecturePlacements = Record<string, NodeId | null>;
const HISTORY_LIMIT = 30;

type ArchitectureState = {
  past: ArchitecturePlacements[];
  future: ArchitecturePlacements[];
  recordChange: (before: ArchitecturePlacements) => void;
  undo: (current: ArchitecturePlacements) => ArchitecturePlacements | null;
  redo: (current: ArchitecturePlacements) => ArchitecturePlacements | null;
};

/** Ephemeral undo/redo history for Stage 2's drag mechanic — same pattern as Route 1/2. */
export const useArchitectureStore = create<ArchitectureState>()((set, get) => ({
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
