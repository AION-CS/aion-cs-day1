"use client";

import { useProgress } from "@/lib/store";
import { R2, EVIDENCE_CARDS, CRITERIA, GATES, CONSTRAINTS, RISKS, MEASURES } from "@/lib/route2";
import { MentorFillButton } from "@/components/ui/MentorFillButton";
import { AnswerKeyButton } from "@/components/ui/AnswerKeyButton";

const DEMO = {
  sensitivityNote:
    "The ranking held across the full ±10 shift, so the recommendation does not depend on a contested weighting.",
  shockNote:
    "Measure A is the only option that produces lifecycle and reuse data as an operational by-product, so the new reporting requirement strengthens it rather than changing the order.",
  justification:
    "Measure A first. For the CFO it is process spend rather than hardware spend, and card #5's cost case assumes a reactive support regime we are choosing to leave. For IT Operations the load is phased and front-loaded, not permanent. For the CISO the framework contains an explicit security-driven retirement path for the 390 unverified Windows 10 devices in card #2, so extension never means keeping a non-compliant machine.",
  uncertainty:
    "We commit now to condition-based extension as the governing default despite having no condition data, because the assessment that produces that data is the first deliverable of the measure itself. Waiting costs a full budget cycle and would have to be funded from the very budget this decision is about.",
  riskNotes: {
    "budget-lock":
      "The €180,000 goes into replacement hardware and cannot be redeployed to the framework until the next budget round.",
    "political-closure":
      "Once the board has seen a delivered refresh, reopening device lifetime in twelve months has no mandate behind it.",
  } as Record<string, string>,
};

/** Mentor-only: fills every Route 2 field with the Part 5 model answers, and unlocks the answer keys. */
export function MentorTools() {
  const markSeen = useProgress((s) => s.markSeen);
  const choose = useProgress((s) => s.choose);
  const toggleCheck = useProgress((s) => s.toggleCheck);
  const setNote = useProgress((s) => s.setNote);

  const fillDemoAnswers = () => {
    setNote(R2.name, "Muchson");

    EVIDENCE_CARDS.forEach((c) => {
      markSeen(R2.flipped, c.id);
      choose(R2.stage1.confidence(c.id), c.modelConfidence);
      choose(R2.stage1.relevance(c.id), c.modelRelevance);
    });
    choose(R2.stage1.stance, "scope");

    CRITERIA.forEach((c) => {
      setNote(R2.stage2.weight(c.id), String(c.modelWeight));
      choose(R2.stage2.weightWhy(c.id), c.modelWhy);
    });

    GATES.forEach((g) => {
      choose(R2.stage2.gate(g.measureId, g.criterionId), g.modelOption);
      choose(R2.stage2.score(g.measureId, g.criterionId), String(g.modelScore));
    });
    choose(R2.stage2.sensitivity, "held");
    setNote(R2.stage2.sensitivityNote, DEMO.sensitivityNote);

    CONSTRAINTS.forEach((c) => {
      choose(R2.stage3.constraint(c.id), c.modelMeasure);
      setNote(R2.stage3.mitigation(c.id), c.modelMitigation);
    });
    choose(R2.stage3.shock, "unchanged");
    setNote(R2.stage3.shockNote, DEMO.shockNote);

    MEASURES.forEach((m, i) => choose(R2.stage3.rank(m.id), String(i + 1)));
    setNote(R2.stage3.justification, DEMO.justification);

    RISKS.forEach((r) => {
      toggleCheck(R2.stage3.risk(r.id), r.isModel);
      if (r.isModel) setNote(R2.stage3.riskNote(r.id), DEMO.riskNotes[r.id] ?? "");
    });

    setNote(R2.stage3.uncertainty, DEMO.uncertainty);
  };

  return (
    <div className="mb-6 flex flex-wrap items-center justify-end gap-3">
      <AnswerKeyButton />
      <MentorFillButton onFill={fillDemoAnswers} />
    </div>
  );
}
