# AION Green IT — Day 15

**Module 11: Innovations for the Sustainable IT of Tomorrow** (sustainable innovation, artificial
intelligence and the circular economy) — the interactive working companion for Day 15.

**Built so far: Route 1, Level 1** — five material micro-cards and Task 1. Route 1's Level 2
(prioritisation) and Route 2 / Level 3 (the management decision) are separate, later prompts and
are deliberately not scaffolded here. Route 2 is registered in `lib/routes.ts` with
`available: false`, so it shows as "Not built" on the landing page and in the top bar rather than
as a dead link. That is a build-status flag, not a progress lock — nothing gates anything.

This day is bootstrapped from Day 14's codebase: its store shape, export mechanism, mentor tools
and UI primitives are reused as-is. Two things changed deliberately.

**Material: "read less, do more."** Day 14 ran a ~60-minute facilitator-led block of four deep
sections. Day 15 runs five micro-cards at ~10 minutes total — each one 3–5 sentences, one live
diagram, one micro-interaction, and the decision rule the task will ask for. The teaching is not
thinner, it is denser, and the learning happens inside the task. `components/ui/MicroCard.tsx` is
the new renderer (`MicroCard` type in `lib/materialSection.ts`, alongside the existing
`MaterialSection` a fuller day still uses).

**Task: decision-first, not drag-first.** Nothing is dragged into a verdict. For each initiative
the learner answers two diagnostic questions, and the *combination* of those two answers resolves
the card into one of three zones. Because the zone is computed from the learner's own reasoning it
is never a free pick, so showing it immediately reveals nothing they did not just decide. Undo/redo
therefore covers the *answers* — undoing a diagnosis moves the card back out of its zone, which is
the same "remove a wrong placement and retry" guarantee CLAUDE.md §5 exists for.

## Routes

| Route | Levels | Case | Material | Task | Export |
|---|---|---|---|---|---|
| `/route-1-assess-and-decide` | 1 (2 pending) | FutureGrid Technologies | C1–C5 micro-cards, ~10 min | "Sustainable or just attractive?" — 6 initiatives × 2 diagnostic questions → zone, lens, rationale, plus one closing question, ~15 min | `1-{name}-day15-l1task1` PDF |
| `/route-2-management-decision` | 3 | FutureGrid Technologies | — | not built yet | — |

## The shape of Route 1

```
case brief + learner name (stated once)
      ↓
MATERIAL — five micro-cards, C1–C5, ~10 min, all teaching before the task
      ↓
TASK 1 — FutureGrid diagnosis board, ~15 min
      six initiatives → two questions each → the card resolves into a zone
      → assign a lens → write a one-line rationale
      → one closing free-text question
      ↓
ONE EXPORT  (Level 2 will be added between the task and the export bar)
```

## The material — five micro-cards

| Card | Teaches | Live diagram + interaction |
|---|---|---|
| C1 | Novelty is not innovation; the rebound effect / Jevons paradox | A fork with a travelling dot; toggle novelty-driven vs impact-driven |
| C2 | AI as efficiency promise *and* resource burden; IEA data-centre figures | A balance that tilts under a "how heavy is the AI workload?" slider |
| C3 | Circular vs linear IT; the R-ladder; Global E-waste Monitor figures | Linear chain beside a loop; tap any of the 7 rungs for an example |
| C4 | The seven assessment lenses — the exact vocabulary Task 1 uses | A wheel that fills in as each lens chip is opened (soft nudge at <7) |
| C5 | Attractive now vs viable long-term; organisational maturity; **the verdict rule** | Spiky vs rooted curves; claim cards that flip into the question testing them |

Figures rendered exactly as cited: data-centre electricity ~460 TWh (2022) → potentially ~1,000 TWh
by 2026 (IEA, *Electricity 2024*); e-waste 62 Mt generated in 2022 with 22.3% formally collected
and recycled (Global E-waste Monitor 2024, UNITAR/ITU). Reference tags also cover the WEEE
Directive (2012/19/EU), the EU ESPR (2024) and the Ellen MacArthur Foundation R-strategies.

