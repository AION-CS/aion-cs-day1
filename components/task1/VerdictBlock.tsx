"use client";

import { useState } from "react";
import { RECORDS } from "@/data/kesslerDossier";
import type { RecordId, VerdictCategory } from "@/data/kesslerDossier";
import { CITE_CLUE } from "@/data/kesslerDossier";
import { Field } from "@/components/ui/Field";
import { MissingList } from "@/components/ui/MissingList";
import { IDS, verdictMissing } from "@/lib/missing";
import { scrollToAndFlash } from "@/lib/flash";
import { useStore } from "@/store/useStore";
import { usePersisted } from "@/store/usePersisted";
import { AnswerKey } from "@/components/ui/AnswerKey";
import { verdictKey } from "@/lib/answerKey";

const CATEGORIES: { id: VerdictCategory; label: string }[] = [
  { id: "price", label: "Price" },
  { id: "trust", label: "Trust" },
  { id: "benefit", label: "Benefit" },
  { id: "relationship", label: "Relationship" },
];

/** Block 1.2 — name the weak point: one category, two cited observations, one judged sentence. */
export function VerdictBlock() {
  const l1 = useStore((s) => s.l1);
  const setVerdict = useStore((s) => s.setVerdict);
  const fileVerdict = useStore((s) => s.fileVerdict);
  const showClue = useStore((s) => s.showL1Clue);
  const snapshot = usePersisted();
  const [tried, setTried] = useState(false);

  const v = l1.verdict;
  const missing = verdictMissing(snapshot);

  const file = () => {
    if (missing.length > 0) {
      setTried(true);
      scrollToAndFlash(missing[0].id);
      return;
    }
    setTried(false);
    fileVerdict();
  };

  const citeSelect = (which: "cite1" | "cite2", id: string, flagKey: string) => (
    <select
      id={id}
      className="field"
      value={v[which]}
      aria-describedby={`${id}-help`}
      onChange={(e) => setVerdict({ [which]: e.target.value as RecordId | "" })}
      aria-invalid={l1.flagged.includes(flagKey)}
    >
      <option value="">— choose a record —</option>
      {RECORDS.map((r) => (
        <option key={r.id} value={r.id}>
          {r.id} · {r.source} · {r.when}
        </option>
      ))}
    </select>
  );

  return (
    <div className="space-y-4">
      <Field
        id={IDS.v1}
        label={<span id="v1-label">V1 · Category</span>}
        help="The category holding the most observed evidence of a shortfall on TechSolutions' side."
      >
        <div role="radiogroup" aria-labelledby="v1-label" className="grid gap-2 sm:grid-cols-4">
          {CATEGORIES.map((c) => (
            <label
              key={c.id}
              className={`flex min-h-[44px] cursor-pointer items-center gap-2 rounded-lg border px-3 py-2 text-body transition-colors ${
                v.category === c.id ? "border-accent bg-accentSoft font-semibold" : "border-line bg-paper hover:border-ash"
              }`}
            >
              <input
                type="radio"
                name="v1"
                value={c.id}
                checked={v.category === c.id}
                onChange={() => setVerdict({ category: c.id })}
                className="h-4 w-4 accent-[#8A5A0B]"
              />
              {c.label}
            </label>
          ))}
        </div>
      </Field>

      <div className="grid gap-4 md:grid-cols-2">
        <Field
          id={IDS.v2}
          htmlFor="v2-select"
          label="V2 · First cited record"
          help="Cite an observed record that supports your category. Not an interpretation."
          flagged={l1.flagged.includes("V2")}
          clue={CITE_CLUE}
          clueShown={!!l1.clueShown.V2}
          onShowClue={() => showClue("V2")}
        >
          {citeSelect("cite1", "v2-select", "V2")}
        </Field>
        <Field
          id={IDS.v3}
          htmlFor="v3-select"
          label="V3 · Second cited record"
          help="A different record from V2, also an observation that supports the same category."
          flagged={l1.flagged.includes("V3")}
          clue={CITE_CLUE}
          clueShown={!!l1.clueShown.V3}
          onShowClue={() => showClue("V3")}
        >
          {citeSelect("cite2", "v3-select", "V3")}
        </Field>
      </div>

      <Field
        id={IDS.v4}
        htmlFor="v4-text"
        label={
          <>
            V4 · One sentence <span className="pill-jdg ml-1 align-middle">JUDGED</span>
          </>
        }
        help={
          <>
            Sentence frame: <em>“The file records ___ and ___. It does not record ___.”</em> At least 20 characters.
          </>
        }
        meta={<span className="tnum text-micro text-ash">{v.sentence.trim().length} characters</span>}
      >
        <textarea
          id="v4-text"
          rows={3}
          className="field"
          value={v.sentence}
          onChange={(e) => setVerdict({ sentence: e.target.value })}
          placeholder="The file records … and …. It does not record …."
          aria-describedby="v4-text-help"
        />
      </Field>
      <AnswerKey block={verdictKey()} />

      <div id={IDS.fileNote} className="space-y-3 rounded-lg border border-line bg-mist/50 p-3">
        <div className="flex flex-wrap items-center gap-3">
          <button type="button" onClick={file} className="btn-primary">
            {v.filedAt ? "Update filed note" : "File diagnostic note"}
          </button>
          {v.filedAt && <span className="stamp" aria-label="Filed">Filed</span>}
          <span className="text-caption text-ash">
            {v.filedAt
              ? `Filed ${new Date(v.filedAt).toLocaleString("en-GB")}. This unlocks “Care after go-live” in Task 2.`
              : "Filing needs V1–V4 filled in — not correct. It unlocks a control in Task 2."}
          </span>
        </div>
        {tried && missing.length > 0 && <MissingList items={missing} lead="Before the note can be filed:" />}
      </div>
    </div>
  );
}
