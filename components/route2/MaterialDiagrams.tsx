"use client";

import { useState } from "react";
import { RadarChart, type RadarAxis } from "@/components/ui/RadarChart";
import { CRITERIA, type CriterionId, type ReversibilityAnswer } from "@/lib/route2";
import { OwnershipMap } from "./OwnershipMap";
import { ReversibilityTest } from "./ReversibilityTest";

/**
 * S1's diagram: the four criterion icons (original inline SVG, one-off —
 * not the shared LineIcons registry, since these are specific to this one
 * section) plus the practice radar, built from the exact `RadarChart`
 * component Task Part 1 uses for real (never a second implementation).
 */
export function CriteriaOverview() {
  return (
    <div className="space-y-5">
      <div className="grid gap-3 sm:grid-cols-2">
        {CRITERIA.map((c) => (
          <div key={c.id} className="flex items-start gap-3 rounded-xl border border-line bg-canvas p-3">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-accentSoft text-accent">
              <CriterionIcon id={c.id} />
            </span>
            <div>
              <p className="text-caption font-semibold text-ink">{c.label}</p>
              <p className="mt-0.5 text-micro text-ash">{c.definition}</p>
            </div>
          </div>
        ))}
      </div>

      <PracticeRadar />
    </div>
  );
}

const ICON_BASE = {
  viewBox: "0 0 24 24",
  fill: "none" as const,
  stroke: "currentColor",
  strokeWidth: 1.6,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true,
};

/** Four original, one-off pictograms — dial, coin-stack, person-with-arrow, shield-check. */
function CriterionIcon({ id }: { id: CriterionId }) {
  if (id === "feasibility")
    return (
      <svg {...ICON_BASE} className="h-5 w-5">
        <path d="M4 17a8 8 0 1 1 16 0" />
        <path d="M12 17 16 10.5" />
        <circle cx="12" cy="17" r="1.3" />
      </svg>
    );
  if (id === "economic")
    return (
      <svg {...ICON_BASE} className="h-5 w-5">
        <path d="M4 17h16M4 17l3-6h10l3 6" />
        <path d="M9 11V7a3 3 0 0 1 6 0v4" />
        <ellipse cx="7" cy="11" rx="2" ry="0.9" />
        <ellipse cx="17" cy="11" rx="2" ry="0.9" />
      </svg>
    );
  if (id === "behavioural")
    return (
      <svg {...ICON_BASE} className="h-5 w-5">
        <circle cx="9" cy="6.5" r="2.6" />
        <path d="M4.5 18v-1.3c0-2.4 2-4.3 4.5-4.3s4.5 1.9 4.5 4.3V18" />
        <path d="M15 9.5h5.5M17.5 7l3 2.5-3 2.5" />
      </svg>
    );
  return (
    <svg {...ICON_BASE} className="h-5 w-5">
      <path d="M12 3.5 19 6v5.5c0 4-3 7-7 9-4-2-7-5-7-9V6l7-2.5Z" />
      <path d="M9 12l2 2 4-4" />
    </svg>
  );
}

const DEFAULT_PRACTICE: Record<CriterionId, number> = { feasibility: 2, economic: 3, behavioural: 1, regulatory: 2 };

function PracticeRadar() {
  const [values, setValues] = useState<Record<CriterionId, number>>(DEFAULT_PRACTICE);
  const axes: RadarAxis[] = CRITERIA.map((c) => ({ key: c.id, label: c.label.split(" ")[0] }));

  const step = (id: CriterionId, dir: 1 | -1) =>
    setValues((v) => ({ ...v, [id]: Math.max(1, Math.min(3, v[id] + dir)) }));

  return (
    <div className="rounded-xl border border-line bg-canvas p-4">
      <p className="text-micro font-semibold uppercase tracking-wide text-accent">
        Practice — try changing one value and see how the shape shifts before you build your real one in the task.
      </p>
      <div className="mt-3 grid gap-4 sm:grid-cols-[1fr_auto] sm:items-center">
        <RadarChart
          axes={axes}
          series={[{ id: "practice", label: "Illustrative measure", values, tone: "option", style: { color: "accent", marker: "circle" } }]}
          max={3}
          ringCount={3}
          title="Practice radar — an illustrative measure scored on all four criteria"
        />
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-1">
          {CRITERIA.map((c) => (
            <div key={c.id} className="flex items-center justify-between gap-2 rounded-lg border border-line bg-paper px-2.5 py-1.5">
              <span className="text-micro text-ash">{c.label.split(" ")[0]}</span>
              <div className="flex items-center gap-1.5">
                <StepButton onClick={() => step(c.id, -1)} label={`Decrease ${c.label}`} symbol="−" />
                <span className="w-3 text-center text-micro font-semibold tabular-nums text-ink">{values[c.id]}</span>
                <StepButton onClick={() => step(c.id, 1)} label={`Increase ${c.label}`} symbol="+" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function StepButton({ onClick, label, symbol }: { onClick: () => void; label: string; symbol: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className="flex h-5 w-5 items-center justify-center rounded-md border border-line text-micro font-bold text-ash hover:border-accent hover:text-accent"
    >
      {symbol}
    </button>
  );
}

/** S2's diagram: the Ownership Map in explain mode, plus a local-state rehearsal of the Reversibility Test. */
export function OwnershipAndReversibilityDemo() {
  const [reversible, setReversible] = useState<ReversibilityAnswer | null>(null);
  const [moreData, setMoreData] = useState<ReversibilityAnswer | null>(null);

  return (
    <div className="space-y-5">
      <div>
        <p className="text-micro font-semibold uppercase tracking-wide text-ash">Who's in the room</p>
        <OwnershipMap mode="explain" />
      </div>
      <div className="border-t border-line pt-4">
        <p className="text-micro font-semibold uppercase tracking-wide text-ash">Practice — the reversibility test</p>
        <div className="mt-2">
          <ReversibilityTest
            reversible={reversible}
            moreData={moreData}
            onChangeReversible={setReversible}
            onChangeMoreData={setMoreData}
          />
        </div>
      </div>
    </div>
  );
}
