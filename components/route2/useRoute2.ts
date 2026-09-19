"use client";

import { useProgress, useHydrated } from "@/lib/store";
import type { MissingItem } from "@/components/ui/MissingList";
import {
  ALLOCATION_TOTAL,
  CANONICAL_ORDER,
  FACTORS,
  GUIDING_DECISIONS,
  GUIDING_PICK_COUNT,
  LAYERS,
  R2,
  RELEVANCE_REASONS,
  RELEVANCE_PICK_COUNT,
  RESPONSIBILITIES,
  ROLES,
  SEQUENCE_CLUE,
  responsibilityById,
  roleById,
  type FactorId,
  type LayerId,
  type ResponsibilityId,
  type RoleId,
  type SequencePosition,
} from "@/lib/route2";

/** DOM ids the missing-item list scrolls to and flashes. */
export const domId = {
  name: "r2-name",
  task: "task",

  roleLens: "r2-role-lens",
  reasons: "r2-reasons",
  relevanceJustification: "r2-relevance-justification",

  guidingPicker: "r2-guiding-picker",
  guidingJustification: (id: string) => `r2-guiding-justification-${id}`,

  sequenceBoard: "r2-sequence-board",
  firstMove: "r2-first-move",

  allocator: "r2-allocator",

  governanceBoard: "r2-governance-board",
  nowDecision: "r2-now-decision",
  riskOfWaiting: "r2-risk-of-waiting",

  export: "r2-export",
};

const isRoleId = (v: string | undefined): v is RoleId => !!v && ROLES.some((r) => r.id === v);

export type CheckResult = { holds: true } | { holds: false; clue: string; tier: "soft" | "sharp" };

/** DOM ids for the sequence board's three position slots. */
export const positionSlotId = (pos: SequencePosition) => `r2-position-${pos}`;
export const layerCardId = (layerId: string) => `r2-layer-${layerId}`;
export const responsibilityCardId = (id: string) => `r2-resp-${id}`;

