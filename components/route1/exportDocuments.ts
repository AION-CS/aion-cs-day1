import {
  CRITERIA,
  ENGAGEMENT,
  EXPORT,
  HORIZONS,
  READINGS,
  ROOT_CAUSES,
  optionById,
  zoneById,
  type OptionId,
} from "@/lib/route1";
import { CASE } from "@/lib/routes";
import type { Route1State } from "./useRoute1";
import { OPTION_HEX } from "./optionStyle";

/**
 * The route's single export: one JSON for grading and one print-ready HTML
 * report for reading, both covering the whole engagement.
 *
 * Route 1 spans curriculum levels 1 and 2, so the document has a banner per
 * part and the JSON keeps `partOne` and `partTwo` as separate top-level
 * blocks. A grader reading one file can still score the diagnosis and the
 * decision independently; the learner still produced one deliverable.
 *
 * §8.7/§10.5: export is never disabled. `buildEngagementJson`/`buildEngagementHtml`
 * take an `incomplete` flag; when true, both documents carry the
 * `STATUS: INCOMPLETE DRAFT` stamp. A mentor-sample export is stamped too.
 */

const readingLabel = (id: string | null) => READINGS.find((r) => r.id === id)?.label ?? "—";
const rootLabel = (id: string | null) => ROOT_CAUSES.find((r) => r.id === id)?.label ?? "—";
const horizonLabel = (id: string | null) => HORIZONS.find((h) => h.id === id)?.label ?? "—";
const zoneLabel = (id: string | null) => (id ? zoneById(id as never).name : "— not assigned, still in Intake");

/** Describes the learner's own distribution factually — never evaluates it (§8.7.4). */
function patternNote(r1: Route1State): string {
  const t = r1.tally;
  if (t.routed === 0) return "No signals have been routed yet.";
  const parts: string[] = [
    `${t.routed} of ${t.total} signals routed across ${t.zonesUsed} of 7 zones.`,
    `${t.governance} of ${t.routed} attributed to a missing governance or architecture decision, ${t.technology} to technology use.`,
    `${t.short} tagged visible short-term, ${t.structural} tagged structurally effective.`,
    `${t.potential} read as sustainability potential, ${t.risk} as risk, ${t.both} as both.`,
  ];
  return parts.join(" ");
}

export function buildEngagementJson(r1: Route1State, filename: string, incomplete: boolean): string {
  const payload = {
    meta: {
      day: CASE.day,
      route: 1,
      levels: EXPORT.filenameLevels,
      task: EXPORT.filenameTask,
      schemaVersion: EXPORT.schemaVersion,
      filename,
      status: incomplete ? "incomplete-draft" : "complete",
      mentorSample: r1.mentorSample,
      name: r1.name,
      case: ENGAGEMENT.company,
      role: ENGAGEMENT.role,
      exportedAt: new Date().toISOString(),
    },

    partOne: {
      label: EXPORT.partOne,
      level: 1,
      signals: r1.signals.map((s) => ({
        id: s.signal.id,
        n: s.signal.n,
        title: s.signal.title,
        signalText: s.signal.text,
        reading: s.reading,
        bothJustification: s.bothWhy || null,
        zone: s.zone,
        zoneName: s.zone ? zoneById(s.zone).name : null,
        withinDefensibleSet: s.zone ? s.signal.acceptableZones.includes(s.zone) : null,
        improvementApproach: s.approach,
        rootCause: s.rootCause,
        horizon: s.horizon,
        complete: s.complete,
      })),
      distribution: {
        routed: r1.tally.routed,
        total: r1.tally.total,
        zonesUsed: r1.tally.zonesUsed,
        technologyUse: r1.tally.technology,
        missingGovernance: r1.tally.governance,
        visibleShortTerm: r1.tally.short,
        structurallyEffective: r1.tally.structural,
        readPotential: r1.tally.potential,
        readRisk: r1.tally.risk,
        readBoth: r1.tally.both,
      },
      patternNote: patternNote(r1),
    },

    partTwo: {
      label: EXPORT.partTwo,
      level: 2,
      matrix: CRITERIA.map((c) => ({
        criterion: c.id,
        name: c.name,
        ranks: { A: r1.ranks[c.id].A, B: r1.ranks[c.id].B, C: r1.ranks[c.id].C },
      })),
      rankSums: r1.rankSums,
      chosen: r1.chosen,
      chosenOption: r1.chosen ? optionById(r1.chosen).name : null,
      justification: r1.justification,
      followUpDecisions: r1.followUps.filter(Boolean),
      riskTarget: r1.riskTarget,
      risks: r1.risks.filter(Boolean),
    },
  };
  return JSON.stringify(payload, null, 2);
}

