/**
 * Route 2 — Application (L2). Prioritising green workplace measures under
 * trade-offs and incomplete data. Case: Nordwerk Technologies GmbH (fictional).
 *
 * Route 2 is completable standalone: block 0's recap carries the one lifecycle
 * fact from Route 1 that everything here rests on, so a learner who never
 * opened Route 1 is never missing a premise.
 */

import type { IconKey } from "@/lib/routes";
import type { AnswerKeyBlock } from "@/lib/answerKey";

export const LEARNER_NAME_KEY = "learner:name";

// ---------------------------------------------------------------------------
// Store key map
// ---------------------------------------------------------------------------
export const R2 = {
  name: LEARNER_NAME_KEY,
  /** markSeen bucket for evidence cards the learner has flipped to reveal method. */
  flipped: "r2:flipped",
  stage1: {
    confidence: (cardId: string) => `r2:s1:conf:${cardId}`,
    relevance: (cardId: string) => `r2:s1:rel:${cardId}`,
    stance: "r2:s1:stance",
  },
  stage2: {
    weight: (criterionId: string) => `r2:s2:w:${criterionId}`,
    weightWhy: (criterionId: string) => `r2:s2:wwhy:${criterionId}`,
    gate: (measureId: string, criterionId: string) => `r2:s2:gate:${measureId}:${criterionId}`,
    score: (measureId: string, criterionId: string) => `r2:s2:score:${measureId}:${criterionId}`,
    sensitivity: "r2:s2:sens",
    sensitivityNote: "r2:s2:sensnote",
  },
  stage3: {
    constraint: (constraintId: string) => `r2:s3:con:${constraintId}`,
    mitigation: (constraintId: string) => `r2:s3:mit:${constraintId}`,
    shock: "r2:s3:shock",
    shockNote: "r2:s3:shocknote",
    rank: (measureId: string) => `r2:s3:rank:${measureId}`,
    justification: "r2:s3:just",
    risk: (riskId: string) => `r2:s3:risk:${riskId}`,
    riskNote: (riskId: string) => `r2:s3:risknote:${riskId}`,
    uncertainty: "r2:s3:unc",
  },
} as const;

// ---------------------------------------------------------------------------
// Material
// ---------------------------------------------------------------------------
export type MaterialSectionId = "trap" | "mcda" | "economics" | "structural";

export type MaterialSection = {
  id: MaterialSectionId;
  n: 1 | 2 | 3 | 4;
  icon: IconKey;
  kicker: string;
  title: string;
  definition: string;
  insight: string;
  takeaway: string;
  reasoning: string[];
  callout: { label: string; text: string };
  references: { label: string; url?: string }[];
};

export function materialAnchorId(id: MaterialSectionId): string {
  return `r2-material-${id}`;
}

const MATERIAL_LABELS: Record<MaterialSectionId, string> = {
  trap: "Block 1 · The three-way trap",
  mcda: "Block 2 · Weighted scoring",
  economics: "Block 3 · Contested economics",
  structural: "Block 4 · Visible vs structural",
};

export function materialRefs(ids: MaterialSectionId[]) {
  return ids.map((id) => ({ anchorId: materialAnchorId(id), label: MATERIAL_LABELS[id] }));
}

/** Standalone-ability: the one fact from Route 1 this whole route rests on. */
export const RECAP = {
  label: "Before anything else — the number this route rests on",
  text: "For a typical business laptop, roughly 75–85% of total lifetime carbon is emitted in manufacturing, not during years of use; one detailed model of a 14-inch business notebook splits it 81.4% manufacturing, 13.9% use-phase, 4.4% transport, 0.3% end-of-life. A joint TCO Certified / Öko-Institut analysis of 15 business-notebook footprint reports found that extending service life from four to six years cuts average annual emissions by about 29% — from roughly 74.7 to 53.1 kg CO₂e per device-year — purely by amortising the fixed manufacturing burden over more years.",
  implication:
    "Two ceilings follow, and you will score against both: any measure that triggers a new purchase re-triggers the dominant footprint, and any measure that only changes desk-level behaviour can by construction only influence the remaining 15–25%.",
} as const;

