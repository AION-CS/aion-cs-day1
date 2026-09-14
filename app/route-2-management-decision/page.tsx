import type { Metadata } from "next";
import { ROUTES } from "@/lib/routes";
import { BANNER, PAGE_INTRO } from "@/lib/route2";
import { LeafMark } from "@/components/chrome/Icons";
import { DismissibleBanner } from "@/components/ui/DismissibleBanner";
import { Material } from "@/components/route2/Material";
import { CaseBrief } from "@/components/route2/CaseBrief";
import { Task } from "@/components/route2/Task";
import { ExportBar } from "@/components/route2/ExportBar";
import { MentorTools } from "@/components/route2/MentorTools";

const ROUTE = ROUTES[1];

export const metadata: Metadata = {
  title: `AION Green IT — Day 12 · ${ROUTE.tag}`,
  description:
    "Level 3 for Module 8: NetSphere Industrial Systems GmbH's full reasoning chain from six management dimensions to one prioritised measure — then the Vertex Connected Industries Board Memo Builder.",
};

/**
 * Route 2 — level 3 (CLAUDE.md #12). The case once (NetSphere read-only in
 * the material, Vertex briefed once above the task), one material block, one
 * task, one export. Self-contained per §13 — reachable with Route 1 untouched.
 */
export default function Route2Page() {
  return (
    <div className="space-y-16 py-12">
      <MentorTools />

      <div className="max-w-prose">
        <p className="mb-2 flex items-center gap-2 text-micro font-semibold uppercase tracking-wide text-accent">
          <LeafMark className="h-4 w-4" /> {PAGE_INTRO.tag} — 2 of 2
        </p>
        <h1 className="text-display text-ink">{PAGE_INTRO.title}</h1>
        <p className="mt-4 text-body text-ash">{PAGE_INTRO.body}</p>
      </div>

      <DismissibleBanner storageKey="r2:bannerDismissed" label={BANNER.label} text={BANNER.text} />

      <Material />

      <div className="rounded-2xl border border-accent/30 bg-accentSoft p-6 text-center">
        <p className="text-body font-semibold text-ink">You have seen the reasoning. Now run it on a company you have never met.</p>
        <a href="#r2-case" className="btn-accent mt-3 inline-flex">
          Open the Vertex brief
        </a>
      </div>

      <div id="r2-case" className="scroll-mt-24">
        <CaseBrief />
      </div>

      <Task />

      <ExportBar />
    </div>
  );
}
