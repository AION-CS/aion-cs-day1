"use client";

import { useProgress, useHydrated } from "@/lib/store";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { MaterialRefs } from "@/components/ui/MaterialRefs";
import { R2, TASK2, materialRefs } from "@/lib/route2";
import { OptionCard } from "./OptionCard";
import { CommitStep } from "./CommitStep";
import { PrioritizationMemo } from "./PrioritizationMemo";
import { ExportBar } from "./ExportBar";
import { useRoute2, domId } from "./useRoute2";

/**
 * Task 2 — AppNexa Prioritization Room. Options on the left, the memo building
 * itself on the right, the never-disabled export bar underneath. Options can be
 * worked in any order and revisited freely; nothing between them is locked.
 */
export function TaskFlow() {
  const r2 = useRoute2();

  return (
    <section id="task" className="scroll-mt-24 space-y-8">
      <SectionHeading
        kicker={`${TASK2.tag} · about 20 minutes`}
        title={TASK2.title}
        intro={TASK2.framing}
      />

      <div className="rounded-2xl border border-line bg-mist p-5">
        <p className="text-micro font-semibold uppercase tracking-wide text-ash">The case</p>
        <p className="mt-1 max-w-prose text-caption text-ash">{TASK2.companyBrief}</p>
        <MaterialRefs refs={materialRefs(["constraint", "recap"])} lead="Grounded in" />
      </div>

      <NameField />

      <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_340px]">
        <div className="min-w-0 space-y-6">
          <ul className="space-y-6">
            {r2.optionStates.map((s) => (
              <OptionCard key={s.option.id} state={s} />
            ))}
          </ul>
          <CommitStep />
        </div>

        <div className="lg:sticky lg:top-20">
          <PrioritizationMemo />
        </div>
      </div>

      <ExportBar />
    </section>
  );
}

function NameField() {
  const hydrated = useHydrated();
  const setNote = useProgress((s) => s.setNote);
  const r2 = useRoute2();

  return (
    <div id={domId.name} className="scroll-mt-24 rounded-2xl border border-line bg-paper p-5">
      <label htmlFor="r2-name-field" className="block text-caption font-semibold text-ink">
        {TASK2.nameField.label}
      </label>
      <p className="mt-0.5 text-micro text-ash">{TASK2.nameField.instruction}</p>
      <input
        id="r2-name-field"
        type="text"
        value={hydrated ? r2.name : ""}
        onChange={(e) => setNote(R2.name, e.target.value)}
        placeholder={TASK2.nameField.placeholder}
        className="mt-2 w-full max-w-sm rounded-xl border border-line bg-paper px-3 py-2.5 text-caption text-ink"
      />
    </div>
  );
}
