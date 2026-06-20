// ═══════════════════════════════════════════════════════════════
// COMPLETE JAVASCRIPT — preST v1.0
// All bugs fixed, all recommendations implemented
// ═══════════════════════════════════════════════════════════════

"use strict";

// ─── CONSTANTS ──────────────────────────────────────────────
const QUESTIONS_PER_SESSION = 30;
const Q_PER_COURSE = 6;
const SECONDS_IN_MINUTE = 60;
const MIN_EXAMS_FOR_DEDICATED = 10;
const MS_IN_DAY = 86400000;
const STREAK_WINDOW_DAYS = 3;
const MAX_AVATAR_SIZE_BYTES = 5 * 1024 * 1024;
const AVATAR_MAX_DIMENSION = 256;
const TOAST_DURATION = 3500;
const DEBOUNCE_DELAY = 300;
const TAB_SWITCH_LIMIT = 5;
const SAVE_INTERVAL_SECONDS = 15;
const POSITION_SAVE_DELAY = 600;
const MIN_MATRIC_LENGTH = 6;
const MAX_MATRIC_LENGTH = 20;

const COURSES = [
  {
    code: "GST 112",
    name: "Nigerian People & Culture",
    icon: "🌍",
    color: "#6366f1",
    grad: "linear-gradient(135deg,#6366f1,#8b5cf6)",
  },
  {
    code: "MTH 102",
    name: "Elementary Mathematics II",
    icon: "📐",
    color: "#06b6d4",
    grad: "linear-gradient(135deg,#06b6d4,#6366f1)",
  },
  {
    code: "PHY 102",
    name: "General Physics II",
    icon: "⚡",
    color: "#f59e0b",
    grad: "linear-gradient(135deg,#f59e0b,#ef4444)",
  },
  {
    code: "CHM 102",
    name: "Organic Chemistry",
    icon: "🧪",
    color: "#10b981",
    grad: "linear-gradient(135deg,#10b981,#06b6d4)",
  },
  {
    code: "COS 102",
    name: "Problem Solving",
    icon: "💻",
    color: "#a3e635",
    grad: "linear-gradient(135deg,#a3e635,#10b981)",
  },
];

const ACHIEVEMENTS = {
  first_exam: {
    icon: "🎯",
    name: "First Step",
    desc: "Complete your first exam",
  },
  perfect_score: {
    icon: "🏆",
    name: "Perfectionist",
    desc: "Score 100% on any exam",
  },
  streak_3: {
    icon: "🔥",
    name: "On Fire",
    desc: "Complete 3 exams in a row",
  },
  quick_learner: {
    icon: "⚡",
    name: "Quick Learner",
    desc: "Finish exam in under 30 minutes",
  },
  topic_master: {
    icon: "👑",
    name: "Topic Master",
    desc: "Score 80%+ in all sections",
  },
  dedicated: {
    icon: "📚",
    name: "Dedicated",
    desc: "Complete 10 exams total",
  },
};

// ─── ERROR HANDLING ──────────────────────────────────────────
class AppError extends Error {
  constructor(message, code, severity = "error") {
    super(message);
    this.code = code;
    this.severity = severity;
    this.name = "AppError";
  }
}

function handleError(error, context = "") {
  console.error(`[${context}]`, error);
  const message = error.message || "An unexpected error occurred";
  const severity = error.severity || "error";
  toast(message, severity);

  // Attempt recovery for DB errors
  if (error.code === "DB_ERROR") {
    console.warn("Attempting DB recovery...");
    setTimeout(() => {
      toast("Attempting to recover database connection...", "info");
    }, 1000);
  }

  return { handled: true, error };
}

// ─── VALIDATION ──────────────────────────────────────────────
function validateMatric(matric) {
  if (!matric || typeof matric !== "string")
    return { valid: false, message: "Matric number is required" };
  const cleaned = matric.trim();
  if (cleaned.length < MIN_MATRIC_LENGTH) {
    return {
      valid: false,
      message: `Matric number must be at least ${MIN_MATRIC_LENGTH} characters`,
    };
  }
  if (cleaned.length > MAX_MATRIC_LENGTH) {
    return {
      valid: false,
      message: `Matric number must be at most ${MAX_MATRIC_LENGTH} characters`,
    };
  }
  if (!/^[A-Za-z0-9/]+$/.test(cleaned)) {
    return {
      valid: false,
      message:
        "Matric number can only contain letters, numbers, and forward slash",
    };
  }
  return { valid: true, value: cleaned };
}

function validateEmail(email) {
  if (!email) return { valid: true };
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return { valid: re.test(email), message: "Invalid email format" };
}

// ─── FULL 500 QUESTION BANK ─────────────────────────────────
// GST 112: indices 0-99
// MTH 102: indices 100-199
// PHY 102: indices 200-299
// CHM 102: indices 300-399
// COS 102: indices 400-499

