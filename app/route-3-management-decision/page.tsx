import type { Metadata } from "next";
import { ROUTES } from "@/lib/routes";
import { PAGE_INTRO } from "@/lib/route3";
import { LeafMark } from "@/components/chrome/Icons";
import { RouteGate } from "@/components/chrome/RouteGate";
import { Material } from "@/components/route3/Material";
import { TaskFlow } from "@/components/route3/TaskFlow";
import { MentorTools } from "@/components/route3/MentorTools";

const ROUTE = ROUTES[2];

export const metadata: Metadata = {
  title: `AION Green IT — Day 10 · ${ROUTE.tag}`,
  description:
    "Leading the Standard — the SoftPulse worked example, then build CodeVista's decision architecture: ranked guiding decisions, a trade-off map, a RACI model, and a call made under incomplete data.",
};

export default function Route3Page() {
  return (
    <div className="space-y-16 py-12">
      <MentorTools />

      {/* Soft order suggestion only — never blocks rendering (CLAUDE.md #6). */}
      <RouteGate routeN={3}>
        <div className="max-w-prose">
          <p className="mb-2 flex items-center gap-2 text-micro font-semibold uppercase tracking-wide text-accent">
            <LeafMark className="h-4 w-4" /> {PAGE_INTRO.tag} — 3 of 3
          </p>
          <h1 className="text-display text-ink">{PAGE_INTRO.title}</h1>
          <p className="mt-4 text-body text-ash">{PAGE_INTRO.body}</p>
        </div>

        <hr className="mt-16 border-line" />

        <div className="mt-16 space-y-16">
          <Material />

          <div className="rounded-2xl border border-accent/30 bg-accentSoft p-6 text-center">
            <p className="text-body font-semibold text-ink">
              You have seen the reasoning. Now run it on a company you have never met.
            </p>
            <a href="#task" className="btn-accent mt-3 inline-flex">
              Open the CodeVista brief
            </a>
          </div>

          <TaskFlow />
        </div>
      </RouteGate>
    </div>
  );
}
