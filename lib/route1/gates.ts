/**
 * The six gates of M4 (the definition Task 1 Stage B tests against) and the
 * practice metrics the M4 diagram filters. Practice metrics are deliberately
 * not Stage B's six — nothing here hands over a task answer.
 *
 * Gates split into two halves: a *sound number* (relevant, understandable,
 * comparable, robust) and a *wired* one (actionable, owned). A fix to a sound-
 * number gate changes how a number is captured or written down — short-term.
 * A fix to a wired gate creates accountability (target, decision, owner,
 * review) — structural. That is exactly Stage C's split.
 */

export type GateId = "relevant" | "understandable" | "comparable" | "robust" | "actionable" | "owned";

export type Gate = {
  id: GateId;
  name: string;
  half: "sound" | "wired";
  question: string;
  /** What kind of work a fix to this gate is. */
  fixKind: "shortTerm" | "structural";
};

export const GATES: Gate[] = [
  { id: "relevant", name: "Relevant", half: "sound", question: "Does it describe something the goals depend on, rather than a by-product of reporting?", fixKind: "shortTerm" },
  { id: "understandable", name: "Understandable", half: "sound", question: "Can its users say in one sentence what it counts and in which unit?", fixKind: "shortTerm" },
  { id: "comparable", name: "Comparable", half: "sound", question: "Is it measured on one definition, boundary and period everywhere?", fixKind: "shortTerm" },
  { id: "robust", name: "Robust", half: "sound", question: "Is the data complete and reliable enough that the message doesn't flip on a small change?", fixKind: "shortTerm" },
  { id: "actionable", name: "Actionable", half: "wired", question: "Is there a target to compare with and a decision that changes when it moves?", fixKind: "structural" },
  { id: "owned", name: "Owned", half: "wired", question: "Does one named person answer for it end to end?", fixKind: "structural" },
];

export const gateById = (id: GateId): Gate => GATES.find((g) => g.id === id)!;

export type GateResult = { pass: boolean; reason: string; fix?: string };

export type FilterSample = {
  id: string;
  label: string;
  gates: Record<GateId, GateResult>;
};

export const FILTER_SAMPLES: FilterSample[] = [
  {
    id: "utilisation",
    label: "Server utilisation vs a 50 % target, owned by Platform Ops, reviewed monthly",
    gates: {
      relevant: { pass: true, reason: "Utilisation shows whether hardware is used or idle — a real driver of energy use." },
      understandable: { pass: true, reason: "“Share of capacity in use, in %” — one sentence." },
      comparable: { pass: true, reason: "Same definition and sampling period on every server." },
      robust: { pass: true, reason: "Collected automatically, with no gaps in the last year." },
      actionable: { pass: true, reason: "A 50 % target exists, and a low reading triggers a decision to consolidate servers." },
      owned: { pass: true, reason: "Platform Ops answers for it." },
    },
  },
  {
    id: "kwh-sites",
    label: "kWh per site, where each site counts different things",
    gates: {
      relevant: { pass: true, reason: "Energy use is a real driver of both emissions and cost." },
      understandable: { pass: true, reason: "“Kilowatt-hours drawn at the site” is easy to say." },
      comparable: {
        pass: false,
        reason: "One site includes cooling and another does not, so the figures cannot sit side by side.",
        fix: "Write one definition and boundary and apply it at every site.",
      },
      robust: {
        pass: false,
        reason: "Two sites estimate part of the total, so a small change in the estimate moves the message.",
        fix: "Replace the estimates with meter readings, or label them as estimates.",
      },
      actionable: {
        pass: false,
        reason: "No target is set and no decision changes when the figure does.",
        fix: "Agree a target and name the decision the figure feeds.",
      },
      owned: {
        pass: false,
        reason: "Each site answers for its own reading; nobody answers for the combined figure.",
        fix: "Name one person accountable for the combined figure.",
      },
    },
  },
  {
    id: "slides",
    label: "Number of green-IT slides shown to the board",
    gates: {
      relevant: {
        pass: false,
        reason: "It counts reporting effort, not anything the goals depend on.",
        fix: "Replace it with an outcome the board cares about, such as emissions per service.",
      },
      understandable: { pass: true, reason: "“How many slides” needs no explanation." },
      comparable: { pass: true, reason: "A slide count means the same thing every quarter." },
      robust: { pass: true, reason: "It can be counted exactly." },
      actionable: {
        pass: false,
        reason: "No target exists, and no decision changes if the count goes up or down.",
        fix: "Attach a target and a decision to an outcome measure instead.",
      },
      owned: { pass: true, reason: "The communications lead answers for the slide pack." },
    },
  },
  {
    id: "laptop-age",
    label: "Average laptop age, tracked by IT procurement, no target",
    gates: {
      relevant: { pass: true, reason: "Device age drives both replacement cost and embodied emissions." },
      understandable: { pass: true, reason: "“Average age in years” is clear." },
      comparable: { pass: true, reason: "It is counted the same way for every model and site." },
      robust: { pass: true, reason: "Purchase dates come straight from the asset register." },
      actionable: {
        pass: false,
        reason: "There is no target to compare with, so nothing says when the age is “too old”.",
        fix: "Agree a target age and name the replacement decision it triggers.",
      },
      owned: { pass: true, reason: "IT procurement tracks it and answers for it." },
    },
  },
];
