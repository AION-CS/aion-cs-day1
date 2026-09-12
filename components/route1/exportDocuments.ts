import {
  CATEGORIES,
  DIMENSIONS,
  ENGAGEMENT,
  EXPORT,
  HOTSPOTS,
  OPTIONS,
  STAGE1,
  categoryById,
} from "@/lib/route1";
import type { Route1State } from "./useRoute1";

/**
 * The route's single export: one JSON for grading and one print-ready HTML
 * report for reading, both covering the whole engagement.
 *
 * Route 1 spans curriculum levels 1 and 2 (CLAUDE.md #12), so the document has
 * a part per stage and the JSON keeps `partOne` and `partTwo` as separate
 * blocks. A grader reading one file can still score the diagnosis and the
 * decision independently; the learner still only ever produced one deliverable.
 */

const FIX_LABEL: Record<string, string> = {
  quick: "Quick Fix",
  structural: "Structural Fix",
};

const fixLabel = (v: string | null) => (v ? (FIX_LABEL[v] ?? v) : "—");

/** Raw structured answers plus correctness flags, for grading and QA. */
export function buildEngagementJson(r1: Route1State, filename: string): string {
  const payload = {
    meta: {
      day: 11,
      route: 1,
      levels: EXPORT.filenameLevels,
      task: EXPORT.filenameTask,
      filename,
      name: r1.name,
      case: ENGAGEMENT.company,
      role: ENGAGEMENT.role,
      exportedAt: new Date().toISOString(),
    },

    partOne: {
      label: EXPORT.partOne,
      level: 1,
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
      notSorted: HOTSPOTS.filter((h) => !r1.placements[h.id]).map((h) => ({
        id: h.id,
        title: h.title,
      })),
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
    },

    partTwo: {
      label: EXPORT.partTwo,
      level: 2,
      options: r1.optionStates.map((s) => ({
        id: s.option.id,
        name: s.option.name,
        stage: s.option.stage,
        situationalAnswer: s.situational,
        situationalText:
          s.option.situational.options.find((x) => x.id === s.situational)?.text ?? null,
        revealed: s.revealed,
        dimensions: DIMENSIONS.map((d) => ({
          key: d.key,
          name: d.name,
          predicted: s.prediction[d.key] ?? null,
          actual: s.option.profile[d.key],
          gap: s.prediction[d.key] ? s.option.profile[d.key] - s.prediction[d.key]! : null,
          higherIsWorse: !!d.inverted,
        })),
        meanAbsoluteGap: (() => {
          const gaps = DIMENSIONS.map((d) =>
            s.prediction[d.key] ? Math.abs(s.option.profile[d.key] - s.prediction[d.key]!) : null,
          ).filter((g): g is number => g !== null);
          return gaps.length
            ? Number((gaps.reduce((a, b) => a + b, 0) / gaps.length).toFixed(2))
            : null;
        })(),
      })),
      recommendation: {
        pick: r1.pick,
        option: r1.pickedOption ? r1.pickedOption.name : null,
        rationale: r1.rationale,
        feasibility: r1.feasibility,
        followUpDecisions: r1.followUp.filter(Boolean),
        risksOfRoadNotTaken: r1.risks.filter(Boolean),
      },
    },
  };
  return JSON.stringify(payload, null, 2);
}

const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

/**
 * Standalone, print-ready HTML document — no external stylesheet, so it opens
 * and prints correctly on its own. One report, two parts, in the order the
 * learner produced them.
 */
