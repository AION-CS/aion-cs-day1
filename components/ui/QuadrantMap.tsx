"use client";

import { useState } from "react";
import clsx from "clsx";
import { Close } from "@/components/icons/LineIcons";

/**
 * A draggable 2×2 quadrant map: cards placed on a plane with two labelled axes.
 *
 * Native HTML5 drag events plus tap-to-select as an accessible fallback — no
 * drag-and-drop library (CLAUDE.md #9). Placement is controlled by the caller
 * so the current state can live in the persisted store and the undo/redo
 * history stays a separate stack of snapshots.
 *
 * Styled to match `RadarChart` rather than inventing a second visual language
 * for "a measure scored on two dimensions": same grid hairlines, same accent
 * for the learner's own marks, same muted axis labels.
 */

export type QuadrantCell = {
  id: string;
  col: 0 | 1;
  row: 0 | 1;
  label: string;
  hint: string;
};

export type QuadrantItem = {
  id: string;
  short: string;
};

export type AxisSpec = {
  label: string;
  note: string;
  low: string;
  high: string;
};

export function QuadrantMap({
  cells,
  items,
  placements,
  onPlace,
  onRemove,
  xAxis,
  yAxis,
  cellStatus,
  idForCell,
}: {
  cells: QuadrantCell[];
  items: QuadrantItem[];
  /** itemId → cellId, or null/absent when unplaced. */
  placements: Record<string, string | null>;
  onPlace: (itemId: string, cellId: string) => void;
  onRemove: (itemId: string) => void;
  xAxis: AxisSpec;
  yAxis: AxisSpec;
  /** Optional per-placed-item decoration, e.g. a checked/unchecked marker. */
  cellStatus?: (itemId: string) => "neutral" | "ok" | "off";
  /** DOM id for a cell, so a missing-item link can scroll to it. */
  idForCell?: (cellId: string) => string;
}) {
  const [armedId, setArmedId] = useState<string | null>(null);
  const [dragId, setDragId] = useState<string | null>(null);
  const [overCell, setOverCell] = useState<string | null>(null);

  const unplaced = items.filter((i) => !placements[i.id]);
  const cellAt = (col: 0 | 1, row: 0 | 1) => cells.find((c) => c.col === col && c.row === row)!;

  const place = (itemId: string, cellId: string) => {
    onPlace(itemId, cellId);
    setArmedId(null);
    setDragId(null);
    setOverCell(null);
  };

  return (
    <div>
      {/* Cards still to place */}
      <div className="rounded-2xl border border-dashed border-line bg-canvas p-3">
        <p className="text-micro font-semibold uppercase tracking-wide text-ash">
          Measures still to place ({unplaced.length})
        </p>
        {unplaced.length === 0 ? (
          <p className="mt-2 text-caption text-ash">
            All placed. Remove any card with its × to reconsider it.
          </p>
        ) : (
          <ul className="mt-2 flex flex-wrap gap-2">
            {unplaced.map((item) => {
              const armed = armedId === item.id;
              return (
                <li key={item.id} id={idForCell ? `${idForCell("unplaced")}-${item.id}` : undefined}>
                  <button
                    type="button"
                    draggable
                    onDragStart={(e) => {
                      setDragId(item.id);
                      e.dataTransfer.effectAllowed = "move";
                      e.dataTransfer.setData("text/plain", item.id);
                    }}
                    onDragEnd={() => {
                      setDragId(null);
                      setOverCell(null);
                    }}
                    onClick={() => setArmedId((cur) => (cur === item.id ? null : item.id))}
                    className={clsx(
                      "rounded-xl border px-3 py-2 text-left text-caption transition-all duration-150",
                      dragId === item.id && "is-dragging",
                      armed
                        ? "border-accent bg-accentSoft text-ink shadow-lift"
                        : "border-line bg-paper text-ink hover:border-accent",
                    )}
                  >
                    {item.short}
                  </button>
                </li>
              );
            })}
          </ul>
        )}
        {armedId && (
          <p className="mt-2 text-micro font-semibold text-accent">
            Card selected — now click the quadrant it belongs in.
          </p>
        )}
      </div>

      {/* The map */}
      <div className="mt-4 flex gap-2">
        {/* Y axis */}
        <div className="flex w-7 shrink-0 flex-col items-center justify-between py-1">
          <span className="text-micro font-semibold text-ash">{yAxis.high}</span>
          <span className="[writing-mode:vertical-rl] [transform:rotate(180deg)] text-micro font-semibold uppercase tracking-wide text-ink">
            {yAxis.label}
          </span>
          <span className="text-micro font-semibold text-ash">{yAxis.low}</span>
        </div>

        <div className="min-w-0 flex-1">
          <div className="grid grid-cols-2 gap-2">
            {([0, 1] as const).map((row) =>
              ([0, 1] as const).map((col) => {
                const cell = cellAt(col, row);
                const held = items.filter((i) => placements[i.id] === cell.id);
                const isOver = overCell === cell.id;
                return (
                  <div
                    key={cell.id}
                    id={idForCell?.(cell.id)}
                    onDragOver={(e) => {
                      e.preventDefault();
                      e.dataTransfer.dropEffect = "move";
                      setOverCell(cell.id);
                    }}
                    onDragLeave={() => setOverCell((cur) => (cur === cell.id ? null : cur))}
                    onDrop={(e) => {
                      e.preventDefault();
                      const id = e.dataTransfer.getData("text/plain") || dragId;
                      if (id) place(id, cell.id);
                    }}
                    className={clsx(
                      "min-h-[168px] scroll-mt-24 rounded-2xl border-2 border-dashed p-3 transition-all duration-150",
                      isOver ? "is-drop-target" : "border-line bg-canvas",
                    )}
                  >
                    <button
                      type="button"
                      onClick={() => {
                        if (armedId) place(armedId, cell.id);
                      }}
                      aria-label={
                        armedId
                          ? `Place the selected measure in ${cell.label}`
                          : `${cell.label} — select a measure first`
                      }
                      className="w-full text-left"
                    >
                      <span className="block text-caption font-semibold text-ink">{cell.label}</span>
                      <span className="mt-0.5 block text-micro text-ash">{cell.hint}</span>
                    </button>

                    <ul className="mt-2.5 space-y-1.5">
                      {held.map((item) => {
                        const status = cellStatus?.(item.id) ?? "neutral";
                        return (
                          <li
                            key={item.id}
                            className={clsx(
                              "flex items-center gap-1.5 rounded-lg border px-2 py-1.5",
                              status === "off"
                                ? "border-warn/50 bg-warn/10"
                                : "border-accent/35 bg-accentSoft",
                            )}
                          >
                            <span className="min-w-0 flex-1 text-micro font-semibold text-ink">
                              {item.short}
                            </span>
                            <button
                              type="button"
                              onClick={() => {
                                onRemove(item.id);
                                setArmedId(item.id);
                              }}
                              aria-label={`Remove ${item.short} from ${cell.label} and try again`}
                              title="Remove and retry"
                              className="shrink-0 text-ash hover:text-danger"
                            >
                              <Close className="h-3.5 w-3.5" />
                            </button>
                          </li>
                        );
                      })}
                      {held.length === 0 && (
                        <li className="rounded-lg border border-dashed border-line px-2 py-2 text-micro text-ash">
                          {armedId ? "Click to place here" : "Drop a measure here"}
                        </li>
                      )}
                    </ul>
                  </div>
                );
              }),
            )}
          </div>

          {/* X axis */}
          <div className="mt-2 flex items-center justify-between">
            <span className="text-micro font-semibold text-ash">{xAxis.low}</span>
            <span className="text-micro font-semibold uppercase tracking-wide text-ink">
              {xAxis.label}
            </span>
            <span className="text-micro font-semibold text-ash">{xAxis.high}</span>
          </div>
        </div>
      </div>

      <div className="mt-2 flex flex-wrap gap-x-6 gap-y-1 text-micro text-ash">
        <span>
          <span className="font-semibold text-ink">{xAxis.label} →</span> {xAxis.note}
        </span>
        <span>
          <span className="font-semibold text-ink">{yAxis.label} ↑</span> {yAxis.note}
        </span>
      </div>
    </div>
  );
}
