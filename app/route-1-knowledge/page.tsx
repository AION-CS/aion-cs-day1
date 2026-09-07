import type { Metadata } from "next";
import { ROUTES } from "@/lib/routes";
import { LeafMark } from "@/components/chrome/Icons";
import { Material } from "@/components/route1/Material";
import { TaskFlow } from "@/components/route1/TaskFlow";
import { MentorTools } from "@/components/route1/MentorTools";

const ROUTE = ROUTES[0];

export const metadata: Metadata = {
  title: `AION Green IT — ${ROUTE.tag}`,
};

export default function Route1Page() {
  return (
    <div className="space-y-16 py-12">
      <MentorTools />
      <div className="max-w-prose">
        <p className="mb-2 flex items-center gap-2 text-micro font-semibold uppercase tracking-wide text-accent">
          <LeafMark className="h-4 w-4" /> {ROUTE.tag} — 1 of 3
        </p>
        <h1 className="text-display text-ink">Route 1 · Knowledge — Is the Cloud Really Sustainable?</h1>
        <p className="mt-4 text-body text-ash">
          Before you touch a single case study, you need one mental model: cloud computing is not automatically
          green. It can be more efficient than your own data center — or it can quietly become a bigger energy and
          cost problem than what it replaced. In the next hour, you'll build the framework to tell the difference.
          Then you'll apply it to a real company situation in Task 1.
        </p>
      </div>

      <hr className="border-line" />

      <Material />

      <div className="rounded-2xl border border-accent/30 bg-accentSoft p-6 text-center">
        <p className="text-body font-semibold text-ink">You've built the framework. Time to apply it.</p>
        <a href="#task" className="btn-accent mt-3 inline-flex">
          Start the Flexora Cloud Decision Audit
        </a>
      </div>

      <TaskFlow />
    </div>
  );
}
