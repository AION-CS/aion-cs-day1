"use client";

import { useState } from "react";
import clsx from "clsx";
import { BUCKETS, BUCKET_ORDER, CITE_LABEL, MAP_ROWS } from "@/data/mapping";
import type { Bucket, CiteChoice, MapRow } from "@/data/mapping";
import { RECORDS } from "@/data/kesslerDossier";
import { Field } from "@/components/ui/Field";
import { LoyaltyMap } from "@/components/ui/LoyaltyMap";
import { clueFor, flagsForMapping, loyaltyMarker } from "@/lib/mapping";
import { IDS } from "@/lib/missing";
import { useStore } from "@/store/useStore";
import { glossify } from "@/lib/glossify";
import { AnswerKey } from "@/components/ui/AnswerKey";
import { MentorGuide } from "@/components/ui/MentorGuide";
import { TEXT_GUIDES } from "@/lib/mentorGuide";
import { mapKey } from "@/lib/answerKey";

const CITES: CiteChoice[] = [...RECORDS.map((r) => r.id as CiteChoice), "case"];

/** One row of the grid: a click-to-cycle bucket, and the record it rests on. */
function Row({ row }: { row: MapRow }) {
  const a = useStore((s) => s.l1.mapping.rows[row.id]);
  const flagged = useStore((s) => s.l1.flagged.includes(row.id));
  const clueShown = useStore((s) => !!s.l1.clueShown[row.id]);
  const l1 = useStore((s) => s.l1);
  const setBucket = useStore((s) => s.setMapBucket);
  const setCite = useStore((s) => s.setMapCite);
  const showClue = useStore((s) => s.showL1Clue);

  const cycle = () => {
    const i = a.bucket === null ? -1 : BUCKET_ORDER.indexOf(a.bucket);
    const next = i + 1 >= BUCKET_ORDER.length ? null : BUCKET_ORDER[i + 1];
    setBucket(row.id, next);
  };
  const b = a.bucket ? BUCKETS[a.bucket] : null;
  const needsCite = a.bucket !== null && a.bucket !== "not_recorded";

  return (
    <li
      id={IDS.mapRow(row.id)}
      className={clsx("grid gap-2 rounded-lg border border-line bg-paper p-3 md:grid-cols-[minmax(0,1fr)_11rem_12rem] md:items-start", flagged && "is-flagged")}
    >
      <div>
        <p className="font-semibold">
          <span className="mr-2 rounded bg-ink px-1.5 py-0.5 text-micro font-bold text-paper">{row.id}</span>
          {row.label}
        </p>
        <p id={`${row.id}-help`} className="mt-0.5 text-caption text-ash">
          {glossify(row.help)}
        </p>
      </div>

      <div>
        <p className="text-micro font-semibold uppercase text-ash md:sr-only">What the file shows</p>
        <button
          type="button"
          onClick={cycle}
          aria-describedby={`${row.id}-help`}
          aria-label={`${row.id} ${row.label}: ${b ? b.label : "no bucket chosen"}. Press to change.`}
          className={clsx(
            "btn min-h-[44px] w-full justify-between border",
            b ? "border-accent bg-accentSoft text-ink" : "border-dashed border-ash bg-mist/60 text-ash",
          )}
        >
          <span className="flex items-center gap-2">
            <span aria-hidden className="text-h3 leading-none">{b ? b.glyph : "·"}</span>
            {b ? b.label : "Choose"}
          </span>
          <span aria-hidden className="text-micro font-normal text-ash">click ↻</span>
        </button>
      </div>

      <div>
        <label htmlFor={`${row.id}-cite`} className="text-micro font-semibold uppercase text-ash md:sr-only">
          Record it rests on
        </label>
        {a.bucket === "not_recorded" ? (
          <p className="rounded-md border border-line bg-mist/60 px-3 py-2 text-caption text-ash">No record to cite: none measures it.</p>
        ) : (
          <select
            id={`${row.id}-cite`}
            className="field"
            value={a.cite}
            onChange={(e) => setCite(row.id, e.target.value as CiteChoice)}
            aria-invalid={needsCite && a.cite === ""}
          >
            {(["", ...CITES] as CiteChoice[]).map((c) => (
              <option key={c || "none"} value={c}>
                {c === "" ? "— record it rests on —" : c === "case" ? "Case brief" : `${c} · ${RECORDS.find((r) => r.id === c)?.source}`}
              </option>
            ))}
          </select>
        )}
      </div>

      {flagged && (
        <div className="fade-in text-caption md:col-span-3">
          {clueShown ? (
            <p role="status" className="rounded-md border border-gold bg-accentSoft px-3 py-2">
              <span className="smallcaps mr-1 text-accent">Clue</span>
              {clueFor(l1, row.id)}
            </p>
          ) : (
            <button type="button" onClick={() => showClue(row.id)} className="btn-ghost btn-sm border-gold">
              Show clue for {row.id}
            </button>
          )}
        </div>
      )}
    </li>
  );
}

