/**
 * Route 3 — Management Decision (L3). Building a decision architecture for
 * workplace IT, user behaviour and device service life. Case: BrightPath
 * Corporate Services (fictional).
 *
 * Standalone like Route 2: the recap block carries the two facts everything
 * here rests on, so a learner starting at Route 3 is never missing a premise.
 */

import type { IconKey } from "@/lib/routes";
import type { AnswerKeyBlock } from "@/lib/answerKey";

export const LEARNER_NAME_KEY = "learner:name";

// ---------------------------------------------------------------------------
// Store key map
// ---------------------------------------------------------------------------
export const R3 = {
  name: LEARNER_NAME_KEY,
  stage1: {
    driver: (driverId: string) => `r3:s1:driver:${driverId}`,
    decision: (decisionId: string) => `r3:s1:dec:${decisionId}`,
    order: (decisionId: string) => `r3:s1:ord:${decisionId}`,
    resolution: "r3:s1:resolution",
  },
  stage2: {
    threshold: (key: string) => `r3:s2:th:${key}`,
    outcomeMark: (deviceId: string) => `r3:s2:mark:${deviceId}`,
    iterations: "r3:s2:iterations",
    exceptionPath: "r3:s2:exception",
    reasonCode: (codeId: string) => `r3:s2:code:${codeId}`,
  },
  stage3: {
    raci: (decisionId: string, roleId: string) => `r3:s3:raci:${decisionId}:${roleId}`,
    tradeoffOwner: (tradeoffId: string) => `r3:s3:towner:${tradeoffId}`,
    tradeoffDefault: (tradeoffId: string) => `r3:s3:tdef:${tradeoffId}`,
    indicator: (indicatorId: string) => `r3:s3:ind:${indicatorId}`,
    cadence: (indicatorId: string) => `r3:s3:cad:${indicatorId}`,
    trigger: "r3:s3:trigger",
    challenge: (challengeId: string) => `r3:s3:ch:${challengeId}`,
    challengeNote: (challengeId: string) => `r3:s3:chnote:${challengeId}`,
    commitment: "r3:s3:commitment",
  },
} as const;

// ---------------------------------------------------------------------------
// Material
// ---------------------------------------------------------------------------
export type MaterialSectionId = "architecture" | "rules" | "accountability" | "review";

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
  return `r3-material-${id}`;
}

const MATERIAL_LABELS: Record<MaterialSectionId, string> = {
  architecture: "Block 1 · Measures vs architecture",
  rules: "Block 2 · Rules & thresholds",
  accountability: "Block 3 · Accountability",
  review: "Block 4 · Review & regulation",
};

export function materialRefs(ids: MaterialSectionId[]) {
  return ids.map((id) => ({ anchorId: materialAnchorId(id), label: MATERIAL_LABELS[id] }));
}

export const RECAP = {
  label: "The two facts this route builds on",
  text: "Roughly 75–85% of a business laptop's lifetime carbon is emitted in manufacturing, not in use — one detailed model splits a 14-inch business notebook 81.4% manufacturing, 13.9% use, 4.4% transport, 0.3% end-of-life — and extending service life from four to six years cuts average annual emissions by about 29%, from roughly 74.7 to 53.1 kg CO₂e per device-year, purely by amortising that fixed burden. It follows that desk-level behaviour can only ever influence the remaining 15–25%, while the decisions with real leverage — replacement cycles, repair defaults, support model, procurement specification — are all management decisions nobody on the office floor gets to make.",
  implication:
    "So you are no longer being asked which measure is best. You are being asked to design the structure that keeps producing good decisions after you leave the room.",
} as const;

