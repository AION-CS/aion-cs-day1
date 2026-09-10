/**
 * Scrolls an element into view and briefly flashes it — used to point at what's
 * missing without navigating away ("warn", red), and to confirm arrival when a
 * material-reference chip jumps back up to the section it cites ("ref", accent).
 * Arriving somewhere you asked to go is not a warning, so the two never share a
 * colour.
 */
export type FlashVariant = "warn" | "ref";

export function scrollToAndFlash(id: string, variant: FlashVariant = "warn") {
  const el = document.getElementById(id);
  if (!el) return;
  const cls = variant === "ref" ? "anim-flash-ref" : "anim-flash-warn";
  el.scrollIntoView({ behavior: "smooth", block: "center" });
  el.classList.remove(cls);
  // Force reflow so the animation restarts if it's already flashing.
  void el.offsetWidth;
  el.classList.add(cls);
  window.setTimeout(() => el.classList.remove(cls), 1200);
}
