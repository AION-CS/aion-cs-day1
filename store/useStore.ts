"use client";

import { useEffect, useState } from "react";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { RECORD_IDS } from "@/data/kesslerDossier";
import type { Bin, RecordId, VerdictCategory } from "@/data/kesslerDossier";
import { FIGURE_IDS } from "@/data/offers";
import type { FigureId } from "@/data/offers";
import { ROLE_KEYS } from "@/data/motives";
import type { MotiveId, RoleKey } from "@/data/motives";
import { KEY_L1, KEY_L2 } from "@/data/mentorKey";

export const STORAGE_KEY = "cs-d1-v1";
const HISTORY_CAP = 100;

/** Matches a refusal to estimate from one customer. Anything else with a number in it is an overclaim. */
export const REFUSAL_RE =
  /cannot|can't|not possible|insufficient|not enough|no way to|impossible|unknown|n\s*=\s*1|one (customer|observation)|single (customer|case)/i;
export function isOverclaim(text: string): boolean {
  return /\d/.test(text) && !REFUSAL_RE.test(text);
}

export type Placements = Record<RecordId, Bin | null>;
export type Verdict = {
  category: VerdictCategory | null;
  cite1: RecordId | "";
  cite2: RecordId | "";
  sentence: string;
  filedAt: string | null;
};
export type Recommendation = "A" | "B" | "B+care" | null;
export type ExplorerLayers = { onboarding: boolean; incident: boolean; ale: boolean };

export type L1State = {
  placements: Placements;
  history: Placements[];
  future: Placements[];
  checks: number;
  /** Record ids (E1–E8) and verdict cite fields ("V2", "V3") flagged by the last check. */
  flagged: string[];
  clueShown: Record<string, boolean>;
  verdict: Verdict;
};

export type L2State = {
  explorerLayers: ExplorerLayers;
  careOn: boolean;
  fillins: Record<FigureId, string>;
  motives: Record<RoleKey, MotiveId | null>;
  recommendation: Recommendation;
  justification: string;
  limits: string;
  q6: string;
  q6Submitted: boolean;
  q6Overclaim: boolean;
  checks: number;
  flagged: FigureId[];
  clueShown: Record<string, boolean>;
};

export type Persisted = {
  participant: { no: string; name: string };
  ui: { bannerDismissed: boolean; sectionsRead: Record<string, boolean> };
  l1: L1State;
  l2: L2State;
  /** Empty stub — Route 2 (Level 3) is built in the next release. */
  route2: Record<string, never>;
};

type Session = {
  mentorUnlocked: boolean;
  /** Bumped by a reset so components holding local state remount clean. */
  resetCount: number;
  /** The figure field last focused — where the Calculator copies its result. */
  focusedFigure: FigureId | null;
};

type Actions = {
  setParticipant: (patch: Partial<Persisted["participant"]>) => void;
  dismissBanner: () => void;
  toggleRead: (cardId: string, value?: boolean) => void;

  placeRecord: (id: RecordId, bin: Bin | null) => void;
  undoPlacement: () => void;
  redoPlacement: () => void;
  checkSort: (flagged: string[]) => void;
  showL1Clue: (id: string) => void;
  setVerdict: (patch: Partial<Omit<Verdict, "filedAt">>) => void;
  fileVerdict: () => void;

  setLayer: (id: keyof ExplorerLayers, value: boolean) => void;
  setCare: (value: boolean) => void;
  setFillin: (id: FigureId, value: string) => void;
  checkFigures: (flagged: FigureId[]) => void;
  showL2Clue: (id: string) => void;
  chooseMotive: (role: RoleKey, motive: MotiveId | null) => void;
  setRecommendation: (r: Recommendation) => void;
  setJustification: (t: string) => void;
  setLimits: (t: string) => void;
  setQ6: (t: string) => void;
  submitQ6: () => void;

  setFocusedFigure: (id: FigureId | null) => void;
  setMentorUnlocked: (v: boolean) => void;
  mentorFill: () => void;
  resetRoute1: () => void;
};

const emptyPlacements = (): Placements =>
  Object.fromEntries(RECORD_IDS.map((id) => [id, null])) as Placements;

const emptyL1 = (): L1State => ({
  placements: emptyPlacements(),
  history: [],
  future: [],
  checks: 0,
  flagged: [],
  clueShown: {},
  verdict: { category: null, cite1: "", cite2: "", sentence: "", filedAt: null },
});

