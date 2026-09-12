"use client";

import { useProgress, useHydrated } from "@/lib/store";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { CODEVISTA, R3, TASK3 } from "@/lib/route3";
import { DecisionRanking } from "./DecisionRanking";
import { QuadrantStep } from "./QuadrantStep";
import { RaciStep } from "./RaciStep";
import { DecideNowStep } from "./DecideNowStep";
import { BoardMemo } from "./BoardMemo";
import { ExportBar } from "./ExportBar";
import { useRoute3, domId } from "./useRoute3";

/**
 * Task 3 — CodeVista Board Memo. Four steps on the left, the memo building
 * itself on the right, the never-disabled export bar underneath.
 */
export function TaskFlow() {
  return (
    <section id="task" className="scroll-mt-24 space-y-8">
      <SectionHeading
        kicker={`${TASK3.tag} · about 20 minutes`}
        title={TASK3.title}
        intro={TASK3.framing}
      />

      <div className="rounded-2xl border border-line bg-mist p-5">
        <p className="text-micro font-semibold uppercase tracking-wide text-ash">
          {CODEVISTA.company} — the brief
        </p>
        <ul className="mt-2 grid gap-1.5 sm:grid-cols-2">
          {CODEVISTA.brief.map((b) => (
            <li key={b} className="flex gap-2 text-caption text-ash">
              <span className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full bg-ash" />
              <span>{b}</span>
            </li>
          ))}
        </ul>
        <p className="mt-3 text-micro text-ash">
          A different company from the one used earlier in this course, on purpose — this route tests whether
          the reasoning transfers, not whether you remember another case&apos;s specifics.
        </p>
      </div>

      <NameField />

      <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_340px]">
        <div className="min-w-0 space-y-6">
          <DecisionRanking />
          <QuadrantStep />
          <RaciStep />
          <DecideNowStep />
        </div>

        <div className="lg:sticky lg:top-20">
          <BoardMemo />
        </div>
      </div>

      <ExportBar />
    </section>
  );
}

function NameField() {
  const hydrated = useHydrated();
  const setNote = useProgress((s) => s.setNote);
  const r3 = useRoute3();

  return (
    <div id={domId.name} className="scroll-mt-24 rounded-2xl border border-line bg-paper p-5">
      <label htmlFor="r3-name-field" className="block text-caption font-semibold text-ink">
        {TASK3.nameField.label}
      </label>
      <p className="mt-0.5 text-micro text-ash">{TASK3.nameField.instruction}</p>
      <input
        id="r3-name-field"
        type="text"
        value={hydrated ? r3.name : ""}
        onChange={(e) => setNote(R3.name, e.target.value)}
        placeholder={TASK3.nameField.placeholder}
        className="mt-2 w-full max-w-sm rounded-xl border border-line bg-paper px-3 py-2.5 text-caption text-ink"
      />
    </div>
  );
}
