/**
 * Plain-language glossary for every abbreviation, standard and regulation the
 * Day 16 material and tasks use. Each entry says what the term stands for, what
 * it means in one or two sentences, and where to read the primary text.
 *
 * Link policy: every URL below was opened with a script (HTTP 200) on
 * 2026-09-19. iso.org answers 403 to scripts, so ISO standards carry no link —
 * a `note` says where to find them instead. Where a rule is in flux (CSRD scope)
 * the meaning text says so; re-check it before teaching it.
 */

export type GlossaryEntry = {
  id: string;
  /** Exact strings in the running text that open this entry (case-sensitive). */
  matches: string[];
  name: string;
  /** What it stands for, in full, with the legal reference. */
  full: string;
  meaning: string;
  sources: { label: string; url: string }[];
  /** Shown when there is no link to offer. */
  note?: string;
};

export const GLOSSARY: GlossaryEntry[] = [
  {
    id: "kpi",
    matches: ["KPI"],
    name: "KPI",
    full: "Key Performance Indicator",
    meaning:
      "A number a manager steers by: it has a target, a named owner and a review, so a change in it leads to a decision. A metric that only sits on a dashboard is not yet a KPI.",
    sources: [],
    note: "A management term, not a standard — the course definition is the one to use.",
  },
  {
    id: "co2e",
    matches: ["CO₂e"],
    name: "CO₂e",
    full: "Carbon dioxide equivalent",
    meaning:
      "One unit that lets different greenhouse gases be added together: each gas is converted into the amount of CO₂ that would warm the climate as much. “CO₂e per service” is emissions divided by the units of service delivered.",
    sources: [{ label: "GHG Protocol — Corporate Standard", url: "https://ghgprotocol.org/corporate-standard" }],
  },
  {
    id: "pue",
    matches: ["PUE"],
    name: "PUE",
    full: "Power Usage Effectiveness — defined in ISO/IEC 30134-2",
    meaning:
      "Total energy a data centre uses divided by the energy that reaches the IT equipment. A PUE of 1.5 means half a kilowatt-hour of overhead (cooling, power losses) for every kilowatt-hour of IT load. It only compares fairly when every site draws the same boundary around “total” and “IT”.",
    sources: [
      { label: "The Green Grid — home of the PUE metric", url: "https://www.thegreengrid.org/" },
      { label: "EU Code of Conduct for Data Centres — JRC", url: "https://e3p.jrc.ec.europa.eu/communities/data-centres-code-conduct" },
      { label: "Overview — Wikipedia", url: "https://en.wikipedia.org/wiki/Power_usage_effectiveness" },
    ],
  },
  {
    id: "iso30134",
    matches: ["ISO/IEC 30134"],
    name: "ISO/IEC 30134",
    full: "ISO/IEC 30134 — Data centres: key performance indicators (a series of parts)",
    meaning:
      "The international standard series that defines data-centre KPIs such as PUE, CUE (carbon), WUE (water) and REF (renewable energy). Each part says exactly what to measure and where to measure it, which is what makes two sites comparable.",
    sources: [],
    note: "Published by ISO. iso.org could not be link-checked by script, so search “ISO/IEC 30134” on iso.org.",
  },
  {
    id: "ghg",
    matches: ["GHG Protocol"],
    name: "GHG Protocol",
    full: "Greenhouse Gas Protocol — the accounting standards from WRI and WBCSD",
    meaning:
      "The most widely used rulebook for counting a company's greenhouse-gas emissions. It defines the three scopes and how to draw the organisational boundary, so that two companies' numbers can be read the same way.",
    sources: [{ label: "GHG Protocol — Corporate Standard", url: "https://ghgprotocol.org/corporate-standard" }],
  },
  {
    id: "scopes",
    matches: ["Scope 1/2/3"],
    name: "Scope 1, 2 and 3",
    full: "GHG Protocol emission scopes",
    meaning:
      "Scope 1: emissions the company causes directly (for IT, a diesel generator). Scope 2: emissions from the electricity, heat or cooling it buys. Scope 3: everything else up and down the chain — making the devices it buys, cloud services it uses, disposing of old kit. For IT, Scope 3 is often the largest share.",
    sources: [
      { label: "GHG Protocol — Corporate Standard", url: "https://ghgprotocol.org/corporate-standard" },
      { label: "GHG Protocol — Scope 2 Guidance", url: "https://ghgprotocol.org/scope-2-guidance" },
      { label: "GHG Protocol — Scope 3 Standard", url: "https://ghgprotocol.org/corporate-value-chain-scope-3-standard" },
    ],
  },
  {
    id: "iso14064",
    matches: ["ISO 14064"],
    name: "ISO 14064",
    full: "ISO 14064 — Greenhouse gases: quantification, reporting and verification (parts 1–3)",
    meaning:
      "The ISO standard for how an organisation quantifies and reports its greenhouse-gas emissions and how that is verified. It follows the same logic as the GHG Protocol and is used when a figure has to hold up to an external auditor.",
    sources: [{ label: "Overview — Wikipedia", url: "https://en.wikipedia.org/wiki/ISO_14064" }],
    note: "Published by ISO. iso.org could not be link-checked by script, so search “ISO 14064” on iso.org for the standard itself.",
  },
  {
    id: "iso50001",
    matches: ["ISO 50001"],
    name: "ISO 50001",
    full: "ISO 50001 — Energy management systems",
    meaning:
      "The ISO standard for running energy management as a continuous cycle — plan, do, check, act — with named responsibilities and regular review. This course applies the same loop to Green IT metrics.",
    sources: [
      { label: "Directive (EU) 2023/1791, Art. 11 — energy management systems", url: "https://eur-lex.europa.eu/eli/dir/2023/1791/oj" },
      { label: "Overview — Wikipedia", url: "https://en.wikipedia.org/wiki/ISO_50001" },
    ],
    note: "Published by ISO. iso.org could not be link-checked by script, so search “ISO 50001” on iso.org for the standard itself.",
  },
  {
    id: "pdca",
    matches: ["PDCA", "Plan–Do–Check–Act"],
    name: "PDCA",
    full: "Plan–Do–Check–Act cycle",
    meaning:
      "A four-step improvement loop: plan a change, do it, check whether it worked, act on what the check showed — then start again. Its value is the repetition on a fixed cadence, not any single turn.",
    sources: [{ label: "Overview — Wikipedia", url: "https://en.wikipedia.org/wiki/PDCA" }],
  },
  {
    id: "csrd",
    matches: ["CSRD"],
    name: "CSRD",
    full: "Corporate Sustainability Reporting Directive — Directive (EU) 2022/2464",
    meaning:
      "EU law that makes large companies publish audited sustainability information, including energy use and emissions, in their annual management report. Which companies must report, and from when, is being revised by the EU's simplification (“Omnibus”) package — check the current scope before teaching it.",
    sources: [
      { label: "Directive (EU) 2022/2464 — EUR-Lex", url: "https://eur-lex.europa.eu/eli/dir/2022/2464/oj" },
      {
        label: "Overview — European Commission",
        url: "https://finance.ec.europa.eu/financial-markets/company-reporting-and-auditing/company-reporting/corporate-sustainability-reporting_en",
      },
    ],
  },
  {
    id: "esrs",
    matches: ["ESRS"],
    name: "ESRS",
    full: "European Sustainability Reporting Standards — Delegated Regulation (EU) 2023/2772",
    meaning:
      "The detailed rulebook for how a CSRD reporter reports: topic by topic, including climate (energy use, Scope 1, 2 and 3 emissions, targets). It is why a company needs consistent, owned, comparable figures rather than scattered ones.",
    sources: [{ label: "Delegated Regulation (EU) 2023/2772 — EUR-Lex", url: "https://eur-lex.europa.eu/eli/reg_del/2023/2772/oj" }],
  },
  {
    id: "eed",
    matches: ["EU Energy Efficiency Directive"],
    name: "EU Energy Efficiency Directive",
    full: "Energy Efficiency Directive — Directive (EU) 2023/1791",
    meaning:
      "EU law that sets energy-saving targets and, among other things, requires larger companies to run energy audits or an energy management system. It also introduces reporting on the energy performance of data centres above a size threshold.",
    sources: [
      { label: "Directive (EU) 2023/1791 — EUR-Lex", url: "https://eur-lex.europa.eu/eli/dir/2023/1791/oj" },
      {
        label: "Overview — European Commission",
        url: "https://energy.ec.europa.eu/topics/energy-efficiency/energy-efficiency-targets-directive-and-rules/energy-efficiency-directive_en",
      },
    ],
  },
];

export const glossaryById = (id: string) => GLOSSARY.find((g) => g.id === id)!;

/** Longest match first, so “ISO/IEC 30134” wins over shorter overlaps. */
const MATCHERS = GLOSSARY.flatMap((g) => g.matches.map((m) => ({ text: m, id: g.id }))).sort((a, b) => b.text.length - a.text.length);

export type TextPart = { text: string; termId?: string };

/**
 * Splits a sentence into plain runs and glossary terms. Each term is marked
 * only the first time it appears in the text, so a paragraph is never a wall of
 * dotted underlines.
 */
export function splitByGlossary(text: string): TextPart[] {
  const parts: TextPart[] = [];
  const seen = new Set<string>();
  let i = 0;
  let plainStart = 0;
  while (i < text.length) {
    const hit = MATCHERS.find((m) => text.startsWith(m.text, i) && !seen.has(m.id));
    if (hit) {
      if (i > plainStart) parts.push({ text: text.slice(plainStart, i) });
      parts.push({ text: hit.text, termId: hit.id });
      seen.add(hit.id);
      i += hit.text.length;
      plainStart = i;
    } else {
      i += 1;
    }
  }
  if (plainStart < text.length) parts.push({ text: text.slice(plainStart) });
  return parts;
}
