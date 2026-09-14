"use client";

import { ROADMAP, ROADMAP_RULE } from "@/lib/route2";

/**
 * SVG #5 — the short/medium/structural roadmap as a three-band timeline.
 * Horizontally scrollable on mobile; each item carries its owner and its
 * evidence test as visible tags rather than hidden metadata, because the
 * rule this section teaches is that both are part of the measure itself.
 */

const BAND_TONE: Record<string, string> = {
  short: "border-accent/35 bg-accentSoft",
  medium: "border-line bg-mist",
  structural: "border-ink/25 bg-ink/[0.04]",
};

export function RoadmapTimeline() {
  return (
    <div className="space-y-3">
      <p className="text-micro font-semibold uppercase tracking-wide text-ash">Short / medium / structural</p>
      <div className="overflow-x-auto">
        <div className="grid min-w-[820px] grid-cols-3 gap-3">
          {ROADMAP.map((band) => (
            <div key={band.id} className={`rounded-2xl border p-4 ${BAND_TONE[band.id]}`}>
              <p className="text-caption font-semibold uppercase tracking-wide text-ink">{band.label}</p>
              <ul className="mt-3 space-y-3">
                {band.items.map((item) => (
                  <li key={item.text} className="rounded-xl border border-line bg-paper p-3">
                    <p className="text-caption text-ink">{item.text}</p>
                    <p className="mt-2 flex flex-wrap gap-1.5">
                      <span className="rounded-full border border-line bg-canvas px-2 py-0.5 text-micro font-semibold text-ink">
                        Owner: {item.owner}
                      </span>
                      <span className="rounded-full border border-accent/40 bg-accentSoft px-2 py-0.5 text-micro font-semibold text-accent">
                        Evidence: {item.evidence}
                      </span>
                    </p>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
      <p className="rounded-lg border border-warn/40 bg-warn/5 px-3 py-2 text-micro font-semibold text-ink">{ROADMAP_RULE}</p>
    </div>
  );
}
