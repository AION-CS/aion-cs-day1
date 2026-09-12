"use client";

import { useState } from "react";
import clsx from "clsx";
import { useProgress } from "@/lib/store";
import {
  R1,
  ZONES,
  CATEGORIES,
  DIRECTIONS,
  PRIORITY_PICK_COUNT,
  JUSTIFICATION_MIN_WORDS,
  PRIORITY_ANSWER_KEY,
  JUSTIFICATION_ANSWER_NOTE,
} from "@/lib/route1";
import { useRoute1 } from "./useRoute1";
import { AnswerKey, AnswerKeyNote } from "@/components/ui/AnswerKey";
import { Check } from "@/components/icons/LineIcons";

const letterOf = (zoneId: string) => ZONES.find((z) => z.id === zoneId)?.letter ?? "?";
const wordCount = (v: string) => v.trim().split(/\s+/).filter(Boolean).length;

/** Stage 3 — choose the first two moves, give each a direction, and justify it. */
export function PriorityPicker() {
  const r1 = useRoute1();
  const toggleCheck = useProgress((s) => s.toggleCheck);
  const choose = useProgress((s) => s.choose);
  const setNote = useProgress((s) => s.setNote);
  const [tooMany, setTooMany] = useState(false);

  const available = r1.loggedFindings;

  const onToggle = (findingId: string) => {
    const selected = r1.priorities.includes(findingId);
    if (selected) {
      toggleCheck(R1.stage3.priority(findingId), false);
      setTooMany(false);
      return;
    }
    if (r1.priorities.length >= PRIORITY_PICK_COUNT) {
      setTooMany(true);
      window.setTimeout(() => setTooMany(false), 2600);
      return;
    }
    toggleCheck(R1.stage3.priority(findingId), true);
  };

  if (available.length === 0) {
    return (
      <p className="rounded-xl border border-dashed border-line bg-canvas p-4 text-caption text-ash">
        Nothing to prioritise yet — investigate the rooms in Stage 1 first.
      </p>
    );
  }

  return (
    <div>
      <div className="flex items-baseline justify-between gap-3">
        <p className="text-caption text-ash">
          Select exactly {PRIORITY_PICK_COUNT} findings — the two you would act on first.
        </p>
        <p className="text-caption tabular-nums text-ash">
          Selected: <span className="font-semibold text-ink">{r1.priorities.length}</span> / {PRIORITY_PICK_COUNT}
        </p>
      </div>

      {tooMany && (
        <p className="reveal-in mt-2 rounded-lg border border-warn/40 bg-warn/10 px-3 py-2 text-micro text-warn">
          You already have {PRIORITY_PICK_COUNT} selected. Deselect one first — the constraint is the point: you are
          choosing what comes first, not listing everything worth doing.
        </p>
      )}

      <div className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
        {available.map((f) => {
          const selected = r1.priorities.includes(f.id);
          const categoryId = r1.category[f.id];
          const categoryLabel = CATEGORIES.find((c) => c.id === categoryId)?.label;
          return (
            <button
              key={f.id}
              type="button"
              onClick={() => onToggle(f.id)}
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
                {selected ? <Check className="h-3.5 w-3.5" /> : letterOf(f.zoneId)}
              </span>
              <span className="flex-1">
                <span className="block text-caption font-medium text-ink">{f.short}</span>
                {categoryLabel && <span className="mt-0.5 block text-micro text-ash">{categoryLabel}</span>}
              </span>
            </button>
          );
        })}
      </div>

      {r1.priorities.length > 0 && (
        <div className="mt-5 space-y-4">
          {available
            .filter((f) => r1.priorities.includes(f.id))
            .map((f) => {
              const justification = r1.justification[f.id] ?? "";
              const words = wordCount(justification);
              return (
                <div key={f.id} className="rounded-2xl border border-line bg-paper p-4">
                  <div className="flex items-start gap-2.5">
                    <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-accent text-micro font-semibold text-paper">
                      {letterOf(f.zoneId)}
                    </span>
                    <p className="flex-1 text-caption font-semibold text-ink">{f.short}</p>
                  </div>

                  <div className="mt-3">
                    <p className="text-micro font-semibold text-ink">Direction</p>
                    <p className="mt-0.5 text-micro text-ash">
                      Pick the kind of change this needs — not the wording of the action itself.
                    </p>
                    <div className="mt-1.5 grid gap-1.5 sm:grid-cols-3">
                      {DIRECTIONS.map((d) => {
                        const active = r1.direction[f.id] === d.id;
                        return (
                          <button
                            key={d.id}
                            type="button"
                            onClick={() => choose(R1.stage3.direction(f.id), d.id)}
                            aria-pressed={active}
                            className={clsx(
                              "rounded-xl border p-2.5 text-left transition-colors duration-150",
                              active ? "border-accent bg-accentSoft" : "border-line bg-paper hover:border-ash",
                            )}
                          >
                            <span className="block text-micro font-semibold text-ink">{d.label}</span>
                            <span className="mt-0.5 block text-micro text-ash">{d.hint}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div className="mt-3">
                    <label className="block">
                      <span className="text-micro font-semibold text-ink">Justification</span>
                      <p className="mt-0.5 text-micro text-ash">
                        One sentence, aimed at a manager: name the root cause this addresses and who has to act — not the
                        symptom. Minimum {JUSTIFICATION_MIN_WORDS} words.
                      </p>
                      <textarea
                        value={justification}
                        onChange={(e) => setNote(R1.stage3.justification(f.id), e.target.value)}
                        rows={2}
                        className="mt-1.5 w-full rounded-xl border border-line bg-paper px-3 py-2 text-caption text-ink"
                      />
                    </label>
                    <p
                      className={clsx(
                        "mt-1 text-micro tabular-nums",
                        words >= JUSTIFICATION_MIN_WORDS ? "text-accent" : "text-ash",
                      )}
                    >
                      {words} / {JUSTIFICATION_MIN_WORDS} words
                    </p>
                  </div>
                </div>
              );
            })}
        </div>
      )}

      <AnswerKey block={PRIORITY_ANSWER_KEY} />
      <AnswerKeyNote label="What a strong justification looks like" text={JUSTIFICATION_ANSWER_NOTE} />
    </div>
  );
}
