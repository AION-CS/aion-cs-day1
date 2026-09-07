"use client";

import { useRef, useState } from "react";
import clsx from "clsx";
import { useProgress } from "@/lib/store";
import { R1, STAGE5_CLASSIFICATION, type Side5, type EvidenceItem } from "@/lib/route1";
import { useRoute1 } from "./useRoute1";
import { useTechGovStore, type TechGovPlacements } from "./useTechGovStore";
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

/**
 * Stage 5 — same drag/tap + undo/redo mechanic as Stages 2 and 3, but its
 * working set is live: every card tagged "Risk" in Stage 2. That set can
 * grow, shrink, or empty out as the learner revisits Stage 2 — this section
 * never locks, it just reflects whatever the current risk set is.
 */
export function TechGovSort() {
  const r1 = useRoute1();
  const choose = useProgress((s) => s.choose);
  const items = r1.stage5Items;

  const past = useTechGovStore((s) => s.past);
  const future = useTechGovStore((s) => s.future);
  const recordChange = useTechGovStore((s) => s.recordChange);
  const storeUndo = useTechGovStore((s) => s.undo);
  const storeRedo = useTechGovStore((s) => s.redo);

  const placements = r1.stage5Side;

  const snapshotOf = (placement: Record<string, Side5 | undefined>): TechGovPlacements => {
    const snap: TechGovPlacements = {};
    for (const it of items) snap[it.id] = placement[it.id] ?? null;
    return snap;
  };

  const applySnapshot = (snap: TechGovPlacements) => {
    for (const it of items) {
      const v = snap[it.id] ?? "";
      choose(R1.stage5.side(it.id), v as string);
    }
  };

  const place = (itemId: string, side: Side5 | null) => {
    recordChange(snapshotOf(placements));
    choose(R1.stage5.side(itemId), (side ?? "") as string);
  };

  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [dragPos, setDragPos] = useState<{ x: number; y: number } | null>(null);
  const downRef = useRef<{ id: string; x: number; y: number } | null>(null);
  const wasDragRef = useRef(false);
  const [shake, setShake] = useState<"undo" | "redo" | null>(null);

  const placedCount = items.filter((it) => placements[it.id]).length;
  const selectedItem = items.find((it) => it.id === selectedId) ?? null;

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

  const onZoneClick = (side: Side5) => {
    if (!selectedId) return;
    place(selectedId, side);
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

  if (items.length === 0) {
    return <p className="rounded-xl border border-dashed border-line bg-canvas p-4 text-caption text-ash">{STAGE5_EMPTY_MESSAGE}</p>;
  }

  const pool = items.filter((it) => !placements[it.id]);
  const zoneItems = (side: Side5) => items.filter((it) => placements[it.id] === side);
  const draggingItem = items.find((it) => it.id === draggingId);

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
        <p className="text-caption text-ash">Drag a card, or tap it then tap a zone.</p>
        <p className="text-caption tabular-nums text-ash">
          Placed: <span className="font-semibold text-ink">{placedCount}</span> / {items.length}
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

      {selectedItem && <ClueToggle clue={STAGE5_CLASSIFICATION[selectedItem.id]?.clue ?? ""} />}

      <div data-dropzone="pool" className="mt-3 flex min-h-[64px] flex-wrap gap-2 rounded-xl border border-dashed border-line bg-canvas p-3">
        {pool.length === 0 && <p className="text-micro text-ash">All cards placed.</p>}
        {pool.map((it) => (
          <Chip key={it.id} item={it} placed={false} handlers={handlers} />
        ))}
      </div>

      <div className="mt-3 grid gap-3 sm:grid-cols-2">
        <Zone label="Individual Technical Problem" side="technical" items={zoneItems("technical")} onZoneClick={onZoneClick} handlers={handlers} />
        <Zone label="Management / Governance Problem" side="governance" items={zoneItems("governance")} onZoneClick={onZoneClick} handlers={handlers} />
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

const STAGE5_EMPTY_MESSAGE = "Nothing to classify yet — tag at least one card as Risk in Stage 2. This section stays open and will fill in as soon as you do.";

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
  side,
  items,
  onZoneClick,
  handlers,
}: {
  label: string;
  side: Side5;
  items: EvidenceItem[];
  onZoneClick: (side: Side5) => void;
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
