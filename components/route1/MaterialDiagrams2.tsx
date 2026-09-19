"use client";

import { useState } from "react";
import clsx from "clsx";
import { Icon } from "@/components/icons/LineIcons";
import { CONDITIONS, OPTION_LINES } from "@/lib/route1";
import { Chip, WhatChanged, WhyResult } from "@/components/ui/DiagramKit";

/**
 * The M5–M7 diagrams: same contract as M1–M4 — numbers, a reason per value, a
 * live "Why this result", a live "What just changed" and a baseline. M7 shows
 * the three lines neutrally; it must not rate them, because Task 2 does.
 */

// ---------------------------------------------------------------------------
// M5 — The routine: cadence, owner, and which step is skipped
// ---------------------------------------------------------------------------

type StepId = "measure" | "evaluate" | "prioritise" | "adjust" | "review";

const LOOP_STEPS: { id: StepId; verb: string; owner: string; detail: string; needs: string; ifSkipped: string; angle: number }[] = [
  { id: "measure", verb: "Measure", owner: "Data owner", detail: "Capture the figure consistently, on a fixed boundary.", needs: "a consistent boundary", ifSkipped: "Nothing new is captured, so every later step works on stale numbers.", angle: -90 },
  { id: "evaluate", verb: "Evaluate", owner: "Metric owner", detail: "Compare it with the target — on track, or not?", needs: "a target", ifSkipped: "Figures are never compared with a target, so nobody knows whether they are on track.", angle: -18 },
  { id: "prioritise", verb: "Prioritise", owner: "Review lead", detail: "Decide what, out of everything found, is acted on first.", needs: "someone who can say “this, not that”", ifSkipped: "Everything found is treated as equally urgent, so nothing gets done first.", angle: 54 },
  { id: "adjust", verb: "Adjust", owner: "Delivery owner", detail: "Make the change — a process, a policy, a target revision.", needs: "a delivery owner", ifSkipped: "Findings stay findings: no process, policy or target actually changes.", angle: 126 },
  { id: "review", verb: "Review", owner: "Management review", detail: "On a fixed date, check the adjustment worked — then the loop repeats.", needs: "a fixed date and management attention", ifSkipped: "Nobody checks whether the adjustment worked, so the loop cannot learn.", angle: 198 },
];

type Cadence = "monthly" | "quarterly" | "yearly" | "none";
const CADENCES: { id: Cadence; label: string; reviews: number }[] = [
  { id: "monthly", label: "Monthly", reviews: 12 },
  { id: "quarterly", label: "Quarterly", reviews: 4 },
  { id: "yearly", label: "Once a year", reviews: 1 },
  { id: "none", label: "No fixed cadence", reviews: 0 },
];

const LOOP_CX = 150;
const LOOP_CY = 100;
const LOOP_R = 62;

const weeksLabel = (reviews: number) => (reviews > 0 ? `${parseFloat((52 / (reviews * 2)).toFixed(1))} weeks` : "no schedule — only when someone happens to look");

