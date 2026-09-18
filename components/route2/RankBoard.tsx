"use client";

import { useState } from "react";
import clsx from "clsx";
import { useProgress } from "@/lib/store";
import { createPlacementHistory, type PlacementMap } from "@/lib/usePlacementHistory";
import { undoRedoKeyHandler } from "@/lib/undoShortcuts";
import { UndoRedoControls } from "@/components/ui/UndoRedoControls";
import { AnswerKey } from "@/components/ui/AnswerKey";
import { RadarChart, SeriesSwatch, type RadarAxis, type RadarSeries, type SeriesStyle } from "@/components/ui/RadarChart";
import {
  CRITERIA,
  MEASURE_LINES,
  PART_ONE,
  PART_ONE_ANSWER_KEY,
  RANK_SCORE,
  R2,
  measureLineById,
  type Criterion,
  type CriterionId,
  type MeasureLineId,
} from "@/lib/route2";
import { useRoute2, domId, type CriterionState, type RankSlot, type Route2State } from "./useRoute2";

const SLOTS: RankSlot[] = ["1", "2", "3"];

const LINE_STYLE: Record<MeasureLineId, SeriesStyle> = {
  a: { color: "accent", marker: "circle" },
  b: { color: "ink", marker: "square" },
  c: { color: "warn", marker: "triangle", dash: "6 4" },
};

/**
 * Part 1 — score three measure-lines against four criteria, then choose one.
 * One undo/redo history covers every ranking change across all four
 * criterion cards (CLAUDE.md §5), mirroring Route 1's single-board pattern.
 */
export function RankBoard() {
  const r2 = useRoute2();
  const choose = useProgress((s) => s.choose);

  const [useBoardHistory] = useState(() => createPlacementHistory());
  const past = useBoardHistory((s) => s.past);
  const future = useBoardHistory((s) => s.future);
  const recordChange = useBoardHistory((s) => s.recordChange);
  const doUndo = useBoardHistory((s) => s.undo);
  const doRedo = useBoardHistory((s) => s.redo);

  const key = (criterionId: CriterionId, lineId: MeasureLineId) => `${criterionId}:${lineId}`;

  const currentMap = (): PlacementMap => {
    const map: PlacementMap = {};
    for (const c of r2.criteria) for (const m of MEASURE_LINES) map[key(c.criterion.id, m.id)] = c.slotOf[m.id];
    return map;
  };

  const applyMap = (map: PlacementMap) => {
    for (const c of r2.criteria) for (const m of MEASURE_LINES) choose(R2.rank(c.criterion.id, m.id), map[key(c.criterion.id, m.id)] ?? "");
  };

  const place = (criterionId: CriterionId, lineId: MeasureLineId, slot: RankSlot | null) => {
    const c = r2.criterionById(criterionId);
    if (c.slotOf[lineId] === slot) return;
    recordChange(currentMap());
    if (slot) {
      const occupant = c.lineInSlot[slot];
      if (occupant && occupant !== lineId) choose(R2.rank(criterionId, occupant), "");
    }
    choose(R2.rank(criterionId, lineId), slot ?? "");
  };

  const handleUndo = () => {
    const prev = doUndo(currentMap());
    if (prev) applyMap(prev);
  };
  const handleRedo = () => {
    const next = doRedo(currentMap());
    if (next) applyMap(next);
  };

  return (
    <div id={domId.part1} tabIndex={-1} onKeyDown={undoRedoKeyHandler(handleUndo, handleRedo)} className="scroll-mt-24 space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-micro text-ash">
          <span className="font-semibold tabular-nums text-ink">{r2.rankedCriteriaCount}</span> of {CRITERIA.length} criteria fully ranked
        </p>
        <UndoRedoControls onUndo={handleUndo} onRedo={handleRedo} canUndo={past.length > 0} canRedo={future.length > 0} />
      </div>

      <div className="grid gap-2 sm:grid-cols-3">
        {MEASURE_LINES.map((m) => (
          <div key={m.id} className="rounded-xl border border-line bg-canvas p-3">
            <p className="text-caption font-semibold text-ink">
              {m.letter} — {m.name}
            </p>
            <p className="mt-0.5 text-micro text-ash">{m.description}</p>
          </div>
        ))}
      </div>

      {CRITERIA.map((criterion) => (
        <CriterionCard
          key={criterion.id}
          criterion={criterion}
          state={r2.criterionById(criterion.id)}
          onPlace={(lineId, slot) => place(criterion.id, lineId, slot)}
        />
      ))}

      {r2.allCriteriaComplete && <RankRadarAndCommit r2={r2} />}

      <AnswerKey block={PART_ONE_ANSWER_KEY} />
    </div>
  );
}

