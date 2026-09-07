const INK = "#16191D";
const ASH = "#5E6670";
const ACCENT = "#0E7A5A";
const WARN = "#B87514";

const SYMPTOMS = ["Rising cost", "Growing storage", "Slow applications"];
const LEVERS = ["Governance gap", "Architectural debt", "Missing monitoring"];

/** Block 3 — symptoms above the waterline, root-cause levers below it. */
export function IcebergSvg() {
  const W = 480;
  const H = 260;
  const waterY = 110;

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full" role="img" aria-label="Symptoms visible above the waterline; root-cause levers hidden below it">
      <rect x={0} y={0} width={W} height={waterY} fill="#F0F6FF" />
      <rect x={0} y={waterY} width={W} height={H - waterY} fill="#E7F2EC" />
      <line x1={0} y1={waterY} x2={W} y2={waterY} stroke={ASH} strokeWidth={1.6} strokeDasharray="5 4" />
      <text x={12} y={waterY - 8} fontSize="9" fontWeight={700} fill={ASH}>waterline — what's visible</text>

      <polygon points={`${W / 2 - 70},${waterY} ${W / 2 + 70},${waterY} ${W / 2 + 26},${H - 12} ${W / 2 - 26},${H - 12}`} fill="#FFFFFF" stroke={INK} strokeWidth={1.6} />

      {SYMPTOMS.map((t, i) => (
        <g key={t}>
          <rect x={30} y={16 + i * 30} width={150} height={22} rx={6} fill="#FFFFFF" stroke={WARN} strokeWidth={1.4} />
          <text x={105} y={31 + i * 30} textAnchor="middle" fontSize="9.5" fontWeight={600} fill={WARN}>{t}</text>
        </g>
      ))}

      {LEVERS.map((t, i) => (
        <g key={t}>
          <rect x={W - 200} y={waterY + 30 + i * 34} width={170} height={24} rx={6} fill="#FFFFFF" stroke={ACCENT} strokeWidth={1.6} />
          <text x={W - 115} y={waterY + 46 + i * 34} textAnchor="middle" fontSize="9.5" fontWeight={700} fill={ACCENT}>{t}</text>
        </g>
      ))}
    </svg>
  );
}
