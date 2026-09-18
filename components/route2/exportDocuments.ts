import { CRITERIA, ENGAGEMENT, EXPORT, MEASURE_LINES, OWNERSHIP_NODES, measureLineById, reversibilityOutcome } from "@/lib/route2";
import { CASE } from "@/lib/routes";
import type { Route2State } from "./useRoute2";

/**
 * The route's single export: one print-ready HTML report covering both
 * parts — "Save as PDF" is the export (lib/downloadFile.ts
 * `printHtmlDocument`). No JSON.
 */

const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

export function buildProposalHtml(r2: Route2State): string {
  const date = new Date().toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });

  const scoreRows = MEASURE_LINES.map(
    (m) => `<tr>
      <td><strong>${m.letter} — ${esc(m.name)}</strong><div class="muted">${esc(m.description)}</div></td>
      ${CRITERIA.map((c) => `<td class="nowrap">${r2.criterionById(c.id).slotOf[m.id] ?? "—"}</td>`).join("")}
      <td class="nowrap"><strong>${r2.lineTotal(m.id)}</strong></td>
    </tr>`,
  ).join("");

  const ownershipList = OWNERSHIP_NODES.filter((n) => r2.ownershipRole(n.id))
    .map((n) => `${esc(n.label)} (${r2.ownershipRole(n.id) === "owns" ? "Owns" : "Consulted"})`)
    .join(", ") || "— not assigned";

  const outcome = reversibilityOutcome(r2.decideReversible, r2.decideMoreData);

  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>${esc(EXPORT.docHeading)} — ${esc(r2.name.trim() || "learner")}</title>
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
  .meta { margin: 0; color: #5E6670; font-size: 13px; }
  table { width: 100%; border-collapse: collapse; margin-top: 8px; font-size: 13px; }
  th { text-align: left; font-size: 11px; letter-spacing: .05em; text-transform: uppercase;
       color: #5E6670; border-bottom: 1px solid #E2E5E9; padding: 8px 10px 8px 0; font-weight: 700; }
  td { vertical-align: top; padding: 9px 10px 9px 0; border-bottom: 1px solid #EEF1F3; }
  .muted { color: #5E6670; font-size: 12px; font-style: normal; }
  .nowrap { white-space: nowrap; }
  .field { margin-top: 10px; }
  .field dt { font-size: 11px; letter-spacing: .05em; text-transform: uppercase; color: #5E6670; }
  .field dd { margin: 3px 0 0; }
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
  <p class="kicker">AION Green IT · Day ${CASE.day} · Route 2 · Levels 2–3</p>
  <h1>${esc(EXPORT.docHeading)}</h1>
  <p class="meta">${esc(r2.name.trim() || "learner")} · ${esc(date)} · Case: ${esc(ENGAGEMENT.company)} · Role: ${esc(ENGAGEMENT.role)}</p>

  <h2>Part 1 — Prioritise</h2>
  <table>
    <thead><tr><th>Measure-line</th>${CRITERIA.map((c) => `<th>${esc(c.label.split(" ")[0])}</th>`).join("")}<th>Total</th></tr></thead>
    <tbody>${scoreRows}</tbody>
  </table>
  ${
    r2.priority
      ? `<div class="field"><dt>Chosen priority</dt><dd><strong>${measureLineById(r2.priority).letter} — ${esc(measureLineById(r2.priority).name)}</strong></dd></div>
         <div class="field"><dt>Justification</dt><dd>&ldquo;${esc(r2.priorityJustify)}&rdquo;</dd></div>`
      : `<p class="muted">No priority chosen.</p>`
  }

  <h2>Part 2 — Propose</h2>
  <div class="field"><dt>Why this is relevant now</dt><dd>${r2.relevance ? `&ldquo;${esc(r2.relevance)}&rdquo;` : '<span class="muted">not written</span>'}</dd></div>
  <div class="field"><dt>First move</dt><dd>${r2.firstMove ? `&ldquo;${esc(r2.firstMove)}&rdquo;` : '<span class="muted">not written</span>'}</dd></div>
  <div class="field"><dt>Ownership</dt><dd>${esc(ownershipList)}</dd></div>
  <div class="field">
    <dt>One decision to make now</dt>
    <dd>${r2.decideName ? `&ldquo;${esc(r2.decideName)}&rdquo;` : '<span class="muted">not named</span>'}${
      outcome ? ` — <strong>${esc(outcome.label)}</strong> (${esc(outcome.detail)})` : ""
    }</dd>
  </div>

  <h2>Split</h2>
  <div class="summary">
    <strong>${r2.rankedCriteriaCount} of ${CRITERIA.length} criteria ranked, Part 2 ${r2.partTwoComplete ? "complete" : "in progress"}.</strong>
  </div>

  <footer>
    AION Green IT — Day ${CASE.day}, Route 2 (Management Decision), Levels 2–3.
    ${esc(ENGAGEMENT.company)} is a fictional case for training use. Prepared by the learner named above.
  </footer>
</div>
</body>
</html>`;
}
