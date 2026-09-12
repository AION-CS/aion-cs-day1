"use client";

import { useHydrated } from "@/lib/store";
import {
  CODEVISTA,
  RACI_LETTERS,
  RACI_ROLES,
  TASK2,
  quadrantById,
} from "@/lib/route2";
import { useRoute2 } from "./useRoute2";

/** The live-building Board Memo, mirroring the established AION Green IT memo shape. */
export function BoardMemo() {
  const r2 = useRoute2();
  const hydrated = useHydrated();
  const date = hydrated
    ? new Date().toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })
    : "";

  const roleName = (id: string) => RACI_ROLES.find((r) => r.id === id)?.name ?? id;

  return (
    <aside className="rounded-2xl border border-line bg-paper p-5">
      <p className="text-micro font-semibold uppercase tracking-wide text-accent">
        {TASK2.export.docHeading}
      </p>
      <p className="mt-1 text-caption text-ash">
        <span className="font-semibold text-ink">{r2.name.trim() || "[your name]"}</span>
        {date ? ` · ${date}` : ""} · Case: {CODEVISTA.company}
      </p>
      <p className="text-micro text-ash">Role: {CODEVISTA.role} / CTO</p>

      {/* Guiding decisions */}
      <div className="mt-4">
        <p className="text-micro font-semibold uppercase tracking-wide text-ash">
          Guiding decisions (ranked)
        </p>
        {r2.rankedDecisions.length === 0 ? (
          <p className="mt-1.5 text-micro text-ash">Nothing ranked yet.</p>
        ) : (
          <ol className="mt-1.5 space-y-1.5">
            {r2.rankedDecisions.map((d, i) => (
              <li key={d.id} className="flex gap-2 text-micro">
                <span className="font-semibold tabular-nums text-accent">{i + 1}.</span>
                <span className="min-w-0">
                  <span className="text-ink">{d.text}</span>
                  {i === 0 && r2.rankRationale && (
                    <span className="mt-1 block italic text-ash">&ldquo;{r2.rankRationale}&rdquo;</span>
                  )}
                </span>
              </li>
            ))}
          </ol>
        )}
      </div>

      {/* Trade-off map */}
      <div className="mt-5 border-t border-line pt-4">
        <p className="text-micro font-semibold uppercase tracking-wide text-ash">
          Trade-off map summary
        </p>
        {r2.placedCards.length === 0 ? (
          <p className="mt-1.5 text-micro text-ash">Nothing placed yet.</p>
        ) : (
          <table className="mt-1.5 w-full text-micro">
            <thead>
              <tr className="border-b border-line text-ash">
                <th className="py-1 text-left font-semibold">Measure</th>
                <th className="w-14 py-1 text-center font-semibold">Momentum</th>
                <th className="w-14 py-1 text-center font-semibold">Structural</th>
              </tr>
            </thead>
            <tbody>
              {r2.placedCards.map((c) => {
                const q = quadrantById(r2.placements[c.id]!);
                return (
                  <tr key={c.id} className="border-b border-line/60">
                    <td className="py-1 pr-2 text-ink">{c.short}</td>
                    <td className="py-1 text-center text-ash">{q.momentum}</td>
                    <td className="py-1 text-center text-ash">{q.structural}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
        {r2.unplacedCards.length > 0 && (
          <p className="mt-1 text-micro text-ash">
            {r2.unplacedCards.length} measure{r2.unplacedCards.length === 1 ? "" : "s"} not yet placed.
          </p>
        )}
      </div>

      {/* RACI */}
      <div className="mt-5 border-t border-line pt-4">
        <p className="text-micro font-semibold uppercase tracking-wide text-ash">
          Governance model (RACI)
        </p>
        <dl className="mt-1.5 space-y-1">
          {RACI_LETTERS.map((l) => {
            const roles = r2.raci[l.id];
            const bad = l.id === "A" && roles.length !== 1;
            return (
              <div key={l.id} className="flex gap-2 text-micro">
                <dt className={bad ? "w-20 shrink-0 font-semibold text-danger" : "w-20 shrink-0 text-ash"}>
                  {l.name}
                </dt>
                <dd className="min-w-0 flex-1 text-ink">
                  {roles.length === 0 ? (
                    <span className="text-ash">— none assigned</span>
                  ) : (
                    roles.map(roleName).join(", ")
                  )}
                  {bad && roles.length > 1 && (
                    <span className="ml-1 text-danger">(RACI allows exactly one)</span>
                  )}
                </dd>
              </div>
            );
          })}
        </dl>
      </div>

      {/* Decision under uncertainty */}
      <div className="mt-5 border-t border-line pt-4">
        <p className="text-micro font-semibold uppercase tracking-wide text-ash">
          Decision under uncertainty
        </p>
        {r2.decideNow || r2.decideWhy ? (
          <div className="mt-1.5 space-y-1.5 text-micro text-ink">
            {r2.decideNow && <p>{r2.decideNow}</p>}
            {r2.decideWhy && <p className="italic text-ash">{r2.decideWhy}</p>}
          </div>
        ) : (
          <p className="mt-1.5 text-micro text-ash">Not written yet.</p>
        )}
      </div>
    </aside>
  );
}
