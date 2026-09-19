/**
 * Task 1 — "Clarity Digital Services: which metrics really help?" ~15
 * minutes, Level 1 only. Three stages, each a small decision-first
 * mechanic rather than a free-form guess (CLAUDE.md §4):
 *
 *  Stage A — drag ten signal cards into the six areas M3 teaches. A primary
 *  area is required; a secondary area is an optional second tag, since a
 *  few signals genuinely touch two areas at once.
 *  Stage B — six candidate metrics, each resolved into "Effective for
 *  Management" or "Merely Informative" by one qualifying question (M4's six
 *  gates: a sound number AND a wired one — target, decision, owner), never
 *  free-dragged.
 *  Stage C — the same six-gate idea read as effort rather than quality: sort
 *  six concrete moves into what can be built short-term versus what has to
 *  be built structurally.
 *
 * Scope note: the build brief's live-report spec also asks for a per-signal
 * free-text "what this tells us" line. Ten of those, on top of six area
 * write-ups and two further classification stages, would not fit the
 * task's own ~15-minute budget — so that line is folded into the one
 * required, per-area "first improvement approach" field instead, and is not
 * duplicated per signal (flagged here per the standing instruction to
 * surface a scope discrepancy rather than silently bloat the task).
 */

import type { AnswerKeyBlock } from "@/lib/answerKey";
import type { IconKey } from "@/lib/routes";
import type { MaterialSectionId } from "./sections";

export type ClueTier = { soft: string; sharp: string };

export const GENERIC_FALLBACK_CLUE: ClueTier = {
  soft: "Re-read the signal and ask which of the six areas it is evidence *of*, not merely what topic it mentions.",
  sharp: "Separate the fact stated from the topic it happens to touch — a carbon-related sentence is not automatically Carbon Monitoring if what it actually demonstrates is a missing owner or a data gap.",
};

// ---------------------------------------------------------------------------
// The six areas (M3)
// ---------------------------------------------------------------------------

export type AreaId =
  | "metricQuality"
  | "dataAvailability"
  | "reporting"
  | "managementRelevance"
  | "carbonMonitoring"
  | "responsibilities";

export type Area = {
  id: AreaId;
  name: string;
  note: string;
  icon: IconKey;
  /** Tell-tale wording in a sentence that points at this area. */
  lookFor: string;
  /** A one-sentence example that is deliberately not one of the task's signals. */
  example: string;
  /** The area learners most often confuse it with. */
  confusedWith: AreaId;
  /** The question that separates it from the area it is confused with. */
  ask: string;
};

export const AREAS: Area[] = [
  {
    id: "metricQuality",
    name: "Metric Quality",
    note: "Comparable, robust, built on consistent boundaries.",
    icon: "certificate",
    lookFor: "“different boundaries”, “no consistent structure”, “can't be compared”, different units",
    example: "Two offices report “IT electricity” — one includes the print room, the other does not.",
    confusedWith: "dataAvailability",
    ask: "Does the number exist, yet not line up with another figure?",
  },
  {
    id: "dataAvailability",
    name: "Data Availability",
    note: "Is it captured at all, and completely?",
    icon: "database",
    lookFor: "“not captured”, “only partly available”, “no data”, “missing”",
    example: "Nobody records how long spare laptops sit in storage before they are reused.",
    confusedWith: "metricQuality",
    ask: "Is a number simply missing — rather than present but not comparable?",
  },
  {
    id: "reporting",
    name: "Reporting",
    note: "Informs — or actually supports a decision.",
    icon: "clipboard",
    lookFor: "“requests”, “slide”, “totals only”, “no coordinated system”, external requirements",
    example: "Three departments each ask for a monthly figure, and a different person builds each one by hand.",
    confusedWith: "managementRelevance",
    ask: "Is the fault the shape or route of the output — not the numbers, and not what gets decided?",
  },
  {
    id: "managementRelevance",
    name: "Management Relevance",
    note: "Tied to a target, an owner, and a decision.",
    icon: "target",
    lookFor: "“not linked to goals”, “hardly used for prioritisation”, “no target”",
    example: "A quarterly figure is shown to management, and nothing in the next budget round refers to it.",
    confusedWith: "reporting",
    ask: "Does anyone decide anything differently because of the number?",
  },
  {
    id: "carbonMonitoring",
    name: "Carbon Monitoring",
    note: "IT emissions captured and allocated — Scope 1/2/3.",
    icon: "radar",
    lookFor: "“emissions”, “CO₂e”, “Scope 1/2/3”, “allocation” — about IT's emissions specifically",
    example: "The company knows what it pays for electricity but has never estimated the emissions of its laptops.",
    confusedWith: "dataAvailability",
    ask: "Is it about IT's emissions being captured and allocated — not just any figure being absent?",
  },
  {
    id: "responsibilities",
    name: "Responsibilities",
    note: "Is there a named owner?",
    icon: "person",
    lookFor: "“nobody owns”, “no one is responsible”, “unclear who”",
    example: "The energy figure is quoted in three documents, and each team assumes another team owns it.",
    confusedWith: "managementRelevance",
    ask: "Is the fault that no named person answers for the figure?",
  },
];

