/** The Dick & Basu loyalty quadrant — shared by Materi A2 (exploratory) and Task 1 Block 1.3 (the live map). */

export type Q = "loyalty" | "latent" | "spurious" | "none";

/** x: relative attitude (0 weak, 1 strong) · y: repeat behaviour (0 high, 1 low), drawn top to bottom. */
export const QUADS: Record<Q, { label: string; x: 0 | 1; y: 0 | 1; example: string }> = {
  loyalty: { label: "Loyalty", x: 1, y: 0, example: "Recommends the supplier and re-orders." },
  latent: { label: "Latent loyalty", x: 1, y: 1, example: "Recommends the supplier, yet a procurement policy forces three offers." },
  spurious: { label: "Spurious loyalty", x: 0, y: 0, example: "Stays only because exit is expensive." },
  none: { label: "No loyalty", x: 0, y: 1, example: "Neither a positive attitude nor repeat orders." },
};

export const QGEOM = { x0: 70, y0: 22, w: 250, h: 130 };

export const quadCenter = (q: Q) => ({
  x: QGEOM.x0 + QUADS[q].x * QGEOM.w + QGEOM.w / 2,
  y: QGEOM.y0 + QUADS[q].y * QGEOM.h + QGEOM.h / 2,
});

export type Attitude = "strong" | "weak" | null;
export type Behaviour = "high" | "low" | null;

export function quadOf(att: "strong" | "weak", beh: "high" | "low"): Q {
  if (att === "strong") return beh === "high" ? "loyalty" : "latent";
  return beh === "high" ? "spurious" : "none";
}
