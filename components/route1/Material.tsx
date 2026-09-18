"use client";

import { SectionHeading } from "@/components/ui/SectionHeading";
import { MicroCard } from "@/components/ui/MicroCard";
import { MiniNav } from "@/components/ui/MiniNav";
import {
  MATERIAL,
  MATERIAL_INTRO,
  MATERIAL_NAV,
  SECTION_ORDER,
  materialAnchorId,
} from "@/lib/route1";
import {
  AiBalanceScale,
  AttractiveVsViable,
  CircularVsLinear,
  LensWheel,
  NoveltyVsImpactFork,
} from "./MaterialDiagrams";

export const MATERIAL_TRACK_ID = "r1-material";

/**
 * The whole teaching block: five micro-cards, C1–C5, about ten minutes of
 * reading. Deliberately the light end of the material budget — Day 15 puts
 * the learning inside the task, so each card is a few sentences, one live
 * diagram, and the rule the task will ask for.
 */
export function Material() {
  const [c1, c2, c3, c4, c5] = MATERIAL;

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

      <MicroCard card={c1} anchorId={materialAnchorId("novelty")}>
        <NoveltyVsImpactFork />
      </MicroCard>

      <MicroCard card={c2} anchorId={materialAnchorId("aiLoad")}>
        <AiBalanceScale />
      </MicroCard>

      <MicroCard card={c3} anchorId={materialAnchorId("circular")}>
        <CircularVsLinear />
      </MicroCard>

      <MicroCard card={c4} anchorId={materialAnchorId("lenses")}>
        <LensWheel />
      </MicroCard>

      <MicroCard card={c5} anchorId={materialAnchorId("viability")}>
        <AttractiveVsViable />
      </MicroCard>
    </div>
  );
}
