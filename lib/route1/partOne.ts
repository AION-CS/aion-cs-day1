/**
 * The task — Triage, Escalate, Deep Dive. ~20 minutes, covering curriculum
 * levels 1 and 2 in one part (CLAUDE.md §13; see sections.ts for why Day 13
 * has no separate Decide stage).
 *
 * Three steps, not one flat list of seven full workups:
 *
 *  1. Triage — all seven signals, but shallow: tag Positive or Negative and
 *     tap the phrase in the signal that proves it. Checked as a set, because
 *     the tag is a two-way choice and naming which row is wrong would be the
 *     answer.
 *  2. Escalate — the learner picks exactly two signals to take further, with
 *     a one-line reason. This is the actual level-1 skill: judging what
 *     deserves attention, not processing everything to the same depth.
 *  3. Deep dive — only the two escalated signals get the full workup: area,
 *     direct/indirect effect, improvement approach. Checked per signal, since
 *     area is a six-way choice.
 *
 * Both checks are set/pair-level and never name which specific answer is
 * wrong (CLAUDE.md #4, #12). After two genuine checks a "show the reasoning"
 * option opens — recorded in the export — so a learner who is stuck has a
 * real anchor to reason from, not just repeated guessing.
 */

import type { AnswerKeyBlock } from "@/lib/answerKey";
import type { IconKey } from "@/lib/routes";
import type { MaterialSectionId } from "./sections";

// ---------------------------------------------------------------------------
// Areas — the six-area diagnostic framework taught in S4
// ---------------------------------------------------------------------------

export type AreaId = "process" | "data" | "infrastructure" | "behaviour" | "complexity" | "management";

export type Area = {
  id: AreaId;
  name: string;
  icon: IconKey;
  /** One line under the name — what belongs here, never what the answer is. */
  note: string;
  /** A worked mini-example for the S4 diagram tile — not shown on the deep-dive picker. */
  example: string;
};

export const AREAS: Area[] = [
  {
    id: "process",
    name: "Process Efficiency",
    icon: "cycle",
    note: "How work moves through the organisation — steps, delay or rework in one workflow.",
    example: "An approval that used to pass through four hand-offs now clears in one digital step.",
  },
  {
    id: "data",
    name: "Data Use",
    icon: "database",
    note: "How much data is collected, duplicated and kept.",
    example: "Five departments each store their own full copy of the same customer dataset.",
  },
  {
    id: "infrastructure",
    name: "Infrastructure",
    icon: "drive",
    note: "The hardware, compute, storage and network a system runs on.",
    example: "A server sized for December's peak runs at a fifth of that capacity every other month.",
  },
  {
    id: "behaviour",
    name: "User Behaviour",
    icon: "person",
    note: "What people do differently because a system exists.",
    example: "Staff check a remote dashboard instead of driving out to read a gauge in person.",
  },
  {
    id: "complexity",
    name: "Complexity",
    icon: "layers",
    note: "How many systems, integrations and exceptions have accumulated.",
    example: "Answering one operational question now means checking four separate systems.",
  },
  {
    id: "management",
    name: "Management",
    icon: "gavel",
    note: "Whether any of the above is reviewed, owned and acted on.",
    example: "A metric has been collected for a year; no meeting has ever put it on the agenda.",
  },
];

export const areaById = (id: AreaId): Area => AREAS.find((a) => a.id === id)!;

// ---------------------------------------------------------------------------
// Tags
// ---------------------------------------------------------------------------

export type Sentiment = "positive" | "negative";
export type Effect = "direct" | "indirect";

export const SENTIMENTS: { id: Sentiment; label: string; hint: string }[] = [
  {
    id: "positive",
    label: "Positive Signal",
    hint: "Names a concrete reduction — a trip, a form, a redundant measurement, an idle resource that stopped.",
  },
  {
    id: "negative",
    label: "Negative Signal",
    hint: "Describes new capability, rising duplication, or a gap nobody reviews — nothing concrete was removed.",
  },
];

export const EFFECTS: { id: Effect; label: string; hint: string }[] = [
  {
    id: "direct",
    label: "Direct",
    hint: "Happens because the digital system itself is running — its own energy, hardware, compute, storage or network.",
  },
  {
    id: "indirect",
    label: "Indirect",
    hint: "Happens because people or processes changed around the system — behaviour, data growth, new services, faster processes.",
  },
];

export const EFFECT_FIELD = {
  label: "Direct or indirect effect?",
  instruction: "Ask whether this happens because the system itself runs, or because people or processes changed around it.",
};

