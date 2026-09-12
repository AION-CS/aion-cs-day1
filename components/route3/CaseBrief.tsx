"use client";

import { useProgress } from "@/lib/store";
import { R3, CASE_BRIEF } from "@/lib/route3";

/** Task opener — the BrightPath brief and the learner's name field. */
export function CaseBrief() {
  const name = useProgress((s) => s.notes[R3.name] ?? "");
  const setNote = useProgress((s) => s.setNote);

  return (
    <div className="card p-5">
      <p className="text-micro font-semibold uppercase tracking-wide text-ash">Brief</p>
      <h3 className="mt-1 text-h3 text-ink">{CASE_BRIEF.company}</h3>
      <p className="mt-2 text-body text-ink">{CASE_BRIEF.brief}</p>
      <p className="mt-3 text-body text-ash">{CASE_BRIEF.profile}</p>
      <p className="mt-2 text-body text-ash">{CASE_BRIEF.estate}</p>

      <div className="mt-4 rounded-xl border border-line bg-canvas p-4">
        <p className="text-micro font-semibold uppercase tracking-wide text-ash">Where things stand</p>
        <ul className="mt-2 space-y-1.5">
          {CASE_BRIEF.state.map((s) => (
            <li key={s} className="flex gap-2 text-caption text-ink">
              <span className="mt-[6px] h-1.5 w-1.5 shrink-0 rounded-full bg-ash" />
              <span>{s}</span>
            </li>
          ))}
        </ul>
      </div>

      <p className="mt-3 text-caption font-semibold text-ink">{CASE_BRIEF.boardExpectation}</p>

      <div id="r3-name" className="mt-5 scroll-mt-24 border-t border-line pt-4">
        <label className="block max-w-xs">
          <span className="text-caption font-semibold text-ink">Your name</span>
          <p className="text-micro text-ash">
            Used to label the exported proposal — it becomes e.g. &ldquo;1-jane-day9-l3task1&rdquo;.
          </p>
          <input
            value={name}
            onChange={(e) => setNote(R3.name, e.target.value)}
            placeholder="Full name"
            className="mt-1 w-full rounded-xl border border-line bg-paper px-3 py-2 text-body text-ink"
          />
        </label>
      </div>
    </div>
  );
}
