# AION Green IT — Day 13

**Module 9 (Day 1 of 1): Designing Sustainable Digital Processes** — the interactive working
companion for Day 13.

Two routes, the standard shape from Day 11 on: **Route 1 carries levels 1 and 2**, **Route 2
carries level 3**. Route 1 is bootstrapped from Day 11's triage-escalate-deep-dive pattern (not
Day 12's zone-routing board) because this module's curriculum Task 1 is a single-part exercise,
not a two-part diagnose-then-decide engagement — so Route 1 deliberately inverts Day 11's
material-to-task ratio (~30 min material, ~20 min task, not ~60/~30). Route 2 is bootstrapped from
Day 11's Route 2 and keeps its ~60-minute material depth in full.

## Routes

| Route | Levels | Case | Material | Task | Export |
|---|---|---|---|---|---|
| `/route-1-diagnose-and-decide` | 1 + 2 | ProcessNova Services | S1–S4, ~30 min | Triage (7 signals) → Escalate (2) → Deep dive, ~20 min, one part, no Decide stage | `1-{name}-day13-l1l2task1.json` + `.html` |
| `/route-2-management-decision` | 3 | EcoFlow Administration GmbH (worked example) → Synervia Process Group (task) | A–D, ~60 min | Five exercises, ~90 min, board memo assembling live | `1-{name}-day13-l3task1.json` + `.html` |

Neither route gates the other. Route 2 shows a soft order-suggestion banner until Route 1 has been
exported, and nothing more.

## The shape of a route

```
case brief + learner name (stated once)
      ↓
MATERIAL — one continuous block, all teaching, facilitator-led
      ↓
TASK — one continuous scroll
      Route 1: Triage all 7 → Escalate 2 → Deep dive on those 2 (no second part)
      Route 2: five exercises, none gating another, the board memo assembling beside them
      ↓
ONE EXPORT
```

Standards: `../CLAUDE.md` §12–§13, `../CURRICULUM-GUIDE.md` §2–§3, and the day-local copy in
[`UX-STANDARDS.md`](UX-STANDARDS.md).

## Route 1 — Diagnose & Decide (ProcessNova Services)

**Material, four sections.**

- **S1 — Digitalisation as a sustainability lever.** Five enabler mechanisms (transparency,
  efficiency, monitoring & management, automation, data-based optimisation), each tap-revealing a
  concrete industry example. The rule a Positive signal must satisfy: name a concrete reduction, or
  it's just new capability.
- **S2 — Direct vs. indirect environmental impact.** A two-band diagram (direct: energy, hardware,
  compute, storage, network — indirect: behaviour change, data growth, new services, accelerated
  processes) and the one-line test: does it happen because the system runs, or because people or
  processes changed around it?
- **S3 — The rebound effect and trade-offs.** A predicted-vs-actual curve converging toward zero,
  Jevons paradox named once as background, and the five-way trade-off (convenience, speed,
  automation, transparency, resource use) that explains why an efficiency gain doesn't
  automatically stay banked.
- **S4 — The six-area diagnostic framework.** Six tap-to-reveal tiles (Process Efficiency, Data
  Use, Infrastructure, User Behaviour, Complexity, Management) — the direct source of the deep
  dive's Area field, right down to the worked mini-example on each tile.

**Task — one part, three steps** (no Handover, no Decide stage — the curriculum's Task 1 is fully
covered by triage and deep dive alone):

1. **Triage all 7 signals** (~8 min). Tag each Positive/Negative and tap the phrase that proves it.
   One set-level check — how many hold, never which — a clue that marks every decisive phrase at
   once, and "show the reasoning" after two genuine checks.
2. **Escalate 2** (~3 min). Click to select up to two, click again to deselect — never discarding
   any deep-dive work already written for a re-selected signal — plus a required one-line
   leverage-based justification.
3. **Deep dive on those 2** (~9 min). Area (six-way, from S4) + Direct/Indirect effect (from S2) +
   a free-text improvement approach. Checked per signal (area and effect together); clue and
   two-checks-then-reveal, same convention as Step 1.

Ground truth, clues and the mentor answer key per signal live in `lib/route1/partOne.ts`.

**Export.** One JSON with `meta` (day, route, levels `[1,2]`, schema version `day13.route1.v1`),
`triage` (all 7 rows), `escalation` (the 2 chosen + justification) and `analysis` (the deep-dive
workup). One print-ready HTML report.

## Route 2 — Management Decision (EcoFlow → Synervia)

**Material, four sections (A–D), plus the EcoFlow worked example read after them.**

- **A — Why this reaches a board at all.** Six management levers above, engineering/operational
  symptoms below — no arrow terminates in the lower layer.
- **B — Prioritising digitalisation measures under trade-offs.** Three lanes — Accelerate, Assess &
  Govern, Consolidate — each rated on strategic leverage, feasibility, controllability and risk.
  Names the "attractive short-term, structurally weak" trap directly.
