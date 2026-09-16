import { EFFECTS, ENGAGEMENT, EXPORT, SENTIMENTS, SIGNALS, areaById } from "@/lib/route1";
import { CASE } from "@/lib/routes";
import type { Route1State } from "./useRoute1";

/**
 * The route's single export: one JSON for grading and one print-ready HTML
 * report for reading, both covering the whole engagement.
 *
 * Route 1 spans curriculum levels 1 and 2 in one continuous task (no separate
 * Decide stage — see lib/route1/sections.ts), so unlike a two-part route the
 * JSON keeps one flat structure: triage (all seven), escalation (the two
 * chosen and why), and analysis (the deep dive on those two) as three
 * sibling blocks, so a grader can see the triage-level judgement separately
 * from the depth of the analysis it led to.
 */

const sentimentLabel = (id: string | null) => SENTIMENTS.find((r) => r.id === id)?.label ?? "—";
const effectLabel = (id: string | null) => EFFECTS.find((e) => e.id === id)?.label ?? "—";
const areaLabel = (id: string | null) => (id ? areaById(id as never).name : "—");

export function buildEngagementJson(r1: Route1State, filename: string): string {
  const payload = {
    meta: {
      day: CASE.day,
      route: 1,
      levels: EXPORT.filenameLevels,
      task: EXPORT.filenameTask,
      schemaVersion: EXPORT.schemaVersion,
      filename,
      name: r1.name,
      case: ENGAGEMENT.company,
      role: ENGAGEMENT.role,
      exportedAt: new Date().toISOString(),
    },

    triage: {
      rows: r1.triage.map((t) => ({
        id: t.signal.id,
        n: t.signal.n,
        title: t.signal.title,
        signalText: t.signal.text,
        tag: t.tag,
        tagExpected: t.signal.sentiment,
        evidenceIndex: t.evidence,
        evidenceText: t.evidenceText,
        holds: t.holds,
      })),
      checks: r1.triageChecks,
      allHold: r1.triageAllHold,
      clueUsed: r1.triageClue,
      reasoningRevealed: r1.triageRevealed,
      reasoningRevealedAtCheck: r1.triageRevealAt,
    },

    escalation: {
      signalIds: r1.escalated,
      justification: r1.escalateWhy,
    },

    analysis: r1.analyses.map((a) => ({
      id: a.signal.id,
      n: a.signal.n,
      title: a.signal.title,
      area: a.area,
      areaExpected: a.signal.area,
      areaCorrect: a.area === a.signal.area,
      effect: a.effect,
      effectExpected: a.signal.effect,
      effectCorrect: a.effect === a.signal.effect,
      improvementApproach: a.approach,
      checks: a.checks,
      verdict: a.verdict,
      reasoningRevealed: a.revealed,
      complete: a.complete,
    })),

    tally: {
      triaged: r1.triageCompleteCount,
      total: SIGNALS.length,
      positiveSignals: r1.triage.filter((t) => t.complete && t.tag === "positive").length,
      negativeSignals: r1.triage.filter((t) => t.complete && t.tag === "negative").length,
      escalatedCount: r1.escalated.length,
      analysedComplete: r1.analysisCompleteCount,
    },
  };
  return JSON.stringify(payload, null, 2);
}

const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

