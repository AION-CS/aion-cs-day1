export type RadarAxis = { id: string; label: string };
export type RadarSeries = {
  id: string;
  label: string;
  color: string;
  scores: Record<string, number>;
  /** SVG stroke-dasharray, e.g. "6 4" — lets series be told apart by line style, not colour alone. */
  dash?: string;
};

/**
 * Generic data-driven radar. When `weights` is supplied, each axis length is
 * scaled by (weight / evenWeight) on top of the raw score — so re-weighting
 * visibly stretches or shrinks individual axes, not just a hidden total.
 */
export function RadarChart({
  axes,
  series,
  weights,
  maxScore = 5,
  size = 280,
}: {
  axes: RadarAxis[];
  series: RadarSeries[];
  weights?: Record<string, number>;
  maxScore?: number;
  size?: number;
}) {
  const n = axes.length;
  const cx = size / 2;
  const cy = size / 2;
  const r = size / 2 - 34;
  const evenWeight = 100 / n;

  const angleFor = (i: number) => -Math.PI / 2 + (i * 2 * Math.PI) / n;
  const gridPoint = (i: number, frac: number): [number, number] => {
    const a = angleFor(i);
    return [cx + r * frac * Math.cos(a), cy + r * frac * Math.sin(a)];
  };
  const seriesPoint = (i: number, value: number): [number, number] => {
    const w = weights ? weights[axes[i].id] ?? evenWeight : evenWeight;
    const factor = Math.min(1.4, Math.max(0, (value / maxScore) * (w / evenWeight)));
    return gridPoint(i, factor);
  };

  return (
    <svg viewBox={`0 0 ${size} ${size}`} className="w-full" role="img" aria-label="Radar chart comparing options across criteria">
      {[0.25, 0.5, 0.75, 1].map((frac) => (
        <polygon
          key={frac}
          points={axes.map((_, i) => gridPoint(i, frac).join(",")).join(" ")}
          fill="none"
          stroke="#E2E5E9"
          strokeWidth={1}
        />
      ))}
      {axes.map((a, i) => {
        const [x, y] = gridPoint(i, 1);
        return <line key={a.id} x1={cx} y1={cy} x2={x} y2={y} stroke="#E2E5E9" strokeWidth={1} />;
      })}
      {series.map((s) => (
        <polygon
          key={s.id}
          points={axes.map((a, i) => seriesPoint(i, s.scores[a.id] ?? 0).join(",")).join(" ")}
          fill={s.color}
          fillOpacity={0.14}
          stroke={s.color}
          strokeWidth={2.25}
          strokeDasharray={s.dash}
        />
      ))}
      {axes.map((a, i) => {
        const [x, y] = gridPoint(i, 1.22);
        return (
          <text key={a.id} x={x} y={y} textAnchor="middle" fontSize="8.5" fill="#5E6670">
            {a.label.length > 16 ? `${a.label.slice(0, 15)}…` : a.label}
          </text>
        );
      })}
    </svg>
  );
}
