import { AREAS, CRITERIA, ENGAGEMENT, EXPORT1, EXPORT2, FOLLOWUP_FIELDS, LEVEL_LABEL, OPTION_LINES, RISK_FIELDS, optionById } from "@/lib/route1";
import { CASE } from "@/lib/routes";
import type { Route1State } from "./useRoute1";

/**
 * Two separate print-ready HTML exports — one per task, per this route's own
 * export contract (task1.ts's file header). Both share the same print
 * stylesheet and are sent to the browser's print dialog via
 * `printHtmlDocument` — "Save as PDF" is the export, no PDF library.
 */

const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

function sheetOpen(title: string, kicker: string): string {
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>${esc(title)}</title>
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
  h2 { margin: 24px 0 10px; font-size: 13px; letter-spacing: .06em; text-transform: uppercase;
       color: #5E6670; border-top: 1px solid #E2E5E9; padding-top: 16px; }
  h3 { margin: 18px 0 4px; font-size: 14px; color: #16191D; }
  ol, ul.plain { margin: 6px 0 0; padding-left: 20px; font-size: 13px; }
  .meta { margin: 0; color: #5E6670; font-size: 13px; }
  table { width: 100%; border-collapse: collapse; margin-top: 8px; font-size: 13px; }
  th { text-align: left; font-size: 11px; letter-spacing: .05em; text-transform: uppercase;
       color: #5E6670; border-bottom: 1px solid #E2E5E9; padding: 8px 10px 8px 0; font-weight: 700; }
  td { vertical-align: top; padding: 9px 10px 9px 0; border-bottom: 1px solid #EEF1F3; }
  .muted { color: #5E6670; font-size: 12px; font-style: normal; }
  .nowrap { white-space: nowrap; }
  .summary { margin-top: 10px; padding: 14px 16px; border-radius: 10px; background: #EEF1F3; }
  .summary strong { display: block; font-size: 16px; }
  footer { margin-top: 32px; border-top: 1px solid #E2E5E9; padding-top: 14px;
           color: #5E6670; font-size: 11px; }
  @media (max-width: 560px) {
    body { padding: 12px 8px; }
    .sheet { padding: 18px 14px; border-radius: 12px; }
  }
  @media print {
    body { background: #fff; padding: 0; }
    .sheet { border: 0; border-radius: 0; padding: 0; max-width: none; }
    table { break-inside: avoid; }
    @page { margin: 16mm; }
  }
</style>
</head>
<body>
<div class="sheet">
  <p class="kicker">${esc(kicker)}</p>`;
}

const sheetClose = `
</div>
</body>
</html>`;

export function buildTask1Html(r1: Route1State): string {
  const date = new Date().toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });

  const areaSections = AREAS.map((area) => {
    const inArea = r1.byArea(area.id);
    const rows = inArea.map((s) => `<tr><td>${s.signal.n}. ${esc(s.signal.text)}</td></tr>`).join("");
    const approach = r1.approachByArea[area.id];
    return `<h3>${esc(area.name)} — ${inArea.length}</h3>
  ${inArea.length ? `<table><tbody>${rows}</tbody></table>` : `<p class="muted">No signals placed here.</p>`}
  <p><strong>First improvement approach — </strong>${approach ? `&ldquo;${esc(approach)}&rdquo;` : `<em>Not written yet</em>`}</p>`;
  }).join("\n");

  const metricRows = r1.metricStates
    .map((m) => `<tr><td>${esc(m.text)}</td><td class="nowrap">${m.verdict ? (m.verdict === "effective" ? "Effective for management" : "Merely informative") : "—"}</td></tr>`)
    .join("");

  const horizonRows = r1.horizonStates
    .map((h) => `<tr><td>${esc(h.text)}</td><td class="nowrap">${h.lane ? (h.lane === "structural" ? "Structural" : "Short-term") : "—"}</td></tr>`)
    .join("");

  return `${sheetOpen(`${EXPORT1.docHeading} — ${r1.name.trim() || "learner"}`, `AION Green IT · Day ${CASE.day} · Route 1 · Level 1 · Task 1`)}
  <h1>${esc(EXPORT1.docHeading)}</h1>
  <p class="meta">${esc(r1.name.trim() || "learner")} · ${esc(date)} · Case: ${esc(ENGAGEMENT.company)}</p>

  <h2>Findings by area</h2>
  ${areaSections}

  <h2>Effective vs merely informative</h2>
  <table><thead><tr><th>Candidate metric</th><th>Verdict</th></tr></thead><tbody>${metricRows}</tbody></table>

  <h2>Short-term vs structural</h2>
  <table><thead><tr><th>Move</th><th>Horizon</th></tr></thead><tbody>${horizonRows}</tbody></table>

  <div class="summary">
    <strong>${r1.placedCount} of ${r1.totalSignals} signals placed · ${r1.areasWithApproach} of ${AREAS.length} areas have an improvement approach.</strong>
  </div>

  <footer>
    AION Green IT — Day ${CASE.day}, Route 1, Level 1, Task 1. ${esc(ENGAGEMENT.company)} is a fictional case for training use. Prepared by the learner named above.
  </footer>${sheetClose}`;
}

export function buildTask2Html(r1: Route1State): string {
  const date = new Date().toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });

  const optionSections = OPTION_LINES.map((opt) => {
    const a = r1.optionAssessment(opt.id);
    const rows = CRITERIA.map(
      (c) => `<tr><td>${esc(c.name)}</td><td class="nowrap">${a.scores[c.id] ? esc(LEVEL_LABEL[a.scores[c.id]!]) : "—"}</td></tr>`,
    ).join("");
    return `<h3>Line ${esc(opt.letter)} — ${esc(opt.title)}</h3>
  <table><thead><tr><th>Criterion</th><th>Level</th></tr></thead><tbody>${rows}</tbody></table>`;
  }).join("\n");

  const followUpRows = FOLLOWUP_FIELDS.map((f, i) => `<li>${esc(r1.followUps[i] || "—")}</li>`).join("");
  const riskRows = RISK_FIELDS.map((r, i) => `<li>${esc(r1.risks[i] || "—")}</li>`).join("");

  return `${sheetOpen(`${EXPORT2.docHeading} — ${r1.name.trim() || "learner"}`, `AION Green IT · Day ${CASE.day} · Route 1 · Level 2 · Task 2`)}
  <h1>${esc(EXPORT2.docHeading)}</h1>
  <p class="meta">${esc(r1.name.trim() || "learner")} · ${esc(date)} · Case: ${esc(ENGAGEMENT.company)}</p>

  <h2>Assessment across the seven criteria</h2>
  ${optionSections}

  <h2>Priority pick</h2>
  <p>${r1.priority ? `<strong>Line ${esc(optionById(r1.priority).letter)} — ${esc(optionById(r1.priority).title)}</strong>` : "<em>Not yet picked</em>"}</p>

  <h3>Justification</h3>
  <p>${r1.justification ? `&ldquo;${esc(r1.justification)}&rdquo;` : "<em>Not yet written</em>"}</p>

  <h3>Follow-up decisions</h3>
  <ol>${followUpRows}</ol>

  <h3>Two risks of an attractive-but-weak pick</h3>
  <ul class="plain">${riskRows}</ul>

  <div class="summary">
    <strong>${r1.options.filter((o) => o.fullyScored).length} of 3 lines fully assessed across all seven criteria.</strong>
  </div>

  <footer>
    AION Green IT — Day ${CASE.day}, Route 1, Level 2, Task 2. ${esc(ENGAGEMENT.company)} is a fictional case for training use. Prepared by the learner named above.
  </footer>${sheetClose}`;
}
