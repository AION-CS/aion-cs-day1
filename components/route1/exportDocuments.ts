import {
  DIMENSIONS,
  ENGAGEMENT,
  EXPORT,
  HORIZONS,
  MEASURES,
  ROOT_CAUSES,
  SIGNALS,
  areaById,
} from "@/lib/route1";
import type { Route1State } from "./useRoute1";

/**
 * The route's single export: one JSON for grading and one print-ready HTML
 * report for reading, both covering the whole engagement.
 *
 * Route 1 spans curriculum levels 1 and 2, so the document has a banner per
 * part and the JSON keeps `partOne` and `partTwo` as separate top-level blocks.
 * A grader reading one file can still score the diagnosis and the decision
 * independently; the learner still produced one deliverable.
 */

const rootLabel = (id: string | null) => ROOT_CAUSES.find((r) => r.id === id)?.label ?? "—";
const horizonLabel = (id: string | null) => HORIZONS.find((h) => h.id === id)?.label ?? "—";
const areaLabel = (id: string | null) => (id ? areaById(id as never).name : "—");

export function buildEngagementJson(r1: Route1State, filename: string): string {
  const payload = {
    meta: {
      day: 11,
      route: 1,
      levels: EXPORT.filenameLevels,
      task: EXPORT.filenameTask,
      schemaVersion: EXPORT.schemaVersion,
      filename,
      name: r1.name,
      case: ENGAGEMENT.company,
      role: ENGAGEMENT.role,
      exportedAt: new Date().toISOString(),
    },

    partOne: {
      label: EXPORT.partOne,
      level: 1,
      signals: r1.reportRows.concat(r1.findings.filter((f) => !f.area)).map((f) => ({
        id: f.signal.id,
        n: f.signal.n,
        title: f.signal.title,
        signalText: f.signal.text,
        areaSelected: f.area,
        areaExpected: f.signal.area,
        areaCorrect: f.area === f.signal.area,
        rootCause: f.rootCause,
        rootCauseExpected: f.signal.rootCause,
        rootCauseCorrect: f.rootCause === f.signal.rootCause,
        horizon: f.horizon,
        horizonExpected: f.signal.horizon,
        horizonCorrect: f.horizon === f.signal.horizon,
        improvementApproach: f.approach,
        checkAttempts: f.checkAttempts,
        cluesUsed: f.clueUsed ? 1 : 0,
        complete: f.complete,
      })),
      tally: {
        filed: r1.completeCount,
        total: SIGNALS.length,
        areaCorrect: r1.areaCorrectCount,
        measurementGaps: r1.measurementCount,
        architectureDecisions: r1.architectureCount,
        shortTermVisible: r1.shortCount,
        structural: r1.structuralCount,
      },
    },

    partTwo: {
      label: EXPORT.partTwo,
      level: 2,
      measures: r1.measureStates.map((s) => ({
        id: s.measure.id,
        name: s.measure.name,
        situationalAnswer: s.situational,
        situationalText:
          s.measure.situational.options.find((o) => o.id === s.situational)?.text ?? null,
        situationalCorrect: s.situationalCorrect,
        revealed: s.revealed,
        dimensions: DIMENSIONS.map((d) => ({
          key: d.key,
          name: d.name,
          higherIsWorse: !!d.inverted,
          prediction: s.prediction[d.key] ?? null,
          groundTruth: s.measure.profile[d.key],
          gap: s.prediction[d.key] ? s.measure.profile[d.key] - s.prediction[d.key]! : null,
        })),
        meanAbsoluteGap: (() => {
          const gaps = DIMENSIONS.map((d) =>
            s.prediction[d.key] ? Math.abs(s.measure.profile[d.key] - s.prediction[d.key]!) : null,
          ).filter((g): g is number => g !== null);
          return gaps.length
            ? Number((gaps.reduce((a, b) => a + b, 0) / gaps.length).toFixed(2))
            : null;
        })(),
      })),
      commit: {
        pick: r1.pick,
        measure: r1.pickedMeasure ? r1.pickedMeasure.name : null,
        rationale: r1.rationale,
        feasibility: r1.feasibility,
        followUpDecisions: r1.followUp.filter(Boolean),
        risksOfRoadNotTaken: r1.risks.filter(Boolean),
      },
    },
  };
  return JSON.stringify(payload, null, 2);
}

