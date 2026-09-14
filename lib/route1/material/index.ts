/**
 * Route 1 material — seven sections, all taught before the task starts.
 *
 * Day 12's material is about twice the volume of Day 11's, so each section
 * lives in its own file with its diagram data and its micro-check. This index
 * is the single list the rest of the route reads.
 */

import type { MaterialSection } from "@/lib/materialSection";
import type { MicroCheckBlock } from "@/lib/microCheck";
import type { MaterialSectionId } from "../sections";
import { S1_INFRASTRUCTURE, MICRO_1 } from "./infrastructure";
import { S2_LEVERS, MICRO_2 } from "./levers";
import { S3_IOT, MICRO_3 } from "./iot";
import { S4_FIVEG, MICRO_4 } from "./fiveg";
import { S5_SYSTEM } from "./system";
import { S6_LENS } from "./lens";
import { S7_UNCERTAINTY, MICRO_5 } from "./uncertainty";

export * from "./infrastructure";
export * from "./levers";
export * from "./iot";
export * from "./fiveg";
export * from "./system";
export * from "./lens";
export * from "./uncertainty";
export * from "./glossary";

export const MATERIAL: MaterialSection<MaterialSectionId>[] = [
  S1_INFRASTRUCTURE,
  S2_LEVERS,
  S3_IOT,
  S4_FIVEG,
  S5_SYSTEM,
  S6_LENS,
  S7_UNCERTAINTY,
];

export const materialById = (id: MaterialSectionId) => MATERIAL.find((m) => m.id === id)!;

export const MICRO_CHECKS: MicroCheckBlock[] = [MICRO_1, MICRO_2, MICRO_3, MICRO_4, MICRO_5];

/** Facilitator minutes across the whole block. */
export const MATERIAL_MINUTES = MATERIAL.reduce((sum, s) => sum + s.minutes, 0);
