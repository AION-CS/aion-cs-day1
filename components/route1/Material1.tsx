"use client";

import { SectionHeading } from "@/components/ui/SectionHeading";
import { MicroCard } from "@/components/ui/MicroCard";
import { MATERIAL1, MATERIAL1_INTRO, materialAnchorId } from "@/lib/route1";
import { DataVsManagementGauges, MetricLayersPyramid, SixAreaChips, SixGateFilter } from "./MaterialDiagrams";

/** Material 1 — four cards, only what Task 1's diagnosis needs (CLAUDE.md §11a). */
export function Material1() {
  const [m1, m2, m3, m4] = MATERIAL1;

  return (
    <div className="space-y-8">
      <SectionHeading kicker={MATERIAL1_INTRO.kicker} title={MATERIAL1_INTRO.title} intro={MATERIAL1_INTRO.intro} />

      <MicroCard card={m1} anchorId={materialAnchorId("dataVsManagement")} total={MATERIAL1.length}>
        <DataVsManagementGauges />
      </MicroCard>

      <MicroCard card={m2} anchorId={materialAnchorId("metricLayers")} total={MATERIAL1.length}>
        <MetricLayersPyramid />
      </MicroCard>

      <MicroCard card={m3} anchorId={materialAnchorId("sixAreas")} total={MATERIAL1.length}>
        <SixAreaChips />
      </MicroCard>

      <MicroCard card={m4} anchorId={materialAnchorId("effectiveVsStructural")} total={MATERIAL1.length}>
        <SixGateFilter />
      </MicroCard>
    </div>
  );
}
