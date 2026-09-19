"use client";

import clsx from "clsx";
import { useProgress } from "@/lib/store";
import { createPlacementHistory, type PlacementMap } from "@/lib/usePlacementHistory";
import { undoRedoKeyHandler } from "@/lib/undoShortcuts";
import { UndoRedoControls } from "@/components/ui/UndoRedoControls";
import { GUIDING_DECISIONS, GUIDING_JUSTIFICATION_FIELD, GUIDING_PICK_COUNT, R2 } from "@/lib/route2";
import { useRoute2, domId } from "./useRoute2";
import { useState } from "react";

/**
 * Stage B — pick exactly three guiding decisions from a pool of eight.
 * Deselecting a card clears its justification (no orphan text). Selection
 * (not the justification text) is undoable — the same placement-history
 * pattern as Route 1's boards.
 */
export function StageGuiding() {
  const r2 = useRoute2();
  const toggleCheck = useProgress((s) => s.toggleCheck);
  const setNote = useProgress((s) => s.setNote);

  const [useHistory] = useState(() => createPlacementHistory());
  const past = useHistory((s) => s.past);
  const future = useHistory((s) => s.future);
  const recordChange = useHistory((s) => s.recordChange);
  const doUndo = useHistory((s) => s.undo);
  const doRedo = useHistory((s) => s.redo);

  const currentMap = (): PlacementMap => Object.fromEntries(GUIDING_DECISIONS.map((d) => [d.id, r2.selectedGuiding.includes(d.id) ? "1" : null]));
  const applyMap = (map: PlacementMap) => {
    for (const d of GUIDING_DECISIONS) toggleCheck(R2.guiding(d.id), !!map[d.id]);
  };

  const toggle = (id: string) => {
    const on = r2.selectedGuiding.includes(id);
    if (!on && r2.selectedGuiding.length >= GUIDING_PICK_COUNT) return;
    recordChange(currentMap());
    toggleCheck(R2.guiding(id), !on);
    if (on) setNote(R2.guidingJustification(id), "");
  };

  const handleUndo = () => {
    const prev = doUndo(currentMap());
    if (prev) applyMap(prev);
  };
  const handleRedo = () => {
    const next = doRedo(currentMap());
    if (next) applyMap(next);
  };

  return (
    <div id={domId.guidingPicker} tabIndex={-1} onKeyDown={undoRedoKeyHandler(handleUndo, handleRedo)} className="scroll-mt-24 space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-caption font-semibold text-ink">
          Pick exactly {GUIDING_PICK_COUNT} guiding decisions for the next 12 months — {r2.selectedGuiding.length}/{GUIDING_PICK_COUNT} picked
        </p>
        <UndoRedoControls onUndo={handleUndo} onRedo={handleRedo} canUndo={past.length > 0} canRedo={future.length > 0} />
      </div>

      <div className="grid gap-2.5 sm:grid-cols-2">
        {GUIDING_DECISIONS.map((d) => {
          const on = r2.selectedGuiding.includes(d.id);
          const disabled = !on && r2.selectedGuiding.length >= GUIDING_PICK_COUNT;
          return (
            <div key={d.id} className={clsx("rounded-xl border p-3 transition-colors duration-150", on ? "border-accent bg-accentSoft" : "border-line bg-paper")}>
              <button
                type="button"
                onClick={() => toggle(d.id)}
                disabled={disabled}
                aria-pressed={on}
                className={clsx("flex w-full items-start gap-2.5 text-left text-caption", disabled ? "cursor-not-allowed text-ash opacity-60" : "text-ink")}
              >
                <span className={clsx("mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded border text-[10px] font-bold", on ? "border-accent bg-accent text-paper" : "border-line")}>
                  {on ? "✓" : ""}
                </span>
                {d.text}
              </button>

              {on && (
                <div id={domId.guidingJustification(d.id)} className="mt-2 scroll-mt-24 border-t border-accent/20 pt-2">
                  <label htmlFor={`r2-guiding-just-${d.id}`} className="block text-micro font-semibold text-ink">
                    {GUIDING_JUSTIFICATION_FIELD.label}
                  </label>
                  <p className="mt-0.5 text-micro text-ash">{GUIDING_JUSTIFICATION_FIELD.instruction}</p>
                  <textarea
                    id={`r2-guiding-just-${d.id}`}
                    value={r2.guidingJustifications[d.id]}
                    onChange={(e) => setNote(R2.guidingJustification(d.id), e.target.value)}
                    placeholder={GUIDING_JUSTIFICATION_FIELD.placeholder}
                    rows={2}
                    className="mt-1 w-full rounded-xl border border-line bg-paper px-2.5 py-2 text-caption text-ink"
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
