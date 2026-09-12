"use client";

import { create } from "zustand";

/** decisionId -> position (1-based). */
export type SequenceSnapshot = Record<string, number | null>;

const HISTORY_LIMIT = 30;

type HistoryState = {
  past: SequenceSnapshot[];
  future: SequenceSnapshot[];
  recordChange: (before: SequenceSnapshot) => void;
  undo: (current: SequenceSnapshot) => SequenceSnapshot | null;
  redo: (current: SequenceSnapshot) => SequenceSnapshot | null;
};

/** Ephemeral undo/redo history for the decision-sequencing drag. Order itself lives in the persisted store. */
export const useSequenceStore = create<HistoryState>()((set, get) => ({
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
