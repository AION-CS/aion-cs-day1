import { EVIDENCE_ITEMS, DIMENSIONS, STATEMENT_PROMPTS } from "@/lib/route1";
import type { useRoute1 } from "./useRoute1";

type Route1State = ReturnType<typeof useRoute1>;

const DIM_LABEL: Record<string, string> = Object.fromEntries(DIMENSIONS.map((d) => [d.id, d.label]));

/** Left-hand raw recap — every answer as-entered, no formatting or narrative. The structured brief is the right-hand panel. */
export function RecapPanel({ r1 }: { r1: Route1State }) {
  return (
    <div className="space-y-5 text-ink">
      <div className="border-b border-line pb-3">
        <p className="text-micro uppercase tracking-wide text-ash">Raw recap</p>
        <h2 className="text-h3">Your answers, stage by stage</h2>
      </div>

      <section>
        <h3 className="text-caption font-semibold uppercase tracking-wide text-ash">Stage 2 — Benefit / Risk</h3>
        <ul className="mt-1.5 space-y-1 text-micro">
          {EVIDENCE_ITEMS.map((it) => (
            <li key={it.id} className="flex items-baseline justify-between gap-2">
              <span className="text-ash">{it.text}</span>
              <span className="shrink-0 font-semibold text-ink">{r1.stage2Verdict[it.id] ?? "—"}</span>
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h3 className="text-caption font-semibold uppercase tracking-wide text-ash">Stage 3 — Wheel dimension</h3>
        <ul className="mt-1.5 space-y-1 text-micro">
          {EVIDENCE_ITEMS.map((it) => (
            <li key={it.id} className="flex items-baseline justify-between gap-2">
              <span className="text-ash">{it.text}</span>
              <span className="shrink-0 font-semibold text-ink">{r1.stage3Dimension[it.id] ? DIM_LABEL[r1.stage3Dimension[it.id]!] : "—"}</span>
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h3 className="text-caption font-semibold uppercase tracking-wide text-ash">Stage 4 — Statements</h3>
        <ul className="mt-1.5 space-y-1.5 text-micro">
          {STATEMENT_PROMPTS.map((p) => (
            <li key={p.id}>
              <span className="text-ash">{p.starter}: </span>
              <span className="text-ink">{r1.stage4Statement[p.id] || "—"}</span>
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h3 className="text-caption font-semibold uppercase tracking-wide text-ash">Stage 5 — Technical / Governance</h3>
        {r1.stage5Items.length === 0 ? (
          <p className="mt-1.5 text-micro text-ash">No Risk-tagged cards yet.</p>
        ) : (
          <ul className="mt-1.5 space-y-1 text-micro">
            {r1.stage5Items.map((it) => (
              <li key={it.id} className="flex items-baseline justify-between gap-2">
                <span className="text-ash">{it.text}</span>
                <span className="shrink-0 font-semibold text-ink">{r1.stage5Side[it.id] ?? "—"}</span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
