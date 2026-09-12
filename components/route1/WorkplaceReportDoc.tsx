import { TASK1 } from "@/lib/route1";
import type { WorkplaceReportData } from "./useWorkplaceReportData";

/** Pure presentational report — reads like a short diagnostic brief, assembling as the learner works. */
export function WorkplaceReportDoc({ data, live = false }: { data: WorkplaceReportData; live?: boolean }) {
  const reveal = live ? "reveal-in" : undefined;
  const isEmpty =
    data.findings.length === 0 &&
    data.byCategory.length === 0 &&
    data.actions.length === 0;

  const diagnosed = data.driverSplit.structural.length + data.driverSplit.individual.length;

  return (
    <div className="space-y-5 text-ink">
      <div className="border-b border-line pb-3">
        <p className="text-micro uppercase tracking-wide text-ash">AION Green IT · Day 9 · Route 1</p>
        <h2 className="text-h3">{TASK1.export.docHeading}</h2>
        <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-caption text-ash">
          <span>
            Analyst: <span className="font-semibold text-ink">{data.name}</span>
          </span>
          <span>
            Date: <span className="font-semibold text-ink">{data.date}</span>
          </span>
          <span>
            Subject: <span className="font-semibold text-ink">{data.caseReference}</span>
          </span>
        </div>
      </div>

      {isEmpty && (
        <p className="text-caption text-ash">This brief fills in as you work through the three stages below.</p>
      )}

      {data.byCategory.length > 0 && (
        <section className={reveal}>
          <h3 className="text-caption font-semibold uppercase tracking-wide text-ash">Findings by area</h3>
          <div className="mt-1.5 space-y-2">
            {data.byCategory.map((g) => (
              <div key={g.category}>
                <p className="text-micro font-semibold text-ink">
                  {g.category} ({g.items.length})
                </p>
                <ul className="mt-0.5 list-disc space-y-0.5 pl-5 text-micro text-ash">
                  {g.items.map((t, i) => (
                    <li key={i}>{t}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>
      )}

      {diagnosed > 0 && (
        <section className={reveal}>
          <h3 className="text-caption font-semibold uppercase tracking-wide text-ash">Diagnosis</h3>
          <div className="mt-1.5 grid gap-3 sm:grid-cols-2">
            <div>
              <p className="text-micro font-semibold text-ink">
                Management &amp; structural ({data.driverSplit.structural.length})
              </p>
              <ul className="mt-0.5 list-disc space-y-0.5 pl-5 text-micro text-ash">
                {data.driverSplit.structural.map((t, i) => (
                  <li key={i}>{t}</li>
                ))}
              </ul>
            </div>
            <div>
              <p className="text-micro font-semibold text-ink">
                Individual behaviour ({data.driverSplit.individual.length})
              </p>
              <ul className="mt-0.5 list-disc space-y-0.5 pl-5 text-micro text-ash">
                {data.driverSplit.individual.map((t, i) => (
                  <li key={i}>{t}</li>
                ))}
              </ul>
            </div>
            <div>
              <p className="text-micro font-semibold text-ink">Short-term fix ({data.horizonSplit.shortTerm.length})</p>
              <ul className="mt-0.5 list-disc space-y-0.5 pl-5 text-micro text-ash">
                {data.horizonSplit.shortTerm.map((t, i) => (
                  <li key={i}>{t}</li>
                ))}
              </ul>
            </div>
            <div>
              <p className="text-micro font-semibold text-ink">
                Structural change needed ({data.horizonSplit.structuralChange.length})
              </p>
              <ul className="mt-0.5 list-disc space-y-0.5 pl-5 text-micro text-ash">
                {data.horizonSplit.structuralChange.map((t, i) => (
                  <li key={i}>{t}</li>
                ))}
              </ul>
            </div>
          </div>
        </section>
      )}

      {data.actions.length > 0 && (
        <section className={reveal}>
          <h3 className="text-caption font-semibold uppercase tracking-wide text-ash">First two moves</h3>
          <div className="mt-1.5 space-y-2">
            {data.actions.map((a) => (
              <div key={a.letter} className="rounded-lg border border-line p-2.5">
                <p className="text-micro font-semibold text-ink">
                  {a.letter} · {a.short}
                </p>
                <p className="mt-0.5 text-micro text-ash">
                  {a.category ?? "—"} · {a.direction ?? "direction not chosen"}
                </p>
                {a.justification.trim() && <p className="mt-1 text-micro italic text-ink">“{a.justification}”</p>}
              </div>
            ))}
          </div>
        </section>
      )}

      {diagnosed > 0 && (
        <section className={reveal}>
          <h3 className="text-caption font-semibold uppercase tracking-wide text-ash">Pattern</h3>
          <p className="mt-1.5 text-micro text-ash">{data.closingLine}</p>
        </section>
      )}
    </div>
  );
}
