"use client";

import { useState } from "react";
import clsx from "clsx";
import { Slider } from "@/components/ui/Slider";

/**
 * The four D1–D4 diagrams. Every one is a live widget with exactly one
 * micro-interaction — inline SVG plus CSS transitions, no charting or
 * animation library (CLAUDE.md §9).
 */

// ---------------------------------------------------------------------------
// D1 — Scattered initiatives vs routed through one framework
// ---------------------------------------------------------------------------

const NODE_POSITIONS = [
  { x: 40, y: 30 },
  { x: 100, y: 20 },
  { x: 30, y: 90 },
  { x: 95, y: 100 },
  { x: 55, y: 140 },
];

export function ScatteredVsRouted() {
  const [routed, setRouted] = useState(false);
  const hubX = 220;
  const hubY = 85;

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {[false, true].map((v) => (
          <button
            key={String(v)}
            type="button"
            onClick={() => setRouted(v)}
            aria-pressed={routed === v}
            className={clsx(
              "rounded-full border px-3 py-1.5 text-caption font-semibold transition-colors duration-150",
              routed === v ? "border-accent bg-accentSoft text-accent" : "border-line bg-paper text-ash hover:border-ash",
            )}
          >
            {v ? "Routed through one framework" : "Scattered initiatives"}
          </button>
        ))}
      </div>

      <svg
        viewBox="0 0 340 170"
        preserveAspectRatio="xMidYMid meet"
        className="mx-auto h-auto w-full max-w-lg"
        role="img"
        aria-label={routed ? "Five initiatives routed through one assessment framework" : "Five initiatives scattered, unconnected"}
      >
        {routed && (
          <>
            <circle cx={hubX} cy={hubY} r="26" className="fill-accentSoft stroke-accent anim-scale-in" strokeWidth="1.6" />
            <text x={hubX} y={hubY - 2} textAnchor="middle" className="fill-accent text-[9px] font-semibold">
              Assessment
            </text>
            <text x={hubX} y={hubY + 9} textAnchor="middle" className="fill-accent text-[9px] font-semibold">
              framework
            </text>
          </>
        )}

        {NODE_POSITIONS.map((p, i) => {
          const targetX = routed ? hubX - 26 * Math.cos(((i - 2) * Math.PI) / 6) : p.x;
          const targetY = routed ? hubY + 34 * Math.sin(((i - 2) * Math.PI) / 6) : p.y;
          return (
            <g key={i} style={{ transition: "transform .5s ease" }} transform={`translate(${targetX - p.x}, ${targetY - p.y})`}>
              {routed && (
                <line
                  x1={p.x}
                  y1={p.y}
                  x2={hubX}
                  y2={hubY}
                  stroke="currentColor"
                  className="text-accent/50"
                  strokeWidth="1.4"
                  style={{ transition: "opacity .3s ease" }}
                />
              )}
              <circle cx={p.x} cy={p.y} r="16" className={routed ? "fill-paper stroke-accent" : "fill-mist stroke-ash"} strokeWidth="1.5" />
              <text x={p.x} y={p.y + 3} textAnchor="middle" className={clsx("text-[9px] font-semibold", routed ? "fill-accent" : "fill-ash")}>
                {i + 1}
              </text>
            </g>
          );
        })}
      </svg>

      <p className="rounded-xl border border-line bg-paper p-3 text-caption text-ink">
        {routed
          ? "Every initiative now runs through the same criteria before it scales — one coherent portfolio, not five separate bets."
          : "Five sensible initiatives, five separate sponsors, five separate justifications. Nothing here compares one against another."}
      </p>
    </div>
  );
}

// ---------------------------------------------------------------------------
// D2 — Assessment funnel: which filter stops a weak initiative
// ---------------------------------------------------------------------------

type FilterId = "benefit" | "resource" | "viability" | "controllability";

const FILTERS: { id: FilterId; label: string }[] = [
  { id: "benefit", label: "Benefit" },
  { id: "resource", label: "Resource/load" },
  { id: "viability", label: "Strategic viability" },
  { id: "controllability", label: "Controllability" },
];

const FUNNEL_DEMOS: { id: string; label: string; stoppedBy: FilterId | null }[] = [
  { id: "ai", label: "AI pilot with no measured benefit target", stoppedBy: "benefit" },
  { id: "circular", label: "Circular scheme that is itself resource-heavy to launch", stoppedBy: "resource" },
  { id: "oneoff", label: "Promising pilot with no path to run at full scale", stoppedBy: "viability" },
  { id: "vendor", label: "Third-party platform we cannot modify or audit", stoppedBy: "controllability" },
  { id: "framework", label: "The assessment framework itself, piloted with 3 initiatives", stoppedBy: null },
];

