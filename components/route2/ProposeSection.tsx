"use client";

import { useProgress } from "@/lib/store";
import { AnswerKey } from "@/components/ui/AnswerKey";
import { scrollToAndFlash } from "@/lib/scrollToAndFlash";
import { PART_TWO, PART_TWO_ANSWER_KEY, R2, measureLineById, nextOwnershipRole } from "@/lib/route2";
import { OwnershipMap } from "./OwnershipMap";
import { ReversibilityTest } from "./ReversibilityTest";
import { useRoute2, domId } from "./useRoute2";

/**
 * Part 2 — turn the Part 1 priority into a short proposal. Reachable at any
 * time (CLAUDE.md §6): if Part 1 isn't finished yet, the chosen-priority
 * banner says so and offers a jump back, rather than blocking this section.
 */
export function ProposeSection() {
  const r2 = useRoute2();
  const setNote = useProgress((s) => s.setNote);
  const choose = useProgress((s) => s.choose);

  return (
    <div id={domId.part2} className="scroll-mt-24 space-y-5">
      <div className="rounded-xl border border-line bg-mist p-3">
        {r2.priority ? (
          <p className="text-caption text-ink">
            Your chosen priority: <span className="font-bold text-accent">{measureLineById(r2.priority).letter}</span> —{" "}
            {measureLineById(r2.priority).name}
          </p>
        ) : (
          <p className="text-caption text-ash">
            No priority chosen in Part 1 yet.{" "}
            <button type="button" onClick={() => scrollToAndFlash(domId.priority, "ref")} className="font-semibold text-accent underline decoration-dotted underline-offset-2">
              Go choose one
            </button>{" "}
            — or write this proposal for whichever line you're leaning toward; you can align it once you commit.
          </p>
        )}
      </div>

      {/* Why relevant now */}
      <div id={domId.relevance} className="scroll-mt-24">
        <label htmlFor="r2-p2-relevance" className="block text-caption font-semibold text-ink">
          {PART_TWO.relevance.label}
        </label>
        <p className="mt-0.5 text-micro text-ash">{PART_TWO.relevance.instruction}</p>
        <textarea
          id="r2-p2-relevance"
          rows={2}
          value={r2.relevance}
          onChange={(e) => setNote(R2.relevance, e.target.value)}
          placeholder={PART_TWO.relevance.placeholder}
          className="mt-1.5 w-full rounded-xl border border-line bg-paper px-3 py-2.5 text-caption text-ink"
        />
      </div>

      {/* First move */}
      <div id={domId.firstMove} className="scroll-mt-24">
        <label htmlFor="r2-p2-firstmove" className="block text-caption font-semibold text-ink">
          {PART_TWO.firstMove.label}
        </label>
        <p className="mt-0.5 text-micro text-ash">{PART_TWO.firstMove.instruction}</p>
        <textarea
          id="r2-p2-firstmove"
          rows={2}
          value={r2.firstMove}
          onChange={(e) => setNote(R2.firstMove, e.target.value)}
          placeholder={PART_TWO.firstMove.placeholder}
          className="mt-1.5 w-full rounded-xl border border-line bg-paper px-3 py-2.5 text-caption text-ink"
        />
      </div>

      {/* Ownership */}
      <div id={domId.ownership} className="scroll-mt-24">
        <label className="block text-caption font-semibold text-ink">{PART_TWO.ownership.label}</label>
        <p className="mt-0.5 text-micro text-ash">{PART_TWO.ownership.instruction}</p>
        <div className="mt-2">
          <OwnershipMap mode="select" value={(id) => r2.ownershipRole(id)} onCycle={(id) => choose(R2.ownership(id), nextOwnershipRole(r2.ownershipRole(id)) ?? "")} />
        </div>
      </div>

      {/* One decision to make now */}
      <div id={domId.decide} className="scroll-mt-24 space-y-3 rounded-xl border border-line bg-canvas p-4">
        <div>
          <label htmlFor="r2-p2-decide-name" className="block text-caption font-semibold text-ink">
            {PART_TWO.decideNow.label}
          </label>
          <p className="mt-0.5 text-micro text-ash">{PART_TWO.decideNow.instruction}</p>
        </div>
        <div>
          <label htmlFor="r2-p2-decide-name" className="block text-micro font-semibold text-ash">
            {PART_TWO.decideNow.nameLabel}
          </label>
          <input
            id="r2-p2-decide-name"
            type="text"
            value={r2.decideName}
            onChange={(e) => setNote(R2.decideName, e.target.value)}
            placeholder={PART_TWO.decideNow.namePlaceholder}
            className="mt-1 w-full rounded-xl border border-line bg-paper px-3 py-2.5 text-caption text-ink"
          />
        </div>
        <ReversibilityTest
          reversible={r2.decideReversible}
          moreData={r2.decideMoreData}
          onChangeReversible={(v) => choose(R2.decideReversible, v)}
          onChangeMoreData={(v) => choose(R2.decideMoreData, v)}
        />
      </div>

      <AnswerKey block={PART_TWO_ANSWER_KEY} />
    </div>
  );
}
