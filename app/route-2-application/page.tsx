import type { Metadata } from "next";
import { ROUTES } from "@/lib/routes";
import { LeafMark } from "@/components/chrome/Icons";
import { RouteGate } from "@/components/chrome/RouteGate";
import { Material } from "@/components/route2/Material";
import { TaskFlow } from "@/components/route2/TaskFlow";
import { MentorTools } from "@/components/route2/MentorTools";

const ROUTE = ROUTES[1];

export const metadata: Metadata = {
  title: `AION Green IT — ${ROUTE.tag}`,
};

export default function Route2Page() {
  return (
    <div className="space-y-16 py-12">
      <MentorTools />
      <RouteGate routeN={2}>
        <div className="max-w-prose">
          <p className="mb-2 flex items-center gap-2 text-micro font-semibold uppercase tracking-wide text-accent">
            <LeafMark className="h-4 w-4" /> {ROUTE.tag} — 2 of 3
          </p>
          <h1 className="text-display text-ink">Route 2 · Application — What Do You Do First?</h1>
          <p className="mt-4 text-body text-ash">
            Three measures, one budget, and a board that has already agreed something must happen. The measure that
            looks best on a sustainability slide is the one most likely to make the real number worse, and the measure
            most likely to be right is the one most likely to be rejected. You will score all three through a matrix
            that makes you reason before you rate — then defend the ranking under a budget cap, a capacity limit, two
            sources that contradict each other, and a mid-year surprise.
          </p>
        </div>

        <hr className="my-16 border-line" />

        <Material />

        <div className="my-16 rounded-2xl border border-accent/30 bg-accentSoft p-6 text-center">
          <p className="text-body font-semibold text-ink">You have the method. Now take the decision.</p>
          <a href="#task" className="btn-accent mt-3 inline-flex">
            Open the Nordwerk prioritisation board
          </a>
        </div>

        <TaskFlow />
      </RouteGate>
    </div>
  );
}
