"use client";

import { SectionHeading } from "@/components/ui/SectionHeading";
import { MicroCard } from "@/components/ui/MicroCard";
import { CRITERIA, MATERIAL2, MATERIAL2_INTRO, materialAnchorId } from "@/lib/route1";
import { PdcaLoop, ThreeLinesPreview, TradeoffTriangle } from "./MaterialDiagrams2";

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

      <MicroCard card={m7} anchorId={materialAnchorId("threeLines")} total={MATERIAL2.length} extra={<CriteriaGuide />}>
        <ThreeLinesPreview />
      </MicroCard>
    </div>
  );
}

/** The seven criteria Task 2 rates each line on — defined here, before the task uses them. */
function CriteriaGuide() {
  return (
    <div className="max-w-prose space-y-2">
      <h3 className="text-h3 text-ink">The seven criteria Task 2 uses</h3>
      <p className="text-caption text-ash">Each is rated Low, Medium or High per line. Six read “higher is stronger”; risk reads in reverse.</p>
      <dl className="space-y-2">
        {CRITERIA.map((c) => (
          <div key={c.id} className="rounded-lg border border-line bg-paper p-2.5">
            <dt className="text-caption font-semibold text-ink">
              {c.name}
              {c.direction === "higherRiskier" && <span className="ml-1.5 rounded-full border border-warn/40 px-1.5 py-px text-[10px] uppercase tracking-wide text-warn">reads in reverse</span>}
            </dt>
            <dd className="text-micro text-ash">{c.definition}</dd>
            <dd className="mt-0.5 text-micro text-ink">Ask: {c.question.label}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
