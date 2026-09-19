"use client";

import clsx from "clsx";
import { useHydrated } from "@/lib/store";
import { scrollToAndFlash } from "@/lib/scrollToAndFlash";
import { AREAS, ENGAGEMENT, EXPORT1 } from "@/lib/route1";
import { useRoute1, domId } from "./useRoute1";

export function useReportDate() {
  const hydrated = useHydrated();
  return hydrated ? new Date().toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" }) : "";
}

/** Task 1's live report — evidence grouped by area, then the two classification splits. */
export function ReportPanel1() {
  const r1 = useRoute1();
  const date = useReportDate();

  return (
    <div className="rounded-2xl border border-line bg-paper p-5">
      <p className="text-micro font-semibold uppercase tracking-wide text-accent">{EXPORT1.docHeading}</p>
      <p className="mt-1 text-caption text-ash">
        <span className="font-semibold text-ink">{r1.name.trim() || "[your name]"}</span>
        {date ? ` · ${date}` : ""} · Case: {ENGAGEMENT.company}
      </p>

      <div className="mt-4 space-y-4">
        <p className="text-micro font-semibold uppercase tracking-wide text-accent">Findings by area</p>
        {AREAS.map((area) => {
          const inArea = r1.byArea(area.id);
          const approach = r1.approachByArea[area.id];
          return (
            <div key={area.id} className="border-t border-line pt-3 first:border-t-0 first:pt-0">
              <p className="text-micro font-semibold uppercase tracking-wide text-ash">
                {area.name} — {inArea.length}
              </p>
              {inArea.length === 0 ? (
                <p className="mt-1 text-micro italic text-ash">No signals placed here yet.</p>
              ) : (
                <ul className="mt-1 space-y-0.5">
                  {inArea.map((s) => (
                    <li key={s.signal.id} className="text-micro text-ink">
                      {s.signal.n}. {s.signal.text}
                    </li>
                  ))}
                </ul>
              )}
              {approach ? (
                <p className="mt-1.5 text-micro italic text-ink">
                  <span className="not-italic font-semibold text-ash">First improvement — </span>
                  &ldquo;{approach}&rdquo;
                </p>
              ) : (
                <p className="mt-1.5 text-micro italic text-ash">No improvement approach written yet.</p>
              )}
              <button
                type="button"
                onClick={() => scrollToAndFlash(domId.approach(area.id), "ref")}
                className="mt-1 text-micro font-semibold text-accent underline decoration-dotted underline-offset-2 hover:text-accentHi"
              >
                Edit this entry
              </button>
            </div>
          );
        })}

        <div className="border-t border-line pt-3">
          <p className="text-micro font-semibold uppercase tracking-wide text-accent">Effective vs merely informative</p>
          <ul className="mt-1.5 space-y-1">
            {r1.metricStates.map((m) => (
              <li key={m.id} className="flex items-start justify-between gap-2 text-micro text-ink">
                <span className="min-w-0 flex-1">{m.text}</span>
                <span className={clsx("shrink-0 rounded-full px-1.5 py-0.5 font-semibold", m.verdict === "effective" ? "bg-accentSoft text-accent" : m.verdict === "informative" ? "bg-mist text-ash" : "border border-line text-ash")}>
                  {m.verdict === "effective" ? "Effective" : m.verdict === "informative" ? "Informative" : "—"}
                </span>
              </li>
            ))}
          </ul>
        </div>

        <div className="border-t border-line pt-3">
          <p className="text-micro font-semibold uppercase tracking-wide text-accent">Short-term vs structural</p>
          <ul className="mt-1.5 space-y-1">
            {r1.horizonStates.map((h) => (
              <li key={h.id} className="flex items-start justify-between gap-2 text-micro text-ink">
                <span className="min-w-0 flex-1">{h.text}</span>
                <span className={clsx("shrink-0 rounded-full px-1.5 py-0.5 font-semibold", h.lane === "structural" ? "bg-accentSoft text-accent" : h.lane === "shortTerm" ? "bg-mist text-ash" : "border border-line text-ash")}>
                  {h.lane === "structural" ? "Structural" : h.lane === "shortTerm" ? "Short-term" : "—"}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
