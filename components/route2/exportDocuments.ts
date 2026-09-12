import { EVIDENCE_CARDS, CRITERIA, MEASURES, CONSTRAINTS, GATES, RISKS, TASK2 } from "@/lib/route2";
import type { useRoute2 } from "./useRoute2";
import type { MemoData } from "./useMemoData";

type Route2State = ReturnType<typeof useRoute2>;

/** Raw structured answers plus model comparisons, for grading/QA — never shown during the exercise. */
export function buildReportJson(r2: Route2State, memo: MemoData, filename: string): string {
  const payload = {
    meta: {
      day: 9,
      route: 2,
      level: TASK2.export.filenameLevel,
      task: TASK2.export.filenameTask,
      filename,
      name: r2.name,
      exportedAt: new Date().toISOString(),
    },
    evidence: EVIDENCE_CARDS.map((c) => ({
      n: c.n,
      id: c.id,
      confidence: r2.confidence[c.id] ?? null,
      modelConfidence: c.modelConfidence,
      confidenceMatched: r2.confidence[c.id] === c.modelConfidence,
      relevance: r2.relevance[c.id] ?? null,
      modelRelevance: c.modelRelevance,
      relevanceMatched: r2.relevance[c.id] === c.modelRelevance,
    })),
    contradictionStance: { chosen: r2.stance ?? null, model: "scope", matched: r2.stance === "scope" },
    weights: CRITERIA.map((c) => ({
      criterion: c.id,
      weight: r2.weights[c.id] ?? 0,
      modelWeight: c.modelWeight,
      justification: r2.weightWhy[c.id] ?? null,
      modelJustification: c.modelWhy,
    })),
    weightTotal: r2.weightTotal,
    matrix: GATES.map((g) => {
      const key = `${g.measureId}:${g.criterionId}`;
      const answer = r2.gateAnswer[key] ?? null;
      return {
        measure: g.measureId,
        criterion: g.criterionId,
        gateAnswer: answer,
        modelGateAnswer: g.modelOption,
        gateMatched: answer === g.modelOption,
        score: r2.score[key] ?? null,
        modelScore: g.modelScore,
      };
    }),
    totals: r2.totals,
    derivedRanking: r2.derivedRanking,
    submittedRanking: memo.ranking,
    sensitivity: { result: r2.sensitivity ?? null, note: r2.sensitivityNote },
    constraints: CONSTRAINTS.map((c) => ({
      id: c.id,
      placedOn: r2.constraintPlacement[c.id] ?? null,
      modelMeasure: c.modelMeasure,
      matched: r2.constraintPlacement[c.id] === c.modelMeasure,
      mitigation: r2.mitigation[c.id] ?? "",
    })),
    shock: { answer: r2.shock ?? null, model: "unchanged", matched: r2.shock === "unchanged", note: r2.shockNote },
    justification: r2.justification,
    risks: RISKS.filter((r) => r2.pickedRisks.includes(r.id)).map((r) => ({
      id: r.id,
      label: r.label,
      isModelAnswer: r.isModel,
      note: r2.riskNote[r.id] ?? "",
    })),
    uncertainty: r2.uncertainty,
  };
  return JSON.stringify(payload, null, 2);
}

const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

