"use client";

import { useState } from "react";
import clsx from "clsx";
import { useProgress } from "@/lib/store";
import {
  R2,
  MEASURES,
  RISKS,
  RISK_PICK_COUNT,
  RISK_NOTE_INSTRUCTION,
  JUSTIFICATION_INSTRUCTION,
  JUSTIFICATION_MIN_WORDS,
  UNCERTAINTY_INSTRUCTION,
  UNCERTAINTY_MIN_WORDS,
  RISK_ANSWER_KEY,
  UNCERTAINTY_ANSWER_NOTE,
} from "@/lib/route2";
import { useRoute2 } from "./useRoute2";
import { AnswerKey, AnswerKeyNote } from "@/components/ui/AnswerKey";
import { Check } from "@/components/icons/LineIcons";

const words = (v: string) => v.trim().split(/\s+/).filter(Boolean).length;

/** Stage 3b — commit to a ranking, defend it, name the structural risks, own the uncertainty. */
export function DecisionCommit() {
  const r2 = useRoute2();
  const choose = useProgress((s) => s.choose);
  const toggleCheck = useProgress((s) => s.toggleCheck);
  const setNote = useProgress((s) => s.setNote);
  const [tooMany, setTooMany] = useState(false);

  const setRank = (measureId: string, value: number) => {
    // Ranks are exclusive: whoever already holds this rank swaps with the mover.
    const holder = MEASURES.find((m) => r2.rank[m.id] === value && m.id !== measureId);
    const previous = r2.rank[measureId as "A" | "B" | "C"];
    choose(R2.stage3.rank(measureId), String(value));
    if (holder) choose(R2.stage3.rank(holder.id), previous ? String(previous) : "");
  };

  const onToggleRisk = (riskId: string) => {
    const selected = r2.pickedRisks.includes(riskId as never);
    if (selected) {
      toggleCheck(R2.stage3.risk(riskId), false);
      setTooMany(false);
      return;
    }
    if (r2.pickedRisks.length >= RISK_PICK_COUNT) {
      setTooMany(true);
      window.setTimeout(() => setTooMany(false), 2600);
      return;
    }
    toggleCheck(R2.stage3.risk(riskId), true);
  };

  const justificationWords = words(r2.justification);
  const uncertaintyWords = words(r2.uncertainty);

  return (
    <div>
      {/* ------------------------------------------------------------- ranking */}
      <div id="r2-rank" className="scroll-mt-24 rounded-2xl border border-line bg-paper p-4">
        <p className="text-caption font-semibold text-ink">Your ranking</p>
        <p className="mt-0.5 text-micro text-ash">
          Give each measure a distinct position. Your matrix suggests{" "}
          <span className="font-semibold text-ink">{r2.derivedRanking.join(" → ")}</span> — you may disagree with your own
          matrix, but then say why in the justification below.
        </p>
        <div className="mt-3 space-y-2">
          {MEASURES.map((m) => (
            <div key={m.id} className="flex flex-wrap items-center gap-3 rounded-xl border border-line p-3">
              <span className="flex-1 text-caption font-semibold text-ink">
                {m.id} · {m.short}
                <span className="ml-2 font-normal text-ash tabular-nums">{r2.totals[m.id].toFixed(2)}</span>
              </span>
              <div className="flex gap-1.5">
                {[1, 2, 3].map((v) => (
                  <button
                    key={v}
                    type="button"
                    onClick={() => setRank(m.id, v)}
                    aria-pressed={r2.rank[m.id] === v}
                    className={clsx(
                      "h-9 w-9 rounded-lg border text-caption font-semibold transition-colors duration-150",
                      r2.rank[m.id] === v ? "border-accent bg-accent text-paper" : "border-line bg-paper text-ash hover:border-ash hover:text-ink",
                    )}
                  >
                    {v}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* -------------------------------------------------------- justification */}
      <div id="r2-justification" className="mt-4 scroll-mt-24 rounded-2xl border border-line bg-paper p-4">
        <label className="block">
          <span className="text-caption font-semibold text-ink">Core justification</span>
          <p className="mt-0.5 text-micro text-ash">{JUSTIFICATION_INSTRUCTION}</p>
          <textarea
            value={r2.justification}
            onChange={(e) => setNote(R2.stage3.justification, e.target.value)}
            rows={4}
            className="mt-1.5 w-full rounded-xl border border-line bg-paper px-3 py-2 text-caption text-ink"
          />
        </label>
        <p className={clsx("mt-1 text-micro tabular-nums", justificationWords >= JUSTIFICATION_MIN_WORDS ? "text-accent" : "text-ash")}>
          {justificationWords} / {JUSTIFICATION_MIN_WORDS} words
        </p>
      </div>

      {/* --------------------------------------------------------------- risks */}
      <div id="r2-risks" className="mt-4 scroll-mt-24 rounded-2xl border border-line bg-paper p-4">
        <p className="text-caption font-semibold text-ink">
          Two risks of choosing a visible-but-structurally-weak measure
        </p>
        <p className="mt-0.5 text-micro text-ash">
          Pick exactly {RISK_PICK_COUNT}. Several of these are real risks — the question is which ones foreclose your
          future options rather than merely causing trouble.
        </p>

        {tooMany && (
          <p className="reveal-in mt-2 rounded-lg border border-warn/40 bg-warn/10 px-3 py-2 text-micro text-warn">
            You already have {RISK_PICK_COUNT} selected. Deselect one first — being forced to choose is the exercise.
          </p>
        )}

        <div className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {RISKS.map((risk) => {
            const selected = r2.pickedRisks.includes(risk.id);
            return (
              <button
                key={risk.id}
                type="button"
                onClick={() => onToggleRisk(risk.id)}
                aria-pressed={selected}
                className={clsx(
                  "flex items-start gap-2 rounded-xl border p-3 text-left transition-colors duration-150",
                  selected ? "border-accent bg-accentSoft" : "border-line bg-paper hover:border-ash",
                )}
              >
                <span
                  className={clsx(
                    "mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-micro font-semibold",
                    selected ? "bg-accent text-paper" : "bg-mist text-ash",
                  )}
                >
                  {selected ? <Check className="h-3.5 w-3.5" /> : ""}
                </span>
                <span className="flex-1 text-caption font-medium text-ink">{risk.label}</span>
              </button>
            );
          })}
        </div>

        {r2.pickedRisks.length > 0 && (
          <div className="mt-3 space-y-3">
            {RISKS.filter((r) => r2.pickedRisks.includes(r.id)).map((risk) => (
              <label key={risk.id} className="block rounded-xl border border-line p-3">
                <span className="text-micro font-semibold text-ink">Consequence — {risk.label}</span>
                <p className="mt-0.5 text-micro text-ash">{RISK_NOTE_INSTRUCTION}</p>
                <input
                  value={r2.riskNote[risk.id] ?? ""}
                  onChange={(e) => setNote(R2.stage3.riskNote(risk.id), e.target.value)}
                  className="mt-1.5 w-full rounded-xl border border-line bg-paper px-3 py-2 text-caption text-ink"
                />
              </label>
            ))}
          </div>
        )}

        <AnswerKey block={RISK_ANSWER_KEY} />
      </div>

      {/* --------------------------------------------------------- uncertainty */}
      <div id="r2-uncertainty" className="mt-4 scroll-mt-24 rounded-2xl border border-line bg-paper p-4">
        <label className="block">
          <span className="text-caption font-semibold text-ink">The uncertainty statement</span>
          <p className="mt-0.5 text-micro text-ash">{UNCERTAINTY_INSTRUCTION}</p>
          <textarea
            value={r2.uncertainty}
            onChange={(e) => setNote(R2.stage3.uncertainty, e.target.value)}
            rows={3}
            className="mt-1.5 w-full rounded-xl border border-line bg-paper px-3 py-2 text-caption text-ink"
          />
        </label>
        <p className={clsx("mt-1 text-micro tabular-nums", uncertaintyWords >= UNCERTAINTY_MIN_WORDS ? "text-accent" : "text-ash")}>
          {uncertaintyWords} / {UNCERTAINTY_MIN_WORDS} words
        </p>
        <AnswerKeyNote label="What a strong uncertainty statement contains" text={UNCERTAINTY_ANSWER_NOTE} />
      </div>
    </div>
  );
}
