"use client";

import { useId, useMemo, useState } from "react";
import { useInView } from "@/lib/useInView";
import { wrap } from "@/lib/svgModels";

export type OwnerKind = "brand" | "partner" | "customer" | "social";

export type JStage = {
  id: string;
  label: string;
  from: number;
  to: number;
  dashed?: boolean;
  /** No label in the label column — the band is only named on hover/tap. */
  unlabelled?: boolean;
  /** Caption shown on hover / tap / focus. */
  hover?: string;
  /** "Who owns this stage?" marker text (practitioner observation). */
  owner?: string;
  ownerTone?: "owned" | "gap";
};

export type JPoint = {
  id: string;
  at: number;
  span?: [number, number];
  /** Touchpoint dot inside a stage row (generic map). Without it the point is a record chip below the axis. */
  stageId?: string;
  owner?: OwnerKind;
  label: string;
};

const W = 640;
const LABEL_W = 150;
const ROW_H = 40;
const TOP = 6;

const OWNER_LABEL: Record<OwnerKind, string> = {
  brand: "Brand-owned",
  partner: "Partner-owned",
  customer: "Customer-owned",
  social: "Social / external",
};

/**
 * JourneyMap — stages as rows on a timeline. Materi A5 uses it with generic
 * B2B IT data and touchpoints coloured by owner; Task 1 reuses the same
 * component with the Kessler months and record chips. Everything interactive
 * has a hover/focus/tap caption below the map, in HTML.
 */
