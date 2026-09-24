import Link from "next/link";
import { COURSE, ROUTES } from "@/lib/routes";
import { DAY_INTRO } from "@/data/dayIntro";
import { Gloss } from "@/lib/glossify";

export default function Home() {
  return (
    <div className="space-y-8 pt-6">
      <header className="space-y-2">
        <p className="smallcaps text-accent">{COURSE.module}</p>
        <h1 className="text-display">{COURSE.site}</h1>
        <p className="max-w-prose text-body text-ash">{COURSE.title}. Three routes, one per level: study on your own, work a document from a real-looking case file, and export it.</p>
      </header>

      <section aria-labelledby="today-h" className="card space-y-4 p-5">
        <div className="space-y-2">
          <h2 id="today-h" className="text-h2">
            What today is about
          </h2>
          <p className="max-w-prose text-body text-ink"><Gloss>{DAY_INTRO.about}</Gloss></p>
          <p className="max-w-prose text-body text-ink"><Gloss>{DAY_INTRO.caseLine}</Gloss></p>
        </div>
        <div className="space-y-2">
          <p className="smallcaps">One story, three steps</p>
          <ol className="grid gap-3 md:grid-cols-3">
            {DAY_INTRO.story.map((st) => {
              const r = ROUTES.find((x) => x.n === st.route)!;
              return (
                <li key={st.route}>
                  <Link href={r.href} className="block h-full space-y-1.5 rounded-lg border border-line bg-canvas p-3 transition-colors hover:border-accent">
                    <p className="smallcaps text-accent">
                      Route {st.route} · {st.verb}
                    </p>
                    <p className="text-body text-ink"><Gloss>{st.question}</Gloss></p>
                    <p className="text-caption text-ash">
                      You finish with: <strong className="text-ink">{st.output}</strong>
                    </p>
                  </Link>
                </li>
              );
            })}
          </ol>
          <p className="text-caption text-ash">
            About {Math.round(ROUTES.reduce((s, r) => s + r.plan.reduce((t, p) => t + p.minutes, 0), 0) / 60 * 2) / 2} hours in total. Each route also works on its own.
          </p>
        </div>
      </section>

      <section aria-labelledby="wiifm-h" className="card space-y-3 border-accent/40 bg-accentSoft p-5">
        <div className="space-y-1">
          <h2 id="wiifm-h" className="text-h2">
            What&apos;s in it for you
          </h2>
          <p className="max-w-prose text-body text-ink">
            Why this is worth your day, whatever your role: each skill below is one you can use at work next week, not only in this case.
          </p>
        </div>
        <ul className="grid gap-3 md:grid-cols-2">
          {DAY_INTRO.wiifm.map((w) => (
            <li key={w.skill} className="space-y-1 rounded-lg border border-line bg-paper p-3">
              <p className="flex flex-wrap items-baseline justify-between gap-x-2">
                <span className="font-semibold text-ink">{w.skill}</span>
                <span className="text-micro font-semibold uppercase text-ash">Route {w.route}</span>
              </p>
              <p className="text-caption text-ink"><Gloss>{w.payoff}</Gloss></p>
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="routes-h" className="space-y-3">
        <h2 id="routes-h" className="sr-only">
          Routes
        </h2>
        <div className="grid gap-4 md:grid-cols-3">
          {ROUTES.map((r) => (
            <Link key={r.n} href={r.href} className="card group block space-y-3 p-5 transition-shadow hover:shadow-md">
              <div className="flex flex-wrap items-baseline justify-between gap-x-3">
                <span className="smallcaps text-accent">Route {r.n}</span>
                <span className="text-micro font-semibold uppercase text-ash">{r.level}</span>
              </div>
              <h3 className="text-h2">{r.title}</h3>
              <p className="text-caption text-ash">{r.blurb}</p>
              {r.built ? (
                <table className="w-full text-caption">
                  <caption className="sr-only">Time plan for Route {r.n}</caption>
                  <tbody>
                    {r.plan.map((p) => (
                      <tr key={p.label} className="border-t border-line">
                        <td className="py-1.5">{p.label}</td>
                        <td className="tnum py-1.5 text-right text-ash">{p.minutes} min</td>
                      </tr>
                    ))}
                    <tr className="border-t-2 border-ink font-semibold">
                      <td className="py-1.5">Total</td>
                      <td className="tnum py-1.5 text-right">{r.plan.reduce((s, p) => s + p.minutes, 0)} min</td>
                    </tr>
                  </tbody>
                </table>
              ) : (
                <p className="rounded-md bg-mist px-3 py-2 text-caption text-ash">Not built yet. The page opens and holds a placeholder.</p>
              )}
              <span className="inline-block text-caption font-semibold text-accent group-hover:underline">Open Route {r.n} →</span>
            </Link>
          ))}
        </div>
      </section>

      <section aria-labelledby="how-h" className="card space-y-2 p-5">
        <h2 id="how-h" className="text-h3">
          How this site works
        </h2>
        <ol className="list-decimal space-y-1 pl-5 text-body">
          <li>Study, then task, then export: each level ends as a working document, not a quiz score.</li>
          <li>Nothing is locked. Every section and route stays open, and a suggested order is only a suggestion.</li>
          <li>The app shows consequences, not verdicts. It marks something only when you press a Check button, and then it gives a question, not the answer.</li>
        </ol>
      </section>
    </div>
  );
}
