"use client";

import { Icon } from "@/components/icons/LineIcons";
import { DIMENSIONS, OPTIONS } from "@/lib/route2";

/**
 * Route 2's material visuals: the seven-dimension reference cards (Section D)
 * and the three-part defensibility test (Section E). Section C's lifecycle
 * diagram reuses the shared FlowDiagram instead of adding a fourth visual here.
 */

const DIMENSION_ICONS = [
  "layers",
  "gauge",
  "target",
  "supplier",
  "certificate",
  "recycleLoop",
  "shield",
] as const;

/** Section D — one card per decision dimension, with its low and high anchors. */
export function DimensionReference() {
  return (
    <div className="space-y-4">
      <p className="text-micro font-semibold uppercase tracking-wide text-accent">
        The seven dimensions you will score in Task 2
      </p>
      <ul className="grid gap-3 sm:grid-cols-2">
        {DIMENSIONS.map((d, i) => (
          <li
            key={d.key}
            id={`r2-dimension-${d.key}`}
            className={
              d.inverted
                ? "scroll-mt-24 rounded-2xl border border-warn/40 bg-warn/5 p-4"
                : "scroll-mt-24 rounded-2xl border border-line bg-paper p-4"
            }
          >
            <div className="flex items-start gap-3">
              <span
                className={
                  d.inverted
                    ? "flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-warn/15 text-warn"
                    : "flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-accentSoft text-accent"
                }
              >
                <Icon name={DIMENSION_ICONS[i]} className="h-4.5 w-4.5" />
              </span>
              <div className="min-w-0">
                <p className="text-h3 text-ink">{d.name}</p>
                <p className="mt-0.5 text-caption font-semibold text-ash">{d.question}</p>
              </div>
            </div>
            <p className="mt-2.5 text-caption text-ash">{d.detail}</p>
            <div className="mt-3 flex items-center justify-between gap-3 border-t border-line pt-2 text-micro">
              <span className="text-ash">1 · {d.low}</span>
              <span className={d.inverted ? "font-semibold text-warn" : "font-semibold text-accent"}>
                5 · {d.high}
              </span>
            </div>
            {d.inverted && (
              <p className="mt-2 text-micro font-semibold uppercase tracking-wide text-warn">
                Higher is worse — the one axis where a bigger polygon is not better
              </p>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

/** Section C — the three options as cards, under the lifecycle diagram. */
export function OptionOverview() {
  return (
    <ul className="mt-4 grid gap-3 md:grid-cols-3">
      {OPTIONS.map((o) => (
        <li key={o.id} className="flex flex-col rounded-2xl border border-line bg-paper p-4">
          <div className="flex items-center gap-2.5">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-ink text-caption font-bold text-paper">
              {o.id}
            </span>
            <div className="min-w-0">
              <p className="text-micro font-semibold uppercase tracking-wide text-accent">{o.stage}</p>
              <p className="truncate text-caption font-semibold text-ink">{o.shortName}</p>
            </div>
          </div>
          <p className="mt-2.5 text-caption text-ash">{o.summary}</p>
          <p className="mt-2 flex-1 text-micro text-ash">{o.detail}</p>
        </li>
      ))}
    </ul>
  );
}

/** Section E — the three things a complete recommendation has to do. */
export function DefensibilityTest() {
  const steps = [
    {
      n: 1,
      title: "Name the real trade-off",
      body: "In the option's own terms, not as a generality. Finish the sentence \"this is worth it even though…\" — if you can't, you haven't found it yet.",
      field: "Strategic rationale",
    },
    {
      n: 2,
      title: "Name the next decision it forces",
      body: "Every real choice creates the following one. Say who has to decide what, and roughly when — not \"we'll review later\".",
      field: "Follow-up decisions",
    },
    {
      n: 3,
      title: "Name what could go wrong",
      body: "Including what the options you rejected would have prevented. That is the price of your choice, and a board can tell when it hasn't been counted.",
      field: "Risk register",
    },
  ];

  return (
    <div className="space-y-3">
      <ol className="grid gap-3 md:grid-cols-3">
        {steps.map((s) => (
          <li key={s.n} className="flex flex-col rounded-2xl border border-accent/30 bg-accentSoft p-4">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-accent text-caption font-bold text-paper">
              {s.n}
            </span>
            <p className="mt-2.5 text-h3 text-ink">{s.title}</p>
            <p className="mt-1.5 flex-1 text-caption text-ash">{s.body}</p>
            <p className="mt-3 border-t border-accent/25 pt-2 text-micro uppercase tracking-wide text-accent">
              Memo field: {s.field}
            </p>
          </li>
        ))}
      </ol>
      <p className="text-caption text-ash">
        All three have to be present. A memo that picks the strongest option and does only one of them is weaker than
        one that picks a defensible option and does all three.
      </p>
    </div>
  );
}
