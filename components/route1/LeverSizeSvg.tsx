const INK = "#16191D";
const ASH = "#5E6670";
const ACCENT = "#0E7A5A";
const LINE = "#E2E5E9";
const PAPER = "#FFFFFF";

const W = 720;
const H = 248;
const BAR_X = 56;
const BAR_W = 608;

type Row = {
  y: number;
  pctLabel: string;
  pct: number;
  title: string;
  sub: string;
  color: string;
  owner: string;
};

const ROWS: Row[] = [
  {
    y: 54,
    pct: 80,
    pctLabel: "75–85%",
    title: "Decided by when and how often devices are replaced",
    sub: "Locked in at manufacturing — a governance decision: lease terms, repair/retire criteria, support defaults",
    color: INK,
    owner: "Leadership, Finance, IT service lead",
  },
  {
    y: 150,
    pct: 20,
    pctLabel: "15–25%",
    title: "Everything desk-level behaviour can influence",
    sub: "Power settings, idle devices, printing habits — real, worth doing, and structurally capped at this size",
    color: ACCENT,
    owner: "Every employee",
  },
];

/** Block 4 — the two levers at true relative scale: the replacement decision vs. the behaviour ceiling. */
export function LeverSizeSvg() {
  return (
    <div>
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="w-full"
        role="img"
        aria-label="Of a device's lifetime carbon, 75 to 85 percent is governed by the replacement decision, while desk-level behaviour can influence only the remaining 15 to 25 percent."
      >
        <text x={BAR_X} y={26} fontSize="11.5" fontWeight={700} fill={INK}>
          The same 100% of a device&apos;s lifetime carbon — split by who actually controls it
        </text>

        {ROWS.map((r) => {
          const w = (r.pct / 100) * BAR_W;
          return (
            <g key={r.title}>
              {/* full-scale ghost so the two rows are visually comparable */}
              <rect x={BAR_X} y={r.y} width={BAR_W} height={44} rx={6} fill="#F5F6F7" stroke={LINE} strokeWidth={1} />
              <rect x={BAR_X} y={r.y} width={w} height={44} rx={6} fill={r.color} />
              <text x={BAR_X + 14} y={r.y + 27} fontSize="15" fontWeight={700} fill={PAPER}>
                {r.pctLabel}
              </text>
              <text x={BAR_X + w + 14} y={r.y + 19} fontSize="11" fontWeight={700} fill={INK}>
                {r.title}
              </text>
              <text x={BAR_X + w + 14} y={r.y + 33} fontSize="9.5" fill={ASH}>
                owner: {r.owner}
              </text>
              <text x={BAR_X} y={r.y + 60} fontSize="9.5" fill={ASH}>
                {r.sub}
              </text>
            </g>
          );
        })}

        <line x1={BAR_X + (20 / 100) * BAR_W} y1={150} x2={BAR_X + (20 / 100) * BAR_W} y2={212} stroke={ACCENT} strokeWidth={1.3} strokeDasharray="4 3" />
        <text x={BAR_X + (20 / 100) * BAR_W + 8} y={224} fontSize="9.5" fontWeight={700} fill={ACCENT}>
          the behaviour ceiling — nudges cannot cross this line
        </text>
      </svg>
      <p className="mt-1 text-center text-micro text-ash">
        Both levers are worth pulling. Only one of them decides whether the dominant footprint gets re-triggered at all.
      </p>
    </div>
  );
}
