"use client";

import { useId, useState } from "react";
import { DataTable, MaterialCard, Callout } from "@/components/ui/MaterialCard";
import { Bul, Diagram } from "@/components/materi/kit";
import { TcoStack } from "@/components/ui/TcoStack";
import { ALPENWERK_TCO } from "@/data/offers";

/* ------------------------------------------------------------------ B4 */

function CostExplorer() {
  const [on, setOn] = useState<Record<string, boolean>>({});
  const [ale, setAle] = useState(false);
  return (
    <TcoStack
      data={ALPENWERK_TCO}
      on={on}
      onToggle={(id, v) => setOn((s) => ({ ...s, [id]: v }))}
      title="Cost explorer, Alpenwerk"
      desc="Stacked cash bars for Offer X and Offer Y. Adding onboarding ties the offers; adding internal effort makes Y cheaper."
      controls={
        <div className="space-y-2">
          <label className="flex min-h-[44px] cursor-pointer items-center gap-2.5 rounded-lg border border-line bg-paper px-3 py-2 text-caption">
            <input type="checkbox" checked={ale} onChange={(e) => setAle(e.target.checked)} className="h-4 w-4 accent-[#8A5A0B]" />
            <span className="font-semibold">Show the expected-loss formula (non-cash)</span>
          </label>
          {ale && (
            <div className="fade-in rounded-lg border border-dashed border-rust bg-paper p-3 text-caption">
              <p className="tnum font-semibold">ALE = SLE × ARO = €150,000 × 0.04 = €6,000 per year</p>
              <p className="text-ash">An expected value, not a cash outlay: it sits on no budget line, so it never enters the cash bars above. Label every input measured or assumed.</p>
            </div>
          )}
        </div>
      }
    />
  );
}

export function CardB4() {
  return (
    <MaterialCard
      id="B4"
      scan="A lower headline price can cost more in total, and a risk figure is an expected value, not a budget line."
      sources={["ibm2025"]}
      reasoning={[
        "Compute total cost over the term, not the headline: fees + one-time transition + internal effort + variable service costs. Convert days → hours → euros and state whether a number is per year or per term.",
        "The cheapest offer on a capped budget line is not necessarily the cheapest in total; a cap applies to the line it sits on, per year.",
        "Expected loss (ALE = SLE × ARO) is an expected value, not cash: keep it out of the cash total and label each input measured or assumed.",
        "Benchmarks (IBM / Ponemon) are context, not inputs: a single-loss estimate for a mid-sized plant must state its own scale assumption.",
      ]}
    >
      <Diagram label="Cost explorer" caption="Alpenwerk data (Case assumption). Task 2 reuses this TcoStack with the Kessler offers.">
        <CostExplorer />
      </Diagram>
      <Bul
        items={[
          <><strong>Total cost over the term:</strong> <code>TCO(3y) = fees + one-time transition + internal effort + variable service costs</code>. Watch units: convert days → hours → euros, and state whether a number is per year or per term.</>,
          <><strong>Worked example (Alpenwerk GmbH, Case assumption):</strong> Offer X: fees €90,000 + onboarding €6,000 = €96,000. Offer Y: €96,000, no onboarding. Tied. Add Alpenwerk&apos;s internal effort for X (20 h × €80 = €1,600): X = €97,600, Y is €1,600 cheaper.</>,
          <><strong>Risk exposure:</strong> <code>ALE = SLE × ARO</code> (single-loss expectancy × annual rate of occurrence), a classic quantitative risk formula. Example: SLE €150,000 × ARO 0.04 = <strong>€6,000 per year</strong>. ALE is an <strong>expected value, not a cash outlay</strong>: it appears on no budget line. Label every input <em>measured</em> or <em>assumed</em>.</>,
          <><strong>Budget lines:</strong> buyers often face a cap on one line (for example recurring IT fees) while one-off and ad-hoc costs sit on other lines. The cheapest offer on the capped line is not necessarily the cheapest in total (practitioner observation).</>,
        ]}
      />
      <DataTable
        caption="Benchmarks"
        head={["IBM / Ponemon, Cost of a Data Breach Report 2025", "2025", "2024"]}
        rows={[
          ["Germany, average breach", "€3.87M", "€4.9M"],
          ["Global, average breach", "US$4.44M", "—"],
          ["German industrial companies", "€6.67M", "€9.34M"],
        ]}
      />
      <Callout label="Benchmarks are context, not inputs">
        <p>These are averages across breached organisations in IBM&apos;s sample; a single-loss estimate for a mid-sized plant must state its own scale assumption.</p>
      </Callout>
    </MaterialCard>
  );
}