function CriterionCard({
  criterion,
  state,
  onPlace,
}: {
  criterion: Criterion;
  state: CriterionState;
  onPlace: (lineId: MeasureLineId, slot: RankSlot | null) => void;
}) {
  const setNote = useProgress((s) => s.setNote);
  const [selectedId, setSelectedId] = useState<MeasureLineId | null>(null);
  const [dragId, setDragId] = useState<MeasureLineId | null>(null);
  const [checked, setChecked] = useState(false);

  const unranked = MEASURE_LINES.filter((m) => !state.slotOf[m.id]);

  const runCheck = () => {
    if (!state.complete) return;
    setNote(R2.rankChecks(criterion.id), String(state.checks + 1));
    setChecked(true);
  };

  const clue = state.topPick ? criterion.clueByTopPick[state.topPick] : null;

  const dropOn = (slot: RankSlot | null) => (e: React.DragEvent) => {
    e.preventDefault();
    const id = e.dataTransfer.getData("text/plain") as MeasureLineId;
    if (id) onPlace(id, slot);
  };

  return (
    <div id={domId.criterion(criterion.id)} className="scroll-mt-24 space-y-3 rounded-2xl border border-line bg-paper p-4">
      <div>
        <p className="text-caption font-semibold text-ink">{criterion.label}</p>
        <p className="mt-0.5 text-micro text-ash">{criterion.scenarioPrompt}</p>
      </div>

      <div className="grid gap-3 sm:grid-cols-[1fr_1.6fr]">
        <div
          onDragOver={(e) => e.preventDefault()}
          onDrop={dropOn(null)}
          onClick={() => {
            if (selectedId) {
              onPlace(selectedId, null);
              setSelectedId(null);
            }
          }}
          className={clsx("flex min-h-[52px] flex-wrap items-center gap-1.5 rounded-lg border border-dashed border-line bg-canvas p-2", selectedId && "cursor-pointer")}
        >
          {unranked.length === 0 && <span className="text-micro text-ash">All three ranked.</span>}
          {unranked.map((m) => (
            <div
              key={m.id}
              draggable
              role="button"
              tabIndex={0}
              onDragStart={(e) => {
                e.dataTransfer.setData("text/plain", m.id);
                setDragId(m.id);
              }}
              onDragEnd={() => setDragId(null)}
              onClick={(e) => {
                e.stopPropagation();
                setSelectedId((cur) => (cur === m.id ? null : m.id));
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  setSelectedId((cur) => (cur === m.id ? null : m.id));
                }
              }}
              className={clsx(
                "cursor-grab rounded-lg border px-3 py-1.5 text-caption font-bold transition-colors duration-150",
                dragId === m.id && "is-dragging",
                selectedId === m.id ? "border-accent bg-accentSoft text-accent" : "border-line bg-paper text-ink hover:border-ash",
              )}
            >
              {m.letter}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-3 gap-1.5">
          {SLOTS.map((slot) => {
            const lineId = state.lineInSlot[slot];
            const m = lineId ? measureLineById(lineId) : null;
            return (
              <div
                key={slot}
                onDragOver={(e) => e.preventDefault()}
                onDrop={dropOn(slot)}
                onClick={() => {
                  if (selectedId) {
                    onPlace(selectedId, slot);
                    setSelectedId(null);
                  }
                }}
                className={clsx(
                  "flex min-h-[60px] flex-col items-center justify-center gap-0.5 rounded-lg border p-2 text-center transition-colors duration-150",
                  m ? "border-accent bg-accentSoft" : "border-dashed border-line bg-canvas",
                  selectedId && "cursor-pointer",
                )}
              >
                <span className="text-micro font-semibold uppercase tracking-wide text-ash">{PART_ONE.slotLabels[slot]}</span>
                {m ? (
                  <div
                    draggable
                    onDragStart={(e) => {
                      e.dataTransfer.setData("text/plain", m.id);
                      setDragId(m.id);
                    }}
                    onDragEnd={() => setDragId(null)}
                    onClick={(e) => {
                      e.stopPropagation();
                      onPlace(m.id, null);
                    }}
                    title="Remove from this slot"
                    className={clsx("cursor-grab text-h3 font-bold text-accent", dragId === m.id && "is-dragging")}
                  >
                    {m.letter}
                  </div>
                ) : (
                  <span className="text-micro text-ash">Empty</span>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <div className="space-y-1.5 rounded-lg border border-line bg-canvas p-2.5">
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={runCheck}
            className="rounded-lg border border-line bg-paper px-3 py-1.5 text-caption font-semibold text-ink transition-colors duration-150 hover:border-ash"
          >
            {state.checks > 0 ? PART_ONE.recheckLabel : PART_ONE.checkLabel}
          </button>
          {!state.complete && <span className="text-micro text-ash">{PART_ONE.incomplete}</span>}
        </div>
        {checked && clue && (
          <p className="reveal-in rounded-lg border border-accent/25 bg-accentSoft px-2.5 py-1.5 text-caption text-ink">{clue}</p>
        )}
      </div>
    </div>
  );
}

function RankRadarAndCommit({ r2 }: { r2: Route2State }) {
  const choose = useProgress((s) => s.choose);
  const setNote = useProgress((s) => s.setNote);

  const axes: RadarAxis[] = CRITERIA.map((c) => ({ key: c.id, label: c.label.split(" ")[0], full: c.label }));
  const series: RadarSeries[] = MEASURE_LINES.map((m) => ({
    id: m.id,
    label: `${m.letter} — ${m.name}`,
    values: Object.fromEntries(CRITERIA.map((c) => [c.id, RANK_SCORE[r2.criterionById(c.id).slotOf[m.id]!]])),
    tone: "option",
    style: LINE_STYLE[m.id],
  }));

  return (
    <div id={domId.priority} className="scroll-mt-24 space-y-4 rounded-2xl border border-accent/40 bg-paper p-4">
      <div className="grid gap-4 sm:grid-cols-[1fr_auto] sm:items-center">
        <RadarChart axes={axes} series={series} max={3} ringCount={3} title="A vs B vs C across the four criteria" />
        <div className="space-y-2">
          {MEASURE_LINES.map((m) => (
            <div key={m.id} className="flex items-center gap-2 text-caption">
              <SeriesSwatch style={LINE_STYLE[m.id]} />
              <span className="font-semibold text-ink">{m.letter}</span>
              <span className="ml-3 font-semibold tabular-nums text-ink">{r2.lineTotal(m.id)}</span>
            </div>
          ))}
        </div>
      </div>

      <div>
        <p className="text-caption font-semibold text-ink">{PART_ONE.commitHeading}</p>
        <p className="mt-0.5 text-micro text-ash">{PART_ONE.commitInstruction}</p>
        <div className="mt-2 flex gap-1.5">
          {MEASURE_LINES.map((m) => {
            const on = r2.priority === m.id;
            return (
              <button
                key={m.id}
                type="button"
                onClick={() => choose(R2.priority, m.id)}
                aria-pressed={on}
                className={clsx(
                  "rounded-lg border px-3 py-1.5 text-caption font-bold transition-colors duration-150",
                  on ? "border-accent bg-accentSoft text-accent" : "border-line text-ash hover:border-ash",
                )}
              >
                {m.letter}
              </button>
            );
          })}
        </div>
      </div>

      {r2.priority && (
        <div id={domId.priorityJustify} className="scroll-mt-24">
          <label htmlFor="r2-priority-justify" className="block text-caption font-semibold text-ink">
            {PART_ONE.justifyField.label}
          </label>
          <p className="mt-0.5 text-micro text-ash">{PART_ONE.justifyField.instruction}</p>
          <textarea
            id="r2-priority-justify"
            rows={2}
            value={r2.priorityJustify}
            onChange={(e) => setNote(R2.priorityJustify, e.target.value)}
            placeholder={PART_ONE.justifyField.placeholder}
            className="mt-1.5 w-full rounded-xl border border-line bg-paper px-3 py-2.5 text-caption text-ink"
          />
        </div>
      )}
    </div>
  );
}