export const areaById = (id: AreaId): Area => AREAS.find((a) => a.id === id)!;

export const AREA_FIELD = {
  instruction: "Drag a card into the area it most directly demonstrates, or tap it and then tap an area. A second, optional tag is available once it's placed. Each area shows what to look for and the question that tells it apart from its neighbour.",
  material: ["sixAreas"] as MaterialSectionId[],
};

export const APPROACH_FIELD = {
  label: "One robust first improvement for this area",
  instruction: "One concrete, robust step — not a wish. E.g. \"Define a single PUE boundary standard and a named metric owner.\"",
  placeholder: "e.g. Agree one shared boundary definition and publish it to every reporting team.",
  material: ["effectiveVsStructural"] as MaterialSectionId[],
};

// ---------------------------------------------------------------------------
// Stage A — the ten signal cards
// ---------------------------------------------------------------------------

export type Signal = {
  id: string;
  n: number;
  text: string;
  primaryArea: AreaId;
  /** A second area the signal genuinely also evidences — optional to tag, never required. */
  secondaryArea?: AreaId;
  clue: ClueTier;
  answerKey: AnswerKeyBlock;
};

export const SIGNALS: Signal[] = [
  {
    id: "s1",
    n: 1,
    text: "Individual consumption data is collected, but without a consistent structure.",
    primaryArea: "metricQuality",
    secondaryArea: "dataAvailability",
    clue: {
      soft: "Ask what's actually wrong here — is a number missing, or does it exist but can't be compared across teams?",
      sharp: "\"Without a consistent structure\" means no shared definition or boundary, which is exactly what stops two numbers being compared. Which area is named after that test?",
    },
    answerKey: {
      prompt: "Signal 1 — consumption data without a consistent structure",
      items: [
        { option: "Metric Quality (expected)", verdict: "pick", why: "No shared structure means the numbers cannot be compared across teams — the definition of a Metric Quality gap." },
        { option: "Data Availability (defensible secondary)", verdict: "pick", why: "The data does exist, but 'without a consistent structure' also implies it isn't fully or reliably captured everywhere — a reasonable second tag." },
        { option: "Reporting (plausible wrong)", verdict: "avoid", why: "Nothing here is about whether output reaches a decision-maker — the fault is in the numbers themselves, not in how they're presented." },
      ],
    },
  },
  {
    id: "s2",
    n: 2,
    text: "Cloud costs and energy consumption are partly visible, but not linked to sustainability goals.",
    primaryArea: "managementRelevance",
    secondaryArea: "dataAvailability",
    clue: {
      soft: "The numbers exist and are even visible — so what's actually missing is not the data itself. What is it not connected to?",
      sharp: "\"Not linked to sustainability goals\" is the target-and-decision half of M1's test failing, even though the number itself is there. That is the area named after exactly that link.",
    },
    answerKey: {
      prompt: "Signal 2 — cloud energy visible but not linked to goals",
      items: [
        { option: "Management Relevance (expected)", verdict: "pick", why: "The data is visible — the gap is that it is not tied to a target or a decision, which is precisely what this area tests." },
        { option: "Data Availability (defensible secondary)", verdict: "pick", why: "'Partly visible' signals an availability gap as well, worth tagging as a secondary." },
        { option: "Carbon Monitoring (plausible wrong)", verdict: "avoid", why: "Energy and carbon are related topics, but nothing here is about Scope 1/2/3 allocation — it's about a missing link to goals." },
      ],
    },
  },
  {
    id: "s3",
    n: 3,
    text: "Information on device service life and reuse is only partially available.",
    primaryArea: "dataAvailability",
    clue: {
      soft: "Is the problem that the numbers can't be compared, or that they simply aren't all there yet?",
      sharp: "\"Only partially available\" is a direct statement about capture, not about comparability or ownership — read it literally.",
    },
    answerKey: {
      prompt: "Signal 3 — device service-life and reuse data only partial",
      items: [
        { option: "Data Availability (expected)", verdict: "pick", why: "\"Only partially available\" is a direct capture gap — the textbook case for this area." },
        { option: "Responsibilities (plausible wrong)", verdict: "avoid", why: "Nothing here says whether anyone owns the figure — only that the figure itself is incomplete." },
      ],
    },
  },
  {
    id: "s4",
    n: 4,
    text: "Reporting requests come from management, sustainability, and IT — but there is no coordinated system of metrics.",
    primaryArea: "reporting",
    secondaryArea: "responsibilities",
    clue: {
      soft: "Three different requesters, one word missing between them — what does \"no coordinated system\" actually describe?",
      sharp: "Multiple stakeholders asking for figures with no shared system to answer them from is a Reporting design gap; the fact nobody has been made responsible for building that system is a fair second tag.",
    },
    answerKey: {
      prompt: "Signal 4 — three requesters, no coordinated metric system",
      items: [
        { option: "Reporting (expected)", verdict: "pick", why: "Multiple report requests hitting no shared system is exactly what an uncoordinated reporting structure looks like." },
        { option: "Responsibilities (defensible secondary)", verdict: "pick", why: "A coordinated system usually needs someone accountable for building it — worth tagging, not required." },
        { option: "Metric Quality (plausible wrong)", verdict: "avoid", why: "This is about the absence of a reporting structure, not about whether existing numbers are comparable or robust." },
      ],
    },
  },
  {
    id: "s5",
    n: 5,
    text: "Teams measure a great deal, but hardly use the data for prioritisation.",
    primaryArea: "managementRelevance",
    clue: {
      soft: "Plenty of measuring is happening — M1's opening point exactly. What is the one thing that never follows from it?",
      sharp: "Data that never changes a prioritisation decision is the textbook \"activity metric with no decision link\" — the area named after that link.",
    },
    answerKey: {
      prompt: "Signal 5 — measuring a lot, using little for prioritisation",
      items: [
        { option: "Management Relevance (expected)", verdict: "pick", why: "This is M1's core distinction stated almost verbatim: activity is happening, but no decision (prioritisation) is being driven by it." },
        { option: "Data Availability (plausible wrong)", verdict: "avoid", why: "The data clearly exists — \"measure a great deal\" rules out an availability gap; the fault is downstream of capture." },
      ],
    },
  },
  {
    id: "s6",
    n: 6,
    text: "External reporting requirements are increasing.",
    primaryArea: "reporting",
    clue: {
      soft: "This is a pressure on the system, not yet a fault inside it — which area is about reporting obligations and output?",
      sharp: "Growing external requirements is a direct Reporting-area pressure — read literally, it names no quality, ownership or carbon-allocation problem.",
    },
    answerKey: {
      prompt: "Signal 6 — external reporting requirements rising",
      items: [
        { option: "Reporting (expected)", verdict: "pick", why: "This names growing pressure on external disclosure directly — the Reporting area's own subject matter." },
        { option: "Carbon Monitoring (plausible wrong)", verdict: "avoid", why: "External reporting can concern more than emissions; nothing here specifically names Scope 1/2/3 allocation." },
      ],
    },
  },
  {
    id: "s7",
    n: 7,
    text: "Two teams report PUE using different boundaries, so the numbers can't be compared.",
    primaryArea: "metricQuality",
    clue: {
      soft: "The word \"boundaries\" is doing the work here — which area is specifically about consistent boundaries and comparability?",
      sharp: "Different facility boundaries producing incomparable PUE figures is the definitional Metric Quality problem from M3 — comparability is the test.",
    },
    answerKey: {
      prompt: "Signal 7 — PUE reported on different boundaries",
      items: [
        { option: "Metric Quality (expected)", verdict: "pick", why: "Different boundaries producing incomparable figures is precisely what \"comparable, robust, consistent boundaries\" means in M3." },
        { option: "Data Availability (plausible wrong)", verdict: "avoid", why: "Both teams are reporting a number — nothing is missing. The fault is that the two numbers cannot be set side by side." },
      ],
    },
  },
  {
    id: "s8",
    n: 8,
    text: "No one owns the CO₂ figure end-to-end.",
    primaryArea: "responsibilities",
    secondaryArea: "carbonMonitoring",
    clue: {
      soft: "\"No one owns\" is about as direct as a signal gets — which area asks exactly that question?",
      sharp: "This is Responsibilities' defining question, stated outright. The fact the figure in question is the CO₂ figure is what makes Carbon Monitoring a fair secondary tag.",
    },
    answerKey: {
      prompt: "Signal 8 — no end-to-end owner for the CO₂ figure",
      items: [
        { option: "Responsibilities (expected)", verdict: "pick", why: "\"No one owns\" is a direct, literal statement of the Responsibilities test." },
        { option: "Carbon Monitoring (defensible secondary)", verdict: "pick", why: "The specific figure with no owner is the CO₂ figure — worth tagging as a secondary, since the emissions-allocation question is also live." },
        { option: "Metric Quality (plausible wrong)", verdict: "avoid", why: "Nothing here says the figure is inconsistent or incomparable — only that no one is accountable for it." },
      ],
    },
  },
  {
    id: "s9",
    n: 9,
    text: "A monthly slide shows totals but never a target-vs-actual.",
    primaryArea: "reporting",
    secondaryArea: "managementRelevance",
    clue: {
      soft: "The output exists and reaches people every month — so what's missing is about the *shape* of that output, not whether it happens.",
      sharp: "A total with no target-vs-actual comparison is reporting for information, not reporting for decision support — and \"no target\" is also M1's decision-link test failing.",
    },
    answerKey: {
      prompt: "Signal 9 — monthly totals, no target-vs-actual",
      items: [
        { option: "Reporting (expected)", verdict: "pick", why: "A totals-only slide with no target-vs-actual comparison is the textbook \"informational, not decision-support\" reporting gap." },
        { option: "Management Relevance (defensible secondary)", verdict: "pick", why: "No target-vs-actual also means no visible link to a target — a fair secondary tag under M1's test." },
        { option: "Responsibilities (plausible wrong)", verdict: "avoid", why: "Someone is clearly producing this slide every month — ownership of the reporting task is not what's missing here." },
      ],
    },
  },
  {
    id: "s10",
    n: 10,
    text: "Cloud spend is tracked, emissions are not.",
    primaryArea: "carbonMonitoring",
    secondaryArea: "dataAvailability",
    clue: {
      soft: "One of the two figures in this sentence is being tracked and one isn't — which one does Carbon Monitoring actually care about?",
      sharp: "Emissions specifically are the untracked half. Cloud spend being tracked is a distractor — the area this evidences is about IT's emissions not being captured at all.",
    },
    answerKey: {
      prompt: "Signal 10 — cloud spend tracked, emissions not",
      items: [
        { option: "Carbon Monitoring (expected)", verdict: "pick", why: "Emissions specifically are what's missing — the direct subject of the Carbon Monitoring area." },
        { option: "Data Availability (defensible secondary)", verdict: "pick", why: "\"Emissions are not [tracked]\" is also a plain capture gap — a reasonable secondary tag." },
        { option: "Metric Quality (plausible wrong)", verdict: "avoid", why: "There's no comparability problem stated — cloud spend being tracked while emissions aren't is an availability gap, not a boundary mismatch." },
      ],
    },
  },
];

