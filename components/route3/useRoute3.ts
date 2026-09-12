"use client";

import { useMemo } from "react";
import { useProgress, useHydrated } from "@/lib/store";
import {
  R3,
  DRIVERS,
  DRIVER_PICK_COUNT,
  GUIDING_DECISIONS,
  DECISION_PICK_COUNT,
  RESOLUTION_MIN_WORDS,
  THRESHOLDS,
  TEST_DEVICES,
  applyRule,
  EXCEPTION_MIN_WORDS,
  REASON_CODES,
  REASON_CODE_MIN,
  REASON_CODE_MAX,
  RACI_DECISIONS,
  RACI_ROLES,
  TRADE_OFFS,
  REVIEW_INDICATORS,
  INDICATOR_PICK_COUNT,
  TRIGGER_MIN_WORDS,
  BOARD_CHALLENGES,
  COMMITMENT_MIN_WORDS,
  type ThresholdKey,
  type RaciLetter,
  type RoleId,
  type Outcome,
} from "@/lib/route3";

export type MissingItem = { id: string; label: string };

const words = (v: string) => v.trim().split(/\s+/).filter(Boolean).length;

export function useRoute3() {
  const hydrated = useHydrated();
  const choices = useProgress((s) => s.choices);
  const checks = useProgress((s) => s.checks);
  const notes = useProgress((s) => s.notes);

  const name = hydrated ? notes[R3.name] ?? "" : "";
  const nameComplete = name.trim().length > 0;

  // --- Stage 1 -------------------------------------------------------------
  const pickedDrivers = useMemo(
    () => (hydrated ? DRIVERS.filter((d) => checks[R3.stage1.driver(d.id)]).map((d) => d.id) : []),
    [hydrated, checks],
  );

  const pickedDecisions = useMemo(
    () => (hydrated ? GUIDING_DECISIONS.filter((d) => checks[R3.stage1.decision(d.id)]).map((d) => d.id) : []),
    [hydrated, checks],
  );

  const order = useMemo(() => {
    const map: Record<string, number | undefined> = {};
    if (!hydrated) return map;
    for (const id of pickedDecisions) {
      const raw = choices[R3.stage1.order(id)];
      const n = raw ? Number(raw) : NaN;
      if (Number.isFinite(n)) map[id] = n;
    }
    return map;
  }, [hydrated, choices, pickedDecisions]);

  const orderValues = pickedDecisions.map((id) => order[id]).filter((v): v is number => v !== undefined);
  const orderComplete =
    pickedDecisions.length === DECISION_PICK_COUNT &&
    orderValues.length === DECISION_PICK_COUNT &&
    new Set(orderValues).size === DECISION_PICK_COUNT;

  const resolution = hydrated ? notes[R3.stage1.resolution] ?? "" : "";
  const resolutionWords = words(resolution);

  const stage1Complete =
    pickedDrivers.length === DRIVER_PICK_COUNT &&
    pickedDecisions.length === DECISION_PICK_COUNT &&
    orderComplete &&
    resolutionWords >= RESOLUTION_MIN_WORDS;

  // --- Stage 2 -------------------------------------------------------------
  const thresholds = useMemo(() => {
    const map: Partial<Record<ThresholdKey, string>> = {};
    if (!hydrated) return map;
    for (const t of THRESHOLDS) {
      const v = choices[R3.stage2.threshold(t.key)];
      if (v) map[t.key] = v;
    }
    return map;
  }, [hydrated, choices]);

  const thresholdsMissing = THRESHOLDS.filter((t) => !thresholds[t.key]);
  const ruleReady = THRESHOLDS.filter((t) => t.key !== "peripheral").every((t) => thresholds[t.key]);

  /** Every device re-evaluated against the learner's current rule. */
  const outcomes = useMemo(() => {
    const map: Record<string, { outcome: Outcome; reason: string } | null> = {};
    for (const d of TEST_DEVICES) map[d.id] = applyRule(d, thresholds);
    return map;
  }, [thresholds]);

  const outcomeCounts = useMemo(() => {
    const tally = { repair: 0, retire: 0, escalate: 0 };
    for (const d of TEST_DEVICES) {
      const o = outcomes[d.id];
      if (o) tally[o.outcome] += 1;
    }
    return tally;
  }, [outcomes]);

  const marks = useMemo(() => {
    const map: Record<string, string | undefined> = {};
    if (!hydrated) return map;
    for (const d of TEST_DEVICES) map[d.id] = choices[R3.stage2.outcomeMark(d.id)];
    return map;
  }, [hydrated, choices]);

  const markedCount = TEST_DEVICES.filter((d) => marks[d.id]).length;
  const notIntended = TEST_DEVICES.filter((d) => marks[d.id] === "not-intended");
  const iterations = hydrated ? Number(notes[R3.stage2.iterations] ?? "0") || 0 : 0;

  const exceptionPath = hydrated ? notes[R3.stage2.exceptionPath] ?? "" : "";
  const exceptionWords = words(exceptionPath);

  const pickedCodes = useMemo(
    () => (hydrated ? REASON_CODES.filter((c) => checks[R3.stage2.reasonCode(c.id)]).map((c) => c.id) : []),
    [hydrated, checks],
  );
  const codesValid = pickedCodes.length >= REASON_CODE_MIN && pickedCodes.length <= REASON_CODE_MAX;

  const stage2Complete =
    thresholdsMissing.length === 0 &&
    markedCount === TEST_DEVICES.length &&
    notIntended.length === 0 &&
    exceptionWords >= EXCEPTION_MIN_WORDS &&
    codesValid;

  // --- Stage 3 -------------------------------------------------------------
  const raci = useMemo(() => {
    const map: Record<string, RaciLetter | undefined> = {};
    if (!hydrated) return map;
    for (const d of RACI_DECISIONS) {
      for (const r of RACI_ROLES) {
        const v = choices[R3.stage3.raci(d.id, r)];
        if (v === "R" || v === "A" || v === "C" || v === "I") map[`${d.id}:${r}`] = v;
      }
    }
    return map;
  }, [hydrated, choices]);

  const raciStatus = useMemo(
    () =>
      RACI_DECISIONS.map((d) => {
        const accountable = RACI_ROLES.filter((r) => raci[`${d.id}:${r}`] === "A");
        const responsible = RACI_ROLES.filter((r) => raci[`${d.id}:${r}`] === "R");
        return {
          id: d.id,
          label: d.label,
          accountable,
          responsible,
          hasDoubleAccountable: accountable.length > 1,
          isComplete: accountable.length === 1 && responsible.length >= 1,
        };
      }),
    [raci],
  );

  const doubleAccountable = raciStatus.filter((s) => s.hasDoubleAccountable);
  const raciIncomplete = raciStatus.filter((s) => !s.isComplete);

  const tradeoffOwner = useMemo(() => {
    const map: Record<string, RoleId | undefined> = {};
    if (!hydrated) return map;
    for (const t of TRADE_OFFS) {
      const v = choices[R3.stage3.tradeoffOwner(t.id)];
      if (v) map[t.id] = v as RoleId;
    }
    return map;
  }, [hydrated, choices]);

  const tradeoffDefault = useMemo(() => {
    const map: Record<string, string | undefined> = {};
    if (!hydrated) return map;
    for (const t of TRADE_OFFS) map[t.id] = choices[R3.stage3.tradeoffDefault(t.id)];
    return map;
  }, [hydrated, choices]);

  const tradeoffsIncomplete = TRADE_OFFS.filter((t) => !tradeoffOwner[t.id] || !tradeoffDefault[t.id]);

  const pickedIndicators = useMemo(
    () => (hydrated ? REVIEW_INDICATORS.filter((i) => checks[R3.stage3.indicator(i.id)]).map((i) => i.id) : []),
    [hydrated, checks],
  );
  const cadence = useMemo(() => {
    const map: Record<string, string | undefined> = {};
    if (!hydrated) return map;
    for (const id of pickedIndicators) map[id] = choices[R3.stage3.cadence(id)];
    return map;
  }, [hydrated, choices, pickedIndicators]);
  const cadenceMissing = pickedIndicators.filter((id) => !cadence[id]);

  const trigger = hydrated ? notes[R3.stage3.trigger] ?? "" : "";
  const triggerWords = words(trigger);

  const challenge = useMemo(() => {
    const map: Record<string, string | undefined> = {};
    if (!hydrated) return map;
    for (const c of BOARD_CHALLENGES) map[c.id] = choices[R3.stage3.challenge(c.id)];
    return map;
  }, [hydrated, choices]);

  const challengeNote = useMemo(() => {
    const map: Record<string, string> = {};
    if (!hydrated) return map;
    for (const c of BOARD_CHALLENGES) map[c.id] = notes[R3.stage3.challengeNote(c.id)] ?? "";
    return map;
  }, [hydrated, notes]);

  const challengesIncomplete = BOARD_CHALLENGES.filter((c) => !challenge[c.id] || !challengeNote[c.id].trim());

  const commitment = hydrated ? notes[R3.stage3.commitment] ?? "" : "";
  const commitmentWords = words(commitment);

  const stage3Complete =
    raciIncomplete.length === 0 &&
    doubleAccountable.length === 0 &&
    tradeoffsIncomplete.length === 0 &&
    pickedIndicators.length === INDICATOR_PICK_COUNT &&
    cadenceMissing.length === 0 &&
    triggerWords >= TRIGGER_MIN_WORDS &&
    challengesIncomplete.length === 0 &&
    commitmentWords >= COMMITMENT_MIN_WORDS;

  const allComplete = nameComplete && stage1Complete && stage2Complete && stage3Complete;

  const missing = useMemo<MissingItem[]>(() => {
    const items: MissingItem[] = [];
    if (!nameComplete) items.push({ id: "r3-name", label: "Add your name so the export can be labelled correctly" });

    if (pickedDrivers.length !== DRIVER_PICK_COUNT) {
      items.push({
        id: "r3-drivers",
        label:
          pickedDrivers.length < DRIVER_PICK_COUNT
            ? `Stage 1: choose ${DRIVER_PICK_COUNT - pickedDrivers.length} more strategic driver${DRIVER_PICK_COUNT - pickedDrivers.length === 1 ? "" : "s"}`
            : `Stage 1: ${pickedDrivers.length} drivers selected — narrow to ${DRIVER_PICK_COUNT}`,
      });
    }
    if (pickedDecisions.length !== DECISION_PICK_COUNT) {
      items.push({
        id: "r3-decisions",
        label:
          pickedDecisions.length < DECISION_PICK_COUNT
            ? `Stage 1: choose ${DECISION_PICK_COUNT - pickedDecisions.length} more guiding decision${DECISION_PICK_COUNT - pickedDecisions.length === 1 ? "" : "s"}`
            : `Stage 1: ${pickedDecisions.length} guiding decisions selected — narrow to ${DECISION_PICK_COUNT}`,
      });
    } else if (!orderComplete) {
      items.push({ id: "r3-decisions", label: "Stage 1: put your three guiding decisions in distinct execution order (1, 2, 3)" });
    }
    if (resolutionWords < RESOLUTION_MIN_WORDS) {
      items.push({
        id: "r3-resolution",
        label: `Stage 1: board resolution needs ${RESOLUTION_MIN_WORDS - resolutionWords} more word${RESOLUTION_MIN_WORDS - resolutionWords === 1 ? "" : "s"}`,
      });
    }

    for (const t of thresholdsMissing) {
      items.push({ id: "r3-rule", label: `Stage 2: no value set for ${t.label}` });
    }
    if (thresholdsMissing.length === 0) {
      const unmarked = TEST_DEVICES.filter((d) => !marks[d.id]);
      if (unmarked.length > 0) {
        items.push({
          id: "r3-bench",
          label: `Stage 2: ${unmarked.length} test outcome${unmarked.length === 1 ? "" : "s"} not yet marked intended or not intended (device ${unmarked.map((d) => d.n).join(", ")})`,
        });
      }
      for (const d of notIntended) {
        items.push({ id: "r3-rule", label: `Stage 2: device ${d.n}'s outcome is marked "not intended" — adjust a threshold and re-run` });
      }
    }
    if (exceptionWords < EXCEPTION_MIN_WORDS) {
      items.push({
        id: "r3-exception",
        label: `Stage 2: exception path needs ${EXCEPTION_MIN_WORDS - exceptionWords} more word${EXCEPTION_MIN_WORDS - exceptionWords === 1 ? "" : "s"}`,
      });
    }
    if (!codesValid) {
      items.push({
        id: "r3-exception",
        label:
          pickedCodes.length < REASON_CODE_MIN
            ? `Stage 2: select at least ${REASON_CODE_MIN} exception reason codes (you have ${pickedCodes.length})`
            : `Stage 2: select at most ${REASON_CODE_MAX} reason codes (you have ${pickedCodes.length})`,
      });
    }

    for (const s of raciStatus) {
      if (s.hasDoubleAccountable) {
        items.push({ id: "r3-raci", label: `Stage 3: two Accountables assigned for "${s.label}" — resolve to one` });
      } else if (s.accountable.length === 0) {
        items.push({ id: "r3-raci", label: `Stage 3: no Accountable role assigned for "${s.label}"` });
      }
      if (s.responsible.length === 0) {
        items.push({ id: "r3-raci", label: `Stage 3: no Responsible role assigned for "${s.label}"` });
      }
    }

    for (const t of tradeoffsIncomplete) {
      if (!tradeoffOwner[t.id]) items.push({ id: "r3-tradeoffs", label: `Stage 3: no owner named for the trade-off "${t.label}"` });
      if (!tradeoffDefault[t.id]) items.push({ id: "r3-tradeoffs", label: `Stage 3: no stated default for the trade-off "${t.label}"` });
    }

    if (pickedIndicators.length !== INDICATOR_PICK_COUNT) {
      items.push({
        id: "r3-review",
        label:
          pickedIndicators.length < INDICATOR_PICK_COUNT
            ? `Stage 3: choose ${INDICATOR_PICK_COUNT - pickedIndicators.length} more review indicator${INDICATOR_PICK_COUNT - pickedIndicators.length === 1 ? "" : "s"}`
            : `Stage 3: ${pickedIndicators.length} indicators selected — narrow to ${INDICATOR_PICK_COUNT}`,
      });
    }
    for (const id of cadenceMissing) {
      const label = REVIEW_INDICATORS.find((i) => i.id === id)?.label ?? id;
      items.push({ id: "r3-review", label: `Stage 3: no cadence set for "${label}"` });
    }
    if (triggerWords < TRIGGER_MIN_WORDS) {
      items.push({
        id: "r3-review",
        label: `Stage 3: trigger condition needs ${TRIGGER_MIN_WORDS - triggerWords} more word${TRIGGER_MIN_WORDS - triggerWords === 1 ? "" : "s"}`,
      });
    }

    for (const c of challengesIncomplete) {
      if (!challenge[c.id]) items.push({ id: "r3-board", label: `Stage 3: no response chosen for the ${c.role}'s objection` });
      else items.push({ id: "r3-board", label: `Stage 3: no supporting line written for the ${c.role}'s objection` });
    }

    if (commitmentWords < COMMITMENT_MIN_WORDS) {
      items.push({
        id: "r3-commitment",
        label: `Stage 3: uncertainty commitment needs ${COMMITMENT_MIN_WORDS - commitmentWords} more word${COMMITMENT_MIN_WORDS - commitmentWords === 1 ? "" : "s"}`,
      });
    }

    return items;
  }, [
    nameComplete,
    pickedDrivers,
    pickedDecisions,
    orderComplete,
    resolutionWords,
    thresholdsMissing,
    marks,
    notIntended,
    exceptionWords,
    codesValid,
    pickedCodes,
    raciStatus,
    tradeoffsIncomplete,
    tradeoffOwner,
    tradeoffDefault,
    pickedIndicators,
    cadenceMissing,
    triggerWords,
    challengesIncomplete,
    challenge,
    commitmentWords,
  ]);

  return {
    hydrated,
    name,
    nameComplete,
    pickedDrivers,
    pickedDecisions,
    order,
    orderComplete,
    resolution,
    resolutionWords,
    stage1Complete,
    thresholds,
    thresholdsMissing,
    ruleReady,
    outcomes,
    outcomeCounts,
    marks,
    markedCount,
    notIntended,
    iterations,
    exceptionPath,
    exceptionWords,
    pickedCodes,
    stage2Complete,
    raci,
    raciStatus,
    doubleAccountable,
    tradeoffOwner,
    tradeoffDefault,
    pickedIndicators,
    cadence,
    trigger,
    triggerWords,
    challenge,
    challengeNote,
    commitment,
    commitmentWords,
    stage3Complete,
    allComplete,
    missing,
  };
}