export function buildEngagementHtml(r1: Route1State): string {
  const date = new Date().toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  // ---- Part 1 -------------------------------------------------------------
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

  // ---- Part 2 -------------------------------------------------------------
  const radarRows = DIMENSIONS.map(
    (d) => `<tr>
      <td>${esc(d.name)}${d.inverted ? ' <span class="warn" title="higher is worse">&#9650;</span>' : ""}</td>
      ${OPTIONS.map(
        (o) => `<td class="num${r1.pick === o.id ? " picked" : ""}">${o.profile[d.key]}</td>`,
      ).join("")}
    </tr>`,
  ).join("");

  const bullets = (items: string[], empty: string) =>
    items.filter(Boolean).length
      ? `<ul>${items
          .filter(Boolean)
          .map((t) => `<li>${esc(t)}</li>`)
          .join("")}</ul>`
      : `<p class="muted">${esc(empty)}</p>`;

  const justification = [r1.rationale, r1.feasibility].filter(Boolean).join(" ");

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
  .part { margin: 36px 0 6px; padding: 10px 14px; border-radius: 10px; background: #16191D;
          color: #fff; font-size: 12px; letter-spacing: .08em; text-transform: uppercase; font-weight: 700; }
  h2 { margin: 24px 0 10px; font-size: 13px; letter-spacing: .06em; text-transform: uppercase;
       color: #5E6670; border-top: 1px solid #E2E5E9; padding-top: 16px; }
  .meta { margin: 0; color: #5E6670; font-size: 13px; }
  table { width: 100%; border-collapse: collapse; margin-top: 8px; font-size: 13px; }
  th { text-align: left; font-size: 11px; letter-spacing: .05em; text-transform: uppercase;
       color: #5E6670; border-bottom: 1px solid #E2E5E9; padding: 8px 10px 8px 0; font-weight: 700; }
  th.num, td.num { text-align: center; width: 56px; padding-right: 0; }
  td { vertical-align: top; padding: 10px 10px 10px 0; border-bottom: 1px solid #EEF1F3; }
  td.picked { font-weight: 700; color: #0E7A5A; background: #E7F2EC; }
  tr.why td { padding-top: 0; border-bottom: 1px solid #EEF1F3; font-style: italic; color: #16191D; }
  .warn { color: #B87514; }
  .muted { color: #5E6670; font-size: 12px; font-style: normal; }
  .nowrap { white-space: nowrap; }
  .callout { margin-top: 10px; padding: 14px 16px; border: 1px solid #E2E5E9;
             border-left: 3px solid #0E7A5A; border-radius: 10px; background: #E7F2EC; }
  .pick { margin-top: 10px; padding: 14px 16px; border: 1px solid #E2E5E9;
          border-left: 3px solid #0E7A5A; border-radius: 10px; background: #E7F2EC; }
  .pick strong { display: block; font-size: 16px; margin-bottom: 4px; }
  .summary { margin-top: 10px; padding: 14px 16px; border-radius: 10px; background: #EEF1F3; }
  .summary strong { display: block; font-size: 16px; }
  ul { margin: 8px 0 0; padding-left: 20px; }
  li { margin-bottom: 6px; }
  footer { margin-top: 32px; border-top: 1px solid #E2E5E9; padding-top: 14px;
           color: #5E6670; font-size: 11px; }
  @media print {
    body { background: #fff; padding: 0; }
    .sheet { border: 0; border-radius: 0; padding: 0; max-width: none; }
    .part { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
    @page { margin: 16mm; }
  }
</style>
</head>
<body>
<div class="sheet">
  <p class="kicker">AION Green IT · Day 11 · Route 1 · Levels 1–2</p>
  <h1>${esc(EXPORT.docHeading)}</h1>
  <p class="meta">${esc(r1.name.trim() || "learner")} · ${esc(date)} · Case: ${esc(
    ENGAGEMENT.company,
  )} · Role: ${esc(ENGAGEMENT.role)}</p>

  <p class="part">${esc(EXPORT.partOne)}</p>

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
  <p class="muted">${esc(STAGE1.reflection.label)}</p>
  <div class="callout">${esc(r1.reflection) || '<span class="muted">Not answered.</span>'}</div>

  <h2>Structural vs. quick-fix summary</h2>
  <div class="summary">
    <strong>${esc(summaryLine)}</strong>
    <span class="muted">${r1.quickCount} quick · ${r1.structuralCount} structural · ${
      r1.completeCount
    } of ${r1.totalHotspots} findings completed.</span>
  </div>

  <p class="part">${esc(EXPORT.partTwo)}</p>

  <h2>Radar summary</h2>
  <table>
    <thead>
      <tr>
        <th>Criterion</th>
        ${OPTIONS.map((o) => `<th class="num">${o.id}</th>`).join("")}
      </tr>
    </thead>
    <tbody>${radarRows}</tbody>
  </table>
  <p class="muted"><span class="warn">&#9650;</span> Higher is worse on this axis. A = ${esc(
    OPTIONS[0].shortName,
  )}, B = ${esc(OPTIONS[1].shortName)}, C = ${esc(
    OPTIONS[2].shortName,
  )}. All three are shown regardless of which was chosen.</p>

  <h2>Recommendation &amp; justification</h2>
  <div class="pick">
    <strong>${
      r1.pickedOption
        ? `Option ${esc(r1.pickedOption.id)} — ${esc(r1.pickedOption.name)}`
        : "No option committed to."
    }</strong>
    ${justification ? esc(justification) : '<span class="muted">No justification written.</span>'}
  </div>

  <h2>Follow-up decisions</h2>
  ${bullets(r1.followUp, "Not written.")}

  <h2>Risk register</h2>
  <p class="muted">What the roads not taken would have prevented.</p>
  ${bullets(r1.risks, "Not written.")}

  <footer>
    AION Green IT — Day 11, Route 1 (Diagnose &amp; Decide), covering levels 1 and 2.
    AppNexa Solutions is a fictional case for training use. Prepared by the learner named above.
  </footer>
</div>
</body>
</html>`;
}
