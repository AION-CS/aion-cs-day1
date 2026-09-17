"use client";

import { useState } from "react";
import clsx from "clsx";

/**
 * Shared click-through narratives — every material example lived out step by
 * step, not summarised in a sentence. Used by both S1's lever demos
 * (LeverDemos.tsx) and S4's area examples below. Three shapes:
 *
 *  - ChainStory: click through N real steps (people, systems, copies) one at
 *    a time, watching a cost accumulate, then either collapse the whole
 *    chain into one resolved step (the "old way vs. digital way" cases) or
 *    land on a punchline stat (the cases where the accumulation itself is
 *    the finding — nothing resolves it).
 *  - TimelineStory: step through a year month by month, watching a bar grow
 *    and a check that never gets ticked.
 *  - JourneyCompare: pick "old way" or "new way", click through each one's
 *    real steps, compare the totals.
 *
 * All three reset with a "Replay" control so the story can be watched again.
 */

/** Only ever rendered once it should be visible — mounting fresh is what re-triggers .reveal-in each time. */
function Badge({ label, tone }: { label: string; tone: "pending" | "done" | "accent" }) {
  return (
    <span
      className={clsx(
        "reveal-in rounded-lg border px-2.5 py-1.5 text-micro font-semibold",
        tone === "pending" && "border-line bg-mist text-ash",
        tone === "done" && "border-line bg-paper text-ink",
        tone === "accent" && "border-accent bg-accent text-paper",
      )}
    >
      {label}
    </span>
  );
}

// ---------------------------------------------------------------------------
// ChainStory
// ---------------------------------------------------------------------------

export type ChainStep = { label: string; cost: number };

