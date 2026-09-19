"use client";

import { useState } from "react";
import clsx from "clsx";
import { useProgress } from "@/lib/store";
import { createPlacementHistory, type PlacementMap } from "@/lib/usePlacementHistory";
import { undoRedoKeyHandler } from "@/lib/undoShortcuts";
import { AnswerKey } from "@/components/ui/AnswerKey";
import { UndoRedoControls } from "@/components/ui/UndoRedoControls";
import { MaterialRefs } from "@/components/ui/MaterialRefs";
import { CheckVerdict } from "@/components/ui/CheckVerdict";
import { DragHandle } from "@/components/icons/LineIcons";
import { CHECK_LABELS, GATES, HORIZON_ITEMS, HORIZON_LANES, QUALIFYING_QUESTION, R1, STAGE_B_METRICS, materialRefs, type Horizon } from "@/lib/route1";
import { checkHorizon, checkMetric, domId, useRoute1, type CheckResult, type HorizonState, type MetricState } from "./useRoute1";

/**
 * Task 1, Stage B — Informative vs Management-effective. Decision-first, not
 * free-dragged: each metric resolves into its verdict from the learner's own
 * answer to the qualifying question (CLAUDE.md §4), so showing the verdict
 * immediately reveals nothing they didn't just decide themselves.
 */
export function EffectivenessSort() {
  const r1 = useRoute1();
  const choose = useProgress((s) => s.choose);
  const setNote = useProgress((s) => s.setNote);

  return (
    <div id={domId.stageB} className="scroll-mt-24 space-y-4">
      <MaterialRefs refs={materialRefs(QUALIFYING_QUESTION.material)} />
      <div className="rounded-xl border border-line bg-canvas p-3">
        <p className="text-micro font-semibold uppercase tracking-wide text-ash">Key — the six gates (a metric must clear all of them)</p>
        <ul className="mt-1.5 grid gap-x-4 gap-y-1 sm:grid-cols-2">
          {GATES.map((g) => (
            <li key={g.id} className="text-micro text-ash">
              <span className="font-semibold text-ink">{g.name}</span>
              <span className="ml-1 rounded-full border border-line px-1.5 py-px text-[10px] uppercase tracking-wide">{g.half === "sound" ? "sound number" : "wired"}</span> — {g.question}
            </li>
          ))}
        </ul>
      </div>
      <p className="text-micro text-ash">
        <span className="font-semibold tabular-nums text-ink">{r1.metricsAnswered}</span> of {r1.metricStates.length} answered ·{" "}
        <span className="font-semibold tabular-nums text-accent">{r1.effectiveCount}</span> effective ·{" "}
        <span className="font-semibold tabular-nums text-ash">{r1.informativeCount}</span> merely informative
      </p>

      <div className="space-y-3">
        {r1.metricStates.map((m) => (
          <MetricCard
            key={m.id}
            state={m}
            onAnswer={(v) => choose(R1.effectiveness(m.id), v)}
            onCheck={() => {
              const nextCount = m.checkCount + 1;
              setNote(R1.checkCountB(m.id), String(nextCount));
            }}
          />
        ))}
      </div>
    </div>
  );
}

