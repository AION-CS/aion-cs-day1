"use client";

import { MaterialRefs } from "@/components/ui/MaterialRefs";
import { UndoRedoControls } from "@/components/ui/UndoRedoControls";
import { Close } from "@/components/icons/LineIcons";
import { SECTION_4, TRADEOFF_MAX, factorLabel, materialRefs, type FactorId } from "@/lib/route2";
import { useTradeOffActions } from "./actions";
import { TensionPicker } from "./TensionPicker";
import { domId, type Route2State } from "./useRoute2";

/** Section 4 — central trade-offs: the tension picker plus one note per link. */
export function TradeOffSection({ r2 }: { r2: Route2State }) {
  const actions = useTradeOffActions();

  return (
    <section id={domId.tradeoffs} className="scroll-mt-24 space-y-4 rounded-2xl border border-line bg-paper p-5">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div>
          <p className="text-micro font-semibold uppercase tracking-wide text-accent">Section {SECTION_4.n}</p>
          <h3 className="mt-1 text-h3 text-ink">{SECTION_4.title}</h3>
          <p className="mt-1 max-w-prose text-caption text-ash">{SECTION_4.instruction}</p>
          <MaterialRefs refs={materialRefs(["management"])} />
        </div>
        <UndoRedoControls onUndo={actions.undo} onRedo={actions.redo} canUndo={actions.canUndo} canRedo={actions.canRedo} />
      </div>

      <TensionPicker links={r2.tradeOffLinks} pending={r2.pendingLink as FactorId | null} onClickFactor={(id) => actions.clickFactor(id, TRADEOFF_MAX)} />

      <p className="text-center text-micro text-ash">{SECTION_4.helper}</p>

      {r2.tradeOffLinks.length > 0 && (
        <ul className="space-y-2">
          {r2.tradeOffLinks.map((l) => (
            <li key={`${l.a}-${l.b}`} id={domId.tradeoffNote(l.a, l.b)} className="scroll-mt-24 rounded-xl border border-line bg-canvas p-3">
              <div className="flex items-center justify-between gap-2">
                <p className="text-caption font-semibold text-ink">
                  {factorLabel(l.a)} ↔ {factorLabel(l.b)}
                </p>
                <button type="button" onClick={() => actions.remove(l.a, l.b)} aria-label={`Remove the ${factorLabel(l.a)} ↔ ${factorLabel(l.b)} link`} className="rounded-md border border-line p-1 text-ash hover:text-danger">
                  <Close className="h-3.5 w-3.5" />
                </button>
              </div>
              <label htmlFor={`tradeoff-note-${l.a}-${l.b}`} className="mt-2 block text-micro font-semibold text-ash">
                {SECTION_4.noteLabel}
              </label>
              <input
                id={`tradeoff-note-${l.a}-${l.b}`}
                type="text"
                value={l.note}
                onChange={(e) => actions.setNoteText(l.a, l.b, e.target.value)}
                placeholder={SECTION_4.notePlaceholder}
                className="mt-1 w-full rounded-lg border border-line bg-paper px-3 py-2 text-caption text-ink"
              />
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