export const MATERIAL: MaterialSection[] = [
  {
    id: "trap",
    n: 1,
    icon: "target",
    kicker: "1 · Why intuition fails here",
    title: "Three Measures, Three Different Ways to Be Wrong",
    definition:
      "The three measures you are about to evaluate each fail in a different, non-obvious way if judged on instinct. Replacing old devices with new energy-efficient models feels green and produces immediate, visible, reportable action — but it re-triggers the manufacturing footprint that dominates the lifecycle and buys back only a small use-phase gain. A behaviour programme is cheap, popular and fast — but it is structurally capped at the 15–25% of the footprint that behaviour touches, and behaviour programmes decay without process reinforcement. Binding lifetime-extension rules touch the dominant lever directly — but they are slow, invisible for the first months, raise perceived support burden, and ask IT to change a default that exists precisely because it makes their working life easier.",
    insight:
      "Notice the shape of the trap: the measure that looks best on a sustainability slide is the one most likely to make the actual number worse, and the measure most likely to be correct is the one most likely to be rejected. That is not a coincidence — visibility and structural leverage are close to uncorrelated in this domain, and most organisations have no mechanism for telling them apart.",
    takeaway:
      "The senior-level skill being trained here is not picking the sustainable-sounding answer. It is producing a ranking that survives a CFO asking about payback, an IT lead asking about ticket volume, and a CISO asking about patch coverage — in the same meeting, without contradicting yourself.",
    reasoning: [
      "When a measure's main argument is how quickly it becomes reportable, you are looking at a visibility claim, not a leverage claim. Score it accordingly and say so out loud.",
      "A measure that changes a default outranks a measure that adds an activity, because the default keeps applying after everyone stops paying attention.",
      "Rules out the tempting wrong answer: \"more efficient device\" is a use-phase argument. It cannot answer a manufacturing-phase question, so it can never be the environmental case for early replacement.",
    ],
    callout: {
      label: "What the board has already decided",
      text: "Nordwerk's board is not asking whether to act — that argument is won. They are asking what to do first, with money for exactly one line of measures. Your ranking is the deliverable, not your enthusiasm.",
    },
    references: [
      { label: "TCO Certified & Öko-Institut e.V. — service-life extension analysis of business notebooks", url: "https://tcocertified.com" },
      { label: "Manufacturer product carbon footprint reports (Dell, HP, Lenovo business notebooks)" },
    ],
  },
  {
    id: "mcda",
    n: 2,
    icon: "layers",
    kicker: "2 · The method you will actually use",
    title: "Multi-Criteria Decision Analysis — and Where the Judgement Really Sits",
    definition:
      "When options differ on cost and carbon and acceptance and risk at the same time, they cannot be compared on a single number, and professional practice uses a weighted scoring matrix. The mechanics are five steps: define the criteria; assign weights that sum to 100; score each option against each criterion on a common scale; compute weighted totals and read the ranking; then stress-test by moving the weights within a defensible range to see whether the ranking flips.",
    insight:
      "Step two is where almost all of the real judgement sits, and it is the step most often skipped or quietly fudged. Two consultants who score every cell identically but weight differently will hand the board opposite recommendations. That is not a flaw in the method — it is the method doing its job, making a value choice explicit instead of leaving it implicit. Which is exactly why a weighting has to be justified out loud rather than buried in a spreadsheet column.",
    takeaway:
      "A matrix produces a number, and numbers look objective. They are not. The matrix makes your judgement explicit and auditable — that is its entire value. Presenting a weighted total as if it were a measurement rather than a structured argument is the most common professional misuse of this tool, and a board that catches you doing it will discount everything else you said.",
    reasoning: [
      "A ranking that survives a ±10-point weight shift is robust; one that flips is fragile. Either is a legitimate finding — but you must state which one you have, because a fragile ranking presented as a firm answer is the failure mode.",
      "Weight what the decision actually turns on, not what is easiest to measure. Budget is fixed here regardless of which measure wins, which usually means cost differentiates less than it feels like it should.",
      "Rules out the tempting wrong answer: do not adjust scores until the ranking looks right. If the ranking feels wrong, the disagreement is with your weights — argue there, in the open.",
    ],
    callout: {
      label: "Industry callout",
      text: "In a real engagement the criteria themselves are negotiated with the client before any scoring happens. Handing a client a matrix whose criteria you chose alone invites them to reject the criteria instead of engaging with the result.",
    },
    references: [
      { label: "ISO 31000 — risk management principles, on structured decision criteria" },
      { label: "Standard multi-criteria decision analysis (MCDA) practice in public and corporate appraisal" },
    ],
  },
  {
    id: "economics",
    n: 3,
    icon: "coins",
    kicker: "3 · Two credible sources that disagree",
    title: "The Contested Economics — and the Security Ceiling",
    definition:
      "You will score Economic Viability, so you need to know that the economics of lifetime extension are genuinely contested rather than settled. A vendor-published TCO analysis using Equivalent Annual Cost found that support and warranty costs rise as machines age, to the point where buying a new PC becomes cheaper than running the old one — in its model, a four-year cycle produced an equivalent annual cost roughly $47 per machine higher than a three-year cycle. A more recent fleet analysis drawing on Service Express data covering 500,000 devices over 20 years reports failure rates holding stable between 0 and 0.2% well beyond five years, and argues there is no predictable age-based failure curve at all — characterising replacement at four years without measuring condition as changing tyres at fixed mileage without checking the tread.",
    insight:
      "These are not simply one-is-wrong. They differ in scope and in incentive. The shorter-cycle analysis is vendor-published and models a fleet under a reactive support regime with no condition measurement; the longer-life analysis assumes maintained, business-grade hardware with condition data available, and documents a wide spread within the market — business lines such as ThinkPad T-series, EliteBook and Latitude 5000 realistically reaching six to seven years while consumer lines behave closer to three to four. The reconciliation a senior consultant should reach: the optimal refresh point is a function of device class, maintenance regime, and whether you measure condition at all — not a fixed number of years. Which means the real first question may not be \"three years or six\" but \"do we have condition data at all?\"",
    takeaway:
      "Against that sits a hard security ceiling that is live right now. Windows 10 reached end of support on 14 October 2025, and devices staying on it need Extended Security Updates: $61 per device in year one, then doubling — $122, then $244 — to a maximum of three years, so $427 per device across the full runway, with late joiners forced to buy the earlier years retroactively and a reduced rate near $45 per device per year for machines managed through Intune or Autopatch. ESU turns \"keep the device longer\" into a line item that grows geometrically, and a device that cannot meet Windows 11 hardware requirements has a hard extension ceiling, not a soft one. Extension is therefore never \"keep everything forever\" — it is extend where the device is technically, economically and security-wise extendable, and retire deliberately where it is not.",
    reasoning: [
      "When two sources conflict, read the Method line before the Finding line. Sources describing different populations under different regimes are not in conflict — they are answering different questions, and both can be kept.",
      "Treating a contradiction as blocking is the most common wrong move. Ask instead whether the disputed number would actually change your ranking; if it would not, record it and decide anyway.",
      "A recommendation that ignores the ESU ladder will not survive a CISO in the room. Any extension case must name what happens to devices that cannot make the security baseline.",
      "Rules out the tempting wrong answer: quoting a failure rate without naming its population is an analytical error, not a shortcut — widely cited consumer-laptop figures sit far above business-grade fleet experience.",
    ],
    callout: {
      label: "How to present contested evidence to a board",
      text: "Never present one side as settled fact. State both, name the scope difference that explains them, then say which one governs your recommendation and why. A board that discovers the other study afterwards will not forgive its omission.",
    },
    references: [
      { label: "Vendor-published TCO analysis using an Equivalent Annual Cost framework (older, reactive-support model)" },
      { label: "Fleet reliability analysis citing Service Express data, ~500,000 devices over 20 years" },
      { label: "Microsoft — Windows 10 Extended Security Updates commercial pricing and end-of-support date" },
    ],
  },
  {
    id: "structural",
    n: 4,
    icon: "shield",
    kicker: "4 · The failure mode this route trains against",
    title: "Visible vs Structural — and Deciding Before the Data Is Complete",
    definition:
      "Any measure sits somewhere on two independent axes: how visible its result is, and how much structural leverage it carries. Visible and structurally strong is rare and ideal. Visible but structurally weak is the classic trap — it produces a reportable result this quarter, consumes the budget, and leaves the underlying driver untouched. Invisible but structurally strong is the correct choice that is hardest to sell, and it survives only if you deliberately engineer early proof points into the rollout. Invisible and structurally weak should be obvious to reject, yet survives surprisingly often as inherited routine.",
    insight:
      "Two specific risks make the visible-but-weak choice more dangerous than it looks, and both are structural rather than operational. Budget lock-in: money spent cannot be redeployed to the structural measure for at least a cycle. Political closure: once management believes the topic has been handled, reopening it in twelve months is far harder than opening it the first time — the mandate itself is spent. Support tickets and employee grumbling are real consequences too, but they are recoverable; foreclosed options are not.",
    takeaway:
      "None of this waits for complete data, because real decisions are made when the cost of waiting exceeds the value of more information. Three tests make that judgement concrete. Decision-relevance: would this missing data point actually change my ranking? Reversibility: how expensive is it to reverse this in twelve months — cheap-to-reverse decisions justify acting on weaker evidence. Sequencing: can I choose a first step that generates the missing data as a by-product? Introducing a device condition assessment both starts the extension programme and produces the condition dataset whose absence was the original objection. That third move is the strongest available under uncertainty, and you should look for it before defaulting to \"we need a study first\".",
    reasoning: [
      "When asked for the risks of a visible-but-weak choice, name the ones that foreclose future options — budget lock-in and political closure — not the ones that generate complaints.",
      "Before accepting \"we need more data\", apply the sequencing test. If the missing data is a by-product of the measure you are deciding about, the data gap is an argument for starting, not for waiting.",
      "A measure that is invisible and strong needs engineered proof points in its first 90 days. If you rank one first without naming those proof points, you are recommending something that will be cancelled before it works.",
    ],
    callout: {
      label: "The sentence that usually wins the room",
      text: "\"The assessment that produces the data you are waiting for is the first deliverable of the decision you are being asked to take.\" If that sentence is true for your first-ranked measure, say it — it converts your biggest weakness into the reason to start.",
    },
    references: [
      { label: "ESRS E5 — Resource use and circular economy (EU CSRD reporting standards)" },
      { label: "Directive (EU) 2024/1799 — common rules promoting the repair of goods", url: "https://eur-lex.europa.eu/eli/dir/2024/1799/oj" },
    ],
  },
];

