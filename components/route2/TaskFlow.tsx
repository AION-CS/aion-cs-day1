"use client";

import { TASK2, CRITERIA } from "@/lib/route2";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Info } from "@/components/icons/LineIcons";
import { CaseBrief } from "./CaseBrief";
import { CriterionCard } from "./CriterionCard";
import { PrioritizationRadar } from "./PrioritizationRadar";
import { MakeTheCall } from "./MakeTheCall";
import { FollowUpDecisions } from "./FollowUpDecisions";
import { TwoRisks } from "./TwoRisks";
import { ReflectionStage } from "./ReflectionStage";
import { RecapPanel } from "./RecapPanel";
import { DecisionMemoDoc } from "./DecisionMemoDoc";
import { useRoute2 } from "./useRoute2";
import { useDecisionMemoData } from "./useDecisionMemoData";
import { ExportBar } from "./ExportBar";

export function TaskFlow() {
  const r2 = useRoute2();
  const memo = useDecisionMemoData();

  return (
    <section id="task" className="space-y-10">
      <SectionHeading kicker={TASK2.kicker} title={TASK2.heading} intro={TASK2.intro} />

      <div className="flex items-start gap-3 rounded-xl border border-line bg-canvas p-4">
        <Info className="mt-0.5 h-4 w-4 shrink-0 text-ash" />
        <p className="text-caption text-ash">{TASK2.orderBanner}</p>
      </div>

      <div id="r2-stage1">
        <h3 className="text-h3 text-ink">{TASK2.stage1.heading}</h3>
        <p className="mt-1 text-caption text-ash">{TASK2.stage1.instructions}</p>
        <div className="mt-4">
          <CaseBrief />
        </div>
      </div>

      <div id="r2-stage2" className="lg:grid lg:grid-cols-[1fr_360px] lg:items-start lg:gap-8">
        <div>
          <h3 className="text-h3 text-ink">{TASK2.stage2.heading}</h3>
          <p className="mt-1 text-caption text-ash">{TASK2.stage2.instructions}</p>
          <div className="mt-4 space-y-4">
            {CRITERIA.map((c) => (
              <CriterionCard key={c.id} criterion={c} />
            ))}
          </div>
        </div>
        <div className="mt-6 lg:mt-0 lg:sticky lg:top-20">
          <PrioritizationRadar />
        </div>
      </div>

      <div id="r2-stage3">
        <h3 className="text-h3 text-ink">{TASK2.stage3.heading}</h3>
        <p className="mt-1 text-caption text-ash">{TASK2.stage3.instructions}</p>
        <div className="mt-4">
          <MakeTheCall />
        </div>
      </div>

      <div id="r2-stage4">
        <h3 className="text-h3 text-ink">{TASK2.stage4.heading}</h3>
        <p className="mt-1 text-caption text-ash">{TASK2.stage4.instructions}</p>
        <div className="mt-4">
          <FollowUpDecisions />
        </div>
      </div>

      <div id="r2-stage5">
        <h3 className="text-h3 text-ink">{TASK2.stage5.heading}</h3>
        <p className="mt-1 text-caption text-ash">{TASK2.stage5.instructions}</p>
        <div className="mt-4">
          <TwoRisks />
        </div>
      </div>

      <div id="r2-stage6">
        <h3 className="text-h3 text-ink">{TASK2.stage6.heading}</h3>
        <p className="mt-1 text-caption text-ash">{TASK2.stage6.instructions}</p>
        <div className="mt-4">
          <ReflectionStage />
        </div>
      </div>

      <div id="r2-stage7">
        <h3 className="text-h3 text-ink">{TASK2.stage7.heading}</h3>
        <p className="mt-1 text-caption text-ash">{TASK2.stage7.instructions}</p>
        <div className="mt-4 grid gap-5 lg:grid-cols-2">
          <div className="rounded-2xl border border-line bg-canvas p-5">
            <RecapPanel r2={r2} />
          </div>
          <div className="rounded-2xl border border-line bg-paper p-5">
            <DecisionMemoDoc data={memo} live />
          </div>
        </div>
      </div>

      <ExportBar />
    </section>
  );
}
