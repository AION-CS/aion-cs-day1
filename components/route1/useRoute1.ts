"use client";

import { useProgress, useHydrated } from "@/lib/store";
import type { MissingItem } from "@/components/ui/MissingList";
import {
  GENERIC_FALLBACK_CLUE,
  INITIATIVES,
  LENSES,
  LOAD_FIELD,
  R1,
  STRUCTURE_QUESTIONS,
  resolveZone,
  type Initiative,
  type LensId,
  type LoadAnswer,
  type StructureAnswer,
  type ZoneId,
} from "@/lib/route1";

/** DOM ids the missing-item list scrolls to and flashes. */
export const domId = {
  name: "r1-name",

  task: "task",
  board: "r1-board",
  init: (id: string) => `r1-init-${id}`,
  initLoad: (id: string) => `r1-init-${id}-load`,
  initStructure: (id: string) => `r1-init-${id}-structure`,
  initLens: (id: string) => `r1-init-${id}-lens`,
  initWhy: (id: string) => `r1-init-${id}-why`,
  closing: "r1-closing",

  export: "r1-export",
};

export type InitiativeState = {
  initiative: Initiative;
  load: LoadAnswer | null;
  structure: StructureAnswer | null;
  /** Derived from the two answers — never chosen directly (lib/route1/task1.ts `resolveZone`). */
  zone: ZoneId | null;
  lens: LensId | null;
  rationale: string;
  checkCount: number;
  /** Both questions answered, so the card has resolved into a zone. */
  diagnosed: boolean;
  complete: boolean;
};

/**
 * A check reports one verdict for the whole initiative and never says which of
 * the two questions is wrong: the structure question is binary, so naming it
 * would be the answer (CLAUDE.md §4, §12). The clue points at the reasoning to
 * redo and sharpens on the second and later checks of the same initiative.
 */
export type CheckResult = { holds: true } | { holds: false; clue: string; tier: "soft" | "sharp" };

export function checkInitiative(state: InitiativeState, checkCountAfter: number): CheckResult {
  const { initiative, load, structure, lens } = state;
  if (!load || !structure) return { holds: true };

  const tier: "soft" | "sharp" = checkCountAfter >= 2 ? "sharp" : "soft";
  const clueFor = (tiers: { soft: string; sharp: string } | undefined) =>
    (tiers ?? GENERIC_FALLBACK_CLUE)[tier];

  if (load !== initiative.expectedLoad) {
    return { holds: false, clue: clueFor(initiative.loadClue), tier };
  }
  if (structure !== initiative.expectedStructure) {
    return { holds: false, clue: clueFor(initiative.structureClue), tier };
  }
  // An unassigned lens is incomplete, not wrong — only a chosen one can miss.
  if (lens && !initiative.acceptedLenses.includes(lens)) {
    return { holds: false, clue: clueFor(initiative.lensClue), tier };
  }
  return { holds: true };
}

const isLoadAnswer = (v: string | undefined): v is LoadAnswer =>
  !!v && LOAD_FIELD.options.some((o) => o.id === v);

const isStructureAnswer = (v: string | undefined, initiative: Initiative): v is StructureAnswer =>
  !!v && STRUCTURE_QUESTIONS[initiative.structureQuestion].options.some((o) => o.id === v);

const isLensId = (v: string | undefined): v is LensId => !!v && LENSES.some((l) => l.id === v);

/**
 * Joins the shared progress store to Route 1 Task 1, one hook. One route has
 * one `missing` list and one definition of done (CLAUDE.md §12).
 */
export function useRoute1() {
  const hydrated = useHydrated();
  const notes = useProgress((s) => s.notes);
  const choices = useProgress((s) => s.choices);

  const name = notes[R1.name] ?? "";
  const closing = (notes[R1.closing] ?? "").trim();

  const cards: InitiativeState[] = INITIATIVES.map((initiative) => {
    const rawLoad = choices[R1.load(initiative.id)];
    const load = isLoadAnswer(rawLoad) ? rawLoad : null;
    const rawStructure = choices[R1.structure(initiative.id)];
    const structure = isStructureAnswer(rawStructure, initiative) ? rawStructure : null;
    const rawLens = choices[R1.lens(initiative.id)];
    const lens = isLensId(rawLens) ? rawLens : null;
    const rationale = (notes[R1.rationale(initiative.id)] ?? "").trim();
    const checkCount = Number(notes[R1.checkCount(initiative.id)] ?? "0") || 0;

    const diagnosed = !!load && !!structure;

    return {
      initiative,
      load,
      structure,
      zone: diagnosed ? resolveZone(load!, structure!) : null,
      lens,
      rationale,
      checkCount,
      diagnosed,
      complete: diagnosed && !!lens && rationale.length > 0,
    };
  });

  const cardById = (id: string) => cards.find((c) => c.initiative.id === id)!;
  const byZone = (zone: ZoneId) => cards.filter((c) => c.zone === zone);
  const undiagnosed = cards.filter((c) => !c.diagnosed);
  const diagnosedCount = cards.filter((c) => c.diagnosed).length;
  const completeCount = cards.filter((c) => c.complete).length;

  // -- Missing list ---------------------------------------------------------
  // Standard #1: one entry per concretely-missing thing, named, in page order.
  const missing: MissingItem[] = [];
  if (!name.trim()) missing.push({ id: domId.name, label: "Your name — needed to label the export" });

  for (const c of cards) {
    const who = `Initiative ${c.initiative.n} "${c.initiative.short}"`;
    if (!c.load) {
      missing.push({
        id: domId.initLoad(c.initiative.id),
        label: `${who} — the resource-load question is still unanswered`,
      });
    }
    if (!c.structure) {
      missing.push({
        id: domId.initStructure(c.initiative.id),
        label: `${who} — the "${STRUCTURE_QUESTIONS[c.initiative.structureQuestion].label}" question is still unanswered`,
      });
    }
    if (c.diagnosed && !c.lens) {
      missing.push({ id: domId.initLens(c.initiative.id), label: `${who} — no lens assigned yet` });
    }
    if (c.diagnosed && !c.rationale) {
      missing.push({ id: domId.initWhy(c.initiative.id), label: `${who} — no one-line rationale written yet` });
    }
  }

  if (!closing) {
    missing.push({
      id: domId.closing,
      label: "Closing question — which two initiatives are attractive now but structurally weak?",
    });
  }

  return {
    hydrated,
    name,
    closing,

    cards,
    cardById,
    byZone,
    undiagnosed,
    diagnosedCount,
    completeCount,
    totalCards: INITIATIVES.length,

    missing,
    allComplete: missing.length === 0,
  };
}

export type Route1State = ReturnType<typeof useRoute1>;
