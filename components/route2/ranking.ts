import { CRITERIA, type CriterionId } from "@/lib/route2";

/** Ordered list of up to RANK_SLOTS chosen criteria, e.g. ["risk", "leverage", "controllability"]. */
export type CriteriaOrder = CriterionId[];

const isCriterionId = (v: string): v is CriterionId => CRITERIA.some((c) => c.id === v);

export function parseCriteriaOrder(raw: string | undefined): CriteriaOrder {
  return (raw ?? "").split("|").filter(isCriterionId);
}

export const serialiseCriteriaOrder = (order: CriteriaOrder) => order.join("|");

/** Click to add (up to `slots`), click a placed one to remove, or reorder by index swap. */
export function addCriterion(order: CriteriaOrder, id: CriterionId, slots: number): CriteriaOrder {
  if (order.includes(id) || order.length >= slots) return order;
  return [...order, id];
}

export const removeCriterion = (order: CriteriaOrder, id: CriterionId): CriteriaOrder => order.filter((x) => x !== id);

export function moveCriterion(order: CriteriaOrder, index: number, dir: -1 | 1): CriteriaOrder {
  const target = index + dir;
  if (target < 0 || target >= order.length) return order;
  const next = [...order];
  [next[index], next[target]] = [next[target], next[index]];
  return next;
}
