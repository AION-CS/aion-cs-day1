import type { SeriesStyle } from "@/components/ui/RadarChart";
import type { OptionId } from "@/lib/route1";

/**
 * One visual identity per option, shared by the matrix chips, the live radar
 * and the exported memo: a colour, a dash pattern and a marker shape, so the
 * three are distinguishable without colour.
 */
export const OPTION_STYLE: Record<OptionId, SeriesStyle> = {
  A: { color: "accent", marker: "circle" },
  B: { color: "ink", dash: "7 4", marker: "square" },
  C: { color: "warn", dash: "2 4", marker: "triangle" },
};

/** Literal colours for the standalone HTML export, which has no Tailwind. */
export const OPTION_HEX: Record<OptionId, string> = {
  A: "#0E7A5A",
  B: "#16191D",
  C: "#B87514",
};
