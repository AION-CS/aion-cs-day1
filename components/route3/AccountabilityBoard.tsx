"use client";

import { useRef, useState } from "react";
import clsx from "clsx";
import { useProgress } from "@/lib/store";
import {
  R3,
  ROLES,
  RACI_ROLES,
  RACI_LETTERS,
  RACI_DECISIONS,
  TRADE_OFFS,
  REVIEW_INDICATORS,
  INDICATOR_PICK_COUNT,
  CADENCES,
  TRIGGER_INSTRUCTION,
  TRIGGER_MIN_WORDS,
  BOARD_CHALLENGES,
  CHALLENGE_NOTE_INSTRUCTION,
  COMMITMENT_INSTRUCTION,
  COMMITMENT_MIN_WORDS,
  RACI_ANSWER_KEY,
  COMMITMENT_ANSWER_NOTE,
  type RaciLetter,
  type RoleId,
} from "@/lib/route3";
import { useRoute3 } from "./useRoute3";
import { useRaciStore, type RaciSnapshot } from "./useRaciStore";
import { AnswerKey, AnswerKeyNote } from "@/components/ui/AnswerKey";
import { Info, Check } from "@/components/icons/LineIcons";

const words = (v: string) => v.trim().split(/\s+/).filter(Boolean).length;
const DRAG_THRESHOLD = 6;

const LETTER_HINT: Record<RaciLetter, string> = {
  R: "Responsible — does the work",
  A: "Accountable — owns the outcome, exactly one",
  C: "Consulted — asked before deciding",
  I: "Informed — told afterwards",
};

const roleLabel = (id: RoleId) => ROLES.find((r) => r.id === id)?.label ?? id;

