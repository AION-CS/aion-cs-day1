"use client";

import { useProgress, useHydrated } from "@/lib/store";
import type { MissingItem } from "@/components/ui/MissingList";
import {
  AREAS,
  ESCALATE,
  R1,
  SIGNALS,
  areaById,
  type AreaId,
  type Effect,
  type Sentiment,
  type Signal,
} from "@/lib/route1";

/** DOM ids the missing-item list scrolls to and flashes. */
export const domId = {
  name: "r1-name",

  task: "task",
  triage: "r1-triage",
  triageRow: (id: string) => `r1-triage-${id}`,
  triageEvidence: (id: string) => `r1-triage-${id}-evidence`,
  triageTag: (id: string) => `r1-triage-${id}-tag`,
  triageCheck: "r1-triage-check",

  escalate: "r1-escalate",
  escalateWhy: "r1-escalate-why",

  // Step 3: deep dive (reuses one id shape per signal)
  analysis: (id: string) => `r1-analysis-${id}`,
  area: (id: string) => `r1-analysis-${id}-area`,
  effect: (id: string) => `r1-analysis-${id}-effect`,
  approach: (id: string) => `r1-analysis-${id}-approach`,

  export: "r1-export",
};

// ---------------------------------------------------------------------------
// Step 1 — triage
// ---------------------------------------------------------------------------

export type TriageRowState = {
  signal: Signal;
  tag: Sentiment | null;
  /** Index into signal.segments of the tapped phrase, or null. */
  evidence: number | null;
  evidenceText: string | null;
  complete: boolean;
  /** Ground truth — tag correct and the tapped phrase is the decisive one. Only ever surfaced when reasoning is visible. */
  holds: boolean;
};

// ---------------------------------------------------------------------------
// Step 3 — deep dive
// ---------------------------------------------------------------------------

export type Analysis = {
  signal: Signal;
  triage: TriageRowState;
  area: AreaId | null;
  effect: Effect | null;
  approach: string;
  checks: number;
  fresh: boolean;
  verdict: "holds" | "wrong" | null;
  revealed: boolean;
  reasoningVisible: boolean;
  complete: boolean;
};

/**
 * Joins the shared progress store to Route 1's content, one hook.
 *
 * One route has one `missing` list and one definition of done (CLAUDE.md
 * §12). The task's own checks (triage, then per-signal deep dive) are
 * set/pair-level so neither one ever names which specific answer is wrong —
 * only how many hold — and both open onto a "show the reasoning" option
 * after two genuine checks, which is recorded in the export.
 */
