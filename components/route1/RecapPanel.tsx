import { ZONES, FINDINGS, CATEGORIES, DIRECTIONS, DRIVER_OPTIONS, HORIZON_OPTIONS } from "@/lib/route1";
import type { useRoute1 } from "./useRoute1";

type Route1State = ReturnType<typeof useRoute1>;

const CATEGORY_LABEL: Record<string, string> = Object.fromEntries(CATEGORIES.map((c) => [c.id, c.label]));
const DRIVER_LABEL: Record<string, string> = Object.fromEntries(DRIVER_OPTIONS.map((o) => [o.id, o.label]));
const HORIZON_LABEL: Record<string, string> = Object.fromEntries(HORIZON_OPTIONS.map((o) => [o.id, o.label]));
const DIRECTION_LABEL: Record<string, string> = Object.fromEntries(DIRECTIONS.map((d) => [d.id, d.label]));

const letterOf = (zoneId: string) => ZONES.find((z) => z.id === zoneId)?.letter ?? "?";

/** Left-hand raw recap — every answer as-entered, no narrative. The structured brief is the right-hand panel. */
export function RecapPanel({ r1 }: { r1: Route1State }) {
  return (
    <div className="space-y-5 text-ink">
      <div className="border-b border-line pb-3">
        <p className="text-micro uppercase tracking-wide text-ash">Raw recap</p>
        <h2 className="text-h3">Your answers, stage by stage</h2>
      </div>

      <section>
        <h3 className="text-caption font-semibold uppercase tracking-wide text-ash">Stage 1 — Zones investigated</h3>
        <ul className="mt-1.5 space-y-1 text-micro">
          {ZONES.map((z) => (
            <li key={z.id} className="flex items-baseline justify-between gap-2">
              <span className="text-ash">
                {z.letter} · {z.label}
              </span>
              <span className="shrink-0 font-semibold text-ink">{r1.zonesSeen.includes(z.id) ? "logged" : "—"}</span>
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h3 className="text-caption font-semibold uppercase tracking-wide text-ash">Stage 1 — Area</h3>
        <ul className="mt-1.5 space-y-1 text-micro">
          {FINDINGS.map((f) => (
            <li key={f.id} className="flex items-baseline justify-between gap-2">
              <span className="text-ash">
                {letterOf(f.zoneId)} · {f.short}
              </span>
              <span className="shrink-0 font-semibold text-ink">
                {r1.category[f.id] ? CATEGORY_LABEL[r1.category[f.id]!] : "—"}
              </span>
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h3 className="text-caption font-semibold uppercase tracking-wide text-ash">Stage 2 — Diagnosis</h3>
        <ul className="mt-1.5 space-y-1 text-micro">
          {FINDINGS.map((f) => (
            <li key={f.id} className="flex items-baseline justify-between gap-2">
              <span className="text-ash">{letterOf(f.zoneId)}</span>
              <span className="shrink-0 text-right font-semibold text-ink">
                {r1.driver[f.id] ? DRIVER_LABEL[r1.driver[f.id]!] : "—"}
                {" · "}
                {r1.horizon[f.id] ? HORIZON_LABEL[r1.horizon[f.id]!] : "—"}
              </span>
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h3 className="text-caption font-semibold uppercase tracking-wide text-ash">Stage 3 — First two moves</h3>
        {r1.priorities.length === 0 ? (
          <p className="mt-1.5 text-micro text-ash">Nothing selected yet.</p>
        ) : (
          <ul className="mt-1.5 space-y-1.5 text-micro">
            {FINDINGS.filter((f) => r1.priorities.includes(f.id)).map((f) => (
              <li key={f.id}>
                <span className="font-semibold text-ink">
                  {letterOf(f.zoneId)} · {r1.direction[f.id] ? DIRECTION_LABEL[r1.direction[f.id]!] : "no direction yet"}
                </span>
                <span className="block text-ash">{r1.justification[f.id] || "—"}</span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
