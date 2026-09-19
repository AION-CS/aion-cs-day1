/**
 * Route 2's material: four micro-cards, D1–D4, about 15 minutes — the whole
 * teaching block for Task 3, read in full before the builder starts.
 *
 * Coverage rule (CLAUDE.md §11a): the four assessment criteria Task 3's
 * element 3 must reference (benefit, resource/load, strategic viability,
 * controllability) are named in D2; the six canvas blocks are all introduced
 * across D1 and D3; governance roles and the propose→assess→approve/park→
 * review loop are taught in D3; the short/medium/structural split the horizon
 * classifier uses is taught, with concrete examples, in D4.
 */

import type { MicroCard } from "@/lib/materialSection";
import type { MaterialSectionId } from "./sections";

export const MATERIAL: MicroCard<MaterialSectionId>[] = [
  {
    id: "architecture",
    code: "D1",
    n: 1,
    icon: "network",
    title: "From separate projects to a decision architecture",
    standfirst: "A pile of sensible initiatives is not the same thing as a strategy.",
    sentences: [
      "The failure mode at this level is a pile of disconnected initiatives — an AI pilot here, a recycling scheme there — each sensible alone but adding up to symbolic politics and rebound rather than strategy (C1, C9).",
      "The senior move is to build an integrated innovation and assessment framework that channels every initiative through the same logic before any individual technology gets scaled.",
      "That framework is not one more project alongside AI use, the innovation portfolio, circular economy, investment logic, governance and management review — it is the thing that routes all of them.",
    ],
    reasoning: [
      "When building the decision architecture in Task 3, treat every block as something that must connect to at least one other block. An unconnected block is exactly the scattered-initiative pattern this card warns against.",
      "A framework that only routes AI initiatives, or only circular ones, is not integrated — it has to route the whole portfolio.",
    ],
    sources: [],
    minutes: 4,
  },
  {
    id: "assessmentLogic",
    code: "D2",
    n: 2,
    icon: "funnel",
    title: "Assessment logic: how initiatives get judged",
    standfirst: "The four criteria Task 3's decision logic must name — no fifth substitute allowed.",
    sentences: [
      "A framework needs explicit criteria. Judge each initiative on real benefit, resource and load effect, strategic viability, and controllability — not on novelty or enthusiasm (C1, C9).",
      "This is what turns \"interesting idea\" into \"prioritised decision,\" and it is disclosable under sustainability governance expectations: CSRD and ESRS E1 link strategy, governance, and climate or resource impact into one reporting obligation, so an ad-hoc assessment process is itself a governance gap.",
      "A funnel is the right mental model: many initiatives enter, four filters test each one, and only a few prioritised decisions come out the other end.",
    ],
    reasoning: [
      "Task 3's element 3 (decision logic) must name all four criteria by these terms — benefit, resource/load, strategic viability, controllability — not a rebranded subset.",
      "\"Novelty\" or \"how exciting it looks\" is explicitly not one of the four. If a criterion reduces to enthusiasm, it has failed this card's test.",
    ],
    sources: [{ label: "CSRD / ESRS E1", detail: "Links corporate sustainability strategy, governance and climate/resource impact into one disclosure obligation." }],
    minutes: 4,
  },
  {
    id: "governance",
    code: "D3",
    n: 3,
    icon: "gavel",
    title: "Governance and investment logic",
    standfirst: "Every decision needs an owner, an approval path, and a way back to the table.",
    sentences: [
      "Decisions need owners, approval logic, and review mechanisms — who proposes, who signs off, how it gets revisited. Without all three, an assessment framework is a document, not a process.",
      "Investment logic means judging cost, payback, and follow-on burden under uncertainty (C6), and anchoring choices in portfolio and management reviews rather than in whichever department pushed hardest this quarter.",
      "The governed loop has four stages: propose → assess → approve or park → review. Each stage has its own role and its own question.",
    ],
    reasoning: [
      "Task 3's element 6 (roles, responsibilities, approval logic, review mechanisms) must cover all four loop stages, not just \"who approves.\"",
      "Standards to anchor investment and management-system rigor: ISO 50001 (energy management systems) and ISO 20400 (sustainable procurement) — cite the one that matches the initiative type rather than both by default.",
    ],
    sources: [
      { label: "ISO 50001", detail: "Energy management system standard — the review-and-continual-improvement loop this card's fourth stage borrows from." },
      { label: "ISO 20400", detail: "Sustainable procurement guidance — relevant wherever governance touches purchasing decisions." },
    ],
    minutes: 4,
  },
  {
    id: "horizons",
    code: "D4",
    n: 4,
    icon: "clock",
    title: "Time horizons: short, medium, structural",
    standfirst: "Not every measure lands at once — and a proposal that is all one horizon is a warning sign.",
    sentences: [
      "Short-term: define assessment criteria, create transparency, make a first prioritisation — decisions, not deployments.",
      "Medium-term: pilot selected AI or circularity initiatives under the criteria from D2; build the first take-back or refurbishment loops.",
      "Structural: anchor sustainable-innovation assessment in portfolio decisions, governance, and management reviews (D3) — the point where the framework stops depending on any one champion.",
    ],
    reasoning: [
      "Every one of a learner's own measures in Task 3 must land in exactly one of these three bands — never left unclassified, and a proposal where every measure lands in the same band should read as a structural gap.",
      "\"Build the framework first, then scale individual initiatives\" is the ordering rule across all three bands, not a one-off tip — a structural anchor with no short-term first step is exactly the disconnected-good-intentions failure D1 describes.",
    ],
    sources: [],
    minutes: 3,
  },
];

export const MATERIAL_INTRO = {
  kicker: "Material · four cards · about 15 minutes",
  title: "One decision architecture, not a list of ideas",
  intro:
    "Read this before the case below. Four cards: why disconnected initiatives fail even when each one is sensible, the four criteria that turn enthusiasm into a prioritised decision, the governance loop that makes a decision durable, and the three time horizons a robust proposal has to cover. Everything Task 3 asks for is here.",
} as const;

/** A read-only worked example inside the material — a different company from the one Task 3 assesses (CURRICULUM-GUIDE.md §2). */
export const WORKED_EXAMPLE = {
  company: "CircularMind Digital Systems GmbH",
  heading: "Worked example — read only",
  body: "CircularMind ran three sensible initiatives at once — an AI load-balancing pilot, a device take-back trial, and a new ESG-reporting product — each approved on its own merits by a different sponsor. None was assessed against the others. Eighteen months in, the AI pilot's compute bill had quietly outgrown its savings, the take-back trial had no criteria for which devices to prioritise, and the reporting product's governance sat with whichever team built it, not with anyone accountable for the numbers it published. The lesson management drew was not \"pick better initiatives\" — it was build the assessment framework first, then scale individual initiatives. Every initiative that came after the framework went live was cheaper to evaluate and faster to kill or fund.",
} as const;