// ---------------------------------------------------------------------------
// Case — Nordwerk Technologies GmbH
// ---------------------------------------------------------------------------
export const CASE_BRIEF = {
  company: "Nordwerk Technologies GmbH",
  brief:
    "You have been brought in as an external workplace-IT advisor. The board has already accepted that something must be done — that argument is won. What they have not decided is what to do first. There is budget for exactly one of three proposed lines of measures this year. You have a partial dataset, two industry sources that contradict each other, and a steering committee meeting in which you must defend a ranking.",
  profile:
    "Nordwerk is a mid-sized German engineering services provider: 1,240 employees across Hamburg (HQ), Stuttgart and a small Vienna office, serving industrial and public-sector clients. Several of those clients have begun sending supplier sustainability questionnaires — which is what put this topic on the board's agenda in the first place.",
  fleet:
    "The estate: roughly 1,180 business-grade notebooks (mixed Latitude and ThinkPad T-series), 700 external monitors, 900 docking stations and 34 multifunction printers, replaced on a fixed four-year cycle. Roughly 390 devices still run Windows 10 and cannot be confirmed as Windows 11-capable without a hardware audit that has never been done.",
  budget:
    "Budget available this year: €180,000 for one line of measures, on top of the existing run-rate IT budget. Management has stated it expects visible progress within this financial year.",
} as const;

export type Stakeholder = { id: string; role: string; name: string; position: string };

export const STAKEHOLDERS: Stakeholder[] = [
  { id: "cfo", role: "CFO", name: "Ansgar Pohl", position: "Wants payback logic. Sceptical of anything without a number attached to it." },
  { id: "itops", role: "Head of IT Operations", name: "Ilka Brenner", position: "Team is at capacity. Will resist anything that raises ticket volume or fragments the fleet." },
  { id: "ciso", role: "CISO", name: "Tomás Reiner", position: "Flags the 390 Windows 10 devices as an unacceptable open risk. Will veto any plan that extends device life without addressing patch coverage." },
  { id: "hr", role: "HR / Internal Comms", name: "Meike Dorn", position: "Device quality is a recurring theme in employee satisfaction surveys. Wary of anything perceived as a downgrade." },
  { id: "sustain", role: "Sustainability Officer", name: "Júlia Ferreira", position: "Under pressure to produce defensible figures for client questionnaires and preparing for circular-economy disclosure." },
];

export type MeasureId = "A" | "B" | "C";

export type Measure = { id: MeasureId; title: string; short: string; detail: string };

export const MEASURES: Measure[] = [
  {
    id: "A",
    title: "Measure A — Binding Lifetime Extension Framework",
    short: "Lifetime extension framework",
    detail:
      "Mandatory repair / upgrade / reuse assessment before any replacement procurement: documented repair-upgrade-retire criteria, a device condition assessment process, a peripheral reuse inventory, and renegotiated leasing terms permitting condition-based extension.",
  },
  {
    id: "B",
    title: "Measure B — Green Workplace Behaviour Programme",
    short: "Behaviour programme",
    detail:
      "Company-wide communication campaign, energy-saving rules and enforced power-management defaults, printing discipline (duplex default, print-release authentication), peripheral-use guidance, and a recognition scheme for teams.",
  },
  {
    id: "C",
    title: "Measure C — Efficient Device Replacement",
    short: "Efficient device replacement",
    detail:
      "Accelerated replacement of the oldest devices with new, more energy-efficient, Windows 11-capable standard models, consolidating the estate to a single standard configuration.",
  },
];

