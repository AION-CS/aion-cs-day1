import { DECISION_NODES, type NodeId } from "@/lib/route3";

const INK = "#16191D";
const ASH = "#5E6670";
const ACCENT = "#0E7A5A";
const ACCENT_SOFT = "#E7F2EC";
const LINE = "#E2E5E9";

function vertex(cx: number, cy: number, r: number, i: number, n: number): [number, number] {
  const a = (-90 + (i * 360) / n) * (Math.PI / 180);
  return [Math.round((cx + r * Math.cos(a)) * 100) / 100, Math.round((cy + r * Math.sin(a)) * 100) / 100];
}

/**
 * The Decision Architecture Model — 5 nodes around a central hub. Purely
 * presentational (reflects `counts`, owns no state). Used two ways: a static
 * legend in the material, and Stage 1's visual + drop target (`interactive`),
 * with the parent rendering the real HTML zones underneath for detail/removal.
 */
export function DecisionArchitectureModel({
  size = 340,
  counts,
  interactive = false,
}: {
  size?: number;
  counts?: Partial<Record<NodeId, number>>;
  interactive?: boolean;
}) {
  const cx = size / 2;
  const cy = size / 2;
  const r = size / 2 - 64;

  return (
    <svg viewBox={`0 0 ${size} ${size}`} className="w-full" role="img" aria-label="Decision Architecture Model: five components feeding one management decision">
      <circle cx={cx} cy={cy} r={40} fill="#F5F6F7" stroke={ASH} strokeWidth={1.4} />
      <text x={cx} y={cy - 2} textAnchor="middle" fontSize="10.5" fontWeight={700} fill={INK}>Management</text>
      <text x={cx} y={cy + 12} textAnchor="middle" fontSize="10.5" fontWeight={700} fill={INK}>Decision</text>

      {DECISION_NODES.map((n, i) => {
        const [nx, ny] = vertex(cx, cy, r, i, DECISION_NODES.length);
        const count = counts?.[n.id] ?? 0;
        const filled = count > 0;
        return (
          <g key={n.id}>
            <line x1={cx} y1={cy} x2={nx} y2={ny} stroke={LINE} strokeWidth={1.4} />
            <circle
              cx={nx}
              cy={ny}
              r={46}
              data-dropzone={interactive ? n.id : undefined}
              fill={filled ? ACCENT_SOFT : "#FFFFFF"}
              stroke={ACCENT}
              strokeWidth={filled ? 2.2 : 1.6}
              className={interactive ? "cursor-pointer transition-colors duration-150" : undefined}
            />
            <text x={nx} y={ny - 4} textAnchor="middle" fontSize="9.5" fontWeight={700} fill={INK}>
              {n.label}
            </text>
            {counts && (
              <text x={nx} y={ny + 12} textAnchor="middle" fontSize="9" fontWeight={700} fill={filled ? ACCENT : ASH}>
                {count}
              </text>
            )}
          </g>
        );
      })}
    </svg>
  );
}
