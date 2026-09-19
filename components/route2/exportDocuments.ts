import { ENGAGEMENT, EXPORT, GUIDING_DECISIONS, LAYERS, RELEVANCE_REASONS, ROLES, SEQUENCE_POSITIONS, roleById } from "@/lib/route2";
import { CASE } from "@/lib/routes";
import type { Route2State } from "./useRoute2";

const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

/** One print-ready HTML export — "Save as PDF" is the export, no PDF library. */
export function buildProposalHtml(r2: Route2State): string {
  const date = new Date().toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });

  const reasonRows = r2.selectedReasons.map((id) => `<li>${esc(RELEVANCE_REASONS.find((r) => r.id === id)!.text)}</li>`).join("");

  const guidingRows = r2.selectedGuiding
    .map((id) => {
      const d = GUIDING_DECISIONS.find((g) => g.id === id)!;
      return `<li><strong>${esc(d.text)}</strong><div class="muted">${esc(r2.guidingJustifications[id] || "—")}</div></li>`;
    })
    .join("");

  const sequenceRows = SEQUENCE_POSITIONS.map((pos) => {
    const layer = LAYERS.find((l) => r2.sequence[l.id] === pos);
    return `<li>${layer ? esc(layer.name) : "—"}</li>`;
  }).join("");

  const allocationRows = r2.allocationRanked.map((f) => `<tr><td>${esc(f.name)}</td><td class="nowrap">${r2.allocation[f.id]}</td></tr>`).join("");

  const governanceRows = ROLES.map((role) => {
    const held = r2.byRole(role.id);
    return `<tr><td>${esc(role.name)}</td><td>${held.length ? esc(held.map((h) => h.name).join(", ")) : "<em>none</em>"}</td></tr>`;
  }).join("");

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
  ol, ul { margin: 6px 0 0; padding-left: 20px; font-size: 13px; }
  ul li, ol li { margin-bottom: 6px; }
  .meta { margin: 0; color: #5E6670; font-size: 13px; }
  table { width: 100%; border-collapse: collapse; margin-top: 8px; font-size: 13px; }
  th { text-align: left; font-size: 11px; letter-spacing: .05em; text-transform: uppercase;
       color: #5E6670; border-bottom: 1px solid #E2E5E9; padding: 8px 10px 8px 0; font-weight: 700; }
  td { vertical-align: top; padding: 9px 10px 9px 0; border-bottom: 1px solid #EEF1F3; }
  .muted { color: #5E6670; font-size: 12px; font-style: italic; }
  .nowrap { white-space: nowrap; }
  .summary { margin-top: 10px; padding: 14px 16px; border-radius: 10px; background: #EEF1F3; }
  .closing { margin-top: 10px; padding: 14px 16px; border-radius: 10px; border: 1px solid #E2E5E9; }
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
  <p class="kicker">AION Green IT · Day ${CASE.day} · Route 2 · Level 3</p>
  <h1>${esc(EXPORT.docHeading)}</h1>
  <p class="meta">${esc(r2.name.trim() || "learner")} · ${esc(date)} · Case: ${esc(ENGAGEMENT.company)}</p>

  <h2>1. Strategic relevance</h2>
  <p>Lens: <strong>${r2.roleLens ? esc(roleById(r2.roleLens).name) : "— not picked"}</strong></p>
  <ul>${reasonRows}</ul>
  <p class="muted">${esc(r2.relevanceJustification || "—")}</p>

  <h2>2. Three guiding decisions for the next 12 months</h2>
  <ul>${guidingRows}</ul>

  <h2>3. Build sequence</h2>
  <ol>${sequenceRows}</ol>
  <p class="muted">First move — ${esc(r2.firstMove || "—")}</p>

  <h2>4. Trade-off priority allocation</h2>
  <table><thead><tr><th>Factor</th><th>Points</th></tr></thead><tbody>${allocationRows}</tbody></table>

  <h2>5. Governance & responsibility matches</h2>
  <table><thead><tr><th>Role</th><th>Responsibilities</th></tr></thead><tbody>${governanceRows}</tbody></table>

  <h2>6. The decision to take now</h2>
  <div class="closing"><strong>Decision — </strong>${esc(r2.nowDecision || "—")}</div>
  <div class="closing"><strong>Risk of waiting — </strong>${esc(r2.riskOfWaiting || "—")}</div>

  <div class="summary">
    <strong>Verdeon Digital Governance Group Management Proposal — complete.</strong>
  </div>

  <footer>
    AION Green IT — Day ${CASE.day}, Route 2 (Management Decision), Level 3. ${esc(ENGAGEMENT.company)} is a fictional case for training use. Prepared by the learner named above.
  </footer>
</div>
</body>
</html>`;
}
