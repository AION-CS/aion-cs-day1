"use client";

import { SectionHeading } from "@/components/ui/SectionHeading";
import { LivePanel } from "@/components/ui/LivePanel";
import { CASE_INTRO_LEAD_IN, CASE_INTRO_PARAGRAPH, EVIDENCE, EXPORT, TASK_FRAMING, WORK_ASSIGNMENT } from "@/lib/route1";
import { EvidenceBoard } from "./EvidenceBoard";
import { ReportPanel } from "./ReportPanel";
import { useRoute1, domId } from "./useRoute1";

/**
 * Task 1 in full: the framing and case text rendered verbatim per the build
 * spec, the work assignment, the Evidence-Tagging Diagnosis Board, and the
 * live-assembling report beside it. This is Level 1 alone — Part Two
 * (prioritisation) is a separate, later addition to this same section
 * (CLAUDE.md §12).
 */
export function PartOne() {
  const r1 = useRoute1();

  return (
    <section id={domId.task} className="scroll-mt-24 space-y-6">
      <SectionHeading kicker={`${TASK_FRAMING.tag} · about ${TASK_FRAMING.minutes} minutes`} title={TASK_FRAMING.title} />

      <div className="rounded-2xl border border-accent/30 bg-accentSoft/60 p-5">
        <p className="text-body font-semibold text-ink">{TASK_FRAMING.lead}</p>
        <p className="mt-2 max-w-prose text-body text-ash">{TASK_FRAMING.instruction}</p>
      </div>

      <div className="max-w-prose space-y-3 rounded-2xl border border-line bg-paper p-5">
        <p className="text-body text-ash">{CASE_INTRO_PARAGRAPH}</p>
        <p className="text-body text-ash">{CASE_INTRO_LEAD_IN}</p>
        <ul className="space-y-2 pl-1">
          {EVIDENCE.map((e) => (
            <li key={e.id} className="flex gap-2 text-body text-ink">
              <span className="mt-0.5 shrink-0 text-micro font-semibold text-ash">{e.n}.</span>
              <span>{e.text}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="rounded-2xl border border-line bg-canvas p-5">
        <p className="text-micro font-semibold uppercase tracking-wide text-ash">Your work</p>
        <ol className="mt-2 list-decimal space-y-1.5 pl-5">
          {WORK_ASSIGNMENT.map((step, i) => (
            <li key={i} className="text-caption text-ink">
              {step}
            </li>
          ))}
        </ol>
      </div>

      <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_340px]">
        <div className="min-w-0">
          <EvidenceBoard />
        </div>

        <LivePanel
          title={EXPORT.docHeading}
          summary={`${r1.placedCount} of ${r1.totalChips} classified · ${r1.completeCount} fully tagged`}
        >
          <ReportPanel />
        </LivePanel>
      </div>
    </section>
  );
}
