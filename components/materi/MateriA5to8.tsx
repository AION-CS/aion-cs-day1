"use client";

import { useId, useState } from "react";
import clsx from "clsx";
import { DataTable, MaterialCard, Callout } from "@/components/ui/MaterialCard";
import { Bul, Diagram, Exploratory, Insight } from "@/components/materi/kit";
import { JourneyMap } from "@/components/ui/JourneyMap";
import type { JPoint, JStage } from "@/components/ui/JourneyMap";
import { BINS } from "@/data/kesslerDossier";

/* ------------------------------------------------------------------ A5 */

const GENERIC_STAGES: JStage[] = [
  { id: "need", label: "Need & tender (Ausschreibung)", from: 0, to: 1, hover: "Need & tender (Ausschreibung, formal tender). Pre-purchase.", owner: "Sales" },
  { id: "offer", label: "Offer & negotiation", from: 1, to: 2, hover: "Offer & negotiation. Pre-purchase.", owner: "Sales" },
  { id: "contract", label: "Contract", from: 2, to: 3, hover: "Contract. Purchase.", owner: "Sales" },
  { id: "delivery", label: "Delivery", from: 3, to: 4, hover: "Delivery. Post-purchase.", owner: "Delivery PM" },
  { id: "golive", label: "Go-live & hypercare", from: 4, to: 5, hover: "Go-live & hypercare. Post-purchase.", owner: "Delivery PM" },
  { id: "operate", label: "Operate & review", from: 5, to: 6, hover: "Operate & review. The stretch most project firms do not staff.", owner: "Often unassigned", ownerTone: "gap" },
  { id: "renewal", label: "Renewal / re-tender", from: 6, to: 7, hover: "Renewal / re-tender: the next purchase is shortlisted before it is announced.", owner: "Sales" },
];
const GENERIC_POINTS: JPoint[] = [
  { id: "p1", at: 0.5, stageId: "need", owner: "customer", label: "Customer research" },
  { id: "p2", at: 1.5, stageId: "offer", owner: "brand", label: "Proposal" },
  { id: "p3", at: 2.5, stageId: "contract", owner: "brand", label: "Contract meeting" },
  { id: "p4", at: 3.5, stageId: "delivery", owner: "brand", label: "Project reports" },
  { id: "p5", at: 4.5, stageId: "golive", owner: "partner", label: "Platform partner" },
  { id: "p6", at: 5.5, stageId: "operate", owner: "customer", label: "Internal review" },
  { id: "p7", at: 6.5, stageId: "renewal", owner: "social", label: "Peer opinion" },
];

export function CardA5() {
  return (
    <MaterialCard
      id="A5"
      scan="The next purchase is shortlisted in the stretch of the journey that most project firms do not staff."
      sources={["lemon2016", "gartner2017"]}
      reasoning={[
        "Read a journey by stage and by owner: for each stage ask who on your side owns it, and what record shows contact in it.",
        "A gap between two touchpoints is not empty for the buyer: buyers spend about 17% of buying time meeting suppliers, and the rest on independent research and internal alignment.",
      ]}
    >
      <Diagram label="B2B journey" caption="The same JourneyMap component is used in Task 1 with the Kessler file. Select a stage for its caption.">
        <JourneyMap
          title="B2B journey"
          desc="Seven stages of a B2B IT project from need and tender to renewal or re-tender, touchpoints coloured and patterned by owner, and a marker of who owns each stage."
          min={0}
          max={7}
          ticks={[{ at: 1, label: "Pre-purchase" }, { at: 2.5, label: "Purchase" }, { at: 5, label: "Post-purchase" }]}
          stages={GENERIC_STAGES}
          points={GENERIC_POINTS}
          showOwners
        />
        <p className="mt-2 text-micro normal-case tracking-normal text-ash">Who owns each stage is a practitioner observation, not a statistic.</p>
      </Diagram>
      <Bul
        items={[
          <><strong>Lemon &amp; Verhoef (2016):</strong> the journey runs across pre-purchase, purchase and post-purchase; touchpoints are brand-owned, partner-owned, customer-owned, or social/external.</>,
          <>B2B IT project stages (used in Task 1): Need &amp; tender (<em>Ausschreibung</em>) → Offer &amp; negotiation → Contract → Delivery → Go-live &amp; hypercare → Operate &amp; review → Renewal / re-tender.</>,
          <><strong>Gartner (2017 Digital B2B Buyer Survey, n = 750):</strong> buyers spend about <strong>17% of buying time meeting suppliers</strong>; the rest is independent research and internal alignment. What happens between your touchpoints is where the next shortlist forms.</>,
        ]}
      />
    </MaterialCard>
  );
}

