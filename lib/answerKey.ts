/**
 * Mentor-only answer keys for every exercise where the learner picks from
 * fixed options. The learner-facing UI only ever offers a clue (see
 * ClueToggle) — so the full reasoning has to live somewhere a facilitator can
 * reach it, or they end up improvising a counter-case live in front of a
 * cohort. That is what this is for.
 *
 * Each option carries its own `why`, including the rejected ones: knowing why
 * "Individual behaviour" is the wrong read of a finding is what lets a mentor
 * answer the participant who argued for it.
 */

export type AnswerKeyItem = {
  /** The option as the learner sees it. */
  option: string;
  /** "pick" = the expected answer; "avoid" = a plausible option and why it's rejected. */
  verdict: "pick" | "avoid";
  why: string;
};

export type AnswerKeyBlock = {
  /** What this key answers, e.g. "Finding A — which category?" */
  prompt: string;
  items: AnswerKeyItem[];
  /**
   * Used wherever more than one answer genuinely defends. Gives the mentor the
   * counter-case up front instead of leaving them to invent one on the spot.
   */
  teachingNote?: string;
};
