import {
  EXPORT,
  RESPONSIBILITIES,
  ROLES,
  SELF_ASSESSMENT_ITEMS,
  VERTEX,
  criterionById,
  factorLabel,
  optionById,
  relevanceLabel,
} from "@/lib/route2";
import { CASE } from "@/lib/routes";
import type { Route2State } from "./useRoute2";

/**
 * Route 2's single export: one JSON for grading, one print-ready board memo
 * for reading — the full composed memo exactly as the live preview shows it,
 * plus the criteria ranking, the trade-off links as an inline SVG, the RACI
 * table, confidence, the self-assessment block, and the reflection appendix
 * only if the learner opted in (§8.6). Never disabled: an `incomplete` flag
 * stamps both documents (§8.6's "STATUS: INCOMPLETE DRAFT").
 *
 * The reflection journal is deliberately absent from `useRoute2` (§7.8: never
 * validated, never part of the graded state), so its answers and the opt-in
 * flag are read directly from the store by the caller (ExportBar) and passed
 * in here — never read back out of storage by this module.
 */

export type ReflectionExport = { question: string; answer: string }[] | null;

export function buildMemoJson(r2: Route2State, filename: string, incomplete: boolean, reflection: ReflectionExport): string {
  const chosen = r2.firstMeasure ? optionById(r2.firstMeasure) : null;
  const payload = {
    meta: {
      day: CASE.day,
      route: 2,
      level: 3,
      task: EXPORT.filenameTask,
      schemaVersion: EXPORT.schemaVersion,
      filename,
      status: incomplete ? "incomplete-draft" : "complete",
      mentorSample: r2.mentorSample,
      name: r2.name,
      case: VERTEX.company,
      role: VERTEX.role,
      exportedAt: new Date().toISOString(),
    },
    strategicRelevance: { drivers: r2.relevanceSelected.map((id) => ({ id, label: relevanceLabel(id) })), rationale: r2.relevanceRationale },
    guidingDecisions: r2.guidingDecisions,
    decisionLogic: { rankedCriteria: r2.criteriaOrder.map((id) => ({ id, name: criterionById(id).name })), boundary: r2.boundary },
    tradeOffs: r2.tradeOffLinks.map((l) => ({ a: l.a, aLabel: factorLabel(l.a), b: l.b, bLabel: factorLabel(l.b), note: l.note })),
    firstMeasure: { option: r2.firstMeasure, text: chosen?.text ?? null, justification: r2.justification, committedBudgetAnswer: r2.committedBudgetAnswer },
    governance: {
      raci: RESPONSIBILITIES.map((resp) => ({
        responsibility: resp.id,
        label: resp.label,
        assignments: Object.fromEntries(ROLES.map((role) => [role.id, r2.raciValue(resp.id, role.id) || null])),
      })),
      reviewMechanism: r2.reviewMechanism,
    },
    decisionNow: { decision: r2.decisionNow, confidence: r2.confidence, changeMyMind: r2.changeMyMind },
    selfAssessment: SELF_ASSESSMENT_ITEMS.map((item) => ({ id: item.id, label: item.label, rating: r2.selfAssessment[item.id] })),
    ...(reflection ? { reflectionAppendix: reflection } : {}),
  };
  return JSON.stringify(payload, null, 2);
}

const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
const nl2br = (s: string) => esc(s).replace(/\n/g, "<br/>");

/** The trade-off links as a standalone inline SVG (§8.6), the same ring layout as the live picker. */
function tradeoffSvg(r2: Route2State): string {
  const VW = 420;
  const VH = 420;
  const CX = 210;
  const CY = 210;
  const R = 150;
  const ids = ["connectivity", "innovation", "energy", "dataGrowth", "investment", "controllability", "reliability", "complexity"] as const;
  const point = (i: number) => {
    const a = -Math.PI / 2 + (i * 2 * Math.PI) / ids.length;
    return [CX + R * Math.cos(a), CY + R * Math.sin(a)] as const;
  };
  const idx = (id: string) => ids.indexOf(id as (typeof ids)[number]);
  const nodes = ids
    .map((id, i) => {
      const [x, y] = point(i);
      return `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="20" fill="#16191D"/><text x="${x.toFixed(1)}" y="${(y + 34).toFixed(1)}" text-anchor="middle" font-size="11" fill="#16191D">${esc(factorLabel(id as never))}</text>`;
    })
    .join("");
  const lines = r2.tradeOffLinks
    .map((l) => {
      const [ax, ay] = point(idx(l.a));
      const [bx, by] = point(idx(l.b));
      return `<line x1="${ax.toFixed(1)}" y1="${ay.toFixed(1)}" x2="${bx.toFixed(1)}" y2="${by.toFixed(1)}" stroke="#0E7A5A" stroke-width="2.6"/>`;
    })
    .join("");
  return `<svg viewBox="0 0 ${VW} ${VH}" width="100%" style="max-width:360px;display:block;margin:8px auto" xmlns="http://www.w3.org/2000/svg" font-family="Segoe UI, Arial, sans-serif">${lines}${nodes}</svg>`;
}

