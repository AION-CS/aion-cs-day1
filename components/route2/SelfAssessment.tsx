"use client";

import clsx from "clsx";
import { useProgress } from "@/lib/store";
import { scrollToAndFlash } from "@/lib/scrollToAndFlash";
import { R2, SELF_ASSESSMENT_ITEMS, type SelfAssessmentValue } from "@/lib/route2";
import { domId, type Route2State } from "./useRoute2";

const VALUES: { id: SelfAssessmentValue; label: string }[] = [
  { id: "yes", label: "Yes" },
  { id: "partly", label: "Partly" },
  { id: "not-yet", label: "Not yet" },
];

/**
 * §8.5 — the rubric self-check. Non-blocking and never validated (it is never
 * part of `missing`), but included in the export so the instructor can read
 * the learner's own calibration alongside the memo.
 */
export function SelfAssessment({ r2 }: { r2: Route2State }) {
  const choose = useProgress((s) => s.choose);

  return (
    <section id={domId.selfAssessment} className="scroll-mt-24 space-y-3 rounded-2xl border border-line bg-mist p-5">
      <div>
        <p className="text-micro font-semibold uppercase tracking-wide text-ash">Optional · not graded, not required for export</p>
        <h3 className="mt-1 text-h3 text-ink">Rate your own memo against the rubric</h3>
      </div>
      <ul className="space-y-2">
        {SELF_ASSESSMENT_ITEMS.map((item) => {
          const value = r2.selfAssessment[item.id];
          return (
            <li key={item.id} className="rounded-xl border border-line bg-paper p-3">
              <div className="flex flex-wrap items-start justify-between gap-2">
                <p className="max-w-prose text-caption text-ink">{item.label}</p>
                <button
                  type="button"
                  onClick={() => scrollToAndFlash(`r2-s${item.section}`, "ref")}
                  className="shrink-0 rounded-full border border-line px-2 py-0.5 text-micro font-semibold text-accent hover:border-accent"
                >
                  Section {item.section}
                </button>
              </div>
              <div className="mt-2 flex gap-1.5">
                {VALUES.map((v) => (
                  <button
                    key={v.id}
                    type="button"
                    onClick={() => choose(R2.selfAssess(item.id), v.id)}
                    aria-pressed={value === v.id}
                    className={clsx(
                      "rounded-full border px-3 py-1 text-micro font-semibold transition-colors duration-150",
                      value === v.id ? "border-accent bg-accentSoft text-accent" : "border-line bg-canvas text-ash hover:border-ash",
                    )}
                  >
                    {v.label}
                  </button>
                ))}
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