/* ------------------------------------------------------------------ B5 */

function SmallNumbers() {
  const uid = useId().replace(/:/g, "");
  const dots = Array.from({ length: 30 }, (_, i) => i);
  return (
    <svg viewBox="0 0 640 180" className="h-auto w-full" role="img" aria-labelledby={`${uid}-t ${uid}-d`}>
      <title id={`${uid}-t`}>One observation against an unknown base rate</title>
      <desc id={`${uid}-d`}>One filled dot is the one customer observed. Thirty outlined dots are customers nobody has observed. A rate cannot be read from one dot.</desc>
      <text x="30" y="26" fontSize="13" fontWeight="700" fill="#1F2328">What we observed</text>
      <circle cx="46" cy="60" r="16" fill="#8A5A0B" stroke="#FFFEFA" strokeWidth="3" />
      <text x="72" y="65" fontSize="13" fill="#1F2328">Kessler: 1 customer</text>
      <text x="330" y="26" fontSize="13" fontWeight="700" fill="#1F2328">What the portfolio holds</text>
      {dots.map((i) => (
        <circle key={i} cx={342 + (i % 10) * 27} cy={54 + Math.floor(i / 10) * 30} r="9" fill="#FFFEFA" stroke="#59606A" strokeWidth="1.5" strokeDasharray="3 3" />
      ))}
      <text x="330" y="162" fontSize="12" fill="#59606A">Not observed: no base rate</text>
    </svg>
  );
}

export function CardB5() {
  return (
    <MaterialCard
      id="B5"
      scan="One customer is an anecdote, not a base rate."
      sources={["tversky1971"]}
      reasoning={[
        "Separate measured from assumed inputs before you calculate.",
        "If a number needs a sample you do not have, “cannot be calculated from this data” is the correct answer, not a shortfall.",
        "State a limit in this form: “This figure holds for ___ under ___. It does not tell us ___ because ___.”",
      ]}
    >
      <Diagram label="One observation">
        <SmallNumbers />
      </Diagram>
      <Bul
        items={[
          <><strong>Tversky &amp; Kahneman (1971):</strong> belief in the law of small numbers, i.e. small samples are treated as if they were representative.</>,
          "Separate measured from assumed inputs. If a number needs a sample you do not have, “cannot be calculated from this data” is the correct answer.",
          <>Form for stating a limit (form only): <em>“This figure holds for ___ under ___. It does not tell us ___ because ___.”</em></>,
        ]}
      />
    </MaterialCard>
  );
}

/* ------------------------------------------------------------------ B6 */

const STEPS = [
  { id: "observe", label: "Observe", text: "Read the records and separate observation from interpretation (A6). Influence starts from what the file shows." },
  { id: "hyp", label: "Hypothesise motive", text: "Treat the buyer's motive as a hypothesis: Security, Efficiency, Innovation or Status (B3). Do not read it from the job title." },
  { id: "ask", label: "Ask", text: "SPIN (Rackham 1988): Situation, Problem, Implication, Need-payoff questions. In large, long-cycle sales, Implication and Need-payoff questions were the ones associated with success (Huthwaite study, commonly cited as about 35,000 calls)." },
  { id: "rec", label: "Recommend", text: "JOLT (Dixon & McKenna 2022): Judge the indecision, then Offer a recommendation. A buyer afraid of a mistake needs a view, not a longer list." },
  { id: "risk", label: "Reduce risk", text: "JOLT: Limit exploration, then Take risk off the table, e.g. a pilot phase, an exit clause, a reference call, a fixed-price phase 1." },
  { id: "review", label: "Review", text: "Post-go-live levers used in customer-success practice (no single standard): a named account owner, value-realisation reviews at 30/90/180 days, a quarterly business review (QBR), a health score (usage, contacts, tickets). In Task 2 this is the lever “Care after go-live”." },
];

