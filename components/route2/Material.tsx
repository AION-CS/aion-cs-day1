import clsx from "clsx";
import { MATERIAL, CRITERIA, SEVEN_DIMENSIONS } from "@/lib/route2";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { MaterialBlock } from "@/components/ui/MaterialBlock";
import { RadarChart } from "@/components/ui/RadarChart";
import { FinOpsCycleSvg } from "./FinOpsCycleSvg";
import { NoRegretPyramidSvg } from "./NoRegretPyramidSvg";
import { GovernanceMultiplierSvg } from "./GovernanceMultiplierSvg";
import { QuickWinTimelineSvg } from "./QuickWinTimelineSvg";

const [finops, sevendim, uncertainty, multiplier, shorttermism] = MATERIAL;

export function Material() {
  return (
    <div className="space-y-14">
      <SectionHeading
        kicker="Material"
        title="Five ideas before the prioritisation decision"
        intro="About 60 minutes. Each block pairs a framework with a diagram — the second one is the working tool you'll actually use in Task 2."
      />

      <MaterialBlock block={finops}>
        <FinOpsCycleSvg />
      </MaterialBlock>

      <MaterialBlock block={sevendim}>
        <div>
          <RadarChart axes={CRITERIA.map((c) => ({ id: c.id, label: c.label }))} series={[]} maxScore={3} />
          <p className="mt-2 text-micro text-ash">
            An empty shell on purpose — this is the exact chart, with the exact four axes, that fills in live with
            your own answers in Stage 1 of Task 2.
          </p>
          <div className="mt-4 grid gap-2.5 sm:grid-cols-2">
            {SEVEN_DIMENSIONS.map((d, i) => (
              <div key={d.id} className={clsx("rounded-xl border p-3", d.scoredInTask ? "border-accent/30 bg-accentSoft/30" : "border-line")}>
                <p className="text-caption font-semibold text-ink">
                  {i + 1}. {d.label}
                  {d.scoredInTask && <span className="ml-1.5 text-micro font-normal text-accent">· scored in Task 2</span>}
                </p>
                <p className="mt-0.5 text-micro text-ash">{d.definition}</p>
              </div>
            ))}
          </div>
        </div>
      </MaterialBlock>

      <MaterialBlock block={uncertainty}>
        <NoRegretPyramidSvg />
      </MaterialBlock>

      <MaterialBlock block={multiplier}>
        <GovernanceMultiplierSvg />
      </MaterialBlock>

      <MaterialBlock block={shorttermism}>
        <QuickWinTimelineSvg />
      </MaterialBlock>
    </div>
  );
}
