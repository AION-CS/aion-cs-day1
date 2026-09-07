import { EVIDENCE_ITEMS, DIMENSIONS, STATEMENT_PROMPTS, STAGE5_CLASSIFICATION, TASK1 } from "@/lib/route1";
import type { useRoute1 } from "./useRoute1";
import type { DecisionReportData } from "./useDecisionReportData";

type Route1State = ReturnType<typeof useRoute1>;

/** Raw structured answers + correctness flags, for grading/QA — not shown to the learner during the exercise. */
export function buildReportJson(r1: Route1State, report: DecisionReportData, filename: string): string {
  const payload = {
    meta: {
      day: 8,
      route: 1,
      level: TASK1.export.filenameLevel,
      task: TASK1.export.filenameTask,
      filename,
      name: r1.name,
      exportedAt: new Date().toISOString(),
    },
    stage2: EVIDENCE_ITEMS.map((it) => {
      const verdict = r1.stage2Verdict[it.id] ?? null;
      return { id: it.id, text: it.text, verdict, correctVerdict: it.correctVerdict, matched: verdict === it.correctVerdict };
    }),
    stage3: EVIDENCE_ITEMS.map((it) => {
      const dimension = r1.stage3Dimension[it.id] ?? null;
      return { id: it.id, text: it.text, dimension, correctDimension: it.correctDimension, matched: dimension === it.correctDimension };
    }),
    stage4: STATEMENT_PROMPTS.map((p) => ({ id: p.id, starter: p.starter, answer: r1.stage4Statement[p.id] ?? "" })),
    stage5: r1.stage5Items.map((it) => {
      const side = r1.stage5Side[it.id] ?? null;
      const correctSide = STAGE5_CLASSIFICATION[it.id]?.correctSide ?? null;
      return { id: it.id, text: it.text, side, correctSide, matched: side === correctSide };
    }),
    report,
  };
  return JSON.stringify(payload, null, 2);
}

const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

/** Standalone, print-ready HTML document — no external stylesheet, so it opens correctly on its own. */
export function buildReportHtml(report: DecisionReportData): string {
  const list = (items: string[]) => `<ul>${items.map((t) => `<li>${esc(t)}</li>`).join("")}</ul>`;

  const dimensionBlocks = report.byDimension
    .map((g) => `<h3>${esc(g.dimension)} (${g.items.length})</h3>${list(g.items)}`)
    .join("");

  const statements = report.statements
    .filter((s) => s.answer.trim())
    .map((s) => `<li>&ldquo;${esc(s.starter)} ${esc(s.answer)}&rdquo;</li>`)
    .join("");

  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<title>${esc(TASK1.export.docHeading)} — ${esc(report.name)}</title>
<style>
  body { font-family: "Segoe UI", Arial, sans-serif; color: #16191D; max-width: 720px; margin: 40px auto; padding: 0 20px; line-height: 1.5; }
  h1 { font-size: 22px; margin-bottom: 4px; }
  h2 { font-size: 15px; text-transform: uppercase; letter-spacing: 0.04em; color: #5E6670; margin-top: 28px; border-bottom: 1px solid #E2E5E9; padding-bottom: 4px; }
  h3 { font-size: 14px; margin-bottom: 2px; }
  .meta { color: #5E6670; font-size: 13px; margin-bottom: 20px; }
  ul { margin-top: 4px; padding-left: 20px; font-size: 13.5px; }
  li { margin-bottom: 3px; }
  .kicker { text-transform: uppercase; letter-spacing: 0.06em; font-size: 11px; color: #5E6670; }
  @media print { body { margin: 0; max-width: none; } }
</style>
</head>
<body>
  <p class="kicker">AION Green IT · Day 8 · Route 1</p>
  <h1>${esc(TASK1.export.docHeading)}</h1>
  <p class="meta">Analyst: <strong>${esc(report.name)}</strong> &nbsp;·&nbsp; Date: <strong>${esc(report.date)}</strong> &nbsp;·&nbsp; Subject: <strong>${esc(report.caseReference)}</strong></p>

  <h2>Benefit / Risk Classification</h2>
  <h3>Benefit (${report.benefits.length})</h3>
  ${list(report.benefits) || "<p>—</p>"}
  <h3>Risk / Challenge (${report.risks.length})</h3>
  ${list(report.risks) || "<p>—</p>"}

  <h2>6-Dimension Mapping</h2>
  ${dimensionBlocks || "<p>—</p>"}

  <h2>Sustainability Statements</h2>
  <ul>${statements || "<li>—</li>"}</ul>

  <h2>Technical vs. Governance Findings</h2>
  <h3>Technical (${report.techGovSplit.technical.length})</h3>
  ${list(report.techGovSplit.technical) || "<p>—</p>"}
  <h3>Governance (${report.techGovSplit.governance.length})</h3>
  ${list(report.techGovSplit.governance) || "<p>—</p>"}
</body>
</html>`;
}
