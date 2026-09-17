"use client";

import { useState } from "react";
import clsx from "clsx";
import { Icon } from "@/components/icons/LineIcons";
import { AREAS } from "@/lib/route1";
import {
  EnergyDashboardDemo,
  InvoiceAutomationDemo,
  OccupancyHvacDemo,
  PredictiveMaintenanceDemo,
  RouteOptimisationDemo,
} from "./LeverDemos";

// ---------------------------------------------------------------------------
// S1 — the five enabler mechanisms, each with a live "watch it happen" demo
// ---------------------------------------------------------------------------

const LEVERS = [
  { id: "transparency", label: "Transparency", definition: "Making a resource visible that previously wasn't measured at all.", Demo: EnergyDashboardDemo },
  { id: "efficiency", label: "Efficiency", definition: "Completing the same task using fewer resources.", Demo: RouteOptimisationDemo },
  { id: "monitoring", label: "Monitoring & Management", definition: "A system that steers itself against a target, instead of running on a fixed schedule.", Demo: OccupancyHvacDemo },
  { id: "automation", label: "Automation", definition: "A manual step is removed entirely, not just made faster.", Demo: InvoiceAutomationDemo },
  { id: "optimisation", label: "Data-Based Optimisation", definition: "A decision improves because it now has real evidence behind it.", Demo: PredictiveMaintenanceDemo },
] as const;

