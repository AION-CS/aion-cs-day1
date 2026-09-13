"use client";

import clsx from "clsx";
import { useProgress, useHydrated } from "@/lib/store";
import { scrollToAndFlash } from "@/lib/scrollToAndFlash";
import { ENGAGEMENT, EXPORT, HORIZONS, R1, ROOT_CAUSES, areaById } from "@/lib/route1";
import { useRoute1, domId } from "./useRoute1";

const rootLabel = (id: string | null) =>
  ROOT_CAUSES.find((r) => r.id === id)?.label ?? "— not tagged";
const horizonLabel = (id: string | null) =>
  HORIZONS.find((h) => h.id === id)?.label ?? "— not tagged";

/** The date line. Client-only, so the static export stays stable. */
export function useReportDate() {
  const hydrated = useHydrated();
  return hydrated
    ? new Date().toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })
    : "";
}

/**
 * Part 1 of the Engagement Report, assembling live as signals are filed.
 *
 * Every line carries an Edit button that reopens that signal's working panel
 * with all four values intact (CLAUDE.md #5) — the report is a view of the
 * learner's answers, never a second copy of them.
 */
export function ReportPanel() {
  const r1 = useRoute1();
  const choose = useProgress((s) => s.choose);
  const date = useReportDate();

  const edit = (signalId: string) => {
    choose(R1.openSignal, signalId);
    window.setTimeout(() => scrollToAndFlash(domId.signal(signalId), "ref"), 40);
  };

  return (
    <div className="rounded-2xl border border-line bg-paper p-5">
      <p className="text-micro font-semibold uppercase tracking-wide text-accent">
        {EXPORT.docHeading}
      </p>
      <p className="text-caption font-semibold text-ink">{EXPORT.partOne}</p>
      <p className="mt-1 text-caption text-ash">
        <span className="font-semibold text-ink">{r1.name.trim() || "[your name]"}</span>
        {date ? ` · ${date}` : ""} · Case: {ENGAGEMENT.company}
      </p>

      <div className="mt-4">
        <p className="text-micro font-semibold uppercase tracking-wide text-ash">Findings</p>
        {r1.reportRows.length === 0 ? (
          <p className="mt-2 rounded-xl border border-dashed border-line bg-canvas p-3 text-caption text-ash">
            Assign an area to your first signal on the left and it appears here.
          </p>
        ) : (
          <ul className="mt-2 space-y-2">
            {r1.reportRows.map((f) => (
              <li key={f.signal.id} className="rounded-xl border border-line bg-canvas p-3">
                <div className="flex items-start justify-between gap-2">
                  <p className="text-caption font-semibold text-ink">
                    {f.signal.n}. {f.signal.title}
                  </p>
                  <span
                    className={clsx(
                      "shrink-0 rounded-full px-2 py-0.5 text-micro font-semibold",
                      f.complete ? "bg-accentSoft text-accent" : "border border-line text-ash",
                    )}
                  >
                    {f.complete ? "filed" : "in progress"}
                  </span>
                </div>
                <dl className="mt-1.5 space-y-1 text-micro">
                  <Row label="Area" value={f.area ? areaById(f.area).name : "— not assigned"} />
                  <Row label="Root cause" value={rootLabel(f.rootCause)} />
                  <Row label="Horizon" value={horizonLabel(f.horizon)} />
                  {f.approach && (
                    <div className="pt-0.5">
                      <dt className="text-ash">First step</dt>
                      <dd className="mt-0.5 italic text-ink">&ldquo;{f.approach}&rdquo;</dd>
                    </div>
                  )}
                </dl>
                <button
                  type="button"
                  onClick={() => edit(f.signal.id)}
                  className="mt-2 text-micro font-semibold text-accent underline decoration-dotted underline-offset-2 hover:text-accentHi"
                >
                  Edit this finding
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="mt-5 border-t border-line pt-4">
        <p className="text-micro font-semibold uppercase tracking-wide text-ash">Split so far</p>
        <p className="mt-1.5 text-caption text-ink">
          <span className="font-semibold tabular-nums">{r1.completeCount}</span> of {r1.totalSignals}{" "}
          findings filed
        </p>
        <p className="mt-1 text-micro text-ash">
          {r1.measurementCount} measurement · {r1.architectureCount} architecture ·{" "}
          {r1.shortCount} short-term · {r1.structuralCount} structural
        </p>
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex gap-2">
      <dt className="w-20 shrink-0 text-ash">{label}</dt>
      <dd className="min-w-0 flex-1 text-ink">{value}</dd>
    </div>
  );
}
