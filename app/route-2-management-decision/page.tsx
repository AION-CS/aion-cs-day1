import type { Metadata } from "next";
import { ROUTES } from "@/lib/routes";
import { PAGE_INTRO } from "@/lib/route2";
import { LeafMark } from "@/components/chrome/Icons";
import { RouteGate } from "@/components/chrome/RouteGate";
import { CaseBrief } from "@/components/route2/CaseBrief";
import { Material } from "@/components/route2/Material";
import { Task } from "@/components/route2/Task";
import { MentorTools } from "@/components/route2/MentorTools";

const ROUTE = ROUTES[1];

export const metadata: Metadata = {
  title: `AION Green IT — Day 16 · ${ROUTE.tag}`,
  description: ROUTE.cardBlurb,
};

/**
 * Route 2, Level 3, standalone: the case once, four material micro-cards,
 * one five-stage task on a single scroll, one export bar.
 */
export default function Route2Page() {
  return (
    <RouteGate routeN={2}>
      <div className="space-y-16 py-12">
        <MentorTools />

        <div className="max-w-prose">
          <p className="mb-2 flex items-center gap-2 text-micro font-semibold uppercase tracking-wide text-accent">
            <LeafMark className="h-4 w-4" /> {PAGE_INTRO.tag}
          </p>
          <h1 className="text-display text-ink">{PAGE_INTRO.title}</h1>
          <p className="mt-4 text-body text-ash">{PAGE_INTRO.body}</p>
        </div>

        <CaseBrief />

        <hr className="border-line" />

        <Material />

        <div className="rounded-2xl border border-accent/30 bg-accentSoft p-6 text-center">
          <p className="text-body font-semibold text-ink">
            That's the whole teaching block. Now build one for Verdeon — a decision architecture, not a metrics list.
          </p>
          <a href="#task" className="btn-accent mt-3 inline-flex">
            Start the Verdeon proposal
          </a>
        </div>

        <Task />
      </div>
    </RouteGate>
  );
}
