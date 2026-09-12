"use client";

import { useState } from "react";
import clsx from "clsx";
import { useProgress } from "@/lib/store";
import { MENTOR_PASSCODE } from "@/lib/mentorPasscode";

/**
 * Mentor-only: unlocks the answer-key block sitting next to every forced-choice
 * exercise on this route. The unlock flag lives in the store's session slice,
 * so a reload re-locks it and a learner can't inherit an open key.
 */
export function AnswerKeyButton() {
  const unlocked = useProgress((s) => s.answerKeyUnlocked);
  const setUnlocked = useProgress((s) => s.setAnswerKeyUnlocked);
  const [open, setOpen] = useState(false);
  const [code, setCode] = useState("");
  const [error, setError] = useState(false);

  const submit = () => {
    if (code === MENTOR_PASSCODE) {
      setUnlocked(true);
      setOpen(false);
      setCode("");
      setError(false);
    } else {
      setError(true);
    }
  };

  if (unlocked) {
    return (
      <div className="flex items-center gap-2">
        <span className="rounded-full border border-warn/40 bg-warn/10 px-3 py-1 text-micro font-semibold text-warn">
          Answer keys visible
        </span>
        <button
          type="button"
          onClick={() => setUnlocked(false)}
          className="text-micro text-ash transition-colors duration-150 hover:text-ink"
        >
          Hide
        </button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      {!open ? (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="rounded-full border border-dashed border-line px-3 py-1 text-micro font-semibold text-ash transition-colors duration-150 hover:border-ash hover:text-ink"
        >
          Mentor: show answer keys
        </button>
      ) : (
        <div className="flex items-center gap-2 rounded-full border border-line bg-paper px-2 py-1 shadow-sm">
          <input
            type="password"
            value={code}
            onChange={(e) => {
              setCode(e.target.value);
              setError(false);
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") submit();
              if (e.key === "Escape") setOpen(false);
            }}
            placeholder="Passcode"
            autoFocus
            className={clsx(
              "w-28 rounded-full border bg-paper px-2 py-0.5 text-micro text-ink",
              error ? "border-danger" : "border-line",
            )}
          />
          <button type="button" onClick={submit} className="text-micro font-semibold text-accent">
            Go
          </button>
          <button
            type="button"
            onClick={() => {
              setOpen(false);
              setCode("");
              setError(false);
            }}
            aria-label="Cancel"
            className="text-micro text-ash hover:text-ink"
          >
            ×
          </button>
        </div>
      )}
      {error && <p className="text-micro text-danger">Wrong passcode.</p>}
    </div>
  );
}
