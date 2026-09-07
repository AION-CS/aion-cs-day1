const INK = "#16191D";
const ASH = "#5E6670";
const ACCENT = "#0E7A5A";
const WARN = "#B87514";
const DANGER = "#B23B3B";
const PAPER = "#FFFFFF";

const TIERS = [
  { id: "no-regret", label: "No-Regret Moves", desc: "Worth taking in essentially every scenario — low cost, minimal downside.", color: ACCENT, w: 460 },
  { id: "options", label: "Options", desc: "Small, reversible steps that keep valuable choices open for later.", color: WARN, w: 340 },
  { id: "big-bets", label: "Big Bets", desc: "Large, largely irreversible commitments made on a specific bet about the future.", color: DANGER, w: 220 },
] as const;

const ROW_H = 74;
const GAP = 6;
const W = 520;

/** Block 3 — a 3-tier pyramid: no-regret moves at the base, options above, big bets at the narrow top. */
export function NoRegretPyramidSvg() {
  const totalH = TIERS.length * (ROW_H + GAP);
  return (
    <div>
      <svg viewBox={`0 0 ${W} ${totalH + 10}`} className="w-full" role="img" aria-label="Pyramid: no-regret moves at the base, options in the middle, big bets at the top">
        {[...TIERS].reverse().map((tier, idx) => {
          const i = TIERS.length - 1 - idx;
          const y = i * (ROW_H + GAP);
          const x = (W - tier.w) / 2;
          return (
            <g key={tier.id}>
              <rect x={x} y={y} width={tier.w} height={ROW_H} rx={10} fill={PAPER} stroke={tier.color} strokeWidth={2} />
              <text x={W / 2} y={y + ROW_H / 2 + 5} textAnchor="middle" fontSize="14" fontWeight={700} fill={tier.color}>
                {tier.label}
              </text>
            </g>
          );
        })}
      </svg>
      <div className="mt-2 space-y-1.5">
        {TIERS.map((tier) => (
          <p key={tier.id} className="text-micro text-ash">
            <span className="font-semibold" style={{ color: tier.color }}>
              {tier.label}:
            </span>{" "}
            {tier.desc}
          </p>
        ))}
      </div>
    </div>
  );
}
