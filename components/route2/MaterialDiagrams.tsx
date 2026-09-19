"use client";

import { useState } from "react";
import clsx from "clsx";
import { Icon } from "@/components/icons/LineIcons";
import {
  FACTORS,
  GUIDING_DECISIONS,
  LAYERS,
  DEPENDENCY_NOTE,
  RESPONSIBILITIES,
  RISK_WHEN_LOW,
  ROLES,
  describeAllocationChange,
  readAllocation,
  type FactorId,
  type LayerId,
  type RoleId,
} from "@/lib/route2";
import { Chip, WhatChanged, WhyResult } from "@/components/ui/DiagramKit";

/**
 * The four D1–D4 diagrams — inline SVG, no library (CLAUDE.md §9). Same
 * contract as Route 1: numbers, a reason per value, a live "Why this result", a
 * live "What just changed", a baseline. Practice cases here are not Verdeon.
 */

// ---------------------------------------------------------------------------
// D1 — Documentation or instrument? Name a decision, name an accountable person
// ---------------------------------------------------------------------------

type Instrument = { id: string; label: string; decision: string; owner: string };

const INSTRUMENTS: Instrument[] = [
  {
    id: "dashboard",
    label: "A utilisation dashboard",
    decision: "The monthly IT leadership meeting decides which under-used systems to retire.",
    owner: "The Head of IT Operations answers for the dashboard's targets.",
  },
  {
    id: "baseline",
    label: "A carbon baseline",
    decision: "The budget round uses the baseline to choose which reduction projects to fund.",
    owner: "The Head of Sustainability answers for the baseline method and its yearly update.",
  },
  {
    id: "report",
    label: "An annual sustainability report",
    decision: "The board uses the target-versus-actual page to approve next year's reduction budget.",
    owner: "The CFO signs off the figures and the board reviews the targets.",
  },
];

