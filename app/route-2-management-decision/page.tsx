import type { Metadata } from "next";
import Link from "next/link";
import { ROUTES } from "@/lib/routes";
import { LeafMark } from "@/components/chrome/Icons";

const ROUTE = ROUTES[1];

export const metadata: Metadata = {
  title: `AION Green IT — Day 14 · ${ROUTE.tag}`,
  description: "Level 3 for Module 10 — the management decision — has not been written yet.",
};

/**
 * Route 2 / Level 3 for Module 10 has not been authored yet (a separate,
 * later prompt). This stub keeps the URL reachable — CLAUDE.md §6 never
 * gates a route, it only says honestly when a route's content isn't built —
 * rather than 404ing or silently reusing Day 13's EcoFlow/Synervia content
 * under a Day 14 banner.
 */
export default function Route2Page() {
  return (
    <div className="space-y-6 py-12">
      <div className="max-w-prose">
        <p className="mb-2 flex items-center gap-2 text-micro font-semibold uppercase tracking-wide text-accent">
          <LeafMark className="h-4 w-4" /> {ROUTE.tag}
        </p>
        <h1 className="text-display text-ink">Not built yet</h1>
        <p className="mt-4 text-body text-ash">
          Level 3 for Module 10 — the management decision that follows Route 1's diagnosis — hasn&apos;t been written.
          Route 1&apos;s Level 1 material and Task 1 (the Mercury Office Systems diagnosis board) are ready now.
        </p>
        <Link href="/route-1-diagnose-and-decide" className="btn-accent mt-5 inline-flex">
          Go to Route 1
        </Link>
      </div>
    </div>
  );
}
