"use client";

import { useProgress } from "@/lib/store";
import { MentorFillButton } from "@/components/ui/MentorFillButton";
import { AnswerKeyButton } from "@/components/ui/AnswerKeyButton";
import {
  ASSESSMENT_DIMENSIONS,
  DECIDE_NOW_FIELDS,
  MAP_EXERCISE,
  MAP_MEASURES,
  R2,
  RANK_EXERCISE,
  RACI_ROWS,
  TASK_RACI_ROLES,
} from "@/lib/route2";

/**
 * Route 2's mentor bar: one demo fill for all five exercises, plus the answer
 * keys — both behind the shared passcode, both deliberately minor. The fill
 * writes a defensible (not the only defensible) memo through the same store
 * actions a learner triggers.
 */

/** One defensible grid — the answer key explains why others defend too. */
const DEMO_RACI: Record<string, Record<string, string>> = {
  r1: { board: "A", sustainability: "R", it: "C", finance: "C", deptHeads: "I", transformation: "I" },
  r2: { board: "C", sustainability: "A", it: "R", finance: "I", deptHeads: "C", transformation: "I" },
  r3: { board: "I", sustainability: "A", it: "R", finance: "I", deptHeads: "R", transformation: "C" },
  r4: { board: "C", sustainability: "C", it: "I", finance: "A", deptHeads: "I", transformation: "I" },
};

/** One rating + one-line argument per assessment dimension for the demo lane. */
const DEMO_RATINGS: Record<string, { rating: "low" | "mid" | "high"; note: string }> = {
  strategicLeverage: { rating: "high", note: "Makes every later Accelerate or Consolidate decision judged against the same criteria." },
  sustainabilityImpact: { rating: "mid", note: "No direct saving on its own — its effect is entirely on what gets approved next." },
  innovationEffect: { rating: "mid", note: "Slows launch of new capability slightly; does not block it." },
  feasibility: { rating: "mid", note: "Needs cross-department agreement and a board sign-off before it binds." },
  controllability: { rating: "high", note: "Every future initiative is judged against it once in place." },
  risk: { rating: "low", note: "Slower visible progress short-term, real but bounded political cost." },
  longTermEffect: { rating: "high", note: "Persists as process rather than as one person's initiative." },
};

export function MentorTools() {
  const setNote = useProgress((s) => s.setNote);
  const choose = useProgress((s) => s.choose);

  const fill = () => {
    setNote(R2.name, "Muchson");

    // Exercise 1 — prioritise & defend
    choose(R2.prioritiseLane, "assess");
    for (const dim of ASSESSMENT_DIMENSIONS) {
      const demo = DEMO_RATINGS[dim.key];
      choose(R2.rating(dim.key), demo.rating);
      setNote(R2.ratingNote(dim.key), demo.note);
    }
    setNote(
      R2.justification,
      "Even without a full baseline of current data volumes, Assess & Govern is the only lane that makes every later Accelerate or Consolidate decision defensible, which is worth more than waiting for a number we don't strictly need to start.",
    );
    setNote(R2.followUp, "Who owns writing the first version of the assessment criteria, and by which board meeting it is signed off.");
    setNote(R2.risk(1), "Consolidation ships a visible saving while the assessment gap reopens within a year.");
    setNote(R2.risk(2), "Acceleration gets reported as a sustainability win before anyone has checked its net environmental effect.");

    // Exercise 2 — rank the guiding decisions
    setNote(R2.ranking, "g1|g7|g4");
    setNote(R2.rankWhy, RANK_EXERCISE.justify.sample);
    choose(R2.rankCheck, "required");

    // Exercise 3 — the trade-off map: expected diagnostics, so every quadrant renders correctly
    for (const m of MAP_MEASURES) {
      choose(R2.q1(m.id), m.momentumHigh ? "yes" : "no");
      choose(R2.q2(m.id), m.structuralHigh ? "yes" : "no");
      const bet = MAP_EXERCISE.betSamples[m.id];
      if (bet) setNote(R2.bet(m.id), bet);
    }

    // Exercise 4 — RACI
    for (const row of RACI_ROWS) {
      for (const role of TASK_RACI_ROLES) choose(R2.raci(row.id, role.id), DEMO_RACI[row.id]?.[role.id] ?? "");
    }

    // Exercise 5 — the decision that cannot wait
    for (const f of DECIDE_NOW_FIELDS) setNote(R2.decideNow(f.key), f.sample);
  };

  return (
    <div className="flex flex-wrap items-center justify-end gap-2 print:hidden">
      <MentorFillButton onFill={fill} />
      <AnswerKeyButton />
    </div>
  );
}
