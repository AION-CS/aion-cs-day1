import { TASK2, OPTIONS } from "@/lib/route2";
import type { DecisionMemoData } from "./useDecisionMemoData";

/** Pure presentational memo — reads like a short board memo, assembling as the learner scores and decides. */
export function DecisionMemoDoc({ data, live = false }: { data: DecisionMemoData; live?: boolean }) {
  const reveal = live ? "reveal-in" : undefined;
  const anyScored = data.scoreTable.some((row) => OPTIONS.some((o) => row.scores[o.id] > 0));
  const isEmpty = !anyScored && !data.recommendation && !data.justification && data.followUps.length === 0 && data.risks.length === 0;

  return (
    <div className="space-y-5 text-ink">
      <div className="border-b border-line pb-3">
        <p className="text-micro uppercase tracking-wide text-ash">AION Green IT · Day 7 · Route 2</p>
        <h2 className="text-h3">{TASK2.export.docHeading}</h2>
        <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-caption text-ash">
          <span>Author: <span className="font-semibold text-ink">{data.name}</span></span>
          <span>Date: <span className="font-semibold text-ink">{data.date}</span></span>
          <span>Subject: <span className="font-semibold text-ink">{data.caseReference}</span></span>
        </div>
      </div>

      {isEmpty && <p className="text-caption text-ash">This memo fills in as you score the criteria and build a decision below.</p>}

      {anyScored && (
        <section className={reveal}>
          <h3 className="text-caption font-semibold uppercase tracking-wide text-ash">Radar Summary</h3>
          <div className="mt-1.5 overflow-x-auto">
            <table className="w-full text-micro text-ash">
              <thead>
                <tr className="text-left">
                  <th className="pb-1 pr-2 font-semibold text-ink">Criterion</th>
                  {OPTIONS.map((o) => (
                    <th key={o.id} className="pb-1 pr-2 text-center font-semibold text-ink">{o.id}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {data.scoreTable.map((row) => (
                  <tr key={row.criterion} className="border-t border-line">
                    <td className="py-1 pr-2">{row.criterion}</td>
                    {OPTIONS.map((o) => (
                      <td key={o.id} className="py-1 pr-2 text-center tabular-nums">{row.scores[o.id] || "—"}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {(data.recommendation || data.justification) && (
        <section className={reveal}>
          <h3 className="text-caption font-semibold uppercase tracking-wide text-ash">Recommendation &amp; Justification</h3>
          {data.recommendation && <p className="mt-1.5 text-caption font-semibold text-ink">{data.recommendation}</p>}
          {data.justification && <p className="mt-1 text-micro text-ash">{data.justification}</p>}
        </section>
      )}

      {data.followUps.length > 0 && (
        <section className={reveal}>
          <h3 className="text-caption font-semibold uppercase tracking-wide text-ash">Follow-up Decisions</h3>
          <ul className="mt-1.5 list-disc space-y-0.5 pl-5 text-micro text-ash">
            {data.followUps.map((f, i) => (
              <li key={i}>{f}</li>
            ))}
          </ul>
        </section>
      )}

      {data.risks.length > 0 && (
        <section className={reveal}>
          <h3 className="text-caption font-semibold uppercase tracking-wide text-ash">Risk Register</h3>
          <ul className="mt-1.5 list-disc space-y-0.5 pl-5 text-micro text-ash">
            {data.risks.map((r, i) => (
              <li key={i}>{r}</li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
