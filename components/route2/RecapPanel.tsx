"use client";

import Link from "next/link";
import { ArrowRight, Info } from "@/components/icons/LineIcons";

/**
 * Section A's four-constraint panel and Section B's standing-start recap.
 * Section B is what lets Route 2 be reachable without Route 1 having been done
 * — the no-hard-lock principle is carried by content here, not by a gate.
 */

const CONSTRAINTS = [
  {
    n: 1,
    label: "Capacity is committed",
    body: "Development resources are limited and product management continues to demand high implementation speed. Nothing has been withdrawn to make room for this work.",
  },
  {
    n: 2,
    label: "The evidence is missing",
    body: "There is no full SCI telemetry. Nobody at AppNexa can say, with data, which application is actually the most expensive to run.",
  },
  {
    n: 3,
    label: "The codebase is live",
    body: "Existing applications cannot be rebuilt without limit. Customers are on them, and a free hand to re-architect does not exist.",
  },
  {
    n: 4,
    label: "Two demands that pull apart",
    body: "Management wants a visible improvement this quarter, and explicitly does not want a brake on innovation.",
  },
];

export function ConstraintPanel() {
  return (
    <div className="space-y-3">
      <p className="text-micro font-semibold uppercase tracking-wide text-accent">
        Four edges on this quarter — none of them technical
      </p>
      <ul className="grid gap-3 sm:grid-cols-2">
        {CONSTRAINTS.map((c) => (
          <li key={c.n} className="rounded-2xl border border-line bg-canvas p-4">
            <div className="flex items-start gap-3">
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-ink text-micro font-bold tabular-nums text-paper">
                {c.n}
              </span>
              <div>
                <p className="text-caption font-semibold text-ink">{c.label}</p>
                <p className="mt-1 text-caption text-ash">{c.body}</p>
              </div>
            </div>
          </li>
        ))}
      </ul>
      <div className="rounded-2xl border border-warn/40 bg-warn/5 p-4">
        <p className="text-micro font-semibold uppercase tracking-wide text-warn">
          What this adds up to
        </p>
        <p className="mt-1 text-caption text-ink">
          One quarter of limited capacity, three defensible places to spend it, and not enough evidence to prove which
          is best. Waiting for complete data is itself a choice with a price — the bill arrives either way.
        </p>
      </div>
    </div>
  );
}

const SIX_AREAS = [
  { name: "Architecture", note: "what components return and how they communicate" },
  { name: "Data Processing", note: "how much computation one user action triggers" },
  { name: "Storage", note: "what gets written, how often, in how many places" },
  { name: "Network Load", note: "how much data moves, and how many times" },
  { name: "Background Processes", note: "work that runs whether or not anyone benefits" },
  { name: "Management Logic", note: "what the organisation measures and rewards" },
];

export function RecapPanel() {
  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-accent/30 bg-accentSoft p-4">
        <p className="text-micro font-semibold uppercase tracking-wide text-accent">
          SCI in one line
        </p>
        <p className="mt-1.5 text-body text-ink">
          <span className="font-semibold">C = ((E × I) + M) per R</span> — energy consumed, times the carbon intensity
          of the grid where it is drawn, plus the embodied emissions of the hardware, all per functional unit. A rate,
          not a total, which is what makes it comparable release over release.
        </p>
      </div>

      <div>
        <p className="text-micro font-semibold uppercase tracking-wide text-ash">
          The six areas an inefficiency can live in
        </p>
        <ul className="mt-2 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {SIX_AREAS.map((a, i) => (
            <li key={a.name} className="rounded-xl border border-line bg-paper px-3 py-2">
              <p className="text-caption font-semibold text-ink">
                <span className="mr-1.5 text-ash tabular-nums">{i + 1}.</span>
                {a.name}
              </p>
              <p className="mt-0.5 text-micro text-ash">{a.note}</p>
            </li>
          ))}
        </ul>
      </div>

      <div className="flex items-start gap-3 rounded-xl border border-line bg-canvas p-4">
        <Info className="mt-0.5 h-4 w-4 shrink-0 text-ash" />
        <p className="text-caption text-ash">
          Option B below means fixing instances in the first five. Options A and C are both, in different ways,
          attempts to fix the sixth. If you want the full treatment,{" "}
          <Link
            href="/route-1-foundations"
            className="inline-flex items-center gap-1 font-semibold text-accent underline underline-offset-2"
          >
            Route 1 covers all six in depth
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>{" "}
          — nothing here waits on it.
        </p>
      </div>
    </div>
  );
}
