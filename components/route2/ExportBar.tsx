"use client";

import { useState } from "react";
import { useProgress } from "@/lib/store";
import { markRouteExported } from "@/lib/routeGating";
import { useRoute2 } from "./useRoute2";
import { useDecisionMemoData } from "./useDecisionMemoData";
import { buildReportJson, buildReportHtml } from "./exportDocuments";
import { day7ExportFilename, downloadTextFile } from "@/lib/downloadFile";
import { scrollToAndFlash } from "@/lib/scrollToAndFlash";
import { MissingList } from "@/components/ui/MissingList";
import { TASK2, CRITERIA } from "@/lib/route2";
import { ChevronDown } from "@/components/icons/LineIcons";
import clsx from "clsx";

/** Sticky bottom export bar. Never disabled — incomplete clicks jump to what's missing instead of doing nothing. */
export function ExportBar() {
  const r2 = useRoute2();
  const memo = useDecisionMemoData();
  const toggleCheck = useProgress((s) => s.toggleCheck);
  const [showMissing, setShowMissing] = useState(false);

  const total = CRITERIA.length + 1; // 7 criteria + the decision block
  const criteriaDoneAsUnits = CRITERIA.filter((c) => r2.criterionDoneCount(c.id) === 3).length;
  const doneUnits = criteriaDoneAsUnits + (r2.decisionComplete ? 1 : 0);

  const handleExport = () => {
    if (!r2.allComplete) {
      setShowMissing(true);
      if (r2.missing[0]) scrollToAndFlash(r2.missing[0].id);
      return;
    }
    const filename = day7ExportFilename(r2.name, TASK2.export.filenameLevel, TASK2.export.filenameTask);
    downloadTextFile(`${filename}.json`, buildReportJson(r2, memo, filename), "application/json");
    downloadTextFile(`${filename}.html`, buildReportHtml(memo), "text/html");
    markRouteExported(toggleCheck, 2);
  };

  return (
    <div id="r2-export" className="sticky bottom-0 z-20 -mx-4 border-t border-line bg-paper/95 px-4 py-3 backdrop-blur md:-mx-6 md:px-6">
      {showMissing && r2.missing.length > 0 && (
        <div className="mb-2 rounded-xl border border-line bg-canvas p-3">
          <MissingList items={r2.missing} lead="Still needed before export:" />
        </div>
      )}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <button
          type="button"
          onClick={() => setShowMissing((v) => !v)}
          className="flex items-center gap-1.5 text-caption text-ash hover:text-ink"
        >
          <span className="tabular-nums font-semibold text-ink">{doneUnits}</span> / {total} sections complete
          {r2.missing.length > 0 && <ChevronDown className={clsx("h-3.5 w-3.5 transition-transform duration-150", showMissing && "rotate-180")} />}
        </button>
        <button type="button" onClick={handleExport} className="btn-accent">
          Export {TASK2.export.taskLabel}
        </button>
      </div>
    </div>
  );
}
