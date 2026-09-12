import type { Metadata } from "next";
import { ROUTES } from "@/lib/routes";
import { PAGE_INTRO } from "@/lib/route1";
import { LeafMark } from "@/components/chrome/Icons";
import { CaseBrief } from "@/components/route1/CaseBrief";
import { FoundationsMaterial, DecisionMaterial } from "@/components/route1/Material";
import { StageOne } from "@/components/route1/StageOne";
import { Bridge } from "@/components/route1/Bridge";
import { StageTwo } from "@/components/route1/StageTwo";
import { ExportBar } from "@/components/route1/ExportBar";
import { MentorTools } from "@/components/route1/MentorTools";

const ROUTE = ROUTES[0];

export const metadata: Metadata = {
  title: `AION Green IT — Day 11 · ${ROUTE.tag}`,
  description:
    "The AppNexa engagement, end to end: why software has a carbon footprint, how SCI measures it, a live system trace to diagnose — then one quarter of capacity to spend across three competing lines of measures, and a call to defend.",
};

/**
 * Route 1 — levels 1 and 2 as one continuous engagement (CLAUDE.md #12).
 *
 * The page order is the whole point: the case is introduced once, the material
 * arrives in two halves either side of the work that uses it, the bridge hands
 * the learner's own diagnosis into the decision, and one export bar at the
 * bottom covers everything above it.
 */
export default function Route1Page() {
  return (
    <div className="space-y-16 py-12">
      <MentorTools />

      <div className="max-w-prose">
        <p className="mb-2 flex items-center gap-2 text-micro font-semibold uppercase tracking-wide text-accent">
          <LeafMark className="h-4 w-4" /> {PAGE_INTRO.tag} — 1 of 2
        </p>
        <h1 className="text-display text-ink">{PAGE_INTRO.title}</h1>
        <p className="mt-4 text-body text-ash">{PAGE_INTRO.body}</p>
      </div>

      <CaseBrief />

      <hr className="border-line" />

      <FoundationsMaterial />

      <div className="rounded-2xl border border-accent/30 bg-accentSoft p-6 text-center">
        <p className="text-body font-semibold text-ink">
          You have the vocabulary. Now go read a system you didn&apos;t build.
        </p>
        <a href="#stage-1" className="btn-accent mt-3 inline-flex">
          Open the AppNexa system trace
        </a>
      </div>

      <StageOne />

      <Bridge />

      <DecisionMaterial />

      <div className="rounded-2xl border border-accent/30 bg-accentSoft p-6 text-center">
        <p className="text-body font-semibold text-ink">
          You have the dimensions. Now spend the quarter.
        </p>
        <a href="#stage-2" className="btn-accent mt-3 inline-flex">
          Enter the prioritization room
        </a>
      </div>

      <StageTwo />

      <ExportBar />
    </div>
  );
}
