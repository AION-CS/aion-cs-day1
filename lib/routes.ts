/**
 * Day 8 route registry. Each route is its own case study, so unlike a
 * single-case module, there is no shared "CASE" business name here — only
 * the day-level program identity. Route-specific content (e.g. Route 1's
 * Flexora case) lives in that route's own lib/routeN.ts.
 */

export const CASE = {
  company: "AION Green IT",
  module: "Day 8",
  moduleTitle: "Cloud Sustainability — From Knowledge to Board-Ready Decisions",
} as const;

/** Icon keys resolved by components/icons/LineIcons.tsx. */
export type IconKey =
  | "coins"
  | "factory"
  | "recycleLoop"
  | "gavel"
  | "supplier"
  | "shield"
  | "target"
  | "certificate"
  | "link"
  | "layers";

export type Route = {
  n: 1 | 2 | 3;
  slug: string;
  href: string;
  tag: string; // "Route 1 — The Audit"
  title: string; // page H1
  cardTitle: string; // landing card title
  cardBlurb: string; // landing card one-liner
  deliverable: string; // what the route produces
  available: boolean;
};

export const ROUTES: Route[] = [
  {
    n: 1,
    slug: "route-1-knowledge",
    href: "/route-1-knowledge",
    tag: "Route 1 — Knowledge",
    title: "Route 1 — Knowledge",
    cardTitle: "Knowledge",
    cardBlurb:
      "Cloud fundamentals, the economies-of-scale efficiency argument, and the six recurring pitfalls — then audit a growing company's cloud plans against the evidence.",
    deliverable: "Cloud Decision Audit Brief",
    available: true,
  },
  {
    n: 2,
    slug: "route-2-application",
    href: "/route-2-application",
    tag: "Route 2 — Application",
    title: "Route 2 — Application",
    cardTitle: "Application",
    cardBlurb:
      "The FinOps cycle, a seven-dimension assessment model, and the case for governance as a multiplier — then score three courses of action and defend one under real uncertainty.",
    deliverable: "Prioritization Decision Memo",
    available: true,
  },
  {
    n: 3,
    slug: "route-3-management-decision",
    href: "/route-3-management-decision",
    tag: "Route 3 — Management Decision",
    title: "Route 3 — Management Decision",
    cardTitle: "Management Decision",
    cardBlurb:
      "The Decision Architecture model, levers vs. symptoms, and horizon sequencing — then diagnose SkyBridge and build Helix's board-ready proposal.",
    deliverable: "Management Proposal",
    available: true,
  },
];
