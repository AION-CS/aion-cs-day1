"use client";

import { useState } from "react";
import clsx from "clsx";
import { useProgress } from "@/lib/store";
import { BIG_LEVERS, LEVER_INTRO, R2 } from "@/lib/route2";
import { ChevronDown } from "@/components/icons/LineIcons";

/**
 * Block D's four-step accordion (§7.4). Self-paced: every step opens on
 * click, nothing is sequentially locked. Opened state persists so a learner
 * who leaves and returns keeps their place.
 */
export function LeverAccordion() {
  const openMap = useProgress((s) => s.checks);
  const toggleCheck = useProgress((s) => s.toggleCheck);
  const [localOpen, setLocalOpen] = useState<string | null>(BIG_LEVERS[0].id);

  const isOpen = (id: string) => (openMap[R2.leverOpen(id)] !== undefined ? !!openMap[R2.leverOpen(id)] : localOpen === id);

  const toggle = (id: string) => {
    const next = !isOpen(id);
    toggleCheck(R2.leverOpen(id), next);
    setLocalOpen(next ? id : null);
  };

  return (
    <div className="space-y-3">
      <p className="text-caption text-ash">{LEVER_INTRO}</p>
      <ul className="space-y-2">
        {BIG_LEVERS.map((lever) => {
          const on = isOpen(lever.id);
          return (
            <li key={lever.id} className={clsx("rounded-2xl border bg-paper transition-colors duration-150", on ? "border-accent/50" : "border-line")}>
              <button type="button" onClick={() => toggle(lever.id)} aria-expanded={on} className="flex w-full items-start gap-3 p-4 text-left">
                <span className={clsx("flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-caption font-bold", on ? "bg-accent text-paper" : "bg-mist text-ash")}>
                  {lever.n}
                </span>
                <span className="min-w-0 flex-1 text-caption font-semibold text-ink">{lever.label}</span>
                <ChevronDown className={clsx("mt-1 h-4 w-4 shrink-0 text-ash transition-transform duration-150", on && "rotate-180")} />
              </button>
              {on && (
                <div className="reveal-in space-y-2 border-t border-line p-4">
                  <p className="text-caption text-ink">
                    <span className="font-semibold">What it changes. </span>
                    {lever.changes}
                  </p>
                  <p className="text-caption text-ash">
                    <span className="font-semibold text-ink">What it requires. </span>
                    {lever.requires}
                  </p>
                  <p className="text-caption text-ash">
                    <span className="font-semibold text-ink">What it does not fix. </span>
                    {lever.doesNotFix}
                  </p>
                  <p className="text-caption text-ash">
                    <span className="font-semibold text-ink">How you would know it worked. </span>
                    {lever.measurement}
                  </p>
                </div>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
