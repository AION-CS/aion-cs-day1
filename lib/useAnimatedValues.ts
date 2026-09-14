"use client";

import { useEffect, useRef, useState } from "react";

/**
 * The array form of useAnimatedNumber: eases every value toward its target on
 * each change, with requestAnimationFrame rather than a library. SVG `points`
 * and `d` attributes cannot be CSS-transitioned reliably across browsers, so a
 * radar polygon or a wheel segment animates by interpolating its numbers.
 *
 * Respects prefers-reduced-motion by jumping straight to the target. A change
 * in array length also jumps, since there is nothing to interpolate from.
 */
export function useAnimatedValues(targets: readonly number[], duration = 450): number[] {
  const key = targets.join(",");
  const [values, setValues] = useState<number[]>(() => [...targets]);
  const current = useRef<number[]>([...targets]);
  const frame = useRef<number | null>(null);

  useEffect(() => {
    const to = key === "" ? [] : key.split(",").map(Number);
    const reduce =
      typeof matchMedia !== "undefined" && matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (frame.current !== null) cancelAnimationFrame(frame.current);

    if (reduce || current.current.length !== to.length) {
      current.current = to;
      setValues(to);
      return;
    }

    const from = current.current.slice();
    if (from.every((v, i) => v === to[i])) return;

    const start = performance.now();
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      const next = from.map((f, i) => f + (to[i] - f) * eased);
      current.current = next;
      setValues(next);
      if (t < 1) frame.current = requestAnimationFrame(tick);
      else frame.current = null;
    };
    frame.current = requestAnimationFrame(tick);

    return () => {
      if (frame.current !== null) cancelAnimationFrame(frame.current);
    };
  }, [key, duration]);

  return values;
}
