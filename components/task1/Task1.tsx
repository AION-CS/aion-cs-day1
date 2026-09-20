"use client";

import { useState } from "react";
import { RECORDS } from "@/data/kesslerDossier";
import type { RecordId } from "@/data/kesslerDossier";
import { AnswerBlock } from "@/components/ui/AnswerBlock";
import { ExportBar } from "@/components/ui/ExportBar";
import { JourneyMap } from "@/components/ui/JourneyMap";
import type { JPoint, JStage } from "@/components/ui/JourneyMap";
import { MaterialRefs } from "@/components/ui/MaterialRefs";
import { MissingList } from "@/components/ui/MissingList";
import { undoRedoKeyHandler } from "@/components/ui/UndoRedoControls";
import { EvidenceBoard } from "@/components/task1/EvidenceBoard";
import { SortBoard } from "@/components/task1/SortBoard";
import { VerdictBlock } from "@/components/task1/VerdictBlock";
import { MapBlock } from "@/components/task1/MapBlock";
import { diagnosticBody } from "@/lib/exportDoc";
import { IDS, l1Missing } from "@/lib/missing";
import { exportName } from "@/lib/slug";
import { scrollToAndFlash } from "@/lib/flash";
import { usePersisted } from "@/store/usePersisted";
import { useStore } from "@/store/useStore";

const fmtMonth = (v: number) => (v === 0 ? "Month 0" : v > 0 ? `Month +${v}` : `Month −${Math.abs(v)}`);

const STAGES: JStage[] = [
  { id: "ausschreibung", label: "Ausschreibung", from: -5, to: -4, hover: "Ausschreibung (formal tender): Kessler selects a supplier" },
  { id: "contract", label: "Contract", from: -4, to: -4, hover: "Contract signed" },
  { id: "delivery", label: "Delivery", from: -4, to: 0, hover: "Delivery of the migration project" },
  { id: "golive", label: "Go-live", from: 0, to: 0, hover: "Go-live" },
  { id: "hypercare", label: "Hypercare", from: 0, to: 1, hover: "Hypercare, closed at Month +1" },
  { id: "operate", label: "", from: 1, to: 11, dashed: true, unlabelled: true, hover: "Operate & review" },
  { id: "tender", label: "Tender", from: 11, to: 11, hover: "Kessler issues a tender for a three-year service contract" },
];

const POINTS: JPoint[] = RECORDS.map((r) => ({ id: r.id, at: r.at, span: r.span, label: r.id }));

