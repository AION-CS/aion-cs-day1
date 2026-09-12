"use client";

import { useState } from "react";
import clsx from "clsx";
import { useProgress } from "@/lib/store";
import {
  FIX_TYPES,
  R1,
  materialRefs,
  shuffledLevers,
  type FixType,
  type Hotspot,
} from "@/lib/route1";
import { ClueToggle } from "@/components/ui/ClueToggle";
import { AnswerKey } from "@/components/ui/AnswerKey";
import { MaterialRefs } from "@/components/ui/MaterialRefs";
import { Check as CheckGlyph } from "@/components/icons/LineIcons";
import { CategoryGlyph, categoryName } from "./CategoryGrid";
import { useRoute1, domId, type Finding } from "./useRoute1";
import { CATEGORIES } from "@/lib/route1";

/**
 * Steps 3–5 for one sorted hotspot: pick the lever, justify it, and mark the
 * fix type — plus the Check button, which speaks only to the category
 * placement and only ever in a clue (CLAUDE.md #4).
 */
export function HotspotWorkup({ finding }: { finding: Finding }) {
  const h = finding.hotspot;
  const choose = useProgress((s) => s.choose);
  const setNote = useProgress((s) => s.setNote);
  const [checked, setChecked] = useState<null | "right" | "wrong">(null);

  const category = CATEGORIES.find((c) => c.id === finding.category);
  const levers = shuffledLevers(h);

  const runCheck = () => {
    setChecked(finding.category === h.correctCategory ? "right" : "wrong");
  };

  return (
    <li
      id={domId.hotspot(h.id)}
      className={clsx(
        "scroll-mt-24 rounded-2xl border bg-paper p-5",
        finding.complete ? "border-accent/40" : "border-line",
      )}
    >
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <span
            className={clsx(
              "flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-readout font-semibold tabular-nums",
              finding.complete ? "bg-accent text-paper" : "bg-mist text-ink",
            )}
          >
            {h.n}
          </span>
          <div>
            <p className="text-micro font-semibold uppercase tracking-wide text-ash">{h.location}</p>
            <p className="text-h3 text-ink">{h.title}</p>
          </div>
        </div>
        {category && (
          <div className="flex items-center gap-2 rounded-full border border-line px-3 py-1.5">
            <CategoryGlyph category={category} size="sm" />
            <span className="text-caption font-semibold text-ink">{category.name}</span>
          </div>
        )}
      </div>

      <p className="mt-3 rounded-xl border border-line bg-canvas p-3 text-caption text-ash">{h.symptom}</p>

      <MaterialRefs refs={materialRefs(h.material)} />

      {/* --- Check: category placement only, clue not answer --- */}
      <div className="mt-4 rounded-xl border border-line bg-canvas p-3">
        <div className="flex flex-wrap items-center gap-3">
          <button type="button" onClick={runCheck} className="btn-ghost !py-1.5 !text-caption">
            {checked ? "Re-check placement" : "Check placement"}
          </button>
          <p className="text-micro text-ash">
            Checks the category only — never the lever or the fix type.
          </p>
        </div>

        {checked === "right" && (
          <p className="reveal-in mt-2 inline-flex items-center gap-1.5 text-caption font-semibold text-accent">
            <CheckGlyph className="h-4 w-4" />
            That placement holds up. Carry on with the lever.
          </p>
        )}
        {checked === "wrong" && (
          <div className="reveal-in mt-2">
            <p className="text-caption font-semibold text-danger">
              Not where this one belongs. Move it to a different bin and re-check.
            </p>
            <ClueToggle clue={h.clue} />
          </div>
        )}

        <AnswerKey block={h.answerKeys.category} />
      </div>

      {/* --- Lever --- */}
      <div id={domId.lever(h.id)} className="mt-5 scroll-mt-24">
        <label htmlFor={`lever-${h.id}`} className="block text-caption font-semibold text-ink">
          Improvement lever
        </label>
        <p className="mt-0.5 text-micro text-ash">
          Pick the one that reduces the work itself, not the one that makes the same work cheaper to serve.
        </p>
        <select
          id={`lever-${h.id}`}
          value={finding.leverId ?? ""}
          onChange={(e) => choose(R1.lever(h.id), e.target.value)}
          className="mt-2 w-full rounded-xl border border-line bg-paper px-3 py-2.5 text-caption text-ink"
        >
          <option value="">Choose a lever…</option>
          {levers.map((l) => (
            <option key={l.id} value={l.id}>
              {l.text}
            </option>
          ))}
        </select>
        <AnswerKey block={h.answerKeys.lever} />
      </div>

      {/* --- Justification --- */}
      <div id={domId.justification(h.id)} className="mt-5 scroll-mt-24">
        <label htmlFor={`why-${h.id}`} className="block text-caption font-semibold text-ink">
          Justification (1–2 sentences)
        </label>
        <p className="mt-0.5 text-micro text-ash">
          Reference which of AppNexa&apos;s original behaviors this fixes — name the behaviour from the symptom card
          above, not a general principle.
        </p>
        <textarea
          id={`why-${h.id}`}
          rows={2}
          value={finding.justification}
          onChange={(e) => setNote(R1.justification(h.id), e.target.value)}
          placeholder="e.g. This removes the per-row lookups behind the 120-query dashboard load."
          className="mt-2 w-full rounded-xl border border-line bg-paper px-3 py-2.5 text-caption text-ink"
        />
      </div>

      {/* --- Fix type --- */}
      <div id={domId.fixType(h.id)} className="mt-5 scroll-mt-24">
        <p className="text-caption font-semibold text-ink">Fix type</p>
        <p className="mt-0.5 text-micro text-ash">
          Ask who could actually pull this lever. If the answer is &ldquo;whoever sets the standard&rdquo;, it is
          structural.
        </p>
        <div className="mt-2 grid gap-2 sm:grid-cols-2">
          {FIX_TYPES.map((ft) => {
            const active = finding.fixType === ft.id;
            return (
              <button
                key={ft.id}
                type="button"
                aria-pressed={active}
                onClick={() => choose(R1.fixType(h.id), active ? "" : (ft.id as FixType))}
                className={clsx(
                  "rounded-xl border p-3 text-left transition-colors duration-150",
                  active ? "border-accent bg-accentSoft" : "border-line bg-paper hover:border-ash",
                )}
              >
                <span
                  className={clsx(
                    "block text-caption font-semibold",
                    active ? "text-accent" : "text-ink",
                  )}
                >
                  {ft.label}
                </span>
                <span className="mt-0.5 block text-micro text-ash">{ft.hint}</span>
              </button>
            );
          })}
        </div>
        <AnswerKey block={h.answerKeys.fixType} />
      </div>
    </li>
  );
}

/** The full workup list — one card per sorted hotspot, in the order they were sorted. */
export function HotspotWorkups() {
  const r1 = useRoute1();
  const sorted = r1.reportRows;

  if (sorted.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-line bg-canvas p-6 text-center">
        <p className="text-body font-semibold text-ink">Nothing sorted yet.</p>
        <p className="mt-1 text-caption text-ash">
          Inspect a pin on the trace above and sort its card into a category — its workup appears here.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div>
        <p className="text-micro font-semibold uppercase tracking-wide text-accent">
          Steps 3–5 · Work up each finding
        </p>
        <h3 className="text-h3 text-ink">
          Lever, justification and fix type{" "}
          <span className="text-ash">
            ({r1.completeCount} of {r1.totalHotspots} complete)
          </span>
        </h3>
        <p className="mt-1 max-w-prose text-caption text-ash">
          Cards appear here in the order you sorted them, and that is the order they take in the Diagnosis Report.
        </p>
      </div>
      <ul className="space-y-4">
        {sorted.map((f) => (
          <HotspotWorkup key={f.hotspot.id} finding={f} />
        ))}
      </ul>
    </div>
  );
}

export { categoryName };
