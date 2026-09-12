/**
 * Route 1 — Knowledge (L1). All learner-facing copy and pure data live here so
 * components stay presentational. Case used throughout Task 1: UrbanByte
 * Consulting (fictional).
 */

import type { IconKey } from "@/lib/routes";
import type { AnswerKeyBlock } from "@/lib/answerKey";

export const LEARNER_NAME_KEY = "learner:name";

// ---------------------------------------------------------------------------
// Store key map — every key this route writes to the shared progress store.
// ---------------------------------------------------------------------------
export const R1 = {
  name: LEARNER_NAME_KEY,
  /** markSeen bucket for zones the learner has opened on the floor plan. */
  zones: "r1:zones",
  stage1: {
    category: (findingId: string) => `r1:s1:cat:${findingId}`,
  },
  stage2: {
    driver: (findingId: string) => `r1:s2:driver:${findingId}`,
    horizon: (findingId: string) => `r1:s2:horizon:${findingId}`,
  },
  stage3: {
    priority: (findingId: string) => `r1:s3:pick:${findingId}`,
    direction: (findingId: string) => `r1:s3:dir:${findingId}`,
    justification: (findingId: string) => `r1:s3:why:${findingId}`,
  },
} as const;

// ---------------------------------------------------------------------------
// Material — 4 blocks plus a framework reference grid.
// ---------------------------------------------------------------------------
export type MaterialSectionId = "workplace" | "carbon" | "servicelife" | "tradeoffs" | "frameworks";

export type MaterialSection = {
  id: Exclude<MaterialSectionId, "frameworks">;
  n: 1 | 2 | 3 | 4;
  icon: IconKey;
  kicker: string;
  title: string;
  definition: string;
  insight: string;
  takeaway: string;
  /**
   * Standard #11a — the decision rules this block hands the task, phrased the
   * way the task will need them, including the rule that rules out the
   * plausible wrong answer. Rendered as "How to decide when this comes up in
   * the task".
   */
  reasoning: string[];
  callout: { label: string; text: string };
  /** Real external sources, per the curriculum standard: named body, and a link where one is stable. */
  references: { label: string; url?: string }[];
};

/** DOM anchor a task step's MaterialRefs chip scrolls to. */
export function materialAnchorId(id: MaterialSectionId): string {
  return `r1-material-${id}`;
}

const MATERIAL_LABELS: Record<MaterialSectionId, string> = {
  workplace: "Block 1 · The five elements",
  carbon: "Block 2 · Where the carbon sits",
  servicelife: "Block 3 · Two service lives",
  tradeoffs: "Block 4 · Trade-offs & leverage",
  frameworks: "Reference · Frameworks",
};

/** Chips for a task step: which material sections it draws on. */
export function materialRefs(ids: MaterialSectionId[]) {
  return ids.map((id) => ({ anchorId: materialAnchorId(id), label: MATERIAL_LABELS[id] }));
}

