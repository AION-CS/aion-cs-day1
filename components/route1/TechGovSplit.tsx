"use client";

import { useRef, useState } from "react";
import clsx from "clsx";
import { useProgress } from "@/lib/store";
import { R1, SPLIT_ITEMS, type Side, type SplitItem } from "@/lib/route1";
import { useRoute1 } from "./useRoute1";
import { useStageDStore, type Placements } from "./useStageDStore";
import { ClueToggle } from "@/components/ui/ClueToggle";

const DRAG_THRESHOLD = 6;

type Handlers = {
  selectedId: string | null;
  draggingId: string | null;
  onPointerDown: (e: React.PointerEvent<HTMLButtonElement>, id: string) => void;
  onPointerMove: (e: React.PointerEvent<HTMLButtonElement>) => void;
  onPointerUp: (e: React.PointerEvent<HTMLButtonElement>, id: string) => void;
  onItemClick: (id: string) => void;
};

function snapshotOf(placement: Record<string, Side | undefined>): Placements {
  const snap: Placements = {};
  for (const it of SPLIT_ITEMS) snap[it.id] = placement[it.id] ?? null;
  return snap;
}

/**
 * Stage D — drag (native pointer events) or tap-then-tap-a-zone; full undo/redo
 * history. The *current* placement always comes from the persisted progress
 * store via useRoute1 (same source of truth as every other stage) — this
 * component only adds an undo/redo history of snapshots on top of it.
 */
export function TechGovSplit() {
  const r1 = useRoute1();
  const choose = useProgress((s) => s.choose);

  const past = useStageDStore((s) => s.past);
  const future = useStageDStore((s) => s.future);
  const recordChange = useStageDStore((s) => s.recordChange);
  const storeUndo = useStageDStore((s) => s.undo);
  const storeRedo = useStageDStore((s) => s.redo);

  const placements = r1.stageDPlacement;

  const applySnapshot = (snap: Placements) => {
    for (const it of SPLIT_ITEMS) {
      const v = snap[it.id] ?? "";
      choose(R1.stageD.placement(it.id), v as string);
    }
  };

  const place = (itemId: string, side: Side | null) => {
    recordChange(snapshotOf(placements));
    choose(R1.stageD.placement(itemId), (side ?? "") as string);
  };

  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [dragPos, setDragPos] = useState<{ x: number; y: number } | null>(null);
  const downRef = useRef<{ id: string; x: number; y: number } | null>(null);
  const wasDragRef = useRef(false);
  const [shake, setShake] = useState<"undo" | "redo" | null>(null);

  const placedCount = SPLIT_ITEMS.filter((it) => placements[it.id]).length;
  const selectedItem = SPLIT_ITEMS.find((it) => it.id === selectedId) ?? null;

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
      if (zone === "technical" || zone === "governance") {
        place(id, zone);
        setSelectedId(null);
      } else if (zone === "pool") {
        place(id, null);
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
    const current = placements[id];
    if (current) {
      place(id, null);
      setSelectedId(id);
      return;
    }
    setSelectedId((cur) => (cur === id ? null : id));
  };

  const onZoneClick = (zone: Side) => {
    if (!selectedId) return;
    place(selectedId, zone);
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

  const pool = SPLIT_ITEMS.filter((it) => !placements[it.id]);
  const zoneItems = (side: Side) => SPLIT_ITEMS.filter((it) => placements[it.id] === side);
  const draggingItem = SPLIT_ITEMS.find((it) => it.id === draggingId);

  const handlers: Handlers = {
    selectedId,
    draggingId,
    onPointerDown: onPointerDownItem,
    onPointerMove: onPointerMoveItem,
    onPointerUp: onPointerUpItem,
    onItemClick,
  };

  return (
    <div>
      <div className="flex items-baseline justify-between gap-3">
        <p className="text-caption text-ash">Drag an item, or tap it then tap a zone.</p>
        <p className="text-caption tabular-nums text-ash">
          Placed: <span className="font-semibold text-ink">{placedCount}</span> / {SPLIT_ITEMS.length}
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
        {selectedItem && <span className="text-micro text-ash">Selected — tap a zone below to place it.</span>}
      </div>

      {selectedItem && <ClueToggle clue={selectedItem.clue} />}

      <div data-dropzone="pool" className="mt-3 flex min-h-[64px] flex-wrap gap-2 rounded-xl border border-dashed border-line bg-canvas p-3">
        {pool.length === 0 && <p className="text-micro text-ash">All items placed.</p>}
        {pool.map((it) => (
          <Chip key={it.id} item={it} placed={false} handlers={handlers} />
        ))}
      </div>

      <div className="mt-3 grid gap-3 sm:grid-cols-2">
        <Zone label="Technical Topic" side="technical" items={zoneItems("technical")} onZoneClick={onZoneClick} handlers={handlers} />
        <Zone label="Management & Governance Topic" side="governance" items={zoneItems("governance")} onZoneClick={onZoneClick} handlers={handlers} />
      </div>

      {draggingItem && dragPos && wasDragRef.current && (
        <div
          className="pointer-events-none fixed z-50 max-w-[220px] -translate-x-1/2 -translate-y-1/2 rounded-lg border border-accent bg-paper px-2.5 py-1.5 text-micro font-semibold text-ink shadow-lg"
          style={{ left: dragPos.x, top: dragPos.y }}
        >
          {draggingItem.text}
        </div>
      )}
    </div>
  );
}

function Chip({ item, placed, handlers }: { item: SplitItem; placed: boolean; handlers: Handlers }) {
  const selected = handlers.selectedId === item.id;
  const dragging = handlers.draggingId === item.id;
  return (
    <button
      type="button"
      onPointerDown={(e) => handlers.onPointerDown(e, item.id)}
      onPointerMove={handlers.onPointerMove}
      onPointerUp={(e) => handlers.onPointerUp(e, item.id)}
      onClick={(e) => {
        e.stopPropagation();
        handlers.onItemClick(item.id);
      }}
      className={clsx(
        "max-w-[260px] touch-none rounded-lg border px-2.5 py-1.5 text-left text-micro font-medium transition-colors duration-150",
        dragging ? "opacity-40" : selected ? "border-accent bg-accentSoft text-ink" : "border-line bg-paper text-ink hover:border-ash",
        placed && "pr-1.5",
      )}
    >
      {item.text}
      {placed && <span className="ml-1.5 text-ash">· tap to remove</span>}
    </button>
  );
}

function Zone({
  label,
  side,
  items,
  onZoneClick,
  handlers,
}: {
  label: string;
  side: Side;
  items: SplitItem[];
  onZoneClick: (side: Side) => void;
  handlers: Handlers;
}) {
  return (
    <div
      data-dropzone={side}
      onClick={() => onZoneClick(side)}
      className={clsx(
        "min-h-[120px] space-y-1.5 rounded-xl border p-3",
        handlers.selectedId ? "border-accent/50 bg-accentSoft/40 cursor-pointer" : "border-line",
      )}
    >
      <p className="text-micro font-semibold uppercase tracking-wide text-ash">{label}</p>
      <div className="flex flex-wrap gap-1.5">
        {items.map((it) => (
          <Chip key={it.id} item={it} placed handlers={handlers} />
        ))}
      </div>
    </div>
  );
}
