"use client";

import { useState } from "react";
import clsx from "clsx";
import { Icon } from "@/components/icons/LineIcons";
import { AREAS, GATES, FILTER_SAMPLES, areaById, gateById, type AreaId, type GateId } from "@/lib/route1";
import { Chip, WhatChanged, WhyResult } from "@/components/ui/DiagramKit";

/**
 * The M1–M4 diagrams. Every one is a live widget — inline SVG plus CSS
 * transitions, no charting or animation library (CLAUDE.md §9). Each shows
 * numbers, a reason per value, a live "Why this result", a live "What just
 * changed" and a baseline to return to. Sentences stay in HTML beside each SVG
 * rather than inside it, so they do not shrink with the viewBox at 380px. The
 * practice cases are not Task 1's cases.
 */

// ---------------------------------------------------------------------------
// M1 — Wire a figure to management: target, owner, decision
// ---------------------------------------------------------------------------

type LinkId = "target" | "owner" | "decision";

const LINKS: { id: LinkId; name: string; question: string; whenOn: string; whenOff: string; fix: string; thinking: string }[] = [
  {
    id: "target",
    name: "Target",
    question: "Is there a target to compare it with?",
    whenOn: "can now be judged — is it on track, or not",
    whenOff: "cannot be judged: there is nothing to compare it with",
    fix: "agree a target",
    thinking: "You are now asking “compared with what?”",
  },
  {
    id: "owner",
    name: "Owner",
    question: "Does one named person answer for it?",
    whenOn: "now has someone who must explain a miss",
    whenOff: "has nobody who must explain a miss",
    fix: "name one accountable person",
    thinking: "You are now asking “who answers for this?”",
  },
  {
    id: "decision",
    name: "Decision",
    question: "Does a decision change when it moves?",
    whenOn: "now leads to a choice — fund, stop or change something",
    whenOff: "leads to no choice at all, whatever it shows",
    fix: "state which decision it feeds",
    thinking: "You are now asking “what would we do differently?”",
  },
];

type Figure = { id: string; label: string; links: Record<LinkId, { on: boolean; reason: string }> };

const FIGURES: Figure[] = [
  {
    id: "helpdesk",
    label: "Tickets closed by the Green IT helpdesk",
    links: {
      target: { on: false, reason: "No target says how many tickets is enough." },
      owner: { on: false, reason: "The helpdesk handles tickets, but nobody answers for the figure itself." },
      decision: { on: false, reason: "Nothing is decided when the count goes up or down." },
    },
  },
  {
    id: "printing",
    label: "Printer pages per employee",
    links: {
      target: { on: false, reason: "No target for pages exists." },
      owner: { on: true, reason: "Facilities tracks it and answers for it." },
      decision: { on: false, reason: "Nothing is decided from it." },
    },
  },
  {
    id: "water",
    label: "Water use per data hall vs the permit limit",
    links: {
      target: { on: true, reason: "The permit sets a limit to compare with." },
      owner: { on: false, reason: "Each hall reads its own meter; nobody answers for the total." },
      decision: { on: true, reason: "Passing 90 % of the limit triggers a review." },
    },
  },
  {
    id: "utilisation",
    label: "Server utilisation vs a 50 % target, reviewed monthly",
    links: {
      target: { on: true, reason: "A 50 % target exists." },
      owner: { on: true, reason: "Platform Ops answers for it." },
      decision: { on: true, reason: "A low reading triggers a decision to consolidate servers." },
    },
  },
];

const cap = (t: string) => t.charAt(0).toUpperCase() + t.slice(1);

/** Three-segment arc: one segment per link. */
function arc(cx: number, cy: number, r: number, a0: number, a1: number) {
  const p = (a: number) => [cx + r * Math.cos((a * Math.PI) / 180), cy + r * Math.sin((a * Math.PI) / 180)];
  const [x0, y0] = p(a0);
  const [x1, y1] = p(a1);
  return `M ${x0.toFixed(1)} ${y0.toFixed(1)} A ${r} ${r} 0 0 1 ${x1.toFixed(1)} ${y1.toFixed(1)}`;
}

