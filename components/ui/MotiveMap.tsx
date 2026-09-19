"use client";

import { useId, useState } from "react";
import clsx from "clsx";
import { COMMITTEE, KESSLER_ROLES, MOTIVE_FEATURE, MOTIVE_LABEL } from "@/data/motives";
import type { MotiveId, RoleKey } from "@/data/motives";
import { FEATURE_ORDER, MMAP, connectorPath, featY, roleY, wrap } from "@/lib/svgModels";

/**
 * MotiveMap. In "roles" mode (Materi B2) it is the generic buying committee:
 * roles around a shared decision, each with a typical question on hover, tap
 * or focus. In "connect" mode (Task 2) it is the Kessler committee: a
 * connector runs from each role to the offer feature matching the motive the
 * participant chose. Innovation ends in an empty node — a dashed connector to
 * "No feature in either offer". The map says nothing about it.
 */
export function MotiveMap(
  props:
    | { mode: "roles" }
    | { mode: "connect"; motives: Record<RoleKey, MotiveId | null> },
) {
  return props.mode === "roles" ? <CommitteeRing /> : <ConnectMap motives={props.motives} />;
}

function CommitteeRing() {
  const uid = useId().replace(/:/g, "");
  const [sel, setSel] = useState<string>(COMMITTEE[0].key);
  const cx = 320;
  const cy = 176;
  const R = 122;
  const role = COMMITTEE.find((r) => r.key === sel)!;

  return (
    <figure className="space-y-2">
      <svg viewBox="0 0 640 352" className="h-auto w-full" role="group" aria-labelledby={`${uid}-t ${uid}-d`}>
        <title id={`${uid}-t`}>Buying committee map</title>
        <desc id={`${uid}-d`}>Six roles around one shared purchase decision. Select a role to read the question it typically asks.</desc>
        <circle cx={cx} cy={cy} r="58" fill="#1F2328" />
        <text x={cx} y={cy - 4} textAnchor="middle" fontSize="14" fontWeight="700" fill="#FFFEFA">
          The buying
        </text>
        <text x={cx} y={cy + 14} textAnchor="middle" fontSize="14" fontWeight="700" fill="#FFFEFA">
          group
        </text>
        {COMMITTEE.map((r, i) => {
          const a = (-90 + i * 60) * (Math.PI / 180);
          const x = cx + R * 1.55 * Math.cos(a);
          const y = cy + R * 1.05 * Math.sin(a);
          const isSel = r.key === sel;
          return (
            <g
              key={r.key}
              className="hit"
              role="button"
              tabIndex={0}
              aria-pressed={isSel}
              aria-label={`${r.name}, ${r.wind}`}
              onMouseEnter={() => setSel(r.key)}
              onClick={() => setSel(r.key)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  setSel(r.key);
                }
              }}
            >
              <line x1={cx} y1={cy} x2={x} y2={y} stroke="#59606A" strokeWidth="1.4" strokeDasharray={isSel ? undefined : "3 4"} />
              <circle cx={x} cy={y} r="46" fill={isSel ? "#FBF0D6" : "#FFFEFA"} stroke={isSel ? "#8A5A0B" : "#59606A"} strokeWidth={isSel ? 2.6 : 1.5} className="hit-shape" />
              <text x={x} y={y - 1} textAnchor="middle" fontSize="14" fontWeight="700" fill="#1F2328">
                {r.short}
              </text>
              <text x={x} y={y + 16} textAnchor="middle" fontSize="11.5" fill="#59606A">
                {r.wind}
              </text>
            </g>
          );
        })}
      </svg>
      <div className="flex flex-wrap gap-1.5" role="group" aria-label="Committee roles">
        {COMMITTEE.map((r) => (
          <button
            key={r.key}
            type="button"
            aria-pressed={r.key === sel}
            onClick={() => setSel(r.key)}
            className={clsx("btn btn-sm min-h-[40px] border", r.key === sel ? "border-accent bg-accentSoft text-ink" : "border-line bg-paper text-ash hover:border-ash")}
          >
            {r.name}
          </button>
        ))}
      </div>
      <figcaption aria-live="polite" className="rounded-lg border border-line bg-mist px-3 py-2 text-caption">
        <p className="font-semibold">
          {role.name} <span className="font-normal text-ash">({role.gloss}) · {role.wind}</span>
        </p>
        <p className="mt-0.5">Typical question (illustrative): “{role.question}”</p>
      </figcaption>
    </figure>
  );
}

function ConnectMap({ motives }: { motives: Record<RoleKey, MotiveId | null> }) {
  const uid = useId().replace(/:/g, "");
  return (
    <figure>
      <svg viewBox={`0 0 ${MMAP.w} ${MMAP.h}`} className="h-auto w-full" role="img" aria-labelledby={`${uid}-t ${uid}-d`}>
        <title id={`${uid}-t`}>Buying committee map</title>
        <desc id={`${uid}-d`}>
          Four Kessler roles on the left; four offer features on the right. Each role is connected to the feature that
          matches the motive you chose for it. A dashed line ends in an empty node.
        </desc>
        {KESSLER_ROLES.map((r, i) => {
          const m = motives[r.key];
          if (!m) return null;
          const empty = !!MOTIVE_FEATURE[m].empty;
          return (
            <path
              key={`${r.key}-${m}`}
              d={connectorPath(i, m)}
              fill="none"
              stroke={empty ? "#A4472A" : "#0F6B6B"}
              strokeWidth="2.6"
              pathLength={1}
              strokeDasharray={empty ? "0.03 0.025" : undefined}
              className={empty ? "fade-in" : "anim-draw"}
            />
          );
        })}
        {KESSLER_ROLES.map((r, i) => {
          const m = motives[r.key];
          return (
            <g key={r.key}>
              <rect x={MMAP.roleX} y={roleY(i)} width={MMAP.roleW} height={MMAP.roleH} rx="6" fill="#FFFEFA" stroke="#59606A" strokeWidth="1.4" />
              <text x={MMAP.roleX + 10} y={roleY(i) + 24} fontSize="14" fontWeight="700" fill="#1F2328">
                {r.name.length > 20 ? "Produktions-IT" : r.name}
              </text>
              <text x={MMAP.roleX + 10} y={roleY(i) + 44} fontSize="12.5" fill="#59606A">
                {m ? MOTIVE_LABEL[m] : "no motive chosen"}
              </text>
            </g>
          );
        })}
        {FEATURE_ORDER.map((m) => {
          const f = MOTIVE_FEATURE[m];
          const lines = wrap(f.label, 27).slice(0, 3);
          return (
            <g key={m}>
              <rect
                x={MMAP.featX}
                y={featY(m)}
                width={MMAP.featW}
                height={MMAP.featH}
                rx="6"
                fill={f.empty ? "#FFFEFA" : "#DFEEEB"}
                stroke={f.empty ? "#A4472A" : "#0F6B6B"}
                strokeWidth="1.5"
                strokeDasharray={f.empty ? "5 4" : undefined}
              />
              {lines.map((l, k) => (
                <text key={k} x={MMAP.featX + 10} y={featY(m) + 21 + k * 16} fontSize="12.5" fill="#1F2328">
                  {l}
                </text>
              ))}
            </g>
          );
        })}
      </svg>
    </figure>
  );
}
