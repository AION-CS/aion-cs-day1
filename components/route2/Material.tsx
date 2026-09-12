import { MATERIAL, RECAP, materialAnchorId } from "@/lib/route2";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { MaterialBlock } from "@/components/ui/MaterialBlock";
import {
  ThreeMeasureComparisonSvg,
  McdaFlowSvg,
  EacCurveSvg,
  EsuLadderSvg,
  VisibleStructuralMatrixSvg,
} from "./MaterialSvgs";

const [trap, mcda, economics, structural] = MATERIAL;

export function Material() {
  return (
    <div className="space-y-14">
      <SectionHeading
        kicker="Material"
        title="Four ideas before you rank anything"
        intro="About seven minutes of reading. This route stands on its own — the recap below carries the one number everything here rests on, so you lose nothing by starting at Route 2."
      />

      {/* Standalone recap — Route 2 must work for a learner who never opened Route 1. */}
      <div className="rounded-2xl border border-accent/30 bg-accentSoft/50 p-5">
        <p className="text-micro font-semibold uppercase tracking-wide text-accent">{RECAP.label}</p>
        <p className="mt-2 text-body text-ink">{RECAP.text}</p>
        <p className="mt-2 text-caption font-semibold text-ink">{RECAP.implication}</p>
      </div>

      <MaterialBlock block={trap} anchorId={materialAnchorId("trap")}>
        <ThreeMeasureComparisonSvg />
      </MaterialBlock>

      <MaterialBlock block={mcda} anchorId={materialAnchorId("mcda")}>
        <McdaFlowSvg />
      </MaterialBlock>

      <MaterialBlock block={economics} anchorId={materialAnchorId("economics")}>
        <div className="space-y-6">
          <EacCurveSvg />
          <div className="border-t border-line pt-5">
            <EsuLadderSvg />
          </div>
        </div>
      </MaterialBlock>

      <MaterialBlock block={structural} anchorId={materialAnchorId("structural")}>
        <VisibleStructuralMatrixSvg />
      </MaterialBlock>
    </div>
  );
}