export function PdcaLoop() {
  const [cadence, setCadence] = useState<Cadence>("quarterly");
  const [hasOwner, setHasOwner] = useState(true);
  const [skipped, setSkipped] = useState<StepId[]>([]);
  const [selected, setSelected] = useState<StepId>("measure");
  const [change, setChange] = useState<string | null>(null);

  const reviews = CADENCES.find((c) => c.id === cadence)!.reviews;
  const step = LOOP_STEPS.find((s) => s.id === selected)!;
  const working = hasOwner && skipped.length === 0 && reviews > 0;
  const decisions = working ? reviews : 0;
  const edited = cadence !== "quarterly" || !hasOwner || skipped.length > 0;

  const changeCadence = (next: Cadence) => {
    const from = CADENCES.find((c) => c.id === cadence)!;
    const to = CADENCES.find((c) => c.id === next)!;
    setCadence(next);
    setChange(
      `Cadence changed from ${from.label.toLowerCase()} (${from.reviews} reviews a year, a new problem noticed after about ${weeksLabel(from.reviews)}) to ${to.label.toLowerCase()} (${to.reviews} a year, ${weeksLabel(to.reviews)}). The cadence sets how fast the organisation can change its mind.`,
    );
  };
  const toggleOwner = () => {
    setHasOwner((v) => !v);
    setChange(
      hasOwner
        ? "You removed the named owner. Every step still turns, but nobody must act on what it shows — the loop keeps running and decides nothing."
        : "You named an owner. Each turn now has someone who must act on the result, so the decisions count comes back.",
    );
  };
  const toggleSkip = (id: StepId) => {
    const s = LOOP_STEPS.find((x) => x.id === id)!;
    const on = skipped.includes(id);
    setSkipped((cur) => (on ? cur.filter((x) => x !== id) : [...cur, id]));
    setChange(on ? `You put “${s.verb}” back. The loop needs ${s.needs}.` : `You skipped “${s.verb}”. ${s.ifSkipped}`);
  };
  const reset = () => {
    setCadence("quarterly");
    setHasOwner(true);
    setSkipped([]);
    setChange("Back to the baseline: quarterly, all five steps, a named owner.");
  };

  const headline = working ? `Loop complete — ${decisions} ${decisions === 1 ? "chance" : "chances"} a year to change a decision` : "The loop is not steering";
  const why = !hasOwner
    ? "No named owner: the steps turn, but nobody has to act on the result, so 0 decisions change."
    : skipped.length > 0
      ? `Broken at ${skipped.map((id) => LOOP_STEPS.find((s) => s.id === id)!.verb.toLowerCase()).join(" and ")}: ${LOOP_STEPS.find((s) => s.id === skipped[0])!.ifSkipped}`
      : reviews === 0
        ? "With no fixed cadence, review happens only when someone happens to look — which is not a routine, so 0 decisions are scheduled."
        : `Every step has an owner and a date. A problem that starts today is noticed after about ${weeksLabel(reviews)} (52 ÷ ${reviews} ÷ 2), and each review is a chance to change a decision.`;

  return (
    <div className="space-y-4">
      <svg viewBox="0 0 300 200" preserveAspectRatio="xMidYMid meet" className="mx-auto h-auto w-full max-w-sm" role="img" aria-label="A five-step loop: measure, evaluate, prioritise, adjust, review, then repeating.">
        <circle cx={LOOP_CX} cy={LOOP_CY} r={LOOP_R} fill="none" stroke="currentColor" className={working ? "text-accent/40" : "text-line"} strokeWidth="10" strokeDasharray={working ? undefined : "6 6"} />
        {LOOP_STEPS.map((s) => {
          const rad = (a: number) => (a * Math.PI) / 180;
          const x = LOOP_CX + LOOP_R * Math.cos(rad(s.angle));
          const y = LOOP_CY + LOOP_R * Math.sin(rad(s.angle));
          const on = selected === s.id;
          const off = skipped.includes(s.id);
          return (
            <g key={s.id} className="cursor-pointer" onClick={() => setSelected(s.id)}>
              <circle cx={x} cy={y} r="20" className={clsx("transition-colors duration-150", off ? "fill-danger/10 stroke-danger" : on ? "fill-accent" : "fill-paper stroke-accent/40")} strokeWidth="1.4" strokeDasharray={off ? "3 2" : undefined} />
              <text x={x} y={y + 3} textAnchor="middle" className={clsx("text-[8px] font-semibold", off ? "fill-danger" : on ? "fill-paper" : "fill-ink")}>
                {s.verb}
              </text>
            </g>
          );
        })}
        <text x={LOOP_CX} y={LOOP_CY - 6} textAnchor="middle" className="fill-ink text-[15px] font-semibold tabular-nums">
          {reviews}× a year
        </text>
        <text x={LOOP_CX} y={LOOP_CY + 10} textAnchor="middle" className="fill-ash text-[8px] font-semibold uppercase tracking-wide">
          {hasOwner ? "owner named" : "no owner"}
        </text>
      </svg>

      <div>
        <p className="text-micro font-semibold uppercase tracking-wide text-ash">Review cadence</p>
        <div className="mt-1.5 flex flex-wrap gap-1.5">
          {CADENCES.map((c) => (
            <Chip key={c.id} on={cadence === c.id} onClick={() => changeCadence(c.id)}>
              {c.label}
            </Chip>
          ))}
          <Chip on={hasOwner} onClick={toggleOwner}>
            {hasOwner ? "Owner named" : "No owner"}
          </Chip>
        </div>
      </div>

      <p className="text-center text-caption font-semibold tabular-nums text-ink">
        {reviews} reviews a year · new problem noticed after about {weeksLabel(reviews)} · decisions the loop can change: {decisions}
      </p>

      <div>
        <p className="text-micro font-semibold uppercase tracking-wide text-ash">Pick a step, then try skipping it</p>
        <div className="mt-1.5 flex flex-wrap gap-1.5">
          {LOOP_STEPS.map((s) => (
            <Chip key={s.id} on={selected === s.id} onClick={() => setSelected(s.id)} tone={skipped.includes(s.id) ? "warn" : "accent"}>
              {s.verb}
              {skipped.includes(s.id) ? " (skipped)" : ""}
            </Chip>
          ))}
        </div>
        <div key={step.id} className="reveal-in mt-1.5 rounded-xl border border-accent/30 bg-accentSoft p-3">
          <p className="text-caption text-ink">
            <span className="font-semibold text-accent">{step.verb} — </span>
            {step.detail}
          </p>
          <p className="mt-1 text-micro text-ash">Typical owner: {step.owner} · needs {step.needs}</p>
          <button type="button" onClick={() => toggleSkip(step.id)} aria-pressed={skipped.includes(step.id)} className="mt-2 rounded-full border border-line bg-paper px-2.5 py-1 text-micro font-semibold text-accent hover:border-accent">
            {skipped.includes(step.id) ? `Put ${step.verb.toLowerCase()} back` : `Skip ${step.verb.toLowerCase()}`}
          </button>
        </div>
      </div>

      <WhyResult headline={headline} why={why} tone={working ? "accent" : "warn"} />
      <WhatChanged text={change} onReset={edited ? reset : undefined} />
    </div>
  );
}

