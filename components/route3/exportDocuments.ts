import {
  DRIVERS,
  GUIDING_DECISIONS,
  THRESHOLDS,
  TEST_DEVICES,
  RACI_DECISIONS,
  TRADE_OFFS,
  REVIEW_INDICATORS,
  BOARD_CHALLENGES,
  TASK3,
} from "@/lib/route3";
import type { useRoute3 } from "./useRoute3";
import type { ProposalData } from "./useProposalData";

type Route3State = ReturnType<typeof useRoute3>;

/** Raw answers plus model comparisons, for grading/QA. */
export function buildReportJson(r3: Route3State, data: ProposalData, filename: string): string {
  const payload = {
    meta: {
      day: 9,
      route: 3,
      level: TASK3.export.filenameLevel,
      task: TASK3.export.filenameTask,
      filename,
      name: r3.name,
      exportedAt: new Date().toISOString(),
    },
    drivers: DRIVERS.map((d) => ({
      id: d.id,
      chosen: r3.pickedDrivers.includes(d.id),
      isModel: d.isModel,
    })),
    decisions: GUIDING_DECISIONS.map((d) => ({
      id: d.id,
      letter: d.letter,
      chosen: r3.pickedDecisions.includes(d.id),
      isModel: d.isModel,
      position: r3.order[d.id] ?? null,
      modelPosition: d.modelOrder ?? null,
    })),
    resolution: r3.resolution,
    rule: THRESHOLDS.map((t) => ({
      key: t.key,
      chosen: r3.thresholds[t.key] ?? null,
      model: t.modelOption,
      matched: r3.thresholds[t.key] === t.modelOption,
    })),
    bench: TEST_DEVICES.map((d) => {
      const res = r3.outcomes[d.id];
      return { n: d.n, outcome: res?.outcome ?? null, reason: res?.reason ?? null, mark: r3.marks[d.id] ?? null };
    }),
    iterations: r3.iterations,
    exceptionPath: r3.exceptionPath,
    reasonCodes: r3.pickedCodes,
    raci: RACI_DECISIONS.map((d) => {
      const status = r3.raciStatus.find((s) => s.id === d.id);
      return {
        decision: d.id,
        accountable: status?.accountable ?? [],
        modelAccountable: d.modelAccountable,
        matched: status?.accountable.length === 1 && status.accountable[0] === d.modelAccountable,
        responsible: status?.responsible ?? [],
      };
    }),
    escalation: data.escalation,
    tradeoffs: TRADE_OFFS.map((t) => ({
      id: t.id,
      owner: r3.tradeoffOwner[t.id] ?? null,
      modelOwner: t.modelOwner,
      ownerMatched: r3.tradeoffOwner[t.id] === t.modelOwner,
      stated: r3.tradeoffDefault[t.id] ?? null,
      statedIsModel: t.options.find((o) => o.id === r3.tradeoffDefault[t.id])?.isModel ?? null,
    })),
    review: REVIEW_INDICATORS.map((i) => ({
      id: i.id,
      chosen: r3.pickedIndicators.includes(i.id),
      isModel: i.isModel,
      cadence: r3.cadence[i.id] ?? null,
    })),
    trigger: r3.trigger,
    challenges: BOARD_CHALLENGES.map((c) => ({
      id: c.id,
      response: r3.challenge[c.id] ?? null,
      responseIsModel: c.options.find((o) => o.id === r3.challenge[c.id])?.isModel ?? null,
      note: r3.challengeNote[c.id] ?? "",
    })),
    commitment: r3.commitment,
  };
  return JSON.stringify(payload, null, 2);
}

const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