export function useRoute1() {
  const hydrated = useHydrated();
  const notes = useProgress((s) => s.notes);
  const choices = useProgress((s) => s.choices);
  const checks = useProgress((s) => s.checks);

  const name = notes[R1.name] ?? "";

  // -- Step 1: triage ---------------------------------------------------------
  const triage: TriageRowState[] = SIGNALS.map((signal) => {
    const rawTag = choices[R1.triageTag(signal.id)];
    const tag = rawTag === "positive" || rawTag === "negative" ? (rawTag as Sentiment) : null;
    const rawEv = choices[R1.triageEvidence(signal.id)];
    const evidence = rawEv !== undefined && rawEv !== "" ? Number(rawEv) : null;
    const seg = evidence !== null ? signal.segments[evidence] : null;
    const evidenceText = seg && typeof seg !== "string" ? seg.text : null;
    const decisive = seg && typeof seg !== "string" ? seg.decisive : false;
    return {
      signal,
      tag,
      evidence,
      evidenceText,
      complete: !!tag && evidence !== null,
      holds: tag === signal.sentiment && decisive,
    };
  });

  const triageById = (id: string) => triage.find((t) => t.signal.id === id)!;
  const triageCompleteCount = triage.filter((t) => t.complete).length;
  const triageSignature = triage.map((t) => `${t.signal.id}:${t.tag ?? "-"}:${t.evidence ?? "-"}`).join("|");

  const triageChecks = Number(notes[R1.triageChecks] ?? "0") || 0;
  const triageLastSig = notes[R1.triageLastSig] ?? "";
  const triageLastOk = Number(notes[R1.triageLastOk] ?? "0") || 0;
  const triageFresh = triageChecks > 0 && triageLastSig === triageSignature;
  const triageAllHold = triageFresh && triageLastOk === SIGNALS.length;
  const triageClue = checks[R1.triageClue] === true;
  const triageRevealed = checks[R1.triageReveal] === true;
  const triageRevealAt = Number(notes[R1.triageRevealAt] ?? "0") || 0;
  const triageReasoningVisible = triageAllHold || triageRevealed;

  // -- Step 2: escalate ---------------------------------------------------------
  const escalated = (notes[R1.escalate] ?? "")
    .split("|")
    .filter((id) => SIGNALS.some((s) => s.id === id))
    .slice(0, ESCALATE.limit);
  const escalateWhy = (notes[R1.escalateWhy] ?? "").trim();

  // -- Step 3: deep dive (only the escalated signals) --------------------------
  const analyses: Analysis[] = escalated.map((id) => {
    const signal = SIGNALS.find((s) => s.id === id)!;
    const rawArea = choices[R1.area(id)];
    const area = rawArea && AREAS.some((a) => a.id === rawArea) ? (rawArea as AreaId) : null;
    const rawEffect = choices[R1.effect(id)];
    const effect = rawEffect === "direct" || rawEffect === "indirect" ? (rawEffect as Effect) : null;
    const approach = (notes[R1.approach(id)] ?? "").trim();

    const signature = `${area ?? "-"}:${effect ?? "-"}`;
    const analysisChecks = Number(notes[R1.analysisChecks(id)] ?? "0") || 0;
    const lastSig = notes[R1.analysisLastSig(id)] ?? "";
    const fresh = analysisChecks > 0 && lastSig === signature;
    const verdict: "holds" | "wrong" | null = !fresh
      ? null
      : area === signal.area && effect === signal.effect
        ? "holds"
        : "wrong";
    const revealed = checks[R1.analysisReveal(id)] === true;

    return {
      signal,
      triage: triageById(id),
      area,
      effect,
      approach,
      checks: analysisChecks,
      fresh,
      verdict,
      revealed,
      reasoningVisible: verdict === "holds" || revealed,
      complete: !!area && !!effect && approach.length > 0,
    };
  });

  const analysisById = (id: string) => analyses.find((a) => a.signal.id === id);
  const analysisCompleteCount = analyses.filter((a) => a.complete).length;

  // -- Missing list ---------------------------------------------------------
  // Standard #1: one entry per concretely-missing thing, named, in page order.
  const missing: MissingItem[] = [];
  if (!name.trim()) missing.push({ id: domId.name, label: "Your name — needed to label the export" });

  for (const t of triage) {
    if (t.complete) continue;
    const who = `Signal ${t.signal.n} — ${t.signal.title}`;
    missing.push({
      id: t.tag ? domId.triageEvidence(t.signal.id) : domId.triageTag(t.signal.id),
      label: !t.tag && t.evidence === null ? `Triage for ${who} — tag and evidence` : !t.tag ? `Triage tag for ${who}` : `Triage evidence for ${who}`,
    });
  }
  if (escalated.length < ESCALATE.limit) {
    missing.push({
      id: domId.escalate,
      label: `Escalate ${ESCALATE.limit} signals for a deeper look — ${escalated.length} of ${ESCALATE.limit} chosen`,
    });
  }
  if (!escalateWhy) {
    missing.push({ id: domId.escalateWhy, label: "Justification for your two escalated signals" });
  }
  for (const a of analyses) {
    const who = `Signal ${a.signal.n} — ${a.signal.title}`;
    if (!a.area) missing.push({ id: domId.area(a.signal.id), label: `Area for ${who}` });
    if (!a.effect) missing.push({ id: domId.effect(a.signal.id), label: `Direct/indirect effect for ${who}` });
    if (!a.approach) missing.push({ id: domId.approach(a.signal.id), label: `Improvement approach for ${who}` });
  }

  return {
    hydrated,
    name,

    // Step 1
    triage,
    triageById,
    triageCompleteCount,
    triageSignature,
    triageChecks,
    triageFresh,
    triageLastOk,
    triageAllHold,
    triageClue,
    triageRevealed,
    triageRevealAt,
    triageReasoningVisible,
    totalSignals: SIGNALS.length,

    // Step 2
    escalated,
    escalateWhy,

    // Step 3
    analyses,
    analysisById,
    analysisCompleteCount,

    // route-wide
    missing,
    allComplete: missing.length === 0,

    // helpers components need
    areaName: (id: AreaId | null) => (id ? areaById(id).name : "— not assigned"),
  };
}

export type Route1State = ReturnType<typeof useRoute1>;