export function LeverMap() {
  const [open, setOpen] = useState<string>(LEVERS[0].id);
  const active = LEVERS.find((l) => l.id === open)!;
  const Demo = active.Demo;

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2">
        {LEVERS.map((l) => {
          const on = open === l.id;
          return (
            <button
              key={l.id}
              type="button"
              onClick={() => setOpen(l.id)}
              aria-pressed={on}
              className={clsx(
                "rounded-full border px-3.5 py-1.5 text-caption font-semibold transition-colors duration-150",
                on ? "border-accent bg-accent text-paper" : "border-line bg-paper text-ash hover:border-accent hover:text-accent",
              )}
            >
              {l.label}
            </button>
          );
        })}
      </div>

      <div className="reveal-in space-y-3 rounded-xl border border-accent/30 bg-accentSoft p-4">
        <p className="text-caption text-ink">{active.definition}</p>
        <Demo />
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// S2 — direct vs. indirect impact, as a click-to-classify demo
// ---------------------------------------------------------------------------

const IMPACT_SCENARIOS = [
  { id: "servers", text: "The new platform's servers run around the clock.", answer: "direct" as const, why: "This is the system's own hardware and energy draw." },
  { id: "reports", text: "A department now emails a report daily instead of monthly.", answer: "indirect" as const, why: "The system didn't do this — a person changed their routine." },
  { id: "storage", text: "The platform's own storage use grows every day it runs.", answer: "direct" as const, why: "Storage filling up is the system running, not a behaviour change." },
  { id: "hoarding", text: "Staff keep every file version because storage now feels free.", answer: "indirect" as const, why: "The habit changed because the system exists — the system itself isn't doing this." },
];

export function ImpactLayers() {
  const [revealed, setRevealed] = useState<Record<string, boolean>>({});

  return (
    <div className="space-y-3">
      <p className="text-micro text-ash">Tap each finding: is it direct or indirect?</p>
      <div className="grid gap-2 sm:grid-cols-2">
        {IMPACT_SCENARIOS.map((s) => {
          const shown = revealed[s.id];
          const direct = s.answer === "direct";
          return (
            <button
              key={s.id}
              type="button"
              onClick={() => setRevealed((r) => ({ ...r, [s.id]: !r[s.id] }))}
              aria-pressed={shown}
              className={clsx(
                "flex flex-col items-start gap-1.5 rounded-xl border p-3 text-left transition-colors duration-150",
                shown ? (direct ? "border-accent bg-accentSoft" : "border-line bg-mist") : "border-line bg-paper hover:border-ash",
              )}
            >
              <span className="flex items-center gap-2">
                <Icon name={direct ? "drive" : "person"} className={clsx("h-4 w-4 shrink-0", shown ? (direct ? "text-accent" : "text-ink") : "text-ash")} />
                <span className="text-caption text-ink">{s.text}</span>
              </span>
              {shown && (
                <span className="reveal-in text-micro">
                  <span className={clsx("font-semibold", direct ? "text-accent" : "text-ink")}>{direct ? "Direct — " : "Indirect — "}</span>
                  <span className="text-ash">{s.why}</span>
                </span>
              )}
            </button>
          );
        })}
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
// S3 — the rebound curve, stepped interactively, and the five-way trade-off
// ---------------------------------------------------------------------------

const REBOUND_STAGES = [
  { label: "No change yet", x: 40, y: 40, saving: 100 },
  { label: "Usage grows", x: 270, y: 110, saving: 45 },
  { label: "Usage doubles", x: 500, y: 182, saving: 8 },
] as const;

const TRADEOFFS = [
  { label: "Convenience", text: "A task that used to require effort now happens with one click — and gets done far more often than before." },
  { label: "Speed", text: "A faster report or process gets run more frequently simply because waiting is no longer the cost it was." },
  { label: "Automation", text: "A scheduled job runs on a fixed cadence instead of on someone's judgement about whether it's actually needed." },
  { label: "Transparency", text: "A visible dashboard invites more queries and more dashboards than the one report it replaced." },
  { label: "Resource use", text: "Usually where the bill lands for the other four — unless it is deliberately capped, it absorbs the difference." },
] as const;

export function ReboundCurve() {
  const [stage, setStage] = useState(0);
  const point = REBOUND_STAGES[stage];
  const [openTradeoff, setOpenTradeoff] = useState<string | null>(null);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {REBOUND_STAGES.map((s, i) => (
          <button
            key={s.label}
            type="button"
            onClick={() => setStage(i)}
            aria-pressed={stage === i}
            className={clsx(
              "rounded-full border px-3 py-1 text-micro font-semibold transition-colors duration-150",
              stage === i ? "border-accent bg-accent text-paper" : "border-line bg-paper text-ash hover:border-accent",
            )}
          >
            {s.label}
          </button>
        ))}
      </div>

      <svg viewBox="0 0 520 220" className="w-full" role="img" aria-label="Predicted savings vs. actual net effect, converging toward zero as use increases">
        <line x1="40" y1="190" x2="500" y2="190" stroke="var(--color-line, #D8DBDF)" strokeWidth="1.5" />
        <line x1="40" y1="20" x2="40" y2="190" stroke="var(--color-line, #D8DBDF)" strokeWidth="1.5" />
        <text x="270" y="212" textAnchor="middle" className="fill-ash text-[11px]">
          Increased use of the now-cheaper resource →
        </text>
        <text x="18" y="105" textAnchor="middle" transform="rotate(-90 18 105)" className="fill-ash text-[11px]">
          Net saving
        </text>

        <path d="M 40 40 L 500 40" fill="none" stroke="currentColor" strokeDasharray="5 5" strokeWidth="2" className="text-ash" />
        <text x="440" y="32" className="fill-ash text-[11px] font-semibold">Predicted saving</text>

        <path d="M 40 40 C 160 70, 260 150, 500 182" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-accent" />
        <text x="330" y="168" className="fill-accent text-[11px] font-semibold">Actual net effect</text>

        {/* the gap this stage reveals, between predicted and actual */}
        <line x1={point.x} y1="40" x2={point.x} y2={point.y} stroke="currentColor" className="text-warn" strokeWidth="1.5" strokeDasharray="3 3" style={{ transition: "all 500ms" }} />
        <circle cx={point.x} cy={point.y} r="6" className="fill-warn transition-all duration-500" />
      </svg>

      <p className="rounded-lg border border-warn/30 bg-warn/5 px-3 py-2 text-caption text-ink">
        Net saving remaining: <span className="font-semibold text-warn">{point.saving}%</span> — the rest was absorbed
        by increased use, not lost, not banked either.
      </p>

      <div className="grid gap-1.5 sm:grid-cols-2">
        {TRADEOFFS.map((t) => {
          const open = openTradeoff === t.label;
          return (
            <button
              key={t.label}
              type="button"
              onClick={() => setOpenTradeoff(open ? null : t.label)}
              aria-pressed={open}
              className={clsx(
                "rounded-lg border p-2.5 text-left transition-colors duration-150",
                open ? "border-accent bg-accentSoft" : "border-line bg-canvas hover:border-ash",
              )}
            >
              <p className={clsx("text-caption font-semibold", open ? "text-accent" : "text-ink")}>{t.label}</p>
              {open && <p className="reveal-in mt-1 text-micro text-ash">{t.text}</p>}
            </button>
          );
        })}
      </div>
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
