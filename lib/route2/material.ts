/**
 * Route 2 material — four sections, ~60 facilitator-led minutes, all taught
 * before the task.
 *
 * Level 3: the question stops being "which measure is best" and becomes "which
 * structure makes good measures the default, and who is allowed to decide".
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
  /** What goes wrong when this is left to the teams. */
  ifLeftToTeams: string;
  /** The engineering symptom that reaches up to this lever. */
  symptom: string;
};

export const MANAGEMENT_LEVERS: ManagementLever[] = [
  {
    id: "controllability",
    label: "Controllability",
    decides:
      "Which three to five indicators management steers by, what threshold on each one triggers a decision, and who brings them.",
    ifLeftToTeams:
      "Telemetry stays in engineering terms. It is technically excellent and unusable as management information, so decisions continue to be made on anecdote.",
    symptom: "A dashboard only an SRE can read",
  },
  {
    id: "scaling",
    label: "Scaling",
    decides:
      "The policy capacity is provisioned under — demand-triggered or schedule-triggered, what minimum is justified, and when the rule is re-examined.",
    ifLeftToTeams:
      "Every team optimises for never being the one that caused an outage, which rationally produces permanent over-provisioning nobody is accountable for.",
    symptom: "A scaling rule set at launch, never revisited",
  },
  {
    id: "quality",
    label: "Quality",
    decides:
      "Whether resource utilisation counts as a quality characteristic with a gate, or as a nice-to-have that yields whenever a date is at risk.",
    ifLeftToTeams:
      "Quality becomes whatever survives the last week before release, and efficiency is always the first characteristic traded away.",
    symptom: "Efficiency work that never passes review because nothing requires it",
  },
  {
    id: "investment",
    label: "Investment",
    decides:
      "The split of delivery capacity between feature work and structural work — the only lever that actually creates the hours the rest of this needs.",
    ifLeftToTeams:
      "Nothing happens. Efficiency work competes with committed roadmap items inside a team that is measured on the roadmap, and it loses every time.",
    symptom: "Findings with no capacity behind them",
  },
  {
    id: "principles",
    label: "Architecture principles",
    decides:
      "What teams are required to design against, who owns those principles, and what happens at the gate when a design does not meet them.",
    ifLeftToTeams:
      "Six locally reasonable conventions, none of them wrong, none of them consistent — and no basis on which a review could ask for rework.",
    symptom: "Redundant data flows nobody had to justify",
  },
  {
    id: "longterm",
    label: "Long-term product responsibility",
    decides:
      "Who carries the operating cost of an architecture decision for the years after the roadmap that produced it has been forgotten.",
    ifLeftToTeams:
      "The cost lands on whoever operates the system later, which is a different budget and usually a different person — so nobody making the decision feels it.",
    symptom: "A five-year-old platform nobody chose",
  },
];

/** The engineering layer the levers sit above — the lower half of A's diagram. */
export const SYMPTOM_LAYER = [
  { id: "dash", label: "A dashboard only an SRE can read", lever: "controllability" },
  { id: "rule", label: "A scaling rule set at launch", lever: "scaling" },
  { id: "flow", label: "A redundant customer-data flow", lever: "principles" },
];

// ---------------------------------------------------------------------------
// B — RACI
// ---------------------------------------------------------------------------

export type RaciLetter = "R" | "A" | "C" | "I";

export const RACI_LETTERS: { id: RaciLetter; name: string; meaning: string }[] = [
  { id: "R", name: "Responsible", meaning: "Does the work. There can be several." },
  {
    id: "A",
    name: "Accountable",
    meaning: "Owns the outcome and is the single point of approval. Exactly one, always.",
  },
  { id: "C", name: "Consulted", meaning: "Asked before the decision — two-way." },
  { id: "I", name: "Informed", meaning: "Told after the decision — one-way." },
];

export const RACI_FAILURES = [
  {
    id: "diffused",
    label: "Diffused accountability",
    what: "The A is given to a committee, a team or a function rather than to a person.",
    symptom:
      "The decision reappears on every agenda and is never closed. Everyone present assumes someone else present will carry it.",
  },
  {
    id: "authority",
    label: "Accountability without authority",
    what: "The A holder cannot bind budget or capacity for the thing they are accountable for.",
    symptom:
      "An agreed standard that no team's roadmap ever makes room for. This is the more common and more damaging failure, because it looks like governance while producing nothing.",
  },
];

