"use client";

import { useState } from "react";
import clsx from "clsx";
import { useProgress } from "@/lib/store";
import { markRouteExported } from "@/lib/routeGating";
import { exportFilename, downloadTextFile } from "@/lib/downloadFile";
import { scrollToAndFlash } from "@/lib/scrollToAndFlash";
import { SavedIndicator } from "@/components/ui/SavedIndicator";
import { MissingList } from "@/components/ui/MissingList";
import { ChevronDown } from "@/components/icons/LineIcons";
import { EXPORT, R2, REFLECTION } from "@/lib/route2";
import { useRoute2, domId } from "./useRoute2";
import { buildMemoHtml, buildMemoJson, type ReflectionExport } from "./exportDocuments";

/**
 * Route 2's sticky export bar. Never disabled (CLAUDE.md #3): the first click
 * while incomplete opens the itemised missing list and jumps to the first
 * gap; "Export anyway (incomplete)" always works and stamps both documents.
 */
export function ExportBar() {
  const r2 = useRoute2();
  const toggleCheck = useProgress((s) => s.toggleCheck);
  const [showMissing, setShowMissing] = useState(false);

  const draftedCount = Object.values(r2.drafted).filter(Boolean).length;

  const doExport = (incomplete: boolean) => {
    const filename = exportFilename(r2.name, EXPORT.filenameLevels, EXPORT.filenameTask);
    // The reflection journal is deliberately outside useRoute2 (§7.8: never
    // validated, never graded) — read it here, at the one moment it might be
    // exported, rather than exposing it from the hook.
    const state = useProgress.getState();
    const reflection: ReflectionExport = state.checks[R2.reflectionInclude]
      ? REFLECTION.questions.map((q) => ({ question: q.label, answer: state.notes[R2.reflection(q.id)] ?? "" }))
      : null;
    downloadTextFile(`${filename}.json`, buildMemoJson(r2, filename, incomplete, reflection), "application/json");
    downloadTextFile(`${filename}.html`, buildMemoHtml(r2, incomplete, reflection), "text/html");
    markRouteExported(toggleCheck, 2);
    setShowMissing(false);
  };

  const handleExport = () => {
    if (!r2.allComplete) {
      setShowMissing(true);
      const first = r2.missing[0];
      if (first) window.setTimeout(() => scrollToAndFlash(first.id), 0);
      return;
    }
    doExport(false);
  };

  return (
    <div id={domId.export} className="sticky bottom-0 z-20 -mx-4 border-t border-line bg-paper/95 px-4 py-3 backdrop-blur md:-mx-6 md:px-6 print:hidden">
      {showMissing && r2.missing.length > 0 && (
        <div className="mb-2 max-h-52 space-y-3 overflow-y-auto rounded-xl border border-line bg-canvas p-3">
          <MissingList items={r2.missing} lead="Still needed before export:" />
          <button
            type="button"
            onClick={() => doExport(true)}
            className="rounded-lg border border-warn/50 bg-warn/5 px-3 py-1.5 text-caption font-semibold text-warn transition-colors duration-150 hover:bg-warn/10"
          >
            {EXPORT.anywayLabel}
          </button>
        </div>
      )}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-x-1.5 gap-y-1">
          <button type="button" onClick={() => setShowMissing((v) => !v)} className="flex flex-wrap items-center gap-x-1.5 text-caption text-ash hover:text-ink">
            <span>
              <span className="tabular-nums font-semibold text-ink">{draftedCount}</span> / 8 memo sections drafted
            </span>
            {r2.missing.length > 0 && (
              <>
                <span className="text-ash">
                  · {r2.missing.length} item{r2.missing.length === 1 ? "" : "s"} still needed
                </span>
                <ChevronDown className={clsx("h-3.5 w-3.5 transition-transform duration-150", showMissing && "rotate-180")} />
              </>
            )}
          </button>
          <span className="mx-1 hidden text-ash sm:inline">·</span>
          <SavedIndicator />
          {r2.mentorSample && <span className="rounded-full border border-warn/40 bg-warn/10 px-2 py-0.5 text-micro font-semibold text-warn">{EXPORT.mentorStamp}</span>}
        </div>
        <button type="button" onClick={handleExport} className="btn-accent">
          {EXPORT.buttonLabel}
        </button>
      </div>
    </div>
  );
}