export function DataVsManagementGauges() {
  const [figureId, setFigureId] = useState<string>("printing");
  const figure = FIGURES.find((f) => f.id === figureId)!;
  const baseline: Record<LinkId, boolean> = { target: figure.links.target.on, owner: figure.links.owner.on, decision: figure.links.decision.on };
  const [sim, setSim] = useState<Record<LinkId, boolean>>(baseline);
  const [change, setChange] = useState<string | null>(null);

  const pick = (id: string) => {
    const f = FIGURES.find((x) => x.id === id)!;
    const b = { target: f.links.target.on, owner: f.links.owner.on, decision: f.links.decision.on };
    setFigureId(id);
    setSim(b);
    const n = Object.values(b).filter(Boolean).length;
    setChange(`Now looking at “${f.label}”. As recorded, ${n} of 3 links are in place.`);
  };

  const toggle = (id: LinkId) => {
    const link = LINKS.find((l) => l.id === id)!;
    const next = { ...sim, [id]: !sim[id] };
    setSim(next);
    const n = Object.values(next).filter(Boolean).length;
    setChange(
      next[id]
        ? `You wired the ${link.name.toLowerCase()} link. The figure ${link.whenOn}. ${n} of 3 links now. ${link.thinking}`
        : `You removed the ${link.name.toLowerCase()} link. The figure ${link.whenOff}. ${n} of 3 links now.`,
    );
  };

  const reset = () => {
    setSim(baseline);
    setChange("Back to the figure as recorded.");
  };

  const n = LINKS.filter((l) => sim[l.id]).length;
  const missing = LINKS.filter((l) => !sim[l.id]);
  const edited = LINKS.some((l) => sim[l.id] !== baseline[l.id]);
  const headline = n === 3 ? "Managed" : n === 0 ? "Only collected" : "Partly wired";
  const why =
    n === 3
      ? "A target, a named owner and a decision are all in place, so a change in the number leads to a choice and someone answers for it."
      : `${cap(missing.map((l) => l.name.toLowerCase()).join(" and "))} ${missing.length > 1 ? "are" : "is"} missing. The first fix is to ${missing[0].fix}${missing.length > 1 ? `, then ${missing.slice(1).map((l) => l.fix).join(" and ")}` : ""}.`;

  return (
    <div className="space-y-4">
      <div>
        <p className="text-micro font-semibold uppercase tracking-wide text-ash">Pick a figure to inspect</p>
        <div className="mt-1.5 flex flex-wrap gap-1.5">
          {FIGURES.map((f) => (
            <Chip key={f.id} on={figureId === f.id} onClick={() => pick(f.id)}>
              {f.label}
            </Chip>
          ))}
        </div>
      </div>

      <svg
        viewBox="0 0 300 130"
        preserveAspectRatio="xMidYMid meet"
        className="mx-auto h-auto w-full max-w-sm"
        role="img"
        aria-label={`A gauge with three segments — target, owner, decision. ${n} of 3 are wired for ${figure.label}.`}
      >
        {LINKS.map((l, i) => {
          const a0 = 180 + i * 60 + 3;
          const a1 = 180 + (i + 1) * 60 - 3;
          return (
            <path
              key={l.id}
              d={arc(150, 105, 78, a0, a1)}
              fill="none"
              stroke="currentColor"
              strokeWidth="16"
              strokeLinecap="butt"
              className={sim[l.id] ? "text-accent" : "text-line"}
              style={{ transition: "color .25s ease" }}
            />
          );
        })}
        <text x="150" y="100" textAnchor="middle" className="fill-ink text-[28px] font-semibold tabular-nums">
          {n} / 3
        </text>
        <text x="150" y="118" textAnchor="middle" className="fill-ash text-[9px] font-semibold uppercase tracking-wide">
          links wired
        </text>
        <text x="62" y="82" textAnchor="middle" className="fill-ash text-[9px] font-semibold uppercase tracking-wide">
          Target
        </text>
        <text x="150" y="20" textAnchor="middle" className="fill-ash text-[9px] font-semibold uppercase tracking-wide">
          Owner
        </text>
        <text x="238" y="82" textAnchor="middle" className="fill-ash text-[9px] font-semibold uppercase tracking-wide">
          Decision
        </text>
      </svg>

      <p className="text-center text-caption font-semibold tabular-nums text-ink">
        {LINKS.map((l) => `${l.name} ${sim[l.id] ? 1 : 0}`).join(" + ")} = {n} of 3
        {edited && <span className="ml-1.5 font-normal text-ash">(you changed it — recorded: {Object.values(baseline).filter(Boolean).length})</span>}
      </p>

      <div className="grid gap-2 sm:grid-cols-3">
        {LINKS.map((l) => {
          const on = sim[l.id];
          const changed = sim[l.id] !== baseline[l.id];
          return (
            <div key={l.id} className={clsx("rounded-xl border p-3", on ? "border-accent/40 bg-accentSoft" : "border-line bg-paper")}>
              <p className="text-caption font-semibold text-ink">
                {l.name}: {on ? "wired" : "missing"}
              </p>
              <p className="mt-0.5 text-micro text-ash">{l.question}</p>
              <p className="mt-1 text-micro text-ink">{changed ? (on ? "Wired by you — not in the figure as recorded." : "Removed by you — it was in place as recorded.") : figure.links[l.id].reason}</p>
              <button
                type="button"
                onClick={() => toggle(l.id)}
                aria-pressed={on}
                className="mt-2 rounded-full border border-line bg-paper px-2.5 py-1 text-micro font-semibold text-accent hover:border-accent"
              >
                {on ? `Remove ${l.name.toLowerCase()}` : `Try wiring ${l.name.toLowerCase()}`}
              </button>
            </div>
          );
        })}
      </div>

      <WhyResult headline={headline} why={why} tone={n === 3 ? "accent" : "warn"} />
      <WhatChanged text={change} onReset={edited ? reset : undefined} />
    </div>
  );
}

