"use client";

import { useState } from "react";
import clsx from "clsx";
import { Overlay } from "./Overlay";

/**
 * SVG #4 — The measurement boundary. One mobile network: terminals (greyed,
 * out of scope under ETSI ES 203 228), an urban and a rural site, backhaul,
 * a radio controller, site infrastructure and the core. The dashed boundary
 * moves with the boundary type, to show that the same physical network yields
 * different efficiency figures under different perimeters.
 */

const VW = 640;
const VH = 300;

type Mode = "topological" | "geographic" | "demographic";

const MODES: { id: Mode; label: string; boundary: { x: number; y: number; w: number; h: number }; text: string }[] = [
  {
    id: "topological",
    label: "Topological",
    boundary: { x: 118, y: 36, w: 382, h: 232 },
    text: "The whole radio access part: base stations, backhaul, radio controllers and site infrastructure. Terminals and the core sit outside.",
  },
  {
    id: "geographic",
    label: "Geographic",
    boundary: { x: 118, y: 36, w: 382, h: 110 },
    text: "One city. The same equipment types, but only the sites inside the city limit count — a different mix of traffic, a different ratio.",
  },
  {
    id: "demographic",
    label: "Demographic",
    boundary: { x: 118, y: 156, w: 382, h: 112 },
    text: "Rural sites only. Rural sites typically serve coverage rather than dense traffic, so the useful output and the ratio change again.",
  },
];

export function MeasurementBoundary() {
  const [mode, setMode] = useState<Mode>("topological");
  const active = MODES.find((m) => m.id === mode)!;
  const b = active.boundary;

  return (
    <div className="space-y-3">
      <p className="text-micro font-semibold uppercase tracking-wide text-ash">The measurement boundary</p>
      <div className="flex flex-wrap gap-1.5" role="group" aria-label="Boundary type">
        {MODES.map((m) => (
          <button
            key={m.id}
            type="button"
            onClick={() => setMode(m.id)}
            aria-pressed={mode === m.id}
            className={clsx(
              "rounded-full border px-3 py-1 text-micro font-semibold transition-colors duration-150",
              mode === m.id ? "border-accent bg-accent text-paper" : "border-line bg-paper text-ash hover:border-accent hover:text-accent",
            )}
          >
            {m.label}
          </button>
        ))}
      </div>

      <div className="relative">
        <svg
          viewBox={`0 0 ${VW} ${VH}`}
          preserveAspectRatio="xMidYMid meet"
          role="img"
          aria-label={`A mobile network with a dashed ${active.label.toLowerCase()} measurement boundary. Terminals are out of scope.`}
          className="h-auto w-full"
        >
          <title>Measurement boundary</title>

          {/* Terminals — out of scope */}
          {[70, 150, 230].map((y) => (
            <rect key={y} x={34} y={y - 22} width={28} height={44} rx={6} className="fill-mist stroke-ash/40" strokeWidth={1.5} strokeDasharray="3 3" />
          ))}
          <line x1={64} y1={90} x2={170} y2={92} className="stroke-ash/40" strokeWidth={1.2} strokeDasharray="3 4" />
          <line x1={64} y1={210} x2={170} y2={212} className="stroke-ash/40" strokeWidth={1.2} strokeDasharray="3 4" />

          {/* Sites */}
          {[
            { y: 92, label: "urban" },
            { y: 212, label: "rural" },
          ].map((s) => (
            <g key={s.label}>
              <path d={`M170 ${s.y + 34} L186 ${s.y - 30} L202 ${s.y + 34} Z`} className="fill-paper stroke-ink" strokeWidth={2} strokeLinejoin="round" />
              <circle cx={186} cy={s.y - 34} r={5} className="fill-ink" />
              <line x1={202} y1={s.y} x2={300} y2={150} className="stroke-ink/70" strokeWidth={2} />
            </g>
          ))}

          {/* Radio controller + site infrastructure */}
          <rect x={300} y={124} width={86} height={52} rx={10} className="fill-paper stroke-ink" strokeWidth={2} />
          <rect x={404} y={124} width={86} height={52} rx={10} className="fill-paper stroke-ink" strokeWidth={2} />
          <line x1={386} y1={150} x2={404} y2={150} className="stroke-ink/70" strokeWidth={2} />

          {/* Core — outside the RAN */}
          <line x1={490} y1={150} x2={540} y2={150} className="stroke-ash/50" strokeWidth={2} strokeDasharray="4 4" />
          <rect x={540} y={118} width={74} height={64} rx={12} className="fill-mist stroke-ash/50" strokeWidth={1.5} />

          {/* The boundary */}
          <rect
            x={b.x}
            y={b.y}
            width={b.w}
            height={b.h}
            rx={18}
            className="fill-accent/[0.06] stroke-accent"
            strokeWidth={2.4}
            strokeDasharray="9 6"
            style={{ transition: "all 400ms ease-out" }}
          />
        </svg>

        <Overlay x={48} y={276} vw={VW} vh={VH} className="text-micro text-ash">
          Terminals · out of scope
        </Overlay>
        <Overlay x={214} y={70} vw={VW} vh={VH} align="start" className="text-micro text-ink">
          Urban site
        </Overlay>
        <Overlay x={214} y={232} vw={VW} vh={VH} align="start" className="text-micro text-ink">
          Rural site
        </Overlay>
        <Overlay x={343} y={150} vw={VW} vh={VH} className="text-micro font-semibold text-ink">
          Controller
        </Overlay>
        <Overlay x={447} y={150} vw={VW} vh={VH} className="text-micro font-semibold text-ink">
          Site infra
        </Overlay>
        <Overlay x={577} y={150} vw={VW} vh={VH} className="text-micro text-ash">
          Core
        </Overlay>
      </div>

      <div className="rounded-xl border border-accent/35 bg-accentSoft p-3" aria-live="polite">
        <p key={mode} className="reveal-in text-caption text-ink">
          <span className="font-semibold">{active.label} boundary. </span>
          {active.text}
        </p>
        <p className="mt-1.5 text-micro text-ash">
          Same physical network, different boundary, different efficiency number — which is why ETSI ES 203 228 makes the
          boundary part of the assessment report.
        </p>
      </div>
    </div>
  );
}