export const MATERIAL: MaterialSection[] = [
  {
    id: "architecture",
    n: 1,
    icon: "layers",
    kicker: "1 · The distinction the whole route turns on",
    title: "A List of Measures Is Not a Decision Architecture",
    definition:
      "A list of measures answers what will we do this year. A decision architecture answers how will this organisation decide, repeatedly, without re-litigating the principle every time. Five components make one: decision rules and thresholds (when does X happen instead of Y), accountability assignment (who decides, who is consulted, who merely executes), approval thresholds (what can be decided locally versus what must escalate), a review mechanism (how do we know the rule is still working), and trade-off defaults (what happens when two valid principles collide).",
    insight:
      "The difference is not academic, and each missing component has a predictable failure mode. Without thresholds, every case escalates and the outcome depends on who is on shift. Without single-point accountability, conflicts stall or are resolved by whoever pushes hardest. Without approval logic you get either a bottleneck at the top or uncontrolled local variation. Without review, the policy exists on paper while reality quietly diverges from it. Without stated trade-off defaults, the loudest stakeholder wins every time by default.",
    takeaway:
      "The senior-level test for any proposal is one question: if the person who wrote this leaves the company in six months, does the behaviour it produces continue? If the answer is no, what was written was a measure, not an architecture. A measure list degrades on a schedule you can predict — the sponsor moves on, the budget line closes, the next procurement round is handled by someone who was not in the original meeting, and the organisation reverts to its previous default.",
    reasoning: [
      "When selecting what a board should decide, prefer the decision that changes a default over the one that funds an activity. Defaults keep applying after attention moves on.",
      "Any decision that requires another decision to exist before it can be executed must come after that one. Sequencing is not presentation order — it is dependency order.",
      "Rules out the tempting wrong answer: publishing an external commitment early feels like momentum, but a commitment made before the capability exists is the visible-but-weak trap at board level.",
    ],
    callout: {
      label: "Why BrightPath has already failed at this twice",
      text: "Two previous consultancy reports recommended broadly sensible measures and neither changed behaviour — because neither changed a default. The board is not sceptical of the topic; it is sceptical of another list.",
    },
    references: [
      { label: "ESRS E5 — Resource use and circular economy (EU CSRD reporting standards)" },
      { label: "COBIT / ISO 38500 governance principles on decision rights and accountability" },
    ],
  },
  {
    id: "rules",
    n: 2,
    icon: "gavel",
    kicker: "2 · The part most proposals skip",
    title: "Decision Rules, Thresholds and Escalation",
    definition:
      "\"We will repair before we replace\" is a principle, not a rule. A technician holding a four-year-old notebook with a failing battery and a cracked hinge cannot act on it. A rule is falsifiable and threshold-based: repair is the default where estimated repair cost is at or below 30% of current replacement cost AND the device meets the current security baseline AND remaining supported life is at least 18 months — where any condition fails, retire. Useful threshold families for workplace IT are repair-cost ratio, minimum remaining supported life, a device condition score built from battery health, storage health and incident frequency, security-baseline compliance, and a reuse-before-purchase check on peripherals.",
    insight:
      "Three design properties decide whether a rule survives contact with a service desk. It must be locally applicable — if applying it needs a judgement the technician is not authorised to make, it will be bypassed. It must state its own exception path, because a rule with no defined escalation route gets broken silently rather than escalated. And it must be tested against real cases before publication: this is the step almost universally skipped, and a rule that reads sensibly in a policy document can produce absurd outcomes on real devices. Approval design follows the same logic — technicians apply published thresholds with no approval, team leads handle exceptions within a cost band against logged reason codes, steering owns changes to the thresholds themselves, and the board owns only the principle, the budget envelope and the accountability assignment.",
    takeaway:
      "Watch the escalation volume: it should be low but non-zero. Zero escalations means the rule is being bypassed rather than followed; high volume means the thresholds are mis-set. And on the familiar objection that condition-based thresholds are impossible without condition data — the correct move is not to postpone, it is to make the condition assessment itself the first deliverable of the policy, so the policy generates the data its own thresholds require.",
    reasoning: [
      "Age is not a criterion. Age is a proxy for condition and remaining supported life — and if your rule measures those directly, putting age back in double-counts a thing you already have.",
      "Security belongs in the rule as a hard constraint, not in the consultation as an opinion. A cheap, high-condition, non-compliant device must still retire, or the baseline erodes case by case.",
      "Before publishing any threshold, run it against real devices and ask of each outcome: did I intend this? An outcome you did not intend is a mis-set threshold, not an unusual device.",
      "Rules out the tempting wrong answer: a role-based exception for executives is not forbidden — but it must be written into the rule and its cost owned. A silent exception destroys the rule's authority everywhere else.",
    ],
    callout: {
      label: "Industry callout",
      text: "The tightest threshold is rarely the best one. A 20% repair ceiling retires machines with high condition scores and years of supported life left, which contradicts the purpose of the policy while looking prudent on paper.",
    },
    references: [
      { label: "Directive (EU) 2024/1799 — common rules promoting the repair of goods", url: "https://eur-lex.europa.eu/eli/dir/2024/1799/oj" },
      { label: "Microsoft — Windows 10 end of support and Extended Security Updates pricing" },
    ],
  },
  {
    id: "accountability",
    n: 3,
    icon: "supplier",
    kicker: "3 · Who actually decides",
    title: "Accountability, and the Trade-offs a Board Must Own",
    definition:
      "RACI assigns, per decision: Responsible does the work, Accountable owns the outcome and is exactly one person, Consulted gives input before the decision, Informed is told after. Two rules are violated constantly. First, exactly one Accountable per decision — two Accountables is not shared ownership, it is a guaranteed stall the first time they disagree; if a decision genuinely spans two domains, split the decision or name the tie-breaker explicitly. Second, Consulted is not a veto: a stakeholder whose objection cannot be overruled is functionally Accountable, and the chart is lying.",
    insight:
      "That second rule matters most with security. A CISO consulted on lifetime extension will, correctly, hold a hard veto over devices outside the security baseline — so that veto must be written as a constraint inside the rule, not as a consultation. Constraints belong in the threshold; opinions belong in the consultation. Get this right and the CISO becomes co-author of the extension policy rather than its blocker. The other classic failure is making sustainability Accountable for device lifetime — an outcome actually controlled by procurement contracts, IT support defaults and finance depreciation schedules, none of which the sustainability function can change. Accountability without control produces reporting, not results.",
    takeaway:
      "Some conflicts cannot be delegated downward at all, and each needs a named owner and a stated default: security versus lifetime extension, user experience versus standardisation, short-term visibility versus structural effect, support effort versus device longevity, and cost certainty versus condition-based flexibility. Naming the default in advance — \"where security baseline and extension conflict, security prevails and the device is retired early\" — is what stops every individual case from becoming a negotiation.",
    reasoning: [
      "Before assigning Accountable, ask which contract, budget line or default that role can actually change. If the answer is none, you are assigning reporting duty, not accountability.",
      "If a stakeholder's objection cannot be overruled, either they are Accountable or their constraint belongs inside the rule. Never leave a veto sitting in the Consulted column.",
      "Individual device exceptions belong as low as they can safely sit — the service desk team lead, against logged reason codes — or the escalation path becomes the bottleneck it was meant to prevent.",
    ],
    callout: {
      label: "The sentence that resolves the security argument",
      text: "\"The security baseline is a hard constraint inside the rule, and the CISO owns its definition.\" That single design choice is what lets a CISO be Consulted rather than Accountable on the repair threshold without the chart becoming fiction.",
    },
    references: [
      { label: "ISO/IEC 38500 — corporate governance of information technology" },
      { label: "Standard RACI practice in IT service management (ITIL-aligned)" },
    ],
  },
  {
    id: "review",
    n: 4,
    icon: "certificate",
    kicker: "4 · Knowing it still works, under moving rules",
    title: "Review Mechanisms and the European Regulatory Horizon",
    definition:
      "A published policy is an assumption, not an outcome; review mechanisms convert it into something observable. Four indicators carry most of the signal for workplace IT: average fleet age and its distribution (an average that rises while the distribution stays bimodal means extension is happening in only one pocket), the repair-to-replace ratio (the direct behavioural indicator of whether the default actually changed), exception rate and reason codes (the most diagnostic metric — a cluster on one reason code tells you exactly which threshold is mis-set), and peripheral reuse rate (usually fastest-moving, which makes it useful as an early proof point). Cadence matters as much as choice: quarterly operational review, annual strategic review. A single annual review is too slow to catch a mis-set threshold before a full procurement cycle has passed.",
    insight:
      "A board will ask whether it is premature to commit while the rules are still moving. The honest answer is that the rules are always moving and the direction of travel is far more stable than the detail. The EU Right to Repair Directive (2024/1799) obliges manufacturers of covered categories to offer repair at reasonable price and time, including after the guarantee expires, and member states must transpose it by 31 July 2026; smartphones and tablets have carried a mandatory A–E repairability label since June 2025, and laptops sit in the ESPR work plan that expands these requirements. ESRS E5 under CSRD governs disclosure of resource inflows and outflows and circular-economy performance, remaining required where circularity is material for companies above the Omnibus thresholds of 1,000+ employees and over €450m turnover — and that standard is itself being simplified and restructured as it moves through the EU process.",
    takeaway:
      "The senior-level reading: the detail of what must be disclosed is in flux, the direction is not. An organisation that holds device condition data, a repair-to-replace ratio and a reuse rate can answer any version of the question. One that holds none of these cannot answer any version. That asymmetry is the argument for acting now, and it does not depend on predicting the final text of anything. Present it that way to a board — and when citing specific datapoint obligations, verify the current status first, because a revision in progress is exactly where confident citation becomes wrong citation.",
    reasoning: [
      "Choose indicators that would visibly move if the policy worked, and that would visibly stall if it did not. An indicator that looks the same either way is decoration.",
      "A trigger condition must be recognisable by someone reading the quarterly report without asking you what you meant. \"More than 25% of exceptions in a quarter on one reason code\" qualifies; \"if things look wrong\" does not.",
      "Rules out the tempting wrong answer: regulatory uncertainty is an argument for building the data capability now, not for waiting. The capability is what makes any final text answerable.",
    ],
    callout: {
      label: "How to present a moving regulation to a board",
      text: "State the in-force position, name what is under revision, and say which of your recommendations depends on the outcome. In this case: none of them do — which is precisely why it is safe to decide today.",
    },
    references: [
      { label: "Directive (EU) 2024/1799 — repair of goods; transposition deadline 31 July 2026", url: "https://eur-lex.europa.eu/eli/dir/2024/1799/oj" },
      { label: "Regulation (EU) 2024/1781 — Ecodesign for Sustainable Products Regulation (ESPR)", url: "https://eur-lex.europa.eu/eli/reg/2024/1781/oj" },
      { label: "ESRS E5 — Resource use and circular economy, under the EU CSRD (revision in progress)" },
    ],
  },
];

