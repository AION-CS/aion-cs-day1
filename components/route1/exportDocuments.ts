import { FINDINGS, CATEGORIES, ZONES, TASK1 } from "@/lib/route1";
import type { useRoute1 } from "./useRoute1";
import type { WorkplaceReportData } from "./useWorkplaceReportData";

type Route1State = ReturnType<typeof useRoute1>;

const letterOf = (zoneId: string) => ZONES.find((z) => z.id === zoneId)?.letter ?? "?";

/** Raw structured answers + correctness flags, for grading/QA — never shown to the learner during the exercise. */
export function buildReportJson(r1: Route1State, report: WorkplaceReportData, filename: string): string {
  const payload = {
    meta: {
      day: 9,
      route: 1,
      level: TASK1.export.filenameLevel,
      task: TASK1.export.filenameTask,
      filename,
      name: r1.name,
      exportedAt: new Date().toISOString(),
    },
    walkthrough: ZONES.map((z) => ({ zone: z.letter, label: z.label, investigated: r1.zonesSeen.includes(z.id) })),
    findings: FINDINGS.map((f) => {
      const category = r1.category[f.id] ?? null;
      const driver = r1.driver[f.id] ?? null;
      const horizon = r1.horizon[f.id] ?? null;
      return {
        id: f.id,
        zone: letterOf(f.zoneId),
        text: f.text,
        category,
        correctCategory: f.correctCategory,
        categoryMatched: category === f.correctCategory,
        driver,
        correctDriver: f.correctDriver,
        driverMatched: driver === f.correctDriver,
        horizon,
        correctHorizon: f.correctHorizon,
        horizonMatched: horizon === f.correctHorizon,
      };
    }),
    firstMoves: report.actions,
    pattern: report.closingLine,
  };
  return JSON.stringify(payload, null, 2);
}

const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

/** Standalone, print-ready HTML document — no external stylesheet, so it opens correctly on its own. */
export function buildReportHtml(report: WorkplaceReportData): string {
  const list = (items: string[]) => `<ul>${items.map((t) => `<li>${esc(t)}</li>`).join("")}</ul>`;

  const categoryBlocks = report.byCategory
    .map((g) => `<h3>${esc(g.category)} (${g.items.length})</h3>${list(g.items)}`)
    .join("");

  const actions = report.actions
    .map(
      (a) =>
        `<li><strong>${esc(a.letter)} · ${esc(a.short)}</strong><br /><span class="muted">${esc(
          a.category ?? "—",
        )} · ${esc(a.direction ?? "direction not chosen")}</span>${
          a.justification.trim() ? `<br />&ldquo;${esc(a.justification)}&rdquo;` : ""
        }</li>`,
    )
    .join("");

  const unsorted = CATEGORIES.length - report.byCategory.length;

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
  .muted { color: #5E6670; font-size: 12.5px; }
  ul { margin-top: 4px; padding-left: 20px; font-size: 13.5px; }
  li { margin-bottom: 5px; }
  .kicker { text-transform: uppercase; letter-spacing: 0.06em; font-size: 11px; color: #5E6670; }
  .pattern { background: #F5F6F7; border-left: 3px solid #0E7A5A; padding: 10px 14px; font-size: 13.5px; }
  @media print { body { margin: 0; max-width: none; } }
</style>
</head>
<body>
  <p class="kicker">AION Green IT · Day 9 · Route 1 · Level 1</p>
  <h1>${esc(TASK1.export.docHeading)}</h1>
  <p class="meta">Analyst: <strong>${esc(report.name)}</strong> &nbsp;·&nbsp; Date: <strong>${esc(
    report.date,
  )}</strong> &nbsp;·&nbsp; Subject: <strong>${esc(report.caseReference)}</strong></p>

  <h2>Findings by area</h2>
  ${categoryBlocks || "<p>—</p>"}
  ${unsorted > 0 ? `<p class="muted">${unsorted} of ${CATEGORIES.length} areas have no finding assigned.</p>` : ""}

  <h2>Diagnosis — what is driving each finding</h2>
  <h3>Management &amp; structural (${report.driverSplit.structural.length})</h3>
  ${list(report.driverSplit.structural) || "<p>—</p>"}
  <h3>Individual behaviour (${report.driverSplit.individual.length})</h3>
  ${list(report.driverSplit.individual) || "<p>—</p>"}

  <h2>Diagnosis — what it takes to fix</h2>
  <h3>Short-term fix (${report.horizonSplit.shortTerm.length})</h3>
  ${list(report.horizonSplit.shortTerm) || "<p>—</p>"}
  <h3>Structural change needed (${report.horizonSplit.structuralChange.length})</h3>
  ${list(report.horizonSplit.structuralChange) || "<p>—</p>"}

  <h2>First two moves</h2>
  <ul>${actions || "<li>—</li>"}</ul>

  <h2>Pattern</h2>
  <p class="pattern">${esc(report.closingLine)}</p>
</body>
</html>`;
}
