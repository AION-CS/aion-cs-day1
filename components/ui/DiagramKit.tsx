"use client";

import clsx from "clsx";

/**
 * Small shared pieces for the material diagrams. Every interactive on this day
 * follows the same contract (DEPTH-UPGRADE-PROMPT §3): numbers on screen, a
 * reason per value, a live "Why this result", a live "What just changed", and a
 * baseline to return to. These three components carry the recurring shapes.
 */

export function Chip({
  on,
  onClick,
  children,
  tone = "accent",
}: {
  on: boolean;
  onClick: () => void;
  children: React.ReactNode;
  tone?: "accent" | "warn";
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={on}
      className={clsx(
        "rounded-full border px-2.5 py-1 text-micro font-semibold transition-colors duration-150",
        on
          ? tone === "accent"
            ? "border-accent bg-accentSoft text-accent"
            : "border-warn bg-warn/10 text-warn"
          : "border-line bg-paper text-ash hover:border-ash",
      )}
    >
      {children}
    </button>
  );
}

/** The live "Why this result" line — names the outcome and what made the difference. */
export function WhyResult({ headline, why, tone = "accent" }: { headline: string; why: string; tone?: "accent" | "warn" }) {
  return (
    <div
      aria-live="polite"
      className={clsx("rounded-xl border p-3", tone === "accent" ? "border-accent/30 bg-accentSoft" : "border-warn/30 bg-warn/5")}
    >
      <p className={clsx("text-micro font-semibold uppercase tracking-wide", tone === "accent" ? "text-accent" : "text-warn")}>Why this result</p>
      <p className={clsx("mt-0.5 text-caption font-semibold", tone === "accent" ? "text-accent" : "text-warn")}>{headline}</p>
      <p className="mt-1 text-caption text-ink">{why}</p>
    </div>
  );
}

/** The live "What just changed" line — what moved, and the shift in the way of thinking. */
export function WhatChanged({ text, onReset, resetLabel = "Reset to baseline" }: { text: string | null; onReset?: () => void; resetLabel?: string }) {
  return (
    <div aria-live="polite" className="rounded-xl border border-dashed border-line bg-paper p-3">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <p className="text-micro font-semibold uppercase tracking-wide text-ash">What just changed</p>
        {onReset && (
          <button type="button" onClick={onReset} className="text-micro font-semibold text-accent underline decoration-dotted underline-offset-2 hover:text-accentHi">
            {resetLabel}
          </button>
        )}
      </div>
      <p className="mt-0.5 text-caption text-ink">{text ?? "Change something above — this line explains what moved and why."}</p>
    </div>
  );
}
