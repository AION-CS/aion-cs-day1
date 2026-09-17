/**
 * Task 1 — the Mercury Office Systems Evidence-Tagging Diagnosis Board.
 * ~15 minutes, Level 1 only (CLAUDE.md §12's Part Two — prioritisation — is a
 * separate, later prompt; nothing here assumes it has happened).
 *
 * One board, six area drop zones, seven evidence chips lifted verbatim from
 * the case. Each chip, once placed, asks for an improvement approach, a
 * root-cause tag (data gap / behavioural pattern / management deficit) and a
 * timeframe tag (short-term / structural). Placement is checked per chip on
 * request: the check never names the correct area, only a clue that sharpens
 * on the second and later checks of the same chip (CLAUDE.md §4). Undo/redo
 * covers every placement change (CLAUDE.md §5) via lib/usePlacementHistory.ts.
 */

import type { AnswerKeyBlock } from "@/lib/answerKey";
import type { IconKey } from "@/lib/routes";

// ---------------------------------------------------------------------------
// Areas — the six-way diagnostic split taught across S1–S4
// ---------------------------------------------------------------------------

export type AreaId = "economic" | "behaviour" | "leadership" | "compliance" | "communication" | "management";

export type Area = {
  id: AreaId;
  name: string;
  icon: IconKey;
  /** One line under the name — what belongs here, never what the answer is. */
  note: string;
  example: string;
};

export const AREAS: Area[] = [
  {
    id: "economic",
    name: "Economic viability",
    icon: "coins",
    note: "Whether the numbers — investment, operating cost, quantified benefit — justify the measure, on any of the three lenses.",
    example: "A proposal is rejected because it never quantifies cost against saving.",
  },
  {
    id: "behaviour",
    name: "User behaviour",
    icon: "person",
    note: "What people actually do day to day — device use, printing, data habits, acceptance of change.",
    example: "Staff keep printing in colour by default despite the new policy.",
  },
  {
    id: "leadership",
    name: "Leadership",
    icon: "target",
    note: "Whether the people already responsible for a rule are visibly following and enforcing it themselves.",
    example: "One manager enforces the new rule with their team; the next quietly lets it slide.",
  },
  {
    id: "compliance",
    name: "Compliance / Regulation",
    icon: "gavel",
    note: "Whether the company can meet an external requirement itself — reporting, procurement, disposal, energy law.",
    example: "Disposal records would not survive an external audit request.",
  },
  {
    id: "communication",
    name: "Communication",
    icon: "link",
    note: "Whether the why behind a rule has actually been stated to the people affected by it, not just assumed.",
    example: "Employees were never told why the new usage rule exists.",
  },
  {
    id: "management",
    name: "Management",
    icon: "gauge",
    note: "Whether anyone has decided, prioritised, resourced or is enforcing consistency across the rest.",
    example: "Everyone agrees the measure is sensible; nobody has set a timeline or named an owner.",
  },
];

export const areaById = (id: AreaId): Area => AREAS.find((a) => a.id === id)!;

// ---------------------------------------------------------------------------
// Root-cause and timeframe tags
// ---------------------------------------------------------------------------

export type RootCause = "dataGap" | "behaviouralPattern" | "managementDeficit";

export const ROOT_CAUSES: { id: RootCause; label: string; hint: string }[] = [
  { id: "dataGap", label: "Data gap", hint: "The numbers, evidence or documentation needed don't exist yet." },
  { id: "behaviouralPattern", label: "Behavioural pattern", hint: "People are predictably doing something that undermines the measure." },
  { id: "managementDeficit", label: "Management deficit", hint: "A decision, priority, timeline, resource or enforcement is missing." },
];

export const rootCauseLabel = (id: RootCause | null): string =>
  ROOT_CAUSES.find((r) => r.id === id)?.label ?? "— not tagged";

export type Timeframe = "shortTerm" | "structural";

export const TIMEFRAMES: { id: Timeframe; label: string; hint: string }[] = [
  { id: "shortTerm", label: "Short-term", hint: "Resolves this one instance." },
  { id: "structural", label: "Structural", hint: "Changes the standard so it can't recur next time." },
];

export const timeframeLabel = (id: Timeframe | null): string =>
  TIMEFRAMES.find((t) => t.id === id)?.label ?? "— not tagged";

// ---------------------------------------------------------------------------
// Fields
// ---------------------------------------------------------------------------

export const AREA_FIELD = {
  label: "Which area does this belong to?",
  instruction: "Sort by where the fix actually belongs, not by which department or word happens to appear in the sentence.",
};

