"use client";

import { useId, type ReactNode } from "react";
import type { TcoData } from "@/data/offers";
import { cashTotals } from "@/data/offers";
import { useCountUp } from "@/lib/useCountUp";
import { formatEuro } from "@/lib/parseAmount";

const W = 640;
const X0 = 138;
const X1 = 620;
const BAR_H = 46;
const TOP = 34;
const GAP = 30;

type Look = { fill: string; stroke: string; dash?: string };

/** Layer look — pattern and outline as well as colour, so colour is never the only channel. */
function look(id: string, uid: string): Look {
  switch (id) {
    case "fees":
      return { fill: "#2F5D62", stroke: "#1F3F43" };
    case "onboarding":
    case "internal":
      return { fill: `url(#${uid}-hatch)`, stroke: "#8A5A0B" };
    case "incident":
      return { fill: `url(#${uid}-dots)`, stroke: "#0F6B6B" };
    case "care":
      return { fill: "#D99A2B", stroke: "#8A5A0B" };
    default:
      return { fill: "#FFFEFA", stroke: "#A4472A", dash: "6 4" };
  }
}

function Readout({ label, value }: { label: string; value: number }) {
  const v = useCountUp(value);
  return (
    <div className="rounded-lg border border-line bg-paper px-3 py-2">
      <p className="text-micro font-semibold uppercase text-ash">{label}</p>
      <p className="tnum text-h3" aria-label={`${label}: ${formatEuro(value)}`}>
        {formatEuro(v)}
      </p>
    </div>
  );
}

/**
 * TcoStack — stacked bars for the offers over the term, with toggles that add
 * cost layers. Materi B4 draws it with Alpenwerk data; Task 2 reuses it with
 * Kessler data. Cash layers add up; the expected-loss layer is dashed and
 * non-cash, and never enters the cash total. The component does not comment
 * on the order of the bars — the picture does.
 */
