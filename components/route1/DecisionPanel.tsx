"use client";

import clsx from "clsx";
import { useHydrated } from "@/lib/store";
import { DIMENSIONS, ENGAGEMENT, EXPORT, OPTIONS } from "@/lib/route1";
import { useRoute1 } from "./useRoute1";

/**
 * Part 2 of the Engagement Report, building itself alongside stage 2: header
 * → radar summary → recommendation → follow-up decisions → risk register.
 * The same document Part 1 started, continued — not a second deliverable.
 *
 * The radar summary always shows all three options regardless of which was
 * picked — the memo has to let a reader check the chosen option against the
 * ones it beat, not just read an assertion.
 */
export function DecisionPanel() {
  const r1 = useRoute1();
  const hydrated = useHydrated();
  const date = hydrated
    ? new Date().toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })
    : "";

  return (
    <aside className="rounded-2xl border border-line bg-paper p-5">
      {/* Header */}
      <p className="text-micro font-semibold uppercase tracking-wide text-accent">
        {EXPORT.docHeading}
      </p>
      <p className="text-caption font-semibold text-ink">{EXPORT.partTwo}</p>
      <p className="mt-1 text-caption text-ash">
        <span className="font-semibold text-ink">{r1.name.trim() || "[your name]"}</span>
        {date ? ` · ${date}` : ""} · Case: {ENGAGEMENT.company}
      </p>

      {/* Radar summary — always all three */}
      <div className="mt-4">
        <p className="text-micro font-semibold uppercase tracking-wide text-ash">Radar summary</p>
        <table className="mt-2 w-full text-micro">
          <thead>
            <tr className="border-b border-line text-ash">
              <th className="py-1 text-left font-semibold">Criterion</th>
              {OPTIONS.map((o) => (
                <th
                  key={o.id}
                  className={clsx(
                    "w-8 py-1 text-center font-semibold",
                    r1.pick === o.id && "text-accent",
                  )}
                >
                  {o.id}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {DIMENSIONS.map((d) => (
              <tr key={d.key} className="border-b border-line/60">
                <td className="py-1 pr-2 text-ash">
                  {d.name}
                  {d.inverted && <span className="ml-1 text-warn">▲</span>}
                </td>
                {OPTIONS.map((o) => (
                  <td
                    key={o.id}
                    className={clsx(
                      "py-1 text-center tabular-nums",
                      r1.pick === o.id ? "font-semibold text-accent" : "text-ink",
                    )}
                  >
                    {o.profile[d.key]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
        <p className="mt-1.5 text-micro text-ash">
          <span className="text-warn">▲</span> Higher is worse on this axis.
        </p>
      </div>

      {/* Recommendation */}
      <div className="mt-5 border-t border-line pt-4">
        <p className="text-micro font-semibold uppercase tracking-wide text-ash">
          Recommendation &amp; justification
        </p>
        {r1.pickedOption ? (
          <p className="mt-1.5 text-caption font-semibold text-ink">
            Option {r1.pickedOption.id} — {r1.pickedOption.name}
          </p>
        ) : (
          <p className="mt-1.5 text-caption text-ash">No option committed to yet.</p>
        )}
        {(r1.rationale || r1.feasibility) && (
          <p className="mt-1.5 text-micro text-ink">
            {[r1.rationale, r1.feasibility].filter(Boolean).join(" ")}
          </p>
        )}
      </div>

      {/* Follow-up decisions */}
      <div className="mt-5 border-t border-line pt-4">
        <p className="text-micro font-semibold uppercase tracking-wide text-ash">Follow-up decisions</p>
        <BulletList items={r1.followUp} empty="Not written yet." />
      </div>

      {/* Risk register */}
      <div className="mt-5 border-t border-line pt-4">
        <p className="text-micro font-semibold uppercase tracking-wide text-ash">Risk register</p>
        <p className="mt-0.5 text-micro italic text-ash">What the roads not taken would have prevented.</p>
        <BulletList items={r1.risks} empty="Not written yet." />
      </div>
    </aside>
  );
}

function BulletList({ items, empty }: { items: [string, string]; empty: string }) {
  const filled = items.filter(Boolean);
  if (filled.length === 0) return <p className="mt-1.5 text-micro text-ash">{empty}</p>;
  return (
    <ul className="mt-1.5 space-y-1.5">
      {filled.map((t, i) => (
        <li key={i} className="flex gap-2 text-micro text-ink">
          <span className="mt-[5px] h-1 w-1 shrink-0 rounded-full bg-accent" />
          <span>{t}</span>
        </li>
      ))}
    </ul>
  );
}
