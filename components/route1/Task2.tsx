"use client";

import { useState } from "react";
import clsx from "clsx";
import { useProgress } from "@/lib/store";
import { createPlacementHistory, type PlacementMap } from "@/lib/usePlacementHistory";
import { undoRedoKeyHandler } from "@/lib/undoShortcuts";
import { AnswerKey } from "@/components/ui/AnswerKey";
import { UndoRedoControls } from "@/components/ui/UndoRedoControls";
import { MaterialRefs } from "@/components/ui/MaterialRefs";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { LivePanel } from "@/components/ui/LivePanel";
import { RadarChart, SeriesSwatch, type RadarAxis, type RadarSeries } from "@/components/ui/RadarChart";
import { Icon } from "@/components/icons/LineIcons";
import {
  ANSWER_KEY_L2,
  CHECK2_LABELS,
  CONTEXT_CHIPS_T2,
  CRITERIA,
  FOLLOWUP_FIELDS,
  JUSTIFICATION_FIELD,
  OPTION_LINES,
  PHASE1_INSTRUCTION,
  PHASE2_INTRO,
  PRIORITY_FIELD,
  R1,
  RISK_FIELDS,
  RISK_INSTRUCTION,
  TASK2_FRAMING,
  TASK2_MATERIAL_REFS,
  materialRefs,
  type CriterionId,
  type Level,
  type OptionId,
} from "@/lib/route1";
import { useRoute1, domId, type OptionAssessment } from "./useRoute1";
import { ReportPanel2 } from "./ReportPanel2";
import { ExportBar2 } from "./ExportBar2";

const RADAR_AXES: RadarAxis[] = CRITERIA.map((c) => ({ key: c.id, label: c.short, full: c.name }));

/**
 * Task 2, in full — "Which line of measures should be prioritised first?"
 * Stage A (assess) renders one combined radar from answered Low/Medium/High
 * judgments, never a blind slider (CURRICULUM-GUIDE.md §5). Stage B (decide +
 * justify) never reveals which line is "right" — the check only ever tests
 * whether the standard objection to whichever line was picked has been
 * pre-empted (CLAUDE.md §4).
 */