// ---------------------------------------------------------------------------
// Case — BrightPath Corporate Services
// ---------------------------------------------------------------------------
export const CASE_BRIEF = {
  company: "BrightPath Corporate Services",
  brief:
    "You are the incoming Head of Workplace Strategy. The board has read two previous consultant reports on this topic and implemented neither, because both delivered a list of recommendations rather than a way of deciding. You have one board session. Do not bring them a list — bring an architecture, and be ready to defend the one decision you are taking before the data is complete.",
  profile:
    "BrightPath is a European business-services group headquartered in Düsseldorf: 3,100 employees across seven countries, providing finance, HR and administrative outsourcing to enterprise clients. It sits comfortably above the CSRD Omnibus thresholds and already reports under ESRS.",
  estate:
    "The estate: roughly 3,400 notebooks, 2,100 monitors, 2,600 docking stations and 96 multifunction printers, plus a growing population of client-site devices governed by client security requirements.",
  state: [
    "Replacement runs on inherited fixed cycles that differ by country — three years in three countries, four in three others, and one site with no documented cycle at all.",
    "Support is reactive and structurally prefers replacement over repair — not by policy, but because replacement is the faster path to closing a ticket.",
    "No device condition data is collected anywhere in the group.",
    "Procurement, IT Operations, Finance, HR, Security and Sustainability each hold a piece of the decision; none holds the whole.",
    "The group's largest client has begun requesting device lifecycle and reuse data as part of its own supply-chain reporting.",
  ],
  boardExpectation:
    "The board will approve a principle, a budget envelope and an accountability assignment — nothing more granular. Everything else must be designed to work without them.",
} as const;

export type RoleId =
  | "cio"
  | "itops"
  | "procurement"
  | "cfo"
  | "ciso"
  | "hr"
  | "sustainability"
  | "countryIt"
  | "serviceDesk";

export const ROLES: { id: RoleId; label: string }[] = [
  { id: "cio", label: "CIO" },
  { id: "itops", label: "Head of IT Operations" },
  { id: "procurement", label: "Head of Procurement" },
  { id: "cfo", label: "CFO" },
  { id: "ciso", label: "CISO" },
  { id: "hr", label: "Head of HR" },
  { id: "sustainability", label: "Sustainability Officer" },
  { id: "countryIt", label: "Country IT Lead" },
  { id: "serviceDesk", label: "Service Desk Team Lead" },
];

/** The RACI grid uses a six-role subset so it stays readable; the rest appear in trade-off ownership. */
export const RACI_ROLES: RoleId[] = ["cio", "itops", "procurement", "ciso", "sustainability", "serviceDesk"];

// ---------------------------------------------------------------------------
// Stage 1 — strategic framing and the three guiding decisions
// ---------------------------------------------------------------------------
export type Driver = {
  id: string;
  label: string;
  isModel: boolean;
  /** Fires when a weaker driver is selected — a question, never a verdict. */
  counterPrompt?: string;
  why: string;
};

