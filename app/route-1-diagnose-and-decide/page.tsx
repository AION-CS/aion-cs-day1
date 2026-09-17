import type { Metadata } from "next";
import { ROUTES } from "@/lib/routes";
import { PAGE_INTRO } from "@/lib/route1";
import { LeafMark } from "@/components/chrome/Icons";
import { CaseBrief } from "@/components/route1/CaseBrief";
import { Material } from "@/components/route1/Material";
import { PartOne } from "@/components/route1/PartOne";
import { ExportBar } from "@/components/route1/ExportBar";
import { MentorTools } from "@/components/route1/MentorTools";

const ROUTE = ROUTES[0];

export const metadata: Metadata = {
  title: `AION Green IT — Day 14 · ${ROUTE.tag}`,
  description:
    "The Green IT business case, why ROI needs three lenses, why technical solutions fail without behavioural change, and regulation as a management framework — then Mercury Office Systems: classify seven indications of stalled implementation by area, root cause and timeframe.",
};

/**
 * Route 1, Level 1 only so far: the case once, the full material block, one
 * task on a single scroll, then one export bar covering everything above it.
 * Level 2 (prioritisation) is a separate, later addition to this same page.
 */
export default function Route1Page() {
  return (
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
          That is the whole teaching block. Now go and read why a sensible set of measures is stalling.
        </p>
        <a href="#task" className="btn-accent mt-3 inline-flex">
          Start the Mercury Office Systems diagnosis
        </a>
      </div>

      <PartOne />

      <ExportBar />
    </div>
  );
}
