"use client";

import { useEffect, useState } from "react";
import clsx from "clsx";
import { useProgress } from "@/lib/store";
import { createPlacementHistory, type PlacementMap } from "@/lib/usePlacementHistory";
import { scrollToAndFlash } from "@/lib/scrollToAndFlash";
import { AnswerKey } from "@/components/ui/AnswerKey";
import { ChevronDown, Help, Redo, Undo } from "@/components/icons/LineIcons";
import { MAP_EXERCISE, MAP_MEASURES, MAP_QUESTIONS, R2, quadrantById } from "@/lib/route2";
import { ExerciseHeader } from "./ExerciseHeader";
import { TradeoffMapSvg } from "./TradeoffMapSvg";
import { useRoute2, domId, type Answer, type MapMeasureState } from "./useRoute2";

/** This exercise's own undo/redo history. */
const useMapHistory = createPlacementHistory();

/**
 * Exercise 3 — the trade-off map. Five digitalisation initiatives, two
 * diagnostic questions each; the pair of answers decides the quadrant, and
 * only then does the initiative slide onto the map (CURRICULUM-GUIDE §5:
 * decide first, discover the position).
 *
 * Every answer change goes through the history, so undo/redo restores whole
 * map states; "Remove and retry" clears one initiative's answers and
 * re-opens it for immediate re-answering (CLAUDE.md #5). The strategic-bet
 * line is kept in the store across a retry, so re-landing in that quadrant
 * restores it.
 */
export function MapExercise() {
  const r2 = useRoute2();
  const choose = useProgress((s) => s.choose);

  const record = useMapHistory((s) => s.recordChange);
  const undo = useMapHistory((s) => s.undo);
  const redo = useMapHistory((s) => s.redo);
  const [noop, setNoop] = useState<string | null>(null);

  const snapshot = (): PlacementMap =>
    Object.fromEntries(r2.mapStates.flatMap((s) => [[`${s.measure.id}:q1`, s.q1], [`${s.measure.id}:q2`, s.q2]]));

  const apply = (snap: PlacementMap) => {
    for (const m of MAP_MEASURES) {
      choose(R2.q1(m.id), snap[`${m.id}:q1`] ?? "");
      choose(R2.q2(m.id), snap[`${m.id}:q2`] ?? "");
    }
  };

  const answer = (id: string, q: "q1" | "q2", value: Answer) => {
    record(snapshot());
    choose(q === "q1" ? R2.q1(id) : R2.q2(id), value);
  };

  const retry = (id: string) => {
    record(snapshot());
    choose(R2.q1(id), "");
    choose(R2.q2(id), "");
    choose(R2.openMeasure, id);
    window.setTimeout(() => scrollToAndFlash(domId.mapMeasure(id), "ref"), 40);
  };

  const flashNoop = (text: string) => {
    setNoop(text);
    window.setTimeout(() => setNoop(null), 1400);
  };

  const doUndo = () => {
    const snap = undo(snapshot());
    if (snap) apply(snap);
    else flashNoop("Nothing to undo yet.");
  };

  const doRedo = () => {
    const snap = redo(snapshot());
    if (snap) apply(snap);
    else flashNoop("Nothing to redo.");
  };

  return (
    <section id={domId.map} className="scroll-mt-24 space-y-4 rounded-2xl border border-line bg-paper p-5">
      <ExerciseHeader n={MAP_EXERCISE.n} title={MAP_EXERCISE.title} minutes={MAP_EXERCISE.minutes} intro={MAP_EXERCISE.intro} material={MAP_EXERCISE.material} />

      <div className="rounded-xl border border-line bg-canvas p-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <p className="text-micro font-semibold uppercase tracking-wide text-ash">
            The map · {r2.placedCount} of {MAP_MEASURES.length} placed
          </p>
          <div className="flex items-center gap-1.5">
            {noop && <span className="reveal-in text-micro text-ash">{noop}</span>}
            <button type="button" onClick={doUndo} className="inline-flex items-center gap-1 rounded-lg border border-line bg-paper px-2 py-1 text-micro font-semibold text-ash hover:text-ink">
              <Undo className="h-3.5 w-3.5" /> Undo
            </button>
            <button type="button" onClick={doRedo} className="inline-flex items-center gap-1 rounded-lg border border-line bg-paper px-2 py-1 text-micro font-semibold text-ash hover:text-ink">
              <Redo className="h-3.5 w-3.5" /> Redo
            </button>
          </div>
        </div>
        <div className="mx-auto mt-2 max-w-[520px]">
          <TradeoffMapSvg states={r2.mapStates} />
        </div>
      </div>

      <ul className="space-y-2">
        {r2.mapStates.map((s) => (
          <MeasureCard
            key={s.measure.id}
            state={s}
            open={r2.openMeasureId === s.measure.id}
            onToggle={() => choose(R2.openMeasure, r2.openMeasureId === s.measure.id ? "" : s.measure.id)}
            onAnswer={answer}
            onRetry={retry}
          />
        ))}
      </ul>
    </section>
  );
}

