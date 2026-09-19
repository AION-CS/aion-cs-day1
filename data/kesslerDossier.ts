/** The Kessler Präzisionstechnik GmbH file — Task 1's eight records. */

export type Bin = "price" | "trust" | "benefit" | "relationship" | "interpretation";
export type RecordId = "E1" | "E2" | "E3" | "E4" | "E5" | "E6" | "E7" | "E8";
export type VerdictCategory = "price" | "trust" | "benefit" | "relationship";

export const RECORD_IDS: RecordId[] = ["E1", "E2", "E3", "E4", "E5", "E6", "E7", "E8"];

export const BINS: { id: Bin; label: string; definition: string }[] = [
  { id: "price", label: "Price", definition: "Money the customer pays or compares." },
  {
    id: "trust",
    label: "Trust",
    definition:
      "Evidence of delivery reliability or conduct (deadlines met, promises kept, incidents handled): ability, benevolence, integrity.",
  },
  {
    id: "benefit",
    label: "Benefit",
    definition: "The outcome the customer receives and rates (needs met, value in use).",
  },
  {
    id: "relationship",
    label: "Relationship",
    definition: "Continuity of contact between the two organisations: people, cadence, ownership.",
  },
  {
    id: "interpretation",
    label: "Interpretation — not evidence",
    definition: "A claim the file does not show. The note may exist; the cause it names is not recorded.",
  },
];

export const BIN_LABEL: Record<Bin, string> = Object.fromEntries(BINS.map((b) => [b.id, b.label])) as Record<Bin, string>;
export const BIN_SHORT: Record<Bin, string> = {
  price: "Price",
  trust: "Trust",
  benefit: "Benefit",
  relationship: "Relationship",
  interpretation: "Interpretation",
};

export type DossierRecord = {
  id: RecordId;
  source: string;
  /** Text shown on the card, e.g. "M+1 (Head of IT)". */
  when: string;
  /** Where the marker sits on the map (months relative to go-live). */
  at: number;
  /** A record covering a span (E4) draws a bracket. */
  span?: [number, number];
  text: string;
  onFile: string;
  /** Ground truth. Never printed in the learner UI. */
  trueBin: Bin;
  observed: boolean;
  /** One question that teaches how to test the item — never names the answer or the bin. */
  clue: string;
};

export const RECORDS: DossierRecord[] = [
  {
    id: "E1",
    source: "Close-out survey",
    when: "M+1 (Head of IT)",
    at: 1,
    text: "“Overall, the solution meets our business needs: 4 / 5.”",
    onFile: "Survey form",
    trueBin: "benefit",
    observed: true,
    clue: "What does the respondent rate — an event in the project, or what the customer receives?",
  },
  {
    id: "E2",
    source: "Project completion report",
    when: "M+1",
    at: 1,
    text: "“Go-live on the contractual date. Final invoice equals contract value (€118,000). Zero open priority-1 incidents at the end of the four-week hypercare.”",
    onFile: "Report + invoice",
    trueBin: "trust",
    observed: true,
    clue: "Which promises does this record show being kept?",
  },
  {
    id: "E3",
    source: "Kessler tender comparison sheet",
    when: "M+11",
    at: 11,
    text: "“Three-year service offer from NordByte IT: 12% below TechSolutions' comparable offer.”",
    onFile: "Comparison sheet",
    trueBin: "price",
    observed: true,
    clue: "Which figure here is a sum of money, and who compares it with whom?",
  },
  {
    id: "E4",
    source: "TechSolutions CRM contact log",
    when: "M+1 → M+11",
    at: 6,
    span: [1, 11],
    text: "“Last logged contact: hypercare closing call, Month +1. Next logged contact: Kessler's tender invitation, Month +11. Logged contacts in between: 0.”",
    onFile: "CRM export",
    trueBin: "relationship",
    observed: true,
    clue: "What does this record count?",
  },
  {
    id: "E5",
    source: "TechSolutions staffing plan",
    when: "M+1",
    at: 1,
    text: "“Project manager reassigned to another client. Field 'Account owner — Kessler': empty.”",
    onFile: "Staffing plan export",
    trueBin: "relationship",
    observed: true,
    clue: "Which field is empty, and what does that field normally name?",
  },
  {
    id: "E6",
    source: "Email delivery report",
    when: "M+9",
    at: 9,
    text: "“Quarterly newsletter to the Kessler distribution list: 2 of 3 addresses bounced (recipients no longer at Kessler, per auto-reply). CRM still lists both as primary contacts.”",
    onFile: "Delivery report",
    trueBin: "relationship",
    observed: true,
    clue: "Whose contact details are these, and can they still be reached?",
  },
  {
    id: "E7",
    source: "CRM note, Sales Director",
    when: "M+12",
    at: 12,
    text: "“They left because we are too expensive.”",
    onFile: "none — a personal comment",
    trueBin: "interpretation",
    observed: false,
    clue: "Which record in the file shows the cause this sentence names?",
  },
  {
    id: "E8",
    source: "Project manager's handover comment",
    when: "M+1",
    at: 1,
    text: "“Kessler was never really happy with the scope changes.”",
    onFile: "none — a personal comment",
    trueBin: "interpretation",
    observed: false,
    clue: "Which record in the file shows the cause this sentence names?",
  },
];

export const RECORD_BY_ID: Record<RecordId, DossierRecord> = Object.fromEntries(
  RECORDS.map((r) => [r.id, r]),
) as Record<RecordId, DossierRecord>;

/** Clue for a verdict citation that is not an observation filed in the named category. */
export const CITE_CLUE =
  "Is the record you cite an observation, and did you file it in the category you named?";

export const KESSLER_CASE = {
  company: "Kessler Präzisionstechnik GmbH",
  contractValue: "€118,000",
  staff: "about 320 staff",
};
