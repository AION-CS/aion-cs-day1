import { CRITERIA, OPTIONS, REFLECTION_PROMPTS } from "@/lib/route2";
import type { useRoute2 } from "./useRoute2";

type Route2State = ReturnType<typeof useRoute2>;

/** Left-hand raw recap — every answer as-entered, no formatting or narrative. The structured memo is the right-hand panel. */
export function RecapPanel({ r2 }: { r2: Route2State }) {
  return (
    <div className="space-y-5 text-ink">
      <div className="border-b border-line pb-3">
        <p className="text-micro uppercase tracking-wide text-ash">Raw recap</p>
        <h2 className="text-h3">Your answers, stage by stage</h2>
      </div>

      <section>
        <h3 className="text-caption font-semibold uppercase tracking-wide text-ash">Stage 2 — Scores</h3>
        <ul className="mt-1.5 space-y-1 text-micro">
          {CRITERIA.map((c) => (
            <li key={c.id} className="flex items-baseline justify-between gap-2">
              <span className="text-ash">{c.label}</span>
              <span className="shrink-0 tabular-nums font-semibold text-ink">
                {OPTIONS.map((o) => `${o.id}:${r2.scoreOf(c.id, o.id) || "—"}`).join("  ")}
              </span>
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h3 className="text-caption font-semibold uppercase tracking-wide text-ash">Stage 3 — The Call</h3>
        <p className="mt-1.5 text-micro"><span className="text-ash">Pick: </span><span className="font-semibold text-ink">{r2.pick || "—"}</span></p>
        <p className="mt-1 text-micro text-ink">{r2.justify || "—"}</p>
      </section>

      <section>
        <h3 className="text-caption font-semibold uppercase tracking-wide text-ash">Stage 3 — Follow-Ups</h3>
        <ul className="mt-1.5 space-y-1 text-micro text-ink">
          {r2.followUps.map((f, i) => <li key={i}>{f || "—"}</li>)}
        </ul>
      </section>

      <section>
        <h3 className="text-caption font-semibold uppercase tracking-wide text-ash">Stage 4 — Risks</h3>
        <ul className="mt-1.5 space-y-1 text-micro text-ink">
          {r2.risks.map((r, i) => <li key={i}>{r || "—"}</li>)}
        </ul>
      </section>

      <section>
        <h3 className="text-caption font-semibold uppercase tracking-wide text-ash">Stage 5 — Reflection</h3>
        <ul className="mt-1.5 space-y-1.5 text-micro">
          {REFLECTION_PROMPTS.map((p, i) => (
            <li key={p.id}>
              <span className="text-ash">{p.question}: </span>
              <span className="text-ink">{r2.reflections[i] || "—"}</span>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
