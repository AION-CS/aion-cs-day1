/**
 * The reference list, exactly as supplied for Day 1. Cards cite by key; each
 * `References` accordion shows the union of what its own cards cite.
 * `chip` is the short "Author Year" label a Source chip prints.
 */
export type RefKey =
  | "anderson2006"
  | "argyris1990"
  | "senge1990"
  | "bauer1960"
  | "burnham2003"
  | "carroll1992"
  | "dick1994"
  | "dixon2022"
  | "gartner2017"
  | "gupta2003"
  | "gustafsson2005"
  | "ibm2025"
  | "jones1995"
  | "kahneman1979"
  | "lemon2016"
  | "mayer1995"
  | "minto2009"
  | "morgan1994"
  | "oliver1999"
  | "rackham1988"
  | "reichheld2003"
  | "reichheld1990"
  | "samuelson1988"
  | "tversky1971"
  | "webster1972"
  | "nis2"
  | "bsi2025"
  | "gdpr"
  | "uwg7"
  | "betrvg87"
  | "bezos2015"
  | "kahneman1993"
  | "intercom2016"
  | "ellis2017"
  | "pmbok"
  | "brealey"
  | "amram1999";

export type Reference = { key: RefKey; chip: string; full: string };

export const REFERENCES = {
  anderson2006: {
    key: "anderson2006",
    chip: "Anderson, Narus & van Rossum 2006",
    full: "Anderson, J. C., Narus, J. A., & van Rossum, W. (2006). Customer value propositions in business markets. Harvard Business Review, 84(3), 90–99.",
  },
  argyris1990: {
    key: "argyris1990",
    chip: "Argyris 1990",
    full: "Argyris, C. (1990). Overcoming Organizational Defenses. Allyn & Bacon.",
  },
  senge1990: {
    key: "senge1990",
    chip: "Senge 1990",
    full: "Senge, P. (1990). The Fifth Discipline. Doubleday.",
  },
  bauer1960: {
    key: "bauer1960",
    chip: "Bauer 1960",
    full: "Bauer, R. A. (1960). Consumer behavior as risk taking. In R. S. Hancock (Ed.), Dynamic Marketing for a Changing World (pp. 389–398). American Marketing Association.",
  },
  burnham2003: {
    key: "burnham2003",
    chip: "Burnham, Frels & Mahajan 2003",
    full: "Burnham, T. A., Frels, J. K., & Mahajan, V. (2003). Consumer switching costs: A typology, antecedents, and consequences. Journal of the Academy of Marketing Science, 31(2), 109–126.",
  },
  carroll1992: {
    key: "carroll1992",
    chip: "Carroll & Reichheld 1992",
    full: "Carroll, P., & Reichheld, F. F. (1992). The fallacy of customer retention. Journal of Retail Banking.",
  },
  dick1994: {
    key: "dick1994",
    chip: "Dick & Basu 1994",
    full: "Dick, A. S., & Basu, K. (1994). Customer loyalty: Toward an integrated conceptual framework. Journal of the Academy of Marketing Science, 22(2), 99–113.",
  },
  dixon2022: {
    key: "dixon2022",
    chip: "Dixon & McKenna 2022",
    full: "Dixon, M., & McKenna, T. (2022). The JOLT Effect. Portfolio.",
  },
  gartner2017: {
    key: "gartner2017",
    chip: "Gartner 2017",
    full: "Gartner (2017). Digital B2B Buyer Survey (n = 750), as reported in Gartner buyer-enablement materials.",
  },
  gupta2003: {
    key: "gupta2003",
    chip: "Gupta & Lehmann 2003",
    full: "Gupta, S., & Lehmann, D. R. (2003). Customers as assets. Journal of Interactive Marketing, 17(1), 9–24.",
  },
  gustafsson2005: {
    key: "gustafsson2005",
    chip: "Gustafsson, Johnson & Roos 2005",
    full: "Gustafsson, A., Johnson, M. D., & Roos, I. (2005). The effects of customer satisfaction, relationship commitment dimensions, and triggers on customer retention. Journal of Marketing, 69(4), 210–218.",
  },
  ibm2025: {
    key: "ibm2025",
    chip: "IBM / Ponemon 2025",
    full: "IBM / Ponemon Institute (2025). Cost of a Data Breach Report 2025.",
  },
  jones1995: {
    key: "jones1995",
    chip: "Jones & Sasser 1995",
    full: "Jones, T. O., & Sasser, W. E. (1995). Why satisfied customers defect. Harvard Business Review, 73(6), 88–99.",
  },
  kahneman1979: {
    key: "kahneman1979",
    chip: "Kahneman & Tversky 1979",
    full: "Kahneman, D., & Tversky, A. (1979). Prospect theory: An analysis of decision under risk. Econometrica, 47(2), 263–291.",
  },
  lemon2016: {
    key: "lemon2016",
    chip: "Lemon & Verhoef 2016",
    full: "Lemon, K. N., & Verhoef, P. C. (2016). Understanding customer experience throughout the customer journey. Journal of Marketing, 80(6), 69–96.",
  },
  mayer1995: {
    key: "mayer1995",
    chip: "Mayer, Davis & Schoorman 1995",
    full: "Mayer, R. C., Davis, J. H., & Schoorman, F. D. (1995). An integrative model of organizational trust. Academy of Management Review, 20(3), 709–734.",
  },
  minto2009: {
    key: "minto2009",
    chip: "Minto 2009",
    full: "Minto, B. (2009). The Pyramid Principle (3rd ed.). FT Prentice Hall.",
  },
  morgan1994: {
    key: "morgan1994",
    chip: "Morgan & Hunt 1994",
    full: "Morgan, R. M., & Hunt, S. D. (1994). The commitment-trust theory of relationship marketing. Journal of Marketing, 58(3), 20–38.",
  },
  oliver1999: {
    key: "oliver1999",
    chip: "Oliver 1999",
    full: "Oliver, R. L. (1999). Whence consumer loyalty? Journal of Marketing, 63(Special Issue), 33–44.",
  },
  rackham1988: {
    key: "rackham1988",
    chip: "Rackham 1988",
    full: "Rackham, N. (1988). SPIN Selling. McGraw-Hill.",
  },
  reichheld2003: {
    key: "reichheld2003",
    chip: "Reichheld 2003",
    full: "Reichheld, F. F. (2003). The one number you need to grow. Harvard Business Review, 81(12), 46–54.",
  },
  reichheld1990: {
    key: "reichheld1990",
    chip: "Reichheld & Sasser 1990",
    full: "Reichheld, F. F., & Sasser, W. E. (1990). Zero defections: Quality comes to services. Harvard Business Review, 68(5), 105–111.",
  },
  samuelson1988: {
    key: "samuelson1988",
    chip: "Samuelson & Zeckhauser 1988",
    full: "Samuelson, W., & Zeckhauser, R. (1988). Status quo bias in decision making. Journal of Risk and Uncertainty, 1(1), 7–59.",
  },
  tversky1971: {
    key: "tversky1971",
    chip: "Tversky & Kahneman 1971",
    full: "Tversky, A., & Kahneman, D. (1971). Belief in the law of small numbers. Psychological Bulletin, 76(2), 105–110.",
  },
  webster1972: {
    key: "webster1972",
    chip: "Webster & Wind 1972",
    full: "Webster, F. E., & Wind, Y. (1972). A general model for understanding organizational buying behavior. Journal of Marketing, 36(2), 12–19.",
  },
  nis2: {
    key: "nis2",
    chip: "NIS2 Directive",
    full: "Directive (EU) 2022/2555 (NIS2), Art. 20 and Art. 21(2)(d).",
  },
  bsi2025: {
    key: "bsi2025",
    chip: "BSI 2025",
    full: "BSI press release, 5 Dec 2025 (NIS2 implementation act in force 6 Dec 2025).",
  },
  gdpr: {
    key: "gdpr",
    chip: "GDPR",
    full: "Regulation (EU) 2016/679 (GDPR), Art. 5(1)(c),(e), 6(1)(f), 21(2)–(3), 28, Recital 47.",
  },
  uwg7: {
    key: "uwg7",
    chip: "§ 7 UWG",
    full: "§ 7 UWG (Gesetz gegen den unlauteren Wettbewerb).",
  },
  betrvg87: {
    key: "betrvg87",
    chip: "§ 87 BetrVG",
    full: "§ 87(1) no. 6 BetrVG (Betriebsverfassungsgesetz).",
  },
} as Record<RefKey, Reference>;

