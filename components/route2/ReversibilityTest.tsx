"use client";

import clsx from "clsx";
import { reversibilityOutcome, type ReversibilityAnswer, type ReversibilityOutcomeId } from "@/lib/route2";

/**
 * The Reversibility Test — one component, used identically in S2's material
 * (a local-state rehearsal) and inline next to Part 2's "decide now" field
 * (store-backed, via the controlled props below). Never duplicated between
 * the two call sites.
 */
export function ReversibilityTest({
  reversible,
  moreData,
  onChangeReversible,
  onChangeMoreData,
}: {
  reversible: ReversibilityAnswer | null;
  moreData: ReversibilityAnswer | null;
  onChangeReversible: (v: ReversibilityAnswer) => void;
  onChangeMoreData: (v: ReversibilityAnswer) => void;
}) {
  const outcome = reversibilityOutcome(reversible, moreData);

  return (
    <div className="space-y-3">
      <div className="grid gap-3 sm:grid-cols-2">
        <ToggleQuestion label="Reversible / cheap to undo?" value={reversible} onChange={onChangeReversible} />
        <ToggleQuestion label="Would more data change the direction?" value={moreData} onChange={onChangeMoreData} />
      </div>

      <svg viewBox="0 0 360 190" className="h-auto w-full" role="img" aria-label="Reversibility decision flow">
        {BOXES.map((b) => (
          <line key={b.id} x1={180} y1={95} x2={b.x} y2={b.y} className="stroke-line" strokeWidth={1.5} />
        ))}

        <polygon points="180,68 214,95 180,122 146,95" className="fill-canvas stroke-ash" strokeWidth={1.5} />
        <text x="180" y="99" textAnchor="middle" className="fill-ash" style={{ fontSize: 8.5, fontWeight: 700 }}>
          Two questions
        </text>

        {BOXES.map((b) => {
          const on = outcome?.id === b.id;
          return (
            <g key={b.id}>
              <rect
                x={b.x - 52}
                y={b.y - 18}
                width="104"
                height="36"
                rx="9"
                className={clsx(on ? "fill-accentSoft stroke-accent" : "fill-canvas stroke-line")}
                strokeWidth={on ? 2 : 1.5}
              />
              <text
                x={b.x}
                y={b.y + 4}
                textAnchor="middle"
                className={on ? "fill-accent" : "fill-ash"}
                style={{ fontSize: 10.5, fontWeight: 700 }}
              >
                {b.short}
              </text>
            </g>
          );
        })}
      </svg>

      {outcome ? (
        <p className="reveal-in rounded-lg border border-accent/30 bg-accentSoft px-3 py-2 text-caption text-ink">
          <span className="font-semibold text-accent">{outcome.label}. </span>
          {outcome.detail}
        </p>
      ) : (
        <p className="text-caption text-ash">Answer both questions to see the outcome.</p>
      )}
    </div>
  );
}

const BOXES: { id: ReversibilityOutcomeId; short: string; x: number; y: number }[] = [
  { id: "decideNow", short: "Decide now", x: 180, y: 25 },
  { id: "pilot", short: "Pilot first", x: 305, y: 95 },
  { id: "decideNowDespite", short: "Decide anyway", x: 180, y: 165 },
  { id: "moreEvidence", short: "Get evidence", x: 55, y: 95 },
];

function ToggleQuestion({
  label,
  value,
  onChange,
}: {
  label: string;
  value: ReversibilityAnswer | null;
  onChange: (v: ReversibilityAnswer) => void;
}) {
  return (
    <div>
      <p className="text-caption font-semibold text-ink">{label}</p>
      <div className="mt-1.5 flex gap-1.5">
        {(["yes", "no"] as const).map((v) => (
          <button
            key={v}
            type="button"
            onClick={() => onChange(v)}
            aria-pressed={value === v}
            className={clsx(
              "rounded-full border px-3 py-1 text-micro font-semibold transition-colors duration-150",
              value === v ? "border-accent bg-accentSoft text-accent" : "border-line text-ash hover:border-ash",
            )}
          >
            {v === "yes" ? "Yes" : "No"}
          </button>
        ))}
      </div>
    </div>
  );
}
