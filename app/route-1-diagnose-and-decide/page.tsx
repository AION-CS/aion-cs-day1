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
  title: `AION Green IT — Day 13 · ${ROUTE.tag}`,
  description:
    "Digitalisation as a sustainability lever, direct vs. indirect impact, the rebound effect and the six-area diagnostic framework — then the ProcessNova engagement: seven signals to triage, two to take further.",
};

/**
 * Route 1 — levels 1 and 2 in one continuous engagement, no separate Decide
 * stage (see lib/route1/sections.ts for why this day inverts the usual
 * material-to-task ratio).
 *
 * The page order is the whole design: the case once, then the entire
 * material block, then one task on a single scroll, then one export bar
 * covering everything above it.
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
          That is the whole teaching block. Now go and read a system you didn&apos;t build.
        </p>
        <a href="#task" className="btn-accent mt-3 inline-flex">
          Start the ProcessNova engagement
        </a>
      </div>

      <PartOne />

      <ExportBar />
    </div>
  );
}