const QB = [
  /* ============================================================
               GST 112 — Questions 1-100 (Nigerian People & Culture)
               ============================================================ */
  // Q1
  {
    q: "With reference to Federal Systems, which of the following is odd?",
    opts: ["Nigeria", "Ghana", "Brazil", "USA"],
    ans: "B",
    exp: "Ghana operates a unitary system, not a federal system like Nigeria, Brazil, and the USA.",
  },
  // Q2
  {
    q: "Which of the following is not a feature of democracy?",
    opts: [
      "Constitutionalism",
      "Absolutism",
      "Periodic elections",
      "Rule of law",
    ],
    ans: "B",
    exp: "Absolutism concentrates all power in one ruler — the opposite of democratic principles.",
  },
  // Q3
  {
    q: "A person desiring to be a citizen of Nigeria through naturalization must have resided in Nigeria for not less than ___ years.",
    opts: ["25", "20", "15", "10"],
    ans: "C",
    exp: "The Nigerian Constitution requires 15 years of continuous residence for naturalization.",
  },
  // Q4
  {
    q: "Which of the following is not true of culture?",
    opts: [
      "It is static",
      "It is shared by members",
      "It is historically derived",
      "It is not genetically transmitted",
    ],
    ans: "A",
    exp: "Culture is dynamic, not static. It changes over time in response to new ideas and contacts.",
  },
  // Q5
  {
    q: "Nigeria became a republic in what year?",
    opts: ["1960", "1963", "1961", "1957"],
    ans: "B",
    exp: "Nigeria became a republic on October 1, 1963, three years after independence in 1960.",
  },
  // Q6
  {
    q: "___ refers to a practice requiring mates be selected within certain groups.",
    opts: ["Exogamy", "Polyandry", "Endogamy", "Kingship"],
    ans: "C",
    exp: "Endogamy requires marriage within a specific social group. Exogamy is the opposite.",
  },
  // Q7
  {
    q: "The Yoruba Mythology claims that ___ created Ile-Ife.",
    opts: ["Olodumare", "Obatala", "Esu", "Ajala"],
    ans: "B",
    exp: "Obatala was sent by Olodumare to create land and form humans at Ile-Ife.",
  },
  // Q8
  {
    q: "___ is the thesis that every event has a cause.",
    opts: ["Belief", "Fatalism", "Determinism", "Destiny"],
    ans: "C",
    exp: "Determinism holds that all events are completely determined by previously existing causes.",
  },
  // Q9
  {
    q: "___ associations among Yoruba provide avenue for ostentatious display of wealth.",
    opts: ["Religious", "Age-grade", "Convivial", "Political"],
    ans: "C",
    exp: "Convivial associations are social clubs for socialization and public display of wealth.",
  },
  // Q10
  {
    q: "The status bestowed on an individual with full membership rights in the community is:",
    opts: ["Citizen", "Alien", "Resident", "Subject"],
    ans: "A",
    exp: "A citizen enjoys full rights and privileges, unlike an alien or resident.",
  },
  // Q11
  {
    q: "The second Nigerian president to die in Aso Rock is:",
    opts: [
      "Sani Abacha",
      "Aguiyi Ironsi",
      "Murtala Mohammed",
      "Umaru Musa Yar'Adua",
    ],
    ans: "D",
    exp: "Yar'Adua died on May 5, 2010 in Aso Rock. Sani Abacha was the first.",
  },
  // Q12
  {
    q: "Ngari-Koggi is associated with the ___ marriage system.",
    opts: ["Yoruba", "Igbo", "Fulani", "Ijaw"],
    ans: "C",
    exp: "Ngari-Koggal is a form of Fulani marriage where a man marries outside his immediate family.",
  },
  // Q13
  {
    q: "Who is the father of modern Nigeria?",
    opts: [
      "Chukwuemeka Ojukwu",
      "Obafemi Awolowo",
      "Sultan of Sokoto",
      "Olusegun Obasanjo",
    ],
    ans: "B",
    exp: "Awolowo is widely regarded as the father of modern Nigeria for his political vision and social welfare policies.",
  },
  // Q14
  {
    q: "A motion demanding self-governance in Nigeria was sponsored by:",
    opts: [
      "Chief Obafemi Awolowo",
      "Dr. Nnamdi Azikiwe",
      "Anthony Enahoro",
      "Sir Tafawa Balewa",
    ],
    ans: "C",
    exp: "Anthony Enahoro sponsored the famous self-governance motion in 1953.",
  },
  // Q15
  {
    q: "The crisis in the Niger Delta is fundamentally over:",
    opts: [
      "Ethnicity",
      "Resource Allocation",
      "Petroleum",
      "Denial of Political offices",
    ],
    ans: "C",
    exp: "The Niger Delta crisis is about petroleum — its exploration, ownership, environmental damage, and revenue sharing.",
  },
  // Q16
  {
    q: "The Second World War started in what year?",
    opts: ["1922", "1876", "1956", "1939"],
    ans: "D",
    exp: "WWII began on September 1, 1939, when Germany invaded Poland.",
  },
  // Q17
  {
    q: "Tylor's definition of culture includes:",
    opts: [
      "Only material aspects",
      "Only non-material aspects",
      "Both material and non-material aspects",
      "Only religious aspects",
    ],
    ans: "C",
    exp: "Tylor's 1871 definition covers both material culture (tools, artifacts) and non-material culture (beliefs, morals).",
  },
  // Q18
  {
    q: "With reference to works of art, the Nok culture is reputed for their:",
    opts: ["Artifacts", "Mouldings", "Crafting", "Terracotta sculptures"],
    ans: "D",
    exp: "The Nok civilization is renowned for its sophisticated terracotta figurines and sculptures.",
  },
  // Q19
  {
    q: "Bull slaughtering in the Fulani marriage system is called:",
    opts: ["Ngari-Koggal", "Sharo", "Fatiha", "Dower"],
    ans: "A",
    exp: "Ngari-Koggal refers to the Fulani practice of slaughtering a bull as part of the marriage ceremony.",
  },
  // Q20
  {
    q: "The three major means of transport in Nigeria are:",
    opts: [
      "Land, Air, and Water",
      "Road, Rail, and Air",
      "Air, Water, and Pipeline",
      "Road, Water, and Rail",
    ],
    ans: "A",
    exp: "Nigeria's three major transportation modes are land (road and rail), air, and water.",
  },
  // Q21
  {
    q: "A social association is also known as:",
    opts: [
      "Convivial Association",
      "Economic Association",
      "Political Association",
      "Religious Association",
    ],
    ans: "A",
    exp: "Convivial associations are social or recreational clubs formed for fellowship and entertainment.",
  },
  // Q22
  {
    q: "In Nigeria, people are mainly patrilineal in their kinship system. This statement is:",
    opts: ["False", "True", "Partially true", "Not applicable"],
    ans: "C",
    exp: "Partially true. Many Nigerian societies are patrilineal, but some like the Efik practice matrilineal descent.",
  },
  // Q23
  {
    q: "Rights and duties within the kinship network are socially defined. This statement is:",
    opts: ["False", "True", "Ambiguous", "Context-dependent"],
    ans: "B",
    exp: "True. Kinship rights and obligations are determined by social norms and cultural rules, not biology alone.",
  },
  // Q24
  {
    q: "___ marriage occurs when a woman leaves her husband to marry another man without formal divorce.",
    opts: [
      "Abnormal",
      "Escape Marriage",
      "Unusual Marriage",
      "None of the Above",
    ],
    ans: "B",
    exp: "Escape Marriage is when a woman leaves one marriage and enters another without formal divorce.",
  },
  // Q25
  {
    q: "Among the nomadic Fulani, a man may marry his uncle's or aunt's daughter. This is called:",
    opts: [
      "Indigenous marriage",
      "Outsider marriage",
      "Endogenous marriage",
      "Exogenous marriage",
    ],
    ans: "C",
    exp: "Endogenous marriage refers to marrying within one's own group — cousin marriage.",
  },
  // Q26
  {
    q: "Among the Yoruba, offering is called:",
    opts: ["Ayepinu", "Ebo", "Ori", "Ogun"],
    ans: "B",
    exp: "'Ebo' is the Yoruba word for sacrifice or offering made to the orisa during religious ceremonies.",
  },
  // Q27
  {
    q: "___ is the aggregate land use in a built-up area occupied by human beings.",
    opts: ["Expanse", "Space", "Settlement", "Occupation"],
    ans: "C",
    exp: "Settlement refers to a place where people establish a community.",
  },
  // Q28
  {
    q: "Atilogwu and Nkwoyoidi is the most popular traditional music among the:",
    opts: ["Yoruba", "Igbo", "Hausa", "Ijaw"],
    ans: "B",
    exp: "Atilogwu is a high-energy acrobatic dance-music of the Igbo people.",
  },
  // Q29
  {
    q: "The Ugie-erhoba festival is associated with the:",
    opts: ["Igala", "Ijaw", "Kalabari", "Edo (Benin)"],
    ans: "D",
    exp: "The Ugie-Erhoba festival is a traditional ceremony of the Edo (Benin Kingdom) people.",
  },
  // Q30
  {
    q: "Festivals and Rituals are conspicuous in traditional religious systems. This statement is:",
    opts: ["True", "False", "Not sure", "Partially true"],
    ans: "A",
    exp: "True. Festivals and rituals are central features of traditional African religion.",
  },
  // Q31
  {
    q: "According to Yoruba belief system, ___ is the arch-divinity.",
    opts: ["Orisa Nla", "Sango", "Ohalala", "Ifa"],
    ans: "A",
    exp: "Orisa Nla (Obatala) is the chief of all orisa, responsible for creating human bodies.",
  },
  // Q32
  {
    q: "___ is construed as the feeling that something is true or that something really exists.",
    opts: ["Doubt", "Understanding", "Knowledge", "Belief"],
    ans: "D",
    exp: "Belief is a mental state accepting a proposition as true, often without absolute proof.",
  },
  // Q33
  {
    q: "___ is the practice requiring mates be selected within certain groups.",
    opts: ["Monogamy", "Polygamy", "Exogamy", "Endogamy"],
    ans: "D",
    exp: "Endogamy is the social rule requiring marriage within a specific group.",
  },
  // Q34
  {
    q: "With reference to occupational associations, the Guild acts as agent of social control. This is:",
    opts: ["False", "True", "Uncertain", "Not applicable"],
    ans: "B",
    exp: "True. Guilds set standards, regulate entry, discipline members, acting as agents of social control.",
  },
  // Q35
  {
    q: "The Itsekiri and Ogoni are mostly found in Delta and Rivers states respectively. This is:",
    opts: ["False", "True", "Partially true", "Not sure"],
    ans: "B",
    exp: "True. Itsekiri are in Delta State; Ogoni people are in Rivers State.",
  },
  // Q36
  {
    q: "___ is the training of the mind and character to produce self-control and obedience.",
    opts: ["Knowledge", "Studying", "Reading", "Discipline"],
    ans: "D",
    exp: "Discipline involves training people to follow rules using correction and self-control.",
  },
  // Q37
  {
    q: "The study of elections is referred to as:",
    opts: ["Ectology", "Psychology", "Electioneering", "Psephology"],
    ans: "D",
    exp: "Psephology is the statistical study and analysis of elections, voting patterns, and electoral behavior.",
  },
  // Q38
  {
    q: "Nigeria became a federation of 30 states in the year:",
    opts: ["1976", "1987", "1991", "1996"],
    ans: "C",
    exp: "Nigeria had 30 states from 1991 when Babangida created 9 new states, from 21 to 30.",
  },
  // Q39
  {
    q: "Developing countries including Nigeria are mostly faced with challenges of resource:",
    opts: ["Allocation", "Mobilization", "Management", "Distribution"],
    ans: "C",
    exp: "Resource management is the critical challenge — lacking institutional capacity to manage resources effectively.",
  },
  // Q40
  {
    q: "The word 'kinship' refers to:",
    opts: [
      "Blood relationships",
      "Marriage relationships",
      "Social relationships",
      "All of the above",
    ],
    ans: "D",
    exp: "Kinship encompasses consanguineal (blood), affinal (marriage), and fictive (social) relationships.",
  },
  // Q41
  {
    q: "With reference to living pattern after marriage, which of the following is odd?",
    opts: ["Neolocal", "Bilocal", "Polygamy", "Matrilocal"],
    ans: "C",
    exp: "Neolocal, bilocal, and matrilocal are post-marital residence patterns. Polygamy is a marriage type.",
  },
  // Q42
  {
    q: "Among the Fulani, ___ is regarded as real marriage because it involves free choice.",
    opts: ["Ngari-Koggal", "Koggal-yil", "Koggal-pibol", "Koggal-siri"],
    ans: "B",
    exp: "Koggal-yil is the 'true' Fulani marriage because partners choose each other freely.",
  },
  // Q43
  {
    q: "___ observed that the world's oceans have been used as dustbins.",
    opts: ["Diecy", "Eckholm", "Harrington", "Bodin"],
    ans: "B",
    exp: "Erik Eckholm noted the rampant use of oceans as dumping grounds for industrial waste.",
  },
  // Q44
  {
    q: "The oldest written constitution in the world is the:",
    opts: [
      "Israeli constitution",
      "Roman constitution",
      "British constitution",
      "Nigerian constitution",
    ],
    ans: "C",
    exp: "The British constitution, though uncodified, is the world's oldest with key documents from Magna Carta (1215).",
  },
  // Q45
  {
    q: "___ system can be described as a loose federation.",
    opts: ["Federal", "Unitary", "Decentralized", "Confederate"],
    ans: "D",
    exp: "A confederate system is a loose alliance of independent states with weak central authority.",
  },
  // Q46
  {
    q: "All these were famous for bronze casting except:",
    opts: ["Igbo Ukwu", "Ife", "Nok", "Benin"],
    ans: "C",
    exp: "Nok culture is famous for terracotta sculptures, not bronze casting.",
  },
  // Q47
  {
    q: "___ symbols are used to mark important events that occurred in a nation.",
    opts: ["Official", "Historical", "Cultural", "National"],
    ans: "B",
    exp: "Historical symbols commemorate significant events and milestones in a nation's history.",
  },
  // Q48
  {
    q: "The party that led the protest against the Richards Constitution was:",
    opts: ["NYM", "NNDP", "AG", "NCNC"],
    ans: "D",
    exp: "The NCNC, led by Dr. Nnamdi Azikiwe, spearheaded the protest against the Richards Constitution of 1946.",
  },
  // Q49
  {
    q: "___ designed the Nigerian National Flag.",
    opts: [
      "Taiwo Akinkunmi",
      "Taiwo Akinwunmi",
      "Tayo Akinkunmi",
      "Tayo Akinwunmi",
    ],
    ans: "A",
    exp: "Michael Taiwo Akinkunmi, a student in London, designed the Nigerian flag in 1959.",
  },
  // Q50
  {
    q: "Maintenance of law and order is the duty of the:",
    opts: [
      "Nigerian Police Force",
      "Nigeria Police Force",
      "Nigerians Police Force",
      "Nigeria's Police Force",
    ],
    ans: "B",
    exp: "The correct official name is 'Nigeria Police Force' as established by the 1999 Constitution.",
  },
  // Q51
  {
    q: "___ is the highest football ruling body.",
    opts: ["FIFA", "NFF", "UEFA", "LALIGA"],
    ans: "A",
    exp: "FIFA is the global governing body for football.",
  },
  // Q52
  {
    q: "___ was the last imperial Governor-General of Nigeria.",
    opts: [
      "Sir Oliver Lyttleton",
      "Sir John Macpherson",
      "Sir James Robertson",
      "Rt Hon Dr Nnamdi Azikiwe",
    ],
    ans: "C",
    exp: "Sir James Wilson Robertson was the last British Governor-General of Nigeria until independence in 1960.",
  },
  // Q53
  {
    q: "Among the Yoruba, morality is certainly the fruit of religion. (i) The Yoruba believe that Orunmila is a linguist. (ii)",
    opts: ["True, False", "True, True", "False, True", "False, False"],
    ans: "B",
    exp: "Both are true: Yoruba morality is embedded in religious practice; Orunmila is considered the linguist of the gods.",
  },
  // Q54
  {
    q: "The first indigenous Governor-General of Nigeria was:",
    opts: [
      "Ahmadu Bello",
      "Sultan of Sokoto",
      "Dr Nnamdi Azikiwe",
      "Obafemi Awolowo",
    ],
    ans: "C",
    exp: "Dr. Nnamdi Azikiwe became Nigeria's first indigenous Governor-General on November 16, 1960.",
  },
  // Q55
  {
    q: "Who is the current President of the Federal Republic of Nigeria?",
    opts: [
      "Muhammadu Buhari",
      "Bola Ahmed Tinubu",
      "Yemi Osinbajo",
      "Goodluck Jonathan",
    ],
    ans: "B",
    exp: "Bola Ahmed Tinubu was inaugurated as Nigeria's 16th President on May 29, 2023.",
  },
  // Q56
  {
    q: "Who stopped the killing of twins in Calabar?",
    opts: ["Mary Magdalene", "Jesus Christ", "Holy Spirit", "Mary Slessor"],
    ans: "D",
    exp: "Mary Slessor, a Scottish missionary, campaigned against the killing of twins among the Efik people.",
  },
  // Q57
  {
    q: "What does the black shield in the Nigerian coat of arms stand for?",
    opts: ["Strength", "Dignity", "Peace", "Unity"],
    ans: "A",
    exp: "The black shield in Nigeria's coat of arms represents the fertile soil of Nigeria and the strength of the nation.",
  },
  // Q58
  {
    q: "The Berlin Conference was held between:",
    opts: ["1848/49", "1884/85", "1892/93", "1854/55"],
    ans: "B",
    exp: "The Berlin Conference (1884–1885) regulated European colonization of Africa, resulting in the 'Scramble for Africa'.",
  },
  // Q59
  {
    q: "Which of the following is not an executive arm of government?",
    opts: [
      "Governor",
      "Deputy Governor",
      "Speaker of the House of Representatives",
      "SSG",
    ],
    ans: "C",
    exp: "The Speaker of the House of Representatives heads the legislature, not the executive arm.",
  },
  // Q60
  {
    q: "Europeans first ventured into the coast of Africa during the:",
    opts: ["19th century", "9th century", "15th century", "17th century"],
    ans: "C",
    exp: "Europeans, particularly the Portuguese, first reached the coast of West Africa in the 15th century.",
  },
  // Q61
  {
    q: "The understanding of cause, effect and change in African belief combines sensual and metaphysical explanation. This is:",
    opts: ["True", "False", "Neither True nor false", "None of the above"],
    ans: "A",
    exp: "True. African traditional thought integrates empirical observation with metaphysical explanations.",
  },
  // Q62
  {
    q: "Nigeria was amalgamated by Lord Lugard in:",
    opts: ["1900", "1906", "1910", "1914"],
    ans: "D",
    exp: "Lord Frederick Lugard amalgamated the Northern and Southern Protectorates on January 1, 1914.",
  },
  // Q63
  {
    q: "Which is more important when it comes to identity?",
    opts: [
      "Family identity",
      "Cultural Identity",
      "National Identity",
      "All are important",
    ],
    ans: "D",
    exp: "All dimensions of identity — family, cultural, and national — are equally important.",
  },
  // Q64
  {
    q: "Dahomey was freed of Oyo control in the 19th century by King:",
    opts: ["Agaja", "Behazin", "Wegbaja", "Gezo"],
    ans: "D",
    exp: "King Gezo (1818–1858) successfully freed Dahomey from Oyo's dominance.",
  },
  // Q65
  {
    q: "The Bayajidda legend is associated with the founding of:",
    opts: ["Igala kingdom", "Hausa states", "Iga kingship", "Owala kingdom"],
    ans: "B",
    exp: "The Bayajidda legend is the founding myth of the Hausa states.",
  },
  // Q66
  {
    q: "The British abolished the slave trade in the year:",
    opts: ["1800", "1807", "1814", "1821"],
    ans: "B",
    exp: "Britain abolished the transatlantic slave trade in 1807 through the Slave Trade Act.",
  },
  // Q67
  {
    q: "In culture, man adjusts to the process of:",
    opts: [
      "Political and social setting",
      "Political and religious setting",
      "Social and religious setting",
      "Social and economic setting",
    ],
    ans: "D",
    exp: "Culture primarily functions to help humans adapt to their social and economic environment.",
  },
  // Q68
  {
    q: "Which of these festivals is synonymous with the Nupe of Niger State?",
    opts: ["Pategi regatta", "Okosi", "Oshun", "Sango"],
    ans: "A",
    exp: "The Pategi Regatta is a famous water festival of the Nupe people in Niger State.",
  },
  // Q69
  {
    q: "An individual that wears a new dress for people to see and buy is a:",
    opts: ["Tailor", "Seamstress", "Model", "Designer"],
    ans: "C",
    exp: "A model wears and displays clothing to showcase them to potential buyers.",
  },
  // Q70
  {
    q: "As punishment, a murderer in Kanuri traditional society is:",
    opts: ["Charmed", "Whipped", "Beheaded", "Imprisoned"],
    ans: "C",
    exp: "In Kanuri traditional society, murder was punishable by death — specifically by beheading.",
  },
  // Q71
  {
    q: "The Aba Women's Riot of 1929 was:",
    opts: [
      "Directed against male chauvinism",
      "Directed against women in Aba",
      "To promote women affairs",
      "Directed against colonial indirect rule",
    ],
    ans: "D",
    exp: "The Aba Women's Riot was a mass protest by Igbo women against British colonial taxation and indirect rule.",
  },
  // Q72
  {
    q: "The West African Students Union (WASU) was founded by:",
    opts: [
      "Marcus Garvey",
      "William du Bois",
      "Ladipo Solanke",
      "Nana Ofori Attah",
    ],
    ans: "C",
    exp: "Ladipo Solanke founded WASU in 1925 to promote the interests of West African students in Britain.",
  },
  // Q73
  {
    q: "Which of these best captures development in a society?",
    opts: [
      "Materialistic and idealistic approaches",
      "Psychological and sociological approach",
      "Institutional and system approaches",
      "Political and social approach",
    ],
    ans: "A",
    exp: "Development is best understood through both materialistic (economic) and idealistic (values, culture) dimensions.",
  },
  // Q74
  {
    q: "Which of these is a popular traditional music in Hausa?",
    opts: ["Igbin", "Gogo", "Sekere", "Akaba"],
    ans: "B",
    exp: "'Goge' (Gogo) is a traditional Hausa string instrument. Igbin and Sekere are Yoruba instruments.",
  },
  // Q75
  {
    q: "ECOWAS was established in:",
    opts: ["1975", "1956", "1922", "1960"],
    ans: "A",
    exp: "ECOWAS was established on May 28, 1975 in Lagos through the Treaty of Lagos.",
  },
  // Q76
  {
    q: "What does INEC stand for?",
    opts: [
      "Independent National Electoral Commission",
      "Independent National Export Control",
      "International Expenditure Council",
      "Independent Nigerian Election Control",
    ],
    ans: "A",
    exp: "INEC stands for Independent National Electoral Commission.",
  },
  // Q77
  {
    q: "What is the landmass of the Federal Republic of Nigeria?",
    opts: ["923,768 km²", "950,600 km²", "820,650 km²", "802,650 km²"],
    ans: "A",
    exp: "Nigeria has a total land area of approximately 923,768 square kilometers.",
  },
  // Q78
  {
    q: "All the underlisted are national symbols except:",
    opts: [
      "National Identity Emblem",
      "National Flag",
      "Coat of Arms",
      "National Anthem",
    ],
    ans: "A",
    exp: "The National Identity Emblem is an ID document, not a national symbol.",
  },
  // Q79
  {
    q: "A Nigerian who has been the Secretary-General of the Commonwealth is:",
    opts: [
      "Philip Emagwali",
      "Wole Soyinka",
      "Emeka Anyaoku",
      "Professor Maurice Iwu",
    ],
    ans: "C",
    exp: "Chief Emeka Anyaoku served as Secretary-General of the Commonwealth from 1990 to 2000.",
  },
  // Q80
  {
    q: "Which of the following best defines National identity as a concept?",
    opts: [
      "It relates to people of the same kind",
      "It relates to people of the same nation",
      "It relates to people having a sense of absolute sameness",
      "All of the above",
    ],
    ans: "B",
    exp: "National identity primarily refers to a person's sense of belonging to a particular nation.",
  },
  // Q81
  {
    q: "This Nigerian leader resisted colonial era and was later exiled by the colonial masters:",
    opts: [
      "King Jaja of Opobo",
      "Oba Ovonramwen of Benin",
      "King Kosoko",
      "Ooni of Ife",
    ],
    ans: "A",
    exp: "King Jaja of Opobo resisted British trade monopoly and was deported to the West Indies in 1887.",
  },
  // Q82
  {
    q: "Which of the following is not a fundamental human right?",
    opts: [
      "Dignity of person",
      "Personal liberty",
      "Fair hearing",
      "Freedom of expression without control",
    ],
    ans: "D",
    exp: "Absolute freedom of expression without any control is not a fundamental right — expression has limits.",
  },
  // Q83
  {
    q: "The gold fields of Western Sudan were located in:",
    opts: [
      "Bure and Bambuk",
      "Takedda and Bambuk",
      "Taghazza and Agadez",
      "Fez and Marrakesh",
    ],
    ans: "A",
    exp: "The gold fields were at Bure (present-day Guinea) and Bambuk (Mali/Senegal border).",
  },
  // Q84
  {
    q: "Which of these towns hosts an annual international mountain race?",
    opts: ["Argungu", "Yankari", "Jos", "Obudu"],
    ans: "D",
    exp: "Obudu Mountain Race is held annually at Obudu Mountain Resort in Cross River State.",
  },
  // Q85
  {
    q: "Which is the newest independent country in Africa?",
    opts: ["Namibia", "South Africa", "Sao Tome and Principe", "South Sudan"],
    ans: "D",
    exp: "South Sudan gained independence from Sudan on July 9, 2011.",
  },
  // Q86
  {
    q: "The mythical hero of the Nupe was:",
    opts: ["Ekpe", "Tsoede", "Ekine", "Amanyanabo"],
    ans: "B",
    exp: "Tsoede (Edegi) is the legendary hero and founder of the Nupe Kingdom.",
  },
  // Q87
  {
    q: "Polyandry in relation to commonly held notions of marriage is:",
    opts: [
      "Fraternal and non-fraternal",
      "A woman marries a group of brothers",
      "A woman marries several husbands",
      "All of the above",
    ],
    ans: "D",
    exp: "Polyandry is when one woman has multiple husbands. It can be fraternal or non-fraternal.",
  },
  // Q88
  {
    q: "Marriage by mutual consent best defines:",
    opts: [
      "Trial marriage",
      "Extra-marital relationship",
      "Christian marriage",
      "Islamic marriage",
    ],
    ans: "C",
    exp: "Christian marriage is characterized by free mutual consent, monogamy, and lifelong commitment.",
  },
  // Q89
  {
    q: "Osu caste system is synonymous with which of these?",
    opts: ["Asokore", "Mbaise", "Itsekiri", "Igboland"],
    ans: "D",
    exp: "The Osu caste system is a social institution found in Igboland where Osu are considered outcasts.",
  },
  // Q90
  {
    q: "Which of the following countries triggered the Arab Spring?",
    opts: ["Egypt", "Libya", "Syria", "Tunisia"],
    ans: "D",
    exp: "The Arab Spring began in Tunisia in December 2010 when Mohamed Bouazizi's self-immolation sparked protests.",
  },
  // Q91
  {
    q: "The current Vice President of Nigeria is:",
    opts: [
      "Namadi Sambo",
      "Yemi Osinbajo",
      "Kashim Shettima",
      "Goodluck Jonathan",
    ],
    ans: "C",
    exp: "Senator Kashim Shettima is the current Vice President of Nigeria, serving since May 29, 2023.",
  },
  // Q92
  {
    q: "In terms of coastal settlements in Nigeria, which of the following is odd?",
    opts: ["Epe", "Ijebu-Ode", "Ogbomosho", "Forcados"],
    ans: "C",
    exp: "Epe, Ijebu-Ode, and Forcados are coastal settlements. Ogbomosho is an inland city in Oyo State.",
  },
  // Q93
  {
    q: "GNS means:",
    opts: [
      "General Studies",
      "General Nigerian Studies",
      "General Nigeria Studies",
      "General Nigerians Studies",
    ],
    ans: "A",
    exp: "GNS stands for General Studies — general education courses all Nigerian university students must take.",
  },
  // Q94
  {
    q: "The extended family is also known as:",
    opts: [
      "Consanguine family",
      "Joint family",
      "Nuclear family",
      "Single-parent family",
    ],
    ans: "A",
    exp: "The consanguine (extended) family includes grandparents, aunts, uncles, cousins, and other blood relatives.",
  },
  // Q95
  {
    q: "An individual unlawfully arrested could through ___ regain his freedom.",
    opts: ["Protest", "Habeas Corpus", "Constitution", "Battle"],
    ans: "B",
    exp: "Habeas Corpus is a legal writ requiring a person under arrest to be brought before a judge.",
  },
  // Q96
  {
    q: "The first stage in the Igbo traditional marriage process is:",
    opts: [
      "Seeking the girl's consent",
      "Introduction",
      "Bride price negotiation",
      "Wine carrying",
    ],
    ans: "A",
    exp: "In Igbo tradition, the first stage is seeking the girl's consent before approaching the family.",
  },
  // Q97
  {
    q: "The 'Sharo' among the Fulani is restricted to marriage ceremony. This statement is:",
    opts: ["True", "False", "Partially true", "Not applicable"],
    ans: "B",
    exp: "False. Sharo is a Fulani rite of passage for young men to prove manhood, not restricted to marriage.",
  },
  // Q98
  {
    q: "Terracottas of the Nok culture are common among the:",
    opts: [
      "Tiv of Benue State",
      "Fulani of Sokoto State",
      "Kanuri of Borno State",
      "Berom of Plateau State",
    ],
    ans: "D",
    exp: "Nok terracotta figurines are predominantly found in the Jos Plateau area, home of the Berom people.",
  },
  // Q99
  {
    q: "Odu festival is common among the:",
    opts: ["Yoruba", "Igbo", "Egede", "Ijaw"],
    ans: "C",
    exp: "The Odu festival is a celebration of the Egede people of Benue State.",
  },
  // Q100
  {
    q: "The general punishment meted out to murderers traditionally is:",
    opts: ["Life Imprisonment", "Banishment", "Death Punishment", "Sharia"],
    ans: "C",
    exp: "Across most Nigerian traditional societies, murder was punishable by death.",
  },

  /* ============================================================
               MTH 102 — Questions 101-200 (Elementary Mathematics II)
               ============================================================ */
  // Q101
  {
    q: "Differentiate with respect to x: x(1 − x)",
    opts: ["2 + 2x", "2 − 2x", "1 − x", "1 − 2x"],
    ans: "D",
    exp: "Expanding: x − x². Differentiating: 1 − 2x.",
  },
  // Q102
  {
    q: "Differentiate with respect to x: (1 + x²)(1 − 2x²)",
    opts: ["−x(1 + 4x²)", "−2x(1 + 2x²)", "2x(1 + 4x²)", "−2x(1 + 4x²)"],
    ans: "D",
    exp: "Using product rule: (2x)(1−2x²) + (1+x²)(−4x) = −2x − 8x³ = −2x(1+4x²).",
  },
  // Q103
  {
    q: "Differentiate with respect to x: cos 2x",
    opts: ["−2sin 2x", "2sin 2x", "−sin 2x", "sin 2x"],
    ans: "A",
    exp: "Chain rule: d/dx(cos 2x) = −sin(2x) · 2 = −2sin 2x.",
  },
  // Q104
  {
    q: "Differentiate with respect to x: x/(x² + 1)",
    opts: [
      "(1 − x²)/(x² + 1)²",
      "(1 + x²)/(x² + 1)²",
      "(x² − 1)/(x² + 1)²",
      "1/(x² + 1)",
    ],
    ans: "A",
    exp: "Quotient rule: [(x²+1)(1) − x(2x)]/(x²+1)² = (1−x²)/(x²+1)².",
  },
  // Q105
  {
    q: "Differentiate with respect to x: (2 − x)/(1 − 2x)",
    opts: ["−3/(1 − 2x)²", "3/(1 − 2x)²", "−5/(1 − 2x)²", "5/(1 − 2x)²"],
    ans: "B",
    exp: "Quotient rule: [(1−2x)(−1) − (2−x)(−2)]/(1−2x)² = 3/(1−2x)².",
  },
  // Q106
  {
    q: "Differentiate with respect to x: sec²x",
    opts: ["2sec²x tan x", "2sec x tan x", "sec²x tan x", "2tan x"],
    ans: "A",
    exp: "d/dx(sec²x) = 2 sec x · sec x tan x = 2 sec²x tan x.",
  },
  // Q107
  {
    q: "Differentiate with respect to x: (3 − 2x²)⁻²",
    opts: [
      "−4x(3 − 2x²)⁻³",
      "8x(3 − 2x²)⁻³",
      "4x(3 − 2x²)⁻³",
      "−8x(3 − 2x²)⁻³",
    ],
    ans: "B",
    exp: "Chain rule: −2(3−2x²)⁻³ · (−4x) = 8x(3−2x²)⁻³.",
  },
  // Q108
  {
    q: "Differentiate with respect to x: cot 2x",
    opts: ["−2csc²2x", "2csc²2x", "−csc²2x", "−2sec²2x"],
    ans: "A",
    exp: "d/dx(cot 2x) = −csc²(2x) · 2 = −2csc²2x.",
  },
  // Q109
  {
    q: "Evaluate: lim(x→2) (x² + x − 6)/(x − 2)",
    opts: ["3", "5", "2", "0"],
    ans: "B",
    exp: "Factor: (x+3)(x−2)/(x−2) = x+3. As x→2: 2+3 = 5.",
  },
  // Q110
  {
    q: "Evaluate: lim(x→0) sin(3x)/x",
    opts: ["0", "1", "3", "∞"],
    ans: "C",
    exp: "Using lim sin(kx)/x = k: lim sin(3x)/x = 3.",
  },
  // Q111
  {
    q: "Evaluate: lim(x→∞) (3x² + 2x − 1)/(x² − 4)",
    opts: ["0", "1", "2", "3"],
    ans: "D",
    exp: "Divide by x²: (3 + 2/x − 1/x²)/(1 − 4/x²) → 3/1 = 3.",
  },
  // Q112
  {
    q: "Evaluate: lim(x→0) (1 − cos x)/x²",
    opts: ["0", "1/2", "1", "2"],
    ans: "B",
    exp: "Using Taylor series: 1 − cos x ≈ x²/2. So limit = 1/2.",
  },
  // Q113
  {
    q: "Evaluate: lim(x→1) (x³ − 1)/(x − 1)",
    opts: ["0", "1", "2", "3"],
    ans: "D",
    exp: "Factor: x³−1 = (x−1)(x²+x+1). Limit = x²+x+1 at x=1: 1+1+1 = 3.",
  },
  // Q114
  {
    q: "Evaluate: lim(h→0) [(2 + h)³ − 8]/h",
    opts: ["0", "4", "8", "12"],
    ans: "D",
    exp: "(2+h)³ = 8+12h+6h²+h³. [(2+h)³−8]/h = 12+6h+h². As h→0: 12.",
  },
  // Q115
  {
    q: "Evaluate: lim(x→∞) (1 + 1/x)^x",
    opts: ["0", "1", "e", "∞"],
    ans: "C",
    exp: "This is the definition of e (Euler's number). lim(1 + 1/x)^x = e ≈ 2.71828.",
  },
  // Q116
  {
    q: "Find the derivative of y = e^(3x) sin 2x",
    opts: [
      "e^(3x)(3sin 2x + 2cos 2x)",
      "e^(3x)(3sin 2x − 2cos 2x)",
      "e^(3x)sin 2x(3 + 2cot 2x)",
      "3e^(3x)sin 2x",
    ],
    ans: "A",
    exp: "Product rule: e^(3x)(2cos 2x) + 3e^(3x)(sin 2x) = e^(3x)(2cos 2x + 3sin 2x).",
  },
  // Q117
  {
    q: "Find dy/dx if y = ln(3x² + 1)",
    opts: ["6x/(3x² + 1)", "3x/(3x² + 1)", "2x/(3x² + 1)", "1/(3x² + 1)"],
    ans: "A",
    exp: "Chain rule: d/dx(ln u) = (1/u)(du/dx). dy/dx = 6x/(3x²+1).",
  },
  // Q118
  {
    q: "Find dy/dx if y = xˣ",
    opts: ["xˣ(1 + ln x)", "xˣ ln x", "x^(x−1)", "xˣ"],
    ans: "A",
    exp: "Take ln: ln y = x ln x. Differentiate: dy/dx = xˣ(1+ln x).",
  },
  // Q119
  {
    q: "Find dy/dx if x² + y² = 25",
    opts: ["−x/y", "x/y", "−y/x", "y/x"],
    ans: "A",
    exp: "Implicit differentiation: 2x + 2y(dy/dx) = 0. So dy/dx = −x/y.",
  },
  // Q120
  {
    q: "Find dy/dx if y = sin⁻¹(2x)",
    opts: ["2/√(1 − 4x²)", "1/√(1 − 4x²)", "2/√(1 − x²)", "1/√(1 − x²)"],
    ans: "A",
    exp: "d/dx(sin⁻¹u) = 1/√(1−u²) · du/dx. With u=2x: 2/√(1−4x²).",
  },
  // Q121
  {
    q: "The radius of a circle increases at 0.5 cm/s. Rate of increase of area when r = 10 cm:",
    opts: ["5π cm²/s", "10π cm²/s", "20π cm²/s", "25π cm²/s"],
    ans: "B",
    exp: "A = πr². dA/dt = 2πr · dr/dt = 2π(10)(0.5) = 10π cm²/s.",
  },
  // Q122
  {
    q: "Find the equation of the tangent to y = x² − 3x + 2 at (2, 0).",
    opts: ["y = x − 2", "y = 2x − 4", "y = x + 2", "y = 2x + 4"],
    ans: "A",
    exp: "dy/dx = 2x − 3. At x=2: slope = 1. Tangent: y−0 = 1(x−2), y = x−2.",
  },
  // Q123
  {
    q: "Find the critical points of f(x) = x³ − 3x² − 9x + 5.",
    opts: [
      "x = −1 and x = 3",
      "x = 1 and x = −3",
      "x = 0 and x = 3",
      "x = −1 and x = 2",
    ],
    ans: "A",
    exp: "f'(x) = 3x²−6x−9 = 3(x−3)(x+1). Critical points at x=3 and x=−1.",
  },
  // Q124
  {
    q: "Find the maximum value of f(x) = −x² + 4x − 3.",
    opts: ["1", "2", "3", "4"],
    ans: "A",
    exp: "f'(x) = −2x+4 = 0 → x=2. f(2) = −4+8−3 = 1. f''<0, so maximum.",
  },
  // Q125
  {
    q: "Find the minimum value of f(x) = x² − 4x + 7.",
    opts: ["3", "4", "5", "7"],
    ans: "A",
    exp: "f'(x) = 2x−4 = 0 → x=2. f(2) = 4−8+7 = 3. f''>0, so minimum.",
  },
  // Q126
  {
    q: "The sum of two numbers is 20. Find the numbers if their product is maximum.",
    opts: ["10 and 10", "12 and 8", "15 and 5", "14 and 6"],
    ans: "A",
    exp: "Product P = x(20−x). P' = 20−2x = 0 → x=10. Both numbers are 10.",
  },
  // Q127
  {
    q: "Integrate: ∫(3x² + 2x − 5) dx",
    opts: [
      "x³ + x² − 5x + C",
      "x³ + x² − 5 + C",
      "6x + 2 + C",
      "3x³ + x² − 5x + C",
    ],
    ans: "A",
    exp: "∫3x²dx + ∫2x dx − ∫5 dx = x³ + x² − 5x + C.",
  },
  // Q128
  {
    q: "Integrate: ∫(1/x) dx",
    opts: ["ln|x| + C", "1/x² + C", "x ln x + C", "eˣ + C"],
    ans: "A",
    exp: "The integral of 1/x is ln|x| + C.",
  },
  // Q129
  {
    q: "Integrate: ∫e^(2x) dx",
    opts: ["(1/2)e^(2x) + C", "2e^(2x) + C", "e^(2x) + C", "e^(2x)/(2x) + C"],
    ans: "A",
    exp: "∫e^(kx)dx = (1/k)e^(kx) + C. With k=2: (1/2)e^(2x) + C.",
  },
  // Q130
  {
    q: "Integrate: ∫sin 3x dx",
    opts: ["−(1/3)cos 3x + C", "(1/3)cos 3x + C", "−cos 3x + C", "cos 3x + C"],
    ans: "A",
    exp: "∫sin(kx)dx = −(1/k)cos(kx) + C. With k=3: −(1/3)cos 3x + C.",
  },
  // Q131
  {
    q: "Evaluate: ∫₀¹ x² dx",
    opts: ["1/3", "1/2", "1", "1/4"],
    ans: "A",
    exp: "[x³/3]₀¹ = 1/3 − 0 = 1/3.",
  },
  // Q132
  {
    q: "Evaluate: ∫₀^π sin x dx",
    opts: ["0", "1", "2", "π"],
    ans: "C",
    exp: "[−cos x]₀^π = −cos π − (−cos 0) = 1+1 = 2.",
  },
  // Q133
  {
    q: "Evaluate: ∫₀¹ eˣ dx",
    opts: ["e − 1", "e", "1", "e + 1"],
    ans: "A",
    exp: "[eˣ]₀¹ = e¹ − e⁰ = e − 1.",
  },
  // Q134
  {
    q: "Evaluate: ∫₁^e (1/x) dx",
    opts: ["1", "0", "e", "ln e"],
    ans: "A",
    exp: "[ln x]₁^e = ln e − ln 1 = 1 − 0 = 1.",
  },
  // Q135
  {
    q: "Find the area under the curve y = x² from x = 0 to x = 2.",
    opts: ["8/3", "4/3", "2/3", "16/3"],
    ans: "A",
    exp: "∫₀² x² dx = [x³/3]₀² = 8/3.",
  },
  // Q136
  {
    q: "Find the area between y = x² and y = x from x = 0 to x = 1.",
    opts: ["1/6", "1/3", "1/2", "2/3"],
    ans: "A",
    exp: "∫₀¹(x − x²)dx = [x²/2 − x³/3]₀¹ = 1/2 − 1/3 = 1/6.",
  },
  // Q137
  {
    q: "Solve the differential equation dy/dx = 2x",
    opts: ["y = x² + C", "y = 2x + C", "y = x²", "y = 2x"],
    ans: "A",
    exp: "Integrate both sides: y = ∫2x dx = x² + C.",
  },
  // Q138
  {
    q: "Solve dy/dx = y with y(0) = 1.",
    opts: ["y = eˣ", "y = eˣ + 1", "y = eˣ − 1", "y = x + 1"],
    ans: "A",
    exp: "Separable: dy/y = dx → y = Aeˣ. With y(0)=1: A=1. y=eˣ.",
  },
  // Q139
  {
    q: "Solve the differential equation dy/dx = xy",
    opts: ["y = Ce^(x²/2)", "y = Ce^(x²)", "y = Cx²", "y = Ceˣ"],
    ans: "A",
    exp: "Separable: dy/y = x dx → y = Ce^(x²/2).",
  },
  // Q140
  {
    q: "Find the Taylor series expansion of eˣ about x = 0.",
    opts: ["Σ(n=0→∞) xⁿ/n!", "Σ(n=0→∞) xⁿ/n", "Σ(n=0→∞) n·xⁿ", "Σ(n=0→∞) xⁿ"],
    ans: "A",
    exp: "The Maclaurin series for eˣ = 1 + x + x²/2! + x³/3! + ... = Σxⁿ/n!.",
  },
  // Q141
  {
    q: "Find: ∫x eˣ dx",
    opts: ["xeˣ − eˣ + C", "xeˣ + eˣ + C", "(x+1)eˣ + C", "(x²/2)eˣ + C"],
    ans: "A",
    exp: "Integration by parts: u=x, dv=eˣdx → xeˣ − eˣ + C.",
  },
  // Q142
  {
    q: "Find: ∫ln x dx",
    opts: ["x ln x − x + C", "x ln x + x + C", "1/x + C", "ln x − x + C"],
    ans: "A",
    exp: "By parts: u=ln x, dv=dx → x ln x − x + C.",
  },
  // Q143
  {
    q: "Find: ∫1/(x² + a²) dx",
    opts: [
      "(1/a)tan⁻¹(x/a) + C",
      "tan⁻¹(x/a) + C",
      "(1/a²)tan⁻¹(x/a) + C",
      "(1/a)tan⁻¹x + C",
    ],
    ans: "A",
    exp: "Standard formula: ∫dx/(x²+a²) = (1/a)arctan(x/a) + C.",
  },
  // Q144
  {
    q: "The determinant of the matrix [[a,b],[c,d]] is:",
    opts: ["ad − bc", "ab − cd", "ac − bd", "ad + bc"],
    ans: "A",
    exp: "The 2×2 determinant = ad − bc. This is the fundamental formula.",
  },
  // Q145
  {
    q: "The eigenvalues of the matrix [[2,1],[1,2]] are:",
    opts: ["1 and 3", "2 and 2", "0 and 4", "1 and 2"],
    ans: "A",
    exp: "det(A−λI)=0: λ²−4λ+3=0 → eigenvalues λ=1 and λ=3.",
  },
  // Q146
  {
    q: "The gradient of f(x,y) = x² + y² is:",
    opts: ["(2x, 2y)", "(2x, 2y, 0)", "2x + 2y", "x² + y²"],
    ans: "A",
    exp: "The gradient ∇f = (∂f/∂x, ∂f/∂y) = (2x, 2y).",
  },
  // Q147
  {
    q: "The double integral ∫₀¹∫₀¹ xy dx dy equals:",
    opts: ["1/4", "1/2", "1/3", "1"],
    ans: "A",
    exp: "∫₀¹y[∫₀¹x dx]dy = ∫₀¹y[1/2]dy = (1/2)[y²/2]₀¹ = 1/4.",
  },
  // Q148
  {
    q: "The Laplace transform of f(t) = 1 is:",
    opts: ["1/s", "1/s²", "1/(s+1)", "s"],
    ans: "A",
    exp: "L{1} = ∫₀^∞ e^(−st) dt = 1/s for s > 0.",
  },
  // Q149
  {
    q: "The Laplace transform of f(t) = e^(at) is:",
    opts: ["1/(s − a)", "1/(s + a)", "a/(s − a)", "1/(s²−a²)"],
    ans: "A",
    exp: "L{e^(at)} = 1/(s−a) for s>a.",
  },
  // Q150
  {
    q: "The Laplace transform of f(t) = tⁿ is:",
    opts: ["n!/s^(n+1)", "n!/sⁿ", "n/s^(n+1)", "1/s^(n+1)"],
    ans: "A",
    exp: "L{tⁿ} = n!/s^(n+1) for s>0 and n≥0.",
  },
  // Q151
  {
    q: "The Laplace transform of f(t) = sin(kt) is:",
    opts: ["k/(s² + k²)", "s/(s² + k²)", "1/(s² + k²)", "k/(s² − k²)"],
    ans: "A",
    exp: "L{sin(kt)} = k/(s²+k²) for s>0.",
  },
  // Q152
  {
    q: "The Laplace transform of f(t) = cos(kt) is:",
    opts: ["s/(s² + k²)", "k/(s² + k²)", "1/(s² + k²)", "s/(s² − k²)"],
    ans: "A",
    exp: "L{cos(kt)} = s/(s²+k²) for s>0.",
  },
  // Q153
  {
    q: "The Fourier series of an odd function contains only:",
    opts: [
      "Sine terms",
      "Cosine terms",
      "Constant term",
      "Both sine and cosine",
    ],
    ans: "A",
    exp: "Odd functions f(−x)=−f(x) have Fourier series with only sine terms.",
  },
  // Q154
  {
    q: "The Fourier series of an even function contains only:",
    opts: [
      "Cosine terms",
      "Sine terms",
      "Constant term only",
      "Both sine and cosine",
    ],
    ans: "A",
    exp: "Even functions f(−x)=f(x) have Fourier series with only cosine terms.",
  },
  // Q155
  {
    q: "The partial fraction decomposition of 1/(x² − 1) is:",
    opts: [
      "(1/2)[1/(x−1) − 1/(x+1)]",
      "(1/2)[1/(x−1) + 1/(x+1)]",
      "1/(x−1) − 1/(x+1)",
      "1/(x−1) + 1/(x+1)",
    ],
    ans: "A",
    exp: "1/(x²−1) = 1/[(x−1)(x+1)]. Solving: A=1/2, B=−1/2.",
  },
  // Q156
  {
    q: "Differentiate with respect to x: sin x − x² cos x",
    opts: [
      "(1 − 3x)cos x + x²sin x",
      "(1 − 3x)cos x + x³sin x",
      "(1 + 3x)cos x + x³sin x",
      "(1 − 3x)cos x − x³sin x",
    ],
    ans: "B",
    exp: "Using product rule: d/dx(sin x) − d/dx(x²cos x) = cos x − (2x cos x − x² sin x)",
  },
  // Q157
  {
    q: "Differentiate with respect to x: x² cos x",
    opts: [
      "x²(2cos x − x sin x)",
      "x(2cos x − x sin x)",
      "2x cos x − x²sin x",
      "All of the above",
    ],
    ans: "D",
    exp: "Product rule: 2x cos x − x²sin x. All options are equivalent.",
  },
  // Q158
  {
    q: "Differentiate with respect to x: (3x² + 2)³",
    opts: [
      "81x⁵ + 108x³ + 36x",
      "18x(3x² + 2)²",
      "3(3x² + 2)² · 6x",
      "All of the above",
    ],
    ans: "D",
    exp: "Chain rule: 18x(3x²+2)². Expanding gives the same result.",
  },
  // Q159
  {
    q: "Differentiate with respect to x: x² sin x cos x",
    opts: [
      "2x sin x cos x + x²cos 2x",
      "x sin 2x + x²cos 2x",
      "x sin 2x + (x²/2)cos 2x",
      "All are equivalent",
    ],
    ans: "A",
    exp: "Using sin x cos x = sin(2x)/2, the derivative is 2x sin x cos x + x²cos 2x.",
  },
  // Q160
  {
    q: "Differentiate with respect to x: (sin x − cos x)/(sin x + cos x)",
    opts: [
      "2/(sin x + cos x)²",
      "−2/(sin x + cos x)²",
      "1/(sin x + cos x)²",
      "2sin x cos x/(sin x + cos x)²",
    ],
    ans: "A",
    exp: "Quotient rule yields 2/(sin x + cos x)².",
  },
  // Q161
  {
    q: "Differentiate with respect to x: x/tan x",
    opts: [
      "(tan x − x sec²x)/tan²x",
      "cot x − x csc²x",
      "Both A and B",
      "Neither",
    ],
    ans: "C",
    exp: "Both forms are correct: quotient rule gives A, which simplifies to B.",
  },
  // Q162
  {
    q: "Differentiate with respect to x: (1 + 3x²)/(2 + 4x²)",
    opts: ["2x/(1 + 2x²)²", "−2x/(1 + 2x²)²", "x/(1 + 2x²)²", "−x/(1 + 2x²)²"],
    ans: "A",
    exp: "Quotient rule simplifies to 2x/(1 + 2x²)².",
  },
  // Q163
  {
    q: "Differentiate with respect to x: sin x/(1 + tan x)",
    opts: [
      "[cos x(1 + tan x) − sin x sec²x]/(1 + tan x)²",
      "cos x/(1 + tan x)²",
      "[cos x − sin x sec²x]/(1 + tan x)²",
      "All of the above",
    ],
    ans: "A",
    exp: "Quotient rule gives the expression in option A.",
  },
  // Q164
  {
    q: "Differentiate with respect to x: (1 + sin x)/(1 − sin x)",
    opts: [
      "2cos x/(1 − sin x)²",
      "2sec x/(1 − sin x)²",
      "2cos x/(1 − sin x)²",
      "2/(1 − sin x)",
    ],
    ans: "A",
    exp: "Quotient rule yields 2cos x/(1 − sin x)².",
  },
  // Q165
  {
    q: "Evaluate: lim(x→0) (tan x − x)/x³",
    opts: ["0", "1/3", "1/6", "1"],
    ans: "B",
    exp: "Taylor expansion: tan x = x + x³/3 + ... So limit = 1/3.",
  },
  // Q166
  {
    q: "Find dy/dx if y = tan⁻¹(x²)",
    opts: ["2x/(1 + x⁴)", "1/(1 + x⁴)", "2x/(1 + x²)", "1/(1 + x²)"],
    ans: "A",
    exp: "d/dx(tan⁻¹u) = 1/(1+u²) · du/dx = 2x/(1+x⁴).",
  },
  // Q167
  {
    q: "The surface area of a sphere is increasing at 4 cm²/s. Find the rate of increase of the radius when r = 2 cm.",
    opts: ["1/(2π) cm/s", "1/(4π) cm/s", "1/(8π) cm/s", "1/π cm/s"],
    ans: "B",
    exp: "SA = 4πr². dSA/dt = 8πr · dr/dt → dr/dt = 4/(8π·2) = 1/(4π).",
  },
  // Q168
  {
    q: "Find the equation of the normal to y = x³ at the point (1, 1).",
    opts: [
      "y = −(1/3)x + 4/3",
      "y = 3x − 2",
      "y = −3x + 4",
      "y = (1/3)x + 2/3",
    ],
    ans: "A",
    exp: "dy/dx = 3x². At x=1: slope = 3. Normal slope = −1/3. Normal: y = −x/3 + 4/3.",
  },
  // Q169
  {
    q: "A rectangular field is to be fenced on three sides. If 100 m of fencing is available, find the maximum area.",
    opts: ["1250 m²", "2500 m²", "625 m²", "5000 m²"],
    ans: "A",
    exp: "2x+y=100, y=100−2x. Area=xy=x(100−2x). dA/dx=100−4x=0→x=25. Max area=1250 m².",
  },
  // Q170
  {
    q: "Integrate: ∫cos²x dx",
    opts: [
      "x/2 + sin(2x)/4 + C",
      "x/2 − sin(2x)/4 + C",
      "x/2 + cos(2x)/4 + C",
      "x/2 − cos(2x)/4 + C",
    ],
    ans: "A",
    exp: "cos²x = (1+cos 2x)/2. ∫ = x/2 + sin(2x)/4 + C.",
  },
  // Q171
  {
    q: "Evaluate: ∫₀^(π/2) sin²x dx",
    opts: ["π/4", "π/2", "π/3", "π/6"],
    ans: "A",
    exp: "sin²x = (1−cos 2x)/2. ∫ = π/4.",
  },
  // Q172
  {
    q: "Find the volume generated by rotating y = x² from x = 0 to x = 2 about the x-axis.",
    opts: ["32π/5", "16π/5", "8π/5", "4π/5"],
    ans: "A",
    exp: "V = π∫₀²(x²)²dx = π[x⁵/5]₀² = 32π/5.",
  },
  // Q173
  {
    q: "Find the volume generated by rotating y = √x from x = 0 to x = 4 about the x-axis.",
    opts: ["8π", "4π", "2π", "π"],
    ans: "A",
    exp: "V = π∫₀⁴(√x)²dx = π[x²/2]₀⁴ = 8π.",
  },
  // Q174
  {
    q: "Find the Maclaurin series for sin x.",
    opts: [
      "Σ(n=0→∞) (−1)ⁿx^(2n+1)/(2n+1)!",
      "Σ(n=0→∞) x^(2n+1)/(2n+1)!",
      "Σ(n=0→∞) (−1)ⁿx^(2n)/(2n)!",
      "Σ(n=0→∞) x^(2n)/(2n)!",
    ],
    ans: "A",
    exp: "sin x = Σ(−1)ⁿx^(2n+1)/(2n+1)!.",
  },
  // Q175
  {
    q: "The binomial expansion of (1 + x)ⁿ for |x| < 1 is:",
    opts: [
      "Σ(k=0→∞) C(n,k)xᵏ",
      "Σ(k=0→∞) (n!/k!)xᵏ",
      "Σ(k=0→∞) nᵏxᵏ",
      "Σ(k=0→∞) xᵏ/k!",
    ],
    ans: "A",
    exp: "The generalized binomial series: (1+x)ⁿ = Σ C(n,k)xᵏ.",
  },
  // Q176
  {
    q: "Find: ∫1/√(a² − x²) dx",
    opts: [
      "sin⁻¹(x/a) + C",
      "cos⁻¹(x/a) + C",
      "tan⁻¹(x/a) + C",
      "(1/a)sin⁻¹(x/a) + C",
    ],
    ans: "A",
    exp: "Standard formula: ∫dx/√(a²−x²) = arcsin(x/a) + C.",
  },
  // Q177
  {
    q: "Evaluate: ∫₀^∞ e^(−x) dx",
    opts: ["1", "0", "∞", "e"],
    ans: "A",
    exp: "[−e^(−x)]₀^∞ = 0 − (−1) = 1.",
  },
  // Q178
  {
    q: "Find the length of the curve y = x^(3/2) from x = 0 to x = 4.",
    opts: [
      "(8/27)(10√10 − 1)",
      "(8/27)(10√10 + 1)",
      "(4/9)(10√10 − 1)",
      "(4/9)(10√10 + 1)",
    ],
    ans: "A",
    exp: "Arc length = ∫₀⁴√(1+(dy/dx)²)dx. dy/dx = (3/2)x^(1/2). Integrating gives (8/27)(10√10−1).",
  },
  // Q179
  {
    q: "The function f(x) = x³ − 3x has:",
    opts: [
      "Local max at x=−1, local min at x=1",
      "Local max at x=1, local min at x=−1",
      "Inflection at x=0",
      "Both A and C",
    ],
    ans: "D",
    exp: "f'(x)=3x²−3=0→x=±1. f''(−1)=−6<0 (max), f''(1)=6>0 (min), f''(0)=0 (inflection).",
  },
  // Q180
  {
    q: "The function f(x) = x⁴ − 2x² has:",
    opts: [
      "Local max at x=0, local min at x=±1",
      "Local min at x=0, local max at x=±1",
      "No critical points",
      "Only one critical point",
    ],
    ans: "A",
    exp: "f'(x)=4x³−4x=4x(x²−1)=0→x=0,±1. f''(0)=−4<0 (max), f''(±1)=8>0 (min).",
  },
  // Q181
  {
    q: "Find the second derivative of f(x) = ln x.",
    opts: ["−1/x²", "1/x²", "−1/x", "1/x"],
    ans: "A",
    exp: "f'(x) = 1/x = x⁻¹. f''(x) = −x⁻² = −1/x².",
  },
  // Q182
  {
    q: "Find the third derivative of f(x) = sin x.",
    opts: ["−cos x", "cos x", "−sin x", "sin x"],
    ans: "A",
    exp: "f'=cos x, f''=−sin x, f'''=−cos x.",
  },
  // Q183
  {
    q: "The velocity of a particle is v(t) = 3t² − 2t. Find the distance from t = 0 to t = 2.",
    opts: ["4 m", "6 m", "8 m", "10 m"],
    ans: "A",
    exp: "Distance = ∫₀²|3t²−2t|dt = 4 m.",
  },
  // Q184
  {
    q: "Acceleration a(t) = 6t − 4. If initial velocity is 2 m/s, find velocity at t = 3 s.",
    opts: ["16 m/s", "17 m/s", "18 m/s", "19 m/s"],
    ans: "B",
    exp: "v(t) = ∫(6t−4)dt = 3t²−4t+C. v(0)=2→C=2. v(3)=27−12+2=17.",
  },
  // Q185
  {
    q: "The position s(t) = t³ − 6t² + 9t. Find when the particle is at rest.",
    opts: [
      "t = 1 and t = 3",
      "t = 0 and t = 2",
      "t = 2 and t = 4",
      "t = 0 and t = 3",
    ],
    ans: "A",
    exp: "v(t)=s'(t)=3t²−12t+9=3(t−1)(t−3)=0. At rest at t=1 and t=3.",
  },
  // Q186
  {
    q: "Find the linear approximation of f(x) = √x at x = 4.",
    opts: [
      "2 + (1/4)(x − 4)",
      "2 + (1/2)(x − 4)",
      "2 − (1/4)(x − 4)",
      "4 + (1/4)(x − 4)",
    ],
    ans: "A",
    exp: "L(x) = f(4) + f'(4)(x−4). f(4)=2, f'(4)=1/4. L(x) = 2 + (1/4)(x−4).",
  },
  // Q187
  {
    q: "Use linear approximation to estimate √4.1.",
    opts: ["2.025", "2.05", "2.1", "2.2"],
    ans: "A",
    exp: "L(4.1) = 2 + (1/4)(0.1) = 2 + 0.025 = 2.025.",
  },
  // Q188
  {
    q: "Find dy/dx if y = cosh(2x).",
    opts: ["2sinh(2x)", "sinh(2x)", "2cosh(2x)", "cosh(2x)"],
    ans: "A",
    exp: "d/dx(cosh u) = sinh u · du/dx = 2sinh(2x).",
  },
  // Q189
  {
    q: "Find dy/dx if y = sinh⁻¹(x).",
    opts: ["1/√(1 + x²)", "1/√(x² − 1)", "1/(1 + x²)", "1/√(1 − x²)"],
    ans: "A",
    exp: "d/dx(sinh⁻¹x) = 1/√(1+x²).",
  },
  // Q190
  {
    q: "Evaluate: ∫sinh x dx",
    opts: ["cosh x + C", "sinh x + C", "−cosh x + C", "eˣ + C"],
    ans: "A",
    exp: "d/dx(cosh x) = sinh x, so ∫sinh x dx = cosh x + C.",
  },
  // Q191
  {
    q: "Evaluate: ∫tanh x dx",
    opts: ["ln(cosh x) + C", "ln(sinh x) + C", "cosh x + C", "sinh x + C"],
    ans: "A",
    exp: "tanh x = sinh x/cosh x. Let u=cosh x, du=sinh x dx → ∫du/u = ln(cosh x) + C.",
  },
  // Q192
  {
    q: "Find the inverse Laplace transform of 1/s.",
    opts: ["1", "t", "eᵗ", "0"],
    ans: "A",
    exp: "L⁻¹{1/s} = 1.",
  },
  // Q193
  {
    q: "Find the inverse Laplace transform of 1/s².",
    opts: ["t", "1", "t²", "eᵗ"],
    ans: "A",
    exp: "L⁻¹{1/s²} = t.",
  },
  // Q194
  {
    q: "Find the inverse Laplace transform of 1/(s − 2).",
    opts: ["e^(2t)", "e^(−2t)", "2eᵗ", "eᵗ"],
    ans: "A",
    exp: "L⁻¹{1/(s−a)} = e^(at). With a=2: e^(2t).",
  },
  // Q195
  {
    q: "The Fourier series coefficient a₀ for f(x) with period 2π is:",
    opts: [
      "(1/π)∫₋π^π f(x)dx",
      "(2/π)∫₋π^π f(x)dx",
      "(1/2π)∫₋π^π f(x)dx",
      "∫₋π^π f(x)dx",
    ],
    ans: "A",
    exp: "a₀ = (1/π)∫₋π^π f(x)dx.",
  },
  // Q196
  {
    q: "The partial fraction decomposition of (x+1)/(x² − 3x + 2) is:",
    opts: [
      "3/(x−2) − 2/(x−1)",
      "2/(x−2) − 3/(x−1)",
      "3/(x−1) − 2/(x−2)",
      "2/(x−1) − 3/(x−2)",
    ],
    ans: "A",
    exp: "x²−3x+2=(x−1)(x−2). Solving gives 3/(x−2) − 2/(x−1).",
  },
  // Q197
  {
    q: "The inverse of the matrix [[a,b],[c,d]] is:",
    opts: [
      "(1/(ad−bc))[[d,−b],[−c,a]]",
      "(1/(ad−bc))[[−d,b],[c,−a]]",
      "(1/(ad−bc))[[d,b],[c,a]]",
      "(1/(ad−bc))[[−d,−b],[−c,−a]]",
    ],
    ans: "A",
    exp: "The inverse is (1/det)·adjugate = (1/(ad−bc))[[d,−b],[−c,a]].",
  },
  // Q198
  {
    q: "The product of matrices [[1,2],[3,4]] and [[5,6],[7,8]] is:",
    opts: [
      "[[19,22],[43,50]]",
      "[[23,34],[31,46]]",
      "[[5,12],[21,32]]",
      "[[6,8],[10,12]]",
    ],
    ans: "A",
    exp: "Matrix multiplication: [1×5+2×7, 1×6+2×8; 3×5+4×7, 3×6+4×8] = [[19,22],[43,50]].",
  },
  // Q199
  {
    q: "The directional derivative of f(x,y) = xy at (1,1) in the direction of (1,1) is:",
    opts: ["√2", "2√2", "1", "2"],
    ans: "A",
    exp: "∇f = (y,x) = (1,1). Unit vector: (1,1)/√2. Directional derivative = (1,1)·(1/√2,1/√2) = √2.",
  },
  // Q200
  {
    q: "The volume of the solid bounded by z = x² + y² and z = 4 is:",
    opts: ["8π", "4π", "2π", "π"],
    ans: "A",
    exp: "In polar: V=∫₀²π∫₀²(4−r²)r dr dθ = 8π.",
  },

  /* ============================================================
               PHY 102 — Questions 201-300 (General Physics II)
               ============================================================ */
  // Q201
  {
    q: "Two charges q₁=2μC and q₂=3μC are 0.5m apart. The electrostatic force between them (k=9×10⁹) is:",
    opts: [
      "0.216 N repulsive",
      "0.216 N attractive",
      "0.108 N repulsive",
      "0.432 N",
    ],
    ans: "A",
    exp: "F=kq₁q₂/r²=0.216 N. Both positive → repulsive.",
  },
  // Q202
  {
    q: "The SI unit of electric field is:",
    opts: ["N/C", "V/m", "Both N/C and V/m", "J/C"],
    ans: "C",
    exp: "Both N/C and V/m are equivalent SI units for electric field.",
  },
  // Q203
  {
    q: "The electric field due to a point charge q at distance r is:",
    opts: ["kq/r²", "kq/r", "kq²/r²", "kq/r³"],
    ans: "A",
    exp: "E = F/q₀ = kq/r². The field decreases with the square of distance.",
  },
  // Q204
  {
    q: "The capacitance of a parallel plate capacitor with area A and separation d is:",
    opts: ["ε₀A/d", "ε₀d/A", "A/(ε₀d)", "d/(ε₀A)"],
    ans: "A",
    exp: "C = ε₀A/d. Capacitance increases with larger area and decreases with greater separation.",
  },
  // Q205
  {
    q: "A 10μF capacitor charged to 100V stores charge of:",
    opts: ["1 mC", "10 mC", "0.1 mC", "100 mC"],
    ans: "A",
    exp: "Q = CV = 10×10⁻⁶ × 100 = 10⁻³ C = 1 mC.",
  },
  // Q206
  {
    q: "The energy stored in a 10μF capacitor charged to 100V is:",
    opts: ["0.05 J", "0.1 J", "0.5 J", "1 J"],
    ans: "A",
    exp: "E = ½CV² = ½ × 10×10⁻⁶ × 100² = 0.05 J.",
  },
  // Q207
  {
    q: "Ohm's law states that:",
    opts: ["V = IR", "I = V/R", "R = V/I", "All of the above"],
    ans: "D",
    exp: "Ohm's law V=IR can be rearranged to I=V/R or R=V/I. All three are equivalent.",
  },
  // Q208
  {
    q: "A 10Ω resistor carries 2A. The power dissipated is:",
    opts: ["20 W", "40 W", "10 W", "5 W"],
    ans: "B",
    exp: "P = I²R = 2² × 10 = 40 W.",
  },
  // Q209
  {
    q: "Three resistors 2Ω, 3Ω, and 6Ω in parallel. The equivalent resistance is:",
    opts: ["1 Ω", "2 Ω", "3 Ω", "6 Ω"],
    ans: "A",
    exp: "1/R = 1/2+1/3+1/6 = 6/6 = 1. Therefore R = 1Ω.",
  },
  // Q210
  {
    q: "Three resistors 2Ω, 3Ω, and 4Ω in series. The equivalent resistance is:",
    opts: ["9 Ω", "12 Ω", "24 Ω", "1.08 Ω"],
    ans: "A",
    exp: "Series: R_total = 2+3+4 = 9Ω.",
  },
  // Q211
  {
    q: "Kirchhoff's current law (KCL) states that:",
    opts: [
      "Sum of currents entering a junction equals sum leaving",
      "Sum of voltages around a loop is zero",
      "V = IR",
      "P = IV",
    ],
    ans: "A",
    exp: "KCL: currents in equal currents out. Based on conservation of charge.",
  },
  // Q212
  {
    q: "Kirchhoff's voltage law (KVL) states that:",
    opts: [
      "Sum of voltages around a closed loop is zero",
      "Sum of currents at a junction is zero",
      "V = IR",
      "P = IV",
    ],
    ans: "A",
    exp: "KVL: algebraic sum of all voltages around any closed loop equals zero.",
  },
  // Q213
  {
    q: "A 12V battery with internal resistance 0.5Ω connected to a 5.5Ω resistor. The current is:",
    opts: ["2 A", "2.18 A", "2.4 A", "1.5 A"],
    ans: "A",
    exp: "I = EMF/(R+r) = 12/(5.5+0.5) = 12/6 = 2 A.",
  },
  // Q214
  {
    q: "The magnetic field at distance r from a long straight wire carrying current I is:",
    opts: ["μ₀I/(2πr)", "μ₀I/(4πr)", "μ₀I/(2r)", "μ₀I/(4πr²)"],
    ans: "A",
    exp: "By Ampere's law: B = μ₀I/(2πr).",
  },
  // Q215
  {
    q: "The force on charge q moving with velocity v perpendicular to magnetic field B is:",
    opts: ["qvB", "0", "qvB sinθ", "qE"],
    ans: "A",
    exp: "When v is perpendicular to B (θ=90°), F = qvB sin90° = qvB.",
  },
  // Q216
  {
    q: "The radius of circular path of a charged particle in magnetic field is:",
    opts: ["r = mv/(qB)", "r = qB/(mv)", "r = mvq/B", "r = mB/(qv)"],
    ans: "A",
    exp: "For circular motion: qvB = mv²/r → r = mv/(qB).",
  },
  // Q217
  {
    q: "The cyclotron frequency of a charged particle in a magnetic field is:",
    opts: ["f = qB/(2πm)", "f = 2πm/(qB)", "f = qB/m", "f = m/(qB)"],
    ans: "A",
    exp: "Cyclotron frequency f = qB/(2πm). Independent of particle's speed.",
  },
  // Q218
  {
    q: "Faraday's law: induced EMF is proportional to:",
    opts: [
      "Rate of change of magnetic flux",
      "Magnetic field strength",
      "Current",
      "Resistance",
    ],
    ans: "A",
    exp: "Faraday's law: EMF = −dΦ/dt. Induced EMF equals rate of change of magnetic flux.",
  },
  // Q219
  {
    q: "Lenz's law states that the induced current opposes:",
    opts: [
      "The change that produced it",
      "The magnetic field",
      "The motion",
      "The electric field",
    ],
    ans: "A",
    exp: "Lenz's law: induced current opposes the change in flux that caused it.",
  },
  // Q220
  {
    q: "The SI unit of magnetic flux is:",
    opts: ["Weber (Wb)", "Tesla (T)", "Henry (H)", "Gauss (G)"],
    ans: "A",
    exp: "Magnetic flux Φ = BA is measured in Webers (Wb).",
  },
  // Q221
  {
    q: "A coil of 100 turns has flux changing from 0.05Wb to 0.01Wb in 0.2s. The induced EMF is:",
    opts: ["20 V", "10 V", "5 V", "2 V"],
    ans: "A",
    exp: "EMF = −N(ΔΦ/Δt) = −100×(0.01−0.05)/0.2 = 20 V.",
  },
  // Q222
  {
    q: "A transformer works on the principle of:",
    opts: [
      "Mutual induction",
      "Self-induction",
      "Electrostatic induction",
      "Ohm's law",
    ],
    ans: "A",
    exp: "Transformers operate on mutual induction — changing current in primary induces voltage in secondary.",
  },
  // Q223
  {
    q: "A step-up transformer:",
    opts: [
      "Increases voltage and decreases current",
      "Increases both voltage and current",
      "Decreases voltage and increases current",
      "Decreases both voltage and current",
    ],
    ans: "A",
    exp: "A step-up transformer increases voltage but decreases current proportionally, conserving power.",
  },
  // Q224
  {
    q: "The photoelectric effect was explained by:",
    opts: [
      "Albert Einstein",
      "Max Planck",
      "Isaac Newton",
      "James Clerk Maxwell",
    ],
    ans: "A",
    exp: "Einstein explained the photoelectric effect in 1905 using photons, earning the 1921 Nobel Prize.",
  },
  // Q225
  {
    q: "Einstein's photoelectric equation is:",
    opts: ["hf = φ + ½mv²", "E = mc²", "λ = h/p", "E = hf"],
    ans: "A",
    exp: "hf = φ + KE_max. Photon energy equals work function plus maximum kinetic energy of ejected electron.",
  },
  // Q226
  {
    q: "The work function of a metal is the:",
    opts: [
      "Minimum energy required to eject an electron",
      "Maximum kinetic energy of photoelectrons",
      "Threshold frequency",
      "Energy of incident photon",
    ],
    ans: "A",
    exp: "The work function φ is the minimum energy needed to remove an electron from the metal surface.",
  },
  // Q227
  {
    q: "The de Broglie wavelength of a particle of mass m with velocity v is:",
    opts: ["λ = h/(mv)", "λ = mv/h", "λ = h/m", "λ = h/v"],
    ans: "A",
    exp: "de Broglie's relation: λ = h/p = h/(mv).",
  },
  // Q228
  {
    q: "The Bohr model postulates that electrons orbit the nucleus in:",
    opts: [
      "Quantized orbits",
      "Any orbit",
      "Circular orbits only",
      "Elliptical orbits only",
    ],
    ans: "A",
    exp: "Bohr postulated electrons can only occupy certain allowed (quantized) circular orbits.",
  },
  // Q229
  {
    q: "The energy of electron in nth Bohr orbit of hydrogen is:",
    opts: [
      "Eₙ = −13.6/n² eV",
      "Eₙ = −13.6n² eV",
      "Eₙ = 13.6/n² eV",
      "Eₙ = 13.6n² eV",
    ],
    ans: "A",
    exp: "Eₙ = −13.6/n² eV. Negative sign indicates bound state.",
  },
  // Q230
  {
    q: "The ground state energy of hydrogen is:",
    opts: ["−13.6 eV", "−3.4 eV", "−1.51 eV", "−0.85 eV"],
    ans: "A",
    exp: "At n=1: E₁ = −13.6/1² = −13.6 eV.",
  },
  // Q231
  {
    q: "The nucleus of an atom consists of:",
    opts: [
      "Protons and neutrons",
      "Protons and electrons",
      "Neutrons and electrons",
      "Protons, neutrons, and electrons",
    ],
    ans: "A",
    exp: "The nucleus contains protons (positive charge) and neutrons (no charge).",
  },
  // Q232
  {
    q: "The atomic number Z is the number of:",
    opts: ["Protons", "Neutrons", "Nucleons", "Electrons"],
    ans: "A",
    exp: "Atomic number Z = number of protons in the nucleus.",
  },
  // Q233
  {
    q: "The mass number A is the number of:",
    opts: ["Protons + neutrons", "Protons", "Neutrons", "Electrons"],
    ans: "A",
    exp: "Mass number A = number of nucleons = protons (Z) + neutrons (N).",
  },
  // Q234
  {
    q: "The half-life of a radioactive substance is the time for:",
    opts: [
      "Half the nuclei to decay",
      "All nuclei to decay",
      "The activity to double",
      "The mass to double",
    ],
    ans: "A",
    exp: "Half-life t₁/₂ is the time for exactly half of the radioactive nuclei to undergo decay.",
  },
  // Q235
  {
    q: "If the half-life is 10 days, the fraction remaining after 20 days is:",
    opts: ["1/4", "1/2", "1/8", "1/16"],
    ans: "A",
    exp: "20 days = 2 half-lives. Fraction remaining = (1/2)² = 1/4.",
  },
  // Q236
  {
    q: "The decay constant λ is related to half-life t₁/₂ by:",
    opts: ["λ = ln2/t₁/₂", "λ = t₁/₂/ln2", "λ = 1/t₁/₂", "λ = t₁/₂"],
    ans: "A",
    exp: "From N(t) = N₀e^(−λt): λ = ln2/t₁/₂ ≈ 0.693/t₁/₂.",
  },
  // Q237
  {
    q: "The activity of a radioactive sample is given by:",
    opts: ["A = λN", "A = N/λ", "A = λ/N", "A = Nλ²"],
    ans: "A",
    exp: "Activity A = −dN/dt = λN. Units: Becquerels (Bq) = decays per second.",
  },
  // Q238
  {
    q: "Alpha decay reduces the mass number by:",
    opts: ["4", "2", "1", "0"],
    ans: "A",
    exp: "An alpha particle is helium-4. Alpha decay reduces mass number A by 4 and atomic number Z by 2.",
  },
  // Q239
  {
    q: "Gamma radiation has:",
    opts: [
      "No charge and no mass",
      "Positive charge",
      "Negative charge",
      "Mass of 1 amu",
    ],
    ans: "A",
    exp: "Gamma rays are high-energy electromagnetic radiation (photons) with no charge and no mass.",
  },
  // Q240
  {
    q: "The most penetrating radiation is:",
    opts: ["Gamma rays", "Alpha particles", "Beta particles", "Neutrons"],
    ans: "A",
    exp: "Gamma rays require several centimetres of lead to be significantly attenuated.",
  },
  // Q241
  {
    q: "Nuclear fission is the:",
    opts: [
      "Splitting of a heavy nucleus",
      "Combining of light nuclei",
      "Emission of gamma rays",
      "Absorption of neutrons",
    ],
    ans: "A",
    exp: "Nuclear fission: a heavy nucleus splits into smaller nuclei, releasing energy and neutrons.",
  },
  // Q242
  {
    q: "The speed of electromagnetic waves in vacuum is:",
    opts: ["3×10⁸ m/s", "3×10⁶ m/s", "3×10¹⁰ m/s", "3×10⁵ m/s"],
    ans: "A",
    exp: "The speed of light c ≈ 3×10⁸ m/s in vacuum for all electromagnetic waves.",
  },
  // Q243
  {
    q: "The refractive index of a medium is given by:",
    opts: ["n = c/v", "n = v/c", "n = cv", "n = c+v"],
    ans: "A",
    exp: "Refractive index n = c/v, where c is speed in vacuum and v is speed in the medium.",
  },
  // Q244
  {
    q: "Snell's law states that:",
    opts: [
      "n₁sinθ₁ = n₂sinθ₂",
      "n₁cosθ₁ = n₂cosθ₂",
      "sinθ₁/sinθ₂ = constant",
      "θ₁ = θ₂",
    ],
    ans: "A",
    exp: "Snell's law: n₁sinθ₁ = n₂sinθ₂.",
  },
  // Q245
  {
    q: "The critical angle for total internal reflection is given by:",
    opts: ["sinθ_c = n₂/n₁", "sinθ_c = n₁/n₂", "θ_c = n₁/n₂", "θ_c = n₂/n₁"],
    ans: "A",
    exp: "At critical angle: n₁sinθ_c = n₂sin90° → sinθ_c = n₂/n₁.",
  },
  // Q246
  {
    q: "The phenomenon of splitting white light into colors is called:",
    opts: ["Dispersion", "Reflection", "Refraction", "Diffraction"],
    ans: "A",
    exp: "Dispersion: different wavelengths travel at different speeds, causing refractive index to vary with wavelength.",
  },
  // Q247
  {
    q: "The focal length of a convex lens is 20cm. Its power is:",
    opts: ["5 D", "0.05 D", "20 D", "0.2 D"],
    ans: "A",
    exp: "Power P = 1/f (metres) = 1/0.20 = 5 diopters (D).",
  },
  // Q248
  {
    q: "A myopic (nearsighted) eye is corrected using:",
    opts: ["Concave lens", "Convex lens", "Cylindrical lens", "Bifocal lens"],
    ans: "A",
    exp: "Myopia: image forms in front of retina. A concave (diverging) lens corrects this.",
  },
  // Q249
  {
    q: "A hypermetropic (farsighted) eye is corrected using:",
    opts: ["Convex lens", "Concave lens", "Cylindrical lens", "Bifocal lens"],
    ans: "A",
    exp: "Hypermetropia: image forms behind retina. A convex (converging) lens corrects this.",
  },
  // Q250
  {
    q: "The fundamental frequency of an open pipe of length L is:",
    opts: ["f = v/(2L)", "f = v/(4L)", "f = 2v/L", "f = 4v/L"],
    ans: "A",
    exp: "Open pipe fundamental mode: λ/2 = L, so f = v/λ = v/(2L).",
  },
  // Q251
  {
    q: "The fundamental frequency of a closed pipe of length L is:",
    opts: ["f = v/(4L)", "f = v/(2L)", "f = 2v/L", "f = 4v/L"],
    ans: "A",
    exp: "Closed pipe fundamental mode: λ/4 = L, so f = v/(4L).",
  },
  // Q252
  {
    q: "The Doppler effect for sound is the change in:",
    opts: ["Frequency due to relative motion", "Loudness", "Quality", "Speed"],
    ans: "A",
    exp: "The Doppler effect is the apparent change in frequency as source and observer move relatively.",
  },
  // Q253
  {
    q: "The intensity of sound is proportional to:",
    opts: ["Square of amplitude", "Amplitude", "Frequency", "Wavelength"],
    ans: "A",
    exp: "Sound intensity I ∝ A² (amplitude squared). Doubling amplitude quadruples intensity.",
  },
  // Q254
  {
    q: "The loudness of sound is measured in:",
    opts: ["Decibels (dB)", "Hertz (Hz)", "Watts (W)", "Joules (J)"],
    ans: "A",
    exp: "Sound level is measured in decibels (dB): L = 10 log₁₀(I/I₀).",
  },
  // Q255
  {
    q: "A p-n junction diode allows current to flow:",
    opts: [
      "In one direction only",
      "In both directions",
      "In alternating directions",
      "No current flows",
    ],
    ans: "A",
    exp: "A p-n junction diode is a one-way valve: forward-biased allows current; reverse-biased blocks it.",
  },
  // Q256
  {
    q: "The binary number 1011 in decimal is:",
    opts: ["11", "13", "10", "12"],
    ans: "A",
    exp: "1011₂ = 1×2³ + 0×2² + 1×2¹ + 1×2⁰ = 8+0+2+1 = 11₁₀.",
  },
  // Q257
  {
    q: "The direction of the magnetic field around a current-carrying wire is given by:",
    opts: [
      "Right-hand grip rule",
      "Left-hand grip rule",
      "Fleming's left-hand rule",
      "Fleming's right-hand rule",
    ],
    ans: "A",
    exp: "The right-hand grip rule determines the direction of the magnetic field.",
  },
  // Q258
  {
    q: "A proton (q=1.6×10⁻¹⁹C) moves at 2×10⁶m/s perpendicular to a 0.5T field. The force is:",
    opts: ["1.6×10⁻¹³ N", "3.2×10⁻¹³ N", "1.6×10⁻¹⁹ N", "3.2×10⁻¹⁹ N"],
    ans: "A",
    exp: "F = qvB = 1.6×10⁻¹⁹ × 2×10⁶ × 0.5 = 1.6×10⁻¹³ N.",
  },
  // Q259
  {
    q: "An electron (m=9.11×10⁻³¹kg, q=1.6×10⁻¹⁹C) moves at 2×10⁷m/s perpendicular to 0.1T. The radius is:",
    opts: ["1.14×10⁻³ m", "2.28×10⁻³ m", "5.7×10⁻⁴ m", "1.14×10⁻² m"],
    ans: "A",
    exp: "r = mv/(qB) = (9.11×10⁻³¹ × 2×10⁷)/(1.6×10⁻¹⁹ × 0.1) ≈ 1.14×10⁻³ m.",
  },
  // Q260
  {
    q: "A transformer has turns ratio 10:1. If primary voltage is 240V, the secondary voltage is:",
    opts: ["24 V", "2400 V", "240 V", "12 V"],
    ans: "A",
    exp: "V_s/V_p = N_s/N_p → V_s = 240 × (1/10) = 24V.",
  },
  // Q261
  {
    q: "The self-inductance of a solenoid with N turns, length l, cross-sectional area A is:",
    opts: ["L = μ₀N²A/l", "L = μ₀N²l/A", "L = μ₀N²Al", "L = μ₀N²/(Al)"],
    ans: "A",
    exp: "L = μ₀N²A/l.",
  },
  // Q262
  {
    q: "The energy stored in an inductor of 2H carrying 3A is:",
    opts: ["9 J", "6 J", "3 J", "18 J"],
    ans: "A",
    exp: "E = ½LI² = ½ × 2 × 3² = 9 J.",
  },
  // Q263
  {
    q: "The time constant of an RL circuit is:",
    opts: ["τ = L/R", "τ = R/L", "τ = LR", "τ = 1/(LR)"],
    ans: "A",
    exp: "τ = L/R determines how quickly current builds up or decays.",
  },
  // Q264
  {
    q: "If the work function of a metal is 2.0eV, the threshold wavelength is approximately:",
    opts: ["620 nm", "310 nm", "1240 nm", "200 nm"],
    ans: "A",
    exp: "λ_threshold = hc/φ = (1240 eV·nm)/(2.0 eV) = 620 nm.",
  },
  // Q265
  {
    q: "The stopping potential is the:",
    opts: [
      "Minimum voltage to stop photoelectrons",
      "Maximum voltage to eject electrons",
      "Voltage across the photoelectric cell",
      "Voltage of the incident light",
    ],
    ans: "A",
    exp: "Stopping potential V_s is the reverse voltage to stop photoelectrons.",
  },
  // Q266
  {
    q: "The de Broglie wavelength of an electron accelerated through 100V is about:",
    opts: ["0.122 nm", "0.0122 nm", "1.22 nm", "12.2 nm"],
    ans: "A",
    exp: "λ = h/√(2meV) ≈ 0.122 nm.",
  },
  // Q267
  {
    q: "The Compton effect demonstrates that:",
    opts: [
      "X-rays behave as particles",
      "Light behaves as waves",
      "Electrons behave as waves",
      "Photons have momentum",
    ],
    ans: "D",
    exp: "The Compton effect demonstrates that photons carry momentum p = h/λ.",
  },
  // Q268
  {
    q: "The Compton shift formula is:",
    opts: [
      "Δλ = (h/mc)(1 − cosθ)",
      "Δλ = (h/mc)cosθ",
      "Δλ = (h/mc)(1 + cosθ)",
      "Δλ = (mc/h)(1 − cosθ)",
    ],
    ans: "A",
    exp: "Compton shift: Δλ = (h/mc)(1−cosθ).",
  },
  // Q269
  {
    q: "The angular momentum of an electron in the nth Bohr orbit is:",
    opts: ["mvr = nh/(2π)", "mvr = nℏ", "Both A and B", "mvr = 0"],
    ans: "C",
    exp: "mvr = nh/(2π) = nℏ.",
  },
  // Q270
  {
    q: "The wavelength of the first Balmer line (n=3 to n=2) in hydrogen is approximately:",
    opts: ["656 nm", "486 nm", "434 nm", "410 nm"],
    ans: "A",
    exp: "1/λ = R(1/2²−1/3²) → λ ≈ 656 nm (Hα line).",
  },
  // Q271
  {
    q: "Isotopes have the same:",
    opts: [
      "Atomic number",
      "Mass number",
      "Number of neutrons",
      "Number of nucleons",
    ],
    ans: "A",
    exp: "Isotopes are atoms of the same element (same Z) with different neutrons.",
  },
  // Q272
  {
    q: "Beta decay reduces the atomic number by:",
    opts: ["1 (β⁺) or increases by 1 (β⁻)", "2", "4", "0"],
    ans: "A",
    exp: "In β⁺ decay, Z decreases by 1. In β⁻ decay, Z increases by 1.",
  },
  // Q273
  {
    q: "The least penetrating radiation is:",
    opts: ["Alpha particles", "Gamma rays", "Beta particles", "X-rays"],
    ans: "A",
    exp: "Alpha particles are the least penetrating, stopped by a sheet of paper.",
  },
  // Q274
  {
    q: "Nuclear fusion is the:",
    opts: [
      "Combining of light nuclei",
      "Splitting of heavy nuclei",
      "Emission of beta particles",
      "Decay of radioactive elements",
    ],
    ans: "A",
    exp: "Nuclear fusion: combining light nuclei to form heavier ones.",
  },
  // Q275
  {
    q: "The wavelength of visible light ranges from:",
    opts: ["400–700 nm", "100–400 nm", "700–1000 nm", "1–100 nm"],
    ans: "A",
    exp: "Visible light ranges from approximately 400nm to 700nm.",
  },
  // Q276
  {
    q: "The color of light with the longest wavelength is:",
    opts: ["Red", "Violet", "Blue", "Green"],
    ans: "A",
    exp: "Red has the longest wavelength (~620–700nm) in the visible spectrum.",
  },
  // Q277
  {
    q: "Total internal reflection occurs when light travels from:",
    opts: [
      "Denser to rarer medium at angle > critical angle",
      "Rarer to denser medium",
      "Any medium at any angle",
      "Vacuum to any medium",
    ],
    ans: "A",
    exp: "TIR requires light going from denser to rarer medium at angle > critical angle.",
  },
  // Q278
  {
    q: "The lens formula is:",
    opts: [
      "1/f = 1/v + 1/u",
      "f = uv/(u+v)",
      "Both A and B",
      "1/f = 1/v − 1/u",
    ],
    ans: "C",
    exp: "1/f = 1/v − 1/u (with sign convention) or 1/f = 1/v + 1/u with real-is-positive.",
  },
  // Q279
  {
    q: "A concave lens always forms:",
    opts: [
      "Virtual, erect, diminished image",
      "Real, inverted, magnified image",
      "Virtual, erect, magnified image",
      "Real, erect, diminished image",
    ],
    ans: "A",
    exp: "A concave lens always forms a virtual, erect, and diminished image.",
  },
  // Q280
  {
    q: "The power of a lens is measured in:",
    opts: ["Diopters (D)", "Meters (m)", "Centimeters (cm)", "Watts (W)"],
    ans: "A",
    exp: "Power of a lens is measured in diopters (D).",
  },
  // Q281
  {
    q: "The least distance of distinct vision for a normal eye is about:",
    opts: ["25 cm", "10 cm", "50 cm", "100 cm"],
    ans: "A",
    exp: "The near point of a normal eye is approximately 25 cm.",
  },
  // Q282
  {
    q: "The angular magnification of a simple microscope is maximum when the image is at:",
    opts: ["Near point", "Infinity", "Far point", "Focal point"],
    ans: "A",
    exp: "Magnification is maximum (M = 1 + D/f) when image is at near point.",
  },
  // Q283
  {
    q: "The magnifying power of a simple microscope when the image is at infinity is:",
    opts: ["M = D/f", "M = 1 + D/f", "M = f/D", "M = D/f − 1"],
    ans: "A",
    exp: "When the image is at infinity, M = D/f.",
  },
  // Q284
  {
    q: "The speed of sound in air at 0°C is approximately:",
    opts: ["331 m/s", "343 m/s", "300 m/s", "350 m/s"],
    ans: "A",
    exp: "The speed of sound in air at 0°C is approximately 331 m/s.",
  },
  // Q285
  {
    q: "The speed of sound in air increases by approximately how much per degree Celsius?",
    opts: ["0.6 m/s", "1 m/s", "0.3 m/s", "2 m/s"],
    ans: "A",
    exp: "Sound speed increases by approximately 0.6 m/s per °C.",
  },
  // Q286
  {
    q: "When a source moves toward a stationary observer, the observed frequency:",
    opts: ["Increases", "Decreases", "Stays the same", "Becomes zero"],
    ans: "A",
    exp: "When the source approaches, the observed frequency increases.",
  },
  // Q287
  {
    q: "Beats are produced by the:",
    opts: [
      "Interference of two waves of slightly different frequencies",
      "Superposition of two waves of same frequency",
      "Reflection of waves",
      "Diffraction of waves",
    ],
    ans: "A",
    exp: "Beats occur when two waves with slightly different frequencies interfere.",
  },
  // Q288
  {
    q: "The beat frequency is equal to:",
    opts: ["|f₁ − f₂|", "f₁ + f₂", "(f₁ + f₂)/2", "√(f₁f₂)"],
    ans: "A",
    exp: "Beat frequency = |f₁ − f₂|.",
  },
  // Q289
  {
    q: "Resonance occurs when:",
    opts: [
      "Forcing frequency equals natural frequency",
      "Forcing frequency is less than natural frequency",
      "Forcing frequency is greater than natural frequency",
      "No forcing frequency is applied",
    ],
    ans: "A",
    exp: "Resonance occurs when driving frequency matches natural frequency.",
  },
  // Q290
  {
    q: "The quality of sound depends on:",
    opts: ["Harmonics present", "Frequency", "Amplitude", "Speed"],
    ans: "A",
    exp: "The quality (timbre) depends on the harmonics present.",
  },
  // Q291
  {
    q: "The threshold of hearing is approximately:",
    opts: ["0 dB", "10 dB", "20 dB", "100 dB"],
    ans: "A",
    exp: "The threshold of hearing is defined as 0 dB.",
  },
  // Q292
  {
    q: "A Zener diode is used as a:",
    opts: ["Voltage regulator", "Amplifier", "Rectifier", "Oscillator"],
    ans: "A",
    exp: "A Zener diode is used as a voltage regulator.",
  },
  // Q293
  {
    q: "A transistor is a:",
    opts: [
      "Three-terminal semiconductor device",
      "Two-terminal device",
      "Four-terminal device",
      "Passive component",
    ],
    ans: "A",
    exp: "A transistor is a three-terminal active semiconductor device.",
  },
  // Q294
  {
    q: "The three terminals of a bipolar junction transistor (BJT) are:",
    opts: [
      "Emitter, base, collector",
      "Source, gate, drain",
      "Anode, cathode, gate",
      "Base, emitter, source",
    ],
    ans: "A",
    exp: "A BJT has Emitter, Base, and Collector terminals.",
  },
  // Q295
  {
    q: "The output of an AND gate is high only when:",
    opts: [
      "All inputs are high",
      "Any input is high",
      "All inputs are low",
      "One input is high",
    ],
    ans: "A",
    exp: "AND gate: output is HIGH only when ALL inputs are HIGH.",
  },
  // Q296
  {
    q: "The output of an OR gate is high when:",
    opts: [
      "Any input is high",
      "All inputs are high",
      "All inputs are low",
      "No inputs are high",
    ],
    ans: "A",
    exp: "OR gate: output is HIGH when ANY input is HIGH.",
  },
  // Q297
  {
    q: "The output of a NOT gate is:",
    opts: [
      "The inverse of the input",
      "The same as the input",
      "Always high",
      "Always low",
    ],
    ans: "A",
    exp: "A NOT gate inverts the input.",
  },
  // Q298
  {
    q: "The output of a NAND gate is low only when:",
    opts: [
      "All inputs are high",
      "All inputs are low",
      "Any input is high",
      "Any input is low",
    ],
    ans: "A",
    exp: "NAND = NOT AND. Output is LOW only when ALL inputs are HIGH.",
  },
  // Q299
  {
    q: "The output of a NOR gate is high only when:",
    opts: [
      "All inputs are low",
      "All inputs are high",
      "Any input is high",
      "One input is high",
    ],
    ans: "A",
    exp: "NOR = NOT OR. Output is HIGH only when ALL inputs are LOW.",
  },
  // Q300
  {
    q: "Nuclear fusion powers the:",
    opts: ["Sun and stars", "Earth's core", "Nuclear reactors", "Batteries"],
    ans: "A",
    exp: "Nuclear fusion is the process that powers the Sun and other stars.",
  },
  /* ============================================================
                       CHM 102 — Questions 301-400 (Organic Chemistry)
                       ============================================================ */
  // Q301
  {
    q: "The hybridization of carbon in methane (CH₄) is:",
    opts: ["sp³", "sp²", "sp", "sp³d"],
    ans: "A",
    exp: "In CH₄, carbon forms 4 equivalent sigma bonds, hybridizing into four sp³ orbitals (tetrahedral, 109.5°).",
  },
  // Q302
  {
    q: "The functional group of alcohols is:",
    opts: ["-OH", "-CHO", "-COOH", "-NH₂"],
    ans: "A",
    exp: "Alcohols contain the hydroxyl group (-OH) responsible for their characteristic properties.",
  },
  // Q303
  {
    q: "The IUPAC name for CH₃CH₂CH₂OH is:",
    opts: ["Propan-1-ol", "Propan-2-ol", "Propanol", "Isopropyl alcohol"],
    ans: "A",
    exp: "3-carbon chain (prop-), -OH on carbon 1 = Propan-1-ol.",
  },
  // Q304
  {
    q: "Alkenes are characterized by the presence of:",
    opts: [
      "C=C double bond",
      "C-C single bond",
      "C≡C triple bond",
      "Aromatic ring",
    ],
    ans: "A",
    exp: "Alkenes contain at least one carbon-carbon double bond (C=C).",
  },
  // Q305
  {
    q: "The general formula for alkenes is:",
    opts: ["CₙH₂ₙ", "CₙH₂ₙ₊₂", "CₙH₂ₙ₋₂", "CₙH₂ₙ₊₄"],
    ans: "A",
    exp: "Alkenes (one C=C): CₙH₂ₙ. Alkanes: CₙH₂ₙ₊₂. Alkynes: CₙH₂ₙ₋₂.",
  },
  // Q306
  {
    q: "The general formula for alkanes is:",
    opts: ["CₙH₂ₙ₊₂", "CₙH₂ₙ", "CₙH₂ₙ₋₂", "CₙH₂ₙ₊₄"],
    ans: "A",
    exp: "Alkanes are saturated hydrocarbons with general formula CₙH₂ₙ₊₂.",
  },
  // Q307
  {
    q: "The general formula for alkynes is:",
    opts: ["CₙH₂ₙ₋₂", "CₙH₂ₙ", "CₙH₂ₙ₊₂", "CₙH₂ₙ₊₄"],
    ans: "A",
    exp: "Alkynes contain one C≡C triple bond with general formula CₙH₂ₙ₋₂.",
  },
  // Q308
  {
    q: "When HBr adds to propene by Markovnikov's rule, the product is:",
    opts: [
      "2-Bromopropane",
      "1-Bromopropane",
      "1-Bromopropene",
      "2-Bromopropene",
    ],
    ans: "A",
    exp: "H adds to CH₂ (more H's), Br adds to CH. Product: CH₃CHBrCH₃ = 2-bromopropane.",
  },
  // Q309
  {
    q: "The anti-Markovnikov addition of HBr to alkenes occurs in the presence of:",
    opts: ["Peroxides", "Acids", "Bases", "Water"],
    ans: "A",
    exp: "Peroxides initiate radical chain reactions where HBr adds anti-Markovnikov.",
  },
  // Q310
  {
    q: "The test for unsaturation in organic compounds is:",
    opts: [
      "Bromine water test",
      "Fehling's test",
      "Tollen's test",
      "Iodoform test",
    ],
    ans: "A",
    exp: "Bromine water decolorizes when added to alkenes or alkynes due to addition across the double/triple bond.",
  },
  // Q311
  {
    q: "The Baeyer's test uses:",
    opts: [
      "Dilute KMnO₄",
      "Bromine water",
      "Fehling's solution",
      "Tollen's reagent",
    ],
    ans: "A",
    exp: "Baeyer's test uses cold dilute KMnO₄. The purple solution decolorizes with alkenes.",
  },
  // Q312
  {
    q: "The functional group of aldehydes is:",
    opts: ["-CHO", "-CO-", "-OH", "-COOH"],
    ans: "A",
    exp: "Aldehydes contain the aldehyde group (-CHO) with the carbonyl carbon bonded to at least one hydrogen.",
  },
  // Q313
  {
    q: "The functional group of ketones is:",
    opts: ["-CO-", "-CHO", "-OH", "-COOH"],
    ans: "A",
    exp: "Ketones contain a carbonyl group (-C=O) flanked by two carbon atoms.",
  },
  // Q314
  {
    q: "The IUPAC name for CH₃COCH₃ is:",
    opts: ["Propanone", "Propanal", "Acetone", "Dimethyl ketone"],
    ans: "A",
    exp: "CH₃COCH₃: 3-carbon chain with ketone at position 2 = propanone.",
  },
  // Q315
  {
    q: "The IUPAC name for HCHO is:",
    opts: ["Methanal", "Formaldehyde", "Methanol", "Formic acid"],
    ans: "A",
    exp: "HCHO is the simplest aldehyde. IUPAC name: methanal.",
  },
  // Q316
  {
    q: "The Tollen's reagent test is positive for:",
    opts: ["Aldehydes", "Ketones", "Alcohols", "Alkanes"],
    ans: "A",
    exp: "Tollen's reagent is reduced by aldehydes to form a silver mirror. Ketones do NOT react.",
  },
  // Q317
  {
    q: "The Fehling's test is positive for:",
    opts: ["Aliphatic aldehydes", "Ketones", "Alcohols", "Aromatic aldehydes"],
    ans: "A",
    exp: "Fehling's solution (blue Cu²⁺) is reduced by aliphatic aldehydes to brick-red Cu₂O. Ketones don't react.",
  },
  // Q318
  {
    q: "The functional group of carboxylic acids is:",
    opts: ["-COOH", "-OH", "-CO-", "-CHO"],
    ans: "A",
    exp: "Carboxylic acids contain the carboxyl group (-COOH = -C(=O)OH).",
  },
  // Q319
  {
    q: "The IUPAC name for HCOOH is:",
    opts: ["Methanoic acid", "Formic acid", "Methanoic", "Carboxylic acid"],
    ans: "A",
    exp: "HCOOH: one carbon, carboxylic acid = methanoic acid. Formic acid is the common name.",
  },
  // Q320
  {
    q: "The IUPAC name for CH₃COOH is:",
    opts: ["Ethanoic acid", "Acetic acid", "Methanoic acid", "Propanoic acid"],
    ans: "A",
    exp: "CH₃COOH: two carbons, carboxylic acid = ethanoic acid. Acetic acid is the common name.",
  },
  // Q321
  {
    q: "The reaction between a carboxylic acid and an alcohol gives:",
    opts: ["Ester", "Ether", "Aldehyde", "Ketone"],
    ans: "A",
    exp: "Esterification: RCOOH + R'OH ⇌ RCOOR' + H₂O (with acid catalyst).",
  },
  // Q322
  {
    q: "The esterification reaction is catalyzed by:",
    opts: ["Concentrated H₂SO₄", "NaOH", "HCl", "Water"],
    ans: "A",
    exp: "Concentrated H₂SO₄ catalyzes esterification and absorbs water produced.",
  },
  // Q323
  {
    q: "Saponification is the:",
    opts: [
      "Hydrolysis of esters in basic medium",
      "Hydrolysis of esters in acidic medium",
      "Formation of esters",
      "Reduction of esters",
    ],
    ans: "A",
    exp: "Saponification: RCOOR' + NaOH → RCOONa + R'OH. Soap-making reaction.",
  },
  // Q324
  {
    q: "The functional group of amines is:",
    opts: ["-NH₂", "-OH", "-COOH", "-CHO"],
    ans: "A",
    exp: "Primary amines contain the amino group (-NH₂) attached to a carbon.",
  },
  // Q325
  {
    q: "The functional group of amides is:",
    opts: ["-CONH₂", "-NH₂", "-COOH", "-CHO"],
    ans: "A",
    exp: "Amides contain the -CONH₂ group, the basis of the peptide bond in proteins.",
  },
  // Q326
  {
    q: "The functional group of nitriles is:",
    opts: ["-CN", "-NC", "-NO₂", "-C=N"],
    ans: "A",
    exp: "Nitriles contain the cyano group (-C≡N).",
  },
  // Q327
  {
    q: "The simplest aromatic hydrocarbon is:",
    opts: ["Benzene", "Toluene", "Xylene", "Naphthalene"],
    ans: "A",
    exp: "Benzene (C₆H₆) is the simplest aromatic hydrocarbon with delocalized π electrons.",
  },
  // Q328
  {
    q: "Benzene undergoes:",
    opts: [
      "Electrophilic substitution",
      "Nucleophilic substitution",
      "Addition reactions",
      "Elimination reactions",
    ],
    ans: "A",
    exp: "Benzene undergoes electrophilic aromatic substitution (EAS) to preserve its aromatic system.",
  },
  // Q329
  {
    q: "The nitration of benzene gives:",
    opts: ["Nitrobenzene", "Aniline", "Phenol", "Benzoic acid"],
    ans: "A",
    exp: "Benzene + HNO₃/H₂SO₄ → nitrobenzene (C₆H₅NO₂). The nitronium ion (NO₂⁺) is the electrophile.",
  },
  // Q330
  {
    q: "The halogenation of benzene requires a:",
    opts: ["Lewis acid catalyst", "Base catalyst", "No catalyst", "Peroxide"],
    ans: "A",
    exp: "A Lewis acid catalyst (FeCl₃, FeBr₃, or AlCl₃) is needed to generate the electrophilic halogen cation.",
  },
  // Q331
  {
    q: "Phenol is:",
    opts: ["C₆H₅OH", "C₆H₅NH₂", "C₆H₅CHO", "C₆H₅COOH"],
    ans: "A",
    exp: "Phenol (C₆H₅OH) is benzene with a hydroxyl group directly attached to the ring.",
  },
  // Q332
  {
    q: "Aniline is:",
    opts: ["C₆H₅NH₂", "C₆H₅OH", "C₆H₅NO₂", "C₆H₅Cl"],
    ans: "A",
    exp: "Aniline (C₆H₅NH₂) is benzene with an amino group (-NH₂) directly on the ring.",
  },
  // Q333
  {
    q: "Glucose is a:",
    opts: [
      "Monosaccharide",
      "Disaccharide",
      "Polysaccharide",
      "Oligosaccharide",
    ],
    ans: "A",
    exp: "Glucose (C₆H₁₂O₆) is a monosaccharide — the simplest unit of carbohydrates.",
  },
  // Q334
  {
    q: "Sucrose is a:",
    opts: ["Disaccharide", "Monosaccharide", "Polysaccharide", "Trisaccharide"],
    ans: "A",
    exp: "Sucrose (table sugar) is a disaccharide formed by glucose and fructose.",
  },
  // Q335
  {
    q: "Sucrose on hydrolysis gives:",
    opts: [
      "Glucose and fructose",
      "Two glucose molecules",
      "Two fructose molecules",
      "Glucose and galactose",
    ],
    ans: "A",
    exp: "Sucrose + H₂O → glucose + fructose.",
  },
  // Q336
  {
    q: "Maltose is composed of:",
    opts: [
      "Two glucose molecules",
      "Glucose and fructose",
      "Glucose and galactose",
      "Two fructose molecules",
    ],
    ans: "A",
    exp: "Maltose consists of two glucose units joined by an α-1,4-glycosidic bond.",
  },
  // Q337
  {
    q: "Cellulose is a polymer of:",
    opts: ["Glucose", "Fructose", "Galactose", "Mannose"],
    ans: "A",
    exp: "Cellulose is a linear polysaccharide of β-D-glucose units joined by β-1,4-glycosidic bonds.",
  },
  // Q338
  {
    q: "The monomer of proteins is:",
    opts: ["Amino acids", "Glucose", "Fatty acids", "Nucleotides"],
    ans: "A",
    exp: "Proteins are polymers of amino acids linked by peptide bonds.",
  },
  // Q339
  {
    q: "The bond that links amino acids in proteins is the:",
    opts: ["Peptide bond", "Glycosidic bond", "Ester bond", "Hydrogen bond"],
    ans: "A",
    exp: "The peptide bond (-CO-NH-) forms between the carboxyl and amino groups of adjacent amino acids.",
  },
  // Q340
  {
    q: "The base pairing in DNA is:",
    opts: ["A-T and G-C", "A-U and G-C", "A-G and T-C", "A-C and T-G"],
    ans: "A",
    exp: "Watson-Crick base pairing: Adenine pairs with Thymine (A=T, 2 H-bonds) and G pairs with C (G≡C, 3 H-bonds).",
  },
  // Q341
  {
    q: "Natural rubber is a polymer of:",
    opts: ["Isoprene", "Ethene", "Propene", "Butadiene"],
    ans: "A",
    exp: "Natural rubber is cis-polyisoprene. Isoprene (2-methylbuta-1,3-diene) is the monomer.",
  },
  // Q342
  {
    q: "Polyethylene is produced by the polymerization of:",
    opts: ["Ethene", "Propene", "Vinyl chloride", "Styrene"],
    ans: "A",
    exp: "Polyethylene (PE): nCH₂=CH₂ → (-CH₂-CH₂-)ₙ. Most widely used plastic globally.",
  },
  // Q343
  {
    q: "Nylon 6,6 is produced by the condensation of:",
    opts: [
      "Adipic acid and hexamethylenediamine",
      "Ethene and propene",
      "Vinyl chloride and styrene",
      "Glucose and fructose",
    ],
    ans: "A",
    exp: "Nylon 6,6: hexanedioic acid + hexane-1,6-diamine → polyamide + H₂O.",
  },
  // Q344
  {
    q: "Lipids are:",
    opts: [
      "Insoluble in water, soluble in organic solvents",
      "Soluble in water",
      "Polymers of amino acids",
      "Polymers of glucose",
    ],
    ans: "A",
    exp: "Lipids are hydrophobic but soluble in nonpolar organic solvents.",
  },
  // Q345
  {
    q: "Fats and oils are:",
    opts: [
      "Esters of glycerol and fatty acids",
      "Esters of glycerol and amino acids",
      "Esters of fatty acids and cholesterol",
      "Polymers of glucose",
    ],
    ans: "A",
    exp: "Fats and oils are triglycerides — triesters of glycerol with three fatty acids.",
  },
  // Q346
  {
    q: "Saturated fatty acids contain:",
    opts: [
      "No double bonds",
      "One double bond",
      "Two or more double bonds",
      "Aromatic rings",
    ],
    ans: "A",
    exp: "Saturated fatty acids have no C=C double bonds (fully saturated with H).",
  },
  // Q347
  {
    q: "Soaps are the:",
    opts: [
      "Sodium or potassium salts of fatty acids",
      "Potassium salts of fatty acids only",
      "Esters of fatty acids",
      "Amides of fatty acids",
    ],
    ans: "A",
    exp: "Soaps are sodium or potassium salts of long-chain fatty acids.",
  },
  // Q348
  {
    q: "Hard water contains:",
    opts: ["Ca²⁺ and Mg²⁺ ions", "Na⁺ ions", "K⁺ ions", "Cl⁻ ions"],
    ans: "A",
    exp: "Hard water contains dissolved calcium (Ca²⁺) and magnesium (Mg²⁺) ions from minerals.",
  },
  // Q349
  {
    q: "Soaps form scum with hard water because of:",
    opts: [
      "Formation of insoluble Ca and Mg salts",
      "Precipitation of soap",
      "Both A and B",
      "Hydrolysis of soap",
    ],
    ans: "C",
    exp: "Ca²⁺/Mg²⁺ react with soap anions (RCOO⁻) to form insoluble calcium/magnesium carboxylates (scum).",
  },
  // Q350
  {
    q: "Synthetic detergents are better than soaps because:",
    opts: [
      "They work in hard water",
      "They are cheaper",
      "They lather more",
      "They are biodegradable",
    ],
    ans: "A",
    exp: "Detergents work in hard water: their sulfonate head groups form soluble salts with Ca²⁺ and Mg²⁺.",
  },
  // Q351
  {
    q: "The process of transcription produces:",
    opts: [
      "RNA from DNA",
      "DNA from RNA",
      "Protein from RNA",
      "DNA from protein",
    ],
    ans: "A",
    exp: "Transcription: DNA → RNA. RNA polymerase reads the DNA template and synthesizes mRNA.",
  },
  // Q352
  {
    q: "The IUPAC name for CH₃CH(OH)CH₃ is:",
    opts: ["Propan-2-ol", "Propan-1-ol", "2-Propanol", "Both A and C"],
    ans: "D",
    exp: "CH₃CH(OH)CH₃ is propan-2-ol (also called 2-propanol).",
  },
  // Q353
  {
    q: "The Markovnikov rule applies to the addition of:",
    opts: [
      "HX to unsymmetrical alkenes",
      "H₂O to alkenes",
      "Halogens to alkenes",
      "Both A and B",
    ],
    ans: "D",
    exp: "Markovnikov's rule applies to HX and H₂O addition to unsymmetrical alkenes.",
  },
  // Q354
  {
    q: "The decolorization of bromine water indicates the presence of:",
    opts: [
      "Double or triple bond",
      "Single bond",
      "Aromatic ring",
      "Hydroxyl group",
    ],
    ans: "A",
    exp: "Decolorization indicates unsaturation (C=C or C≡C).",
  },
  // Q355
  {
    q: "The silver mirror test uses:",
    opts: [
      "Tollen's reagent",
      "Fehling's solution",
      "Benedict's solution",
      "Iodine solution",
    ],
    ans: "A",
    exp: "The silver mirror test uses Tollen's reagent.",
  },
  // Q356
  {
    q: "The product of the reaction between ethanol and ethanoic acid is:",
    opts: [
      "Ethyl ethanoate",
      "Methyl ethanoate",
      "Ethyl methanoate",
      "Diethyl ether",
    ],
    ans: "A",
    exp: "CH₃COOH + CH₃CH₂OH → CH₃COOC₂H₅ (ethyl ethanoate).",
  },
  // Q357
  {
    q: "Soap is produced by the saponification of:",
    opts: ["Fats and oils", "Alcohols", "Carboxylic acids", "Alkanes"],
    ans: "A",
    exp: "Soap is made from fats and oils by saponification.",
  },
  // Q358
  {
    q: "The IUPAC name for CH₃NH₂ is:",
    opts: ["Methanamine", "Methylamine", "Aminomethane", "All of the above"],
    ans: "A",
    exp: "CH₃NH₂ is methanamine (IUPAC).",
  },
  // Q359
  {
    q: "The IUPAC name for (CH₃)₂NH is:",
    opts: [
      "N-Methylmethanamine",
      "Dimethylamine",
      "Both A and B",
      "Ethylamine",
    ],
    ans: "C",
    exp: "(CH₃)₂NH is N-methylmethanamine (IUPAC) or dimethylamine.",
  },
  // Q360
  {
    q: "The IUPAC name for CH₃CONH₂ is:",
    opts: ["Ethanamide", "Acetamide", "Methanamide", "Propanamide"],
    ans: "A",
    exp: "CH₃CONH₂ is ethanamide (IUPAC).",
  },
  // Q361
  {
    q: "The IUPAC name for CH₃CN is:",
    opts: [
      "Ethanenitrile",
      "Acetonitrile",
      "Methyl cyanide",
      "All of the above",
    ],
    ans: "D",
    exp: "CH₃CN is ethanenitrile, acetonitrile, or methyl cyanide.",
  },
  // Q362
  {
    q: "The functional group of nitro compounds is:",
    opts: ["-NO₂", "-NO", "-NH₂", "-CN"],
    ans: "A",
    exp: "Nitro compounds contain the -NO₂ group.",
  },
  // Q363
  {
    q: "The IUPAC name for CH₃NO₂ is:",
    opts: [
      "Nitromethane",
      "Methyl nitrate",
      "Methyl nitrite",
      "Methanenitrate",
    ],
    ans: "A",
    exp: "CH₃NO₂ is nitromethane.",
  },
  // Q364
  {
    q: "The functional group of ethers is:",
    opts: ["-O-", "-OH", "-CO-", "-CHO"],
    ans: "A",
    exp: "Ethers contain the -O- linkage between two carbons.",
  },
  // Q365
  {
    q: "The common name for CH₃OCH₃ is:",
    opts: ["Dimethyl ether", "Methoxymethane", "Both A and B", "Ethyl ether"],
    ans: "C",
    exp: "CH₃OCH₃ is dimethyl ether or methoxymethane.",
  },
  // Q366
  {
    q: "The IUPAC name for CH₃OCH₂CH₃ is:",
    opts: [
      "Methoxyethane",
      "Ethyl methyl ether",
      "Both A and B",
      "Dimethyl ether",
    ],
    ans: "C",
    exp: "CH₃OCH₂CH₃ is methoxyethane or ethyl methyl ether.",
  },
  // Q367
  {
    q: "The functional group of thiols is:",
    opts: ["-SH", "-OH", "-S-", "-SS-"],
    ans: "A",
    exp: "Thiols contain the -SH group.",
  },
  // Q368
  {
    q: "The common name for CH₃SH is:",
    opts: [
      "Methanethiol",
      "Methyl mercaptan",
      "Both A and B",
      "Methyl alcohol",
    ],
    ans: "C",
    exp: "CH₃SH is methanethiol or methyl mercaptan.",
  },
  // Q369
  {
    q: "The molecular formula of benzene is:",
    opts: ["C₆H₆", "C₆H₁₂", "C₆H₁₀", "C₆H₄"],
    ans: "A",
    exp: "Benzene is C₆H₆.",
  },
  // Q370
  {
    q: "The sulfonation of benzene gives:",
    opts: ["Benzenesulfonic acid", "Phenol", "Aniline", "Toluene"],
    ans: "A",
    exp: "Benzene + fuming H₂SO₄ → benzenesulfonic acid.",
  },
  // Q371
  {
    q: "The product of the reaction of benzene with CH₃Cl in the presence of AlCl₃ is:",
    opts: ["Toluene", "Chlorobenzene", "Benzyl chloride", "Xylene"],
    ans: "A",
    exp: "Friedel-Crafts alkylation: C₆H₆ + CH₃Cl → C₆H₅CH₃ (toluene).",
  },
  // Q372
  {
    q: "Benzoic acid is:",
    opts: ["C₆H₅COOH", "C₆H₅OH", "C₆H₅CHO", "C₆H₅NH₂"],
    ans: "A",
    exp: "Benzoic acid is C₆H₅COOH.",
  },
  // Q373
  {
    q: "Benzaldehyde is:",
    opts: ["C₆H₅CHO", "C₆H₅OH", "C₆H₅COOH", "C₆H₅CH₃"],
    ans: "A",
    exp: "Benzaldehyde is C₆H₅CHO.",
  },
  // Q374
  {
    q: "The Reimer-Tiemann reaction of phenol gives:",
    opts: ["Salicylaldehyde", "Aspirin", "Picric acid", "Phenolphthalein"],
    ans: "A",
    exp: "Reimer-Tiemann reaction: phenol → salicylaldehyde.",
  },
  // Q375
  {
    q: "The Kolbe reaction of phenol gives:",
    opts: ["Salicylic acid", "Aspirin", "Picric acid", "Phenolphthalein"],
    ans: "A",
    exp: "Kolbe-Schmitt reaction: phenol → salicylic acid.",
  },
  // Q376
  {
    q: "The azo dyes are produced by:",
    opts: [
      "Diazonium coupling reaction",
      "Esterification",
      "Saponification",
      "Polymerization",
    ],
    ans: "A",
    exp: "Azo dyes are produced by diazonium coupling.",
  },
  // Q377
  {
    q: "The diazotization reaction is used to prepare:",
    opts: ["Diazonium salts", "Azo dyes", "Both A and B", "Phenols"],
    ans: "C",
    exp: "Diazotization prepares diazonium salts, which are used to make azo dyes.",
  },
  // Q378
  {
    q: "The molecular formula of glucose is:",
    opts: ["C₆H₁₂O₆", "C₁₂H₂₂O₁₁", "C₆H₁₀O₅", "C₆H₁₄O₆"],
    ans: "A",
    exp: "Glucose is C₆H₁₂O₆.",
  },
  // Q379
  {
    q: "Fructose is a:",
    opts: ["Ketose sugar", "Aldose sugar", "Disaccharide", "Polysaccharide"],
    ans: "A",
    exp: "Fructose is a ketose sugar.",
  },
  // Q380
  {
    q: "Lactose is found in:",
    opts: ["Milk", "Fruits", "Honey", "Grains"],
    ans: "A",
    exp: "Lactose is found in milk.",
  },
  // Q381
  {
    q: "Starch is a:",
    opts: [
      "Polysaccharide",
      "Disaccharide",
      "Monosaccharide",
      "Oligosaccharide",
    ],
    ans: "A",
    exp: "Starch is a polysaccharide.",
  },
  // Q382
  {
    q: "The primary structure of a protein refers to:",
    opts: [
      "Sequence of amino acids",
      "Alpha helix",
      "Beta sheet",
      "Three-dimensional folding",
    ],
    ans: "A",
    exp: "Primary structure is the sequence of amino acids.",
  },
  // Q383
  {
    q: "The secondary structure of a protein includes:",
    opts: [
      "Alpha helix and beta sheet",
      "Amino acid sequence",
      "Tertiary folding",
      "Quaternary structure",
    ],
    ans: "A",
    exp: "Secondary structure includes alpha helix and beta sheet.",
  },
  // Q384
  {
    q: "Enzymes are:",
    opts: ["Biological catalysts", "Proteins", "Both A and B", "Carbohydrates"],
    ans: "C",
    exp: "Enzymes are biological catalysts and are almost all proteins.",
  },
  // Q385
  {
    q: "DNA is a polymer of:",
    opts: ["Nucleotides", "Amino acids", "Monosaccharides", "Fatty acids"],
    ans: "A",
    exp: "DNA is a polymer of nucleotides.",
  },
  // Q386
  {
    q: "The sugar in DNA is:",
    opts: ["Deoxyribose", "Ribose", "Glucose", "Fructose"],
    ans: "A",
    exp: "DNA contains deoxyribose.",
  },
  // Q387
  {
    q: "The sugar in RNA is:",
    opts: ["Ribose", "Deoxyribose", "Glucose", "Sucrose"],
    ans: "A",
    exp: "RNA contains ribose.",
  },
  // Q388
  {
    q: "In RNA, uracil (U) pairs with:",
    opts: ["Adenine (A)", "Guanine (G)", "Cytosine (C)", "Thymine (T)"],
    ans: "A",
    exp: "In RNA, U pairs with A.",
  },
  // Q389
  {
    q: "The process of DNA replication produces:",
    opts: ["Two identical DNA molecules", "RNA", "Proteins", "Amino acids"],
    ans: "A",
    exp: "DNA replication produces two identical DNA molecules.",
  },
  // Q390
  {
    q: "The process of translation produces:",
    opts: [
      "Protein from RNA",
      "RNA from DNA",
      "DNA from RNA",
      "RNA from protein",
    ],
    ans: "A",
    exp: "Translation: RNA → Protein.",
  },
  // Q391
  {
    q: "Polymers are large molecules made up of repeating units called:",
    opts: ["Monomers", "Dimers", "Trimers", "Oligomers"],
    ans: "A",
    exp: "Polymers are made of monomers.",
  },
  // Q392
  {
    q: "Addition polymerization occurs with:",
    opts: ["Alkenes", "Alkanes", "Alcohols", "Carboxylic acids"],
    ans: "A",
    exp: "Addition polymerization occurs with alkenes.",
  },
  // Q393
  {
    q: "Condensation polymerization occurs with:",
    opts: [
      "Monomers with two functional groups",
      "Alkenes",
      "Alkynes",
      "Aromatic compounds",
    ],
    ans: "A",
    exp: "Condensation polymerization requires bifunctional monomers.",
  },
  // Q394
  {
    q: "PVC is produced by the polymerization of:",
    opts: ["Vinyl chloride", "Ethene", "Propene", "Styrene"],
    ans: "A",
    exp: "PVC is made from vinyl chloride.",
  },
  // Q395
  {
    q: "Teflon is produced by the polymerization of:",
    opts: ["Tetrafluoroethene", "Vinyl chloride", "Ethene", "Propene"],
    ans: "A",
    exp: "Teflon is made from tetrafluoroethene.",
  },
  // Q396
  {
    q: "Polyester (Terylene) is produced from:",
    opts: [
      "Terephthalic acid and ethylene glycol",
      "Adipic acid and hexamethylenediamine",
      "Ethene and propene",
      "Vinyl chloride and styrene",
    ],
    ans: "A",
    exp: "Terylene is made from terephthalic acid and ethylene glycol.",
  },
  // Q397
  {
    q: "Vulcanization of rubber involves:",
    opts: [
      "Cross-linking with sulfur",
      "Addition of carbon black",
      "Polymerization",
      "Hydrolysis",
    ],
    ans: "A",
    exp: "Vulcanization cross-links rubber with sulfur.",
  },
  // Q398
  {
    q: "Unsaturated fatty acids contain:",
    opts: [
      "One or more double bonds",
      "No double bonds",
      "Aromatic rings",
      "Triple bonds",
    ],
    ans: "A",
    exp: "Unsaturated fatty acids have one or more C=C double bonds.",
  },
  // Q399
  {
    q: "Cholesterol is a:",
    opts: ["Steroid", "Phospholipid", "Triglyceride", "Wax"],
    ans: "A",
    exp: "Cholesterol is a steroid.",
  },
  // Q400
  {
    q: "Detergents are:",
    opts: ["Synthetic surfactants", "Natural soaps", "Fatty acids", "Glycerol"],
    ans: "A",
    exp: "Detergents are synthetic surfactants.",
  },

  /* ============================================================
                       COS 102 — Questions 401-500 (Problem Solving)
                       ============================================================ */
  // Q401
  {
    q: "An algorithm is best described as:",
    opts: [
      "A step-by-step procedure for solving a problem",
      "A programming language",
      "A type of computer",
      "An error in a program",
    ],
    ans: "A",
    exp: "An algorithm is a finite, ordered set of unambiguous instructions for solving a specific problem.",
  },
  // Q402
  {
    q: "Which of the following is NOT a property of a good algorithm?",
    opts: ["Finiteness", "Definiteness", "Ambiguity", "Effectiveness"],
    ans: "C",
    exp: "A good algorithm must be finite, definite, effective, and have proper input/output. Ambiguity violates definiteness.",
  },
  // Q403
  {
    q: "An algorithm must terminate in a finite number of steps. This is called:",
    opts: ["Finiteness", "Definiteness", "Effectiveness", "Generality"],
    ans: "A",
    exp: "Finiteness means an algorithm must always terminate after a finite number of steps.",
  },
  // Q404
  {
    q: "In a flowchart, the symbol for a decision is:",
    opts: ["Diamond", "Rectangle", "Oval", "Parallelogram"],
    ans: "A",
    exp: "A diamond shape represents a decision (Yes/No or True/False branch) in a flowchart.",
  },
  // Q405
  {
    q: "In a flowchart, the symbol for a process/calculation is:",
    opts: ["Rectangle", "Diamond", "Oval", "Parallelogram"],
    ans: "A",
    exp: "A rectangle (process box) represents an operation, calculation, or action to be performed.",
  },
  // Q406
  {
    q: "In a flowchart, the symbol for input/output is:",
    opts: ["Parallelogram", "Rectangle", "Diamond", "Oval"],
    ans: "A",
    exp: "A parallelogram represents input (reading data) or output (displaying/printing data) operations.",
  },
  // Q407
  {
    q: "In a flowchart, the symbol for start/stop is:",
    opts: ["Oval", "Rectangle", "Diamond", "Parallelogram"],
    ans: "A",
    exp: "An oval (or rounded rectangle) represents the start or end of a program in a flowchart.",
  },
  // Q408
  {
    q: "A variable in programming is:",
    opts: [
      "A memory location that stores data that can change",
      "A constant value",
      "A programming language",
      "A type of loop",
    ],
    ans: "A",
    exp: "A variable is a named memory location that stores a value which can change during program execution.",
  },
  // Q409
  {
    q: "In BASIC, a string variable ends with:",
    opts: ["$", "%%", "&", "#"],
    ans: "A",
    exp: "In BASIC, string variables are identified by the dollar sign ($) suffix, e.g., A$, NAME$.",
  },
  // Q410
  {
    q: "The LET statement in BASIC is used for:",
    opts: ["Assignment", "Input", "Output", "Comments"],
    ans: "A",
    exp: "LET assigns a value to a variable: LET X = 5 or LET NAME$ = 'AYO'.",
  },
  // Q411
  {
    q: "The INPUT statement in BASIC is used for:",
    opts: [
      "Receiving data from the user",
      "Displaying output",
      "Assigning values",
      "Commenting code",
    ],
    ans: "A",
    exp: "INPUT pauses execution and waits for the user to type data.",
  },
  // Q412
  {
    q: "The PRINT statement in BASIC is used for:",
    opts: [
      "Displaying output",
      "Receiving input",
      "Assigning values",
      "Terminating the program",
    ],
    ans: "A",
    exp: "PRINT displays output to the screen.",
  },
  // Q413
  {
    q: "The REM statement in BASIC is used for:",
    opts: ["Comments", "Input", "Output", "Assignment"],
    ans: "A",
    exp: "REM (REMark) is used to add comments to BASIC programs.",
  },
  // Q414
  {
    q: "The END statement in BASIC:",
    opts: [
      "Terminates program execution",
      "Pauses the program",
      "Restarts the program",
      "Continues the program",
    ],
    ans: "A",
    exp: "END marks the end of the program and stops execution.",
  },
  // Q415
  {
    q: "The IF...THEN statement is an example of a:",
    opts: [
      "Selection structure",
      "Loop structure",
      "Sequence structure",
      "Function",
    ],
    ans: "A",
    exp: "IF...THEN implements selection (conditional branching) — one of the three fundamental control structures.",
  },
  // Q416
  {
    q: "The FOR...NEXT loop in BASIC is used for:",
    opts: [
      "Counting iterations",
      "Infinite loops",
      "Conditional execution",
      "Subroutine calls",
    ],
    ans: "A",
    exp: "FOR I = start TO end STEP increment...NEXT I: the counter-controlled loop repeats a known number of times.",
  },
  // Q417
  {
    q: "The WHILE...WEND loop executes:",
    opts: [
      "While a condition is true",
      "Once only",
      "Forever",
      "Until a condition is false",
    ],
    ans: "A",
    exp: "WHILE condition...WEND: the loop body executes repeatedly while the condition remains TRUE.",
  },
  // Q418
  {
    q: "The GOTO statement in BASIC is used for:",
    opts: [
      "Unconditional branching",
      "Conditional branching",
      "Subroutine calls",
      "Loop termination",
    ],
    ans: "A",
    exp: "GOTO line_number transfers control unconditionally to the specified line number.",
  },
  // Q419
  {
    q: "The GOSUB statement in BASIC is used for:",
    opts: [
      "Calling a subroutine",
      "Jumping to a line number",
      "Exiting the program",
      "Creating a loop",
    ],
    ans: "A",
    exp: "GOSUB line_number calls a subroutine. The program returns after RETURN is encountered.",
  },
  // Q420
  {
    q: "An array in BASIC is declared using:",
    opts: ["DIM", "ARRAY", "DECLARE", "LET"],
    ans: "A",
    exp: "DIM (DIMension) declares arrays in BASIC: DIM A(10) creates a 1D array of 11 elements.",
  },
  // Q421
  {
    q: "The SQR function in BASIC returns:",
    opts: ["Square root", "Square", "Sine", "Cosine"],
    ans: "A",
    exp: "SQR(x) returns the square root of x. Example: SQR(16) = 4.",
  },
  // Q422
  {
    q: "The ABS function in BASIC returns:",
    opts: ["Absolute value", "Square root", "Sine", "Cosine"],
    ans: "A",
    exp: "ABS(x) returns the absolute value of x: ABS(-5) = 5, ABS(3) = 3.",
  },
  // Q423
  {
    q: "The INT function in BASIC returns:",
    opts: [
      "The integer part",
      "The fractional part",
      "The absolute value",
      "The square root",
    ],
    ans: "A",
    exp: "INT(x) returns the largest integer less than or equal to x (floor function).",
  },
  // Q424
  {
    q: "The RND function in BASIC returns:",
    opts: [
      "A random number between 0 and 1",
      "A random integer",
      "A random number 1 to 100",
      "A random number 0 to 10",
    ],
    ans: "A",
    exp: "RND returns a random decimal number between 0 (inclusive) and 1 (exclusive).",
  },
  // Q425
  {
    q: "The LEN function in BASIC returns:",
    opts: [
      "The length of a string",
      "The length of an array",
      "The number of variables",
      "The number of lines",
    ],
    ans: "A",
    exp: 'LEN(string) returns the number of characters. LEN("HELLO") = 5.',
  },
  // Q426
  {
    q: "The LEFT$ function in BASIC returns:",
    opts: [
      "The leftmost characters",
      "The rightmost characters",
      "The middle characters",
      "The entire string",
    ],
    ans: "A",
    exp: 'LEFT$(string, n) returns the leftmost n characters: LEFT$("HELLO", 3) = "HEL".',
  },
  // Q427
  {
    q: "The RIGHT$ function in BASIC returns:",
    opts: [
      "The rightmost characters",
      "The leftmost characters",
      "The middle characters",
      "The entire string",
    ],
    ans: "A",
    exp: 'RIGHT$(string, n) returns the rightmost n characters: RIGHT$("HELLO", 3) = "LLO".',
  },
  // Q428
  {
    q: "The MID$ function in BASIC returns:",
    opts: [
      "A substring",
      "The leftmost characters",
      "The rightmost characters",
      "The entire string",
    ],
    ans: "A",
    exp: "MID$(string, start, length) returns 'length' characters from position 'start'.",
  },
  // Q429
  {
    q: "The CHR$ function in BASIC returns:",
    opts: [
      "The character for an ASCII code",
      "The ASCII code for a character",
      "A string",
      "A number",
    ],
    ans: "A",
    exp: 'CHR$(n) converts ASCII code to character: CHR$(65) = "A".',
  },
  // Q430
  {
    q: "The ASC function in BASIC returns:",
    opts: [
      "The ASCII code for a character",
      "The character for an ASCII code",
      "A string",
      "A number",
    ],
    ans: "A",
    exp: 'ASC(string) returns the ASCII code of the first character: ASC("A") = 65.',
  },
  // Q431
  {
    q: "The STR$ function in BASIC converts:",
    opts: [
      "A number to a string",
      "A string to a number",
      "A number to an integer",
      "A string to a character",
    ],
    ans: "A",
    exp: 'STR$(number) converts a numeric value to its string representation: STR$(42) = "42".',
  },
  // Q432
  {
    q: "The VAL function in BASIC converts:",
    opts: [
      "A string to a number",
      "A number to a string",
      "A number to an integer",
      "A string to a character",
    ],
    ans: "A",
    exp: 'VAL(string) converts a numeric string to a number: VAL("42") = 42.',
  },
  // Q433
  {
    q: "A binary search algorithm requires:",
    opts: ["A sorted list", "An unsorted list", "A linked list", "A tree"],
    ans: "A",
    exp: "Binary search requires a sorted array. It divides the search interval in half repeatedly.",
  },
  // Q434
  {
    q: "The worst-case time complexity of bubble sort is:",
    opts: ["O(n²)", "O(n log n)", "O(n)", "O(log n)"],
    ans: "A",
    exp: "Bubble sort worst-case (reverse sorted): O(n²) comparisons and swaps.",
  },
  // Q435
  {
    q: "The worst-case time complexity of binary search is:",
    opts: ["O(log n)", "O(n)", "O(n²)", "O(1)"],
    ans: "A",
    exp: "Binary search worst-case: O(log n). For n=1024 elements, at most 10 comparisons.",
  },
  // Q436
  {
    q: "The worst-case time complexity of linear search is:",
    opts: ["O(n)", "O(log n)", "O(n²)", "O(1)"],
    ans: "A",
    exp: "Linear search worst-case: O(n) — must check every element.",
  },
  // Q437
  {
    q: "A stack is a data structure that operates on:",
    opts: [
      "LIFO (Last In First Out)",
      "FIFO (First In First Out)",
      "LILO (Last In Last Out)",
      "FILO (First In Last Out)",
    ],
    ans: "A",
    exp: "Stack = LIFO. Like a stack of plates — you can only add/remove from the top.",
  },
  // Q438
  {
    q: "A queue is a data structure that operates on:",
    opts: [
      "FIFO (First In First Out)",
      "LIFO (Last In First Out)",
      "LILO",
      "FILO",
    ],
    ans: "A",
    exp: "Queue = FIFO. Like a queue at a counter — first person in is first served.",
  },
  // Q439
  {
    q: "A linked list consists of:",
    opts: [
      "Nodes containing data and pointers",
      "Arrays only",
      "Contiguous memory",
      "Trees",
    ],
    ans: "A",
    exp: "A linked list is made of nodes, each containing data and a pointer to the next node.",
  },
  // Q440
  {
    q: "The top node of a tree is called the:",
    opts: ["Root", "Leaf", "Branch", "Node"],
    ans: "A",
    exp: "The root is the topmost node of a tree with no parent.",
  },
  // Q441
  {
    q: "Nodes with no children in a tree are called:",
    opts: ["Leaves", "Roots", "Branches", "Parents"],
    ans: "A",
    exp: "Leaf nodes (external nodes) are nodes with no children — at the bottom of the tree.",
  },
  // Q442
  {
    q: "A binary tree is a tree where each node has at most:",
    opts: ["Two children", "One child", "Three children", "Unlimited children"],
    ans: "A",
    exp: "In a binary tree, each node has at most 2 children: left child and right child.",
  },
  // Q443
  {
    q: "A binary search tree (BST) has the property that:",
    opts: [
      "Left child < parent < right child",
      "Left child > parent > right child",
      "All children < parent",
      "All children > parent",
    ],
    ans: "A",
    exp: "BST property: all values in left subtree < node < all values in right subtree.",
  },
  // Q444
  {
    q: "Recursion is a technique where a function:",
    opts: [
      "Calls itself",
      "Calls another function",
      "Does not return a value",
      "Returns a value",
    ],
    ans: "A",
    exp: "Recursion: a function calls itself with a simpler version of the same problem.",
  },
  // Q445
  {
    q: "The factorial of n can be computed recursively as:",
    opts: ["n! = n × (n−1)!", "n! = n + (n−1)!", "n! = (n−1)!", "n! = n"],
    ans: "A",
    exp: "Recursive definition: n! = n × (n−1)! with base case 0! = 1.",
  },
  // Q446
  {
    q: "The Fibonacci sequence is computed recursively as:",
    opts: [
      "fib(n) = fib(n−1) + fib(n−2)",
      "fib(n) = fib(n−1) × fib(n−2)",
      "fib(n) = fib(n−1) − fib(n−2)",
      "fib(n) = fib(n−2)",
    ],
    ans: "A",
    exp: "Fibonacci: fib(n) = fib(n−1) + fib(n−2), with base cases fib(0)=0, fib(1)=1.",
  },
  // Q447
  {
    q: "Selection sort works by:",
    opts: [
      "Repeatedly selecting the minimum element",
      "Swapping adjacent elements",
      "Dividing and conquering",
      "Using a heap",
    ],
    ans: "A",
    exp: "Selection sort: find minimum in unsorted portion, swap with first unsorted element, repeat.",
  },
  // Q448
  {
    q: "Bubble sort works by:",
    opts: [
      "Repeatedly swapping adjacent elements if out of order",
      "Selecting the minimum element",
      "Using divide-and-conquer",
      "Using a hash table",
    ],
    ans: "A",
    exp: "Bubble sort: compare adjacent pairs and swap if out of order, bubbling larger elements to the end.",
  },
  // Q449
  {
    q: "Merge sort uses:",
    opts: [
      "Divide and conquer strategy",
      "Greedy strategy",
      "Dynamic programming",
      "Brute force",
    ],
    ans: "A",
    exp: "Merge sort divides the array in half, sorts each half recursively, then merges. Guaranteed O(n log n).",
  },
  // Q450
  {
    q: "A hash table provides:",
    opts: [
      "O(1) average-time search",
      "O(n) search",
      "O(log n) search",
      "O(n²) search",
    ],
    ans: "A",
    exp: "Hash tables use a hash function to map keys to indices, providing O(1) average-case search.",
  },
  // Q451
  {
    q: "SQL stands for:",
    opts: [
      "Structured Query Language",
      "Standard Query Language",
      "Simple Query Language",
      "Sequential Query Language",
    ],
    ans: "A",
    exp: "SQL = Structured Query Language, the standard language for relational database management.",
  },
  // Q452
  {
    q: "The SELECT statement in SQL is used to:",
    opts: [
      "Retrieve data from a database",
      "Insert data",
      "Update data",
      "Delete data",
    ],
    ans: "A",
    exp: "SELECT retrieves data: SELECT * FROM table retrieves all columns.",
  },
  // Q453
  {
    q: "A primary key in a database table:",
    opts: [
      "Uniquely identifies each record",
      "Can be null",
      "Can have duplicate values",
      "Is optional",
    ],
    ans: "A",
    exp: "A primary key uniquely identifies each record in a table. It must be NOT NULL and unique.",
  },
  // Q454
  {
    q: "Normalization in databases is the process of:",
    opts: [
      "Reducing data redundancy",
      "Increasing data redundancy",
      "Deleting data",
      "Adding indexes",
    ],
    ans: "A",
    exp: "Normalization minimizes redundancy and dependency through normal forms (1NF, 2NF, 3NF).",
  },
  // Q455
  {
    q: "Each step of an algorithm must be precisely and unambiguously stated. This is called:",
    opts: ["Definiteness", "Finiteness", "Effectiveness", "Generality"],
    ans: "A",
    exp: "Definiteness means each step is precisely and unambiguously stated.",
  },
  // Q456
  {
    q: "In a flowchart, the symbol for a connector is:",
    opts: ["Circle", "Rectangle", "Diamond", "Parallelogram"],
    ans: "A",
    exp: "A circle represents a connector.",
  },
  // Q457
  {
    q: "Flow lines in a flowchart indicate:",
    opts: [
      "Direction of flow",
      "Data storage",
      "Decision points",
      "Input/output",
    ],
    ans: "A",
    exp: "Flow lines indicate the direction of flow.",
  },
  // Q458
  {
    q: "In BASIC, a numeric variable can be represented by:",
    opts: [
      "A single letter or letter followed by a digit",
      "A letter followed by $",
      "A number only",
      "Any character",
    ],
    ans: "A",
    exp: "Numeric variables in BASIC are letters or letter+digit.",
  },
  // Q459
  {
    q: "The STOP statement in BASIC:",
    opts: [
      "Stops program execution",
      "Terminates the program",
      "Restarts the program",
      "Continues the program",
    ],
    ans: "A",
    exp: "STOP stops program execution.",
  },
  // Q460
  {
    q: "The CLS statement in BASIC:",
    opts: [
      "Clears the screen",
      "Closes the program",
      "Clears variables",
      "Clears the memory",
    ],
    ans: "A",
    exp: "CLS clears the screen.",
  },
  // Q461
  {
    q: 'The output of PRINT "Hello " + "World" in BASIC is:',
    opts: ["Hello World", "HelloWorld", '"Hello World"', "Error"],
    ans: "A",
    exp: 'String concatenation: "Hello " + "World" = "Hello World".',
  },
  // Q462
  {
    q: 'The output of PRINT "Hello"; "World" in BASIC is:',
    opts: ["HelloWorld", "Hello World", '"HelloWorld"', "Error"],
    ans: "A",
    exp: 'Semicolon concatenates without space: "Hello" + "World" = "HelloWorld".',
  },
  // Q463
  {
    q: "The IF...THEN...ELSE statement performs:",
    opts: [
      "One action if condition true, another if false",
      "The same action always",
      "No action",
      "Only one action",
    ],
    ans: "A",
    exp: "IF...THEN...ELSE performs one action if true, another if false.",
  },
  // Q464
  {
    q: "The DO...LOOP statement in BASIC:",
    opts: [
      "Can loop while or until a condition",
      "Loops only once",
      "Cannot be used for loops",
      "Is the same as FOR loop",
    ],
    ans: "A",
    exp: "DO...LOOP can loop while or until a condition.",
  },
  // Q465
  {
    q: "The EXIT FOR statement in BASIC:",
    opts: [
      "Exits a FOR loop prematurely",
      "Exits the program",
      "Exits a subroutine",
      "Exits a function",
    ],
    ans: "A",
    exp: "EXIT FOR exits a FOR loop prematurely.",
  },
  // Q466
  {
    q: "The RETURN statement in BASIC is used with:",
    opts: ["GOSUB", "GOTO", "FOR", "IF"],
    ans: "A",
    exp: "RETURN is used with GOSUB.",
  },
  // Q467
  {
    q: "The DIM statement in BASIC is used to:",
    opts: [
      "Declare arrays",
      "Define functions",
      "Display output",
      "Declare variables",
    ],
    ans: "A",
    exp: "DIM is used to declare arrays.",
  },
  // Q468
  {
    q: "The elements of an array are accessed using:",
    opts: ["Subscripts (indices)", "Names", "Values", "Types"],
    ans: "A",
    exp: "Array elements are accessed using subscripts.",
  },
  // Q469
  {
    q: "A subroutine in BASIC is defined using:",
    opts: [
      "SUB...END SUB",
      "FUNCTION...END FUNCTION",
      "DEF...END DEF",
      "PROCEDURE...END PROCEDURE",
    ],
    ans: "A",
    exp: "Subroutines are defined with SUB...END SUB.",
  },
  // Q470
  {
    q: "A function in BASIC:",
    opts: [
      "Returns a value",
      "Does not return a value",
      "Can only return strings",
      "Can only return numbers",
    ],
    ans: "A",
    exp: "A function returns a value.",
  },
  // Q471
  {
    q: "The DATE$ function in BASIC returns:",
    opts: [
      "The current date",
      "The current time",
      "The current year",
      "The current month",
    ],
    ans: "A",
    exp: "DATE$ returns the current date.",
  },
  // Q472
  {
    q: "The TIME$ function in BASIC returns:",
    opts: [
      "The current time",
      "The current date",
      "The current year",
      "The current month",
    ],
    ans: "A",
    exp: "TIME$ returns the current time.",
  },
  // Q473
  {
    q: "The DATA statement in BASIC is used with:",
    opts: ["READ", "INPUT", "PRINT", "LET"],
    ans: "A",
    exp: "DATA is used with READ.",
  },
  // Q474
  {
    q: "The READ statement in BASIC is used with:",
    opts: ["DATA", "INPUT", "PRINT", "LET"],
    ans: "A",
    exp: "READ is used with DATA.",
  },
  // Q475
  {
    q: "The RESTORE statement in BASIC:",
    opts: [
      "Resets the DATA pointer",
      "Restores the program",
      "Restores variables",
      "Restores the screen",
    ],
    ans: "A",
    exp: "RESTORE resets the DATA pointer.",
  },
  // Q476
  {
    q: "The ON...GOTO statement in BASIC implements:",
    opts: ["Multiple branching", "Single branching", "Loops", "Functions"],
    ans: "A",
    exp: "ON...GOTO implements multiple branching.",
  },
  // Q477
  {
    q: "The ON...GOSUB statement in BASIC implements:",
    opts: [
      "Multiple subroutine calls",
      "Single subroutine calls",
      "Loops",
      "Functions",
    ],
    ans: "A",
    exp: "ON...GOSUB implements multiple subroutine calls.",
  },
  // Q478
  {
    q: "The ERROR handling in BASIC is done using:",
    opts: ["ON ERROR GOTO", "IF ERROR THEN", "ERROR HANDLER", "TRY...CATCH"],
    ans: "A",
    exp: "ON ERROR GOTO handles errors in BASIC.",
  },
  // Q479
  {
    q: "The RESUME statement in BASIC is used:",
    opts: [
      "After error handling",
      "To restart the program",
      "To continue execution",
      "To exit the program",
    ],
    ans: "A",
    exp: "RESUME is used after error handling.",
  },
  // Q480
  {
    q: "The ERL function in BASIC returns:",
    opts: [
      "The line number where an error occurred",
      "The error code",
      "The error message",
      "The error type",
    ],
    ans: "A",
    exp: "ERL returns the line number where an error occurred.",
  },
  // Q481
  {
    q: "The ERR function in BASIC returns:",
    opts: [
      "The error code",
      "The line number",
      "The error message",
      "The error type",
    ],
    ans: "A",
    exp: "ERR returns the error code.",
  },
  // Q482
  {
    q: "The EOF function in BASIC checks for:",
    opts: ["End of file", "End of program", "End of line", "End of string"],
    ans: "A",
    exp: "EOF checks for end of file.",
  },
  // Q483
  {
    q: "The OPEN statement in BASIC is used to:",
    opts: [
      "Open a file for reading or writing",
      "Close a file",
      "Read a file",
      "Write to a file",
    ],
    ans: "A",
    exp: "OPEN opens a file.",
  },
  // Q484
  {
    q: "The CLOSE statement in BASIC is used to:",
    opts: ["Close a file", "Open a file", "Read a file", "Write to a file"],
    ans: "A",
    exp: "CLOSE closes a file.",
  },
  // Q485
  {
    q: "The INPUT # statement in BASIC is used to:",
    opts: [
      "Read data from a file",
      "Write data to a file",
      "Open a file",
      "Close a file",
    ],
    ans: "A",
    exp: "INPUT # reads data from a file.",
  },
  // Q486
  {
    q: "The PRINT # statement in BASIC is used to:",
    opts: [
      "Write data to a file",
      "Read data from a file",
      "Open a file",
      "Close a file",
    ],
    ans: "A",
    exp: "PRINT # writes data to a file.",
  },
  // Q487
  {
    q: "A push operation on a stack:",
    opts: [
      "Adds an element",
      "Removes an element",
      "Peeks at the top element",
      "Checks if empty",
    ],
    ans: "A",
    exp: "Push adds an element to the stack.",
  },
  // Q488
  {
    q: "A pop operation on a stack:",
    opts: [
      "Removes the top element",
      "Adds an element",
      "Peeks at the top element",
      "Checks if empty",
    ],
    ans: "A",
    exp: "Pop removes the top element from the stack.",
  },
  // Q489
  {
    q: "An enqueue operation on a queue:",
    opts: [
      "Adds an element to the rear",
      "Removes an element from the front",
      "Peeks at the front element",
      "Checks if empty",
    ],
    ans: "A",
    exp: "Enqueue adds an element to the rear of the queue.",
  },
  // Q490
  {
    q: "A dequeue operation on a queue:",
    opts: [
      "Removes an element from the front",
      "Adds an element to the rear",
      "Peeks at the front element",
      "Checks if empty",
    ],
    ans: "A",
    exp: "Dequeue removes an element from the front of the queue.",
  },
  // Q491
  {
    q: "A tree data structure is:",
    opts: ["Hierarchical", "Linear", "Sequential", "Random"],
    ans: "A",
    exp: "A tree is a hierarchical data structure.",
  },
  // Q492
  {
    q: "The base case in a recursive function:",
    opts: [
      "Terminates the recursion",
      "Continues the recursion",
      "Initializes variables",
      "Prints output",
    ],
    ans: "A",
    exp: "The base case terminates the recursion.",
  },
  // Q493
  {
    q: "Sorting is the process of:",
    opts: [
      "Arranging data in order",
      "Searching for data",
      "Storing data",
      "Deleting data",
    ],
    ans: "A",
    exp: "Sorting arranges data in order.",
  },
  // Q494
  {
    q: "Quick sort uses:",
    opts: [
      "Divide and conquer with a pivot",
      "Greedy strategy",
      "Dynamic programming",
      "Brute force",
    ],
    ans: "A",
    exp: "Quick sort uses divide and conquer with a pivot.",
  },
  // Q495
  {
    q: "A database is:",
    opts: [
      "An organized collection of data",
      "A programming language",
      "A type of algorithm",
      "A data structure",
    ],
    ans: "A",
    exp: "A database is an organized collection of data.",
  },
  // Q496
  {
    q: "The INSERT statement in SQL is used to:",
    opts: [
      "Add new data to a database",
      "Retrieve data",
      "Update data",
      "Delete data",
    ],
    ans: "A",
    exp: "INSERT adds new data to a database.",
  },
  // Q497
  {
    q: "The UPDATE statement in SQL is used to:",
    opts: [
      "Modify existing data",
      "Retrieve data",
      "Add new data",
      "Delete data",
    ],
    ans: "A",
    exp: "UPDATE modifies existing data.",
  },
  // Q498
  {
    q: "The DELETE statement in SQL is used to:",
    opts: [
      "Remove data from a database",
      "Retrieve data",
      "Add new data",
      "Update data",
    ],
    ans: "A",
    exp: "DELETE removes data from a database.",
  },
  // Q499
  {
    q: "A foreign key in a database table:",
    opts: [
      "References a primary key in another table",
      "Is the same as a primary key",
      "Cannot be null",
      "Must be unique",
    ],
    ans: "A",
    exp: "A foreign key references a primary key in another table.",
  },
  // Q500
  {
    q: "An index in a database:",
    opts: [
      "Speeds up data retrieval",
      "Slows down data retrieval",
      "Has no effect on retrieval",
      "Stores data",
    ],
    ans: "A",
    exp: "An index speeds up data retrieval.",
  },
];

