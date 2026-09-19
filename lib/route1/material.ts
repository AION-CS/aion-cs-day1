/**
 * Route 1's material, split into the two blocks the build brief asks for:
 * M1–M4 teach only what Task 1's diagnosis needs, M5–M7 teach only what
 * Task 2's prioritisation needs (coverage rule, CLAUDE.md §11a — every term
 * either task uses is defined here first: the three links, metric layers, the
 * six areas and the six gates, PDCA, the three pulls, the three lines and the
 * conditions Task 2 names).
 *
 * What stays on screen per card: a one-line standfirst, the live diagram and a
 * short `definition`. The decision rules, depth and sources sit behind Read
 * more (DEPTH-UPGRADE-PROMPT §2.1). Practice cases inside the diagrams are
 * deliberately *not* the task's cases, so nothing here hands over a task answer.
 *
 * `n` is the card's position within its own block (1–4, then 1–3 again), not
 * a running count across both — each block renders its own "Card n of N".
 */

import type { MicroCard } from "@/lib/materialSection";
import type { MaterialSectionId } from "./sections";

export const MATERIAL1: MicroCard<MaterialSectionId>[] = [
  {
    id: "dataVsManagement",
    code: "M1",
    n: 1,
    icon: "gauge",
    title: "Data collected is not the same as data managed",
    standfirst: "A figure steers only when it is wired to a target, an owner and a decision.",
    definition: [
      "Collected data is a number somebody records. Managed data is a number a named person answers for, measured against a target, that changes a decision when it moves.",
      "Three links wire a figure to management: a target to compare with, an owner who answers for it, and a decision that changes when it moves.",
      "With fewer than three links the number can be perfectly true and still steer nothing — it is an entry on a dashboard, not an instrument.",
    ],
    reasoning: [
      "Before calling something “managed”, ask whether a decision actually changes when the number changes. If nothing downstream would move, it is being collected, not managed.",
      "Count the links, then name the missing one. “No target”, “no owner” and “no decision” are three different gaps, and they lead to three different first fixes.",
      "A number with no named owner and no named target is activity data by definition — that gap is what Task 1's Management Relevance area tests for.",
    ],
    readMoreHint: "decision rules, why activity counts mislead, sources",
    more: [
      {
        heading: "Activity is not outcome",
        paragraphs: [
          "Measuring an activity — “we replaced 200 laptops” — tells you an activity happened. It does not tell you whether the outcome improved, or whether replacing laptops was the right thing to prioritise. A manager steers by the outcome, so the question to ask of any figure is what it would change.",
        ],
      },
      {
        heading: "Why organisations stop at collecting",
        paragraphs: [
          "Collecting is cheap and visible: a meter reading, an invoice, a ticket count. Wiring is a management act — somebody has to agree a target, accept accountability and decide what would change. That is why the first jump in maturity is rarely “more data”; it is closing one missing link on a number that already exists.",
        ],
      },
    ],
    sources: [
      { label: "GHG Protocol — Corporate Standard", detail: "the accounting rules behind a decision-usable emissions figure", url: "https://ghgprotocol.org/corporate-standard" },
      { label: "ISO 14064 — overview", detail: "quantification and reporting of greenhouse gases; iso.org not link-checked", url: "https://en.wikipedia.org/wiki/ISO_14064" },
    ],
    minutes: 2,
  },
  {
    id: "metricLayers",
    code: "M2",
    n: 2,
    icon: "layers",
    title: "Three layers: activity, outcome, management",
    standfirst: "The few numbers a leader steers by sit at the top of a much bigger base.",
    definition: [
      "Activity metrics record what was done or used — kWh drawn, devices bought, tickets closed. Outcome metrics record the effect achieved — emissions avoided, service life extended.",
      "Management metrics are the few numbers at the top that a leader steers by, each linked to a target, an owner and a review.",
      "Most organisations have a wide base of activity metrics and almost nothing at the top. The same underlying fact can appear in all three layers, worded differently.",
    ],
    reasoning: [
      "When you meet a number, place it in one of the three layers before judging it. A number is only “management-effective” (M4) once it has reached the top layer — being an accurate activity count is not enough on its own.",
      "kWh drawn is activity. Emissions avoided is outcome. CO₂e per service versus a stated target, owned and reviewed, is management. Ask which question the number answers: “what did we do?”, “did it work?” or “are we on track, and who acts?”",
    ],
    readMoreHint: "decision rules, why the base is wide, what climbing a layer needs",
    more: [
      {
        heading: "Why the base is wide and the top is thin",
        paragraphs: [
          "Activity data falls out of normal operations, so it accumulates on its own. Outcome data needs a baseline to compare with. A management metric needs a target, an owner and a review cadence on top of that — so each layer up costs more governance, and each layer up serves fewer, more senior decisions.",
        ],
      },
      {
        heading: "Climbing a layer",
        paragraphs: [
          "To turn an activity metric into an outcome metric, add a baseline (before/after). To turn an outcome metric into a management metric, add a target, a named owner and a fixed review. The measurement itself often stays the same — what changes is what surrounds it.",
        ],
      },
    ],
    sources: [],
    minutes: 2,
  },
  {
    id: "sixAreas",
    code: "M3",
    n: 3,
    icon: "network",
    title: "The six areas Task 1 diagnoses",
    standfirst: "Six ways a metric system fails — each has a tell-tale question.",
    definition: [
      "Task 1 sorts evidence from Clarity Digital Services into six areas. Each area names one thing that can be missing: comparable numbers (Metric Quality), captured data (Data Availability), output that supports a decision (Reporting), a link to a target and decision (Management Relevance), emissions captured and allocated (Carbon Monitoring), or a named owner (Responsibilities).",
      "Judge what a sentence is evidence of, not what topic it mentions: two sentences can both be about carbon and belong to different areas.",
    ],
    reasoning: [
      "Match a piece of evidence to the area it most directly demonstrates. Ask what the sentence says is missing — that is the area; anything else it also touches is an optional second tag.",
      "“Nobody owns X” is Responsibilities. “X isn't captured” is Data Availability. “X exists but isn't comparable” is Metric Quality. “X exists and is comparable but nobody uses it to decide anything” is Management Relevance. Keep those four apart.",
      "If a figure is visible but “not linked to goals”, the gap is the link — Management Relevance — even when it is only partly visible; the availability gap is then the second tag.",
      "Reporting is about the form of the output (totals with no target-versus-actual, requests with no shared system). Carbon Monitoring is specifically about IT emissions being captured and allocated across Scope 1/2/3.",
    ],
    readMoreHint: "decision rules, tell-tale phrases, how the areas differ, sources",
    more: [
      {
        heading: "Scope 1/2/3 in one line",
        paragraphs: [
          "Carbon Monitoring asks whether Scope 1 (direct emissions), Scope 2 (purchased electricity) and Scope 3 (everything upstream and downstream, including devices and cloud) are on anyone's radar at all — not whether the numbers are already good.",
        ],
      },
      {
        heading: "Why boundaries matter for Metric Quality",
        paragraphs: [
          "A boundary says what is inside a figure: which sites, which systems, which period. Two PUE values measured on different boundaries are two different quantities with the same name — that is why comparable, robust figures are the test in Metric Quality.",
        ],
      },
    ],
    sources: [
      { label: "GHG Protocol — Corporate Standard", detail: "defines the scopes and the organisational boundary", url: "https://ghgprotocol.org/corporate-standard" },
      { label: "GHG Protocol — Scope 3 Standard", detail: "why devices and cloud sit in Scope 3", url: "https://ghgprotocol.org/corporate-value-chain-scope-3-standard" },
      { label: "ISO/IEC 30134 series (PUE, CUE, WUE, REF)", detail: "boundary-dependent data-centre figures; iso.org not link-checked" },
    ],
    minutes: 3,
  },
  {
    id: "effectiveVsStructural",
    code: "M4",
    n: 4,
    icon: "funnel",
    title: "Management-effective vs merely informative",
    standfirst: "Six gates a metric has to clear — and what you can fix now versus what has to be governed.",
    definition: [
      "A metric is management-effective only if it clears six gates. Four make it a sound number — relevant, understandable, comparable, robust. Two wire it to management — actionable (a target and a decision that changes when it moves) and owned (one named person answers for it).",
      "Miss even one gate and it is merely informative: true, maybe impressive, but a vanity number that changes nothing.",
      "Fixes come in two kinds. Short-term fixes change how a number is captured or written down. Structural fixes create accountability — a target, an owner, a review cadence.",
    ],
    reasoning: [
      "When Task 1 asks whether a metric is management-effective, check both halves: is the number sound (relevant, understandable, comparable, robust) AND is it wired (target, decision, owner)? One failed gate is enough for “no”.",
      "A well-known standard does not make a number sound: a PUE reported on different boundaries fails “comparable” however good the standard is.",
      "“We could start capturing this next week” is short-term. “This needs a named owner, a target and a quarterly review before it counts” is structural. The difference is governance, not difficulty.",
    ],
    readMoreHint: "decision rules, the six gates defined, short-term vs structural, sources",
    more: [
      {
        heading: "The six gates, one question each",
        paragraphs: [
          "Relevant — does it describe something the organisation's goals depend on, rather than a by-product of producing reports? Understandable — can its users say in one sentence what it counts and in which unit? Comparable — is it measured on the same definition, boundary and period everywhere? Robust — is the data behind it complete and reliable enough that the message does not flip on a small change? Actionable — is there a target to compare with and a decision that changes when it moves? Owned — does one named person answer for it end to end?",
        ],
      },
      {
        heading: "The classic case",
        paragraphs: [
          "A beautifully falling PUE in a data centre nobody is really using is accurate and even comparable — and still steers nothing, because no decision is wired to it. Accuracy is necessary; it is not sufficient.",
        ],
      },
    ],
    sources: [
      { label: "ISO/IEC 30134 series", detail: "why the standard's boundaries must be applied the same way at every site; iso.org not link-checked" },
      { label: "PUE — overview", detail: "what the figure is and how it is misused", url: "https://en.wikipedia.org/wiki/Power_usage_effectiveness" },
    ],
    minutes: 3,
  },
];

