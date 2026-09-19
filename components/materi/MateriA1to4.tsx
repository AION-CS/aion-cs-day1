"use client";

import { useId, useState } from "react";
import { DataTable, MaterialCard, Callout } from "@/components/ui/MaterialCard";
import { Bul, Diagram, Exploratory, Toggles } from "@/components/materi/kit";
import { useInView } from "@/lib/useInView";
import { useCountUp } from "@/lib/useCountUp";
import { formatEuro } from "@/lib/parseAmount";

/* ------------------------------------------------------------------ A1 */

const M = 30000;
const DISC = 0.1;
const clv = (r: number) => (M * r) / (1 + DISC - r);

function RevenueCliff() {
  const uid = useId().replace(/:/g, "");
  const [r, setR] = useState(0.8);
  const [ref, seen] = useInView<HTMLDivElement>();
  const value = useCountUp(clv(r));
  const delta = (clv(r) / clv(0.8) - 1) * 100;
  const quarters = ["Q1", "Q2", "Q3", "Q4", "Q5", "Q6", "Q7", "Q8"];
  const level = 30 + (r - 0.5) * 200; // illustrative: the dotted follow-on line rises with r
  return (
    <div ref={ref} className="space-y-3">
      <svg viewBox="0 0 640 250" className="h-auto w-full" role="img" aria-labelledby={`${uid}-t ${uid}-d`}>
        <title id={`${uid}-t`}>Revenue cliff</title>
        <desc id={`${uid}-d`}>Quarterly revenue of a project: four high delivery quarters, then zero after go-live. A dotted line shows revenue if a follow-on continues it.</desc>
        <line x1="40" x2="620" y1="206" y2="206" stroke="#59606A" strokeWidth="1.3" />
        {quarters.map((q, i) => {
          const x = 56 + i * 71;
          const delivery = i < 4;
          return (
            <g key={q}>
              {delivery ? (
                <rect x={x} y={66} width={52} height={140} rx="3" fill="#2F5D62" stroke="#1F3F43" strokeWidth="1.4" className={seen ? "anim-grow-y" : undefined} style={{ animationDelay: `${i * 90}ms` }} />
              ) : (
                <rect x={x} y={203} width={52} height={3} fill="#A4472A" />
              )}
              <text x={x + 26} y={226} textAnchor="middle" fontSize="12" fill="#59606A">{q}</text>
            </g>
          );
        })}
        <text x="160" y="52" textAnchor="middle" fontSize="13" fontWeight="700" fill="#1F2328">Delivery: milestone invoices</text>
        <text x="482" y="188" textAnchor="middle" fontSize="13" fontWeight="700" fill="#A4472A">After Abnahme: zero</text>
        <path
          d={`M 340 ${206 - 140 * 0.9} L 340 ${206 - level} L 610 ${206 - level}`}
          fill="none"
          stroke="#D99A2B"
          strokeWidth="3"
          pathLength={1}
          strokeDasharray="0.02 0.02"
          className={seen ? "fade-in" : undefined}
        />
        <text x="470" y={206 - level - 8} textAnchor="middle" fontSize="12.5" fontWeight="700" fill="#8A5A0B">with follow-on (illustrative)</text>
      </svg>
      <div className="grid gap-3 rounded-lg border border-line bg-paper p-3 md:grid-cols-[1fr_auto] md:items-center">
        <div>
          <label htmlFor={`${uid}-r`} className="text-caption font-semibold">
            Retention rate r: <span className="tnum">{r.toFixed(2)}</span>
          </label>
          <p className="text-micro normal-case tracking-normal text-ash">m = €30,000 · i = 10% <span className="font-semibold">(Case assumption)</span>. Drag to explore; not graded.</p>
          <input id={`${uid}-r`} type="range" min={0.7} max={0.95} step={0.01} value={r} onChange={(e) => setR(Number(e.target.value))} className="range-accent mt-1" />
        </div>
        <div className="text-right" aria-live="polite">
          <p className="smallcaps">CLV = m · r / (1 + i − r)</p>
          <p className="tnum text-h2">{formatEuro(value)}</p>
          <p className="tnum text-caption text-ash">
            {r === 0.8 ? "reference point: r = 0.80" : `${delta >= 0 ? "+" : ""}${delta.toFixed(1)}% vs r = 0.80 (€80,000)`}
          </p>
        </div>
      </div>
    </div>
  );
}

