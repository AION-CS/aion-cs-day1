import type { Metadata } from "next";
import { ROUTES } from "@/lib/routes";
import { LeafMark } from "@/components/chrome/Icons";
import { RouteGate } from "@/components/chrome/RouteGate";
import { Material } from "@/components/route3/Material";
import { TaskFlow } from "@/components/route3/TaskFlow";
import { MentorTools } from "@/components/route3/MentorTools";

const ROUTE = ROUTES[2];

export const metadata: Metadata = {
  title: `AION Green IT — ${ROUTE.tag}`,
};

export default function Route3Page() {
  return (
    <div className="space-y-16 py-12">
      <MentorTools />
      <RouteGate routeN={3}>
        <div className="max-w-prose">
          <p className="mb-2 flex items-center gap-2 text-micro font-semibold uppercase tracking-wide text-accent">
            <LeafMark className="h-4 w-4" /> {ROUTE.tag} — 3 of 3
          </p>
          <h1 className="text-display text-ink">Route 3 · Management Decision — Build the Machine, Not the List</h1>
          <p className="mt-4 text-body text-ash">
            Two consultants have already told this board what to do, and neither report changed anything — because a
            list of measures degrades the moment its sponsor moves on. What survives is a decision architecture: rules
            with real thresholds, one name against every decision, an escalation path, and a way of finding out the
            policy stopped working. You will build one, test it against eight real devices until it does what you
            actually intended, and then defend it against a CFO, a CISO and an HR lead in the same room.
          </p>
        </div>

        <hr className="my-16 border-line" />

        <Material />

        <div className="my-16 rounded-2xl border border-accent/30 bg-accentSoft p-6 text-center">
          <p className="text-body font-semibold text-ink">You have the components. Now design the thing that outlives you.</p>
          <a href="#task" className="btn-accent mt-3 inline-flex">
            Open the BrightPath board session
          </a>
        </div>

        <TaskFlow />
      </RouteGate>
    </div>
  );
}