export const signalById = (id: string): Signal => SIGNALS.find((s) => s.id === id)!;

export const CHECK_LABELS = {
  check: "Check",
  recheck: "Check again",
  holds: "This placement holds up.",
  wrongTier1: "Not quite — here is a first clue.",
  wrongTier2: "Still not quite — a sharper clue, since you've checked this one before.",
} as const;

// ---------------------------------------------------------------------------
// Stage B — Informative vs Management-effective
// ---------------------------------------------------------------------------

export type EffectivenessAnswer = "yes" | "no";
export type EffectivenessVerdict = "effective" | "informative";

export function resolveEffectiveness(answer: EffectivenessAnswer): EffectivenessVerdict {
  return answer === "yes" ? "effective" : "informative";
}

export const QUALIFYING_QUESTION = {
  label: "Is the number sound AND wired to management?",
  instruction:
    "Sound = relevant, understandable, comparable and robust. Wired = a target and a decision that changes when it moves (actionable), and one named owner. There is no partial credit: missing any one of the six gates makes it merely informative.",
  options: [
    { id: "yes" as const, label: "Yes — all six gates are cleared" },
    { id: "no" as const, label: "No — at least one gate is missing" },
  ],
  material: ["effectiveVsStructural"] as MaterialSectionId[],
};