export const ROOT_CAUSE_FIELD = {
  label: "What kind of gap is this, mainly?",
  instruction: "Pick the one that would actually fix it: missing numbers, a predictable habit, or a decision nobody made.",
};

export const TIMEFRAME_FIELD = {
  label: "Short-term fix or structural fix?",
  instruction: "Short-term resolves this one instance. Structural changes the standard so the same gap can't recur.",
};

export const APPROACH_FIELD = {
  label: "Improvement approach",
  instruction: "Be specific to this indication — avoid generic advice like \"communicate better.\"",
  placeholder: "e.g. Steering committee sets a named priority order and a first milestone date within two weeks.",
};

// ---------------------------------------------------------------------------
// The seven evidence chips
// ---------------------------------------------------------------------------

export type ClueTier = { soft: string; sharp: string };

export type Evidence = {
  id: string;
  n: number;
  /** Short handle used in the missing list and the report. */
  short: string;
  /** The indication, verbatim from the case — this is also the chip's full text. */
  text: string;
  correctArea: AreaId;
  correctRootCause: RootCause;
  correctTimeframe: Timeframe;
  /** Clues for the two most plausible wrong areas, tiered soft → sharp. Never names the correct area. */
  wrongClues: Partial<Record<AreaId, ClueTier>>;
  /** Demo answer for the mentor auto-fill. */
  sampleApproach: string;
  answerKey: AnswerKeyBlock;
};

/** Used for a wrong placement outside the two authored clues for that chip. */
export const GENERIC_FALLBACK_CLUE: ClueTier = {
  soft: "Re-read exactly what the sentence says is missing or inconsistent, then match that to the area whose definition covers precisely that gap.",
  sharp: "Don't match on the department or word that stands out — match on the specific thing named as absent. Which area's definition names that exact absence?",
};

