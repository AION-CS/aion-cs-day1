"use client";

import clsx from "clsx";
import type { MicroCheckBlock } from "@/lib/microCheck";
import { Check, Help } from "@/components/icons/LineIcons";

/** Feedback copy may already open with the verdict; the badge says it, so strip it from the sentence. */
const stripVerdict = (text: string) => text.replace(/^(Correct|Not quite)\.\s*/, "");

/**
 * A non-graded comprehension check at the end of a material section.
 *
 * Unlike a task exercise, it explains itself the moment an option is picked —
 * right or wrong — because its job is to confirm the reading before the task,
 * not to assess it. Answers persist, can be changed at any time, and are never
 * part of the route's missing list. The verdict is carried by an icon and a
 * word, never by colour alone.
 */
export function MicroCheck({
  block,
  anchorId,
  value,
  onAnswer,
}: {
  block: MicroCheckBlock;
  anchorId: string;
  value: (questionId: string) => string | null;
  onAnswer: (questionId: string, optionId: string) => void;
}) {
  const answered = block.questions.filter((q) => value(q.id)).length;

  return (
    <div id={anchorId} className="scroll-mt-24 rounded-2xl border border-line bg-mist p-5">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <p className="text-micro font-semibold uppercase tracking-wide text-accent">{block.title}</p>
        <p className="text-micro text-ash">
          {answered} of {block.questions.length} answered · not graded
        </p>
      </div>

      <ol className="mt-3 space-y-5">
        {block.questions.map((q, qi) => {
          const picked = value(q.id);
          const option = q.options.find((o) => o.id === picked) ?? null;
          return (
            <li key={q.id}>
              <p className="text-caption font-semibold text-ink">
                <span className="text-ash">Q{qi + 1} · </span>
                {q.prompt}
              </p>
              <div className="mt-2 grid gap-2">
                {q.options.map((o) => {
                  const on = picked === o.id;
                  return (
                    <button
                      key={o.id}
                      type="button"
                      onClick={() => onAnswer(q.id, o.id)}
                      aria-pressed={on}
                      className={clsx(
                        "rounded-xl border p-2.5 text-left text-caption text-ink transition-colors duration-150",
                        on
                          ? o.correct
                            ? "border-accent bg-accentSoft"
                            : "border-warn/60 bg-warn/5"
                          : "border-line bg-paper hover:border-ash",
                      )}
                    >
                      {o.text}
                    </button>
                  );
                })}
              </div>
              <div aria-live="polite">
                {option && (
                  <p
                    key={option.id}
                    className={clsx(
                      "reveal-in mt-2 flex gap-2 rounded-xl border bg-paper px-3 py-2 text-caption text-ink",
                      option.correct ? "border-accent/35" : "border-warn/40",
                    )}
                  >
                    <span
                      className={clsx(
                        "mt-[2px] inline-flex shrink-0 items-center gap-1 font-semibold",
                        option.correct ? "text-accent" : "text-warn",
                      )}
                    >
                      {option.correct ? <Check className="h-4 w-4" /> : <Help className="h-4 w-4" />}
                      {option.correct ? "Correct." : "Not quite."}
                    </span>
                    <span>{stripVerdict(option.feedback)}</span>
                  </p>
                )}
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
