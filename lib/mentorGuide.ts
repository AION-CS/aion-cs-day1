import { KESSLER_INPUTS as K, MODEL_FIGURES } from "@/data/offers";
import type { FigureId } from "@/data/offers";
import { CAP as CAP3, LEVER_BY_ID, POOL, POSITION_LABEL, computeBoard } from "@/data/leverData";
import type { Levers } from "@/data/leverData";
import { KEY_L1, KEY_L2, KEY_L3 } from "@/data/mentorKey";
import { formatEuro } from "@/lib/parseAmount";

/**
 * Mentor-only worked answers for every task question the answer keys (lib/answerKey.ts) do not already
 * cover: the numeric fields, with every step of the calculation written out with its numbers, and the
 * free-text answers, with the model text and what a good answer must contain. Shown only after the
 * mentor bar is unlocked, never exported. Numbers are computed from the same constants as the tables
 * and the answer checks, so they cannot drift.
 */
export type WorkedStep = { label: string; calc: string; result: string };
export type MentorGuide = {
  title: string;
  /** The model answer, as a learner would enter it. */
  answer: string;
  /** For a calculation: each step with its numbers, in order. */
  steps?: WorkedStep[];
  /** Why the answer is what it is, in one or two sentences a mentor can say out loud. */
  why?: string;
  /** For free text: what an acceptable answer must contain. */
  lookFor?: string[];
  /** Typical wrong answers, with the number they produce where there is one. */
  pitfalls?: string[];
};

const n = (v: number) => (Math.round(v * 100) / 100).toLocaleString("en-US");

/* ------------------------------------------------------------------ Task 2 · F1–F5 */

const feesA = K.TERM * K.FEE_A;
const feesB = K.TERM * K.FEE_B;
const onboarding = K.ONBOARD_DAYS * K.ONBOARD_DAY_RATE;
const reviewHours = K.DOC_REVIEW_DAYS * K.DOC_REVIEW_HOURS_PER_DAY;
const review = reviewHours * K.RATE_INTERNAL;
const incidentA = K.INCIDENT_HOURS * K.TM_RATE_A * K.TERM;
const aleAYear = K.ARO_A * K.SLE;
const aleBYear = K.ARO_B * K.SLE;