/* ------------------------------------------------------------------ A6 */

const RUNGS = [
  { id: "action", label: "Actions", desc: "What you then do.", ex: "“Demand prepayment.”" },
  { id: "belief", label: "Beliefs", desc: "General beliefs the conclusion feeds.", ex: "“Late-paying customers are unreliable.”" },
  { id: "concl", label: "Conclusions", desc: "What you decide the situation means.", ex: "“Alpenwerk is a credit risk.”" },
  { id: "assume", label: "Assumptions", desc: "Unstated claims you rely on. Here the cause enters.", ex: "“Alpenwerk pays late because it is in financial trouble.”" },
  { id: "meaning", label: "Added meanings", desc: "Meaning added to what you selected.", ex: "“Alpenwerk pays slowly.”" },
  { id: "select", label: "Selected data", desc: "The part of the record you notice.", ex: "“I notice the late payment.”" },
  { id: "obs", label: "Observable data", desc: "What a record shows, without the speaker.", ex: "“Invoice 2231 was paid 41 days after issue (terms: 30 days).”" },
];

function Ladder() {
  const uid = useId().replace(/:/g, "");
  const [sel, setSel] = useState("obs");
  const r = RUNGS.find((x) => x.id === sel)!;
  return (
    <div className="grid gap-4 md:grid-cols-[minmax(0,340px)_1fr] md:items-center">
      <svg viewBox="0 0 340 396" className="mx-auto h-auto w-full max-w-[340px]" role="group" aria-labelledby={`${uid}-t ${uid}-d`}>
        <title id={`${uid}-t`}>Ladder of inference</title>
        <desc id={`${uid}-d`}>Seven rungs from observable data at the bottom to actions at the top. Select a rung to read what it means, with an example.</desc>
        <line x1="34" x2="34" y1="6" y2="390" stroke="#59606A" strokeWidth="5" strokeLinecap="round" />
        <line x1="306" x2="306" y1="6" y2="390" stroke="#59606A" strokeWidth="5" strokeLinecap="round" />
        {RUNGS.map((g, i) => {
          const y = 8 + i * 55;
          const on = g.id === sel;
          const evidence = g.id === "obs";
          return (
            <g key={g.id} className="hit" role="button" tabIndex={0} aria-pressed={on} aria-label={g.label} onClick={() => setSel(g.id)}
              onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); setSel(g.id); } }}>
              <rect x="34" y={y} width="272" height="48" rx="6" fill={on ? "#FBF0D6" : evidence ? "#DFEEEB" : "#FFFEFA"} stroke={on ? "#8A5A0B" : "#59606A"} strokeWidth={on ? 2.6 : 1.4} className="hit-shape" />
              <text x="52" y={y + 29} fontSize="14.5" fontWeight="700" fill="#1F2328">{7 - i}. {g.label}</text>
            </g>
          );
        })}
      </svg>
      <div aria-live="polite" className="space-y-2 rounded-lg border border-line bg-paper p-4 text-body">
        <p className="smallcaps">Rung {7 - RUNGS.indexOf(r)} of 7</p>
        <h4 className="font-semibold">{r.label}</h4>
        <p className="text-caption text-ash">{r.desc}</p>
        <p className="text-caption">Example (Alpenwerk GmbH, illustrative): <em>{r.ex}</em></p>
        <Insight>
          {r.id === "obs"
            ? "Only this rung survives without the speaker. Everything above it is interpretation — a claim that needs its own evidence before you can rely on it."
            : `Climbing to "${r.label}" adds something the record itself does not say. Before acting on it, trace back down to rung 1 and ask what observable data actually supports it.`}
        </Insight>
      </div>
    </div>
  );
}

