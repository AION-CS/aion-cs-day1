const INK = "#16191D";
const ASH = "#5E6670";
const ACCENT = "#0E7A5A";
const LINE = "#E2E5E9";
const PAPER = "#FFFFFF";

const W = 560;

/** Block 4 — governance as the base layer that multiplies (not adds to) the value of migration speed and technical optimisation above it. */
export function GovernanceMultiplierSvg() {
  return (
    <svg viewBox={`0 0 ${W} 250`} className="w-full" role="img" aria-label="Governance as a base layer multiplying migration speed and technical optimisation above it">
      {/* Upper layer boxes */}
      <rect x={40} y={20} width={220} height={64} rx={10} fill={PAPER} stroke={INK} strokeWidth={1.8} />
      <text x={150} y={46} textAnchor="middle" fontSize="12" fontWeight={700} fill={INK}>
        Migration Speed
      </text>
      <text x={150} y={64} textAnchor="middle" fontSize="9" fill={ASH}>
        Option A
      </text>

      <rect x={300} y={20} width={220} height={64} rx={10} fill={PAPER} stroke={INK} strokeWidth={1.8} />
      <text x={410} y={46} textAnchor="middle" fontSize="12" fontWeight={700} fill={INK}>
        Technical Optimisation
      </text>
      <text x={410} y={64} textAnchor="middle" fontSize="9" fill={ASH}>
        Option C
      </text>

      {/* Multiplier symbols */}
      <circle cx={150} cy={112} r={16} fill="none" stroke={ACCENT} strokeWidth={2} />
      <text x={150} y={118} textAnchor="middle" fontSize="16" fontWeight={700} fill={ACCENT}>
        ×
      </text>
      <line x1={150} y1={84} x2={150} y2={96} stroke={ASH} strokeWidth={1.6} />
      <line x1={150} y1={128} x2={150} y2={150} stroke={ASH} strokeWidth={1.6} />

      <circle cx={410} cy={112} r={16} fill="none" stroke={ACCENT} strokeWidth={2} />
      <text x={410} y={118} textAnchor="middle" fontSize="16" fontWeight={700} fill={ACCENT}>
        ×
      </text>
      <line x1={410} y1={84} x2={410} y2={96} stroke={ASH} strokeWidth={1.6} />
      <line x1={410} y1={128} x2={410} y2={150} stroke={ASH} strokeWidth={1.6} />

      {/* Base layer */}
      <rect x={40} y={160} width={480} height={72} rx={10} fill="#E7F2EC" stroke={ACCENT} strokeWidth={2.2} />
      <text x={280} y={192} textAnchor="middle" fontSize="13" fontWeight={700} fill={ACCENT}>
        Governance (Option B) — the base layer
      </text>
      <text x={280} y={212} textAnchor="middle" fontSize="9.5" fill={INK}>
        Without visibility into usage and cost, the layers above never realise their full value
      </text>
    </svg>
  );
}