// ---------------------------------------------------------------------------
// M2 — One fact, three layers
// ---------------------------------------------------------------------------

type LayerId = "activity" | "outcome" | "management";

const LAYER_META: { id: LayerId; name: string; answers: string; drives: string; added: string; y0: number; y1: number; wTop: number; wBottom: number }[] = [
  { id: "management", name: "Management metric", answers: "Are we on track, and who acts?", drives: "Recurring: fund, adjust or stop — at every review.", added: "a target, a named owner and a review date", y0: 12, y1: 52, wTop: 40, wBottom: 110 },
  { id: "outcome", name: "Outcome metric", answers: "Did it work?", drives: "One-off: was the change worth doing?", added: "a baseline to compare against (before → after)", y0: 52, y1: 96, wTop: 110, wBottom: 190 },
  { id: "activity", name: "Activity / input metric", answers: "What did we do or use?", drives: "None by itself.", added: "", y0: 96, y1: 144, wTop: 190, wBottom: 280 },
];

const SUBJECTS: { id: string; label: string; wording: Record<LayerId, string> }[] = [
  {
    id: "laptops",
    label: "Laptops",
    wording: {
      activity: "212 laptops replaced this year.",
      outcome: "Average laptop service life rose from 3.1 to 4.4 years.",
      management: "Average laptop service life vs a 5-year target — owned by IT Procurement, reviewed every quarter.",
    },
  },
  {
    id: "printing",
    label: "Printing",
    wording: {
      activity: "1.2 million pages printed this year.",
      outcome: "Pages per employee fell from 3,100 to 2,400.",
      management: "Pages per employee vs a 2,000 target — owned by the Head of Facilities, reviewed every quarter.",
    },
  },
];

