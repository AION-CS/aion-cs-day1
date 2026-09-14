import type { Metadata } from "next";
import Link from "next/link";
import { CASE, ROUTES } from "@/lib/routes";
import { LeafMark } from "@/components/chrome/Icons";

const ROUTE = ROUTES[1];

export const metadata: Metadata = {
  title: `AION Green IT — ${CASE.module} · ${ROUTE.tag}`,
  description: "Day 12, Route 2 (level 3) — not written yet.",
};

/**
 * Placeholder while Day 12's level-3 route is authored. The Day 11 Route 2
 * code in lib/route2 and components/route2 stays in the repo as the scaffold
 * that route will be rebuilt on; it is simply not mounted, so no Module 7
 * content is reachable from a Day 12 URL.
 */
export default function Route2Page() {
  return (
    <div className="py-12">
      <div className="max-w-prose rounded-2xl border border-dashed border-line bg-paper p-6">
        <p className="mb-2 flex items-center gap-2 text-micro font-semibold uppercase tracking-wide text-accent">
          <LeafMark className="h-4 w-4" /> {ROUTE.tag} — 2 of 2
        </p>
        <h1 className="text-h1 text-ink">Not written yet</h1>
        <p className="mt-3 text-body text-ash">
          Day 12&apos;s level-3 route is the next thing being built. Route 1 stands on its own in the meantime — every
          concept it needs is taught inside it.
        </p>
        <Link href={ROUTES[0].href} className="btn-accent mt-5 inline-flex">
          Open {ROUTES[0].tag}
        </Link>
      </div>
    </div>
  );
}
