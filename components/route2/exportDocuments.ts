import {
  ASSESSMENT_DIMENSIONS,
  DECIDE_NOW_FIELDS,
  EXPORT,
  MAP_QUESTIONS,
  QUADRANTS,
  RACI_ROWS,
  SYNERVIA,
  TASK_RACI_ROLES,
  decisionById,
  quadrantById,
} from "@/lib/route2";
import { CASE } from "@/lib/routes";
import { MAP, MID_X, MID_Y, quadrantRect, slotPosition } from "./mapLayout";
import type { Route2State } from "./useRoute2";

/**
 * Route 2's export: one print-ready board memo, opened in a new tab and sent
 * straight to the browser's print dialog — "Save as PDF" is the export (see
 * lib/downloadFile.ts `printHtmlDocument`). No JSON. The memo reads top-down
 * the way a board would: the recommendation and its defence, the guiding
 * decisions behind it, what it costs, who owns it, and what cannot wait.
 */

const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

/** The trade-off map as an inline SVG string, drawn from the same geometry as the live map. */
function mapSvg(r2: Route2State): string {
  const quadrants = QUADRANTS.map((q) => {
    const r = quadrantRect(q.id);
    const warm = q.id === "quick" || q.id === "bet";
    return `<rect x="${r.x + 2}" y="${r.y + 2}" width="${r.w - 4}" height="${r.h - 4}" rx="10" fill="${warm ? "#E7F2EC" : "#EEF1F3"}" stroke="#E2E5E9" />
      <text x="${r.x + 12}" y="${r.y + 24}" font-size="14" font-weight="700" fill="${warm ? "#0E7A5A" : "#5E6670"}">${esc(q.label)}</text>`;
  }).join("");

  const dots = r2.mapStates
    .filter((s) => s.placed)
    .map((s) => {
      const p = slotPosition(s.placed!, s.slotIndex, s.slotCount);
      return `<circle cx="${p.x}" cy="${p.y}" r="18" fill="#0E7A5A" stroke="#fff" stroke-width="2.5" />
        <text x="${p.x}" y="${p.y + 5}" text-anchor="middle" font-size="13" font-weight="700" fill="#fff">${s.measure.id.toUpperCase()}</text>`;
    })
    .join("");

  return `<svg viewBox="0 0 ${MAP.w} ${MAP.h}" width="100%" style="max-width:520px;display:block;margin:8px auto" xmlns="http://www.w3.org/2000/svg" font-family="Segoe UI, Arial, sans-serif">
    ${quadrants}
    <text x="${MAP.x0}" y="${MAP.h - 12}" font-size="12.5" fill="#5E6670">low</text>
    <text x="${MID_X}" y="${MAP.h - 12}" text-anchor="middle" font-size="13" font-weight="600" fill="#16191D">Momentum cost →</text>
    <text x="${MAP.x1}" y="${MAP.h - 12}" text-anchor="end" font-size="12.5" fill="#5E6670">high</text>
    <text x="18" y="${MID_Y}" text-anchor="middle" transform="rotate(-90 18 ${MID_Y})" font-size="13" font-weight="600" fill="#16191D">Structural impact →</text>
    ${dots}
  </svg>`;
}

