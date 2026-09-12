"use client";

import { useMemo, useState } from "react";
import clsx from "clsx";
import { useProgress } from "@/lib/store";
import {
  R2,
  CRITERIA,
  MEASURES,
  GATES,
  WEIGHT_TOTAL,
  SENSITIVITY,
  SENSITIVITY_RANGE,
  WEIGHT_ANSWER_KEY,
  MATRIX_ANSWER_KEY,
  type CriterionId,
  type MeasureId,
} from "@/lib/route2";
import { useRoute2 } from "./useRoute2";
import { ClueToggle } from "@/components/ui/ClueToggle";
import { AnswerKey } from "@/components/ui/AnswerKey";

const SCORES = [1, 2, 3, 4, 5];

const gateFor = (m: MeasureId, c: CriterionId) => GATES.find((g) => g.measureId === m && g.criterionId === c)!;

/** Stage 2 — weights first, then a matrix that makes you reason before you rate. */
export function ScoringMatrix() {
  const r2 = useRoute2();
  const choose = useProgress((s) => s.choose);
  const setNote = useProgress((s) => s.setNote);

  const [active, setActive] = useState<{ m: MeasureId; c: CriterionId }>({ m: "A", c: "environmental" });
  const [bandWarning, setBandWarning] = useState<string | null>(null);
  const [shift, setShift] = useState(0);

  const activeGate = gateFor(active.m, active.c);
  const activeKey = `${active.m}:${active.c}`;
  const activeAnswer = r2.gateAnswer[activeKey];
  const activeBand = activeGate.options.find((o) => o.id === activeAnswer)?.band ?? null;
  const activeScore = r2.score[activeKey];

  const pickScore = (value: number) => {
    if (!activeBand) return;
    if (value < activeBand[0] || value > activeBand[1]) {
      setBandWarning(
        `Your reasoning supports ${activeBand[0]}–${activeBand[1]} on this criterion. To score outside that, change the answer above — don't argue with the band, argue with the reasoning.`,
      );
      window.setTimeout(() => setBandWarning(null), 4000);
      return;
    }
    choose(R2.stage2.score(active.m, active.c), String(value));
  };

  /** What-if weights for the sensitivity test — never written to the store. */
  const shiftedTotals = useMemo(() => {
    const w = { ...r2.weights };
    w.economic = Math.max(0, w.economic + shift);
    w.leverage = Math.max(0, w.leverage - shift);
    const out: Record<MeasureId, number> = { A: 0, B: 0, C: 0 };
    for (const m of MEASURES) {
      let sum = 0;
      for (const c of CRITERIA) {
        const s = r2.score[`${m.id}:${c.id}`];
        if (s !== undefined) sum += s * ((w[c.id] || 0) / 100);
      }
      out[m.id] = sum;
    }
    return out;
  }, [r2.weights, r2.score, shift]);

  const shiftedRanking = useMemo(
    () => [...MEASURES].sort((a, b) => shiftedTotals[b.id] - shiftedTotals[a.id]).map((m) => m.id).join(""),
    [shiftedTotals],
  );
  const baseRanking = r2.derivedRanking.join("");
  const flippedNow = shift !== 0 && shiftedRanking !== baseRanking;

  return (
    <div>
      {/* ---------------------------------------------------------------- weights */}
      <div id="r2-weights" className="scroll-mt-24 rounded-2xl border border-line bg-paper p-4">
        <div className="flex flex-wrap items-baseline justify-between gap-3">
          <div>
            <p className="text-caption font-semibold text-ink">Step 1 — set the weights</p>
            <p className="mt-0.5 text-micro text-ash">
              Allocate exactly {WEIGHT_TOTAL} points across the four criteria, and say why for each. Nothing is
              auto-balanced: the allocation is the judgement.
            </p>
          </div>
          <p
            className={clsx(
              "rounded-full px-3 py-1 text-micro font-semibold tabular-nums transition-colors duration-200",
              r2.weightsValid ? "bg-accentSoft text-accent" : "bg-warn/10 text-warn",
            )}
          >
            {r2.weightTotal} / {WEIGHT_TOTAL}
          </p>
        </div>

        <div className="mt-3 grid gap-3 lg:grid-cols-2">
          {CRITERIA.map((c) => (
            <div key={c.id} className="rounded-xl border border-line p-3">
              <label className="block">
                <span className="text-caption font-semibold text-ink">{c.label}</span>
                <p className="mt-0.5 text-micro text-ash">{c.hint}</p>
                <input
                  type="number"
                  min={0}
                  max={100}
                  inputMode="numeric"
                  value={r2.weights[c.id] === 0 && !r2.hydrated ? "" : String(r2.weights[c.id] ?? "")}
                  onChange={(e) => setNote(R2.stage2.weight(c.id), e.target.value.replace(/[^\d]/g, ""))}
                  className="mt-1.5 w-24 rounded-xl border border-line bg-paper px-3 py-1.5 text-body tabular-nums text-ink"
                />
              </label>
              <p className="mt-2 text-micro font-semibold text-ink">Why this weight?</p>
              <div className="mt-1 space-y-1">
                {c.whyOptions.map((o) => (
                  <button
                    key={o.id}
                    type="button"
                    onClick={() => choose(R2.stage2.weightWhy(c.id), o.id)}
                    aria-pressed={r2.weightWhy[c.id] === o.id}
                    className={clsx(
                      "block w-full rounded-lg border px-2.5 py-1.5 text-left text-micro transition-colors duration-150",
                      r2.weightWhy[c.id] === o.id
                        ? "border-accent bg-accentSoft text-ink"
                        : "border-line bg-paper text-ash hover:border-ash hover:text-ink",
                    )}
                  >
                    {o.label}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>

        <AnswerKey block={WEIGHT_ANSWER_KEY} />
      </div>

      {/* ----------------------------------------------------------------- matrix */}
      <div className="mt-5 rounded-2xl border border-line bg-paper p-4">
        <p className="text-caption font-semibold text-ink">Step 2 — work the matrix</p>
        <p className="mt-0.5 text-micro text-ash">
          Pick a cell, answer its reasoning question, then score inside the band your reasoning supports. Twelve cells.
        </p>

        <div className="mt-3 overflow-x-auto">
          <table className="w-full min-w-[560px] border-separate border-spacing-1">
            <thead>
              <tr>
                <th className="w-28" />
                {CRITERIA.map((c) => (
                  <th key={c.id} className="px-1 pb-1 text-micro font-semibold text-ash">
                    {c.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {MEASURES.map((m) => (
                <tr key={m.id}>
                  <th className="pr-2 text-left align-middle text-micro font-semibold text-ink">
                    {m.id} · {m.short}
                  </th>
                  {CRITERIA.map((c) => {
                    const key = `${m.id}:${c.id}`;
                    const answered = !!r2.gateAnswer[key];
                    const scored = r2.score[key];
                    const isActive = active.m === m.id && active.c === c.id;
                    return (
                      <td key={c.id} id={`r2-cell-${m.id}-${c.id}`} className="scroll-mt-24">
                        <button
                          type="button"
                          onClick={() => setActive({ m: m.id, c: c.id })}
                          aria-pressed={isActive}
                          className={clsx(
                            "flex h-14 w-full flex-col items-center justify-center rounded-xl border text-micro transition-all duration-200",
                            isActive && "ring-2 ring-accent ring-offset-1",
                            scored !== undefined
                              ? "border-accent bg-accentSoft text-ink"
                              : answered
                                ? "border-accent/40 bg-paper text-ash"
                                : "border-dashed border-line bg-canvas text-ash",
                          )}
                        >
                          {scored !== undefined ? (
                            <span className="text-readout font-semibold text-accent">{scored}</span>
                          ) : answered ? (
                            <span>score it</span>
                          ) : (
                            <span>locked</span>
                          )}
                        </button>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p className="mt-2 text-micro text-ash">
          <span className="font-semibold tabular-nums text-ink">{r2.scoresSet}</span> of {GATES.length} cells scored ·
          reasoning answered on <span className="font-semibold tabular-nums text-ink">{r2.gatesAnswered}</span>
        </p>

        {/* active cell */}
        <div className="reveal-in mt-4 rounded-2xl border border-accent/30 bg-accentSoft/25 p-4">
          <p className="text-micro font-semibold uppercase tracking-wide text-accent">
            Measure {active.m} × {CRITERIA.find((c) => c.id === active.c)?.label}
          </p>
          <p className="mt-1.5 text-caption font-semibold text-ink">{activeGate.question}</p>
          <div className="mt-2 grid gap-1.5">
            {activeGate.options.map((o) => (
              <button
                key={o.id}
                type="button"
                onClick={() => choose(R2.stage2.gate(active.m, active.c), o.id)}
                aria-pressed={activeAnswer === o.id}
                className={clsx(
                  "rounded-xl border px-3 py-2 text-left text-caption transition-colors duration-150",
                  activeAnswer === o.id ? "border-accent bg-paper text-ink" : "border-line bg-paper/70 text-ash hover:border-ash hover:text-ink",
                )}
              >
                {o.label}
              </button>
            ))}
          </div>
          <ClueToggle clue={activeGate.clue} />

          <div className={clsx("mt-3 transition-opacity duration-300", !activeBand && "opacity-40")}>
            <p className="text-micro font-semibold text-ink">Score</p>
            <p className="mt-0.5 text-micro text-ash">
              {activeBand
                ? `Based on your reasoning, this criterion can be scored between ${activeBand[0]} and ${activeBand[1]}.`
                : "Answer the reasoning question above to unlock the score."}
            </p>
            <div className="mt-1.5 flex gap-1.5">
              {SCORES.map((v) => {
                const inBand = activeBand ? v >= activeBand[0] && v <= activeBand[1] : false;
                return (
                  <button
                    key={v}
                    type="button"
                    onClick={() => pickScore(v)}
                    aria-pressed={activeScore === v}
                    className={clsx(
                      "h-9 w-9 rounded-lg border text-caption font-semibold transition-colors duration-150",
                      activeScore === v
                        ? "border-accent bg-accent text-paper"
                        : inBand
                          ? "border-accent/40 bg-paper text-ink hover:border-accent"
                          : "border-line bg-canvas text-ash/50",
                    )}
                  >
                    {v}
                  </button>
                );
              })}
            </div>
            {bandWarning && <p className="reveal-in mt-2 text-micro text-warn">{bandWarning}</p>}
          </div>
        </div>

        <AnswerKey block={MATRIX_ANSWER_KEY} />
      </div>

      {/* ----------------------------------------------------------------- totals */}
      <div className="mt-5 rounded-2xl border border-line bg-paper p-4">
        <p className="text-caption font-semibold text-ink">Live weighted totals</p>
        <p className="mt-0.5 text-micro text-ash">Your weights × your scores. The ranking is an output, never an input.</p>
        <TotalBars totals={r2.totals} />
      </div>

      {/* ------------------------------------------------------------ sensitivity */}
      <div id="r2-sensitivity" className="mt-5 scroll-mt-24 rounded-2xl border border-line bg-paper p-4">
        <p className="text-caption font-semibold text-ink">{SENSITIVITY.heading}</p>
        <p className="mt-0.5 text-micro text-ash">{SENSITIVITY.body}</p>

        <div className="mt-3 flex flex-wrap items-center gap-3">
          <label className="flex flex-1 items-center gap-3">
            <span className="text-micro text-ash">More Economic</span>
            <input
              type="range"
              min={-SENSITIVITY_RANGE}
              max={SENSITIVITY_RANGE}
              step={1}
              value={shift}
              onChange={(e) => setShift(Number(e.target.value))}
              className="h-1 flex-1 cursor-pointer accent-accent"
              aria-label="Shift weight between Economic Viability and Strategic Leverage"
            />
            <span className="text-micro text-ash">More Leverage</span>
          </label>
          <span className="rounded-full bg-canvas px-3 py-1 text-micro font-semibold tabular-nums text-ink">
            {shift > 0 ? `+${shift}` : shift} to Economic
          </span>
        </div>

        <TotalBars totals={shiftedTotals} muted />
        <p className={clsx("mt-1 text-micro font-semibold", flippedNow ? "text-warn" : "text-ash")}>
          {shift === 0
            ? "Move the slider to test whether your ranking is robust."
            : flippedNow
              ? `At this weighting the ranking becomes ${shiftedRanking.split("").join(" → ")} — it flipped.`
              : `Ranking holds at ${shiftedRanking.split("").join(" → ")}.`}
        </p>

        <div className="mt-3 flex flex-wrap gap-1.5">
          {SENSITIVITY.options.map((o) => (
            <button
              key={o.id}
              type="button"
              onClick={() => choose(R2.stage2.sensitivity, o.id)}
              aria-pressed={r2.sensitivity === o.id}
              className={clsx(
                "rounded-full border px-3 py-1 text-micro font-medium transition-colors duration-150",
                r2.sensitivity === o.id ? "border-accent bg-accent text-paper" : "border-line bg-paper text-ash hover:border-ash hover:text-ink",
              )}
            >
              {o.label}
            </button>
          ))}
        </div>

        <label className="mt-3 block">
          <span className="text-micro font-semibold text-ink">What the test told you</span>
          <p className="mt-0.5 text-micro text-ash">{SENSITIVITY.noteInstruction}</p>
          <textarea
            value={r2.sensitivityNote}
            onChange={(e) => setNote(R2.stage2.sensitivityNote, e.target.value)}
            rows={2}
            className="mt-1.5 w-full rounded-xl border border-line bg-paper px-3 py-2 text-caption text-ink"
          />
        </label>
      </div>
    </div>
  );
}

function TotalBars({ totals, muted = false }: { totals: Record<MeasureId, number>; muted?: boolean }) {
  const max = 5;
  return (
    <div className="mt-3 space-y-2">
      {MEASURES.map((m) => {
        const v = totals[m.id];
        return (
          <div key={m.id} className="flex items-center gap-3">
            <span className="w-28 shrink-0 text-micro font-semibold text-ink">
              {m.id} · {m.short}
            </span>
            <div className="h-6 flex-1 overflow-hidden rounded-lg bg-canvas">
              <div
                className={clsx("h-full rounded-lg transition-all duration-500", muted ? "bg-ash/40" : "bg-accent")}
                style={{ width: `${Math.max(0, Math.min(100, (v / max) * 100))}%` }}
              />
            </div>
            <span className="w-12 shrink-0 text-right text-caption font-semibold tabular-nums text-ink">
              {v.toFixed(2)}
            </span>
          </div>
        );
      })}
    </div>
  );
}
