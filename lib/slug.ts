/** Lowercase ASCII, spaces to "-", diacritics stripped (ü → u, ß → ss). */
export function slug(input: string): string {
  return input
    .trim()
    .replace(/ß/g, "ss")
    .replace(/æ/gi, "ae")
    .replace(/ø/gi, "o")
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export type TaskSlug = "l1-diagnostic" | "l2-calculation" | "l3-memo";

/** The number that leads every file name is the route it comes from: Diagnose 1, Calculate 2, Decide 3. */
export const TASK_NUMBER: Record<TaskSlug, 1 | 2 | 3> = {
  "l1-diagnostic": 1,
  "l2-calculation": 2,
  "l3-memo": 3,
};

/** `{route}-{name}-day1-{task}` — e.g. `1-muchson-day1-l1-diagnostic`, `3-muchson-day1-l3-memo`. */
export function exportName(name: string, task: TaskSlug): string {
  return `${TASK_NUMBER[task]}-${slug(name) || "participant"}-day1-${task}`;
}
