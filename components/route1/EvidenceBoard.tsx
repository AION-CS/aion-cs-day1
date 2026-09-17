"use client";

import { useEffect, useState } from "react";
import clsx from "clsx";
import { useProgress } from "@/lib/store";
import { createPlacementHistory, type PlacementMap } from "@/lib/usePlacementHistory";
import { undoRedoKeyHandler } from "@/lib/undoShortcuts";
import { AnswerKey } from "@/components/ui/AnswerKey";
import { UndoRedoControls } from "@/components/ui/UndoRedoControls";
import { MaterialRefs } from "@/components/ui/MaterialRefs";
import { DragHandle, Icon } from "@/components/icons/LineIcons";
import {
  AREAS,
  AREA_FIELD,
  APPROACH_FIELD,
  CHECK_LABELS,
  R1,
  ROOT_CAUSES,
  ROOT_CAUSE_FIELD,
  TIMEFRAMES,
  TIMEFRAME_FIELD,
  materialRefs,
  type AreaId,
} from "@/lib/route1";
import { checkChipPlacement, domId, useRoute1, type ChipState, type CheckResult } from "./useRoute1";

/**
 * Task 1 — the Evidence-Tagging Diagnosis Board. Seven case chips, six area
 * drop zones. Native HTML5 drag events plus a tap-to-select/tap-to-place
 * fallback drive every placement (CLAUDE.md §9); every placement change is
 * undoable (CLAUDE.md §5) via one `createPlacementHistory()` instance scoped
 * to this board. The area check is per-chip and only ever returns a tiered
 * clue, never the correct area (CLAUDE.md §4).
 */