export const APPROACH_FIELD = {
  label: "Improvement approach",
  instruction:
    "One sentence: the first concrete step you would take, and who owns it. If it's an efficiency claim, say what stops the saved capacity being used elsewhere.",
  placeholder: "e.g. Platform owner consolidates the five dashboard copies onto one canonical dataset within the next release cycle.",
};

export const AREA_FIELD = {
  label: "Which area does this belong to?",
  instruction: "Sort by the effect the signal actually reports, not by the department you'd expect to own the fix.",
};

// ---------------------------------------------------------------------------
// The seven signals
// ---------------------------------------------------------------------------

/**
 * A signal's text, broken into tappable spans. A plain string renders as-is;
 * `{ text, decisive }` renders as a tappable phrase — `decisive: true` is the
 * one phrase that actually proves the triage tag, the rest are texture or a
 * plausible-but-wrong anchor. The clue (Step 1) marks every decisive phrase at
 * once, never singling out which row was wrong.
 */
export type Segment = string | { text: string; decisive: boolean };

export type Signal = {
  id: string;
  n: number;
  /** Short handle used in the missing list and the report. */
  title: string;
  /** Where at ProcessNova this was observed. */
  source: string;
  /** The signal as the learner reads it, unbroken — used in the deep-dive quote. */
  text: string;
  /** The same text, broken into tappable evidence phrases for the triage step. */
  segments: Segment[];
  sentiment: Sentiment;
  area: AreaId;
  effect: Effect;

  /** Step 1 (triage) reasoning — why the sentiment tag holds. */
  triageWhy: string;
  /** Step 3 (deep dive) directional clues — never name the area or the effect. */
  areaClue: string;
  effectClue: string;
  /** Step 3 reasoning — why the area and effect hold, shown together. */
  analysisWhy: string;

  /** Demo answer for the mentor auto-fill. */
  sampleApproach: string;
  answerKey: AnswerKeyBlock;
};