export const FIGURE_GUIDES: Record<FigureId, MentorGuide> = {
  F1: {
    title: "F1 · Offer B, annual fee over the cap",
    answer: `${n(MODEL_FIGURES.F1)} (€ per year)`,
    steps: [
      { label: "Offer B annual fee (Offer sheet)", calc: `${formatEuro(K.FEE_B)} per year`, result: formatEuro(K.FEE_B) },
      { label: "Fee-line cap (Cost lines)", calc: `${formatEuro(K.CAP)} per year`, result: formatEuro(K.CAP) },
      { label: "Fee minus cap", calc: `${n(K.FEE_B)} − ${n(K.CAP)}`, result: `${formatEuro(MODEL_FIGURES.F1)} per year` },
    ],
    why: "Both numbers are per year and sit on the same budget line (the IT-services fee line), so they are compared directly. No × 3: the cap applies per year.",
    pitfalls: [
      `Comparing three years of fees with the yearly cap: 3 × ${n(K.FEE_B)} − ${n(K.CAP)} = ${n(feesB - K.CAP)}.`,
      `Using Offer A: ${n(K.FEE_A)} is under the cap, so there is nothing to exceed.`,
    ],
  },
  F2: {
    title: "F2 · Offer A, onboarding cost",
    answer: `${n(MODEL_FIGURES.F2)} (€)`,
    steps: [
      { label: "Onboarding effort (Cost lines)", calc: `${K.ONBOARD_DAYS} person-days`, result: `${K.ONBOARD_DAYS} days` },
      { label: "Day rate (Cost lines)", calc: `${formatEuro(K.ONBOARD_DAY_RATE)} per day`, result: formatEuro(K.ONBOARD_DAY_RATE) },
      { label: "Days × day rate", calc: `${K.ONBOARD_DAYS} × ${n(K.ONBOARD_DAY_RATE)}`, result: formatEuro(onboarding) },
    ],
    why: "The rate is already per day and the quantity is in days, so the units match: multiply once. It is a one-off cost, paid once, not per year.",
    pitfalls: [
      `Converting to hours first: 10 × 8 × 1,100 = ${n(10 * 8 * K.ONBOARD_DAY_RATE)} (the rate is per day, not per hour).`,
      `Using Kessler's internal rate: 10 × 8 × ${K.RATE_INTERNAL} = ${n(10 * 8 * K.RATE_INTERNAL)} (onboarding is charged by NordByte, not done by Kessler's IT).`,
    ],
  },
  F3: {
    title: "F3 · Offer A, three-year cash total",
    answer: `${n(MODEL_FIGURES.F3)} (€ over three years; ±50 accepted)`,
    steps: [
      { label: "Fees: yearly fee × 3 years", calc: `${K.TERM} × ${n(K.FEE_A)}`, result: formatEuro(feesA) },
      { label: "Onboarding (one-off, = F2)", calc: `${K.ONBOARD_DAYS} × ${n(K.ONBOARD_DAY_RATE)}`, result: formatEuro(onboarding) },
      { label: "Documentation review: days → hours", calc: `${K.DOC_REVIEW_DAYS} days × ${K.DOC_REVIEW_HOURS_PER_DAY} h`, result: `${reviewHours} h` },
      { label: "Documentation review: hours → euros (one-off)", calc: `${reviewHours} h × ${formatEuro(K.RATE_INTERNAL)}`, result: formatEuro(review) },
      { label: "Incident hours: hours × T&M rate × 3 years", calc: `${K.INCIDENT_HOURS} h × ${formatEuro(K.TM_RATE_A)} × ${K.TERM}`, result: formatEuro(incidentA) },
      { label: "Total", calc: `${n(feesA)} + ${n(onboarding)} + ${n(review)} + ${n(incidentA)}`, result: formatEuro(MODEL_FIGURES.F3) },
    ],
    why: "Fees and incident hours recur every year, so they are multiplied by the 3-year term. Onboarding and the documentation review happen once. The review is Kessler's own staff time, so it goes days → hours → euros at the internal rate.",
    pitfalls: [
      `Forgetting × 3 on incident hours: ${n(feesA + onboarding + review + K.INCIDENT_HOURS * K.TM_RATE_A)}.`,
      `Multiplying the one-off onboarding by 3: ${n(MODEL_FIGURES.F3 + 2 * onboarding)}.`,
      `Skipping the hours step on the review (3 × 85 = 255): ${n(MODEL_FIGURES.F3 - review + K.DOC_REVIEW_DAYS * K.RATE_INTERNAL)}.`,
    ],
  },
  F4: {
    title: "F4 · Offer A minus Offer B, three-year cash",
    answer: `${n(MODEL_FIGURES.F4)} (€ over three years; ±50 accepted)`,
    steps: [
      { label: "Offer A total (= F3)", calc: "from F3", result: formatEuro(MODEL_FIGURES.F3) },
      { label: "Offer B fees: yearly fee × 3 years", calc: `${K.TERM} × ${n(K.FEE_B)}`, result: formatEuro(feesB) },
      {
        label: "Offer B incident hours",
        calc: `${K.INCIDENT_HOURS} h a year is within the ${K.INCIDENT_INCLUDED_B} h included`,
        result: "€0",
      },
      { label: "A minus B", calc: `${n(MODEL_FIGURES.F3)} − ${n(feesB)}`, result: formatEuro(MODEL_FIGURES.F4) },
    ],
    why: "Both totals are built from the same cash layers over the same three years. Offer B has no onboarding line and its expected 30 incident hours fall inside the 40 hours it includes, so B's cash total is its fees alone.",
    pitfalls: [
      `Charging B's incident hours at €140 (30 × 140 × 3 = ${n(30 * 140 * 3)}): B then totals ${n(feesB + 30 * 140 * 3)} and A looks ${n(30 * 140 * 3 - MODEL_FIGURES.F4)} cheaper. The 30 h are inside B's 40 h included.`,
      "Entering a negative number (B − A). The question asks how much more A costs, as a positive number.",
      "Adding expected loss (ALE) into either total: ALE is not cash (Materi B4).",
    ],
  },
  F5: {
    title: "F5 · Offer B, expected-loss reduction vs A",
    answer: `${n(MODEL_FIGURES.F5)} (€ over three years; ±50 accepted)`,
    steps: [
      { label: "ALE with Offer A, per year: ARO × SLE", calc: `${K.ARO_A} × ${n(K.SLE)}`, result: `${formatEuro(aleAYear)} per year` },
      { label: "ALE with Offer B, per year: ARO × SLE", calc: `${K.ARO_B} × ${n(K.SLE)}`, result: `${formatEuro(aleBYear)} per year` },
      { label: "Reduction per year", calc: `${n(aleAYear)} − ${n(aleBYear)}`, result: `${formatEuro(aleAYear - aleBYear)} per year` },
      { label: "Over the 3-year term", calc: `${n(aleAYear - aleBYear)} × ${K.TERM}`, result: formatEuro(MODEL_FIGURES.F5) },
    ],
    why: "ARO is a rate per year, so ALE = ARO × SLE is a loss per year; the question asks over three years, so multiply by 3. It is an expected value, not cash: it never enters F3 or F4.",
    pitfalls: [
      `Stopping at one year: ${n(aleAYear - aleBYear)}.`,
      `Giving one offer's ALE instead of the difference: ${n(aleAYear * K.TERM)} (A) or ${n(aleBYear * K.TERM)} (B) over three years.`,
    ],
  },
};

