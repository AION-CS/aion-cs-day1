/**
 * Day 9 route registry. Each route is its own case study, so unlike a
 * single-case module, there is no shared "CASE" business name here — only
 * the day-level program identity. Route-specific content (e.g. Route 1's
 * UrbanByte case) lives in that route's own lib/routeN.ts.
 */

export const CASE = {
  company: "AION Green IT",
  module: "Day 9",
  moduleTitle: "Green Workplace & Extending Device Lifetimes",
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
  tag: string; // "Route 1 — Knowledge"
  title: string; // page H1
  cardTitle: string; // landing card title
  cardBlurb: string; // landing card one-liner
  deliverable: string; // what the route produces
  /**
   * Build status, not a progress lock: false only means this route's Day 9
   * content hasn't been written yet. Every page stays reachable by URL — no
   * route is ever gated on finishing another one.
   */
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
      "Where a device's carbon actually sits, the gap between technical and permitted service life, and what makes longevity realistic — then walk UrbanByte's offices and build the evidence case.",
    deliverable: "Green Workplace Diagnostic",
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
      "Weighted scoring under contested evidence: rank three competing measures for a 1,240-person engineering firm, with one budget, a security ceiling and two industry sources that disagree.",
    deliverable: "Prioritisation Decision Memo",
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
      "Design the architecture, not another list: build a repair-vs-retire rule with real thresholds, test it against eight devices, assign accountability, and defend it to a board.",
    deliverable: "Management Decision Architecture",
    available: true,
  },
];
