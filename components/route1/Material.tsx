import { MATERIAL, FRAMEWORKS, FRAMEWORK_REASONING, materialAnchorId } from "@/lib/route1";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { MaterialBlock } from "@/components/ui/MaterialBlock";
import { WorkplaceElementsSvg } from "./WorkplaceElementsSvg";
import { LifecycleCarbonSvg } from "./LifecycleCarbonSvg";
import { ServiceLifeTimelineSvg } from "./ServiceLifeTimelineSvg";
import { LeverSizeSvg } from "./LeverSizeSvg";

const [workplace, carbon, servicelife, tradeoffs] = MATERIAL;

export function Material() {
  return (
    <div className="space-y-14">
      <SectionHeading
        kicker="Material"
        title="Four ideas before you walk the floor"
        intro="About seven minutes of reading. Each block pairs a framework with a diagram and closes with the decision rules the task will actually ask you to apply — the last one is the argument you will need when someone pushes back."
      />

      <MaterialBlock block={workplace} anchorId={materialAnchorId("workplace")}>
        <WorkplaceElementsSvg />
      </MaterialBlock>

      <MaterialBlock block={carbon} anchorId={materialAnchorId("carbon")}>
        <LifecycleCarbonSvg />
      </MaterialBlock>

      <MaterialBlock block={servicelife} anchorId={materialAnchorId("servicelife")}>
        <ServiceLifeTimelineSvg />
      </MaterialBlock>

      <MaterialBlock block={tradeoffs} anchorId={materialAnchorId("tradeoffs")}>
        <LeverSizeSvg />
      </MaterialBlock>

      <div id={materialAnchorId("frameworks")} className="scroll-mt-24 space-y-5">
        <SectionHeading
          kicker="Reference"
          title="The four frameworks behind all of this"
          intro="You do not need to memorise these. You do need to know which one to reach for when a manager asks why this is worth doing now."
        />
        <div className="grid gap-3 sm:grid-cols-2">
          {FRAMEWORKS.map((f) => (
            <div key={f.id} className="card p-4">
              <p className="text-caption font-semibold text-ink">{f.name}</p>
              <p className="mt-1 text-micro text-ash">{f.governs}</p>
            </div>
          ))}
        </div>
        <div className="rounded-2xl border border-accent/30 bg-accentSoft/50 p-4">
          <p className="text-micro font-semibold uppercase tracking-wide text-accent">
            How to decide when this comes up in the task
          </p>
          <ul className="mt-2 space-y-1.5">
            {FRAMEWORK_REASONING.map((rule, i) => (
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
