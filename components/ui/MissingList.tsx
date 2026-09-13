"use client";

import { scrollToAndFlash } from "@/lib/scrollToAndFlash";

export type MissingItem = {
  id: string;
  label: string;
  /**
   * Run before scrolling — opens whatever container the target lives in (a
   * collapsed card, a hidden tab). Without it a missing entry pointing into a
   * closed panel would scroll to nothing, which is the dead click CLAUDE.md #2
   * exists to prevent.
   */
  before?: () => void;
};

/** A "still needed" list whose items jump to (and briefly flash) the section that needs attention. */
export function MissingList({ items, lead = "Still needed:" }: { items: MissingItem[]; lead?: string }) {
  if (items.length === 0) return null;
  return (
    <div className="text-caption text-ash">
      <p>{lead}</p>
      <ul className="mt-1 list-disc space-y-0.5 pl-5">
        {items.map((m, i) => (
          <li key={`${m.id}-${i}`}>
            <button
              type="button"
              onClick={() => {
                m.before?.();
                // Let the container render before we try to scroll into it.
                window.setTimeout(() => scrollToAndFlash(m.id), m.before ? 40 : 0);
              }}
              className="text-left underline decoration-dotted underline-offset-2 hover:text-ink"
            >
              {m.label}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
