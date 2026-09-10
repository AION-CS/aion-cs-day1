"use client";

import clsx from "clsx";
import { useProgress } from "@/lib/store";
import { R2, OPTIONS, TASK2, JUSTIFY_MIN_WORDS } from "@/lib/route2";
import { useRoute2 } from "./useRoute2";

/** Stage 2 — pick a final option and justify it under acknowledged uncertainty. */
export function MakeTheCall() {
  const r2 = useRoute2();
  const choose = useProgress((s) => s.choose);
  const setNote = useProgress((s) => s.setNote);

  const justifyWordCount = r2.justify.trim() ? r2.justify.trim().split(/\s+/).length : 0;

  return (
    <div className="space-y-5">
      <div id="r2-stage3-pick">
        <p className="text-caption font-semibold text-ink">{TASK2.stage2.pickLabel}</p>
        <p className="text-micro text-ash">{TASK2.stage2.pickCaption}</p>
        <div className="mt-2 flex flex-wrap gap-2">
          {OPTIONS.map((o) => {
            const active = r2.pick === o.id;
            return (
              <button
                key={o.id}
                type="button"
                onClick={() => choose(R2.pick, o.id)}
                aria-pressed={active}
                className={clsx(
                  "rounded-xl border px-3 py-2 text-caption font-semibold transition-colors duration-150",
                  active ? "border-accent bg-accent text-paper" : "border-line text-ink hover:border-ash",
                )}
              >
                Option {o.id} — {o.short}
              </button>
            );
          })}
        </div>
      </div>

      <label id="r2-stage3-justify" className="block">
        <span className="text-caption font-semibold text-ink">{TASK2.stage2.justifyLabel}</span>
        <p className="text-micro text-ash">{TASK2.stage2.justifyCaption}</p>
        <textarea
          value={r2.justify}
          onChange={(e) => setNote(R2.justify, e.target.value)}
          rows={4}
          className="mt-1 w-full rounded-xl border border-line bg-paper px-3 py-2 text-body text-ink"
        />
        <p className={clsx("mt-1 text-micro tabular-nums", justifyWordCount >= JUSTIFY_MIN_WORDS ? "text-accent" : "text-ash")}>
          {justifyWordCount} word{justifyWordCount === 1 ? "" : "s"}
          {justifyWordCount < JUSTIFY_MIN_WORDS && justifyWordCount > 0 && ` — ${JUSTIFY_MIN_WORDS - justifyWordCount} more to reach a solid justification`}
        </p>
      </label>
    </div>
  );
}
