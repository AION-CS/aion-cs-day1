"use client";

import clsx from "clsx";
import { useProgress } from "@/lib/store";
import {
  R3,
  THRESHOLDS,
  TEST_DEVICES,
  REASON_CODES,
  REASON_CODE_MIN,
  REASON_CODE_MAX,
  EXCEPTION_INSTRUCTION,
  EXCEPTION_MIN_WORDS,
  RULE_ANSWER_KEY,
  ESCALATION_NOTE,
  type ThresholdKey,
  type Outcome,
} from "@/lib/route3";
import { useRoute3 } from "./useRoute3";
import { AnswerKey, AnswerKeyNote } from "@/components/ui/AnswerKey";
import { Info } from "@/components/icons/LineIcons";

const words = (v: string) => v.trim().split(/\s+/).filter(Boolean).length;

const OUTCOME_STYLE: Record<Outcome, string> = {
  repair: "border-accent bg-accentSoft text-accent",
  retire: "border-danger/40 bg-danger/10 text-danger",
  escalate: "border-warn/40 bg-warn/10 text-warn",
};

const OUTCOME_LABEL: Record<Outcome, string> = { repair: "Repair", retire: "Retire", escalate: "Escalate" };

/**
 * Stage 2 — the rule builder and its test bench. Changing any threshold
 * re-runs all eight devices immediately and clears the learner's intent marks,
 * so an adjustment always costs a fresh read of every outcome. That is the
 * iteration the exercise is actually teaching.
 */