// ---------------------------------------------------------------------------
// Stage 1 — evidence dossier. Six cards; two of them deliberately conflict.
// ---------------------------------------------------------------------------
export type ConfidenceId = "verified" | "partial" | "assumed";
export type RelevanceId = "changes" | "does-not";

export const CONFIDENCE_OPTIONS: { id: ConfidenceId; label: string }[] = [
  { id: "verified", label: "Verified" },
  { id: "partial", label: "Partial" },
  { id: "assumed", label: "Assumed" },
];

export const RELEVANCE_OPTIONS: { id: RelevanceId; label: string }[] = [
  { id: "changes", label: "Changes my ranking" },
  { id: "does-not", label: "Does not change my ranking" },
];

export type EvidenceCard = {
  id: string;
  n: number;
  finding: string;
  source: string;
  date: string;
  method: string;
  /** Part of the contradicting pair — used to fire the reconciliation panel. */
  conflictsWith?: string;
  modelConfidence: ConfidenceId;
  modelRelevance: RelevanceId;
  clue: string;
};

export const EVIDENCE_CARDS: EvidenceCard[] = [
  {
    id: "ev-lca",
    n: 1,
    finding: "Around 80% of a business laptop's lifetime carbon is emitted in manufacturing, not in use.",
    source: "Aggregated LCA reports (Dell / HP / Lenovo), reviewed by Öko-Institut",
    date: "2023–2025",
    method: "Meta-analysis of 15 published product footprints",
    modelConfidence: "partial",
    modelRelevance: "changes",
    clue: "Credible and consistent across vendors — but is it a measurement of Nordwerk's own fleet, or a model built from other people's devices?",
  },
  {
    id: "ev-win10",
    n: 2,
    finding: "390 Nordwerk devices still run Windows 10, and their Windows 11 capability is unverified.",
    source: "Internal IT asset register",
    date: "Current",
    method: "Automated inventory export; hardware capability field incomplete",
    modelConfidence: "verified",
    modelRelevance: "changes",
    clue: "The device count comes straight from the register. Ask yourself whether the uncertainty is in the count or in what the count implies.",
  },
  {
    id: "ev-esu",
    n: 3,
    finding: "Windows 10 Extended Security Updates cost $61 per device in year one, then $122, then $244.",
    source: "Microsoft published commercial pricing",
    date: "Current",
    method: "Vendor list price; excludes volume and Intune/Autopatch discounts",
    modelConfidence: "verified",
    modelRelevance: "changes",
    clue: "Published list pricing is about as verifiable as evidence gets. The open question is what it does to the cost of extending, not whether it is true.",
  },
  {
    id: "ev-nocondition",
    n: 4,
    finding: "No device condition data exists at Nordwerk — no battery health, disk health, or incident-frequency tracking.",
    source: "IT Operations confirmation",
    date: "Current",
    method: "Direct confirmation — absence of any such system",
    modelConfidence: "verified",
    modelRelevance: "changes",
    clue: "An absence confirmed directly is still a verified fact. Before tagging its relevance, ask which measure would produce this data as a by-product.",
  },
  {
    id: "ev-eac",
    n: 5,
    finding: "Support costs rise with device age: a four-year cycle showed roughly $47/year higher equivalent annual cost than a three-year cycle.",
    source: "Vendor-published TCO study using an Equivalent Annual Cost framework",
    date: "Older",
    method: "Modelled fleet, reactive support regime assumed, no condition measurement",
    conflictsWith: "ev-failure",
    modelConfidence: "partial",
    modelRelevance: "does-not",
    clue: "Read the Method line. What support regime does this model assume, and does Nordwerk have to run that regime?",
  },
  {
    id: "ev-failure",
    n: 6,
    finding: "Failure rates stay stable at 0–0.2% well beyond five years, with no predictable age-based failure curve.",
    source: "Fleet analysis citing Service Express data, ~500,000 devices over 20 years",
    date: "Recent",
    method: "Observed failure data from maintained, business-grade hardware",
    conflictsWith: "ev-eac",
    modelConfidence: "partial",
    modelRelevance: "changes",
    clue: "Observed data beats modelled data on the same question — but check first whether these two are describing the same population.",
  },
];

export type StanceId = "recent" | "independent" | "scope" | "blocking";

export const STANCES: { id: StanceId; label: string }[] = [
  { id: "recent", label: "Trust the more recent source and discard the older one" },
  { id: "independent", label: "Trust the vendor-independent source and discard the vendor-published one" },
  { id: "scope", label: "Treat both as valid within their stated scope — the difference is support regime and device class, not one being wrong" },
  { id: "blocking", label: "Treat the contradiction as blocking; commission a study before deciding" },
];

export const CONTRADICTION = {
  heading: "Two credible sources disagree",
  body: "You cannot use both as they stand. Choose the stance you would defend in the steering committee.",
  clue: "Look at the Method line on both cards. Are they describing the same population under the same conditions?",
} as const;

// ---------------------------------------------------------------------------
// Stage 2 — weights, reasoning gates, scores.
// ---------------------------------------------------------------------------
export type CriterionId = "environmental" | "economic" | "feasibility" | "leverage";

export type Criterion = {
  id: CriterionId;
  label: string;
  hint: string;
  /** Structured justification options for this criterion's weight. */
  whyOptions: { id: string; label: string }[];
  modelWeight: number;
  modelWhy: string;
};

