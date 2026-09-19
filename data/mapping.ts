import type { RecordId } from "@/data/kesslerDossier";
import type { MaterialId } from "@/data/materialIndex";

/**
 * Task 1 · Block 1.3 — read the Kessler file against three constructs (A2) and
 * three ropes (A3). Each row gets one bucket for "what the file shows", plus
 * the record it rests on. The point of the block is the bucket "Not recorded":
 * a construct with no measuring record cannot be placed, however plausible it
 * feels.
 */

export type Bucket = "positive" | "weak" | "absent" | "not_recorded";
export const BUCKET_ORDER: Bucket[] = ["positive", "weak", "absent", "not_recorded"];

export const BUCKETS: Record<Bucket, { label: string; glyph: string; meaning: string }> = {
  positive: { label: "Positive", glyph: "●", meaning: "The file shows it in place, and good." },
  weak: { label: "Weak", glyph: "◐", meaning: "The file shows it, but thin or reduced." },
  absent: { label: "Absent", glyph: "○", meaning: "The file shows it is not there." },
  not_recorded: { label: "Not recorded", glyph: "?", meaning: "The file has no record that measures it." },
};

export type MapRowId = "M1" | "M2" | "M3" | "M4" | "M5" | "M6";
export const MAP_ROW_IDS: MapRowId[] = ["M1", "M2", "M3", "M4", "M5", "M6"];

export type CiteChoice = "" | RecordId | "case";
export const CITE_LABEL = (c: CiteChoice) => (c === "" ? "— choose —" : c === "case" ? "Case brief" : c);

export type MapRow = {
  id: MapRowId;
  group: "Construct (A2)" | "Rope (A3)";
  label: string;
  /** Instruction under the label. */
  help: string;
  expected: Bucket;
  /** Records that legitimately support the expected bucket. Empty when the expected bucket is "Not recorded". */
  citeOk: CiteChoice[];
  clue: string;
  citeClue: string;
  material: MaterialId[];
};

export const MAP_ROWS: MapRow[] = [
  {
    id: "M1",
    group: "Construct (A2)",
    label: "Satisfaction",
    help: "A judgement of the outcome against expectation. Read it from a survey or a rating.",
    expected: "positive",
    citeOk: ["E1"],
    clue: "Which record is a rating given by the customer, and what does it rate?",
    citeClue: "Does the record you cite measure this thing, or something next to it?",
    material: ["A2"],
  },
  {
    id: "M2",
    group: "Construct (A2)",
    label: "Relative attitude (the attitude side of loyalty)",
    help: "How the customer rates you against the alternatives. Typical measures: NPS, stated intention, share of wallet.",
    expected: "not_recorded",
    citeOk: [],
    clue: "Which record measures the customer's view of you against the alternatives, not against its own expectation?",
    citeClue: "",
    material: ["A2"],
  },
  {
    id: "M3",
    group: "Construct (A2)",
    label: "Retention (repeat behaviour)",
    help: "Observable continuation: renewals and repeat orders. Read it from what the customer did, not from what it said.",
    expected: "absent",
    citeOk: ["case"],
    clue: "What would show a repeat order or a renewal, and what does the file say about one?",
    citeClue: "Does the record you cite measure this thing, or something next to it?",
    material: ["A2"],
  },
  {
    id: "M4",
    group: "Rope (A3)",
    label: "Emotional rope",
    help: "Trust and affinity: a named contact, contact cadence, sponsor continuity.",
    expected: "weak",
    citeOk: ["E4", "E5", "E6"],
    clue: "Count what still works in the file after Month +1: is any contact, owner or channel left, or none?",
    citeClue: "Does the record you cite count people, cadence or ownership?",
    material: ["A3"],
  },
  {
    id: "M5",
    group: "Rope (A3)",
    label: "Economic rope",
    help: "Leaving costs more than staying. Needs both halves of the comparison: a rival's price gap and the customer's switching cost.",
    expected: "not_recorded",
    citeOk: [],
    clue: "A rival's price is one half of the comparison. Which record shows the other half?",
    citeClue: "",
    material: ["A3", "A4"],
  },
  {
    id: "M6",
    group: "Rope (A3)",
    label: "Contractual rope",
    help: "A formal obligation: a service or framework agreement with a term and a notice period.",
    expected: "absent",
    citeOk: ["case"],
    clue: "Which document in the file gives a term and a notice period?",
    citeClue: "Does the record you cite measure this thing, or something next to it?",
    material: ["A3"],
  },
];

export const MAP_ROW_BY_ID = Object.fromEntries(MAP_ROWS.map((r) => [r.id, r])) as Record<MapRowId, MapRow>;
