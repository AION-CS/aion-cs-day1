const INK = "#16191D";
const ASH = "#5E6670";
const ACCENT = "#0E7A5A";
const LINE = "#E2E5E9";

const DIMENSIONS = ["Architecture", "Cost", "Energy Demand", "Controllability", "Dependencies", "Resilience", "Sustainability"];

function vertex(cx: number, cy: number, r: number, i: number, n: number): [number, number] {
  const a = (-90 + (i * 360) / n) * (Math.PI / 180);
  return [Math.round((cx + r * Math.cos(a)) * 100) / 100, Math.round((cy + r * Math.sin(a)) * 100) / 100];
}

/** Block 1 — seven dimensions a management-level cloud decision touches at once, arranged radially. */
export function SevenDimensionHoneySvg() {
  const size = 380;
  const cx = size / 2;
  const cy = size / 2;
  const r = 120;

  return (
    <svg viewBox={`0 0 ${size} ${size}`} className="w-full" role="img" aria-label="Seven dimensions a management-level cloud decision touches at once">
      <circle cx={cx} cy={cy} r={38} fill="#F5F6F7" stroke={ASH} strokeWidth={1.4} />
      <text x={cx} y={cy - 2} textAnchor="middle" fontSize="11" fontWeight={700} fill={INK}>Management</text>
      <text x={cx} y={cy + 12} textAnchor="middle" fontSize="10" fill={ASH}>Decision</text>

      {DIMENSIONS.map((d, i) => {
        const [nx, ny] = vertex(cx, cy, r, i, DIMENSIONS.length);
        return (
          <g key={d}>
            <line x1={cx} y1={cy} x2={nx} y2={ny} stroke={LINE} strokeWidth={1.4} />
            <circle cx={nx} cy={ny} r={34} fill="#FFFFFF" stroke={ACCENT} strokeWidth={1.6} />
            <text x={nx} y={ny + 3.5} textAnchor="middle" fontSize="8.5" fontWeight={700} fill={ACCENT}>
              {d.length > 12 ? d.split(" ").map((w, wi) => <tspan key={wi} x={nx} dy={wi === 0 ? -4 : 10}>{w}</tspan>) : d}
            </text>
          </g>
        );
      })}
    </svg>
  );
}
