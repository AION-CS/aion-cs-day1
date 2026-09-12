"use client";

import { createPlacementHistory, type PlacementMap } from "@/lib/usePlacementHistory";
import type { CategoryId } from "@/lib/route1";

export type SortPlacements = Record<string, CategoryId | null>;
export type { PlacementMap };

/**
 * Route 1's undo/redo history for sorting symptom cards into the six category
 * bins. Its own instance of the shared factory, so Route 3's quadrant map
 * cannot restore a snapshot from this exercise, or vice versa.
 */
export const useFindingSortStore = createPlacementHistory();
