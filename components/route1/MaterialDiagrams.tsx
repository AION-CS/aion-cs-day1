"use client";

import { useMemo, useState } from "react";
import clsx from "clsx";
import { useProgress, useHydrated } from "@/lib/store";
import { Slider } from "@/components/ui/Slider";
import { Icon } from "@/components/icons/LineIcons";
import { RadarChart, type RadarAxis } from "@/components/ui/RadarChart";
import { DIMENSIONS, LENSES, R1 } from "@/lib/route1";

/**
 * The nine C1–C9 diagrams. Every one is a live widget with exactly one
 * micro-interaction — inline SVG plus CSS transitions, no charting or
 * animation library (CLAUDE.md §9). Sentences stay in HTML beside each SVG
 * rather than inside it, so they do not shrink with the viewBox at 380px.
 */

// ---------------------------------------------------------------------------
// C1 — Novelty vs impact: one fork, two outcomes
// ---------------------------------------------------------------------------

type Path = "novelty" | "impact";

const PATH_COPY: Record<Path, { end: string; verdict: string }> = {
  novelty: {
    end: "Net effect: flat, or worse than before.",
    verdict:
      "The efficiency gain made the thing cheaper and easier, so more of it got used. That is the rebound effect — the saving was spent, not banked.",
  },
  impact: {
    end: "Net effect: a real reduction.",
    verdict:
      "The saving was designed around the behaviour it would cause, so it survives contact with how people actually use the technology.",
  },
};

