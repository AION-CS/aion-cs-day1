"use client";

import { SectionHeading } from "@/components/ui/SectionHeading";
import { LivePanel } from "@/components/ui/LivePanel";
import { MaterialRefs } from "@/components/ui/MaterialRefs";
import { AnswerKey } from "@/components/ui/AnswerKey";
import { ANSWER_KEY, CONTEXT_CHIPS, TASK_FRAMING, TASK_MATERIAL_REFS, materialRefs } from "@/lib/route2";
import { StageFrame } from "./StageFrame";
import { StageGuiding } from "./StageGuiding";
import { StageSequence } from "./StageSequence";
import { StageAllocate } from "./StageAllocate";
import { StageGovernance } from "./StageGovernance";
import { ReportPanel } from "./ReportPanel";
import { ExportBar } from "./ExportBar";
import { useRoute2, domId } from "./useRoute2";

/** The whole task, one continuous scroll across five stages, its live memo assembling beside it. */
export function Task() {
  const r2 = useRoute2();

  return (
    <section id={domId.task} className="scroll-mt-24 space-y-6">
      <SectionHeading kicker={`${TASK_FRAMING.tag} · about ${TASK_FRAMING.minutes} minutes`} title={TASK_FRAMING.title} />

      <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_340px]">
        <div className="min-w-0 space-y-6">
          <div className="rounded-2xl border border-accent/30 bg-accentSoft/60 p-5">
            <p className="text-body font-semibold text-ink">{TASK_FRAMING.lead}</p>
            <p className="mt-2 max-w-prose text-body text-ash">{TASK_FRAMING.instruction}</p>
          </div>

          <div className="rounded-2xl border border-line bg-paper p-5">
            <p className="text-micro font-semibold uppercase tracking-wide text-ash">Where Verdeon stands today</p>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {CONTEXT_CHIPS.map((chip) => (
                <span key={chip} className="rounded-full border border-line bg-canvas px-2.5 py-1 text-micro text-ink">
                  {chip}
                </span>
              ))}
            </div>
          </div>

          <MaterialRefs refs={materialRefs(TASK_MATERIAL_REFS)} />

          <div>
            <p className="mb-2 text-micro font-semibold uppercase tracking-wide text-accent">Stage A — Frame it</p>
            <StageFrame />
          </div>

          <div>
            <p className="mb-2 text-micro font-semibold uppercase tracking-wide text-accent">Stage B — Three guiding decisions</p>
            <StageGuiding />
          </div>

          <div>
            <p className="mb-2 text-micro font-semibold uppercase tracking-wide text-accent">Stage C — Build sequence + first move</p>
            <StageSequence />
          </div>

          <div>
            <p className="mb-2 text-micro font-semibold uppercase tracking-wide text-accent">Stage D — Trade-off allocation</p>
            <StageAllocate />
          </div>

          <div>
            <p className="mb-2 text-micro font-semibold uppercase tracking-wide text-accent">Stage E — Governance & the call you make now</p>
            <StageGovernance />
          </div>

          <AnswerKey block={ANSWER_KEY} />
        </div>

        <LivePanel
          title="Verdeon Management Proposal"
          summary={`${[r2.stageAComplete, r2.stageBComplete, r2.stageCComplete, r2.stageDComplete, r2.stageEComplete].filter(Boolean).length}/5 stages complete`}
        >
          <ReportPanel />
        </LivePanel>
      </div>

      <ExportBar />
    </section>
  );
}
