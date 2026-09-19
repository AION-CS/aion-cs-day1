import { ReferencesAccordion } from "@/components/ui/ReferencesAccordion";
import { MATERIALS } from "@/data/materialIndex";
import type { RefKey } from "@/data/references";
import { CardA1, CardA2, CardA3, CardA4 } from "@/components/materi/MateriA1to4";
import { CardA5, CardA6, CardA7, CardA8 } from "@/components/materi/MateriA5to8";
import { CardB1, CardB2, CardB3 } from "@/components/materi/MateriB1to3";
import { CardB4, CardB5, CardB6, CardB7 } from "@/components/materi/MateriB4to7";
import { CardC1, CardC2, CardC3, CardC4, CardC5, CardC6 } from "@/components/materi/MateriC";

// What each block's cards cite, for its References accordion.
const REFS_A: RefKey[] = [
  "reichheld1990", "carroll1992", "gupta2003", "dick1994", "oliver1999", "reichheld2003", "jones1995", "mayer1995",
  "morgan1994", "gustafsson2005", "burnham2003", "lemon2016", "gartner2017", "argyris1990", "senge1990", "minto2009",
  "anderson2006", "gdpr", "uwg7",
];
const REFS_B: RefKey[] = [
  "bauer1960", "mayer1995", "morgan1994", "anderson2006", "kahneman1979", "samuelson1988", "dixon2022", "webster1972",
  "gartner2017", "gdpr", "betrvg87", "nis2", "bsi2025", "ibm2025", "tversky1971", "rackham1988",
];

const REFS_C: RefKey[] = ["bezos2015", "kahneman1993", "intercom2016", "ellis2017", "pmbok", "brealey", "amram1999", "gupta2003"];

const minutes = (b: "A" | "B" | "C") => MATERIALS.filter((m) => m.block === b).reduce((s, m) => s + m.minutes, 0);

export function MateriA() {
  return (
    <section id="materi-a" className="space-y-4">
      <header className="space-y-1">
        <p className="smallcaps text-accent">Materi A · Level 1 · Knowledge · 60 min</p>
        <h2 className="text-h1">What a customer file records, and what it does not</h2>
        <p className="max-w-prose text-body text-ash">
          Eight short cards ({minutes("A")} min of reading and exploring, the rest is discussion). Each carries a named framework, a real
          figure or a real case, and each diagram is a tool the task below reuses.
        </p>
      </header>
      <CardA1 />
      <CardA2 />
      <CardA3 />
      <CardA4 />
      <CardA5 />
      <CardA6 />
      <CardA7 />
      <CardA8 />
      <ReferencesAccordion block="A" keys={REFS_A} />
    </section>
  );
}

export function MateriC() {
  return (
    <section id="materi-c" className="space-y-4">
      <header className="space-y-1">
        <p className="smallcaps text-accent">Materi C · Level 3 · Management decision · 60 min</p>
        <h2 className="text-h1">Deciding under a budget that cannot fund everything</h2>
        <p className="max-w-prose text-body text-ash">
          Six short cards ({minutes("C")} min of reading and exploring, the rest is discussion). They give you the tests you need for Task 3: how reversible a
          commitment is, why one success is not a forecast, how to score under a cap, what leaving something out costs, and who owns what.
        </p>
      </header>
      <CardC1 />
      <CardC2 />
      <CardC3 />
      <CardC4 />
      <CardC5 />
      <CardC6 />
      <ReferencesAccordion
        block="C"
        keys={REFS_C}
        note="Frameworks from Day 1 Levels 1–2 are listed in the references of Routes 1 and 2."
      />
    </section>
  );
}

export function MateriB() {
  return (
    <section id="materi-b" className="space-y-4">
      <header className="space-y-1">
        <p className="smallcaps text-accent">Materi B · Level 2 · Application · 60 min</p>
        <h2 className="text-h1">What decides a purchase, and how to put figures on it</h2>
        <p className="max-w-prose text-body text-ash">
          Seven short cards ({minutes("B")} min of reading and exploring, the rest is discussion). The cost explorer and the buying committee map
          come back in Task 2 with the Kessler data.
        </p>
      </header>
      <CardB1 />
      <CardB2 />
      <CardB3 />
      <CardB4 />
      <CardB5 />
      <CardB6 />
      <CardB7 />
      <ReferencesAccordion block="B" keys={REFS_B} />
    </section>
  );
}
