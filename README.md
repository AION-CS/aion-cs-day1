# AION Green IT — Day 8 (v2)

**Cloud Sustainability — From Knowledge to Board-Ready Decisions** — the interactive
working companion for Day 8. Three routes, each its own case and its own deliverable,
built on the same shared chrome, state, and export conventions established in Day 5.

This is the **v2** rebuild of Day 8, developed in its own repository
(`aion-green-it-day8-v2`) so it can diverge freely from the original `aion-green-it-day8`
without touching that history.

- **Stack:** Next.js 14 (App Router) · TypeScript · Tailwind · Zustand
- **State:** `localStorage` only — no backend, no auth, no accounts (key
  `aion-greenit-day8-v2`, distinct from the original Day 8 repo's storage so both can be
  open in the same browser without colliding)
- **Output:** static export (`out/`), deploy-ready to any static host

See [`UX-STANDARDS.md`](./UX-STANDARDS.md) for the 10 interaction/UX conventions every
route — on this day and every future day built from this folder — is expected to follow.

---

## Routes

| Route | Deliverable | Status |
|---|---|---|
| `/` | Day overview | built |
| `/route-1-knowledge` | Cloud Decision Audit Brief | **built** |
| `/route-2-application` | Prioritization Decision Memo | **built** |
| `/route-3-management-decision` | Management Proposal | **built** |

Each route is a separate page and its own independent case study — see `lib/routes.ts`
for the shared day-level identity (`CASE`, `Route`, `ROUTES`) consumed by the home page
and the top-bar nav rail. Every route is always reachable: `lib/routeGating.ts` /
`components/chrome/RouteGate.tsx` never hides a route's content, it only shows a
non-blocking banner recommending the previous route's export be submitted first
(tracked via a `checks["rN:exported"]` flag set the moment that route's export fires) —
see [`UX-STANDARDS.md`](./UX-STANDARDS.md) standard #6.

**Export filenames** follow `1-{name}-day8-l{level}task{taskNumber}` — e.g.
`1-muchson-day8-l2task1`. Built in `lib/downloadFile.ts` (`exportFilename`); the `day8`
segment names the curriculum day, not the repo version, so it stays `day8` even here in
the v2 rebuild. Route 1 downloads a real file (JSON + HTML, no library); Routes 2 and 3
use the browser's native print dialog (`window.print()`, "Save as PDF") — there is no
PDF library in this project by design.

## Route 1 — Knowledge (built)

Case: **Flexora Digital Services**. Material covers cloud fundamentals, the
economies-of-scale efficiency argument (utilisation, automation, professional
data-centre operations), the core tension between that efficiency and rising energy
demand, typical challenges of cloud use, and the six recurring sources of
inefficiency. The learner then works through a six-stage audit of Flexora's cloud
plans against that evidence, feeding a live Decision Brief that is what gets exported.
Exports as `...-l1task1`.

## Route 2 — Application (built)

Case: **Flexora Digital Services**, the same company from Route 1, now facing
prioritization decisions. Material covers cloud financial & governance frameworks
(the FinOps cycle), a seven-dimension assessment model, deciding under uncertainty,
why governance multiplies everything else, and the trap of the short-term win. The
learner scores three courses of action against the assessment model and defends one
under real uncertainty, producing a Prioritization Decision Memo. Exports as
`...-l2task1`.

## Route 3 — Management Decision (built)

Case: **SkyBridge Solutions GmbH** — a growing 1,000-employee service company whose
cloud costs are rising faster than its transparency into them — diagnosed first, then
**Helix Digital Platforms** as the board-proposal case. Material covers the shift from
analyst to decision-maker, the Decision Architecture model, levers vs. symptoms, and
short/medium/structural horizons of action. The learner builds a board-ready proposal
for Helix. Exports as `...-l3task1`.

## Run it

```bash
npm install
npm run dev        # http://localhost:3000
```

```bash
npm run build      # static export → ./out
npm run typecheck  # tsc --noEmit
```

## Where things live

- `lib/routes.ts` — the day-level `CASE` (program identity: "AION Green IT · Day 8 ·
  Cloud Sustainability"), the `Route` type, and `ROUTES` (the actual route registry
  consumed by the home page and `TopBar`).
- `lib/route1.ts` / `lib/route2.ts` / `lib/route3.ts` — each route's copy, case data,
  and pure math (no React — importable anywhere).
- `lib/store.ts` — the generic Zustand + `localStorage` store (key
  `aion-greenit-day8-v2`), shared by every route.
- `lib/routeGating.ts` — cross-route unlock keys and the `useRouteUnlocked` hook (drives
  the soft banner only, never blocks rendering).
- `lib/downloadFile.ts` — `exportFilename` (naming convention) and `downloadTextFile`
  (Route 1's direct-download export).
- `components/route1/*`, `components/route2/*`, `components/route3/*` — each route's
  mechanics (task steps, and the report/export/print components).
- `components/chrome/*`, `components/ui/*`, `components/icons/*` — shared chrome (top
  bar, footer, `RouteGate`), generic UI (`Reveal`, `SectionHeading`, `MaterialBlock`,
  `IndustryCallout`, `RadarChart`, `MiniStepper`, `MissingList`, `MentorFillButton`),
  the single-colour icon registry, and `useAnimatedNumber` — all reused across routes.
