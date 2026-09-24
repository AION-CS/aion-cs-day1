/**
 * The home page's day intro: what the day is about, the story that runs through the three routes, and
 * "What's in it for you" (WIIFM), the personal pay-off of each skill. Only facts the day's own
 * material and cases state (TechSolutions, Kessler, the 42 one-off customers, the €200,000 pilot).
 */

export const DAY_INTRO = {
  about:
    "Today is about the customers who buy one project from you and then quietly disappear. In IT project business the invoices stop at go-live, and unless someone plans what comes next, the next contract goes to a competitor. You learn how customers decide to stay or leave, how a buying group weighs price, trust, risk and benefit, and how to spend a limited budget on keeping more of them.",
  caseLine:
    "One case runs through the whole day: TechSolutions GmbH, an IT project firm where 70% of customers buy only once, and its customer Kessler Präzisionstechnik GmbH, which rated the finished project 4 out of 5 and still put its next contract out to tender eleven months later.",
  story: [
    {
      route: 1 as const,
      verb: "Diagnose",
      question: "Why did a customer who rated the project well put its next contract out to tender?",
      output: "Diagnostic Note",
    },
    {
      route: 2 as const,
      verb: "Calculate",
      question: "Two offers for Kessler's three-year service contract: which one do you recommend to its buying committee, and with which figures?",
      output: "Calculation Note",
    },
    {
      route: 3 as const,
      verb: "Decide",
      question: "With €200,000 for six months, how do you keep more of TechSolutions' 42 one-off customers, and what do you leave uncovered?",
      output: "Decision Memo",
    },
  ],
  wiifm: [
    {
      skill: "Tell evidence from opinion",
      payoff: "In any customer file, meeting or handover you can separate what a record shows from what someone assumes. You stop acting on guesses, and your conclusions hold up when a manager asks “how do you know?”.",
      route: 1 as const,
    },
    {
      skill: "See where customers slip away",
      payoff: "You learn to spot the stretch after a project ends where nobody owns the customer, and what keeps a customer from leaving. That is where your next order, or your next lost account, is decided.",
      route: 1 as const,
    },
    {
      skill: "Compare offers the way buyers do",
      payoff: "You can add up what an offer really costs over the whole contract, put a risk into euros without mixing it into the cash, and explain why the cheapest price does not always win.",
      route: 2 as const,
    },
    {
      skill: "Talk to the whole buying group",
      payoff: "You learn what procurement, the head of IT and the managing director each care about, and how to ask questions that reveal it. Fewer surprises when a deal stalls or ends in “let's wait”.",
      route: 2 as const,
    },
    {
      skill: "Decide with a budget that cannot fund everything",
      payoff: "You practise choosing, saying openly what you leave out, and naming who owns each step. That is how decisions get approved and actually carried out, in any role.",
      route: 3 as const,
    },
    {
      skill: "Leave with three documents you can reuse",
      payoff: "A Diagnostic Note, a Calculation Note and a Decision Memo, each built on a real-looking case. Use them as templates the next time you have to diagnose a customer, compare offers or ask for budget.",
      route: 3 as const,
    },
  ],
} as const;
