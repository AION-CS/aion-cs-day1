import type { Metadata } from "next";
import { ROUTES } from "@/lib/routes";
import { PAGE_INTRO } from "@/lib/route1";
import { LeafMark } from "@/components/chrome/Icons";
import { CaseBrief } from "@/components/route1/CaseBrief";
import { Material } from "@/components/route1/Material";
import { Task } from "@/components/route1/Task";
import { ExportBar } from "@/components/route1/ExportBar";
import { MentorTools } from "@/components/route1/MentorTools";

const ROUTE = ROUTES[0];

export const metadata: Metadata = {
  title: `AION Green IT — Day 15 · ${ROUTE.tag}`,
  description:
    "Why novelty is not innovation, AI as both efficiency promise and resource burden, circular versus linear IT, the seven assessment lenses and dimensions, deciding under uncertainty, enabler versus point-solution leverage, and attractive-but-weak failure modes — then FutureGrid Technologies: diagnose six innovation initiatives, then prioritise whole lines of measures under a limited budget.",
};

/**
 * Route 1, Levels 1 and 2: the case once, nine material micro-cards, one task
 * on a single scroll — Part 1 Diagnose → inline handover → Part 2 Decide —
 * then one export bar covering everything above it (CLAUDE.md §12).
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
          That is the whole teaching block. Now use it — six initiatives, and the question of which are genuinely
          sustainable.
        </p>
        <a href="#task" className="btn-accent mt-3 inline-flex">
          Start the FutureGrid diagnosis
        </a>
      </div>

      <Task />

      <ExportBar />
    </div>
  );
}
