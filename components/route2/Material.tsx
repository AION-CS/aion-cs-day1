"use client";

import { SectionHeading } from "@/components/ui/SectionHeading";
import { MaterialBlock } from "@/components/ui/MaterialBlock";
import { MiniNav } from "@/components/ui/MiniNav";
import { MATERIAL, MATERIAL_NAV, SECTION_ORDER, materialAnchorId } from "@/lib/route2";
import { CriteriaOverview, OwnershipAndReversibilityDemo } from "./MaterialDiagrams";

export const MATERIAL_TRACK_ID = "r2-material";

/**
 * Two lean sections, ~45–50 minutes combined — every sentence here exists
 * because Task Part 1 or Part 2 needs it directly (see lib/route2/material.ts).
 */
export function Material() {
  const [s1, s2] = MATERIAL;

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
        kicker="Material · two sections · about 45–50 minutes"
        title="Only what the task needs"
        intro="Four criteria that decide which measure-line gets funded first, and the two questions that turn a priority into an actionable, decision-ready proposal. Nothing else — try the practice widgets below before you build the real ones in the task."
      />

      <MaterialBlock section={s1} anchorId={materialAnchorId("criteria")}>
        <CriteriaOverview />
      </MaterialBlock>

      <MaterialBlock section={s2} anchorId={materialAnchorId("ownership")}>
        <OwnershipAndReversibilityDemo />
      </MaterialBlock>
    </div>
  );
}
