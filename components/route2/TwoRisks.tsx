"use client";

import { useProgress } from "@/lib/store";
import { R2, RISK_COUNT } from "@/lib/route2";
import { useRoute2 } from "./useRoute2";
import { QuickWinTimelineSvg } from "./QuickWinTimelineSvg";

/** Stage 2 — two risks of the fast-but-shallow alternative, with the Block 5 timeline as a visual reminder. */
export function TwoRisks() {
  const r2 = useRoute2();
  const setNote = useProgress((s) => s.setNote);

  return (
    <div className="grid gap-5 lg:grid-cols-[1fr_260px] lg:items-start">
      <div className="space-y-3">
        {Array.from({ length: RISK_COUNT }).map((_, i) => (
          <label key={i} id={`r2-stage5-${i}`} className="block">
            <span className="text-caption font-semibold text-ink">Risk #{i + 1}</span>
            <p className="text-micro text-ash">A concrete risk of choosing a measure that's attractive short-term but structurally weak.</p>
            <textarea
              value={r2.risks[i] ?? ""}
              onChange={(e) => setNote(R2.risk(i), e.target.value)}
              rows={2}
              className="mt-1 w-full rounded-xl border border-line bg-paper px-3 py-2 text-body text-ink"
            />
          </label>
        ))}
      </div>
      <div className="rounded-xl border border-line bg-canvas p-3">
        <QuickWinTimelineSvg compact />
        <p className="mt-1 text-center text-micro text-ash">Reminder: the quick-win-vs-governance-first timeline (Block 5)</p>
      </div>
    </div>
  );
}
