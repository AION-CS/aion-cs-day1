"use client";

import { SectionHeading } from "@/components/ui/SectionHeading";
import { LivePanel } from "@/components/ui/LivePanel";
import { MaterialRefs } from "@/components/ui/MaterialRefs";
import { EXPORT, TASK_INTRO, materialRefs } from "@/lib/route2";
import { VertexConditionsRail } from "./CaseBrief";
import { RelevanceSection } from "./RelevanceSection";
import { GuidingDecisionsSection } from "./GuidingDecisionsSection";
import { DecisionLogicSection } from "./DecisionLogicSection";
import { TradeOffSection } from "./TradeOffSection";
import { FirstMeasureSection } from "./FirstMeasureSection";
import { GovernanceSection } from "./GovernanceSection";
import { DecisionNowSection } from "./DecisionNowSection";
import { CheckMemo } from "./CheckMemo";
import { SelfAssessment } from "./SelfAssessment";
import { MemoPreview } from "./MemoPreview";
import { useRoute2, domId } from "./useRoute2";

/**
 * The task — seven input sections on the left (with the Vertex conditions
 * rail above them, always visible per §8.1), the live Board Memo preview on
 * the right via LivePanel (a sticky column on desktop, a tap-to-expand strip
 * on mobile — always reachable, never gated behind completion, CLAUDE.md #6).
 */
export function Task() {
  const r2 = useRoute2();
  const draftedCount = Object.values(r2.drafted).filter(Boolean).length;

  return (
    <section id={domId.task} className="scroll-mt-24 space-y-6">
      <SectionHeading kicker={`${TASK_INTRO.tag} · about ${TASK_INTRO.minutes} minutes`} title={TASK_INTRO.title} />
      <MaterialRefs refs={materialRefs(TASK_INTRO.materialRefs)} lead="This task draws on" />

      <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_380px]">
        <div className="min-w-0 space-y-6">
          <VertexConditionsRail />
          <RelevanceSection r2={r2} />
          <GuidingDecisionsSection r2={r2} />
          <DecisionLogicSection r2={r2} />
          <TradeOffSection r2={r2} />
          <FirstMeasureSection r2={r2} />
          <GovernanceSection r2={r2} />
          <DecisionNowSection r2={r2} />
          <CheckMemo r2={r2} />
          <SelfAssessment r2={r2} />
        </div>

        <LivePanel title={EXPORT.docHeading} summary={`${draftedCount} of 8 memo sections drafted`}>
          <MemoPreview r2={r2} />
        </LivePanel>
      </div>
    </section>
  );
}