export const MATERIAL: MaterialSection[] = [
  {
    id: "workplace",
    n: 1,
    icon: "layers",
    kicker: "1 · What the term actually covers",
    title: "A Green Workplace Is Five Things, Not One",
    definition:
      "A green workplace is not a single practice like switching monitors off at night. It is the interplay of five things most organisations manage separately, but which jointly determine both environmental and economic outcomes: device lifecycle decisions (how long hardware stays in service and what happens to it afterwards), individual usage behaviour (power states, printing, personal habits), the IT support model (whether the default response to a problem is repair or replacement), procurement policy (what gets bought, on what contract terms, against which criteria), and how the physical and digital workplace is organised (desk sharing, peripheral pools, remote-work patterns).",
    insight:
      "Because those five are usually owned by different people — IT operations, facilities, procurement, finance, HR — it is entirely normal for an organisation to run them against each other without noticing. An energy-saving awareness campaign aimed at employees, running alongside a procurement contract that replaces every notebook on a fixed three-year cycle regardless of condition, produces a great deal of visible activity and very little measurable change. The campaign works on one element; the contract quietly governs a much larger one.",
    takeaway:
      "When you audit a workplace, the useful diagnostic question is never \"are people behaving well enough?\" but \"which of these five elements is unmanaged, and who owns the decision that would change it?\" That reframing is what turns a list of observations into a case a manager can act on.",
    reasoning: [
      "When a finding could belong to two of the five elements, ask which one would have to change for the finding to disappear. That is the element it belongs to — not the one where the symptom happens to be visible.",
      "Hardware that nobody is tracking is a lifecycle and peripherals question, not a behaviour question: no amount of employee goodwill catalogues a storeroom.",
      "Rules out the tempting wrong answer: visible activity is not evidence that an element is managed. A campaign, a poster, or an informal habit tells you someone cares — it does not tell you anyone owns the decision.",
    ],
    callout: {
      label: "Why this matters for the case ahead",
      text: "UrbanByte Consulting advises other companies on sustainable digital transformation. Its own workplace has never been audited against that standard — and what you'll find is not a lack of goodwill, but five elements nobody has ever looked at together.",
    },
    references: [
      { label: "Blue Angel (Blauer Engel) — award criteria for computers and workplace IT", url: "https://www.blauer-engel.de/en" },
      { label: "ESRS E5 (Resource use and circular economy) under the EU CSRD" },
    ],
  },
  {
    id: "carbon",
    n: 2,
    icon: "factory",
    kicker: "2 · The number that reframes everything",
    title: "Where a Device's Carbon Actually Sits",
    definition:
      "For a typical business laptop, manufacturing accounts for roughly 75–85% of the device's total lifetime carbon footprint — not the years of daily use that follow. Independent lifecycle assessments across Dell, HP and Lenovo business notebooks converge on that range; one detailed model of a 14-inch business laptop splits it as 81.4% manufacturing, 13.9% use phase, 4.4% transport and 0.3% end-of-life. The reason manufacturing dominates is physical: building a laptop means mining and refining rare-earth and precious metals, fabricating semiconductors (extremely energy- and water-intensive), producing a lithium battery, and moving components across several countries before final assembly. That footprint is spent the moment the device exists, largely regardless of how efficiently it runs afterwards.",
    insight:
      "The consequence is counter-intuitive but well evidenced. A joint analysis by TCO Certified and the Öko-Institut — a German research institute specialising in sustainable consumption policy — examined 15 carbon footprint reports for 14-inch business notebooks from Dell, Lenovo and HP, and found that extending service life from four to six years cuts average annual emissions by roughly 29%: from about 74.7 kg CO₂e per year down to about 53.1 kg CO₂e per year. Nothing about the device changes. The fixed manufacturing footprint is simply spread across more years of useful work. Read the other way round: buying a \"greener\" replacement almost always creates more lifecycle carbon than keeping the current device running longer, because the purchase re-triggers the dominant manufacturing footprint while the use-phase efficiency gain is comparatively small.",
    takeaway:
      "One honest caveat, because this argument will be challenged by anyone technical: the pattern is strongest for laptops. For desktop PCs the use-phase share is larger, simply because desktops draw more power — one comparative study put a desktop's total footprint at 679 kg CO₂e over four years against a laptop's 286 kg CO₂e for the same task load. \"Extend, don't replace\" is therefore not a universal law; it is a consequence of where the footprint sits for a given device category. Office fleets are increasingly laptop-dominated, which is precisely why this lever matters so much for workplace IT.",
    reasoning: [
      "If a finding is about a working device leaving the organisation, the carbon question is already settled: the replacement's manufacturing footprint is the dominant number. Classify it under replacement cycles, not under cost.",
      "Use-phase findings — power settings, machines left running overnight — are real, but they move the 13–15% slice. They belong under device use, and they are rarely the biggest lever in the room.",
      "Rules out the tempting wrong answer: \"we procure energy-efficient models\" is an answer to a use-phase question. It does not address a lifetime-extension question at all, because the efficiency of the replacement never recovers the carbon spent building it.",
    ],
    callout: {
      label: "Source and how to quote it",
      text: "Figures above come from the TCO Certified / Öko-Institut review of 15 notebook footprint reports. When you quote a lifecycle figure in a real report, always name the device class and the assumed hold period — a laptop number and a desktop number are not interchangeable, and a 4-year and 6-year model produce different annual figures from identical hardware.",
    },
    references: [
      { label: "TCO Certified & Öko-Institut e.V. — service-life extension analysis of 14\" business notebooks", url: "https://tcocertified.com" },
      { label: "Manufacturer product carbon footprint reports (Dell, HP, Lenovo business notebooks)" },
    ],
  },
  {
    id: "servicelife",
    n: 3,
    icon: "recycleLoop",
    kicker: "3 · The gap you are auditing",
    title: "Two Service Lives, and What Closes the Gap",
    definition:
      "Two different numbers both get called a device's \"service life\", and keeping them apart is the core analytical skill of this route. Technical service life is how long a device can physically and functionally keep working — CPU, RAM and storage still perform, the battery still holds a usable charge, the chassis is intact. For a well-specified, well-maintained business laptop that is realistically five to seven years, longer where components can be upgraded. Organisationally permitted service life is how long company policy allows a device to stay in service before mandatory replacement — commonly fixed at three years, and almost never because hardware is failing. It is set by leasing contract terms, depreciation schedules, or a support policy that prefers a uniform fleet age for simplicity. The gap between those two numbers is the lifetime-extension opportunity.",
    insight:
      "Closing that gap is not a matter of \"letting people keep old laptops\" — it needs five specific things to be true, and each one is decided well above desk level. Repairability, which is no longer merely a design nicety: the EU Right to Repair Directive (Directive (EU) 2024/1799) requires manufacturers of listed product categories to make repair available at a reasonable price and time, including after the warranty expires, with member states transposing it into national law by 31 July 2026; since June 2025 smartphones and tablets already carry a mandatory repairability label graded A to E, covering criteria such as spare-part availability and software-support duration. Laptops are not yet in scope, but they sit in the work plan of the Ecodesign for Sustainable Products Regulation that drives where these requirements go next — so this is a regulatory direction, not a hypothesis. Upgradability and material design, certified today through ecolabels: Blue Angel–certified computers must be repairable and upgradable by design and meet strict recyclable-design and material requirements, which is why a sourcing decision made years earlier is what makes extension feasible now. Fleet standardisation, which is commonly misapplied: standardising device models makes spare-part stocking and a repair-first process easier, whereas standardising the replacement schedule does the opposite. Support process design — whether IT's default is \"repair where possible\" or \"replace where convenient\" — which shapes outcomes more than almost anything else on this list and is a pure management decision nobody on the floor gets to make. And user acceptance: a technically excellent reuse programme still fails if employees read a repaired device as a status downgrade.",
    takeaway:
      "So when you find a three-year replacement cycle running on healthy hardware, the finding is not \"people replace things too often\". The finding is that permitted service life was set by a contract, and no documented criteria exist to let a healthy device stay. Name the mechanism, and the recommendation writes itself.",
    reasoning: [
      "Standardising models and standardising replacement cycles are two different decisions. A finding about a uniform fixed cycle is a replacement-cycle problem — never evidence of a standardisation benefit.",
      "If what is missing is a written rule, a criterion or an owner, the driver is management and structural, even when the visible symptom is one technician's habit on one shift.",
      "A perception problem — status, \"refurbished feels second-class\" — is the one place where individual behaviour is the honest reading of the driver. But the fix still sits with leadership, because only leadership can sanction reuse publicly and make it the normal choice.",
      "Rules out the tempting wrong answer: \"nobody stops people keeping older devices\" is not a lifetime-extension policy. An absent rule is not a permissive rule; it is an absent one, and it produces whatever the convenient default happens to be.",
    ],
    callout: {
      label: "The procurement link back to Day 5",
      text: "Buying Blue Angel–certified, repairable, upgradable devices is a Day 5 sourcing decision. Extending their life is a Day 9 operations decision. They are the same lever seen from two ends of the process — which is why a workplace cannot extend its way out of hardware that was never specified to be repairable.",
    },
    references: [
      { label: "Directive (EU) 2024/1799 — common rules promoting the repair of goods", url: "https://eur-lex.europa.eu/eli/dir/2024/1799/oj" },
      { label: "Regulation (EU) 2024/1781 — Ecodesign for Sustainable Products Regulation (ESPR)", url: "https://eur-lex.europa.eu/eli/reg/2024/1781/oj" },
      { label: "Blue Angel (Blauer Engel) — basic award criteria for computers", url: "https://www.blauer-engel.de/en" },
    ],
  },
  {
    id: "tradeoffs",
    n: 4,
    icon: "target",
    kicker: "4 · The counter-arguments, and the real lever",
    title: "Honest Trade-offs — and Why This Is a Leadership Topic",
    definition:
      "Lifetime extension is not free of cost or risk, and presenting it that way will not survive five minutes with an IT security or service lead. Three trade-offs are genuine. Security: ageing hardware eventually falls outside vendor security-patch support windows, or lacks hardware security modules that newer compliance baselines assume — there is a real point past which extension becomes a liability rather than a saving. Performance and software bloat: hardware and software are entangled, a machine can only be as efficient as the software running on it allows, and the way software is designed influences when otherwise-capable hardware starts to feel obsolete — which means some \"this laptop is too slow\" complaints are software problems wearing a hardware costume. Convenience and standardisation: a fleet with mixed repair and upgrade histories is genuinely harder to support uniformly than a fleet of identical age and spec.",
    insight:
      "Now put Block 2's number together with that list. If 75–85% of a device's footprint is already locked in at manufacturing, then desk-level behaviour — screen brightness, sleep settings, printing habits — can only ever influence the remaining 15–25%. Behaviour change is real and worth doing, and it is usually the cheapest thing to start. But it structurally cannot outperform a decision about when and how often devices get replaced, because that decision controls whether the dominant 75–85% is re-triggered at all. A workplace programme made entirely of behavioural nudges is optimising the smaller lever while leaving the larger one on autopilot.",
    takeaway:
      "That is why lifetime extension has to be designed as governance — leasing terms, documented repair/upgrade/retire criteria, support defaults, and a visible signal that reuse is sanctioned — rather than delegated to individual goodwill. It also now has a reporting counterpart: under the CSRD, ESRS E5 asks companies to disclose resource inflows and outflows and circular-economy performance, which makes \"how long do our devices stay in service\" a number an organisation may have to state publicly rather than merely intend.",
    reasoning: [
      "Diagnosing the horizon: a fix is short-term only if it can be done under current policy and current contracts. If a lease, a written criterion or an approval path has to change first, it is a structural change — however technically easy it sounds.",
      "Security is the one legitimate reason to replace a working device, but it has to be named specifically — out of patch support, missing a required hardware security module — not used as a blanket justification for a fixed cycle.",
      "Rules out the tempting wrong answer: \"the device feels slow\" is not evidence of hardware end-of-life until a software cause has been ruled out. Treat a perceived-performance finding as a diagnosis gap, not a hardware fact.",
      "When you choose what to act on first, prefer the finding whose fix is cheap and reversible over the one with the biggest theoretical impact — then say in your justification which larger lever it unlocks.",
    ],
    callout: {
      label: "How this plays in a German/EU corporate setting",
      text: "In a CSRD-reporting organisation, \"we extended average device service life from three to five years\" is both an emissions story and a disclosure line. That dual framing is usually what moves a finance stakeholder who was unmoved by the environmental argument alone.",
    },
    references: [
      { label: "ESRS E5 — Resource use and circular economy (EU CSRD reporting standards)" },
      { label: "Regulation (EU) 2024/1781 — ESPR, on software support and premature obsolescence", url: "https://eur-lex.europa.eu/eli/reg/2024/1781/oj" },
    ],
  },
];

