import { RECORDS } from "@/data/kesslerDossier";
import type { RecordId, VerdictCategory } from "@/data/kesslerDossier";
import { BUCKETS, MAP_ROWS } from "@/data/mapping";
import type { Bucket } from "@/data/mapping";
import { KESSLER_ROLES, MOTIVE_IDS, MOTIVE_LABEL } from "@/data/motives";
import type { MotiveId, RoleKey } from "@/data/motives";
import { CARE_ADDON_PER_YEAR, FIGURES } from "@/data/offers";
import { ACTIVITIES, ROLES } from "@/data/raciModel";
import type { ActivityId, RoleId } from "@/data/raciModel";
import { CAP, LEVERS, computeBoard } from "@/data/leverData";
import type { LeverId, Position } from "@/data/leverData";
import { formatEuro } from "@/lib/parseAmount";

/**
 * Mentor-only answer keys for the exercises where the learner picks from fixed options. Each key gives the
 * expected answer and a reason per option — including why each rejected option is rejected — plus a teaching
 * note wherever more than one answer defends. Never exported and never shown to a learner.
 */
export type AnswerKeyOption = { label: string; expected: boolean; why: string };
export type AnswerKeyBlock = { title: string; expected: string; options: AnswerKeyOption[]; teachingNote?: string };

/** Block 1.1 · Sort the file — 8 records, 5 bins. */
export function sortKey(): AnswerKeyBlock {
  const REJECT: Record<RecordId, Partial<Record<"price" | "trust" | "benefit" | "relationship" | "interpretation", string>>> = {
    E1: {
      price: "No money or cost comparison appears in this record.",
      trust: "It rates the outcome, not a specific promise kept or a deadline held.",
      relationship: "It says nothing about contact, ownership or continuity.",
      interpretation: "It's a filed survey record with a named respondent, not an unrecorded personal comment.",
    },
    E2: {
      price: "The invoice figure matches the contract value; it isn't a comparison against anything.",
      benefit: "It reports delivery events, not the customer's judgement of the outcome.",
      relationship: "It says nothing about contact or ownership.",
      interpretation: "A dated report with concrete, checkable figures — not an unrecorded claim.",
    },
    E3: {
      trust: "It's a cost comparison, not a record of a promise kept or broken.",
      benefit: "It says nothing about what Kessler received or rated.",
      relationship: "It's about a number, not contact or ownership.",
      interpretation: "It's a filed comparison sheet, an observed record, not a personal comment.",
    },
    E4: {
      price: "No money appears in this record.",
      trust: "It counts contact events, not a promise kept or broken.",
      benefit: "It says nothing about what Kessler received or rated.",
      interpretation: "A CRM export with a count anyone could verify — not an unrecorded claim.",
    },
    E5: {
      price: "No cost appears here.",
      trust: "It's about staffing, not a promise kept or broken.",
      benefit: "It says nothing about the outcome Kessler received.",
      interpretation: "A staffing plan export with a named empty field — not a personal comment.",
    },
    E6: {
      price: "No cost appears here.",
      trust: "It's about contact reachability, not a promise kept or broken.",
      benefit: "It says nothing about the outcome Kessler received.",
      interpretation: "A delivery report with a bounce count anyone could verify — not a personal comment.",
    },
    E7: {
      price: "It mentions price, but naming a cause isn't a filed price record — no comparison sheet backs this specific claim as the reason they left.",
      trust: "Nothing here is about a promise kept or broken.",
      benefit: "Nothing here is about the outcome Kessler received.",
      relationship: "Nothing here is about contact or ownership.",
    },
    E8: {
      benefit: "It sounds like a judgement of the outcome, but no filed rating or survey backs it — E1's actual survey score is the only benefit record.",
      price: "Nothing here is about money.",
      trust: "Nothing here is about a promise kept or broken.",
      relationship: "Nothing here is about contact or ownership.",
    },
  };
  const CORRECT_WHY: Record<RecordId, string> = {
    E1: "A survey rating of the outcome against expectation — exactly what Benefit measures.",
    E2: "It shows two promises kept, the contractual go-live date and zero priority-1 incidents — exactly what Trust (delivery reliability, promises kept) measures.",
    E3: "A sum of money compared between two suppliers — the definition of Price.",
    E4: "It counts logged contact between the two organisations over time — continuity is exactly what Relationship measures.",
    E5: "An empty 'Account owner' field is a direct record of lost ownership continuity.",
    E6: "It shows the contact channel itself failing — two of three named contacts unreachable.",
    E7: "It names a cause — being too expensive — that no other record in the file shows. A personal comment, not a filed observation.",
    E8: "A personal comment naming a feeling ('never really happy') that no survey or rating in the file records.",
  };
  const BIN_LABEL2 = { price: "Price", trust: "Trust", benefit: "Benefit", relationship: "Relationship", interpretation: "Interpretation" } as const;
  return {
    title: "Block 1.1 · Sort the file",
    expected: RECORDS.map((r) => `${r.id} → ${BIN_LABEL2[r.trueBin]}`).join(" · "),
    options: RECORDS.flatMap((r) => [
      { label: `${r.id} → ${BIN_LABEL2[r.trueBin]}`, expected: true, why: CORRECT_WHY[r.id] },
      ...Object.entries(REJECT[r.id]).map(([bin, why]) => ({
        label: `${r.id} → ${BIN_LABEL2[bin as keyof typeof BIN_LABEL2]}`,
        expected: false,
        why: why as string,
      })),
    ]),
    teachingNote:
      "E7 and E8 are the boundary cases most likely to be defended into an evidence bin. Both name a specific cause (price, unhappiness with scope changes) that feels plausible next to E3's real price record or E1's real survey — but neither has its own filed record. The test is always: which record in the file, not the sentence itself, shows this?",
  };
}

