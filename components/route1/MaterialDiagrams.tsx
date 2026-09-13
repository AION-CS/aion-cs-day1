"use client";

import { useEffect, useRef, useState } from "react";
import clsx from "clsx";
import {
  LEVERS,
  LOAD_BANDS,
  OBSERVATION_CHANNELS,
  POSTURES,
  TRADEOFF_AXES,
  TRADEOFF_PAIRS,
  TRADEOFF_PROFILES,
  type LoadBandId,
} from "@/lib/route1";
import { RadarChart } from "@/components/ui/RadarChart";

/**
 * The five material diagrams. Inline SVG and CSS only (CLAUDE.md #9): no chart
 * library, no animation library, no drag library.
 *
 * Two rules every diagram here follows. Text lives in the surrounding HTML
 * wherever it can, because SVG text scales down with the viewBox and stops
 * being legible on a 380 px screen — the SVG carries structure, the panel
 * beneath it carries the sentence. And every hover affordance is also a tap
 * affordance, since the diagrams are the teaching artifact on a phone too.
 */

// ---------------------------------------------------------------------------
// S1 — the eight observation channels
// ---------------------------------------------------------------------------

const SHORT_LABELS: Record<string, string> = {
  cpu: "CPU",
  memory: "Memory",
  io: "I/O",
  network: "Network",
  db: "Database",
  background: "Background",
  scaling: "Scaling",
  idle: "Idle",
};

const CX = 280;
const CY = 190;
const RX = 150;
const RY = 112;

function channelPoint(i: number) {
  const a = -Math.PI / 2 + (i * 2 * Math.PI) / 8;
  return { x: CX + RX * Math.cos(a), y: CY + RY * Math.sin(a), cos: Math.cos(a) };
}

export function ObservationWheel() {
  const [selected, setSelected] = useState<string | null>(null);
  const active = OBSERVATION_CHANNELS.find((c) => c.id === selected) ?? null;

  return (
    <div className="space-y-4">
      <svg
        viewBox="0 0 560 400"
        preserveAspectRatio="xMidYMid meet"
        role="img"
        aria-label="Eight observation channels radiating from one running system"
        className="h-auto w-full"
      >
        <title>Eight observation channels</title>

        {/* Spokes */}
        {OBSERVATION_CHANNELS.map((c, i) => {
          const p = channelPoint(i);
          const on = selected === c.id;
          return (
            <line
              key={`line-${c.id}`}
              x1={CX}
              y1={CY}
              x2={p.x}
              y2={p.y}
              className={on ? "stroke-accent" : "stroke-line"}
              strokeWidth={on ? 2.4 : 1.4}
              strokeDasharray={on ? "7 5" : undefined}
            />
          );
        })}

        {/* The system under observation */}
        <rect
          x={CX - 78}
          y={CY - 30}
          width={156}
          height={60}
          rx={14}
          className="fill-ink"
        />
        <text x={CX} y={CY - 6} textAnchor="middle" className="fill-paper" style={{ fontSize: 15, fontWeight: 600 }}>
          One running
        </text>
        <text x={CX} y={CY + 14} textAnchor="middle" className="fill-paper" style={{ fontSize: 15, fontWeight: 600 }}>
          system
        </text>

        {/* Channels */}
        {OBSERVATION_CHANNELS.map((c, i) => {
          const p = channelPoint(i);
          const on = selected === c.id;
          const dim = selected !== null && !on;
          const anchor = p.cos > 0.2 ? "start" : p.cos < -0.2 ? "end" : "middle";
          const tx = p.cos > 0.2 ? p.x + 22 : p.cos < -0.2 ? p.x - 22 : p.x;
          const ty = anchor === "middle" ? (p.y < CY ? p.y - 24 : p.y + 30) : p.y + 5;

          return (
            <g
              key={c.id}
              role="button"
              tabIndex={0}
              aria-pressed={on}
              onClick={() => setSelected(on ? null : c.id)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  setSelected(on ? null : c.id);
                }
              }}
              onMouseEnter={() => setSelected(c.id)}
              className="cursor-pointer"
              style={{ opacity: dim ? 0.45 : 1, transition: "opacity 200ms" }}
            >
              <circle
                cx={p.x}
                cy={p.y}
                r={15}
                className={on ? "fill-accent stroke-accent" : "fill-paper stroke-line"}
                strokeWidth={2}
              />
              <text
                x={p.x}
                y={p.y + 5}
                textAnchor="middle"
                className={on ? "fill-paper" : "fill-ash"}
                style={{ fontSize: 13, fontWeight: 700 }}
              >
                {i + 1}
              </text>
              <text
                x={tx}
                y={ty}
                textAnchor={anchor}
                className={on ? "fill-ink" : "fill-ash"}
                style={{ fontSize: 14, fontWeight: on ? 700 : 500 }}
              >
                {SHORT_LABELS[c.id]}
              </text>
            </g>
          );
        })}
      </svg>

      <div
        className={clsx(
          "rounded-xl border p-4 transition-colors duration-200",
          active ? "border-accent/35 bg-accentSoft" : "border-dashed border-line bg-canvas",
        )}
      >
        {active ? (
          <div className="reveal-in">
            <p className="text-caption font-semibold text-ink">{active.label}</p>
            <p className="mt-1 text-caption text-ink">
              <span className="font-semibold text-accent">What you look for. </span>
              {active.lens}
            </p>
            <p className="mt-1.5 text-caption text-ash">
              <span className="font-semibold text-ink">Problematic pattern. </span>
              {active.problem}
            </p>
          </div>
        ) : (
          <p className="text-caption text-ash">
            Tap a channel to see what you actually look for there once the question is efficiency
            rather than uptime — and what a problematic pattern looks like.
          </p>
        )}
      </div>
    </div>
  );
}

