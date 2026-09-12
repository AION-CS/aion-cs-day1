"use client";

import { TASK3, materialRefs } from "@/lib/route3";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { MaterialRefs } from "@/components/ui/MaterialRefs";
import { Info } from "@/components/icons/LineIcons";
import { CaseBrief } from "./CaseBrief";
import { FrameAndChoose } from "./FrameAndChoose";
import { RuleBench } from "./RuleBench";
import { AccountabilityBoard } from "./AccountabilityBoard";
import { RecapPanel } from "./RecapPanel";
import { ProposalDoc } from "./ProposalDoc";
import { useRoute3 } from "./useRoute3";
import { useProposalData } from "./useProposalData";
import { ExportBar } from "./ExportBar";

export function TaskFlow() {
  const r3 = useRoute3();
  const data = useProposalData();

  return (
    <section id="task" className="space-y-10">
      <SectionHeading kicker={TASK3.kicker} title={TASK3.heading} intro={TASK3.intro} />

      <div className="flex items-start gap-3 rounded-xl border border-line bg-canvas p-4">
        <Info className="mt-0.5 h-4 w-4 shrink-0 text-ash" />
        <p className="text-caption text-ash">{TASK3.orderBanner}</p>
      </div>

      <CaseBrief />

      <div>
        <h3 className="text-h3 text-ink">{TASK3.stage1.heading}</h3>
        <p className="mt-1 text-caption text-ash">{TASK3.stage1.instructions}</p>
        <MaterialRefs refs={materialRefs(TASK3.stage1.material)} />
        <div className="mt-4">
          <FrameAndChoose />
        </div>
      </div>

      <div>
        <h3 className="text-h3 text-ink">{TASK3.stage2.heading}</h3>
        <p className="mt-1 text-caption text-ash">{TASK3.stage2.instructions}</p>
        <MaterialRefs refs={materialRefs(TASK3.stage2.material)} />
        <div className="mt-4">
          <RuleBench />
        </div>
      </div>

      <div>
        <h3 className="text-h3 text-ink">{TASK3.stage3.heading}</h3>
        <p className="mt-1 text-caption text-ash">{TASK3.stage3.instructions}</p>
        <MaterialRefs refs={materialRefs(TASK3.stage3.material)} />
        <div className="mt-4">
          <AccountabilityBoard />
        </div>
      </div>

      <div>
        <p className="text-caption font-semibold text-ink">Live board memo</p>
        <p className="mt-1 text-micro text-ash">
          A read-only recap of everything above, and the document it produces — ready to export once every stage is
          complete.
        </p>
        <div className="mt-4 grid gap-5 lg:grid-cols-2">
          <div className="rounded-2xl border border-line bg-canvas p-5">
            <RecapPanel r3={r3} />
          </div>
          <div className="rounded-2xl border border-line bg-paper p-5">
            <ProposalDoc data={data} live />
          </div>
        </div>
      </div>

      <ExportBar />
    </section>
  );
}
