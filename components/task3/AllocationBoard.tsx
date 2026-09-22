"use client";

import { useEffect, useId } from "react";
import clsx from "clsx";
import { CAP, LEVERS, POOL, POSITIONS, POSITION_LABEL, SCENARIO_LABEL, computeBoard } from "@/data/leverData";
import type { LeverId, Scenario } from "@/data/leverData";
import { formatEuro } from "@/lib/parseAmount";
import { useCountUp } from "@/lib/useCountUp";
import { IDS3 } from "@/lib/l3";
import { useStore } from "@/store/useStore";
import { AnswerKey } from "@/components/ui/AnswerKey";
import { allocationKey } from "@/lib/answerKey";

const W = 640;
const X0 = 20;
const X1 = 620;
const MAX = 250_000;
const x = (v: number) => X0 + (v / MAX) * (X1 - X0);

const LEVER_FILL: Record<LeverId, { fill: string; stroke: string }> = {
  l1: { fill: "#2F5D62", stroke: "#1F3F43" },
  l2: { fill: "#D99A2B", stroke: "#8A5A0B" },
  l3: { fill: "#8B9098", stroke: "#59606A" },
};

/** The total-cost bar. The cap line crosses it at €200,000; whatever sits above is hatched, never blocked. */
function CostBar({ segments, total, over }: { segments: { id: LeverId; cost: number }[]; total: number; over: number }) {
  const uid = useId().replace(/:/g, "");
  let acc = 0;
  return (
    <svg viewBox={`0 0 ${W} 112`} className="h-auto w-full" role="img" aria-labelledby={`${uid}-t ${uid}-d`}>
      <title id={`${uid}-t`}>Total cost bar</title>
      <desc id={`${uid}-d`}>{`Total commitment ${formatEuro(total)} against a cap of ${formatEuro(CAP)}. ${over > 0 ? `${formatEuro(over)} is over the cap and is hatched.` : "The total is within the cap."}`}</desc>
      <defs>
        <pattern id={`${uid}-over`} width="8" height="8" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
          <rect width="8" height="8" fill="#FBF0D6" />
          <line x1="0" y1="0" x2="0" y2="8" stroke="#A4472A" strokeWidth="3" />
        </pattern>
      </defs>
      <line x1={X0} x2={X1} y1="76" y2="76" stroke="#59606A" strokeWidth="1.2" />
      {[0, 50_000, 100_000, 150_000, 200_000, 250_000].map((v) => (
        <g key={v}>
          <line x1={x(v)} x2={x(v)} y1="76" y2="81" stroke="#59606A" />
          <text x={x(v)} y="96" textAnchor="middle" fontSize="11" fill="#59606A">
            {v === 0 ? "€0" : `€${v / 1000}k`}
          </text>
        </g>
      ))}
      {segments.map((s) => {
        if (s.cost === 0) return null;
        const start = acc;
        const end = acc + s.cost;
        acc = end;
        const inCapEnd = Math.min(end, CAP);
        const st = LEVER_FILL[s.id];
        return (
          <g key={s.id}>
            {start < CAP && (
              <rect x={x(start)} y="32" width={x(inCapEnd) - x(start)} height="40" fill={st.fill} stroke={st.stroke} strokeWidth="1.4" style={{ transition: "width .35s ease-out, x .35s ease-out" }} />
            )}
            {end > CAP && (
              <rect x={x(Math.max(start, CAP))} y="32" width={x(end) - x(Math.max(start, CAP))} height="40" fill={`url(#${uid}-over)`} stroke="#A4472A" strokeWidth="1.6" />
            )}
            {x(inCapEnd) - x(start) > 40 && start < CAP && (
              <text x={(x(start) + x(inCapEnd)) / 2} y="57" textAnchor="middle" fontSize="12" fontWeight="700" fill={s.id === "l1" ? "#FFFEFA" : "#1F2328"}>
                {s.id.toUpperCase()}
              </text>
            )}
          </g>
        );
      })}
      <line x1={x(CAP)} x2={x(CAP)} y1="14" y2="76" stroke="#1F2328" strokeWidth="2" strokeDasharray="3 3" />
      <text x={x(CAP)} y="10" textAnchor="middle" fontSize="12" fontWeight="700" fill="#1F2328">
        Cap {formatEuro(CAP)}
      </text>
    </svg>
  );
}

function Meter({ label, value, unit, note }: { label: string; value: number; unit: string; note?: string }) {
  const v = useCountUp(value, 350);
  return (
    <div className="rounded-lg border border-line bg-paper px-3 py-2">
      <p className="text-micro font-semibold uppercase text-ash">{label}</p>
      <p className="tnum text-h2" aria-label={`${label}: ${value} ${unit}`}>
        {Math.round(v)}
        <span className="ml-1.5 text-caption font-normal text-ash">{unit === "accounts" && value === 1 ? "account" : unit}</span>
      </p>
      {note && <p className="fade-in mt-0.5 text-micro normal-case tracking-normal text-ash">{note}</p>}
    </div>
  );
}