const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

/** Standalone, print-ready HTML — no external stylesheet, prints cleanly to A4. */
export function buildEngagementHtml(r1: Route1State): string {
  const date = new Date().toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const findingRows = r1.reportRows
    .map(
      (f) => `<tr>
      <td><strong>${f.signal.n}. ${esc(f.signal.title)}</strong><div class="muted">${esc(f.signal.source)}</div></td>
      <td>${esc(areaLabel(f.area))}</td>
      <td class="nowrap">${esc(rootLabel(f.rootCause))}</td>
      <td class="nowrap">${esc(horizonLabel(f.horizon))}</td>
    </tr>${
      f.approach
        ? `<tr class="why"><td colspan="4"><span class="muted">First step — </span>&ldquo;${esc(
            f.approach,
          )}&rdquo;</td></tr>`
        : ""
    }`,
    )
    .join("");

  const unfiled = r1.findings.filter((f) => !f.area);
  const unfiledBlock = unfiled.length
    ? `<p class="muted">Not assigned: ${unfiled.map((f) => esc(f.signal.title)).join(", ")}.</p>`
    : "";

  const measureBlocks = r1.measureStates
    .map(
      (s) => `<h3>Measure ${s.measure.id} — ${esc(s.measure.shortName)}</h3>
    <p class="muted">${
      s.situational
        ? `Situational answer: &ldquo;${esc(
            s.measure.situational.options.find((o) => o.id === s.situational)?.text ?? "",
          )}&rdquo;`
        : "Situational question not answered."
    }</p>
    <table>
      <thead><tr><th>Dimension</th><th class="num">Predicted</th><th class="num">Real</th><th class="num">Gap</th></tr></thead>
      <tbody>${DIMENSIONS.map((d) => {
        const p = s.prediction[d.key];
        const actual = s.measure.profile[d.key];
        const gap = p ? actual - p : null;
        return `<tr>
          <td>${esc(d.name)}${d.inverted ? ' <span class="warn" title="higher is worse">&#9650;</span>' : ""}</td>
          <td class="num">${p ?? "—"}</td>
          <td class="num">${s.revealed ? actual : "—"}</td>
          <td class="num">${gap === null || !s.revealed ? "—" : gap > 0 ? `+${gap}` : gap}</td>
        </tr>`;
      }).join("")}</tbody>
    </table>`,
    )
    .join("");

  const bullets = (items: string[], empty: string) =>
    items.filter(Boolean).length
      ? `<ul>${items
          .filter(Boolean)
          .map((t) => `<li>${esc(t)}</li>`)
          .join("")}</ul>`
      : `<p class="muted">${esc(empty)}</p>`;

  const justification = [r1.rationale, r1.feasibility].filter(Boolean).join(" ");

  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>${esc(EXPORT.docHeading)} — ${esc(r1.name.trim() || "learner")}</title>
<style>
  :root { color-scheme: light; }
  * { box-sizing: border-box; }
  body { margin: 0; padding: 40px 24px; background: #F5F6F7; color: #16191D;
         font-family: "Segoe UI", "Helvetica Neue", Arial, sans-serif; font-size: 15px; line-height: 1.6; }
  .sheet { max-width: 860px; margin: 0 auto; background: #fff; border: 1px solid #E2E5E9;
           border-radius: 16px; padding: 40px; }
  .kicker { margin: 0 0 4px; font-size: 11px; letter-spacing: .06em; text-transform: uppercase;
            font-weight: 700; color: #0E7A5A; }
  h1 { margin: 0 0 4px; font-size: 27px; line-height: 1.2; }
  .part { margin: 36px 0 6px; padding: 10px 14px; border-radius: 10px; background: #16191D;
          color: #fff; font-size: 12px; letter-spacing: .08em; text-transform: uppercase; font-weight: 700; }
  h2 { margin: 24px 0 10px; font-size: 13px; letter-spacing: .06em; text-transform: uppercase;
       color: #5E6670; border-top: 1px solid #E2E5E9; padding-top: 16px; }
  h3 { margin: 20px 0 6px; font-size: 15px; }
  .meta { margin: 0; color: #5E6670; font-size: 13px; }
  table { width: 100%; border-collapse: collapse; margin-top: 8px; font-size: 13px; }
  th { text-align: left; font-size: 11px; letter-spacing: .05em; text-transform: uppercase;
       color: #5E6670; border-bottom: 1px solid #E2E5E9; padding: 8px 10px 8px 0; font-weight: 700; }
  th.num, td.num { text-align: center; width: 74px; padding-right: 0; }
  td { vertical-align: top; padding: 9px 10px 9px 0; border-bottom: 1px solid #EEF1F3; }
  tr.why td { padding-top: 0; border-bottom: 1px solid #EEF1F3; font-style: italic; }
  .warn { color: #B87514; }
  .muted { color: #5E6670; font-size: 12px; font-style: normal; }
  .nowrap { white-space: nowrap; }
  .pick { margin-top: 10px; padding: 14px 16px; border: 1px solid #E2E5E9;
          border-left: 3px solid #0E7A5A; border-radius: 10px; background: #E7F2EC; }
  .pick strong { display: block; font-size: 16px; margin-bottom: 4px; }
  .summary { margin-top: 10px; padding: 14px 16px; border-radius: 10px; background: #EEF1F3; }
  .summary strong { display: block; font-size: 16px; }
  ul { margin: 8px 0 0; padding-left: 20px; }
  li { margin-bottom: 6px; }
  footer { margin-top: 32px; border-top: 1px solid #E2E5E9; padding-top: 14px;
           color: #5E6670; font-size: 11px; }
  @media (max-width: 560px) {
    body { padding: 12px 8px; }
    .sheet { padding: 18px 14px; border-radius: 12px; }
    th.num, td.num { width: 44px; }
  }
  @media print {
    body { background: #fff; padding: 0; }
    .sheet { border: 0; border-radius: 0; padding: 0; max-width: none; }
    .part { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
    h3, table { break-inside: avoid; }
    @page { margin: 16mm; }
  }
</style>
</head>
<body>
<div class="sheet">
  <p class="kicker">AION Green IT · Day 11 · Route 1 · Levels 1–2</p>
  <h1>${esc(EXPORT.docHeading)}</h1>
  <p class="meta">${esc(r1.name.trim() || "learner")} · ${esc(date)} · Case: ${esc(
    ENGAGEMENT.company,
  )} · Role: ${esc(ENGAGEMENT.role)}</p>

  <p class="part">${esc(EXPORT.partOne)}</p>

  <h2>Findings</h2>
  ${
    r1.reportRows.length
      ? `<table>
    <thead><tr><th>Signal</th><th>Area</th><th>Root cause</th><th>Horizon</th></tr></thead>
    <tbody>${findingRows}</tbody>
  </table>`
      : `<p class="muted">No findings filed.</p>`
  }
  ${unfiledBlock}

  <h2>Split</h2>
  <div class="summary">
    <strong>${r1.completeCount} of ${r1.totalSignals} findings filed.</strong>
    <span class="muted">${r1.measurementCount} measurement gap(s) · ${
      r1.architectureCount
    } architecture decision(s) · ${r1.shortCount} short-term visible · ${
      r1.structuralCount
    } structural.</span>
  </div>

  <p class="part">${esc(EXPORT.partTwo)}</p>

  <h2>Prediction against the real profile</h2>
  ${measureBlocks}
  <p class="muted"><span class="warn">&#9650;</span> Risk is inverted — a higher value is worse.</p>

  <h2>Recommendation</h2>
  <div class="pick">
    <strong>${
      r1.pickedMeasure
        ? `Measure ${esc(r1.pickedMeasure.id)} — ${esc(r1.pickedMeasure.name)}`
        : "No measure committed to."
    }</strong>
    ${justification ? esc(justification) : '<span class="muted">No justification written.</span>'}
  </div>

  <h2>Follow-up decisions this choice forces</h2>
  ${bullets(r1.followUp, "Not written.")}

  <h2>Risks of the road not taken</h2>
  ${bullets(r1.risks, "Not written.")}

  <footer>
    AION Green IT — Day 11, Route 1 (Diagnose &amp; Decide), covering levels 1 and 2.
    ${esc(ENGAGEMENT.company)} is a fictional case for training use. Prepared by the learner named above.
  </footer>
</div>
</body>
</html>`;
}

/** All measures, for the side-by-side table in the HTML footer of future versions. */
export const ALL_MEASURES = MEASURES;