export const MATERIAL2: MicroCard<MaterialSectionId>[] = [
  {
    id: "pdcaLoop",
    code: "M5",
    n: 1,
    icon: "cycle",
    title: "Continuous optimisation is a routine, not a project",
    standfirst: "measure → evaluate → prioritise → adjust → review — and then it repeats.",
    definition: [
      "Continuous optimisation means running the metric system as a routine: measure, evaluate, prioritise, adjust, review — then repeat. It is the Plan–Do–Check–Act (PDCA) cycle, the same logic ISO 50001 uses for energy management.",
      "Each turn needs a named owner and a fixed review cadence. Without both, the numbers keep arriving but nothing about them is ever decided.",
      "A one-off assessment (“we checked once”) is not continuous optimisation (“we check on a fixed cycle and act on what we find”).",
    ],
    reasoning: [
      "When a task asks what would make a metric system actually work, “add a review cycle with a named owner” is very often the highest-leverage single move — check it before reaching for a bigger data project.",
      "A review process makes existing data start steering, often before a single new metric is added. That is what Task 2's Line C is testing.",
    ],
    readMoreHint: "decision rules, why cadence matters, what each step needs, sources",
    more: [
      {
        heading: "Why the cadence is the point",
        paragraphs: [
          "A problem that starts today is only noticed at the next review. On average that is half a review interval away, so a quarterly loop notices in about six weeks, and a yearly loop in about six months. The cadence sets how fast the organisation can change its mind.",
        ],
      },
      {
        heading: "What each step needs",
        paragraphs: [
          "Measure needs a consistent boundary. Evaluate needs a target. Prioritise needs someone with the authority to say “this, not that”. Adjust needs a delivery owner. Review needs a fixed date and management attention. Skip any one and the loop stops turning, however good the others are.",
        ],
      },
    ],
    sources: [
      { label: "Directive (EU) 2023/1791, Art. 11 — energy management systems", detail: "where EU law points to ISO 50001-style management", url: "https://eur-lex.europa.eu/eli/dir/2023/1791/oj" },
      { label: "PDCA — overview", url: "https://en.wikipedia.org/wiki/PDCA" },
      { label: "ISO 50001 — overview", detail: "iso.org not link-checked", url: "https://en.wikipedia.org/wiki/ISO_50001" },
    ],
    minutes: 3,
  },
  {
    id: "tradeoffTriangle",
    code: "M6",
    n: 2,
    icon: "compass",
    title: "Measurability, informative value, controllability",
    standfirst: "Easy to measure is not the same as useful. Useful is not the same as yours to steer.",
    definition: [
      "Three pulls decide what belongs in a lean metric set. Measurability: how easily and reliably can it be captured? Informative value: does it tell you something that changes a decision? Controllability: can the organisation steer what the number describes, or only watch it?",
      "The rule: steer what you own, monitor the rest. A lean, defensible set is built from the first kind and openly labels the second.",
    ],
    reasoning: [
      "When comparing candidate metrics or lines of measures, ask which of the three pulls is actually weak — not just whether the metric “seems useful”.",
      "A metric that is easy and informative but uncontrollable still belongs on a monitoring dashboard, just not in a KPI someone is held accountable for.",
      "In Task 2, weigh each candidate line against all the pulls together. A line that wins big on one and loses on the others is not automatically the strongest choice.",
    ],
    readMoreHint: "decision rules, the three labels a metric can get, sources",
    more: [
      {
        heading: "Three outcomes for a candidate metric",
        paragraphs: [
          "Steer it (KPI candidate): informative and within the organisation's control. Monitor it: informative but outside its control, so it is shown and labelled, not held against anyone. Park it: convenient to measure but thin — it barely changes a decision, however easy it is to collect.",
        ],
      },
      {
        heading: "Why controllability matters",
        paragraphs: [
          "Holding a person to a number they cannot influence is unfair and produces gaming. Grid carbon intensity is a good example: it is important context for IT's Scope 2 figure, but IT cannot change it — so it is monitored, while what IT can steer (the load, the location, the time of use) becomes the KPI.",
        ],
      },
    ],
    sources: [{ label: "GHG Protocol — Scope 2 Guidance", detail: "how grid intensity enters purchased-electricity emissions", url: "https://ghgprotocol.org/scope-2-guidance" }],
    minutes: 3,
  },
  {
    id: "threeLines",
    code: "M7",
    n: 3,
    icon: "trophy",
    title: "Three candidate lines — and the attractive-but-weak trap",
    standfirst: "Judge a line by what it depends on, not by what it displays.",
    definition: [
      "Task 2 asks which of three lines of measures to fund first. Line A is a Green IT KPI and dashboard system. Line B is IT-specific carbon monitoring: a baseline, an emissions logic and allocation of the relevant sources. Line C is a review and improvement process that uses existing data systematically.",
      "Task 2 rates each line on seven criteria — leverage, steering effect, feasibility, informative value, long-term effect, risk and connectability — each defined in this card's Read more.",
      "The trap: a line can look excellent and still be structurally weak underneath — a shiny dashboard with no review logic behind it is transparency theatre, not steering. Naming that risk in advance is part of a defensible choice.",
    ],
    reasoning: [
      "Before picking a priority line, state what specifically breaks if you are wrong — not just “it might not work”. That specific failure mode is what Task 2's justification is checked against.",
      "A dashboard (Line A) is only as strong as the review process behind it (M5). Carbon monitoring (Line B) is only as strong as the boundary and allocation choices behind it. Judge each line by what it depends on, not by what it displays.",
      "Use the five conditions above the way Task 2 does: for each line, ask what it needs from budget, visibility, data, simplicity and IT's usability.",
      "Rate a criterion from the line's own facts, not from how it looks. Risk is the one criterion that reads in reverse: High risk is a caution sign, not a strength.",
    ],
    readMoreHint: "decision rules, the seven criteria defined, the attractive-but-weak trap",
    more: [
      {
        heading: "What each line involves",
        paragraphs: [
          "Line A: choose a small KPI set and define each KPI; build dashboard views for management and departments; connect the data feeds. Line B: set a pragmatic baseline; define which sources count and how each is converted; allocate Scope 1/2/3 sources. Line C: fix a review cycle with a named owner and chair; compare existing figures with targets each cycle; record what is adjusted and check it next time.",
        ],
      },
      {
        heading: "Attractive but weak",
        paragraphs: [
          "An option is attractive-but-weak when its visible surface is strong and the structure that would make it work is missing. The three usual failures are symbolic politics (it exists to show something), misinvestment (money spent where it changes little) and the rebound: a good number that nobody was asked to act on.",
        ],
      },
    ],
    sources: [],
    minutes: 2,
  },
];

export const MATERIAL1_INTRO = {
  kicker: "Material 1 · four cards · about 10 minutes",
  title: "What Task 1 needs, and nothing else",
  intro: "Four short cards: the definition and a live diagram are always on screen; the decision rules are one tap away.",
} as const;

export const MATERIAL2_INTRO = {
  kicker: "Material 2 · three cards · about 8 minutes",
  title: "What Task 2 needs, and nothing else",
  intro: "Three short cards step the question up from “is this metric any good?” to “which whole line of measures do we fund first?”.",
} as const;
