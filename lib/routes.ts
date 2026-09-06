/**
 * Day 7 route registry. Each route is its own case study, so unlike a
 * single-case module, there is no shared "CASE" business name here — only
 * the day-level program identity. Route-specific content (e.g. Route 1's
 * GreenStack Hosting case) lives in that route's own lib/routeN.ts.
 *
 * Route 3 is still Day 6's case content (NovaCore), carried over pending its
 * own Day 7 rebuild — same transitional pattern Day 6 itself used while
 * Route 1 was rebuilt before Routes 2/3.
 */

export const CASE = {
  company: "AION Green IT",
  module: "Day 7",
  moduleTitle: "Optimising and Greening Data Centre Operations",
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
    slug: "route-1-foundations",
    href: "/route-1-foundations",
    tag: "Route 1 — Foundations",
    title: "Route 1 — Foundations",
    cardTitle: "Foundations",
    cardBlurb:
      "PUE, renewable-energy accounting, and the EU/German regulatory reality — then audit a sustainability claim that isn't as solid as it looks.",
    deliverable: "Sustainability Claim Audit",
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
      "Four forces in constant tension, a seven-criteria prioritisation framework, and the EU's real disclosure rules — then run a live decision simulator across three funding options.",
    deliverable: "Prioritisation Decision Memo",
    available: true,
  },
  {
    n: 3,
    slug: "route-3-the-boardroom",
    href: "/route-3-the-boardroom",
    tag: "Route 3 — The Boardroom",
    title: "Route 3 — The Boardroom",
    cardTitle: "The Boardroom",
    cardBlurb:
      "No-regret decisions, RACI accountability, and CSRD's 2026 scope — then build a decision-ready proposal a board can actually act on.",
    deliverable: "Board Proposal",
    available: true,
  },
];
