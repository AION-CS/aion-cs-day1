/**
 * E — The prioritised first measure and why (§7.5). The reasoning model this
 * whole route exists to teach.
 */

import type { MaterialSection } from "@/lib/materialSection";
import type { MaterialSectionId } from "../sections";

export const RECOMMENDATION = {
  statement: "Build a binding architecture and governance framework for network, IoT and 5G decisions first.",
  reasons: [
    "It creates management capability instead of technology expansion.",
    "It reduces the risk of growing complexity, data load and follow-up cost.",
    "It is what makes a robust sustainability and usage assessment possible at all — without criteria, every later evaluation is ad hoc.",
    "It connects innovation, infrastructure and management responsibility in one consistent frame.",
  ],
};

export const SENIOR_HONESTY = {
  cost: {
    label: "What this answer costs",
    text: "It produces no visible innovation in the first quarter. No new application ships, no dashboard lights up, no department gets to announce progress — the entire first-quarter output is a document and an approval process.",
    defend: "Defend it by naming what it prevents, not what it produces: every connectivity decision NetSphere makes without it repeats one of the six dimensions' findings, and the cost of repeating them compounds faster than the cost of the framework.",
  },
  wrongWhen: {
    label: "When this answer would be wrong",
    text: "If an acute operational or compliance problem already exists — a security exposure with a live deadline, a contractual obligation about to be breached — governance-first is a luxury the timeline does not afford.",
    condition: "The condition: an existing, dated obligation that a framework cannot be built fast enough to meet. Absent that condition, 'we need to move fast' is a preference, not a constraint.",
  },
  falsifier: {
    label: "What would falsify it",
    text: "If criteria are defined but no decision is ever refused by them, the framework is decorative.",
    indicator: "The indicator: the count of connectivity proposals refused or materially amended at the gate. Zero after a year is the falsification signal, not a success.",
  },
};

// ---------------------------------------------------------------------------
// SVG #4 — Decision Chain
// ---------------------------------------------------------------------------

export type ChainNode = { id: string; n: number; label: string; breaksWithout: string };

export const DECISION_CHAIN: ChainNode[] = [
  {
    id: "criteria",
    n: 1,
    label: "Criteria defined",
    breaksWithout: "Without this, there is nothing for a gate to test a proposal against — every review becomes a matter of opinion.",
  },
  {
    id: "gate",
    n: 2,
    label: "Approval gate active",
    breaksWithout: "Without this, criteria are a document. A proposal that fails them is approved anyway, because nobody has the standing to say no.",
  },
  {
    id: "qualified",
    n: 3,
    label: "Use cases qualified",
    breaksWithout: "Without this, the gate has nothing specific to apply the criteria to — it approves categories of technology rather than named proposals.",
  },
  {
    id: "prioritised",
    n: 4,
    label: "Investment prioritised",
    breaksWithout: "Without this, qualified use cases still compete for budget on volume or sponsor seniority rather than on the criteria that qualified them.",
  },
  {
    id: "measured",
    n: 5,
    label: "Effect measured",
    breaksWithout: "Without this, nobody can say whether a prioritised investment produced what it promised — the loop never closes.",
  },
  {
    id: "review",
    n: 6,
    label: "Review changes behaviour",
    breaksWithout: "Without this, measurement produces a report nobody acts on — which is functionally identical to not measuring at all.",
  },
];

// ---------------------------------------------------------------------------
// The section
// ---------------------------------------------------------------------------

export const E_MEASURE: MaterialSection<MaterialSectionId> = {
  id: "measure",
  code: "E",
  n: 5,
  icon: "certificate",
  kicker: "E · The reasoning to transfer, not the answer to copy",
  title: "The prioritised first measure, and why",
  standfirst: "Build the framework first. Here is the argument, stated so it can be defended — and so it can be proven wrong.",
  minutes: 16,
  definition:
    "NetSphere's prioritised first measure is to build a binding architecture and governance framework for network, IoT and 5G decisions before any further connectivity expansion. The justification rests on four claims: it creates management capability rather than technology expansion, it reduces the risk of growing complexity and follow-up cost, it is the precondition for any robust sustainability assessment, and it connects innovation, infrastructure and management responsibility in one frame rather than three separate conversations.",
  insight:
    "A recommendation is only as strong as its honesty about what it does not do. Three admissions make this one defensible rather than merely assertive: it costs a quarter of visible innovation, which has to be named and defended to a board that expects progress; it would be the wrong call if an acute, dated problem already existed, which has to be checked rather than assumed away; and it has a stated falsification condition — zero refused proposals after a year — that converts it from an opinion into a claim someone can hold NetSphere to.",
  takeaway:
    "Do not transfer this conclusion to a different company. Transfer the structure: a recommendation stated as a decision, four reasons stated as claims rather than adjectives, and three honest admissions — the cost, the condition under which the answer flips, and the observable signal that would prove it wrong. The Decision Chain below is the mechanism the recommendation puts in place; trace what breaks at each node if it is missing, because that is the argument for why the sequence matters, not only the first step.",
  body: [
    {
      heading: "Why this beats the alternative that feels more productive",
      paragraphs: [
        "The visible alternative — proceeding with the planned network, IoT and 5G expansion while addressing governance later — produces demonstrable activity this quarter and defers exactly the question in section C that rated highest: governance. Every month of deferral is a month in which new connectivity decisions are made under the same absent criteria, which is not neutral — it is the six-dimension pattern reproducing itself in real time while the framework that would stop it is still being drafted.",
        "The framework-first answer is not the more exciting quarter. It is the answer that stops NetSphere funding its own next audit finding.",
      ],
    },
  ],
  reasoning: [
    "This is the reasoning model the Vertex task explicitly asks you not to copy verbatim — but the four-part justification structure and the three honest admissions are exactly what your own first-measure argument needs, whichever of the five Vertex options you choose.",
    "Trace the Decision Chain against your own recommendation: name which node your chosen measure builds, and what would break if the node before it were missing.",
    "The falsifier here — zero refusals after a year — is the pattern your own justification's review point should follow: an observable count, not a feeling.",
  ],
  callout: {
    label: "The senior-level tell",
    text: "A confident recommendation with no stated cost, no stated wrong-condition and no stated falsifier is not more senior — it is less checkable.",
  },
  references: [
    {
      label: "Falsification condition and review point",
      detail: "The recommendation's third admission is the transferable pattern: name the indicator and the date that would prove you wrong.",
    },
  ],
};
