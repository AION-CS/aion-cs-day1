/**
 * Route 2 — Level 3, standalone: the Verdeon Digital Governance Group
 * management proposal. One material block, one task, one export.
 */

export * from "./sections";
export * from "./material";
export * from "./task";

export const LEARNER_NAME_KEY = "learner:name";

export const R2 = {
  name: LEARNER_NAME_KEY,

  roleLens: "r2:roleLens",
  reason: (reasonId: string) => `r2:reason:${reasonId}`,
  relevanceJustification: "r2:relevanceJustification",

  guiding: (decisionId: string) => `r2:guiding:${decisionId}`,
  guidingJustification: (decisionId: string) => `r2:guidingJustification:${decisionId}`,

  sequence: (layerId: string) => `r2:sequence:${layerId}`,
  firstMove: "r2:firstMove",
  checkCountSeq: "r2:checkCountSeq",

  allocation: (factorId: string) => `r2:allocation:${factorId}`,

  responsibilityRole: (responsibilityId: string) => `r2:respRole:${responsibilityId}`,
  checkCountResp: (responsibilityId: string) => `r2:checkCountResp:${responsibilityId}`,
  nowDecision: "r2:nowDecision",
  riskOfWaiting: "r2:riskOfWaiting",
} as const;

/** Prefixes resetSection() must sweep to clear every compound key this route writes. */
export const R2_KEY_PREFIXES = ["r2:"];

export const PAGE_INTRO = {
  tag: "ROUTE 2 — MANAGEMENT DECISION",
  title: "From Metrics to a Management Decision",
  body: "Module 12, Level 3. KPIs, carbon monitoring and reporting only matter once they are reframed as leadership instruments rather than documentation. Four short cards give you that vocabulary — staging a model in layers, the senior five-factor trade-off, and how different roles prioritise differently — then you build a decision-ready management proposal: not a list of metrics, but a decision architecture, defended despite an incomplete picture.",
} as const;

export const ENGAGEMENT = {
  company: "Verdeon Digital Governance Group",
  role: "Head of IT governance / CIO, sustainability, or controlling — your choice of lens",
  heading: "The engagement",
  brief:
    "Verdeon Digital Governance Group already runs real Green IT measures, but there is no consistent KPI system, no practicable carbon logic, no effective review process, and no clear ownership. IT, sustainability, controlling, finance, and management all want different things from the same data.",
  mandate:
    "Budget is limited but management wants visible, credible progress. External reporting requirements are rising. There is a real risk the system becomes too complex to run. Recommend a decision-ready management proposal — a decision architecture, not a metrics list — despite the incomplete picture.",
  deliverable: "You leave with one document: the Verdeon Digital Governance Group Management Proposal.",
} as const;

export const NAME_FIELD = {
  label: "Your name",
  instruction: "Use the same name on every export this week — it is how your submissions are matched.",
  placeholder: "e.g. Jane Muller",
} as const;

/** One export for the whole task. Filename: `1-{name}-day16-l3task1`. */
export const EXPORT = {
  filenameLevels: [3],
  filenameTask: 1,
  docHeading: "Verdeon Digital Governance Group — Management Proposal",
  buttonLabel: "Export as PDF",
} as const;
