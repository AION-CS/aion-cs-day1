"use client";

import { useState } from "react";
import clsx from "clsx";
import { Icon } from "@/components/icons/LineIcons";
import type { IconKey } from "@/lib/routes";

/**
 * The seven M1–M7 diagrams. Every one is a live widget with exactly one
 * micro-interaction — inline SVG plus CSS transitions, no charting or
 * animation library (CLAUDE.md §9). Sentences stay in HTML beside each SVG
 * rather than inside it, so they do not shrink with the viewBox at 380px.
 */

// ---------------------------------------------------------------------------
// M1 — Loose gauges: wired to a decision, or just collected?
// ---------------------------------------------------------------------------

type GaugeSample = { id: string; label: string; wired: boolean; note: string };

const GAUGES: GaugeSample[] = [
  { id: "kwh", label: "Monthly kWh total", wired: false, note: "An activity number with no stated target, owner, or decision attached — collected, not managed." },
  { id: "pue", label: "PUE, boundary varies by site", wired: false, note: "Even where a number is watched, an inconsistent boundary means it can't yet be compared or acted on across sites — collected, not managed." },
  { id: "co2e", label: "CO₂e per service vs 2030 target, owned", wired: true, note: "Target, owner and a live decision (on track or not) are all present — this one is wired to a decision." },
  { id: "reuse", label: "Device reuse rate vs 30% target, owned by Procurement", wired: true, note: "A named target and a named owner turn this into something a decision can actually be made from." },
];

