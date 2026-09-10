"use client";

import { useState } from "react";
import clsx from "clsx";
import { useProgress } from "@/lib/store";
import { R1, CASE_BRIEF, EVIDENCE_ITEMS } from "@/lib/route1";
import { ScaleTensionSvg } from "./ScaleTensionSvg";
import { ChevronDown } from "@/components/icons/LineIcons";

/** Stage 1 (Read & Classify) — the Flexora dossier as clickable/expandable evidence cards, plus the learner's name field. */
export function CaseBrief() {
  const name = useProgress((s) => s.notes[R1.name] ?? "");
  const setNote = useProgress((s) => s.setNote);
  const [openId, setOpenId] = useState<string | null>(null);

  return (
    <div className="card p-5">
      <div className="grid gap-5 lg:grid-cols-[1fr_180px] lg:items-start">
        <div>
          <p className="text-micro font-semibold uppercase tracking-wide text-ash">Case brief</p>
          <h3 className="mt-1 text-h3 text-ink">{CASE_BRIEF.company}</h3>
          <p className="mt-2 text-body text-ash">{CASE_BRIEF.setup}</p>
          <p className="mt-3 text-caption font-semibold text-ink">{CASE_BRIEF.role}</p>
        </div>
        <div className="hidden lg:block">
          <ScaleTensionSvg compact />
          <p className="mt-1 text-center text-micro text-ash">Reminder: efficiency vs. total demand (Block 3)</p>
        </div>
      </div>

      <div id="r1-name" className="mt-4 border-t border-line pt-4">
        <label className="block max-w-xs">
          <span className="text-caption font-semibold text-ink">Your name</span>
          <p className="text-micro text-ash">Used to label the exported report — e.g. "1-jane-day8-l1task1".</p>
          <input
            value={name}
            onChange={(e) => setNote(R1.name, e.target.value)}
            placeholder="Full name"
            className="mt-1 w-full rounded-xl border border-line bg-paper px-3 py-2 text-body text-ink"
          />
        </label>
      </div>

      <div className="mt-5 border-t border-line pt-4">
        <p className="text-micro font-semibold uppercase tracking-wide text-ash">Evidence — click each card</p>
        <div className="mt-2 space-y-2">
          {EVIDENCE_ITEMS.map((item, i) => {
            const open = openId === item.id;
            return (
              <div key={item.id} className="rounded-xl border border-line">
                <button
                  type="button"
                  onClick={() => setOpenId(open ? null : item.id)}
                  aria-expanded={open}
                  className="flex w-full items-center gap-3 p-3 text-left"
                >
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-mist text-micro font-semibold text-ash">
                    {i + 1}
                  </span>
                  <span className="flex-1 text-caption text-ink">{item.text}</span>
                  <ChevronDown className={clsx("h-4 w-4 shrink-0 text-ash transition-transform duration-150", open && "rotate-180")} />
                </button>
                {open && (
                  <div className="reveal-in border-t border-line p-3 text-micro text-ash">
                    This card will be sorted twice in the stages below: once as Benefit vs Risk (Stage 1), and once onto the
                    6-Dimension Wheel (Stage 2).
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