// ---------------------------------------------------------------------------
// M6 — The three pulls: score a practice metric and see what it becomes
// ---------------------------------------------------------------------------

type PullId = "measurability" | "informative" | "controllability";
const PULLS: { id: PullId; name: string }[] = [
  { id: "measurability", name: "Measurability" },
  { id: "informative", name: "Informative value" },
  { id: "controllability", name: "Controllability" },
];
type Score = 1 | 2 | 3;
const SCORE_LABEL: Record<Score, string> = { 1: "Low", 2: "Medium", 3: "High" };

type TriSample = { id: string; label: string; scores: Record<PullId, Score>; reasons: Record<PullId, string> };

const TRI_SAMPLES: TriSample[] = [
  {
    id: "utilisation",
    label: "Server utilisation",
    scores: { measurability: 3, informative: 2, controllability: 3 },
    reasons: {
      measurability: "Read automatically from monitoring.",
      informative: "Shows idle hardware, but on its own it does not say what to do.",
      controllability: "IT decides which servers run.",
    },
  },
  {
    id: "grid",
    label: "Grid carbon intensity",
    scores: { measurability: 2, informative: 3, controllability: 1 },
    reasons: {
      measurability: "Published by grid operators, with some delay.",
      informative: "Explains a large part of the purchased-electricity (Scope 2) result.",
      controllability: "IT cannot change the grid's energy mix.",
    },
  },
  {
    id: "commute",
    label: "Staff commuting survey",
    scores: { measurability: 1, informative: 2, controllability: 1 },
    reasons: {
      measurability: "Needs a survey and manual analysis each time.",
      informative: "Points at a real Scope 3 source.",
      controllability: "IT does not steer how people commute.",
    },
  },
  {
    id: "printing",
    label: "Printer pages per site",
    scores: { measurability: 3, informative: 1, controllability: 2 },
    reasons: {
      measurability: "Printers count pages themselves.",
      informative: "The count barely changes any decision.",
      controllability: "Facilities can set printing rules.",
    },
  },
];

const VERT: Record<PullId, [number, number]> = { measurability: [180, 40], informative: [64, 190], controllability: [296, 190] };

function verdictOf(s: Record<PullId, Score>): { label: string; rule: string } {
  if (s.informative === 1) return { label: "Park it", rule: "convenient to measure but thin — it barely changes a decision, however easy it is to collect" };
  if (s.controllability === 1) return { label: "Monitor it", rule: "informative but outside the organisation's control — show it and label it, but do not hold anyone to it" };
  return { label: "Steer it — KPI candidate", rule: "informative and within the organisation's control" };
}

function pointOf(s: Record<PullId, Score>): [number, number] {
  const sum = s.measurability + s.informative + s.controllability;
  let x = 0;
  let y = 0;
  for (const p of PULLS) {
    const w = s[p.id] / sum;
    x += w * VERT[p.id][0];
    y += w * VERT[p.id][1];
  }
  return [x, y];
}