const TRY: { text: string; answer: "obs" | "int"; why: string }[] = [
  { text: "Invoice 2231 was paid 41 days after issue (terms: 30 days).", answer: "obs", why: "A dated record anyone can open: two readers of the invoice would agree." },
  { text: "Alpenwerk pays late because it is in financial trouble.", answer: "int", why: "It names a cause that the invoice record itself does not show." },
  { text: "The project log records that the go-live date moved by two weeks.", answer: "obs", why: "Someone recorded it, in a named document; it survives without the speaker." },
  { text: "Alpenwerk's IT lead has lost interest in the project.", answer: "int", why: "It is a claim about a state of mind. No record in the file shows it." },
];

function TryIt() {
  const [tags, setTags] = useState<Record<number, "obs" | "int">>({});
  const [shown, setShown] = useState<Record<number, boolean>>({});
  return (
    <div className="space-y-2 rounded-lg border border-line bg-paper p-3">
      <p className="smallcaps">Try it — Alpenwerk GmbH <Exploratory /> · not exported</p>
      <ul className="space-y-3">
        {TRY.map((t, i) => (
          <li key={i} className="space-y-1.5 text-caption">
            <p className="text-body">“{t.text}”</p>
            <div className="flex flex-wrap items-center gap-2">
              {(["obs", "int"] as const).map((k) => (
                <button key={k} type="button" aria-pressed={tags[i] === k} onClick={() => setTags((s) => ({ ...s, [i]: k }))}
                  className={clsx("btn btn-sm min-h-[40px] border", tags[i] === k ? "border-accent bg-accentSoft text-ink" : "border-line bg-paper text-ash hover:border-ash")}>
                  {k === "obs" ? "Observation" : "Interpretation"}
                </button>
              ))}
              <button type="button" onClick={() => setShown((s) => ({ ...s, [i]: true }))} className="btn-ghost btn-sm min-h-[40px]">Reveal</button>
            </div>
            {shown[i] && (
              <Insight className="fade-in">
                {tags[i] ? `You tagged ${tags[i] === "obs" ? "observation" : "interpretation"}. ` : ""}
                It is an <strong>{t.answer === "obs" ? "observation" : "interpretation"}</strong>: {t.why}
              </Insight>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export function CardA6() {
  return (
    <MaterialCard
      id="A6"
      scan="Evidence is a record that survives without the speaker. Everything else is interpretation."
      sources={["argyris1990", "senge1990", "minto2009", "mayer1995", "anderson2006"]}
      reasoning={[
        "Test a sentence with the three tests: who recorded it, when, in which document? Would two readers of the same record agree? Does it name a cause the record itself does not show?",
        "A personal comment (a note, a handover remark) is an interpretation unless a record in the file shows the cause it names. It may exist as a note; it is not evidence.",
        "Sort by what the record is about: money → Price; deadlines kept and incidents handled → Trust; the outcome the customer rates → Benefit; continuity of people, cadence and ownership → Relationship.",
        "A record can be a fact about a rival's price and still not be the weak point on your side: name the category holding the most observed evidence of a shortfall on TechSolutions' side, and cite records, not remarks.",
      ]}
    >
      <Diagram label="Ladder of inference" caption="Select a rung. The bottom rung is the only one that is a record.">
        <Ladder />
      </Diagram>
      <Bul
        items={[
          <><strong>Ladder of inference</strong> (<strong>Argyris 1990</strong>, popularised by <strong>Senge 1990</strong>): observable data → selected data → added meanings → assumptions → conclusions → beliefs → actions.</>,
          <>Three tests (form only): <em>Who recorded it, when, in which document? Would two readers of the same record agree? Does the sentence name a cause the record itself does not show?</em></>,
          <><strong>MECE</strong> (<strong>Minto 2009</strong>): categories that do not overlap and together cover the field.</>,
        ]}
      />
      <div className="rounded-lg border border-accent/40 bg-accentSoft p-3">
        <p className="smallcaps text-accent">Sorting key for Task 1 · five bins</p>
        <dl className="mt-2 grid gap-2 md:grid-cols-2">
          {BINS.map((b) => (
            <div key={b.id} className="rounded-md bg-paper px-3 py-2 text-caption">
              <dt className="font-bold">{b.label}</dt>
              <dd className="text-ash">
                {b.definition}
                {b.id === "trust" && " (Mayer et al. 1995)"}
                {b.id === "benefit" && " (Anderson, Narus & van Rossum 2006)"}
              </dd>
            </div>
          ))}
        </dl>
      </div>
      <TryIt />
    </MaterialCard>
  );
}

/* ------------------------------------------------------------------ A7 */

const TREE = [
  { q: "Is the message advertising?", no: "Not advertising. Keep service messages (hypercare, security advisories) separate from advertising." },
  { q: "Was the address obtained in connection with a sale?", no: "Consent is needed." },
  { q: "Is it used for your own similar products or services?", no: "Consent is needed." },
  { q: "Was the customer informed of the opt-out at collection and at every use, and has not objected?", no: "Consent is needed." },
];

function MaySend() {
  const uid = useId().replace(/:/g, "");
  const [ans, setAns] = useState<boolean[]>([]);
  const stepIdx = ans.findIndex((a) => !a);
  const endedAt = stepIdx === -1 ? (ans.length === TREE.length ? "yes" : null) : stepIdx;
  const outcome = endedAt === "yes" ? "Allowed under § 7(3) UWG." : endedAt === null ? null : TREE[endedAt as number].no;
  const active = endedAt === null ? ans.length : endedAt === "yes" ? TREE.length : (endedAt as number);
  const answer = (v: boolean) => setAns((a) => [...a, v]);
  return (
    <div className="grid gap-4 md:grid-cols-[minmax(0,320px)_1fr]">
      <svg viewBox="0 0 320 340" className="mx-auto h-auto w-full max-w-[320px]" role="img" aria-labelledby={`${uid}-t ${uid}-d`}>
        <title id={`${uid}-t`}>May we send this?</title>
        <desc id={`${uid}-d`}>A decision tree with four questions. Every yes leads to the next question; the fourth yes ends in allowed under section 7(3) UWG; any no ends in consent needed.</desc>
        {TREE.map((n, i) => {
          const y = 8 + i * 62;
          const reached = i <= active && (endedAt === null || (endedAt !== "yes" && i <= (endedAt as number)) || endedAt === "yes");
          const isNow = i === active && endedAt === null;
          return (
            <g key={i}>
              <rect x="10" y={y} width="210" height="44" rx="6" fill={isNow ? "#FBF0D6" : reached ? "#DFEEEB" : "#FFFEFA"} stroke={isNow ? "#8A5A0B" : "#59606A"} strokeWidth={isNow ? 2.6 : 1.4} className={isNow ? "anim-pulse" : undefined} />
              <text x="20" y={y + 27} fontSize="12" fontWeight="700" fill="#1F2328">{i + 1}. {["Advertising?", "From a sale?", "Similar own products?", "Opt-out informed, no objection?"][i]}</text>
              {i < TREE.length - 1 && <path d={`M115,${y + 44} L115,${y + 62}`} stroke={ans[i] === true ? "#0F6B6B" : "#59606A"} strokeWidth="2.4" strokeDasharray="1" pathLength={1} className={ans[i] === true ? "anim-draw" : undefined} fill="none" />}
              <path d={`M220,${y + 22} L266,${y + 22}`} stroke={ans[i] === false ? "#A4472A" : "#D8D1BF"} strokeWidth="2.4" pathLength={1} strokeDasharray={ans[i] === false ? "1" : "0.06 0.06"} className={ans[i] === false ? "anim-draw" : undefined} fill="none" />
              <text x="270" y={y + 26} fontSize="11" fill="#59606A">{i === 0 ? "no" : "no"}</text>
            </g>
          );
        })}
        <rect x="10" y="256" width="250" height="44" rx="6" fill={endedAt === "yes" ? "#DFEEEB" : "#FFFEFA"} stroke={endedAt === "yes" ? "#0F6B6B" : "#59606A"} strokeWidth={endedAt === "yes" ? 2.6 : 1.4} />
        <text x="20" y="283" fontSize="12" fontWeight="700" fill="#1F2328">Allowed under § 7(3) UWG</text>
        <path d="M115,228 L115,256" stroke={ans[3] === true ? "#0F6B6B" : "#59606A"} strokeWidth="2.4" fill="none" />
      </svg>
      <div className="space-y-3">
        <div aria-live="polite" className="rounded-lg border border-line bg-paper p-4">
          {outcome ? (
            <>
              <p className="smallcaps">Result</p>
              <p className={clsx("text-body font-semibold", endedAt === "yes" ? "text-signal" : "text-ink")}>{outcome}</p>
            </>
          ) : (
            <>
              <p className="smallcaps">Question {ans.length + 1} of 4</p>
              <p className="text-body font-semibold">{TREE[ans.length].q}</p>
              <div className="mt-2 flex gap-2">
                <button type="button" onClick={() => answer(true)} className="btn-primary btn-sm min-h-[44px] min-w-[80px]">Yes</button>
                <button type="button" onClick={() => answer(false)} className="btn-ghost btn-sm min-h-[44px] min-w-[80px]">No</button>
              </div>
            </>
          )}
        </div>
        <button type="button" onClick={() => setAns([])} className="btn-ghost btn-sm">Start again</button>
        <p className="text-micro normal-case tracking-normal text-ash">A walk-through of the rule of thumb, not legal advice.</p>
      </div>
    </div>
  );
}

export function CardA7() {
  return (
    <MaterialCard
      id="A7"
      scan="Retention needs contact, and contact needs a legal basis."
      sources={["gdpr", "uwg7"]}
      reasoning={[
        "Advertising email to a business address needs prior consent in Germany. B2B is not exempt.",
        "The existing-customer exception, § 7(3) UWG, needs all four conditions. Miss one and consent is needed.",
        "Keep service messages separate from advertising.",
      ]}
    >
      <Diagram label="May we send this?" caption="Answer the four questions to walk the path.">
        <MaySend />
      </Diagram>
      <Bul
        items={[
          <>Business contact data (name@company) is personal data under GDPR. <strong>Art. 6(1)(f)</strong> legitimate interest (Recital 47 recognises direct marketing as a possible legitimate interest); <strong>Art. 21(2)–(3)</strong> right to object to direct marketing; <strong>Art. 5(1)(c) and (e)</strong> data minimisation and storage limitation. Stale contact data is both a retention problem and a compliance problem.</>,
          <>Email advertising in Germany (<strong>§ 7 UWG</strong>) requires prior consent. B2B is not exempt. The existing-customer exception <strong>§ 7(3) UWG</strong> needs all four: address obtained in connection with a sale; used for own similar products/services; no objection; clear opt-out information at collection and at every use.</>,
          <>Working rule: keep service messages (hypercare, security advisories) separate from advertising.</>,
        ]}
      />
      <Callout label="Rules of thumb, not legal advice">
        <p>Involve the <em>Datenschutzbeauftragter</em> (data protection officer).</p>
      </Callout>
    </MaterialCard>
  );
}

/* ------------------------------------------------------------------ A8 */

export function CardA8() {
  const steps = ["Read", "Tag", "Sort", "Name"];
  return (
    <MaterialCard
      id="A8"
      scan="Four steps, fifteen minutes: Read → Tag → Sort → Name."
      sources={["minto2009"]}
      reasoning={["Read every record, tag each as observation or interpretation, sort into the five bins, then name the category with the most observed evidence of a shortfall and cite two records."]}
    >
      <svg viewBox="0 0 640 90" className="h-auto w-full" role="img" aria-label="Field method: Read, Tag, Sort, Name">
        <title>Field method for Task 1</title>
        {steps.map((s, i) => (
          <g key={s}>
            <rect x={10 + i * 158} y="14" width="130" height="56" rx="8" fill={i === 3 ? "#FBF0D6" : "#FFFEFA"} stroke="#59606A" strokeWidth="1.5" />
            <text x={75 + i * 158} y="48" textAnchor="middle" fontSize="18" fontWeight="700" fill="#1F2328">{i + 1}. {s}</text>
            {i < 3 && <path d={`M${142 + i * 158},42 L${166 + i * 158},42`} stroke="#8A5A0B" strokeWidth="3" fill="none" markerEnd="" />}
          </g>
        ))}
      </svg>
      <p className="text-body"><strong>Time box: 15 minutes.</strong> Task 1 follows directly.</p>
    </MaterialCard>
  );
}
