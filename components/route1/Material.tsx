"use client";

import { SectionHeading } from "@/components/ui/SectionHeading";
import { MaterialBlock } from "@/components/ui/MaterialBlock";
import { MiniNav } from "@/components/ui/MiniNav";
import { MATERIAL, MATERIAL_NAV, SECTION_ORDER, materialAnchorId } from "@/lib/route1";
import { AreaFramework, ImpactLayers, LeverMap, ReboundCurve } from "./MaterialDiagrams";

export const MATERIAL_TRACK_ID = "r1-material";

/**
 * The whole teaching block: four sections, S1–S4, read before any
 * interaction. ~30 minutes — Day 13 deliberately spends less time here than
 * Day 11's ~60 (see lib/route1/sections.ts), which is why there are four
 * sections instead of five and no separate stage after the task.
 */
export function Material() {
  const [s1, s2, s3, s4] = MATERIAL;

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
        kicker="Material · four sections · about 30 minutes"
        title="A lever that can move either way"
        intro="The five mechanisms that make digitalisation a genuine sustainability lever; the line between what a system itself consumes and what changes around it; why an efficiency gain doesn't automatically stay banked; and the six-area framework that sorts a finding before it can be acted on. All of it before you touch the case — the task assumes every section below."
      />

      <MaterialBlock section={s1} anchorId={materialAnchorId("lever")}>
        <LeverMap />
      </MaterialBlock>

      <MaterialBlock section={s2} anchorId={materialAnchorId("impact")}>
        <ImpactLayers />
      </MaterialBlock>

      <MaterialBlock section={s3} anchorId={materialAnchorId("rebound")}>
        <ReboundCurve />
      </MaterialBlock>

      <MaterialBlock section={s4} anchorId={materialAnchorId("framework")}>
        <AreaFramework />
      </MaterialBlock>
    </div>
  );
}
