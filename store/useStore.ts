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
import { KEY_L1, KEY_L2, KEY_L3 } from "@/data/mentorKey";
import { G_IDS } from "@/data/leverData";
import type { GId, LeverId, Levers, Position, Scenario } from "@/data/leverData";
import { ACTIVITIES, ROLES, emptyRaci } from "@/data/raciModel";
import type { ActivityId, Chip, RaciGridState, RoleId } from "@/data/raciModel";
import { MAP_ROW_IDS } from "@/data/mapping";
import { FIGURE_BUILDERS, gBuilders, modelParts } from "@/lib/calcBuilder";
import type { Bucket, CiteChoice, MapRowId } from "@/data/mapping";

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

export type MapAnswer = { bucket: Bucket | null; cite: CiteChoice };
export type MappingState = { rows: Record<MapRowId, MapAnswer>; sentence: string };

export type L1State = {
  placements: Placements;
  history: Placements[];
  future: Placements[];
  checks: number;
  /** Record ids (E1–E8) and verdict cite fields ("V2", "V3") flagged by the last check. */
  flagged: string[];
  clueShown: Record<string, boolean>;
  verdict: Verdict;
  /** Block 1.3 — the file read against three constructs and three ropes. */
  mapping: MappingState;
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
  /** The formula builder's parts under each figure, keyed "F3.intRate". */
  parts: Record<string, string>;
  /** Part keys flagged by the last check. */
  partFlags: string[];
};

export type GovRow = { decision: string; owner: string; date: string };
export type Route3State = {
  levers: Levers;
  scenario: Scenario;
  scenariosViewed: Record<Scenario, boolean>;
  fillins: Record<GId, string>;
  allocFiledAt: string | null;
  raci: RaciGridState;
  raciFiledAt: string | null;
  risk: string;
  governance: GovRow[];
  notFunding: string;
  exec: string;
  checks: number;
  /** G1–G6 flagged by the last check. */
  flagged: string[];
  clueShown: Record<string, boolean>;
  /** The formula builder's parts under G1, G4, G5 and G6, keyed "G1.l2". */
  parts: Record<string, string>;
  /** Part keys flagged by the last check. */
  partFlags: string[];
};

export type Persisted = {
  participant: { name: string };
  ui: { bannerDismissed: Record<string, boolean>; sectionsRead: Record<string, boolean> };
  l1: L1State;
  l2: L2State;
  /** Route 3 · Level 3 — the allocation, RACI and memo. */
  route3: Route3State;
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
  dismissBanner: (routeKey: string) => void;
  toggleRead: (cardId: string, value?: boolean) => void;

  placeRecord: (id: RecordId, bin: Bin | null) => void;
  undoPlacement: () => void;
  redoPlacement: () => void;
  checkSort: (flagged: string[]) => void;
  showL1Clue: (id: string) => void;
  setVerdict: (patch: Partial<Omit<Verdict, "filedAt">>) => void;
  setMapBucket: (row: MapRowId, bucket: Bucket | null) => void;
  setMapCite: (row: MapRowId, cite: CiteChoice) => void;
  setMapSentence: (t: string) => void;
  checkMapping: (flagged: string[]) => void;
  fileVerdict: () => void;

  setLayer: (id: keyof ExplorerLayers, value: boolean) => void;
  setCare: (value: boolean) => void;
  setFillin: (id: FigureId, value: string) => void;
  checkFigures: (flagged: FigureId[], partFlags: string[]) => void;
  setL2Part: (key: string, value: string) => void;
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
  resetRoute: (route: 1 | 2 | 3 | null) => void;

  setLever: (id: LeverId, position: Position) => void;
  setScenario: (s: Scenario) => void;
  setG: (id: GId, value: string) => void;
  checkG: (flagged: string[], partFlags: string[]) => void;
  setL3Part: (key: string, value: string) => void;
  showL3Clue: (id: string) => void;
  fileAllocation: () => void;
  setRaciChip: (activity: ActivityId, role: RoleId, chip: Chip | null) => void;
  fileRaci: () => void;
  setRisk: (t: string) => void;
  setGov: (i: number, patch: Partial<GovRow>) => void;
  setNotFunding: (t: string) => void;
  setExec: (t: string) => void;
};

const emptyPlacements = (): Placements =>
  Object.fromEntries(RECORD_IDS.map((id) => [id, null])) as Placements;

const emptyMapping = (): MappingState => ({
  rows: Object.fromEntries(MAP_ROW_IDS.map((id) => [id, { bucket: null, cite: "" }])) as Record<MapRowId, MapAnswer>,
  sentence: "",
});

