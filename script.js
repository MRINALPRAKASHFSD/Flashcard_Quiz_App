// 50 questions (as previously provided, with good explanations)
const questions = [
  // 1
  {
    level: "GK",
    question: "Who is the current Secretary-General of the United Nations (2024)?",
    options: ["António Guterres", "Ban Ki-moon", "Kofi Annan", "Boutros Boutros-Ghali"],
    answer: 0,
    explanation: "António Guterres, former Prime Minister of Portugal, took office as the ninth Secretary-General of the United Nations in 2017. He has prioritized issues like climate change, humanitarian crises, and global peace, aiming to make the UN more effective in addressing 21st-century challenges."
  },
  // 2
  {
    level: "IPL",
    question: "Who won the 'Orange Cap' in IPL 2023?",
    options: ["Faf du Plessis", "Virat Kohli", "Shubman Gill", "Jos Buttler"],
    answer: 2,
    explanation: "Shubman Gill clinched the Orange Cap in IPL 2023, scoring the highest runs in the tournament. His brilliant form and consistency showcased his maturity as a top-order batsman for Gujarat Titans."
  },
  // 3
  {
    level: "Science",
    question: "What is the chemical symbol for Gold?",
    options: ["Ag", "Au", "Gd", "Go"],
    answer: 1,
    explanation: "Gold's symbol 'Au' comes from its Latin name 'Aurum'. Gold has fascinated civilizations for millennia for its rarity, luster, and malleability, making it a standard for currency and jewelry."
  },
  // 4
  {
    level: "Tech",
    question: "Who is known as the 'Father of the Computer'?",
    options: ["Charles Babbage", "Alan Turing", "Bill Gates", "Ada Lovelace"],
    answer: 0,
    explanation: "Charles Babbage is called the 'Father of the Computer' for designing the first automatic mechanical computer, the Analytical Engine, in the 19th century. His work laid the groundwork for modern computers."
  },
  // 5
  {
    level: "Hard",
    question: "Which Indian mathematician solved the Riemann Hypothesis?",
    options: ["Srinivasa Ramanujan", "Manjul Bhargava", "No one yet", "C.R. Rao"],
    answer: 2,
    explanation: "Despite being one of the most famous unsolved problems in mathematics, the Riemann Hypothesis remains unproven as of 2024. It concerns the distribution of prime numbers and has profound implications in number theory."
  },
  // 6
  {
    level: "GK",
    question: "Who was the first woman to win a Nobel Prize?",
    options: ["Marie Curie", "Mother Teresa", "Dorothy Hodgkin", "Rosalind Franklin"],
    answer: 0,
    explanation: "Marie Curie won the Nobel Prize in Physics in 1903 for her pioneering research on radioactivity, becoming the first woman to win a Nobel and the only person to win in two scientific fields (Physics and Chemistry)."
  },
  // 7
  {
    level: "IPL",
    question: "Which team has won the most IPL titles as of 2024?",
    options: ["Chennai Super Kings", "Mumbai Indians", "Kolkata Knight Riders", "Royal Challengers Bangalore"],
    answer: 1,
    explanation: "Mumbai Indians have clinched the IPL trophy five times, demonstrating remarkable consistency and depth in their squad, especially under the leadership of Rohit Sharma."
  },
  // 8
  {
    level: "Science",
    question: "Which gas is most abundant in the Earth's atmosphere?",
    options: ["Oxygen", "Nitrogen", "Carbon Dioxide", "Argon"],
    answer: 1,
    explanation: "Nitrogen makes up about 78% of Earth's atmosphere. Its inert nature helps stabilize the air, while oxygen (21%) is essential for most life forms."
  },
  // 9
  {
    level: "Tech",
    question: "What does 'HTTP' stand for?",
    options: ["HyperText Transmission Protocol", "HyperText Transfer Protocol", "HighText Transfer Protocol", "HyperTransfer Text Protocol"],
    answer: 1,
    explanation: "HTTP, or HyperText Transfer Protocol, is the foundational protocol used for transmitting web pages on the Internet. It defines how messages are formatted and transmitted between clients and servers."
  },
  // 10
  {
    level: "Hard",
    question: "What is the value of Planck’s constant (h) in Js (rounded to 6 decimals)?",
    options: ["6.626070", "3.141592", "9.806650", "1.602176"],
    answer: 0,
    explanation: "Planck's constant (6.626070 x 10⁻³⁴ Js) is a fundamental constant in quantum mechanics, relating the energy of a photon to its frequency. It's crucial in the calculation of energy levels in atoms."
  },
  // 11
  {
    level: "GK",
    question: "Who was the first President of independent India?",
    options: ["Rajendra Prasad", "S. Radhakrishnan", "Jawaharlal Nehru", "V.V. Giri"],
    answer: 0,
    explanation: "Dr. Rajendra Prasad served as the first President of India from 1950 to 1962, playing a vital role in shaping the newly independent nation’s constitutional framework."
  },
  // 12
  {
    level: "IPL",
    question: "Which bowler has the most wickets in IPL history (till 2024)?",
    options: ["Lasith Malinga", "Yuzvendra Chahal", "Dwayne Bravo", "Jasprit Bumrah"],
    answer: 1,
    explanation: "Yuzvendra Chahal surpassed legends like Malinga and Bravo to become the IPL’s leading wicket-taker, known for his clever leg-spin and crucial breakthroughs."
  },
  // 13
  {
    level: "Science",
    question: "What is the powerhouse of the cell?",
    options: ["Nucleus", "Mitochondria", "Ribosome", "Chloroplast"],
    answer: 1,
    explanation: "Mitochondria generate most of a cell’s energy by producing ATP through cellular respiration, earning them the nickname 'powerhouse of the cell.'"
  },
  // 14
  {
    level: "Tech",
    question: "Which company developed the Android operating system?",
    options: ["Apple", "Google", "Microsoft", "IBM"],
    answer: 1,
    explanation: "Android was initially founded by Android Inc., but Google acquired it in 2005 and turned it into the world’s most popular mobile OS, powering billions of devices globally."
  },
  // 15
  {
    level: "Hard",
    question: "Which is the smallest bone in the human body?",
    options: ["Stapes", "Femur", "Tibia", "Ulna"],
    answer: 0,
    explanation: "The stapes is a tiny stirrup-shaped bone in the middle ear. At around 3mm in length, it transmits sound vibrations to the inner ear, playing a critical role in hearing."
  },
  // 16
  {
    level: "GK",
    question: "What is the currency of Japan?",
    options: ["Yen", "Dollar", "Won", "Peso"],
    answer: 0,
    explanation: "The Japanese Yen (JPY) is one of the world’s most traded currencies, symbolizing Japan’s status as a global economic powerhouse."
  },
  // 17
  {
    level: "IPL",
    question: "Who was the captain of Gujarat Titans in their debut IPL season?",
    options: ["Hardik Pandya", "Shubman Gill", "David Miller", "Kane Williamson"],
    answer: 0,
    explanation: "Hardik Pandya led the Gujarat Titans in their debut season, guiding the franchise to their first IPL title in 2022."
  },
  // 18
  {
    level: "Science",
    question: "What planet is known as the 'Morning Star'?",
    options: ["Mars", "Venus", "Jupiter", "Mercury"],
    answer: 1,
    explanation: "Venus shines brightly and appears just before sunrise or after sunset, earning the nickname 'Morning Star' or 'Evening Star.'"
  },
  // 19
  {
    level: "Tech",
    question: "What does CPU stand for?",
    options: ["Central Processing Unit", "Computer Personal Unit", "Core Processing Utility", "Central Print Unit"],
    answer: 0,
    explanation: "The CPU, or Central Processing Unit, acts as the brain of the computer, executing instructions and managing tasks essential for device operation."
  },
  // 20
  {
    level: "Hard",
    question: "Which element has the highest melting point?",
    options: ["Tungsten", "Iron", "Gold", "Platinum"],
    answer: 0,
    explanation: "Tungsten has the highest melting point (3422°C) among all elements, making it invaluable for applications like light bulb filaments and rocket engine nozzles."
  },
  // 21
  {
    level: "GK",
    question: "Which country is known as the Land of the Rising Sun?",
    options: ["China", "New Zealand", "Japan", "South Korea"],
    answer: 2,
    explanation: "Japan is called the 'Land of the Rising Sun' because it lies to the east of the Asian continent, where the sun rises first."
  },
  // 22
  {
    level: "IPL",
    question: "Who hit the fastest fifty in IPL history?",
    options: ["KL Rahul", "Chris Gayle", "Yusuf Pathan", "Pat Cummins"],
    answer: 3,
    explanation: "Pat Cummins set the record for the fastest IPL fifty in 2022, scoring it in just 14 balls, combining raw power with aggressive intent."
  },
  // 23
  {
    level: "Science",
    question: "Which vitamin is produced in the human skin in sunlight?",
    options: ["Vitamin A", "Vitamin B", "Vitamin D", "Vitamin K"],
    answer: 2,
    explanation: "Vitamin D is synthesized in the skin when exposed to sunlight, essential for bone health, immune function, and calcium absorption."
  },
  // 24
  {
    level: "Tech",
    question: "Which programming language is known as the backbone of web development?",
    options: ["Java", "Python", "JavaScript", "C++"],
    answer: 2,
    explanation: "JavaScript is the core language of the web, powering dynamic content, interactivity, and the modern web ecosystem through frameworks and libraries."
  },
  // 25
  {
    level: "Hard",
    question: "Which Nobel Prize category did Albert Einstein win?",
    options: ["Peace", "Literature", "Physics", "Chemistry"],
    answer: 2,
    explanation: "Albert Einstein received the Nobel Prize in Physics in 1921 for his explanation of the photoelectric effect, which demonstrated the quantum nature of light."
  },
  // 26
  {
    level: "GK",
    question: "What is the largest desert in the world?",
    options: ["Gobi", "Kalahari", "Sahara", "Antarctica"],
    answer: 3,
    explanation: "Although commonly associated with sand, Antarctica is the largest desert due to its extremely low precipitation, making it a cold desert."
  },
  // 27
  {
    level: "IPL",
    question: "Who is known as 'Captain Cool' in IPL?",
    options: ["Virat Kohli", "MS Dhoni", "Rohit Sharma", "Gautam Gambhir"],
    answer: 1,
    explanation: "MS Dhoni, the legendary Chennai Super Kings captain, is nicknamed 'Captain Cool' for his calm demeanor under pressure and tactical brilliance."
  },
  // 28
  {
    level: "Science",
    question: "What is the main gas found in the air we breathe?",
    options: ["Oxygen", "Hydrogen", "Nitrogen", "Carbon Dioxide"],
    answer: 2,
    explanation: "Nitrogen makes up the majority of atmospheric air, ensuring stability and preventing the air from being explosively reactive."
  },
  // 29
  {
    level: "Tech",
    question: "What is the shortcut for 'Copy' on Windows?",
    options: ["Ctrl+V", "Ctrl+C", "Ctrl+X", "Ctrl+Z"],
    answer: 1,
    explanation: "Ctrl+C is the universally recognized shortcut for copying text, files, and other data in Windows and many other operating systems."
  },
  // 30
  {
    level: "Hard",
    question: "Who developed the theory of relativity?",
    options: ["Isaac Newton", "Albert Einstein", "Nikola Tesla", "Galileo Galilei"],
    answer: 1,
    explanation: "Albert Einstein revolutionized physics with his special and general theories of relativity, fundamentally altering our understanding of space, time, and gravity."
  },
  // 31
  {
    level: "GK",
    question: "Which is the longest river in the world?",
    options: ["Nile", "Amazon", "Yangtze", "Mississippi"],
    answer: 0,
    explanation: "The Nile River, flowing over 6,650 km through northeastern Africa, is traditionally considered the longest river, though some measurements put the Amazon slightly ahead."
  },
  // 32
  {
    level: "IPL",
    question: "Who was the first Indian player to score a century in IPL?",
    options: ["Manish Pandey", "Virat Kohli", "Sachin Tendulkar", "Yusuf Pathan"],
    answer: 0,
    explanation: "Manish Pandey became the first Indian to score an IPL century in 2009, showcasing the depth of Indian batting talent."
  },
  // 33
  {
    level: "Science",
    question: "What is the SI unit of force?",
    options: ["Joule", "Newton", "Watt", "Pascal"],
    answer: 1,
    explanation: "The Newton (N) is defined as the force needed to accelerate 1 kilogram of mass by 1 meter per second squared."
  },
  // 34
  {
    level: "Tech",
    question: "Who is the founder of Microsoft?",
    options: ["Steve Jobs", "Bill Gates", "Larry Page", "Jeff Bezos"],
    answer: 1,
    explanation: "Bill Gates, along with Paul Allen, co-founded Microsoft in 1975, transforming the personal computing industry."
  },
  // 35
  {
    level: "Hard",
    question: "Which planet has the most moons?",
    options: ["Jupiter", "Saturn", "Neptune", "Uranus"],
    answer: 1,
    explanation: "As of 2024, Saturn has overtaken Jupiter with 145 confirmed moons, thanks to discoveries from advanced telescopes and space probes."
  },
  // 36
  {
    level: "GK",
    question: "Which African country is famous for its pyramids?",
    options: ["Sudan", "Egypt", "Morocco", "Ethiopia"],
    answer: 1,
    explanation: "Egypt's ancient pyramids, especially at Giza, are iconic symbols of early civilization and architectural achievement."
  },
  // 37
  {
    level: "IPL",
    question: "Which player has the highest individual score in IPL history?",
    options: ["Chris Gayle", "Virat Kohli", "Brendon McCullum", "KL Rahul"],
    answer: 0,
    explanation: "Chris Gayle scored a record-breaking 175* runs in a single IPL innings, an explosive display of power hitting."
  },
  // 38
  {
    level: "Science",
    question: "What is the process by which plants make their food?",
    options: ["Respiration", "Transpiration", "Photosynthesis", "Fermentation"],
    answer: 2,
    explanation: "Photosynthesis is the process plants use to convert sunlight, carbon dioxide, and water into glucose and oxygen, sustaining life on Earth."
  },
  // 39
  {
    level: "Tech",
    question: "What company created the iPhone?",
    options: ["Apple", "Samsung", "Google", "Nokia"],
    answer: 0,
    explanation: "Apple Inc. launched the iPhone in 2007, revolutionizing the smartphone industry with its innovative touch interface and app ecosystem."
  },
  // 40
  {
    level: "Hard",
    question: "Which scientist is credited with discovering penicillin?",
    options: ["Louis Pasteur", "Alexander Fleming", "Robert Koch", "Joseph Lister"],
    answer: 1,
    explanation: "Alexander Fleming accidentally discovered penicillin in 1928, marking the birth of antibiotics and saving millions of lives."
  },
  // 41
  {
    level: "GK",
    question: "What is the capital city of Canada?",
    options: ["Toronto", "Vancouver", "Ottawa", "Montreal"],
    answer: 2,
    explanation: "Ottawa, located in Ontario, is the political center of Canada and home to its federal government."
  },
  // 42
  {
    level: "IPL",
    question: "Who is nicknamed 'The Hitman' in cricket?",
    options: ["Virat Kohli", "Rohit Sharma", "MS Dhoni", "AB de Villiers"],
    answer: 1,
    explanation: "Rohit Sharma, known for his impeccable timing and high scores, is fondly called 'The Hitman' by fans and teammates."
  },
  // 43
  {
    level: "Science",
    question: "Which organ in the human body is responsible for filtering blood?",
    options: ["Liver", "Heart", "Kidneys", "Lungs"],
    answer: 2,
    explanation: "The kidneys filter waste products and excess substances from the blood, maintaining the body’s fluid and electrolyte balance."
  },
  // 44
  {
    level: "Tech",
    question: "What does RAM stand for?",
    options: ["Readily Accessible Memory", "Random Access Memory", "Rapid Application Manager", "Remote Access Module"],
    answer: 1,
    explanation: "RAM (Random Access Memory) is the short-term memory of a computer, temporarily holding data for quick access by the processor."
  },
  // 45
  {
    level: "Hard",
    question: "Which ancient civilization built Machu Picchu?",
    options: ["Aztec", "Inca", "Maya", "Olmec"],
    answer: 1,
    explanation: "The Inca civilization constructed Machu Picchu in the 15th century atop the Andes, demonstrating advanced engineering and astronomical knowledge."
  },
  // 46
  {
    level: "GK",
    question: "Who wrote the play 'Romeo and Juliet'?",
    options: ["William Wordsworth", "William Shakespeare", "Jane Austen", "Charles Dickens"],
    answer: 1,
    explanation: "William Shakespeare's 'Romeo and Juliet' is a timeless tragedy about young love and family conflict, influencing countless works of art and literature."
  },
  // 47
  {
    level: "IPL",
    question: "Which player is known for the 'helicopter shot'?",
    options: ["AB de Villiers", "MS Dhoni", "Virat Kohli", "Yuvraj Singh"],
    answer: 1,
    explanation: "MS Dhoni revolutionized batting with the 'helicopter shot,' a unique flick using powerful wrists to send yorkers over the boundary."
  },
  // 48
  {
    level: "Science",
    question: "What is the hardest natural substance on Earth?",
    options: ["Gold", "Iron", "Diamond", "Quartz"],
    answer: 2,
    explanation: "Diamond, formed under extreme pressure and temperature, is the hardest known natural substance, widely used in cutting tools and jewelry."
  },
  // 49
  {
    level: "Tech",
    question: "Which search engine is owned by Microsoft?",
    options: ["Bing", "Yahoo", "DuckDuckGo", "Google"],
    answer: 0,
    explanation: "Bing is Microsoft’s search engine, launched in 2009, and integrates with the company’s suite of products like Edge and Windows."
  },
  // 50
  {
    level: "Hard",
    question: "Which Indian physicist won the Nobel Prize for the discovery of the Raman Effect?",
    options: ["C.V. Raman", "Homi Bhabha", "S. Chandrasekhar", "Meghnad Saha"],
    answer: 0,
    explanation: "C.V. Raman won the Nobel Prize in Physics in 1930 for discovering the Raman Effect, which explains how light scatters and changes wavelength when passing through a material."
  }
];

