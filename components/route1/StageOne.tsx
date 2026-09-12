"use client";

import { SectionHeading } from "@/components/ui/SectionHeading";
import { MaterialRefs } from "@/components/ui/MaterialRefs";
import { STAGE1, materialRefs } from "@/lib/route1";
import { SystemTrace } from "./SystemTrace";
import { HotspotWorkups } from "./HotspotWorkup";
import { DiagnosisPanel } from "./DiagnosisPanel";

/**
 * Stage 1 — diagnose AppNexa's live system trace (level 1).
 *
 * Work on the left, Part 1 of the Engagement Report building itself on the
 * right. No case block and no name field here: the route says those once,
 * above the material. No export bar either — the route exports once, at the
 * bottom, after stage 2 (CLAUDE.md #12).
 */
export function StageOne() {
  return (
    <section id="stage-1" className="scroll-mt-24 space-y-8">
      <SectionHeading
        kicker={`${STAGE1.tag} · about 20 minutes`}
        title={STAGE1.title}
        intro={STAGE1.framing}
      />

      <MaterialRefs
        refs={materialRefs(["categories", "principles", "sci"])}
        lead="This stage draws on"
      />

      <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_340px]">
        <div className="min-w-0 space-y-8">
          <SystemTrace />
          <HotspotWorkups />
        </div>

        <div className="lg:sticky lg:top-20">
          <DiagnosisPanel />
        </div>
      </div>
    </section>
  );
}
