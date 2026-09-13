/**
 * Day 11 route registry.
 *
 * From Day 11 on, a day ships exactly two routes (CLAUDE.md #12,
 * CURRICULUM-GUIDE.md §2): Route 1 carries levels 1 and 2 as one continuous
 * engagement on a single case, Route 2 carries level 3. The `levels` field is
 * what keeps that legible to a mentor — the learner never sees a level
 * boundary inside a route, but the registry, the export filename and the
 * export JSON all still say which objectives a route covers.
 */

export const CASE = {
  company: "AION Green IT",
  module: "Day 11",
  moduleTitle: "Monitoring Software Efficiency & Sustainable Software Architecture",
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
  // Material section and area glyphs used by both routes.
  | "blueprint"
  | "database"
  | "drive"
  | "network"
  | "cycle"
  | "gauge";

export type Route = {
  n: 1 | 2;
  slug: string;
  href: string;
  tag: string; // "Route 1 — Diagnose & Decide"
  title: string; // page H1
  cardTitle: string; // landing card title
  cardBlurb: string; // landing card one-liner
  deliverable: string; // what the route produces
  /** Curriculum levels this route covers. Route 1 spans two; Route 2 spans one. */
  levels: number[];
  /** Roughly how long the whole route takes, material and task together. */
  minutes: number;
  /**
   * Build status, not a progress lock: false only means this route's content
   * hasn't been written yet. Every page that exists stays reachable by URL —
   * no route is ever gated on finishing another one.
   */
  available: boolean;
};

export const ROUTES: Route[] = [
  {
    n: 1,
    slug: "route-1-diagnose-and-decide",
    href: "/route-1-diagnose-and-decide",
    tag: "Route 1 — Diagnose & Decide",
    title: "Route 1 — Diagnose & Decide",
    cardTitle: "Diagnose & Decide",
    cardBlurb:
      "Monitoring read with an efficiency lens, the four bands a load curve divides into, and the architecture levers that move consumption — then one engagement at DataWeave Applications: six signals to diagnose, and one quarter of capacity to spend and defend.",
    deliverable: "DataWeave Engagement Report",
    levels: [1, 2],
    minutes: 90,
    available: true,
  },
  {
    n: 2,
    slug: "route-2-management-decision",
    href: "/route-2-management-decision",
    tag: "Route 2 — Management Decision",
    title: "Route 2 — Management Decision",
    cardTitle: "Management Decision",
    cardBlurb:
      "Why efficiency reaches a board, RACI in full, and deciding before the data is in — then, after the MetricFlow worked example, lead at NexLayer Digital Platforms: rank the guiding decisions, map what they cost, assign ownership, and name the call that cannot wait.",
    deliverable: "Board Memo",
    levels: [3],
    minutes: 80,
    available: true,
  },
];

/** "Levels 1–2" / "Level 3" — mentor-facing label for a route's curriculum scope. */
export function levelLabel(levels: number[]): string {
  if (levels.length === 1) return `Level ${levels[0]}`;
  return `Levels ${levels[0]}–${levels[levels.length - 1]}`;
}