/**
 * The allocation board. Three levers, each a 3-position discrete switch (None /
 * Partial / Full) with the cost and output of every position printed beside it.
 * The cap line at €200,000 crosses a live-stacking cost bar; the part above it is
 * hatched, not blocked. Two scenario tabs re-render the meters with the
 * scenario's multiplier already applied. The board computes; the participant reads.
 */
export function AllocationBoard() {
  const levers = useStore((s) => s.route3.levers);
  const scenario = useStore((s) => s.route3.scenario);
  const setLever = useStore((s) => s.setLever);
  const setScenario = useStore((s) => s.setScenario);
  const board = computeBoard(levers);
  const conv = board.conversions[scenario];

  // The tab on screen counts as opened.
  useEffect(() => {
    setScenario(useStore.getState().route3.scenario);
  }, [setScenario]);

  const total = useCountUp(board.cost, 350);

  return (
    <div id={IDS3.board} className="space-y-4 rounded-lg p-1">
      <div className="grid gap-3 lg:grid-cols-3">
        {LEVERS.map((l) => (
          <fieldset key={l.id} className="space-y-2 rounded-lg border border-line bg-paper p-3">
            <legend className="px-1 text-caption font-bold">{l.name}</legend>
            <p className="text-caption text-ash">{l.what}</p>
            <p className="text-micro font-semibold uppercase text-accent">Rope it pulls (A3): {l.rope}</p>
            <div role="radiogroup" aria-label={`${l.name} position`} className="grid gap-1.5">
              {POSITIONS.map((p) => {
                const on = levers[l.id] === p;
                return (
                  <button
                    key={p}
                    type="button"
                    role="radio"
                    aria-checked={on}
                    onClick={() => setLever(l.id, p)}
                    className={clsx(
                      "rounded-lg border px-3 py-2 text-left transition-colors",
                      on ? "border-accent bg-accentSoft ring-1 ring-gold" : "border-line bg-paper hover:border-ash",
                    )}
                  >
                    <span className="flex items-baseline justify-between gap-2">
                      <span className="font-bold">{POSITION_LABEL[p]}</span>
                      <span className="tnum text-caption font-semibold">{formatEuro(l.cost[p])}</span>
                    </span>
                    <span className="block text-micro normal-case tracking-normal text-ash">
                      {l.produces[p]} {l.producesUnit}
                    </span>
                  </button>
                );
              })}
            </div>
          </fieldset>
        ))}
      </div>

      <div className="space-y-1">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <p className="smallcaps">Total 6-month commitment</p>
          <p className="tnum text-h2" aria-live="polite" aria-label={`Total commitment ${formatEuro(board.cost)}`}>
            {formatEuro(total)}
          </p>
        </div>
        <CostBar segments={board.segments} total={board.cost} over={board.over} />
        <p aria-live="polite" className={clsx("text-caption", board.over > 0 ? "font-semibold text-rust" : "text-ash")}>
          {board.over > 0
            ? `${formatEuro(board.over)} over the ${formatEuro(CAP)} cap. Nothing is blocked, but this cannot be filed as it stands.`
            : `${formatEuro(CAP - board.cost)} of headroom under the ${formatEuro(CAP)} cap.`}
        </p>
      </div>

      <div className="space-y-2" id={IDS3.scenario}>
        <div role="tablist" aria-label="Scenario" className="flex gap-1.5">
          {(["statusQuo", "priceWar"] as Scenario[]).map((sc) => (
            <button
              key={sc}
              type="button"
              role="tab"
              aria-selected={scenario === sc}
              onClick={() => setScenario(sc)}
              className={clsx(
                "btn btn-sm min-h-[40px] border",
                scenario === sc ? "border-ink bg-ink text-paper" : "border-line bg-paper text-ash hover:border-ash",
              )}
            >
              {SCENARIO_LABEL[sc]}
            </button>
          ))}
          <span className="self-center pl-1 text-caption text-ash">Switching tabs updates the meters. Nothing to press.</span>
        </div>
        <div role="tabpanel" aria-label={`${SCENARIO_LABEL[scenario]} meters`} className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
          <Meter label="Named owners" value={board.owners} unit="accounts" />
          <Meter label="Reviewed accounts" value={board.reviews} unit="accounts" />
          <Meter
            label={`Framework conversions · ${SCENARIO_LABEL[scenario]}`}
            value={conv}
            unit="accounts"
            note={board.sequenceHit ? "No named account owner assigned. Conversion capacity is reduced." : undefined}
          />
          <Meter label="Uncovered pool" value={board.uncovered} unit={`of ${POOL} accounts`} />
        </div>
      </div>
      <AnswerKey block={allocationKey()} />
    </div>
  );
}
