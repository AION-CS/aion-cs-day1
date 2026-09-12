# Day 9 · Route 1 — story image prompts

Copy-paste into any image generator (Midjourney, DALL·E, Ideogram, Firefly, Imagen…).
Seven images: six 16:9 scenes plus one optional narrator cut-out. Drop the results into
`public/story/` under the filenames given — the player picks them up automatically.

Work in this order: generate the **narrator** first, then use her as a character reference
for scenes 1, 4 and 6 so the same person appears throughout.

---

## 1 · Shared context (paste once, at the top of your session)

> I am generating a set of 7 images for a corporate e-learning module on sustainable IT,
> aimed at adult professionals in Germany and across Europe. They are scenes from one
> continuous story about a fictional company:
>
> **UrbanByte Consulting** — a boutique digital transformation consultancy founded in 2014,
> around 180 employees, split between a Frankfurt headquarters and a smaller Amsterdam
> office. It has grown about 40% in three years and its IT has scaled reactively rather
> than by design. The company publicly sells "sustainable digital transformation" advice to
> its clients, but has never audited its own workplace IT against that same standard. Its
> fleet is roughly 210 business notebooks, 90 external monitors, 140 docking stations and a
> shared printer on each floor; every notebook is replaced on a flat three-year leasing
> cycle regardless of its actual condition.
>
> The emotional register of the story is **not** scandal or blame. Nobody in it is careless.
> It is the quiet, recognisable situation of a competent company where five different people
> each own one piece of a problem and nobody owns the whole. The images should feel calm,
> professional and observational — a documentary eye, not a dramatic one.
>
> All 7 images must look like one set: same illustration style, same palette, same light.

## 2 · Style prefix (prepend to EVERY scene prompt)

> Modern flat editorial illustration, clean vector-like shapes with subtle grain, calm
> observational mood, restrained corporate European setting. Palette strictly limited to:
> off-white #F5F6F7 and white #FFFFFF grounds, charcoal #16191D linework and dark surfaces,
> mid-grey #5E6670 secondary tones, hairline grey #E2E5E9 edges, one deep green accent
> #0E7A5A used sparingly for emphasis, and a muted amber #B87514 only where something needs
> quiet attention. Soft even daylight, soft long shadows, no harsh contrast, no neon. Adults
> in ordinary business-casual clothing, diverse in age and background, natural postures, no
> exaggerated expressions. Uncluttered composition with generous negative space, subject
> placed off-centre so the left third stays relatively calm. 16:9 aspect ratio, high detail
> but never busy. **Absolutely no text, no letters, no numbers, no logos, no brand marks, no
> watermarks, no signage anywhere in the image.**

## 3 · Character sheet — the narrator

**File:** `public/story/r1-narrator.png` · transparent background · portrait orientation

> [STYLE PREFIX] — a confident woman in her early forties, Managing Partner of a European
> consultancy: shoulder-length dark curly hair, warm mid-brown skin, wearing a well-cut
> charcoal blazer over a plain deep-green top, no jewellery beyond small studs. Waist-up,
> standing, weight on one hip, arms relaxed at her sides, calm direct gaze towards the
> viewer with a faint knowing half-smile — the expression of someone about to admit an
> uncomfortable thing about her own company. Isolated on a fully transparent background, no
> ground shadow, nothing else in frame. Portrait aspect ratio.

Keep this exact description in every scene where she appears so the face stays consistent.

## 4 · The six scenes

### Scene 1 — `r1-01-the-pitch.jpg`
> [STYLE PREFIX] — a bright modern meeting room in a Frankfurt consultancy, floor-to-ceiling
> windows with a soft grey city skyline beyond. [NARRATOR DESCRIPTION] stands to one side
> mid-sentence, one hand open in explanation, presenting to three seated client executives
> whose backs are to us. A large blank presentation screen glows softly behind her with an
> abstract green shape on it and no readable content. The clients lean forward, engaged. The
> mood is competent and persuasive — a firm that is genuinely good at its job.

