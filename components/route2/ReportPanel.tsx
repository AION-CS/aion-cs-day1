"use client";

import { useHydrated } from "@/lib/store";
import { ENGAGEMENT, EXPORT, GUIDING_DECISIONS, LAYERS, RELEVANCE_REASONS, ROLES, SEQUENCE_POSITIONS, roleById } from "@/lib/route2";
import { useRoute2 } from "./useRoute2";

export function useReportDate() {
  const hydrated = useHydrated();
  return hydrated ? new Date().toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" }) : "";
}

/** The live memo — assembles into the deliverable in the brief's own six-part structure. */
export function ReportPanel() {
  const r2 = useRoute2();
  const date = useReportDate();

  return (
    <div className="rounded-2xl border border-line bg-paper p-5">
      <p className="text-micro font-semibold uppercase tracking-wide text-accent">{EXPORT.docHeading}</p>
      <p className="mt-1 text-caption text-ash">
        <span className="font-semibold text-ink">{r2.name.trim() || "[your name]"}</span>
        {date ? ` · ${date}` : ""} · Case: {ENGAGEMENT.company}
      </p>

      <div className="mt-4 space-y-4 text-micro">
        <div>
          <p className="font-semibold uppercase tracking-wide text-ash">1. Strategic relevance</p>
          <p className="mt-1 text-ink">Lens: {r2.roleLens ? roleById(r2.roleLens).name : "— not picked"}</p>
          {r2.selectedReasons.length > 0 && (
            <ul className="mt-1 list-disc space-y-0.5 pl-4 text-ink">
              {r2.selectedReasons.map((id) => (
                <li key={id}>{RELEVANCE_REASONS.find((r) => r.id === id)!.text}</li>
              ))}
            </ul>
          )}
          {r2.relevanceJustification && <p className="mt-1 italic text-ink">&ldquo;{r2.relevanceJustification}&rdquo;</p>}
        </div>

        <div className="border-t border-line pt-3">
          <p className="font-semibold uppercase tracking-wide text-ash">2. Guiding decisions</p>
          {r2.selectedGuiding.length === 0 ? (
            <p className="mt-1 italic text-ash">None picked yet.</p>
          ) : (
            <ul className="mt-1 space-y-1.5">
              {r2.selectedGuiding.map((id) => (
                <li key={id} className="text-ink">
                  <span className="font-semibold">{GUIDING_DECISIONS.find((d) => d.id === id)!.text}</span>
                  {r2.guidingJustifications[id] && <span className="block italic text-ash">&ldquo;{r2.guidingJustifications[id]}&rdquo;</span>}
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="border-t border-line pt-3">
          <p className="font-semibold uppercase tracking-wide text-ash">3. Build sequence</p>
          <ol className="mt-1 list-decimal space-y-0.5 pl-4 text-ink">
            {SEQUENCE_POSITIONS.map((pos) => {
              const layer = LAYERS.find((l) => r2.sequence[l.id] === pos);
              return <li key={pos}>{layer ? layer.name : "—"}</li>;
            })}
          </ol>
          {r2.firstMove && <p className="mt-1 italic text-ink">First move — &ldquo;{r2.firstMove}&rdquo;</p>}
        </div>

        <div className="border-t border-line pt-3">
          <p className="font-semibold uppercase tracking-wide text-ash">4. Trade-off allocation</p>
          {r2.allocationTotal === 100 ? (
            <ol className="mt-1 list-decimal space-y-0.5 pl-4 text-ink">
              {r2.allocationRanked.map((f) => (
                <li key={f.id}>
                  {f.name} — {r2.allocation[f.id]}
                </li>
              ))}
            </ol>
          ) : (
            <p className="mt-1 italic text-ash">Total: {r2.allocationTotal}/100 — not yet complete.</p>
          )}
        </div>

        <div className="border-t border-line pt-3">
          <p className="font-semibold uppercase tracking-wide text-ash">5. Governance</p>
          <ul className="mt-1 space-y-0.5 text-ink">
            {ROLES.map((role) => {
              const held = r2.byRole(role.id);
              return (
                <li key={role.id}>
                  <span className="font-semibold">{role.short}</span> — {held.length === 0 ? "no responsibility assigned" : held.map((h) => h.name).join(", ")}
                </li>
              );
            })}
          </ul>
        </div>

        <div className="border-t border-line pt-3">
          <p className="font-semibold uppercase tracking-wide text-ash">6. The call now</p>
          {r2.nowDecision && <p className="mt-1 italic text-ink">Decision — &ldquo;{r2.nowDecision}&rdquo;</p>}
          {r2.riskOfWaiting && <p className="mt-1 italic text-ink">Risk of waiting — &ldquo;{r2.riskOfWaiting}&rdquo;</p>}
        </div>
      </div>
    </div>
  );
}
