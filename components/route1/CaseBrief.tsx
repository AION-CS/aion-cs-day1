"use client";

import { useProgress } from "@/lib/store";
import { R1, CASE_BRIEF } from "@/lib/route1";
import { ServiceLifeTimelineSvg } from "./ServiceLifeTimelineSvg";
import { CaseStory } from "./CaseStory";

/** Task 1 opener — the UrbanByte case as a story, then the same facts as a written brief, plus the learner's name field. */
export function CaseBrief() {
  const name = useProgress((s) => s.notes[R1.name] ?? "");
  const setNote = useProgress((s) => s.setNote);

  return (
    <div className="card p-5">
      <CaseStory />

      <p className="mt-6 text-micro font-semibold uppercase tracking-wide text-ash">Case brief</p>
      <h3 className="mt-1 text-h3 text-ink">{CASE_BRIEF.company}</h3>
      <p className="mt-2 text-body text-ash">{CASE_BRIEF.setup}</p>
      <p className="mt-2 text-body text-ash">{CASE_BRIEF.fleet}</p>
      <p className="mt-3 text-caption font-semibold text-ink">{CASE_BRIEF.role}</p>

      <div className="mt-4 rounded-xl border border-line bg-canvas p-4">
        <p className="text-micro font-semibold uppercase tracking-wide text-ash">
          The gap you are looking for, from Block 3
        </p>
        <div className="mt-2">
          <ServiceLifeTimelineSvg />
        </div>
      </div>

      <div id="r1-name" className="mt-4 scroll-mt-24 border-t border-line pt-4">
        <label className="block max-w-xs">
          <span className="text-caption font-semibold text-ink">Your name</span>
          <p className="text-micro text-ash">
            Used to label the exported report — it becomes e.g. &ldquo;1-jane-day9-l1task1&rdquo;.
          </p>
          <input
            value={name}
            onChange={(e) => setNote(R1.name, e.target.value)}
            placeholder="Full name"
            className="mt-1 w-full rounded-xl border border-line bg-paper px-3 py-2 text-body text-ink"
          />
        </label>
      </div>
    </div>
  );
}
