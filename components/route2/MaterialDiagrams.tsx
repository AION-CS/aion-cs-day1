"use client";

import { useState } from "react";
import clsx from "clsx";
import { Icon } from "@/components/icons/LineIcons";
import { LAYERS, ROLES } from "@/lib/route2";

/** The four D1–D4 diagrams — inline SVG, one micro-interaction each (CLAUDE.md §9). */

// ---------------------------------------------------------------------------
// D1 — Documentation pile vs steering wheel
// ---------------------------------------------------------------------------

export function LeadershipInstrumentToggle() {
  const [mode, setMode] = useState<"documentation" | "steering">("documentation");

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {(["documentation", "steering"] as const).map((m) => (
          <button
            key={m}
            type="button"
            onClick={() => setMode(m)}
            aria-pressed={mode === m}
            className={clsx(
              "rounded-full border px-3 py-1.5 text-caption font-semibold transition-colors duration-150",
              mode === m ? "border-accent bg-accentSoft text-accent" : "border-line bg-paper text-ash hover:border-ash",
            )}
          >
            {m === "documentation" ? "Documentation pile" : "Steering wheel"}
          </button>
        ))}
      </div>

      <svg
        viewBox="0 0 320 160"
        preserveAspectRatio="xMidYMid meet"
        className="mx-auto h-auto w-full max-w-md"
        role="img"
        aria-label={mode === "documentation" ? "A pile of reports stacking up, nothing moves." : "The same data turning a decision, like a steering wheel."}
      >
        {mode === "documentation" ? (
          <g>
            {[0, 1, 2, 3, 4].map((i) => (
              <rect key={i} x={130 - i * 3} y={128 - i * 16} width="120" height="14" rx="3" className={i === 4 ? "fill-accentSoft stroke-accent" : "fill-paper stroke-line"} strokeWidth="1.2" />
            ))}
            <text x="160" y="150" textAnchor="middle" className="fill-ash text-[11px] font-semibold">
              Reports keep stacking — nothing moves
            </text>
          </g>
        ) : (
          <g>
            <circle cx="110" cy="70" r="34" fill="none" stroke="currentColor" className="text-accent" strokeWidth="6" />
            <circle cx="110" cy="70" r="8" className="fill-accent" />
            <path d="M110 36 v14 M110 90 v14 M76 70 h14 M130 70 h14" stroke="currentColor" className="text-accent" strokeWidth="4" strokeLinecap="round" />
            <path d="M148 70 H200" stroke="currentColor" className="text-accent" strokeWidth="2" strokeDasharray="4 4" markerEnd="url(#arrow)" />
            <defs>
              <marker id="arrow" markerWidth="8" markerHeight="8" refX="4" refY="4" orient="auto">
                <path d="M0 0 L8 4 L0 8 Z" className="fill-accent" />
              </marker>
            </defs>
            <rect x="204" y="46" width="100" height="48" rx="8" className="fill-accentSoft stroke-accent" strokeWidth="1.4" />
            <text x="254" y="66" textAnchor="middle" className="fill-accent text-[11px] font-semibold">
              A decision
            </text>
            <text x="254" y="80" textAnchor="middle" className="fill-accent text-[11px] font-semibold">
              actually turns
            </text>
            <text x="160" y="130" textAnchor="middle" className="fill-ash text-[11px] font-semibold">
              The same data — wired to a decision
            </text>
          </g>
        )}
      </svg>

      <p className="text-caption text-ink">
        {mode === "documentation"
          ? "A perfect dashboard nobody acts on is documentation, not management — however accurate every figure in the pile is."
          : "The instrument only counts as management once something on the other end actually turns because of it."}
      </p>
    </div>
  );
}

// ---------------------------------------------------------------------------
// D2 — The staircase
// ---------------------------------------------------------------------------

const STEP_NOTE: Record<string, string> = {
  shortTerm: "Pick core KPIs, define a pragmatic carbon baseline, assign owners. No governance required to start.",
  mediumTerm: "A proper dashboard, review cycles, richer emissions data — built on what the short-term stage captured.",
  structural: "KPIs and carbon monitoring embedded permanently in governance and management reviews.",
};

export function LayeredStaircase() {
  const [openId, setOpenId] = useState<string>("shortTerm");
  const open = LAYERS.find((l) => l.id === openId)!;

  return (
    <div className="space-y-4">
      <svg
        viewBox="0 0 320 160"
        preserveAspectRatio="xMidYMid meet"
        className="mx-auto h-auto w-full max-w-md"
        role="img"
        aria-label="A three-step staircase: short-term, medium-term, structural."
      >
        {LAYERS.map((l, i) => {
          const on = openId === l.id;
          const stepW = 90;
          const x = 20 + i * stepW;
          const h = 30 + i * 34;
          const y = 148 - h;
          return (
            <g key={l.id} className="cursor-pointer" onClick={() => setOpenId(l.id)}>
              <rect x={x} y={y} width={stepW - 8} height={h} rx="6" className={on ? "fill-accent" : "fill-mist stroke-line"} strokeWidth="1" style={{ transition: "fill .2s ease" }} />
              <text x={x + (stepW - 8) / 2} y={y - 8} textAnchor="middle" className="fill-ink text-[10px] font-semibold">
                {l.name}
              </text>
            </g>
          );
        })}
      </svg>

      <div className="flex flex-wrap justify-center gap-1.5">
        {LAYERS.map((l) => (
          <button
            key={l.id}
            type="button"
            onClick={() => setOpenId(l.id)}
            aria-pressed={openId === l.id}
            className={clsx(
              "rounded-full border px-2.5 py-1 text-micro font-semibold transition-colors duration-150",
              openId === l.id ? "border-accent bg-accentSoft text-accent" : "border-line bg-paper text-ash hover:border-ash",
            )}
          >
            {l.name}
          </button>
        ))}
      </div>

      <div key={open.id} className="reveal-in rounded-xl border border-accent/30 bg-accentSoft p-3">
        <p className="text-caption text-ink">
          <span className="font-semibold text-accent">{open.name} — </span>
          {STEP_NOTE[open.id]}
        </p>
      </div>
      <p className="text-micro text-ash">
        TerraMetrics IT Operations GmbH used exactly this staged pattern rather than chasing perfect data first.
      </p>
    </div>
  );
}

