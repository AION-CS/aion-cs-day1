import { DIMENSIONS, type DimensionId } from "@/lib/route1";

const INK = "#16191D";
const ASH = "#5E6670";
const ACCENT = "#0E7A5A";
const LINE = "#E2E5E9";
const ACCENT_SOFT = "#E7F2EC";

/**
 * Rounded to 2dp so server- and client-rendered markup always match exactly
 * — Math.cos/sin can differ in their last floating-point digit between
 * Node's and the browser's runtime, which otherwise trips a hydration
 * mismatch warning on every reload.
 */
const round = (n: number) => Math.round(n * 100) / 100;

/** Regular hexagon vertices, flat point facing up, matching DIMENSIONS order. */
function vertex(cx: number, cy: number, r: number, i: number): [number, number] {
  const a = (-90 + i * 60) * (Math.PI / 180);
  return [round(cx + r * Math.cos(a)), round(cy + r * Math.sin(a))];
}

/**
 * The 6-Dimension Wheel — a hexagon cut into 6 triangular segments from the
 * centre, one per DIMENSIONS entry. Purely presentational: it reflects
 * `counts`/`highlightedId` but owns no state. Used two ways:
 *  - Materials summary (read-only, no counts): a labelled legend of the
 *    framework.
 *  - Stage 2 (interactive): the parent renders real HTML drop zones below
 *    it (same pattern as the technical/governance split) and passes live
 *    per-dimension counts here so the wheel visually reflects placements.
 *    `data-dropzone` is still set on each wedge so tapping/dropping directly
 *    on the wheel also works, matching Stage 2's own zones below it.
 */
export function DimensionWheel({
  size = 320,
  counts,
  highlightedId,
  interactive = false,
}: {
  size?: number;
  counts?: Partial<Record<DimensionId, number>>;
  highlightedId?: DimensionId | null;
  interactive?: boolean;
}) {
  const cx = size / 2;
  const cy = size / 2;
  const r = size / 2 - 46;
  const labelR = r * 0.66;
  const countR = r * 0.94;

  return (
    <svg viewBox={`0 0 ${size} ${size}`} className="w-full" role="img" aria-label="The six-dimension assessment wheel: Scalability, Cost, Controllability, Sustainability, Governance, Dependencies">
      {DIMENSIONS.map((d, i) => {
        const [x1, y1] = vertex(cx, cy, r, i);
        const [x2, y2] = vertex(cx, cy, r, i + 1);
        const midAngle = (-90 + i * 60 + 30) * (Math.PI / 180);
        const labelX = round(cx + labelR * Math.cos(midAngle));
        const labelY = round(cy + labelR * Math.sin(midAngle));
        const countX = round(cx + countR * Math.cos(midAngle));
        const countY = round(cy + countR * Math.sin(midAngle));
        const count = counts?.[d.id] ?? 0;
        const active = highlightedId === d.id;
        const filled = count > 0;

        return (
          <g key={d.id}>
            <path
              d={`M${cx},${cy} L${x1},${y1} L${x2},${y2} Z`}
              data-dropzone={interactive ? d.id : undefined}
              fill={active ? ACCENT_SOFT : filled ? "#F3F9F6" : "#FFFFFF"}
              stroke={active ? ACCENT : LINE}
              strokeWidth={active ? 2 : 1.4}
              className={interactive ? "cursor-pointer transition-colors duration-150" : undefined}
            />
            <text x={labelX} y={labelY - 4} textAnchor="middle" fontSize={size < 260 ? "9.5" : "11"} fontWeight={700} fill={INK}>
              {d.label}
            </text>
            {counts && (
              <g>
                <circle cx={countX} cy={countY} r={10} fill={count > 0 ? ACCENT : LINE} />
                <text x={countX} y={countY + 3.5} textAnchor="middle" fontSize="9.5" fontWeight={700} fill={count > 0 ? "#FFFFFF" : ASH}>
                  {count}
                </text>
              </g>
            )}
          </g>
        );
      })}

      {/* Hexagon outline on top so seams read cleanly */}
      <polygon
        points={DIMENSIONS.map((_, i) => vertex(cx, cy, r, i).join(",")).join(" ")}
        fill="none"
        stroke={INK}
        strokeWidth={1.4}
      />

      <circle cx={cx} cy={cy} r={3} fill={ASH} />
    </svg>
  );
}