const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
const nl2br = (s: string) => esc(s).replace(/\n/g, "<br/>");

/** Inline SVG of the radar (§10.5): three profiles from the learner's own ranks, standalone markup. */
function radarSvg(r1: Route1State): string {
  const cx = 220;
  const cy = 190;
  const rad = 130;
  const n = CRITERIA.length;
  const point = (i: number, v: number) => {
    const a = -Math.PI / 2 + (i * 2 * Math.PI) / n;
    const r = (v / 3) * rad;
    return [cx + r * Math.cos(a), cy + r * Math.sin(a)] as const;
  };
  const rings = [1, 2, 3]
    .map((k) => {
      const pts = CRITERIA.map((_, i) => point(i, k).join(",")).join(" ");
      return `<polygon points="${pts}" fill="none" stroke="#E2E5E9" stroke-width="1"/>`;
    })
    .join("");
  const spokes = CRITERIA.map((_, i) => {
    const [x, y] = point(i, 3);
    return `<line x1="${cx}" y1="${cy}" x2="${x.toFixed(1)}" y2="${y.toFixed(1)}" stroke="#E2E5E9" stroke-width="1"/>`;
  }).join("");
  const dashFor: Record<OptionId, string> = { A: "", B: "7,4", C: "2,4" };
  const polys = (["A", "B", "C"] as OptionId[])
    .map((o) => {
      const pts = CRITERIA.map((c, i) => point(i, r1.ranks[c.id][o] ? 4 - r1.ranks[c.id][o]! : 0).join(",")).join(" ");
      const dash = dashFor[o];
      return `<polygon points="${pts}" fill="${OPTION_HEX[o]}" fill-opacity="0.08" stroke="${OPTION_HEX[o]}" stroke-width="2.4"${
        dash ? ` stroke-dasharray="${dash}"` : ""
      }/>`;
    })
    .join("");
  const labels = CRITERIA.map((c, i) => {
    const [x, y] = point(i, 3.55);
    const anchor = Math.cos(-Math.PI / 2 + (i * 2 * Math.PI) / n) > 0.15 ? "start" : Math.cos(-Math.PI / 2 + (i * 2 * Math.PI) / n) < -0.15 ? "end" : "middle";
    return `<text x="${x.toFixed(1)}" y="${y.toFixed(1)}" text-anchor="${anchor}" font-size="11" fill="#5E6670">${esc(c.axis)}</text>`;
  }).join("");

  return `<svg viewBox="0 0 440 380" role="img" aria-label="Rank matrix radar" style="max-width:420px;width:100%;height:auto">${rings}${spokes}${polys}${labels}</svg>`;
}

