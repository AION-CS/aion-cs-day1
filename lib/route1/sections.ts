/**
 * Route 1's material sections, as one continuous run.
 *
 * Stage 1 (diagnosis) contributes A–F and stage 2 (decision) contributes G–J,
 * but the learner meets them as a single lettered sequence on a single page —
 * two runs that both start at "A" are the clearest tell that a route was glued
 * together from two smaller ones (CLAUDE.md #12). The ids, labels and anchor
 * ids therefore live here, above both halves, rather than in either of them.
 */

import type { IconKey } from "@/lib/routes";

export type MaterialSectionId =
  // A–F — stage 1: seeing the waste (./diagnosis.ts)
  | "footprint"
  | "correctness"
  | "sci"
  | "principles"
  | "categories"
  | "profession"
  // G–J — stage 2: choosing what to do about it (./decision.ts)
  | "constraint"
  | "measures"
  | "dimensions"
  | "defensible";

export type MaterialSection = {
  id: MaterialSectionId;
  n: number;
  letter: string;
  icon: IconKey;
  kicker: string;
  title: string;
  definition: string;
  insight: string;
  takeaway: string;
  /**
   * Standard #11a — the decision rules this block hands the task, phrased the
   * way the task will need them, including the rule that rules out the
   * plausible wrong answer. Rendered as "How to decide when this comes up in
   * the task".
   */
  reasoning: string[];
  callout: { label: string; text: string };
  references: { label: string; url?: string }[];
};

/** DOM anchor a task step's MaterialRefs chip scrolls to. */
export function materialAnchorId(id: MaterialSectionId): string {
  return `r1-material-${id}`;
}

export const MATERIAL_LABELS: Record<MaterialSectionId, string> = {
  footprint: "A · Why software has a footprint",
  correctness: "B · Correct vs. efficient",
  sci: "C · Measuring it (SCI)",
  principles: "D · Three GSF principles",
  categories: "E · The six categories",
  profession: "F · Not just a developer's problem",
  constraint: "G · The real constraint",
  measures: "H · Three measures, three stages",
  dimensions: "I · The seven dimensions",
  defensible: "J · Making a defensible call",
};

/** Chips for a task step: which material sections it draws on. */
export function materialRefs(ids: MaterialSectionId[]) {
  return ids.map((id) => ({ anchorId: materialAnchorId(id), label: MATERIAL_LABELS[id] }));
}
