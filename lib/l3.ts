import { CAP, G_IDS, LEVERS, LEVER_BY_ID, LEVER_IDS, computeBoard } from "@/data/leverData";
import type { Board, GId, LeverId, Scenario } from "@/data/leverData";
import { ROLE_NAME_RE, raciProblems } from "@/data/raciModel";
import { formatEuro, parseAmount } from "@/lib/parseAmount";
import type { MissingEntry } from "@/lib/missing";
import type { Persisted, Route3State } from "@/store/useStore";

/** DOM ids for Route 3 — one place, so the missing list and the UI cannot drift. */
export const IDS3 = {
  board: "alloc-board",
  scenario: "scenario-tabs",
  g: (id: string) => `g-${id}`,
  fileAlloc: "alloc-file",
  raci: "raci-grid",
  fileRaci: "raci-file",
  risk: "risk-field",
  gov: "gov-field",
  govRow: (i: number) => `gov-row-${i}`,
  notFunding: "notfund-field",
  exec: "exec-field",
  exportL3: "export-l3",
} as const;

export const G_META: Record<GId, { label: string; help: string; clue: string }> = {
  G1: {
    label: "Total 6-month commitment (€)",
    help: "Read the total-cost readout on the board.",
    clue: "Which switch position is set on each lever, and what cost sits beside it? What do the three add up to?",
  },
  G2: {
    label: "Accounts with a named owner",
    help: "Read the L1 output at your chosen position.",
    clue: "Which lever produces named owners, and what number sits beside the position you set?",
  },
  G3: {
    label: "Accounts receiving a review",
    help: "Read the L2 output at your chosen position.",
    clue: "Which lever produces reviews, and what number sits beside the position you set?",
  },
  G4: {
    label: "Framework conversions, Status Quo",
    help: "Open the Status Quo tab and read the L3 meter.",
    clue: "Which tab is this, and does the sequence note on the meter apply to your levers?",
  },
  G5: {
    label: "Framework conversions, Price War",
    help: "Open the Price War tab and read the L3 meter.",
    clue: "Which tab is this, and what did the scenario change on top of any sequence adjustment?",
  },
  G6: {
    label: "Uncovered pool (accounts with no review at all)",
    help: "42 minus G3 — the board prints this directly, no arithmetic needed.",
    clue: "How many accounts are in the pool, and how many does the review lever reach?",
  },
};

export const gLabel = (id: GId) => `${id} (${G_META[id].label.replace(/ \(.*\)$/, "")})`;

/** The values the live board prints for G1–G6, right now. */
export function gExpected(r3: Route3State): Record<GId, number> {
  const b = computeBoard(r3.levers);
  return { G1: b.cost, G2: b.owners, G3: b.reviews, G4: b.conversions.statusQuo, G5: b.conversions.priceWar, G6: b.uncovered };
}

/** Filled readings that differ from the board (tolerance 0). Empty fields are "missing", not flagged. */
export function flagsForG(r3: Route3State): string[] {
  const exp = gExpected(r3);
  return G_IDS.filter((g) => {
    const v = parseAmount(r3.fillins[g]);
    return v !== null && v !== exp[g];
  });
}

// --- text detection ---------------------------------------------------------

const REVERSIBILITY_RE = /pilot|phase|reverse|two-way|one-way|reconsider|de-risk/i;
const SCENARIO_RE = /status quo|price war/i;

const hasNumber = (text: string, n: number) =>
  new RegExp(`(?<![\\d.,])${String(n).replace(/[.]/g, "\\.")}(?![\\d])`).test(text);

/** Block 3.5: does the text cite the participant's own G6, or a lever they left at None? */
export function notFundingCites(text: string, r3: Route3State): boolean {
  const g6 = parseAmount(r3.fillins.G6);
  if (g6 !== null && hasNumber(text, g6)) return true;
  return LEVER_IDS.some((id) => r3.levers[id] === "none" && LEVER_BY_ID[id].match.test(text));
}

export type ExecChips = { lever: boolean; reversibility: boolean; scenario: boolean; owner: boolean };

/** Block 3.6's four live chips. */
export function execChips(text: string, r3: Route3State): ExecChips {
  const funded = LEVERS.filter((l) => r3.levers[l.id] !== "none");
  const pool = funded.length ? funded : LEVERS;
  return {
    lever: pool.some((l) => l.match.test(text)),
    reversibility: REVERSIBILITY_RE.test(text),
    scenario: SCENARIO_RE.test(text),
    owner: ROLE_NAME_RE.test(text),
  };
}

// --- governance table -------------------------------------------------------

const GOV_DATE_RE = /^(\d{4}-(0[1-9]|1[0-2])|month\s*[+\-−]?\s*\d+|m\s*[+\-−]\s*\d+)$/i;
export const validGovDate = (s: string) => GOV_DATE_RE.test(s.trim());

/** One row per lever funded above None, plus the next portfolio review (at most 4). */
export function govRequired(r3: Route3State): number {
  return Math.min(4, LEVER_IDS.filter((id) => r3.levers[id] !== "none").length + 1);
}