/** S1's second visual — the two postures over the same telemetry. */
export function PostureCompare() {
  const cards = [
    { ...POSTURES.classic, tone: "plain" as const },
    { ...POSTURES.efficiency, tone: "accent" as const },
  ];
  return (
    <div className="grid gap-3 md:grid-cols-2">
      {cards.map((c) => (
        <div
          key={c.title}
          className={clsx(
            "rounded-2xl border p-4",
            c.tone === "accent" ? "border-accent/35 bg-accentSoft" : "border-line bg-mist",
          )}
        >
          <p
            className={clsx(
              "text-micro font-semibold uppercase tracking-wide",
              c.tone === "accent" ? "text-accent" : "text-ash",
            )}
          >
            {c.title}
          </p>
          <p className="mt-1 text-caption font-semibold italic text-ink">&ldquo;{c.question}&rdquo;</p>
          <dl className="mt-3 space-y-1.5">
            {c.rows.map((r) => (
              <div key={r.label} className="flex gap-2 text-micro">
                <dt className="w-24 shrink-0 uppercase tracking-wide text-ash">{r.label}</dt>
                <dd className="min-w-0 flex-1 text-ink">{r.text}</dd>
              </div>
            ))}
          </dl>
        </div>
      ))}
    </div>
  );
}

// ---------------------------------------------------------------------------
// S2 — the load curve and its four bands
// ---------------------------------------------------------------------------

const BAND_STROKE: Record<LoadBandId, string> = {
  necessary: "stroke-accent",
  unnecessary: "stroke-warn",
  designed: "stroke-danger",
  permanent: "stroke-ink",
};
const BAND_FILL: Record<LoadBandId, string> = {
  necessary: "fill-accent/20",
  unnecessary: "fill-warn/25",
  designed: "fill-danger/20",
  permanent: "fill-ink/15",
};
const BAND_DOT: Record<LoadBandId, string> = {
  necessary: "bg-accent",
  unnecessary: "bg-warn",
  designed: "bg-danger",
  permanent: "bg-ink",
};

/** x for an hour on the 0–24 axis. */
const hx = (h: number) => 60 + (h / 24) * 520;
/** y for a load value 0–100. */
const hy = (v: number) => 210 - (v / 100) * 150;

const CURVE = [
  [0, 34],
  [2, 52],
  [4, 50],
  [6, 40],
  [8, 62],
  [10, 84],
  [12, 70],
  [14, 88],
  [16, 72],
  [18, 62],
  [20, 92],
  [22, 58],
  [24, 36],
] as const;

function curvePath() {
  return CURVE.map(([h, v], i) => `${i === 0 ? "M" : "L"}${hx(h).toFixed(1)},${hy(v).toFixed(1)}`).join(" ");
}

