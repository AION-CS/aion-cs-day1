"use client";

import { create } from "zustand";
import { createPlacementHistory } from "@/lib/usePlacementHistory";
import type { ZoneId } from "@/lib/route1";

/**
 * Two independent undo histories — one for the Signal Board, one for the
 * ranking matrix — from Day 11's factory, so an undo in one part can never
 * restore a snapshot of the other. Each keeps the last 30 steps and nothing is
 * persisted: the current state always lives in the progress store.
 */
export const useBoardHistory = createPlacementHistory();
export const useMatrixHistory = createPlacementHistory();

/**
 * The routing moment, for the board to animate: which signal just landed in
 * which zone. `nonce` changes on every routing so a re-route of the same card
 * replays the connector. Ephemeral — a reload shows the settled board.
 */
type BoardFx = {
  last: { signalId: string; zone: ZoneId; nonce: number } | null;
  fire: (signalId: string, zone: ZoneId) => void;
};

export const useBoardFx = create<BoardFx>()((set) => ({
  last: null,
  fire: (signalId, zone) => set((s) => ({ last: { signalId, zone, nonce: (s.last?.nonce ?? 0) + 1 } })),
}));
