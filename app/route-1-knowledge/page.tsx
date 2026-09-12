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
        <h1 className="text-display text-ink">Route 1 · Knowledge — Why Keeping a Laptop Beats Buying a Greener One</h1>
        <p className="mt-4 text-body text-ash">
          Around 80% of a business laptop&apos;s lifetime carbon is spent before anyone switches it on. That single fact
          decides which green-workplace measures actually matter and which ones only look busy. In the next few minutes
          you&apos;ll build the argument — the carbon maths, the gap between what hardware can do and what policy
          permits, and the honest counter-arguments — then walk a real-feeling office and find where that gap is costing
          money.
        </p>
      </div>

      <hr className="border-line" />

      <Material />

      <div className="rounded-2xl border border-accent/30 bg-accentSoft p-6 text-center">
        <p className="text-body font-semibold text-ink">You have the argument. Now go find the evidence.</p>
        <a href="#task" className="btn-accent mt-3 inline-flex">
          Start the UrbanByte walkthrough
        </a>
      </div>

      <TaskFlow />
    </div>
  );
}