/**
 * Block 1.3 — read the file against three constructs (A2) and three ropes (A3).
 * One grid, four coarse buckets (click to cycle), one record per reading. The
 * loyalty map underneath is drawn from the participant's own M2 and M3.
 */
export function MapBlock() {
  const l1 = useStore((s) => s.l1);
  const setSentence = useStore((s) => s.setMapSentence);
  const checkMapping = useStore((s) => s.checkMapping);
  const [last, setLast] = useState<{ flagged: number; open: number } | null>(null);

  const marker = loyaltyMarker(l1.mapping);
  const groups: MapRow["group"][] = ["Construct (A2)", "Rope (A3)"];

  const doCheck = () => {
    const flags = flagsForMapping(l1);
    checkMapping(flags);
    setLast({ flagged: flags.length, open: MAP_ROWS.filter((r) => l1.mapping.rows[r.id].bucket === null).length });
  };

  return (
    <div className="space-y-5">
      <p className="text-caption text-ash">
        For each row choose the bucket that says what the <strong>file</strong> shows, and the record it rests on. Where no record measures the
        thing, the honest bucket is “Not recorded”. Buckets: {BUCKET_ORDER.map((k) => `${BUCKETS[k].glyph} ${BUCKETS[k].label}`).join(" · ")}.
      </p>

      {groups.map((g) => (
        <div key={g} className="space-y-2">
          <p className="smallcaps">{g}</p>
          <ul className="space-y-2">
            {MAP_ROWS.filter((r) => r.group === g).map((r) => (
              <Row key={r.id} row={r} />
            ))}
          </ul>
        </div>
      ))}

      <dl className="grid gap-2 text-caption sm:grid-cols-2 lg:grid-cols-4">
        {BUCKET_ORDER.map((k) => (
          <div key={k} className="rounded-md bg-mist px-3 py-2">
            <dt className="font-semibold">
              <span aria-hidden className="mr-1.5">{BUCKETS[k].glyph}</span>
              {BUCKETS[k].label}
            </dt>
            <dd className="text-ash">{BUCKETS[k].meaning}</dd>
          </div>
        ))}
      </dl>

      <div className="space-y-2 border-t border-line pt-3">
        <div className="flex flex-wrap items-center gap-3">
          <button type="button" onClick={doCheck} className="btn-primary">
            Check my reading
          </button>
          <span className="text-caption text-ash">
            Checks requested: <span className="tnum font-semibold text-ink">{l1.checks}</span>
          </span>
          <span className="text-caption text-ash">It outlines rows in amber and offers a question; it never gives the bucket.</span>
        </div>
        {last && (
          <p role="status" className="text-caption text-ink">
            {last.flagged === 0 ? "No filled row is outlined." : `${last.flagged} filled ${last.flagged === 1 ? "row is" : "rows are"} outlined in amber.`}
            {last.open > 0 && ` ${last.open} not filled yet, so not checked.`}
          </p>
        )}
      </div>
      <AnswerKey block={mapKey()} />

      <div className="space-y-2">
        <h4 className="font-semibold">Loyalty map · Kessler</h4>
        <LoyaltyMap marker={marker} />
      </div>

      <Field
        id={IDS.mapSentence}
        htmlFor="map-sentence-text"
        label={
          <>
            Reading of the map <span className="pill-jdg ml-1 align-middle">JUDGED</span>
          </>
        }
        help={
          <>
            One or two sentences. Frame: <em>“The file places Kessler on the ___ axis as ___. It does not place ___ because ___. The record that would settle it is ___.”</em> At
            least 30 characters.
          </>
        }
        meta={<span className="tnum text-micro text-ash">{l1.mapping.sentence.trim().length} characters</span>}
      >
        <textarea
          id="map-sentence-text"
          rows={4}
          className="field"
          value={l1.mapping.sentence}
          onChange={(e) => setSentence(e.target.value)}
          placeholder="The file places Kessler on the … axis as … It does not place …"
          aria-describedby="map-sentence-text-help"
        />
      </Field>
      <MentorGuide guide={TEXT_GUIDES.mapSentence} />
    </div>
  );
}
