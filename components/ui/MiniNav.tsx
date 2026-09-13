"use client";

import { useEffect, useRef, useState } from "react";
import clsx from "clsx";
import { scrollToAndFlash } from "@/lib/scrollToAndFlash";

export type MiniNavItem = { id: string; code: string; label: string; anchorId: string };

/**
 * Sticky section rail for a long material block: a progress bar pinned to the
 * top of the viewport and one dot per section down the right-hand side, the
 * active one following the scroll position.
 *
 * Shared by both routes. No animation library — the dot state is a class
 * change and the bar is a transform, both CSS transitions.
 */
export function MiniNav({
  items,
  /** The element the progress bar measures — usually the material wrapper. */
  trackId,
}: {
  items: MiniNavItem[];
  trackId: string;
}) {
  const [active, setActive] = useState(items[0]?.id ?? "");
  const [progress, setProgress] = useState(0);
  const [hovered, setHovered] = useState<string | null>(null);
  const frame = useRef<number | null>(null);

  useEffect(() => {
    const compute = () => {
      frame.current = null;

      // Progress through the tracked block, 0–1.
      const track = document.getElementById(trackId);
      if (track) {
        const rect = track.getBoundingClientRect();
        const total = rect.height - window.innerHeight;
        const done = total > 0 ? Math.min(1, Math.max(0, -rect.top / total)) : rect.top < 0 ? 1 : 0;
        setProgress(done);
      }

      // Active section: the last one whose top is above a third of the viewport.
      const line = window.innerHeight * 0.34;
      let current = items[0]?.id ?? "";
      for (const item of items) {
        const el = document.getElementById(item.anchorId);
        if (!el) continue;
        if (el.getBoundingClientRect().top <= line) current = item.id;
      }
      setActive(current);
    };

    const onScroll = () => {
      if (frame.current !== null) return;
      frame.current = window.requestAnimationFrame(compute);
    };

    compute();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame.current !== null) window.cancelAnimationFrame(frame.current);
    };
  }, [items, trackId]);

  return (
    <>
      {/* Progress bar, pinned to the top of the viewport */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-x-0 top-0 z-40 h-[3px] bg-transparent print:hidden"
      >
        <div
          className="h-full origin-left bg-accent transition-transform duration-150 ease-out"
          style={{ transform: `scaleX(${progress})`, width: "100%" }}
        />
      </div>

      {/* Section dots */}
      <nav
        aria-label="Material sections"
        className="pointer-events-none fixed right-3 top-1/2 z-30 hidden -translate-y-1/2 md:block print:hidden"
      >
        <ol className="pointer-events-auto flex flex-col items-end gap-2">
          {items.map((item) => {
            const isActive = item.id === active;
            const isOpen = hovered === item.id;
            return (
              <li key={item.id}>
                <button
                  type="button"
                  onClick={() => scrollToAndFlash(item.anchorId, "ref")}
                  onMouseEnter={() => setHovered(item.id)}
                  onMouseLeave={() => setHovered(null)}
                  onFocus={() => setHovered(item.id)}
                  onBlur={() => setHovered(null)}
                  aria-current={isActive ? "true" : undefined}
                  title={`${item.code} — ${item.label}`}
                  className={clsx(
                    "flex items-center gap-2 rounded-full border py-1 pl-2.5 pr-2 text-micro font-semibold transition-all duration-200",
                    isActive
                      ? "border-accent bg-accent text-paper shadow-sm"
                      : "border-line bg-paper/90 text-ash hover:border-accent hover:text-accent",
                  )}
                >
                  <span
                    className={clsx(
                      "max-w-0 overflow-hidden whitespace-nowrap transition-all duration-200",
                      isOpen && "max-w-[15rem] pr-0.5",
                    )}
                  >
                    {item.label}
                  </span>
                  <span className="tabular-nums">{item.code}</span>
                </button>
              </li>
            );
          })}
        </ol>
      </nav>
    </>
  );
}
