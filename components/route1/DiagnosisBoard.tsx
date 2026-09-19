"use client";

import { useState } from "react";
import clsx from "clsx";
import { useProgress } from "@/lib/store";
import { createPlacementHistory, type PlacementMap } from "@/lib/usePlacementHistory";
import { undoRedoKeyHandler } from "@/lib/undoShortcuts";
import { AnswerKey } from "@/components/ui/AnswerKey";
import { UndoRedoControls } from "@/components/ui/UndoRedoControls";
import { MaterialRefs } from "@/components/ui/MaterialRefs";
import { CheckVerdict } from "@/components/ui/CheckVerdict";
import { DragHandle, Icon } from "@/components/icons/LineIcons";
import { AREAS, AREA_FIELD, APPROACH_FIELD, CHECK_LABELS, R1, areaById, materialRefs, type AreaId } from "@/lib/route1";
import { checkSignalPlacement, domId, useRoute1, type CheckResult, type SignalState } from "./useRoute1";

/**
 * Task 1, Stage A — the Signal-Tagging Diagnosis Board. Ten signal cards, six
 * area drop zones. Native HTML5 drag plus a tap-to-select/tap-to-place
 * fallback drive every placement (CLAUDE.md §9); every placement change is
 * undoable (CLAUDE.md §5) via one `createPlacementHistory()` instance scoped
 * to this board. The per-card check is clue-only and on request, and never
 * names the correct area (CLAUDE.md §4).
 */
