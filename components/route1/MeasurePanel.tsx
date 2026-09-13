"use client";

import clsx from "clsx";
import { useProgress } from "@/lib/store";
import { Slider } from "@/components/ui/Slider";
import { RadarChart, RadarLegend } from "@/components/ui/RadarChart";
import { MaterialRefs } from "@/components/ui/MaterialRefs";
import { AnswerKey } from "@/components/ui/AnswerKey";
import { Check } from "@/components/icons/LineIcons";
import {
  DIMENSIONS,
  PART_TWO,
  PREDICT_MAX,
  R1,
  RADAR_AXES,
  materialRefs,
} from "@/lib/route1";
import { useRoute1, domId, type MeasureState } from "./useRoute1";

/** Gaps at or above this are worth a sentence after the reveal. */
const GAP_THRESHOLD = 3;

/**
 * One measure, worked in three steps: answer the situational question, predict
 * the seven-dimension profile, then reveal the real one.
 *
 * The situational question comes first by design (CURRICULUM-GUIDE §5): the
 * prediction has to fall out of reasoning about the measure under the stated
 * constraints, not out of a free guess. The reveal carries no score and no
 * right/wrong language — the gap between the dashed and the solid polygon is
 * the teaching material, and it speaks for itself.
 */
export function MeasurePanel({ state }: { state: MeasureState }) {
  const { measure } = state;
  const choose = useProgress((s) => s.choose);
  const markSeen = useProgress((s) => s.markSeen);
  const r1 = useRoute1();

  const chosen = measure.situational.options.find((o) => o.id === state.situational) ?? null;

  const gaps = DIMENSIONS.map((d) => {
    const predicted = state.prediction[d.key];
    if (!predicted) return null;
    const actual = measure.profile[d.key];
    return { dimension: d, predicted, actual, gap: actual - predicted };
  })
    .filter((g): g is NonNullable<typeof g> => g !== null)
    .filter((g) => Math.abs(g.gap) >= GAP_THRESHOLD)
    .sort((a, b) => Math.abs(b.gap) - Math.abs(a.gap));

  return (
    <div id={domId.measure(measure.id)} className="scroll-mt-24 space-y-6">
      {/* What the measure is */}
      <div className="rounded-2xl border border-line bg-mist p-4">
        <p className="text-caption font-semibold text-ink">
          Measure {measure.id} — {measure.name}
        </p>
        <p className="mt-1 max-w-prose text-caption text-ash">{measure.summary}</p>
        <ul className="mt-2 space-y-1">
          {measure.detail.map((d) => (
            <li key={d} className="flex gap-2 text-caption text-ash">
              <span className="mt-[7px] h-1 w-1 shrink-0 rounded-full bg-ash" />
              <span>{d}</span>
            </li>
          ))}
        </ul>
        <MaterialRefs refs={materialRefs(measure.material)} />
      </div>

      {/* Step 1 — situational question */}
      <div id={domId.situational(measure.id)} className="scroll-mt-24">
        <p className="text-caption font-semibold text-ink">
          <span className="text-ash">Step 1 · </span>
          {measure.situational.question}
        </p>
        <p className="mt-0.5 text-micro text-ash">{measure.situational.instruction}</p>
        <ul className="mt-2 space-y-2">
          {measure.situational.options.map((o) => {
            const on = state.situational === o.id;
            return (
              <li key={o.id}>
                <button
                  type="button"
                  onClick={() => choose(R1.situational(measure.id), o.id)}
                  aria-pressed={on}
                  className={clsx(
                    "w-full rounded-xl border p-3 text-left transition-colors duration-150",
                    on ? "border-accent bg-accentSoft" : "border-line bg-canvas hover:border-ash",
                  )}
                >
                  <span className={clsx("text-caption", on ? "font-semibold text-ink" : "text-ink")}>
                    {o.text}
                  </span>
                  {on && (
                    <span className="reveal-in mt-1.5 block text-caption text-ash">{o.feedback}</span>
                  )}
                </button>
              </li>
            );
          })}
        </ul>
        <AnswerKey block={measure.situational.answerKey} />
      </div>

      {/* Step 2 + 3 — predict, then reveal */}
      <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,320px)_minmax(0,1fr)]">
        <div id={domId.predict(measure.id)} className="scroll-mt-24 min-w-0">
          <p className="text-caption font-semibold text-ink">
            <span className="text-ash">Step 2 · </span>Predict the profile
          </p>
          <p className="mt-0.5 text-micro text-ash">{PART_TWO.predictInstruction}</p>
          <div className="mt-2 divide-y divide-line">
            {DIMENSIONS.map((d) => (
              <Slider
                key={d.key}
                id={`pred-${measure.id}-${d.key}`}
                label={d.name}
                instruction={d.question}
                min={1}
                max={PREDICT_MAX}
                value={state.prediction[d.key] ?? 0}
                onChange={(v) => choose(R1.predict(measure.id, d.key), String(v))}
                lowLabel="1"
                highLabel={String(PREDICT_MAX)}
              />
            ))}
          </div>
        </div>

        <div className="min-w-0 space-y-3">
          {/* The prediction, with the real profile fading in on top */}
          <div className="relative">
            <RadarChart
              title={`Measure ${measure.id} — predicted profile`}
              max={PREDICT_MAX}
              ringCount={5}
              axes={RADAR_AXES}
              series={[
                {
                  id: "prediction",
                  label: "Your prediction",
                  values: state.prediction as Record<string, number>,
                  tone: "ghost",
                },
              ]}
            />
            <div
              className="pointer-events-none absolute inset-0"
              style={{ opacity: state.revealed ? 1 : 0, transition: "opacity 600ms ease" }}
              aria-hidden={!state.revealed}
            >
              <RadarChart
                title={`Measure ${measure.id} — real profile`}
                max={PREDICT_MAX}
                ringCount={5}
                showGrid={false}
                axes={RADAR_AXES}
                series={[
                  {
                    id: "real",
                    label: "Real profile",
                    values: measure.profile as Record<string, number>,
                    tone: "real",
                  },
                ]}
              />
            </div>
          </div>

          <RadarLegend ghostLabel="Your prediction" realLabel="Real profile" />
          <p className="rounded-lg border border-warn/40 bg-warn/5 px-3 py-1.5 text-micro text-ink">
            {PART_TWO.invertedNote}
          </p>

          <div id={domId.reveal(measure.id)} className="scroll-mt-24">
            {state.revealed ? (
              <p className="inline-flex items-center gap-1.5 text-caption font-semibold text-accent">
                <Check className="h-4 w-4" />
                {PART_TWO.revealedLabel}
              </p>
            ) : (
              <button
                type="button"
                onClick={() => markSeen(R1.revealed, measure.id)}
                className="btn-accent"
              >
                {PART_TWO.revealLabel}
              </button>
            )}
          </div>

          {state.revealed && (
            <div className="reveal-in space-y-2">
              <p className="text-micro font-semibold uppercase tracking-wide text-ash">
                {PART_TWO.gapHeading}
              </p>
              {gaps.length === 0 ? (
                <p className="text-caption text-ash">{PART_TWO.gapEmpty}</p>
              ) : (
                <ul className="space-y-2">
                  {gaps.map((g) => (
                    <li key={g.dimension.key} className="rounded-xl border border-line bg-canvas p-3">
                      <p className="flex flex-wrap items-baseline gap-x-2 text-caption font-semibold text-ink">
                        {g.dimension.name}
                        <span className="text-micro font-normal text-ash">
                          you predicted <span className="tabular-nums">{g.predicted}</span> · real{" "}
                          <span className="tabular-nums text-accent">{g.actual}</span>
                        </span>
                      </p>
                      <p className="mt-1 text-caption text-ash">{measure.reveal[g.dimension.key]}</p>
                    </li>
                  ))}
                </ul>
              )}
              {r1.hydrated && (
                <details className="rounded-xl border border-line bg-canvas p-3">
                  <summary className="cursor-pointer text-caption font-semibold text-ink">
                    All seven dimensions, with the reasoning behind the real profile
                  </summary>
                  <ul className="mt-2 space-y-1.5">
                    {DIMENSIONS.map((d) => (
                      <li key={d.key} className="text-caption text-ash">
                        <span className="font-semibold text-ink">{d.name}: </span>
                        {measure.reveal[d.key]}
                      </li>
                    ))}
                  </ul>
                </details>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
