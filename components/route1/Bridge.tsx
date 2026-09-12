"use client";

import { BRIDGE } from "@/lib/route1";
import { useRoute1 } from "./useRoute1";

/**
 * The bridge between the two stages — the thing that makes this one route
 * rather than two pages printed in sequence (CLAUDE.md #12).
 *
 * It does three jobs: it moves the clock forward so the second half reads as a
 * later scene in the same engagement rather than a new brief; it hands the
 * learner their own stage-1 numbers back, so the decision they are about to
 * make is visibly caused by the diagnosis they just filed; and it carries the
 * one load-bearing line from the standalone recap the merge deleted — which of
 * the six categories each option actually attacks.
 */
export function Bridge() {
  const r1 = useRoute1();

  return (
    <section
      id={BRIDGE.id}
      className="scroll-mt-24 overflow-hidden rounded-2xl border border-line bg-paper shadow-sm"
    >
      <div className="flex items-center gap-3 bg-slate px-5 py-2.5">
        <span className="h-1.5 w-1.5 rounded-full bg-accent" />
        <p className="text-micro font-semibold uppercase tracking-wide text-paper/80">
          {BRIDGE.kicker}
        </p>
      </div>

      <div className="space-y-3 p-6">
        <h2 className="max-w-prose text-h2 text-ink">{BRIDGE.heading}</h2>

        <div className="rounded-xl border border-accent/30 bg-accentSoft px-4 py-3">
          <p className="text-micro font-semibold uppercase tracking-wide text-accent">
            From your own report
          </p>
          <p className="mt-1 text-caption text-ink">
            {r1.hydrated
              ? BRIDGE.tally(r1.structuralCount, r1.quickCount, r1.completeCount)
              : BRIDGE.tally(0, 0, 0)}
          </p>
        </div>

        <div className="max-w-prose space-y-3 text-body text-ash">
          <p>{BRIDGE.body}</p>
          <p>{BRIDGE.turn}</p>
        </div>

        <div className="rounded-xl border border-line bg-canvas p-4">
          <p className="max-w-prose text-caption text-ink">{BRIDGE.carry}</p>
        </div>

        <p className="max-w-prose text-caption font-semibold text-ink">{BRIDGE.handoff}</p>
      </div>
    </section>
  );
}