export function LoadCurve() {
  const [band, setBand] = useState<LoadBandId | null>(null);
  const activeBand = LOAD_BANDS.find((b) => b.id === band) ?? null;

  return (
    <div className="space-y-4">
      <svg
        viewBox="0 0 620 280"
        preserveAspectRatio="xMidYMid meet"
        role="img"
        aria-label="A 24-hour load curve with four bands"
        className="h-auto w-full"
      >
        <title>24-hour load curve</title>

        {/* Axes */}
        <line x1={60} y1={210} x2={590} y2={210} className="stroke-line" strokeWidth={1.5} />
        <line x1={60} y1={40} x2={60} y2={210} className="stroke-line" strokeWidth={1.5} />
        {[0, 6, 12, 18, 24].map((h) => (
          <g key={h}>
            <line x1={hx(h)} y1={210} x2={hx(h)} y2={216} className="stroke-line" strokeWidth={1.5} />
            <text x={hx(h)} y={232} textAnchor="middle" className="fill-ash" style={{ fontSize: 13 }}>
              {String(h).padStart(2, "0")}:00
            </text>
          </g>
        ))}
        <text x={60} y={30} className="fill-ash" style={{ fontSize: 13 }}>
          Load
        </text>

        {/* Permanently inefficient: the floor that never drops */}
        <rect
          x={60}
          y={hy(34)}
          width={530}
          height={210 - hy(34)}
          className={clsx(BAND_FILL.permanent, band === "permanent" ? "opacity-100" : "opacity-40")}
          style={{ transition: "opacity 250ms" }}
        />
        <line
          x1={60}
          y1={hy(34)}
          x2={590}
          y2={hy(34)}
          className={clsx(BAND_STROKE.permanent, band === "permanent" ? "opacity-100" : "opacity-45")}
          strokeWidth={band === "permanent" ? 2.4 : 1.4}
          strokeDasharray="5 4"
          style={{ transition: "opacity 250ms" }}
        />

        {/* Unnecessary: the nightly job block */}
        <rect
          x={hx(2)}
          y={hy(52)}
          width={hx(4) - hx(2)}
          height={hy(34) - hy(52)}
          rx={3}
          className={clsx(BAND_FILL.unnecessary, band === "unnecessary" ? "opacity-100" : "opacity-0")}
          style={{ transition: "opacity 250ms" }}
        />

        {/* Poorly designed: the inflated daytime shoulder */}
        <rect
          x={hx(8)}
          y={hy(88)}
          width={hx(18) - hx(8)}
          height={hy(34) - hy(88)}
          rx={3}
          className={clsx(BAND_FILL.designed, band === "designed" ? "opacity-100" : "opacity-0")}
          style={{ transition: "opacity 250ms" }}
        />

        {/* Necessary: the evening demand peak */}
        <rect
          x={hx(19)}
          y={hy(92)}
          width={hx(22) - hx(19)}
          height={hy(34) - hy(92)}
          rx={3}
          className={clsx(BAND_FILL.necessary, band === "necessary" ? "opacity-100" : "opacity-0")}
          style={{ transition: "opacity 250ms" }}
        />

        {/* The curve itself */}
        <path
          d={curvePath()}
          className="anim-draw fill-none stroke-ink"
          strokeWidth={2.6}
          strokeLinejoin="round"
          strokeLinecap="round"
        />

        {/* Floor annotation */}
        <text x={72} y={hy(34) - 8} className="fill-ash" style={{ fontSize: 12.5 }}>
          the floor never drops to zero
        </text>
      </svg>

      <ul className="grid gap-2 sm:grid-cols-2">
        {LOAD_BANDS.map((b) => {
          const on = band === b.id;
          return (
            <li key={b.id}>
              <button
                type="button"
                onClick={() => setBand(on ? null : b.id)}
                aria-pressed={on}
                className={clsx(
                  "h-full w-full rounded-xl border p-3 text-left transition-colors duration-150",
                  on ? "border-accent bg-accentSoft" : "border-line bg-canvas hover:border-ash",
                )}
              >
                <span className="flex items-center gap-2">
                  <span className={clsx("h-2.5 w-2.5 shrink-0 rounded-full", BAND_DOT[b.id])} />
                  <span className="text-caption font-semibold text-ink">{b.label}</span>
                </span>
                <span className="mt-1 block text-micro text-ash">{b.meaning}</span>
                <span className="mt-1.5 block text-micro font-semibold text-accent">{b.verdict}</span>
              </button>
            </li>
          );
        })}
      </ul>

      <div
        className={clsx(
          "rounded-xl border p-4 transition-colors duration-200",
          activeBand ? "border-accent/35 bg-accentSoft" : "border-dashed border-line bg-canvas",
        )}
      >
        {activeBand ? (
          <p className="reveal-in text-caption text-ink">
            <span className="font-semibold">{activeBand.label} — </span>
            {activeBand.example}
          </p>
        ) : (
          <p className="text-caption text-ash">
            Tap a band to highlight where it lives on the curve and read one industry example of it.
          </p>
        )}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// S3 — grown versus designed, plus the four levers
// ---------------------------------------------------------------------------

/** Fires once, when the element first scrolls into view. */
function useInView<T extends Element>() {
  const ref = useRef<T | null>(null);
  const [seen, setSeen] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el || seen) return;
    if (typeof IntersectionObserver === "undefined") {
      setSeen(true);
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) setSeen(true);
      },
      { threshold: 0.35 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [seen]);
  return { ref, seen };
}

