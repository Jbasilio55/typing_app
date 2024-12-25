const timer = document.getElementById("timer");
const tryAgainBtn = document.getElementById("try-again");
const finalScore = document.getElementById("final-score");
const textContainer = document.getElementById("text-container");
let totalTyped = "";
let errors = 0;
let timeLeft = 60;
let timerInterval;
let typingStarted = false;
let currCharIndex = 0;

async function getWords() {
  try {
    let words = [];
    const res = await fetch(
      "https://random-word-api.herokuapp.com/word?number=300"
    );

    if (!res.ok) {
      throw new Error("Could not fetch resource");
    }

    const data = await res.json();
    words = shuffleArray(data).join(" ");
    initializeApp(words);
    init();
  } catch (error) {
    console.log(error);
  }
}

function init() {
  if (isMobileDevice()) {
    showMobileMessage();
  } else {
    textContainer.innerText = longText;
    timerElement.textContent = `Time left: ${timeLeft}s`;
  }
}

// Detect if the device is mobile
function isMobileDevice() {
  return /Mobi|Android/i.test(navigator.userAgent) || window.innerWidth < 800;
}

// Show message for mobile users
function showMobileMessage() {
  textContainer.textContent =
    "This typing test is designed for desktop use only";
}

// Shuffle words in array
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

function startTimer() {
  if (!typingStarted) {
    typingStarted = true;
    timerInterval = setInterval(() => {
      timeLeft--;
      timer.textContent = `Time Left: ${timeLeft}s`;

      if (timeLeft <= 0) {
        clearInterval(timerInterval);
        endTest();
      }
    }, 1000);
  }
}

function endTest() {
  clearInterval(timerInterval);
  timer.textContent = "Time is up!";
  finalScore.textContent = `Final WPM: ${calculateWPM()}`;
  textContainer.style.display = "none";
  tryAgainBtn.style.display = "block";
}

function calculateWPM() {
  const wordsTyped = totalTyped.trim().split(/\s+/).length;
  const baseWPM = Math.round((wordsTyped / 60) * 60);
  const adjustedWPM = Math.max(baseWPM - errors, 0);
  return adjustedWPM;
}

function initializeApp(words) {
  totalTyped = "";
  errors = 0;
  currCharIndex = 0;
  textContainer.textContent = words;

  document.addEventListener("keydown", (e) => {
    if (e.key === "Backspace") {
      if (totalTyped.length > 0) {
        currCharIndex = Math.max(currCharIndex - 1, 0);
        totalTyped = totalTyped.slice(0, -1);
      }
    } else if (e.key.length === 1 && !e.ctrlKey && !e.metaKey) {
      totalTyped += e.key;
      currCharIndex++;
    }

    const textArray = words.split("");
    textContainer.innerText = "";
    errors = 0;

    for (let i = 0; i < textArray.length; i++) {
      const span = document.createElement("span");

      if (i < totalTyped.length) {
        if (totalTyped[i] === textArray[i]) {
          span.classList.add("correct");
        } else {
          span.classList.add("incorrect");
          errors++;
        }
      }

      span.textContent = textArray[i];
      textContainer.appendChild(span);
    }

    if (totalTyped.length >= 20) {
      const scrollAmount = (totalTyped.length - 20) * 14;
      textContainer.scrollLeft = scrollAmount;
    }

    startTimer();
  });
}

function resetTest() {
  clearInterval(timerInterval);
  timeLeft = 60;
  timer.textContent = `Time Left: ${timeLeft}s`;
  finalScore.textContent = "";
  textContainer.style.display = "block";
  tryAgainBtn.style.display = "none";
  totalTyped = "";
  typingStarted = false;
  currCharIndex = 0;
  errors = 0;
  textContainer.scrollLeft = 0;

  getWords();
}

tryAgainBtn.addEventListener("click", resetTest);

getWords();
