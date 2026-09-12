"use client";

import { SectionHeading } from "@/components/ui/SectionHeading";
import { MaterialBlock } from "@/components/ui/MaterialBlock";
import { Reveal } from "@/components/ui/Reveal";
import { FlowDiagram } from "@/components/ui/FlowDiagram";
import { ArrowRight } from "@/components/icons/LineIcons";
import {
  FURTHER_READING,
  LIFECYCLE_PINS,
  LIFECYCLE_STAGES,
  MATERIAL,
  materialAnchorId,
} from "@/lib/route2";
import { DefensibilityTest, DimensionReference, OptionOverview } from "./MaterialSvgs";
import { ConstraintPanel, RecapPanel } from "./RecapPanel";

/** Route 2 material, Sections A–E. */
export function Material() {
  const [a, b, c, d, e] = MATERIAL;

  return (
    <section className="space-y-14">
      <SectionHeading
        kicker="Material · about 60 minutes"
        title="A defensible way to compare options"
        intro="Five sections. By the end you will be able to take three legitimate competing measures, judge them on dimensions that actually pull against each other, and write a recommendation that holds up in front of the people who control the budget."
      />

      <MaterialBlock block={a} anchorId={materialAnchorId("constraint")}>
        <ConstraintPanel />
      </MaterialBlock>

      <MaterialBlock block={b} anchorId={materialAnchorId("recap")}>
        <RecapPanel />
      </MaterialBlock>

      <MaterialBlock block={c} anchorId={materialAnchorId("measures")}>
        <div>
          <FlowDiagram graph={LIFECYCLE_STAGES} pins={LIFECYCLE_PINS} pinTone="marker" />
          <OptionOverview />
        </div>
      </MaterialBlock>

      <MaterialBlock block={d} anchorId={materialAnchorId("dimensions")}>
        <DimensionReference />
      </MaterialBlock>

      <MaterialBlock block={e} anchorId={materialAnchorId("defensible")}>
        <DefensibilityTest />
      </MaterialBlock>

      <FurtherReading />
    </section>
  );
}

function FurtherReading() {
  return (
    <Reveal as="aside" className="rounded-2xl border border-line bg-mist p-5">
      <p className="text-micro font-semibold uppercase tracking-wide text-ash">
        {FURTHER_READING.heading}
      </p>
      <p className="mt-1 text-caption text-ash">{FURTHER_READING.intro}</p>
      <ul className="mt-4 grid gap-3 md:grid-cols-2">
        {FURTHER_READING.items.map((item) => (
          <li key={item.title}>
            <a
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex h-full flex-col rounded-xl border border-line bg-paper p-4 transition-colors duration-150 hover:border-accent"
            >
              <p className="text-micro font-semibold uppercase tracking-wide text-ash">{item.body}</p>
              <p className="mt-1 flex-1 text-caption font-semibold text-ink">{item.title}</p>
              <p className="mt-2 inline-flex items-center gap-1 text-micro text-accent">
                {item.host}
                <ArrowRight className="h-3.5 w-3.5 transition-transform duration-150 group-hover:translate-x-0.5" />
              </p>
            </a>
          </li>
        ))}
      </ul>
    </Reveal>
  );
}