export function LeadershipInstrumentToggle() {
  const [id, setId] = useState("dashboard");
  const [hasDecision, setHasDecision] = useState(false);
  const [hasOwner, setHasOwner] = useState(false);
  const [change, setChange] = useState<string | null>(null);
  const inst = INSTRUMENTS.find((i) => i.id === id)!;
  const n = (hasDecision ? 1 : 0) + (hasOwner ? 1 : 0);
  const state = n === 2 ? "instrument" : n === 1 ? "information" : "documentation";
  const edited = hasDecision || hasOwner;

  const pick = (next: string) => {
    setId(next);
    setHasDecision(false);
    setHasOwner(false);
    setChange(`Now testing “${INSTRUMENTS.find((i) => i.id === next)!.label}”: as it stands, no decision and no accountable person are attached.`);
  };
  const toggleDecision = () => {
    setHasDecision((v) => !v);
    setChange(
      hasDecision
        ? "You removed the decision. The figure can still be seen and even owned, but nothing changes when it moves."
        : `You attached a decision: ${inst.decision} The figure now has somewhere to go. You are now asking “what does this change?”`,
    );
  };
  const toggleOwner = () => {
    setHasOwner((v) => !v);
    setChange(
      hasOwner
        ? "You removed the accountable person. The decision exists, but nobody must make it happen."
        : `You named an accountable person: ${inst.owner} Someone now has to act. You are now asking “who is accountable?”`,
    );
  };

  return (
    <div className="space-y-4">
      <div>
        <p className="text-micro font-semibold uppercase tracking-wide text-ash">Pick a practice instrument</p>
        <div className="mt-1.5 flex flex-wrap gap-1.5">
          {INSTRUMENTS.map((i) => (
            <Chip key={i.id} on={id === i.id} onClick={() => pick(i.id)}>
              {i.label}
            </Chip>
          ))}
        </div>
      </div>

      <svg viewBox="0 0 320 130" preserveAspectRatio="xMidYMid meet" className="mx-auto h-auto w-full max-w-md" role="img" aria-label={`${inst.label}: ${state}. ${n} of 2 links attached.`}>
        {state === "documentation" && (
          <g>
            {[0, 1, 2, 3, 4].map((i) => (
              <rect key={i} x={110 - i * 3} y={100 - i * 16} width="120" height="14" rx="3" className={i === 4 ? "fill-accentSoft stroke-accent" : "fill-paper stroke-line"} strokeWidth="1.2" />
            ))}
            <text x="160" y="122" textAnchor="middle" className="fill-ash text-[10px] font-semibold">
              Reports keep stacking — nothing moves
            </text>
          </g>
        )}
        {state !== "documentation" && (
          <g>
            <rect x="20" y="40" width="90" height="44" rx="8" className="fill-paper stroke-ink" strokeWidth="1.4" />
            <text x="65" y="66" textAnchor="middle" className="fill-ink text-[10px] font-semibold">
              The figure
            </text>
            <path d="M110 62 H150" stroke="currentColor" className="text-accent" strokeWidth="2" strokeDasharray="4 4" />
            <rect x="150" y="30" width="72" height="26" rx="8" className={hasDecision ? "fill-accentSoft stroke-accent" : "fill-paper stroke-line"} strokeDasharray={hasDecision ? undefined : "3 3"} strokeWidth="1.4" />
            <text x="186" y="47" textAnchor="middle" className={clsx("text-[9px] font-semibold", hasDecision ? "fill-accent" : "fill-ash")}>
              {hasDecision ? "A decision" : "no decision"}
            </text>
            <rect x="150" y="66" width="72" height="26" rx="8" className={hasOwner ? "fill-accentSoft stroke-accent" : "fill-paper stroke-line"} strokeDasharray={hasOwner ? undefined : "3 3"} strokeWidth="1.4" />
            <text x="186" y="83" textAnchor="middle" className={clsx("text-[9px] font-semibold", hasOwner ? "fill-accent" : "fill-ash")}>
              {hasOwner ? "Accountable" : "no one accountable"}
            </text>
            <text x="270" y="66" textAnchor="middle" className="fill-ink text-[22px] font-semibold tabular-nums">
              {n}/2
            </text>
          </g>
        )}
      </svg>

      <div className="grid gap-2 sm:grid-cols-2">
        <div className={clsx("rounded-xl border p-3", hasDecision ? "border-accent/40 bg-accentSoft" : "border-line bg-paper")}>
          <p className="text-caption font-semibold text-ink">Decision: {hasDecision ? "attached" : "missing"}</p>
          <p className="mt-0.5 text-micro text-ash">What would a manager decide differently?</p>
          {hasDecision && <p className="mt-1 text-micro text-ink">{inst.decision}</p>}
          <button type="button" onClick={toggleDecision} aria-pressed={hasDecision} className="mt-2 rounded-full border border-line bg-canvas px-2.5 py-1 text-micro font-semibold text-accent hover:border-accent">
            {hasDecision ? "Remove the decision" : "Attach a decision"}
          </button>
        </div>
        <div className={clsx("rounded-xl border p-3", hasOwner ? "border-accent/40 bg-accentSoft" : "border-line bg-paper")}>
          <p className="text-caption font-semibold text-ink">Accountable person: {hasOwner ? "named" : "missing"}</p>
          <p className="mt-0.5 text-micro text-ash">Who must make the change happen?</p>
          {hasOwner && <p className="mt-1 text-micro text-ink">{inst.owner}</p>}
          <button type="button" onClick={toggleOwner} aria-pressed={hasOwner} className="mt-2 rounded-full border border-line bg-canvas px-2.5 py-1 text-micro font-semibold text-accent hover:border-accent">
            {hasOwner ? "Remove the person" : "Name an accountable person"}
          </button>
        </div>
      </div>

      <p className="text-center text-caption font-semibold tabular-nums text-ink">Decision {hasDecision ? 1 : 0} + Accountable {hasOwner ? 1 : 0} = {n} of 2</p>

      <WhyResult
        headline={state === "instrument" ? "A leadership instrument" : state === "information" ? "Information — it informs, but does not steer" : "Documentation"}
        why={
          state === "instrument"
            ? "It names the decision it changes and the person who must make that change happen."
            : state === "information"
              ? hasDecision
                ? "A decision is named but nobody is accountable for making it happen, so it can be ignored without consequence."
                : "Someone answers for it, but no decision changes when it moves — a well-kept record, not a steering tool."
              : "Neither a decision nor an accountable person is attached. However accurate, it records what happened and changes nothing."
        }
        tone={state === "instrument" ? "accent" : "warn"}
      />
      <WhatChanged
        text={change}
        onReset={edited ? () => { setHasDecision(false); setHasOwner(false); setChange("Back to the instrument as it stands."); } : undefined}
      />
    </div>
  );
}

