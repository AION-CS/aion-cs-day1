const INK = "#16191D";
const ASH = "#5E6670";
const ACCENT = "#0E7A5A";
const LINE = "#E2E5E9";
const WARN = "#B87514";
const PAPER = "#FFFFFF";

const W = 720;
const H = 312;
const CX = 360;
const CY = 160;
const R = 132;
const BOX_W = 134;
const BOX_H = 46;

type Node = { id: string; line1: string; line2: string; owner: string; angle: number };

const NODES: Node[] = [
  { id: "lifecycle", line1: "Device lifecycle", line2: "decisions", owner: "IT + Finance", angle: -90 },
  { id: "behaviour", line1: "Individual usage", line2: "behaviour", owner: "Everyone", angle: -18 },
  { id: "support", line1: "IT support", line2: "model", owner: "IT service lead", angle: 54 },
  { id: "procurement", line1: "Procurement", line2: "policy", owner: "Procurement", angle: 126 },
  { id: "organisation", line1: "Workplace", line2: "organisation", owner: "Facilities + HR", angle: 198 },
];

const pos = (angle: number) => {
  const rad = (angle * Math.PI) / 180;
  return { x: CX + Math.cos(rad) * R, y: CY + Math.sin(rad) * R };
};

/** Block 1 — the five elements around one shared outcome, with the classic self-cancelling pair called out. */
export function WorkplaceElementsSvg() {
  const behaviour = pos(NODES[1].angle);
  const procurement = pos(NODES[3].angle);

  return (
    <div>
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="w-full"
        role="img"
        aria-label="Five elements of a green workplace — device lifecycle decisions, individual usage behaviour, the IT support model, procurement policy and workplace organisation — all feeding one shared outcome, each owned by a different part of the organisation"
      >
        {NODES.map((n) => {
          const p = pos(n.angle);
          return <line key={n.id} x1={CX} y1={CY} x2={p.x} y2={p.y} stroke={LINE} strokeWidth={1.5} />;
        })}

        {/* The pair that most often works against itself */}
        <path
          d={`M ${behaviour.x} ${behaviour.y} Q ${CX} ${CY - 118} ${procurement.x} ${procurement.y}`}
          fill="none"
          stroke={WARN}
          strokeWidth={1.6}
          strokeDasharray="5 4"
        />
        <text x={CX} y={CY - 86} textAnchor="middle" fontSize="9.5" fontWeight={700} fill={WARN}>
          awareness campaign vs. fixed 3-year cycle
        </text>
        <text x={CX} y={CY - 74} textAnchor="middle" fontSize="9" fill={WARN}>
          — these two cancel each other out
        </text>

        <circle cx={CX} cy={CY} r={58} fill={ACCENT} opacity={0.1} />
        <circle cx={CX} cy={CY} r={58} fill="none" stroke={ACCENT} strokeWidth={1.8} />
        <text x={CX} y={CY - 6} textAnchor="middle" fontSize="11.5" fontWeight={700} fill={ACCENT}>
          Green
        </text>
        <text x={CX} y={CY + 8} textAnchor="middle" fontSize="11.5" fontWeight={700} fill={ACCENT}>
          workplace
        </text>
        <text x={CX} y={CY + 24} textAnchor="middle" fontSize="9" fill={ASH}>
          outcome
        </text>

        {NODES.map((n) => {
          const p = pos(n.angle);
          return (
            <g key={n.id} transform={`translate(${p.x - BOX_W / 2}, ${p.y - BOX_H / 2})`}>
              <rect width={BOX_W} height={BOX_H} rx={9} fill={PAPER} stroke={LINE} strokeWidth={1.4} />
              <text x={BOX_W / 2} y={17} textAnchor="middle" fontSize="10.5" fontWeight={700} fill={INK}>
                {n.line1}
              </text>
              <text x={BOX_W / 2} y={29} textAnchor="middle" fontSize="10.5" fontWeight={700} fill={INK}>
                {n.line2}
              </text>
              <text x={BOX_W / 2} y={40} textAnchor="middle" fontSize="8.5" fill={ASH}>
                owner: {n.owner}
              </text>
            </g>
          );
        })}
      </svg>
      <p className="mt-1 text-center text-micro text-ash">
        Five elements, five different owners, one shared outcome — which is exactly why they are so often managed
        against each other.
      </p>
    </div>
  );
}
