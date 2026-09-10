import { TASK3 } from "@/lib/route3";
import type { ManagementReportData } from "./useManagementReportData";

/** Pure presentational proposal — formatted as a real executive document, not a dump of raw answers. */
export function ManagementProposalDoc({ data, live = false }: { data: ManagementReportData; live?: boolean }) {
  const reveal = live ? "reveal-in" : undefined;
  const isEmpty = !data.strategicRelevance && !data.firstMeasure && data.chosenLevers.length === 0 && data.roadmap.length === 0;

  return (
    <div className="space-y-5 text-ink">
      <div className="border-b border-line pb-3">
        <p className="text-micro uppercase tracking-wide text-ash">AION Green IT · Day 8 · Route 3</p>
        <h2 className="text-h3">{TASK3.export.docHeading}</h2>
        <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-caption text-ash">
          <span>Advisor: <span className="font-semibold text-ink">{data.name}</span></span>
          <span>Date: <span className="font-semibold text-ink">{data.date}</span></span>
          <span>Subject: <span className="font-semibold text-ink">{data.caseReference}</span></span>
        </div>
      </div>

      {isEmpty && <p className="text-caption text-ash">This proposal fills in as you work through Stages 2–6 above.</p>}

      {data.strategicRelevance && (
        <section className={reveal}>
          <h3 className="text-caption font-semibold uppercase tracking-wide text-ash">1. Strategic Relevance</h3>
          <p className="mt-1 text-micro text-ash">Sustainable cloud use matters strategically for Helix because {data.strategicRelevance}</p>
        </section>
      )}

      {data.guidingDecisions.length > 0 && (
        <section className={reveal}>
          <h3 className="text-caption font-semibold uppercase tracking-wide text-ash">2. Guiding Decisions (Next 12 Months)</h3>
          <ol className="mt-1 list-decimal space-y-0.5 pl-5 text-micro text-ash">
            {data.guidingDecisions.map((d, i) => <li key={i}>{d}</li>)}
          </ol>
        </section>
      )}

      {data.prioritizationLogic && (
        <section className={reveal}>
          <h3 className="text-caption font-semibold uppercase tracking-wide text-ash">3. Decision Logic</h3>
          <p className="mt-1 text-micro text-ash">Future cloud measures should be assessed and prioritized by {data.prioritizationLogic}</p>
        </section>
      )}

      {data.tradeoffs.length > 0 && (
        <section className={reveal}>
          <h3 className="text-caption font-semibold uppercase tracking-wide text-ash">4. Central Trade-off</h3>
          <ul className="mt-1 list-disc space-y-0.5 pl-5 text-micro text-ash">
            {data.tradeoffs.map((t, i) => <li key={i}>{t}</li>)}
          </ul>
        </section>
      )}

      {(data.firstMeasure || data.chosenLevers.length > 0) && (
        <section className={reveal}>
          <h3 className="text-caption font-semibold uppercase tracking-wide text-ash">5. First Prioritized Measures</h3>
          {data.firstMeasure && (
            <p className="mt-1 text-micro">
              <span className="font-semibold text-ink">{data.firstMeasure}.</span> <span className="text-ash">{data.firstMeasureJustify}</span>
            </p>
          )}
          {data.roadmap.length > 0 && (
            <div className="mt-2 grid gap-2 sm:grid-cols-3">
              {data.roadmap.map((g) => (
                <div key={g.horizon}>
                  <p className="text-micro font-semibold text-ink">{g.horizon}</p>
                  <ul className="mt-0.5 list-disc space-y-0.5 pl-4 text-micro text-ash">
                    {g.levers.map((l, i) => <li key={i}>{l}</li>)}
                  </ul>
                </div>
              ))}
            </div>
          )}
        </section>
      )}

      {data.roles.some((r) => r.mandate) && (
        <section className={reveal}>
          <h3 className="text-caption font-semibold uppercase tracking-wide text-ash">6. Roles, Approval &amp; Review</h3>
          <ul className="mt-1 space-y-1 text-micro text-ash">
            {data.roles.map((r) => (
              <li key={r.label}><span className="font-semibold text-ink">{r.label}:</span> {r.mandate || "—"}</li>
            ))}
          </ul>
        </section>
      )}

      {(data.decideNow || data.waitingMeans) && (
        <section className={reveal}>
          <h3 className="text-caption font-semibold uppercase tracking-wide text-ash">7. The Decision Now, Despite Incomplete Data</h3>
          <p className="mt-1 text-micro text-ash">Even without complete data, Helix must decide now to {data.decideNow}, because waiting would mean {data.waitingMeans}.</p>
        </section>
      )}

      {data.architectureByNode.length > 0 && (
        <section className={reveal}>
          <h3 className="text-caption font-semibold uppercase tracking-wide text-ash">Appendix — SkyBridge Diagnostic (Decision Architecture)</h3>
          <div className="mt-1 space-y-1.5">
            {data.architectureByNode.map((g) => (
              <div key={g.node}>
                <p className="text-micro font-semibold text-ink">{g.node}</p>
                <ul className="mt-0.5 list-disc space-y-0.5 pl-5 text-micro text-ash">
                  {g.items.map((t, i) => <li key={i}>{t}</li>)}
                </ul>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