let current = 0;
let score = 0;
let state = "idle"; // idle, answered, flipped
let profile = { name: "", dob: "", hobbies: "" };

let timer = null;
let timeLeft = 15;

const questionText = document.getElementById("questionText");
const optionsRow = document.getElementById("optionsRow");
const showBtn = document.getElementById("showBtn");
const flipBtn = document.getElementById("flipBtn");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");
const cardStatus = document.getElementById("cardStatus");
const feedback = document.getElementById("feedback");
const levelBadge = document.getElementById("levelBadge");
const cardInner = document.getElementById("cardInner");
const backAnswer = document.getElementById("backAnswer");
const backExplanation = document.getElementById("backExplanation");
const flipBackBtn = document.getElementById("flipBackBtn");
const quizCard = document.getElementById("quizCard");
const fullscreenFeedback = document.getElementById("fullscreenFeedback");
const profileBar = document.getElementById("profileBar");
const timerBar = document.getElementById("timerBar");
const timerText = document.getElementById("timerText");

const soundCorrect = document.getElementById("sound-correct");
const soundWrong = document.getElementById("sound-wrong");
const soundTimeup = document.getElementById("sound-timeup");

// Universe background stars and comets (as before)
(function() {
  const starCount = 65;
  const svg = document.getElementById('universeSVG');
  const starsGroup = document.getElementById('stars');
  const cometsGroup = document.getElementById('comets');

  for (let i = 0; i < starCount; i++) {
    const star = document.createElementNS('http://www.w3.org/2000/svg','circle');
    star.setAttribute('cx', Math.random()*100 + '%');
    star.setAttribute('cy', Math.random()*100 + '%');
    star.setAttribute('r', Math.random()*1.7 + 0.7);
    star.setAttribute('class', 'star');
    star.style.animationDelay = (Math.random()*2) + 's';
    starsGroup.appendChild(star);
  }
  for (let i = 0; i < 3; i++) {
    const comet = document.createElementNS('http://www.w3.org/2000/svg','line');
    const y = Math.random()*80+10;
    comet.setAttribute('x1', '-10');
    comet.setAttribute('y1', y);
    comet.setAttribute('x2', '40');
    comet.setAttribute('y2', y+7);
    comet.setAttribute('class', 'comet');
    comet.style.animationDelay = (i*2+Math.random()) + 's';
    cometsGroup.appendChild(comet);
  }
})();

