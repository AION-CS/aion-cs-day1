const INK = "#16191D";
const ASH = "#5E6670";
const ACCENT = "#0E7A5A";
const WARN = "#B87514";
const LINE = "#E2E5E9";

const LEAKS = [
  { y: 40, label: "Over-provisioning", sub: "More capacity requested than the workload needs" },
  { y: 92, label: "Unmanaged self-service", sub: "Any team can spin up resources, unreviewed" },
  { y: 144, label: "Unnecessary data retention", sub: "No lifecycle or deletion policy" },
  { y: 196, label: "Zombie / idle workloads", sub: "Left running after the project ends" },
  { y: 248, label: "Poor architecture decisions", sub: "Always-on compute for rare workloads" },
] as const;

/** Block 5 — a leaking pipe/tank: each drip is one source of cloud-usage inefficiency. */
export function InefficiencyLeakageSvg() {
  const tankX = 60;
  const tankW = 70;
  const tankTop = 20;
  const tankBottom = 280;

  return (
    <svg viewBox="0 0 620 300" className="w-full" role="img" aria-label="A leaking supply pipe representing five sources of cloud usage inefficiency">
      {/* Tank / pipe */}
      <rect x={tankX} y={tankTop} width={tankW} height={tankBottom - tankTop} rx={8} fill="#F5F6F7" stroke={LINE} strokeWidth={1.6} />
      <rect x={tankX + 8} y={tankTop + 10} width={tankW - 16} height={tankBottom - tankTop - 20} rx={4} fill={ACCENT} opacity={0.18} />
      <text x={tankX + tankW / 2} y={tankTop - 8} textAnchor="middle" fontSize="10.5" fontWeight={700} fill={INK}>
        Provisioned
      </text>
      <text x={tankX + tankW / 2} y={tankTop - 8 + 12} textAnchor="middle" fontSize="9" fill={ASH}>
        cloud capacity
      </text>

      {LEAKS.map((leak, i) => (
        <g key={leak.label}>
          {/* Leak point on the tank wall */}
          <circle cx={tankX + tankW} cy={leak.y} r={4} fill={WARN} />
          {/* Drip path curving out to the label */}
          <path
            d={`M${tankX + tankW},${leak.y} C ${tankX + tankW + 60},${leak.y} ${tankX + tankW + 40},${leak.y} ${tankX + tankW + 110},${leak.y}`}
            fill="none"
            stroke={WARN}
            strokeWidth={1.6}
            strokeDasharray="4 4"
            opacity={0.7}
          />
          <circle cx={tankX + tankW + 60} cy={leak.y + 14} r={2.4} fill={WARN} opacity={0.6}>
            <animate attributeName="cy" values={`${leak.y + 8};${leak.y + 22};${leak.y + 8}`} dur="1.8s" repeatCount="indefinite" begin={`${i * 0.3}s`} />
          </circle>
          <text x={tankX + tankW + 118} y={leak.y - 4} fontSize="11" fontWeight={700} fill={INK}>
            {leak.label}
          </text>
          <text x={tankX + tankW + 118} y={leak.y + 11} fontSize="9" fill={ASH}>
            {leak.sub}
          </text>
        </g>
      ))}
    </svg>
  );
}