// ---------------------------------------------------------------------------
// D2 — Build order: which layers have their footing?
// ---------------------------------------------------------------------------

const ORDERS: { id: string; label: string; order: LayerId[] }[] = [
  { id: "staged", label: "Short → Medium → Structural", order: ["shortTerm", "mediumTerm", "structural"] },
  { id: "structuralFirst", label: "Structural first", order: ["structural", "shortTerm", "mediumTerm"] },
  { id: "mediumFirst", label: "Medium first", order: ["mediumTerm", "shortTerm", "structural"] },
  { id: "governanceBeforeBuild", label: "Governance before the build", order: ["shortTerm", "structural", "mediumTerm"] },
];

function footing(order: LayerId[]) {
  return order.map((id, i) => {
    const layer = LAYERS.find((l) => l.id === id)!;
    const before = order.slice(0, i);
    const missing = layer.dependsOn.filter((d) => !before.includes(d));
    return { layer, position: i + 1, ok: missing.length === 0, missing };
  });
}

export function LayeredStaircase() {
  const [orderId, setOrderId] = useState("staged");
  const [change, setChange] = useState<string | null>(null);
  const current = ORDERS.find((o) => o.id === orderId)!;
  const rows = footing(current.order);
  const ok = rows.filter((r) => r.ok).length;
  const firstBroken = rows.find((r) => !r.ok);

  const pick = (next: string) => {
    const from = ORDERS.find((o) => o.id === orderId)!;
    const to = ORDERS.find((o) => o.id === next)!;
    const fromOk = footing(from.order).filter((r) => r.ok).length;
    const toRows = footing(to.order);
    const toOk = toRows.filter((r) => r.ok).length;
    const broken = toRows.find((r) => !r.ok);
    setOrderId(next);
    setChange(
      `Order changed from “${from.label}” (${fromOk} of 3 layers with footing) to “${to.label}” (${toOk} of 3).${
        broken ? ` ${broken.layer.name} now comes ${broken.position === 1 ? "first" : `in position ${broken.position}`} without ${broken.missing.map((m) => LAYERS.find((l) => l.id === m)!.name.toLowerCase()).join(" and ")} behind it.` : " Every layer has what it needs."
      } You are now asking “what does each layer stand on?”`,
    );
  };

  return (
    <div className="space-y-4">
      <div>
        <p className="text-micro font-semibold uppercase tracking-wide text-ash">Try a build order</p>
        <div className="mt-1.5 flex flex-wrap gap-1.5">
          {ORDERS.map((o) => (
            <Chip key={o.id} on={orderId === o.id} onClick={() => pick(o.id)}>
              {o.label}
            </Chip>
          ))}
        </div>
      </div>

      <svg viewBox="0 0 320 150" preserveAspectRatio="xMidYMid meet" className="mx-auto h-auto w-full max-w-md" role="img" aria-label={`Three build steps in the order ${current.label}; ${ok} of 3 have footing.`}>
        {rows.map((r, i) => {
          const stepW = 96;
          const x = 14 + i * stepW;
          const h = 40 + i * 26;
          const y = 130 - h;
          return (
            <g key={r.layer.id}>
              <rect x={x} y={y} width={stepW - 8} height={h} rx="6" className={r.ok ? "fill-accentSoft stroke-accent" : "fill-danger/10 stroke-danger"} strokeWidth="1.4" strokeDasharray={r.ok ? undefined : "4 3"} />
              <text x={x + (stepW - 8) / 2} y={y + 16} textAnchor="middle" className="fill-ink text-[10px] font-semibold">
                {r.position}. {r.layer.name}
              </text>
              <text x={x + (stepW - 8) / 2} y={y + 30} textAnchor="middle" className={clsx("text-[9px] font-semibold", r.ok ? "fill-accent" : "fill-danger")}>
                {r.ok ? "has footing" : "no footing"}
              </text>
            </g>
          );
        })}
      </svg>

      <ul className="space-y-1.5">
        {rows.map((r) => (
          <li key={r.layer.id} className="flex items-start gap-2 rounded-lg border border-line bg-paper p-2">
            <span aria-hidden className={clsx("mt-0.5 inline-flex h-4 w-4 shrink-0 items-center justify-center rounded-full text-[10px] font-bold text-paper", r.ok ? "bg-accent" : "bg-danger")}>
              {r.ok ? "✓" : "✕"}
            </span>
            <div className="min-w-0">
              <p className="text-caption text-ink">
                <span className="font-semibold">{r.position}. {r.layer.name}</span> — {r.layer.description}
              </p>
              <p className="text-micro text-ash">Needs: {r.layer.needs}</p>
              {!r.ok &&
                r.missing.map((m) => (
                  <p key={m} className="text-micro text-ink">
                    {DEPENDENCY_NOTE[r.layer.id][m]}
                  </p>
                ))}
            </div>
          </li>
        ))}
      </ul>

      <p className="text-center text-caption font-semibold tabular-nums text-ink">{ok} of 3 layers have the footing they need</p>

      <WhyResult
        headline={ok === 3 ? "Every layer builds on the one before" : `${3 - ok} ${3 - ok === 1 ? "layer has" : "layers have"} no footing`}
        why={
          ok === 3
            ? "Short-term produces the KPI list, baseline and owners; medium-term builds on them; structural governance embeds what already runs."
            : `${firstBroken!.layer.name} comes ${firstBroken!.position === 1 ? "first" : `in position ${firstBroken!.position}`} but needs ${firstBroken!.missing.map((m) => LAYERS.find((l) => l.id === m)!.name.toLowerCase()).join(" and ")} first. ${DEPENDENCY_NOTE[firstBroken!.layer.id][firstBroken!.missing[0]]}`
        }
        tone={ok === 3 ? "accent" : "warn"}
      />
      <WhatChanged text={change} onReset={orderId !== "staged" ? () => pick("staged") : undefined} resetLabel="Back to the staged order" />
    </div>
  );
}

