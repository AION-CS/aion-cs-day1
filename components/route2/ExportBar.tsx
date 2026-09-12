"use client";

import { useState } from "react";
import clsx from "clsx";
import { useProgress } from "@/lib/store";
import { markRouteExported } from "@/lib/routeGating";
import { exportFilename, downloadTextFile } from "@/lib/downloadFile";
import { scrollToAndFlash } from "@/lib/scrollToAndFlash";
import { MissingList } from "@/components/ui/MissingList";
import { ChevronDown } from "@/components/icons/LineIcons";
import { TASK2 } from "@/lib/route2";
import { useRoute2, domId } from "./useRoute2";
import { buildMemoJson, buildMemoHtml } from "./exportDocuments";

/** Sticky export bar. Never disabled — an incomplete click jumps to the first gap (CLAUDE.md #3). */
export function ExportBar() {
  const r2 = useRoute2();
  const toggleCheck = useProgress((s) => s.toggleCheck);
  const [showMissing, setShowMissing] = useState(false);

  const handleExport = () => {
    if (!r2.allComplete) {
      setShowMissing(true);
      if (r2.missing[0]) scrollToAndFlash(r2.missing[0].id);
      return;
    }
    const filename = exportFilename(r2.name, TASK2.export.filenameLevel, TASK2.export.filenameTask);
    downloadTextFile(`${filename}.json`, buildMemoJson(r2, filename), "application/json");
    downloadTextFile(`${filename}.html`, buildMemoHtml(r2), "text/html");
    markRouteExported(toggleCheck, 2);
    setShowMissing(false);
  };

  return (
    <div
      id={domId.export}
      className="sticky bottom-0 z-20 -mx-4 border-t border-line bg-paper/95 px-4 py-3 backdrop-blur md:-mx-6 md:px-6 print:hidden"
    >
      {showMissing && r2.missing.length > 0 && (
        <div className="mb-2 max-h-52 overflow-y-auto rounded-xl border border-line bg-canvas p-3">
          <MissingList items={r2.missing} lead="Still needed before export:" />
        </div>
      )}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <button
          type="button"
          onClick={() => setShowMissing((v) => !v)}
          className="flex items-center gap-1.5 text-caption text-ash hover:text-ink"
        >
          <span className="tabular-nums font-semibold text-ink">{r2.revealedCount}</span> /{" "}
          {r2.totalOptions} profiles revealed
          {r2.missing.length > 0 && (
            <>
              <span className="text-ash">
                · {r2.missing.length} item{r2.missing.length === 1 ? "" : "s"} still needed
              </span>
              <ChevronDown
                className={clsx("h-3.5 w-3.5 transition-transform duration-150", showMissing && "rotate-180")}
              />
            </>
          )}
        </button>
        <button type="button" onClick={handleExport} className="btn-accent">
          {TASK2.export.buttonLabel}
        </button>
      </div>
    </div>
  );
}
