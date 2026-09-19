/** One registry for every material card: the rail, the cards and the task chips all read it. */
export type MaterialId =
  | "A1" | "A2" | "A3" | "A4" | "A5" | "A6" | "A7" | "A8"
  | "B1" | "B2" | "B3" | "B4" | "B5" | "B6" | "B7";

export type MaterialMeta = { id: MaterialId; block: "A" | "B"; title: string; minutes: number };

export const MATERIALS: MaterialMeta[] = [
  { id: "A1", block: "A", title: "Why retention economics differ in IT project business", minutes: 6 },
  { id: "A2", block: "A", title: "Satisfaction, loyalty, retention: three different things", minutes: 9 },
  { id: "A3", block: "A", title: "Three types of retention", minutes: 9 },
  { id: "A4", block: "A", title: "Switching costs in project business", minutes: 9 },
  { id: "A5", block: "A", title: "The customer journey in B2B IT", minutes: 9 },
  { id: "A6", block: "A", title: "Observation vs interpretation, and how to sort (MECE)", minutes: 9 },
  { id: "A7", block: "A", title: "Compliance corner: retention outreach in Germany/EU", minutes: 5 },
  { id: "A8", block: "A", title: "Field method for Task 1", minutes: 2 },
  { id: "B1", block: "B", title: "What decides a B2B IT purchase", minutes: 10 },
  { id: "B2", block: "B", title: "The buying centre", minutes: 9 },
  { id: "B3", block: "B", title: "Four purchase motives", minutes: 9 },
  { id: "B4", block: "B", title: "Quantify the choice", minutes: 12 },
  { id: "B5", block: "B", title: "What a calculation cannot tell you", minutes: 6 },
  { id: "B6", block: "B", title: "First moves to influence behaviour", minutes: 10 },
  { id: "B7", block: "B", title: "Field method for Task 2", minutes: 2 },
];

export const MATERIAL_BY_ID = Object.fromEntries(MATERIALS.map((m) => [m.id, m])) as Record<MaterialId, MaterialMeta>;
export const materialAnchorId = (id: MaterialId) => `mat-${id}`;

/** Section anchors per route page, in reading order. */
export type RailSection = { id: string; label: string; sub: string; minutes: number };
export const SECTIONS: Record<1 | 2, RailSection[]> = {
  1: [
    { id: "materi-a", label: "Materi A", sub: "Level 1 · Knowledge", minutes: 60 },
    { id: "task-1", label: "Task 1", sub: "Diagnostic Note", minutes: 15 },
  ],
  2: [
    { id: "materi-b", label: "Materi B", sub: "Level 2 · Application", minutes: 60 },
    { id: "task-2", label: "Task 2", sub: "Calculation Note", minutes: 15 },
  ],
};
