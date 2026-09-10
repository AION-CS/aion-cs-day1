"use client";

import { TASK1 } from "@/lib/route1";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Info } from "@/components/icons/LineIcons";
import { CaseBrief } from "./CaseBrief";
import { BenefitRiskSort } from "./BenefitRiskSort";
import { WheelClassifier } from "./WheelClassifier";
import { StatementBuilder } from "./StatementBuilder";
import { RecapPanel } from "./RecapPanel";
import { DecisionReportDoc } from "./DecisionReportDoc";
import { useRoute1 } from "./useRoute1";
import { useDecisionReportData } from "./useDecisionReportData";
import { ExportBar } from "./ExportBar";

export function TaskFlow() {
  const r1 = useRoute1();
  const report = useDecisionReportData();

  return (
    <section id="task" className="space-y-10">
      <SectionHeading kicker={TASK1.kicker} title={TASK1.heading} intro={TASK1.intro} />

      <div className="flex items-start gap-3 rounded-xl border border-line bg-canvas p-4">
        <Info className="mt-0.5 h-4 w-4 shrink-0 text-ash" />
        <p className="text-caption text-ash">{TASK1.orderBanner}</p>
      </div>

      <div id="r1-stage1">
        <h3 className="text-h3 text-ink">{TASK1.stage1.heading}</h3>
        <p className="mt-1 text-caption text-ash">{TASK1.stage1.instructions}</p>
        <div className="mt-4">
          <CaseBrief />
        </div>
      </div>

      <div id="r1-stage2">
        <h3 className="text-h3 text-ink">{TASK1.stage2.heading}</h3>
        <p className="mt-1 text-caption text-ash">{TASK1.stage2.instructions}</p>
        <div className="mt-4">
          <BenefitRiskSort />
        </div>
      </div>

      <div id="r1-stage3">
        <h3 className="text-h3 text-ink">{TASK1.stage3.heading}</h3>
        <p className="mt-1 text-caption text-ash">{TASK1.stage3.instructions}</p>
        <div className="mt-4">
          <WheelClassifier />
        </div>
      </div>

      <div id="r1-stage4">
        <h3 className="text-h3 text-ink">{TASK1.stage4.heading}</h3>
        <p className="mt-1 text-caption text-ash">{TASK1.stage4.instructions}</p>
        <div className="mt-4">
          <StatementBuilder />
        </div>
      </div>

      <div id="r1-stage5">
        <h3 className="text-h3 text-ink">{TASK1.stage5.heading}</h3>
        <p className="mt-1 text-caption text-ash">{TASK1.stage5.instructions}</p>
        <div className="mt-4 grid gap-5 lg:grid-cols-2">
          <div className="rounded-2xl border border-line bg-canvas p-5">
            <RecapPanel r1={r1} />
          </div>
          <div className="rounded-2xl border border-line bg-paper p-5">
            <DecisionReportDoc data={report} live />
          </div>
        </div>
      </div>

      <ExportBar />
    </section>
  );
}