/** Block 1.2 · Map the customer — 6 rows, 4 buckets. */
export function mapKey(): AnswerKeyBlock {
  const WHY: Record<string, Partial<Record<Bucket, string>>> = {
    M1: {
      positive: "E1's survey rates the outcome 4 of 5 — a record exists and it's good.",
      weak: "The rating is present, not thin — 4 of 5 with no qualifier.",
      absent: "A record does exist (E1); the axis isn't undocumented.",
      not_recorded: "E1 is exactly the measuring record this needs, so it isn't unmeasured.",
    },
    M2: {
      not_recorded: "No record compares Kessler's view of TechSolutions against alternatives — no NPS, stated intention or share-of-wallet figure is on file.",
      positive: "Nothing in the file measures this axis, so it can't be marked good.",
      weak: "There's no record to call thin — there's no record at all.",
      absent: "'Absent' would claim the file shows the attitude is missing; the file simply never measured it.",
    },
    M3: {
      absent: "The case brief states no follow-on order followed hypercare — an observed absence, not a missing record.",
      positive: "No repeat order or renewal is on file.",
      weak: "Nothing shows even a thin version of repeat behaviour — it's a flat zero.",
      not_recorded: "This is measured — the case brief states the fact directly, so it isn't unmeasured.",
    },
    M4: {
      weak: "The file shows some emotional-rope evidence (E4, E5, E6), but everything it shows is thin or failing, never absent entirely nor healthy.",
      positive: "Nothing in E4, E5 or E6 shows a working relationship — quite the opposite.",
      absent: "There are records (E4, E5, E6); the rope isn't simply undocumented.",
      not_recorded: "Three separate records (E4, E5, E6) measure exactly this.",
    },
    M5: {
      not_recorded: "E3 gives one half of the comparison (a rival's price gap); no record gives Kessler's own switching cost, so the rope can't be placed.",
      positive: "No record shows switching costs favouring TechSolutions.",
      weak: "There's nothing thin to point to — the switching-cost half is simply missing from the file.",
      absent: "'Absent' would claim the file shows no switching cost exists; the file just never measured Kessler's side.",
    },
    M6: {
      absent: "The case brief describes a one-off migration project, not a framework or service agreement with a term and notice period.",
      positive: "No contract with a term and notice period is on file.",
      weak: "There's no thin agreement to point to — no contractual document exists at all.",
      not_recorded: "The case brief directly states the project type, so the absence is observed, not unmeasured.",
    },
  };
  return {
    title: "Block 1.2 · Map the customer",
    expected: MAP_ROWS.map((r) => `${r.id} → ${BUCKETS[r.expected].label}`).join(" · "),
    options: MAP_ROWS.flatMap((r) =>
      (Object.entries(WHY[r.id]) as [Bucket, string][]).map(([b, why]) => ({
        label: `${r.id} (${r.label}) → ${BUCKETS[b].label}`,
        expected: b === r.expected,
        why,
      })),
    ),
    teachingNote:
      "M2 and M5 are the pair worth drilling: both are 'Not recorded', and both get defended into 'Absent' by a learner reading absence into silence. 'Absent' is itself a claim the file has to support; where the file never measured the thing at all, 'Not recorded' is the honest bucket, however plausible the guess feels.",
  };
}

