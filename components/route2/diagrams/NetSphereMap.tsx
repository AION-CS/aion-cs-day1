"use client";

import clsx from "clsx";
import { useProgress } from "@/lib/store";
import { DIMENSIONS, HOTSPOTS, MAP_LABELS, R2, dimensionById, type HotspotId } from "@/lib/route2";
import { Overlay } from "@/components/route1/diagrams/Overlay";

/**
 * SVG #2 — the NetSphere infrastructure map (§7.2). A simple facility
 * schematic — three zones, a network spine, a data/analytics layer — with six
 * numbered hotspots. Clicking one opens the four-field panel below it. Visited
 * hotspots persist as "read" in the store and drive the progress ring; this is
 * a progress indicator only, never a gate (CLAUDE.md #6).
 */

const VW = 960;
const VH = 520;

const ZONES = [
  { id: "production", label: "Production", x: 40, y: 40, w: 260, h: 180 },
  { id: "logistics", label: "Logistics", x: 40, y: 250, w: 260, h: 180 },
  { id: "building", label: "Building management", x: 660, y: 40, w: 260, h: 180 },
] as const;

const SPINE = { x: 330, y: 60, w: 300, h: 360 };
const DATA_LAYER = { x: 660, y: 250, w: 260, h: 180 };

const HOTSPOT_POS: Record<HotspotId, { x: number; y: number }> = {
  h1: { x: 480, y: 130 },
  h2: { x: 170, y: 130 },
  h3: { x: 170, y: 340 },
  h4: { x: 790, y: 340 },
  h5: { x: 480, y: 320 },
  h6: { x: 480, y: 440 },
};