export const CRITERIA: Criterion[] = [
  {
    id: "environmental",
    label: "Environmental Impact",
    hint: "How much of the device footprint the measure actually moves.",
    whyOptions: [
      { id: "primary", label: "It is the stated objective, and client questionnaires make it externally visible" },
      { id: "secondary", label: "It matters, but the board will judge this on cost first" },
      { id: "hygiene", label: "It is a hygiene factor — any of the three measures is defensible here" },
    ],
    modelWeight: 25,
    modelWhy: "primary",
  },
  {
    id: "economic",
    label: "Economic Viability",
    hint: "Cost, payback, and what the €180,000 actually buys.",
    whyOptions: [
      { id: "binding", label: "CFO scepticism makes payback logic the binding constraint" },
      { id: "fixed", label: "Budget is fixed regardless, so cost differentiates less than it appears to" },
      { id: "secondary", label: "Cost matters but is secondary to structural effect" },
    ],
    modelWeight: 20,
    modelWhy: "fixed",
  },
  {
    id: "feasibility",
    label: "Feasibility",
    hint: "Whether it can actually be executed this year, given capacity and prerequisites.",
    whyOptions: [
      { id: "capacity", label: "Capacity limits are binding this year, so deliverability is decisive" },
      { id: "moderate", label: "Everything here is deliverable with enough phasing" },
      { id: "low", label: "Feasibility is an implementation detail, not a selection criterion" },
    ],
    modelWeight: 20,
    modelWhy: "capacity",
  },
  {
    id: "leverage",
    label: "Strategic Leverage",
    hint: "Whether it changes the default that governs every future device decision.",
    whyOptions: [
      { id: "first", label: "The board asked what to do first — leverage is precisely the question" },
      { id: "balanced", label: "Leverage matters but is hard to evidence, so weight it moderately" },
      { id: "later", label: "Leverage is a long-term concern; this year is about visible delivery" },
    ],
    modelWeight: 35,
    modelWhy: "first",
  },
];

export const WEIGHT_TOTAL = 100;

/** A gate answer unlocks a score band — reasoning first, number second. */
export type GateOption = { id: string; label: string; band: [number, number] };

export type Gate = {
  measureId: MeasureId;
  criterionId: CriterionId;
  question: string;
  options: GateOption[];
  clue: string;
  /** Which option the answer key expects, and the score inside that band. */
  modelOption: string;
  modelScore: number;
};

export const GATES: Gate[] = [
  // --- Measure A -----------------------------------------------------------
  {
    measureId: "A",
    criterionId: "environmental",
    question: "Which lifecycle phase does a lifetime-extension policy primarily act on?",
    options: [
      { id: "use", label: "Use-phase energy consumption", band: [1, 2] },
      { id: "manufacturing", label: "Amortisation of the manufacturing footprint", band: [4, 5] },
      { id: "eol", label: "End-of-life recycling", band: [1, 3] },
      { id: "transport", label: "Transport and logistics", band: [1, 2] },
    ],
    clue: "Go back to the split in the recap. Which slice is large enough that spreading it further actually moves the annual number?",
    modelOption: "manufacturing",
    modelScore: 5,
  },
  {
    measureId: "A",
    criterionId: "economic",
    question: "Where does the money in Measure A mostly go?",
    options: [
      { id: "hardware", label: "Into hardware purchases", band: [1, 2] },
      { id: "process", label: "Into process design, criteria and assessment — cheap relative to a refresh", band: [3, 5] },
      { id: "licences", label: "Into licences and subscriptions", band: [2, 3] },
    ],
    clue: "List what Measure A actually buys. Is any of it a device?",
    modelOption: "process",
    modelScore: 4,
  },
  {
    measureId: "A",
    criterionId: "feasibility",
    question: "Nordwerk has no device condition data at all. What does that mean for Measure A?",
    options: [
      { id: "impossible", label: "A is impossible until a separate study produces the data", band: [1, 2] },
      { id: "part-of-a", label: "A can begin, because the condition assessment is itself part of A", band: [3, 4] },
      { id: "wait-audit", label: "A must wait for the Windows 11 hardware audit", band: [1, 3] },
      { id: "irrelevant", label: "Condition data is irrelevant to A", band: [1, 2] },
    ],
    clue: "Re-read what Measure A contains. Is the missing dataset a prerequisite of the measure, or one of its deliverables?",
    modelOption: "part-of-a",
    modelScore: 3,
  },
  {
    measureId: "A",
    criterionId: "leverage",
    question: "What does Measure A change that outlives the programme itself?",
    options: [
      { id: "awareness", label: "Awareness of sustainability among staff", band: [1, 2] },
      { id: "default", label: "The default that governs every future device decision", band: [4, 5] },
      { id: "estate", label: "The average age of the current estate", band: [2, 3] },
    ],
    clue: "Ask what still applies in three years when nobody remembers the project name.",
    modelOption: "default",
    modelScore: 5,
  },
  // --- Measure B -----------------------------------------------------------
  {
    measureId: "B",
    criterionId: "environmental",
    question: "What share of a device's lifetime footprint can a behaviour programme reach at best?",
    options: [
      { id: "most", label: "Most of it — behaviour drives consumption", band: [4, 5] },
      { id: "usephase", label: "Only the use-phase share, roughly 15–25%", band: [1, 2] },
      { id: "all", label: "All of it, indirectly, by changing purchasing demand", band: [2, 3] },
    ],
    clue: "Behaviour acts while the device is running. Which slice of the split is that, and how big is it?",
    modelOption: "usephase",
    modelScore: 2,
  },
  {
    measureId: "B",
    criterionId: "economic",
    question: "How does Measure B's cost profile compare with the other two?",
    options: [
      { id: "cheapest", label: "Cheapest per unit of activity — campaigns and settings, no hardware", band: [3, 5] },
      { id: "similar", label: "Broadly similar once staff time is counted", band: [2, 3] },
      { id: "expensive", label: "Most expensive, because it runs continuously", band: [1, 2] },
    ],
    clue: "Separate the cash cost from the impact. This question is only about the first one.",
    modelOption: "cheapest",
    modelScore: 4,
  },
  {
    measureId: "B",
    criterionId: "feasibility",
    question: "What does Measure B need from IT Operations, who are at ~95% ticket capacity?",
    options: [
      { id: "heavy", label: "Sustained hands-on effort per device", band: [1, 2] },
      { id: "light", label: "Mostly configuration defaults and communications — light and fast to launch", band: [4, 5] },
      { id: "audit", label: "A full fleet audit first", band: [1, 3] },
    ],
    clue: "Think about what enforcing a duplex default or a power profile actually costs in technician hours.",
    modelOption: "light",
    modelScore: 5,
  },
  {
    measureId: "B",
    criterionId: "leverage",
    question: "What typically happens to a behaviour programme's effect after the campaign ends, absent process change?",
    options: [
      { id: "compounds", label: "It compounds as habits spread", band: [4, 5] },
      { id: "holds", label: "It holds steady", band: [3, 4] },
      { id: "decays", label: "It decays back toward the previous default", band: [1, 2] },
      { id: "reverses", label: "It reverses entirely and ends worse than before", band: [1, 2] },
    ],
    clue: "The material names this pattern directly. Ask what is left carrying the behaviour once the posters come down.",
    modelOption: "decays",
    modelScore: 2,
  },
  // --- Measure C -----------------------------------------------------------
  {
    measureId: "C",
    criterionId: "environmental",
    question: "A replacement device is 20% more efficient in use. Given the lifecycle split, what is the net effect of replacing early?",
    options: [
      { id: "large", label: "A large net reduction", band: [4, 5] },
      { id: "small", label: "A small net reduction", band: [3, 4] },
      { id: "neutral", label: "Roughly neutral", band: [2, 3] },
      { id: "increase", label: "Likely a net increase, because a new manufacturing footprint is triggered", band: [1, 2] },
    ],
    clue: "The efficiency gain applies to the small slice. What does the purchase do to the large one?",
    modelOption: "increase",
    modelScore: 2,
  },
  {
    measureId: "C",
    criterionId: "economic",
    question: "What does €180,000 buy in Measure C, against a fleet of 1,180 notebooks?",
    options: [
      { id: "whole", label: "Most of the fleet — enough to change the estate", band: [4, 5] },
      { id: "segment", label: "A partial fleet segment, consuming most of the envelope", band: [1, 2] },
      { id: "pilot", label: "A pilot that proves the approach cheaply", band: [2, 4] },
    ],
    clue: "Divide the budget by a realistic business-notebook price and see what fraction of 1,180 you reach.",
    modelOption: "segment",
    modelScore: 2,
  },
  {
    measureId: "C",
    criterionId: "feasibility",
    question: "390 devices are unconfirmed for Windows 11 capability. What does that do to Measure C's feasibility?",
    options: [
      { id: "raises", label: "Raises it — replacement solves the capability problem outright", band: [3, 4] },
      { id: "lowers", label: "Lowers it — the hardware audit is a prerequisite either way", band: [2, 3] },
      { id: "none", label: "No effect on feasibility", band: [2, 3] },
      { id: "mandatory", label: "Makes C mandatory regardless of the other measures", band: [3, 5] },
    ],
    clue: "Ask what you would have to know before you could even decide which devices to replace.",
    modelOption: "lowers",
    modelScore: 3,
  },
  {
    measureId: "C",
    criterionId: "leverage",
    question: "After the refresh is complete, what governs the next replacement decision?",
    options: [
      { id: "newrule", label: "A new, better rule created by the refresh", band: [4, 5] },
      { id: "samecycle", label: "The same fixed four-year cycle as before — nothing structural changed", band: [1, 2] },
      { id: "condition", label: "Device condition, now that the fleet is uniform", band: [3, 4] },
    ],
    clue: "Did anything in Measure C change a policy, a contract, or a default — or only the hardware sitting on desks?",
    modelOption: "samecycle",
    modelScore: 2,
  },
];