// ---------------------------------------------------------------------------
// D3 — Five factors, one allocation: presets and 5-point moves
// ---------------------------------------------------------------------------

const PENTAGON_LABELS = FACTORS.map((f) => f.short);

type Preset = { id: string; label: string; points: Record<FactorId, number>; reasons: Record<FactorId, string> };

const PRESETS: Preset[] = [
  {
    id: "audit",
    label: "Audit-driven group",
    points: { accuracy: 25, effort: 10, comparability: 20, externalCommunication: 35, operationalUsability: 10 },
    reasons: {
      accuracy: "Auditors test figures, so precision matters.",
      effort: "The work is tolerated because the requirement is fixed.",
      comparability: "Group reporting needs every site on one definition.",
      externalCommunication: "Disclosure is the main driver.",
      operationalUsability: "Operations come second to disclosure.",
    },
  },
  {
    id: "lean",
    label: "Lean operations team",
    points: { accuracy: 10, effort: 30, comparability: 10, externalCommunication: 10, operationalUsability: 40 },
    reasons: {
      accuracy: "Rough figures are enough to act on.",
      effort: "The team is small, so the system must stay cheap to run.",
      comparability: "Few sites, so little to compare.",
      externalCommunication: "No disclosure duty yet.",
      operationalUsability: "The main goal: the people on the floor can act on it.",
    },
  },
  {
    id: "even",
    label: "Even split",
    points: { accuracy: 20, effort: 20, comparability: 20, externalCommunication: 20, operationalUsability: 20 },
    reasons: {
      accuracy: "No deliberate priority.",
      effort: "No deliberate priority.",
      comparability: "No deliberate priority.",
      externalCommunication: "No deliberate priority.",
      operationalUsability: "No deliberate priority — which is the problem: it cannot say what wins in a conflict.",
    },
  },
];