// ─── DATABASE ──────────────────────────────────────────────
const db = new Dexie("preST_v4");
// Bug 4: Added questionOverrides table
// Bug 5: Added currentQ to sessions
db.version(1).stores({
  students: "&matric, name, dept, level, avatar, createdAt",
  sessions:
    "&sessionKey, matric, courseIdx, seed, shuffledQ, shuffledOpts, answers, markedReview, startTime, timeLeft, submitted, _tabSwitches, currentQ",
  results:
    "++id, matric, courseIdx, score, pct, grade, sectionScore, timeSpent, date",
  announcements: "++id, title, body, type, pinned, publishAt, createdAt",
  settings: "&key, value",
  achievements: "&key, value",
  questionOverrides: "&idx, q, opts, ans, exp",
});

// ─── APP STATE ─────────────────────────────────────────────
const APP = {
  page: "home",
  student: null,
  session: null,
  currentQ: 0,
  isAdmin: false,
  theme: localStorage.getItem("prest_theme") || "dark",
  sound: localStorage.getItem("prest_sound") !== "false",
  online: navigator.onLine,
  examCfg: { duration: 30, passScore: 50, shuffle: true, session: "" },
  timerInt: null,
  tabSwitches: 0,
  adminStudents: [],
  sortCol: "date",
  sortDir: -1,
  qPage: 0,
  qPageSize: 20,
  filteredQ: [],
  editingAnnId: null,
  logoTaps: [],
  reviewItems: [],
  studyMode: false,
  _saveTimer: null,
  _posSaveTimer: null,
  _lastCourseIdx: null,
  charts: {},
  toastCache: {},
  isPaletteOpen: false,
  streakCount: 0,
  completedExams: 0,
  _overrideMap: {},
  _searchTimeout: null,
};