export function CardA1() {
  return (
    <MaterialCard
      id="A1"
      scan="In project business, revenue stops at go-live unless something is designed to continue it."
      sources={["reichheld1990", "carroll1992", "gupta2003"]}
      reasoning={[
        "A one-off project ends its revenue at acceptance (Abnahme). Retention has to be designed in; it does not happen by default.",
        "Treat the “+5% retention = +25–95% profit” slogan as direction, never as a forecast for your firm.",
      ]}
    >
      <Diagram label="Revenue cliff" caption="The shape is illustrative. The CLV readout uses the Gupta & Lehmann formula with Case assumption inputs.">
        <RevenueCliff />
      </Diagram>
      <Bul
        items={[
          <>Project business sells outcomes once: fixed scope, milestone invoices, acceptance (<em>Abnahme</em>), then revenue drops unless a follow-on exists. Case company <strong>TechSolutions GmbH</strong>: <strong>70% of customers are one-off</strong>.</>,
          <>The classic argument: <strong>Reichheld &amp; Sasser (1990)</strong> report that cutting defection by 5% raised profits by 85% in one bank&apos;s branch system, 50% in an insurance brokerage, 30% in an auto-service chain; MBNA halved a 10% defection rate and profits rose 125%.</>,
          <>Simple lifetime-value model, <strong>Gupta &amp; Lehmann (2003)</strong>: <code>CLV = m · r / (1 + i − r)</code> (constant margin m, retention rate r, discount rate i, infinite horizon). At r = 0.80, CLV = €80,000; at r = 0.85, €102,000 (+27.5%).</>,
        ]}
      />
      <Callout label="Read it carefully" tone="rust">
        <p>The popular slogan “+5% retention = +25–95% profit” is a distortion of those company-specific figures from consumer-service industries, and the calculation was later disputed (Carroll &amp; Reichheld 1992). Treat it as direction, not as a forecast for your firm.</p>
      </Callout>
    </MaterialCard>
  );
}

/* ------------------------------------------------------------------ A2 */

type Q = "loyalty" | "latent" | "spurious" | "none";
const QUADS: Record<Q, { label: string; x: number; y: number; example: string }> = {
  loyalty: { label: "Loyalty", x: 1, y: 0, example: "Recommends the supplier and re-orders." },
  latent: { label: "Latent loyalty", x: 1, y: 1, example: "Recommends the supplier, yet a procurement policy forces three offers." },
  spurious: { label: "Spurious loyalty", x: 0, y: 0, example: "Stays only because exit is expensive." },
  none: { label: "No loyalty", x: 0, y: 1, example: "Neither a positive attitude nor repeat orders." },
};
const SCENARIOS: Record<string, { label: string; from: Q; to: Q; text: string }> = {
  costs: { label: "Switching costs rise", from: "none", to: "spurious", text: "Repeat behaviour rises while the attitude stays weak: the customer stays because leaving costs more. Retention goes up; loyalty does not." },
  contact: { label: "Key contact leaves", from: "loyalty", to: "spurious", text: "The relationship behind the attitude goes. Repeat orders may continue for a while on habit and contract, so the score of the relationship falls before the behaviour does." },
  price: { label: "Competitor cuts price 12%", from: "loyalty", to: "latent", text: "The attitude can stay positive while the behaviour changes, because a price gap moves the purchase decision without changing what the buyer thinks of you." },
};

