"use client";

import { useProgress } from "@/lib/store";
import { R3, HELIX, PROPOSAL_ROLES, TRADEOFF_COUNT, GUIDING_DECISION_COUNT, TASK3 } from "@/lib/route3";
import { useRoute3 } from "./useRoute3";
import { DecisionArchitectureModel } from "./DecisionArchitectureModel";

/** Stage 6 — the seven-section executive proposal scaffold for Helix Digital Platforms. */
export function HelixProposalBuilder() {
  const r3 = useRoute3();
  const setNote = useProgress((s) => s.setNote);

  return (
    <div className="space-y-6">
      <div className="card p-5">
        <p className="text-micro font-semibold uppercase tracking-wide text-ash">Case brief</p>
        <h3 className="mt-1 text-h3 text-ink">{HELIX.company}</h3>
        <ul className="mt-2 space-y-1 text-caption text-ash">
          {HELIX.conditions.map((c, i) => (
            <li key={i} className="flex gap-2">
              <span className="tabular-nums text-ash">{i + 1}.</span>
              <span>{c}</span>
            </li>
          ))}
        </ul>
      </div>

      <div id="r3-stage6-relevance" className="card p-5">
        <span className="text-caption font-semibold text-ink">1. Strategic Relevance</span>
        <p className="text-micro text-ash">Complete the sentence in your own words.</p>
        <p className="mt-1 text-caption italic text-ash">"{TASK3.stage6.s1Starter} ___"</p>
        <textarea
          value={r3.strategicRelevance}
          onChange={(e) => setNote(R3.s6.strategicRelevance, e.target.value)}
          rows={3}
          className="mt-1.5 w-full rounded-xl border border-line bg-paper px-3 py-2 text-body text-ink"
        />
      </div>

      <div className="card p-5">
        <span className="text-caption font-semibold text-ink">2. Three Guiding Decisions (Next 12 Months)</span>
        <p className="text-micro text-ash">Each a short, concrete decision statement.</p>
        <div className="mt-2 space-y-2">
          {Array.from({ length: GUIDING_DECISION_COUNT }).map((_, i) => (
            <label key={i} id={`r3-stage6-guiding-${i}`} className="block">
              <span className="text-micro text-ash">Guiding decision #{i + 1}</span>
              <input
                value={r3.guidingDecisions[i] ?? ""}
                onChange={(e) => setNote(R3.s6.guidingDecision(i), e.target.value)}
                className="mt-1 w-full rounded-xl border border-line bg-paper px-3 py-2 text-body text-ink"
              />
            </label>
          ))}
        </div>
      </div>

      <div id="r3-stage6-logic" className="card p-5">
        <span className="text-caption font-semibold text-ink">3. Decision Logic for Prioritization</span>
        <p className="mt-1 text-caption italic text-ash">"{TASK3.stage6.s3Starter} ___"</p>
        <textarea
          value={r3.prioritizationLogic}
          onChange={(e) => setNote(R3.s6.prioritizationLogic, e.target.value)}
          rows={2}
          className="mt-1.5 w-full rounded-xl border border-line bg-paper px-3 py-2 text-body text-ink"
        />
      </div>

      <div className="card grid gap-5 p-5 lg:grid-cols-[220px_1fr]">
        <div>
          <DecisionArchitectureModel size={220} />
          <p className="mt-1 text-center text-micro text-ash">Anchor: the five components from Block 2</p>
        </div>
        <div>
          <span className="text-caption font-semibold text-ink">4. Central Trade-offs</span>
          <p className="text-micro text-ash">Name {TRADEOFF_COUNT} trade-offs Helix must consciously accept (e.g. speed vs. control, flexibility vs. governance).</p>
          <div className="mt-2 space-y-2">
            {Array.from({ length: TRADEOFF_COUNT }).map((_, i) => (
              <label key={i} id={`r3-stage6-tradeoff-${i}`} className="block">
                <span className="text-micro text-ash">Trade-off #{i + 1}</span>
                <input
                  value={r3.tradeoffs[i] ?? ""}
                  onChange={(e) => setNote(R3.s6.tradeoff(i), e.target.value)}
                  className="mt-1 w-full rounded-xl border border-line bg-paper px-3 py-2 text-body text-ink"
                />
              </label>
            ))}
          </div>
        </div>
      </div>

      <div id="r3-stage6-firstmeasure" className="card p-5">
        <span className="text-caption font-semibold text-ink">5. First Prioritized Line of Measures</span>
        <p className="text-micro text-ash">Name the measure, then justify it.</p>
        <input
          value={r3.firstMeasure}
          onChange={(e) => setNote(R3.s6.firstMeasure, e.target.value)}
          className="mt-1.5 w-full rounded-xl border border-line bg-paper px-3 py-2 text-body text-ink"
        />
        <textarea
          value={r3.firstMeasureJustify}
          onChange={(e) => setNote(R3.s6.firstMeasureJustify, e.target.value)}
          rows={2}
          className="mt-2 w-full rounded-xl border border-line bg-paper px-3 py-2 text-body text-ink"
        />
      </div>

      <div id="r3-stage6-roles" className="card p-5">
        <span className="text-caption font-semibold text-ink">6. Roles, Responsibilities, Approval &amp; Review</span>
        <p className="text-micro text-ash">Who approves what, and who reviews when.</p>
        <div className="mt-2 space-y-3">
          {PROPOSAL_ROLES.map((role) => (
            <div key={role.id} className="rounded-xl border border-line p-3">
              <p className="text-caption font-semibold text-ink">{role.label}</p>
              <div className="mt-1.5 grid gap-2 sm:grid-cols-2">
                <label className="block">
                  <span className="text-micro text-ash">Approves</span>
                  <input
                    value={r3.roleFields[role.id]?.approves ?? ""}
                    onChange={(e) => setNote(R3.s6.role(role.id, "approves"), e.target.value)}
                    className="mt-1 w-full rounded-lg border border-line bg-paper px-2.5 py-1.5 text-caption text-ink"
                  />
                </label>
                <label className="block">
                  <span className="text-micro text-ash">Reviews when</span>
                  <input
                    value={r3.roleFields[role.id]?.reviews ?? ""}
                    onChange={(e) => setNote(R3.s6.role(role.id, "reviews"), e.target.value)}
                    className="mt-1 w-full rounded-lg border border-line bg-paper px-2.5 py-1.5 text-caption text-ink"
                  />
                </label>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div id="r3-stage6-decidenow" className="card p-5">
        <span className="text-caption font-semibold text-ink">7. The Decision That Must Be Made Now</span>
        <p className="text-micro text-ash">Complete both halves of the sentence.</p>
        <label className="mt-1.5 block">
          <span className="text-caption italic text-ash">"{TASK3.stage6.s7DecideStarter} ___"</span>
          <input
            value={r3.decideNow}
            onChange={(e) => setNote(R3.s6.decideNow, e.target.value)}
            className="mt-1 w-full rounded-xl border border-line bg-paper px-3 py-2 text-body text-ink"
          />
        </label>
        <label className="mt-2 block">
          <span className="text-caption italic text-ash">"{TASK3.stage6.s7WaitStarter} ___"</span>
          <input
            value={r3.waitingMeans}
            onChange={(e) => setNote(R3.s6.waitingMeans, e.target.value)}
            className="mt-1 w-full rounded-xl border border-line bg-paper px-3 py-2 text-body text-ink"
          />
        </label>
      </div>
    </div>
  );
}
