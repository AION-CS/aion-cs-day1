"use client";

import { SectionHeading } from "@/components/ui/SectionHeading";
import { LivePanel } from "@/components/ui/LivePanel";
import { EXPORT, MAP_MEASURES, RANK_SLOTS, TASK } from "@/lib/route2";
import { PrioritiseExercise } from "./PrioritiseExercise";
import { RankExercise } from "./RankExercise";
import { MapExercise } from "./MapExercise";
import { RaciExercise } from "./RaciExercise";
import { DecideNow } from "./DecideNow";
import { BoardMemo } from "./BoardMemo";
import { useRoute2, domId } from "./useRoute2";

/**
 * The task — five exercises on the left, the board memo assembling on the
 * right (a sticky strip on mobile). No exercise gates another.
 */
export function Task() {
  const r2 = useRoute2();

  return (
    <section id={domId.task} className="scroll-mt-24 space-y-6">
      <SectionHeading kicker={`${TASK.tag} · about ${TASK.minutes} minutes`} title={TASK.title} intro={TASK.framing} />

      <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_340px]">
        <div className="min-w-0 space-y-6">
          <PrioritiseExercise />
          <RankExercise />
          <MapExercise />
          <RaciExercise />
          <DecideNow />
        </div>

        <LivePanel
          title={EXPORT.docHeading}
          summary={`${r2.lane ? "1" : "0"}/1 prioritised · ${r2.ranking.length}/${RANK_SLOTS} decisions · ${r2.placedCount}/${MAP_MEASURES.length} initiatives mapped`}
        >
          <BoardMemo />
        </LivePanel>
      </div>
    </section>
  );
}
