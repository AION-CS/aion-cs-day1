import { SKYBRIDGE_EVIDENCE, DECISION_NODES, LEVERS, HORIZONS } from "@/lib/route3";
import type { useRoute3 } from "./useRoute3";

type Route3State = ReturnType<typeof useRoute3>;
const NODE_LABEL: Record<string, string> = Object.fromEntries(DECISION_NODES.map((n) => [n.id, n.label]));
const HORIZON_LABEL: Record<string, string> = Object.fromEntries(HORIZONS.map((h) => [h.id, h.label]));

/** Left-hand raw recap — every answer as-entered. The formatted proposal is the right-hand panel. */
export function RecapPanel({ r3 }: { r3: Route3State }) {
  return (
    <div className="space-y-5 text-ink">
      <div className="border-b border-line pb-3">
        <p className="text-micro uppercase tracking-wide text-ash">Raw recap</p>
        <h2 className="text-h3">Your answers, stage by stage</h2>
      </div>

      <section>
        <h3 className="text-caption font-semibold uppercase tracking-wide text-ash">Stage 1 — Architecture mapping</h3>
        <ul className="mt-1.5 space-y-1 text-micro">
          {SKYBRIDGE_EVIDENCE.map((it) => (
            <li key={it.id} className="flex items-baseline justify-between gap-2">
              <span className="text-ash">{it.text}</span>
              <span className="shrink-0 font-semibold text-ink">{r3.stage2Node[it.id] ? NODE_LABEL[r3.stage2Node[it.id]!] : "—"}</span>
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h3 className="text-caption font-semibold uppercase tracking-wide text-ash">Stage 2 — Chosen levers</h3>
        <ul className="mt-1.5 space-y-1 text-micro text-ink">
          {r3.stage3Selected.map((id) => <li key={id}>{LEVERS.find((l) => l.id === id)?.text}</li>)}
        </ul>
      </section>

      <section>
        <h3 className="text-caption font-semibold uppercase tracking-wide text-ash">Stage 2 — Sequencing</h3>
        <ul className="mt-1.5 space-y-1 text-micro">
          {r3.stage4Levers.map((l) => (
            <li key={l.id} className="flex items-baseline justify-between gap-2">
              <span className="text-ash">{l.text}</span>
              <span className="shrink-0 font-semibold text-ink">{r3.stage4Horizon[l.id] ? HORIZON_LABEL[r3.stage4Horizon[l.id]!] : "—"}</span>
            </li>
          ))}
        </ul>
        <p className="mt-1 text-micro"><span className="text-ash">First move: </span><span className="font-semibold text-ink">{LEVERS.find((l) => l.id === r3.firstMove)?.text ?? "—"}</span></p>
      </section>

      <section>
        <h3 className="text-caption font-semibold uppercase tracking-wide text-ash">Stage 3 — Helix proposal</h3>
        <p className="mt-1.5 text-micro"><span className="text-ash">Relevance: </span><span className="text-ink">{r3.strategicRelevance || "—"}</span></p>
        <p className="mt-1 text-micro"><span className="text-ash">Logic: </span><span className="text-ink">{r3.prioritizationLogic || "—"}</span></p>
        <p className="mt-1 text-micro"><span className="text-ash">First measure: </span><span className="text-ink">{r3.firstMeasure || "—"}</span></p>
      </section>
    </div>
  );
}
