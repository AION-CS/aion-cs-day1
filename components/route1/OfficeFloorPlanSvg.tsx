"use client";

import clsx from "clsx";
import { ZONES, type ZoneId } from "@/lib/route1";

const INK = "#16191D";
const ASH = "#5E6670";
const ACCENT = "#0E7A5A";
const LINE = "#E2E5E9";
const PAPER = "#FFFFFF";

const W = 720;
const H = 400;
const ROOM_W = 200;
const ROOM_H = 140;

const LAYOUT: Record<ZoneId, { x: number; y: number }> = {
  storage: { x: 40, y: 40 },
  finance: { x: 260, y: 40 },
  workspace: { x: 480, y: 40 },
  print: { x: 40, y: 240 },
  helpdesk: { x: 260, y: 240 },
  onboarding: { x: 480, y: 240 },
};

/** Small line glyph per room, drawn inside the room box. Origin is the room's top-left. */
function RoomGlyph({ id, color }: { id: ZoneId; color: string }) {
  const p = { stroke: color, strokeWidth: 1.5, fill: "none", strokeLinecap: "round" as const };
  switch (id) {
    case "storage": // shelving stacked with boxes
      return (
        <g transform="translate(24, 58)">
          <line x1={0} y1={0} x2={64} y2={0} {...p} />
          <line x1={0} y1={20} x2={64} y2={20} {...p} />
          <line x1={0} y1={40} x2={64} y2={40} {...p} />
          <rect x={4} y={-12} width={18} height={12} {...p} />
          <rect x={28} y={-12} width={14} height={12} {...p} />
          <rect x={6} y={8} width={22} height={12} {...p} />
          <rect x={36} y={8} width={16} height={12} {...p} />
          <rect x={10} y={28} width={20} height={12} {...p} />
        </g>
      );
    case "finance": // document with a repeating schedule
      return (
        <g transform="translate(24, 46)">
          <rect x={0} y={0} width={46} height={58} rx={3} {...p} />
          <line x1={9} y1={14} x2={37} y2={14} {...p} />
          <line x1={9} y1={26} x2={37} y2={26} {...p} />
          <line x1={9} y1={38} x2={28} y2={38} {...p} />
          <circle cx={56} cy={44} r={12} {...p} />
          <path d="M56 36 L56 44 L62 47" {...p} />
        </g>
      );
    case "workspace": // two desks, screens still lit
      return (
        <g transform="translate(22, 52)">
          <rect x={0} y={0} width={30} height={20} rx={2} {...p} />
          <line x1={15} y1={20} x2={15} y2={26} {...p} />
          <line x1={4} y1={26} x2={26} y2={26} {...p} />
          <rect x={44} y={0} width={30} height={20} rx={2} {...p} />
          <line x1={59} y1={20} x2={59} y2={26} {...p} />
          <line x1={48} y1={26} x2={70} y2={26} {...p} />
          <path d="M6 36 L68 36" {...p} />
          <circle cx={15} cy={10} r={3} fill={color} stroke="none" />
          <circle cx={59} cy={10} r={3} fill={color} stroke="none" />
        </g>
      );
    case "print": // multifunction printer with paper tray
      return (
        <g transform="translate(24, 50)">
          <rect x={0} y={12} width={58} height={34} rx={4} {...p} />
          <rect x={12} y={0} width={34} height={12} {...p} />
          <line x1={10} y1={30} x2={48} y2={30} {...p} />
          <rect x={14} y={46} width={30} height={8} {...p} />
        </g>
      );
    case "helpdesk": // counter plus a shelf of spares
      return (
        <g transform="translate(22, 50)">
          <rect x={0} y={24} width={44} height={26} rx={3} {...p} />
          <line x1={0} y1={34} x2={44} y2={34} {...p} />
          <rect x={54} y={4} width={20} height={13} {...p} />
          <rect x={54} y={21} width={20} height={13} {...p} />
          <rect x={54} y={38} width={20} height={13} {...p} />
        </g>
      );
    case "onboarding": // a brand-new boxed kit
      return (
        <g transform="translate(26, 48)">
          <rect x={0} y={14} width={52} height={32} rx={3} {...p} />
          <path d="M0 24 L52 24" {...p} />
          <path d="M26 14 L26 46" {...p} />
          <path d="M18 14 Q26 2 34 14" {...p} />
          <rect x={60} y={26} width={16} height={20} rx={2} {...p} />
        </g>
      );
  }
}

