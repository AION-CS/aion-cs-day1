"use client";

import { useProgress } from "@/lib/store";
import { MaterialRefs } from "@/components/ui/MaterialRefs";
import { Slider } from "@/components/ui/Slider";
import { R2, SECTION_7, materialRefs } from "@/lib/route2";
import { domId, type Route2State } from "./useRoute2";

/** Section 7 — the decision to take now, a confidence slider, and what would change it. */
export function DecisionNowSection({ r2 }: { r2: Route2State }) {
  const setNote = useProgress((s) => s.setNote);
  const choose = useProgress((s) => s.choose);

  return (
    <section id={domId.decideNow} className="scroll-mt-24 space-y-4 rounded-2xl border border-line bg-paper p-5">
      <div>
        <p className="text-micro font-semibold uppercase tracking-wide text-accent">Section {SECTION_7.n}</p>
        <h3 className="mt-1 text-h3 text-ink">{SECTION_7.title}</h3>
        <MaterialRefs refs={materialRefs(["measure"])} />
      </div>

      <div id={domId.decisionNow} className="scroll-mt-24">
        <label htmlFor="r2-decision-now-field" className="block text-caption font-semibold text-ink">
          {SECTION_7.decision.label}
        </label>
        <textarea
          id="r2-decision-now-field"
          rows={3}
          value={r2.decisionNow}
          onChange={(e) => setNote(R2.decisionNow, e.target.value)}
          placeholder={SECTION_7.decision.placeholder}
          className="mt-2 w-full rounded-xl border border-line bg-paper px-3 py-2.5 text-caption text-ink"
        />
        <p className={r2.decisionNow.trim().length >= SECTION_7.decision.min ? "mt-1 text-micro tabular-nums text-accent" : "mt-1 text-micro tabular-nums text-ash"}>
          {r2.decisionNow.trim().length} / {SECTION_7.decision.min} characters minimum
        </p>
      </div>

      <div id={domId.confidence} className="scroll-mt-24">
        <Slider
          id="r2-confidence-slider"
          label={SECTION_7.confidence.label}
          instruction={SECTION_7.confidence.helper}
          min={0}
          max={SECTION_7.confidence.max}
          value={r2.confidence}
          onChange={(v) => choose(R2.confidence, String(v))}
          lowLabel="0"
          highLabel="100"
        />
      </div>

      <div id={domId.changeMyMind} className="scroll-mt-24">
        <label htmlFor="r2-change-mind-field" className="block text-caption font-semibold text-ink">
          {SECTION_7.changeMyMind.label}
        </label>
        <input
          id="r2-change-mind-field"
          type="text"
          value={r2.changeMyMind}
          onChange={(e) => setNote(R2.changeMyMind, e.target.value)}
          placeholder={SECTION_7.changeMyMind.placeholder}
          className="mt-2 w-full rounded-xl border border-line bg-paper px-3 py-2.5 text-caption text-ink"
        />
      </div>
    </section>
  );
}
