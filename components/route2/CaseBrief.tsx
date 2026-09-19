"use client";

import { useProgress, useHydrated } from "@/lib/store";
import { ENGAGEMENT, NAME_FIELD, R2 } from "@/lib/route2";
import { useRoute2, domId } from "./useRoute2";

/** The case and the learner's name, stated once. */
export function CaseBrief() {
  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-line bg-mist p-5">
        <p className="text-micro font-semibold uppercase tracking-wide text-ash">{ENGAGEMENT.heading}</p>
        <p className="mt-1.5 max-w-prose text-body text-ash">{ENGAGEMENT.brief}</p>
        <p className="mt-2 max-w-prose text-body font-semibold text-ink">{ENGAGEMENT.mandate}</p>
        <p className="mt-2 max-w-prose text-caption text-ash">{ENGAGEMENT.deliverable}</p>
        <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 border-t border-line pt-3">
          <p className="text-micro text-ash">
            Your role: <span className="font-semibold text-ink">{ENGAGEMENT.role}</span>
          </p>
          <p className="text-micro text-ash">
            Client: <span className="font-semibold text-ink">{ENGAGEMENT.company}</span>
          </p>
        </div>
      </div>

      <NameField />
    </div>
  );
}

function NameField() {
  const hydrated = useHydrated();
  const setNote = useProgress((s) => s.setNote);
  const r2 = useRoute2();

  return (
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
  );
}