export function DataVsManagementGauges() {
  const [openId, setOpenId] = useState<string | null>(null);
  const open = GAUGES.find((g) => g.id === openId) ?? null;

  return (
    <div className="space-y-4">
      <svg
        viewBox="0 0 360 150"
        preserveAspectRatio="xMidYMid meet"
        className="mx-auto h-auto w-full max-w-xl"
        role="img"
        aria-label="Four gauges representing Clarity's real figures; tap one to see whether it is wired to a decision or just being collected."
      >
        {GAUGES.map((g, i) => {
          const cx = 46 + i * 90;
          const cy = 70;
          const isOpen = openId === g.id;
          return (
            <g key={g.id} className="cursor-pointer" onClick={() => setOpenId((cur) => (cur === g.id ? null : g.id))}>
              <path
                d={`M ${cx - 34} ${cy} A 34 34 0 0 1 ${cx + 34} ${cy}`}
                fill="none"
                stroke="currentColor"
                className="text-line"
                strokeWidth="8"
                strokeLinecap="round"
              />
              <path
                d={`M ${cx - 34} ${cy} A 34 34 0 0 1 ${cx + 34} ${cy}`}
                fill="none"
                stroke="currentColor"
                className={g.wired ? "text-accent" : "text-warn"}
                strokeWidth="8"
                strokeLinecap="round"
                strokeDasharray="107"
                strokeDashoffset={g.wired ? "20" : "60"}
                style={{ transition: "stroke-dashoffset .3s ease" }}
              />
              <circle cx={cx} cy={cy} r="4" className={isOpen ? "fill-ink" : "fill-ash"} />
              <text x={cx} y={cy + 26} textAnchor="middle" className={clsx("text-[9px] font-semibold", isOpen ? "fill-ink" : "fill-ash")}>
                {g.label.length > 22 ? g.label.slice(0, 20) + "…" : g.label}
              </text>
            </g>
          );
        })}
      </svg>

      <div>
        <p className="text-micro font-semibold uppercase tracking-wide text-ash">Tap a gauge</p>
        <div className="mt-1.5 flex flex-wrap gap-1.5">
          {GAUGES.map((g) => {
            const on = openId === g.id;
            return (
              <button
                key={g.id}
                type="button"
                onClick={() => setOpenId((cur) => (cur === g.id ? null : g.id))}
                aria-pressed={on}
                className={clsx(
                  "rounded-full border px-2.5 py-1 text-micro font-semibold transition-colors duration-150",
                  on ? "border-accent bg-accentSoft text-accent" : "border-line bg-paper text-ash hover:border-ash",
                )}
              >
                {g.label}
              </button>
            );
          })}
        </div>
      </div>

      {open ? (
        <div
          key={open.id}
          className={clsx(
            "reveal-in rounded-xl border p-3",
            open.wired ? "border-accent/30 bg-accentSoft" : "border-warn/30 bg-warn/5",
          )}
        >
          <p className={clsx("text-caption font-semibold", open.wired ? "text-accent" : "text-warn")}>
            {open.wired ? "Wired to a decision." : "Just being collected."}
          </p>
          <p className="mt-1 text-caption text-ink">{open.note}</p>
        </div>
      ) : (
        <p className="rounded-xl border border-dashed border-line bg-paper p-3 text-caption text-ash">
          Tap a gauge to see whether it's wired to a decision, or just being collected.
        </p>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// M2 — Three metric layers, as a pyramid
// ---------------------------------------------------------------------------

type Tier = { id: string; name: string; example: string; y0: number; y1: number; wTop: number; wBottom: number };

const TIERS: Tier[] = [
  { id: "management", name: "Management metric", example: "CO₂e per service, vs a stated target — the number a leader steers by.", y0: 12, y1: 52, wTop: 40, wBottom: 110 },
  { id: "outcome", name: "Outcome metric", example: "Emissions avoided, utilisation improved, service life extended.", y0: 52, y1: 96, wTop: 110, wBottom: 190 },
  { id: "activity", name: "Activity / input metric", example: "kWh drawn, devices bought, tickets closed.", y0: 96, y1: 144, wTop: 190, wBottom: 280 },
];

export function MetricLayersPyramid() {
  const [openId, setOpenId] = useState<string>("management");
  const open = TIERS.find((t) => t.id === openId)!;

  return (
    <div className="space-y-4">
      <svg
        viewBox="0 0 300 160"
        preserveAspectRatio="xMidYMid meet"
        className="mx-auto h-auto w-full max-w-sm"
        role="img"
        aria-label="A three-tier pyramid: management metrics at the apex, outcome metrics in the middle, activity metrics at the base."
      >
        {TIERS.map((t) => {
          const on = openId === t.id;
          const x0Top = 150 - t.wTop / 2;
          const x1Top = 150 + t.wTop / 2;
          const x0Bottom = 150 - t.wBottom / 2;
          const x1Bottom = 150 + t.wBottom / 2;
          return (
            <g key={t.id} className="cursor-pointer" onClick={() => setOpenId(t.id)}>
              <polygon
                points={`${x0Top},${t.y0} ${x1Top},${t.y0} ${x1Bottom},${t.y1} ${x0Bottom},${t.y1}`}
                className={on ? "fill-accent" : "fill-mist stroke-line"}
                strokeWidth="1"
                style={{ transition: "fill .2s ease" }}
              />
              <text x="150" y={(t.y0 + t.y1) / 2 + 4} textAnchor="middle" className={clsx("text-[10px] font-semibold", on ? "fill-paper" : "fill-ink")}>
                {t.name}
              </text>
            </g>
          );
        })}
      </svg>

      <div className="flex flex-wrap justify-center gap-1.5">
        {TIERS.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setOpenId(t.id)}
            aria-pressed={openId === t.id}
            className={clsx(
              "rounded-full border px-2.5 py-1 text-micro font-semibold transition-colors duration-150",
              openId === t.id ? "border-accent bg-accentSoft text-accent" : "border-line bg-paper text-ash hover:border-ash",
            )}
          >
            {t.name}
          </button>
        ))}
      </div>

      <div key={open.id} className="reveal-in rounded-xl border border-accent/30 bg-accentSoft p-3">
        <p className="text-caption text-ink">
          <span className="font-semibold text-accent">Example — </span>
          {open.example}
        </p>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// M3 — The six areas, as clickable chips
// ---------------------------------------------------------------------------

type AreaChip = { id: string; name: string; icon: IconKey; definition: string };

const AREA_CHIPS: AreaChip[] = [
  { id: "metricQuality", name: "Metric Quality", icon: "certificate", definition: "Comparable, robust, built on consistent boundaries." },
  { id: "dataAvailability", name: "Data Availability", icon: "database", definition: "Is it captured at all, and completely?" },
  { id: "reporting", name: "Reporting", icon: "clipboard", definition: "Informs — or actually supports a decision." },
  { id: "managementRelevance", name: "Management Relevance", icon: "target", definition: "Tied to a target, an owner, and a decision." },
  { id: "carbonMonitoring", name: "Carbon Monitoring", icon: "radar", definition: "IT emissions captured and allocated — Scope 1/2/3, in one line." },
  { id: "responsibilities", name: "Responsibilities", icon: "person", definition: "Is there a named owner?" },
];

export function SixAreaChips() {
  const [seen, setSeen] = useState<string[]>([]);
  const [openId, setOpenId] = useState<string | null>(null);
  const open = AREA_CHIPS.find((a) => a.id === openId) ?? null;

  const select = (id: string) => {
    setOpenId((cur) => (cur === id ? null : id));
    setSeen((cur) => (cur.includes(id) ? cur : [...cur, id]));
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
        {AREA_CHIPS.map((a) => {
          const isOpen = openId === a.id;
          const wasSeen = seen.includes(a.id);
          return (
            <button
              key={a.id}
              type="button"
              onClick={() => select(a.id)}
              aria-pressed={isOpen}
              className={clsx(
                "flex flex-col items-center gap-1.5 rounded-xl border p-3 text-center transition-colors duration-150",
                isOpen
                  ? "border-accent bg-accent text-paper"
                  : wasSeen
                    ? "border-accent/40 bg-accentSoft text-accent"
                    : "border-line bg-paper text-ash hover:border-ash",
              )}
            >
              <Icon name={a.icon} className="h-5 w-5" />
              <span className="text-micro font-semibold">{a.name}</span>
            </button>
          );
        })}
      </div>

      {open ? (
        <div key={open.id} className="reveal-in rounded-xl border border-accent/30 bg-accentSoft p-3">
          <p className="text-caption text-ink">
            <span className="font-semibold text-accent">{open.name} — </span>
            {open.definition}
          </p>
        </div>
      ) : (
        <p className="rounded-xl border border-dashed border-line bg-paper p-3 text-caption text-ash">
          Tap an area to read what it covers — {seen.length} of 6 opened.
        </p>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// M4 — The six-gate filter
// ---------------------------------------------------------------------------

const GATES = ["Relevant", "Understandable", "Comparable", "Robust", "Actionable", "Owned"];

type FilterSample = { id: string; label: string; passes: boolean[]; horizon: "shortTerm" | "structural" };

const FILTER_SAMPLES: FilterSample[] = [
  { id: "pue-good", label: "PUE, one shared boundary, reviewed quarterly", passes: [true, true, true, true, true, true], horizon: "structural" },
  { id: "pue-bad", label: "PUE, each site uses a different boundary", passes: [true, true, false, false, false, false], horizon: "shortTerm" },
  { id: "dashboards", label: "Number of dashboards produced this quarter", passes: [false, true, true, true, false, true], horizon: "shortTerm" },
  { id: "co2e", label: "CO₂e per service, target + owner + review", passes: [true, true, true, true, true, true], horizon: "structural" },
];

export function SixGateFilter() {
  const [sampleId, setSampleId] = useState<string>("pue-bad");
  const sample = FILTER_SAMPLES.find((s) => s.id === sampleId)!;
  const allPass = sample.passes.every(Boolean);

  return (
    <div className="space-y-4">
      <div>
        <p className="text-micro font-semibold uppercase tracking-wide text-ash">Drop a sample metric in</p>
        <div className="mt-1.5 flex flex-wrap gap-1.5">
          {FILTER_SAMPLES.map((s) => (
            <button
              key={s.id}
              type="button"
              onClick={() => setSampleId(s.id)}
              aria-pressed={sampleId === s.id}
              className={clsx(
                "rounded-full border px-2.5 py-1 text-micro font-semibold transition-colors duration-150",
                sampleId === s.id ? "border-accent bg-accentSoft text-accent" : "border-line bg-paper text-ash hover:border-ash",
              )}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>

      <svg
        viewBox="0 0 360 120"
        preserveAspectRatio="xMidYMid meet"
        className="mx-auto h-auto w-full max-w-xl"
        role="img"
        aria-label={`Six gates; this sample ${allPass ? "clears all six" : "fails at least one"}.`}
      >
        <rect x="4" y="46" width="60" height="28" rx="8" className="fill-paper stroke-ink" strokeWidth="1.4" />
        <text x="34" y="64" textAnchor="middle" className="fill-ink text-[10px] font-semibold">
          Metric
        </text>
        {GATES.map((g, i) => {
          const x = 84 + i * 46;
          const pass = sample.passes[i];
          return (
            <g key={g}>
              <path d={i === 0 ? "M64 60 H84" : `M${x - 46 + 30} 60 H${x}`} stroke="currentColor" className="text-ash" strokeWidth="1.2" />
              <circle
                key={sampleId + i}
                cx={x + 15}
                cy="60"
                r="15"
                className={clsx("anim-pop", pass ? "fill-accentSoft stroke-accent" : "fill-danger/10 stroke-danger")}
                strokeWidth="1.6"
              />
              {pass ? (
                <path d={`M${x + 9} 60 l4 4 l9 -9`} fill="none" stroke="currentColor" className="text-accent" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              ) : (
                <path d={`M${x + 10} 54 l10 12 M${x + 20} 54 l-10 12`} stroke="currentColor" className="text-danger" strokeWidth="2" strokeLinecap="round" />
              )}
              <text x={x + 15} y="88" textAnchor="middle" className="fill-ash text-[8px] font-semibold uppercase tracking-wide">
                {g}
              </text>
            </g>
          );
        })}
      </svg>

      <div className={clsx("rounded-xl border p-3", allPass ? "border-accent/30 bg-accentSoft" : "border-warn/30 bg-warn/5")}>
        <p className={clsx("text-caption font-semibold", allPass ? "text-accent" : "text-warn")}>
          {allPass ? "Clears all six — management-effective." : "Fails at least one gate — merely informative for now."}
        </p>
        <p className="mt-1 text-caption text-ink">
          Buildable{" "}
          <span className="font-semibold">{sample.horizon === "shortTerm" ? "short-term" : "only structurally"}</span> —{" "}
          {sample.horizon === "shortTerm"
            ? "the fix here is an operational one, not a governance one."
            : "it needs a target, an owner and a review cadence before it counts."}
        </p>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// M5 — The PDCA loop, clickable arcs
// ---------------------------------------------------------------------------

type LoopStep = { id: string; verb: string; owner: string; detail: string; angle: number };

const LOOP_STEPS: LoopStep[] = [
  { id: "measure", verb: "Measure", owner: "Data owner", detail: "Capture the figure consistently, on a fixed boundary.", angle: -90 },
  { id: "evaluate", verb: "Evaluate", owner: "Metric owner", detail: "Compare it against the target — on track, or not?", angle: -18 },
  { id: "prioritise", verb: "Prioritise", owner: "Review lead", detail: "Decide what, out of everything found, actually gets acted on.", angle: 54 },
  { id: "adjust", verb: "Adjust", owner: "Delivery owner", detail: "Make the change — a process, a policy, a target revision.", angle: 126 },
  { id: "review", verb: "Review", owner: "Management review", detail: "On a fixed cadence, check the adjustment worked — then the loop repeats.", angle: 198 },
];

const LOOP_CX = 150;
const LOOP_CY = 100;
const LOOP_R = 62;

export function PdcaLoop() {
  const [openId, setOpenId] = useState<string>("measure");
  const open = LOOP_STEPS.find((s) => s.id === openId)!;

  return (
    <div className="space-y-4">
      <svg
        viewBox="0 0 300 200"
        preserveAspectRatio="xMidYMid meet"
        className="mx-auto h-auto w-full max-w-sm"
        role="img"
        aria-label="A five-step PDCA loop: measure, evaluate, prioritise, adjust, review, then repeating."
      >
        <circle cx={LOOP_CX} cy={LOOP_CY} r={LOOP_R} fill="none" stroke="currentColor" className="text-line" strokeWidth="10" />
        {LOOP_STEPS.map((s) => {
          const rad = (a: number) => (a * Math.PI) / 180;
          const x = LOOP_CX + LOOP_R * Math.cos(rad(s.angle));
          const y = LOOP_CY + LOOP_R * Math.sin(rad(s.angle));
          const on = openId === s.id;
          return (
            <g key={s.id} className="cursor-pointer" onClick={() => setOpenId(s.id)}>
              <circle cx={x} cy={y} r="20" className={clsx("transition-colors duration-150", on ? "fill-accent" : "fill-paper stroke-accent/40")} strokeWidth="1.4" />
              <text x={x} y={y + 3} textAnchor="middle" className={clsx("text-[8px] font-semibold", on ? "fill-paper" : "fill-ink")}>
                {s.verb}
              </text>
            </g>
          );
        })}
        <text x={LOOP_CX} y={LOOP_CY - 4} textAnchor="middle" className="fill-ash text-[9px] font-semibold uppercase tracking-wide">
          repeats
        </text>
        <text x={LOOP_CX} y={LOOP_CY + 10} textAnchor="middle" className="fill-ash text-[9px] font-semibold uppercase tracking-wide">
          on a cadence
        </text>
      </svg>

      <div className="flex flex-wrap justify-center gap-1.5">
        {LOOP_STEPS.map((s) => (
          <button
            key={s.id}
            type="button"
            onClick={() => setOpenId(s.id)}
            aria-pressed={openId === s.id}
            className={clsx(
              "rounded-full border px-2.5 py-1 text-micro font-semibold transition-colors duration-150",
              openId === s.id ? "border-accent bg-accentSoft text-accent" : "border-line bg-paper text-ash hover:border-ash",
            )}
          >
            {s.verb}
          </button>
        ))}
      </div>

      <div key={open.id} className="reveal-in rounded-xl border border-accent/30 bg-accentSoft p-3">
        <p className="text-caption text-ink">
          <span className="font-semibold text-accent">{open.verb} — </span>
          {open.detail}
        </p>
        <p className="mt-1 text-micro text-ash">Typical owner: {open.owner}</p>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// M6 — The measurability / informative value / controllability triangle
// ---------------------------------------------------------------------------

type TriangleSample = { id: string; label: string; x: number; y: number; note: string };

// Triangle vertices: Measurability top (180,26), Informative value bottom-left (60,190), Controllability bottom-right (300,190).
const TRIANGLE_SAMPLES: TriangleSample[] = [
  { id: "kwh", label: "kWh drawn, no target", x: 168, y: 70, note: "Easy to measure, but on its own barely informative — pulled hard toward Measurability." },
  { id: "grid", label: "Grid carbon intensity", x: 130, y: 150, note: "Genuinely informative — and almost entirely outside Clarity's control. Pulled toward Informative value, away from Controllability." },
  { id: "reuse", label: "Device reuse rate vs target, owned", x: 224, y: 150, note: "Something Procurement can actually steer — pulled toward Controllability, with real informative value too." },
  { id: "co2e", label: "CO₂e per service, target + owner + review", x: 180, y: 118, note: "Reasonably strong on all three at once — closer to the centre than any single corner." },
];

export function TradeoffTriangle() {
  const [sampleId, setSampleId] = useState<string>("kwh");
  const sample = TRIANGLE_SAMPLES.find((s) => s.id === sampleId)!;

  return (
    <div className="space-y-4">
      <svg
        viewBox="0 0 360 220"
        preserveAspectRatio="xMidYMid meet"
        className="mx-auto h-auto w-full max-w-md"
        role="img"
        aria-label={`A triangle of measurability, informative value and controllability; the selected metric sits closest to ${sample.note}`}
      >
        <polygon points="180,26 60,190 300,190" fill="none" stroke="currentColor" className="text-line" strokeWidth="1.6" />
        <text x="180" y="18" textAnchor="middle" className="fill-ink text-[11px] font-semibold">
          Measurability
        </text>
        <text x="52" y="204" textAnchor="middle" className="fill-ink text-[11px] font-semibold">
          Informative value
        </text>
        <text x="308" y="204" textAnchor="middle" className="fill-ink text-[11px] font-semibold">
          Controllability
        </text>
        <circle cx="180" cy="26" r="4" className="fill-ash" />
        <circle cx="60" cy="190" r="4" className="fill-ash" />
        <circle cx="300" cy="190" r="4" className="fill-ash" />

        <circle
          key={sampleId}
          cx={sample.x}
          cy={sample.y}
          r="8"
          className="anim-pop fill-accent"
        />
      </svg>

      <div>
        <p className="text-micro font-semibold uppercase tracking-wide text-ash">Try a sample metric</p>
        <div className="mt-1.5 flex flex-wrap gap-1.5">
          {TRIANGLE_SAMPLES.map((s) => (
            <button
              key={s.id}
              type="button"
              onClick={() => setSampleId(s.id)}
              aria-pressed={sampleId === s.id}
              className={clsx(
                "rounded-full border px-2.5 py-1 text-micro font-semibold transition-colors duration-150",
                sampleId === s.id ? "border-accent bg-accentSoft text-accent" : "border-line bg-paper text-ash hover:border-ash",
              )}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>

      <div key={sample.id} className="reveal-in rounded-xl border border-accent/30 bg-accentSoft p-3">
        <p className="text-caption text-ink">{sample.note}</p>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// M7 — Three candidate lines: shine vs structural strength
// ---------------------------------------------------------------------------

type LinePreview = { id: string; letter: string; icon: IconKey; title: string; shine: number; strength: number; note: string };

const LINE_PREVIEWS: LinePreview[] = [
  { id: "a", letter: "A", icon: "gauge", title: "KPI & dashboard system", shine: 3, strength: 2, note: "Visible fast — but only as strong as the review process reading it." },
  { id: "b", letter: "B", icon: "factory", title: "IT carbon monitoring", shine: 2, strength: 2, note: "Credible once built — but a full baseline and allocation build takes time." },
  { id: "c", letter: "C", icon: "cycle", title: "Review & improvement process", shine: 1, strength: 3, note: "Least visible on day one — but it is what makes any of the data already collected start steering." },
];

export function ThreeLinesPreview() {
  const [openId, setOpenId] = useState<string>("a");
  const open = LINE_PREVIEWS.find((l) => l.id === openId)!;

  return (
    <div className="space-y-4">
      <div className="grid gap-3 sm:grid-cols-3">
        {LINE_PREVIEWS.map((l) => {
          const on = openId === l.id;
          return (
            <button
              key={l.id}
              type="button"
              onClick={() => setOpenId(l.id)}
              aria-pressed={on}
              className={clsx(
                "flex flex-col gap-2 rounded-xl border p-3 text-left transition-colors duration-150",
                on ? "border-accent bg-accentSoft" : "border-line bg-paper hover:border-ash",
              )}
            >
              <div className="flex items-center gap-2">
                <span className={clsx("flex h-7 w-7 shrink-0 items-center justify-center rounded-lg", on ? "bg-accent text-paper" : "bg-mist text-ash")}>
                  <Icon name={l.icon} className="h-3.5 w-3.5" />
                </span>
                <p className="text-caption font-semibold text-ink">
                  {l.letter} — {l.title}
                </p>
              </div>
              <BarPair shine={l.shine} strength={l.strength} />
            </button>
          );
        })}
      </div>

      <div key={open.id} className="reveal-in rounded-xl border border-accent/30 bg-accentSoft p-3">
        <p className="text-caption text-ink">
          <span className="font-semibold text-accent">
            Line {open.letter} — {open.title}.{" "}
          </span>
          {open.note}
        </p>
      </div>
      <p className="text-micro text-ash">
        Shine and structural strength are not the same axis — a line can score high on one and low on the other (M7).
      </p>
    </div>
  );
}

function BarPair({ shine, strength }: { shine: number; strength: number }) {
  return (
    <div className="space-y-1.5">
      <MiniBar label="Shine" value={shine} tone="warn" />
      <MiniBar label="Structural strength" value={strength} tone="accent" />
    </div>
  );
}

function MiniBar({ label, value, tone }: { label: string; value: number; tone: "warn" | "accent" }) {
  return (
    <div>
      <p className="text-micro text-ash">{label}</p>
      <div className="mt-0.5 h-2 w-full overflow-hidden rounded-full bg-mist">
        <div
          className={clsx("h-full rounded-full", tone === "warn" ? "bg-warn" : "bg-accent")}
          style={{ width: `${(value / 3) * 100}%`, transition: "width .3s ease" }}
        />
      </div>
    </div>
  );
}
