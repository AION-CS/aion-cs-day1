import { BIN_LABEL, RECORDS, RECORD_BY_ID } from "@/data/kesslerDossier";
import { FIGURES } from "@/data/offers";
import { KESSLER_ROLES, MOTIVE_LABEL } from "@/data/motives";
import { RECOMMENDATION_LABEL } from "@/store/selectors";
import { citedFigures } from "@/lib/checks";
import { esc, evidenceBoardSvg, motiveMapSvg } from "@/lib/svgModels";
import type { Persisted } from "@/store/useStore";

/**
 * The exported note is built here as a self-contained HTML string (inline CSS +
 * inline SVG). The on-screen "Preview of your note" renders this same body, so
 * what the participant reads is what they download. It never prints answer
 * keys, ticks, crosses or scores.
 */

const COURSE = "Customer Retention & Buying Behaviour in B2B IT Sales";

export const DOC_CSS = `
.doc{font-family:Georgia,Cambria,"Times New Roman",serif;color:#1F2328;background:#FFFEFA;line-height:1.5;font-size:14px}
.doc *{box-sizing:border-box}
.doc h1{font-size:22px;margin:0 0 4px;font-weight:600}
.doc h2{font-size:15px;margin:22px 0 8px;padding-bottom:4px;border-bottom:1px solid #D8D1BF;font-weight:600;letter-spacing:.01em}
.doc .meta{display:grid;grid-template-columns:auto 1fr;gap:2px 14px;margin:12px 0 4px;font-family:system-ui,sans-serif;font-size:12.5px}
.doc .meta dt{color:#59606A}.doc .meta dd{margin:0}
.doc .kicker{font-family:system-ui,sans-serif;font-size:11px;letter-spacing:.08em;text-transform:uppercase;color:#8A5A0B}
.doc table{width:100%;border-collapse:collapse;font-size:12.5px;font-family:system-ui,sans-serif}
.doc th{text-align:left;font-weight:600;color:#59606A;border-bottom:1px solid #59606A;padding:4px 8px 4px 0;font-size:11px;letter-spacing:.04em;text-transform:uppercase}
.doc td{border-bottom:1px solid #ECE6D6;padding:6px 8px 6px 0;vertical-align:top}
.doc td.id{font-weight:700;white-space:nowrap}
.doc blockquote{margin:6px 0;padding:6px 12px;border-left:3px solid #D99A2B;background:#FBF0D6}
.doc .box{border:1px solid #D8D1BF;padding:8px 12px;margin:8px 0;background:#fff}
.doc .muted{color:#59606A}
.doc .chips span{display:inline-block;border:1px solid #8A5A0B;background:#FBF0D6;border-radius:99px;padding:1px 9px;margin:2px 4px 2px 0;font-family:system-ui,sans-serif;font-size:12px}
.doc .foot{margin-top:26px;padding-top:8px;border-top:1px solid #59606A;font-family:system-ui,sans-serif;font-size:12px;color:#59606A}
.doc .legend{font-family:system-ui,sans-serif;font-size:11.5px;color:#59606A;margin:4px 0 0}
.doc svg{display:block;margin:8px 0}
@media print{.doc{font-size:12px}.doc h2{break-after:avoid}.doc table,.doc svg,.doc blockquote{break-inside:avoid}}
`;

const dateLabel = () =>
  new Date().toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });

function header(title: string, level: string, p: Persisted): string {
  return `
<div class="kicker">${esc(COURSE)}</div>
<h1>${esc(title)}</h1>
<dl class="meta">
  <dt>Course</dt><dd>${esc(COURSE)}</dd>
  <dt>Position</dt><dd>${esc(level)}</dd>
  <dt>Participant</dt><dd>No. ${esc(p.participant.no.trim() || "—")} · ${esc(p.participant.name.trim() || "—")}</dd>
  <dt>Date</dt><dd>${esc(dateLabel())}</dd>
</dl>`;
}

// --- Task 1 -----------------------------------------------------------------

export function diagnosticBody(p: Persisted): string {
  const { placements, verdict, checks } = p.l1;
  const rows = RECORDS.map((r) => {
    const b = placements[r.id];
    return `<tr><td class="id">${r.id}</td><td>${esc(r.source)}</td><td>${esc(r.when)}</td><td>${esc(r.text)}</td><td>${b ? esc(BIN_LABEL[b]) : '<span class="muted">not placed</span>'}</td></tr>`;
  }).join("");
  const cites = [verdict.cite1, verdict.cite2].filter(Boolean);
  return `
${header("Diagnostic Note — Kessler Präzisionstechnik GmbH", "Day 1 · Route 1 · Level 1 · Task 1", p)}
<h2>1. Evidence register</h2>
<table><thead><tr><th>ID</th><th>Source</th><th>Month</th><th>Record</th><th>Filed under</th></tr></thead><tbody>${rows}</tbody></table>
<h2>2. Evidence board</h2>
${evidenceBoardSvg(placements, "note")}
<p class="legend">Solid: an observed record. Hatched: an interpretation filed as if it were evidence. Outline: an observed record set aside.</p>
<h2>3. Verdict</h2>
<div class="box">
  <div><span class="muted">Category holding the most observed evidence of a shortfall on TechSolutions' side:</span> <strong>${verdict.category ? esc(BIN_LABEL[verdict.category]) : "—"}</strong></div>
  <div style="margin-top:4px"><span class="muted">Cited records:</span> ${cites.length ? cites.map((c) => `<strong>${esc(c)}</strong> (${esc(RECORD_BY_ID[c as keyof typeof RECORD_BY_ID].source)})`).join(", ") : "—"}</div>
  <blockquote>${verdict.sentence.trim() ? esc(verdict.sentence.trim()) : "—"}</blockquote>
  ${verdict.filedAt ? `<div class="muted">Filed ${esc(new Date(verdict.filedAt).toLocaleString("en-GB"))}</div>` : `<div class="muted">Not filed yet.</div>`}
</div>
<div class="foot">Checks requested: ${checks}</div>`;
}