function pentagonPoint(i: number, value: number, cx: number, cy: number, rMax: number, scaleMax: number) {
  const angle = -Math.PI / 2 + (i * 2 * Math.PI) / 5;
  const r = (value / scaleMax) * rMax;
  return [cx + r * Math.cos(angle), cy + r * Math.sin(angle)] as const;
}

export function TradeoffPentagon() {
  const [presetId, setPresetId] = useState("audit");
  const preset = PRESETS.find((p) => p.id === presetId)!;
  const [points, setPoints] = useState<Record<FactorId, number>>(preset.points);
  const [from, setFrom] = useState<FactorId>("externalCommunication");
  const [to, setTo] = useState<FactorId>("operationalUsability");
  const [change, setChange] = useState<string | null>(null);

  const cx = 160;
  const cy = 95;
  const rMax = 62;
  const SCALE = 40;
  const reading = readAllocation(points);
  const edited = FACTORS.some((f) => points[f.id] !== preset.points[f.id]);
  const poly = (p: Record<FactorId, number>) => FACTORS.map((f, i) => pentagonPoint(i, p[f.id], cx, cy, rMax, SCALE)).map(([x, y]) => `${x.toFixed(1)},${y.toFixed(1)}`).join(" ");
  const nameOf = (id: FactorId) => FACTORS.find((f) => f.id === id)!.name;

  const pickPreset = (id: string) => {
    const next = PRESETS.find((p) => p.id === id)!;
    setChange(`Switched from “${preset.label}” to “${next.label}”: ${describeAllocationChange(points, next.points)}`);
    setPresetId(id);
    setPoints(next.points);
  };

  const move = () => {
    if (from === to || points[from] < 5) return;
    const next = { ...points, [from]: points[from] - 5, [to]: points[to] + 5 };
    setChange(`You moved 5 points from ${nameOf(from)} to ${nameOf(to)}: ${describeAllocationChange(points, next)}`);
    setPoints(next);
  };

  const headline = reading.why;
  const whyParts = [
    reading.tensions.length > 0 ? `Tension: ${reading.tensions.map((t) => t.text).join(" ")}` : "No two heavily-weighted factors pull against each other here.",
    reading.underweighted.length > 0
      ? `Underweighted: ${reading.underweighted.map((id) => `${nameOf(id)} (the risk: ${RISK_WHEN_LOW[id]})`).join("; ")}.`
      : "Nothing is deliberately underweighted — which means nothing was really chosen.",
  ];

  return (
    <div className="space-y-4">
      <div>
        <p className="text-micro font-semibold uppercase tracking-wide text-ash">Practice organisation</p>
        <div className="mt-1.5 flex flex-wrap gap-1.5">
          {PRESETS.map((p) => (
            <Chip key={p.id} on={presetId === p.id} onClick={() => pickPreset(p.id)}>
              {p.label}
            </Chip>
          ))}
        </div>
      </div>

      <svg viewBox="0 0 320 190" preserveAspectRatio="xMidYMid meet" className="mx-auto h-auto w-full max-w-sm" role="img" aria-label={`A five-point pentagon of the allocation: ${FACTORS.map((f) => `${f.name} ${points[f.id]}`).join(", ")}.`}>
        {[10, 20, 30, 40].map((ring) => (
          <polygon key={ring} points={Array.from({ length: 5 }, (_, i) => pentagonPoint(i, ring, cx, cy, rMax, SCALE)).map(([x, y]) => `${x.toFixed(1)},${y.toFixed(1)}`).join(" ")} className="fill-none stroke-line" strokeWidth="1" />
        ))}
        {PENTAGON_LABELS.map((label, i) => {
          const [x, y] = pentagonPoint(i, 50, cx, cy, rMax, SCALE);
          return (
            <text key={label} x={x} y={y + 3} textAnchor="middle" className="fill-ash text-[9px] font-semibold">
              {label} {points[FACTORS[i].id]}
            </text>
          );
        })}
        {edited && <polygon points={poly(preset.points)} className="fill-none stroke-ash" strokeWidth="1.4" strokeDasharray="4 3" />}
        <polygon points={poly(points)} className="fill-accent/15 stroke-accent" strokeWidth="2.2" style={{ transition: "all .3s ease" }} />
      </svg>

      <ul className="grid gap-1.5 sm:grid-cols-2">
        {FACTORS.map((f) => {
          const delta = points[f.id] - preset.points[f.id];
          return (
            <li key={f.id} className="rounded-lg border border-line bg-paper p-2">
              <p className="text-caption font-semibold tabular-nums text-ink">
                {f.name}: {points[f.id]}
                {delta !== 0 && <span className="ml-1.5 font-normal text-ash">({delta > 0 ? "+" : "−"}{Math.abs(delta)} from {preset.label.toLowerCase()})</span>}
              </p>
              <p className="text-micro text-ash">{delta === 0 ? preset.reasons[f.id] : `You changed this. Recorded reason: ${preset.reasons[f.id]}`}</p>
            </li>
          );
        })}
      </ul>

      <p className="text-center text-caption font-semibold tabular-nums text-ink">{FACTORS.map((f) => points[f.id]).join(" + ")} = {reading.total}</p>

      <div className="flex flex-wrap items-center gap-2 rounded-xl border border-line bg-paper p-3">
        <span className="text-micro font-semibold uppercase tracking-wide text-ash">Move 5 points</span>
        <label className="text-micro text-ash">
          from{" "}
          <select value={from} onChange={(e) => setFrom(e.target.value as FactorId)} className="rounded-md border border-line bg-canvas px-1.5 py-1 text-micro text-ink">
            {FACTORS.map((f) => (
              <option key={f.id} value={f.id}>{f.name}</option>
            ))}
          </select>
        </label>
        <label className="text-micro text-ash">
          to{" "}
          <select value={to} onChange={(e) => setTo(e.target.value as FactorId)} className="rounded-md border border-line bg-canvas px-1.5 py-1 text-micro text-ink">
            {FACTORS.map((f) => (
              <option key={f.id} value={f.id}>{f.name}</option>
            ))}
          </select>
        </label>
        <button type="button" onClick={move} disabled={from === to || points[from] < 5} className="rounded-full border border-line bg-canvas px-2.5 py-1 text-micro font-semibold text-accent hover:border-accent disabled:cursor-not-allowed disabled:opacity-50">
          Move
        </button>
      </div>

      <WhyResult headline={headline} why={whyParts.join(" ")} tone={reading.tensions.length > 0 || reading.underweighted.length === 0 ? "warn" : "accent"} />
      <WhatChanged text={change} onReset={edited ? () => { setPoints(preset.points); setChange(`Back to “${preset.label}” as recorded.`); } : undefined} />
    </div>
  );
}

