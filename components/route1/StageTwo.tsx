"use client";

import { SectionHeading } from "@/components/ui/SectionHeading";
import { MaterialRefs } from "@/components/ui/MaterialRefs";
import { STAGE2, materialRefs } from "@/lib/route1";
import { OptionCard } from "./OptionCard";
import { CommitStep } from "./CommitStep";
import { DecisionPanel } from "./DecisionPanel";
import { useRoute1 } from "./useRoute1";

/**
 * Stage 2 — spend the quarter (level 2).
 *
 * Options on the left, Part 2 of the same Engagement Report building itself on
 * the right. Options can be worked in any order and revisited freely; nothing
 * between them is locked, and nothing here re-introduces AppNexa — the bridge
 * above already handed the learner's own diagnosis into this decision.
 */
export function StageTwo() {
  const r1 = useRoute1();

  return (
    <section id="stage-2" className="scroll-mt-24 space-y-8">
      <SectionHeading
        kicker={`${STAGE2.tag} · about 20 minutes`}
        title={STAGE2.title}
        intro={STAGE2.framing}
      />

      <MaterialRefs
        refs={materialRefs(["constraint", "measures", "defensible"])}
        lead="This stage draws on"
      />

      <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_340px]">
        <div className="min-w-0 space-y-6">
          <ul className="space-y-6">
            {r1.optionStates.map((s) => (
              <OptionCard key={s.option.id} state={s} />
            ))}
          </ul>
          <CommitStep />
        </div>

        <div className="lg:sticky lg:top-20">
          <DecisionPanel />
        </div>
      </div>
    </section>
  );
}
