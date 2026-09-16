import type { QuadrantId } from "@/lib/route2";

/**
 * Geometry of the trade-off map, shared by the live exercise, the memo panel
 * and the exported HTML so all three always draw the same picture.
 *
 * x = momentum cost (low left → high right)
 * y = structural impact (high top → low bottom)
 */
export const MAP = { w: 440, h: 330, x0: 52, x1: 430, y0: 12, y1: 282 } as const;

export const MID_X = (MAP.x0 + MAP.x1) / 2;
export const MID_Y = (MAP.y0 + MAP.y1) / 2;

export function quadrantRect(q: QuadrantId) {
  const left = q === "quick" || q === "noise";
  const top = q === "quick" || q === "bet";
  return {
    x: left ? MAP.x0 : MID_X,
    y: top ? MAP.y0 : MID_Y,
    w: (MAP.x1 - MAP.x0) / 2,
    h: (MAP.y1 - MAP.y0) / 2,
  };
}

/** Where the n-th of `count` measures in a quadrant sits. */
export function slotPosition(q: QuadrantId, index: number, count: number) {
  const r = quadrantRect(q);
  const spread = 46;
  return {
    x: r.x + r.w / 2 + (index - (count - 1) / 2) * spread,
    y: r.y + r.h / 2 + 12,
  };
}
