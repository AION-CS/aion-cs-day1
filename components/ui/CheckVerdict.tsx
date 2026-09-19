"use client";

import clsx from "clsx";

export type VerdictResult = { holds: true } | { holds: false; clue: string; tier?: "soft" | "sharp"; reasonLabel?: string };

/**
 * The result of one Check. Green means "verified" and nothing else: a filled or
 * placed slot stays neutral, and only a fresh check turns anything green (holds
 * up) or red (does not hold up yet). The clue under a red verdict is a written
 * direction to reason from — never the answer itself (CLAUDE.md §4) — and is
 * styled neutral so it can't be misread as approval.
 */
export function CheckVerdict({
  result,
  holdsLabel,
  notYetLabel,
  compact = false,
}: {
  result: VerdictResult | null;
  holdsLabel: string;
  /** Headline for a failed check. A tier-aware caller passes the softer or sharper line. */
  notYetLabel: string;
  compact?: boolean;
}) {
  if (!result) return null;
  const text = compact ? "text-micro" : "text-caption";
  return (
    <div className="reveal-in mt-1.5 space-y-1" role="status" aria-live="polite">
      <p className={clsx("flex items-start gap-1.5 font-semibold", text, result.holds ? "text-accent" : "text-danger")}>
        <span
          aria-hidden
          className={clsx(
            "mt-[1px] inline-flex h-4 w-4 shrink-0 items-center justify-center rounded-full text-[10px] font-bold text-paper",
            result.holds ? "bg-accent" : "bg-danger",
          )}
        >
          {result.holds ? "✓" : "✕"}
        </span>
        <span>{result.holds ? holdsLabel : notYetLabel}</span>
      </p>
      {!result.holds && (
        <p className={clsx("rounded-lg border border-line border-l-danger bg-paper px-2.5 py-1.5 text-ink", text, "border-l-4")}>{result.clue}</p>
      )}
    </div>
  );
}
