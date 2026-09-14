"use client";

import { useEffect, useState } from "react";
import clsx from "clsx";
import { useProgress, useHydrated } from "@/lib/store";
import { Check } from "@/components/icons/LineIcons";

/**
 * Makes autosave visible. The persist middleware already writes every change
 * to localStorage synchronously; this only pops a tick each time the persisted
 * part of the store changes, so the learner can see their work is kept.
 */
export function SavedIndicator() {
  const hydrated = useHydrated();
  const [pulse, setPulse] = useState(0);

  useEffect(
    () =>
      useProgress.subscribe((s, prev) => {
        if (s.seen !== prev.seen || s.choices !== prev.choices || s.checks !== prev.checks || s.notes !== prev.notes) {
          setPulse((n) => n + 1);
        }
      }),
    [],
  );

  if (!hydrated) return null;

  return (
    <span
      className="inline-flex items-center gap-1 text-micro text-ash"
      title="Every change is saved to this browser automatically."
    >
      <span key={pulse} className={clsx("inline-flex", pulse > 0 && "anim-pop")}>
        <Check className="h-3.5 w-3.5 text-accent" />
      </span>
      Saved in this browser
    </span>
  );
}
