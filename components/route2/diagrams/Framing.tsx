"use client";

import { useProgress, useHydrated } from "@/lib/store";
import { OPENER, R2, REFLECTION, RUBRIC } from "@/lib/route2";
import { IndustryCallout } from "@/components/ui/IndustryCallout";

/** §7.0 opener, rendered before the six MaterialBlocks. */
export function OpenerPanel() {
  return (
    <div className="space-y-4">
      <div className="max-w-prose space-y-3">
        {OPENER.paragraphs.map((p, i) => (
          <p key={i} className="text-body text-ash">
            {p}
          </p>
        ))}
      </div>
      <IndustryCallout label={OPENER.selfContained.label} text={OPENER.selfContained.text} />
    </div>
  );
}

/** §7.7 — rendered after section F, before the reflection journal. */
export function RubricPreview() {
  return (
    <section id="r2-rubric" className="scroll-mt-24 space-y-4 rounded-2xl border border-line bg-mist p-5">
      <div>
        <p className="text-micro font-semibold uppercase tracking-wide text-accent">{RUBRIC.kicker}</p>
        <h3 className="mt-1 text-h3 text-ink">{RUBRIC.title}</h3>
        <p className="mt-1 text-caption text-ash">{RUBRIC.intro}</p>
      </div>
      <ol className="space-y-1.5">
        {RUBRIC.items.map((item, i) => (
          <li key={i} className="flex gap-2 rounded-xl border border-line bg-paper p-3 text-caption text-ink">
            <span className="font-semibold text-accent">{i + 1}.</span>
            <span>{item}</span>
          </li>
        ))}
      </ol>
      <details className="rounded-xl border border-line bg-paper px-3 py-2">
        <summary className="cursor-pointer text-caption font-semibold text-accent">{RUBRIC.provocationsLabel}</summary>
        <ul className="mt-2 space-y-1.5">
          {RUBRIC.provocations.map((q, i) => (
            <li key={i} className="text-caption italic text-ink">
              &ldquo;{q}&rdquo;
            </li>
          ))}
        </ul>
      </details>
    </section>
  );
}

/** §7.8 — four seeded textareas, never validated, opt-in export appendix. */
export function ReflectionJournal() {
  const hydrated = useHydrated();
  const notes = useProgress((s) => s.notes);
  const setNote = useProgress((s) => s.setNote);
  const checks = useProgress((s) => s.checks);
  const toggleCheck = useProgress((s) => s.toggleCheck);

  return (
    <section id="r2-reflection" className="scroll-mt-24 space-y-4 rounded-2xl border border-line bg-paper p-5">
      <div>
        <p className="text-micro font-semibold uppercase tracking-wide text-accent">{REFLECTION.kicker}</p>
        <h3 className="mt-1 text-h3 text-ink">{REFLECTION.title}</h3>
        <p className="mt-1 text-caption text-ash">{REFLECTION.intro}</p>
      </div>
      <div className="space-y-4">
        {REFLECTION.questions.map((q, i) => (
          <div key={q.id}>
            <label htmlFor={`reflect-${q.id}`} className="block text-caption font-semibold text-ink">
              <span className="text-ash">{i + 1} · </span>
              {q.label}
            </label>
            <p className="mt-0.5 text-micro text-ash">{REFLECTION.helper}</p>
            <textarea
              id={`reflect-${q.id}`}
              rows={2}
              value={hydrated ? (notes[R2.reflection(q.id)] ?? "") : ""}
              onChange={(e) => setNote(R2.reflection(q.id), e.target.value)}
              className="mt-2 w-full rounded-xl border border-line bg-canvas px-3 py-2.5 text-caption text-ink"
            />
          </div>
        ))}
      </div>
      <label className="flex items-center gap-2 text-caption text-ink">
        <input
          type="checkbox"
          checked={hydrated ? !!checks[R2.reflectionInclude] : false}
          onChange={(e) => toggleCheck(R2.reflectionInclude, e.target.checked)}
          className="h-4 w-4 rounded border-line"
        />
        {REFLECTION.includeLabel}
      </label>
    </section>
  );
}
