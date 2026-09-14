"use client";

import { useProgress, useHydrated } from "@/lib/store";
import type { MissingItem } from "@/components/ui/MissingList";
import {
  MEMO_SECTIONS,
  QUARTERS,
  R2,
  RANK_SLOTS,
  RELEVANCE_DRIVERS,
  RELEVANCE_REQUIRED,
  RESPONSIBILITIES,
  ROLES,
  SECTION_1,
  SECTION_2,
  SECTION_3,
  SECTION_5,
  SECTION_6,
  SECTION_7,
  SELF_ASSESSMENT_ITEMS,
  TRADEOFF_MIN,
  factorLabel,
  isOptionId,
  isQuarter,
  isRoleId,
  isSelfAssessmentValue,
  type OptionId,
  type Quarter,
  type RelevanceId,
  type ResponsibilityId,
  type RoleId,
  type SelfAssessmentValue,
} from "@/lib/route2";
import type { RaciCell } from "@/components/ui/RaciGrid";
import { validate as validateRaci } from "@/components/ui/RaciGrid";
import { parseCriteriaOrder } from "./ranking";
import { parseLinks } from "./tradeoffs";

/** DOM ids the missing list, clues and reference chips scroll to. */
export const domId = {
  name: "r2-name",
  task: "r2-task",

  relevance: "r2-s1",
  relevanceDriver: "r2-s1-drivers",
  relevanceRationale: "r2-s1-rationale",

  guiding: "r2-s2",
  guidingText: (n: 1 | 2 | 3) => `r2-s2-${n}-text`,
  guidingOwner: (n: 1 | 2 | 3) => `r2-s2-${n}-owner`,
  guidingQuarter: (n: 1 | 2 | 3) => `r2-s2-${n}-quarter`,

  logic: "r2-s3",
  criteriaRank: "r2-s3-rank",
  boundary: "r2-s3-boundary",

  tradeoffs: "r2-s4",
  tradeoffNote: (a: string, b: string) => `r2-s4-note-${a}-${b}`,

  measure: "r2-s5",
  firstMeasure: "r2-s5-option",
  justification: "r2-s5-justification",
  committedBudget: "r2-s5-budget",

  governance: "r2-s6",
  raciRow: (id: string) => `r2-s6-row-${id}`,
  reviewMechanism: "r2-s6-review",

  decideNow: "r2-s7",
  decisionNow: "r2-s7-decision",
  confidence: "r2-s7-confidence",
  changeMyMind: "r2-s7-changemymind",

  selfAssessment: "r2-selfassessment",
  checkMemo: "r2-check",
  memo: "r2-memo",
  memoSection: (n: number) => `r2-memo-${n}`,

  export: "r2-export",
};

const NO_STRINGS: Record<string, string> = {};
const NO_BOOLS: Record<string, boolean> = {};

export type GuidingDecision = { text: string; owner: RoleId | null; quarter: Quarter | null };

/**
 * Joins the shared progress store to Route 2's content — the material's
 * read/opened state and the whole seven-section task, one hook. Until the
 * store has hydrated it reads as empty, matching the statically exported HTML
 * (Route 1's useRoute1 does the same, for the same hydration-safety reason).
 */
