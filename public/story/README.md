# Route 1 story art

Drop the generated images here. The player picks them up automatically — any file
that isn't here yet renders as a labelled placeholder naming the path it wants, so
nothing breaks while the art is still being made.

| File | Scene | Aspect |
|---|---|---|
| `r1-01-the-pitch.jpg` | The pitch — presenting sustainability advice to a client | 16:9 |
| `r1-02-the-growth.jpg` | The growth — an office that outgrew its own plan | 16:9 |
| `r1-03-the-fleet.jpg` | The fleet — the hardware, laid out as an inventory | 16:9 |
| `r1-04-the-contract.jpg` | The contract — the three-year lease on a finance desk | 16:9 |
| `r1-05-the-blind-spot.jpg` | The blind spot — five corners of the same office at once | 16:9 |
| `r1-06-your-brief.jpg` | Your brief — the early-morning corridor, first person | 16:9 |
| `r1-narrator.png` | Nadine Keller cut-out, transparent background (optional) | portrait |

Keep each scene file under ~400 KB — this is a static export and every image ships
with the site. Filenames are referenced in `lib/route1.ts` (`CASE_STORY`, `NARRATOR`);
change them there if you rename anything.

The prompts used to generate these live in `../../STORY-IMAGE-PROMPTS.md`.
