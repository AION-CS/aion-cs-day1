"use client";

import { SectionHeading } from "@/components/ui/SectionHeading";
import { MaterialBlock } from "@/components/ui/MaterialBlock";
import { MiniNav } from "@/components/ui/MiniNav";
import { MATERIAL, MATERIAL_MINUTES, MATERIAL_NAV, SECTION_ORDER, TRAILING_NAV, materialAnchorId } from "@/lib/route2";
import { scrollToAndFlash } from "@/lib/scrollToAndFlash";
import { RatioVsAbsolute } from "./diagrams/RatioVsAbsolute";
import { NetSphereMap } from "./diagrams/NetSphereMap";
import { DimensionCards, HeatStrip } from "./diagrams/HeatStrip";
import { LeverAccordion } from "./diagrams/LeverAccordion";
import { DecisionChain } from "./diagrams/DecisionChain";
import { RoadmapTimeline } from "./diagrams/RoadmapTimeline";
import { OpenerPanel, ReflectionJournal, RubricPreview } from "./diagrams/Framing";

export const MATERIAL_TRACK_ID = "r2-material";

/**
 * The whole teaching block: six sections, A–F, read before the task
 * (CLAUDE.md #12), followed by the rubric preview and the reflection journal.
 */
export function Material() {
  const [a, b, c, d, e, f] = MATERIAL;

  const navItems = [
    ...SECTION_ORDER.map((id) => ({ id, code: MATERIAL_NAV[id].code, label: MATERIAL_NAV[id].label, anchorId: materialAnchorId(id) })),
    ...TRAILING_NAV,
  ];

  return (
    <div id={MATERIAL_TRACK_ID} className="space-y-14">
      <MiniNav items={navItems} trackId={MATERIAL_TRACK_ID} />

      <SectionHeading
        kicker={`Material · six sections · about ${MATERIAL_MINUTES} minutes`}
        title="Senior case walkthrough: NetSphere Industrial Systems GmbH"
        intro="A complete reasoning chain on one company, including the recommended decision and why it beats the alternatives — study the structure of the argument, not the conclusion. The task afterwards belongs to a different company with different constraints."
      />

      <OpenerPanel />

      <MaterialBlock section={a} anchorId={materialAnchorId("management")}>
        <RatioVsAbsolute />
      </MaterialBlock>

      <MaterialBlock section={b} anchorId={materialAnchorId("map")}>
        <NetSphereMap />
      </MaterialBlock>

      <MaterialBlock section={c} anchorId={materialAnchorId("dimensions")}>
        <div className="space-y-8">
          <HeatStrip onJump={(id) => scrollToAndFlash(`r2-dimension-${id}`, "ref")} />
          <DimensionCards />
        </div>
      </MaterialBlock>

      <MaterialBlock section={d} anchorId={materialAnchorId("levers")}>
        <LeverAccordion />
      </MaterialBlock>

      <MaterialBlock section={e} anchorId={materialAnchorId("measure")}>
        <DecisionChain />
      </MaterialBlock>

      <MaterialBlock section={f} anchorId={materialAnchorId("roadmap")}>
        <RoadmapTimeline />
      </MaterialBlock>

      <RubricPreview />

      <ReflectionJournal />
    </div>
  );
}
