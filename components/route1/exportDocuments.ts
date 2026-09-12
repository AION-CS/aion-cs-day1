import { CATEGORIES, HOTSPOTS, TASK1, categoryById } from "@/lib/route1";
import type { Route1State } from "./useRoute1";

const FIX_LABEL: Record<string, string> = {
  quick: "Quick Fix",
  structural: "Structural Fix",
};

const fixLabel = (v: string | null) => (v ? (FIX_LABEL[v] ?? v) : "—");

/**
 * Raw structured answers plus correctness flags, for grading and QA. Never
 * shown to the learner during the exercise — the task itself only ever offers
 * a clue.
 */
export function buildReportJson(r1: Route1State, filename: string): string {
  const payload = {
    meta: {
      day: 10,
      route: 1,
      level: TASK1.export.filenameLevel,
      task: TASK1.export.filenameTask,
      filename,
      name: r1.name,
      case: TASK1.company,
      exportedAt: new Date().toISOString(),
    },
    findings: r1.reportRows.map((f, i) => ({
      position: i + 1,
      id: f.hotspot.id,
      hotspot: f.hotspot.n,
      title: f.hotspot.title,
      location: f.hotspot.location,
      symptom: f.hotspot.symptom,
      category: f.category,
      correctCategory: f.hotspot.correctCategory,
      categoryMatched: f.category === f.hotspot.correctCategory,
      leverId: f.leverId,
      lever: f.leverText,
      correctLeverId: f.hotspot.correctLever,
      leverMatched: f.leverId === f.hotspot.correctLever,
      fixType: f.fixType,
      correctFixType: f.hotspot.correctFixType,
      fixTypeMatched: f.fixType === f.hotspot.correctFixType,
      justification: f.justification,
      complete: f.complete,
    })),
    notSorted: HOTSPOTS.filter((h) => !r1.placements[h.id]).map((h) => ({ id: h.id, title: h.title })),
    reflection: r1.reflection,
    summary: {
      completed: r1.completeCount,
      total: r1.totalHotspots,
      quick: r1.quickCount,
      structural: r1.structuralCount,
      categoryScore: r1.findings.filter((f) => f.category === f.hotspot.correctCategory).length,
      leverScore: r1.findings.filter((f) => f.leverId === f.hotspot.correctLever).length,
      fixTypeScore: r1.findings.filter((f) => f.fixType === f.hotspot.correctFixType).length,
    },
  };
  return JSON.stringify(payload, null, 2);
}

const esc = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

/**
 * Standalone, print-ready HTML document — no external stylesheet, so it opens
 * and prints correctly on its own. Structure mirrors the established AION
 * Green IT export: header → classification table → reflection → closing
 * summary.
 */
export function buildReportHtml(r1: Route1State): string {
  const date = new Date().toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const rows = r1.reportRows
    .map(
      (f) => `<tr>
      <td><strong>${esc(f.hotspot.title)}</strong><div class="muted">${esc(f.hotspot.location)}</div></td>
      <td>${esc(f.category ? categoryById(f.category).name : "—")}</td>
      <td>${esc(f.leverText ?? "—")}</td>
      <td class="nowrap">${esc(fixLabel(f.fixType))}</td>
    </tr>${
      f.justification
        ? `<tr class="why"><td colspan="4"><span class="muted">Justification — </span>&ldquo;${esc(
            f.justification,
          )}&rdquo;</td></tr>`
        : ""
    }`,
    )
    .join("");

  const unsorted = HOTSPOTS.filter((h) => !r1.placements[h.id]);
  const unsortedBlock = unsorted.length
    ? `<p class="muted">Not classified: ${unsorted.map((h) => esc(h.title)).join(", ")}.</p>`
    : "";

  const spread = CATEGORIES.map((c) => {
    const n = r1.reportRows.filter((f) => f.category === c.id).length;
    return n > 0 ? `${esc(c.name)} (${n})` : null;
  })
    .filter(Boolean)
    .join(" · ");

  const summaryLine =
    r1.completeCount === 0
      ? "No findings completed."
      : `${r1.structuralCount} of ${r1.completeCount} findings require a structural standard, not a one-off patch.`;

  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>${esc(TASK1.export.docHeading)} — ${esc(r1.name.trim() || "learner")}</title>
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
  h2 { margin: 32px 0 10px; font-size: 13px; letter-spacing: .06em; text-transform: uppercase;
       color: #5E6670; border-top: 1px solid #E2E5E9; padding-top: 16px; }
  .meta { margin: 0; color: #5E6670; font-size: 13px; }
  table { width: 100%; border-collapse: collapse; margin-top: 8px; font-size: 13px; }
  th { text-align: left; font-size: 11px; letter-spacing: .05em; text-transform: uppercase;
       color: #5E6670; border-bottom: 1px solid #E2E5E9; padding: 8px 10px 8px 0; font-weight: 700; }
  td { vertical-align: top; padding: 10px 10px 10px 0; border-bottom: 1px solid #EEF1F3; }
  tr.why td { padding-top: 0; border-bottom: 1px solid #EEF1F3; font-style: italic; color: #16191D; }
  .muted { color: #5E6670; font-size: 12px; font-style: normal; }
  .nowrap { white-space: nowrap; }
  .callout { margin-top: 10px; padding: 14px 16px; border: 1px solid #E2E5E9;
             border-left: 3px solid #0E7A5A; border-radius: 10px; background: #E7F2EC; }
  .summary { margin-top: 10px; padding: 14px 16px; border-radius: 10px; background: #EEF1F3; }
  .summary strong { display: block; font-size: 16px; }
  footer { margin-top: 32px; border-top: 1px solid #E2E5E9; padding-top: 14px;
           color: #5E6670; font-size: 11px; }
  @media print {
    body { background: #fff; padding: 0; }
    .sheet { border: 0; border-radius: 0; padding: 0; max-width: none; }
    @page { margin: 16mm; }
  }
</style>
</head>
<body>
<div class="sheet">
  <p class="kicker">AION Green IT · Day 10 · Route 1 · Level 1</p>
  <h1>${esc(TASK1.export.docHeading)}</h1>
  <p class="meta">${esc(r1.name.trim() || "learner")} · ${esc(date)} · Case: ${esc(TASK1.company)}</p>

  <h2>Six-category classification</h2>
  ${
    r1.reportRows.length
      ? `<table>
    <thead><tr><th>Observation</th><th>Category</th><th>Improvement lever</th><th>Fix type</th></tr></thead>
    <tbody>${rows}</tbody>
  </table>`
      : `<p class="muted">No findings classified.</p>`
  }
  ${unsortedBlock}
  ${spread ? `<p class="muted">Spread across categories: ${spread}.</p>` : ""}

  <h2>Root-cause reflection</h2>
  <p class="muted">${esc(TASK1.reflection.label)}</p>
  <div class="callout">${esc(r1.reflection) || "<span class=\"muted\">Not answered.</span>"}</div>

  <h2>Structural vs. quick-fix summary</h2>
  <div class="summary">
    <strong>${esc(summaryLine)}</strong>
    <span class="muted">${r1.quickCount} quick · ${r1.structuralCount} structural · ${
      r1.completeCount
    } of ${r1.totalHotspots} findings completed.</span>
  </div>

  <footer>
    AION Green IT — Day 10, Route 1 (Foundations). AppNexa Solutions is a fictional case for training use.
    Prepared by the learner named above.
  </footer>
</div>
</body>
</html>`;
}
