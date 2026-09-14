"use client";

import { useState } from "react";
import clsx from "clsx";
import { useProgress } from "@/lib/store";
import { MaterialRefs } from "@/components/ui/MaterialRefs";
import { UndoRedoControls } from "@/components/ui/UndoRedoControls";
import { ChevronDown, Close, DragHandle } from "@/components/icons/LineIcons";
import { CRITERIA, R2, RANK_SLOTS, SECTION_3, materialRefs, type CriterionId } from "@/lib/route2";
import { useCriteriaActions } from "./actions";
import { domId, type Route2State } from "./useRoute2";

/**
 * Section 3 — decision logic: pick and order the top 3 of 7 criteria (native
 * HTML5 drag, plus a keyboard-accessible rank selector on every candidate),
 * then declare the assessment boundary. Each criterion carries its own
 * definition below its name, so the lens is self-contained here (§13).
 */
export function DecisionLogicSection({ r2 }: { r2: Route2State }) {
  const setNote = useProgress((s) => s.setNote);
  const actions = useCriteriaActions();
  const [dragOver, setDragOver] = useState(false);

  const onDropAdd = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const id = e.dataTransfer.getData("text/plain");
    if (CRITERIA.some((c) => c.id === id)) actions.add(id as CriterionId);
  };

  return (
    <section id={domId.logic} className="scroll-mt-24 space-y-4 rounded-2xl border border-line bg-paper p-5">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div>
          <p className="text-micro font-semibold uppercase tracking-wide text-accent">Section {SECTION_3.n}</p>
          <h3 className="mt-1 text-h3 text-ink">{SECTION_3.title}</h3>
          <p className="mt-1 max-w-prose text-caption text-ash">{SECTION_3.instruction}</p>
          <MaterialRefs refs={materialRefs(["measure"])} />
        </div>
        <UndoRedoControls onUndo={actions.undo} onRedo={actions.redo} canUndo={actions.canUndo} canRedo={actions.canRedo} />
      </div>

      {/* Rank slots */}
      <div
        id={domId.criteriaRank}
        className={clsx("scroll-mt-24 rounded-xl border p-3 transition-colors duration-150", dragOver ? "is-drop-target" : "border-line bg-canvas")}
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={onDropAdd}
      >
        <p className="text-micro font-semibold uppercase tracking-wide text-ash">Your top three</p>
        <ol className="mt-2 space-y-2">
          {Array.from({ length: RANK_SLOTS }).map((_, i) => {
            const id = r2.criteriaOrder[i];
            const c = id ? CRITERIA.find((x) => x.id === id) : null;
            return (
              <li key={i}>
                {c ? (
                  <div
                    draggable
                    onDragStart={(e) => e.dataTransfer.setData("text/plain", c.id)}
                    className="reveal-in flex items-start gap-2 rounded-xl border border-accent/40 bg-paper p-2.5"
                  >
                    <DragHandle className="mt-1.5 h-3.5 w-3.5 shrink-0 cursor-grab text-ash" />
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-accent text-caption font-bold text-paper">{i + 1}</span>
                    <span className="min-w-0 flex-1">
                      <span className="block text-caption font-semibold text-ink">{c.name}</span>
                      <span className="block text-micro text-ash">{c.definition}</span>
                    </span>
                    <div className="flex shrink-0 items-center gap-1">
                      <button type="button" onClick={() => actions.move(i, -1)} aria-label={`Move ${c.name} up`} className="rounded-md border border-line p-1 text-ash hover:text-ink">
                        <ChevronDown className="h-3.5 w-3.5 rotate-180" />
                      </button>
                      <button type="button" onClick={() => actions.move(i, 1)} aria-label={`Move ${c.name} down`} className="rounded-md border border-line p-1 text-ash hover:text-ink">
                        <ChevronDown className="h-3.5 w-3.5" />
                      </button>
                      <button type="button" onClick={() => actions.remove(c.id)} aria-label={`Remove ${c.name}`} className="rounded-md border border-line p-1 text-ash hover:text-danger">
                        <Close className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 rounded-xl border border-dashed border-line bg-paper p-2.5">
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-mist text-caption font-bold text-ash">{i + 1}</span>
                    <span className="text-caption text-ash">Empty — click or drag a criterion below into this slot.</span>
                  </div>
                )}
              </li>
            );
          })}
        </ol>
      </div>

      {/* Candidates */}
      <div>
        <p className="text-micro font-semibold uppercase tracking-wide text-ash">The seven criteria</p>
        <ul className="mt-2 grid gap-2 md:grid-cols-2">
          {CRITERIA.map((c) => {
            const pos = r2.criteriaOrder.indexOf(c.id);
            const ranked = pos >= 0;
            return (
              <li key={c.id}>
                <div
                  draggable={!ranked}
                  onDragStart={(e) => e.dataTransfer.setData("text/plain", c.id)}
                  role="button"
                  tabIndex={0}
                  onClick={() => (ranked ? actions.remove(c.id) : actions.add(c.id))}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      ranked ? actions.remove(c.id) : actions.add(c.id);
                    }
                  }}
                  aria-pressed={ranked}
                  className={clsx(
                    "flex h-full w-full cursor-pointer items-start gap-2 rounded-xl border p-3 text-left transition-colors duration-150",
                    ranked ? "border-accent bg-accentSoft" : "border-line bg-canvas hover:border-ash",
                  )}
                >
                  <span className={clsx("flex h-6 w-6 shrink-0 items-center justify-center rounded-md text-micro font-bold", ranked ? "bg-accent text-paper" : "bg-paper text-ash")}>
                    {ranked ? `#${pos + 1}` : <DragHandle className="h-3.5 w-3.5" />}
                  </span>
                  <span>
                    <span className={clsx("block text-caption font-semibold", ranked ? "text-accent" : "text-ink")}>{c.name}</span>
                    <span className="mt-0.5 block text-micro text-ash">{c.definition}</span>
                  </span>
                </div>
              </li>
            );
          })}
        </ul>
      </div>

      {/* Boundary */}
      <div id={domId.boundary} className="scroll-mt-24">
        <label htmlFor="r2-boundary-field" className="block text-caption font-semibold text-ink">
          {SECTION_3.boundary.label}
        </label>
        <p className="mt-0.5 text-micro text-ash">{SECTION_3.boundary.helper}</p>
        <input
          id="r2-boundary-field"
          type="text"
          value={r2.boundary}
          onChange={(e) => setNote(R2.boundary, e.target.value)}
          placeholder={SECTION_3.boundary.placeholder}
          className="mt-2 w-full rounded-xl border border-line bg-paper px-3 py-2.5 text-caption text-ink"
        />
      </div>
    </section>
  );
}
