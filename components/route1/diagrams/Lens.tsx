"use client";

import { useEffect, useRef, useState } from "react";
import { useInView } from "@/lib/useInView";
import { CRITERIA, LENS_DEMO, LENS_STATUS, rankToRadar } from "@/lib/route1";
import { RadarChart, SeriesSwatch, type SeriesStyle } from "@/components/ui/RadarChart";

/** S6 — the lens as a table: definition, diagnostic question, common misuse. */
export function CriteriaTable() {
  return (
    <div className="space-y-2">
      <p className="text-micro font-semibold uppercase tracking-wide text-ash">The seven criteria</p>
      <div className="overflow-x-auto rounded-xl border border-line">
        <table className="w-full min-w-[640px] border-collapse text-left">
          <thead className="bg-mist">
            <tr>
              {["Criterion", "Definition", "Diagnostic question", "Common misuse"].map((h) => (
                <th key={h} className="px-3 py-2 text-micro font-semibold uppercase tracking-wide text-ash">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {CRITERIA.map((c) => (
              <tr key={c.id} className="border-t border-line align-top">
                <td className="px-3 py-2 text-caption font-semibold text-ink">{c.name}</td>
                <td className="px-3 py-2 text-caption text-ash">{c.definition}</td>
                <td className="px-3 py-2 text-caption italic text-ink">&ldquo;{c.question}&rdquo;</td>
                <td className="px-3 py-2 text-caption text-ash">{c.misuse}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="rounded-lg border border-warn/40 bg-warn/5 px-3 py-2 text-micro text-ink">{LENS_STATUS}</p>
    </div>
  );
}

const DEMO_STYLE: SeriesStyle = { color: "accent", marker: "circle" };

/**
 * SVG #10 — The Lens Radar: the empty seven-axis tool the learner fills in
 * Part 2, with a short demo that plots one illustrative option and then clears
 * itself. Plays once when scrolled into view; replayable.
 */
export function LensRadar() {
  const { ref, seen } = useInView<HTMLDivElement>(0.4);
  const [phase, setPhase] = useState<"empty" | "drawn" | "cleared">("empty");
  const timers = useRef<number[]>([]);
  const played = useRef(false);

  const play = () => {
    timers.current.forEach((t) => window.clearTimeout(t));
    setPhase("empty");
    timers.current = [
      window.setTimeout(() => setPhase("drawn"), 250),
      window.setTimeout(() => setPhase("cleared"), 3600),
    ];
  };

  useEffect(() => {
    if (seen && !played.current) {
      played.current = true;
      play();
    }
  }, [seen]);

  useEffect(() => () => timers.current.forEach((t) => window.clearTimeout(t)), []);

  const values = Object.fromEntries(
    CRITERIA.map((c) => [c.id, phase === "drawn" ? rankToRadar(LENS_DEMO.ranks[c.id]) : 0]),
  );

  return (
    <div ref={ref} className="grid items-center gap-4 md:grid-cols-[minmax(0,1fr)_240px]">
      <div className="mx-auto w-full max-w-[420px]">
        <RadarChart
          title="The Lens Radar: seven criteria, rank 1 on the outer ring"
          axes={CRITERIA.map((c) => ({ key: c.id, label: c.axis, full: c.name }))}
          series={[{ id: "demo", label: LENS_DEMO.label, values, tone: "option", style: DEMO_STYLE }]}
          max={3}
          ringCount={3}
          animate
        />
      </div>
      <div className="space-y-2 rounded-xl border border-line bg-canvas p-4">
        <p className="text-caption font-semibold text-ink">The tool you fill in Part 2</p>
        <p className="text-caption text-ash">
          Each option gets a rank from 1 to 3 on each criterion. Rank 1 plots on the outer ring, rank 3 on the inner.
        </p>
        <p aria-live="polite" className="flex items-center gap-2 text-micro text-ash">
          <SeriesSwatch style={DEMO_STYLE} />
          {phase === "drawn" ? LENS_DEMO.label : phase === "cleared" ? "Demo cleared — the radar starts empty in Part 2." : "Empty radar."}
        </p>
        <p className="text-micro text-ash">{LENS_DEMO.note}</p>
        <button type="button" onClick={play} className="btn-ghost">
          Play the demo again
        </button>
      </div>
    </div>
  );
}
