/**
 * Route 2's material visuals. Co-located in one file because they share the
 * same token constants and are all read-only illustrations — the interactive
 * SVGs (the matrix, the weighted bars) live with their own components.
 */

const INK = "#16191D";
const ASH = "#5E6670";
const ACCENT = "#0E7A5A";
const LINE = "#E2E5E9";
const WARN = "#B87514";
const DANGER = "#B23B3B";
const PAPER = "#FFFFFF";

// ---------------------------------------------------------------------------
// Block 1 — three measures, two axes each
// ---------------------------------------------------------------------------
const COLS = [
  { id: "A", title: "A · Lifetime extension", visibility: 20, leverage: 90, note: "correct and most likely to be rejected" },
  { id: "B", title: "B · Behaviour programme", visibility: 65, leverage: 25, note: "cheap, popular, structurally capped" },
  { id: "C", title: "C · Efficient replacement", visibility: 95, leverage: 20, note: "looks best on the slide, worst on the number" },
];

export function ThreeMeasureComparisonSvg() {
  const W = 720;
  const H = 300;
  const colW = 200;
  const gap = 30;
  const baseY = 210;
  const maxH = 140;

  return (
    <div>
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full" role="img" aria-label="Comparison of three measures on visibility of result versus structural leverage. Lifetime extension is low visibility and high leverage; the behaviour programme is moderately visible with low leverage; efficient replacement is highly visible with low leverage.">
        {COLS.map((c, i) => {
          const x = 40 + i * (colW + gap);
          const visH = (c.visibility / 100) * maxH;
          const levH = (c.leverage / 100) * maxH;
          return (
            <g key={c.id}>
              <text x={x + colW / 2} y={24} textAnchor="middle" fontSize="11.5" fontWeight={700} fill={INK}>
                {c.title}
              </text>
              <rect x={x + 22} y={baseY - visH} width={62} height={visH} rx={4} fill={WARN} opacity={0.85} />
              <rect x={x + 112} y={baseY - levH} width={62} height={levH} rx={4} fill={ACCENT} opacity={0.9} />
              <text x={x + 53} y={baseY - visH - 6} textAnchor="middle" fontSize="10" fontWeight={700} fill={WARN}>
                {c.visibility}
              </text>
              <text x={x + 143} y={baseY - levH - 6} textAnchor="middle" fontSize="10" fontWeight={700} fill={ACCENT}>
                {c.leverage}
              </text>
              <text x={x + 53} y={baseY + 14} textAnchor="middle" fontSize="8.5" fill={ASH}>
                visibility
              </text>
              <text x={x + 143} y={baseY + 14} textAnchor="middle" fontSize="8.5" fill={ASH}>
                leverage
              </text>
              <text x={x + colW / 2} y={baseY + 38} textAnchor="middle" fontSize="9" fill={ASH}>
                {c.note}
              </text>
            </g>
          );
        })}
        <line x1={30} y1={baseY} x2={W - 30} y2={baseY} stroke={LINE} strokeWidth={1.4} />
        <text x={W / 2} y={H - 12} textAnchor="middle" fontSize="9.5" fill={ASH}>
          Visibility and structural leverage are close to uncorrelated — which is exactly what makes intuition unreliable here.
        </text>
      </svg>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Block 2 — the five-step MCDA flow, with step 2 called out
// ---------------------------------------------------------------------------
const STEPS = ["Define criteria", "Assign weights", "Score options", "Compute totals", "Stress-test"];

export function McdaFlowSvg() {
  const W = 720;
  const H = 190;
  const boxW = 118;
  const gap = 24;
  const y = 74;

  return (
    <div>
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full" role="img" aria-label="Five-step multi-criteria decision analysis flow: define criteria, assign weights, score options, compute totals, stress-test. Step two, assigning weights, is where most of the judgement sits.">
        {STEPS.map((s, i) => {
          const x = 22 + i * (boxW + gap);
          const isWeights = i === 1;
          return (
            <g key={s}>
              <rect
                x={x}
                y={y}
                width={boxW}
                height={54}
                rx={9}
                fill={isWeights ? "#E7F2EC" : PAPER}
                stroke={isWeights ? ACCENT : LINE}
                strokeWidth={isWeights ? 2 : 1.4}
              />
              <text x={x + boxW / 2} y={y + 24} textAnchor="middle" fontSize="9.5" fontWeight={700} fill={ASH}>
                {i + 1}
              </text>
              <text x={x + boxW / 2} y={y + 40} textAnchor="middle" fontSize="10.5" fontWeight={700} fill={INK}>
                {s}
              </text>
              {i < STEPS.length - 1 && (
                <path
                  d={`M ${x + boxW + 4} ${y + 27} L ${x + boxW + gap - 6} ${y + 27}`}
                  stroke={LINE}
                  strokeWidth={1.6}
                  markerEnd=""
                />
              )}
              {i < STEPS.length - 1 && (
                <path d={`M ${x + boxW + gap - 10} ${y + 23} L ${x + boxW + gap - 5} ${y + 27} L ${x + boxW + gap - 10} ${y + 31}`} fill="none" stroke={LINE} strokeWidth={1.6} />
              )}
            </g>
          );
        })}
        <path d={`M ${22 + boxW + gap + boxW / 2} ${y - 8} L ${22 + boxW + gap + boxW / 2} ${y - 30}`} stroke={ACCENT} strokeWidth={1.4} strokeDasharray="4 3" />
        <text x={22 + boxW + gap + boxW / 2} y={y - 36} textAnchor="middle" fontSize="10.5" fontWeight={700} fill={ACCENT}>
          most judgement sits here
        </text>
        <text x={W / 2} y={H - 14} textAnchor="middle" fontSize="9.5" fill={ASH}>
          Identical scores plus different weights produce opposite recommendations — which is the method working, not failing.
        </text>
      </svg>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Block 3a — the two cost curves that disagree
// ---------------------------------------------------------------------------
export function EacCurveSvg() {
  const W = 720;
  const H = 280;
  const L = 78;
  const R = 640;
  const T = 36;
  const B = 214;
  const xFor = (yr: number) => L + ((yr - 1) / 6) * (R - L);
  const yFor = (v: number) => B - (v / 100) * (B - T);

  const reactive = [
    [1, 38],
    [2, 40],
    [3, 46],
    [4, 62],
    [5, 78],
    [6, 90],
    [7, 96],
  ];
  const maintained = [
    [1, 38],
    [2, 37],
    [3, 38],
    [4, 40],
    [5, 42],
    [6, 44],
    [7, 47],
  ];
  const path = (pts: number[][]) => pts.map((p, i) => `${i === 0 ? "M" : "L"} ${xFor(p[0])} ${yFor(p[1])}`).join(" ");

  return (
    <div>
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full" role="img" aria-label="Two illustrative annual-cost-per-device curves against device age. Under a reactive support regime with no condition data, cost rises steeply after year three. Under maintained business-grade hardware with condition monitoring, cost stays close to flat. The gap between them is where the industry debate lives.">
        <line x1={L} y1={B} x2={R} y2={B} stroke={LINE} strokeWidth={1.3} />
        <line x1={L} y1={T} x2={L} y2={B} stroke={LINE} strokeWidth={1.3} />
        {[1, 2, 3, 4, 5, 6, 7].map((yr) => (
          <g key={yr}>
            <line x1={xFor(yr)} y1={B} x2={xFor(yr)} y2={B + 5} stroke={LINE} strokeWidth={1.2} />
            <text x={xFor(yr)} y={B + 18} textAnchor="middle" fontSize="9" fill={ASH}>
              {yr}
            </text>
          </g>
        ))}
        <text x={(L + R) / 2} y={B + 34} textAnchor="middle" fontSize="9.5" fill={ASH}>
          device age (years)
        </text>
        <text transform={`translate(${L - 46}, ${(T + B) / 2}) rotate(-90)`} textAnchor="middle" fontSize="9.5" fill={ASH}>
          annual cost per device
        </text>

        {/* the gap */}
        <path
          d={`${path(reactive)} L ${xFor(7)} ${yFor(47)} ${[...maintained].reverse().map((p) => `L ${xFor(p[0])} ${yFor(p[1])}`).join(" ")} Z`}
          fill={WARN}
          opacity={0.1}
        />

        <path d={path(reactive)} fill="none" stroke={DANGER} strokeWidth={2.2} />
        <path d={path(maintained)} fill="none" stroke={ACCENT} strokeWidth={2.2} />

        <text x={xFor(7) - 6} y={yFor(96) - 8} textAnchor="end" fontSize="10" fontWeight={700} fill={DANGER}>
          reactive support, no condition data
        </text>
        <text x={xFor(7) - 6} y={yFor(47) + 18} textAnchor="end" fontSize="10" fontWeight={700} fill={ACCENT}>
          maintained business-grade, condition-monitored
        </text>

        <line x1={xFor(5.5)} y1={yFor(84)} x2={xFor(5.5)} y2={yFor(43)} stroke={WARN} strokeWidth={1.4} strokeDasharray="4 3" />
        <text x={xFor(5.5) + 8} y={yFor(64)} fontSize="10.5" fontWeight={700} fill={WARN}>
          the debate lives here
        </text>

        <text x={L} y={H - 10} fontSize="9" fill={ASH}>
          Illustrative of the two documented positions — not Nordwerk measurements, and not to scale against any published figure.
        </text>
      </svg>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Block 3b — the ESU cost ladder
// ---------------------------------------------------------------------------
export function EsuLadderSvg() {
  const W = 720;
  const H = 240;
  const baseY = 186;
  const maxH = 132;
  const bars = [
    { label: "Year 1", value: 61 },
    { label: "Year 2", value: 122 },
    { label: "Year 3", value: 244 },
  ];
  const maxV = 244;

  return (
    <div>
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full" role="img" aria-label="Windows 10 Extended Security Updates list pricing per device: 61 dollars in year one, 122 in year two, 244 in year three, totalling 427 dollars across the three-year runway. A reduced rate near 45 dollars per device per year applies to Intune or Autopatch-managed devices.">
        <text x={56} y={26} fontSize="11.5" fontWeight={700} fill={INK}>
          Windows 10 ESU — list price per device, doubling each year
        </text>
        {bars.map((b, i) => {
          const h = (b.value / maxV) * maxH;
          const x = 90 + i * 116;
          return (
            <g key={b.label}>
              <rect x={x} y={baseY - h} width={78} height={h} rx={5} fill={DANGER} opacity={0.85} />
              <text x={x + 39} y={baseY - h - 8} textAnchor="middle" fontSize="12" fontWeight={700} fill={DANGER}>
                ${b.value}
              </text>
              <text x={x + 39} y={baseY + 16} textAnchor="middle" fontSize="10" fill={ASH}>
                {b.label}
              </text>
            </g>
          );
        })}
        <line x1={70} y1={baseY} x2={W - 40} y2={baseY} stroke={LINE} strokeWidth={1.3} />

        <rect x={452} y={baseY - 38} width={78} height={38} rx={5} fill={ACCENT} opacity={0.75} />
        <text x={491} y={baseY - 46} textAnchor="middle" fontSize="11" fontWeight={700} fill={ACCENT}>
          ≈$45/yr
        </text>
        <text x={491} y={baseY + 16} textAnchor="middle" fontSize="9.5" fill={ASH}>
          Intune / Autopatch
        </text>

        <line x1={556} y1={baseY - maxH - 10} x2={556} y2={baseY} stroke={INK} strokeWidth={1.4} />
        <text x={566} y={baseY - maxH + 4} fontSize="12" fontWeight={700} fill={INK}>
          $427
        </text>
        <text x={566} y={baseY - maxH + 18} fontSize="9" fill={ASH}>
          full three-year
        </text>
        <text x={566} y={baseY - maxH + 30} fontSize="9" fill={ASH}>
          runway, per device
        </text>

        <text x={56} y={H - 12} fontSize="9" fill={ASH}>
          List pricing, excludes volume discounts. Late joiners must buy earlier years retroactively. Security updates only — no features.
        </text>
      </svg>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Block 4 — visible vs structural, as a 2×2
// ---------------------------------------------------------------------------
export function VisibleStructuralMatrixSvg() {
  const W = 720;
  const H = 340;
  const L = 120;
  const T = 34;
  const PW = 520;
  const PH = 250;
  const midX = L + PW / 2;
  const midY = T + PH / 2;

  const cells = [
    { x: L + PW * 0.25, y: T + PH * 0.25, title: "Invisible & strong", sub: "correct, hardest to sell — needs engineered proof points", tone: ACCENT },
    { x: L + PW * 0.75, y: T + PH * 0.25, title: "Visible & strong", sub: "rare, and the ideal", tone: ACCENT },
    { x: L + PW * 0.25, y: T + PH * 0.75, title: "Invisible & weak", sub: "should be obvious to reject — survives as inherited routine", tone: ASH },
    { x: L + PW * 0.75, y: T + PH * 0.75, title: "Visible & weak", sub: "the trap: budget lock-in and political closure", tone: DANGER },
  ];

  return (
    <div>
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full" role="img" aria-label="A two-by-two of visibility against structural strength. Visible and weak is the trap, producing budget lock-in and political closure. Invisible and strong is the correct but hardest to sell choice.">
        <rect x={L} y={T} width={PW} height={PH} rx={10} fill="#F5F6F7" stroke={LINE} strokeWidth={1.4} />
        <line x1={midX} y1={T} x2={midX} y2={T + PH} stroke={LINE} strokeWidth={1.6} />
        <line x1={L} y1={midY} x2={L + PW} y2={midY} stroke={LINE} strokeWidth={1.6} />

        {cells.map((c) => (
          <g key={c.title}>
            <text x={c.x} y={c.y - 6} textAnchor="middle" fontSize="11.5" fontWeight={700} fill={c.tone}>
              {c.title}
            </text>
            <text x={c.x} y={c.y + 12} textAnchor="middle" fontSize="9" fill={ASH}>
              {c.sub.length > 42 ? c.sub.slice(0, 42) : c.sub}
            </text>
            {c.sub.length > 42 && (
              <text x={c.x} y={c.y + 24} textAnchor="middle" fontSize="9" fill={ASH}>
                {c.sub.slice(42)}
              </text>
            )}
          </g>
        ))}

        <text x={L + PW * 0.25} y={T + PH + 22} textAnchor="middle" fontSize="10.5" fontWeight={700} fill={INK}>
          Low visibility
        </text>
        <text x={L + PW * 0.75} y={T + PH + 22} textAnchor="middle" fontSize="10.5" fontWeight={700} fill={INK}>
          High visibility
        </text>
        <text transform={`translate(${L - 28}, ${T + PH * 0.25}) rotate(-90)`} textAnchor="middle" fontSize="10.5" fontWeight={700} fill={INK}>
          Strong
        </text>
        <text transform={`translate(${L - 28}, ${T + PH * 0.75}) rotate(-90)`} textAnchor="middle" fontSize="10.5" fontWeight={700} fill={INK}>
          Weak
        </text>
        <text transform={`translate(${L - 46}, ${midY}) rotate(-90)`} textAnchor="middle" fontSize="9" fill={ASH}>
          structural leverage
        </text>
        <text x={W / 2} y={H - 10} textAnchor="middle" fontSize="9" fill={ASH}>
          The measures are deliberately not plotted here — placing them is your job in the task.
        </text>
      </svg>
    </div>
  );
}
