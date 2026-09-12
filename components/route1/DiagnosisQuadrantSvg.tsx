"use client";

import { FINDINGS, ZONES, type DriverId, type HorizonId } from "@/lib/route1";

const INK = "#16191D";
const ASH = "#5E6670";
const ACCENT = "#0E7A5A";
const LINE = "#E2E5E9";
const PAPER = "#FFFFFF";

const W = 720;
const H = 420;
const PLOT_L = 118;
const PLOT_T = 46;
const PLOT_W = 540;
const PLOT_H = 304;
const MID_X = PLOT_L + PLOT_W / 2;
const MID_Y = PLOT_T + PLOT_H / 2;

/** Quadrant captions, clockwise from top-left. */
const QUADRANTS = [
  { x: PLOT_L + PLOT_W * 0.25, y: PLOT_T + 24, title: "Nudge territory", sub: "individual · quick" },
  { x: PLOT_L + PLOT_W * 0.75, y: PLOT_T + 24, title: "Configure it once", sub: "structural · quick" },
  { x: PLOT_L + PLOT_W * 0.25, y: PLOT_T + PLOT_H - 30, title: "Culture work", sub: "individual · slow" },
  { x: PLOT_L + PLOT_W * 0.75, y: PLOT_T + PLOT_H - 30, title: "Governance work", sub: "structural · slow" },
];

/**
 * Deterministic offset inside a quadrant so several findings landing in the
 * same cell stay readable. Index-based, not random — a given finding always
 * sits in the same spot across reloads.
 */
const SLOTS = [
  { dx: -58, dy: -26 },
  { dx: 10, dy: -10 },
  { dx: -30, dy: 26 },
  { dx: 58, dy: 18 },
  { dx: -8, dy: 52 },
  { dx: 44, dy: -44 },
];

export function DiagnosisQuadrantSvg({
  driver,
  horizon,
}: {
  driver: Record<string, DriverId | undefined>;
  horizon: Record<string, HorizonId | undefined>;
}) {
  const letterOf = (zoneId: string) => ZONES.find((z) => z.id === zoneId)?.letter ?? "?";

  const placed = FINDINGS.map((f, i) => {
    const d = driver[f.id];
    const h = horizon[f.id];
    if (!d || !h) return null;
    const cellCx = d === "individual" ? PLOT_L + PLOT_W * 0.25 : PLOT_L + PLOT_W * 0.75;
    const cellCy = h === "shortTerm" ? PLOT_T + PLOT_H * 0.25 : PLOT_T + PLOT_H * 0.75;
    const slot = SLOTS[i % SLOTS.length];
    return { id: f.id, letter: letterOf(f.zoneId), x: cellCx + slot.dx, y: cellCy + slot.dy };
  }).filter(Boolean) as { id: string; letter: string; x: number; y: number }[];

  return (
    <div>
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="w-full"
        role="img"
        aria-label={`Diagnosis matrix. ${placed.length} of ${FINDINGS.length} findings placed. Horizontal axis: individual behaviour to management and structural. Vertical axis: short-term fix to structural change needed.`}
      >
        <rect x={PLOT_L} y={PLOT_T} width={PLOT_W} height={PLOT_H} rx={10} fill="#F5F6F7" stroke={LINE} strokeWidth={1.4} />

        {QUADRANTS.map((q) => (
          <g key={q.title}>
            <text x={q.x} y={q.y} textAnchor="middle" fontSize="10.5" fontWeight={700} fill={ASH} opacity={0.75}>
              {q.title}
            </text>
            <text x={q.x} y={q.y + 12} textAnchor="middle" fontSize="8.5" fill={ASH} opacity={0.6}>
              {q.sub}
            </text>
          </g>
        ))}

        <line x1={MID_X} y1={PLOT_T} x2={MID_X} y2={PLOT_T + PLOT_H} stroke={LINE} strokeWidth={1.6} />
        <line x1={PLOT_L} y1={MID_Y} x2={PLOT_L + PLOT_W} y2={MID_Y} stroke={LINE} strokeWidth={1.6} />

        {/* axis labels */}
        <text x={PLOT_L + PLOT_W * 0.25} y={PLOT_T + PLOT_H + 26} textAnchor="middle" fontSize="10.5" fontWeight={700} fill={INK}>
          Individual behaviour
        </text>
        <text x={PLOT_L + PLOT_W * 0.75} y={PLOT_T + PLOT_H + 26} textAnchor="middle" fontSize="10.5" fontWeight={700} fill={INK}>
          Management &amp; structural
        </text>
        <text x={PLOT_L + PLOT_W / 2} y={PLOT_T + PLOT_H + 44} textAnchor="middle" fontSize="9" fill={ASH}>
          what is driving the finding
        </text>

        <text
          x={0}
          y={0}
          transform={`translate(${PLOT_L - 28}, ${PLOT_T + PLOT_H * 0.25}) rotate(-90)`}
          textAnchor="middle"
          fontSize="10.5"
          fontWeight={700}
          fill={INK}
        >
          Short-term fix
        </text>
        <text
          x={0}
          y={0}
          transform={`translate(${PLOT_L - 28}, ${PLOT_T + PLOT_H * 0.75}) rotate(-90)`}
          textAnchor="middle"
          fontSize="10.5"
          fontWeight={700}
          fill={INK}
        >
          Structural change
        </text>
        <text
          x={0}
          y={0}
          transform={`translate(${PLOT_L - 44}, ${MID_Y}) rotate(-90)`}
          textAnchor="middle"
          fontSize="9"
          fill={ASH}
        >
          what it takes to fix
        </text>

        <text x={PLOT_L} y={32} fontSize="10.5" fill={ASH}>
          <tspan fontWeight={700} fill={INK}>
            {placed.length}
          </tspan>
          {` of ${FINDINGS.length} findings diagnosed`}
        </text>

        {/* markers — transform is CSS-transitioned, so a changed answer visibly moves the dot */}
        {placed.map((p) => (
          <g key={p.id} style={{ transform: `translate(${p.x}px, ${p.y}px)`, transition: "transform 420ms cubic-bezier(0.22, 0.61, 0.36, 1)" }}>
            <circle r={15} fill={ACCENT} opacity={0.16} />
            <circle r={11} fill={ACCENT} />
            <text y={4} textAnchor="middle" fontSize="11" fontWeight={700} fill={PAPER}>
              {p.letter}
            </text>
          </g>
        ))}
      </svg>
      {placed.length === 0 && (
        <p className="mt-1 text-center text-micro text-ash">
          Answer both questions on a finding below and it takes its place here.
        </p>
      )}
    </div>
  );
}
