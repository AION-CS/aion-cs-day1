"use client";

import { SectionHeading } from "@/components/ui/SectionHeading";
import { MicroCard } from "@/components/ui/MicroCard";
import { MiniNav } from "@/components/ui/MiniNav";
import { MATERIAL, MATERIAL_INTRO, MATERIAL_NAV, SECTION_ORDER, WORKED_EXAMPLE, materialAnchorId } from "@/lib/route2";
import { AssessmentFunnel, GovernanceLoop, ScatteredVsRouted, TimeHorizonBands } from "./MaterialDiagrams";

export const MATERIAL_TRACK_ID = "r2-material";

/**
 * The whole teaching block: four micro-cards, D1–D4, about 15 minutes, ending
 * in a read-only worked example on a different company (CircularMind) from
 * the one Task 3 assesses (NovaCircular) — CURRICULUM-GUIDE.md §2.
 */
export function Material() {
  const [d1, d2, d3, d4] = MATERIAL;

  const navItems = SECTION_ORDER.map((id) => ({
    id,
    code: MATERIAL_NAV[id].code,
    label: MATERIAL_NAV[id].label,
    anchorId: materialAnchorId(id),
  }));

  return (
    <div id={MATERIAL_TRACK_ID} className="space-y-8">
      <MiniNav items={navItems} trackId={MATERIAL_TRACK_ID} />

      <SectionHeading kicker={MATERIAL_INTRO.kicker} title={MATERIAL_INTRO.title} intro={MATERIAL_INTRO.intro} />

      <MicroCard card={d1} anchorId={materialAnchorId("architecture")}>
        <ScatteredVsRouted />
      </MicroCard>

      <MicroCard card={d2} anchorId={materialAnchorId("assessmentLogic")}>
        <AssessmentFunnel />
      </MicroCard>

      <MicroCard card={d3} anchorId={materialAnchorId("governance")}>
        <GovernanceLoop />
      </MicroCard>

      <MicroCard card={d4} anchorId={materialAnchorId("horizons")}>
        <TimeHorizonBands />
      </MicroCard>

      {/* Read-only worked example — visually distinct, a different company from the one Task 3 assesses. */}
      <div className="rounded-2xl bg-slate p-6 text-paper">
        <p className="text-micro font-semibold uppercase tracking-wide text-paper/60">{WORKED_EXAMPLE.heading}</p>
        <h3 className="mt-1 text-h3 text-paper">{WORKED_EXAMPLE.company}</h3>
        <p className="mt-2 max-w-prose text-body text-paper/80">{WORKED_EXAMPLE.body}</p>
      </div>
    </div>
  );
}