/** The demo grid in section B — four decision objects, five roles. */
export const DEMO_RACI_ROWS = [
  { id: "d1", label: "Approving a binding monitoring standard" },
  { id: "d2", label: "Defining the architecture principles" },
  { id: "d3", label: "Enforcing the review gate on one change" },
  { id: "d4", label: "Allocating capacity for structural work" },
];

export const RACI_ROLES = [
  { id: "cto", name: "CTO / Management", note: "Can bind budget and capacity." },
  { id: "arch", name: "Architecture Board", note: "Owns technical standards; no budget authority." },
  { id: "product", name: "Product Management", note: "Owns the roadmap and its dates." },
  { id: "eng", name: "Engineering Teams", note: "Do the work; live inside the standard." },
  { id: "ops", name: "Operations", note: "Runs the result and sees the cost first." },
];

// ---------------------------------------------------------------------------
// C — the four decision postures
// ---------------------------------------------------------------------------

export type PostureId = "instrument" | "bet" | "measure" | "wait";

export type DecisionPosture = {
  id: PostureId;
  label: string;
  /** Position in the 2×2: information (low|high) × cost of delay (low|high). */
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
    failure: "Deciding without the indicator — which is indistinguishable from guessing, six months later.",
  },
  {
    id: "bet",
    label: "Decide now and accept the bet",
    information: "low",
    delayCost: "high",
    rule: "Where no instrument exists, state the assumption and the date you will revisit it, and say out loud that it is a bet.",
    failure: "Presenting a bet as an analysis, so nobody schedules the review that would catch it.",
  },
  {
    id: "measure",
    label: "Wait and measure",
    information: "low",
    delayCost: "low",
    rule: "Only legitimate when waiting is genuinely cheap and the measurement is actually funded and dated.",
    failure: "An unfunded 'let us gather more data' that quietly becomes a decision never to decide.",
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
  { label: "A standard", text: "The pilot's result becomes something teams are required to design against." },
  { label: "A funding line", text: "Capacity for the rollout exists before the pilot reports, not after it succeeds." },
  { label: "An accountable owner", text: "One person who can bind teams to the outcome — not the pilot team itself." },
];

// ---------------------------------------------------------------------------
// D — the MetricFlow worked example (read-only)
// ---------------------------------------------------------------------------

