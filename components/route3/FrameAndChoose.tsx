"use client";

import { useRef, useState } from "react";
import clsx from "clsx";
import { useProgress } from "@/lib/store";
import {
  R3,
  DRIVERS,
  DRIVER_PICK_COUNT,
  GUIDING_DECISIONS,
  DECISION_PICK_COUNT,
  SEQUENCE_CLUE,
  RESOLUTION_INSTRUCTION,
  RESOLUTION_MIN_WORDS,
  DRIVER_ANSWER_KEY,
  SEQUENCE_ANSWER_KEY,
} from "@/lib/route3";
import { useRoute3 } from "./useRoute3";
import { useSequenceStore, type SequenceSnapshot } from "./useSequenceStore";
import { ClueToggle } from "@/components/ui/ClueToggle";
import { AnswerKey } from "@/components/ui/AnswerKey";
import { Check, Info } from "@/components/icons/LineIcons";

const words = (v: string) => v.trim().split(/\s+/).filter(Boolean).length;
const DRAG_THRESHOLD = 6;

/** Stage 1 — the three drivers, the three decisions, and the order they can actually be executed in. */
export function FrameAndChoose() {
  const r3 = useRoute3();
  const toggleCheck = useProgress((s) => s.toggleCheck);
  const choose = useProgress((s) => s.choose);
  const setNote = useProgress((s) => s.setNote);

  const [counter, setCounter] = useState<string | null>(null);
  const [limitMsg, setLimitMsg] = useState<string | null>(null);

  const past = useSequenceStore((s) => s.past);
  const future = useSequenceStore((s) => s.future);
  const recordChange = useSequenceStore((s) => s.recordChange);
  const storeUndo = useSequenceStore((s) => s.undo);
  const storeRedo = useSequenceStore((s) => s.redo);

  const flash = (setter: (v: string | null) => void, msg: string) => {
    setter(msg);
    window.setTimeout(() => setter(null), 5000);
  };

  const onToggleDriver = (id: string) => {
    const selected = r3.pickedDrivers.includes(id);
    if (selected) {
      toggleCheck(R3.stage1.driver(id), false);
      return;
    }
    if (r3.pickedDrivers.length >= DRIVER_PICK_COUNT) {
      flash(setLimitMsg, `You already have ${DRIVER_PICK_COUNT} drivers. Deselect one first — choosing what to leave out is the exercise.`);
      return;
    }
    toggleCheck(R3.stage1.driver(id), true);
    const driver = DRIVERS.find((d) => d.id === id);
    if (driver?.counterPrompt) flash(setCounter, driver.counterPrompt);
  };

  const onToggleDecision = (id: string) => {
    const selected = r3.pickedDecisions.includes(id);
    if (selected) {
      toggleCheck(R3.stage1.decision(id), false);
      choose(R3.stage1.order(id), "");
      return;
    }
    if (r3.pickedDecisions.length >= DECISION_PICK_COUNT) {
      flash(setLimitMsg, `The board can take ${DECISION_PICK_COUNT} guiding decisions. Deselect one first.`);
      return;
    }
    toggleCheck(R3.stage1.decision(id), true);
    // drop the new one at the end of the current order
    const used = r3.pickedDecisions.map((d) => r3.order[d]).filter((v): v is number => v !== undefined);
    const next = [1, 2, 3].find((n) => !used.includes(n)) ?? 1;
    choose(R3.stage1.order(id), String(next));
  };

  // --- sequencing ---------------------------------------------------------
  const ordered = [...r3.pickedDecisions].sort((a, b) => (r3.order[a] ?? 99) - (r3.order[b] ?? 99));

  const snapshot = (): SequenceSnapshot => {
    const snap: SequenceSnapshot = {};
    for (const id of r3.pickedDecisions) snap[id] = r3.order[id] ?? null;
    return snap;
  };

  const applySnapshot = (snap: SequenceSnapshot) => {
    for (const [id, pos] of Object.entries(snap)) choose(R3.stage1.order(id), pos ? String(pos) : "");
  };

  const moveTo = (id: string, targetIndex: number) => {
    recordChange(snapshot());
    const without = ordered.filter((d) => d !== id);
    without.splice(targetIndex, 0, id);
    without.forEach((d, i) => choose(R3.stage1.order(d), String(i + 1)));
  };

  const [draggingId, setDraggingId] = useState<string | null>(null);
  const downRef = useRef<{ id: string; x: number; y: number } | null>(null);
  const wasDragRef = useRef(false);
  const [shake, setShake] = useState<"undo" | "redo" | null>(null);

  const triggerShake = (which: "undo" | "redo") => {
    setShake(which);
    window.setTimeout(() => setShake(null), 350);
  };

  const resolutionWords = words(r3.resolution);

  return (
    <div>
      {/* ------------------------------------------------------------ drivers */}
      <div id="r3-drivers" className="scroll-mt-24 rounded-2xl border border-line bg-paper p-4">
        <div className="flex flex-wrap items-baseline justify-between gap-3">
          <div>
            <p className="text-caption font-semibold text-ink">Why this is strategically relevant — to BrightPath specifically</p>
            <p className="mt-0.5 text-micro text-ash">
              Choose exactly {DRIVER_PICK_COUNT}. Several of these are true; the question is which ones a board can actually
              allocate budget against.
            </p>
          </div>
          <p className="text-caption tabular-nums text-ash">
            <span className="font-semibold text-ink">{r3.pickedDrivers.length}</span> / {DRIVER_PICK_COUNT}
          </p>
        </div>

        {limitMsg && <p className="reveal-in mt-2 rounded-lg border border-warn/40 bg-warn/10 px-3 py-2 text-micro text-warn">{limitMsg}</p>}
        {counter && (
          <div className="reveal-in mt-2 flex items-start gap-2 rounded-lg border border-accent/40 bg-accentSoft px-3 py-2">
            <Info className="mt-0.5 h-3.5 w-3.5 shrink-0 text-accent" />
            <p className="text-micro text-ink">{counter}</p>
          </div>
        )}

        <div className="mt-3 grid gap-2 lg:grid-cols-2">
          {DRIVERS.map((d) => {
            const selected = r3.pickedDrivers.includes(d.id);
            return (
              <button
                key={d.id}
                type="button"
                onClick={() => onToggleDriver(d.id)}
                aria-pressed={selected}
                className={clsx(
                  "flex items-start gap-2 rounded-xl border p-3 text-left transition-colors duration-150",
                  selected ? "border-accent bg-accentSoft" : "border-line bg-paper hover:border-ash",
                )}
              >
                <span
                  className={clsx(
                    "mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-micro font-semibold",
                    selected ? "bg-accent text-paper" : "bg-mist text-ash",
                  )}
                >
                  {selected ? <Check className="h-3.5 w-3.5" /> : ""}
                </span>
                <span className="flex-1 text-caption text-ink">{d.label}</span>
              </button>
            );
          })}
        </div>

        <AnswerKey block={DRIVER_ANSWER_KEY} />
      </div>

      {/* ---------------------------------------------------------- decisions */}
      <div id="r3-decisions" className="mt-5 scroll-mt-24 rounded-2xl border border-line bg-paper p-4">
        <div className="flex flex-wrap items-baseline justify-between gap-3">
          <div>
            <p className="text-caption font-semibold text-ink">The three decisions the board can take</p>
            <p className="mt-0.5 text-micro text-ash">
              Choose exactly {DECISION_PICK_COUNT}, then drag them into the order they can actually be executed —
              sequencing is judged separately from selection.
            </p>
          </div>
          <p className="text-caption tabular-nums text-ash">
            <span className="font-semibold text-ink">{r3.pickedDecisions.length}</span> / {DECISION_PICK_COUNT}
          </p>
        </div>

        <div className="mt-3 grid gap-2 lg:grid-cols-3">
          {GUIDING_DECISIONS.map((d) => {
            const selected = r3.pickedDecisions.includes(d.id);
            return (
              <button
                key={d.id}
                type="button"
                onClick={() => onToggleDecision(d.id)}
                aria-pressed={selected}
                className={clsx(
                  "flex items-start gap-2 rounded-xl border p-3 text-left transition-colors duration-150",
                  selected ? "border-accent bg-accentSoft" : "border-line bg-paper hover:border-ash",
                )}
              >
                <span
                  className={clsx(
                    "mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-micro font-semibold",
                    selected ? "bg-accent text-paper" : "bg-mist text-ash",
                  )}
                >
                  {d.letter}
                </span>
                <span className="flex-1 text-micro text-ink">{d.label}</span>
              </button>
            );
          })}
        </div>

        {ordered.length > 0 && (
          <div className="mt-4 rounded-xl border border-line bg-canvas p-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <p className="text-micro font-semibold text-ink">Execution order — drag to reorder</p>
              <div className="flex gap-1.5">
                <button
                  type="button"
                  onClick={() => {
                    const prev = storeUndo(snapshot());
                    if (!prev) return triggerShake("undo");
                    applySnapshot(prev);
                  }}
                  className={clsx(
                    "rounded-lg border px-2.5 py-1 text-micro font-semibold transition-colors duration-150",
                    past.length === 0 ? "border-line text-ash/50" : "border-line text-ink hover:border-ash",
                    shake === "undo" && "anim-shake-noop",
                  )}
                >
                  ↶ Undo
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const next = storeRedo(snapshot());
                    if (!next) return triggerShake("redo");
                    applySnapshot(next);
                  }}
                  className={clsx(
                    "rounded-lg border px-2.5 py-1 text-micro font-semibold transition-colors duration-150",
                    future.length === 0 ? "border-line text-ash/50" : "border-line text-ink hover:border-ash",
                    shake === "redo" && "anim-shake-noop",
                  )}
                >
                  ↷ Redo
                </button>
              </div>
            </div>

            <ol className="mt-2 space-y-1.5">
              {ordered.map((id, index) => {
                const d = GUIDING_DECISIONS.find((x) => x.id === id)!;
                return (
                  <li key={id} data-seq-slot={index}>
                    <div
                      className={clsx(
                        "flex items-start gap-2 rounded-lg border bg-paper p-2.5 transition-opacity duration-150",
                        draggingId === id ? "opacity-40" : "border-line",
                      )}
                    >
                      <button
                        type="button"
                        onPointerDown={(e) => {
                          e.currentTarget.setPointerCapture(e.pointerId);
                          downRef.current = { id, x: e.clientX, y: e.clientY };
                          wasDragRef.current = false;
                          setDraggingId(id);
                        }}
                        onPointerMove={(e) => {
                          if (!downRef.current) return;
                          if (Math.hypot(e.clientX - downRef.current.x, e.clientY - downRef.current.y) > DRAG_THRESHOLD)
                            wasDragRef.current = true;
                        }}
                        onPointerUp={(e) => {
                          if (wasDragRef.current) {
                            const el = document.elementFromPoint(e.clientX, e.clientY);
                            const slot = el?.closest<HTMLElement>("[data-seq-slot]");
                            const target = slot ? Number(slot.getAttribute("data-seq-slot")) : null;
                            if (target !== null && target !== index) moveTo(id, target);
                          }
                          setDraggingId(null);
                          downRef.current = null;
                        }}
                        aria-label={`Drag ${d.letter} to reorder`}
                        className="mt-0.5 flex h-6 w-6 shrink-0 cursor-grab touch-none items-center justify-center rounded-full bg-accent text-micro font-semibold text-paper"
                      >
                        {index + 1}
                      </button>
                      <span className="flex-1 text-micro text-ink">
                        <span className="font-semibold">{d.letter} · </span>
                        {d.label}
                      </span>
                      <div className="flex shrink-0 gap-1">
                        <button
                          type="button"
                          onClick={() => index > 0 && moveTo(id, index - 1)}
                          aria-label="Move earlier"
                          className="rounded border border-line px-1.5 text-micro text-ash hover:text-ink"
                        >
                          ↑
                        </button>
                        <button
                          type="button"
                          onClick={() => index < ordered.length - 1 && moveTo(id, index + 1)}
                          aria-label="Move later"
                          className="rounded border border-line px-1.5 text-micro text-ash hover:text-ink"
                        >
                          ↓
                        </button>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ol>
            <ClueToggle clue={SEQUENCE_CLUE} />
          </div>
        )}

        <AnswerKey block={SEQUENCE_ANSWER_KEY} />
      </div>

      {/* --------------------------------------------------------- resolution */}
      <div id="r3-resolution" className="mt-5 scroll-mt-24 rounded-2xl border border-line bg-paper p-4">
        <label className="block">
          <span className="text-caption font-semibold text-ink">Board resolution — your first decision</span>
          <p className="mt-0.5 text-micro text-ash">{RESOLUTION_INSTRUCTION}</p>
          <textarea
            value={r3.resolution}
            onChange={(e) => setNote(R3.stage1.resolution, e.target.value)}
            rows={3}
            className="mt-1.5 w-full rounded-xl border border-line bg-paper px-3 py-2 text-caption text-ink"
          />
        </label>
        <p className={clsx("mt-1 text-micro tabular-nums", resolutionWords >= RESOLUTION_MIN_WORDS ? "text-accent" : "text-ash")}>
          {resolutionWords} / {RESOLUTION_MIN_WORDS} words
        </p>
      </div>
    </div>
  );
}
