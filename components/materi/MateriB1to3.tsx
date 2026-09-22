"use client";

import { useId, useState } from "react";
import clsx from "clsx";
import { DataTable, MaterialCard, Callout } from "@/components/ui/MaterialCard";
import { Bul, Diagram, Exploratory, Insight, Toggles } from "@/components/materi/kit";
import { MotiveMap } from "@/components/ui/MotiveMap";
import { GARTNER_SPLIT, MOTIVES } from "@/data/motives";
import type { MotiveId } from "@/data/motives";

/* ------------------------------------------------------------------ B1 */

function DecisionScale() {
  const uid = useId().replace(/:/g, "");
  const [saving, setSaving] = useState(3);
  const [gap, setGap] = useState(3);
  const [loss, setLoss] = useState(false);
  const left = saving;
  const right = gap * (loss ? 2 : 1);
  const angle = Math.max(-16, Math.min(16, (right - left) * 4));
  const stack = (n: number, x: number, fill: string, stroke: string) =>
    Array.from({ length: Math.min(n, 10) }, (_, i) => (
      <rect key={i} x={x - 22} y={128 - (i + 1) * 17} width="44" height="15" rx="2" fill={fill} stroke={stroke} strokeWidth="1.2" />
    ));
  return (
    <div className="space-y-3">
      <svg viewBox="0 0 640 260" className="h-auto w-full" role="img" aria-labelledby={`${uid}-t ${uid}-d`}>
        <title id={`${uid}-t`}>Decision scale</title>
        <desc id={`${uid}-d`}>A balance. The left pan holds the saving from the cheaper, less secure offer X; the right pan holds the loss risked with it. Weighting losses twice tips the scale towards the more secure offer Y.</desc>
        <polygon points="320,232 296,250 344,250" fill="#59606A" />
        <line x1="320" y1="70" x2="320" y2="236" stroke="#59606A" strokeWidth="6" strokeLinecap="round" />
        <g style={{ transform: `rotate(${angle}deg)`, transformOrigin: "320px 70px", transition: "transform .5s ease-out" }}>
          <line x1="110" y1="70" x2="530" y2="70" stroke="#1F2328" strokeWidth="6" strokeLinecap="round" />
          <g style={{ transform: `rotate(${-angle}deg)`, transformOrigin: "140px 70px", transition: "transform .5s ease-out" }}>
            <line x1="140" y1="70" x2="140" y2="128" stroke="#59606A" /><rect x="86" y="128" width="108" height="8" fill="#59606A" />
            {stack(left, 140, "#2F5D62", "#1F3F43")}
          </g>
          <g style={{ transform: `rotate(${-angle}deg)`, transformOrigin: "500px 70px", transition: "transform .5s ease-out" }}>
            <line x1="500" y1="70" x2="500" y2="128" stroke="#59606A" /><rect x="446" y="128" width="108" height="8" fill="#59606A" />
            {stack(right, 500, "#FFFEFA", "#A4472A")}
          </g>
        </g>
        <text x="140" y="28" textAnchor="middle" fontSize="13" fontWeight="700" fill="#1F2328">Saving with Offer X</text>
        <text x="500" y="28" textAnchor="middle" fontSize="13" fontWeight="700" fill="#A4472A">Loss risked with Offer X</text>
        <text x="500" y="46" textAnchor="middle" fontSize="11.5" fill="#59606A">{loss ? "weighted ×2" : "weighted ×1"}</text>
      </svg>
      <div className="grid gap-3 md:grid-cols-3">
        {[
          { id: "s", label: "Price saving of X", v: saving, set: setSaving },
          { id: "g", label: "Security gap of X", v: gap, set: setGap },
        ].map((s) => (
          <div key={s.id}>
            <label htmlFor={`${uid}-${s.id}`} className="text-caption font-semibold">{s.label}: <span className="tnum">{s.v}</span></label>
            <input id={`${uid}-${s.id}`} type="range" min={1} max={5} step={1} value={s.v} onChange={(e) => s.set(Number(e.target.value))} className="range-accent" />
          </div>
        ))}
        <div className="flex items-end">
          <button type="button" aria-pressed={loss} onClick={() => setLoss((l) => !l)} className={clsx("btn btn-sm min-h-[44px] w-full border", loss ? "border-accent bg-accentSoft" : "border-line bg-paper")}>
            Weight losses ×2
          </button>
        </div>
      </div>
      <Insight>
        {right === left ? "The pans balance." : right > left ? "The loss side is heavier: the scale leans towards the more secure offer Y." : "The saving side is heavier: the scale leans towards the cheaper offer X."} The blocks are units for illustration, not euros. <Exploratory />
      </Insight>
    </div>
  );
}

