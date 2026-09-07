"use client";

import { useMemo, useRef, useState } from "react";
import clsx from "clsx";
import { useProgress } from "@/lib/store";
import { R3, HORIZONS, type HorizonId, type Lever } from "@/lib/route3";
import { useRoute3 } from "./useRoute3";
import { useHorizonStore, type HorizonPlacements } from "./useHorizonStore";
import { ClueToggle } from "@/components/ui/ClueToggle";
import { RoadmapLanesSvg } from "./RoadmapLanesSvg";

const DRAG_THRESHOLD = 6;

type Handlers = {
  selectedId: string | null;
  draggingId: string | null;
  onPointerDown: (e: React.PointerEvent<HTMLButtonElement>, id: string) => void;
  onPointerMove: (e: React.PointerEvent<HTMLButtonElement>) => void;
  onPointerUp: (e: React.PointerEvent<HTMLButtonElement>, id: string) => void;
  onItemClick: (id: string) => void;
};

/** Stage 4 — drag the 4 chosen levers onto Short/Medium/Structural, then mark exactly one as the first move. */
export function HorizonSequencer() {
  const r3 = useRoute3();
  const choose = useProgress((s) => s.choose);
  const setNote = useProgress((s) => s.setNote);
  const levers = r3.stage4Levers;

  const past = useHorizonStore((s) => s.past);
  const future = useHorizonStore((s) => s.future);
  const recordChange = useHorizonStore((s) => s.recordChange);
  const storeUndo = useHorizonStore((s) => s.undo);
  const storeRedo = useHorizonStore((s) => s.redo);

  const placements = r3.stage4Horizon;
  const snapshotOf = (placement: Record<string, HorizonId | undefined>): HorizonPlacements => {
    const snap: HorizonPlacements = {};
    for (const l of levers) snap[l.id] = placement[l.id] ?? null;
    return snap;
  };
  const applySnapshot = (snap: HorizonPlacements) => {
    for (const l of levers) choose(R3.s4.horizon(l.id), (snap[l.id] ?? "") as string);
  };
  const place = (leverId: string, horizon: HorizonId | null) => {
    recordChange(snapshotOf(placements));
    choose(R3.s4.horizon(leverId), (horizon ?? "") as string);
  };

  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [dragPos, setDragPos] = useState<{ x: number; y: number } | null>(null);
  const downRef = useRef<{ id: string; x: number; y: number } | null>(null);
  const wasDragRef = useRef(false);
  const [shake, setShake] = useState<"undo" | "redo" | null>(null);

  const horizonIds = useMemo(() => HORIZONS.map((h) => h.id), []);
  const placedCount = levers.filter((l) => placements[l.id]).length;
  const selectedItem = levers.find((l) => l.id === selectedId) ?? null;

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
      if (zone && (horizonIds as string[]).includes(zone)) {
        place(id, zone as HorizonId);
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
  const onZoneClick = (horizon: HorizonId) => {
    if (!selectedId) return;
    place(selectedId, horizon);
    setSelectedId(null);
  };

  const triggerShake = (which: "undo" | "redo") => {
    setShake(which);
    window.setTimeout(() => setShake(null), 350);
  };
  const handleUndo = () => {
    const prev = storeUndo(snapshotOf(placements));
    if (!prev) return triggerShake("undo");
    applySnapshot(prev);
  };
  const handleRedo = () => {
    const next = storeRedo(snapshotOf(placements));
    if (!next) return triggerShake("redo");
    applySnapshot(next);
  };

  const zoneItems = (h: HorizonId) => levers.filter((l) => placements[l.id] === h);
  const counts = useMemo(() => {
    const c: Partial<Record<HorizonId, number>> = {};
    for (const h of HORIZONS) c[h.id] = levers.filter((l) => placements[l.id] === h.id).length;
    return c;
  }, [placements, levers]);

  if (levers.length === 0) {
    return <p className="rounded-xl border border-dashed border-line bg-canvas p-4 text-caption text-ash">Nothing to sequence yet — select your 4 levers in Stage 3 first. This section stays open and fills in as soon as you do.</p>;
  }

  const pool = levers.filter((l) => !placements[l.id]);
  const draggingItem = levers.find((l) => l.id === draggingId);
  const handlers: Handlers = { selectedId, draggingId, onPointerDown: onPointerDownItem, onPointerMove: onPointerMoveItem, onPointerUp: onPointerUpItem, onItemClick };

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-baseline justify-between gap-3">
          <p className="text-caption text-ash">Drag a lever onto a lane, or tap it then tap a lane.</p>
          <p className="text-caption tabular-nums text-ash">Placed: <span className="font-semibold text-ink">{placedCount}</span> / {levers.length}</p>
        </div>
        <div className="mt-2 flex items-center gap-2">
          <button type="button" onClick={handleUndo} className={clsx("rounded-lg border px-3 py-1.5 text-micro font-semibold transition-colors duration-150", past.length === 0 ? "border-line text-ash/50" : "border-line text-ink hover:border-ash", shake === "undo" && "anim-shake-noop")}>↶ Undo</button>
          <button type="button" onClick={handleRedo} className={clsx("rounded-lg border px-3 py-1.5 text-micro font-semibold transition-colors duration-150", future.length === 0 ? "border-line text-ash/50" : "border-line text-ink hover:border-ash", shake === "redo" && "anim-shake-noop")}>↷ Redo</button>
          {selectedItem && <span className="text-micro text-ash">Selected — tap a lane below to place it.</span>}
        </div>

        {selectedItem && <ClueToggle clue={selectedItem.horizonClue} />}

        <div data-dropzone="pool" className="mt-3 flex min-h-[64px] flex-wrap gap-2 rounded-xl border border-dashed border-line bg-canvas p-3">
          {pool.length === 0 && <p className="text-micro text-ash">All levers placed.</p>}
          {pool.map((l) => <Chip key={l.id} item={l} placed={false} handlers={handlers} />)}
        </div>

        <div className="mt-3">
          <RoadmapLanesSvg counts={counts} interactive />
        </div>
        <div className="mt-3 grid gap-3 sm:grid-cols-3">
          {HORIZONS.map((h) => (
            <Zone key={h.id} label={h.label} horizon={h.id} items={zoneItems(h.id)} onZoneClick={onZoneClick} handlers={handlers} />
          ))}
        </div>

        {draggingItem && dragPos && wasDragRef.current && (
          <div className="pointer-events-none fixed z-50 max-w-[220px] -translate-x-1/2 -translate-y-1/2 rounded-lg border border-accent bg-paper px-2.5 py-1.5 text-micro font-semibold text-ink shadow-lg" style={{ left: dragPos.x, top: dragPos.y }}>
            {draggingItem.text}
          </div>
        )}
      </div>

      <div id="r3-stage4-firstmove" className="border-t border-line pt-4">
        <p className="text-caption font-semibold text-ink">First move</p>
        <p className="text-micro text-ash">Which one of the four goes first?</p>
        <div className="mt-2 flex flex-wrap gap-2">
          {levers.map((l) => {
            const active = r3.firstMove === l.id;
            return (
              <button
                key={l.id}
                type="button"
                onClick={() => choose(R3.s4.firstMove, l.id)}
                aria-pressed={active}
                className={clsx("max-w-xs rounded-lg border px-2.5 py-1.5 text-left text-micro font-semibold transition-colors duration-150", active ? "border-accent bg-accentSoft text-ink" : "border-line text-ink hover:border-ash")}
              >
                {l.text}
              </button>
            );
          })}
        </div>
        <label className="mt-3 block">
          <span className="text-caption font-semibold text-ink">Why this one first?</span>
          <p className="text-micro text-ash">Reason it explicitly as a no-regret decision where possible (Block 4).</p>
          <textarea
            value={r3.firstMoveJustify}
            onChange={(e) => setNote(R3.s4.firstMoveJustify, e.target.value)}
            rows={2}
            className="mt-1 w-full rounded-xl border border-line bg-paper px-3 py-2 text-body text-ink"
          />
        </label>
      </div>
    </div>
  );
}

