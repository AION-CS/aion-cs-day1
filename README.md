# AION Green IT — Day 16

**Module 12: Capturing & Visualising Sustainability Targets** (Green IT KPIs, continuous
optimisation, transparent reporting and IT-specific carbon monitoring) — the interactive working
companion for Day 16.

**Built: Route 1 (Levels 1–2) and Route 2 (Level 3) — both routes complete, depth-upgraded to the Day 14
standard** (`../DEPTH-UPGRADE-PROMPT.md`).

This day is bootstrapped from Day 15's codebase: its store shape, export mechanism, mentor tools and
UI primitives are reused as-is. What changed is the content, the depth of the material and the tasks'
feedback, and one structural deviation.

**Route 1 keeps two exports, on purpose.** CLAUDE.md §12 asks for one merged export per route. This
day's build brief names two separate deliverables for Route 1 — one per material-then-task pair — so
Route 1 is two short pairs, each with its own export, rather than one continuous block. Route 2 has
one level, one task, one export. Flagged here rather than picked silently.

## Routes

| Route | Levels | Case | Material | Task | Export |
|---|---|---|---|---|---|
| `/route-1-kpis-and-monitoring` | 1–2 | Clarity Digital Services | M1–M4 (~10 min) then M5–M7 (~8 min) | Task 1 Diagnose (~15 min), Task 2 Decide (~15 min) | `1-{name}-day16-l1task1` and `1-{name}-day16-l2task2` PDFs |
| `/route-2-management-decision` | 3 | Verdeon Digital Governance Group | D1–D4 (~11 min) | Five-stage management proposal (~20 min) | `1-{name}-day16-l3task1` PDF |

Route minutes on the landing page are material plus task: Route 1 ≈ 48, Route 2 ≈ 31. Read more depth is
optional and not counted.

## How a material card works now

```
kicker · title · one-line standfirst
LIVE DIAGRAM      — numbers, a reason per value, "Why this result", "What just changed", a baseline
DEFINITION        — 2–4 plain sentences (always visible; terms are tappable glossary buttons)
[ Read more ]     — decision rules ("How to decide when this comes up in the task"), deeper
                    sub-sections, option guides, sources with real links
```

- `components/ui/MicroCard.tsx` renders it; `components/ui/ReadMore.tsx` is the native, closed-by-default
  disclosure. A task's **MaterialRefs chip** scrolls to a card *and opens its Read more* (the decision
  rules live there) via the `aion:open-material` event.
- `lib/glossary.ts` + `components/ui/Glossed.tsx` — every abbreviation and standard (KPI, CO₂e, PUE,
  ISO/IEC 30134, GHG Protocol, Scope 1/2/3, ISO 14064, ISO 50001, PDCA, CSRD, ESRS, EU Energy Efficiency
  Directive) opens a panel with the full name, a plain meaning and **Source ↗** links. `TermChips` does
  the same where text sits inside a button.
- **Link check (2026-09-19):** every URL was opened by script and answered HTTP 200. `iso.org` answers
  403 to scripts, so ISO standards carry **no link**, only a note. **Re-check before teaching:** the CSRD
  scope is being revised by the EU "Omnibus" package (said so in the glossary text).
- Practice cases in the diagrams are deliberately **not** the task's cases, so nothing hands over an answer.
- Every interactive is derived from state (no literal copies of numbers), keyboard-operable, uses
  `aria-live="polite"` on the regions that change, and respects `prefers-reduced-motion`.
- Shared diagram parts: `components/ui/DiagramKit.tsx` (`Chip`, `WhyResult`, `WhatChanged`).

## Route 1 — material and interactives

| Card | Definition (visible) | Interactive |
|---|---|---|
| M1 | Collected vs managed; three links: target, owner, decision | Pick a practice figure, wire/unwire each link: 3-segment gauge, "Target 0 + Owner 1 + Decision 0 = 1 of 3", reason per link, missing-link first fix |
| M2 | Activity, outcome, management layers | One subject worded at all three layers; what each answers, what decisions it can drive, what climbing a layer adds |
| M3 | The six areas | Chips with *look for*, example, *often confused with* + tell-apart question; four practice sentences (not in Task 1) with a reason per tap |
| M4 | Six gates = sound number (relevant, understandable, comparable, robust) + wired (actionable, owned); short-term vs structural fixes | Filter four practice metrics; fix a failing gate: gate count, sound n/4 + wired m/2, why-result, short-term vs structural tally |
| M5 | PDCA routine | Cadence, named owner, skip a step: reviews/year, average wait (52 ÷ n ÷ 2), decisions the loop can change |
| M6 | Three pulls; steer / monitor / park | Score a practice metric 1–3 per pull: barycentric point, ghost of the baseline, verdict rule, reasons |
| M7 | Three lines A/B/C, seven criteria (in Read more), attractive-but-weak trap | Five conditions × three lines of **neutral facts**; dashboard with/without a review (illustrative numbers) |

