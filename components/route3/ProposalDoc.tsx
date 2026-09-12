import { TASK3 } from "@/lib/route3";
import type { ProposalData } from "./useProposalData";

/** Pure presentational board memo — assembles as the architecture is built. */
export function ProposalDoc({ data, live = false }: { data: ProposalData; live?: boolean }) {
  const reveal = live ? "reveal-in" : undefined;
  const isEmpty = data.drivers.length === 0 && data.decisions.length === 0 && data.raci.every((r) => !r.accountable);

  return (
    <div className="space-y-5 text-ink">
      <div className="border-b border-line pb-3">
        <p className="text-micro uppercase tracking-wide text-ash">AION Green IT · Day 9 · Route 3</p>
        <h2 className="text-h3">{TASK3.export.docHeading}</h2>
        <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-caption text-ash">
          <span>
            Prepared by: <span className="font-semibold text-ink">{data.name}</span>
          </span>
          <span>
            Date: <span className="font-semibold text-ink">{data.date}</span>
          </span>
          <span>
            For: <span className="font-semibold text-ink">{data.caseReference}</span>
          </span>
        </div>
      </div>

      {isEmpty && <p className="text-caption text-ash">This proposal assembles as you work through the three stages below.</p>}

      {data.drivers.length > 0 && (
        <section className={reveal}>
          <h3 className="text-caption font-semibold uppercase tracking-wide text-ash">Strategic drivers</h3>
          <ul className="mt-1 list-disc space-y-0.5 pl-5 text-micro text-ash">
            {data.drivers.map((d) => (
              <li key={d}>{d}</li>
            ))}
          </ul>
        </section>
      )}

      {data.decisions.length > 0 && (
        <section className={reveal}>
          <h3 className="text-caption font-semibold uppercase tracking-wide text-ash">Guiding decisions, in sequence</h3>
          <ol className="mt-1 list-decimal space-y-0.5 pl-5 text-micro text-ink">
            {data.decisions.map((d) => (
              <li key={d.letter}>
                <span className="font-semibold">{d.letter} · </span>
                {d.label}
              </li>
            ))}
          </ol>
          {data.resolution && <p className="mt-1.5 text-micro italic text-ink">“{data.resolution}”</p>}
        </section>
      )}

      {data.rule.some((r) => r.value !== "—") && (
        <section className={reveal}>
          <h3 className="text-caption font-semibold uppercase tracking-wide text-ash">The decision rule</h3>
          <ul className="mt-1 space-y-0.5 text-micro">
            {data.rule.map((r) => (
              <li key={r.label} className="flex items-baseline justify-between gap-2">
                <span className="text-ash">{r.label}</span>
                <span className="shrink-0 font-semibold text-ink">{r.value}</span>
              </li>
            ))}
          </ul>
          <p className="mt-1.5 text-micro text-ash">
            Test bench: <span className="font-semibold text-ink">{data.bench.filter((b) => b.mark === "intended").length}</span> of{" "}
            {data.bench.length} outcomes confirmed intended · iterations:{" "}
            <span className="font-semibold text-ink">{data.iterations}</span>
          </p>
          {data.exceptionPath && <p className="mt-1 text-micro text-ash">Exception path: {data.exceptionPath}</p>}
          {data.reasonCodes.length > 0 && (
            <p className="mt-0.5 text-micro text-ash">Reason codes: {data.reasonCodes.join(" · ")}</p>
          )}
        </section>
      )}

      {data.raci.some((r) => r.accountable) && (
        <section className={reveal}>
          <h3 className="text-caption font-semibold uppercase tracking-wide text-ash">Accountability</h3>
          <ul className="mt-1 space-y-1 text-micro">
            {data.raci.map((r) => (
              <li key={r.decision}>
                <span className="font-semibold text-ink">{r.decision}</span>
                <span className="block text-ash">
                  A: {r.accountable ?? "—"}
                  {r.responsible.length > 0 && ` · R: ${r.responsible.join(", ")}`}
                  {r.consulted.length > 0 && ` · C: ${r.consulted.join(", ")}`}
                  {r.informed.length > 0 && ` · I: ${r.informed.join(", ")}`}
                </span>
              </li>
            ))}
          </ul>
          <p className="mt-1 text-micro text-ash">
            Projected load: {data.escalation.technician} decided at technician level · {data.escalation.teamLead} escalated
          </p>
        </section>
      )}

      {data.tradeoffs.some((t) => t.owner || t.stated) && (
        <section className={reveal}>
          <h3 className="text-caption font-semibold uppercase tracking-wide text-ash">Trade-off defaults</h3>
          <ul className="mt-1 space-y-1 text-micro">
            {data.tradeoffs.map((t) => (
              <li key={t.label}>
                <span className="font-semibold text-ink">{t.label}</span>
                <span className="block text-ash">
                  {t.owner ?? "—"} · {t.stated ?? "no default stated"}
                </span>
              </li>
            ))}
          </ul>
        </section>
      )}

      {data.review.length > 0 && (
        <section className={reveal}>
          <h3 className="text-caption font-semibold uppercase tracking-wide text-ash">Review mechanism</h3>
          <ul className="mt-1 space-y-0.5 text-micro">
            {data.review.map((r) => (
              <li key={r.indicator} className="flex items-baseline justify-between gap-2">
                <span className="text-ash">{r.indicator}</span>
                <span className="shrink-0 font-semibold text-ink">{r.cadence ?? "—"}</span>
              </li>
            ))}
          </ul>
          {data.trigger && <p className="mt-1 text-micro italic text-ink">Trigger: “{data.trigger}”</p>}
        </section>
      )}

      {data.challenges.some((c) => c.response) && (
        <section className={reveal}>
          <h3 className="text-caption font-semibold uppercase tracking-wide text-ash">Board challenge</h3>
          <ul className="mt-1 space-y-1 text-micro">
            {data.challenges.map((c) => (
              <li key={c.role}>
                <span className="font-semibold text-ink">{c.role}</span>
                <span className="block text-ash">{c.response ?? "—"}</span>
                {c.note && <span className="block italic text-ink">“{c.note}”</span>}
              </li>
            ))}
          </ul>
        </section>
      )}

      {data.commitment && (
        <section className={reveal}>
          <h3 className="text-caption font-semibold uppercase tracking-wide text-ash">Decided under uncertainty</h3>
          <p className="mt-1 text-micro text-ash">{data.commitment}</p>
        </section>
      )}
    </div>
  );
}