/** Block 1.3 · Name the weak point — verdict category. */
export function verdictKey(): AnswerKeyBlock {
  const CATS: { id: VerdictCategory; label: string; why: string }[] = [
    { id: "relationship", label: "Relationship", why: "E4 (zero logged contacts, M+1 to M+11) and E5 (empty account-owner field) are the two strongest, most specific observed shortfalls on TechSolutions' side." },
    { id: "price", label: "Price", why: "E3 is a rival's price gap, not a shortfall on TechSolutions' side — no record shows TechSolutions' own price causing the loss." },
    { id: "trust", label: "Trust", why: "E2 shows promises kept (on-time go-live, zero P1 incidents) — the opposite of a trust shortfall." },
    { id: "benefit", label: "Benefit", why: "E1's rating is a positive 4 of 5 — not a shortfall." },
  ];
  return {
    title: "Block 1.3 · Name the weak point — V1 category",
    expected: "Relationship, citing E4 and E5",
    options: CATS.map((c) => ({ label: c.label, expected: c.id === "relationship", why: c.why })),
    teachingNote:
      "E7 and E8 cannot be cited at all here (V2/V3 require an observed record) — a learner who cites either is reusing an interpretation as if it were evidence, the exact trap Block 1.1 and Materi A6's ladder of inference warn against.",
  };
}

/** Block 2.4 · Motive read — 4 Kessler roles, 4 motives each. */
export function motiveKey(): AnswerKeyBlock {
  return {
    title: "Block 2.4 · Motive read",
    expected: KESSLER_ROLES.map((r) => `${r.name} → ${MOTIVE_LABEL[r.model]}`).join(" · "),
    options: KESSLER_ROLES.flatMap((r) =>
      MOTIVE_IDS.map((m) => ({
        label: `${r.name} → ${MOTIVE_LABEL[m]}`,
        expected: m === r.model,
        why: m === r.model ? ROLE_WHY[r.key] : ROLE_REJECT[r.key][m],
      })),
    ),
    teachingNote:
      "Role and motive are not the same thing (B3): any role can voice any motive. These four map cleanly because the case wrote one clean statement per role, but a real committee member can voice a different motive depending on what they actually say — always read from the wording, not the job title.",
  };
}

const ROLE_WHY: Record<RoleKey, string> = {
  einkauf: "Asking for total cost over the term, not the headline number, is exactly what Efficiency (less effort or cost per outcome) listens for.",
  itLeiter: "Naming a specific failure scenario and personal accountability for it is exactly what Security (avoid loss or failure) listens for.",
  gf: "Wanting to be named among reference plants at an industry fair is a direct reputation/peer-comparison statement — Status.",
  prodIt: "Wanting a capability ('live machine data') the buyer does not yet have is exactly Innovation.",
};
const ROLE_REJECT: Record<RoleKey, Record<MotiveId, string>> = {
  einkauf: {
    efficiency: ROLE_WHY.einkauf,
    security: "The statement is about cost control, not about avoiding a loss or failure.",
    innovation: "Nothing here asks for a new capability.",
    status: "Nothing here is about reputation or peer comparison.",
  },
  itLeiter: {
    security: ROLE_WHY.itLeiter,
    efficiency: "This isn't about cost or effort per outcome.",
    innovation: "This isn't about a new capability.",
    status: "This isn't about reputation or peer comparison.",
  },
  gf: {
    status: ROLE_WHY.gf,
    security: "No failure or loss is mentioned.",
    efficiency: "No cost or effort is mentioned.",
    innovation: "Being named a reference plant is about reputation, not about gaining a new capability.",
  },
  prodIt: {
    innovation: ROLE_WHY.prodIt,
    security: "No failure or loss is mentioned.",
    efficiency: "This isn't about reducing cost or effort — it's about gaining a new capability.",
    status: "This isn't about reputation or peer comparison.",
  },
};