**Decision taken for the M4 / Stage B conflict:** M4 taught six gates but Stage B asked only about
target + owner + decision, so a metric that failed on *comparable* (a PUE on different boundaries) had
no basis in the question. Stage B now asks **"Is the number sound AND wired to management?"** — all six
gates — with a key of the six gates under the question.

## Route 1 — task upgrades

- **Task 1:** every area shows *look for* and *tell apart from its neighbour* at the point of use; Stage B shows the six-gate key;
  Stage B's answer pill is neutral (colour is reserved for a verdict); ✓ green / ✕ red verdicts with a
  neutral clue, **cleared when the answer or placement changes**.
- **Task 2:** each line lists **What it involves**; under each of the 21 ratings sits a **neutral fact**
  (`LINE_FACTS`) — facts, not rankings. A key defines the seven criteria at the point of use. The verdict
  uses `CheckVerdict`.
- **The case is briefed once** (`ENGAGEMENT`, above Material 1). The task framing carries only the instruction.

## Route 2 — material and interactives

| Card | Definition (visible) | Interactive | Read more adds |
|---|---|---|---|
| D1 | Instrument vs documentation | Attach a decision / name an accountable person to a practice instrument: 0–2 links, documentation → information → instrument | Why documentation still matters (CSRD, EED) |
| D2 | Three layers, each needs the one before | Four build orders: which layers have their footing, why, count | **The eight twelve-month decisions defined** (means / use when / watch out) and the read-only TerraMetrics worked example |
| D3 | Five factors | Practice organisation presets + "move 5 points": pentagon from points, ghost baseline, leader and margin, live tensions, underweighted factors and what they put at risk | How the pairs pull |
| D4 | Four roles and mandates | Give a practice responsibility to each role: mandate, asks, use when, watch out, consequence | **Each role** and **the four responsibilities defined** |

## Route 2 — task upgrades

- **Stage A:** role cards show their mandate *and what they ask*; the CSRD / ESRS / EED terms open glossary panels.
- **Stage B:** every option shows what it involves, with *use when · watch out* one tap away; no check (an open judgement).
- **Stage C:** layer cards show what each *needs*; ✓/✕ verdict on the dependency order only.
- **Stage D:** live sums ("15 + 15 + 25 + 20 + 25 = 100"), delta from an even split, why-result (leader and margin, ties named), tensions, underweighted factors and their risk, and a *what just changed* line.
- **Stage E:** each role shows *use when*; each responsibility shows what it means; under every placement a **"What this adds up to"** consequence line; a live summary of who holds what; ✓/✕ verdicts cleared when a responsibility moves.
- **The case is briefed once** (`ENGAGEMENT`); the task framing is one sentence naming the five stages.

## Coverage table — task step → material that defines it

| Task step / option | Defined in | Where the rule lives | Interactive that rehearses it |
|---|---|---|---|
| T1-A six areas; second tag | M3 | visible definition + Read more rules | M3 chips and practice sentences |
| T1-A improvement per area | M4 | short-term vs structural (visible) | M4 fix tally |
| T1-B target, owner, decision | M1 | visible definition | M1 wired-check |
| T1-B six gates, sound AND wired | M4 | visible definition + gate list in Read more | M4 gate filter |
| T1-B "activity is not enough" | M2 | visible definition | M2 layer ladder |
| T1-C short-term vs structural | M4 | visible definition | M4 fixes (short-term / structural) |
| T2 Lines A, B, C | M7 | visible definition; *involves* on each line in the task | M7 condition matrix |
| T2 seven criteria | M7 Read more (`CriteriaGuide`); M6 (informative value, controllability); M5 (steering, long-term) | Read more + key in the task | M6 triangle, M5 loop |
| T2 conditions (budget, visible progress, incomplete data, simple reports, IT usability) | M7 | matrix of neutral facts | M7 condition matrix |
| T2 attractive-but-weak risks | M7 | visible trap sentence | M7 dashboard ± review |
| T2 review cycle, owner | M5 | visible definition | M5 loop |
| R2-A four role lenses | D4 | visible definition + Read more role guide | D4 role lab |
| R2-A reasons (CSRD/ESRS/EED) | D1 Read more + glossary | glossary panels | — |
| R2-B eight guiding decisions | D2 Read more (`GuidingOptionsGuide`) | means / use when / watch out; also under each option | D2 staircase (rationale for staging) |
| R2-C three layers + first move | D2 | visible definition | D2 build orders |
| R2-D five factors | D3 | visible definition | D3 pentagon lab |
| R2-E four responsibilities | D4 Read more (`ResponsibilitiesGuide`) | means; consequences under each placement | D4 role lab |
| R2-E roles | D4 | visible mandates + Read more | D4 role lab |