export const DRIVERS: Driver[] = [
  {
    id: "client",
    label: "Client supply-chain reporting requests are already arriving",
    isModel: true,
    why: "Present-tense, specific to BrightPath, and attached to a revenue consequence — the strongest board driver available.",
  },
  {
    id: "manufacturing",
    label: "Manufacturing dominates device lifecycle carbon, so replacement cycles are the primary lever",
    isModel: true,
    why: "The technical justification for which lever to pull. Without it the proposal has no reason to prefer extension over refresh.",
  },
  {
    id: "fragmented",
    label: "Fragmented country-level cycles create uncontrolled cost and carbon variance",
    isModel: true,
    why: "Internal, controllable and the clearest quantifiable inefficiency in the group.",
  },
  {
    id: "regulatory",
    label: "Regulatory direction (ESRS E5, Right to Repair / ESPR) makes lifetime data a foreseeable requirement",
    isModel: false,
    counterPrompt:
      "Strong — but forward-looking. Would this alone get a budget approved this year, or does it work better as reinforcement behind a present-tense driver?",
    why: "Entirely defensible as a third choice, and a fully acceptable substitute for the fragmentation driver. Best used as reinforcement rather than lead.",
  },
  {
    id: "expectations",
    label: "Employees expect modern equipment",
    isModel: false,
    counterPrompt: "Is this a driver for changing how you decide, or a constraint on whatever you decide?",
    why: "An operational constraint, not a strategic driver — it shapes implementation, not direction.",
  },
  {
    id: "competitors",
    label: "Competitors are publishing sustainability commitments",
    isModel: false,
    counterPrompt:
      "Would this driver still justify the investment if no competitor had published anything? If not, is it a driver or a comparison?",
    why: "A comparison, not a reason. A board cannot allocate budget against someone else's press release.",
  },
  {
    id: "supportcost",
    label: "IT support costs are rising",
    isModel: false,
    counterPrompt: "Is rising support cost the problem itself, or a symptom of the missing decision rule?",
    why: "An operational symptom. Real, but it points at the mechanism rather than being the strategic case.",
  },
  {
    id: "right",
    label: "Sustainability is the right thing to do",
    isModel: false,
    counterPrompt: "True — but what would a board do differently on Monday because of it?",
    why: "True and not board-actionable on its own. It cannot be prioritised against, budgeted against, or reviewed.",
  },
];

export const DRIVER_PICK_COUNT = 3;

export type GuidingDecision = {
  id: string;
  letter: string;
  label: string;
  isModel: boolean;
  modelOrder?: number;
  why: string;
};

export const GUIDING_DECISIONS: GuidingDecision[] = [
  { id: "condition-default", letter: "A", label: "Adopt condition-based replacement as the group-wide default, replacing fixed cycles", isModel: true, modelOrder: 3, why: "The substantive change — and only executable once someone owns it and the security ceiling exists." },
  { id: "behaviour", letter: "B", label: "Approve a group-wide behaviour and communication programme", isModel: false, why: "Worth doing eventually, but it works the 15–25% slice and changes no default." },
  { id: "accountability", letter: "C", label: "Assign single-point accountability for workplace device lifecycle", isModel: true, modelOrder: 1, why: "First, because every other decision needs an owner — without it the rest have no one to execute them." },
  { id: "refresh", letter: "D", label: "Fund an immediate refresh of the oldest devices", isModel: false, why: "Re-triggers the dominant manufacturing footprint and consumes the envelope. The visible-but-weak trap." },
  { id: "reuse", letter: "E", label: "Mandate reuse-before-purchase for peripherals", isModel: false, why: "A good early proof point, but too narrow to be one of only three board-level decisions." },
  { id: "audit", letter: "F", label: "Commission a full fleet condition audit before any policy change", isModel: false, why: "The most frequent wrong answer: it defers the decision by a full cycle, and the audit is a deliverable of A rather than a prerequisite to deciding it." },
  { id: "baseline", letter: "G", label: "Set a group-wide security baseline that defines the hard ceiling on extension", isModel: true, modelOrder: 2, why: "Second, because it defines the hard ceiling on extension — setting it before A converts the CISO from blocker to co-author." },
  { id: "contracts", letter: "H", label: "Renegotiate leasing and procurement contracts to permit condition-based extension", isModel: false, why: "The strongest near-miss, and a defensible substitution for A in position three — contracts are the binding constraint in practice." },
  { id: "commitment", letter: "I", label: "Publish an external sustainability commitment on device lifetime", isModel: false, why: "Commits publicly before the capability exists — the visible-but-weak trap at board level." },
];

export const DECISION_PICK_COUNT = 3;
export const SEQUENCE_CLUE =
  "Does any decision you selected require another one to have already happened before it can be executed?";
export const RESOLUTION_INSTRUCTION =
  "Write your first-sequenced decision the way the board would minute it — a decision, not an intention. \"The board approves…\", not \"We should consider…\".";
export const RESOLUTION_MIN_WORDS = 10;

// ---------------------------------------------------------------------------
// Stage 2 — the rule builder and its test bench
// ---------------------------------------------------------------------------
export type ThresholdKey = "repairCeiling" | "supportedLife" | "condition" | "security" | "peripheral";

export type ThresholdDef = {
  key: ThresholdKey;
  label: string;
  hint: string;
  options: { id: string; label: string; consequence: string }[];
  modelOption: string;
};