function Ladder() {
  const uid = useId().replace(/:/g, "");
  const [sel, setSel] = useState("observe");
  const s = STEPS.find((x) => x.id === sel)!;
  return (
    <div className="grid gap-4 md:grid-cols-[minmax(0,340px)_1fr] md:items-center">
      <svg viewBox="0 0 340 330" className="mx-auto h-auto w-full max-w-[340px]" role="group" aria-labelledby={`${uid}-t ${uid}-d`}>
        <title id={`${uid}-t`}>Influence ladder</title>
        <desc id={`${uid}-d`}>Six steps from observing to reviewing. Select a step to read what it means.</desc>
        {STEPS.map((st, i) => {
          const on = st.id === sel;
          const x = 10 + i * 30;
          const y = 8 + i * 52;
          return (
            <g key={st.id} className="hit" role="button" tabIndex={0} aria-pressed={on} aria-label={st.label} onClick={() => setSel(st.id)}
              onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); setSel(st.id); } }}>
              <rect x={x} y={y} width={320 - x + 10} height="46" rx="6" fill={on ? "#FBF0D6" : "#FFFEFA"} stroke={on ? "#8A5A0B" : "#59606A"} strokeWidth={on ? 2.6 : 1.4} className="hit-shape" />
              <text x={x + 14} y={y + 29} fontSize="15" fontWeight="700" fill="#1F2328">{i + 1}. {st.label}</text>
            </g>
          );
        })}
      </svg>
      <div aria-live="polite" className="space-y-1 rounded-lg border border-line bg-paper p-4">
        <p className="smallcaps">Step {STEPS.indexOf(s) + 1} of 6</p>
        <h4 className="font-semibold">{s.label}</h4>
        <p className="text-caption">{s.text}</p>
      </div>
    </div>
  );
}

export function CardB6() {
  return (
    <MaterialCard
      id="B6"
      scan="Influence starts with questions and ends with lower risk for the buyer."
      sources={["rackham1988", "dixon2022"]}
      reasoning={[
        "Match the first move to the buyer's position: ask questions when the motive is a hypothesis; take risk off the table when the buyer fears a mistake; keep contact after go-live when the weak point is continuity.",
        "The lever “Care after go-live” acts on the relationship after go-live (named owner, reviews, QBR, health score). It does not act on price or on a security gap.",
      ]}
    >
      <Diagram label="Influence ladder" caption="Six clickable steps.">
        <Ladder />
      </Diagram>
      <Bul
        items={[
          <><strong>SPIN (Rackham 1988):</strong> Situation, Problem, Implication, Need-payoff questions; in large, long-cycle sales, Implication and Need-payoff questions were the ones associated with success (Huthwaite study, commonly cited as about 35,000 calls).</>,
          <><strong>JOLT (Dixon &amp; McKenna 2022):</strong> Judge the indecision, Offer a recommendation, Limit exploration, Take risk off the table (e.g. pilot phase, exit clause, reference call, fixed-price phase 1).</>,
          <><strong>Post-go-live levers used in customer-success practice (no single standard):</strong> a named account owner, value-realisation reviews at 30/90/180 days, a quarterly business review (QBR), a health score (usage, contacts, tickets). In Task 2 this is the lever <strong>“Care after go-live”</strong>.</>,
        ]}
      />
    </MaterialCard>
  );
}

/* ------------------------------------------------------------------ B7 */

export function CardB7() {
  const steps = ["Read the tables", "Calculate", "Choose", "State the limit"];
  return (
    <MaterialCard
      id="B7"
      scan="Four steps, fifteen minutes: Read the tables → Calculate → Choose → State the limit."
      sources={["tversky1971"]}
      reasoning={["Read the three tables first, then calculate F1–F5, read the four motives, choose an offer citing a figure, and finish by naming what the choice does not fix and what the data cannot answer."]}
    >
      <svg viewBox="0 0 640 90" className="h-auto w-full" role="img" aria-label="Field method: Read the tables, Calculate, Choose, State the limit">
        <title>Field method for Task 2</title>
        {steps.map((s, i) => (
          <g key={s}>
            <rect x={10 + i * 158} y="14" width="140" height="56" rx="8" fill={i === 3 ? "#FBF0D6" : "#FFFEFA"} stroke="#59606A" strokeWidth="1.5" />
            <text x={80 + i * 158} y="48" textAnchor="middle" fontSize="14.5" fontWeight="700" fill="#1F2328">{i + 1}. {s}</text>
            {i < 3 && <path d={`M${152 + i * 158},42 L${166 + i * 158},42`} stroke="#8A5A0B" strokeWidth="3" fill="none" />}
          </g>
        ))}
      </svg>
      <p className="text-body"><strong>Time box: 15 minutes.</strong></p>
    </MaterialCard>
  );
}
