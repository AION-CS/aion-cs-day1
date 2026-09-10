import { TASK3 } from "@/lib/route3";
import type { useRoute3 } from "./useRoute3";
import type { ManagementReportData } from "./useManagementReportData";

type Route3State = ReturnType<typeof useRoute3>;

/** Raw structured answers, for grading/QA — not shown to the learner during the exercise. */
export function buildReportJson(r3: Route3State, report: ManagementReportData, filename: string): string {
  const payload = {
    meta: {
      day: 8,
      route: 3,
      level: TASK3.export.filenameLevel,
      task: TASK3.export.filenameTask,
      filename,
      name: r3.name,
      exportedAt: new Date().toISOString(),
    },
    stage2: r3.stage2Node,
    stage3: { selected: r3.stage3Selected, reasons: r3.stage3Reason },
    stage4: { horizons: r3.stage4Horizon, firstMove: r3.firstMove, firstMoveJustify: r3.firstMoveJustify },
    stage6: {
      strategicRelevance: r3.strategicRelevance,
      guidingDecisions: r3.guidingDecisions,
      prioritizationLogic: r3.prioritizationLogic,
      tradeoffs: r3.tradeoffs,
      firstMeasure: r3.firstMeasure,
      firstMeasureJustify: r3.firstMeasureJustify,
      roles: r3.roleFields,
      decideNow: r3.decideNow,
      waitingMeans: r3.waitingMeans,
    },
    report,
  };
  return JSON.stringify(payload, null, 2);
}

const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

/** Standalone, print-ready HTML document — no external stylesheet, so it opens correctly on its own. */
export function buildReportHtml(report: ManagementReportData): string {
  const list = (items: string[]) => `<ul>${items.map((t) => `<li>${esc(t)}</li>`).join("")}</ul>`;

  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<title>${esc(TASK3.export.docHeading)} — ${esc(report.name)}</title>
<style>
  body { font-family: "Segoe UI", Arial, sans-serif; color: #16191D; max-width: 720px; margin: 40px auto; padding: 0 20px; line-height: 1.5; }
  h1 { font-size: 22px; margin-bottom: 4px; }
  h2 { font-size: 15px; text-transform: uppercase; letter-spacing: 0.04em; color: #5E6670; margin-top: 28px; border-bottom: 1px solid #E2E5E9; padding-bottom: 4px; }
  h3 { font-size: 14px; margin-bottom: 2px; }
  .meta { color: #5E6670; font-size: 13px; margin-bottom: 20px; }
  ul, ol { margin-top: 4px; padding-left: 20px; font-size: 13.5px; }
  li { margin-bottom: 3px; }
  .kicker { text-transform: uppercase; letter-spacing: 0.06em; font-size: 11px; color: #5E6670; }
  @media print { body { margin: 0; max-width: none; } }
</style>
</head>
<body>
  <p class="kicker">AION Green IT · Day 8 · Route 3</p>
  <h1>${esc(TASK3.export.docHeading)}</h1>
  <p class="meta">Advisor: <strong>${esc(report.name)}</strong> &nbsp;·&nbsp; Date: <strong>${esc(report.date)}</strong> &nbsp;·&nbsp; Subject: <strong>${esc(report.caseReference)}</strong></p>

  <h2>1. Strategic Relevance</h2>
  <p>Sustainable cloud use matters strategically for Helix because ${esc(report.strategicRelevance || "—")}</p>

  <h2>2. Guiding Decisions</h2>
  <ol>${report.guidingDecisions.map((d) => `<li>${esc(d)}</li>`).join("") || "<li>—</li>"}</ol>

  <h2>3. Decision Logic</h2>
  <p>Future cloud measures should be assessed and prioritized by ${esc(report.prioritizationLogic || "—")}</p>

  <h2>4. Central Trade-off</h2>
  ${report.tradeoffs.length ? list(report.tradeoffs) : "<p>—</p>"}

  <h2>5. First Prioritized Measures</h2>
  <p><strong>${esc(report.firstMeasure || "—")}.</strong> ${esc(report.firstMeasureJustify || "")}</p>

  <h2>6. Roles, Approval &amp; Review</h2>
  <ul>${report.roles.map((r) => `<li><strong>${esc(r.label)}:</strong> ${esc(r.mandate || "—")}</li>`).join("")}</ul>

  <h2>7. The Decision Now, Despite Incomplete Data</h2>
  <p>Even without complete data, Helix must decide now to ${esc(report.decideNow || "—")}, because waiting would mean ${esc(report.waitingMeans || "—")}.</p>

  <h2>Appendix — SkyBridge Diagnostic</h2>
  ${report.architectureByNode.map((g) => `<h3>${esc(g.node)}</h3>${list(g.items)}`).join("") || "<p>—</p>"}
</body>
</html>`;
}
