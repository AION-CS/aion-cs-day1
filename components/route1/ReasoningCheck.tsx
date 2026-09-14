"use client";

import { useState } from "react";
import { useProgress } from "@/lib/store";
import { scrollToAndFlash } from "@/lib/scrollToAndFlash";
import { Help } from "@/components/icons/LineIcons";
import { R1, REASONING_CHECK } from "@/lib/route1";
import { appendLog, reasoningClues, reasoningSignature, type CheckResult } from "./clues";
import { domId, type Route1State } from "./useRoute1";

/**
 * "Check my reasoning" (§10.4) — on demand, clue-only. It compares the
 * learner's justification with the learner's own ranking: a flat ranking, an
 * argument from a criterion the chosen option was ranked last on, a missing
 * boundary, review point or falsification condition. At most three clues.
 */
export function ReasoningCheck({ r1 }: { r1: Route1State }) {
  const setNote = useProgress((s) => s.setNote);
  const [result, setResult] = useState<CheckResult | null>(null);
  const [signature, setSignature] = useState("");

  const run = () => {
    const res = reasoningClues(r1);
    setResult(res);
    setSignature(reasoningSignature(r1));
    setNote(R1.reasonLog, appendLog(useProgress.getState().notes[R1.reasonLog], res));
  };

  const stale = !!result && signature !== reasoningSignature(r1);

  return (
    <div id={domId.reasoningCheck} className="scroll-mt-24 rounded-2xl border border-line bg-paper p-4">
      <div className="flex flex-wrap items-center gap-3">
        <button type="button" onClick={run} className="btn-accent">
          {result ? REASONING_CHECK.recheckLabel : REASONING_CHECK.label}
        </button>
        <p className="text-micro text-ash">Reads your justification against your own ranking — it never grades the choice.</p>
      </div>

      <div aria-live="polite" className="mt-3">
        {result && (
          <div className="reveal-in space-y-2">
            {stale && <p className="text-micro font-semibold text-warn">Your ranking or justification has changed — check again to refresh.</p>}
            {result.status !== "clues" ? (
              <p className="rounded-xl border border-line bg-canvas px-3 py-2 text-caption text-ink">{result.message}</p>
            ) : (
              <>
                <p className="text-micro font-semibold uppercase tracking-wide text-ash">{REASONING_CHECK.lead}</p>
                <ol className="space-y-2">
                  {result.clues.map((clue) => (
                    <li key={clue.id} className="flex gap-2 rounded-xl border border-warn/40 bg-warn/5 px-3 py-2">
                      <Help className="mt-0.5 h-4 w-4 shrink-0 text-warn" />
                      <div className="min-w-0">
                        <p className="text-caption text-ink">{clue.text}</p>
                        <button
                          type="button"
                          onClick={() => scrollToAndFlash(clue.target)}
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
