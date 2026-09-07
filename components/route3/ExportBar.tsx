"use client";

import { useState } from "react";
import { useProgress } from "@/lib/store";
import { markRouteExported } from "@/lib/routeGating";
import { useRoute3 } from "./useRoute3";
import { useManagementReportData } from "./useManagementReportData";
import { buildReportJson, buildReportHtml } from "./exportDocuments";
import { day7ExportFilename, downloadTextFile } from "@/lib/downloadFile";
import { scrollToAndFlash } from "@/lib/scrollToAndFlash";
import { MissingList } from "@/components/ui/MissingList";
import { TASK3 } from "@/lib/route3";
import { ChevronDown } from "@/components/icons/LineIcons";
import clsx from "clsx";

/** Sticky bottom export bar. Never disabled — incomplete clicks jump to what's missing instead of doing nothing. */
export function ExportBar() {
  const r3 = useRoute3();
  const report = useManagementReportData();
  const toggleCheck = useProgress((s) => s.toggleCheck);
  const [showMissing, setShowMissing] = useState(false);

  const total = 4; // stages 2, 3, 4, 6 (stage 1 briefing and stage 5 bridge are never gating)
  const doneStages = [r3.stage2Complete, r3.stage3Complete, r3.stage4Complete, r3.stage6Complete].filter(Boolean).length;

  const handleExport = () => {
    if (!r3.allComplete) {
      setShowMissing(true);
      if (r3.missing[0]) scrollToAndFlash(r3.missing[0].id);
      return;
    }
    const filename = day7ExportFilename(r3.name, TASK3.export.filenameLevel, TASK3.export.filenameTask);
    downloadTextFile(`${filename}.json`, buildReportJson(r3, report, filename), "application/json");
    downloadTextFile(`${filename}.html`, buildReportHtml(report), "text/html");
    markRouteExported(toggleCheck, 3);
  };

  return (
    <div id="r3-export" className="sticky bottom-0 z-20 -mx-4 border-t border-line bg-paper/95 px-4 py-3 backdrop-blur md:-mx-6 md:px-6">
      {showMissing && r3.missing.length > 0 && (
        <div className="mb-2 rounded-xl border border-line bg-canvas p-3">
          <MissingList items={r3.missing} lead="Still needed before export:" />
        </div>
      )}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <button type="button" onClick={() => setShowMissing((v) => !v)} className="flex items-center gap-1.5 text-caption text-ash hover:text-ink">
          <span className="tabular-nums font-semibold text-ink">{doneStages}</span> / {total} stages complete
          {r3.missing.length > 0 && <ChevronDown className={clsx("h-3.5 w-3.5 transition-transform duration-150", showMissing && "rotate-180")} />}
        </button>
        <button type="button" onClick={handleExport} className="btn-accent">
          Export {TASK3.export.taskLabel}
        </button>
      </div>
    </div>
  );
}
