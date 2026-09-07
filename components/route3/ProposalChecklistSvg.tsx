const INK = "#16191D";
const ASH = "#5E6670";
const ACCENT = "#0E7A5A";
const LINE = "#E2E5E9";

const STEPS = [
  "Strategic relevance",
  "Guiding decisions",
  "Decision logic",
  "Central trade-offs",
  "First prioritized measures",
  "Roles, approval & review",
  "Decide now, despite gaps",
];

/** Block 5 — the 7-step shape of a decision-ready proposal, used directly as Stage 6's scaffold. */
export function ProposalChecklistSvg() {
  const rowH = 34;
  return (
    <svg viewBox={`0 0 420 ${STEPS.length * rowH + 10}`} className="w-full" role="img" aria-label="Seven steps of a decision-ready board proposal">
      {STEPS.map((step, i) => {
        const y = 8 + i * rowH;
        return (
          <g key={step}>
            {i < STEPS.length - 1 && <line x1={20} y1={y + 14} x2={20} y2={y + rowH + 4} stroke={LINE} strokeWidth={1.6} />}
            <circle cx={20} cy={y + 14} r={11} fill="#FFFFFF" stroke={ACCENT} strokeWidth={1.8} />
            <text x={20} y={y + 18} textAnchor="middle" fontSize="10" fontWeight={700} fill={ACCENT}>{i + 1}</text>
            <text x={44} y={y + 18} fontSize="11" fontWeight={600} fill={INK}>{step}</text>
          </g>
        );
      })}
    </svg>
  );
}
