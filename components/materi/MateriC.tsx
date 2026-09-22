"use client";

import { useId, useState } from "react";
import clsx from "clsx";
import { DataTable, MaterialCard, Callout } from "@/components/ui/MaterialCard";
import { Bul, Diagram, Exploratory, Insight, Toggles } from "@/components/materi/kit";
import { useInView } from "@/lib/useInView";

/* ------------------------------------------------------------------ C1 */

const DOORS = [
  { id: "d1", label: "Staff a role part-time for six months", door: "two" as const, why: "A two-way door: you can reassign the role back when the six months end." },
  { id: "d2", label: "Sign a multi-year framework contract with a client", door: "one" as const, why: "Closer to a one-way door: exit clauses, relationship cost and reputational cost make reversal expensive." },
  { id: "d3", label: "Try a new meeting rhythm for one quarter", door: "two" as const, why: "A two-way door: stop it next quarter, at no cost beyond the quarter. (Generic example.)" },
];

function DoorTest() {
  const uid = useId().replace(/:/g, "");
  const [placed, setPlaced] = useState<Record<string, boolean>>({});
  const toggle = (id: string) => setPlaced((p) => ({ ...p, [id]: !p[id] }));
  const slot = { two: 0, one: 0 };
  return (
    <div className="space-y-3">
      <svg viewBox="0 0 640 250" className="h-auto w-full" role="img" aria-labelledby={`${uid}-t ${uid}-d`}>
        <title id={`${uid}-t`}>Door test</title>
        <desc id={`${uid}-d`}>Two doors: reversible (two-way) and hard to reverse (one-way). Three example decisions slide towards the door they belong to when selected.</desc>
        {[
          { x: 60, label: "Reversible", sub: "two-way door: walk back through", fill: "#DFEEEB", stroke: "#0F6B6B" },
          { x: 380, label: "Hard to reverse", sub: "one-way door: slow, deliberate", fill: "#F6E3DB", stroke: "#A4472A" },
        ].map((d) => (
          <g key={d.label}>
            <rect x={d.x} y="20" width="200" height="140" rx="6" fill={d.fill} stroke={d.stroke} strokeWidth="2" />
            <circle cx={d.x + 170} cy="92" r="5" fill={d.stroke} />
            <text x={d.x + 100} y="188" textAnchor="middle" fontSize="15" fontWeight="700" fill="#1F2328">{d.label}</text>
            <text x={d.x + 100} y="206" textAnchor="middle" fontSize="12" fill="#59606A">{d.sub}</text>
          </g>
        ))}
        {DOORS.map((d, i) => {
          const isPlaced = !!placed[d.id];
          const n = isPlaced ? slot[d.door]++ : 0;
          const tx = isPlaced ? (d.door === "two" ? 90 : 410) + n * 46 : 220 + i * 60;
          const ty = isPlaced ? 60 : 232;
          return (
            <g key={d.id} style={{ transform: `translate(${tx}px, ${ty}px)`, transition: "transform .5s ease-out" }}>
              <circle r="17" fill="#1F2328" stroke="#FFFEFA" strokeWidth="2.5" />
              <text y="5" textAnchor="middle" fontSize="14" fontWeight="700" fill="#FFFEFA">{i + 1}</text>
            </g>
          );
        })}
      </svg>
      <ol className="space-y-1.5">
        {DOORS.map((d, i) => (
          <li key={d.id}>
            <button
              type="button"
              aria-pressed={!!placed[d.id]}
              onClick={() => toggle(d.id)}
              className={clsx("flex min-h-[44px] w-full items-start gap-2 rounded-lg border px-3 py-2 text-left text-caption", placed[d.id] ? "border-accent bg-accentSoft" : "border-line bg-paper hover:border-ash")}
            >
              <span className="rounded bg-ink px-1.5 py-0.5 text-micro font-bold text-paper">{i + 1}</span>
              <span>
                <span className="font-semibold">{d.label}</span>
                {placed[d.id] && (
                  <span className="insight fade-in mt-1 block rounded-md bg-mist px-2 py-1 text-ash">
                    <span className="smallcaps mr-1.5 text-ash">What this shows</span>
                    {d.why}
                  </span>
                )}
              </span>
            </button>
          </li>
        ))}
      </ol>
      <p className="text-caption text-ash"><Exploratory /> Select a decision to send it to its door.</p>
    </div>
  );
}