export function EvidenceBoard() {
  const r1 = useRoute1();
  const choose = useProgress((s) => s.choose);

  const [useBoardHistory] = useState(() => createPlacementHistory());
  const past = useBoardHistory((s) => s.past);
  const future = useBoardHistory((s) => s.future);
  const recordChange = useBoardHistory((s) => s.recordChange);
  const doUndo = useBoardHistory((s) => s.undo);
  const doRedo = useBoardHistory((s) => s.redo);

  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [overArea, setOverArea] = useState<AreaId | "pool" | null>(null);

  const currentMap = (): PlacementMap => Object.fromEntries(r1.chips.map((c) => [c.evidence.id, c.area]));

  const applyMap = (map: PlacementMap) => {
    for (const c of r1.chips) choose(R1.area(c.evidence.id), map[c.evidence.id] ?? "");
  };

  const place = (evidenceId: string, area: AreaId | null) => {
    if (r1.chipById(evidenceId).area === area) return;
    recordChange(currentMap());
    choose(R1.area(evidenceId), area ?? "");
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

  const unplaced = r1.chips.filter((c) => !c.area);

  return (
    <div
      id={domId.board}
      tabIndex={-1}
      onKeyDown={undoRedoKeyHandler(handleUndo, handleRedo)}
      className="scroll-mt-24 space-y-4"
    >
      <MaterialRefs refs={materialRefs(["businessCase", "threeLens", "behaviourChange", "regulation"])} />

      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-micro text-ash">
          <span className="font-semibold tabular-nums text-ink">{r1.placedCount}</span> of {r1.totalChips} classified ·{" "}
          <span className="font-semibold tabular-nums text-ink">{r1.completeCount}</span> of {r1.totalChips} fully tagged
        </p>
        <UndoRedoControls onUndo={handleUndo} onRedo={handleRedo} canUndo={past.length > 0} canRedo={future.length > 0} />
      </div>

      {/* The pool — also a drop target, for dragging a placed chip back out */}
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
          Evidence pool — drag a chip, or tap it and then tap an area below
        </p>
        <p className="mt-0.5 text-micro text-ash">{AREA_FIELD.instruction}</p>
        {unplaced.length === 0 ? (
          <p className="mt-2 text-caption text-ash">
            Every indication has been placed. Drag a chip out of an area below, or tap it and tap here, to reclassify it.
          </p>
        ) : (
          <div className="mt-2.5 flex flex-wrap gap-2">
            {unplaced.map((chip) => (
              <PoolChip
                key={chip.evidence.id}
                chip={chip}
                selected={selectedId === chip.evidence.id}
                dragging={draggingId === chip.evidence.id}
                onSelect={() => setSelectedId((cur) => (cur === chip.evidence.id ? null : chip.evidence.id))}
                onDragStart={(e) => startDrag(e, chip.evidence.id)}
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
              className={clsx(
                "card space-y-3 p-4 transition-colors duration-150",
                overArea === area.id && "is-drop-target",
                selectedId && "cursor-pointer",
              )}
            >
              <div>
                <div className="flex items-center gap-2">
                  <Icon name={area.icon} className="h-4 w-4 shrink-0 text-accent" />
                  <p className="text-caption font-semibold text-ink">{area.name}</p>
                </div>
                <p className="mt-0.5 text-micro text-ash">{area.note}</p>
              </div>

              {placed.length === 0 ? (
                <p className="rounded-lg border border-dashed border-line bg-canvas px-2.5 py-2 text-micro italic text-ash">
                  Drop, or tap a selected chip here.
                </p>
              ) : (
                <div className="space-y-3">
                  {placed.map((chip) => (
                    <PlacedChip
                      key={chip.evidence.id}
                      chip={chip}
                      dragging={draggingId === chip.evidence.id}
                      selected={selectedId === chip.evidence.id}
                      onSelectHeader={() => setSelectedId((cur) => (cur === chip.evidence.id ? null : chip.evidence.id))}
                      onRemove={() => place(chip.evidence.id, null)}
                      onDragStart={(e) => startDrag(e, chip.evidence.id)}
                      onDragEnd={endDrag}
                    />
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Pool chip — unplaced, draggable or tap-to-select
// ---------------------------------------------------------------------------

function PoolChip({
  chip,
  selected,
  dragging,
  onSelect,
  onDragStart,
  onDragEnd,
}: {
  chip: ChipState;
  selected: boolean;
  dragging: boolean;
  onSelect: () => void;
  onDragStart: (e: React.DragEvent) => void;
  onDragEnd: () => void;
}) {
  return (
    <div
      id={domId.chip(chip.evidence.id)}
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
        <DragHandle className="h-3.5 w-3.5" /> Evidence {chip.evidence.n}
      </div>
      <p className="mt-1 max-w-xs text-caption text-ink">{chip.evidence.text}</p>
      {selected && <p className="mt-1.5 text-micro font-semibold text-accent">Tap an area to place it.</p>}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Placed chip — expanded with the three micro-inputs, check/clue, answer key
// ---------------------------------------------------------------------------

function PlacedChip({
  chip,
  dragging,
  selected,
  onSelectHeader,
  onRemove,
  onDragStart,
  onDragEnd,
}: {
  chip: ChipState;
  dragging: boolean;
  selected: boolean;
  onSelectHeader: () => void;
  onRemove: () => void;
  onDragStart: (e: React.DragEvent) => void;
  onDragEnd: () => void;
}) {
  const choose = useProgress((s) => s.choose);
  const setNote = useProgress((s) => s.setNote);
  const [result, setResult] = useState<CheckResult | null>(null);

  // An edit since the last check makes its verdict stale.
  useEffect(() => setResult(null), [chip.area]);

  const runCheck = () => {
    if (!chip.area) return;
    const nextCount = chip.checkCount + 1;
    setNote(R1.checkCount(chip.evidence.id), String(nextCount));
    setResult(checkChipPlacement(chip.evidence, chip.area, nextCount));
  };

  return (
    <div
      id={domId.chip(chip.evidence.id)}
      draggable
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      className={clsx(
        "scroll-mt-24 space-y-3 rounded-xl border p-3",
        dragging ? "is-dragging border-line bg-paper" : "border-line bg-paper",
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <div
          role="button"
          tabIndex={0}
          onClick={onSelectHeader}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              onSelectHeader();
            }
          }}
          className={clsx(
            "flex min-w-0 cursor-pointer items-start gap-1.5 rounded-lg px-1 py-0.5 -mx-1",
            selected && "bg-accentSoft ring-1 ring-accent/30",
          )}
        >
          <DragHandle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-ash" />
          <div className="min-w-0">
            <p className="text-micro font-semibold uppercase tracking-wide text-ash">Evidence {chip.evidence.n}</p>
            <p className="text-caption text-ink">{chip.evidence.text}</p>
            {selected && (
              <p className="mt-0.5 text-micro font-semibold text-accent">Selected — tap a different area to move it.</p>
            )}
          </div>
        </div>
        <button
          type="button"
          onClick={onRemove}
          className="shrink-0 whitespace-nowrap text-micro font-semibold text-ash transition-colors duration-150 hover:text-ink"
        >
          Move to pool
        </button>
      </div>

      {/* Check my classification */}
      <div className="space-y-1.5 rounded-lg border border-line bg-canvas p-2.5">
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={runCheck}
            className="rounded-lg border border-line bg-paper px-3 py-1.5 text-caption font-semibold text-ink transition-colors duration-150 hover:border-ash"
          >
            {chip.checkCount > 0 ? CHECK_LABELS.recheck : CHECK_LABELS.check}
          </button>
          {chip.checkCount > 0 && <span className="text-micro text-ash">checked {chip.checkCount}×</span>}
        </div>
        {result?.holds && <p className="reveal-in text-caption font-semibold text-accent">{CHECK_LABELS.holds}</p>}
        {result && !result.holds && (
          <div className="reveal-in space-y-1">
            <p className="text-caption text-ink">{result.tier === "sharp" ? CHECK_LABELS.wrongTier2 : CHECK_LABELS.wrongTier1}</p>
            <p className="rounded-lg border border-accent/25 bg-accentSoft px-2.5 py-1.5 text-caption text-ink">{result.clue}</p>
          </div>
        )}
      </div>

      {/* Root cause */}
      <div id={domId.chipRoot(chip.evidence.id)} className="scroll-mt-24">
        <p className="text-caption font-semibold text-ink">{ROOT_CAUSE_FIELD.label}</p>
        <p className="mt-0.5 text-micro text-ash">{ROOT_CAUSE_FIELD.instruction}</p>
        <div className="mt-1.5 flex flex-wrap gap-1.5">
          {ROOT_CAUSES.map((r) => {
            const on = chip.rootCause === r.id;
            return (
              <button
                key={r.id}
                type="button"
                title={r.hint}
                onClick={() => choose(R1.rootCause(chip.evidence.id), r.id)}
                aria-pressed={on}
                className={clsx(
                  "rounded-full border px-2.5 py-1 text-micro font-semibold transition-colors duration-150",
                  on ? "border-accent bg-accentSoft text-accent" : "border-line text-ash hover:border-ash",
                )}
              >
                {r.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Timeframe */}
      <div id={domId.chipTime(chip.evidence.id)} className="scroll-mt-24">
        <p className="text-caption font-semibold text-ink">{TIMEFRAME_FIELD.label}</p>
        <p className="mt-0.5 text-micro text-ash">{TIMEFRAME_FIELD.instruction}</p>
        <div className="mt-1.5 flex flex-wrap gap-1.5">
          {TIMEFRAMES.map((t) => {
            const on = chip.timeframe === t.id;
            return (
              <button
                key={t.id}
                type="button"
                title={t.hint}
                onClick={() => choose(R1.timeframe(chip.evidence.id), t.id)}
                aria-pressed={on}
                className={clsx(
                  "rounded-full border px-2.5 py-1 text-micro font-semibold transition-colors duration-150",
                  on ? "border-accent bg-accentSoft text-accent" : "border-line text-ash hover:border-ash",
                )}
              >
                {t.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Improvement approach */}
      <div id={domId.chipApproach(chip.evidence.id)} className="scroll-mt-24">
        <label htmlFor={`r1-approach-${chip.evidence.id}`} className="block text-caption font-semibold text-ink">
          {APPROACH_FIELD.label}
        </label>
        <p className="mt-0.5 text-micro text-ash">{APPROACH_FIELD.instruction}</p>
        <textarea
          id={`r1-approach-${chip.evidence.id}`}
          value={chip.approach}
          onChange={(e) => setNote(R1.approach(chip.evidence.id), e.target.value)}
          placeholder={APPROACH_FIELD.placeholder}
          rows={2}
          className="mt-1.5 w-full rounded-xl border border-line bg-paper px-3 py-2 text-caption text-ink"
        />
      </div>

      <AnswerKey block={chip.evidence.answerKey} />
    </div>
  );
}