/** Standalone, print-ready HTML memo — no external stylesheet, so it opens correctly on its own. */
export function buildReportHtml(memo: MemoData): string {
  const weightRows = memo.weights
    .map((w) => `<tr><td>${esc(w.criterion)}</td><td class="num">${w.weight}</td><td>${esc(w.why ?? "—")}</td></tr>`)
    .join("");

  const matrixHead = CRITERIA.map((c) => `<th class="num">${esc(c.label)}</th>`).join("");
  const matrixRows = memo.matrix
    .map(
      (row) =>
        `<tr><td>${esc(row.measure)}</td>${row.scores
          .map((s) => `<td class="num">${s.score ?? "—"}</td>`)
          .join("")}<td class="num"><strong>${row.total.toFixed(2)}</strong></td></tr>`,
    )
    .join("");

  const evidenceRows = memo.evidence
    .map((e) => `<tr><td class="num">${e.n}</td><td>${esc(e.finding)}</td><td>${esc(e.confidence ?? "—")}</td><td>${esc(e.relevance ?? "—")}</td></tr>`)
    .join("");

  const constraintRows = memo.constraints
    .map((c) => `<tr><td>${esc(c.text)}</td><td>${esc(c.measure ?? "—")}</td><td>${esc(c.mitigation || "—")}</td></tr>`)
    .join("");

  const rankingList = memo.ranking.map((r) => `<li>${esc(r.measure)}</li>`).join("");
  const riskList = memo.risks.map((r) => `<li><strong>${esc(r.label)}</strong> — ${esc(r.note || "—")}</li>`).join("");

  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<title>${esc(TASK2.export.docHeading)} — ${esc(memo.name)}</title>
<style>
  body { font-family: "Segoe UI", Arial, sans-serif; color: #16191D; max-width: 760px; margin: 40px auto; padding: 0 20px; line-height: 1.5; }
  h1 { font-size: 22px; margin-bottom: 4px; }
  h2 { font-size: 15px; text-transform: uppercase; letter-spacing: 0.04em; color: #5E6670; margin-top: 28px; border-bottom: 1px solid #E2E5E9; padding-bottom: 4px; }
  .meta { color: #5E6670; font-size: 13px; margin-bottom: 20px; }
  .kicker { text-transform: uppercase; letter-spacing: 0.06em; font-size: 11px; color: #5E6670; }
  table { border-collapse: collapse; width: 100%; font-size: 12.5px; margin-top: 6px; }
  th, td { border: 1px solid #E2E5E9; padding: 5px 7px; text-align: left; vertical-align: top; }
  th { background: #F5F6F7; font-size: 11.5px; text-transform: uppercase; letter-spacing: 0.03em; color: #5E6670; }
  td.num, th.num { text-align: right; white-space: nowrap; }
  ul, ol { font-size: 13.5px; padding-left: 20px; }
  li { margin-bottom: 4px; }
  .quote { background: #F5F6F7; border-left: 3px solid #0E7A5A; padding: 10px 14px; font-size: 13.5px; }
  @media print { body { margin: 0; max-width: none; } }
</style>
</head>
<body>
  <p class="kicker">AION Green IT · Day 9 · Route 2 · Level 2</p>
  <h1>${esc(TASK2.export.docHeading)}</h1>
  <p class="meta">Advisor: <strong>${esc(memo.name)}</strong> &nbsp;·&nbsp; Date: <strong>${esc(memo.date)}</strong> &nbsp;·&nbsp; Subject: <strong>${esc(memo.caseReference)}</strong></p>

  <h2>1 · Evidence base</h2>
  <p>Confidence index: <strong>${memo.confidenceIndex.verified}</strong> verified · <strong>${memo.confidenceIndex.partial}</strong> partial · <strong>${memo.confidenceIndex.assumed}</strong> assumed</p>
  <p>Contradiction stance: <strong>${esc(memo.stance ?? "—")}</strong></p>
  <table><thead><tr><th class="num">#</th><th>Finding</th><th>Confidence</th><th>Decision relevance</th></tr></thead><tbody>${evidenceRows}</tbody></table>

  <h2>2 · Criteria weights</h2>
  <table><thead><tr><th>Criterion</th><th class="num">Weight</th><th>Justification</th></tr></thead><tbody>${weightRows}</tbody></table>

  <h2>3 · Weighted scoring matrix</h2>
  <table><thead><tr><th>Measure</th>${matrixHead}<th class="num">Total</th></tr></thead><tbody>${matrixRows}</tbody></table>
  <p>Matrix order: <strong>${esc(memo.derivedRanking)}</strong></p>
  <p>Sensitivity test: <strong>${esc(memo.sensitivity.result ?? "—")}</strong> — ${esc(memo.sensitivity.note || "—")}</p>

  <h2>4 · Constraint stress-test</h2>
  <table><thead><tr><th>Constraint</th><th>Most threatens</th><th>Mitigation</th></tr></thead><tbody>${constraintRows}</tbody></table>
  <p>Mid-year update: <strong>${esc(memo.shock.answer ?? "—")}</strong> — ${esc(memo.shock.note || "—")}</p>

  <h2>5 · Recommendation</h2>
  <ol>${rankingList || "<li>—</li>"}</ol>
  <p class="quote">${esc(memo.justification || "—")}</p>

  <h2>6 · Risks of a visible-but-weak choice</h2>
  <ul>${riskList || "<li>—</li>"}</ul>

  <h2>7 · Decided under uncertainty</h2>
  <p class="quote">${esc(memo.uncertainty || "—")}</p>
</body>
</html>`;
}
