/**
 * Route 2 material — six sections (A–F), all taught before the task, plus the
 * trailing rubric and reflection framing.
 */

import type { MaterialSection } from "@/lib/materialSection";
import type { MaterialSectionId } from "../sections";
import { A_MANAGEMENT } from "./management";
import { B_MAP } from "./map";
import { C_DIMENSIONS } from "./dimensions";
import { D_LEVERS } from "./levers";
import { E_MEASURE } from "./measure";
import { F_ROADMAP } from "./roadmap";

export * from "./management";
export * from "./map";
export * from "./dimensions";
export * from "./levers";
export * from "./measure";
export * from "./roadmap";
export * from "./framing";

export const MATERIAL: MaterialSection<MaterialSectionId>[] = [
  A_MANAGEMENT,
  B_MAP,
  C_DIMENSIONS,
  D_LEVERS,
  E_MEASURE,
  F_ROADMAP,
];

export const materialById = (id: MaterialSectionId) => MATERIAL.find((m) => m.id === id)!;

export const MATERIAL_MINUTES = MATERIAL.reduce((sum, s) => sum + s.minutes, 0);
