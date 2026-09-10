"use client";

import { useProgress } from "@/lib/store";
import { R2, FOLLOWUP_COUNT } from "@/lib/route2";
import { useRoute2 } from "./useRoute2";

/** Stage 2 (cont.) — the most important follow-up decisions that result from the recommendation just above. */
export function FollowUpDecisions() {
  const r2 = useRoute2();
  const setNote = useProgress((s) => s.setNote);

  return (
    <div className="space-y-3">
      {Array.from({ length: FOLLOWUP_COUNT }).map((_, i) => (
        <label key={i} id={`r2-stage4-${i}`} className="block">
          <span className="text-caption font-semibold text-ink">Follow-up decision #{i + 1}</span>
          <p className="text-micro text-ash">Something that must now be decided next, once this measure is approved.</p>
          <input
            value={r2.followUps[i] ?? ""}
            onChange={(e) => setNote(R2.followUp(i), e.target.value)}
            className="mt-1 w-full rounded-xl border border-line bg-paper px-3 py-2 text-body text-ink"
          />
        </label>
      ))}
    </div>
  );
}
