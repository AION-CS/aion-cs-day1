"use client";

import { useEffect, useRef, useState } from "react";
import clsx from "clsx";
import { useProgress } from "@/lib/store";
import { MaterialRefs } from "@/components/ui/MaterialRefs";
import { AnswerKey } from "@/components/ui/AnswerKey";
import { Check, ChevronDown, Icon } from "@/components/icons/LineIcons";
import {
  APPROACH_FIELD,
  BOTH_FIELD,
  HORIZONS,
  HORIZON_FIELD,
  PART_ONE,
  R1,
  READINGS,
  READING_FIELD,
  ROOT_CAUSES,
  ROOT_CAUSE_FIELD,
  ZONES,
  ZONE_FAMILIES,
  ZONE_FIELD,
  materialRefs,
  zoneById,
} from "@/lib/route1";
import type { useBoardActions } from "./actions";
import { useBoardFx } from "./history";
import { domId, type SignalState } from "./useRoute1";

export type ReferenceId = "levers" | "lifecycle";

/**
 * One signal, diagnosed in four steps (§8.4). Step A: read it, with the Lever
 * Map or the Lifecycle Wheel a click away. Step B: potential or risk, and the
 * primary area affected — answering both routes the card; nothing is dragged.
 * Step C: the routing itself. Step D: in place, the improvement approach, the
 * root cause and the time horizon.
 *
 * "Move signal" reopens Step B with the previous answers preloaded. The card
 * stays editable at every stage, and every value survives closing it.
 */
