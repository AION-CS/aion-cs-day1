"use client";

import { SOFTPULSE } from "@/lib/route2";
import { Icon } from "@/components/icons/LineIcons";

/**
 * Section D's worked example, rendered as its own bordered block so it reads as
 * a case walkthrough rather than more body copy. Section B's RACI legend and
 * Section C's backdrop strip live here too.
 */

export function WorkedExample() {
  return (
    <article className="overflow-hidden rounded-2xl border-2 border-ink bg-canvas">
      {/* Banner — deliberately the dark surface, so it cannot be mistaken for learner content */}
      <header className="bg-slate px-5 py-3 text-paper">
        <p className="text-micro font-semibold uppercase tracking-wide text-paper/70">
          Worked example · read-only
        </p>
        <p className="text-h3 text-paper">{SOFTPULSE.company}</p>
      </header>

      <div className="space-y-5 p-5">
        <section>
          <p className="text-micro font-semibold uppercase tracking-wide text-ash">The situation</p>
          <p className="mt-1 text-body text-ink">{SOFTPULSE.situation}</p>
        </section>

        <section>
          <p className="text-micro font-semibold uppercase tracking-wide text-ash">Initial position</p>
          <ul className="mt-2 grid gap-1.5 sm:grid-cols-2">
            {SOFTPULSE.initialPosition.map((p) => (
              <li key={p} className="flex gap-2 rounded-lg border border-line bg-paper px-3 py-2">
                <span className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full bg-ash" />
                <span className="text-caption text-ink">{p}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* The move the whole case turns on */}
        <section className="rounded-xl border border-accent/40 bg-accentSoft p-4">
          <p className="text-micro font-semibold uppercase tracking-wide text-accent">
            {SOFTPULSE.reframe.heading}
          </p>
          <p className="mt-1.5 text-body text-ink">{SOFTPULSE.reframe.body}</p>
        </section>

        <section>
          <p className="text-micro font-semibold uppercase tracking-wide text-ash">
            The four levers that fall out of it
          </p>
          <ol className="mt-2 space-y-1.5">
            {SOFTPULSE.levers.map((l) => (
              <li key={l.n} className="flex gap-3 rounded-lg border border-line bg-paper px-3 py-2">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-ink text-micro font-bold tabular-nums text-paper">
                  {l.n}
                </span>
                <span className="text-caption text-ink">{l.text}</span>
              </li>
            ))}
          </ol>
        </section>

        <section className="rounded-xl border border-warn/40 bg-warn/5 p-4">
          <p className="text-micro font-semibold uppercase tracking-wide text-warn">
            {SOFTPULSE.prioritised.heading}
          </p>
          <p className="mt-1.5 text-body text-ink">{SOFTPULSE.prioritised.body}</p>

          <p className="mt-3 text-micro font-semibold uppercase tracking-wide text-warn">
            {SOFTPULSE.whyFirst.heading}
          </p>
          <ul className="mt-1.5 space-y-1">
            {SOFTPULSE.whyFirst.points.map((p) => (
              <li key={p} className="flex gap-2 text-caption text-ink">
                <span className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full bg-warn" />
                <span>{p}</span>
              </li>
            ))}
          </ul>
        </section>

        <section>
          <p className="text-micro font-semibold uppercase tracking-wide text-ash">
            The four levers, sorted by time horizon
          </p>
          <div className="mt-2 grid gap-3 md:grid-cols-3">
            {SOFTPULSE.horizons.map((h) => (
              <div key={h.id} className="rounded-xl border border-line bg-paper p-3">
                <p className="text-caption font-semibold text-accent">{h.label}</p>
                <ul className="mt-1.5 space-y-1">
                  {h.items.map((it) => (
                    <li key={it} className="flex gap-2 text-micro text-ash">
                      <span className="mt-[6px] h-1 w-1 shrink-0 rounded-full bg-accent" />
                      <span>{it}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        <section className="border-t border-line pt-4">
          <p className="text-caption italic text-ash">{SOFTPULSE.closing}</p>
        </section>
      </div>
    </article>
  );
}

/** Section B — the four RACI roles, with the one structural rule called out. */
export function RaciLegend() {
  const rows = [
    { id: "R", name: "Responsible", body: "Does the work. Can be several people." },
    {
      id: "A",
      name: "Accountable",
      body: "Answers for the outcome. Exactly one — never zero, never more than one. This is the rule that fails most often.",
      warn: true,
    },
    { id: "C", name: "Consulted", body: "Input sought before the decision. Two-way, and every addition costs decision latency." },
    { id: "I", name: "Informed", body: "Kept updated afterwards. One-way; no input expected." },
  ];

  return (
    <div className="space-y-3">
      <ul className="grid gap-2 sm:grid-cols-2">
        {rows.map((r) => (
          <li
            key={r.id}
            className={
              r.warn
                ? "rounded-xl border border-warn/40 bg-warn/5 p-4"
                : "rounded-xl border border-line bg-paper p-4"
            }
          >
            <p className="flex items-baseline gap-2">
              <span
                className={
                  r.warn
                    ? "flex h-7 w-7 items-center justify-center rounded-lg bg-warn text-caption font-bold text-paper"
                    : "flex h-7 w-7 items-center justify-center rounded-lg bg-ink text-caption font-bold text-paper"
                }
              >
                {r.id}
              </span>
              <span className="text-h3 text-ink">{r.name}</span>
            </p>
            <p className="mt-1.5 text-caption text-ash">{r.body}</p>
          </li>
        ))}
      </ul>
      <div className="rounded-xl border border-line bg-canvas p-4">
        <p className="text-micro font-semibold uppercase tracking-wide text-ash">
          The two failure modes
        </p>
        <p className="mt-1 text-caption text-ash">
          <span className="font-semibold text-ink">Zero Accountable:</span> the policy exists, everyone
          agrees with it, and nobody&apos;s performance conversation ever mentions it.{" "}
          <span className="font-semibold text-ink">Two Accountable:</span> both quietly assume the other
          owns it — which fails the same way but is harder to see, because on paper it looks covered.
        </p>
      </div>
    </div>
  );
}

/** Section C — the three external forces, as a strip. */
export function BackdropStrip() {
  const items = [
    {
      icon: "gavel" as const,
      kicker: "Regulatory",
      title: "CSRD / ESRS E1",
      body: "Cloud services and software's operational footprint run through Scope 3. Inefficient software becomes a line a board has to explain in a disclosure, not just a cost it can absorb.",
      tone: "plain" as const,
    },
    {
      icon: "certificate" as const,
      kicker: "Professional",
      title: "iSAQB CPSA — Module GREEN",
      body: "Applying GSF patterns, quantifying data-centre and hardware efficiency, and evaluating cloud providers on ecological criteria are already examinable architect competencies at Advanced Level.",
      tone: "accent" as const,
    },
    {
      icon: "link" as const,
      kicker: "Cautionary",
      title: "The SOFT framework",
      body: "Co-chaired by HSBC and Microsoft. It exists because sustainability pilots succeed technically and then stay trapped inside IT — never scaling into procurement or operations, because no governance structure connected them.",
      tone: "warn" as const,
    },
  ];

  return (
    <ul className="grid gap-3 md:grid-cols-3">
      {items.map((i) => (
        <li
          key={i.title}
          className={
            i.tone === "warn"
              ? "flex flex-col rounded-2xl border border-warn/40 bg-warn/5 p-4"
              : i.tone === "accent"
                ? "flex flex-col rounded-2xl border border-accent/35 bg-accentSoft p-4"
                : "flex flex-col rounded-2xl border border-line bg-paper p-4"
          }
        >
          <span
            className={
              i.tone === "warn"
                ? "flex h-9 w-9 items-center justify-center rounded-xl bg-warn/15 text-warn"
                : "flex h-9 w-9 items-center justify-center rounded-xl bg-accentSoft text-accent"
            }
          >
            <Icon name={i.icon} className="h-4.5 w-4.5" />
          </span>
          <p className="mt-2.5 text-micro font-semibold uppercase tracking-wide text-ash">{i.kicker}</p>
          <p className="text-h3 text-ink">{i.title}</p>
          <p className="mt-1.5 flex-1 text-caption text-ash">{i.body}</p>
        </li>
      ))}
    </ul>
  );
}

/** Section A — the tension a CTO is actually holding. */
export function BoardTension() {
  return (
    <div className="grid gap-3 md:grid-cols-2">
      <div className="rounded-2xl border border-line bg-paper p-4">
        <p className="text-micro font-semibold uppercase tracking-wide text-ash">Pulling one way</p>
        <p className="mt-1.5 text-caption text-ink">
          High release pressure and a growing user base. Every available hour argues for features.
        </p>
      </div>
      <div className="rounded-2xl border border-line bg-paper p-4">
        <p className="text-micro font-semibold uppercase tracking-wide text-ash">Pulling the other</p>
        <p className="mt-1.5 text-caption text-ink">
          Operating cost climbing quarter on quarter, with no current transparency on where it comes from.
        </p>
      </div>
      <div className="rounded-2xl border border-danger/35 bg-danger/5 p-4 md:col-span-2">
        <p className="text-micro font-semibold uppercase tracking-wide text-danger">
          The risk running underneath both
        </p>
        <p className="mt-1.5 text-caption text-ink">
          That &ldquo;green coding&rdquo; is adopted as a slogan — announced in an all-hands, printed in a
          values deck — with no binding mechanism behind it and nothing measurably different twelve months
          later.
        </p>
      </div>
    </div>
  );
}
