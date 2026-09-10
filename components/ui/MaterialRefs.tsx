"use client";

import { scrollToAndFlash } from "@/lib/scrollToAndFlash";
import { BookOpen } from "@/components/icons/LineIcons";

export type MaterialRef = { anchorId: string; label: string };

/**
 * "Where this comes from" chips under a task step. Each one scrolls to the
 * material section it cites and flashes it in the accent — never the red
 * missing-item flash, because arriving somewhere you asked to go isn't a
 * warning. Standard #11b: no task step should leave a learner guessing which
 * part of the material it draws on.
 */
export function MaterialRefs({ refs, lead = "Based on" }: { refs: MaterialRef[]; lead?: string }) {
  if (refs.length === 0) return null;
  return (
    <div className="mt-2 flex flex-wrap items-center gap-1.5">
      <span className="inline-flex items-center gap-1 text-micro text-ash">
        <BookOpen className="h-3.5 w-3.5" />
        {lead}:
      </span>
      {refs.map((r) => (
        <button
          key={r.anchorId}
          type="button"
          onClick={() => scrollToAndFlash(r.anchorId, "ref")}
          className="rounded-full border border-accent/35 bg-accentSoft px-2.5 py-0.5 text-micro font-medium text-accent transition-colors duration-150 hover:border-accent hover:text-accentHi"
        >
          {r.label}
        </button>
      ))}
    </div>
  );
}
