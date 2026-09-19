"use client";

import { useState } from "react";
import { safeCalc } from "@/lib/safeCalc";
import { useStore } from "@/store/useStore";

const KEYS = ["7", "8", "9", "÷", "4", "5", "6", "×", "1", "2", "3", "−", "0", ".", "(", "+", ")", "%", "^"];

/**
 * A small calculator: keypad plus an expression box, evaluated by the
 * recursive-descent parser in lib/safeCalc.ts (no eval, no Function).
 * "Copy to F#" writes the result into the figure field you last focused.
 */
export function Calculator() {
  const [expr, setExpr] = useState("");
  const focused = useStore((s) => s.focusedFigure);
  const setFillin = useStore((s) => s.setFillin);

  const res = expr.trim() ? safeCalc(expr) : null;
  const value = res && res.ok ? res.value : null;
  const shown = value === null ? "—" : Number.isInteger(value) ? value.toLocaleString("en-US") : String(Math.round(value * 1e6) / 1e6);

  const [msg, setMsg] = useState("");
  const say = (t: string) => {
    setMsg(t);
    window.setTimeout(() => setMsg(""), 2200);
  };

  const copy = () => {
    if (value === null) return say("Enter an expression first.");
    if (!focused) return say("Click into a figure field (F1–F5), then copy.");
    setFillin(focused, String(Math.round(value * 1e6) / 1e6));
    say(`Copied to ${focused}.`);
  };

  return (
    <div className="card space-y-2 p-3" aria-label="Calculator">
      <p className="smallcaps">Calculator</p>
      <label htmlFor="calc-expr" className="sr-only">
        Expression
      </label>
      <input
        id="calc-expr"
        className="field tnum text-right font-semibold"
        value={expr}
        inputMode="decimal"
        autoComplete="off"
        onChange={(e) => setExpr(e.target.value)}
        placeholder="e.g. 3 × 44000 + (3 × 8) × 85"
        aria-describedby="calc-help"
      />
      <p id="calc-help" className="text-micro normal-case tracking-normal text-ash">
        Type or tap. Units are yours to keep straight: hours × rate, per year × years.
      </p>
      <div className="flex items-baseline justify-between gap-2 rounded-md bg-mist px-3 py-1.5" aria-live="polite">
        <span className="text-micro text-ash">= </span>
        <span className="tnum text-h3">{shown}</span>
      </div>
      {res && !res.ok && <p className="text-micro text-ash">Cannot read that expression yet.</p>}
      <div className="grid grid-cols-4 gap-1.5">
        {KEYS.map((k) => (
          <button
            key={k}
            type="button"
            onClick={() => setExpr((e) => e + k)}
            className="btn-ghost btn-sm min-h-[40px] justify-center px-0"
            aria-label={k === "÷" ? "divide" : k === "×" ? "multiply" : k === "−" ? "minus" : k}
          >
            {k}
          </button>
        ))}
        <button type="button" onClick={() => setExpr((e) => e.slice(0, -1))} className="btn-ghost btn-sm min-h-[40px] px-0" aria-label="backspace">
          ⌫
        </button>
        <button type="button" onClick={() => setExpr("")} className="btn-ghost btn-sm min-h-[40px] px-0">
          C
        </button>
      </div>
      <button type="button" onClick={copy} className="btn-primary btn-sm w-full">
        {focused ? `Copy result to ${focused}` : "Focus a figure field, then copy"}
      </button>
      <p aria-live="polite" className="min-h-[1rem] text-micro text-ash">
        {msg}
      </p>
    </div>
  );
}
