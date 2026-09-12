"use client";

import { useRef, useState } from "react";
import clsx from "clsx";
import { useProgress } from "@/lib/store";
import {
  R1,
  FINDINGS,
  CATEGORIES,
  ZONES,
  CATEGORY_KEY_SUMMARY,
  type CategoryId,
  type Finding,
} from "@/lib/route1";
import { useRoute1 } from "./useRoute1";
import { useFindingSortStore, type SortPlacements } from "./useFindingSortStore";
import { ClueToggle } from "@/components/ui/ClueToggle";
import { AnswerKeyNote } from "@/components/ui/AnswerKey";

const DRAG_THRESHOLD = 6;

type Handlers = {
  selectedId: string | null;
  draggingId: string | null;
  onPointerDown: (e: React.PointerEvent<HTMLButtonElement>, id: string) => void;
  onPointerMove: (e: React.PointerEvent<HTMLButtonElement>) => void;
  onPointerUp: (e: React.PointerEvent<HTMLButtonElement>, id: string) => void;
  onItemClick: (id: string) => void;
};

const letterOf = (zoneId: string) => ZONES.find((z) => z.id === zoneId)?.letter ?? "?";

function snapshotOf(placement: Record<string, CategoryId | undefined>): SortPlacements {
  const snap: SortPlacements = {};
  for (const f of FINDINGS) snap[f.id] = placement[f.id] ?? null;
  return snap;
}

/**
 * Stage 1b — drag (native pointer events) or tap-then-tap-an-area, with full
 * undo/redo. Nothing is validated on drop: the learner gets a clue on request,
 * never a verdict.
 */
