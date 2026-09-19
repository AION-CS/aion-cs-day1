"use client";

import { useProgress } from "@/lib/store";
import { MentorFillButton } from "@/components/ui/MentorFillButton";
import { AnswerKeyButton } from "@/components/ui/AnswerKeyButton";
import {
  CANDIDATE_MEASURES,
  GUIDING_DECISION_FIELDS,
  R2,
  SAMPLE_CONNECTIONS,
  SAMPLE_ELEMENT_1,
  SAMPLE_ELEMENT_3,
  SAMPLE_ELEMENT_4,
  SAMPLE_ELEMENT_5_WHY,
  SAMPLE_ELEMENT_6,
  SAMPLE_ELEMENT_7,
  SAMPLE_FIRST_MEASURE,
  SAMPLE_GUIDING_DECISIONS,
  SAMPLE_HORIZONS,
  connectionKey,
} from "@/lib/route2";

/**
 * The route's mentor bar: one demo auto-fill plus the answer key, both behind
 * the shared passcode (CLAUDE.md §7). One fill, everything: a fully connected
 * canvas, all seven proposal elements, the first-measure pick, and all six
 * measures classified — instantly exportable. Every sample comes from
 * lib/route2/task3.ts rather than a second copy that could drift.
 */
export function MentorTools() {
  const setNote = useProgress((s) => s.setNote);
  const choose = useProgress((s) => s.choose);
  const toggleCheck = useProgress((s) => s.toggleCheck);

  const fill = () => {
    setNote(R2.name, "Muchson");

    for (const [a, b] of SAMPLE_CONNECTIONS) toggleCheck(R2.connection(connectionKey(a, b)), true);

    setNote(R2.element1, SAMPLE_ELEMENT_1);
    GUIDING_DECISION_FIELDS.forEach((f, i) => setNote(R2.guidingDecision(i), SAMPLE_GUIDING_DECISIONS[i]));
    setNote(R2.element3, SAMPLE_ELEMENT_3);
    setNote(R2.element4, SAMPLE_ELEMENT_4);
    choose(R2.firstMeasure, SAMPLE_FIRST_MEASURE);
    setNote(R2.element5Why, SAMPLE_ELEMENT_5_WHY);
    setNote(R2.element6, SAMPLE_ELEMENT_6);
    setNote(R2.element7, SAMPLE_ELEMENT_7);

    for (const m of CANDIDATE_MEASURES) choose(R2.horizon(m.id), SAMPLE_HORIZONS[m.id]);
  };

  return (
    <div className="flex flex-wrap items-center justify-end gap-2 print:hidden">
      <MentorFillButton onFill={fill} />
      <AnswerKeyButton />
    </div>
  );
}
