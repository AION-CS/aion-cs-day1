/** Day 1 route registry — Customer Retention & Buying Behaviour in B2B IT Sales, Module 1. One route per level. */

export const COURSE = {
  title: "Customer Retention & Buying Behaviour in B2B IT Sales",
  site: "Retention Lab · Day 1",
  module: "Module 1, Day 1 of 2",
  day: 1,
} as const;

export type RouteInfo = {
  n: 1 | 2 | 3;
  href: string;
  short: string;
  title: string;
  level: string;
  blurb: string;
  plan: { label: string; minutes: number }[];
  built: boolean;
};

export const ROUTES: RouteInfo[] = [
  {
    n: 1,
    href: "/route-1/",
    short: "Diagnose",
    title: "Route 1 · Knowledge",
    level: "Level 1 · Knowledge",
    blurb:
      "Read what a customer file actually records, and what it does not. Study material, then a Diagnostic Note on the Kessler case.",
    plan: [
      { label: "Materi A · Level 1", minutes: 60 },
      { label: "Task 1 · Diagnostic Note", minutes: 15 },
    ],
    built: true,
  },
  {
    n: 2,
    href: "/route-2/",
    short: "Calculate",
    title: "Route 2 · Application",
    level: "Level 2 · Application",
    blurb:
      "What decides a purchase, and how to put figures and buying motives on it. Study material, then a Calculation Note on the Kessler re-tender.",
    plan: [
      { label: "Materi B · Level 2", minutes: 60 },
      { label: "Task 2 · Calculation Note", minutes: 15 },
    ],
    built: true,
  },
  {
    n: 3,
    href: "/route-3/",
    short: "Decide",
    title: "Route 3 · Management decision",
    level: "Level 3 · Management decision",
    blurb: "The management decision. Built in the next release.",
    plan: [],
    built: false,
  },
];
