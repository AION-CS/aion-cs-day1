# AION Green IT — Day 14

**Module 10: Implementing Sustainability Economically and in Line with Regulation** — the
interactive working companion for Day 14.

Two routes, the standard shape from Day 11 on: **Route 1 carries levels 1 and 2**, **Route 2
carries level 3**. Day 14 ships **Route 1's Level 1 material and Task 1 only** so far — Level 2
(prioritisation, Part Two of Route 1) and Route 2 / Level 3 (the management decision) are separate,
later prompts. `lib/routes.ts` says this honestly (`levels: [1]`, `available: false` on Route 2)
rather than pretending the day is finished (CLAUDE.md §6, §12).

This day is bootstrapped from Day 13's codebase — its components, store shape, export mechanism
and UI primitives are reused as-is; only the content and Route 1's task mechanic changed. Route 1's
task moved from Day 13's tap-only triage pattern back to Day 9/Day 5's native-HTML5-drag-plus-tap
classification pattern, because this module's Task 1 is a six-way classification exercise, not a
two-way tag.

Both routes export **PDF only**, via `window.print()` — no JSON download, following the convention
Day 13 reinstated.

## Routes

| Route | Levels | Case | Material | Task | Export |
|---|---|---|---|---|---|
| `/route-1-diagnose-and-decide` | 1 (2 pending) | Mercury Office Systems | S1–S4, ~60 min | Evidence-Tagging Diagnosis Board — 7 indications × area, root cause, timeframe, improvement approach, ~15 min | `1-{name}-day14-l1task1` PDF |
| `/route-2-management-decision` | 3 | *(not written yet)* | — | — | — |

Route 2 is a reachable stub page, not a 404 and not a lock — it says plainly that Level 3 hasn't
been written, and links back to Route 1.

## The shape of Route 1, today

```
case brief + learner name (stated once)
      ↓
MATERIAL — four sections, S1–S4, ~60 min, all teaching before the task
      ↓
TASK 1 — Mercury Office Systems Evidence-Tagging Diagnosis Board, ~15 min
      ↓
ONE EXPORT
```

Part Two (prioritisation across the six areas) will extend this same page once that prompt lands —
nothing in the current build assumes it hasn't happened yet, and nothing blocks it from being added.

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

**Export.** PDF only — the export button opens the print-ready report in a new tab and triggers the
browser's print dialog, where "Save as PDF" produces the file. Grouped by area, not a raw log of
drags. No JSON download.

## Shared components (from Day 11 on)

- `lib/materialSection.ts` — the section type both routes use.
- `components/ui/MaterialBlock.tsx` — renders the diagram before the prose.
- `components/ui/MiniNav.tsx` — sticky section dots and the top progress bar.
- `components/ui/LivePanel.tsx` — a sticky deliverable column on desktop, an expandable strip on
  mobile.
- `components/ui/MissingList.tsx` — `MissingItem.before` opens a closed container before scrolling.
- `lib/usePlacementHistory.ts` — per-exercise undo/redo; Task 1's board owns its own instance.
- `components/ui/UndoRedoControls.tsx` + `lib/undoShortcuts.ts` — the visible buttons and the
  Ctrl/⌘+Z keyboard handler that drive it.

## Standards Route 1 implements

- **Itemized missing items**, every one a button that scrolls to and flashes the exact chip or field.
- **Export button is never disabled.** From an incomplete state it opens the missing list and jumps
  to the first gap.
- **Check on demand, clue not answer** — per chip, tiered soft-then-sharp, never names the area.
- **Undo/redo** on every placement change; a chip can be moved by drag, by tap-to-select-then-tap, or
  by an explicit "Move to pool" button.
- **No hard locks** — Route 2 is reachable, it just says its content isn't written yet.
- **Mentor tools** — one auto-fill for the whole task, a per-chip answer key, shared passcode
  `muchson123` in plaintext on purpose. The answer-key unlock flag is session-only, so a reload
  re-locks it.
- **Field instructions below the label**, never only in a placeholder.
- **Material traceability** — every term Task 1 uses (all six areas, all three root causes, both
  timeframes) is defined in the material above it; `MaterialRefs` chips point back at it.

## Layout

```
app/
  page.tsx                          two route cards; Route 2 shown as "Not built"
  route-1-diagnose-and-decide/      Mercury Office Systems
  route-2-management-decision/      stub page — Level 3 not written yet
lib/
  routes.ts                         day identity + the two-entry registry
  materialSection.ts                shared material section type
  route1/  index · sections · material (S1–S4) · partOne (areas, evidence, clues, answer keys)
  route2/  Day 13's EcoFlow/Synervia code — orphaned, unreferenced, kept only as prior-day reference
  downloadFile.ts                   exportFilename(...) + printHtmlDocument() — PDF via window.print()
  store.ts                          Zustand + localStorage (key aion-greenit-day14), useHydrated()
components/
  route1/   CaseBrief · Material · MaterialDiagrams · PartOne · EvidenceBoard · ReportPanel ·
            ExportBar · MentorTools · useRoute1 · exportDocuments
  route2/   Day 13's EcoFlow/Synervia components — orphaned, unreferenced
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