export function CardB1() {
  return (
    <MaterialCard
      id="B1"
      scan="Buyers weigh price, trust, risk and benefit, and they weigh risk more heavily than the invoice suggests."
      sources={["bauer1960", "mayer1995", "morgan1994", "anderson2006", "kahneman1979", "samuelson1988", "dixon2022"]}
      reasoning={[
        "“Price” means total cost, not the headline number (see B4).",
        "A cheaper offer is not automatically the better one: buyers act to reduce perceived risk, and a loss weighs more than an equal gain.",
        "“Postpone” is a competitor. In the Dixon & McKenna analysis, 40–60% of qualified deals end in no decision, and most of those reflect fear of making a mistake.",
      ]}
    >
      <Diagram label="Decision scale" caption="Two generic offers: X is cheaper and less secure, Y is pricier and more secure.">
        <DecisionScale />
      </Diagram>
      <Bul
        items={[
          <><strong>Price</strong> means total cost, not the headline (see B4). <strong>Trust:</strong> ability, benevolence, integrity (Mayer et al. 1995); commitment-trust (Morgan &amp; Hunt 1994).</>,
          <><strong>Perceived risk</strong> (<strong>Bauer 1960</strong>): buyers act to reduce perceived risk. Typical risks in IT projects (practitioner categories): performance, financial, time, security/compliance, and the sponsor&apos;s personal or political risk.</>,
          <><strong>Benefit:</strong> customer value propositions (<strong>Anderson, Narus &amp; van Rossum 2006</strong>): all benefits vs favourable points of difference vs resonating focus (the few points that matter most to this customer).</>,
          <><strong>Loss aversion</strong> (<strong>Kahneman &amp; Tversky 1979</strong>) and <strong>status-quo bias</strong> (<strong>Samuelson &amp; Zeckhauser 1988</strong>) explain why “postpone” is a competitor.</>,
          <><strong>Dixon &amp; McKenna (2022)</strong>, <em>The JOLT Effect</em>, analysing 2.5 million sales conversations: <strong>40–60% of qualified deals end in “no decision”</strong>; of those, 44% reflect a preference for the status quo and <strong>56% reflect fear of making a mistake</strong>.</>,
        ]}
      />
    </MaterialCard>
  );
}

/* ------------------------------------------------------------------ B2 */

const DONUT_FILL = ["#2F5D62", "#D99A2B", "#8B9098", "#0F6B6B", "#D8D1BF"];

function Donut() {
  const uid = useId().replace(/:/g, "");
  const [sel, setSel] = useState(0);
  const r = 70;
  const C = 2 * Math.PI * r;
  let acc = 0;
  return (
    <div className="grid items-center gap-4 md:grid-cols-[200px_1fr]">
      <svg viewBox="0 0 200 200" className="mx-auto h-auto w-full max-w-[200px]" role="img" aria-labelledby={`${uid}-t ${uid}-d`}>
        <title id={`${uid}-t`}>Buying time split</title>
        <desc id={`${uid}-d`}>Gartner 2017: 17% meeting suppliers, 27% researching online, 18% researching offline, 22% meeting the buying group, 16% other.</desc>
        <g transform="rotate(-90 100 100)">
          {GARTNER_SPLIT.map((s, i) => {
            const len = (s.pct / 100) * C;
            const el = (
              <circle key={s.label} cx="100" cy="100" r={r} fill="none" stroke={DONUT_FILL[i]} strokeWidth={sel === i ? 38 : 30} strokeDasharray={`${len - 2} ${C - len + 2}`} strokeDashoffset={-acc} style={{ transition: "stroke-width .2s" }} />
            );
            acc += len;
            return el;
          })}
        </g>
        <text x="100" y="98" textAnchor="middle" fontSize="26" fontWeight="700" fill="#1F2328">{GARTNER_SPLIT[sel].pct}%</text>
        <text x="100" y="116" textAnchor="middle" fontSize="10" fill="#59606A">of buying time</text>
      </svg>
      <ul className="space-y-1.5">
        {GARTNER_SPLIT.map((s, i) => (
          <li key={s.label}>
            <button type="button" aria-pressed={sel === i} onClick={() => setSel(i)} onMouseEnter={() => setSel(i)}
              className={clsx("flex min-h-[40px] w-full items-center gap-2.5 rounded-lg border px-3 py-1.5 text-left text-caption", sel === i ? "border-accent bg-accentSoft" : "border-line bg-paper hover:border-ash")}>
              <span aria-hidden className="h-3.5 w-3.5 shrink-0 rounded-sm border border-ink/40" style={{ background: DONUT_FILL[i] }} />
              <span className="flex-1 font-semibold">{s.label}</span>
              <span className="tnum">{s.pct}%</span>
            </button>
          </li>
        ))}
      </ul>
      <Insight className="md:col-span-2">
        {sel === 0
          ? `"Meeting suppliers" is the only slice where you're in the room — and it's just ${GARTNER_SPLIT[0].pct}% of buying time. The other ${100 - GARTNER_SPLIT[0].pct}% (research, internal alignment) happens without you.`
          : `"${GARTNER_SPLIT[sel].label}" takes up ${GARTNER_SPLIT[sel].pct}% of buying time, and no supplier is present for it. Only "Meeting suppliers" (${GARTNER_SPLIT[0].pct}%) is time you can see directly — the rest of the buying group's work stays invisible unless a contact tells you about it.`}
      </Insight>
    </div>
  );
}