export function DiagnosisBoard() {
  const r1 = useRoute1();
  const choose = useProgress((s) => s.choose);
  const setNote = useProgress((s) => s.setNote);

  const [useBoardHistory] = useState(() => createPlacementHistory());
  const past = useBoardHistory((s) => s.past);
  const future = useBoardHistory((s) => s.future);
  const recordChange = useBoardHistory((s) => s.recordChange);
  const doUndo = useBoardHistory((s) => s.undo);
  const doRedo = useBoardHistory((s) => s.redo);

  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [overArea, setOverArea] = useState<AreaId | "pool" | null>(null);

  const currentMap = (): PlacementMap => {
    const map: PlacementMap = {};
    for (const s of r1.signalStates) {
      map[`${s.signal.id}:area`] = s.area;
      map[`${s.signal.id}:secondary`] = s.secondaryArea;
    }
    return map;
  };
  const applyMap = (map: PlacementMap) => {
    for (const s of r1.signalStates) {
      choose(R1.area(s.signal.id), map[`${s.signal.id}:area`] ?? "");
      choose(R1.areaSecondary(s.signal.id), map[`${s.signal.id}:secondary`] ?? "");
    }
  };

  const place = (signalId: string, area: AreaId | null) => {
    if (r1.signalById(signalId).area === area) return;
    recordChange(currentMap());
    choose(R1.area(signalId), area ?? "");
    // Placing a card elsewhere clears a secondary tag equal to the new primary.
    if (area && r1.signalById(signalId).secondaryArea === area) choose(R1.areaSecondary(signalId), "");
  };

  const setSecondary = (signalId: string, area: AreaId | null) => {
    if (r1.signalById(signalId).secondaryArea === area) return;
    recordChange(currentMap());
    choose(R1.areaSecondary(signalId), area ?? "");
  };

  const handleUndo = () => {
    const prev = doUndo(currentMap());
    if (prev) applyMap(prev);
  };
  const handleRedo = () => {
    const next = doRedo(currentMap());
    if (next) applyMap(next);
  };

  const startDrag = (e: React.DragEvent, id: string) => {
    e.dataTransfer.setData("text/plain", id);
    e.dataTransfer.effectAllowed = "move";
    setDraggingId(id);
  };
  const endDrag = () => setDraggingId(null);

  const dropOn = (target: AreaId | null) => (e: React.DragEvent) => {
    e.preventDefault();
    const id = e.dataTransfer.getData("text/plain");
    setOverArea(null);
    if (id) place(id, target);
  };

  const tapPlace = (target: AreaId | null) => () => {
    if (!selectedId) return;
    place(selectedId, target);
    setSelectedId(null);
  };

  return (
    <div id={domId.board} tabIndex={-1} onKeyDown={undoRedoKeyHandler(handleUndo, handleRedo)} className="scroll-mt-24 space-y-4">
      <MaterialRefs refs={materialRefs(AREA_FIELD.material)} />

      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-micro text-ash">
          <span className="font-semibold tabular-nums text-ink">{r1.placedCount}</span> of {r1.totalSignals} placed ·{" "}
          <span className="font-semibold tabular-nums text-ink">{r1.areasWithApproach}</span> of {AREAS.length} areas have an improvement approach
        </p>
        <UndoRedoControls onUndo={handleUndo} onRedo={handleRedo} canUndo={past.length > 0} canRedo={future.length > 0} />
      </div>

      {/* Pool — also a drop target, for dragging a placed card back out */}
      <div
        data-dropzone="pool"
        onDragOver={(e) => {
          e.preventDefault();
          setOverArea("pool");
        }}
        onDragLeave={() => setOverArea((cur) => (cur === "pool" ? null : cur))}
        onDrop={dropOn(null)}
        onClick={tapPlace(null)}
        className={clsx(
          "rounded-2xl border border-dashed p-4 transition-colors duration-150",
          overArea === "pool" ? "is-drop-target" : "border-line bg-canvas",
          selectedId && "cursor-pointer",
        )}
      >
        <p className="text-micro font-semibold uppercase tracking-wide text-ash">
          Signal pool — drag a card, or tap it and then tap an area below
        </p>
        <p className="mt-0.5 text-micro text-ash">{AREA_FIELD.instruction}</p>
        {r1.unplacedSignals.length === 0 ? (
          <p className="mt-2 text-caption text-ash">Every signal has been placed. Drag one out of an area below, or tap it and tap here, to reclassify it.</p>
        ) : (
          <div className="mt-2.5 flex flex-wrap gap-2">
            {r1.unplacedSignals.map((s) => (
              <PoolCard
                key={s.signal.id}
                state={s}
                selected={selectedId === s.signal.id}
                dragging={draggingId === s.signal.id}
                onSelect={() => setSelectedId((cur) => (cur === s.signal.id ? null : s.signal.id))}
                onDragStart={(e) => startDrag(e, s.signal.id)}
                onDragEnd={endDrag}
              />
            ))}
          </div>
        )}
      </div>

      {/* The six area drop zones */}
      <div className="grid gap-4 sm:grid-cols-2">
        {AREAS.map((area) => {
          const placed = r1.byArea(area.id);
          return (
            <div
              key={area.id}
              data-dropzone={area.id}
              onDragOver={(e) => {
                e.preventDefault();
                setOverArea(area.id);
              }}
              onDragLeave={() => setOverArea((cur) => (cur === area.id ? null : cur))}
              onDrop={dropOn(area.id)}
              onClick={selectedId ? tapPlace(area.id) : undefined}
              className={clsx("card space-y-3 p-4 transition-colors duration-150", overArea === area.id && "is-drop-target", selectedId && "cursor-pointer")}
            >
              <div>
                <div className="flex items-center gap-2">
                  <Icon name={area.icon} className="h-4 w-4 shrink-0 text-accent" />
                  <p className="text-caption font-semibold text-ink">{area.name}</p>
                </div>
                <p className="mt-0.5 text-micro text-ash">{area.note}</p>
                <p className="mt-1 text-micro text-ash">
                  <span className="font-semibold text-ink">Look for: </span>
                  {area.lookFor}
                </p>
                <p className="mt-0.5 text-micro text-ash">
                  <span className="font-semibold text-ink">Tell apart from {areaById(area.confusedWith).name}: </span>
                  {area.ask}
                </p>
              </div>

              {placed.length === 0 ? (
                <p className="rounded-lg border border-dashed border-line bg-canvas px-2.5 py-2 text-micro italic text-ash">
                  Drop, or tap a selected card here.
                </p>
              ) : (
                <div className="space-y-3">
                  {placed.map((s) => (
                    <PlacedCard
                      key={s.signal.id}
                      state={s}
                      dragging={draggingId === s.signal.id}
                      onRemove={() => place(s.signal.id, null)}
                      onSetSecondary={(a) => setSecondary(s.signal.id, a)}
                      onDragStart={(e) => startDrag(e, s.signal.id)}
                      onDragEnd={endDrag}
                    />
                  ))}
                </div>
              )}

              <ApproachField areaId={area.id} />
            </div>
          );
        })}
      </div>
    </div>
  );
}

function ApproachField({ areaId }: { areaId: AreaId }) {
  const setNote = useProgress((s) => s.setNote);
  const value = useProgress((s) => s.notes[R1.approach(areaId)] ?? "");
  return (
    <div id={domId.approach(areaId)} className="scroll-mt-24 border-t border-line pt-3">
      <label htmlFor={`r1-approach-input-${areaId}`} className="block text-caption font-semibold text-ink">
        {APPROACH_FIELD.label}
      </label>
      <p className="mt-0.5 text-micro text-ash">{APPROACH_FIELD.instruction}</p>
      <textarea
        id={`r1-approach-input-${areaId}`}
        value={value}
        onChange={(e) => setNote(R1.approach(areaId), e.target.value)}
        placeholder={APPROACH_FIELD.placeholder}
        rows={2}
        className="mt-1.5 w-full rounded-xl border border-line bg-paper px-3 py-2 text-caption text-ink"
      />
    </div>
  );
}

