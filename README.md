# Retention Lab · Day 1

**Customer Retention & Buying Behaviour in B2B IT Sales · Module 1, Day 1 of 2.**
A self-study companion: study material, two working documents (a Diagnostic Note and a Calculation
Note) and a live evidence board. One route per level: Routes 1 and 2 are built; Route 3 (Level 3) is a
placeholder that is already wired into the nav and the store.

This repo was rebuilt in place from the Day 16 codebase (Green IT KPIs). Its history is kept; nothing
of the Day 16 content remains in the tree.

## Routes

| Route | Content | Export |
|---|---|---|
| `/route-1/` | Level 1 · Materi A (A1–A8, 60 min) → Task 1 Diagnostic Note (15) | `{no}-{name}-day1-l1-diagnostic.html` |
| `/route-2/` | Level 2 · Materi B (B1–B7, 60 min) → Task 2 Calculation Note (15) | `{no}-{name}-day1-l2-calculation.html` |
| `/route-3/` | Placeholder — Level 3, management decision, next release | — |

## Stack

Next.js 14 App Router · TypeScript strict · Tailwind (tokens in `tailwind.config.ts`) · Zustand + `persist`
(key `cs-d1-v1`, `skipHydration` + `StoreHydrator`) · static export (`output: "export"`, `trailingSlash`).
No animation, drag-and-drop, PDF or chart library: hand-written SVG, CSS keyframes, native HTML5 DnD with a
click-to-place fallback, `window.print()`. Hosting in a sub-folder: set `NEXT_PUBLIC_BASE_PATH`.

```bash
npm install
npm run dev          # http://localhost:3000
npm run typecheck
npm run build        # writes the static site to out/  (stop `npm run dev` first)
```

## Layout

```
app/                  page.tsx (home) · route-1/ · route-2/ · route-3/ (placeholder)
components/chrome/    MentorBar, TopBar, ParticipantStrip, SectionRail, HashFlash, Footer, StoreHydrator
components/ui/        MaterialCard, JourneyMap, TcoStack, MotiveMap, Calculator, ExportBar, MissingList, Field, AnswerBlock …
components/materi/    one file per card group (A1–4, A5–8, B1–3, B4–7)
components/task1|2/   the two tasks
data/                 kesslerDossier, offers, motives, references, mentorKey, materialIndex
lib/                  parseAmount, safeCalc (no eval), slug, flash, checks, missing, exportDoc, svgModels, progress
store/                useStore (slices), selectors (getL1Verdict, getL2Figures, getL2Recommendation)
```

## Reuse (Route 3 forward-compat)

`JourneyMap`, `TcoStack` and `MotiveMap` take data by props: Materi uses generic/Alpenwerk data, the tasks use
the Kessler data. The `route3` slice is an empty stub; the selectors in `store/selectors.ts` are what Route 3 quotes back.

## Mentor bar

The first element on every page. Enter `muchson123` once and every model answer of Routes 1 and 2 fills in (plus a
participant number and name if empty), so each export downloads straight away — for checking the site without typing
through it. Client-side convenience gate, not security. Model answers: `data/mentorKey.ts`.

## Notes on deviations from the shared standards

- Days 1–10 keep the three-route form (one route per level, material before its task), so there is one export per
  route. `CLAUDE.md` §12 (merged route) applies from Day 11.
- Routes are `/route-1/`, `/route-2/`, `/route-3/` as briefed, not `route-{n}-{slug}`.
- Task 2 quotes the Task 1 verdict from another route: pointers to it are soft links (they navigate to Route 1 and flash
  the target), never a gate. Per-exercise answer keys are not part of this brief.
