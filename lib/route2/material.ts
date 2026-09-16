/**
 * Route 2 material — four sections, ~60 facilitator-led minutes, all taught
 * before the task, plus the EcoFlow worked example read after them.
 *
 * Level 3, Module 9: digitalisation must be shaped as a management decision
 * under trade-offs, uncertainty and responsibility — not left to accumulate
 * as a series of individually reasonable departmental choices.
 */

import type { MaterialSection } from "@/lib/materialSection";
import type { MaterialSectionId } from "./sections";

// ---------------------------------------------------------------------------
// A — the six management levers
// ---------------------------------------------------------------------------

export type ManagementLever = {
  id: string;
  label: string;
  decides: string;
  /** What goes wrong when this is left to the departments. */
  ifLeftToTeams: string;
  symptom: string;
};

export const MANAGEMENT_LEVERS: ManagementLever[] = [
  {
    id: "controllability",
    label: "Controllability",
    decides: "Which three to five indicators management steers digitalisation by, and who brings them to a review.",
    ifLeftToTeams:
      "Every platform reports something different, in engineering or department-specific terms. Nothing is comparable, so decisions continue to be made on whichever project shouted loudest.",
    symptom: "A data platform dashboard only IT can read",
  },
  {
    id: "scaling",
    label: "Scaling",
    decides: "The policy under which new digital capacity, storage and integrations are approved and provisioned.",
    ifLeftToTeams:
      "Every department provisions for its own comfort margin, which rationally produces storage and system sprawl nobody individually chose and nobody is accountable for in total.",
    symptom: "A storage tier scaled at rollout, never revisited",
  },
  {
    id: "quality",
    label: "Quality",
    decides: "Whether an environmental and efficiency assessment is a gate a digital initiative must pass, or a nice-to-have that yields whenever a launch date is at risk.",
    ifLeftToTeams:
      "Assessment becomes whatever survives the week before launch, and it is always the first thing traded away when a deadline is close.",
    symptom: "A new platform shipped with no environmental review because nothing required one",
  },
  {
    id: "investment",
    label: "Investment",
    decides: "The split of transformation budget between new digitalisation initiatives and the assessment and governance capacity that keeps them accountable.",
    ifLeftToTeams:
      "Nothing happens. Governance work competes with visible new capability for the same budget line, inside an organisation measured on modernisation progress — and it loses every time.",
    symptom: "An assessment framework everyone agrees on, with no funded capacity to build it",
  },
  {
    id: "principles",
    label: "Architecture & process principles",
    decides: "What every department must design against for a new digital process to count as responsible — deduplication, retention limits, shared infrastructure.",
    ifLeftToTeams:
      "Five departments each build a locally reasonable dashboard against the same underlying data, none of them wrong on its own, none of them consistent with any other.",
    symptom: "Five departments building their own dashboard, no rule broken by any of them",
  },
  {
    id: "longterm",
    label: "Long-term responsibility",
    decides: "Who carries the environmental and operating cost of a digitalisation decision for the years after the project that made it is forgotten.",
    ifLeftToTeams:
      "The cost lands on whoever operates and stores the result later, which is a different budget and usually a different person — so nobody making the original decision feels it.",
    symptom: "A legacy data platform nobody chose, still running",
  },
];

/** The engineering/operational layer the levers sit above — the lower half of A's diagram. */
export const SYMPTOM_LAYER = [
  { id: "dash", label: "A data platform dashboard only IT can read", lever: "controllability" },
  { id: "storage", label: "A storage tier scaled at rollout, never revisited", lever: "scaling" },
  { id: "dupe", label: "Five departments building their own dashboard", lever: "principles" },
];

// ---------------------------------------------------------------------------
// B — the three measure lanes
// ---------------------------------------------------------------------------

export type RatingLevel = "low" | "mid" | "high";

export type MeasureLane = {
  id: "accelerate" | "assess" | "consolidate";
  label: string;
  mechanics: string;
  ratings: {
    strategicLeverage: RatingLevel;
    feasibility: RatingLevel;
    controllability: RatingLevel;
    risk: RatingLevel;
  };
  note: string;
};

