/**
 * The block's framing copy: the opener with its learning objectives, the
 * "Twelve terms you now own" strip that closes the S1–S4 teaching, and the
 * short opener that turns the block from technology to trade-offs before S5.
 */

import type { IconKey } from "@/lib/routes";

export const OPENER = {
  paragraphs: [
    "Every connected device, every sensor reading, and every 5G signal runs on infrastructure that consumes energy around the clock — often regardless of whether it is doing useful work. Management usually treats connectivity as progress. This section gives you the technical vocabulary to evaluate it the way a network architect or a sustainability lead does: as capacity that has to be provisioned, powered, maintained, replaced and disposed of, whether or not anyone is using it.",
    "By the end of this section you will be able to name the factors that drive network energy consumption, describe how IoT impact is distributed across a device lifecycle, and explain — precisely — why a technology that is more efficient per unit can still increase total consumption.",
  ],
  objectives: [
    {
      icon: "gauge" as IconKey,
      text: "Explain what actually drives energy consumption in a network — and why utilisation matters more than raw capacity.",
    },
    {
      icon: "layers" as IconKey,
      text: "Name the standard levers of energy-efficient network operation and the conditions each one requires.",
    },
    {
      icon: "recycleLoop" as IconKey,
      text: "Map IoT sustainability impact across the full lifecycle, distinguishing embodied from operational impact.",
    },
    {
      icon: "antenna" as IconKey,
      text: "Separate 5G's efficiency potential from its system-level risk, using the rebound mechanism.",
    },
  ],
};

export const GLOSSARY = {
  title: "Twelve terms you now own",
  intro: "Tap a term to expand its definition.",
  bridge:
    "SmartLink Operations has all of these issues at once. Your job is to see them — and the three sections that follow give you what you need to decide what to do about them.",
  terms: [
    {
      term: "Baseline power",
      where: "S1",
      definition:
        "What a device or link draws whenever it is switched on, whatever the traffic — the reason a link at 10% utilisation does not draw 10% of its full-load power.",
    },
    {
      term: "Load-adaptive operation",
      where: "S2",
      definition:
        "Carrier and cell shutdown, deep sleep states and deactivation at low load, so that consumption follows traffic instead of holding its baseline.",
    },
    {
      term: "Legacy sunset",
      where: "S1–S2",
      definition:
        "Retiring a technology generation or parallel layer instead of stacking the new one on top — a migration and governance decision rather than a technical one.",
    },
    {
      term: "Embodied emissions",
      where: "S2–S3",
      definition:
        "Emissions from making a device before it is ever switched on. For small, numerous, short-lived devices they can dominate the lifetime footprint.",
    },
    {
      term: "Operational emissions",
      where: "S1–S3",
      definition: "Emissions caused by running equipment — mainly its electricity use over its service life.",
    },
    {
      term: "Measurement boundary",
      where: "S2",
      definition:
        "The declared perimeter an efficiency figure is measured over — topological, geographic or demographic. Without it, a figure is not comparable.",
    },
    {
      term: "Partial-network extrapolation",
      where: "S2",
      definition:
        "ETSI ES 203 228's method: measure a partial network, estimate the efficiency of the whole with a defined extrapolation, and document it in an assessment report.",
    },
    {
      term: "Enabling effect",
      where: "S3, S5",
      definition:
        "A saving a technology causes somewhere else — heating energy saved by occupancy sensors. Legitimate, and hypothetical until it is measured.",
    },
    {
      term: "Rebound effect",
      where: "S4–S5",
      definition:
        "Efficiency per unit lowers the effective cost of use, use grows, and total consumption can rise — also called the Jevons paradox.",
    },
    {
      term: "Device density",
      where: "S3–S4",
      definition:
        "How many connected devices a use case places in an area or a cell — the first multiplier in a fleet's footprint.",
    },
    {
      term: "Support period",
      where: "S3",
      definition:
        "How long a supplier provides firmware and security updates. When it ends, a device becomes a security liability and is replaced early.",
    },
    {
      term: "Digital Product Passport",
      where: "S3",
      definition:
        "Introduced by the ESPR, (EU) 2024/1781: a digital record that makes product information — for example on durability, reparability and recyclability — available along the value chain.",
    },
  ],
};

export const DECIDE_OPENER = {
  kicker: "From technology to trade-offs",
  title: "Governing connected infrastructure",
  text: "Efficient technology does not produce a sustainable outcome on its own. The outcome depends on how an organisation governs what gets connected, what gets measured, what gets retired and what gets approved. In the next three sections you move from understanding the technology to deciding under conflicting interests and incomplete data — which is the actual job of a senior consultant, an architect or a CTO advisor.",
};