- **C — Decision architecture: RACI and governance.** The sandbox RACI grid, plus the two failure
  modes (diffused accountability, accountability without authority).
- **D — Holding a decision together under incomplete information.** The clickable 2×2 (information
  × cost of delay), the five-part defensible recommendation, the three anchors against pilot
  purgatory.
- **EcoFlow Administration GmbH** — read-only, dark-bannered, rendered directly after D: situation,
  four levers, the prioritised measure ("introduce an assessment framework before further
  digitalisation momentum is reinforced unchecked") and its justification, the option not chosen,
  and the short/medium/structural sequence.

**The Synervia case** (Synervia Process Group, head of digital strategy / CIO / transformation
advisor) is briefed once, directly above the task, with the name field.

**Task — five exercises**, none gating another, with the Synervia Board Memo assembling live
beside them:

1. **Prioritise & defend** (~25 min, the anchor exercise). Choose one of the three lanes, work
   through a seven-criterion assessment grid (rating + one-line argument per row), then defend the
   choice, name the follow-up decisions it creates, and state two risks of an attractive-but-weak
   choice. Free-text and argument-graded — no live check; the mentor key carries the assessment
   criteria and a worked strong/weak example.
2. **Rank the guiding decisions** (~15 min). Three of seven candidates, full undo/redo, "test my
   ranking" asks a diagnostic about the learner's own #1 rather than grading the order.
3. **The trade-off map** (~20 min). Five digitalisation initiatives, two yes/no diagnostics each,
   checked per initiative. Undo/redo, remove-and-retry, required justification for every initiative
   landing in Strategic bets.
4. **RACI** for the digital-sustainability assessment standard, across six roles.
5. **The decision that cannot wait** (~15 min). Decision, assumption, falsifier, cost of waiting.

**Export.** JSON with `prioritisation`, `rankedDecisions`, `tradeOffMap`, `raci` and `decisionNow`
(schema version `day13.route2.v1`); HTML as a real board memo, printable to A4.

## Shared components (from Day 11 on)

- `lib/materialSection.ts` — the section type both routes use.
- `components/ui/MaterialBlock.tsx` — renders the diagram before the prose.
- `components/ui/MiniNav.tsx` — sticky section dots and the top progress bar.
- `components/ui/LivePanel.tsx` — a sticky deliverable column on desktop, an expandable strip on
  mobile.
- `components/ui/RaciGrid.tsx` — the interactive, structure-only-validating RACI grid, reused by
  Route 2's material demo and Exercise 4.
- `components/ui/MissingList.tsx` — `MissingItem.before` opens a closed container before scrolling.
- `lib/usePlacementHistory.ts` — per-exercise undo/redo, used independently by Route 2's ranking
  and trade-off-map exercises.

## Standards both routes implement

- **Itemized missing items**, every one a button that scrolls to and flashes the exact field.
- **Export buttons are never disabled.** From an empty state they open the missing list and jump
  to the first gap.
- **Check on demand, clue not answer** — except Route 2 Exercises 1 and 5, which are free-text and
  argument-graded by design, with no live check.
- **Undo/redo and retry** on every placement; completed cards stay editable.
- **No hard locks** between routes.
- **Mentor tools once per route** — one auto-fill for everything, answer keys per exercise, shared
  passcode `muchson123` in plaintext on purpose. The unlock flag is session-only, so a reload
  re-locks the keys.
- **Field instructions below the label**, never only in a placeholder.
- **Material traceability** — `MaterialRefs` chips on every task step; every material section is
  referenced by at least one exercise or the case brief.

## Layout

```
app/
  page.tsx                          two route cards, labelled with the levels they cover
  route-1-diagnose-and-decide/      ProcessNova Services
  route-2-management-decision/      EcoFlow → Synervia
lib/
  routes.ts                         day identity + the two-entry registry
  materialSection.ts                shared material section type
  route1/  index · sections · material (S1–S4) · partOne (signals, triage/escalate/analysis)
  route2/  index · sections · material (A–D + EcoFlow) · task (5 exercises)
  downloadFile.ts                   exportFilename(name, levels[], taskNumber) + Blob download
  store.ts                          Zustand + localStorage (key aion-greenit-day13), useHydrated()
components/
  route1/   CaseBrief · Material · MaterialDiagrams · PartOne · TriageBlock · TriageRow ·
            EscalatePicker · DeepDiveCard · ReportPanel · ExportBar · MentorTools · …
  route2/   Material · MaterialDiagrams · CaseBrief · Task · PrioritiseExercise · RankExercise ·
            MapExercise · TradeoffMapSvg · RaciExercise · DecideNow · BoardMemo · ExportBar ·
            MentorTools · …
  ui/       cross-day shared components
```

## Running it

```bash
npm ci
npm run dev
```

The parent `../.claude/launch.json` has a `day13-dev` entry — `preview_start` reads the parent
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