// ---------------------------------------------------------------------------
// D4 — Role lab: one practice responsibility, four possible holders
// ---------------------------------------------------------------------------

type PracticeResp = { id: string; label: string; consequence: Record<RoleId, string> };

const PRACTICE_RESPONSIBILITIES: PracticeResp[] = [
  {
    id: "budget",
    label: "Approve the budget for a new monitoring tool",
    consequence: {
      cio: "Decided on whether the tool makes steering easier — sound on capability, though cost discipline may be thin.",
      sustainability: "Decided on whether the tool's output will hold up in disclosure — credible, but it may favour reporting features over daily use.",
      controlling: "Decided on cost and risk — a tight budget, but the case for steering value may be underweighted.",
      consultant: "An outsider approves spend they will not live with — an independent view, but no accountability for running it.",
    },
  },
  {
    id: "challenge",
    label: "Challenge whether the baseline method is credible",
    consequence: {
      cio: "The owner of the steering system challenges its own input — quick, but with little independence.",
      sustainability: "Tested against what would survive scrutiny — strong on credibility.",
      controlling: "Tested for consistency and cost — reliable numbers, but not whether the method is right for disclosure.",
      consultant: "An independent check that does not depend on any insider's view — strong on robustness, with no day-to-day follow-through.",
    },
  },
  {
    id: "slide",
    label: "Decide which KPIs go on the board slide",
    consequence: {
      cio: "Chosen for what leadership can steer by — a slide that leads to decisions.",
      sustainability: "Chosen for what looks credible externally — it may include figures the board cannot act on.",
      controlling: "Chosen for cost and risk — it may leave out outcome metrics the board should see.",
      consultant: "An outsider picks what leadership sees — a fresh view, with no accountability for what gets steered.",
    },
  },
];