/** Stage 3 — accountability, trade-off defaults, review design, and the board challenge. */
export function AccountabilityBoard() {
  const r3 = useRoute3();
  const choose = useProgress((s) => s.choose);
  const toggleCheck = useProgress((s) => s.toggleCheck);
  const setNote = useProgress((s) => s.setNote);

  const [heldLetter, setHeldLetter] = useState<RaciLetter | null>(null);
  const [draggingLetter, setDraggingLetter] = useState<RaciLetter | null>(null);
  const [dragPos, setDragPos] = useState<{ x: number; y: number } | null>(null);
  const downRef = useRef<{ x: number; y: number } | null>(null);
  const wasDragRef = useRef(false);
  const [shake, setShake] = useState<"undo" | "redo" | null>(null);
  const [indicatorMsg, setIndicatorMsg] = useState<string | null>(null);
  const [pickHint, setPickHint] = useState<string | null>(null);

  const past = useRaciStore((s) => s.past);
  const future = useRaciStore((s) => s.future);
  const recordChange = useRaciStore((s) => s.recordChange);
  const storeUndo = useRaciStore((s) => s.undo);
  const storeRedo = useRaciStore((s) => s.redo);

  const snapshot = (): RaciSnapshot => {
    const snap: RaciSnapshot = {};
    for (const d of RACI_DECISIONS) for (const role of RACI_ROLES) snap[`${d.id}:${role}`] = r3.raci[`${d.id}:${role}`] ?? null;
    return snap;
  };

  const applySnapshot = (snap: RaciSnapshot) => {
    for (const [key, letter] of Object.entries(snap)) {
      const [decisionId, roleId] = key.split(":");
      choose(R3.stage3.raci(decisionId, roleId), (letter ?? "") as string);
    }
  };

  const assign = (decisionId: string, roleId: RoleId, letter: RaciLetter | null) => {
    recordChange(snapshot());
    choose(R3.stage3.raci(decisionId, roleId), (letter ?? "") as string);
  };

  const triggerShake = (which: "undo" | "redo") => {
    setShake(which);
    window.setTimeout(() => setShake(null), 350);
  };

  const onToggleIndicator = (id: string) => {
    const selected = r3.pickedIndicators.includes(id);
    if (selected) {
      toggleCheck(R3.stage3.indicator(id), false);
      return;
    }
    if (r3.pickedIndicators.length >= INDICATOR_PICK_COUNT) {
      setIndicatorMsg(`You already have ${INDICATOR_PICK_COUNT} indicators. Deselect one first — a review nobody reads is worse than three metrics that move.`);
      window.setTimeout(() => setIndicatorMsg(null), 4000);
      return;
    }
    toggleCheck(R3.stage3.indicator(id), true);
  };

  const triggerWords = words(r3.trigger);
  const commitmentWords = words(r3.commitment);

  return (
    <div>
      {/* --------------------------------------------------------------- RACI */}
      <div id="r3-raci" className="scroll-mt-24 rounded-2xl border border-line bg-paper p-4">
        <div className="flex flex-wrap items-baseline justify-between gap-3">
          <div>
            <p className="text-caption font-semibold text-ink">Who decides what</p>
            <p className="mt-0.5 text-micro text-ash">
              Pick a letter, then click a cell — or drag it across. Every decision needs exactly one Accountable and at
              least one Responsible. Click an assigned cell to clear it.
            </p>
          </div>
          <div className="flex gap-1.5">
            <button
              type="button"
              onClick={() => {
                const prev = storeUndo(snapshot());
                if (!prev) return triggerShake("undo");
                applySnapshot(prev);
              }}
              className={clsx(
                "rounded-lg border px-2.5 py-1 text-micro font-semibold transition-colors duration-150",
                past.length === 0 ? "border-line text-ash/50" : "border-line text-ink hover:border-ash",
                shake === "undo" && "anim-shake-noop",
              )}
            >
              ↶ Undo
            </button>
            <button
              type="button"
              onClick={() => {
                const next = storeRedo(snapshot());
                if (!next) return triggerShake("redo");
                applySnapshot(next);
              }}
              className={clsx(
                "rounded-lg border px-2.5 py-1 text-micro font-semibold transition-colors duration-150",
                future.length === 0 ? "border-line text-ash/50" : "border-line text-ink hover:border-ash",
                shake === "redo" && "anim-shake-noop",
              )}
            >
              ↷ Redo
            </button>
          </div>
        </div>

        <div className="mt-3 flex flex-wrap gap-2">
          {RACI_LETTERS.map((l) => (
            <button
              key={l}
              type="button"
              onPointerDown={(e) => {
                e.currentTarget.setPointerCapture(e.pointerId);
                downRef.current = { x: e.clientX, y: e.clientY };
                wasDragRef.current = false;
                setDraggingLetter(l);
                setDragPos({ x: e.clientX, y: e.clientY });
              }}
              onPointerMove={(e) => {
                if (!downRef.current) return;
                if (Math.hypot(e.clientX - downRef.current.x, e.clientY - downRef.current.y) > DRAG_THRESHOLD)
                  wasDragRef.current = true;
                setDragPos({ x: e.clientX, y: e.clientY });
              }}
              onPointerUp={(e) => {
                if (wasDragRef.current) {
                  const el = document.elementFromPoint(e.clientX, e.clientY);
                  const cell = el?.closest<HTMLElement>("[data-raci-cell]");
                  const target = cell?.getAttribute("data-raci-cell");
                  if (target) {
                    const [decisionId, roleId] = target.split("|");
                    assign(decisionId, roleId as RoleId, l);
                  }
                }
                setDraggingLetter(null);
                setDragPos(null);
                downRef.current = null;
              }}
              // Selection lives on click, not pointerup, so the palette also works from the keyboard.
              onClick={() => {
                if (wasDragRef.current) {
                  wasDragRef.current = false;
                  return;
                }
                setHeldLetter((cur) => (cur === l ? null : l));
              }}
              aria-pressed={heldLetter === l}
              className={clsx(
                "touch-none rounded-xl border px-3 py-2 text-left transition-colors duration-150",
                heldLetter === l ? "border-accent bg-accentSoft" : "border-line bg-paper hover:border-ash",
                draggingLetter === l && "opacity-40",
              )}
            >
              <span className="text-readout font-semibold text-ink">{l}</span>
              <span className="ml-2 text-micro text-ash">{LETTER_HINT[l]}</span>
            </button>
          ))}
        </div>

        {pickHint && (
          <p className="reveal-in mt-2 rounded-lg border border-warn/40 bg-warn/10 px-3 py-2 text-micro text-warn">{pickHint}</p>
        )}

        <div className="mt-3 overflow-x-auto">
          <table className="w-full min-w-[640px] border-separate border-spacing-1">
            <thead>
              <tr>
                <th className="w-48" />
                {RACI_ROLES.map((role) => (
                  <th key={role} className="px-1 pb-1 text-micro font-semibold text-ash">
                    {roleLabel(role)}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {RACI_DECISIONS.map((d) => {
                const status = r3.raciStatus.find((s) => s.id === d.id)!;
                return (
                  <tr key={d.id}>
                    <th
                      className={clsx(
                        "pr-2 text-left align-middle text-micro font-semibold",
                        status.hasDoubleAccountable ? "text-warn" : "text-ink",
                      )}
                    >
                      {d.label}
                    </th>
                    {RACI_ROLES.map((role) => {
                      const letter = r3.raci[`${d.id}:${role}`];
                      return (
                        <td key={role} data-raci-cell={`${d.id}|${role}`}>
                          <button
                            type="button"
                            onClick={() => {
                              if (letter) assign(d.id, role, null);
                              else if (heldLetter) assign(d.id, role, heldLetter);
                              else {
                                // never a silent no-op — say what the click was missing
                                setPickHint("Choose a letter above first, then click the cell — or drag the letter straight onto it.");
                                window.setTimeout(() => setPickHint(null), 3500);
                              }
                            }}
                            aria-label={`${d.label} — ${roleLabel(role)}${letter ? `, ${letter}` : ""}`}
                            className={clsx(
                              "h-11 w-full rounded-lg border text-caption font-semibold transition-colors duration-150",
                              letter === "A"
                                ? status.hasDoubleAccountable
                                  ? "border-warn bg-warn/15 text-warn"
                                  : "border-accent bg-accent text-paper"
                                : letter
                                  ? "border-accent/40 bg-accentSoft text-accent"
                                  : heldLetter
                                    ? "border-dashed border-accent/50 bg-canvas text-ash/40"
                                    : "border-dashed border-line bg-canvas text-ash/40",
                            )}
                          >
                            {letter ?? "·"}
                          </button>
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {r3.doubleAccountable.length > 0 && (
          <div className="reveal-in mt-3 flex items-start gap-2 rounded-xl border border-warn/50 bg-warn/5 p-3">
            <Info className="mt-0.5 h-4 w-4 shrink-0 text-warn" />
            <p className="text-caption text-ink">
              <span className="font-semibold">
                Two Accountables on “{r3.doubleAccountable[0].label}”.
              </span>{" "}
              That is not shared ownership — it is a guaranteed stall the first time those two disagree. Either split the
              decision into two, or decide which role breaks the tie and make the other one Consulted.
            </p>
          </div>
        )}

        <AnswerKey block={RACI_ANSWER_KEY} />
      </div>

      {/* --------------------------------------------------------- trade-offs */}
      <div id="r3-tradeoffs" className="mt-5 scroll-mt-24 rounded-2xl border border-line bg-paper p-4">
        <p className="text-caption font-semibold text-ink">Trade-off defaults the board owns</p>
        <p className="mt-0.5 text-micro text-ash">
          Name who owns each conflict and what happens by default — stating it in advance is what stops every individual
          case becoming a negotiation.
        </p>

        <div className="mt-3 space-y-3">
          {TRADE_OFFS.map((t) => (
            <div key={t.id} className="rounded-xl border border-line p-3">
              <p className="text-caption font-semibold text-ink">{t.label}</p>
              <label className="mt-2 block max-w-sm">
                <span className="text-micro font-semibold text-ink">Accountable role</span>
                <p className="mt-0.5 text-micro text-ash">The one role that can actually change the outcome here.</p>
                <select
                  value={r3.tradeoffOwner[t.id] ?? ""}
                  onChange={(e) => choose(R3.stage3.tradeoffOwner(t.id), e.target.value)}
                  className="mt-1 w-full rounded-xl border border-line bg-paper px-3 py-2 text-caption text-ink"
                >
                  <option value="">Choose a role…</option>
                  {ROLES.map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.label}
                    </option>
                  ))}
                </select>
              </label>
              <p className="mt-2 text-micro font-semibold text-ink">Stated default</p>
              <div className="mt-1 grid gap-1.5">
                {t.options.map((o) => (
                  <button
                    key={o.id}
                    type="button"
                    onClick={() => choose(R3.stage3.tradeoffDefault(t.id), o.id)}
                    aria-pressed={r3.tradeoffDefault[t.id] === o.id}
                    className={clsx(
                      "rounded-lg border px-2.5 py-1.5 text-left text-micro transition-colors duration-150",
                      r3.tradeoffDefault[t.id] === o.id ? "border-accent bg-accentSoft text-ink" : "border-line bg-paper text-ash hover:border-ash hover:text-ink",
                    )}
                  >
                    {o.label}
                  </button>
                ))}
              </div>
              <AnswerKey
                block={{
                  prompt: t.label,
                  items: t.options.map((o) => ({
                    option: o.label,
                    verdict: o.isModel ? ("pick" as const) : ("avoid" as const),
                    why: o.why,
                  })),
                }}
              />
            </div>
          ))}
        </div>
      </div>

      {/* ------------------------------------------------------------- review */}
      <div id="r3-review" className="mt-5 scroll-mt-24 rounded-2xl border border-line bg-paper p-4">
        <div className="flex flex-wrap items-baseline justify-between gap-3">
          <div>
            <p className="text-caption font-semibold text-ink">How you will know it stopped working</p>
            <p className="mt-0.5 text-micro text-ash">
              Choose {INDICATOR_PICK_COUNT} indicators and a cadence for each. A published policy is an assumption until
              something observable tests it.
            </p>
          </div>
          <p className="text-caption tabular-nums text-ash">
            <span className="font-semibold text-ink">{r3.pickedIndicators.length}</span> / {INDICATOR_PICK_COUNT}
          </p>
        </div>

        {indicatorMsg && <p className="reveal-in mt-2 rounded-lg border border-warn/40 bg-warn/10 px-3 py-2 text-micro text-warn">{indicatorMsg}</p>}

        <div className="mt-3 grid gap-2 lg:grid-cols-2">
          {REVIEW_INDICATORS.map((i) => {
            const selected = r3.pickedIndicators.includes(i.id);
            return (
              <div
                key={i.id}
                className={clsx(
                  "rounded-xl border p-3 transition-colors duration-150",
                  selected ? "border-accent bg-accentSoft" : "border-line bg-paper",
                )}
              >
                <button
                  type="button"
                  onClick={() => onToggleIndicator(i.id)}
                  aria-pressed={selected}
                  className="flex w-full items-start gap-2 text-left"
                >
                  <span
                    className={clsx(
                      "mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-micro font-semibold",
                      selected ? "bg-accent text-paper" : "bg-mist text-ash",
                    )}
                  >
                    {selected ? <Check className="h-3.5 w-3.5" /> : ""}
                  </span>
                  <span className="flex-1 text-caption text-ink">{i.label}</span>
                </button>
                {selected && (
                  <div className="reveal-in mt-2 flex flex-wrap gap-1.5">
                    {CADENCES.map((c) => (
                      <button
                        key={c.id}
                        type="button"
                        onClick={() => choose(R3.stage3.cadence(i.id), c.id)}
                        aria-pressed={r3.cadence[i.id] === c.id}
                        className={clsx(
                          "rounded-full border px-2.5 py-0.5 text-micro font-medium transition-colors duration-150",
                          r3.cadence[i.id] === c.id ? "border-accent bg-accent text-paper" : "border-line bg-paper text-ash hover:border-ash hover:text-ink",
                        )}
                      >
                        {c.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <label className="mt-3 block">
          <span className="text-caption font-semibold text-ink">Trigger condition</span>
          <p className="mt-0.5 text-micro text-ash">{TRIGGER_INSTRUCTION}</p>
          <textarea
            value={r3.trigger}
            onChange={(e) => setNote(R3.stage3.trigger, e.target.value)}
            rows={2}
            className="mt-1.5 w-full rounded-xl border border-line bg-paper px-3 py-2 text-caption text-ink"
          />
        </label>
        <p className={clsx("mt-1 text-micro tabular-nums", triggerWords >= TRIGGER_MIN_WORDS ? "text-accent" : "text-ash")}>
          {triggerWords} / {TRIGGER_MIN_WORDS} words
        </p>
        <AnswerKeyNote
          label="Model review design"
          text="Repair-to-replace ratio (quarterly) · exception rate by reason code (quarterly) · peripheral reuse rate (quarterly), with average fleet age annually as a strong fourth. Model trigger: “If more than 25% of exceptions in a quarter carry the same reason code, that threshold is mis-set and goes to Steering for revision at the next quarterly review.”"
        />
      </div>

      {/* ----------------------------------------------------- board challenge */}
      <div id="r3-board" className="mt-5 scroll-mt-24 rounded-2xl border-2 border-warn/40 bg-warn/5 p-4">
        <p className="text-caption font-semibold text-warn">The board challenge</p>
        <p className="mt-0.5 text-micro text-ink">
          Three objections, in the room. Choose your response and write the line you would actually say.
        </p>

        <div className="mt-3 space-y-3">
          {BOARD_CHALLENGES.map((c) => (
            <div key={c.id} className="rounded-xl border border-line bg-paper p-3">
              <p className="text-micro font-semibold uppercase tracking-wide text-ash">{c.role}</p>
              <p className="mt-1 text-caption italic text-ink">“{c.objection}”</p>
              <div className="mt-2 grid gap-1.5">
                {c.options.map((o) => (
                  <button
                    key={o.id}
                    type="button"
                    onClick={() => choose(R3.stage3.challenge(c.id), o.id)}
                    aria-pressed={r3.challenge[c.id] === o.id}
                    className={clsx(
                      "rounded-lg border px-2.5 py-1.5 text-left text-micro transition-colors duration-150",
                      r3.challenge[c.id] === o.id ? "border-accent bg-accentSoft text-ink" : "border-line bg-paper text-ash hover:border-ash hover:text-ink",
                    )}
                  >
                    {o.label}
                  </button>
                ))}
              </div>
              <label className="mt-2 block">
                <span className="text-micro font-semibold text-ink">Your supporting line</span>
                <p className="mt-0.5 text-micro text-ash">{CHALLENGE_NOTE_INSTRUCTION}</p>
                <input
                  value={r3.challengeNote[c.id] ?? ""}
                  onChange={(e) => setNote(R3.stage3.challengeNote(c.id), e.target.value)}
                  className="mt-1 w-full rounded-xl border border-line bg-paper px-3 py-2 text-caption text-ink"
                />
              </label>
              <AnswerKey
                block={{
                  prompt: `${c.role}'s objection`,
                  items: c.options.map((o) => ({
                    option: o.label,
                    verdict: o.isModel ? ("pick" as const) : ("avoid" as const),
                    why: o.why,
                  })),
                }}
              />
            </div>
          ))}
        </div>
      </div>

      {/* --------------------------------------------------------- commitment */}
      <div id="r3-commitment" className="mt-5 scroll-mt-24 rounded-2xl border border-line bg-paper p-4">
        <label className="block">
          <span className="text-caption font-semibold text-ink">The uncertainty commitment</span>
          <p className="mt-0.5 text-micro text-ash">{COMMITMENT_INSTRUCTION}</p>
          <textarea
            value={r3.commitment}
            onChange={(e) => setNote(R3.stage3.commitment, e.target.value)}
            rows={3}
            className="mt-1.5 w-full rounded-xl border border-line bg-paper px-3 py-2 text-caption text-ink"
          />
        </label>
        <p className={clsx("mt-1 text-micro tabular-nums", commitmentWords >= COMMITMENT_MIN_WORDS ? "text-accent" : "text-ash")}>
          {commitmentWords} / {COMMITMENT_MIN_WORDS} words
        </p>
        <AnswerKeyNote label="What a strong commitment contains" text={COMMITMENT_ANSWER_NOTE} />
      </div>

      {draggingLetter && dragPos && wasDragRef.current && (
        <div
          className="pointer-events-none fixed z-50 -translate-x-1/2 -translate-y-1/2 rounded-lg border border-accent bg-paper px-3 py-1.5 text-caption font-semibold text-ink shadow-lg"
          style={{ left: dragPos.x, top: dragPos.y }}
        >
          {draggingLetter}
        </div>
      )}
    </div>
  );
}