// ---------------------------------------------------------------------------
// Framework reference grid (material summary block).
// ---------------------------------------------------------------------------
export type Framework = {
  id: string;
  name: string;
  governs: string;
};

export const FRAMEWORKS: Framework[] = [
  {
    id: "r2r",
    name: "EU Right to Repair Directive (2024/1799)",
    governs: "A legal right to repair for covered product categories — available at reasonable price and time, including after warranty. Member-state transposition deadline: 31 July 2026.",
  },
  {
    id: "espr",
    name: "ESPR (Regulation (EU) 2024/1781)",
    governs: "The ecodesign framework that decides which product categories get repairability, durability and software-support requirements next. Laptops sit in its work plan.",
  },
  {
    id: "blauer-engel",
    name: "Blue Angel (Blauer Engel)",
    governs: "German ecolabel certifying computers that are repairable and upgradable by design, with recyclable-design and material requirements — the sourcing decision that makes later extension possible.",
  },
  {
    id: "esrs-e5",
    name: "ESRS E5 (under CSRD)",
    governs: "Corporate disclosure of resource inflows/outflows and circular-economy performance — the reporting-side counterpart to a lifetime-extension decision.",
  },
];

export const FRAMEWORK_REASONING: string[] = [
  "Regulation tells you which way the ground is moving, not what to do this quarter. Cite it to justify why a policy change is worth doing now rather than in three years.",
  "Use Blue Angel at procurement and the Right to Repair Directive at operations. If a finding is about hardware that simply cannot be repaired, no operations policy will fix it — that is a sourcing failure.",
  "ESRS E5 is the argument that reaches finance: service life stops being a preference and becomes a figure the organisation may have to disclose.",
];

