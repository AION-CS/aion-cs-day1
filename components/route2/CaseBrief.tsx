"use client";

import { useProgress, useHydrated } from "@/lib/store";
import { MaterialRefs } from "@/components/ui/MaterialRefs";
import { BRIEF_REFS, NAME_FIELD, R2, VERTEX, VERTEX_GENERAL_CONDITIONS, VERTEX_SPECIFIC, VERTEX_SPECIFIC_HEADING, materialRefs } from "@/lib/route2";
import { useRoute2, domId } from "./useRoute2";

/**
 * Vertex — the case the learner actually works, stated once, directly above
 * the task (CLAUDE.md #12). NetSphere is read-only material above; Vertex is
 * briefed here, once, with its own name field. The five Vertex-specific
 * conditions render visually distinct from the six general ones, because they
 * are what makes copying NetSphere's answer insufficient (§6).
 */
export function CaseBrief() {
  const hydrated = useHydrated();
  const setNote = useProgress((s) => s.setNote);
  const r2 = useRoute2();

  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-line bg-mist p-5">
        <p className="text-micro font-semibold uppercase tracking-wide text-ash">{VERTEX.heading}</p>
        {VERTEX.paragraphs.map((p, i) => (
          <p key={i} className="mt-1.5 max-w-prose text-body text-ash">
            {p}
          </p>
        ))}
        <p className="mt-3 max-w-prose rounded-xl border-l-4 border-l-accent bg-accentSoft px-4 py-2.5 text-caption font-semibold text-ink">
          {VERTEX.warning}
        </p>

        <p className="mt-4 text-micro font-semibold uppercase tracking-wide text-ash">General conditions</p>
        <ul className="mt-1.5 grid gap-1.5 md:grid-cols-2">
          {VERTEX_GENERAL_CONDITIONS.map((c) => (
            <li key={c} className="flex gap-2 text-caption text-ink">
              <span className="mt-[7px] h-1 w-1 shrink-0 rounded-full bg-ash" />
              <span>{c}</span>
            </li>
          ))}
        </ul>

        <p className="mt-4 text-micro font-semibold uppercase tracking-wide text-warn">{VERTEX_SPECIFIC_HEADING}</p>
        <ul className="mt-1.5 space-y-1.5">
          {VERTEX_SPECIFIC.map((c) => (
            <li key={c.id} className="flex gap-2 rounded-lg border border-warn/30 bg-warn/5 px-3 py-2 text-caption font-semibold text-ink">
              <span className="mt-[3px] h-1.5 w-1.5 shrink-0 rounded-full bg-warn" />
              <span>{c.text}</span>
            </li>
          ))}
        </ul>

        <MaterialRefs refs={materialRefs(BRIEF_REFS)} lead="Grounded in" />
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

/** A compact rail version of the same conditions, for the sticky sidebar beside the task (§8.1). */
export function VertexConditionsRail() {
  return (
    <div className="space-y-3 rounded-2xl border border-line bg-paper p-4">
      <p className="text-micro font-semibold uppercase tracking-wide text-ash">Vertex conditions</p>
      <ul className="space-y-1">
        {VERTEX_GENERAL_CONDITIONS.map((c) => (
          <li key={c} className="flex gap-2 text-micro text-ink">
            <span className="mt-[6px] h-1 w-1 shrink-0 rounded-full bg-ash" />
            <span>{c}</span>
          </li>
        ))}
      </ul>
      <p className="text-micro font-semibold uppercase tracking-wide text-warn">{VERTEX_SPECIFIC_HEADING}</p>
      <ul className="space-y-1.5">
        {VERTEX_SPECIFIC.map((c) => (
          <li key={c.id} className="rounded-lg border border-warn/30 bg-warn/5 px-2.5 py-1.5 text-micro font-semibold text-ink">
            {c.text}
          </li>
        ))}
      </ul>
    </div>
  );
}