export type StageBMetric = {
  id: string;
  n: number;
  text: string;
  expected: EffectivenessAnswer;
  clue: ClueTier;
  answerKey: AnswerKeyBlock;
};

export const STAGE_B_METRICS: StageBMetric[] = [
  {
    id: "b1",
    n: 1,
    text: "Monthly total kWh across all sites.",
    expected: "no",
    clue: {
      soft: "A total is an activity number (M2). Does the description mention a target, an owner, or a decision anywhere?",
      sharp: "Nothing here names a target, an owner or a decision — it is a pure activity count, however accurate.",
    },
    answerKey: {
      prompt: "Stage B — Monthly total kWh across all sites",
      items: [
        { option: "Merely informative (expected)", verdict: "pick", why: "A total consumption figure with no stated target, owner or linked decision — an activity metric (M2), not a management one." },
        { option: "Effective for management (plausible wrong)", verdict: "avoid", why: "Learners sometimes assume any \"real\" operational number counts — but M4's test is about the target/owner/decision link, not accuracy." },
      ],
    },
  },
  {
    id: "b2",
    n: 2,
    text: "PUE per site, though each site currently reports it using a different facility boundary.",
    expected: "no",
    clue: {
      soft: "This one fails on a different gate than \"no target\" — look back at M4's list of six and ask which one a boundary mismatch breaks.",
      sharp: "Incomparable boundaries fail the \"comparable\" gate directly — even a well-intentioned target attached to an incomparable number does not make the number management-effective yet.",
    },
    answerKey: {
      prompt: "Stage B — PUE per site, inconsistent boundaries",
      items: [
        { option: "Merely informative (expected)", verdict: "pick", why: "Different facility boundaries make the figure incomparable across sites — it fails M4's comparability gate regardless of any other criteria." },
        { option: "Effective for management (plausible wrong)", verdict: "avoid", why: "PUE looks like a serious, standards-based metric (ISO/IEC 30134-2), but the standard itself only works when boundaries are applied consistently." },
      ],
    },
  },
  {
    id: "b3",
    n: 3,
    text: "CO₂e per business service, measured against a stated 2030 reduction target, owned by the Sustainability Lead.",
    expected: "yes",
    clue: {
      soft: "Walk the six gates against this description: is the number sound, and are the target, the decision and the owner all named?",
      sharp: "A stated target, a named owner, and the implied decision (whether the service is on track) are all present — that is a full pass.",
    },
    answerKey: {
      prompt: "Stage B — CO₂e per service, target, owner",
      items: [
        { option: "Effective for management (expected)", verdict: "pick", why: "Target (2030 reduction), owner (Sustainability Lead) and decision link (whether the service is on track) are all explicit — a full pass of M4's gate." },
        { option: "Merely informative (plausible wrong)", verdict: "avoid", why: "A learner focused only on whether the number is precise can miss that all three gate criteria are already satisfied here." },
      ],
    },
  },
  {
    id: "b4",
    n: 4,
    text: "Number of sustainability dashboards produced this quarter.",
    expected: "no",
    clue: {
      soft: "Ask what this number actually measures — is it the outcome, or is it an artefact of producing the report itself?",
      sharp: "This measures reporting activity, not any environmental or business outcome at all — the classic vanity metric M4 warns about.",
    },
    answerKey: {
      prompt: "Stage B — Number of dashboards produced",
      items: [
        { option: "Merely informative (expected)", verdict: "pick", why: "Counting dashboards measures reporting output, not any real outcome or decision — the textbook vanity metric." },
        { option: "Effective for management (plausible wrong)", verdict: "avoid", why: "It can look like progress (\"we're reporting more\") without the number ever being connected to a target that matters." },
      ],
    },
  },
  {
    id: "b5",
    n: 5,
    text: "Device reuse rate, measured against a stated 30% target, owned by Procurement.",
    expected: "yes",
    clue: {
      soft: "Same check as always — target, owner, decision. Is any one of the three actually missing here?",
      sharp: "Target (30%), owner (Procurement) and the implied decision (whether reuse policy needs adjusting) are all present — a full pass.",
    },
    answerKey: {
      prompt: "Stage B — Device reuse rate vs 30% target",
      items: [
        { option: "Effective for management (expected)", verdict: "pick", why: "A stated target, a named owner and a clear decision link (adjust the reuse policy or not) are all present." },
        { option: "Merely informative (plausible wrong)", verdict: "avoid", why: "The topic (reuse) can read as \"softer\" than carbon figures, but M4's gate doesn't care about topic — only about the target/owner/decision link, which is intact here." },
      ],
    },
  },
  {
    id: "b6",
    n: 6,
    text: "Cloud spend by department.",
    expected: "no",
    clue: {
      soft: "This is a real, well-owned figure in most organisations — but owned by whom, and tied to what kind of target?",
      sharp: "Cloud spend is a financial figure with a financial owner, not a sustainability target — nothing here ties it to an environmental decision.",
    },
    answerKey: {
      prompt: "Stage B — Cloud spend by department",
      items: [
        { option: "Merely informative for this purpose (expected)", verdict: "pick", why: "The figure is well-owned and comparable, but not tied to any sustainability target or decision — it fails the specific gate this exercise is testing." },
        { option: "Effective for management (plausible wrong)", verdict: "avoid", why: "Cloud spend genuinely is well-managed in most finance functions — the trap is assuming \"well-managed for one purpose\" transfers automatically to a sustainability-management purpose." },
      ],
    },
  },
];