/** Block 2.5 · Your choice — offer recommendation. */
export function recommendationKey(): AnswerKeyBlock {
  const totalA = FIGURES.find((f) => f.id === "F3")!.answer;
  const gapAB = FIGURES.find((f) => f.id === "F4")!.answer;
  const aleGap = FIGURES.find((f) => f.id === "F5")!.answer;
  const capOver = FIGURES.find((f) => f.id === "F1")!.answer;
  const careTerm = CARE_ADDON_PER_YEAR * 3;
  return {
    title: "Block 2.5 · Recommendation",
    expected: "Offer B",
    options: [
      {
        label: "Offer A",
        expected: false,
        why: `Costs ${formatEuro(gapAB)} more than B over three years (F4, total ${formatEuro(totalA)}) and does nothing about the ${formatEuro(aleGap)} expected-loss gap (F5). Its only advantage is staying under the fee cap with no exception needed.`,
      },
      {
        label: "Offer B",
        expected: true,
        why: `Costs ${formatEuro(gapAB)} less than A over three years and cuts expected loss by ${formatEuro(aleGap)}. Its annual fee is ${formatEuro(capOver)} over the fee-line cap (F1), which needs a one-time exception from the Geschäftsführer — a governance cost, not a cash one.`,
      },
      {
        label: "Offer B + Care after go-live",
        expected: false,
        why: `Adds ${formatEuro(CARE_ADDON_PER_YEAR)} per year (${formatEuro(careTerm)} over three years) on top of B for post-go-live reviews, but the retention effect is not modelled — Kessler is one observed customer (n = 1), so there is no base rate to justify the extra spend on arithmetic grounds alone.`,
      },
    ],
    teachingNote:
      "B wins on the numbers, and the fee-cap breach is the one detail Einkauf will push back on — that's a governance ask, not a reason to reject B. B+care is defensible if a learner argues the Relationship weak point named in Task 1 needs a direct fix, not just a cheaper, more secure contract — but they have to say so explicitly, because Q6 in this same task names exactly this gap: it cannot be calculated from n = 1.",
  };
}

/** Block 3.1 · Allocation board — one reference combination, 3 levers × 3 positions. */
export function allocationKey(): AnswerKeyBlock {
  const REF: Record<LeverId, Position> = { l1: "full", l2: "full", l3: "partial" };
  const refBoard = computeBoard(REF);
  const altBoard = computeBoard({ l1: "none", l2: "full", l3: "full" });
  const LEVER_WHY: Record<LeverId, Record<Position, string>> = {
    l1: {
      none: "Funds nothing on the exact rope (Relationship) Task 1's diagnosed weak point named — and leaves L3 penalised, since L3 above None while L1 is None halves its conversions (the sequencing rule).",
      partial: "Funds fewer than half the pool's owners (12 of 42) — a real but partial fix to the diagnosed weak point.",
      full: "Funds 30 of 42 accounts with a named owner — directly on the Relationship rope Task 1 diagnosed as weak, and avoids the sequencing penalty on L3.",
    },
    l2: {
      none: "Funds no post-go-live reviews at all.",
      partial: "Reviews under half the pool (20 of 42).",
      full: "Reviews the entire one-off pool (42 of 42) — the QBR-style practice from B6, addressing both the relationship and benefit ropes.",
    },
    l3: {
      none: "Converts nobody — leaves the highest-cost lever entirely unfunded.",
      partial: "Converts 3 accounts to 3-year contracts at the lowest cost of the three positions — the affordable slice of the highest-cost lever, fitting under the cap alongside L1 and L2 at Full.",
      full: "Converts the most accounts (8) but alone costs more than L1 and L2's Full positions combined — funding all three at Full totals €246,000, €46,000 over the €200,000 cap.",
    },
  };
  return {
    title: "Block 3.1 · Allocation board — one reference combination",
    expected: `L1 Full · L2 Full · L3 Partial (${formatEuro(refBoard.cost)}, ${formatEuro(CAP - refBoard.cost)} of headroom)`,
    options: LEVERS.flatMap((l) =>
      (["none", "partial", "full"] as Position[]).map((p) => ({
        label: `${l.name.split(" · ")[1] ?? l.short} → ${p[0].toUpperCase() + p.slice(1)}`,
        expected: REF[l.id] === p,
        why: LEVER_WHY[l.id][p],
      })),
    ),
    teachingNote: `The reference combination isn't the only one that fits the cap. L1 None + L2 Full + L3 Full also fits (${formatEuro(altBoard.cost)}) and produces more conversions after the sequencing halving (${altBoard.conversions.statusQuo} vs ${refBoard.conversions.statusQuo}, Status Quo) — but it funds zero named account owners, leaving the Relationship rope Task 1's own verdict diagnosed as weak completely unaddressed. A learner who defends that combination has to say so explicitly and accept the trade-off; the board's arithmetic doesn't rule it out, only the diagnosis argues against it.`,
  };
}

