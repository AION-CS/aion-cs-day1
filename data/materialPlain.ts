import type { MaterialId } from "@/data/materialIndex";

/**
 * The "In plain words" box under each card's scan line: the idea in everyday
 * language, why it matters, and how to read the diagram or interactive below.
 * Written for someone who has never met the topic. Typed as a full Record so a
 * card without an explanation fails the typecheck.
 */
export type PlainExplain = {
  /** The idea itself, in everyday words. */
  idea: string;
  /** Why the learner should care, tied to the case or the task. */
  why: string;
  /** How to read or use the picture below. Omitted for cards without a diagram to read. */
  picture?: string;
};

export const MATERIAL_PLAIN: Record<MaterialId, PlainExplain> = {
  /* ---------------------------------------------------------------- Materi A */
  A1: {
    idea: "A project pays you while you build it. The day the customer signs it off (go-live), the invoices stop. If nothing is planned for after that, the customer drifts away and the money goes with them. Retention means planning what comes after go-live before you get there.",
    why: "At TechSolutions, 70% of customers buy once and never come back. Keeping even a few more of them is worth a lot, because a customer who stays keeps paying year after year.",
    picture: "The bars show one project's revenue: high during delivery, then zero after go-live. Drag the slider for r, the share of customers who stay each year, and watch CLV (what one customer is worth over time). Moving r from 0.80 to 0.85 already adds about 27%: a small change in who stays makes a big change in value.",
  },
  A2: {
    idea: "Three words that sound alike but mean different things. Satisfaction asks “was I happy with the result?”. Loyalty asks “do I like you and keep coming back?”. Retention is simply “did they buy again?”, which you can see in the records. A customer can be happy and still leave, or unhappy and still stay.",
    why: "Mix them up and you trust the wrong signal. A survey score of 4 out of 5 feels safe, but it does not tell you the customer will order again.",
    picture: "The square has two axes: how much the customer likes you (left to right) and how often they buy again (bottom to top). Click each box for an IT example. Then pick a scenario and watch customer Z move: a price cut or a lost contact can pull liking and buying apart.",
  },
  A3: {
    idea: "Picture a customer tied to you by up to three ropes. Emotional: they trust someone on your side. Economic: leaving would cost them too much effort or money. Contractual: a signed contract keeps them. Most customers hang on a mix, with some ropes thick and others thin.",
    why: "Each rope snaps for a different reason, so each needs a different fix. A longer contract does nothing if what really held the customer was one trusted contact who has just left.",
    picture: "Switch between Customer P and Customer Q and compare how thick each rope is. Then click a trigger (a price cut, a contact leaving, a contract ending) to fray a rope, and see which ropes still hold.",
  },
  A4: {
    idea: "Switching cost is everything a customer loses by changing supplier: time and effort (learning new tools, running a new tender), money (exit fees, lost discounts) and people (a contact they trust). It is highest while you are delivering the project and slowly shrinks after handover.",
    why: "Once switching cost has dropped, a competitor's offer suddenly looks attractive. If you do not keep adding value after go-live, the customer can leave easily, and often quickly.",
    picture: "Turn the two lines on and off. Both rise the same way during delivery. After go-live the red line falls (no new value), while the teal line stays high (value keeps being renewed). The curve is a thinking model, not measured data.",
  },
  A5: {
    idea: "The customer journey is the whole path a customer walks with you, from “we need something” to “do we buy again?”. In an IT project it has seven stages: tender, offer, contract, delivery, go-live, operating, and renewal.",
    why: "Most project firms stop paying attention after go-live, in the “Operate & review” stage, where nobody is really in charge. Yet that is exactly when the customer quietly decides who to invite next time. Buyers spend only about 17% of their buying time talking to suppliers; the rest happens without you.",
    picture: "Click a stage on the map to read what happens there and who on your side owns it. Look for the stage marked as often unassigned: that gap is the point of this card.",
  },
  A6: {
    idea: "An observation is something written in a record that anyone can check, like “invoice 2231 was paid 41 days after issue”. An interpretation is what someone thinks it means, like “they pay late because they are in trouble”. The first is evidence; the second is a guess until a record backs it up.",
    why: "In Task 1 you sort a customer file. Treat guesses as facts and your diagnosis points at the wrong problem. MECE is just a way of sorting into boxes that do not overlap and together cover everything.",
    picture: "Click the rungs of the ladder from bottom to top. Each step up adds a little more of your own meaning, until you end up acting on a belief. Then try the four Alpenwerk sentences further down: tag each as observation or interpretation, and press Reveal to compare.",
  },
  A7: {
    idea: "To keep customers you have to stay in touch, but in Germany you cannot simply send marketing emails, not even to business addresses. Usually you need the person's consent first. There is one exception for existing customers, and it only applies when all four of its conditions are met.",
    why: "A retention campaign that breaks the law creates a bigger problem than the one it solves. Service messages, such as a security update, are fine; advertising is where the rules apply.",
    picture: "Answer the four yes/no questions. Every “yes” takes you one step down; a single “no” means you need consent. Press Start again to try another path. It is a rule of thumb, not legal advice.",
  },
  A8: {
    idea: "A short recipe for Task 1. Read every record in the file, tag each one as observation or interpretation, sort them into the five bins, and finally name the one area where the evidence shows TechSolutions fell short the most.",
    why: "You have 15 minutes. Following the steps in order stops you from jumping to a conclusion before you have read everything.",
  },

  /* ---------------------------------------------------------------- Materi B */
  B1: {
    idea: "When a company buys IT it weighs four things: price (the total cost, not just the headline), trust (can this supplier deliver?), risk (what could go wrong?) and benefit (what do we gain?). People feel a loss about twice as strongly as a gain of the same size, so risk often counts for more than price.",
    why: "That is why the cheapest offer does not always win, and why many deals end with “let's wait” instead of a decision. Waiting feels safer to a buyer who is afraid of making a mistake.",
    picture: "Use the two sliders to set how much Offer X saves and how big its security gap is, and watch the scale tip. Then press “Weight losses ×2”: the same risk now weighs double, and the scale often swings towards the safer Offer Y. The blocks are just units, not euros.",
  },
  B2: {
    idea: "In a company nobody buys alone. A group decides together: the people who will use the system, people who advise, the purchasing department, the boss who signs, and people who control who gets access. In a German mid-sized company that often means the managing director, procurement, the head of IT, the data protection officer and sometimes the works council.",
    why: "Talk to only one person and you miss what the others need. Each role asks a different question: procurement wants the total cost, the head of IT worries about technical risk.",
    picture: "Click each role on the map to see the question it typically asks. In the donut chart, click the slices: only 17% of buying time is spent meeting suppliers. Most of the decision happens while you are not in the room.",
  },
  B3: {
    idea: "Behind every purchase there is a reason, a motive. There are four: Security (avoid a loss or a failure), Efficiency (save effort or money), Innovation (get something you do not have yet) and Status (look good, keep up with peers). You cannot see a motive directly; you guess it from what people say, then check it by asking.",
    why: "Pitch savings to someone who mainly worries about security and you miss them. The job title does not tell you the motive either: a head of IT can care about cost, a director about security.",
    picture: "Click a motive on the compass. You see what people with that motive tend to say, and what kind of proof convinces them. Notice which motive sits opposite: the same person can voice both at different moments.",
  },
  B4: {
    idea: "To compare two offers fairly, add up everything they cost over the whole contract: fees, one-time setup, the customer's own staff time, and running costs. This total is the TCO. An offer that looks cheaper on the price tag can turn out more expensive overall.",
    why: "Buyers often look at only one budget line. Showing the full cost lets them compare properly. A risk can also be put into a number (ALE), but that number is an average, not a bill, so it stays out of the cash total.",
    picture: "Switch cost items on and off and watch the bars for Offer X and Offer Y. Adding onboarding makes them equal; adding internal effort makes Y cheaper. Tick the expected-loss box to see how a risk becomes a yearly figure. Further down, the worked example builds a full three-year total line by line: that is exactly the method Task 2 asks for.",
  },
  B5: {
    idea: "Kessler is one customer, and one customer is a story, not a statistic. To say something like “most customers leave after go-live” you need to look at many customers. That share across the whole group is the base rate.",
    why: "It is tempting to treat one vivid case as proof. In Task 2 some questions simply cannot be answered from one customer's data, and saying so honestly is the right answer, not a failure.",
    picture: "The filled dot on the left is the one customer we actually looked at. The 30 dashed circles on the right are the other customers nobody has checked. You cannot read a rate from one dot.",
  },
  B6: {
    idea: "Once you understand the customer, how do you actually move them? Six steps: look at the facts, guess their motive, ask good questions, recommend something clear, take away their risk, and keep in touch after go-live. SPIN is a way of asking questions that helps the customer see what their problem costs them. JOLT is a way of helping a hesitant buyer finally decide.",
    why: "Pushing harder rarely works. Buyers move when their questions are answered and their fear of a wrong choice gets smaller, for example through a pilot phase or an exit clause.",
    picture: "Click each step of the ladder to read what it means in practice. The last step, Review, is what Task 2 calls “Care after go-live”.",
  },
  B7: {
    idea: "A short recipe for Task 2. Read the three tables, do the calculations, choose an offer and back it with a number, then say honestly what your choice does not fix and what the data cannot tell you.",
    why: "You have 15 minutes. The last step is the one people skip, and it is the one that shows you took B5 on board.",
  },

  /* ---------------------------------------------------------------- Materi C */
  C1: {
    idea: "Some decisions are like a door you can walk back through: if it goes wrong, you undo it cheaply (a two-way door). Others are like a door that locks behind you: hard or expensive to undo (a one-way door).",
    why: "Most decisions are two-way doors, so make them quickly and save the long discussions for the few one-way doors. When something is a one-way door, look for a small, reversible first step before committing in full.",
    picture: "Click each of the three example decisions. It slides to its door, and a short note explains why it belongs there.",
  },
  C2: {
    idea: "When we plan, we tend to look only at our own case and its story (the inside view), and we end up too optimistic. The fix is to look at how similar projects actually turned out (the outside view) and see where our case sits among them. This is reference-class forecasting.",
    why: "In Tasks 1 and 2 you studied one customer, Kessler. In Task 3 you plan for many customers. One good result with Kessler does not mean the whole programme will go that well.",
    picture: "Turn the outside view on and off. The narrow red curve is the optimistic story of one case; the wide teal curve is what similar programmes really achieved. Notice how far out on the optimistic side the Kessler marker sits.",
  },
  C3: {
    idea: "When the budget cannot pay for everything, give each option a score on a few separate questions (how much benefit, how doable, how different) and multiply them. RICE and ICE are well-known versions of this. The score gives you a ranking, but you still have to check whether each option fits the budget.",
    why: "The best-scoring option is often also the most expensive. If it goes over the budget cap it cannot be funded, however good it looks. And if you choose against the ranking, write down why.",
    picture: "First look at the scores alone: Option 1 wins. Then switch on “Show cost”. Option 1 now rises above the cost cap line, so it cannot be funded. The numbers are made up just to show the idea.",
  },
  C4: {
    idea: "Every time you spend money on one thing, you also choose not to spend it on something else. What you give up is the opportunity cost. When the budget is fixed (capital rationing), some good ideas will be left out, and that is fine as long as you say so openly.",
    why: "Task 3 is about the pool of 42 one-off customers, not only Kessler. Getting more of them to stay moves far more money than winning back one account.",
    picture: "On the left, 42 thin outlines: one revenue cliff for each one-off customer. On the right, the single Kessler bar. Compare the size of the whole pool with the one case you studied before.",
  },
  C5: {
    idea: "A plan only works if it is clear who does what. RACI is a simple table for that: Responsible (does the work), Accountable (the one person who answers for the result), Consulted (asked for input) and Informed (kept up to date). Every task gets exactly one Accountable person.",
    why: "If two people are Accountable, in practice nobody is. And a big commitment that is hard to undo is safer if you start with a small pilot, then scale up once the first results are in (real options thinking).",
    picture: "The example is a different company, Alpenwerk, replacing its IT ticketing tool. Click any cell, including the empty ones, to read why it holds that letter. Watch where the A sits: small operational choices stay with the team lead, while a big three-year contract or a vendor crisis goes up to the managing director. Below it, the four test questions and a table of what each Task 3 role typically decides, does, is asked about or is told.",
  },
  C6: {
    idea: "A short recipe for Task 3. Split the budget across the levers without going over the cap, read both scenarios, give every funded lever an owner and a date, and say what you left unfunded and what that costs.",
    why: "You have 20 minutes. A memo that funds everything has skipped the real decision.",
  },
};
