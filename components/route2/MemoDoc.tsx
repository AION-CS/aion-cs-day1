import { TASK2 } from "@/lib/route2";
import type { MemoData } from "./useMemoData";

/** Pure presentational memo — assembles as the learner works through the three stages. */
export function MemoDoc({ data, live = false }: { data: MemoData; live?: boolean }) {
  const reveal = live ? "reveal-in" : undefined;
  const scored = data.matrix.some((row) => row.scores.some((s) => s.score !== null));
  const isEmpty = !scored && data.ranking.length === 0 && !data.stance;

  return (
    <div className="space-y-5 text-ink">
      <div className="border-b border-line pb-3">
        <p className="text-micro uppercase tracking-wide text-ash">AION Green IT · Day 9 · Route 2</p>
        <h2 className="text-h3">{TASK2.export.docHeading}</h2>
        <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-caption text-ash">
          <span>
            Advisor: <span className="font-semibold text-ink">{data.name}</span>
          </span>
          <span>
            Date: <span className="font-semibold text-ink">{data.date}</span>
          </span>
          <span>
            Subject: <span className="font-semibold text-ink">{data.caseReference}</span>
          </span>
        </div>
      </div>

      {isEmpty && <p className="text-caption text-ash">This memo fills in as you work through the three stages below.</p>}

      {(data.stance || data.confidenceIndex.verified + data.confidenceIndex.partial + data.confidenceIndex.assumed > 0) && (
        <section className={reveal}>
          <h3 className="text-caption font-semibold uppercase tracking-wide text-ash">Evidence base</h3>
          <p className="mt-1 text-micro text-ash">
            Confidence index: <span className="font-semibold text-ink">{data.confidenceIndex.verified}</span> verified ·{" "}
            <span className="font-semibold text-ink">{data.confidenceIndex.partial}</span> partial ·{" "}
            <span className="font-semibold text-ink">{data.confidenceIndex.assumed}</span> assumed
          </p>
          {data.stance && (
            <p className="mt-1 text-micro text-ash">
              Contradiction stance: <span className="font-semibold text-ink">{data.stance}</span>
            </p>
          )}
        </section>
      )}

      {data.weights.some((w) => w.weight > 0) && (
        <section className={reveal}>
          <h3 className="text-caption font-semibold uppercase tracking-wide text-ash">Criteria weights</h3>
          <ul className="mt-1 space-y-1 text-micro">
            {data.weights.map((w) => (
              <li key={w.criterion}>
                <span className="font-semibold text-ink">
                  {w.criterion} — {w.weight}
                </span>
                {w.why && <span className="text-ash"> · {w.why}</span>}
              </li>
            ))}
          </ul>
        </section>
      )}

      {scored && (
        <section className={reveal}>
          <h3 className="text-caption font-semibold uppercase tracking-wide text-ash">Weighted scoring</h3>
          <ul className="mt-1 space-y-1 text-micro">
            {data.matrix.map((row) => (
              <li key={row.measure} className="flex items-baseline justify-between gap-2">
                <span className="text-ash">
                  {row.measure} · {row.scores.map((s) => s.score ?? "–").join(" / ")}
                </span>
                <span className="shrink-0 font-semibold tabular-nums text-ink">{row.total.toFixed(2)}</span>
              </li>
            ))}
          </ul>
          <p className="mt-1 text-micro text-ash">
            Matrix order: <span className="font-semibold text-ink">{data.derivedRanking}</span>
          </p>
          {data.sensitivity.result && (
            <p className="mt-1 text-micro text-ash">
              Sensitivity: <span className="font-semibold text-ink">{data.sensitivity.result}</span>
              {data.sensitivity.note && <span> — {data.sensitivity.note}</span>}
            </p>
          )}
        </section>
      )}

      {data.constraints.some((c) => c.measure) && (
        <section className={reveal}>
          <h3 className="text-caption font-semibold uppercase tracking-wide text-ash">Constraint stress-test</h3>
          <ul className="mt-1 space-y-1.5 text-micro">
            {data.constraints
              .filter((c) => c.measure)
              .map((c) => (
                <li key={c.text}>
                  <span className="font-semibold text-ink">
                    {c.text} → {c.measure}
                  </span>
                  {c.mitigation && <span className="block text-ash">Mitigation: {c.mitigation}</span>}
                </li>
              ))}
          </ul>
          {data.shock.answer && (
            <p className="mt-1.5 text-micro text-ash">
              Mid-year update: <span className="font-semibold text-ink">{data.shock.answer}</span>
              {data.shock.note && <span> — {data.shock.note}</span>}
            </p>
          )}
        </section>
      )}

      {data.ranking.length > 0 && (
        <section className={reveal}>
          <h3 className="text-caption font-semibold uppercase tracking-wide text-ash">Recommendation</h3>
          <ol className="mt-1 list-decimal space-y-0.5 pl-5 text-micro text-ink">
            {data.ranking.map((r) => (
              <li key={r.measure}>{r.measure}</li>
            ))}
          </ol>
          {data.justification && <p className="mt-1.5 text-micro italic text-ink">“{data.justification}”</p>}
        </section>
      )}

      {data.risks.length > 0 && (
        <section className={reveal}>
          <h3 className="text-caption font-semibold uppercase tracking-wide text-ash">
            Risks of a visible-but-weak choice
          </h3>
          <ul className="mt-1 space-y-0.5 text-micro">
            {data.risks.map((r) => (
              <li key={r.label}>
                <span className="font-semibold text-ink">{r.label}</span>
                {r.note && <span className="text-ash"> — {r.note}</span>}
              </li>
            ))}
          </ul>
        </section>
      )}

      {data.uncertainty && (
        <section className={reveal}>
          <h3 className="text-caption font-semibold uppercase tracking-wide text-ash">Decided under uncertainty</h3>
          <p className="mt-1 text-micro text-ash">{data.uncertainty}</p>
        </section>
      )}
    </div>
  );
}
