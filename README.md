# AION Green IT — Day 9

**Green Workplace & Extending Device Lifetimes** — the interactive working companion for
Day 9. Three routes, each its own case and its own deliverable, built on the same shared
chrome, state, and export conventions established in Day 5 and carried through Day 8.

This repo started as a copy of `aion-green-it-day8-v2` and keeps that history. All three
routes have been rebuilt for Day 9's curriculum; no Day 8 content remains.

- **Stack:** Next.js 14 (App Router) · TypeScript · Tailwind · Zustand
- **State:** `localStorage` only — no backend, no auth, no accounts (key
  `aion-greenit-day9`, distinct from every other day's storage so several days can be open
  in the same browser without colliding)
- **Output:** static export (`out/`), deploy-ready to any static host

Two documents govern this build: [`UX-STANDARDS.md`](./UX-STANDARDS.md) for the interaction
conventions every route follows, and `../CURRICULUM-GUIDE.md` for the content standard
(language, material depth and citations, gamification design, mentor tooling, export naming).

---

## Routes

| Route | Case | Deliverable | Status |
|---|---|---|---|
| `/` | — | Day overview | built |
| `/route-1-knowledge` | UrbanByte Consulting | Green Workplace Diagnostic | **built** |
| `/route-2-application` | Nordwerk Technologies GmbH | Prioritisation Decision Memo | **built** |
| `/route-3-management-decision` | BrightPath Corporate Services | Management Decision Architecture | **built** |

Each route is a separate page and its own independent case study — see `lib/routes.ts` for
the shared day-level identity (`CASE`, `Route`, `ROUTES`) consumed by the home page and the
top-bar nav rail. No route is ever gated on finishing another one — `lib/routeGating.ts` /
`components/chrome/RouteGate.tsx` only show a non-blocking banner suggesting the intended
order (tracked via a `checks["rN:exported"]` flag set the moment that route's export fires)
— see [`UX-STANDARDS.md`](./UX-STANDARDS.md) standard #6. Routes 2 and 3 are additionally
written to be **completable standalone**: each opens with a recap block carrying the
lifecycle facts the route rests on, so a learner starting there is never missing a premise.

**Export filenames** follow `{taskNumber}-{name}-day9-l{level}task{taskNumber}` — e.g.
`1-muchson-day9-l1task1`, `1-muchson-day9-l2task1`, `1-muchson-day9-l3task1`. The leading
number is the task's number within its route, and every route has exactly one task, so it
reads `1` throughout; `l{level}` is what identifies the route. Built in `lib/downloadFile.ts`
(`exportFilename`). All three routes download real files — a JSON payload for grading (learner
answers alongside the model answers and match flags) and a standalone HTML document for
reading. No library is involved: a Blob, an object URL and a throwaway anchor click.

## Route 1 — Knowledge (built)

Case: **UrbanByte Consulting** — a 180-person Frankfurt/Amsterdam consultancy that sells
sustainable digital transformation to its clients and has never audited its own workplace IT.

Material (four blocks, ~7 minutes): the five elements a green workplace actually consists of;
where a laptop's lifetime carbon really sits (≈75–85% manufacturing, and the TCO
Certified / Öko-Institut finding that 4→6 years cuts annual emissions ~29%, from 74.7 to
53.1 kg CO₂e); technical vs. organisationally permitted service life and the five things that
close the gap (EU Right to Repair Directive 2024/1799, ESPR, Blue Angel, fleet standardisation,
support defaults, user acceptance); and the honest trade-offs plus why the replacement decision
outweighs the behaviour ceiling. Closes with a four-framework reference grid.

Task (three stages, ~13 minutes): walk a six-zone office floor plan to collect one finding per
zone, sort the findings into six areas (drag or tap, with undo/redo and clue-on-demand), then
diagnose each one with two forced choices — individual vs. structural, short-term vs. structural
change — which places it on a live 2×2 matrix. Finally pick the two findings to act on first,
give each a direction and a justification, and export the Green Workplace Diagnostic.

## Route 2 — Application (built)

