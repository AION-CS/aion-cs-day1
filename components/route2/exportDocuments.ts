import { CRITERIA, OPTIONS, CRITERION_DATA, TASK2, type OptionId } from "@/lib/route2";
import type { useRoute2 } from "./useRoute2";
import type { DecisionMemoData } from "./useDecisionMemoData";

type Route2State = ReturnType<typeof useRoute2>;

/** Raw structured answers + chosen statement text, for grading/QA — not shown to the learner during the exercise. */
export function buildReportJson(r2: Route2State, memo: DecisionMemoData, filename: string): string {
  const payload = {
    meta: {
      day: 7,
      route: 2,
      level: TASK2.export.filenameLevel,
      task: TASK2.export.filenameTask,
      filename,
      name: r2.name,
      exportedAt: new Date().toISOString(),
    },
    criteria: CRITERIA.map((c) => ({
      id: c.id,
      label: c.label,
      options: OPTIONS.map((o) => {
        const pickedId = r2.picks[c.id]?.[o.id as OptionId];
        const statement = pickedId ? CRITERION_DATA[c.id][o.id as OptionId].statements.find((s) => s.id === pickedId) : undefined;
        return {
          option: o.id,
          score: statement?.score ?? null,
          statement: statement?.text ?? null,
        };
      }),
    })),
    decision: {
      recommendation: memo.recommendation,
      justification: memo.justification,
      followUps: r2.followUps,
      risks: r2.risks,
    },
  };
  return JSON.stringify(payload, null, 2);
}

const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

/** Standalone, print-ready HTML document — no external stylesheet, so it opens correctly on its own. */
export function buildReportHtml(memo: DecisionMemoData): string {
  const scoreRows = memo.scoreTable
    .map(
      (row) =>
        `<tr><td>${esc(row.criterion)}</td>${OPTIONS.map((o) => `<td style="text-align:center">${row.scores[o.id] || "—"}</td>`).join("")}</tr>`,
    )
    .join("");

  const list = (items: string[]) => `<ul>${items.map((t) => `<li>${esc(t)}</li>`).join("")}</ul>`;

  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<title>${esc(TASK2.export.docHeading)} — ${esc(memo.name)}</title>
<style>
  body { font-family: "Segoe UI", Arial, sans-serif; color: #16191D; max-width: 720px; margin: 40px auto; padding: 0 20px; line-height: 1.5; }
  h1 { font-size: 22px; margin-bottom: 4px; }
  h2 { font-size: 15px; text-transform: uppercase; letter-spacing: 0.04em; color: #5E6670; margin-top: 28px; border-bottom: 1px solid #E2E5E9; padding-bottom: 4px; }
  .meta { color: #5E6670; font-size: 13px; margin-bottom: 20px; }
  table { border-collapse: collapse; width: 100%; font-size: 13.5px; margin-top: 8px; }
  th, td { padding: 4px 8px; border-bottom: 1px solid #E2E5E9; text-align: left; }
  ul { margin-top: 4px; padding-left: 20px; font-size: 13.5px; }
  li { margin-bottom: 3px; }
  .kicker { text-transform: uppercase; letter-spacing: 0.06em; font-size: 11px; color: #5E6670; }
  @media print { body { margin: 0; max-width: none; } }
</style>
</head>
<body>
  <p class="kicker">AION Green IT · Day 7 · Route 2</p>
  <h1>${esc(TASK2.export.docHeading)}</h1>
  <p class="meta">Author: <strong>${esc(memo.name)}</strong> &nbsp;·&nbsp; Date: <strong>${esc(memo.date)}</strong> &nbsp;·&nbsp; Subject: <strong>${esc(memo.caseReference)}</strong></p>

  <h2>Radar Summary</h2>
  <table><thead><tr><th>Criterion</th>${OPTIONS.map((o) => `<th style="text-align:center">${o.id}</th>`).join("")}</tr></thead><tbody>${scoreRows}</tbody></table>

  <h2>Recommendation &amp; Justification</h2>
  <p><strong>${esc(memo.recommendation || "—")}</strong></p>
  <p>${esc(memo.justification || "—")}</p>

  <h2>Follow-up Decisions</h2>
  ${memo.followUps.length ? list(memo.followUps) : "<p>—</p>"}

  <h2>Risk Register</h2>
  ${memo.risks.length ? list(memo.risks) : "<p>—</p>"}
</body>
</html>`;
}