export function NoveltyVsImpactFork() {
  const [path, setPath] = useState<Path>("novelty");
  const copy = PATH_COPY[path];

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {(["novelty", "impact"] as Path[]).map((p) => (
          <button
            key={p}
            type="button"
            onClick={() => setPath(p)}
            aria-pressed={path === p}
            className={clsx(
              "rounded-full border px-3 py-1.5 text-caption font-semibold transition-colors duration-150",
              path === p ? "border-accent bg-accentSoft text-accent" : "border-line bg-paper text-ash hover:border-ash",
            )}
          >
            {p === "novelty" ? "Novelty-driven" : "Impact-driven"}
          </button>
        ))}
      </div>

      {/* Width is capped so the in-SVG labels do not scale up past body text. */}
      <svg
        viewBox="0 0 360 180"
        preserveAspectRatio="xMidYMid meet"
        className="mx-auto h-auto w-full max-w-lg"
        role="img"
        aria-label={`A new technology forking into a novelty-driven path and an impact-driven path. ${copy.end}`}
      >
        {/* Source node */}
        <rect x="8" y="70" width="98" height="40" rx="10" className="fill-paper stroke-ink" strokeWidth="1.5" />
        <text x="57" y="87" textAnchor="middle" className="fill-ink text-[12px] font-semibold">
          New
        </text>
        <text x="57" y="101" textAnchor="middle" className="fill-ink text-[12px] font-semibold">
          technology
        </text>

        {/* Upper branch — novelty */}
        <g className={path === "novelty" ? "opacity-100" : "opacity-25"} style={{ transition: "opacity .3s ease" }}>
          <path
            d="M110 90 L170 45 L330 45"
            fill="none"
            stroke="currentColor"
            className="text-danger"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <rect x="172" y="30" width="84" height="26" rx="8" className="fill-danger/10 stroke-danger" strokeWidth="1.2" />
          <text x="214" y="48" textAnchor="middle" className="fill-danger text-[11px] font-semibold">
            more usage
          </text>
          <circle cx="330" cy="45" r="7" className="fill-danger/15 stroke-danger" strokeWidth="1.5" />
        </g>

        {/* Lower branch — impact */}
        <g className={path === "impact" ? "opacity-100" : "opacity-25"} style={{ transition: "opacity .3s ease" }}>
          <path
            d="M110 90 L170 135 L330 135"
            fill="none"
            stroke="currentColor"
            className="text-accent"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <rect x="172" y="122" width="84" height="26" rx="8" className="fill-accentSoft stroke-accent" strokeWidth="1.2" />
          <text x="214" y="140" textAnchor="middle" className="fill-accent text-[11px] font-semibold">
            same usage
          </text>
          <circle cx="330" cy="135" r="7" className="fill-accentSoft stroke-accent" strokeWidth="1.5" />
        </g>

        {/* Branch labels */}
        <text x="116" y="22" className="fill-ash text-[11px] font-semibold uppercase tracking-wide">
          novelty-driven
        </text>
        <text x="116" y="172" className="fill-ash text-[11px] font-semibold uppercase tracking-wide">
          impact-driven
        </text>

        {/* The travelling dot — restarted by keying on the selected path */}
        <circle
          key={path}
          cx="110"
          cy="90"
          r="5"
          className={clsx(
            path === "novelty" ? "fill-danger anim-travel-up" : "fill-accent anim-travel-down",
          )}
        />
      </svg>

      <div
        className={clsx(
          "rounded-xl border p-3",
          path === "novelty" ? "border-danger/30 bg-danger/5" : "border-accent/30 bg-accentSoft",
        )}
      >
        <p className={clsx("text-caption font-semibold", path === "novelty" ? "text-danger" : "text-accent")}>
          {copy.end}
        </p>
        <p className="mt-1 text-caption text-ink">{copy.verdict}</p>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// C2 — AI's two-sided balance
// ---------------------------------------------------------------------------

const BENEFIT_ITEMS = ["Load optimisation", "Energy management", "Predictive maintenance", "Decision support"];
const COST_ITEMS = ["Training energy", "Continuous inference", "Data pipeline", "Infrastructure"];

const WORKLOAD_LABELS: Record<number, string> = {
  1: "Light",
  2: "Moderate",
  3: "Heavy",
  4: "Very heavy",
  5: "Continuous, at scale",
};

const WORKLOAD_VERDICT: Record<number, string> = {
  1: "The benefit clearly outweighs what the application consumes — this is the case AI is worth making.",
  2: "Benefit still leads, but the load is now large enough that it has to be named in the proposal.",
  3: "Roughly balanced. Neither side wins on assertion — only a measured net figure decides this one.",
  4: "The load is starting to outweigh what the application delivers. Ask what the benefit target actually is.",
  5: "Continuous inference at scale dominates. Without a measured, material benefit this is consumption with a story attached.",
};

export function AiBalanceScale() {
  const [workload, setWorkload] = useState(2);
  // Capped at 14° so the lower pan never swings through the ground line.
  const tilt = Math.max(-14, Math.min(14, (workload - 2) * 7));

  return (
    <div className="space-y-4">
      <svg
        viewBox="0 0 320 150"
        preserveAspectRatio="xMidYMid meet"
        className="mx-auto h-auto w-full max-w-sm"
        role="img"
        aria-label={`A balance weighing AI benefit against resource cost. Workload ${WORKLOAD_LABELS[workload]}.`}
      >
        {/* Stand: a fulcrum rising to the pivot, on a ground line */}
        <polygon points="140,128 180,128 160,46" className="fill-mist stroke-ash" strokeWidth="1.2" />
        <line x1="112" y1="128" x2="208" y2="128" stroke="currentColor" className="text-ash" strokeWidth="2.5" strokeLinecap="round" />
        <g style={{ transform: `rotate(${tilt}deg)`, transformOrigin: "160px 44px", transition: "transform .35s ease" }}>
          <line x1="50" y1="44" x2="270" y2="44" stroke="currentColor" className="text-ink" strokeWidth="4" strokeLinecap="round" />
          <line x1="50" y1="44" x2="50" y2="70" stroke="currentColor" className="text-accent" strokeWidth="1.5" />
          <line x1="270" y1="44" x2="270" y2="70" stroke="currentColor" className="text-danger" strokeWidth="1.5" />
          <rect x="10" y="70" width="80" height="28" rx="8" className="fill-accentSoft stroke-accent" strokeWidth="1.5" />
          <text x="50" y="89" textAnchor="middle" className="fill-accent text-[12px] font-semibold">
            Benefit
          </text>
          <rect x="222" y="70" width="96" height="28" rx="8" className="fill-danger/10 stroke-danger" strokeWidth="1.5" />
          <text x="270" y="89" textAnchor="middle" className="fill-danger text-[12px] font-semibold">
            Resource cost
          </text>
        </g>
      </svg>

      <Slider
        id="c2-workload"
        label="How heavy is the AI workload?"
        instruction="Drag to weigh a light, occasional model against one running inference continuously at scale."
        value={workload}
        onChange={setWorkload}
        min={1}
        max={5}
        lowLabel="Light"
        highLabel="Continuous, at scale"
        valueLabels={WORKLOAD_LABELS}
      />

      <div className="rounded-xl border border-line bg-paper p-3">
        <p className="text-caption text-ink">{WORKLOAD_VERDICT[workload]}</p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <div className="rounded-xl border border-accent/30 bg-accentSoft/50 p-3">
          <p className="text-micro font-semibold uppercase tracking-wide text-accent">On the benefit side</p>
          <ul className="mt-1.5 space-y-0.5">
            {BENEFIT_ITEMS.map((b) => (
              <li key={b} className="text-caption text-ink">
                {b}
              </li>
            ))}
          </ul>
        </div>
        <div className="rounded-xl border border-danger/30 bg-danger/5 p-3">
          <p className="text-micro font-semibold uppercase tracking-wide text-danger">On the resource side</p>
          <ul className="mt-1.5 space-y-0.5">
            {COST_ITEMS.map((c) => (
              <li key={c} className="text-caption text-ink">
                {c}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <p className="text-micro text-ash">
        Scale check — data-centre electricity: about 460 TWh in 2022, potentially approaching 1,000 TWh by 2026 (IEA).
      </p>
    </div>
  );
}

// ---------------------------------------------------------------------------
// C3 — Linear chain vs the R-ladder
// ---------------------------------------------------------------------------

type Rung = { id: string; label: string; example: string };

const R_LADDER: Rung[] = [
  { id: "refuse", label: "Refuse / rethink", example: "Do we need the device at all, or can the need be met another way?" },
  { id: "reduce", label: "Reduce", example: "Fewer devices, less capacity, a lower specification for the same job." },
  { id: "reuse", label: "Reuse", example: "The same device used again by someone else, unchanged." },
  { id: "repair", label: "Repair", example: "Fix the fault and keep the device in service rather than replacing it." },
  { id: "refurbish", label: "Refurbish", example: "Restore a used device to as-new condition for resale or redeployment." },
  { id: "remanufacture", label: "Remanufacture", example: "Rebuild from recovered components back to original specification." },
  { id: "recycle", label: "Recycle", example: "Recover the materials once nothing else is possible — the last resort, not the goal." },
];

export function CircularVsLinear() {
  const [openId, setOpenId] = useState<string>("reuse");
  const open = R_LADDER.find((r) => r.id === openId)!;
  const rank = R_LADDER.findIndex((r) => r.id === openId) + 1;

  return (
    <div className="space-y-4">
      <svg
        viewBox="0 0 360 170"
        preserveAspectRatio="xMidYMid meet"
        className="mx-auto h-auto w-full max-w-xl"
        role="img"
        aria-label="A linear buy-use-dispose chain beside a circular loop that returns devices to use."
      >
        {/* Linear model */}
        <text x="4" y="14" className="fill-ash text-[11px] font-semibold uppercase tracking-wide">
          Linear
        </text>
        {["Buy", "Use", "Dispose"].map((label, i) => (
          <g key={label}>
            <rect
              x={4 + i * 64}
              y={24}
              width="54"
              height="28"
              rx="7"
              className={i === 2 ? "fill-danger/10 stroke-danger" : "fill-paper stroke-line"}
              strokeWidth="1.4"
            />
            <text
              x={31 + i * 64}
              y={43}
              textAnchor="middle"
              className={clsx("text-[12px] font-semibold", i === 2 ? "fill-danger" : "fill-ink")}
            >
              {label}
            </text>
          </g>
        ))}
        <path d="M58 38 H64 M122 38 H128" stroke="currentColor" className="text-ash" strokeWidth="1.4" />
        <path d="M186 38 h18" stroke="currentColor" className="text-danger" strokeWidth="1.4" strokeDasharray="3 3" />
        <text x="208" y="43" className="fill-danger text-[12px] font-semibold">
          waste
        </text>

        {/* Divider */}
        <line x1="4" y1="66" x2="356" y2="66" stroke="currentColor" className="text-line" strokeWidth="1" />

        {/* Circular model */}
        <text x="4" y="84" className="fill-accent text-[11px] font-semibold uppercase tracking-wide">
          Circular — the R-ladder
        </text>
        <g>
          <circle cx="66" cy="126" r="32" fill="none" stroke="currentColor" className="text-accent" strokeWidth="2" />
          <path d="M66 94 l-7 -7 M66 94 l7 -7" stroke="currentColor" className="text-accent" strokeWidth="2" strokeLinecap="round" />
          <text x="66" y="124" textAnchor="middle" className="fill-accent text-[13px] font-semibold">
            R{rank}
          </text>
          <text x="66" y="139" textAnchor="middle" className="fill-ash text-[12px]">
            of 7
          </text>
        </g>

        {/* Ladder rungs — rung 1 highest leverage, rung 7 last resort. The
            selected rung is named in HTML below, not here, so a long label
            like "Remanufacture" can never run past the viewBox. */}
        {R_LADDER.map((r, i) => {
          const y = 94 + i * 11;
          const on = r.id === openId;
          return (
            <rect
              key={r.id}
              x={116}
              y={y}
              width={on ? 236 : 210 - i * 12}
              height="8"
              rx="4"
              className={on ? "fill-accent" : "fill-line"}
              style={{ transition: "width .25s ease, fill .25s ease" }}
            />
          );
        })}
      </svg>

      <div>
        <p className="text-micro font-semibold uppercase tracking-wide text-ash">
          Tap a rung — rung 1 is the highest leverage, rung 7 the last resort
        </p>
        <div className="mt-1.5 flex flex-wrap gap-1.5">
          {R_LADDER.map((r, i) => {
            const on = r.id === openId;
            return (
              <button
                key={r.id}
                type="button"
                onClick={() => setOpenId(r.id)}
                aria-pressed={on}
                className={clsx(
                  "rounded-full border px-2.5 py-1 text-micro font-semibold transition-colors duration-150",
                  on ? "border-accent bg-accentSoft text-accent" : "border-line bg-paper text-ash hover:border-ash",
                )}
              >
                {i + 1}. {r.label}
              </button>
            );
          })}
        </div>
      </div>

      <div className="reveal-in rounded-xl border border-accent/30 bg-accentSoft p-3" key={openId}>
        <p className="text-caption text-ink">
          <span className="font-semibold text-accent">{open.label} — </span>
          {open.example}
        </p>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// C4 — The seven lenses, as a wheel that fills in as each is opened
// ---------------------------------------------------------------------------

const WHEEL = { cx: 90, cy: 90, rOuter: 74, rInner: 42, gapDeg: 3 };

/** One donut segment, computed rather than hand-drawn so seven stay even. */
function segmentPath(index: number, total: number): string {
  const { cx, cy, rOuter, rInner, gapDeg } = WHEEL;
  const step = 360 / total;
  const start = index * step - 90 + gapDeg / 2;
  const end = (index + 1) * step - 90 - gapDeg / 2;
  const rad = (d: number) => (d * Math.PI) / 180;
  const p = (r: number, d: number) => `${cx + r * Math.cos(rad(d))} ${cy + r * Math.sin(rad(d))}`;
  const large = end - start > 180 ? 1 : 0;
  return [
    `M ${p(rOuter, start)}`,
    `A ${rOuter} ${rOuter} 0 ${large} 1 ${p(rOuter, end)}`,
    `L ${p(rInner, end)}`,
    `A ${rInner} ${rInner} 0 ${large} 0 ${p(rInner, start)}`,
    "Z",
  ].join(" ");
}

export function LensWheel() {
  const hydrated = useHydrated();
  const seen = useProgress((s) => s.seen);
  const markSeen = useProgress((s) => s.markSeen);
  const [openId, setOpenId] = useState<string | null>(null);

  const seenIds = hydrated ? (seen[R1.lensesSeen] ?? []) : [];
  const open = LENSES.find((l) => l.id === openId) ?? null;

  const select = (id: string) => {
    setOpenId((cur) => (cur === id ? null : id));
    markSeen(R1.lensesSeen, id);
  };

  return (
    <div className="space-y-4">
      <div className="grid items-center gap-4 sm:grid-cols-[180px_minmax(0,1fr)]">
        <svg
          viewBox="0 0 180 180"
          preserveAspectRatio="xMidYMid meet"
          className="mx-auto h-auto w-40 sm:w-full"
          role="img"
          aria-label={`Seven assessment lenses; ${seenIds.length} of 7 opened.`}
        >
          {LENSES.map((lens, i) => {
            const isSeen = seenIds.includes(lens.id);
            const isOpen = openId === lens.id;
            return (
              <path
                key={lens.id}
                d={segmentPath(i, LENSES.length)}
                className={clsx(
                  "cursor-pointer",
                  isOpen ? "fill-accent" : isSeen ? "fill-accentSoft stroke-accent" : "fill-mist stroke-line",
                )}
                strokeWidth="1.2"
                style={{ transition: "fill .25s ease" }}
                onClick={() => select(lens.id)}
              />
            );
          })}
          <text x="90" y="86" textAnchor="middle" className="fill-ink text-[15px] font-semibold">
            {seenIds.length}/7
          </text>
          <text x="90" y="101" textAnchor="middle" className="fill-ash text-[9px] uppercase tracking-wide">
            lenses opened
          </text>
        </svg>

        <div className="grid grid-cols-2 gap-1.5 sm:grid-cols-2">
          {LENSES.map((lens) => {
            const isSeen = seenIds.includes(lens.id);
            const isOpen = openId === lens.id;
            return (
              <button
                key={lens.id}
                type="button"
                onClick={() => select(lens.id)}
                aria-pressed={isOpen}
                className={clsx(
                  "flex items-center gap-1.5 rounded-lg border px-2 py-1.5 text-left transition-colors duration-150",
                  isOpen
                    ? "border-accent bg-accent text-paper"
                    : isSeen
                      ? "border-accent/40 bg-accentSoft text-accent"
                      : "border-line bg-paper text-ash hover:border-ash",
                )}
              >
                <Icon name={lens.icon} className="h-3.5 w-3.5 shrink-0" />
                <span className="min-w-0 truncate text-micro font-semibold">{lens.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {open ? (
        <div key={open.id} className="reveal-in rounded-xl border border-accent/30 bg-accentSoft p-3">
          <p className="text-caption text-ink">
            <span className="font-semibold text-accent">{open.name} — </span>
            {open.definition}
          </p>
        </div>
      ) : (
        <p className="rounded-xl border border-dashed border-line bg-paper p-3 text-caption text-ash">
          Tap a lens to read what it covers.
        </p>
      )}

      {hydrated && seenIds.length < LENSES.length && (
        <p className="text-micro text-ash">
          Suggested: open all seven once before starting the task — you have {seenIds.length} of 7. You can start
          regardless.
        </p>
      )}
      {hydrated && seenIds.length === LENSES.length && (
        <p className="reveal-in text-micro font-semibold text-accent">
          All seven opened — you have the vocabulary the task uses.
        </p>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// C5 — Attractive now vs viable long-term
// ---------------------------------------------------------------------------

const CLAIM_CARDS = [
  { id: "ai", front: "“It is AI-powered.”", back: "What does it consume to deliver that, and what does it measurably reduce?" },
  { id: "everyone", front: "“Everyone in the sector is doing it.”", back: "Who has measured a net effect, and under what conditions did it hold?" },
  { id: "report", front: "“It will look excellent in the annual report.”", back: "What survives after the reporting cycle ends and attention moves on?" },
  { id: "quarter", front: "“We could start next quarter.”", back: "Could we still be running it in three years — do we have the people and the process?" },
];

export function AttractiveVsViable() {
  const [flipped, setFlipped] = useState<string[]>([]);
  const toggle = (id: string) =>
    setFlipped((cur) => (cur.includes(id) ? cur.filter((x) => x !== id) : [...cur, id]));

  return (
    <div className="space-y-4">
      <svg
        viewBox="0 0 340 150"
        preserveAspectRatio="xMidYMid meet"
        className="mx-auto h-auto w-full max-w-xl"
        role="img"
        aria-label="A spiking, falling line labelled attractive now beside a slowly rising, rooted line labelled viable long-term."
      >
        {/* Attractive now — a spike that collapses */}
        <rect x="4" y="8" width="156" height="134" rx="12" className="fill-paper stroke-line" strokeWidth="1.4" />
        <text x="82" y="28" textAnchor="middle" className="fill-danger text-[12px] font-semibold uppercase tracking-wide">
          Attractive now
        </text>
        <path
          d="M20 116 L44 104 L62 52 L76 98 L96 34 L114 106 L144 118"
          fill="none"
          stroke="currentColor"
          className="text-danger"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <line x1="20" y1="126" x2="144" y2="126" stroke="currentColor" className="text-line" strokeWidth="1.2" />
        <text x="82" y="138" textAnchor="middle" className="fill-ash text-[11px]">
          bright, spiky, short-lived
        </text>

        {/* The pivot between them */}
        <g className="anim-seesaw">
          <line x1="168" y1="64" x2="176" y2="64" stroke="currentColor" className="text-ash" strokeWidth="2" strokeLinecap="round" />
          <polygon points="164,72 180,72 172,82" className="fill-ash" />
        </g>

        {/* Viable long-term — steady rise, with roots */}
        <rect x="180" y="8" width="156" height="134" rx="12" className="fill-paper stroke-accent/40" strokeWidth="1.4" />
        <text x="258" y="28" textAnchor="middle" className="fill-accent text-[12px] font-semibold uppercase tracking-wide">
          Viable long-term
        </text>
        <path
          d="M196 102 C 224 98, 244 82, 262 68 S 300 44, 320 38"
          fill="none"
          stroke="currentColor"
          className="text-accent"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <line x1="196" y1="110" x2="320" y2="110" stroke="currentColor" className="text-line" strokeWidth="1.2" />
        <path
          d="M214 110 v8 M214 118 l-7 7 M214 118 l7 7 M258 110 v10 M258 120 l-8 7 M258 120 l8 7 M302 110 v8 M302 118 l-7 7 M302 118 l7 7"
          fill="none"
          stroke="currentColor"
          className="text-accent/50"
          strokeWidth="1.2"
          strokeLinecap="round"
        />
        <text x="258" y="138" textAnchor="middle" className="fill-ash text-[11px]">
          steady, rooted, still there
        </text>
      </svg>

      <div>
        <p className="text-micro font-semibold uppercase tracking-wide text-ash">
          Tap a claim to turn it into the question that tests it
        </p>
        <div className="mt-2 grid gap-2 sm:grid-cols-2">
          {CLAIM_CARDS.map((c) => {
            const isFlipped = flipped.includes(c.id);
            return (
              <button
                key={c.id}
                type="button"
                onClick={() => toggle(c.id)}
                aria-pressed={isFlipped}
                className="flip-card h-24 text-left"
              >
                <div className={clsx("flip-card-inner h-full w-full", isFlipped && "is-flipped")}>
                  <div className="flip-card-face flex h-full w-full items-center rounded-xl border border-line bg-paper p-3">
                    <p className="text-caption font-semibold italic text-ink">{c.front}</p>
                  </div>
                  <div className="flip-card-face flip-card-face-back flex h-full w-full items-center rounded-xl border border-accent/40 bg-accentSoft p-3">
                    <p className="text-caption text-ink">{c.back}</p>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// C6 — Deciding under uncertainty: a fork, reusing C1's travelling-dot rig
// ---------------------------------------------------------------------------

type DecisionMode = "wait" | "decide";

const DECISION_COPY: Record<DecisionMode, { end: string; verdict: string }> = {
  wait: {
    end: "Stalled — the risk just moves downstream.",
    verdict:
      "Waiting for perfect data feels safe, but it does not remove the uncertainty — it hands the same incomplete picture to whoever decides later, with less time left to act on it.",
  },
  decide: {
    end: "Moving — and learning from a real commitment.",
    verdict:
      "Deciding from the seven dimensions in C7, even with gaps, keeps things moving and gives you real information to sharpen the next call.",
  },
};

export function UncertaintyFork() {
  const [mode, setMode] = useState<DecisionMode>("wait");
  const copy = DECISION_COPY[mode];

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {(["wait", "decide"] as DecisionMode[]).map((m) => (
          <button
            key={m}
            type="button"
            onClick={() => setMode(m)}
            aria-pressed={mode === m}
            className={clsx(
              "rounded-full border px-3 py-1.5 text-caption font-semibold transition-colors duration-150",
              mode === m ? "border-accent bg-accentSoft text-accent" : "border-line bg-paper text-ash hover:border-ash",
            )}
          >
            {m === "wait" ? "Wait for perfect data" : "Decide with logic"}
          </button>
        ))}
      </div>

      <svg
        viewBox="0 0 360 180"
        preserveAspectRatio="xMidYMid meet"
        className="mx-auto h-auto w-full max-w-lg"
        role="img"
        aria-label={`A decision point forking into waiting for perfect data and deciding with logic. ${copy.end}`}
      >
        <rect x="8" y="70" width="98" height="40" rx="10" className="fill-paper stroke-ink" strokeWidth="1.5" />
        <text x="57" y="87" textAnchor="middle" className="fill-ink text-[12px] font-semibold">
          Decision
        </text>
        <text x="57" y="101" textAnchor="middle" className="fill-ink text-[12px] font-semibold">
          point
        </text>

        {/* Upper branch — wait, fading into fog */}
        <g className={mode === "wait" ? "opacity-100" : "opacity-25"} style={{ transition: "opacity .3s ease" }}>
          <path
            d="M110 90 L170 45 L330 45"
            fill="none"
            stroke="currentColor"
            className="text-ash"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* Fog — overlapping low-opacity circles over the far half of the branch */}
          <circle cx="255" cy="45" r="22" className="fill-ash/15" />
          <circle cx="285" cy="40" r="26" className="fill-ash/15" />
          <circle cx="310" cy="48" r="20" className="fill-ash/20" />
          <circle cx="330" cy="45" r="9" fill="none" stroke="currentColor" className="text-ash" strokeWidth="1.5" strokeDasharray="3 3" />
          <text x="330" y="49" textAnchor="middle" className="fill-ash text-[11px] font-semibold">
            ?
          </text>
        </g>

        {/* Lower branch — decide, clear all the way */}
        <g className={mode === "decide" ? "opacity-100" : "opacity-25"} style={{ transition: "opacity .3s ease" }}>
          <path
            d="M110 90 L170 135 L330 135"
            fill="none"
            stroke="currentColor"
            className="text-accent"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <circle cx="330" cy="135" r="9" className="fill-accentSoft stroke-accent" strokeWidth="1.5" />
          <path d="M326 135 l3 3 l6 -7" fill="none" stroke="currentColor" className="text-accent" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
        </g>

        <text x="118" y="22" className="fill-ash text-[11px] font-semibold uppercase tracking-wide">
          wait for perfect data
        </text>
        <text x="118" y="172" className="fill-ash text-[11px] font-semibold uppercase tracking-wide">
          decide with logic
        </text>

        <circle
          key={mode}
          cx="110"
          cy="90"
          r="5"
          className={clsx(mode === "wait" ? "fill-ash anim-travel-up" : "fill-accent anim-travel-down")}
        />
      </svg>

      <div
        className={clsx(
          "rounded-xl border p-3",
          mode === "wait" ? "border-line bg-mist" : "border-accent/30 bg-accentSoft",
        )}
      >
        <p className={clsx("text-caption font-semibold", mode === "wait" ? "text-ash" : "text-accent")}>{copy.end}</p>
        <p className="mt-1 text-caption text-ink">{copy.verdict}</p>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// C7 — The seven assessment dimensions: a radar preview, strong vs weak
// ---------------------------------------------------------------------------

const DIMENSION_AXES: RadarAxis[] = DIMENSIONS.map((d) => ({ key: d.id, label: d.short, full: d.name }));

// Same 1–3 (Low/Medium/High) scale Task 2's real radar uses, so this preview
// is not just illustrative — it is the exact instrument, pre-filled. Six axes
// read "bigger is stronger"; Risk alone reads in reverse (bigger = more could
// go wrong), which is why the weak profile spikes there while everything else
// on it is small.
const DEMO_PROFILES: Record<"weak" | "strong", Record<string, number>> = {
  weak: { leverage: 1, innovation: 3, sustainability: 1, feasibility: 3, risk: 3, longTerm: 1, controllability: 1 },
  strong: { leverage: 3, innovation: 2, sustainability: 3, feasibility: 2, risk: 1, longTerm: 3, controllability: 3 },
};

export function DimensionsRadarPreview() {
  const hydrated = useHydrated();
  const seen = useProgress((s) => s.seen);
  const markSeen = useProgress((s) => s.markSeen);
  const [profile, setProfile] = useState<"weak" | "strong">("weak");
  const [openId, setOpenId] = useState<string | null>(null);
  const open = DIMENSIONS.find((d) => d.id === openId) ?? null;

  const seenIds = hydrated ? (seen[R1.dimensionsSeen] ?? []) : [];

  const select = (id: string) => {
    setOpenId((cur) => (cur === id ? null : id));
    markSeen(R1.dimensionsSeen, id);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {(["weak", "strong"] as const).map((p) => (
          <button
            key={p}
            type="button"
            onClick={() => setProfile(p)}
            aria-pressed={profile === p}
            className={clsx(
              "rounded-full border px-3 py-1.5 text-caption font-semibold capitalize transition-colors duration-150",
              profile === p ? "border-accent bg-accentSoft text-accent" : "border-line bg-paper text-ash hover:border-ash",
            )}
          >
            {p} profile
          </button>
        ))}
      </div>

      <RadarChart
        axes={DIMENSION_AXES}
        series={[{ id: "demo", label: `${profile} profile`, values: DEMO_PROFILES[profile], tone: "real" }]}
        max={4}
        animate
        title={`A demo ${profile} profile across the seven assessment dimensions`}
        className="max-w-sm"
      />

      <div>
        <p className="text-micro font-semibold uppercase tracking-wide text-ash">
          Tap a dimension to read its definition — {seenIds.length} of 7 opened
        </p>
        <div className="mt-1.5 flex flex-wrap gap-1.5">
          {DIMENSIONS.map((d) => {
            const on = openId === d.id;
            const wasSeen = seenIds.includes(d.id);
            return (
              <button
                key={d.id}
                type="button"
                onClick={() => select(d.id)}
                aria-pressed={on}
                className={clsx(
                  "rounded-full border px-2.5 py-1 text-micro font-semibold transition-colors duration-150",
                  on
                    ? "border-accent bg-accent text-paper"
                    : wasSeen
                      ? "border-accent/40 bg-accentSoft text-accent"
                      : "border-line text-ash hover:border-ash",
                )}
              >
                {d.name}
              </button>
            );
          })}
        </div>
      </div>

      {open ? (
        <div key={open.id} className="reveal-in rounded-xl border border-accent/30 bg-accentSoft p-3">
          <p className="text-caption text-ink">
            <span className="font-semibold text-accent">{open.name} — </span>
            {open.definition}
          </p>
        </div>
      ) : (
        <p className="rounded-xl border border-dashed border-line bg-paper p-3 text-caption text-ash">
          This is the exact scoring vocabulary Task 2's radar uses — open a few before you start.
        </p>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// C8 — Enabler vs point-solution: one hub, how many decisions it touches
// ---------------------------------------------------------------------------

type LeverageMode = "point" | "enabler";

const DOWNSTREAM_NODES = [
  { x: 260, y: 30 },
  { x: 260, y: 78 },
  { x: 260, y: 126 },
  { x: 260, y: 174 },
];

export function EnablerVsPointSolution() {
  const [mode, setMode] = useState<LeverageMode>("point");
  const touched = mode === "enabler" ? 4 : 1;

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {(["point", "enabler"] as LeverageMode[]).map((m) => (
          <button
            key={m}
            type="button"
            onClick={() => setMode(m)}
            aria-pressed={mode === m}
            className={clsx(
              "rounded-full border px-3 py-1.5 text-caption font-semibold transition-colors duration-150",
              mode === m ? "border-accent bg-accentSoft text-accent" : "border-line bg-paper text-ash hover:border-ash",
            )}
          >
            {m === "point" ? "Point solution" : "Enabler"}
          </button>
        ))}
      </div>

      <svg
        viewBox="0 0 340 204"
        preserveAspectRatio="xMidYMid meet"
        className="mx-auto h-auto w-full max-w-lg"
        role="img"
        aria-label={`A candidate measure touching ${touched} downstream decision${touched === 1 ? "" : "s"}.`}
      >
        <rect x="8" y="82" width="110" height="40" rx="10" className="fill-paper stroke-ink" strokeWidth="1.5" />
        <text x="63" y="99" textAnchor="middle" className="fill-ink text-[11px] font-semibold">
          Candidate
        </text>
        <text x="63" y="112" textAnchor="middle" className="fill-ink text-[11px] font-semibold">
          measure
        </text>

        {DOWNSTREAM_NODES.map((node, i) => {
          const active = i < touched;
          return (
            <g key={i} className={active ? undefined : "opacity-20"} style={{ transition: "opacity .25s ease" }}>
              <path
                d={`M118 102 L190 ${node.y + 12} L${node.x} ${node.y + 12}`}
                fill="none"
                stroke="currentColor"
                className={active ? "text-accent" : "text-ash"}
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <rect
                key={mode + i}
                x={node.x}
                y={node.y}
                width="76"
                height="24"
                rx="7"
                className={clsx(active && "anim-pop", active ? "fill-accentSoft stroke-accent" : "fill-mist stroke-line")}
                strokeWidth="1.4"
              />
              <text x={node.x + 38} y={node.y + 16} textAnchor="middle" className={clsx("text-[9px] font-semibold", active ? "fill-accent" : "fill-ash")}>
                Future decision
              </text>
            </g>
          );
        })}
      </svg>

      <div className="rounded-xl border border-line bg-paper p-3">
        <p className="text-caption text-ink">
          <span className="font-semibold text-ink">
            Touches {touched} downstream decision{touched === 1 ? "" : "s"}.
          </span>{" "}
          {mode === "point"
            ? "A point solution answers this one case. The next similar decision starts from zero again."
            : "An enabler is inherited automatically by everything that comes after it — every one of these future decisions now runs through the same logic."}
        </p>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// C9 — Attractive-but-weak: a trophy that cracks on the back
// ---------------------------------------------------------------------------

const WEAKNESS_ITEMS = [
  { label: "Symbolic politics", detail: "A visible signal with little real effect behind it." },
  { label: "Misinvestment", detail: "Money and attention committed before the case is proven." },
  { label: "Rebound", detail: "The efficiency gain gets eaten by more usage — C1's trap, at portfolio scale." },
];

export function AttractiveButWeakTrophy() {
  const [flipped, setFlipped] = useState(false);

  return (
    <div className="space-y-4">
      <button
        type="button"
        onClick={() => setFlipped((v) => !v)}
        aria-pressed={flipped}
        className="flip-card mx-auto block h-48 w-full max-w-sm text-left"
      >
        <div className={clsx("flip-card-inner h-full w-full", flipped && "is-flipped")}>
          <div className="flip-card-face flex h-full w-full flex-col items-center justify-center gap-3 rounded-2xl border border-line bg-paper p-4">
            <Icon name="trophy" className="h-14 w-14 text-warn" />
            <p className="text-caption font-semibold text-ink">&ldquo;Looks like real progress.&rdquo;</p>
            <p className="text-micro text-ash">Tap to see what the front doesn&rsquo;t show</p>
          </div>
          <div className="flip-card-face flip-card-face-back h-full w-full rounded-2xl border border-warn/40 bg-warn/5 p-4">
            <p className="text-micro font-semibold uppercase tracking-wide text-warn">What might actually be there</p>
            <ul className="mt-2 space-y-1.5">
              {WEAKNESS_ITEMS.map((w) => (
                <li key={w.label} className="text-caption text-ink">
                  <span className="font-semibold text-warn">{w.label} — </span>
                  {w.detail}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </button>
      <p className="text-center text-micro text-ash">
        A defensible pick names, in advance, which of these three is the live risk — not just that risk exists.
      </p>
    </div>
  );
}