/* ------------------------------------------------------------------ Task 3 · G1–G6 (live) */

/**
 * G1–G6 depend on the levers the learner set, so the working is computed from the live board.
 * The reference answer (mentor fill) uses L1 Full · L2 Full · L3 Partial.
 */
export function gGuides(levers: Levers): Record<"G1" | "G2" | "G3" | "G4" | "G5" | "G6", MentorGuide> {
  const b = computeBoard(levers);
  const pos = (id: "l1" | "l2" | "l3") => POSITION_LABEL[levers[id]];
  const cost = (id: "l1" | "l2" | "l3") => LEVER_BY_ID[id].cost[levers[id]];
  const raw = LEVER_BY_ID.l3.produces[levers.l3];
  const ref = computeBoard(KEY_L3.levers);
  const refNote = `Reference allocation (mentor fill: L1 Full · L2 Full · L3 Partial) gives G1 ${n(ref.cost)}, G2 ${ref.owners}, G3 ${ref.reviews}, G4 ${ref.conversions.statusQuo}, G5 ${ref.conversions.priceWar}, G6 ${ref.uncovered}. The learner's own levers decide their answer; the check compares with what the board prints for their levers.`;
  const levNow = `Levers now: L1 ${pos("l1")} · L2 ${pos("l2")} · L3 ${pos("l3")}.`;
  return {
    G1: {
      title: "G1 · Total 6-month commitment",
      answer: `${n(b.cost)} (€) for the levers now set`,
      steps: [
        { label: `L1 at ${pos("l1")}`, calc: "cost beside the position", result: formatEuro(cost("l1")) },
        { label: `L2 at ${pos("l2")}`, calc: "cost beside the position", result: formatEuro(cost("l2")) },
        { label: `L3 at ${pos("l3")}`, calc: "cost beside the position", result: formatEuro(cost("l3")) },
        { label: "Sum", calc: `${n(cost("l1"))} + ${n(cost("l2"))} + ${n(cost("l3"))}`, result: formatEuro(b.cost) },
        {
          label: "Against the cap",
          calc: `${n(CAP3)} − ${n(b.cost)}`,
          result: b.over > 0 ? `${formatEuro(b.over)} over the cap: cannot be filed` : `${formatEuro(CAP3 - b.cost)} headroom`,
        },
      ],
      why: `${levNow} Each switch position has a fixed cost; the total is simply their sum, and it must stay within ${formatEuro(CAP3)}.`,
      pitfalls: [refNote],
    },
    G2: {
      title: "G2 · Accounts with a named owner",
      answer: `${b.owners} for the levers now set`,
      steps: [{ label: `L1 output at ${pos("l1")}`, calc: "read beside the position", result: `${b.owners} accounts` }],
      why: `${levNow} Only L1 (named account owners) produces owners; read the number beside its position. No arithmetic.`,
      pitfalls: [refNote],
    },
    G3: {
      title: "G3 · Accounts receiving a review",
      answer: `${b.reviews} for the levers now set`,
      steps: [{ label: `L2 output at ${pos("l2")}`, calc: "read beside the position", result: `${b.reviews} accounts` }],
      why: `${levNow} Only L2 (value-realization reviews) produces reviews; read the number beside its position.`,
      pitfalls: [refNote],
    },
    G4: {
      title: "G4 · Framework conversions, Status Quo",
      answer: `${b.conversions.statusQuo} for the levers now set`,
      steps: [
        { label: `L3 output at ${pos("l3")}`, calc: "before adjustments", result: `${raw}` },
        {
          label: "Sequence rule: L3 above None while L1 is None halves L3 (round down)",
          calc: b.sequenceHit ? `L1 is None → ⌊${raw} ÷ 2⌋` : levers.l3 === "none" ? "L3 is None, rule not triggered" : `L1 is ${pos("l1")}, rule not triggered`,
          result: `${b.conversions.statusQuo}`,
        },
      ],
      why: `${levNow} Status Quo applies only the sequence rule. When L1 is None the board prints \"No named account owner assigned. Conversion capacity is reduced.\" and L3's output is halved.`,
      pitfalls: [`Forgetting the sequence rule when L1 is None (would give ${raw} instead of ${Math.floor(raw / 2)}).`, refNote],
    },
    G5: {
      title: "G5 · Framework conversions, Price War",
      answer: `${b.conversions.priceWar} for the levers now set`,
      steps: [
        { label: "Status Quo conversions (= G4)", calc: "after the sequence rule", result: `${b.conversions.statusQuo}` },
        { label: "Price War halves again (round down)", calc: `⌊${b.conversions.statusQuo} ÷ 2⌋`, result: `${b.conversions.priceWar}` },
      ],
      why: `${levNow} The Price War scenario halves the Status Quo conversions again (the case model), on top of any sequence adjustment, rounding down each time.`,
      pitfalls: [`Halving the raw L3 output instead of G4, or rounding up (3 ÷ 2 = 1.5 → 1, not 2).`, refNote],
    },
    G6: {
      title: "G6 · Uncovered pool",
      answer: `${b.uncovered} for the levers now set`,
      steps: [{ label: "Pool minus accounts reviewed", calc: `${POOL} − ${b.reviews}`, result: `${b.uncovered}` }],
      why: `${levNow} The pool is the ${POOL} one-off customers (about 60 active × 70% one-off, Materi C4). Every account without a review is uncovered; the board prints it directly.`,
      pitfalls: ["Using the named-owner count (G2) instead of reviews (G3).", refNote],
    },
  };
}