export function CardB2() {
  return (
    <MaterialCard
      id="B2"
      scan="One buyer never decides alone: the buying group is the customer."
      sources={["webster1972", "gartner2017", "gdpr", "betrvg87"]}
      reasoning={[
        "Name the role by what it does in the purchase (user, influencer, buyer, decider, gatekeeper), not by job title.",
        "Each role asks a different question. Einkauf enforces the process and needs the total cost; the head of IT carries the technical and personal risk; the Geschäftsführer decides larger spend.",
        "Do not equate role with motive: any role can voice any motive (see B3).",
      ]}
    >
      <Diagram label="Buying committee map" caption="Roles only. Select a role for its typical question. Task 2 reuses this MotiveMap with the Kessler roles.">
        <MotiveMap mode="roles" />
      </Diagram>
      <Diagram label="How buying time is spent (Gartner 2017)">
        <Donut />
      </Diagram>
      <Bul
        items={[
          <><strong>Webster &amp; Wind (1972):</strong> users, influencers, buyers, deciders, gatekeepers.</>,
          <><strong>Gartner (2017 Digital B2B Buyer Survey, n = 750):</strong> the median buying group for a complex solution has <strong>6–10 decision makers</strong>, each with 4–5 pieces of independently gathered information.</>,
          <>German Mittelstand (mid-sized companies) reality: <em>Geschäftsführer</em> (managing director) decides personally on larger spend; <em>Einkauf</em> (procurement) enforces process (a minimum number of offers is company policy, a <em>Case assumption</em> here); <em>IT-Leiter</em> (head of IT) is the technical voice; the <em>Datenschutzbeauftragter</em> (data protection officer) reviews data processing (Auftragsverarbeitungsvertrag, GDPR Art. 28); the <em>Betriebsrat</em> (works council) has co-determination on systems that can monitor employee behaviour (§ 87(1) no. 6 BetrVG).</>,
        ]}
      />
    </MaterialCard>
  );
}

/* ------------------------------------------------------------------ B3 */

const ARMS: Record<MotiveId, { x: number; y: number }> = {
  security: { x: 320, y: 46 },
  efficiency: { x: 560, y: 170 },
  innovation: { x: 320, y: 294 },
  status: { x: 80, y: 170 },
};
const OPPOSITE: Record<MotiveId, MotiveId> = { security: "innovation", innovation: "security", efficiency: "status", status: "efficiency" };

