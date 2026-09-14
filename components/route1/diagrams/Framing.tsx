"use client";

import { useState } from "react";
import clsx from "clsx";
import { DECIDE_OPENER, GLOSSARY, OPENER } from "@/lib/route1";
import { ChevronDown, Icon } from "@/components/icons/LineIcons";

/** The material opener with its four learning objectives as SVG-badged cards. */
export function OpenerPanel() {
  return (
    <div className="space-y-5">
      <div className="max-w-prose space-y-3">
        {OPENER.paragraphs.map((p, i) => (
          <p key={i} className="text-body text-ash">
            {p}
          </p>
        ))}
      </div>
      <ol className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {OPENER.objectives.map((o, i) => (
          <li key={i} className="flex gap-3 rounded-2xl border border-line bg-paper p-4 shadow-sm">
            <span className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-accent/40 bg-accentSoft text-accent">
              <Icon name={o.icon} className="h-5 w-5" />
              <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-accent text-micro font-bold text-paper">
                {i + 1}
              </span>
            </span>
            <p className="text-caption text-ink">{o.text}</p>
          </li>
        ))}
      </ol>
    </div>
  );
}

/** "Twelve terms you now own" — closes the S1–S4 teaching. */
export function GlossaryStrip() {
  const [open, setOpen] = useState<string | null>(null);

  return (
    <section aria-labelledby="r1-glossary-title" className="space-y-4 rounded-2xl border border-line bg-mist p-5">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h3 id="r1-glossary-title" className="text-h3 text-ink">
          {GLOSSARY.title}
        </h3>
        <p className="text-micro text-ash">{GLOSSARY.intro}</p>
      </div>
      <ul className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
        {GLOSSARY.terms.map((t) => {
          const on = open === t.term;
          return (
            <li key={t.term}>
              <button
                type="button"
                onClick={() => setOpen(on ? null : t.term)}
                aria-expanded={on}
                className={clsx(
                  "flex w-full items-start justify-between gap-2 rounded-xl border p-3 text-left transition-colors duration-150",
                  on ? "border-accent bg-paper" : "border-line bg-paper hover:border-ash",
                )}
              >
                <span className="min-w-0">
                  <span className="block text-caption font-semibold text-ink">{t.term}</span>
                  {on && <span className="reveal-in mt-1 block text-caption text-ash">{t.definition}</span>}
                </span>
                <span className="flex shrink-0 items-center gap-1 text-micro text-ash">
                  {t.where}
                  <ChevronDown className={clsx("h-3.5 w-3.5 transition-transform duration-150", on && "rotate-180")} />
                </span>
              </button>
            </li>
          );
        })}
      </ul>
      <p className="border-t border-line pt-3 text-body font-semibold text-ink">{GLOSSARY.bridge}</p>
    </section>
  );
}

/** The short turn from technology to trade-offs before S5 — framing, not a level label. */
export function DecideOpener() {
  return (
    <div className="rounded-2xl border border-accent/30 bg-accentSoft p-6">
      <p className="text-micro font-semibold uppercase tracking-wide text-accent">{DECIDE_OPENER.kicker}</p>
      <h3 className="mt-1 text-h2 text-ink">{DECIDE_OPENER.title}</h3>
      <p className="mt-2 max-w-prose text-body text-ink">{DECIDE_OPENER.text}</p>
    </div>
  );
}