export function CardC1() {
  return (
    <MaterialCard
      id="C1"
      scan="Most decisions can be undone cheaply. The few that cannot deserve the argument; the rest do not."
      sources={["bezos2015"]}
      reasoning={[
        "Ask of each lever: if it goes badly, can you go back through the door? A part-time role you can reassign is a two-way door; a multi-year contract with exit clauses and relationship cost is closer to a one-way door.",
        "Slow, deliberate process belongs on the hard-to-reverse lever. Do not spend the same effort on the reversible ones.",
        "The practical answer to a one-way-door lever is to stage it: a smaller, reversible first step before the full commitment (see C5).",
      ]}
    >
      <Diagram label="Door test" caption="Three generic decisions. The case levers are not used here, so Task 3 stays yours.">
        <DoorTest />
      </Diagram>
      <Bul
        items={[
          <><strong>Bezos (2015 Letter to Shareholders, Amazon.com)</strong>, the Type 1 / Type 2 framing, popularly known as <strong>one-way-door vs two-way-door</strong> decisions: Type 1 decisions are consequential and irreversible (or nearly so) and deserve slow, deliberate, consultative process; the large majority of decisions are Type 2 — reversible, “like walking through a door: if you don&apos;t like the decision, you can go back through” — and should be made quickly, by small groups or individuals.</>,
          <>Micro-example (generic, not the case levers): <em>staffing a role part-time for six months</em> is a two-way door (reassign it back); <em>signing a multi-year framework contract with a client</em> is closer to a one-way door.</>,
        ]}
      />
    </MaterialCard>
  );
}

/* ------------------------------------------------------------------ C2 */

const bell = (mu: number, sd: number, h: number) => {
  const pts: string[] = [];
  for (let x = 20; x <= 620; x += 10) {
    const y = 200 - h * Math.exp(-((x - mu) ** 2) / (2 * sd * sd));
    pts.push(`${pts.length ? "L" : "M"}${x},${y.toFixed(1)}`);
  }
  return pts.join(" ");
};

function InsideOutside() {
  const uid = useId().replace(/:/g, "");
  const [outside, setOutside] = useState(true);
  const [ref, seen] = useInView<HTMLDivElement>();
  return (
    <div ref={ref} className="space-y-3">
      <Toggles label="Views" multi value={outside ? ["outside"] : []} onChange={() => setOutside((o) => !o)} options={[{ id: "outside", label: "Show the outside view" }]} />
      <svg viewBox="0 0 640 250" className="h-auto w-full" role="img" aria-labelledby={`${uid}-t ${uid}-d`}>
        <title id={`${uid}-t`}>Inside view versus outside view</title>
        <desc id={`${uid}-d`}>A narrow, optimistic inside-view curve and a wider, realistic outside-view curve. A marker for one anecdote sits inside the narrow curve, far to the optimistic side.</desc>
        <line x1="20" x2="620" y1="200" y2="200" stroke="#59606A" strokeWidth="1.3" />
        <text x="20" y="222" fontSize="12" fill="#59606A">worse outcome</text>
        <text x="620" y="222" textAnchor="end" fontSize="12" fill="#59606A">better outcome</text>
        {outside && (
          <g className="fade-in">
            <path d={bell(300, 105, 120)} fill="none" stroke="#0F6B6B" strokeWidth="3.2" pathLength={1} className={seen ? "anim-draw" : undefined} />
            <text x="150" y="108" textAnchor="middle" fontSize="13" fontWeight="700" fill="#0F6B6B">Outside view: the class of similar programs</text>
          </g>
        )}
        <path d={bell(470, 42, 168)} fill="none" stroke="#A4472A" strokeWidth="3.2" pathLength={1} className={seen ? "anim-draw" : undefined} />
        <text x="470" y="24" textAnchor="middle" fontSize="13" fontWeight="700" fill="#A4472A">Inside view: this case&apos;s own story</text>
        <line x1="520" x2="520" y1="60" y2="200" stroke="#1F2328" strokeWidth="1.6" strokeDasharray="4 4" />
        <circle cx="520" cy="60" r="8" fill="#8A5A0B" stroke="#FFFEFA" strokeWidth="2" />
        <text x="526" y="52" fontSize="12" fontWeight="700" fill="#1F2328">Kessler, if fixed (n = 1)</text>
      </svg>
      <Insight>
        {outside
          ? "Kessler's one good outcome sits in the far optimistic tail of the wide outside-view curve — most similar programs land well to the left of it. A single success this far out is not the typical result; it's the lucky one."
          : "Hide the outside view and only Kessler's own story is left — one narrow, optimistic curve with nothing to compare it against. Show the outside view again to see where this one case actually sits among similar programs."}
      </Insight>
    </div>
  );
}

