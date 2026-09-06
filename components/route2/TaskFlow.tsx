"use client";

import { TASK2, CRITERIA } from "@/lib/route2";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Info } from "@/components/icons/LineIcons";
import { CaseBrief } from "./CaseBrief";
import { CriterionCard } from "./CriterionCard";
import { PrioritizationRadar } from "./PrioritizationRadar";
import { DecisionSection } from "./DecisionSection";
import { DecisionMemoPanel } from "./DecisionMemoPanel";
import { ExportBar } from "./ExportBar";

export function TaskFlow() {
  return (
    <section id="task" className="space-y-8">
      <SectionHeading kicker={TASK2.kicker} title={TASK2.heading} intro={TASK2.subtext} />

      <div className="flex items-start gap-3 rounded-xl border border-line bg-canvas p-4">
        <Info className="mt-0.5 h-4 w-4 shrink-0 text-ash" />
        <p className="text-caption text-ash">{TASK2.orderBanner}</p>
      </div>

      <div className="lg:grid lg:grid-cols-[1fr_360px] lg:items-start lg:gap-8">
        <div className="space-y-10">
          <CaseBrief />

          <div>
            <h3 className="text-h3 text-ink">{TASK2.criteriaHeading}</h3>
            <p className="mt-1 text-caption text-ash">{TASK2.criteriaInstructions}</p>
            <div className="mt-4 space-y-4">
              {CRITERIA.map((c) => (
                <CriterionCard key={c.id} criterion={c} />
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-h3 text-ink">{TASK2.radarHeading}</h3>
            <p className="mt-1 text-caption text-ash">{TASK2.radarIntro}</p>
            <div className="mt-4">
              <PrioritizationRadar />
            </div>
          </div>

          <DecisionSection />
        </div>

        <div className="mt-8 lg:mt-0">
          <DecisionMemoPanel />
        </div>
      </div>

      <ExportBar />
    </section>
  );
}