export const SIGNALS: Signal[] = [
  {
    id: "s1",
    n: 1,
    title: "Courier trips eliminated by digital approval workflow",
    source: "Procurement · workflow migration log",
    text: "ProcessNova replaced its paper-based supplier approval workflow with a digital form last year. Physical courier trips between the procurement office and three regional sites have stopped entirely, and the paper archive the workflow used to require has been retired.",
    segments: [
      "ProcessNova replaced its paper-based supplier approval workflow with a digital form last year. ",
      { text: "Physical courier trips between the procurement office and three regional sites have stopped entirely", decisive: true },
      ", and ",
      { text: "the paper archive the workflow used to require has been retired", decisive: false },
      ".",
    ],
    sentiment: "positive",
    area: "process",
    effect: "indirect",
    triageWhy:
      "The signal names two removed costs — courier trips and the physical archive — which is exactly what S1 asks a Positive signal to show: a named reduction, not a vague efficiency claim.",
    areaClue: "The workflow itself did not change what it runs on — ask what it changed about how work reaches people.",
    effectClue: "Ask whether this is something the software itself consumes, or something people no longer have to do because the software exists.",
    analysisWhy:
      "Process Efficiency — the finding is about how an approval step moves through the organisation, not about a technical resource. Indirect — the courier trips and archive did not stop because the digital system itself uses less energy; they stopped because the process around it changed, which is exactly S2's test: it happens because the process changed, not because the system runs.",
    sampleApproach:
      "Procurement lead documents the eliminated courier and archive costs as a template case, then proposes the same digital-approval pattern for the two remaining paper-based workflows in Finance.",
    answerKey: {
      prompt: "Signal 1 — Courier trips eliminated by digital approval workflow",
      items: [
        {
          option: "Positive Signal (expected)",
          verdict: "pick",
          why: "Two concrete costs are named as removed — courier trips and a physical archive. That is exactly the test S1 sets for a Positive signal.",
        },
        {
          option: "Negative Signal (strongest wrong answer)",
          verdict: "avoid",
          why: "Tempting because a new digital system was introduced, and new systems can raise consumption. But this signal names two removed real-world costs, not a rising one — check what disappeared, not what appeared.",
        },
        {
          option: "Process Efficiency (expected)",
          verdict: "pick",
          why: "The finding is about how an approval step moves through the organisation, not about a technical resource or a dataset.",
        },
        {
          option: "Infrastructure (strongest wrong answer)",
          verdict: "avoid",
          why: "A digital form does run on infrastructure, but nothing in this signal reports a hardware, compute or storage finding — it reports a workflow change.",
        },
        {
          option: "Indirect (expected)",
          verdict: "pick",
          why: "The courier trips and archive stopped because the process around the system changed, not because the system itself draws less power.",
        },
      ],
      teachingNote:
        "Good first signal to anchor the rule on: a real removed cost, cleanly Positive, cleanly Indirect. Signal 7 later gives the contrasting case — a real removed cost that is Direct instead.",
    },
  },
  {
    id: "s2",
    n: 2,
    title: "Dashboards duplicating data nobody reconciles",
    source: "Data platform · storage audit",
    text: "Since the new data platform launched, five departments have each built their own dashboard, pulling and storing a full copy of the same customer dataset. Nobody owns reconciling the copies, and three of the five haven't been opened in over two months.",
    segments: [
      "Since the new data platform launched, five departments have ",
      { text: "each built their own dashboard, pulling and storing a full copy of the same customer dataset", decisive: true },
      ". Nobody owns reconciling the copies, and ",
      { text: "three of the five haven't been opened in over two months", decisive: false },
      ".",
    ],
    sentiment: "negative",
    area: "data",
    effect: "indirect",
    triageWhy:
      "Five separate full copies of the same dataset, most of them unused, is what S1's mechanisms are supposed to prevent, not produce — nothing here names a reduction, and the finding describes new capability duplicating itself without control.",
    areaClue: "Ask what artefact is proliferating, not who built it.",
    effectClue: "The platform's own storage draw is one thing; ask why five full copies exist in the first place.",
    analysisWhy:
      "Data Use — the defect is duplicated, unreconciled copies of the same dataset, which is squarely what this area covers. Indirect — per S2, data growth driven by departments' own behaviour (each building its own dashboard) is named as an indirect impact category, even though the resulting bytes sit on infrastructure someone else pays for.",
    sampleApproach:
      "Data platform owner sets one canonical customer dataset with read access for all five dashboards, and each department team wires its dashboard to the shared source within the next release cycle.",
    answerKey: {
      prompt: "Signal 2 — Dashboards duplicating data nobody reconciles",
      items: [
        {
          option: "Negative Signal (expected)",
          verdict: "pick",
          why: "Five uncoordinated full copies of one dataset is new capability duplicating without control — no reduction is named anywhere in the signal.",
        },
        {
          option: "Positive Signal (strongest wrong answer)",
          verdict: "avoid",
          why: "New dashboards can look like a transparency win (S1's mechanisms), but transparency only counts once something is actually seen and acted on — three of the five are unopened, and duplication itself is the finding, not a reduction.",
        },
        {
          option: "Data Use (expected)",
          verdict: "pick",
          why: "The defect named is duplicated, unreconciled copies of the same dataset — exactly what Data Use covers.",
        },
        {
          option: "Management (strongest wrong answer)",
          verdict: "avoid",
          why: "Close, because 'nobody owns reconciling the copies' sounds like an absence of ownership. But the primary finding is the duplication itself, which is a Data Use defect; the missing owner is a secondary detail, not the diagnostic phrase.",
        },
        {
          option: "Indirect (expected)",
          verdict: "pick",
          why: "The data growth is driven by departments' own behaviour — building separate dashboards — which S2 names explicitly as an indirect impact category.",
        },
      ],
      teachingNote:
        "If a participant argues Management because of 'nobody owns reconciling', accept the observation but redirect: S4's second reasoning rule reserves Management for findings that are entirely about an absent review or rule. Here there is a specific technical defect (duplicated data) to point at directly, which is what makes this Data Use rather than Management.",
    },
  },
  {
    id: "s3",
    n: 3,
    title: "Monitoring platform provisioned for peak, running at a fraction",
    source: "IT infrastructure · monitoring platform capacity report",
    text: "The new monitoring platform was provisioned for the busiest month of the year, so dashboards never lag during a peak. For the other eleven months, the servers run at roughly a fifth of that capacity, drawing power the whole time regardless of load.",
    segments: [
      { text: "The new monitoring platform was provisioned for the busiest month of the year", decisive: false },
      ", so dashboards never lag during a peak. For the other eleven months, the servers run at roughly a fifth of that capacity, ",
      { text: "drawing power the whole time regardless of load", decisive: true },
      ".",
    ],
    sentiment: "negative",
    area: "infrastructure",
    effect: "direct",
    triageWhy:
      "Capacity sized for a peak and left running year-round at a fraction of that draw is provisioned-but-unused resource consuming power regardless of demand — a textbook infrastructure defect, not a process or behaviour one.",
    areaClue: "Ask what physical or compute resource is sized wrong, not who decided to size it that way.",
    effectClue: "This is the server's own power draw, independent of who is using it or how — check S2's own list of what counts as direct.",
    analysisWhy:
      "Infrastructure — the finding is entirely about server capacity and power draw, sized for a peak and left running idle otherwise. Direct — energy and hardware draw are named explicitly in S2 as direct impact; this happens because the system itself runs, regardless of what any person does around it.",
    sampleApproach:
      "Infrastructure lead moves the monitoring platform onto autoscaling capacity that tracks actual load, keeping the peak-month burst as an on-demand ceiling rather than a year-round baseline.",
    answerKey: {
      prompt: "Signal 3 — Monitoring platform provisioned for peak, running at a fraction",
      items: [
        {
          option: "Negative Signal (expected)",
          verdict: "pick",
          why: "Servers drawing power year-round at a fifth of their provisioned capacity is unused resource cost — no reduction is named anywhere in the signal.",
        },
        {
          option: "Positive Signal (strongest wrong answer)",
          verdict: "avoid",
          why: "The monitoring platform itself may be a genuine improvement elsewhere, but this specific signal only reports capacity sitting idle and drawing power — nothing about it describes a removed cost.",
        },
        {
          option: "Infrastructure (expected)",
          verdict: "pick",
          why: "The finding is entirely about server capacity and power draw sized for a peak and left running the rest of the year — exactly what this area covers.",
        },
        {
          option: "Management (strongest wrong answer)",
          verdict: "avoid",
          why: "Sizing decisions do get reviewed by someone, but this signal doesn't report an absent review or rule — it reports a specific, measurable resource defect that a capacity change fixes directly.",
        },
        {
          option: "Direct (expected)",
          verdict: "pick",
          why: "Server power draw is the system's own resource use, independent of any person's behaviour — the clearest possible case of a direct effect.",
        },
      ],
      teachingNote:
        "Pairs well with Signal 7 for contrast: both are Infrastructure, one Direct-negative (this one) and one Direct-positive. Useful to show that Direct/Indirect is orthogonal to Positive/Negative — knowing one doesn't tell you the other.",
    },
  },
  {
    id: "s4",
    n: 4,
    title: "Field staff check equipment status remotely instead of driving out",
    source: "Operations · field visit log",
    text: "Field technicians used to drive to three remote facilities every morning just to check equipment status. With the new monitoring dashboard, most checks now happen from the office — but two technicians have started driving out anyway 'to be sure', on top of checking the dashboard.",
    segments: [
      "Field technicians used to drive to three remote facilities every morning just to check equipment status. With the new monitoring dashboard, ",
      { text: "most checks now happen from the office", decisive: true },
      " — but ",
      { text: "two technicians have started driving out anyway 'to be sure', on top of checking the dashboard", decisive: false },
      ".",
    ],
    sentiment: "positive",
    area: "behaviour",
    effect: "indirect",
    triageWhy:
      "'Most checks now happen from the office' names a real, concrete reduction in daily driving — exactly what S1 asks a Positive signal to show. The two technicians who still drive out are a caution worth carrying into a deep dive, not grounds to flip the tag: the reduction described is real and it is the majority case.",
    areaClue: "Ask what people are doing differently with their day, not what the dashboard itself consumes.",
    effectClue: "Nothing here is about the dashboard's own power draw — it's entirely about what technicians choose to do.",
    analysisWhy:
      "User Behaviour — the whole finding is about what technicians do differently (drive vs. check remotely), not a technical resource. Indirect — per S2, behaviour change is the first item on the indirect list; this happens because people changed their routine around the system, not because the system itself is running.",
    sampleApproach:
      "Operations lead reviews with the two technicians why the dashboard alone doesn't yet feel sufficient for those two sites, and fixes the specific trust gap — sensor lag or a missing alert type — rather than treating the workaround as a training problem.",
    answerKey: {
      prompt: "Signal 4 — Field staff check equipment status remotely instead of driving out",
      items: [
        {
          option: "Positive Signal (expected)",
          verdict: "pick",
          why: "'Most checks now happen from the office' names a real, majority-case reduction in driving — the S1 test for Positive is met even though two technicians haven't fully adopted the change.",
        },
        {
          option: "Negative Signal (strongest wrong answer)",
          verdict: "avoid",
          why: "The most common misplacement in this exercise: focusing on the two technicians who still drive out and missing that the signal explicitly says 'most' checks moved. A partial rebound risk is real and worth flagging in a deep dive — it isn't enough on its own to flip the sentiment.",
        },
        {
          option: "User Behaviour (expected)",
          verdict: "pick",
          why: "The entire finding is about what technicians choose to do with their day — drive or check remotely — not about a technical resource.",
        },
        {
          option: "Infrastructure (strongest wrong answer)",
          verdict: "avoid",
          why: "The dashboard runs on infrastructure, but this signal reports nothing about its hardware, compute or power draw — it reports a change in human routine.",
        },
        {
          option: "Indirect (expected)",
          verdict: "pick",
          why: "Behaviour change is the first item on S2's indirect list — this happens because people changed their routine around the system, not because the system itself is running.",
        },
      ],
      teachingNote:
        "The deliberately ambiguous signal in this set. The 'two technicians' detail is real and worth carrying forward — it's a rebound risk (S3) an escalated deep dive should name — but the sentiment tag itself turns on the word 'most', which the material's S1 rule resolves cleanly once applied literally.",
    },
  },
  {
    id: "s5",
    n: 5,
    title: "Four systems now needed to answer one operational question",
    source: "Engineering · integration inventory",
    text: "Answering 'is production on schedule today' now requires checking the ERP system, the new monitoring dashboard, a spreadsheet nobody has retired, and a chat channel where exceptions get flagged manually. Each was added for a good reason at the time it was introduced.",
    segments: [
      "Answering 'is production on schedule today' now ",
      { text: "requires checking the ERP system, the new monitoring dashboard, a spreadsheet nobody has retired, and a chat channel where exceptions get flagged manually", decisive: true },
      ". ",
      { text: "Each was added for a good reason at the time it was introduced", decisive: false },
      ".",
    ],
    sentiment: "negative",
    area: "complexity",
    effect: "indirect",
    triageWhy:
      "Four separate systems and channels for one operational question is accumulated complexity — the diagnostic phrase is the count and the fact each was added independently, not any single system's defect.",
    areaClue: "Count what has to be checked, not why any one piece was added.",
    effectClue: "This describes systems accumulating over time as the organisation added new services, not any one system's current power draw.",
    analysisWhy:
      "Complexity — the finding is the count of systems and manual channels required to answer one simple question, which is what this area diagnoses. Indirect — per S2, 'new services' built on top of existing ones over time is named as an indirect impact category; the accumulation is a consequence of process decisions, not any single system's direct draw.",
    sampleApproach:
      "Engineering lead runs a one-quarter consolidation: retires the spreadsheet by migrating its one still-used field into the monitoring dashboard, and turns the chat channel's manual exception flag into a dashboard alert.",
    answerKey: {
      prompt: "Signal 5 — Four systems now needed to answer one operational question",
      items: [
        {
          option: "Negative Signal (expected)",
          verdict: "pick",
          why: "Four systems and channels for one question is accumulated overhead, not a removed cost — nothing here names a reduction.",
        },
        {
          option: "Positive Signal (strongest wrong answer)",
          verdict: "avoid",
          why: "Each individual system may have been a genuine improvement when it was added — that is exactly the trap. The finding is about the accumulated total, not any one addition.",
        },
        {
          option: "Complexity (expected)",
          verdict: "pick",
          why: "The count of systems and manual channels needed to answer one question is the textbook Complexity finding from S4.",
        },
        {
          option: "Process Efficiency (strongest wrong answer)",
          verdict: "avoid",
          why: "Close, and S4's third reasoning rule addresses this pair directly: Process Efficiency is about how one workflow moves; this signal names a count of systems, which points to Complexity instead.",
        },
        {
          option: "Indirect (expected)",
          verdict: "pick",
          why: "The accumulation happened as new services were added over time — a process consequence, not any single system's own resource draw.",
        },
      ],
      teachingNote:
        "The multiplier signal in this set — it explains why fixing any one system (Signal 3's capacity, Signal 2's duplication) doesn't make the organisation feel simpler, because the count of things to check never drops. A strong escalation candidate for that reason.",
    },
  },
  {
    id: "s6",
    n: 6,
    title: "Sustainability metrics collected, never reviewed",
    source: "IT & Sustainability liaison · quarterly notes",
    text: "The monitoring platform has tracked estimated energy use per system since launch. The figures sit in an export nobody has opened since the platform went live, and no meeting has ever had them on the agenda.",
    segments: [
      "The monitoring platform has tracked estimated energy use per system since launch. ",
      { text: "The figures sit in an export nobody has opened since the platform went live", decisive: false },
      ", and ",
      { text: "no meeting has ever had them on the agenda", decisive: true },
      ".",
    ],
    sentiment: "negative",
    area: "management",
    effect: "indirect",
    triageWhy:
      "Tracking a metric is transparency capability, but nothing here shows it doing any work — no review, no agenda item, no decision traced back to it. S1's rule is explicit: capability that never gets used is a different claim from a realised reduction, and nothing here claims a reduction.",
    areaClue: "The data collection itself works fine — ask who looks at it, when, and to decide what.",
    effectClue: "This is about whether anyone reviews the figures, not about the platform's own power draw while collecting them.",
    analysisWhy:
      "Management — per S4's second reasoning rule, an absence of review, ownership or a rule belongs in Management even when it appears next to a data-looking symptom (an unopened export). Indirect — the missing review loop is a process gap, not the system's own resource draw.",
    sampleApproach:
      "Sustainability liaison adds the energy-use export as a standing agenda item on the monthly IT review, with one named owner who brings one action proposal each time.",
    answerKey: {
      prompt: "Signal 6 — Sustainability metrics collected, never reviewed",
      items: [
        {
          option: "Negative Signal (expected)",
          verdict: "pick",
          why: "Transparency capability exists (S1's mechanism) but is never used — no review, no agenda, no decision. Nothing here claims a realised reduction.",
        },
        {
          option: "Positive Signal (strongest wrong answer)",
          verdict: "avoid",
          why: "Tracking the metric sounds like the transparency mechanism from S1 working — but S1 is explicit that capability which never gets used is a different claim from a realised benefit.",
        },
        {
          option: "Management (expected)",
          verdict: "pick",
          why: "What's missing is a review cadence, an owner and an agenda item — exactly the absence S4's second reasoning rule reserves for Management, even though the surface detail (an unopened export) looks data-related.",
        },
        {
          option: "Data Use (strongest wrong answer)",
          verdict: "avoid",
          why: "The most common misplacement in this exercise: 'an unopened export' reads like a data problem. But the data itself is not duplicated, wrong or excessive — the defect is entirely that nobody reviews it, which is a Management finding.",
        },
        {
          option: "Indirect (expected)",
          verdict: "pick",
          why: "The missing review loop is a process gap around the system, not the platform's own resource draw while it collects the figures.",
        },
      ],
      teachingNote:
        "Deliberately parallel to Signal 2, where the surface detail is also 'unopened' — here the fix is a review loop, not a data-ownership fix, because the underlying defect this time is genuinely an absent process rather than uncontrolled duplication. Good pair to contrast during the deep dive if both get escalated.",
    },
  },
  {
    id: "s7",
    n: 7,
    title: "Batch reporting replaces always-on polling",
    source: "IT infrastructure · database load report",
    text: "The customer analytics service used to poll the production database every thirty seconds around the clock. It was rebuilt this quarter to pull data once, in a single nightly batch — database load from this service has dropped by roughly the same margin, measured directly on the database's own request logs.",
    segments: [
      "The customer analytics service used to poll the production database every thirty seconds around the clock. It was ",
      { text: "rebuilt this quarter to pull data once, in a single nightly batch", decisive: false },
      " — ",
      { text: "database load from this service has dropped by roughly the same margin, measured directly on the database's own request logs", decisive: true },
      ".",
    ],
    sentiment: "positive",
    area: "infrastructure",
    effect: "direct",
    triageWhy:
      "The load reduction is measured directly on the database's own request logs, not inferred from a downstream behaviour change — a genuine drop in what the system itself does, which is exactly the kind of concrete reduction S1 asks a Positive signal to name.",
    areaClue: "This is about a technical resource pattern — how often a service queries the database — not about how a person's workflow changed.",
    effectClue: "The reduction is measured on the database's own request logs — ask whether that's the system running, or a person's behaviour changing.",
    analysisWhy:
      "Infrastructure — the finding is a technical resource pattern (query frequency against a database), which is what this area covers regardless of which application-layer service triggered it. Direct — the reduction is measured on the database's own request logs, which per S2 is exactly a direct-impact measurement: it happens because the system itself runs less often, independent of any person's behaviour.",
    sampleApproach:
      "Platform team documents the polling-to-batch pattern as a reusable template and audits the two remaining services still polling the same database on a short interval.",
    answerKey: {
      prompt: "Signal 7 — Batch reporting replaces always-on polling",
      items: [
        {
          option: "Positive Signal (expected)",
          verdict: "pick",
          why: "The load drop is measured directly on the database's own request logs — a concrete, verified reduction, exactly the S1 test for Positive.",
        },
        {
          option: "Negative Signal (strongest wrong answer)",
          verdict: "avoid",
          why: "Rebuilding a service can sound like added complexity or cost, but the signal reports a measured drop in database load as the outcome — the rebuild is the method, not the finding.",
        },
        {
          option: "Infrastructure (expected)",
          verdict: "pick",
          why: "Query frequency against a database is a technical resource pattern, which is what Infrastructure covers, regardless of which application triggered the change.",
        },
        {
          option: "Process Efficiency (strongest wrong answer)",
          verdict: "avoid",
          why: "Tempting because 'a service was rebuilt' sounds like a process change. But the actual finding — reduced database load, measured on the database's own logs — is a technical resource outcome, not a workflow one.",
        },
        {
          option: "Direct (expected)",
          verdict: "pick",
          why: "Measured directly on the database's own request logs — the system running less often, independent of any person's behaviour. The clearest Direct-positive case in this set.",
        },
      ],
      teachingNote:
        "The clean contrast to Signal 1: both Positive, but Signal 1 is Indirect (a process changed around a system) and this one is Direct (the system itself does measurably less). Useful for showing the two axes — sentiment and effect — are independent of each other.",
    },
  },
];

