"use client";

import { useState } from "react";
import clsx from "clsx";
import { BINS, RECORDS, RECORD_BY_ID } from "@/data/kesslerDossier";
import type { Bin, RecordId } from "@/data/kesslerDossier";
import { flagsForSort } from "@/lib/checks";
import { IDS } from "@/lib/missing";
import { useStore } from "@/store/useStore";
import { UndoRedoControls } from "@/components/ui/UndoRedoControls";

/** A record token: ID + source + month. The full text lives in the record cards and the "selected record" strip. */
function Chip({
  id,
  selected,
  flagged,
  onSelect,
  onDragStart,
  onDragEnd,
  dragging,
}: {
  id: RecordId;
  selected: boolean;
  flagged: boolean;
  dragging: boolean;
  onSelect: () => void;
  onDragStart: (e: React.DragEvent) => void;
  onDragEnd: () => void;
}) {
  const r = RECORD_BY_ID[id];
  return (
    <button
      type="button"
      id={IDS.record(id)}
      draggable
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      onClick={onSelect}
      aria-pressed={selected}
      aria-label={`Record ${id}, ${r.source}, ${r.when}${flagged ? ", outlined by your last check" : ""}`}
      className={clsx(
        "flex w-full items-center gap-2 rounded-lg border bg-paper px-2.5 py-2 text-left transition-colors",
        selected ? "border-accent bg-accentSoft ring-2 ring-gold anim-pulse" : "border-line hover:border-ash",
        flagged && "is-flagged",
        dragging && "is-dragging",
      )}
    >
      <span className="rounded bg-ink px-1.5 py-0.5 text-micro font-bold text-paper">{id}</span>
      <span className="min-w-0">
        <span className="block truncate text-caption font-semibold leading-tight">{r.source}</span>
        <span className="block truncate text-micro normal-case tracking-normal text-ash">{r.when}</span>
      </span>
    </button>
  );
}

/**
 * Block 1.1 mechanics: five bins, eight records. Drag and drop with native
 * HTML5 events, or click-to-place (select a record, then a bin) for touch and
 * keyboard. Every placement is undoable.
 */
