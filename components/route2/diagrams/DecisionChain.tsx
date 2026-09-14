"use client";

import { useState } from "react";
import clsx from "clsx";
import { useInView } from "@/lib/useInView";
import { DECISION_CHAIN } from "@/lib/route2";
import { Overlay } from "@/components/route1/diagrams/Overlay";

/**
 * SVG #4 — the Decision Chain. Six nodes, left to right, connected by a line
 * that draws itself on first view (stroke-dashoffset, reduced-motion safe via
 * the shared .anim-connector keyframe). Each node is clickable to reveal what
 * breaks if it is missing.
 */

const VW = 920;
const VH = 220;
const Y = 70;
const R = 26;
const N = DECISION_CHAIN.length;
const MARGIN = 70;
const STEP = (VW - MARGIN * 2) / (N - 1);
const nx = (i: number) => MARGIN + i * STEP;

export function DecisionChain() {
  const { ref, seen } = useInView<HTMLDivElement>(0.4);
  const [selected, setSelected] = useState<string>(DECISION_CHAIN[0].id);
  const active = DECISION_CHAIN.find((n) => n.id === selected)!;

  return (
    <div ref={ref} className="space-y-3">
      <p className="text-micro font-semibold uppercase tracking-wide text-ash">The Decision Chain</p>
      <div className="relative">
        <svg
          viewBox={`0 0 ${VW} ${VH}`}
          preserveAspectRatio="xMidYMid meet"
          role="img"
          aria-label="A six-step decision chain from criteria defined to review changes behaviour, each step clickable to show what breaks if it is missing."
          className="h-auto w-full"
        >
          <title>The Decision Chain</title>
          <line x1={nx(0)} y1={Y} x2={nx(N - 1)} y2={Y} className="stroke-line" strokeWidth={3} />
          <line
            x1={nx(0)}
            y1={Y}
            x2={nx(N - 1)}
            y2={Y}
            className={clsx("stroke-accent", seen && "anim-connector")}
            strokeWidth={3}
            pathLength={1000}
          />
          {DECISION_CHAIN.map((node, i) => {
            const on = node.id === selected;
            return (
              <g
                key={node.id}
                role="button"
                tabIndex={0}
                aria-pressed={on}
                aria-label={`${node.n}. ${node.label}`}
                className="cursor-pointer outline-none"
                onClick={() => setSelected(node.id)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    setSelected(node.id);
                  }
                }}
              >
                <circle cx={nx(i)} cy={Y} r={R} className={on ? "fill-accent stroke-accentHi" : "fill-paper stroke-ink/50"} strokeWidth={on ? 3 : 2} />
              </g>
            );
          })}
        </svg>
        {DECISION_CHAIN.map((node, i) => (
          <span key={node.id}>
            <Overlay x={nx(i)} y={Y} vw={VW} vh={VH} className={clsx("text-caption font-bold", node.id === selected ? "text-paper" : "text-ink")}>
              {node.n}
            </Overlay>
            <Overlay x={nx(i)} y={Y + R + 14} vw={VW} vh={VH} valign="top" className="hidden whitespace-normal text-center text-micro font-semibold leading-tight text-ink sm:block">
              <span className="block w-[6.5rem]">{node.label}</span>
            </Overlay>
          </span>
        ))}
      </div>
      <div aria-live="polite" className="rounded-xl border border-accent/35 bg-accentSoft p-4">
        <p key={active.id} className="reveal-in text-caption text-ink">
          <span className="font-semibold">{active.n}. {active.label} — what breaks without it. </span>
          {active.breaksWithout}
        </p>
      </div>
    </div>
  );
}
