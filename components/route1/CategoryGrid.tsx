"use client";

import clsx from "clsx";
import { Icon } from "@/components/icons/LineIcons";
import { CATEGORIES, type Category, type CategoryId } from "@/lib/route1";

/**
 * `six-category-grid` — the legend for Section E, and the same glyph + name
 * pairing reused as the headers of Task 1's six drop-bins. Built as one
 * component so a bin can never drift visually from the material block that
 * taught it.
 */

/** The icon + number badge alone. Used at three sizes: grid, bin header, report row. */
export function CategoryGlyph({
  category,
  size = "md",
  active = false,
  className,
}: {
  category: Category;
  size?: "sm" | "md";
  active?: boolean;
  className?: string;
}) {
  return (
    <span
      className={clsx(
        "relative flex shrink-0 items-center justify-center rounded-xl transition-colors duration-150",
        size === "sm" ? "h-8 w-8" : "h-11 w-11",
        active ? "bg-accent text-paper" : "bg-accentSoft text-accent",
        className,
      )}
    >
      <Icon name={category.icon} className={size === "sm" ? "h-4 w-4" : "h-5 w-5"} />
      <span
        className={clsx(
          "absolute -right-1.5 -top-1.5 flex items-center justify-center rounded-full border text-micro font-semibold tabular-nums",
          size === "sm" ? "h-4 w-4" : "h-[18px] w-[18px]",
          active ? "border-accent bg-paper text-accent" : "border-line bg-paper text-ash",
        )}
      >
        {category.n}
      </span>
    </span>
  );
}

/** The 3×2 legend grid. `detailed` adds each category's full Section E paragraph. */
export function SixCategoryGrid({ detailed = false }: { detailed?: boolean }) {
  return (
    <ul
      className={clsx(
        "grid gap-3",
        detailed ? "sm:grid-cols-2" : "sm:grid-cols-2 lg:grid-cols-3",
      )}
    >
      {CATEGORIES.map((c) => (
        <li
          key={c.id}
          id={`r1-category-${c.id}`}
          className="scroll-mt-24 rounded-2xl border border-line bg-paper p-4"
        >
          <div className="flex items-start gap-3">
            <CategoryGlyph category={c} />
            <div className="min-w-0">
              <p className="text-h3 text-ink">{c.name}</p>
              <p className="mt-0.5 text-caption text-ash">{c.short}</p>
            </div>
          </div>
          {detailed && (
            <>
              <p className="mt-3 text-body text-ash">{c.body}</p>
              <p className="mt-3 border-t border-line pt-2 text-micro uppercase tracking-wide text-ash">
                {c.stage}
              </p>
            </>
          )}
        </li>
      ))}
    </ul>
  );
}

export function categoryName(id: CategoryId | null | undefined): string {
  if (!id) return "—";
  return CATEGORIES.find((c) => c.id === id)?.name ?? "—";
}