export function TcoStack({
  data,
  on,
  onToggle,
  controls,
  title,
  desc,
}: {
  data: TcoData;
  on: Record<string, boolean>;
  onToggle: (layerId: string, value: boolean) => void;
  controls?: ReactNode;
  title: string;
  desc: string;
}) {
  const uid = useId().replace(/:/g, "");
  const totals = cashTotals(data, on);
  const x = (v: number) => X0 + (v / data.max) * (X1 - X0);
  const H = TOP + data.bars.length * (BAR_H + GAP) + 26;
  const active = (l: TcoData["layers"][number]) => !!(l.alwaysOn || on[l.id]);

  return (
    <figure className="space-y-3">
      <fieldset className="space-y-1.5">
        <legend className="smallcaps mb-1">Cost layers</legend>
        <div className="grid gap-2 sm:grid-cols-2">
          {data.layers.map((l) => {
            const lk = look(l.id, uid);
            return (
              <label
                key={l.id}
                className={`flex min-h-[44px] items-center gap-2.5 rounded-lg border px-3 py-2 text-caption ${
                  l.alwaysOn ? "border-line bg-mist/60" : "cursor-pointer border-line bg-paper hover:border-ash"
                }`}
              >
                <input
                  type="checkbox"
                  checked={active(l)}
                  readOnly={l.alwaysOn}
                  aria-disabled={l.alwaysOn ? true : undefined}
                  onChange={(e) => !l.alwaysOn && onToggle(l.id, e.target.checked)}
                  className="h-4 w-4 accent-[#8A5A0B]"
                />
                <svg viewBox="0 0 22 14" className="h-3.5 w-6 shrink-0" aria-hidden>
                  <rect x="1" y="1" width="20" height="12" rx="2" fill={lk.fill} stroke={lk.stroke} strokeWidth="1.4" strokeDasharray={lk.dash} />
                </svg>
                <span className="min-w-0">
                  <span className="font-semibold">{l.label}</span>
                  {l.alwaysOn && <span className="ml-1 text-ash">(always on)</span>}
                  {!l.cash && <span className="ml-1 text-ash">· non-cash</span>}
                </span>
              </label>
            );
          })}
        </div>
      </fieldset>

      <svg viewBox={`0 0 ${W} ${H}`} className="h-auto w-full" role="img" aria-labelledby={`${uid}-t ${uid}-d`}>
        <title id={`${uid}-t`}>{title}</title>
        <desc id={`${uid}-d`}>{desc}</desc>
        <defs>
          <pattern id={`${uid}-hatch`} width="7" height="7" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
            <rect width="7" height="7" fill="#FBF0D6" />
            <line x1="0" y1="0" x2="0" y2="7" stroke="#8A5A0B" strokeWidth="2.4" />
          </pattern>
          <pattern id={`${uid}-dots`} width="8" height="8" patternUnits="userSpaceOnUse">
            <rect width="8" height="8" fill="#DFEEEB" />
            <circle cx="4" cy="4" r="1.7" fill="#0F6B6B" />
          </pattern>
        </defs>

        {data.bars.map((b, i) => {
          const y = TOP + i * (BAR_H + GAP);
          let acc = 0;
          return (
            <g key={b.id}>
              <text x={X0 - 10} y={y + BAR_H / 2 + 4} textAnchor="end" fontSize="13" fontWeight="700" fill="#1F2328">
                {b.label.split(" · ")[0]}
              </text>
              {b.label.includes(" · ") && (
                <text x={X0 - 10} y={y + BAR_H / 2 + 19} textAnchor="end" fontSize="11" fill="#59606A">
                  {b.label.split(" · ")[1]}
                </text>
              )}
              {data.layers.map((l) => {
                if (!active(l) || !l.cash || l.values[i] === 0) return null;
                const lk = look(l.id, uid);
                const w = x(l.values[i]) - X0;
                const sx = x(acc);
                acc += l.values[i];
                return (
                  <g key={l.id}>
                    <rect
                      x={sx}
                      y={y}
                      width={w}
                      height={BAR_H}
                      fill={lk.fill}
                      stroke={lk.stroke}
                      strokeWidth="1.4"
                      style={{ transition: "width .4s ease-out, x .4s ease-out" }}
                    />
                    {w > 74 && (
                      <text x={sx + w / 2} y={y + BAR_H / 2 + 4} textAnchor="middle" fontSize="11.5" fontWeight="700" fill={l.id === "fees" ? "#FFFFFF" : "#1F2328"}>
                        <tspan className="tnum" paintOrder="stroke" stroke={l.id === "fees" ? "none" : "#FFFEFA"} strokeWidth="3">
                          {formatEuro(l.values[i])}
                        </tspan>
                      </text>
                    )}
                  </g>
                );
              })}
              {/* expected loss: dashed, non-cash, drawn after the cash total */}
              {data.layers
                .filter((l) => !l.cash && active(l) && l.values[i] > 0)
                .map((l) => {
                  const lk = look(l.id, uid);
                  const sx = x(acc);
                  const w = x(l.values[i]) - X0;
                  return (
                    <g key={l.id} className="fade-in">
                      <rect x={sx} y={y} width={w} height={BAR_H} fill={lk.fill} stroke={lk.stroke} strokeWidth="1.8" strokeDasharray={lk.dash} />
                      {w > 60 && (
                        <text x={sx + w / 2} y={y + BAR_H / 2 + 4} textAnchor="middle" fontSize="11.5" fontWeight="700" fill="#A4472A">
                          {formatEuro(l.values[i])}
                        </text>
                      )}
                    </g>
                  );
                })}
            </g>
          );
        })}

        {data.cap && (
          <g>
            <line x1={x(data.cap.value)} x2={x(data.cap.value)} y1={TOP - 12} y2={H - 26} stroke="#1F2328" strokeWidth="1.8" strokeDasharray="2 4" />
            <text x={x(data.cap.value)} y={TOP - 16} textAnchor="middle" fontSize="11.5" fontWeight="700" fill="#1F2328">
              {data.cap.label}: {formatEuro(data.cap.value)}
            </text>
          </g>
        )}
        <line x1={X0} x2={X1} y1={H - 22} y2={H - 22} stroke="#59606A" strokeWidth="1.2" />
        {[0, 0.25, 0.5, 0.75, 1].map((f) => (
          <g key={f}>
            <line x1={x(data.max * f)} x2={x(data.max * f)} y1={H - 22} y2={H - 17} stroke="#59606A" />
            <text x={x(data.max * f)} y={H - 4} textAnchor="middle" fontSize="11" fill="#59606A">
              {f === 0 ? "€0" : `€${Math.round((data.max * f) / 1000)}k`}
            </text>
          </g>
        ))}
      </svg>

      <div className="grid gap-2 sm:grid-cols-2" aria-live="polite">
        {data.bars.map((b, i) => (
          <Readout key={b.id} label={`${b.label.split(" · ")[0]} · cash total, ${data.termLabel.toLowerCase()}`} value={totals[i]} />
        ))}
      </div>
      {controls}
    </figure>
  );
}
