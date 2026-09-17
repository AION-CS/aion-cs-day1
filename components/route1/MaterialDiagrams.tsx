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
import {
  BehaviourStory,
  ChainStory,
  ComplexityStory,
  DataUseStory,
  InfrastructureStory,
  ManagementStory,
  ProcessEfficiencyStory,
  type ChainStep,
} from "./Stories";

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
// Shared: a few hand-drawn glyphs positioned inline inside a diagram's own
// coordinate system (translate only, no scale maths) — cheaper and more
// reliable across browsers than nesting <svg>/<foreignObject> per icon.
// ---------------------------------------------------------------------------

const iconGroupProps = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.6,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

function ServerGlyph({ cx, cy, className }: { cx: number; cy: number; className?: string }) {
  return (
    <g transform={`translate(${cx - 12} ${cy - 12})`} className={className} {...iconGroupProps}>
      <rect x="3.2" y="4.2" width="17.6" height="5.4" rx="1.5" />
      <rect x="3.2" y="14.4" width="17.6" height="5.4" rx="1.5" />
      <path d="M6.6 6.9h.01M6.6 17.1h.01" />
      <path d="M10 6.9h6.4M10 17.1h6.4" />
    </g>
  );
}

function PersonGlyph({ cx, cy, className }: { cx: number; cy: number; className?: string }) {
  return (
    <g transform={`translate(${cx - 12} ${cy - 12})`} className={className} {...iconGroupProps}>
      <circle cx="12" cy="7.2" r="3.4" />
      <path d="M5 20v-1.6c0-3 3.1-5.4 7-5.4s7 2.4 7 5.4V20" />
    </g>
  );
}

const AREA_GLYPH_PATHS: Record<string, React.ReactNode> = {
  process: (
    <>
      <circle cx="12" cy="12" r="8.3" />
      <path d="M12 7.4V12l3.1 1.9" />
      <path d="M19.6 8.6h-3.4V5.2" />
    </>
  ),
  data: (
    <>
      <ellipse cx="12" cy="6" rx="7.2" ry="2.6" />
      <path d="M4.8 6v12c0 1.44 3.22 2.6 7.2 2.6s7.2-1.16 7.2-2.6V6" />
      <path d="M4.8 12c0 1.44 3.22 2.6 7.2 2.6s7.2-1.16 7.2-2.6" />
    </>
  ),
  infrastructure: (
    <>
      <rect x="3.2" y="4.2" width="17.6" height="5.4" rx="1.5" />
      <rect x="3.2" y="14.4" width="17.6" height="5.4" rx="1.5" />
      <path d="M6.6 6.9h.01M6.6 17.1h.01" />
      <path d="M10 6.9h6.4M10 17.1h6.4" />
    </>
  ),
  behaviour: (
    <>
      <circle cx="12" cy="7.2" r="3.4" />
      <path d="M5 20v-1.6c0-3 3.1-5.4 7-5.4s7 2.4 7 5.4V20" />
    </>
  ),
  complexity: (
    <>
      <path d="M12 3.5 21 8l-9 4.5L3 8l9-4.5Z" />
      <path d="m3 12 9 4.5 9-4.5" />
      <path d="m3 16 9 4.5 9-4.5" />
    </>
  ),
  management: (
    <>
      <path d="M8 9.5 13 4.5l3 3-5 5Z" />
      <path d="M11 12.5 6.5 17a1.8 1.8 0 0 1-2.6-2.5L8.5 10" />
      <path d="M11.5 13 18 19.5" />
      <path d="M14 20h6" />
    </>
  ),
};

function AreaGlyph({ id, cx, cy, className }: { id: string; cx: number; cy: number; className?: string }) {
  return (
    <g transform={`translate(${cx - 11} ${cy - 11})`} className={className} {...iconGroupProps}>
      {AREA_GLYPH_PATHS[id]}
    </g>
  );
}

// ---------------------------------------------------------------------------
// S2 — direct vs. indirect: an SVG two-zone sorter with a live tally
// ---------------------------------------------------------------------------

