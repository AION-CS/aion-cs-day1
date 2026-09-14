"use client";

import { useState } from "react";
import clsx from "clsx";
import { BANDS, JUSTIFICATION_TEMPLATE, TEMPLATE_PARTS, WORKED_EXAMPLE } from "@/lib/route1";
import { Overlay } from "./Overlay";

const VW = 640;
const VH = 120;

/** S7 — the three bands from reversible-now to hard-to-reverse, as a chevron strip. */
export function DecisionBands() {
  const [selected, setSelected] = useState(BANDS[0].id);
  const active = BANDS.find((b) => b.id === selected) ?? BANDS[0];
  const w = VW / BANDS.length;

  return (
    <div className="space-y-3">
      <p className="text-micro font-semibold uppercase tracking-wide text-ash">Decide what is reversible now — stage the rest</p>
      <div className="relative">
        <svg
          viewBox={`0 0 ${VW} ${VH}`}
          preserveAspectRatio="xMidYMid meet"
          role="img"
          aria-label="Three decision bands: short-term and reversible now, medium-term and staged, structural and hard to reverse."
          className="h-auto w-full"
        >
          <title>Three decision bands</title>
          {BANDS.map((b, i) => {
            const x = i * w;
            const tip = 22;
            const on = b.id === selected;
            const d = `M${x + (i === 0 ? 0 : 0)} 16 L${x + w - tip} 16 L${x + w} 60 L${x + w - tip} 104 L${x} 104 L${x + (i === 0 ? 0 : tip)} 60 Z`;
            return (
              <path
                key={b.id}
                d={d}
                role="button"
                tabIndex={0}
                aria-pressed={on}
                aria-label={`${b.label}: ${b.tag}`}
                onClick={() => setSelected(b.id)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    setSelected(b.id);
                  }
                }}
                className={clsx(
                  "cursor-pointer outline-none transition-colors duration-150",
                  on ? "fill-accent stroke-accentHi" : i === 0 ? "fill-accentSoft stroke-accent/40" : i === 1 ? "fill-mist stroke-line" : "fill-ink/10 stroke-ink/30",
                )}
                strokeWidth={on ? 2.5 : 1.5}
              />
            );
          })}
        </svg>
        {BANDS.map((b, i) => (
          <Overlay key={b.id} x={i * w + w / 2 + 6} y={60} vw={VW} vh={VH} className={clsx("text-center", b.id === selected ? "text-paper" : "text-ink")}>
            <span className="block text-caption font-semibold">{b.label}</span>
            <span className="block text-micro">{b.tag}</span>
          </Overlay>
        ))}
      </div>
      <div className="rounded-xl border border-accent/35 bg-accentSoft p-4" aria-live="polite">
        <div key={active.id} className="reveal-in">
          <p className="text-caption text-ink">
            <span className="font-semibold">{active.label} — </span>
            {active.text}
          </p>
          <ul className="mt-2 flex flex-wrap gap-1.5">
            {active.examples.map((e) => (
              <li key={e} className="rounded-full border border-accent/40 bg-paper px-2 py-0.5 text-micro font-semibold text-accent">
                {e}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

/** S7 — the reusable justification pattern, copyable. */
export function TemplateCard() {
  const [status, setStatus] = useState<string | null>(null);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(JUSTIFICATION_TEMPLATE);
      setStatus("Template copied.");
    } catch {
      setStatus("Copy is blocked in this browser — select the text above instead.");
    }
    window.setTimeout(() => setStatus(null), 2500);
  };

  return (
    <div className="rounded-xl border border-line bg-paper p-4">
      <p className="text-micro font-semibold uppercase tracking-wide text-accent">The justification pattern</p>
      <ol className="mt-2 space-y-1.5">
        {TEMPLATE_PARTS.map((p, i) => (
          <li key={p.label} className="flex gap-2 text-caption">
            <span className="mt-[1px] flex h-5 w-5 shrink-0 items-center justify-center rounded-md bg-ink text-micro font-bold text-paper">
              {i + 1}
            </span>
            <span>
              <span className="font-semibold text-ink">{p.text}</span>
              <span className="text-ash"> — {p.label}</span>
            </span>
          </li>
        ))}
      </ol>
      <div className="mt-3 flex flex-wrap items-center gap-2">
        <button type="button" onClick={copy} className="btn-ghost">
          Copy the template
        </button>
        <span aria-live="polite" className="text-micro text-ash">
          {status}
        </span>
      </div>
    </div>
  );
}

/** S7 — read-only worked example on a fictional company, dark-bannered so it never reads as a learner surface. */
export function WorkedExample() {
  return (
    <article className="overflow-hidden rounded-2xl border border-ink/20 bg-paper">
      <div className="bg-slate px-5 py-3">
        <p className="text-micro font-semibold uppercase tracking-wide text-paper/70">{WORKED_EXAMPLE.kicker}</p>
        <p className="text-caption font-semibold text-paper">
          {WORKED_EXAMPLE.title} · <span className="font-normal text-paper/80">{WORKED_EXAMPLE.company}</span>
        </p>
      </div>
      <div className="space-y-3 p-5">
        <p className="text-caption italic text-ash">{WORKED_EXAMPLE.situation}</p>
        {WORKED_EXAMPLE.paragraphs.map((p, i) => (
          <p key={i} className="text-body text-ink">
            {p}
          </p>
        ))}
        <dl className="grid gap-2 border-t border-line pt-3 sm:grid-cols-2">
          {WORKED_EXAMPLE.annotations.map((a) => (
            <div key={a.label} className="rounded-lg bg-mist px-3 py-2">
              <dt className="text-micro font-semibold uppercase tracking-wide text-ash">{a.label}</dt>
              <dd className="text-caption text-ink">{a.text}</dd>
            </div>
          ))}
        </dl>
      </div>
    </article>
  );
}