export const SENSITIVITY = {
  heading: "Sensitivity test",
  body: "Shift weight between Economic Viability and Strategic Leverage by up to ±10 points and watch the totals. A ranking that survives this is robust; one that flips is fragile — both are legitimate findings, but you have to know which one you are holding.",
  options: [
    { id: "held", label: "Ranking held" },
    { id: "flipped", label: "Ranking flipped" },
  ],
  noteInstruction: "One line: what the test told you about how firm your recommendation is.",
} as const;

export const SENSITIVITY_RANGE = 10;

// ---------------------------------------------------------------------------
// Stage 3 — constraints, shock event, commitment.
// ---------------------------------------------------------------------------
export type Constraint = {
  id: string;
  text: string;
  modelMeasure: MeasureId;
  clue: string;
  modelMitigation: string;
};

export const CONSTRAINTS: Constraint[] = [
  {
    id: "budget",
    text: "Budget is fixed at €180,000 this year.",
    modelMeasure: "C",
    clue: "Which measure spends the most of that envelope for the least structural change?",
    modelMitigation: "Cap replacement to the devices that fail the security baseline, and fund the rest of the estate from the run-rate budget instead.",
  },
  {
    id: "visible",
    text: "Management expects visible progress within this financial year.",
    modelMeasure: "A",
    clue: "Which measure produces nothing a manager can point to for the first few months?",
    modelMitigation: "Engineer early proof points: publish the first condition-assessment results and the peripheral reuse count within 90 days.",
  },
  {
    id: "productivity",
    text: "Employees must not be restricted in their productivity.",
    modelMeasure: "B",
    clue: "Which measure is the one people actually feel as a rule imposed on their working day?",
    modelMitigation: "Implement as defaults rather than mandates — duplex and power profiles set centrally, with a documented opt-out for genuine exceptions.",
  },
  {
    id: "win11",
    text: "390 devices are unverified for Windows 11 capability.",
    modelMeasure: "A",
    clue: "Which measure is the one a CISO would veto if this is left unanswered?",
    modelMitigation: "Carve out a security-driven retirement path inside the framework: devices that cannot meet the baseline are retired deliberately, not extended.",
  },
];