/* ------------------------------------------------------------------ free-text answers */

export const TEXT_GUIDES = {
  mapSentence: {
    title: "Block 1.2 · Loyalty-map sentence",
    answer: KEY_L1.mapping.sentence,
    why: "The file measures repeat behaviour (no follow-on order: low) but never measures relative attitude. E1 is satisfaction, not attitude, so the attitude axis stays open and the customer sits in a band, not a point.",
    lookFor: [
      "Places the behaviour axis as low, from the case brief (no follow-on order).",
      "Says the attitude axis is not placed, because no relative-attitude record exists.",
      "Does not treat E1's 4 of 5 as loyalty (satisfaction ≠ attitude, Materi A2).",
      "Names a record that would settle it: NPS or stated intention from the decider, or share of wallet.",
    ],
    pitfalls: ["Placing Kessler in 'spurious' or 'no loyalty' as a point: that fixes an axis the file never measured."],
  },
  verdict: {
    title: "Block 1.3 · Citations and sentence",
    answer: `Cite ${KEY_L1.verdict.cite1} and ${KEY_L1.verdict.cite2}. Sentence: ${KEY_L1.verdict.sentence}`,
    why: "E4 (zero logged contacts from Month +1 to +11) and E5 (empty account-owner field) are the two observed records of the Relationship shortfall. E6 also fits, but E4 and E5 are the most direct.",
    lookFor: [
      "Two cited records that are observations (E1–E6), not E7 or E8.",
      "The sentence states what the records show, with no cause the file does not record.",
      "It does not blame price: E3 is a rival's price, not a shortfall on TechSolutions' side.",
    ],
    pitfalls: ["Citing E7 ('too expensive') or E8 ('never really happy'): both are interpretations."],
  },
  justification: {
    title: "Block 2.5 · Justification",
    answer: KEY_L2.justification,
    why: `Offer B: ${formatEuro(MODEL_FIGURES.F4)} cheaper in cash over three years (F4), ${formatEuro(MODEL_FIGURES.F5)} less expected loss (F5), at the price of a ${formatEuro(MODEL_FIGURES.F1)} a year fee-cap breach (F1).`,
    lookFor: [
      "Names the offer and cites at least one figure (the 'Figures cited' chips light up).",
      "Keeps cash (F3/F4) and expected loss (F5) as separate arguments.",
      "Mentions the cap breach (F1) if recommending B.",
    ],
  },
  limits: {
    title: "Block 2.5 · What your choice does not fix",
    answer: KEY_L2.limits,
    why: "Einkauf (procurement) must enforce the fee cap; the Geschäftsführer carries the ransomware risk. Both claims are legitimate, which is why the sentence must name both and not settle it.",
    lookFor: ["Follows the frame: protects ___ but leaves ___ exposed.", "Names two sides, each with a legitimate claim.", "Does not resolve the conflict in the same sentence."],
  },
  q6: {
    title: "Block 2.6 · Question 6",
    answer: KEY_L2.q6,
    why: "The question asks for a share across the portfolio. One customer (n = 1) gives no base rate, so the correct answer is that it cannot be calculated from this data (Materi B5). The app replies 'Observations behind your figure: 1' to make the point.",
    lookFor: ["Says it cannot be calculated, or gives no percentage.", "Names n = 1 / one customer / no base rate as the reason."],
    pitfalls: ["Giving any percentage, such as 100% because Kessler would re-order: that is the law of small numbers."],
  },
  risk: {
    title: "Block 3.3 · Risk and reversibility",
    answer: KEY_L3.risk,
    why: "L3 (framework-agreement push) signs customers into 3-year contracts with exit clauses: a one-way door (Materi C1). L1 and L2 are staffing choices that can be reversed next cycle. The de-risking step is to fund L3 at Partial first (real options, Materi C5).",
    lookFor: ["Names L3 as the hardest to reverse (or, if L3 is None, says so).", "Gives a reason (contract term, exit clauses, relationship cost).", "Names a smaller, reversible first step (Partial, a pilot)."],
  },
  governance: {
    title: "Block 3.4 · Governance table",
    answer: KEY_L3.governance.map((g, i) => `${i + 1}. ${g.decision} · ${g.owner} · ${g.date}`).join("  "),
    why: "One row per lever funded above None, plus one row for the next portfolio review. Owners should match the Accountable column of the learner's own RACI (Block 3.2).",
    lookFor: ["A row for every funded lever and one for the portfolio review.", "Each owner is a role, not 'the team'.", "Each date is YYYY-MM or a named milestone such as Month +3."],
  },
  notFunding: {
    title: "Block 3.5 · What we are not funding",
    answer: KEY_L3.notFunding,
    why: "Under capital rationing something good is left out (Materi C4). The answer must name it and put a number on it: the learner's own G6, or the conversions L3 at Partial leaves behind (8 at Full − 3 at Partial = 5).",
    lookFor: ["Names the lever left at None or Partial.", "Uses the learner's own G6 or another number from the board.", "Says where the cost would show up if the choice proves wrong."],
  },
  exec: {
    title: "Block 3.6 · Executive summary",
    answer: KEY_L3.exec,
    why: "A Geschäftsführer reads this first. It must say what is funded, how reversible it is, what the two scenarios produce (G4 and G5) and who owns it; the four chips light up as each appears.",
    lookFor: ["Lever: what is funded, at which position.", "Reversibility: which part is a one-way door and how it is staged.", "Scenario: Status Quo and Price War numbers (G4, G5).", "Owner: who is accountable."],
  },
} satisfies Record<string, MentorGuide>;
