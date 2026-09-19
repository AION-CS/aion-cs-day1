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
 * The lighter material unit: one compact card. What stays on screen is a
 * one-line standfirst, one live diagram and a short **definition** (2–4 plain
 * sentences a non-expert can repeat back). Everything else — the decision rules,
 * deeper explanation, the sources — sits behind a collapsed "Read more" so the
 * visible part never grows.
 *
 * `reasoning` carries the same weight it does on a full section: it is the rule
 * set the task's MaterialRefs chips point back at (a chip also opens the Read
 * more), and it is what makes the card operational rather than merely
 * informative.
 */
export type MicroCard<Id extends string = string> = {
  id: Id;
  /** "M1" — the label the mini-nav and the reference chips use. */
  code: string;
  n: number;
  icon: IconKey;
  title: string;
  /** One line under the title, before the diagram. */
  standfirst: string;
  /** Visible: 2–4 plain sentences that define what the card is about. */
  definition: string[];
  /** Read more — "How to decide when this comes up in the task". */
  reasoning: string[];
  /** One line shown beside the Read more button: what is inside. */
  readMoreHint: string;
  /** Read more — deeper explanation, as named sub-sections. */
  more: { heading: string; paragraphs: string[] }[];
  /** Read more — real, separately clickable sources. A missing `url` means it could not be link-checked. */
  sources: { label: string; detail?: string; url?: string }[];
  minutes: number;
};