const GROWN_NODES = [
  { x: 60, y: 60, w: 84, h: 34, label: "Orders" },
  { x: 190, y: 44, w: 84, h: 34, label: "Billing" },
  { x: 316, y: 66, w: 84, h: 34, label: "Profile" },
  { x: 122, y: 122, w: 84, h: 34, label: "Sync A" },
  { x: 252, y: 128, w: 84, h: 34, label: "Sync B" },
  { x: 372, y: 134, w: 84, h: 34, label: "Export" },
];

const GROWN_STORES = [
  { x: 96, y: 196, label: "DB 1" },
  { x: 236, y: 196, label: "Shared DB" },
  { x: 376, y: 196, label: "DB 2" },
];

const DESIGNED_MODULES = [
  { x: 60, y: 54, w: 150, h: 46, label: "Orders module", store: "Orders store" },
  { x: 300, y: 54, w: 150, h: 46, label: "Customer module", store: "Customer store" },
  { x: 60, y: 150, w: 150, h: 46, label: "Billing module", store: "Billing store" },
  { x: 300, y: 150, w: 150, h: 46, label: "Reporting read model", store: "Read model" },
];

export function ArchitectureShift() {
  const { ref, seen } = useInView<HTMLDivElement>();
  const [mode, setMode] = useState<"grown" | "designed">("grown");
  const auto = useRef(false);

  useEffect(() => {
    if (seen && !auto.current) {
      auto.current = true;
      const t = window.setTimeout(() => setMode("designed"), 900);
      return () => window.clearTimeout(t);
    }
  }, [seen]);

  const grown = mode === "grown";

  return (
    <div ref={ref} className="space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-micro font-semibold uppercase tracking-wide text-ash">
          {grown ? "Grown — every decision locally reasonable" : "Designed — the same capabilities, held to a shape"}
        </p>
        <div className="flex rounded-full border border-line p-0.5">
          {(["grown", "designed"] as const).map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => setMode(m)}
              aria-pressed={mode === m}
              className={clsx(
                "rounded-full px-3 py-1 text-micro font-semibold capitalize transition-colors duration-150",
                mode === m ? "bg-ink text-paper" : "text-ash hover:text-ink",
              )}
            >
              {m}
            </button>
          ))}
        </div>
      </div>

      <div className="relative">
        <svg
          viewBox="0 0 520 260"
          preserveAspectRatio="xMidYMid meet"
          role="img"
          aria-label={grown ? "A grown architecture with crossing dependencies" : "A designed architecture with bounded modules"}
          className="h-auto w-full"
        >
          <title>{grown ? "Grown architecture" : "Designed architecture"}</title>

          {/* Grown */}
          <g style={{ opacity: grown ? 1 : 0, transition: "opacity 450ms ease" }}>
            {GROWN_NODES.map((n, i) =>
              GROWN_STORES.map((s, j) =>
                (i + j) % 2 === 0 ? (
                  <line
                    key={`g-${i}-${j}`}
                    x1={n.x + n.w / 2}
                    y1={n.y + n.h}
                    x2={s.x + 36}
                    y2={s.y}
                    className="stroke-danger/45"
                    strokeWidth={1.3}
                  />
                ) : null,
              ),
            )}
            {GROWN_NODES.map((n, i) =>
              i < GROWN_NODES.length - 1 ? (
                <line
                  key={`gg-${i}`}
                  x1={n.x + n.w / 2}
                  y1={n.y + n.h / 2}
                  x2={GROWN_NODES[(i + 2) % GROWN_NODES.length].x + 42}
                  y2={GROWN_NODES[(i + 2) % GROWN_NODES.length].y + 17}
                  className="stroke-ash/50"
                  strokeWidth={1.2}
                />
              ) : null,
            )}
            {GROWN_NODES.map((n) => (
              <g key={n.label}>
                <rect x={n.x} y={n.y} width={n.w} height={n.h} rx={8} className="fill-paper stroke-line" strokeWidth={1.5} />
                <text x={n.x + n.w / 2} y={n.y + 22} textAnchor="middle" className="fill-ink" style={{ fontSize: 13 }}>
                  {n.label}
                </text>
              </g>
            ))}
            {GROWN_STORES.map((s) => (
              <g key={s.label}>
                <rect x={s.x} y={s.y} width={72} height={34} rx={16} className="fill-mist stroke-line" strokeWidth={1.5} />
                <text x={s.x + 36} y={s.y + 22} textAnchor="middle" className="fill-ash" style={{ fontSize: 12.5 }}>
                  {s.label}
                </text>
              </g>
            ))}
          </g>

          {/* Designed */}
          <g style={{ opacity: grown ? 0 : 1, transition: "opacity 450ms ease" }}>
            {DESIGNED_MODULES.map((m, i) => (
              <g key={m.label}>
                <rect
                  x={m.x}
                  y={m.y}
                  width={m.w}
                  height={m.h}
                  rx={10}
                  className="fill-paper stroke-accent"
                  strokeWidth={1.8}
                />
                <text x={m.x + m.w / 2} y={m.y + 28} textAnchor="middle" className="fill-ink" style={{ fontSize: 13.5, fontWeight: 600 }}>
                  {m.label}
                </text>
                <rect
                  x={m.x + 30}
                  y={m.y + m.h + 16}
                  width={90}
                  height={28}
                  rx={13}
                  className="fill-accentSoft stroke-accent/50"
                  strokeWidth={1.4}
                />
                <text x={m.x + 75} y={m.y + m.h + 35} textAnchor="middle" className="fill-accent" style={{ fontSize: 11.5 }}>
                  {m.store}
                </text>
                <line
                  x1={m.x + m.w / 2}
                  y1={m.y + m.h}
                  x2={m.x + 75}
                  y2={m.y + m.h + 16}
                  className="stroke-accent/60"
                  strokeWidth={1.4}
                />
                {i === 1 && (
                  <line
                    x1={m.x}
                    y1={m.y + m.h / 2}
                    x2={DESIGNED_MODULES[0].x + DESIGNED_MODULES[0].w}
                    y2={DESIGNED_MODULES[0].y + DESIGNED_MODULES[0].h / 2}
                    className="stroke-accent/50"
                    strokeWidth={1.4}
                    strokeDasharray="5 4"
                  />
                )}
              </g>
            ))}
          </g>
        </svg>
      </div>

      <p className="text-micro text-ash">
        {grown
          ? "Six services, three stores, every path defensible on the day it was added — and more than one route to the same record."
          : "The same capability set: bounded modules, one owner per store, one canonical path. Same features, different operating cost and different cost of change."}
      </p>
    </div>
  );
}

