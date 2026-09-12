import type { ZoneId } from "@/lib/route1";

const INK = "#16191D";
const ASH = "#5E6670";
const ACCENT = "#0E7A5A";
const LINE = "#E2E5E9";
const WARN = "#B87514";

const W = 320;
const H = 150;

const s = { stroke: ASH, strokeWidth: 1.4, fill: "none", strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
const bold = { ...s, stroke: INK, strokeWidth: 1.6 };

const SCENES: Record<ZoneId, { art: React.ReactNode; caption: string }> = {
  storage: {
    caption: "Three replacement rounds, one unlogged room.",
    art: (
      <>
        {/* shelving */}
        <line x1={40} y1={34} x2={214} y2={34} {...bold} />
        <line x1={40} y1={74} x2={214} y2={74} {...bold} />
        <line x1={40} y1={114} x2={214} y2={114} {...bold} />
        <line x1={40} y1={26} x2={40} y2={122} {...bold} />
        <line x1={214} y1={26} x2={214} y2={122} {...bold} />
        {/* stacked docks + monitors */}
        <rect x={48} y={16} width={34} height={18} {...s} />
        <rect x={88} y={20} width={26} height={14} {...s} />
        <rect x={122} y={14} width={40} height={20} {...s} />
        <rect x={52} y={54} width={44} height={20} {...s} />
        <rect x={104} y={50} width={36} height={24} {...s} />
        <rect x={150} y={58} width={30} height={16} {...s} />
        <rect x={56} y={92} width={48} height={22} {...s} />
        <rect x={114} y={96} width={34} height={18} {...s} />
        {/* cable box, uncatalogued */}
        <rect x={238} y={92} width={58} height={30} rx={2} {...s} />
        <path d="M246 92 Q252 78 262 88 Q272 98 282 84" {...s} />
        <text x={267} y={138} textAnchor="middle" fontSize="8.5" fill={WARN}>
          not catalogued
        </text>
        <circle cx={267} cy={36} r={9} {...s} />
        <line x1={267} y1={20} x2={267} y2={27} {...s} />
      </>
    ),
  },
  finance: {
    caption: "The cycle lives in a contract, not in a condition report.",
    art: (
      <>
        {/* desk */}
        <line x1={24} y1={122} x2={296} y2={122} {...bold} />
        {/* laptop */}
        <path d="M44 112 L64 70 L126 70 L146 112 Z" {...s} />
        <rect x={64} y={70} width={62} height={0.1} {...s} />
        <rect x={70} y={44} width={50} height={28} rx={2} {...s} />
        {/* lease stack */}
        <rect x={166} y={96} width={66} height={8} {...s} />
        <rect x={162} y={104} width={74} height={8} {...s} />
        <rect x={168} y={112} width={62} height={8} {...s} />
        <text x={199} y={90} textAnchor="middle" fontSize="8.5" fill={ASH}>
          leasing contract
        </text>
        {/* calendar with repeating 3-year marks */}
        <rect x={246} y={30} width={54} height={48} rx={3} {...s} />
        <line x1={246} y1={42} x2={300} y2={42} {...s} />
        {[0, 1, 2].map((i) => (
          <g key={i}>
            <circle cx={258 + i * 16} cy={56} r={5} fill={WARN} opacity={0.25} stroke="none" />
            <text x={258 + i * 16} y={59} textAnchor="middle" fontSize="7" fill={WARN}>
              3y
            </text>
          </g>
        ))}
        <text x={273} y={72} textAnchor="middle" fontSize="7.5" fill={ASH}>
          repeat, regardless
        </text>
      </>
    ),
  },
  workspace: {
    caption: "21:40 on a Thursday. Badges out, machines awake.",
    art: (
      <>
        {/* window with night sky */}
        <rect x={214} y={20} width={86} height={70} rx={3} {...s} />
        <line x1={257} y1={20} x2={257} y2={90} {...s} />
        <circle cx={236} cy={38} r={5} {...s} />
        <circle cx={280} cy={52} r={1.6} fill={ASH} stroke="none" />
        <circle cx={270} cy={34} r={1.3} fill={ASH} stroke="none" />
        {/* desks with lit screens */}
        {[0, 1, 2].map((i) => {
          const x = 28 + i * 62;
          const lit = i !== 1;
          return (
            <g key={i}>
              <rect x={x} y={62} width={44} height={28} rx={2} {...s} />
              <rect x={x + 5} y={67} width={34} height={18} fill={lit ? ACCENT : "none"} opacity={lit ? 0.22 : 1} stroke={lit ? ACCENT : LINE} strokeWidth={1.2} />
              <line x1={x + 22} y1={90} x2={x + 22} y2={100} {...s} />
              <line x1={x + 6} y1={118} x2={x + 38} y2={118} {...bold} />
              {lit && (
                <text x={x + 22} y={112} textAnchor="middle" fontSize="7.5" fill={ACCENT}>
                  on
                </text>
              )}
            </g>
          );
        })}
        <text x={160} y={138} textAnchor="middle" fontSize="8.5" fill={WARN}>
          22% still powered on and undocked
        </text>
      </>
    ),
  },
  print: {
    caption: "40,000 pages a month, and no default anyone set.",
    art: (
      <>
        <line x1={24} y1={126} x2={296} y2={126} {...bold} />
        {/* printer */}
        <rect x={74} y={52} width={104} height={56} rx={5} {...bold} />
        <rect x={96} y={32} width={60} height={20} rx={2} {...s} />
        <line x1={88} y1={78} x2={164} y2={78} {...s} />
        <rect x={104} y={108} width={46} height={12} {...s} />
        {/* output stack */}
        <rect x={190} y={96} width={54} height={6} {...s} />
        <rect x={186} y={102} width={62} height={6} {...s} />
        <rect x={192} y={108} width={50} height={6} {...s} />
        <rect x={188} y={114} width={58} height={6} {...s} />
        <text x={217} y={90} textAnchor="middle" fontSize="8" fill={ASH}>
          single-sided
        </text>
        {/* paper cupboard */}
        <rect x={28} y={62} width={34} height={58} rx={2} {...s} />
        <line x1={28} y1={90} x2={62} y2={90} {...s} />
        {/* recycling bin, too full */}
        <path d="M262 120 L268 88 L296 88 L290 120 Z" {...s} />
        <path d="M272 84 Q279 74 286 84" {...s} />
        <text x={279} y={136} textAnchor="middle" fontSize="8" fill={WARN}>
          fuller than it should be
        </text>
      </>
    ),
  },
  helpdesk: {
    caption: "A spare on the shelf is always faster than a repair ticket.",
    art: (
      <>
        {/* ticket monitor */}
        <rect x={24} y={22} width={78} height={48} rx={3} {...s} />
        {[0, 1, 2].map((i) => (
          <line key={i} x1={34} y1={36 + i * 12} x2={92 - i * 10} y2={36 + i * 12} {...s} />
        ))}
        <text x={63} y={82} textAnchor="middle" fontSize="7.5" fill={ASH}>
          ticket queue
        </text>
        {/* counter */}
        <rect x={28} y={96} width={132} height={30} rx={3} {...bold} />
        <line x1={28} y1={108} x2={160} y2={108} {...s} />
        {/* shelf of spares */}
        <rect x={196} y={24} width={100} height={102} rx={3} {...bold} />
        <line x1={196} y1={58} x2={296} y2={58} {...s} />
        <line x1={196} y1={92} x2={296} y2={92} {...s} />
        {[0, 1, 2].map((row) =>
          [0, 1].map((col) => (
            <rect key={`${row}-${col}`} x={208 + col * 44} y={32 + row * 34} width={34} height={18} rx={2} {...s} />
          )),
        )}
        <text x={246} y={140} textAnchor="middle" fontSize="8.5" fill={WARN}>
          spares, always in stock
        </text>
      </>
    ),
  },
  onboarding: {
    caption: "Day one teaches every new hire what normal looks like here.",
    art: (
      <>
        <line x1={24} y1={124} x2={296} y2={124} {...bold} />
        {/* new laptop box with ribbon */}
        <rect x={40} y={70} width={86} height={54} rx={4} {...bold} />
        <line x1={40} y1={88} x2={126} y2={88} {...s} />
        <line x1={83} y1={70} x2={83} y2={124} {...s} />
        <path d="M68 70 Q83 48 98 70" {...s} />
        <text x={83} y={64} textAnchor="middle" fontSize="8" fill={ACCENT}>
          brand new
        </text>
        {/* peripheral set laid out */}
        <rect x={148} y={62} width={54} height={34} rx={2} {...s} />
        <line x1={175} y1={96} x2={175} y2={104} {...s} />
        <line x1={162} y1={104} x2={188} y2={104} {...s} />
        <rect x={148} y={110} width={46} height={12} rx={2} {...s} />
        <circle cx={206} cy={116} r={6} {...s} />
        <rect x={216} y={74} width={28} height={22} rx={2} {...s} />
        <text x={196} y={54} textAnchor="middle" fontSize="8" fill={ASH}>
          full set, by default
        </text>
        {/* welcome card */}
        <path d="M258 124 L258 92 L296 92 L296 124 Z" {...s} />
        <path d="M258 92 L277 108 L296 92" {...s} />
        <text x={277} y={138} textAnchor="middle" fontSize="8" fill={ASH}>
          welcome
        </text>
      </>
    ),
  },
};

/** Scene illustration behind a zone's finding — one hand-coded vignette per room. */
export function ZoneVignette({ id }: { id: ZoneId }) {
  const scene = SCENES[id];
  return (
    <div>
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full" role="img" aria-label={scene.caption}>
        <rect x={0} y={0} width={W} height={H} rx={8} fill="#F5F6F7" />
        {scene.art}
      </svg>
    </div>
  );
}
