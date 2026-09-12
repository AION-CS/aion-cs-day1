"use client";

import { useState } from "react";
import clsx from "clsx";
import { useProgress } from "@/lib/store";
import { R2, CASE_BRIEF, STAKEHOLDERS, MEASURES } from "@/lib/route2";

const ACCENT = "#0E7A5A";
const ASH = "#5E6670";
const LINE = "#E2E5E9";

/** Simple geometric figure — distinct silhouette per stakeholder, no faces. */
function StakeholderFigure({ index, active }: { index: number; active: boolean }) {
  const stroke = active ? ACCENT : ASH;
  const shoulders = [
    "M6 34 Q20 20 34 34",
    "M4 34 L10 22 L30 22 L36 34",
    "M6 34 Q20 18 34 34",
    "M5 33 Q20 24 35 33",
    "M7 34 L12 21 Q20 17 28 21 L33 34",
  ];
  return (
    <svg viewBox="0 0 40 40" className="h-10 w-10" aria-hidden="true">
      <circle cx="20" cy="12" r="7" fill="none" stroke={stroke} strokeWidth={1.6} />
      <path d={shoulders[index % shoulders.length]} fill="none" stroke={stroke} strokeWidth={1.6} strokeLinecap="round" />
      <circle cx="20" cy="20" r="18" fill="none" stroke={active ? ACCENT : LINE} strokeWidth={1.2} />
    </svg>
  );
}

/** Task opener — the Nordwerk brief, the three measures, the stakeholder panel and the name field. */
export function CaseBrief() {
  const name = useProgress((s) => s.notes[R2.name] ?? "");
  const setNote = useProgress((s) => s.setNote);
  const [openId, setOpenId] = useState<string | null>(null);

  return (
    <div className="card p-5">
      <p className="text-micro font-semibold uppercase tracking-wide text-ash">Brief</p>
      <h3 className="mt-1 text-h3 text-ink">{CASE_BRIEF.company}</h3>
      <p className="mt-2 text-body text-ink">{CASE_BRIEF.brief}</p>
      <p className="mt-3 text-body text-ash">{CASE_BRIEF.profile}</p>
      <p className="mt-2 text-body text-ash">{CASE_BRIEF.fleet}</p>
      <p className="mt-2 text-caption font-semibold text-ink">{CASE_BRIEF.budget}</p>

      <div className="mt-5 border-t border-line pt-4">
        <p className="text-micro font-semibold uppercase tracking-wide text-ash">The three measures on the table</p>
        <div className="mt-2 grid gap-2 lg:grid-cols-3">
          {MEASURES.map((m) => (
            <div key={m.id} className="rounded-xl border border-line p-3">
              <p className="text-caption font-semibold text-ink">{m.title}</p>
              <p className="mt-1 text-micro text-ash">{m.detail}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-5 border-t border-line pt-4">
        <p className="text-micro font-semibold uppercase tracking-wide text-ash">
          Who is in the room — click a face for their stated position
        </p>
        <div className="mt-2 grid gap-2 sm:grid-cols-2 lg:grid-cols-5">
          {STAKEHOLDERS.map((s, i) => {
            const open = openId === s.id;
            return (
              <button
                key={s.id}
                type="button"
                onClick={() => setOpenId(open ? null : s.id)}
                aria-expanded={open}
                className={clsx(
                  "rounded-xl border p-3 text-left transition-colors duration-150",
                  open ? "border-accent bg-accentSoft" : "border-line bg-paper hover:border-ash",
                )}
              >
                <StakeholderFigure index={i} active={open} />
                <p className="mt-1.5 text-micro font-semibold text-ink">{s.role}</p>
                <p className="text-micro text-ash">{s.name}</p>
              </button>
            );
          })}
        </div>
        {openId && (
          <p className="reveal-in mt-2 rounded-xl border border-accent/30 bg-accentSoft/50 p-3 text-caption text-ink">
            <span className="font-semibold">{STAKEHOLDERS.find((s) => s.id === openId)?.role}: </span>
            {STAKEHOLDERS.find((s) => s.id === openId)?.position}
          </p>
        )}
      </div>

      <div id="r2-name" className="mt-5 scroll-mt-24 border-t border-line pt-4">
        <label className="block max-w-xs">
          <span className="text-caption font-semibold text-ink">Your name</span>
          <p className="text-micro text-ash">
            Used to label the exported memo — it becomes e.g. &ldquo;1-jane-day9-l2task1&rdquo;.
          </p>
          <input
            value={name}
            onChange={(e) => setNote(R2.name, e.target.value)}
            placeholder="Full name"
            className="mt-1 w-full rounded-xl border border-line bg-paper px-3 py-2 text-body text-ink"
          />
        </label>
      </div>
    </div>
  );
}