export function JourneyMap({
  title,
  desc,
  min,
  max,
  ticks,
  stages,
  points = [],
  showOwners = false,
  formatAxis,
  selectedPoint,
  onPointSelect,
}: {
  title: string;
  desc: string;
  min: number;
  max: number;
  ticks: { at: number; label: string }[];
  stages: JStage[];
  points?: JPoint[];
  showOwners?: boolean;
  formatAxis?: (v: number) => string;
  selectedPoint?: string | null;
  onPointSelect?: (id: string) => void;
}) {
  const uid = useId().replace(/:/g, "");
  const [ref, seen] = useInView<HTMLDivElement>();
  const [selStage, setSelStage] = useState<string | null>(null);

  const ownerW = showOwners ? 150 : 0;
  const x0 = LABEL_W + 10;
  const x1 = W - ownerW - 12;
  const x = (v: number) => x0 + ((v - min) / (max - min)) * (x1 - x0);

  const rowsH = stages.length * ROW_H;
  const axisY = TOP + rowsH + 6;
  const chips = points.filter((p) => !p.stageId);
  const dots = points.filter((p) => p.stageId);

  // Record chips: greedy left→right so they never overlap, then pull back inside the plot.
  const chipLayout = useMemo(() => {
    const sorted = [...chips].sort((a, b) => a.at - b.at);
    const CW = 44;
    const xs: number[] = [];
    sorted.forEach((p, i) => {
      const want = x(p.at);
      xs.push(i === 0 ? Math.max(want, x0 + CW / 2) : Math.max(want, xs[i - 1] + CW + 2));
    });
    for (let i = sorted.length - 1; i >= 0; i--) {
      const limit = i === sorted.length - 1 ? x1 - CW / 2 : xs[i + 1] - CW - 2;
      if (xs[i] > limit) xs[i] = limit;
    }
    return sorted.map((p, i) => ({ p, cx: xs[i] }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chips.map((c) => c.id + c.at).join("|"), min, max, showOwners]);

  const chipsH = chips.length ? 78 : 0;
  const H = axisY + 34 + chipsH;

  const sel = stages.find((s) => s.id === selStage);
  const caption = sel
    ? `${sel.hover ?? sel.label}${formatAxis ? ` · ${formatAxis(sel.from)}${sel.to !== sel.from ? ` → ${formatAxis(sel.to)}` : ""}` : ""}`
    : "Select a stage (tap, click or press Enter) to read its caption.";

  return (
    <figure className="space-y-2" ref={ref}>
      <svg viewBox={`0 0 ${W} ${H}`} className="h-auto w-full" role="group" aria-labelledby={`${uid}-t ${uid}-d`} preserveAspectRatio="xMidYMid meet">
        <title id={`${uid}-t`}>{title}</title>
        <desc id={`${uid}-d`}>{desc}</desc>
        <defs>
          <pattern id={`${uid}-hatch`} width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
            <rect width="6" height="6" fill="#FBF0D6" />
            <line x1="0" y1="0" x2="0" y2="6" stroke="#8A5A0B" strokeWidth="2" />
          </pattern>
        </defs>

        {stages.map((s, i) => {
          const y = TOP + i * ROW_H;
          const isSel = selStage === s.id;
          const milestone = s.from === s.to;
          const bx = x(s.from);
          const bw = Math.max(x(s.to) - x(s.from), 0);
          const lines = s.unlabelled ? [] : wrap(s.label, 22);
          return (
            <g
              key={s.id}
              className="hit"
              role="button"
              tabIndex={0}
              aria-pressed={isSel}
              aria-label={s.unlabelled ? "Unlabelled stage band" : s.label}
              onClick={() => setSelStage(isSel ? null : s.id)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  setSelStage(isSel ? null : s.id);
                }
              }}
            >
              <rect x={0} y={y} width={W} height={ROW_H} fill={isSel ? "#FBF0D6" : i % 2 ? "rgba(236,230,214,0.45)" : "transparent"} className="hit-shape" stroke="transparent" />
              {lines.map((l, k) => (
                <text key={k} x={LABEL_W} y={y + ROW_H / 2 + 4 - ((lines.length - 1) * 7) + k * 14} textAnchor="end" fontSize="12.5" fill="#1F2328">
                  {l}
                </text>
              ))}
              {milestone ? (
                <path
                  d={`M${bx},${y + 9} l11,11 l-11,11 l-11,-11 Z`}
                  fill="#1F2328"
                  className={seen ? "anim-grow-x" : undefined}
                  style={{ animationDelay: `${i * 70}ms` }}
                />
              ) : (
                <rect
                  x={bx}
                  y={y + 10}
                  width={bw}
                  height={20}
                  rx="3"
                  fill={s.dashed ? "#FFFEFA" : "#2F5D62"}
                  stroke={s.dashed ? "#59606A" : "#1F3F43"}
                  strokeWidth="1.6"
                  strokeDasharray={s.dashed ? "6 4" : undefined}
                  className={seen ? "anim-grow-x" : undefined}
                  style={{ animationDelay: `${i * 70}ms` }}
                />
              )}
              {dots
                .filter((d) => d.stageId === s.id)
                .map((d) => (
                  <TouchDot key={d.id} cx={x(d.at)} cy={y + ROW_H / 2} owner={d.owner ?? "brand"} uid={uid} />
                ))}
              {showOwners && s.owner && (
                <g>
                  <text x={x1 + 16} y={y + ROW_H / 2 + 4} fontSize="12" fontWeight="700" fill={s.ownerTone === "gap" ? "#A4472A" : "#0F6B6B"}>
                    {s.ownerTone === "gap" ? "?" : "●"} {s.owner}
                  </text>
                </g>
              )}
            </g>
          );
        })}

        {/* axis */}
        <line x1={x0} x2={x1} y1={axisY} y2={axisY} stroke="#59606A" strokeWidth="1.4" />
        {ticks.map((t) => (
          <g key={t.at}>
            <line x1={x(t.at)} x2={x(t.at)} y1={axisY} y2={axisY + 5} stroke="#59606A" />
            <text x={x(t.at)} y={axisY + 19} textAnchor="middle" fontSize="11.5" fill="#59606A">
              {t.label}
            </text>
          </g>
        ))}

        {/* record chips */}
        {chipLayout.map(({ p, cx }) => {
          const cy = axisY + 62;
          const isSel = selectedPoint === p.id;
          return (
            <g
              key={p.id}
              className="hit"
              role="button"
              tabIndex={0}
              aria-label={`Record ${p.id}`}
              aria-pressed={isSel}
              onClick={() => onPointSelect?.(p.id)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  onPointSelect?.(p.id);
                }
              }}
            >
              {p.span && (
                <line x1={x(p.span[0])} x2={x(p.span[1])} y1={axisY} y2={axisY} stroke="#D99A2B" strokeWidth="5" strokeLinecap="round" opacity="0.9" />
              )}
              <line x1={cx} x2={x(p.at)} y1={cy - 17} y2={axisY} stroke="#59606A" strokeWidth="1" strokeDasharray="2 3" />
              <circle cx={x(p.at)} cy={axisY} r="3.6" fill="#8A5A0B" />
              <rect
                x={cx - 22}
                y={cy - 17}
                width={44}
                height={34}
                rx="5"
                fill={isSel ? "#FBF0D6" : "#FFFEFA"}
                stroke={isSel ? "#8A5A0B" : "#59606A"}
                strokeWidth={isSel ? 2.4 : 1.4}
                className={isSel ? "hit-shape anim-pulse" : "hit-shape"}
              />
              <text x={cx} y={cy + 5} textAnchor="middle" fontSize="14" fontWeight="700" fill="#1F2328">
                {p.label}
              </text>
            </g>
          );
        })}
      </svg>

      <figcaption aria-live="polite" className="min-h-[2.5rem] rounded-md bg-mist px-3 py-2 text-caption text-ink">
        {caption}
      </figcaption>

      <div role="group" aria-label="Stages (tap equivalent of the map rows)" className="flex flex-wrap gap-1.5">
        {stages.map((s) => (
          <button
            key={s.id}
            type="button"
            aria-pressed={selStage === s.id}
            onClick={() => setSelStage(selStage === s.id ? null : s.id)}
            className={`btn btn-sm min-h-[40px] border ${selStage === s.id ? "border-accent bg-accentSoft text-ink" : "border-line bg-paper text-ash hover:border-ash"}`}
          >
            {s.unlabelled ? "Dashed band" : s.label}
          </button>
        ))}
      </div>

      {dots.length > 0 && (
        <ul className="flex flex-wrap gap-x-4 gap-y-1 text-caption text-ash" aria-label="Touchpoint owners">
          {(Object.keys(OWNER_LABEL) as OwnerKind[]).map((k) => (
            <li key={k} className="flex items-center gap-1.5">
              <svg viewBox="0 0 16 16" className="h-4 w-4" aria-hidden>
                <OwnerGlyph owner={k} uid={uid} cx={8} cy={8} />
              </svg>
              {OWNER_LABEL[k]}
            </li>
          ))}
        </ul>
      )}
    </figure>
  );
}

