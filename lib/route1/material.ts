/**
 * The nine micro-cards, C1–C9 — the whole teaching block for Route 1, both
 * levels, read continuously before either task (CLAUDE.md §12: no material
 * between the parts).
 *
 * Coverage rule (CLAUDE.md §11a): every dimension either task asks the learner
 * to judge is introduced here first. C1–C5 cover Level 1's diagnosis
 * vocabulary — net resource effect and the rebound trap in C1, AI's
 * benefit-versus-load trade-off in C2, circular versus linear and the
 * R-ladder in C3, the seven assessment *lenses* in C4, and the
 * opportunity/mixed/risk verdict rule in C5. C6–C9 step the perspective up
 * for Level 2's prioritisation: deciding under uncertainty in C6, the seven
 * assessment *dimensions* Task 2's radar scores in C7 (a deeper, task-specific
 * cousin of C4's lenses — deliberately not the same seven), enabler versus
 * point-solution leverage in C8, and the attractive-but-weak failure modes
 * (symbolic politics, misinvestment, rebound) in C9. Nothing in either task
 * offers a choice the cards have not named.
 */

import type { MicroCard } from "@/lib/materialSection";
import type { MaterialSectionId } from "./sections";

export const MATERIAL: MicroCard<MaterialSectionId>[] = [
  {
    id: "novelty",
    code: "C1",
    n: 1,
    icon: "blueprint",
    title: "Novelty is not the same as innovation",
    standfirst: "New does not mean sustainable. The net effect does.",
    sentences: [
      "A technology can be genuinely new and still not be a sustainable innovation. What decides it is the net effect across the lifecycle: does total resource use actually fall, or does the technology just look advanced?",
      "A greener tool that makes something cheaper and easier can drive up how much of it gets used, and the extra usage eats the saving — the rebound effect, known in energy economics as the Jevons paradox.",
      "Efficiency lowers cost, lower cost raises demand, and total consumption can end up flat or higher than before the improvement.",
      "So the question is never \"is this new?\" but \"what is the net effect once people change their behaviour around it?\"",
    ],
    reasoning: [
      "Ask what an initiative reduces in absolute terms, not what it makes more efficient per unit. If the only claim is that it is more modern or more advanced, that is novelty, not innovation.",
      "Where an efficiency gain makes something cheaper or easier at scale, expect more usage — count that extra usage before calling the saving real.",
    ],
    sources: [
      {
        label: "Rebound effect / Jevons paradox",
        detail: "Well established in energy economics: efficiency gains partly or wholly offset by higher demand.",
      },
    ],
    minutes: 2,
  },
  {
    id: "aiLoad",
    code: "C2",
    n: 2,
    icon: "chip",
    title: "AI: efficiency promise and resource burden",
    standfirst: "Both sides are real. An AI case that names only one of them is unfinished.",
    sentences: [
      "AI genuinely helps Green IT — load and energy optimisation, predictive maintenance, decision support — but it is not automatically sustainable.",
      "It consumes extra compute, training and inference energy, data and infrastructure, and at scale it is everyday inference, not the one-off training run, that can dominate lifetime energy.",
      "The scale is not marginal: the IEA estimated data-centre electricity at around 460 TWh in 2022, potentially approaching 1,000 TWh by 2026, with AI and crypto as key drivers.",
      "So every AI use case has to be weighed in both directions: what benefit does the application deliver, and what resources does it consume to deliver it?",
    ],
    reasoning: [
      "For any AI initiative, name the benefit and the load in the same sentence. A benefit with no named load is an unexamined claim, not an assessment.",
      "Ask where the compute is continuous (inference running in daily operation) rather than one-off (training) — continuous load is what decides the net effect.",
      "When a real benefit and a real burden are both present, say so. \"Both\" is an assessment, not a hedge — but it needs two material effects, not one effect and one hope.",
    ],
    sources: [
      {
        label: "IEA, Electricity 2024",
        detail: "Data-centre demand outlook: ~460 TWh in 2022, potentially approaching ~1,000 TWh by 2026.",
      },
    ],
    minutes: 3,
  },
  {
    id: "circular",
    code: "C3",
    n: 3,
    icon: "recycleLoop",
    title: "Circular versus linear IT",
    standfirst: "Linear buys, uses and disposes. Circular keeps the value in the loop.",
    sentences: [
      "The linear model is buy → use → dispose. The circular economy keeps value in the loop through the R-strategies: refuse/rethink, reduce, reuse, repair, refurbish, remanufacture and — as a last resort — recycle.",
      "This matters because e-waste is one of the fastest-growing waste streams: the Global E-waste Monitor 2024 reports 62 million tonnes generated in 2022, of which only 22.3% was formally collected and recycled, with e-waste rising around five times faster than documented recycling.",
      "Circularity in IT is not a disposal question decided at the end. It is decided upstream by product design, modularity, take-back systems, provider and as-a-service models, and lifecycle management.",
    ],
    reasoning: [
      "Call an initiative circular only if it keeps devices or components in use longer, or brings them back. Buying new on a fixed cycle is linear however efficient the new hardware is.",
      "The higher up the R-ladder you act (refuse, reduce, reuse, repair), the larger the effect — recycling is the last resort, not the target.",
    ],
    sources: [
      { label: "WEEE Directive (2012/19/EU)", detail: "Binding collection and recycling obligations for electrical and electronic equipment." },
      { label: "EU ESPR (2024)", detail: "Ecodesign for Sustainable Products Regulation — durability, repairability, digital product passport." },
      { label: "Ellen MacArthur Foundation", detail: "R-strategies / circular economy framework." },
      { label: "Global E-waste Monitor 2024 (UNITAR/ITU)", detail: "62 Mt of e-waste in 2022; 22.3% formally collected and recycled." },
    ],
    minutes: 3,
  },
  {
    id: "lenses",
    code: "C4",
    n: 4,
    icon: "layers",
    title: "The seven assessment lenses",
    standfirst: "This is the vocabulary Task 1 uses — open each chip once before you start.",
    sentences: [
      "Sustainable-innovation decisions are read through seven lenses: Innovation, AI use, Resource requirements, Circular economy, Business model, Governance and Investment logic.",
      "Each one names a different reason an initiative succeeds or fails — novelty versus real effect, benefit versus load, footprint, loop versus linear, how value is created and charged, who decides and by what criteria, and whether the money case holds under uncertainty.",
      "In Task 1 you assign exactly one lens per initiative: the lens that names the decisive issue, not simply the topic the initiative is about.",
    ],
    reasoning: [
      "Choose the lens that explains your verdict — why this is an opportunity, a risk, or mixed — rather than the lens that merely describes the subject matter.",
      "If two lenses genuinely fit, take the one a decision-maker would have to act on first.",
    ],
    sources: [],
    minutes: 2,
  },
  {
    id: "viability",
    code: "C5",
    n: 5,
    icon: "target",
    title: "Attractive now versus viable long-term",
    standfirst: "The one distinction Task 1 trains — and the rule that decides the verdict.",
    sentences: [
      "Short-term attractiveness — modern, exciting, marketable — is not the same as structural viability, which is whether an initiative holds up on impact, resources and controllability over time.",
      "Viability also depends on organisational maturity: whether the company can actually run the model. A first take-back scheme can be exactly the right direction and still carry real execution risk.",
      "Two signals decide the verdict: the net resource effect, and the structure behind it — circular or linear, impact-led or novelty-led, organisationally tested or untested.",
      "Both signals pointing the right way is a sustainable opportunity; both pointing the wrong way is a sustainability risk; when the two disagree, the honest verdict is mixed — worth doing, but only under stated conditions.",
      "Telling attractive from viable before the money is committed is the manager's job, and it is what the task below asks of you.",
    ],
    reasoning: [
      "Attractive-but-weak reads as: strong story, thin impact evidence, a load nobody has counted. Viable reads as: a named benefit, a named burden, and someone who can actually run it.",
      "Untested is not the same as reject. Say what would have to be true for it to work and treat that as a condition, not a veto.",
    ],
    sources: [],
    minutes: 2,
  },
  {
    id: "uncertainty",
    code: "C6",
    n: 6,
    icon: "compass",
    title: "Deciding under uncertainty",
    standfirst: "Task 2 steps you up from analyst to consultant — the data stays incomplete either way.",
    sentences: [
      "Managers rarely get complete ROI data before deciding. The skill is not waiting for certainty — it is having a decision logic that stays defensible when information is incomplete.",
      "Waiting has a cost that is easy to miss because it looks like caution: a delayed decision does not remove risk, it just moves that risk downstream to whoever has to decide later with less runway left.",
      "A good early decision, reasoned from the dimensions in C7, also improves your position for the next one — you learn from a real commitment in a way you cannot from a postponed one.",
    ],
    reasoning: [
      "When a task asks you to prioritise with partial data, treat \"we don't have full ROI numbers yet\" as the normal case, not a reason to default to the safest-looking option.",
      "Defend a choice by naming which dimensions it wins on now and which ones stay genuinely open — not by claiming certainty you do not have.",
    ],
    sources: [],
    minutes: 3,
  },
  {
    id: "dimensions",
    code: "C7",
    n: 7,
    icon: "radar",
    title: "The seven assessment dimensions",
    standfirst: "This is the scoring vocabulary Task 2's radar uses — open it before you rate anything.",
    sentences: [
      "Every candidate line of measures is judged on seven dimensions: Strategic leverage (how much it shifts the whole board, not just one square), Innovation effect (genuine new capability, not a rebadge), Sustainability impact (real net resource or emissions benefit), Feasibility (can it actually be delivered now, with today's people and budget).",
      "Risk (what can concretely go wrong), Long-term effect (does the benefit last or decay once attention moves on), and Controllability (can the organisation steer and govern it once it exists) complete the set.",
      "These deepen C4's seven lenses for a prioritisation decision rather than repeating them — a lens named *why* an initiative succeeds or fails; a dimension gives it a Low/Medium/High score you can compare across options.",
    ],
    reasoning: [
      "Score a dimension from what the option's own description supports, not from general enthusiasm for the technology category.",
      "Six axes read \"bigger is stronger.\" Risk reads in reverse — a bigger Risk score means more could concretely go wrong, so a strong profile keeps that one axis small while the rest are large.",
      "A profile with one very high dimension and several low ones is not automatically weaker than an all-Medium profile — which pattern wins depends on what the decision actually needs, which is Task 2's judgement call.",
    ],
    sources: [],
    minutes: 3,
  },
  {
    id: "enablerVsPoint",
    code: "C8",
    n: 8,
    icon: "network",
    title: "Enabler versus point-solution",
    standfirst: "Where the real leverage sits is not always where the visible impact sits.",
    sentences: [
      "A point solution is one technology or one programme solving one thing — visible, contained, easy to evaluate on its own.",
      "An enabler changes how every future decision gets made — an assessment or governance framework, for instance — so every later initiative inherits it automatically.",
      "Enablers usually look less exciting on day one: lower immediate visibility, no single dramatic win to show management. Their payoff is structural — higher strategic leverage and higher controllability, compounding across everything that comes after.",
    ],
    reasoning: [
      "Before scoring Strategic leverage or Controllability (C7) on an option, ask whether it is a decision the organisation makes once, or a decision it will now make correctly every time.",
      "Do not mistake \"less visible now\" for \"less valuable\" — an enabler's benefit shows up in every initiative that follows it, not in itself.",
    ],
    sources: [],
    minutes: 3,
  },
  {
    id: "attractiveWeak",
    code: "C9",
    n: 9,
    icon: "trophy",
    title: "Attractive-but-weak: symbolic innovation and rebound",
    standfirst: "Naming what breaks if the shiny option wins is part of a defensible prioritisation.",
    sentences: [
      "A measure can look excellent for the future and still be structurally weak underneath. Three specific failure modes recur: symbolic politics (a visible signal with little real effect behind it), misinvestment (money and attention committed before the case is proven), and rebound (C1's efficiency-gain-eaten-by-more-usage trap, showing up again at portfolio scale).",
      "None of these make a measure automatically wrong — a first visible win can matter politically. What they demand is that you can say, in advance, what specifically breaks if the attractive option is chosen and the weakness turns out to be real.",
    ],
    reasoning: [
      "When justifying a prioritisation pick, name at least one concrete way it could turn out to be attractive-but-weak, and what would signal that early.",
      "A risk phrased as \"it might not work\" is not this card's point — the point is naming which of the three specific mechanisms (symbolic, misinvestment, rebound) is the live one for this option.",
    ],
    sources: [],
    minutes: 3,
  },
];

export const MATERIAL_INTRO = {
  kicker: "Material · nine cards · about 22 minutes",
  title: "Nine ideas, then you use them — twice",
  intro:
    "This day is deliberately short on reading and long on doing. Each card below is a few sentences, one live diagram you can play with, and the rule you will need when a task asks. C1–C5 give you the diagnosis vocabulary for Task 1; C6–C9 step the perspective up — from reading individual initiatives to prioritising whole lines of measures under incomplete data — for Task 2. Everything either task expects is on this page.",
} as const;
