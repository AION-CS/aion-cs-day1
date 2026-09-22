"use client";

import { useState } from "react";
import clsx from "clsx";
import { BIN_LABEL } from "@/data/kesslerDossier";
import {
  CARE_ADDON_PER_YEAR,
  COST_LINES,
  FIGURES,
  OFFER_SHEET,
  RISK_TABLE,
  kesslerTco,
} from "@/data/offers";
import { KESSLER_ROLES, MOTIVE_IDS, MOTIVE_LABEL } from "@/data/motives";
import { AnswerBlock, Pill } from "@/components/ui/AnswerBlock";
import { Calculator } from "@/components/ui/Calculator";
import { ExportBar } from "@/components/ui/ExportBar";
import { Field } from "@/components/ui/Field";
import { MaterialRefs } from "@/components/ui/MaterialRefs";
import { MissingList } from "@/components/ui/MissingList";
import { MotiveMap } from "@/components/ui/MotiveMap";
import { TcoStack } from "@/components/ui/TcoStack";
import { calculationBody } from "@/lib/exportDoc";
import { citedFigures, flagsForFigures } from "@/lib/checks";
import { scrollToAndFlash } from "@/lib/flash";
import { useJumpTo } from "@/lib/useJumpTo";
import { IDS, l2Missing } from "@/lib/missing";
import { formatEuro, parseAmount } from "@/lib/parseAmount";
import { exportName } from "@/lib/slug";
import { usePersisted } from "@/store/usePersisted";
import { useStore } from "@/store/useStore";
import { Gloss } from "@/lib/glossify";
import type { Recommendation } from "@/store/useStore";
import { AnswerKey } from "@/components/ui/AnswerKey";
import { motiveKey, recommendationKey } from "@/lib/answerKey";

const categoryLabel = (c: string | null) => (c ? BIN_LABEL[c as keyof typeof BIN_LABEL] : "—");

function Premise() {
  const jump = useJumpTo();
  const v = useStore((s) => s.l1.verdict);
  const filed = v.filedAt !== null;
  const cites = [v.cite1, v.cite2].filter(Boolean);
  return (
    <div id="premise" className="card space-y-2 border-signal/40 bg-signalSoft p-4 md:p-5">
      <p className="smallcaps text-signal">Premise · from your Task 1 verdict</p>
      {filed ? (
        <>
          <p className="text-body">
            You named <strong>{categoryLabel(v.category)}</strong>, citing <strong>{cites.join(" and ")}</strong>.
          </p>
          <blockquote className="border-l-4 border-gold bg-paper px-3 py-2 text-body italic">{v.sentence.trim()}</blockquote>
        </>
      ) : (
        <p className="text-body">
          No verdict filed in Task 1 yet.{" "}
          <button
            type="button"
            onClick={() => jump(IDS.fileNote, "/route-1/")}
            className="font-semibold underline decoration-dotted underline-offset-2 hover:text-accentHi"
          >
            Go to the Task 1 verdict in Route 1
          </button>{" "}
          — this is a suggestion, not a gate. You can work through Task 2 first.
        </p>
      )}
    </div>
  );
}

