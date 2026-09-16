"use client";

import { useState } from "react";
import clsx from "clsx";
import { Icon } from "@/components/icons/LineIcons";
import { AREAS } from "@/lib/route1";

// ---------------------------------------------------------------------------
// S1 — the five enabler mechanisms
// ---------------------------------------------------------------------------

const LEVERS = [
  {
    id: "transparency",
    label: "Transparency",
    definition: "Making a resource, cost or impact visible that previously wasn't measured at all.",
    example:
      "A real-time energy dashboard lets a facilities team see which building wing draws power overnight — something no paper log ever showed.",
  },
  {
    id: "efficiency",
    label: "Efficiency",
    definition: "Completing the same task using fewer resources — less time, less material, less compute.",
    example:
      "An automated scheduling tool cuts empty delivery-truck runs by matching loads that used to be planned by hand, route by route.",
  },
  {
    id: "monitoring",
    label: "Monitoring & Management",
    definition: "A system that steers itself against a target, instead of running on assumption until something breaks.",
    example:
      "A building-management system throttles heating and cooling against live occupancy sensors rather than a fixed all-day schedule.",
  },
  {
    id: "automation",
    label: "Automation",
    definition: "A manual step is removed entirely, not just made faster.",
    example:
      "An automated invoice-matching tool removes the manual cross-check that used to require printing and re-entering supplier data.",
  },
  {
    id: "optimisation",
    label: "Data-Based Optimisation",
    definition: "A decision improves because it now has real evidence behind it, not a rule of thumb.",
    example:
      "A predictive-maintenance model schedules part replacement from actual wear data instead of a fixed calendar interval — cutting unnecessary swaps and unplanned failures both.",
  },
] as const;