export function ChainStory({
  costUnit,
  costUnitPlural,
  steps,
  ending,
  onComplete,
}: {
  costUnit: string;
  costUnitPlural: string;
  steps: ChainStep[];
  /** "collapse" = old-way vs. digital-way; "punchline" = the pile-up itself is the finding. */
  ending:
    | { kind: "collapse"; buttonLabel: string; resolvedLabel: string; resolvedDetail: string }
    | { kind: "punchline"; text: string };
  /** Fires once, the moment the story reaches its resolved/punchline state — never on Replay. */
  onComplete?: () => void;
}) {
  const [n, setN] = useState(0);
  const [collapsed, setCollapsed] = useState(false);
  const allRevealed = n >= steps.length;
  const totalCost = steps.slice(0, n).reduce((sum, s) => sum + s.cost, 0);

  const advance = () => {
    const next = n + 1;
    setN(next);
    if (next >= steps.length && ending.kind === "punchline") onComplete?.();
  };

  const goDigital = () => {
    setCollapsed(true);
    onComplete?.();
  };

  const reset = () => {
    setN(0);
    setCollapsed(false);
  };

  return (
    <div className="space-y-2.5">
      <div className="flex flex-wrap gap-1.5">
        {!collapsed &&
          steps.map((s, i) => i < n && <Badge key={s.label} label={s.label} tone="pending" />)}
        {collapsed && ending.kind === "collapse" && <Badge label={ending.resolvedLabel} tone="accent" />}
      </div>

      {!collapsed && n > 0 && (
        <p className="reveal-in text-micro text-ash">
          Running total: <span className="font-semibold text-warn">{totalCost} {totalCost === 1 ? costUnit : costUnitPlural}</span>
        </p>
      )}

      {collapsed && ending.kind === "collapse" && (
        <p className="reveal-in text-micro text-ash">{ending.resolvedDetail}</p>
      )}

      {!collapsed && allRevealed && ending.kind === "punchline" && (
        <p className="reveal-in rounded-lg border border-warn/30 bg-warn/5 px-2.5 py-1.5 text-micro text-ink">{ending.text}</p>
      )}

      <div className="flex flex-wrap items-center gap-2">
        {!collapsed && !allRevealed && (
          <button type="button" onClick={advance} className="btn-ghost">
            Next: {steps[n].label}
          </button>
        )}
        {!collapsed && allRevealed && ending.kind === "collapse" && (
          <button type="button" onClick={goDigital} className="btn-accent">
            {ending.buttonLabel}
          </button>
        )}
        {n > 0 && (
          <button type="button" onClick={reset} className="text-micro font-semibold text-accent underline decoration-dotted underline-offset-2 hover:text-accentHi">
            Replay
          </button>
        )}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// TimelineStory — step through a year, watch a bar grow and a check that
// never lands
// ---------------------------------------------------------------------------

export function TimelineStory({
  months,
  barLabel,
  barValues,
  highlightMonth,
  checkLabel,
  checkedMonths,
  finalNote,
}: {
  months: string[];
  barLabel: string;
  barValues: number[];
  /** Month index whose bar is the anomaly worth calling out (e.g. the one December that matches capacity). */
  highlightMonth?: number;
  checkLabel: string;
  /** Months where the check would have fired, if anyone had looked. Empty means never. */
  checkedMonths: number[];
  finalNote: string;
}) {
  const [n, setN] = useState(0);
  const max = Math.max(...barValues);
  const done = n >= months.length;

  return (
    <div className="space-y-2.5">
      <div className="flex items-end gap-1">
        {months.map((m, i) => {
          const shown = i < n;
          const val = shown ? barValues[i] : 0;
          const anomaly = i === highlightMonth;
          return (
            <div key={m} className="flex flex-1 flex-col items-center gap-1">
              <div className="flex h-16 w-full items-end overflow-hidden rounded bg-mist">
                <div
                  className={clsx("w-full rounded transition-all duration-500", anomaly && shown ? "bg-warn" : "bg-accent/60")}
                  style={{ height: `${(val / max) * 100}%` }}
                />
              </div>
              <span className="text-[9px] text-ash">{m}</span>
              <span className={clsx("h-3 w-3 rounded-full border text-[8px] leading-3", shown && checkedMonths.includes(i) ? "border-accent bg-accent text-paper" : "border-line")}>
                {shown && checkedMonths.includes(i) ? "✓" : ""}
              </span>
            </div>
          );
        })}
      </div>
      <p className="text-micro text-ash">
        {barLabel} · {checkLabel}
      </p>

      {done && <p className="reveal-in rounded-lg border border-warn/30 bg-warn/5 px-2.5 py-1.5 text-micro text-ink">{finalNote}</p>}

      <div className="flex flex-wrap items-center gap-2">
        {!done && (
          <button type="button" onClick={() => setN((v) => v + 1)} className="btn-ghost">
            Next: {months[n]}
          </button>
        )}
        {n > 0 && (
          <button type="button" onClick={() => setN(0)} className="text-micro font-semibold text-accent underline decoration-dotted underline-offset-2 hover:text-accentHi">
            Replay
          </button>
        )}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// JourneyCompare — old way vs. new way, both watched, then timed against
// each other
// ---------------------------------------------------------------------------

export function JourneyCompare({
  oldTitle,
  oldSteps,
  oldTotal,
  newTitle,
  newSteps,
  newTotal,
}: {
  oldTitle: string;
  oldSteps: string[];
  oldTotal: string;
  newTitle: string;
  newSteps: string[];
  newTotal: string;
}) {
  const [which, setWhich] = useState<"old" | "new" | null>(null);
  const [n, setN] = useState(0);
  const steps = which === "old" ? oldSteps : which === "new" ? newSteps : [];
  const done = which !== null && n >= steps.length;

  const start = (w: "old" | "new") => {
    setWhich(w);
    setN(0);
  };

  return (
    <div className="space-y-2.5">
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => start("old")}
          aria-pressed={which === "old"}
          className={clsx("flex-1 rounded-lg border px-3 py-1.5 text-micro font-semibold transition-colors duration-150", which === "old" ? "border-ink bg-ink text-paper" : "border-line bg-paper text-ash hover:border-ink")}
        >
          {oldTitle}
        </button>
        <button
          type="button"
          onClick={() => start("new")}
          aria-pressed={which === "new"}
          className={clsx("flex-1 rounded-lg border px-3 py-1.5 text-micro font-semibold transition-colors duration-150", which === "new" ? "border-accent bg-accent text-paper" : "border-line bg-paper text-ash hover:border-accent")}
        >
          {newTitle}
        </button>
      </div>

      {which && (
        <div className="reveal-in space-y-2 rounded-lg border border-line bg-canvas p-2.5">
          <div className="flex flex-wrap gap-1.5">
            {steps.map((s, i) => i < n && <Badge key={s} label={s} tone={which === "old" ? "pending" : "done"} />)}
          </div>
          {!done ? (
            <button type="button" onClick={() => setN((v) => v + 1)} className="btn-ghost">
              Next step
            </button>
          ) : (
            <p className={clsx("reveal-in text-caption font-semibold", which === "old" ? "text-warn" : "text-accent")}>
              Total: {which === "old" ? oldTotal : newTotal}
            </p>
          )}
        </div>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// The six area stories
// ---------------------------------------------------------------------------

export function ProcessEfficiencyStory() {
  return (
    <ChainStory
      costUnit="day"
      costUnitPlural="days"
      steps={[
        { label: "Department Head reviews", cost: 1 },
        { label: "Line Manager signs off", cost: 1 },
        { label: "Finance checks budget", cost: 2 },
        { label: "CTO gives final approval", cost: 1 },
      ]}
      ending={{ kind: "collapse", buttonLabel: "Go digital", resolvedLabel: "Submitted → Approved", resolvedDetail: "0 days — the same four people approve inside one workflow, automatically routed." }}
    />
  );
}

export function DataUseStory() {
  return (
    <ChainStory
      costUnit="copy"
      costUnitPlural="copies"
      steps={[
        { label: "Sales copies the customer list", cost: 1 },
        { label: "Marketing copies it too", cost: 1 },
        { label: "Support copies it too", cost: 1 },
        { label: "Finance copies it too", cost: 1 },
        { label: "Product copies it too", cost: 1 },
      ]}
      ending={{ kind: "punchline", text: "5 copies. 1 real customer record. Every update to one now has to be repeated in four other places by hand — or it silently goes stale." }}
    />
  );
}

export function InfrastructureStory() {
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const values = [18, 16, 20, 19, 17, 21, 20, 18, 19, 22, 24, 100];
  return (
    <TimelineStory
      months={months}
      barLabel="Capacity used, provisioned for December's peak"
      barValues={values}
      highlightMonth={11}
      checkLabel="reviewed?"
      checkedMonths={[]}
      finalNote="Provisioned once for December. Running at a fifth of that capacity every other month — and nobody's revisited the sizing since."
    />
  );
}

export function BehaviourStory() {
  return (
    <JourneyCompare
      oldTitle="Old way: drive out"
      oldSteps={["Walk to the car", "Drive to the site (18 min)", "Read the gauge", "Drive back (18 min)", "Log the reading"]}
      oldTotal="≈45 minutes, one reading"
      newTitle="New way: check the dashboard"
      newSteps={["Open the dashboard", "Read the live value"]}
      newTotal="≈10 seconds, any time"
    />
  );
}

export function ComplexityStory() {
  return (
    <ChainStory
      costUnit="system checked"
      costUnitPlural="systems checked"
      steps={[
        { label: "Check the ERP — no clear answer", cost: 1 },
        { label: "Check the monitoring dashboard — partial answer", cost: 1 },
        { label: "Check the spreadsheet — conflicting number", cost: 1 },
        { label: "Ask the chat channel — someone might know", cost: 1 },
      ]}
      ending={{ kind: "punchline", text: "4 systems checked for 1 question — and the answer still isn't fully certain. This is the cost complexity adds, invisible until someone actually needs an answer." }}
    />
  );
}

export function ManagementStory() {
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const values = months.map((_, i) => (i + 1) * 8);
  return (
    <TimelineStory
      months={months}
      barLabel="Data collected, month by month"
      barValues={values}
      checkLabel="on a meeting agenda?"
      checkedMonths={[]}
      finalNote="12 months of data. 0 reviews. 0 decisions traced back to it — the mechanism that turns a metric into a decision was never built."
    />
  );
}