// ---------------------------------------------------------------------------
// Case brief — UrbanByte Consulting (Task 1)
// ---------------------------------------------------------------------------
export const CASE_BRIEF = {
  company: "UrbanByte Consulting",
  setup:
    "UrbanByte Consulting is a boutique digital transformation consultancy founded in 2014, with roughly 180 employees split between its Frankfurt headquarters and a smaller Amsterdam office. It has grown fast — headcount is up about 40% in three years — and IT has scaled reactively to keep pace rather than by design. Externally, UrbanByte markets itself heavily on sustainable digital transformation; several of its own consultants advise other companies on exactly this topic. Internally, its workplace IT has never been audited against that standard.",
  fleet:
    "The fleet: roughly 210 business notebooks (13\" and 14\" class), 90 external monitors and 140 docking stations across both offices, plus a shared printer fleet on each floor. Notebooks are leased on a company-wide contract that Finance negotiated for a flat three-year replacement cycle, applied uniformly regardless of a device's actual condition.",
  role:
    "Your role: you have been asked to do a quiet, evidence-based walkthrough — not to fix anything yet, just to observe. Walk the floor, collect what you find, and build the case.",
} as const;

// ---------------------------------------------------------------------------
// Case story — the same brief, delivered as a narrated sequence instead of a
// wall of text (CURRICULUM-GUIDE §5.1, format C's linear cousin). Art drops
// into /public/story/ under the filenames below; until a file exists the
// player shows a labelled placeholder, so this ships and works without it.
// ---------------------------------------------------------------------------
export const NARRATOR = {
  name: "Nadine Keller",
  role: "Managing Partner, UrbanByte Consulting",
  /** Transparent-background cut-out, roughly waist-up. Optional. */
  portraitSrc: "/story/r1-narrator.png",
} as const;

export type StoryBeat = {
  id: string;
  /** Scene art, 16:9. Missing files degrade to a labelled placeholder. */
  imageSrc: string;
  imageAlt: string;
  /** Short label shown on the progress rail. */
  chapter: string;
  /** Set when the narrator says it; omitted for third-person scene text. */
  speaker?: string;
  text: string;
};

export const CASE_STORY: StoryBeat[] = [
  {
    id: "pitch",
    imageSrc: "/story/r1-01-the-pitch.jpg",
    imageAlt: "A UrbanByte consultant presenting a sustainability roadmap to a client in a bright meeting room",
    chapter: "The pitch",
    speaker: NARRATOR.name,
    text: "We sell sustainable digital transformation. Last month I stood in a client's boardroom and told them to stop replacing laptops every three years. Then their CIO asked what we do ourselves — and I realised I had no idea.",
  },
  {
    id: "growth",
    imageSrc: "/story/r1-02-the-growth.jpg",
    imageAlt: "A busy open-plan consulting office, more desks than the room was designed for",
    chapter: "The growth",
    text: "UrbanByte was founded in 2014. Today it is roughly 180 people, split between a Frankfurt headquarters and a smaller Amsterdam office, and headcount is up about 40% in three years. IT scaled to keep pace — reactively, one purchase order at a time, never by design.",
  },
  {
    id: "fleet",
    imageSrc: "/story/r1-03-the-fleet.jpg",
    imageAlt: "Rows of identical business notebooks, monitors and docking stations laid out like an inventory",
    chapter: "The fleet",
    text: "On paper it looks unremarkable: about 210 business notebooks, 90 external monitors, 140 docking stations, and a shared printer on each floor. Ordinary numbers for a company this size — which is exactly why nobody has ever looked at them closely.",
  },
  {
    id: "contract",
    imageSrc: "/story/r1-04-the-contract.jpg",
    imageAlt: "A leasing contract on a finance desk beside a calendar marked with repeating three-year intervals",
    chapter: "The contract",
    speaker: NARRATOR.name,
    text: "Finance negotiated one leasing contract for the whole fleet: every notebook goes back after three years, whatever condition it is in. At the time it was the simplest option on the table. Nobody asked what it would mean four years later.",
  },
  {
    id: "blindspot",
    imageSrc: "/story/r1-05-the-blind-spot.jpg",
    imageAlt: "Five separate corners of the same office — storage, finance, desks, print station, helpdesk — seen at once",
    chapter: "The blind spot",
    text: "There is no villain in this story. Procurement owns the contract, IT owns the support process, Facilities owns the building, HR owns onboarding — and each of them is doing their job. What nobody owns is the picture all five make together.",
  },
  {
    id: "brief",
    imageSrc: "/story/r1-06-your-brief.jpg",
    imageAlt: "An early-morning office corridor seen from the visitor's point of view, notebook in hand",
    chapter: "Your brief",
    speaker: NARRATOR.name,
    text: "So here is what I need from you. Walk the floor — quietly, before the place fills up. Six areas. Don't fix anything yet, don't tell anyone what to do. Just look, and bring me what you actually find.",
  },
];

