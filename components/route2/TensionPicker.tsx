"use client";

import clsx from "clsx";
import { FACTORS, type FactorId } from "@/lib/route2";
import { Overlay } from "@/components/route1/diagrams/Overlay";
import { linksFor, type TradeOffLink } from "./tradeoffs";

/**
 * SVG #6 — the tension picker. Eight factor nodes on a ring; click one, then
 * an opposing one, to draw an animated link between them (§8.3.4). Clicking
 * either end of an existing link removes it. Undo/redo lives one level up, in
 * TradeOffSection, over the link list itself.
 */

const VW = 520;
const VH = 520;
const CX = 260;
const CY = 260;
const R = 190;

const angleFor = (i: number) => -Math.PI / 2 + (i * 2 * Math.PI) / FACTORS.length;
const pointFor = (i: number) => {
  const a = angleFor(i);
  return { x: Math.round((CX + R * Math.cos(a)) * 100) / 100, y: Math.round((CY + R * Math.sin(a)) * 100) / 100 };
};
const indexOf = (id: FactorId) => FACTORS.findIndex((f) => f.id === id);

export function TensionPicker({
  links,
  pending,
  onClickFactor,
}: {
  links: TradeOffLink[];
  pending: FactorId | null;
  onClickFactor: (id: FactorId) => void;
}) {
  return (
    <div className="relative mx-auto w-full max-w-[440px]">
      <svg
        viewBox={`0 0 ${VW} ${VH}`}
        preserveAspectRatio="xMidYMid meet"
        role="img"
        aria-label="Eight factors arranged in a ring. Click one, then an opposing one, to draw a trade-off link between them."
        className="h-auto w-full"
      >
        <title>Central trade-offs</title>
        <circle cx={CX} cy={CY} r={R} className="fill-none stroke-line" strokeWidth={1} strokeDasharray="4 6" />

        {links.map((l) => {
          const a = pointFor(indexOf(l.a));
          const b = pointFor(indexOf(l.b));
          return (
            <line
              key={`${l.a}-${l.b}`}
              x1={a.x}
              y1={a.y}
              x2={b.x}
              y2={b.y}
              className={clsx("anim-connector stroke-accent", !l.note.trim() && "stroke-warn")}
              strokeWidth={2.6}
              strokeLinecap="round"
            />
          );
        })}

        {pending &&
          (() => {
            const p = pointFor(indexOf(pending));
            return <circle cx={p.x} cy={p.y} r={30} className="fill-accent/15" />;
          })()}

        {FACTORS.map((f, i) => {
          const p = pointFor(i);
          const on = pending === f.id;
          const touched = links.some((l) => l.a === f.id || l.b === f.id);
          return (
            <g
              key={f.id}
              role="button"
              tabIndex={0}
              aria-pressed={on}
              aria-label={f.label}
              className="cursor-pointer outline-none"
              onClick={() => onClickFactor(f.id)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  onClickFactor(f.id);
                }
              }}
            >
              <circle cx={p.x} cy={p.y} r={24} className={on ? "fill-accent stroke-accentHi" : touched ? "fill-ink stroke-ink" : "fill-paper stroke-ink/50"} strokeWidth={on ? 3 : 2} />
            </g>
          );
        })}
      </svg>

      {FACTORS.map((f, i) => {
        const p = pointFor(i);
        const on = pending === f.id;
        const touched = links.some((l) => l.a === f.id || l.b === f.id);
        return (
          <Overlay
            key={f.id}
            x={p.x}
            y={p.y}
            vw={VW}
            vh={VH}
            className={clsx("pointer-events-none whitespace-normal text-center text-micro font-semibold leading-tight", on || touched ? "text-paper" : "text-ink")}
          >
            <span className="block w-16">{f.label}</span>
          </Overlay>
        );
      })}

      <div className="mt-3 text-center">
        <p aria-live="polite" className="text-micro text-ash">
          {pending ? `${FACTORS.find((f) => f.id === pending)!.label} selected — click an opposing factor to link it, or click it again to cancel.` : `${links.length} link${links.length === 1 ? "" : "s"} drawn.`}
        </p>
      </div>
    </div>
  );
}

/** How many links currently touch this factor — used by TradeOffSection for a small badge. */
export const touchCount = (links: TradeOffLink[], id: FactorId) => linksFor(links, id).length;
