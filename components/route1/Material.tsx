"use client";

import { SectionHeading } from "@/components/ui/SectionHeading";
import { MaterialBlock } from "@/components/ui/MaterialBlock";
import { MiniNav } from "@/components/ui/MiniNav";
import { MATERIAL, MATERIAL_NAV, SECTION_ORDER, materialAnchorId } from "@/lib/route1";
import {
  ArchitectureShift,
  CouplingVenn,
  LeverPills,
  LoadCurve,
  ObservationWheel,
  PostureCompare,
  TradeoffPentagon,
} from "./MaterialDiagrams";

export const MATERIAL_TRACK_ID = "r1-material";

/**
 * The whole teaching block: five sections, S1–S5, read before any interaction.
 *
 * Day 11 puts all the material in front of the task rather than splitting it
 * either side of a stage. The task's two parts then run as one continuous
 * scroll, and the MaterialRefs chips on each step are what carry a learner back
 * to the section they need — which is why the mini-nav and the anchors matter
 * more here than in a route with material interleaved.
 */
export function Material() {
  const [s1, s2, s3, s4, s5] = MATERIAL;

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
        kicker="Material · five sections · about 60 minutes"
        title="Seeing the waste, and deciding what to do about it"
        intro="Monitoring read with an efficiency lens; the four bands a load curve divides into; the architecture levers that actually move consumption; the five-way trade-off every decision sits inside; and why the two halves have to be decided together. All of it before you touch the case — the task assumes every section below."
      />

      <MaterialBlock section={s1} anchorId={materialAnchorId("monitoring")}>
        <div className="space-y-6">
          <ObservationWheel />
          <PostureCompare />
        </div>
      </MaterialBlock>

      <MaterialBlock section={s2} anchorId={materialAnchorId("load")}>
        <LoadCurve />
      </MaterialBlock>

      <MaterialBlock section={s3} anchorId={materialAnchorId("architecture")}>
        <div className="space-y-6">
          <ArchitectureShift />
          <LeverPills />
        </div>
      </MaterialBlock>

      <MaterialBlock section={s4} anchorId={materialAnchorId("tradeoff")}>
        <TradeoffPentagon />
      </MaterialBlock>

      <MaterialBlock section={s5} anchorId={materialAnchorId("coupling")}>
        <CouplingVenn />
      </MaterialBlock>
    </div>
  );
}