export const MITIGATION_INSTRUCTION =
  "One concrete action that reduces this constraint's impact on the measure you placed it on — not a restatement of the problem.";

export const SHOCK = {
  heading: "Mid-year update",
  body: "A major client's supplier questionnaire now requires reporting on device lifecycle and reuse rates, with a response deadline in four months.",
  question: "Does your ranking change?",
  options: [
    { id: "unchanged", label: "Unchanged" },
    { id: "changed", label: "Changed" },
  ],
  noteInstruction: "One line: why the new requirement does or does not move your ranking.",
  modelAnswer: "unchanged",
} as const;

export type RiskId = "budget-lock" | "political-closure" | "tickets" | "dissatisfaction" | "vendor-lock" | "reporting";

export const RISKS: { id: RiskId; label: string; isModel: boolean; why: string }[] = [
  { id: "budget-lock", label: "Budget lock-in", isModel: true, why: "Money spent on the weak measure cannot be redeployed to the structural one for at least a cycle." },
  { id: "political-closure", label: "Political closure", isModel: true, why: "Once management believes the topic is handled, the mandate to act again is spent — reopening is far harder than opening." },
  { id: "tickets", label: "Increased support tickets", isModel: false, why: "Real, but operational and recoverable — it does not foreclose a future option." },
  { id: "dissatisfaction", label: "Employee dissatisfaction", isModel: false, why: "A genuine consequence, but it generates complaints rather than closing off the structural route." },
  { id: "vendor-lock", label: "Vendor lock-in", isModel: false, why: "Plausible in procurement generally, but not the specific risk created by choosing a visible-but-weak measure." },
  { id: "reporting", label: "Reporting inaccuracy", isModel: false, why: "A data-quality risk, not a structural one — it can be corrected without spending another cycle." },
];

export const RISK_PICK_COUNT = 2;

export const JUSTIFICATION_INSTRUCTION =
  "Defend your first-ranked measure in terms a CFO, an IT Operations lead and a CISO would each accept. Reference at least one evidence card by number.";
export const UNCERTAINTY_INSTRUCTION =
  "Name one decision you are taking now despite incomplete information, and state why waiting would cost more than deciding.";
export const RISK_NOTE_INSTRUCTION = "One line: the concrete consequence at Nordwerk.";
export const JUSTIFICATION_MIN_WORDS = 15;
export const UNCERTAINTY_MIN_WORDS = 12;

// ---------------------------------------------------------------------------
// Mentor answer keys
// ---------------------------------------------------------------------------
export const CONFIDENCE_KEY_SUMMARY =
  "Verified: cards 2, 3, 4 (internal records and published vendor pricing — including card 4, since a directly confirmed absence is still a verified fact). Partial: cards 1, 5, 6 (credible but modelled, dated, or scope-limited). Assumed: none in this shortened dossier. Decision-relevant: 1, 2, 3, 4, 6. Not decision-relevant: 5 — the EAC study shapes how you would implement under a reactive support regime, but it does not by itself flip which measure is structurally strongest.";

export const STANCE_ANSWER_KEY: AnswerKeyBlock = {
  prompt: "Reconciling the contradiction (cards 5 and 6)",
  items: [
    { option: "Both valid within their stated scope", verdict: "pick", why: "The difference is explained by support regime and device class — one models a reactive regime with no condition measurement, the other observes maintained business-grade hardware. Neither is false; they answer different questions." },
    { option: "Trust the more recent source", verdict: "avoid", why: "Recency alone is not a reason. It discards a finding that is still true inside its own scope, and it teaches the learner to rank evidence by date rather than by method." },
    { option: "Trust the vendor-independent source", verdict: "avoid", why: "Independence is a real consideration and worth naming — but used alone it is a heuristic, not an analysis, and it still throws away usable scope-limited information." },
    { option: "Treat as blocking; commission a study", verdict: "avoid", why: "The most common wrong answer, and the one to challenge hardest: analysis paralysis dressed as rigour. It also ignores that Measure A itself generates the missing condition data." },
  ],
  teachingNote:
    "If a participant defends the independence answer well, accept the reasoning and then push: what would you do with the vendor study's finding about reactive support regimes, given Nordwerk runs exactly that regime today? The scope answer is the one that keeps both usable.",
};

export const WEIGHT_ANSWER_KEY: AnswerKeyBlock = {
  prompt: "Criteria weighting (one defensible allocation, not the only one)",
  items: [
    { option: "Environmental Impact 25", verdict: "pick", why: "Primary stated objective, and client questionnaires make it externally visible." },
    { option: "Economic Viability 20", verdict: "pick", why: "Budget is fixed regardless of which measure wins, so cost differentiates less than it feels like it should." },
    { option: "Feasibility 20", verdict: "pick", why: "Capacity limits are binding this year — an undeliverable plan scores zero in practice." },
    { option: "Strategic Leverage 35", verdict: "pick", why: "The board asked what to do first. Leverage is literally the question being asked." },
    { option: "Economic Viability above 30", verdict: "avoid", why: "Not a miscalculation — a revealed priority. It surfaces Measure C, and the debrief point is that the matrix did not decide, the weighting did." },
  ],
  teachingNote:
    "There is no single correct allocation. Judge whether the learner can say out loud what their weighting implies about the organisation's priorities — that sentence is the actual deliverable of this step.",
};

export const MATRIX_ANSWER_KEY: AnswerKeyBlock = {
  prompt: "Model scores and resulting ranking",
  items: [
    { option: "A: 5 / 4 / 3 / 5 → ≈4.40", verdict: "pick", why: "Acts on the dominant lifecycle phase, costs process rather than hardware, can start because the assessment is part of it, and changes the governing default." },
    { option: "B: 2 / 4 / 5 / 2 → ≈3.00", verdict: "pick", why: "Cheap and highly deliverable, but capped at the use-phase share and decays without process reinforcement. A legitimate second." },
    { option: "C: 2 / 2 / 3 / 2 → ≈2.20", verdict: "pick", why: "Note it scores 2 on environmental impact, not 1 — it does deliver a real use-phase gain and resolves Windows 11 capability for the devices it touches. Scoring it 1 is over-correction." },
    { option: "Ranking C first", verdict: "avoid", why: "Almost always produced by weighting Economic Viability very high while scoring environmental impact on the marketed efficiency number rather than the lifecycle split." },
  ],
  teachingNote:
    "Weighted totals shown use the model weights (25/20/20/35). A learner with different weights will get different totals — check the reasoning behind the gates, not the arithmetic.",
};

