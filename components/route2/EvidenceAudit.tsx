"use client";

import clsx from "clsx";
import { useProgress } from "@/lib/store";
import {
  R2,
  EVIDENCE_CARDS,
  CONFIDENCE_OPTIONS,
  RELEVANCE_OPTIONS,
  STANCES,
  CONTRADICTION,
  CONFIDENCE_KEY_SUMMARY,
  STANCE_ANSWER_KEY,
} from "@/lib/route2";
import { useRoute2 } from "./useRoute2";
import { ClueToggle } from "@/components/ui/ClueToggle";
import { AnswerKey, AnswerKeyNote } from "@/components/ui/AnswerKey";
import { Info } from "@/components/icons/LineIcons";

/**
 * Stage 1 — the evidence dossier. A card's rating controls stay locked until the
 * learner has turned it over and seen where the finding came from: the whole
 * point is that confidence is a judgement about method, not about the headline.
 */
export function EvidenceAudit() {
  const r2 = useRoute2();
  const markSeen = useProgress((s) => s.markSeen);
  const choose = useProgress((s) => s.choose);

  return (
    <div>
      <div className="flex flex-wrap items-baseline justify-between gap-3">
        <p className="text-caption text-ash">
          Turn each card over before you rate it — the source and method are the reason for the rating.
        </p>
        <p className="text-caption tabular-nums text-ash">
          Audited: <span className="font-semibold text-ink">{r2.auditedCount}</span> / {EVIDENCE_CARDS.length}
        </p>
      </div>

      <div className="mt-2 flex flex-wrap gap-2 rounded-xl border border-line bg-canvas px-4 py-2.5 text-caption text-ash">
        <span>Evidence confidence index:</span>
        <span>
          <span className="font-semibold tabular-nums text-ink">{r2.confidenceIndex.verified}</span> verified
        </span>
        <span>·</span>
        <span>
          <span className="font-semibold tabular-nums text-ink">{r2.confidenceIndex.partial}</span> partial
        </span>
        <span>·</span>
        <span>
          <span className="font-semibold tabular-nums text-ink">{r2.confidenceIndex.assumed}</span> assumed
        </span>
      </div>

      <div className="mt-4 grid gap-3 lg:grid-cols-2">
        {EVIDENCE_CARDS.map((card) => {
          const isFlipped = r2.flipped.includes(card.id);
          const conf = r2.confidence[card.id];
          const rel = r2.relevance[card.id];
          const rated = conf && rel;

          return (
            <div
              key={card.id}
              className={clsx(
                "rounded-2xl border p-4 transition-colors duration-200",
                rated ? "border-accent/40 bg-accentSoft/25" : isFlipped ? "border-line bg-paper" : "border-dashed border-line bg-canvas",
              )}
            >
              <div className="flex items-start gap-2.5">
                <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-mist text-micro font-semibold text-ash">
                  {card.n}
                </span>
                <p className="flex-1 text-caption text-ink">{card.finding}</p>
              </div>

              {!isFlipped ? (
                <button
                  type="button"
                  onClick={() => markSeen(R2.flipped, card.id)}
                  className="mt-3 w-full rounded-xl border border-dashed border-line bg-paper px-3 py-2.5 text-micro font-semibold text-ash transition-colors duration-150 hover:border-accent hover:text-accent"
                >
                  Source, date and method hidden — turn the card over
                </button>
              ) : (
                <dl className="reveal-in mt-3 space-y-1 rounded-xl border border-line bg-canvas p-3 text-micro">
                  <div className="flex gap-2">
                    <dt className="w-14 shrink-0 font-semibold text-ash">Source</dt>
                    <dd className="text-ink">{card.source}</dd>
                  </div>
                  <div className="flex gap-2">
                    <dt className="w-14 shrink-0 font-semibold text-ash">Date</dt>
                    <dd className="text-ink">{card.date}</dd>
                  </div>
                  <div className="flex gap-2">
                    <dt className="w-14 shrink-0 font-semibold text-ash">Method</dt>
                    <dd className="text-ink">{card.method}</dd>
                  </div>
                </dl>
              )}

              <div className={clsx("mt-3", !isFlipped && "pointer-events-none opacity-40")}>
                <p className="text-micro font-semibold text-ink">How far do you trust it?</p>
                <p className="mt-0.5 text-micro text-ash">Rate the method, not the headline.</p>
                <div className="mt-1.5 flex flex-wrap gap-1.5">
                  {CONFIDENCE_OPTIONS.map((o) => (
                    <button
                      key={o.id}
                      type="button"
                      disabled={!isFlipped}
                      onClick={() => choose(R2.stage1.confidence(card.id), o.id)}
                      aria-pressed={conf === o.id}
                      className={clsx(
                        "rounded-full border px-2.5 py-1 text-micro font-medium transition-colors duration-150",
                        conf === o.id ? "border-accent bg-accent text-paper" : "border-line bg-paper text-ash hover:border-ash hover:text-ink",
                      )}
                    >
                      {o.label}
                    </button>
                  ))}
                </div>

                <p className="mt-2.5 text-micro font-semibold text-ink">Would it change your ranking?</p>
                <p className="mt-0.5 text-micro text-ash">Decision-relevance, not general interest.</p>
                <div className="mt-1.5 flex flex-wrap gap-1.5">
                  {RELEVANCE_OPTIONS.map((o) => (
                    <button
                      key={o.id}
                      type="button"
                      disabled={!isFlipped}
                      onClick={() => choose(R2.stage1.relevance(card.id), o.id)}
                      aria-pressed={rel === o.id}
                      className={clsx(
                        "rounded-full border px-2.5 py-1 text-micro font-medium transition-colors duration-150",
                        rel === o.id ? "border-accent bg-accent text-paper" : "border-line bg-paper text-ash hover:border-ash hover:text-ink",
                      )}
                    >
                      {o.label}
                    </button>
                  ))}
                </div>

                {isFlipped && <ClueToggle clue={card.clue} />}
              </div>
            </div>
          );
        })}
      </div>

      <AnswerKeyNote label="Model confidence and relevance tagging" text={CONFIDENCE_KEY_SUMMARY} />

      {r2.contradictionDue && (
        <div id="r2-contradiction" className="reveal-in mt-5 scroll-mt-24 rounded-2xl border-2 border-warn/50 bg-warn/5 p-5">
          <div className="flex items-start gap-3">
            <Info className="mt-0.5 h-4 w-4 shrink-0 text-warn" />
            <div>
              <p className="text-caption font-semibold text-warn">{CONTRADICTION.heading}</p>
              <p className="mt-1 text-caption text-ink">{CONTRADICTION.body}</p>
            </div>
          </div>
          <div className="mt-3 grid gap-2">
            {STANCES.map((s) => (
              <button
                key={s.id}
                type="button"
                onClick={() => choose(R2.stage1.stance, s.id)}
                aria-pressed={r2.stance === s.id}
                className={clsx(
                  "rounded-xl border p-3 text-left text-caption transition-colors duration-150",
                  r2.stance === s.id ? "border-accent bg-accentSoft text-ink" : "border-line bg-paper text-ash hover:border-ash hover:text-ink",
                )}
              >
                {s.label}
              </button>
            ))}
          </div>
          <ClueToggle clue={CONTRADICTION.clue} />
          <AnswerKey block={STANCE_ANSWER_KEY} />
        </div>
      )}
    </div>
  );
}
