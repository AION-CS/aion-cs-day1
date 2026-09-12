const INK = "#16191D";
const ASH = "#5E6670";
const ACCENT = "#0E7A5A";
const LINE = "#E2E5E9";
const WARN = "#B87514";
const DANGER = "#B23B3B";
const PAPER = "#FFFFFF";

const W = 720;
const H = 340;

// --- Stacked lifetime split -------------------------------------------------
const BAR_X = 60;
const BAR_W = 600;
const BAR_Y = 52;
const BAR_H = 46;

type Seg = { label: string; pct: number; color: string };

const SEGMENTS: Seg[] = [
  { label: "Manufacturing", pct: 81.4, color: INK },
  { label: "Use phase", pct: 13.9, color: ACCENT },
  { label: "Transport", pct: 4.4, color: WARN },
  { label: "End-of-life", pct: 0.3, color: ASH },
];

// --- Annualised comparison --------------------------------------------------
const CMP_X = 196;
const CMP_W = 400;
const MAX_KG = 82;
const kgToW = (kg: number) => (kg / MAX_KG) * CMP_W;

const ROWS = [
  { label: "4-year service life", kg: 74.7, y: 208, color: DANGER },
  { label: "6-year service life", kg: 53.1, y: 256, color: ACCENT },
];

/** Block 2 — where a laptop's lifetime carbon sits, and what extending service life does to the annual figure. */
export function LifecycleCarbonSvg() {
  let cursor = BAR_X;

  return (
    <div>
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="w-full"
        role="img"
        aria-label="A business laptop's lifetime carbon splits 81.4 percent manufacturing, 13.9 percent use phase, 4.4 percent transport, 0.3 percent end-of-life. Extending service life from four to six years lowers annual emissions from 74.7 to 53.1 kilograms CO2 equivalent, a 29 percent reduction."
      >
        <text x={BAR_X} y={26} fontSize="11.5" fontWeight={700} fill={INK}>
          Total lifetime carbon of one 14&quot; business laptop — where it is actually spent
        </text>

        {SEGMENTS.map((s) => {
          const w = (s.pct / 100) * BAR_W;
          const x = cursor;
          cursor += w;
          return (
            <g key={s.label}>
              <rect x={x} y={BAR_Y} width={w} height={BAR_H} fill={s.color} />
              {s.pct > 10 && (
                <>
                  <text x={x + w / 2} y={BAR_Y + 21} textAnchor="middle" fontSize="11" fontWeight={700} fill={PAPER}>
                    {s.label}
                  </text>
                  <text x={x + w / 2} y={BAR_Y + 35} textAnchor="middle" fontSize="11" fill={PAPER} opacity={0.9}>
                    {s.pct}%
                  </text>
                </>
              )}
            </g>
          );
        })}
        <rect x={BAR_X} y={BAR_Y} width={BAR_W} height={BAR_H} fill="none" stroke={LINE} strokeWidth={1} />

        {/* Leader lines for the two slivers */}
        <line x1={BAR_X + (95.3 / 100) * BAR_W} y1={BAR_Y + BAR_H} x2={BAR_X + (95.3 / 100) * BAR_W} y2={BAR_Y + BAR_H + 18} stroke={WARN} strokeWidth={1.2} />
        <text x={BAR_X + (95.3 / 100) * BAR_W - 4} y={BAR_Y + BAR_H + 30} textAnchor="end" fontSize="9.5" fill={WARN}>
          Transport 4.4%
        </text>
        <line x1={BAR_X + BAR_W - 2} y1={BAR_Y} x2={BAR_X + BAR_W - 2} y2={BAR_Y - 16} stroke={ASH} strokeWidth={1.2} />
        <text x={BAR_X + BAR_W} y={BAR_Y - 20} textAnchor="end" fontSize="9.5" fill={ASH}>
          End-of-life 0.3%
        </text>

        <text x={BAR_X} y={152} fontSize="10.5" fill={ASH}>
          Spent before the device is ever switched on — and re-spent in full by every replacement.
        </text>

        <line x1={BAR_X} y1={170} x2={BAR_X + BAR_W} y2={170} stroke={LINE} strokeWidth={1} />

        <text x={BAR_X} y={192} fontSize="11.5" fontWeight={700} fill={INK}>
          Same hardware, same footprint — spread over more years of use
        </text>

        {ROWS.map((r) => (
          <g key={r.label}>
            <text x={CMP_X - 12} y={r.y + 21} textAnchor="end" fontSize="11" fontWeight={700} fill={INK}>
              {r.label}
            </text>
            <rect x={CMP_X} y={r.y} width={CMP_W} height={32} rx={5} fill="#F5F6F7" />
            <rect x={CMP_X} y={r.y} width={kgToW(r.kg)} height={32} rx={5} fill={r.color} opacity={0.88} />
            <text x={CMP_X + kgToW(r.kg) + 10} y={r.y + 21} fontSize="11" fontWeight={700} fill={r.color}>
              {r.kg} kg CO₂e / year
            </text>
          </g>
        ))}

        {/* −29% bracket */}
        <path
          d={`M ${CMP_X + kgToW(53.1)} ${ROWS[1].y - 6} L ${CMP_X + kgToW(74.7)} ${ROWS[1].y - 6}`}
          stroke={ACCENT}
          strokeWidth={1.4}
          strokeDasharray="4 3"
          fill="none"
        />
        <text x={CMP_X + kgToW(63.9)} y={ROWS[1].y - 12} textAnchor="middle" fontSize="10.5" fontWeight={700} fill={ACCENT}>
          −29% per year
        </text>
      </svg>
      <div className="mt-1 grid gap-1 text-micro text-ash sm:grid-cols-2">
        <p>
          <span className="font-semibold text-ink">Split source:</span> detailed model of a 14&quot; business notebook;
          Dell / HP / Lenovo assessments converge on 75–85% manufacturing.
        </p>
        <p>
          <span className="font-semibold text-ink">Annual figures:</span> TCO Certified &amp; Öko-Institut review of 15
          notebook footprint reports.
        </p>
      </div>
    </div>
  );
}
