"use client";

import { useState } from "react";
import clsx from "clsx";
import { useProgress } from "@/lib/store";
import { exportFilenameExplicit, printHtmlDocument } from "@/lib/downloadFile";
import { scrollToAndFlash } from "@/lib/scrollToAndFlash";
import { markRouteExported } from "@/lib/routeGating";
import { MissingList } from "@/components/ui/MissingList";
import { ChevronDown } from "@/components/icons/LineIcons";
import { EXPORT2 } from "@/lib/route1";
import { CASE } from "@/lib/routes";
import { useRoute1, domId } from "./useRoute1";
import { buildTask2Html } from "./exportDocuments";

/**
 * Task 2's own export bar. Never disabled (CLAUDE.md #3): clicking while
 * incomplete opens the itemized missing list and jumps to the first gap.
 *
 * Marks Route 1 as exported (Task 2 is the later of its two exports) so
 * Route 2's soft "finish Route 1 first" banner clears — a suggestion only,
 * never a lock (CLAUDE.md §6).
 */
export function ExportBar2() {
  const r1 = useRoute1();
  const toggleCheck = useProgress((s) => s.toggleCheck);
  const [showMissing, setShowMissing] = useState(false);

  const handleExport = () => {
    if (!r1.task2Complete) {
      setShowMissing(true);
      const first = r1.task2Missing[0];
      if (first) {
        first.before?.();
        window.setTimeout(() => scrollToAndFlash(first.id), first.before ? 40 : 0);
      }
      return;
    }
    const filename = exportFilenameExplicit(r1.name, CASE.day, 1, EXPORT2.taskSlug);
    printHtmlDocument(filename, buildTask2Html(r1));
    markRouteExported(toggleCheck, 1);
    setShowMissing(false);
  };

  return (
    <div id={domId.export2} className="sticky bottom-0 z-20 -mx-4 border-t border-line bg-paper/95 px-4 py-3 backdrop-blur md:-mx-6 md:px-6 print:hidden">
      {showMissing && r1.task2Missing.length > 0 && (
        <div className="mb-2 max-h-52 overflow-y-auto rounded-xl border border-line bg-canvas p-3">
          <MissingList items={r1.task2Missing} lead="Still needed before exporting Task 2:" />
        </div>
      )}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <button type="button" onClick={() => setShowMissing((v) => !v)} className="flex flex-wrap items-center gap-x-1.5 text-caption text-ash hover:text-ink">
          <span>
            Task 2: <span className="tabular-nums font-semibold text-ink">{r1.options.filter((o) => o.fullyScored).length}</span>/3 lines assessed
          </span>
          {r1.task2Missing.length > 0 && (
            <>
              <span className="text-ash">
                · {r1.task2Missing.length} item{r1.task2Missing.length === 1 ? "" : "s"} still needed
              </span>
              <ChevronDown className={clsx("h-3.5 w-3.5 transition-transform duration-150", showMissing && "rotate-180")} />
            </>
          )}
        </button>
        <button type="button" onClick={handleExport} className="btn-accent">
          {EXPORT2.buttonLabel}
        </button>
      </div>
    </div>
  );
}
