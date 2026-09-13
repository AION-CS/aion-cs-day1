/**
 * Route 1 material — five sections, ~60 facilitator-led minutes, all of it
 * taught before the task starts.
 *
 * Day 11 is Module 7, day 2 of 2: monitoring software efficiency and
 * sustainable software architecture. Carbon accounting at code level was day
 * 1's subject and is deliberately background here — SCI appears once, as the
 * formal rate-based measure, and never as the spine of the argument.
 */

import type { MaterialSection } from "@/lib/materialSection";
import type { MaterialSectionId } from "./sections";

// ---------------------------------------------------------------------------
// S1 — the eight observation channels (data for the radial diagram)
// ---------------------------------------------------------------------------

export type ObservationChannel = {
  id: string;
  label: string;
  /** What you look for in this channel once the question is efficiency. */
  lens: string;
  /** What a problematic pattern looks like here. */
  problem: string;
};

export const OBSERVATION_CHANNELS: ObservationChannel[] = [
  {
    id: "cpu",
    label: "CPU load",
    lens: "Read the floor, not the peak: what does utilisation never drop below, and what is running down there?",
    problem:
      "A service whose CPU never falls below 40% at 04:00 is doing work nobody requested. The peak is explained by users; the floor is explained by design.",
  },
  {
    id: "memory",
    label: "Memory consumption",
    lens: "Look for allocation that grows with uptime rather than with users — and for capacity reserved against a peak that no longer occurs.",
    problem:
      "Caches with no eviction policy, and heap floors sized for a launch-day peak two years ago, both look perfectly healthy on a threshold dashboard.",
  },
  {
    id: "io",
    label: "I/O behaviour",
    lens: "Measure amplification: how many physical read/write operations does one logical user action actually cause?",
    problem:
      "A single profile update that triggers seven writes across three stores because each service persists its own copy of the record.",
  },
  {
    id: "network",
    label: "Network load",
    lens: "Look for the same payload crossing the same boundary more than once, and for payload size that is not explained by what the caller uses.",
    problem:
      "A list view that transfers the full object graph for every row and renders four fields of it.",
  },
  {
    id: "db",
    label: "Database access",
    lens: "Count queries per request before you look at query latency. A fast query executed 120 times is not a fast page.",
    problem:
      "The N+1 pattern: one query for the list, then one more per row. Each query is well inside its SLO, and the page is still a query storm.",
  },
  {
    id: "background",
    label: "Background processes",
    lens: "Ask who consumes the output. A scheduled job with no reader is pure cost with no counterparty.",
    problem:
      "A nightly full export still running eighteen months after the report it fed was retired, because nothing failed when the report went away.",
  },
  {
    id: "scaling",
    label: "Scaling behaviour",
    lens: "Ask what triggers scale-out — actual demand, or a clock. Then ask when the rule was last revisited.",
    problem:
      "Instance count that tracks a schedule rather than traffic, so capacity arrives at 08:00 whether or not anyone shows up.",
  },
  {
    id: "idle",
    label: "Idle resources",
    lens: "Look for provisioned capacity that has never served a request, and for minimum instance floors nobody can justify.",
    problem:
      "Comatose infrastructure: powered, monitored, patched, invoiced, and delivering no useful work at all.",
  },
];

/** S1's second visual: the two monitoring postures, same telemetry. */
export const POSTURES = {
  classic: {
    title: "Classic performance monitoring",
    question: "Is it working, and is it fast enough?",
    rows: [
      { label: "Trigger", text: "Incidents and SLO breaches" },
      { label: "Definition of healthy", text: "Inside the threshold" },
      { label: "Cadence", text: "Continuous alerting; review only after failure" },
      { label: "Owner", text: "On-call engineering / SRE" },
      {
        label: "Blind spot",
        text: "A system that is stable, fast and permanently wasteful never trips anything",
      },
    ],
  },
  efficiency: {
    title: "Efficiency / sustainability monitoring",
    question: "Is this resource use necessary, and is it proportionate to the value delivered?",
    rows: [
      { label: "Trigger", text: "A review cadence — not a failure" },
      { label: "Definition of healthy", text: "Inside the threshold and justified" },
      { label: "Cadence", text: "Scheduled review with a standing agenda item" },
      { label: "Owner", text: "Architecture and engineering leadership, jointly" },
      {
        label: "Designed to find",
        text: "Exactly the system the classic posture cannot see",
      },
    ],
  },
} as const;

