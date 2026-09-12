"use client";

import { useRef, useState } from "react";
import clsx from "clsx";
import { useProgress } from "@/lib/store";
import {
  R2,
  CONSTRAINTS,
  MEASURES,
  MITIGATION_INSTRUCTION,
  SHOCK,
  CONSTRAINT_KEY_SUMMARY,
  SHOCK_ANSWER_KEY,
  type MeasureId,
} from "@/lib/route2";
import { useRoute2 } from "./useRoute2";
import { useConstraintStore, type ConstraintPlacements } from "./useConstraintStore";
import { ClueToggle } from "@/components/ui/ClueToggle";
import { AnswerKey, AnswerKeyNote } from "@/components/ui/AnswerKey";
import { Info } from "@/components/icons/LineIcons";

const DRAG_THRESHOLD = 6;

function snapshotOf(placement: Record<string, MeasureId | undefined>): ConstraintPlacements {
  const snap: ConstraintPlacements = {};
  for (const c of CONSTRAINTS) snap[c.id] = placement[c.id] ?? null;
  return snap;
}

/** Stage 3a — drag each constraint onto the measure it most threatens, then write a mitigation. */
export function ConstraintTest() {
  const r2 = useRoute2();
  const choose = useProgress((s) => s.choose);
  const setNote = useProgress((s) => s.setNote);

  const past = useConstraintStore((s) => s.past);
  const future = useConstraintStore((s) => s.future);
  const recordChange = useConstraintStore((s) => s.recordChange);
  const storeUndo = useConstraintStore((s) => s.undo);
  const storeRedo = useConstraintStore((s) => s.redo);

  const placements = r2.constraintPlacement;

  const applySnapshot = (snap: ConstraintPlacements) => {
    for (const c of CONSTRAINTS) choose(R2.stage3.constraint(c.id), (snap[c.id] ?? "") as string);
  };

  const place = (constraintId: string, measure: MeasureId | null) => {
    recordChange(snapshotOf(placements));
    choose(R2.stage3.constraint(constraintId), (measure ?? "") as string);
  };

  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [dragPos, setDragPos] = useState<{ x: number; y: number } | null>(null);
  const downRef = useRef<{ id: string; x: number; y: number } | null>(null);
  const wasDragRef = useRef(false);
  const [shake, setShake] = useState<"undo" | "redo" | null>(null);

  const onPointerDown = (e: React.PointerEvent<HTMLButtonElement>, id: string) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    downRef.current = { id, x: e.clientX, y: e.clientY };
    wasDragRef.current = false;
    setDraggingId(id);
    setDragPos({ x: e.clientX, y: e.clientY });
  };

  const onPointerMove = (e: React.PointerEvent<HTMLButtonElement>) => {
    if (!downRef.current) return;
    const dx = e.clientX - downRef.current.x;
    const dy = e.clientY - downRef.current.y;
    if (Math.hypot(dx, dy) > DRAG_THRESHOLD) wasDragRef.current = true;
    setDragPos({ x: e.clientX, y: e.clientY });
  };

  const onPointerUp = (e: React.PointerEvent<HTMLButtonElement>, id: string) => {
    if (wasDragRef.current) {
      const target = document.elementFromPoint(e.clientX, e.clientY);
      const zoneEl = target?.closest<HTMLElement>("[data-dropzone]");
      const zone = zoneEl?.getAttribute("data-dropzone");
      if (zone === "pool") place(id, null);
      else if (zone === "A" || zone === "B" || zone === "C") {
        place(id, zone);
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

  const pool = CONSTRAINTS.filter((c) => !placements[c.id]);
  const inMeasure = (m: MeasureId) => CONSTRAINTS.filter((c) => placements[c.id] === m);
  const draggingConstraint = CONSTRAINTS.find((c) => c.id === draggingId);
  const selected = CONSTRAINTS.find((c) => c.id === selectedId) ?? null;

  return (
    <div>
      <div className="flex flex-wrap items-baseline justify-between gap-3">
        <p className="text-caption text-ash">Drag a constraint onto the measure it most threatens, or tap it then tap a measure.</p>
        <p className="text-caption tabular-nums text-ash">
          Placed: <span className="font-semibold text-ink">{r2.constraintsPlaced}</span> / {CONSTRAINTS.length}
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
        {selected && <span className="text-micro text-ash">Selected — tap a measure below to place it.</span>}
      </div>

      {selected && <ClueToggle clue={selected.clue} />}

      <div data-dropzone="pool" className="mt-3 flex min-h-[56px] flex-wrap gap-2 rounded-xl border border-dashed border-line bg-canvas p-3">
        {pool.length === 0 && <p className="text-micro text-ash">All constraints placed.</p>}
        {pool.map((c) => (
          <button
            key={c.id}
            type="button"
            onPointerDown={(e) => onPointerDown(e, c.id)}
            onPointerMove={onPointerMove}
            onPointerUp={(e) => onPointerUp(e, c.id)}
            onClick={(e) => {
              e.stopPropagation();
              onItemClick(c.id);
            }}
            className={clsx(
              "max-w-[320px] touch-none rounded-lg border px-2.5 py-1.5 text-left text-micro font-medium transition-colors duration-150",
              draggingId === c.id
                ? "opacity-40"
                : selectedId === c.id
                  ? "border-accent bg-accentSoft text-ink"
                  : "border-line bg-paper text-ink hover:border-ash",
            )}
          >
            {c.text}
          </button>
        ))}
      </div>

      <div className="mt-3 grid gap-3 lg:grid-cols-3">
        {MEASURES.map((m) => (
          <div
            key={m.id}
            data-dropzone={m.id}
            onClick={() => {
              if (selectedId) {
                place(selectedId, m.id);
                setSelectedId(null);
              }
            }}
            className={clsx(
              "min-h-[120px] rounded-xl border p-3",
              selectedId ? "cursor-pointer border-accent/50 bg-accentSoft/40" : "border-line",
            )}
          >
            <p className="text-caption font-semibold text-ink">
              {m.id} · {m.short}
            </p>
            <div className="mt-2 space-y-2">
              {inMeasure(m.id).map((c) => (
                <div key={c.id} onClick={(e) => e.stopPropagation()} className="rounded-lg border border-line bg-paper p-2">
                  <button type="button" onClick={() => onItemClick(c.id)} className="text-left text-micro font-medium text-ink">
                    {c.text}
                    <span className="ml-1 text-ash">· tap to remove</span>
                  </button>
                  <label className="mt-2 block">
                    <span className="text-micro font-semibold text-ink">Mitigation</span>
                    <p className="mt-0.5 text-micro text-ash">{MITIGATION_INSTRUCTION}</p>
                    <textarea
                      value={r2.mitigation[c.id] ?? ""}
                      onChange={(e) => setNote(R2.stage3.mitigation(c.id), e.target.value)}
                      rows={2}
                      className="mt-1 w-full rounded-lg border border-line bg-paper px-2 py-1.5 text-micro text-ink"
                    />
                  </label>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <AnswerKeyNote label="Model constraint placements and mitigations" text={CONSTRAINT_KEY_SUMMARY} />

      {/* ------------------------------------------------------------ shock event */}
      <div id="r2-shock" className="mt-5 scroll-mt-24 rounded-2xl border-2 border-warn/50 bg-warn/5 p-5">
        <div className="flex items-start gap-3">
          <Info className="mt-0.5 h-4 w-4 shrink-0 text-warn" />
          <div>
            <p className="text-caption font-semibold text-warn">{SHOCK.heading}</p>
            <p className="mt-1 text-body text-ink">{SHOCK.body}</p>
          </div>
        </div>
        <p className="mt-3 text-caption font-semibold text-ink">{SHOCK.question}</p>
        <div className="mt-1.5 flex flex-wrap gap-1.5">
          {SHOCK.options.map((o) => (
            <button
              key={o.id}
              type="button"
              onClick={() => choose(R2.stage3.shock, o.id)}
              aria-pressed={r2.shock === o.id}
              className={clsx(
                "rounded-full border px-3 py-1 text-micro font-medium transition-colors duration-150",
                r2.shock === o.id ? "border-accent bg-accent text-paper" : "border-line bg-paper text-ash hover:border-ash hover:text-ink",
              )}
            >
              {o.label}
            </button>
          ))}
        </div>
        <label className="mt-3 block">
          <span className="text-micro font-semibold text-ink">Why</span>
          <p className="mt-0.5 text-micro text-ash">{SHOCK.noteInstruction}</p>
          <textarea
            value={r2.shockNote}
            onChange={(e) => setNote(R2.stage3.shockNote, e.target.value)}
            rows={2}
            className="mt-1.5 w-full rounded-xl border border-line bg-paper px-3 py-2 text-caption text-ink"
          />
        </label>
        <AnswerKey block={SHOCK_ANSWER_KEY} />
      </div>

      {draggingConstraint && dragPos && wasDragRef.current && (
        <div
          className="pointer-events-none fixed z-50 max-w-[260px] -translate-x-1/2 -translate-y-1/2 rounded-lg border border-accent bg-paper px-2.5 py-1.5 text-micro font-semibold text-ink shadow-lg"
          style={{ left: dragPos.x, top: dragPos.y }}
        >
          {draggingConstraint.text}
        </div>
      )}
    </div>
  );
}