// ---------------------------------------------------------------------------
// Stage C — Short-term vs Structural
// ---------------------------------------------------------------------------

export type Horizon = "shortTerm" | "structural";

export type HorizonItem = {
  id: string;
  n: number;
  text: string;
  expected: Horizon;
  clue: ClueTier;
  answerKey: AnswerKeyBlock;
};

export const HORIZON_LANES: { id: Horizon; name: string; note: string }[] = [
  { id: "shortTerm", name: "Buildable short-term", note: "Changes how a number is captured or written down — no governance needed to start." },
  { id: "structural", name: "Has to be built structurally", note: "Creates accountability — a target, an owner and a review cadence — before it counts as management-effective." },
];

export const HORIZON_ITEMS: HorizonItem[] = [
  {
    id: "h1",
    n: 1,
    text: "Start capturing kWh consistently across all sites.",
    expected: "shortTerm",
    clue: {
      soft: "Does this need a governance structure to begin, or just a decision to start measuring the same way everywhere?",
      sharp: "Consistent capture is an operational fix — M4 names exactly this as buildable short-term, with no target or owner required first.",
    },
    answerKey: {
      prompt: "Stage C — Capture kWh consistently",
      items: [{ option: "Short-term (expected)", verdict: "pick", why: "Consistent capture is an operational change, not a governance one — M4's short-term example, almost verbatim." }],
    },
  },
  {
    id: "h2",
    n: 2,
    text: "Write a shared metric dictionary — names, formulas, boundaries.",
    expected: "shortTerm",
    clue: {
      soft: "Writing a definition down is documentation work. Does it require a standing review cadence to exist?",
      sharp: "A metric dictionary is a one-off (though maintained) document — it does not need an owner and review cycle to be written, only to be kept current later.",
    },
    answerKey: {
      prompt: "Stage C — Write a shared metric dictionary",
      items: [{ option: "Short-term (expected)", verdict: "pick", why: "Defining names, formulas and boundaries is documentation work that can start immediately, without governance in place first." }],
    },
  },
  {
    id: "h3",
    n: 3,
    text: "Agree one PUE boundary standard across teams.",
    expected: "shortTerm",
    clue: {
      soft: "This fixes the exact Metric Quality problem from Signal 7 — does fixing it need a review cadence, or just an agreement?",
      sharp: "Agreeing a shared boundary is a one-time coordination step, not an ongoing governance commitment — buildable short-term.",
    },
    answerKey: {
      prompt: "Stage C — Agree one PUE boundary standard",
      items: [{ option: "Short-term (expected)", verdict: "pick", why: "A boundary standard is agreed once, then applied — no standing owner or review cadence is required to reach agreement itself." }],
    },
  },
  {
    id: "h4",
    n: 4,
    text: "Govern a CO₂e-per-service metric with a target, an owner and a review cadence.",
    expected: "structural",
    clue: {
      soft: "This item names all three of M4's structural requirements explicitly — count them.",
      sharp: "Target, owner and review cadence are named in the item itself — this is the definition of a structurally built management metric.",
    },
    answerKey: {
      prompt: "Stage C — Govern a CO₂e-per-service metric",
      items: [{ option: "Structural (expected)", verdict: "pick", why: "Target, owner and review cadence, all named — the textbook case of a structurally governed management metric." }],
    },
  },
  {
    id: "h5",
    n: 5,
    text: "Set a recurring management review of target versus actual.",
    expected: "structural",
    clue: {
      soft: "\"Recurring\" is the key word — does a recurring commitment fit the short-term or the structural lane?",
      sharp: "A standing review cadence is exactly M5's PDCA discipline — a routine, not a one-off fix, which places it in the structural lane.",
    },
    answerKey: {
      prompt: "Stage C — Recurring target-vs-actual review",
      items: [{ option: "Structural (expected)", verdict: "pick", why: "A recurring review cadence is M5's PDCA loop in miniature — a standing routine, not a one-off task." }],
    },
  },
  {
    id: "h6",
    n: 6,
    text: "Build Scope 1/2/3 allocation logic into the reporting system.",
    expected: "structural",
    clue: {
      soft: "Compare this to Signal 10's gap. Fixing it permanently — inside the reporting system itself — is a bigger commitment than starting to capture one number.",
      sharp: "Allocation logic embedded in the reporting system is infrastructure, not a one-off data-capture fix — it needs design, an owner and upkeep, which is structural.",
    },
    answerKey: {
      prompt: "Stage C — Build Scope 1/2/3 allocation logic",
      items: [{ option: "Structural (expected)", verdict: "pick", why: "Embedding allocation logic into the reporting system is an infrastructure build, requiring ongoing ownership — not a short-term fix." }],
    },
  },
];