// ---------------------------------------------------------------------------
// S2 — the four load bands
// ---------------------------------------------------------------------------

export type LoadBandId = "necessary" | "unnecessary" | "designed" | "permanent";

export type LoadBand = {
  id: LoadBandId;
  label: string;
  meaning: string;
  verdict: string;
  example: string;
  /** Tailwind-ish tone key the SVG and the cards share. */
  tone: "ok" | "warn" | "danger" | "ink";
};

export const LOAD_BANDS: LoadBand[] = [
  {
    id: "necessary",
    label: "Necessary load",
    meaning: "Work the user asked for, done once, at the right time.",
    verdict: "Leave it alone.",
    example:
      "Checkout traffic on a retail platform at 20:00. The peak is the business; flattening it would mean fewer orders, not a better system.",
    tone: "ok",
  },
  {
    id: "unnecessary",
    label: "Unnecessary load",
    meaning: "Work nobody asked for, or the same work repeated.",
    verdict: "Remove it.",
    example:
      "A nightly full-table export feeding a report retired eighteen months ago. Nothing failed when the reader disappeared, so nothing reported it.",
    tone: "warn",
  },
  {
    id: "designed",
    label: "Poorly designed load",
    meaning:
      "Necessary work done in an expensive shape — N+1 queries, chatty synchronous service calls, a full reload where a delta would do.",
    verdict: "Redesign it.",
    example:
      "A dashboard that issues one query per row instead of one per page. The data is needed; the shape is not. The interest on this debt is paid monthly, in operating cost.",
    tone: "danger",
  },
  {
    id: "permanent",
    label: "Permanently inefficient load",
    meaning:
      "Baseline consumption that never drops: idle instances, always-on batch, over-provisioned floors.",
    verdict: "Re-architect or decommission it.",
    example:
      "A three-instance minimum sized for a launch peak two years ago, serving a fraction of that traffic ever since. Every dashboard renders it as 'normal'.",
    tone: "ink",
  },
];

// ---------------------------------------------------------------------------
// S3 — the four architecture levers
// ---------------------------------------------------------------------------

export type Lever = {
  id: string;
  label: string;
  definition: string;
  failureMode: string;
  example: string;
  /** Which of S1's eight channels shows the improvement. */
  channels: string[];
};

export const LEVERS: Lever[] = [
  {
    id: "modularity",
    label: "Modularity",
    definition:
      "Capabilities are separated into units with an owner, a boundary and a contract, so a change lands in one place instead of five. Modularity is about where a decision is allowed to have effect, not about how many repositories exist.",
    failureMode:
      "Without it, every efficiency improvement becomes a cross-team negotiation, so the cheapest improvements are the ones nobody attempts.",
    example:
      "Read-model separation (CQRS): the reporting path gets its own model and its own store rather than competing with the transactional path on one shared database.",
    channels: ["Database access", "I/O behaviour"],
  },
  {
    id: "decoupling",
    label: "Decoupling",
    definition:
      "Components interact through explicit, tolerant contracts rather than through synchronous chains that must all be up, and all be fast, at the same moment. Decoupling converts a dependency into a message.",
    failureMode:
      "Without it, a chatty synchronous chain multiplies one user action into a dozen network round trips, and every participant scales to cover the slowest partner.",
    example:
      "Event-driven propagation of a customer-record change, replacing a three-hop synchronous fetch-transform-persist chain.",
    channels: ["Network load", "CPU load"],
  },
  {
    id: "scaling",
    label: "Right-sized scaling",
    definition:
      "Capacity follows observed demand, on a rule someone owns and revisits. The floor is justified, the trigger is a signal rather than a clock, and the policy has a review date.",
    failureMode:
      "Without it, scaling rules become archaeology: set during a launch, never revisited, and defended by the fact that nothing has broken.",
    example:
      "Request- or queue-depth-based autoscaling with an explicit, reviewed minimum, replacing schedule-based scale-out.",
    channels: ["Scaling behaviour", "Idle resources"],
  },
  {
    id: "dataflows",
    label: "Efficient data flows",
    definition:
      "A record has one canonical path and one owner. Data is moved when someone needs it moved, transformed once, and persisted where it is authoritative.",
    failureMode:
      "Without it, the same record is fetched, transformed and re-persisted by several services in sequence, and every copy becomes a reason the next change is expensive.",
    example:
      "One owning service for the customer record, with consumers subscribing to changes rather than re-deriving and re-storing their own copy.",
    channels: ["I/O behaviour", "Database access", "Network load"],
  },
];

