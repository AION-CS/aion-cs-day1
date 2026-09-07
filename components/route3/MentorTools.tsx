"use client";

import { useProgress } from "@/lib/store";
import {
  R3,
  LEARNER_NAME_KEY,
  SKYBRIDGE_EVIDENCE,
  LEVERS,
  GUTCHECK_PROMPTS,
  PROPOSAL_ROLES,
  GUIDING_DECISION_COUNT,
  TRADEOFF_COUNT,
} from "@/lib/route3";
import { MentorFillButton } from "@/components/ui/MentorFillButton";

const DEMO_GUIDING = [
  "Approve a usage and cost transparency dashboard across all cloud workloads by Q2.",
  "Freeze net-new departmental cloud spend outside the new standards until they're published.",
  "Commission a data-completeness audit for energy-intensive workloads by Q3.",
];
const DEMO_TRADEOFFS = [
  "Speed of provisioning vs. central control — governance will slow some requests to gain visibility.",
  "Short-term visible progress vs. structural soundness — the first move is deliberately not the flashiest one.",
];
const DEMO_ROLE_FIELDS: Record<string, { approves: string; reviews: string }> = {
  board: { approves: "Budget ceiling and the overall proposal", reviews: "Quarterly, at board session" },
  cio: { approves: "The technical-strategic recommendation", reviews: "Monthly, against roadmap milestones" },
  ops: { approves: "Feasibility sign-off on each measure", reviews: "Continuously, via the dashboard once live" },
};

/** Mentor-only: fills every field on Route 3's Task 3 with plausible, model-quality demo answers. */
export function MentorTools() {
  const choose = useProgress((s) => s.choose);
  const setNote = useProgress((s) => s.setNote);

  const fillDemoAnswers = () => {
    setNote(LEARNER_NAME_KEY, "Muchson");

    SKYBRIDGE_EVIDENCE.forEach((it) => choose(R3.s2.node(it.id), it.correctNode));

    const modelLevers = LEVERS.filter((l) => l.isModelPick);
    modelLevers.forEach((l) => {
      choose(R3.s3.selected(l.id), "yes");
      setNote(R3.s3.reason(l.id), `This addresses a root cause named directly in the case, not just a visible symptom of it.`);
      choose(R3.s4.horizon(l.id), l.typicalHorizon);
    });
    const first = modelLevers.find((l) => l.typicalHorizon === "short") ?? modelLevers[0];
    choose(R3.s4.firstMove, first.id);
    setNote(R3.s4.firstMoveJustify, "It's a no-regret move: valuable regardless of which future direction SkyBridge takes next, and it produces the data every later decision depends on.");

    GUTCHECK_PROMPTS.forEach((p, i) => setNote(R3.s5.gutcheck(i), "Worth revisiting once the dashboard from Stage 4 is live."));

    setNote(
      R3.s6.strategicRelevance,
      "unmanaged cloud growth is already producing the same cost and visibility problems SkyBridge faced, and a board-level decision now is cheaper than an emergency correction later.",
    );
    Array.from({ length: GUIDING_DECISION_COUNT }).forEach((_, i) => setNote(R3.s6.guidingDecision(i), DEMO_GUIDING[i] ?? ""));
    setNote(
      R3.s6.prioritizationLogic,
      "how much each measure closes a named visibility or governance gap first, before any measure that primarily increases scale or speed.",
    );
    Array.from({ length: TRADEOFF_COUNT }).forEach((_, i) => setNote(R3.s6.tradeoff(i), DEMO_TRADEOFFS[i] ?? ""));
    setNote(R3.s6.firstMeasure, "Usage and cost transparency dashboard");
    setNote(
      R3.s6.firstMeasureJustify,
      "It is the one measure every other future decision depends on having data from, and it carries essentially no downside risk.",
    );
    PROPOSAL_ROLES.forEach((role) => {
      setNote(R3.s6.role(role.id, "approves"), DEMO_ROLE_FIELDS[role.id]?.approves ?? "");
      setNote(R3.s6.role(role.id, "reviews"), DEMO_ROLE_FIELDS[role.id]?.reviews ?? "");
    });
    setNote(R3.s6.decideNow, "fund the transparency dashboard now");
    setNote(R3.s6.waitingMeans, "another budget cycle passes with departments still spending independently and no data to prioritise against");
  };

  return <MentorFillButton onFill={fillDemoAnswers} />;
}