export const THRESHOLDS: ThresholdDef[] = [
  {
    key: "repairCeiling",
    label: "Repair cost ceiling",
    hint: "Repair is allowed while estimated repair cost stays at or below this share of current replacement cost.",
    options: [
      { id: "20", label: "20%", consequence: "Tight. Retires machines in good condition with years of supported life left." },
      { id: "30", label: "30%", consequence: "Common industry setting — repairs most economically sensible cases without funding near-replacement repairs." },
      { id: "40", label: "40%", consequence: "Generous. Keeps more devices but approaches the cost of a new machine on expensive repairs." },
      { id: "50", label: "50%", consequence: "Very generous. Half the price of a new device is hard to defend to a CFO." },
    ],
    modelOption: "30",
  },
  {
    key: "supportedLife",
    label: "Minimum remaining supported life",
    hint: "How much vendor-supported life a device must still have for a repair to be worth funding.",
    options: [
      { id: "6", label: "6 months", consequence: "Permits repairs on devices about to leave support — the repair is wasted within two quarters." },
      { id: "12", label: "12 months", consequence: "One year of return on the repair. Defensible, but tight against a procurement cycle." },
      { id: "18", label: "18 months", consequence: "Repair pays back over more than a budget cycle, and survives a support-window change." },
      { id: "24", label: "24 months", consequence: "Conservative. Retires devices that still had usable, supported life." },
    ],
    modelOption: "18",
  },
  {
    key: "condition",
    label: "Minimum device condition score",
    hint: "Composite of battery health, storage health and incident frequency.",
    options: [
      { id: "none", label: "None required", consequence: "The rule stops being condition-based at all — you are back to cost and age." },
      { id: "low", label: "Low", consequence: "Repairs devices already showing degradation; expect repeat tickets on the same machines." },
      { id: "medium", label: "Medium", consequence: "Filters out failing hardware while keeping genuinely serviceable devices." },
      { id: "high", label: "High", consequence: "Only near-perfect devices qualify — very few repairs will pass." },
    ],
    modelOption: "medium",
  },
  {
    key: "security",
    label: "Security baseline compliance",
    hint: "What happens when a device cannot meet the current security baseline.",
    options: [
      { id: "hard", label: "Hard requirement — non-compliant devices retire", consequence: "The CISO's veto lives inside the rule, so extension never quietly erodes the baseline." },
      { id: "soft", label: "Soft requirement — non-compliant devices escalate", consequence: "Every non-compliant device becomes a case-by-case negotiation, and the queue grows." },
      { id: "none", label: "Not part of the rule", consequence: "A cheap, high-condition, non-compliant device will be repaired and kept. This is erosion by attrition." },
    ],
    modelOption: "hard",
  },
  {
    key: "peripheral",
    label: "Reuse-before-purchase check on peripherals",
    hint: "Whether stock must be checked before new peripherals are ordered.",
    options: [
      { id: "mandatory", label: "Mandatory", consequence: "Produces the reuse rate you will later report, as a by-product of ordinary work." },
      { id: "advisory", label: "Advisory", consequence: "Complied with when convenient; produces no reliable reuse data." },
      { id: "none", label: "Not required", consequence: "Onboarding keeps issuing new stock while usable stock sits in storage." },
    ],
    modelOption: "mandatory",
  },
];

export type ConditionLevel = "low" | "medium" | "high";
export type Outcome = "repair" | "retire" | "escalate";

export type TestDevice = {
  id: string;
  n: number;
  age: string;
  repairCost: number;
  replacementCost: number;
  condition: ConditionLevel;
  supportedLifeMonths: number;
  securityCompliant: boolean;
  userRole: string;
  /** Why this device is in the bench — mentor-only. */
  trap?: string;
};

export const TEST_DEVICES: TestDevice[] = [
  { id: "d1", n: 1, age: "2 yrs", repairCost: 90, replacementCost: 1200, condition: "high", supportedLifeMonths: 36, securityCompliant: true, userRole: "Analyst" },
  { id: "d2", n: 2, age: "5 yrs", repairCost: 480, replacementCost: 1200, condition: "low", supportedLifeMonths: 8, securityCompliant: true, userRole: "Analyst" },
  {
    id: "d3",
    n: 3,
    age: "3 yrs",
    repairCost: 70,
    replacementCost: 1200,
    condition: "high",
    supportedLifeMonths: 30,
    securityCompliant: false,
    userRole: "Consultant",
    trap: "The single most important case. Cheap, high-condition, long supported life — and outside the security baseline. A rule with security set to soft or absent will say Repair, which is exactly the erosion-by-attrition the CISO warns about. If a learner's rule repairs this device, stop and unpack it.",
  },
  { id: "d4", n: 4, age: "4 yrs", repairCost: 310, replacementCost: 1100, condition: "medium", supportedLifeMonths: 20, securityCompliant: true, userRole: "Admin", trap: "Sits at 28% — just inside a 30% ceiling. Shows the learner where their ceiling actually bites." },
  {
    id: "d5",
    n: 5,
    age: "4 yrs",
    repairCost: 300,
    replacementCost: 1150,
    condition: "high",
    supportedLifeMonths: 30,
    securityCompliant: true,
    userRole: "Developer",
    trap: "Exposes an over-tight ceiling: at 26% this device is retired by a 20% setting despite high condition and 30 months of supported life left — contradicting the purpose of the policy.",
  },
  {
    id: "d6",
    n: 6,
    age: "6 yrs",
    repairCost: 120,
    replacementCost: 1200,
    condition: "high",
    supportedLifeMonths: 24,
    securityCompliant: true,
    userRole: "Analyst",
    trap: "Exposes reflexive age-based thinking. Nothing in a well-built rule references age — age is the proxy the rule deliberately replaces with condition and supported life.",
  },
  { id: "d7", n: 7, age: "3 yrs", repairCost: 650, replacementCost: 1300, condition: "medium", supportedLifeMonths: 26, securityCompliant: true, userRole: "Consultant", trap: "At 50%, over any defensible ceiling despite good condition — the case that shows a condition-based rule is not a repair-everything rule." },
  {
    id: "d8",
    n: 8,
    age: "2 yrs",
    repairCost: 95,
    replacementCost: 1400,
    condition: "high",
    supportedLifeMonths: 34,
    securityCompliant: true,
    userRole: "Executive",
    trap: "Exposes informal role-based exceptions. If a learner wants an executive exception it must be written into the rule and its cost owned — a silent exception destroys the rule's authority everywhere else.",
  },
];

const CONDITION_RANK: Record<string, number> = { none: 0, low: 1, medium: 2, high: 3 };

/** The learner's own rule, applied to a device. Order matters: security first, then fitness, then cost. */
export function applyRule(
  device: TestDevice,
  t: Partial<Record<ThresholdKey, string>>,
): { outcome: Outcome; reason: string } | null {
  const { repairCeiling, supportedLife, condition, security } = t;
  if (!repairCeiling || !supportedLife || !condition || !security) return null;

  if (!device.securityCompliant) {
    if (security === "hard") return { outcome: "retire", reason: "outside the security baseline — hard requirement" };
    if (security === "soft") return { outcome: "escalate", reason: "outside the security baseline — soft requirement" };
  }

  if (device.supportedLifeMonths < Number(supportedLife)) {
    return { outcome: "retire", reason: `only ${device.supportedLifeMonths} months supported life, below your ${supportedLife}-month minimum` };
  }

  if (CONDITION_RANK[device.condition] < CONDITION_RANK[condition]) {
    return { outcome: "retire", reason: `condition ${device.condition}, below your ${condition} minimum` };
  }

  const ratio = (device.repairCost / device.replacementCost) * 100;
  if (ratio > Number(repairCeiling)) {
    return { outcome: "retire", reason: `repair is ${ratio.toFixed(0)}% of replacement, above your ${repairCeiling}% ceiling` };
  }

  return { outcome: "repair", reason: `repair is ${ratio.toFixed(0)}% of replacement, within all four conditions` };
}

