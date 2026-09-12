/** Route 3's material visuals — read-only illustrations, co-located for shared tokens. */

const INK = "#16191D";
const ASH = "#5E6670";
const ACCENT = "#0E7A5A";
const LINE = "#E2E5E9";
const WARN = "#B87514";
const DANGER = "#B23B3B";
const PAPER = "#FFFFFF";

// ---------------------------------------------------------------------------
// Block 1 — a list of measures vs. an architecture, under the same shock
// ---------------------------------------------------------------------------
const MEASURES = ["Refresh oldest devices", "Awareness campaign", "Duplex printing default", "Peripheral reuse drive", "Repair pilot"];
const COMPONENTS = ["Rules &\nthresholds", "Accountability", "Approval\nlogic", "Review\nmechanism", "Trade-off\ndefaults"];

export function MeasuresVsArchitectureSvg() {
  const W = 720;
  const H = 330;
  const shockY = 196;

  const cx = 540;
  const cy = 150;
  const r = 86;

  return (
    <div>
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full" role="img" aria-label="On the left, five separate measures fade out below a line marking the sponsor's departure. On the right, five interlocking architecture components — rules and thresholds, accountability, approval logic, review mechanism and trade-off defaults — are unaffected by the same line.">
        <text x={30} y={24} fontSize="11.5" fontWeight={700} fill={INK}>
          A list of measures
        </text>
        <text x={400} y={24} fontSize="11.5" fontWeight={700} fill={INK}>
          A decision architecture
        </text>

        {MEASURES.map((m, i) => {
          const y = 44 + i * 44;
          const faded = y > shockY;
          return (
            <g key={m} opacity={faded ? 0.28 : 1}>
              <rect x={30} y={y} width={250} height={32} rx={7} fill={PAPER} stroke={LINE} strokeWidth={1.4} />
              <text x={44} y={y + 20} fontSize="10.5" fill={INK}>
                {m}
              </text>
            </g>
          );
        })}

        {/* the shock line runs across both panels */}
        <line x1={20} y1={shockY} x2={W - 20} y2={shockY} stroke={DANGER} strokeWidth={1.6} strokeDasharray="6 4" />
        <text x={20} y={shockY - 6} fontSize="9.5" fontWeight={700} fill={DANGER}>
          the sponsor leaves · the budget line closes · a new buyer runs the next round
        </text>

        {/* interlocking ring */}
        <circle cx={cx} cy={cy} r={r} fill="none" stroke={ACCENT} strokeWidth={2} />
        {COMPONENTS.map((c, i) => {
          const angle = (i / COMPONENTS.length) * Math.PI * 2 - Math.PI / 2;
          const x = cx + Math.cos(angle) * r;
          const y = cy + Math.sin(angle) * r;
          const lines = c.split("\n");
          return (
            <g key={c}>
              <circle cx={x} cy={y} r={30} fill="#E7F2EC" stroke={ACCENT} strokeWidth={1.5} />
              {lines.map((ln, j) => (
                <text key={j} x={x} y={y - 2 + j * 10 - (lines.length - 1) * 4} textAnchor="middle" fontSize="8" fontWeight={700} fill={ACCENT}>
                  {ln}
                </text>
              ))}
            </g>
          );
        })}
        <text x={cx} y={cy + 4} textAnchor="middle" fontSize="10" fontWeight={700} fill={ACCENT}>
          keeps
        </text>
        <text x={cx} y={cy + 16} textAnchor="middle" fontSize="10" fontWeight={700} fill={ACCENT}>
          deciding
        </text>

        <text x={400} y={H - 12} fontSize="9" fill={ASH}>
          Same shock, different outcome — because an architecture changes the default rather than adding an exception to it.
        </text>
      </svg>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Block 2 — principle → rule → threshold
// ---------------------------------------------------------------------------
export function DecisionRuleLadderSvg() {
  const W = 720;
  const H = 300;
  const steps = [
    {
      y: 26,
      label: "Principle",
      lines: ["“We repair before we replace.”"],
      note: "A technician holding a broken laptop cannot act on this.",
      tone: DANGER,
    },
    {
      y: 118,
      label: "Rule",
      lines: ["Repair is the default where cost, security and remaining", "supported life all pass."],
      note: "Falsifiable — but still not applicable without numbers.",
      tone: WARN,
    },
    {
      y: 210,
      label: "Threshold",
      lines: [
        "Repair where cost ≤ 30% of replacement AND the device meets the security",
        "baseline AND ≥ 18 months supported life remain. Otherwise retire.",
      ],
      note: "Applicable by one person, on one device, without escalating.",
      tone: ACCENT,
    },
  ];

  return (
    <div>
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full" role="img" aria-label="Three rungs: a principle, then a rule, then a threshold with explicit numbers. Most proposals stop between the principle and the rule.">
        {steps.map((s, i) => (
          <g key={s.label}>
            <rect x={120} y={s.y} width={570} height={68} rx={9} fill={PAPER} stroke={s.tone} strokeWidth={1.8} />
            <rect x={30} y={s.y} width={78} height={68} rx={9} fill={s.tone} opacity={0.12} />
            <text x={69} y={s.y + 32} textAnchor="middle" fontSize="11" fontWeight={700} fill={s.tone}>
              {s.label}
            </text>
            <text x={69} y={s.y + 48} textAnchor="middle" fontSize="9" fill={ASH}>
              step {i + 1}
            </text>
            {s.lines.map((ln, j) => (
              <text key={j} x={134} y={s.y + 26 + j * 14} fontSize="11" fill={INK}>
                {ln}
              </text>
            ))}
            <text x={134} y={s.y + 60} fontSize="9" fill={ASH}>
              {s.note}
            </text>
          </g>
        ))}
        <line x1={69} y1={94} x2={69} y2={118} stroke={WARN} strokeWidth={1.6} strokeDasharray="4 3" />
        <text x={82} y={110} fontSize="9.5" fontWeight={700} fill={WARN}>
          where most proposals stop
        </text>
        <line x1={69} y1={186} x2={69} y2={210} stroke={ACCENT} strokeWidth={1.6} strokeDasharray="4 3" />
      </svg>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Block 3 — a generic RACI example (deliberately NOT the task's decisions)
// ---------------------------------------------------------------------------
export function RaciExampleSvg() {
  const W = 720;
  const H = 220;
  const rows = ["Set the annual pricing", "Approve a new supplier", "Publish the quarterly report"];
  const cols = ["Function lead", "Delivery team", "Finance", "Comms"];
  const grid: string[][] = [
    ["A", "R", "C", "I"],
    ["C", "R", "A", "I"],
    ["C", "I", "C", "A"],
  ];
  const cellW = 112;
  const cellH = 42;
  const L = 220;
  const T = 56;

  return (
    <div>
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full" role="img" aria-label="A generic three-by-four RACI grid showing exactly one Accountable per row. The highlighted cell demonstrates the single-Accountable rule.">
        <text x={30} y={26} fontSize="11.5" fontWeight={700} fill={INK}>
          A worked RACI — note that every row has exactly one A
        </text>
        {cols.map((c, j) => (
          <text key={c} x={L + j * cellW + cellW / 2} y={T - 10} textAnchor="middle" fontSize="9.5" fontWeight={700} fill={ASH}>
            {c}
          </text>
        ))}
        {rows.map((r, i) => (
          <g key={r}>
            <text x={L - 14} y={T + i * cellH + 26} textAnchor="end" fontSize="10" fill={INK}>
              {r}
            </text>
            {cols.map((_, j) => {
              const letter = grid[i][j];
              const isA = letter === "A";
              const highlight = i === 0 && j === 0;
              return (
                <g key={j}>
                  <rect
                    x={L + j * cellW}
                    y={T + i * cellH}
                    width={cellW - 6}
                    height={cellH - 6}
                    rx={7}
                    fill={isA ? "#E7F2EC" : PAPER}
                    stroke={highlight ? ACCENT : LINE}
                    strokeWidth={highlight ? 2.2 : 1.3}
                  />
                  <text
                    x={L + j * cellW + (cellW - 6) / 2}
                    y={T + i * cellH + 24}
                    textAnchor="middle"
                    fontSize="13"
                    fontWeight={700}
                    fill={isA ? ACCENT : ASH}
                  >
                    {letter}
                  </text>
                </g>
              );
            })}
          </g>
        ))}
        <text x={L} y={H - 14} fontSize="9" fill={ASH}>
          Two A&apos;s in one row is not shared ownership — it is a stall waiting for the first disagreement.
        </text>
      </svg>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Block 4 — the regulatory horizon
// ---------------------------------------------------------------------------
export function RegulatoryHorizonSvg() {
  const W = 720;
  const H = 240;
  const L = 60;
  const R = 600;
  const y = 132;

  const points = [
    { x: 0.08, label: "Repairability label", sub: "smartphones & tablets · Jun 2025", tone: ACCENT },
    { x: 0.3, label: "Windows 10 end of support", sub: "14 Oct 2025 · ESU begins", tone: DANGER },
    { x: 0.62, label: "Right to Repair transposition", sub: "member states · 31 Jul 2026", tone: ACCENT },
    { x: 0.86, label: "ESPR work plan", sub: "laptops in scope · direction, not date", tone: WARN },
  ];

  return (
    <div>
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full" role="img" aria-label="A timeline: repairability label for smartphones and tablets in June 2025, Windows 10 end of support in October 2025, Right to Repair transposition deadline 31 July 2026, and the ESPR work plan bringing laptops into scope as an open-ended direction.">
        <line x1={L} y1={y} x2={R} y2={y} stroke={INK} strokeWidth={1.8} />
        <path d={`M ${R} ${y} L ${R + 60} ${y}`} stroke={INK} strokeWidth={1.8} strokeDasharray="6 5" />
        <path d={`M ${R + 56} ${y - 5} L ${R + 64} ${y} L ${R + 56} ${y + 5}`} fill="none" stroke={INK} strokeWidth={1.6} />

        {points.map((p, i) => {
          const px = L + p.x * (R - L);
          const above = i % 2 === 0;
          const labelY = above ? y - 34 : y + 46;
          return (
            <g key={p.label}>
              <line x1={px} y1={y} x2={px} y2={above ? y - 22 : y + 22} stroke={p.tone} strokeWidth={1.4} />
              <circle cx={px} cy={y} r={5.5} fill={p.tone} />
              <text x={px} y={labelY} textAnchor="middle" fontSize="10.5" fontWeight={700} fill={p.tone}>
                {p.label}
              </text>
              <text x={px} y={labelY + 12} textAnchor="middle" fontSize="8.5" fill={ASH}>
                {p.sub}
              </text>
            </g>
          );
        })}

        <text x={L} y={H - 14} fontSize="9.5" fill={ASH}>
          ESRS E5 remains in force above the Omnibus thresholds while its own revision moves through the EU process — direction is
          stable, detail is in flux.
        </text>
      </svg>
    </div>
  );
}
