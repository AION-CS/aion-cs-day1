/** Purchase motives, buying-centre roles and the Kessler committee (Task 2, Block 2.4). */

export type MotiveId = "security" | "efficiency" | "innovation" | "status";
export const MOTIVE_IDS: MotiveId[] = ["security", "efficiency", "innovation", "status"];

export const MOTIVE_LABEL: Record<MotiveId, string> = {
  security: "Security",
  efficiency: "Efficiency",
  innovation: "Innovation",
  status: "Status",
};

export type Motive = {
  id: MotiveId;
  label: string;
  meaning: string;
  listenFor: string[];
  proves: string[];
};

/** B3 — generic listen-for phrases and proof points (illustrative, not Kessler's). */
export const MOTIVES: Motive[] = [
  {
    id: "security",
    label: "Security",
    meaning: "Avoid loss or failure.",
    listenFor: ["“What happens if it goes down?”", "“Who is accountable when this fails?”", "“We cannot afford a repeat.”"],
    proves: ["A certificate (for example ISO/IEC 27001)", "Monitoring hours and response terms", "Incident history"],
  },
  {
    id: "efficiency",
    label: "Efficiency",
    meaning: "Less effort or cost per outcome.",
    listenFor: ["“What does it cost in total?”", "“How much of my team's time does this take?”", "“Can we standardise this?”"],
    proves: ["A total-cost calculation over the term", "Hours saved or effort removed", "A price that fits the budget line"],
  },
  {
    id: "innovation",
    label: "Innovation",
    meaning: "A capability the buyer does not yet have.",
    listenFor: ["“Can we get this data live?”", "“What could we do next year that we cannot do now?”", "“Where is this going?”"],
    proves: ["A roadmap", "A pilot on the buyer's own data", "A named capability the offer includes"],
  },
  {
    id: "status",
    label: "Status",
    meaning: "Reputation, legitimacy, peer comparison.",
    listenFor: ["“Who else is using this?”", "“I want us to be seen as…”", "“What will our peers say?”"],
    proves: ["Reference customers", "A recognised certificate or award", "Naming in a sector showcase"],
  },
];

export type RoleKey = "einkauf" | "itLeiter" | "gf" | "prodIt";
export const ROLE_KEYS: RoleKey[] = ["einkauf", "itLeiter", "gf", "prodIt"];

export type KesslerRole = {
  key: RoleKey;
  name: string;
  gloss: string;
  wind: string;
  statement: string;
  model: MotiveId;
};

export const KESSLER_ROLES: KesslerRole[] = [
  {
    key: "einkauf",
    name: "Einkauf",
    gloss: "procurement",
    wind: "Buyer",
    statement:
      "“Anything above the fee line needs a written justification. I need the total cost over the term, not the headline.”",
    model: "efficiency",
  },
  {
    key: "itLeiter",
    name: "IT-Leiter",
    gloss: "head of IT",
    wind: "Influencer",
    statement: "“If ransomware stops the plant in August, I'm the one explaining it to the board.”",
    model: "security",
  },
  {
    key: "gf",
    name: "Geschäftsführer",
    gloss: "managing director",
    wind: "Decider",
    statement:
      "“At the next industry fair I want Kessler to be named among the sector's reference plants for digital operations.”",
    model: "status",
  },
  {
    key: "prodIt",
    name: "Leiter Produktions-IT",
    gloss: "head of production IT",
    wind: "User",
    statement:
      "“Next year I want live machine data in our dashboards. Nobody has told me how the new operator supports that.”",
    model: "innovation",
  },
];

/** The feature node each motive connects to on the right-hand side of the map. */
export const MOTIVE_FEATURE: Record<MotiveId, { label: string; empty?: boolean }> = {
  security: { label: "24×7 monitoring + response included (B)" },
  efficiency: { label: "Fee line: A €44,000 fits €48,000, B €50,000 exceeds it" },
  status: { label: "ISO/IEC 27001 certificate (B)" },
  innovation: { label: "No feature in either offer", empty: true },
};

/** B2 — the generic buying committee (roles only), with a typical question each. */
export type CommitteeRole = { key: string; short: string; name: string; gloss: string; wind: string; question: string };
export const COMMITTEE: CommitteeRole[] = [
  {
    key: "gf",
    short: "GF",
    name: "Geschäftsführer",
    gloss: "managing director",
    wind: "Decider",
    question: "Is this spend justified, and who carries the risk if it goes wrong?",
  },
  {
    key: "einkauf",
    short: "Einkauf",
    name: "Einkauf",
    gloss: "procurement",
    wind: "Buyer",
    question: "Does the process hold — enough offers, the total cost, the terms?",
  },
  {
    key: "it",
    short: "IT-Leiter",
    name: "IT-Leiter",
    gloss: "head of IT",
    wind: "Influencer",
    question: "Will it work technically, and what does it do to my team?",
  },
  {
    key: "user",
    short: "Users",
    name: "Users",
    gloss: "the teams who work with the system",
    wind: "User",
    question: "Does this make my daily work easier or harder?",
  },
  {
    key: "dsb",
    short: "DSB",
    name: "Datenschutzbeauftragter",
    gloss: "data protection officer",
    wind: "Gatekeeper",
    question: "Is the data processing covered by an Auftragsverarbeitungsvertrag (GDPR Art. 28)?",
  },
  {
    key: "br",
    short: "Betriebsrat",
    name: "Betriebsrat",
    gloss: "works council",
    wind: "Gatekeeper",
    question: "Can the system monitor employee behaviour (§ 87(1) no. 6 BetrVG)?",
  },
];

/** Gartner 2017 buying-time split (n = 750). Sums to 100. */
export const GARTNER_SPLIT: { label: string; pct: number }[] = [
  { label: "Meeting suppliers", pct: 17 },
  { label: "Researching online", pct: 27 },
  { label: "Researching offline", pct: 18 },
  { label: "Meeting the buying group", pct: 22 },
  { label: "Other", pct: 16 },
];