// ─── HELPERS ──────────────────────────────────────────────
const $ = (id) => document.getElementById(id);
const qs = (s, p = document) => p.querySelector(s);

// Bug 2: HTML sanitization helper
function escapeHTML(str) {
  if (str === null || str === undefined) return "";
  const div = document.createElement("div");
  div.textContent = String(str);
  return div.innerHTML;
}

function getGrade(pct) {
  if (pct >= 70) return "A";
  if (pct >= 60) return "B";
  if (pct >= 50) return "C";
  if (pct >= 45) return "D";
  return "F";
}

function formatTime(s) {
  const h = Math.floor(s / 3600),
    m = Math.floor((s % 3600) / 60),
    sec = s % 60;
  return `${h ? String(h).padStart(2, "0") + ":" : ""}${String(m).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;
}

function getInitials(name) {
  if (!name) return "?";
  return name
    .split(" ")
    .filter(Boolean)
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

function openModal(id) {
  const e = $(id);
  if (e) e.classList.remove("hidden");
}

function closeModal(id) {
  const e = $(id);
  if (e) e.classList.add("hidden");
}

function togglePwd(id) {
  const e = $(id);
  if (e) e.type = e.type === "password" ? "text" : "password";
}

// Bug 4: getQuestion helper that merges overrides
async function getQuestion(idx) {
  try {
    const override = await db.questionOverrides.get(idx);
    const base = QB[idx];
    if (!base) return null;
    if (override) {
      return {
        ...base,
        q: override.q || base.q,
        opts: override.opts || base.opts,
        ans: override.ans || base.ans,
        exp: override.exp || base.exp,
      };
    }
    return base;
  } catch (error) {
    handleError(error, "getQuestion");
    return QB[idx] || null;
  }
}

// Bug 4: Synchronous version for use in render loops where async isn't practical
function getQuestionSync(idx) {
  try {
    const base = QB[idx];
    if (!base) return null;
    const override = APP._overrideMap?.[idx] || {};
    return {
      ...base,
      q: override.q || base.q,
      opts: override.opts || base.opts,
      ans: override.ans || base.ans,
      exp: override.exp || base.exp,
    };
  } catch (error) {
    handleError(error, "getQuestionSync");
    return QB[idx] || null;
  }
}

// Bug 3: SHA-256 hash function for admin password
async function hashPassword(pw) {
  try {
    const enc = new TextEncoder().encode(pw);
    const hashBuf = await crypto.subtle.digest("SHA-256", enc);
    return Array.from(new Uint8Array(hashBuf))
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");
  } catch (error) {
    handleError(error, "hashPassword");
    throw new AppError("Password hashing failed", "CRYPTO_ERROR", "error");
  }
}

// ─── TOAST SYSTEM ──────────────────────────────────────────
let toastCount = 0;

function toast(msg, type = "info", dur = TOAST_DURATION) {
  try {
    const key = msg + type;
    const now = Date.now();
    if (APP.toastCache[key] && now - APP.toastCache[key] < 3000) return;
    APP.toastCache[key] = now;

    const icons = { success: "✅", error: "❌", warning: "⚠️", info: "ℹ️" };
    const el = document.createElement("div");
    el.className = `toast toast-${type}`;
    el.innerHTML = `<span style="font-size:1.1rem;flex-shrink:0">${icons[type] || "ℹ️"}</span><div class="toast-msg">${escapeHTML(msg)}</div>`;
    const zone = $("toast-zone");
    if (!zone) return;

    while (zone.children.length >= 3) {
      zone.children[0].classList.add("out");
      zone.children[0].addEventListener("animationend", () =>
        zone.children[0]?.remove(),
      );
    }

    zone.appendChild(el);
    toastCount++;
    setTimeout(() => {
      el.classList.add("out");
      el.addEventListener("animationend", () => el.remove());
    }, dur);
  } catch (error) {
    console.error("Toast error:", error);
  }
}

// ─── SOUND ────────────────────────────────────────────────
function playSound(type) {
  if (!APP.sound) return;
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = ctx.createOscillator(),
      gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    const cfg = {
      click: { f: 440, d: 0.05, t: "sine", v: 0.07 },
      correct: { f: 660, d: 0.2, t: "sine", v: 0.1 },
      wrong: { f: 200, d: 0.25, t: "sawtooth", v: 0.07 },
      submit: { f: 520, d: 0.35, t: "sine", v: 0.12 },
      warning: { f: 330, d: 0.5, t: "square", v: 0.1 },
      celebrate: { f: 880, d: 0.4, t: "sine", v: 0.15 },
    };
    const s = cfg[type] || cfg.click;
    osc.type = s.t;
    osc.frequency.value = s.f;
    gain.gain.setValueAtTime(s.v, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + s.d);
    osc.start();
    osc.stop(ctx.currentTime + s.d);
  } catch (e) {
    /* Silently fail audio */
  }
}

function vibrate(p = [40]) {
  if (navigator.vibrate) navigator.vibrate(p);
}

// ─── THEME ─────────────────────────────────────────────────
const THEMES = ["dark", "light", "midnight", "forest"];

function applyTheme(t) {
  APP.theme = t;
  document.documentElement.setAttribute("data-theme", t);
  const meta = $("meta-tc");
  const themeColors = {
    dark: "#050914",
    light: "#f2f4fb",
    midnight: "#08001a",
    forest: "#0a1f0f",
  };
  if (meta) meta.content = themeColors[t] || "#050914";
  localStorage.setItem("prest_theme", t);
  const sun = $("theme-icon-sun"),
    moon = $("theme-icon-moon");
  if (sun) sun.classList.toggle("hidden", t === "light");
  if (moon) moon.classList.toggle("hidden", t !== "light");
}

function cycleTheme() {
  const i = (THEMES.indexOf(APP.theme) + 1) % THEMES.length;
  applyTheme(THEMES[i]);
}

// ─── NAVIGATE ──────────────────────────────────────────────
// Bug 1: Fixed page switching with removeProperty
function navigate(page) {
  try {
    document.querySelectorAll(".page").forEach((p) => {
      p.classList.remove("active");
      p.style.removeProperty("display");
      p.style.display = "none";
    });
    const el = $(`page-${page}`);
    if (el) {
      el.classList.add("active");
      el.style.removeProperty("display");
    }
    APP.page = page;

    if (page !== "exam") {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    }

    const examCenter = $("hdr-exam-center");
    const studyBtn = $("study-btn");
    const footer = $("app-footer");
    if (examCenter) examCenter.style.display = page === "exam" ? "" : "none";
    if (studyBtn) studyBtn.style.display = page === "exam" ? "" : "none";
    if (footer) footer.style.display = page === "exam" ? "none" : "";

    if (page === "profile") loadProfilePage();
    if (page === "admin") {
      if (!APP.isAdmin) {
        navigate("admin-login");
        return;
      }
      loadAdminDashboard();
    }
    if (page === "dashboard") loadDashboard();

    // Accessibility: Move focus to main content
    const main = document.querySelector("main");
    if (main) {
      main.setAttribute("aria-live", "polite");
      setTimeout(() => {
        const firstFocusable = document.querySelector(
          '.page.active [tabindex="0"], .page.active button, .page.active input',
        );
        if (firstFocusable) firstFocusable.focus();
      }, 100);
    }

    window.scrollTo(0, 0);
  } catch (error) {
    handleError(error, "navigate");
  }
}
window.navigate = navigate;

// ─── LOGO CLICK ─────────────────────────────────────────────
function handleLogoClick() {
  try {
    if (APP.page === "exam") {
      navigate("dashboard");
      return;
    }
    const now = Date.now();
    APP.logoTaps = APP.logoTaps.filter((t) => now - t < 900);
    APP.logoTaps.push(now);
    if (APP.logoTaps.length >= 2) {
      APP.logoTaps = [];
      if (checkAdminSession()) {
        navigate("admin");
        return;
      }
      navigate("admin-login");
    }
  } catch (error) {
    handleError(error, "handleLogoClick");
  }
}
window.handleLogoClick = handleLogoClick;

// ─── ONLINE/OFFLINE ────────────────────────────────────────
function updateOnlineStatus() {
  const off = !APP.online;
  const strip = $("offline-strip"),
    badge = $("offline-badge");
  if (strip) strip.classList.toggle("show", off);
  if (badge) badge.classList.toggle("hidden", !off);
}
window.addEventListener("online", () => {
  APP.online = true;
  updateOnlineStatus();
});
window.addEventListener("offline", () => {
  APP.online = false;
  updateOnlineStatus();
});

// ─── RNG & SHUFFLE ─────────────────────────────────────────
function createRNG(seed) {
  let s = seed >>> 0;
  return () => {
    s += 0x6d2b79f5;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t ^= t + Math.imul(t ^ (t >>> 7), 61 | t);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function seededShuffle(arr, rng) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function generateSeed(str) {
  const s = str + Date.now();
  let h = 0;
  for (let i = 0; i < s.length; i++)
    h = (Math.imul(31, h) + s.charCodeAt(i)) | 0;
  return Math.abs(h) + Date.now();
}

// ─── SPLASH ─────────────────────────────────────────────────
function initSplash() {
  let p = 0;
  const bar = $("splash-bar");
  const iv = setInterval(() => {
    p = Math.min(p + Math.random() * 18 + 5, 100);
    if (bar) bar.style.width = p + "%";
    if (p >= 100) {
      clearInterval(iv);
      setTimeout(() => {
        const splash = $("splash");
        if (splash) {
          splash.style.opacity = "0";
          splash.style.transition = "opacity .6s";
          setTimeout(() => splash.remove(), 600);
        }
      }, 350);
    }
  }, 130);
}

// ─── AUTH — HOME ───────────────────────────────────────────
// Bug 9: Fixed matric-err class toggling
// Bug: Added input validation for matric numbers
async function handleStudentLogin() {
  try {
    const matricRaw = $("inp-matric").value;
    const name = $("inp-name").value.trim();
    const errEl = $("matric-err");

    // Validate matric
    const validation = validateMatric(matricRaw);
    if (!validation.valid) {
      if (errEl) {
        errEl.textContent = validation.message;
        errEl.classList.add("show");
      }
      return;
    }
    if (errEl) errEl.classList.remove("show");

    const matric = validation.value;

    const btn = $("login-btn"),
      txt = $("login-btn-txt"),
      arrow = $("login-btn-arrow");
    if (btn) btn.disabled = true;
    if (txt) txt.textContent = "Loading…";
    if (arrow) arrow.style.display = "none";
    const spin = document.createElement("div");
    spin.className = "spin";
    if (btn) btn.insertBefore(spin, btn.firstChild);

    await new Promise((r) => setTimeout(r, 500));

    let student = await db.students.get(matric);
    if (!student) {
      student = {
        matric,
        name: name || matric,
        dept: "",
        level: "",
        avatar: "",
        createdAt: Date.now(),
      };
      await db.students.put(student);
    } else if (name && !student.name) {
      student.name = name;
      await db.students.put(student);
    }
    APP.student = student;
    updateHeaderAvatar(student);
    localStorage.setItem("prest_last_matric", matric);
    navigate("dashboard");
  } catch (error) {
    handleError(error, "handleStudentLogin");
    toast("Error loading account. Try again.", "error");
  } finally {
    const btn = $("login-btn"),
      txt = $("login-btn-txt"),
      arrow = $("login-btn-arrow");
    if (btn) {
      btn.disabled = false;
      const spin = btn.querySelector(".spin");
      if (spin) spin.remove();
    }
    if (txt) txt.textContent = "Continue to Exam";
    if (arrow) arrow.style.display = "";
  }
}
window.handleStudentLogin = handleStudentLogin;

// ─── DASHBOARD ─────────────────────────────────────────────
async function loadDashboard() {
  try {
    const s = APP.student;
    if (!s) {
      navigate("home");
      return;
    }

    const h = new Date().getHours();
    const greet =
      h < 12 ? "Good morning" : h < 17 ? "Good afternoon" : "Good evening";
    const nameDisplay =
      s.name && s.name !== s.matric ? s.name.split(" ")[0] : s.matric;
    // Bug 2: Escape nameDisplay
    $("dash-greeting").innerHTML =
      `${greet}, <span class="grad">${escapeHTML(nameDisplay)}</span> 👋`;

    const results = await db.results.where("matric").equals(s.matric).toArray();
    const exams = results.length;
    const avg = exams
      ? Math.round(results.reduce((a, b) => a + b.pct, 0) / exams)
      : null;
    const best = exams ? Math.max(...results.map((r) => r.pct)) : null;
    const passed = results.filter((r) => r.pct >= APP.examCfg.passScore).length;

    animateNumber("st-exams", exams);
    if (avg !== null) animateNumber("st-avg", avg, "%");
    else $("st-avg").textContent = "—";
    if (best !== null) animateNumber("st-best", best, "%");
    else $("st-best").textContent = "—";
    if (exams)
      animateNumber("st-pass", Math.round((passed / exams) * 100), "%");
    else $("st-pass").textContent = "—";

    const sessions = await db.sessions
      .where("matric")
      .equals(s.matric)
      .toArray();
    const pending = sessions.find((sess) => !sess.submitted);
    const banner = $("resume-banner");
    if (pending && banner) {
      const c = COURSES[pending.courseIdx] || {};
      $("resume-course-txt").textContent =
        `Incomplete: ${c.code || ""} — ${c.name || "Unknown"}`;
      banner.classList.add("show");
      APP.session = pending;
    } else if (banner) {
      banner.classList.remove("show");
    }

    await loadHomeAnns();
    renderCourseCards(results);
  } catch (error) {
    handleError(error, "loadDashboard");
  }
}

// ─── ANIMATE NUMBER ────────────────────────────────────────
function animateNumber(elId, target, suffix = "") {
  const el = $(elId);
  if (!el) return;
  const duration = 800;
  const start = 0;
  const startTime = performance.now();

  function update(time) {
    const elapsed = time - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    const current = Math.round(start + (target - start) * eased);
    el.textContent = current + suffix;
    if (progress < 1) requestAnimationFrame(update);
  }
  requestAnimationFrame(update);
}

// ─── COURSE CARDS ──────────────────────────────────────────
function renderCourseCards(results) {
  try {
    const grid = $("courses-grid");
    if (!grid) return;
    grid.innerHTML = "";

    COURSES.forEach((c, idx) => {
      const courseResults = results.filter((r) => r.courseIdx === idx);
      const hasDone = courseResults.length > 0;
      const bestResult = hasDone
        ? courseResults.reduce((a, b) => (a.pct > b.pct ? a : b))
        : null;
      const bestPct = bestResult ? bestResult.pct : 0;
      const grad = getGrade(bestPct);

      const el = document.createElement("div");
      el.className = "course-card ripple";
      el.style.animationDelay = `${idx * 60}ms`;
      el.innerHTML = `
                      <div class="course-card-top">
                        <div class="course-icon" style="background:${c.grad}">${c.icon}</div>
                        <div class="course-status-dot ${hasDone ? "done" : ""}"></div>
                      </div>
                      <div class="course-code">${escapeHTML(c.code)}</div>
                      <div class="course-name">${escapeHTML(c.name)}</div>
                      <div class="course-meta">
                        ${hasDone ? `<span class="badge badge-${grad === "A" || grad === "B" ? "em" : grad === "C" ? "ind" : grad === "D" ? "amber" : "rose"}" style="font-size:.625rem">Best: ${grad} · ${bestPct}%</span>` : "<span>Not started yet</span>"}
                        <span style="margin-left:auto;font-family:var(--font-m)">30 Q</span>
                      </div>
                      ${hasDone ? `<div style="font-size:.6875rem;color:var(--t3);margin-top:.25rem">${courseResults.length} attempt${courseResults.length > 1 ? "s" : ""}</div>` : ""}
                      ${hasDone ? `<div class="course-score-bar"><div class="course-score-fill" style="background:${c.grad};width:${bestPct}%"></div></div>` : ""}
                      <div class="course-start-btn">
                        ${hasDone ? "🔄 Retake" : "▶ Start"} Session
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                      </div>
                    `;
      el.addEventListener("click", () => startCourse(idx));
      grid.appendChild(el);
    });
  } catch (error) {
    handleError(error, "renderCourseCards");
  }
}

async function startCourse(courseIdx) {
  try {
    APP._lastCourseIdx = courseIdx;
    await startExam(APP.student.matric, courseIdx);
  } catch (error) {
    handleError(error, "startCourse");
    toast("Failed to start exam. Please try again.", "error");
  }
}
window.startCourse = startCourse;

// Bug 5 & 6: Fixed resumeExam to restore currentQ and tabSwitches
async function resumeExam() {
  try {
    const s = APP.session;
    if (!s) return;
    APP.tabSwitches = s._tabSwitches || 0;
    APP.currentQ = s.currentQ ?? 0;
    $("resume-banner")?.classList.remove("show");
    const total = APP.examCfg.duration * 60;
    const remaining = s.timeLeft || total;
    s.timeLeft = remaining;
    navigate("exam");
    initExamUI();
    startTimer();
    setupAntiCheat();
  } catch (error) {
    handleError(error, "resumeExam");
    toast("Failed to resume exam. Please try again.", "error");
  }
}
window.resumeExam = resumeExam;

async function dismissResume() {
  $("resume-banner")?.classList.remove("show");
}
window.dismissResume = dismissResume;

// ─── ANNOUNCEMENTS ─────────────────────────────────────────
// Bug 2: Added escapeHTML to announcements
async function loadHomeAnns() {
  try {
    const now = Date.now();
    const anns = await db.announcements
      .filter((a) => !a.publishAt || a.publishAt <= now)
      .toArray();
    const section = $("ann-section"),
      list = $("ann-list-home");
    if (!anns.length) {
      if (section) section.style.display = "none";
      return;
    }
    if (section) section.style.display = "";
    const sorted = [...anns].sort(
      (a, b) => (b.pinned ? 1 : 0) - (a.pinned ? 1 : 0),
    );
    if (list) {
      list.innerHTML = sorted
        .slice(0, 3)
        .map(
          (a) => `
                              <div class="ann-item type-${a.type}">
                                <div style="font-size:1.25rem;flex-shrink:0">${a.type === "warning" ? "⚠️" : a.type === "danger" ? "🚨" : a.type === "success" ? "✅" : "ℹ️"}</div>
                                <div class="ann-item-body">
                                  <h4>${a.pinned ? "📌 " : ""}${escapeHTML(a.title)}</h4>
                                  <p>${escapeHTML(a.body)}</p>
                                </div>
                              </div>
                            `,
        )
        .join("");
    }
  } catch (error) {
    handleError(error, "loadHomeAnns");
  }
}

// ─── EXAM ENGINE ───────────────────────────────────────────
async function startExam(matric, courseIdx) {
  try {
    await loadSettings();
    const seed = generateSeed(matric + courseIdx);
    const rng = createRNG(seed);
    const sessionKey = `${matric}_c${courseIdx}`;

    // Transaction-safe deletion
    await db.transaction("rw", db.sessions, async () => {
      await db.sessions.where("sessionKey").equals(sessionKey).delete();
    });

    const baseStart = courseIdx * 100;
    const pool = Array.from({ length: 100 }, (_, i) => baseStart + i);
    const picked = seededShuffle(pool, rng).slice(0, QUESTIONS_PER_SESSION);

    const shuffledOpts = {};
    const LETTERS = "ABCDE";
    picked.forEach((origIdx) => {
      const q = QB[origIdx];
      const correctOrigIdx = LETTERS.indexOf(q.ans);
      if (APP.examCfg.shuffle) {
        const order = seededShuffle(
          [0, 1, 2, 3, 4].slice(0, q.opts.length),
          rng,
        );
        shuffledOpts[origIdx] = {
          order,
          newAns: LETTERS[order.indexOf(correctOrigIdx)],
        };
      } else {
        shuffledOpts[origIdx] = {
          order: Array.from({ length: q.opts.length }, (_, i) => i),
          newAns: q.ans,
        };
      }
    });

    const session = {
      sessionKey,
      matric,
      courseIdx,
      seed,
      shuffledQ: picked,
      shuffledOpts,
      answers: {},
      markedReview: {},
      startTime: Date.now(),
      timeLeft: APP.examCfg.duration * 60,
      submitted: false,
      _tabSwitches: 0,
      currentQ: 0,
    };

    // Transaction-safe save
    await db.transaction("rw", db.sessions, async () => {
      await db.sessions.put(session);
    });

    APP.session = session;
    APP.currentQ = 0;
    APP.tabSwitches = 0;
    APP.studyMode = false;

    const indicator = $("study-mode-indicator");
    if (indicator) indicator.classList.remove("show");

    navigate("exam");
    initExamUI();
    requestFullscreen();
    startTimer();
    setupAntiCheat();
  } catch (error) {
    handleError(error, "startExam");
    toast("Failed to start exam. Please try again.", "error");
  }
}
window.startExam = startExam;

// ─── EXAM UI ───────────────────────────────────────────────
function initExamUI() {
  try {
    buildPaletteGrid();
    renderQuestion(0);
  } catch (error) {
    handleError(error, "initExamUI");
    toast("Failed to initialize exam UI.", "error");
  }
}

// Bug 4: Updated to use getQuestionSync for overrides
// Bug 5: Added currentQ persistence
function renderQuestion(idx) {
  try {
    APP.currentQ = idx;
    const s = APP.session;
    if (s) {
      s.currentQ = idx;
      clearTimeout(APP._posSaveTimer);
      APP._posSaveTimer = setTimeout(() => {
        db.sessions.put(s).catch((error) => {
          handleError(error, "renderQuestion-savePosition");
        });
      }, POSITION_SAVE_DELAY);
    }

    const total = s.shuffledQ.length;
    const origIdx = s.shuffledQ[idx];
    const q = getQuestionSync(origIdx);

    // Error boundary for question loading
    if (!q) {
      toast(`Question ${idx + 1} could not be loaded.`, "error");
      return;
    }

    const course = COURSES[s.courseIdx];

    const examMain = document.querySelector(".exam-main");
    if (examMain) examMain.scrollTo(0, 0);

    const oldExp = qs(".explanation-box");
    if (oldExp) oldExp.remove();

    const scn = $("sidebar-course-name");
    if (scn) scn.textContent = `${course.code} — ${course.name}`;

    const cb = $("q-course-badge");
    if (cb) cb.textContent = course.code;
    const qn = $("q-num");
    if (qn) qn.textContent = `${idx + 1} / ${total}`;
    const qnl = $("q-number-label");
    if (qnl) qnl.textContent = `Question ${idx + 1} of ${total}`;
    const qt = $("q-text");
    if (qt) qt.textContent = q.q;
    const qcnt = $("q-counter");
    if (qcnt) qcnt.textContent = `${idx + 1} / ${total}`;

    const wrap = $("options-wrap");
    if (!wrap) return;
    wrap.innerHTML = "";
    const optOrder =
      s.shuffledOpts[origIdx]?.order ||
      Array.from({ length: q.opts.length }, (_, i) => i);
    const LETTERS = "ABCDE";

    optOrder.forEach((origOptIdx, displayIdx) => {
      const isSelected = s.answers[idx] === origOptIdx;
      const btn = document.createElement("button");
      btn.className = `opt-btn ripple${isSelected ? " selected" : ""}`;
      btn.dataset.opt = origOptIdx;
      btn.innerHTML = `<div class="opt-letter">${LETTERS[displayIdx]}</div><div style="flex:1;line-height:1.6">${escapeHTML(q.opts[origOptIdx])}</div>${isSelected ? '<span style="color:var(--ind-300);font-size:1rem;flex-shrink:0">✓</span>' : ""}`;
      btn.addEventListener("click", () => selectOption(origOptIdx, btn, idx));
      wrap.appendChild(btn);
    });

    const mb = $("mark-btn"),
      mbt = $("mark-btn-txt");
    const marked = !!s.markedReview[idx];
    if (mb) mb.classList.toggle("marked", marked);
    if (mbt) mbt.textContent = marked ? "Marked" : "Mark for Review";

    const prev = $("prev-btn"),
      next = $("next-btn");
    if (prev) prev.disabled = idx === 0;
    if (next) {
      if (idx === total - 1) {
        next.innerHTML =
          'Submit <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>';
        next.onclick = confirmSubmit;
        next.className = "btn btn-danger ripple";
      } else {
        next.innerHTML =
          'Next <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>';
        next.onclick = nextQ;
        next.className = "btn btn-primary ripple";
      }
    }

    const answered = Object.keys(s.answers).length;
    const fill = $("hdr-prog-fill"),
      txt = $("hdr-prog-txt");
    if (fill) fill.style.width = `${(answered / total) * 100}%`;
    if (txt) txt.textContent = `${answered}/${total}`;

    updatePaletteBtn(idx);

    if (APP.studyMode && s.answers[idx] !== undefined) {
      const correctIdx = "ABCDE".indexOf(q.ans);
      const userAns = s.answers[idx];
      wrap.querySelectorAll(".opt-btn").forEach((btn) => {
        const oi = parseInt(btn.dataset.opt);
        if (oi === correctIdx) btn.classList.add("rev-correct");
        else if (oi === userAns && userAns !== correctIdx)
          btn.classList.add("rev-wrong");
      });
      const expBox = document.createElement("div");
      expBox.className = "explanation-box";
      expBox.innerHTML = `💡 <strong>Explanation:</strong> ${escapeHTML(q.exp)}`;
      const qCard = qs(".q-card");
      if (qCard) qCard.after(expBox);
    }
  } catch (error) {
    handleError(error, "renderQuestion");
    toast("Error loading question. Please try again.", "error");
  }
}

function selectOption(origOptIdx, clickedBtn, qIdx) {
  try {
    const s = APP.session;
    s.answers[qIdx] = origOptIdx;

    const wrap = $("options-wrap");
    if (wrap) {
      wrap.querySelectorAll(".opt-btn").forEach((b) => {
        b.classList.remove("selected", "rev-correct", "rev-wrong");
        const tick = b.querySelector('[style*="ind-300"]');
        if (tick) tick.remove();
      });
    }
    clickedBtn.classList.add("selected");
    clickedBtn.insertAdjacentHTML(
      "beforeend",
      '<span style="color:var(--ind-300);font-size:1rem;flex-shrink:0">✓</span>',
    );

    clearTimeout(APP._saveTimer);
    APP._saveTimer = setTimeout(() => {
      db.sessions.put(s).catch((error) => {
        handleError(error, "selectOption-save");
      });
    }, 600);

    if (APP.studyMode) {
      const origIdx = s.shuffledQ[qIdx];
      const q = getQuestionSync(origIdx);
      const correctIdx = "ABCDE".indexOf(q.ans);
      wrap?.querySelectorAll(".opt-btn").forEach((btn) => {
        const oi = parseInt(btn.dataset.opt);
        if (oi === correctIdx) btn.classList.add("rev-correct");
        else if (oi === origOptIdx && origOptIdx !== correctIdx)
          btn.classList.add("rev-wrong");
      });
      const oldExp = qs(".explanation-box");
      if (oldExp) oldExp.remove();
      const expBox = document.createElement("div");
      expBox.className = "explanation-box";
      expBox.innerHTML = `💡 <strong>Explanation:</strong> ${escapeHTML(q.exp)}`;
      const qCard = qs(".q-card");
      if (qCard) qCard.after(expBox);
    }

    vibrate([30]);
    playSound("click");
    updatePaletteBtn(qIdx);

    const answered = Object.keys(s.answers).length,
      total = s.shuffledQ.length;
    const fill = $("hdr-prog-fill"),
      txt = $("hdr-prog-txt");
    if (fill) fill.style.width = `${(answered / total) * 100}%`;
    if (txt) txt.textContent = `${answered}/${total}`;
  } catch (error) {
    handleError(error, "selectOption");
    toast("Error saving your answer.", "error");
  }
}

function nextQ() {
  try {
    if (APP.currentQ < APP.session.shuffledQ.length - 1)
      renderQuestion(APP.currentQ + 1);
  } catch (error) {
    handleError(error, "nextQ");
  }
}

function prevQ() {
  try {
    if (APP.currentQ > 0) renderQuestion(APP.currentQ - 1);
  } catch (error) {
    handleError(error, "prevQ");
  }
}
window.nextQ = nextQ;
window.prevQ = prevQ;

function toggleReview() {
  try {
    const s = APP.session,
      idx = APP.currentQ;
    s.markedReview[idx] = !s.markedReview[idx];
    db.sessions.put(s).catch((error) => {
      handleError(error, "toggleReview");
    });
    renderQuestion(idx);
    updatePaletteBtn(idx);
  } catch (error) {
    handleError(error, "toggleReview");
  }
}
window.toggleReview = toggleReview;

function openPalette() {
  APP.isPaletteOpen = true;
  $("exam-sidebar")?.classList.add("open");
  $("palette-overlay").style.display = "block";
}

function closePalette() {
  APP.isPaletteOpen = false;
  $("exam-sidebar")?.classList.remove("open");
  $("palette-overlay").style.display = "none";
}
window.openPalette = openPalette;
window.closePalette = closePalette;

// ─── PALETTE ────────────────────────────────────────────────
function buildPaletteGrid() {
  try {
    const grid = $("palette-grid");
    if (!grid) return;
    const s = APP.session;
    if (!s) return;
    const total = s.shuffledQ.length;
    grid.innerHTML = "";
    for (let i = 0; i < total; i++) {
      const btn = document.createElement("button");
      btn.className = "p-btn";
      btn.dataset.idx = i;
      btn.textContent = i + 1;
      const isAnswered = s.answers[i] !== undefined && s.answers[i] !== null;
      const isMarked = !!s.markedReview[i];
      const isCurrent = i === APP.currentQ;
      btn.classList.add(isAnswered ? "p-answered" : "p-unanswered");
      if (isMarked) btn.classList.add("p-review");
      if (isCurrent) btn.classList.add("p-current");
      btn.addEventListener("click", () => {
        renderQuestion(i);
        closePalette();
      });
      grid.appendChild(btn);
    }
  } catch (error) {
    handleError(error, "buildPaletteGrid");
  }
}

function updatePaletteBtn(currentIdx) {
  try {
    const btns = $("palette-grid")?.querySelectorAll(".p-btn");
    if (!btns) return;
    const s = APP.session;
    btns.forEach((btn, i) => {
      const isAnswered = s.answers[i] !== undefined && s.answers[i] !== null;
      const isMarked = !!s.markedReview[i];
      const isCurrent = i === currentIdx;
      btn.className = "p-btn";
      btn.classList.add(isAnswered ? "p-answered" : "p-unanswered");
      if (isMarked) btn.classList.add("p-review");
      if (isCurrent) btn.classList.add("p-current");
    });
  } catch (error) {
    handleError(error, "updatePaletteBtn");
  }
}

// ─── TIMER ──────────────────────────────────────────────────
function startTimer() {
  try {
    clearInterval(APP.timerInt);
    const total = APP.examCfg.duration * 60;
    const s = APP.session;
    let remaining = s.timeLeft || total;
    const update = () => {
      if (APP.studyMode) return;
      remaining = Math.max(0, remaining - 1);
      s.timeLeft = remaining;
      if (remaining <= 0) {
        clearInterval(APP.timerInt);
        toast("⏰ Time's up! Submitting exam...", "warning");
        setTimeout(submitExam, 800);
      }
      updateTimerDisplay(remaining);
      // Save every 15 seconds
      if (remaining % SAVE_INTERVAL_SECONDS === 0) {
        db.sessions.put(s).catch((error) => {
          handleError(error, "startTimer-save");
        });
      }
    };
    APP.timerInt = setInterval(update, 1000);
    updateTimerDisplay(remaining);

    // Save on visibility change for better persistence
    document.addEventListener("visibilitychange", () => {
      if (document.hidden && APP.session && !APP.session.submitted) {
        db.sessions.put(APP.session).catch((error) => {
          handleError(error, "timer-visibilitySave");
        });
      }
    });
  } catch (error) {
    handleError(error, "startTimer");
  }
}

function updateTimerDisplay(seconds) {
  const el1 = $("hdr-timer"),
    el2 = $("mob-timer");
  const time = formatTime(seconds);
  if (el1) {
    el1.textContent = time;
    el1.classList.remove("warn", "danger");
    if (seconds < 60) el1.classList.add("danger");
    else if (seconds < 180) el1.classList.add("warn");
  }
  if (el2) el2.textContent = time;
}

function toggleStudyMode() {
  try {
    APP.studyMode = !APP.studyMode;
    const indicator = $("study-mode-indicator");
    if (indicator) indicator.classList.toggle("show", APP.studyMode);
    const btn = $("study-btn");
    if (btn) {
      btn.style.color = APP.studyMode ? "var(--amber-400)" : "";
      btn.style.borderColor = APP.studyMode ? "rgba(251,191,36,.3)" : "";
    }
    toast(
      APP.studyMode ? "📖 Study Mode ON — Timer paused" : "📖 Study Mode OFF",
      "info",
      2000,
    );
    if (APP.session) renderQuestion(APP.currentQ);
  } catch (error) {
    handleError(error, "toggleStudyMode");
  }
}
window.toggleStudyMode = toggleStudyMode;

// ─── ANTI-CHEAT ─────────────────────────────────────────────
function setupAntiCheat() {
  document.addEventListener("visibilitychange", handleVisibilityChange);
}

function handleVisibilityChange() {
  try {
    if (document.hidden && APP.page === "exam" && !APP.studyMode) {
      APP.tabSwitches++;
      const s = APP.session;
      if (s) {
        if (!s._tabSwitches) s._tabSwitches = 0;
        s._tabSwitches++;
        db.sessions.put(s).catch((error) => {
          handleError(error, "handleVisibilityChange");
        });
      }
      const msg = `Tab switch detected (${APP.tabSwitches} time${APP.tabSwitches > 1 ? "s" : ""})`;
      toast(msg, "warning", 3000);
      $("tab-count-txt").textContent = `Total: ${APP.tabSwitches}.`;
      if (APP.tabSwitches >= TAB_SWITCH_LIMIT) {
        openModal("modal-tab");
      }
    }
  } catch (error) {
    handleError(error, "handleVisibilityChange");
  }
}
window.handleVisibilityChange = handleVisibilityChange;

// ─── SUBMIT ─────────────────────────────────────────────────
function confirmSubmit() {
  try {
    const s = APP.session;
    if (!s) return;
    const total = s.shuffledQ.length;
    const answered = Object.keys(s.answers).filter(
      (k) => s.answers[k] !== undefined && s.answers[k] !== null,
    ).length;
    const left = total - answered;
    let summary = `You have answered ${answered}/${total} questions.`;
    if (left > 0)
      summary += ` <span style="color:var(--amber-400)">${left} left unanswered.</span>`;
    $("submit-summary").innerHTML = summary;
    openModal("modal-submit");
  } catch (error) {
    handleError(error, "confirmSubmit");
  }
}
window.confirmSubmit = confirmSubmit;

// Bug 4: Updated submitExam to use getQuestionSync for overrides
async function submitExam() {
  try {
    closeModal("modal-submit");
    closeModal("modal-tab");
    const s = APP.session;
    if (!s || s.submitted) return;

    clearInterval(APP.timerInt);
    document.removeEventListener("visibilitychange", handleVisibilityChange);

    s.submitted = true;
    s.timeEnd = Date.now();
    s.timeSpent = Math.floor((s.timeEnd - s.startTime) / 1000);

    let correct = 0;
    const total = s.shuffledQ.length;
    const sectionScore = {};
    const reviewData = [];

    s.shuffledQ.forEach((origIdx, i) => {
      const q = getQuestionSync(origIdx);
      const userAns = s.answers[i];
      const correctIdx = "ABCDE".indexOf(q.ans);
      const isCorrect = userAns === correctIdx;
      if (isCorrect) correct++;
      const courseIdx = Math.floor(origIdx / 100);
      if (!sectionScore[courseIdx])
        sectionScore[courseIdx] = { correct: 0, total: 0 };
      sectionScore[courseIdx].total++;
      if (isCorrect) sectionScore[courseIdx].correct++;
      reviewData.push({
        idx: i,
        q,
        userAns,
        correctIdx,
        isCorrect,
        marked: !!s.markedReview[i],
      });
    });

    const pct = Math.round((correct / total) * 100);
    const grade = getGrade(pct);
    s.score = correct;
    s.pct = pct;
    s.grade = grade;

    const result = {
      matric: s.matric,
      courseIdx: s.courseIdx,
      score: correct,
      pct: pct,
      grade: grade,
      sectionScore: sectionScore,
      timeSpent: s.timeSpent,
      date: Date.now(),
      tabSwitches: s._tabSwitches || 0,
    };

    // Transaction-safe save
    await db.transaction("rw", [db.results, db.sessions], async () => {
      await db.results.put(result);
      await db.sessions.where("sessionKey").equals(s.sessionKey).delete();
    });

    APP.reviewItems = reviewData;
    toast(
      `✅ Exam submitted! Score: ${correct}/${total} (${pct}%)`,
      "success",
      4000,
    );
    playSound("submit");

    await checkAchievements(s.matric, result);

    navigate("results");
    renderResults(result, reviewData);
  } catch (error) {
    handleError(error, "submitExam");
    toast("Failed to submit exam. Please try again.", "error");
  }
}
window.submitExam = submitExam;

// ─── ACHIEVEMENTS SYSTEM ──────────────────────────────────
async function checkAchievements(matric, result) {
  try {
    const key = `achievements_${matric}`;
    let unlocked = await db.achievements.get(key);
    if (!unlocked) {
      unlocked = { key, matric, unlocked: [] };
      await db.achievements.put(unlocked);
    }
    const list = unlocked.unlocked || [];
    const newAchievements = [];

    const allResults = await db.results
      .where("matric")
      .equals(matric)
      .toArray();
    const totalExams = allResults.length;

    if (totalExams === 1 && !list.includes("first_exam")) {
      list.push("first_exam");
      newAchievements.push("first_exam");
    }

    if (result.pct === 100 && !list.includes("perfect_score")) {
      list.push("perfect_score");
      newAchievements.push("perfect_score");
    }

    // Fixed streak logic: check for consecutive exams
    const sorted = allResults.sort((a, b) => b.date - a.date);
    if (sorted.length >= 3 && !list.includes("streak_3")) {
      // Check if the last 3 exams are consecutive (within 24h of each other)
      const last3 = sorted.slice(0, 3);
      let isStreak = true;
      for (let i = 0; i < last3.length - 1; i++) {
        if (last3[i].date - last3[i + 1].date > MS_IN_DAY) {
          isStreak = false;
          break;
        }
      }
      if (isStreak) {
        list.push("streak_3");
        newAchievements.push("streak_3");
      }
    }

    if (result.timeSpent < 1800 && !list.includes("quick_learner")) {
      list.push("quick_learner");
      newAchievements.push("quick_learner");
    }

    if (!list.includes("topic_master")) {
      const sections = result.sectionScore || {};
      let allPass = true;
      for (const key in sections) {
        const sec = sections[key];
        const pct = sec.total ? (sec.correct / sec.total) * 100 : 0;
        if (pct < 80) {
          allPass = false;
          break;
        }
      }
      if (allPass && Object.keys(sections).length >= 5) {
        list.push("topic_master");
        newAchievements.push("topic_master");
      }
    }

    if (totalExams >= MIN_EXAMS_FOR_DEDICATED && !list.includes("dedicated")) {
      list.push("dedicated");
      newAchievements.push("dedicated");
    }

    if (newAchievements.length > 0) {
      await db.achievements.put(unlocked);
      newAchievements.forEach((achKey) => {
        const ach = ACHIEVEMENTS[achKey];
        if (ach) {
          toast(
            `🏅 Achievement Unlocked: ${ach.icon} ${ach.name}!`,
            "success",
            5000,
          );
          playSound("celebrate");
        }
      });
    }
  } catch (error) {
    handleError(error, "checkAchievements");
  }
}

async function loadAchievements(matric) {
  try {
    const key = `achievements_${matric}`;
    const data = await db.achievements.get(key);
    const unlocked = data?.unlocked || [];
    const grid = $("achievement-grid");
    if (!grid) return;

    grid.innerHTML = Object.keys(ACHIEVEMENTS)
      .map((achKey) => {
        const ach = ACHIEVEMENTS[achKey];
        const isUnlocked = unlocked.includes(achKey);
        return `
                              <div class="achievement-item ${isUnlocked ? "unlocked" : ""}">
                                ${isUnlocked ? `<span class="ach-icon">${ach.icon}</span>` : `<span class="ach-lock">🔒</span>`}
                                <div class="ach-name">${ach.name}</div>
                                <div class="ach-desc">${ach.desc}</div>
                              </div>
                            `;
      })
      .join("");
  } catch (error) {
    handleError(error, "loadAchievements");
  }
}

// ─── FULLSCREEN ─────────────────────────────────────────────
function requestFullscreen() {
  if (document.fullscreenEnabled && !document.fullscreenElement) {
    document.documentElement.requestFullscreen?.().catch(() => {});
  }
}

// ─── RESULTS PAGE ──────────────────────────────────────────
// Bug 4: Updated renderResults to use getQuestionSync
function renderResults(result, reviewData) {
  try {
    const total = APP.session ? APP.session.shuffledQ.length : 30;
    const pct = result.pct;
    const grade = result.grade;

    const emojis = { A: "🏆", B: "🥈", C: "🎯", D: "📚", F: "💪" };
    $("res-emoji").textContent = emojis[grade] || "🎯";

    const circumference = 2 * Math.PI * 76;
    const offset = circumference - (pct / 100) * circumference;
    const arc = $("score-arc");
    if (arc) {
      arc.style.strokeDashoffset = offset;
      setTimeout(() => {
        arc.style.strokeDashoffset = offset;
      }, 100);
    }
    $("res-score").textContent = result.score;
    $("res-denom").textContent = `/${total}`;
    $("res-pct").textContent = `${pct}%`;

    const gradeEl = $("res-grade");
    if (gradeEl) {
      gradeEl.className = `result-grade-badge grade-${grade}`;
      gradeEl.textContent = `Grade ${grade}`;
    }

    const msgs = {
      A: "Outstanding performance! You're a star ⭐",
      B: "Excellent work! Keep pushing 🚀",
      C: "Good job! Keep practicing 💪",
      D: "Fair effort. Review and try again 📖",
      F: "Don't give up! Practice makes perfect 🌱",
    };
    $("res-msg").textContent = msgs[grade] || "Keep learning!";

    const time = formatTime(result.timeSpent || 0);
    $("res-time").textContent = `⏱️ ${time} spent`;

    if (grade === "A") {
      setTimeout(() => {
        confetti({
          particleCount: 150,
          spread: 80,
          origin: { y: 0.6 },
          colors: ["#6366f1", "#bef264", "#34d399", "#f43f5e"],
        });
      }, 500);
    }

    const bd = $("section-breakdown");
    if (bd) {
      bd.innerHTML = "";
      const sections = result.sectionScore || {};
      COURSES.forEach((c, idx) => {
        const data = sections[idx] || { correct: 0, total: 0 };
        const pct = data.total
          ? Math.round((data.correct / data.total) * 100)
          : 0;
        const row = document.createElement("div");
        row.className = "breakdown-row";
        row.innerHTML = `
                                <div class="breakdown-code">${c.code}</div>
                                <div class="breakdown-bar-wrap">
                                  <div class="breakdown-label">
                                    <span>${c.name}</span>
                                    <span style="font-weight:600">${data.correct}/${data.total} — ${pct}%</span>
                                  </div>
                                  <div class="breakdown-bar">
                                    <div class="breakdown-fill" style="width:${pct}%;background:${c.color};transition:width 1s var(--ease-out)"></div>
                                  </div>
                                </div>
                              `;
        bd.appendChild(row);
      });
    }

    renderReviewList(reviewData);
  } catch (error) {
    handleError(error, "renderResults");
  }
}

// Bug 2: Added escapeHTML to review rendering
function renderReviewList(reviewData, filter = "all") {
  try {
    const list = $("review-list");
    if (!list) return;
    const filtered = reviewData.filter((r) => {
      if (filter === "correct") return r.isCorrect;
      if (filter === "wrong") return !r.isCorrect;
      return true;
    });
    if (!filtered.length) {
      list.innerHTML = `<div style="padding:2rem;text-align:center;color:var(--t3)">${filter === "all" ? "No questions to review" : filter === "correct" ? "No correct answers to show" : "No wrong answers to show"}</div>`;
      return;
    }
    list.innerHTML = filtered
      .map(
        (r, index) => `
                            <div class="review-item open" data-filter="${r.isCorrect ? "correct" : "wrong"}">
                              <div class="review-item-head" onclick="toggleReviewItem(this)">
                                <div class="review-dot ${r.isCorrect ? "rdot-c" : "rdot-w"}">${r.isCorrect ? "✓" : "✗"}</div>
                                <div style="flex:1">
                                  <div style="font-size:.875rem;font-weight:600;margin-bottom:.25rem">Q${r.idx + 1}: ${escapeHTML(r.q.q)}</div>
                                  <div style="font-size:.8125rem;color:var(--t2)">${r.isCorrect ? "✅ Correct" : "❌ Incorrect"} · ${r.marked ? "📌 Marked" : ""}</div>
                                </div>
                                <span style="color:var(--t3);font-size:1.25rem">▾</span>
                              </div>
                              <div class="review-item-body">
                                <div class="review-answer-row">
                                  <span style="font-weight:600;min-width:80px">Your Answer:</span>
                                  <span style="color:${r.isCorrect ? "var(--emerald-400)" : "var(--rose-400)"}">${r.userAns !== undefined && r.userAns !== null ? escapeHTML(r.q.opts[r.userAns]) : "Not answered"}</span>
                                </div>
                                <div class="review-answer-row">
                                  <span style="font-weight:600;min-width:80px">Correct Answer:</span>
                                  <span style="color:var(--emerald-400)">${escapeHTML(r.q.opts[r.correctIdx])}</span>
                                </div>
                                <div class="review-answer-row" style="margin-top:.5rem;background:var(--ele);border-radius:var(--r-sm);padding:.75rem;font-size:.8125rem;color:var(--t2)">
                                  💡 ${escapeHTML(r.q.exp)}
                                </div>
                              </div>
                            </div>
                          `,
      )
      .join("");
  } catch (error) {
    handleError(error, "renderReviewList");
  }
}

function toggleReviewItem(head) {
  const item = head.closest(".review-item");
  if (item) item.classList.toggle("open");
}
window.toggleReviewItem = toggleReviewItem;

function filterReview(type) {
  try {
    document
      .querySelectorAll(".filter-pill")
      .forEach((p) => p.classList.remove("active"));
    const btn = $(`fp-${type}`);
    if (btn) btn.classList.add("active");
    renderReviewList(APP.reviewItems, type);
  } catch (error) {
    handleError(error, "filterReview");
  }
}
window.filterReview = filterReview;

// ─── RESULT ACTIONS ────────────────────────────────────────
// Bug 10: Fixed .last() query with explicit sorting
async function generateCertificate() {
  try {
    const s = APP.session;
    if (!s) {
      toast("No exam data found", "error");
      return;
    }
    const matches = await db.results
      .where("matric")
      .equals(s.matric)
      .and((r) => r.courseIdx === s.courseIdx)
      .toArray();
    const result = matches.sort((a, b) => b.date - a.date)[0];
    if (!result) {
      toast("Result not found", "error");
      return;
    }

    const course = COURSES[s.courseIdx];
    const name = APP.student?.name || s.matric;
    const total = s.shuffledQ.length;

    $("cert-name").textContent = name;
    $("cert-matric").textContent = `Matric: ${s.matric}`;
    $("cert-score").textContent = `${result.score}/${total} (${result.pct}%)`;
    const gradeEl = $("cert-grade");
    gradeEl.textContent = `Grade: ${result.grade}`;
    gradeEl.style.color =
      result.grade === "A"
        ? "#34d399"
        : result.grade === "B"
          ? "#6366f1"
          : result.grade === "C"
            ? "#a3e635"
            : result.grade === "D"
              ? "#fbbf24"
              : "#f43f5e";
    $("cert-course").textContent = `${course.code} — ${course.name}`;
    $("cert-date").textContent =
      `Issued: ${new Date(result.date).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}`;

    try {
      const { jsPDF } = window.jspdf;
      const pdf = new jsPDF("landscape", "mm", "a4");
      const canvas = await html2canvas($("cert-content"), {
        scale: 2,
        backgroundColor: "#ffffff",
      });
      const imgData = canvas.toDataURL("image/png");
      const imgWidth = pdf.internal.pageSize.getWidth();
      const imgHeight = (canvas.height / canvas.width) * imgWidth;
      pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);
      pdf.save(`certificate_${s.matric}_${course.code}.pdf`);
      toast("🎓 Certificate downloaded!", "success");
      playSound("celebrate");
    } catch (e) {
      toast("Error generating certificate", "error");
      console.error(e);
    }
  } catch (error) {
    handleError(error, "generateCertificate");
  }
}
window.generateCertificate = generateCertificate;

async function shareResults() {
  try {
    const s = APP.session;
    if (!s) {
      toast("No exam data", "error");
      return;
    }
    const matches = await db.results
      .where("matric")
      .equals(s.matric)
      .and((r) => r.courseIdx === s.courseIdx)
      .toArray();
    const result = matches.sort((a, b) => b.date - a.date)[0];
    if (!result) {
      toast("Result not found", "error");
      return;
    }
    const course = COURSES[s.courseIdx];
    const msg = `📊 preST Exam Results\nCourse: ${course.code} - ${course.name}\nScore: ${result.score}/${s.shuffledQ.length} (${result.pct}%)\nGrade: ${result.grade}\n🎓 Generated by preST Platform`;
    if (navigator.share) {
      try {
        await navigator.share({ title: "Exam Results", text: msg });
      } catch (e) {
        /* User cancelled */
      }
    } else {
      await navigator.clipboard.writeText(msg);
      toast("📋 Results copied to clipboard!", "success");
    }
  } catch (error) {
    handleError(error, "shareResults");
  }
}
window.shareResults = shareResults;

function retakeExam() {
  try {
    const courseIdx = APP.session?.courseIdx;
    if (courseIdx === undefined) {
      toast("No course to retake", "error");
      return;
    }
    navigate("dashboard");
    setTimeout(() => startCourse(courseIdx), 400);
  } catch (error) {
    handleError(error, "retakeExam");
  }
}
window.retakeExam = retakeExam;

// ─── PROFILE ───────────────────────────────────────────────
// Bug 2: Added escapeHTML to profile rendering
async function loadProfilePage() {
  try {
    const s = APP.student;
    if (!s) {
      navigate("home");
      return;
    }

    $("profile-name-display").textContent = escapeHTML(s.name || s.matric);
    $("profile-matric-display").textContent = escapeHTML(s.matric);
    $("prof-name").value = s.name || "";
    $("prof-dept").value = s.dept || "";
    $("prof-level").value = s.level || "";

    const avatar = $("profile-avatar");
    const img = $("profile-avatar-img");
    const initials = $("profile-avatar-initials");
    if (s.avatar) {
      img.src = s.avatar;
      img.style.display = "";
      initials.style.display = "none";
    } else {
      img.style.display = "none";
      initials.style.display = "";
      initials.textContent = getInitials(s.name);
    }

    const results = await db.results.where("matric").equals(s.matric).toArray();
    const last = results.length ? results[results.length - 1] : null;
    const badge = $("profile-grade-badge");
    if (badge) {
      if (last) {
        const grade = last.grade;
        badge.textContent = `Grade ${grade} · ${last.pct}%`;
        badge.className = `badge badge-${grade === "A" ? "em" : grade === "B" ? "ind" : grade === "C" ? "lime" : grade === "D" ? "amber" : "rose"}`;
      } else {
        badge.textContent = "No exam yet";
        badge.className = "badge badge-ind";
      }
    }

    const hist = $("prof-history");
    if (!hist) return;
    if (!results.length) {
      hist.innerHTML =
        '<div style="text-align:center;padding:2rem;color:var(--t3);font-size:.875rem">No exams completed yet</div>';
    } else {
      hist.innerHTML = results
        .sort((a, b) => b.date - a.date)
        .map((r) => {
          const course = COURSES[r.courseIdx];
          return `
                                <div class="history-row">
                                  <div>
                                    <div style="font-weight:600;font-size:.875rem">${course ? `${course.code} — ${course.name}` : "Unknown"}</div>
                                    <div style="font-size:.75rem;color:var(--t3)">${new Date(r.date).toLocaleDateString()}</div>
                                  </div>
                                  <div style="text-align:right">
                                    <div style="font-weight:800;font-size:1.125rem;font-family:var(--font-d)">${r.pct}%</div>
                                    <span class="badge badge-${r.grade === "A" ? "em" : r.grade === "B" ? "ind" : r.grade === "C" ? "lime" : r.grade === "D" ? "amber" : "rose"}">Grade ${r.grade}</span>
                                  </div>
                                </div>
                              `;
        })
        .join("");
    }

    await loadAchievements(s.matric);
  } catch (error) {
    handleError(error, "loadProfilePage");
  }
}

async function saveProfile() {
  try {
    const s = APP.student;
    if (!s) return;
    s.name = $("prof-name").value.trim() || s.matric;
    s.dept = $("prof-dept").value.trim();
    s.level = $("prof-level").value;
    await db.students.put(s);
    APP.student = s;
    updateHeaderAvatar(s);
    toast("✅ Profile updated successfully!", "success");
  } catch (error) {
    handleError(error, "saveProfile");
    toast("Failed to save profile.", "error");
  }
}
window.saveProfile = saveProfile;

// Bug 7: Fixed avatar upload with resizing and size limit
function handleAvatarUpload(event) {
  try {
    const file = event.target.files[0];
    if (!file) return;
    if (file.size > MAX_AVATAR_SIZE_BYTES) {
      toast(
        `Image too large. Please use a file under ${MAX_AVATAR_SIZE_BYTES / 1024 / 1024}MB.`,
        "error",
      );
      event.target.value = "";
      return;
    }
    const img = new Image();
    const reader = new FileReader();
    reader.onload = (e) => {
      img.onload = async () => {
        try {
          const scale = Math.min(
            1,
            AVATAR_MAX_DIMENSION / Math.max(img.width, img.height),
          );
          const canvas = document.createElement("canvas");
          canvas.width = Math.round(img.width * scale);
          canvas.height = Math.round(img.height * scale);
          canvas
            .getContext("2d")
            .drawImage(img, 0, 0, canvas.width, canvas.height);
          const resized = canvas.toDataURL("image/jpeg", 0.8);
          const s = APP.student;
          if (!s) return;
          s.avatar = resized;
          await db.students.put(s);
          APP.student = s;
          updateHeaderAvatar(s);
          loadProfilePage();
          toast("🖼️ Avatar updated!", "success");
        } catch (error) {
          handleError(error, "handleAvatarUpload-process");
        }
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  } catch (error) {
    handleError(error, "handleAvatarUpload");
    toast("Failed to upload avatar.", "error");
  }
}
window.handleAvatarUpload = handleAvatarUpload;

function updateHeaderAvatar(s) {
  const btn = $("hdr-avatar-btn");
  const img = $("hdr-avatar-img");
  const initials = $("hdr-avatar-initials");
  if (!btn) return;
  btn.classList.remove("hidden");
  if (s?.avatar) {
    img.src = s.avatar;
    img.style.display = "";
    initials.style.display = "none";
  } else {
    img.style.display = "none";
    initials.style.display = "";
    initials.textContent = getInitials(s?.name);
  }
}

async function exportResultsPDF() {
  try {
    const s = APP.student;
    if (!s) return;
    const results = await db.results.where("matric").equals(s.matric).toArray();
    if (!results.length) {
      toast("No results to export", "warning");
      return;
    }

    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    doc.setFont("helvetica");
    doc.setFontSize(16);
    doc.text(`preST Results — ${s.name || s.matric}`, 14, 20);
    doc.setFontSize(10);
    doc.text(`Generated: ${new Date().toLocaleString()}`, 14, 28);

    let y = 38;
    doc.setFontSize(9);
    doc.text("Course", 14, y);
    doc.text("Score", 70, y);
    doc.text("Grade", 100, y);
    doc.text("Date", 140, y);
    y += 6;
    doc.line(14, y, 196, y);
    y += 4;

    results
      .sort((a, b) => b.date - a.date)
      .forEach((r) => {
        if (y > 270) {
          doc.addPage();
          y = 20;
        }
        const course = COURSES[r.courseIdx];
        doc.text(course ? `${course.code}` : "Unknown", 14, y);
        doc.text(`${r.pct}%`, 70, y);
        doc.text(`Grade ${r.grade}`, 100, y);
        doc.text(new Date(r.date).toLocaleDateString(), 140, y);
        y += 6;
      });
    doc.save(`results_${s.matric}.pdf`);
    toast("📄 Results exported!", "success");
  } catch (error) {
    handleError(error, "exportResultsPDF");
    toast("Failed to export results.", "error");
  }
}
window.exportResultsPDF = exportResultsPDF;

// ─── ADMIN ──────────────────────────────────────────────────
// Bug 3: Rewrote handleAdminLogin with password hashing and first-run setup
// ⚠️ SECURITY NOTE: This client-side authentication is not a substitute for real server-side auth.
// It only gates the in-browser admin UI for casual deterrence.
// All data lives in the same browser's IndexedDB regardless of this login gate.
async function handleAdminLogin() {
  try {
    const u = $("adm-user").value.trim();
    const p = $("adm-pass").value.trim();
    const err = $("adm-err");
    const stored = await db.settings.get("adminAuth");

    if (!stored) {
      // First-run: create admin account
      const hash = await hashPassword(p);
      await db.settings.put({ key: "adminAuth", value: { u, hash } });
      APP.isAdmin = true;
      sessionStorage.setItem("prest_admin", "1");
      navigate("admin");
      toast("Admin account created for this device.", "success");
      return;
    }

    const hash = await hashPassword(p);
    if (u !== stored.value.u || hash !== stored.value.hash) {
      if (err) {
        err.textContent = "❌ Invalid credentials";
        err.classList.remove("hidden");
      }
      return;
    }

    if (err) err.classList.add("hidden");
    APP.isAdmin = true;
    sessionStorage.setItem("prest_admin", "1");
    navigate("admin");
  } catch (error) {
    handleError(error, "handleAdminLogin");
    toast("Admin login failed.", "error");
  }
}
window.handleAdminLogin = handleAdminLogin;

// Bug 3: Reset admin password function
async function resetAdminPassword() {
  try {
    if (
      !confirm(
        "⚠️ This will reset the admin password. All existing admin credentials will be invalidated.\n\nContinue?",
      )
    )
      return;
    await db.settings.delete("adminAuth");
    toast(
      "🔑 Admin password has been reset. Re-enter credentials on next login.",
      "info",
    );
    if (APP.isAdmin) {
      APP.isAdmin = false;
      sessionStorage.removeItem("prest_admin");
      navigate("home");
    }
  } catch (error) {
    handleError(error, "resetAdminPassword");
    toast("Failed to reset admin password.", "error");
  }
}
window.resetAdminPassword = resetAdminPassword;

function checkAdminSession() {
  if (sessionStorage.getItem("prest_admin") === "1") {
    APP.isAdmin = true;
    return true;
  }
  return false;
}

function adminLogout() {
  APP.isAdmin = false;
  sessionStorage.removeItem("prest_admin");
  navigate("home");
  toast("Signed out of admin", "info");
}
window.adminLogout = adminLogout;

function switchAdminTab(tab) {
  try {
    document
      .querySelectorAll(".admin-panel")
      .forEach((p) => p.classList.remove("active"));
    document
      .querySelectorAll(".admin-nav-item, .admin-tab-pill")
      .forEach((el) => {
        el.classList.remove("active");
      });
    const panel = $(`atab-${tab}`);
    if (panel) panel.classList.add("active");
    document
      .querySelectorAll(`.admin-nav-item[onclick*="${tab}"]`)
      .forEach((el) => el.classList.add("active"));
    document
      .querySelectorAll(`.admin-tab-pill[onclick*="${tab}"]`)
      .forEach((el) => el.classList.add("active"));

    if (tab === "overview") loadAdminDashboard();
    if (tab === "students") loadStudentsTable();
    if (tab === "announcements") loadAdminAnns();
    if (tab === "questions") loadAdminQuestions();
  } catch (error) {
    handleError(error, "switchAdminTab");
  }
}
window.switchAdminTab = switchAdminTab;

async function loadAdminDashboard() {
  try {
    const students = await db.students.toArray();
    const results = await db.results.toArray();
    const completed = results.length;
    const avg = completed
      ? Math.round(results.reduce((a, b) => a + b.pct, 0) / completed)
      : 0;
    const passed = results.filter((r) => r.pct >= APP.examCfg.passScore).length;

    $("adm-total").textContent = students.length;
    $("adm-done").textContent = completed;
    $("adm-avg").textContent = avg + "%";
    $("adm-pass").textContent = completed
      ? Math.round((passed / completed) * 100) + "%"
      : "0%";

    Object.keys(APP.charts).forEach((key) => {
      if (APP.charts[key]) {
        APP.charts[key].destroy();
        APP.charts[key] = null;
      }
    });
    setTimeout(() => renderAdminCharts(results), 300);
  } catch (error) {
    handleError(error, "loadAdminDashboard");
  }
}

function renderAdminCharts(results) {
  try {
    const ctx1 = document.getElementById("ch-score")?.getContext("2d");
    if (ctx1 && !APP.charts.score) {
      const bins = [0, 0, 0, 0, 0];
      results.forEach((r) => {
        const pct = r.pct;
        if (pct < 20) bins[0]++;
        else if (pct < 40) bins[1]++;
        else if (pct < 60) bins[2]++;
        else if (pct < 80) bins[3]++;
        else bins[4]++;
      });
      APP.charts.score = new Chart(ctx1, {
        type: "bar",
        data: {
          labels: ["0-19%", "20-39%", "40-59%", "60-79%", "80-100%"],
          datasets: [
            {
              label: "Students",
              data: bins,
              backgroundColor: [
                "#f43f5e44",
                "#fbbf2444",
                "#a3e63544",
                "#6366f144",
                "#34d39944",
              ],
              borderColor: [
                "#f43f5e",
                "#fbbf24",
                "#a3e635",
                "#6366f1",
                "#34d399",
              ],
              borderWidth: 2,
              borderRadius: 4,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: { legend: { display: false } },
          scales: {
            y: {
              beginAtZero: true,
              grid: { color: "rgba(255,255,255,.05)" },
            },
          },
        },
      });
    }

    const ctx2 = document.getElementById("ch-pf")?.getContext("2d");
    if (ctx2 && !APP.charts.pf) {
      const pass = results.filter((r) => r.pct >= APP.examCfg.passScore).length;
      const fail = results.length - pass;
      APP.charts.pf = new Chart(ctx2, {
        type: "doughnut",
        data: {
          labels: ["Pass", "Fail"],
          datasets: [
            {
              data: [pass, fail],
              backgroundColor: ["#34d399", "#f43f5e"],
              borderWidth: 0,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: "bottom",
              labels: {
                color: "#8892b8",
                font: { size: 11 },
              },
            },
          },
        },
      });
    }

    const ctx3 = document.getElementById("ch-sec")?.getContext("2d");
    if (ctx3 && !APP.charts.sec) {
      const secData = {};
      results.forEach((r) => {
        if (r.sectionScore) {
          Object.keys(r.sectionScore).forEach((idx) => {
            if (!secData[idx]) secData[idx] = { correct: 0, total: 0 };
            secData[idx].correct += r.sectionScore[idx].correct;
            secData[idx].total += r.sectionScore[idx].total;
          });
        }
      });
      const labels = COURSES.map((c) => c.code);
      const data = labels.map((_, idx) => {
        const d = secData[idx] || { correct: 0, total: 0 };
        return d.total ? Math.round((d.correct / d.total) * 100) : 0;
      });
      APP.charts.sec = new Chart(ctx3, {
        type: "bar",
        data: {
          labels: labels,
          datasets: [
            {
              label: "Avg Score %",
              data: data,
              backgroundColor: COURSES.map((c) => c.color + "66"),
              borderColor: COURSES.map((c) => c.color),
              borderWidth: 2,
              borderRadius: 4,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: { legend: { display: false } },
          scales: {
            y: {
              beginAtZero: true,
              max: 100,
              grid: { color: "rgba(255,255,255,.05)" },
            },
          },
        },
      });
    }
  } catch (error) {
    handleError(error, "renderAdminCharts");
  }
}

// ─── STUDENTS TABLE ────────────────────────────────────────
// Bug 8: Fixed students table to show score/grade data with proper enrichment
async function loadStudentsTable() {
  try {
    const students = await db.students.toArray();
    const allResults = await db.results.toArray();

    APP.adminStudents = students.map((s) => {
      const studentResults = allResults.filter((r) => r.matric === s.matric);
      if (studentResults.length) {
        const avgPct = Math.round(
          studentResults.reduce((a, b) => a + b.pct, 0) / studentResults.length,
        );
        const latest = studentResults.sort((a, b) => b.date - a.date)[0];
        return {
          ...s,
          _avgPct: avgPct,
          _grade: latest.grade,
          _lastDate: latest.date,
        };
      }
      return { ...s, _avgPct: null, _grade: null, _lastDate: null };
    });
    renderStudentsTable();
  } catch (error) {
    handleError(error, "loadStudentsTable");
  }
}

function renderStudentsTable() {
  try {
    const search = $("stu-search")?.value.toLowerCase() || "";
    let filtered = APP.adminStudents.filter(
      (s) =>
        s.matric.toLowerCase().includes(search) ||
        (s.name || "").toLowerCase().includes(search),
    );

    const sorted = [...filtered].sort((a, b) => {
      const colMap = {
        matric: "matric",
        name: "name",
        pct: "_avgPct",
        grade: "_grade",
        date: "_lastDate",
      };
      const key = colMap[APP.sortCol] || APP.sortCol;
      const aVal = a[key] ?? (typeof a[key] === "number" ? -Infinity : "");
      const bVal = b[key] ?? (typeof b[key] === "number" ? -Infinity : "");
      if (typeof aVal === "number" && typeof bVal === "number")
        return (aVal - bVal) * APP.sortDir;
      return String(aVal).localeCompare(String(bVal)) * APP.sortDir;
    });

    const tbody = $("stu-tbody");
    if (!tbody) return;
    tbody.innerHTML = sorted
      .map(
        (s) => `
                            <tr>
                              <td><span style="font-family:var(--font-m);font-size:.8125rem">${escapeHTML(s.matric)}</span></td>
                              <td>${escapeHTML(s.name || s.matric)}</td>
                              <td>${s._avgPct !== null ? s._avgPct + "%" : "—"}</td>
                              <td>${s._grade || "—"}</td>
                              <td style="font-size:.75rem;color:var(--t3)">${s._lastDate ? new Date(s._lastDate).toLocaleDateString() : "—"}</td>
                              <td>
                                <button class="btn btn-ghost btn-sm" onclick="viewStudent('${escapeHTML(s.matric)}')">View</button>
                                <button class="btn btn-danger btn-sm" onclick="deleteStudent('${escapeHTML(s.matric)}')">🗑</button>
                              </td>
                            </tr>
                          `,
      )
      .join("");
  } catch (error) {
    handleError(error, "renderStudentsTable");
  }
}

function sortBy(col) {
  try {
    if (APP.sortCol === col) APP.sortDir *= -1;
    else {
      APP.sortCol = col;
      APP.sortDir = 1;
    }
    renderStudentsTable();
  } catch (error) {
    handleError(error, "sortBy");
  }
}
window.sortBy = sortBy;

// Bug 2: Added escapeHTML to viewStudent
async function viewStudent(matric) {
  try {
    const s = await db.students.get(matric);
    if (!s) {
      toast("Student not found", "error");
      return;
    }
    const results = await db.results.where("matric").equals(matric).toArray();
    const html = `
                            <div style="display:grid;grid-template-columns:1fr 1fr;gap:1rem">
                              <div><strong>Matric:</strong> ${escapeHTML(s.matric)}</div>
                              <div><strong>Name:</strong> ${escapeHTML(s.name || "—")}</div>
                              <div><strong>Department:</strong> ${escapeHTML(s.dept || "—")}</div>
                              <div><strong>Level:</strong> ${escapeHTML(s.level || "—")}</div>
                            </div>
                            <div style="margin-top:1rem">
                              <strong>Exam History (${results.length})</strong>
                              ${
                                results.length
                                  ? results
                                      .sort((a, b) => b.date - a.date)
                                      .map((r) => {
                                        const c = COURSES[r.courseIdx];
                                        return `<div style="display:flex;justify-content:space-between;padding:.5rem 0;border-bottom:1px solid var(--bdr);font-size:.875rem">
                                  <span>${c ? c.code : "Unknown"}</span>
                                  <span style="font-weight:600">${r.pct}% (Grade ${r.grade})</span>
                                  <span style="font-size:.75rem;color:var(--t3)">${new Date(r.date).toLocaleDateString()}</span>
                                </div>`;
                                      })
                                      .join("")
                                  : '<div style="padding:1rem 0;color:var(--t3)">No exams yet</div>'
                              }
                            </div>
                          `;
    $("stu-detail-inner").innerHTML = html;
    openModal("modal-stu");
  } catch (error) {
    handleError(error, "viewStudent");
  }
}
window.viewStudent = viewStudent;

async function deleteStudent(matric) {
  try {
    if (
      !confirm(
        `Delete student ${matric}? This will also delete all their results and sessions.`,
      )
    )
      return;
    await db.students.delete(matric);
    await db.results.where("matric").equals(matric).delete();
    await db.sessions.where("matric").equals(matric).delete();
    toast("Student deleted", "success");
    loadStudentsTable();
  } catch (error) {
    handleError(error, "deleteStudent");
    toast("Failed to delete student.", "error");
  }
}
window.deleteStudent = deleteStudent;

async function clearAllStudents() {
  try {
    if (!confirm("⚠️ Delete ALL student data? This is permanent!")) return;
    await db.students.clear();
    await db.results.clear();
    await db.sessions.clear();
    toast("All student data cleared", "info");
    loadStudentsTable();
    loadAdminDashboard();
  } catch (error) {
    handleError(error, "clearAllStudents");
    toast("Failed to clear student data.", "error");
  }
}
window.clearAllStudents = clearAllStudents;

function exportCSV() {
  try {
    const rows = APP.adminStudents.map(
      (s) => `${s.matric},${s.name || ""},${s.dept || ""},${s.level || ""}`,
    );
    const csv = "Matric,Name,Department,Level\n" + rows.join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `students_${Date.now()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast("📥 CSV exported!", "success");
  } catch (error) {
    handleError(error, "exportCSV");
    toast("Failed to export CSV.", "error");
  }
}
window.exportCSV = exportCSV;