/** Block 3.2 · RACI grid — who holds Accountable, per activity. */
export function raciKey(): AnswerKeyBlock {
  const MODEL: Record<ActivityId, RoleId> = { owner: "sales", contract: "sales", review: "pm", escalation: "gf" };
  const WHY: Record<ActivityId, Record<RoleId, string>> = {
    owner: {
      sales: "Assigning who owns which account is a sales/CCO call — it decides how the sales organisation is structured, which is why Sales holds Accountable, with the Delivery PM Responsible for actually briefing the new owners.",
      pm: "PM executes the handover, which is why PM fits Responsible here, not Accountable — the PM doesn't decide the assignment policy.",
      legal: "Legal has no stake in who owns which account internally.",
      gf: "The Geschäftsführer doesn't need to approve individual account-owner assignments — this is an operational sales decision, not board-level.",
    },
    contract: {
      sales: "The Head of Sales/CCO owns the commercial relationship and the negotiation outcome — Accountable.",
      legal: "Legal/Einkauf reviews contract terms and fits Consulted, but doesn't own the commercial decision to push the framework agreement.",
      pm: "Delivery PM has no role in commercial contract negotiation.",
      gf: "The Geschäftsführer fits Informed here (this is a one-way-door lever, C1) — day-to-day negotiation isn't their job.",
    },
    review: {
      pm: "Running the quarterly reviews is delivery work — the Delivery PM owns execution.",
      sales: "Sales fits Informed of review outcomes (they may reveal churn risk) but doesn't run the reviews.",
      legal: "Legal has no role in running value-realization reviews.",
      gf: "The Geschäftsführer doesn't need to own routine review execution.",
    },
    escalation: {
      gf: "A churn-risk escalation on a named account is exactly the kind of decision the governance table (C5) puts at managing-director level — Accountable.",
      sales: "Sales/CCO fits Responsible for raising and acting on the escalation, but the final call on committing resources to save the account sits with the Geschäftsführer.",
      pm: "Delivery PM isn't positioned to decide the commercial response to churn risk.",
      legal: "Legal fits Consulted if the response touches a contract, but doesn't own the escalation decision.",
    },
  };
  return {
    title: "Block 3.2 · RACI grid — who is Accountable",
    expected: ACTIVITIES.map((a) => `${a.label} → ${ROLES.find((r) => r.id === MODEL[a.id])!.short}`).join(" · "),
    options: ACTIVITIES.flatMap((a) =>
      ROLES.map((r) => ({
        label: `${a.label} → ${r.short}`,
        expected: r.id === MODEL[a.id],
        why: WHY[a.id][r.id],
      })),
    ),
    teachingNote:
      "This is the mentor's reference assignment, not the only defensible one — the app enforces only 'exactly one Accountable per row' (C5) and leaves who holds it to the learner's judgement. Someone who puts the Delivery PM as Accountable for contract negotiation instead of Sales, arguing the PM already owns the client relationship day-to-day, is reasoning, not guessing — use this key to test whether their reasoning names a real basis (who decides, who executes, who bears the consequence), not to mark them wrong outright.",
  };
}
