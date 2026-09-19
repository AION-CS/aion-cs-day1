"use client";

import { useStore } from "@/store/useStore";
import { IDS } from "@/lib/missing";

/**
 * Participant number and full name — persisted, on every page. They only build
 * the export file name: {no}-{name}-day1-{task}.
 */
export function ParticipantStrip() {
  const participant = useStore((s) => s.participant);
  const setParticipant = useStore((s) => s.setParticipant);
  const noBad = participant.no !== "" && !/^\d+$/.test(participant.no.trim());

  return (
    <section
      id={IDS.participant}
      aria-label="Participant"
      className="card mt-4 grid gap-3 p-3 sm:grid-cols-[minmax(0,10rem)_minmax(0,1fr)] md:p-4 print:hidden"
    >
      <div>
        <label htmlFor="participant-no" className="text-caption font-semibold">
          Participant No.
        </label>
        <p id="participant-no-help" className="text-micro normal-case tracking-normal text-ash">
          A whole number. Used in your export file name: 1-muchson-day1-l1-diagnostic.
        </p>
        <input
          id="participant-no"
          inputMode="numeric"
          autoComplete="off"
          aria-describedby="participant-no-help"
          aria-invalid={noBad}
          className="field mt-1 tnum"
          value={participant.no}
          onChange={(e) => setParticipant({ no: e.target.value })}
          placeholder="1"
        />
        {noBad && <p className="mt-1 text-micro text-rust">Digits only, for example 1.</p>}
      </div>
      <div>
        <label htmlFor="participant-name" className="text-caption font-semibold">
          Full name
        </label>
        <p id="participant-name-help" className="text-micro normal-case tracking-normal text-ash">
          Use the same name all week — it is how your submissions are matched. Used in your export file name:
          1-muchson-day1-l1-diagnostic.
        </p>
        <input
          id="participant-name"
          autoComplete="name"
          aria-describedby="participant-name-help"
          className="field mt-1"
          value={participant.name}
          onChange={(e) => setParticipant({ name: e.target.value })}
          placeholder="First name and family name"
        />
      </div>
    </section>
  );
}
