"use client";

import clsx from "clsx";
import type { FlowGraph, FlowPin } from "@/lib/route1";
import { Pin as PinGlyph } from "@/components/icons/LineIcons";

/**
 * One diagram component, two graphs.
 *
 * Section A renders `ENERGY_CHAIN` with no pins — a plain left-to-right chain.
 * Task 1 renders `APPNEXA_TRACE` through the same component with six
 * interactive hotspot pins. That is why this takes a graph rather than drawing
 * a fixed picture: the task's trace is the material's diagram, extended, not a
 * second hand-built SVG that could drift away from it.
 *
 * Everything is inline SVG on brand tokens. The flowing dotted overlay is a
 * CSS keyframe (`.anim-flow` in globals.css) — no animation library.
 */
export function FlowDiagram({
  graph,
  pins = [],
  activePinId = null,
  completePinIds = [],
  onPinClick,
  className,
}: {
  graph: FlowGraph;
  pins?: FlowPin[];
  /** The pin whose symptom card is currently open. */
  activePinId?: string | null;
  /** Pins whose finding is fully worked up — drawn in the accent, filled. */
  completePinIds?: string[];
  onPinClick?: (pinId: string) => void;
  className?: string;
}) {
  const interactive = typeof onPinClick === "function";

  return (
    <figure className={clsx("m-0", className)}>
      <div className="overflow-x-auto">
        <svg
          viewBox={graph.viewBox}
          role="img"
          aria-label={graph.title}
          className="h-auto w-full min-w-[640px]"
        >
          <title>{graph.title}</title>

          {/* Arrow head, in the muted line colour so edges never read as accent. */}
          <defs>
            <marker
              id={`${graph.id}-arrow`}
              viewBox="0 0 10 10"
              refX="9"
              refY="5"
              markerWidth="6"
              markerHeight="6"
              orient="auto-start-reverse"
            >
              <path d="M0 0 L10 5 L0 10 z" className="fill-ash" />
            </marker>
          </defs>

          {/* --- Edges, under the nodes --- */}
          <g>
            {graph.edges.map((edge) => {
              const lanes = edge.lanes ?? 1;
              const gap = edge.laneGap ?? 12;
              // Centre the lane bundle on the declared path.
              const offsets =
                lanes === 1
                  ? [0]
                  : Array.from({ length: lanes }, (_, i) => (i - (lanes - 1) / 2) * gap);

              return (
                <g key={edge.id}>
                  {offsets.map((dy, i) => (
                    <g key={i} transform={`translate(0 ${dy})`}>
                      <path
                        d={edge.d}
                        className="fill-none stroke-line"
                        strokeWidth={1.8}
                        markerEnd={`url(#${graph.id}-arrow)`}
                      />
                      {edge.flow && (
                        <path
                          d={edge.d}
                          className="anim-flow fill-none stroke-accent"
                          strokeWidth={1.8}
                          style={{ animationDelay: `${(i * 0.4).toFixed(2)}s` }}
                        />
                      )}
                    </g>
                  ))}
                </g>
              );
            })}
          </g>

          {/* --- Nodes --- */}
          <g>
            {graph.nodes.map((node) => {
              const aside = node.tone === "aside";
              const solid = node.tone === "solid";
              return (
                <g key={node.id}>
                  <rect
                    x={node.x}
                    y={node.y}
                    width={node.w}
                    height={node.h}
                    rx={14}
                    className={clsx(
                      aside ? "fill-mist stroke-ash" : solid ? "fill-paper stroke-ink" : "fill-paper stroke-line",
                    )}
                    strokeWidth={aside ? 1.4 : solid ? 1.6 : 1.4}
                    strokeDasharray={aside ? "6 5" : undefined}
                  />
                  <text
                    x={node.x + node.w / 2}
                    y={node.y + (node.sub ? node.h / 2 - 4 : node.h / 2 + 5)}
                    textAnchor="middle"
                    className="fill-ink"
                    style={{ fontSize: 15, fontWeight: 600 }}
                  >
                    {node.label}
                  </text>
                  {node.sub && (
                    <text
                      x={node.x + node.w / 2}
                      y={node.y + node.h / 2 + 15}
                      textAnchor="middle"
                      className="fill-ash"
                      style={{ fontSize: 11.5 }}
                    >
                      {node.sub}
                    </text>
                  )}
                </g>
              );
            })}
          </g>

          {/* --- Hotspot pins, on top of everything --- */}
          <g>
            {pins.map((pin) => {
              const done = completePinIds.includes(pin.id);
              const active = activePinId === pin.id;
              return (
                <g
                  key={pin.id}
                  role={interactive ? "button" : undefined}
                  tabIndex={interactive ? 0 : undefined}
                  aria-label={interactive ? `Inspect hotspot ${pin.n}: ${pin.label}` : undefined}
                  aria-pressed={interactive ? active : undefined}
                  onClick={interactive ? () => onPinClick?.(pin.id) : undefined}
                  onKeyDown={
                    interactive
                      ? (e) => {
                          if (e.key === "Enter" || e.key === " ") {
                            e.preventDefault();
                            onPinClick?.(pin.id);
                          }
                        }
                      : undefined
                  }
                  className={clsx(interactive && "cursor-pointer focus:outline-none")}
                >
                  {/* Halo: draws the eye to un-inspected pins, settles once done. */}
                  <circle
                    cx={pin.x}
                    cy={pin.y}
                    r={active ? 21 : 18}
                    className={clsx(
                      done ? "fill-accent/15" : "fill-danger/15",
                      !done && !active && "anim-pin-pulse",
                    )}
                  />
                  <circle
                    cx={pin.x}
                    cy={pin.y}
                    r={13}
                    className={clsx(
                      done ? "fill-accent stroke-accent" : "fill-paper",
                      done ? "" : active ? "stroke-accent" : "stroke-danger",
                    )}
                    strokeWidth={2}
                  />
                  <text
                    x={pin.x}
                    y={pin.y + 4.5}
                    textAnchor="middle"
                    className={done ? "fill-paper" : active ? "fill-accent" : "fill-danger"}
                    style={{ fontSize: 13, fontWeight: 700 }}
                  >
                    {pin.n}
                  </text>
                </g>
              );
            })}
          </g>
        </svg>
      </div>

      <figcaption className="mt-3 flex items-start gap-2 text-caption text-ash">
        {pins.length > 0 && <PinGlyph className="mt-0.5 h-4 w-4 shrink-0 text-danger" />}
        <span>{graph.caption}</span>
      </figcaption>
    </figure>
  );
}