function Chip({ item, placed, handlers }: { item: Lever; placed: boolean; handlers: Handlers }) {
  const selected = handlers.selectedId === item.id;
  const dragging = handlers.draggingId === item.id;
  return (
    <button
      type="button"
      onPointerDown={(e) => handlers.onPointerDown(e, item.id)}
      onPointerMove={handlers.onPointerMove}
      onPointerUp={(e) => handlers.onPointerUp(e, item.id)}
      onClick={(e) => { e.stopPropagation(); handlers.onItemClick(item.id); }}
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

function Zone({ label, horizon, items, onZoneClick, handlers }: { label: string; horizon: HorizonId; items: Lever[]; onZoneClick: (h: HorizonId) => void; handlers: Handlers }) {
  return (
    <div data-dropzone={horizon} onClick={() => onZoneClick(horizon)} className={clsx("min-h-[90px] space-y-1.5 rounded-xl border p-3", handlers.selectedId ? "border-accent/50 bg-accentSoft/40 cursor-pointer" : "border-line")}>
      <p className="text-micro font-semibold uppercase tracking-wide text-ash">{label}</p>
      <div className="flex flex-wrap gap-1.5">
        {items.map((l) => <Chip key={l.id} item={l} placed handlers={handlers} />)}
      </div>
    </div>
  );
}