export const CONSTRAINT_KEY_SUMMARY =
  "Model placements: fixed budget → C (consumes the most envelope for the least structural return) · visible progress → A (slowest to show results; mitigation must engineer early proof points) · productivity not restricted → B (behaviour rules are where restriction is actually felt) · 390 unverified devices → A (the CISO's veto point, and the single most important mitigation in this task: extension must contain a deliberate security-driven retirement path).";

export const SHOCK_ANSWER_KEY: AnswerKeyBlock = {
  prompt: "Shock event — does the ranking change?",
  items: [
    { option: "Unchanged", verdict: "pick", why: "A questionnaire demanding lifecycle and reuse data strengthens A: it is the only measure that produces the requested data as an operational by-product." },
    { option: "Changed — move C up", verdict: "avoid", why: "Confuses visible action with reportable data. A refresh produces new hardware, not a lifecycle dataset, and the questionnaire asks for the latter." },
    { option: "Changed — move B up", verdict: "avoid", why: "A behaviour programme generates engagement statistics, not device lifecycle or reuse rates. It answers a different question than the one the client asked." },
  ],
  teachingNote:
    "The instructive failure here is a learner whose ranking moves because the pressure changed rather than because the evidence did. Ask them which new fact changed their reasoning — if they cannot name one, the original ranking was convenient rather than robust.",
};

export const RISK_ANSWER_KEY: AnswerKeyBlock = {
  prompt: "Two risks of a visible-but-structurally-weak choice",
  items: [
    { option: "Budget lock-in", verdict: "pick", why: "The spend cannot be redeployed for at least a cycle — the structural measure is not merely delayed, it is unfunded." },
    { option: "Political closure", verdict: "pick", why: "Management believes the topic is handled, so the mandate to act is gone. This is the one that ends programmes." },
    { option: "Increased support tickets", verdict: "avoid", why: "Real and concrete, which is exactly why learners pick it — but it is an operational consequence, recoverable next quarter." },
    { option: "Employee dissatisfaction", verdict: "avoid", why: "Same category: it generates complaints, not foreclosed options." },
    { option: "Vendor lock-in", verdict: "avoid", why: "A genuine procurement risk in general, but not the risk created by choosing visibility over structure." },
    { option: "Reporting inaccuracy", verdict: "avoid", why: "A data-quality problem that can be fixed without spending another budget cycle." },
  ],
  teachingNote:
    "Learners reach for operational risks because they are more concrete. The teaching point is that the dangerous risks of a weak choice are the ones that foreclose future options, not the ones that generate complaints.",
};

export const UNCERTAINTY_ANSWER_NOTE =
  "Model: \"We commit now to condition-based extension as the governing default, despite having no condition data, because the assessment process that produces that data is the first deliverable of the measure itself. Waiting for the data would cost a full budget cycle — and would have to be funded from the very budget the decision is about.\" A strong answer names the decision, the missing information, and the cost of the delay. A weak one names only the uncertainty.";

export const MISCONCEPTIONS: { wrong: string; why: string; redirect: string }[] = [
  { wrong: "Newer devices are greener, so C is the sustainable choice", why: "Use-phase efficiency is the visible, marketed number", redirect: "Point at the lifecycle split and ask which phase C actually acts on." },
  { wrong: "We can't decide until the contradiction is resolved", why: "Rigour instinct, genuinely well-intentioned", redirect: "Apply the sequencing test — the first measure generates the missing data." },
  { wrong: "B is the safest start because it's cheap and popular", why: "Confuses low risk of failure with high value of success", redirect: "Ask what the ceiling on B's impact is, given the split." },
  { wrong: "A is impossible without condition data first", why: "Treats A as one monolithic step", redirect: "A is the condition assessment; the objection describes A's first phase." },
  { wrong: "The CISO's Windows 10 concern kills A", why: "Reads extension as \"keep everything forever\"", redirect: "Extension is condition-based and security-gated; non-upgradable devices are retired deliberately within A." },
];

// ---------------------------------------------------------------------------
// Task copy
// ---------------------------------------------------------------------------
export const TASK2 = {
  kicker: "Task 1",
  heading: "The Nordwerk Prioritisation Board",
  intro:
    "Nordwerk is fictional, built so you can apply the method above under real constraints. Three stages, about 13 minutes: audit the evidence you have been given, score the three measures through a weighted matrix that makes you reason before you rate, then stress-test your ranking and commit to it. The memo on the right fills in as you go — that is what you export.",
  orderBanner:
    "Suggested order: Stage 1 → 3. Nothing is locked — the memo builds from whatever you have answered, whichever stage you start with.",
  stage1: {
    heading: "Stage 1 — Audit the evidence",
    instructions: "Flip each card to see where it came from, then rate how far you trust it and whether it would actually change your ranking.",
    material: ["mcda", "economics"] as MaterialSectionId[],
  },
  stage2: {
    heading: "Stage 2 — Score the three measures",
    instructions:
      "Set the weights, then work the matrix. Each cell asks you to reason before it lets you rate — the available score band follows from the answer you give.",
    material: ["trap", "mcda"] as MaterialSectionId[],
  },
  stage3: {
    heading: "Stage 3 — Stress-test and commit",
    instructions: "Place each constraint on the measure it most threatens, answer the mid-year update, then commit to a ranking and defend it.",
    material: ["structural", "economics"] as MaterialSectionId[],
  },
  export: {
    docHeading: "Prioritisation Decision Memo",
    filenameLevel: 2,
    filenameTask: 1,
  },
} as const;