export function TradeoffTriangle() {
  const [sampleId, setSampleId] = useState("grid");
  const sample = TRI_SAMPLES.find((s) => s.id === sampleId)!;
  const [scores, setScores] = useState<Record<PullId, Score>>(sample.scores);
  const [change, setChange] = useState<string | null>(null);

  const pick = (id: string) => {
    const s = TRI_SAMPLES.find((x) => x.id === id)!;
    setSampleId(id);
    setScores(s.scores);
    setChange(`Now scoring “${s.label}”: ${verdictOf(s.scores).label.toLowerCase()} as it stands.`);
  };

  const cycle = (id: PullId) => {
    const next = ((scores[id] % 3) + 1) as Score;
    const after = { ...scores, [id]: next };
    const before = verdictOf(scores);
    const now = verdictOf(after);
    setScores(after);
    setChange(
      `${PULLS.find((p) => p.id === id)!.name} changed from ${SCORE_LABEL[scores[id]].toLowerCase()} to ${SCORE_LABEL[next].toLowerCase()} (baseline: ${SCORE_LABEL[sample.scores[id]].toLowerCase()}). ${
        before.label === now.label ? `The verdict stays “${now.label}”.` : `The verdict moves from “${before.label}” to “${now.label}” — ${now.rule}.`
      }`,
    );
  };

  const [px, py] = pointOf(scores);
  const [bx, by] = pointOf(sample.scores);
  const sum = scores.measurability + scores.informative + scores.controllability;
  const v = verdictOf(scores);
  const edited = PULLS.some((p) => scores[p.id] !== sample.scores[p.id]);
  const weakest = [...PULLS].sort((a, b) => scores[a.id] - scores[b.id])[0];

  return (
    <div className="space-y-4">
      <div>
        <p className="text-micro font-semibold uppercase tracking-wide text-ash">Try a practice metric</p>
        <div className="mt-1.5 flex flex-wrap gap-1.5">
          {TRI_SAMPLES.map((s) => (
            <Chip key={s.id} on={sampleId === s.id} onClick={() => pick(s.id)}>
              {s.label}
            </Chip>
          ))}
        </div>
      </div>

      <svg viewBox="0 0 360 230" preserveAspectRatio="xMidYMid meet" className="mx-auto h-auto w-full max-w-md" role="img" aria-label={`A triangle of the three pulls. ${sample.label} sits at ${SCORE_LABEL[scores.measurability]} measurability, ${SCORE_LABEL[scores.informative]} informative value, ${SCORE_LABEL[scores.controllability]} controllability.`}>
        <polygon points="180,40 64,190 296,190" fill="none" stroke="currentColor" className="text-line" strokeWidth="1.6" />
        <text x="180" y="24" textAnchor="middle" className="fill-ink text-[11px] font-semibold">
          Measurability
        </text>
        <text x="64" y="208" textAnchor="middle" className="fill-ink text-[11px] font-semibold">
          Informative value
        </text>
        <text x="296" y="208" textAnchor="middle" className="fill-ink text-[11px] font-semibold">
          Controllability
        </text>
        {edited && <circle cx={bx} cy={by} r="7" fill="none" stroke="currentColor" className="text-ash" strokeWidth="1.5" strokeDasharray="3 3" />}
        <circle cx={px} cy={py} r="8" className="fill-accent" style={{ transition: "cx .3s ease, cy .3s ease" }} />
        <text x={px} y={py - 13} textAnchor="middle" className="fill-ink text-[10px] font-semibold">
          {v.label.split(" — ")[0]}
        </text>
      </svg>

      <div className="grid gap-2 sm:grid-cols-3">
        {PULLS.map((p) => (
          <div key={p.id} className="rounded-xl border border-line bg-paper p-3">
            <p className="text-caption font-semibold text-ink">{p.name}</p>
            <p className="mt-0.5 text-micro text-ink">
              {scores[p.id] === sample.scores[p.id] ? sample.reasons[p.id] : `You set this to ${SCORE_LABEL[scores[p.id]].toLowerCase()} — as recorded: ${SCORE_LABEL[sample.scores[p.id]].toLowerCase()}. ${sample.reasons[p.id]}`}
            </p>
            <button type="button" onClick={() => cycle(p.id)} className="mt-2 rounded-full border border-line bg-canvas px-2.5 py-1 text-micro font-semibold text-accent hover:border-accent">
              {SCORE_LABEL[scores[p.id]]} ({scores[p.id]}) — change
            </button>
          </div>
        ))}
      </div>

      <p className="text-center text-caption font-semibold tabular-nums text-ink">
        {scores.measurability} + {scores.informative} + {scores.controllability} = {sum} · pulls: {PULLS.map((p) => `${Math.round((scores[p.id] / sum) * 100)}%`).join(" / ")}
      </p>

      <WhyResult
        headline={v.label}
        why={`${sample.label}: ${v.rule}. The weakest pull is ${weakest.name.toLowerCase()} (${SCORE_LABEL[scores[weakest.id]].toLowerCase()}). Rule of thumb: steer what you own, monitor the rest.`}
        tone={v.label.startsWith("Steer") ? "accent" : "warn"}
      />
      <WhatChanged text={change} onReset={edited ? () => { setScores(sample.scores); setChange("Back to the scores as recorded."); } : undefined} />
    </div>
  );
}

