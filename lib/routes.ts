/**
 * Day 14 route registry.
 *
 * Module 10: Route 1 covers Level 1 ("Implementing Sustainability
 * Economically and in Line with Regulation") at Mercury Office Systems.
 * Route 2 merges Levels 2 and 3 into one route, one task in two parts
 * (Prioritise → Propose) at Valora Digital Operations, per CLAUDE.md §13's
 * "Format 2" pattern for a route too lean to split into two full routes.
 */

export const CASE = {
  company: "AION Green IT",
  /** Curriculum day number. The export filename reads it (CURRICULUM-GUIDE.md §7). */
  day: 14,
  module: "Day 14",
  moduleNumber: 10,
  moduleTitle: "Implementing Sustainability Economically and in Line with Regulation",
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
  // Material section and area glyphs used across days.
  | "blueprint"
  | "database"
  | "drive"
  | "network"
  | "cycle"
  | "gauge"
  // Day 12: radio access and connected devices.
  | "antenna"
  | "sensor"
  // Day 13: the six-area diagnostic framework's User Behaviour tile.
  | "person";

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
      "The Green IT business case and why it decides whether measures survive, why ROI is not only a financial number, why technical solutions fail without behavioural change, and regulation as a management framework rather than a compliance burden — then Mercury Office Systems: classify seven indications of stalled implementation by area, root cause and timeframe.",
    deliverable: "Mercury Office Systems Diagnosis Report",
    levels: [1],
    minutes: 75,
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
      "The four criteria that decide which measure-line gets funded first, and the two questions that turn a priority into an actionable proposal under incomplete data — then Valora Digital Operations: score three measure-lines, choose one, and propose it.",
    deliverable: "Valora Digital Operations Priority Proposal",
    levels: [2, 3],
    minutes: 65,
    available: true,
  },
];

/** "Levels 1–2" / "Level 3" — mentor-facing label for a route's curriculum scope. */
export function levelLabel(levels: number[]): string {
  if (levels.length === 1) return `Level ${levels[0]}`;
  return `Levels ${levels[0]}–${levels[levels.length - 1]}`;
}
