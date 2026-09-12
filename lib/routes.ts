/**
 * Day 10 route registry. Each route is its own case study, so unlike a
 * single-case module, there is no shared "CASE" business name here — only
 * the day-level program identity. Route-specific content (e.g. Route 1's
 * AppNexa Solutions case) lives in that route's own lib/routeN.ts.
 */

export const CASE = {
  company: "AION Green IT",
  module: "Day 10",
  moduleTitle: "Energy-Efficient Software & Green Coding Principles",
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
  | "layers"
  // Day 10 additions — one glyph per inefficiency category (Route 1, Section E).
  | "blueprint"
  | "database"
  | "drive"
  | "network"
  | "cycle"
  | "gauge";

export type Route = {
  n: 1 | 2 | 3;
  slug: string;
  href: string;
  tag: string; // "Route 1 — Foundations"
  title: string; // page H1
  cardTitle: string; // landing card title
  cardBlurb: string; // landing card one-liner
  deliverable: string; // what the route produces
  /**
   * Build status, not a progress lock: false only means this route's Day 10
   * content hasn't been written yet. Every page that exists stays reachable by
   * URL — no route is ever gated on finishing another one.
   */
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
      "Why software has a carbon footprint at all, how SCI measures it, and the six places inefficiency hides — then trace AppNexa's live system and diagnose six flagged behaviours without reading a line of code.",
    deliverable: "Diagnosis Report",
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
      "One quarter, limited capacity, three defensible places to spend it and no telemetry to prove which is best — predict each option's profile across seven decision dimensions, then commit and defend the call.",
    deliverable: "Prioritization Memo",
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
      "Read how SoftPulse solved it, then lead: rank CodeVista's guiding decisions, map them for momentum cost against structural impact, assign a RACI that survives contact with a board, and make a call before the data is in.",
    deliverable: "Board Memo",
    available: true,
  },
];
