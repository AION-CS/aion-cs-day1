import { TASK1 } from "@/lib/route1";
import type { DecisionReportData } from "./useDecisionReportData";

/** Pure presentational report — reads like a short analyst brief, assembling as the learner completes each stage. */
export function DecisionReportDoc({ data, live = false }: { data: DecisionReportData; live?: boolean }) {
  const reveal = live ? "reveal-in" : undefined;
  const isEmpty =
    data.benefits.length === 0 &&
    data.risks.length === 0 &&
    data.byDimension.length === 0 &&
    data.statements.every((s) => !s.answer.trim()) &&
    data.techGovSplit.technical.length === 0 &&
    data.techGovSplit.governance.length === 0;

  return (
    <div className="space-y-5 text-ink">
      <div className="border-b border-line pb-3">
        <p className="text-micro uppercase tracking-wide text-ash">AION Green IT · Day 8 · Route 1</p>
        <h2 className="text-h3">{TASK1.export.docHeading}</h2>
        <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-caption text-ash">
          <span>Analyst: <span className="font-semibold text-ink">{data.name}</span></span>
          <span>Date: <span className="font-semibold text-ink">{data.date}</span></span>
          <span>Subject: <span className="font-semibold text-ink">{data.caseReference}</span></span>
        </div>
      </div>

      {isEmpty && <p className="text-caption text-ash">This report fills in as you work through Stages 2–5 below.</p>}

      {(data.benefits.length > 0 || data.risks.length > 0) && (
        <section className={reveal}>
          <h3 className="text-caption font-semibold uppercase tracking-wide text-ash">Benefit / Risk Classification</h3>
          <div className="mt-1.5 grid gap-3 sm:grid-cols-2">
            <div>
              <p className="text-micro font-semibold text-ink">Benefit ({data.benefits.length})</p>
              <ul className="mt-0.5 list-disc space-y-0.5 pl-5 text-micro text-ash">
                {data.benefits.map((t, i) => <li key={i}>{t}</li>)}
              </ul>
            </div>
            <div>
              <p className="text-micro font-semibold text-ink">Risk / Challenge ({data.risks.length})</p>
              <ul className="mt-0.5 list-disc space-y-0.5 pl-5 text-micro text-ash">
                {data.risks.map((t, i) => <li key={i}>{t}</li>)}
              </ul>
            </div>
          </div>
        </section>
      )}

      {data.byDimension.length > 0 && (
        <section className={reveal}>
          <h3 className="text-caption font-semibold uppercase tracking-wide text-ash">6-Dimension Mapping</h3>
          <div className="mt-1.5 space-y-2">
            {data.byDimension.map((g) => (
              <div key={g.dimension}>
                <p className="text-caption font-semibold text-ink">{g.dimension} ({g.items.length})</p>
                <ul className="mt-0.5 list-disc space-y-0.5 pl-5 text-micro text-ash">
                  {g.items.map((t, i) => <li key={i}>{t}</li>)}
                </ul>
              </div>
            ))}
          </div>
        </section>
      )}

      {data.statements.some((s) => s.answer.trim()) && (
        <section className={reveal}>
          <h3 className="text-caption font-semibold uppercase tracking-wide text-ash">Sustainability Statements</h3>
          <ul className="mt-1.5 space-y-1.5 text-micro">
            {data.statements
              .filter((s) => s.answer.trim())
              .map((s, i) => (
                <li key={i}>
                  <span className="text-ash">"{s.starter} </span>
                  <span className="text-ink">{s.answer}"</span>
                </li>
              ))}
          </ul>
        </section>
      )}

      {(data.techGovSplit.technical.length > 0 || data.techGovSplit.governance.length > 0) && (
        <section className={reveal}>
          <h3 className="text-caption font-semibold uppercase tracking-wide text-ash">Technical vs. Governance Findings</h3>
          <div className="mt-1.5 grid gap-3 sm:grid-cols-2">
            <div>
              <p className="text-micro font-semibold text-ink">Technical ({data.techGovSplit.technical.length})</p>
              <ul className="mt-0.5 list-disc space-y-0.5 pl-5 text-micro text-ash">
                {data.techGovSplit.technical.map((t, i) => <li key={i}>{t}</li>)}
              </ul>
            </div>
            <div>
              <p className="text-micro font-semibold text-ink">Governance ({data.techGovSplit.governance.length})</p>
              <ul className="mt-0.5 list-disc space-y-0.5 pl-5 text-micro text-ash">
                {data.techGovSplit.governance.map((t, i) => <li key={i}>{t}</li>)}
              </ul>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
