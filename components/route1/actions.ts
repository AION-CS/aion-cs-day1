"use client";

import { useProgress } from "@/lib/store";
import type { PlacementMap } from "@/lib/usePlacementHistory";
import {
  CRITERIA,
  R1,
  SIGNALS,
  isZoneId,
  type CriterionId,
  type Horizon,
  type OptionId,
  type Rank,
  type Reading,
  type RootCause,
  type ZoneId,
} from "@/lib/route1";
import { useBoardFx, useBoardHistory, useMatrixHistory } from "./history";
import { assignRank, parseSlots, serialiseSlots } from "./ranking";

const BOARD_FIELDS = ["reading", "zone", "root", "horizon"] as const;
type BoardField = (typeof BOARD_FIELDS)[number];

const boardKey = (signalId: string, field: BoardField) =>
  field === "reading"
    ? R1.reading(signalId)
    : field === "zone"
      ? R1.zone(signalId)
      : field === "root"
        ? R1.rootCause(signalId)
        : R1.horizon(signalId);

/** Always the latest persisted choices — event handlers must not read a stale render. */
const currentChoices = () => useProgress.getState().choices;

/**
 * Every change on the Signal Board that undo/redo covers: the reading, the
 * routing (and re-routing), the root-cause tag and the horizon tag. Text is
 * left to the browser's own undo inside the field.
 */
export function useBoardActions() {
  const choose = useProgress((s) => s.choose);
  const markSeen = useProgress((s) => s.markSeen);
  const record = useBoardHistory((s) => s.recordChange);
  const undoStack = useBoardHistory((s) => s.undo);
  const redoStack = useBoardHistory((s) => s.redo);
  const canUndo = useBoardHistory((s) => s.past.length > 0);
  const canRedo = useBoardHistory((s) => s.future.length > 0);
  const fire = useBoardFx((s) => s.fire);

  const snapshot = (): PlacementMap => {
    const c = currentChoices();
    const snap: PlacementMap = {};
    for (const s of SIGNALS) for (const f of BOARD_FIELDS) snap[`${s.id}|${f}`] = c[boardKey(s.id, f)] || null;
    return snap;
  };

  const restore = (snap: PlacementMap) => {
    for (const s of SIGNALS) for (const f of BOARD_FIELDS) choose(boardKey(s.id, f), snap[`${s.id}|${f}`] ?? "");
  };

  const setReading = (signalId: string, reading: Reading) => {
    const c = currentChoices();
    if (c[R1.reading(signalId)] === reading) return;
    const wasRouted = !!c[R1.reading(signalId)] && !!c[R1.zone(signalId)];
    record(snapshot());
    choose(R1.reading(signalId), reading);
    const zone = c[R1.zone(signalId)];
    if (!wasRouted && isZoneId(zone)) {
      markSeen(R1.routed, signalId);
      fire(signalId, zone);
    }
  };

  /** Returns true when the change routed (or re-routed) the card. */
  const setZone = (signalId: string, zone: ZoneId): boolean => {
    const c = currentChoices();
    if (c[R1.zone(signalId)] === zone) return false;
    record(snapshot());
    choose(R1.zone(signalId), zone);
    if (c[R1.reading(signalId)]) {
      markSeen(R1.routed, signalId);
      fire(signalId, zone);
      return true;
    }
    return false;
  };

  const setRootCause = (signalId: string, value: RootCause) => {
    if (currentChoices()[R1.rootCause(signalId)] === value) return;
    record(snapshot());
    choose(R1.rootCause(signalId), value);
  };

  const setHorizon = (signalId: string, value: Horizon) => {
    if (currentChoices()[R1.horizon(signalId)] === value) return;
    record(snapshot());
    choose(R1.horizon(signalId), value);
  };

  const undo = () => {
    const snap = undoStack(snapshot());
    if (snap) restore(snap);
  };

  const redo = () => {
    const snap = redoStack(snapshot());
    if (snap) restore(snap);
  };

  return { setReading, setZone, setRootCause, setHorizon, undo, redo, canUndo, canRedo };
}

/** Every rank assignment in the 7 × 3 matrix, with its own undo history. */
export function useMatrixActions() {
  const choose = useProgress((s) => s.choose);
  const record = useMatrixHistory((s) => s.recordChange);
  const undoStack = useMatrixHistory((s) => s.undo);
  const redoStack = useMatrixHistory((s) => s.redo);
  const canUndo = useMatrixHistory((s) => s.past.length > 0);
  const canRedo = useMatrixHistory((s) => s.future.length > 0);

  const snapshot = (): PlacementMap => {
    const c = currentChoices();
    return Object.fromEntries(CRITERIA.map((cr) => [cr.id, c[R1.rank(cr.id)] || null]));
  };

  const restore = (snap: PlacementMap) => {
    for (const cr of CRITERIA) choose(R1.rank(cr.id), snap[cr.id] ?? "");
  };

  const assign = (criterion: CriterionId, option: OptionId, rank: Rank | null) => {
    const before = parseSlots(currentChoices()[R1.rank(criterion)]);
    const after = assignRank(before, option, rank);
    if (serialiseSlots(after) === serialiseSlots(before)) return;
    record(snapshot());
    choose(R1.rank(criterion), serialiseSlots(after));
  };

  const undo = () => {
    const snap = undoStack(snapshot());
    if (snap) restore(snap);
  };

  const redo = () => {
    const snap = redoStack(snapshot());
    if (snap) restore(snap);
  };

  return { assign, undo, redo, canUndo, canRedo };
}