// ---------------------------------------------------------------------------
// Task framing
// ---------------------------------------------------------------------------

export const TASK1_FRAMING = {
  tag: "TASK 1 · DIAGNOSE",
  title: "Which metrics really help?",
  minutes: 15,
  instruction:
    "Diagnose why the data isn't steering anything, and sketch one robust first improvement per area. No deep metric knowledge needed — this is a management and reporting problem.",
} as const;

export const WORK_ASSIGNMENT_T1: string[] = [
  "Drag each of the ten signal cards into the area it most directly evidences. Each area shows what to look for and the question that tells it apart from its neighbour. A second tag is optional where a signal genuinely touches two areas.",
  "Write one robust first improvement approach for each of the six areas.",
  "For six candidate metrics, answer the one qualifying question against the six gates and see whether each resolves into Effective for Management or Merely Informative.",
  "Sort six concrete moves into what's buildable short-term versus what has to be built structurally.",
  "Use Check whenever you want feedback: ✓ means it holds up, ✕ means not yet — with a clue to reason from, never the answer. Change an answer and the verdict clears.",
];

/** One export for Task 1 only. Filename: `1-{name}-day16-l1task1`. */
export const EXPORT1 = {
  taskSlug: "l1task1",
  docHeading: "Clarity Digital Services — Metrics Diagnosis",
  buttonLabel: "Export Task 1 as PDF",
} as const;
