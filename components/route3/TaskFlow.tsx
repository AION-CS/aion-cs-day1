"use client";

import { TASK3 } from "@/lib/route3";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Info } from "@/components/icons/LineIcons";
import { CaseBriefSkyBridge } from "./CaseBriefSkyBridge";
import { ArchitectureMapper } from "./ArchitectureMapper";
import { LeverPicker } from "./LeverPicker";
import { HorizonSequencer } from "./HorizonSequencer";
import { BridgeToHelix } from "./BridgeToHelix";
import { HelixProposalBuilder } from "./HelixProposalBuilder";
import { RecapPanel } from "./RecapPanel";
import { ManagementProposalDoc } from "./ManagementProposalDoc";
import { useRoute3 } from "./useRoute3";
import { useManagementReportData } from "./useManagementReportData";
import { ExportBar } from "./ExportBar";

export function TaskFlow() {
  const r3 = useRoute3();
  const report = useManagementReportData();

  return (
    <section id="task" className="space-y-10">
      <SectionHeading kicker={TASK3.kicker} title={TASK3.heading} intro={TASK3.intro} />

      <div className="flex items-start gap-3 rounded-xl border border-line bg-canvas p-4">
        <Info className="mt-0.5 h-4 w-4 shrink-0 text-ash" />
        <p className="text-caption text-ash">{TASK3.orderBanner}</p>
      </div>

      <div>
        <h3 className="text-h3 text-ink">{TASK3.group1.heading}</h3>
        <p className="mt-1 text-caption text-ash">{TASK3.group1.instructions}</p>

        <div id="r3-stage1" className="mt-5">
          <p className="text-caption font-semibold text-ink">{TASK3.stage1.heading}</p>
          <p className="mt-1 text-micro text-ash">{TASK3.stage1.instructions}</p>
          <div className="mt-4"><CaseBriefSkyBridge /></div>
        </div>

        <div id="r3-stage2" className="mt-6">
          <p className="text-caption font-semibold text-ink">{TASK3.stage2.heading}</p>
          <p className="mt-1 text-micro text-ash">{TASK3.stage2.instructions}</p>
          <div className="mt-4"><ArchitectureMapper /></div>
        </div>
      </div>

      <div>
        <h3 className="text-h3 text-ink">{TASK3.group2.heading}</h3>
        <p className="mt-1 text-caption text-ash">{TASK3.group2.instructions}</p>

        <div id="r3-stage3" className="mt-5">
          <p className="text-caption font-semibold text-ink">{TASK3.stage3.heading}</p>
          <p className="mt-1 text-micro text-ash">{TASK3.stage3.instructions}</p>
          <div className="mt-4"><LeverPicker /></div>
        </div>

        <div id="r3-stage4" className="mt-6">
          <p className="text-caption font-semibold text-ink">{TASK3.stage4.heading}</p>
          <p className="mt-1 text-micro text-ash">{TASK3.stage4.instructions}</p>
          <div className="mt-4"><HorizonSequencer /></div>
        </div>
      </div>

      <div>
        <h3 className="text-h3 text-ink">{TASK3.group3.heading}</h3>
        <p className="mt-1 text-caption text-ash">{TASK3.group3.instructions}</p>

        <div id="r3-stage5" className="mt-5"><BridgeToHelix /></div>

        <div id="r3-stage6" className="mt-6">
          <p className="text-caption font-semibold text-ink">{TASK3.stage6.heading}</p>
          <p className="mt-1 text-micro text-ash">{TASK3.stage6.instructions}</p>
          <div className="mt-4"><HelixProposalBuilder /></div>
        </div>

        <div id="r3-stage7" className="mt-6">
          <p className="text-caption font-semibold text-ink">{TASK3.stage7.heading}</p>
          <p className="mt-1 text-micro text-ash">{TASK3.stage7.instructions}</p>
          <div className="mt-4 grid gap-5 lg:grid-cols-2">
            <div className="rounded-2xl border border-line bg-canvas p-5"><RecapPanel r3={r3} /></div>
            <div className="rounded-2xl border border-line bg-paper p-5"><ManagementProposalDoc data={report} live /></div>
          </div>
        </div>
      </div>

      <ExportBar />
    </section>
  );
}
