"use client";

import { TASK1, materialRefs } from "@/lib/route1";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { MaterialRefs } from "@/components/ui/MaterialRefs";
import { Info } from "@/components/icons/LineIcons";
import { CaseBrief } from "./CaseBrief";
import { FloorWalk } from "./FloorWalk";
import { FindingSort } from "./FindingSort";
import { DiagnosisBoard } from "./DiagnosisBoard";
import { PriorityPicker } from "./PriorityPicker";
import { RecapPanel } from "./RecapPanel";
import { WorkplaceReportDoc } from "./WorkplaceReportDoc";
import { useRoute1 } from "./useRoute1";
import { useWorkplaceReportData } from "./useWorkplaceReportData";
import { ExportBar } from "./ExportBar";

export function TaskFlow() {
  const r1 = useRoute1();
  const report = useWorkplaceReportData();

  return (
    <section id="task" className="space-y-10">
      <SectionHeading kicker={TASK1.kicker} title={TASK1.heading} intro={TASK1.intro} />

      <div className="flex items-start gap-3 rounded-xl border border-line bg-canvas p-4">
        <Info className="mt-0.5 h-4 w-4 shrink-0 text-ash" />
        <p className="text-caption text-ash">{TASK1.orderBanner}</p>
      </div>

      <CaseBrief />

      <div>
        <h3 className="text-h3 text-ink">{TASK1.stage1.heading}</h3>
        <p className="mt-1 text-caption text-ash">{TASK1.stage1.instructions}</p>

        <div id="r1-walk" className="mt-5 scroll-mt-24">
          <p className="text-caption font-semibold text-ink">{TASK1.stage1.part1.label}</p>
          <p className="mt-1 text-micro text-ash">{TASK1.stage1.part1.instructions}</p>
          <MaterialRefs refs={materialRefs(TASK1.stage1.part1.material)} />
          <div className="mt-4">
            <FloorWalk />
          </div>
        </div>

        <div id="r1-sort" className="mt-8 scroll-mt-24">
          <p className="text-caption font-semibold text-ink">{TASK1.stage1.part2.label}</p>
          <p className="mt-1 text-micro text-ash">{TASK1.stage1.part2.instructions}</p>
          <MaterialRefs refs={materialRefs(TASK1.stage1.part2.material)} />
          <div className="mt-4">
            <FindingSort />
          </div>
        </div>
      </div>

      <div id="r1-diagnose" className="scroll-mt-24">
        <h3 className="text-h3 text-ink">{TASK1.stage2.heading}</h3>
        <p className="mt-1 text-caption text-ash">{TASK1.stage2.instructions}</p>
        <MaterialRefs refs={materialRefs(TASK1.stage2.material)} />
        <div className="mt-4">
          <DiagnosisBoard />
        </div>
      </div>

      <div>
        <h3 className="text-h3 text-ink">{TASK1.stage3.heading}</h3>
        <p className="mt-1 text-caption text-ash">{TASK1.stage3.instructions}</p>

        <div id="r1-decide" className="mt-5 scroll-mt-24">
          <p className="text-caption font-semibold text-ink">{TASK1.stage3.part1.label}</p>
          <p className="mt-1 text-micro text-ash">{TASK1.stage3.part1.instructions}</p>
          <MaterialRefs refs={materialRefs(TASK1.stage3.part1.material)} />
          <div className="mt-4">
            <PriorityPicker />
          </div>
        </div>

        <div className="mt-8">
          <p className="text-caption font-semibold text-ink">{TASK1.stage3.part2.label}</p>
          <p className="mt-1 text-micro text-ash">{TASK1.stage3.part2.instructions}</p>
          <div className="mt-4 grid gap-5 lg:grid-cols-2">
            <div className="rounded-2xl border border-line bg-canvas p-5">
              <RecapPanel r1={r1} />
            </div>
            <div className="rounded-2xl border border-line bg-paper p-5">
              <WorkplaceReportDoc data={report} live />
            </div>
          </div>
        </div>
      </div>

      <ExportBar />
    </section>
  );
}
