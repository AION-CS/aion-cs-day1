"use client";

import { useHydrated } from "@/lib/store";
import { scrollToAndFlash } from "@/lib/scrollToAndFlash";
import { RESPONSIBILITIES, ROLES, VERTEX, criterionById, factorLabel, optionById, relevanceLabel } from "@/lib/route2";
import { domId, type Route2State } from "./useRoute2";

/**
 * The live Board Memo preview (§8.2) — composes itself from the left column's
 * seven sections, in the exact document structure the spec fixes. Empty
 * sections render as a greyed, clickable "— not yet drafted —" placeholder
 * that opens the missing-items map by proxy: click it and it scrolls to (and
 * flashes) the input that would fill it.
 */
export function MemoPreview({ r2 }: { r2: Route2State }) {
  const hydrated = useHydrated();
  const date = hydrated ? new Date().toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" }) : "";

  const jump = (id: string) => scrollToAndFlash(id, "ref");

  const Placeholder = ({ target }: { target: string }) => (
    <button type="button" onClick={() => jump(target)} className="text-caption italic text-ash underline decoration-dotted underline-offset-2 hover:text-ink">
      — not yet drafted —
    </button>
  );

  const chosen = r2.firstMeasure ? optionById(r2.firstMeasure) : null;

  return (
    <div id={domId.memo} className="memo-doc rounded-2xl border border-line bg-paper p-5">
      <p className="text-micro font-semibold uppercase tracking-wide text-accent">Management Proposal — Connected Infrastructure Strategy</p>
      <h2 className="mt-1 font-serif text-h3 text-ink">{VERTEX.company}</h2>
      <p className="mt-1 text-micro text-ash">
        Prepared by: <span className="font-semibold text-ink">{r2.name.trim() || "[your name]"}</span> · {date || "[date]"} · Role: {VERTEX.role}
      </p>

      {/* 1. Executive summary */}
      <MemoSection n={1} title="Executive summary">
        {r2.drafted[1] ? (
          <p className="text-caption text-ink">
            {chosen ? `Recommended: ${chosen.text} ` : ""}
            {r2.relevanceRationale.trim() ? r2.relevanceRationale.trim().slice(0, 220) + (r2.relevanceRationale.trim().length > 220 ? "…" : "") : ""}
          </p>
        ) : (
          <Placeholder target={domId.relevance} />
        )}
      </MemoSection>

      {/* 2. Strategic rationale */}
      <MemoSection n={2} title="Strategic rationale">
        {r2.drafted[2] ? (
          <>
            <p className="flex flex-wrap gap-1.5">
              {r2.relevanceSelected.map((id) => (
                <span key={id} className="rounded-full border border-accent/40 bg-accentSoft px-2 py-0.5 text-micro font-semibold text-accent">
                  {relevanceLabel(id)}
                </span>
              ))}
            </p>
            <p className="mt-1.5 text-caption text-ink">{r2.relevanceRationale}</p>
          </>
        ) : (
          <Placeholder target={domId.relevance} />
        )}
      </MemoSection>

      {/* 3. Guiding decisions */}
      <MemoSection n={3} title="Guiding decisions, next 12 months">
        {r2.drafted[3] ? (
          <ol className="space-y-1">
            {r2.guidingDecisions.map((g, i) =>
              g.text.trim() ? (
                <li key={i} className="text-caption text-ink">
                  <span className="font-semibold text-accent">{i + 1}.</span> {g.text}
                  {g.owner || g.quarter ? (
                    <span className="text-ash">
                      {" "}
                      — {g.owner ? ROLES.find((r) => r.id === g.owner)?.label : "owner tbd"}, {g.quarter ?? "quarter tbd"}
                    </span>
                  ) : null}
                </li>
              ) : null,
            )}
          </ol>
        ) : (
          <Placeholder target={domId.guiding} />
        )}
      </MemoSection>

      {/* 4. Decision logic and assessment criteria */}
      <MemoSection n={4} title="Decision logic and assessment criteria">
        {r2.drafted[4] ? (
          <>
            {r2.criteriaOrder.length > 0 && (
              <ol className="space-y-0.5">
                {r2.criteriaOrder.map((id, i) => (
                  <li key={id} className="text-caption text-ink">
                    <span className="font-semibold text-accent">{i + 1}.</span> {criterionById(id).name}
                  </li>
                ))}
              </ol>
            )}
            {r2.boundary.trim() && (
              <p className="mt-1.5 text-caption text-ink">
                <span className="font-semibold">Boundary. </span>
                {r2.boundary}
              </p>
            )}
          </>
        ) : (
          <Placeholder target={domId.logic} />
        )}
      </MemoSection>

      {/* 5. Central trade-offs */}
      <MemoSection n={5} title="Central trade-offs">
        {r2.drafted[5] ? (
          <ul className="space-y-1">
            {r2.tradeOffLinks.map((l) => (
              <li key={`${l.a}-${l.b}`} className="text-caption text-ink">
                <span className="font-semibold">
                  {factorLabel(l.a)} ↔ {factorLabel(l.b)}:
                </span>{" "}
                {l.note || <span className="text-ash">note not written</span>}
              </li>
            ))}
          </ul>
        ) : (
          <Placeholder target={domId.tradeoffs} />
        )}
      </MemoSection>

      {/* 6. Recommended first measure */}
      <MemoSection n={6} title="Recommended first measure">
        {r2.drafted[6] && chosen ? (
          <div className="rounded-lg border-l-4 border-l-accent bg-accentSoft px-3 py-2">
            <p className="text-caption font-semibold text-ink">
              Option {chosen.id} — {chosen.text}
            </p>
            <p className="mt-1 text-caption text-ink">{r2.justification}</p>
            {r2.committedBudgetAnswer && (
              <p className="mt-1 text-caption text-ink">
                <span className="font-semibold">Committed budget. </span>
                {r2.committedBudgetAnswer}
              </p>
            )}
          </div>
        ) : (
          <Placeholder target={domId.measure} />
        )}
      </MemoSection>

      {/* 7. Governance */}
      <MemoSection n={7} title="Governance: roles, approval, review">
        {r2.drafted[7] ? (
          <>
            <ul className="space-y-0.5">
              {RESPONSIBILITIES.map((r) => {
                const a = ROLES.filter((role) => r2.raciValue(r.id, role.id) === "A");
                return (
                  <li key={r.id} className="flex gap-2 text-micro">
                    <span className="w-20 shrink-0 font-semibold text-ink">{a.length === 1 ? a[0].label : a.length > 1 ? "2+ Accountable" : "—"}</span>
                    <span className="text-ash">{r.label}</span>
                  </li>
                );
              })}
            </ul>
            {r2.reviewMechanism && (
              <p className="mt-1.5 text-caption text-ink">
                <span className="font-semibold">Review. </span>
                {r2.reviewMechanism}
              </p>
            )}
          </>
        ) : (
          <Placeholder target={domId.governance} />
        )}
      </MemoSection>

      {/* 8. Decision now */}
      <MemoSection n={8} title="Decision taken now under uncertainty">
        {r2.drafted[8] ? (
          <>
            <p className="text-caption font-semibold text-ink">{r2.decisionNow}</p>
            <p className="mt-1 text-micro text-ash">
              Confidence: <span className="font-semibold text-ink">{r2.confidence}/100</span>
              {r2.changeMyMind && (
                <>
                  {" "}
                  · Would change with: <span className="text-ink">{r2.changeMyMind}</span>
                </>
              )}
            </p>
          </>
        ) : (
          <Placeholder target={domId.decideNow} />
        )}
      </MemoSection>
    </div>
  );
}

function MemoSection({ n, title, children }: { n: number; title: string; children: React.ReactNode }) {
  return (
    <div id={domId.memoSection(n)} className="mt-4 border-t border-line pt-3">
      <p className="mb-1.5 text-micro font-semibold uppercase tracking-wide text-ash">
        {n}. {title}
      </p>
      {children}
    </div>
  );
}
