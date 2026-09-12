"use client";

import { useState } from "react";
import { useProgress } from "@/lib/store";
import { R1, ZONES, FINDINGS, type ZoneId } from "@/lib/route1";
import { OfficeFloorPlanSvg } from "./OfficeFloorPlanSvg";
import { ZoneVignette } from "./ZoneVignette";
import { useRoute1 } from "./useRoute1";
import { Check } from "@/components/icons/LineIcons";

/**
 * Stage 1a — the walkthrough. Clicking a room logs its single finding to the
 * evidence list; everything downstream works from what has actually been found,
 * so a learner never sorts or diagnoses a finding they haven't seen.
 */
export function FloorWalk() {
  const r1 = useRoute1();
  const markSeen = useProgress((s) => s.markSeen);
  const [activeZoneId, setActiveZoneId] = useState<ZoneId | null>(null);

  const openZone = (id: ZoneId) => {
    markSeen(R1.zones, id);
    setActiveZoneId(id);
  };

  const activeZone = ZONES.find((z) => z.id === activeZoneId) ?? null;
  const activeFinding = FINDINGS.find((f) => f.zoneId === activeZoneId) ?? null;

  return (
    <div>
      <div className="flex items-baseline justify-between gap-3">
        <p className="text-caption text-ash">Click a room to investigate it. Every room holds exactly one finding.</p>
        <p className="text-caption tabular-nums text-ash">
          Logged: <span className="font-semibold text-ink">{r1.zonesSeen.length}</span> / {ZONES.length}
        </p>
      </div>

      <div className="card mt-3 p-4">
        <OfficeFloorPlanSvg visited={r1.zonesSeen} activeZoneId={activeZoneId} onZoneClick={openZone} />
      </div>

      {activeZone && activeFinding && (
        <div className="reveal-in mt-3 grid gap-4 rounded-2xl border border-accent/30 bg-accentSoft/40 p-4 lg:grid-cols-[320px_1fr]">
          <div>
            <ZoneVignette id={activeZone.id} />
          </div>
          <div>
            <p className="text-micro font-semibold uppercase tracking-wide text-accent">
              Zone {activeZone.letter} · {activeZone.label}
            </p>
            <p className="mt-1 text-caption italic text-ash">{activeZone.scene}</p>
            <p className="mt-3 text-body text-ink">{activeFinding.text}</p>
            {activeFinding.context && <p className="mt-2 text-caption text-ash">{activeFinding.context}</p>}
            <p className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-accent px-2.5 py-1 text-micro font-semibold text-paper">
              <Check className="h-3.5 w-3.5" /> Logged to your evidence list
            </p>
          </div>
        </div>
      )}

      <div className="mt-4 rounded-2xl border border-line bg-canvas p-4">
        <p className="text-micro font-semibold uppercase tracking-wide text-ash">Evidence list</p>
        {r1.zonesSeen.length === 0 ? (
          <p className="mt-1 text-caption text-ash">Nothing logged yet — open a room above to start.</p>
        ) : (
          <ul className="mt-2 space-y-2">
            {ZONES.filter((z) => r1.zonesSeen.includes(z.id)).map((z) => {
              const finding = FINDINGS.find((f) => f.zoneId === z.id);
              return (
                <li key={z.id} className="flex gap-2.5">
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-accent text-micro font-semibold text-paper">
                    {z.letter}
                  </span>
                  <span className="text-caption text-ink">{finding?.text}</span>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}