export const MEASURE_LANES: MeasureLane[] = [
  {
    id: "accelerate",
    label: "Accelerate",
    mechanics:
      "Roll out more digital capability — new platforms, dashboards, IoT rollouts — to meet department demand and show visible modernisation progress quickly.",
    ratings: { strategicLeverage: "mid", feasibility: "high", controllability: "low", risk: "high" },
    note: "The fastest option, and the one most likely to be oversold as a sustainability win in itself — it adds to the sprawl the organisation cannot yet assess.",
  },
  {
    id: "assess",
    label: "Assess & Govern",
    mechanics:
      "Introduce shared criteria, a review gate and named ownership for judging every digitalisation initiative before — or alongside — further rollout.",
    ratings: { strategicLeverage: "high", feasibility: "mid", controllability: "high", risk: "low" },
    note: "The structurally strong option: it is what makes the other two lanes defensible, but it is the slowest to show visible progress and costs real political capital to introduce.",
  },
  {
    id: "consolidate",
    label: "Consolidate",
    mechanics:
      "Reduce duplicated systems, cap data growth and retire redundant platforms across departments that have each built their own tools against the same data.",
    ratings: { strategicLeverage: "mid", feasibility: "mid", controllability: "mid", risk: "mid" },
    note: "A real, visible saving — and the classic trap: attractive short-term, structurally weak on its own, because it does not touch the assessment gap that produced the duplication.",
  },
];

// ---------------------------------------------------------------------------
// C — RACI
// ---------------------------------------------------------------------------

export type RaciLetter = "R" | "A" | "C" | "I";

export const RACI_LETTERS: { id: RaciLetter; name: string; meaning: string }[] = [
  { id: "R", name: "Responsible", meaning: "Does the work. There can be several." },
  { id: "A", name: "Accountable", meaning: "Owns the outcome and is the single point of approval. Exactly one, always." },
  { id: "C", name: "Consulted", meaning: "Asked before the decision — two-way." },
  { id: "I", name: "Informed", meaning: "Told after the decision — one-way." },
];

export const RACI_FAILURES = [
  {
    id: "diffused",
    label: "Diffused accountability",
    what: "The A is given to a committee, a department or a function rather than to a person.",
    symptom: "The decision reappears on every agenda and is never closed. Everyone present assumes someone else present will carry it.",
  },
  {
    id: "authority",
    label: "Accountability without authority",
    what: "The A holder cannot bind budget or capacity for the thing they are accountable for.",
    symptom: "An agreed assessment framework that no department's roadmap ever makes room for. This is the more common and more damaging failure, because it looks like governance while producing nothing.",
  },
];

/** The demo grid in section C — four decision objects, five roles. */
export const DEMO_RACI_ROWS = [
  { id: "d1", label: "Approving a binding digital-sustainability assessment framework" },
  { id: "d2", label: "Defining assessment criteria for new digital initiatives" },
  { id: "d3", label: "Enforcing the assessment gate on one project" },
  { id: "d4", label: "Allocating budget for assessment and governance capacity" },
];

export const RACI_ROLES = [
  { id: "board", name: "Management Board", note: "Can bind budget and capacity." },
  { id: "sustainability", name: "Sustainability Lead", note: "Owns assessment criteria; no budget authority." },
  { id: "it", name: "IT", note: "Runs the platforms the assessment applies to." },
  { id: "finance", name: "Finance", note: "Can bind budget for governance capacity." },
  { id: "deptHeads", name: "Department Heads", note: "Run initiatives; live inside the framework." },
  { id: "transformation", name: "Transformation Office", note: "Coordinates rollout; no budget authority." },
];

// ---------------------------------------------------------------------------
// D — the four decision postures
// ---------------------------------------------------------------------------

export type PostureId = "instrument" | "bet" | "measure" | "wait";

export type DecisionPosture = {
  id: PostureId;
  label: string;
  information: "low" | "high";
  delayCost: "low" | "high";
  rule: string;
  failure: string;
};