// Profile Modal Logic
function showProfileModal() {
  document.getElementById("profileModal").style.display = "flex";
}
function hideProfileModal() {
  document.getElementById("profileModal").style.display = "none";
}
document.getElementById("profileForm").onsubmit = function(e) {
  e.preventDefault();
  profile.name = document.getElementById("userName").value.trim();
  profile.dob = document.getElementById("userDob").value;
  profile.hobbies = document.getElementById("userHobbies").value.trim();
  hideProfileModal();
  renderProfileBar();
  renderCard();
};
function renderProfileBar() {
  profileBar.innerHTML = `
    <div class="profile-info">
      <i class="fa-solid fa-user"></i> <b>${profile.name}</b>
      <span style="margin-left:12px;"><i class="fa-solid fa-cake-candles"></i> ${profile.dob}</span>
      <span style="margin-left:12px;"><i class="fa-solid fa-heart"></i> ${profile.hobbies}</span>
    </div>
    <div class="profile-score" id="scoreDisplay">
      Score: ${score}
    </div>
  `;
}

// Card transition as before
function transitionCard(direction, callback) {
  quizCard.classList.remove("slide-left", "slide-right", "slide-in-left", "slide-in-right");
  void quizCard.offsetWidth;
  quizCard.classList.add(direction === "left" ? "slide-left" : "slide-right");
  setTimeout(() => {
    if (callback) callback();
    quizCard.classList.remove("slide-left", "slide-right");
    quizCard.classList.add(direction === "left" ? "slide-in-right" : "slide-in-left");
    setTimeout(() => {
      quizCard.classList.remove("slide-in-left", "slide-in-right");
    }, 450);
  }, 450);
}

