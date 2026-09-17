"use client";

import { SectionHeading } from "@/components/ui/SectionHeading";
import { MaterialBlock } from "@/components/ui/MaterialBlock";
import { MiniNav } from "@/components/ui/MiniNav";
import { MATERIAL, MATERIAL_NAV, SECTION_ORDER, materialAnchorId } from "@/lib/route1";
import { AdoptionSimulator, CostBenefitScale, RegulatoryDriverMap, ThreeLensToggle } from "./MaterialDiagrams";

export const MATERIAL_TRACK_ID = "r1-material";

/**
 * The whole teaching block: four sections, S1–S4, read before any
 * interaction. ~60 minutes, per the build spec's time budget — this is
 * deliberately the fuller Day 11-style ratio, not Day 13's inverted one,
 * because Task 1 draws on six areas plus two extra tagging dimensions.
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
        kicker="Material · four sections · about 60 minutes"
        title="Why sensible Green IT measures stall"
        intro="Why economic assessment decides whether a measure survives a budget conversation; why ROI needs three lenses, not one; why a technically correct measure still fails without behavioural design behind it; and why regulation works better as a management framework than as a burden imposed on IT. All of it before you touch the case — Task 1 assumes every section below."
      />

      <MaterialBlock section={s1} anchorId={materialAnchorId("businessCase")}>
        <CostBenefitScale />
      </MaterialBlock>

      <MaterialBlock section={s2} anchorId={materialAnchorId("threeLens")}>
        <ThreeLensToggle />
      </MaterialBlock>

      <MaterialBlock section={s3} anchorId={materialAnchorId("behaviourChange")}>
        <AdoptionSimulator />
      </MaterialBlock>

      <MaterialBlock section={s4} anchorId={materialAnchorId("regulation")}>
        <RegulatoryDriverMap />
      </MaterialBlock>
    </div>
  );
}
