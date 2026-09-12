"use client";

import clsx from "clsx";
import { useProgress } from "@/lib/store";
import {
  R1,
  FINDINGS,
  ZONES,
  DRIVER_OPTIONS,
  HORIZON_OPTIONS,
  DRIVER_QUESTION,
  HORIZON_QUESTION,
  FINDING_ANSWER_KEYS,
  OVERALL_PATTERN_NOTE,
  type DriverId,
  type HorizonId,
} from "@/lib/route1";
import { useRoute1 } from "./useRoute1";
import { DiagnosisQuadrantSvg } from "./DiagnosisQuadrantSvg";
import { ClueToggle } from "@/components/ui/ClueToggle";
import { AnswerKey, AnswerKeyNote } from "@/components/ui/AnswerKey";

const letterOf = (zoneId: string) => ZONES.find((z) => z.id === zoneId)?.letter ?? "?";

/**
 * Stage 2 — two forced choices per finding. The learner never places anything
 * on the matrix directly: they decide what the finding *is*, and the matrix
 * position is the consequence of those two answers.
 */
export function DiagnosisBoard() {
  const r1 = useRoute1();
  const choose = useProgress((s) => s.choose);

  const available = r1.loggedFindings;

  if (available.length === 0) {
    return (
      <p className="rounded-xl border border-dashed border-line bg-canvas p-4 text-caption text-ash">
        Nothing to diagnose yet — investigate the rooms in Stage 1 first.
      </p>
    );
  }

  return (
    <div>
      <div className="card p-4">
        <DiagnosisQuadrantSvg driver={r1.driver} horizon={r1.horizon} />
      </div>

      {r1.diagnosedCount > 0 && (
        <div className="mt-3 flex flex-wrap gap-x-6 gap-y-1 rounded-xl border border-line bg-canvas px-4 py-3 text-caption text-ash">
          <p>
            Driver so far:{" "}
            <span className="font-semibold tabular-nums text-ink">{r1.structuralCount}</span> structural ·{" "}
            <span className="font-semibold tabular-nums text-ink">{r1.individualCount}</span> individual
          </p>
          <p>
            Horizon so far:{" "}
            <span className="font-semibold tabular-nums text-ink">{r1.shortTermCount}</span> short-term ·{" "}
            <span className="font-semibold tabular-nums text-ink">{r1.structuralChangeCount}</span> structural change
          </p>
        </div>
      )}

      <div className="mt-4 space-y-3">
        {available.map((f) => {
          const driver = r1.driver[f.id];
          const horizon = r1.horizon[f.id];
          const done = driver && horizon;
          const key = FINDING_ANSWER_KEYS[f.id];

          return (
            <div
              key={f.id}
              className={clsx(
                "rounded-2xl border p-4",
                done ? "border-accent/40 bg-accentSoft/25" : "border-line bg-paper",
              )}
            >
              <div className="flex items-start gap-2.5">
                <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-accent text-micro font-semibold text-paper">
                  {letterOf(f.zoneId)}
                </span>
                <p className="flex-1 text-caption text-ink">{f.text}</p>
              </div>

              <div className="mt-3 grid gap-4 sm:grid-cols-2">
                <div>
                  <p className="text-micro font-semibold text-ink">{DRIVER_QUESTION}</p>
                  <p className="mt-0.5 text-micro text-ash">Pick one — this sets the finding&apos;s horizontal position.</p>
                  <div className="mt-1.5 flex flex-wrap gap-1.5">
                    {DRIVER_OPTIONS.map((o) => (
                      <button
                        key={o.id}
                        type="button"
                        onClick={() => choose(R1.stage2.driver(f.id), o.id)}
                        aria-pressed={driver === o.id}
                        className={clsx(
                          "rounded-full border px-2.5 py-1 text-micro font-medium transition-colors duration-150",
                          driver === o.id
                            ? "border-accent bg-accent text-paper"
                            : "border-line bg-paper text-ash hover:border-ash hover:text-ink",
                        )}
                      >
                        {o.label}
                      </button>
                    ))}
                  </div>
                  <ClueToggle clue={f.driverClue} />
                </div>

                <div>
                  <p className="text-micro font-semibold text-ink">{HORIZON_QUESTION}</p>
                  <p className="mt-0.5 text-micro text-ash">Pick one — this sets the finding&apos;s vertical position.</p>
                  <div className="mt-1.5 flex flex-wrap gap-1.5">
                    {HORIZON_OPTIONS.map((o) => (
                      <button
                        key={o.id}
                        type="button"
                        onClick={() => choose(R1.stage2.horizon(f.id), o.id)}
                        aria-pressed={horizon === o.id}
                        className={clsx(
                          "rounded-full border px-2.5 py-1 text-micro font-medium transition-colors duration-150",
                          horizon === o.id
                            ? "border-accent bg-accent text-paper"
                            : "border-line bg-paper text-ash hover:border-ash hover:text-ink",
                        )}
                      >
                        {o.label}
                      </button>
                    ))}
                  </div>
                  <ClueToggle clue={f.horizonClue} />
                </div>
              </div>

              {key && <AnswerKey block={key} />}
            </div>
          );
        })}
      </div>

      <AnswerKeyNote label="Expected overall pattern" text={OVERALL_PATTERN_NOTE} />
    </div>
  );
}
