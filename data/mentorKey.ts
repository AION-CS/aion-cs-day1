import type { Bin, RecordId, VerdictCategory } from "./kesslerDossier";
import type { FigureId } from "./offers";
import type { MotiveId, RoleKey } from "./motives";

/**
 * Model answers for the mentor autofill. One file, on purpose: this is a
 * convenience for QA and live facilitation, behind a client-side passcode.
 * It is not security and the UI never claims it is.
 */

export const MENTOR_PASSCODE = "muchson123";

export const KEY_L1: {
  placements: Record<RecordId, Bin>;
  verdict: { category: VerdictCategory; cite1: RecordId; cite2: RecordId; sentence: string };
} = {
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
