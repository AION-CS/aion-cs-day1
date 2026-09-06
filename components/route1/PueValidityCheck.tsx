"use client";

import clsx from "clsx";
import { useProgress } from "@/lib/store";
import { R1, PUE_CLAIMS, VERDICT_OPTIONS } from "@/lib/route1";
import { useRoute1 } from "./useRoute1";
import { ClueToggle } from "@/components/ui/ClueToggle";
import { ConfidenceHint } from "./ConfidenceHint";

/** Stage B — for each claim, decide what PUE's own definition actually supports. */
export function PueValidityCheck() {
  const r1 = useRoute1();
  const choose = useProgress((s) => s.choose);

  return (
    <div>
      <div className="flex items-baseline justify-between gap-3">
        <p className="text-caption text-ash">Judge each claim against what PUE actually measures.</p>
        <p className="text-caption tabular-nums text-ash">
          Assessed: <span className="font-semibold text-ink">{r1.stageBDoneCount}</span> / {PUE_CLAIMS.length}
        </p>
      </div>

      <div className="mt-3 space-y-4">
        {PUE_CLAIMS.map((c) => {
          const picked = r1.stageBVerdict[c.id];
          const matched = picked ? picked === c.correctVerdict : null;
          return (
            <div key={c.id} className="rounded-xl border border-line p-3.5">
              <p className="text-caption font-semibold text-ink">{c.claim}</p>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {VERDICT_OPTIONS.map((v) => (
                  <button
                    key={v.id}
                    type="button"
                    onClick={() => choose(R1.stageB.verdict(c.id), v.id)}
                    aria-pressed={picked === v.id}
                    className={clsx(
                      "rounded-lg border px-2.5 py-1.5 text-micro font-semibold transition-colors duration-150",
                      picked === v.id ? "border-accent bg-accentSoft text-accent" : "border-line text-ink hover:border-ash",
                    )}
                  >
                    {v.label}
                  </button>
                ))}
              </div>
              <ConfidenceHint matched={matched} />
              <ClueToggle clue={c.clue} />
            </div>
          );
        })}
      </div>
    </div>
  );
}
