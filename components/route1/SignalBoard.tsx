"use client";

import { useId } from "react";
import clsx from "clsx";
import { ZONES, ZONE_FAMILIES, zoneById, type ZoneId } from "@/lib/route1";
import { Overlay, svgId } from "./diagrams/Overlay";
import { useBoardFx } from "./history";
import { matchesFilter, type BoardFilter } from "./SummaryStrip";
import { domId, type SignalState } from "./useRoute1";

/**
 * SVG #8 — the Infrastructure Board. Seven hexagonal zones in two families
 * (technology domains, cross-cutting domains), an intake rail for signals not
 * yet routed, a live count per zone, and — at the moment of routing — a
 * connector drawn from the intake slot to the zone (~600 ms) with the card
 * token landing in a pulse. Nothing is dragged: a token only moves because the
 * learner answered the two diagnostic questions.
 *
 * Two layouts of the same board: a wide one for the desktop column and wider
 * screens, a tall one for phones. Words and numbers are HTML overlays, so they
 * stay legible at either size.
 */

type Layout = {
  vw: number;
  vh: number;
  r: number;
  intake: { x: number; y: number }[];
  intakeLabel: { x: number; y: number };
  hexes: Record<ZoneId, { x: number; y: number }>;
  curve: (from: { x: number; y: number }, to: { x: number; y: number }) => string;
};

const WIDE: Layout = {
  vw: 900,
  vh: 440,
  r: 96,
  intake: Array.from({ length: 6 }, (_, i) => ({ x: 62, y: 96 + i * 58 })),
  intakeLabel: { x: 62, y: 48 },
  hexes: {
    network: { x: 250, y: 128 },
    iot: { x: 420, y: 128 },
    data: { x: 590, y: 128 },
    energy: { x: 760, y: 128 },
    fiveg: { x: 335, y: 276 },
    lifecycle: { x: 505, y: 276 },
    management: { x: 675, y: 276 },
  },
  curve: (a, b) => `M${a.x} ${a.y} C${a.x + (b.x - a.x) * 0.45} ${a.y} ${b.x - (b.x - a.x) * 0.35} ${b.y} ${b.x} ${b.y}`,
};

const TALL: Layout = {
  vw: 520,
  vh: 600,
  r: 84,
  intake: Array.from({ length: 6 }, (_, i) => ({ x: 70 + i * 76, y: 58 })),
  intakeLabel: { x: 260, y: 20 },
  hexes: {
    network: { x: 185, y: 206 },
    iot: { x: 335, y: 206 },
    data: { x: 110, y: 332 },
    energy: { x: 260, y: 332 },
    fiveg: { x: 410, y: 332 },
    lifecycle: { x: 185, y: 458 },
    management: { x: 335, y: 458 },
  },
  curve: (a, b) => `M${a.x} ${a.y} C${a.x} ${a.y + 70} ${b.x} ${b.y - 90} ${b.x} ${b.y}`,
};

function hexPath(x: number, y: number, r: number) {
  return (
    Array.from({ length: 6 }, (_, i) => {
      const a = (Math.PI / 180) * (60 * i - 90);
      return `${i === 0 ? "M" : "L"}${(x + r * Math.cos(a)).toFixed(1)} ${(y + r * Math.sin(a)).toFixed(1)}`;
    }).join(" ") + " Z"
  );
}

export function SignalBoard({
  signals,
  zoneCounts,
  filter,
}: {
  signals: SignalState[];
  zoneCounts: Record<ZoneId, number>;
  filter: BoardFilter;
}) {
  const routed = signals.filter((s) => s.routed).length;
  const summary = ZONES.map((z) => `${z.name} ${zoneCounts[z.id]}`).join(", ");

  return (
    <div id={domId.board} className="scroll-mt-24 space-y-3 rounded-2xl border border-line bg-paper p-4">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <p className="text-micro font-semibold uppercase tracking-wide text-accent">The Signal Board</p>
        <p className="text-micro text-ash">
          {routed} of {signals.length} routed
        </p>
      </div>
      <p className="sr-only">Signal Board: {summary}. {signals.length - routed} signals in intake.</p>
      <div className="hidden sm:block">
        <Board layout={WIDE} signals={signals} zoneCounts={zoneCounts} filter={filter} />
      </div>
      <div className="sm:hidden">
        <Board layout={TALL} signals={signals} zoneCounts={zoneCounts} filter={filter} />
      </div>

      <div className="flex flex-col gap-1.5 border-t border-line pt-3 text-micro text-ash">
        {(["technology", "crosscutting"] as const).map((family) => (
          <span key={family} className="inline-flex items-start gap-2">
            <svg width="18" height="20" viewBox="0 0 18 20" aria-hidden="true" className="mt-0.5 shrink-0">
              <path
                d={hexPath(9, 10, 8.5)}
                className={family === "technology" ? "fill-paper stroke-ink/50" : "fill-mist stroke-ink/70"}
                strokeWidth={1.4}
                strokeDasharray={family === "crosscutting" ? "3 2" : undefined}
              />
            </svg>
            <span>
              <span className="font-semibold text-ink">{ZONE_FAMILIES[family].label}</span> — {ZONE_FAMILIES[family].note}
            </span>
          </span>
        ))}
        <span className="inline-flex items-center gap-2">
          <span className="flex h-4 w-4 items-center justify-center rounded-full border border-dashed border-ash" aria-hidden="true" />
          Intake — signals not yet routed
        </span>
      </div>
    </div>
  );
}

