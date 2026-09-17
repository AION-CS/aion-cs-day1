"use client";

import { useMemo, useState } from "react";
import clsx from "clsx";
import { Slider } from "@/components/ui/Slider";
import { Icon } from "@/components/icons/LineIcons";
import type { IconKey } from "@/lib/routes";

/**
 * The four S1–S4 diagrams. Every one is a live widget, not a static
 * illustration — CLAUDE.md's real-time-dashboard pattern applied to a
 * business case, a ranking, an adoption gap, and a regulatory map in turn.
 * Inline SVG and CSS transitions only, no charting or animation library.
 */

// ---------------------------------------------------------------------------
// S1 — Cost–benefit balance + ROI / payback calculator
// ---------------------------------------------------------------------------

type CostItem = { id: string; label: string };
const COST_ITEMS: CostItem[] = [
  { id: "investment", label: "Investment costs" },
  { id: "operating", label: "Operating costs" },
  { id: "conversion", label: "Conversion / migration costs" },
  { id: "training", label: "Training effort" },
  { id: "monitoring", label: "Monitoring & management costs" },
];

type BenefitItem = { id: string; label: string };
const BENEFIT_ITEMS: BenefitItem[] = [
  { id: "energy", label: "Energy savings" },
  { id: "operating", label: "Lower operating costs" },
  { id: "service", label: "Longer service life" },
  { id: "disposal", label: "Lower disposal costs" },
  { id: "risk", label: "Risk reduction" },
  { id: "reputation", label: "Reputational gains" },
  { id: "compliance", label: "Better compliance capability" },
];

