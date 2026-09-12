"use client";

import { useMemo } from "react";
import { useProgress, useHydrated } from "@/lib/store";
import {
  R2,
  EVIDENCE_CARDS,
  CRITERIA,
  GATES,
  MEASURES,
  CONSTRAINTS,
  RISKS,
  RISK_PICK_COUNT,
  WEIGHT_TOTAL,
  JUSTIFICATION_MIN_WORDS,
  UNCERTAINTY_MIN_WORDS,
  type ConfidenceId,
  type RelevanceId,
  type StanceId,
  type CriterionId,
  type MeasureId,
} from "@/lib/route2";

export type MissingItem = { id: string; label: string };

const words = (v: string) => v.trim().split(/\s+/).filter(Boolean).length;

export function useRoute2() {
  const hydrated = useHydrated();
  const seen = useProgress((s) => s.seen);
  const choices = useProgress((s) => s.choices);
  const checks = useProgress((s) => s.checks);
  const notes = useProgress((s) => s.notes);

  const name = hydrated ? notes[R2.name] ?? "" : "";
  const nameComplete = name.trim().length > 0;

  // --- Stage 1 — evidence audit --------------------------------------------
  const flipped = useMemo(() => (hydrated ? seen[R2.flipped] ?? [] : []), [hydrated, seen]);

  const confidence = useMemo(() => {
    const map: Record<string, ConfidenceId | undefined> = {};
    if (!hydrated) return map;
    for (const c of EVIDENCE_CARDS) {
      const v = choices[R2.stage1.confidence(c.id)];
      if (v) map[c.id] = v as ConfidenceId;
    }
    return map;
  }, [hydrated, choices]);

  const relevance = useMemo(() => {
    const map: Record<string, RelevanceId | undefined> = {};
    if (!hydrated) return map;
    for (const c of EVIDENCE_CARDS) {
      const v = choices[R2.stage1.relevance(c.id)];
      if (v) map[c.id] = v as RelevanceId;
    }
    return map;
  }, [hydrated, choices]);

  const stance = (hydrated ? choices[R2.stage1.stance] : undefined) as StanceId | undefined;

  /** The pair only conflicts once both are flipped and rated — that's when the panel is due. */
  const conflictPair = useMemo(() => EVIDENCE_CARDS.filter((c) => c.conflictsWith), []);
  const contradictionDue = conflictPair.every(
    (c) => flipped.includes(c.id) && confidence[c.id] && relevance[c.id],
  );

  const auditedCount = EVIDENCE_CARDS.filter((c) => confidence[c.id] && relevance[c.id]).length;
  const confidenceIndex = useMemo(() => {
    const tally = { verified: 0, partial: 0, assumed: 0 };
    for (const c of EVIDENCE_CARDS) {
      const v = confidence[c.id];
      if (v) tally[v] += 1;
    }
    return tally;
  }, [confidence]);

  const stage1Complete = auditedCount === EVIDENCE_CARDS.length && !!stance;

  // --- Stage 2 — weights, gates, scores ------------------------------------
  const weights = useMemo(() => {
    const map: Record<CriterionId, number> = { environmental: 0, economic: 0, feasibility: 0, leverage: 0 };
    if (!hydrated) return map;
    for (const c of CRITERIA) {
      const raw = notes[R2.stage2.weight(c.id)];
      const n = raw === undefined || raw === "" ? NaN : Number(raw);
      map[c.id] = Number.isFinite(n) ? n : 0;
    }
    return map;
  }, [hydrated, notes]);

  const weightTotal = CRITERIA.reduce((sum, c) => sum + (weights[c.id] || 0), 0);
  const weightsValid = weightTotal === WEIGHT_TOTAL;

  const weightWhy = useMemo(() => {
    const map: Record<string, string | undefined> = {};
    if (!hydrated) return map;
    for (const c of CRITERIA) map[c.id] = choices[R2.stage2.weightWhy(c.id)];
    return map;
  }, [hydrated, choices]);
  const weightWhyMissing = CRITERIA.filter((c) => !weightWhy[c.id]);

  const gateAnswer = useMemo(() => {
    const map: Record<string, string | undefined> = {};
    if (!hydrated) return map;
    for (const g of GATES) map[`${g.measureId}:${g.criterionId}`] = choices[R2.stage2.gate(g.measureId, g.criterionId)];
    return map;
  }, [hydrated, choices]);

  const score = useMemo(() => {
    const map: Record<string, number | undefined> = {};
    if (!hydrated) return map;
    for (const g of GATES) {
      const raw = choices[R2.stage2.score(g.measureId, g.criterionId)];
      const n = raw ? Number(raw) : NaN;
      if (Number.isFinite(n)) map[`${g.measureId}:${g.criterionId}`] = n;
    }
    return map;
  }, [hydrated, choices]);

  const gatesAnswered = GATES.filter((g) => gateAnswer[`${g.measureId}:${g.criterionId}`]).length;
  const scoresSet = GATES.filter((g) => score[`${g.measureId}:${g.criterionId}`] !== undefined).length;

  /** Weighted total per measure, on the learner's own weights and scores. */
  const totals = useMemo(() => {
    const out: Record<MeasureId, number> = { A: 0, B: 0, C: 0 };
    for (const m of MEASURES) {
      let sum = 0;
      for (const c of CRITERIA) {
        const s = score[`${m.id}:${c.id}`];
        if (s !== undefined) sum += s * ((weights[c.id] || 0) / 100);
      }
      out[m.id] = sum;
    }
    return out;
  }, [score, weights]);

  const derivedRanking = useMemo(
    () => [...MEASURES].sort((a, b) => totals[b.id] - totals[a.id]).map((m) => m.id),
    [totals],
  );

  const sensitivity = hydrated ? choices[R2.stage2.sensitivity] : undefined;
  const sensitivityNote = hydrated ? notes[R2.stage2.sensitivityNote] ?? "" : "";
  const sensitivityComplete = !!sensitivity && sensitivityNote.trim().length > 0;

  const stage2Complete =
    weightsValid && weightWhyMissing.length === 0 && gatesAnswered === GATES.length && scoresSet === GATES.length && sensitivityComplete;

  // --- Stage 3 — constraints, shock, commitment ----------------------------
  const constraintPlacement = useMemo(() => {
    const map: Record<string, MeasureId | undefined> = {};
    if (!hydrated) return map;
    for (const c of CONSTRAINTS) {
      const v = choices[R2.stage3.constraint(c.id)];
      if (v === "A" || v === "B" || v === "C") map[c.id] = v;
    }
    return map;
  }, [hydrated, choices]);

  const mitigation = useMemo(() => {
    const map: Record<string, string> = {};
    if (!hydrated) return map;
    for (const c of CONSTRAINTS) map[c.id] = notes[R2.stage3.mitigation(c.id)] ?? "";
    return map;
  }, [hydrated, notes]);

  const constraintsPlaced = CONSTRAINTS.filter((c) => constraintPlacement[c.id]).length;
  const mitigationsMissing = CONSTRAINTS.filter((c) => constraintPlacement[c.id] && words(mitigation[c.id] ?? "") < 5);

  const shock = hydrated ? choices[R2.stage3.shock] : undefined;
  const shockNote = hydrated ? notes[R2.stage3.shockNote] ?? "" : "";
  const shockComplete = !!shock && shockNote.trim().length > 0;

  const rank = useMemo(() => {
    const map: Record<MeasureId, number | undefined> = { A: undefined, B: undefined, C: undefined };
    if (!hydrated) return map;
    for (const m of MEASURES) {
      const raw = choices[R2.stage3.rank(m.id)];
      const n = raw ? Number(raw) : NaN;
      if (Number.isFinite(n)) map[m.id] = n;
    }
    return map;
  }, [hydrated, choices]);
  const rankValues = MEASURES.map((m) => rank[m.id]).filter((v): v is number => v !== undefined);
  const rankComplete = rankValues.length === MEASURES.length && new Set(rankValues).size === MEASURES.length;

  const justification = hydrated ? notes[R2.stage3.justification] ?? "" : "";
  const justificationWords = words(justification);

  const pickedRisks = useMemo(
    () => (hydrated ? RISKS.filter((r) => checks[R2.stage3.risk(r.id)]).map((r) => r.id) : []),
    [hydrated, checks],
  );
  const riskNote = useMemo(() => {
    const map: Record<string, string> = {};
    if (!hydrated) return map;
    for (const id of pickedRisks) map[id] = notes[R2.stage3.riskNote(id)] ?? "";
    return map;
  }, [hydrated, notes, pickedRisks]);
  const riskNotesMissing = pickedRisks.filter((id) => (riskNote[id] ?? "").trim().length === 0);

  const uncertainty = hydrated ? notes[R2.stage3.uncertainty] ?? "" : "";
  const uncertaintyWords = words(uncertainty);

  const stage3Complete =
    constraintsPlaced === CONSTRAINTS.length &&
    mitigationsMissing.length === 0 &&
    shockComplete &&
    rankComplete &&
    justificationWords >= JUSTIFICATION_MIN_WORDS &&
    pickedRisks.length === RISK_PICK_COUNT &&
    riskNotesMissing.length === 0 &&
    uncertaintyWords >= UNCERTAINTY_MIN_WORDS;

  const allComplete = nameComplete && stage1Complete && stage2Complete && stage3Complete;

  const missing = useMemo<MissingItem[]>(() => {
    const items: MissingItem[] = [];
    if (!nameComplete) items.push({ id: "r2-name", label: "Add your name so the export can be labelled correctly" });

    // Stage 1
    const unflipped = EVIDENCE_CARDS.filter((c) => !flipped.includes(c.id));
    if (unflipped.length > 0) {
      items.push({
        id: "r2-evidence",
        label: `Stage 1: ${unflipped.length} evidence card${unflipped.length === 1 ? "" : "s"} not yet flipped to reveal source and method (${unflipped
          .map((c) => `#${c.n}`)
          .join(", ")})`,
      });
    }
    for (const c of EVIDENCE_CARDS) {
      if (!flipped.includes(c.id)) continue;
      if (!confidence[c.id]) items.push({ id: "r2-evidence", label: `Stage 1: no confidence tag on evidence card #${c.n}` });
      if (!relevance[c.id]) items.push({ id: "r2-evidence", label: `Stage 1: decision relevance not set for evidence card #${c.n}` });
    }
    if (contradictionDue && !stance) {
      items.push({ id: "r2-contradiction", label: "Stage 1: choose how you reconcile the contradiction between cards #5 and #6" });
    }

    // Stage 2
    if (!weightsValid) {
      items.push({
        id: "r2-weights",
        label: `Stage 2: criteria weights total ${weightTotal}, not ${WEIGHT_TOTAL} — adjust by ${Math.abs(WEIGHT_TOTAL - weightTotal)}`,
      });
    }
    for (const c of weightWhyMissing) {
      items.push({ id: "r2-weights", label: `Stage 2: no justification chosen for the ${c.label} weight` });
    }
    for (const g of GATES) {
      const key = `${g.measureId}:${g.criterionId}`;
      const criterion = CRITERIA.find((c) => c.id === g.criterionId)?.label ?? g.criterionId;
      if (!gateAnswer[key]) {
        items.push({ id: `r2-cell-${g.measureId}-${g.criterionId}`, label: `Stage 2: reasoning question unanswered — Measure ${g.measureId} × ${criterion}` });
      } else if (score[key] === undefined) {
        items.push({ id: `r2-cell-${g.measureId}-${g.criterionId}`, label: `Stage 2: no score set — Measure ${g.measureId} × ${criterion}` });
      }
    }
    if (!sensitivity) items.push({ id: "r2-sensitivity", label: "Stage 2: run the sensitivity test and record whether the ranking held or flipped" });
    else if (!sensitivityNote.trim()) items.push({ id: "r2-sensitivity", label: "Stage 2: add your one-line note on what the sensitivity test told you" });

    // Stage 3
    for (const c of CONSTRAINTS) {
      if (!constraintPlacement[c.id]) {
        items.push({ id: "r2-constraints", label: `Stage 3: constraint not placed — “${c.text}”` });
      } else if (words(mitigation[c.id] ?? "") < 5) {
        items.push({ id: "r2-constraints", label: `Stage 3: mitigation too short for “${c.text}”` });
      }
    }
    if (!shock) items.push({ id: "r2-shock", label: "Stage 3: answer the mid-year update — does your ranking change?" });
    else if (!shockNote.trim()) items.push({ id: "r2-shock", label: "Stage 3: add your one-line reason for the mid-year update answer" });

    if (!rankComplete) {
      items.push({ id: "r2-rank", label: "Stage 3: give all three measures a distinct rank (1, 2, 3)" });
    }
    if (justificationWords < JUSTIFICATION_MIN_WORDS) {
      items.push({
        id: "r2-justification",
        label: `Stage 3: core justification needs ${JUSTIFICATION_MIN_WORDS - justificationWords} more word${
          JUSTIFICATION_MIN_WORDS - justificationWords === 1 ? "" : "s"
        }`,
      });
    }
    if (pickedRisks.length !== RISK_PICK_COUNT) {
      items.push({
        id: "r2-risks",
        label:
          pickedRisks.length < RISK_PICK_COUNT
            ? `Stage 3: select ${RISK_PICK_COUNT - pickedRisks.length} more risk${RISK_PICK_COUNT - pickedRisks.length === 1 ? "" : "s"} of a visible-but-weak choice`
            : `Stage 3: you have ${pickedRisks.length} risks selected — narrow to ${RISK_PICK_COUNT}`,
      });
    }
    for (const id of riskNotesMissing) {
      const label = RISKS.find((r) => r.id === id)?.label ?? id;
      items.push({ id: "r2-risks", label: `Stage 3: no consequence written for the risk “${label}”` });
    }
    if (uncertaintyWords < UNCERTAINTY_MIN_WORDS) {
      items.push({
        id: "r2-uncertainty",
        label: `Stage 3: uncertainty statement needs ${UNCERTAINTY_MIN_WORDS - uncertaintyWords} more word${
          UNCERTAINTY_MIN_WORDS - uncertaintyWords === 1 ? "" : "s"
        }`,
      });
    }

    return items;
  }, [
    nameComplete,
    flipped,
    confidence,
    relevance,
    contradictionDue,
    stance,
    weightsValid,
    weightTotal,
    weightWhyMissing,
    gateAnswer,
    score,
    sensitivity,
    sensitivityNote,
    constraintPlacement,
    mitigation,
    shock,
    shockNote,
    rankComplete,
    justificationWords,
    pickedRisks,
    riskNotesMissing,
    uncertaintyWords,
  ]);

  return {
    hydrated,
    name,
    nameComplete,
    flipped,
    confidence,
    relevance,
    auditedCount,
    confidenceIndex,
    contradictionDue,
    stance,
    stage1Complete,
    weights,
    weightTotal,
    weightsValid,
    weightWhy,
    gateAnswer,
    score,
    gatesAnswered,
    scoresSet,
    totals,
    derivedRanking,
    sensitivity,
    sensitivityNote,
    stage2Complete,
    constraintPlacement,
    mitigation,
    constraintsPlaced,
    shock,
    shockNote,
    rank,
    rankComplete,
    justification,
    justificationWords,
    pickedRisks,
    riskNote,
    uncertainty,
    uncertaintyWords,
    stage3Complete,
    allComplete,
    missing,
  };
}