export const EVIDENCE: Evidence[] = [
  {
    id: "e1",
    n: 1,
    short: "No priority or timeline",
    text: "The measures are endorsed in principle by management, but none of them has been given clear priority or a timeline.",
    correctArea: "management",
    correctRootCause: "managementDeficit",
    correctTimeframe: "shortTerm",
    wrongClues: {
      leadership: {
        soft: "This isn't about whether someone is modelling the right behaviour — it's about whether a decision has been scheduled at all. Has anyone actually said when this happens?",
        sharp: "Nobody needs to change their own behaviour here — a timeline simply hasn't been set. Which area is about whether a decision, priority or timeline exists in the first place?",
      },
      economic: {
        soft: "Re-read the sentence — does it say a number is missing, or that a decision about priority and timing hasn't been made? Those point to different areas.",
        sharp: "Nothing here is about cost or saving figures. The gap is that the measures were approved \"in principle\" but never scheduled — that's a decision problem, not a numbers problem.",
      },
    },
    sampleApproach: "Steering committee sets a named priority order and a first milestone date for all four measures within the next two weeks.",
    answerKey: {
      prompt: "Evidence 1 — No priority or timeline",
      items: [
        { option: "Management (expected)", verdict: "pick", why: "Endorsed \"in principle\" but never prioritised or scheduled is exactly the absence of a decision that the Management area covers." },
        { option: "Leadership (plausible wrong)", verdict: "avoid", why: "No manager is described as failing to model or enforce anything here — there is simply no decision yet to model." },
        { option: "Economic viability (plausible wrong)", verdict: "avoid", why: "No cost or saving figure is mentioned as missing; the gap is scheduling and priority, not quantification." },
      ],
      teachingNote: "Root cause: Management deficit (a decision was never made). Timeframe: short-term — a steering decision on priority and timeline can be made quickly; it doesn't require changing a standard process, just making the call.",
    },
  },
  {
    id: "e2",
    n: 2,
    short: "Finance's ROI request unmet",
    text: "Finance has asked repeatedly for a clean ROI case for each measure and has not received one that satisfies them — proposals cite \"sustainability benefit\" without quantifying cost or saving.",
    correctArea: "economic",
    correctRootCause: "dataGap",
    correctTimeframe: "structural",
    wrongClues: {
      management: {
        soft: "The trigger isn't that nobody scheduled anything — Finance is actively asking, repeatedly. What exactly do they say is missing from the proposals themselves?",
        sharp: "This is not a missing-decision problem — a decision process is already running (Finance keeps asking). The gap is inside the proposal's content: what it does and doesn't quantify.",
      },
      compliance: {
        soft: "This isn't about an external requirement or an audit — it's about whether the money case adds up internally. Which area covers quantified cost versus saving?",
        sharp: "No regulator or auditor is mentioned here. Read again for who is asking and what they say is missing — it's an internal financial gatekeeper, not a compliance one.",
      },
    },
    sampleApproach: "Finance and the initiative owner co-build one standard ROI template — investment vs. five-year savings — that every proposal must complete before it reaches committee.",
    answerKey: {
      prompt: "Evidence 2 — Finance's ROI request unmet",
      items: [
        { option: "Economic viability (expected)", verdict: "pick", why: "Proposals citing \"sustainability benefit\" without quantified cost or saving is precisely S1's incomplete-business-case pattern." },
        { option: "Management (plausible wrong)", verdict: "avoid", why: "A review process already exists and is running (Finance keeps asking) — what's missing is inside the proposal's numbers, not a missing decision-maker or timeline." },
        { option: "Compliance / Regulation (plausible wrong)", verdict: "avoid", why: "No external requirement, regulator or auditor is named — this is an internal budget-case gap." },
      ],
      teachingNote: "Root cause: Data gap (quantified cost and saving don't exist yet). Timeframe: structural — a repeatable ROI template fixes this for every future proposal, not just the current batch, which is the higher-leverage fix over patching one proposal's numbers.",
    },
  },
  {
    id: "e3",
    n: 3,
    short: "Uneven reaction, no messaging",
    text: "Employees have reacted unevenly to the new usage rules: some comply, some see them as an unnecessary restriction on how they work, and there is no consistent messaging explaining why the rules exist.",
    correctArea: "communication",
    correctRootCause: "behaviouralPattern",
    correctTimeframe: "shortTerm",
    wrongClues: {
      behaviour: {
        soft: "The uneven reaction is what you can observe — but the sentence also tells you why it's happening. What does it say was never given to employees?",
        sharp: "Look past the employee reaction to the second half of the sentence: \"no consistent messaging explaining why.\" That names what's missing, and it isn't a habit.",
      },
      leadership: {
        soft: "This isn't about whether managers are modelling the rule themselves — it's about what was or wasn't explained to employees. Who is the message aimed at here?",
        sharp: "Nothing in this sentence describes a manager's own behaviour. It describes an absent explanation to the workforce — a different area than the one about role-modelling.",
      },
    },
    sampleApproach: "Send one company-wide message from leadership explaining the specific reduction each usage rule achieves and why it was introduced, alongside the rule itself.",
    answerKey: {
      prompt: "Evidence 3 — Uneven reaction, no messaging",
      items: [
        { option: "Communication (expected)", verdict: "pick", why: "\"No consistent messaging explaining why the rules exist\" is exactly S3's Communication success factor, named as absent." },
        { option: "User behaviour (plausible wrong)", verdict: "avoid", why: "The uneven compliance is the visible symptom, but the sentence itself names the cause — a missing explanation — which is a Communication gap, not a habit to fix directly." },
        { option: "Leadership (plausible wrong)", verdict: "avoid", why: "No manager's own rule-following behaviour is described here; the gap is what was (or wasn't) said to employees generally." },
      ],
      teachingNote: "Root cause: Behavioural pattern — the indication itself is a real, observed variance in employee compliance behaviour, even though the fix belongs in Communication. Timeframe: short-term — one clear, company-wide message can close this gap quickly.",
    },
  },
  {
    id: "e4",
    n: 4,
    short: "Managers enforcing inconsistently",
    text: "Department managers are applying the rules inconsistently — some enforce them, others quietly let their teams ignore them, and no one has been told this is inconsistent.",
    correctArea: "leadership",
    correctRootCause: "managementDeficit",
    correctTimeframe: "structural",
    wrongClues: {
      communication: {
        soft: "This isn't about what was said to anyone — it's about what different managers are actually doing, day to day, compared to each other. What varies here?",
        sharp: "No message is described as missing. What's described is inconsistent enforcement between managers — that's about behaviour being modelled (or not), not about something unsaid.",
      },
      management: {
        soft: "This is more specific than a general \"nobody decided\" gap — it's about managers themselves not enforcing the same standard as their peers. Which area is specifically about people in charge modelling a rule?",
        sharp: "A rule and a decision already exist here. What's missing is managers holding themselves to it consistently — that's the role-modelling area, not the general planning one.",
      },
    },
    sampleApproach: "Department heads agree one shared enforcement standard in their next joint meeting, with each manager visibly applying it to their own team first.",
    answerKey: {
      prompt: "Evidence 4 — Managers enforcing inconsistently",
      items: [
        { option: "Leadership (expected)", verdict: "pick", why: "Managers not holding themselves and their teams to the same standard, with nobody flagging it, is exactly S3's Leadership / role-model-effect gap." },
        { option: "Communication (plausible wrong)", verdict: "avoid", why: "Nothing here is about a missing explanation — the rule and its reasoning are presumably already known; what varies is enforcement." },
        { option: "Management (plausible wrong)", verdict: "avoid", why: "This is more specific than an undecided priority or missing timeline — the rule already exists; the gap is managers not modelling it consistently." },
      ],
      teachingNote: "Root cause: Management deficit — nobody is monitoring for or naming the inconsistency across managers, which is itself an oversight gap even though the visible symptom is a Leadership one. Timeframe: structural — a shared, ongoing enforcement standard is needed, not a one-off reminder to two managers.",
    },
  },
  {
    id: "e5",
    n: 5,
    short: "Documentation would fail an audit",
    text: "The compliance/legal team has flagged that the company's current documentation could not withstand an external audit or evidence request related to the new procurement and disposal requirements, but this has been treated as a side issue rather than raised to management as a risk.",
    correctArea: "compliance",
    correctRootCause: "dataGap",
    correctTimeframe: "structural",
    wrongClues: {
      economic: {
        soft: "This isn't about cost or saving — it's about whether documentation would survive an external check. Which area covers evidence for outside requirements?",
        sharp: "No money figure is mentioned anywhere in this sentence. \"Could not withstand an external audit\" is about evidence for a regulator or auditor, not a budget.",
      },
      management: {
        soft: "There is a management failure in this sentence too — being treated as a side issue rather than escalated — but read what the underlying gap actually is first. What wouldn't survive the audit?",
        sharp: "The escalation failure is real but secondary here. The primary, concrete gap named is the documentation itself failing an external check — classify by what's broken, not only by how it was handled afterwards.",
      },
    },
    sampleApproach: "Compliance lead builds an audit-ready documentation trail for procurement and disposal now, rather than waiting for an external request to expose the gap.",
    answerKey: {
      prompt: "Evidence 5 — Documentation would fail an audit",
      items: [
        { option: "Compliance / Regulation (expected)", verdict: "pick", why: "Documentation that \"could not withstand an external audit or evidence request\" is a direct compliance-readiness gap against procurement and disposal requirements." },
        { option: "Management (plausible wrong)", verdict: "avoid", why: "The failure to escalate this as a risk is a real secondary issue, but the primary, concrete gap named is the documentation itself, which is a Compliance/Regulation finding." },
        { option: "Economic viability (plausible wrong)", verdict: "avoid", why: "No cost or saving figure is involved — this is entirely about evidence readiness for an external requirement." },
      ],
      teachingNote: "Root cause: Data gap — the missing thing is a documented evidence trail. Timeframe: structural — a one-off scramble before the next audit repeats the same exposure; the fix is building the trail into the standard process.",
    },
  },
  {
    id: "e6",
    n: 6,
    short: "Regulation seen as IT's paperwork",
    text: "Regulatory requirements around energy and disposal reporting are seen internally as \"extra paperwork imposed on IT\" rather than something the leadership team has taken ownership of.",
    correctArea: "leadership",
    correctRootCause: "managementDeficit",
    correctTimeframe: "structural",
    wrongClues: {
      compliance: {
        soft: "The regulation itself isn't described as unclear or wrong here — re-read who is (or isn't) treating it as their job.",
        sharp: "Nothing here says the reporting requirement is unreasonable or unclear. The gap named is ownership — who at the top is willing to be responsible for it.",
      },
      management: {
        soft: "This is less about scheduling or resourcing a task and more about who at the top is willing to own the topic at all. Which area is specifically about setting the tone from above?",
        sharp: "No timeline or resourcing decision is described as missing. What's described is a perception problem at leadership level — regulation as \"someone else's paperwork\" rather than their own responsibility.",
      },
    },
    sampleApproach: "A named member of the leadership team takes formal ownership of energy and disposal reporting as a standing agenda item, not a delegated IT task.",
    answerKey: {
      prompt: "Evidence 6 — Regulation seen as IT's paperwork",
      items: [
        { option: "Leadership (expected)", verdict: "pick", why: "\"Rather than something the leadership team has taken ownership of\" names an absent role-model/ownership behaviour at the top — a Leadership gap, even though the topic is regulation." },
        { option: "Compliance / Regulation (plausible wrong)", verdict: "avoid", why: "The requirement itself isn't described as unmet or unclear — the gap is who owns responding to it, which is a Leadership question, not a compliance-readiness one." },
        { option: "Management (plausible wrong)", verdict: "avoid", why: "This is about willingness to own the topic at the top, not about an unresourced task or missing timeline lower down the organisation." },
      ],
      teachingNote: "Root cause: Management deficit — ownership was never assigned. Timeframe: structural — this needs a standing ownership arrangement, not a one-off acknowledgement.",
    },
  },
  {
    id: "e7",
    n: 7,
    short: "\"A solution\" without specifying which",
    text: "Management has asked for \"a solution\" without specifying whether that means a business case, a change-management plan, or a compliance fix — leaving the team unsure what to build first.",
    correctArea: "management",
    correctRootCause: "managementDeficit",
    correctTimeframe: "shortTerm",
    wrongClues: {
      leadership: {
        soft: "This isn't about anyone failing to model a behaviour — it's about a request that was never made specific enough to act on. Who needs to make that more specific?",
        sharp: "Nobody is being inconsistent here — there's simply no decision yet about what kind of solution is wanted. That's a decision-and-direction gap, not a role-modelling one.",
      },
      communication: {
        soft: "The team already heard the request clearly enough to know it's ambiguous — so what's missing isn't a message being unclear, it's a decision being unmade. What kind of decision?",
        sharp: "This isn't a case of something never being said — it's that what was said (\"build a solution\") was never turned into a specific, actionable decision. That's about direction-setting, not messaging.",
      },
    },
    sampleApproach: "Management specifies within one week which deliverable is wanted — business case, change-management plan, or compliance fix — so the team can start building the right one.",
    answerKey: {
      prompt: "Evidence 7 — \"A solution\" without specifying which",
      items: [
        { option: "Management (expected)", verdict: "pick", why: "An unspecified ask that leaves the team \"unsure what to build first\" is exactly the missing-decision pattern this area covers." },
        { option: "Leadership (plausible wrong)", verdict: "avoid", why: "No inconsistency in modelled behaviour is described — the gap is a decision that was never made specific, not a standard unevenly enforced." },
        { option: "Communication (plausible wrong)", verdict: "avoid", why: "The request was heard clearly enough to know it's ambiguous; what's missing is a decision about scope, not an explanation of why." },
      ],
      teachingNote: "Root cause: Management deficit (an unmade decision about scope). Timeframe: short-term — management specifying the deliverable type is a single, quick decision, not a process change.",
    },
  },
];

