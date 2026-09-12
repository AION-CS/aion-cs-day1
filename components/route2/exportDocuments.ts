import {
  CODEVISTA,
  QUADRANT_CARDS,
  RACI_LETTERS,
  RACI_ROLES,
  RACI_SUBJECT,
  TASK2,
  quadrantById,
} from "@/lib/route2";
import type { Route2State } from "./useRoute2";

const roleName = (id: string) => RACI_ROLES.find((r) => r.id === id)?.name ?? id;

/** Raw structured answers plus correctness flags, for grading and QA. */
export function buildMemoJson(r2: Route2State, filename: string): string {
  const payload = {
    meta: {
      day: 11,
      route: 2,
      levels: TASK2.export.filenameLevels,
      task: TASK2.export.filenameTask,
      filename,
      name: r2.name,
      case: CODEVISTA.company,
      role: CODEVISTA.role,
      exportedAt: new Date().toISOString(),
    },
    guidingDecisions: {
      ranking: r2.rankedDecisions.map((d, i) => ({ rank: i + 1, id: d.id, text: d.text })),
      topPickRationale: r2.rankRationale,
    },
    tradeOffMap: QUADRANT_CARDS.map((c) => {
      const placed = r2.placements[c.id];
      const q = placed ? quadrantById(placed) : null;
      const ref = quadrantById(c.correct);
      return {
        id: c.id,
        measure: c.text,
        placed: placed
          ? { quadrant: placed, momentumCost: q!.momentum, structuralImpact: q!.structural }
          : null,
        reference: {
          quadrant: c.correct,
          momentumCost: ref.momentum,
          structuralImpact: ref.structural,
        },
        matched: placed === c.correct,
      };
    }),
    governance: {
      subject: RACI_SUBJECT,
      assignments: Object.fromEntries(
        RACI_LETTERS.map((l) => [l.name, r2.raci[l.id].map(roleName)]),
      ),
      accountableCount: r2.accountableCount,
      // The one rule the exercise actually enforces.
      oneAccountableRuleSatisfied: r2.accountableValid,
    },
    decisionUnderUncertainty: {
      decideNow: r2.decideNow,
      costOfWaiting: r2.decideWhy,
    },
    summary: {
      quadrantScore: QUADRANT_CARDS.filter((c) => r2.placements[c.id] === c.correct).length,
      quadrantTotal: QUADRANT_CARDS.length,
      placed: r2.placedCards.length,
    },
  };
  return JSON.stringify(payload, null, 2);
}

const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

/** Standalone, print-ready HTML memo — no external stylesheet. */
export function buildMemoHtml(r2: Route2State): string {
  const date = new Date().toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const ranked = r2.rankedDecisions.length
    ? `<ol>${r2.rankedDecisions
        .map(
          (d, i) =>
            `<li><strong>${esc(d.text)}</strong>${
              i === 0 && r2.rankRationale
                ? `<div class="why">&ldquo;${esc(r2.rankRationale)}&rdquo;</div>`
                : ""
            }</li>`,
        )
        .join("")}</ol>`
    : `<p class="muted">Nothing ranked.</p>`;

  const mapRows = r2.placedCards
    .map((c) => {
      const q = quadrantById(r2.placements[c.id]!);
      return `<tr><td>${esc(c.text)}</td><td class="num">${esc(q.momentum)}</td><td class="num">${esc(
        q.structural,
      )}</td></tr>`;
    })
    .join("");

  const raciRows = RACI_LETTERS.map((l) => {
    const roles = r2.raci[l.id];
    const bad = l.id === "A" && roles.length !== 1;
    return `<tr><td class="${bad ? "bad" : ""}"><strong>${esc(l.name)}</strong></td><td>${
      roles.length ? esc(roles.map(roleName).join(", ")) : '<span class="muted">— none assigned</span>'
    }${bad && roles.length > 1 ? ' <span class="bad">(RACI allows exactly one)</span>' : ""}</td></tr>`;
  }).join("");

  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>${esc(TASK2.export.docHeading)} — ${esc(r2.name.trim() || "learner")}</title>
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
  th.num, td.num { text-align: center; width: 96px; padding-right: 0; }
  td { vertical-align: top; padding: 8px 10px 8px 0; border-bottom: 1px solid #EEF1F3; }
  ol { margin: 8px 0 0; padding-left: 20px; }
  li { margin-bottom: 8px; }
  .why { margin-top: 4px; font-style: italic; color: #16191D; }
  .muted { color: #5E6670; font-size: 12px; }
  .bad { color: #B23B3B; }
  .callout { margin-top: 10px; padding: 14px 16px; border: 1px solid #E2E5E9;
             border-left: 3px solid #0E7A5A; border-radius: 10px; background: #E7F2EC; }
  .callout p { margin: 0 0 8px; }
  .callout p:last-child { margin: 0; font-style: italic; color: #5E6670; }
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
  <p class="kicker">AION Green IT · Day 11 · Route 2 · Level 3</p>
  <h1>${esc(TASK2.export.docHeading)}</h1>
  <p class="meta">${esc(r2.name.trim() || "learner")} · ${esc(date)} · Case: ${esc(CODEVISTA.company)}</p>
  <p class="meta">Role: ${esc(CODEVISTA.role)} / CTO</p>

  <h2>Guiding decisions (ranked)</h2>
  ${ranked}

  <h2>Trade-off map summary</h2>
  ${
    mapRows
      ? `<table>
    <thead><tr><th>Measure</th><th class="num">Momentum cost</th><th class="num">Structural impact</th></tr></thead>
    <tbody>${mapRows}</tbody>
  </table>`
      : `<p class="muted">Nothing placed.</p>`
  }
  ${
    r2.unplacedCards.length
      ? `<p class="muted">Not placed: ${r2.unplacedCards.map((c) => esc(c.short)).join(", ")}.</p>`
      : ""
  }

  <h2>Governance model (RACI)</h2>
  <p class="muted">Subject: ${esc(RACI_SUBJECT)}</p>
  <table><tbody>${raciRows}</tbody></table>

  <h2>Decision under uncertainty</h2>
  <div class="callout">
    <p>${esc(r2.decideNow) || '<span class="muted">No decision named.</span>'}</p>
    <p>${esc(r2.decideWhy) || '<span class="muted">Cost of waiting not stated.</span>'}</p>
  </div>

  <footer>
    AION Green IT — Day 11, Route 2 (Management Decision). CodeVista Digital Platforms is a fictional case
    for training use. Prepared by the learner named above.
  </footer>
</div>
</body>
</html>`;
}
