import { MATERIAL, materialAnchorId } from "@/lib/route3";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { MaterialBlock } from "@/components/ui/MaterialBlock";
import { SevenDimensionHoneySvg } from "./SevenDimensionHoneySvg";
import { DecisionArchitectureModel } from "./DecisionArchitectureModel";
import { IcebergSvg } from "./IcebergSvg";
import { RoadmapLanesSvg } from "./RoadmapLanesSvg";
import { ProposalChecklistSvg } from "./ProposalChecklistSvg";

const [shift, architectureModel, iceberg, horizons, proposalStructure] = MATERIAL;

export function Material() {
  return (
    <div className="space-y-14">
      <SectionHeading
        kicker="Material"
        title="Five ideas before the capstone task"
        intro="About 60 minutes. The second block is the model the whole route runs on."
      />

      <MaterialBlock block={shift} anchorId={materialAnchorId("shift")}>
        <SevenDimensionHoneySvg />
      </MaterialBlock>

      <MaterialBlock block={architectureModel} anchorId={materialAnchorId("architecture-model")}>
        <div className="mx-auto max-w-sm">
          <DecisionArchitectureModel />
        </div>
        <p className="mt-2 text-center text-micro text-ash">
          An empty shell on purpose — you'll map SkyBridge's own evidence onto this exact model in Stage 1.
        </p>
      </MaterialBlock>

      <MaterialBlock block={iceberg} anchorId={materialAnchorId("iceberg")}>
        <IcebergSvg />
      </MaterialBlock>

      <MaterialBlock block={horizons} anchorId={materialAnchorId("horizons")}>
        <RoadmapLanesSvg />
        <p className="mt-2 text-center text-micro text-ash">
          Same three lanes, functional, in Stage 2 — you'll drag your chosen levers onto them.
        </p>
      </MaterialBlock>

      <MaterialBlock block={proposalStructure} anchorId={materialAnchorId("proposal-structure")}>
        <ProposalChecklistSvg />
      </MaterialBlock>
    </div>
  );
}
