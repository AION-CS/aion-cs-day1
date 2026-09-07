"use client";

import { create } from "zustand";
import type { DimensionId } from "@/lib/route1";

export type WheelPlacements = Record<string, DimensionId | null>;

const HISTORY_LIMIT = 30;

type WheelState = {
  past: WheelPlacements[];
  future: WheelPlacements[];
  /** Call right before applying a change, with the full snapshot as it was *before* the change. */
  recordChange: (before: WheelPlacements) => void;
  /** Returns the snapshot to restore, or null if there's nothing to undo. */
  undo: (current: WheelPlacements) => WheelPlacements | null;
  redo: (current: WheelPlacements) => WheelPlacements | null;
};

/**
 * Ephemeral (not persisted) — holds only the undo/redo history stacks, as
 * snapshots of the full placement map. The *current* placement is never
 * duplicated here: it always lives in the persisted progress store (same
 * source of truth every other stage uses), so there is no separate copy that
 * can fall out of sync with what actually survives a reload.
 */
export const useWheelStore = create<WheelState>()((set, get) => ({
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