Object.assign(REFERENCES, {
  bezos2015: {
    key: "bezos2015",
    chip: "Bezos 2015",
    full: "Bezos, J. (2015). 2015 Letter to Shareholders. Amazon.com. (Type 1 / Type 2, “one-way door / two-way door” decisions.)",
  },
  kahneman1993: {
    key: "kahneman1993",
    chip: "Kahneman & Lovallo 1993",
    full: "Kahneman, D., & Lovallo, D. (1993). Timid choices and bold forecasts: A cognitive perspective on risk taking. Management Science, 39(1), 17–31.",
  },
  intercom2016: {
    key: "intercom2016",
    chip: "Intercom 2016 (RICE)",
    full: "Intercom (2016). The RICE scoring model for prioritization (Reach × Impact × Confidence ÷ Effort), as documented in Intercom's product-management practice.",
  },
  ellis2017: {
    key: "ellis2017",
    chip: "Ellis & Brown 2017",
    full: "Ellis, S., & Brown, M. (2017). Hacking Growth. Crown Business. (ICE: Impact × Confidence × Ease.)",
  },
  pmbok: {
    key: "pmbok",
    chip: "PMI · PMBOK Guide",
    full: "Project Management Institute. A Guide to the Project Management Body of Knowledge (PMBOK Guide). (RACI matrix.)",
  },
  brealey: {
    key: "brealey",
    chip: "Brealey, Myers & Allen",
    full: "Brealey, R. A., Myers, S. C., & Allen, F. Principles of Corporate Finance. McGraw-Hill. (Opportunity cost, capital rationing.)",
  },
  amram1999: {
    key: "amram1999",
    chip: "Amram & Kulatilaka 1999",
    full: "Amram, M., & Kulatilaka, N. (1999). Real Options: Managing Strategic Investment in an Uncertain World. Harvard Business School Press.",
  },
} satisfies Partial<Record<RefKey, Reference>>);

/** Print order of the accordion: the order of the supplied list. */
export const REFERENCE_ORDER: RefKey[] = Object.keys(REFERENCES) as RefKey[];