export const signalById = (id: string): Signal => SIGNALS.find((s) => s.id === id)!;

// ---------------------------------------------------------------------------
// Framing — three steps
// ---------------------------------------------------------------------------

export const TASK_INTRO = {
  id: "task",
  tag: "THE TASK",
  title: "Seven signals from ProcessNova's digitalisation programme",
  minutes: 20,
  framing:
    "These seven signals were collected during a review of ProcessNova's digitalisation programme — from workflow logs, platform capacity reports and conversations with field and engineering teams. You will not have time to give all seven a full workup, and that is deliberate: triage all seven shallowly, escalate the two that most deserve a closer look, then go deep on those two alone.",
} as const;

export const TRIAGE = {
  step: "Step 1",
  title: "Triage all seven signals",
  minutes: 8,
  intro:
    "For each signal, tag it Positive or Negative and tap the phrase in the signal itself that proves your tag. Check the set when you're done — the check reports how many rows hold, never which ones, since the tag is a two-way choice.",
  material: ["lever", "impact"] as MaterialSectionId[],
  rule: {
    label: "Rule from the material — your anchor",
    text: "Does the signal name a concrete reduction — a trip, a form, a redundant measurement, an idle resource that stopped? If yes, it's Positive. If it only describes new capability, rising duplication, or a gap nobody reviews: Negative.",
  },
  becauseLabel: "Because",
  evidencePrompt: "Tap the phrase in the signal that proves your tag.",
  checkLabel: "Check my triage",
  recheckLabel: "Check again",
  clueLabel: "Need a clue?",
  clueText: "The decisive phrase in every signal is now marked. Read it again against the rule above, then retag the ones that don't fit yet.",
  revealAfter: 2,
  revealLabel: "Show the reasoning",
  whyHolds: "Why this holds",
  whyNot: "Why this doesn't hold yet",
  result: (ok: number, total: number) =>
    ok === total
      ? `All ${total} hold up — tag and evidence.`
      : `${ok} of ${total} hold up. A row holds when the tag is right and the phrase you tapped is the one that decides it.`,
  incomplete: (items: string[]) => `Before checking: ${items.join("; ")}.`,
  stale: "You've changed an answer since the last check — check again to see where you stand now.",
  revealNote: (at: number) => `Reasoning shown after ${at} check${at === 1 ? "" : "s"} — recorded in the export.`,
} as const;

