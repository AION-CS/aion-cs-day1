"use client";

import { useState } from "react";
import { useProgress } from "@/lib/store";
import { scrollToAndFlash } from "@/lib/scrollToAndFlash";
import { Help } from "@/components/icons/LineIcons";
import { PART_ONE, R1 } from "@/lib/route1";
import { appendLog, routingClues, routingSignature, type CheckResult, type Clue } from "./clues";
import { domId, type Route1State } from "./useRoute1";

/**
 * "Check my routing" (§8.5) — pressed on demand, never automatic. Reads the
 * pattern of the whole board and returns at most three clues, most useful
 * first, each with a link that opens the right card and flashes the spot.
 * It never names a zone. Every press is logged for the export.
 */
export function RoutingCheck({ r1, onOpenSignal }: { r1: Route1State; onOpenSignal: (id: string) => void }) {
  const setNote = useProgress((s) => s.setNote);
  const [result, setResult] = useState<CheckResult | null>(null);
  const [signature, setSignature] = useState("");

  const run = () => {
    const res = routingClues(r1.signals);
    setResult(res);
    setSignature(routingSignature(r1.signals));
    setNote(R1.checkLog, appendLog(useProgress.getState().notes[R1.checkLog], res));
  };

  const go = (clue: Clue) => {
    if (clue.signalId) onOpenSignal(clue.signalId);
    window.setTimeout(() => scrollToAndFlash(clue.target), clue.signalId ? 60 : 0);
  };

  const stale = !!result && signature !== routingSignature(r1.signals);

  return (
    <div id={domId.routingCheck} className="scroll-mt-24 rounded-2xl border border-line bg-paper p-4">
      <div className="flex flex-wrap items-center gap-3">
        <button type="button" onClick={run} className="btn-accent">
          {result ? PART_ONE.recheckLabel : PART_ONE.checkLabel}
        </button>
        <p className="text-micro text-ash">Reads patterns across your whole board and gives clues — it never names a zone.</p>
      </div>

      <div aria-live="polite" className="mt-3">
        {result && (
          <div className="reveal-in space-y-2">
            {stale && <p className="text-micro font-semibold text-warn">Your board has changed since this check — check again to refresh the clues.</p>}
            {result.status !== "clues" ? (
              <p className="rounded-xl border border-line bg-canvas px-3 py-2 text-caption text-ink">{result.message}</p>
            ) : (
              <>
                <p className="text-micro font-semibold uppercase tracking-wide text-ash">{PART_ONE.checkLead}</p>
                <ol className="space-y-2">
                  {result.clues.map((clue) => (
                    <li key={clue.id} className="flex gap-2 rounded-xl border border-warn/40 bg-warn/5 px-3 py-2">
                      <Help className="mt-0.5 h-4 w-4 shrink-0 text-warn" />
                      <div className="min-w-0">
                        <p className="text-caption text-ink">{clue.text}</p>
                        <button
                          type="button"
                          onClick={() => go(clue)}
                          className="mt-1 text-micro font-semibold text-accent underline decoration-dotted underline-offset-2 hover:text-accentHi"
                        >
                          Take me there
                        </button>
                      </div>
                    </li>
                  ))}
                </ol>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
