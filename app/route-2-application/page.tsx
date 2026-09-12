import type { Metadata } from "next";
import { ROUTES } from "@/lib/routes";
import { PAGE_INTRO } from "@/lib/route2";
import { LeafMark } from "@/components/chrome/Icons";
import { RouteGate } from "@/components/chrome/RouteGate";
import { Material } from "@/components/route2/Material";
import { TaskFlow } from "@/components/route2/TaskFlow";
import { MentorTools } from "@/components/route2/MentorTools";

const ROUTE = ROUTES[1];

export const metadata: Metadata = {
  title: `AION Green IT — Day 10 · ${ROUTE.tag}`,
  description:
    "Choosing Where to Spend Effort — comparing three competing lines of measures for AppNexa Solutions across seven decision dimensions, under limited capacity and incomplete data.",
};

export default function Route2Page() {
  return (
    <div className="space-y-16 py-12">
      <MentorTools />

      {/* Soft order suggestion only — never blocks rendering (CLAUDE.md #6). */}
      <RouteGate routeN={2}>
        <div className="max-w-prose">
          <p className="mb-2 flex items-center gap-2 text-micro font-semibold uppercase tracking-wide text-accent">
            <LeafMark className="h-4 w-4" /> {PAGE_INTRO.tag} — 2 of 3
          </p>
          <h1 className="text-display text-ink">{PAGE_INTRO.title}</h1>
          <p className="mt-4 text-body text-ash">{PAGE_INTRO.body}</p>
        </div>

        <hr className="mt-16 border-line" />

        <div className="mt-16 space-y-16">
          <Material />

          <div className="rounded-2xl border border-accent/30 bg-accentSoft p-6 text-center">
            <p className="text-body font-semibold text-ink">
              You have the dimensions. Now spend the quarter.
            </p>
            <a href="#task" className="btn-accent mt-3 inline-flex">
              Enter the prioritization room
            </a>
          </div>

          <TaskFlow />
        </div>
      </RouteGate>
    </div>
  );
}
