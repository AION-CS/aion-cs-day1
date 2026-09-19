/** Day 1 route registry — Customer Retention & Buying Behaviour in B2B IT Sales, Module 1. */

export const COURSE = {
  title: "Customer Retention & Buying Behaviour in B2B IT Sales",
  site: "Retention Lab · Day 1",
  module: "Module 1, Day 1 of 2",
  day: 1,
} as const;

export type RouteInfo = {
  n: 1 | 2;
  href: string;
  short: string;
  title: string;
  blurb: string;
  levels: string;
  plan: { label: string; minutes: number }[];
  built: boolean;
};

export const ROUTES: RouteInfo[] = [
  {
    n: 1,
    href: "/route-1/",
    short: "Diagnose & calculate",
    title: "Route 1 · Level 1 + Level 2",
    blurb:
      "Read what a customer file actually records, then put figures and buying motives on the re-tender. Two pairs of study material and task, each ending as a working document.",
    levels: "Level 1 · Knowledge → Level 2 · Application",
    plan: [
      { label: "Materi A · Level 1", minutes: 60 },
      { label: "Task 1 · Diagnostic Note", minutes: 15 },
      { label: "Materi B · Level 2", minutes: 60 },
      { label: "Task 2 · Calculation Note", minutes: 15 },
    ],
    built: true,
  },
  {
    n: 2,
    href: "/route-2/",
    short: "Management decision",
    title: "Route 2 · Level 3",
    blurb: "The management decision. Built in the next release.",
    levels: "Level 3 · Management decision",
    plan: [],
    built: false,
  },
];