/** Standalone, print-ready HTML board memo. */
export function buildReportHtml(data: ProposalData): string {
  const list = (items: string[]) => `<ul>${items.map((t) => `<li>${esc(t)}</li>`).join("")}</ul>`;

  const decisions = data.decisions.map((d) => `<li><strong>${esc(d.letter)}</strong> — ${esc(d.label)}</li>`).join("");
  const ruleRows = data.rule.map((r) => `<tr><td>${esc(r.label)}</td><td><strong>${esc(r.value)}</strong></td></tr>`).join("");
  const benchRows = data.bench
    .map((b) => `<tr><td class="num">${b.n}</td><td>${esc(b.outcome)}</td><td>${esc(b.reason)}</td><td>${esc(b.mark ?? "—")}</td></tr>`)
    .join("");
  const raciRows = data.raci
    .map(
      (r) =>
        `<tr><td>${esc(r.decision)}</td><td><strong>${esc(r.accountable ?? "—")}</strong></td><td>${esc(r.responsible.join(", ") || "—")}</td><td>${esc(r.consulted.join(", ") || "—")}</td><td>${esc(r.informed.join(", ") || "—")}</td></tr>`,
    )
    .join("");
  const tradeoffRows = data.tradeoffs
    .map((t) => `<tr><td>${esc(t.label)}</td><td>${esc(t.owner ?? "—")}</td><td>${esc(t.stated ?? "—")}</td></tr>`)
    .join("");
  const reviewRows = data.review.map((r) => `<tr><td>${esc(r.indicator)}</td><td>${esc(r.cadence ?? "—")}</td></tr>`).join("");
  const challenges = data.challenges
    .map(
      (c) =>
        `<li><strong>${esc(c.role)}</strong> — ${esc(c.response ?? "—")}${c.note ? `<br /><em>&ldquo;${esc(c.note)}&rdquo;</em>` : ""}</li>`,
    )
    .join("");

  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<title>${esc(TASK3.export.docHeading)} — ${esc(data.name)}</title>
<style>
  body { font-family: "Segoe UI", Arial, sans-serif; color: #16191D; max-width: 780px; margin: 40px auto; padding: 0 20px; line-height: 1.5; }
  h1 { font-size: 22px; margin-bottom: 4px; }
  h2 { font-size: 15px; text-transform: uppercase; letter-spacing: 0.04em; color: #5E6670; margin-top: 28px; border-bottom: 1px solid #E2E5E9; padding-bottom: 4px; }
  .meta { color: #5E6670; font-size: 13px; margin-bottom: 20px; }
  .kicker { text-transform: uppercase; letter-spacing: 0.06em; font-size: 11px; color: #5E6670; }
  table { border-collapse: collapse; width: 100%; font-size: 12.5px; margin-top: 6px; }
  th, td { border: 1px solid #E2E5E9; padding: 5px 7px; text-align: left; vertical-align: top; }
  th { background: #F5F6F7; font-size: 11.5px; text-transform: uppercase; letter-spacing: 0.03em; color: #5E6670; }
  td.num { text-align: right; }
  ul, ol { font-size: 13.5px; padding-left: 20px; }
  li { margin-bottom: 4px; }
  .quote { background: #F5F6F7; border-left: 3px solid #0E7A5A; padding: 10px 14px; font-size: 13.5px; }
  @media print { body { margin: 0; max-width: none; } }
</style>
</head>
<body>
  <p class="kicker">AION Green IT · Day 9 · Route 3 · Level 3</p>
  <h1>${esc(TASK3.export.docHeading)}</h1>
  <p class="meta">Prepared by: <strong>${esc(data.name)}</strong> &nbsp;·&nbsp; Date: <strong>${esc(data.date)}</strong> &nbsp;·&nbsp; For: <strong>${esc(data.caseReference)}</strong></p>

  <h2>1 · Strategic framing</h2>
  ${list(data.drivers) || "<p>—</p>"}

  <h2>2 · Guiding decisions, in sequence</h2>
  <ol>${decisions || "<li>—</li>"}</ol>
  <p class="quote">${esc(data.resolution || "—")}</p>

  <h2>3 · The decision rule</h2>
  <table><tbody>${ruleRows}</tbody></table>
  <p>Exception path: ${esc(data.exceptionPath || "—")}</p>
  <p>Reason codes: ${esc(data.reasonCodes.join(" · ") || "—")}</p>

  <h2>4 · Test bench results</h2>
  <p>Iterations before the rule did what was intended: <strong>${data.iterations}</strong></p>
  <table><thead><tr><th class="num">#</th><th>Outcome</th><th>Why</th><th>Intent</th></tr></thead><tbody>${benchRows}</tbody></table>

  <h2>5 · Accountability</h2>
  <table><thead><tr><th>Decision</th><th>Accountable</th><th>Responsible</th><th>Consulted</th><th>Informed</th></tr></thead><tbody>${raciRows}</tbody></table>
  <p>Projected load across these cases: ${data.escalation.technician} decided at technician level, ${data.escalation.teamLead} escalated.</p>

  <h2>6 · Trade-off defaults</h2>
  <table><thead><tr><th>Trade-off</th><th>Accountable</th><th>Stated default</th></tr></thead><tbody>${tradeoffRows}</tbody></table>

  <h2>7 · Review mechanism</h2>
  <table><thead><tr><th>Indicator</th><th>Cadence</th></tr></thead><tbody>${reviewRows}</tbody></table>
  <p class="quote">Trigger: ${esc(data.trigger || "—")}</p>

  <h2>8 · Board challenge responses</h2>
  <ul>${challenges || "<li>—</li>"}</ul>

  <h2>9 · The uncertainty commitment</h2>
  <p class="quote">${esc(data.commitment || "—")}</p>
</body>
</html>`;
}