// ---------------------------------------------------------------------------
// Six categories — the Stage 1 sorting bins.
// ---------------------------------------------------------------------------
export type CategoryId = "deviceUse" | "replacement" | "peripherals" | "printing" | "userBehaviour" | "support";

export type Category = {
  id: CategoryId;
  label: string;
  /** Permanent caption under the bin label — what belongs here. */
  hint: string;
};

export const CATEGORIES: Category[] = [
  { id: "deviceUse", label: "Device Use", hint: "How devices are actually run day to day: power state, idle time, settings." },
  { id: "replacement", label: "Replacement Cycles", hint: "When and why a device leaves the organisation." },
  { id: "peripherals", label: "Peripherals", hint: "Monitors, docks, keyboards — the hardware around the device." },
  { id: "printing", label: "Printing Behaviour", hint: "Paper use, print defaults, and what the print system permits." },
  { id: "userBehaviour", label: "User Behaviour", hint: "What employees are willing to ask for, accept, or avoid." },
  { id: "support", label: "Support Model", hint: "How IT decides between repair, upgrade and replace." },
];

// ---------------------------------------------------------------------------
// Diagnosis axes — two forced choices per finding, which together place it on
// the 2×2. Deliberately answered as questions first: the quadrant position is
// a consequence of the two answers, never something the learner drags directly.
// ---------------------------------------------------------------------------
export type DriverId = "individual" | "structural";
export type HorizonId = "shortTerm" | "structuralChange";

export const DRIVER_QUESTION = "Is this primarily driven by individual behaviour, or by a management/structural gap?";
export const HORIZON_QUESTION = "Can this be resolved short-term under current policy, or does it need a structural change?";

export const DRIVER_OPTIONS: { id: DriverId; label: string }[] = [
  { id: "individual", label: "Individual behaviour" },
  { id: "structural", label: "Management & structural" },
];

export const HORIZON_OPTIONS: { id: HorizonId; label: string }[] = [
  { id: "shortTerm", label: "Short-term fix" },
  { id: "structuralChange", label: "Structural change needed" },
];

// ---------------------------------------------------------------------------
// Six zones, one finding each. Zone → finding → category is 1:1, so Stage 1's
// sort is a real matching exercise rather than a pile-sorting chore.
// ---------------------------------------------------------------------------
export type ZoneId = "storage" | "finance" | "workspace" | "print" | "helpdesk" | "onboarding";

export type Zone = {
  id: ZoneId;
  letter: string;
  label: string;
  /** One line of scene-setting shown above the finding when the zone opens. */
  scene: string;
};

export const ZONES: Zone[] = [
  { id: "storage", letter: "A", label: "IT Storage Room", scene: "A narrow room behind the server cupboard. Shelves, boxes, and three replacement rounds' worth of hardware nobody has logged." },
  { id: "finance", letter: "B", label: "Finance & Procurement", scene: "Tidy desk, neat folders. The leasing contract and the replacement schedule both live here." },
  { id: "workspace", letter: "C", label: "Open Workspace", scene: "Two floors of consultant desks. You come back at 21:40 on a Thursday to see what is still awake." },
  { id: "print", letter: "D", label: "Print Station", scene: "The shared multifunction printer on each floor, a paper cupboard, and a recycling bin that is fuller than it should be." },
  { id: "helpdesk", letter: "E", label: "IT Helpdesk", scene: "A two-person counter with a shelf of spare notebooks behind it, and a ticket queue on the wall monitor." },
  { id: "onboarding", letter: "F", label: "Onboarding Desk", scene: "Where every new hire meets their equipment for the first time — and learns what \"normal\" looks like here." },
];

export type Finding = {
  id: string;
  zoneId: ZoneId;
  /** The observation as logged in the evidence log. */
  text: string;
  /** Chip-length version of the same finding, for the sort board and the matrix legend. */
  short: string;
  /** Extra colour shown in the scene card only — context, not a classifiable item. */
  context?: string;
  correctCategory: CategoryId;
  categoryClue: string;
  correctDriver: DriverId;
  driverClue: string;
  correctHorizon: HorizonId;
  horizonClue: string;
};