function OwnerGlyph({ owner, uid, cx, cy }: { owner: OwnerKind; uid: string; cx: number; cy: number }) {
  switch (owner) {
    case "brand":
      return <circle cx={cx} cy={cy} r="6" fill="#0F6B6B" />;
    case "partner":
      return (
        <>
          <circle cx={cx} cy={cy} r="6" fill="#FFFEFA" stroke="#0F6B6B" strokeWidth="2" />
          <circle cx={cx} cy={cy} r="2.2" fill="#0F6B6B" />
        </>
      );
    case "customer":
      return <rect x={cx - 6} y={cy - 6} width="12" height="12" rx="2" fill={`url(#${uid}-hatch)`} stroke="#8A5A0B" strokeWidth="1.6" />;
    case "social":
      return <circle cx={cx} cy={cy} r="6" fill="#FFFEFA" stroke="#59606A" strokeWidth="1.6" strokeDasharray="3 2" />;
  }
}

function TouchDot({ cx, cy, owner, uid }: { cx: number; cy: number; owner: OwnerKind; uid: string }) {
  return (
    <g>
      <title>{`${OWNER_LABEL[owner]} touchpoint`}</title>
      <OwnerGlyph owner={owner} uid={uid} cx={cx} cy={cy} />
    </g>
  );
}
