"use client";

import { useProgress, useHydrated } from "@/lib/store";
import { MaterialRefs } from "@/components/ui/MaterialRefs";
import { NAME_FIELD, R2, SYNERVIA, materialRefs } from "@/lib/route2";
import { useRoute2, domId } from "./useRoute2";

/**
 * Synervia — the case the learner actually works, stated once, directly
 * above the task. It deliberately sits after the EcoFlow worked example
 * rather than above the material, so the two companies are never on screen
 * as one blurred brief. Its MaterialRefs chip grounds section A, since no
 * exercise below references it directly (§B–D each carry their own).
 */
export function CaseBrief() {
  const hydrated = useHydrated();
  const setNote = useProgress((s) => s.setNote);
  const r2 = useRoute2();

  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-line bg-mist p-5">
        <p className="text-micro font-semibold uppercase tracking-wide text-ash">{SYNERVIA.heading}</p>
        <p className="mt-1 text-caption text-ash">
          You take the role of <span className="font-semibold text-ink">{SYNERVIA.role}</span> for{" "}
          <span className="font-semibold text-ink">{SYNERVIA.company}</span>.
        </p>
        <p className="mt-2 max-w-prose text-body text-ash">{SYNERVIA.brief}</p>

        <p className="mt-3 text-micro font-semibold uppercase tracking-wide text-ash">General conditions</p>
        <ul className="mt-1.5 grid gap-1.5 md:grid-cols-2">
          {SYNERVIA.conditions.map((c) => (
            <li key={c} className="flex gap-2 text-caption text-ink">
              <span className="mt-[7px] h-1 w-1 shrink-0 rounded-full bg-ash" />
              <span>{c}</span>
            </li>
          ))}
        </ul>

        <p className="mt-3 text-body font-semibold text-ink">{SYNERVIA.mandate}</p>
        <MaterialRefs refs={materialRefs(["board", "worked"])} lead="Grounded in" />
      </div>

      <div id={domId.name} className="scroll-mt-24 rounded-2xl border border-line bg-paper p-5">
        <label htmlFor="r2-name-field" className="block text-caption font-semibold text-ink">
          {NAME_FIELD.label}
        </label>
        <p className="mt-0.5 text-micro text-ash">{NAME_FIELD.instruction}</p>
        <input
          id="r2-name-field"
          type="text"
          value={hydrated ? r2.name : ""}
          onChange={(e) => setNote(R2.name, e.target.value)}
          placeholder={NAME_FIELD.placeholder}
          className="mt-2 w-full max-w-sm rounded-xl border border-line bg-paper px-3 py-2.5 text-caption text-ink"
        />
      </div>
    </div>
  );
}
