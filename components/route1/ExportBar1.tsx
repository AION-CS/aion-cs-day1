"use client";

import { useState } from "react";
import clsx from "clsx";
import { exportFilenameExplicit, printHtmlDocument } from "@/lib/downloadFile";
import { scrollToAndFlash } from "@/lib/scrollToAndFlash";
import { MissingList } from "@/components/ui/MissingList";
import { ChevronDown } from "@/components/icons/LineIcons";
import { EXPORT1 } from "@/lib/route1";
import { CASE } from "@/lib/routes";
import { useRoute1, domId } from "./useRoute1";
import { buildTask1Html } from "./exportDocuments";

/**
 * Task 1's own export bar. Never disabled (CLAUDE.md #3): clicking while
 * incomplete opens the itemized missing list and jumps to the first gap.
 */
export function ExportBar1() {
  const r1 = useRoute1();
  const [showMissing, setShowMissing] = useState(false);

  const handleExport = () => {
    if (!r1.task1Complete) {
      setShowMissing(true);
      const first = r1.task1Missing[0];
      if (first) {
        first.before?.();
        window.setTimeout(() => scrollToAndFlash(first.id), first.before ? 40 : 0);
      }
      return;
    }
    const filename = exportFilenameExplicit(r1.name, CASE.day, 1, EXPORT1.taskSlug);
    printHtmlDocument(filename, buildTask1Html(r1));
    setShowMissing(false);
  };

  return (
    <div id={domId.export1} className="sticky bottom-0 z-20 -mx-4 border-t border-line bg-paper/95 px-4 py-3 backdrop-blur md:-mx-6 md:px-6 print:hidden">
      {showMissing && r1.task1Missing.length > 0 && (
        <div className="mb-2 max-h-52 overflow-y-auto rounded-xl border border-line bg-canvas p-3">
          <MissingList items={r1.task1Missing} lead="Still needed before exporting Task 1:" />
        </div>
      )}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <button type="button" onClick={() => setShowMissing((v) => !v)} className="flex flex-wrap items-center gap-x-1.5 text-caption text-ash hover:text-ink">
          <span>
            Task 1: <span className="tabular-nums font-semibold text-ink">{r1.placedCount}</span>/{r1.totalSignals} placed ·{" "}
            <span className="tabular-nums font-semibold text-ink">{r1.areasWithApproach}</span>/6 areas written
          </span>
          {r1.task1Missing.length > 0 && (
            <>
              <span className="text-ash">
                · {r1.task1Missing.length} item{r1.task1Missing.length === 1 ? "" : "s"} still needed
              </span>
              <ChevronDown className={clsx("h-3.5 w-3.5 transition-transform duration-150", showMissing && "rotate-180")} />
            </>
          )}
        </button>
        <button type="button" onClick={handleExport} className="btn-accent">
          {EXPORT1.buttonLabel}
        </button>
      </div>
    </div>
  );
}
