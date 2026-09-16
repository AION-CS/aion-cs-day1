import clsx from "clsx";

/**
 * An HTML label pinned to a point in an SVG's coordinate system.
 *
 * SVG text scales with the viewBox, so a diagram that is legible on a laptop
 * shrinks to unreadable on a 360 px phone. The Day 13 diagrams therefore draw
 * shapes in SVG and set their words in HTML on top, positioned in percentages
 * of the viewBox — the words stay at their CSS size at every width.
 *
 * The parent must be `relative` and sized by the SVG.
 */
export function Overlay({
  x,
  y,
  vw,
  vh,
  align = "center",
  valign = "middle",
  className,
  children,
}: {
  x: number;
  y: number;
  vw: number;
  vh: number;
  align?: "start" | "center" | "end";
  valign?: "top" | "middle" | "bottom";
  className?: string;
  children: React.ReactNode;
}) {
  const tx = align === "center" ? "-50%" : align === "end" ? "-100%" : "0";
  const ty = valign === "middle" ? "-50%" : valign === "bottom" ? "-100%" : "0";
  // Rounded to 4dp: trig-derived x/y can differ in the last bit or two between
  // the server's and the browser's JS engine, and an unrounded float printed
  // straight into a percentage string turns that into a hydration mismatch.
  // 4dp is far finer than any layout can render, so nothing here is visibly
  // rounded.
  const pct = (v: number, total: number) => `${((v / total) * 100).toFixed(4)}%`;
  return (
    <span
      className={clsx("pointer-events-none absolute whitespace-nowrap", className)}
      style={{ left: pct(x, vw), top: pct(y, vh), transform: `translate(${tx}, ${ty})` }}
    >
      {children}
    </span>
  );
}

/** A safe id for SVG <pattern> references: React's useId contains colons. */
export const svgId = (reactId: string, name: string) => `${name}-${reactId.replace(/[^a-zA-Z0-9_-]/g, "")}`;