export function CardC2() {
  return (
    <MaterialCard
      id="C2"
      scan="A single success does not forecast a program — an outside view of similar programs does."
      sources={["kahneman1993"]}
      reasoning={[
        "Your Task 1 and Task 2 work is an inside view of one case (n = 1). A portfolio program needs its own reference class: the 70% one-off rate from Materi A1, not Kessler's specific numbers.",
        "When you say what a program will produce, locate it in the distribution of similar programs first. Do not reason from the plan's own story alone.",
        "Say what stays uncovered with a number of your own (Block 3.5). An optimistic plan that names no uncovered remainder is an inside view.",
      ]}
    >
      <Diagram label="Inside view vs outside view" caption="The anecdote sits in the far tail of the narrow curve; the wider curve is what similar cases actually did.">
        <InsideOutside />
      </Diagram>
      <Bul
        items={[
          <><strong>Kahneman &amp; Lovallo (1993)</strong>, <em>Timid choices and bold forecasts: A cognitive perspective on risk taking</em>, <strong>Management Science, 39(1), 17–31</strong>: planners take an <strong>inside view</strong> (focus on the specifics of the case at hand, its plan and obstacles) which systematically produces optimistic, narrow forecasts; the corrective is an <strong>outside view / reference class forecasting</strong>: look at the distribution of outcomes in a class of similar cases and locate the current case in that distribution, rather than reasoning from its own story.</>,
          <>Direct link to Routes 1 and 2: filing Kessler&apos;s Task 1 verdict and Task 2 recommendation is an inside view of <strong>one case (n = 1)</strong>. A portfolio program in Task 3 needs its own reference class: the 70% one-off rate from Materi A1, not Kessler&apos;s specific numbers.</>,
        ]}
      />
    </MaterialCard>
  );
}

/* ------------------------------------------------------------------ C3 */

const OPTIONS = [
  { id: "o1", label: "Option 1", score: 90, cost: 180 },
  { id: "o2", label: "Option 2", score: 70, cost: 90 },
  { id: "o3", label: "Option 3", score: 55, cost: 60 },
];
const CAP_GENERIC = 120;

function ScoreVsCap() {
  const uid = useId().replace(/:/g, "");
  const [showCost, setShowCost] = useState(false);
  const [ref, seen] = useInView<HTMLDivElement>();
  const sy = (v: number) => 210 - v * 1.1;
  return (
    <div ref={ref} className="space-y-3">
      <Toggles label="Overlay" multi value={showCost ? ["cost"] : []} onChange={() => setShowCost((s) => !s)} options={[{ id: "cost", label: "Show cost" }]} />
      <svg viewBox="0 0 640 250" className="h-auto w-full" role="img" aria-labelledby={`${uid}-t ${uid}-d`}>
        <title id={`${uid}-t`}>Score against cap</title>
        <desc id={`${uid}-d`}>Three generic options as score bars. With the cost overlay on, the highest-scoring option is also the most expensive and rises above the cost cap line.</desc>
        <line x1="40" x2="620" y1="210" y2="210" stroke="#59606A" strokeWidth="1.3" />
        {OPTIONS.map((o, i) => {
          const x = 90 + i * 180;
          const over = o.cost > CAP_GENERIC;
          return (
            <g key={o.id}>
              <rect x={x} y={sy(o.score)} width="60" height={o.score * 1.1} fill="#2F5D62" stroke="#1F3F43" strokeWidth="1.4" className={seen ? "anim-grow-y" : undefined} style={{ animationDelay: `${i * 100}ms` }} />
              <text x={x + 30} y={sy(o.score) - 6} textAnchor="middle" fontSize="12" fontWeight="700" fill="#1F2328">score {o.score}</text>
              {showCost && (
                <g className="fade-in">
                  <rect x={x + 68} y={sy(o.cost * 0.6)} width="44" height={o.cost * 0.6 * 1.1} fill={over ? "#F6E3DB" : "#FFFEFA"} stroke={over ? "#A4472A" : "#59606A"} strokeWidth="1.6" strokeDasharray={over ? "5 3" : undefined} />
                  <text x={x + 90} y={sy(o.cost * 0.6) - 6} textAnchor="middle" fontSize="12" fontWeight="700" fill={over ? "#A4472A" : "#59606A"}>cost {o.cost}</text>
                </g>
              )}
              <text x={x + 56} y="230" textAnchor="middle" fontSize="12.5" fill="#1F2328">{o.label}</text>
            </g>
          );
        })}
        {showCost && (
          <g className="fade-in">
            <line x1="40" x2="620" y1={sy(CAP_GENERIC * 0.6)} y2={sy(CAP_GENERIC * 0.6)} stroke="#1F2328" strokeWidth="1.8" strokeDasharray="4 4" />
            <text x="620" y={sy(CAP_GENERIC * 0.6) - 6} textAnchor="end" fontSize="12" fontWeight="700" fill="#1F2328">cost cap {CAP_GENERIC}</text>
          </g>
        )}
      </svg>
      <Insight>
        {showCost ? "The highest score is also the most expensive, and it is over the cap: not fundable, however well it scores." : "By score alone, Option 1 ranks first."} Generic, illustrative numbers.
      </Insight>
    </div>
  );
}

