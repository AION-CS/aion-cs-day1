"use client";

import clsx from "clsx";
import { useProgress } from "@/lib/store";
import { R1, STATEMENT_PROMPTS, STATEMENT_MIN_WORDS } from "@/lib/route1";
import { useRoute1 } from "./useRoute1";

function wordCount(text: string): number {
  return text.trim().length === 0 ? 0 : text.trim().split(/\s+/).length;
}

/** Stage 4 — three sentence-starters, completed in the learner's own words. */
export function StatementBuilder() {
  const r1 = useRoute1();
  const setNote = useProgress((s) => s.setNote);

  return (
    <div className="space-y-4">
      {STATEMENT_PROMPTS.map((p) => {
        const text = r1.stage4Statement[p.id] ?? "";
        const words = wordCount(text);
        return (
          <div key={p.id} id={`r1-stage4-${p.id}`} className="rounded-xl border border-line p-3.5">
            <label className="block">
              <span className="text-caption font-semibold text-ink">"{p.starter} ___"</span>
              <p className="text-micro text-ash">{p.helper} Aim for at least {STATEMENT_MIN_WORDS} words, but this won't block your export.</p>
              <textarea
                value={text}
                onChange={(e) => setNote(R1.stage4.statement(p.id), e.target.value)}
                rows={2}
                placeholder={`${p.starter} …`}
                className="mt-1.5 w-full rounded-xl border border-line bg-paper px-3 py-2 text-body text-ink"
              />
            </label>
            <p className={clsx("mt-1 text-micro", words >= STATEMENT_MIN_WORDS ? "text-accent" : "text-ash")}>
              {words} word{words === 1 ? "" : "s"}
              {words < STATEMENT_MIN_WORDS && words > 0 && ` — ${STATEMENT_MIN_WORDS - words} more to reach a solid statement`}
            </p>
          </div>
        );
      })}
    </div>
  );
}
