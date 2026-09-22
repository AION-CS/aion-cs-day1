"use client";

import { useId } from "react";
import { QGEOM, QUADS, quadCenter } from "@/data/loyalty";
import type { Q } from "@/data/loyalty";
import { markerShape } from "@/lib/svgModels";
import type { LoyaltyMarker } from "@/lib/svgModels";

/**
 * The Dick & Basu loyalty quadrant as a live map. The marker is never placed
 * directly: it falls out of the participant's own readings of "relative
 * attitude" and "retention". An axis the file does not record stays open, drawn
 * as a hatched band across it. The map says nothing about that; the picture does.
 */
export function LoyaltyMap({ marker }: { marker: LoyaltyMarker }) {
  const uid = useId().replace(/:/g, "");
  const shape = markerShape(marker);
  const desc =
    shape.kind === "point"
      ? `Kessler sits in the ${QUADS[marker.quad as Q].label} quadrant.`
      : shape.kind === "none"
        ? "Nothing is placed yet: both axes are open."
        : shape.kind === "hband"
          ? "The repeat-behaviour axis is placed; the attitude axis is open, so a band spans both quadrants in that row."
          : "The attitude axis is placed; the repeat-behaviour axis is open, so a band spans both quadrants in that column.";
  return (
    <figure className="space-y-2">
      <svg viewBox="0 0 640 330" className="h-auto w-full" role="img" aria-labelledby={`${uid}-t ${uid}-d`}>
        <title id={`${uid}-t`}>Loyalty map for Kessler</title>
        <desc id={`${uid}-d`}>{desc}</desc>
        <defs>
          <pattern id={`${uid}-h`} width="7" height="7" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
            <rect width="7" height="7" fill="#FBF0D6" />
            <line x1="0" y1="0" x2="0" y2="7" stroke="#8A5A0B" strokeWidth="2.2" />
          </pattern>
        </defs>
        {(Object.keys(QUADS) as Q[]).map((q) => {
          const c = quadCenter(q);
          return (
            <g key={q}>
              <rect x={QGEOM.x0 + QUADS[q].x * QGEOM.w} y={QGEOM.y0 + QUADS[q].y * QGEOM.h} width={QGEOM.w} height={QGEOM.h} fill="#FFFEFA" stroke="#59606A" strokeWidth="1.3" />
              <text x={c.x} y={c.y - 40} textAnchor="middle" fontSize="15" fontWeight="700" fill="#1F2328">
                {QUADS[q].label}
              </text>
            </g>
          );
        })}
        <text x="320" y="318" textAnchor="middle" fontSize="12.5" fill="#59606A">
          Relative attitude: weak → strong
        </text>
        <text x="16" y="170" fontSize="12.5" fill="#59606A" transform="rotate(-90 16 170)" textAnchor="middle">
          Repeat behaviour: low → high
        </text>
        <text x="56" y="34" textAnchor="end" fontSize="11" fill="#59606A">high</text>
        <text x="56" y="286" textAnchor="end" fontSize="11" fill="#59606A">low</text>

        {shape.kind === "hband" && (
          <g key={`h-${shape.y}`} className="fade-in">
            <rect x={QGEOM.x0} y={shape.y} width={QGEOM.w * 2} height={QGEOM.h} fill={`url(#${uid}-h)`} fillOpacity="0.55" stroke="#8A5A0B" strokeWidth="2.4" strokeDasharray="7 5" />
            <text x={QGEOM.x0 + QGEOM.w} y={shape.y + QGEOM.h - 10} textAnchor="middle" fontSize="12.5" fontWeight="700" fill="#1F2328">
              Kessler: attitude axis not placed
            </text>
          </g>
        )}
        {shape.kind === "vband" && (
          <g key={`v-${shape.x}`} className="fade-in">
            <rect x={shape.x} y={QGEOM.y0} width={QGEOM.w} height={QGEOM.h * 2} fill={`url(#${uid}-h)`} fillOpacity="0.55" stroke="#8A5A0B" strokeWidth="2.4" strokeDasharray="7 5" />
            <text x={shape.x + QGEOM.w / 2} y={QGEOM.y0 + QGEOM.h * 2 - 10} textAnchor="middle" fontSize="12.5" fontWeight="700" fill="#1F2328">
              Kessler: behaviour axis not placed
            </text>
          </g>
        )}
        {shape.kind === "point" && (
          <g style={{ transform: `translate(${shape.x}px, ${shape.y}px)`, transition: "transform .5s ease-out" }}>
            <circle r="15" fill="#8A5A0B" stroke="#FFFEFA" strokeWidth="3" className="anim-pulse" />
            <text y="5" textAnchor="middle" fontSize="12" fontWeight="700" fill="#FFFEFA">
              K
            </text>
          </g>
        )}
        {shape.kind === "none" && (
          <text x="320" y="150" textAnchor="middle" fontSize="13" fill="#59606A">
            Nothing placed yet
          </text>
        )}
      </svg>
      <figcaption aria-live="polite" className="insight rounded-md bg-mist px-3 py-2 text-caption text-ink">
        <span className="smallcaps mr-1.5 text-ash">What this shows</span>
        Placed from your readings M2 and M3. {desc}
      </figcaption>
    </figure>
  );
}
