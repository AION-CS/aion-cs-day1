/**
 * A micro-check: two or three comprehension questions at the end of a material
 * section. Non-graded — every option carries its own explanation, shown the
 * moment it is picked, whether it is right or not — and never part of a
 * route's missing list.
 *
 * Plain data, so lib content files can declare checks without importing the
 * client component that renders them.
 */

export type MicroOption = {
  id: string;
  text: string;
  correct?: boolean;
  feedback: string;
};

export type MicroQuestion = {
  id: string;
  prompt: string;
  options: MicroOption[];
};

export type MicroCheckBlock = {
  id: string;
  title: string;
  questions: MicroQuestion[];
};
