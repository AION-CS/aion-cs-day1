import { HORIZONS, type HorizonId } from "@/lib/route3";

const INK = "#16191D";
const ASH = "#5E6670";
const ACCENT = "#0E7A5A";
const ACCENT_SOFT = "#E7F2EC";
const LINE = "#E2E5E9";

const W = 560;
const H = 130;
const LANE_W = W / 3 - 8;

/**
 * The 3-horizon roadmap — Short-Term / Medium-Term / Structural lanes.
 * Purely presentational; reflects `counts` if given. Used as a static legend
 * in the material, and as Stage 4's visual + drop target (`interactive`) —
 * the parent renders real HTML zones underneath for chip detail/removal.
 */
export function RoadmapLanesSvg({ counts, interactive = false }: { counts?: Partial<Record<HorizonId, number>>; interactive?: boolean }) {
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full" role="img" aria-label="Roadmap with Short-Term, Medium-Term, and Structural lanes">
      <line x1={10} y1={16} x2={W - 10} y2={16} stroke={ASH} strokeWidth={1.4} markerEnd="url(#roadmapArrow)" />
      <text x={W - 10} y={10} textAnchor="end" fontSize="8.5" fill={ASH}>time / commitment</text>

      {HORIZONS.map((h, i) => {
        const x = 4 + i * (LANE_W + 8);
        const count = counts?.[h.id] ?? 0;
        const filled = count > 0;
        return (
          <g key={h.id}>
            <rect
              x={x}
              y={30}
              width={LANE_W}
              height={H - 40}
              rx={10}
              data-dropzone={interactive ? h.id : undefined}
              fill={filled ? ACCENT_SOFT : "#FFFFFF"}
              stroke={ACCENT}
              strokeWidth={filled ? 2 : 1.4}
              className={interactive ? "cursor-pointer transition-colors duration-150" : undefined}
            />
            <text x={x + LANE_W / 2} y={30 + 26} textAnchor="middle" fontSize="11" fontWeight={700} fill={INK}>
              {h.label}
            </text>
            {counts && (
              <text x={x + LANE_W / 2} y={30 + 44} textAnchor="middle" fontSize="9.5" fontWeight={700} fill={filled ? ACCENT : ASH}>
                {count} placed
              </text>
            )}
          </g>
        );
      })}

      <defs>
        <marker id="roadmapArrow" markerWidth="8" markerHeight="8" refX="4" refY="4" orient="auto">
          <path d="M0,0 L8,4 L0,8 Z" fill={ASH} />
        </marker>
      </defs>
    </svg>
  );
}
