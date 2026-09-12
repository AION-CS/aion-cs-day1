"use client";

import { useState } from "react";
import clsx from "clsx";
import { useProgress } from "@/lib/store";
import { markRouteExported } from "@/lib/routeGating";
import { useRoute2 } from "./useRoute2";
import { useMemoData } from "./useMemoData";
import { buildReportJson, buildReportHtml } from "./exportDocuments";
import { exportFilename, downloadTextFile } from "@/lib/downloadFile";
import { scrollToAndFlash } from "@/lib/scrollToAndFlash";
import { MissingList } from "@/components/ui/MissingList";
import { TASK2 } from "@/lib/route2";
import { ChevronDown } from "@/components/icons/LineIcons";

/** Sticky bottom export bar. Never disabled — incomplete clicks jump to what's missing instead of doing nothing. */
export function ExportBar() {
  const r2 = useRoute2();
  const memo = useMemoData();
  const toggleCheck = useProgress((s) => s.toggleCheck);
  const [showMissing, setShowMissing] = useState(false);

  const stages = [r2.stage1Complete, r2.stage2Complete, r2.stage3Complete];
  const doneStages = stages.filter(Boolean).length;

  const handleExport = () => {
    if (!r2.allComplete) {
      setShowMissing(true);
      if (r2.missing[0]) scrollToAndFlash(r2.missing[0].id);
      return;
    }
    const filename = exportFilename(r2.name, TASK2.export.filenameLevel, TASK2.export.filenameTask);
    downloadTextFile(`${filename}.json`, buildReportJson(r2, memo, filename), "application/json");
    downloadTextFile(`${filename}.html`, buildReportHtml(memo), "text/html");
    markRouteExported(toggleCheck, 2);
  };

  return (
    <div
      id="r2-export"
      className="sticky bottom-0 z-20 -mx-4 border-t border-line bg-paper/95 px-4 py-3 backdrop-blur md:-mx-6 md:px-6"
    >
      {showMissing && r2.missing.length > 0 && (
        <div className="mb-2 max-h-56 overflow-y-auto rounded-xl border border-line bg-canvas p-3">
          <MissingList items={r2.missing} lead="Still needed before export:" />
        </div>
      )}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <button
          type="button"
          onClick={() => setShowMissing((v) => !v)}
          className="flex items-center gap-1.5 text-caption text-ash hover:text-ink"
        >
          <span className="tabular-nums font-semibold text-ink">{doneStages}</span> / {stages.length} stages complete
          {r2.missing.length > 0 && (
            <>
              <span className="text-ash">·</span>
              <span className="tabular-nums">{r2.missing.length} open</span>
              <ChevronDown className={clsx("h-3.5 w-3.5 transition-transform duration-150", showMissing && "rotate-180")} />
            </>
          )}
        </button>
        <button type="button" onClick={handleExport} className="btn-accent">
          Export Prioritisation Memo
        </button>
      </div>
    </div>
  );
}
