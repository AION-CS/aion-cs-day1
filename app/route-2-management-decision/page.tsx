import type { Metadata } from "next";
import { ROUTES } from "@/lib/routes";
import { PAGE_INTRO } from "@/lib/route2";
import { LeafMark } from "@/components/chrome/Icons";
import { RouteGate } from "@/components/chrome/RouteGate";
import { Material } from "@/components/route2/Material";
import { CaseBrief } from "@/components/route2/CaseBrief";
import { Task } from "@/components/route2/Task";
import { ExportBar } from "@/components/route2/ExportBar";
import { MentorTools } from "@/components/route2/MentorTools";

const ROUTE = ROUTES[1];

export const metadata: Metadata = {
  title: `AION Green IT — Day 11 · ${ROUTE.tag}`,
  description:
    "Level 3: why monitoring and sustainable architecture are board questions, RACI in full, deciding under incomplete information, the MetricFlow worked example — then the NexLayer board memo.",
};

/**
 * Route 2 — level 3. Material A–D, then the NexLayer case once, then the four
 * exercises with the memo assembling beside them, then one export. Reachable
 * with Route 1 untouched: the gate renders a soft suggestion, never a wall
 * (CLAUDE.md #6).
 */
export default function Route2Page() {
  return (
    <div className="space-y-16 py-12">
      <MentorTools />

      <RouteGate routeN={2}>
        <div className="max-w-prose">
          <p className="mb-2 flex items-center gap-2 text-micro font-semibold uppercase tracking-wide text-accent">
            <LeafMark className="h-4 w-4" /> {PAGE_INTRO.tag} — 2 of 2
          </p>
          <h1 className="text-display text-ink">{PAGE_INTRO.title}</h1>
          <p className="mt-4 text-body text-ash">{PAGE_INTRO.body}</p>
        </div>

        <div className="mt-16 space-y-16">
          <hr className="border-line" />

          <Material />

          <div className="rounded-2xl border border-accent/30 bg-accentSoft p-6 text-center">
            <p className="text-body font-semibold text-ink">
              You have seen the reasoning. Now run it on a company you have never met.
            </p>
            <a href="#r2-case" className="btn-accent mt-3 inline-flex">
              Open the NexLayer brief
            </a>
          </div>

          <div id="r2-case" className="scroll-mt-24">
            <CaseBrief />
          </div>

          <Task />

          <ExportBar />
        </div>
      </RouteGate>
    </div>
  );
}