## The task mechanic

**Q1, asked of every initiative:** does this mainly reduce net resource use, add compute/data load,
or both? **Q2, whichever is most diagnostic for that initiative:** circular or linear · impact-led
or novelty-led · organisationally tested or untested.

**The verdict rule (taught in C5, implemented in `resolveZone`):** both signals pointing the right
way → Sustainable opportunity; both pointing the wrong way → Sustainability risk; any disagreement
between them, including an honest "both, unclear" → Mixed, needs conditions.

The intended resolution is two initiatives in each zone: circular procurement and the
sustainability-reporting offering are opportunities; the classic device-refresh cycle and the "AI
everywhere" pilot are risks; the AI optimisation and the data-services expansion are mixed. The
sharpest pair is initiatives 1 and 6 — same technology, opposite verdict, because one was proposed
on a measured saving and the other on visibility.

**Checking** is one board-level "Check my reasoning" action, never automatic. It reports a
set-level count plus an **item-level** verdict per initiative — never per question, because Q2 is
binary and naming which question is wrong would be the answer (CLAUDE.md §4, §12). Clues sharpen
from soft to sharp on the second and later checks of the same initiative, and none of them names an
answer. Full reasoning per option, including why each rejected option is rejected, lives in the
mentor answer keys.

## Shared components

- `lib/materialSection.ts` — `MicroCard` (this day) and `MaterialSection` (fuller days).
- `components/ui/MicroCard.tsx` — heading → diagram → sentences → decision rules → source tags.
- `components/ui/MiniNav.tsx` — sticky card dots and the top progress bar.
- `components/ui/LivePanel.tsx` — sticky deliverable column on desktop, expandable strip on mobile.
- `components/ui/MissingList.tsx` — `MissingItem.before` opens a closed container before scrolling.
- `lib/usePlacementHistory.ts` — per-exercise undo/redo; the board owns its own instance. Here the
  snapshot map holds answers (`i1:load`, `i1:structure`, `i1:lens`) rather than drag placements.
- `components/ui/UndoRedoControls.tsx` + `lib/undoShortcuts.ts` — buttons and Ctrl/⌘+Z.
- `components/ui/AnswerKey.tsx` + `MentorFillButton` / `AnswerKeyButton` — mentor tools.

## Standards implemented

- **Itemized missing items**, every one a button that scrolls to and flashes the exact field.
- **Export button is never disabled.** From an incomplete state it opens the missing list and jumps
  to the first gap; it does not export.
- **Check on demand, clue not answer** — item-level verdict, tiered soft-then-sharp, never the
  correct zone, lens or answer.
- **Undo/redo** on every diagnostic answer, which is what placement means on this day.
- **No hard locks** — every built route is reachable by URL; Route 2 is unbuilt, not gated.
- **Mentor tools** — one auto-fill for the whole route, per-initiative answer keys, shared passcode
  `muchson123` in plaintext on purpose. The unlock flag is session-only, so a reload re-locks it.
- **Field instructions below the label**, never only in a placeholder.
- **Material traceability** — every option the task offers is taught in a card above it, and
  `MaterialRefs` chips on each initiative point back at the exact cards it draws on.

## Layout

```
app/
  page.tsx                          two route cards (Route 2 marked not built)
  route-1-assess-and-decide/        FutureGrid Technologies
lib/
  routes.ts                         day identity + the two-entry registry
  materialSection.ts                MicroCard + MaterialSection types
  route1/  index · sections (C1–C5) · material (the five cards) ·
           task1 (zones, lenses, questions, six initiatives, clues, answer keys)
  downloadFile.ts                   exportFilename(...) + printHtmlDocument() — PDF via window.print()
  store.ts                          Zustand + localStorage (key aion-greenit-day15), useHydrated()
components/
  route1/   CaseBrief · Material · MaterialDiagrams · Task · DiagnosisBoard · ReportPanel ·
            ExportBar · MentorTools · useRoute1 · exportDocuments
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