export function RuleBench() {
  const r3 = useRoute3();
  const choose = useProgress((s) => s.choose);
  const toggleCheck = useProgress((s) => s.toggleCheck);
  const setNote = useProgress((s) => s.setNote);

  const setThreshold = (key: ThresholdKey, value: string) => {
    const hadMarks = r3.markedCount > 0;
    choose(R3.stage2.threshold(key), value);
    if (hadMarks) {
      TEST_DEVICES.forEach((d) => choose(R3.stage2.outcomeMark(d.id), ""));
      setNote(R3.stage2.iterations, String(r3.iterations + 1));
    }
  };

  const onToggleCode = (id: string) => {
    const selected = r3.pickedCodes.includes(id);
    if (!selected && r3.pickedCodes.length >= REASON_CODE_MAX) return;
    toggleCheck(R3.stage2.reasonCode(id), !selected);
  };

  const exceptionWords = words(r3.exceptionPath);
  const escalationLoad = {
    technician: r3.outcomeCounts.repair + r3.outcomeCounts.retire,
    teamLead: r3.outcomeCounts.escalate,
  };

  return (
    <div>
      {/* ------------------------------------------------------------ the rule */}
      <div id="r3-rule" className="scroll-mt-24 rounded-2xl border border-line bg-paper p-4">
        <p className="text-caption font-semibold text-ink">Build the repair-vs-retire rule</p>
        <p className="mt-0.5 text-micro text-ash">
          Each setting has a consequence, shown once you choose it. Nothing is right or wrong here until you see what it
          does to real devices below.
        </p>

        <div className="mt-3 grid gap-3 lg:grid-cols-2">
          {THRESHOLDS.map((t) => {
            const value = r3.thresholds[t.key];
            const chosen = t.options.find((o) => o.id === value);
            return (
              <div key={t.key} className="rounded-xl border border-line p-3">
                <p className="text-caption font-semibold text-ink">{t.label}</p>
                <p className="mt-0.5 text-micro text-ash">{t.hint}</p>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {t.options.map((o) => (
                    <button
                      key={o.id}
                      type="button"
                      onClick={() => setThreshold(t.key, o.id)}
                      aria-pressed={value === o.id}
                      className={clsx(
                        "rounded-full border px-2.5 py-1 text-micro font-medium transition-colors duration-150",
                        value === o.id ? "border-accent bg-accent text-paper" : "border-line bg-paper text-ash hover:border-ash hover:text-ink",
                      )}
                    >
                      {o.label}
                    </button>
                  ))}
                </div>
                {chosen && <p className="reveal-in mt-2 text-micro italic text-ash">{chosen.consequence}</p>}
              </div>
            );
          })}
        </div>

        <AnswerKey block={RULE_ANSWER_KEY} />
      </div>

      {/* ---------------------------------------------------------- test bench */}
      <div id="r3-bench" className="mt-5 scroll-mt-24 rounded-2xl border border-line bg-paper p-4">
        <div className="flex flex-wrap items-baseline justify-between gap-3">
          <div>
            <p className="text-caption font-semibold text-ink">Test bench — eight real devices through your rule</p>
            <p className="mt-0.5 text-micro text-ash">
              Mark every outcome as intended or not. Anything you did not intend is a mis-set threshold, not an unusual
              device — adjust above and the bench re-runs.
            </p>
          </div>
          <div className="text-right">
            <p className="text-caption tabular-nums text-ash">
              Marked: <span className="font-semibold text-ink">{r3.markedCount}</span> / {TEST_DEVICES.length}
            </p>
            <p className="text-micro tabular-nums text-ash">
              Iterations: <span className="font-semibold text-ink">{r3.iterations}</span>
            </p>
          </div>
        </div>

        {!r3.ruleReady ? (
          <p className="mt-3 rounded-xl border border-dashed border-line bg-canvas p-4 text-caption text-ash">
            Set the repair ceiling, supported-life minimum, condition minimum and security baseline above — the bench runs
            as soon as the rule is complete.
          </p>
        ) : (
          <>
            <div className="mt-3 flex flex-wrap gap-3 rounded-xl border border-line bg-canvas px-4 py-2.5 text-caption text-ash">
              <span>
                <span className="font-semibold tabular-nums text-accent">{r3.outcomeCounts.repair}</span> repair
              </span>
              <span>
                <span className="font-semibold tabular-nums text-danger">{r3.outcomeCounts.retire}</span> retire
              </span>
              <span>
                <span className="font-semibold tabular-nums text-warn">{r3.outcomeCounts.escalate}</span> escalate
              </span>
            </div>

            <div className="mt-3 grid gap-2 lg:grid-cols-2">
              {TEST_DEVICES.map((d) => {
                const res = r3.outcomes[d.id];
                const mark = r3.marks[d.id];
                const ratio = ((d.repairCost / d.replacementCost) * 100).toFixed(0);
                return (
                  <div
                    key={d.id}
                    className={clsx(
                      "rounded-xl border p-3 transition-colors duration-200",
                      mark === "not-intended" ? "border-warn/50 bg-warn/5" : mark === "intended" ? "border-accent/40 bg-accentSoft/25" : "border-line bg-paper",
                    )}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="text-caption font-semibold text-ink">
                          Device {d.n} · {d.age} · {d.userRole}
                        </p>
                        <p className="mt-0.5 text-micro text-ash">
                          Repair €{d.repairCost} of €{d.replacementCost} ({ratio}%) · condition {d.condition} ·{" "}
                          {d.supportedLifeMonths} mo supported ·{" "}
                          {d.securityCompliant ? "meets security baseline" : "outside security baseline"}
                        </p>
                      </div>
                      {res && (
                        <span
                          className={clsx(
                            "shrink-0 rounded-full border px-2.5 py-1 text-micro font-semibold transition-colors duration-300",
                            OUTCOME_STYLE[res.outcome],
                          )}
                        >
                          {OUTCOME_LABEL[res.outcome]}
                        </span>
                      )}
                    </div>
                    {res && <p className="mt-1.5 text-micro italic text-ash">{res.reason}</p>}

                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {[
                        { id: "intended", label: "Intended" },
                        { id: "not-intended", label: "Not intended" },
                      ].map((o) => (
                        <button
                          key={o.id}
                          type="button"
                          onClick={() => choose(R3.stage2.outcomeMark(d.id), o.id)}
                          aria-pressed={mark === o.id}
                          className={clsx(
                            "rounded-full border px-2.5 py-0.5 text-micro font-medium transition-colors duration-150",
                            mark === o.id
                              ? o.id === "intended"
                                ? "border-accent bg-accent text-paper"
                                : "border-warn bg-warn text-paper"
                              : "border-line bg-paper text-ash hover:border-ash hover:text-ink",
                          )}
                        >
                          {o.label}
                        </button>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>

            {r3.notIntended.length > 0 && (
              <div className="reveal-in mt-3 flex items-start gap-2 rounded-xl border border-warn/50 bg-warn/5 p-3">
                <Info className="mt-0.5 h-4 w-4 shrink-0 text-warn" />
                <p className="text-caption text-ink">
                  You marked {r3.notIntended.length} outcome{r3.notIntended.length === 1 ? "" : "s"} as not intended
                  (device {r3.notIntended.map((d) => d.n).join(", ")}). Change a threshold above — the bench re-runs and
                  you mark every device again. That re-read is the point: a rule you have not re-read after changing is a
                  rule you have not tested.
                </p>
              </div>
            )}

            <div className="mt-4 rounded-xl border border-line bg-canvas p-3">
              <p className="text-micro font-semibold text-ink">Projected escalation load</p>
              <p className="mt-0.5 text-micro text-ash">
                Where these eight cases would be decided under your thresholds. Escalation volume should be low but
                non-zero — zero can mean the rule is being bypassed rather than followed.
              </p>
              <div className="mt-2 flex h-6 overflow-hidden rounded-lg border border-line">
                <div
                  className="flex items-center justify-center bg-ink/80 text-micro font-semibold text-paper transition-all duration-500"
                  style={{ width: `${(escalationLoad.technician / TEST_DEVICES.length) * 100}%` }}
                >
                  {escalationLoad.technician > 0 ? `Technician ${escalationLoad.technician}` : ""}
                </div>
                <div
                  className="flex items-center justify-center bg-ash/60 text-micro font-semibold text-paper transition-all duration-500"
                  style={{ width: `${(escalationLoad.teamLead / TEST_DEVICES.length) * 100}%` }}
                >
                  {escalationLoad.teamLead > 0 ? `Team lead ${escalationLoad.teamLead}` : ""}
                </div>
              </div>
              <p className="mt-1 text-micro text-ash">
                Steering owns threshold changes and contract terms; the board owns only the principle, the envelope and
                the accountability assignment — neither appears in a per-device run by design.
              </p>
              <AnswerKeyNote label="Reading the escalation load" text={ESCALATION_NOTE} />
            </div>
          </>
        )}
      </div>

      {/* ------------------------------------------------------ exception path */}
      <div id="r3-exception" className="mt-5 scroll-mt-24 rounded-2xl border border-line bg-paper p-4">
        <label className="block">
          <span className="text-caption font-semibold text-ink">Exception path</span>
          <p className="mt-0.5 text-micro text-ash">{EXCEPTION_INSTRUCTION}</p>
          <textarea
            value={r3.exceptionPath}
            onChange={(e) => setNote(R3.stage2.exceptionPath, e.target.value)}
            rows={2}
            className="mt-1.5 w-full rounded-xl border border-line bg-paper px-3 py-2 text-caption text-ink"
          />
        </label>
        <p className={clsx("mt-1 text-micro tabular-nums", exceptionWords >= EXCEPTION_MIN_WORDS ? "text-accent" : "text-ash")}>
          {exceptionWords} / {EXCEPTION_MIN_WORDS} words
        </p>

        <p className="mt-3 text-caption font-semibold text-ink">Reason codes</p>
        <p className="mt-0.5 text-micro text-ash">
          Select {REASON_CODE_MIN}–{REASON_CODE_MAX}. These become your review data — a cluster on one code is what tells
          you which threshold is mis-set.
        </p>
        <div className="mt-2 flex flex-wrap gap-1.5">
          {REASON_CODES.map((c) => {
            const selected = r3.pickedCodes.includes(c.id);
            const atMax = !selected && r3.pickedCodes.length >= REASON_CODE_MAX;
            return (
              <button
                key={c.id}
                type="button"
                onClick={() => onToggleCode(c.id)}
                aria-pressed={selected}
                className={clsx(
                  "rounded-full border px-2.5 py-1 text-micro font-medium transition-colors duration-150",
                  selected ? "border-accent bg-accent text-paper" : atMax ? "border-line bg-canvas text-ash/50" : "border-line bg-paper text-ash hover:border-ash hover:text-ink",
                )}
              >
                {c.label}
              </button>
            );
          })}
        </div>
        <p className="mt-1.5 text-micro tabular-nums text-ash">
          {r3.pickedCodes.length} selected{r3.pickedCodes.length >= REASON_CODE_MAX ? " — deselect one to swap" : ""}
        </p>
      </div>
    </div>
  );
}
