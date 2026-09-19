import { RECORDS } from "@/data/kesslerDossier";
import { MAP_ROWS } from "@/data/mapping";
import { FIGURES } from "@/data/offers";
import { KESSLER_ROLES } from "@/data/motives";
import { citedFigures, figureLabel } from "@/lib/checks";
import type { Persisted } from "@/store/useStore";

/** DOM ids the missing list points at. One place, so the list and the UI cannot drift. */
export const IDS = {
  participant: "participant-strip",
  record: (id: string) => `rec-${id}`,
  bin: (id: string) => `bin-${id}`,
  v1: "v1-field",
  v2: "v2-field",
  v3: "v3-field",
  v4: "v4-field",
  fileNote: "file-note",
  figure: (id: string) => `fig-${id}`,
  motive: (key: string) => `motive-${key}`,
  recommendation: "rec-choice",
  justification: "justification-field",
  limits: "limits-field",
  q6: "q6-field",
  mapRow: (id: string) => `map-${id}`,
  mapSentence: "map-sentence",
  exportL1: "export-l1",
  exportL2: "export-l2",
} as const;

/** "Relative attitude (the attitude side of loyalty)" -> "Relative attitude". */
const shortLabel = (s: string) => s.split(" (")[0];

export type MissingEntry = { id: string; label: string };

export function participantMissing(p: Persisted): MissingEntry[] {
  const bad = !/^\d+$/.test(p.participant.no.trim()) || !p.participant.name.trim();
  return bad
    ? [{ id: IDS.participant, label: "Participant number and name are needed for the file name." }]
    : [];
}

/** Everything still missing from the Task 1 diagnostic note, each with the element to jump to. */
export function l1Missing(p: Persisted): MissingEntry[] {
  const out = participantMissing(p);
  const { placements, verdict } = p.l1;
  for (const r of RECORDS) {
    if (placements[r.id] === null) {
      out.push({ id: IDS.record(r.id), label: `Record ${r.id} is not placed in any bin.` });
    }
  }
  for (const row of MAP_ROWS) {
    const a = p.l1.mapping.rows[row.id];
    if (a.bucket === null) {
      out.push({ id: IDS.mapRow(row.id), label: `Reading ${row.id} (${shortLabel(row.label)}) has no bucket.` });
    } else if (a.bucket !== "not_recorded" && a.cite === "") {
      out.push({ id: IDS.mapRow(row.id), label: `Reading ${row.id} (${shortLabel(row.label)}) names no record it rests on.` });
    }
  }
  const mlen = p.l1.mapping.sentence.trim().length;
  if (mlen === 0) out.push({ id: IDS.mapSentence, label: "Mapping: the one-sentence reading of the loyalty map is empty." });
  else if (mlen < 30) out.push({ id: IDS.mapSentence, label: "Mapping: the one-sentence reading needs at least 30 characters." });
  if (!verdict.category) out.push({ id: IDS.v1, label: "Verdict: no category selected." });
  if (!verdict.cite1) out.push({ id: IDS.v2, label: "Verdict: the first cited record is empty." });
  if (!verdict.cite2) out.push({ id: IDS.v3, label: "Verdict: the second cited record is empty." });
  if (verdict.cite1 && verdict.cite1 === verdict.cite2) {
    out.push({ id: IDS.v3, label: "Verdict: the two cited records must be different." });
  }
  const len = verdict.sentence.trim().length;
  if (len === 0) out.push({ id: IDS.v4, label: "Verdict: the one-sentence finding is empty." });
  else if (len < 20) {
    out.push({ id: IDS.v4, label: "Verdict: the one-sentence finding needs at least 20 characters." });
  }
  if (!verdict.filedAt) out.push({ id: IDS.fileNote, label: "The diagnostic note is not filed yet." });
  return out;
}

/** Only the verdict fields — what "File diagnostic note" needs. */
export function verdictMissing(p: Persisted): MissingEntry[] {
  return l1Missing(p).filter(
    (m) => [IDS.v1, IDS.v2, IDS.v3, IDS.v4].includes(m.id as never),
  );
}

export function l2Missing(p: Persisted): MissingEntry[] {
  const out = participantMissing(p);
  const { l2 } = p;
  for (const f of FIGURES) {
    if (!l2.fillins[f.id].trim()) out.push({ id: IDS.figure(f.id), label: `${figureLabel(f.id)} has no value.` });
  }
  for (const r of KESSLER_ROLES) {
    if (!l2.motives[r.key]) out.push({ id: IDS.motive(r.key), label: `Motive for '${r.name}' is not chosen.` });
  }
  if (!l2.recommendation) out.push({ id: IDS.recommendation, label: "Recommendation: no offer selected." });
  const j = l2.justification.trim();
  if (!j) out.push({ id: IDS.justification, label: "Justification is empty." });
  else if (citedFigures(j, l2).length === 0) {
    out.push({ id: IDS.justification, label: "Justification cites no figure from your Task 2 tables." });
  }
  const lim = l2.limits.trim().length;
  if (lim === 0) out.push({ id: IDS.limits, label: "'What your choice does not fix' is empty." });
  else if (lim < 30) out.push({ id: IDS.limits, label: "'What your choice does not fix' needs at least 30 characters." });
  if (!l2.q6.trim()) out.push({ id: IDS.q6, label: "Question 6 has no answer." });
  else if (!l2.q6Submitted) out.push({ id: IDS.q6, label: "Question 6 is not recorded — press 'Record my answer'." });
  return out;
}
