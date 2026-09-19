/**
 * Task 3 lever data. Every cost and output here is a *Case assumption*, printed
 * on screen. The allocation board computes from this table; nothing downstream
 * hard-codes a result.
 */

export type LeverId = "l1" | "l2" | "l3";
export const LEVER_IDS: LeverId[] = ["l1", "l2", "l3"];
export type Position = "none" | "partial" | "full";
export const POSITIONS: Position[] = ["none", "partial", "full"];
export const POSITION_LABEL: Record<Position, string> = { none: "None", partial: "Partial", full: "Full" };

export type Scenario = "statusQuo" | "priceWar";
export const SCENARIO_LABEL: Record<Scenario, string> = { statusQuo: "Status Quo", priceWar: "Price War" };

export const CAP = 200_000;
export const POOL = 42; // one-off customers: 60 active × 70% one-off (Materi A1), Case assumption
export const ACTIVE_CUSTOMERS = 60;

export type Lever = {
  id: LeverId;
  short: string;
  name: string;
  what: string;
  rope: string;
  cost: Record<Position, number>;
  produces: Record<Position, number>;
  producesUnit: string;
  /** Names a text may use for this lever (Blocks 3.5 and 3.6). */
  match: RegExp;
};

export const LEVERS: Lever[] = [
  {
    id: "l1",
    short: "named account owners",
    name: "L1 · Named account owners",
    what: "Existing delivery PMs take on part-time account ownership for closed projects.",
    rope: "Relationship",
    cost: { none: 0, partial: 27_000, full: 54_000 },
    produces: { none: 0, partial: 12, full: 30 },
    producesUnit: "accounts get a named owner",
    match: /named account owner|account[- ]owner|account ownership/i,
  },
  {
    id: "l2",
    short: "value-realization reviews",
    name: "L2 · Value-realization reviews",
    what: "A fixed-term contractor runs structured post-go-live reviews (the QBR practice in Materi B6).",
    rope: "Relationship + Benefit",
    cost: { none: 0, partial: 40_000, full: 72_000 },
    produces: { none: 0, partial: 20, full: 42 },
    producesUnit: "accounts receive at least one review",
    match: /value[- ]realis|value[- ]realiz|reviews?\b/i,
  },
  {
    id: "l3",
    short: "framework-agreement push",
    name: "L3 · Framework-agreement push",
    what: "Two sales engineers convert one-off accounts to 3-year managed-service contracts, the contract type Kessler tendered in Task 2.",
    rope: "Economic + Contractual",
    cost: { none: 0, partial: 65_000, full: 120_000 },
    produces: { none: 0, partial: 3, full: 8 },
    producesUnit: "accounts converted to a framework contract (before adjustments)",
    match: /framework/i,
  },
];

export const LEVER_BY_ID = Object.fromEntries(LEVERS.map((l) => [l.id, l])) as Record<LeverId, Lever>;

export type Levers = Record<LeverId, Position>;

export type GId = "G1" | "G2" | "G3" | "G4" | "G5" | "G6";
export const G_IDS: GId[] = ["G1", "G2", "G3", "G4", "G5", "G6"];

export type Board = {
  cost: number;
  over: number;
  owners: number;
  reviews: number;
  /** L3 conversions after the sequence adjustment, per scenario. */
  conversions: Record<Scenario, number>;
  /** True when L3 is above None while L1 is None. */
  sequenceHit: boolean;
  uncovered: number;
  segments: { id: LeverId; cost: number }[];
};

/** The whole board, computed. Sequence: L1 = None halves L3. Price War: halves L3 again. Rounded down each time. */
export function computeBoard(levers: Levers): Board {
  const cost = LEVER_IDS.reduce((s, id) => s + LEVER_BY_ID[id].cost[levers[id]], 0);
  const raw = LEVER_BY_ID.l3.produces[levers.l3];
  const sequenceHit = levers.l3 !== "none" && levers.l1 === "none";
  const afterSequence = sequenceHit ? Math.floor(raw / 2) : raw;
  const reviews = LEVER_BY_ID.l2.produces[levers.l2];
  return {
    cost,
    over: Math.max(0, cost - CAP),
    owners: LEVER_BY_ID.l1.produces[levers.l1],
    reviews,
    conversions: { statusQuo: afterSequence, priceWar: Math.floor(afterSequence / 2) },
    sequenceHit,
    uncovered: POOL - reviews,
    segments: LEVER_IDS.map((id) => ({ id, cost: LEVER_BY_ID[id].cost[levers[id]] })),
  };
}