export function buildMemoHtml(r2: Route2State): string {
  const date = new Date().toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
  const first = r2.ranking[0] ? decisionById(r2.ranking[0]) : null;

  const assessmentRows = ASSESSMENT_DIMENSIONS.map((d) => {
    const row = r2.ratingRows.find((r) => r.dim.key === d.key)!;
    return `<tr>
      <td>${esc(d.label)}</td>
      <td class="nowrap">${row.rating ? row.rating[0].toUpperCase() + row.rating.slice(1) : "—"}</td>
      <td>${row.note ? esc(row.note) : '<span class="muted">not written</span>'}</td>
    </tr>`;
  }).join("");

  const ranked = r2.ranking.length
    ? `<ol>${r2.ranking
        .map((id, i) => {
          const d = decisionById(id);
          return `<li><strong>${esc(d.label)}</strong> — <span class="muted">${esc(d.detail)}</span>${
            i === 0 && r2.rankWhy ? `<div class="why">${esc(r2.rankWhy)}</div>` : ""
          }</li>`;
        })
        .join("")}</ol>`
    : `<p class="muted">No guiding decisions ranked.</p>`;

  const mapRows = r2.mapStates
    .map(
      (s) => `<tr>
        <td><strong>${esc(s.measure.label)}</strong></td>
        <td class="nowrap">${s.q1 ? (s.q1 === "yes" ? "High" : "Low") : "—"}</td>
        <td class="nowrap">${s.q2 ? (s.q2 === "yes" ? "High" : "Low") : "—"}</td>
        <td class="nowrap">${s.placed ? esc(quadrantById(s.placed).label) : "Not placed"}</td>
      </tr>${
        s.placed === "bet"
          ? `<tr class="why-row"><td colspan="4"><span class="muted">If only one bet is funded — </span>${
              s.bet ? esc(s.bet) : '<span class="muted">not written</span>'
            }</td></tr>`
          : ""
      }`,
    )
    .join("");

  const raciHead = TASK_RACI_ROLES.map((r) => `<th class="num">${esc(r.short)}</th>`).join("");
  const raciRows = RACI_ROWS.map((row) => {
    const issues = r2.raciViolations.filter((v) => v.rowId === row.id);
    return `<tr>
      <td>${esc(row.label)}${issues.length ? `<div class="flag">${issues.map((v) => esc(v.text)).join("<br/>")}</div>` : ""}</td>
      ${TASK_RACI_ROLES.map((role) => {
        const v = r2.raciValue(row.id, role.id);
        return `<td class="num${v === "A" ? " acc" : ""}">${v || "·"}</td>`;
      }).join("")}
    </tr>`;
  }).join("");

  const decide = DECIDE_NOW_FIELDS.map(
    (f) => `<div class="field"><p class="label">${esc(f.label)}</p><p>${
      r2.decideNow[f.key] ? esc(r2.decideNow[f.key]) : '<span class="muted">Not written.</span>'
    }</p></div>`,
  ).join("");

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
  .sheet { max-width: 860px; margin: 0 auto; background: #fff; border: 1px solid #E2E5E9; border-radius: 16px; padding: 40px; }
  .memohead { border-bottom: 2px solid #16191D; padding-bottom: 14px; }
  .kicker { margin: 0 0 4px; font-size: 11px; letter-spacing: .06em; text-transform: uppercase; font-weight: 700; color: #0E7A5A; }
  h1 { margin: 0 0 6px; font-size: 27px; line-height: 1.2; }
  .meta { display: grid; grid-template-columns: 90px 1fr; gap: 2px 12px; margin: 10px 0 0; font-size: 13px; }
  .meta dt { color: #5E6670; text-transform: uppercase; letter-spacing: .05em; font-size: 11px; padding-top: 2px; }
  .meta dd { margin: 0; }
  h2 { margin: 30px 0 10px; font-size: 13px; letter-spacing: .06em; text-transform: uppercase; color: #5E6670; border-top: 1px solid #E2E5E9; padding-top: 16px; }
  .rec { padding: 16px 18px; border: 1px solid #E2E5E9; border-left: 4px solid #0E7A5A; border-radius: 10px; background: #E7F2EC; }
  .rec strong { display: block; font-size: 17px; margin-bottom: 4px; }
  ol { margin: 6px 0 0; padding-left: 22px; }
  li { margin-bottom: 8px; }
  .why { margin-top: 4px; font-style: italic; }
  table { width: 100%; border-collapse: collapse; margin-top: 8px; font-size: 13px; }
  th { text-align: left; font-size: 11px; letter-spacing: .05em; text-transform: uppercase; color: #5E6670; border-bottom: 1px solid #E2E5E9; padding: 8px 10px 8px 0; font-weight: 700; }
  th.num, td.num { text-align: center; width: 62px; padding-right: 0; }
  td { vertical-align: top; padding: 8px 10px 8px 0; border-bottom: 1px solid #EEF1F3; }
  td.acc { font-weight: 700; color: #0E7A5A; background: #E7F2EC; }
  tr.why-row td { padding-top: 0; font-style: italic; }
  .flag { margin-top: 4px; font-size: 11.5px; color: #B87514; }
  .muted { color: #5E6670; font-size: 12px; font-style: normal; }
  .nowrap { white-space: nowrap; }
  .field { margin-top: 10px; }
  .field .label { margin: 0; font-size: 11px; letter-spacing: .05em; text-transform: uppercase; color: #5E6670; font-weight: 700; }
  .field p { margin: 2px 0 0; }
  footer { margin-top: 32px; border-top: 1px solid #E2E5E9; padding-top: 14px; color: #5E6670; font-size: 11px; }
  @media (max-width: 560px) {
    body { padding: 12px 8px; }
    .sheet { padding: 18px 14px; border-radius: 12px; }
    th.num, td.num { width: 44px; }
  }
  @media print {
    body { background: #fff; padding: 0; }
    .sheet { border: 0; border-radius: 0; padding: 0; max-width: none; }
    .rec, td.acc { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
    h2, table, svg { break-inside: avoid; }
    @page { size: A4; margin: 16mm; }
  }
</style>
</head>
<body>
<div class="sheet">
  <div class="memohead">
    <p class="kicker">AION Green IT · Day ${CASE.day} · Route 2 · Level 3 · Board memo</p>
    <h1>${esc(EXPORT.docHeading)}</h1>
    <dl class="meta">
      <dt>To</dt><dd>Management board, ${esc(SYNERVIA.company)}</dd>
      <dt>From</dt><dd>${esc(r2.name.trim() || "learner")} — ${esc(SYNERVIA.role)}</dd>
      <dt>Date</dt><dd>${esc(date)}</dd>
    </dl>
  </div>

  <h2>Recommendation</h2>
  <div class="rec">
    <strong>${r2.chosenLane ? esc(r2.chosenLane.label) : "No line of measures chosen."}</strong>
    ${r2.justification ? esc(r2.justification) : '<span class="muted">No defence written.</span>'}
  </div>

  <h2>Assessment grid</h2>
  <table>
    <thead><tr><th>Criterion</th><th>Rating</th><th>Argument</th></tr></thead>
    <tbody>${assessmentRows}</tbody>
  </table>
  ${
    r2.followUp || r2.risks.some(Boolean)
      ? `<div class="field">
          ${r2.followUp ? `<p class="label">Follow-up decisions</p><p>${esc(r2.followUp)}</p>` : ""}
          ${r2.risks.filter(Boolean).length ? `<p class="label" style="margin-top:8px">Risks of the attractive-but-weak trap</p><ul>${r2.risks.filter(Boolean).map((r) => `<li>${esc(r)}</li>`).join("")}</ul>` : ""}
        </div>`
      : ""
  }

  <h2>Guiding decisions, ranked</h2>
  ${ranked}

  <h2>Trade-off assessment</h2>
  ${mapSvg(r2)}
  <table>
    <thead><tr><th>Initiative</th><th>${esc(MAP_QUESTIONS.q1.label)}</th><th>${esc(MAP_QUESTIONS.q2.label)}</th><th>Quadrant</th></tr></thead>
    <tbody>${mapRows}</tbody>
  </table>

  <h2>Ownership</h2>
  <table>
    <thead><tr><th>Decision object</th>${raciHead}</tr></thead>
    <tbody>${raciRows}</tbody>
  </table>
  <p class="muted">R Responsible · A Accountable · C Consulted · I Informed. Exactly one A per row.</p>

  <h2>Decision required now</h2>
  ${decide}

  <footer>
    AION Green IT — Day ${CASE.day}, Route 2 (Management Decision), level 3.
    ${esc(SYNERVIA.company)} is a fictional case for training use. Prepared by the learner named above.
  </footer>
</div>
</body>
</html>`;
}
