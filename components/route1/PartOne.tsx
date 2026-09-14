"use client";

import { useState } from "react";
import { useProgress } from "@/lib/store";
import { undoRedoKeyHandler } from "@/lib/undoShortcuts";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { LivePanel } from "@/components/ui/LivePanel";
import { MaterialRefs } from "@/components/ui/MaterialRefs";
import { SlideOver } from "@/components/ui/SlideOver";
import { UndoRedoControls } from "@/components/ui/UndoRedoControls";
import { PART_ONE, R1, materialRefs } from "@/lib/route1";
import { useBoardActions } from "./actions";
import { SignalBoard } from "./SignalBoard";
import { SignalCard, type ReferenceId } from "./SignalCard";
import { RoutingCheck } from "./RoutingCheck";
import { SummaryStrip, matchesFilter, type BoardFilter } from "./SummaryStrip";
import { LeverMap } from "./diagrams/LeverMap";
import { LifecycleWheel } from "./diagrams/LifecycleWheel";
import { useRoute1, domId } from "./useRoute1";

/**
 * Part 1 — the Signal Board (level 1). Six signal cards on the left, the board
 * in the sticky column on the right (a tap-to-expand strip on phones), the live
 * summary above, the check below. No gate at either end: the signals can be
 * worked in any order and Part 2 is reachable whether or not they are done.
 *
 * Ctrl/⌘+Z and Ctrl/⌘+Shift+Z work anywhere inside this part, on this part's
 * own history only.
 */
export function PartOne() {
  const r1 = useRoute1();
  const board = useBoardActions();
  const choose = useProgress((s) => s.choose);
  const [filter, setFilter] = useState<BoardFilter>(null);
  const [reference, setReference] = useState<ReferenceId | null>(null);

  const openSignal = (id: string) => choose(R1.openSignal, id);
  const toggle = (id: string) => choose(R1.openSignal, r1.openSignalId === id ? "" : id);

  return (
    <section id={domId.partOne} className="scroll-mt-24 space-y-6" onKeyDown={undoRedoKeyHandler(board.undo, board.redo)}>
      <SectionHeading kicker={`${PART_ONE.tag} · about ${PART_ONE.minutes} minutes`} title={PART_ONE.title} intro={PART_ONE.framing} />

      <MaterialRefs refs={materialRefs(["infrastructure", "levers", "iot", "fiveg"])} lead="This part draws on" />

      <SummaryStrip tally={r1.tally} filter={filter} onFilter={setFilter} />

      <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,500px)]">
        <div className="min-w-0 space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <p className="text-micro font-semibold uppercase tracking-wide text-ash">The six signals</p>
            <UndoRedoControls onUndo={board.undo} onRedo={board.redo} canUndo={board.canUndo} canRedo={board.canRedo} />
          </div>

          <ul className="space-y-3">
            {r1.signals.map((s) => (
              <SignalCard
                key={s.signal.id}
                state={s}
                open={r1.openSignalId === s.signal.id}
                onToggle={() => toggle(s.signal.id)}
                dimmed={!!filter && !matchesFilter(s, filter)}
                onReference={setReference}
                board={board}
              />
            ))}
          </ul>

          <RoutingCheck r1={r1} onOpenSignal={openSignal} />
        </div>

        <LivePanel title="Signal Board" summary={`${r1.tally.routed} of ${r1.tally.total} routed · ${r1.tally.zonesUsed} of 7 zones used`}>
          <SignalBoard signals={r1.signals} zoneCounts={r1.zoneCounts} filter={filter} />
        </LivePanel>
      </div>

      <SlideOver open={reference === "levers"} onClose={() => setReference(null)} kicker="Reference · S2" title="Lever Map">
        <LeverMap compact />
      </SlideOver>
      <SlideOver open={reference === "lifecycle"} onClose={() => setReference(null)} kicker="Reference · S3" title="IoT Lifecycle Wheel">
        <LifecycleWheel compact />
      </SlideOver>
    </section>
  );
}
