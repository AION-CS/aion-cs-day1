"use client";

import clsx from "clsx";
import type { Route1State, SignalState } from "./useRoute1";

export type BoardFilter = null | "routed" | "technology" | "governance" | "short" | "structural" | "zones";

export function matchesFilter(s: SignalState, filter: BoardFilter): boolean {
  switch (filter) {
    case null:
      return true;
    case "routed":
    case "zones":
      return s.routed;
    case "technology":
    case "governance":
      return s.routed && s.rootCause === filter;
    case "short":
    case "structural":
      return s.routed && s.horizon === filter;
  }
}

/**
 * The live counts above the board (§8.6). Every metric is a toggle that
 * filters the board and dims the signal cards that do not match; clicking it
 * again clears the filter.
 */
export function SummaryStrip({
  tally,
  filter,
  onFilter,
}: {
  tally: Route1State["tally"];
  filter: BoardFilter;
  onFilter: (f: BoardFilter) => void;
}) {
  const Toggle = ({ id, children, label }: { id: Exclude<BoardFilter, null>; children: React.ReactNode; label: string }) => (
    <button
      type="button"
      onClick={() => onFilter(filter === id ? null : id)}
      aria-pressed={filter === id}
      aria-label={label}
      className={clsx(
        "rounded-full px-2 py-0.5 font-semibold tabular-nums transition-colors duration-150",
        filter === id ? "bg-accent text-paper" : "text-ink hover:bg-accentSoft hover:text-accent",
      )}
    >
      {children}
    </button>
  );

  return (
    <div className="flex flex-wrap items-center gap-x-3 gap-y-2 rounded-2xl border border-line bg-paper px-4 py-3 text-caption text-ash">
      <span className="text-micro font-semibold uppercase tracking-wide text-ash">Live summary</span>
      <span className="inline-flex items-center gap-1">
        Signals routed:
        <Toggle id="routed" label={`Filter the board to the ${tally.routed} routed signals`}>
          {tally.routed}/{tally.total}
        </Toggle>
      </span>
      <span aria-hidden="true">·</span>
      <span className="inline-flex items-center gap-1">
        Technology vs Governance:
        <Toggle id="technology" label={`Filter to ${tally.technology} signals tagged technology use`}>
          {tally.technology}
        </Toggle>
        /
        <Toggle id="governance" label={`Filter to ${tally.governance} signals tagged missing governance or architecture decision`}>
          {tally.governance}
        </Toggle>
      </span>
      <span aria-hidden="true">·</span>
      <span className="inline-flex items-center gap-1">
        Short-term vs Structural:
        <Toggle id="short" label={`Filter to ${tally.short} signals tagged visible short-term`}>
          {tally.short}
        </Toggle>
        /
        <Toggle id="structural" label={`Filter to ${tally.structural} signals tagged structurally effective`}>
          {tally.structural}
        </Toggle>
      </span>
      <span aria-hidden="true">·</span>
      <span className="inline-flex items-center gap-1">
        Zones used:
        <Toggle id="zones" label={`Highlight the ${tally.zonesUsed} zones in use`}>
          {tally.zonesUsed}/7
        </Toggle>
      </span>
      {filter && (
        <button type="button" onClick={() => onFilter(null)} className="ml-auto text-micro font-semibold text-accent underline underline-offset-2">
          Clear filter
        </button>
      )}
    </div>
  );
}