export const EXCEPTION_INSTRUCTION =
  "Where does a case go when the rule cannot resolve it? Name the level and the limit of its authority — specific enough that a technician knows when to stop deciding.";
export const EXCEPTION_MIN_WORDS = 8;

export const REASON_CODES: { id: string; label: string; isModel: boolean }[] = [
  { id: "cost-band", label: "Repair cost outside band", isModel: true },
  { id: "no-condition-data", label: "Condition data unavailable", isModel: true },
  { id: "security-exception", label: "Security baseline exception requested", isModel: true },
  { id: "business-critical", label: "Business-critical user timing", isModel: true },
  { id: "no-part", label: "Spare part unavailable", isModel: false },
  { id: "client-device", label: "Client-site device governed by client policy", isModel: false },
  { id: "warranty", label: "Warranty dispute in progress", isModel: false },
  { id: "user-request", label: "User requested a different model", isModel: false },
];

export const REASON_CODE_MIN = 3;
export const REASON_CODE_MAX = 5;

// ---------------------------------------------------------------------------
// Stage 3 — accountability, trade-offs, review, board challenge
// ---------------------------------------------------------------------------
export type RaciLetter = "R" | "A" | "C" | "I";

export const RACI_LETTERS: RaciLetter[] = ["R", "A", "C", "I"];

export type RaciDecision = { id: string; label: string; modelAccountable: RoleId; note: string };

export const RACI_DECISIONS: RaciDecision[] = [
  {
    id: "thresholds",
    label: "Repair-vs-retire threshold values",
    modelAccountable: "cio",
    note: "CIO accountable, IT Operations responsible, CFO / CISO / Sustainability consulted. The CISO is only Consulted here — which works because the security baseline is a hard constraint inside the rule itself.",
  },
  {
    id: "baseline",
    label: "Security baseline definition",
    modelAccountable: "ciso",
    note: "CISO accountable and responsible; CIO and IT Operations consulted. This is the decision that makes the CISO a co-author of extension rather than its blocker.",
  },
  {
    id: "contracts",
    label: "Procurement and leasing contract terms",
    modelAccountable: "procurement",
    note: "Head of Procurement accountable, CFO and CIO consulted. Contracts are the binding constraint on extension in practice.",
  },
  {
    id: "reporting",
    label: "External reporting of lifecycle data",
    modelAccountable: "sustainability",
    note: "Sustainability Officer accountable for reporting only — never for device lifetime itself, which they cannot control through any contract, budget line or support default.",
  },
];

export type TradeOff = {
  id: string;
  label: string;
  modelOwner: RoleId;
  options: { id: string; label: string; isModel: boolean; why: string }[];
};

export const TRADE_OFFS: TradeOff[] = [
  {
    id: "security",
    label: "Security vs. lifetime extension",
    modelOwner: "ciso",
    options: [
      { id: "security-first", label: "Security prevails; non-compliant devices retire early", isModel: true, why: "The only default that keeps the baseline intact while still permitting extension everywhere else. It is also what makes the policy defensible to a CISO." },
      { id: "extension-first", label: "Extension prevails; compensating controls applied", isModel: false, why: "Reads as pragmatic but erodes the baseline case by case — exactly the attrition pattern security leads have seen before." },
      { id: "case-by-case", label: "Case-by-case escalation to steering", isModel: false, why: "Turns every non-compliant device into a negotiation, which is the bottleneck the architecture exists to prevent." },
    ],
  },
  {
    id: "visibility",
    label: "Short-term visibility vs. structural effect",
    modelOwner: "cio",
    options: [
      { id: "structural", label: "Structural prevails; visible proof points engineered into the first 90 days", isModel: true, why: "Keeps the strong measure and solves its real weakness — that it gets cancelled before it works." },
      { id: "visible", label: "Visibility prevails; deliver something reportable this quarter", isModel: false, why: "The visible-but-weak trap at board level: budget lock-in plus political closure." },
      { id: "split", label: "Split the budget between both", isModel: false, why: "Superficially balanced, but halves the structural measure while still spending on the weak one." },
    ],
  },
  {
    id: "cost",
    label: "Cost certainty vs. condition-based flexibility",
    modelOwner: "cfo",
    options: [
      { id: "flexibility", label: "Flexibility prevails within a stated annual variance band", isModel: true, why: "Replaces cycle certainty with band certainty — more accurate than a fixed cycle that was never validated against condition." },
      { id: "certainty", label: "Cost certainty prevails; keep fixed cycles", isModel: false, why: "Predictable is not the same as accurate. This is the inherited default the whole architecture exists to replace." },
      { id: "pilot", label: "Pilot flexibility in one country only", isModel: false, why: "Defensible as a step, but it leaves six countries on the default it has already been concluded is wrong." },
    ],
  },
];

export type ReviewIndicator = { id: string; label: string; isModel: boolean; why: string };

export const REVIEW_INDICATORS: ReviewIndicator[] = [
  { id: "repair-ratio", label: "Repair-to-replace ratio", isModel: true, why: "The direct behavioural indicator of whether the default actually changed." },
  { id: "exception-codes", label: "Exception rate by reason code", isModel: true, why: "The most diagnostic metric — a cluster on one code names the mis-set threshold for you." },
  { id: "reuse-rate", label: "Peripheral reuse rate", isModel: true, why: "Fastest-moving and easiest to improve, which makes it the early proof point that buys the programme time." },
  { id: "fleet-age", label: "Average fleet age and its distribution", isModel: false, why: "Genuinely useful, and a fine fourth choice — but slower-moving, and the average hides a bimodal distribution unless you read it carefully." },
  { id: "ticket-volume", label: "Total helpdesk ticket volume", isModel: false, why: "Moves for a dozen unrelated reasons; it cannot tell you whether this policy is working." },
  { id: "spend", label: "Total hardware spend", isModel: false, why: "Lags by a full procurement cycle and is confounded by headcount growth." },
];