export const FINDINGS: Finding[] = [
  {
    id: "f-peripherals",
    zoneId: "storage",
    text: "31 disconnected docking stations, 14 external monitors and an uncatalogued box of cables from the last three replacement rounds sit in storage. None of it is logged or flagged for reassignment.",
    short: "31 docks + 14 monitors in storage, unlogged",
    context: "Nobody could tell you how long any of it has been there, because nothing records when it arrived.",
    correctCategory: "peripherals",
    categoryClue: "What kind of hardware is this actually about — the notebooks themselves, or everything that plugs into them?",
    correctDriver: "structural",
    driverClue: "Ask who is responsible for tracking what is in that room. Is there such a role at all?",
    correctHorizon: "shortTerm",
    horizonClue: "Could this be changed under existing policy — an inventory and a check before new stock is ordered — or does a contract have to be renegotiated first?",
  },
  {
    id: "f-returns",
    zoneId: "finance",
    text: "The most recent replacement round returned 68 notebooks to the leasing company as \"still fully functional\". Only 4 devices in that same round were flagged for genuine hardware failure.",
    short: "68 working notebooks returned, only 4 failed",
    context: "The lease Finance negotiated sets a flat three-year cycle for the whole fleet, regardless of a device's condition.",
    correctCategory: "replacement",
    categoryClue: "68 working machines left the building. Which of the six areas is about when and why a device leaves at all?",
    correctDriver: "structural",
    driverClue: "Whose decision sent those 68 devices back — and could any individual employee have changed it by behaving differently?",
    correctHorizon: "structuralChange",
    horizonClue: "If the hardware worked, what would have to change for it to be allowed to stay? Check what the answer depends on.",
  },
  {
    id: "f-overnight",
    zoneId: "workspace",
    text: "A facilities audit of badge-out times against overnight network activity found 22% of Frankfurt notebooks stay powered on and undocked through the night and across weekends.",
    short: "22% of notebooks stay awake overnight",
    context: "No fleet-wide power-management profile has ever been configured; each device keeps whatever settings it shipped with.",
    correctCategory: "deviceUse",
    categoryClue: "Nothing here is being bought, retired or repaired — it is about the state a device is left in. Which area covers that?",
    correctDriver: "structural",
    driverClue: "Would this stop happening if every employee simply tried harder — or is there a setting nobody has configured at fleet level?",
    correctHorizon: "shortTerm",
    horizonClue: "Think about what a single device-management policy push could change, without touching any contract.",
  },
  {
    id: "f-duplex",
    zoneId: "print",
    text: "There is no default duplex setting and no print-release authentication. The two floors together print an estimated 40,000 pages a month, with no tracking of paper source.",
    short: "No duplex default · 40,000 pages/month",
    context: "Individual usage on one floor ranges from near-zero to 1,200 pages a month, with no policy explaining the spread.",
    correctCategory: "printing",
    categoryClue: "This one names its own area almost directly — resist reading it as general user behaviour.",
    correctDriver: "structural",
    driverClue: "Is the default setting something each person at the printer controls, or something set once by whoever configured the print system?",
    correctHorizon: "shortTerm",
    horizonClue: "How much would have to change for duplex to become the enforced default tomorrow?",
  },
  {
    id: "f-repairdefault",
    zoneId: "helpdesk",
    text: "IT's informal default is replace-over-repair for any device older than 18 months, because routing a repair ticket takes longer than swapping in a spare — and no documented criteria exist for when a device should be repaired, upgraded or retired.",
    short: "Replace-over-repair default, no written criteria",
    context: "The top ticket type is \"laptop feels slow\" — roughly 60% of those are resolved by clearing browser cache and disabling startup apps, not by replacing hardware.",
    correctCategory: "support",
    categoryClue: "Which area is specifically about how IT chooses between repairing, upgrading and replacing?",
    correctDriver: "structural",
    driverClue: "This is a stated internal default with no written criteria. Can a single technician on shift override it on their own?",
    correctHorizon: "structuralChange",
    horizonClue: "If the rule depends on who is on shift, is there a rule at all — and what has to exist before the default can change?",
  },
  {
    id: "f-refurb",
    zoneId: "onboarding",
    text: "An internal pulse survey found 71% of employees would feel uncomfortable asking for a repaired or refurbished laptop instead of a new one, citing status and perceived performance. New hires are issued a complete new peripheral set by default.",
    short: "71% won't ask for a refurbished device",
    context: "Several employees quietly keep a second monitor taken from the unused peripheral stock — an unofficial reuse workaround that IT neither tracks nor supports.",
    correctCategory: "userBehaviour",
    categoryClue: "Nothing here is a setting or a contract. It is about what people are willing to ask for — which area is that?",
    correctDriver: "individual",
    driverClue: "This one looks purely personal — and for the driver, that reading is defensible. But ask why nobody has ever told employees that refurbished is a sanctioned choice.",
    correctHorizon: "structuralChange",
    horizonClue: "Could a single reminder email change how 71% of people feel about status — or does something more visible have to change first?",
  },
];

// ---------------------------------------------------------------------------
// Stage 3 — pick the two findings to act on first, with a direction each.
// ---------------------------------------------------------------------------
export type DirectionId = "policy" | "process" | "culture";

export const DIRECTIONS: { id: DirectionId; label: string; hint: string }[] = [
  { id: "policy", label: "Policy change", hint: "A written rule, criterion or contract term changes." },
  { id: "process", label: "Process / tooling change", hint: "A workflow or a tool changes; the rules stay as they are." },
  { id: "culture", label: "Communication / culture change", hint: "What people are told, shown, or see leadership do changes." },
];

export const PRIORITY_PICK_COUNT = 2;
export const JUSTIFICATION_MIN_WORDS = 8;

