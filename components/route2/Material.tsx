"use client";

import { SectionHeading } from "@/components/ui/SectionHeading";
import { MaterialBlock } from "@/components/ui/MaterialBlock";
import { MiniNav } from "@/components/ui/MiniNav";
import { MATERIAL, MATERIAL_NAV, SECTION_ORDER, materialAnchorId } from "@/lib/route2";
import { DecisionLayers, DecisionQuadrants, RaciDemo, WorkedExample } from "./MaterialDiagrams";

export const MATERIAL_TRACK_ID = "r2-material";

/**
 * Route 2's whole teaching block, A–D, read before the task — same layout as
 * Route 1: sticky mini-nav and progress bar, and per section the diagram before
 * the prose, then the decision rules, then sources.
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
        title="From a fix to a decision architecture"
        intro="Why efficiency and architecture are board questions at all; who is allowed to decide, in full RACI detail; how a decision holds together before the data is in; and a complete worked example from MetricFlow Digital Systems. The task assumes all four."
      />

      <MaterialBlock section={a} anchorId={materialAnchorId("board")}>
        <DecisionLayers />
      </MaterialBlock>

      <MaterialBlock section={b} anchorId={materialAnchorId("raci")}>
        <RaciDemo />
      </MaterialBlock>

      <MaterialBlock section={c} anchorId={materialAnchorId("uncertainty")}>
        <DecisionQuadrants />
      </MaterialBlock>

      <MaterialBlock section={d} anchorId={materialAnchorId("worked")}>
        <WorkedExample />
      </MaterialBlock>
    </div>
  );
}
