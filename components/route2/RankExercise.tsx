"use client";

import { useState } from "react";
import clsx from "clsx";
import { useProgress } from "@/lib/store";
import { createPlacementHistory, type PlacementMap } from "@/lib/usePlacementHistory";
import { scrollToAndFlash } from "@/lib/scrollToAndFlash";
import { AnswerKey } from "@/components/ui/AnswerKey";
import { ChevronDown, Close, Help, Redo, Undo } from "@/components/icons/LineIcons";
import { GUIDING_DECISIONS, R2, RANK_EXERCISE, RANK_SLOTS, decisionById } from "@/lib/route2";
import { ExerciseHeader } from "./ExerciseHeader";
import { useRoute2, domId } from "./useRoute2";

/** This exercise's own history — never shared with the map's (see usePlacementHistory). */
const useRankHistory = createPlacementHistory();

/**
 * Exercise 1 — rank three of seven guiding decisions and justify the first.
 *
 * Click to add (positions fill 1 → 3), click a ranked item to remove it, arrows
 * to reorder, full undo/redo. Nothing is ever auto-sorted. "Test my ranking"
 * deliberately does not grade the order — there is no single correct one — it
 * asks one diagnostic question about the learner's own #1.
 */
export function RankExercise() {
  const r2 = useRoute2();
  const setNote = useProgress((s) => s.setNote);
  const choose = useProgress((s) => s.choose);
  const notes = useProgress((s) => s.notes);

  const record = useRankHistory((s) => s.recordChange);
  const undo = useRankHistory((s) => s.undo);
  const redo = useRankHistory((s) => s.redo);

  const [fullNote, setFullNote] = useState(false);
  const [noop, setNoop] = useState<string | null>(null);
  const [testOpen, setTestOpen] = useState(false);
  const [clueOpen, setClueOpen] = useState(false);

  const snapshot = (): PlacementMap => ({ ranking: r2.ranking.join("|") });

  const commit = (next: string[]) => {
    record(snapshot());
    setNote(R2.ranking, next.join("|"));
    setFullNote(false);
    setClueOpen(false);
  };

  const add = (id: string) => {
    if (r2.ranking.includes(id)) return;
    if (r2.ranking.length >= RANK_SLOTS) {
      setFullNote(true);
      scrollToAndFlash(domId.rankSlots);
      return;
    }
    commit([...r2.ranking, id]);
  };

  const remove = (id: string) => commit(r2.ranking.filter((x) => x !== id));

  const move = (index: number, dir: -1 | 1) => {
    const target = index + dir;
    if (target < 0 || target >= r2.ranking.length) return;
    const next = [...r2.ranking];
    [next[index], next[target]] = [next[target], next[index]];
    commit(next);
  };

  const flashNoop = (text: string) => {
    setNoop(text);
    window.setTimeout(() => setNoop(null), 1400);
  };

  const doUndo = () => {
    const snap = undo(snapshot());
    if (snap) setNote(R2.ranking, snap.ranking ?? "");
    else flashNoop("Nothing to undo yet.");
  };

  const doRedo = () => {
    const snap = redo(snapshot());
    if (snap) setNote(R2.ranking, snap.ranking ?? "");
    else flashNoop("Nothing to redo.");
  };

  const first = r2.ranking[0] ? decisionById(r2.ranking[0]) : null;
  const check = RANK_EXERCISE.check;

  return (
    <section id={domId.rank} className="scroll-mt-24 space-y-4 rounded-2xl border border-line bg-paper p-5">
      <ExerciseHeader
        n={RANK_EXERCISE.n}
        title={RANK_EXERCISE.title}
        minutes={RANK_EXERCISE.minutes}
        intro={RANK_EXERCISE.intro}
        material={RANK_EXERCISE.material}
      />

      {/* The three positions */}
      <div id={domId.rankSlots} className="scroll-mt-24 rounded-xl border border-line bg-canvas p-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <p className="text-micro font-semibold uppercase tracking-wide text-ash">Your top three</p>
          <div className="flex items-center gap-1.5">
            {noop && <span className="reveal-in text-micro text-ash">{noop}</span>}
            <button
              type="button"
              onClick={doUndo}
              className="inline-flex items-center gap-1 rounded-lg border border-line bg-paper px-2 py-1 text-micro font-semibold text-ash hover:text-ink"
            >
              <Undo className="h-3.5 w-3.5" /> Undo
            </button>
            <button
              type="button"
              onClick={doRedo}
              className="inline-flex items-center gap-1 rounded-lg border border-line bg-paper px-2 py-1 text-micro font-semibold text-ash hover:text-ink"
            >
              <Redo className="h-3.5 w-3.5" /> Redo
            </button>
          </div>
        </div>

        <ol className="mt-2 space-y-2">
          {Array.from({ length: RANK_SLOTS }).map((_, i) => {
            const id = r2.ranking[i];
            const d = id ? decisionById(id) : null;
            return (
              <li key={i}>
                {d ? (
                  <div className="reveal-in flex items-start gap-2 rounded-xl border border-accent/40 bg-paper p-2.5">
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-accent text-caption font-bold text-paper">
                      {i + 1}
                    </span>
                    <button
                      type="button"
                      onClick={() => remove(d.id)}
                      title="Remove from the ranking"
                      className="min-w-0 flex-1 text-left"
                    >
                      <span className="block text-caption font-semibold text-ink">{d.label}</span>
                      <span className="block text-micro text-ash">{d.detail}</span>
                    </button>
                    <div className="flex shrink-0 items-center gap-1">
                      <button
                        type="button"
                        onClick={() => move(i, -1)}
                        aria-label={`Move ${d.label} up`}
                        className="rounded-md border border-line p-1 text-ash hover:text-ink"
                      >
                        <ChevronDown className="h-3.5 w-3.5 rotate-180" />
                      </button>
                      <button
                        type="button"
                        onClick={() => move(i, 1)}
                        aria-label={`Move ${d.label} down`}
                        className="rounded-md border border-line p-1 text-ash hover:text-ink"
                      >
                        <ChevronDown className="h-3.5 w-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => remove(d.id)}
                        aria-label={`Remove ${d.label}`}
                        className="rounded-md border border-line p-1 text-ash hover:text-danger"
                      >
                        <Close className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 rounded-xl border border-dashed border-line bg-paper p-2.5">
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-mist text-caption font-bold text-ash">
                      {i + 1}
                    </span>
                    <span className="text-caption text-ash">Empty — click a candidate below to fill it.</span>
                  </div>
                )}
              </li>
            );
          })}
        </ol>

        {fullNote && (
          <p className="reveal-in mt-2 rounded-lg bg-warn/10 px-2.5 py-1.5 text-micro text-warn">
            All three positions are taken. Remove one first, then add the candidate you want in its place.
          </p>
        )}
      </div>

      {/* Candidates */}
      <div>
        <p className="text-micro font-semibold uppercase tracking-wide text-ash">The seven candidates</p>
        <ul className="mt-2 grid gap-2 md:grid-cols-2">
          {GUIDING_DECISIONS.map((d) => {
            const pos = r2.ranking.indexOf(d.id);
            const ranked = pos >= 0;
            return (
              <li key={d.id}>
                <button
                  type="button"
                  onClick={() => (ranked ? remove(d.id) : add(d.id))}
                  aria-pressed={ranked}
                  className={clsx(
                    "flex h-full w-full items-start gap-2 rounded-xl border p-3 text-left transition-colors duration-150",
                    ranked ? "border-accent bg-accentSoft" : "border-line bg-canvas hover:border-ash",
                  )}
                >
                  <span
                    className={clsx(
                      "flex h-6 w-6 shrink-0 items-center justify-center rounded-md text-micro font-bold",
                      ranked ? "bg-accent text-paper" : "bg-paper text-ash",
                    )}
                  >
                    {ranked ? `#${pos + 1}` : d.n}
                  </span>
                  <span>
                    <span className={clsx("block text-caption font-semibold", ranked ? "text-accent" : "text-ink")}>
                      {d.label}
                    </span>
                    <span className="mt-0.5 block text-micro text-ash">{d.detail}</span>
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      </div>

      {/* Justify #1 */}
      <div id={domId.rankWhy} className="scroll-mt-24">
        <label htmlFor="r2-rank-why-field" className="block text-caption font-semibold text-ink">
          {RANK_EXERCISE.justify.label}
          {first && <span className="font-normal text-ash"> — {first.label}</span>}
        </label>
        <p className="mt-0.5 text-micro text-ash">{RANK_EXERCISE.justify.instruction}</p>
        <textarea
          id="r2-rank-why-field"
          rows={3}
          value={r2.hydrated ? (notes[R2.rankWhy] ?? "") : ""}
          onChange={(e) => setNote(R2.rankWhy, e.target.value)}
          placeholder={RANK_EXERCISE.justify.placeholder}
          className="mt-2 w-full rounded-xl border border-line bg-paper px-3 py-2.5 text-caption text-ink"
        />
      </div>

      {/* Test my ranking — never grades the order */}
      <div id={domId.rankCheck} className="scroll-mt-24">
        <button
          type="button"
          onClick={() => {
            setTestOpen(true);
            if (!first) scrollToAndFlash(domId.rankSlots);
          }}
          className="btn-ghost"
        >
          {check.label}
        </button>

        {testOpen && !first && (
          <p className="reveal-in mt-2 text-caption text-ash">
            Put a decision in position 1 first — the test asks about your own first choice, not about the order.
          </p>
        )}

        {testOpen && first && (
          <div className="reveal-in mt-2 space-y-2 rounded-xl border border-line bg-canvas p-3">
            <p className="text-caption text-ink">
              Your #1: <span className="font-semibold">{first.label}</span>
            </p>
            <p className="text-caption font-semibold text-ink">{check.question}</p>
            <div className="grid gap-2 sm:grid-cols-2">
              {check.options.map((o) => {
                const on = r2.rankCheck === o.id;
                return (
                  <button
                    key={o.id}
                    type="button"
                    onClick={() => choose(R2.rankCheck, o.id)}
                    aria-pressed={on}
                    className={clsx(
                      "rounded-xl border p-2.5 text-left text-caption transition-colors duration-150",
                      on ? "border-accent bg-accentSoft font-semibold text-accent" : "border-line bg-paper text-ink hover:border-ash",
                    )}
                  >
                    {o.text}
                  </button>
                );
              })}
            </div>
            {r2.rankCheck && (
              <p className="reveal-in text-caption text-ash">
                {r2.rankCheck === "required" ? check.feedbackRequired : check.feedbackOnce}
              </p>
            )}
            <button
              type="button"
              onClick={() => setClueOpen((v) => !v)}
              className="inline-flex items-center gap-1 text-micro font-semibold text-accent hover:text-accentHi"
            >
              <Help className="h-3.5 w-3.5" />
              {clueOpen ? "Hide clue" : "Need a clue?"}
            </button>
            {clueOpen && (
              <p className="reveal-in rounded-lg border border-accent/25 bg-accentSoft px-2.5 py-1.5 text-caption text-ink">
                {check.clue}
              </p>
            )}
          </div>
        )}
      </div>

      <AnswerKey block={RANK_EXERCISE.answerKey} />
    </section>
  );
}
