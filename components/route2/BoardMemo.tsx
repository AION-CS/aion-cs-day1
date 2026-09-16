"use client";

import { useHydrated } from "@/lib/store";
import { EXPORT, RACI_ROWS, SYNERVIA, decisionById } from "@/lib/route2";
import { TradeoffMapSvg } from "./TradeoffMapSvg";
import { useRoute2 } from "./useRoute2";

/**
 * The Synervia Board Memo, assembling live beside the five exercises — the
 * prioritised measure and its defence, ranked decisions, the trade-off map,
 * the ownership grid in one line per row, and the decision that cannot
 * wait. It is a view of the learner's answers, never a second copy of them.
 */
export function BoardMemo() {
  const r2 = useRoute2();
  const hydrated = useHydrated();
  const date = hydrated ? new Date().toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" }) : "";

  const bets = r2.mapStates.filter((s) => s.placed === "bet");

  return (
    <div className="rounded-2xl border border-line bg-paper p-5">
      <p className="text-micro font-semibold uppercase tracking-wide text-accent">{EXPORT.docHeading}</p>
      <p className="mt-1 text-caption text-ash">
        <span className="font-semibold text-ink">{r2.name.trim() || "[your name]"}</span>
        {date ? ` · ${date}` : ""} · {SYNERVIA.company}
      </p>

      {/* Recommendation */}
      <MemoSection title="Recommendation">
        {r2.chosenLane ? (
          <>
            <p className="text-caption font-semibold text-ink">{r2.chosenLane.label}</p>
            {r2.justification && <p className="mt-1 text-micro italic text-ink">&ldquo;{r2.justification}&rdquo;</p>}
          </>
        ) : (
          <Empty text="Choose a line of measures in Exercise 1 and it appears here." />
        )}
        {r2.risks.some(Boolean) && (
          <ul className="mt-2 space-y-1">
            {r2.risks.filter(Boolean).map((r, i) => (
              <li key={i} className="text-micro text-ash">
                <span className="font-semibold text-ink">Risk. </span>
                {r}
              </li>
            ))}
          </ul>
        )}
      </MemoSection>

      {/* Guiding decisions */}
      <MemoSection title="Guiding decisions">
        {r2.ranking.length === 0 ? (
          <Empty text="Rank your first guiding decision and it appears here." />
        ) : (
          <ol className="space-y-1.5">
            {r2.ranking.map((id, i) => (
              <li key={id} className="flex gap-2 text-caption text-ink">
                <span className="font-semibold text-accent tabular-nums">{i + 1}.</span>
                <span>{decisionById(id).label}</span>
              </li>
            ))}
          </ol>
        )}
        {r2.rankWhy && <p className="mt-2 text-micro italic text-ink">&ldquo;{r2.rankWhy}&rdquo;</p>}
      </MemoSection>

      {/* Trade-off map */}
      <MemoSection title="Trade-off assessment">
        <TradeoffMapSvg states={r2.mapStates} compact />
        {bets.length > 0 && (
          <ul className="mt-2 space-y-1">
            {bets.map((s) => (
              <li key={s.measure.id} className="text-micro text-ink">
                <span className="font-semibold">{s.measure.id.toUpperCase()}: </span>
                {s.bet || <span className="text-ash">strategic-bet line not written</span>}
              </li>
            ))}
          </ul>
        )}
      </MemoSection>

      {/* Ownership */}
      <MemoSection title="Ownership">
        <ul className="space-y-1">
          {RACI_ROWS.map((row) => {
            const a = r2.accountableFor(row.id);
            return (
              <li key={row.id} className="flex gap-2 text-micro">
                <span className="w-24 shrink-0 font-semibold text-ink">
                  {a.length === 1 ? a[0].short : a.length > 1 ? "2+ Accountable" : "—"}
                </span>
                <span className="text-ash">{row.label}</span>
              </li>
            );
          })}
        </ul>
        {(r2.raciStructuralIssues.length > 0 || r2.raciAuthorityWarnings.length > 0) && (
          <p className="mt-1.5 text-micro text-warn">
            {r2.raciStructuralIssues.length} structural issue{r2.raciStructuralIssues.length === 1 ? "" : "s"} ·{" "}
            {r2.raciAuthorityWarnings.length} authority question{r2.raciAuthorityWarnings.length === 1 ? "" : "s"}
          </p>
        )}
      </MemoSection>

      {/* Decision now */}
      <MemoSection title="Decision required now">
        {r2.decideNow.decision ? (
          <p className="text-caption font-semibold text-ink">{r2.decideNow.decision}</p>
        ) : (
          <Empty text="Not written yet." />
        )}
        {r2.decideNow.signal && (
          <p className="mt-1 text-micro text-ash">
            <span className="font-semibold text-ink">Would be proven wrong if: </span>
            {r2.decideNow.signal}
          </p>
        )}
      </MemoSection>
    </div>
  );
}

function MemoSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mt-4 border-t border-line pt-3">
      <p className="mb-1.5 text-micro font-semibold uppercase tracking-wide text-ash">{title}</p>
      {children}
    </div>
  );
}

function Empty({ text }: { text: string }) {
  return <p className="rounded-lg border border-dashed border-line bg-canvas p-2 text-micro text-ash">{text}</p>;
}
