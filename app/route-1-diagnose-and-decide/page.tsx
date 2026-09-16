import type { Metadata } from "next";
import { ROUTES } from "@/lib/routes";
import { BANNER, PAGE_INTRO } from "@/lib/route1";
import { LeafMark } from "@/components/chrome/Icons";
import { DismissibleBanner } from "@/components/ui/DismissibleBanner";
import { CaseBrief } from "@/components/route1/CaseBrief";
import { Material } from "@/components/route1/Material";
import { PartOne } from "@/components/route1/PartOne";
import { Handover } from "@/components/route1/Handover";
import { PartTwo } from "@/components/route1/PartTwo";
import { ExportBar } from "@/components/route1/ExportBar";
import { MentorTools } from "@/components/route1/MentorTools";

const ROUTE = ROUTES[0];

export const metadata: Metadata = {
  title: `AION Green IT — Day 13 · ${ROUTE.tag}`,
  description:
    "Energy-efficient networks, IoT sustainability and 5G — then the SmartLink Operations engagement: six signals to route on the Signal Board, and one line of measures to rank, choose and defend on the Decision Scorecard.",
};

/**
 * Route 1 — levels 1 and 2 as one continuous engagement (CLAUDE.md #12).
 *
 * The page order is the whole design: the case once, then the entire material
 * block, then one task whose two parts (the Signal Board, the Decision
 * Scorecard) run on a single scroll with an inline handover between them,
 * then one export bar covering everything above it.
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

      <DismissibleBanner storageKey="r1:bannerDismissed" label={BANNER.label} text={BANNER.text} />

      <CaseBrief />

      <hr className="border-line" />

      <Material />

      <div className="rounded-2xl border border-accent/30 bg-accentSoft p-6 text-center">
        <p className="text-body font-semibold text-ink">
          That is the whole teaching block. Now go and read a system you didn&apos;t build.
        </p>
        <a href="#part-1" className="btn-accent mt-3 inline-flex">
          Start the SmartLink engagement
        </a>
      </div>

      <PartOne />

      <Handover />

      <PartTwo />

      <ExportBar />
    </div>
  );
}
