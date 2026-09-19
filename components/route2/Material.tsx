"use client";

import { SectionHeading } from "@/components/ui/SectionHeading";
import { MicroCard } from "@/components/ui/MicroCard";
import { MiniNav } from "@/components/ui/MiniNav";
import { MATERIAL, MATERIAL_INTRO, MATERIAL_NAV, MATERIAL_ORDER, materialAnchorId } from "@/lib/route2";
import { LeadershipInstrumentToggle, LayeredStaircase, TradeoffPentagon, RoleChips } from "./MaterialDiagrams";

export const MATERIAL_TRACK_ID = "r2-material";

/** The whole teaching block: four micro-cards, D1–D4, about 11 minutes. */
export function Material() {
  const [d1, d2, d3, d4] = MATERIAL;

  const navItems = MATERIAL_ORDER.map((id) => ({
    id,
    code: MATERIAL_NAV[id].code,
    label: MATERIAL_NAV[id].label,
    anchorId: materialAnchorId(id),
  }));

  return (
    <div id={MATERIAL_TRACK_ID} className="space-y-8">
      <MiniNav items={navItems} trackId={MATERIAL_TRACK_ID} />

      <SectionHeading kicker={MATERIAL_INTRO.kicker} title={MATERIAL_INTRO.title} intro={MATERIAL_INTRO.intro} />

      <MicroCard card={d1} anchorId={materialAnchorId("leadershipInstrument")} total={MATERIAL.length}>
        <LeadershipInstrumentToggle />
      </MicroCard>

      <MicroCard card={d2} anchorId={materialAnchorId("layeredModel")} total={MATERIAL.length}>
        <LayeredStaircase />
      </MicroCard>

      <MicroCard card={d3} anchorId={materialAnchorId("tradeoffPentagon")} total={MATERIAL.length}>
        <TradeoffPentagon />
      </MicroCard>

      <MicroCard card={d4} anchorId={materialAnchorId("rolePriorities")} total={MATERIAL.length}>
        <RoleChips />
      </MicroCard>
    </div>
  );
}