function Compass() {
  const uid = useId().replace(/:/g, "");
  const [sel, setSel] = useState<MotiveId>("security");
  const m = MOTIVES.find((x) => x.id === sel)!;
  return (
    <div className="space-y-3">
      <svg viewBox="0 0 640 340" className="h-auto w-full" role="group" aria-labelledby={`${uid}-t ${uid}-d`}>
        <title id={`${uid}-t`}>Motive compass</title>
        <desc id={`${uid}-d`}>Four purchase motives at the four points of a compass. Select one to list what to listen for and what proves it.</desc>
        <circle cx="320" cy="170" r="110" fill="none" stroke="#D8D1BF" strokeWidth="1.5" />
        <line x1="320" y1="70" x2="320" y2="270" stroke="#D8D1BF" /><line x1="220" y1="170" x2="420" y2="170" stroke="#D8D1BF" />
        {MOTIVES.map((mo) => {
          const p = ARMS[mo.id];
          const on = sel === mo.id;
          return (
            <g key={mo.id} className="hit" role="button" tabIndex={0} aria-pressed={on} aria-label={mo.label} onClick={() => setSel(mo.id)}
              onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); setSel(mo.id); } }}>
              <line x1="320" y1="170" x2={p.x} y2={p.y} stroke={on ? "#8A5A0B" : "#59606A"} strokeWidth={on ? 3.4 : 1.6} />
              <rect x={p.x - 70} y={p.y - 24} width="140" height="48" rx="8" fill={on ? "#FBF0D6" : "#FFFEFA"} stroke={on ? "#8A5A0B" : "#59606A"} strokeWidth={on ? 2.6 : 1.5} className="hit-shape" />
              <text x={p.x} y={p.y - 2} textAnchor="middle" fontSize="15" fontWeight="700" fill="#1F2328">{mo.label}</text>
              <text x={p.x} y={p.y + 15} textAnchor="middle" fontSize="10.5" fill="#59606A">{mo.meaning.replace(/\.$/, "").slice(0, 26)}</text>
            </g>
          );
        })}
        <circle cx="320" cy="170" r="16" fill="#1F2328" />
      </svg>
      <Toggles label="Motive" value={sel} onChange={setSel} options={MOTIVES.map((mo) => ({ id: mo.id, label: mo.label }))} />
      <Insight>
        {m.label} ({m.meaning.replace(/\.$/, "")}) sits opposite {MOTIVES.find((x) => x.id === OPPOSITE[sel])!.label} on the compass. The same buyer can voice both at different moments, which is why a motive is a hypothesis to test against what they say next, not a label you fix once.
      </Insight>
      <div aria-live="polite" className="grid gap-3 rounded-lg border border-line bg-paper p-4 text-caption md:grid-cols-2">
        <div>
          <p className="smallcaps text-accent">{m.label} · {m.meaning}</p>
          <p className="mt-1 font-semibold">Listen for (generic examples)</p>
          <ul className="list-disc space-y-0.5 pl-5">{m.listenFor.map((l) => <li key={l}>{l}</li>)}</ul>
        </div>
        <div>
          <p className="mt-5 font-semibold md:mt-[1.65rem]">What proves it</p>
          <ul className="list-disc space-y-0.5 pl-5">{m.proves.map((l) => <li key={l}>{l}</li>)}</ul>
        </div>
      </div>
    </div>
  );
}

export function CardB3() {
  return (
    <MaterialCard
      id="B3"
      scan="Motives are hypotheses about the buyer, and you test them by asking."
      sources={["nis2", "bsi2025", "webster1972"]}
      reasoning={[
        "Read a statement for what the speaker wants to avoid, save, gain or be seen as: avoid loss or failure → Security; less effort or cost per outcome → Efficiency; a capability not yet held → Innovation; reputation and peer comparison → Status.",
        "Do not equate role with motive: the head of IT can voice Efficiency, and a managing director can voice Security. Choose from the wording of the statement, not from the job title.",
        "A motive is only addressed if an offer has something that proves it. A motive with no matching feature in either offer is a gap to name, not one to hide.",
      ]}
    >
      <Diagram label="Motive compass" caption="Select a motive to see what to listen for and what proves it.">
        <Compass />
      </Diagram>
      <Bul
        items={[
          <><strong>Security</strong> (avoid loss or failure) · <strong>Efficiency</strong> (less effort or cost per outcome) · <strong>Innovation</strong> (a capability the buyer does not yet have) · <strong>Status</strong> (reputation, legitimacy, peer comparison).</>,
          "Any role can voice any motive; roles tend to weight them differently. Do not equate role with motive.",
        ]}
      />
      <Callout label="Security has become institutional in Germany" tone="signal">
        <p>The German NIS2 implementation act has been in force since <strong>6 December 2025</strong>; roughly <strong>29,500</strong> entities fall under BSI supervision; supply-chain security is a named measure (Directive (EU) 2022/2555, <strong>Art. 21(2)(d)</strong>); management bodies must approve and oversee the measures and can be held liable (<strong>Art. 20</strong>). ISO/IEC 27001 certification is a common way to evidence it. (Sources: BSI press release of 5 Dec 2025; Directive (EU) 2022/2555.)</p>
      </Callout>
      <DataTable
        caption="Motives at a glance"
        head={["Motive", "Listen for", "What proves it"]}
        rows={MOTIVES.map((mo) => [mo.label, mo.listenFor[0], mo.proves[0]])}
      />
    </MaterialCard>
  );
}