## Defensible answers (mentor keys)

- **T1-A** signals: one expected area each; a defensible secondary is marked per signal. **T1-B** six metrics: each has one expected answer (all six gates). **T1-C** six moves: one expected lane each.
- **T2** — genuinely open. The check never marks the pick: it tests only that the justification references ≥ 2 criteria and pre-empts the standard objection to the chosen line. Key names C as the textbook-defensible pick, with a `teachingNote` for A and B.
- **R2-C** — the one place with a single defensible order (short → medium → structural). **R2-E** — each responsibility maps to one role by its D4 mandate (KPI ownership and review → CIO, data collection → Controlling, external sign-off → Head of Sustainability); a role holding nothing is not an error. **R2-A/B/D** open; g2 + g4 + g6 is the recommended combination, g1 is defensible from the sustainability lens.

## Shared components

- `components/ui/MicroCard.tsx`, `ReadMore.tsx`, `Glossed.tsx` (`GlossedText`, `TermPanel`, `TermChips`), `DiagramKit.tsx`, `CheckVerdict.tsx`.
- `components/ui/MiniNav.tsx`, `LivePanel.tsx`, `RadarChart.tsx`, `MissingList.tsx` (`MissingItem.before`).
- `lib/usePlacementHistory.ts` + `components/ui/UndoRedoControls.tsx` + `lib/undoShortcuts.ts` — per-exercise undo/redo.
- `components/ui/AnswerKey.tsx` + `MentorFillButton` / `AnswerKeyButton` — mentor tools.
- `components/chrome/RouteGate.tsx` — Route 2's soft, non-blocking "Route 1 first" banner.

## Standards implemented

- **Itemized missing items**, every one a button that scrolls to and flashes the exact field.
- **Export buttons are never disabled.** From an incomplete state they open the missing list and jump to the first gap.
- **Check on demand, clue not answer** — ✓ green / ✕ red, soft clue first, sharper on later checks, never the answer. **Green means "verified", nothing else.** A verdict clears when the state it checked changes.
- **Undo/redo** on every placement exercise. **No hard locks.**
- **Mentor tools** — one auto-fill per route, per-exercise answer keys, passcode `muchson123` in plaintext on purpose. The unlock flag is session-only.
- **Field instructions below the label**, never only in a placeholder.
- **Material traceability** — `MaterialRefs` chips on each task step point back at the cards it draws on (and open their Read more).

## Layout

```
app/
  page.tsx                              two route cards, both available
  route-1-kpis-and-monitoring/          Clarity Digital Services
  route-2-management-decision/          Verdeon Digital Governance Group
lib/
  routes.ts                             day identity (CASE) + the two-entry registry
  materialSection.ts                    MicroCard type (definition · reasoning · more · sources)
  glossary.ts                           terms, meanings, verified source links
  route1/  index · sections (M1–M7) · material · gates (six gates + practice metrics) ·
           task1 (areas, ten signals, six metrics, six horizon items, clues, answer keys) ·
           task2 (seven criteria, three lines + involves, LINE_FACTS, CONDITIONS, clue engine, answer key)
  route2/  index · sections (D1–D4) · material ·
           task (roles, reasons, guiding decisions, layers + dependencies, factors + tensions,
                 readAllocation, responsibilities + consequences, answer key)
  downloadFile.ts                       exportFilename(...) + printHtmlDocument() — PDF via window.print()
  store.ts                              Zustand + localStorage (key aion-greenit-day16), useHydrated()
components/
  route1/   CaseBrief · Material1 · Material2 · MaterialDiagrams (M1–M4) · MaterialDiagrams2 (M5–M7) ·
            Task1 · Task2 · DiagnosisBoard · ClassifyTasks · ReportPanel1/2 · ExportBar1/2 ·
            MentorTools · useRoute1 · exportDocuments
  route2/   CaseBrief · Material · MaterialDiagrams · Task · StageFrame · StageGuiding ·
            StageSequence · StageAllocate · StageGovernance · ReportPanel · ExportBar ·
            MentorTools · useRoute2 · exportDocuments
  ui/       cross-day shared components
```

## Running it

```bash
npm ci
npm run dev
```

The parent `../.claude/launch.json` has a `day16-dev` entry — `preview_start` reads the parent
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
