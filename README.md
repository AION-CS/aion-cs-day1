# AION Green IT — Day 13

**Module 8: Energy-Efficient Networks, IoT Sustainability & 5G** — the interactive working
companion for Day 13.

Day 13 continues the two-route standard introduced on Day 11: **Route 1 carries levels 1 and 2**
as one engagement, **Route 2 carries level 3**. Every route has the same shape — the case once, one
material block with all of the teaching, one task, one export.

## Routes

| Route | Levels | Case | Material | Task | Export |
|---|---|---|---|---|---|
| `/route-1-diagnose-and-decide` | 1 + 2 | SmartLink Operations | S1–S7, ~120 min | Part 1 Diagnose — Signal Board (~15 min) → handover → Part 2 Decide — Decision Scorecard (~15 min) | `1-{name}-day13-l1l2task1.json` + `.html` |
| `/route-2-management-decision` | 3 | NetSphere Industrial Systems GmbH (worked example) → Vertex Connected Industries (task) | A–F, ~80 min | Seven input sections, board memo assembling live | `1-{name}-day13-l3task1.json` + `.html` |

Neither route gates the other. Route 2 shows a soft order-suggestion banner until Route 1 has been
exported, and nothing more.

## The shape of a route

```
case brief + learner name (stated once)
      ↓
MATERIAL — one continuous block, all teaching, facilitator-led
      ↓
TASK — one continuous scroll
      Route 1: Part 1 — Diagnose → inline handover → Part 2 — Decide
      Route 2: seven input sections, the board memo assembling beside them
      ↓
ONE EXPORT
```

There is no material between the two parts of Route 1: the handover is a small inline panel built
from the learner's own answers. Standards: `../CLAUDE.md` §12, `../CURRICULUM-GUIDE.md` §2–§3, and
the day-local copy in [`UX-STANDARDS.md`](UX-STANDARDS.md) §12.

## Route 1 — Diagnose & Decide (SmartLink Operations)

**Material, seven sections.**

- **S1 — Why network infrastructure is a sustainability factor.** Networks are dimensioned for
  peak but powered for uptime, so a link at a tenth of its capacity does not draw a tenth of its
  power. Covers the legacy-generation overlap (2G/3G/4G/5G running in parallel) and how network
  layers scale with load differently.
- **S2 — Levers of energy-efficient network technology.** Seven levers (load, protocol, control,
  redundancy, hardware and more), each with a mechanism, a precondition and a failure mode — and
  the standard that says an efficiency figure without a stated boundary is not comparable.
- **S3 — IoT sustainability across the lifecycle.** Per device the impact is trivial; per fleet it
  is device count × lifetime × replacement rate × data generated, and most of that is decided
  before the first sensor is switched on (manufacture, deployment, power, connectivity, data).
- **S4 — 5G: efficiency promise and system-level risk.** Up to roughly 90% less energy per bit is a
  design target for one factor of a product — total energy is energy per bit multiplied by bits,
  and adoption-growth scenarios (conservative / observed / aggressive) can still raise total
  consumption.
- **S5 — Technological potential vs. real system impact.** A component can be demonstrably more
  efficient while the system it joins consumes more. Four leak mechanisms decide which way it
  goes: rebound, layer stacking, displacement, complexity.
- **S6 — The 7-criteria decision lens.** Seven criteria, seven diagnostic questions, seven common
  misuses — the tool Part 2 uses directly, built so no single option leads on every criterion.
- **S7 — Decision-making under incomplete information.** Waiting for complete data is a decision
  too: decide what is reversible now, stage what is not, and say in advance what would prove you
  wrong (worked through a building-management sensor pilot).

**Part 1 — Diagnose: the Signal Board.** Six signals from SmartLink's plan. Placement is the
*result* of a diagnosis, not a click into a bucket: the learner answers two diagnostic questions —
potential or risk, and the primary area affected — and the card routes itself to the chosen zone
among seven (Network Operations, IoT, Data, Energy, Lifecycle, 5G, Management). Then, in place,
three required inputs: an improvement approach, the root cause and the time horizon. "Check my
routing" reads patterns across the whole board and gives clues; it never names a zone. Ground
truth, clues and the mentor answer key per signal live in `lib/route1/partOne.ts`.

**Handover.** Inline, never a gate: the learner's own tally carried forward as a small SVG plus one
line of teaching into Part 2.

**Part 2 — Decide: the Decision Scorecard.** Three competing lines of measures (A / B / C), one of
which SmartLink can prioritise, stated against five real constraints (limited budget, visible
innovation progress expected, incomplete data, departments wanting new applications quickly,
IT/operations fearing complexity). For each of the seven S6 criteria the learner ranks A, B and C
1–2–3 — no ties, no sliders — and a live radar draws the three profiles out of those ranks. Then the
commit: one option, a justification, two follow-up decisions, and two risks of whichever option the
learner's own ranking marks as most attractive short-term. Nothing is scored automatically; the
expected ranks exist for the mentor answer key and the export only. Data lives in
`lib/route1/partTwo.ts`.

