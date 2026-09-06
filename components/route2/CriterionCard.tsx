"use client";

import clsx from "clsx";
import { useProgress } from "@/lib/store";
import { R2, OPTIONS, CRITERION_DATA, type Criterion, type OptionId } from "@/lib/route2";
import { useRoute2 } from "./useRoute2";
import { ClueToggle } from "@/components/ui/ClueToggle";
import { Check } from "@/components/icons/LineIcons";

/** One criterion: definition, then A/B/C columns of statements — click the one that best fits. */
export function CriterionCard({ criterion }: { criterion: Criterion }) {
  const r2 = useRoute2();
  const choose = useProgress((s) => s.choose);

  return (
    <div id={`r2-crit-${criterion.id}`} className="rounded-2xl border border-line p-4">
      <div className="flex items-baseline justify-between gap-3">
        <p className="text-caption font-semibold text-ink">
          {criterion.n}. {criterion.label}
        </p>
        <p className="shrink-0 text-micro tabular-nums text-ash">{r2.criterionDoneCount(criterion.id)} / 3</p>
      </div>
      <p className="mt-1 text-micro text-ash">{criterion.definition}</p>

      <div className="mt-3 grid gap-3 sm:grid-cols-3">
        {OPTIONS.map((o) => {
          const data = CRITERION_DATA[criterion.id][o.id as OptionId];
          const picked = r2.picks[criterion.id]?.[o.id as OptionId];
          return (
            <div key={o.id} className="rounded-xl border border-line bg-canvas p-3">
              <p className="text-micro font-semibold uppercase tracking-wide text-accent">Option {o.id}</p>
              <div className="mt-1.5 space-y-1.5">
                {data.statements.map((st) => {
                  const active = picked === st.id;
                  return (
                    <button
                      key={st.id}
                      type="button"
                      onClick={() => choose(R2.criterion(criterion.id, o.id as OptionId), st.id)}
                      aria-pressed={active}
                      className={clsx(
                        "flex w-full items-start gap-1.5 rounded-lg border p-2 text-left text-micro transition-colors duration-150",
                        active ? "border-accent bg-accentSoft text-ink" : "border-line bg-paper text-ash hover:border-ash",
                      )}
                    >
                      <span
                        className={clsx(
                          "mt-0.5 flex h-3.5 w-3.5 shrink-0 items-center justify-center rounded-full",
                          active ? "bg-accent text-paper" : "bg-mist",
                        )}
                      >
                        {active && <Check className="h-2 w-2" />}
                      </span>
                      <span>{st.text}</span>
                    </button>
                  );
                })}
              </div>
              <ClueToggle clue={data.clue} />
            </div>
          );
        })}
      </div>
    </div>
  );
}
