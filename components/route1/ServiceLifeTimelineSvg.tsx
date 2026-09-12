const INK = "#16191D";
const ASH = "#5E6670";
const ACCENT = "#0E7A5A";
const LINE = "#E2E5E9";
const DANGER = "#B23B3B";

const W = 720;
const H = 236;
const AXIS_L = 182;
const AXIS_R = 676;
const MAX_YR = 8;
const xFor = (yr: number) => AXIS_L + (yr / MAX_YR) * (AXIS_R - AXIS_L);

const TECH_Y = 54;
const PERM_Y = 136;
const BAR_H = 38;

/** Block 3 — technical vs. organisationally permitted service life, and the gap between them. */
export function ServiceLifeTimelineSvg() {
  return (
    <div>
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="w-full"
        role="img"
        aria-label="Technical service life of a business laptop runs five to seven years, while organisationally permitted service life is commonly fixed at three years. The three-to-seven-year span between them is the lifetime-extension opportunity."
      >
        {/* gap shading */}
        <rect x={xFor(3)} y={TECH_Y - 14} width={xFor(6.5) - xFor(3)} height={PERM_Y + BAR_H + 14 - (TECH_Y - 14)} fill={ACCENT} opacity={0.08} />
        <line x1={xFor(3)} y1={TECH_Y - 14} x2={xFor(3)} y2={PERM_Y + BAR_H + 14} stroke={ACCENT} strokeWidth={1.3} strokeDasharray="5 4" />
        <line x1={xFor(6.5)} y1={TECH_Y - 14} x2={xFor(6.5)} y2={PERM_Y + BAR_H + 14} stroke={ACCENT} strokeWidth={1.3} strokeDasharray="5 4" />

        {/* technical service life */}
        <text x={AXIS_L - 14} y={TECH_Y + 17} textAnchor="end" fontSize="11.5" fontWeight={700} fill={INK}>
          Technical service life
        </text>
        <text x={AXIS_L - 14} y={TECH_Y + 31} textAnchor="end" fontSize="9" fill={ASH}>
          what the hardware can do
        </text>
        <rect x={xFor(0)} y={TECH_Y} width={xFor(5) - xFor(0)} height={BAR_H} rx={5} fill={ACCENT} opacity={0.85} />
        <rect x={xFor(5)} y={TECH_Y} width={xFor(7) - xFor(5)} height={BAR_H} rx={5} fill={ACCENT} opacity={0.32} />
        <text x={xFor(7) + 8} y={TECH_Y + 23} fontSize="10.5" fontWeight={700} fill={ACCENT}>
          5–7 yrs
        </text>

        {/* permitted service life */}
        <text x={AXIS_L - 14} y={PERM_Y + 17} textAnchor="end" fontSize="11.5" fontWeight={700} fill={INK}>
          Permitted service life
        </text>
        <text x={AXIS_L - 14} y={PERM_Y + 31} textAnchor="end" fontSize="9" fill={ASH}>
          what policy allows
        </text>
        <rect x={xFor(0)} y={PERM_Y} width={xFor(3) - xFor(0)} height={BAR_H} rx={5} fill={DANGER} opacity={0.85} />
        <text x={xFor(3) + 8} y={PERM_Y + 23} fontSize="10.5" fontWeight={700} fill={DANGER}>
          3 yrs — set by lease, not by condition
        </text>

        {/* gap label */}
        <text x={(xFor(3) + xFor(6.5)) / 2} y={PERM_Y - 16} textAnchor="middle" fontSize="11" fontWeight={700} fill={ACCENT}>
          Lifetime-extension opportunity
        </text>
        <text x={(xFor(3) + xFor(6.5)) / 2} y={PERM_Y - 4} textAnchor="middle" fontSize="9" fill={ASH}>
          unlocked by criteria, spare parts and a repair-first default
        </text>

        {/* axis */}
        <line x1={AXIS_L} y1={PERM_Y + BAR_H + 22} x2={AXIS_R} y2={PERM_Y + BAR_H + 22} stroke={LINE} strokeWidth={1.2} />
        {Array.from({ length: MAX_YR + 1 }, (_, i) => i).map((yr) => (
          <g key={yr}>
            <line x1={xFor(yr)} y1={PERM_Y + BAR_H + 22} x2={xFor(yr)} y2={PERM_Y + BAR_H + 27} stroke={LINE} strokeWidth={1.2} />
            <text x={xFor(yr)} y={PERM_Y + BAR_H + 38} textAnchor="middle" fontSize="9" fill={ASH}>
              {yr}
            </text>
          </g>
        ))}
        <text x={AXIS_R} y={PERM_Y + BAR_H + 12} textAnchor="end" fontSize="9" fill={ASH}>
          years in service
        </text>
      </svg>
      <p className="mt-1 text-center text-micro text-ash">
        UrbanByte sits exactly here: healthy hardware returned at the red line, because nothing in policy lets it stay.
      </p>
    </div>
  );
}
