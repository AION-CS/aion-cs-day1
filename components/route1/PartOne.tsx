"use client";

import { SectionHeading } from "@/components/ui/SectionHeading";
import { LivePanel } from "@/components/ui/LivePanel";
import { EXPORT, TASK_INTRO } from "@/lib/route1";
import { TriageBlock } from "./TriageBlock";
import { EscalatePicker } from "./EscalatePicker";
import { DeepDiveCard } from "./DeepDiveCard";
import { ReportPanel } from "./ReportPanel";
import { useRoute1, domId } from "./useRoute1";

/**
 * The task — three steps in one column: triage all seven signals, escalate
 * two, then the full workup on just those two. The report assembles on the
 * right throughout. There is no second part — Day 13's curriculum Task 1 is
 * fully covered by triage and deep dive alone (see lib/route1/sections.ts).
 */
export function PartOne() {
  const r1 = useRoute1();

  return (
    <section id={domId.task} className="scroll-mt-24 space-y-6">
      <SectionHeading
        kicker={`${TASK_INTRO.tag} · about ${TASK_INTRO.minutes} minutes`}
        title={TASK_INTRO.title}
        intro={TASK_INTRO.framing}
      />

      <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_340px]">
        <div className="min-w-0 space-y-8">
          <TriageBlock />
          <EscalatePicker />

          {r1.analyses.length > 0 && (
            <div className="space-y-4">
              <p className="text-micro font-semibold uppercase tracking-wide text-ash">
                Step 3 · {r1.analyses.length} signal{r1.analyses.length === 1 ? "" : "s"} escalated
              </p>
              <div className="space-y-4">
                {r1.analyses.map((a, i) => (
                  <DeepDiveCard key={a.signal.id} analysis={a} position={i + 1} />
                ))}
              </div>
            </div>
          )}
        </div>

        <LivePanel
          title={EXPORT.docHeading}
          summary={`${r1.triageCompleteCount} of ${r1.totalSignals} triaged · ${r1.analysisCompleteCount} of ${r1.escalated.length || 2} analysed`}
        >
          <ReportPanel />
        </LivePanel>
      </div>
    </section>
  );
}
