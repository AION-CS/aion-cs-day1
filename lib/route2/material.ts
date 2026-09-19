/**
 * The four D1–D4 micro-cards — the whole teaching block for Route 2, read
 * once before the task (CLAUDE.md §11a coverage rule): the leadership-
 * instrument reframe (D1), short/medium/structural staging plus the eight
 * twelve-month decisions the task offers (D2), the five trade-off factors
 * (D3), and the four role lenses plus the four responsibilities the task hands
 * out (D4). Nothing in the task depends on Route 1.
 *
 * What stays on screen per card: a one-line standfirst, the live diagram and a
 * short `definition`. Decision rules, depth and sources sit behind Read more.
 * Practice cases inside the diagrams are deliberately not Verdeon.
 */

import type { MicroCard } from "@/lib/materialSection";
import type { MaterialSectionId } from "./sections";

export const MATERIAL: MicroCard<MaterialSectionId>[] = [
  {
    id: "leadershipInstrument",
    code: "D1",
    n: 1,
    icon: "clipboard",
    title: "Metrics as leadership instruments, not documentation",
    standfirst: "A perfect dashboard nobody acts on is documentation, not management.",
    definition: [
      "A leadership instrument is a KPI, carbon figure or report that changes what a manager decides, prioritises or is held accountable for. Documentation records what happened and changes nothing.",
      "The test for any instrument is one question, asked every time: what decision does this change, and who is accountable for making that change happen?",
      "It is the difference between collecting a number and managing with it, read here from the top of the organisation.",
    ],
    reasoning: [
      "Before recommending any KPI, baseline or report in the task, name the decision it is meant to change. If you can't name one, the recommendation is documentation, however well built.",
      "“More visibility” is not itself a decision — push past it to the actual choice a manager would make differently, and name who makes it.",
    ],
    readMoreHint: "decision rules, why documentation still matters, sources",
    more: [
      {
        heading: "Documentation is not worthless",
        paragraphs: [
          "Reports and baselines are often legally required — the CSRD and ESRS demand audited climate figures, and the EU Energy Efficiency Directive asks larger companies for energy management. Documentation keeps an organisation compliant. It only becomes management when a decision and an accountable person are attached to the same figure.",
        ],
      },
      {
        heading: "Visibility is not a decision",
        paragraphs: [
          "“Make the numbers visible” is a common goal and a weak one on its own: a number can be seen by everyone and still change nothing. The useful version of the goal names who will see it, what they will decide differently, and when.",
        ],
      },
    ],
    sources: [
      { label: "Directive (EU) 2022/2464 (CSRD) — EUR-Lex", url: "https://eur-lex.europa.eu/eli/dir/2022/2464/oj" },
      { label: "Directive (EU) 2023/1791 (Energy Efficiency) — EUR-Lex", url: "https://eur-lex.europa.eu/eli/dir/2023/1791/oj" },
    ],
    minutes: 2,
  },
  {
    id: "layeredModel",
    code: "D2",
    n: 2,
    icon: "layers",
    title: "Building a management model in layers",
    standfirst: "Short-term, then medium-term, then structural — each layer needs the one before it.",
    definition: [
      "A management model is built in three layers, in order. Short-term: pick core KPIs, define a pragmatic carbon baseline, assign owners. Medium-term: a proper dashboard, review cycles, richer emissions data. Structural: KPIs and carbon monitoring embedded permanently in governance and management reviews.",
      "Each layer depends on what the one before it produced. Skipping a layer leaves the next one with nothing to work on — structural governance with no short-term footing is a committee with nothing yet to govern.",
      "The eight twelve-month decisions the task offers are defined, with when to use each, in this card's Read more.",
    ],
    reasoning: [
      "When sequencing any set of moves in the task, ask what each move depends on. A structural move that depends on data no short-term move has captured yet is out of order.",
      "Stage, don't chase perfection: the comparable company in the worked example did not wait for perfect data — that pattern is the one to cite when defending a sequence.",
      "For the twelve-month decisions, ask of each: what does it need to be in place first, and what does it leave unaddressed? Pick the ones that build footing without committing budget ahead of governance.",
    ],
    readMoreHint: "decision rules, the eight twelve-month decisions defined, the worked example",
    more: [
      {
        heading: "Why not everything at once",
        paragraphs: [
          "A full carbon build, a dashboard and a governance framework launched together compete for the same people and budget, and none is ready to use the others' output. Staging lets each layer prove its value and gives management something visible early.",
        ],
      },
    ],
    sources: [{ label: "GHG Protocol — Corporate Standard", detail: "the basis for a pragmatic baseline", url: "https://ghgprotocol.org/corporate-standard" }],
    minutes: 3,
  },
  {
    id: "tradeoffPentagon",
    code: "D3",
    n: 3,
    icon: "radar",
    title: "The senior trade-off: five factors, one allocation",
    standfirst: "No system maximises all five. A management model allocates priority deliberately.",
    definition: [
      "Five factors compete for priority in any management model. Accuracy: how closely a figure reflects reality. Effort: how much work it takes to produce and keep up. Comparability: whether it lines up across sites, teams and time. External communication: whether it survives disclosure and audit. Operational usability: whether operations can act on it day to day.",
      "No system maximises all five at once. A management model allocates priority across them deliberately — and says which ones it underweighted.",
    ],
    reasoning: [
      "When defending a trade-off allocation in the task, name which two or three factors you deliberately underweighted, not just which ones you favoured.",
      "External communication and operational usability pull in different directions more often than any other pair — expect to trade one against the other explicitly.",
      "Giving “effort” priority means keeping the work low, so it competes with accuracy and with external communication, which both add work.",
    ],
    readMoreHint: "decision rules, how the five pull against each other, sources",
    more: [
      {
        heading: "How the pairs pull",
        paragraphs: [
          "Accuracy and effort: a more precise figure takes more work to produce and to keep up. External communication and usability: a figure built to survive an audit is not always the one operations can act on. Comparability and usability: forcing one definition on every site helps comparison but may not fit how each site works. External communication and effort: audit-ready evidence needs documentation, and that is ongoing work.",
        ],
      },
    ],
    sources: [{ label: "Delegated Regulation (EU) 2023/2772 (ESRS) — EUR-Lex", detail: "what external reporting will ask of figures", url: "https://eur-lex.europa.eu/eli/reg_del/2023/2772/oj" }],
    minutes: 3,
  },
  {
    id: "rolePriorities",
    code: "D4",
    n: 4,
    icon: "person",
    title: "Different roles prioritise differently",
    standfirst: "Same data, four different calls — because each role optimises for a different mandate.",
    definition: [
      "A CIO, a Head of Sustainability, a Controlling lead and an external Consultant looking at the same data will not make the same call, because each optimises for a different mandate.",
      "The CIO optimises for steering capability. The Head of Sustainability for credibility under scrutiny. Controlling for cost and risk control — the routine processes that collect, reconcile and release figures. The Consultant for structural robustness, independent of any one person's judgement.",
      "None of the four is wrong. The task asks you to pick a lens and hold it, and to hand each responsibility to the role whose mandate it serves. The four responsibilities are defined in this card's Read more.",
    ],
    reasoning: [
      "When assigning a governance responsibility in the task, ask which of the four mandates it actually serves, then match it to the role whose mandate that is — not to whichever role feels most senior.",
      "A role with no responsibility assigned to it is not automatically a mistake — some roles bring independent challenge rather than day-to-day ownership.",
      "Ask what goes wrong if the wrong role holds it: the consequence line under each choice in the task says so.",
    ],
    readMoreHint: "decision rules, each role and when to use it, the four responsibilities defined",
    more: [],
    sources: [],
    minutes: 3,
  },
];

export const MATERIAL_INTRO = {
  kicker: "Material · four cards · about 11 minutes",
  title: "What the task needs, and nothing else",
  intro: "Four short cards step the view up from managing one metric to steering a whole organisation with them.",
} as const;
