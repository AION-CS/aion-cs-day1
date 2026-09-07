"use client";

import { useProgress } from "@/lib/store";
import { R1, LEARNER_NAME_KEY, EVIDENCE_ITEMS, STATEMENT_PROMPTS, STAGE5_CLASSIFICATION } from "@/lib/route1";
import { MentorFillButton } from "@/components/ui/MentorFillButton";

const DEMO_STATEMENTS: Record<string, string> = {
  "genuinely-sustainable":
    "both the provider's infrastructure is efficient AND the organisation actively manages demand, so a lower per-unit footprint is not cancelled out by ever-growing total usage.",
  "fails-sustainable":
    "over-provisioning, zombie workloads, and unmanaged self-service usage are left unchecked, letting total consumption grow faster than the efficiency gains from moving to a better provider.",
  "theoretical-vs-real":
    "what a hyperscale provider's infrastructure makes physically possible, versus what an organisation's own governance and discipline actually causes to happen on top of it.",
};

/** Mentor-only: fills every field on Route 1's Task 1 with plausible, model-quality demo answers. */
export function MentorTools() {
  const choose = useProgress((s) => s.choose);
  const setNote = useProgress((s) => s.setNote);

  const fillDemoAnswers = () => {
    setNote(LEARNER_NAME_KEY, "Muchson");

    EVIDENCE_ITEMS.forEach((it) => {
      choose(R1.stage2.verdict(it.id), it.correctVerdict);
      choose(R1.stage3.dimension(it.id), it.correctDimension);
    });

    STATEMENT_PROMPTS.forEach((p) => setNote(R1.stage4.statement(p.id), DEMO_STATEMENTS[p.id] ?? ""));

    EVIDENCE_ITEMS.filter((it) => it.correctVerdict === "risk").forEach((it) => {
      const cls = STAGE5_CLASSIFICATION[it.id];
      if (cls) choose(R1.stage5.side(it.id), cls.correctSide);
    });
  };

  return <MentorFillButton onFill={fillDemoAnswers} />;
}
