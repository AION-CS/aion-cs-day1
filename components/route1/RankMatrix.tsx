"use client";

import { useState } from "react";
import clsx from "clsx";
import { AnswerKey } from "@/components/ui/AnswerKey";
import { SeriesSwatch } from "@/components/ui/RadarChart";
import { UndoRedoControls } from "@/components/ui/UndoRedoControls";
import { DragHandle } from "@/components/icons/LineIcons";
import { CRITERIA, MATRIX, OPTION_IDS, isOptionId, type Criterion, type CriterionId, type OptionId, type Rank } from "@/lib/route1";
import type { useMatrixActions } from "./actions";
import { OPTION_STYLE } from "./optionStyle";
import { domId, type Route1State } from "./useRoute1";

/**
 * The forced-ranking matrix (§10.2): seven criteria × three rank slots. Chips
 * move by native HTML5 drag-and-drop, and every chip also carries a rank
 * selector — the keyboard and touch path, since native DnD does not work on
 * touch screens. Giving an option a rank that is taken swaps the two; there
 * are never ties. The row's diagnostic question sits under its label, so the
 * lens is taught at the point of use.
 */
export function RankMatrix({ r1, matrix }: { r1: Route1State; matrix: ReturnType<typeof useMatrixActions> }) {
  const [over, setOver] = useState<string | null>(null);

  const allowDrop = (key: string) => (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    if (over !== key) setOver(key);
  };

  const drop = (criterion: CriterionId, rank: Rank | null) => (e: React.DragEvent) => {
    e.preventDefault();
    setOver(null);
    const [c, o] = e.dataTransfer.getData("text/plain").split(":");
    if (c !== criterion || !isOptionId(o)) return;
    matrix.assign(criterion, o, rank);
  };

  return (
    <div id={domId.matrix} className="scroll-mt-24 space-y-3 rounded-2xl border border-line bg-paper p-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h3 className="text-h3 text-ink">{MATRIX.title}</h3>
        <UndoRedoControls onUndo={matrix.undo} onRedo={matrix.redo} canUndo={matrix.canUndo} canRedo={matrix.canRedo} />
      </div>
      <p className="text-caption text-ash">{MATRIX.instruction}</p>
      <p className="rounded-lg border border-accent/30 bg-accentSoft px-3 py-2 text-caption text-ink">{MATRIX.rankRule}</p>

      <ol className="space-y-3">
        {CRITERIA.map((c) => {
          const slots = r1.slots[c.id];
          const placed = slots.filter(Boolean).length;
          const unplaced = OPTION_IDS.filter((o) => !slots.includes(o));
          return (
            <li
              key={c.id}
              id={domId.criterion(c.id)}
              className={clsx(
                "scroll-mt-24 rounded-xl border p-3 transition-colors duration-200",
                placed === 3 ? "border-line bg-canvas" : "border-warn/40 bg-paper",
              )}
            >
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <p className="text-caption font-semibold text-ink">{c.name}</p>
                {placed < 3 && (
                  <span className="rounded-full border border-warn/40 px-2 py-0.5 text-micro font-semibold text-warn">
                    {MATRIX.unranked} · {placed} of 3
                  </span>
                )}
              </div>
              <p className="mt-0.5 text-micro italic text-ash">{c.question}</p>

              <div className="mt-2 grid grid-cols-3 gap-1.5 sm:gap-2">
                {([1, 2, 3] as Rank[]).map((rank) => {
                  const holder = slots[rank - 1];
                  const key = `${c.id}:${rank}`;
                  return (
                    <div
                      key={rank}
                      onDragOver={allowDrop(key)}
                      onDragLeave={() => setOver(null)}
                      onDrop={drop(c.id, rank)}
                      className={clsx(
                        "min-h-[3.4rem] rounded-lg border p-1.5 transition-colors duration-150",
                        over === key ? "is-drop-target" : holder ? "border-line bg-paper" : "border-dashed border-line bg-paper",
                      )}
                    >
                      <p className="text-micro font-semibold uppercase tracking-wide text-ash">Rank {rank}</p>
                      {holder ? (
                        <Chip criterion={c} option={holder} rank={rank} onAssign={(r) => matrix.assign(c.id, holder, r)} />
                      ) : (
                        <p className="mt-1 text-micro text-ash/70">empty</p>
                      )}
                    </div>
                  );
                })}
              </div>

              {unplaced.length > 0 && (
                <div
                  onDragOver={allowDrop(`${c.id}:tray`)}
                  onDragLeave={() => setOver(null)}
                  onDrop={drop(c.id, null)}
                  className={clsx(
                    "mt-2 flex flex-wrap items-center gap-2 rounded-lg border border-dashed p-1.5",
                    over === `${c.id}:tray` ? "is-drop-target" : "border-line",
                  )}
                >
                  <span className="text-micro text-ash">{MATRIX.tray}:</span>
                  {unplaced.map((o) => (
                    <div key={o} className="min-w-[5.5rem]">
                      <Chip criterion={c} option={o} rank={null} onAssign={(r) => matrix.assign(c.id, o, r)} />
                    </div>
                  ))}
                </div>
              )}

              <AnswerKey block={c.answerKey} />
            </li>
          );
        })}
      </ol>
    </div>
  );
}

function Chip({
  criterion,
  option,
  rank,
  onAssign,
}: {
  criterion: Criterion;
  option: OptionId;
  rank: Rank | null;
  onAssign: (rank: Rank | null) => void;
}) {
  const selectId = `rank-${criterion.id}-${option}`;
  const [dragging, setDragging] = useState(false);

  return (
    <div
      draggable
      onDragStart={(e) => {
        e.dataTransfer.setData("text/plain", `${criterion.id}:${option}`);
        e.dataTransfer.effectAllowed = "move";
        setDragging(true);
      }}
      onDragEnd={() => setDragging(false)}
      className={clsx(
        "mt-1 flex items-center gap-1 rounded-lg border border-line bg-paper px-1 py-1 shadow-sm",
        dragging && "is-dragging",
      )}
    >
      <DragHandle className="h-3.5 w-3.5 shrink-0 cursor-grab text-ash" />
      <span className="hidden sm:block">
        <SeriesSwatch style={OPTION_STYLE[option]} />
      </span>
      <span className="text-caption font-bold text-ink">{option}</span>
      <label htmlFor={selectId} className="sr-only">
        Rank for Option {option} on {criterion.name}
      </label>
      <select
        id={selectId}
        value={rank ?? ""}
        onChange={(e) => {
          const v = e.target.value;
          onAssign(v === "" ? null : (Number(v) as Rank));
          window.requestAnimationFrame(() => document.getElementById(selectId)?.focus());
        }}
        className="ml-auto rounded-md border border-line bg-paper px-0.5 py-0.5 text-micro text-ink"
      >
        <option value="">—</option>
        <option value="1">1</option>
        <option value="2">2</option>
        <option value="3">3</option>
      </select>
    </div>
  );
}