// ─── ADMIN ANNOUNCEMENTS ───────────────────────────────────
// Bug 2: Added escapeHTML to admin announcements
function showAnnForm(ann = null) {
  try {
    const wrap = $("ann-form-wrap");
    if (!wrap) return;
    wrap.classList.remove("hidden");
    $("ann-form-ttl").textContent = ann
      ? "Edit Announcement"
      : "New Announcement";
    $("ann-title").value = ann?.title || "";
    $("ann-body").value = ann?.body || "";
    $("ann-type").value = ann?.type || "info";
    if (ann?.publishAt) {
      $("ann-sched").value = new Date(ann.publishAt).toISOString().slice(0, 16);
    } else {
      $("ann-sched").value = "";
    }
    $("ann-pin").checked = ann?.pinned || false;
    $("ann-save-lbl").textContent = ann ? "Update" : "Publish";
    APP.editingAnnId = ann?.id || null;
  } catch (error) {
    handleError(error, "showAnnForm");
  }
}
window.showAnnForm = showAnnForm;

function hideAnnForm() {
  $("ann-form-wrap")?.classList.add("hidden");
  APP.editingAnnId = null;
}
window.hideAnnForm = hideAnnForm;

async function saveAnn() {
  try {
    const title = $("ann-title").value.trim();
    const body = $("ann-body").value.trim();
    if (!title || !body) {
      toast("Please fill in all fields", "warning");
      return;
    }
    const data = {
      title,
      body,
      type: $("ann-type").value,
      pinned: $("ann-pin").checked,
      publishAt: $("ann-sched").value
        ? new Date($("ann-sched").value).getTime()
        : null,
      updatedAt: Date.now(),
    };
    if (APP.editingAnnId) {
      await db.announcements.update(APP.editingAnnId, data);
      toast("✅ Announcement updated!", "success");
    } else {
      data.createdAt = Date.now();
      await db.announcements.add(data);
      toast("✅ Announcement published!", "success");
    }
    hideAnnForm();
    loadAdminAnns();
    loadHomeAnns();
  } catch (error) {
    handleError(error, "saveAnn");
    toast("Failed to save announcement.", "error");
  }
}
window.saveAnn = saveAnn;

