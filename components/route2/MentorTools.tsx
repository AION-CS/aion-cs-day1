"use client";

import { useProgress } from "@/lib/store";
import { R2, LEARNER_NAME_KEY, REFLECTION_PROMPTS, type CriterionId, type OptionId } from "@/lib/route2";
import { MentorFillButton } from "@/components/ui/MentorFillButton";

/** Which of the 3 statements (by score) is the model pick for each criterion x option pairing. */
const DEMO_SCORES: Record<CriterionId, Record<OptionId, 1 | 2 | 3>> = {
  "sustainability-impact": { A: 1, B: 3, C: 2 },
  "economic-viability": { A: 1, B: 2, C: 3 },
  feasibility: { A: 3, B: 2, C: 2 },
  risk: { A: 1, B: 3, C: 2 },
};

const DEMO_FOLLOWUPS = [
  "Which policy area (cost, workloads, or responsibilities) the governance rollout starts with first, and who owns it.",
  "How the departments currently ordering cloud independently will be brought into the new policy without stalling their existing work.",
];

const DEMO_RISKS = [
  "Accelerating migration now, before governance exists, risks locking in exactly the uncontrolled spend and dependency pattern the case already describes — just at a larger scale.",
  "A visible but ungoverned optimisation push can look like progress to the board while the same waste quietly reappears next quarter, since nothing structurally prevents it from recurring.",
];

const DEMO_JUSTIFY =
  "Flexora's management wants visible progress, but the constraints point the other way: departments already order cloud independently with no oversight, and IT explicitly wants to avoid future dependencies and cost explosions. Option B is the only one of the three that directly closes that governance gap, and — per the multiplier argument in the material — it's what makes the eventual migration and optimisation work actually pay off rather than compound the existing problem.";

const DEMO_REFLECTIONS: Record<string, string> = {
  "quick-solution": "Whenever a department requests more cloud capacity to \"solve\" a deadline pressure without anyone checking whether the workload is actually needed long-term.",
  "prioritise-differently": "An operationally minded implementer optimises for this quarter's uptime and velocity; a manager or architect has to weigh what the decision costs the organisation two or three years out, even if that's invisible right now.",
};

/** Mentor-only: fills every field on Route 2's Task 2 with plausible, model-quality demo answers. */
export function MentorTools() {
  const choose = useProgress((s) => s.choose);
  const setNote = useProgress((s) => s.setNote);

  const fillDemoAnswers = () => {
    setNote(LEARNER_NAME_KEY, "Muchson");

    (Object.keys(DEMO_SCORES) as CriterionId[]).forEach((criterionId) => {
      (Object.keys(DEMO_SCORES[criterionId]) as OptionId[]).forEach((option) => {
        const score = DEMO_SCORES[criterionId][option];
        choose(R2.criterion(criterionId, option), `${criterionId}-${option}-${score}`);
      });
    });

    choose(R2.pick, "B");
    setNote(R2.justify, DEMO_JUSTIFY);
    DEMO_FOLLOWUPS.forEach((text, i) => setNote(R2.followUp(i), text));
    DEMO_RISKS.forEach((text, i) => setNote(R2.risk(i), text));
    REFLECTION_PROMPTS.forEach((p, i) => setNote(R2.reflection(i), DEMO_REFLECTIONS[p.id] ?? ""));
  };

  return <MentorFillButton onFill={fillDemoAnswers} />;
}
