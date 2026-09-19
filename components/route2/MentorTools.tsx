"use client";

import { useProgress } from "@/lib/store";
import { MentorFillButton } from "@/components/ui/MentorFillButton";
import { AnswerKeyButton } from "@/components/ui/AnswerKeyButton";
import {
  FACTORS,
  R2,
  SAMPLE_ALLOCATION,
  SAMPLE_FIRST_MOVE,
  SAMPLE_GUIDING,
  SAMPLE_GUIDING_JUSTIFICATIONS,
  SAMPLE_NOW_DECISION,
  SAMPLE_REASONS,
  SAMPLE_RELEVANCE_JUSTIFICATION,
  SAMPLE_RESPONSIBILITY_ROLE,
  SAMPLE_RISK_OF_WAITING,
  SAMPLE_ROLE,
  SAMPLE_SEQUENCE,
} from "@/lib/route2";

/** One demo auto-fill covering all five stages, plus the mentor answer key. */
export function MentorTools() {
  const setNote = useProgress((s) => s.setNote);
  const choose = useProgress((s) => s.choose);
  const toggleCheck = useProgress((s) => s.toggleCheck);

  const fill = () => {
    setNote(R2.name, "Muchson");

    // Stage A
    choose(R2.roleLens, SAMPLE_ROLE);
    for (const id of SAMPLE_REASONS) toggleCheck(R2.reason(id), true);
    setNote(R2.relevanceJustification, SAMPLE_RELEVANCE_JUSTIFICATION);

    // Stage B
    for (const id of SAMPLE_GUIDING) {
      toggleCheck(R2.guiding(id), true);
      setNote(R2.guidingJustification(id), SAMPLE_GUIDING_JUSTIFICATIONS[id]);
    }

    // Stage C
    for (const [layerId, pos] of Object.entries(SAMPLE_SEQUENCE)) choose(R2.sequence(layerId), String(pos));
    setNote(R2.firstMove, SAMPLE_FIRST_MOVE);

    // Stage D
    for (const f of FACTORS) setNote(R2.allocation(f.id), String(SAMPLE_ALLOCATION[f.id]));

    // Stage E
    for (const [respId, roleId] of Object.entries(SAMPLE_RESPONSIBILITY_ROLE)) choose(R2.responsibilityRole(respId), roleId);
    setNote(R2.nowDecision, SAMPLE_NOW_DECISION);
    setNote(R2.riskOfWaiting, SAMPLE_RISK_OF_WAITING);
  };

  return (
    <div className="flex flex-wrap items-center justify-end gap-2 print:hidden">
      <MentorFillButton onFill={fill} />
      <AnswerKeyButton />
    </div>
  );
}
