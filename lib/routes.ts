/**
 * Day 15 route registry.
 *
 * Module 11: Route 1 carries Level 1 (diagnose) and Level 2 (decide), one
 * continuous engagement at FutureGrid Technologies. Route 2 carries Level 3
 * (the management decision) at a new company, NovaCircular Technologies.
 */

export const CASE = {
  company: "AION Green IT",
  /** Curriculum day number. The export filename reads it (CURRICULUM-GUIDE.md §7). */
  day: 15,
  module: "Day 15",
  moduleNumber: 11,
  moduleTitle: "Innovations for the Sustainable IT of Tomorrow",
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
  | "person"
  // Day 15: AI compute as its own assessment lens.
  | "chip"
  // Day 15 L2/L3: prioritisation and management-decision material.
  | "compass"
  | "radar"
  | "trophy"
  // Day 15 L3: the decision-architecture canvas and review loop.
  | "funnel"
  | "clipboard"
  | "clock";

export type Route = {
  n: 1 | 2;
  slug: string;
  href: string;
  tag: string; // "Route 1 — Assess & Decide"
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
    slug: "route-1-assess-and-decide",
    href: "/route-1-assess-and-decide",
    tag: "Route 1 — Assess & Decide",
    title: "Route 1 — Assess & Decide",
    cardTitle: "Assess & Decide",
    cardBlurb:
      "Why novelty is not innovation, AI as both an efficiency promise and a resource burden, circular versus linear IT, the seven lenses and seven scoring dimensions, and how to tell attractive from viable — then FutureGrid Technologies: diagnose six innovation initiatives one by one, then step up to prioritise whole lines of measures under a limited budget and incomplete data.",
    deliverable: "FutureGrid Technologies Innovation Diagnosis & Priority",
    levels: [1, 2],
    minutes: 54,
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
      "From scattered initiatives to a decision architecture: assessment logic, governance and approval flow, and short/medium/structural time horizons — then NovaCircular Technologies: connect six building blocks into one framework and build the management proposal that puts it to work.",
    deliverable: "NovaCircular Technologies Management Proposal",
    levels: [3],
    minutes: 35,
    available: true,
  },
];

/** "Levels 1–2" / "Level 3" — mentor-facing label for a route's curriculum scope. */
export function levelLabel(levels: number[]): string {
  if (levels.length === 1) return `Level ${levels[0]}`;
  return `Levels ${levels[0]}–${levels[levels.length - 1]}`;
}