function LoyaltyQuadrant() {
  const uid = useId().replace(/:/g, "");
  const [hover, setHover] = useState<Q>("loyalty");
  const [scn, setScn] = useState<string | null>(null);
  const [ref, seen] = useInView<HTMLDivElement>();
  const S = scn ? SCENARIOS[scn] : null;
  const pos = (q: Q) => ({ x: 70 + QUADS[q].x * 250 + 125, y: 22 + QUADS[q].y * 130 + 65 });
  const m = S ? pos(S.to) : pos("loyalty");
  const start = S ? pos(S.from) : m;
  return (
    <div ref={ref} className="space-y-3">
      <svg viewBox="0 0 640 330" className="h-auto w-full" role="group" aria-labelledby={`${uid}-t ${uid}-d`}>
        <title id={`${uid}-t`}>Loyalty quadrant</title>
        <desc id={`${uid}-d`}>Dick and Basu: relative attitude (weak to strong) against repeat behaviour (low to high) gives four quadrants. A marker moves between them in three scenarios.</desc>
        {(Object.keys(QUADS) as Q[]).map((q) => {
          const p = pos(q);
          const sel = hover === q;
          return (
            <g key={q} className="hit" role="button" tabIndex={0} aria-pressed={sel} aria-label={`${QUADS[q].label}: ${QUADS[q].example}`}
              onClick={() => setHover(q)} onMouseEnter={() => setHover(q)} onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); setHover(q); } }}>
              <rect x={70 + QUADS[q].x * 250} y={22 + QUADS[q].y * 130} width={250} height={130} fill={sel ? "#FBF0D6" : q === "loyalty" ? "#DFEEEB" : "#FFFEFA"} stroke="#59606A" strokeWidth={sel ? 2.6 : 1.3} className="hit-shape" />
              <text x={p.x} y={p.y - 30} textAnchor="middle" fontSize="15" fontWeight="700" fill="#1F2328">{QUADS[q].label}</text>
            </g>
          );
        })}
        <text x="320" y="318" textAnchor="middle" fontSize="12.5" fill="#59606A">Relative attitude: weak → strong</text>
        <text x="16" y="170" fontSize="12.5" fill="#59606A" transform="rotate(-90 16 170)" textAnchor="middle">Repeat behaviour: low → high</text>
        <text x="56" y="34" textAnchor="end" fontSize="11" fill="#59606A">high</text>
        <text x="56" y="286" textAnchor="end" fontSize="11" fill="#59606A">low</text>
        {S && <path d={`M${start.x},${start.y} L${m.x},${m.y}`} stroke="#8A5A0B" strokeWidth="2.6" strokeDasharray="1" pathLength={1} fill="none" className={seen ? "anim-draw" : undefined} key={scn} />}
        <g style={{ transform: `translate(${m.x}px, ${m.y}px)`, transition: "transform .55s ease-out" }}>
          <circle r="13" fill="#8A5A0B" stroke="#FFFEFA" strokeWidth="3" className="anim-pulse" />
          <text y="5" textAnchor="middle" fontSize="12" fontWeight="700" fill="#FFFEFA">Z</text>
        </g>
      </svg>
      <p aria-live="polite" className="rounded-md bg-mist px-3 py-2 text-caption">
        <strong>{QUADS[hover].label}.</strong> B2B IT example: {QUADS[hover].example}
      </p>
      <div className="space-y-1.5">
        <p className="smallcaps">Scenario for customer Z <Exploratory /></p>
        <Toggles label="Scenario" value={scn} onChange={(id) => setScn(scn === id ? null : id)} options={Object.entries(SCENARIOS).map(([id, s]) => ({ id, label: s.label }))} />
        <p aria-live="polite" className="min-h-[3rem] text-caption text-ash">{S ? `${S.text} (An illustration of how the two axes can separate, not a measured law.)` : "Choose a scenario to move the marker."}</p>
      </div>
    </div>
  );
}

