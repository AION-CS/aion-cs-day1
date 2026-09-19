/**
 * Route 1's material, split into the two blocks the build brief asks for:
 * M1–M4 teach only what Task 1's diagnosis needs, M5–M7 teach only what
 * Task 2's prioritisation needs (coverage rule, CLAUDE.md §11a — every term
 * either task uses is introduced here first: management vs activity metric,
 * vanity metric, controllability, PDCA/continuous optimisation, target-vs-
 * actual, Scope 1/2/3, short-term vs structural).
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
    standfirst: "A metric only steers when it links to a target, an owner, and a decision.",
    sentences: [
      "Clarity Digital Services already collects plenty of numbers — but collecting a number and managing with it are two different things.",
      "A metric only steers something the moment it is wired to a target, an owner, and a decision. Without that link, it is just an entry on a dashboard.",
      "Measuring an activity — \"we replaced 200 laptops\" — tells you an activity happened. It does not tell you whether the outcome improved, or whether it was even the right thing to prioritise.",
      "Below, each gauge stands for one of Clarity's real figures. Click one to see whether it is wired to a decision, or just being collected.",
    ],
    reasoning: [
      "Before calling something \"managed\", ask whether a decision actually changes when the number changes. If nothing downstream would move, it is being collected, not managed.",
      "A number with no named owner and no named target is activity data by definition — that gap is what Task 1's Management Relevance area is testing for.",
    ],
    sources: [
      { label: "GHG Protocol / ISO 14064", detail: "Standard vocabulary for what counts as a measured, decision-usable figure versus a raw activity count." },
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
    sentences: [
      "Every metric system has three layers. Activity / input metrics record what was done or consumed — kWh drawn, devices bought, tickets closed.",
      "Outcome metrics record the effect achieved — emissions avoided, utilisation improved, service life extended.",
      "Management metrics are the few numbers, at the very top, that a leader actually steers by — each one linked to a target, an owner, and a review.",
      "Most organisations, Clarity included, have a wide base of activity metrics and almost nothing at the apex — exactly the gap Task 1 asks you to diagnose.",
    ],
    reasoning: [
      "When you meet a number, place it in one of the three layers before judging it. A number is only \"management-effective\" (M4) once it has actually reached the top layer — being an accurate activity count is not enough on its own.",
      "kWh drawn is activity. Emissions avoided is outcome. CO₂e-per-service versus a stated target, owned and reviewed, is management. The same underlying consumption can appear in all three, worded differently.",
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
    standfirst: "Six lenses on the same underlying problem — open each once before you start.",
    sentences: [
      "Task 1 sorts evidence from Clarity Digital Services into six areas. Metric Quality asks whether numbers are comparable, robust and built on consistent boundaries — can two teams' figures actually sit side by side?",
      "Data Availability asks whether something is captured at all, and completely. Reporting asks whether output only informs, or actually supports a decision.",
      "Management Relevance asks whether a number is tied to a target, an owner and a decision — M1's test, applied. Carbon Monitoring asks whether IT's emissions are captured and allocated at all: in one line, whether Scope 1 (direct), Scope 2 (purchased electricity) and Scope 3 (everything upstream and downstream, including devices and cloud) are even on anyone's radar.",
      "Responsibilities asks the simplest and most decisive question of all: is there a named owner?",
    ],
    reasoning: [
      "Match a piece of evidence to the area it most directly demonstrates. Two pieces of evidence can share a topic — both about carbon, say — and still belong in different areas: judge what the sentence is evidence of, not its subject.",
      "\"Nobody owns X\" is Responsibilities. \"X isn't captured\" is Data Availability. \"X exists but isn't comparable\" is Metric Quality. \"X exists and is comparable but nobody uses it to decide anything\" is Management Relevance. Keep those four apart.",
    ],
    sources: [
      { label: "ISO/IEC 30134 series (PUE, CUE, WUE, REF)", detail: "The kind of boundary-dependent figures that make Metric Quality a real, recurring problem in data-centre reporting." },
      { label: "GHG Protocol Scope 1/2/3", detail: "The allocation structure Carbon Monitoring is asking whether anyone has applied." },
    ],
    minutes: 3,
  },
  {
    id: "effectiveVsStructural",
    code: "M4",
    n: 4,
    icon: "funnel",
    title: "Management-effective vs merely informative",
    standfirst: "Six gates a metric has to clear — and what you can build now versus what has to be governed.",
    sentences: [
      "A metric earns the label \"management-effective\" only if it clears six gates: relevant, understandable, comparable, robust, actionable (decision-linked) and owned. Miss even one and it is merely informative — a vanity number that looks good on a dashboard but changes nothing.",
      "A beautifully falling PUE in a data centre nobody is really using is the classic case: accurate, even comparable — and still not steering anything, because there is no decision it is wired to.",
      "Not every fix needs the same effort. Some things you can build short-term: capture a number consistently, write down its definition and boundary. A real management metric has to be built structurally — governed, with a target, an owner and a review cadence.",
      "Try the filter below: drop a sample metric in and watch which gates it clears.",
    ],
    reasoning: [
      "When Task 1 asks you to classify a candidate metric, check target + owner + decision together, not separately. All three missing — or even just one — is enough to make it merely informative.",
      "\"We could start capturing this next week\" is short-term. \"This needs a named owner, a target and a quarterly review before it counts\" is structural. The difference is governance, not difficulty.",
    ],
    sources: [],
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
    sentences: [
      "A metric system only keeps steering if it is run as a routine: measure, evaluate, prioritise, adjust, review — then repeat. This is the Plan–Do–Check–Act (PDCA) cycle, the same logic ISO 50001 uses for energy management.",
      "Each turn of the loop needs a named owner and a fixed review cycle. Without both, KPIs stall — the numbers keep arriving, but nothing about them ever gets decided.",
      "A review process is what actually makes existing data start steering, often before a single new metric is added.",
    ],
    reasoning: [
      "When a task asks what would make a metric system actually work, \"add a review cycle with a named owner\" is very often the highest-leverage single move — check it before reaching for a bigger data project.",
      "Distinguish a one-off assessment (\"we checked once\") from continuous optimisation (\"we check on a fixed cycle, and act on what we find\") — Task 2's Option C is testing exactly this distinction.",
    ],
    sources: [{ label: "ISO 50001 — Energy Management Systems", detail: "The standard's Plan-Do-Check-Act structure, applied here to Green IT metrics rather than energy alone." }],
    minutes: 3,
  },
  {
    id: "tradeoffTriangle",
    code: "M6",
    n: 2,
    icon: "compass",
    title: "Measurability, informative value, controllability",
    standfirst: "Easy to measure is not the same as useful. Useful is not the same as yours to steer.",
    sentences: [
      "Three pulls decide what belongs in a lean metric set. Measurability: how easy is this to capture reliably? Informative value: does it actually tell you something that changes a decision? Controllability: can the organisation steer the thing this number describes, or only watch it?",
      "kWh drawn is easy to measure but, alone, barely informative. Grid carbon intensity is genuinely informative — and almost entirely outside Clarity's control.",
      "The rule: steer what you own, monitor the rest. A lean, defensible metric set is built from the first kind, and openly labels the second.",
    ],
    reasoning: [
      "When comparing candidate metrics or lines of measures, ask which of the three pulls is actually weak — not just whether the metric \"seems useful\". A metric that is easy and informative but uncontrollable still belongs on a monitoring dashboard, just not in a KPI someone is held accountable for.",
      "In Task 2, weigh each candidate line against all three pulls together. A line that wins big on one and loses on the other two is not automatically the strongest choice.",
    ],
    sources: [],
    minutes: 3,
  },
  {
    id: "threeLines",
    code: "M7",
    n: 3,
    icon: "trophy",
    title: "Three candidate lines — and the attractive-but-weak trap",
    standfirst: "A shiny option and a structurally strong option are not always the same option.",
    sentences: [
      "Three lines of measures are on the table at Clarity Digital Services. A) A Green IT KPI & dashboard system for management and departments. B) IT-specific carbon monitoring — a baseline, an emissions logic, and allocation of the relevant sources. C) A review & improvement process that uses existing data systematically for continuous optimisation.",
      "Budget only stretches to one, first. Each line looks different once you apply M6's three pulls to it, rather than judging it on visibility alone.",
      "The trap: a line can look excellent for the future and still be structurally weak underneath — a shiny dashboard with no review logic behind it is transparency theatre, not steering. Naming that risk in advance is part of a defensible choice, not a hedge.",
    ],
    reasoning: [
      "Before picking a priority line, state what specifically breaks if you are wrong — not just \"it might not work\". That specific failure mode is what Task 2's justification is checked against.",
      "A dashboard (Option A) is only as strong as the review process behind it (M5). Carbon monitoring (Option B) is only as strong as the boundary and allocation choices behind it. Judge each option by what it depends on, not by what it displays.",
    ],
    sources: [],
    minutes: 2,
  },
];

export const MATERIAL1_INTRO = {
  kicker: "Material 1 · four cards · about 10 minutes",
  title: "What Task 1 needs, and nothing else",
  intro:
    "Four short cards, each a few sentences and one live diagram. Together they give you the vocabulary Task 1 uses to diagnose why Clarity Digital Services collects a great deal of data and steers almost nothing with it.",
} as const;

export const MATERIAL2_INTRO = {
  kicker: "Material 2 · three cards · about 8 minutes",
  title: "What Task 2 needs, and nothing else",
  intro:
    "Three short cards step the question up from \"is this metric any good?\" to \"which whole line of measures do we fund first?\" — the vocabulary Task 2's prioritisation uses.",
} as const;
