"use client";

import clsx from "clsx";
import { useHydrated } from "@/lib/store";
import { scrollToAndFlash } from "@/lib/scrollToAndFlash";
import { CRITERIA, ENGAGEMENT, EXPORT, MEASURE_LINES, OWNERSHIP_NODES, measureLineById, reversibilityOutcome } from "@/lib/route2";
import { useRoute2, domId } from "./useRoute2";

export function useReportDate() {
  const hydrated = useHydrated();
  return hydrated ? new Date().toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" }) : "";
}

/** The Valora Digital Operations Priority Proposal, live: Part 1's scores and choice, Part 2's proposal fields. */
export function ReportPanel() {
  const r2 = useRoute2();
  const date = useReportDate();
  const outcome = reversibilityOutcome(r2.decideReversible, r2.decideMoreData);

  return (
    <div className="rounded-2xl border border-line bg-paper p-5">
      <p className="text-micro font-semibold uppercase tracking-wide text-accent">{EXPORT.docHeading}</p>
      <p className="mt-1 text-caption text-ash">
        <span className="font-semibold text-ink">{r2.name.trim() || "[your name]"}</span>
        {date ? ` · ${date}` : ""} · Case: {ENGAGEMENT.company}
      </p>

      <div className="mt-4 border-t border-line pt-3">
        <p className="text-micro font-semibold uppercase tracking-wide text-ash">
          Part 1 — {r2.rankedCriteriaCount} of {CRITERIA.length} criteria ranked
        </p>
        <ul className="mt-1.5 space-y-1">
          {MEASURE_LINES.map((m) => (
            <li key={m.id} className="flex items-center gap-2 text-micro">
              <span
                className={clsx(
                  "shrink-0 rounded-full px-1.5 py-0.5 font-semibold",
                  r2.priority === m.id ? "bg-accentSoft text-accent" : "border border-line text-ash",
                )}
              >
                {m.letter}
              </span>
              <span className="min-w-0 truncate text-ink">{m.name}</span>
              <span className="ml-auto shrink-0 font-semibold tabular-nums text-ink">{r2.lineTotal(m.id)}</span>
            </li>
          ))}
        </ul>
        {r2.priority ? (
          <p className="mt-1.5 text-micro text-ash">
            Chosen: <span className="font-semibold text-ink">{measureLineById(r2.priority).letter}</span>
            {r2.priorityJustify && <> — &ldquo;{r2.priorityJustify}&rdquo;</>}
          </p>
        ) : (
          <p className="mt-1.5 text-micro italic text-ash">No priority chosen yet.</p>
        )}
        <button
          type="button"
          onClick={() => scrollToAndFlash(domId.part1, "ref")}
          className="mt-1.5 text-micro font-semibold text-accent underline decoration-dotted underline-offset-2 hover:text-accentHi"
        >
          Edit Part 1
        </button>
      </div>

      <div className="mt-4 border-t border-line pt-3">
        <p className="text-micro font-semibold uppercase tracking-wide text-ash">
          Part 2 — {r2.partTwoComplete ? "complete" : "in progress"}
        </p>
        <dl className="mt-1.5 space-y-1.5 text-micro">
          <Row label="Relevance" value={r2.relevance} />
          <Row label="First move" value={r2.firstMove} />
          <div>
            <dt className="text-ash">Ownership</dt>
            <dd className="mt-0.5 text-ink">
              {OWNERSHIP_NODES.filter((n) => r2.ownershipRole(n.id)).length === 0
                ? "— not assigned"
                : OWNERSHIP_NODES.filter((n) => r2.ownershipRole(n.id)).map((n) => `${n.label} (${r2.ownershipRole(n.id) === "owns" ? "Owns" : "Consulted"})`).join(", ")}
            </dd>
          </div>
          <div>
            <dt className="text-ash">One decision now</dt>
            <dd className="mt-0.5 text-ink">
              {r2.decideName ? `"${r2.decideName}"` : "— not named"}
              {outcome && <span className="text-ash"> — {outcome.label}</span>}
            </dd>
          </div>
        </dl>
        <button
          type="button"
          onClick={() => scrollToAndFlash(domId.part2, "ref")}
          className="mt-1.5 text-micro font-semibold text-accent underline decoration-dotted underline-offset-2 hover:text-accentHi"
        >
          Edit Part 2
        </button>
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-ash">{label}</dt>
      <dd className="mt-0.5 text-ink">{value ? `"${value}"` : "— not written yet"}</dd>
    </div>
  );
}