function renderCard(transition) {
  if (transition === "left" || transition === "right") {
    transitionCard(transition, drawCard);
  } else {
    drawCard();
  }
}

function drawCard() {
  const q = questions[current];
  state = "idle";
  cardInner.classList.remove("flipped");

  // Update score in profile bar
  renderProfileBar();

  questionText.textContent = q.question;
  levelBadge.textContent = q.level;
  optionsRow.innerHTML = "";
  q.options.forEach((opt, idx) => {
    const btn = document.createElement("button");
    btn.className = "option-btn";
    btn.textContent = opt;
    btn.onclick = () => selectOption(idx, btn);
    btn.disabled = false;
    optionsRow.appendChild(btn);
  });

  showBtn.disabled = false;
  flipBtn.disabled = false;
  prevBtn.disabled = current === 0;
  nextBtn.disabled = current === questions.length - 1;
  cardStatus.textContent = `Card ${current+1} of ${questions.length}`;
  feedback.textContent = "";
  feedback.className = "feedback";

  startTimer();
}

// Timer logic
function startTimer() {
  clearInterval(timer);
  timeLeft = 15;
  updateTimerUI();
  timer = setInterval(() => {
    timeLeft--;
    updateTimerUI();
    if (timeLeft <= 0) {
      clearInterval(timer);
      timer = null;
      autoFailTimeout();
    }
  }, 1000);
}
function stopTimer() {
  clearInterval(timer);
  timer = null;
}
function updateTimerUI() {
  timerBar.style.width = ((timeLeft / 15) * 100) + '%';
  timerText.textContent = timeLeft;
  if (timeLeft <= 5) {
    timerBar.style.background = 'linear-gradient(90deg, #ff6961 0%, #ffb347 100%)';
    timerText.style.color = '#ff6961';
  } else {
    timerBar.style.background = 'linear-gradient(90deg, #ffb347 0%, #ff6961 100%)';
    timerText.style.color = '#ffb347';
  }
}

