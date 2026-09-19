import type { Metadata } from "next";
import { ROUTES } from "@/lib/routes";
import { MATERIAL1_ORDER, MATERIAL2_ORDER, MATERIAL_NAV, PAGE_INTRO, materialAnchorId } from "@/lib/route1";
import { LeafMark } from "@/components/chrome/Icons";
import { MiniNav } from "@/components/ui/MiniNav";
import { CaseBrief } from "@/components/route1/CaseBrief";
import { Material1 } from "@/components/route1/Material1";
import { Material2 } from "@/components/route1/Material2";
import { Task1 } from "@/components/route1/Task1";
import { Task2 } from "@/components/route1/Task2";
import { MentorTools } from "@/components/route1/MentorTools";

const R1_TRACK_ID = "r1-track";

/**
 * One combined mini-nav for both material blocks (M1–M7) — a separate
 * `MiniNav` per block would mount two fixed-position rails on the page at
 * once (both blocks live on the same scroll, not two separately-visited
 * pages), stacking their dots on top of each other.
 */
const MATERIAL_NAV_ITEMS = [...MATERIAL1_ORDER, ...MATERIAL2_ORDER].map((id) => ({
  id,
  code: MATERIAL_NAV[id].code,
  label: MATERIAL_NAV[id].label,
  anchorId: materialAnchorId(id),
}));

const ROUTE = ROUTES[0];

export const metadata: Metadata = {
  title: `AION Green IT — Day 16 · ${ROUTE.tag}`,
  description:
    "Why data collected isn't the same as data managed, the three metric layers, the six areas a Green IT metric system needs, and what makes a KPI management-effective — then Clarity Digital Services: diagnose scattered metrics, then prioritise which line of measures to build first under real uncertainty.",
};

/**
 * Route 1, Levels 1 and 2: two short material-then-task pairs, each with its
 * own export (task1.ts's file header explains why this route uses two
 * exports rather than CLAUDE.md §12's merged single export).
 */
export default function Route1Page() {
  return (
    <div id={R1_TRACK_ID} className="space-y-16 py-12">
      <MiniNav items={MATERIAL_NAV_ITEMS} trackId={R1_TRACK_ID} />
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

      <Material1 />

      <div className="rounded-2xl border border-accent/30 bg-accentSoft p-6 text-center">
        <p className="text-body font-semibold text-ink">
          That's Material 1. Now use it — ten signals from Clarity Digital Services, and the question of why the data isn't steering anything yet.
        </p>
        <a href="#task1" className="btn-accent mt-3 inline-flex">
          Start Task 1 — Diagnose
        </a>
      </div>

      <Task1 />

      <hr className="border-line" />

      <Material2 />

      <div className="rounded-2xl border border-accent/30 bg-accentSoft p-6 text-center">
        <p className="text-body font-semibold text-ink">
          That's Material 2. Now use it — three candidate lines of measures, and only one budget to fund first.
        </p>
        <a href="#task2" className="btn-accent mt-3 inline-flex">
          Start Task 2 — Decide
        </a>
      </div>

      <Task2 />
    </div>
  );
}