export const INDICATOR_PICK_COUNT = 3;

export const CADENCES: { id: string; label: string }[] = [
  { id: "monthly", label: "Monthly" },
  { id: "quarterly", label: "Quarterly" },
  { id: "annual", label: "Annual" },
];

export const TRIGGER_INSTRUCTION =
  "State the observation that would force a threshold change. Be specific enough that someone reading the quarterly report could recognise it without asking you.";
export const TRIGGER_MIN_WORDS = 10;

export type BoardChallenge = {
  id: string;
  role: string;
  objection: string;
  options: { id: string; label: string; isModel: boolean; why: string }[];
};

export const BOARD_CHALLENGES: BoardChallenge[] = [
  {
    id: "cfo",
    role: "CFO",
    objection:
      "Condition-based extension makes our hardware spend unpredictable. Fixed cycles are budgetable. Why should I accept variance?",
    options: [
      { id: "band", label: "The architecture replaces cycle certainty with band certainty — a stated variance band plus a condition-driven forecast", isModel: true, why: "Concedes the real concern and answers it: fixed cycles are predictable, not accurate, because they were never validated against device condition." },
      { id: "savings", label: "Extension saves money overall, so the variance pays for itself", isModel: false, why: "Answers a question the CFO did not ask. They objected to unpredictability, not to cost." },
      { id: "carbon", label: "The carbon case outweighs the budgeting inconvenience", isModel: false, why: "Dismisses a legitimate finance constraint and guarantees the CFO opposes the rest of the proposal." },
      { id: "pilot", label: "We will pilot it in one country and review the variance after a year", isModel: false, why: "Safe, but it defers the group default by a year and leaves the inherited cycles running everywhere else." },
    ],
  },
  {
    id: "ciso",
    role: "CISO",
    objection:
      "I have seen sustainability programmes erode security baselines by attrition. What in your architecture stops that?",
    options: [
      { id: "hard-constraint", label: "The baseline is a hard constraint inside the rule, and you own its definition — non-compliant devices retire regardless of condition or cost", isModel: true, why: "Names the specific structural mechanism and hands the CISO ownership of it. Test device 3 is the demonstration." },
      { id: "consult", label: "You will be consulted on every extension decision", isModel: false, why: "Turns a veto into a meeting invitation — and puts the CISO in the queue for every individual case." },
      { id: "review", label: "The quarterly review will catch any drift", isModel: false, why: "Detection after the fact is not prevention, and it accepts erosion as the normal state between reviews." },
      { id: "exception", label: "Non-compliant devices go to steering as exceptions", isModel: false, why: "Creates exactly the case-by-case negotiation in which baselines get traded away." },
    ],
  },
  {
    id: "hr",
    role: "Head of HR",
    objection:
      "Our people will read \"keep your laptop longer\" as a cost cut dressed up as sustainability. How is that not a retention problem?",
    options: [
      { id: "top-down", label: "It is a communication design problem: the default applies visibly top-down, leadership devices included, and is framed as condition-based quality assurance", isModel: true, why: "Accepts the risk as real, locates it correctly, and points at the concrete mechanism — no executive exception in the rule (test device 8)." },
      { id: "deny", label: "The data shows older devices perform fine, so the perception is simply wrong", isModel: false, why: "Being right about the hardware does not address how the policy is read. Perception is the actual risk here." },
      { id: "optout", label: "Employees who object can request a replacement", isModel: false, why: "Creates an opt-out that hollows out the default and rewards whoever complains loudest." },
      { id: "incentive", label: "Offer a recognition scheme for teams that keep devices longest", isModel: false, why: "Gamifies the symptom and implies keeping a device is a sacrifice, reinforcing exactly the framing HR is worried about." },
    ],
  },
];

export const CHALLENGE_NOTE_INSTRUCTION = "One supporting line in your own words — the sentence you would actually say in the room.";
export const COMMITMENT_INSTRUCTION =
  "Name the decision you are asking the board to take now, despite incomplete information, and state what it would cost to wait.";
export const COMMITMENT_MIN_WORDS = 15;

// ---------------------------------------------------------------------------
// Mentor answer keys
// ---------------------------------------------------------------------------
export const DRIVER_ANSWER_KEY: AnswerKeyBlock = {
  prompt: "The three strategic drivers",
  items: DRIVERS.map((d) => ({
    option: d.label,
    verdict: d.isModel ? ("pick" as const) : ("avoid" as const),
    why: d.why,
  })),
  teachingNote:
    "The regulatory driver is a fully defensible substitution for the fragmentation one — accept it when the learner can say why a forward-looking driver still moves a board today. What should not survive is a set built only from symptoms (support cost, employee expectations) or comparisons (competitors).",
};

export const SEQUENCE_ANSWER_KEY: AnswerKeyBlock = {
  prompt: "The three guiding decisions, and their order",
  items: [
    { option: "1. C — assign single-point accountability", verdict: "pick", why: "Every other decision needs an owner; without it the rest have nobody to execute them." },
    { option: "2. G — set the security baseline", verdict: "pick", why: "Defines the hard ceiling on extension. Setting it before A converts the CISO from blocker to co-author and means the policy is born compliant." },
    { option: "3. A — condition-based replacement as the group default", verdict: "pick", why: "The substantive change, and executable only once C and G exist." },
    { option: "H — renegotiate contracts", verdict: "avoid", why: "The strongest near-miss and a defensible substitution for A in third position, since contracts are the binding constraint in practice." },
    { option: "F — commission the audit first", verdict: "avoid", why: "The most frequent error. Defers the decision by a full cycle, and the audit is a deliverable of A rather than a prerequisite to deciding it." },
    { option: "I — publish an external commitment", verdict: "avoid", why: "Commits publicly before the capability exists. If the first data request arrives before the data does, the commitment becomes the liability." },
    { option: "D — fund an immediate refresh", verdict: "avoid", why: "Re-triggers the dominant manufacturing footprint and consumes the envelope." },
  ],
  teachingNote:
    "Judge the sequence harder than the selection. A learner who picks C, G, A but orders them A, C, G has not understood dependency — ask them who executes A on day one, and against which security ceiling.",
};

