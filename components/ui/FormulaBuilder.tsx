"use client";

import clsx from "clsx";
import type { CalcBuilder } from "@/lib/calcBuilder";
import { builderResult, partKey } from "@/lib/calcBuilder";
import { scrollToAndFlash } from "@/lib/flash";
import { parseAmount } from "@/lib/parseAmount";

/**
 * The automatic calculator under a calculation question: one small input per part of the formula, the
 * formula re-written with the learner's values, the live result, and a button that copies the result
 * into the answer field. The manual Calculator stays beside it; the learner uses either. After a check,
 * every wrong part is outlined in amber (#15) and names the exact row and part of the row to read,
 * never the value.
 */
export function FormulaBuilder({
  figure,
  builder,
  parts,
  partFlags,
  onPart,
  onUse,
  unit,
}: {
  figure: string;
  builder: CalcBuilder;
  parts: Record<string, string>;
  partFlags: string[];
  onPart: (key: string, value: string) => void;
  onUse: (value: number) => void;
  unit?: string;
}) {
  const result = builderResult(builder, figure, parts);
  const filled = Object.fromEntries(
    builder.parts.map((p) => {
      const raw = (parts[partKey(figure, p.id)] ?? "").trim();
      return [p.id, raw || "▢"];
    }),
  );
  const wrongHere = builder.parts.filter((p) => partFlags.includes(partKey(figure, p.id)));

  return (
    <div className="mt-2 space-y-2 border-t border-line pt-2">
      <p className="text-caption text-ink">
        <span className="font-semibold">Or let it calculate:</span> fill each part below with the number from the table. The result
        appears as you type.
      </p>
      <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
        {builder.parts.map((p) => {
          const key = partKey(figure, p.id);
          const id = `part-${figure}-${p.id}`;
          const raw = parts[key] ?? "";
          const flagged = partFlags.includes(key);
          const unreadable = raw.trim() !== "" && parseAmount(raw) === null;
          return (
            <div key={p.id} id={id} className={clsx("space-y-1 rounded-md p-1.5", flagged && "is-flagged bg-accentSoft")}>
              <label htmlFor={`${id}-in`} className="block text-micro font-semibold text-ash">
                {p.label}
              </label>
              <input
                id={`${id}-in`}
                className="field tnum py-1.5 text-caption"
                inputMode="decimal"
                autoComplete="off"
                value={raw}
                onChange={(e) => onPart(key, e.target.value)}
                aria-invalid={flagged || undefined}
                aria-describedby={flagged ? `${id}-clue` : undefined}
              />
              {unreadable && <p className="text-micro normal-case tracking-normal text-ash">Cannot read this as a number yet.</p>}
              {flagged && (
                <p id={`${id}-clue`} role="status" className="text-micro normal-case tracking-normal text-ink">
                  <span className="font-semibold text-accent">Check this part. </span>
                  Read it from: {p.clue}
                </p>
              )}
            </div>
          );
        })}
      </div>
      <div className="flex flex-wrap items-center gap-x-3 gap-y-2 rounded-md bg-paper px-3 py-2">
        <p className="tnum min-w-0 flex-1 break-words text-caption text-ink">
          {builder.show(filled)} ={" "}
          <strong className="text-body">{result === null ? "…" : result.toLocaleString("en-US", { maximumFractionDigits: 2 })}</strong>
          {result !== null && unit && <span className="text-ash"> {unit}</span>}
        </p>
        <button
          type="button"
          onClick={() => {
            if (result !== null) return onUse(result);
            const empty = builder.parts.find((p) => parseAmount(parts[partKey(figure, p.id)] ?? "") === null);
            if (empty) scrollToAndFlash(`part-${figure}-${empty.id}`);
          }}
          aria-disabled={result === null}
          title={result === null ? "Fill every part first." : undefined}
          className={clsx("btn-ghost btn-sm", result === null && "opacity-60")}
        >
          Use this result in {figure}
        </button>
      </div>
      {result === null && (
        <p className="text-micro normal-case tracking-normal text-ash">Fill every part to see the result (▢ marks an empty part).</p>
      )}
      {wrongHere.length > 0 && (
        <p role="status" className="text-caption text-ink">
          {wrongHere.length === 1 ? "1 part is" : `${wrongHere.length} parts are`} outlined above:{" "}
          {wrongHere.map((p) => p.label).join(", ")}.
        </p>
      )}
    </div>
  );
}
