import { MATERIAL, DIMENSIONS, materialAnchorId } from "@/lib/route1";
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
        intro="About 60 minutes of reading. Each block pairs a framework with a diagram, and closes with the decision rules the task will actually ask you to apply — the last one is the working model you'll use in Task 1."
      />

      <MaterialBlock block={fundamentals} anchorId={materialAnchorId("fundamentals")}>
        <CloudBenefitsGridSvg />
      </MaterialBlock>

      <MaterialBlock block={scale} anchorId={materialAnchorId("scale")}>
        <ScaleGaugeSvg />
      </MaterialBlock>

      <MaterialBlock block={tension} anchorId={materialAnchorId("tension")}>
        <ScaleTensionSvg />
      </MaterialBlock>

      <MaterialBlock block={challenges} anchorId={materialAnchorId("challenges")}>
        <ChallengesHexSvg />
      </MaterialBlock>

      <MaterialBlock block={inefficiency} anchorId={materialAnchorId("inefficiency")}>
        <InefficiencyLeakageSvg />
      </MaterialBlock>

      <div id={materialAnchorId("wheel")} className="scroll-mt-24 space-y-5">
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
        <div className="rounded-2xl border border-accent/30 bg-accentSoft/50 p-4">
          <p className="text-micro font-semibold uppercase tracking-wide text-accent">
            How to decide when this comes up in the task
          </p>
          <ul className="mt-2 space-y-1.5">
            {[
              "Each card gets exactly one segment, so ask which question above the card answers most directly — not which ones it touches at all.",
              "If two segments seem to fit, prefer the one the card names in its own words: \"no uniform governance\" answers the Governance question; \"departments order independently\" answers the Controllability one.",
              "Dependencies is about how hard it would be to leave or renegotiate with a provider. Nothing in Flexora's six cards is about that — an empty segment is a valid outcome, not a mistake.",
            ].map((rule, i) => (
              <li key={i} className="flex gap-2 text-caption text-ink">
                <span className="mt-[3px] h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                <span>{rule}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