export function CardC3() {
  return (
    <MaterialCard
      id="C3"
      scan="When a budget cannot fund everything, score options on independent axes and let the arithmetic rank them — then override it in writing if you must."
      sources={["intercom2016", "ellis2017"]}
      reasoning={[
        "Never stop at the score. Check every option against the cap: a high-scoring option that busts the budget is not fundable. The board does this check for you; you still have to choose what to leave out.",
        "Use discrete positions (None / Partial / Full), not a free amount: they can be compared across people and re-checked, which is why the allocation board has switches and not a budget slider.",
        "If the arithmetic ranks something first and you fund something else, say so in writing (Block 3.6), with the reason.",
      ]}
    >
      <Diagram label="Score vs cap" caption="Toggle the cost overlay.">
        <ScoreVsCap />
      </Diagram>
      <Bul
        items={[
          <>The curriculum&apos;s own scoring method, <strong>Benefit × Feasibility × Differentiation</strong>, belongs to a family of <strong>multiplicative discrete-axis scoring frameworks</strong> used in industry to prioritise under scarcity:</>,
          <><strong>RICE</strong> (Reach, Impact, Confidence, Effort), a prioritisation framework popularised by <strong>Intercom&apos;s product team (2016)</strong>: <code>RICE = (Reach × Impact × Confidence) / Effort</code>.</>,
          <><strong>ICE</strong> (Impact, Confidence, Ease), a lighter three-factor version associated with growth-hacking practice from <strong>Sean Ellis</strong> (see Ellis &amp; Brown, 2017, <em>Hacking Growth</em>): <code>ICE = Impact × Confidence × Ease</code>.</>,
          <>Why discrete beats continuous here: a free slider on “impact” cannot be checked or compared across participants; a Low/Medium/High (or 1–3) scale can, which is exactly why Task 3&apos;s allocation board uses discrete switch positions instead of a budget slider.</>,
        ]}
      />
      <Callout label="The caution every one of these frameworks shares" tone="rust">
        <p>Multiplying scores hides the fact that <strong>Effort (or Cost) is not optional</strong>: a high-scoring option that busts the budget is not fundable. That is the constraint check Task 3 enforces mechanically rather than asking you to remember it.</p>
      </Callout>
    </MaterialCard>
  );
}

/* ------------------------------------------------------------------ C4 */

function PortfolioCliff() {
  const uid = useId().replace(/:/g, "");
  const [ref, seen] = useInView<HTMLDivElement>();
  const thin = Array.from({ length: 42 }, (_, i) => i);
  return (
    <div ref={ref}>
      <svg viewBox="0 0 640 250" className="h-auto w-full" role="img" aria-labelledby={`${uid}-t ${uid}-d`}>
        <title id={`${uid}-t`}>Portfolio cliff versus Kessler cliff</title>
        <desc id={`${uid}-d`}>Forty-two thin, overlapping revenue cliffs on the left, one for each one-off customer, beside a single thick bar for Kessler on the right.</desc>
        <line x1="20" x2="620" y1="206" y2="206" stroke="#59606A" strokeWidth="1.3" />
        <g className={seen ? "fade-in" : undefined}>
          {thin.map((i) => {
            const x = 30 + (i % 14) * 14 + Math.floor(i / 14) * 5;
            const h = 90 + ((i * 37) % 60);
            const w = 26 + ((i * 11) % 20);
            return (
              <path key={i} d={`M${x},206 V${206 - h} H${x + w} V206`} fill="none" stroke="#2F5D62" strokeOpacity="0.4" strokeWidth="1.4" />
            );
          })}
        </g>
        <text x="150" y="40" textAnchor="middle" fontSize="13" fontWeight="700" fill="#1F2328">The portfolio: 42 one-off customers</text>
        <text x="150" y="226" textAnchor="middle" fontSize="12" fill="#59606A">42 = about 60 active × 70% one-off (Case assumption)</text>
        <rect x="470" y="66" width="60" height="140" fill="#8A5A0B" stroke="#6E4708" strokeWidth="1.6" className={seen ? "anim-grow-y" : undefined} />
        <text x="500" y="52" textAnchor="middle" fontSize="13" fontWeight="700" fill="#1F2328">Kessler: 1</text>
        <text x="500" y="226" textAnchor="middle" fontSize="12" fill="#59606A">one case</text>
      </svg>
    </div>
  );
}

