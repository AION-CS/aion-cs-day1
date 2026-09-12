import { EVIDENCE_CARDS, CRITERIA, MEASURES, CONSTRAINTS, STANCES } from "@/lib/route2";
import type { useRoute2 } from "./useRoute2";

type Route2State = ReturnType<typeof useRoute2>;

/** Left-hand raw recap — every answer as entered. The structured memo is the right-hand panel. */
export function RecapPanel({ r2 }: { r2: Route2State }) {
  return (
    <div className="space-y-5 text-ink">
      <div className="border-b border-line pb-3">
        <p className="text-micro uppercase tracking-wide text-ash">Raw recap</p>
        <h2 className="text-h3">Your answers, stage by stage</h2>
      </div>

      <section>
        <h3 className="text-caption font-semibold uppercase tracking-wide text-ash">Stage 1 — Evidence</h3>
        <ul className="mt-1.5 space-y-1 text-micro">
          {EVIDENCE_CARDS.map((c) => (
            <li key={c.id} className="flex items-baseline justify-between gap-2">
              <span className="text-ash">#{c.n}</span>
              <span className="shrink-0 text-right font-semibold text-ink">
                {r2.confidence[c.id] ?? "—"} · {r2.relevance[c.id] === "changes" ? "relevant" : r2.relevance[c.id] ? "not relevant" : "—"}
              </span>
            </li>
          ))}
        </ul>
        <p className="mt-1.5 text-micro">
          <span className="text-ash">Contradiction stance: </span>
          <span className="text-ink">{STANCES.find((s) => s.id === r2.stance)?.label ?? "—"}</span>
        </p>
      </section>

      <section>
        <h3 className="text-caption font-semibold uppercase tracking-wide text-ash">Stage 2 — Weights &amp; scores</h3>
        <ul className="mt-1.5 space-y-1 text-micro">
          {CRITERIA.map((c) => (
            <li key={c.id} className="flex items-baseline justify-between gap-2">
              <span className="text-ash">{c.label}</span>
              <span className="shrink-0 font-semibold tabular-nums text-ink">{r2.weights[c.id] || 0}</span>
            </li>
          ))}
        </ul>
        <ul className="mt-2 space-y-1 text-micro">
          {MEASURES.map((m) => (
            <li key={m.id} className="flex items-baseline justify-between gap-2">
              <span className="text-ash">
                {m.id} · {CRITERIA.map((c) => r2.score[`${m.id}:${c.id}`] ?? "–").join(" / ")}
              </span>
              <span className="shrink-0 font-semibold tabular-nums text-ink">{r2.totals[m.id].toFixed(2)}</span>
            </li>
          ))}
        </ul>
        <p className="mt-1.5 text-micro">
          <span className="text-ash">Sensitivity: </span>
          <span className="text-ink">{r2.sensitivity ?? "—"}</span>
        </p>
      </section>

      <section>
        <h3 className="text-caption font-semibold uppercase tracking-wide text-ash">Stage 3 — Stress-test &amp; commit</h3>
        <ul className="mt-1.5 space-y-1 text-micro">
          {CONSTRAINTS.map((c) => (
            <li key={c.id} className="flex items-baseline justify-between gap-2">
              <span className="text-ash">{c.text}</span>
              <span className="shrink-0 font-semibold text-ink">{r2.constraintPlacement[c.id] ?? "—"}</span>
            </li>
          ))}
        </ul>
        <p className="mt-1.5 text-micro">
          <span className="text-ash">Mid-year update: </span>
          <span className="text-ink">{r2.shock ?? "—"}</span>
        </p>
        <p className="mt-1 text-micro">
          <span className="text-ash">Ranking: </span>
          <span className="text-ink">
            {MEASURES.filter((m) => r2.rank[m.id])
              .sort((a, b) => (r2.rank[a.id] ?? 0) - (r2.rank[b.id] ?? 0))
              .map((m) => m.id)
              .join(" → ") || "—"}
          </span>
        </p>
      </section>
    </div>
  );
}
