# AION Green IT — Day 15

**Module 11: Innovations for the Sustainable IT of Tomorrow** (sustainable innovation, artificial
intelligence and the circular economy) — the interactive working companion for Day 15.

**Built: Route 1 (Levels 1–2) and Route 2 (Level 3) — both routes complete.**

This day is bootstrapped from Day 14's codebase: its store shape, export mechanism, mentor tools
and UI primitives are reused as-is. Three things changed deliberately.

**Material: "read less, do more."** Day 14 ran a ~60-minute facilitator-led block per route. Day 15
runs short micro-cards instead — Route 1's nine (C1–C9, ~22 min total) and Route 2's four (D1–D4,
~15 min) — each one 3–5 sentences, one live diagram, one micro-interaction, and the decision rule a
task will ask for. The teaching is not thinner, it is denser, and the learning happens inside the
tasks. `components/ui/MicroCard.tsx` is the renderer (`MicroCard` type in `lib/materialSection.ts`,
alongside the existing `MaterialSection` a fuller day still uses).

**Task 1: decision-first, not drag-first.** Nothing is dragged into a verdict. For each initiative
the learner answers two diagnostic questions, and the *combination* of those two answers resolves
the card into one of three zones. Because the zone is computed from the learner's own reasoning it
is never a free pick, so showing it immediately reveals nothing they did not just decide. Undo/redo
therefore covers the *answers* — undoing a diagnosis moves the card back out of its zone, which is
the same "remove a wrong placement and retry" guarantee CLAUDE.md §5 exists for.

**Task 3's canvas connects rather than lists.** Six fixed blocks; the learner draws connections
between them (native HTML5 drag, plus tap-to-select as the fallback) rather than filling in six
separate fields. An orphaned block surfaces a live, non-gated hint immediately, and also blocks
export via the missing list — the same "disconnected initiative" failure mode the material warns
about, made visible as you build.

