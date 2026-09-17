"use client";

import { useState } from "react";
import clsx from "clsx";

/**
 * One tiny, self-contained "click to see the change" demo per S1 lever —
 * the material's own example acted out, not just described. Each demo is a
 * two-state toggle: the "before" state a paper-based or fixed-rule way of
 * working, the "after" state what the lever actually changes, so the
 * mechanism is watched happening rather than read as a sentence.
 */

function ToggleButton({ on, onClick, offLabel, onLabel }: { on: boolean; onClick: () => void; offLabel: string; onLabel: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={on}
      className={clsx(
        "rounded-lg border px-3 py-1.5 text-micro font-semibold transition-colors duration-150",
        on ? "border-accent bg-accent text-paper" : "border-line bg-paper text-ink hover:border-accent",
      )}
    >
      {on ? onLabel : offLabel}
    </button>
  );
}

// ---------------------------------------------------------------------------
// Transparency — the energy dashboard
// ---------------------------------------------------------------------------

const WINGS = [
  { id: "a", label: "Wing A", night: 12 },
  { id: "b", label: "Wing B", night: 78 },
  { id: "c", label: "Wing C", night: 9 },
  { id: "d", label: "Wing D", night: 15 },
];

export function EnergyDashboardDemo() {
  const [live, setLive] = useState(false);
  const max = Math.max(...WINGS.map((w) => w.night));

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <p className="text-micro font-semibold text-ink">{live ? "Live dashboard — overnight draw, right now" : "Paper log — filed once a week"}</p>
        <ToggleButton on={live} onClick={() => setLive((v) => !v)} offLabel="Switch to live dashboard" onLabel="Back to paper log" />
      </div>

      {!live ? (
        <div className="reveal-in rounded-lg border border-dashed border-line bg-paper p-3">
          <p className="text-caption text-ash">Total overnight energy, week of Sep 8:</p>
          <p className="text-h3 text-ink">4,820 kWh</p>
          <p className="mt-1 text-micro text-ash">One number. No way to tell which part of the building it came from.</p>
        </div>
      ) : (
        <div className="reveal-in space-y-1.5">
          {WINGS.map((w) => {
            const spike = w.night === max;
            return (
              <div key={w.id} className="flex items-center gap-2">
                <span className="w-14 shrink-0 text-micro text-ash">{w.label}</span>
                <div className="h-5 flex-1 overflow-hidden rounded bg-mist">
                  <div
                    className={clsx("h-full rounded transition-all duration-700", spike ? "bg-warn" : "bg-accent/60")}
                    style={{ width: `${(w.night / max) * 100}%` }}
                  />
                </div>
                <span className={clsx("w-10 shrink-0 text-right text-micro tabular-nums", spike ? "font-semibold text-warn" : "text-ash")}>
                  {w.night}kW
                </span>
                {spike && <span className="shrink-0 rounded-full bg-warn/15 px-1.5 py-0.5 text-micro font-semibold text-warn">overnight spike</span>}
              </div>
            );
          })}
          <p className="pt-1 text-micro text-ash">Wing B is drawing power all night — the paper log never broke the total down far enough to show this.</p>
        </div>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Efficiency — route matching
// ---------------------------------------------------------------------------

function TruckIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 20" className={className} fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round">
      <rect x="1" y="4" width="18" height="10" rx="1.5" />
      <path d="M19 8h6l4 4v2h-10z" />
      <circle cx="7" cy="16" r="2.4" />
      <circle cx="23" cy="16" r="2.4" />
    </svg>
  );
}

export function RouteOptimisationDemo() {
  const [optimised, setOptimised] = useState(false);
  const trucks = optimised ? 2 : 4;
  const fill = optimised ? 88 : 42;

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <p className="text-micro font-semibold text-ink">{trucks} trucks, avg. {fill}% full</p>
        <ToggleButton on={optimised} onClick={() => setOptimised((v) => !v)} offLabel="Match loads automatically" onLabel="Back to manual planning" />
      </div>
      <div className="flex flex-wrap items-end gap-3 rounded-lg border border-line bg-paper p-3">
        {Array.from({ length: trucks }).map((_, i) => (
          <div key={i} className="reveal-in flex flex-col items-center gap-1">
            <TruckIcon className={clsx("h-8 w-12", optimised ? "text-accent" : "text-ash")} />
            <span className="text-micro text-ash">{optimised ? "matched load" : "half-empty"}</span>
          </div>
        ))}
      </div>
      <p className="text-micro text-ash">
        {optimised
          ? "Same deliveries, planned by matching loads across routes instead of one truck per request."
          : "Each route planned by hand, one request at a time — trucks leave part-empty because nobody compares routes."}
      </p>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Monitoring & Management — occupancy-based HVAC
// ---------------------------------------------------------------------------

const ROOMS = [true, false, false, true, false, false];

export function OccupancyHvacDemo() {
  const [smart, setSmart] = useState(false);

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <p className="text-micro font-semibold text-ink">{smart ? "Occupancy sensors on" : "Fixed all-day schedule"}</p>
        <ToggleButton on={smart} onClick={() => setSmart((v) => !v)} offLabel="Enable occupancy sensors" onLabel="Back to fixed schedule" />
      </div>
      <div className="grid grid-cols-6 gap-1.5 rounded-lg border border-line bg-paper p-3">
        {ROOMS.map((occupied, i) => {
          const heating = smart ? occupied : true;
          return (
            <div key={i} className="flex flex-col items-center gap-1">
              <div
                className={clsx(
                  "flex h-10 w-full items-center justify-center rounded transition-colors duration-500 text-micro font-semibold",
                  heating ? "bg-accent text-paper" : "bg-mist text-ash",
                )}
              >
                {heating ? "ON" : "OFF"}
              </div>
              <span className="text-micro text-ash">{occupied ? "occupied" : "empty"}</span>
            </div>
          );
        })}
      </div>
      <p className="text-micro text-ash">
        {smart ? "Heating only runs where someone actually is." : "Every room heats all day, occupied or not — the schedule can't tell the difference."}
      </p>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Automation — invoice matching
// ---------------------------------------------------------------------------

export function InvoiceAutomationDemo() {
  const [automated, setAutomated] = useState(false);

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <p className="text-micro font-semibold text-ink">Matching a supplier invoice</p>
        <ToggleButton on={automated} onClick={() => setAutomated((v) => !v)} offLabel="Automate the match" onLabel="Back to manual" />
      </div>
      <div className="flex items-center gap-4 rounded-lg border border-line bg-paper p-3">
        <div className="flex -space-x-2">
          {(automated ? [0] : [0, 1, 2]).map((i) => (
            <div
              key={i}
              className={clsx(
                "reveal-in flex h-10 w-8 items-center justify-center rounded border text-micro font-semibold",
                automated ? "border-accent bg-accentSoft text-accent" : "border-line bg-mist text-ash",
              )}
              style={{ transform: automated ? undefined : `rotate(${(i - 1) * 6}deg)` }}
            >
              {automated ? "✓" : "≡"}
            </div>
          ))}
        </div>
        <div>
          <p className="text-caption font-semibold text-ink">{automated ? "Matched instantly" : "Printed, re-entered, cross-checked by hand"}</p>
          <p className="text-micro text-ash">{automated ? "0 minutes — the step no longer exists." : "Takes about 2 business days per invoice."}</p>
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Data-based optimisation — predictive maintenance
// ---------------------------------------------------------------------------

export function PredictiveMaintenanceDemo() {
  const [dataBased, setDataBased] = useState(false);
  const wear = 62;

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <p className="text-micro font-semibold text-ink">{dataBased ? "Scheduled by actual wear" : "Scheduled by fixed calendar"}</p>
        <ToggleButton on={dataBased} onClick={() => setDataBased((v) => !v)} offLabel="Switch to wear data" onLabel="Back to fixed calendar" />
      </div>
      <div className="rounded-lg border border-line bg-paper p-3">
        {!dataBased ? (
          <div className="reveal-in flex items-center justify-between text-micro">
            {["Day 0", "Day 90", "Day 180", "Day 270"].map((d, i) => (
              <div key={d} className="flex flex-col items-center gap-1">
                <div className={clsx("h-6 w-6 rounded-full", i === 1 ? "bg-warn/60" : "bg-accent/60")} />
                <span className="text-ash">{d}</span>
              </div>
            ))}
          </div>
        ) : (
          <div className="reveal-in space-y-1">
            <div className="h-3 w-full overflow-hidden rounded-full bg-mist">
              <div className="h-full rounded-full bg-accent transition-all duration-700" style={{ width: `${wear}%` }} />
            </div>
            <p className="text-micro text-ash">Current wear: {wear}% — replace at 80%, not on a fixed date.</p>
          </div>
        )}
        <p className="mt-1.5 text-micro text-ash">
          {dataBased
            ? "The part at Day 90 above was still fine — data-based scheduling would have left it running."
            : "Every part gets replaced on the same 90-day cycle, whether it's worn out or nearly new."}
        </p>
      </div>
    </div>
  );
}
