"use client";

import { useState } from "react";
import clsx from "clsx";
import { OWNERSHIP_NODES, ownershipNodeById, type OwnershipNodeId, type OwnershipRole } from "@/lib/route2";

/**
 * The Ownership Map — one component, two modes, used identically in S2's
 * material (explain mode: click a node, read its stake) and in Part 2's
 * ownership field (select mode: click a node to cycle unselected → Owns →
 * Consulted → unselected). Never duplicated between the two call sites.
 */
export type OwnershipMapProps =
  | { mode: "explain" }
  | { mode: "select"; value: (id: OwnershipNodeId) => OwnershipRole | null; onCycle: (id: OwnershipNodeId) => void };

const CENTER = { x: 210, y: 130 };

const POSITIONS: Record<OwnershipNodeId, { x: number; y: number }> = {
  it: { x: 210, y: 35 },
  finance: { x: 292, y: 83 },
  compliance: { x: 292, y: 178 },
  hr: { x: 210, y: 225 },
  purchasing: { x: 128, y: 178 },
  management: { x: 128, y: 83 },
};

export function OwnershipMap(props: OwnershipMapProps) {
  const [openId, setOpenId] = useState<OwnershipNodeId | null>(props.mode === "explain" ? OWNERSHIP_NODES[0].id : null);
  const activate = (id: OwnershipNodeId) => (props.mode === "select" ? props.onCycle(id) : setOpenId((cur) => (cur === id ? null : id)));

  return (
    <div className="space-y-3">
      <svg viewBox="0 0 420 260" className="h-auto w-full" role="img" aria-label="Ownership map">
        <circle cx={CENTER.x} cy={CENTER.y} r="30" className="fill-ink" />
        <text x={CENTER.x} y={CENTER.y + 4} textAnchor="middle" className="fill-paper" style={{ fontSize: 10, fontWeight: 700 }}>
          Decision
        </text>

        {OWNERSHIP_NODES.map((n) => {
          const p = POSITIONS[n.id];
          return <line key={n.id} x1={CENTER.x} y1={CENTER.y} x2={p.x} y2={p.y} className="stroke-line" strokeWidth={1.5} />;
        })}

        {OWNERSHIP_NODES.map((n) => {
          const p = POSITIONS[n.id];
          const role = props.mode === "select" ? props.value(n.id) : null;
          const isOpen = props.mode === "explain" && openId === n.id;
          const active = role !== null || isOpen;
          const fillClass = role === "owns" ? "fill-accent" : role === "consulted" ? "fill-warn" : isOpen ? "fill-accent" : "fill-paper";
          const strokeClass = active ? "stroke-accent" : "stroke-line";
          const textClass = active ? "fill-paper" : "fill-ink";
          return (
            <g
              key={n.id}
              role="button"
              tabIndex={0}
              aria-pressed={props.mode === "select" ? role !== null : isOpen}
              onClick={() => activate(n.id)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  activate(n.id);
                }
              }}
              className="cursor-pointer outline-none"
            >
              <circle cx={p.x} cy={p.y} r="30" className={clsx(fillClass, strokeClass)} strokeWidth={2} />
              <text x={p.x} y={p.y - 3} textAnchor="middle" className={textClass} style={{ fontSize: 11, fontWeight: 700 }}>
                {n.label}
              </text>
              {role && (
                <text x={p.x} y={p.y + 11} textAnchor="middle" className="fill-paper" style={{ fontSize: 7.5, fontWeight: 700, letterSpacing: "0.03em" }}>
                  {role === "owns" ? "OWNS" : "CONSULTED"}
                </text>
              )}
            </g>
          );
        })}
      </svg>

      {props.mode === "explain" && openId && (
        <div className="reveal-in rounded-lg border border-accent/25 bg-accentSoft px-3 py-2 text-caption text-ink">
          <span className="font-semibold">{ownershipNodeById(openId).label}: </span>
          {ownershipNodeById(openId).stake}
        </div>
      )}
      {props.mode === "select" && (
        <p className="text-micro text-ash">
          Click a node: unselected → <span className="font-semibold text-accent">Owns</span> →{" "}
          <span className="font-semibold text-warn">Consulted</span> → unselected.
        </p>
      )}
    </div>
  );
}
