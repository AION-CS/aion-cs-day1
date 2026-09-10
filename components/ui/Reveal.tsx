"use client";

import { useEffect, useRef, useState } from "react";
import clsx from "clsx";

/**
 * Fade-and-rise once, when the element first scrolls into view. Uses
 * IntersectionObserver; the .fade-up base (and its reduced-motion override)
 * lives in globals.css. Once the rise has played we drop the fade classes
 * entirely, so no promoted compositing layer lingers behind the element.
 * `delay` staggers siblings in a row.
 */
export function Reveal({
  children,
  className,
  delay = 0,
  as: Tag = "div",
  id,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  as?: keyof JSX.IntrinsicElements;
  /** Anchor for scroll-to-and-flash targets (material sections cited by a task step). */
  id?: string;
}) {
  const ref = useRef<HTMLElement | null>(null);
  const [visible, setVisible] = useState(false);
  const [settled, setSettled] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === "undefined") {
      setVisible(true);
      setSettled(true);
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            setVisible(true);
            io.disconnect();
          }
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // Once revealed, let the transition finish then shed the animation classes.
  useEffect(() => {
    if (!visible || settled) return;
    const t = setTimeout(() => setSettled(true), 800 + delay);
    return () => clearTimeout(t);
  }, [visible, settled, delay]);

  const Comp = Tag as any;
  return (
    <Comp
      ref={ref as any}
      id={id}
      className={clsx(!settled && "fade-up", visible && !settled && "is-visible", className)}
      style={!settled && delay ? { transitionDelay: `${delay}ms` } : undefined}
    >
      {children}
    </Comp>
  );
}
