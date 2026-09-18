"use client";

import { SectionHeading } from "@/components/ui/SectionHeading";
import { LivePanel } from "@/components/ui/LivePanel";
import { MaterialRefs } from "@/components/ui/MaterialRefs";
import { EXPORT, PART_ONE, PART_TWO, TASK_FRAMING, materialRefs, measureLineById } from "@/lib/route2";
import { RankBoard } from "./RankBoard";
import { ProposeSection } from "./ProposeSection";
import { ReportPanel } from "./ReportPanel";
import { useRoute2, domId } from "./useRoute2";

/**
 * One task, two parts, one continuous scroll (CLAUDE.md §12/§13). Part 2
 * stays reachable regardless of Part 1's progress — see ProposeSection's own
 * "no priority chosen yet" banner, which is a suggestion, never a lock.
 */
export function Task() {
  const r2 = useRoute2();

  return (
    <section id={domId.task} className="scroll-mt-24 space-y-6">
      <SectionHeading kicker={`${TASK_FRAMING.tag} · about ${TASK_FRAMING.minutes} minutes`} title="Prioritise, then propose" />

      <div className="rounded-2xl border border-accent/30 bg-accentSoft/60 p-5">
        <p className="text-body font-semibold text-ink">{TASK_FRAMING.lead}</p>
        <p className="mt-2 max-w-prose text-body text-ash">{TASK_FRAMING.instruction}</p>
      </div>

      <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_340px]">
        <div className="min-w-0 space-y-10">
          <div>
            <p className="text-micro font-semibold uppercase tracking-wide text-accent">
              {PART_ONE.tag} · about {PART_ONE.minutes} minutes
            </p>
            <h3 className="mt-1 text-h3 text-ink">{PART_ONE.title}</h3>
            <p className="mt-1 max-w-prose text-caption text-ash">{PART_ONE.intro}</p>
            <MaterialRefs refs={materialRefs([...PART_ONE.material])} />
            <div className="mt-4">
              <RankBoard />
            </div>
          </div>

          <div className="border-t border-line pt-8">
            <p className="text-micro font-semibold uppercase tracking-wide text-accent">
              {PART_TWO.tag} · about {PART_TWO.minutes} minutes
            </p>
            <h3 className="mt-1 text-h3 text-ink">{PART_TWO.title}</h3>
            <p className="mt-1 max-w-prose text-caption text-ash">{PART_TWO.intro}</p>
            <MaterialRefs refs={materialRefs([...PART_TWO.material])} />
            <div className="mt-4">
              <ProposeSection />
            </div>
          </div>
        </div>

        <LivePanel
          title={EXPORT.docHeading}
          summary={`Part 1: ${r2.rankedCriteriaCount}/4 criteria${r2.priority ? `, priority ${measureLineById(r2.priority).letter}` : ""} · Part 2: ${r2.partTwoComplete ? "complete" : "in progress"}`}
        >
          <ReportPanel />
        </LivePanel>
      </div>
    </section>
  );
}