/**
 * Task 1, Stage 1 — the interactive floor plan. Six clickable rooms; each holds
 * exactly one finding. This is navigation, not decoration: the whole stage is
 * driven by clicking through it.
 */
export function OfficeFloorPlanSvg({
  visited,
  activeZoneId,
  onZoneClick,
}: {
  visited: string[];
  activeZoneId: ZoneId | null;
  onZoneClick: (id: ZoneId) => void;
}) {
  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      className="w-full"
      role="group"
      aria-label="UrbanByte Consulting office floor plan with six zones to investigate"
    >
      {/* building shell + corridor */}
      <rect x={20} y={20} width={680} height={360} rx={14} fill="#F5F6F7" stroke={LINE} strokeWidth={1.5} />
      <rect x={40} y={192} width={640} height={32} rx={6} fill={PAPER} stroke={LINE} strokeWidth={1} />
      <text x={360} y={213} textAnchor="middle" fontSize="9.5" fill={ASH}>
        corridor · Frankfurt HQ, 2nd floor
      </text>

      {ZONES.map((zone) => {
        const { x, y } = LAYOUT[zone.id];
        const isVisited = visited.includes(zone.id);
        const isActive = activeZoneId === zone.id;
        const stroke = isActive ? ACCENT : isVisited ? ACCENT : LINE;
        const glyphColor = isActive || isVisited ? ACCENT : ASH;

        return (
          <g
            key={zone.id}
            role="button"
            tabIndex={0}
            aria-pressed={isActive}
            aria-label={`Zone ${zone.letter} — ${zone.label}${isVisited ? " (visited)" : ""}`}
            className={clsx("group cursor-pointer focus-visible:outline-none")}
            onClick={() => onZoneClick(zone.id)}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                onZoneClick(zone.id);
              }
            }}
          >
            <g transform={`translate(${x}, ${y})`}>
              <rect
                width={ROOM_W}
                height={ROOM_H}
                rx={10}
                fill={isActive ? "#E7F2EC" : PAPER}
                stroke={stroke}
                strokeWidth={isActive ? 2.2 : 1.5}
                className="transition-all duration-150 group-hover:stroke-[#0E7A5A]"
              />
              <circle cx={26} cy={26} r={13} fill={isVisited || isActive ? ACCENT : "#EEF1F3"} />
              <text
                x={26}
                y={30}
                textAnchor="middle"
                fontSize="12"
                fontWeight={700}
                fill={isVisited || isActive ? PAPER : ASH}
              >
                {zone.letter}
              </text>
              <text x={48} y={30} fontSize="11.5" fontWeight={700} fill={INK}>
                {zone.label}
              </text>

              <RoomGlyph id={zone.id} color={glyphColor} />

              {isVisited ? (
                <g transform={`translate(${ROOM_W - 30}, ${ROOM_H - 28})`}>
                  <circle r={11} fill={ACCENT} />
                  <path d="M-4.5 0 L-1.4 3.6 L5 -3.4" stroke={PAPER} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" fill="none" />
                </g>
              ) : (
                <text
                  x={ROOM_W - 16}
                  y={ROOM_H - 16}
                  textAnchor="end"
                  fontSize="9.5"
                  fontWeight={700}
                  fill={ASH}
                  className="transition-colors duration-150 group-hover:fill-[#0E7A5A]"
                >
                  click to investigate
                </text>
              )}
            </g>
          </g>
        );
      })}
    </svg>
  );
}
