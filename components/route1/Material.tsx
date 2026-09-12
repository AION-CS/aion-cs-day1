"use client";

import { SectionHeading } from "@/components/ui/SectionHeading";
import { MaterialBlock } from "@/components/ui/MaterialBlock";
import { Reveal } from "@/components/ui/Reveal";
import { ArrowRight } from "@/components/icons/LineIcons";
import { FlowDiagram } from "@/components/ui/FlowDiagram";
import {
  DECISION_MATERIAL,
  DECISION_READING,
  ENERGY_CHAIN,
  FOUNDATION_MATERIAL,
  FOUNDATION_READING,
  LIFECYCLE_PINS,
  LIFECYCLE_STAGES,
  materialAnchorId,
} from "@/lib/route1";
import { SixCategoryGrid } from "./CategoryGrid";
import { CorrectnessMatrix, SciFormulaBreakdown, ThreePrinciplesTriad } from "./MaterialSvgs";
import { DefensibilityTest, DimensionReference, OptionOverview } from "./DecisionSvgs";
import { ConstraintPanel } from "./ConstraintPanel";

/**
 * The route's material, in one continuous lettered run A–J, rendered in two
 * halves either side of stage 1 (CLAUDE.md #12, CURRICULUM-GUIDE.md §2–§3).
 *
 * A–F teach the learner to see the waste; G–J teach them how to choose what to
 * do about it. They are one sequence, not two: the letters run straight
 * through, the MaterialRefs chips on both stages point into the same run, and
 * nothing in G–J re-teaches anything from A–F.
 */

/** Sections A–F — read before stage 1. */
export function FoundationsMaterial() {
  const [a, b, c, d, e, f] = FOUNDATION_MATERIAL;

  return (
    <section className="space-y-14">
      <SectionHeading
        kicker="Material A–F · about 20 minutes"
        title="Seeing where software wastes energy"
        intro="Six sections. By the end you will be able to look at a running system you did not build, name where it wastes energy, and say which measurable variable a proposed fix would actually move."
      />

      <MaterialBlock block={a} anchorId={materialAnchorId("footprint")}>
        <FlowDiagram graph={ENERGY_CHAIN} />
      </MaterialBlock>

      <MaterialBlock block={b} anchorId={materialAnchorId("correctness")}>
        <CorrectnessMatrix />
      </MaterialBlock>

      <MaterialBlock block={c} anchorId={materialAnchorId("sci")}>
        <SciFormulaBreakdown />
      </MaterialBlock>

      <MaterialBlock block={d} anchorId={materialAnchorId("principles")}>
        <ThreePrinciplesTriad />
      </MaterialBlock>

      <MaterialBlock block={e} anchorId={materialAnchorId("categories")}>
        <div className="space-y-4">
          <p className="text-micro font-semibold uppercase tracking-wide text-accent">
            The six categories — and the six bins you will sort into
          </p>
          <SixCategoryGrid detailed />
        </div>
      </MaterialBlock>

      <MaterialBlock block={f} anchorId={materialAnchorId("profession")}>
        <ProfessionalContext />
      </MaterialBlock>

      <FurtherReading block={FOUNDATION_READING} columns={3} />
    </section>
  );
}

/** Sections G–J — read after the diagnosis, before stage 2. */
export function DecisionMaterial() {
  const [g, h, i, j] = DECISION_MATERIAL;

  return (
    <section className="space-y-14">
      <SectionHeading
        kicker="Material G–J · about 15 minutes"
        title="A defensible way to compare the options"
        intro="Four more sections, continuing the same run. By the end you will be able to take three legitimate competing measures, judge them on dimensions that actually pull against each other, and write a recommendation that holds up in front of the people who control the budget."
      />

      <MaterialBlock block={g} anchorId={materialAnchorId("constraint")}>
        <ConstraintPanel />
      </MaterialBlock>

      <MaterialBlock block={h} anchorId={materialAnchorId("measures")}>
        <div>
          <FlowDiagram graph={LIFECYCLE_STAGES} pins={LIFECYCLE_PINS} pinTone="marker" />
          <OptionOverview />
        </div>
      </MaterialBlock>

      <MaterialBlock block={i} anchorId={materialAnchorId("dimensions")}>
        <DimensionReference />
      </MaterialBlock>

      <MaterialBlock block={j} anchorId={materialAnchorId("defensible")}>
        <DefensibilityTest />
      </MaterialBlock>

      <FurtherReading block={DECISION_READING} columns={2} />
    </section>
  );
}

/** Section F's visual: where the five technical categories sit against the governance layer. */
function ProfessionalContext() {
  const rows = [
    {
      layer: "Governance layer",
      owner: "Leadership · what gets measured and rewarded",
      scope: "Category 6 — Management Logic. Above the GSF Patterns catalog entirely.",
      tone: "warn" as const,
    },
    {
      layer: "Standards layer",
      owner: "Architects · leads · review criteria",
      scope:
        "Where the lever for most of categories 1–5 actually sits. iSAQB CPSA Advanced Level, Module GREEN lives here.",
      tone: "accent" as const,
    },
    {
      layer: "Implementation layer",
      owner: "Individual engineers · this sprint's code",
      scope: "Where the symptoms appear — and the layer least able to fix them on its own.",
      tone: "plain" as const,
    },
  ];

  return (
    <ol className="space-y-2">
      {rows.map((r) => (
        <li
          key={r.layer}
          className={
            r.tone === "warn"
              ? "rounded-2xl border border-warn/40 bg-warn/5 p-4"
              : r.tone === "accent"
                ? "rounded-2xl border border-accent/35 bg-accentSoft p-4"
                : "rounded-2xl border border-line bg-canvas p-4"
          }
        >
          <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
            <p className="text-h3 text-ink">{r.layer}</p>
            <p className="text-micro uppercase tracking-wide text-ash">{r.owner}</p>
          </div>
          <p className="mt-1.5 text-caption text-ash">{r.scope}</p>
        </li>
      ))}
    </ol>
  );
}

type ReadingBlock = {
  heading: string;
  intro: string;
  items: readonly { body: string; title: string; host: string; url: string }[];
};

/** One reading card per material half, sourced from that half's own module. */
function FurtherReading({ block, columns }: { block: ReadingBlock; columns: 2 | 3 }) {
  return (
    <Reveal as="aside" className="rounded-2xl border border-line bg-mist p-5">
      <p className="text-micro font-semibold uppercase tracking-wide text-ash">{block.heading}</p>
      <p className="mt-1 text-caption text-ash">{block.intro}</p>
      <ul className={`mt-4 grid gap-3 ${columns === 3 ? "md:grid-cols-3" : "md:grid-cols-2"}`}>
        {block.items.map((item) => (
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