export function CostBenefitScale() {
  const [costsOn, setCostsOn] = useState<string[]>(["investment", "operating"]);
  const [benefitsOn, setBenefitsOn] = useState<string[]>(["energy"]);
  const [investment, setInvestment] = useState<string>("18000");
  const [annualSavings, setAnnualSavings] = useState<string>("6000");
  const [lifespan, setLifespan] = useState<string>("5");

  const toggle = (list: string[], set: (v: string[]) => void, id: string) =>
    set(list.includes(id) ? list.filter((x) => x !== id) : [...list, id]);

  const tilt = useMemo(() => {
    const raw = (benefitsOn.length - costsOn.length) * 4.5;
    return Math.max(-22, Math.min(22, raw));
  }, [costsOn.length, benefitsOn.length]);

  const inv = Number(investment) || 0;
  const sav = Number(annualSavings) || 0;
  const yrs = Number(lifespan) || 0;
  const roiPct = inv > 0 ? ((sav * yrs - inv) / inv) * 100 : null;
  const payback = sav > 0 ? inv / sav : null;

  return (
    <div className="space-y-5">
      {/* The scale */}
      <div className="flex flex-col items-center py-2">
        <svg viewBox="0 0 320 140" className="h-32 w-full max-w-sm" role="img" aria-label="Cost–benefit balance">
          <line x1="160" y1="20" x2="160" y2="118" stroke="currentColor" className="text-ash" strokeWidth="4" strokeLinecap="round" />
          <polygon points="140,118 180,118 160,132" className="fill-ash" />
          <g style={{ transform: `rotate(${tilt}deg)`, transformOrigin: "160px 24px", transition: "transform 0.35s ease" }}>
            <line x1="40" y1="24" x2="280" y2="24" stroke="currentColor" className="text-ink" strokeWidth="4" strokeLinecap="round" />
            <line x1="40" y1="24" x2="40" y2="52" stroke="currentColor" className="text-danger" strokeWidth="2" />
            <line x1="280" y1="24" x2="280" y2="52" stroke="currentColor" className="text-accent" strokeWidth="2" />
            <circle cx="40" cy="58" r="16" className="fill-danger/15" stroke="currentColor" strokeWidth="2" style={{ color: "#B23B3B" }} />
            <text x="40" y="62" textAnchor="middle" className="fill-danger text-[10px] font-semibold">
              {costsOn.length}
            </text>
            <circle cx="280" cy="58" r="16" className="fill-accentSoft" stroke="currentColor" strokeWidth="2" style={{ color: "#0E7A5A" }} />
            <text x="280" y="62" textAnchor="middle" className="fill-accent text-[10px] font-semibold">
              {benefitsOn.length}
            </text>
          </g>
        </svg>
        <p className="text-micro text-ash">Left pan: cost types checked · Right pan: benefit types checked</p>
      </div>

      {/* Toggleable chips */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <p className="text-micro font-semibold uppercase tracking-wide text-ash">Costs</p>
          <div className="mt-1.5 flex flex-wrap gap-1.5">
            {COST_ITEMS.map((c) => {
              const on = costsOn.includes(c.id);
              return (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => toggle(costsOn, setCostsOn, c.id)}
                  aria-pressed={on}
                  className={clsx(
                    "rounded-full border px-2.5 py-1 text-micro font-semibold transition-colors duration-150",
                    on ? "border-danger/50 bg-danger/10 text-danger" : "border-line text-ash hover:border-ash",
                  )}
                >
                  {c.label}
                </button>
              );
            })}
          </div>
        </div>
        <div>
          <p className="text-micro font-semibold uppercase tracking-wide text-ash">Benefits</p>
          <div className="mt-1.5 flex flex-wrap gap-1.5">
            {BENEFIT_ITEMS.map((b) => {
              const on = benefitsOn.includes(b.id);
              return (
                <button
                  key={b.id}
                  type="button"
                  onClick={() => toggle(benefitsOn, setBenefitsOn, b.id)}
                  aria-pressed={on}
                  className={clsx(
                    "rounded-full border px-2.5 py-1 text-micro font-semibold transition-colors duration-150",
                    on ? "border-accent bg-accentSoft text-accent" : "border-line text-ash hover:border-ash",
                  )}
                >
                  {b.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* ROI calculator */}
      <div className="rounded-xl border border-line bg-canvas p-4">
        <p className="text-micro font-semibold uppercase tracking-wide text-ash">
          ROI / payback calculator — a learning tool, nothing here is submitted
        </p>
        <div className="mt-2 grid gap-3 sm:grid-cols-3">
          <NumberField
            id="cbs-investment"
            label="Total investment (€)"
            instruction="Every investment cost type above — not just the purchase price."
            value={investment}
            onChange={setInvestment}
          />
          <NumberField
            id="cbs-savings"
            label="Estimated annual savings (€)"
            instruction="Include energy, maintenance, and disposal savings — not only the electricity line item."
            value={annualSavings}
            onChange={setAnnualSavings}
          />
          <NumberField
            id="cbs-lifespan"
            label="Assumed lifespan (years)"
            instruction="Default 5 — edit if the measure's asset life differs."
            value={lifespan}
            onChange={setLifespan}
          />
        </div>
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          <Readout label="ROI over lifespan" value={roiPct === null ? "—" : `${roiPct.toFixed(0)}%`} />
          <Readout label="Payback period" value={payback === null ? "—" : `${payback.toFixed(1)} years`} />
        </div>
      </div>
    </div>
  );
}

function NumberField({
  id,
  label,
  instruction,
  value,
  onChange,
}: {
  id: string;
  label: string;
  instruction: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div>
      <label htmlFor={id} className="block text-caption font-semibold text-ink">
        {label}
      </label>
      <p className="mt-0.5 text-micro text-ash">{instruction}</p>
      <input
        id={id}
        type="number"
        inputMode="decimal"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1.5 w-full rounded-lg border border-line bg-paper px-2.5 py-1.5 text-caption text-ink"
      />
    </div>
  );
}

function Readout({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-line bg-paper px-3 py-2">
      <p className="text-micro text-ash">{label}</p>
      <p className="text-readout tabular-nums text-ink">{value}</p>
    </div>
  );
}

// ---------------------------------------------------------------------------
// S2 — Three-lens toggle
// ---------------------------------------------------------------------------

type Lens = "financial" | "strategic" | "risk";
const LENSES: { id: Lens; label: string; barClass: string }[] = [
  { id: "financial", label: "Financial", barClass: "bg-ink" },
  { id: "strategic", label: "Strategic", barClass: "bg-accent" },
  { id: "risk", label: "Risk", barClass: "bg-warn" },
];

type Score = "High" | "Medium" | "Low";
const SCORE_FILL: Record<Score, number> = { High: 88, Medium: 55, Low: 24 };
const SCORE_VALUE: Record<Score, number> = { High: 3, Medium: 2, Low: 1 };

type Measure = { id: string; label: string; scores: Record<Lens, Score> };
const MEASURES: Measure[] = [
  { id: "lifecycle", label: "Extend laptop lifecycle from 3 to 5 years", scores: { financial: "High", strategic: "Medium", risk: "Medium" } },
  { id: "shutdown", label: "Deploy automated shutdown policy", scores: { financial: "Medium", strategic: "Low", risk: "Low" } },
  { id: "csrd", label: "Build CSRD-ready energy reporting", scores: { financial: "Low", strategic: "High", risk: "High" } },
  { id: "procurement", label: "Adopt TCO-Certified procurement standard", scores: { financial: "Low", strategic: "High", risk: "Medium" } },
];

export function ThreeLensToggle() {
  const [active, setActive] = useState<Lens[]>(["financial"]);

  const toggleLens = (id: Lens) =>
    setActive((cur) => (cur.includes(id) ? cur.filter((x) => x !== id) : [...cur, id]));

  const ranked = useMemo(() => {
    const withScore = MEASURES.map((m) => {
      const lenses = active.length ? active : (["financial"] as Lens[]);
      const total = lenses.reduce((sum, l) => sum + SCORE_VALUE[m.scores[l]], 0);
      return { measure: m, total };
    });
    return withScore.sort((a, b) => b.total - a.total);
  }, [active]);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {LENSES.map((l) => {
          const on = active.includes(l.id);
          return (
            <button
              key={l.id}
              type="button"
              onClick={() => toggleLens(l.id)}
              aria-pressed={on}
              className={clsx(
                "rounded-full border px-3 py-1.5 text-caption font-semibold transition-colors duration-150",
                on ? "border-accent bg-accentSoft text-accent" : "border-line text-ash hover:border-ash",
              )}
            >
              {l.label}
            </button>
          );
        })}
      </div>

      <div className="space-y-2.5">
        {ranked.map(({ measure }, i) => (
          <div key={measure.id} className="rounded-xl border border-line bg-canvas p-3">
            <div className="flex items-center gap-2">
              <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-ink text-micro font-semibold text-paper">
                {i + 1}
              </span>
              <p className="text-caption font-semibold text-ink">{measure.label}</p>
            </div>
            <div className="mt-2 space-y-1.5">
              {(active.length ? active : (["financial"] as Lens[])).map((l) => {
                const lens = LENSES.find((x) => x.id === l)!;
                const score = measure.scores[l];
                return (
                  <div key={l} className="flex items-center gap-2">
                    <span className="w-16 shrink-0 text-micro text-ash">{lens.label}</span>
                    <div className="h-2 flex-1 overflow-hidden rounded-full bg-line">
                      <div
                        className={clsx("h-full rounded-full transition-all duration-300", lens.barClass)}
                        style={{ width: `${SCORE_FILL[score]}%` }}
                      />
                    </div>
                    <span className="w-14 shrink-0 text-right text-micro text-ash">{score}</span>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {active.length === 3 && (
        <p className="reveal-in rounded-lg border border-accent/25 bg-accentSoft px-3 py-2 text-caption text-ink">
          Notice how the ranking changes depending on which lens you apply — this is why a single-lens ROI argument is fragile.
        </p>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// S3 — Adoption simulator
// ---------------------------------------------------------------------------

const THEORETICAL_KWH = 40;

const ADOPTION_PRESETS = [
  { id: "none", label: "No rules", value: 15 },
  { id: "comms", label: "Rules + communication", value: 55 },
  { id: "full", label: "Rules + communication + leadership + ease-of-use", value: 90 },
];

export function AdoptionSimulator() {
  const [adoption, setAdoption] = useState(15);
  const realised = (THEORETICAL_KWH * adoption) / 100;

  return (
    <div className="space-y-4">
      <p className="text-caption text-ash">
        Illustrative measure: an automated shutdown policy rated to save{" "}
        <span className="font-semibold text-ink">{THEORETICAL_KWH} kWh per device per year</span> if followed 100% of the
        time.
      </p>

      <Slider
        id="s3-adoption"
        label="Adoption rate"
        instruction="Drag, or use one of the scenario buttons below."
        value={adoption}
        onChange={setAdoption}
        min={0}
        max={100}
        lowLabel="0%"
        highLabel="100%"
      />

      <div className="flex flex-wrap gap-1.5">
        {ADOPTION_PRESETS.map((p) => (
          <button
            key={p.id}
            type="button"
            onClick={() => setAdoption(p.value)}
            className={clsx(
              "rounded-full border px-2.5 py-1 text-micro font-semibold transition-colors duration-150",
              adoption === p.value ? "border-accent bg-accentSoft text-accent" : "border-line text-ash hover:border-ash",
            )}
          >
            {p.label}
          </button>
        ))}
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <div className="rounded-xl border border-line bg-canvas p-3">
          <p className="text-micro font-semibold uppercase tracking-wide text-ash">Theoretical savings</p>
          <p className="mt-1 text-readout tabular-nums text-ink">{THEORETICAL_KWH} kWh / device / yr</p>
          <div className="mt-2 h-3 overflow-hidden rounded-full bg-line">
            <div className="h-full w-full rounded-full bg-ash/50" />
          </div>
        </div>
        <div className="rounded-xl border border-accent/40 bg-accentSoft/40 p-3">
          <p className="text-micro font-semibold uppercase tracking-wide text-accent">Realised savings</p>
          <p className="mt-1 text-readout tabular-nums text-ink">{realised.toFixed(1)} kWh / device / yr</p>
          <div className="mt-2 h-3 overflow-hidden rounded-full bg-line">
            <div
              className="h-full rounded-full bg-accent transition-all duration-300"
              style={{ width: `${adoption}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// S4 — Regulatory driver map
// ---------------------------------------------------------------------------

type Domain = {
  id: string;
  label: string;
  icon: IconKey;
  requirement: string;
  reactive: string;
  strategic: string;
};

const DOMAINS: Domain[] = [
  {
    id: "transparency",
    label: "Transparency & Reporting",
    icon: "database",
    requirement:
      "CSRD and ESRS E1 require reporting energy use, emissions and the measures taken to reduce them — including IT's Scope 2 and Scope 3 contribution.",
    reactive: "We have to report energy figures because CSRD requires it.",
    strategic: "Our energy-reporting pipeline is also the evidence base for every future business case's savings claim — one measurement process, two uses.",
  },
  {
    id: "procurement",
    label: "Procurement",
    icon: "supplier",
    requirement:
      "Public and enterprise tenders increasingly require ecolabels and efficiency ratings (TCO Certified, EU Ecolabel) as a condition of bidding, not a preference.",
    reactive: "We have to buy certified hardware because this tender demands it.",
    strategic: "A standing certified-procurement standard keeps us eligible for every future tender automatically, instead of proving compliance from scratch each time one arrives.",
  },
  {
    id: "disposal",
    label: "Disposal & Circularity",
    icon: "recycleLoop",
    requirement:
      "The WEEE Directive sets binding collection and recycling obligations; the ESPR adds repairability, durability and digital-product-passport traceability requirements.",
    reactive: "We have to document disposal because WEEE requires it.",
    strategic: "Our disposal documentation is also our evidence of circular-economy performance for tenders and CSRD reporting — one process, two uses.",
  },
  {
    id: "energy",
    label: "Energy Efficiency Obligations",
    icon: "gauge",
    requirement: "Germany's Energy Efficiency Act (EnEfG) obliges larger organisations to run an energy or environmental management system and report on it.",
    reactive: "We have to run an energy management system because EnEfG requires it.",
    strategic: "The same management system gives IT a standing, board-visible case for every future efficiency investment, not just a compliance record nobody reads.",
  },
];

export function RegulatoryDriverMap() {
  const [openId, setOpenId] = useState<string | null>(DOMAINS[0].id);
  const open = DOMAINS.find((d) => d.id === openId) ?? null;

  return (
    <div className="space-y-4">
      <div className="grid gap-2.5 sm:grid-cols-2">
        {DOMAINS.map((d) => {
          const on = openId === d.id;
          return (
            <button
              key={d.id}
              type="button"
              onClick={() => setOpenId((cur) => (cur === d.id ? null : d.id))}
              aria-pressed={on}
              className={clsx(
                "flex items-center gap-2.5 rounded-xl border p-3 text-left transition-colors duration-150",
                on ? "border-accent bg-accentSoft" : "border-line bg-canvas hover:border-ash",
              )}
            >
              <span
                className={clsx(
                  "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg",
                  on ? "bg-accent text-paper" : "bg-paper text-accent",
                )}
              >
                <Icon name={d.icon} className="h-4 w-4" />
              </span>
              <span className={clsx("text-caption font-semibold", on ? "text-accent" : "text-ink")}>{d.label}</span>
            </button>
          );
        })}
      </div>

      {open && (
        <div className="reveal-in rounded-xl border border-line bg-paper p-4">
          <p className="text-caption text-ink">{open.requirement}</p>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            <div className="rounded-lg border border-line bg-canvas p-3">
              <p className="text-micro font-semibold uppercase tracking-wide text-ash">Reactive framing</p>
              <p className="mt-1 text-caption italic text-ink">&ldquo;{open.reactive}&rdquo;</p>
            </div>
            <div className="rounded-lg border border-accent/30 bg-accentSoft p-3">
              <p className="text-micro font-semibold uppercase tracking-wide text-accent">Strategic framing</p>
              <p className="mt-1 text-caption italic text-ink">&ldquo;{open.strategic}&rdquo;</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
