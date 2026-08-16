export type Question = {
  id: number;
  level: string; // e.g. "Round 1 — General Trivia", "Round 2 — Rapid Fire", "Round 3 — Buzzer Round", "Round 4 — Connect the Dots", "Round 5 — Audience Round"
  category: "General Trivia" | "Rapid Fire" | "Buzzer Round" | "Connect the Dots" | "Audience Round";
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  clues?: string[]; // For Buzzer round progressive reveals
  points: number;
};

export const roundDescriptions: Record<string, { title: string; subtitle: string; scoreRule: string }> = {
  "General Trivia": {
    title: "Round 1 — General Trivia",
    subtitle: "Warm-up round. Easy to medium difficulty.",
    scoreRule: "Easy +10 · Medium +15 · Hard +20"
  },
  "Rapid Fire": {
    title: "Round 2 — Rapid Fire",
    subtitle: "Seconds on the clock. Trust your instincts!",
    scoreRule: "+10 flat + speed bonus for quick answers"
  },
  "Buzzer Round": {
    title: "Round 3 — Buzzer Round",
    subtitle: "Step-by-step clues revealed one by one. First to spot it wins!",
    scoreRule: "+15 points · Clue-by-clue progressive reveal"
  },
  "Connect the Dots": {
    title: "Round 4 — Connect the Dots",
    subtitle: "Analyze the sequence of 4 clues and find the hidden connection.",
    scoreRule: "+20 points for full pattern connection"
  },
  "Audience Round": {
    title: "Round 5 — Audience Round",
    subtitle: "For the whole room. Everyone plays, everyone can score!",
    scoreRule: "Bonus points · Whole room participation"
  }
};

