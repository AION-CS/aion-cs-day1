"use client";

import { useStore } from "@/store/useStore";
import { IDS } from "@/lib/missing";

/**
 * The learner's full name, on every page. It only builds the export file name.
 * The number that leads the file name is not typed and not shown: each export adds
 * its own route's number automatically (Route 1 = 1, Route 2 = 2, Route 3 = 3), see
 * lib/slug.ts, so the name is the only thing a learner fills in.
 */
export function ParticipantStrip() {
  const name = useStore((s) => s.participant.name);
  const setParticipant = useStore((s) => s.setParticipant);

  return (
    <section id={IDS.participant} aria-label="Participant" className="card mt-4 p-3 md:p-4 print:hidden">
      <label htmlFor="participant-name" className="text-caption font-semibold">
        Full name
      </label>
      <p id="participant-name-help" className="text-micro normal-case tracking-normal text-ash">
        Use the same name all week — it is how your submissions are matched. Each export names its own file from it,
        for example <span className="tnum">1-muchson-day1-l1-diagnostic</span>.
      </p>
      <input
        id="participant-name"
        autoComplete="name"
        aria-describedby="participant-name-help"
        className="field mt-1 max-w-xl"
        value={name}
        onChange={(e) => setParticipant({ name: e.target.value })}
        placeholder="First name and family name"
      />
    </section>
  );
}
