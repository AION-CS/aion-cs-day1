"use client";

import { useRef, useState } from "react";
import clsx from "clsx";
import { useProgress } from "@/lib/store";
import {
  QUADRANTS,
  QUADRANT_ANSWER_KEY,
  QUADRANT_CARDS,
  R2,
  TASK2,
  materialRefs,
  quadrantCardById,
  type QuadrantId,
} from "@/lib/route2";
import { QuadrantMap } from "@/components/ui/QuadrantMap";
import { ClueToggle } from "@/components/ui/ClueToggle";
import { AnswerKey } from "@/components/ui/AnswerKey";
import { MaterialRefs } from "@/components/ui/MaterialRefs";
import { Check as CheckGlyph, Redo, Undo } from "@/components/icons/LineIcons";
import { useRoute2, useQuadrantHistory, domId, type QuadrantPlacements } from "./useRoute2";

/**
 * Step 2 — the trade-off quadrant map.
 *
 * Check is on demand and clue-only (CLAUDE.md #4): it says how many placements
 * are off and offers a directional hint per misplaced card, never the correct
 * square. Undo/redo run through the shared placement-history utility.
 */
export function QuadrantStep() {
  const r2 = useRoute2();
  const choose = useProgress((s) => s.choose);

  const record = useQuadrantHistory((s) => s.recordChange);
  const undo = useQuadrantHistory((s) => s.undo);
  const redo = useQuadrantHistory((s) => s.redo);
  const canUndo = useQuadrantHistory((s) => s.past.length > 0);
  const canRedo = useQuadrantHistory((s) => s.future.length > 0);

  const [checked, setChecked] = useState(false);
  const [noop, setNoop] = useState<"undo" | "redo" | null>(null);
  const noopTimer = useRef<number | null>(null);

  const flashNoop = (which: "undo" | "redo") => {
    setNoop(which);
    if (noopTimer.current) window.clearTimeout(noopTimer.current);
    noopTimer.current = window.setTimeout(() => setNoop(null), 320);
  };

  const apply = (next: Record<string, string | null>) => {
    for (const c of QUADRANT_CARDS) choose(R2.quadrant(c.id), next[c.id] ?? "");
  };

  const place = (cardId: string, cellId: string) => {
    record(r2.placements as Record<string, string | null>);
    choose(R2.quadrant(cardId), cellId);
    setChecked(false);
  };

  const remove = (cardId: string) => {
    record(r2.placements as Record<string, string | null>);
    choose(R2.quadrant(cardId), "");
    setChecked(false);
  };

  const wrong = r2.placedCards.filter((c) => r2.placements[c.id] !== c.correct);
  const allPlaced = r2.unplacedCards.length === 0;

  return (
    <section id={domId.quadrant} className="scroll-mt-24 rounded-2xl border border-line bg-paper p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-micro font-semibold uppercase tracking-wide text-accent">Step 2 · Map</p>
          <h3 className="text-h3 text-ink">{TASK2.quadrant.heading}</h3>
          <p className="mt-1 max-w-prose text-caption text-ash">{TASK2.quadrant.instruction}</p>
          <MaterialRefs refs={materialRefs(["worked", "board"])} />
        </div>

        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => {
              const prev = undo(r2.placements as Record<string, string | null>);
              if (prev) {
                apply(prev);
                setChecked(false);
              } else flashNoop("undo");
            }}
            className={clsx(
              "inline-flex items-center gap-1.5 rounded-full border border-line px-3 py-1.5 text-micro font-semibold transition-colors duration-150",
              canUndo ? "text-ink hover:border-ash" : "text-ash",
              noop === "undo" && "anim-shake-noop",
            )}
          >
            <Undo className="h-3.5 w-3.5" /> Undo
          </button>
          <button
            type="button"
            onClick={() => {
              const next = redo(r2.placements as Record<string, string | null>);
              if (next) {
                apply(next);
                setChecked(false);
              } else flashNoop("redo");
            }}
            className={clsx(
              "inline-flex items-center gap-1.5 rounded-full border border-line px-3 py-1.5 text-micro font-semibold transition-colors duration-150",
              canRedo ? "text-ink hover:border-ash" : "text-ash",
              noop === "redo" && "anim-shake-noop",
            )}
          >
            <Redo className="h-3.5 w-3.5" /> Redo
          </button>
        </div>
      </div>

      <div className="mt-4">
        <QuadrantMap
          cells={QUADRANTS.map((q) => ({
            id: q.id,
            col: q.col,
            row: q.row,
            label: q.label,
            hint: q.hint,
          }))}
          items={QUADRANT_CARDS.map((c) => ({ id: c.id, short: c.short }))}
          placements={r2.placements as Record<string, string | null>}
          onPlace={place}
          onRemove={remove}
          xAxis={TASK2.quadrant.xAxis}
          yAxis={TASK2.quadrant.yAxis}
          idForCell={(cellId) => domId.quadrantCell(cellId)}
          cellStatus={(cardId) =>
            !checked
              ? "neutral"
              : r2.placements[cardId] === quadrantCardById(cardId).correct
                ? "ok"
                : "off"
          }
        />
      </div>

      {/* Check — clue, never the answer */}
      <div className="mt-4 rounded-xl border border-line bg-canvas p-3">
        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={() => setChecked(true)}
            className="btn-ghost !py-1.5 !text-caption"
          >
            {checked ? "Re-check placements" : "Check placements"}
          </button>
          <p className="text-micro text-ash">
            Tells you how many are off and points at the reasoning — never at the right square.
          </p>
        </div>

        {checked && (
          <div className="reveal-in mt-2">
            {!allPlaced && (
              <p className="text-caption text-ash">
                {r2.unplacedCards.length} measure{r2.unplacedCards.length === 1 ? " is" : "s are"} still
                unplaced — checking only what is on the map so far.
              </p>
            )}
            {wrong.length === 0 ? (
              <p className="inline-flex items-center gap-1.5 text-caption font-semibold text-accent">
                <CheckGlyph className="h-4 w-4" />
                {allPlaced
                  ? "All five placements hold up."
                  : "Everything placed so far holds up."}
              </p>
            ) : (
              <>
                <p className="text-caption font-semibold text-danger">
                  {wrong.length} placement{wrong.length === 1 ? "" : "s"} {wrong.length === 1 ? "does" : "do"} not
                  hold up. Each one below has a hint — move it and re-check.
                </p>
                <ul className="mt-2 space-y-2">
                  {wrong.map((c) => {
                    const placedIn = r2.placements[c.id] as QuadrantId;
                    const clue = c.clueByQuadrant?.[placedIn] ?? c.clue;
                    return (
                      <li key={c.id} className="rounded-lg border border-danger/30 bg-danger/5 px-2.5 py-2">
                        <p className="text-micro font-semibold text-ink">{c.short}</p>
                        <ClueToggle clue={clue} />
                      </li>
                    );
                  })}
                </ul>
              </>
            )}
          </div>
        )}

        <AnswerKey block={QUADRANT_ANSWER_KEY} />
      </div>
    </section>
  );
}
