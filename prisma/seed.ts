import 'dotenv/config';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const questions = [
  // 1
  {
    level: "GK",
    question: "Who is the current Secretary-General of the United Nations (2024)?",
    options: JSON.stringify(["António Guterres", "Ban Ki-moon", "Kofi Annan", "Boutros Boutros-Ghali"]),
    correctAnswer: "0",
    explanation: "António Guterres, former Prime Minister of Portugal, took office as the ninth Secretary-General of the United Nations in 2017. He has prioritized issues like climate change, humanitarian crises, and global peace, aiming to make the UN more effective in addressing 21st-century challenges."
  },
  // 2
  {
    level: "IPL",
    question: "Who won the 'Orange Cap' in IPL 2023?",
    options: JSON.stringify(["Faf du Plessis", "Virat Kohli", "Shubman Gill", "Jos Buttler"]),
    correctAnswer: "2",
    explanation: "Shubman Gill clinched the Orange Cap in IPL 2023, scoring the highest runs in the tournament. His brilliant form and consistency showcased his maturity as a top-order batsman for Gujarat Titans."
  },
  // 3
  {
    level: "Science",
    question: "What is the chemical symbol for Gold?",
    options: JSON.stringify(["Ag", "Au", "Gd", "Go"]),
    correctAnswer: "1",
    explanation: "Gold's symbol 'Au' comes from its Latin name 'Aurum'. Gold has fascinated civilizations for millennia for its rarity, luster, and malleability, making it a standard for currency and jewelry."
  },
  // 4
  {
    level: "Tech",
    question: "Who is known as the 'Father of the Computer'?",
    options: JSON.stringify(["Charles Babbage", "Alan Turing", "Bill Gates", "Ada Lovelace"]),
    correctAnswer: "0",
    explanation: "Charles Babbage is called the 'Father of the Computer' for designing the first automatic mechanical computer, the Analytical Engine, in the 19th century. His work laid the groundwork for modern computers."
  },
  // 5
  {
    level: "Hard",
    question: "Which Indian mathematician solved the Riemann Hypothesis?",
    options: JSON.stringify(["Srinivasa Ramanujan", "Manjul Bhargava", "No one yet", "C.R. Rao"]),
    correctAnswer: "2",
    explanation: "Despite being one of the most famous unsolved problems in mathematics, the Riemann Hypothesis remains unproven as of 2024. It concerns the distribution of prime numbers and has profound implications in number theory."
  },
  // 6
  {
    level: "GK",
    question: "Who was the first woman to win a Nobel Prize?",
    options: JSON.stringify(["Marie Curie", "Mother Teresa", "Dorothy Hodgkin", "Rosalind Franklin"]),
    correctAnswer: "0",
    explanation: "Marie Curie won the Nobel Prize in Physics in 1903 for her pioneering research on radioactivity, becoming the first woman to win a Nobel and the only person to win in two scientific fields (Physics and Chemistry)."
  },
  // 7
  {
    level: "IPL",
    question: "Which team has won the most IPL titles as of 2024?",
    options: JSON.stringify(["Chennai Super Kings", "Mumbai Indians", "Kolkata Knight Riders", "Royal Challengers Bangalore"]),
    correctAnswer: "1",
    explanation: "Mumbai Indians have clinched the IPL trophy five times, demonstrating remarkable consistency and depth in their squad, especially under the leadership of Rohit Sharma."
  },
  // 8
  {
    level: "Science",
    question: "Which gas is most abundant in the Earth's atmosphere?",
    options: JSON.stringify(["Oxygen", "Nitrogen", "Carbon Dioxide", "Argon"]),
    correctAnswer: "1",
    explanation: "Nitrogen makes up about 78% of Earth's atmosphere. Its inert nature helps stabilize the air, while oxygen (21%) is essential for most life forms."
  },
  // 9
  {
    level: "Tech",
    question: "What does 'HTTP' stand for?",
    options: JSON.stringify(["HyperText Transmission Protocol", "HyperText Transfer Protocol", "HighText Transfer Protocol", "HyperTransfer Text Protocol"]),
    correctAnswer: "1",
    explanation: "HTTP, or HyperText Transfer Protocol, is the foundational protocol used for transmitting web pages on the Internet. It defines how messages are formatted and transmitted between clients and servers."
  },
  // 10
  {
    level: "Hard",
    question: "What is the value of Planck’s constant (h) in Js (rounded to 6 decimals)?",
    options: JSON.stringify(["6.626070", "3.141592", "9.806650", "1.602176"]),
    correctAnswer: "0",
    explanation: "Planck's constant (6.626070 x 10⁻³⁴ Js) is a fundamental constant in quantum mechanics, relating the energy of a photon to its frequency. It's crucial in the calculation of energy levels in atoms."
  },
  // 11
  {
    level: "GK",
    question: "Who was the first President of independent India?",
    options: JSON.stringify(["Rajendra Prasad", "S. Radhakrishnan", "Jawaharlal Nehru", "V.V. Giri"]),
    correctAnswer: "0",
    explanation: "Dr. Rajendra Prasad served as the first President of India from 1950 to 1962, playing a vital role in shaping the newly independent nation’s constitutional framework."
  },
  // 12
  {
    level: "IPL",
    question: "Which bowler has the most wickets in IPL history (till 2024)?",
    options: JSON.stringify(["Lasith Malinga", "Yuzvendra Chahal", "Dwayne Bravo", "Jasprit Bumrah"]),
    correctAnswer: "1",
    explanation: "Yuzvendra Chahal surpassed legends like Malinga and Bravo to become the IPL’s leading wicket-taker, known for his clever leg-spin and crucial breakthroughs."
  },
  // 13
  {
    level: "Science",
    question: "What is the powerhouse of the cell?",
    options: JSON.stringify(["Nucleus", "Mitochondria", "Ribosome", "Chloroplast"]),
    correctAnswer: "1",
    explanation: "Mitochondria generate most of a cell’s energy by producing ATP through cellular respiration, earning them the nickname 'powerhouse of the cell.'"
  },
  // 14
  {
    level: "Tech",
    question: "Which company developed the Android operating system?",
    options: JSON.stringify(["Apple", "Google", "Microsoft", "IBM"]),
    correctAnswer: "1",
    explanation: "Android was initially founded by Android Inc., but Google acquired it in 2005 and turned it into the world’s most popular mobile OS, powering billions of devices globally."
  },
  // 15
  {
    level: "Hard",
    question: "Which is the smallest bone in the human body?",
    options: JSON.stringify(["Stapes", "Femur", "Tibia", "Ulna"]),
    correctAnswer: "0",
    explanation: "The stapes is a tiny stirrup-shaped bone in the middle ear. At around 3mm in length, it transmits sound vibrations to the inner ear, playing a critical role in hearing."
  },
  // 16
  {
    level: "GK",
    question: "What is the currency of Japan?",
    options: JSON.stringify(["Yen", "Dollar", "Won", "Peso"]),
    correctAnswer: "0",
    explanation: "The Japanese Yen (JPY) is one of the world’s most traded currencies, symbolizing Japan’s status as a global economic powerhouse."
  },
  // 17
  {
    level: "IPL",
    question: "Who was the captain of Gujarat Titans in their debut IPL season?",
    options: JSON.stringify(["Hardik Pandya", "Shubman Gill", "David Miller", "Kane Williamson"]),
    correctAnswer: "0",
    explanation: "Hardik Pandya led the Gujarat Titans in their debut season, guiding the franchise to their first IPL title in 2022."
  },
  // 18
  {
    level: "Science",
    question: "What planet is known as the 'Morning Star'?",
    options: JSON.stringify(["Mars", "Venus", "Jupiter", "Mercury"]),
    correctAnswer: "1",
    explanation: "Venus shines brightly and appears just before sunrise or after sunset, earning the nickname 'Morning Star' or 'Evening Star.'"
  },
  // 19
  {
    level: "Tech",
    question: "What does CPU stand for?",
    options: JSON.stringify(["Central Processing Unit", "Computer Personal Unit", "Core Processing Utility", "Central Print Unit"]),
    correctAnswer: "0",
    explanation: "The CPU, or Central Processing Unit, acts as the brain of the computer, executing instructions and managing tasks essential for device operation."
  },
  // 20
  {
    level: "Hard",
    question: "Which element has the highest melting point?",
    options: JSON.stringify(["Tungsten", "Iron", "Gold", "Platinum"]),
    correctAnswer: "0",
    explanation: "Tungsten has the highest melting point (3422°C) among all elements, making it invaluable for applications like light bulb filaments and rocket engine nozzles."
  },
  // 21
  {
    level: "GK",
    question: "Which country is known as the Land of the Rising Sun?",
    options: JSON.stringify(["China", "New Zealand", "Japan", "South Korea"]),
    correctAnswer: "2",
    explanation: "Japan is called the 'Land of the Rising Sun' because it lies to the east of the Asian continent, where the sun rises first."
  },
  // 22
  {
    level: "IPL",
    question: "Who hit the fastest fifty in IPL history?",
    options: JSON.stringify(["KL Rahul", "Chris Gayle", "Yusuf Pathan", "Pat Cummins"]),
    correctAnswer: "3",
    explanation: "Pat Cummins set the record for the fastest IPL fifty in 2022, scoring it in just 14 balls, combining raw power with aggressive intent."
  },
  // 23
  {
    level: "Science",
    question: "Which vitamin is produced in the human skin in sunlight?",
    options: JSON.stringify(["Vitamin A", "Vitamin B", "Vitamin D", "Vitamin K"]),
    correctAnswer: "2",
    explanation: "Vitamin D is synthesized in the skin when exposed to sunlight, essential for bone health, immune function, and calcium absorption."
  },
  // 24
  {
    level: "Tech",
    question: "Which programming language is known as the backbone of web development?",
    options: JSON.stringify(["Java", "Python", "JavaScript", "C++"]),
    correctAnswer: "2",
    explanation: "JavaScript is the core language of the web, powering dynamic content, interactivity, and the modern web ecosystem through frameworks and libraries."
  },
  // 25
  {
    level: "Hard",
    question: "Which Nobel Prize category did Albert Einstein win?",
    options: JSON.stringify(["Peace", "Literature", "Physics", "Chemistry"]),
    correctAnswer: "2",
    explanation: "Albert Einstein received the Nobel Prize in Physics in 1921 for his explanation of the photoelectric effect, which demonstrated the quantum nature of light."
  },
  // 26
  {
    level: "GK",
    question: "What is the largest desert in the world?",
    options: JSON.stringify(["Gobi", "Kalahari", "Sahara", "Antarctica"]),
    correctAnswer: "3",
    explanation: "Although commonly associated with sand, Antarctica is the largest desert due to its extremely low precipitation, making it a cold desert."
  },
  // 27
  {
    level: "IPL",
    question: "Who is known as 'Captain Cool' in IPL?",
    options: JSON.stringify(["Virat Kohli", "MS Dhoni", "Rohit Sharma", "Gautam Gambhir"]),
    correctAnswer: "1",
    explanation: "MS Dhoni, the legendary Chennai Super Kings captain, is nicknamed 'Captain Cool' for his calm demeanor under pressure and tactical brilliance."
  },
  // 28
  {
    level: "Science",
    question: "What is the main gas found in the air we breathe?",
    options: JSON.stringify(["Oxygen", "Hydrogen", "Nitrogen", "Carbon Dioxide"]),
    correctAnswer: "2",
    explanation: "Nitrogen makes up the majority of atmospheric air, ensuring stability and preventing the air from being explosively reactive."
  },
  // 29
  {
    level: "Tech",
    question: "What is the shortcut for 'Copy' on Windows?",
    options: JSON.stringify(["Ctrl+V", "Ctrl+C", "Ctrl+X", "Ctrl+Z"]),
    correctAnswer: "1",
    explanation: "Ctrl+C is the universally recognized shortcut for copying text, files, and other data in Windows and many other operating systems."
  },
  // 30
  {
    level: "Hard",
    question: "Who developed the theory of relativity?",
    options: JSON.stringify(["Isaac Newton", "Albert Einstein", "Nikola Tesla", "Galileo Galilei"]),
    correctAnswer: "1",
    explanation: "Albert Einstein revolutionized physics with his special and general theories of relativity, fundamentally altering our understanding of space, time, and gravity."
  },
  // 31
  {
    level: "GK",
    question: "Which is the longest river in the world?",
    options: JSON.stringify(["Nile", "Amazon", "Yangtze", "Mississippi"]),
    correctAnswer: "0",
    explanation: "The Nile River, flowing over 6,650 km through northeastern Africa, is traditionally considered the longest river, though some measurements put the Amazon slightly ahead."
  },
  // 32
  {
    level: "IPL",
    question: "Who was the first Indian player to score a century in IPL?",
    options: JSON.stringify(["Manish Pandey", "Virat Kohli", "Sachin Tendulkar", "Yusuf Pathan"]),
    correctAnswer: "0",
    explanation: "Manish Pandey became the first Indian to score an IPL century in 2009, showcasing the depth of Indian batting talent."
  },
  // 33
  {
    level: "Science",
    question: "What is the SI unit of force?",
    options: JSON.stringify(["Joule", "Newton", "Watt", "Pascal"]),
    correctAnswer: "1",
    explanation: "The Newton (N) is defined as the force needed to accelerate 1 kilogram of mass by 1 meter per second squared."
  },
  // 34
  {
    level: "Tech",
    question: "Who is the founder of Microsoft?",
    options: JSON.stringify(["Steve Jobs", "Bill Gates", "Larry Page", "Jeff Bezos"]),
    correctAnswer: "1",
    explanation: "Bill Gates, along with Paul Allen, co-founded Microsoft in 1975, transforming the personal computing industry."
  },
  // 35
  {
    level: "Hard",
    question: "Which planet has the most moons?",
    options: JSON.stringify(["Jupiter", "Saturn", "Neptune", "Uranus"]),
    correctAnswer: "1",
    explanation: "As of 2024, Saturn has overtaken Jupiter with 145 confirmed moons, thanks to discoveries from advanced telescopes and space probes."
  },
  // 36
  {
    level: "GK",
    question: "Which African country is famous for its pyramids?",
    options: JSON.stringify(["Sudan", "Egypt", "Morocco", "Ethiopia"]),
    correctAnswer: "1",
    explanation: "Egypt's ancient pyramids, especially at Giza, are iconic symbols of early civilization and architectural achievement."
  },
  // 37
  {
    level: "IPL",
    question: "Which player has the highest individual score in IPL history?",
    options: JSON.stringify(["Chris Gayle", "Virat Kohli", "Brendon McCullum", "KL Rahul"]),
    correctAnswer: "0",
    explanation: "Chris Gayle scored a record-breaking 175* runs in a single IPL innings, an explosive display of power hitting."
  },
  // 38
  {
    level: "Science",
    question: "What is the process by which plants make their food?",
    options: JSON.stringify(["Respiration", "Transpiration", "Photosynthesis", "Fermentation"]),
    correctAnswer: "2",
    explanation: "Photosynthesis is the process plants use to convert sunlight, carbon dioxide, and water into glucose and oxygen, sustaining life on Earth."
  },
  // 39
  {
    level: "Tech",
    question: "What company created the iPhone?",
    options: JSON.stringify(["Apple", "Samsung", "Google", "Nokia"]),
    correctAnswer: "0",
    explanation: "Apple Inc. launched the iPhone in 2007, revolutionizing the smartphone industry with its innovative touch interface and app ecosystem."
  },
  // 40
  {
    level: "Hard",
    question: "Which scientist is credited with discovering penicillin?",
    options: JSON.stringify(["Louis Pasteur", "Alexander Fleming", "Robert Koch", "Joseph Lister"]),
    correctAnswer: "1",
    explanation: "Alexander Fleming accidentally discovered penicillin in 1928, marking the birth of antibiotics and saving millions of lives."
  },
  // 41
  {
    level: "GK",
    question: "What is the capital city of Canada?",
    options: JSON.stringify(["Toronto", "Vancouver", "Ottawa", "Montreal"]),
    correctAnswer: "2",
    explanation: "Ottawa, located in Ontario, is the political center of Canada and home to its federal government."
  },
  // 42
  {
    level: "IPL",
    question: "Who is nicknamed 'The Hitman' in cricket?",
    options: JSON.stringify(["Virat Kohli", "Rohit Sharma", "MS Dhoni", "AB de Villiers"]),
    correctAnswer: "1",
    explanation: "Rohit Sharma, known for his impeccable timing and high scores, is fondly called 'The Hitman' by fans and teammates."
  },
  // 43
  {
    level: "Science",
    question: "Which organ in the human body is responsible for filtering blood?",
    options: JSON.stringify(["Liver", "Heart", "Kidneys", "Lungs"]),
    correctAnswer: "2",
    explanation: "The kidneys filter waste products and excess substances from the blood, maintaining the body’s fluid and electrolyte balance."
  },
  // 44
  {
    level: "Tech",
    question: "What does RAM stand for?",
    options: JSON.stringify(["Readily Accessible Memory", "Random Access Memory", "Rapid Application Manager", "Remote Access Module"]),
    correctAnswer: "1",
    explanation: "RAM (Random Access Memory) is the short-term memory of a computer, temporarily holding data for quick access by the processor."
  },
  // 45
  {
    level: "Hard",
    question: "Which ancient civilization built Machu Picchu?",
    options: JSON.stringify(["Aztec", "Inca", "Maya", "Olmec"]),
    correctAnswer: "1",
    explanation: "The Inca civilization constructed Machu Picchu in the 15th century atop the Andes, demonstrating advanced engineering and astronomical knowledge."
  },
  // 46
  {
    level: "GK",
    question: "Who wrote the play 'Romeo and Juliet'?",
    options: JSON.stringify(["William Wordsworth", "William Shakespeare", "Jane Austen", "Charles Dickens"]),
    correctAnswer: "1",
    explanation: "William Shakespeare's 'Romeo and Juliet' is a timeless tragedy about young love and family conflict, influencing countless works of art and literature."
  },
  // 47
  {
    level: "IPL",
    question: "Which player is known for the 'helicopter shot'?",
    options: JSON.stringify(["AB de Villiers", "MS Dhoni", "Virat Kohli", "Yuvraj Singh"]),
    correctAnswer: "1",
    explanation: "MS Dhoni revolutionized batting with the 'helicopter shot,' a unique flick using powerful wrists to send yorkers over the boundary."
  },
  // 48
  {
    level: "Science",
    question: "What is the hardest natural substance on Earth?",
    options: JSON.stringify(["Gold", "Iron", "Diamond", "Quartz"]),
    correctAnswer: "2",
    explanation: "Diamond, formed under extreme pressure and temperature, is the hardest known natural substance, widely used in cutting tools and jewelry."
  },
  // 49
  {
    level: "Tech",
    question: "Which search engine is owned by Microsoft?",
    options: JSON.stringify(["Bing", "Yahoo", "DuckDuckGo", "Google"]),
    correctAnswer: "0",
    explanation: "Bing is Microsoft’s search engine, launched in 2009, and integrates with the company’s suite of products like Edge and Windows."
  },
  // 50
  {
    level: "Hard",
    question: "Which Indian physicist won the Nobel Prize for the discovery of the Raman Effect?",
    options: JSON.stringify(["C.V. Raman", "Homi Bhabha", "S. Chandrasekhar", "Meghnad Saha"]),
    correctAnswer: "0",
    explanation: "C.V. Raman won the Nobel Prize in Physics in 1930 for discovering the Raman Effect, which explains how light scatters and changes wavelength when passing through a material."
  }
];

async function main() {
  console.log('Start seeding...');
  for (const q of questions) {
    const question = await prisma.question.create({
      data: q,
    });
    console.log(`Created question with id: ${question.id}`);
  }
  console.log('Seeding finished.');
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
