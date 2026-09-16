"use client";

import clsx from "clsx";
import { useProgress } from "@/lib/store";
import { AnswerKey } from "@/components/ui/AnswerKey";
import {
  ASSESSMENT_DIMENSIONS,
  MEASURE_LANES,
  PRIORITISE_ANSWER_KEY,
  PRIORITISE_EXERCISE,
  R2,
  RATING_LEVELS,
  type LaneId,
} from "@/lib/route2";
import { ExerciseHeader } from "./ExerciseHeader";
import { useRoute2, domId } from "./useRoute2";

/**
 * Exercise 1 — choose one line of measures and defend it.
 *
 * Free-text and argument-graded throughout (CLAUDE.md #4): there is no live
 * check, because "which lane is right" has no single answer — the mentor key
 * carries the assessment criteria and a worked strong/weak example instead.
 * The rating buttons cycle Low → Mid → High → blank, the same interaction
 * Route 1's material and Day 11's prediction grid use, but here there is no
 * ground truth to reveal against: the rating is a self-assessment that only
 * means something alongside the one-line argument beside it.
 */
export function PrioritiseExercise() {
  const r2 = useRoute2();
  const choose = useProgress((s) => s.choose);
  const setNote = useProgress((s) => s.setNote);
  const notes = useProgress((s) => s.notes);

  const selectLane = (id: LaneId) => choose(R2.prioritiseLane, id);

  return (
    <section id={domId.prioritise} className="scroll-mt-24 space-y-4 rounded-2xl border border-line bg-paper p-5">
      <ExerciseHeader
        n={PRIORITISE_EXERCISE.n}
        title={PRIORITISE_EXERCISE.title}
        minutes={PRIORITISE_EXERCISE.minutes}
        intro={PRIORITISE_EXERCISE.intro}
        material={PRIORITISE_EXERCISE.material}
      />

      {/* Choose a lane */}
      <div id={domId.lane} className="scroll-mt-24">
        <p className="text-caption font-semibold text-ink">{PRIORITISE_EXERCISE.laneHeading}</p>
        <div className="mt-2 grid gap-2 sm:grid-cols-3">
          {MEASURE_LANES.map((lane) => {
            const on = r2.lane === lane.id;
            return (
              <button
                key={lane.id}
                type="button"
                onClick={() => selectLane(lane.id)}
                aria-pressed={on}
                className={clsx(
                  "flex h-full flex-col items-start gap-1.5 rounded-xl border p-3 text-left transition-colors duration-150",
                  on ? "border-accent bg-accentSoft" : "border-line bg-canvas hover:border-ash",
                )}
              >
                <span className={clsx("text-caption font-semibold", on ? "text-accent" : "text-ink")}>{lane.label}</span>
                <span className="text-micro text-ash">{lane.mechanics}</span>
              </button>
            );
          })}
        </div>
      </div>

      {r2.chosenLane && (
        <>
          {/* Assessment grid */}
          <div id={domId.grid} className="scroll-mt-24 space-y-2">
            <p className="text-caption font-semibold text-ink">{PRIORITISE_EXERCISE.gridHeading}</p>
            <p className="text-micro text-ash">{PRIORITISE_EXERCISE.gridInstruction}</p>

            <div className="space-y-2">
              {ASSESSMENT_DIMENSIONS.map((dim) => {
                const row = r2.ratingRows.find((r) => r.dim.key === dim.key)!;
                return (
                  <div key={dim.key} id={domId.rating(dim.key)} className="scroll-mt-24 rounded-xl border border-line bg-canvas p-3">
                    <div className="flex flex-wrap items-start justify-between gap-2">
                      <div className="min-w-0">
                        <p className="text-caption font-semibold text-ink">{dim.label}</p>
                        <p className="mt-0.5 text-micro text-ash">{dim.question}</p>
                      </div>
                      <div className="flex shrink-0 gap-1">
                        {RATING_LEVELS.map((rl) => {
                          const on = row.rating === rl.id;
                          return (
                            <button
                              key={rl.id}
                              type="button"
                              onClick={() => choose(R2.rating(dim.key), rl.id)}
                              aria-pressed={on}
                              className={clsx(
                                "rounded-lg border px-2.5 py-1 text-micro font-semibold transition-colors duration-150",
                                on ? "border-accent bg-accent text-paper" : "border-line bg-paper text-ash hover:border-accent hover:text-accent",
                              )}
                            >
                              {rl.label}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                    <input
                      type="text"
                      value={notes[R2.ratingNote(dim.key)] ?? ""}
                      onChange={(e) => setNote(R2.ratingNote(dim.key), e.target.value)}
                      placeholder="One-line argument for this rating…"
                      className="mt-2 w-full rounded-lg border border-line bg-paper px-3 py-2 text-caption text-ink"
                    />
                  </div>
                );
              })}
            </div>
          </div>

          {/* Defend the choice */}
          <div id={domId.justify} className="scroll-mt-24">
            <label htmlFor="r2-prioritise-justify-field" className="block text-caption font-semibold text-ink">
              {PRIORITISE_EXERCISE.justify.label}
            </label>
            <p className="mt-0.5 text-micro text-ash">{PRIORITISE_EXERCISE.justify.instruction}</p>
            <textarea
              id="r2-prioritise-justify-field"
              rows={3}
              value={notes[R2.justification] ?? ""}
              onChange={(e) => setNote(R2.justification, e.target.value)}
              placeholder={PRIORITISE_EXERCISE.justify.placeholder}
              className="mt-2 w-full rounded-xl border border-line bg-paper px-3 py-2.5 text-caption text-ink"
            />
          </div>

          {/* Follow-up decisions */}
          <div id={domId.followUp} className="scroll-mt-24">
            <label htmlFor="r2-prioritise-followup-field" className="block text-caption font-semibold text-ink">
              {PRIORITISE_EXERCISE.followUp.label}
            </label>
            <p className="mt-0.5 text-micro text-ash">{PRIORITISE_EXERCISE.followUp.instruction}</p>
            <textarea
              id="r2-prioritise-followup-field"
              rows={2}
              value={notes[R2.followUp] ?? ""}
              onChange={(e) => setNote(R2.followUp, e.target.value)}
              placeholder={PRIORITISE_EXERCISE.followUp.placeholder}
              className="mt-2 w-full rounded-xl border border-line bg-paper px-3 py-2.5 text-caption text-ink"
            />
          </div>

          {/* Two risks */}
          <div>
            <label className="block text-caption font-semibold text-ink">{PRIORITISE_EXERCISE.risks.label}</label>
            <p className="mt-0.5 text-micro text-ash">{PRIORITISE_EXERCISE.risks.instruction}</p>
            <div className="mt-2 space-y-2">
              {([1, 2] as const).map((n) => (
                <div key={n} id={domId.risk(n)} className="scroll-mt-24">
                  <input
                    type="text"
                    value={notes[R2.risk(n)] ?? ""}
                    onChange={(e) => setNote(R2.risk(n), e.target.value)}
                    placeholder={PRIORITISE_EXERCISE.risks.placeholders[n - 1]}
                    className="w-full rounded-xl border border-line bg-paper px-3 py-2.5 text-caption text-ink"
                  />
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      <AnswerKey block={PRIORITISE_ANSWER_KEY} />
    </section>
  );
}
