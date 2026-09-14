"use client";

import { useState } from "react";
import clsx from "clsx";
import { QUALIFIER, type QualifierOutcome } from "@/lib/route1";
import { Overlay } from "./Overlay";

/**
 * SVG #7 — The Use-Case Qualifier. Four requirement questions in a row; the
 * first "yes" drops to the evidence question, four "no"s end at "existing
 * connectivity sufficient". The SVG draws the path taken; the questions and the
 * outcome text live in HTML underneath. Clickable and resettable.
 */

const VW = 640;
const VH = 320;
const REQ_Y = 64;
const REQ_X = [60, 180, 300, 420];
const D = 30;
const EVID = { x: 240, y: 178 };
const BOX = {
  sufficient: { x: 488, y: 38, w: 140, h: 52 },
  justified: { x: 70, y: 252, w: 150, h: 52 },
  unevidenced: { x: 260, y: 252, w: 150, h: 52 },
} as const;

type Answer = "yes" | "no";

function diamond(x: number, y: number, d = D) {
  return `M${x} ${y - d} L${x + d} ${y} L${x} ${y + d} L${x - d} ${y} Z`;
}

export function UseCaseQualifier() {
  const [answers, setAnswers] = useState<Record<string, Answer>>({});
  const [evidence, setEvidence] = useState<Answer | null>(null);

  const reqs = QUALIFIER.requirements;
  const yesIndex = reqs.findIndex((r) => answers[r.id] === "yes");
  const allNo = reqs.every((r) => answers[r.id] === "no");
  const currentReq = yesIndex === -1 && !allNo ? reqs.findIndex((r) => !answers[r.id]) : -1;

  const outcome: QualifierOutcome | null =
    yesIndex !== -1 ? (evidence === "yes" ? "justified" : evidence === "no" ? "unevidenced" : null) : allNo ? "sufficient" : null;

  const answerReq = (index: number, value: Answer) => {
    const next: Record<string, Answer> = {};
    reqs.slice(0, index).forEach((r) => (next[r.id] = "no"));
    next[reqs[index].id] = value;
    setAnswers(next);
    setEvidence(null);
  };

  const reset = () => {
    setAnswers({});
    setEvidence(null);
  };

  const reqOn = (i: number) => i < (yesIndex === -1 ? (allNo ? 4 : currentReq) : yesIndex + 1);
  const edge = (on: boolean) => (on ? "stroke-accent" : "stroke-line");

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-micro font-semibold uppercase tracking-wide text-ash">The Use-Case Qualifier</p>
        <button type="button" onClick={reset} className="rounded-full border border-line px-3 py-1 text-micro font-semibold text-ash hover:text-ink">
          Reset
        </button>
      </div>

      <div className="relative">
        <svg
          viewBox={`0 0 ${VW} ${VH}`}
          preserveAspectRatio="xMidYMid meet"
          role="img"
          aria-label="Decision tree: throughput, latency, density and mobility questions lead to 5G justified, existing connectivity sufficient, or requirement not yet evidenced."
          className="h-auto w-full"
        >
          <title>Use-Case Qualifier</title>
          {/* "no" edges along the row */}
          {REQ_X.map((x, i) => {
            const toX = i < 3 ? REQ_X[i + 1] - D : BOX.sufficient.x;
            const on = answers[reqs[i].id] === "no";
            return <line key={`no-${i}`} x1={x + D} y1={REQ_Y} x2={toX} y2={REQ_Y} className={edge(on)} strokeWidth={on ? 3 : 1.6} />;
          })}
          {/* "yes" edges to the evidence question */}
          {REQ_X.map((x, i) => {
            const on = answers[reqs[i].id] === "yes";
            return (
              <path
                key={`yes-${i}`}
                d={`M${x} ${REQ_Y + D} C${x} ${REQ_Y + 70} ${EVID.x} ${EVID.y - 70} ${EVID.x} ${EVID.y - D}`}
                className={clsx("fill-none", edge(on))}
                strokeWidth={on ? 3 : 1.4}
                strokeDasharray={on ? undefined : "4 4"}
              />
            );
          })}
          {/* evidence edges */}
          <line
            x1={EVID.x - 16}
            y1={EVID.y + 20}
            x2={BOX.justified.x + BOX.justified.w / 2}
            y2={BOX.justified.y}
            className={edge(evidence === "yes")}
            strokeWidth={evidence === "yes" ? 3 : 1.6}
          />
          <line
            x1={EVID.x + 16}
            y1={EVID.y + 20}
            x2={BOX.unevidenced.x + BOX.unevidenced.w / 2}
            y2={BOX.unevidenced.y}
            className={edge(evidence === "no")}
            strokeWidth={evidence === "no" ? 3 : 1.6}
          />

          {/* nodes */}
          {REQ_X.map((x, i) => (
            <path
              key={`d-${i}`}
              d={diamond(x, REQ_Y)}
              className={clsx(
                i === currentReq ? "fill-accentSoft stroke-accent" : reqOn(i) ? "fill-paper stroke-accent" : "fill-paper stroke-line",
              )}
              strokeWidth={i === currentReq ? 3 : 2}
            />
          ))}
          <path
            d={diamond(EVID.x, EVID.y, 34)}
            className={clsx(yesIndex !== -1 ? (evidence ? "fill-paper stroke-accent" : "fill-accentSoft stroke-accent") : "fill-paper stroke-line")}
            strokeWidth={yesIndex !== -1 && !evidence ? 3 : 2}
          />
          {(Object.keys(BOX) as QualifierOutcome[]).map((k) => {
            const b = BOX[k];
            const on = outcome === k;
            return (
              <rect key={k} x={b.x} y={b.y} width={b.w} height={b.h} rx={12} className={on ? "fill-accent stroke-accent" : "fill-canvas stroke-line"} strokeWidth={2} />
            );
          })}
        </svg>

        {REQ_X.map((x, i) => (
          <span key={`lab-${i}`}>
            <Overlay x={x} y={REQ_Y} vw={VW} vh={VH} className="text-micro font-bold text-ink">
              {i + 1}
            </Overlay>
            <Overlay x={x} y={REQ_Y + D + 8} vw={VW} vh={VH} valign="top" className="hidden text-micro text-ash sm:block">
              {reqs[i].label}?
            </Overlay>
          </span>
        ))}
        <Overlay x={EVID.x} y={EVID.y} vw={VW} vh={VH} className="text-micro font-bold text-ink">
          ?
        </Overlay>
        <Overlay x={EVID.x + 44} y={EVID.y} vw={VW} vh={VH} align="start" className="hidden text-micro text-ash sm:block">
          {QUALIFIER.evidence.label}
        </Overlay>
        {(Object.keys(BOX) as QualifierOutcome[]).map((k) => {
          const b = BOX[k];
          return (
            <Overlay
              key={`box-${k}`}
              x={b.x + b.w / 2}
              y={b.y + b.h / 2}
              vw={VW}
              vh={VH}
              className={clsx("hidden whitespace-normal text-center text-micro font-semibold leading-tight sm:block", outcome === k ? "text-paper" : "text-ink")}
            >
              <span className="block w-[7.5rem]">{QUALIFIER.outcomes[k].label}</span>
            </Overlay>
          );
        })}
      </div>

      <div className="rounded-xl border border-line bg-canvas p-4" aria-live="polite">
        {outcome ? (
          <div className="reveal-in">
            <p className="text-caption font-semibold text-accent">{QUALIFIER.outcomes[outcome].label}</p>
            <p className="mt-1 text-caption text-ink">{QUALIFIER.outcomes[outcome].text}</p>
            <button type="button" onClick={reset} className="btn-ghost mt-3">
              Qualify another use case
            </button>
          </div>
        ) : yesIndex !== -1 ? (
          <Question
            label={`Requirement named: ${reqs[yesIndex].label}`}
            question={QUALIFIER.evidence.question}
            onAnswer={(a) => setEvidence(a)}
          />
        ) : currentReq !== -1 ? (
          <Question
            label={`Question ${currentReq + 1} of 4 · ${reqs[currentReq].label}`}
            question={reqs[currentReq].question}
            onAnswer={(a) => answerReq(currentReq, a)}
          />
        ) : null}
      </div>
    </div>
  );
}

function Question({ label, question, onAnswer }: { label: string; question: string; onAnswer: (a: Answer) => void }) {
  return (
    <div className="reveal-in">
      <p className="text-micro font-semibold uppercase tracking-wide text-ash">{label}</p>
      <p className="mt-1 text-caption font-semibold text-ink">{question}</p>
      <div className="mt-2 flex gap-2">
        <button type="button" onClick={() => onAnswer("yes")} className="btn-ghost">
          Yes
        </button>
        <button type="button" onClick={() => onAnswer("no")} className="btn-ghost">
          No
        </button>
      </div>
    </div>
  );
}