// ---------------------------------------------------------------------------
// Mentor answer keys (passcode-gated). One block per finding covering all three
// of its decisions, so a facilitator has the rejected options' reasoning too.
// ---------------------------------------------------------------------------
export const FINDING_ANSWER_KEYS: Record<string, AnswerKeyBlock> = {
  "f-peripherals": {
    prompt: "Storage room — 31 docks, 14 monitors, uncatalogued",
    items: [
      { option: "Category: Peripherals", verdict: "pick", why: "The hardware in question is everything around the notebook — docks, monitors, cables. No notebook lifecycle decision is described." },
      { option: "Category: Replacement Cycles", verdict: "avoid", why: "Tempting, because the stock arrived through replacement rounds. But the finding is about what happened to the peripherals afterwards, not about when devices are replaced." },
      { option: "Driver: Management & structural", verdict: "pick", why: "No role owns inventory of this room. That is an absent responsibility, not a behaviour." },
      { option: "Driver: Individual behaviour", verdict: "avoid", why: "No individual could fix it by trying harder — there is nowhere to record what they found." },
      { option: "Horizon: Short-term fix", verdict: "pick", why: "An inventory list plus a \"check stock before ordering new\" step needs no contract change and no new policy authority." },
      { option: "Horizon: Structural change needed", verdict: "avoid", why: "Defensible only if you argue the onboarding issue process must change too — but the storeroom itself can be catalogued this month." },
    ],
  },
  "f-returns": {
    prompt: "Finance — 68 functional notebooks returned, 4 failed",
    items: [
      { option: "Category: Replacement Cycles", verdict: "pick", why: "The finding is precisely about when and why devices leave: a fixed cycle, not device condition." },
      { option: "Category: Support Model", verdict: "avoid", why: "The helpdesk did not make this call. The lease term did, before any technician saw the device." },
      { option: "Driver: Management & structural", verdict: "pick", why: "A Finance-negotiated lease term drives it. No employee behaviour is involved at any point." },
      { option: "Driver: Individual behaviour", verdict: "avoid", why: "Nobody chose to return a working laptop — the contract schedule did it automatically." },
      { option: "Horizon: Structural change needed", verdict: "pick", why: "Keeping a healthy device requires the lease to permit condition-based extension and criteria to exist for assessing it. Both must change first." },
      { option: "Horizon: Short-term fix", verdict: "avoid", why: "Nothing in current policy allows a device past the cycle, so there is no short-term action available that is not a contract exception." },
    ],
    teachingNote: "This is the single highest-carbon finding in the set (Block 2: the replacement re-triggers 75–85% of lifetime footprint), yet it is also the slowest to fix. Expect participants to want it as their first action. That is a reasonable instinct — push them to say what interim step they would take while the lease is renegotiated.",
  },
  "f-overnight": {
    prompt: "Open workspace — 22% of notebooks awake overnight",
    items: [
      { option: "Category: Device Use", verdict: "pick", why: "It concerns the state a device is left in, not its purchase, repair or retirement." },
      { option: "Category: User Behaviour", verdict: "avoid", why: "The most common wrong answer. Leaving a machine on is only behaviour if a power profile exists to override — here none was ever configured, so the gap is technical." },
      { option: "Driver: Management & structural", verdict: "pick", why: "No fleet-wide power-management profile exists. That is a missing capability someone must build, not a habit." },
      { option: "Driver: Individual behaviour", verdict: "avoid", why: "Asking 180 people to remember nightly is a weaker and less durable control than one policy pushed from device management." },
      { option: "Horizon: Short-term fix", verdict: "pick", why: "A power profile can be deployed under current policy with no contract or approval change." },
      { option: "Horizon: Structural change needed", verdict: "avoid", why: "Nothing structural blocks it — no lease, criterion or approval path stands in the way." },
    ],
    teachingNote: "Worth naming out loud: this is a use-phase finding, so it moves the 13–15% slice from Block 2. It is the cheapest fix here and the smallest lever — a good illustration that \"easy\" and \"important\" are different axes.",
  },
  "f-duplex": {
    prompt: "Print station — no duplex default, 40,000 pages/month",
    items: [
      { option: "Category: Printing Behaviour", verdict: "pick", why: "The finding names print defaults and paper volume directly." },
      { option: "Category: User Behaviour", verdict: "avoid", why: "The 1,200-page outlier invites this reading, but the absent default and missing print release are system configuration, not personality." },
      { option: "Driver: Management & structural", verdict: "pick", why: "Duplex default and print-release authentication are set once, centrally, by whoever configured the print system." },
      { option: "Driver: Individual behaviour", verdict: "avoid", why: "Individuals vary in usage, but they are choosing inside a system that defaults to single-sided and tracks nothing." },
      { option: "Horizon: Short-term fix", verdict: "pick", why: "Changing a default setting and publishing a usage policy needs no structural change." },
      { option: "Horizon: Structural change needed", verdict: "avoid", why: "Only if print release requires procurement of new hardware — worth acknowledging if a participant raises it, but not what the finding states." },
    ],
  },
  "f-repairdefault": {
    prompt: "Helpdesk — replace-over-repair default, no written criteria",
    items: [
      { option: "Category: Support Model", verdict: "pick", why: "It is explicitly about how IT chooses between repair, upgrade and replacement." },
      { option: "Category: Replacement Cycles", verdict: "avoid", why: "Close, and a good discussion: the lease sets when devices leave on schedule, while this sets what happens when one breaks early. Different decision, different owner." },
      { option: "Driver: Management & structural", verdict: "pick", why: "An undocumented default that varies by who is on shift is a missing rule — the definition of a structural gap." },
      { option: "Driver: Individual behaviour", verdict: "avoid", why: "Technicians are behaving rationally inside a process that makes repair slower than replacement. Fix the process, not the person." },
      { option: "Horizon: Structural change needed", verdict: "pick", why: "Criteria have to be written and the repair routing time addressed before the default can change." },
      { option: "Horizon: Short-term fix", verdict: "avoid", why: "You can publish guidance quickly, but without criteria and a faster repair path the convenient default simply returns." },
    ],
    teachingNote: "The 60%-of-slow-tickets-fixed-by-software detail belongs here: it shows the replace-first default is also a diagnosis gap. If a participant classified this as Device Use because of that detail, that is a thoughtful misread — acknowledge it, then point at who owns the default.",
  },
  "f-refurb": {
    prompt: "Onboarding — 71% uncomfortable asking for refurbished",
    items: [
      { option: "Category: User Behaviour", verdict: "pick", why: "It is about what employees are willing to ask for — not a setting, contract or repair decision." },
      { option: "Category: Peripherals", verdict: "avoid", why: "The new-peripheral-set detail pulls this way, but the finding's substance is the 71% perception figure." },
      { option: "Driver: Individual behaviour", verdict: "pick", why: "The only finding in the set where the individual reading is the honest one: this is a perception held by people." },
      { option: "Driver: Management & structural", verdict: "avoid", why: "Defensible — and worth debating. Nobody ever told employees refurbished is sanctioned, which is a leadership omission. Accept either answer if the reasoning names the missing signal." },
      { option: "Horizon: Structural change needed", verdict: "pick", why: "A perception held by 71% of staff does not move on a reminder email; it needs visible leadership use and a changed onboarding default." },
      { option: "Horizon: Short-term fix", verdict: "avoid", why: "Messaging alone, with onboarding still handing out new kit by default, contradicts itself — and staff read the default, not the message." },
    ],
    teachingNote: "This is the deliberate edge case in the set. Both drivers defend, and the productive answer is \"individual behaviour, structural root cause\" — which is exactly Block 4's point: behaviour is real but it is downstream of a decision nobody made.",
  },
};