### Scene 2 — `r1-02-the-growth.jpg`
> [STYLE PREFIX] — a wide view of a busy open-plan consulting office that has clearly
> outgrown its own floor plan: desks added in slightly irregular rows, a few chairs that do
> not match the others, two people sharing a table meant for one, coats on the backs of
> chairs, daylight from tall windows on the right. Around fifteen people working, relaxed and
> ordinary. Nothing broken, nothing chaotic — just a space absorbing more people than it was
> designed for.

### Scene 3 — `r1-03-the-fleet.jpg`
> [STYLE PREFIX] — a clean top-down flat-lay of corporate IT hardware arranged in neat even
> rows on a pale grey surface, like an inventory photograph: a grid of identical closed
> business notebooks, a row of external monitors seen from the back, a line of docking
> stations, a few coiled cables. Perfectly ordered, almost clinical, one single notebook in
> the grid subtly picked out in the deep green accent. No people, no text, no brand marks of
> any kind.

### Scene 4 — `r1-04-the-contract.jpg`
> [STYLE PREFIX] — a tidy finance office desk seen at a slight angle: a thick stack of
> stapled contract paper in the centre, a pen resting on it, a closed laptop to the side, a
> cup of coffee. On the wall behind hangs a large simple wall planner where three identical
> blocks repeat at even intervals across it, each marked only by a plain amber square — a
> cycle that repeats regardless of anything else. [NARRATOR DESCRIPTION] stands at the edge
> of the frame looking at the planner rather than the desk, arms folded, thoughtful. Calm,
> orderly, faintly resigned.

### Scene 5 — `r1-05-the-blind-spot.jpg`
> [STYLE PREFIX] — one wide illustration divided into five soft vertical panels by thin grey
> lines, each panel showing a different corner of the same office in the same style and
> light: (1) a cramped storage room with shelves of unused docking stations and monitors,
> (2) a tidy finance desk with contract paper, (3) rows of desks with a few screens still
> glowing, (4) a shared print station with stacked paper trays, (5) a small IT helpdesk
> counter with a shelf of spare laptops behind it. One person works in each panel, absorbed
> in their own task, none of them looking towards the others. The panels together should read
> as five people doing five jobs well while nobody sees the whole.

### Scene 6 — `r1-06-your-brief.jpg`
> [STYLE PREFIX] — first-person point of view: an empty early-morning office corridor seen
> from the visitor's eye level, pale daylight coming from a window at the far end, doors to
> side rooms slightly ajar, no people at the desks yet. In the lower foreground, at the very
> edge of frame, a hand holds a plain closed notebook. [NARRATOR DESCRIPTION] stands a few
> steps ahead at the corridor's mid-point, half-turned back towards the viewer as if she has
> just finished speaking and is waiting for you to follow. Quiet, anticipatory, the start of
> a working morning.

## 5 · Negative prompt (add to every generation)

> no text, no lettering, no numbers, no logos, no brand names, no watermarks, no signage,
> no charts with readable labels, no stock-photo gloss, no lens flare, no neon or saturated
> colours, no dramatic shadows, no clutter, no crowds, no exaggerated facial expressions,
> no distorted hands, no extra fingers, no surreal or sci-fi elements

## 6 · Technical checklist before dropping files in

- Scenes exported at 16:9, 1600×900 or 1920×1080, JPEG, under ~400 KB each
  (this is a static export — every image ships with the site).
- Narrator exported as PNG with a genuinely transparent background.
- Exact filenames from `public/story/README.md`, all lowercase.
- Check each image at small size: if a scene only reads at full width, it is too busy.

**Photographic variant.** If you prefer photoreal over illustration, swap the first sentence
of the style prefix for: *"Photorealistic corporate documentary photography, 35mm lens, soft
natural window light, shallow depth of field, muted colour grade"* — and keep the palette,
composition, mood and negative-prompt lines exactly as they are, so the set still holds
together.
