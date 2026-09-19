"use client";

import { SectionHeading } from "@/components/ui/SectionHeading";
import { MicroCard } from "@/components/ui/MicroCard";
import { MATERIAL2, MATERIAL2_INTRO, materialAnchorId } from "@/lib/route1";
import { PdcaLoop, ThreeLinesPreview, TradeoffTriangle } from "./MaterialDiagrams";

/** Material 2 — three cards, only what Task 2's prioritisation needs (CLAUDE.md §11a). */
export function Material2() {
  const [m5, m6, m7] = MATERIAL2;

  return (
    <div className="space-y-8">
      <SectionHeading kicker={MATERIAL2_INTRO.kicker} title={MATERIAL2_INTRO.title} intro={MATERIAL2_INTRO.intro} />

      <MicroCard card={m5} anchorId={materialAnchorId("pdcaLoop")} total={MATERIAL2.length}>
        <PdcaLoop />
      </MicroCard>

      <MicroCard card={m6} anchorId={materialAnchorId("tradeoffTriangle")} total={MATERIAL2.length}>
        <TradeoffTriangle />
      </MicroCard>

      <MicroCard card={m7} anchorId={materialAnchorId("threeLines")} total={MATERIAL2.length}>
        <ThreeLinesPreview />
      </MicroCard>
    </div>
  );
}
