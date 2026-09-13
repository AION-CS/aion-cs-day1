"use client";

import { useEffect, useState } from "react";
import clsx from "clsx";
import { useProgress } from "@/lib/store";
import { MaterialRefs } from "@/components/ui/MaterialRefs";
import { AnswerKey } from "@/components/ui/AnswerKey";
import { Check, ChevronDown, Help } from "@/components/icons/LineIcons";
import { Icon } from "@/components/icons/LineIcons";
import {
  APPROACH_FIELD,
  AREAS,
  AREA_FIELD,
  HORIZONS,
  HORIZON_FIELD,
  PART_ONE,
  R1,
  ROOT_CAUSES,
  ROOT_CAUSE_FIELD,
  materialRefs,
  type AreaId,
} from "@/lib/route1";
import { useRoute1, domId, type Finding } from "./useRoute1";

/**
 * One signal, worked in four steps: assign the area, tag the root cause, tag
 * the horizon, write the first step.
 *
 * Only the area is checkable, and the check is on demand and never names the
 * answer (CLAUDE.md #4): it says the area does not hold up, and puts a
 * directional clue behind one further click. The card stays editable after it
 * is filed — reopening it preserves every value, because losing typed text to
 * a correction is the fastest way to teach someone not to correct anything.
 */
export function SignalCard({ finding }: { finding: Finding }) {
  const { signal } = finding;
  const r1 = useRoute1();
  const choose = useProgress((s) => s.choose);
  const setNote = useProgress((s) => s.setNote);
  const markSeen = useProgress((s) => s.markSeen);

  const open = r1.openSignalId === signal.id;
  const [verdict, setVerdict] = useState<"right" | "wrong" | null>(null);
  const [clueOpen, setClueOpen] = useState(false);

  // A changed area invalidates the previous verdict — never leave a stale
  // "that holds" sitting under a different answer.
  useEffect(() => {
    setVerdict(null);
    setClueOpen(false);
  }, [finding.area]);

  const toggleOpen = () => choose(R1.openSignal, open ? "" : signal.id);

  const pickArea = (id: AreaId) => {
    choose(R1.area(signal.id), id);
    markSeen(R1.processed, signal.id);
  };

  const runCheck = () => {
    if (!finding.area) return;
    setNote(R1.checks(signal.id), String(finding.checkAttempts + 1));
    setVerdict(finding.area === signal.area ? "right" : "wrong");
  };

  const status = finding.complete ? "filed" : finding.area ? "in progress" : "not started";

  return (
    <li
      id={domId.signal(signal.id)}
      className={clsx(
        "scroll-mt-24 rounded-2xl border bg-paper transition-colors duration-150",
        open ? "border-accent/50 shadow-sm" : "border-line",
      )}
    >
      {/* Header — always visible */}
      <button
        type="button"
        onClick={toggleOpen}
        aria-expanded={open}
        className="flex w-full items-start gap-3 p-4 text-left"
      >
        <span
          className={clsx(
            "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-caption font-bold tabular-nums",
            finding.complete ? "bg-accent text-paper" : "bg-mist text-ash",
          )}
        >
          {finding.complete ? <Check className="h-4 w-4" /> : signal.n}
        </span>
        <span className="min-w-0 flex-1">
          <span className="flex flex-wrap items-center gap-x-2 gap-y-1">
            <span className="text-caption font-semibold text-ink">{signal.title}</span>
            <span
              className={clsx(
                "rounded-full px-2 py-0.5 text-micro font-semibold uppercase tracking-wide",
                status === "filed"
                  ? "bg-accentSoft text-accent"
                  : status === "in progress"
                    ? "bg-warn/10 text-warn"
                    : "border border-line text-ash",
              )}
            >
              {status}
            </span>
          </span>
          <span className="mt-0.5 block text-micro uppercase tracking-wide text-ash">
            {signal.source}
          </span>
          {!open && <span className="mt-1.5 block text-caption text-ash">{signal.text}</span>}
        </span>
        <ChevronDown
          className={clsx(
            "mt-1 h-4 w-4 shrink-0 text-ash transition-transform duration-150",
            open && "rotate-180",
          )}
        />
      </button>

      {/* Working panel */}
      {open && (
        <div className="reveal-in space-y-5 border-t border-line p-4">
          <blockquote className="rounded-xl border-l-4 border-l-ash/40 bg-canvas px-4 py-3 text-body italic text-ink">
            &ldquo;{signal.text}&rdquo;
          </blockquote>

          <MaterialRefs refs={materialRefs(signal.material)} />

          {/* Step 1 — area */}
          <div id={domId.area(signal.id)} className="scroll-mt-24">
            <p className="text-caption font-semibold text-ink">
              <span className="text-ash">Step 1 · </span>
              {AREA_FIELD.label}
            </p>
            <p className="mt-0.5 text-micro text-ash">{AREA_FIELD.instruction}</p>
            <div className="mt-2 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
              {AREAS.map((a) => {
                const on = finding.area === a.id;
                return (
                  <button
                    key={a.id}
                    type="button"
                    onClick={() => pickArea(a.id)}
                    aria-pressed={on}
                    className={clsx(
                      "flex items-start gap-2 rounded-xl border p-2.5 text-left transition-colors duration-150",
                      on
                        ? "border-accent bg-accentSoft"
                        : "border-line bg-canvas hover:border-ash",
                    )}
                  >
                    <Icon
                      name={a.icon}
                      className={clsx("mt-0.5 h-4 w-4 shrink-0", on ? "text-accent" : "text-ash")}
                    />
                    <span>
                      <span className={clsx("block text-caption font-semibold", on ? "text-accent" : "text-ink")}>
                        {a.name}
                      </span>
                      <span className="mt-0.5 block text-micro text-ash">{a.note}</span>
                    </span>
                  </button>
                );
              })}
            </div>

            {finding.area && (
              <div className="mt-3">
                <div className="flex flex-wrap items-center gap-2">
                  <button type="button" onClick={runCheck} className="btn-ghost">
                    {finding.checkAttempts > 0 ? PART_ONE.recheckLabel : PART_ONE.checkLabel}
                  </button>
                  <span className="text-micro text-ash">
                    Checks the area only — never the tags or your wording.
                  </span>
                </div>

                {verdict === "right" && (
                  <p className="reveal-in mt-2 rounded-xl border border-accent/30 bg-accentSoft px-3 py-2 text-caption text-ink">
                    {PART_ONE.rightText}
                  </p>
                )}

                {verdict === "wrong" && (
                  <div className="reveal-in mt-2 rounded-xl border border-warn/40 bg-warn/5 px-3 py-2">
                    <p className="text-caption text-ink">{PART_ONE.wrongText}</p>
                    <button
                      type="button"
                      onClick={() => {
                        setClueOpen((v) => !v);
                        markSeen(R1.clues, signal.id);
                      }}
                      className="mt-1.5 inline-flex items-center gap-1 text-micro font-semibold text-accent hover:text-accentHi"
                    >
                      <Help className="h-3.5 w-3.5" />
                      {clueOpen ? "Hide clue" : PART_ONE.clueLabel}
                    </button>
                    {clueOpen && (
                      <p className="reveal-in mt-1.5 rounded-lg border border-accent/25 bg-accentSoft px-2.5 py-1.5 text-caption text-ink">
                        {signal.clue}
                      </p>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Step 2 — root cause */}
          <TagRow
            anchorId={domId.rootCause(signal.id)}
            step="Step 2"
            label={ROOT_CAUSE_FIELD.label}
            instruction={ROOT_CAUSE_FIELD.instruction}
            options={ROOT_CAUSES}
            value={finding.rootCause}
            onPick={(id) => choose(R1.rootCause(signal.id), id)}
          />

          {/* Step 3 — horizon */}
          <TagRow
            anchorId={domId.horizon(signal.id)}
            step="Step 3"
            label={HORIZON_FIELD.label}
            instruction={HORIZON_FIELD.instruction}
            options={HORIZONS}
            value={finding.horizon}
            onPick={(id) => choose(R1.horizon(signal.id), id)}
          />

          {/* Step 4 — approach */}
          <div id={domId.approach(signal.id)} className="scroll-mt-24">
            <label
              htmlFor={`approach-${signal.id}`}
              className="block text-caption font-semibold text-ink"
            >
              <span className="text-ash">Step 4 · </span>
              {APPROACH_FIELD.label}
            </label>
            <p className="mt-0.5 text-micro text-ash">{APPROACH_FIELD.instruction}</p>
            <input
              id={`approach-${signal.id}`}
              type="text"
              value={finding.approach}
              onChange={(e) => setNote(R1.approach(signal.id), e.target.value)}
              placeholder={APPROACH_FIELD.placeholder}
              className="mt-2 w-full rounded-xl border border-line bg-paper px-3 py-2.5 text-caption text-ink"
            />
          </div>

          <AnswerKey block={signal.answerKey} />

          <div className="flex justify-end">
            <button type="button" onClick={toggleOpen} className="btn-ghost">
              {finding.complete ? "Close — it stays editable" : "Close for now"}
            </button>
          </div>
        </div>
      )}
    </li>
  );
}

function TagRow<T extends string>({
  anchorId,
  step,
  label,
  instruction,
  options,
  value,
  onPick,
}: {
  anchorId: string;
  step: string;
  label: string;
  instruction: string;
  options: { id: T; label: string; hint: string }[];
  value: T | null;
  onPick: (id: T) => void;
}) {
  return (
    <div id={anchorId} className="scroll-mt-24">
      <p className="text-caption font-semibold text-ink">
        <span className="text-ash">{step} · </span>
        {label}
      </p>
      <p className="mt-0.5 text-micro text-ash">{instruction}</p>
      <div className="mt-2 grid gap-2 sm:grid-cols-2">
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
              <span className={clsx("block text-caption font-semibold", on ? "text-accent" : "text-ink")}>
                {o.label}
              </span>
              <span className="mt-0.5 block text-micro text-ash">{o.hint}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
