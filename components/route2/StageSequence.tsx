"use client";

import { useState } from "react";
import clsx from "clsx";
import { useProgress } from "@/lib/store";
import { createPlacementHistory, type PlacementMap } from "@/lib/usePlacementHistory";
import { undoRedoKeyHandler } from "@/lib/undoShortcuts";
import { UndoRedoControls } from "@/components/ui/UndoRedoControls";
import { MaterialRefs } from "@/components/ui/MaterialRefs";
import { CheckVerdict } from "@/components/ui/CheckVerdict";
import { DragHandle } from "@/components/icons/LineIcons";
import { CHECK_LABELS, FIRST_MOVE_FIELD, LAYERS, R2, SEQUENCE_INSTRUCTION, SEQUENCE_POSITIONS, materialRefs, type LayerId, type SequencePosition } from "@/lib/route2";
import { useRoute2, domId, positionSlotId, layerCardId } from "./useRoute2";

/**
 * Stage C — drag the three layers into staffing/funding order (native drag
 * plus tap-to-select fallback, undo/redo). Check-on-request compares the
 * whole order against D2's dependency logic and returns a clue only, never
 * revealing the order itself.
 */
export function StageSequence() {
  const r2 = useRoute2();
  const choose = useProgress((s) => s.choose);
  const setNote = useProgress((s) => s.setNote);

  const [useHistory] = useState(() => createPlacementHistory());
  const past = useHistory((s) => s.past);
  const future = useHistory((s) => s.future);
  const recordChange = useHistory((s) => s.recordChange);
  const doUndo = useHistory((s) => s.undo);
  const doRedo = useHistory((s) => s.redo);

  const [selectedId, setSelectedId] = useState<LayerId | null>(null);
  const [draggingId, setDraggingId] = useState<LayerId | null>(null);
  const [overSlot, setOverSlot] = useState<SequencePosition | "pool" | null>(null);
  const [checkResultSig, setCheckResultSig] = useState<string | null>(null);

  const currentMap = (): PlacementMap => Object.fromEntries(LAYERS.map((l) => [l.id, r2.sequence[l.id] ? String(r2.sequence[l.id]) : null]));
  const applyMap = (map: PlacementMap) => {
    for (const l of LAYERS) choose(R2.sequence(l.id), map[l.id] ?? "");
  };

  const place = (layerId: LayerId, position: SequencePosition | null) => {
    if (r2.sequence[layerId] === position) return;
    recordChange(currentMap());
    // A position already held by another layer is bumped back to unplaced.
    if (position) {
      const occupant = LAYERS.find((l) => l.id !== layerId && r2.sequence[l.id] === position);
      if (occupant) choose(R2.sequence(occupant.id), "");
    }
    choose(R2.sequence(layerId), position ? String(position) : "");
  };

  const handleUndo = () => {
    const prev = doUndo(currentMap());
    if (prev) applyMap(prev);
  };
  const handleRedo = () => {
    const next = doRedo(currentMap());
    if (next) applyMap(next);
  };

  const startDrag = (e: React.DragEvent, id: LayerId) => {
    e.dataTransfer.setData("text/plain", id);
    setDraggingId(id);
  };
  const endDrag = () => setDraggingId(null);
  const dropOn = (position: SequencePosition | null) => (e: React.DragEvent) => {
    e.preventDefault();
    const id = e.dataTransfer.getData("text/plain") as LayerId;
    setOverSlot(null);
    if (id) place(id, position);
  };
  const tapPlace = (position: SequencePosition | null) => () => {
    if (!selectedId) return;
    place(selectedId, position);
    setSelectedId(null);
  };

  const unplaced = LAYERS.filter((l) => !r2.sequence[l.id]);

  const runCheck = () => {
    const nextCount = r2.checkCountSeq + 1;
    setNote(R2.checkCountSeq, String(nextCount));
    setCheckResultSig(`${JSON.stringify(r2.sequence)}|${nextCount}`);
  };
  const result = checkResultSig === `${JSON.stringify(r2.sequence)}|${r2.checkCountSeq}` ? r2.lastSeqCheck : null;

  return (
    <div id={domId.sequenceBoard} tabIndex={-1} onKeyDown={undoRedoKeyHandler(handleUndo, handleRedo)} className="scroll-mt-24 space-y-4">
      <p className="max-w-prose text-caption text-ash">{SEQUENCE_INSTRUCTION}</p>
      <MaterialRefs refs={materialRefs(["layeredModel"])} />
      <div className="flex items-center justify-between gap-3">
        <p className="text-micro text-ash">
          <span className="font-semibold tabular-nums text-ink">{r2.sequencedCount}</span> of {LAYERS.length} sequenced
        </p>
        <UndoRedoControls onUndo={handleUndo} onRedo={handleRedo} canUndo={past.length > 0} canRedo={future.length > 0} />
      </div>

      <div
        onDragOver={(e) => {
          e.preventDefault();
          setOverSlot("pool");
        }}
        onDragLeave={() => setOverSlot((cur) => (cur === "pool" ? null : cur))}
        onDrop={dropOn(null)}
        onClick={tapPlace(null)}
        className={clsx("rounded-2xl border border-dashed p-4 transition-colors duration-150", overSlot === "pool" ? "is-drop-target" : "border-line bg-canvas", selectedId && "cursor-pointer")}
      >
        <p className="text-micro font-semibold uppercase tracking-wide text-ash">Not yet sequenced — drag, or tap then tap a position</p>
        {unplaced.length === 0 ? (
          <p className="mt-1.5 text-caption text-ash">All three are placed. Drag one back here, or tap it, to resequence.</p>
        ) : (
          <div className="mt-2.5 flex flex-wrap gap-2">
            {unplaced.map((l) => (
              <LayerCard key={l.id} layerId={l.id} dragging={draggingId === l.id} selected={selectedId === l.id} onSelect={() => setSelectedId((cur) => (cur === l.id ? null : l.id))} onDragStart={(e) => startDrag(e, l.id)} onDragEnd={endDrag} />
            ))}
          </div>
        )}
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        {SEQUENCE_POSITIONS.map((pos) => {
          const layer = LAYERS.find((l) => r2.sequence[l.id] === pos);
          return (
            <div
              key={pos}
              id={positionSlotId(pos)}
              onDragOver={(e) => {
                e.preventDefault();
                setOverSlot(pos);
              }}
              onDragLeave={() => setOverSlot((cur) => (cur === pos ? null : cur))}
              onDrop={dropOn(pos)}
              onClick={selectedId ? tapPlace(pos) : undefined}
              className={clsx("scroll-mt-24 card space-y-2 p-3 transition-colors duration-150", overSlot === pos && "is-drop-target", selectedId && "cursor-pointer")}
            >
              <p className="text-micro font-semibold uppercase tracking-wide text-ash">Position {pos}{pos === 1 ? " — first" : pos === 3 ? " — last" : ""}</p>
              {layer ? (
                <LayerCard layerId={layer.id} dragging={draggingId === layer.id} selected={selectedId === layer.id} onSelect={() => setSelectedId((cur) => (cur === layer!.id ? null : layer!.id))} onDragStart={(e) => startDrag(e, layer!.id)} onDragEnd={endDrag} />
              ) : (
                <p className="rounded-lg border border-dashed border-line bg-canvas px-2.5 py-2 text-micro italic text-ash">Drop, or tap a selected stage here.</p>
              )}
            </div>
          );
        })}
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <button type="button" onClick={runCheck} disabled={!r2.sequenceComplete} className="rounded-lg border border-line bg-canvas px-3 py-1.5 text-caption font-semibold text-ink transition-colors duration-150 hover:border-ash disabled:cursor-not-allowed disabled:opacity-50">
          {r2.checkCountSeq > 0 ? CHECK_LABELS.recheck : CHECK_LABELS.check}
        </button>
        {!r2.sequenceComplete && <span className="text-micro text-ash">Place all three stages first.</span>}
        {r2.checkCountSeq > 0 && <span className="text-micro text-ash">checked {r2.checkCountSeq}×</span>}
      </div>
      <CheckVerdict result={result} holdsLabel={CHECK_LABELS.holds} notYetLabel={result && !result.holds && result.tier === "sharp" ? CHECK_LABELS.wrongTier2 : CHECK_LABELS.wrongTier1} />

      <div id={domId.firstMove} className="scroll-mt-24">
        <label htmlFor="r2-first-move-field" className="block text-caption font-semibold text-ink">
          {FIRST_MOVE_FIELD.label}
        </label>
        <p className="mt-0.5 text-micro text-ash">{FIRST_MOVE_FIELD.instruction}</p>
        <MaterialRefs refs={materialRefs(FIRST_MOVE_FIELD.material)} />
        <textarea
          id="r2-first-move-field"
          value={r2.firstMove}
          onChange={(e) => setNote(R2.firstMove, e.target.value)}
          placeholder={FIRST_MOVE_FIELD.placeholder}
          rows={2}
          className="mt-1.5 w-full rounded-xl border border-line bg-paper px-3 py-2 text-caption text-ink"
        />
      </div>
    </div>
  );
}

function LayerCard({
  layerId,
  dragging,
  selected,
  onSelect,
  onDragStart,
  onDragEnd,
}: {
  layerId: LayerId;
  dragging: boolean;
  selected: boolean;
  onSelect: () => void;
  onDragStart: (e: React.DragEvent) => void;
  onDragEnd: () => void;
}) {
  const layer = LAYERS.find((l) => l.id === layerId)!;
  return (
    <div
      id={layerCardId(layerId)}
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
        "w-full max-w-xs cursor-grab select-none rounded-xl border p-2.5 text-left transition-colors duration-150",
        dragging && "is-dragging",
        selected ? "border-accent bg-accentSoft ring-2 ring-accent/30" : "border-line bg-paper hover:border-ash",
      )}
    >
      <div className="flex items-center gap-1.5 text-micro font-semibold uppercase tracking-wide text-ash">
        <DragHandle className="h-3.5 w-3.5" /> {layer.name}
      </div>
      <p className="mt-0.5 text-micro text-ink">{layer.description}</p>
      <p className="mt-1 text-micro text-ash">
        <span className="font-semibold text-ink">Needs: </span>
        {layer.needs}
      </p>
    </div>
  );
}