export function useRoute2() {
  const hydrated = useHydrated();
  const notes = useProgress((s) => s.notes);
  const choices = useProgress((s) => s.choices);
  const checks = useProgress((s) => s.checks);

  const name = notes[R2.name] ?? "";

  // -- Stage A -----------------------------------------------------------
  const rawRoleLens = choices[R2.roleLens];
  const roleLens = isRoleId(rawRoleLens) ? rawRoleLens : null;
  const selectedReasons = RELEVANCE_REASONS.filter((r) => checks[R2.reason(r.id)]).map((r) => r.id);
  const relevanceJustification = (notes[R2.relevanceJustification] ?? "").trim();
  const stageAComplete = !!roleLens && selectedReasons.length === RELEVANCE_PICK_COUNT && !!relevanceJustification;

  // -- Stage B -------------------------------------------------------------
  const selectedGuiding = GUIDING_DECISIONS.filter((d) => checks[R2.guiding(d.id)]).map((d) => d.id);
  const guidingJustifications: Record<string, string> = {};
  for (const d of GUIDING_DECISIONS) guidingJustifications[d.id] = (notes[R2.guidingJustification(d.id)] ?? "").trim();
  const stageBComplete =
    selectedGuiding.length === GUIDING_PICK_COUNT && selectedGuiding.every((id) => guidingJustifications[id].length > 0);

  // -- Stage C ---------------------------------------------------------------
  const sequence: Record<LayerId, SequencePosition | null> = {} as any;
  for (const l of LAYERS) {
    const raw = choices[R2.sequence(l.id)];
    const n = Number(raw);
    sequence[l.id] = raw && [1, 2, 3].includes(n) ? (n as SequencePosition) : null;
  }
  const sequencedCount = LAYERS.filter((l) => sequence[l.id] !== null).length;
  const sequenceComplete = sequencedCount === LAYERS.length;
  const firstMove = (notes[R2.firstMove] ?? "").trim();
  const checkCountSeq = Number(notes[R2.checkCountSeq] ?? "0") || 0;
  const stageCComplete = sequenceComplete && !!firstMove;

  const checkSequence = (checkCountAfter: number): CheckResult => {
    const tier: "soft" | "sharp" = checkCountAfter >= 2 ? "sharp" : "soft";
    const matches = LAYERS.every((l) => sequence[l.id] === CANONICAL_ORDER[l.id]);
    if (matches) return { holds: true };
    return { holds: false, clue: SEQUENCE_CLUE[tier], tier };
  };
  const lastSeqCheck = sequenceComplete ? checkSequence(checkCountSeq) : null;

  // -- Stage D -----------------------------------------------------------
  const allocation: Record<FactorId, number> = {} as any;
  for (const f of FACTORS) allocation[f.id] = Number(notes[R2.allocation(f.id)] ?? "0") || 0;
  const allocationTotal = FACTORS.reduce((sum, f) => sum + allocation[f.id], 0);
  const stageDComplete = allocationTotal === ALLOCATION_TOTAL;
  const allocationRanked = [...FACTORS].sort((a, b) => allocation[b.id] - allocation[a.id]);

  // -- Stage E ---------------------------------------------------------------
  const responsibilityRole: Record<ResponsibilityId, RoleId | null> = {} as any;
  const respCheckCount: Record<ResponsibilityId, number> = {} as any;
  for (const r of RESPONSIBILITIES) {
    const raw = choices[R2.responsibilityRole(r.id)];
    responsibilityRole[r.id] = isRoleId(raw) ? raw : null;
    respCheckCount[r.id] = Number(notes[R2.checkCountResp(r.id)] ?? "0") || 0;
  }
  const byRole = (role: RoleId) => RESPONSIBILITIES.filter((r) => responsibilityRole[r.id] === role);
  const unassignedResponsibilities = RESPONSIBILITIES.filter((r) => !responsibilityRole[r.id]);
  const assignedCount = RESPONSIBILITIES.length - unassignedResponsibilities.length;

  const checkResponsibility = (id: ResponsibilityId, checkCountAfter: number): CheckResult => {
    const resp = responsibilityById(id);
    const placed = responsibilityRole[id];
    if (!placed) return { holds: true };
    const tier: "soft" | "sharp" = checkCountAfter >= 2 ? "sharp" : "soft";
    if (placed === resp.expected) return { holds: true };
    return { holds: false, clue: resp.clue[tier], tier };
  };

  const nowDecision = (notes[R2.nowDecision] ?? "").trim();
  const riskOfWaiting = (notes[R2.riskOfWaiting] ?? "").trim();
  const stageEComplete = assignedCount === RESPONSIBILITIES.length && !!nowDecision && !!riskOfWaiting;

  // -- Missing list ----------------------------------------------------------
  const missing: MissingItem[] = [];
  if (!name.trim()) missing.push({ id: domId.name, label: "Your name — needed to label the export" });

  if (!roleLens) missing.push({ id: domId.roleLens, label: "Stage A — pick a role lens" });
  if (selectedReasons.length !== RELEVANCE_PICK_COUNT) {
    missing.push({ id: domId.reasons, label: `Stage A — pick exactly ${RELEVANCE_PICK_COUNT} reasons (currently ${selectedReasons.length})` });
  }
  if (!relevanceJustification) missing.push({ id: domId.relevanceJustification, label: "Stage A — justification is empty" });

  if (selectedGuiding.length !== GUIDING_PICK_COUNT) {
    missing.push({ id: domId.guidingPicker, label: `Stage B — pick exactly ${GUIDING_PICK_COUNT} guiding decisions (currently ${selectedGuiding.length})` });
  }
  for (const id of selectedGuiding) {
    if (!guidingJustifications[id]) {
      missing.push({ id: domId.guidingJustification(id), label: `Stage B — justification for "${GUIDING_DECISIONS.find((d) => d.id === id)!.text.slice(0, 40)}…" is empty` });
    }
  }

  for (const l of LAYERS) {
    if (sequence[l.id] === null) missing.push({ id: domId.sequenceBoard, label: `Stage C — ${l.name} not placed in the sequence yet` });
  }
  if (!firstMove) missing.push({ id: domId.firstMove, label: "Stage C — no concrete first move written yet" });

  if (allocationTotal !== ALLOCATION_TOTAL) {
    missing.push({ id: domId.allocator, label: `Stage D — allocation totals ${allocationTotal}, needs to total exactly 100` });
  }

  for (const r of unassignedResponsibilities) {
    missing.push({ id: domId.governanceBoard, label: `Stage E — "${r.name}" not assigned to a role yet` });
  }
  if (!nowDecision) missing.push({ id: domId.nowDecision, label: "Stage E — the decision to take now is empty" });
  if (!riskOfWaiting) missing.push({ id: domId.riskOfWaiting, label: "Stage E — the risk of waiting is empty" });

  return {
    hydrated,
    name,

    roleLens,
    selectedReasons,
    relevanceJustification,
    stageAComplete,

    selectedGuiding,
    guidingJustifications,
    stageBComplete,

    sequence,
    sequencedCount,
    sequenceComplete,
    firstMove,
    checkCountSeq,
    checkSequence,
    lastSeqCheck,
    stageCComplete,

    allocation,
    allocationTotal,
    allocationRanked,
    stageDComplete,

    responsibilityRole,
    byRole,
    unassignedResponsibilities,
    assignedCount,
    respCheckCount,
    checkResponsibility,
    nowDecision,
    riskOfWaiting,
    stageEComplete,

    missing,
    allComplete: missing.length === 0,
  };
}

export type Route2State = ReturnType<typeof useRoute2>;
export { roleById };