export function AssessmentFunnel() {
  const [selected, setSelected] = useState(FUNNEL_DEMOS[0].id);
  const demo = FUNNEL_DEMOS.find((d) => d.id === selected)!;
  const stopIndex = demo.stoppedBy ? FILTERS.findIndex((f) => f.id === demo.stoppedBy) : FILTERS.length;

  return (
    <div className="space-y-4">
      <div>
        <p className="text-micro font-semibold uppercase tracking-wide text-ash">Drop a demo initiative into the funnel</p>
        <div className="mt-1.5 flex flex-wrap gap-1.5">
          {FUNNEL_DEMOS.map((d) => (
            <button
              key={d.id}
              type="button"
              onClick={() => setSelected(d.id)}
              aria-pressed={selected === d.id}
              className={clsx(
                "rounded-full border px-2.5 py-1 text-micro font-semibold transition-colors duration-150",
                selected === d.id ? "border-accent bg-accentSoft text-accent" : "border-line text-ash hover:border-ash",
              )}
            >
              {d.label}
            </button>
          ))}
        </div>
      </div>

      <svg
        viewBox="0 0 340 210"
        preserveAspectRatio="xMidYMid meet"
        className="mx-auto h-auto w-full max-w-md"
        role="img"
        aria-label={demo.stoppedBy ? `Stopped by the ${FILTERS.find((f) => f.id === demo.stoppedBy)!.label} filter` : "Passed every filter — prioritised"}
      >
        <path d="M20 14 H320 L200 90 V150 L140 170 V90 Z" fill="none" stroke="currentColor" className="text-line" strokeWidth="1.6" />
        <text x="170" y="8" textAnchor="middle" className="fill-ash text-[9px] font-semibold uppercase tracking-wide">
          many initiatives in
        </text>

        {FILTERS.map((f, i) => {
          const y = 40 + i * 24;
          const passed = i < stopIndex;
          const isStop = i === stopIndex;
          return (
            <g key={f.id}>
              <line x1={40 + i * 8} y1={y} x2={300 - i * 8} y2={y} stroke="currentColor" className={isStop ? "text-danger" : "text-line"} strokeWidth={isStop ? 2.2 : 1.2} />
              <rect x={220} y={y - 9} width="108" height="18" rx="6" className={isStop ? "fill-danger/10 stroke-danger" : passed ? "fill-accentSoft stroke-accent" : "fill-paper stroke-line"} strokeWidth="1.2" />
              <text x={274} y={y + 3.5} textAnchor="middle" className={clsx("text-[8.5px] font-semibold", isStop ? "fill-danger" : passed ? "fill-accent" : "fill-ash")}>
                {f.label}
              </text>
            </g>
          );
        })}

        <circle
          key={selected}
          cx="170"
          cy="26"
          r="7"
          className={demo.stoppedBy ? "fill-danger anim-pop" : "fill-accent anim-pop"}
          style={{
            transform: `translateY(${demo.stoppedBy ? 40 + stopIndex * 24 - 26 : 178}px)`,
            transition: "transform 0.8s ease",
          }}
        />

        <text x="170" y="200" textAnchor="middle" className="fill-ash text-[9px] font-semibold uppercase tracking-wide">
          few prioritised decisions out
        </text>
      </svg>

      <p className={clsx("rounded-xl border p-3 text-caption", demo.stoppedBy ? "border-danger/30 bg-danger/5 text-ink" : "border-accent/30 bg-accentSoft text-ink")}>
        {demo.stoppedBy
          ? `Stopped by the ${FILTERS.find((f) => f.id === demo.stoppedBy)!.label} filter.`
          : "Passes every filter — this is what a prioritised decision looks like."}
      </p>
    </div>
  );
}

// ---------------------------------------------------------------------------
// D3 — Governance loop: propose → assess → approve/park → review
// ---------------------------------------------------------------------------

const LOOP_STAGES = [
  { id: "propose", label: "Propose", role: "Initiative sponsor", question: "What is being asked for, and what benefit is claimed?", pos: { x: 90, y: 30 } },
  { id: "assess", label: "Assess", role: "Assessment framework owner", question: "Does it clear all four D2 criteria?", pos: { x: 250, y: 30 } },
  { id: "approve", label: "Approve / park", role: "Portfolio or steering committee", question: "Given the portfolio, does this get funded now?", pos: { x: 250, y: 140 } },
  { id: "review", label: "Review", role: "Management review (D3)", question: "Did it deliver, and does anything change for next time?", pos: { x: 90, y: 140 } },
] as const;