export function NetSphereMap() {
  const readMap = useProgress((s) => s.checks);
  const choose = useProgress((s) => s.choose);
  const openId = useProgress((s) => s.choices[R2.openHotspot]) as HotspotId | undefined;
  const markSeen = useProgress((s) => s.markSeen);

  const readCount = HOTSPOTS.filter((h) => readMap[R2.hotspotRead(h.id)]).length;
  const active = HOTSPOTS.find((h) => h.id === openId) ?? null;

  const open = (id: HotspotId) => {
    choose(R2.openHotspot, openId === id ? "" : id);
    markSeen("r2:hotspots", id);
    useProgress.getState().toggleCheck(R2.hotspotRead(id), true);
  };

  const ringR = 15;
  const ringC = 2 * Math.PI * ringR;
  const ringFrac = readCount / HOTSPOTS.length;

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-micro font-semibold uppercase tracking-wide text-ash">The NetSphere map</p>
        <span className="inline-flex items-center gap-2 text-micro font-semibold text-ink">
          <svg width="36" height="36" viewBox="0 0 36 36" aria-hidden="true">
            <circle cx="18" cy="18" r={ringR} className="fill-none stroke-line" strokeWidth={4} />
            <circle
              cx="18"
              cy="18"
              r={ringR}
              className="fill-none stroke-accent"
              strokeWidth={4}
              strokeDasharray={ringC}
              strokeDashoffset={ringC * (1 - ringFrac)}
              strokeLinecap="round"
              transform="rotate(-90 18 18)"
              style={{ transition: "stroke-dashoffset 300ms ease" }}
            />
          </svg>
          {MAP_LABELS.progress(readCount)}
        </span>
      </div>

      <div className="relative">
        <svg viewBox={`0 0 ${VW} ${VH}`} preserveAspectRatio="xMidYMid meet" role="img" aria-label="NetSphere facility schematic with six clickable hotspots" className="h-auto w-full">
          <title>NetSphere infrastructure map</title>
          {ZONES.map((z) => (
            <rect key={z.id} x={z.x} y={z.y} width={z.w} height={z.h} rx={14} className="fill-canvas stroke-line" strokeWidth={1.5} />
          ))}
          <rect x={SPINE.x} y={SPINE.y} width={SPINE.w} height={SPINE.h} rx={14} className="fill-mist stroke-ink/30" strokeWidth={1.5} strokeDasharray="6 5" />
          <rect x={DATA_LAYER.x} y={DATA_LAYER.y} width={DATA_LAYER.w} height={DATA_LAYER.h} rx={14} className="fill-accentSoft stroke-accent/40" strokeWidth={1.5} />

          {HOTSPOTS.map((h) => {
            const p = HOTSPOT_POS[h.id];
            const on = h.id === openId;
            const read = !!readMap[R2.hotspotRead(h.id)];
            return (
              <g
                key={h.id}
                role="button"
                tabIndex={0}
                aria-pressed={on}
                aria-label={`Hotspot ${h.n}: ${h.text}`}
                className={clsx("cursor-pointer outline-none", !read && "anim-pin-pulse")}
                style={{ transformOrigin: `${p.x}px ${p.y}px` }}
                onClick={() => open(h.id)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    open(h.id);
                  }
                }}
              >
                <circle cx={p.x} cy={p.y} r={19} className={on ? "fill-accent stroke-accentHi" : read ? "fill-ink stroke-ink" : "fill-warn stroke-warn"} strokeWidth={2} />
              </g>
            );
          })}
        </svg>

        {ZONES.map((z) => (
          <Overlay key={z.id} x={z.x + 12} y={z.y + 20} vw={VW} vh={VH} align="start" className="text-micro font-semibold uppercase tracking-wide text-ash">
            {z.label}
          </Overlay>
        ))}
        <Overlay x={SPINE.x + SPINE.w / 2} y={SPINE.y - 12} vw={VW} vh={VH} valign="bottom" className="text-micro font-semibold uppercase tracking-wide text-ash">
          Network spine
        </Overlay>
        <Overlay x={DATA_LAYER.x + 12} y={DATA_LAYER.y + 20} vw={VW} vh={VH} align="start" className="text-micro font-semibold uppercase tracking-wide text-accent">
          Data / analytics layer
        </Overlay>
        {HOTSPOTS.map((h) => {
          const p = HOTSPOT_POS[h.id];
          return (
            <Overlay key={h.id} x={p.x} y={p.y} vw={VW} vh={VH} className="pointer-events-none text-caption font-bold text-paper">
              {h.n}
            </Overlay>
          );
        })}
      </div>

      <div aria-live="polite" className="rounded-xl border border-accent/35 bg-accentSoft p-4">
        {active ? (
          <div key={active.id} className="reveal-in space-y-2">
            <p className="text-caption font-semibold text-ink">
              Hotspot {active.n} · &ldquo;{active.text}&rdquo;
            </p>
            <p className="text-caption text-ink">
              <span className="font-semibold">What is observable. </span>
              {active.observable}
            </p>
            <p className="text-caption text-ink">
              <span className="font-semibold">What it implies over 5 years. </span>
              {active.fiveYearImplication}
            </p>
            <p className="text-caption text-ink">
              <span className="font-semibold">Dimension. </span>
              {dimensionById(active.dimension).label}
            </p>
            <details className="rounded-lg border border-accent/30 bg-paper px-3 py-2">
              <summary className="cursor-pointer text-micro font-semibold text-accent">Concept: {active.concept.term}</summary>
              <p className="mt-1 text-caption text-ink">{active.concept.definition}</p>
            </details>
          </div>
        ) : (
          <p className="text-caption text-ash">{MAP_LABELS.prompt}</p>
        )}
      </div>

      <ul className="grid gap-1.5 text-micro text-ash sm:grid-cols-2">
        {HOTSPOTS.map((h) => (
          <li key={h.id}>
            <button type="button" onClick={() => open(h.id)} className="text-left underline decoration-dotted underline-offset-2 hover:text-ink">
              {h.n}. {h.text}
            </button>
          </li>
        ))}
      </ul>
      <p className="text-micro text-ash">
        Dimension ratings shown in section C are the case author&apos;s analytical judgement, not measured data. Six of six examined is a reading aid, not a requirement — section C below is fully readable regardless.
      </p>
    </div>
  );
}