export const POSTURES: DecisionPosture[] = [
  {
    id: "instrument",
    label: "Decide now and instrument",
    information: "low",
    delayCost: "high",
    rule: "Make the smallest binding decision that buys information, and attach the indicator that will tell you whether it held.",
    failure: "Deciding without the indicator — which is indistinguishable from guessing, two quarters later.",
  },
  {
    id: "bet",
    label: "Decide now and accept the bet",
    information: "low",
    delayCost: "high",
    rule: "Where no instrument exists yet, state the assumption and the date you will revisit it, and say out loud that it is a bet.",
    failure: "Presenting a bet as an analysis, so nobody schedules the review that would catch it.",
  },
  {
    id: "measure",
    label: "Wait and measure",
    information: "low",
    delayCost: "low",
    rule: "Only legitimate when waiting is genuinely cheap and the measurement is actually funded and dated.",
    failure: "An unfunded 'let's assess this properly first' that quietly becomes a decision never to decide.",
  },
  {
    id: "wait",
    label: "It is cheap to wait",
    information: "high",
    delayCost: "low",
    rule: "Information is good and delay costs little: schedule it, do not spend a board slot on it.",
    failure: "Spending scarce senior attention on the one quadrant that did not need it.",
  },
];

export const DEFENSIBLE_PARTS = [
  { label: "The recommendation", text: "One sentence, stated as a decision rather than a direction." },
  { label: "The trade-off accepted", text: "What you are buying, what you are paying, and who carries it." },
  { label: "The assumption", text: "What must be true for this to be the right call." },
  { label: "The falsifier", text: "The observable indicator that would show the assumption failed, and by when." },
  { label: "The review point", text: "A date and an owner, in the calendar, not in the memo's intent." },
];

export const PILOT_ANCHORS = [
  { label: "A standard", text: "The pilot's result becomes something departments are required to design against." },
  { label: "A funding line", text: "Capacity for the rollout exists before the pilot reports, not after it succeeds." },
  { label: "An accountable owner", text: "One person who can bind departments to the outcome — not the pilot team itself." },
];

// ---------------------------------------------------------------------------
// The EcoFlow worked example (read-only)
// ---------------------------------------------------------------------------

export const ECOFLOW = {
  company: "EcoFlow Administration GmbH",
  banner: "Worked example · read-only · you are not assessed on this company",
  situation:
    "EcoFlow Administration GmbH has digitalised most of its administrative processes over the past two years. Process times have shortened markedly across procurement, HR and finance — but data volumes, storage needs and system dependencies have grown just as quickly, and no uniform logic exists for assessing whether a given digitalisation step is actually worth its environmental cost. Management wants a workable recommendation for how to keep the momentum without losing control of it.",
  initialPosition: [
    "Processing times have shortened across procurement, HR and finance.",
    "Storage and system dependencies are rising faster than process volume.",
    "New digital tools are approved individually, with no shared assessment criteria.",
    "Departments compete to show the most visible digitalisation progress.",
    "No function owns judging a digitalisation initiative's environmental cost.",
    "Management wants continued momentum without an unmanaged sprawl of systems.",
  ],
  coreIdea:
    "The greatest leverage lies neither in accelerating further nor in consolidating what already exists, but in introducing an assessment and management framework for digital processes before further digitalisation momentum is reinforced unchecked — so every future initiative is judged before it adds to the sprawl, not after.",
  levers: [
    {
      id: "l1",
      label: "Introduce shared assessment criteria for new digitalisation initiatives",
      note: "A gate needs something to test against — without criteria, 'assess' just means 'discuss'.",
    },
    {
      id: "l2",
      label: "Name an owner accountable for the environmental review of digital projects",
      note: "Distributed responsibility is exactly how the current gap happened in the first place.",
    },
    {
      id: "l3",
      label: "Cap data growth and system count per department",
      note: "A ceiling forces a trade-off conversation that unlimited growth never has to have.",
    },
    {
      id: "l4",
      label: "Couple the assessment framework to budget approval",
      note: "The framework only binds if a project cannot be funded without passing it first.",
    },
  ],
  prioritised: {
    label: "Introduce an assessment and management framework for digital processes before further digitalisation momentum is reinforced unchecked",
    reasons: [
      "It stops the sprawl at its source rather than cleaning up after it.",
      "It gives every later consolidation or acceleration decision a shared basis for comparison.",
      "It converts 'digitalisation is progress' from an assumption into a tested claim.",
      "It is the only option that makes the other three levers enforceable.",
    ],
    notChosen:
      "The option that felt more immediately productive — accelerating further digitalisation to meet department demand — was not prioritised. It produces visible modernisation progress and leaves the assessment gap that created the original problem completely untouched, so the same uncontrolled growth continues under a different name.",
  },
  horizons: [
    {
      id: "short",
      label: "Short term",
      items: [
        "Define assessment criteria for new digital initiatives.",
        "Name an accountable owner for environmental review.",
        "Pause approval of new large-scope initiatives pending the framework.",
      ],
    },
    {
      id: "medium",
      label: "Medium term",
      items: [
        "Couple the assessment framework to budget approval.",
        "Apply a data-growth cap to the two fastest-growing departments.",
        "Retire the most clearly redundant systems the assessment identifies.",
      ],
    },
    {
      id: "structural",
      label: "Structural",
      items: [
        "Anchor the assessment framework in governance, budget approval and management review.",
        "Tie a share of department objectives to passing the assessment rather than to feature count.",
      ],
    },
  ],
} as const;