export const questions: Question[] = [
  /* ───────────── ROUND 1: GENERAL TRIVIA ───────────── */
  {
    id: 1,
    level: "Round 1 — General Trivia",
    category: "General Trivia",
    question: "Which app's logo is a white paper airplane on a blue background?",
    options: ["Telegram", "WhatsApp", "Twitter / X", "Signal"],
    correctAnswer: 0,
    explanation: "Telegram's iconic logo features a sleek white paper plane inside a bright blue circle.",
    points: 10
  },
  {
    id: 2,
    level: "Round 1 — General Trivia",
    category: "General Trivia",
    question: "What does the term 'AI' stand for?",
    options: ["Automated Interface", "Artificial Intelligence", "Augmented Insight", "Applied Integration"],
    correctAnswer: 1,
    explanation: "AI stands for Artificial Intelligence, referring to machines and systems designed to mimic human cognitive processes.",
    points: 10
  },
  {
    id: 3,
    level: "Round 1 — General Trivia",
    category: "General Trivia",
    question: "Which of these is NOT a real Instagram feature — Reels, Stories, Snaps, or Close Friends?",
    options: ["Reels", "Stories", "Snaps", "Close Friends"],
    correctAnswer: 2,
    explanation: "Snaps is a feature and term exclusive to Snapchat, whereas Reels, Stories, and Close Friends are Instagram features.",
    points: 10
  },
  {
    id: 4,
    level: "Round 1 — General Trivia",
    category: "General Trivia",
    question: "Which Indian city is nicknamed the 'Silicon Valley of India'?",
    options: ["Bengaluru", "Hyderabad", "Pune", "Gurugram"],
    correctAnswer: 0,
    explanation: "Bengaluru (Bangalore) earned this nickname as India's leading IT exporter and technology innovation hub.",
    points: 15
  },
  {
    id: 5,
    level: "Round 1 — General Trivia",
    category: "General Trivia",
    question: "Which tech giant was originally named 'BackRub' before its famous rebrand?",
    options: ["Google", "Yahoo", "Amazon", "Microsoft"],
    correctAnswer: 0,
    explanation: "Larry Page and Sergey Brin originally named their search engine 'BackRub' in 1996 because it analyzed web backlinks before renaming it Google.",
    points: 15
  },
  {
    id: 6,
    level: "Round 1 — General Trivia",
    category: "General Trivia",
    question: "Every slide of this quiz has one word on it somewhere — what's the name of today's orientation program?",
    options: ["Deeksharambh", "Aarambh", "Nav-Tarang", "Freshers Hub"],
    correctAnswer: 0,
    explanation: "'Deeksharambh' is the official student induction and orientation program designed to welcome freshers to KRMU!",
    points: 15
  },
  {
    id: 7,
    level: "Round 1 — General Trivia",
    category: "General Trivia",
    question: "True or False: The Great Wall of China is visible from space with the naked eye.",
    options: ["True", "False"],
    correctAnswer: 1,
    explanation: "False — it's a popular myth. NASA astronauts have confirmed the Great Wall cannot be seen without magnification in low Earth orbit.",
    points: 20
  },
  {
    id: 8,
    level: "Round 1 — General Trivia",
    category: "General Trivia",
    question: "Which country is credited with sending the world's first emoji out into the wild, back in 1999?",
    options: ["Japan", "South Korea", "United States", "Sweden"],
    correctAnswer: 0,
    explanation: "Shigetaka Kurita created the first set of 176 emojis in 1999 for Japanese mobile operator NTT DoCoMo.",
    points: 20
  },

  /* ───────────── ROUND 2: RAPID FIRE ───────────── */
  {
    id: 9,
    level: "Round 2 — Rapid Fire",
    category: "Rapid Fire",
    question: "Either/Or: Instagram or Snapchat — which app launched first?",
    options: ["Instagram (2010)", "Snapchat (2011)"],
    correctAnswer: 0,
    explanation: "Instagram launched in October 2010, whereas Snapchat launched nearly a year later in July 2011.",
    points: 10
  },
  {
    id: 10,
    level: "Round 2 — Rapid Fire",
    category: "Rapid Fire",
    question: "What's the name of the tech company that started as an online bookstore and is now named after a rainforest?",
    options: ["Amazon", "Flipkart", "eBay", "Rakuten"],
    correctAnswer: 0,
    explanation: "Jeff Bezos founded Amazon in 1994 as an online marketplace for books before expanding into e-commerce, cloud, and tech.",
    points: 10
  },
  {
    id: 11,
    level: "Round 2 — Rapid Fire",
    category: "Rapid Fire",
    question: "Either/Or: iOS or Android — which one is open-source?",
    options: ["iOS", "Android"],
    correctAnswer: 1,
    explanation: "Android's core code is released under the Android Open Source Project (AOSP), whereas iOS is proprietary.",
    points: 10
  },
  {
    id: 12,
    level: "Round 2 — Rapid Fire",
    category: "Rapid Fire",
    question: "What is the capital city of Japan?",
    options: ["Tokyo", "Kyoto", "Osaka", "Yokohama"],
    correctAnswer: 0,
    explanation: "Tokyo has been the capital city and seat of government of Japan since 1868.",
    points: 10
  },
  {
    id: 13,
    level: "Round 2 — Rapid Fire",
    category: "Rapid Fire",
    question: "Identify: Which global tech brand's logo features a bitten apple?",
    options: ["Apple", "Blackberry", "Android", "Windows"],
    correctAnswer: 0,
    explanation: "Rob Janoff designed Apple's famous bitten apple logo in 1977 so it wouldn't be mistaken for a cherry.",
    points: 10
  },
  {
    id: 14,
    level: "Round 2 — Rapid Fire",
    category: "Rapid Fire",
    question: "Which messaging app features a green icon with a white phone receiver?",
    options: ["WhatsApp", "WeChat", "LINE", "Telegram"],
    correctAnswer: 0,
    explanation: "WhatsApp's green icon featuring a phone inside a speech bubble is used by over 2 billion users worldwide.",
    points: 10
  },
  {
    id: 15,
    level: "Round 2 — Rapid Fire",
    category: "Rapid Fire",
    question: "In what year did India gain independence from British rule?",
    options: ["1947", "1950", "1942", "1952"],
    correctAnswer: 0,
    explanation: "India achieved independence at midnight on August 15, 1947.",
    points: 10
  },
  {
    id: 16,
    level: "Round 2 — Rapid Fire",
    category: "Rapid Fire",
    question: "Either/Or: Cricket or Kabaddi — which one originated in India?",
    options: ["Cricket", "Kabaddi"],
    correctAnswer: 1,
    explanation: "Kabaddi is an ancient contact sport that originated in India thousands of years ago, while Cricket originated in England.",
    points: 10
  },

  /* ───────────── ROUND 3: BUZZER ROUND ───────────── */
  {
    id: 17,
    level: "Round 3 — Buzzer Round",
    category: "Buzzer Round",
    question: "Identify this iconic Character based on progressive clues:",
    clues: [
      "Bitten in a lab accident, not born with his powers",
      "Balances being a student with a secret double life",
      "Known for his witty one-liners while fighting crime",
      "Wears a red and blue suit and swings on webs between buildings"
    ],
    options: ["Spider-Man", "Iron Man", "Batman", "Deadpool"],
    correctAnswer: 0,
    explanation: "Peter Parker gained superhero abilities after being bitten by a radioactive spider in a lab accident.",
    points: 15
  },
  {
    id: 18,
    level: "Round 3 — Buzzer Round",
    category: "Buzzer Round",
    question: "Identify this global Brand based on progressive clues:",
    clues: [
      "Named after a Greek goddess of victory",
      "Its logo is a simple curved 'swoosh'",
      "Its most famous slogan is 'Just Do It'",
      "Makes Air Jordans and world-famous athletic sneakers"
    ],
    options: ["Nike", "Adidas", "Puma", "Reebok"],
    correctAnswer: 0,
    explanation: "Nike was named after the Greek goddess of victory, and Carolyn Davidson created its iconic swoosh logo in 1971.",
    points: 15
  },
  {
    id: 19,
    level: "Round 3 — Buzzer Round",
    category: "Buzzer Round",
    question: "Identify this blockbuster Movie based on progressive clues:",
    clues: [
      "Set on a distant, lush alien moon named Pandora",
      "Features a blue-skinned native species called the Na'vi",
      "Directed by James Cameron",
      "Became the highest-grossing film of all time ($2.9B+)"
    ],
    options: ["Avatar", "Star Wars", "Guardians of the Galaxy", "Interstellar"],
    correctAnswer: 0,
    explanation: "Released in 2009 by James Cameron, Avatar broke all global box office records.",
    points: 15
  },
  {
    id: 20,
    level: "Round 3 — Buzzer Round",
    category: "Buzzer Round",
    question: "Identify this tech Company / Platform based on progressive clues:",
    clues: [
      "Once famous for a strict 140-character tweet limit",
      "Its iconic blue bird logo is now gone",
      "Rebranded to a single stylized letter in 2023",
      "Owned by Elon Musk"
    ],
    options: ["Twitter (now X)", "Threads", "Reddit", "Facebook"],
    correctAnswer: 0,
    explanation: "Twitter rebranded to 'X' in July 2023 under Elon Musk, replacing the classic blue bird logo.",
    points: 15
  },
  {
    id: 21,
    level: "Round 3 — Buzzer Round",
    category: "Buzzer Round",
    question: "Identify this global Event based on progressive clues:",
    clues: [
      "Held once every four years featuring global athletes",
      "Uses a legendary torch relay to open the games",
      "Athletes compete for gold, silver, and bronze medals",
      "Paris hosted the most recent 2024 edition"
    ],
    options: ["The Olympics", "FIFA World Cup", "Commonwealth Games", "Asian Games"],
    correctAnswer: 0,
    explanation: "The Olympic Games gather top athletes worldwide every four years, with Paris hosting the 2024 Summer Olympics.",
    points: 15
  },
  {
    id: 22,
    level: "Round 3 — Buzzer Round",
    category: "Buzzer Round",
    question: "Identify this tech Legend based on progressive clues:",
    clues: [
      "Co-founded a tech empire in a family garage",
      "Famous for wearing a signature black turtleneck",
      "Was ousted from his own company, then returned to save it",
      "Introduced the world to the Macintosh & iPhone"
    ],
    options: ["Steve Jobs", "Bill Gates", "Elon Musk", "Mark Zuckerberg"],
    correctAnswer: 0,
    explanation: "Steve Jobs co-founded Apple in 1976, revolutionizing personal computers, digital music, and smartphones.",
    points: 15
  },

  /* ───────────── ROUND 4: CONNECT THE DOTS ───────────── */
  {
    id: 23,
    level: "Round 4 — Connect the Dots",
    category: "Connect the Dots",
    question: "Java → Python → Ruby → Swift → ?",
    options: [
      "They are all Programming Languages",
      "They are all Web Browsers",
      "They are all Tech CEOs",
      "They are all Operating Systems"
    ],
    correctAnswer: 0,
    explanation: "All items in this sequence are popular high-level computer programming languages!",
    points: 20
  },
  {
    id: 24,
    level: "Round 4 — Connect the Dots",
    category: "Connect the Dots",
    question: "Titanic → Avatar → Avengers: Endgame → Star Wars: The Force Awakens → ?",
    options: [
      "All ranked among the Highest-Grossing Films of All Time",
      "All won Oscar Best Picture awards",
      "All were directed by James Cameron",
      "All were filmed in New Zealand"
    ],
    correctAnswer: 0,
    explanation: "Every film listed has grossed over $2 Billion worldwide, occupying top positions on the all-time box office chart.",
    points: 20
  },
  {
    id: 25,
    level: "Round 4 — Connect the Dots",
    category: "Connect the Dots",
    question: "Bengaluru → Hyderabad → Pune → Gurugram → ?",
    options: [
      "All major IT & Tech Hub Cities in India",
      "Capital Cities of Indian States",
      "Major Coastal Port Cities of India",
      "Union Territories of India"
    ],
    correctAnswer: 0,
    explanation: "These 4 Indian cities form the primary backbone of India's technology, software exports, and tech startup ecosystem.",
    points: 20
  },
  {
    id: 26,
    level: "Round 4 — Connect the Dots",
    category: "Connect the Dots",
    question: "Elon Musk → Jeff Bezos → Richard Branson → ?",
    options: [
      "Billionaires who built their own private space companies",
      "Owners of social media platforms",
      "Founders of EV automobile companies",
      "Pioneers of AI search engines"
    ],
    correctAnswer: 0,
    explanation: "Musk (SpaceX), Bezos (Blue Origin), and Branson (Virgin Galactic) are all billionaires funding private space exploration.",
    points: 20
  },

  /* ───────────── ROUND 5: AUDIENCE ROUND ───────────── */
  {
    id: 27,
    level: "Round 5 — Audience Round",
    category: "Audience Round",
    question: "Raise your hand if you've ever nodded along to a meme you didn't actually understand!",
    options: [
      "Yes - all the time!",
      "No - I understand every meme",
      "Only on Mondays",
      "What is a meme?"
    ],
    correctAnswer: 0,
    explanation: "No wrong answers — full marks for honesty! Memes evolve faster than college schedules.",
    points: 15
  },
  {
    id: 28,
    level: "Round 5 — Audience Round",
    category: "Audience Round",
    question: "Closest guess wins: roughly how many new students got admitted to KRMU this year?",
    options: [
      "~2,500+ Freshers",
      "~1,000 Students",
      "~5,000 Students",
      "~500 Students"
    ],
    correctAnswer: 0,
    explanation: "KRMU welcomed over 2,500+ bright new freshers across various undergraduate and postgraduate programs!",
    points: 15
  },
  {
    id: 29,
    level: "Round 5 — Audience Round",
    category: "Audience Round",
    question: "Guess it: how many hours a day do you think the average college student spends on their phone?",
    options: [
      "6–8 hours a day",
      "1–2 hours a day",
      "3–4 hours a day",
      "10+ hours a day"
    ],
    correctAnswer: 0,
    explanation: "Studies show college students spend roughly 6 to 8 hours daily on smartphones for learning and entertainment!",
    points: 15
  },
  {
    id: 30,
    level: "Round 5 — Audience Round",
    category: "Audience Round",
    question: "Pick a side: Instagram Reels or YouTube Shorts — raise your hand for whichever you scroll more!",
    options: [
      "Instagram Reels",
      "YouTube Shorts",
      "Both equally",
      "Neither"
    ],
    correctAnswer: 0,
    explanation: "No single right answer — just bragging rights! Both platforms dominate short-form entertainment.",
    points: 15
  },
  {
    id: 31,
    level: "Round 5 — Audience Round",
    category: "Audience Round",
    question: "Estimate it: how many cups of chai do you think the KRMU canteen serves in a single day?",
    options: [
      "1,500+ cups of chai",
      "200 cups of chai",
      "500 cups of chai",
      "5,000 cups of chai"
    ],
    correctAnswer: 0,
    explanation: "Chai is the ultimate fuel for college lectures, campus hangouts, and study sessions at KRMU!",
    points: 15
  },
  {
    id: 32,
    level: "Round 5 — Audience Round",
    category: "Audience Round",
    question: "Turn to the person next to you. In 15 seconds, find one thing you both have in common. GO!",
    options: [
      "Found something in common!",
      "Still searching...",
      "Made a new friend!",
      "Shy to ask!"
    ],
    correctAnswer: 0,
    explanation: "If you're still talking when the timer stops — congratulations, you just made your first new friend at KRMU!",
    points: 15
  }
];

export const categories = [
  "All",
  "General Trivia",
  "Rapid Fire",
  "Buzzer Round",
  "Connect the Dots",
  "Audience Round"
] as const;

export function getQuestionsByCategory(category: string): Question[] {
  if (category === "All") return questions;
  return questions.filter((q) => q.category === category);
}