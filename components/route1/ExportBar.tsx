"use client";

import { useState } from "react";
import { useProgress } from "@/lib/store";
import { markRouteExported } from "@/lib/routeGating";
import { useRoute1 } from "./useRoute1";
import { useDecisionReportData } from "./useDecisionReportData";
import { buildReportJson, buildReportHtml } from "./exportDocuments";
import { exportFilename, downloadTextFile } from "@/lib/downloadFile";
import { scrollToAndFlash } from "@/lib/scrollToAndFlash";
import { MissingList } from "@/components/ui/MissingList";
import { TASK1 } from "@/lib/route1";
import { ChevronDown } from "@/components/icons/LineIcons";
import clsx from "clsx";

/** Sticky bottom export bar. Never disabled — incomplete clicks jump to what's missing instead of doing nothing. */
export function ExportBar() {
  const r1 = useRoute1();
  const report = useDecisionReportData();
  const toggleCheck = useProgress((s) => s.toggleCheck);
  const [showMissing, setShowMissing] = useState(false);

  const total = 4; // stages 2, 3, 4, 5 — the name field is handled separately in the missing list
  const doneStages = [r1.stage2Complete, r1.stage3Complete, r1.stage4Complete, r1.stage5Complete].filter(Boolean).length;

  const handleExport = () => {
    if (!r1.allComplete) {
      setShowMissing(true);
      if (r1.missing[0]) scrollToAndFlash(r1.missing[0].id);
      return;
    }
    const filename = exportFilename(r1.name, TASK1.export.filenameLevel, TASK1.export.filenameTask);
    downloadTextFile(`${filename}.json`, buildReportJson(r1, report, filename), "application/json");
    downloadTextFile(`${filename}.html`, buildReportHtml(report), "text/html");
    markRouteExported(toggleCheck, 1);
  };

  return (
    <div id="r1-export" className="sticky bottom-0 z-20 -mx-4 border-t border-line bg-paper/95 px-4 py-3 backdrop-blur md:-mx-6 md:px-6">
      {showMissing && r1.missing.length > 0 && (
        <div className="mb-2 rounded-xl border border-line bg-canvas p-3">
          <MissingList items={r1.missing} lead="Still needed before export:" />
        </div>
      )}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <button
          type="button"
          onClick={() => setShowMissing((v) => !v)}
          className="flex items-center gap-1.5 text-caption text-ash hover:text-ink"
        >
          <span className="tabular-nums font-semibold text-ink">{doneStages}</span> / {total} checks complete
          {r1.missing.length > 0 && <ChevronDown className={clsx("h-3.5 w-3.5 transition-transform duration-150", showMissing && "rotate-180")} />}
        </button>
        <button type="button" onClick={handleExport} className="btn-accent">
          Export Decision Brief
        </button>
      </div>
    </div>
  );
}