const IMPACT_SCENARIOS: {
  id: string;
  glyph: "servers" | "mail" | "storage" | "files";
  text: string;
  answer: "direct" | "indirect";
  costUnit: string;
  costUnitPlural: string;
  steps: ChainStep[];
  punchline: string;
}[] = [
  {
    id: "servers",
    glyph: "servers",
    text: "The new platform's servers run around the clock.",
    answer: "direct",
    costUnit: "hour running",
    costUnitPlural: "hours running",
    steps: [
      { label: "00:00 — servers running", cost: 1 },
      { label: "06:00 — servers running", cost: 1 },
      { label: "12:00 — servers running", cost: 1 },
      { label: "18:00 — servers running", cost: 1 },
    ],
    punchline: "Direct — 24 hours running is the system's own hardware and energy draw. Nobody chooses this daily; it's just what running means.",
  },
  {
    id: "reports",
    glyph: "mail",
    text: "A department now emails a report daily instead of monthly.",
    answer: "indirect",
    costUnit: "report this month",
    costUnitPlural: "reports this month",
    steps: [
      { label: "Day 1 — report sent", cost: 1 },
      { label: "Day 8 — report sent", cost: 1 },
      { label: "Day 15 — report sent", cost: 1 },
      { label: "Day 22 — report sent", cost: 1 },
      { label: "Day 29 — report sent", cost: 1 },
    ],
    punchline: "Indirect — 5 reports this month where 1 used to go out. The system didn't decide to send these; a person chose to check more often.",
  },
  {
    id: "storage",
    glyph: "storage",
    text: "The platform's own storage use grows every day it runs.",
    answer: "direct",
    costUnit: "GB added",
    costUnitPlural: "GB added",
    steps: [
      { label: "Week 1 — 40GB used", cost: 40 },
      { label: "Week 2 — 58GB used", cost: 18 },
      { label: "Week 3 — 71GB used", cost: 13 },
      { label: "Week 4 — 90GB used", cost: 19 },
    ],
    punchline: "Direct — storage filling up is the system running, not a person's choice each week.",
  },
  {
    id: "hoarding",
    glyph: "files",
    text: "Staff keep every file version because storage now feels free.",
    answer: "indirect",
    costUnit: "version kept",
    costUnitPlural: "versions kept",
    steps: [
      { label: "v1 saved", cost: 1 },
      { label: "v2 saved — v1 kept", cost: 1 },
      { label: "v3 saved — v1, v2 kept", cost: 1 },
      { label: "v4 saved — v1–v3 kept", cost: 1 },
    ],
    punchline: "Indirect — 4 versions of one file, none ever deleted. The habit changed because storage now feels free, not because the system requires it.",
  },
];