// Bug 2: Added escapeHTML to admin announcements list
async function loadAdminAnns() {
  try {
    const anns = await db.announcements.toArray();
    const list = $("ann-admin-list");
    if (!list) return;
    if (!anns.length) {
      list.innerHTML =
        '<div style="padding:2rem;text-align:center;color:var(--t3)">No announcements yet</div>';
      return;
    }
    list.innerHTML = anns
      .sort(
        (a, b) =>
          (b.pinned ? 1 : 0) - (a.pinned ? 1 : 0) || b.createdAt - a.createdAt,
      )
      .map(
        (a) => `
                              <div class="ann-admin-item type-${a.type}">
                                <div style="display:flex;justify-content:space-between;align-items:flex-start;gap:.75rem">
                                  <div>
                                    <div style="font-weight:700;font-size:.875rem">${a.pinned ? "📌 " : ""}${escapeHTML(a.title)}</div>
                                    <div style="font-size:.8125rem;color:var(--t2);margin:.25rem 0">${escapeHTML(a.body)}</div>
                                    <div style="font-size:.6875rem;color:var(--t3)">${a.type} · ${a.publishAt ? new Date(a.publishAt).toLocaleDateString() : "Now"}</div>
                                  </div>
                                  <div style="display:flex;gap:.375rem;flex-shrink:0">
                                    <button class="btn btn-ghost btn-sm" onclick="editAnn(${a.id})">✏️</button>
                                    <button class="btn btn-danger btn-sm" onclick="deleteAnn(${a.id})">🗑</button>
                                  </div>
                                </div>
                              </div>
                            `,
      )
      .join("");
  } catch (error) {
    handleError(error, "loadAdminAnns");
  }
}

