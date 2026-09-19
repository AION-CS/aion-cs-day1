"use client";

import { useState } from "react";
import { useStore } from "@/store/useStore";

/** Clears Route 1 state only — the participant strip stays. Inline two-step confirm. */
export function ResetRoute() {
  const reset = useStore((s) => s.resetRoute1);
  const [ask, setAsk] = useState(false);
  return (
    <div className="flex flex-wrap items-center gap-3 border-t border-line pt-4 print:hidden">
      {!ask ? (
        <button type="button" onClick={() => setAsk(true)} className="btn-ghost btn-sm">
          Reset Route 1
        </button>
      ) : (
        <>
          <p className="text-caption text-ink">Clear every Route 1 answer, mark and check count? Your number and name stay.</p>
          <button
            type="button"
            onClick={() => {
              reset();
              setAsk(false);
              window.scrollTo({ top: 0 });
            }}
            className="btn-primary btn-sm"
          >
            Yes, reset Route 1
          </button>
          <button type="button" onClick={() => setAsk(false)} className="btn-ghost btn-sm">
            Cancel
          </button>
        </>
      )}
    </div>
  );
}
