"use client";

import { undoRedoKeyHandler } from "@/lib/undoShortcuts";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { MaterialRefs } from "@/components/ui/MaterialRefs";
import { LivePanel } from "@/components/ui/LivePanel";
import { SeriesSwatch } from "@/components/ui/RadarChart";
import { BRIEF, OPTIONS, PART_TWO, RADAR, materialRefs, type ScoreOption } from "@/lib/route1";
import { useMatrixActions } from "./actions";
import { RankMatrix } from "./RankMatrix";
import { LiveRadar } from "./LiveRadar";
import { CommitPanel } from "./CommitPanel";
import { ReasoningCheck } from "./ReasoningCheck";
import { OPTION_STYLE } from "./optionStyle";
import { useRoute1, domId } from "./useRoute1";

/**
 * Part 2 — the Decision Scorecard (level 2). The brief once, the three options
 * with their concrete scope, the ranking matrix beside the live radar, then the
 * commit and the reasoning check. Ctrl/⌘+Z works anywhere in this part, on the
 * matrix's own history.
 */
export function PartTwo() {
  const r1 = useRoute1();
  const matrix = useMatrixActions();

  return (
    <section id={domId.partTwo} className="scroll-mt-24 space-y-6" onKeyDown={undoRedoKeyHandler(matrix.undo, matrix.redo)}>
      <SectionHeading kicker={`${PART_TWO.tag} · about ${PART_TWO.minutes} minutes`} title={PART_TWO.title} />

      <MaterialRefs refs={materialRefs(["lens", "system", "uncertainty"])} lead="This part draws on" />

      <div className="rounded-2xl border border-line bg-mist p-5">
        <p className="text-micro font-semibold uppercase tracking-wide text-ash">The brief</p>
        {BRIEF.paragraphs.map((p, i) => (
          <p key={i} className={i === 0 ? "mt-1.5 max-w-prose text-body text-ink" : "mt-2 max-w-prose text-body font-semibold text-ink"}>
            {p}
          </p>
        ))}
        <ul className="mt-3 flex flex-wrap gap-1.5">
          {BRIEF.constraints.map((c) => (
            <li key={c} className="rounded-full border border-line bg-paper px-2.5 py-1 text-micro font-semibold text-ash">
              {c}
            </li>
          ))}
        </ul>
      </div>

      <div className="grid gap-3 lg:grid-cols-3">
        {OPTIONS.map((o) => (
          <OptionCard key={o.id} option={o} />
        ))}
      </div>

      <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
        <RankMatrix r1={r1} matrix={matrix} />
        <LivePanel title={RADAR.title} summary={`${r1.rankedRows} of 7 criteria fully ranked`}>
          <LiveRadar r1={r1} />
        </LivePanel>
      </div>

      <CommitPanel r1={r1} />

      <ReasoningCheck r1={r1} />
    </section>
  );
}

function OptionCard({ option }: { option: ScoreOption }) {
  return (
    <article className="flex flex-col rounded-2xl border border-line bg-paper p-4">
      <div className="flex items-center gap-2">
        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-ink text-caption font-bold text-paper">{option.id}</span>
        <SeriesSwatch style={OPTION_STYLE[option.id]} />
        <span className="text-micro font-semibold uppercase tracking-wide text-ash">{option.short}</span>
      </div>
      <p className="mt-2 text-caption font-semibold text-ink">{option.name}</p>
      <details className="mt-3 rounded-lg border border-line bg-canvas px-3 py-2">
        <summary className="cursor-pointer text-micro font-semibold text-accent">{PART_TWO.meansLabel}</summary>
        <ul className="mt-2 space-y-1.5">
          {option.means.map((m) => (
            <li key={m} className="flex gap-2 text-caption text-ash">
              <span className="mt-[7px] h-1 w-1 shrink-0 rounded-full bg-ash" />
              <span>{m}</span>
            </li>
          ))}
        </ul>
      </details>
      <MaterialRefs refs={materialRefs(option.material)} />
    </article>
  );
}