function MetricCard({ state, onAnswer, onCheck }: { state: MetricState; onAnswer: (v: "yes" | "no") => void; onCheck: () => void }) {
  // A verdict belongs to the answer it checked: it disappears when the answer changes.
  const [checked, setChecked] = useState<{ answer: string; res: CheckResult } | null>(null);
  const result = checked && checked.answer === state.answer ? checked.res : null;
  const answerKeyItem = STAGE_B_ANSWER_KEY(state);

  const runCheck = () => {
    if (!state.answer) return;
    onCheck();
    setChecked({ answer: state.answer, res: checkMetric(state, state.checkCount + 1) });
  };

  return (
    <div id={domId.metric(state.id)} className="scroll-mt-24 rounded-xl border border-line bg-paper p-4">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="text-micro font-semibold uppercase tracking-wide text-ash">Metric {state.n}</p>
          <p className="mt-0.5 max-w-prose text-caption text-ink">{state.text}</p>
        </div>
        {state.verdict && (
          <span
            className={clsx(
              "anim-pop shrink-0 rounded-full border border-line bg-mist px-2.5 py-1 text-micro font-semibold text-ink",
            )}
          >
            {state.verdict === "effective" ? "Effective for management" : "Merely informative"}
          </span>
        )}
      </div>

      <div className="mt-3 border-t border-line pt-3">
        <p className="text-caption font-semibold text-ink">{QUALIFYING_QUESTION.label}</p>
        <p className="mt-0.5 text-micro text-ash">{QUALIFYING_QUESTION.instruction}</p>
        <div className="mt-1.5 flex flex-wrap gap-1.5">
          {QUALIFYING_QUESTION.options.map((o) => (
            <button
              key={o.id}
              type="button"
              onClick={() => onAnswer(o.id)}
              aria-pressed={state.answer === o.id}
              className={clsx(
                "rounded-full border px-3 py-1.5 text-caption font-semibold transition-colors duration-150",
                state.answer === o.id ? "border-accent bg-accentSoft text-accent" : "border-line text-ash hover:border-ash",
              )}
            >
              {o.label}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={runCheck}
          disabled={!state.answer}
          className="rounded-lg border border-line bg-canvas px-3 py-1.5 text-caption font-semibold text-ink transition-colors duration-150 hover:border-ash disabled:cursor-not-allowed disabled:opacity-50"
        >
          {state.checkCount > 0 ? CHECK_LABELS.recheck : CHECK_LABELS.check}
        </button>
        {state.checkCount > 0 && <span className="text-micro text-ash">checked {state.checkCount}×</span>}
      </div>
      <CheckVerdict result={result} holdsLabel="This answer holds up." notYetLabel={result && !result.holds && result.tier === "sharp" ? CHECK_LABELS.wrongTier2 : CHECK_LABELS.wrongTier1} />

      <AnswerKey block={answerKeyItem} />
    </div>
  );
}

function STAGE_B_ANSWER_KEY(state: MetricState) {
  return STAGE_B_METRICS.find((m) => m.id === state.id)!.answerKey;
}

// ---------------------------------------------------------------------------
// Task 1, Stage C — Short-term vs structural
// ---------------------------------------------------------------------------

/**
 * A small two-lane sorter, same drag/tap and undo/redo pattern as Stage A's
 * six-area board, scoped to its own placement-history instance so undoing
 * here never touches Stage A's history.
 */
export function HorizonSort() {
  const r1 = useRoute1();
  const choose = useProgress((s) => s.choose);
  const setNote = useProgress((s) => s.setNote);

  const [useHistory] = useState(() => createPlacementHistory());
  const past = useHistory((s) => s.past);
  const future = useHistory((s) => s.future);
  const recordChange = useHistory((s) => s.recordChange);
  const doUndo = useHistory((s) => s.undo);
  const doRedo = useHistory((s) => s.redo);

  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [overLane, setOverLane] = useState<Horizon | "pool" | null>(null);
  // A verdict belongs to the lane it checked: it disappears when the item moves.
  const [results, setResults] = useState<Record<string, { lane: Horizon | null; res: CheckResult }>>({});

  const currentMap = (): PlacementMap => Object.fromEntries(r1.horizonStates.map((h) => [h.id, h.lane]));
  const applyMap = (map: PlacementMap) => {
    for (const h of r1.horizonStates) choose(R1.horizon(h.id), map[h.id] ?? "");
  };

  const place = (itemId: string, lane: Horizon | null) => {
    if (r1.horizonById(itemId).lane === lane) return;
    recordChange(currentMap());
    choose(R1.horizon(itemId), lane ?? "");
  };

  const handleUndo = () => {
    const prev = doUndo(currentMap());
    if (prev) applyMap(prev);
  };
  const handleRedo = () => {
    const next = doRedo(currentMap());
    if (next) applyMap(next);
  };

  const startDrag = (e: React.DragEvent, id: string) => {
    e.dataTransfer.setData("text/plain", id);
    setDraggingId(id);
  };
  const endDrag = () => setDraggingId(null);
  const dropOn = (lane: Horizon | null) => (e: React.DragEvent) => {
    e.preventDefault();
    const id = e.dataTransfer.getData("text/plain");
    setOverLane(null);
    if (id) place(id, lane);
  };
  const tapPlace = (lane: Horizon | null) => () => {
    if (!selectedId) return;
    place(selectedId, lane);
    setSelectedId(null);
  };

  const runCheck = (item: HorizonState) => {
    const nextCount = item.checkCount + 1;
    setNote(R1.checkCountC(item.id), String(nextCount));
    setResults((r) => ({ ...r, [item.id]: { lane: item.lane, res: checkHorizon(item, nextCount) } }));
  };

  const unplaced = r1.horizonStates.filter((h) => !h.lane);

  return (
    <div id={domId.stageC} tabIndex={-1} onKeyDown={undoRedoKeyHandler(handleUndo, handleRedo)} className="scroll-mt-24 space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-micro text-ash">
          <span className="font-semibold tabular-nums text-ink">{r1.horizonPlacedCount}</span> of {r1.horizonStates.length} sorted
        </p>
        <UndoRedoControls onUndo={handleUndo} onRedo={handleRedo} canUndo={past.length > 0} canRedo={future.length > 0} />
      </div>

      <div
        onDragOver={(e) => {
          e.preventDefault();
          setOverLane("pool");
        }}
        onDragLeave={() => setOverLane((cur) => (cur === "pool" ? null : cur))}
        onDrop={dropOn(null)}
        onClick={tapPlace(null)}
        className={clsx(
          "rounded-2xl border border-dashed p-4 transition-colors duration-150",
          overLane === "pool" ? "is-drop-target" : "border-line bg-canvas",
          selectedId && "cursor-pointer",
        )}
      >
        <p className="text-micro font-semibold uppercase tracking-wide text-ash">Unsorted moves — drag, or tap then tap a lane</p>
        {unplaced.length === 0 ? (
          <p className="mt-1.5 text-caption text-ash">All six are sorted. Drag one back here, or tap it, to change lanes.</p>
        ) : (
          <div className="mt-2.5 flex flex-wrap gap-2">
            {unplaced.map((h) => (
              <div
                key={h.id}
                id={domId.horizonItem(h.id)}
                draggable
                role="button"
                tabIndex={0}
                onDragStart={(e) => startDrag(e, h.id)}
                onDragEnd={endDrag}
                onClick={() => setSelectedId((cur) => (cur === h.id ? null : h.id))}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    setSelectedId((cur) => (cur === h.id ? null : h.id));
                  }
                }}
                className={clsx(
                  "scroll-mt-24 w-full max-w-sm cursor-grab select-none rounded-xl border p-3 text-left transition-colors duration-150 sm:w-auto",
                  draggingId === h.id && "is-dragging",
                  selectedId === h.id ? "border-accent bg-accentSoft ring-2 ring-accent/30" : "border-line bg-paper hover:border-ash",
                )}
              >
                <div className="flex items-center gap-1.5 text-micro font-semibold uppercase tracking-wide text-ash">
                  <DragHandle className="h-3.5 w-3.5" /> Move {h.n}
                </div>
                <p className="mt-1 max-w-xs text-caption text-ink">{h.text}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {HORIZON_LANES.map((lane) => {
          const items = r1.byLane(lane.id);
          return (
            <div
              key={lane.id}
              onDragOver={(e) => {
                e.preventDefault();
                setOverLane(lane.id);
              }}
              onDragLeave={() => setOverLane((cur) => (cur === lane.id ? null : cur))}
              onDrop={dropOn(lane.id)}
              onClick={selectedId ? tapPlace(lane.id) : undefined}
              className={clsx("card space-y-3 p-4 transition-colors duration-150", overLane === lane.id && "is-drop-target", selectedId && "cursor-pointer")}
            >
              <div>
                <p className="text-caption font-semibold text-ink">{lane.name}</p>
                <p className="mt-0.5 text-micro text-ash">{lane.note}</p>
              </div>
              {items.length === 0 ? (
                <p className="rounded-lg border border-dashed border-line bg-canvas px-2.5 py-2 text-micro italic text-ash">Drop, or tap a selected move here.</p>
              ) : (
                <div className="space-y-2.5">
                  {items.map((h) => {
                    const stored = results[h.id];
                    const result = stored && stored.lane === h.lane ? stored.res : null;
                    const answerKey = HORIZON_ITEMS.find((i) => i.id === h.id)!.answerKey;
                    return (
                      <div key={h.id} id={domId.horizonItem(h.id)} draggable onDragStart={(e) => startDrag(e, h.id)} onDragEnd={endDrag} className="scroll-mt-24 space-y-2 rounded-lg border border-line bg-paper p-2.5">
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex min-w-0 items-start gap-1.5">
                            <DragHandle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-ash" />
                            <p className="text-caption text-ink">{h.text}</p>
                          </div>
                          <button type="button" onClick={() => place(h.id, null)} className="shrink-0 whitespace-nowrap text-micro font-semibold text-ash hover:text-ink">
                            Move out
                          </button>
                        </div>
                        <div className="flex flex-wrap items-center gap-2">
                          <button
                            type="button"
                            onClick={() => runCheck(h)}
                            className="rounded-lg border border-line bg-canvas px-2.5 py-1 text-micro font-semibold text-ink transition-colors duration-150 hover:border-ash"
                          >
                            {h.checkCount > 0 ? CHECK_LABELS.recheck : CHECK_LABELS.check}
                          </button>
                          {h.checkCount > 0 && <span className="text-micro text-ash">checked {h.checkCount}×</span>}
                        </div>
                        <CheckVerdict compact result={result} holdsLabel={CHECK_LABELS.holds} notYetLabel={result && !result.holds && result.tier === "sharp" ? CHECK_LABELS.wrongTier2 : CHECK_LABELS.wrongTier1} />
                        <AnswerKey block={answerKey} />
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