export function LeverMap() {
  const [open, setOpen] = useState<string | null>(LEVERS[0].id);
  const active = LEVERS.find((l) => l.id === open) ?? null;

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2">
        {LEVERS.map((l) => {
          const on = open === l.id;
          return (
            <button
              key={l.id}
              type="button"
              onClick={() => setOpen(on ? null : l.id)}
              aria-pressed={on}
              className={clsx(
                "rounded-full border px-3.5 py-1.5 text-caption font-semibold transition-colors duration-150",
                on
                  ? "border-accent bg-accent text-paper"
                  : "border-line bg-paper text-ash hover:border-accent hover:text-accent",
              )}
            >
              {l.label}
            </button>
          );
        })}
      </div>

      {active ? (
        <div className="reveal-in space-y-2 rounded-xl border border-accent/30 bg-accentSoft p-4">
          <p className="text-caption text-ink">{active.definition}</p>
          <p className="text-caption text-ash">
            <span className="font-semibold text-ink">Example. </span>
            {active.example}
          </p>
        </div>
      ) : (
        <p className="rounded-xl border border-dashed border-line bg-canvas p-4 text-caption text-ash">
          Tap a mechanism to see how it reduces impact, with a concrete industry example.
        </p>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// S2 — direct vs. indirect impact
// ---------------------------------------------------------------------------

const DIRECT_ITEMS = ["Energy", "Hardware", "Compute", "Storage", "Network"];
const INDIRECT_ITEMS = ["Behaviour change", "Data growth", "New services", "Accelerated processes"];

export function ImpactLayers() {
  return (
    <div className="space-y-3">
      <div className="rounded-2xl border border-line bg-canvas p-4">
        <p className="text-micro font-semibold uppercase tracking-wide text-accent">
          Direct — the system itself running
        </p>
        <div className="mt-2 flex flex-wrap gap-2">
          {DIRECT_ITEMS.map((item) => (
            <span
              key={item}
              className="rounded-lg border border-accent/30 bg-accentSoft px-3 py-1.5 text-caption font-semibold text-ink"
            >
              {item}
            </span>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-center">
        <div className="h-6 w-px bg-line" />
      </div>

      <div className="rounded-2xl border border-line bg-canvas p-4">
        <p className="text-micro font-semibold uppercase tracking-wide text-ash">
          Indirect — what changes around the system
        </p>
        <div className="mt-2 flex flex-wrap gap-2">
          {INDIRECT_ITEMS.map((item) => (
            <span
              key={item}
              className="rounded-lg border border-line bg-paper px-3 py-1.5 text-caption font-semibold text-ink"
            >
              {item}
            </span>
          ))}
        </div>
      </div>

      <div className="rounded-xl border-y border-r border-l-4 border-y-accent/25 border-r-accent/25 border-l-accent bg-accentSoft/50 px-4 py-3">
        <p className="text-caption text-ink">
          <span className="font-semibold">The test: </span>
          if it happens because the digital system itself runs, it&apos;s direct. If it happens because people or
          processes change around it, it&apos;s indirect.
        </p>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// S3 — the rebound curve and the five-way trade-off
// ---------------------------------------------------------------------------

const TRADEOFFS = [
  {
    label: "Convenience",
    text: "A task that used to require effort now happens with one click — and gets done far more often than before.",
  },
  {
    label: "Speed",
    text: "A faster report or process gets run more frequently simply because waiting is no longer the cost it was.",
  },
  {
    label: "Automation",
    text: "A scheduled job runs on a fixed cadence instead of on someone's judgement about whether it's actually needed.",
  },
  {
    label: "Transparency",
    text: "A visible dashboard invites more queries and more dashboards than the one report it replaced.",
  },
  {
    label: "Resource use",
    text: "Usually where the bill lands for the other four — unless it is deliberately capped, it absorbs the difference.",
  },
] as const;

export function ReboundCurve() {
  return (
    <div className="space-y-5">
      <svg viewBox="0 0 520 220" className="w-full" role="img" aria-label="Predicted savings vs. actual net effect, converging toward zero as use increases">
        <line x1="40" y1="190" x2="500" y2="190" stroke="var(--color-line, #D8DBDF)" strokeWidth="1.5" />
        <line x1="40" y1="20" x2="40" y2="190" stroke="var(--color-line, #D8DBDF)" strokeWidth="1.5" />
        <text x="270" y="212" textAnchor="middle" className="fill-ash text-[11px]">
          Increased use of the now-cheaper resource →
        </text>
        <text x="18" y="105" textAnchor="middle" transform="rotate(-90 18 105)" className="fill-ash text-[11px]">
          Net saving
        </text>

        {/* Predicted savings — a straight line, the naive assumption */}
        <path d="M 40 40 L 500 40" fill="none" stroke="currentColor" strokeDasharray="5 5" strokeWidth="2" className="text-ash" />
        <text x="440" y="32" className="fill-ash text-[11px] font-semibold">
          Predicted saving
        </text>

        {/* Actual net effect — curves down toward the axis as rebound absorbs the gain */}
        <path
          d="M 40 40 C 160 70, 260 150, 500 182"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          className="text-accent"
        />
        <text x="330" y="168" className="fill-accent text-[11px] font-semibold">
          Actual net effect
        </text>

        <circle cx="40" cy="40" r="4" className="fill-ink" />
      </svg>

      <p className="text-micro text-ash">
        The gap between the two lines is what rebound absorbs — not lost outright, but not banked as a saving either,
        unless something actively stops the freed-up capacity from being used elsewhere.
      </p>

      <ul className="space-y-2">
        {TRADEOFFS.map((t) => (
          <li key={t.label} className="rounded-xl border border-line bg-canvas p-3">
            <p className="text-caption font-semibold text-ink">{t.label}</p>
            <p className="mt-1 text-caption text-ash">{t.text}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

// ---------------------------------------------------------------------------
// S4 — the six-area diagnostic framework
// ---------------------------------------------------------------------------

export function AreaFramework() {
  const [open, setOpen] = useState<string | null>(null);

  return (
    <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
      {AREAS.map((a) => {
        const on = open === a.id;
        return (
          <button
            key={a.id}
            type="button"
            onClick={() => setOpen(on ? null : a.id)}
            aria-pressed={on}
            className={clsx(
              "flex flex-col items-start gap-2 rounded-xl border p-3 text-left transition-colors duration-150",
              on ? "border-accent bg-accentSoft" : "border-line bg-canvas hover:border-ash",
            )}
          >
            <span className="flex items-center gap-2">
              <Icon name={a.icon} className={clsx("h-4 w-4 shrink-0", on ? "text-accent" : "text-ash")} />
              <span className={clsx("text-caption font-semibold", on ? "text-accent" : "text-ink")}>{a.name}</span>
            </span>
            <span className="text-micro text-ash">{a.note}</span>
            {on && (
              <span className="reveal-in mt-1 rounded-lg border border-accent/25 bg-paper px-2.5 py-1.5 text-micro text-ink">
                <span className="font-semibold">Example. </span>
                {a.example}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
