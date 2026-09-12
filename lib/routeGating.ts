"use client";

import { useProgress, useHydrated } from "./store";

/**
 * Cross-route order signal: each route's export bar sets its own key true the
 * moment the learner downloads that route's deliverable. Nothing is ever
 * blocked by it (CLAUDE.md #6) — it only decides whether Route 2 shows its
 * soft "Route 1 first is the easier order" banner.
 */
export const EXPORTED_KEYS: Record<1 | 2, string> = {
  1: "r1:exported",
  2: "r2:exported",
};

export function useRouteUnlocked(routeN: 1 | 2): boolean {
  const hydrated = useHydrated();
  const checks = useProgress((s) => s.checks);
  if (routeN === 1) return true;
  if (!hydrated) return false;
  return !!checks[EXPORTED_KEYS[1]];
}

/** Marks the given route's export as submitted. Call once, when the download action fires. */
export function markRouteExported(
  toggleCheck: (key: string, value: boolean) => void,
  routeN: 1 | 2,
) {
  toggleCheck(EXPORTED_KEYS[routeN], true);
}