export function CardA2() {
  return (
    <MaterialCard
      id="A2"
      scan="Satisfaction is an evaluation, loyalty is an attitude with behaviour, retention is an observable fact, and they can diverge."
      sources={["dick1994", "oliver1999", "reichheld2003", "jones1995"]}
      reasoning={[
        "A high satisfaction score does not prove the customer will re-order: a 4 out of 5 is not a safe score.",
        "Retention is what the records show (renewal, repeat orders). Do not read attitude into it: a customer can stay only because exit is expensive.",
        "In project business the survey respondent (often the head of IT) is rarely the decider, so a stated intention is weak evidence.",
      ]}
    >
      <Diagram label="Loyalty quadrant" caption="Select a quadrant for a B2B IT example, then run a scenario.">
        <LoyaltyQuadrant />
      </Diagram>
      <DataTable
        caption="Three constructs"
        head={["Construct", "What it is", "Typical measure", "B2B IT divergence example"]}
        rows={[
          ["Satisfaction", "Judgement of outcome vs expectation", "CSAT (1–5), close-out survey", "4/5 and no re-order."],
          [<>Loyalty</>, <>Relative attitude plus repeat behaviour (<strong>Dick &amp; Basu 1994</strong>); <strong>Oliver (1999)</strong> describes four stages: cognitive → affective → conative → action loyalty</>, <>NPS (<strong>Reichheld 2003</strong>), intention, share of wallet</>, "Recommends the supplier, yet a procurement policy forces three offers."],
          ["Retention", "Observable continuation", "Renewal rate, repeat-order rate within 24 months, GRR/NRR for recurring revenue", "Stays only because exit is expensive."],
        ]}
      />
      <Bul
        items={[
          <><strong>Jones &amp; Sasser (1995):</strong> Xerox found “totally satisfied” (5) customers were <strong>six times more likely to repurchase within 18 months</strong> than “satisfied” (4). Typology: <strong>Loyalists</strong> (satisfied + loyal), <strong>Mercenaries</strong> (satisfied, not loyal), <strong>Hostages</strong> (dissatisfied, stay because of barriers), <strong>Defectors</strong>.</>,
          "NPS caveat: it records stated intent, and in project business the respondent (often the head of IT) is rarely the decider.",
        ]}
      />
      <Callout label="Metric definitions">
        <p><strong>GRR</strong> = (starting recurring revenue − churn − contraction) ÷ starting recurring revenue. <strong>NRR</strong> adds expansion. Project business often has no recurring revenue, so use repeat-order rate and share of wallet.</p>
      </Callout>
    </MaterialCard>
  );
}

/* ------------------------------------------------------------------ A3 */

type Rope = "emotional" | "economic" | "contractual";
const ROPES: Rope[] = ["emotional", "economic", "contractual"];
const CUSTOMERS = {
  P: { label: "Customer P: three-year managed-service contract, weak relationship", s: { emotional: 1, economic: 2, contractual: 3 } as Record<Rope, number> },
  Q: { label: "Customer Q: no contract, strong relationship", s: { emotional: 3, economic: 2, contractual: 0 } as Record<Rope, number> },
};
const TRIGGERS: Record<Rope, string> = { economic: "Competitor −12% price", emotional: "Key contact leaves", contractual: "Contract expires" };
const ANCHOR: Record<Rope, { x: number; y: number; label: string }> = {
  emotional: { x: 90, y: 60, label: "A named contact" },
  economic: { x: 550, y: 60, label: "Integration, retraining" },
  contractual: { x: 320, y: 290, label: "Framework agreement, notice period" },
};

function ThreeRopes() {
  const uid = useId().replace(/:/g, "");
  const [who, setWho] = useState<"P" | "Q">("P");
  const [frayed, setFrayed] = useState<Rope[]>([]);
  const c = CUSTOMERS[who];
  const strength = (r: Rope) => (frayed.includes(r) ? 0 : c.s[r]);
  const holding = ROPES.filter((r) => strength(r) >= 2);
  const toggle = (r: Rope) => setFrayed((f) => (f.includes(r) ? f.filter((x) => x !== r) : [...f, r]));
  return (
    <div className="space-y-3">
      <Toggles label="Demo customer" value={who} onChange={(id) => { setWho(id); setFrayed([]); }} options={[{ id: "P", label: "Customer P" }, { id: "Q", label: "Customer Q" }]} />
      <p className="text-caption text-ash">{c.label}.</p>
      <svg viewBox="0 0 640 330" className="h-auto w-full" role="img" aria-labelledby={`${uid}-t ${uid}-d`}>
        <title id={`${uid}-t`}>Three ropes</title>
        <desc id={`${uid}-d`}>A customer node held by an emotional, an economic and a contractual rope. Rope thickness shows how strongly it holds; a frayed rope is thin and dashed.</desc>
        {ROPES.map((r) => {
          const a = ANCHOR[r];
          const s = strength(r);
          const broke = frayed.includes(r);
          return (
            <g key={r}>
              <line x1="320" y1="165" x2={a.x} y2={a.y} stroke={broke ? "#A4472A" : "#2F5D62"} strokeWidth={broke ? 2 : s === 0 ? 1.5 : 3 + s * 3} strokeDasharray={broke ? "3 7" : s === 0 ? "2 6" : undefined} strokeLinecap="round" style={{ transition: "stroke-width .4s" }} />
              <rect x={a.x - 62} y={a.y - 18} width="124" height="36" rx="5" fill="#FFFEFA" stroke="#59606A" />
              <text x={a.x} y={a.y - 2} textAnchor="middle" fontSize="12.5" fontWeight="700" fill="#1F2328">{r[0].toUpperCase() + r.slice(1)}</text>
              <text x={a.x} y={a.y + 12} textAnchor="middle" fontSize="10" fill="#59606A">{s === 0 ? (broke ? "frayed" : "absent") : `strength ${s} of 3`}</text>
            </g>
          );
        })}
        <circle cx="320" cy="165" r="44" fill="#1F2328" />
        <text x="320" y="170" textAnchor="middle" fontSize="15" fontWeight="700" fill="#FFFEFA">Customer {who}</text>
        {ROPES.map((r) => (<text key={r} x={ANCHOR[r].x} y={ANCHOR[r].y + (r === "contractual" ? 36 : 34)} textAnchor="middle" fontSize="10.5" fill="#59606A">{ANCHOR[r].label}</text>))}
      </svg>
      <div className="space-y-1.5">
        <p className="smallcaps">Trigger <Exploratory /></p>
        <Toggles multi label="Triggers" value={frayed} onChange={toggle} options={ROPES.map((r) => ({ id: r, label: TRIGGERS[r] }))} />
        <p aria-live="polite" className="text-caption text-ash">
          {holding.length === 0 ? "No rope holds firmly now." : `Still holding firmly: ${holding.join(", ")}.`} Each rope breaks under a different trigger, and a trigger on a rope that was already thin changes little.
        </p>
      </div>
    </div>
  );
}

