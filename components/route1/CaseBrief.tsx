"use client";

import { useProgress, useHydrated } from "@/lib/store";
import { MaterialRefs } from "@/components/ui/MaterialRefs";
import { BRIEF_REFS, ENGAGEMENT, NAME_FIELD, R1, materialRefs } from "@/lib/route1";
import { useRoute1, domId } from "./useRoute1";

/**
 * The case and the learner's name, stated once for the whole route.
 *
 * The task runs on this one engagement, so it is never re-introduced
 * mid-page (CLAUDE.md #12). The name is collected here and is what the
 * export filename is built from.
 */
export function CaseBrief() {
  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-line bg-mist p-5">
        <p className="text-micro font-semibold uppercase tracking-wide text-ash">
          {ENGAGEMENT.heading}
        </p>
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
        <MaterialRefs refs={materialRefs(BRIEF_REFS)} lead="Grounded in" />
      </div>

      <NameField />
    </div>
  );
}

/** Learner name — prompted once, persisted, and what the export filename is built from. */
function NameField() {
  const hydrated = useHydrated();
  const setNote = useProgress((s) => s.setNote);
  const r1 = useRoute1();

  return (
    <div id={domId.name} className="scroll-mt-24 rounded-2xl border border-line bg-paper p-5">
      <label htmlFor="r1-name-field" className="block text-caption font-semibold text-ink">
        {NAME_FIELD.label}
      </label>
      <p className="mt-0.5 text-micro text-ash">{NAME_FIELD.instruction}</p>
      <input
        id="r1-name-field"
        type="text"
        value={hydrated ? r1.name : ""}
        onChange={(e) => setNote(R1.name, e.target.value)}
        placeholder={NAME_FIELD.placeholder}
        className="mt-2 w-full max-w-sm rounded-xl border border-line bg-paper px-3 py-2.5 text-caption text-ink"
      />
    </div>
  );
}
