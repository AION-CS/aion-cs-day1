"use client";

import { QUADRANTS } from "@/lib/route2";
import { MAP, MID_X, MID_Y, quadrantRect, slotPosition } from "./mapLayout";
import type { MapMeasureState } from "./useRoute2";

/**
 * The 2×2 trade-off map. A measure appears on it only once both diagnostic
 * questions are answered, and then slides into the quadrant those answers
 * imply — the position is a consequence, never a drop target.
 */
export function TradeoffMapSvg({ states, compact = false }: { states: MapMeasureState[]; compact?: boolean }) {
  const labelSize = compact ? 13 : 14;

  return (
    <svg
      viewBox={`0 0 ${MAP.w} ${MAP.h}`}
      preserveAspectRatio="xMidYMid meet"
      role="img"
      aria-label="Trade-off map: momentum cost against structural impact"
      className="h-auto w-full"
    >
      <title>Trade-off map</title>

      {QUADRANTS.map((q) => {
        const r = quadrantRect(q.id);
        const warm = q.id === "quick" || q.id === "bet";
        return (
          <g key={q.id}>
            <rect
              x={r.x + 2}
              y={r.y + 2}
              width={r.w - 4}
              height={r.h - 4}
              rx={10}
              className={warm ? "fill-accentSoft stroke-accent/30" : "fill-mist stroke-line"}
              strokeWidth={1.4}
            />
            <text x={r.x + 12} y={r.y + 24} className={warm ? "fill-accent" : "fill-ash"} style={{ fontSize: labelSize, fontWeight: 700 }}>
              {q.label}
            </text>
          </g>
        );
      })}

      <text x={MAP.x0} y={MAP.h - 12} className="fill-ash" style={{ fontSize: 12.5 }}>
        low
      </text>
      <text x={MID_X} y={MAP.h - 12} textAnchor="middle" className="fill-ink" style={{ fontSize: 13, fontWeight: 600 }}>
        Momentum cost →
      </text>
      <text x={MAP.x1} y={MAP.h - 12} textAnchor="end" className="fill-ash" style={{ fontSize: 12.5 }}>
        high
      </text>
      <text x={18} y={MID_Y} textAnchor="middle" transform={`rotate(-90 18 ${MID_Y})`} className="fill-ink" style={{ fontSize: 13, fontWeight: 600 }}>
        Structural impact →
      </text>

      {states.map((s) => {
        const pos = s.placed ? slotPosition(s.placed, s.slotIndex, s.slotCount) : { x: MID_X, y: MID_Y };
        return (
          <g
            key={s.measure.id}
            style={{
              transform: `translate(${pos.x}px, ${pos.y}px)`,
              opacity: s.placed ? 1 : 0,
              transition: "transform 550ms cubic-bezier(.2,.8,.2,1), opacity 300ms ease",
            }}
          >
            <circle r={18} className="fill-accent stroke-paper" strokeWidth={2.5} />
            <text y={5} textAnchor="middle" className="fill-paper" style={{ fontSize: 13, fontWeight: 700 }}>
              {s.measure.id.toUpperCase()}
            </text>
          </g>
        );
      })}
    </svg>
  );
}