export function CardC4() {
  return (
    <MaterialCard
      id="C4"
      scan="Funding one option is always also the decision not to fund another — that trade-off has a name and a price."
      sources={["brealey", "gupta2003"]}
      reasoning={[
        "Every lever you fund is a lever you do not fund at that level: state the opportunity cost of what you left at None or Partial, and put a number on it.",
        "Under capital rationing the cap, not the merit of any one lever, is the binding constraint. Positive-value options are left unfunded, and that is not a mistake, provided you say so.",
        "A portfolio problem is sized on the pool (42 one-off customers), not on one account: the retention rate r moves across the segment, not just for Kessler.",
      ]}
    >
      <Diagram label="Portfolio cliff vs Kessler cliff" caption="The single-project cliff from Materi A1, redrawn 42 times, next to the one Kessler bar.">
        <PortfolioCliff />
      </Diagram>
      <Bul
        items={[
          <><strong>Opportunity cost</strong>: the value of the next-best option forgone; <strong>capital rationing</strong>: choosing among positive-value options because the budget, not the merit of any one option, is the binding constraint (standard corporate-finance framing, e.g. <strong>Brealey, Myers &amp; Allen</strong>, <em>Principles of Corporate Finance</em>).</>,
          <>Reuse the <strong>CLV formula from Materi A1</strong> (Gupta &amp; Lehmann 2003: <code>CLV = m · r / (1 + i − r)</code>) at portfolio scale: raising the retention rate r across a segment of one-off customers, not just one account, is what actually moves the number A1 introduced.</>,
          <><em>Case assumption</em> for scale: TechSolutions serves roughly 60 active customers; at a 70% one-off rate that is <strong>42 one-off customers</strong>, the pool Task 3&apos;s allocation board covers.</>,
        ]}
      />
    </MaterialCard>
  );
}

/* ------------------------------------------------------------------ C5 */

function RaciPreview() {
  const uid = useId().replace(/:/g, "");
  const rows = ["Approve the budget", "Run the pilot", "Report the results"];
  const cols = ["Sponsor", "Project lead", "Team"];
  const grid = [
    ["A", "R", "C"],
    ["I", "A", "R"],
    ["C", "A", "R"],
  ];
  return (
    <svg viewBox="0 0 640 200" className="h-auto w-full" role="img" aria-labelledby={`${uid}-t ${uid}-d`}>
      <title id={`${uid}-t`}>RACI grid preview</title>
      <desc id={`${uid}-d`}>A three by three example RACI grid. In every row exactly one cell is Accountable, and it is highlighted.</desc>
      {cols.map((c, j) => (
        <text key={c} x={250 + j * 130} y="24" textAnchor="middle" fontSize="13" fontWeight="700" fill="#1F2328">{c}</text>
      ))}
      {rows.map((r, i) => (
        <g key={r}>
          <text x="20" y={70 + i * 52} fontSize="13" fontWeight="700" fill="#1F2328">{r}</text>
          {grid[i].map((v, j) => (
            <g key={j}>
              <rect x={210 + j * 130} y={44 + i * 52} width="80" height="40" rx="6" fill={v === "A" ? "#8A5A0B" : "#FFFEFA"} stroke={v === "A" ? "#6E4708" : "#59606A"} strokeWidth={v === "A" ? 2.4 : 1.3} />
              <text x={250 + j * 130} y={70 + i * 52} textAnchor="middle" fontSize="16" fontWeight="700" fill={v === "A" ? "#FFFEFA" : "#1F2328"}>{v}</text>
            </g>
          ))}
        </g>
      ))}
    </svg>
  );
}

