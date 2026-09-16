"use client";

import { SectionHeading } from "@/components/ui/SectionHeading";
import { MaterialBlock } from "@/components/ui/MaterialBlock";
import { MiniNav } from "@/components/ui/MiniNav";
import { MATERIAL, MATERIAL_NAV, SECTION_ORDER, materialAnchorId } from "@/lib/route2";
import { DecisionLayers, DecisionQuadrants, PrioritiseLanes, RaciDemo, WorkedExample } from "./MaterialDiagrams";

export const MATERIAL_TRACK_ID = "r2-material";

/**
 * Route 2's whole teaching block, A–D, read before the task — same layout as
 * Route 1: sticky mini-nav and progress bar, and per section the diagram
 * before the prose, then the decision rules, then sources.
 *
 * The EcoFlow worked example renders directly after D, outside any
 * MaterialBlock — it is read-only and not one of the "four sections" (see
 * lib/route2/sections.ts), so it never appears dressed as graded material.
 */
export function Material() {
  const [a, b, c, d] = MATERIAL;

  const navItems = SECTION_ORDER.map((id) => ({
    id,
    code: MATERIAL_NAV[id].code,
    label: MATERIAL_NAV[id].label,
    anchorId: materialAnchorId(id),
  }));

  return (
    <div id={MATERIAL_TRACK_ID} className="space-y-14">
      <MiniNav items={navItems} trackId={MATERIAL_TRACK_ID} />

      <SectionHeading
        kicker="Material · four sections · about 60 minutes"
        title="From individual choices to a decision architecture"
        intro="Why digitalisation reaches a board at all; the three lanes competing for the same budget and the trade-offs each one hides; who is allowed to decide, in full RACI detail; and how a decision holds together before the data is in. The task assumes all four — then a complete worked example from EcoFlow Administration GmbH."
      />

      <MaterialBlock section={a} anchorId={materialAnchorId("board")}>
        <DecisionLayers />
      </MaterialBlock>

      <MaterialBlock section={b} anchorId={materialAnchorId("prioritise")}>
        <PrioritiseLanes />
      </MaterialBlock>

      <MaterialBlock section={c} anchorId={materialAnchorId("governance")}>
        <RaciDemo />
      </MaterialBlock>

      <MaterialBlock section={d} anchorId={materialAnchorId("uncertainty")}>
        <DecisionQuadrants />
      </MaterialBlock>

      <div id={materialAnchorId("worked")} className="scroll-mt-24 space-y-3">
        <div>
          <p className="text-micro font-semibold uppercase tracking-wide text-ash">A complete reasoning, start to finish</p>
          <h2 className="text-h2 text-ink">Worked example: EcoFlow Administration GmbH</h2>
          <p className="mt-1 max-w-prose text-body text-ash">
            Read-only. The model you reason from — on a company you will not be tested on. Do not transfer EcoFlow&apos;s
            answer to Synervia; transfer the shape: couple assessment to a structural decision, sequence it across
            three horizons, and make one thing binding rather than many things recommended.
          </p>
        </div>
        <WorkedExample />
      </div>
    </div>
  );
}