export const ESCALATE = {
  step: "Step 2",
  title: "Escalate two for a deeper look",
  minutes: 3,
  limit: 2,
  intro:
    "You will not analyse all seven in depth — pick the two signals that most deserve it, and say why. This is the actual skill: judging where attention pays off, not processing everything to the same depth.",
  material: ["rebound"] as MaterialSectionId[],
  fullNote: "Two are already selected. Remove one first, then choose a different signal.",
  whyField: {
    label: "Why these two?",
    instruction: "One or two sentences. Argue from leverage — what's expensive or structural — not from what's easiest to write about.",
    placeholder: "e.g. These two point at accumulated, system-level effects rather than one-off behaviour, and each explains findings the other five don't…",
  },
} as const;

export const ANALYSIS = {
  kicker: "Deep dive",
  step: "Step 3",
  title: "Analyse your two",
  minutes: 9,
  intro: "Full workup: which area it belongs to, whether the effect is direct or indirect, and the first concrete improvement you'd make.",
  triageReminder: "Your triage",
  notTriaged: "You have not tagged this signal yet — do that in Step 1 first.",
  checkLabel: "Check area & effect",
  recheckLabel: "Check again",
  checkScope: "Checks the area and the effect together — never your wording.",
  clueLabel: "Need a clue?",
  revealAfter: 2,
  revealLabel: "Show the reasoning",
  incomplete: "Pick an area and an effect before checking.",
  holds: "That holds up — area and effect both fit. Carry on with the improvement approach.",
  wrong: "That doesn't hold up yet. Look again, or ask for a clue.",
  stale: "You've changed an answer since the last check — check again to see where you stand now.",
  whyLabel: "Why",
  revealNote: "Reasoning shown after two checks — recorded in the export.",
} as const;