// ---------------------------------------------------------------------------
// D3 — The five-factor pentagon
// ---------------------------------------------------------------------------

const PENTAGON_LABELS = ["Accuracy", "Effort", "Comparability", "External", "Usability"];

type Profile = Record<string, number>; // 0-5 per label index, as string keys "0".."4"

const PROFILES: Record<string, { label: string; values: number[]; note: string }> = {
  accuracy: {
    label: "Accuracy-first",
    values: [5, 1, 3, 3, 2],
    note: "Pulling hard toward Accuracy pulls Effort down fast — a precise figure that's expensive to keep producing.",
  },
  external: {
    label: "External-first",
    values: [4, 2, 4, 5, 1],
    note: "Optimising for external disclosure often costs Operational usability the most — auditable is not the same as actionable day to day.",
  },
  usability: {
    label: "Usability-first",
    values: [2, 4, 3, 2, 5],
    note: "A figure operations can act on daily usually trades away some Accuracy and External polish.",
  },
};

function pentagonPoint(i: number, value: number, cx: number, cy: number, rMax: number) {
  const angle = -Math.PI / 2 + (i * 2 * Math.PI) / 5;
  const r = (value / 5) * rMax;
  return [cx + r * Math.cos(angle), cy + r * Math.sin(angle)] as const;
}

export function TradeoffPentagon() {
  const [profileId, setProfileId] = useState<string>("accuracy");
  const profile = PROFILES[profileId];
  const cx = 160;
  const cy = 90;
  const rMax = 60;

  const points = profile.values.map((v, i) => pentagonPoint(i, v, cx, cy, rMax));
  const pointsAttr = points.map(([x, y]) => `${x.toFixed(1)},${y.toFixed(1)}`).join(" ");

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {Object.entries(PROFILES).map(([id, p]) => (
          <button
            key={id}
            type="button"
            onClick={() => setProfileId(id)}
            aria-pressed={profileId === id}
            className={clsx(
              "rounded-full border px-3 py-1.5 text-caption font-semibold transition-colors duration-150",
              profileId === id ? "border-accent bg-accentSoft text-accent" : "border-line bg-paper text-ash hover:border-ash",
            )}
          >
            {p.label}
          </button>
        ))}
      </div>

      <svg viewBox="0 0 320 180" preserveAspectRatio="xMidYMid meet" className="mx-auto h-auto w-full max-w-sm" role="img" aria-label={`A five-point pentagon showing the ${profile.label} trade-off.`}>
        {[1, 2, 3, 4, 5].map((ring) => (
          <polygon
            key={ring}
            points={Array.from({ length: 5 }, (_, i) => pentagonPoint(i, ring, cx, cy, rMax)).map(([x, y]) => `${x.toFixed(1)},${y.toFixed(1)}`).join(" ")}
            className="fill-none stroke-line"
            strokeWidth="1"
          />
        ))}
        {PENTAGON_LABELS.map((label, i) => {
          const [x, y] = pentagonPoint(i, 6.1, cx, cy, rMax);
          return (
            <text key={label} x={x} y={y} textAnchor="middle" className="fill-ash text-[10px] font-semibold">
              {label}
            </text>
          );
        })}
        <polygon key={profileId} points={pointsAttr} className="anim-pop fill-accent/15 stroke-accent" strokeWidth="2.2" />
        {points.map(([x, y], i) => (
          <circle key={i} cx={x} cy={y} r="3.4" className="fill-accent" />
        ))}
      </svg>

      <div key={profileId} className="reveal-in rounded-xl border border-accent/30 bg-accentSoft p-3">
        <p className="text-caption text-ink">{profile.note}</p>
      </div>
      <p className="text-micro text-ash">No profile fills the pentagon — pulling one point out always pulls another one in.</p>
    </div>
  );
}

// ---------------------------------------------------------------------------
// D4 — Four role chips
// ---------------------------------------------------------------------------

export function RoleChips() {
  const [openId, setOpenId] = useState<string>("cio");
  const open = ROLES.find((r) => r.id === openId)!;

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-2">
        {ROLES.map((r) => {
          const on = openId === r.id;
          return (
            <button
              key={r.id}
              type="button"
              onClick={() => setOpenId(r.id)}
              aria-pressed={on}
              className={clsx(
                "flex items-center gap-2 rounded-xl border p-3 text-left transition-colors duration-150",
                on ? "border-accent bg-accent text-paper" : "border-line bg-paper text-ink hover:border-ash",
              )}
            >
              <Icon name={r.icon} className="h-5 w-5 shrink-0" />
              <span className="text-caption font-semibold">{r.short}</span>
            </button>
          );
        })}
      </div>

      <div key={open.id} className="reveal-in rounded-xl border border-accent/30 bg-accentSoft p-3">
        <p className="text-caption text-ink">
          <span className="font-semibold text-accent">{open.name} — </span>
          {open.mandate}
        </p>
      </div>
    </div>
  );
}
