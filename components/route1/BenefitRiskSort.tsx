"use client";

import { useRef, useState } from "react";
import clsx from "clsx";
import { useProgress } from "@/lib/store";
import { R1, EVIDENCE_ITEMS, STAGE5_CLASSIFICATION, type Verdict2, type Side5, type EvidenceItem } from "@/lib/route1";
import { useRoute1 } from "./useRoute1";
import { useBenefitRiskStore, type BenefitRiskPlacements } from "./useBenefitRiskStore";
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

function snapshotOf(placement: Record<string, Verdict2 | undefined>): BenefitRiskPlacements {
  const snap: BenefitRiskPlacements = {};
  for (const it of EVIDENCE_ITEMS) snap[it.id] = placement[it.id] ?? null;
  return snap;
}

/**
 * Stage 1 — drag (native pointer events) or tap-then-tap-a-zone; full
 * undo/redo history. Pattern cloned from Day 7's Technical/Governance split:
 * the *current* placement always comes from the persisted progress store via
 * useRoute1, and this component only layers an undo/redo history on top.
 */
export function BenefitRiskSort() {
  const r1 = useRoute1();
  const choose = useProgress((s) => s.choose);
  const stage5Side = r1.stage5Side;
  const tagSide = (itemId: string, side: Side5) => choose(R1.stage5.side(itemId), side);

  const past = useBenefitRiskStore((s) => s.past);
  const future = useBenefitRiskStore((s) => s.future);
  const recordChange = useBenefitRiskStore((s) => s.recordChange);
  const storeUndo = useBenefitRiskStore((s) => s.undo);
  const storeRedo = useBenefitRiskStore((s) => s.redo);

  const placements = r1.stage2Verdict;

  const applySnapshot = (snap: BenefitRiskPlacements) => {
    for (const it of EVIDENCE_ITEMS) {
      const v = snap[it.id] ?? "";
      choose(R1.stage2.verdict(it.id), v as string);
    }
  };

  const place = (itemId: string, verdict: Verdict2 | null) => {
    recordChange(snapshotOf(placements));
    choose(R1.stage2.verdict(itemId), (verdict ?? "") as string);
  };

  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [dragPos, setDragPos] = useState<{ x: number; y: number } | null>(null);
  const downRef = useRef<{ id: string; x: number; y: number } | null>(null);
  const wasDragRef = useRef(false);
  const [shake, setShake] = useState<"undo" | "redo" | null>(null);

  const placedCount = EVIDENCE_ITEMS.filter((it) => placements[it.id]).length;
  const selectedItem = EVIDENCE_ITEMS.find((it) => it.id === selectedId) ?? null;

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
      if (zone === "benefit" || zone === "risk") {
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

  const onZoneClick = (zone: Verdict2) => {
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

  const pool = EVIDENCE_ITEMS.filter((it) => !placements[it.id]);
  const zoneItems = (verdict: Verdict2) => EVIDENCE_ITEMS.filter((it) => placements[it.id] === verdict);
  const draggingItem = EVIDENCE_ITEMS.find((it) => it.id === draggingId);

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
        <p className="text-caption text-ash">Drag a card, or tap it then tap a bucket.</p>
        <p className="text-caption tabular-nums text-ash">
          Sorted: <span className="font-semibold text-ink">{placedCount}</span> / {EVIDENCE_ITEMS.length}
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
        {selectedItem && <span className="text-micro text-ash">Selected — tap a bucket below to place it.</span>}
      </div>

      {selectedItem && <ClueToggle clue={selectedItem.verdictClue} />}

      <div data-dropzone="pool" className="mt-3 flex min-h-[64px] flex-wrap gap-2 rounded-xl border border-dashed border-line bg-canvas p-3">
        {pool.length === 0 && <p className="text-micro text-ash">All cards sorted.</p>}
        {pool.map((it) => (
          <Chip key={it.id} item={it} placed={false} handlers={handlers} />
        ))}
      </div>

      <div className="mt-3 grid gap-3 sm:grid-cols-2">
        <Zone label="Benefit" zone="benefit" items={zoneItems("benefit")} onZoneClick={onZoneClick} handlers={handlers} />
        <Zone
          label="Risk / Challenge"
          zone="risk"
          items={zoneItems("risk")}
          onZoneClick={onZoneClick}
          handlers={handlers}
          renderBelowItem={(it) => (
            <TechGovTag key={`tag-${it.id}`} itemId={it.id} side={stage5Side[it.id]} onTag={tagSide} />
          )}
        />
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
  zone,
  items,
  onZoneClick,
  handlers,
  renderBelowItem,
}: {
  label: string;
  zone: Verdict2;
  items: EvidenceItem[];
  onZoneClick: (zone: Verdict2) => void;
  handlers: Handlers;
  renderBelowItem?: (item: EvidenceItem) => React.ReactNode;
}) {
  return (
    <div
      data-dropzone={zone}
      onClick={() => onZoneClick(zone)}
      className={clsx(
        "min-h-[120px] space-y-2.5 rounded-xl border p-3",
        handlers.selectedId ? "border-accent/50 bg-accentSoft/40 cursor-pointer" : "border-line",
      )}
    >
      <p className="text-micro font-semibold uppercase tracking-wide text-ash">{label}</p>
      <div className="space-y-1.5">
        {items.map((it) => (
          <div key={it.id} className="flex flex-wrap items-start gap-1.5">
            <Chip item={it} placed handlers={handlers} />
            {renderBelowItem?.(it)}
          </div>
        ))}
      </div>
    </div>
  );
}

/** Inline Stage 1 tag: is this Risk card a technical problem or a governance one? Replaces the old standalone re-drag stage. */
function TechGovTag({
  itemId,
  side,
  onTag,
}: {
  itemId: string;
  side: Side5 | undefined;
  onTag: (itemId: string, side: Side5) => void;
}) {
  const clue = STAGE5_CLASSIFICATION[itemId]?.clue;
  return (
    <div onClick={(e) => e.stopPropagation()} className="flex flex-wrap items-center gap-1">
      {(["technical", "governance"] as const).map((s) => (
        <button
          key={s}
          type="button"
          onClick={() => onTag(itemId, s)}
          className={clsx(
            "rounded-full border px-2 py-0.5 text-micro font-medium transition-colors duration-150",
            side === s ? "border-accent bg-accentSoft text-ink" : "border-line bg-paper text-ash hover:border-ash",
          )}
        >
          {s === "technical" ? "Technical" : "Governance"}
        </button>
      ))}
      {clue && <ClueToggle clue={clue} />}
    </div>
  );
}