// ---------------------------------------------------------------------------
// S4 — the five-way trade-off
// ---------------------------------------------------------------------------

export const TRADEOFF_AXES = [
  { key: "speed", label: "Delivery speed" },
  { key: "scope", label: "Feature scope" },
  { key: "elegance", label: "Technical elegance" },
  { key: "scalability", label: "Scalability" },
  { key: "efficiency", label: "Efficiency" },
] as const;

export const TRADEOFF_PROFILES = [
  {
    id: "ship",
    label: "Ship it this quarter",
    blurb:
      "Scope and date held fixed; everything else absorbs the difference. Nothing here is irrational — it is a deliberate purchase of time, paid for later by whoever operates the result.",
    values: { speed: 9, scope: 9, elegance: 3, scalability: 4, efficiency: 3 },
  },
  {
    id: "engineer",
    label: "Engineer it properly",
    blurb:
      "Structure and headroom bought at the cost of dates and scope. Also not free: a quarter of visible delivery is spent on something no customer can see.",
    values: { speed: 3, scope: 4, elegance: 9, scalability: 9, efficiency: 8 },
  },
] as const;

export const TRADEOFF_PAIRS = [
  {
    pair: "Delivery speed ↔ technical elegance",
    text: "The fastest path to a working feature is almost never the one that leaves the cleanest structure behind. Buying speed here is legitimate; pretending nothing was bought is what turns it into debt. The price shows up as the cost of the next change, not as a line in this quarter's report.",
  },
  {
    pair: "Feature scope ↔ efficiency",
    text: "Every additional feature adds code paths, data, background work and monitoring surface. A team that holds scope constant for one quarter and spends the capacity on removing work is not slowing down — it is paying the efficiency bill in the only currency that settles it.",
  },
  {
    pair: "Scalability ↔ simplicity",
    text: "Architectures that scale well are usually more distributed, and distribution is a permanent tax on comprehension, debugging and coordination. Scaling for a load you do not have buys headroom you pay operating cost for from the day it ships.",
  },
  {
    pair: "Technical elegance ↔ feature scope",
    text: "Refactoring competes directly with the roadmap for the same engineers in the same sprint. This is the pair where 'we will simplify it later' is usually said, and it is the pair where later usually does not arrive, because the pressure that deferred it does not go away.",
  },
  {
    pair: "Efficiency ↔ delivery speed",
    text: "Instrumenting, reviewing and redesigning for efficiency all consume delivery capacity now against a saving that materialises over quarters. This asymmetry — cost now, benefit later, benefit accruing to a different budget line — is why the decision belongs to management and not to a team.",
  },
] as const;

// ---------------------------------------------------------------------------
// The five sections
// ---------------------------------------------------------------------------

