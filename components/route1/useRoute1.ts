"use client";

import { useMemo } from "react";
import { useProgress, useHydrated } from "@/lib/store";
import {
  R1,
  ZONES,
  FINDINGS,
  PRIORITY_PICK_COUNT,
  JUSTIFICATION_MIN_WORDS,
  type CategoryId,
  type DriverId,
  type HorizonId,
  type DirectionId,
} from "@/lib/route1";

export type MissingItem = { id: string; label: string };

const wordCount = (v: string) => v.trim().split(/\s+/).filter(Boolean).length;

export function useRoute1() {
  const hydrated = useHydrated();
  const seen = useProgress((s) => s.seen);
  const choices = useProgress((s) => s.choices);
  const checks = useProgress((s) => s.checks);
  const notes = useProgress((s) => s.notes);

  const name = hydrated ? notes[R1.name] ?? "" : "";
  const nameComplete = name.trim().length > 0;

  // --- Stage 1a — walk the floor --------------------------------------------
  const zonesSeen = useMemo(() => (hydrated ? seen[R1.zones] ?? [] : []), [hydrated, seen]);
  const zonesMissing = useMemo(() => ZONES.filter((z) => !zonesSeen.includes(z.id)), [zonesSeen]);
  const walkComplete = zonesMissing.length === 0;

  /** Findings the learner has actually discovered — everything downstream works off this. */
  const loggedFindings = useMemo(() => FINDINGS.filter((f) => zonesSeen.includes(f.zoneId)), [zonesSeen]);

  // --- Stage 1b — sort into the six areas ----------------------------------
  const category = useMemo(() => {
    const map: Record<string, CategoryId | undefined> = {};
    if (!hydrated) return map;
    for (const f of FINDINGS) {
      const v = choices[R1.stage1.category(f.id)];
      if (v) map[f.id] = v as CategoryId;
    }
    return map;
  }, [hydrated, choices]);
  const sortedCount = FINDINGS.filter((f) => category[f.id]).length;
  const sortComplete = sortedCount >= FINDINGS.length;

  // --- Stage 2 — diagnose ---------------------------------------------------
  const driver = useMemo(() => {
    const map: Record<string, DriverId | undefined> = {};
    if (!hydrated) return map;
    for (const f of FINDINGS) {
      const v = choices[R1.stage2.driver(f.id)];
      if (v === "individual" || v === "structural") map[f.id] = v;
    }
    return map;
  }, [hydrated, choices]);

  const horizon = useMemo(() => {
    const map: Record<string, HorizonId | undefined> = {};
    if (!hydrated) return map;
    for (const f of FINDINGS) {
      const v = choices[R1.stage2.horizon(f.id)];
      if (v === "shortTerm" || v === "structuralChange") map[f.id] = v;
    }
    return map;
  }, [hydrated, choices]);

  const diagnosedCount = FINDINGS.filter((f) => driver[f.id] && horizon[f.id]).length;
  const diagnoseComplete = diagnosedCount >= FINDINGS.length;

  const structuralCount = FINDINGS.filter((f) => driver[f.id] === "structural").length;
  const individualCount = FINDINGS.filter((f) => driver[f.id] === "individual").length;
  const shortTermCount = FINDINGS.filter((f) => horizon[f.id] === "shortTerm").length;
  const structuralChangeCount = FINDINGS.filter((f) => horizon[f.id] === "structuralChange").length;

  // --- Stage 3 — decide -----------------------------------------------------
  const priorities = useMemo(
    () => (hydrated ? FINDINGS.filter((f) => checks[R1.stage3.priority(f.id)]).map((f) => f.id) : []),
    [hydrated, checks],
  );

  const direction = useMemo(() => {
    const map: Record<string, DirectionId | undefined> = {};
    if (!hydrated) return map;
    for (const id of priorities) {
      const v = choices[R1.stage3.direction(id)];
      if (v) map[id] = v as DirectionId;
    }
    return map;
  }, [hydrated, choices, priorities]);

  const justification = useMemo(() => {
    const map: Record<string, string> = {};
    if (!hydrated) return map;
    for (const id of priorities) map[id] = notes[R1.stage3.justification(id)] ?? "";
    return map;
  }, [hydrated, notes, priorities]);

  const pickCountRight = priorities.length === PRIORITY_PICK_COUNT;
  const decideComplete =
    pickCountRight &&
    priorities.every((id) => direction[id] && wordCount(justification[id] ?? "") >= JUSTIFICATION_MIN_WORDS);

  const allComplete = nameComplete && walkComplete && sortComplete && diagnoseComplete && decideComplete;

  const missing = useMemo<MissingItem[]>(() => {
    const items: MissingItem[] = [];
    if (!nameComplete) items.push({ id: "r1-name", label: "Add your name so the export can be labelled correctly" });

    if (!walkComplete) {
      items.push({
        id: "r1-walk",
        label: `Stage 1: ${zonesMissing.length} zone${zonesMissing.length === 1 ? "" : "s"} not yet investigated — ${zonesMissing
          .map((z) => `${z.letter} (${z.label})`)
          .join(", ")}`,
      });
    }

    if (!sortComplete) {
      const unsorted = FINDINGS.filter((f) => !category[f.id] && zonesSeen.includes(f.zoneId));
      if (unsorted.length > 0) {
        items.push({
          id: "r1-sort",
          label: `Stage 1: ${unsorted.length} finding${unsorted.length === 1 ? "" : "s"} not yet sorted into an area (${unsorted
            .map((f) => ZONES.find((z) => z.id === f.zoneId)?.letter ?? "?")
            .join(", ")})`,
        });
      }
    }

    if (!diagnoseComplete) {
      const undiagnosed = FINDINGS.filter((f) => zonesSeen.includes(f.zoneId) && !(driver[f.id] && horizon[f.id]));
      if (undiagnosed.length > 0) {
        items.push({
          id: "r1-diagnose",
          label: `Stage 2: ${undiagnosed.length} finding${undiagnosed.length === 1 ? "" : "s"} still missing a diagnosis answer (${undiagnosed
            .map((f) => ZONES.find((z) => z.id === f.zoneId)?.letter ?? "?")
            .join(", ")})`,
        });
      }
    }

    if (!pickCountRight) {
      items.push({
        id: "r1-decide",
        label:
          priorities.length < PRIORITY_PICK_COUNT
            ? `Stage 3: choose ${PRIORITY_PICK_COUNT - priorities.length} more finding${
                PRIORITY_PICK_COUNT - priorities.length === 1 ? "" : "s"
              } to act on first`
            : `Stage 3: you have ${priorities.length} findings selected — narrow it down to ${PRIORITY_PICK_COUNT}`,
      });
    } else {
      for (const id of priorities) {
        const f = FINDINGS.find((x) => x.id === id);
        const letter = ZONES.find((z) => z.id === f?.zoneId)?.letter ?? "?";
        if (!direction[id]) {
          items.push({ id: "r1-decide", label: `Stage 3: choose a direction for finding ${letter}` });
        }
        const words = wordCount(justification[id] ?? "");
        if (words < JUSTIFICATION_MIN_WORDS) {
          items.push({
            id: "r1-decide",
            label: `Stage 3: justify finding ${letter} — ${JUSTIFICATION_MIN_WORDS - words} more word${
              JUSTIFICATION_MIN_WORDS - words === 1 ? "" : "s"
            } needed`,
          });
        }
      }
    }

    return items;
  }, [
    nameComplete,
    walkComplete,
    zonesMissing,
    zonesSeen,
    sortComplete,
    category,
    diagnoseComplete,
    driver,
    horizon,
    pickCountRight,
    priorities,
    direction,
    justification,
  ]);

  return {
    hydrated,
    name,
    nameComplete,
    zonesSeen,
    zonesMissing,
    walkComplete,
    loggedFindings,
    category,
    sortedCount,
    sortComplete,
    driver,
    horizon,
    diagnosedCount,
    diagnoseComplete,
    structuralCount,
    individualCount,
    shortTermCount,
    structuralChangeCount,
    priorities,
    direction,
    justification,
    decideComplete,
    allComplete,
    missing,
  };
}