function autoFailTimeout() {
  // Disable options
  Array.from(optionsRow.children).forEach((b) => b.disabled = true);
  feedback.textContent = '⏰ Time\'s up!';
  feedback.className = "feedback incorrect";
  showFullscreenFeedback(false, true);
  playSound('timeup');
  score -= 1;
  if (score < 0) score = 0;
  renderProfileBar();
  state = "answered";
  setTimeout(() => {
    if (current < questions.length - 1) {
      current++;
      renderCard("right");
    }
  }, 1200);
}

function selectOption(idx, btn) {
  if (state !== "idle") return;
  stopTimer();
  const q = questions[current];
  const correct = idx === q.answer;
  Array.from(optionsRow.children).forEach((b, i) => {
    b.classList.remove("selected");
    if (i === q.answer) {
      b.classList.add("correct");
    }
    if (i === idx && !correct) {
      b.classList.add("incorrect");
    }
    b.disabled = true;
  });
  btn.classList.add("selected");
  if (correct) {
    feedback.textContent = "🎉 Correct! 🎉";
    feedback.className = "feedback correct";
    playSound('correct');
    showFullscreenFeedback(true);
    score += 4;
  } else {
    feedback.textContent = `❌ Incorrect!`;
    feedback.className = "feedback incorrect";
    playSound('wrong');
    showFullscreenFeedback(false);
    score -= 1;
    if (score < 0) score = 0;
  }
  renderProfileBar();
  state = "answered";
}