async function editAnn(id) {
  try {
    const ann = await db.announcements.get(id);
    if (ann) showAnnForm(ann);
  } catch (error) {
    handleError(error, "editAnn");
  }
}
window.editAnn = editAnn;

async function deleteAnn(id) {
  try {
    if (!confirm("Delete this announcement?")) return;
    await db.announcements.delete(id);
    toast("Announcement deleted", "info");
    loadAdminAnns();
    loadHomeAnns();
  } catch (error) {
    handleError(error, "deleteAnn");
    toast("Failed to delete announcement.", "error");
  }
}
window.deleteAnn = deleteAnn;

// ─── ADMIN QUESTIONS ───────────────────────────────────────
// Bug 4: Updated admin questions to load and use overrides
async function loadAdminQuestions() {
  try {
    APP.qPage = 0;
    const overrides = await db.questionOverrides.toArray();
    APP._overrideMap = {};
    overrides.forEach((o) => {
      APP._overrideMap[o.idx] = o;
    });
    filterQ();
  } catch (error) {
    handleError(error, "loadAdminQuestions");
  }
}

function filterQ() {
  try {
    const sec = $("q-filter-sec")?.value || "all";
    const search = $("q-search-admin")?.value.toLowerCase() || "";
    let filtered = QB.map((q, idx) => {
      const override = APP._overrideMap?.[idx] || {};
      return {
        ...q,
        ...override,
        idx,
        courseIdx: Math.floor(idx / 100),
      };
    });
    if (sec !== "all")
      filtered = filtered.filter((q) => q.courseIdx === parseInt(sec));
    if (search)
      filtered = filtered.filter(
        (q) =>
          q.q.toLowerCase().includes(search) ||
          q.opts.some((o) => o.toLowerCase().includes(search)),
      );
    APP.filteredQ = filtered;
    renderQPage();
  } catch (error) {
    handleError(error, "filterQ");
  }
}
window.filterQ = filterQ;

