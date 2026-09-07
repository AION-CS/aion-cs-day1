const INK = "#16191D";
const ASH = "#5E6670";
const ACCENT = "#0E7A5A";
const LINE = "#E2E5E9";
const WARN = "#B87514";

const W = 720;
const BAR_H = 34;
const MAX_PUE = 2.4;
const CHART_L = 190;
const CHART_R = 60;
const CHART_W = W - CHART_L - CHART_R;
const xFor = (v: number) => CHART_L + (v / MAX_PUE) * CHART_W;

type Row = { label: string; sub: string; low: number; high: number; color: string; y: number };

const ROWS: Row[] = [
  { label: "Leading hyperscale", sub: "as low as 1.08, typically 1.1–1.2", low: 1.08, high: 1.2, color: ACCENT, y: 40 },
  { label: "Industry-wide average", sub: "1.52 overall (1.36 size-weighted)", low: 1.36, high: 1.52, color: WARN, y: 100 },
  { label: "Average enterprise-owned facility", sub: "≈ 2.1 — over half lost to overhead", low: 1.9, high: 2.1, color: "#B23B3B", y: 160 },
];

/** Block 2 — hyperscale vs. industry-average vs. enterprise PUE, as three annotated bars on one shared scale. */
export function ScaleGaugeSvg() {
  return (
    <div>
      <svg viewBox={`0 0 ${W} 210`} className="w-full" role="img" aria-label="PUE comparison: leading hyperscale facilities near 1.1, industry average 1.52, average enterprise facility 2.1">
        {[1.0, 1.2, 1.4, 1.6, 1.8, 2.0, 2.2, 2.4].map((v) => (
          <line key={v} x1={xFor(v)} y1={20} x2={xFor(v)} y2={190} stroke={LINE} strokeWidth={1} />
        ))}
        {[1.0, 1.2, 1.4, 1.6, 1.8, 2.0, 2.2, 2.4].map((v) => (
          <text key={v} x={xFor(v)} y={202} textAnchor="middle" fontSize="9" fill={ASH}>
            {v.toFixed(1)}
          </text>
        ))}

        {ROWS.map((row) => (
          <g key={row.label}>
            <text x={CHART_L - 12} y={row.y + BAR_H / 2 + 4} textAnchor="end" fontSize="11.5" fontWeight={700} fill={INK}>
              {row.label}
            </text>
            <rect x={CHART_L} y={row.y} width={CHART_W} height={BAR_H} rx={6} fill="#F5F6F7" />
            <rect
              x={xFor(row.low)}
              y={row.y}
              width={Math.max(4, xFor(row.high) - xFor(row.low))}
              height={BAR_H}
              rx={6}
              fill={row.color}
              opacity={0.85}
            />
            <text x={xFor(row.high) + 10} y={row.y + BAR_H / 2 + 4} fontSize="10.5" fontWeight={700} fill={row.color}>
              {row.low.toFixed(2)}–{row.high.toFixed(2)}
            </text>
          </g>
        ))}
      </svg>
      <div className="mt-1 grid gap-1 text-center text-micro text-ash sm:grid-cols-3">
        {ROWS.map((row) => (
          <p key={row.label}>
            <span className="font-semibold" style={{ color: row.color }}>
              {row.label}:
            </span>{" "}
            {row.sub}
          </p>
        ))}
      </div>
    </div>
  );
}
