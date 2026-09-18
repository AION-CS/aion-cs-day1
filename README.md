# AION Green IT — Day 14

**Module 10: Implementing Sustainability Economically and in Line with Regulation** — the
interactive working companion for Day 14.

Two routes: **Route 1 carries Level 1**, **Route 2 merges Levels 2 and 3 into one route, one task
in two parts** (Prioritise → Propose), per CLAUDE.md §13's "Format 2" pattern for a route too lean
to split into two full routes.

This day is bootstrapped from Day 13's codebase — its components, store shape, export mechanism
and UI primitives are reused as-is; only the content and each route's task mechanic changed. Route
1's task moved from Day 13's tap-only triage pattern back to Day 9/Day 5's native-HTML5-drag-plus-
tap classification pattern, because Module 10's Task 1 is a six-way classification exercise, not a
two-way tag. Route 2's material is deliberately lean (two sections, not four) — every sentence in
it exists only because a task field needs it directly.

Both routes export **PDF only**, via `window.print()` — no JSON download, following the convention
Day 13 reinstated.

**Export-naming note:** the Route 2 build prompt suggested two separate exports, one per part
(`l2task1` and `l3task1`). The established codebase convention — CLAUDE.md §12 ("one export bar,
one deliverable") and Day 13 Route 1's own precedent for a merged L1+L2 route — is **one export per
route**, so Route 2 exports a single PDF covering both parts as `1-{name}-day14-l2l3task1`, not two
files. Flagged here per that prompt's own instruction to surface the discrepancy rather than pick
silently.

## Routes

| Route | Levels | Case | Material | Task | Export |
|---|---|---|---|---|---|
| `/route-1-diagnose-and-decide` | 1 (2 pending) | Mercury Office Systems | S1–S4, ~60 min | Evidence-Tagging Diagnosis Board — 7 indications × area, root cause, timeframe, improvement approach, ~15 min | `1-{name}-day14-l1task1` PDF |
| `/route-2-management-decision` | 2 + 3 | Valora Digital Operations | S1–S2, ~45–50 min | Part 1 Prioritise (score & choose) → Part 2 Propose (relevance, first move, ownership, one decision now), ~20 min | `1-{name}-day14-l2l3task1` PDF |

Neither route gates the other. Route 2 shows a soft order-suggestion banner (via `RouteGate`) until
Route 1 has been exported, and nothing more — both routes are always reachable by URL.

## The shape of each route

```
Route 1:
case brief + learner name (stated once)
      ↓
MATERIAL — four sections, S1–S4, ~60 min, all teaching before the task
      ↓
TASK 1 — Mercury Office Systems Evidence-Tagging Diagnosis Board, ~15 min
      ↓
ONE EXPORT

Route 2:
case brief + learner name (stated once)
      ↓
MATERIAL — two lean sections, S1–S2, ~45–50 min
      ↓
TASK — one task, two parts, one continuous scroll
      Part 1: Prioritise (score A/B/C on 4 criteria, radar auto-builds, choose one)
      Part 2: Propose (relevance, first move, ownership map, reversibility test) — reachable
              regardless of Part 1's progress
      ↓
ONE EXPORT
```

Route 1's Part Two (prioritisation across the six areas) will extend Route 1's page once that
prompt lands — nothing in the current build assumes it hasn't happened yet.

Standards: `../CLAUDE.md` §1–§14, `../CURRICULUM-GUIDE.md` §2–§4 and §7, and the day-local copy in
[`UX-STANDARDS.md`](UX-STANDARDS.md).

## Route 1 — Diagnose & Decide (Mercury Office Systems)

**Material, four sections, ~60 minutes.**

- **S1 — The Green IT business case.** Why economic assessment decides whether a measure survives a
  budget conversation: short-term cost vs. long-term saving vs. strategic benefit, the full cost-type
  and benefit-type lists. Diagram: a toggleable cost/benefit balance scale plus a live ROI/payback
  calculator (no submission — a mechanics tool for Task 1).
- **S2 — ROI is not only a financial number.** The financial, strategic and risk lenses. Diagram:
  toggle the three lenses on four example measures and watch the ranking change.
- **S3 — Why technical solutions fail without behavioural change.** The gap between theoretical and
  realised savings; the success factors (clear rules, communication, leadership, ease of use,
  incentives, role-model effect, embedding in process); the Leadership-vs-Management distinction;
  the three root causes (data gap, behavioural pattern, management deficit). Diagram: a real-time
  adoption-rate simulator with three preset scenarios.
- **S4 — Regulation as a management framework.** The four regulatory domains (transparency/
  reporting, procurement, disposal/circularity, energy efficiency); the short-term-vs-structural
  distinction. Diagram: a clickable regulatory driver map, each domain paired with a reactive vs.
  strategic framing.

**Task 1 — the Evidence-Tagging Diagnosis Board** (~15 min). Seven indications lifted verbatim from
the Mercury Office Systems case, each a draggable-or-tappable chip; six area drop zones (Economic
viability, User behaviour, Leadership, Compliance/Regulation, Communication, Management). Placing a
chip expands it into three micro-inputs: an improvement approach (free text), a root-cause tag
(3-way) and a timeframe tag (2-way). "Check my classification" never reveals the correct area — only
a clue, tiered soft-then-sharp on the second and later checks of the same chip. Full undo/redo on
every placement change via a per-board `createPlacementHistory()` instance.

Ground truth, per-chip clues and the mentor answer key live in `lib/route1/partOne.ts`.

## Route 2 — Management Decision (Valora Digital Operations)

**Material, two lean sections, ~45–50 minutes.** Every sentence exists because a task field needs
it — no extra frameworks, no worked case study.

- **S1 — The four prioritisation criteria.** Feasibility, Economic effect, Behavioural
  effectiveness, Regulatory relevance — one original inline-SVG pictogram each. Diagram: a practice
  4-axis radar with +/− steppers per axis, built from the *same* `RadarChart` component Task Part 1
  uses for real.
- **S2 — Deciding & assigning ownership with incomplete data.** The six-function Ownership Map (IT,
  Finance, Compliance, HR, Purchasing, Management) and the reversibility test (reversible? would
  more data change the direction?). Both components are shared, not duplicated, between their
  material appearance and Part 2's task appearance — see `components/route2/OwnershipMap.tsx` and
  `ReversibilityTest.tsx`.

**Task — one task, two parts** (~20 min total, neither gates the other):

1. **Part 1 — Prioritise** (~10 min). Four criterion cards, each a drag-or-tap ranking of A/B/C
   into 1st/2nd/3rd (one shared `createPlacementHistory()` covers undo/redo across all four cards).
   A per-criterion "Check my thinking" gives a clue tied to whichever measure-line was ranked top —
   never a "correct" ranking, since none exists. Once all four criteria are ranked, the real radar
   and total scores build automatically, then the learner commits to one priority with a required
   justification.
2. **Part 2 — Propose** (~10 min). Reads Part 1's chosen priority as read-only context (and stays
   fully usable before Part 1 is finished). Four fields: relevance, first move, an Ownership Map in
   select mode (click a node to cycle unselected → Owns → Consulted), and one decision named
   alongside an inline Reversibility Test that decides "decide now" vs. "pilot" vs. "get more
   evidence" vs. "decide anyway".

