import {
  DRIVERS,
  GUIDING_DECISIONS,
  THRESHOLDS,
  TEST_DEVICES,
  RACI_DECISIONS,
  TRADE_OFFS,
  REVIEW_INDICATORS,
  BOARD_CHALLENGES,
  ROLES,
} from "@/lib/route3";
import type { useRoute3 } from "./useRoute3";

type Route3State = ReturnType<typeof useRoute3>;

const roleLabel = (id?: string) => ROLES.find((r) => r.id === id)?.label ?? "—";

/** Left-hand raw recap — every answer as entered. The board memo is the right-hand panel. */
export function RecapPanel({ r3 }: { r3: Route3State }) {
  const ordered = [...r3.pickedDecisions].sort((a, b) => (r3.order[a] ?? 99) - (r3.order[b] ?? 99));

  return (
    <div className="space-y-5 text-ink">
      <div className="border-b border-line pb-3">
        <p className="text-micro uppercase tracking-wide text-ash">Raw recap</p>
        <h2 className="text-h3">Your architecture, stage by stage</h2>
      </div>

      <section>
        <h3 className="text-caption font-semibold uppercase tracking-wide text-ash">Stage 1 — Framing</h3>
        <ul className="mt-1.5 space-y-0.5 text-micro text-ash">
          {r3.pickedDrivers.length === 0 && <li>No drivers selected.</li>}
          {r3.pickedDrivers.map((id) => (
            <li key={id}>{DRIVERS.find((d) => d.id === id)?.label}</li>
          ))}
        </ul>
        <ol className="mt-2 list-decimal space-y-0.5 pl-5 text-micro text-ink">
          {ordered.map((id) => (
            <li key={id}>{GUIDING_DECISIONS.find((d) => d.id === id)?.letter}</li>
          ))}
        </ol>
      </section>

      <section>
        <h3 className="text-caption font-semibold uppercase tracking-wide text-ash">Stage 2 — The rule</h3>
        <ul className="mt-1.5 space-y-1 text-micro">
          {THRESHOLDS.map((t) => (
            <li key={t.key} className="flex items-baseline justify-between gap-2">
              <span className="text-ash">{t.label}</span>
              <span className="shrink-0 font-semibold text-ink">
                {t.options.find((o) => o.id === r3.thresholds[t.key])?.label ?? "—"}
              </span>
            </li>
          ))}
        </ul>
        <p className="mt-1.5 text-micro text-ash">
          Bench: <span className="font-semibold text-ink">{r3.outcomeCounts.repair}</span> repair ·{" "}
          <span className="font-semibold text-ink">{r3.outcomeCounts.retire}</span> retire ·{" "}
          <span className="font-semibold text-ink">{r3.outcomeCounts.escalate}</span> escalate · marked{" "}
          <span className="font-semibold text-ink">{r3.markedCount}</span>/{TEST_DEVICES.length} · iterations{" "}
          <span className="font-semibold text-ink">{r3.iterations}</span>
        </p>
      </section>

      <section>
        <h3 className="text-caption font-semibold uppercase tracking-wide text-ash">Stage 3 — Accountability</h3>
        <ul className="mt-1.5 space-y-1 text-micro">
          {RACI_DECISIONS.map((d) => {
            const status = r3.raciStatus.find((s) => s.id === d.id);
            return (
              <li key={d.id} className="flex items-baseline justify-between gap-2">
                <span className="text-ash">{d.label}</span>
                <span className="shrink-0 font-semibold text-ink">
                  {status && status.accountable.length === 1 ? roleLabel(status.accountable[0]) : status && status.accountable.length > 1 ? "two A's" : "—"}
                </span>
              </li>
            );
          })}
        </ul>
        <ul className="mt-2 space-y-1 text-micro">
          {TRADE_OFFS.map((t) => (
            <li key={t.id} className="flex items-baseline justify-between gap-2">
              <span className="text-ash">{t.label}</span>
              <span className="shrink-0 font-semibold text-ink">{roleLabel(r3.tradeoffOwner[t.id])}</span>
            </li>
          ))}
        </ul>
        <p className="mt-2 text-micro">
          <span className="text-ash">Indicators: </span>
          <span className="text-ink">
            {r3.pickedIndicators.map((id) => REVIEW_INDICATORS.find((i) => i.id === id)?.label).join(" · ") || "—"}
          </span>
        </p>
        <p className="mt-1 text-micro">
          <span className="text-ash">Board responses: </span>
          <span className="text-ink">
            {BOARD_CHALLENGES.filter((c) => r3.challenge[c.id]).length} / {BOARD_CHALLENGES.length}
          </span>
        </p>
      </section>
    </div>
  );
}