const emptyL2 = (): L2State => ({
  explorerLayers: { onboarding: false, incident: false, ale: false },
  careOn: false,
  fillins: Object.fromEntries(FIGURE_IDS.map((id) => [id, ""])) as Record<FigureId, string>,
  motives: Object.fromEntries(ROLE_KEYS.map((k) => [k, null])) as Record<RoleKey, MotiveId | null>,
  recommendation: null,
  justification: "",
  limits: "",
  q6: "",
  q6Submitted: false,
  q6Overclaim: false,
  checks: 0,
  flagged: [],
  clueShown: {},
});

const emptyPersisted = (): Persisted => ({
  participant: { no: "", name: "" },
  ui: { bannerDismissed: false, sectionsRead: {} },
  l1: emptyL1(),
  l2: emptyL2(),
  route2: {},
});

/** Flags survive only while the thing they flag is unchanged. */
const pruneFlags = (flagged: string[], before: Placements, after: Placements) =>
  flagged.filter((f) => !(f in after) || before[f as RecordId] === after[f as RecordId]);

const pushCapped = <T,>(list: T[], item: T) => [...list, item].slice(-HISTORY_CAP);

export const useStore = create<Persisted & Session & Actions>()(
  persist(
    (set, get) => ({
      ...emptyPersisted(),
      mentorUnlocked: false,
      resetCount: 0,
      focusedFigure: null,

      setParticipant: (patch) => set((s) => ({ participant: { ...s.participant, ...patch } })),
      dismissBanner: () => set((s) => ({ ui: { ...s.ui, bannerDismissed: true } })),
      toggleRead: (cardId, value) =>
        set((s) => ({
          ui: {
            ...s.ui,
            sectionsRead: { ...s.ui.sectionsRead, [cardId]: value ?? !s.ui.sectionsRead[cardId] },
          },
        })),

      // --- Task 1 -----------------------------------------------------------
      placeRecord: (id, bin) =>
        set((s) => {
          const before = s.l1.placements;
          if (before[id] === bin) return {};
          const after = { ...before, [id]: bin };
          const clueShown = { ...s.l1.clueShown };
          delete clueShown[id];
          return {
            l1: {
              ...s.l1,
              placements: after,
              history: pushCapped(s.l1.history, before),
              future: [],
              flagged: pruneFlags(s.l1.flagged, before, after).filter((f) => f !== "V2" && f !== "V3"),
              clueShown,
            },
          };
        }),
      undoPlacement: () =>
        set((s) => {
          const prev = s.l1.history[s.l1.history.length - 1];
          if (!prev) return {};
          return {
            l1: {
              ...s.l1,
              placements: prev,
              history: s.l1.history.slice(0, -1),
              future: pushCapped(s.l1.future, s.l1.placements),
              flagged: pruneFlags(s.l1.flagged, s.l1.placements, prev).filter((f) => f !== "V2" && f !== "V3"),
            },
          };
        }),
      redoPlacement: () =>
        set((s) => {
          const next = s.l1.future[s.l1.future.length - 1];
          if (!next) return {};
          return {
            l1: {
              ...s.l1,
              placements: next,
              history: pushCapped(s.l1.history, s.l1.placements),
              future: s.l1.future.slice(0, -1),
              flagged: pruneFlags(s.l1.flagged, s.l1.placements, next).filter((f) => f !== "V2" && f !== "V3"),
            },
          };
        }),
      checkSort: (flagged) =>
        set((s) => ({ l1: { ...s.l1, checks: s.l1.checks + 1, flagged, clueShown: {} } })),
      showL1Clue: (id) => set((s) => ({ l1: { ...s.l1, clueShown: { ...s.l1.clueShown, [id]: true } } })),
      setVerdict: (patch) =>
        set((s) => {
          let flagged = s.l1.flagged;
          if ("category" in patch) flagged = flagged.filter((f) => f !== "V2" && f !== "V3");
          if ("cite1" in patch) flagged = flagged.filter((f) => f !== "V2");
          if ("cite2" in patch) flagged = flagged.filter((f) => f !== "V3");
          return { l1: { ...s.l1, flagged, verdict: { ...s.l1.verdict, ...patch } } };
        }),
      fileVerdict: () =>
        set((s) => ({ l1: { ...s.l1, verdict: { ...s.l1.verdict, filedAt: new Date().toISOString() } } })),

      // --- Task 2 -----------------------------------------------------------
      setLayer: (id, value) =>
        set((s) => ({ l2: { ...s.l2, explorerLayers: { ...s.l2.explorerLayers, [id]: value } } })),
      setCare: (value) => set((s) => ({ l2: { ...s.l2, careOn: value } })),
      setFillin: (id, value) =>
        set((s) => ({
          l2: {
            ...s.l2,
            fillins: { ...s.l2.fillins, [id]: value },
            flagged: s.l2.flagged.filter((f) => f !== id),
          },
        })),
      checkFigures: (flagged) =>
        set((s) => ({ l2: { ...s.l2, checks: s.l2.checks + 1, flagged, clueShown: {} } })),
      showL2Clue: (id) => set((s) => ({ l2: { ...s.l2, clueShown: { ...s.l2.clueShown, [id]: true } } })),
      chooseMotive: (role, motive) =>
        set((s) => ({ l2: { ...s.l2, motives: { ...s.l2.motives, [role]: motive } } })),
      setRecommendation: (r) => set((s) => ({ l2: { ...s.l2, recommendation: r } })),
      setJustification: (t) => set((s) => ({ l2: { ...s.l2, justification: t } })),
      setLimits: (t) => set((s) => ({ l2: { ...s.l2, limits: t } })),
      setQ6: (t) => set((s) => ({ l2: { ...s.l2, q6: t, q6Overclaim: isOverclaim(t) } })),
      submitQ6: () =>
        set((s) => ({ l2: { ...s.l2, q6Submitted: true, q6Overclaim: isOverclaim(s.l2.q6) } })),

      // --- session / mentor / reset ----------------------------------------
      setFocusedFigure: (id) => set({ focusedFigure: id }),
      setMentorUnlocked: (v) => set({ mentorUnlocked: v }),

      mentorFill: () =>
        set((s) => {
          const l1 = emptyL1();
          l1.placements = { ...KEY_L1.placements };
          l1.verdict = { ...KEY_L1.verdict, filedAt: new Date().toISOString() };
          const l2 = emptyL2();
          l2.fillins = { ...KEY_L2.fillins };
          l2.motives = { ...KEY_L2.motives };
          l2.recommendation = KEY_L2.recommendation;
          l2.justification = KEY_L2.justification;
          l2.limits = KEY_L2.limits;
          l2.q6 = KEY_L2.q6;
          l2.q6Submitted = true;
          l2.q6Overclaim = isOverclaim(KEY_L2.q6);
          l2.explorerLayers = { onboarding: true, incident: true, ale: true };
          return { l1, l2, resetCount: s.resetCount + 1 };
        }),

      // Route 1 state only — the participant strip stays.
      resetRoute1: () =>
        set((s) => ({
          l1: emptyL1(),
          l2: emptyL2(),
          ui: { ...s.ui, bannerDismissed: false, sectionsRead: {} },
          resetCount: s.resetCount + 1,
        })),
    }),
    {
      name: STORAGE_KEY,
      version: 1,
      skipHydration: true,
      storage: createJSONStorage(() => localStorage),
      // Session-only flags (mentor unlock, focus, reset counter) never persist.
      partialize: (s) => ({
        participant: s.participant,
        ui: s.ui,
        l1: s.l1,
        l2: s.l2,
        route2: s.route2,
      }),
      migrate: (persisted) => persisted as Persisted,
      // A stored blob from an older shape must never leave a field undefined.
      merge: (persisted, current) => {
        const p = (persisted ?? {}) as Partial<Persisted>;
        const base = emptyPersisted();
        return {
          ...current,
          participant: { ...base.participant, ...p.participant },
          ui: { ...base.ui, ...p.ui },
          l1: {
            ...base.l1,
            ...p.l1,
            placements: { ...base.l1.placements, ...p.l1?.placements },
            verdict: { ...base.l1.verdict, ...p.l1?.verdict },
          },
          l2: {
            ...base.l2,
            ...p.l2,
            explorerLayers: { ...base.l2.explorerLayers, ...p.l2?.explorerLayers },
            fillins: { ...base.l2.fillins, ...p.l2?.fillins },
            motives: { ...base.l2.motives, ...p.l2?.motives },
          },
          route2: {},
        };
      },
    },
  ),
);

/**
 * The store is created with `skipHydration`, so the server render and the
 * first client paint both see empty defaults (no hydration mismatch). This hook
 * — mounted once by <StoreHydrator/> — reads localStorage after mount and
 * reports when it has finished, for UI that must not flash a default
 * (a dismissed banner, a filed stamp).
 */
export function useHydrated() {
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => {
    const unsub = useStore.persist.onFinishHydration(() => setHydrated(true));
    if (useStore.persist.hasHydrated()) setHydrated(true);
    return unsub;
  }, []);
  return hydrated;
}

export function rehydrateStore() {
  return useStore.persist.rehydrate();
}