Ground truth, per-criterion clues and both parts' mentor answer keys live in `lib/route2/task.ts`.

**Export.** PDF only — the export button opens the print-ready report in a new tab and triggers the
browser's print dialog, where "Save as PDF" produces the file. One document, two sections (Part 1 /
Part 2). No JSON download.

## Shared components (from Day 11 on)

- `lib/materialSection.ts` — the section type both routes use.
- `components/ui/MaterialBlock.tsx` — renders the diagram before the prose; omits the Sources block
  entirely when a section (like Route 2's) has nothing to cite.
- `components/ui/MiniNav.tsx` — sticky section dots and the top progress bar.
- `components/ui/LivePanel.tsx` — a sticky deliverable column on desktop, an expandable strip on
  mobile.
- `components/ui/RadarChart.tsx` — inline-SVG radar chart with a "ghost/real/option" tone system;
  Route 2 is its first live usage in this course, with three "option" series (A/B/C) each carrying
  a distinct colour, dash and marker shape.
- `components/ui/MissingList.tsx` — `MissingItem.before` opens a closed container before scrolling.
- `lib/usePlacementHistory.ts` — per-exercise undo/redo; each route's board owns its own instance.
- `components/ui/UndoRedoControls.tsx` + `lib/undoShortcuts.ts` — the visible buttons and the
  Ctrl/⌘+Z keyboard handler that drive it.

## Standards both routes implement

- **Itemized missing items**, every one a button that scrolls to and flashes the exact chip or field.
- **Export button is never disabled.** From an incomplete state it opens the missing list and jumps
  to the first gap.
- **Check on demand, clue not answer** — Route 1 per chip, tiered soft-then-sharp; Route 2 per
  criterion, tied to the current top pick. Neither ever names the "correct" answer.
- **Undo/redo** on every placement change; a chip can be moved by drag, by tap-to-select-then-tap, or
  by an explicit "remove" affordance.
- **No hard locks** — Route 2 shows only a soft banner suggesting Route 1 first; Route 2's own Part
  2 stays reachable before Part 1 is finished.
- **Mentor tools** — one auto-fill per route, per-item/per-part answer keys, shared passcode
  `muchson123` in plaintext on purpose. The answer-key unlock flag is session-only, so a reload
  re-locks it.
- **Field instructions below the label**, never only in a placeholder.
- **Material traceability** — every term each route's task uses is defined in that route's own
  material above it; `MaterialRefs` chips point back at it.

## Layout

```
app/
  page.tsx                          two route cards, both available
  route-1-diagnose-and-decide/      Mercury Office Systems
  route-2-management-decision/      Valora Digital Operations
lib/
  routes.ts                         day identity + the two-entry registry
  materialSection.ts                shared material section type
  route1/  index · sections · material (S1–S4) · partOne (areas, evidence, clues, answer keys)
  route2/  index · sections · material (S1–S2) · task (criteria, ownership, reversibility, answer keys)
  downloadFile.ts                   exportFilename(...) + printHtmlDocument() — PDF via window.print()
  store.ts                          Zustand + localStorage (key aion-greenit-day14), useHydrated()
components/
  route1/   CaseBrief · Material · MaterialDiagrams · PartOne · EvidenceBoard · ReportPanel ·
            ExportBar · MentorTools · useRoute1 · exportDocuments
  route2/   CaseBrief · Material · MaterialDiagrams · Task · RankBoard · ProposeSection ·
            OwnershipMap · ReversibilityTest · ReportPanel · ExportBar · MentorTools · useRoute2 ·
            exportDocuments
  ui/       cross-day shared components
```

## Running it

```bash
npm ci
npm run dev
```

The parent `../.claude/launch.json` has a `day14-dev` entry — `preview_start` reads the parent
config, not this folder's.

```bash
npm run build
```

Static output lands in `out/`. **Never run the build while the dev server is running** — both
write to `.next`, after which the dev server serves 404s for `main-app.js` and nothing hydrates
while the page still looks fine.

```bash
npm run typecheck
```