const isMapFlag = (f: string) => /^M\d/.test(f);

const emptyL1 = (): L1State => ({
  placements: emptyPlacements(),
  history: [],
  future: [],
  checks: 0,
  flagged: [],
  clueShown: {},
  verdict: { category: null, cite1: "", cite2: "", sentence: "", filedAt: null },
  mapping: emptyMapping(),
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
  parts: {},
  partFlags: [],
});

const emptyGov = (): GovRow[] => Array.from({ length: 4 }, () => ({ decision: "", owner: "", date: "" }));

const emptyRoute3 = (): Route3State => ({
  levers: { l1: "none", l2: "none", l3: "none" },
  scenario: "statusQuo",
  scenariosViewed: { statusQuo: false, priceWar: false },
  fillins: Object.fromEntries(G_IDS.map((g) => [g, ""])) as Record<GId, string>,
  allocFiledAt: null,
  raci: emptyRaci(),
  raciFiledAt: null,
  risk: "",
  governance: emptyGov(),
  notFunding: "",
  exec: "",
  checks: 0,
  flagged: [],
  clueShown: {},
  parts: {},
  partFlags: [],
});

const emptyPersisted = (): Persisted => ({
  participant: { name: "" },
  ui: { bannerDismissed: {}, sectionsRead: {} },
  l1: emptyL1(),
  l2: emptyL2(),
  route3: emptyRoute3(),
});

/** Flags survive only while the thing they flag is unchanged. */
const pruneFlags = (flagged: string[], before: Placements, after: Placements) =>
  flagged.filter((f) => !(f in after) || before[f as RecordId] === after[f as RecordId]);

const pushCapped = <T,>(list: T[], item: T) => [...list, item].slice(-HISTORY_CAP);

function mergeRaci(stored: Partial<RaciGridState> | undefined): RaciGridState {
  const base = emptyRaci();
  if (!stored || typeof stored !== "object") return base;
  for (const a of ACTIVITIES) for (const r of ROLES) base[a.id][r.id] = stored[a.id]?.[r.id] ?? null;
  return base;
}

function mergeGov(stored: GovRow[] | undefined): GovRow[] {
  const base = emptyGov();
  if (!Array.isArray(stored)) return base;
  return base.map((row, i) => ({ ...row, ...(stored[i] ?? {}) }));
}

