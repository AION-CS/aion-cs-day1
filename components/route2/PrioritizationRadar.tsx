"use client";

import { CRITERIA, OPTIONS } from "@/lib/route2";
import { RadarChart, type RadarSeries } from "@/components/ui/RadarChart";
import { useRoute2 } from "./useRoute2";

const SERIES_STYLE: Record<string, { color: string; dash?: string }> = {
  A: { color: "#0E7A5A" },
  B: { color: "#B87514", dash: "7 5" },
  C: { color: "#16191D", dash: "2 3" },
};

/** Builds live, criterion by criterion, from whatever the learner has picked so far — no dot is placed manually. */
export function PrioritizationRadar() {
  const r2 = useRoute2();

  const axes = CRITERIA.map((c) => ({ id: c.id, label: c.label }));
  const series: RadarSeries[] = OPTIONS.map((o) => ({
    id: o.id,
    label: `Option ${o.id}`,
    color: SERIES_STYLE[o.id].color,
    dash: SERIES_STYLE[o.id].dash,
    scores: Object.fromEntries(CRITERIA.map((c) => [c.id, r2.scoreOf(c.id, o.id)])),
  }));

  return (
    <div id="r2-radar" className="card p-5">
      <RadarChart axes={axes} series={series} maxScore={3} />
      <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-caption">
        {OPTIONS.map((o) => (
          <span key={o.id} className="flex items-center gap-1.5">
            <svg width="18" height="8" aria-hidden>
              <line x1="0" y1="4" x2="18" y2="4" stroke={SERIES_STYLE[o.id].color} strokeWidth={2.25} strokeDasharray={SERIES_STYLE[o.id].dash} />
            </svg>
            Option {o.id} — {o.short}
          </span>
        ))}
      </div>
      <p className="mt-2 text-micro tabular-nums text-ash">{r2.criteriaDoneCount} / {r2.criteriaTotal} scores answered</p>
    </div>
  );
}
