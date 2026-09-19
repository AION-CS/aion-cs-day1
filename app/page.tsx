"use client";

import Link from "next/link";
import { CASE, ROUTES, levelLabel } from "@/lib/routes";
import { useRouteUnlocked } from "@/lib/routeGating";
import { LeafMark } from "@/components/chrome/Icons";
import { ArrowRight, Lock } from "@/components/icons/LineIcons";

export default function DayLanding() {
  const unlockedByN: Record<number, boolean> = {
    1: useRouteUnlocked(1),
    2: useRouteUnlocked(2),
  };

  return (
    <div className="py-12">
      {/* Hero */}
      <div className="max-w-prose">
        <p className="mb-2 flex items-center gap-2 text-micro font-semibold uppercase tracking-wide text-accent">
          <LeafMark className="h-4 w-4" />
          {CASE.module}
        </p>
        <h1 className="text-display text-ink">{CASE.moduleTitle}</h1>
        <p className="mt-4 text-body text-ash">
          Module 11. New technology is not automatically sustainable technology. AI can cut energy and add compute at
          the same time; a circular model can be exactly the right direction and still be hard to run; and an
          initiative can be genuinely exciting while reducing nothing at all. Route 1 is deliberately short on reading
          and long on doing: nine micro-cards give you the vocabulary and the decision rules, and you apply them
          twice on FutureGrid Technologies — first diagnosing six planned initiatives one by one, then stepping up to
          prioritise whole lines of measures under a limited budget and incomplete data. Route 2 steps up again: at
          NovaCircular Technologies you connect six building blocks into one decision architecture and turn it into a
          management proposal, including the one decision to make now despite incomplete information.
        </p>
      </div>

      {/* Route cards */}
      <div className="mt-10 grid gap-5 lg:grid-cols-2">
        {ROUTES.map((rt) => {
          const reachable = rt.available;
          const recommendedFirst = reachable && rt.n > 1 && !unlockedByN[rt.n];

          const inner = (
            <>
              <div className="flex items-center justify-between">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-ink text-readout font-semibold text-paper">
                  {rt.n}
                </span>
                <div className="flex items-center gap-2">
                  <span className="rounded-full border border-line px-2.5 py-1 text-micro font-semibold uppercase tracking-wide text-ash">
                    {levelLabel(rt.levels)} · ~{rt.minutes} min
                  </span>
                  {reachable ? (
                    <span className="rounded-full bg-accentSoft px-2.5 py-1 text-micro font-semibold uppercase tracking-wide text-accent">
                      Available
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 rounded-full border border-line px-2.5 py-1 text-micro font-semibold uppercase tracking-wide text-ash">
                      <Lock className="h-3.5 w-3.5" /> Not built
                    </span>
                  )}
                </div>
              </div>

              <p className="mt-4 text-micro font-semibold uppercase tracking-wide text-ash">
                {rt.tag}
              </p>
              <h2 className="mt-1 text-h2 text-ink">{rt.cardTitle}</h2>
              <p className="mt-2 flex-1 text-body text-ash">{rt.cardBlurb}</p>

              {recommendedFirst && (
                <p className="mt-2 text-micro text-ash">
                  Recommended: finish Route {rt.n - 1} first — you can still open this anytime.
                </p>
              )}

              <div className="mt-5 flex items-center justify-between border-t border-line pt-4">
                <span className="text-caption text-ash">
                  Deliverable:{" "}
                  <span className="font-semibold text-ink">{rt.deliverable}</span>
                </span>
                {reachable ? (
                  <span className="inline-flex items-center gap-1.5 text-caption font-semibold text-accent">
                    Open <ArrowRight className="h-4 w-4" />
                  </span>
                ) : (
                  <span className="text-caption text-ash">Not yet</span>
                )}
              </div>
            </>
          );

          const cls = "flex h-full flex-col rounded-2xl border bg-paper p-6 shadow-sm";

          return reachable ? (
            <Link
              key={rt.slug}
              href={rt.href}
              className={`${cls} border-line transition-all duration-150 hover:-translate-y-0.5 hover:border-accent hover:shadow-md`}
            >
              {inner}
            </Link>
          ) : (
            <div key={rt.slug} className={`${cls} border-dashed border-line opacity-80`}>
              {inner}
            </div>
          );
        })}
      </div>
    </div>
  );
}
