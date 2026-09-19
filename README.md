# Retention Lab · Day 1

**Customer Retention & Buying Behaviour in B2B IT Sales · Module 1, Day 1 of 2.**
A self-study companion: study material, two working documents (a Diagnostic Note and a Calculation
Note) and a live evidence board. Route 1 (Level 1 + Level 2) is built; Route 2 (Level 3) is a
placeholder that is already wired into the nav and the store.

This repo was rebuilt in place from the Day 16 codebase (Green IT KPIs). Its history is kept; nothing
of the Day 16 content remains in the tree.

## Routes

| Route | Content | Export |
|---|---|---|
| `/route-1/` | Materi A (A1–A8, 60 min) → Task 1 Diagnostic Note (15) → Materi B (B1–B7, 60 min) → Task 2 Calculation Note (15) | `{no}-{name}-day1-l1-diagnostic.html`, `{no}-{name}-day1-l2-calculation.html` |
| `/route-2/` | Placeholder — Level 3, next release | — |

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
app/                  page.tsx (home) · route-1/ · route-2/
components/chrome/    TopBar, ParticipantStrip, SectionRail, Footer, MentorModal, StoreHydrator
components/ui/        MaterialCard, JourneyMap, TcoStack, MotiveMap, Calculator, ExportBar, MissingList, Field, AnswerBlock …
components/materi/    one file per card group (A1–4, A5–8, B1–3, B4–7)
components/task1|2/   the two tasks
data/                 kesslerDossier, offers, motives, references, mentorKey, materialIndex
lib/                  parseAmount, safeCalc (no eval), slug, flash, checks, missing, exportDoc, svgModels, progress
store/                useStore (slices), selectors (getL1Verdict, getL2Figures, getL2Recommendation)
```

## Reuse (Route 2 forward-compat)

`JourneyMap`, `TcoStack` and `MotiveMap` take data by props: Materi uses generic/Alpenwerk data, the tasks use
the Kessler data. The `route2` slice is an empty stub; the three selectors above are what Route 2 quotes back.

## Notes on deviations from the shared standards

- Route 1 keeps **two exports and interleaved material** (Materi A → Task 1 → Materi B → Task 2), as the Day 1
  brief specifies. `CLAUDE.md` §12 (one merged export per route) applies from Day 11; Days 1–10 keep the older form.
- Routes are `/route-1/` and `/route-2/` as briefed, not `route-{n}-{slug}`.
- Mentor tool is one footer modal (passcode `muchson123`, client-side convenience, not security) that
  autofills Route 1 or clears it. Per-exercise answer keys are not part of this brief.