function PoolCard({
  state,
  selected,
  dragging,
  onSelect,
  onDragStart,
  onDragEnd,
}: {
  state: SignalState;
  selected: boolean;
  dragging: boolean;
  onSelect: () => void;
  onDragStart: (e: React.DragEvent) => void;
  onDragEnd: () => void;
}) {
  return (
    <div
      id={domId.signal(state.signal.id)}
      draggable
      role="button"
      tabIndex={0}
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      onClick={onSelect}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onSelect();
        }
      }}
      className={clsx(
        "scroll-mt-24 w-full max-w-sm cursor-grab select-none rounded-xl border p-3 text-left transition-colors duration-150 sm:w-auto",
        dragging && "is-dragging",
        selected ? "border-accent bg-accentSoft ring-2 ring-accent/30" : "border-line bg-paper hover:border-ash",
      )}
    >
      <div className="flex items-center gap-1.5 text-micro font-semibold uppercase tracking-wide text-ash">
        <DragHandle className="h-3.5 w-3.5" /> Signal {state.signal.n}
      </div>
      <p className="mt-1 max-w-xs text-caption text-ink">{state.signal.text}</p>
      {selected && <p className="mt-1.5 text-micro font-semibold text-accent">Tap an area to place it.</p>}
    </div>
  );
}

function PlacedCard({
  state,
  dragging,
  onRemove,
  onSetSecondary,
  onDragStart,
  onDragEnd,
}: {
  state: SignalState;
  dragging: boolean;
  onRemove: () => void;
  onSetSecondary: (area: AreaId | null) => void;
  onDragStart: (e: React.DragEvent) => void;
  onDragEnd: () => void;
}) {
  const setNote = useProgress((s) => s.setNote);
  // A verdict belongs to the placement it checked: it disappears the moment the area changes.
  const [checked, setChecked] = useState<{ area: AreaId | null; res: CheckResult } | null>(null);
  const result = checked && checked.area === state.area ? checked.res : null;

  const runCheck = () => {
    if (!state.area) return;
    const nextCount = state.checkCount + 1;
    setNote(R1.checkCount(state.signal.id), String(nextCount));
    setChecked({ area: state.area, res: checkSignalPlacement(state, nextCount) });
  };

  const otherAreas = AREAS.filter((a) => a.id !== state.area);

  return (
    <div
      id={domId.signal(state.signal.id)}
      draggable
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      className={clsx("scroll-mt-24 space-y-3 rounded-xl border p-3", dragging ? "is-dragging border-line bg-paper" : "border-line bg-paper")}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex min-w-0 items-start gap-1.5">
          <DragHandle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-ash" />
          <div className="min-w-0">
            <p className="text-micro font-semibold uppercase tracking-wide text-ash">Signal {state.signal.n}</p>
            <p className="text-caption text-ink">{state.signal.text}</p>
          </div>
        </div>
        <button type="button" onClick={onRemove} className="shrink-0 whitespace-nowrap text-micro font-semibold text-ash transition-colors duration-150 hover:text-ink">
          Move to pool
        </button>
      </div>

      {/* Check placement */}
      <div className="space-y-1.5 rounded-lg border border-line bg-canvas p-2.5">
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={runCheck}
            className="rounded-lg border border-line bg-paper px-3 py-1.5 text-caption font-semibold text-ink transition-colors duration-150 hover:border-ash"
          >
            {state.checkCount > 0 ? CHECK_LABELS.recheck : CHECK_LABELS.check}
          </button>
          {state.checkCount > 0 && <span className="text-micro text-ash">checked {state.checkCount}×</span>}
        </div>
        <CheckVerdict result={result} holdsLabel={CHECK_LABELS.holds} notYetLabel={result && !result.holds && result.tier === "sharp" ? CHECK_LABELS.wrongTier2 : CHECK_LABELS.wrongTier1} />
      </div>

      {/* Optional secondary tag */}
      <div>
        <p className="text-micro text-ash">Also relevant to (optional)</p>
        <div className="mt-1 flex flex-wrap gap-1">
          {otherAreas.map((a) => {
            const on = state.secondaryArea === a.id;
            return (
              <button
                key={a.id}
                type="button"
                onClick={() => onSetSecondary(on ? null : a.id)}
                aria-pressed={on}
                className={clsx(
                  "rounded-full border px-2 py-0.5 text-micro font-semibold transition-colors duration-150",
                  on ? "border-accent bg-accentSoft text-accent" : "border-line text-ash hover:border-ash",
                )}
              >
                {a.name}
              </button>
            );
          })}
        </div>
      </div>

      <AnswerKey block={state.signal.answerKey} />
    </div>
  );
}