// ---------------------------------------------------------------------------
// The four sections
// ---------------------------------------------------------------------------

export const MATERIAL: MaterialSection<MaterialSectionId>[] = [
  {
    id: "board",
    code: "A",
    n: 1,
    icon: "gavel",
    kicker: "A · Where the decision actually lives",
    title: "Why this reaches a board at all",
    standfirst: "Six management levers control what digitalisation can responsibly do. Not one of them is inside a single department.",
    minutes: 14,
    definition:
      "Digital-sustainability governance is not an IT topic or a single department's problem. Six levers decide whether responsible digitalisation is even possible — controllability, scaling, quality, investment, architecture and process principles, and long-term responsibility — and every one of them is set above the departments that would have to act on it.",
    insight:
      "Investment is the decisive lever, because it is the only one that creates the hours governance needs. Assessment and governance work competes with visible new capability for the same budget, inside an organisation measured on modernisation progress; no department resolves that conflict from below, because resolving it means choosing to look slower than a competitor. It is resolved by whoever sets the budget split, or it is not resolved at all.",
    takeaway:
      "Bring the board three to five indicators, each with a trend, an owner and a threshold that triggers a decision. A platform-by-platform dashboard only IT can interpret is not management information. Then ask for the one thing only a board can grant: budget for assessment and governance capacity that is not the residue left after the transformation roadmap.",
    body: [
      {
        heading: "The six levers, and what happens without them",
        paragraphs: [
          "Each lever in the diagram decides something specific, and each has a characteristic failure when it is left to the departments. Read them as a set: the arrows all terminate in the upper layer, which is the picture's whole argument — no symptom in the lower layer has a fix that lives in the lower layer.",
          "Controllability is the one most often declared solved. An organisation with excellent platform telemetry and no management indicator has not solved controllability; it has instrumented its systems and left the steering wheel disconnected.",
        ],
      },
      {
        heading: "The general conditions a European board already recognises",
        paragraphs: [
          "Budget is restricted even as leadership wants visible modernisation successes to report. Transparency on the indirect environmental impacts of past initiatives is incomplete. And there is a standing risk that digitalisation is sold internally — to a board, to a customer, to the market — as an automatic sustainability win, when its actual net effect has never been assessed.",
          "CSRD and ESRS E1 make climate-related disclosure an audited obligation for a widening set of companies: figures must be substantiated and capable of assurance, which turns 'we digitalised, so we improved' from a comfortable assumption into a claim someone can be asked to prove. The EU Energy Efficiency Directive (EU/2023/1791) adds reporting obligations around data-centre and digital infrastructure specifically. ISO 50001 is the archetype worth copying — not its metric, but its loop: policy → objective → measurement → review → correction.",
        ],
      },
    ],
    reasoning: [
      "In the task you rank guiding decisions and prioritise a measure. A guiding decision changes what departments are allowed or required to do — it does not roll out one new capability once.",
      "Test each candidate: if a single department could execute it in a single quarter without anyone's approval, it is a measure, not a guiding decision.",
      "The lever a decision pulls is what tells you its rank. Investment and principles change the default; a consolidation programme changes one estate.",
    ],
    callout: {
      label: "The question that settles it",
      text: "Ask of any proposed decision: who has to agree before a department can act on it? If the answer is 'nobody', it is a measure.",
    },
    references: [
      {
        label: "CSRD / ESRS E1 — climate-related disclosures",
        detail: "Reported figures must be substantiated and auditable, which makes measurement a governance requirement.",
        url: "https://finance.ec.europa.eu/capital-markets-union-and-financial-markets/company-reporting-and-auditing/company-reporting/corporate-sustainability-reporting_en",
      },
      {
        label: "EU Energy Efficiency Directive (EU/2023/1791)",
        detail: "Data-centre and digital-infrastructure reporting obligations.",
        url: "https://eur-lex.europa.eu/eli/dir/2023/1791/oj",
      },
      {
        label: "ISO 50001 — energy management systems",
        detail: "The management-system loop: policy → objective → measurement → review → correction.",
        url: "https://www.iso.org/iso-50001-energy-management.html",
      },
      {
        label: "IEA, Energy and AI (2025)",
        detail: "Data centres ≈415 TWh in 2024, ≈1.5% of global electricity — the physical stake behind the governance question.",
        url: "https://www.iea.org/reports/energy-and-ai",
      },
    ],
  },

  {
    id: "prioritise",
    code: "B",
    n: 2,
    icon: "target",
    kicker: "B · Three lanes, one budget",
    title: "Prioritising digitalisation measures under trade-offs",
    standfirst: "Accelerate, Assess & Govern, or Consolidate — the attractive short-term option is rarely the structurally strong one.",
    minutes: 16,
    definition:
      "Three broad measure types compete for the same transformation budget. Accelerate rolls out further digital capability to meet demand and show visible progress. Assess & Govern introduces criteria, a review gate and ownership for judging initiatives before they ship. Consolidate reduces duplication and caps data growth in what already exists.",
    insight:
      "Accelerate and Consolidate both look attractive on a one-quarter view: one produces visible new capability, the other produces a visible, attributable saving. Neither touches the mechanism that let uncoordinated digitalisation accumulate in the first place — which is why a line of measures that is attractive short-term but structurally weak is a real trap, not a hypothetical one, and it is the trap this section exists to name before the task asks you to avoid it.",
    takeaway:
      "Assess each lane on four criteria before committing budget to it: strategic leverage (does it change what happens next time, or just this time), feasibility (can it actually be delivered under current constraints), controllability (does it increase or decrease what management can steer), and risk (including the risk of being oversold as more than it is).",
    body: [
      {
        heading: "Why 'attractive short-term, structurally weak' is dangerous specifically here",
        paragraphs: [
          "Consolidation produces a number a board can point to this quarter — fewer systems, less storage, a visible saving. It is real, and it is also exactly the kind of win that lets an organisation report progress while the assessment gap that produced the duplication remains completely open, ready to reproduce the same sprawl in the next round of initiatives.",
          "Acceleration is the more seductive trap, because 'we digitalised X' reads as sustainability progress by default in most internal reporting, whether or not anyone has checked its actual net effect against the rebound and trade-off logic from Route 1's material.",
        ],
      },
      {
        heading: "Justifying a choice under incomplete information",
        paragraphs: [
          "None of the three lanes can be fully justified with complete data — that data does not exist yet, which is itself section D's subject. The task does not ask you to wait for it; it asks you to defend a choice stated so that the specific incompleteness is visible rather than hidden, using the four-criteria assessment as your evidence.",
        ],
      },
    ],
    reasoning: [
      "In Exercise 1 you choose one lane and defend it. The strongest defensible answer is the one whose assessment grid argument, not its bucket ratings alone, explains why the freed-up leverage stays real rather than being absorbed elsewhere — the same rebound logic Route 1 introduced, now at management scale.",
      "A choice that reads well on feasibility and risk but scores low on strategic leverage is the 'attractive short-term, structurally weak' trap this section names directly — expect it to be challenged, and prepare the follow-up decisions it forces.",
      "Assess & Govern is the option that makes the other two lanes accountable rather than a substitute for either — a defensible answer for Accelerate or Consolidate should say what governance capacity it assumes already exists or will be funded alongside it.",
    ],
    callout: {
      label: "The trap, stated plainly",
      text: "A line of measures can be attractive short-term and structurally weak at the same time. Consolidation's saving is real and does not reproduce itself; acceleration's progress is real and does not govern itself.",
    },
    references: [
      { label: "SEI — Architecture Tradeoff Analysis Method (ATAM)", detail: "Trade-off analysis method, named once as background for the four-criteria assessment.", url: "https://www.sei.cmu.edu/" },
      { label: "ISO/IEC 25010", detail: "Software quality characteristics used to ground feasibility and controllability as distinct, assessable criteria." },
    ],
  },

  {
    id: "governance",
    code: "C",
    n: 3,
    icon: "shield",
    kicker: "C · Who is allowed to decide",
    title: "Decision architecture: RACI and governance",
    standfirst: "Four letters, one structural rule, and two failure modes — one of which looks exactly like governance while producing nothing.",
    minutes: 15,
    definition:
      "RACI assigns four distinct relationships to a decision. Responsible does the work and there can be several. Accountable owns the outcome and is the single point of approval — exactly one, always. Consulted is asked before the decision and the exchange is two-way. Informed is told after it, one-way.",
    insight:
      "The one structural rule is that each row has exactly one A. Two Accountables produce an unresolved escalation path: when they disagree, nothing above them is designed to settle it, so the decision stalls in a place no process is watching. Zero Accountables produce a decision that quietly never happens, and — worse — never appears as a failure, because no one was named to fail.",
    takeaway:
      "Before filling a grid, decide who can bind capacity for that row. The A belongs to whoever can make a department's budget or roadmap change; assigning it to anyone else is the second failure mode written down in a table. Keep R and A separate for the assessment framework itself: whoever writes the criteria should not also be the only person approving them.",
    body: [
      {
        heading: "The two failure modes, at Synervia's scale",
        paragraphs: [
          "Diffused accountability gives the A to a committee, a department or a function rather than to a person. The symptom is recognisable: the assessment framework reappears on every steering-group agenda and is never closed, because everyone in the room assumes someone else in the room is carrying it.",
          "Accountability without authority gives the A to a role that cannot bind budget or capacity for it. This is the more common and more damaging of the two, because it produces all the artefacts of governance — a named owner, a published framework, a review — and none of its effects. A sustainability lead with an A on budget allocation is this failure in its purest form.",
        ],
      },
      {
        heading: "What makes a review gate real",
        paragraphs: [
          "A gate is only real if the A holder can refuse an initiative and the refusal holds. Everything else — the checklist, the meeting, the criteria document — is administration around a decision that was never actually delegated.",
          "iSAQB's CPSA Advanced Level Module GREEN treats sustainability-aware architecture and process design as an examinable competency, and the professional standard is consistent: principles or criteria without an owner who can enforce them reliably decay into recommendations. COBIT's governance processes use RACI charts for exactly this reason — decision rights are the thing being designed, not the documentation of them.",
        ],
      },
    ],
    reasoning: [
      "The task asks you to assign a RACI for ownership of Synervia's digital-sustainability assessment standard.",
      "Before you fill the grid, decide who can bind budget or capacity. The A belongs to whoever can make that happen.",
      "Exactly one A per row, and at least one R. A row whose A cannot bind capacity is the second failure mode, however senior the name in it.",
    ],
    callout: {
      label: "The test for any A",
      text: "Can this role change a department's budget or roadmap? If not, they are not accountable — they are consulted, and someone else is about to discover they were supposed to decide.",
    },
    references: [
      { label: "RACI in project and IT governance practice", detail: "COBIT uses RACI charts to allocate decision rights across governance processes.", url: "https://www.isaca.org/resources/cobit" },
      { label: "iSAQB CPSA Advanced Level — Module GREEN", detail: "Sustainability-aware architecture and process design as an examinable competency.", url: "https://www.isaqb.org/" },
    ],
  },

  {
    id: "uncertainty",
    code: "D",
    n: 4,
    icon: "shield",
    kicker: "D · Deciding before the data is in",
    title: "Holding a decision together under incomplete information",
    standfirst: "Four postures, one falsifier, and the reason technically successful pilots so often change nothing.",
    minutes: 15,
    definition:
      "At board level the question is rarely 'what is the right answer'. It is 'what is the most defensible decision available with what we know today, and what would change it'. That reframing is not a lowering of standards — it is the only honest form the question can take when a digitalisation initiative's full environmental effect is not yet separable from its benefits.",
    insight:
      "Cynefin's complex domain describes exactly this situation: cause and effect are clear only in retrospect, so more analysis does not converge on certainty. The correct move is a safe-to-fail probe with explicit sensing — probe, sense, respond — rather than further study. In practice that means a decision carrying four things: a stated assumption, an indicator that would falsify it, a review date, and a named owner.",
    takeaway:
      "Treat waiting as a decision with a price, and quantify it: capacity consumed by the status quo, decisions made by default while the question is open, and sprawl compounding in the meantime. Then write the recommendation in five parts — recommendation, trade-off accepted, assumption, falsifier, review point — so the next person to challenge it is arguing with the assumption rather than with you.",
    body: [
      {
        heading: "The four postures",
        paragraphs: [
          "The 2×2 above crosses the information available against the cost of delay. Its purpose is to stop two specific mistakes: treating every incomplete-information decision as a reason to wait, and treating every urgent decision as a reason to skip the instrument.",
          "The upper-left quadrant — low information, high cost of delay — is where most digitalisation-governance decisions actually sit, and it is the one the phrase 'let's assess this properly first' is most often used to escape.",
        ],
      },
      {
        heading: "The cost of waiting, as a quantity",
        paragraphs: [
          "Waiting one more quarter consumes capacity at the status quo rate: whatever the unassessed sprawl costs per month, multiplied by three, is not a rhetorical figure but a line item. Meanwhile decisions are still being made — by default, by every department that launches something during the wait, under the conventions the delayed decision was going to change.",
          "And sprawl compounds. Every system built during the wait is built to the old, unassessed shape, so the eventual governance decision is larger, more expensive and less popular than the one that was available this quarter.",
        ],
      },
      {
        heading: "Pilot purgatory",
        paragraphs: [
          "Assessment pilots that succeed technically and never scale are the characteristic failure of this field. The pattern is consistent and the cause is almost never technical: the pilot proved the framework worked on one project and was never attached to anything that would make it apply to the next one.",
          "Three anchors prevent it, and all three have to exist before the pilot reports: a standard the result becomes, a funding line the rollout draws on, and an accountable owner who can bind departments. A pilot with none of them produces a slide deck; a pilot with all three produces a change in how Synervia digitalises.",
        ],
      },
    ],
    reasoning: [
      "Exercise 2's ranking and Exercise 5's decision-that-cannot-wait both draw on this section directly.",
      "A good decision names the assumption it is betting on and the signal that would prove the bet wrong, with a date.",
      "An answer that only says 'we should decide soon' is not a decision. Neither is one whose cost of waiting is 'we lose time'.",
    ],
    callout: {
      label: "The four-part decision",
      text: "Assumption · falsifier · review date · named owner. A decision missing any of these will be relitigated, and the relitigation will not be scheduled.",
    },
    references: [
      { label: "Snowden & Boone, A Leader's Framework for Decision Making (HBR, 2007)", detail: "Cynefin: in the complex domain, probe–sense–respond rather than analyse–decide.", url: "https://hbr.org/2007/11/a-leaders-framework-for-decision-making" },
      { label: "ISO 50001 — energy management systems", detail: "The review loop as the mechanism that prevents pilot purgatory.", url: "https://www.iso.org/iso-50001-energy-management.html" },
      { label: "SEI — Architecture Tradeoff Analysis Method (ATAM)", detail: "Making the accepted trade-off explicit rather than implicit." },
    ],
  },
];