export function GovernanceLoop() {
  const [openId, setOpenId] = useState<string>(LOOP_STAGES[0].id);
  const open = LOOP_STAGES.find((s) => s.id === openId)!;

  return (
    <div className="space-y-4">
      <svg viewBox="0 0 340 170" preserveAspectRatio="xMidYMid meet" className="mx-auto h-auto w-full max-w-md" role="img" aria-label="A governed loop: propose, assess, approve or park, review">
        <path d="M90 46 H250" stroke="currentColor" className="text-line" strokeWidth="1.6" />
        <path d="M250 46 V124" stroke="currentColor" className="text-line" strokeWidth="1.6" />
        <path d="M250 140 H90" stroke="currentColor" className="text-line" strokeWidth="1.6" />
        <path d="M90 124 V46" stroke="currentColor" className="text-line" strokeWidth="1.6" />
        {LOOP_STAGES.map((s) => {
          const on = openId === s.id;
          return (
            <g key={s.id} className="cursor-pointer" onClick={() => setOpenId(s.id)}>
              <circle cx={s.pos.x} cy={s.pos.y} r="24" className={on ? "fill-accent" : "fill-paper stroke-line"} strokeWidth="1.6" />
              <text x={s.pos.x} y={s.pos.y + 3.5} textAnchor="middle" className={clsx("text-[9.5px] font-semibold", on ? "fill-paper" : "fill-ink")}>
                {s.label}
              </text>
            </g>
          );
        })}
      </svg>

      <div>
        <p className="text-micro font-semibold uppercase tracking-wide text-ash">Click each stage</p>
        <div className="mt-1.5 flex flex-wrap gap-1.5">
          {LOOP_STAGES.map((s) => (
            <button
              key={s.id}
              type="button"
              onClick={() => setOpenId(s.id)}
              aria-pressed={openId === s.id}
              className={clsx(
                "rounded-full border px-2.5 py-1 text-micro font-semibold transition-colors duration-150",
                openId === s.id ? "border-accent bg-accentSoft text-accent" : "border-line text-ash hover:border-ash",
              )}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>

      <div key={open.id} className="reveal-in rounded-xl border border-accent/30 bg-accentSoft p-3">
        <p className="text-caption text-ink">
          <span className="font-semibold text-accent">{open.role} — </span>
          {open.question}
        </p>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// D4 — Time horizons: short / medium / structural
// ---------------------------------------------------------------------------

const HORIZON_BANDS = [
  { id: 0, label: "Short-term (now)", examples: ["Define assessment criteria", "Create transparency", "First prioritisation"] },
  { id: 1, label: "Medium-term (6–18 mo)", examples: ["Pilot selected AI/circularity initiatives", "Build first take-back / refurbishment loops"] },
  { id: 2, label: "Structural (ongoing)", examples: ["Anchor in portfolio decisions", "Anchor in governance", "Anchor in management reviews"] },
];

export function TimeHorizonBands() {
  const [band, setBand] = useState(0);
  const current = HORIZON_BANDS[band];

  return (
    <div className="space-y-4">
      <Slider
        id="d4-horizon"
        label="Slide across the timeline"
        instruction="Each band's examples highlight below."
        value={band + 1}
        onChange={(v) => setBand(v - 1)}
        min={1}
        max={3}
        lowLabel="Now"
        highLabel="Structural"
        valueLabels={{ 1: "Short-term", 2: "Medium-term", 3: "Structural" }}
      />

      <div className="grid gap-2 sm:grid-cols-3">
        {HORIZON_BANDS.map((b) => {
          const on = b.id === band;
          return (
            <button
              key={b.id}
              type="button"
              onClick={() => setBand(b.id)}
              aria-pressed={on}
              className={clsx(
                "rounded-xl border p-3 text-left transition-colors duration-150",
                on ? "border-accent bg-accentSoft" : "border-line bg-paper hover:border-ash",
              )}
            >
              <p className={clsx("text-caption font-semibold", on ? "text-accent" : "text-ink")}>{b.label}</p>
            </button>
          );
        })}
      </div>

      <div key={current.id} className="reveal-in rounded-xl border border-accent/30 bg-accentSoft p-3">
        <p className="text-micro font-semibold uppercase tracking-wide text-accent">{current.label} — examples</p>
        <ul className="mt-1.5 space-y-1">
          {current.examples.map((e) => (
            <li key={e} className="text-caption text-ink">
              {e}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