export function CardC5() {
  return (
    <MaterialCard
      id="C5"
      scan="A plan without an owner and a date is a hope, not a decision."
      sources={["pmbok", "amram1999"]}
      reasoning={[
        "Give every activity exactly one Accountable owner. Any number of Responsible, Consulted or Informed parties is fine; two Accountable owners means nobody is.",
        "Carry the grid into the governance table: every lever you fund needs a named owner and a date, and the next portfolio review needs one too.",
        "For a one-way-door lever, stage it: buy the option to expand with a smaller pilot first (real options thinking), then commit the full amount once early results are in.",
      ]}
    >
      <Diagram label="RACI grid preview" caption="A generic example, not the graded grid. One highlighted A per row.">
        <RaciPreview />
      </Diagram>
      <Bul
        items={[
          <><strong>RACI matrix</strong> (Responsible, Accountable, Consulted, Informed), a standard project-governance tool (documented in the <strong>Project Management Institute&apos;s PMBOK Guide</strong>): every activity gets exactly one <strong>Accountable</strong> owner; any number of <strong>Responsible</strong>, <strong>Consulted</strong> or <strong>Informed</strong> parties.</>,
          <>Applied to a retention program, typical activities are <em>account-owner assignment</em>, <em>contract negotiation for framework agreements</em>, <em>running quarterly value-realization reviews</em>, and <em>escalation to the Geschäftsführer when a named account is at risk</em>. Typical roles: <strong>Head of Sales / CCO</strong> (you, in Task 3), <strong>Delivery PM</strong>, <strong>Legal / Einkauf counterpart</strong>, <strong>Geschäftsführer</strong>.</>,
          <><strong>Real options thinking</strong> (<strong>Amram &amp; Kulatilaka, 1999</strong>, <em>Real Options: Managing Strategic Investment in an Uncertain World</em>): stage an uncertain, harder-to-reverse commitment (like the framework-contract push in Task 3) as a smaller pilot first, buying the option to expand once early results are in, rather than committing the full amount up front. This is the practical answer to a one-way-door lever identified in C1.</>,
        ]}
      />
    </MaterialCard>
  );
}

/* ------------------------------------------------------------------ C6 */

export function CardC6() {
  const steps = ["Allocate", "Read both scenarios", "Govern", "Price what you postponed"];
  return (
    <MaterialCard
      id="C6"
      scan="Four steps, twenty minutes: Allocate → Read both scenarios → Govern → Price what you postponed."
      sources={[]}
      reasoning={["Fund within the cap, open both scenario tabs before you file, give every funded lever an owner and a date, and finish by saying what stays uncovered with your own number. A memo that funds everything has not used this exercise."]}
    >
      <svg viewBox="0 0 640 90" className="h-auto w-full" role="img" aria-label="Field method: Allocate, Read both scenarios, Govern, Price what you postponed">
        <title>Field method for Task 3</title>
        {steps.map((s, i) => (
          <g key={s}>
            <rect x={10 + i * 158} y="14" width="140" height="56" rx="8" fill={i === 3 ? "#FBF0D6" : "#FFFEFA"} stroke="#59606A" strokeWidth="1.5" />
            <text x={80 + i * 158} y={s.length > 14 ? 38 : 47} textAnchor="middle" fontSize="13.5" fontWeight="700" fill="#1F2328">{i + 1}. {s.length > 14 ? s.split(" ").slice(0, 2).join(" ") : s}</text>
            {s.length > 14 && <text x={80 + i * 158} y="55" textAnchor="middle" fontSize="13.5" fontWeight="700" fill="#1F2328">{s.split(" ").slice(2).join(" ")}</text>}
            {i < 3 && <path d={`M${152 + i * 158},42 L${166 + i * 158},42`} stroke="#8A5A0B" strokeWidth="3" fill="none" />}
          </g>
        ))}
      </svg>
      <p className="text-body"><strong>Time box: 20 minutes.</strong></p>
      <DataTable
        caption="Task 3 at a glance"
        head={["Block", "What you do", "Kind"]}
        rows={[
          ["3.1 Allocation board", "Set three levers, read six figures, file within the cap", "Objective"],
          ["3.2 RACI grid", "One Accountable per row", "Objective"],
          ["3.3 Risk and reversibility", "Name the hardest-to-reverse lever and a reversible first step", "Judged"],
          ["3.4 Governance table", "Decision, owner, date per funded lever", "Judged"],
          ["3.5 Not funding", "Name what stays uncovered, with your own G6", "Judged"],
          ["3.6 Executive summary", "Four live chips: lever, reversibility, scenario, owner", "Judged"],
        ]}
      />
    </MaterialCard>
  );
}
