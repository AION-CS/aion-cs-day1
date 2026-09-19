"use client";

import { useEffect, useRef, useState } from "react";
import { MENTOR_PASSCODE } from "@/data/mentorKey";
import { useStore } from "@/store/useStore";

/**
 * Mentor / QA autofill. A convenience gate in client code: the passcode ships
 * in plaintext, so this is not security and is never described as such. The
 * unlock flag lives in the session slice, so a reload re-locks it.
 */
export function MentorModal({ onClose }: { onClose: () => void }) {
  const unlocked = useStore((s) => s.mentorUnlocked);
  const setUnlocked = useStore((s) => s.setMentorUnlocked);
  const mentorFill = useStore((s) => s.mentorFill);
  const resetRoute1 = useStore((s) => s.resetRoute1);
  const [code, setCode] = useState("");
  const [error, setError] = useState(false);
  const [done, setDone] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    (unlocked ? closeRef.current : inputRef.current)?.focus();
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose, unlocked]);

  const submit = () => {
    if (code === MENTOR_PASSCODE) {
      setUnlocked(true);
      setError(false);
      setCode("");
    } else setError(true);
  };

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-ink/50 p-4" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <div role="dialog" aria-modal="true" aria-labelledby="mentor-title" className="card w-full max-w-sm space-y-3 p-5 shadow-lg">
        <div className="flex items-start justify-between gap-3">
          <h2 id="mentor-title" className="text-h3">
            Mentor
          </h2>
          <button ref={closeRef} type="button" onClick={onClose} className="btn-ghost btn-sm">
            Close
          </button>
        </div>
        {!unlocked ? (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              submit();
            }}
            className="space-y-2"
          >
            <label htmlFor="mentor-code" className="text-caption font-semibold">
              Passcode
            </label>
            <p className="text-caption text-ash">A convenience gate for facilitators and QA. It is a passcode in client code, not security.</p>
            <input
              ref={inputRef}
              id="mentor-code"
              type="password"
              autoComplete="off"
              className="field"
              value={code}
              onChange={(e) => {
                setCode(e.target.value);
                setError(false);
              }}
              aria-invalid={error}
            />
            {error && (
              <p role="alert" className="text-caption text-rust">
                Wrong passcode.
              </p>
            )}
            <button type="submit" className="btn-primary btn-sm">
              Unlock
            </button>
          </form>
        ) : (
          <div className="space-y-2">
            <p className="text-caption text-ash">Applies to Route 1 only. Your participant number and name are left as they are.</p>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                className="btn-primary btn-sm"
                onClick={() => {
                  mentorFill();
                  setDone("Model answers filled in Route 1.");
                }}
              >
                Autofill model answers
              </button>
              <button
                type="button"
                className="btn-ghost btn-sm"
                onClick={() => {
                  resetRoute1();
                  setDone("Route 1 cleared.");
                }}
              >
                Clear this route
              </button>
            </div>
            <p role="status" className="min-h-[1.25rem] text-caption text-signal">
              {done}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
