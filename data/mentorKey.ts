import type { Bin, RecordId, VerdictCategory } from "./kesslerDossier";
import type { FigureId } from "./offers";
import type { MotiveId, RoleKey } from "./motives";
import type { Bucket, CiteChoice, MapRowId } from "./mapping";
import type { LeverId, Position } from "./leverData";
import type { ActivityId, Chip, RoleId } from "./raciModel";

/**
 * Model answers for the mentor autofill. One file, on purpose: this is a
 * convenience for QA and live facilitation, behind a client-side passcode.
 * It is not security and the UI never claims it is.
 */

export const MENTOR_PASSCODE = "muchson123";

export const KEY_L1: {
  placements: Record<RecordId, Bin>;
  verdict: { category: VerdictCategory; cite1: RecordId; cite2: RecordId; sentence: string };
  mapping: { rows: Record<MapRowId, { bucket: Bucket; cite: CiteChoice }>; sentence: string };
} = {
  mapping: {
    rows: {
      M1: { bucket: "positive", cite: "E1" },
      M2: { bucket: "not_recorded", cite: "" },
      M3: { bucket: "absent", cite: "case" },
      M4: { bucket: "weak", cite: "E4" },
      M5: { bucket: "not_recorded", cite: "" },
      M6: { bucket: "absent", cite: "case" },
    },
    sentence:
      "The file places Kessler on the repeat-behaviour axis as low: no follow-on order in eleven months. It does not place the attitude axis, because it records satisfaction (E1, 4 of 5) but no relative-attitude measure. A relative-attitude measure from the decider, or a share-of-wallet figure, would settle it.",
  },
  placements: {
    E1: "benefit",
    E2: "trust",
    E3: "price",
    E4: "relationship",
    E5: "relationship",
    E6: "relationship",
    E7: "interpretation",
    E8: "interpretation",
  },
  verdict: {
    category: "relationship",
    cite1: "E4",
    cite2: "E5",
    sentence:
      "The file records no contact between the hypercare call at Month +1 and the tender at Month +11, and the account owner field is empty. It does not record any cause for the price comparison.",
  },
};

export const KEY_L2: {
  fillins: Record<FigureId, string>;
  motives: Record<RoleKey, MotiveId>;
  recommendation: "A" | "B" | "B+care";
  justification: string;
  limits: string;
  q6: string;
} = {
  fillins: { F1: "2000", F2: "11000", F3: "159890", F4: "9890", F5: "25200" },
  motives: { einkauf: "efficiency", itLeiter: "security", gf: "status", prodIt: "innovation" },
  recommendation: "B",
  justification:
    "Offer B costs €9,890 less over three years in cash (€150,000 vs €159,890) and removes €25,200 of expected loss. Its fee exceeds the cap by €2,000 per year, which needs a one-time exception from the Geschäftsführer.",
  limits:
    "Choosing B protects total cost and security exposure but leaves the fee-line cap breached by €2,000 per year exposed. Einkauf has a legitimate process claim; the Geschäftsführer has a legitimate risk claim.",
  q6: "This cannot be calculated: Kessler is one customer (n = 1) and gives no base rate for the one-off portfolio.",
};

export const KEY_L3: {
  levers: Record<LeverId, Position>;
  fillins: Record<"G1" | "G2" | "G3" | "G4" | "G5" | "G6", string>;
  raci: Record<ActivityId, Partial<Record<RoleId, Chip>>>;
  risk: string;
  governance: { decision: string; owner: string; date: string }[];
  notFunding: string;
  exec: string;
} = {
  levers: { l1: "full", l2: "full", l3: "partial" },
  fillins: { G1: "191000", G2: "30", G3: "42", G4: "3", G5: "1", G6: "0" },
  raci: {
    owner: { sales: "A", pm: "R" },
    contract: { sales: "A", legal: "C", gf: "I" },
    review: { pm: "A", sales: "I" },
    escalation: { gf: "A", sales: "R", legal: "C" },
  },
  risk: "The framework-agreement push is the hardest to reverse because a signed 3-year contract carries exit clauses and relationship cost if we pull back. Before committing the full €120,000, we will run it at Partial (€65,000, 3 conversions) for this cycle and expand only after the first two conversions close.",
  governance: [
    { decision: "Named account owners", owner: "Head of Sales/CCO", date: "Month +1" },
    { decision: "Value-realization reviews", owner: "Delivery PM (lead)", date: "Month +1" },
    { decision: "Framework-agreement push", owner: "Head of Sales/CCO", date: "Month +2" },
    { decision: "Portfolio review", owner: "Geschäftsführer + Head of Sales/CCO", date: "Month +6" },
  ],
  notFunding:
    "We are not fully funding the framework-agreement push. That leaves the Uncovered pool at 0 for reviews (G6), but only 3 of the estimated 8 convertible accounts get a contract offer this cycle. If the other 5 churn to price competition before the next review, that cost shows up as lost 3-year contract value, not as a line in this budget.",
  exec: "This program funds named account owners and value-realization reviews in full, and the framework-agreement push at Partial — a two-way-door pilot for now, since a full commitment is harder to reverse. Under Status Quo we expect 3 conversions; under Price War, 1. The Head of Sales/CCO is accountable for the account-owner and contract tracks; the Geschäftsführer is informed and owns the Month +6 portfolio review.",
};