// --- missing lists ------------------------------------------------------------

export function allocationMissing(r3: Route3State, board: Board): MissingEntry[] {
  const out: MissingEntry[] = [];
  if (board.over > 0) {
    out.push({ id: IDS3.board, label: `Total commitment is ${formatEuro(board.over)} over the ${formatEuro(CAP)} cap.` });
  }
  if (!r3.scenariosViewed.statusQuo) out.push({ id: IDS3.scenario, label: "Status Quo scenario has not been opened." });
  if (!r3.scenariosViewed.priceWar) out.push({ id: IDS3.scenario, label: "Price War scenario has not been opened." });
  for (const g of G_IDS) {
    if (!r3.fillins[g].trim()) out.push({ id: IDS3.g(g), label: `${gLabel(g)} has no value.` });
  }
  return out;
}

export function raciMissing(r3: Route3State): MissingEntry[] {
  return raciProblems(r3.raci).map((p) => ({
    id: IDS3.raci,
    label:
      p.issue === "none"
        ? `RACI: '${p.label}' has no single Accountable owner.`
        : `RACI: '${p.label}' has more than one Accountable owner.`,
  }));
}

export function govMissing(r3: Route3State): MissingEntry[] {
  const out: MissingEntry[] = [];
  for (let i = 0; i < govRequired(r3); i++) {
    const r = r3.governance[i];
    const n = i + 1;
    if (!r.decision.trim()) out.push({ id: IDS3.govRow(i), label: `Governance table row ${n} has no decision.` });
    if (!r.owner.trim()) out.push({ id: IDS3.govRow(i), label: `Governance table row ${n} has no owner.` });
    if (!r.date.trim()) out.push({ id: IDS3.govRow(i), label: `Governance table row ${n} has no date.` });
    else if (!validGovDate(r.date)) {
      out.push({ id: IDS3.govRow(i), label: `Governance table row ${n} has a date that is neither YYYY-MM nor a milestone such as 'Month +3'.` });
    }
  }
  return out;
}

const EXEC_LABEL: Record<keyof ExecChips, string> = {
  lever: "Executive summary does not name a funded lever.",
  reversibility: "Executive summary does not address reversibility.",
  scenario: "Executive summary does not name a scenario.",
  owner: "Executive summary does not name a governance owner.",
};

/** Everything still missing from the decision memo, each with the element to jump to. */
export function l3Missing(p: Persisted): MissingEntry[] {
  const r3 = p.route3;
  const board = computeBoard(r3.levers);
  const out: MissingEntry[] = [];
  if (!/^\d+$/.test(p.participant.no.trim()) || !p.participant.name.trim()) {
    out.push({ id: "participant-strip", label: "Participant number and name are needed for the file name." });
  }
  out.push(...allocationMissing(r3, board));
  if (!r3.allocFiledAt) out.push({ id: IDS3.fileAlloc, label: "The allocation is not filed yet." });
  out.push(...raciMissing(r3));
  if (!r3.raciFiledAt) out.push({ id: IDS3.fileRaci, label: "The RACI grid is not filed yet." });

  const risk = r3.risk.trim().length;
  if (risk === 0) out.push({ id: IDS3.risk, label: "Risk and reversibility is empty." });
  else if (risk < 30) out.push({ id: IDS3.risk, label: "Risk and reversibility needs at least 30 characters." });

  out.push(...govMissing(r3));

  const nf = r3.notFunding.trim();
  if (nf.length === 0) out.push({ id: IDS3.notFunding, label: "What we are not funding is empty." });
  else if (nf.length < 30) out.push({ id: IDS3.notFunding, label: "What we are not funding needs at least 30 characters." });
  else if (!notFundingCites(nf, r3)) {
    out.push({ id: IDS3.notFunding, label: "This section does not cite your own G6 figure or a lever you left unfunded." });
  }

  if (!r3.exec.trim()) out.push({ id: IDS3.exec, label: "Executive summary is empty." });
  else {
    const chips = execChips(r3.exec, r3);
    for (const k of Object.keys(EXEC_LABEL) as (keyof ExecChips)[]) if (!chips[k]) out.push({ id: IDS3.exec, label: EXEC_LABEL[k] });
  }
  return out;
}

/** Task 3's blocks, for the Portfolio progress ring. Complete means filled in, never correct. */
export function l3Blocks(p: Persisted): Record<"b31" | "b32" | "b33" | "b34" | "b35" | "b36", boolean> {
  const r3 = p.route3;
  const board = computeBoard(r3.levers);
  const nf = r3.notFunding.trim();
  const chips = execChips(r3.exec, r3);
  return {
    b31: r3.allocFiledAt !== null && board.over === 0,
    b32: r3.raciFiledAt !== null && raciMissing(r3).length === 0,
    b33: r3.risk.trim().length >= 30,
    b34: govMissing(r3).length === 0,
    b35: nf.length >= 30 && notFundingCites(nf, r3),
    b36: r3.exec.trim() !== "" && chips.lever && chips.reversibility && chips.scenario && chips.owner,
  };
}

export type { Scenario, LeverId };
