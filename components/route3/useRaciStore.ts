"use client";

import { create } from "zustand";
import type { RaciLetter } from "@/lib/route3";

/** `${decisionId}:${roleId}` -> letter. */
export type RaciSnapshot = Record<string, RaciLetter | null>;

const HISTORY_LIMIT = 40;

type HistoryState = {
  past: RaciSnapshot[];
  future: RaciSnapshot[];
  recordChange: (before: RaciSnapshot) => void;
  undo: (current: RaciSnapshot) => RaciSnapshot | null;
  redo: (current: RaciSnapshot) => RaciSnapshot | null;
};

/** Ephemeral undo/redo history for the RACI grid — assignments live in the persisted store. */
export const useRaciStore = create<HistoryState>()((set, get) => ({
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
