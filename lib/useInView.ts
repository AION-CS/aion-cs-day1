"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Fires once, when the element first scrolls into view. Moved out of Day 11's
 * MaterialDiagrams so every diagram that reveals on scroll shares one copy.
 */
export function useInView<T extends Element>(threshold = 0.35) {
  const ref = useRef<T | null>(null);
  const [seen, setSeen] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || seen) return;
    if (typeof IntersectionObserver === "undefined") {
      setSeen(true);
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) setSeen(true);
      },
      { threshold },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [seen, threshold]);

  return { ref, seen };
}
