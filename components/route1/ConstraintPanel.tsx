"use client";


/**
 * Section G's four-constraint panel — the four hard edges on AppNexa's quarter.
 *
 * This file used to also export a standing-start recap of SCI and the six
 * categories, for a learner who opened the old Route 2 without having done
 * Route 1. Inside one continuous route there is no such learner: they sorted
 * those six categories twenty minutes ago on this same page, and re-teaching
 * them here read as a restart (CLAUDE.md #12). The one line worth keeping —
 * which categories each option attacks — moved into the bridge.
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
