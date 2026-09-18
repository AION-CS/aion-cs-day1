/**
 * Day 15 route registry.
 *
 * Module 11: Route 1 carries Level 1 (this build) and later Level 2, both set
 * at FutureGrid Technologies — short micro-card material, then one diagnosis
 * task. Route 2 (Level 3, the management decision) is a separate, later
 * prompt and is marked unavailable until it is written.
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
  | "chip";

export type Route = {
  n: 1 | 2;
  slug: string;
  href: string;
  tag: string; // "Route 1 — Assess & Decide"
  title: string; // page H1
  cardTitle: string; // landing card title
  cardBlurb: string; // landing card one-liner
  deliverable: string; // what the route produces
  /** Curriculum levels this route covers. Route 1 spans two once L2 lands; Route 2 spans one. */
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
      "Why novelty is not innovation, why AI is both an efficiency promise and a resource burden, what circular IT keeps in the loop that linear IT throws away, the seven lenses every sustainable-innovation decision is read through, and how to tell attractive from viable — then FutureGrid Technologies: diagnose six innovation initiatives as opportunity, risk, or mixed.",
    deliverable: "FutureGrid Technologies Innovation Diagnosis",
    levels: [1],
    minutes: 27,
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
      "Level 3 — the management decision on FutureGrid's innovation portfolio. Written in a later session; this card will open once it is built.",
    deliverable: "FutureGrid Technologies Innovation Decision",
    levels: [3],
    minutes: 45,
    available: false,
  },
];

/** "Levels 1–2" / "Level 3" — mentor-facing label for a route's curriculum scope. */
export function levelLabel(levels: number[]): string {
  if (levels.length === 1) return `Level ${levels[0]}`;
  return `Levels ${levels[0]}–${levels[levels.length - 1]}`;
}
