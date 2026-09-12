import type { Metadata } from "next";
import { ROUTES } from "@/lib/routes";
import { PAGE_INTRO } from "@/lib/route1";
import { LeafMark } from "@/components/chrome/Icons";
import { Material } from "@/components/route1/Material";
import { TaskFlow } from "@/components/route1/TaskFlow";
import { MentorTools } from "@/components/route1/MentorTools";

const ROUTE = ROUTES[0];

export const metadata: Metadata = {
  title: `AION Green IT — Day 10 · ${ROUTE.tag}`,
  description:
    "Reading the System — why software has a carbon footprint, how SCI measures it, and the six places inefficiency hides. Then diagnose AppNexa Solutions' live system trace.",
};

export default function Route1Page() {
  return (
    <div className="space-y-16 py-12">
      <MentorTools />

      <div className="max-w-prose">
        <p className="mb-2 flex items-center gap-2 text-micro font-semibold uppercase tracking-wide text-accent">
          <LeafMark className="h-4 w-4" /> {PAGE_INTRO.tag} — 1 of 3
        </p>
        <h1 className="text-display text-ink">{PAGE_INTRO.title}</h1>
        <p className="mt-4 text-body text-ash">{PAGE_INTRO.body}</p>
      </div>

      <hr className="border-line" />

      <Material />

      <div className="rounded-2xl border border-accent/30 bg-accentSoft p-6 text-center">
        <p className="text-body font-semibold text-ink">
          You have the vocabulary. Now go read a system you didn&apos;t build.
        </p>
        <a href="#task" className="btn-accent mt-3 inline-flex">
          Start the AppNexa system trace
        </a>
      </div>

      <TaskFlow />
    </div>
  );
}
