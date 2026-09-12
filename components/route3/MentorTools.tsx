"use client";

import { useProgress } from "@/lib/store";
import {
  R3,
  DRIVERS,
  GUIDING_DECISIONS,
  THRESHOLDS,
  TEST_DEVICES,
  REASON_CODES,
  RACI_DECISIONS,
  RACI_ROLES,
  TRADE_OFFS,
  REVIEW_INDICATORS,
  BOARD_CHALLENGES,
} from "@/lib/route3";
import { MentorFillButton } from "@/components/ui/MentorFillButton";
import { AnswerKeyButton } from "@/components/ui/AnswerKeyButton";

/** Model RACI beyond the single Accountable — responsible, consulted, informed. */
const MODEL_RACI: Record<string, Partial<Record<string, "R" | "A" | "C" | "I">>> = {
  thresholds: { cio: "A", itops: "R", ciso: "C", sustainability: "C", procurement: "C", serviceDesk: "I" },
  baseline: { ciso: "A", itops: "R", cio: "C", serviceDesk: "I", procurement: "I", sustainability: "I" },
  contracts: { procurement: "A", itops: "R", cio: "C", ciso: "C", sustainability: "I", serviceDesk: "I" },
  reporting: { sustainability: "A", itops: "R", cio: "C", ciso: "C", procurement: "I", serviceDesk: "I" },
};

const DEMO = {
  resolution:
    "The board approves single-point accountability for workplace device lifecycle, assigned to the CIO, effective immediately and reviewed annually.",
  exceptionPath:
    "Escalate to the Service Desk Team Lead within a defined cost band; anything above the band, or any security-related exception, escalates to Steering.",
  trigger:
    "If more than 25% of exceptions in a quarter carry the same reason code, that threshold is mis-set and goes to Steering for revision at the next quarterly review.",
  commitment:
    "We ask the board to adopt condition-based replacement as the group default now, before any condition data exists, because the condition assessment is the first operational deliverable of that decision rather than a prerequisite to it. Waiting for the audit costs a full procurement cycle across seven countries, during which roughly a quarter of the fleet will be replaced under the inherited fixed cycles we have already concluded are wrong.",
  challengeNotes: {
    cfo: "Fixed cycles were never validated against device condition, so they are predictable rather than accurate.",
    ciso: "Test device 3 is the demonstration: cheap, high condition, non-compliant — and it still retires.",
    hr: "Leadership devices are in scope on the same terms, and the rule contains no executive exception.",
  } as Record<string, string>,
};

/** Mentor-only: fills every Route 3 field with the model answers, and unlocks the answer keys. */
export function MentorTools() {
  const choose = useProgress((s) => s.choose);
  const toggleCheck = useProgress((s) => s.toggleCheck);
  const setNote = useProgress((s) => s.setNote);

  const fillDemoAnswers = () => {
    setNote(R3.name, "Muchson");

    DRIVERS.forEach((d) => toggleCheck(R3.stage1.driver(d.id), d.isModel));

    GUIDING_DECISIONS.forEach((d) => {
      toggleCheck(R3.stage1.decision(d.id), d.isModel);
      choose(R3.stage1.order(d.id), d.modelOrder ? String(d.modelOrder) : "");
    });
    setNote(R3.stage1.resolution, DEMO.resolution);

    THRESHOLDS.forEach((t) => choose(R3.stage2.threshold(t.key), t.modelOption));
    // the model rule produces the intended outcome on every bench device
    TEST_DEVICES.forEach((d) => choose(R3.stage2.outcomeMark(d.id), "intended"));
    setNote(R3.stage2.iterations, "2");
    setNote(R3.stage2.exceptionPath, DEMO.exceptionPath);
    REASON_CODES.forEach((c) => toggleCheck(R3.stage2.reasonCode(c.id), c.isModel));

    RACI_DECISIONS.forEach((d) => {
      const row = MODEL_RACI[d.id] ?? {};
      RACI_ROLES.forEach((role) => choose(R3.stage3.raci(d.id, role), row[role] ?? ""));
    });

    TRADE_OFFS.forEach((t) => {
      choose(R3.stage3.tradeoffOwner(t.id), t.modelOwner);
      const model = t.options.find((o) => o.isModel);
      if (model) choose(R3.stage3.tradeoffDefault(t.id), model.id);
    });

    REVIEW_INDICATORS.forEach((i) => {
      toggleCheck(R3.stage3.indicator(i.id), i.isModel);
      if (i.isModel) choose(R3.stage3.cadence(i.id), "quarterly");
    });
    setNote(R3.stage3.trigger, DEMO.trigger);

    BOARD_CHALLENGES.forEach((c) => {
      const model = c.options.find((o) => o.isModel);
      if (model) choose(R3.stage3.challenge(c.id), model.id);
      setNote(R3.stage3.challengeNote(c.id), DEMO.challengeNotes[c.id] ?? "");
    });

    setNote(R3.stage3.commitment, DEMO.commitment);
  };

  return (
    <div className="mb-6 flex flex-wrap items-center justify-end gap-3">
      <AnswerKeyButton />
      <MentorFillButton onFill={fillDemoAnswers} />
    </div>
  );
}
