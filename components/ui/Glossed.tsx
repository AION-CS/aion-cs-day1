"use client";

import { useState } from "react";
import clsx from "clsx";
import { glossaryById, splitByGlossary } from "@/lib/glossary";

/**
 * A run of text whose abbreviations, standards and regulations are tappable.
 * Terms render as dotted-underlined buttons; tapping one opens a panel under
 * the text (what it stands for, what it means, where to read the source).
 * Tapping again or Close hides it. Self-contained: nothing is loaded, nothing
 * is sent — the source links are ordinary anchors the learner chooses to open.
 */
export function GlossedText({ text, as: Tag = "p", className }: { text: string; as?: "p" | "span" | "li"; className?: string }) {
  const [openId, setOpenId] = useState<string | null>(null);
  const toggle = (id: string) => setOpenId((cur) => (cur === id ? null : id));

  return (
    <>
      <Tag className={className}>
        {splitByGlossary(text).map((part, i) =>
          part.termId ? (
            <button
              key={i}
              type="button"
              onClick={() => toggle(part.termId!)}
              aria-expanded={openId === part.termId}
              className={clsx(
                "rounded-sm border-b border-dotted font-semibold not-italic transition-colors duration-150",
                openId === part.termId ? "border-accent bg-accentSoft text-accent" : "border-accent/60 text-ink hover:text-accent",
              )}
            >
              {part.text}
            </button>
          ) : (
            <span key={i}>{part.text}</span>
          ),
        )}
      </Tag>
      {openId && <TermPanel id={openId} onClose={() => setOpenId(null)} />}
    </>
  );
}

/** What a term stands for, what it means, and where to read the source. */
export function TermPanel({ id, onClose }: { id: string; onClose: () => void }) {
  const g = glossaryById(id);
  return (
    <div className="reveal-in mt-2 rounded-lg border border-accent/30 bg-canvas p-3" role="region" aria-label={`${g.name} explained`}>
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-micro font-semibold uppercase tracking-wide text-accent">{g.name}</p>
          <p className="mt-0.5 text-caption font-semibold text-ink">{g.full}</p>
        </div>
        <button type="button" onClick={onClose} className="shrink-0 rounded-full border border-line px-2 py-0.5 text-micro font-semibold text-ash hover:border-ash">
          Close
        </button>
      </div>
      <p className="mt-1.5 text-caption text-ink">{g.meaning}</p>
      {g.sources.length > 0 && (
        <ul className="mt-2 space-y-0.5">
          {g.sources.map((src) => (
            <li key={src.url} className="text-micro text-ash">
              Source:{" "}
              <a href={src.url} target="_blank" rel="noopener noreferrer" className="font-semibold text-ink underline decoration-dotted underline-offset-2 hover:text-accent">
                {src.label} ↗
              </a>
            </li>
          ))}
        </ul>
      )}
      {g.note && <p className="mt-2 text-micro text-ash">{g.note}</p>}
    </div>
  );
}

/**
 * A row of term chips for text that can't hold inline buttons (a whole option
 * that is itself a button). Tapping a chip opens the same panel under the row.
 */
export function TermChips({ ids, lead = "Terms in the options above" }: { ids: string[]; lead?: string }) {
  const [openId, setOpenId] = useState<string | null>(null);
  return (
    <div className="mt-2">
      <div className="flex flex-wrap items-center gap-1.5">
        <span className="text-micro text-ash">{lead}:</span>
        {ids.map((id) => {
          const g = glossaryById(id);
          return (
            <button
              key={id}
              type="button"
              onClick={() => setOpenId((cur) => (cur === id ? null : id))}
              aria-expanded={openId === id}
              className={clsx(
                "rounded-full border border-dotted px-2.5 py-0.5 text-micro font-semibold transition-colors duration-150",
                openId === id ? "border-accent bg-accentSoft text-accent" : "border-accent/60 text-ink hover:text-accent",
              )}
            >
              {g.name}
            </button>
          );
        })}
      </div>
      {openId && <TermPanel id={openId} onClose={() => setOpenId(null)} />}
    </div>
  );
}
