import { useStore } from "@/store/useStore";
import type { Persisted, Recommendation, Verdict } from "@/store/useStore";
import { FIGURE_IDS } from "@/data/offers";
import type { FigureId } from "@/data/offers";
import { parseAmount } from "@/lib/parseAmount";

/**
 * Selectors for later use. Route 3 (Level 3 · Decision Memo) quotes these back
 * to the participant, so they are plain functions of the store — no React.
 */

export function getL1Verdict(state: Pick<Persisted, "l1"> = useStore.getState()): Verdict {
  return state.l1.verdict;
}

export const isVerdictFiled = (v: Verdict) => v.filedAt !== null;

/** F1–F5 exactly as the participant entered them, parsed; null where empty or unreadable. */
export function getL2Figures(
  state: Pick<Persisted, "l2"> = useStore.getState(),
): Record<FigureId, { raw: string; value: number | null }> {
  return Object.fromEntries(
    FIGURE_IDS.map((id) => [id, { raw: state.l2.fillins[id], value: parseAmount(state.l2.fillins[id]) }]),
  ) as Record<FigureId, { raw: string; value: number | null }>;
}

export function getL2Recommendation(
  state: Pick<Persisted, "l2"> = useStore.getState(),
): { choice: Recommendation; justification: string; limits: string } {
  return {
    choice: state.l2.recommendation,
    justification: state.l2.justification,
    limits: state.l2.limits,
  };
}

export const RECOMMENDATION_LABEL: Record<Exclude<Recommendation, null>, string> = {
  A: "Offer A",
  B: "Offer B",
  "B+care": "Offer B + Care after go-live",
};