function MeasureCard({
  state,
  open,
  onToggle,
  onAnswer,
  onRetry,
}: {
  state: MapMeasureState;
  open: boolean;
  onToggle: () => void;
  onAnswer: (id: string, q: "q1" | "q2", value: Answer) => void;
  onRetry: (id: string) => void;
}) {
  const setNote = useProgress((s) => s.setNote);
  const notes = useProgress((s) => s.notes);
  const { measure } = state;
  const [verdict, setVerdict] = useState<"hold" | "wrong" | null>(null);
  const [clueOpen, setClueOpen] = useState(false);

  useEffect(() => {
    setVerdict(null);
    setClueOpen(false);
  }, [state.q1, state.q2]);

  /**
   * Check at the level of the initiative, not the question. Both diagnostics
   * are yes/no, so saying which answer failed would simply be the answer
   * (CLAUDE.md #4). The clue behind the second click gives a direction for
   * both questions.
   */
  const runCheck = () => {
    if (!state.q1 || !state.q2) {
      scrollToAndFlash(!state.q1 ? domId.q1(measure.id) : domId.q2(measure.id));
      return;
    }
    const holds = !!state.q1Correct && !!state.q2Correct;
    if (!holds) setNote(R2.retries(measure.id), String(state.retries + 1));
    setVerdict(holds ? "hold" : "wrong");
  };

  const quadrant = state.placed ? quadrantById(state.placed) : null;

  return (
    <li
      id={domId.mapMeasure(measure.id)}
      className={clsx("scroll-mt-24 rounded-xl border bg-paper transition-colors duration-150", open ? "border-accent/50 shadow-sm" : "border-line")}
    >
      <button type="button" onClick={onToggle} aria-expanded={open} className="flex w-full items-start gap-3 p-3 text-left">
        <span
          className={clsx(
            "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-caption font-bold",
            state.placed ? "bg-accent text-paper" : "bg-mist text-ash",
          )}
        >
          {measure.id.toUpperCase()}
        </span>
        <span className="min-w-0 flex-1">
          <span className="block text-caption font-semibold text-ink">{measure.label.split(" — ")[1]}</span>
          <span className="mt-0.5 block text-micro text-ash">{measure.detail}</span>
          <span
            className={clsx(
              "mt-1 inline-block rounded-full px-2 py-0.5 text-micro font-semibold",
              quadrant ? "bg-accentSoft text-accent" : "border border-line text-ash",
            )}
          >
            {quadrant ? `On the map: ${quadrant.label}` : "Not placed — answer both questions"}
          </span>
        </span>
        <ChevronDown className={clsx("mt-1 h-4 w-4 shrink-0 text-ash transition-transform duration-150", open && "rotate-180")} />
      </button>

      {open && (
        <div className="reveal-in space-y-4 border-t border-line p-3">
          {(["q1", "q2"] as const).map((qk) => {
            const q = MAP_QUESTIONS[qk];
            const value = qk === "q1" ? state.q1 : state.q2;
            return (
              <div key={qk} id={qk === "q1" ? domId.q1(measure.id) : domId.q2(measure.id)} className="scroll-mt-24">
                <p className="text-caption font-semibold text-ink">
                  <span className="text-ash">{q.label} · </span>
                  {q.question}
                </p>
                <p className="mt-0.5 text-micro text-ash">{q.instruction}</p>
                <div className="mt-2 grid gap-2 sm:grid-cols-2">
                  {(["yes", "no"] as const).map((v) => {
                    const on = value === v;
                    return (
                      <button
                        key={v}
                        type="button"
                        onClick={() => onAnswer(measure.id, qk, v)}
                        aria-pressed={on}
                        className={clsx(
                          "rounded-xl border p-2.5 text-left text-caption transition-colors duration-150",
                          on ? "border-accent bg-accentSoft font-semibold text-accent" : "border-line bg-canvas text-ink hover:border-ash",
                        )}
                      >
                        {v === "yes" ? q.yes : q.no}
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}

          <div>
            <div className="flex flex-wrap items-center gap-2">
              <button type="button" onClick={runCheck} className="btn-ghost">
                {state.retries > 0 || verdict ? "Check again" : "Check my answers"}
              </button>
              {state.placed && (
                <button
                  type="button"
                  onClick={() => onRetry(measure.id)}
                  className="text-micro font-semibold text-accent underline decoration-dotted underline-offset-2 hover:text-accentHi"
                >
                  Remove from the map and retry
                </button>
              )}
            </div>

            {verdict === "hold" && (
              <p className="reveal-in mt-2 rounded-xl border border-accent/30 bg-accentSoft px-3 py-2 text-caption text-ink">
                Both answers hold up for this initiative.
              </p>
            )}
            {verdict === "wrong" && (
              <div className="reveal-in mt-2 rounded-xl border border-warn/40 bg-warn/5 px-3 py-2">
                <p className="text-caption text-ink">{MAP_EXERCISE.wrongText}</p>
                <button
                  type="button"
                  onClick={() => setClueOpen((v) => !v)}
                  className="mt-1.5 inline-flex items-center gap-1 text-micro font-semibold text-accent hover:text-accentHi"
                >
                  <Help className="h-3.5 w-3.5" />
                  {clueOpen ? "Hide clue" : MAP_EXERCISE.clueLabel}
                </button>
                {clueOpen && (
                  <div className="reveal-in mt-1.5 space-y-1 rounded-lg border border-accent/25 bg-accentSoft px-2.5 py-1.5">
                    <p className="text-caption text-ink">
                      <span className="font-semibold">Momentum cost: </span>
                      {measure.q1Clue}
                    </p>
                    <p className="text-caption text-ink">
                      <span className="font-semibold">Structural impact: </span>
                      {measure.q2Clue}
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>

          {state.placed === "bet" && (
            <div id={domId.bet(measure.id)} className="reveal-in scroll-mt-24">
              <label htmlFor={`bet-${measure.id}`} className="block text-caption font-semibold text-ink">
                {MAP_EXERCISE.betField.label}
              </label>
              <p className="mt-0.5 text-micro text-ash">{MAP_EXERCISE.betField.instruction}</p>
              <input
                id={`bet-${measure.id}`}
                type="text"
                value={notes[R2.bet(measure.id)] ?? ""}
                onChange={(e) => setNote(R2.bet(measure.id), e.target.value)}
                placeholder={MAP_EXERCISE.betField.placeholder}
                className="mt-2 w-full rounded-xl border border-line bg-paper px-3 py-2.5 text-caption text-ink"
              />
            </div>
          )}

          <AnswerKey block={measure.answerKey} />
        </div>
      )}
    </li>
  );
}