export function CardA3() {
  return (
    <MaterialCard
      id="A3"
      scan="Customers are held by three different ropes, and each rope breaks under a different trigger."
      sources={["mayer1995", "morgan1994", "gustafsson2005"]}
      reasoning={[
        "Name the rope before the fix: contact that has stopped is an emotional-rope problem; a rival's discount is an economic one; a term that ends is a contractual one.",
        "Retention that rests only on economic or contractual ropes is the “hostage / spurious” case from A2, not loyalty.",
        "A data signal points at a rope: contact cadence and sponsor continuity for emotional; the TCO gap versus switching cost for economic; end date and notice window for contractual.",
      ]}
    >
      <Diagram label="Three ropes" caption="Two demo customers, three triggers. Select a trigger to fray its rope.">
        <ThreeRopes />
      </Diagram>
      <DataTable
        caption="Three types of retention"
        head={["Type", "What holds the customer", "Anchor", "B2B IT example", "Breaks when", "Data signal"]}
        rows={[
          ["Emotional", "Trust and affinity", <>Affective commitment; trust = ability, benevolence, integrity (<strong>Mayer, Davis &amp; Schoorman 1995</strong>); commitment-trust theory (<strong>Morgan &amp; Hunt 1994</strong>)</>, "A named contact the customer relies on", "The contact leaves, or silence follows go-live", "Contact cadence, sponsor continuity"],
          ["Economic", "Rational calculation", <>Calculative commitment: leaving costs more than staying (<strong>Gustafsson, Johnson &amp; Roos 2005</strong>)</>, "Integration, retraining, re-certification effort", "A rival's discount exceeds the switching cost", "TCO gap vs switching cost"],
          ["Contractual", "Formal obligation", <>Framework agreement (<em>Rahmenvertrag</em>), managed-service term, notice period (<em>Kündigungsfrist</em>)</>, "A 3-year service contract with 6-month notice", "The term ends, so renewal becomes a new procurement event", "Contract end date, notice window"],
        ]}
      />
      <Bul items={["Gustafsson et al. (2005) separate affective from calculative commitment and study triggers such as price increases and service failures."]} />
    </MaterialCard>
  );
}

/* ------------------------------------------------------------------ A4 */

const STAGES4 = ["Ausschreibung", "Delivery", "Go-live", "Hypercare", "Operate"];
const LINES = {
  decay: { label: "Without renewed value", v: [2, 9, 7, 5, 3], color: "#A4472A", dash: undefined as string | undefined },
  hold: { label: "With renewed value", v: [2, 9, 8, 8, 8], color: "#0F6B6B", dash: "8 5" },
};

