"use client";

import { useState } from "react";
import clsx from "clsx";
import { RadarChart, SeriesSwatch } from "@/components/ui/RadarChart";
import { CRITERIA, OPTION_IDS, RADAR, rankToRadar, type OptionId } from "@/lib/route1";
import { OPTION_STYLE } from "./optionStyle";
import type { Route1State } from "./useRoute1";

/**
 * SVG #11 — the live radar: three overlaid profiles drawn from the learner's
 * own ranks (rank 1 outer, rank 3 inner), easing to every change. Toggles
 * isolate one option. Rank sums sit underneath, with the caveat that they
 * summarise judgement rather than score it.
 */
export function LiveRadar({ r1 }: { r1: Route1State }) {
  const [only, setOnly] = useState<OptionId | null>(null);

  const series = OPTION_IDS.filter((o) => !only || o === only).map((o) => ({
    id: o,
    label: `Option ${o}`,
    tone: "option" as const,
    style: OPTION_STYLE[o],
    values: Object.fromEntries(CRITERIA.map((c) => [c.id, rankToRadar(r1.ranks[c.id][o])])),
  }));

  return (
    <div className="space-y-3 rounded-2xl border border-line bg-paper p-4">
      <p className="text-micro font-semibold uppercase tracking-wide text-accent">{RADAR.title}</p>

      <RadarChart
        title={`Your ranking as a profile${only ? ` — Option ${only} only` : ""}`}
        axes={CRITERIA.map((c) => ({ key: c.id, label: c.axis, full: c.name }))}
        series={series}
        max={3}
        ringCount={3}
        animate
      />

      <div role="group" aria-label="Which options to draw" className="flex flex-wrap gap-1.5">
        <button
          type="button"
          onClick={() => setOnly(null)}
          aria-pressed={only === null}
          className={clsx(
            "rounded-full border px-2.5 py-1 text-micro font-semibold transition-colors duration-150",
            only === null ? "border-ink bg-ink text-paper" : "border-line bg-paper text-ash hover:text-ink",
          )}
        >
          All three
        </button>
        {OPTION_IDS.map((o) => (
          <button
            key={o}
            type="button"
            onClick={() => setOnly(only === o ? null : o)}
            aria-pressed={only === o}
            className={clsx(
              "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-micro font-semibold transition-colors duration-150",
              only === o ? "border-ink bg-mist text-ink" : "border-line bg-paper text-ash hover:text-ink",
            )}
          >
            <SeriesSwatch style={OPTION_STYLE[o]} />
            Only {o}
          </button>
        ))}
      </div>

      <p className="text-micro text-ash">{RADAR.howToRead}</p>

      <dl className="grid grid-cols-3 gap-2">
        {OPTION_IDS.map((o) => (
          <div key={o} className="rounded-lg border border-line bg-canvas p-2 text-center">
            <dt className="text-micro font-semibold text-ink">Option {o}</dt>
            <dd className="text-readout tabular-nums text-ink">{r1.rankSums[o]}</dd>
            <dd className="text-micro text-ash">
              rank sum · {r1.rankedFor[o]}/7
            </dd>
          </div>
        ))}
      </dl>
      <p className="text-micro text-ash">Lower sum = ranked higher more often.</p>
      <p className="rounded-lg border border-warn/40 bg-warn/5 px-3 py-2 text-micro text-ink">{RADAR.caveat}</p>
    </div>
  );
}