**Export.** One JSON with `meta` (day, route, levels `[1,2]`, schema version `day13.route1.v1`),
`partOne` (per signal: routing answers, approach, root cause, horizon, check attempts) and
`partTwo` (per-criterion ranking, the live radar profiles, the commit). One print-ready HTML report.

## Route 2 — Management Decision (NetSphere → Vertex)

**Material, six sections (A–F).**

- **A — Why this is a management question, not a technology question.** Efficiency is a ratio;
  consumption is an absolute — a board that confuses the two has approved nothing.
- **B — The NetSphere infrastructure map.** NetSphere Industrial Systems GmbH is expanding across
  production, logistics and building management: six hotspots, one company, no obviously wrong
  decision anywhere.
- **C — The six-dimension analysis.** Every hotspot from section B lands in exactly one of six
  dimensions; governance is where the other five compound.
- **D — The four biggest levers.** Four moves in the order that makes the others work — one of the
  four makes the other three possible, and the other three do not make it unnecessary.
- **E — The prioritised first measure, and why.** The reasoning to transfer, not the answer to
  copy: the argument stated so it can be defended, and so it can be proven wrong.
- **F — Short / medium / structural roadmap.** A measure without an owner and an evidence test is
  an intention, not a plan.

**The Vertex case** (Vertex Connected Industries, head of infrastructure & connectivity strategy —
CIO/CTO advisor) is briefed once, directly above the task, with the name field. Vertex's general
conditions and what's specific to Vertex are stated up front — the warning is explicit: NetSphere's
answer is not Vertex's answer.

**Task — seven input sections**, with the Vertex Board Memo assembling live beside them:

1. **Strategic relevance** — which factors (cost, compliance, reliability, irreversibility,
   innovation, …) actually apply to Vertex's situation.
2. **Three guiding decisions** — the decisions that will bind every team going forward.
3. **Decision logic** — a self-contained 7-criteria set applied to Vertex, not copied from
   NetSphere.
4. **Central trade-offs** — the tension picker, forcing an explicit choice on the trade-offs that
   matter here.
5. **First measure** — Vertex's own prioritised measure and its justification.
6. **Governance** — a RACI grid for ownership of the efficiency and architecture standard.
7. **The decision to take now** — decision, assumption, falsifier, cost of waiting.

**Export.** JSON with the answers and derived state from all seven sections (schema version
`day13.route2.v1`); HTML as a real board memo — recommendation, guiding decisions, trade-offs, RACI
table and the decision required now — printable to A4.

## Shared components (from Day 11 on)

- `lib/materialSection.ts` — the section type both routes use (adds `code`, `standfirst`, `body`,
  `minutes`, and a reference `detail`).
- `components/ui/MaterialBlock.tsx` — renders the diagram before the prose.
- `components/ui/MiniNav.tsx` — sticky section dots and the top progress bar.
- `components/ui/LivePanel.tsx` — a sticky deliverable column on desktop, an expandable strip on
  mobile.
- `components/ui/RaciGrid.tsx` — the interactive, structure-only-validating RACI grid.
- `components/ui/MissingList.tsx` — `MissingItem.before` opens a closed container before scrolling.
- `components/ui/RadarChart.tsx` — `ringCount` for 0–10 scales, `showGrid` for fade-in overlays, and
  the `"option"` series tone for Day 13's A / B / C profiles.

## Standards both routes implement

- **Itemized missing items**, every one a button that scrolls to and flashes the exact field —
  opening a collapsed card or hidden tab on the way when needed.
- **Export buttons are never disabled.** From an empty state they open the missing list and jump
  to the first gap.
- **Check on demand, clue not answer.**
- **Undo/redo and retry** on every placement; completed cards stay editable.
- **No hard locks** between routes or parts.
- **Mentor tools once per route** — one auto-fill for everything, answer keys per exercise, shared
  passcode `muchson123` in plaintext on purpose. The unlock flag is session-only, so a reload
  re-locks the keys.
- **Field instructions below the label**, never only in a placeholder.
- **Material traceability** — `MaterialRefs` chips on every task step.

## Layout

```
app/
  page.tsx                          two route cards, labelled with the levels they cover
  route-1-diagnose-and-decide/      SmartLink Operations
  route-2-management-decision/      NetSphere → Vertex
lib/
  routes.ts                         day identity + the two-entry registry
  materialSection.ts                shared material section type
  route1/  index · sections · material (S1–S7) · partOne · partTwo
  route2/  index · sections · material (A–F) · task
  downloadFile.ts                   exportFilename(name, levels[], taskNumber) + Blob download
  store.ts                          Zustand + localStorage (key aion-greenit-day13), useHydrated()
components/
  route1/   CaseBrief · Material · PartOne · SignalBoard · SignalCard · PartTwo · CommitPanel ·
            ExportBar · MentorTools · diagrams · …
  route2/   Material · CaseBrief · Task · GuidingDecisionsSection · TradeOffSection ·
            GovernanceSection · DecisionNowSection · MemoPreview · ExportBar · MentorTools · …
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
