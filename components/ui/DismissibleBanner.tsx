"use client";

import { useProgress, useHydrated } from "@/lib/store";
import { Info } from "@/components/icons/LineIcons";

/**
 * A suggested order, never a lock (CLAUDE.md #6). Dismissal persists in the
 * store's `checks`, so a learner who has read it once is not shown it again —
 * and nothing about the page changes either way.
 */
export function DismissibleBanner({ storageKey, label, text }: { storageKey: string; label: string; text: string }) {
  const hydrated = useHydrated();
  const dismissed = useProgress((s) => !!s.checks[storageKey]);
  const toggleCheck = useProgress((s) => s.toggleCheck);

  if (!hydrated || dismissed) return null;

  return (
    <div role="note" className="flex items-start gap-3 rounded-xl border border-line bg-paper p-4 shadow-sm">
      <Info className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
      <p className="min-w-0 flex-1 text-caption text-ash">
        <span className="font-semibold text-ink">{label}: </span>
        {text}
      </p>
      <button
        type="button"
        onClick={() => toggleCheck(storageKey, true)}
        className="shrink-0 rounded-lg border border-line px-2.5 py-1 text-micro font-semibold text-ash transition-colors duration-150 hover:border-ash hover:text-ink"
      >
        Dismiss
      </button>
    </div>
  );
}
