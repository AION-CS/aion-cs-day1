"use client";

import clsx from "clsx";
import { useProgress } from "@/lib/store";
import { OPTIONS, R1, STAGE2, materialRefs } from "@/lib/route1";
import { MaterialRefs } from "@/components/ui/MaterialRefs";
import { AnswerKeyNote } from "@/components/ui/AnswerKey";
import { scrollToAndFlash } from "@/lib/scrollToAndFlash";
import { useRoute1, domId } from "./useRoute1";

/**
 * The commit step. Opens for real once all three profiles have been revealed —
 * but it is never hidden: an unrevealed state shows a soft prompt that points
 * at the first option still to reveal, so nothing is blocked and the learner
 * always knows what would open it.
 */
export function CommitStep() {
  const r1 = useRoute1();
  const choose = useProgress((s) => s.choose);
  const setNote = useProgress((s) => s.setNote);
  const c = STAGE2.commit;

  return (
    <section id={domId.commit} className="scroll-mt-24 rounded-2xl border border-line bg-paper p-5">
      <p className="text-micro font-semibold uppercase tracking-wide text-accent">
        Step 4 · Commit and defend
      </p>
      <h3 className="text-h3 text-ink">Your recommendation</h3>
      <p className="mt-1 max-w-prose text-caption text-ash">
        You are scored on the completeness of the reasoning, not on which letter you pick — name the trade-off, name
        the next decision it forces, and name what could go wrong.
      </p>
      <MaterialRefs refs={materialRefs(["defensible", "constraint"])} />

      {!r1.allRevealed && (
        <div className="mt-4 flex flex-wrap items-center gap-3 rounded-xl border border-warn/40 bg-warn/5 p-3">
          <p className="flex-1 text-caption text-ink">
            Recommended: reveal all three profiles before committing — you have seen {r1.revealedCount} of{" "}
            {r1.totalOptions}. You can still fill this in now.
          </p>
          <button
            type="button"
            onClick={() => {
              const next = r1.optionStates.find((s) => !s.revealed);
              if (next) scrollToAndFlash(domId.reveal(next.option.id), "ref");
            }}
            className="rounded-full border border-warn/50 px-3 py-1 text-micro font-semibold text-warn hover:bg-warn/10"
          >
            Go to the next one
          </button>
        </div>
      )}

      {/* --- Pick --- */}
      <div id={domId.pick} className="mt-5 scroll-mt-24">
        <p className="text-caption font-semibold text-ink">{c.pick.label}</p>
        <p className="mt-0.5 text-micro text-ash">{c.pick.instruction}</p>
        <div className="mt-2 grid gap-2 md:grid-cols-3">
          {OPTIONS.map((o) => {
            const active = r1.pick === o.id;
            return (
              <button
                key={o.id}
                type="button"
                aria-pressed={active}
                onClick={() => choose(R1.pick, active ? "" : o.id)}
                className={clsx(
                  "rounded-xl border p-3 text-left transition-colors duration-150",
                  active ? "border-accent bg-accentSoft" : "border-line bg-paper hover:border-ash",
                )}
              >
                <span className="flex items-center gap-2">
                  <span
                    className={clsx(
                      "flex h-7 w-7 items-center justify-center rounded-lg text-caption font-bold",
                      active ? "bg-accent text-paper" : "bg-mist text-ink",
                    )}
                  >
                    {o.id}
                  </span>
                  <span className={clsx("text-caption font-semibold", active ? "text-accent" : "text-ink")}>
                    {o.shortName}
                  </span>
                </span>
                <span className="mt-1.5 block text-micro text-ash">{o.stage}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* --- Rationale --- */}
      <Field
        id={domId.rationale}
        fieldId="r1-rationale-field"
        label={c.rationale.label}
        instruction={c.rationale.instruction}
        placeholder={c.rationale.placeholder}
        value={r1.rationale}
        rows={3}
        onChange={(v) => setNote(R1.rationale, v)}
      />

      {/* --- Feasibility --- */}
      <Field
        id={domId.feasibility}
        fieldId="r1-feasibility-field"
        label={c.feasibility.label}
        instruction={c.feasibility.instruction}
        placeholder={c.feasibility.placeholder}
        value={r1.feasibility}
        rows={2}
        onChange={(v) => setNote(R1.feasibility, v)}
      />

      {/* --- Follow-up decisions --- */}
      <div className="mt-5">
        <p className="text-caption font-semibold text-ink">Two follow-up decisions this choice forces</p>
        <p className="mt-0.5 text-micro text-ash">{c.followUp.instruction}</p>
        <div className="mt-2 grid gap-3 md:grid-cols-2">
          {([1, 2] as const).map((n) => (
            <Field
              key={n}
              id={domId.followUp(n)}
              fieldId={`r1-followup-${n}`}
              label={c.followUp.label(n)}
              placeholder={c.followUp.placeholder}
              value={r1.followUp[n - 1]}
              rows={3}
              compact
              onChange={(v) => setNote(R1.followUp(n), v)}
            />
          ))}
        </div>
      </div>

      {/* --- Risks of the road not taken --- */}
      <div className="mt-5">
        <p className="text-caption font-semibold text-ink">Two risks of the road not taken</p>
        <p className="mt-0.5 text-micro text-ash">{c.risk.instruction}</p>
        <div className="mt-2 grid gap-3 md:grid-cols-2">
          {([1, 2] as const).map((n) => (
            <Field
              key={n}
              id={domId.risk(n)}
              fieldId={`r1-risk-${n}`}
              label={c.risk.label(n)}
              placeholder={c.risk.placeholder}
              value={r1.risks[n - 1]}
              rows={3}
              compact
              onChange={(v) => setNote(R1.risk(n), v)}
            />
          ))}
        </div>
      </div>

      <AnswerKeyNote
        label="What a complete memo does"
        text="There is no correct letter — all three options are defensible and the ground-truth profiles are built so none dominates. Judge a submission on three things: does the rationale name the real trade-off in the option's own terms (not a generality), does it name a specific next decision with an owner and rough timing, and do the two risks describe what the rejected options would have prevented rather than restating the chosen option's own weaknesses. A learner who picks the 'weakest' option and does all three has written the better memo."
      />
    </section>
  );
}

function Field({
  id,
  fieldId,
  label,
  instruction,
  placeholder,
  value,
  rows,
  compact,
  onChange,
}: {
  id: string;
  fieldId: string;
  label: string;
  instruction?: string;
  placeholder: string;
  value: string;
  rows: number;
  compact?: boolean;
  onChange: (v: string) => void;
}) {
  return (
    <div id={id} className={clsx("scroll-mt-24", compact ? "" : "mt-5")}>
      <label htmlFor={fieldId} className="block text-caption font-semibold text-ink">
        {label}
      </label>
      {instruction && <p className="mt-0.5 text-micro text-ash">{instruction}</p>}
      <textarea
        id={fieldId}
        rows={rows}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="mt-2 w-full rounded-xl border border-line bg-paper px-3 py-2.5 text-caption text-ink"
      />
    </div>
  );
}
