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
    <RouteGate routeN={2}>
      <div className="space-y-16 py-12">
        <MentorTools />
        <div className="max-w-prose">
          <p className="mb-2 flex items-center gap-2 text-micro font-semibold uppercase tracking-wide text-accent">
            <LeafMark className="h-4 w-4" /> {ROUTE.tag} — 2 of 3
          </p>
          <h1 className="text-display text-ink">{ROUTE.title}</h1>
          <p className="mt-4 text-body text-ash">
            Seeing a trade-off isn't the same as scoring it consistently. This route gives you a seven-criteria
            framework, then has you run a live prioritisation simulator across three funding options for Meridian
            Data Systems GmbH.
          </p>
        </div>

        <hr className="border-line" />

        <Material />

        <div className="rounded-2xl border border-accent/30 bg-accentSoft p-6 text-center">
          <p className="text-body font-semibold text-ink">You've got the framework. Time to apply it.</p>
          <a href="#task" className="btn-accent mt-3 inline-flex">
            Start the Prioritisation Decision Simulator
          </a>
        </div>

        <TaskFlow />
      </div>
    </RouteGate>
  );
}
