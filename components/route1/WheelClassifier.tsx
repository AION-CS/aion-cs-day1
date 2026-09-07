"use client";

import { useMemo, useRef, useState } from "react";
import clsx from "clsx";
import { useProgress } from "@/lib/store";
import { R1, EVIDENCE_ITEMS, DIMENSIONS, type DimensionId, type EvidenceItem } from "@/lib/route1";
import { useRoute1 } from "./useRoute1";
import { useWheelStore, type WheelPlacements } from "./useWheelStore";
import { ClueToggle } from "@/components/ui/ClueToggle";
import { DimensionWheel } from "./DimensionWheel";

const DRAG_THRESHOLD = 6;

type Handlers = {
  selectedId: string | null;
  draggingId: string | null;
  onPointerDown: (e: React.PointerEvent<HTMLButtonElement>, id: string) => void;
  onPointerMove: (e: React.PointerEvent<HTMLButtonElement>) => void;
  onPointerUp: (e: React.PointerEvent<HTMLButtonElement>, id: string) => void;
  onItemClick: (id: string) => void;
};

function snapshotOf(placement: Record<string, DimensionId | undefined>): WheelPlacements {
  const snap: WheelPlacements = {};
  for (const it of EVIDENCE_ITEMS) snap[it.id] = placement[it.id] ?? null;
  return snap;
}

/**
 * Stage 3 — same drag-or-tap mechanic as Stage 2/Day 7's Technical vs.
 * Governance split, generalised from 2 zones to the wheel's 6 dimensions.
 * The wheel SVG is a live visual (per-dimension counts) and a valid drop
 * target itself; the zone list below it is the same target set, rendered as
 * plain HTML so each card stays readable and individually removable.
 */
export function WheelClassifier() {
  const r1 = useRoute1();
  const choose = useProgress((s) => s.choose);

  const past = useWheelStore((s) => s.past);
  const future = useWheelStore((s) => s.future);
  const recordChange = useWheelStore((s) => s.recordChange);
  const storeUndo = useWheelStore((s) => s.undo);
  const storeRedo = useWheelStore((s) => s.redo);

  const placements = r1.stage3Dimension;

  const applySnapshot = (snap: WheelPlacements) => {
    for (const it of EVIDENCE_ITEMS) {
      const v = snap[it.id] ?? "";
      choose(R1.stage3.dimension(it.id), v as string);
    }
  };

  const place = (itemId: string, dim: DimensionId | null) => {
    recordChange(snapshotOf(placements));
    choose(R1.stage3.dimension(itemId), (dim ?? "") as string);
  };

  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [dragPos, setDragPos] = useState<{ x: number; y: number } | null>(null);
  const downRef = useRef<{ id: string; x: number; y: number } | null>(null);
  const wasDragRef = useRef(false);
  const [shake, setShake] = useState<"undo" | "redo" | null>(null);

  const placedCount = EVIDENCE_ITEMS.filter((it) => placements[it.id]).length;
  const selectedItem = EVIDENCE_ITEMS.find((it) => it.id === selectedId) ?? null;

  const dimensionIds = useMemo(() => DIMENSIONS.map((d) => d.id), []);

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
      if (zone && (dimensionIds as string[]).includes(zone)) {
        place(id, zone as DimensionId);
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

  const onZoneClick = (dim: DimensionId) => {
    if (!selectedId) return;
    place(selectedId, dim);
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

  const pool = EVIDENCE_ITEMS.filter((it) => !placements[it.id]);
  const zoneItems = (dim: DimensionId) => EVIDENCE_ITEMS.filter((it) => placements[it.id] === dim);
  const draggingItem = EVIDENCE_ITEMS.find((it) => it.id === draggingId);

  const counts = useMemo(() => {
    const c: Partial<Record<DimensionId, number>> = {};
    for (const d of DIMENSIONS) c[d.id] = zoneItems(d.id).length;
    return c;
  }, [placements]);

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
        <p className="text-caption text-ash">Drag a card onto the wheel, or tap it then tap a segment.</p>
        <p className="text-caption tabular-nums text-ash">
          Placed: <span className="font-semibold text-ink">{placedCount}</span> / {EVIDENCE_ITEMS.length}
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
        {selectedItem && <span className="text-micro text-ash">Selected — tap the wheel or a list below to place it.</span>}
      </div>

      {selectedItem && <ClueToggle clue={selectedItem.dimensionClue} />}

      <div data-dropzone="pool" className="mt-3 flex min-h-[64px] flex-wrap gap-2 rounded-xl border border-dashed border-line bg-canvas p-3">
        {pool.length === 0 && <p className="text-micro text-ash">All cards placed.</p>}
        {pool.map((it) => (
          <Chip key={it.id} item={it} placed={false} handlers={handlers} />
        ))}
      </div>

      <div className="mt-4 grid gap-6 lg:grid-cols-[260px_1fr] lg:items-start">
        <div className="mx-auto w-full max-w-[260px]">
          <DimensionWheel size={260} counts={counts} interactive />
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          {DIMENSIONS.map((d) => (
            <Zone key={d.id} label={d.label} dim={d.id} items={zoneItems(d.id)} onZoneClick={onZoneClick} handlers={handlers} />
          ))}
        </div>
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

function Chip({ item, placed, handlers }: { item: EvidenceItem; placed: boolean; handlers: Handlers }) {
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
  dim,
  items,
  onZoneClick,
  handlers,
}: {
  label: string;
  dim: DimensionId;
  items: EvidenceItem[];
  onZoneClick: (dim: DimensionId) => void;
  handlers: Handlers;
}) {
  return (
    <div
      data-dropzone={dim}
      onClick={() => onZoneClick(dim)}
      className={clsx(
        "min-h-[90px] space-y-1.5 rounded-xl border p-3",
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
