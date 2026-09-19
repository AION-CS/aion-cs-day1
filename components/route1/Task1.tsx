"use client";

import { SectionHeading } from "@/components/ui/SectionHeading";
import { LivePanel } from "@/components/ui/LivePanel";
import { CONTEXT_CHIPS_T1, TASK1_FRAMING, WORK_ASSIGNMENT_T1 } from "@/lib/route1";
import { DiagnosisBoard } from "./DiagnosisBoard";
import { EffectivenessSort, HorizonSort } from "./ClassifyTasks";
import { ReportPanel1 } from "./ReportPanel1";
import { ExportBar1 } from "./ExportBar1";
import { useRoute1, domId } from "./useRoute1";

/** Task 1, in full: three stages on one continuous scroll, its own live report and its own export. */
export function Task1() {
  const r1 = useRoute1();

  return (
    <section id={domId.task1} className="scroll-mt-24 space-y-6">
      <SectionHeading kicker={`${TASK1_FRAMING.tag} · about ${TASK1_FRAMING.minutes} minutes`} title={TASK1_FRAMING.title} />

      <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_340px]">
        <div className="min-w-0 space-y-6">
          <div className="rounded-2xl border border-accent/30 bg-accentSoft/60 p-5">
            <p className="text-body font-semibold text-ink">{TASK1_FRAMING.lead}</p>
            <p className="mt-2 max-w-prose text-body text-ash">{TASK1_FRAMING.instruction}</p>
          </div>

          <div className="rounded-2xl border border-line bg-paper p-5">
            <p className="text-micro font-semibold uppercase tracking-wide text-ash">Where Clarity stands today</p>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {CONTEXT_CHIPS_T1.map((chip) => (
                <span key={chip} className="rounded-full border border-line bg-canvas px-2.5 py-1 text-micro text-ink">
                  {chip}
                </span>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-line bg-canvas p-5">
            <p className="text-micro font-semibold uppercase tracking-wide text-ash">Your work</p>
            <ol className="mt-2 list-decimal space-y-1.5 pl-5">
              {WORK_ASSIGNMENT_T1.map((step, i) => (
                <li key={i} className="text-caption text-ink">
                  {step}
                </li>
              ))}
            </ol>
          </div>

          <div>
            <p className="mb-2 text-micro font-semibold uppercase tracking-wide text-accent">Stage A — Diagnose</p>
            <DiagnosisBoard />
          </div>

          <div>
            <p className="mb-2 text-micro font-semibold uppercase tracking-wide text-accent">Stage B — Informative vs management-effective</p>
            <EffectivenessSort />
          </div>

          <div>
            <p className="mb-2 text-micro font-semibold uppercase tracking-wide text-accent">Stage C — Short-term vs structural</p>
            <HorizonSort />
          </div>
        </div>

        <LivePanel title="Metrics Diagnosis" summary={`${r1.placedCount}/${r1.totalSignals} placed · ${r1.metricsAnswered}/${r1.metricStates.length} classified`}>
          <ReportPanel1 />
        </LivePanel>
      </div>

      <ExportBar1 />
    </section>
  );
}
