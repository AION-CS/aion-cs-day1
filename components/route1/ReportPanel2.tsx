"use client";

import clsx from "clsx";
import { scrollToAndFlash } from "@/lib/scrollToAndFlash";
import { ENGAGEMENT, EXPORT2, OPTION_LINES, optionById } from "@/lib/route1";
import { useRoute1, domId } from "./useRoute1";
import { useReportDate } from "./ReportPanel1";

/** Task 2's live report — the seven-criteria assessment, then the decision memo. */
export function ReportPanel2() {
  const r1 = useRoute1();
  const date = useReportDate();

  return (
    <div className="rounded-2xl border border-line bg-paper p-5">
      <p className="text-micro font-semibold uppercase tracking-wide text-accent">{EXPORT2.docHeading}</p>
      <p className="mt-1 text-caption text-ash">
        <span className="font-semibold text-ink">{r1.name.trim() || "[your name]"}</span>
        {date ? ` · ${date}` : ""} · Case: {ENGAGEMENT.company}
      </p>

      <div className="mt-4 space-y-4">
        {OPTION_LINES.map((opt) => {
          const a = r1.optionAssessment(opt.id);
          return (
            <div key={opt.id} className="rounded-lg border border-line bg-canvas p-2.5">
              <div className="flex items-center justify-between gap-2">
                <p className="text-caption font-semibold text-ink">
                  Line {opt.letter} — {opt.title}
                </p>
                <span className={clsx("shrink-0 rounded-full px-1.5 py-0.5 text-micro font-semibold", a.fullyScored ? "bg-accentSoft text-accent" : "border border-line text-ash")}>
                  {a.scoredCount}/7 rated
                </span>
              </div>
              <button
                type="button"
                onClick={() => scrollToAndFlash(domId.optionCard(opt.id), "ref")}
                className="mt-1.5 text-micro font-semibold text-accent underline decoration-dotted underline-offset-2 hover:text-accentHi"
              >
                Edit this entry
              </button>
            </div>
          );
        })}

        <div className="rounded-lg border border-line bg-canvas p-2.5">
          <Row label="Priority" value={r1.priority ? `Line ${optionById(r1.priority).letter} — ${optionById(r1.priority).title}` : "— not picked"} />
          {r1.justification && (
            <div className="mt-1 pt-0.5">
              <dt className="text-micro text-ash">Justification</dt>
              <dd className="mt-0.5 text-micro italic text-ink">&ldquo;{r1.justification}&rdquo;</dd>
            </div>
          )}
          <button
            type="button"
            onClick={() => scrollToAndFlash(domId.priority, "ref")}
            className="mt-1.5 text-micro font-semibold text-accent underline decoration-dotted underline-offset-2 hover:text-accentHi"
          >
            Edit this entry
          </button>
        </div>

        {r1.followUps.some(Boolean) && (
          <div className="border-t border-line pt-3">
            <p className="text-micro font-semibold uppercase tracking-wide text-ash">Follow-up decisions</p>
            <ul className="mt-1 list-decimal space-y-0.5 pl-4 text-micro text-ink">
              {r1.followUps.filter(Boolean).map((f, i) => (
                <li key={i}>{f}</li>
              ))}
            </ul>
          </div>
        )}

        {r1.risks.some(Boolean) && (
          <div className="border-t border-line pt-3">
            <p className="text-micro font-semibold uppercase tracking-wide text-ash">Risks named</p>
            <ul className="mt-1 list-disc space-y-0.5 pl-4 text-micro text-ink">
              {r1.risks.filter(Boolean).map((r, i) => (
                <li key={i}>{r}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex gap-2">
      <dt className="w-16 shrink-0 text-micro text-ash">{label}</dt>
      <dd className="min-w-0 flex-1 text-micro text-ink">{value}</dd>
    </div>
  );
}
