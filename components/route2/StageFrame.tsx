"use client";

import clsx from "clsx";
import { useProgress } from "@/lib/store";
import { MaterialRefs } from "@/components/ui/MaterialRefs";
import { Icon } from "@/components/icons/LineIcons";
import { R2, RELEVANCE_PICK_COUNT, RELEVANCE_REASONS, RELEVANCE_JUSTIFICATION_FIELD, ROLES, ROLE_LENS_FIELD, materialRefs } from "@/lib/route2";
import { useRoute2, domId } from "./useRoute2";

/** Stage A — Frame it: a role lens (colours framing only, never locks content) + exactly two reasons + a justification. */
export function StageFrame() {
  const r2 = useRoute2();
  const choose = useProgress((s) => s.choose);
  const toggleCheck = useProgress((s) => s.toggleCheck);
  const setNote = useProgress((s) => s.setNote);

  const toggleReason = (id: string) => {
    const on = r2.selectedReasons.includes(id);
    if (!on && r2.selectedReasons.length >= RELEVANCE_PICK_COUNT) return;
    toggleCheck(R2.reason(id), !on);
  };

  return (
    <div className="space-y-5">
      <div id={domId.roleLens} className="scroll-mt-24">
        <p className="text-caption font-semibold text-ink">{ROLE_LENS_FIELD.label}</p>
        <p className="mt-0.5 text-micro text-ash">{ROLE_LENS_FIELD.instruction}</p>
        <MaterialRefs refs={materialRefs(ROLE_LENS_FIELD.material)} />
        <div className="mt-1.5 grid gap-2 sm:grid-cols-2">
          {ROLES.map((role) => {
            const on = r2.roleLens === role.id;
            return (
              <button
                key={role.id}
                type="button"
                onClick={() => choose(R2.roleLens, role.id)}
                aria-pressed={on}
                className={clsx(
                  "flex items-start gap-2.5 rounded-xl border p-3 text-left transition-colors duration-150",
                  on ? "border-accent bg-accentSoft" : "border-line bg-paper hover:border-ash",
                )}
              >
                <Icon name={role.icon} className={clsx("mt-0.5 h-4 w-4 shrink-0", on ? "text-accent" : "text-ash")} />
                <span>
                  <span className="block text-caption font-semibold text-ink">{role.name}</span>
                  <span className="block text-micro text-ash">{role.mandate}</span>
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <div id={domId.reasons} className="scroll-mt-24">
        <p className="text-caption font-semibold text-ink">
          Pick {RELEVANCE_PICK_COUNT} reasons this is strategically relevant now — {r2.selectedReasons.length}/{RELEVANCE_PICK_COUNT} picked
        </p>
        <p className="mt-0.5 text-micro text-ash">Choose exactly two; deselect one to swap it for another.</p>
        <div className="mt-1.5 space-y-1.5">
          {RELEVANCE_REASONS.map((r) => {
            const on = r2.selectedReasons.includes(r.id);
            const disabled = !on && r2.selectedReasons.length >= RELEVANCE_PICK_COUNT;
            return (
              <button
                key={r.id}
                type="button"
                onClick={() => toggleReason(r.id)}
                disabled={disabled}
                aria-pressed={on}
                className={clsx(
                  "flex w-full items-start gap-2.5 rounded-xl border p-3 text-left text-caption transition-colors duration-150",
                  on ? "border-accent bg-accentSoft text-ink" : disabled ? "cursor-not-allowed border-line bg-canvas text-ash opacity-60" : "border-line bg-paper text-ink hover:border-ash",
                )}
              >
                <span
                  className={clsx(
                    "mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded border text-[10px] font-bold",
                    on ? "border-accent bg-accent text-paper" : "border-line",
                  )}
                >
                  {on ? "✓" : ""}
                </span>
                {r.text}
              </button>
            );
          })}
        </div>
      </div>

      <div id={domId.relevanceJustification} className="scroll-mt-24">
        <label htmlFor="r2-relevance-justification-field" className="block text-caption font-semibold text-ink">
          {RELEVANCE_JUSTIFICATION_FIELD.label}
        </label>
        <p className="mt-0.5 text-micro text-ash">{RELEVANCE_JUSTIFICATION_FIELD.instruction}</p>
        <textarea
          id="r2-relevance-justification-field"
          value={r2.relevanceJustification}
          onChange={(e) => setNote(R2.relevanceJustification, e.target.value)}
          placeholder={RELEVANCE_JUSTIFICATION_FIELD.placeholder}
          rows={2}
          className="mt-1.5 w-full rounded-xl border border-line bg-paper px-3 py-2 text-caption text-ink"
        />
      </div>
    </div>
  );
}
