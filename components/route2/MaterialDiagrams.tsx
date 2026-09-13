"use client";

import { useState } from "react";
import clsx from "clsx";
import {
  DEMO_RACI_ROWS,
  MANAGEMENT_LEVERS,
  METRICFLOW,
  POSTURES,
  RACI_FAILURES,
  RACI_LETTERS,
  RACI_ROLES,
  SYMPTOM_LAYER,
  DEFENSIBLE_PARTS,
  PILOT_ANCHORS,
  type PostureId,
} from "@/lib/route2";
import { RaciGrid, type RaciCell } from "@/components/ui/RaciGrid";

/**
 * Route 2's four material diagrams. Inline SVG and CSS only, every hover
 * affordance also a tap affordance, and the sentence always in HTML beside the
 * picture rather than inside it — same rules as Route 1.
 */

// ---------------------------------------------------------------------------
// A — two layers: where the symptom lives, where the decision lives
// ---------------------------------------------------------------------------

const LEVER_X = (i: number) => 40 + i * 120;

export function DecisionLayers() {
  const [selected, setSelected] = useState<string | null>(null);
  const active = MANAGEMENT_LEVERS.find((l) => l.id === selected) ?? null;

  return (
    <div className="space-y-4">
      <svg
        viewBox="0 0 760 330"
        preserveAspectRatio="xMidYMid meet"
        role="img"
        aria-label="Engineering symptoms below, six management levers above, arrows running upward"
        className="h-auto w-full"
      >
        <title>Where the symptom lives, where the decision lives</title>

        {/* Upper layer — where the decision lives */}
        <rect x={16} y={30} width={728} height={104} rx={14} className="fill-accentSoft stroke-accent/40" strokeWidth={1.5} />
        <text x={30} y={24} className="fill-accent" style={{ fontSize: 13, fontWeight: 700 }}>
          WHERE THE DECISION LIVES — management
        </text>

        {MANAGEMENT_LEVERS.map((l, i) => {
          const on = selected === l.id;
          const x = LEVER_X(i);
          return (
            <g
              key={l.id}
              role="button"
              tabIndex={0}
              aria-pressed={on}
              onClick={() => setSelected(on ? null : l.id)}
              onMouseEnter={() => setSelected(l.id)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  setSelected(on ? null : l.id);
                }
              }}
              className="cursor-pointer"
            >
              <rect
                x={x}
                y={52}
                width={104}
                height={60}
                rx={10}
                className={on ? "fill-accent stroke-accent" : "fill-paper stroke-accent/50"}
                strokeWidth={1.6}
              />
              <text
                x={x + 52}
                y={78}
                textAnchor="middle"
                className={on ? "fill-paper" : "fill-ink"}
                style={{ fontSize: 12.5, fontWeight: 600 }}
              >
                {l.label.split(" ")[0]}
              </text>
              {l.label.split(" ").length > 1 && (
                <text
                  x={x + 52}
                  y={94}
                  textAnchor="middle"
                  className={on ? "fill-paper" : "fill-ash"}
                  style={{ fontSize: 11.5 }}
                >
                  {l.label.split(" ").slice(1).join(" ")}
                </text>
              )}
            </g>
          );
        })}

        {/* Lower layer — where the symptom lives */}
        <rect x={16} y={210} width={728} height={96} rx={14} className="fill-mist stroke-line" strokeWidth={1.5} />
        <text x={30} y={202} className="fill-ash" style={{ fontSize: 13, fontWeight: 700 }}>
          WHERE THE SYMPTOM LIVES — engineering
        </text>

        {SYMPTOM_LAYER.map((s, i) => {
          const x = 60 + i * 230;
          const leverIndex = MANAGEMENT_LEVERS.findIndex((l) => l.id === s.lever);
          const on = selected === s.lever;
          return (
            <g key={s.id}>
              <rect
                x={x}
                y={236}
                width={200}
                height={48}
                rx={10}
                className={on ? "fill-paper stroke-accent" : "fill-paper stroke-line"}
                strokeWidth={1.5}
              />
              <text x={x + 100} y={258} textAnchor="middle" className="fill-ink" style={{ fontSize: 12 }}>
                {s.label.slice(0, 26)}
              </text>
              <text x={x + 100} y={273} textAnchor="middle" className="fill-ash" style={{ fontSize: 11.5 }}>
                {s.label.slice(26)}
              </text>
              {/* the arrow upward — never terminating inside the lower layer */}
              <line
                x1={x + 100}
                y1={236}
                x2={LEVER_X(leverIndex) + 52}
                y2={112}
                className={on ? "stroke-accent" : "stroke-ash/50"}
                strokeWidth={on ? 2.2 : 1.4}
                strokeDasharray={on ? "7 5" : undefined}
                markerEnd="url(#arrowUp)"
              />
            </g>
          );
        })}

        <defs>
          <marker id="arrowUp" markerWidth="9" markerHeight="9" refX="5" refY="4.5" orient="auto">
            <path d="M0,0 L9,4.5 L0,9 z" className="fill-ash" />
          </marker>
        </defs>

        <text x={380} y={172} textAnchor="middle" className="fill-ash" style={{ fontSize: 12.5, fontStyle: "italic" }}>
          no arrow terminates inside the lower layer
        </text>
      </svg>

      <div
        className={clsx(
          "rounded-xl border p-4 transition-colors duration-200",
          active ? "border-accent/35 bg-accentSoft" : "border-dashed border-line bg-canvas",
        )}
      >
        {active ? (
          <div className="reveal-in">
            <p className="text-caption font-semibold text-ink">{active.label}</p>
            <p className="mt-1 text-caption text-ink">
              <span className="font-semibold text-accent">Decides. </span>
              {active.decides}
            </p>
            <p className="mt-1.5 text-caption text-ash">
              <span className="font-semibold text-ink">Left to the teams. </span>
              {active.ifLeftToTeams}
            </p>
          </div>
        ) : (
          <p className="text-caption text-ash">
            Tap a lever to see what it decides and what happens when it is left to the teams.
          </p>
        )}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// B — the RACI grid, as a demonstration
