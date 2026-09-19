/**
 * Day 16 route registry.
 *
 * Module 12: Capturing & Visualising Sustainability Targets — Green IT KPIs,
 * continuous optimisation, transparent reporting and IT-specific carbon
 * monitoring. Route 1 is two short material-then-task pairs (L1 — diagnosing
 * why Clarity Digital Services' metrics don't yet steer anything; L2 —
 * prioritising which line of measures to build first), each with its own
 * export. Route 2 carries Level 3, the Verdeon Digital Governance Group
 * management proposal.
 */

export const CASE = {
  company: "AION Green IT",
  /** Curriculum day number. The export filename reads it (CURRICULUM-GUIDE.md §7). */
  day: 16,
  module: "Day 16",
  moduleNumber: 12,
  moduleTitle: "Capturing & Visualising Sustainability Targets",
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
    slug: "route-1-kpis-and-monitoring",
    href: "/route-1-kpis-and-monitoring",
    tag: "Route 1 — KPIs, Optimisation & Monitoring",
    title: "Route 1 — KPIs, Optimisation & Monitoring",
    cardTitle: "KPIs, Optimisation & Monitoring",
    cardBlurb:
      "Two short material-then-task pairs. First: why data collected isn't the same as data managed, the three metric layers, the six areas a Green IT metric system needs, and what makes a KPI management-effective rather than merely informative — then diagnose Clarity Digital Services' scattered metrics. Second: continuous optimisation as a PDCA routine, the measurability–informative-value–controllability trade-off, and the three candidate lines of measures — then prioritise which one to build first, under real uncertainty.",
    deliverable: "Clarity Digital Services — Metrics Diagnosis & Priority Line",
    levels: [1, 2],
    minutes: 34,
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
      "Metrics, carbon monitoring and reporting reframed as leadership instruments, not documentation: staging a management model in layers, the senior five-factor trade-off, and how different roles prioritise differently — then Verdeon Digital Governance Group: build the decision-ready management proposal, not a metrics list.",
    deliverable: "Verdeon Digital Governance Group — Management Proposal",
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