export function FindingSort() {
  const r1 = useRoute1();
  const choose = useProgress((s) => s.choose);

  const past = useFindingSortStore((s) => s.past);
  const future = useFindingSortStore((s) => s.future);
  const recordChange = useFindingSortStore((s) => s.recordChange);
  const storeUndo = useFindingSortStore((s) => s.undo);
  const storeRedo = useFindingSortStore((s) => s.redo);

  const placements = r1.category;
  const available = r1.loggedFindings;

  const applySnapshot = (snap: SortPlacements) => {
    for (const f of FINDINGS) choose(R1.stage1.category(f.id), (snap[f.id] ?? "") as string);
  };

  const place = (findingId: string, category: CategoryId | null) => {
    recordChange(snapshotOf(placements));
    choose(R1.stage1.category(findingId), (category ?? "") as string);
  };

  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [dragPos, setDragPos] = useState<{ x: number; y: number } | null>(null);
  const downRef = useRef<{ id: string; x: number; y: number } | null>(null);
  const wasDragRef = useRef(false);
  const [shake, setShake] = useState<"undo" | "redo" | null>(null);

  const selectedFinding = available.find((f) => f.id === selectedId) ?? null;

  const onPointerDownItem = (e: React.PointerEvent<HTMLButtonElement>, id: string) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    downRef.current = { id, x: e.clientX, y: e.clientY };
    wasDragRef.current = false;
    setDraggingId(id);
    setDragPos({ x: e.clientX, y: e.clientY });
  };

  const onPointerMoveItem = (e: React.PointerEvent<HTMLButtonElement>) => {
    if (!downRef.current) return;
    const dx = e.clientX - downRef.current.x;
    const dy = e.clientY - downRef.current.y;
    if (Math.hypot(dx, dy) > DRAG_THRESHOLD) wasDragRef.current = true;
    setDragPos({ x: e.clientX, y: e.clientY });
  };

  const onPointerUpItem = (e: React.PointerEvent<HTMLButtonElement>, id: string) => {
    if (wasDragRef.current) {
      const target = document.elementFromPoint(e.clientX, e.clientY);
      const zoneEl = target?.closest<HTMLElement>("[data-dropzone]");
      const zone = zoneEl?.getAttribute("data-dropzone");
      if (zone === "pool") {
        place(id, null);
      } else if (zone && CATEGORIES.some((c) => c.id === zone)) {
        place(id, zone as CategoryId);
        setSelectedId(null);
      }
    }
    setDraggingId(null);
    setDragPos(null);
    downRef.current = null;
  };

  const onItemClick = (id: string) => {
    if (wasDragRef.current) {
      wasDragRef.current = false;
      return;
    }
    if (placements[id]) {
      place(id, null);
      setSelectedId(id);
      return;
    }
    setSelectedId((cur) => (cur === id ? null : id));
  };

  const onZoneClick = (category: CategoryId) => {
    if (!selectedId) return;
    place(selectedId, category);
    setSelectedId(null);
  };

  const triggerShake = (which: "undo" | "redo") => {
    setShake(which);
    window.setTimeout(() => setShake(null), 350);
  };

  const handleUndo = () => {
    const prev = storeUndo(snapshotOf(placements));
    if (!prev) {
      triggerShake("undo");
      return;
    }
    applySnapshot(prev);
  };

  const handleRedo = () => {
    const next = storeRedo(snapshotOf(placements));
    if (!next) {
      triggerShake("redo");
      return;
    }
    applySnapshot(next);
  };

  const pool = available.filter((f) => !placements[f.id]);
  const inCategory = (category: CategoryId) => available.filter((f) => placements[f.id] === category);
  const draggingFinding = available.find((f) => f.id === draggingId);

  const handlers: Handlers = {
    selectedId,
    draggingId,
    onPointerDown: onPointerDownItem,
    onPointerMove: onPointerMoveItem,
    onPointerUp: onPointerUpItem,
    onItemClick,
  };

  if (available.length === 0) {
    return (
      <p className="rounded-xl border border-dashed border-line bg-canvas p-4 text-caption text-ash">
        Nothing to sort yet — investigate the rooms above and your findings will appear here.
      </p>
    );
  }

  return (
    <div>
      <div className="flex items-baseline justify-between gap-3">
        <p className="text-caption text-ash">Drag a finding onto an area, or tap it then tap an area.</p>
        <p className="text-caption tabular-nums text-ash">
          Sorted: <span className="font-semibold text-ink">{r1.sortedCount}</span> / {FINDINGS.length}
        </p>
      </div>

      <div className="mt-2 flex items-center gap-2">
        <button
          type="button"
          onClick={handleUndo}
          className={clsx(
            "rounded-lg border px-3 py-1.5 text-micro font-semibold transition-colors duration-150",
            past.length === 0 ? "border-line text-ash/50" : "border-line text-ink hover:border-ash",
            shake === "undo" && "anim-shake-noop",
          )}
        >
          ↶ Undo
        </button>
        <button
          type="button"
          onClick={handleRedo}
          className={clsx(
            "rounded-lg border px-3 py-1.5 text-micro font-semibold transition-colors duration-150",
            future.length === 0 ? "border-line text-ash/50" : "border-line text-ink hover:border-ash",
            shake === "redo" && "anim-shake-noop",
          )}
        >
          ↷ Redo
        </button>
        {selectedFinding && <span className="text-micro text-ash">Selected — tap an area below to place it.</span>}
      </div>

      {selectedFinding && <ClueToggle clue={selectedFinding.categoryClue} />}

      <div
        data-dropzone="pool"
        className="mt-3 flex min-h-[56px] flex-wrap gap-2 rounded-xl border border-dashed border-line bg-canvas p-3"
      >
        {pool.length === 0 && <p className="text-micro text-ash">All findings placed.</p>}
        {pool.map((f) => (
          <Chip key={f.id} finding={f} placed={false} handlers={handlers} />
        ))}
      </div>

      <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {CATEGORIES.map((c) => (
          <div
            key={c.id}
            data-dropzone={c.id}
            onClick={() => onZoneClick(c.id)}
            className={clsx(
              "min-h-[116px] rounded-xl border p-3",
              selectedId ? "cursor-pointer border-accent/50 bg-accentSoft/40" : "border-line",
            )}
          >
            <p className="text-caption font-semibold text-ink">{c.label}</p>
            <p className="mt-0.5 text-micro text-ash">{c.hint}</p>
            <div className="mt-2 space-y-1.5">
              {inCategory(c.id).map((f) => (
                <Chip key={f.id} finding={f} placed handlers={handlers} />
              ))}
            </div>
          </div>
        ))}
      </div>

      <AnswerKeyNote label="Correct area per finding" text={CATEGORY_KEY_SUMMARY} />

      {draggingFinding && dragPos && wasDragRef.current && (
        <div
          className="pointer-events-none fixed z-50 max-w-[240px] -translate-x-1/2 -translate-y-1/2 rounded-lg border border-accent bg-paper px-2.5 py-1.5 text-micro font-semibold text-ink shadow-lg"
          style={{ left: dragPos.x, top: dragPos.y }}
        >
          {draggingFinding.short}
        </div>
      )}
    </div>
  );
}

function Chip({ finding, placed, handlers }: { finding: Finding; placed: boolean; handlers: Handlers }) {
  const selected = handlers.selectedId === finding.id;
  const dragging = handlers.draggingId === finding.id;
  return (
    <button
      type="button"
      onPointerDown={(e) => handlers.onPointerDown(e, finding.id)}
      onPointerMove={handlers.onPointerMove}
      onPointerUp={(e) => handlers.onPointerUp(e, finding.id)}
      onClick={(e) => {
        e.stopPropagation();
        handlers.onItemClick(finding.id);
      }}
      className={clsx(
        "flex w-full max-w-[280px] touch-none items-start gap-1.5 rounded-lg border px-2 py-1.5 text-left text-micro font-medium transition-colors duration-150",
        dragging
          ? "opacity-40"
          : selected
            ? "border-accent bg-accentSoft text-ink"
            : "border-line bg-paper text-ink hover:border-ash",
      )}
    >
      <span className="mt-[1px] flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-mist text-[9px] font-semibold text-ash">
        {letterOf(finding.zoneId)}
      </span>
      <span className="flex-1">
        {finding.short}
        {placed && <span className="ml-1 text-ash">· tap to remove</span>}
      </span>
    </button>
  );
}