export function MetricLayersPyramid() {
  const [subjectId, setSubjectId] = useState("laptops");
  const [layerId, setLayerId] = useState<LayerId>("activity");
  const [change, setChange] = useState<string | null>(null);
  const subject = SUBJECTS.find((s) => s.id === subjectId)!;
  const layer = LAYER_META.find((l) => l.id === layerId)!;
  const order: LayerId[] = ["activity", "outcome", "management"];

  const select = (next: LayerId) => {
    if (next === layerId) return;
    const from = LAYER_META.find((l) => l.id === layerId)!;
    const to = LAYER_META.find((l) => l.id === next)!;
    const up = order.indexOf(next) > order.indexOf(layerId);
    setChange(
      up
        ? `You moved up from “${from.answers}” to “${to.answers}” — the measurement can stay the same; what was added is ${to.added}. Decisions it can drive: ${to.drives.toLowerCase()}`
        : `You moved down from “${from.answers}” to “${to.answers}”. What you lost is ${from.added}, so it can drive less: ${to.drives.toLowerCase()}`,
    );
    setLayerId(next);
  };

  return (
    <div className="space-y-4">
      <div>
        <p className="text-micro font-semibold uppercase tracking-wide text-ash">One subject, three wordings</p>
        <div className="mt-1.5 flex flex-wrap gap-1.5">
          {SUBJECTS.map((s) => (
            <Chip key={s.id} on={subjectId === s.id} onClick={() => setSubjectId(s.id)}>
              {s.label}
            </Chip>
          ))}
        </div>
      </div>

      <svg viewBox="0 0 300 160" preserveAspectRatio="xMidYMid meet" className="mx-auto h-auto w-full max-w-sm" role="img" aria-label="A three-tier pyramid: management metrics at the apex, outcome metrics in the middle, activity metrics at the base.">
        {LAYER_META.map((t) => {
          const on = layerId === t.id;
          const x0Top = 150 - t.wTop / 2;
          const x1Top = 150 + t.wTop / 2;
          const x0Bottom = 150 - t.wBottom / 2;
          const x1Bottom = 150 + t.wBottom / 2;
          return (
            <g key={t.id} className="cursor-pointer" onClick={() => select(t.id)}>
              <polygon
                points={`${x0Top},${t.y0} ${x1Top},${t.y0} ${x1Bottom},${t.y1} ${x0Bottom},${t.y1}`}
                className={on ? "fill-accent" : "fill-mist stroke-line"}
                strokeWidth="1"
                style={{ transition: "fill .2s ease" }}
              />
              <text x="150" y={(t.y0 + t.y1) / 2 + 4} textAnchor="middle" className={clsx("text-[10px] font-semibold", on ? "fill-paper" : "fill-ink")}>
                {t.name}
              </text>
            </g>
          );
        })}
      </svg>

      <div className="flex flex-wrap justify-center gap-1.5">
        {order.map((id) => (
          <Chip key={id} on={layerId === id} onClick={() => select(id)}>
            {LAYER_META.find((l) => l.id === id)!.name}
          </Chip>
        ))}
      </div>

      <div key={`${subjectId}-${layerId}`} className="reveal-in rounded-xl border border-accent/30 bg-accentSoft p-3">
        <p className="text-caption font-semibold text-ink">{subject.wording[layerId]}</p>
        <p className="mt-1 text-caption text-ink">
          <span className="font-semibold text-accent">It answers: </span>
          {layer.answers}
        </p>
        <p className="mt-0.5 text-caption text-ink">
          <span className="font-semibold text-accent">Decisions it can drive: </span>
          {layer.drives}
        </p>
      </div>

      <WhyResult
        headline={`${layer.name} — layer ${order.indexOf(layerId) + 1} of 3`}
        why={
          layerId === "activity"
            ? "It is a count of what happened. It becomes an outcome once a baseline exists, and a management metric once a target, an owner and a review sit around it."
            : layerId === "outcome"
              ? "The effect is measured against a baseline, so “did it work?” has an answer — but nobody has yet committed to a target, so it cannot yet say “are we on track?”."
              : "Everything the outcome had, plus a target, a named owner and a fixed review — this is the number a leader steers by."
        }
      />
      <WhatChanged text={change} onReset={layerId !== "activity" ? () => { setLayerId("activity"); setChange("Back to the raw count at the base."); } : undefined} resetLabel="Back to the base" />
    </div>
  );
}

// ---------------------------------------------------------------------------
// M3 — The six areas: what each one looks for, and how it differs from its neighbour
// ---------------------------------------------------------------------------

