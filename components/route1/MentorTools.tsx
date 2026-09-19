"use client";

import { useProgress } from "@/lib/store";
import { MentorFillButton } from "@/components/ui/MentorFillButton";
import { AnswerKeyButton } from "@/components/ui/AnswerKeyButton";
import {
  AREAS,
  CRITERIA,
  FOLLOWUP_FIELDS,
  HORIZON_ITEMS,
  OPTION_LINES,
  R1,
  RISK_FIELDS,
  SAMPLE_FOLLOWUPS,
  SAMPLE_JUSTIFICATION,
  SAMPLE_PRIORITY,
  SAMPLE_RISKS,
  SAMPLE_SCORES,
  SIGNALS,
  STAGE_B_METRICS,
} from "@/lib/route1";

/**
 * The route's mentor bar: one demo auto-fill (fills both tasks, so a
 * reviewer can exercise both exports in one click) plus the answer keys,
 * both behind the shared passcode (CLAUDE.md §7).
 */
export function MentorTools() {
  const setNote = useProgress((s) => s.setNote);
  const choose = useProgress((s) => s.choose);

  const fill = () => {
    setNote(R1.name, "Muchson");

    // Task 1, Stage A
    for (const signal of SIGNALS) {
      choose(R1.area(signal.id), signal.primaryArea);
      if (signal.secondaryArea) choose(R1.areaSecondary(signal.id), signal.secondaryArea);
    }
    for (const area of AREAS) {
      setNote(R1.approach(area.id), SAMPLE_APPROACH[area.id]);
    }

    // Task 1, Stage B
    for (const m of STAGE_B_METRICS) choose(R1.effectiveness(m.id), m.expected);

    // Task 1, Stage C
    for (const h of HORIZON_ITEMS) choose(R1.horizon(h.id), h.expected);

    // Task 2
    for (const option of OPTION_LINES) {
      for (const c of CRITERIA) choose(R1.score(option.id, c.id), SAMPLE_SCORES[option.id][c.id]);
    }
    choose(R1.priority, SAMPLE_PRIORITY);
    setNote(R1.justification, SAMPLE_JUSTIFICATION);
    FOLLOWUP_FIELDS.forEach((f, i) => setNote(R1.followUp(i), SAMPLE_FOLLOWUPS[i]));
    RISK_FIELDS.forEach((r, i) => setNote(R1.risk(i), SAMPLE_RISKS[i]));
  };

  return (
    <div className="flex flex-wrap items-center justify-end gap-2 print:hidden">
      <MentorFillButton onFill={fill} />
      <AnswerKeyButton />
    </div>
  );
}

const SAMPLE_APPROACH: Record<string, string> = {
  metricQuality: "Agree one shared PUE boundary definition across sites and publish it to every reporting team.",
  dataAvailability: "Start capturing device service-life and reuse data consistently, starting with the three largest sites.",
  reporting: "Redesign the monthly slide to show target-vs-actual, not totals alone.",
  managementRelevance: "Attach a named target and owner to the three figures management already reviews most often.",
  carbonMonitoring: "Draft a first-pass Scope 1/2/3 allocation covering infrastructure, devices and cloud, even if provisional.",
  responsibilities: "Name one accountable owner for the CO₂ figure end-to-end, from capture to reporting.",
};
