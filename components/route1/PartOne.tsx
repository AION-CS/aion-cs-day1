"use client";

import { SectionHeading } from "@/components/ui/SectionHeading";
import { LivePanel } from "@/components/ui/LivePanel";
import { MaterialRefs } from "@/components/ui/MaterialRefs";
import { EXPORT, PART_ONE, materialRefs } from "@/lib/route1";
import { SignalCard } from "./SignalCard";
import { ReportPanel } from "./ReportPanel";
import { useRoute1, domId } from "./useRoute1";

/**
 * Part 1 — Diagnose (level 1). Signal bank on the left, the report assembling
 * on the right, no gate at either end: the six signals can be worked in any
 * order, and Part 2 below is reachable whether or not they are finished.
 */
export function PartOne() {
  const r1 = useRoute1();

  return (
    <section id={domId.partOne} className="scroll-mt-24 space-y-6">
      <SectionHeading
        kicker={`${PART_ONE.tag} · about ${PART_ONE.minutes} minutes`}
        title={PART_ONE.title}
        intro={PART_ONE.framing}
      />

      <MaterialRefs
        refs={materialRefs(["monitoring", "load", "architecture"])}
        lead="This part draws on"
      />

      <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_340px]">
        <ul className="min-w-0 space-y-3">
          {r1.findings.map((f) => (
            <SignalCard key={f.signal.id} finding={f} />
          ))}
        </ul>

        <LivePanel
          title={`${EXPORT.docHeading} · ${EXPORT.partOne}`}
          summary={`${r1.completeCount} of ${r1.totalSignals} findings filed`}
        >
          <ReportPanel />
        </LivePanel>
      </div>
    </section>
  );
}