export function LeverPills() {
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
            <span className="font-semibold text-ink">Failure mode. </span>
            {active.failureMode}
          </p>
          <p className="text-caption text-ash">
            <span className="font-semibold text-ink">Example. </span>
            {active.example}
          </p>
          <p className="flex flex-wrap items-center gap-1.5 pt-1">
            <span className="text-micro uppercase tracking-wide text-ash">Shows up in:</span>
            {active.channels.map((c) => (
              <span
                key={c}
                className="rounded-full border border-accent/40 bg-paper px-2 py-0.5 text-micro font-semibold text-accent"
              >
                {c}
              </span>
            ))}
          </p>
        </div>
      ) : (
        <p className="rounded-xl border border-dashed border-line bg-canvas p-4 text-caption text-ash">
          Tap a lever to see what it fixes, what it looks like when it is missing, and which observation
          channel proves it moved.
        </p>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// S4 — the five-way trade-off
// ---------------------------------------------------------------------------

export function TradeoffPentagon() {
  const [profileId, setProfileId] = useState<string>(TRADEOFF_PROFILES[0].id);
  const active = TRADEOFF_PROFILES.find((p) => p.id === profileId)!;
  const other = TRADEOFF_PROFILES.find((p) => p.id !== profileId)!;

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {TRADEOFF_PROFILES.map((p) => (
          <button
            key={p.id}
            type="button"
            onClick={() => setProfileId(p.id)}
            aria-pressed={profileId === p.id}
            className={clsx(
              "rounded-full border px-3.5 py-1.5 text-caption font-semibold transition-colors duration-150",
              profileId === p.id
                ? "border-accent bg-accent text-paper"
                : "border-line bg-paper text-ash hover:border-accent hover:text-accent",
            )}
          >
            {p.label}
          </button>
        ))}
      </div>

      <div className="grid items-center gap-4 md:grid-cols-[minmax(0,1fr)_240px]">
        <RadarChart
          title="Five-way trade-off: two example profiles"
          max={10}
          ringCount={4}
          axes={TRADEOFF_AXES.map((a) => ({ key: a.key, label: a.label }))}
          series={[
            { id: other.id, label: other.label, values: { ...other.values }, tone: "ghost" },
            { id: active.id, label: active.label, values: { ...active.values }, tone: "real" },
          ]}
        />
        <div className="rounded-xl border border-line bg-canvas p-4">
          <p className="text-caption font-semibold text-ink">{active.label}</p>
          <p className="mt-1 text-caption text-ash">{active.blurb}</p>
          <p className="mt-3 border-t border-line pt-2 text-micro text-ash">
            The dashed polygon is the other profile. Neither is wrong — improving one axis visibly pulls
            the others in.
          </p>
        </div>
      </div>

      <ul className="space-y-2">
        {TRADEOFF_PAIRS.map((p) => (
          <li key={p.pair} className="rounded-xl border border-line bg-canvas p-3">
            <p className="text-caption font-semibold text-ink">{p.pair}</p>
            <p className="mt-1 text-caption text-ash">{p.text}</p>
          </li>
        ))}
      </ul>

      <div className="rounded-xl border border-warn/40 bg-warn/5 p-3">
        <p className="text-micro font-semibold uppercase tracking-wide text-warn">
          Reading convention you will need in Part 2
        </p>
        <p className="mt-1 text-caption text-ink">
          On the seven-dimension radar in Part 2, <strong>Risk is inverted</strong>: a larger value on
          that axis means more risk, so a bigger polygon is not automatically a better option.
        </p>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// S5 — the intersection
// ---------------------------------------------------------------------------

export function CouplingVenn() {
  return (
    <div className="space-y-3">
      <svg
        viewBox="0 0 560 270"
        preserveAspectRatio="xMidYMid meet"
        role="img"
        aria-label="Monitoring and architecture overlapping; the intersection is where decisions get made"
        className="h-auto w-full"
      >
        <title>Monitoring ∩ Architecture</title>

        <circle cx={220} cy={130} r={104} className="fill-ink/5 stroke-ink/40" strokeWidth={1.6} />
        <circle cx={340} cy={130} r={104} className="fill-accent/10 stroke-accent" strokeWidth={1.8} />

        <text x={148} y={126} textAnchor="middle" className="fill-ink" style={{ fontSize: 16, fontWeight: 700 }}>
          Monitoring
        </text>
        <text x={148} y={148} textAnchor="middle" className="fill-ash" style={{ fontSize: 12.5 }}>
          evidence
        </text>

        <text x={412} y={126} textAnchor="middle" className="fill-accent" style={{ fontSize: 16, fontWeight: 700 }}>
          Architecture
        </text>
        <text x={412} y={148} textAnchor="middle" className="fill-ash" style={{ fontSize: 12.5 }}>
          direction
        </text>

        <text x={280} y={120} textAnchor="middle" className="fill-ink" style={{ fontSize: 13, fontWeight: 700 }}>
          Where decisions
        </text>
        <text x={280} y={138} textAnchor="middle" className="fill-ink" style={{ fontSize: 13, fontWeight: 700 }}>
          actually get made
        </text>

        <line x1={110} y1={232} x2={186} y2={206} className="stroke-line" strokeWidth={1.4} />
        <text x={104} y={246} textAnchor="start" className="fill-ash" style={{ fontSize: 12.5, fontStyle: "italic" }}>
          alone: waste watched in high resolution
        </text>
        <line x1={450} y1={232} x2={374} y2={206} className="stroke-line" strokeWidth={1.4} />
        <text x={456} y={246} textAnchor="end" className="fill-ash" style={{ fontSize: 12.5, fontStyle: "italic" }}>
          alone: a rebuild you cannot prove worked
        </text>
      </svg>

      <div className="rounded-xl border border-accent/30 bg-accentSoft p-4">
        <p className="text-caption font-semibold text-ink">
          An efficiency finding that does not reach an architecture decision is a ticket. An architecture
          decision that is not measured is a belief.
        </p>
      </div>
    </div>
  );
}