export function SortBoard({ onSelectedChange }: { onSelectedChange?: (id: RecordId | null) => void }) {
  const l1 = useStore((s) => s.l1);
  const placeRecord = useStore((s) => s.placeRecord);
  const undo = useStore((s) => s.undoPlacement);
  const redo = useStore((s) => s.redoPlacement);
  const checkSort = useStore((s) => s.checkSort);
  const showClue = useStore((s) => s.showL1Clue);

  const [selected, setSelectedState] = useState<RecordId | null>(null);
  const [dragging, setDragging] = useState<RecordId | null>(null);
  const [over, setOver] = useState<string | null>(null);
  const [lastCheck, setLastCheck] = useState<{ flagged: number; unplaced: number } | null>(null);

  const setSelected = (id: RecordId | null) => {
    setSelectedState(id);
    onSelectedChange?.(id);
  };

  const place = (id: RecordId, bin: Bin | null) => {
    placeRecord(id, bin);
    setSelected(null);
  };

  const unplaced = RECORDS.filter((r) => l1.placements[r.id] === null);
  const recFlags = l1.flagged.filter((f) => f in RECORD_BY_ID) as RecordId[];
  const sel = selected ? RECORD_BY_ID[selected] : null;

  const doCheck = () => {
    const flags = flagsForSort(l1);
    checkSort(flags);
    setLastCheck({
      flagged: flags.filter((f) => f in RECORD_BY_ID).length,
      unplaced: RECORDS.filter((r) => l1.placements[r.id] === null).length,
    });
  };

  const dropOn = (bin: Bin | null) => (e: React.DragEvent) => {
    e.preventDefault();
    const id = (e.dataTransfer.getData("text/plain") || dragging) as RecordId | null;
    setOver(null);
    setDragging(null);
    if (id && id in RECORD_BY_ID) place(id, bin);
  };
  const dragOn = (key: string) => (e: React.DragEvent) => {
    e.preventDefault();
    setOver(key);
  };

  const chipProps = (id: RecordId) => ({
    id,
    selected: selected === id,
    flagged: recFlags.includes(id),
    dragging: dragging === id,
    onSelect: () => setSelected(selected === id ? null : id),
    onDragStart: (e: React.DragEvent) => {
      e.dataTransfer.setData("text/plain", id);
      e.dataTransfer.effectAllowed = "move";
      setDragging(id);
    },
    onDragEnd: () => {
      setDragging(null);
      setOver(null);
    },
  });

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-caption text-ash">
          Drag a record into a bin, or select it and then select a bin. Select a placed record to move it again.
        </p>
        <UndoRedoControls onUndo={undo} onRedo={redo} undoCount={l1.history.length} redoCount={l1.future.length} />
      </div>

      {/* tray */}
      <div
        onDragOver={dragOn("tray")}
        onDragLeave={() => setOver(null)}
        onDrop={dropOn(null)}
        className={clsx("rounded-lg border border-dashed border-ash/60 bg-mist/60 p-3", over === "tray" && "is-drop-target")}
      >
        <div className="mb-2 flex items-center justify-between gap-2">
          <p className="smallcaps">Records not placed ({unplaced.length})</p>
          {selected && l1.placements[selected] !== null && (
            <button type="button" onClick={() => place(selected, null)} className="btn-ghost btn-sm">
              Return {selected} to this tray
            </button>
          )}
        </div>
        {unplaced.length === 0 ? (
          <p className="text-caption text-ash">Every record is in a bin.</p>
        ) : (
          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
            {unplaced.map((r) => (
              <Chip key={r.id} {...chipProps(r.id)} />
            ))}
          </div>
        )}
      </div>

      {/* selected record — read it without leaving the bins */}
      <div aria-live="polite" className="min-h-[3rem]">
        {sel ? (
          <div className="fade-in rounded-lg border border-accent/50 bg-accentSoft p-3 text-caption">
            <p className="font-semibold">
              {sel.id} · {sel.source} · {sel.when}
            </p>
            <p className="mt-1 text-ink">{sel.text}</p>
            <p className="mt-1 text-ash">Record on file: {sel.onFile}</p>
          </div>
        ) : (
          <p className="text-caption text-ash">Select a record to read it here, then select a bin to file it.</p>
        )}
      </div>

      {/* bins */}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
        {BINS.map((b) => {
          const inBin = RECORDS.filter((r) => l1.placements[r.id] === b.id);
          return (
            <div
              key={b.id}
              id={IDS.bin(b.id)}
              onDragOver={dragOn(b.id)}
              onDragLeave={() => setOver(null)}
              onDrop={dropOn(b.id)}
              className={clsx(
                "flex min-h-[9rem] flex-col rounded-lg border bg-paper p-2.5",
                b.id === "interpretation" ? "border-dashed border-ash" : "border-line",
                over === b.id && "is-drop-target",
              )}
            >
              <button
                type="button"
                onClick={() => selected && place(selected, b.id)}
                aria-label={selected ? `Place ${selected} in ${b.label}` : `${b.label} bin. Select a record first.`}
                className={clsx(
                  "mb-2 rounded-md border px-2 py-1.5 text-left transition-colors",
                  selected ? "border-accent bg-accentSoft hover:bg-gold/30" : "border-transparent bg-mist",
                )}
              >
                <span className="block text-caption font-bold leading-tight">{b.label}</span>
                <span className="mt-0.5 block text-micro normal-case leading-snug tracking-normal text-ash">{b.definition}</span>
              </button>
              <div className="space-y-1.5">
                {inBin.map((r) => (
                  <Chip key={r.id} {...chipProps(r.id)} />
                ))}
              </div>
              {inBin.length === 0 && <p className="mt-auto pt-2 text-micro normal-case tracking-normal text-ash">Empty</p>}
            </div>
          );
        })}
      </div>

      {/* check */}
      <div className="space-y-3 border-t border-line pt-3">
        <div className="flex flex-wrap items-center gap-3">
          <button type="button" onClick={doCheck} className="btn-primary">
            Check my sort
          </button>
          <span className="text-caption text-ash">
            Checks requested: <span className="tnum font-semibold text-ink">{l1.checks}</span>
          </span>
          <span className="text-caption text-ash">Counted, not punished. It only outlines; it never gives the bin.</span>
        </div>
        {lastCheck && (
          <p role="status" className="text-caption text-ink">
            {lastCheck.flagged === 0
              ? "No placed record is outlined."
              : `${lastCheck.flagged} placed ${lastCheck.flagged === 1 ? "record is" : "records are"} outlined in amber.`}
            {lastCheck.unplaced > 0 && ` ${lastCheck.unplaced} not placed yet, so not checked.`}
          </p>
        )}
        {recFlags.length > 0 && (
          <ul className="space-y-2">
            {recFlags.map((id) => (
              <li key={id} className="fade-in flex flex-wrap items-start gap-2 text-caption">
                <span className="is-flagged rounded bg-ink px-1.5 py-0.5 text-micro font-bold text-paper">{id}</span>
                {l1.clueShown[id] ? (
                  <p role="status" className="min-w-0 flex-1 rounded-md border border-gold bg-accentSoft px-3 py-1.5">
                    <span className="smallcaps mr-1 text-accent">Clue</span>
                    {RECORD_BY_ID[id].clue}
                  </p>
                ) : (
                  <button type="button" onClick={() => showClue(id)} className="btn-ghost btn-sm border-gold">
                    Show clue for {id}
                  </button>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
