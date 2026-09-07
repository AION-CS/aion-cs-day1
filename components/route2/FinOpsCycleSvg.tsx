const INK = "#16191D";
const ASH = "#5E6670";
const ACCENT = "#0E7A5A";
const LINE = "#E2E5E9";
const PAPER = "#FFFFFF";

const PHASES = [
  { id: "inform", label: "Inform", desc: "See what's spent and running", angle: -90 },
  { id: "optimize", label: "Optimize", desc: "Act on it — rightsize, cut waste", angle: 30 },
  { id: "operate", label: "Operate", desc: "Embed it into ongoing policy", angle: 150 },
] as const;

const SIZE = 360;
const CX = SIZE / 2;
const CY = SIZE / 2 - 4;
const R = 118;

function point(angleDeg: number, radius: number) {
  const a = (angleDeg * Math.PI) / 180;
  return { x: CX + radius * Math.cos(a), y: CY + radius * Math.sin(a) };
}

/** Block 1 — the FinOps Framework's continuous Inform → Optimize → Operate cycle, with curved arrows looping back. */
export function FinOpsCycleSvg() {
  return (
    <div>
      <svg viewBox={`0 0 ${SIZE} ${SIZE - 40}`} className="w-full" role="img" aria-label="FinOps cycle: Inform, Optimize, Operate, looping continuously">
        <circle cx={CX} cy={CY} r={R} fill="none" stroke={LINE} strokeWidth={1.4} strokeDasharray="4 5" />

        {PHASES.map((p, i) => {
          const next = PHASES[(i + 1) % PHASES.length];
          const from = point(p.angle + 22, R);
          const to = point(next.angle - 22, R);
          const midAngle = (p.angle + next.angle + (next.angle < p.angle ? 360 : 0)) / 2;
          const mid = point(midAngle, R + 22);
          return (
            <path
              key={`arc-${p.id}`}
              d={`M${from.x.toFixed(1)},${from.y.toFixed(1)} Q${mid.x.toFixed(1)},${mid.y.toFixed(1)} ${to.x.toFixed(1)},${to.y.toFixed(1)}`}
              fill="none"
              stroke={ACCENT}
              strokeWidth={2}
              markerEnd="url(#finopsArrow)"
            />
          );
        })}

        {PHASES.map((p) => {
          const pos = point(p.angle, R);
          return (
            <g key={p.id}>
              <circle cx={pos.x} cy={pos.y} r={44} fill={PAPER} stroke={INK} strokeWidth={1.8} />
              <text x={pos.x} y={pos.y - 2} textAnchor="middle" fontSize="13" fontWeight={700} fill={INK}>
                {p.label}
              </text>
            </g>
          );
        })}

        <text x={CX} y={CY + 4} textAnchor="middle" fontSize="9.5" fontWeight={600} fill={ASH}>
          continuous
        </text>
        <text x={CX} y={CY + 16} textAnchor="middle" fontSize="9.5" fontWeight={600} fill={ASH}>
          cycle
        </text>

        <defs>
          <marker id="finopsArrow" markerWidth="8" markerHeight="8" refX="4" refY="4" orient="auto">
            <path d="M0,0 L8,4 L0,8 Z" fill={ACCENT} />
          </marker>
        </defs>
      </svg>
      <div className="mt-1 grid gap-2 sm:grid-cols-3">
        {PHASES.map((p) => (
          <div key={p.id} className="rounded-lg border border-line p-2.5 text-center">
            <p className="text-micro font-semibold text-ink">{p.label}</p>
            <p className="text-micro text-ash">{p.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
