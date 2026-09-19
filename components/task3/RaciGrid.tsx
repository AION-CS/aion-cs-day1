"use client";

import clsx from "clsx";
import { ACTIVITIES, CHIPS, CHIP_NAME, ROLES, raciProblems } from "@/data/raciModel";
import type { Chip } from "@/data/raciModel";
import { IDS3 } from "@/lib/l3";
import { useStore } from "@/store/useStore";

/**
 * The RACI grid: 4 activities × 4 roles. Each cell holds one chip (R, A, C, I)
 * or none; pressing the pressed chip clears it. The one rule enforced: exactly
 * one Accountable per row. Which role holds it is the participant's judgement.
 */
export function RaciGrid({ showProblems }: { showProblems: boolean }) {
  const raci = useStore((s) => s.route3.raci);
  const setChip = useStore((s) => s.setRaciChip);
  const problems = raciProblems(raci);

  return (
    <div id={IDS3.raci} className="overflow-x-auto rounded-lg border border-line bg-paper p-1">
      <table className="w-full min-w-[40rem] border-collapse text-caption">
        <caption className="sr-only">RACI grid: four activities by four roles</caption>
        <thead>
          <tr className="bg-mist text-left">
            <th scope="col" className="px-3 py-2 text-micro font-semibold uppercase text-ash">Activity</th>
            {ROLES.map((r) => (
              <th key={r.id} scope="col" className="px-2 py-2 text-micro font-semibold uppercase text-ash">
                {r.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {ACTIVITIES.map((a) => {
            const bad = showProblems && problems.some((p) => p.id === a.id);
            return (
              <tr key={a.id} className={clsx("border-t border-line align-middle", bad && "is-flagged")}>
                <th scope="row" className="px-3 py-2 text-left font-semibold">
                  {a.label}
                </th>
                {ROLES.map((r) => {
                  const cur = raci[a.id][r.id];
                  return (
                    <td key={r.id} className="px-2 py-1.5">
                      <div role="group" aria-label={`${a.label}, ${r.label}`} className="flex gap-1">
                        {CHIPS.map((c: Chip) => (
                          <button
                            key={c}
                            type="button"
                            aria-pressed={cur === c}
                            aria-label={`${CHIP_NAME[c]}`}
                            title={CHIP_NAME[c]}
                            onClick={() => setChip(a.id, r.id, cur === c ? null : c)}
                            className={clsx(
                              "grid h-9 w-9 place-items-center rounded-md border text-caption font-bold transition-colors",
                              cur === c
                                ? c === "A"
                                  ? "border-accent bg-accent text-paper"
                                  : "border-ink bg-ink text-paper"
                                : "border-line bg-paper text-ash hover:border-ash",
                            )}
                          >
                            {c}
                          </button>
                        ))}
                      </div>
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
      <p className="px-3 py-2 text-micro normal-case tracking-normal text-ash">
        R Responsible · A Accountable (exactly one per row) · C Consulted · I Informed. Press a pressed chip again to clear it.
      </p>
    </div>
  );
}