export const evidenceById = (id: string): Evidence => EVIDENCE.find((e) => e.id === id)!;

// ---------------------------------------------------------------------------
// Task framing — rendered verbatim per the build spec (do not paraphrase)
// ---------------------------------------------------------------------------

export const TASK_FRAMING = {
  tag: "THE TASK",
  title: "Mercury Office Systems — Diagnosis Board",
  minutes: 15,
  lead: "Mercury Office Systems has identified several sound Green IT measures — longer device service life, energy-saving usage rules, reduced unnecessary printing, and new procurement requirements. Implementation is stalling anyway.",
  instruction:
    "Read the situation below. Find every indication of why implementation is stalling, classify each one into the right area, and propose a first improvement for each area you identify. This task tests whether you can read an implementation problem correctly — not whether you know a \"correct\" list of measures.",
} as const;

export const CASE_INTRO_PARAGRAPH =
  "Mercury Office Systems is a mid-sized company that has identified several sensible Green IT measures: extending device service life, introducing energy-saving usage rules, reducing unnecessary printing, and adopting new procurement requirements for future hardware purchases.";

export const CASE_INTRO_LEAD_IN = "Despite broad agreement that these measures make sense, implementation keeps stalling:";

export const WORK_ASSIGNMENT: string[] = [
  "Highlight every indication in the case of an economic, behavioural, or regulatory obstacle to implementation.",
  "Classify each indication into one of six areas: Economic viability, User behaviour, Leadership, Compliance/Regulation, Communication, Management.",
  "For each area you've populated, write a first improvement approach (one to two sentences — concrete, not generic).",
  "For each indication, tag whether it stems mainly from a lack of a data basis, a behavioural pattern, or a management deficit.",
  "For each indication, mark whether it can be solved short-term or needs to be anchored structurally.",
];

export const CHECK_LABELS = {
  check: "Check my classification",
  recheck: "Check again",
  holds: "This classification holds up.",
  wrongTier1: "That doesn't hold up yet — here's a first clue.",
  wrongTier2: "Still not quite — a sharper clue, since you've checked this one before.",
  clueLabel: "Need a clue?",
} as const;
