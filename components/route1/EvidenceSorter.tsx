"use client";

import { useState } from "react";
import clsx from "clsx";
import { useProgress } from "@/lib/store";
import { R1, EVIDENCE_ITEMS, CATEGORIES } from "@/lib/route1";
import { useRoute1 } from "./useRoute1";
import { ClueToggle } from "@/components/ui/ClueToggle";
import { ConfidenceHint } from "./ConfidenceHint";
import { Check, ChevronDown } from "@/components/icons/LineIcons";

/** Stage A — click a statement, sort it into one of 6 categories. Feedback is a confidence nudge, never a verdict. */
export function EvidenceSorter() {
  const r1 = useRoute1();
  const choose = useProgress((s) => s.choose);
  const [openId, setOpenId] = useState<string | null>(EVIDENCE_ITEMS[0]?.id ?? null);

  return (
    <div>
      <div className="flex items-baseline justify-between gap-3">
        <p className="text-caption text-ash">Click a statement to sort it.</p>
        <p className="text-caption tabular-nums text-ash">
          Classified: <span className="font-semibold text-ink">{r1.stageADoneCount}</span> / {EVIDENCE_ITEMS.length}
        </p>
      </div>

      <div className="mt-3 space-y-2">
        {EVIDENCE_ITEMS.map((item) => {
          const picked = r1.stageACategory[item.id];
          const open = openId === item.id;
          const matched = picked ? picked === item.correctCategory : null;
          const pickedLabel = picked ? CATEGORIES.find((c) => c.id === picked)?.label : undefined;

          return (
            <div key={item.id} className="rounded-xl border border-line">
              <button
                type="button"
                onClick={() => setOpenId(open ? null : item.id)}
                aria-expanded={open}
                className="flex w-full items-center gap-3 p-3 text-left"
              >
                <span
                  className={clsx(
                    "flex h-5 w-5 shrink-0 items-center justify-center rounded-full",
                    picked ? "bg-accent text-paper" : "bg-mist text-ash",
                  )}
                >
                  {picked && <Check className="h-3 w-3" />}
                </span>
                <span className="flex-1 text-caption text-ink">{item.text}</span>
                {pickedLabel && (
                  <span className="shrink-0 rounded-full bg-accentSoft px-2 py-0.5 text-micro font-semibold text-accent">{pickedLabel}</span>
                )}
                <ChevronDown className={clsx("h-4 w-4 shrink-0 text-ash transition-transform duration-150", open && "rotate-180")} />
              </button>

              {open && (
                <div className="reveal-in border-t border-line p-3">
                  <p className="text-micro font-semibold uppercase tracking-wide text-ash">Sort into:</p>
                  <div className="mt-1.5 flex flex-wrap gap-1.5">
                    {CATEGORIES.map((cat) => (
                      <button
                        key={cat.id}
                        type="button"
                        onClick={() => choose(R1.stageA.category(item.id), cat.id)}
                        aria-pressed={picked === cat.id}
                        className={clsx(
                          "rounded-lg border px-2.5 py-1.5 text-micro font-semibold transition-colors duration-150",
                          picked === cat.id ? "border-accent bg-accentSoft text-accent" : "border-line text-ink hover:border-ash",
                        )}
                      >
                        {cat.label}
                      </button>
                    ))}
                  </div>
                  <ConfidenceHint matched={matched} />
                  <ClueToggle clue={item.clue} />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