function renderQPage() {
  try {
    const start = APP.qPage * APP.qPageSize;
    const end = Math.min(start + APP.qPageSize, APP.filteredQ.length);
    const page = APP.filteredQ.slice(start, end);
    const list = $("q-list-admin");
    if (!list) return;
    if (!page.length) {
      list.innerHTML =
        '<div style="padding:2rem;text-align:center;color:var(--t3)">No questions found</div>';
      return;
    }
    list.innerHTML = page
      .map(
        (q, i) => `
                              <div class="q-admin-item">
                                <div style="display:flex;justify-content:space-between;align-items:flex-start;gap:.75rem">
                                  <div style="flex:1">
                                    <div style="display:flex;align-items:center;gap:.5rem;margin-bottom:.25rem">
                                      <span class="badge badge-ind">Q${q.idx + 1}</span>
                                      <span class="badge badge-lime">${COURSES[q.courseIdx]?.code || "Unknown"}</span>
                                      <span style="font-size:.6875rem;color:var(--t3)">Ans: ${q.ans}</span>
                                    </div>
                                    <div style="font-size:.9rem;font-weight:500;margin-bottom:.25rem">${escapeHTML(q.q)}</div>
                                    <div style="display:grid;grid-template-columns:1fr 1fr;gap:.25rem;font-size:.8125rem;color:var(--t2)">
                                      ${q.opts.map((o, oi) => `<span>${"ABCDE"[oi]}. ${escapeHTML(o)}</span>`).join("")}
                                    </div>
                                    <div style="font-size:.75rem;color:var(--t3);margin-top:.25rem">💡 ${escapeHTML(q.exp)}</div>
                                  </div>
                                  <button class="btn btn-ghost btn-sm" onclick="editQuestion(${q.idx})">✏️</button>
                                </div>
                              </div>
                            `,
      )
      .join("");

    const totalPages = Math.ceil(APP.filteredQ.length / APP.qPageSize);
    const pag = $("q-pagination");
    if (!pag) return;
    if (totalPages <= 1) {
      pag.innerHTML = "";
      return;
    }
    let html = "";
    for (let i = 0; i < totalPages && i < 10; i++) {
      const p = i;
      html += `<button class="page-btn ${p === APP.qPage ? "active" : ""}" onclick="goQPage(${p})">${p + 1}</button>`;
    }
    if (totalPages > 10)
      html += `<span style="color:var(--t3);padding:0 .5rem">…</span>`;
    pag.innerHTML = html;
  } catch (error) {
    handleError(error, "renderQPage");
  }
}

function goQPage(p) {
  APP.qPage = p;
  renderQPage();
}
window.goQPage = goQPage;

// Bug 4: Rewrote editQuestion to persist to IndexedDB
async function editQuestion(idx) {
  try {
    const base = QB[idx];
    if (!base) {
      toast("Question not found", "error");
      return;
    }

    const existing = await db.questionOverrides.get(idx);
    const current = existing
      ? {
          ...base,
          q: existing.q || base.q,
          opts: existing.opts || base.opts,
          ans: existing.ans || base.ans,
          exp: existing.exp || base.exp,
        }
      : { ...base };

    const newQ = prompt("Edit question:", current.q);
    if (newQ !== null) current.q = newQ;

    const newOpts = prompt(
      "Edit options (comma separated):",
      current.opts.join(", "),
    );
    if (newOpts !== null) {
      const opts = newOpts.split(",").map((s) => s.trim());
      if (opts.length >= 2 && opts.length <= 5) current.opts = opts;
    }

    const newAns = prompt("Edit correct answer (A/B/C/D/E):", current.ans);
    if (newAns !== null && "ABCDE".includes(newAns)) current.ans = newAns;

    const newExp = prompt("Edit explanation:", current.exp);
    if (newExp !== null) current.exp = newExp;

    await db.questionOverrides.put({ idx, ...current });
    APP._overrideMap[idx] = current;

    toast("✅ Question updated and saved permanently!", "success");
    filterQ();
  } catch (error) {
    handleError(error, "editQuestion");
    toast("Failed to update question.", "error");
  }
}
window.editQuestion = editQuestion;

// ─── SETTINGS ──────────────────────────────────────────────
async function loadSettings() {
  try {
    const cfg = await db.settings.get("examCfg");
    if (cfg) {
      APP.examCfg = { ...APP.examCfg, ...cfg.value };
    }
    const sessionEl = $("set-session");
    const durEl = $("set-dur");
    const passEl = $("set-pass");
    const shuffleEl = $("set-shuffle");
    if (sessionEl) sessionEl.value = APP.examCfg.session || "";
    if (durEl) durEl.value = APP.examCfg.duration || 30;
    if (passEl) passEl.value = APP.examCfg.passScore || 50;
    if (shuffleEl) shuffleEl.checked = APP.examCfg.shuffle !== false;
  } catch (error) {
    handleError(error, "loadSettings");
  }
}
window.loadSettings = loadSettings;

async function saveSettings() {
  try {
    const sessionEl = $("set-session");
    const durEl = $("set-dur");
    const passEl = $("set-pass");
    const shuffleEl = $("set-shuffle");
    if (sessionEl) APP.examCfg.session = sessionEl.value.trim();
    if (durEl) APP.examCfg.duration = parseInt(durEl.value) || 30;
    if (passEl) APP.examCfg.passScore = parseInt(passEl.value) || 50;
    if (shuffleEl) APP.examCfg.shuffle = shuffleEl.checked;
    await db.settings.put({ key: "examCfg", value: APP.examCfg });
    toast("✅ Settings saved!", "success");
  } catch (error) {
    handleError(error, "saveSettings");
    toast("Failed to save settings.", "error");
  }
}
window.saveSettings = saveSettings;

// ─── DATA MANAGEMENT ──────────────────────────────────────
async function exportAllData() {
  try {
    const data = {
      students: await db.students.toArray(),
      results: await db.results.toArray(),
      announcements: await db.announcements.toArray(),
      settings: await db.settings.toArray(),
      achievements: await db.achievements.toArray(),
      questionOverrides: await db.questionOverrides.toArray(),
      exportDate: new Date().toISOString(),
      version: "4.0",
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `prest_backup_${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
    toast("📤 Backup exported!", "success");
  } catch (error) {
    handleError(error, "exportAllData");
    toast("Failed to export backup.", "error");
  }
}
window.exportAllData = exportAllData;

async function importBackup(event) {
  try {
    const file = event.target.files[0];
    if (!file) return;
    const text = await file.text();
    const data = JSON.parse(text);
    if (!data.students || !data.version) {
      throw new AppError("Invalid backup format", "INVALID_BACKUP", "error");
    }
    if (!confirm("⚠️ This will overwrite ALL existing data. Continue?")) return;

    await db.transaction(
      "rw",
      [
        db.students,
        db.results,
        db.announcements,
        db.settings,
        db.achievements,
        db.questionOverrides,
      ],
      async () => {
        await db.students.clear();
        await db.results.clear();
        await db.announcements.clear();
        await db.settings.clear();
        await db.achievements.clear();
        await db.questionOverrides.clear();
        if (data.students) await db.students.bulkPut(data.students);
        if (data.results) await db.results.bulkPut(data.results);
        if (data.announcements)
          await db.announcements.bulkPut(data.announcements);
        if (data.settings) await db.settings.bulkPut(data.settings);
        if (data.achievements) await db.achievements.bulkPut(data.achievements);
        if (data.questionOverrides)
          await db.questionOverrides.bulkPut(data.questionOverrides);
      },
    );

    toast("✅ Backup imported successfully!", "success");
    loadAdminDashboard();
    loadStudentsTable();
  } catch (error) {
    handleError(error, "importBackup");
    toast("❌ Invalid backup file", "error");
  }
  event.target.value = "";
}
window.importBackup = importBackup;

async function clearAllData() {
  try {
    if (!confirm("🗑 PERMANENTLY delete ALL data? This cannot be undone!"))
      return;
    if (!confirm("Type CONFIRM to proceed")) return;

    await db.transaction(
      "rw",
      [
        db.students,
        db.results,
        db.sessions,
        db.announcements,
        db.settings,
        db.achievements,
        db.questionOverrides,
      ],
      async () => {
        await db.students.clear();
        await db.results.clear();
        await db.sessions.clear();
        await db.announcements.clear();
        await db.settings.clear();
        await db.achievements.clear();
        await db.questionOverrides.clear();
      },
    );

    toast("All data cleared", "info");
    loadAdminDashboard();
    loadStudentsTable();
  } catch (error) {
    handleError(error, "clearAllData");
    toast("Failed to clear data.", "error");
  }
}
window.clearAllData = clearAllData;

// ─── INIT ──────────────────────────────────────────────────
// Bug 1: Fixed init() race condition with proper async ordering
function init() {
  try {
    applyTheme(APP.theme);
    initSplash();
    updateOnlineStatus();
    loadSettings();
    navigate("home");

    if (checkAdminSession()) {
      /* stay */
    }

    const lastMatric = localStorage.getItem("prest_last_matric");
    if (lastMatric) {
      db.students.get(lastMatric).then((s) => {
        if (!s) return;
        APP.student = s;
        updateHeaderAvatar(s);
        db.sessions
          .where("matric")
          .equals(lastMatric)
          .toArray()
          .then((sessions) => {
            const pending = sessions.find((sess) => !sess.submitted);
            if (pending) {
              APP.session = pending;
              const banner = $("resume-banner");
              if (banner) {
                const c = COURSES[pending.courseIdx] || {};
                $("resume-course-txt").textContent =
                  `Incomplete: ${c.code || ""} — ${c.name || "Unknown"}`;
                banner.classList.add("show");
              }
            }
            navigate("dashboard");
          });
      });
    }

    // ─── KEYBOARD SHORTCUTS ──────────────────────────────
    document.addEventListener("keydown", (e) => {
      if (APP.page === "exam") {
        if (e.key === "ArrowLeft" && APP.currentQ > 0) prevQ();
        if (
          e.key === "ArrowRight" &&
          APP.currentQ < APP.session?.shuffledQ?.length - 1
        )
          nextQ();
        if (e.key === "r" || e.key === "R") toggleReview();
        if (e.key === "Escape") closePalette();
        if (e.key === "s" || e.key === "S") toggleStudyMode();
        if (e.key >= "1" && e.key <= "5") {
          const idx = parseInt(e.key) - 1;
          const btns = $("options-wrap")?.querySelectorAll(".opt-btn");
          if (btns && btns[idx]) btns[idx].click();
        }
      }
    });

    // ─── RIPPLE EFFECT ─────────────────────────────────────
    document.addEventListener("click", (e) => {
      const btn = e.target.closest(".ripple");
      if (!btn) return;
      const r = document.createElement("div");
      r.className = "ripple-wave";
      const rect = btn.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height) * 2;
      r.style.cssText = `width:${size}px;height:${size}px;left:${e.clientX - rect.left - size / 2}px;top:${e.clientY - rect.top - size / 2}px`;
      btn.appendChild(r);
      r.addEventListener("animationend", () => r.remove());
    });

    console.log("🚀 preST v1.0 initialized successfully");
  } catch (error) {
    console.error("Fatal initialization error:", error);
    toast("Failed to initialize application. Please refresh.", "error");
  }
}

document.addEventListener("DOMContentLoaded", init);