/**
 * Stage 1 only needs the mapping, not the full reasoning — a mentor checking a
 * sort board wants one glance. The reasoning behind each one lives in
 * FINDING_ANSWER_KEYS, rendered at the diagnosis stage.
 */
export const CATEGORY_KEY_SUMMARY =
  "A → Peripherals · B → Replacement Cycles · C → Device Use · D → Printing Behaviour · E → Support Model · F → User Behaviour. Each area takes exactly one finding, so a doubled-up area always means another one is empty — point at the empty one rather than naming the right answer.";

export const OVERALL_PATTERN_NOTE =
  "Expected pattern: 5 of 6 findings trace primarily to management/structural gaps; only the refurbished-device perception reads as individual behaviour — and even that one has a structural root cause. Note which quadrant stays empty: nothing here is both individual and short-term. That is the material's core claim made visible — you cannot nudge your way out of a procurement and support-default problem.";

export const PRIORITY_ANSWER_KEY: AnswerKeyBlock = {
  prompt: "Which two findings to act on first",
  items: [
    { option: "Helpdesk repair/replace default (Support Model)", verdict: "pick", why: "Highest leverage per euro: it governs every early-life device decision, and writing criteria costs nothing but decision time. Policy change." },
    { option: "Storage room inventory (Peripherals)", verdict: "pick", why: "Cheapest credible win — an inventory plus a check-stock-first step stops new purchases immediately and proves the programme works. Process/tooling change." },
    { option: "Lease renegotiation (Replacement Cycles)", verdict: "avoid", why: "Biggest carbon impact by far, but it is a contract cycle away. A strong answer may still pick it — if the justification names an interim step while the lease runs." },
    { option: "Overnight power profile (Device Use)", verdict: "avoid", why: "Easy and worth doing, but it addresses the 13–15% use-phase slice. Accept it only when the participant acknowledges it is the smaller lever." },
    { option: "Print defaults (Printing)", verdict: "avoid", why: "Quick and visible, but the smallest footprint effect of the six. Fine as a third action, weak as a first." },
    { option: "Refurbished perception (User Behaviour)", verdict: "avoid", why: "Cannot succeed before the support default and onboarding default change — sequencing makes it a follow-on, not a first move." },
  ],
  teachingNote: "There is no single correct pair. Judge the justification, not the pick: a defensible answer names either impact (which lever it moves) or sequencing (what it unlocks). The weak answer is one that picks two cheap wins and never mentions the replacement cycle at all.",
};

export const JUSTIFICATION_ANSWER_NOTE =
  "A strong justification names the root cause rather than the symptom, and says which decision-maker has to act. Model: \"The replace-first default is why healthy devices leave early, so writing repair/retire criteria — owned by the IT service lead — changes every future device decision, not just this year's.\" Weak: \"This will save money and is good for the environment.\"";

// ---------------------------------------------------------------------------
// Task 1 — copy
// ---------------------------------------------------------------------------
export const TASK1 = {
  kicker: "Task 1",
  heading: "The UrbanByte Walkthrough",
  intro:
    "UrbanByte Consulting is fictional, built so you can apply everything above. Three stages, about 13 minutes: walk the floor and collect evidence, diagnose what each finding really is, then decide what you would act on first. The brief on the right fills in as you go — that is what you export.",
  orderBanner:
    "Suggested order: Stage 1 → 3. Nothing is locked — the report builds itself from whatever you have answered, whichever stage you start with.",
  stage1: {
    heading: "Stage 1 — Walk the floor, then sort what you found",
    instructions: "Open all six zones to collect the evidence, then sort each finding into the area it belongs to.",
    part1: {
      label: "Site walkthrough",
      instructions: "Click each of the six zones on the floor plan. Every zone holds exactly one finding, which is logged to your evidence list automatically.",
      material: ["workplace"] as MaterialSectionId[],
    },
    part2: {
      label: "Sort into the six areas",
      instructions:
        "Drag each finding into the area it belongs to — or tap a finding, then tap an area. One finding per area; every area gets exactly one. Use the clue if you are unsure, and undo/redo freely.",
      material: ["workplace", "servicelife"] as MaterialSectionId[],
    },
  },
  stage2: {
    heading: "Stage 2 — Diagnose each finding",
    instructions:
      "Two questions per finding. Answer both and the finding takes its own position on the matrix — you are not placing dots, you are deciding what the finding is and watching where that lands it.",
    material: ["servicelife", "tradeoffs"] as MaterialSectionId[],
  },
  stage3: {
    heading: "Stage 3 — Decide & export",
    instructions: "Choose the two findings you would act on first, give each a direction, and export the brief.",
    part1: {
      label: "Your first two moves",
      instructions: "Pick exactly two findings, then choose a direction and write one sentence of justification for each.",
      material: ["carbon", "tradeoffs"] as MaterialSectionId[],
    },
    part2: {
      label: "Live brief",
      instructions: "A read-only recap of everything above, and the document it produces — ready to export once every stage is complete.",
    },
  },
  export: {
    docHeading: "Green Workplace Diagnostic",
    filenameLevel: 1,
    filenameTask: 1,
  },
} as const;