export const METRICFLOW = {
  company: "MetricFlow Digital Systems GmbH",
  banner: "Worked example · read-only · you are not assessed on this company",
  situation:
    "MetricFlow Digital Systems GmbH operates several digital platforms with a growing range of functions and a strongly increasing number of users. They have been continuously extended without systematically simplifying the overall architecture or specifically monitoring resource efficiency. The systems work, but cause rising operating effort, load peaks, and increasing complexity in development and operations. Management requires a workable recommendation on how efficiency transparency and architectural sustainability can be improved together.",
  initialPosition: [
    "Monitoring exists, but is not geared to efficiency and sustainability questions.",
    "Conspicuous load patterns are recognised, but not systematically translated into architecture decisions.",
    "Services and data flows are partly redundant or unnecessarily complex.",
    "Product teams prioritise new functions over structural improvement.",
    "Larger rebuilds appear risky and resource-intensive.",
    "Management wants progress without massively impairing the teams' ability to deliver.",
  ],
  coreIdea:
    "The greatest leverage lies not in selective individual optimisations, but in the combination of extended efficiency monitoring and sustainable architecture management — so that technical transparency can be translated into viable structural decisions.",
  levers: [
    {
      id: "l1",
      label: "Extend monitoring to efficiency and resource indicators",
      note: "Not more dashboards — different questions asked of the same telemetry, aggregated so they are comparable across products.",
    },
    {
      id: "l2",
      label: "Identify the architecturally most problematic areas in priority order",
      note: "Priority order, not visibility order. The loudest area is rarely the most expensive one.",
    },
    {
      id: "l3",
      label: "Introduce architectural principles for resource-friendly, scalable, maintainable systems",
      note: "Something for a review to test against. Without this, a gate is taste.",
    },
    {
      id: "l4",
      label: "Connect monitoring data to architecture review and product prioritisation",
      note: "The coupling itself is a lever — it is what stops findings from dying as tickets.",
    },
  ],
  prioritised: {
    label: "Extended efficiency monitoring, directly coupled to an architecture review",
    reasons: [
      "It creates transparency about causes rather than symptoms.",
      "It improves the quality of every later architecture decision.",
      "It reduces the risk of untargeted optimisation.",
      "It connects technical observation with management responsibility inside one framework.",
    ],
    notChosen:
      "The option that felt more immediately productive — optimising the loudest services now — was not prioritised. It produces a visible saving and leaves the mechanism that generated the waste completely untouched, so the same pattern returns in the next service.",
  },
  horizons: [
    {
      id: "short",
      label: "Short term",
      items: [
        "Define the relevant efficiency and resource indicators.",
        "Make critical load and complexity patterns visible.",
        "Select the first focus areas for architecture review.",
      ],
    },
    {
      id: "medium",
      label: "Medium term",
      items: [
        "Targeted simplification of inefficient or redundant structures.",
        "Introduce sustainable architectural principles into review and decision processes.",
        "Align product and architecture priorities.",
      ],
    },
    {
      id: "structural",
      label: "Structural",
      items: [
        "Anchor sustainable architecture and efficiency monitoring in development governance, quality management and management reviews.",
        "Couple architecture decisions to transparency, scaling logic and sustainability goals.",
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
    standfirst:
      "Six management levers control what engineering can do about efficiency. Not one of them is inside engineering.",
    minutes: 16,
    definition:
      "Monitoring and sustainable architecture are not operational topics of development and operations alone. Six levers decide whether either is possible — controllability, scaling, quality, investment, architecture principles, and long-term product responsibility — and every one of them is set above the teams that would have to act.",
    insight:
      "Investment is the decisive lever, because it is the only one that creates hours. Efficiency work competes with feature work for the same capacity, inside teams that are measured on feature delivery; no team resolves that conflict from below, because resolving it means choosing to miss a commitment they are assessed on. It is resolved by whoever sets the capacity split, or it is not resolved at all.",
    takeaway:
      "Bring management three to five indicators, each with a trend, an owner and a threshold that triggers a decision. Telemetry that only an SRE can interpret is not management information, and a board cannot steer what it cannot see in its own terms. Then ask for the one thing only a board can grant: a share of capacity that is not the residue left after the roadmap.",
    body: [
      {
        heading: "The six levers, and what happens without them",
        paragraphs: [
          "Each lever in the diagram decides something specific, and each one has a characteristic failure when it is left to the teams. Read them as a set: the arrows all terminate in the upper layer, which is the picture's whole argument — no symptom in the lower layer has a fix that lives in the lower layer.",
          "Controllability deserves particular attention because it is the one most often declared solved. An organisation with excellent telemetry and no management indicator has not solved controllability; it has instrumented the system and left the steering wheel disconnected.",
        ],
      },
      {
        heading: "Long-term product responsibility",
        paragraphs: [
          "Systems outlive the roadmap that created them. The operating cost of an architecture decision is paid for years, usually by someone who did not make it and often out of a different budget — which is precisely why the decision feels free at the moment it is taken.",
          "Naming an owner for that cost is what converts an architecture decision from a technical preference into an accountable one. It is also the single most uncomfortable question to ask in a planning meeting, and the most useful.",
        ],
      },
      {
        heading: "The cost framing a European board already recognises",
        paragraphs: [
          "Three pressures, in the order a CFO will meet them. Infrastructure spend rising faster than usage, which reads as a margin problem before it reads as an engineering one. Coordination cost rising with complexity, which shows up as slower delivery from the same headcount. And reporting duties that increasingly require a defensible number rather than an intention.",
          "CSRD and ESRS E1 make climate-related disclosure an audited obligation for a widening set of companies: figures must be substantiated and capable of assurance, which turns measurement from an engineering preference into a governance requirement. The EU Energy Efficiency Directive (EU/2023/1791) adds reporting obligations around data centres specifically, which is why efficiency data is increasingly demanded from outside the company rather than requested from inside it.",
          "ISO 50001 is the archetype worth copying, and the point is not its metric. It is the loop: policy → objective → measurement → review → correction. A number without that loop changes nothing, and the loop without a number is a meeting.",
        ],
      },
    ],
    reasoning: [
      "In the task you rank guiding decisions. A guiding decision changes what teams are allowed or required to do — it does not improve one system once.",
      "Test each candidate: if a single team could execute it in a single sprint without anyone's approval, it is a measure, not a guiding decision.",
      "The lever a decision pulls is what tells you its rank. Investment and principles change the default; a consolidation programme changes one estate.",
    ],
    callout: {
      label: "The question that settles it",
      text: "Ask of any proposed decision: who has to agree before a team can act on it? If the answer is 'nobody', it is a measure.",
    },
    references: [
      {
        label: "CSRD / ESRS E1 — climate-related disclosures",
        detail: "Reported figures must be substantiated and auditable, which makes measurement a governance requirement.",
        url: "https://finance.ec.europa.eu/capital-markets-union-and-financial-markets/company-reporting-and-auditing/company-reporting/corporate-sustainability-reporting_en",
      },
      {
        label: "EU Energy Efficiency Directive (EU/2023/1791)",
        detail: "Data-centre reporting obligations — efficiency data demanded from outside the company.",
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
    id: "raci",
    code: "B",
    n: 2,
    icon: "shield",
    kicker: "B · Who is allowed to decide",
    title: "Decision architecture: RACI in full",
    standfirst:
      "Four letters, one structural rule, and two failure modes — one of which looks exactly like governance while producing nothing.",
    minutes: 16,
    definition:
      "RACI assigns four distinct relationships to a decision. Responsible does the work and there can be several. Accountable owns the outcome and is the single point of approval — exactly one, always. Consulted is asked before the decision and the exchange is two-way. Informed is told after it, one-way.",
    insight:
      "The one structural rule is that each row has exactly one A. Two Accountables produce an unresolved escalation path: when they disagree, nothing above them is designed to settle it, so the decision stalls in a place no process is watching. Zero Accountables produce a decision that quietly never happens, and — worse — never appears as a failure, because no one was named to fail.",
    takeaway:
      "Before filling a grid, decide who can bind capacity for that row. The A belongs to whoever can make a team's roadmap change; assigning it to anyone else is the second failure mode written down in a table. And keep R and A separate for architecture standards: the person writing the standard should not also be the only person approving it.",
    body: [
      {
        heading: "The two failure modes",
        paragraphs: [
          "Diffused accountability gives the A to a committee, a 'team' or a function rather than to a person. The symptom is recognisable: the decision reappears on every agenda and is never closed, because everyone in the room assumes someone else in the room is carrying it.",
          "Accountability without authority gives the A to a person who cannot bind budget or capacity for it. The symptom is an agreed standard that no team's roadmap ever makes room for. This is the more common and the more damaging of the two, because it produces all the artefacts of governance — a named owner, a published standard, a review — and none of its effects. An architecture board with an A on capacity allocation is this failure in its purest form.",
        ],
      },
      {
        heading: "R and A on the same person",
        paragraphs: [
          "It is permitted, and for most operational rows it is fine. For architecture standards it is a mistake: the person who writes the standard should not be the only person who approves it, because the approval step exists precisely to test the standard against interests the author does not hold.",
          "The practical form is R with the architecture board, A with the engineering or technical leader who can bind capacity, C with product management, I with the teams. Other arrangements defend; what does not defend is an A that cannot say no and make it stick.",
        ],
      },
      {
        heading: "What makes a review gate real",
        paragraphs: [
          "A gate is only real if the A holder can refuse a change and the refusal holds. Everything else — the checklist, the meeting, the template — is administration around a decision that was never actually delegated.",
          "This is where RACI meets the architecture-governance literature and the professional standard: iSAQB's CPSA Advanced Level Module GREEN treats sustainability-aware architecture as an architect competency, and architecture principles without an owner reliably decay into recommendations. COBIT's governance processes use RACI charts for exactly this reason — decision rights are the thing being designed, not the documentation of them.",
        ],
      },
    ],
    reasoning: [
      "The task asks you to assign a RACI for ownership of NexLayer's efficiency and architecture standard.",
      "Before you fill the grid, decide who can bind capacity. The A belongs to whoever can make a team's roadmap change.",
      "Exactly one A per row, and at least one R. A row whose A cannot bind capacity is the second failure mode, however senior the name in it.",
    ],
    callout: {
      label: "The test for any A",
      text: "Can this role change a team's roadmap? If not, they are not accountable — they are consulted, and someone else is about to discover they were supposed to decide.",
    },
    references: [
      {
        label: "RACI in project and IT governance practice",
        detail: "Responsibility-assignment matrix; COBIT uses RACI charts to allocate decision rights across governance processes.",
        url: "https://www.isaca.org/resources/cobit",
      },
      {
        label: "iSAQB CPSA Advanced Level — Module GREEN",
        detail: "Sustainability-aware architecture as an examinable competency; principles without an owner decay into recommendations.",
        url: "https://www.isaqb.org/",
      },
    ],
  },

  {
    id: "uncertainty",
    code: "C",
    n: 3,
    icon: "target",
    kicker: "C · Deciding before the data is in",
    title: "What holds a decision together under incomplete information",
    standfirst:
      "Four postures, one falsifier, and the reason technically successful pilots so often change nothing.",
    minutes: 16,
    definition:
      "At board level the question is rarely 'what is the right answer'. It is 'what is the most defensible decision available with what we know today, and what would change it'. That reframing is not a lowering of standards — it is the only form the question can honestly take when cause and effect are not yet separable.",
    insight:
      "Cynefin's complex domain describes exactly this situation: cause and effect are clear only in retrospect, so more analysis does not converge on certainty. The correct move is a safe-to-fail probe with explicit sensing — probe, sense, respond — rather than further study. In practice that means a decision carrying four things: a stated assumption, an indicator that would falsify it, a review date, and a named owner.",
    takeaway:
      "Treat waiting as a decision with a price, and quantify it: capacity consumed by the status quo, decisions made by default while the question is open, and architectural drift compounding in the meantime. Then write the recommendation in five parts — recommendation, trade-off accepted, assumption, falsifier, review point — so that the next person to challenge it is arguing with the assumption rather than with you.",
    body: [
      {
        heading: "The four postures",
        paragraphs: [
          "The 2×2 above crosses the information available against the cost of delay. Its purpose is to stop two specific mistakes: treating every incomplete-information decision as a reason to wait, and treating every urgent decision as a reason to skip the instrument.",
          "The upper-left quadrant — low information, high cost of delay — is where most efficiency decisions actually sit, and it is the one the phrase 'let us gather more data' is most often used to escape.",
        ],
      },
      {
        heading: "The cost of waiting, as a quantity",
        paragraphs: [
          "Waiting one more quarter consumes capacity at the status quo rate: whatever the inefficiency costs per month, multiplied by three, is not a rhetorical figure but a line item. Meanwhile decisions are still being made — by default, by every team that ships something during the wait, under the conventions the delayed decision was going to change.",
          "And drift compounds. Every service built during the wait is built to the old shape, so the eventual decision is larger, more expensive and less popular than the one that was available this quarter. A decision deferred is not the same decision later; it is a bigger one.",
        ],
      },
      {
        heading: "Pilot purgatory",
        paragraphs: [
          "Efficiency pilots that succeed technically and never scale are the characteristic failure of this field. The pattern is consistent and the cause is almost never technical: the pilot proved the thing worked and was never attached to anything that would make it spread.",
          "Three anchors prevent it, and all three have to exist before the pilot reports: a standard the result becomes, a funding line the rollout draws on, and an accountable owner who can bind teams. A pilot with none of them produces a slide deck; a pilot with all three produces a change in how the organisation builds software.",
        ],
      },
      {
        heading: "Writing a recommendation that survives challenge",
        paragraphs: [
          "Five parts, in order: the recommendation as a decision, the trade-off accepted, the assumption it rests on, the falsifier, and the review point. SEI's ATAM vocabulary from Route 1 is what makes the second part precise — name the sensitivity and trade-off points rather than asserting an improvement in 'quality'.",
          "The falsifier is the part that most recommendations omit and the part that makes the rest credible. Naming what would prove you wrong, and when you will look, is what distinguishes a decision under uncertainty from an opinion delivered with confidence.",
        ],
      },
    ],
    reasoning: [
      "The last exercise asks for one decision that must be taken now despite incomplete information, and what waiting would cost.",
      "A good answer names the assumption it is betting on and the signal that would prove the bet wrong, with a date.",
      "An answer that only says 'we should decide soon' is not a decision. Neither is one whose cost of waiting is 'we lose time'.",
    ],
    callout: {
      label: "The four-part decision",
      text: "Assumption · falsifier · review date · named owner. A decision missing any of these will be relitigated, and the relitigation will not be scheduled.",
    },
    references: [
      {
        label: "Snowden & Boone, A Leader's Framework for Decision Making (HBR, 2007)",
        detail: "Cynefin: in the complex domain, probe–sense–respond rather than analyse–decide.",
        url: "https://hbr.org/2007/11/a-leaders-framework-for-decision-making",
      },
      {
        label: "ISO 50001 — energy management systems",
        detail: "The review loop as the mechanism that prevents pilot purgatory.",
        url: "https://www.iso.org/iso-50001-energy-management.html",
      },
      {
        label: "SEI — Architecture Tradeoff Analysis Method (ATAM)",
        detail: "Making the accepted trade-off explicit rather than implicit.",
        url: "https://www.sei.cmu.edu/",
      },
    ],
  },

  {
    id: "worked",
    code: "D",
    n: 4,
    icon: "certificate",
    kicker: "D · A complete reasoning, start to finish",
    title: "Worked example: MetricFlow Digital Systems GmbH",
    standfirst:
      "Read-only. The model you reason from — on a company you will not be tested on.",
    minutes: 12,
    definition:
      "MetricFlow is a fully worked case rather than an answer key: the situation, the initial position, the reasoning move that unlocked it, the four levers that fell out of that move, which one was prioritised, and — the part that matters most — why it was prioritised over the option that felt more immediately productive.",
    insight:
      "The single most important move is the reframing. Faced with rising infrastructure cost and several inefficient applications, the obvious question is 'which application is worst?' — and that question, answered well, produces a fix and no structure. MetricFlow asked instead: what is missing that would let us reliably find and fix the worst application, this time and every time after? Everything else in the case follows from that substitution.",
    takeaway:
      "Do not transfer MetricFlow's answer to NexLayer. Transfer the shape: couple transparency to a structural decision, sequence it across three horizons, and make one thing binding rather than many things recommended.",
    body: [
      {
        heading: "How to read it",
        paragraphs: [
          "The panel below is deliberately styled unlike anything else on this page — dark banner, bordered card, no inputs — because it is the one block on the route that is not yours to fill in.",
          "Watch for the reframing in step one as you read. It is the move the task asks you to make for NexLayer, on a company that has appeared nowhere else in this course precisely so that copying the answer will not work and reproducing the reasoning will.",
        ],
      },
    ],
    reasoning: [
      "NexLayer is not MetricFlow. Do not transfer the answer — transfer the shape.",
      "Couple transparency to a structural decision; sequence across short, medium and structural horizons; make one thing binding rather than many things recommended.",
      "When you rank NexLayer's guiding decisions, check that your top three contains all of: comparable information, something binding to design against, and the loop where the information is acted on.",
    ],
    callout: {
      label: "The move to copy",
      text: "Not 'which application is worst?' but 'what is missing that would let us find and fix the worst one, every time?'",
    },
    references: [
      {
        label: "Module 7 curriculum case — MetricFlow Digital Systems GmbH",
        detail: "Fictional case constructed for this module; the reasoning pattern follows the coupling logic in ISO 50001 and the iSAQB GREEN curriculum.",
      },
      {
        label: "iSAQB CPSA Advanced Level — Module GREEN",
        url: "https://www.isaqb.org/",
      },
    ],
  },
];