function Board({
  layout,
  signals,
  zoneCounts,
  filter,
}: {
  layout: Layout;
  signals: SignalState[];
  zoneCounts: Record<ZoneId, number>;
  filter: BoardFilter;
}) {
  const fx = useBoardFx((s) => s.last);
  const hatch = svgId(useId(), "board-hatch");
  const { vw, vh, r } = layout;

  const lastSignal = fx ? signals.find((s) => s.signal.id === fx.signalId && s.routed && s.zone === fx.zone) : undefined;

  return (
    <div className="relative">
      <svg
        viewBox={`0 0 ${vw} ${vh}`}
        preserveAspectRatio="xMidYMid meet"
        role="img"
        aria-label="Signal Board with seven zones and an intake"
        className="h-auto w-full"
      >
        <title>Infrastructure Board</title>
        <defs>
          <pattern id={hatch} width="10" height="10" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
            <rect width="10" height="10" className="fill-mist" />
            <line x1="0" y1="0" x2="0" y2="10" className="stroke-ink/10" strokeWidth="3" />
          </pattern>
        </defs>

        {/* Intake slots */}
        {layout.intake.map((p, i) => (
          <circle key={i} cx={p.x} cy={p.y} r={17} className="fill-canvas stroke-line" strokeWidth={1.5} strokeDasharray="4 3" />
        ))}

        {/* Zones */}
        {ZONES.map((z) => {
          const c = layout.hexes[z.id];
          const cross = z.family === "crosscutting";
          const used = zoneCounts[z.id] > 0;
          const highlight = filter === "zones" && used;
          const faded = filter === "zones" && !used;
          return (
            <path
              key={z.id}
              d={hexPath(c.x, c.y, r - 3)}
              fill={cross ? `url(#${hatch})` : undefined}
              className={clsx(
                !cross && "fill-paper",
                highlight ? "stroke-accent" : cross ? "stroke-ink/60" : "stroke-ink/35",
                faded && "opacity-40",
              )}
              strokeWidth={highlight ? 4 : 2}
              strokeDasharray={cross ? "10 6" : undefined}
              style={{ transition: "opacity 200ms" }}
            />
          );
        })}

        {/* The routing moment */}
        {fx && lastSignal && (
          <g key={fx.nonce}>
            <path
              d={layout.curve(layout.intake[lastSignal.signal.n - 1], layout.hexes[fx.zone])}
              className="anim-connector fill-none stroke-accent"
              strokeWidth={3}
              strokeLinecap="round"
            />
            <path d={hexPath(layout.hexes[fx.zone].x, layout.hexes[fx.zone].y, r - 3)} className="anim-zone-ring fill-none stroke-accent" strokeWidth={5} />
          </g>
        )}
      </svg>

      {/* Zone labels and counts */}
      {ZONES.map((z) => {
        const c = layout.hexes[z.id];
        const count = zoneCounts[z.id];
        return (
          <span key={z.id}>
            <Overlay
              x={c.x}
              y={c.y - r * 0.66}
              vw={vw}
              vh={vh}
              className={clsx(
                "flex h-5 min-w-[1.25rem] items-center justify-center rounded-full px-1 text-micro font-bold tabular-nums",
                count > 0 ? "bg-ink text-paper" : "border border-line bg-paper text-ash",
              )}
            >
              {count}
            </Overlay>
            <Overlay x={c.x} y={c.y - r * 0.2} vw={vw} vh={vh} className="text-center text-micro font-semibold leading-tight text-ink sm:text-caption sm:leading-tight">
              <span className="block">{z.lines[0]}</span>
              <span className="block">{z.lines[1]}</span>
            </Overlay>
          </span>
        );
      })}

      {/* Tokens: in the intake, or in their zone */}
      {signals.map((s) => {
        const dim = !matchesFilter(s, filter);
        if (!s.routed || !s.zone) {
          const p = layout.intake[s.signal.n - 1];
          return (
            <Overlay key={s.signal.id} x={p.x} y={p.y} vw={vw} vh={vh} className={clsx(dim && filter && "opacity-30")}>
              <span className="flex h-6 w-6 items-center justify-center rounded-full border border-dashed border-ash bg-paper text-micro font-bold text-ash">
                {s.signal.n}
              </span>
            </Overlay>
          );
        }
        const c = layout.hexes[s.zone];
        const peers = signals.filter((o) => o.routed && o.zone === s.zone);
        const index = peers.findIndex((o) => o.signal.id === s.signal.id);
        const cols = Math.min(peers.length, 3);
        const row = Math.floor(index / 3);
        const col = index % 3;
        const inRow = Math.min(3, peers.length - row * 3);
        const sx = r * 0.44;
        const x = c.x + (col - (inRow - 1) / 2) * sx;
        const y = c.y + r * 0.3 + row * r * 0.38 - (peers.length > 3 ? r * 0.12 : 0);
        const landing = fx && fx.signalId === s.signal.id && fx.zone === s.zone;
        return (
          <Overlay key={`${s.signal.id}-${s.zone}`} x={cols ? x : c.x} y={y} vw={vw} vh={vh} className={clsx("transition-opacity duration-200", dim && "opacity-30")}>
            <span
              key={landing ? `land-${fx?.nonce}` : "settled"}
              title={`Signal ${s.signal.n} — ${zoneById(s.zone).name}`}
              className={clsx(
                "flex h-6 w-6 items-center justify-center rounded-full bg-accent text-micro font-bold text-paper shadow-sm",
                landing && "anim-land",
              )}
            >
              {s.signal.n}
            </span>
          </Overlay>
        );
      })}

      <Overlay x={layout.intakeLabel.x} y={layout.intakeLabel.y} vw={vw} vh={vh} className="text-micro font-semibold uppercase tracking-wide text-ash">
        Intake
      </Overlay>
    </div>
  );
}
