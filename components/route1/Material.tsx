import { MATERIAL, DIMENSIONS } from "@/lib/route1";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { MaterialBlock } from "@/components/ui/MaterialBlock";
import { CloudBenefitsGridSvg } from "./CloudBenefitsGridSvg";
import { ScaleGaugeSvg } from "./ScaleGaugeSvg";
import { ScaleTensionSvg } from "./ScaleTensionSvg";
import { ChallengesHexSvg } from "./ChallengesHexSvg";
import { InefficiencyLeakageSvg } from "./InefficiencyLeakageSvg";
import { DimensionWheel } from "./DimensionWheel";

const [fundamentals, scale, tension, challenges, inefficiency] = MATERIAL;

export function Material() {
  return (
    <div className="space-y-14">
      <SectionHeading
        kicker="Material"
        title="Five ideas before you touch the case"
        intro="About 60 minutes of reading. Each block pairs a framework with a diagram — the last one is the working model you'll actually use in Task 1."
      />

      <MaterialBlock block={fundamentals}>
        <CloudBenefitsGridSvg />
      </MaterialBlock>

      <MaterialBlock block={scale}>
        <ScaleGaugeSvg />
      </MaterialBlock>

      <MaterialBlock block={tension}>
        <ScaleTensionSvg />
      </MaterialBlock>

      <MaterialBlock block={challenges}>
        <ChallengesHexSvg />
      </MaterialBlock>

      <MaterialBlock block={inefficiency}>
        <InefficiencyLeakageSvg />
      </MaterialBlock>

      <div className="space-y-5">
        <SectionHeading
          kicker="Summary"
          title="The 6-Dimension Wheel"
          intro="Every challenge and inefficiency above sorts into one of six dimensions. You'll use this exact wheel, interactively, in Stage 2 of Task 1 — study the six questions below now."
        />
        <div className="card grid gap-6 p-5 lg:grid-cols-[280px_1fr] lg:items-center">
          <DimensionWheel size={280} />
          <div className="grid gap-3 sm:grid-cols-2">
            {DIMENSIONS.map((d) => (
              <div key={d.id} className="rounded-xl border border-line p-3">
                <p className="text-caption font-semibold text-ink">{d.label}</p>
                <p className="mt-0.5 text-micro text-ash">{d.question}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
