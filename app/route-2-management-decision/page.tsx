import type { Metadata } from "next";
import { ROUTES } from "@/lib/routes";
import { PAGE_INTRO } from "@/lib/route2";
import { LeafMark } from "@/components/chrome/Icons";
import { RouteGate } from "@/components/chrome/RouteGate";
import { CaseBrief } from "@/components/route2/CaseBrief";
import { Material } from "@/components/route2/Material";
import { Task } from "@/components/route2/Task";
import { ExportBar } from "@/components/route2/ExportBar";
import { MentorTools } from "@/components/route2/MentorTools";

const ROUTE = ROUTES[1];

export const metadata: Metadata = {
  title: `AION Green IT — Day 14 · ${ROUTE.tag}`,
  description:
    "The four prioritisation criteria and deciding & assigning ownership with incomplete data — then Valora Digital Operations: score three measure-lines, choose one, and propose it.",
};

/**
 * Route 2 — Levels 2 and 3 merged into one route, one task in two parts
 * (CLAUDE.md §12/§13). Same page shape as Route 1: the case once, the whole
 * (lean) material block, then the task, then one export. Reachable with
 * Route 1 untouched — RouteGate renders a soft suggestion, never a wall.
 */
export default function Route2Page() {
  return (
    <div className="space-y-16 py-12">
      <MentorTools />

      <RouteGate routeN={2}>
        <div className="max-w-prose">
          <p className="mb-2 flex items-center gap-2 text-micro font-semibold uppercase tracking-wide text-accent">
            <LeafMark className="h-4 w-4" /> {PAGE_INTRO.tag}
          </p>
          <h1 className="text-display text-ink">{PAGE_INTRO.title}</h1>
          <p className="mt-4 text-body text-ash">{PAGE_INTRO.body}</p>
        </div>

        <div className="mt-16 space-y-16">
          <CaseBrief />

          <hr className="border-line" />

          <Material />

          <div className="rounded-2xl border border-accent/30 bg-accentSoft p-6 text-center">
            <p className="text-body font-semibold text-ink">
              That is the whole teaching block. Now score, choose, and propose.
            </p>
            <a href="#task" className="btn-accent mt-3 inline-flex">
              Start Part 1 — Prioritise
            </a>
          </div>

          <Task />

          <ExportBar />
        </div>
      </RouteGate>
    </div>
  );
}