// --- Task 2 -----------------------------------------------------------------

export function calculationBody(p: Persisted): string {
  const { l1, l2 } = p;
  const v = l1.verdict;
  const cites = [v.cite1, v.cite2].filter(Boolean);
  const premise = v.filedAt
    ? `<div class="box"><div><span class="muted">You named:</span> <strong>${v.category ? esc(BIN_LABEL[v.category]) : "—"}</strong> · <span class="muted">cited</span> ${cites.map(esc).join(", ") || "—"}</div><blockquote>${esc(v.sentence.trim())}</blockquote></div>`
    : `<div class="box muted">No verdict was filed in Task 1.</div>`;

  const figRows = FIGURES.map(
    (f) => `<tr><td class="id">${f.id}</td><td>${esc(f.question)}</td><td><strong>${l2.fillins[f.id].trim() ? esc(l2.fillins[f.id].trim()) : "—"}</strong></td></tr>`,
  ).join("");

  const motiveRows = KESSLER_ROLES.map(
    (r) => `<tr><td class="id">${esc(r.name)}</td><td>${esc(r.wind)}</td><td>${esc(r.statement)}</td><td><strong>${l2.motives[r.key] ? esc(MOTIVE_LABEL[l2.motives[r.key]!]) : "—"}</strong></td></tr>`,
  ).join("");

  const cited = citedFigures(l2.justification, l2);
  const q6 = l2.q6.trim();
  const rec = l2.recommendation ? RECOMMENDATION_LABEL[l2.recommendation] : "—";

  return `
${header("Calculation Note — the Kessler re-tender", "Day 1 · Route 2 · Level 2 · Task 2", p)}
<h2>1. Premise</h2>
${premise}
<h2>2. Figures</h2>
<table><thead><tr><th>#</th><th>Question</th><th>Your entry</th></tr></thead><tbody>${figRows}</tbody></table>
<h2>3. Motive map</h2>
${motiveMapSvg(l2.motives, "note")}
<table><thead><tr><th>Role</th><th>Buying-centre position</th><th>Statement</th><th>Motive you chose</th></tr></thead><tbody>${motiveRows}</tbody></table>
<h2>4. Recommendation</h2>
<div class="box">
  <div><span class="muted">Recommendation:</span> <strong>${esc(rec)}</strong></div>
  <blockquote>${l2.justification.trim() ? esc(l2.justification.trim()) : "—"}</blockquote>
  <div class="chips"><span class="muted" style="font-family:system-ui,sans-serif;font-size:12px">Figures cited:</span> ${cited.length ? cited.map((c) => `<span>${esc(c.value.toLocaleString("en-US"))} · ${esc(c.from)}</span>`).join("") : '<span class="muted">none</span>'}</div>
  <div class="muted" style="margin-top:4px">Care after go-live add-on in the cost explorer: ${l2.careOn ? "on" : "off"}.</div>
</div>
<h2>5. Limits</h2>
<div class="box">
  <div class="muted">What this choice does not fix</div>
  <blockquote>${l2.limits.trim() ? esc(l2.limits.trim()) : "—"}</blockquote>
  <div class="muted">Question 6 — a share of one-off customers who would place a follow-on order within 24 months, from Kessler alone</div>
  <blockquote>${q6 ? esc(q6) : "—"}</blockquote>
</div>
<div class="foot">Checks requested: ${l2.checks}</div>`;
}

// --- Wrapping / delivery ------------------------------------------------------

export function wrapDocument(title: string, body: string): string {
  return `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>${esc(title)}</title>
<style>body{margin:0;background:#F3EFE4}.sheet{max-width:820px;margin:0 auto;padding:36px 40px;background:#FFFEFA}@media print{body{background:#fff}.sheet{padding:0;max-width:none}@page{margin:16mm}}${DOC_CSS}</style>
</head><body><div class="sheet"><div class="doc">${body}</div></div></body></html>`;
}

export function downloadHtml(filename: string, html: string) {
  const blob = new Blob([html], { type: "text/html;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename.endsWith(".html") ? filename : `${filename}.html`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}

/** Opens the same document in a new window and prints it (no PDF library). Falls back to a hidden frame if pop-ups are blocked. */
export function printDocument(title: string, html: string) {
  const win = window.open("", "_blank");
  if (win) {
    win.document.open();
    win.document.write(html);
    win.document.close();
    win.document.title = title;
    win.focus();
    window.setTimeout(() => win.print(), 250);
    return;
  }
  const iframe = document.createElement("iframe");
  iframe.style.cssText = "position:fixed;right:0;bottom:0;width:0;height:0;border:0;visibility:hidden";
  document.body.appendChild(iframe);
  const w = iframe.contentWindow;
  if (!w) return iframe.remove();
  w.document.open();
  w.document.write(html);
  w.document.close();
  window.setTimeout(() => {
    w.focus();
    w.print();
    window.setTimeout(() => iframe.remove(), 1000);
  }, 250);
}
