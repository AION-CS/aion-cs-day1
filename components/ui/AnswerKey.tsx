"use client";

import { useProgress } from "@/lib/store";
import type { AnswerKeyBlock } from "@/lib/answerKey";

/**
 * Renders one answer key, but only while a mentor has unlocked them. Styled in
 * `warn` on purpose — never the accent, which the learner's own interactive
 * surfaces own, so a key can never be mistaken for learner content.
 */
export function AnswerKey({ block }: { block: AnswerKeyBlock }) {
  const unlocked = useProgress((s) => s.answerKeyUnlocked);
  if (!unlocked) return null;

  return (
    <div className="reveal-in mt-2 rounded-xl border border-warn/40 bg-warn/5 p-3">
      <p className="text-micro font-semibold uppercase tracking-wide text-warn">
        Mentor answer key · {block.prompt}
      </p>
      <ul className="mt-2 space-y-1.5">
        {block.items.map((item) => (
          <li key={item.option} className="flex gap-2 text-caption text-ink">
            <span
              className={
                item.verdict === "pick"
                  ? "mt-[2px] shrink-0 font-semibold text-warn"
                  : "mt-[2px] shrink-0 text-ash"
              }
            >
              {item.verdict === "pick" ? "✓" : "✕"}
            </span>
            <span>
              <span className="font-semibold">{item.option} — </span>
              {item.why}
            </span>
          </li>
        ))}
      </ul>
      {block.teachingNote && (
        <p className="mt-2 border-t border-warn/25 pt-2 text-caption italic text-ash">
          <span className="font-semibold not-italic text-warn">Teaching note. </span>
          {block.teachingNote}
        </p>
      )}
    </div>
  );
}

/** A standalone mentor note with no option list — for free-text steps that still need guidance. */
export function AnswerKeyNote({ label, text }: { label: string; text: string }) {
  const unlocked = useProgress((s) => s.answerKeyUnlocked);
  if (!unlocked) return null;
  return (
    <div className="reveal-in mt-2 rounded-xl border border-warn/40 bg-warn/5 p-3">
      <p className="text-micro font-semibold uppercase tracking-wide text-warn">
        Mentor answer key · {label}
      </p>
      <p className="mt-1.5 text-caption text-ink">{text}</p>
    </div>
  );
}
