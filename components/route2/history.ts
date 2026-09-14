"use client";

import { createPlacementHistory } from "@/lib/usePlacementHistory";

/**
 * Three independent undo histories — criteria ranking, trade-off links, and
 * the RACI grid (§9) — so an undo in one never restores a snapshot of another.
 * Each keeps the last 30 steps and nothing is persisted (the current state
 * always lives in the progress store).
 */
export const useCriteriaHistory = createPlacementHistory();
export const useTradeOffHistory = createPlacementHistory();
export const useRaciHistory = createPlacementHistory();