export const RULE_ANSWER_KEY: AnswerKeyBlock = {
  prompt: "Model thresholds",
  items: [
    { option: "Repair ceiling 30%", verdict: "pick", why: "Repairs the economically sensible cases without funding near-replacement repairs. At 20%, test device 5 is retired despite high condition and 30 months of supported life." },
    { option: "Minimum supported life 18 months", verdict: "pick", why: "The repair pays back over more than a budget cycle. At 6 months the repair is wasted within two quarters." },
    { option: "Condition minimum Medium", verdict: "pick", why: "Filters failing hardware while keeping serviceable devices. 'None required' quietly turns the rule back into a cost-and-age rule." },
    { option: "Security: hard requirement", verdict: "pick", why: "The decisive setting. Anything softer repairs test device 3 — cheap, high-condition, non-compliant — which is erosion by attrition." },
    { option: "Peripheral reuse: mandatory", verdict: "pick", why: "Produces the reuse rate you will later report, as a by-product of ordinary work rather than as a separate data project." },
  ],
  teachingNote:
    "Learners typically need two to three iterations to reach a defensible set. Zero iterations almost always means they marked unintended outcomes as intended — probe that rather than praising the speed.",
};

export const RACI_ANSWER_KEY: AnswerKeyBlock = {
  prompt: "Accountability assignment",
  items: [
    ...RACI_DECISIONS.map((d) => ({
      option: `${d.label} → ${ROLES.find((r) => r.id === d.modelAccountable)?.label}`,
      verdict: "pick" as const,
      why: d.note,
    })),
    {
      option: "Sustainability Officer accountable for device lifetime",
      verdict: "avoid" as const,
      why: "The accountability-without-control failure: that officer cannot change a procurement contract, a support default or a depreciation schedule. They are accountable for reporting, not for the outcome.",
    },
    {
      option: "Two Accountables on a cross-functional decision",
      verdict: "avoid" as const,
      why: "Feels collaborative and politically safe, and guarantees a stall the first time the two disagree. Split the decision or name the tie-breaker.",
    },
  ],
  teachingNote:
    "The CISO being merely Consulted on the repair threshold is only honest because the security baseline is a hard constraint inside the rule. If a learner softened that threshold in Stage 2, this RACI row becomes a lie — connect the two out loud.",
};

export const ESCALATION_NOTE =
  "Escalation volume should be low but non-zero. Zero escalations means the rule is being bypassed rather than followed; a high volume means the thresholds are mis-set. With the model thresholds the bench produces no escalations at all — which is the teaching point: a hard security requirement converts what would have been escalations into decided outcomes, so the escalation path exists for genuinely novel cases rather than for a category you already knew about.";

export const COMMITMENT_ANSWER_NOTE =
  "Model: \"We ask the board to adopt condition-based replacement as the group default now, before any condition data exists, because the condition assessment is the first operational deliverable of that decision rather than a prerequisite to it. Waiting for the audit costs a full procurement cycle across seven countries — during which roughly a quarter of the fleet will be replaced under the inherited fixed cycles we have already concluded are wrong.\" A strong answer names the decision, the missing information, and the quantified cost of delay.";

export const MISCONCEPTIONS: { wrong: string; why: string; redirect: string }[] = [
  { wrong: "Commission the audit first, then decide", why: "Feels rigorous and low-risk", redirect: "Ask what the audit is a deliverable of, and what happens to the fleet during the waiting period." },
  { wrong: "Make the Sustainability Officer accountable for device lifetime", why: "Topic ownership confused with decision control", redirect: "Ask which contract, budget line or support default that officer can actually change." },
  { wrong: "Two Accountables for cross-functional decisions", why: "Feels collaborative and politically safe", redirect: "Ask what happens the first time they disagree." },
  { wrong: "Age should be in the rule", why: "Fixed cycles are the inherited mental model", redirect: "Point at test device 6 and ask what age is a proxy for — and whether the rule already measures that directly." },
  { wrong: "Give executives an exception, it's politically necessary", why: "Realistic instinct, badly executed", redirect: "Not forbidden — but write it into the rule and own its cost. A silent exception destroys the rule's authority everywhere else." },
  { wrong: "Security and sustainability are in permanent conflict", why: "Both framed as absolutes", redirect: "Show that a hard security constraint inside the rule enables extension by making it defensible, rather than blocking it." },
];

// ---------------------------------------------------------------------------
// Task copy
// ---------------------------------------------------------------------------
export const TASK3 = {
  kicker: "Task 1",
  heading: "The BrightPath Decision Architecture",
  intro:
    "BrightPath is fictional, built so you can design an architecture rather than recommend a list. Three stages, about 15 minutes: frame the case and choose what the board decides, build the repair-vs-retire rule and test it against real devices until it does what you intended, then assign accountability, design the review, and survive three board objections. The memo on the right assembles as you go.",
  orderBanner:
    "Suggested order: Stage 1 → 3. Nothing is locked — the memo builds from whatever you have answered, whichever stage you start with.",
  stage1: {
    heading: "Stage 1 — Frame the case, choose the decisions",
    instructions:
      "Pick the three drivers that would actually move this board, then the three decisions it should take — and put them in the order they can be executed.",
    material: ["architecture"] as MaterialSectionId[],
  },
  stage2: {
    heading: "Stage 2 — Build the rule, then test it",
    instructions:
      "Set your thresholds and watch eight real devices run through them. Mark any outcome you did not intend, adjust, and run it again — the iteration is the exercise.",
    material: ["rules"] as MaterialSectionId[],
  },
  stage3: {
    heading: "Stage 3 — Accountability, review, and the board",
    instructions:
      "Assign who owns what, state your trade-off defaults, design how you will know the rule stopped working, then take three objections from the board.",
    material: ["accountability", "review"] as MaterialSectionId[],
  },
  export: {
    docHeading: "Management Decision Architecture",
    filenameLevel: 3,
    filenameTask: 1,
  },
} as const;
