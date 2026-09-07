"use client";

import { create } from "zustand";
import type { Side5 } from "@/lib/route1";

export type TechGovPlacements = Record<string, Side5 | null>;

const HISTORY_LIMIT = 30;

type TechGovState = {
  past: TechGovPlacements[];
  future: TechGovPlacements[];
  /** Call right before applying a change, with the full snapshot as it was *before* the change. */
  recordChange: (before: TechGovPlacements) => void;
  /** Returns the snapshot to restore, or null if there's nothing to undo. */
  undo: (current: TechGovPlacements) => TechGovPlacements | null;
  redo: (current: TechGovPlacements) => TechGovPlacements | null;
};

/**
 * Ephemeral (not persisted) — holds only the undo/redo history stacks, as
 * snapshots of the full placement map. The *current* placement is never
 * duplicated here: it always lives in the persisted progress store (same
 * source of truth every other stage uses), so there is no separate copy that
 * can fall out of sync with what actually survives a reload.
 */
export const useTechGovStore = create<TechGovState>()((set, get) => ({
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
