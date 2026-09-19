"use client";

import { useHydrated, useStore } from "@/store/useStore";

/** A suggested order, never a lock. Dismissal persists; nothing about the page changes either way. */
export function SuggestedOrderBanner() {
  const hydrated = useHydrated();
  const dismissed = useStore((s) => s.ui.bannerDismissed);
  const dismiss = useStore((s) => s.dismissBanner);
  if (!hydrated || dismissed) return null;
  return (
    <div role="note" className="flex items-start gap-3 rounded-xl border border-gold/70 bg-accentSoft p-3.5">
      <p className="min-w-0 flex-1 text-caption text-ink">
        <span className="smallcaps mr-1 text-accent">Suggested order</span>
        Materi A → Task 1 → Materi B → Task 2. Every section stays open, so you can start anywhere.
      </p>
      <button type="button" onClick={dismiss} className="btn-ghost btn-sm shrink-0">
        Dismiss
      </button>
    </div>
  );
}