export function RoleChips() {
  const [respId, setRespId] = useState("budget");
  const [roleId, setRoleId] = useState<RoleId>("cio");
  const [change, setChange] = useState<string | null>(null);
  const resp = PRACTICE_RESPONSIBILITIES.find((r) => r.id === respId)!;
  const role = ROLES.find((r) => r.id === roleId)!;

  const assign = (next: RoleId) => {
    if (next === roleId) return;
    const prev = ROLES.find((r) => r.id === roleId)!;
    const to = ROLES.find((r) => r.id === next)!;
    setChange(`You moved “${resp.label}” from ${prev.short} to ${to.short}. The question asked changes from “${prev.asks}” to “${to.asks}” — and the consequence changes with it.`);
    setRoleId(next);
  };

  return (
    <div className="space-y-4">
      <div>
        <p className="text-micro font-semibold uppercase tracking-wide text-ash">Practice responsibility</p>
        <div className="mt-1.5 flex flex-wrap gap-1.5">
          {PRACTICE_RESPONSIBILITIES.map((r) => (
            <Chip key={r.id} on={respId === r.id} onClick={() => { setRespId(r.id); setChange(`Now testing “${r.label}”. Give it to each role in turn.`); }}>
              {r.label}
            </Chip>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2">
        {ROLES.map((r) => {
          const on = roleId === r.id;
          return (
            <button
              key={r.id}
              type="button"
              onClick={() => assign(r.id)}
              aria-pressed={on}
              className={clsx("flex flex-col items-start gap-1 rounded-xl border p-3 text-left transition-colors duration-150", on ? "border-accent bg-accent text-paper" : "border-line bg-paper text-ink hover:border-ash")}
            >
              <span className="flex items-center gap-2">
                <Icon name={r.icon} className="h-5 w-5 shrink-0" />
                <span className="text-caption font-semibold">{r.short}</span>
              </span>
              <span className={clsx("text-micro", on ? "text-paper/90" : "text-ash")}>{r.mandate}</span>
            </button>
          );
        })}
      </div>

      <div key={`${respId}-${roleId}`} className="reveal-in rounded-xl border border-accent/30 bg-accentSoft p-3">
        <p className="text-caption font-semibold text-ink">{role.name}</p>
        <p className="mt-1 text-caption text-ink"><span className="font-semibold text-accent">Asks: </span>{role.asks}</p>
        <p className="mt-0.5 text-caption text-ink"><span className="font-semibold text-accent">Use when: </span>{role.useWhen}</p>
        <p className="mt-0.5 text-caption text-ink"><span className="font-semibold text-accent">Watch out: </span>{role.watchOut}</p>
      </div>

      <WhyResult headline={`“${resp.label}” held by ${role.short}`} why={resp.consequence[roleId]} />
      <WhatChanged text={change} />
    </div>
  );
}

// ---------------------------------------------------------------------------
// Read-more guides — the options the task offers, defined with "use when"
// ---------------------------------------------------------------------------

/** D2 — the eight twelve-month decisions Stage B offers: what each involves, when it fits, what it costs. */
export function GuidingOptionsGuide() {
  return (
    <div className="max-w-prose space-y-2">
      <h3 className="text-h3 text-ink">The eight twelve-month decisions, defined</h3>
      <p className="text-caption text-ash">Stage B asks you to pick three. Each is neither right nor wrong — it fits some situations and leaves others open.</p>
      <dl className="space-y-2">
        {GUIDING_DECISIONS.map((g) => (
          <div key={g.id} className="rounded-lg border border-line bg-paper p-2.5">
            <dt className="text-caption font-semibold text-ink">{g.text}</dt>
            <dd className="text-micro text-ash"><span className="font-semibold text-ink">Means: </span>{g.means}</dd>
            <dd className="text-micro text-ash"><span className="font-semibold text-ink">Use when: </span>{g.useWhen}</dd>
            <dd className="text-micro text-ash"><span className="font-semibold text-ink">Watch out: </span>{g.watchOut}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

/** D2 — the worked example: read-only, visually distinct, no inputs. */
export function TerraMetricsExample() {
  return (
    <div className="rounded-2xl bg-slate p-4 text-paper" role="note" aria-label="Worked example, read only">
      <p className="text-micro font-semibold uppercase tracking-wide text-paper/70">Worked example · read only · fictional company</p>
      <p className="mt-1 text-body font-semibold">TerraMetrics IT Operations GmbH</p>
      <p className="mt-1 text-caption text-paper/85">It had scattered metrics and no coordinated system. It did not chase perfect data first — it staged three moves around one integrated model.</p>
      <ol className="mt-2 space-y-1 text-caption text-paper/90">
        <li><span className="font-semibold">Short-term: </span>picked a handful of core KPIs, agreed one pragmatic baseline method, named an owner for each.</li>
        <li><span className="font-semibold">Medium-term: </span>built a dashboard for those KPIs and started a regular review cycle.</li>
        <li><span className="font-semibold">Structural: </span>wrote the KPIs and carbon monitoring into the standing management review.</li>
      </ol>
      <p className="mt-2 text-micro text-paper/70">Illustrative — a pattern to reason from, not a benchmark.</p>
    </div>
  );
}

/** D4 — each role: what it means, when to use it, what it asks, what to watch. */
export function RoleGuide() {
  return (
    <div className="max-w-prose space-y-2">
      <h3 className="text-h3 text-ink">The four roles, and when to use each</h3>
      <dl className="space-y-2">
        {ROLES.map((r) => (
          <div key={r.id} className="rounded-lg border border-line bg-paper p-2.5">
            <dt className="text-caption font-semibold text-ink">{r.name}</dt>
            <dd className="text-micro text-ash"><span className="font-semibold text-ink">Means: </span>{r.means}</dd>
            <dd className="text-micro text-ash"><span className="font-semibold text-ink">Use when: </span>{r.useWhen}</dd>
            <dd className="text-micro text-ash"><span className="font-semibold text-ink">Asks: </span>{r.asks}</dd>
            <dd className="text-micro text-ash"><span className="font-semibold text-ink">Watch out: </span>{r.watchOut}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

/** D4 — the four responsibilities Stage E hands out, defined. */
export function ResponsibilitiesGuide() {
  return (
    <div className="max-w-prose space-y-2">
      <h3 className="text-h3 text-ink">The four responsibilities, defined</h3>
      <dl className="space-y-2">
        {RESPONSIBILITIES.map((r) => (
          <div key={r.id} className="rounded-lg border border-line bg-paper p-2.5">
            <dt className="text-caption font-semibold text-ink">{r.name}</dt>
            <dd className="text-micro text-ash">{r.means}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
