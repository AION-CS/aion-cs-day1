const INK = "#16191D";
const ASH = "#5E6670";
const ACCENT = "#0E7A5A";
const LINE = "#E2E5E9";

const CHALLENGES = [
  { label: "Vendor Dependency", sub: "Lock-in via proprietary services" },
  { label: "Lack of Transparency", sub: "Usage/cost scattered across teams" },
  { label: "Cost Control (FinOps)", sub: "Usage-based spend, easy to miss" },
  { label: "Data Sovereignty", sub: "Legal residency requirements" },
  { label: "Governance Gaps", sub: "No policy on who can provision" },
  { label: "Security & Compliance", sub: "Shared responsibility misconfigured" },
] as const;

function vertex(cx: number, cy: number, r: number, i: number): [number, number] {
  const a = (-90 + i * 60) * (Math.PI / 180);
  return [cx + r * Math.cos(a), cy + r * Math.sin(a)];
}

/** Block 4 — six recurring cloud-adoption challenges, arranged radially around a hexagon core. */
export function ChallengesHexSvg() {
  const size = 460;
  const cx = size / 2;
  const cy = size / 2 - 6;
  const r = 92;
  const labelR = r + 66;

  return (
    <svg viewBox={`0 0 ${size} ${size - 6}`} className="w-full" role="img" aria-label="Six typical cloud adoption challenges arranged around a central hexagon">
      <polygon points={CHALLENGES.map((_, i) => vertex(cx, cy, r, i).join(",")).join(" ")} fill="#F5F6F7" stroke={LINE} strokeWidth={1.4} />
      <text x={cx} y={cy + 4} textAnchor="middle" fontSize="12" fontWeight={700} fill={INK}>
        Cloud
      </text>
      <text x={cx} y={cy + 18} textAnchor="middle" fontSize="10" fill={ASH}>
        adoption
      </text>

      {CHALLENGES.map((c, i) => {
        const [nx, ny] = vertex(cx, cy, r, i);
        const [lx, ly] = vertex(cx, cy, labelR, i);
        return (
          <g key={c.label}>
            <line x1={nx} y1={ny} x2={lx} y2={ly} stroke={ACCENT} strokeWidth={1.2} strokeDasharray="3 3" opacity={0.6} />
            <circle cx={nx} cy={ny} r={4} fill={ACCENT} />
            <text x={lx} y={ly - 4} textAnchor="middle" fontSize="10.5" fontWeight={700} fill={INK}>
              {c.label}
            </text>
            <text x={lx} y={ly + 10} textAnchor="middle" fontSize="8.5" fill={ASH}>
              {c.sub}
            </text>
          </g>
        );
      })}
    </svg>
  );
}
