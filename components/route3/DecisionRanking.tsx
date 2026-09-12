"use client";

import clsx from "clsx";
import { useProgress } from "@/lib/store";
import {
  RANK_ANSWER_KEY,
  RANK_SLOTS,
  R3,
  TASK3,
  materialRefs,
  shuffledDecisions,
} from "@/lib/route3";
import { AnswerKey } from "@/components/ui/AnswerKey";
import { MaterialRefs } from "@/components/ui/MaterialRefs";
import { Close } from "@/components/icons/LineIcons";
import { useRoute3, domId } from "./useRoute3";

/**
 * Step 1 — pick and rank the top three guiding decisions.
 *
 * Card order is shuffled deterministically (see `shuffledDecisions`): a
 * per-render random order would break hydration in a static export, and a
 * stable order lets a mentor refer to a card's position in front of a cohort.
 */
export function DecisionRanking() {
  const r3 = useRoute3();
  const markSeen = useProgress((s) => s.markSeen);
  const setNote = useProgress((s) => s.setNote);
  const resetSection = useProgress((s) => s.resetSection);

  const cards = shuffledDecisions();
  const rank = (id: string) => r3.ranking.indexOf(id);

  /**
   * markSeen appends unique ids in insertion order, which is exactly a ranked
   * list — but it has no remove. To drop one entry we clear the bucket and
   * re-append what is left, preserving the order of the survivors.
   */
  const setRanking = (next: string[]) => {
    resetSection(R3.ranking);
    for (const id of next.slice(0, RANK_SLOTS)) markSeen(R3.ranking, id);
  };

  const toggle = (id: string) => {
    if (rank(id) >= 0) {
      setRanking(r3.ranking.filter((x) => x !== id));
      return;
    }
    if (r3.ranking.length >= RANK_SLOTS) return;
    markSeen(R3.ranking, id);
  };

  const move = (id: string, dir: -1 | 1) => {
    const list = [...r3.ranking];
    const i = list.indexOf(id);
    const j = i + dir;
    if (i < 0 || j < 0 || j >= list.length) return;
    [list[i], list[j]] = [list[j], list[i]];
    setRanking(list);
  };

  const full = r3.ranking.length >= RANK_SLOTS;

  return (
    <section id={domId.rank} className="scroll-mt-24 rounded-2xl border border-line bg-paper p-5">
      <p className="text-micro font-semibold uppercase tracking-wide text-accent">Step 1 · Rank</p>
      <h3 className="text-h3 text-ink">{TASK3.rank.heading}</h3>
      <p className="mt-1 max-w-prose text-caption text-ash">{TASK3.rank.instruction}</p>
      <MaterialRefs refs={materialRefs(["worked", "board"])} />

      {/* The six candidates */}
      <ul className="mt-4 grid gap-2 lg:grid-cols-2">
        {cards.map((d) => {
          const r = rank(d.id);
          const picked = r >= 0;
          return (
            <li key={d.id}>
              <button
                type="button"
                aria-pressed={picked}
                onClick={() => toggle(d.id)}
                disabled={false}
                className={clsx(
                  "flex h-full w-full items-start gap-3 rounded-xl border p-3 text-left transition-colors duration-150",
                  picked
                    ? "border-accent bg-accentSoft"
                    : full
                      ? "border-line bg-canvas hover:border-ash"
                      : "border-line bg-paper hover:border-accent",
                )}
              >
                <span
                  className={clsx(
                    "flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-caption font-bold",
                    picked ? "bg-accent text-paper" : "bg-mist text-ink",
                  )}
                >
                  {picked ? r + 1 : d.id}
                </span>
                <span className={clsx("text-caption", picked ? "text-ink" : "text-ash")}>{d.text}</span>
              </button>
            </li>
          );
        })}
      </ul>

      {full && (
        <p className="mt-2 text-micro text-ash">
          All three slots filled. Click a ranked card to free its slot, or reorder below.
        </p>
      )}

      {/* The ranked shortlist */}
      <div className="mt-4 rounded-xl border border-line bg-canvas p-3">
        <p className="text-micro font-semibold uppercase tracking-wide text-ash">
          Your ranking ({r3.ranking.length} of {RANK_SLOTS})
        </p>
        {r3.rankedDecisions.length === 0 ? (
          <p className="mt-2 text-caption text-ash">Nothing ranked yet — click a card above.</p>
        ) : (
          <ol className="mt-2 space-y-1.5">
            {r3.rankedDecisions.map((d, i) => (
              <li
                key={d.id}
                className="flex items-center gap-2 rounded-lg border border-accent/35 bg-accentSoft px-2.5 py-2"
              >
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-accent text-micro font-bold tabular-nums text-paper">
                  {i + 1}
                </span>
                <span className="min-w-0 flex-1 text-micro font-semibold text-ink">
                  {d.id}. {d.text}
                </span>
                <span className="flex shrink-0 items-center gap-0.5">
                  <button
                    type="button"
                    onClick={() => move(d.id, -1)}
                    aria-label={`Move ${d.id} up`}
                    className="rounded px-1 text-caption text-ash hover:text-ink"
                  >
                    ↑
                  </button>
                  <button
                    type="button"
                    onClick={() => move(d.id, 1)}
                    aria-label={`Move ${d.id} down`}
                    className="rounded px-1 text-caption text-ash hover:text-ink"
                  >
                    ↓
                  </button>
                  <button
                    type="button"
                    onClick={() => toggle(d.id)}
                    aria-label={`Remove ${d.id} from the ranking`}
                    className="ml-0.5 text-ash hover:text-danger"
                  >
                    <Close className="h-3.5 w-3.5" />
                  </button>
                </span>
              </li>
            ))}
          </ol>
        )}
      </div>

      <AnswerKey block={RANK_ANSWER_KEY} />

      {/* Rationale for #1 */}
      <div id={domId.rankRationale} className="mt-5 scroll-mt-24">
        <label htmlFor="r3-rank-why-field" className="block text-caption font-semibold text-ink">
          {TASK3.rank.rationale.label}
        </label>
        <p className="mt-0.5 text-micro text-ash">{TASK3.rank.rationale.instruction}</p>
        {r3.rankedDecisions[0] && (
          <p className="mt-1.5 rounded-lg border border-accent/30 bg-accentSoft px-2.5 py-1.5 text-micro text-ink">
            Your #1: <span className="font-semibold">{r3.rankedDecisions[0].text}</span>
          </p>
        )}
        <textarea
          id="r3-rank-why-field"
          rows={3}
          value={r3.rankRationale}
          placeholder={TASK3.rank.rationale.placeholder}
          onChange={(e) => setNote(R3.rankRationale, e.target.value)}
          className="mt-2 w-full rounded-xl border border-line bg-paper px-3 py-2.5 text-caption text-ink"
        />
      </div>
    </section>
  );
}
