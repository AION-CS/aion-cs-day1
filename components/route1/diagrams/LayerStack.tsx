"use client";

import { useId, useState } from "react";
import clsx from "clsx";
import { NETWORK_LAYERS, SCALING_LEGEND, type LayerScaling } from "@/lib/route1";
import { Overlay, svgId } from "./Overlay";

/**
 * SVG #2 — Where network energy actually sits. Five layers from end devices to
 * site infrastructure, each clickable for its energy characteristic. Layers
 * whose draw does not follow load carry a hatch pattern as well as a tone, so
 * the distinction survives without colour.
 */

const VW = 640;
const VH = 340;
const ROW_H = 54;
const GAP = 10;
const Y0 = 14;
const X_LEFT = 24;
const X_RIGHT = 616;

function Patterns({ id }: { id: string }) {
  return (
    <defs>
      <pattern id={`${id}-partial`} width="10" height="10" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
        <rect width="10" height="10" className="fill-paper" />
        <line x1="0" y1="0" x2="0" y2="10" className="stroke-warn/45" strokeWidth="2" />
      </pattern>
      <pattern id={`${id}-fixed`} width="8" height="8" patternUnits="userSpaceOnUse">
        <rect width="8" height="8" className="fill-mist" />
        <path d="M0 0L8 8M8 0L0 8" className="stroke-ink/30" strokeWidth="1.3" />
      </pattern>
    </defs>
  );
}

const fillFor = (id: string, scaling: LayerScaling) =>
  scaling === "follows" ? undefined : `url(#${id}-${scaling})`;

export function LayerStack() {
  const [selected, setSelected] = useState<string>(NETWORK_LAYERS[2].id);
  const rid = svgId(useId(), "layers");
  const active = NETWORK_LAYERS.find((l) => l.id === selected) ?? null;

  return (
    <div className="space-y-3">
      <p className="text-micro font-semibold uppercase tracking-wide text-ash">Where network energy actually sits</p>
      <div className="relative">
        <svg
          viewBox={`0 0 ${VW} ${VH}`}
          preserveAspectRatio="xMidYMid meet"
          role="img"
          aria-label="Five layers of a network, from end devices down to site infrastructure, marked by whether their power draw follows load."
          className="h-auto w-full"
        >
          <title>Where network energy actually sits</title>
          <Patterns id={rid} />
          {NETWORK_LAYERS.map((layer, i) => {
            const y = Y0 + i * (ROW_H + GAP);
            const on = selected === layer.id;
            return (
              <g
                key={layer.id}
                role="button"
                tabIndex={0}
                aria-pressed={on}
                aria-label={`${layer.label}: ${SCALING_LEGEND[layer.scaling]}`}
                className="cursor-pointer outline-none"
                onClick={() => setSelected(layer.id)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    setSelected(layer.id);
                  }
                }}
              >
                <rect
                  x={X_LEFT}
                  y={y}
                  width={X_RIGHT - X_LEFT}
                  height={ROW_H}
                  rx={12}
                  fill={fillFor(rid, layer.scaling)}
                  className={clsx(
                    layer.scaling === "follows" && "fill-accentSoft",
                    on ? "stroke-accent" : "stroke-line",
                  )}
                  strokeWidth={on ? 3 : 1.5}
                />
              </g>
            );
          })}
        </svg>
        {NETWORK_LAYERS.map((layer, i) => {
          const y = Y0 + i * (ROW_H + GAP) + ROW_H / 2;
          return (
            <span key={layer.id}>
              <Overlay x={X_LEFT + 18} y={y} vw={VW} vh={VH} align="start" className="rounded bg-paper/85 px-1.5 text-caption font-semibold text-ink">
                {layer.label}
              </Overlay>
              <Overlay
                x={X_RIGHT - 16}
                y={y}
                vw={VW}
                vh={VH}
                align="end"
                className="hidden rounded bg-paper/85 px-1.5 text-micro text-ash sm:block"
              >
                {SCALING_LEGEND[layer.scaling]}
              </Overlay>
            </span>
          );
        })}
      </div>

      <div className="flex flex-wrap gap-x-4 gap-y-1.5 text-micro text-ash">
        {(["follows", "partial", "fixed"] as LayerScaling[]).map((s) => (
          <span key={s} className="inline-flex items-center gap-1.5">
            <svg width="20" height="12" aria-hidden="true">
              <Patterns id={`${rid}-key-${s}`} />
              <rect
                width="20"
                height="12"
                rx="3"
                fill={fillFor(`${rid}-key-${s}`, s)}
                className={clsx(s === "follows" && "fill-accentSoft", "stroke-line")}
              />
            </svg>
            {SCALING_LEGEND[s]}
          </span>
        ))}
      </div>

      <div className="rounded-xl border border-accent/35 bg-accentSoft p-4" aria-live="polite">
        {active && (
          <p key={active.id} className="reveal-in text-caption text-ink">
            <span className="font-semibold">{active.label} — </span>
            <span className="text-ash">{SCALING_LEGEND[active.scaling]}. </span>
            {active.text}
          </p>
        )}
      </div>
      <p className="text-micro text-ash">Tap a layer, or focus it and press Enter, to read its energy characteristic.</p>
    </div>
  );
}