showBtn.onclick = () => { if (state === "flipped") return; stopTimer(); doFlip(); };
flipBtn.onclick = () => { if (state === "flipped") return; stopTimer(); doFlip(); };
function doFlip() {
  const q = questions[current];
  cardInner.classList.add("flipped");
  backAnswer.textContent = q.options[q.answer];
  backExplanation.textContent = q.explanation || "";
  state = "flipped";
}
flipBackBtn.onclick = () => {
  cardInner.classList.remove("flipped");
  state = "answered";
};
prevBtn.onclick = () => {
  stopTimer();
  if (current > 0) {
    current--;
    renderCard("left");
  }
};
nextBtn.onclick = () => {
  stopTimer();
  if (current < questions.length - 1) {
    current++;
    renderCard("right");
  } else if (current === questions.length - 1) {
    fullscreenFeedback.innerHTML = `
      <div class="feedback-content">
        Quiz Complete!<br/>
        <span style="font-size:2rem;">Your Score: ${score}</span>
        <div style="margin-top:16px;font-size:1.05rem;">Profile:<br>
        <b>${profile.name}</b> | DOB: ${profile.dob} | Hobbies: ${profile.hobbies}</div>
        <br/><button onclick="window.location.reload()" style="margin-top:18px;font-size:1.1rem;padding:10px 30px;border-radius:10px;background:#6bc4fa;color:#fff;border:none;">Restart</button>
      </div>
    `;
    fullscreenFeedback.classList.add("active");
  }
};

function showFullscreenFeedback(correct, timeout) {
  fullscreenFeedback.innerHTML = `
    <div class="feedback-content${correct ? "" : " incorrect"}">
      ${timeout ? "⏰ Time's up!" : (correct ? "🎉 Correct! 🎉" : "❌ Incorrect! ❌")}
    </div>
  `;
  fullscreenFeedback.classList.add("active");
  setTimeout(() => {
    fullscreenFeedback.classList.remove("active");
  }, 1050);
}

function playSound(which) {
  if (which === 'correct') soundCorrect.play();
  if (which === 'wrong') soundWrong.play();
  if (which === 'timeup') soundTimeup.play();
}

prevBtn.addEventListener("keydown", e => { if (e.key === "Enter") prevBtn.click(); });
nextBtn.addEventListener("keydown", e => { if (e.key === "Enter") nextBtn.click(); });

// Start with profile modal
window.onload = () => {
  showProfileModal();
};