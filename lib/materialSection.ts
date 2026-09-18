import type { IconKey } from "@/lib/routes";

/**
 * The shape of one material section, shared by both routes.
 *
 * The first three prose fields are the course-wide schema (definition →
 * insight → practical takeaway). `body` carries the depth a 60-minute
 * facilitator-led block needs on top of that: named sub-headings, each with
 * its own paragraphs, so a section can go deep without becoming one wall of
 * text. `reasoning` is the rule set that makes the section operational — it is
 * what the task's MaterialRefs chips point back at.
 */
export type MaterialSection<Id extends string = string> = {
  id: Id;
  /** "S1", "A" — the label the mini-nav and the reference chips use. */
  code: string;
  n: number;
  icon: IconKey;
  kicker: string;
  title: string;
  /** One line under the title, before the diagram. */
  standfirst: string;
  definition: string;
  insight: string;
  takeaway: string;
  /** Deeper explanation, rendered after the diagram. */
  body: { heading: string; paragraphs: string[] }[];
  /** "How to decide when this comes up in the task" — 1–3 operational rules. */
  reasoning: string[];
  callout: { label: string; text: string };
  references: { label: string; detail?: string; url?: string }[];
  /** Roughly how long a facilitator should spend here. */
  minutes: number;
};

/**
 * The lighter material unit: one compact card, 3–5 sentences, one live diagram
 * and one micro-interaction. Used where a day's design puts the learning inside
 * the task rather than in a long facilitator-led reading block — the teaching
 * is not thinner, it is denser.
 *
 * `reasoning` carries the same weight it does on a full section: it is the rule
 * set the task's MaterialRefs chips point back at, and it is what makes the
 * card operational rather than merely informative.
 */
export type MicroCard<Id extends string = string> = {
  id: Id;
  /** "C1" — the label the mini-nav and the reference chips use. */
  code: string;
  n: number;
  icon: IconKey;
  title: string;
  /** One line under the title, before the diagram. */
  standfirst: string;
  /** The whole written teaching for this card — 3 to 5 tight sentences. */
  sentences: string[];
  /** "How to decide when this comes up in the task" — 1–2 operational rules. */
  reasoning: string[];
  /** Small source tags under the card, never long paragraphs. */
  sources: { label: string; detail?: string; url?: string }[];
  minutes: number;
};