/** A small illustration per finding — what it looks like, not just what it says. */
function ScenarioGlyph({ id, className }: { id: "servers" | "mail" | "storage" | "files"; className?: string }) {
  const common = { fill: "none", stroke: "currentColor", strokeWidth: 1.6, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
  if (id === "servers") {
    return (
      <svg viewBox="0 0 32 32" className={className} {...common}>
        <rect x="5" y="6" width="22" height="8" rx="1.8" />
        <rect x="5" y="18" width="22" height="8" rx="1.8" />
        <circle cx="9.5" cy="10" r="1.1" fill="currentColor" stroke="none" className="animate-pulse" />
        <circle cx="9.5" cy="22" r="1.1" fill="currentColor" stroke="none" className="animate-pulse" />
        <path d="M13.5 10h9M13.5 22h9" />
      </svg>
    );
  }
  if (id === "mail") {
    return (
      <svg viewBox="0 0 32 32" className={className} {...common}>
        <rect x="3" y="9" width="18" height="13" rx="2" />
        <path d="M3 10.5l9 6.5 9-6.5" />
        <path d="M25 9.5a5 5 0 1 1-1.8-3.8" />
        <path d="M25 5.5v3.7h-3.7" />
      </svg>
    );
  }
  if (id === "storage") {
    return (
      <svg viewBox="0 0 32 32" className={className} {...common}>
        <ellipse cx="16" cy="8" rx="9" ry="3" />
        <path d="M7 8v14c0 1.7 4 3 9 3s9-1.3 9-3V8" />
        <path d="M7 15c0 1.7 4 3 9 3s9-1.3 9-3" />
        <path d="M16 12v9m-3-3.5 3 3.5 3-3.5" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 32 32" className={className} {...common}>
      <rect x="11" y="4" width="14" height="18" rx="1.6" opacity="0.45" />
      <rect x="8" y="7" width="14" height="18" rx="1.6" opacity="0.7" />
      <rect x="5" y="10" width="14" height="18" rx="1.6" />
    </svg>
  );
}

export function ImpactLayers() {
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const [completed, setCompleted] = useState<Record<string, boolean>>({});
  const directCount = IMPACT_SCENARIOS.filter((s) => completed[s.id] && s.answer === "direct").length;
  const indirectCount = IMPACT_SCENARIOS.filter((s) => completed[s.id] && s.answer === "indirect").length;

  return (
    <div className="space-y-3">
      <svg viewBox="0 0 520 170" className="w-full" role="img" aria-label="Two zones: the system itself, and people or process around it">
        <rect
          x="16" y="14" width="228" height="140" rx="16"
          className={clsx("transition-colors duration-300", directCount > 0 ? "fill-accentSoft stroke-accent" : "fill-canvas stroke-line")}
          strokeWidth="1.6"
        />
        <ServerGlyph cx={130} cy={58} className={directCount > 0 ? "text-accent" : "text-ash"} />
        <text x="130" y="100" textAnchor="middle" className="fill-ink" style={{ fontSize: 12.5, fontWeight: 700 }}>THE SYSTEM</text>
        <g key={`d-${directCount}`} className="reveal-in">
          <text x="130" y="128" textAnchor="middle" className={directCount > 0 ? "fill-accent" : "fill-ash"} style={{ fontSize: 15, fontWeight: 700 }}>
            {directCount} direct
          </text>
        </g>

        <rect
          x="276" y="14" width="228" height="140" rx="16"
          className={clsx("transition-colors duration-300", indirectCount > 0 ? "fill-mist stroke-ink/40" : "fill-canvas stroke-line")}
          strokeWidth="1.6"
        />
        <PersonGlyph cx={390} cy={56} className={indirectCount > 0 ? "text-ink" : "text-ash"} />
        <text x="390" y="100" textAnchor="middle" className="fill-ink" style={{ fontSize: 12.5, fontWeight: 700 }}>PEOPLE &amp; PROCESS</text>
        <g key={`i-${indirectCount}`} className="reveal-in">
          <text x="390" y="128" textAnchor="middle" className={indirectCount > 0 ? "fill-ink" : "fill-ash"} style={{ fontSize: 15, fontWeight: 700 }}>
            {indirectCount} indirect
          </text>
        </g>
      </svg>

      <p className="text-micro text-ash">Tap each finding, then click through it — watch it land on the correct side above.</p>
      <div className="space-y-2">
        {IMPACT_SCENARIOS.map((s) => {
          const open = expanded[s.id];
          const done = completed[s.id];
          const direct = s.answer === "direct";
          return (
            <div
              key={s.id}
              className={clsx(
                "rounded-xl border transition-colors duration-150",
                done ? (direct ? "border-accent bg-accentSoft" : "border-line bg-mist") : "border-line bg-paper",
              )}
            >
              <button
                type="button"
                onClick={() => setExpanded((r) => ({ ...r, [s.id]: !r[s.id] }))}
                aria-expanded={open}
                className="flex w-full items-start gap-2.5 p-3 text-left"
              >
                <ScenarioGlyph id={s.glyph} className={clsx("h-8 w-8 shrink-0", done ? (direct ? "text-accent" : "text-ink") : "text-ash")} />
                <span className="min-w-0 flex-1">
                  <span className="text-caption text-ink">{s.text}</span>
                  {done && (
                    <span className={clsx("reveal-in mt-0.5 block text-micro font-semibold", direct ? "text-accent" : "text-ink")}>
                      {direct ? "Direct" : "Indirect"} — click to review again
                    </span>
                  )}
                  {!done && <span className="mt-0.5 block text-micro text-ash">{open ? "Walk through it below" : "Tap to walk through it"}</span>}
                </span>
              </button>

              {open && (
                <div className="reveal-in border-t border-line p-3 pt-2.5">
                  <ChainStory
                    costUnit={s.costUnit}
                    costUnitPlural={s.costUnitPlural}
                    steps={s.steps}
                    ending={{ kind: "punchline", text: s.punchline }}
                    onComplete={() => setCompleted((c) => ({ ...c, [s.id]: true }))}
                  />
                </div>
              )}
            </div>
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
// S3 — the rebound curve, stepped interactively, and the trade-off funnel
// ---------------------------------------------------------------------------

const REBOUND_STAGES = [
  { label: "No change yet", x: 40, y: 40, saving: 100 },
  { label: "Usage grows", x: 270, y: 110, saving: 45 },
  { label: "Usage doubles", x: 500, y: 182, saving: 8 },
] as const;

const TRADEOFFS: {
  id: string;
  label: string;
  x: number;
  costUnit: string;
  costUnitPlural: string;
  steps: ChainStep[];
  punchline: string;
}[] = [
  {
    id: "convenience",
    label: "Convenience",
    x: 10,
    costUnit: "run this morning",
    costUnitPlural: "runs this morning",
    steps: [
      { label: "9:02 — report run, just to check", cost: 1 },
      { label: "9:15 — report run again", cost: 1 },
      { label: "9:40 — report run again", cost: 1 },
      { label: "10:20 — report run again", cost: 1 },
    ],
    punchline: "4 runs before lunch — the same report that used to be planned a day ahead. The click didn't get cheaper for the planet; it got cheaper for you.",
  },
  {
    id: "speed",
    label: "Speed",
    x: 140,
    costUnit: "query in an hour",
    costUnitPlural: "queries in an hour",
    steps: [
      { label: "Query fired — 9:02am", cost: 1 },
      { label: "Query fired — 9:14am", cost: 1 },
      { label: "Query fired — 9:31am", cost: 1 },
      { label: "Query fired — 9:47am", cost: 1 },
      { label: "Query fired — 10:03am", cost: 1 },
    ],
    punchline: "5 queries in one hour — waiting used to be the thing that rationed how often anyone asked.",
  },
  {
    id: "automation",
    label: "Automation",
    x: 270,
    costUnit: "identical run",
    costUnitPlural: "identical runs",
    steps: [
      { label: "Mon 2am — scheduled run, data unchanged", cost: 1 },
      { label: "Tue 2am — scheduled run, still unchanged", cost: 1 },
      { label: "Wed 2am — scheduled run, still unchanged", cost: 1 },
    ],
    punchline: "3 nights of identical output — a person would have skipped this after the first one. The schedule doesn't know that.",
  },
  {
    id: "transparency",
    label: "Transparency",
    x: 400,
    costUnit: "dashboard",
    costUnitPlural: "dashboards",
    steps: [
      { label: "Dashboard 1 — built to replace the report", cost: 1 },
      { label: "Dashboard 2 — built for a related question", cost: 1 },
      { label: "Dashboard 3 — built because dashboard 1 was slow", cost: 1 },
    ],
    punchline: "3 dashboards where 1 report used to answer the question — visibility invited more visibility, and none of them were ever retired.",
  },
];

export function ReboundCurve() {
  const [stage, setStage] = useState(0);
  const point = REBOUND_STAGES[stage];
  const [openTradeoff, setOpenTradeoff] = useState<string>(TRADEOFFS[0].id);
  const activeTradeoff = TRADEOFFS.find((t) => t.id === openTradeoff)!;

  return (
    <div className="space-y-5">
      <div>
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

        <svg viewBox="0 0 520 220" className="mt-3 w-full" role="img" aria-label="Predicted savings vs. actual net effect, converging toward zero as use increases">
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

          <line x1={point.x} y1="40" x2={point.x} y2={point.y} stroke="currentColor" className="text-warn" strokeWidth="1.5" strokeDasharray="3 3" style={{ transition: "all 500ms" }} />
          <circle cx={point.x} cy={point.y} r="6" className="fill-warn transition-all duration-500" />
        </svg>

        <p className="mt-3 rounded-lg border border-warn/30 bg-warn/5 px-3 py-2 text-caption text-ink">
          Net saving remaining: <span className="font-semibold text-warn">{point.saving}%</span> — the rest was absorbed
          by increased use, not lost, not banked either.
        </p>
      </div>

      <div>
        <p className="text-micro text-ash">Four gains feed one bill. Tap a gain to see how.</p>
        <svg viewBox="0 0 520 190" className="mt-2 w-full" role="img" aria-label="Convenience, speed, automation and transparency each feed the resource-use bill">
          {TRADEOFFS.map((t) => {
            const on = openTradeoff === t.id;
            const cx = t.x + 55;
            return (
              <g key={t.id}>
                <line x1={cx} y1="66" x2="260" y2="120" className={on ? "text-accent" : "text-line"} stroke="currentColor" strokeWidth={on ? 2.2 : 1.4} strokeDasharray={on ? "6 4" : undefined} style={{ transition: "all 300ms" }} />
                <g role="button" tabIndex={0} onClick={() => setOpenTradeoff(t.id)} onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); setOpenTradeoff(t.id); } }} className="cursor-pointer">
                  <rect x={t.x} y="16" width="110" height="50" rx="10" className={on ? "fill-accent stroke-accent" : "fill-paper stroke-line"} strokeWidth="1.5" />
                  <text x={cx} y="46" textAnchor="middle" className={on ? "fill-paper" : "fill-ink"} style={{ fontSize: 12.5, fontWeight: 600 }}>{t.label}</text>
                </g>
              </g>
            );
          })}

          <rect x="160" y="120" width="200" height="54" rx="12" className="fill-warn/10 stroke-warn/50" strokeWidth="1.6" />
          <text x="260" y="142" textAnchor="middle" className="fill-warn" style={{ fontSize: 12.5, fontWeight: 700 }}>RESOURCE USE</text>
          <text x="260" y="160" textAnchor="middle" className="fill-ink" style={{ fontSize: 11 }}>where the bill lands</text>
        </svg>

        <div key={activeTradeoff.id} className="reveal-in mt-2 rounded-lg border border-accent/25 bg-accentSoft p-3">
          <ChainStory
            costUnit={activeTradeoff.costUnit}
            costUnitPlural={activeTradeoff.costUnitPlural}
            steps={activeTradeoff.steps}
            ending={{ kind: "punchline", text: activeTradeoff.punchline }}
          />
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// S4 — the six-area diagnostic framework, as a two-layer SVG: five areas
// below, Management above reviewing across all five (same visual language
// as Route 2's management-levers diagram). Each area's own example gets a
// small illustration too, not just a sentence.
// ---------------------------------------------------------------------------

const AREA_STORIES: Record<string, React.ComponentType> = {
  process: ProcessEfficiencyStory,
  data: DataUseStory,
  infrastructure: InfrastructureStory,
  behaviour: BehaviourStory,
  complexity: ComplexityStory,
  management: ManagementStory,
};

export function AreaFramework() {
  const [open, setOpen] = useState<string>("process");
  const active = AREAS.find((a) => a.id === open)!;
  const lower = AREAS.filter((a) => a.id !== "management");
  const Story = AREA_STORIES[active.id];

  const boxW = 128;
  const gap = 12;
  const startX = 12;
  const boxX = (i: number) => startX + i * (boxW + gap);
  const boxCx = (i: number) => boxX(i) + boxW / 2;
  const mgmtCx = 372;

  return (
    <div className="space-y-3">
      <svg viewBox="0 0 720 250" className="w-full" role="img" aria-label="Five areas below, Management above, reviewing across all five">
        <g role="button" tabIndex={0} onClick={() => setOpen("management")} onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") setOpen("management"); }} className="cursor-pointer">
          <rect x="222" y="14" width="300" height="58" rx="14" className={open === "management" ? "fill-accent stroke-accent" : "fill-accentSoft stroke-accent/50"} strokeWidth="1.6" />
          <AreaGlyph id="management" cx={272} cy={43} className={open === "management" ? "text-paper" : "text-accent"} />
          <text x="392" y="48" textAnchor="middle" className={open === "management" ? "fill-paper" : "fill-accent"} style={{ fontSize: 14.5, fontWeight: 700 }}>
            MANAGEMENT
          </text>
        </g>

        {lower.map((a, i) => {
          const on = open === a.id;
          const cx = boxCx(i);
          return (
            <g key={a.id}>
              <line x1={cx} y1="150" x2={mgmtCx} y2="72" stroke="currentColor" className={on ? "text-accent" : "text-line"} strokeWidth={on ? 2.2 : 1.4} strokeDasharray={on ? "6 4" : undefined} style={{ transition: "all 300ms" }} />
              <g role="button" tabIndex={0} onClick={() => setOpen(a.id)} onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); setOpen(a.id); } }} className="cursor-pointer">
                <rect x={boxX(i)} y="150" width={boxW} height="72" rx="12" className={on ? "fill-paper stroke-accent" : "fill-mist stroke-line"} strokeWidth="1.6" />
                <AreaGlyph id={a.id} cx={cx} cy={178} className={on ? "text-accent" : "text-ash"} />
                <text x={cx} y="208" textAnchor="middle" className={on ? "fill-accent" : "fill-ink"} style={{ fontSize: 11.5, fontWeight: 600 }}>
                  {a.name.split(" ")[0]}
                </text>
                <text x={cx} y="220" textAnchor="middle" className={on ? "fill-accent" : "fill-ink"} style={{ fontSize: 11.5, fontWeight: 600 }}>
                  {a.name.split(" ").slice(1).join(" ")}
                </text>
              </g>
            </g>
          );
        })}

        <text x="360" y="112" textAnchor="middle" className="fill-ash" style={{ fontSize: 11.5, fontStyle: "italic" }}>
          reviews and decides across all five
        </text>
      </svg>

      <div key={active.id} className="reveal-in rounded-xl border border-accent/25 bg-accentSoft p-3">
        <p className="flex items-center gap-2 text-caption font-semibold text-accent">
          <Icon name={active.icon} className="h-4 w-4" />
          {active.name}
        </p>
        <p className="mt-1 text-micro text-ash">{active.note}</p>
        <div className="mt-2 rounded-lg border border-accent/20 bg-paper p-2.5">
          <p className="text-micro text-ink">
            <span className="font-semibold">Example. </span>
            {active.example}
          </p>
          <div className="mt-2.5 border-t border-line pt-2.5">
            <Story />
          </div>
        </div>
      </div>
    </div>
  );
}
