export type Chip = "R" | "A" | "C" | "I";
export const CHIPS: Chip[] = ["R", "A", "C", "I"];
export const CHIP_NAME: Record<Chip, string> = { R: "Responsible", A: "Accountable", C: "Consulted", I: "Informed" };

export type ActivityId = "owner" | "contract" | "review" | "escalation";
export const ACTIVITIES: { id: ActivityId; label: string }[] = [
  { id: "owner", label: "Named account-owner assignment" },
  { id: "contract", label: "Framework-contract negotiation" },
  { id: "review", label: "Value-realization review execution" },
  { id: "escalation", label: "Escalation when a named account shows churn risk" },
];

export type RoleId = "sales" | "pm" | "legal" | "gf";
export const ROLES: { id: RoleId; label: string; short: string }[] = [
  { id: "sales", label: "Head of Sales / CCO (you)", short: "Head of Sales / CCO" },
  { id: "pm", label: "Delivery PM", short: "Delivery PM" },
  { id: "legal", label: "Legal / Einkauf counterpart", short: "Legal / Einkauf" },
  { id: "gf", label: "Geschäftsführer", short: "Geschäftsführer" },
];

export type RaciGridState = Record<ActivityId, Record<RoleId, Chip | null>>;

export const emptyRaci = (): RaciGridState =>
  Object.fromEntries(
    ACTIVITIES.map((a) => [a.id, Object.fromEntries(ROLES.map((r) => [r.id, null]))]),
  ) as RaciGridState;

/** Rows that break the one rule the grid enforces: exactly one Accountable per row. */
export function raciProblems(g: RaciGridState): { id: ActivityId; label: string; issue: "none" | "many" }[] {
  const out: { id: ActivityId; label: string; issue: "none" | "many" }[] = [];
  for (const a of ACTIVITIES) {
    const n = ROLES.filter((r) => g[a.id][r.id] === "A").length;
    if (n === 0) out.push({ id: a.id, label: a.label, issue: "none" });
    else if (n > 1) out.push({ id: a.id, label: a.label, issue: "many" });
  }
  return out;
}

/** Text that names one of the four roles (Block 3.6's owner chip). */
export const ROLE_NAME_RE = /head of sales|\bcco\b|delivery pm|legal|einkauf|gesch(ä|ae)ftsf(ü|ue)hrer|managing director/i;