export function useRoute2() {
  const hydrated = useHydrated();
  const rawNotes = useProgress((s) => s.notes);
  const rawChoices = useProgress((s) => s.choices);
  const rawChecks = useProgress((s) => s.checks);
  const choose = useProgress((s) => s.choose);

  const notes = hydrated ? rawNotes : NO_STRINGS;
  const choices = hydrated ? rawChoices : NO_STRINGS;
  const checks = hydrated ? rawChecks : NO_BOOLS;

  const name = notes[R2.name] ?? "";
  const mentorSample = !!checks[R2.mentorSample];

  // -- Material ---------------------------------------------------------------
  const hotspotsRead = ["h1", "h2", "h3", "h4", "h5", "h6"].filter((id) => checks[R2.hotspotRead(id)]).length;

  // -- Section 1: strategic relevance ------------------------------------------
  const relevanceSelected = RELEVANCE_DRIVERS.map((d) => d.id).filter((id) => checks[R2.relevance(id)]) as RelevanceId[];
  const relevanceRationale = notes[R2.relevanceRationale] ?? "";

  // -- Section 2: guiding decisions ---------------------------------------------
  const guidingDecisions: GuidingDecision[] = ([1, 2, 3] as const).map((n) => {
    const owner = choices[R2.guidingOwner(n)];
    const quarter = choices[R2.guidingQuarter(n)];
    return {
      text: notes[R2.guidingText(n)] ?? "",
      owner: isRoleId(owner) ? owner : null,
      quarter: isQuarter(quarter) ? quarter : null,
    };
  });

  // -- Section 3: decision logic -------------------------------------------------
  const criteriaOrder = parseCriteriaOrder(notes[R2.criteriaRank]);
  const boundary = notes[R2.boundary] ?? "";

  // -- Section 4: trade-offs -------------------------------------------------------
  const tradeOffLinks = parseLinks(notes[R2.tradeOffs]);
  const pendingLink = choices[R2.pendingLink] || null;

  // -- Section 5: first measure ---------------------------------------------------
  const rawMeasure = choices[R2.firstMeasure];
  const firstMeasure: OptionId | null = isOptionId(rawMeasure) ? rawMeasure : null;
  const justification = notes[R2.justification] ?? "";
  const committedBudgetAnswer = notes[R2.committedBudget] ?? "";

  // -- Section 6: governance --------------------------------------------------------
  const raciValue = (responsibilityId: string, roleId: string): RaciCell => {
    const v = choices[R2.raci(responsibilityId, roleId)];
    return v === "R" || v === "A" || v === "C" || v === "I" ? v : "";
  };
  const raciRoles = ROLES.map((r) => ({ id: r.id, name: r.label, short: r.label.split(" ")[0], canBindCapacity: true }));
  const raciViolations = validateRaci(RESPONSIBILITIES, raciRoles, raciValue, [], {
    manyA: "More than one Accountable in this row.",
    noA: "No Accountable in this row.",
    noR: "No Responsible in this row.",
    authority: "",
  });
  const raciTouched = (id: string) => ROLES.some((r) => raciValue(id, r.id) !== "");
  const reviewMechanism = notes[R2.reviewMechanism] ?? "";

  // -- Section 7: decide now -------------------------------------------------------
  const decisionNow = notes[R2.decisionNow] ?? "";
  // Confidence has no "unset" state — 0 is itself a meaningful reading, unlike
  // Route 1's 1..N predict sliders where 0 means "not touched". It is also not
  // a required field (§10 never lists it), so it simply defaults to a midpoint.
  const confidence = Number(choices[R2.confidence] ?? "50") || 0;
  const changeMyMind = notes[R2.changeMyMind] ?? "";

  // -- Self-assessment (never validated) -------------------------------------------
  const selfAssessment = Object.fromEntries(
    SELF_ASSESSMENT_ITEMS.map((item) => {
      const v = choices[R2.selfAssess(item.id)];
      return [item.id, isSelfAssessmentValue(v) ? v : null];
    }),
  ) as Record<string, SelfAssessmentValue | null>;

  // -- Memo section "drafted" state, for the live preview's placeholders ------------
  const drafted = {
    1: relevanceRationale.trim().length > 0 || !!firstMeasure, // executive summary composes from both
    2: relevanceSelected.length > 0 && relevanceRationale.trim().length > 0,
    3: guidingDecisions.some((g) => g.text.trim()),
    4: criteriaOrder.length > 0 || boundary.trim().length > 0,
    5: tradeOffLinks.length > 0,
    6: !!firstMeasure && justification.trim().length > 0,
    7: RESPONSIBILITIES.some((r) => raciTouched(r.id)) || reviewMechanism.trim().length > 0,
    8: decisionNow.trim().length > 0,
  } as Record<number, boolean>;

  // -- Missing list (§10, literal strings; standard #1: one per concrete gap) ------
  const missing: MissingItem[] = [];

  if (!name.trim()) missing.push({ id: domId.name, label: "Participant name not entered — export filename will be incomplete" });

  if (relevanceSelected.length !== RELEVANCE_REQUIRED) {
    missing.push({ id: domId.relevanceDriver, label: `Section 1 — Strategic relevance: ${relevanceSelected.length} of ${RELEVANCE_REQUIRED} drivers selected` });
  }
  if (relevanceRationale.trim().length < SECTION_1.rationale.min) {
    missing.push({ id: domId.relevanceRationale, label: `Section 1 — Rationale is ${relevanceRationale.trim().length} characters, needs at least ${SECTION_1.rationale.min}` });
  }

  guidingDecisions.forEach((g, i) => {
    const n = i + 1;
    if (!g.text.trim()) missing.push({ id: domId.guidingText(n as 1 | 2 | 3), label: `Section 2 — Guiding decision ${n}: text empty` });
    if (!g.owner) missing.push({ id: domId.guidingOwner(n as 1 | 2 | 3), label: `Section 2 — Guiding decision ${n}: owner not assigned` });
    if (!g.quarter) missing.push({ id: domId.guidingQuarter(n as 1 | 2 | 3), label: `Section 2 — Guiding decision ${n}: quarter not assigned` });
  });

  if (criteriaOrder.length < RANK_SLOTS) {
    missing.push({ id: domId.criteriaRank, label: `Section 3 — Criteria ranking incomplete (${criteriaOrder.length} of ${RANK_SLOTS} placed)` });
  }
  if (boundary.trim().length < SECTION_3.boundary.min) {
    missing.push({ id: domId.boundary, label: "Section 3 — Assessment boundary not stated" });
  }

  if (tradeOffLinks.length < TRADEOFF_MIN) {
    missing.push({ id: domId.tradeoffs, label: `Section 4 — Only ${tradeOffLinks.length} trade-off drawn, at least ${TRADEOFF_MIN} required` });
  }
  for (const link of tradeOffLinks) {
    if (!link.note.trim()) {
      missing.push({
        id: domId.tradeoffNote(link.a, link.b),
        label: `Section 4 — Trade-off "${factorLabel(link.a)} ↔ ${factorLabel(link.b)}": note empty`,
      });
    }
  }

  if (!firstMeasure) missing.push({ id: domId.firstMeasure, label: "Section 5 — First measure not selected" });
  if (justification.trim().length < SECTION_5.justification.min) {
    missing.push({ id: domId.justification, label: `Section 5 — Justification is ${justification.trim().length} characters, needs at least ${SECTION_5.justification.min}` });
  }
  if (committedBudgetAnswer.trim().length < SECTION_5.budgetQuestion.min) {
    missing.push({ id: domId.committedBudget, label: "Section 5 — Committed-budget question not answered" });
  }

  for (const resp of RESPONSIBILITIES) {
    const accountable = ROLES.filter((r) => raciValue(resp.id, r.id) === "A");
    if (accountable.length !== 1) {
      missing.push({
        id: domId.raciRow(resp.id),
        label: `Section 6 — Responsibility "${resp.label}": ${accountable.length === 0 ? "no accountable role assigned" : "more than one accountable role assigned"}`,
      });
    }
  }
  if (reviewMechanism.trim().length < SECTION_6.review.min) {
    missing.push({ id: domId.reviewMechanism, label: "Section 6 — Review mechanism not described" });
  }

  if (decisionNow.trim().length < SECTION_7.decision.min) {
    missing.push({ id: domId.decisionNow, label: `Section 7 — Decision under uncertainty is ${decisionNow.trim().length} characters, needs at least ${SECTION_7.decision.min}` });
  }
  if (!changeMyMind.trim()) {
    missing.push({ id: domId.changeMyMind, label: 'Section 7 — "What would change your mind?" is empty' });
  }

  return {
    hydrated,
    name,
    mentorSample,
    hotspotsRead,

    relevanceSelected,
    relevanceRationale,
    guidingDecisions,
    criteriaOrder,
    boundary,
    tradeOffLinks,
    pendingLink,
    firstMeasure,
    justification,
    committedBudgetAnswer,
    raciValue,
    raciRoles,
    raciViolations,
    raciTouched,
    reviewMechanism,
    decisionNow,
    confidence,
    changeMyMind,
    selfAssessment,
    drafted,
    memoSections: MEMO_SECTIONS,
    quarters: QUARTERS,

    missing,
    allComplete: missing.length === 0,

    choose,
  };
}

export type Route2State = ReturnType<typeof useRoute2>;
