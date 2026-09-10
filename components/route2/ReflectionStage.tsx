"use client";

import { useProgress } from "@/lib/store";
import { R2, REFLECTION_PROMPTS } from "@/lib/route2";
import { useRoute2 } from "./useRoute2";

/** Stage 5 — two personal/coaching-style reflections. Visually distinct (journal-like) from the analytical stages above, but still feeds the report. */
export function ReflectionStage() {
  const r2 = useRoute2();
  const setNote = useProgress((s) => s.setNote);

  return (
    <div className="space-y-4 rounded-2xl border border-dashed border-accent/40 bg-accentSoft/40 p-5">
      <p className="text-micro text-ash">
        There's no clue or model answer here — this is about your own organisation, honestly considered.
      </p>
      {REFLECTION_PROMPTS.map((p, i) => (
        <label key={p.id} id={`r2-stage6-${i}`} className="block rounded-xl border border-line bg-paper p-3.5">
          <span className="text-caption font-semibold italic text-ink">"{p.question}"</span>
          <p className="text-micro text-ash">A sentence or two, in your own words.</p>
          <textarea
            value={r2.reflections[i] ?? ""}
            onChange={(e) => setNote(R2.reflection(i), e.target.value)}
            rows={2}
            className="mt-1.5 w-full rounded-xl border border-line bg-canvas px-3 py-2 text-body italic text-ink"
          />
        </label>
      ))}
    </div>
  );
}