Case: **Nordwerk Technologies GmbH** — 1,240 employees, one €180,000 budget, three competing
measures, and a board that has already agreed something must happen.

Material (four blocks, ~7 minutes, opening with a standalone recap): why intuition fails on
these three measures; multi-criteria decision analysis and why the weighting carries the
judgement; the genuinely contested refresh-cycle economics (a vendor EAC study against a
500,000-device fleet analysis) plus the Windows 10 ESU ladder at $61 → $122 → $244 per device;
and visible-vs-structural plus the three tests for deciding on incomplete data.

Task (three stages, ~13 minutes): audit six evidence cards — rating controls stay locked until
the card is turned over to reveal its method, and a contradiction panel fires once both
conflicting cards are flipped and tagged. Then weight four criteria to exactly 100 (no
auto-normalising) and work a 3×4 matrix where **each cell's score band is unlocked by a
reasoning question**, with a sensitivity slider to test whether the ranking is robust. Finally
place four constraints on the measures they threaten (drag, undo/redo), answer a mid-year shock
event, and commit to a ranking with two structural risks and an uncertainty statement.

## Route 3 — Management Decision (built)

Case: **BrightPath Corporate Services** — 3,100 employees across seven countries, two previous
consultant reports that changed nothing, and one board session.

Material (four blocks, ~7 minutes, opening with a standalone recap): measures versus a decision
architecture and its five components; decision rules, thresholds and escalation design;
accountability, the single-Accountable rule, and the trade-offs a board must own; review
mechanisms and the European regulatory horizon (Right to Repair transposition 31 July 2026,
ESPR work plan, ESRS E5 under revision).

Task (three stages, ~15 minutes): pick three strategic drivers (weak choices draw a
counter-prompt) and three guiding decisions, then drag them into executable order. Build the
repair-vs-retire rule and run it against **eight test devices that recompute live** — mark every
outcome intended or not, and any change to a threshold clears the marks and increments the
iteration counter, so a rule is never published untested. Then assign a RACI grid (with a
teaching panel when two Accountables appear), state trade-off defaults, design the review
cadence and trigger, and answer three board objections.

Mentor tools (passcode `muchson123`, all three routes): demo-fill for every field, and answer
keys giving the expected answer plus the reasoning for every option including the rejected ones,
with teaching notes where more than one answer defends. The answer-key unlock lives in the
store's non-persisted session slice, so a reload always re-locks it.

## Run it

```bash
npm install
npm run dev        # http://localhost:3000
```

```bash
npm run build      # static export → ./out
npm run typecheck  # tsc --noEmit
```

Never run `npm run build` while the dev server is running — both write to `.next`, after which
the dev server serves 404s for `main-app.js` and nothing hydrates.

## Where things live

- `lib/routes.ts` — the day-level `CASE` (program identity: "AION Green IT · Day 9 · Green
  Workplace & Extending Device Lifetimes"), the `Route` type, and `ROUTES`.
- `lib/route1.ts` — Route 1's material, case data, zones, findings, answer keys and task copy
  (no React — importable anywhere). `lib/route2.ts` / `lib/route3.ts` still hold Day 8 content.
- `lib/store.ts` — the generic Zustand + `localStorage` store (key `aion-greenit-day9`),
  including the non-persisted `answerKeyUnlocked` session flag.
- `lib/answerKey.ts` / `lib/mentorPasscode.ts` — the answer-key block shape and the shared
  mentor passcode used by both mentor tools.
- `lib/routeGating.ts` — cross-route unlock keys and `useRouteUnlocked` (soft banner only).
- `lib/downloadFile.ts` — `exportFilename` and `downloadTextFile`.
- `components/route1/*` — the floor plan, zone vignettes, sort board, diagnosis matrix,
  priority picker, live report and export bar, plus the four material SVGs.
- `components/chrome/*`, `components/ui/*`, `components/icons/*` — shared chrome, generic UI
  (`MaterialBlock`, `MaterialRefs`, `MissingList`, `ClueToggle`, `MentorFillButton`,
  `AnswerKeyButton`, `AnswerKey`), and the single-colour icon registry.