const PRACTICE: { text: string; expected: AreaId; says: string; why: string }[] = [
  {
    text: "The two warehouses record server-room temperature in different units and at different times of day.",
    expected: "metricQuality",
    says: "the figure exists at both sites but the two cannot be compared",
    why: "Both warehouses record it, so nothing is missing — the two figures just do not line up.",
  },
  {
    text: "Nobody has been asked who signs off the annual energy figure.",
    expected: "responsibilities",
    says: "no named person answers for the figure",
    why: "The sentence is about accountability, not about the number or how it is presented.",
  },
  {
    text: "Every site sends a monthly report and head office files it; no priority or budget has ever moved because of one.",
    expected: "managementRelevance",
    says: "the report reaches people, but no decision follows from it",
    why: "The output exists and arrives on time — what is missing is the link to a decision.",
  },
  {
    text: "Emissions from the cloud provider's servers appear in no calculation at all.",
    expected: "carbonMonitoring",
    says: "IT's emissions are not captured or allocated",
    why: "The gap is specifically about IT emissions (Scope 3 here), not just any figure being absent.",
  },
];

export function SixAreaChips() {
  const [seen, setSeen] = useState<AreaId[]>([]);
  const [openId, setOpenId] = useState<AreaId | null>(null);
  const [answers, setAnswers] = useState<(AreaId | null)[]>(PRACTICE.map(() => null));
  const open = openId ? areaById(openId) : null;

  const select = (id: AreaId) => {
    setOpenId((cur) => (cur === id ? null : id));
    setSeen((cur) => (cur.includes(id) ? cur : [...cur, id]));
  };
  const tried = answers.filter(Boolean).length;

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
        {AREAS.map((a) => {
          const isOpen = openId === a.id;
          const wasSeen = seen.includes(a.id);
          return (
            <button
              key={a.id}
              type="button"
              onClick={() => select(a.id)}
              aria-pressed={isOpen}
              className={clsx(
                "flex flex-col items-center gap-1.5 rounded-xl border p-3 text-center transition-colors duration-150",
                isOpen ? "border-accent bg-accent text-paper" : wasSeen ? "border-accent/40 bg-accentSoft text-accent" : "border-line bg-paper text-ash hover:border-ash",
              )}
            >
              <Icon name={a.icon} className="h-5 w-5" />
              <span className="text-micro font-semibold">{a.name}</span>
            </button>
          );
        })}
      </div>

      <div aria-live="polite">
        {open ? (
          <div key={open.id} className="reveal-in space-y-1.5 rounded-xl border border-accent/30 bg-accentSoft p-3">
            <p className="text-caption font-semibold text-accent">{open.name}</p>
            <p className="text-caption text-ink">{open.note}</p>
            <p className="text-caption text-ink">
              <span className="font-semibold">Look for: </span>
              {open.lookFor}.
            </p>
            <p className="text-caption text-ink">
              <span className="font-semibold">Example: </span>
              {open.example}
            </p>
            <p className="text-caption text-ink">
              <span className="font-semibold">Often confused with {areaById(open.confusedWith).name}. </span>
              Ask: {open.ask}
            </p>
          </div>
        ) : (
          <p className="rounded-xl border border-dashed border-line bg-paper p-3 text-caption text-ash">
            Tap an area to see what it looks for and how it differs from its neighbour — {seen.length} of 6 opened.
          </p>
        )}
      </div>

      <div className="rounded-xl border border-line bg-paper p-3">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <p className="text-micro font-semibold uppercase tracking-wide text-ash">Try it — which area does each sentence show?</p>
          <p className="text-micro tabular-nums text-ash">{tried} of {PRACTICE.length} tried</p>
        </div>
        <p className="mt-0.5 text-micro text-ash">Practice sentences only — they are not in Task 1.</p>
        <ul className="mt-2 space-y-3">
          {PRACTICE.map((p, i) => {
            const tapped = answers[i];
            const expected = areaById(p.expected);
            return (
              <li key={i}>
                <p className="text-caption text-ink">“{p.text}”</p>
                <div className="mt-1 flex flex-wrap gap-1">
                  {AREAS.map((a) => (
                    <Chip key={a.id} on={tapped === a.id} onClick={() => setAnswers((cur) => cur.map((v, k) => (k === i ? a.id : v)))}>
                      {a.name}
                    </Chip>
                  ))}
                </div>
                {tapped && (
                  <p aria-live="polite" className="reveal-in mt-1 text-micro text-ink">
                    {tapped === p.expected ? (
                      <>
                        <span className="font-semibold text-accent">Fits — {expected.name}. </span>
                        {p.why}
                      </>
                    ) : (
                      <>
                        <span className="font-semibold text-warn">Not the best fit. </span>
                        {areaById(tapped).name} would be right if the sentence said something like {areaById(tapped).lookFor}. This one says {p.says}, which makes it {expected.name}.
                      </>
                    )}
                  </p>
                )}
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// M4 — The six gates: filter a practice metric, then fix a failing gate
// ---------------------------------------------------------------------------

export function SixGateFilter() {
  const [sampleId, setSampleId] = useState<string>("kwh-sites");
  const [fixed, setFixed] = useState<GateId[]>([]);
  const [change, setChange] = useState<string | null>(null);
  const sample = FILTER_SAMPLES.find((s) => s.id === sampleId)!;

  const cleared = (id: GateId) => sample.gates[id].pass || fixed.includes(id);
  const soundCount = GATES.filter((g) => g.half === "sound" && cleared(g.id)).length;
  const wiredCount = GATES.filter((g) => g.half === "wired" && cleared(g.id)).length;
  const total = soundCount + wiredCount;
  const open = GATES.filter((g) => !cleared(g.id));
  const baseTotal = GATES.filter((g) => sample.gates[g.id].pass).length;
  const shortFixes = fixed.filter((id) => gateById(id).fixKind === "shortTerm").length;
  const structFixes = fixed.length - shortFixes;

  const pick = (id: string) => {
    const s = FILTER_SAMPLES.find((x) => x.id === id)!;
    setSampleId(id);
    setFixed([]);
    const base = GATES.filter((g) => s.gates[g.id].pass).length;
    setChange(`Now filtering “${s.label}”: ${base} of 6 gates clear as it stands.`);
  };

  const fix = (id: GateId) => {
    if (sample.gates[id].pass) return;
    const g = gateById(id);
    if (fixed.includes(id)) {
      setFixed((cur) => cur.filter((x) => x !== id));
      setChange(`You undid the fix for “${g.name}”. It is open again — ${total - 1} of 6 gates clear.`);
      return;
    }
    setFixed((cur) => [...cur, id]);
    const now = total + 1;
    setChange(
      `You fixed “${g.name}”: ${sample.gates[id].fix} That is a ${g.fixKind === "shortTerm" ? "short-term" : "structural"} fix — ${g.fixKind === "shortTerm" ? "it changes how the number is captured or written down" : "it creates accountability and needs a review to hold"}. ${now} of 6 gates clear now (was ${total}).${now === 6 ? " All six clear — and notice how much of the work was structural." : ""}`,
    );
  };

  const reset = () => {
    setFixed([]);
    setChange("Back to the metric as it stands.");
  };

  const soundAll = soundCount === 4;
  const wiredAll = wiredCount === 2;
  const headline = total === 6 ? "Clears all six — management-effective" : `Clears ${total} of 6 — merely informative for now`;
  const why =
    total === 6
      ? "The number is sound and it is wired to a target, a decision and an owner."
      : soundAll && !wiredAll
        ? `A good number nobody steers by: it is sound (4 of 4), but ${open.map((g) => g.name.toLowerCase()).join(" and ")} ${open.length > 1 ? "are" : "is"} still open.`
        : !soundAll && wiredAll
          ? `The wiring is in place (2 of 2) but the number cannot yet be trusted or compared: ${open.map((g) => g.name.toLowerCase()).join(", ")} still open.`
          : `Both halves need work — sound number ${soundCount} of 4, wired ${wiredCount} of 2. Still open: ${open.map((g) => g.name.toLowerCase()).join(", ")}.`;

  return (
    <div className="space-y-4">
      <div>
        <p className="text-micro font-semibold uppercase tracking-wide text-ash">Drop a practice metric in</p>
        <div className="mt-1.5 flex flex-wrap gap-1.5">
          {FILTER_SAMPLES.map((s) => (
            <Chip key={s.id} on={sampleId === s.id} onClick={() => pick(s.id)}>
              {s.label}
            </Chip>
          ))}
        </div>
      </div>

      <svg viewBox="0 0 360 120" preserveAspectRatio="xMidYMid meet" className="mx-auto h-auto w-full max-w-xl" role="img" aria-label={`Six gates; this metric clears ${total} of six.`}>
        <rect x="4" y="46" width="60" height="28" rx="8" className="fill-paper stroke-ink" strokeWidth="1.4" />
        <text x="34" y="64" textAnchor="middle" className="fill-ink text-[10px] font-semibold">
          Metric
        </text>
        {GATES.map((g, i) => {
          const x = 84 + i * 46;
          const base = sample.gates[g.id].pass;
          const isFixed = fixed.includes(g.id);
          const pass = base || isFixed;
          return (
            <g key={g.id} className={base ? undefined : "cursor-pointer"} onClick={() => fix(g.id)}>
              <path d={i === 0 ? "M64 60 H84" : `M${x - 46 + 30} 60 H${x}`} stroke="currentColor" className="text-ash" strokeWidth="1.2" />
              <circle
                key={sampleId + g.id + isFixed}
                cx={x + 15}
                cy="60"
                r="15"
                className={clsx("anim-pop", pass ? "fill-accentSoft stroke-accent" : "fill-danger/10 stroke-danger")}
                strokeWidth="1.6"
                strokeDasharray={isFixed ? "3 2" : undefined}
              />
              {pass ? (
                <path d={`M${x + 9} 60 l4 4 l9 -9`} fill="none" stroke="currentColor" className="text-accent" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              ) : (
                <path d={`M${x + 10} 54 l10 12 M${x + 20} 54 l-10 12`} stroke="currentColor" className="text-danger" strokeWidth="2" strokeLinecap="round" />
              )}
              <text x={x + 15} y="88" textAnchor="middle" className="fill-ash text-[7px] font-semibold uppercase tracking-wide">
                {g.name}
              </text>
            </g>
          );
        })}
        <text x="84" y="14" className="fill-ash text-[8px] font-semibold uppercase tracking-wide">
          Sound number · {soundCount} of 4
        </text>
        <text x="268" y="14" className="fill-ash text-[8px] font-semibold uppercase tracking-wide">
          Wired · {wiredCount} of 2
        </text>
      </svg>

      <p className="text-center text-caption font-semibold tabular-nums text-ink">
        {soundCount} + {wiredCount} = {total} of 6 gates
        {total !== baseTotal && <span className="ml-1.5 font-normal text-ash">(as it stands: {baseTotal})</span>}
      </p>

      <ul className="space-y-1.5">
        {GATES.map((g) => {
          const res = sample.gates[g.id];
          const isFixed = fixed.includes(g.id);
          const pass = res.pass || isFixed;
          return (
            <li key={g.id} className="flex flex-wrap items-start gap-x-2 gap-y-1 rounded-lg border border-line bg-paper p-2">
              <span
                aria-hidden
                className={clsx("mt-0.5 inline-flex h-4 w-4 shrink-0 items-center justify-center rounded-full text-[10px] font-bold text-paper", pass ? "bg-accent" : "bg-danger")}
              >
                {pass ? "✓" : "✕"}
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-caption text-ink">
                  <span className="font-semibold">{g.name}</span> — <span className="text-ash">{g.question}</span>
                </p>
                <p className="text-micro text-ink">{isFixed ? `Fixed: ${res.fix}` : res.reason}</p>
              </div>
              {!res.pass && (
                <button
                  type="button"
                  onClick={() => fix(g.id)}
                  aria-pressed={isFixed}
                  className="shrink-0 rounded-full border border-line bg-canvas px-2.5 py-1 text-micro font-semibold text-accent hover:border-accent"
                >
                  {isFixed ? "Undo fix" : `Fix it (${g.fixKind === "shortTerm" ? "short-term" : "structural"})`}
                </button>
              )}
            </li>
          );
        })}
      </ul>

      {fixed.length > 0 && (
        <p className="text-micro tabular-nums text-ash">
          Fixes so far: {shortFixes} short-term + {structFixes} structural = {fixed.length}.
        </p>
      )}

      <WhyResult headline={headline} why={why} tone={total === 6 ? "accent" : "warn"} />
      <WhatChanged text={change} onReset={fixed.length > 0 ? reset : undefined} resetLabel="Undo all fixes" />
    </div>
  );
}
