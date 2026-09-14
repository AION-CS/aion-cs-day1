/**
 * The route's framing copy: the opener (§7.0), the rubric preview (§7.7) and
 * the reflection-journal seed questions (§7.8). None of these three is a full
 * MaterialSection — the opener has no reasoning rules of its own, and neither
 * the rubric nor the reflection journal is content a task step would cite as
 * its basis — so they render alongside the six MaterialBlocks rather than
 * inside SECTION_ORDER, the same way Route 1 treats its glossary strip.
 */

export const OPENER = {
  paragraphs: [
    "Before you write your own proposal, walk through how a senior advisor reasons from scattered technical facts to one defensible first move.",
    "NetSphere Industrial Systems GmbH is expanding its digital infrastructure across production, logistics and building management: a more modern network design, a large number of new IoT sensors, and 5G for mobile and latency-critical applications. Management expects efficiency, transparency and innovation advantage. Nobody has yet quantified the additional infrastructure cost, the rising data volumes, the device lifecycles or the long-term operating load.",
    "This section shows the full reasoning chain — including the recommended decision and why it beats the alternatives. Study the structure of the argument, not the conclusion. The conclusion belongs to NetSphere. Your task afterwards belongs to a different company with different constraints.",
  ],
  selfContained: {
    label: "Self-contained guarantee",
    text: "Every concept used in this route — baseline power, load-adaptive operation, legacy sunset, embodied vs operational emissions, measurement boundary, rebound effect, enabling effect, device support period, lifecycle criteria — is explained inside this route, in the Concept expanders on the infrastructure map. A learner arriving here first is not disadvantaged.",
  },
};

export const RUBRIC = {
  kicker: "G · How senior work gets judged",
  title: "The rubric you will be measured against",
  intro: "Five questions frame how the Vertex task is read. They apply to what you write next, not to anything above.",
  items: [
    "Was the core problem identified as a technology, a data or a management question?",
    "Which first measure was prioritised, and why?",
    "Were network efficiency, IoT lifecycle and 5G meaningfully connected — or treated as three separate topics?",
    "Was the argument action-capable under uncertainty (assumption, falsification, review point)?",
    "Was short-term innovation pressure cleanly separated from long-term structural effect?",
  ],
  provocationsLabel: "Four questions worth sitting with",
  provocations: [
    "Which decision improves not only technology introduction, but future leadership capability regarding connected infrastructure?",
    "Where would a quickly visible innovation measure still be too weak from a management point of view?",
    "What risks arise if IoT and 5G expand without lifecycle and governance logic?",
    "Which decision would be defensible from the perspective of a CIO, CTO, network architect or consultant?",
  ],
};

export const REFLECTION = {
  kicker: "H · Reflection journal",
  title: "Before you move on — four questions for yourself",
  intro: "Personal, non-graded. Never validated, never in the missing-items list, and never exported unless you choose to include it.",
  questions: [
    { id: "q1", label: "Where is connectivity in my organisation treated as progress without assessing system effects?" },
    { id: "q2", label: "Which IoT or 5G applications probably generate more complexity and energy demand than benefit?" },
    { id: "q3", label: "Which measure would be innovative in the short term but strategically too weak?" },
    { id: "q4", label: "What would a head of department, architect, CTO or consultant prioritise differently from a purely technology-driven implementer?" },
  ],
  helper: "Write for yourself. This is not exported with your memo unless you tick the box below.",
  includeLabel: "Include reflection journal as an appendix in my export",
};