// ---------------------------------------------------------------------------
// Mentor-only answer keys for the two set-level checks
// ---------------------------------------------------------------------------

export const TRIAGE_ANSWER_KEY: AnswerKeyBlock = {
  prompt: "Triage — expected tag and decisive phrase per signal",
  items: SIGNALS.map((s) => {
    const decisive = s.segments.find((seg): seg is { text: string; decisive: boolean } =>
      typeof seg !== "string" && seg.decisive,
    );
    const label = SENTIMENTS.find((r) => r.id === s.sentiment)!.label;
    return {
      option: `Signal ${s.n} — ${s.title}`,
      verdict: "pick" as const,
      why: `${label}, because "${decisive?.text}". ${s.triageWhy}`,
    };
  }),
  teachingNote:
    "Every row's non-decisive phrase is a plausible wrong anchor, not a distractor for its own sake — Signal 3's 'provisioned for the busiest month' reads like a Management sizing decision, Signal 6's 'unopened export' reads like a Data Use problem. A learner who ends up on the wrong tag or area has usually anchored on that phrase.",
};

export const ESCALATION_ANSWER_KEY: AnswerKeyBlock = {
  prompt: "Which two signals are worth escalating",
  items: [
    {
      option: "Signal 5 — Four systems now needed to answer one operational question",
      verdict: "pick",
      why: "The multiplier signal — it explains why fixing any single system elsewhere doesn't make the organisation feel simpler. A strong pick if the rationale is 'fix the cause of the causes'.",
    },
    {
      option: "Signal 6 — Sustainability metrics collected, never reviewed",
      verdict: "pick",
      why: "The structural governance gap: capability exists but nothing acts on it. A strong pick if the rationale is 'without a review loop, every other fix here eventually drifts back'.",
    },
    {
      option: "Signal 2 — Dashboards duplicating data nobody reconciles",
      verdict: "pick",
      why: "A clear, concrete Data Use defect with a traceable fix. A strong pick if the rationale is 'this is the most wasteful single finding in the set'.",
    },
    {
      option: "Signal 3 — Monitoring platform provisioned for peak, running at a fraction",
      verdict: "pick",
      why: "The clearest Direct-effect finding, measurable and fixable with a capacity change. A strong pick if the rationale is 'this is the most measurable single waste in the set'.",
    },
    {
      option: "Signal 1 — Courier trips eliminated by digital approval workflow",
      verdict: "avoid",
      why: "Real, and worth celebrating, but it's already a completed win with nothing further to diagnose — escalating it spends a slot confirming success rather than finding leverage.",
    },
    {
      option: "Signal 4 — Field staff check equipment status remotely instead of driving out",
      verdict: "avoid",
      why: "A good signal to have triaged carefully, but its deep dive is thin: the area and effect are clear once the ambiguity is resolved, and the improvement (address two technicians' trust gap) is narrow compared to the structural signals.",
    },
    {
      option: "Signal 7 — Batch reporting replaces always-on polling",
      verdict: "avoid",
      why: "Like Signal 1, a genuine and already-realised win. Strong as a triage example of a Direct-positive effect; thin as a deep-dive target since the fix (audit remaining pollers) is a small, bounded follow-up rather than a structural question.",
    },
  ],
  teachingNote:
    "There is no single correct pair. The assessment criterion is whether the written justification argues from leverage — structural, explains other findings, or genuinely costly — rather than from what happens to be quickest to write up. A pair of 1 and 7 (both already-solved wins) with a leverage-based justification is a worse answer than a pair of 5 and 6 with none.",
};
