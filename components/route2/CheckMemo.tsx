"use client";

import { useState } from "react";
import { useProgress } from "@/lib/store";
import { scrollToAndFlash } from "@/lib/scrollToAndFlash";
import { Help } from "@/components/icons/LineIcons";
import { CHECK_MEMO, R2 } from "@/lib/route2";
import { appendLog, memoClues, memoSignature, type CheckResult } from "./clues";
import { domId, type Route2State } from "./useRoute2";

/**
 * "Check my memo" (§8.4) — on demand, clue-only. Reads the memo's own
 * internal consistency, including whether an Option E justification actually
 * engages Vertex's specific conditions. Never states the answer.
 */
export function CheckMemo({ r2 }: { r2: Route2State }) {
  const setNote = useProgress((s) => s.setNote);
  const [result, setResult] = useState<CheckResult | null>(null);
  const [signature, setSignature] = useState("");

  const run = () => {
    const res = memoClues(r2);
    setResult(res);
    setSignature(memoSignature(r2));
    setNote(R2.checkLog, appendLog(useProgress.getState().notes[R2.checkLog], res));
  };

  const stale = !!result && signature !== memoSignature(r2);

  return (
    <div id={domId.checkMemo} className="scroll-mt-24 rounded-2xl border border-line bg-paper p-4">
      <div className="flex flex-wrap items-center gap-3">
        <button type="button" onClick={run} className="btn-accent">
          {result ? CHECK_MEMO.recheckLabel : CHECK_MEMO.label}
        </button>
        <p className="text-micro text-ash">Reads your own memo for internal consistency — it never grades the choice you made.</p>
      </div>

      <div aria-live="polite" className="mt-3">
        {result && (
          <div className="reveal-in space-y-2">
            {stale && <p className="text-micro font-semibold text-warn">Your memo has changed since this check — check again to refresh the clues.</p>}
            {result.status !== "clues" ? (
              <p className="rounded-xl border border-line bg-canvas px-3 py-2 text-caption text-ink">{result.message ?? CHECK_MEMO.clean}</p>
            ) : (
              <>
                <p className="text-micro font-semibold uppercase tracking-wide text-ash">{CHECK_MEMO.lead}</p>
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
