"use client";

import clsx from "clsx";

/**
 * A native `<input type="range">` wearing the brand tokens — no UI library
 * (CLAUDE.md #9). Track and thumb need real vendor pseudo-elements, so the
 * paint lives in `.range-accent` in globals.css; everything else is Tailwind.
 *
 * 0 means "not set" rather than a real answer. That matters for a predict-then-
 * reveal exercise: if the slider defaulted to a valid mid value, a learner who
 * never touched it would be recorded as having predicted 3, and the whole point
 * is to capture a deliberate guess. Starting below the scale also avoids the
 * dead case where clicking the default position fires no change event.
 */
export function Slider({
  id,
  label,
  instruction,
  value,
  onChange,
  min = 1,
  max = 5,
  lowLabel,
  highLabel,
  valueLabels,
}: {
  id: string;
  label: string;
  /** Sits under the label, never only in a placeholder (CLAUDE.md #8). */
  instruction?: string;
  /** 0 = not set. */
  value: number;
  onChange: (v: number) => void;
  min?: number;
  max?: number;
  lowLabel?: string;
  highLabel?: string;
  /** Optional word per value, e.g. 1 → "Very low". */
  valueLabels?: Record<number, string>;
}) {
  const isSet = value >= min;

  return (
    <div className="py-1.5">
      <div className="flex flex-wrap items-baseline justify-between gap-x-3">
        <label htmlFor={id} className="text-caption font-semibold text-ink">
          {label}
        </label>
        <span
          className={clsx(
            "text-micro font-semibold tabular-nums",
            isSet ? "text-accent" : "text-ash",
          )}
        >
          {isSet ? `${value}${valueLabels?.[value] ? ` · ${valueLabels[value]}` : ""}` : "Not set"}
        </span>
      </div>

      {instruction && <p className="mt-0.5 text-micro text-ash">{instruction}</p>}

      <input
        id={id}
        type="range"
        min={0}
        max={max}
        step={1}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        aria-valuetext={isSet ? String(value) : "not set"}
        className={clsx("range-accent mt-2 w-full", !isSet && "range-unset")}
      />

      {(lowLabel || highLabel) && (
        <div className="flex justify-between text-micro text-ash">
          <span>{lowLabel}</span>
          <span>{highLabel}</span>
        </div>
      )}
    </div>
  );
}