export const useStore = create<Persisted & Session & Actions>()(
  persist(
    (set, get) => ({
      ...emptyPersisted(),
      mentorUnlocked: false,
      resetCount: 0,
      focusedFigure: null,

      setParticipant: (patch) => set((s) => ({ participant: { ...s.participant, ...patch } })),
      dismissBanner: (routeKey) =>
        set((s) => ({ ui: { ...s.ui, bannerDismissed: { ...s.ui.bannerDismissed, [routeKey]: true } } })),
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
        set((s) => ({
          l1: {
            ...s.l1,
            checks: s.l1.checks + 1,
            // a sort check replaces the record and citation flags and leaves the mapping flags alone
            flagged: [...flagged, ...s.l1.flagged.filter(isMapFlag)],
            clueShown: Object.fromEntries(Object.entries(s.l1.clueShown).filter(([k]) => isMapFlag(k))),
          },
        })),
      setMapBucket: (row, bucket) =>
        set((s) => ({
          l1: {
            ...s.l1,
            flagged: s.l1.flagged.filter((f) => f !== row),
            mapping: { ...s.l1.mapping, rows: { ...s.l1.mapping.rows, [row]: { ...s.l1.mapping.rows[row], bucket } } },
          },
        })),
      setMapCite: (row, cite) =>
        set((s) => ({
          l1: {
            ...s.l1,
            flagged: s.l1.flagged.filter((f) => f !== row),
            mapping: { ...s.l1.mapping, rows: { ...s.l1.mapping.rows, [row]: { ...s.l1.mapping.rows[row], cite } } },
          },
        })),
      setMapSentence: (t) => set((s) => ({ l1: { ...s.l1, mapping: { ...s.l1.mapping, sentence: t } } })),
      checkMapping: (flagged) =>
        set((s) => ({
          l1: {
            ...s.l1,
            checks: s.l1.checks + 1,
            flagged: [...s.l1.flagged.filter((f) => !isMapFlag(f)), ...flagged],
            clueShown: Object.fromEntries(Object.entries(s.l1.clueShown).filter(([k]) => !isMapFlag(k))),
          },
        })),
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
      checkFigures: (flagged, partFlags) =>
        set((s) => ({ l2: { ...s.l2, checks: s.l2.checks + 1, flagged, partFlags, clueShown: {} } })),
      setL2Part: (key, value) =>
        set((s) => ({
          l2: { ...s.l2, parts: { ...s.l2.parts, [key]: value }, partFlags: s.l2.partFlags.filter((f) => f !== key) },
        })),
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

      // Mentor autofill: every answer in Routes 1, 2 and 3, plus a participant
      // name if they are empty, so the note can be exported straight away.
      mentorFill: () =>
        set((s) => {
          const l1 = emptyL1();
          l1.placements = { ...KEY_L1.placements };
          l1.verdict = { ...KEY_L1.verdict, filedAt: new Date().toISOString() };
          l1.mapping = {
            rows: Object.fromEntries(MAP_ROW_IDS.map((id) => [id, { ...KEY_L1.mapping.rows[id] }])) as Record<MapRowId, MapAnswer>,
            sentence: KEY_L1.mapping.sentence,
          };
          const l2 = emptyL2();
          l2.fillins = { ...KEY_L2.fillins };
          l2.parts = modelParts(FIGURE_BUILDERS);
          l2.motives = { ...KEY_L2.motives };
          l2.recommendation = KEY_L2.recommendation;
          l2.justification = KEY_L2.justification;
          l2.limits = KEY_L2.limits;
          l2.q6 = KEY_L2.q6;
          l2.q6Submitted = true;
          l2.q6Overclaim = isOverclaim(KEY_L2.q6);
          l2.explorerLayers = { onboarding: true, incident: true, ale: true };
          const participant = { name: s.participant.name.trim() ? s.participant.name : "Mentor Check" };
          const now = new Date().toISOString();
          const r3 = emptyRoute3();
          r3.levers = { ...KEY_L3.levers };
          r3.scenariosViewed = { statusQuo: true, priceWar: true };
          r3.fillins = { ...KEY_L3.fillins };
          r3.parts = modelParts(gBuilders(KEY_L3.levers));
          for (const a of ACTIVITIES) for (const r of ROLES) r3.raci[a.id][r.id] = KEY_L3.raci[a.id][r.id] ?? null;
          r3.allocFiledAt = now;
          r3.raciFiledAt = now;
          r3.risk = KEY_L3.risk;
          r3.governance = KEY_L3.governance.map((g) => ({ ...g }));
          r3.notFunding = KEY_L3.notFunding;
          r3.exec = KEY_L3.exec;
          return { participant, l1, l2, route3: r3, resetCount: s.resetCount + 1 };
        }),

      // --- Task 3 (Route 3) ---------------------------------------------------
      setLever: (id, position) =>
        set((s) => ({
          route3: {
            ...s.route3,
            levers: { ...s.route3.levers, [id]: position },
            // a lever change changes what the board reads, so earlier G flags no longer apply
            flagged: [],
            partFlags: [],
            clueShown: {},
          },
        })),
      setScenario: (sc) =>
        set((s) => ({
          route3: { ...s.route3, scenario: sc, scenariosViewed: { ...s.route3.scenariosViewed, [sc]: true } },
        })),
      setG: (id, value) =>
        set((s) => ({
          route3: {
            ...s.route3,
            fillins: { ...s.route3.fillins, [id]: value },
            flagged: s.route3.flagged.filter((f) => f !== id),
          },
        })),
      checkG: (flagged, partFlags) =>
        set((s) => ({ route3: { ...s.route3, checks: s.route3.checks + 1, flagged, partFlags, clueShown: {} } })),
      setL3Part: (key, value) =>
        set((s) => ({
          route3: { ...s.route3, parts: { ...s.route3.parts, [key]: value }, partFlags: s.route3.partFlags.filter((f) => f !== key) },
        })),
      showL3Clue: (id) =>
        set((s) => ({ route3: { ...s.route3, clueShown: { ...s.route3.clueShown, [id]: true } } })),
      fileAllocation: () => set((s) => ({ route3: { ...s.route3, allocFiledAt: new Date().toISOString() } })),
      setRaciChip: (activity, role, chip) =>
        set((s) => ({
          route3: {
            ...s.route3,
            raci: { ...s.route3.raci, [activity]: { ...s.route3.raci[activity], [role]: chip } },
          },
        })),
      fileRaci: () => set((s) => ({ route3: { ...s.route3, raciFiledAt: new Date().toISOString() } })),
      setRisk: (t) => set((s) => ({ route3: { ...s.route3, risk: t } })),
      setGov: (i, patch) =>
        set((s) => ({
          route3: {
            ...s.route3,
            governance: s.route3.governance.map((r, k) => (k === i ? { ...r, ...patch } : r)),
          },
        })),
      setNotFunding: (t) => set((s) => ({ route3: { ...s.route3, notFunding: t } })),
      setExec: (t) => set((s) => ({ route3: { ...s.route3, exec: t } })),

      // One route's state only (Route 1 = Materi A + Task 1, Route 2 = Materi B + Task 2).
      // The participant strip stays. `null` clears both routes.
      resetRoute: (route) =>
        set((s) => {
          const prefix = route === 1 ? "A" : route === 2 ? "B" : "C";
          const keep = (k: string) => (route === null ? false : !k.startsWith(prefix));
          const sectionsRead = Object.fromEntries(Object.entries(s.ui.sectionsRead).filter(([k]) => keep(k)));
          const bannerDismissed = { ...s.ui.bannerDismissed };
          if (route === null) for (const k of Object.keys(bannerDismissed)) delete bannerDismissed[k];
          else delete bannerDismissed[`r${route}`];
          return {
            l1: route === null || route === 1 ? emptyL1() : s.l1,
            l2: route === null || route === 2 ? emptyL2() : s.l2,
            route3: route === null || route === 3 ? emptyRoute3() : s.route3,
            ui: { bannerDismissed, sectionsRead },
            resetCount: s.resetCount + 1,
          };
        }),
    }),
    {
      name: STORAGE_KEY,
      version: 4,
      skipHydration: true,
      storage: createJSONStorage(() => localStorage),
      // Session-only flags (mentor unlock, focus, reset counter) never persist.
      partialize: (s) => ({
        participant: s.participant,
        ui: s.ui,
        l1: s.l1,
        l2: s.l2,
        route3: s.route3,
      }),
      // v1 -> v2: Route 3 (Level 3) state was added. v2 -> v3: the typed participant number was dropped
      // (the file number now comes from the route). v3 -> v4: the formula builders' parts and part flags
      // were added to l2 and route3. Old blobs are brought to the current shape here; merge fills the rest.
      migrate: (persisted) => {
        const p = (persisted ?? {}) as Partial<Persisted> & { participant?: { no?: string; name?: string } };
        return {
          ...p,
          participant: { name: p.participant?.name ?? "" },
          route3: { ...emptyRoute3(), ...(p.route3 as Partial<Route3State> | undefined) },
        } as Persisted;
      },
      // A stored blob from an older shape must never leave a field undefined.
      merge: (persisted, current) => {
        const p = (persisted ?? {}) as Partial<Persisted>;
        const base = emptyPersisted();
        return {
          ...current,
          participant: { name: p.participant?.name ?? base.participant.name },
          ui: {
            sectionsRead: { ...base.ui.sectionsRead, ...p.ui?.sectionsRead },
            // An older blob stored a single boolean here; anything that is not a map is dropped.
            bannerDismissed:
              p.ui && typeof p.ui.bannerDismissed === "object" && p.ui.bannerDismissed !== null
                ? { ...p.ui.bannerDismissed }
                : {},
          },
          l1: {
            ...base.l1,
            ...p.l1,
            placements: { ...base.l1.placements, ...p.l1?.placements },
            verdict: { ...base.l1.verdict, ...p.l1?.verdict },
            mapping: {
              sentence: p.l1?.mapping?.sentence ?? "",
              rows: { ...base.l1.mapping.rows, ...p.l1?.mapping?.rows },
            },
          },
          l2: {
            ...base.l2,
            ...p.l2,
            explorerLayers: { ...base.l2.explorerLayers, ...p.l2?.explorerLayers },
            fillins: { ...base.l2.fillins, ...p.l2?.fillins },
            motives: { ...base.l2.motives, ...p.l2?.motives },
            parts: { ...base.l2.parts, ...p.l2?.parts },
            partFlags: Array.isArray(p.l2?.partFlags) ? p.l2.partFlags : [],
          },
          route3: {
            ...base.route3,
            ...p.route3,
            levers: { ...base.route3.levers, ...p.route3?.levers },
            scenariosViewed: { ...base.route3.scenariosViewed, ...p.route3?.scenariosViewed },
            fillins: { ...base.route3.fillins, ...p.route3?.fillins },
            parts: { ...base.route3.parts, ...p.route3?.parts },
            partFlags: Array.isArray(p.route3?.partFlags) ? p.route3.partFlags : [],
            raci: mergeRaci(p.route3?.raci),
            governance: mergeGov(p.route3?.governance),
          },
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