export function Task2() {
  const r1 = useRoute1();
  const choose = useProgress((s) => s.choose);
  const setNote = useProgress((s) => s.setNote);

  const [useScoreHistory] = useState(() => createPlacementHistory());
  const past = useScoreHistory((s) => s.past);
  const future = useScoreHistory((s) => s.future);
  const recordChange = useScoreHistory((s) => s.recordChange);
  const doUndo = useScoreHistory((s) => s.undo);
  const doRedo = useScoreHistory((s) => s.redo);

  const [hiddenSeries, setHiddenSeries] = useState<OptionId[]>([]);
  const [checkResultSig, setCheckResultSig] = useState<string | null>(null);

  const currentMap = (): PlacementMap => {
    const map: PlacementMap = {};
    for (const opt of OPTION_LINES) {
      for (const c of CRITERIA) map[`${opt.id}:${c.id}`] = r1.optionAssessment(opt.id).scores[c.id];
    }
    return map;
  };
  const applyMap = (map: PlacementMap) => {
    for (const opt of OPTION_LINES) {
      for (const c of CRITERIA) choose(R1.score(opt.id, c.id), map[`${opt.id}:${c.id}`] ?? "");
    }
  };

  const score = (optionId: OptionId, criterionId: CriterionId, level: Level) => {
    if (r1.optionAssessment(optionId).scores[criterionId] === level) return;
    recordChange(currentMap());
    choose(R1.score(optionId, criterionId), level);
  };

  const handleUndo = () => {
    const prev = doUndo(currentMap());
    if (prev) applyMap(prev);
  };
  const handleRedo = () => {
    const next = doRedo(currentMap());
    if (next) applyMap(next);
  };

  const toggleSeries = (id: OptionId) => setHiddenSeries((cur) => (cur.includes(id) ? cur.filter((x) => x !== id) : [...cur, id]));

  const radarSeries: RadarSeries[] = OPTION_LINES.filter((o) => !hiddenSeries.includes(o.id)).map((o) => ({
    id: o.id,
    label: `${o.letter} — ${o.title}`,
    values: r1.optionAssessment(o.id).radarValues,
    tone: "option",
    style: o.radarStyle,
  }));

  const runCheck = () => {
    if (!r1.priority) return;
    setNote(R1.checkCount2, String(r1.checkCount2 + 1));
    setCheckResultSig(`${r1.priority}|${r1.justification}|${r1.checkCount2 + 1}`);
  };
  const result = checkResultSig === `${r1.priority}|${r1.justification}|${r1.checkCount2}` ? r1.lastCheck2 : null;

  return (
    <section id={domId.task2} className="scroll-mt-24 space-y-6">
      <SectionHeading kicker={`${TASK2_FRAMING.tag} · about ${TASK2_FRAMING.minutes} minutes`} title={TASK2_FRAMING.title} />

      <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_340px]">
        <div className="min-w-0 space-y-6">
          <div className="rounded-2xl border border-accent/30 bg-accentSoft/60 p-5">
            <p className="text-body font-semibold text-ink">{TASK2_FRAMING.lead}</p>
            <p className="mt-2 max-w-prose text-body text-ash">{TASK2_FRAMING.instruction}</p>
          </div>

          <div className="rounded-2xl border border-line bg-paper p-5">
            <p className="text-micro font-semibold uppercase tracking-wide text-ash">General conditions</p>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {CONTEXT_CHIPS_T2.map((chip) => (
                <span key={chip} className="rounded-full border border-line bg-canvas px-2.5 py-1 text-micro text-ink">
                  {chip}
                </span>
              ))}
            </div>
          </div>

          {/* Stage A — assess */}
          <div tabIndex={-1} onKeyDown={undoRedoKeyHandler(handleUndo, handleRedo)} className="space-y-4 rounded-2xl border border-line bg-canvas p-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-micro font-semibold uppercase tracking-wide text-ash">Stage A — Assess all three</p>
                <p className="mt-0.5 max-w-prose text-caption text-ash">{PHASE1_INSTRUCTION}</p>
              </div>
              <UndoRedoControls onUndo={handleUndo} onRedo={handleRedo} canUndo={past.length > 0} canRedo={future.length > 0} />
            </div>

            <MaterialRefs refs={materialRefs(TASK2_MATERIAL_REFS)} />

            <div className="space-y-4">
              {OPTION_LINES.map((opt) => (
                <OptionCard key={opt.id} option={opt} assessment={r1.optionAssessment(opt.id)} onScore={score} />
              ))}
            </div>

            <div className="rounded-xl border border-line bg-paper p-4">
              <p className="text-micro font-semibold uppercase tracking-wide text-ash">All three, overlaid — toggle a line to compare</p>
              <div className="mt-2 flex flex-wrap gap-3">
                {OPTION_LINES.map((o) => {
                  const hidden = hiddenSeries.includes(o.id);
                  return (
                    <button
                      key={o.id}
                      type="button"
                      onClick={() => toggleSeries(o.id)}
                      aria-pressed={!hidden}
                      className={clsx(
                        "flex items-center gap-2 rounded-full border px-2.5 py-1 text-micro font-semibold transition-colors duration-150",
                        hidden ? "border-line text-ash opacity-50" : "border-accent/30 bg-accentSoft text-ink",
                      )}
                    >
                      <SeriesSwatch style={o.radarStyle} />
                      {o.letter}
                    </button>
                  );
                })}
              </div>
              <RadarChart axes={RADAR_AXES} series={radarSeries} max={3} animate title="Lines A, B and C compared across the seven assessment criteria" className="mt-2 max-w-md" />
            </div>
          </div>

          {/* Stage B — decide and justify */}
          <div className="space-y-4 rounded-2xl border border-line bg-paper p-5">
            <p className="text-micro font-semibold uppercase tracking-wide text-ash">Stage B — {PHASE2_INTRO.heading}</p>
            <p className="max-w-prose text-caption text-ash">{PHASE2_INTRO.body}</p>

            <div id={domId.priority} className="scroll-mt-24">
              <p className="text-caption font-semibold text-ink">{PRIORITY_FIELD.label}</p>
              <p className="mt-0.5 text-micro text-ash">{PRIORITY_FIELD.instruction}</p>
              <div className="mt-1.5 flex flex-wrap gap-2">
                {OPTION_LINES.map((o) => {
                  const on = r1.priority === o.id;
                  return (
                    <button
                      key={o.id}
                      type="button"
                      onClick={() => choose(R1.priority, o.id)}
                      aria-pressed={on}
                      className={clsx(
                        "flex items-center gap-2 rounded-xl border px-3 py-2 text-caption font-semibold transition-colors duration-150",
                        on ? "border-accent bg-accentSoft text-accent" : "border-line text-ink hover:border-ash",
                      )}
                    >
                      <Icon name={o.icon} className="h-4 w-4" />
                      {o.letter} — {o.title}
                    </button>
                  );
                })}
              </div>
            </div>

            <div id={domId.justification} className="scroll-mt-24">
              <label htmlFor="r1-l2-justification-field" className="block text-caption font-semibold text-ink">
                {JUSTIFICATION_FIELD.label}
              </label>
              <p className="mt-0.5 text-micro text-ash">{JUSTIFICATION_FIELD.instruction}</p>
              <textarea
                id="r1-l2-justification-field"
                value={r1.justification}
                onChange={(e) => setNote(R1.justification, e.target.value)}
                placeholder={JUSTIFICATION_FIELD.placeholder}
                rows={3}
                className="mt-1.5 w-full rounded-xl border border-line bg-paper px-3 py-2 text-caption text-ink"
              />
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              {FOLLOWUP_FIELDS.map((f, i) => (
                <div key={f.id} id={domId.followUp(i)} className="scroll-mt-24">
                  <label htmlFor={`r1-l2-followup-input-${i}`} className="block text-caption font-semibold text-ink">
                    {f.label}
                  </label>
                  <p className="mt-0.5 text-micro text-ash">{f.instruction}</p>
                  <input
                    id={`r1-l2-followup-input-${i}`}
                    type="text"
                    value={r1.followUps[i]}
                    onChange={(e) => setNote(R1.followUp(i), e.target.value)}
                    className="mt-1.5 w-full rounded-xl border border-line bg-paper px-3 py-2 text-caption text-ink"
                  />
                </div>
              ))}
            </div>

            <div id={domId.risks} className="scroll-mt-24">
              <p className="text-caption font-semibold text-ink">Two risks of an attractive-but-weak pick</p>
              <p className="mt-0.5 text-micro text-ash">{RISK_INSTRUCTION}</p>
              <MaterialRefs refs={materialRefs(["threeLines"])} />
              <div className="mt-1.5 grid gap-3 sm:grid-cols-2">
                {RISK_FIELDS.map((r, i) => (
                  <div key={r.id}>
                    <label htmlFor={`r1-l2-risk-${i}`} className="block text-micro font-semibold text-ash">
                      {r.label}
                    </label>
                    <textarea
                      id={`r1-l2-risk-${i}`}
                      value={r1.risks[i]}
                      onChange={(e) => setNote(R1.risk(i), e.target.value)}
                      rows={2}
                      className="mt-1 w-full rounded-xl border border-line bg-paper px-3 py-2 text-caption text-ink"
                    />
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-1.5 rounded-lg border border-line bg-canvas p-3">
              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={runCheck}
                  disabled={!r1.priority}
                  className="rounded-lg border border-line bg-paper px-3 py-1.5 text-caption font-semibold text-ink transition-colors duration-150 hover:border-ash disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {r1.checkCount2 > 0 ? CHECK2_LABELS.recheck : CHECK2_LABELS.check}
                </button>
                {!r1.priority && <span className="text-micro text-ash">Pick a priority line first.</span>}
                {r1.checkCount2 > 0 && <span className="text-micro text-ash">checked {r1.checkCount2}×</span>}
              </div>
              {result?.holds && <p className="reveal-in text-caption font-semibold text-accent">{CHECK2_LABELS.holds}</p>}
              {result && !result.holds && (
                <div className="reveal-in space-y-1">
                  <p className="text-caption text-ink">
                    {result.reason === "criteria" ? CHECK2_LABELS.needsCriteria : result.tier === "sharp" ? CHECK2_LABELS.wrongTier2 : CHECK2_LABELS.wrongTier1}
                  </p>
                  <p className="rounded-lg border border-accent/25 bg-accentSoft px-2.5 py-1.5 text-caption text-ink">{result.clue}</p>
                </div>
              )}
            </div>

            <AnswerKey block={ANSWER_KEY_L2} />
          </div>
        </div>

        <LivePanel title="Priority Line Decision" summary={`${r1.options.filter((o) => o.fullyScored).length}/3 lines assessed`}>
          <ReportPanel2 />
        </LivePanel>
      </div>

      <ExportBar2 />
    </section>
  );
}

function OptionCard({
  option,
  assessment,
  onScore,
}: {
  option: (typeof OPTION_LINES)[number];
  assessment: OptionAssessment;
  onScore: (optionId: OptionId, criterionId: CriterionId, level: Level) => void;
}) {
  return (
    <div id={domId.optionCard(option.id)} className="scroll-mt-24 rounded-xl border border-line bg-paper p-4">
      <div className="flex items-start gap-2.5">
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-accentSoft text-accent">
          <Icon name={option.icon} className="h-4 w-4" />
        </span>
        <div className="min-w-0">
          <p className="text-micro font-semibold uppercase tracking-wide text-ash">
            Line {option.letter} · {assessment.scoredCount}/7 rated
          </p>
          <h4 className="text-h3 text-ink">{option.title}</h4>
          <p className="mt-0.5 max-w-prose text-caption text-ash">{option.description}</p>
        </div>
      </div>

      <div className="mt-3 grid gap-3 sm:grid-cols-2">
        {CRITERIA.map((c) => {
          const level = assessment.scores[c.id];
          return (
            <div key={c.id} id={domId.optionScore(option.id, c.id)} className="scroll-mt-24 rounded-lg border border-line bg-canvas p-2.5">
              <p className="text-micro font-semibold text-ink">{c.name}</p>
              <p className="mt-0.5 text-micro text-ash">{c.question.label}</p>
              <div className="mt-1.5 flex flex-wrap gap-1">
                {c.question.options.map((o) => {
                  const on = level === o.level;
                  return (
                    <button
                      key={o.level}
                      type="button"
                      title={o.label}
                      onClick={() => onScore(option.id, c.id, o.level)}
                      aria-pressed={on}
                      className={clsx(
                        "rounded-full border px-2 py-0.5 text-micro font-semibold transition-colors duration-150",
                        on ? "border-accent bg-accentSoft text-accent" : "border-line text-ash hover:border-ash",
                      )}
                    >
                      {o.level === "low" ? "Low" : o.level === "medium" ? "Medium" : "High"}
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
