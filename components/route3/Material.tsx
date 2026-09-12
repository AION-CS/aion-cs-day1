"use client";

import { SectionHeading } from "@/components/ui/SectionHeading";
import { MaterialBlock } from "@/components/ui/MaterialBlock";
import { Reveal } from "@/components/ui/Reveal";
import { ArrowRight } from "@/components/icons/LineIcons";
import { FURTHER_READING, MATERIAL, materialAnchorId } from "@/lib/route3";
import { BackdropStrip, BoardTension, RaciLegend, WorkedExample } from "./MaterialSvgs";

/** Route 3 material, Sections A–D. Section D carries the SoftPulse worked example. */
export function Material() {
  const [a, b, c, d] = MATERIAL;

  return (
    <section className="space-y-14">
      <SectionHeading
        kicker="Material · about 60 minutes"
        title="From a fix to a decision architecture"
        intro="Four sections, ending in a fully worked example. By the end you will be able to take a company you have never seen, name what its governance is missing, and design the structure that makes good decisions the default after you leave."
      />

      <MaterialBlock block={a} anchorId={materialAnchorId("board")}>
        <BoardTension />
      </MaterialBlock>

      <MaterialBlock block={b} anchorId={materialAnchorId("governance")}>
        <RaciLegend />
      </MaterialBlock>

      <MaterialBlock block={c} anchorId={materialAnchorId("backdrop")}>
        <BackdropStrip />
      </MaterialBlock>

      <MaterialBlock block={d} anchorId={materialAnchorId("worked")}>
        <WorkedExample />
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
      <ul className="mt-4 grid gap-3 md:grid-cols-3">
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
