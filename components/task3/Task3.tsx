"use client";

import { useState } from "react";
import clsx from "clsx";
import { BIN_LABEL } from "@/data/kesslerDossier";
import { CAP, G_IDS, POOL, computeBoard } from "@/data/leverData";
import { AnswerBlock } from "@/components/ui/AnswerBlock";
import { ExportBar } from "@/components/ui/ExportBar";
import { Field } from "@/components/ui/Field";
import { MaterialRefs } from "@/components/ui/MaterialRefs";
import { MissingList } from "@/components/ui/MissingList";
import { AllocationBoard } from "@/components/task3/AllocationBoard";
import { MemoSide, MemoStrip } from "@/components/task3/MemoPanel";
import { RaciGrid } from "@/components/task3/RaciGrid";
import { memoBody } from "@/lib/exportDoc";
import { scrollToAndFlash } from "@/lib/flash";
import {
  G_META,
  IDS3,
  allocationMissing,
  execChips,
  flagsForG,
  govRequired,
  l3Missing,
  notFundingCites,
  raciMissing,
} from "@/lib/l3";
import type { ExecChips } from "@/lib/l3";
import { formatEuro } from "@/lib/parseAmount";
import { exportName } from "@/lib/slug";
import { useJumpTo } from "@/lib/useJumpTo";
import { RECOMMENDATION_LABEL } from "@/store/selectors";
import { usePersisted } from "@/store/usePersisted";
import { useStore } from "@/store/useStore";
import { Gloss } from "@/lib/glossify";

function Chip({ lit, children }: { lit: boolean; children: React.ReactNode }) {
  return (
    <span
      className={clsx(
        "rounded-full border px-2.5 py-0.5 text-caption font-semibold",
        lit ? "border-signal/50 bg-signalSoft text-signal" : "border-dashed border-ash/60 bg-paper text-ash",
      )}
    >
      <span aria-hidden className="mr-1">{lit ? "●" : "○"}</span>
      {children}
      <span className="sr-only">{lit ? " — found" : " — not found yet"}</span>
    </span>
  );
}

/** The premise: what Routes 1 and 2 filed, quoted back — never re-asked, never a gate. */
function Premise() {
  const jump = useJumpTo();
  const l1 = useStore((s) => s.l1);
  const l2 = useStore((s) => s.l2);
  const v = l1.verdict;
  const rec = l2.recommendation;
  const cites = [v.cite1, v.cite2].filter(Boolean);
  return (
    <div className="card space-y-3 border-signal/40 bg-signalSoft p-4 md:p-5">
      <p className="smallcaps text-signal">Premise · from Routes 1 and 2</p>
      <div className="grid gap-3 md:grid-cols-2">
        <div className="space-y-1 text-body">
          <p className="font-semibold">Task 1 verdict</p>
          {v.filedAt ? (
            <>
              <p>
                You named <strong>{v.category ? BIN_LABEL[v.category] : "—"}</strong>, citing <strong>{cites.join(" and ")}</strong>.
              </p>
              <blockquote className="border-l-4 border-gold bg-paper px-3 py-2 text-caption italic">{v.sentence.trim()}</blockquote>
            </>
          ) : (
            <p className="text-caption">
              Not filed yet.{" "}
              <button type="button" onClick={() => jump("file-note", "/route-1/")} className="font-semibold underline decoration-dotted underline-offset-2">
                Go to Route 1
              </button>{" "}
              (a suggestion, not a gate).
            </p>
          )}
        </div>
        <div className="space-y-1 text-body">
          <p className="font-semibold">Task 2 recommendation</p>
          {rec ? (
            <p>
              You recommended <strong>{RECOMMENDATION_LABEL[rec]}</strong>
              {l2.fillins.F4.trim() && <>, with a three-year cash gap (F4) of <strong>{l2.fillins.F4.trim()}</strong></>}
              {l2.fillins.F5.trim() && <> and an expected-loss reduction (F5) of <strong>{l2.fillins.F5.trim()}</strong></>}.
            </p>
          ) : (
            <p className="text-caption">
              Not filed yet.{" "}
              <button type="button" onClick={() => jump("block-2-5", "/route-2/")} className="font-semibold underline decoration-dotted underline-offset-2">
                Go to Route 2
              </button>{" "}
              (a suggestion, not a gate).
            </p>
          )}
        </div>
      </div>
      <div className="rounded-lg border border-line bg-paper p-3 text-caption">
        <p className="smallcaps mb-1">Continuity note</p>
        <p>
          In Task 2, “Apply to all TechSolutions customers” stayed locked because Kessler is one customer (n = 1) and cannot license a
          company-wide rule. Task 3 does not lift that lock by generalising Kessler&apos;s numbers. It asks a different, legitimate question:
          TechSolutions&apos; one-off rate is a portfolio fact (70%, from Materi A1), and a portfolio problem gets a portfolio program, funded and
          governed on its own evidence, not on Kessler&apos;s file.
        </p>
      </div>
    </div>
  );
}

