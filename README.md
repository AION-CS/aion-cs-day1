# AION Green IT — Day 11

**Energy-Efficient Software & Green Coding Principles** — the interactive working companion
for Day 11. The content was carried over from Day 10; what changed here is the **shape**:
Day 11 is the first day built on the two-route standard.

## The two-route standard (new here, and from now on)

Days 1–10 shipped three routes, one per curriculum level. A learner met the same company
three times, with three intros, three name fields and three exports — and the seam showed
most between L1 and L2, because "work out what is wrong" and "decide what to do about it"
are one job, not two.

From Day 11 on a day ships **exactly two routes**:

| Route | Carries | Case | Deliverable |
|---|---|---|---|
| `/route-1-diagnose-and-decide` | **Levels 1 + 2**, as one continuous engagement (~40 min) | AppNexa Solutions | AppNexa Engagement Report |
| `/route-2-management-decision` | **Level 3** (~20 min) | SoftPulse (worked example) → CodeVista | Board Memo |

The learning objectives are unchanged. Only the delivery merges. The rules that make the
merge invisible are written up in [`../CLAUDE.md`](../CLAUDE.md) §12 and
[`../CURRICULUM-GUIDE.md`](../CURRICULUM-GUIDE.md) §2, with a day-local copy in
[`UX-STANDARDS.md`](UX-STANDARDS.md) §12.

## Route 1 — Diagnose & Decide

One engagement at AppNexa Solutions, in the order the real thing happens.

```
intro → the engagement (case + name, stated once)
      → material A–F        (seeing where software wastes energy)
      → STAGE 1             diagnose the live system trace
      → the bridge          "two weeks later" — their own findings, handed forward
      → material G–J        (a defensible way to compare the options)
      → STAGE 2             spend the quarter, and defend the call
      → one export          AppNexa Engagement Report
```

**Material (A–J, one continuous run).** A–F: why every instruction, stored byte and
transmitted byte is a physical electricity draw (IEA 2024: data centres ≈415 TWh, ~1.5% of
global electricity); functionally correct versus energy-efficient as two orthogonal
questions; the Software Carbon Intensity specification (ISO/IEC 21031:2024) and its
`C = ((E × I) + M) per R` formula as a rate rather than a total; the three Green Software
Foundation principles; the six categories where inefficiency hides; and why the lever for
most of them sits at the standards layer, with iSAQB's CPSA Advanced Level Module GREEN as
the professional reference point. G–J: the four hard edges on AppNexa's quarter, none of
them technical; three competing measures mapped onto the Green Software Patterns lifecycle
stages; the seven decision dimensions written as questions a consultant has to answer; and
how to argue a call you cannot fully prove, with Cynefin's complex domain as the reference.

Every section carries a `reasoning[]` block ("How to decide when this comes up in the task")
and at least one real external source.

**Stage 1 — diagnose the trace.** Six flagged components on AppNexa's live system trace.
For each: inspect it, sort the symptom into one of six categories, pick an improvement lever
from four options, justify it against the original behaviour, and mark it Quick Fix or
Structural Fix. Part 1 of the Engagement Report assembles on the right as the learner works.

**The bridge.** A "two weeks later" panel that hands the learner their own numbers back —
*"You filed 6 findings: 4 needing a structural standard, 2 fixable as a one-off patch"* —
and turns the question from "what is wrong with this system" into "what do we fund". It also
carries the one genuinely load-bearing line from the standalone recap the merge deleted:
which of the six categories each option actually attacks.

**Stage 2 — spend the quarter.** For each of three options the learner answers a situational
question, predicts the option's profile across the seven dimensions on sliders, then reveals
the real profile — which renders as a solid polygon over their dashed prediction, so the gap
is visible without anyone being told they were wrong. Then they commit to one and defend it:
strategic rationale, feasibility argument, two follow-up decisions the choice forces, and two
risks of the road not taken.

The ground-truth profiles are built so no option dominates: A wins on leverage and long-term
effect but is weak on immediate impact and team acceptance; B wins on immediate measurable
impact but is weak on leverage and carries execution risk; C wins on feasibility and
measurability but shows nothing visible this quarter. Risk is the one inverted axis — higher
is worse — and the material says so explicitly, because a radar chart otherwise implies a
bigger polygon is a better option.

**One export.** `1-{name}-day11-l1l2task1.json` + `.html`. The HTML is a single print-ready
report with a banner per part; the JSON keeps `partOne` (level 1: findings, correctness
flags, reflection, summary) and `partTwo` (level 2: per-dimension prediction gaps,
recommendation) as separate blocks, so a grader can still score the two levels independently
out of one file.

## Route 2 — Management Decision

Level 3, unchanged in substance from Day 10 and renumbered from Route 3. Two companies on
purpose: **SoftPulse Digital Products GmbH** is a read-only worked example in the material,
and **CodeVista Digital Platforms** is the case the learner actually works — CodeVista
appears nowhere else in the course, so the task tests whether the reasoning transfers rather
than whether AppNexa's specifics were memorised.

