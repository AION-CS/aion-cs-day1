/**
 * Day 13 route registry.
 *
 * Module 9, Day 1 of 1: two routes, same shape as Day 11 on (CLAUDE.md §12).
 * Route 1 carries levels 1 and 2 as a single triage-escalate-deep-dive
 * engagement ("ProcessNova Services"), not a two-part diagnose-then-decide
 * one — see lib/route1/sections.ts for why. Route 2 carries level 3 alone
 * ("Synervia Process Group"). The `levels` field keeps that legible to a
 * mentor: the export filename and JSON both say which objectives a route
 * covers.
 */

export const CASE = {
  company: "AION Green IT",
  /** Curriculum day number. The export filename reads it (CURRICULUM-GUIDE.md §7). */
  day: 13,
  module: "Day 13",
  moduleNumber: 9,
  moduleTitle: "Designing Sustainable Digital Processes",
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
      "Digitalisation as a sustainability lever, direct vs. indirect impact, the rebound effect and the trade-offs it forces, and the six-area framework that sorts a finding before it can be acted on — then ProcessNova Services: triage seven signals, escalate two for a full workup, and file the report.",
    deliverable: "ProcessNova Signal Triage & Deep-Dive Report",
    levels: [1, 2],
    minutes: 50,
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
      "EcoFlow Administration GmbH's full reasoning chain — six management levers, three competing lines of measures, one prioritised framework, fully justified — then Synervia Process Group: a decision-ready Board Memo built live, section by section, under conditions EcoFlow's answer does not automatically fit.",
    deliverable: "Synervia Board Memo",
    levels: [3],
    minutes: 150,
    available: true,
  },
];

/** "Levels 1–2" / "Level 3" — mentor-facing label for a route's curriculum scope. */
export function levelLabel(levels: number[]): string {
  if (levels.length === 1) return `Level ${levels[0]}`;
  return `Levels ${levels[0]}–${levels[levels.length - 1]}`;
}