/** Task 3 · Level 3 · the Decision Memo: a constraint check plus a rubric, built as a split-screen live report. */
export function Task3() {
  const snapshot = usePersisted();
  const r3 = snapshot.route3;
  const board = computeBoard(r3.levers);

  const setG = useStore((s) => s.setG);
  const checkG = useStore((s) => s.checkG);
  const showClue = useStore((s) => s.showL3Clue);
  const fileAlloc = useStore((s) => s.fileAllocation);
  const fileRaci = useStore((s) => s.fileRaci);
  const setRisk = useStore((s) => s.setRisk);
  const setGov = useStore((s) => s.setGov);
  const setNotFunding = useStore((s) => s.setNotFunding);
  const setExec = useStore((s) => s.setExec);

  const [gCheck, setGCheck] = useState<{ flagged: number; empty: number } | null>(null);
  const [allocTried, setAllocTried] = useState(false);
  const [raciTried, setRaciTried] = useState(false);

  const missing = l3Missing(snapshot);
  const allocMissing = allocationMissing(r3, board);
  const raciIssues = raciMissing(r3);
  const chips: ExecChips = execChips(r3.exec, r3);
  const nfCites = r3.notFunding.trim().length > 0 && notFundingCites(r3.notFunding, r3);
  const fname = exportName(snapshot.participant.name, "l3-memo");
  const required = govRequired(r3);

  const doGCheck = () => {
    const flags = flagsForG(r3);
    checkG(flags);
    setGCheck({ flagged: flags.length, empty: G_IDS.filter((g) => !r3.fillins[g].trim()).length });
  };
  const doFileAlloc = () => {
    if (allocMissing.length > 0) {
      setAllocTried(true);
      scrollToAndFlash(allocMissing[0].id);
      return;
    }
    setAllocTried(false);
    fileAlloc();
  };
  const doFileRaci = () => {
    if (raciIssues.length > 0) {
      setRaciTried(true);
      scrollToAndFlash(IDS3.raci);
      return;
    }
    setRaciTried(false);
    fileRaci();
  };

  return (
    <section id="task-3" className="space-y-5 pb-14 lg:pb-0">
      <header className="space-y-1">
        <p className="smallcaps text-accent">Task 3 · Level 3 · 20 min</p>
        <h2 className="text-h1">Task 3 · Decision Memo · Customer Retention Investment Program</h2>
        <p className="text-body italic text-ash">Level 3 gives you a budget that cannot fund everything it should.</p>
      </header>

      <Premise />

      <div className="card space-y-2 p-4 md:p-5">
        <div className="flex flex-wrap items-center gap-2">
          <h3>The situation</h3>
          <span className="pill border-line bg-mist text-ash">Case assumption</span>
        </div>
        <p className="text-body"><Gloss>
          TechSolutions GmbH serves roughly 60 active customers. At the 70% one-off rate established in Materi A1, <strong>{POOL} are one-off</strong>:
          delivered once, with no standing account relationship. Competitive pressure is rising (NordByte IT&apos;s win at Kessler is one visible
          instance of a pattern, not proof of it). The Managing Director has approved a <strong>{formatEuro(CAP)}, six-month pilot program</strong> to
          raise retention across this one-off segment: enough to fund a real pilot, not enough to fund everything the program could use.
        </Gloss></p>
        <p className="text-caption text-ash">
          You write this memo as <strong>Head of Sales / Chief Customer Officer</strong>. Addressee: the <strong>Geschäftsführer</strong> (managing director).
          The memo assembles beside the questions, in reading order, with the executive summary first even though you write it last.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_25rem]">
        <div className="min-w-0 space-y-5">
          {/* Block 3.1 */}
          <AnswerBlock
            id="block-3-1"
            title="Block 3.1 · Allocation board"
            kind="OBJECTIVE"
            findIt="Route 3 → Task 3 → “Allocation board”. Answer in the fields directly below the board."
          >
            <MaterialRefs refs={["C3", "C4", "C1"]} />
            <AllocationBoard />

            <div className="grid gap-4 md:grid-cols-2">
              {G_IDS.map((g) => (
                <Field
                  key={g}
                  id={IDS3.g(g)}
                  htmlFor={`in-${g}`}
                  label={`${g} · ${G_META[g].label}`}
                  help={G_META[g].help}
                  flagged={r3.flagged.includes(g)}
                  clue={G_META[g].clue}
                  clueShown={!!r3.clueShown[g]}
                  onShowClue={() => showClue(g)}
                >
                  <input
                    id={`in-${g}`}
                    className="field tnum max-w-[12rem]"
                    inputMode="decimal"
                    autoComplete="off"
                    value={r3.fillins[g]}
                    onChange={(e) => setG(g, e.target.value)}
                    placeholder="a whole number"
                    aria-describedby={`in-${g}-help`}
                  />
                </Field>
              ))}
            </div>

            <div className="space-y-3 border-t border-line pt-3">
              <div className="flex flex-wrap items-center gap-3">
                <button type="button" onClick={doGCheck} className="btn-ghost">
                  Check my readings
                </button>
                <button type="button" id={IDS3.fileAlloc} onClick={doFileAlloc} className="btn-primary">
                  {r3.allocFiledAt ? "Update filed allocation" : "File allocation"}
                </button>
                {r3.allocFiledAt && <span className="stamp">Filed</span>}
                <span className="text-caption text-ash">
                  Checks requested: <span className="tnum font-semibold text-ink">{r3.checks}</span>
                </span>
              </div>
              {gCheck && (
                <p role="status" className="text-caption text-ink">
                  {gCheck.flagged === 0 ? "No filled reading is outlined." : `${gCheck.flagged} filled ${gCheck.flagged === 1 ? "reading is" : "readings are"} outlined in amber.`}
                  {gCheck.empty > 0 && ` ${gCheck.empty} empty, so not checked.`}
                </p>
              )}
              <p className="text-caption text-ash">
                Filing needs the total within {formatEuro(CAP)}, both scenarios opened and G1–G6 filled. It does not need any particular combination of levers.
              </p>
              {allocTried && allocMissing.length > 0 && <MissingList items={allocMissing} lead="Before the allocation can be filed:" />}
            </div>
          </AnswerBlock>

          {/* Block 3.2 */}
          <AnswerBlock
            id="block-3-2"
            title="Block 3.2 · RACI grid"
            kind="OBJECTIVE"
            findIt="Route 3 → Task 3 → “RACI grid”. Answer in the grid itself."
            analyse={false}
          >
            <MaterialRefs refs={["C5"]} />
            <p className="text-caption text-ash">
              One rule is enforced: exactly one <strong>A</strong> (Accountable) in each row. Which role holds it is your judgement, and it carries into the governance table below.
            </p>
            <RaciGrid showProblems={raciTried} />
            <div className="flex flex-wrap items-center gap-3">
              <button type="button" id={IDS3.fileRaci} onClick={doFileRaci} className="btn-primary">
                {r3.raciFiledAt ? "Update filed RACI" : "File RACI"}
              </button>
              {r3.raciFiledAt && <span className="stamp">Filed</span>}
            </div>
            {raciTried && raciIssues.length > 0 && <MissingList items={raciIssues} lead="Before the RACI can be filed:" />}
          </AnswerBlock>

          {/* Block 3.3 */}
          <AnswerBlock
            id="block-3-3"
            title="Block 3.3 · Risk and reversibility"
            kind="JUDGED"
            findIt="Route 3 → Task 3 → “Allocation board”, then the lever you would find hardest to undo. Answer below."
            analyse={false}
          >
            <MaterialRefs refs={["C1", "C5"]} />
            <Field
              id={IDS3.risk}
              htmlFor="risk"
              label="Which lever is closest to a one-way door?"
              help={
                <>
                  Name the lever in your allocation closest to a one-way door (Bezos, 2015), and how you would de-risk it before committing the full amount. Frame:{" "}
                  <em>“___ is the hardest to reverse because ___. Before committing in full, we will ___ (a smaller, reversible first step).”</em> At least 30 characters.
                  {r3.levers.l3 === "none" && " Your framework push is unfunded, so you may instead name the hardest-to-reverse lever you did fund, or state that no one-way-door lever was funded this cycle."}
                </>
              }
              meta={<span className="tnum text-micro text-ash">{r3.risk.trim().length} characters</span>}
            >
              <textarea
                id="risk"
                rows={4}
                className="field"
                value={r3.risk}
                onChange={(e) => setRisk(e.target.value)}
                placeholder="… is the hardest to reverse because … Before committing in full, we will …"
                aria-describedby="risk-help"
              />
            </Field>
          </AnswerBlock>

          {/* Block 3.4 */}
          <AnswerBlock
            id="block-3-4"
            title="Block 3.4 · Governance table"
            kind="JUDGED"
            findIt="Route 3 → Task 3 → “RACI grid” and “Allocation board”. Answer in the table below."
            analyse={false}
          >
            <MaterialRefs refs={["C5"]} />
            <div id={IDS3.gov} className="space-y-2">
              <p className="text-caption text-ash">
                One row per lever you funded above None, plus one row for the next portfolio review. Date format: YYYY-MM or a named milestone (for example ‘Month +3’).{" "}
                <strong>Rows 1 to {required} are needed</strong> for your allocation.
              </p>
              <div className="overflow-x-auto">
                <table className="w-full min-w-[36rem] border-collapse text-caption">
                  <caption className="sr-only">Governance table</caption>
                  <thead>
                    <tr className="text-left">
                      <th className="w-8 px-1 py-1 text-micro font-semibold uppercase text-ash">#</th>
                      <th className="px-1 py-1 text-micro font-semibold uppercase text-ash">Decision</th>
                      <th className="px-1 py-1 text-micro font-semibold uppercase text-ash">Owner</th>
                      <th className="w-36 px-1 py-1 text-micro font-semibold uppercase text-ash">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {r3.governance.map((row, i) => (
                      <tr key={i} id={IDS3.govRow(i)} className="align-top">
                        <td className="px-1 py-1 font-semibold">{i + 1}{i < required ? "" : <span className="ml-0.5 text-ash">·</span>}</td>
                        {(["decision", "owner", "date"] as const).map((k) => (
                          <td key={k} className="px-1 py-1">
                            <input
                              className="field"
                              aria-label={`Row ${i + 1} ${k}`}
                              value={row[k]}
                              onChange={(e) => setGov(i, { [k]: e.target.value })}
                              placeholder={k === "date" ? "Month +3" : k === "owner" ? "a role" : "a decision"}
                            />
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </AnswerBlock>

          {/* Block 3.5 */}
          <AnswerBlock
            id="block-3-5"
            title="Block 3.5 · What we are not funding this cycle"
            kind="JUDGED"
            findIt="Route 3 → Task 3 → “Allocation board” (the Uncovered pool meter) and your G6. Answer below."
            analyse={false}
          >
            <MaterialRefs refs={["C2", "C4"]} />
            <Field
              id={IDS3.notFunding}
              htmlFor="notfunding"
              label="What stays uncovered, and its price"
              help={
                <>
                  Name what stays uncovered, using your own G6 figure, and its price: not a vague risk, a number. Frame:{" "}
                  <em>“We are not funding ___ this cycle. That leaves ___ accounts with no review (G6), which is not zero. If this proves costly, the cost shows up as ___.”</em> At least 30 characters.
                </>
              }
              meta={<span className="tnum text-micro text-ash">{r3.notFunding.trim().length} characters</span>}
            >
              <textarea
                id="notfunding"
                rows={4}
                className="field"
                value={r3.notFunding}
                onChange={(e) => setNotFunding(e.target.value)}
                placeholder="We are not funding … this cycle. That leaves … accounts …"
                aria-describedby="notfunding-help"
              />
              <p aria-live="polite" className="flex flex-wrap items-center gap-1.5 text-caption">
                <span className="smallcaps">Cites</span>
                <Chip lit={nfCites}>your G6 figure or a lever you left unfunded</Chip>
              </p>
            </Field>
          </AnswerBlock>

          {/* Block 3.6 */}
          <AnswerBlock
            id="block-3-6"
            title="Block 3.6 · Executive summary"
            kind="JUDGED"
            findIt="Route 3 → Task 3 → the “Live memo”, which shows this summary first. Write it last."
            analyse={false}
          >
            <MaterialRefs refs={["C1", "C3", "C5"]} />
            <Field
              id={IDS3.exec}
              htmlFor="exec"
              label="The summary a Geschäftsführer reads first"
              help="Say what you fund, how reversible it is, what the two scenarios produce, and who owns it. Four chips underneath light up as the text names each."
              meta={<span className="tnum text-micro text-ash">{r3.exec.trim().length} characters</span>}
            >
              <textarea
                id="exec"
                rows={5}
                className="field"
                value={r3.exec}
                onChange={(e) => setExec(e.target.value)}
                placeholder="This program funds … Under … we expect … The … is accountable for …"
                aria-describedby="exec-help"
              />
              <div aria-live="polite" className="flex flex-wrap items-center gap-2">
                <Chip lit={chips.lever}>Lever</Chip>
                <Chip lit={chips.reversibility}>Reversibility</Chip>
                <Chip lit={chips.scenario}>Scenario</Chip>
                <Chip lit={chips.owner}>Owner</Chip>
              </div>
            </Field>
          </AnswerBlock>

          <div className="space-y-3">
            <MissingList items={missing} lead="Your decision memo is still missing:" />
            <ExportBar
              id={IDS3.exportL3}
              previewTitle="Preview of your memo"
              exportLabel="Export decision memo"
              docTitle="Decision Memo — Customer Retention Investment Program"
              filename={fname}
              missing={missing}
              buildBody={() => memoBody(snapshot)}
            />
          </div>
        </div>

        <MemoSide />
      </div>
      <MemoStrip />
    </section>
  );
}