// ---------------------------------------------------------------------------
// M7 — The three lines, neutrally, and the attractive-but-weak trap
// ---------------------------------------------------------------------------

export function ThreeLinesPreview() {
  const [conditionId, setConditionId] = useState<string>(CONDITIONS[0].id);
  const [withReview, setWithReview] = useState(false);
  const [change, setChange] = useState<string | null>(null);
  const condition = CONDITIONS.find((c) => c.id === conditionId)!;

  const VIEWS_PER_QUARTER = 300;
  const decisionsPerYear = withReview ? 4 : 0;

  return (
    <div className="space-y-4">
      <div>
        <p className="text-micro font-semibold uppercase tracking-wide text-ash">What does each line ask of this condition?</p>
        <div className="mt-1.5 flex flex-wrap gap-1.5">
          {CONDITIONS.map((c) => (
            <Chip key={c.id} on={conditionId === c.id} onClick={() => setConditionId(c.id)}>
              {c.label}
            </Chip>
          ))}
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        {OPTION_LINES.map((l) => (
          <div key={l.id} className="flex flex-col gap-2 rounded-xl border border-line bg-paper p-3">
            <div className="flex items-center gap-2">
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-mist text-ash">
                <Icon name={l.icon} className="h-3.5 w-3.5" />
              </span>
              <p className="text-caption font-semibold text-ink">
                Line {l.letter} — {l.title}
              </p>
            </div>
            <ul className="space-y-0.5">
              {l.involves.map((line) => (
                <li key={line} className="flex gap-1.5 text-micro text-ash">
                  <span className="mt-[5px] h-1 w-1 shrink-0 rounded-full bg-ash" />
                  {line}
                </li>
              ))}
            </ul>
            <div key={condition.id} aria-live="polite" className="reveal-in mt-auto rounded-lg border border-accent/30 bg-accentSoft p-2">
              <p className="text-micro font-semibold uppercase tracking-wide text-accent">{condition.label}</p>
              <p className="mt-0.5 text-micro text-ink">{condition.facts[l.id]}</p>
            </div>
          </div>
        ))}
      </div>
      <p className="text-micro text-ash">These are facts about what each line involves — not ratings. Rating them is Task 2.</p>

      <div className="rounded-xl border border-line bg-paper p-3">
        <p className="text-micro font-semibold uppercase tracking-wide text-ash">The trap — the same dashboard, with and without a routine behind it</p>
        <p className="mt-0.5 text-micro text-ash">Illustrative numbers for a practice dashboard, not Clarity's.</p>
        <div className="mt-2 flex flex-wrap gap-1.5">
          <Chip
            on={!withReview}
            onClick={() => {
              setWithReview(false);
              setChange("You took the review away. The dashboard did not change, but decisions changed per year fall from 4 to 0: nothing in the routine turns a panel into a choice.");
            }}
          >
            Dashboard alone
          </Chip>
          <Chip
            on={withReview}
            onClick={() => {
              setWithReview(true);
              setChange("You added a quarterly review with a named owner. The dashboard did not change; the routine behind it did — decisions changed per year go from 0 to 4.");
            }}
          >
            Dashboard + quarterly review
          </Chip>
        </div>
        <p className="mt-2 text-caption font-semibold tabular-nums text-ink">
          Panel views per quarter: {VIEWS_PER_QUARTER} · reviews per year: {withReview ? 4 : 0} · decisions changed per year: {decisionsPerYear}
        </p>
        <div className="mt-2">
          <WhyResult
            headline={withReview ? "Visible and steering" : "Visible but not steering"}
            why={
              withReview
                ? "The same panels now feed a fixed review with an owner, so each quarter something is decided. Judge a line by what it depends on."
                : "300 views a quarter and no decision changes: attractive on the surface, weak underneath — transparency theatre, not steering."
            }
            tone={withReview ? "accent" : "warn"}
          />
        </div>
        <div className="mt-2">
          <WhatChanged text={change} />
        </div>
      </div>
    </div>
  );
}
