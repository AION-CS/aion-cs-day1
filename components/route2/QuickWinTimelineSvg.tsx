const INK = "#16191D";
const ASH = "#5E6670";
const ACCENT = "#0E7A5A";
const DANGER = "#B23B3B";
const LINE = "#E2E5E9";

const W = 480;
const H = 220;
const PAD = 30;

/**
 * A branching timeline: the "quick win now" path rises fast then drops
 * sharply as hidden cost/risk surfaces; the "governance first" path rises
 * slower but stays stable and keeps climbing. Reusable at any size — the
 * full version in Block 5, a small reminder next to Stage 2 of Task 2.
 */
export function QuickWinTimelineSvg({ compact = false }: { compact?: boolean }) {
  const x0 = PAD;
  const xSplit = PAD + (W - 2 * PAD) * 0.3;
  const xEnd = W - PAD;
  const yStart = 150;

  const quickWinPath = `M${x0},${yStart} L${xSplit},60 L${xSplit + 60},40 L${xSplit + 110},170 L${xEnd},190`;
  const governancePath = `M${x0},${yStart} L${xSplit},130 L${xSplit + 70},108 L${xSplit + 150},70 L${xEnd},40`;

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full" role="img" aria-label="Quick win path rises then drops sharply; governance-first path rises slower but climbs steadily">
      <line x1={x0} y1={H - 20} x2={xEnd} y2={H - 20} stroke={LINE} strokeWidth={1.2} />
      {!compact && (
        <text x={(x0 + xEnd) / 2} y={H - 6} textAnchor="middle" fontSize="9.5" fill={ASH}>
          time
        </text>
      )}

      <path d={governancePath} fill="none" stroke={ACCENT} strokeWidth={2.4} />
      <path d={quickWinPath} fill="none" stroke={DANGER} strokeWidth={2.4} />

      <circle cx={xSplit} cy={130} r={3} fill={INK} />

      {!compact && (
        <>
          <text x={xEnd} y={36} textAnchor="end" fontSize="10.5" fontWeight={700} fill={ACCENT}>
            Governance first — slower, stable, keeps climbing
          </text>
          <text x={xSplit + 110} y={185} textAnchor="middle" fontSize="10.5" fontWeight={700} fill={DANGER}>
            Quick win now — fast, then a sharp correction
          </text>
          <text x={xSplit} y={148} textAnchor="middle" fontSize="8.5" fill={ASH}>
            paths diverge here
          </text>
        </>
      )}
    </svg>
  );
}
