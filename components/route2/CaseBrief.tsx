"use client";

import { useState } from "react";
import clsx from "clsx";
import { useProgress } from "@/lib/store";
import { R2, CASE_BRIEF, OPTIONS } from "@/lib/route2";
import { ChevronDown } from "@/components/icons/LineIcons";

/** Stage 1 — three option cards and five general-condition cards, all clickable to expand. */
export function CaseBrief() {
  const name = useProgress((s) => s.notes[R2.name] ?? "");
  const setNote = useProgress((s) => s.setNote);
  const [openOption, setOpenOption] = useState<string | null>(null);
  const [openCondition, setOpenCondition] = useState<number | null>(null);

  return (
    <div className="card p-5">
      <p className="text-micro font-semibold uppercase tracking-wide text-ash">Case brief</p>
      <h3 className="mt-1 text-h3 text-ink">{CASE_BRIEF.company}</h3>
      <p className="mt-2 text-body text-ash">{CASE_BRIEF.setup}</p>

      <p className="mt-4 text-caption font-semibold text-ink">The three options on the table — click to expand</p>
      <div className="mt-2 space-y-2">
        {OPTIONS.map((o) => {
          const open = openOption === o.id;
          return (
            <div key={o.id} className="rounded-xl border border-line">
              <button
                type="button"
                onClick={() => setOpenOption(open ? null : o.id)}
                aria-expanded={open}
                className="flex w-full items-center gap-3 p-3 text-left"
              >
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-accentSoft text-micro font-semibold text-accent">
                  {o.id}
                </span>
                <span className="flex-1">
                  <span className="block text-caption font-semibold text-ink">{o.label}</span>
                  <span className="block text-micro text-ash">{o.short}</span>
                </span>
                <ChevronDown className={clsx("h-4 w-4 shrink-0 text-ash transition-transform duration-150", open && "rotate-180")} />
              </button>
              {open && <div className="reveal-in border-t border-line p-3 text-micro text-ash">{o.detail}</div>}
            </div>
          );
        })}
      </div>

      <p className="mt-4 text-caption font-semibold text-ink">General conditions — click to expand</p>
      <div className="mt-2 space-y-2">
        {CASE_BRIEF.constraints.map((c, i) => {
          const open = openCondition === i;
          return (
            <div key={i} className="rounded-xl border border-line">
              <button
                type="button"
                onClick={() => setOpenCondition(open ? null : i)}
                aria-expanded={open}
                className="flex w-full items-center gap-3 p-3 text-left"
              >
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-mist text-micro font-semibold text-ash">
                  {i + 1}
                </span>
                <span className="flex-1 text-caption text-ink">{c}</span>
                <ChevronDown className={clsx("h-4 w-4 shrink-0 text-ash transition-transform duration-150", open && "rotate-180")} />
              </button>
              {open && (
                <div className="reveal-in border-t border-line p-3 text-micro text-ash">
                  This condition applies to all three options — weigh it in every dimension of Stage 2.
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div id="r2-name" className="mt-4 border-t border-line pt-4">
        <label className="block max-w-xs">
          <span className="text-caption font-semibold text-ink">Your name</span>
          <p className="text-micro text-ash">Used to label the exported memo — e.g. "1-jane-day8-l2task1".</p>
          <input
            value={name}
            onChange={(e) => setNote(R2.name, e.target.value)}
            placeholder="Full name"
            className="mt-1 w-full rounded-xl border border-line bg-paper px-3 py-2 text-body text-ink"
          />
        </label>
      </div>
    </div>
  );
}
