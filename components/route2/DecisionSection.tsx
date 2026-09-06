"use client";

import clsx from "clsx";
import { useProgress } from "@/lib/store";
import { R2, OPTIONS, TASK2, FOLLOWUP_COUNT, RISK_COUNT } from "@/lib/route2";
import { useRoute2 } from "./useRoute2";

const { decision } = TASK2;

export function DecisionSection() {
  const r2 = useRoute2();
  const choose = useProgress((s) => s.choose);
  const setNote = useProgress((s) => s.setNote);

  const justifyWordCount = r2.decisionJustify.trim() ? r2.decisionJustify.trim().split(/\s+/).length : 0;

  return (
    <div className="space-y-6">
      <h3 className="text-h3 text-ink">{decision.heading}</h3>

      <div id="r2-decision-pick">
        <p className="text-caption font-semibold text-ink">{decision.pickLabel}</p>
        <p className="text-micro text-ash">{decision.pickCaption}</p>
        <div className="mt-2 flex flex-wrap gap-2">
          {OPTIONS.map((o) => {
            const active = r2.decisionPick === o.id;
            return (
              <button
                key={o.id}
                type="button"
                onClick={() => choose(R2.decisionPick, o.id)}
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

      <label id="r2-decision-justify" className="block">
        <span className="text-caption font-semibold text-ink">{decision.justifyLabel}</span>
        <p className="text-micro text-ash">{decision.justifyCaption}</p>
        <textarea
          value={r2.decisionJustify}
          onChange={(e) => setNote(R2.decisionJustify, e.target.value)}
          rows={4}
          className="mt-1 w-full rounded-xl border border-line bg-paper px-3 py-2 text-body text-ink"
        />
        <p className={clsx("mt-1 text-micro tabular-nums", justifyWordCount >= 40 ? "text-accent" : "text-ash")}>
          {justifyWordCount} word{justifyWordCount === 1 ? "" : "s"}
        </p>
      </label>

      <div className="space-y-2">
        <p className="text-caption font-semibold text-ink">{decision.followUpLabel}</p>
        <p className="text-micro text-ash">{decision.followUpCaption}</p>
        {Array.from({ length: FOLLOWUP_COUNT }).map((_, i) => (
          <label key={i} id={`r2-decision-followup-${i}`} className="block">
            <span className="text-micro text-ash">Follow-up decision #{i + 1}</span>
            <input
              value={r2.followUps[i] ?? ""}
              onChange={(e) => setNote(R2.followUp(i), e.target.value)}
              className="mt-1 w-full rounded-xl border border-line bg-paper px-3 py-2 text-body text-ink"
            />
          </label>
        ))}
      </div>

      <div className="space-y-2">
        <p className="text-caption font-semibold text-ink">{decision.riskLabel}</p>
        <p className="text-micro text-ash">{decision.riskCaption}</p>
        {Array.from({ length: RISK_COUNT }).map((_, i) => (
          <label key={i} id={`r2-decision-risk-${i}`} className="block">
            <span className="text-micro text-ash">Risk #{i + 1}</span>
            <textarea
              value={r2.risks[i] ?? ""}
              onChange={(e) => setNote(R2.risk(i), e.target.value)}
              rows={2}
              className="mt-1 w-full rounded-xl border border-line bg-paper px-3 py-2 text-body text-ink"
            />
          </label>
        ))}
      </div>
    </div>
  );
}
