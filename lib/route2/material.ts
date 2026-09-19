/**
 * The four D1–D4 micro-cards — the whole teaching block for Route 2, read
 * once before the task (CLAUDE.md §11a coverage rule): the leadership-
 * instrument reframe (D1), short/medium/structural staging (D2), the five
 * trade-off factors (D3), and the four role lenses (D4) are exactly what the
 * task's five stages use, and nothing in the task depends on Route 1.
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
    sentences: [
      "KPIs, carbon monitoring and reporting only matter if they change what a manager decides, prioritises, or is held accountable for.",
      "A perfect dashboard nobody acts on is documentation, not management — the same distinction Route 1 draws between collecting and managing a single number, read here from the top of the organisation.",
      "The test for any instrument at this level is one question, asked every time: what decision does this change, and who is accountable for making that change happen?",
    ],
    reasoning: [
      "Before recommending any KPI, baseline or report in the task below, name the decision it is meant to change. If you can't name one, the recommendation is documentation, however well built.",
      "\"More visibility\" is not itself a decision — push past it to the actual choice a manager would make differently.",
    ],
    sources: [],
    minutes: 2,
  },
  {
    id: "layeredModel",
    code: "D2",
    n: 2,
    icon: "layers",
    title: "Building a management model in layers",
    standfirst: "Short-term, then medium-term, then structural — staged, not all at once.",
    sentences: [
      "A robust system isn't built all at once. It's staged: a few short-term moves (pick core KPIs, define a pragmatic carbon baseline, assign owners), then a medium-term build-out (a proper dashboard, review cycles, richer emissions data), then structural anchoring — KPIs and carbon monitoring embedded permanently in governance and management reviews.",
      "TerraMetrics IT Operations GmbH, a comparable company, used exactly this pattern when it had scattered metrics and no coordinated system: it didn't chase perfect data first — it staged short-term, medium-term and structural moves around one integrated model.",
      "Skipping a stage is the classic failure: structural governance with no short-term footing underneath it is a committee with nothing yet to govern.",
    ],
    reasoning: [
      "When sequencing any set of moves in the task below, ask what each move depends on. A structural move that depends on data no short-term move has captured yet is out of order.",
      "TerraMetrics' pattern — stage, don't chase perfection — is the one to cite when defending a sequence.",
    ],
    sources: [],
    minutes: 3,
  },
  {
    id: "tradeoffPentagon",
    code: "D3",
    n: 3,
    icon: "radar",
    title: "The senior trade-off: five factors, one allocation",
    standfirst: "No system maximises all five. A management model allocates priority deliberately.",
    sentences: [
      "At this level the trade-off widens from Route 1's three factors to five: accuracy, effort, comparability, external communication, and operational usability.",
      "A very accurate figure that takes too much effort isn't usable day to day. A figure built for external reporting may not be the one operations can act on. No system maximises all five at once.",
      "A management model allocates priority across the five deliberately, and says so — rather than pretending every factor can win.",
    ],
    reasoning: [
      "When defending a trade-off allocation in the task, name which two or three factors you deliberately underweighted, not just which ones you favoured.",
      "External communication and operational usability pull in different directions more often than any other pair — expect to trade one against the other explicitly.",
    ],
    sources: [],
    minutes: 3,
  },
  {
    id: "rolePriorities",
    code: "D4",
    n: 4,
    icon: "person",
    title: "Different roles prioritise differently",
    standfirst: "Same data, four different calls — because each role optimises for a different mandate.",
    sentences: [
      "A CIO, a Head of Sustainability, a Controlling lead and an external Consultant looking at the same data will not make the same call.",
      "The CIO optimises for steering capability — can this actually run the organisation's decisions? The Head of Sustainability optimises for credibility — will this hold up to scrutiny? Controlling optimises for cost and risk control. The Consultant optimises for structural robustness, independent of any one person's judgement.",
      "None of the four is wrong. The task below asks you to pick a lens and hold it, not to average all four into a compromise nobody actually argued for.",
    ],
    reasoning: [
      "When assigning a governance responsibility in the task, ask which of the four mandates it actually serves, then match it to the role whose mandate that is — not to whichever role feels most senior.",
      "A role with no responsibility assigned to it is not automatically a mistake — some roles bring independent challenge rather than day-to-day ownership.",
    ],
    sources: [],
    minutes: 3,
  },
];

export const MATERIAL_INTRO = {
  kicker: "Material · four cards · about 11 minutes",
  title: "What the task needs, and nothing else",
  intro:
    "Four short cards step the view up from managing one metric to steering a whole organisation with them. Together they give you everything the Verdeon proposal below asks for.",
} as const;
