"use client";

import { useId } from "react";
import type { Bin, RecordId } from "@/data/kesslerDossier";
import { BOARD, BOARD_LEGEND, SEG_STYLE, boardColumns, colX, segY } from "@/lib/svgModels";

/**
 * The Evidence board — five columns, live. Solid segments are observed
 * records; a hatched segment is an interpretation sitting in a category where
 * evidence should be. The board knows each record's true type and never says
 * "wrong": the picture is the consequence.
 */
export function EvidenceBoard({ placements }: { placements: Record<RecordId, Bin | null> }) {
  const uid = useId().replace(/:/g, "");
  const cols = boardColumns(placements);
  const pid = `hatch-${uid}`;
  const total = cols.reduce((s, c) => s + c.segs.length, 0);

  return (
    <figure className="space-y-2">
      <svg viewBox={`0 0 ${BOARD.w} ${BOARD.h}`} className="h-auto w-full max-w-[640px]" role="img" aria-labelledby={`${uid}-t ${uid}-d`}>
        <title id={`${uid}-t`}>Evidence board</title>
        <desc id={`${uid}-d`}>
          {`Five columns showing how many records are filed in each bin. ${total} of 8 records are placed. Solid segments are observed records; hatched segments are interpretations filed in a category.`}
        </desc>
        <defs>
          <pattern id={pid} width="7" height="7" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
            <rect width="7" height="7" fill="#FBF0D6" />
            <line x1="0" y1="0" x2="0" y2="7" stroke="#8A5A0B" strokeWidth="2.4" />
          </pattern>
        </defs>
        <line x1={BOARD.left} x2={BOARD.w - BOARD.left} y1={BOARD.base + 2} y2={BOARD.base + 2} stroke="#59606A" strokeWidth="1.2" />
        {cols.map((c, i) => {
          const x = colX(i);
          return (
            <g key={c.bin}>
              {c.segs.map((s, j) => {
                const st = SEG_STYLE[s.kind];
                return (
                  <g key={`${s.id}-${c.bin}`} className="anim-grow-y">
                    <rect
                      x={x}
                      y={segY(j)}
                      width={BOARD.barW}
                      height={BOARD.segH}
                      rx="3"
                      fill={st.fill.replace("{P}", pid)}
                      stroke={st.stroke}
                      strokeWidth="1.4"
                      strokeDasharray={st.dash}
                    />
                    <text x={x + BOARD.barW / 2} y={segY(j) + 17} textAnchor="middle" fontSize="13" fontWeight="700" fill={st.text}>
                      {s.id}
                    </text>
                  </g>
                );
              })}
              <text x={x + BOARD.barW / 2} y={BOARD.base + 22} textAnchor="middle" fontSize="13" fontWeight="600" fill="#1F2328">
                {c.label}
              </text>
              <text x={x + BOARD.barW / 2} y={BOARD.base + 40} textAnchor="middle" fontSize="12" fill="#59606A" className="tnum">
                {c.segs.length}
              </text>
            </g>
          );
        })}
      </svg>
      <ul className="flex flex-wrap gap-x-4 gap-y-1 text-caption text-ash" aria-label="Legend">
        {BOARD_LEGEND.map((l) => (
          <li key={l.kind} className="flex items-center gap-1.5">
            <svg viewBox="0 0 22 14" className="h-3.5 w-5" aria-hidden>
              <rect
                x="1"
                y="1"
                width="20"
                height="12"
                rx="2"
                fill={SEG_STYLE[l.kind].fill.replace("{P}", pid)}
                stroke={SEG_STYLE[l.kind].stroke}
                strokeWidth="1.4"
                strokeDasharray={SEG_STYLE[l.kind].dash}
              />
            </svg>
            {l.text}
          </li>
        ))}
      </ul>
    </figure>
  );
}