/** Standalone, print-ready HTML — no external stylesheet, prints cleanly to A4. */
export function buildEngagementHtml(r1: Route1State, incomplete: boolean): string {
  const date = new Date().toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
  const stampLine = [incomplete ? EXPORT.incompleteStamp : null, r1.mentorSample ? EXPORT.mentorStamp : null]
    .filter(Boolean)
    .join(" · ");

  const signalRows = r1.signals
    .map(
      (s) => `<tr>
      <td><strong>${s.signal.n}. ${esc(s.signal.title)}</strong></td>
      <td>${esc(readingLabel(s.reading))}${s.bothWhy ? `<div class="muted">${esc(s.bothWhy)}</div>` : ""}</td>
      <td>${esc(zoneLabel(s.zone))}</td>
      <td>${esc(s.approach) || '<span class="muted">not written</span>'}</td>
      <td class="nowrap">${esc(rootLabel(s.rootCause))}</td>
      <td class="nowrap">${esc(horizonLabel(s.horizon))}</td>
    </tr>`,
    )
    .join("");

  const matrixRows = CRITERIA.map((c) => {
    const r = r1.ranks[c.id];
    return `<tr><td>${esc(c.name)}</td><td class="num">${r.A ?? "—"}</td><td class="num">${r.B ?? "—"}</td><td class="num">${r.C ?? "—"}</td></tr>`;
  }).join("");

  const bullets = (items: string[], empty: string) =>
    items.filter(Boolean).length
      ? `<ul>${items.filter(Boolean).map((t) => `<li>${nl2br(t)}</li>`).join("")}</ul>`
      : `<p class="muted">${esc(empty)}</p>`;

  const chosenOption = r1.chosen ? optionById(r1.chosen) : null;

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
  .sheet { max-width: 900px; margin: 0 auto; background: #fff; border: 1px solid #E2E5E9;
           border-radius: 16px; padding: 40px; }
  .kicker { margin: 0 0 4px; font-size: 11px; letter-spacing: .06em; text-transform: uppercase;
            font-weight: 700; color: #0E7A5A; }
  h1 { margin: 0 0 4px; font-size: 27px; line-height: 1.2; }
  .stamp { margin: 8px 0 0; display: inline-block; padding: 4px 10px; border-radius: 999px;
           background: #B87514; color: #fff; font-size: 11px; font-weight: 700; letter-spacing: .04em; text-transform: uppercase; }
  .part { margin: 36px 0 6px; padding: 10px 14px; border-radius: 10px; background: #16191D;
          color: #fff; font-size: 12px; letter-spacing: .08em; text-transform: uppercase; font-weight: 700; }
  h2 { margin: 24px 0 10px; font-size: 13px; letter-spacing: .06em; text-transform: uppercase;
       color: #5E6670; border-top: 1px solid #E2E5E9; padding-top: 16px; }
  h3 { margin: 20px 0 6px; font-size: 15px; }
  .meta { margin: 0; color: #5E6670; font-size: 13px; }
  table { width: 100%; border-collapse: collapse; margin-top: 8px; font-size: 13px; }
  th { text-align: left; font-size: 11px; letter-spacing: .05em; text-transform: uppercase;
       color: #5E6670; border-bottom: 1px solid #E2E5E9; padding: 8px 10px 8px 0; font-weight: 700; }
  th.num, td.num { text-align: center; width: 60px; padding-right: 0; }
  td { vertical-align: top; padding: 9px 10px 9px 0; border-bottom: 1px solid #EEF1F3; }
  .muted { color: #5E6670; font-size: 12px; font-style: normal; }
  .nowrap { white-space: nowrap; }
  .pick { margin-top: 10px; padding: 14px 16px; border: 1px solid #E2E5E9;
          border-left: 3px solid #0E7A5A; border-radius: 10px; background: #E7F2EC; }
  .pick strong { display: block; font-size: 16px; margin-bottom: 4px; }
  .summary { margin-top: 10px; padding: 14px 16px; border-radius: 10px; background: #EEF1F3; }
  .summary strong { display: block; font-size: 16px; }
  .legend { display: flex; gap: 14px; flex-wrap: wrap; font-size: 12px; color: #5E6670; margin-top: 6px; }
  .legend span.sw { display: inline-block; width: 18px; height: 3px; margin-right: 5px; vertical-align: middle; }
  ul { margin: 8px 0 0; padding-left: 20px; }
  li { margin-bottom: 6px; }
  footer { margin-top: 32px; border-top: 1px solid #E2E5E9; padding-top: 14px;
           color: #5E6670; font-size: 11px; }
  @media (max-width: 560px) {
    body { padding: 12px 8px; }
    .sheet { padding: 18px 14px; border-radius: 12px; }
  }
  @media print {
    body { background: #fff; padding: 0; }
    .sheet { border: 0; border-radius: 0; padding: 0; max-width: none; }
    .part, .stamp { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
    h3, table { break-inside: avoid; }
    @page { margin: 16mm; }
  }
</style>
</head>
<body>
<div class="sheet">
  <p class="kicker">AION Green IT · ${esc(CASE.module)} · Route 1 · Levels 1–2</p>
  <h1>${esc(EXPORT.docHeading)}</h1>
  <p class="meta">${esc(r1.name.trim() || "learner")} · ${esc(date)} · Client: ${esc(ENGAGEMENT.company)} · Role: ${esc(ENGAGEMENT.role)}</p>
  ${stampLine ? `<span class="stamp">${esc(stampLine)}</span>` : ""}

  <p class="part">${esc(EXPORT.partOne)}</p>

  <h2>Signals</h2>
  <table>
    <thead><tr><th>Signal</th><th>Reading</th><th>Area</th><th>Improvement approach</th><th>Root cause</th><th>Horizon</th></tr></thead>
    <tbody>${signalRows}</tbody>
  </table>

  <h2>Distribution summary</h2>
  <div class="summary">
    <strong>${r1.tally.routed} of ${r1.tally.total} signals routed across ${r1.tally.zonesUsed} of 7 zones.</strong>
    <span class="muted">${r1.tally.technology} technology use · ${r1.tally.governance} missing governance or architecture decision — ${r1.tally.short} visible short-term · ${r1.tally.structural} structurally effective.</span>
  </div>

  <h2>Pattern note</h2>
  <p>${esc(patternNote(r1))}</p>

  <p class="part">${esc(EXPORT.partTwo)}</p>

  <h2>7 × 3 rank matrix</h2>
  <table>
    <thead><tr><th>Criterion</th><th class="num">A</th><th class="num">B</th><th class="num">C</th></tr></thead>
    <tbody>${matrixRows}</tbody>
  </table>
  <p class="muted">Rank 1 = strongest on that criterion. Rank sums — A: ${r1.rankSums.A}, B: ${r1.rankSums.B}, C: ${r1.rankSums.C} (a summary of judgement, not a score of correctness).</p>

  <h2>Ranking as a radar</h2>
  ${radarSvg(r1)}
  <div class="legend">
    <span><span class="sw" style="background:${OPTION_HEX.A}"></span>Option A</span>
    <span><span class="sw" style="background:${OPTION_HEX.B};border-bottom:1px dashed ${OPTION_HEX.B}"></span>Option B</span>
    <span><span class="sw" style="background:${OPTION_HEX.C};border-bottom:1px dotted ${OPTION_HEX.C}"></span>Option C</span>
  </div>

  <h2>Prioritised option</h2>
  <div class="pick">
    <strong>${chosenOption ? `Option ${esc(chosenOption.id)} — ${esc(chosenOption.short)}` : "No option chosen."}</strong>
    ${r1.justification ? nl2br(r1.justification) : '<span class="muted">No justification written.</span>'}
  </div>

  <h2>Follow-up decisions this prioritisation forces</h2>
  ${bullets(r1.followUps, "Not written.")}

  <h2>Risks of the short-term-attractive option${r1.riskTarget ? ` — Option ${esc(r1.riskTarget.option)}` : ""}</h2>
  ${bullets(r1.risks, "Not written.")}

  <footer>
    AION Green IT — ${esc(CASE.module)}, Route 1 (Diagnose &amp; Decide), covering levels 1 and 2.
    ${esc(ENGAGEMENT.company)} is a fictional case for training use. Prepared by the learner named above.
  </footer>
</div>
</body>
</html>`;
}