**Export-naming note.** Route 1's Level 2 build prompt names two separate exports
(`…-l1task1`, `…-l2task1`). The established codebase convention — CLAUDE.md §12 ("one export bar,
one deliverable, one missing list spanning the whole task") and Day 14 Route 1's own precedent for
a merged L1+L2 route — is **one export per route**, so Route 1 now exports a single PDF covering
both parts as `1-{name}-day15-l1l2task1`, not two files. Flagged here per that prompt's own
instruction to surface the discrepancy rather than pick silently. Route 2 has no such conflict: one
level, one task, one export (`l3task1`), exactly as specified.

## Routes

| Route | Levels | Case | Material | Task | Export |
|---|---|---|---|---|---|
| `/route-1-assess-and-decide` | 1–2 | FutureGrid Technologies | C1–C9 micro-cards, ~22 min | Part 1 Diagnose (6 initiatives → zone, lens, rationale) → handover → Part 2 Decide (assess 3 lines on 7 dimensions, radar, priority pick + justification), ~30 min total | `1-{name}-day15-l1l2task1` PDF |
| `/route-2-management-decision` | 3 | NovaCircular Technologies | D1–D4 micro-cards + CircularMind worked example, ~15 min | Connect 6 blocks into a decision architecture, then the 7-element management proposal, ~20 min | `1-{name}-day15-l3task1` PDF |

## The shape of Route 1

```
case brief + learner name (stated once)
      ↓
MATERIAL — nine micro-cards, C1–C9, ~22 min, all teaching before either part
      ↓
TASK — one continuous scroll:
  Part 1 — Diagnose: six initiatives → two questions each → the card resolves into a zone
           → assign a lens → write a one-line rationale → one closing free-text question
      ↓
  HANDOVER — an inline panel drawing the learner's own Part 1 zone tally as a small bar
      ↓
  Part 2 — Decide: assess lines A/B/C on the 7 dimensions (radar, overlaid + toggleable)
           → pick one priority → justify (≥2 dimensions referenced) → 3 follow-ups → 2 risks
      ↓
ONE EXPORT
```

## The shape of Route 2

```
case brief + learner name (stated once)
      ↓
MATERIAL — four micro-cards, D1–D4, ~15 min, ending in a read-only CircularMind worked example
      ↓
TASK — one continuous scroll, one task in two stages:
  Stage 1 — connect the six decision-architecture blocks (native drag + tap-to-select, undo/redo)
      ↓
  Stage 2 — the guided proposal: 7 elements, a first-measure selector, a horizon classifier
      ↓
ONE EXPORT
```

## Route 1's material — nine micro-cards

| Card | Teaches | Live diagram + interaction |
|---|---|---|
| C1 | Novelty is not innovation; the rebound effect / Jevons paradox | A fork with a travelling dot; toggle novelty-driven vs impact-driven |
| C2 | AI as efficiency promise *and* resource burden; IEA data-centre figures | A balance that tilts under a "how heavy is the AI workload?" slider |
| C3 | Circular vs linear IT; the R-ladder; Global E-waste Monitor figures | Linear chain beside a loop; tap any of the 7 rungs for an example |
| C4 | The seven assessment *lenses* — Task 1's vocabulary | A wheel that fills in as each lens chip is opened (soft nudge at <7) |
| C5 | Attractive now vs viable long-term; organisational maturity; **the verdict rule** | Spiky vs rooted curves; claim cards that flip into the question testing them |
| C6 | Deciding under uncertainty — a defensible logic beats waiting for certainty | A fork (reuses C1's rig): wait-for-data stalls in fog vs decide-with-logic keeps moving |
| C7 | The seven assessment *dimensions* — Task 2's radar vocabulary (deliberately distinct from C4's lenses) | A live radar toggling weak/strong demo profiles; tap a dimension for its definition |
| C8 | Enabler vs point-solution leverage | A hub-and-spoke that "unlocks" downstream decisions on toggle |
| C9 | Attractive-but-weak: symbolic politics, misinvestment, rebound | A trophy that flips to reveal the three failure modes |

Figures rendered exactly as cited: data-centre electricity ~460 TWh (2022) → potentially ~1,000 TWh
by 2026 (IEA, *Electricity 2024*); e-waste 62 Mt generated in 2022 with 22.3% formally collected
and recycled (Global E-waste Monitor 2024, UNITAR/ITU). Reference tags also cover the WEEE
Directive (2012/19/EU), the EU ESPR (2024) and the Ellen MacArthur Foundation R-strategies.

## Route 1's task mechanics

**Task 1, Q1 asked of every initiative:** does this mainly reduce net resource use, add compute/data
load, or both? **Q2, whichever is most diagnostic:** circular or linear · impact-led or novelty-led
· organisationally tested or untested. **The verdict rule (C5, `resolveZone`):** both signals
pointing the right way → Sustainable opportunity; both wrong → Sustainability risk; any
disagreement, including an honest "both, unclear" → Mixed. The intended split is two initiatives
per zone; the sharpest pair is 1 and 6 — same technology, opposite verdict, because one was proposed
on a measured saving and the other on visibility.

**Task 2** is decide-first too: Phase 1 answers all seven dimension questions per option (never a
blind slider) to render each line's radar; Phase 2 asks for one priority pick, a justification
referencing ≥2 dimensions, three follow-ups, and two attractive-but-weak risks. The check
(`checkPriority`) never names which line is "right" — genuinely, by design, all three defend — it
only tests two pick-agnostic things: does the justification cite real evidence, and has the
standard objection to *whichever* line was picked been pre-empted. The mentor answer key names B as
the textbook-defensible pick with a `teachingNote` for participants who reasonably choose A or C.

**Checking** on both tasks is one action, never automatic, and reports an item-level verdict —
never per-question — because Q2/the objection check is binary and naming it directly would be the
answer (CLAUDE.md §4, §12). Clues sharpen from soft to sharp on the second and later checks of the
same item. Full reasoning per option lives in the mentor answer keys.

## Route 2's material — four micro-cards + one worked example

| Card | Teaches | Live diagram + interaction |
|---|---|---|
| D1 | Scattered initiatives vs one decision architecture | Nodes snapping from scattered to routed-through-one-hub on toggle |
| D2 | The four assessment criteria — benefit, resource/load, strategic viability, controllability | A funnel; drop a demo initiative in and see which filter stops it |
| D3 | Governance loop — propose → assess → approve/park → review; ISO 50001 / ISO 20400 | Click each stage of the loop for its role and question |
| D4 | Time horizons — short / medium / structural | A slider across three bands, each with concrete examples |

The material ends in a **read-only worked example** (CircularMind Digital Systems GmbH, dark
banner, no inputs) — CURRICULUM-GUIDE.md §2's pattern of reasoning *from* one company and being
assessed *on* another (NovaCircular).

## Route 2's task mechanic

**Stage 1** — six fixed blocks (AI use, Innovation portfolio, Circular economy, Investment logic,
Governance, Management review); the learner draws connections between them rather than filling in
fields. **Stage 2** — the seven-element proposal: strategic relevance, three 12-month guiding
decisions, decision logic (must reference D2's four criteria), central trade-offs, a first-measure
selector (framework / AI / circular) plus its justification, roles & governance, and the
decide-now call — alongside a fixed six-measure horizon classifier reinforcing D4.

**"Check my proposal"** runs three fixed, factual checks in order — does element 3 name all four D2
criteria (naming which one is missing, since that's checklist coverage, not a graded pick); has a
structurally weak first-measure pick's standard objection been addressed; do the horizon
classifications span more than one band — and never states the model recommendation itself. Unlike
Task 2, this exercise *does* have a taught answer (framework first, per the CircularMind lesson),
so the mentor answer key marks it accordingly with a `teachingNote` for real-world urgency
counter-arguments.

## Shared components

- `lib/materialSection.ts` — `MicroCard` (this day) and `MaterialSection` (fuller days).
- `components/ui/MicroCard.tsx` — heading → diagram → sentences → decision rules → source tags.
- `components/ui/MiniNav.tsx` — sticky card dots and the top progress bar.
- `components/ui/LivePanel.tsx` — sticky deliverable column on desktop, expandable strip on mobile.
- `components/ui/RadarChart.tsx` — Task 2's three-line overlaid, toggleable comparison radar.
- `components/ui/MissingList.tsx` — `MissingItem.before` opens a closed container before scrolling.
- `lib/usePlacementHistory.ts` — per-exercise undo/redo; each board/canvas/classifier owns its own
  instance. Snapshots hold whatever "placement" means for that exercise — diagnostic answers,
  dimension scores, canvas edges, or horizon-band assignments.
- `components/ui/UndoRedoControls.tsx` + `lib/undoShortcuts.ts` — buttons and Ctrl/⌘+Z.
- `components/ui/AnswerKey.tsx` + `MentorFillButton` / `AnswerKeyButton` — mentor tools.
- `components/chrome/RouteGate.tsx` — Route 2's soft, non-blocking "Route 1 first" banner.

## Standards implemented

- **Itemized missing items**, every one a button that scrolls to and flashes the exact field —
  including combined-count items where CLAUDE.md's own examples call for it ("Only 1 of 2 risks
  written", "6 canvas blocks orphaned", "3 measures unclassified").
- **Export button is never disabled.** From an incomplete state it opens the missing list and jumps
  to the first gap; it does not export.
- **Check on demand, clue not answer** — item-level verdict, tiered soft-then-sharp, never the
  correct zone, priority line, canvas link, or model recommendation.
- **Undo/redo** on every diagnostic answer, dimension score, canvas connection, and horizon
  placement.
- **No hard locks** — every route is reachable by URL; Route 2 shows only a soft order-suggestion
  banner until Route 1 is exported.
- **Mentor tools** — one auto-fill per route, per-exercise answer keys, shared passcode
  `muchson123` in plaintext on purpose. The unlock flag is session-only, so a reload re-locks it.
- **Field instructions below the label**, never only in a placeholder.
- **Material traceability** — every option a task offers is taught in a card above it, and
  `MaterialRefs` chips on each field point back at the exact cards it draws on.

## Layout

```
app/
  page.tsx                              two route cards, both available
  route-1-assess-and-decide/            FutureGrid Technologies
  route-2-management-decision/          NovaCircular Technologies
lib/
  routes.ts                             day identity + the two-entry registry
  materialSection.ts                    MicroCard + MaterialSection types
  route1/  index · sections (C1–C9) · material (nine cards) ·
           task1 (zones, lenses, six initiatives, clues, answer keys) ·
           task2 (dimensions, three lines, radar scoring, objection clue engine, answer key)
  route2/  index · sections (D1–D4) · material (four cards + worked example) ·
           task3 (blocks, connections, proposal elements, first-measure + horizon clues, answer key)
  downloadFile.ts                       exportFilename(...) + printHtmlDocument() — PDF via window.print()
  store.ts                              Zustand + localStorage (key aion-greenit-day15), useHydrated()
components/
  route1/   CaseBrief · Material · MaterialDiagrams · Task · DiagnosisBoard · Handover · PartTwo ·
            ReportPanel · ExportBar · MentorTools · useRoute1 · exportDocuments
  route2/   CaseBrief · Material · MaterialDiagrams · Task · Canvas · ProposalBuilder ·
            ReportPanel · ExportBar · MentorTools · useRoute2 · exportDocuments
  ui/       cross-day shared components
```

## Running it

```bash
npm ci
npm run dev
```

The parent `../.claude/launch.json` has a `day15-dev` entry — `preview_start` reads the parent
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
