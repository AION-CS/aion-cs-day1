"use client";

import { TASK2, materialRefs } from "@/lib/route2";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { MaterialRefs } from "@/components/ui/MaterialRefs";
import { Info } from "@/components/icons/LineIcons";
import { CaseBrief } from "./CaseBrief";
import { EvidenceAudit } from "./EvidenceAudit";
import { ScoringMatrix } from "./ScoringMatrix";
import { ConstraintTest } from "./ConstraintTest";
import { DecisionCommit } from "./DecisionCommit";
import { RecapPanel } from "./RecapPanel";
import { MemoDoc } from "./MemoDoc";
import { useRoute2 } from "./useRoute2";
import { useMemoData } from "./useMemoData";
import { ExportBar } from "./ExportBar";

export function TaskFlow() {
  const r2 = useRoute2();
  const memo = useMemoData();

  return (
    <section id="task" className="space-y-10">
      <SectionHeading kicker={TASK2.kicker} title={TASK2.heading} intro={TASK2.intro} />

      <div className="flex items-start gap-3 rounded-xl border border-line bg-canvas p-4">
        <Info className="mt-0.5 h-4 w-4 shrink-0 text-ash" />
        <p className="text-caption text-ash">{TASK2.orderBanner}</p>
      </div>

      <CaseBrief />

      <div id="r2-evidence" className="scroll-mt-24">
        <h3 className="text-h3 text-ink">{TASK2.stage1.heading}</h3>
        <p className="mt-1 text-caption text-ash">{TASK2.stage1.instructions}</p>
        <MaterialRefs refs={materialRefs(TASK2.stage1.material)} />
        <div className="mt-4">
          <EvidenceAudit />
        </div>
      </div>

      <div className="scroll-mt-24">
        <h3 className="text-h3 text-ink">{TASK2.stage2.heading}</h3>
        <p className="mt-1 text-caption text-ash">{TASK2.stage2.instructions}</p>
        <MaterialRefs refs={materialRefs(TASK2.stage2.material)} />
        <div className="mt-4">
          <ScoringMatrix />
        </div>
      </div>

      <div id="r2-constraints" className="scroll-mt-24">
        <h3 className="text-h3 text-ink">{TASK2.stage3.heading}</h3>
        <p className="mt-1 text-caption text-ash">{TASK2.stage3.instructions}</p>
        <MaterialRefs refs={materialRefs(TASK2.stage3.material)} />
        <div className="mt-4">
          <ConstraintTest />
        </div>
        <div className="mt-6">
          <DecisionCommit />
        </div>
      </div>

      <div>
        <p className="text-caption font-semibold text-ink">Live memo</p>
        <p className="mt-1 text-micro text-ash">
          A read-only recap of everything above, and the document it produces — ready to export once every stage is
          complete.
        </p>
        <div className="mt-4 grid gap-5 lg:grid-cols-2">
          <div className="rounded-2xl border border-line bg-canvas p-5">
            <RecapPanel r2={r2} />
          </div>
          <div className="rounded-2xl border border-line bg-paper p-5">
            <MemoDoc data={memo} live />
          </div>
        </div>
      </div>

      <ExportBar />
    </section>
  );
}
