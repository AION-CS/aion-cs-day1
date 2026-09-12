"use client";

import { useProgress, useHydrated } from "@/lib/store";
import { ENGAGEMENT, EXPORT, R1, STAGE1 } from "@/lib/route1";
import { AnswerKeyNote } from "@/components/ui/AnswerKey";
import { categoryName } from "./CategoryGrid";
import { useRoute1, domId } from "./useRoute1";

/** The date line on the report. Rendered client-side only, to keep the static export stable. */
export function useReportDate() {
  const hydrated = useHydrated();
  return hydrated ? new Date().toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" }) : "";
}

/**
 * Part 1 of the Engagement Report, building itself alongside stage 1: header
 * → classification table → reflection → closing summary. Rows appear the
 * moment a card is sorted and fill in as the workup completes, so the panel is
 * a running account of the learner's own reasoning.
 *
 * Part 2 (components/route1/DecisionPanel.tsx) is the same document continued
 * next to stage 2 — one report, two parts, one export.
 */
export function DiagnosisPanel() {
  const r1 = useRoute1();
  const setNote = useProgress((s) => s.setNote);
  const date = useReportDate();

  const summaryLine =
    r1.completeCount === 0
      ? "No findings completed yet."
      : `${r1.structuralCount} of ${r1.completeCount} completed findings require a structural standard, not a one-off patch.`;

  return (
    <aside className="space-y-4">
      <div className="rounded-2xl border border-line bg-paper p-5">
        {/* Header */}
        <p className="text-micro font-semibold uppercase tracking-wide text-accent">
          {EXPORT.docHeading}
        </p>
        <p className="text-caption font-semibold text-ink">{EXPORT.partOne}</p>
        <p className="mt-1 text-caption text-ash">
          <span className="font-semibold text-ink">{r1.name.trim() || "[your name]"}</span>
          {date ? ` · ${date}` : ""} · Case: {ENGAGEMENT.company}
        </p>

        {/* Classification table */}
        <div className="mt-4">
          <p className="text-micro font-semibold uppercase tracking-wide text-ash">
            Six-category classification
          </p>
          {r1.reportRows.length === 0 ? (
            <p className="mt-2 rounded-xl border border-dashed border-line bg-canvas p-3 text-caption text-ash">
              Sort your first finding on the left and it appears here.
            </p>
          ) : (
            <ul className="mt-2 space-y-2">
              {r1.reportRows.map((f) => (
                <li key={f.hotspot.id} className="rounded-xl border border-line bg-canvas p-3">
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-caption font-semibold text-ink">
                      {f.hotspot.n}. {f.hotspot.title}
                    </p>
                    <span
                      className={
                        f.complete
                          ? "shrink-0 rounded-full bg-accentSoft px-2 py-0.5 text-micro font-semibold text-accent"
                          : "shrink-0 rounded-full border border-line px-2 py-0.5 text-micro text-ash"
                      }
                    >
                      {f.complete ? "complete" : "in progress"}
                    </span>
                  </div>
                  <dl className="mt-1.5 space-y-1 text-micro">
                    <Row label="Category" value={categoryName(f.category)} />
                    <Row label="Lever" value={f.leverText ?? "— not chosen"} />
                    <Row
                      label="Fix type"
                      value={
                        f.fixType === "structural"
                          ? "Structural Fix"
                          : f.fixType === "quick"
                            ? "Quick Fix"
                            : "— not marked"
                      }
                    />
                    {f.justification && (
                      <div className="pt-0.5">
                        <dt className="text-ash">Justification</dt>
                        <dd className="mt-0.5 italic text-ink">&ldquo;{f.justification}&rdquo;</dd>
                      </div>
                    )}
                  </dl>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Reflection */}
        <div id={domId.reflection} className="mt-5 scroll-mt-24 border-t border-line pt-4">
          <p className="text-micro font-semibold uppercase tracking-wide text-ash">
            {STAGE1.reflection.heading}
          </p>
          <label htmlFor="r1-reflection-field" className="mt-1.5 block text-caption font-semibold text-ink">
            {STAGE1.reflection.label}
          </label>
          <p className="mt-0.5 text-micro text-ash">{STAGE1.reflection.instruction}</p>
          <textarea
            id="r1-reflection-field"
            rows={4}
            value={r1.reflection}
            onChange={(e) => setNote(R1.reflection, e.target.value)}
            placeholder={STAGE1.reflection.placeholder}
            className="mt-2 w-full rounded-xl border border-line bg-paper px-3 py-2.5 text-caption text-ink"
          />
          <AnswerKeyNote label="Root-cause reflection" text={STAGE1.reflection.sample} />
        </div>

        {/* Closing summary */}
        <div className="mt-5 border-t border-line pt-4">
          <p className="text-micro font-semibold uppercase tracking-wide text-ash">
            Structural vs. quick-fix summary
          </p>
          <p className="mt-1.5 text-caption font-semibold text-ink">{summaryLine}</p>
          {r1.completeCount > 0 && (
            <p className="mt-1 text-micro text-ash">
              {r1.quickCount} quick · {r1.structuralCount} structural · {r1.totalHotspots - r1.completeCount} still
              open
            </p>
          )}
        </div>
      </div>
    </aside>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex gap-2">
      <dt className="w-16 shrink-0 text-ash">{label}</dt>
      <dd className="min-w-0 flex-1 text-ink">{value}</dd>
    </div>
  );
}