export const MATERIAL: MaterialSection<MaterialSectionId>[] = [
  {
    id: "monitoring",
    code: "S1",
    n: 1,
    icon: "gauge",
    kicker: "S1 · What you are actually looking at",
    title: "Monitoring with an efficiency lens",
    standfirst:
      "The same telemetry, asked a different question — and a system that never trips an alert while wasting capacity continuously.",
    minutes: 14,
    definition:
      "Monitoring with an efficiency lens asks whether the resources a system consumes are necessary and proportionate to the value it delivers. Classic performance monitoring asks whether the system is working and fast enough. The instrumentation overlaps almost completely; the question, the review rhythm and the owner do not. That difference is structural, not a matter of adding more dashboards.",
    insight:
      "Efficiency can barely be improved in a targeted way without transparency, because optimisation without measurement is a guess — and in a distributed system the guess is usually wrong about *where* the cost sits, not just about how much it is. Worse, threshold-based alerting is structurally incapable of reporting the most expensive failure mode there is: a system that is stable, fast and permanently wasteful. Nothing is breaching, so nothing fires, and the waste is renewed every month in the invoice rather than in the incident channel.",
    takeaway:
      "Run both postures over the same telemetry, and give the second one a calendar. Efficiency monitoring is defined by its review cadence and its owner: a finding with no meeting to arrive in is not a finding, it is a screenshot. Start from the eight observation channels below and, for each one, ask the floor question rather than the peak question — what does this never drop below, and what is running down there?",
    body: [
      {
        heading: "Two postures over one set of telemetry",
        paragraphs: [
          "Google's SRE practice gives the canonical form of the classic posture: the Four Golden Signals — latency, traffic, errors and saturation. They are an excellent instrument for the question they were designed for, which is whether a service is healthy for its users right now. Note what none of the four asks: whether the traffic should exist, whether the saturation is the result of a decision anyone would defend today, or whether the work being done is work anyone consumes.",
          "The efficiency posture keeps the same signals and changes the question to \"is this necessary, and is it proportionate?\". It is triggered by a cadence rather than by a failure, its definition of healthy is 'within threshold and justified', and it belongs to architecture and engineering leadership jointly rather than to whoever is on call. A system can be perfectly healthy under the first posture and indefensible under the second — and that combination is the normal case in a platform that has grown for several years.",
        ],
      },
      {
        heading: "Eight fields of observation",
        paragraphs: [
          "The diagram above is the working list: CPU load, memory consumption, I/O behaviour, network load, database access, background processes, scaling behaviour and idle resources. Each endpoint carries the efficiency question for that channel and the shape a problematic pattern takes there. Tap one to open it.",
          "Read them for floors and for repetition, not for peaks. A peak that maps to real demand is a healthy system doing its job. The dangerous readings are flat lines that never fall, counts that scale with rows rather than with pages, and jobs whose output has no reader — none of which any threshold will ever complain about.",
        ],
      },
      {
        heading: "The physical stake, in numbers",
        paragraphs: [
          "The IEA's *Energy and AI* report (2025) puts data-centre electricity consumption at roughly 415 TWh in 2024, about 1.5% of global electricity demand, and rising. That is the context, not the argument — the argument is what sits inside that number.",
          "Koomey and Taylor's analysis with Anthesis (2015) found that roughly 30% of physical servers in data centres were 'comatose': powered, patched, monitored, invoiced, and delivering no useful work. NRDC's 2014 data-centre work reported typical server utilisation of 12–18% in many enterprise environments. Neither of those is an incident. Neither would appear on a golden-signals dashboard as a fault. They are the empirical proof that the classic posture does not see the largest category of waste, and the reason the second posture needs its own review rhythm.",
        ],
      },
      {
        heading: "Instrumentation baseline",
        paragraphs: [
          "OpenTelemetry is the current vendor-neutral baseline for traces, metrics and logs, and it is almost certainly already in the stack. The efficiency lens rarely requires a new pipeline; it requires different aggregations, a different review, and a decision about who reads them.",
          "Where energy attribution is genuinely needed, exporters in the CNCF ecosystem such as Kepler extend the same pipeline toward per-workload power estimates, and ISO/IEC 21031:2024 (Software Carbon Intensity) provides the formal rate-based measure once you have the inputs. Treat both as an extension of the existing telemetry, not as a separate programme to fund.",
        ],
      },
    ],
    reasoning: [
      "In Part 1 you sort six real DataWeave signals into six areas. This section owns two of them — Monitoring and Scaling.",
      "Ask of each signal: is the system doing something wrong, or are we simply unable to see why it does what it does? That distinction is the whole sorting decision.",
      "A signal about dashboards, traceability or who reviews the data is about seeing. A signal about a rule that decides how much capacity exists is about the system's design, even when the rule is invisible in the code.",
    ],
    callout: {
      label: "The tell",
      text: "If a finding would never page anyone, it is an efficiency finding. That is precisely why it needs a scheduled review and a named owner — nothing in the incident process will ever surface it.",
    },
    references: [
      {
        label: "Google SRE Book — Monitoring Distributed Systems (Four Golden Signals)",
        detail: "Latency, traffic, errors, saturation — all four are service-health questions.",
        url: "https://sre.google/sre-book/monitoring-distributed-systems/",
      },
      {
        label: "IEA, Energy and AI (2025)",
        detail: "Data centres ≈415 TWh in 2024, ≈1.5% of global electricity demand.",
        url: "https://www.iea.org/reports/energy-and-ai",
      },
      {
        label: "Koomey & Taylor / Anthesis (2015)",
        detail: "≈30% of physical servers are comatose — powered, delivering no useful work.",
      },
      {
        label: "NRDC, Data Center Efficiency Assessment (2014)",
        detail: "Typical enterprise server utilisation of 12–18%.",
      },
      {
        label: "OpenTelemetry",
        detail: "Vendor-neutral instrumentation baseline for traces, metrics and logs.",
        url: "https://opentelemetry.io/",
      },
      {
        label: "Kepler (CNCF)",
        detail: "Power-attribution exporter extending the same telemetry pipeline toward energy visibility.",
        url: "https://github.com/sustainable-computing-io/kepler",
      },
    ],
  },

  {
    id: "load",
    code: "S2",
    n: 2,
    icon: "cycle",
    kicker: "S2 · Reading a load curve like a reviewer",
    title: "Not all load is a problem",
    standfirst:
      "Four bands, four verdicts — and the most expensive one is the flat line everybody has learned to read as normal.",
    minutes: 12,
    definition:
      "'High load' is not a diagnosis. Load divides into four bands with four different verdicts: necessary load, which you leave alone; unnecessary load, which you remove; poorly designed load, which you redesign; and permanently inefficient load, which you re-architect or decommission. Naming the band is the decision — everything after it is implementation.",
    insight:
      "The bands are not equally visible. A peak is legible: it has a shape, a time and usually a cause. A permanently inefficient baseline has none of those — it is inside the number every dashboard treats as the floor, so it is rendered as 'normal' on every chart, in every review, for years. Threshold alerting cannot report it by construction, because it was never out of bounds. That is why the most expensive band is also the one least likely to be raised by anyone.",
    takeaway:
      "Before proposing any fix, name the band. A measure aimed at the wrong band is not just ineffective, it is expensive theatre: optimising necessary load slows the business down, and removing unnecessary load twice does not remove it twice. When you cannot tell which band a symptom belongs to, that ambiguity is itself the finding — it means the transparency to answer the question does not exist yet.",
    body: [
      {
        heading: "Why peaks are the wrong place to look first",
        paragraphs: [
          "A peak that maps to real demand is a healthy system: the retail platform that saturates at 20:00 is saturating because people are buying things. Flattening that curve is a business decision, not an efficiency one.",
          "The patterns worth a reviewer's attention are the flat ones. Consumption that never falls has, by definition, no user behind it at the quiet hour. It is either work that runs regardless of demand, or capacity held regardless of use — and both are decisions someone once made and nobody has revisited since.",
        ],
      },
      {
        heading: "The poorly designed band, and why it compounds",
        paragraphs: [
          "Ward Cunningham's original technical-debt metaphor is usually quoted about developer time: ship a not-quite-right structure now, pay interest in every future change. In an operated system the interest is also paid in cash, every month, as the operating cost of the expensive shape. An N+1 query pattern does not merely slow one page down; it multiplies the database capacity that page requires for as long as it exists.",
          "That is what makes this band different from ordinary debt: nobody has to touch the code for the interest to accrue. It accrues because the system runs.",
        ],
      },
      {
        heading: "Where the formal measures fit",
        paragraphs: [
          "The Green Software Foundation's three working principles — energy efficiency, hardware efficiency and carbon awareness — are a useful orientation when you need to say which kind of saving a measure produces, and ISO/IEC 21031:2024 (Software Carbon Intensity) is the formal rate-based measure: a per-functional-unit rate rather than a total, which is what makes it comparable across releases.",
          "Both are background for this day rather than its subject. Day 11 is about seeing the waste and deciding what to do about it structurally; the rate you would report it in is a separate, later question.",
        ],
      },
    ],
    reasoning: [
      "Every signal in Part 1 belongs to one of these four bands, even though the form never asks you to name the band.",
      "The form asks instead whether the root cause is a Measurement Gap or an Architecture Decision — and the band tells you which. If you cannot see the load at all, that is a measurement gap. If you can see it and it should not exist in that shape, that is an architecture decision.",
      "Necessary load never produces a finding. If your reading of a signal is 'this is the business working', you have misread the signal — all six DataWeave signals sit in one of the other three bands.",
    ],
    callout: {
      label: "The expensive one",
      text: "Permanently inefficient load is the band with the highest cost and the lowest visibility, because it lives inside the baseline. Everything that reports 'normal' is reporting it.",
    },
    references: [
      {
        label: "Ward Cunningham, technical debt (OOPSLA '92 experience report)",
        detail: "The original metaphor — in an operated system the interest is paid in operating cost, not only in developer time.",
        url: "http://c2.com/doc/oopsla92.html",
      },
      {
        label: "Green Software Foundation — principles",
        detail: "Energy efficiency, hardware efficiency, carbon awareness.",
        url: "https://principles.green/",
      },
      {
        label: "ISO/IEC 21031:2024 — Software Carbon Intensity (SCI)",
        detail: "The formal rate-based measure: per functional unit, not a total.",
        url: "https://sci.greensoftware.foundation/",
      },
      {
        label: "Koomey & Taylor / Anthesis (2015); NRDC (2014)",
        detail: "Comatose servers and 12–18% utilisation as the archetype of permanently inefficient load.",
      },
    ],
  },

  {
    id: "architecture",
    code: "S3",
    n: 3,
    icon: "blueprint",
    kicker: "S3 · Where the fix actually lives",
    title: "Sustainable software architecture and its four levers",
    standfirst:
      "Complexity is not a developer-experience complaint. It is a recurring operating cost, and four levers control it.",
    minutes: 16,
    definition:
      "Sustainable software architecture means aligning architecture decisions with longevity, efficiency, maintainability, scalability and resource conservation — as design criteria applied when decisions are made, not as an efficiency sprint bolted on afterwards. It is the difference between a system that was designed and a system that was grown.",
    insight:
      "Architectural complexity is a recurring cost with several currencies: operating effort, coordination overhead, the price of the next change, and the resource consumption of shapes nobody would choose deliberately. Lehman's laws of software evolution state the mechanism plainly — a system in use is continually changed, its complexity increases as it evolves, and its quality declines unless work is explicitly invested against that decline. Nothing in that sentence is optional or avoidable; the only variable is whether the counter-investment is planned or improvised.",
    takeaway:
      "Judge a proposed measure by which lever it moves. A measure that removes a symptom without moving a lever buys a quarter; a measure that moves a lever changes what the system does by default. And treat 'we will simplify it later' as a claim requiring evidence: the cost of the change rises with exactly the complexity the change is meant to remove, so later is always more expensive than now.",
    body: [
      {
        heading: "Grown versus designed",
        paragraphs: [
          "The diagram above is the same capability set twice. On the left, the grown version: services with overlapping responsibilities, duplicated stores, one shared database that everything touches, and more than one path to the same record. On the right, the designed version: bounded modules, one owner per store, one canonical path. Both deliver the same features. They do not cost the same to run, and they do not cost the same to change.",
          "The point is not that the left-hand picture was incompetent. It is what accumulates when every individual decision is locally reasonable and nothing holds the set of decisions to a shape.",
        ],
      },
      {
        heading: "The four levers",
        paragraphs: [
          "Modularity, decoupling, right-sized scaling and efficient data flows. Each lever has a failure mode you can observe in production before you can see it in a diagram, and each one shows up in specific channels from S1 — which is what lets a monitoring finding be translated into an architecture question rather than a ticket.",
          "Open each lever above. Note particularly which channel proves it: right-sized scaling is visible in scaling behaviour and idle resources; efficient data flows show up in I/O amplification, database access and network load. If a proposed measure claims a lever but no channel would move, the claim is decoration.",
        ],
      },
      {
        heading: "The vocabulary a European architecture team already has",
        paragraphs: [
          "ISO/IEC 25010 is the product-quality model most German and European architecture groups will already be working against. Two of its characteristics carry this discussion: maintainability (modularity, modifiability, analysability) and performance efficiency, which names resource utilisation explicitly as a sub-characteristic alongside time behaviour and capacity. That matters politically as much as technically — resource utilisation is already a named quality characteristic, so efficiency work does not need a new category to be legitimate.",
          "iSAQB's CPSA Advanced Level Module GREEN is the professional certification reference for sustainability-aware architecture work, and is the reason this is treatable as an architecture competency rather than an individual engineer's initiative.",
        ],
      },
      {
        heading: "Why 'later' rarely arrives",
        paragraphs: [
          "The cost of removing complexity rises with the complexity to be removed, while the capacity available to remove it stays roughly constant. Deferral is therefore not neutral — it changes the price of the same decision, upward, every quarter.",
          "This is also why simplification work loses every unmanaged prioritisation contest: its cost is immediate and visible, its benefit is delayed and diffuse, and the benefit often accrues to a budget line other than the one that paid. That asymmetry is a management problem, which is exactly where Part 2 picks the argument up.",
        ],
      },
    ],
    reasoning: [
      "Part 2 asks you to judge three competing measures. Two of the four levers here — right-sized scaling and efficient data flows — are the ones an architecture review would actually pull at DataWeave.",
      "When you predict a measure's Sustainability impact and Long-term effect, you are really asking: does this measure move a lever, or only a symptom?",
      "A measure that changes what teams are required to design against moves a lever. A measure that changes three services does not, however large the saving.",
    ],
    callout: {
      label: "Lehman, restated for a budget meeting",
      text: "Complexity increases and quality declines unless work is explicitly invested against them. 'Explicitly invested' means someone funded it on purpose — decay is the default, not the failure case.",
    },
    references: [
      {
        label: "Lehman, Programs, Life Cycles, and Laws of Software Evolution (1980)",
        detail: "Continuing change, increasing complexity, declining quality without explicit counter-investment.",
      },
      {
        label: "ISO/IEC 25010 — systems and software quality models",
        detail: "Performance efficiency (incl. resource utilisation) and maintainability as named quality characteristics.",
        url: "https://www.iso.org/standard/78176.html",
      },
      {
        label: "iSAQB CPSA Advanced Level — Module GREEN",
        detail: "Sustainability-aware software architecture as an examinable architect competency.",
        url: "https://www.isaqb.org/",
      },
      {
        label: "Patterns named per lever",
        detail: "Read-model separation (CQRS) for redundant read paths; event-driven propagation for chatty synchronous chains; request- or queue-based autoscaling in place of schedule-based rules.",
      },
    ],
  },

  {
    id: "tradeoff",
    code: "S4",
    n: 4,
    icon: "target",
    kicker: "S4 · Nothing wins on every axis",
    title: "The five-way trade-off",
    standfirst:
      "Delivery speed, feature scope, technical elegance, scalability, efficiency — and the professional skill of saying what you are paying.",
    minutes: 12,
    definition:
      "Every architecture and prioritisation decision is a position on five axes at once: delivery speed, feature scope, technical elegance, scalability and efficiency. No real decision maximises all five. A team that believes it has is usually deferring a cost rather than avoiding one — and deferral moves the cost to a later budget, a different team, or the operating line.",
    insight:
      "The axes are not independent, and the dependencies are asymmetric in time. Speed and scope pay now and cost later; elegance, scalability and efficiency cost now and pay later. That asymmetry is the whole reason efficiency work loses unmanaged prioritisation contests: it is a cost this quarter against a benefit spread over several, often in someone else's budget. Making the trade explicit is what converts it from a silent default into a decision someone has actually taken.",
    takeaway:
      "State a trade-off in four parts: what you are buying, what you are paying, who carries the cost, and when. A trade-off that is not written down will be relitigated — usually by whoever inherits the cost, usually at the worst moment. And when you read a radar in Part 2, remember that Risk is inverted: on that axis a larger value is worse, so a bigger polygon is not automatically a better option.",
    body: [
      {
        heading: "Four pairs, worked",
        paragraphs: [
          "The trade-offs below are the ones that actually come up in a quarterly planning conversation. Each is legitimate in both directions; what is not legitimate is taking one without saying so.",
        ],
      },
      {
        heading: "How to state a trade-off professionally",
        paragraphs: [
          "SEI's Architecture Tradeoff Analysis Method (ATAM) gives the vocabulary a European architecture group will recognise: quality-attribute scenarios, sensitivity points (a decision that strongly affects one attribute) and trade-off points (a decision that affects several attributes in opposite directions). The method's actual contribution is procedural — it forces the trade-off to be named, attributed to a decision, and recorded, rather than discovered later in operations.",
          "ISO/IEC 25010 makes the same point from the other direction: 'quality' is a set of competing characteristics, not one scalar. Any claim that a measure improves quality is incomplete until it says which characteristic, and at whose expense.",
        ],
      },
      {
        heading: "Reading the radar you are about to use",
        paragraphs: [
          "Part 2 puts the same visual idiom in front of you with seven dimensions instead of five: you predict a measure's profile, then reveal the real one, and the gap between the dashed and solid polygons is the actual teaching material.",
          "One convention, stated here because a radar otherwise lies about it: Risk is inverted. Higher means more risk, so on that one axis a polygon that reaches further out is describing a worse option, not a better one.",
        ],
      },
    ],
    reasoning: [
      "In Part 2 you predict each measure across seven dimensions before seeing the real profile. Expect no option to win everywhere.",
      "If your prediction gives one option high marks on every axis, you have probably read the option's intent rather than its cost — go back and ask what it takes away.",
      "Risk is inverted: higher is worse. A large polygon that is large because of Risk is not a strong option.",
    ],
    callout: {
      label: "The written form",
      text: "\"We are buying X, paying Y, the cost lands on Z, in quarter N.\" Four clauses. A recommendation missing any of them will be reopened.",
    },
    references: [
      {
        label: "SEI — Architecture Tradeoff Analysis Method (ATAM)",
        detail: "Quality-attribute scenarios, sensitivity points, trade-off points.",
        url: "https://www.sei.cmu.edu/",
      },
      {
        label: "ISO/IEC 25010",
        detail: "Quality as a set of competing characteristics rather than a single scalar.",
        url: "https://www.iso.org/standard/78176.html",
      },
    ],
  },

  {
    id: "coupling",
    code: "S5",
    n: 5,
    icon: "link",
    kicker: "S5 · The closing rule",
    title: "Why monitoring and architecture must be decided together",
    standfirst: "Evidence without direction is archaeology. Direction without evidence is taste.",
    minutes: 6,
    definition:
      "Monitoring supplies evidence; architecture supplies direction. Decided separately, monitoring degrades into incident archaeology — high-resolution records of waste nobody is accountable for removing — and architecture degrades into taste, a rebuild justified by conviction and unprovable afterwards.",
    insight:
      "The intersection is where decisions actually get made, and it is an organisational place rather than a technical one: a recurring review where a monitoring finding is allowed to change an architecture decision, and where an architecture decision is required to name the indicator that will show whether it worked. Neither half can create that meeting on its own, which is why efficiency programmes that consist only of tooling, or only of a redesign, reliably stall.",
    takeaway:
      "Carry one rule into the task: an efficiency finding that does not reach an architecture decision is a ticket, and an architecture decision that is not measured is a belief. In Part 1 you will produce findings; in Part 2 you decide what they fund. Keep asking which of the two halves a proposed measure is missing.",
    body: [
      {
        heading: "The mechanism that keeps them coupled",
        paragraphs: [
          "Governance is the unglamorous answer: a standing agenda item, a named owner, a threshold that triggers a decision, and a review date. Without it the coupling depends on individuals remembering to make it, which works until the individual changes role.",
          "That is the thread Route 2 picks up at board level — who owns the standard, who can bind capacity to it, and what makes a decision defensible when the data is still incomplete. For now it is enough to notice that the coupling is a management artefact, not a technical one.",
        ],
      },
    ],
    reasoning: [
      "Use this as the tie-breaker in Part 2: the strongest option is the one that supplies the half DataWeave is missing, not the one with the largest single-quarter effect.",
      "If a measure produces evidence but changes nothing, ask what decision it feeds. If it changes structure but produces no indicator, ask how anyone will know it worked.",
    ],
    callout: {
      label: "Carry this into the task",
      text: "A finding that does not reach a decision is a ticket. A decision that is not measured is a belief.",
    },
    references: [
      {
        label: "ISO 50001 — energy management systems",
        detail: "The management-system loop: policy → objective → measurement → review → correction. The loop is the mechanism, not the metric.",
        url: "https://www.iso.org/iso-50001-energy-management.html",
      },
      {
        label: "iSAQB CPSA Advanced Level — Module GREEN",
        detail: "Architecture governance as the place the coupling is maintained.",
        url: "https://www.isaqb.org/",
      },
    ],
  },
];

export const materialById = (id: MaterialSectionId) => MATERIAL.find((m) => m.id === id)!;
