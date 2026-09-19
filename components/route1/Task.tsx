"use client";

import { useProgress, useHydrated } from "@/lib/store";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { LivePanel } from "@/components/ui/LivePanel";
import { MaterialRefs } from "@/components/ui/MaterialRefs";
import { AnswerKeyNote } from "@/components/ui/AnswerKey";
import {
  CLOSING_FIELD,
  CONTEXT_CHIPS,
  CONTEXT_CHIPS_L2,
  EXPORT,
  R1,
  TASK2_FRAMING,
  TASK_FRAMING,
  WORK_ASSIGNMENT,
  materialRefs,
} from "@/lib/route1";
import { DiagnosisBoard } from "./DiagnosisBoard";
import { Handover } from "./Handover";
import { PartTwo } from "./PartTwo";
import { ReportPanel } from "./ReportPanel";
import { useRoute1, domId } from "./useRoute1";

/**
 * The whole task, one continuous scroll: Part 1 — Diagnose (Task 1) → an
 * inline handover → Part 2 — Decide (Task 2), with one report assembling
 * beside it (CLAUDE.md §12). No material sits between the parts — everything
 * either part needs was taught in the nine cards above this section.
 */
export function Task() {
  const r1 = useRoute1();

  return (
    <section id={domId.task} className="scroll-mt-24 space-y-6">
      <SectionHeading kicker="THE TASK" title="FutureGrid Technologies — Diagnose, then Decide" />

      <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_340px]">
        <div className="min-w-0 space-y-8">
          {/* Part 1 — Diagnose */}
          <div className="space-y-6">
            <SectionHeading
              kicker={`${TASK_FRAMING.tag} · about ${TASK_FRAMING.minutes} minutes`}
              title={TASK_FRAMING.title}
            />

            <div className="rounded-2xl border border-accent/30 bg-accentSoft/60 p-5">
              <p className="text-body font-semibold text-ink">{TASK_FRAMING.lead}</p>
              <p className="mt-2 max-w-prose text-body text-ash">{TASK_FRAMING.instruction}</p>
            </div>

            <div className="rounded-2xl border border-line bg-paper p-5">
              <p className="text-micro font-semibold uppercase tracking-wide text-ash">Where FutureGrid stands today</p>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {CONTEXT_CHIPS.map((chip) => (
                  <span key={chip} className="rounded-full border border-line bg-canvas px-2.5 py-1 text-micro text-ink">
                    {chip}
                  </span>
                ))}
              </div>
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

            <DiagnosisBoard />
            <ClosingQuestion />
          </div>

          <Handover />

          {/* Part 2 — Decide */}
          <div id={domId.partTwo} className="scroll-mt-24 space-y-6">
            <SectionHeading
              kicker={`${TASK2_FRAMING.tag} · about ${TASK2_FRAMING.minutes} minutes`}
              title={TASK2_FRAMING.title}
            />

            <div className="rounded-2xl border border-accent/30 bg-accentSoft/60 p-5">
              <p className="text-body font-semibold text-ink">{TASK2_FRAMING.lead}</p>
              <p className="mt-2 max-w-prose text-body text-ash">{TASK2_FRAMING.instruction}</p>
            </div>

            <div className="rounded-2xl border border-line bg-paper p-5">
              <p className="text-micro font-semibold uppercase tracking-wide text-ash">General conditions</p>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {CONTEXT_CHIPS_L2.map((chip) => (
                  <span key={chip} className="rounded-full border border-line bg-canvas px-2.5 py-1 text-micro text-ink">
                    {chip}
                  </span>
                ))}
              </div>
            </div>

            <PartTwo />
          </div>
        </div>

        <LivePanel
          title={EXPORT.docHeading}
          summary={`Part 1: ${r1.diagnosedCount}/${r1.totalCards} diagnosed · Part 2: ${r1.options.filter((o) => o.fullyScored).length}/3 assessed`}
        >
          <ReportPanel />
        </LivePanel>
      </div>
    </section>
  );
}

/** The one free-text question that closes Part 1 — C5's distinction, applied. */
function ClosingQuestion() {
  const hydrated = useHydrated();
  const setNote = useProgress((s) => s.setNote);
  const value = useProgress((s) => s.notes[R1.closing] ?? "");

  return (
    <div id={domId.closing} className="scroll-mt-24 rounded-2xl border border-line bg-paper p-5">
      <label htmlFor="r1-closing-field" className="block text-caption font-semibold text-ink">
        {CLOSING_FIELD.label}
      </label>
      <p className="mt-0.5 text-micro text-ash">{CLOSING_FIELD.instruction}</p>
      <MaterialRefs refs={materialRefs(CLOSING_FIELD.material)} />
      <textarea
        id="r1-closing-field"
        value={hydrated ? value : ""}
        onChange={(e) => setNote(R1.closing, e.target.value)}
        placeholder={CLOSING_FIELD.placeholder}
        rows={3}
        className="mt-2 w-full rounded-xl border border-line bg-paper px-3 py-2.5 text-caption text-ink"
      />
      <AnswerKeyNote
        label="Closing question"
        text={
          "Initiatives 4 (device refresh on the classic market cycle) and 6 (the “AI everywhere” pilot) are the intended pair. Both are easy to sell internally — one because it is familiar and budget-friendly, the other because it looks innovative — and neither carries a measured net effect. A participant who names initiative 2 instead has a defensible case (its customer-side benefit is unmeasured too), and the counter is that initiative 2 at least rests on a platform the organisation can genuinely run, which is the maturity half of C5."
        }
      />
    </div>
  );
}