export function buildMemoHtml(r2: Route2State, incomplete: boolean, reflection: ReflectionExport): string {
  const date = new Date().toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
  const chosen = r2.firstMeasure ? optionById(r2.firstMeasure) : null;
  const stampLine = [incomplete ? EXPORT.incompleteStamp : null, r2.mentorSample ? EXPORT.mentorStamp : null].filter(Boolean).join(" · ");

  const guidingRows = r2.guidingDecisions
    .map((g, i) =>
      g.text.trim()
        ? `<li><strong>${esc(g.text)}</strong><div class="muted">${g.owner ? esc(ROLES.find((r) => r.id === g.owner)?.label ?? "") : "owner not set"} · ${g.quarter ?? "quarter not set"}</div></li>`
        : `<li class="muted">Guiding decision ${i + 1} not written.</li>`,
    )
    .join("");

  const criteriaRows = r2.criteriaOrder.length ? `<ol>${r2.criteriaOrder.map((id) => `<li>${esc(criterionById(id).name)}</li>`).join("")}</ol>` : `<p class="muted">Not ranked.</p>`;

  const tradeoffRows = r2.tradeOffLinks.length
    ? `<ul>${r2.tradeOffLinks.map((l) => `<li><strong>${esc(factorLabel(l.a))} ↔ ${esc(factorLabel(l.b))}:</strong> ${l.note ? esc(l.note) : '<span class="muted">note not written</span>'}</li>`).join("")}</ul>`
    : `<p class="muted">No trade-offs drawn.</p>`;

  const raciHead = ROLES.map((r) => `<th class="num">${esc(r.label.split(" ")[0])}</th>`).join("");
  const raciRows = RESPONSIBILITIES.map(
    (resp) => `<tr><td>${esc(resp.label)}</td>${ROLES.map((role) => {
      const v = r2.raciValue(resp.id, role.id);
      return `<td class="num${v === "A" ? " acc" : ""}">${v || "·"}</td>`;
    }).join("")}</tr>`,
  ).join("");

  const selfAssessRows = SELF_ASSESSMENT_ITEMS.map((item) => `<tr><td>${esc(item.label)}</td><td class="num">${r2.selfAssessment[item.id] ?? "—"}</td></tr>`).join("");

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
         font-family: Georgia, Cambria, "Times New Roman", Times, serif; font-size: 15px; line-height: 1.65; }
  .sheet { max-width: 900px; margin: 0 auto; background: #FFFDF8; border: 1px solid #E2E5E9; border-radius: 16px; padding: 40px; }
  .memohead { border-bottom: 2px solid #16191D; padding-bottom: 14px; font-family: "Segoe UI", Arial, sans-serif; }
  .kicker { margin: 0 0 4px; font-size: 11px; letter-spacing: .06em; text-transform: uppercase; font-weight: 700; color: #0E7A5A; font-family: "Segoe UI", Arial, sans-serif; }
  h1 { margin: 0 0 6px; font-size: 24px; line-height: 1.25; }
  .stamp { margin: 8px 0 0; display: inline-block; padding: 4px 10px; border-radius: 999px; background: #B87514; color: #fff;
           font-size: 11px; font-weight: 700; letter-spacing: .04em; text-transform: uppercase; font-family: "Segoe UI", Arial, sans-serif; }
  .meta { margin: 10px 0 0; font-size: 13px; color: #5E6670; font-family: "Segoe UI", Arial, sans-serif; }
  h2 { margin: 28px 0 10px; font-size: 12px; letter-spacing: .06em; text-transform: uppercase; color: #5E6670;
       border-top: 1px solid #E2E5E9; padding-top: 16px; font-family: "Segoe UI", Arial, sans-serif; }
  .rec { padding: 16px 18px; border: 1px solid #E2E5E9; border-left: 4px solid #0E7A5A; border-radius: 10px; background: #E7F2EC; }
  .rec strong { display: block; font-size: 16px; margin-bottom: 4px; }
  ol, ul { margin: 6px 0 0; padding-left: 22px; }
  li { margin-bottom: 6px; }
  table { width: 100%; border-collapse: collapse; margin-top: 8px; font-size: 13px; font-family: "Segoe UI", Arial, sans-serif; }
  th { text-align: left; font-size: 11px; letter-spacing: .05em; text-transform: uppercase; color: #5E6670;
       border-bottom: 1px solid #E2E5E9; padding: 8px 10px 8px 0; font-weight: 700; }
  th.num, td.num { text-align: center; width: 60px; padding-right: 0; }
  td { vertical-align: top; padding: 8px 10px 8px 0; border-bottom: 1px solid #EEF1F3; }
  td.acc { font-weight: 700; color: #0E7A5A; background: #E7F2EC; }
  .muted { color: #5E6670; font-style: italic; }
  footer { margin-top: 32px; border-top: 1px solid #E2E5E9; padding-top: 14px; color: #5E6670; font-size: 11px; font-family: "Segoe UI", Arial, sans-serif; }
  @media (max-width: 560px) { body { padding: 12px 8px; } .sheet { padding: 18px 14px; border-radius: 12px; } }
  @media print {
    body { background: #fff; padding: 0; }
    .sheet { border: 0; border-radius: 0; padding: 0; max-width: none; background: #fff; }
    .rec, td.acc, .stamp { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
    h2, table, svg { break-inside: avoid; }
    @page { size: A4; margin: 16mm; }
  }
</style>
</head>
<body>
<div class="sheet">
  <div class="memohead">
    <p class="kicker">AION Green IT · ${esc(CASE.module)} · Route 2 · Level 3 · Board memo</p>
    <h1>Management Proposal — Connected Infrastructure Strategy</h1>
    <p class="meta">${esc(VERTEX.company)} · Prepared by ${esc(r2.name.trim() || "learner")} · ${esc(date)} · ${esc(VERTEX.role)}</p>
    ${stampLine ? `<span class="stamp">${esc(stampLine)}</span>` : ""}
  </div>

  <h2>1. Executive summary</h2>
  <div class="rec">
    <strong>${chosen ? `Option ${esc(chosen.id)} — ${esc(chosen.text)}` : "No first measure selected."}</strong>
    ${r2.relevanceRationale ? nl2br(r2.relevanceRationale) : '<span class="muted">No rationale written.</span>'}
  </div>

  <h2>2. Strategic rationale</h2>
  <p>${r2.relevanceSelected.length ? r2.relevanceSelected.map((id) => esc(relevanceLabel(id))).join(" · ") : '<span class="muted">No drivers selected.</span>'}</p>
  <p>${r2.relevanceRationale ? nl2br(r2.relevanceRationale) : ""}</p>

  <h2>3. Guiding decisions, next 12 months</h2>
  <ol>${guidingRows}</ol>

  <h2>4. Decision logic and assessment criteria</h2>
  ${criteriaRows}
  <p><strong>Boundary.</strong> ${r2.boundary ? esc(r2.boundary) : '<span class="muted">Not stated.</span>'}</p>

  <h2>5. Central trade-offs</h2>
  ${tradeoffSvg(r2)}
  ${tradeoffRows}

  <h2>6. Recommended first measure</h2>
  <div class="rec">
    <strong>${chosen ? `Option ${esc(chosen.id)} — ${esc(chosen.text)}` : "No option chosen."}</strong>
    ${r2.justification ? nl2br(r2.justification) : '<span class="muted">No justification written.</span>'}
  </div>
  <p><strong>Committed budget.</strong> ${r2.committedBudgetAnswer ? esc(r2.committedBudgetAnswer) : '<span class="muted">Not answered.</span>'}</p>

  <h2>7. Governance: roles, approval, review</h2>
  <table><thead><tr><th>Responsibility</th>${raciHead}</tr></thead><tbody>${raciRows}</tbody></table>
  <p class="muted">R Responsible · A Accountable · C Consulted · I Informed. Exactly one A per row.</p>
  <p><strong>Review mechanism.</strong> ${r2.reviewMechanism ? esc(r2.reviewMechanism) : '<span class="muted">Not described.</span>'}</p>

  <h2>8. Decision taken now under uncertainty</h2>
  <p>${r2.decisionNow ? esc(r2.decisionNow) : '<span class="muted">Not written.</span>'}</p>
  <p class="muted">Confidence: ${r2.confidence}/100${r2.changeMyMind ? ` · Would change with: ${esc(r2.changeMyMind)}` : ""}</p>

  <h2>Self-assessment</h2>
  <table><thead><tr><th>Rubric question</th><th class="num">Rating</th></tr></thead><tbody>${selfAssessRows}</tbody></table>

  ${
    reflection
      ? `<h2>Appendix: reflection journal</h2>${reflection
          .map((r) => `<p><strong>${esc(r.question)}</strong><br/>${r.answer ? nl2br(r.answer) : '<span class="muted">Not answered.</span>'}</p>`)
          .join("")}`
      : ""
  }

  <footer>
    AION Green IT — ${esc(CASE.module)}, Route 2 (Management Decision), level 3.
    ${esc(VERTEX.company)} is a fictional case for training use. Prepared by the learner named above.
  </footer>
</div>
</body>
</html>`;
}