function MiniTable({ head, rows, note }: { head: [string, string] | [string, string, string]; rows: string[][]; note?: string }) {
  return (
    <div className="overflow-x-auto rounded-lg border border-line bg-paper">
      <table className="w-full border-collapse text-caption">
        <thead>
          <tr className="bg-mist text-left">
            {head.map((h) => (
              <th key={h} scope="col" className="px-3 py-2 text-micro font-semibold uppercase text-ash">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={i} className="border-t border-line align-top">
              {r.map((c, j) => (
                <td key={j} className={clsx("px-3 py-2", j === 0 && "font-semibold")}>
                  {c}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      {note && <p className="border-t border-line px-3 py-2 text-micro normal-case tracking-normal text-ash">{note}</p>}
    </div>
  );
}

/** A visibly disabled control: aria-disabled + tooltip. Clicking still does something — it scrolls to the reason and flashes it. */
function SoftLocked({
  locked,
  title,
  tooltip,
  onLockedClick,
  children,
  checked,
  onChange,
}: {
  locked: boolean;
  title: string;
  tooltip: string;
  onLockedClick: () => void;
  checked: boolean;
  onChange: (v: boolean) => void;
  children?: React.ReactNode;
}) {
  return (
    <div
      className={clsx(
        "rounded-lg border p-3",
        locked ? "border-dashed border-ash/60 bg-mist/60 text-ash" : "border-line bg-paper",
      )}
    >
      <label
        title={locked ? tooltip : undefined}
        className={clsx("flex min-h-[40px] items-start gap-2.5", locked ? "cursor-not-allowed" : "cursor-pointer")}
        onClick={(e) => {
          if (locked) {
            e.preventDefault();
            onLockedClick();
          }
        }}
      >
        <input
          type="checkbox"
          checked={!locked && checked}
          aria-disabled={locked}
          onChange={(e) => !locked && onChange(e.target.checked)}
          className="mt-1 h-4 w-4 accent-[#8A5A0B]"
        />
        <span className="min-w-0">
          <span className={clsx("font-semibold", !locked && "text-ink")}>
            {locked && <span className="mr-1.5 rounded border border-ash/50 px-1 py-px text-micro font-bold">LOCKED</span>}
            {title}
          </span>
          {locked && <span className="mt-0.5 block text-caption">{tooltip}</span>}
        </span>
      </label>
      {children}
    </div>
  );
}

export function Task2() {
  const jump = useJumpTo();
  const snapshot = usePersisted();
  const { l1, l2 } = snapshot;
  const setLayer = useStore((s) => s.setLayer);
  const setCare = useStore((s) => s.setCare);
  const setFillin = useStore((s) => s.setFillin);
  const setFocusedFigure = useStore((s) => s.setFocusedFigure);
  const checkFigures = useStore((s) => s.checkFigures);
  const showClue = useStore((s) => s.showL2Clue);
  const chooseMotive = useStore((s) => s.chooseMotive);
  const setRecommendation = useStore((s) => s.setRecommendation);
  const setJustification = useStore((s) => s.setJustification);
  const setLimits = useStore((s) => s.setLimits);
  const setQ6 = useStore((s) => s.setQ6);
  const submitQ6 = useStore((s) => s.submitQ6);

  const [figCheck, setFigCheck] = useState<{ flagged: number; empty: number } | null>(null);

  const filed = l1.verdict.filedAt !== null;
  const missing = l2Missing(snapshot);
  const fname = exportName(snapshot.participant.name, "l2-calculation");
  const cited = citedFigures(l2.justification, l2);
  const tco = kesslerTco(l2.careOn && filed);

  const doFigCheck = () => {
    const flags = flagsForFigures(l2);
    checkFigures(flags);
    setFigCheck({ flagged: flags.length, empty: FIGURES.filter((f) => !l2.fillins[f.id].trim()).length });
  };

  return (
    <section id="task-2" className="space-y-5">
      <header className="space-y-1">
        <p className="smallcaps text-accent">Task 2 · Level 2 · 15 min</p>
        <h2 className="text-h1">Task 2 · Calculation Note · the Kessler re-tender</h2>
        <p className="text-body italic text-ash">Level 2 shows that no configuration wins on every axis.</p>
      </header>

      <Premise />

      <div className="card space-y-2 p-4 md:p-5">
        <div className="flex flex-wrap items-center gap-2">
          <h3>The situation</h3>
          <span className="pill border-line bg-mist text-ash">Case assumption</span>
        </div>
        <p className="text-body"><Gloss>
          Kessler tenders (<em>Ausschreibung</em>, formal tender) a three-year Managed Security &amp; Operations service for the
          Azure environment TechSolutions built. Two offers arrive. Kessler&apos;s buying committee has four voices. You prepare
          the calculation note the account team takes into the committee meeting.{" "}
          <strong>Kessler&apos;s fee line for IT services is capped at €48,000 per year.</strong> One-off costs and hours booked
          by IT sit on other budget lines.
        </Gloss></p>
      </div>

      {/* Block 2.1 */}
      <section id="block-2-1" className="card space-y-3 p-4 md:p-5" aria-labelledby="b21-h">
        <h3 id="b21-h">Block 2.1 · Read the tables</h3>
        <p className="text-caption text-ash">
          <span className="smallcaps mr-1 text-accent">FIND IT</span>· Route 2 → Task 2 → “Offer sheet”, “Cost lines”, “Risk
          table”. Nothing is asked here; you use these three tables in Blocks 2.3 to 2.5.
        </p>
        <MaterialRefs refs={["B4"]} />
        <div className="grid gap-4 lg:grid-cols-2">
          <div className="space-y-1 lg:col-span-2">
            <p className="smallcaps">Offer sheet (per year unless stated)</p>
            <MiniTable
              head={["", "Offer A · NordByte IT", "Offer B · TechSolutions"]}
              rows={OFFER_SHEET.map((r) => [r.label, r.a, r.b])}
            />
          </div>
          <div className="space-y-1">
            <p className="smallcaps">Cost lines (Kessler&apos;s own costs, Case assumption)</p>
            <MiniTable head={["Line", "Value"]} rows={COST_LINES.map((r) => [r.label, r.value])} />
          </div>
          <div className="space-y-1">
            <p className="smallcaps">Risk table (Case assumption · assumed)</p>
            <MiniTable
              head={["", "Value · assumed"]}
              rows={RISK_TABLE.map((r) => [r.label, `${r.value} · assumed`])}
              note="Not an IBM figure; stated scale: 320-employee manufacturer. Averages such as IBM's are context. This single-loss figure is scaled to Kessler."
            />
          </div>
        </div>
      </section>

      {/* Block 2.2 */}
      <section id="block-2-2" className="card space-y-3 p-4 md:p-5" aria-labelledby="b22-h">
        <header className="flex flex-wrap items-center gap-2">
          <h3 id="b22-h">Block 2.2 · Cost explorer</h3>
          <Pill kind="EXPLORATORY" />
        </header>
        <p className="text-caption text-ash">
          <span className="smallcaps mr-1 text-accent">FIND IT</span>· Route 2 → Task 2 → “Cost explorer” → tick the layers one
          at a time. Not graded and not exported; the picture is the feedback.
        </p>
        <MaterialRefs refs={["B4", "B5"]} />
        <TcoStack
          data={tco}
          on={l2.explorerLayers as unknown as Record<string, boolean>}
          onToggle={(id, v) => setLayer(id as "onboarding" | "incident" | "ale", v)}
          title="Cost explorer"
          desc="Stacked bars for Offer A and Offer B over three years. Cash layers add up; expected loss is dashed and non-cash. A dotted marker shows the fee-line cap of 144,000 euros."
          controls={
            <div className="space-y-3 pt-1">
              <SoftLocked
                locked={!filed}
                checked={l2.careOn}
                onChange={setCare}
                title="Care after go-live (Offer B add-on)"
                tooltip="Unlocks after you file your Task 1 verdict."
                onLockedClick={() => jump(IDS.fileNote, "/route-1/")}
              >
                {filed && l2.careOn && (
                  <div className="fade-in mt-2 space-y-2 text-caption">
                    <p>
                      Adds <strong>{formatEuro(CARE_ADDON_PER_YEAR)} per year</strong> to Offer B (4 quarterly reviews × 12 h ×
                      €100/h, Case assumption).
                    </p>
                    <p className="inline-block rounded-full border border-ash/50 bg-mist px-2.5 py-0.5 font-semibold text-ink">
                      Retention effect: not modelled — 1 observed customer.
                    </p>
                    <p className="rounded-md border border-line bg-mist px-3 py-2 text-ink">
                      You named: <strong>{categoryLabel(l1.verdict.category)}</strong>. Care after go-live acts on:{" "}
                      <strong>Relationship</strong>.
                    </p>
                  </div>
                )}
              </SoftLocked>
              <SoftLocked
                locked
                checked={false}
                onChange={() => {}}
                title="Apply to all TechSolutions customers"
                tooltip="Needs more than one observed customer. Kessler is one."
                onLockedClick={() => scrollToAndFlash("mat-B5", "ref")}
              />
            </div>
          }
        />
      </section>

      {/* Block 2.3 */}
      <AnswerBlock
        id="block-2-3"
        title="Block 2.3 · Figures"
        kind="OBJECTIVE"
        findIt="Route 2 → Task 2 → “Offer sheet” and “Cost lines”. Answer in the fields below."
      >
        <MaterialRefs refs={["B4"]} />
        <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_16rem]">
          <div className="space-y-4">
            {FIGURES.map((f) => {
              const v = parseAmount(l2.fillins[f.id]);
              const raw = l2.fillins[f.id].trim();
              return (
                <Field
                  key={f.id}
                  id={IDS.figure(f.id)}
                  htmlFor={`in-${f.id}`}
                  label={`${f.id} · ${f.short}`}
                  help={f.question}
                  flagged={l2.flagged.includes(f.id)}
                  clue={f.clue}
                  clueShown={!!l2.clueShown[f.id]}
                  onShowClue={() => showClue(f.id)}
                >
                  <input
                    id={`in-${f.id}`}
                    className="field tnum max-w-xs"
                    inputMode="decimal"
                    autoComplete="off"
                    value={l2.fillins[f.id]}
                    onFocus={() => setFocusedFigure(f.id)}
                    onChange={(e) => setFillin(f.id, e.target.value)}
                    placeholder="e.g. 12,500"
                    aria-describedby={`in-${f.id}-help`}
                  />
                  <p aria-live="polite" className="min-h-[1rem] text-micro normal-case tracking-normal text-ash">
                    {raw ? (v === null ? "Cannot read this as a number yet." : `Read as ${f.unit}: ${v.toLocaleString("en-US", { maximumFractionDigits: 2 })}`) : "Accepts 159890, 159,890, 159.890, 159.890,00 or € 159 890."}
                  </p>
                </Field>
              );
            })}
            <div className="flex flex-wrap items-center gap-3 border-t border-line pt-3">
              <button type="button" onClick={doFigCheck} className="btn-primary">
                Check my figures
              </button>
              <span className="text-caption text-ash">
                Checks requested: <span className="tnum font-semibold text-ink">{l2.checks}</span>
              </span>
            </div>
            {figCheck && (
              <p role="status" className="text-caption text-ink">
                {figCheck.flagged === 0 ? "No entered figure is outlined." : `${figCheck.flagged} entered ${figCheck.flagged === 1 ? "figure is" : "figures are"} outlined in amber.`}
                {figCheck.empty > 0 && ` ${figCheck.empty} empty, so not checked.`}
              </p>
            )}
          </div>
          <div className="lg:sticky lg:top-32 lg:self-start">
            <Calculator />
          </div>
        </div>
      </AnswerBlock>

      {/* Block 2.4 */}
      <AnswerBlock
        id="block-2-4"
        title="Block 2.4 · Motive read"
        kind="OBJECTIVE"
        findIt="Route 2 → Task 2 → “Buying committee map” → read the four statements."
      >
        <MaterialRefs refs={["B2", "B3"]} />
        <div className="grid gap-3 md:grid-cols-2">
          {KESSLER_ROLES.map((r) => (
            <Field
              key={r.key}
              id={IDS.motive(r.key)}
              label={
                <span id={`lbl-${r.key}`}>
                  {r.name} <span className="font-normal text-ash">({r.gloss}) · {r.wind}</span>
                </span>
              }
              help={<em className="not-italic text-ink">{r.statement}</em>}
            >
              <div role="radiogroup" aria-labelledby={`lbl-${r.key}`} className="grid grid-cols-2 gap-1.5">
                {MOTIVE_IDS.map((m) => (
                  <label
                    key={m}
                    className={clsx(
                      "flex min-h-[40px] cursor-pointer items-center justify-center rounded-lg border px-2 text-caption font-semibold transition-colors",
                      l2.motives[r.key] === m ? "border-accent bg-accentSoft text-ink" : "border-line bg-paper text-ash hover:border-ash",
                    )}
                  >
                    <input
                      type="radio"
                      name={`motive-${r.key}`}
                      className="sr-only"
                      checked={l2.motives[r.key] === m}
                      onChange={() => chooseMotive(r.key, m)}
                    />
                    {MOTIVE_LABEL[m]}
                  </label>
                ))}
              </div>
            </Field>
          ))}
        </div>
        <MotiveMap mode="connect" motives={l2.motives} />
        <AnswerKey block={motiveKey()} />
      </AnswerBlock>

      {/* Block 2.5 */}
      <AnswerBlock
        id="block-2-5"
        title="Block 2.5 · Your choice"
        kind="JUDGED"
        findIt="Route 2 → Task 2 → “Cost explorer” and your Block 2.3 figures. Answer below."
        analyse={false}
      >
        <MaterialRefs refs={["B1", "B4", "B6"]} />
        <Field
          id={IDS.recommendation}
          label={<span id="rec-label">Recommendation</span>}
          help="The offer you would take into the committee meeting."
        >
          <div role="radiogroup" aria-labelledby="rec-label" className="grid gap-2 sm:grid-cols-3">
            {(
              [
                ["A", "Offer A"],
                ["B", "Offer B"],
                ["B+care", "Offer B + Care after go-live"],
              ] as [Exclude<Recommendation, null>, string][]
            ).map(([id, label]) => (
              <label
                key={id}
                className={clsx(
                  "flex min-h-[44px] cursor-pointer items-center gap-2 rounded-lg border px-3 py-2 transition-colors",
                  l2.recommendation === id ? "border-accent bg-accentSoft font-semibold" : "border-line bg-paper hover:border-ash",
                )}
              >
                <input
                  type="radio"
                  name="recommendation"
                  checked={l2.recommendation === id}
                  onChange={() => setRecommendation(id)}
                  className="h-4 w-4 accent-[#8A5A0B]"
                />
                {label}
              </label>
            ))}
          </div>
        </Field>

        <Field
          id={IDS.justification}
          htmlFor="justification"
          label="Justification"
          help="Cite at least one figure from your own tables or answers above."
        >
          <textarea
            id="justification"
            rows={4}
            className="field"
            value={l2.justification}
            onChange={(e) => setJustification(e.target.value)}
            placeholder="Offer … costs … over three years …"
            aria-describedby="justification-help"
          />
          <div aria-live="polite" className="flex flex-wrap items-center gap-1.5 text-caption">
            <span className="smallcaps">Figures cited</span>
            {cited.length === 0 ? (
              <span className="text-ash">none yet</span>
            ) : (
              cited.map((c) => (
                <span key={c.value} className="rounded-full border border-signal/50 bg-signalSoft px-2.5 py-0.5 font-semibold text-signal">
                  <span className="tnum">{c.value < 1 ? c.value : c.value.toLocaleString("en-US")}</span>
                  <span className="ml-1 font-normal text-ash">· {c.from}</span>
                </span>
              ))
            )}
          </div>
        </Field>

        <Field
          id={IDS.limits}
          htmlFor="limits"
          label={
            <>
              What your choice does not fix <span className="pill-jdg ml-1 align-middle">JUDGED</span>
            </>
          }
          help={
            <>
              Name a conflict that has two legitimate sides. The sentence must not resolve it. Frame:{" "}
              <em>“Choosing ___ protects ___ but leaves ___ exposed. Side one has a claim: ___. Side two has a claim: ___.”</em>{" "}
              At least 30 characters.
            </>
          }
          meta={<span className="tnum text-micro text-ash">{l2.limits.trim().length} characters</span>}
        >
          <textarea
            id="limits"
            rows={4}
            className="field"
            value={l2.limits}
            onChange={(e) => setLimits(e.target.value)}
            placeholder="Choosing … protects … but leaves … exposed. …"
            aria-describedby="limits-help"
          />
        </Field>
        <AnswerKey block={recommendationKey()} />
      </AnswerBlock>

      {/* Block 2.6 */}
      <AnswerBlock
        id="block-2-6"
        title="Block 2.6 · One question the data cannot answer"
        kind="OBJECTIVE"
        findIt="Route 2 → Task 2 → “Offer sheet”, “Cost lines”, “Risk table” and “Cost explorer”. Answer below."
        analyse={false}
      >
        <MaterialRefs refs={["B5"]} />
        <Field
          id={IDS.q6}
          htmlFor="q6"
          label="Question 6"
          help="Using Kessler alone, estimate the share of TechSolutions' one-off customers who would place a follow-on order within 24 months if Care after go-live existed. Answer in one or two sentences."
        >
          <textarea
            id="q6"
            rows={3}
            className="field"
            value={l2.q6}
            onChange={(e) => setQ6(e.target.value)}
            placeholder="This figure holds for … under … It does not tell us … because …"
            aria-describedby="q6-help"
          />
          <div className="flex flex-wrap items-center gap-3 pt-1">
            <button type="button" onClick={submitQ6} className="btn-primary btn-sm">
              Record my answer
            </button>
            {l2.q6Submitted && l2.q6.trim() && (
              <p role="status" className="fade-in text-caption font-semibold text-ink">
                Observations behind your figure: 1.
              </p>
            )}
          </div>
        </Field>
      </AnswerBlock>

      <div className="space-y-3">
        <MissingList items={missing} lead="Your calculation note is still missing:" />
        <ExportBar
          id={IDS.exportL2}
          previewTitle="Preview of your note"
          exportLabel="Export calculation note"
          docTitle="Calculation Note — the Kessler re-tender"
          filename={fname}
          missing={missing}
          buildBody={() => calculationBody(snapshot)}
        />
      </div>
    </section>
  );
}