function SwitchingCurve() {
  const uid = useId().replace(/:/g, "");
  const [on, setOn] = useState<("decay" | "hold")[]>(["decay", "hold"]);
  const [ref, seen] = useInView<HTMLDivElement>();
  const x = (i: number) => 90 + i * 130;
  const y = (v: number) => 220 - v * 18;
  return (
    <div ref={ref} className="space-y-3">
      <Toggles multi label="Lines" value={on} onChange={(id) => setOn((o) => (o.includes(id) ? o.filter((k) => k !== id) : [...o, id]))} options={[{ id: "decay", label: "Without renewed value" }, { id: "hold", label: "With renewed value" }]} />
      <svg viewBox="0 0 640 290" className="h-auto w-full" role="img" aria-labelledby={`${uid}-t ${uid}-d`}>
        <title id={`${uid}-t`}>Switching-cost curve</title>
        <desc id={`${uid}-d`}>Switching cost across five stages. Without renewed value it peaks in delivery and decays; with renewed value it holds. A working model, not a measured law.</desc>
        <line x1="60" x2="60" y1="30" y2="222" stroke="#59606A" /><line x1="60" x2="620" y1="222" y2="222" stroke="#59606A" />
        <text x="14" y="130" fontSize="12" fill="#59606A" transform="rotate(-90 14 130)" textAnchor="middle">Switching cost (relative, illustrative)</text>
        {STAGES4.map((s, i) => (<text key={s} x={x(i)} y="246" textAnchor="middle" fontSize="12.5" fill="#1F2328">{s}</text>))}
        {(Object.keys(LINES) as ("decay" | "hold")[]).filter((k) => on.includes(k)).map((k) => (
          <g key={k}>
            <path d={LINES[k].v.map((v, i) => `${i ? "L" : "M"}${x(i)},${y(v)}`).join(" ")} fill="none" stroke={LINES[k].color} strokeWidth="3.4" strokeDasharray={seen ? LINES[k].dash : undefined} pathLength={LINES[k].dash ? undefined : 1} className={!LINES[k].dash && seen ? "anim-draw" : undefined} />
            {LINES[k].v.map((v, i) => (<circle key={i} cx={x(i)} cy={y(v)} r="4.5" fill={LINES[k].color} />))}
          </g>
        ))}
        <text x={x(1)} y={y(9) - 12} textAnchor="middle" fontSize="12" fontWeight="700" fill="#1F2328">peak while delivering</text>
      </svg>
    </div>
  );
}

export function CardA4() {
  return (
    <MaterialCard
      id="A4"
      scan="Switching costs are highest while you deliver and tend to fall after handover unless value is renewed."
      sources={["burnham2003", "jones1995"]}
      reasoning={[
        "Separate the three types: procedural (time and effort), financial (money and benefits lost), relational (people and brand lost). A rival's discount has to beat all three.",
        "The decay after handover is a working model, not a measured law: use it to ask what renews value, not to predict a date.",
      ]}
    >
      <Diagram label="Switching-cost curve" caption="Switch the two lines on and off.">
        <SwitchingCurve />
      </Diagram>
      <Bul items={[<><strong>Burnham, Frels &amp; Mahajan (2003)</strong> typology: <strong>procedural</strong> (economic risk, evaluation, learning, setup), <strong>financial</strong> (benefit loss, monetary loss), <strong>relational</strong> (personal and brand relationship loss).</>]} />
      <DataTable
        caption="IT mapping"
        head={["In an IT project", "Type"]}
        rows={[
          ["Learning a new operator's tooling", "Procedural · learning"],
          ["Environment discovery and onboarding", "Procedural · setup"],
          ["Re-running a tender", "Procedural · evaluation"],
          ["Uncertainty about a new supplier's performance", "Procedural · economic risk"],
          ["Exit fees or lost discounts", "Financial"],
          ["Losing a trusted contact", "Relational"],
        ]}
      />
      <Callout label="Working model — reasoning, not a measured law">
        <p>In project business, switching cost peaks during delivery (fresh integration, undocumented know-how) and decays after handover when documentation moves to the client and tacit knowledge fades. Jones &amp; Sasser (1995): barriers produce hostages, and when the barrier falls defection can be fast.</p>
      </Callout>
    </MaterialCard>
  );
}
