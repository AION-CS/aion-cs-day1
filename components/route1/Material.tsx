"use client";

import { useMemo } from "react";
import { useProgress, useHydrated } from "@/lib/store";
import type { MicroCheckBlock } from "@/lib/microCheck";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { MaterialBlock } from "@/components/ui/MaterialBlock";
import { MiniNav } from "@/components/ui/MiniNav";
import { MicroCheck } from "@/components/ui/MicroCheck";
import {
  MATERIAL,
  MATERIAL_MINUTES,
  MATERIAL_NAV,
  MICRO_1,
  MICRO_2,
  MICRO_3,
  MICRO_4,
  MICRO_5,
  R1,
  SECTION_ORDER,
  materialAnchorId,
} from "@/lib/route1";
import { UtilisationGap } from "./diagrams/UtilisationGap";
import { LayerStack } from "./diagrams/LayerStack";
import { LeverMap } from "./diagrams/LeverMap";
import { MeasurementBoundary } from "./diagrams/MeasurementBoundary";
import { LifecycleWheel } from "./diagrams/LifecycleWheel";
import { ReboundCurve } from "./diagrams/ReboundCurve";
import { UseCaseQualifier } from "./diagrams/UseCaseQualifier";
import { EfficiencyLeak } from "./diagrams/EfficiencyLeak";
import { CriteriaTable, LensRadar } from "./diagrams/Lens";
import { DecisionBands, TemplateCard, WorkedExample } from "./diagrams/Uncertainty";
import { DecideOpener, GlossaryStrip, OpenerPanel } from "./diagrams/Framing";

export const MATERIAL_TRACK_ID = "r1-material";

/**
 * The whole teaching block: seven sections, S1–S7, read before any
 * interaction (CLAUDE.md #12). S1–S4 each close with a micro-check; the
 * "Twelve terms" strip closes the technology half; a short opener turns the
 * block to trade-offs; S7 ends with a read-only worked example and the last
 * micro-check.
 */
export function Material() {
  const hydrated = useHydrated();
  const choices = useProgress((s) => s.choices);
  const choose = useProgress((s) => s.choose);
  const [s1, s2, s3, s4, s5, s6, s7] = MATERIAL;

  const navItems = useMemo(
    () =>
      SECTION_ORDER.map((id) => ({
        id,
        code: MATERIAL_NAV[id].code,
        label: MATERIAL_NAV[id].label,
        anchorId: materialAnchorId(id),
      })),
    [],
  );

  const micro = (block: MicroCheckBlock) => (
    <MicroCheck
      block={block}
      anchorId={`r1-${block.id}`}
      value={(q) => (hydrated ? choices[R1.micro(q)] || null : null)}
      onAnswer={(q, o) => choose(R1.micro(q), o)}
    />
  );

  return (
    <div id={MATERIAL_TRACK_ID} className="space-y-14">
      <MiniNav items={navItems} trackId={MATERIAL_TRACK_ID} />

      <SectionHeading
        kicker={`Material · seven sections · about ${MATERIAL_MINUTES} minutes`}
        title="Networks, IoT & 5G: the infrastructure behind the sustainability balance"
        intro="All of the teaching comes first. S1–S4 build the technical vocabulary — what drives network energy, the levers and the standard that measures them, IoT across its lifecycle, and 5G's rebound risk. S5–S7 turn it into decisions — system impact, the 7-criteria lens, and deciding before the data is complete. The task assumes every section below."
      />

      <OpenerPanel />

      <MaterialBlock section={s1} anchorId={materialAnchorId("infrastructure")} footer={micro(MICRO_1)}>
        <div className="space-y-10">
          <UtilisationGap />
          <LayerStack />
        </div>
      </MaterialBlock>

      <MaterialBlock section={s2} anchorId={materialAnchorId("levers")} footer={micro(MICRO_2)}>
        <div className="space-y-10">
          <LeverMap />
          <MeasurementBoundary />
        </div>
      </MaterialBlock>

      <MaterialBlock section={s3} anchorId={materialAnchorId("iot")} footer={micro(MICRO_3)}>
        <LifecycleWheel />
      </MaterialBlock>

      <MaterialBlock section={s4} anchorId={materialAnchorId("fiveg")} footer={micro(MICRO_4)}>
        <div className="space-y-10">
          <ReboundCurve />
          <UseCaseQualifier />
        </div>
      </MaterialBlock>

      <GlossaryStrip />

      <DecideOpener />

      <MaterialBlock section={s5} anchorId={materialAnchorId("system")}>
        <EfficiencyLeak />
      </MaterialBlock>

      <MaterialBlock section={s6} anchorId={materialAnchorId("lens")}>
        <div className="space-y-8">
          <CriteriaTable />
          <LensRadar />
        </div>
      </MaterialBlock>

      <MaterialBlock
        section={s7}
        anchorId={materialAnchorId("uncertainty")}
        footer={
          <div className="space-y-6">
            <WorkedExample />
            {micro(MICRO_5)}
          </div>
        }
      >
        <div className="space-y-6">
          <DecisionBands />
          <TemplateCard />
        </div>
      </MaterialBlock>
    </div>
  );
}
