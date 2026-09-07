"use client";

import clsx from "clsx";
import { useProgress } from "@/lib/store";
import { R3, LEVERS, LEVERS_REQUIRED_COUNT, LEVER_REASON_MIN_WORDS } from "@/lib/route3";
import { useRoute3 } from "./useRoute3";
import { ClueToggle } from "@/components/ui/ClueToggle";
import { Check } from "@/components/icons/LineIcons";

function wordCount(text: string): number {
  return text.trim().length === 0 ? 0 : text.trim().split(/\s+/).length;
}

/** Stage 3 — pick exactly the 4 real root-cause levers out of 8 candidates, and justify each. */
export function LeverPicker() {
  const r3 = useRoute3();
  const choose = useProgress((s) => s.choose);
  const setNote = useProgress((s) => s.setNote);

  const toggle = (leverId: string) => {
    const isSelected = r3.stage3Selected.includes(leverId);
    if (!isSelected && r3.stage3Selected.length >= LEVERS_REQUIRED_COUNT) return;
    choose(R3.s3.selected(leverId), isSelected ? "no" : "yes");
  };

  return (
    <div>
      <div className="flex items-baseline justify-between gap-3">
        <p className="text-caption text-ash">Select exactly {LEVERS_REQUIRED_COUNT} candidate actions.</p>
        <p className="text-caption tabular-nums text-ash">
          Selected: <span className="font-semibold text-ink">{r3.stage3Selected.length}</span> / {LEVERS_REQUIRED_COUNT}
        </p>
      </div>

      <div className="mt-3 space-y-2">
        {LEVERS.map((l) => {
          const selected = r3.stage3Selected.includes(l.id);
          const disabled = !selected && r3.stage3Selected.length >= LEVERS_REQUIRED_COUNT;
          return (
            <div key={l.id} className="rounded-xl border border-line">
              <button
                type="button"
                onClick={() => toggle(l.id)}
                aria-pressed={selected}
                disabled={false}
                className={clsx(
                  "flex w-full items-start gap-2.5 p-3 text-left transition-colors duration-150",
                  selected ? "bg-accentSoft" : disabled ? "opacity-50" : "hover:bg-canvas",
                )}
              >
                <span className={clsx("mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full", selected ? "bg-accent text-paper" : "bg-mist text-ash")}>
                  {selected && <Check className="h-3 w-3" />}
                </span>
                <span className="flex-1 text-caption text-ink">{l.text}</span>
              </button>
              <div className="border-t border-line px-3 pb-2">
                <ClueToggle clue={l.pickClue} />
              </div>
            </div>
          );
        })}
      </div>

      {r3.stage3Selected.length > 0 && (
        <div className="mt-5 space-y-4 border-t border-line pt-4">
          {r3.stage3Selected.map((leverId) => {
            const lever = LEVERS.find((l) => l.id === leverId)!;
            const text = r3.stage3Reason[leverId] ?? "";
            const words = wordCount(text);
            return (
              <div key={leverId} id={`r3-stage3-${leverId}`}>
                <label className="block">
                  <span className="text-caption font-semibold text-ink">Why is "{lever.text}" a real lever, not just a symptom fix?</span>
                  <p className="text-micro text-ash">A sentence or two — aim for at least {LEVER_REASON_MIN_WORDS} words, but this won't block your export.</p>
                  <textarea
                    value={text}
                    onChange={(e) => setNote(R3.s3.reason(leverId), e.target.value)}
                    rows={2}
                    className="mt-1 w-full rounded-xl border border-line bg-paper px-3 py-2 text-body text-ink"
                  />
                </label>
                <p className={clsx("mt-1 text-micro", words >= LEVER_REASON_MIN_WORDS ? "text-accent" : "text-ash")}>
                  {words} word{words === 1 ? "" : "s"}
                  {words < LEVER_REASON_MIN_WORDS && ` — ${LEVER_REASON_MIN_WORDS - words} more to reach a solid reason`}
                </p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
