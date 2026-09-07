const INK = "#16191D";
const ASH = "#5E6670";
const ACCENT = "#0E7A5A";
const WARN = "#B87514";
const LINE = "#E2E5E9";

const W = 480;
const H = 220;
const PAD = 32;

/**
 * "Scale vs Demand Tension" — efficiency-per-unit falling against total
 * demand rising, crossing at a marked critical zone. Reusable at any size
 * (Block 3 full version, and a small reminder version at the top of Task 1).
 */
export function ScaleTensionSvg({ compact = false }: { compact?: boolean }) {
  const effStart = { x: PAD, y: 46 };
  const effEnd = { x: W - PAD, y: 150 };
  const demStart = { x: PAD, y: 170 };
  const demEnd = { x: W - PAD, y: 50 };

  // Intersection of the two line segments.
  const denom = (effStart.x - effEnd.x) * (demStart.y - demEnd.y) - (effStart.y - effEnd.y) * (demStart.x - demEnd.x);
  const t = ((effStart.x - demStart.x) * (demStart.y - demEnd.y) - (effStart.y - demStart.y) * (demStart.x - demEnd.x)) / denom;
  const ix = effStart.x + t * (effEnd.x - effStart.x);
  const iy = effStart.y + t * (effEnd.y - effStart.y);

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full" role="img" aria-label="Efficiency per unit falling while total energy demand rises, crossing at a critical zone">
      <line x1={PAD} y1={H - 24} x2={W - PAD} y2={H - 24} stroke={LINE} strokeWidth={1.2} />
      {!compact && (
        <text x={(PAD + W - PAD) / 2} y={H - 8} textAnchor="middle" fontSize="9.5" fill={ASH}>
          time / scale of adoption
        </text>
      )}

      <line x1={effStart.x} y1={effStart.y} x2={effEnd.x} y2={effEnd.y} stroke={ACCENT} strokeWidth={2.4} markerEnd="url(#tArrowAcc)" />
      <line x1={demStart.x} y1={demStart.y} x2={demEnd.x} y2={demEnd.y} stroke={WARN} strokeWidth={2.4} markerEnd="url(#tArrowWarn)" />

      <circle cx={ix} cy={iy} r={compact ? 5 : 6} fill="#FFFFFF" stroke={INK} strokeWidth={1.6} />
      <circle cx={ix} cy={iy} r={2} fill={INK} />

      {!compact && (
        <>
          <text x={effEnd.x} y={effEnd.y + 16} textAnchor="end" fontSize="11" fontWeight={700} fill={ACCENT}>
            Efficiency per unit ↓
          </text>
          <text x={demEnd.x} y={demEnd.y - 10} textAnchor="end" fontSize="11" fontWeight={700} fill={WARN}>
            Total energy demand ↑
          </text>
          <text x={ix} y={iy - 14} textAnchor="middle" fontSize="10" fontWeight={700} fill={INK}>
            critical zone
          </text>
        </>
      )}

      <defs>
        <marker id="tArrowAcc" markerWidth="8" markerHeight="8" refX="4" refY="4" orient="auto">
          <path d="M0,0 L8,4 L0,8 Z" fill={ACCENT} />
        </marker>
        <marker id="tArrowWarn" markerWidth="8" markerHeight="8" refX="4" refY="4" orient="auto">
          <path d="M0,0 L8,4 L0,8 Z" fill={WARN} />
        </marker>
      </defs>
    </svg>
  );
}
