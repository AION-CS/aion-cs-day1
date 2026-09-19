"use client";

import { useState } from "react";
import clsx from "clsx";
import { useProgress } from "@/lib/store";
import { createPlacementHistory, type PlacementMap } from "@/lib/usePlacementHistory";
import { undoRedoKeyHandler } from "@/lib/undoShortcuts";
import { UndoRedoControls } from "@/components/ui/UndoRedoControls";
import { DragHandle, Icon } from "@/components/icons/LineIcons";
import { CHECK_LABELS, GOVERNANCE_INSTRUCTION, NOW_DECISION_FIELD, R2, RESPONSIBILITIES, RISK_OF_WAITING_FIELD, ROLES, type ResponsibilityId, type RoleId } from "@/lib/route2";
import { useRoute2, domId, responsibilityCardId, type CheckResult } from "./useRoute2";

/**
 * Stage E — drag each responsibility onto the role that should hold it.
 * Multiple responsibilities can land on one role, and a role can hold none —
 * that is itself part of the lesson (D4). Check-on-request is per card,
 * clue-not-answer, same pattern as Route 1's signal board.
 */
export function StageGovernance() {
  const r2 = useRoute2();
  const choose = useProgress((s) => s.choose);
  const setNote = useProgress((s) => s.setNote);

  const [useHistory] = useState(() => createPlacementHistory());
  const past = useHistory((s) => s.past);
  const future = useHistory((s) => s.future);
  const recordChange = useHistory((s) => s.recordChange);
  const doUndo = useHistory((s) => s.undo);
  const doRedo = useHistory((s) => s.redo);

  const [selectedId, setSelectedId] = useState<ResponsibilityId | null>(null);
  const [draggingId, setDraggingId] = useState<ResponsibilityId | null>(null);
  const [overRole, setOverRole] = useState<RoleId | "pool" | null>(null);
  const [results, setResults] = useState<Record<string, CheckResult>>({});

  const currentMap = (): PlacementMap => Object.fromEntries(RESPONSIBILITIES.map((r) => [r.id, r2.responsibilityRole[r.id]]));
  const applyMap = (map: PlacementMap) => {
    for (const r of RESPONSIBILITIES) choose(R2.responsibilityRole(r.id), map[r.id] ?? "");
  };

  const place = (id: ResponsibilityId, role: RoleId | null) => {
    if (r2.responsibilityRole[id] === role) return;
    recordChange(currentMap());
    choose(R2.responsibilityRole(id), role ?? "");
  };

  const handleUndo = () => {
    const prev = doUndo(currentMap());
    if (prev) applyMap(prev);
  };
  const handleRedo = () => {
    const next = doRedo(currentMap());
    if (next) applyMap(next);
  };

  const startDrag = (e: React.DragEvent, id: ResponsibilityId) => {
    e.dataTransfer.setData("text/plain", id);
    setDraggingId(id);
  };
  const endDrag = () => setDraggingId(null);
  const dropOn = (role: RoleId | null) => (e: React.DragEvent) => {
    e.preventDefault();
    const id = e.dataTransfer.getData("text/plain") as ResponsibilityId;
    setOverRole(null);
    if (id) place(id, role);
  };
  const tapPlace = (role: RoleId | null) => () => {
    if (!selectedId) return;
    place(selectedId, role);
    setSelectedId(null);
  };

  const runCheck = (id: ResponsibilityId) => {
    const nextCount = r2.respCheckCount[id] + 1;
    setNote(R2.checkCountResp(id), String(nextCount));
    setResults((r) => ({ ...r, [id]: r2.checkResponsibility(id, nextCount) }));
  };

  return (
    <div id={domId.governanceBoard} tabIndex={-1} onKeyDown={undoRedoKeyHandler(handleUndo, handleRedo)} className="scroll-mt-24 space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="max-w-prose text-caption text-ash">{GOVERNANCE_INSTRUCTION}</p>
        <UndoRedoControls onUndo={handleUndo} onRedo={handleRedo} canUndo={past.length > 0} canRedo={future.length > 0} />
      </div>

      <div
        onDragOver={(e) => {
          e.preventDefault();
          setOverRole("pool");
        }}
        onDragLeave={() => setOverRole((cur) => (cur === "pool" ? null : cur))}
        onDrop={dropOn(null)}
        onClick={tapPlace(null)}
        className={clsx("rounded-2xl border border-dashed p-4 transition-colors duration-150", overRole === "pool" ? "is-drop-target" : "border-line bg-canvas", selectedId && "cursor-pointer")}
      >
        <p className="text-micro font-semibold uppercase tracking-wide text-ash">Unassigned — drag, or tap then tap a role</p>
        {r2.unassignedResponsibilities.length === 0 ? (
          <p className="mt-1.5 text-caption text-ash">All four are assigned. Drag one back here, or tap it, to reassign.</p>
        ) : (
          <div className="mt-2.5 flex flex-wrap gap-2">
            {r2.unassignedResponsibilities.map((resp) => (
              <div
                key={resp.id}
                id={responsibilityCardId(resp.id)}
                draggable
                role="button"
                tabIndex={0}
                onDragStart={(e) => startDrag(e, resp.id)}
                onDragEnd={endDrag}
                onClick={() => setSelectedId((cur) => (cur === resp.id ? null : resp.id))}
                className={clsx(
                  "flex cursor-grab items-center gap-1.5 rounded-xl border px-3 py-2 text-caption font-semibold transition-colors duration-150",
                  draggingId === resp.id && "is-dragging",
                  selectedId === resp.id ? "border-accent bg-accentSoft text-accent ring-2 ring-accent/30" : "border-line bg-paper text-ink hover:border-ash",
                )}
              >
                <DragHandle className="h-3.5 w-3.5 text-ash" /> {resp.name}
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        {ROLES.map((role) => {
          const held = r2.byRole(role.id);
          return (
            <div
              key={role.id}
              onDragOver={(e) => {
                e.preventDefault();
                setOverRole(role.id);
              }}
              onDragLeave={() => setOverRole((cur) => (cur === role.id ? null : cur))}
              onDrop={dropOn(role.id)}
              onClick={selectedId ? tapPlace(role.id) : undefined}
              className={clsx("card space-y-2.5 p-3 transition-colors duration-150", overRole === role.id && "is-drop-target", selectedId && "cursor-pointer")}
            >
              <div className="flex items-center gap-2">
                <Icon name={role.icon} className="h-4 w-4 text-accent" />
                <p className="text-caption font-semibold text-ink">{role.name}</p>
              </div>
              {held.length === 0 ? (
                <p className="rounded-lg border border-dashed border-line bg-canvas px-2.5 py-2 text-micro italic text-ash">Drop, or tap a selected item here.</p>
              ) : (
                <div className="space-y-2">
                  {held.map((resp) => {
                    const result = results[resp.id];
                    return (
                      <div key={resp.id} id={responsibilityCardId(resp.id)} draggable onDragStart={(e) => startDrag(e, resp.id)} onDragEnd={endDrag} className="space-y-1.5 rounded-lg border border-line bg-paper p-2">
                        <div className="flex items-center justify-between gap-2">
                          <span className="flex cursor-grab items-center gap-1.5 text-caption font-semibold text-ink">
                            <DragHandle className="h-3.5 w-3.5 text-ash" /> {resp.name}
                          </span>
                          <button type="button" onClick={() => place(resp.id, null)} className="text-micro font-semibold text-ash hover:text-ink">
                            Move out
                          </button>
                        </div>
                        <div className="flex flex-wrap items-center gap-2">
                          <button type="button" onClick={() => runCheck(resp.id)} className="rounded-lg border border-line bg-canvas px-2.5 py-1 text-micro font-semibold text-ink transition-colors duration-150 hover:border-ash">
                            {r2.respCheckCount[resp.id] > 0 ? CHECK_LABELS.recheck : CHECK_LABELS.check}
                          </button>
                          {r2.respCheckCount[resp.id] > 0 && <span className="text-micro text-ash">checked {r2.respCheckCount[resp.id]}×</span>}
                        </div>
                        {result?.holds && <p className="reveal-in text-micro font-semibold text-accent">{CHECK_LABELS.holds}</p>}
                        {result && !result.holds && (
                          <div className="reveal-in space-y-1">
                            <p className="text-micro text-ink">{result.tier === "sharp" ? CHECK_LABELS.wrongTier2 : CHECK_LABELS.wrongTier1}</p>
                            <p className="rounded-lg border border-accent/25 bg-accentSoft px-2 py-1 text-micro text-ink">{result.clue}</p>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div id={domId.nowDecision} className="scroll-mt-24">
        <label htmlFor="r2-now-decision-field" className="block text-caption font-semibold text-ink">
          {NOW_DECISION_FIELD.label}
        </label>
        <p className="mt-0.5 text-micro text-ash">{NOW_DECISION_FIELD.instruction}</p>
        <textarea
          id="r2-now-decision-field"
          value={r2.nowDecision}
          onChange={(e) => setNote(R2.nowDecision, e.target.value)}
          placeholder={NOW_DECISION_FIELD.placeholder}
          rows={2}
          className="mt-1.5 w-full rounded-xl border border-line bg-paper px-3 py-2 text-caption text-ink"
        />
      </div>

      <div id={domId.riskOfWaiting} className="scroll-mt-24">
        <label htmlFor="r2-risk-waiting-field" className="block text-caption font-semibold text-ink">
          {RISK_OF_WAITING_FIELD.label}
        </label>
        <p className="mt-0.5 text-micro text-ash">{RISK_OF_WAITING_FIELD.instruction}</p>
        <textarea
          id="r2-risk-waiting-field"
          value={r2.riskOfWaiting}
          onChange={(e) => setNote(R2.riskOfWaiting, e.target.value)}
          placeholder={RISK_OF_WAITING_FIELD.placeholder}
          rows={2}
          className="mt-1.5 w-full rounded-xl border border-line bg-paper px-3 py-2 text-caption text-ink"
        />
      </div>
    </div>
  );
}
