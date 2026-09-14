"use client";

import { useState } from "react";
import clsx from "clsx";
import { LEVER_MAP_AXES, NETWORK_LEVERS } from "@/lib/route1";
import { Overlay } from "./Overlay";

/**
 * SVG #3 — The Lever Map: the seven levers positioned by time to effect and
 * control required. The grid is SVG; the nodes are HTML buttons pinned to it,
 * so they stay tappable and legible on a phone. Selecting a node opens its
 * panel: mechanism, precondition, failure mode, and the Signal Board zones the
 * lever typically shows up in.
 *
 * Reused as the "Reference: Lever Map" slide-over inside Part 1.
 */

const VW = 820;
const VH = 520;
const X0 = 60;
const X1 = 800;
const Y0 = 20;
const Y1 = 480;

const nx = (t: number) => X0 + t * (X1 - X0);
const ny = (c: number) => Y1 - c * (Y1 - Y0);

export function LeverMap({ compact = false }: { compact?: boolean }) {
  const [selected, setSelected] = useState<string>(NETWORK_LEVERS[0].id);
  const active = NETWORK_LEVERS.find((l) => l.id === selected) ?? NETWORK_LEVERS[0];

  return (
    <div className={clsx("grid gap-4", !compact && "lg:grid-cols-[minmax(0,1fr)_260px]")}>
      <div className="min-w-0">
        <p className="text-micro text-ash">
          <span className="font-semibold text-ink">↑ {LEVER_MAP_AXES.y.label}</span> — from {LEVER_MAP_AXES.y.low.toLowerCase()}{" "}
          (bottom) to {LEVER_MAP_AXES.y.high.toLowerCase()} (top)
        </p>
        <div className="relative mt-2">
          <svg
            viewBox={`0 0 ${VW} ${VH}`}
            preserveAspectRatio="xMidYMid meet"
            role="img"
            aria-label="A two-by-two map: time to effect from immediate to structural, and control required from operational setting to architecture or governance decision."
            className="h-auto w-full"
          >
            <title>The Lever Map</title>
            <rect x={X0} y={Y0} width={X1 - X0} height={Y1 - Y0} rx={14} className="fill-canvas stroke-line" strokeWidth={1.5} />
            <rect x={(X0 + X1) / 2} y={Y0} width={(X1 - X0) / 2} height={(Y1 - Y0) / 2} className="fill-ink/[0.04]" />
            <line x1={(X0 + X1) / 2} y1={Y0} x2={(X0 + X1) / 2} y2={Y1} className="stroke-line" strokeWidth={1.5} strokeDasharray="6 6" />
            <line x1={X0} y1={(Y0 + Y1) / 2} x2={X1} y2={(Y0 + Y1) / 2} className="stroke-line" strokeWidth={1.5} strokeDasharray="6 6" />
            {NETWORK_LEVERS.map((l) =>
              l.id === selected ? (
                <circle key={l.id} cx={nx(l.time)} cy={ny(l.control)} r={34} className="fill-accent/15" />
              ) : null,
            )}
          </svg>

          {/* Quadrant captions */}
          <Overlay x={X0 + 14} y={Y1 - 12} vw={VW} vh={VH} align="start" valign="bottom" className="hidden text-micro uppercase tracking-wide text-ash sm:block">
            Immediate · operational
          </Overlay>
          <Overlay x={X1 - 14} y={Y0 + 12} vw={VW} vh={VH} align="end" valign="top" className="hidden text-micro uppercase tracking-wide text-ash sm:block">
            Structural · governance
          </Overlay>

          {/* Nodes */}
          {NETWORK_LEVERS.map((l) => {
            const on = l.id === selected;
            const left = l.time > 0.62;
            return (
              <span key={l.id}>
                <button
                  type="button"
                  onClick={() => setSelected(l.id)}
                  aria-pressed={on}
                  aria-label={`${l.n}. ${l.label}`}
                  className={clsx(
                    "absolute flex h-7 w-7 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-2 text-caption font-bold transition-colors duration-150 sm:h-9 sm:w-9",
                    on ? "border-accent bg-accent text-paper shadow-md" : "border-ink/60 bg-paper text-ink hover:border-accent",
                  )}
                  style={{ left: `${(nx(l.time) / VW) * 100}%`, top: `${(ny(l.control) / VH) * 100}%` }}
                >
                  {l.n}
                </button>
                <Overlay
                  x={nx(l.time) + (left ? -30 : 30)}
                  y={ny(l.control)}
                  vw={VW}
                  vh={VH}
                  align={left ? "end" : "start"}
                  className={clsx(
                    "hidden rounded bg-paper/90 px-1 text-micro leading-tight sm:block",
                    on ? "font-semibold text-accent" : "text-ink",
                  )}
                >
                  <span className="block">{l.lines[0]}</span>
                  <span className="block">{l.lines[1]}</span>
                </Overlay>
              </span>
            );
          })}
        </div>
        <p className="mt-1 text-right text-micro text-ash">
          <span className="font-semibold text-ink">{LEVER_MAP_AXES.x.label} →</span> from {LEVER_MAP_AXES.x.low.toLowerCase()} (left) to{" "}
          {LEVER_MAP_AXES.x.high.toLowerCase()} (right)
        </p>

        {/* The same seven, as a list — readable on any screen */}
        <ol className="mt-3 flex flex-wrap gap-1.5">
          {NETWORK_LEVERS.map((l) => (
            <li key={l.id}>
              <button
                type="button"
                onClick={() => setSelected(l.id)}
                aria-pressed={l.id === selected}
                className={clsx(
                  "rounded-full border px-2.5 py-1 text-micro font-semibold transition-colors duration-150",
                  l.id === selected ? "border-accent bg-accent text-paper" : "border-line bg-paper text-ash hover:border-accent hover:text-accent",
                )}
              >
                {l.n} · {l.label}
              </button>
            </li>
          ))}
        </ol>
      </div>

      <aside aria-live="polite" className="h-fit rounded-xl border border-accent/35 bg-accentSoft p-4">
        <div key={active.id} className="reveal-in space-y-2">
          <p className="text-micro font-semibold uppercase tracking-wide text-accent">Lever {active.n}</p>
          <p className="text-caption font-semibold text-ink">{active.label}</p>
          <p className="text-caption text-ink">
            <span className="font-semibold">Mechanism. </span>
            {active.mechanism}
          </p>
          <p className="text-caption text-ash">
            <span className="font-semibold text-ink">Precondition. </span>
            {active.precondition}
          </p>
          <p className="text-caption text-ash">
            <span className="font-semibold text-ink">Failure mode. </span>
            {active.failure}
          </p>
          <p className="flex flex-wrap items-center gap-1.5 pt-1">
            <span className="text-micro uppercase tracking-wide text-ash">Typically on the board as:</span>
            {active.zones.map((z) => (
              <span key={z} className="rounded-full border border-accent/40 bg-paper px-2 py-0.5 text-micro font-semibold text-accent">
                {z}
              </span>
            ))}
          </p>
        </div>
      </aside>
    </div>
  );
}
