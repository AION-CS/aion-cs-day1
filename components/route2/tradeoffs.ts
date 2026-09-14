import { isFactorId, type FactorId } from "@/lib/route2";

export type TradeOffLink = { a: FactorId; b: FactorId; note: string };

export function parseLinks(raw: string | undefined): TradeOffLink[] {
  try {
    const value: unknown = JSON.parse(raw ?? "[]");
    if (!Array.isArray(value)) return [];
    return value.filter(
      (v): v is TradeOffLink =>
        !!v && typeof v === "object" && isFactorId((v as TradeOffLink).a) && isFactorId((v as TradeOffLink).b) && typeof (v as TradeOffLink).note === "string",
    );
  } catch {
    return [];
  }
}

export const serialiseLinks = (links: TradeOffLink[]) => JSON.stringify(links);

const samePair = (l: TradeOffLink, a: FactorId, b: FactorId) => (l.a === a && l.b === b) || (l.a === b && l.b === a);

export function addLink(links: TradeOffLink[], a: FactorId, b: FactorId, max: number): TradeOffLink[] {
  if (a === b || links.length >= max || links.some((l) => samePair(l, a, b))) return links;
  return [...links, { a, b, note: "" }];
}

export function removeLink(links: TradeOffLink[], a: FactorId, b: FactorId): TradeOffLink[] {
  return links.filter((l) => !samePair(l, a, b));
}

export function setLinkNote(links: TradeOffLink[], a: FactorId, b: FactorId, note: string): TradeOffLink[] {
  return links.map((l) => (samePair(l, a, b) ? { ...l, note } : l));
}

/** How many links touch a given factor — used to draw connection weight. */
export function linksFor(links: TradeOffLink[], id: FactorId): TradeOffLink[] {
  return links.filter((l) => l.a === id || l.b === id);
}