/** Standalone, print-ready HTML — no external stylesheet, prints cleanly to A4. */
export function buildEngagementHtml(r1: Route1State): string {
  const date = new Date().toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const triageRows = r1.triage
    .map(
      (t) => `<tr>
      <td><strong>${t.signal.n}. ${esc(t.signal.title)}</strong><div class="muted">${esc(t.signal.source)}</div></td>
      <td class="nowrap">${esc(sentimentLabel(t.tag))}</td>
      <td>${t.evidenceText ? `&ldquo;${esc(t.evidenceText)}&rdquo;` : '<span class="muted">not tapped</span>'}</td>
    </tr>`,
    )
    .join("");

  const escalatedTitles = r1.escalated
    .map((id) => r1.triageById(id))
    .map((t) => `${t.signal.n}. ${esc(t.signal.title)}`)
    .join(" and ");

  const analysisRows = r1.analyses
    .map(
      (a) => `<tr>
      <td><strong>${a.signal.n}. ${esc(a.signal.title)}</strong></td>
      <td>${esc(areaLabel(a.area))}</td>
      <td class="nowrap">${esc(effectLabel(a.effect))}</td>
    </tr>${
      a.approach
        ? `<tr class="why"><td colspan="3"><span class="muted">Improvement — </span>&ldquo;${esc(a.approach)}&rdquo;</td></tr>`
        : ""
    }`,
    )
    .join("");

  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>${esc(EXPORT.docHeading)} — ${esc(r1.name.trim() || "learner")}</title>
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
  .meta { margin: 0; color: #5E6670; font-size: 13px; }
  table { width: 100%; border-collapse: collapse; margin-top: 8px; font-size: 13px; }
  th { text-align: left; font-size: 11px; letter-spacing: .05em; text-transform: uppercase;
       color: #5E6670; border-bottom: 1px solid #E2E5E9; padding: 8px 10px 8px 0; font-weight: 700; }
  td { vertical-align: top; padding: 9px 10px 9px 0; border-bottom: 1px solid #EEF1F3; }
  tr.why td { padding-top: 0; border-bottom: 1px solid #EEF1F3; font-style: italic; }
  .muted { color: #5E6670; font-size: 12px; font-style: normal; }
  .nowrap { white-space: nowrap; }
  .summary { margin-top: 10px; padding: 14px 16px; border-radius: 10px; background: #EEF1F3; }
  .summary strong { display: block; font-size: 16px; }
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
  <p class="kicker">AION Green IT · Day ${CASE.day} · Route 1 · Levels 1–2</p>
  <h1>${esc(EXPORT.docHeading)}</h1>
  <p class="meta">${esc(r1.name.trim() || "learner")} · ${esc(date)} · Case: ${esc(
    ENGAGEMENT.company,
  )} · Role: ${esc(ENGAGEMENT.role)}</p>

  <h2>Triage — all seven signals</h2>
  <table>
    <thead><tr><th>Signal</th><th>Tag</th><th>Decisive evidence</th></tr></thead>
    <tbody>${triageRows}</tbody>
  </table>

  <h2>Escalated for a deeper look</h2>
  ${
    r1.escalated.length
      ? `<p>${escalatedTitles || esc("—")}</p><p class="muted">${
          r1.escalateWhy ? esc(r1.escalateWhy) : "No justification written."
        }</p>`
      : `<p class="muted">No signals escalated.</p>`
  }

  <h2>Deep-dive analysis</h2>
  ${
    r1.analyses.length
      ? `<table>
    <thead><tr><th>Signal</th><th>Area</th><th>Effect</th></tr></thead>
    <tbody>${analysisRows}</tbody>
  </table>`
      : `<p class="muted">No deep-dive analysis yet.</p>`
  }

  <h2>Split</h2>
  <div class="summary">
    <strong>${r1.triageCompleteCount} of ${r1.totalSignals} signals triaged, ${r1.analysisCompleteCount} of ${
      r1.escalated.length || 2
    } escalated signals analysed.</strong>
    <span class="muted">${r1.triage.filter((t) => t.complete && t.tag === "positive").length} positive signal(s) · ${
      r1.triage.filter((t) => t.complete && t.tag === "negative").length
    } negative signal(s) in the triage.</span>
  </div>

  <footer>
    AION Green IT — Day ${CASE.day}, Route 1 (Diagnose &amp; Decide), covering levels 1 and 2.
    ${esc(ENGAGEMENT.company)} is a fictional case for training use. Prepared by the learner named above.
  </footer>
</div>
</body>
</html>`;
}
