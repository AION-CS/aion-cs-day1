import { MATERIALS, materialAnchorId } from "@/data/materialIndex";
import type { TaskBlockId } from "@/lib/progress";

/**
 * The page map on the right of every route: one entry per material card and per task block, in page
 * order, so a learner can see how much the route holds and jump straight to any part of it. Anchor ids
 * are the ones the page already renders (mat-A1, block-2-3, export-l3, …).
 */
export type NavItem = {
  /** The element id to scroll to. */
  id: string;
  /** The pill text: "A1", "2.3", "Case", "Export". */
  short: string;
  /** The full name, shown on hover/focus and in the mobile list. */
  title: string;
  /** Completion source: a card marked read, or a task block filled in. Absent = no done state. */
  done?: { card: string } | { block: TaskBlockId };
};
export type NavGroup = { label: string; items: NavItem[] };

const cards = (block: "A" | "B" | "C"): NavItem[] =>
  MATERIALS.filter((m) => m.block === block).map((m) => ({
    id: materialAnchorId(m.id),
    short: m.id,
    title: m.title,
    done: { card: m.id },
  }));

export const PAGE_NAV: Record<1 | 2 | 3, NavGroup[]> = {
  1: [
    { label: "Materi A", items: cards("A") },
    {
      label: "Task 1",
      items: [
        { id: "task-1", short: "Case", title: "The case and the Kessler file" },
        { id: "block-1-1", short: "1.1", title: "Sort the file", done: { block: "b11" } },
        { id: "block-1-2", short: "1.2", title: "Map the customer", done: { block: "b1m" } },
        { id: "block-1-3", short: "1.3", title: "Name the weak point", done: { block: "b12" } },
        { id: "export-l1", short: "Export", title: "Export the diagnostic note" },
      ],
    },
  ],
  2: [
    { label: "Materi B", items: cards("B") },
    {
      label: "Task 2",
      items: [
        { id: "task-2", short: "Case", title: "The Kessler re-tender" },
        { id: "block-2-1", short: "2.1", title: "Read the tables" },
        { id: "block-2-2", short: "2.2", title: "Cost explorer" },
        { id: "block-2-3", short: "2.3", title: "Figures", done: { block: "b23" } },
        { id: "block-2-4", short: "2.4", title: "Motive read", done: { block: "b24" } },
        { id: "block-2-5", short: "2.5", title: "Your choice", done: { block: "b25" } },
        { id: "block-2-6", short: "2.6", title: "One question the data cannot answer", done: { block: "b26" } },
        { id: "export-l2", short: "Export", title: "Export the calculation note" },
      ],
    },
  ],
  3: [
    { label: "Materi C", items: cards("C") },
    {
      label: "Task 3",
      items: [
        { id: "task-3", short: "Case", title: "The situation and the budget" },
        { id: "block-3-1", short: "3.1", title: "Allocation board", done: { block: "b31" } },
        { id: "block-3-2", short: "3.2", title: "RACI grid", done: { block: "b32" } },
        { id: "block-3-3", short: "3.3", title: "Risk and reversibility", done: { block: "b33" } },
        { id: "block-3-4", short: "3.4", title: "Governance table", done: { block: "b34" } },
        { id: "block-3-5", short: "3.5", title: "What we are not funding", done: { block: "b35" } },
        { id: "block-3-6", short: "3.6", title: "Executive summary", done: { block: "b36" } },
        { id: "export-l3", short: "Export", title: "Export the decision memo" },
      ],
    },
  ],
};
