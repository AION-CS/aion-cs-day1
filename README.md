# Retention Lab · Day 1

**Customer Retention & Buying Behaviour in B2B IT Sales · Module 1, Day 1 of 2.**
A self-study companion: study material, three working documents (a Diagnostic Note, a Calculation Note and a
Decision Memo) and live instruments. One route per level; all three routes are built.

This repo was rebuilt in place from the Day 16 codebase (Green IT KPIs). Its history is kept; nothing
of the Day 16 content remains in the tree.

## Routes

| Route | Content | Export |
|---|---|---|
| `/route-1/` | Level 1 · Materi A (A1–A8, 60 min) → Task 1 Diagnostic Note (30 min: sort 1.1, map the customer 1.2, verdict 1.3) | `{no}-{name}-day1-l1-diagnostic.html` |
| `/route-2/` | Level 2 · Materi B (B1–B7, 60 min) → Task 2 Calculation Note (15 min) | `{no}-{name}-day1-l2-calculation.html` |
| `/route-3/` | Level 3 · Materi C (C1–C6, 60 min) → Task 3 Decision Memo (20 min): allocation board under a €200,000 cap, RACI grid, live memo | `{no}-{name}-day1-l3-memo.html` |

## Stack

Next.js 14 App Router · TypeScript strict · Tailwind (tokens in `tailwind.config.ts`) · Zustand + `persist`
(key `cs-d1-v1`, version 2 with a `migrate` step, `skipHydration` + `StoreHydrator`) · static export (`output: "export"`, `trailingSlash`).
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
app/                  page.tsx (home) · route-1/ · route-2/ · route-3/
components/chrome/    MentorBar, TopBar, ParticipantStrip, SectionRail, HashFlash, Footer, StoreHydrator
components/ui/        MaterialCard, JourneyMap, TcoStack, MotiveMap, Calculator, ExportBar, MissingList, Field, AnswerBlock …
components/materi/    one file per card group (A1–4, A5–8, B1–3, B4–7)
components/task1|2|3/ the three tasks (task3: AllocationBoard, RaciGrid, MemoPanel)
data/                 kesslerDossier, offers, motives, references, glossary, mentorKey, materialIndex
lib/                  parseAmount, safeCalc (no eval), slug, flash, checks, missing, exportDoc, svgModels, progress
store/                useStore (slices), selectors (getL1Verdict, getL2Figures, getL2Recommendation)
```

## Reuse

`JourneyMap`, `TcoStack`, `MotiveMap` and `LoyaltyMap` take data by props: Materi uses generic/Alpenwerk data, the tasks use
the Kessler data. Task 3 quotes the Route 1 and 2 answers back through `store/selectors.ts`.

## Plain-language glossary

Every technical term, abbreviation and German word in the material and the tasks is an entry in `data/glossary.ts`. In the
text it is a dotted-underlined button (`lib/glossify.tsx`); a click opens one explanation card (`GlossaryPanel`) written for a
non-expert. Cards, bullets, tables, callouts, captions and field help are glossified automatically; other prose is wrapped in
`<Gloss>`. Rule: `../CLAUDE.md` #19.

## Mentor bar

The first element on every page. Enter `muchson123` once and every model answer of Routes 1, 2 and 3 fills in (plus a
participant name if empty), so each export downloads straight away — for checking the site without typing
through it. Client-side convenience gate, not security. Model answers: `data/mentorKey.ts`.

## Notes on deviations

This day follows the shared rules in `../CLAUDE.md` (#12 three routes, #15 CS style, #18 precedence). Where the day's
original prompt differed from a rule, the rule was followed:

- Layout is the repo's (`app/`, `components/`, … at the root, Tailwind), not the `src/` + CSS Modules the prompt suggested.
- Routes are `/route-1/`, `/route-2/`, `/route-3/` (one per level, one export each), not one long Route 1.
- Task 2 quotes the Task 1 verdict from another route: pointers to it are soft links (they navigate to Route 1 and flash
  the target), never a gate. Per-exercise answer keys are not part of this day's prompt; the mentor bar fills everything.
- The prompt's Route 3 test 3 ("G4 recomputes to 4 and G5 is 4") contradicts its own rules; the board computes 8 and 4.
