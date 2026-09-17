"use client";

import clsx from "clsx";
import { useHydrated } from "@/lib/store";
import { scrollToAndFlash } from "@/lib/scrollToAndFlash";
import { AREAS, ENGAGEMENT, EXPORT, rootCauseLabel, timeframeLabel } from "@/lib/route1";
import { useRoute1, domId } from "./useRoute1";

/** The date line. Client-only, so the static export stays stable. */
export function useReportDate() {
  const hydrated = useHydrated();
  return hydrated
    ? new Date().toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })
    : "";
}

/**
 * The Mercury Office Systems Diagnosis Report, live: every evidence chip
 * grouped by the area it was placed in, so the report reads as a structured
 * diagnosis rather than a raw log of drags. Every row's Edit button scrolls
 * to and flashes that chip (CLAUDE.md #5) — the report views the learner's
 * answers, never a second copy of them.
 */
export function ReportPanel() {
  const r1 = useRoute1();
  const date = useReportDate();

  return (
    <div className="rounded-2xl border border-line bg-paper p-5">
      <p className="text-micro font-semibold uppercase tracking-wide text-accent">{EXPORT.docHeading}</p>
      <p className="mt-1 text-caption text-ash">
        <span className="font-semibold text-ink">{r1.name.trim() || "[your name]"}</span>
        {date ? ` · ${date}` : ""} · Case: {ENGAGEMENT.company}
      </p>

      <div className="mt-4 space-y-4">
        {AREAS.map((area) => {
          const chips = r1.byArea(area.id);
          return (
            <div key={area.id} className="border-t border-line pt-3 first:border-t-0 first:pt-0">
              <p className="text-micro font-semibold uppercase tracking-wide text-ash">
                {area.name} — {chips.length}
              </p>
              {chips.length === 0 ? (
                <p className="mt-1 text-micro italic text-ash">Nothing classified here yet.</p>
              ) : (
                <ul className="mt-1.5 space-y-2">
                  {chips.map((c) => (
                    <li key={c.evidence.id} className="rounded-lg border border-line bg-canvas p-2.5">
                      <div className="flex items-start justify-between gap-2">
                        <p className="text-caption font-semibold text-ink">
                          {c.evidence.n}. {c.evidence.short}
                        </p>
                        <span
                          className={clsx(
                            "shrink-0 rounded-full px-1.5 py-0.5 text-micro font-semibold",
                            c.complete ? "bg-accentSoft text-accent" : "border border-line text-ash",
                          )}
                        >
                          {c.complete ? "filed" : "in progress"}
                        </span>
                      </div>
                      <dl className="mt-1 space-y-0.5 text-micro">
                        <Row label="Root cause" value={rootCauseLabel(c.rootCause)} />
                        <Row label="Timeframe" value={timeframeLabel(c.timeframe)} />
                        {c.approach && (
                          <div className="pt-0.5">
                            <dt className="text-ash">Improvement</dt>
                            <dd className="mt-0.5 italic text-ink">&ldquo;{c.approach}&rdquo;</dd>
                          </div>
                        )}
                      </dl>
                      <button
                        type="button"
                        onClick={() => scrollToAndFlash(domId.chip(c.evidence.id), "ref")}
                        className="mt-1.5 text-micro font-semibold text-accent underline decoration-dotted underline-offset-2 hover:text-accentHi"
                      >
                        Edit this entry
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex gap-2">
      <dt className="w-20 shrink-0 text-ash">{label}</dt>
      <dd className="min-w-0 flex-1 text-ink">{value}</dd>
    </div>
  );
}
