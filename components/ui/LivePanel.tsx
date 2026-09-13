"use client";

import { useState } from "react";
import clsx from "clsx";
import { ChevronDown } from "@/components/icons/LineIcons";

/**
 * The live-assembling deliverable panel: a sticky column on desktop, a sticky
 * summary strip that expands on tap below it.
 *
 * Shared by both routes — the report on Route 1 and the board memo on Route 2
 * are the same interaction, and a learner on a phone should never have to
 * scroll past the whole workspace to see what their answers are producing.
 */
export function LivePanel({
  title,
  /** One line of state for the collapsed mobile strip, e.g. "3 of 6 signals filed". */
  summary,
  children,
}: {
  title: string;
  summary: string;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Desktop: a sticky column beside the work */}
      <aside className="hidden lg:block lg:sticky lg:top-20">{children}</aside>

      {/* Mobile: a sticky strip that expands in place */}
      <div className="lg:hidden">
        <div className="sticky top-16 z-20 rounded-2xl border border-line bg-paper/95 shadow-sm backdrop-blur">
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            className="flex w-full items-center justify-between gap-3 px-4 py-3 text-left"
          >
            <span className="min-w-0">
              <span className="block text-micro font-semibold uppercase tracking-wide text-accent">
                {title}
              </span>
              <span className="block truncate text-caption text-ash">{summary}</span>
            </span>
            <ChevronDown
              className={clsx(
                "h-4 w-4 shrink-0 text-ash transition-transform duration-150",
                open && "rotate-180",
              )}
            />
          </button>
          {open && (
            <div className="max-h-[60vh] overflow-y-auto border-t border-line p-3">{children}</div>
          )}
        </div>
      </div>
    </>
  );
}