**Material (A–D).** Why this reaches a board at all; RACI in full, with its one structural
rule (exactly one Accountable) and the two ways it fails; the regulatory and professional
backdrop (CSRD / ESRS E1, iSAQB CPSA Module GREEN, and the SOFT framework as the cautionary
case of pilots that succeed technically and never scale); then the SoftPulse worked example.

**The task — CodeVista Board Memo.** Rank three of six guiding decisions and justify the top
one; place five measures on a 2×2 trade-off map (momentum cost against structural impact);
assign a RACI for ownership of the green coding standard; and name one decision that must be
made now plus what waiting would cost. Exports as `1-{name}-day11-l3task1.json` + `.html`.

## What's here

- **Static export.** `output: "export"` — `npm run build` writes a plain static site to
  `out/`, servable by anything. No backend, no auth, no runtime.
- **Local-only state.** Zustand + `persist` to `localStorage` under the key
  `aion-greenit-day11`, distinct from every other day's storage so several days can be open
  in one browser without colliding.
- **No extra libraries.** Native HTML5 drag events, CSS-only keyframe animation, inline SVG,
  and a Blob download for export. Dependencies: `next`, `react`, `zustand`, `clsx`.

## Layout

```
app/
  page.tsx                          two route cards, each labelled with the levels it covers
  route-1-diagnose-and-decide/      the merged engagement
  route-2-management-decision/      level 3
lib/
  routes.ts                         CASE identity + the two-entry ROUTES registry (with `levels`)
  route1/
    index.ts                        route identity: store keys, case, name field, bridge, export
    sections.ts                     the A–J section ids, labels and anchor ids — one run
    diagnosis.ts                    stage 1: material A–F, categories, flow graphs, six hotspots
    decision.ts                     stage 2: material G–J, dimensions, three options, commit copy
  route2.ts                         all of route 2's content
  downloadFile.ts                   `exportFilename(name, levels[], taskNumber)` + Blob download
  store.ts                          the generic Zustand + localStorage store, plus `useHydrated()`
components/
  route1/                           the merged route: CaseBrief, Material, StageOne, Bridge,
                                    StageTwo, DiagnosisPanel, DecisionPanel, ExportBar, …
  route2/                           route 2's own components
  ui/                               cross-day shared components
```

`lib/route1/` is a folder rather than one file because the route spans two levels: the two
halves stay separately readable, while `index.ts` owns everything that must only be said
once. Nothing outside the folder imports the halves directly — `@/lib/route1` is the module.

## Standards both routes implement

Interaction standards come from [`../CLAUDE.md`](../CLAUDE.md); content standards from
[`../CURRICULUM-GUIDE.md`](../CURRICULUM-GUIDE.md).

- **Itemized missing items, never a generic message.** `useRoute1().missing` derives one named
  entry per concretely-missing thing ("Justification for Hotspot 3 — The Triple-Send
  Notification"), across both stages, rendered through the shared `MissingList`. Every entry
  is a button that scrolls to and flashes the exact field.
- **The export button is never disabled.** Clicking it while incomplete opens the missing list
  and jumps to the first gap — which may be four screens up, in stage 1.
- **Check on demand, clue not answer.** The Check button speaks only to the category
  placement, tells the learner only that it is wrong, and puts a directional hint behind one
  more click. It never reveals the category, the lever or the fix type.
- **Undo/redo and retry on placements.** Full history via `useFindingSortStore`, plus a
  remove-and-retry affordance on every placed card that re-arms it for immediate replacement.
- **No hard locks.** Either route is reachable regardless of the other's state; Route 2 shows
  a soft order-suggestion banner only.
- **Mentor tools, both of them, once per route.** `MentorFillButton` fills every persisted
  field of the whole route — both stages — in one click; `AnswerKeyButton` unlocks a
  per-exercise key giving the expected answer and a reason for *every* option including the
  rejected ones. Shared passcode `muchson123`, in client-side plaintext on purpose — a gate
  against accidental clicks, not security. The unlock flag lives in the store's non-persisted
  session slice, so a reload re-locks it.
- **Field instructions below the label**, never only in a placeholder.
- **Every task step traces back to the material** via `MaterialRefs` chips that scroll to the
  cited section and flash it in the accent (not the red missing-item flash).

## Running it

```bash
npm ci
npm run dev
```

The parent [`../.claude/launch.json`](../.claude/launch.json) has a `day11-dev` entry
(`npm --prefix day11 run dev`) — `preview_start` reads the parent config, not this folder's.

To produce the static site:

```bash
npm run build
```

Output lands in `out/`. **Never run the build while the dev server is running** — both write
to `.next`, after which the dev server serves 404s for `main-app.js` and nothing hydrates.
The page still server-renders, so it looks fine while every click is dead.

Typecheck on its own:

```bash
npm run typecheck
```

## Repository note

This folder was cloned from the Day 10 repository, so `git remote origin` still points at
`aion-green-it-day10.git`. Point it at a Day 11 repository before pushing.
