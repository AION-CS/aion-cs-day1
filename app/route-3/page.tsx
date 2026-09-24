import { SectionRail } from "@/components/chrome/SectionRail";
import { PageNav } from "@/components/chrome/PageNav";
import { HashFlash } from "@/components/chrome/HashFlash";
import { SuggestedOrderBanner } from "@/components/ui/Banner";
import { MateriC } from "@/components/materi/Materi";
import { Task3 } from "@/components/task3/Task3";
import { ResetRoute } from "@/components/ui/ResetRoute";

export const metadata = { title: "Route 3 · Management decision — Retention Lab · Day 1" };

export default function Route3() {
  return (
    <div className="space-y-8 pt-4">
      <HashFlash />
      <header className="space-y-3">
        <div className="space-y-1">
          <p className="smallcaps text-accent">Route 3 · Level 3 · Management decision</p>
          <h1>Fund it anyway, and say what you left uncovered</h1>
        </div>
        <blockquote className="max-w-prose space-y-2 border-l-4 border-gold bg-accentSoft px-4 py-3 text-body text-ink">
          <p>
            Level 1 established what the file records. Level 2 showed that no offer wins on every axis. Level 3 gives you a budget that cannot fund
            everything it should, and asks you to fund it anyway — and to say, in writing, what you left uncovered.
          </p>
          <p className="font-semibold">A memo that funds everything has not used this exercise.</p>
        </blockquote>
      </header>
      <SuggestedOrderBanner
        routeKey="r3"
        text="Materi C → Task 3. Every section stays open. Task 3 quotes your Route 1 and Route 2 work, but never needs it to be finished."
      />
      <SectionRail route={3} />
      <PageNav route={3} />
      <MateriC />
      <Task3 />
      <ResetRoute route={3} />
    </div>
  );
}