// ---------------------------------------------------------------------------

export function RaciDemo() {
  const [cells, setCells] = useState<Record<string, RaciCell>>({});
  const key = (rowId: string, roleId: string) => `${rowId}:${roleId}`;

  return (
    <div className="space-y-4">
      <ul className="grid gap-2 sm:grid-cols-2">
        {RACI_LETTERS.map((l) => (
          <li key={l.id} className="flex gap-2 rounded-xl border border-line bg-canvas p-3">
            <span
              className={clsx(
                "flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-caption font-bold",
                l.id === "A" ? "bg-accent text-paper" : "bg-mist text-ink",
              )}
            >
              {l.id}
            </span>
            <span>
              <span className="block text-caption font-semibold text-ink">{l.name}</span>
              <span className="block text-micro text-ash">{l.meaning}</span>
            </span>
          </li>
        ))}
      </ul>

      <RaciGrid
        idPrefix="r2-demo"
        rows={DEMO_RACI_ROWS}
        roles={RACI_ROLES.map((r) => ({
          id: r.id,
          name: r.name,
          short: r.name.split(" ")[0],
          canBindCapacity: r.id === "cto" || r.id === "product",
        }))}
        capacityRows={["d4"]}
        value={(rowId, roleId) => cells[key(rowId, roleId)] ?? ""}
        onCycle={(rowId, roleId, next) =>
          setCells((c) => ({ ...c, [key(rowId, roleId)]: next }))
        }
        onReset={() => setCells({})}
        labels={{
          manyA: "More than one Accountable in this row — two Accountables have no escalation path between them.",
          noA: "No Accountable in this row — a decision with no owner is one nobody will report as unmade.",
          noR: "No Responsible in this row — someone has to do the work.",
          authority: "Can this role change a team's roadmap? If not, who approves this in practice?",
        }}
      />

      <p className="text-micro text-ash">
        This grid is a sandbox — nothing here is saved or assessed. Try giving row 4 to a role that
        cannot bind capacity and read what comes back.
      </p>

      <ul className="grid gap-2 md:grid-cols-2">
        {RACI_FAILURES.map((f) => (
          <li key={f.id} className="rounded-xl border border-warn/40 bg-warn/5 p-3">
            <p className="text-caption font-semibold text-warn">{f.label}</p>
            <p className="mt-1 text-caption text-ink">{f.what}</p>
            <p className="mt-1 text-micro text-ash">
              <span className="font-semibold text-ink">Symptom. </span>
              {f.symptom}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}

// ---------------------------------------------------------------------------
// C — the four decision postures
// ---------------------------------------------------------------------------

export function DecisionQuadrants() {
  const [open, setOpen] = useState<PostureId | null>(null);
  const active = POSTURES.find((p) => p.id === open) ?? null;

  const cellFor = (information: "low" | "high", delayCost: "low" | "high") =>
    POSTURES.filter((p) => p.information === information && p.delayCost === delayCost);

  const grid: { info: "low" | "high"; delay: "low" | "high" }[] = [
    { info: "low", delay: "high" },
    { info: "high", delay: "high" },
    { info: "low", delay: "low" },
    { info: "high", delay: "low" },
  ];

  return (
    <div className="space-y-4">
      <div className="flex gap-3">
        <div className="flex w-6 items-center justify-center">
          <span className="whitespace-nowrap text-micro uppercase tracking-wide text-ash [writing-mode:vertical-rl] [transform:rotate(180deg)]">
            Cost of delay →
          </span>
        </div>
        <div className="min-w-0 flex-1">
          <div className="grid grid-cols-2 gap-2">
            {grid.map((cell) => {
              const postures = cellFor(cell.info, cell.delay);
              return (
                <div
                  key={`${cell.info}-${cell.delay}`}
                  className={clsx(
                    "min-h-[92px] rounded-xl border p-3",
                    cell.delay === "high" ? "border-accent/35 bg-accentSoft/60" : "border-line bg-canvas",
                  )}
                >
                  {postures.length === 0 ? (
                    <p className="text-micro italic text-ash">—</p>
                  ) : (
                    postures.map((p) => {
                      const on = open === p.id;
                      return (
                        <button
                          key={p.id}
                          type="button"
                          onClick={() => setOpen(on ? null : p.id)}
                          aria-pressed={on}
                          className={clsx(
                            "mb-1.5 block w-full rounded-lg border px-2.5 py-2 text-left text-caption font-semibold transition-colors duration-150",
                            on
                              ? "border-accent bg-accent text-paper"
                              : "border-line bg-paper text-ink hover:border-accent",
                          )}
                        >
                          {p.label}
                        </button>
                      );
                    })
                  )}
                </div>
              );
            })}
          </div>
          <p className="mt-2 text-center text-micro uppercase tracking-wide text-ash">
            Information available →
          </p>
        </div>
      </div>

      <div
        className={clsx(
          "rounded-xl border p-4 transition-colors duration-200",
          active ? "border-accent/35 bg-accentSoft" : "border-dashed border-line bg-canvas",
        )}
      >
        {active ? (
          <div className="reveal-in">
            <p className="text-caption font-semibold text-ink">{active.label}</p>
            <p className="mt-1 text-caption text-ink">
              <span className="font-semibold text-accent">Rule. </span>
              {active.rule}
            </p>
            <p className="mt-1.5 text-caption text-ash">
              <span className="font-semibold text-ink">Failure mode. </span>
              {active.failure}
            </p>
          </div>
        ) : (
          <p className="text-caption text-ash">
            Tap a posture for its rule and its failure mode. Most efficiency decisions sit in the
            top-left: low information, high cost of delay.
          </p>
        )}
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        <div className="rounded-xl border border-line bg-canvas p-4">
          <p className="text-micro font-semibold uppercase tracking-wide text-ash">
            A recommendation that survives challenge
          </p>
          <ol className="mt-2 space-y-1.5">
            {DEFENSIBLE_PARTS.map((p, i) => (
              <li key={p.label} className="flex gap-2 text-caption text-ink">
                <span className="text-ash tabular-nums">{i + 1}.</span>
                <span>
                  <span className="font-semibold">{p.label}. </span>
                  <span className="text-ash">{p.text}</span>
                </span>
              </li>
            ))}
          </ol>
        </div>
        <div className="rounded-xl border border-warn/40 bg-warn/5 p-4">
          <p className="text-micro font-semibold uppercase tracking-wide text-warn">
            The three anchors against pilot purgatory
          </p>
          <ul className="mt-2 space-y-1.5">
            {PILOT_ANCHORS.map((a) => (
              <li key={a.label} className="text-caption text-ink">
                <span className="font-semibold">{a.label}. </span>
                <span className="text-ash">{a.text}</span>
              </li>
            ))}
          </ul>
          <p className="mt-2 text-micro text-ash">
            All three have to exist before the pilot reports — not after it succeeds.
          </p>
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// D — the MetricFlow worked example
// ---------------------------------------------------------------------------

export function WorkedExample() {
  return (
    <div className="overflow-hidden rounded-2xl border-2 border-ink">
      <div className="flex flex-wrap items-center justify-between gap-2 bg-ink px-5 py-2.5">
        <p className="text-micro font-semibold uppercase tracking-wide text-paper">
          {METRICFLOW.company}
        </p>
        <p className="text-micro text-paper/70">{METRICFLOW.banner}</p>
      </div>

      <div className="space-y-5 bg-paper p-5">
        <p className="max-w-prose text-body text-ash">{METRICFLOW.situation}</p>

        <div>
          <p className="text-micro font-semibold uppercase tracking-wide text-ash">Initial position</p>
          <ul className="mt-2 grid gap-1.5 sm:grid-cols-2">
            {METRICFLOW.initialPosition.map((p) => (
              <li key={p} className="flex gap-2 text-caption text-ink">
                <span className="mt-[7px] h-1 w-1 shrink-0 rounded-full bg-ash" />
                <span>{p}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* The reasoning, as one summary picture */}
        <svg
          viewBox="0 0 760 260"
          preserveAspectRatio="xMidYMid meet"
          role="img"
          aria-label="MetricFlow: initial position, four levers, prioritised measure"
          className="h-auto w-full"
        >
          <title>MetricFlow worked reasoning</title>

          <rect x={10} y={40} width={180} height={180} rx={12} className="fill-mist stroke-line" strokeWidth={1.5} />
          <text x={100} y={32} textAnchor="middle" className="fill-ash" style={{ fontSize: 12.5, fontWeight: 700 }}>
            INITIAL POSITION
          </text>
          <text x={100} y={110} textAnchor="middle" className="fill-ink" style={{ fontSize: 13 }}>
            Patterns seen,
          </text>
          <text x={100} y={130} textAnchor="middle" className="fill-ink" style={{ fontSize: 13 }}>
            not translated
          </text>
          <text x={100} y={150} textAnchor="middle" className="fill-ink" style={{ fontSize: 13 }}>
            into decisions
          </text>

          {METRICFLOW.levers.map((l, i) => (
            <g key={l.id}>
              <rect
                x={250}
                y={30 + i * 50}
                width={230}
                height={40}
                rx={9}
                className="fill-paper stroke-accent/50"
                strokeWidth={1.5}
              />
              <text x={365} y={54 + i * 50} textAnchor="middle" className="fill-ink" style={{ fontSize: 12 }}>
                {l.label.length > 42 ? `${l.label.slice(0, 40)}…` : l.label}
              </text>
              <line
                x1={190}
                y1={130}
                x2={250}
                y2={50 + i * 50}
                className="stroke-line"
                strokeWidth={1.3}
              />
              <line
                x1={480}
                y1={50 + i * 50}
                x2={540}
                y2={130}
                className={i === 0 || i === 3 ? "stroke-accent" : "stroke-line"}
                strokeWidth={i === 0 || i === 3 ? 2 : 1.3}
                strokeDasharray={i === 0 || i === 3 ? "6 4" : undefined}
              />
            </g>
          ))}
          <text x={365} y={20} textAnchor="middle" className="fill-accent" style={{ fontSize: 12.5, fontWeight: 700 }}>
            FOUR LEVERS
          </text>

          <rect x={540} y={70} width={210} height={120} rx={12} className="fill-accentSoft stroke-accent" strokeWidth={2} />
          <text x={645} y={62} textAnchor="middle" className="fill-accent" style={{ fontSize: 12.5, fontWeight: 700 }}>
            PRIORITISED FIRST
          </text>
          <text x={645} y={108} textAnchor="middle" className="fill-ink" style={{ fontSize: 13, fontWeight: 600 }}>
            Efficiency monitoring
          </text>
          <text x={645} y={128} textAnchor="middle" className="fill-ink" style={{ fontSize: 13, fontWeight: 600 }}>
            coupled directly to
          </text>
          <text x={645} y={148} textAnchor="middle" className="fill-ink" style={{ fontSize: 13, fontWeight: 600 }}>
            an architecture review
          </text>
        </svg>

        <div className="rounded-xl border border-accent/30 bg-accentSoft p-4">
          <p className="text-micro font-semibold uppercase tracking-wide text-accent">The core idea</p>
          <p className="mt-1 max-w-prose text-caption text-ink">{METRICFLOW.coreIdea}</p>
        </div>

        <div>
          <p className="text-micro font-semibold uppercase tracking-wide text-ash">
            The four levers, in full
          </p>
          <ul className="mt-2 space-y-1.5">
            {METRICFLOW.levers.map((l) => (
              <li key={l.id} className="rounded-xl border border-line bg-canvas p-3">
                <p className="text-caption font-semibold text-ink">{l.label}</p>
                <p className="mt-0.5 text-micro text-ash">{l.note}</p>
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-xl border border-line bg-canvas p-4">
          <p className="text-caption font-semibold text-ink">
            Prioritised: {METRICFLOW.prioritised.label}
          </p>
          <ul className="mt-2 space-y-1">
            {METRICFLOW.prioritised.reasons.map((r) => (
              <li key={r} className="flex gap-2 text-caption text-ash">
                <span className="mt-[7px] h-1 w-1 shrink-0 rounded-full bg-accent" />
                <span>{r}</span>
              </li>
            ))}
          </ul>
          <p className="mt-2 border-t border-line pt-2 text-caption text-ink">
            <span className="font-semibold">Not chosen. </span>
            {METRICFLOW.prioritised.notChosen}
          </p>
        </div>

        {/* Three horizons */}
        <div>
          <p className="text-micro font-semibold uppercase tracking-wide text-ash">
            Sequenced across three horizons
          </p>
          <div className="mt-2 grid gap-3 md:grid-cols-3">
            {METRICFLOW.horizons.map((h, i) => (
              <div key={h.id} className="rounded-xl border border-line bg-canvas p-3">
                <div className="flex items-center gap-2">
                  <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-ink text-micro font-bold text-paper">
                    {i + 1}
                  </span>
                  <p className="text-caption font-semibold text-ink">{h.label}</p>
                </div>
                <ul className="mt-2 space-y-1">
                  {h.items.map((item) => (
                    <li key={item} className="flex gap-2 text-micro text-ash">
                      <span className="mt-[6px] h-1 w-1 shrink-0 rounded-full bg-accent" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
