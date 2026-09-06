"use client";

import { useState } from "react";
import { CRITERIA } from "@/lib/route2";

const INK = "#16191D";
const ASH = "#5E6670";
const ACCENT = "#0E7A5A";
const LINE = "#E2E5E9";
const PAPER = "#FFFFFF";

const SIZE = 420;
const CX = SIZE / 2;
const CY = SIZE / 2 - 6;
const R = 150;

/**
 * 7 nodes arranged around a hub, one per criterion. Click a node to reveal
 * its one-sentence definition below — the in-context glossary learners can
 * return to from the criterion cards further down the page without
 * scrolling back up here.
 */
export function CriteriaWheel() {
  const [activeId, setActiveId] = useState<string>(CRITERIA[0].id);
  const active = CRITERIA.find((c) => c.id === activeId) ?? CRITERIA[0];

  const angleFor = (i: number) => -Math.PI / 2 + (i * 2 * Math.PI) / CRITERIA.length;
  const pos = (i: number) => {
    const a = angleFor(i);
    return { x: CX + R * Math.cos(a), y: CY + R * Math.sin(a) };
  };

  return (
    <div>
      <svg viewBox={`0 0 ${SIZE} ${SIZE - 20}`} className="w-full" role="img" aria-label="Seven-criteria wheel — click a node to see its definition">
        {CRITERIA.map((c, i) => {
          const { x, y } = pos(i);
          return <line key={`l-${c.id}`} x1={CX} y1={CY} x2={x} y2={y} stroke={LINE} strokeWidth={1.4} />;
        })}

        <circle cx={CX} cy={CY} r={34} fill={PAPER} stroke={ASH} strokeWidth={1.4} />
        <text x={CX} y={CY - 3} textAnchor="middle" fontSize="9.5" fontWeight={700} fill={ASH}>
          7
        </text>
        <text x={CX} y={CY + 10} textAnchor="middle" fontSize="8" fill={ASH}>
          criteria
        </text>

        {CRITERIA.map((c, i) => {
          const { x, y } = pos(i);
          const isActive = c.id === activeId;
          return (
            <g
              key={c.id}
              role="button"
              tabIndex={0}
              aria-pressed={isActive}
              className="cursor-pointer"
              onClick={() => setActiveId(c.id)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  setActiveId(c.id);
                }
              }}
            >
              <circle cx={x} cy={y} r={30} fill={isActive ? ACCENT : PAPER} stroke={isActive ? ACCENT : INK} strokeWidth={1.6} />
              <text x={x} y={y - 2} textAnchor="middle" fontSize="9" fontWeight={700} fill={isActive ? PAPER : INK}>
                {c.n}
              </text>
              <text
                x={x}
                y={y + (y > CY ? 44 : -40)}
                textAnchor="middle"
                fontSize="9.5"
                fontWeight={600}
                fill={isActive ? ACCENT : INK}
              >
                {c.label}
              </text>
            </g>
          );
        })}
      </svg>

      <div className="rounded-xl border border-accent/25 bg-accentSoft p-4">
        <p className="text-micro font-semibold uppercase tracking-wide text-accent">
          {active.n}. {active.label}
        </p>
        <p className="mt-1 text-caption text-ink">{active.definition}</p>
      </div>
    </div>
  );
}
