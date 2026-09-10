"use client";

import { useProgress } from "@/lib/store";
import { R3, GUTCHECK_PROMPTS, TASK3 } from "@/lib/route3";

/** Stage 3 — narrative bridge into Helix, plus an optional gut-check that is never required to proceed. */
export function BridgeToHelix() {
  const notes = useProgress((s) => s.notes);
  const setNote = useProgress((s) => s.setNote);

  return (
    <div className="card space-y-4 p-5">
      <p className="text-body text-ink">{TASK3.stage5.instructions}</p>
      <div className="border-t border-line pt-4">
        <p className="text-micro font-semibold uppercase tracking-wide text-ash">{TASK3.stage5.gutcheckIntro}</p>
        <div className="mt-2 space-y-3">
          {GUTCHECK_PROMPTS.map((p, i) => (
            <label key={p.id} className="block">
              <span className="text-caption italic text-ink">"{p.question}"</span>
              <textarea
                value={notes[R3.s5.gutcheck(i)] ?? ""}
                onChange={(e) => setNote(R3.s5.gutcheck(i), e.target.value)}
                rows={2}
                className="mt-1 w-full rounded-xl border border-line bg-canvas px-3 py-2 text-body text-ink"
              />
            </label>
          ))}
        </div>
      </div>
    </div>
  );
}
