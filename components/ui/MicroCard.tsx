import type { MicroCard as MicroCardData } from "@/lib/materialSection";
import { Icon } from "@/components/icons/LineIcons";
import { Reveal } from "@/components/ui/Reveal";

/**
 * One material micro-card, in the order the day standard fixes: heading → the
 * diagram → the written explanation → the decision rules → sources.
 *
 * The diagram comes before the prose deliberately. On a "read less, do more"
 * day it is the primary teaching artifact, and the sentences beside it are
 * there to name what the learner has just made the diagram do — not the other
 * way round.
 */
export function MicroCard({
  card,
  anchorId,
  children,
}: {
  card: MicroCardData;
  /** DOM id the mini-nav and MaterialRefs chips scroll to. */
  anchorId: string;
  /** The card's live diagram and its micro-interaction. */
  children: React.ReactNode;
}) {
  return (
    <Reveal as="section" id={anchorId} className="scroll-mt-24">
      <div className="card space-y-4 p-5 md:p-6">
        {/* Heading */}
        <div className="flex items-start gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-accentSoft text-accent">
            <Icon name={card.icon} className="h-5 w-5" />
          </span>
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
              <p className="text-micro font-semibold uppercase tracking-wide text-accent">
                {card.code} · Card {card.n} of 5
              </p>
              <span className="rounded-full border border-line px-2 py-0.5 text-micro text-ash">
                ~{card.minutes} min
              </span>
            </div>
            <h2 className="text-h2 text-ink">{card.title}</h2>
            <p className="mt-1 max-w-prose text-body text-ash">{card.standfirst}</p>
          </div>
        </div>

        {/* The diagram — the primary teaching artifact */}
        <div className="overflow-hidden rounded-2xl border border-line bg-canvas p-4 md:p-5">
          {children}
        </div>

        {/* The written explanation — deliberately short */}
        <div className="max-w-prose space-y-2 text-body text-ash">
          {card.sentences.map((s, i) => (
            <p key={i}>{s}</p>
          ))}
        </div>

        {/* Decision rules — what makes the card operational in the task */}
        {card.reasoning.length > 0 && (
          <div className="rounded-2xl border-y border-r border-l-4 border-accent/25 border-l-accent bg-accentSoft/50 p-4">
            <p className="text-micro font-semibold uppercase tracking-wide text-accent">
              How to decide when this comes up in the task
            </p>
            <ul className="mt-2 space-y-1.5">
              {card.reasoning.map((rule, i) => (
                <li key={i} className="flex gap-2 text-caption text-ink">
                  <span className="mt-[6px] h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                  <span>{rule}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Sources — small tags, never a paragraph */}
        {card.sources.length > 0 && (
          <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1 border-t border-line pt-3">
            <p className="text-micro font-semibold uppercase tracking-wide text-ash">Source</p>
            {card.sources.map((s) => (
              <span key={s.label} className="text-micro text-ash">
                <span className="font-semibold text-ink">{s.label}</span>
                {s.detail ? ` — ${s.detail}` : ""}
              </span>
            ))}
          </div>
        )}
      </div>
    </Reveal>
  );
}
