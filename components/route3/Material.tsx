import { MATERIAL, RECAP, materialAnchorId } from "@/lib/route3";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { MaterialBlock } from "@/components/ui/MaterialBlock";
import {
  MeasuresVsArchitectureSvg,
  DecisionRuleLadderSvg,
  RaciExampleSvg,
  RegulatoryHorizonSvg,
} from "./MaterialSvgs";

const [architecture, rules, accountability, review] = MATERIAL;

export function Material() {
  return (
    <div className="space-y-14">
      <SectionHeading
        kicker="Material"
        title="Four ideas before you face the board"
        intro="About seven minutes of reading. This route stands on its own — the recap below carries the facts everything here rests on, so nothing is missing if you start at Route 3."
      />

      <div className="rounded-2xl border border-accent/30 bg-accentSoft/50 p-5">
        <p className="text-micro font-semibold uppercase tracking-wide text-accent">{RECAP.label}</p>
        <p className="mt-2 text-body text-ink">{RECAP.text}</p>
        <p className="mt-2 text-caption font-semibold text-ink">{RECAP.implication}</p>
      </div>

      <MaterialBlock block={architecture} anchorId={materialAnchorId("architecture")}>
        <MeasuresVsArchitectureSvg />
      </MaterialBlock>

      <MaterialBlock block={rules} anchorId={materialAnchorId("rules")}>
        <DecisionRuleLadderSvg />
      </MaterialBlock>

      <MaterialBlock block={accountability} anchorId={materialAnchorId("accountability")}>
        <RaciExampleSvg />
      </MaterialBlock>

      <MaterialBlock block={review} anchorId={materialAnchorId("review")}>
        <RegulatoryHorizonSvg />
      </MaterialBlock>
    </div>
  );
}