/** Task 1 · Level 1 · the Diagnostic Note. Objective sort + one judged sentence. */
export function Task1() {
  const snapshot = usePersisted();
  const undo = useStore((s) => s.undoPlacement);
  const redo = useStore((s) => s.redoPlacement);
  const [listOpen, setListOpen] = useState(false);
  const [mapSel, setMapSel] = useState<RecordId | null>(null);

  const missing = l1Missing(snapshot);
  const fname = exportName(snapshot.participant.name, "l1-diagnostic");

  const onMapSelect = (id: string) => {
    setMapSel(id as RecordId);
    setListOpen(true);
    window.setTimeout(() => scrollToAndFlash(`rc-${id}`, "ref"), 80);
  };

  return (
    <section id="task-1" className="space-y-5" onKeyDown={undoRedoKeyHandler(undo, redo)}>
      <header className="space-y-1">
        <p className="smallcaps text-accent">Task 1 · Level 1 · 30 min</p>
        <h2 className="text-h1">Task 1 · Diagnostic Note · Kessler Präzisionstechnik GmbH</h2>
        <p className="text-body italic text-ash">One task. Three levels. Level 1 establishes what the file records.</p>
      </header>

      <div className="card space-y-2 p-4 md:p-5">
        <div className="flex flex-wrap items-center gap-2">
          <h3>The case</h3>
          <span className="pill border-line bg-mist text-ash">Case assumption</span>
        </div>
        <p className="text-body">
          TechSolutions GmbH (Stuttgart region, about 40 staff) delivers cloud migration and security projects to
          Mittelstand (mid-sized companies) manufacturers; projects run €60–150k.{" "}
          <strong>Kessler Präzisionstechnik GmbH</strong> (about 320 staff): TechSolutions delivered a migration project
          (contract value <strong>€118,000</strong>). Go-live was at Month 0, hypercare closed at Month +1, and no
          follow-on order followed. At Month +11 Kessler issued a tender (<em>Ausschreibung</em>, formal tender) for a
          three-year service contract.
        </p>
      </div>

      <div className="card space-y-2 border-accent/30 bg-accentSoft p-4 md:p-5">
        <h3>How to use this task</h3>
        <ul className="list-disc space-y-1 pl-5 text-caption text-ink">
          <li>
            Each answer block starts with a <strong>FIND IT</strong> line: the route, the widget as printed on screen and
            the click that gets you there. Analyse in the app, then write in the answer area below it.
          </li>
          <li>
            <span className="pill-obj mr-1">OBJECTIVE</span> the file settles it. <span className="pill-jdg mx-1">JUDGED</span> your
            reasoning, in your words.
          </li>
          <li>
            Five bins: Price, Trust, Benefit, Relationship, and <strong>Interpretation — not evidence</strong>. The sorting
            key is in Materi A · A6.
          </li>
          <li>If two participants disagree, one has misread the file.</li>
          <li>
            Time: about <strong>10 min</strong> for the sort (1.1), <strong>12 min</strong> for the map (1.2) and <strong>8 min</strong> for the verdict (1.3).
          </li>
        </ul>
        <MaterialRefs refs={["A6", "A5"]} lead="Read first" />
      </div>

      {/* Instrument 1 */}
      <section id="kessler-journey-map" className="card space-y-3 p-4 md:p-5" aria-labelledby="kjm-h">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h3 id="kjm-h">Kessler journey map</h3>
          <button
            type="button"
            onClick={() => setListOpen((o) => !o)}
            aria-expanded={listOpen}
            aria-controls="record-list"
            className="btn-primary btn-sm"
          >
            {listOpen ? "Close all records" : "Open all records"}
          </button>
        </div>
        <p className="text-caption text-ash">
          Months run relative to go-live. The eight record markers sit at their months; a bar marks a record that covers a
          span. Select a stage to read its caption, or a marker to jump to its record.
        </p>
        <JourneyMap
          title="Kessler journey map"
          desc="Timeline from Month minus 5 to Month plus 14: Ausschreibung, contract, delivery, go-live, hypercare, an unlabelled dashed band, and the tender at Month plus 11, with eight record markers."
          min={-5}
          max={14}
          ticks={[
            { at: -5, label: "M−5" },
            { at: 0, label: "M0" },
            { at: 5, label: "M+5" },
            { at: 10, label: "M+10" },
            { at: 14, label: "M+14" },
          ]}
          stages={STAGES}
          points={POINTS}
          formatAxis={fmtMonth}
          selectedPoint={mapSel}
          onPointSelect={onMapSelect}
        />
        {listOpen && (
          <ol id="record-list" className="space-y-2" aria-label="All eight records">
            {RECORDS.map((r, i) => (
              <li
                key={r.id}
                id={`rc-${r.id}`}
                style={{ ["--i" as string]: i }}
                className="stagger rounded-lg border border-line bg-paper p-3 text-caption"
              >
                <p className="font-semibold">
                  <span className="mr-2 rounded bg-ink px-1.5 py-0.5 text-micro font-bold text-paper">{r.id}</span>
                  {r.source} · {r.when}
                </p>
                <p className="mt-1 text-body text-ink">{r.text}</p>
                <p className="mt-1 text-ash">Record on file: {r.onFile}</p>
              </li>
            ))}
          </ol>
        )}
      </section>

      {/* Block 1.1 */}
      <AnswerBlock
        id="block-1-1"
        title="Block 1.1 · Sort the file"
        kind="OBJECTIVE"
        findIt={`Route 1 → Task 1 → “Kessler journey map” → press “Open all records”. Answer in the “Evidence board” below.`}
      >
        <MaterialRefs refs={["A6", "A3", "A5"]} />
        <SortBoard />
      </AnswerBlock>

      {/* Evidence board */}
      <section id="evidence-board" className="card space-y-2 p-4 md:p-5" aria-labelledby="eb-h">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h3 id="eb-h">Evidence board</h3>
          <span className="text-caption text-ash">Live · redraws as you place records</span>
        </div>
        <EvidenceBoardLive />
      </section>

      {/* Block 1.2 */}
      <AnswerBlock
        id="block-1-2"
        title="Block 1.2 · Map the customer"
        kind="OBJECTIVE + JUDGED"
        findIt="Route 1 → Task 1 → “Kessler journey map” and “Evidence board”, then “Loyalty map” inside this block. Answer in the grid below."
      >
        <MaterialRefs refs={["A2", "A3", "A4"]} />
        <MapBlock />
      </AnswerBlock>

      {/* Block 1.3 */}
      <AnswerBlock
        id="block-1-3"
        title="Block 1.3 · Name the weak point"
        kind="OBJECTIVE + JUDGED"
        findIt="Route 1 → Task 1 → “Evidence board” and “Loyalty map”. Answer below."
      >
        <MaterialRefs refs={["A6", "A3"]} />
        <VerdictBlock />
      </AnswerBlock>

      {/* Export */}
      <div className="space-y-3">
        <MissingList items={missing} lead="Your diagnostic note is still missing:" />
        <ExportBar
          id={IDS.exportL1}
          previewTitle="Preview of your note"
          exportLabel="Export diagnostic note"
          docTitle="Diagnostic Note — Kessler Präzisionstechnik GmbH"
          filename={fname}
          missing={missing}
          buildBody={() => diagnosticBody(snapshot)}
        />
      </div>
    </section>
  );
}

function EvidenceBoardLive() {
  const placements = useStore((s) => s.l1.placements);
  return <EvidenceBoard placements={placements} />;
}