export function SignalCard({
  state,
  open,
  onToggle,
  dimmed,
  onReference,
  board,
}: {
  state: SignalState;
  open: boolean;
  onToggle: () => void;
  dimmed: boolean;
  onReference: (id: ReferenceId) => void;
  board: ReturnType<typeof useBoardActions>;
}) {
  const { signal } = state;
  const setNote = useProgress((s) => s.setNote);
  const fx = useBoardFx((s) => s.last);
  const [moving, setMoving] = useState(false);
  const statusRef = useRef<HTMLDivElement | null>(null);
  const wasRouted = useRef(state.routed);

  const zone = state.zone ? zoneById(state.zone) : null;
  const stepBOpen = !state.routed || moving;
  const readingLabel = READINGS.find((r) => r.id === state.reading)?.label;
  const landedNow = !!fx && fx.signalId === signal.id && state.routed;

  // When the card routes itself the questions fold away; move focus to the result.
  useEffect(() => {
    if (state.routed && !wasRouted.current && open) statusRef.current?.focus();
    wasRouted.current = state.routed;
  }, [state.routed, open]);

  const status = state.complete ? "complete" : state.routed && zone ? zone.name : PART_ONE.intake.toLowerCase();

  return (
    <li
      id={domId.signal(signal.id)}
      className={clsx(
        "scroll-mt-24 rounded-2xl border bg-paper transition-[opacity,border-color] duration-200",
        open ? "border-accent/50 shadow-sm" : "border-line",
        dimmed && "opacity-50",
      )}
    >
      <button type="button" onClick={onToggle} aria-expanded={open} className="flex w-full items-start gap-3 p-4 text-left">
        <span
          className={clsx(
            "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-caption font-bold tabular-nums",
            state.complete ? "bg-accent text-paper" : state.routed ? "bg-accentSoft text-accent" : "bg-mist text-ash",
          )}
        >
          {state.complete ? <Check className="h-4 w-4" /> : signal.n}
        </span>
        <span className="min-w-0 flex-1">
          <span className="flex flex-wrap items-center gap-x-2 gap-y-1">
            <span className="text-caption font-semibold text-ink">
              Signal {signal.n} · {signal.title}
            </span>
            <span
              className={clsx(
                "rounded-full px-2 py-0.5 text-micro font-semibold uppercase tracking-wide",
                state.complete
                  ? "bg-accentSoft text-accent"
                  : state.routed
                    ? "bg-warn/10 text-warn"
                    : "border border-dashed border-line text-ash",
              )}
            >
              {state.routed && !state.complete ? `in ${status}` : status}
            </span>
          </span>
          {!open && <span className="mt-1.5 block text-caption text-ash">{signal.text}</span>}
        </span>
        <ChevronDown className={clsx("mt-1 h-4 w-4 shrink-0 text-ash transition-transform duration-150", open && "rotate-180")} />
      </button>

      {open && (
        <div className="reveal-in space-y-6 border-t border-line p-4">
          {/* Step A — read */}
          <div>
            <StepLabel>{PART_ONE.stepA}</StepLabel>
            <blockquote className="mt-2 rounded-xl border-l-4 border-l-ash/40 bg-canvas px-4 py-3 text-body italic text-ink">
              &ldquo;{signal.text}&rdquo;
            </blockquote>
            <div className="mt-2 flex flex-wrap gap-2">
              {(
                [
                  ["levers", PART_ONE.referenceLevers],
                  ["lifecycle", PART_ONE.referenceWheel],
                ] as const
              ).map(([id, label]) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => onReference(id)}
                  className="rounded-lg border border-line bg-paper px-3 py-1.5 text-caption font-semibold text-ink transition-colors duration-150 hover:border-accent hover:text-accent"
                >
                  {label}
                </button>
              ))}
            </div>
            <MaterialRefs refs={materialRefs(signal.material)} />
          </div>

          {/* Step B — the two diagnostic questions */}
          <div id={domId.stepB(signal.id)} className="scroll-mt-24 space-y-4">
            <StepLabel>{PART_ONE.stepB}</StepLabel>

            {!stepBOpen && zone ? (
              <div className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-line bg-canvas px-3 py-2">
                <p className="text-caption text-ink">
                  Read as <span className="font-semibold">{readingLabel}</span> · routed to{" "}
                  <span className="font-semibold">{zone.name}</span>
                </p>
                <button
                  type="button"
                  onClick={() => setMoving(true)}
                  className="rounded-lg border border-line bg-paper px-3 py-1.5 text-caption font-semibold text-ink hover:border-accent hover:text-accent"
                >
                  {PART_ONE.moveLabel}
                </button>
              </div>
            ) : (
              <>
                <div id={domId.reading(signal.id)} className="scroll-mt-24">
                  <p className="text-caption font-semibold text-ink">{READING_FIELD.label}</p>
                  <p className="mt-0.5 text-micro text-ash">{READING_FIELD.instruction}</p>
                  <div className="mt-2 grid gap-2 sm:grid-cols-3">
                    {READINGS.map((r) => {
                      const on = state.reading === r.id;
                      return (
                        <button
                          key={r.id}
                          type="button"
                          onClick={() => board.setReading(signal.id, r.id)}
                          aria-pressed={on}
                          className={clsx(
                            "rounded-xl border p-2.5 text-left transition-colors duration-150",
                            on ? "border-accent bg-accentSoft" : "border-line bg-canvas hover:border-ash",
                          )}
                        >
                          <span className={clsx("block text-caption font-semibold", on ? "text-accent" : "text-ink")}>{r.label}</span>
                          <span className="mt-0.5 block text-micro text-ash">{r.hint}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div id={domId.zone(signal.id)} className="scroll-mt-24">
                  <p className="text-caption font-semibold text-ink">{ZONE_FIELD.label}</p>
                  <p className="mt-0.5 text-micro text-ash">{ZONE_FIELD.instruction}</p>
                  <div className="mt-2 grid gap-2 sm:grid-cols-2">
                    {ZONES.map((z) => {
                      const on = state.zone === z.id;
                      return (
                        <button
                          key={z.id}
                          type="button"
                          onClick={() => {
                            if (board.setZone(signal.id, z.id)) setMoving(false);
                          }}
                          aria-pressed={on}
                          title={ZONE_FAMILIES[z.family].label}
                          className={clsx(
                            "flex items-start gap-2 rounded-xl border p-2.5 text-left transition-colors duration-150",
                            z.family === "crosscutting" && "border-dashed",
                            on ? "border-accent bg-accentSoft" : "border-line bg-canvas hover:border-ash",
                          )}
                        >
                          <Icon name={z.icon} className={clsx("mt-0.5 h-4 w-4 shrink-0", on ? "text-accent" : "text-ash")} />
                          <span>
                            <span className={clsx("block text-caption font-semibold", on ? "text-accent" : "text-ink")}>{z.name}</span>
                            <span className="mt-0.5 block text-micro text-ash">{z.note}</span>
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {moving && (
                  <button type="button" onClick={() => setMoving(false)} className="text-micro font-semibold text-accent underline underline-offset-2">
                    Keep it where it is
                  </button>
                )}
              </>
            )}

            {state.reading === "both" && (
              <div id={domId.bothWhy(signal.id)} className="scroll-mt-24">
                <label htmlFor={`bothwhy-${signal.id}`} className="block text-caption font-semibold text-ink">
                  {BOTH_FIELD.label}
                </label>
                <p className="mt-0.5 text-micro text-ash">{BOTH_FIELD.instruction}</p>
                <input
                  id={`bothwhy-${signal.id}`}
                  type="text"
                  value={state.bothWhy}
                  onChange={(e) => setNote(R1.bothWhy(signal.id), e.target.value)}
                  placeholder={BOTH_FIELD.placeholder}
                  className="mt-2 w-full rounded-xl border border-line bg-paper px-3 py-2.5 text-caption text-ink"
                />
              </div>
            )}
          </div>

          {/* Step C — routing */}
          <div>
            <StepLabel>{PART_ONE.stepC}</StepLabel>
            {state.routed && zone ? (
              <div ref={statusRef} tabIndex={-1} className="mt-2 space-y-2 rounded-xl border border-accent/35 bg-accentSoft p-3 outline-none">
                <MiniRoute n={signal.n} zoneName={zone.name} nonce={landedNow && fx ? fx.nonce : 0} />
                <p className="text-caption text-ink" aria-live="polite">
                  Signal {signal.n} landed in <span className="font-semibold">{zone.name}</span>{" "}
                  <span className="text-ash">· {ZONE_FAMILIES[zone.family].label.toLowerCase()}</span>
                </p>
              </div>
            ) : (
              <p className="mt-1 text-caption text-ash">{PART_ONE.waitingToRoute}</p>
            )}
          </div>

          {/* Step D — complete in place */}
          {state.routed ? (
            <div className="space-y-5">
              <StepLabel>{PART_ONE.stepD}</StepLabel>
              <div id={domId.approach(signal.id)} className="scroll-mt-24">
                <label htmlFor={`approach-${signal.id}`} className="block text-caption font-semibold text-ink">
                  {APPROACH_FIELD.label}
                </label>
                <p className="mt-0.5 text-micro text-ash">{APPROACH_FIELD.instruction}</p>
                <textarea
                  id={`approach-${signal.id}`}
                  rows={2}
                  value={state.approach}
                  onChange={(e) => setNote(R1.approach(signal.id), e.target.value)}
                  placeholder={APPROACH_FIELD.placeholder}
                  className="mt-2 w-full rounded-xl border border-line bg-paper px-3 py-2.5 text-caption text-ink"
                />
                <p
                  className={clsx(
                    "mt-1 text-micro tabular-nums",
                    state.approachLength >= APPROACH_FIELD.min ? "text-accent" : "text-ash",
                  )}
                >
                  {state.approachLength} / {APPROACH_FIELD.min} characters minimum
                  {state.approachLength >= APPROACH_FIELD.min ? " — enough to state an action" : ""}
                </p>
              </div>
              <Segmented
                anchorId={domId.rootCause(signal.id)}
                label={ROOT_CAUSE_FIELD.label}
                instruction={ROOT_CAUSE_FIELD.instruction}
                options={ROOT_CAUSES}
                value={state.rootCause}
                onPick={(v) => board.setRootCause(signal.id, v)}
              />
              <Segmented
                anchorId={domId.horizon(signal.id)}
                label={HORIZON_FIELD.label}
                instruction={HORIZON_FIELD.instruction}
                options={HORIZONS}
                value={state.horizon}
                onPick={(v) => board.setHorizon(signal.id, v)}
              />
            </div>
          ) : (
            <div id={domId.stepD(signal.id)} className="scroll-mt-24 rounded-xl border border-dashed border-line bg-canvas p-3">
              <StepLabel>{PART_ONE.stepD}</StepLabel>
              <p className="mt-1 text-caption text-ash">{PART_ONE.stepDPlaceholder}</p>
            </div>
          )}

          <AnswerKey block={signal.answerKey} />

          <div className="flex justify-end">
            <button
              type="button"
              onClick={onToggle}
              className="rounded-xl border border-line bg-paper px-4 py-2 text-caption font-semibold text-ink hover:border-ash"
            >
              {state.complete ? "Close — it stays editable" : "Close for now"}
            </button>
          </div>
        </div>
      )}
    </li>
  );
}

function StepLabel({ children }: { children: React.ReactNode }) {
  return <p className="text-micro font-semibold uppercase tracking-wide text-ash">{children}</p>;
}

function Segmented<T extends string>({
  anchorId,
  label,
  instruction,
  options,
  value,
  onPick,
}: {
  anchorId: string;
  label: string;
  instruction: string;
  options: { id: T; label: string; hint: string }[];
  value: T | null;
  onPick: (id: T) => void;
}) {
  return (
    <div id={anchorId} className="scroll-mt-24">
      <p className="text-caption font-semibold text-ink">{label}</p>
      <p className="mt-0.5 text-micro text-ash">{instruction}</p>
      <div className="mt-2 grid gap-2 sm:grid-cols-2" role="group" aria-label={label}>
        {options.map((o) => {
          const on = value === o.id;
          return (
            <button
              key={o.id}
              type="button"
              onClick={() => onPick(o.id)}
              aria-pressed={on}
              className={clsx(
                "rounded-xl border p-2.5 text-left transition-colors duration-150",
                on ? "border-accent bg-accentSoft" : "border-line bg-canvas hover:border-ash",
              )}
            >
              <span className={clsx("block text-caption font-semibold", on ? "text-accent" : "text-ink")}>{o.label}</span>
              <span className="mt-0.5 block text-micro text-ash">{o.hint}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

/**
 * The routing moment inside the card, for screens where the board sits in the
 * collapsed strip: the same self-drawing connector, from intake to the zone.
 */
function MiniRoute({ n, zoneName, nonce }: { n: number; zoneName: string; nonce: number }) {
  return (
    <div className="relative lg:hidden" aria-hidden="true">
      <svg viewBox="0 0 320 40" preserveAspectRatio="xMidYMid meet" className="h-auto w-full">
        <circle cx={20} cy={20} r={13} className="fill-paper stroke-ash" strokeWidth={1.5} strokeDasharray="3 3" />
        <path key={`p-${nonce}`} d="M34 20 C120 20 180 20 250 20" className={clsx("fill-none stroke-accent", nonce > 0 && "anim-connector")} strokeWidth={3} strokeLinecap="round" />
        <rect key={`z-${nonce}`} x={252} y={6} width={62} height={28} rx={14} className={clsx("fill-accent", nonce > 0 && "anim-land")} />
      </svg>
      <span className="absolute left-[6.25%] top-1/2 -translate-x-1/2 -translate-y-1/2 text-micro font-bold text-ash">{n}</span>
      <span className="absolute left-[88%] top-1/2 max-w-[5rem] -translate-x-1/2 -translate-y-1/2 truncate text-micro font-semibold text-paper">
        {zoneName.split(" ")[0]}
      </span>
    </div>
  );
}
